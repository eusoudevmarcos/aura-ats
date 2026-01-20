import {
  CandidatoAutocomplete,
  candidatoAutocompleteSchema,
  CardKanban,
  CardKanbanInput,
  cardKanbanDataSchema,
  cardKanbanSchema,
  cardEtiquetaSchema,
  checklistCardSchema,
  checklistItemSchema,
  ChecklistCard,
  ChecklistItem,
  ClienteAutocomplete,
  clienteAutocompleteSchema,
  ColunaKanban,
  ColunaKanbanInput,
  colunaKanbanSchema,
  ComentarioCard,
  ComentarioCardInput,
  comentarioCardInputSchema,
  comentarioCardSchema,
  CompromissoAutocomplete,
  compromissoAutocompleteSchema,
  EspacoTrabalho,
  EspacoTrabalhoComQuadros,
  espacoTrabalhoComQuadrosSchema,
  EspacoTrabalhoInput,
  espacoTrabalhoSchema,
  etiquetaQuadroSchema,
  EtiquetaQuadro,
  MoverCardInput,
  QuadroCompleto,
  quadroCompletoSchema,
  QuadroKanban,
  QuadroKanbanInput,
  quadroKanbanSchema,
  TipoEntidadeEnum,
  UsuarioSistema,
  usuarioSistemaSchema,
  VagaAutocomplete,
  vagaAutocompleteSchema,
  VincularEntidadeInput,
  VinculoCard,
  vinculoCardSchema,
} from '@/schemas/kanban.schema';
import { createKanbanError, KanbanErrorCode } from '@/types/kanban.type';
import { z } from 'zod';
import api from '.';

// ===================== HELPER PARA VALIDAÇÃO =====================
function validateResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  errorMessage: string = 'Resposta da API inválida'
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    // Formatar erros do Zod de forma mais legível
    const errors = result.error.errors.map(err => ({
      path: err.path.join('.'),
      message: err.message,
      code: err.code,
      expected: (err as any).expected,
      received: (err as any).received,
    }));
    
    console.error(`${errorMessage}:`, errors);
    
    // Criar mensagem de erro mais descritiva
    const errorMessages = errors.map(
      err => `${err.path}: ${err.message}`
    ).join('; ');
    
    throw createKanbanError(
      `${errorMessage}: ${errorMessages}`,
      KanbanErrorCode.VALIDATION_ERROR,
      undefined,
      errors
    );
  }
  return result.data;
}

// ===================== ESPAÇO DE TRABALHO =====================
export const criarEspacoTrabalho = async (
  data: EspacoTrabalhoInput
): Promise<EspacoTrabalho> => {
  try {
    const response = await api.post(
      '/api/externalWithAuth/kanban/espaco-trabalho',
      data
    );
    return validateResponse(
      response.data,
      espacoTrabalhoSchema,
      'Erro ao criar espaço de trabalho'
    );
  } catch (error: any) {
    if (error.response?.status === 404) {
      throw createKanbanError(
        'Espaço de trabalho não encontrado',
        KanbanErrorCode.NOT_FOUND
      );
    }
    if (error.response?.status === 401 || error.response?.status === 403) {
      throw createKanbanError('Não autorizado', KanbanErrorCode.UNAUTHORIZED);
    }
    throw createKanbanError(
      error.message || 'Erro ao criar espaço de trabalho',
      KanbanErrorCode.INTERNAL_ERROR,
      undefined,
      error.response?.data
    );
  }
};

export const listarEspacosTrabalho = async (): Promise<EspacoTrabalho[]> => {
  const response = await api.get(
    '/api/externalWithAuth/kanban/espaco-trabalho'
  );
  return z.array(espacoTrabalhoSchema).parse(response.data);
};

export const obterEspacoTrabalhoPorId = async (
  id: string
): Promise<EspacoTrabalhoComQuadros> => {
  const response = await api.get(
    `/api/externalWithAuth/kanban/espaco-trabalho/${id}`
  );
  return validateResponse(
    response.data,
    espacoTrabalhoComQuadrosSchema,
    'Erro ao obter espaço de trabalho'
  );
};

