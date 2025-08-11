import React, { useState, useEffect } from "react";
import api from "@/axios";
import { FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FuncionarioInput,
  funcionarioSchema,
} from "@/schemas/funcionario.schema";
import { useSafeForm } from "@/hook/useSafeForm";

import PessoaForm from "@/components/form/PessoaForm";
import EmpresaForm from "@/components/form/EmpresaForm";
import { makeName } from "@/utils/makeName";
import { FormInput } from "../input/FormInput";
import { FormSelect } from "../input/FormSelect";
import Card from "../Card";
import { PessoaInput } from "@/schemas/pessoa.schema";

type FuncionarioFormProps = {
  onSuccess: (msg: boolean) => void;
  funcionarioData?: Partial<FuncionarioInput>;
};

export const FuncionarioForm = ({
  onSuccess,
  funcionarioData,
}: FuncionarioFormProps) => {
  const methods = useSafeForm<FuncionarioInput>({
    mode: "independent",
    useFormProps: {
      resolver: zodResolver(funcionarioSchema),
      mode: "onTouched",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = methods;

  const [formData, setFormData] = useState<Partial<FuncionarioInput>>({
    tipoPessoaOuEmpresa: "pessoa",
    tipoUsuario: "MODERADOR",
  });
  const [tipoPessoaOuEmpresa, setTipoPessoaOuEmpresa] =
    React.useState("pessoa");

  const email = makeName<FuncionarioInput>("funcionario", "email");
  const senha = makeName<FuncionarioInput>("funcionario", "senha");
  const setor = makeName<FuncionarioInput>("funcionario", "setor");
  const cargo = makeName<FuncionarioInput>("funcionario", "cargo");
  const tipoPessoa = makeName<FuncionarioInput>("funcionario", "tipoPessoa");

  useEffect(() => {
    if (funcionarioData) {
      setFormData((prev) => ({
        ...prev,
        ...funcionarioData,
        pessoa: funcionarioData.pessoa
          ? { ...funcionarioData.pessoa }
          : prev.pessoa,
        empresa: funcionarioData.empresa
          ? { ...funcionarioData.empresa }
          : prev.empresa,
      }));

      // Atualiza os valores do react-hook-form
      Object.entries(funcionarioData).forEach(([key, value]) => {
        if (key === "pessoa" && value) {
          Object.entries(value as PessoaInput).forEach(([k, v]) => {
            setValue(`pessoa.${k}` as any, v);
          });
        } else if (key === "empresa" && value) {
          Object.entries(value as PessoaInput).forEach(([k, v]) => {
            setValue(`empresa.${k}` as any, v);
          });
        } else {
          setValue(key as keyof FuncionarioInput, value as any);
        }
      });
    }
  }, [funcionarioData, setValue]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    setTipoPessoaOuEmpresa(e.target.value);
  }

  async function onSubmit(data: FuncionarioInput): Promise<void> {
    // Monta os dados para validação e envio
    const validationData: any = { ...data };
    if (data.tipoPessoaOuEmpresa === "pessoa") {
      Object.assign(validationData.empresa, undefined);
    } else {
      Object.assign(validationData.pessoa, undefined);
    }

    const result = funcionarioSchema.safeParse(validationData);

    if (!result.success) {
      return;
    }

    try {
      const isEdit = !!funcionarioData;
      const url = isEdit
        ? `/api/funcionario/update/${data.tipoPessoaOuEmpresa}`
        : `/api/funcionario/create/${data.tipoPessoaOuEmpresa}`;

      await api.post(url, result.data);

      if (!isEdit) {
        setFormData({
          tipoPessoaOuEmpresa: "pessoa",
          tipoUsuario: "ADMIN",
        });
        methods.reset({
          tipoPessoaOuEmpresa: "pessoa",
          tipoUsuario: "ADMIN",
        });
      }

      onSuccess(true);
    } catch (error: any) {
      onSuccess(false);
      console.error("Erro ao criar funcionário:", error);
    }
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="max-w-3xl mx-auto bg-white rounded-lg space-y-6"
      >
        <Card
          title="Dados de Acesso"
          classNameContent="grid grid-cols-1 md:grid-cols-4 gap-2"
        >
          <FormSelect
            name={tipoPessoa}
            register={register}
            errors={errors}
            placeholder="Tipo de funcionario"
            selectProps={{
              classNameContainer: "col-span-4",
              children: (
                <>
                  <option value="ADMIN">ADMIN</option>
                  <option value="MODERADOR">MODERADOR</option>
                  <option value="ATENDENTE">ATENDENTE</option>
                </>
              ),
            }}
          />

          <FormInput
            name={email}
            register={register}
            placeholder="email de login"
            errors={errors}
          />

          <FormInput
            name={senha}
            register={register}
            placeholder="Senha"
            errors={errors}
          />

          <FormInput
            name={setor}
            register={register}
            placeholder="Setor"
            errors={errors}
          />

          <FormInput
            name={cargo}
            register={register}
            placeholder="Cargo"
            errors={errors}
          />
        </Card>

        <FormSelect
          name="tipoPessoaOuEmpresa"
          label="Tipo de Funcionário (Pessoa ou Empresa)*"
          value={tipoPessoaOuEmpresa}
          onChange={handleChange}
          required
          selectProps={{
            classNameContainer: "px-4",
            children: (
              <>
                <option value="pessoa">Pessoa</option>
                <option value="empresa">Empresa</option>
              </>
            ),
          }}
        />

        {tipoPessoaOuEmpresa === "pessoa" && <PessoaForm />}

        {tipoPessoaOuEmpresa === "empresa" && <EmpresaForm />}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
        >
          {funcionarioData ? "Salvar Alterações" : "Cadastrar Funcionário"}
        </button>
      </form>
    </FormProvider>
  );
};
