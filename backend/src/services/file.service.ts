import fs from "fs";
import path from "path";

const FILES_DIR = path.resolve(__dirname, "../public/files");

function ensureDirExists() {
  if (!fs.existsSync(FILES_DIR)) {
    fs.mkdirSync(FILES_DIR, { recursive: true });
  }
}

export enum TypeFile {
  PDF = "pdf",
  DOC = "doc",
  DOCX = "docx",
  XLS = "xls",
  XLSX = "xlsx",
  CSV = "csv",
  JPG = "jpg",
  JPEG = "jpeg",
  PNG = "png",
  TXT = "txt",
}

export interface UploadedFile {
  originalname: string;
  path: string;
  buffer: Buffer;
  mimetype?: string;
  size?: number;
  type: TypeFile;
}

export class FileService {
  static async listFiles(): Promise<string[]> {
    ensureDirExists();
    const files = await fs.promises.readdir(FILES_DIR);
    return files;
  }

  static async getFile(fileName: string, pathCustom: string): Promise<string> {
    ensureDirExists();

    const targetDir = pathCustom || FILES_DIR;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, path.basename(fileName));
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }
    return filePath;
  }

  static async createFile(
    file: UploadedFile,
    pathCustom: string
  ): Promise<{ fileName: string }> {
    ensureDirExists();

    // Garantir que o diretório customizado existe
    const targetDir = pathCustom || FILES_DIR;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const destPath = path.join(targetDir, path.basename(file.originalname));
    await fs.promises.writeFile(destPath, file.buffer);
    return { fileName: file.originalname };
  }

  static async updateFile(
    fileName: string,
    file: UploadedFile,
    pathCustom: string
  ): Promise<{ fileName: string }> {
    ensureDirExists();

    const targetDir = pathCustom || FILES_DIR;
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, path.basename(fileName));
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }
    await fs.promises.writeFile(filePath, file.buffer);
    return { fileName };
  }

  static async deleteFile(
    fileName: string,
    pathCustom: string
  ): Promise<{ deleted: boolean; fileName: string }> {
    ensureDirExists();

    const targetDir = pathCustom || FILES_DIR;
    const filePath = path.join(targetDir, path.basename(fileName));
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }
    await fs.promises.unlink(filePath);
    return { deleted: true, fileName };
  }
}
