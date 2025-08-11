import React from "react";
import InputMask from "react-input-mask";
import { Controller, UseFormReturn, Path, useForm } from "react-hook-form";
import { empresaSchema, EmpresaSectionInput } from "@/schemas/empresa.schema";
import ContatoForm from "@/components/form/ContatoForm";
import LocalizacaoSection from "@/components/form/LocalizacaoSection";
import { ClienteInput } from "@/schemas/cliente.schema";
import { Empresa } from "@/model/funcionario.model";
import { IMaskInput } from "react-imask";

type EmpresaFormProps = {
  namePrefix: string; // Exemplo: "empresa"
  formContexto: UseFormReturn<ClienteInput>; // Contexto do formulário do cliente
  onSubmit?: (data: any) => void;
};

const EmpresaForm: React.FC<EmpresaFormProps> = ({
  namePrefix,
  formContexto,
  onSubmit,
}) => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = formContexto;
  const isInternalForm = !formContexto;
  const methods = formContexto || useForm<Empresa>();

  // Para construir o nome do campo no formato correto com prefixo
  const field = (name: Path<EmpresaSectionInput>): Path<ClienteInput> =>
    `${namePrefix}.${name}` as Path<ClienteInput>;

  // Função para obter mensagem de erro para campos aninhados
  const getErrorByPath = (path: string) => {
    try {
      const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".");
      let obj: any = errors;
      for (const p of parts) obj = obj?.[p];
      return obj?.message as string | undefined;
    } catch {
      return undefined;
    }
  };

  const submitHandler = (data: any) => {
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const formContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="mb-4">
        <label
          htmlFor={field("razaoSocial")}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Razão Social*:
        </label>
        <input
          id={field("razaoSocial")}
          type="text"
          {...register(field("razaoSocial") as any)}
          autoComplete="off"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {getErrorByPath(field("razaoSocial")) && (
          <p className="text-red-500 text-xs italic">
            {getErrorByPath(field("razaoSocial"))}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor={field("cnpj")}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          CNPJ*:
        </label>
        <Controller
          name={field("cnpj")}
          control={control}
          render={({ field }) => (
            <IMaskInput
              mask="99.999.999/9999-99"
              value={typeof field.value === "string" ? field.value : ""}
              onChange={field.onChange}
              onBlur={field.onBlur}
              inputRef={(el) => {
                field.ref(el);
              }}
              onAccept={(value: string) => field.onChange(value)}
              autoComplete="off"
              placeholder="00.000.000/0000-00"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          )}
        />
        {getErrorByPath(field("cnpj")) && (
          <p className="text-red-500 text-xs italic">
            {getErrorByPath(field("cnpj"))}
          </p>
        )}
      </div>

      {/* Data de Abertura */}
      <div className="mb-4">
        <label
          htmlFor={field("dataAbertura")}
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Data de Abertura:
        </label>
        <input
          id={field("dataAbertura")}
          type="date"
          {...register(field("dataAbertura") as any)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {getErrorByPath(field("dataAbertura")) && (
          <p className="text-red-500 text-xs italic">
            {getErrorByPath(field("dataAbertura"))}
          </p>
        )}
      </div>

      {/* Contatos e Localizações */}
      <div className="col-span-1 md:col-span-2">
        <ContatoForm
          namePrefix={`${namePrefix}.contatos[0]`}
          formContexto={formContexto as any}
          title="Contato da Empresa"
        />
        <LocalizacaoSection
          namePrefix={`${namePrefix}.localizacoes[0]`}
          formContexto={formContexto as any}
          title="Localização da Empresa"
        />
      </div>
    </div>
  );
  if (isInternalForm) {
    // Se não recebeu contexto externo, renderiza o <form> com handleSubmit
    return (
      <form onSubmit={methods.handleSubmit(submitHandler)}>
        {formContent}
        <button type="submit">Salvar Empresa</button>
      </form>
    );
  }

  return formContent;
};

export default EmpresaForm;
