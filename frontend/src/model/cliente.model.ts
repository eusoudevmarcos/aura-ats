// src/model/cliente.model.ts

import { AreaProfissional, StatusCliente, TipoServico } from "@/schemas/enums";

export interface Cliente {
  id: string;
  empresaId: string;
  tipoServico: TipoServico[];
  profissionalId?: string | null;
  status: StatusCliente;
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
    area: AreaProfissional;
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
