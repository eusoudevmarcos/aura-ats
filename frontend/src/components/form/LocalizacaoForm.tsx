import React from "react";
import {
  FormProvider,
  useForm,
  UseFormReturn,
  useFormContext,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LocalizacaoInput,
  localizacaoSchema,
} from "@/schemas/localizacao.schema";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { getError } from "@/utils/getError";
import Card from "../Card";

type Props = {
  namePrefix?: string; // e.g., "empresa.localizacoes[0]"
  title?: string;
  formContexto?: UseFormReturn<any>;
  onSubmit?: (data: any) => void;
};

const LocalizacaoFormInner: React.FC<{
  methods: UseFormReturn;
  title: string;
  namePrefix: string;
}> = ({
  namePrefix = "localizacoes[0]",
  title = "Localização (Opcional)",
  methods,
}) => {
  const {
    register,
    formState: { errors },
  } = methods;

  const cidade = makeName<LocalizacaoInput>(namePrefix, "cidade");
  const estado = makeName<LocalizacaoInput>(namePrefix, "estado");

  return (
    <Card title="localizacao">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor={cidade}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cidade:
          </label>
          <input
            type="text"
            id={cidade}
            {...register(cidade)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError(errors, cidade) && (
            <p className="text-red-500 text-xs italic">
              {getError(errors, cidade)}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor={estado}
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Estado (UF):
          </label>
          <input
            type="text"
            id={estado}
            maxLength={2}
            {...register(estado)}
            placeholder="Ex: SP"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {getError(errors, estado) && (
            <p className="text-red-500 text-xs italic">
              {getError(errors, estado)}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

const LocalizacaoForm: React.FC<Props> = ({
  namePrefix = "localizacoes[0]",
  title = "Localização (Opcional)",
  onSubmit,
}) => {
  const mode = "context";

  const methods = useSafeForm({
    mode,
    useFormProps: {
      resolver: zodResolver(localizacaoSchema) as any,
      mode: "onTouched",
    },
  });

  if (mode !== "context") {
    return (
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit((d) => onSubmit?.(d))}>
          <LocalizacaoFormInner
            namePrefix={namePrefix}
            title={title}
            methods={methods}
          />
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
  return (
    <LocalizacaoFormInner
      namePrefix={namePrefix}
      title={title}
      methods={methods}
    />
  );
};

export default LocalizacaoForm;
