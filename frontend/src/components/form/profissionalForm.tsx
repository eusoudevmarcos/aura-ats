// src/components/profissionalForm.tsx
import React from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import api from "@/axios";
import PessoaForm from "./PessoaForm";
import ContatoSection from "@/components/form/sections/ContatoForm";
import LocalizacaoSection from "@/components/form/sections/LocalizacaoSection";
import ProfissionalSection from "@/components/form/sections/ProfissionalSection";

// Importe o esquema e o tipo definidos anteriormente
import {
  ProfissionalInput,
  ProfissionalInputSchema,
} from "@/schemas/profissional.schema";

interface MedicoFormProps {
  onSuccess: () => void;
  onError: (message: string) => void;
  onClose: () => void;
}

const ProfissionalForm: React.FC<MedicoFormProps> = ({
  onSuccess,
  onError,
  onClose,
}) => {
  const methods = useForm<ProfissionalInput>({
    resolver: zodResolver(ProfissionalInputSchema) as any,
    defaultValues: {
      area: "MEDICINA",
      usuario: { nome: "", cpf: "", email: "", tipo: "PROFISSIONAL" },
      funcionario: { setor: "", cargo: "" },
      contatos: { telefone: "", email: "", whatsapp: "" },
      localizacao: { cidade: "", estado: "" },
      formacao: { data_conclusao_medicina: "", data_conclusao_residencia: "" },
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = methods;

  // sem observadores adicionais no momento

  const onSubmit = async (data: ProfissionalInput) => {
    // Limpar strings vazias ou arrays vazios para campos opcionais antes de enviar
    const dataToSend = { ...data };

    // Campos opcionais de string
    if (dataToSend.rqe === "") dataToSend.rqe = undefined;

    // Objetos aninhados opcionais
    if (
      dataToSend.funcionario &&
      !dataToSend.funcionario.setor &&
      !dataToSend.funcionario.cargo
    ) {
      delete dataToSend.funcionario;
    } else if (dataToSend.funcionario) {
      if (dataToSend.funcionario.setor === "")
        dataToSend.funcionario.setor = undefined;
      if (dataToSend.funcionario.cargo === "")
        dataToSend.funcionario.cargo = undefined;
    }

    if (
      dataToSend.contatos &&
      !dataToSend.contatos.telefone &&
      !dataToSend.contatos.email &&
      !dataToSend.contatos.whatsapp
    ) {
      delete dataToSend.contatos;
    } else if (dataToSend.contatos) {
      if (dataToSend.contatos.telefone === "")
        dataToSend.contatos.telefone = undefined;
      if (dataToSend.contatos.email === "")
        dataToSend.contatos.email = undefined;
      if (dataToSend.contatos.whatsapp === "")
        dataToSend.contatos.whatsapp = undefined;
    }

    if (
      dataToSend.localizacao &&
      !dataToSend.localizacao.cidade &&
      !dataToSend.localizacao.estado
    ) {
      delete dataToSend.localizacao;
    }

    if (
      dataToSend.formacao &&
      !dataToSend.formacao.data_conclusao_medicina &&
      !dataToSend.formacao.data_conclusao_residencia
    ) {
      delete dataToSend.formacao;
    } else if (dataToSend.formacao) {
      if (dataToSend.formacao.data_conclusao_medicina === "")
        dataToSend.formacao.data_conclusao_medicina = undefined;
      if (dataToSend.formacao.data_conclusao_residencia === "")
        dataToSend.formacao.data_conclusao_residencia = undefined;

      // Converter datas para formato ISO se existirem
      if (dataToSend.formacao.data_conclusao_medicina) {
        dataToSend.formacao.data_conclusao_medicina = new Date(
          dataToSend.formacao.data_conclusao_medicina
        ).toISOString();
      }
      if (dataToSend.formacao.data_conclusao_residencia) {
        dataToSend.formacao.data_conclusao_residencia = new Date(
          dataToSend.formacao.data_conclusao_residencia
        ).toISOString();
      }
    }

    // Arrays vazios - nenhum atualmente

    console.log("Dados a serem enviados:", dataToSend);

    try {
      const response = await api.post("/api/profissional", dataToSend);

      console.log("Resposta da API:", response.data);
      onSuccess(); // Chama o callback de sucesso
      reset(); // Limpa o formulário
      onClose(); // Fecha o modal
    } catch (error) {
      console.error("Erro ao cadastrar funcionário:", error);
      if (axios.isAxiosError(error) && error.response) {
        console.error("Detalhes do erro:", error.response.data);
        onError(
          "Erro ao cadastrar funcionário: " +
            (error.response.data.message ||
              "Verifique o console para mais detalhes.")
        );
      } else {
        onError(
          "Erro ao cadastrar funcionário. Verifique sua conexão ou o console."
        );
      }
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit as any)}
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <PessoaForm namePrefix="usuario" />

        {/* Dados de Funcionário (Opcional) */}
        <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
          Dados de Funcionário (Opcional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="setor"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Setor:
            </label>
            <input
              type="text"
              id="setor"
              {...register("funcionario.setor")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.funcionario?.setor && (
              <p className="text-red-500 text-xs italic">
                {errors.funcionario.setor.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="cargo"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Cargo:
            </label>
            <input
              type="text"
              id="cargo"
              {...register("funcionario.cargo")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.funcionario?.cargo && (
              <p className="text-red-500 text-xs italic">
                {errors.funcionario.cargo.message}
              </p>
            )}
          </div>
        </div>

        <ProfissionalSection />

        <ContatoSection namePrefix="contatos" title="Contatos (Opcional)" />

        <LocalizacaoSection
          namePrefix="localizacao"
          title="Localização (Opcional)"
        />

        {/* Formação Acadêmica (Opcional) */}
        <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
          Formação Acadêmica (Opcional)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label
              htmlFor="data_conclusao_medicina"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Data Conclusão Medicina:
            </label>
            <input
              type="date"
              id="data_conclusao_medicina"
              {...register("formacao.data_conclusao_medicina")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.formacao?.data_conclusao_medicina && (
              <p className="text-red-500 text-xs italic">
                {errors.formacao.data_conclusao_medicina.message}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              htmlFor="data_conclusao_residencia"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Data Conclusão Residência:
            </label>
            <input
              type="date"
              id="data_conclusao_residencia"
              {...register("formacao.data_conclusao_residencia")}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {errors.formacao?.data_conclusao_residencia && (
              <p className="text-red-500 text-xs italic">
                {errors.formacao.data_conclusao_residencia.message}
              </p>
            )}
          </div>
        </div>

        {/* Especialidade única controlada na seção do Profissional */}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cadastrar Funcionário
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProfissionalForm;
