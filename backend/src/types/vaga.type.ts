import { Prisma } from "@prisma/client";
import {
  AnexoCreateOrConnectNested,
  BeneficioCreateOrConnectNested,
  EventoAgendaInput,
  HabilidadeCreateOrConnectNested,
  LocalizacaoCreateOrConnectNested,
  ProcessoSeletivoEtapaInput,
} from "./prisma.types";

export type VagaHabilidadeCreateInput = {
  habilidade: HabilidadeCreateOrConnectNested;
  nivelExigido?: string;
};

export type VagaBeneficioCreateInput = {
  beneficio: BeneficioCreateOrConnectNested;
};

export type VagaAnexoCreateInput = {
  anexo: AnexoCreateOrConnectNested;
};

export type VagaCreateUpdateInput = Omit<
  Prisma.VagaCreateInput,
  | "cliente"
  | "localizacao"
  | "habilidades"
  | "beneficios"
  | "anexos"
  | "ProcessoSeletivoEtapa"
  | "eventosAgenda"
  | "candidatos"
  | "CandidaturaVaga"
> & {
  id?: string;
  cliente: { connect: Prisma.ClienteWhereUniqueInput };
  localizacao?: LocalizacaoCreateOrConnectNested;
  habilidades?: {
    create?: VagaHabilidadeCreateInput[];
    update?: {
      where: Prisma.VagaHabilidadeWhereUniqueInput;
      data: Omit<VagaHabilidadeCreateInput, "habilidade">;
    }[];
    delete?: Prisma.VagaHabilidadeWhereUniqueInput[];
  };
  beneficios?: {
    create?: VagaBeneficioCreateInput[];
    delete?: Prisma.VagaBeneficioWhereUniqueInput[];
  };
  anexos?: {
    create?: VagaAnexoCreateInput[];
    delete?: Prisma.VagaAnexoWhereUniqueInput[];
  };
  ProcessoSeletivoEtapa?: {
    create?: ProcessoSeletivoEtapaInput[];
    update?: {
      where: Prisma.ProcessoSeletivoEtapaWhereUniqueInput;
      data: ProcessoSeletivoEtapaInput;
    }[];
    delete?: Prisma.ProcessoSeletivoEtapaWhereUniqueInput[];
  };
  eventosAgenda?: EventoAgendaInput[];
};
