// src/components/MedicoForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import api from "@/axios";

// Importe o esquema e o tipo definidos anteriormente
import {
  ProfissionalInput,
  ProfissionalInputSchema,
} from "@/schemas/profissionalSchema";

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
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset, // Adicione o reset para limpar o formulário
    watch, // Para observar valores e gerenciar checked states de checkboxes
  } = useForm<ProfissionalInput>({
    resolver: zodResolver(ProfissionalInputSchema),
    defaultValues: {
      // Valores padrão para inicializar o formulário
      crm: "",
      area: "MEDICO",
      usuario: {
        nome: "",
        cpf: "",
        email: "",
        tipo: "PROFISSIONAL",
      },
      // Inicialize campos opcionais como vazios ou arrays vazios
      rqe: "",
      funcionario: { setor: "", cargo: "" },
      contatos: { telefone: "", email: "", whatsapp: "" },
      localizacao: { cidade: "", estado: "" },
      formacao: { data_conclusao_medicina: "", data_conclusao_residencia: "" },
      especialidadeIds: [],
      hospitalIds: [],
    },
  });

  // Observa os valores dos arrays de IDs para controlar os checkboxes
  const watchedEspecialidadeIds = watch("especialidadeIds") || [];
  const watchedHospitalIds = watch("hospitalIds") || [];

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

    // Arrays vazios
    if (dataToSend.especialidadeIds && dataToSend.especialidadeIds.length === 0)
      delete dataToSend.especialidadeIds;
    if (dataToSend.hospitalIds && dataToSend.hospitalIds.length === 0)
      delete dataToSend.hospitalIds;

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="nome"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nome Completo:
          </label>
          <input
            type="text"
            id="nome"
            {...register("usuario.nome")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.usuario?.nome && (
            <p className="text-red-500 text-xs italic">
              {errors.usuario.nome.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="cpf"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CPF:
          </label>
          <input
            type="text"
            id="cpf"
            {...register("usuario.cpf")}
            placeholder="000.000.000-00"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.usuario?.cpf && (
            <p className="text-red-500 text-xs italic">
              {errors.usuario.cpf.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            {...register("usuario.email")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.usuario?.email && (
            <p className="text-red-500 text-xs italic">
              {errors.usuario.email.message}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="tipoUsuario"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Tipo de Usuário:
          </label>
          <select
            id="tipoUsuario"
            {...register("usuario.tipo")}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled
          >
            <option value="ADMIN">Administrador</option>
            <option value="MODERADOR">Moderador</option>
            <option value="ATENDENTE">Atendente</option>
            <option value="PROFISSIONAL" selected>
              Profissional
            </option>
          </select>
          {errors.usuario?.tipo && (
            <p className="text-red-500 text-xs italic">
              {errors.usuario.tipo.message}
            </p>
          )}
        </div>
      </div>

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

      {/* Dados do Profissional (Médico) */}
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
        Dados do Profissional (Médico)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="crm"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            CRM:
          </label>
          <input
            type="text"
            id="crm"
            {...register("crm")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.crm && (
            <p className="text-red-500 text-xs italic">{errors.crm.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="rqe"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            RQE (Opcional):
          </label>
          <input
            type="text"
            id="rqe"
            {...register("rqe")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.rqe && (
            <p className="text-red-500 text-xs italic">{errors.rqe.message}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="areaProfissional"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Área Profissional:
          </label>
          <select
            id="areaProfissional"
            {...register("area")}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="MEDICO">Médico</option>
            <option value="ENFERMAGEM">Enfermagem</option>
            <option value="TECNOLOGIA">Tecnologia</option>
            <option value="OUTRO">Outro</option>
          </select>
          {errors.area && (
            <p className="text-red-500 text-xs italic">{errors.area.message}</p>
          )}
        </div>
      </div>

      {/* Contatos (Opcional) */}
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
        Contatos (Opcional)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="mb-4">
          <label
            htmlFor="telefone"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Telefone:
          </label>
          <input
            type="tel"
            id="telefone"
            {...register("contatos.telefone")}
            placeholder="(DD) 99999-9999"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.contatos?.telefone && (
            <p className="text-red-500 text-xs italic">
              {errors.contatos.telefone.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="whatsapp"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            WhatsApp:
          </label>
          <input
            type="tel"
            id="whatsapp"
            {...register("contatos.whatsapp")}
            placeholder="(DD) 99999-9999"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.contatos?.whatsapp && (
            <p className="text-red-500 text-xs italic">
              {errors.contatos.whatsapp.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="emailAdicional"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email Adicional:
          </label>
          <input
            type="email"
            id="emailAdicional"
            {...register("contatos.email")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.contatos?.email && (
            <p className="text-red-500 text-xs italic">
              {errors.contatos.email.message}
            </p>
          )}
        </div>
      </div>

      {/* Localização (Opcional) */}
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
        Localização (Opcional)
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="mb-4">
          <label
            htmlFor="cidade"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Cidade:
          </label>
          <input
            type="text"
            id="cidade"
            {...register("localizacao.cidade")}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.localizacao?.cidade && (
            <p className="text-red-500 text-xs italic">
              {errors.localizacao.cidade.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="estado"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Estado (UF):
          </label>
          <input
            type="text"
            id="estado"
            {...register("localizacao.estado")}
            maxLength={2}
            placeholder="Ex: SP"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          {errors.localizacao?.estado && (
            <p className="text-red-500 text-xs italic">
              {errors.localizacao.estado.message}
            </p>
          )}
        </div>
      </div>

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

      {/* Informações Adicionais (Checkboxes) */}
      <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-700 border-b pb-2">
        Informações Adicionais
      </h3>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Especialidades:
        </label>
        <div className="flex flex-wrap gap-x-4">
          {/* Note o uso de 'value' como string para o input e conversão para number no Zod */}
          <div>
            <input
              type="checkbox"
              id="espCardio"
              value="1"
              {...register("especialidadeIds", { valueAsNumber: true })} // Garante que o valor seja number
              checked={watchedEspecialidadeIds.includes(1)}
              className="mr-2"
            />
            <label htmlFor="espCardio" className="text-gray-700">
              Cardiologia
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="espDermato"
              value="2"
              {...register("especialidadeIds", { valueAsNumber: true })}
              checked={watchedEspecialidadeIds.includes(2)}
              className="mr-2"
            />
            <label htmlFor="espDermato" className="text-gray-700">
              Dermatologia
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="espPediatria"
              value="3"
              {...register("especialidadeIds", { valueAsNumber: true })}
              checked={watchedEspecialidadeIds.includes(3)}
              className="mr-2"
            />
            <label htmlFor="espPediatria" className="text-gray-700">
              Pediatria
            </label>
          </div>
          {/* Exiba erros para especialidades, se houver */}
          {errors.especialidadeIds && (
            <p className="text-red-500 text-xs italic block w-full">
              {errors.especialidadeIds.message}
            </p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Hospitais Afiliados:
        </label>
        <div className="flex flex-wrap gap-x-4">
          <div>
            <input
              type="checkbox"
              id="hospA"
              value="uuid_hospital_A"
              {...register("hospitalIds")}
              checked={watchedHospitalIds.includes("uuid_hospital_A")}
              className="mr-2"
            />
            <label htmlFor="hospA" className="text-gray-700">
              Hospital A
            </label>
          </div>
          <div>
            <input
              type="checkbox"
              id="hospB"
              value="uuid_hospital_B"
              {...register("hospitalIds")}
              checked={watchedHospitalIds.includes("uuid_hospital_B")}
              className="mr-2"
            />
            <label htmlFor="hospB" className="text-gray-700">
              Hospital B
            </label>
          </div>
          {/* Exiba erros para hospitais, se houver */}
          {errors.hospitalIds && (
            <p className="text-red-500 text-xs italic block w-full">
              {errors.hospitalIds.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Cadastrar Funcionário
        </button>
      </div>
    </form>
  );
};

export default ProfissionalForm;
