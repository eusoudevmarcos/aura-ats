import api from "@/axios";
import { funcionarioSchema } from "@/schemas/funcionario.schema";
import React, { useState, useEffect } from "react";
import z from "zod";
import { NoViewIcon, ViewIcon } from "../icons";

type FuncionarioFormData = z.infer<typeof funcionarioSchema>;

type FuncionarioFormProps = {
  onSuccess: (msg: boolean) => void;
  funcionarioData?: Partial<FuncionarioFormData>;
};

export function FuncionarioForm({
  onSuccess,
  funcionarioData,
}: FuncionarioFormProps) {
  const [formData, setFormData] = useState<Partial<FuncionarioFormData>>({
    tipoPessoaOuEmpresa: "pessoa",
    tipoUsuario: "MODERADOR",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Preenche o formulário com os dados recebidos via props para edição
  useEffect(() => {
    if (funcionarioData) {
      setFormData((prev) => ({
        ...prev,
        ...funcionarioData,
        // Garante que os objetos aninhados também sejam copiados corretamente
        pessoa: funcionarioData.pessoa
          ? { ...funcionarioData.pessoa }
          : prev.pessoa,
        empresa: funcionarioData.empresa
          ? { ...funcionarioData.empresa }
          : prev.empresa,
      }));
    }
  }, [funcionarioData]);

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
          ...(prev[parent as keyof FuncionarioFormData] || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    let validationData: any = { ...formData };
    if (formData.tipoPessoaOuEmpresa === "pessoa") {
      validationData.empresa = undefined;
    } else {
      validationData.pessoa = undefined;
    }

    const result = funcionarioSchema.safeParse(validationData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      if (result.error && Array.isArray(result.error.issues)) {
        result.error.issues.forEach((err) => {
          const path = err.path.join(".");
          fieldErrors[path] = err.message;
        });
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      // Se for edição, pode-se trocar o método para PUT/PATCH e endpoint, se necessário
      const isEdit = !!funcionarioData;
      const url = isEdit
        ? `/api/funcionario/update/${formData.tipoPessoaOuEmpresa}`
        : `/api/funcionario/create/${formData.tipoPessoaOuEmpresa}`;

      const response = await api.post(url, result.data);

      console.log("Resposta da API:", response.data);

      // Se quiser limpar o form após sucesso (apenas se não for edição):
      if (!isEdit) {
        setFormData({
          tipoPessoaOuEmpresa: "pessoa",
          tipoUsuario: "ADMIN",
        });
      }

      onSuccess(true);
    } catch (error: any) {
      onSuccess(false);
      console.error("Erro ao criar funcionário:", error);

      // Se a API retornar erros específicos, você pode setar aqui:
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
  }

  const inputClass =
    "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "block mb-1 font-medium text-gray-700";

  const errorClass = "text-red-600 text-sm mt-1";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="max-w-3xl mx-auto p-6 bg-white rounded-lg space-y-6"
    >
      {/* Tipo de Funcionário */}
      <div>
        <label htmlFor="tipoUsuario" className={labelClass}>
          Tipo de Funcionário:
        </label>
        <select
          id="tipoUsuario"
          name="tipoUsuario"
          value={formData.tipoUsuario}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MODERADOR">MODERADOR</option>
          <option value="ATENDENTE">ATENDENTE</option>
        </select>
        {errors.tipoUsuario && (
          <p className={errorClass}>{errors.tipoUsuario}</p>
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
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          required
          className={inputClass}
          autoComplete="email"
        />
        {errors.email && <p className={errorClass}>{errors.email}</p>}
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
            name="password"
            value={formData.password || ""}
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
        {errors.password && <p className={errorClass}>{errors.password}</p>}
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
            name="setor"
            value={formData.setor || ""}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.setor && <p className={errorClass}>{errors.setor}</p>}
        </div>
        <div>
          <label htmlFor="cargo" className={labelClass}>
            Cargo:
          </label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo || ""}
            onChange={handleChange}
            className={inputClass}
          />
          {errors.cargo && <p className={errorClass}>{errors.cargo}</p>}
        </div>
      </div>

      {/* Tipo de Pessoa ou Empresa */}
      <div>
        <label htmlFor="tipoPessoaOuEmpresa" className={labelClass}>
          Tipo de Funcionário (Pessoa ou Empresa)*:
        </label>
        <select
          id="tipoPessoaOuEmpresa"
          name="tipoPessoaOuEmpresa"
          value={formData.tipoPessoaOuEmpresa}
          onChange={handleChange}
          required
          className={inputClass}
        >
          <option value="pessoa">Pessoa</option>
          <option value="empresa">Empresa</option>
        </select>
        {errors.tipoPessoaOuEmpresa && (
          <p className={errorClass}>{errors.tipoPessoaOuEmpresa}</p>
        )}
      </div>

      {/* Dados da Pessoa */}
      {formData.tipoPessoaOuEmpresa === "pessoa" && (
        <div className="border p-4 rounded-md bg-gray-50 space-y-4">
          <h3 className="text-xl font-semibold mb-2">Dados da Pessoa</h3>

          <div>
            <label htmlFor="pessoa.nome" className={labelClass}>
              Nome*:
            </label>
            <input
              type="text"
              id="pessoa.nome"
              name="pessoa.nome"
              value={formData.pessoa?.nome || ""}
              onChange={handleChange}
              required
              className={inputClass}
            />
            {errors["pessoa.nome"] && (
              <p className={errorClass}>{errors["pessoa.nome"]}</p>
            )}
          </div>

          <div>
            <label htmlFor="pessoa.cpf" className={labelClass}>
              CPF:
            </label>
            <input
              type="text"
              id="pessoa.cpf"
              name="pessoa.cpf"
              value={formData.pessoa?.cpf || ""}
              onChange={handleChange}
              placeholder="Somente números, 11 dígitos"
              className={inputClass}
            />
            {errors["pessoa.cpf"] && (
              <p className={errorClass}>{errors["pessoa.cpf"]}</p>
            )}
          </div>

          <div>
            <label htmlFor="pessoa.dataNascimento" className={labelClass}>
              Data de Nascimento:
            </label>
            <input
              type="date"
              id="pessoa.dataNascimento"
              name="pessoa.dataNascimento"
              value={formData.pessoa?.dataNascimento || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors["pessoa.dataNascimento"] && (
              <p className={errorClass}>{errors["pessoa.dataNascimento"]}</p>
            )}
          </div>

          <div>
            <label htmlFor="pessoa.estadoCivil" className={labelClass}>
              Estado Civil:
            </label>
            <select
              id="pessoa.estadoCivil"
              name="pessoa.estadoCivil"
              value={formData.pessoa?.estadoCivil || ""}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="">-- Selecione --</option>
              <option value="SOLTEIRO">Solteiro</option>
              <option value="CASADO">Casado</option>
              <option value="DIVORCIADO">Divorciado</option>
              <option value="VIUVO">Viúvo</option>
              <option value="SEPARADO">Separado</option>
              <option value="UNIAO_ESTAVEL">União Estável</option>
            </select>
            {errors["pessoa.estadoCivil"] && (
              <p className={errorClass}>{errors["pessoa.estadoCivil"]}</p>
            )}
          </div>

          <div>
            <label htmlFor="pessoa.rg" className={labelClass}>
              RG:
            </label>
            <input
              type="text"
              id="pessoa.rg"
              name="pessoa.rg"
              value={formData.pessoa?.rg || ""}
              onChange={handleChange}
              placeholder="Apenas números"
              className={inputClass}
            />
            {errors["pessoa.rg"] && (
              <p className={errorClass}>{errors["pessoa.rg"]}</p>
            )}
          </div>
        </div>
      )}

      {/* Dados da Empresa */}
      {formData.tipoPessoaOuEmpresa === "empresa" && (
        <div className="border p-4 rounded-md bg-gray-50 space-y-4">
          <h3 className="text-xl font-semibold mb-2">Dados da Empresa</h3>

          <div>
            <label htmlFor="empresa.razaoSocial" className={labelClass}>
              Razão Social*:
            </label>
            <input
              type="text"
              id="empresa.razaoSocial"
              name="empresa.razaoSocial"
              value={formData.empresa?.razaoSocial || ""}
              onChange={handleChange}
              required
              className={inputClass}
            />
            {errors["empresa.razaoSocial"] && (
              <p className={errorClass}>{errors["empresa.razaoSocial"]}</p>
            )}
          </div>

          <div>
            <label htmlFor="empresa.cnpj" className={labelClass}>
              CNPJ*:
            </label>
            <input
              type="text"
              id="empresa.cnpj"
              name="empresa.cnpj"
              value={formData.empresa?.cnpj || ""}
              onChange={handleChange}
              placeholder="Somente números, 14 dígitos"
              required
              className={inputClass}
            />
            {errors["empresa.cnpj"] && (
              <p className={errorClass}>{errors["empresa.cnpj"]}</p>
            )}
          </div>

          <div>
            <label htmlFor="empresa.dataAbertura" className={labelClass}>
              Data de Abertura:
            </label>
            <input
              type="date"
              id="empresa.dataAbertura"
              name="empresa.dataAbertura"
              value={formData.empresa?.dataAbertura || ""}
              onChange={handleChange}
              className={inputClass}
            />
            {errors["empresa.dataAbertura"] && (
              <p className={errorClass}>{errors["empresa.dataAbertura"]}</p>
            )}
          </div>
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
