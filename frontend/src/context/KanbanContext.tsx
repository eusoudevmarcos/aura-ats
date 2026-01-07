import { obterQuadroCompleto, moverCard, moverColuna } from '@/axios/kanban.axios';
import {
  CardKanban,
  CardKanbanInput,
  ColunaKanban,
  ColunaKanbanInput,
  QuadroCompleto,
} from '@/schemas/kanban.schema';
import { arrayMove } from '@dnd-kit/sortable';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface KanbanContextType {
  quadro: QuadroCompleto | null;
  loading: boolean;
  error: string | null;
  fetchQuadro: (id: string) => Promise<void>;
  moveCard: (
    cardId: string,
    sourceColumnId: string,
    targetColumnId: string,
    position: number
  ) => Promise<void>;
  moveColumn: (columnId: string, newPosition: number) => Promise<void>;
  refreshQuadro: () => Promise<void>;
  refreshAfterMutation: () => Promise<void>;
}

const KanbanContext = createContext<KanbanContextType | undefined>(undefined);

interface KanbanProviderProps {
  children: React.ReactNode;
  quadroId: string;
}

export const KanbanProvider: React.FC<KanbanProviderProps> = ({
  children,
  quadroId,
}) => {
  const [quadro, setQuadro] = useState<QuadroCompleto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuadro = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await obterQuadroCompleto(id);
      setQuadro(data);
    } catch (err: any) {
      console.log('Erro ao buscar quadro:', err);
      setError(err.message || 'Erro ao carregar quadro');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshQuadro = useCallback(async () => {
    if (quadroId) {
      await fetchQuadro(quadroId);
    }
  }, [quadroId, fetchQuadro]);

  const moveCardHandler = useCallback(
    async (
      cardId: string,
      sourceColumnId: string,
      targetColumnId: string,
      position: number
    ) => {
      if (!quadro) return;

      // Salvar estado original para possível rollback
      const originalQuadro = quadro;

      // Criar cópia profunda imutável do estado
      const updatedQuadro: QuadroCompleto = {
        ...quadro,
        colunas: quadro.colunas.map(col => ({
          ...col,
          cards: [...col.cards],
        })),
      };

      const sourceColumn = updatedQuadro.colunas.find(
        col => col.id === sourceColumnId
      );
      const targetColumn = updatedQuadro.colunas.find(
        col => col.id === targetColumnId
      );

      if (!sourceColumn || !targetColumn) return;

      const card = sourceColumn.cards.find(c => c.id === cardId);
      if (!card) return;

      // Ordenar cards antes de processar
      const sortedSourceCards = [...sourceColumn.cards].sort(
        (a, b) => a.ordem - b.ordem
      );
      const sortedTargetCards = [...targetColumn.cards].sort(
        (a, b) => a.ordem - b.ordem
      );

      // Se é a mesma coluna, usar arrayMove e atualizar apenas uma vez
      if (sourceColumnId === targetColumnId) {
        const sourceIndex = sortedSourceCards.findIndex(c => c.id === cardId);
        const newCards = arrayMove(sortedSourceCards, sourceIndex, position);
        
        // Atualizar ordem para todos os cards
        newCards.forEach((c, index) => {
          c.ordem = index;
        });

        // Criar novo estado atualizando apenas a coluna uma vez
        const finalQuadro: QuadroCompleto = {
          ...updatedQuadro,
          colunas: updatedQuadro.colunas.map(col => {
            if (col.id === sourceColumnId) {
              return { ...col, cards: newCards };
            }
            return col;
          }),
        };

        // Atualizar estado local (optimistic update)
        setQuadro(finalQuadro);

        // Call API
        try {
          await moverCard({
            cardId,
            novaColunaId: targetColumnId,
            novaPosicao: position,
          });
        } catch (err: any) {
          console.log('Erro ao mover card:', err);
          // Revert optimistic update
          setQuadro(originalQuadro);
          throw err;
        }
        return;
      }

      // Colunas diferentes - remover da origem e inserir no destino
      const newSourceCards = sortedSourceCards.filter(c => c.id !== cardId);
      const newTargetCards = [...sortedTargetCards];
      const updatedCard = { ...card, colunaKanbanId: targetColumnId };
      newTargetCards.splice(position, 0, updatedCard);

      // Atualizar ordem para todos os cards na coluna de destino
      newTargetCards.forEach((c, index) => {
        c.ordem = index;
      });

      // Atualizar ordem para todos os cards na coluna de origem
      newSourceCards.forEach((c, index) => {
        c.ordem = index;
      });

      // Criar novo estado com as colunas atualizadas
      const finalQuadro: QuadroCompleto = {
        ...updatedQuadro,
        colunas: updatedQuadro.colunas.map(col => {
          if (col.id === sourceColumnId) {
            return { ...col, cards: newSourceCards };
          }
          if (col.id === targetColumnId) {
            return { ...col, cards: newTargetCards };
          }
          return col;
        }),
      };

      // Atualizar estado local (optimistic update)
      setQuadro(finalQuadro);

      // Call API
      try {
        await moverCard({
          cardId,
          novaColunaId: targetColumnId,
          novaPosicao: position,
        });
        // Não fazer refresh automático - o estado já está atualizado
        // Apenas em caso de erro fazemos rollback
      } catch (err: any) {
        console.log('Erro ao mover card:', err);
        // Revert optimistic update
        setQuadro(originalQuadro);
        throw err;
      }
    },
    [quadro]
  );

  useEffect(() => {
    if (quadroId) {
      fetchQuadro(quadroId);
    }
  }, [quadroId, fetchQuadro]);

  const moveColumnHandler = useCallback(
    async (columnId: string, newPosition: number) => {
      if (!quadro) return;

      // Salvar estado original para possível rollback
      const originalQuadro = quadro;

      // Criar cópia profunda imutável do estado
      const updatedQuadro: QuadroCompleto = {
        ...quadro,
        colunas: quadro.colunas.map(col => ({ ...col })),
      };

      // Ordenar colunas por ordem
      const sortedColumns = [...updatedQuadro.colunas].sort(
        (a, b) => a.ordem - b.ordem
      );

      // Encontrar índice da coluna atual
      const currentIndex = sortedColumns.findIndex(c => c.id === columnId);
      if (currentIndex === -1) return;

      // Usar arrayMove para calcular nova ordem
      const newColumns = arrayMove(sortedColumns, currentIndex, newPosition);

      // Atualizar ordem de todas as colunas
      newColumns.forEach((col, index) => {
        col.ordem = index;
      });

      // Criar novo estado com colunas atualizadas
      const finalQuadro: QuadroCompleto = {
        ...updatedQuadro,
        colunas: newColumns,
      };

      // Atualizar estado local (optimistic update)
      setQuadro(finalQuadro);

      // Call API
      try {
        await moverColuna({
          colunaId: columnId,
          novaPosicao: newPosition,
        });
      } catch (err: any) {
        console.log('Erro ao mover coluna:', err);
        // Revert optimistic update
        setQuadro(originalQuadro);
        throw err;
      }
    },
    [quadro]
  );

  const refreshAfterMutation = useCallback(async () => {
    if (quadroId) {
      await fetchQuadro(quadroId);
    }
  }, [quadroId, fetchQuadro]);

  const value: KanbanContextType = {
    quadro,
    loading,
    error,
    fetchQuadro,
    moveCard: moveCardHandler,
    moveColumn: moveColumnHandler,
    refreshQuadro,
    refreshAfterMutation,
  };

  return (
    <KanbanContext.Provider value={value}>{children}</KanbanContext.Provider>
  );
};

export const useKanban = (): KanbanContextType => {
  const context = useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};
