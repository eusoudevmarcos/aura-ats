import React from "react";
import { FormProvider } from "react-hook-form";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { PessoaInput } from "@/schemas/pessoa.schema";
import { FormInput } from "../input/FormInput";
import ContatoForm from "./ContatoForm";

type PessoaFormProps = {
  namePrefix?: string;
  onSubmit?: (data: PessoaInput) => void;
  contatoPessoa?: { title: string };
};

const PessoaForm = ({
  namePrefix = "pessoa",
  onSubmit,
  contatoPessoa,
}: PessoaFormProps) => {
  const mode = "context";
  const methods = useSafeForm({ mode, debug: true });
  const {
    register,
    control,
    formState: { errors },
  } = methods;

  const nome = makeName<PessoaInput>(namePrefix, "nome");
  const cpf = makeName<PessoaInput>(namePrefix, "cpf");
  const rg = makeName<PessoaInput>(namePrefix, "rg");
  const dataNascimento = makeName<PessoaInput>(namePrefix, "dataNascimento");

  const formContent = (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-2">
      <FormInput
        name={nome}
        register={register}
        placeholder="Nome Completo"
        errors={errors}
      />

      <FormInput
        name={cpf}
        control={control}
        maskProps={{ mask: "000.000.000-00" }}
        placeholder="CPF"
        errors={errors}
      />

      <FormInput
        name={dataNascimento}
        control={control}
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

      {contatoPessoa && (
        <div className="col-span-full" title={contatoPessoa.title}>
          <h3 className="text-xl font-bold">{contatoPessoa.title}</h3>
          <section className="flex w-full gap-2">
            <ContatoForm namePrefix={`${namePrefix}.contatos[0]`} />
          </section>
        </div>
      )}
    </section>
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