export const atualizarEspacoTrabalho = async (
  id: string,
  data: Partial<EspacoTrabalhoInput>
): Promise<EspacoTrabalho> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/espaco-trabalho/${id}`,
    data
  );
  return validateResponse(
    response.data,
    espacoTrabalhoSchema,
    'Erro ao atualizar espaço de trabalho'
  );
};

export const deletarEspacoTrabalho = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/espaco-trabalho/${id}`, {
    data: { id },
  });
};

// ===================== QUADRO KANBAN =====================
export const criarQuadroKanban = async (
  data: QuadroKanbanInput
): Promise<QuadroKanban> => {
  const response = await api.post('/api/externalWithAuth/kanban/quadro', data);
  return validateResponse(
    response.data,
    quadroKanbanSchema,
    'Erro ao criar quadro'
  );
};

export const obterQuadroCompleto = async (
  id: string
): Promise<QuadroCompleto> => {
  const response = await api.get(`/api/externalWithAuth/kanban/quadro/${id}`);
  return validateResponse(
    response.data,
    quadroCompletoSchema,
    'Erro ao obter quadro completo'
  );
};


export const atualizarQuadroKanban = async (
  id: string,
  data: Partial<QuadroKanbanInput>
): Promise<QuadroKanban> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/quadro/${id}`,
    data
  );
  return validateResponse(
    response.data,
    quadroKanbanSchema,
    'Erro ao atualizar quadro'
  );
};

export const deletarQuadroKanban = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/quadro/${id}`, {
    data: { id },
  });
};

// ===================== COLUNA KANBAN =====================
export const criarColunaKanban = async (
  data: ColunaKanbanInput
): Promise<ColunaKanban> => {
  const response = await api.post('/api/externalWithAuth/kanban/coluna', data);
  return validateResponse(
    response.data,
    colunaKanbanSchema,
    'Erro ao criar coluna'
  );
};

export const moverColuna = async (data: {
  colunaId: string;
  novaPosicao: number;
}): Promise<ColunaKanban> => {
  const response = await api.post(
    '/api/externalWithAuth/kanban/coluna/mover',
    data
  );
  return validateResponse(
    response.data,
    colunaKanbanSchema,
    'Erro ao mover coluna'
  );
};

export const atualizarColunaKanban = async (
  id: string,
  data: Partial<ColunaKanbanInput>
): Promise<ColunaKanban> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/coluna/${id}`,
    data
  );
  return validateResponse(
    response.data,
    colunaKanbanSchema,
    'Erro ao atualizar coluna'
  );
};

export const deletarColunaKanban = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/coluna/${id}`, {
    data: { id },
  });
};

// ===================== CARD KANBAN =====================
export const criarCardKanban = async (
  data: CardKanbanInput
): Promise<CardKanban> => {
  const response = await api.post('/api/externalWithAuth/kanban/card', data);
  return validateResponse(
    response.data,
    cardKanbanSchema,
    'Erro ao criar card'
  );
};

export const moverCard = async (data: MoverCardInput): Promise<CardKanban> => {
  const response = await api.post(
    '/api/externalWithAuth/kanban/card/mover',
    data
  );
  return validateResponse(
    response.data,
    cardKanbanSchema,
    'Erro ao mover card'
  );
};

export const atualizarCardKanban = async (
  id: string,
  data: Partial<CardKanbanInput>
): Promise<CardKanban> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/card/${id}`,
    data
  );
  return validateResponse(
    response.data,
    cardKanbanSchema,
    'Erro ao atualizar card'
  );
};

export const deletarCardKanban = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/card/${id}`, {
    data: { id },
  });
};

// ===================== ETIQUETAS =====================

export const listarEtiquetasDoQuadro = async (
  quadroId: string
): Promise<EtiquetaQuadro[]> => {
  const response = await api.get(
    `/api/externalWithAuth/kanban/quadro/${quadroId}/etiquetas`
  );
  return z.array(etiquetaQuadroSchema).parse(response.data);
};

