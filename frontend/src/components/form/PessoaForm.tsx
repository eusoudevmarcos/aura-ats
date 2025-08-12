import React from "react";
import { FieldValues, FormProvider, UseFormReturn } from "react-hook-form";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { PessoaInput } from "@/schemas/pessoa.schema";
import { FormInput } from "../input/FormInput";
import Card from "../Card";

type PessoaFormProps = {
  namePrefix?: string;
  onSubmit?: (data: PessoaInput) => void;
};

const PessoaForm = ({ namePrefix = "pessoa", onSubmit }: PessoaFormProps) => {
  const mode = "context";
  const methods = useSafeForm({ mode, debug: true });
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
      title="Pessoa/Representante"
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

  if (mode !== "context") {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((data: any) => onSubmit?.(data))}>
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
