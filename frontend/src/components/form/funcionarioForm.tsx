import api from "@/axios";
import { funcionarioSchema } from "@/schemas/funcionario.schema";
import React, { useState, useEffect } from "react";
import z from "zod";
import { NoViewIcon, ViewIcon } from "../icons";

import PessoaForm, { PessoaFormData } from "@/components/form/PessoaForm";
import EmpresaForm from "@/components/form/EmpresaForm";
import { useForm, UseFormReturn } from "react-hook-form";
import { EmpresaSectionInput } from "@/schemas/empresa.schema";

// Tipagem ajustada para corresponder ao schema do funcionário
type FuncionarioFormData = z.infer<typeof funcionarioSchema>;

type FuncionarioFormProps = {
  onSuccess: (msg: boolean) => void;
  funcionarioData?: Partial<FuncionarioFormData>;
};

export function FuncionarioForm({
  onSuccess,
  funcionarioData,
}: FuncionarioFormProps) {
  // Estado para os dados do formulário
  const [formData, setFormData] = useState<Partial<FuncionarioFormData>>({
    tipoPessoaOuEmpresa: "pessoa",
    tipoUsuario: "MODERADOR",
  });

  // useForm tipado corretamente para FuncionarioFormData
  const formContexto = useForm<FuncionarioFormData>({
    defaultValues: funcionarioData
      ? {
          ...funcionarioData,
          pessoa: funcionarioData.pessoa
            ? { ...funcionarioData.pessoa }
            : undefined,
          empresa: funcionarioData.empresa
            ? { ...funcionarioData.empresa }
            : undefined,
        }
      : {
          tipoPessoaOuEmpresa: "pessoa",
          tipoUsuario: "MODERADOR",
        },
    mode: "onTouched",
  });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = formContexto;

  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Atualiza o estado local e o react-hook-form ao receber dados externos
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
          Object.entries(value as PessoaFormData).forEach(([k, v]) => {
            setValue(`pessoa.${k}` as any, v);
          });
        } else if (key === "empresa" && value) {
          Object.entries(value as PessoaFormData).forEach(([k, v]) => {
            setValue(`empresa.${k}` as any, v);
          });
        } else {
          setValue(key as keyof FuncionarioFormData, value as any);
        }
      });
    }
  }, [funcionarioData, setValue]);

  // Atualiza o estado local e o react-hook-form ao digitar
  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...((prev[parent as keyof FuncionarioFormData] || {}) as any),
          [child]: value,
        },
      }));
      setValue(name as any, value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      setValue(name as keyof FuncionarioFormData, value as any);
    }
  }

  async function onSubmit(data: FuncionarioFormData): Promise<void> {
    // Monta os dados para validação e envio
    let validationData: any = { ...data };
    if (data.tipoPessoaOuEmpresa === "pessoa") {
      validationData.empresa = undefined;
    } else {
      validationData.pessoa = undefined;
    }

    const result = funcionarioSchema.safeParse(validationData);

    if (!result.success) {
      // Aqui você pode tratar os erros de validação se quiser
      return;
    }

    try {
      const isEdit = !!funcionarioData;
      const url = isEdit
        ? `/api/funcionario/update/${data.tipoPessoaOuEmpresa}`
        : `/api/funcionario/create/${data.tipoPessoaOuEmpresa}`;

      const response = await api.post(url, result.data);

      console.log("Resposta da API:", response.data);

      if (!isEdit) {
        setFormData({
          tipoPessoaOuEmpresa: "pessoa",
          tipoUsuario: "ADMIN",
        });
        formContexto.reset({
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

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "block mb-1 font-medium text-gray-700";

  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="max-w-3xl mx-auto p-6 bg-white rounded-lg space-y-6"
    >
      <div>
        <label htmlFor="tipoUsuario" className={labelClass}>
          Tipo de Funcionário:
        </label>
        <select
          id="tipoUsuario"
          {...register("tipoUsuario")}
          value={watch("tipoUsuario")}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MODERADOR">MODERADOR</option>
          <option value="ATENDENTE">ATENDENTE</option>
        </select>
        {errors.tipoUsuario && (
          <p className={errorClass}>{errors.tipoUsuario.message as string}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email*:
        </label>
        <input
          type="email"
          id="email"
          {...register("email")}
          value={watch("email") || ""}
          onChange={handleChange}
          required
          className={inputClass}
          autoComplete="email"
        />
        {errors.email && (
          <p className={errorClass}>{errors.email.message as string}</p>
        )}
      </div>

      {/* Senha */}
      <div>
        <label htmlFor="password" className={labelClass}>
          Senha*:
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            {...register("password")}
            value={watch("password") || ""}
            onChange={handleChange}
            required
            className={inputClass + " pr-10"}
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
            onClick={() => setShowPassword((prev: boolean) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
          >
            {showPassword ? <ViewIcon /> : <NoViewIcon />}
          </button>
        </div>
        {errors.password && (
          <p className={errorClass}>{errors.password.message as string}</p>
        )}
      </div>

      {/* Setor e Cargo lado a lado */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="setor" className={labelClass}>
            Setor:
          </label>
          <input
            type="text"
            id="setor"
            {...register("setor")}
            value={watch("setor") || ""}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.setor && (
            <p className={errorClass}>{errors.setor.message as string}</p>
          )}
        </div>
        <div>
          <label htmlFor="cargo" className={labelClass}>
            Cargo:
          </label>
          <input
            type="text"
            id="cargo"
            {...register("cargo")}
            value={watch("cargo") || ""}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.cargo && (
            <p className={errorClass}>{errors.cargo.message as string}</p>
          )}
        </div>
      </div>

      {/* Tipo de Pessoa ou Empresa */}
      <div>
        <label htmlFor="tipoPessoaOuEmpresa" className={labelClass}>
          Tipo de Funcionário (Pessoa ou Empresa)*:
        </label>
        <select
          id="tipoPessoaOuEmpresa"
          {...register("tipoPessoaOuEmpresa")}
          value={watch("tipoPessoaOuEmpresa")}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="pessoa">Pessoa</option>
          <option value="empresa">Empresa</option>
        </select>
        {errors.tipoPessoaOuEmpresa && (
          <p className={errorClass}>
            {errors.tipoPessoaOuEmpresa.message as string}
          </p>
        )}
      </div>

      {/* Dados da Pessoa */}
      {watch("tipoPessoaOuEmpresa") === "pessoa" && (
        <div className="border p-4 rounded-md bg-gray-50 space-y-4">
          <h3 className="text-xl font-semibold mb-2">Dados da Pessoa</h3>
          {/* Passa o contexto do formulário para o PessoaForm */}
          <PessoaForm
            formContexto={
              formContexto as unknown as UseFormReturn<PessoaFormData>
            }
          />
        </div>
      )}

      {/* Dados da Empresa */}
      {watch("tipoPessoaOuEmpresa") === "empresa" && (
        <div className="border p-4 rounded-md bg-gray-50 space-y-4">
          <h3 className="text-xl font-semibold mb-2">Dados da Empresa</h3>
          <EmpresaForm
            formContexto={
              formContexto as unknown as UseFormReturn<EmpresaSectionInput>
            }
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md transition-colors"
      >
        {funcionarioData ? "Salvar Alterações" : "Cadastrar Funcionário"}
      </button>
    </form>
  );
}
