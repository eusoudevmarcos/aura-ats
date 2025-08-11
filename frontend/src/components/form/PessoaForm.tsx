import React from "react";
import {
  FieldValues,
  FormProvider,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { PessoaInput } from "@/schemas/pessoa.schema";
import { FormInput } from "../input/FormInput";
import Card from "../Card";

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

type PessoaFormProps<T extends FieldValues> = {
  namePrefix?: string;
  formContext?: UseFormReturn<T>;
  onSubmit?: (data: PessoaFormData) => void;
};

const PessoaForm = ({
  namePrefix = "pessoa",
  formContext,
  onSubmit,
}: PessoaFormProps<any>) => {
  const methods = useSafeForm({ mode: "context", debug: true });
  const {
    register,
    formState: { errors },
  } = methods;

  const nome = makeName<PessoaInput>(namePrefix, "nome");
  const cpf = makeName<PessoaInput>(namePrefix, "cpf");
  const rg = makeName<PessoaInput>(namePrefix, "rg");
  const dataNascimento = makeName<PessoaInput>(namePrefix, "dataNascimento");

  const formContent = (
    <Card
      title="Pessoa"
      classNameContent="grid grid-cols-1 md:grid-cols-2 gap-2"
    >
      <FormInput
        name={nome}
        register={register}
        placeholder="Nome Completo"
        errors={errors}
      />

      <FormInput
        name={cpf}
        register={register}
        placeholder="CPF"
        errors={errors}
      />

      <FormInput
        name={dataNascimento}
        register={register}
        placeholder="Data de Nascimento"
        errors={errors}
        type="date"
      />

      <FormInput
        name={rg}
        register={register}
        placeholder="RG"
        errors={errors}
      />
    </Card>
  );

  if (!formContext) {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((d) => onSubmit?.(d))}>
          {formContent}
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
          >
            Salvar Pessoa
          </button>
        </form>
      </FormProvider>
    );
  }

  return formContent;
};

export default PessoaForm;
