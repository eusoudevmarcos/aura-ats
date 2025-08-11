import React from "react";
import {
  FormProvider,
  useForm,
  UseFormReturn,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { localizacaoSchema } from "@/schemas/localizacao.schema";

type Props = {
  namePrefix?: string; // e.g., "empresa.localizacoes[0]"
  title?: string;
  formContexto?: UseFormReturn<any>;
  onSubmit?: (data: any) => void;
};

const Inner: React.FC<Pick<Props, "namePrefix" | "title">> = ({
  namePrefix = "localizacoes[0]",
  title = "Localização (Opcional)",
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const field = (name: string) => `${namePrefix}.${name}`;

  const getError = (path: string): string | undefined => {
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

  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor={field("cidade")}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cidade:
          </label>
          <input
            type="text"
            id={field("cidade")}
            {...register(field("cidade"))}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError(field("cidade")) && (
            <p className="text-red-500 text-xs italic">
              {getError(field("cidade"))}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor={field("estado")}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Estado (UF):
          </label>
          <input
            type="text"
            id={field("estado")}
            maxLength={2}
            {...register(field("estado"))}
            placeholder="Ex: SP"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError(field("estado")) && (
            <p className="text-red-500 text-xs italic">
              {getError(field("estado"))}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

const LocalizacaoSection: React.FC<Props> = ({
  namePrefix = "localizacoes[0]",
  title = "Localização (Opcional)",
  formContexto,
  onSubmit,
}) => {
  if (!formContexto) {
    const methods = useForm({
      resolver: zodResolver(localizacaoSchema) as any,
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
            Salvar Localização
          </button>
        </form>
      </FormProvider>
    );
  }
  return <Inner namePrefix={namePrefix} title={title} />;
};

export default LocalizacaoSection;
