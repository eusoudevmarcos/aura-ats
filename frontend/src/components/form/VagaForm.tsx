// src/components/form/VagaForm.tsx
import React, { useState, useEffect } from "react";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/axios";
import { useSafeForm } from "@/hook/useSafeForm";
import { PrimaryButton } from "../button/PrimaryButton";
// import Card from "../Card"; // Comentado no seu código, mantendo
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
  NivelExigidoEnum,
  TipoHabilidadeEnum,
  HabilidadeInput, // Importar para tipagem da renderChipContent
  BeneficioInput, // Importar para tipagem da renderChipContent
} from "@/schemas/vaga.schema";
import LocalizacaoForm from "./LocalizacaoForm";
import { FormArrayInput } from "../input/FormArrayInput";

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
  // const [clientes, setClientes] = useState<{ id: string; nome: string }[]>([]);

  const methods = useSafeForm<VagaInput>({
    mode: "independent",
    useFormProps: {
      resolver: zodResolver(vagaSchema),
      mode: "onTouched",
      // defaultValues: {
      //   ...initialValues,
      //   habilidades: initialValues?.habilidades || [],
      //   beneficios: initialValues?.beneficios || [],
      // },
    },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const submitHandler = async (data: any) => {
    console.log("aqui");
    if (onSubmit) onSubmit(data);

    const payload: VagaInput = { ...data };

    setLoading(true);

    try {
      const url = "/api/external/vaga";
      const endpoint = payload.id ? `${url}/${payload.id}` : url;
      const method = payload.id ? api.put : api.post;

      const response = await method(endpoint, payload);
      if (response.status >= 200 && response.status < 300) {
        onSuccess?.(response.data);
        alert("Vaga salva com sucesso!");
      }
    } catch (erro: any) {
      console.log("Erro ao salvar vaga:", erro);
      // alert(
      //   "Erro ao salvar vaga: " +
      //     (erro?.response?.data?.message || "Erro desconhecido")
      // );
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(submitHandler as any)}
        className="grid grid-cols-1 md:grid-cols-3 gap-x-1 space-y-2"
      >
        <FormInput
          name="titulo"
          register={register}
          placeholder="Título da Vaga"
          errors={errors}
        />

        <FormInput
          name="salario"
          register={register}
          placeholder="Salário"
          errors={errors}
          inputProps={{ type: "number", step: "0.01" }}
        />

        <FormSelect
          name="categoria"
          register={register}
          errors={errors}
          placeholder="Categoria da Vaga"
          selectProps={{
            children: (
              <>
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
                {StatusVagaEnum.options.map((stat) => (
                  <option key={stat} value={stat}>
                    {stat.replaceAll("_", " ")}
                  </option>
                ))}
              </>
            ),
          }}
        />

        <FormSelect
          name="tipoContrato"
          register={register}
          errors={errors}
          placeholder="Tipo de Contrato"
          selectProps={{
            children: (
              <>
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
                {NivelExperienciaEnum.options.map((nivel) => (
                  <option key={nivel} value={nivel}>
                    {nivel.replaceAll("_", " ")}
                  </option>
                ))}
              </>
            ),
          }}
        />

        {/*<FormSelect
          name="clienteId"
          register={register}
          errors={errors}
          placeholder="Cliente Contratante"
          selectProps={{
            children: (
              <>
                <option value="">Selecione o Cliente</option>
                {clientes.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.nome}
                  </option>
                ))}
              </>
            ),
          }}
        />*/}

        <FormTextarea
          name="descricao"
          register={register}
          placeholder="Descrição da Vaga"
          errors={errors}
          textareaProps={{ classNameContainer: "col-span-full" }}
        />

        <FormTextarea
          name="requisitos"
          register={register}
          placeholder="Requisitos (Opcional)"
          errors={errors}
          textareaProps={{ classNameContainer: "col-span-full" }}
        />

        <FormTextarea
          name="responsabilidades"
          register={register}
          placeholder="Responsabilidades (Opcional)"
          errors={errors}
          textareaProps={{ classNameContainer: "col-span-full" }}
        />

        <div className="col-span-full">
          {/* REMOVIDO: register={register} */}
          <FormArrayInput
            name="habilidades" // Nome do campo no schema principal
            title="Habilidades Necessárias"
            addButtonText="Adicionar Habilidade"
            fieldConfigs={[
              {
                name: "nome",
                label: "Nome da Habilidade",
                type: "text",
                required: true,
              },
              {
                name: "tipoHabilidade",
                label: "Tipo",
                component: "select",
                selectOptions: TipoHabilidadeEnum.options.map((opt) => ({
                  value: opt,
                  label: opt.replaceAll("_", " "),
                })),
              },
              {
                name: "nivelExigido",
                label: "Nível",
                component: "select",
                selectOptions: NivelExigidoEnum.options.map((opt) => ({
                  value: opt,
                  label: opt.replaceAll("_", " "),
                })),
              },
            ]}
            renderChipContent={(habilidade: HabilidadeInput) => (
              <>
                <span>{habilidade.nome}</span>
                {habilidade.tipoHabilidade && (
                  <span className="ml-1 opacity-80">
                    ({String(habilidade.tipoHabilidade).replaceAll("_", " ")})
                  </span>
                )}
                {habilidade.nivelExigido && (
                  <span className="ml-1 opacity-80">
                    [{String(habilidade.nivelExigido).replaceAll("_", " ")}]
                  </span>
                )}
              </>
            )}
            initialItemData={{ nome: "", tipoHabilidade: "", nivelExigido: "" }}
          />
        </div>

        <div className="col-span-full">
          {/* REMOVIDO: register={register} */}
          <FormArrayInput
            name="beneficios" // Nome do campo no schema principal
            title="Benefícios Oferecidos"
            addButtonText="Adicionar Benefício"
            fieldConfigs={[
              {
                name: "nome",
                label: "Nome do Benefício",
                type: "text",
                required: true,
              },
              {
                name: "descricao",
                label: "Descrição",
                type: "text",
                placeholder: "Ex: R$ 50,00 por dia",
              },
            ]}
            renderChipContent={(beneficio: BeneficioInput) => (
              <>
                <span>{beneficio.nome}</span>
                {beneficio.descricao && (
                  <span className="ml-1 opacity-80">
                    : {beneficio.descricao}
                  </span>
                )}
              </>
            )}
            initialItemData={{ nome: "", descricao: "" }}
          />
        </div>

        <div className="col-span-full">
          <LocalizacaoForm namePrefix="localizacao" />
        </div>

        <div className="flex justify-end col-span-full">
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar Vaga"}
          </PrimaryButton>
        </div>
      </form>
    </FormProvider>
  );
};

export default VagaForm;
