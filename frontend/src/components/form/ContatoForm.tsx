import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContatoInput, contatoSchema } from "@/schemas/contato.schema";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { FormInput } from "../input/FormInput";

type ContatoFormProps = {
  namePrefix: string; // ex: "empresa.contatos[0]"
  formContexto?: UseFormReturn;
  onSubmit?: (data: any) => void;
};

function ContatoFormInner({
  namePrefix,
  methods,
}: {
  namePrefix: string;
  methods: UseFormReturn;
}) {
  const { control, formState } = methods;
  const { errors } = formState;

  const telefoneName = makeName<ContatoInput>(namePrefix, "telefone");
  const whatsappName = makeName<ContatoInput>(namePrefix, "whatsapp");
  const emailName = makeName<ContatoInput>(namePrefix, "email");

  return (
    <>
      <FormInput
        name={telefoneName}
        control={control}
        maskProps={{ mask: "(00) 0000-0000" }}
        placeholder="(00) 0000-0000"
        errors={errors}
      />

      <FormInput
        name={whatsappName}
        control={control}
        maskProps={{ mask: "(00) 00000-0000" }}
        placeholder="(00) 00000-0000"
        errors={errors}
      />

      <FormInput
        name={emailName}
        control={control}
        placeholder="Email"
        type="email"
        errors={errors}
      />
    </>
  );
}
export function ContatoForm({
  namePrefix = "contatos[0]",
  onSubmit,
}: ContatoFormProps) {
  const mode = "context";
  const methods = useSafeForm<ContatoInput>({
    useFormProps: { resolver: zodResolver(contatoSchema) },
    mode,
  });

  if (mode !== "context") {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((d) => onSubmit?.(d))}>
          <ContatoFormInner namePrefix={namePrefix} methods={methods} />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Salvar
          </button>
        </form>
      </FormProvider>
    );
  }
  return <ContatoFormInner namePrefix={namePrefix} methods={methods} />;
}

export default ContatoForm;
