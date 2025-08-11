import React from "react";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { clienteSchema, ClienteInput } from "@/schemas/cliente.schema";
import EmpresaForm from "@/components/form/EmpresaForm";
import api from "@/axios";
import { TipoServicoEnum } from "@/schemas/tipoServicoEnum.schema";
import { StatusClienteEnum } from "@/schemas/statusClienteEnum.schema";

type ClienteFormProps = {
  formContexto?: UseFormReturn<ClienteInput>;
  onSubmit?: (data: ClienteInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<ClienteInput>;
};

const ClienteForm: React.FC<ClienteFormProps> = ({
  formContexto,
  onSubmit,
  initialValues,
  onSuccess,
}) => {
  const methods =
    formContexto ||
    useForm<ClienteInput>({
      resolver: zodResolver(clienteSchema) as any,
      mode: "onTouched",
      defaultValues: {
        ...initialValues,
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const submitHandler = async (data: ClienteInput) => {
    if (onSubmit) onSubmit(data);

    // Normaliza payload e datas para o backend
    const payload: ClienteInput = { ...data } as ClienteInput;
    if (payload.empresa) {
      const e: any = { ...payload.empresa };
      if (e.dataAbertura)
        e.dataAbertura = new Date(e.dataAbertura).toISOString();
      payload.empresa = e;
    }

    try {
      const response = await api.post("/api/cliente/save", payload);
      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
      }
    } catch (erro: any) {
      alert(
        "Erro ao criar cliente: " + erro?.response?.data?.message ||
          "Erro não encontrado"
      );
    }
  };

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

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler as any)} className="space-y-6">
        <EmpresaForm formContexto={methods} namePrefix="empresa" />

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Serviço:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {TipoServicoEnum.options.map((serv) => (
              <label key={serv} className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  value={serv}
                  {...register("tipoServico")}
                />
                <span>{serv.replaceAll("_", " ")}</span>
              </label>
            ))}
          </div>
          {getErrorByPath("tipoServico") && (
            <p className="text-red-500 text-xs italic">
              {getErrorByPath("tipoServico")}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Status
          </label>
          <select
            id="status"
            {...register("status")}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            {StatusClienteEnum.options.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
          {getErrorByPath("status") && (
            <p className="text-red-500 text-xs italic">
              {getErrorByPath("status")}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md"
          >
            Salvar Cliente
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClienteForm;
