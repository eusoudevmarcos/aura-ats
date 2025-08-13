import React, { useState, useCallback, useEffect, useRef } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  LocalizacaoInput,
  localizacaoSchema,
} from "@/schemas/localizacao.schema";
import { useSafeForm } from "@/hook/useSafeForm";
import { makeName } from "@/utils/makeName";
import { FormInput } from "../input/FormInput";
import { FormSelect } from "../input/FormSelect";
import { UF_MODEL } from "@/utils/UF";
import axios from "axios";

type Props = {
  namePrefix?: string;
  title?: string;
  onSubmit?: (data: any) => void;
};

interface ViaCep {
  erro?: boolean;
  cep: string;
  logradouro: string;
  complemento: string;
  unidade: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

const LocalizacaoFormInner: React.FC<{
  methods: UseFormReturn;
  title?: string;
  namePrefix: string;
}> = ({ namePrefix = "localizacoes[0]", methods }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = methods;

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const cepFieldName = makeName<LocalizacaoInput>(namePrefix, "cep");
  const cepValue = watch(cepFieldName);

  const lastProcessedCep = useRef<string | null>(null);

  const cidadeFieldName = makeName<LocalizacaoInput>(namePrefix, "cidade");
  const regiaoFieldName = makeName<LocalizacaoInput>(namePrefix, "regiao");
  const complementoFieldName = makeName<LocalizacaoInput>(
    namePrefix,
    "complemento"
  );
  const logradouroFieldName = makeName<LocalizacaoInput>(
    namePrefix,
    "logradouro"
  );
  const bairroFieldName = makeName<LocalizacaoInput>(namePrefix, "bairro");
  const ufFieldName = makeName<LocalizacaoInput>(namePrefix, "uf");

  const getLocalization = useCallback(
    async (cep: string) => {
      const normalizedCep = cep.replace(/\D/g, "");

      if (!normalizedCep || normalizedCep.length !== 8) return;

      if (lastProcessedCep.current === normalizedCep) {
        return;
      }

      setIsLoadingCep(true);
      try {
        const response = await axios.get<ViaCep>(
          `https://viacep.com.br/ws/${normalizedCep}/json/`
        );
        if (response.data && !response.data.erro) {
          setValue(logradouroFieldName, response.data.logradouro, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(bairroFieldName, response.data.bairro, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(cidadeFieldName, response.data.localidade, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(ufFieldName, response.data.uf, {
            shouldValidate: true,
            shouldDirty: true,
          });
          if (response.data.complemento) {
            setValue(complementoFieldName, response.data.complemento, {
              shouldValidate: true,
              shouldDirty: true,
            });
          } else {
            setValue(complementoFieldName, "", {
              shouldValidate: true,
              shouldDirty: true,
            });
          }
          methods.clearErrors(cepFieldName);
          lastProcessedCep.current = normalizedCep;
        } else {
          setValue(logradouroFieldName, "", {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(bairroFieldName, "", {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(cidadeFieldName, "", {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(ufFieldName, "", {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue(complementoFieldName, "", {
            shouldValidate: true,
            shouldDirty: true,
          });

          methods.setError(
            cepFieldName,
            {
              type: "manual",
              message: "CEP não encontrado ou inválido.",
            },
            { shouldFocus: true }
          );
          lastProcessedCep.current = null;
        }
      } catch (error) {
        console.error("Erro ao consultar o ViaCEP:", error);
        setValue(logradouroFieldName, "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(bairroFieldName, "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(cidadeFieldName, "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(ufFieldName, "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue(complementoFieldName, "", {
          shouldValidate: true,
          shouldDirty: true,
        });
        methods.setError(
          cepFieldName,
          {
            type: "manual",
            message: "Erro na consulta do CEP. Tente novamente.",
          },
          { shouldFocus: true }
        );
        lastProcessedCep.current = null;
      } finally {
        setIsLoadingCep(false);
      }
    },
    [
      setValue,
      methods,
      logradouroFieldName,
      bairroFieldName,
      cidadeFieldName,
      ufFieldName,
      complementoFieldName,
      cepFieldName,
    ]
  );

  useEffect(() => {
    const numericCep = cepValue?.replace(/\D/g, "");

    const handler = setTimeout(() => {
      if (numericCep && numericCep.length === 8) {
        getLocalization(numericCep);
      } else if (
        numericCep &&
        numericCep.length < 8 &&
        lastProcessedCep.current
      ) {
        // Limpa o último CEP processado se o usuário apagar ou digitar um CEP incompleto
        lastProcessedCep.current = null;
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [cepValue, getLocalization]);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-x-2">
        <FormInput
          name={cepFieldName}
          register={register}
          placeholder="CEP"
          errors={errors}
          maskProps={{ mask: "00000-000" }}
          inputProps={{
            classNameContainer: "col-span-1",
            disabled: isLoadingCep,
          }}
        />
        <FormSelect
          name={ufFieldName}
          register={register}
          errors={errors}
          placeholder="UF"
          selectProps={{
            classNameContainer: "col-span-1",
            disabled: isLoadingCep,
            children: (
              <>
                <option value="">Selecione</option>
                {UF_MODEL.map(({ label }) => (
                  <option key={label} value={label}>
                    {label}
                  </option>
                ))}
              </>
            ),
          }}
        />
        <FormInput
          name={cidadeFieldName}
          register={register}
          placeholder="Cidade"
          errors={errors}
          inputProps={{
            classNameContainer: "col-span-2",
            disabled: isLoadingCep,
          }}
        />
        <FormInput
          name={regiaoFieldName}
          register={register}
          placeholder="Região"
          errors={errors}
          inputProps={{
            classNameContainer: "col-span-2",
            disabled: isLoadingCep,
          }}
        />
        <FormInput
          name={bairroFieldName}
          register={register}
          placeholder="Bairro"
          errors={errors}
          inputProps={{
            classNameContainer: "col-span-2",
            disabled: isLoadingCep,
          }}
        />
        <FormInput
          name={complementoFieldName}
          register={register}
          placeholder="Complemento"
          errors={errors}
          inputProps={{
            classNameContainer: "col-span-2",
            disabled: isLoadingCep,
          }}
        />
        <FormInput
          name={logradouroFieldName}
          register={register}
          placeholder="Logradouro"
          errors={errors}
          inputProps={{
            classNameContainer: "col-span-2",
            disabled: isLoadingCep,
          }}
        />
      </div>
    </>
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
