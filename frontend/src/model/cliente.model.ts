// src/model/cliente.model.ts

import { StatusClienteEnumInput } from "@/schemas/statusClienteEnum.schema";
import { TipoServicoEnumInput } from "@/schemas/tipoServicoEnum.schema";

export interface Cliente {
  id: string;
  empresaId: string;
  tipoServico: TipoServicoEnumInput[];
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
      cep: string;
      cidade: string;
      bairro: string;
      uf: string;
      estado: string;
      complemento: string;
      logradouro: string;
      regiao: string;
    }[];
  };
  // profissionalId?: string | null;

  // profissional?: {
  //   id: string;
  //   area: AreaProfissionalEnumInput;
  //   crm?: string | null;
  //   corem?: string | null;
  //   rqe?: string | null;
  //   pessoa?: {
  //     id: string;
  //     nome: string;
  //     cpf?: string | null;
  //     dataNascimento?: string | null;
  //     rg?: string | null;
  //     estadoCivil?: string | null;
  //   } | null;
  // } | null;
}