export const criarEtiquetaQuadro = async (
  quadroId: string,
  data: { nome: string; cor: string; ordem?: number }
): Promise<EtiquetaQuadro> => {
  const response = await api.post(
    `/api/externalWithAuth/kanban/quadro/${quadroId}/etiqueta`,
    data
  );
  return etiquetaQuadroSchema.parse(response.data);
};

export const atualizarEtiquetaQuadro = async (
  id: string,
  data: Partial<{ nome: string; cor: string; ordem?: number }>
): Promise<EtiquetaQuadro> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/etiqueta/${id}`,
    data
  );
  return etiquetaQuadroSchema.parse(response.data);
};

export const deletarEtiquetaQuadro = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/etiqueta/${id}`, {
    data: { id },
  });
};

export const atualizarEtiquetasDoCard = async (
  cardId: string,
  etiquetaIds: string[]
): Promise<CardKanban> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/card/${cardId}/etiquetas`,
    { etiquetaIds }
  );
  // O backend retorna o card com apenas as etiquetas; fazemos parse parcial e mesclamos depois se necessário
  return validateResponse(
    response.data,
    cardKanbanSchema.extend({
      etiquetas: z.array(cardEtiquetaSchema).optional(),
    }),
    'Erro ao atualizar etiquetas do card'
  );
};

// ===================== DATAS DO CARD =====================

export const upsertCardData = async (
  cardId: string,
  data: {
    dataInicio?: string | Date;
    dataEntrega?: string | Date;
    recorrencia?: string;
    lembreteMinutosAntes?: number | null;
  }
): Promise<z.infer<typeof cardKanbanDataSchema>> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/card/${cardId}/datas`,
    data
  );
  return cardKanbanDataSchema.parse(response.data);
};

export const obterCardData = async (
  cardId: string
): Promise<z.infer<typeof cardKanbanDataSchema> | null> => {
  const response = await api.get(
    `/api/externalWithAuth/kanban/card/${cardId}/datas`
  );
  if (!response.data) return null;
  return cardKanbanDataSchema.parse(response.data);
};

// ===================== CHECKLIST =====================

export const criarChecklist = async (
  cardId: string,
  data: { titulo: string; ordem?: number }
): Promise<ChecklistCard> => {
  const response = await api.post(
    `/api/externalWithAuth/kanban/card/${cardId}/checklist`,
    data
  );
  return checklistCardSchema.parse(response.data);
};

export const atualizarChecklist = async (
  id: string,
  data: Partial<{ titulo: string; ordem?: number }>
): Promise<ChecklistCard> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/checklist/${id}`,
    data
  );
  return checklistCardSchema.parse(response.data);
};

export const deletarChecklist = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/checklist/${id}`, {
    data: { id },
  });
};

export const criarChecklistItem = async (
  checklistId: string,
  data: { descricao: string; concluido?: boolean; ordem?: number }
): Promise<ChecklistItem> => {
  const response = await api.post(
    `/api/externalWithAuth/kanban/checklist/${checklistId}/item`,
    data
  );
  return checklistItemSchema.parse(response.data);
};

export const atualizarChecklistItem = async (
  id: string,
  data: Partial<{ descricao: string; concluido?: boolean; ordem?: number }>
): Promise<ChecklistItem> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/checklist-item/${id}`,
    data
  );
  return checklistItemSchema.parse(response.data);
};

export const deletarChecklistItem = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/checklist-item/${id}`, {
    data: { id },
  });
};

export const toggleChecklistCompleto = async (
  cardId: string,
  completo: boolean
): Promise<CardKanban> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/card/${cardId}/checklist-completo`,
    { completo }
  );
  return validateResponse(
    response.data,
    cardKanbanSchema,
    'Erro ao atualizar status de checklist do card'
  );
};

// ===================== MEMBROS DO CARD =====================

export const adicionarMembroAoCard = async (
  cardId: string,
  usuarioSistemaId: string
): Promise<void> => {
  await api.post(`/api/externalWithAuth/kanban/card/${cardId}/membro`, {
    usuarioSistemaId,
  });
};

export const removerMembroDoCard = async (
  cardId: string,
  usuarioSistemaId: string
): Promise<void> => {
  await api.delete(
    `/api/externalWithAuth/kanban/card/${cardId}/membro/${usuarioSistemaId}`,
    {
      data: { cardId, usuarioSistemaId },
    }
  );
};

// ===================== VÍNCULOS =====================
export const vincularEntidade = async (
  data: VincularEntidadeInput
): Promise<VinculoCard> => {
  const response = await api.post('/api/externalWithAuth/kanban/vinculo', data);
  return validateResponse(
    response.data,
    vinculoCardSchema,
    'Erro ao vincular entidade'
  );
};

export const removerVinculo = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/vinculo/${id}`, {
    data: { id },
  });
};

