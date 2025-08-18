import React, { Children, useEffect, useState } from "react";
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
import { FormSelect } from "../input/FormSelect";
import { FormInput } from "../input/FormInput";

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

  const fetchEspecialidades = async () => {
    try {
      // Suponha que você tenha um endpoint para buscar especialidades
      const response = await api.get<{ id: number; nome: string }[]>(
        "/api/candidato/especialidades"
      );
      setEspecialidades(response.data);
    } catch (error) {
      console.error("Erro ao carregar especialidades:", error);
    }
  };

  useEffect(() => {
    fetchEspecialidades();
  }, []);

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
      // console.error("Erro ao salvar profissional:", erro);
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
          <LocalizacaoForm namePrefix="pessoa.localizacoes[0]" />
        </Card>

        {/* <Card title="Formações Acadêmicas">
          <FormacaoForm namePrefix="" />
        </Card> */}

        <Card title="Dados Profissionais">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormSelect
              name="areaCandidato"
              register={register}
              errors={errors}
              placeholder="Área de atuação"
              selectProps={{
                children: (
                  <>
                    {AreaCandidatoEnum.options.map((area) => (
                      <option key={area} value={area}>
                        {area.replaceAll("_", " ")}
                      </option>
                    ))}
                  </>
                ),
              }}
            ></FormSelect>

            <FormSelect
              name="especialidadeId"
              errors={errors}
              register={register}
              placeholder="Especialidade"
              selectProps={{
                children: (
                  <>
                    {especialidades.map((esp) => (
                      <option key={esp.id} value={esp.id}>
                        {esp.nome}
                      </option>
                    ))}
                  </>
                ),
              }}
            ></FormSelect>

            <FormInput name="crm" placeholder="CRM" register={register} />
            <FormInput name="corem" placeholder="COREM" register={register} />
            <FormInput name="rqe" placeholder="RQE" register={register} />
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
