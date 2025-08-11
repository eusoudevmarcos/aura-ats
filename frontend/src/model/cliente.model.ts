// src/model/cliente.model.ts

import { AreaProfissionalEnumInput } from "@/schemas/areaProfissionalEnum.schama";
import { StatusClienteEnumInput } from "@/schemas/statusClienteEnum.schema";
import { TipoServicoEnumInput } from "@/schemas/tipoServicoEnum.schema";

export interface Cliente {
  id: string;
  empresaId: string;
  tipoServico: TipoServicoEnumInput[];
  profissionalId?: string | null;
  status: StatusClienteEnumInput;
  empresa: {
    id: string;
    razaoSocial: string;
    cnpj: string;
    dataAbertura?: string | null;
    contatos: {
      id: string;
      telefone?: string | null;
      whatsapp?: string | null;
      email?: string | null;
    }[];
    localizacoes: {
      id: string;
      cidade: string;
      estado: string;
    }[];
  };
  profissional?: {
    id: string;
    area: AreaProfissionalEnumInput;
    crm?: string | null;
    corem?: string | null;
    rqe?: string | null;
    pessoa?: {
      id: string;
      nome: string;
      cpf?: string | null;
      dataNascimento?: string | null;
      rg?: string | null;
      estadoCivil?: string | null;
    } | null;
  } | null;
}
