import React from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LocalizacaoInput,
  localizacaoSchema,
} from "@/schemas/localizacao.schema";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import Card from "../Card";
import { FormInput } from "../input/FormInput";
import { FormSelect } from "../input/FormSelect";
import { UF_MODEL } from "@/utils/UF";

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
  const cep = makeName<LocalizacaoInput>(namePrefix, "cep");
  const regiao = makeName<LocalizacaoInput>(namePrefix, "regiao");
  const complemento = makeName<LocalizacaoInput>(namePrefix, "complemento");
  const logradouro = makeName<LocalizacaoInput>(namePrefix, "complemento");
  const bairro = makeName<LocalizacaoInput>(namePrefix, "bairro");
  const uf = makeName<LocalizacaoInput>(namePrefix, "uf");

  return (
    <Card title="localizacao">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <FormInput
          name={cep}
          register={register}
          placeholder="CEP"
          errors={errors}
        />
        <FormSelect
          name={uf}
          register={register}
          errors={errors}
          placeholder="Selecione o UF"
          selectProps={{
            children: (
              <>
                {UF_MODEL.map(({ label }) => (
                  <option key={label}>{label}</option>
                ))}
              </>
            ),
          }}
        />
        <FormInput
          name={cidade}
          register={register}
          placeholder="Cidade"
          errors={errors}
        />
        <FormInput
          name={regiao}
          register={register}
          placeholder="Região"
          errors={errors}
        />
        <FormInput
          name={bairro}
          register={register}
          placeholder="Bairro"
          errors={errors}
        />
        <FormInput
          name={complemento}
          register={register}
          placeholder="Complemento"
          errors={errors}
        />

        <FormInput
          name={logradouro}
          register={register}
          placeholder="Logradouro (Opcional)"
        />
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
