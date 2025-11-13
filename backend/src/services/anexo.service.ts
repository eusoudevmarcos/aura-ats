// src/services/anexo.service.ts
import { Anexo, CandidatoAnexo } from "@prisma/client";
import path from "path";
import { injectable } from "tsyringe";
import prisma from "../lib/prisma";
import { FileService, UploadedFile } from "./file.service";

@injectable()
export class AnexoService {
  private readonly CANDIDATO_FILES_DIR = path.resolve(
    __dirname,
    "../public/files/candidatos"
  );

  /**
   * Cria um anexo no banco de dados e salva o arquivo fisicamente
   */
  async createAnexo(
    file: UploadedFile,
    candidatoId: string
  ): Promise<{ anexo: Anexo; candidatoAnexo: CandidatoAnexo }> {
    // Gera um nome único para o arquivo
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 9);
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    const uniqueFileName = `${baseName}_${timestamp}_${randomStr}${fileExtension}`;

    // Cria uma cópia do arquivo com nome único
    const fileWithUniqueName: UploadedFile = {
      ...file,
      originalname: uniqueFileName,
    };

    // Salva o arquivo fisicamente
    const { fileName } = await FileService.createFile(
      fileWithUniqueName,
      this.CANDIDATO_FILES_DIR
    );

    // Cria a URL do arquivo
    const fileUrl = `/files/candidatos/${fileName}`;

    // Salva no banco de dados
    const result = await prisma.$transaction(async (tx) => {
      // Cria o anexo
      const anexo = await tx.anexo.create({
        data: {
          nomeArquivo: file.originalname,
          url: fileUrl,
          tipo: file.type,
          tamanhoKb: file.size ? Math.round(file.size / 1024) : null,
        },
      });

      // Cria a relação entre candidato e anexo
      const candidatoAnexo = await tx.candidatoAnexo.create({
        data: {
          candidatoId,
          anexoId: anexo.id,
        },
      });

      return { anexo, candidatoAnexo };
    });

    return result;
  }

  /**
   * Cria múltiplos anexos para um candidato
   */
  async createMultipleAnexos(
    files: UploadedFile[],
    candidatoId: string
  ): Promise<{ anexo: Anexo; candidatoAnexo: CandidatoAnexo }[]> {
    const results = await Promise.all(
      files.map((file) => this.createAnexo(file, candidatoId))
    );
    return results;
  }

  /**
   * Busca todos os anexos de um candidato
   */
  async getAnexosByCandidatoId(candidatoId: string): Promise<Anexo[]> {
    const candidatoAnexos = await prisma.candidatoAnexo.findMany({
      where: { candidatoId },
      include: { anexo: true },
    });

    return candidatoAnexos.map((ca) => ca.anexo);
  }

  /**
   * Busca um anexo por ID
   */
  async getAnexoById(anexoId: string): Promise<Anexo | null> {
    return await prisma.anexo.findUnique({
      where: { id: anexoId },
    });
  }

  /**
   * Deleta um anexo do banco e fisicamente
   */
  async deleteAnexo(anexoId: string, candidatoId: string): Promise<void> {
    const anexo = await prisma.anexo.findUnique({
      where: { id: anexoId },
    });

    if (!anexo) {
      throw new Error("Anexo não encontrado");
    }

    await prisma.$transaction(async (tx) => {
      // Remove a relação
      await tx.candidatoAnexo.delete({
        where: {
          candidatoId_anexoId: {
            candidatoId,
            anexoId,
          },
        },
      });

      // Verifica se o anexo está sendo usado por outras entidades
      const [vagaAnexos, candidatoAnexos] = await Promise.all([
        tx.vagaAnexo.findMany({ where: { anexoId } }),
        tx.candidatoAnexo.findMany({ where: { anexoId } }),
      ]);

      // Se não estiver sendo usado, deleta o anexo e o arquivo
      if (vagaAnexos.length === 0 && candidatoAnexos.length === 0) {
        await tx.anexo.delete({ where: { id: anexoId } });

        // Extrai o nome do arquivo da URL
        const fileName = path.basename(anexo.url);
        await FileService.deleteFile(fileName, this.CANDIDATO_FILES_DIR);
      }
    });
  }

  /**
   * Deleta todos os anexos de um candidato
   */
  async deleteAllAnexosByCandidatoId(candidatoId: string): Promise<void> {
    const candidatoAnexos = await prisma.candidatoAnexo.findMany({
      where: { candidatoId },
      include: { anexo: true },
    });

    await Promise.all(
      candidatoAnexos.map((ca) => this.deleteAnexo(ca.anexoId, candidatoId))
    );
  }

  /**
   * Busca o caminho do arquivo para download
   */
  async getFilePathForDownload(anexoId: string): Promise<string> {
    const anexo = await prisma.anexo.findUnique({
      where: { id: anexoId },
    });

    if (!anexo) {
      throw new Error("Anexo não encontrado");
    }

    // Extrai o nome do arquivo da URL
    const fileName = path.basename(anexo.url);
    const filePath = path.join(this.CANDIDATO_FILES_DIR, fileName);

    if (!require("fs").existsSync(filePath)) {
      throw new Error("Arquivo não encontrado no sistema de arquivos");
    }

    return filePath;
  }
}
