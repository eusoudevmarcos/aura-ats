import React from "react";
import {
  FormProvider,
  useForm,
  UseFormReturn,
  Controller,
  Path,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContatoInput, contatoSchema } from "@/schemas/contato.schema";
import { IMaskInput } from "react-imask";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { getError } from "@/utils/getError";
import { FormInput } from "../input/FormInput";
import Card from "../Card";

type ContatoFormProps = {
  namePrefix: string; // ex: "empresa.contatos[0]"
  formContexto?: UseFormReturn;
  onSubmit?: (data: any) => void;
};

function ContatoFormInner({ namePrefix }: { namePrefix: string }) {
  const { control, register, formState } = useSafeForm<ContatoInput>({
    mode: "context",
  });
  const { errors } = formState;

  const telefoneName = makeName<ContatoInput>(namePrefix, "telefone");
  const whatsappName = makeName<ContatoInput>(namePrefix, "whatsapp");
  const emailName = makeName<ContatoInput>(namePrefix, "email");

  return (
    <Card
      title="Contato"
      classNameContent="flex justify-between flex-1/3 gap-2"
    >
      <FormInput
        name={telefoneName}
        control={control}
        maskProps={{ mask: "(00) 0000-0000" }}
        placeholder="(00) 0000-0000"
      />

      <FormInput
        name={whatsappName}
        control={control}
        maskProps={{ mask: "(00) 00000-0000" }}
        placeholder="(00) 00000-0000"
      />

      <FormInput
        name={emailName}
        control={control}
        placeholder="Email"
        type="email"
      />
    </Card>
  );
}
export function ContatoForm({
  namePrefix = "contatos[0]",
  formContexto,
  onSubmit,
}: ContatoFormProps) {
  if (!formContexto) {
    const methods = useForm<ContatoInput>({
      resolver: zodResolver(contatoSchema),
    });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((d) => onSubmit?.(d))}>
          <ContatoFormInner namePrefix={namePrefix} />
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
  return <ContatoFormInner namePrefix={namePrefix} />;
}

export default ContatoForm;
