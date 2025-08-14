// src/repository/empresa.repository.ts
// ... (imports existentes)
import {
  Contato,
  Empresa,
  Localizacao,
  Pessoa,
  TipoSocio,
} from "@prisma/client";
import {
  PessoaRepository,
  PessoaCreateInput,
  PessoaUpdateInput,
} from "./pessoa.repository"; // Importe os novos tipos e o repo
import { ContatoCreateOrConnect } from "./contato.repository";
import { LocalizacaoCreateOrConnect } from "./localizacao.repository";
import { inject, injectable } from "tsyringe";
import { splitCreateConnect } from "../utils/splitCreateConnect";
import prisma from "../lib/prisma";

type PessoaCreateOrConnectOrUpdateForRepresentante =
  | PessoaCreateInput
  | PessoaUpdateInput
  | { id: string };

type EmpresaCreateInput = Omit<Empresa, "id" | "createdAt" | "updatedAt"> & {
  contatos?: {
    create?: ContatoCreateOrConnect[];
    connect?: Pick<Contato, "id">[];
  };
  localizacoes?: {
    create?: LocalizacaoCreateOrConnect[];
    connect?: Pick<Localizacao, "id">[];
  };
  representantes?: {
    create?: Omit<PessoaCreateInput, "id">[];
    connect?: Pick<Pessoa, "id">[];
  };
  socios?: {
    create?: {
      tipoSocio: TipoSocio;
      pessoa: {
        create?: PessoaCreateInput;
        connect?: Pick<Pessoa, "id">;
      };
    }[];
  };
};

export type EmpresaUpdateInput = Partial<
  Omit<Empresa, "id" | "createdAt" | "updatedAt">
> & {
  id: string;
  contatos?: {
    create?: ContatoCreateOrConnect[];
    connect?: Pick<Contato, "id">[];
    update?: { where: Pick<Contato, "id">; data: Partial<Contato> }[];
  };
  localizacoes?: {
    create?: LocalizacaoCreateOrConnect[];
    connect?: Pick<Localizacao, "id">[];
    update?: { where: Pick<Localizacao, "id">; data: Partial<Localizacao> }[];
  };

  representantes?: {
    create?: Omit<PessoaCreateInput, "id">[];
    connect?: Pick<Pessoa, "id">[];
    set?: Pick<Pessoa, "id">[];
  };
  socios?: {
    create?: {
      tipoSocio: TipoSocio;
      pessoa: {
        create?: PessoaCreateInput;
        connect?: Pick<Pessoa, "id">;
      };
    }[];
  };
};

@injectable()
export class EmpresaRepository {
  constructor(
    @inject(PessoaRepository) private pessoaRepository: PessoaRepository
  ) {}

  get(empresaData: any): EmpresaCreateInput | EmpresaUpdateInput {
    const baseData: any = {
      // Usar 'any' temporariamente para a complexidade da tipagem aninhada
      razaoSocial: empresaData.razaoSocial,
      cnpj: empresaData.cnpj,
      dataAbertura: empresaData.dataAbertura
        ? new Date(empresaData.dataAbertura)
        : null,
      contatos: splitCreateConnect(empresaData.contatos),
      localizacoes: splitCreateConnect(empresaData.localizacoes),
      // Representantes e Sócios serão processados na função 'save'
    };

    if (empresaData.id) {
      return { id: empresaData.id, ...baseData } as EmpresaUpdateInput;
    }
    return baseData as EmpresaCreateInput;
  }

  async save(empresaData: any): Promise<Empresa> {
    const isUpdate = !!empresaData.id;

    // Processar Representantes
    const representantesPayload: any[] = [];
    if (empresaData.representante && empresaData.representante.length > 0) {
      for (const rep of empresaData.representante) {
        const savedPessoa = await this.pessoaRepository.save(rep); // Salva/atualiza a pessoa
        representantesPayload.push({ id: savedPessoa.id }); // Adiciona para conexão
      }
    }

    // Processar Sócios (similar ao representante, se aplicável)
    const sociosPayload: any[] = [];
    if (empresaData.socios && empresaData.socios.length > 0) {
      for (const socio of empresaData.socios) {
        const savedPessoa = await this.pessoaRepository.save(socio.pessoa); // Salva/atualiza a pessoa do sócio
        sociosPayload.push({
          tipoSocio: socio.tipoSocio,
          pessoa: { connect: { id: savedPessoa.id } },
        });
      }
    }

    const dataToSave = this.get(empresaData); // Pega os dados básicos da empresa

    // Agora, injeta as operações de conexão para representantes e sócios
    if (representantesPayload.length > 0) {
      if (isUpdate) {
        // Para atualização, 'set' pode ser usado para substituir todos os representantes
        // ou 'connect' para adicionar novos sem desconectar os existentes.
        // Se a relação é 1:N (um para muitos), 'set' é geralmente o que se quer para atualização
        // dos membros da lista. Se for 1:1, a lógica seria diferente.
        // Vamos usar 'set' para simplicidade aqui, que substitui a lista atual.
        (dataToSave as EmpresaUpdateInput).representantes = {
          set: representantesPayload,
        };
      } else {
        (dataToSave as EmpresaCreateInput).representantes = {
          connect: representantesPayload,
        };
      }
    }

    if (sociosPayload.length > 0) {
      if (isUpdate) {
        // Similar ao representante, use 'set' ou 'connect'/'create'
        (dataToSave as EmpresaUpdateInput).socios = { create: sociosPayload }; // 'create' aqui porque é um N:M através de uma tabela de junção
      } else {
        (dataToSave as EmpresaCreateInput).socios = { create: sociosPayload };
      }
    }

    if (isUpdate) {
      const { id, ...updateData } = dataToSave as EmpresaUpdateInput;
      return await prisma.empresa.update({
        where: { id: id },
        data: updateData as any,
      });
    } else {
      return await prisma.empresa.create({
        data: dataToSave as any,
      });
    }
  }

  async findById(id: string): Promise<Empresa | null> {
    return await prisma.empresa.findUnique({
      where: { id },
      include: {
        contatos: true,
        localizacoes: true,
        representantes: true,
        socios: {
          include: {
            pessoa: true,
          },
        },
      },
    });
  }

  async findByCnpj(cnpj: string): Promise<Empresa | null> {
    return await prisma.empresa.findFirst({
      where: { cnpj },
    });
  }
}
