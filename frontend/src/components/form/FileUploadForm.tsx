import React, { useRef } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

// Por referência à definição:
export enum TypeFile {
  PDF = 'pdf',
  DOC = 'doc',
  DOCX = 'docx',
  XLS = 'xls',
  XLSX = 'xlsx',
  CSV = 'csv',
  JPG = 'jpg',
  JPEG = 'jpeg',
  PNG = 'png',
  TXT = 'txt',
}

export interface UploadedFile {
  originalname: string;
  path: string; // Note: Este campo você pode passar vazio no frontend
  buffer: any; // usaremos File ou Blob do browser, mas o backend espera Buffer
  mimetype?: string;
  size?: number;
  type: TypeFile;
}

type UploadFilesInput = {
  files: Omit<UploadedFile, 'buffer' | 'path'> & { fileObj: File }[];
};

type UploadProps = {
  name?: string; // Nome dentro do useForm, padrão "files"
};

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  return ext || '';
}

function getTypeFileFromExt(ext: string): TypeFile | undefined {
  switch (ext) {
    case 'pdf':
      return TypeFile.PDF;
    case 'doc':
      return TypeFile.DOC;
    case 'docx':
      return TypeFile.DOCX;
    case 'xls':
      return TypeFile.XLS;
    case 'xlsx':
      return TypeFile.XLSX;
    case 'csv':
      return TypeFile.CSV;
    case 'jpg':
      return TypeFile.JPG;
    case 'jpeg':
      return TypeFile.JPEG;
    case 'png':
      return TypeFile.PNG;
    case 'txt':
      return TypeFile.TXT;
    default:
      return undefined;
  }
}

export const FileUploadForm: React.FC<UploadProps> = ({ name = 'files' }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { control, setValue, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  // Toda vez que o array de files mudar, propague ao form apenas os campos relevantes para backend
  const filesWatch = watch(name);

  // Lida com seleção de arquivos pelo usuário e adiciona ao form context
  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    for (const file of files) {
      const ext = getFileExtension(file.name);
      const typeFile = getTypeFileFromExt(ext) as TypeFile | undefined;
      if (!typeFile) {
        alert(`Tipo de arquivo não suportado para: ${file.name}`);
        continue;
      }
      // Popular o objeto conforme a interface usada pelo backend
      const uploaded: Omit<UploadedFile, 'buffer' | 'path'> & {
        fileObj: File;
      } = {
        originalname: file.name,
        // path é preenchido no backend. Aqui não importa, passaremos vazio
        mimetype: file.type,
        size: file.size,
        type: typeFile,
        fileObj: file,
      };
      append(uploaded);
    }
    // limpar input para permitir novos uploads repetidos
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (idx: number) => {
    remove(idx);
  };

  return (
    <section className="mb-4">
      <label className="block font-semibold mb-2">Arquivos</label>
      <input
        type="file"
        multiple
        ref={inputRef}
        className="block mb-2"
        onChange={handleFilesChange}
      />
      <ul className="space-y-2">
        {fields.map((field: any, idx: number) => (
          <li
            key={field.id}
            className="flex items-center justify-between bg-gray-100 rounded px-3 py-2"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium">{field.originalname}</span>
              <span className="text-xs text-gray-500">
                {field.mimetype || ''} • {Math.round((field.size || 0) / 1024)}{' '}
                KB
              </span>
              <span className="text-xs text-blue-700">Tipo: {field.type}</span>
            </div>
            <button
              className="ml-4 px-2 py-1 text-sm rounded text-white bg-red-500 hover:bg-red-600"
              type="button"
              onClick={() => handleRemove(idx)}
            >
              Remover
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FileUploadForm;
