import React, { useState } from "react";
import api from "@/axios";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSafeForm } from "@/hook/useSafeForm";
import { PrimaryButton } from "../button/PrimaryButton";
import Card from "../Card";
import { getError } from "@/utils/getError";
import { candidatoSchema, CandidatoInput } from "@/schemas/candidato.schema";
import PessoaForm from "@/components/form/PessoaForm";
import LocalizacaoForm from "@/components/form/LocalizacaoForm";
import FormacaoForm from "@/components/form/FormacaoForm";

import { AreaCandidatoEnum } from "@/schemas/candidato.schema";

type CandidatoFormProps = {
  formContexto?: UseFormReturn<CandidatoInput>;
  onSubmit?: (data: CandidatoInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<CandidatoInput>;
};

const CandidatoForm: React.FC<CandidatoFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [especialidades, setEspecialidades] = useState<
    { id: number; nome: string }[]
  >([]);

  const methods = useSafeForm<CandidatoInput>({
    mode: "independent",
    useFormProps: {
      resolver: zodResolver(candidatoSchema),
      mode: "onTouched",
      defaultValues: initialValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  // useEffect(() => {
  //   const fetchEspecialidades = async () => {
  //     try {
  //       // Suponha que você tenha um endpoint para buscar especialidades
  //       const response = await api.get<{ id: number; nome: string }[]>(
  //         "/api/especialidades"
  //       );
  //       setEspecialidades(response.data);
  //     } catch (error) {
  //       console.error("Erro ao carregar especialidades:", error);
  //     }
  //   };
  //   fetchEspecialidades();
  // }, []);

  const submitHandler = async (data: CandidatoInput) => {
    if (onSubmit) onSubmit(data);

    // Cria uma cópia mutável do payload para formatação de datas
    const payload: CandidatoInput = { ...data };

    // Formatação de datas para ISOString antes de enviar para a API
    // Assegura que o campo 'pessoa' e 'dataNascimento' existam antes de tentar acessá-los.
    if (payload.pessoa?.dataNascimento) {
      payload.pessoa.dataNascimento = new Date(
        payload.pessoa.dataNascimento
      ).toISOString();
    }

    // payload.formacoes?.forEach((formacao: any) => {
    //   if (formacao.dataConclusaoMedicina) {
    //     formacao.dataConclusaoMedicina = new Date(
    //       formacao.dataConclusaoMedicina
    //     ).toISOString();
    //   }
    //   if (formacao.dataConclusaoResidencia) {
    //     formacao.dataConclusaoResidencia = new Date(
    //       formacao.dataConclusaoResidencia
    //     ).toISOString();
    //   }
    // });

    setLoading(true);

    try {
      // Determina se é uma criação (POST) ou atualização (PUT)
      const endpoint = payload.id
        ? `/api/candidato/${payload.id}`
        : "/api/candidato";
      const method = payload.id ? api.put : api.post;

      const response = await method(endpoint, payload);
      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
        alert("Profissional salvo com sucesso!");
      }
    } catch (erro: any) {
      console.error("Erro ao salvar profissional:", erro);
      alert(
        "Erro ao salvar profissional: " +
          (erro?.response?.data?.message || "Erro desconhecido")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler as any)} className="space-y-6">
        <Card title="Dados Pessoais">
          <PessoaForm
            namePrefix="pessoa"
            contatoPessoa={{ title: "Contato" }}
          />
        </Card>

        <Card title="Endereço">
          <LocalizacaoForm namePrefix="pessoa.endereco" />
        </Card>

        <Card title="Formações Acadêmicas">
          <FormacaoForm namePrefix="" />
        </Card>

        <Card title="Dados Profissionais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="areaCandidato"
                className="block text-[#48038a] text-sm font-bold mb-2"
              >
                Área de Atuação:
              </label>
              <select
                id="areaCandidato"
                {...register("areaCandidato")}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Selecione...</option>
                {AreaCandidatoEnum.options.map((area) => (
                  <option key={area} value={area}>
                    {area.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
              {getError(errors, "areaCandidato") && (
                <p className="text-red-500 text-xs italic">
                  {getError(errors, "areaCandidato")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="especialidadeId"
                className="block text-[#48038a] text-sm font-bold mb-2"
              >
                Especialidade:
              </label>
              <select
                id="especialidadeId"
                {...register("especialidadeId", { valueAsNumber: true })} // Importante para IDs numéricos
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">Selecione...</option>
                {especialidades.map((esp) => (
                  <option key={esp.id} value={esp.id}>
                    {esp.nome}
                  </option>
                ))}
              </select>
              {getError(errors, "especialidadeId") && (
                <p className="text-red-500 text-xs italic">
                  {getError(errors, "especialidadeId")}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="crm"
                className="block text-[#48038a] text-sm font-bold mb-2"
              >
                CRM:
              </label>
              <input
                id="crm"
                type="text"
                {...register("crm")}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {getError(errors, "crm") && (
                <p className="text-red-500 text-xs italic">
                  {getError(errors, "crm")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="corem"
                className="block text-[#48038a] text-sm font-bold mb-2"
              >
                COREM:
              </label>
              <input
                id="corem"
                type="text"
                {...register("corem")}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {getError(errors, "corem") && (
                <p className="text-red-500 text-xs italic">
                  {getError(errors, "corem")}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="rqe"
                className="block text-[#48038a] text-sm font-bold mb-2"
              >
                RQE:
              </label>
              <input
                id="rqe"
                type="text"
                {...register("rqe")}
                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              {getError(errors, "rqe") && (
                <p className="text-red-500 text-xs italic">
                  {getError(errors, "rqe")}
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Profissional"}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default CandidatoForm;
