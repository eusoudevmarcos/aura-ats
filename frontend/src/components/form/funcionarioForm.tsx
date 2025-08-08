import React, { useState } from "react";
import { z } from "zod";

// Schema Zod para validação
const contatoSchema = z.object({
  telefone: z.string().optional(),
  whatsapp: z.string().optional(),
  email: z.email().optional(),
});

const localizacaoSchema = z.object({
  cidade: z.string().min(1, "Cidade é obrigatório"),
  estado: z.string().min(2, "Estado é obrigatório"),
});

const formacaoSchema = z.object({
  dataConclusaoMedicina: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
  dataConclusaoResidencia: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
});

const pessoaSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
  cpf: z
    .string()
    .regex(/^\d{11}$/, "CPF deve ter 11 números")
    .optional(),
  dataNascimento: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
  estadoCivil: z
    .enum([
      "SOLTEIRO",
      "CASADO",
      "DIVORCIADO",
      "VIUVO",
      "SEPARADO",
      "UNIAO_ESTAVEL",
    ])
    .optional(),
  rg: z.string().regex(/^\d+$/, "RG deve conter só números").optional(),
  contatos: z.array(contatoSchema).optional(),
  localizacoes: z.array(localizacaoSchema).optional(),
  formacoes: z.array(formacaoSchema).optional(),
});

const empresaSchema = z.object({
  razaoSocial: z.string().min(1, "Razão social é obrigatória"),
  cnpj: z.string().regex(/^\d{14}$/, "CNPJ deve ter 14 números"),
  dataAbertura: z
    .string()
    .optional()
    .refine((date) => !date || !isNaN(Date.parse(date)), "Data inválida"),
  contatos: z.array(contatoSchema).optional(),
  localizacoes: z.array(localizacaoSchema).optional(),
});

const funcionarioSchema = z.object({
  tipoUsuario: z.enum([
    "ADMIN",
    "MODERADOR",
    "ATENDENTE",
    "PROFISSIONAL",
    "FUNCIONARIO",
  ]),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  setor: z.string().optional(),
  cargo: z.string().optional(),

  tipoPessoaOuEmpresa: z.enum(["pessoa", "empresa"]),

  pessoa: pessoaSchema.optional(),
  empresa: empresaSchema.optional(),
});

type FuncionarioFormData = z.infer<typeof funcionarioSchema>;

