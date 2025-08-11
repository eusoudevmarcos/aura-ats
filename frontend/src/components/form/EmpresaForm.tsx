import React from "react";
import {
  Controller,
  UseFormReturn,
  Path,
  useFormContext,
  useForm,
  FormProvider,
  FieldValues,
} from "react-hook-form";
import { ClienteInput } from "@/schemas/cliente.schema";
import { IMaskInput } from "react-imask";
import ContatoForm from "@/components/form/ContatoForm";
import LocalizacaoForm from "@/components/form/LocalizacaoForm";
import { EmpresaInput } from "@/schemas/empresa.schema";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { FormInput } from "../input/FormInput";
import Card from "../Card";

type EmpresaFormProps<T extends FieldValues> = {
  namePrefix?: string;
  formContexto?: UseFormReturn<T>;
  onSubmit?: (data: any) => void;
};

const EmpresaForm = ({
  namePrefix = "empresa",
  onSubmit,
  formContexto,
}: EmpresaFormProps<any>) => {
  const formContext = useSafeForm({ mode: "context", debug: true });
  const {
    control,
    register,
    formState: { errors },
  } = formContext;

  const cnpj = makeName<EmpresaInput>(namePrefix, "cnpj");
  const razaoSocial = makeName<EmpresaInput>(namePrefix, "razaoSocial");
  const dataAbertura = makeName<EmpresaInput>(namePrefix, "dataAbertura");

  const submitHandler = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const formContent = (
    <Card
      title="Empresa"
      classNameContent="grid grid-cols-1 md:grid-cols-3 gap-2"
    >
      <FormInput
        name={cnpj}
        register={register}
        maskProps={{ mask: "00.000.000/0000-00" }}
        placeholder="00.000.000/0000-00"
        errors={errors}
      />

      <FormInput
        name={razaoSocial}
        register={register}
        placeholder="Razão Social"
        errors={errors}
      />

      <FormInput
        name={dataAbertura}
        register={register}
        placeholder="Razão Social"
        errors={errors}
        type="date"
      />

      <div className="col-span-3">
        <ContatoForm
          namePrefix={`${namePrefix}.contatos[0]`}
          formContexto={formContext}
        />
        <LocalizacaoForm
          namePrefix={`${namePrefix}.localizacoes[0]`}
          formContexto={formContext}
        />
      </div>
    </Card>
  );

  if (!formContexto) {
    const methods = useForm();
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(submitHandler)}>
          {formContent}
          <button type="submit">Salvar Empresa</button>
        </form>
      </FormProvider>
    );
  }

  return formContent;
};

export default EmpresaForm;
