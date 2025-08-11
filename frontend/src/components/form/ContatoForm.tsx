import React from "react";
import {
  FormProvider,
  useForm,
  UseFormReturn,
  useFormContext,
  Controller,
} from "react-hook-form";
import InputMask from "react-input-mask";
import { zodResolver } from "@hookform/resolvers/zod";
import { contatoSchema } from "@/schemas/contato.schema";
import { IMaskInput } from "react-imask";

type Contato = typeof contatoSchema extends infer T ? T : never;

type Props = {
  namePrefix?: string; // e.g., "empresa.contatos[0]"
  title?: string;
  formContexto?: UseFormReturn<any>;
  onSubmit?: (data: any) => void;
};

const Inner: React.FC<Pick<Props, "namePrefix" | "title">> = ({
  namePrefix = "contatos[0]",
  title = "Contatos (Opcional)",
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();
  const field = (name: string) => `${namePrefix}.${name}`;
  const getError = (path: string): string | undefined => {
    try {
      const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      let obj: any = errors;
      for (const p of parts) obj = obj?.[p];
      return obj?.message as string | undefined;
    } catch {
      return undefined;
    }
  };
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mb-4">
          <label
            htmlFor={field("telefone")}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Telefone:
          </label>

          <Controller
            name={field("email")}
            control={control}
            render={({ field }) => (
              <IMaskInput
                mask="(00) 0000-0000"
                type="tel"
                {...field}
                placeholder="(DD) 99999-9999"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
          {getError(field("telefone")) && (
            <p className="text-red-500 text-xs italic">
              {getError(field("telefone"))}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor={field("whatsapp")}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            WhatsApp:
          </label>
          <Controller
            name={field("whatsapp")}
            control={control}
            render={({ field }) => (
              <IMaskInput
                mask="(00) 00000-0000"
                type="tel"
                {...field}
                placeholder="(DD) 99999-9999"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            )}
          />
          {getError(field("whatsapp")) && (
            <p className="text-red-500 text-xs italic">
              {getError(field("whatsapp"))}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor={field("email")}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id={field("email")}
            {...register(field("email"))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError(field("email")) && (
            <p className="text-red-500 text-xs italic">
              {getError(field("email"))}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const ContatoForm: React.FC<Props> = ({
  namePrefix = "contatos[0]",
  title = "Contatos (Opcional)",
  formContexto,
  onSubmit,
}) => {
  if (!formContexto) {
    const methods = useForm({
      resolver: zodResolver(contatoSchema) as any,
      mode: "onTouched",
    });
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((d) => onSubmit?.(d))}>
          <Inner namePrefix={namePrefix} title={title} />
          <button
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Salvar Contato
          </button>
        </form>
      </FormProvider>
    );
  }
  return <Inner namePrefix={namePrefix} title={title} />;
};

export default ContatoForm;
