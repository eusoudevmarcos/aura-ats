// src/components/form/VagaForm.tsx
import React, { useState, useEffect } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/axios";
import { useSafeForm } from "@/hook/useSafeForm";
import { PrimaryButton } from "../button/PrimaryButton";
import Card from "../Card";
import { FormInput } from "../input/FormInput";
import { FormSelect } from "../input/FormSelect";
import { FormTextarea } from "../input/FormTextarea";

import {
  vagaSchema,
  VagaInput,
  CategoriaVagaEnum,
  StatusVagaEnum,
  TipoContratoEnum,
  NivelExperienciaEnum,
} from "@/schemas/vaga.schema";

type VagaFormProps = {
  formContexto?: UseFormReturn<VagaInput>;
  onSubmit?: (data: VagaInput) => void;
  onSuccess?: (data: any) => void;
  initialValues?: Partial<VagaInput>;
};

const VagaForm: React.FC<VagaFormProps> = ({
  onSubmit,
  onSuccess,
  initialValues,
}) => {
  const [loading, setLoading] = useState(false);
  const [empresas, setEmpresas] = useState<{ id: string; nome: string }[]>([]);

  const methods = useSafeForm<VagaInput>({
    mode: "independent",
    useFormProps: {
      resolver: zodResolver(vagaSchema),
      mode: "onTouched",
      defaultValues: initialValues,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    const fetchEmpresas = async () => {
      try {
        const response = await api.get<{ id: string; nome: string }[]>(
          "/api/empresas"
        );
        setEmpresas(response.data);
      } catch (error) {
        console.error("Erro ao carregar empresas:", error);
      }
    };
    fetchEmpresas();
  }, []);

  const submitHandler = async (data: VagaInput) => {
    if (onSubmit) onSubmit(data);

    const payload: VagaInput = { ...data };

    // if (payload.dataPublicacao) {
    //   payload.dataPublicacao = new Date(payload.dataPublicacao);
    // }
    // if (payload.dataFechamento) {
    //   payload.dataFechamento = new Date(payload.dataFechamento);
    // }

    setLoading(true);

    try {
      const endpoint = payload.id ? `/api/vaga/${payload.id}` : "/api/vaga";
      const method = payload.id ? api.put : api.post;

      const response = await method(endpoint, payload);
      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
        alert("Vaga salva com sucesso!");
      }
    } catch (erro: any) {
      console.error("Erro ao salvar vaga:", erro);
      alert(
        "Erro ao salvar vaga: " +
          (erro?.response?.data?.message || "Erro desconhecido")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(submitHandler as any)} className="space-y-6">
        <Card title="Dados da Vaga">
          <FormInput
            name="titulo"
            register={register}
            placeholder="Título da Vaga"
            errors={errors}
          />
          <FormTextarea
            name="descricao"
            register={register}
            placeholder="Descrição da Vaga"
            errors={errors}
          />
          <FormTextarea
            name="requisitos"
            register={register}
            placeholder="Requisitos (Opcional)"
            errors={errors}
          />
          <FormTextarea
            name="responsabilidades"
            register={register}
            placeholder="Responsabilidades (Opcional)"
            errors={errors}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="salarioMinimo"
              register={register}
              placeholder="Salário Mínimo (R$)"
              errors={errors}
              inputProps={{ type: "number", step: "0.01" }}
            />
            <FormInput
              name="salarioMaximo"
              register={register}
              placeholder="Salário Máximo (R$)"
              errors={errors}
              inputProps={{ type: "number", step: "0.01" }}
            />
          </div>

          <FormInput
            name="localizacao"
            register={register}
            placeholder="Localização da Vaga"
            errors={errors}
          />

          <FormSelect
            name="categoria"
            register={register}
            errors={errors}
            placeholder="Categoria da Vaga"
            selectProps={{
              children: (
                <>
                  <option value="">Selecione a Categoria</option>
                  {CategoriaVagaEnum.options.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replaceAll("_", " ")}
                    </option>
                  ))}
                </>
              ),
            }}
          />

          <FormSelect
            name="status"
            register={register}
            errors={errors}
            placeholder="Status da Vaga"
            selectProps={{
              children: (
                <>
                  <option value="">Selecione o Status</option>
                  {StatusVagaEnum.options.map((stat) => (
                    <option key={stat} value={stat}>
                      {stat.replaceAll("_", " ")}
                    </option>
                  ))}
                </>
              ),
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              name="dataPublicacao"
              register={register}
              placeholder="Data de Publicação"
              errors={errors}
              inputProps={{ type: "date" }}
            />
            <FormInput
              name="dataFechamento"
              register={register}
              placeholder="Data de Fechamento (Opcional)"
              errors={errors}
              inputProps={{ type: "date" }}
            />
          </div>

          <FormSelect
            name="tipoContrato"
            register={register}
            errors={errors}
            placeholder="Tipo de Contrato"
            selectProps={{
              children: (
                <>
                  <option value="">Selecione o Tipo de Contrato</option>
                  {TipoContratoEnum.options.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo.replaceAll("_", " ")}
                    </option>
                  ))}
                </>
              ),
            }}
          />

          <FormSelect
            name="nivelExperiencia"
            register={register}
            errors={errors}
            placeholder="Nível de Experiência"
            selectProps={{
              children: (
                <>
                  <option value="">Selecione o Nível</option>
                  {NivelExperienciaEnum.options.map((nivel) => (
                    <option key={nivel} value={nivel}>
                      {nivel.replaceAll("_", " ")}
                    </option>
                  ))}
                </>
              ),
            }}
          />

          <FormSelect
            name="empresaId"
            register={register}
            errors={errors}
            placeholder="Empresa Contratante"
            selectProps={{
              children: (
                <>
                  <option value="">Selecione a Empresa</option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.nome}
                    </option>
                  ))}
                </>
              ),
            }}
          />
        </Card>

        <div className="flex justify-end">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Vaga"}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default VagaForm;