export const listarVinculosDoCard = async (
  cardId: string
): Promise<VinculoCard[]> => {
  const response = await api.get(
    `/api/externalWithAuth/kanban/card/${cardId}/vinculos`
  );
  return z.array(vinculoCardSchema).parse(response.data);
};

// ===================== AUTCOMPLETE =====================
export const buscarEntidadesParaAutocomplete = async (
  tipo: TipoEntidadeEnum,
  search: string = '',
  limit: number = 10
): Promise<
  | VagaAutocomplete[]
  | CandidatoAutocomplete[]
  | ClienteAutocomplete[]
  | CompromissoAutocomplete[]
> => {
  const response = await api.get(
    `/api/externalWithAuth/kanban/autocomplete/${tipo}`,
    {
      params: { search, limit },
    }
  );

  switch (tipo) {
    case 'VAGA':
      return z.array(vagaAutocompleteSchema).parse(response.data);
    case 'CANDIDATO':
      return z.array(candidatoAutocompleteSchema).parse(response.data);
    case 'CLIENTE':
      return z.array(clienteAutocompleteSchema).parse(response.data);
    case 'COMPROMISSO':
      return z.array(compromissoAutocompleteSchema).parse(response.data);
    default:
      return [];
  }
};

// ===================== COMENTÁRIOS =====================
export const criarComentarioCard = async (
  cardId: string,
  data: Omit<ComentarioCardInput, 'cardKanbanId'>
): Promise<ComentarioCard> => {
  const response = await api.post(
    `/api/externalWithAuth/kanban/card/${cardId}/comentario`,
    data
  );
  return validateResponse(
    response.data,
    comentarioCardSchema,
    'Erro ao criar comentário'
  );
};

export const listarComentariosDoCard = async (
  cardId: string
): Promise<ComentarioCard[]> => {
  const response = await api.get(
    `/api/externalWithAuth/kanban/card/${cardId}/comentarios`
  );
  return z.array(comentarioCardSchema).parse(response.data);
};

export const atualizarComentarioCard = async (
  id: string,
  data: Partial<Omit<ComentarioCardInput, 'cardKanbanId'>>
): Promise<ComentarioCard> => {
  const response = await api.put(
    `/api/externalWithAuth/kanban/comentario/${id}`,
    data
  );
  return validateResponse(
    response.data,
    comentarioCardSchema,
    'Erro ao atualizar comentário'
  );
};

export const deletarComentarioCard = async (id: string): Promise<void> => {
  await api.delete(`/api/externalWithAuth/kanban/comentario/${id}`, {
    data: { id },
  });
};

// ===================== BUSCA DE USUÁRIOS DO SISTEMA =====================

export const buscarUsuariosSistema = async (
  search: string = '',
  limit: number = 10
): Promise<UsuarioSistema[]> => {
  const response = await api.get(
    `/api/externalWithAuth/kanban/usuarios-sistema`,
    {
      params: { search, limit },
    }
  );
  return z
    .array(
      usuarioSistemaSchema.extend({
        funcionario: z
          .object({
            pessoa: z.object({
              id: z.string(),
              nome: z.string(),
            }),
          })
          .nullable()
          .optional(),
        cliente: z
          .object({
            empresa: z.object({
              id: z.string(),
              razaoSocial: z.string(),
              nomeFantasia: z.string().nullable(),
            }),
          })
          .nullable()
          .optional(),
      })
    )
    .parse(response.data);
};
