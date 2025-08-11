import React from "react";
import { UseFormReturn, FormProvider, FieldValues } from "react-hook-form";
import { EmpresaInput, empresaSchema } from "@/schemas/empresa.schema";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { FormInput } from "../input/FormInput";
import { zodResolver } from "@hookform/resolvers/zod";
import ContatoForm from "@/components/form/ContatoForm";
import LocalizacaoForm from "@/components/form/LocalizacaoForm";
import Card from "../Card";

type EmpresaFormProps<T extends FieldValues> = {
  namePrefix?: string;
  formContexto?: UseFormReturn<T>;
  onSubmit?: (data: any) => void;
};

const EmpresaForm = ({
  namePrefix = "empresa",
  onSubmit,
}: EmpresaFormProps<any>) => {
  const mode = "context";

  const methods = useSafeForm({
    debug: true,
    useFormProps: { resolver: zodResolver(empresaSchema) },
    mode,
  });

  const {
    register,
    formState: { errors },
  } = methods;

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
        <ContatoForm namePrefix={`${namePrefix}.contatos[0]`} />
        <LocalizacaoForm namePrefix={`${namePrefix}.localizacoes[0]`} />
      </div>
    </Card>
  );

  if (mode !== "context") {
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
