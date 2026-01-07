import { CardKanban, ColunaKanban, VinculoCard } from '@/schemas/kanban.schema';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import React, { useCallback, useMemo, useState } from 'react';
import { useKanban } from '@/context/KanbanContext';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanBoardProps {
  quadroId: string;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (card: CardKanban) => void;
  onDeleteCard?: (card: CardKanban) => void;
  onCardClick?: (card: CardKanban) => void;
  onEditColumn?: (column: ColunaKanban) => void;
  renderVinculos?: (vinculos: VinculoCard[]) => React.ReactNode;
  canAddCard?: boolean;
  loading?: boolean;
  onRefresh?: () => void;
  animatingItemId?: string | null;
  isItemAnimating?: (itemId: string) => boolean;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  quadroId,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onCardClick,
  onEditColumn,
  renderVinculos,
  canAddCard = true,
  loading = false,
  onRefresh,
  animatingItemId,
  isItemAnimating,
}) => {
  const { quadro, moveCard: moveCardContext, moveColumn: moveColumnContext } = useKanban();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<'card' | 'column' | null>(null);

  // Configurar sensores do @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Requer 8px de movimento antes de iniciar drag
      },
    })
  );

  // IDs das colunas e cards para SortableContext
  const columnIds = useMemo(
    () => quadro?.colunas.map(col => col.id) || [],
    [quadro]
  );

  const getColumnCardIds = useCallback(
    (columnId: string) => {
      const column = quadro?.colunas.find(col => col.id === columnId);
      return column?.cards.map(card => card.id) || [];
    },
    [quadro]
  );

  // Encontrar card ativo para DragOverlay
  const activeCard = useMemo(() => {
    if (activeType !== 'card' || !activeId || !quadro) return null;
    for (const column of quadro.colunas) {
      const card = column.cards.find(c => c.id === activeId);
      if (card) return card;
    }
    return null;
  }, [activeId, activeType, quadro]);

  // Encontrar coluna ativa para DragOverlay
  const activeColumn = useMemo(() => {
    if (activeType !== 'column' || !activeId || !quadro) return null;
    return quadro.colunas.find(col => col.id === activeId) || null;
  }, [activeId, activeType, quadro]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    const data = event.active.data.current;
    if (data?.type === 'card') {
      setActiveType('card');
    } else if (data?.type === 'column') {
      setActiveType('column');
    }
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over || !quadro) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    // Mover card
    if (activeData?.type === 'card') {
      const cardId = active.id as string;
      const sourceColumn = quadro.colunas.find(col =>
        col.cards.some(c => c.id === cardId)
      );

      if (!sourceColumn) return;

      // Ordenar cards por ordem antes de processar
      const sortedSourceCards = [...sourceColumn.cards].sort(
        (a, b) => a.ordem - b.ordem
      );
      const sourceIndex = sortedSourceCards.findIndex(c => c.id === cardId);

      // Verificar se está sobre uma coluna (por ID ou por tipo)
      const isOverColumn =
        overData?.type === 'column' || columnIds.includes(over.id as string);

      if (isOverColumn) {
        // Soltou sobre uma coluna
        const targetColumn = quadro.colunas.find(col => col.id === over.id);
        if (!targetColumn) return;

        // Se é a mesma coluna, não fazer nada
        if (sourceColumn.id === targetColumn.id) {
          return;
        }

        // Ordenar cards da coluna de destino
        const sortedTargetCards = [...targetColumn.cards].sort(
          (a, b) => a.ordem - b.ordem
        );

        // Adicionar no final da coluna de destino
        const targetIndex = sortedTargetCards.length;

        // Chamar Context que fará o optimistic update
        try {
          await moveCardContext(
            cardId,
            sourceColumn.id,
            targetColumn.id,
            targetIndex
          );
        } catch (error) {
          console.log('Erro ao mover card:', error);
        }
      } else if (overData?.type === 'card') {
        // Soltou sobre outro card
        const targetColumn = quadro.colunas.find(col =>
          col.cards.some(c => c.id === over.id)
        );

        if (!targetColumn) return;

        // Ordenar cards da coluna de destino
        const sortedTargetCards = [...targetColumn.cards].sort(
          (a, b) => a.ordem - b.ordem
        );
        const targetCardIndex = sortedTargetCards.findIndex(
          c => c.id === over.id
        );

        if (sourceColumn.id === targetColumn.id) {
          // Mesma coluna - usar arrayMove para calcular posição correta
          const newCards = arrayMove(
            sortedSourceCards,
            sourceIndex,
            targetCardIndex
          );
          
          // Encontrar a nova posição do card movido no array resultante
          const finalPosition = newCards.findIndex(c => c.id === cardId);

          // Chamar Context que fará o optimistic update
          try {
            await moveCardContext(
              cardId,
              sourceColumn.id,
              targetColumn.id,
              finalPosition
            );
          } catch (error) {
            console.log('Erro ao mover card:', error);
          }
        } else {
          // Colunas diferentes - inserir na posição do card de destino
          // Remover o card da origem primeiro para calcular posição correta
          const cardsWithoutSource = sortedTargetCards.filter(
            c => c.id !== cardId
          );
          
          // Inserir na posição do card de destino
          const targetIndex = targetCardIndex;

          // Chamar Context que fará o optimistic update
          try {
            await moveCardContext(
              cardId,
              sourceColumn.id,
              targetColumn.id,
              targetIndex
            );
          } catch (error) {
            console.log('Erro ao mover card:', error);
          }
        }
      }
    }
    // Mover coluna
    else if (activeData?.type === 'column') {
      const columnId = active.id as string;
      
      // Verificar se está sobre outra coluna
      const isOverColumn =
        overData?.type === 'column' || columnIds.includes(over.id as string);

      if (isOverColumn) {
        // Ordenar colunas por ordem
        const sortedColumns = [...quadro.colunas].sort(
          (a, b) => a.ordem - b.ordem
        );

        const sourceIndex = sortedColumns.findIndex(c => c.id === columnId);
        const targetIndex = sortedColumns.findIndex(c => c.id === over.id);

        if (sourceIndex === -1 || targetIndex === -1) return;
        if (sourceIndex === targetIndex) return; // Mesma posição

        // Chamar Context que fará o optimistic update
        try {
          await moveColumnContext(columnId, targetIndex);
        } catch (error) {
          console.log('Erro ao mover coluna:', error);
        }
      }
    }
  }, [quadro, columnIds, moveCardContext, moveColumnContext]);

  if (loading || !quadro) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Carregando quadro...</div>
      </div>
    );
  }

  // Ordenar colunas por ordem - memoizado
  const sortedColumns = useMemo(
    () => [...quadro.colunas].sort((a, b) => a.ordem - b.ordem),
    [quadro.colunas]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="w-full h-full">
        <div
          style={{
            overflowX: 'auto',
            minHeight: '10vh',
            maxHeight: '70vh',
            width: '100%',
          }}
          className="flex gap-4 p-4"
        >
          <SortableContext
            items={columnIds}
            strategy={horizontalListSortingStrategy}
          >
            {sortedColumns.map(column => {
              const cardIds = getColumnCardIds(column.id);
              return (
                <SortableContext
                  key={column.id}
                  id={column.id}
                  items={cardIds}
                  strategy={verticalListSortingStrategy}
                >
                  <KanbanColumn
                    column={column}
                    onAddCard={onAddCard}
                    onEditCard={onEditCard}
                    onDeleteCard={onDeleteCard}
                    onCardClick={onCardClick}
                    onEditColumn={onEditColumn}
                    renderVinculos={renderVinculos}
                    canAddCard={canAddCard}
                    isLoading={loading}
                    isItemAnimating={isItemAnimating}
                  />
                </SortableContext>
              );
            })}
          </SortableContext>
        </div>
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="opacity-90">
            <KanbanCard
              card={activeCard}
              onEdit={onEditCard}
              onDelete={onDeleteCard}
              onClick={onCardClick}
              renderVinculos={renderVinculos}
            />
          </div>
        )}
        {activeColumn && (
          <div className="opacity-90">
            <KanbanColumn
              column={activeColumn}
              onAddCard={onAddCard}
              onEditCard={onEditCard}
              onDeleteCard={onDeleteCard}
              onCardClick={onCardClick}
              renderVinculos={renderVinculos}
              canAddCard={canAddCard}
            />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};
