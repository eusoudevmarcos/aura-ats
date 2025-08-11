import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Definição do schema Zod para Pessoa conforme o schema.prisma
export const pessoaSchema = z.object({
  nome: z
    .string()
    .min(1, "O nome é obrigatório")
    .max(255, "O nome deve ter no máximo 255 caracteres"),
  cpf: z
    .string()
    .min(11, "O CPF deve ter 11 dígitos")
    .max(11, "O CPF deve ter 11 dígitos")
    .regex(/^\d{11}$/, "O CPF deve conter apenas números"),
  dataNascimento: z
    .string()
    .optional()
    .refine(
      (val) => !val || !isNaN(Date.parse(val)),
      "Data de nascimento inválida"
    ),
  rg: z.string().optional(),
});

export type PessoaFormData = z.infer<typeof pessoaSchema>;

type Props = {
  namePrefix?: string;
  formContexto?: UseFormReturn<PessoaFormData>;
  onSubmit?: (data: PessoaFormData) => void;
};

const PessoaForm: React.FC<Props> = ({
  namePrefix = "pessoa",
  formContexto,
  onSubmit,
}) => {
  // Se não receber contexto, cria um novo
  const isInternalForm = !formContexto;
  const methods =
    formContexto ||
    useForm<PessoaFormData>({
      resolver: zodResolver(pessoaSchema),
      mode: "onTouched",
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  // Função auxiliar para exibir erros
  const getErrorByPath = (path: string) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let obj: any = errors;
      for (const p of parts) obj = obj?.[p];
      return obj?.message as string | undefined;
    } catch {
      return undefined;
    }
  };

  const fieldPath = (name: keyof PessoaFormData): string =>
    isInternalForm || !namePrefix ? (name as string) : `${namePrefix}.${name}`;

  // Renderização do formulário
  const formContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Nome */}
      <div className="mb-4">
        <label
          htmlFor={fieldPath("nome")}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Nome Completo:
        </label>
        <input
          type="text"
          id={fieldPath("nome")}
          {...register(fieldPath("nome") as any)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {getErrorByPath(fieldPath("nome")) && (
          <p className="text-red-500 text-xs italic">
            {getErrorByPath(fieldPath("nome"))}
          </p>
        )}
      </div>
      {/* CPF */}
      <div className="mb-4">
        <label
          htmlFor={fieldPath("cpf")}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          CPF:
        </label>
        <input
          type="text"
          id={fieldPath("cpf")}
          {...register(fieldPath("cpf") as any)}
          placeholder="Somente números"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          maxLength={11}
        />
        {getErrorByPath(fieldPath("cpf")) && (
          <p className="text-red-500 text-xs italic">
            {getErrorByPath(fieldPath("cpf"))}
          </p>
        )}
      </div>
      {/* Data de Nascimento */}
      <div className="mb-4">
        <label
          htmlFor={fieldPath("dataNascimento")}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Data de Nascimento:
        </label>
        <input
          type="date"
          id={fieldPath("dataNascimento")}
          {...register(fieldPath("dataNascimento") as any)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {getErrorByPath(fieldPath("dataNascimento")) && (
          <p className="text-red-500 text-xs italic">
            {getErrorByPath(fieldPath("dataNascimento"))}
          </p>
        )}
      </div>
      {/* RG */}
      <div className="mb-4">
        <label
          htmlFor={fieldPath("rg")}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          RG:
        </label>
        <input
          type="text"
          id={fieldPath("rg")}
          {...register(fieldPath("rg") as any)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {getErrorByPath(fieldPath("rg")) && (
          <p className="text-red-500 text-xs italic">
            {getErrorByPath(fieldPath("rg"))}
          </p>
        )}
      </div>
    </div>
  );

  // Se for formulário interno, renderiza o <form> e lida com o submit
  if (isInternalForm) {
    return (
      <form onSubmit={handleSubmit(onSubmit ?? (() => {}))}>
        {formContent}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
        >
          Salvar Pessoa
        </button>
      </form>
    );
  }

  // Se for usado como parte de outro formulário, só renderiza os campos
  return formContent;
};

export default PessoaForm;