export function FuncionarioForm() {
  const [formData, setFormData] = useState<Partial<FuncionarioFormData>>({
    tipoPessoaOuEmpresa: "pessoa",
    tipoUsuario: "FUNCIONARIO",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Para campos aninhados como pessoa.nome, empresa.cnpj etc
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validação
    let validationData: any = { ...formData };
    if (formData.tipoPessoaOuEmpresa === "pessoa") {
      validationData.empresa = undefined; // remove empresa
    } else {
      validationData.pessoa = undefined; // remove pessoa
    }

    const result = funcionarioSchema.safeParse(validationData);

    if (!result.success) {
      // Extrai mensagens de erro do ZodError
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

    // Aqui você pode enviar `result.data` para API / backend
    console.log("Formulário válido:", result.data);
    alert("Funcionário criado com sucesso!");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2>Cadastrar Funcionário</h2>

      <label>
        Tipo de Funcionário:
        <select
          name="tipoUsuario"
          value={formData.tipoUsuario}
          onChange={handleChange}
          required
        >
          <option value="ADMIN">ADMIN</option>
          <option value="MODERADOR">MODERADOR</option>
          <option value="ATENDENTE">ATENDENTE</option>
          <option value="PROFISSIONAL">PROFISSIONAL</option>
          <option value="FUNCIONARIO">FUNCIONARIO</option>
        </select>
        {errors.tipoUsuario && (
          <p style={{ color: "red" }}>{errors.tipoUsuario}</p>
        )}
      </label>

      <label>
        Email*:
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          required
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
      </label>

      <label>
        Senha*:
        <input
          type="password"
          name="password"
          value={formData.password || ""}
          onChange={handleChange}
          required
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
      </label>

      <label>
        Setor:
        <input
          type="text"
          name="setor"
          value={formData.setor || ""}
          onChange={handleChange}
        />
        {errors.setor && <p style={{ color: "red" }}>{errors.setor}</p>}
      </label>

      <label>
        Cargo:
        <input
          type="text"
          name="cargo"
          value={formData.cargo || ""}
          onChange={handleChange}
        />
        {errors.cargo && <p style={{ color: "red" }}>{errors.cargo}</p>}
      </label>

      <label>
        Tipo de Funcionário (Pessoa ou Empresa)*:
        <select
          name="tipoPessoaOuEmpresa"
          value={formData.tipoPessoaOuEmpresa}
          onChange={handleChange}
          required
        >
          <option value="pessoa">Pessoa</option>
          <option value="empresa">Empresa</option>
        </select>
        {errors.tipoPessoaOuEmpresa && (
          <p style={{ color: "red" }}>{errors.tipoPessoaOuEmpresa}</p>
        )}
      </label>

      {formData.tipoPessoaOuEmpresa === "pessoa" && (
        <>
          <h3>Dados da Pessoa</h3>

          <label>
            Nome*:
            <input
              type="text"
              name="pessoa.nome"
              value={formData.pessoa?.nome || ""}
              onChange={handleChange}
              required
            />
            {errors["pessoa.nome"] && (
              <p style={{ color: "red" }}>{errors["pessoa.nome"]}</p>
            )}
          </label>

          <label>
            CPF:
            <input
              type="text"
              name="pessoa.cpf"
              value={formData.pessoa?.cpf || ""}
              onChange={handleChange}
              placeholder="Somente números, 11 dígitos"
            />
            {errors["pessoa.cpf"] && (
              <p style={{ color: "red" }}>{errors["pessoa.cpf"]}</p>
            )}
          </label>

          <label>
            Data de Nascimento:
            <input
              type="date"
              name="pessoa.dataNascimento"
              value={formData.pessoa?.dataNascimento || ""}
              onChange={handleChange}
            />
            {errors["pessoa.dataNascimento"] && (
              <p style={{ color: "red" }}>{errors["pessoa.dataNascimento"]}</p>
            )}
          </label>

          <label>
            Estado Civil:
            <select
              name="pessoa.estadoCivil"
              value={formData.pessoa?.estadoCivil || ""}
              onChange={handleChange}
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
              <p style={{ color: "red" }}>{errors["pessoa.estadoCivil"]}</p>
            )}
          </label>

          <label>
            RG:
            <input
              type="text"
              name="pessoa.rg"
              value={formData.pessoa?.rg || ""}
              onChange={handleChange}
              placeholder="Apenas números"
            />
            {errors["pessoa.rg"] && (
              <p style={{ color: "red" }}>{errors["pessoa.rg"]}</p>
            )}
          </label>

          {/* Para simplificar, aqui pode adicionar campos para contatos, localizacoes e formacoes se quiser */}
        </>
      )}

      {formData.tipoPessoaOuEmpresa === "empresa" && (
        <>
          <h3>Dados da Empresa</h3>

          <label>
            Razão Social*:
            <input
              type="text"
              name="empresa.razaoSocial"
              value={formData.empresa?.razaoSocial || ""}
              onChange={handleChange}
              required
            />
            {errors["empresa.razaoSocial"] && (
              <p style={{ color: "red" }}>{errors["empresa.razaoSocial"]}</p>
            )}
          </label>

          <label>
            CNPJ*:
            <input
              type="text"
              name="empresa.cnpj"
              value={formData.empresa?.cnpj || ""}
              onChange={handleChange}
              placeholder="Somente números, 14 dígitos"
              required
            />
            {errors["empresa.cnpj"] && (
              <p style={{ color: "red" }}>{errors["empresa.cnpj"]}</p>
            )}
          </label>

          <label>
            Data de Abertura:
            <input
              type="date"
              name="empresa.dataAbertura"
              value={formData.empresa?.dataAbertura || ""}
              onChange={handleChange}
            />
            {errors["empresa.dataAbertura"] && (
              <p style={{ color: "red" }}>{errors["empresa.dataAbertura"]}</p>
            )}
          </label>

          {/* Também pode expandir para contatos e localizações aqui */}
        </>
      )}

      <button type="submit">Cadastrar Funcionário</button>
    </form>
  );
}
