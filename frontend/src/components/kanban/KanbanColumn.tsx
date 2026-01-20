import { CardKanban, ColunaKanban, VinculoCard } from '@/schemas/kanban.schema';
import { useDroppable } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { useMemo } from 'react';
import { FiEdit } from 'react-icons/fi';
import { KanbanCard } from './KanbanCard';

interface ColunaComCards extends ColunaKanban {
  cards: CardKanban[];
}

interface KanbanColumnProps {
  column: ColunaComCards;
  onAddCard?: (columnId: string) => void;
  onEditCard?: (card: CardKanban) => void;
  onDeleteCard?: (card: CardKanban) => void;
  onCardClick?: (card: CardKanban) => void;
  onEditColumn?: (column: ColunaKanban) => void;
  renderVinculos?: (vinculos: VinculoCard[]) => React.ReactNode;
  canAddCard?: boolean;
  isLoading?: boolean;
  isItemAnimating?: (itemId: string) => boolean;
}

const KanbanColumnComponent: React.FC<KanbanColumnProps> = ({
  column,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onCardClick,
  onEditColumn,
  renderVinculos,
  canAddCard = true,
  isLoading = false,
  isItemAnimating,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  // Combinar refs
  const setNodeRef = (node: HTMLElement | null) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    backgroundColor: isOver ? '#f3f4f6' : undefined,
  };

  const sortedCards = useMemo(
    () => [...(column.cards || [])].sort((a, b) => b.ordem - a.ordem), // Ordenação descendente: maior ordem primeiro (último adicionado no topo)
    [column.cards]
  );
  const isAnimating = useMemo(
    () => (isItemAnimating ? isItemAnimating(column.id) : false),
    [isItemAnimating, column.id]
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-gray-50 rounded-lg p-4 min-w-[320px] max-w-[320px] flex flex-col h-fit transition-all duration-2000 ease-out ${
        isAnimating ? 'delete-animating' : ''
      }`}
    >
      {/* Header arrastável */}
      <div className="flex items-center justify-between mb-4">
        <div
          {...attributes}
          {...listeners}
          className="flex items-center justify-between flex-1 cursor-grab active:cursor-grabbing"
        >
          <h2 className="font-semibold text-gray-800 text-lg">
            {column.titulo}
          </h2>
          <span className="text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded">
            {sortedCards.length}
          </span>
        </div>
        {onEditColumn && (
          <button
            onClick={e => {
              e.stopPropagation();
              onEditColumn(column);
            }}
            disabled={isLoading}
            className="ml-2 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Editar coluna"
            onMouseDown={e => e.stopPropagation()}
          >
            <FiEdit className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto max-h-[70vh]">
        {sortedCards.map(card => (
          <KanbanCard
            key={card.id}
            card={card}
            onEdit={onEditCard}
            onDelete={onDeleteCard}
            onClick={onCardClick}
            renderVinculos={renderVinculos}
            isItemAnimating={isItemAnimating}
          />
        ))}
      </div>

      {/* Botão adicionar card */}
      {canAddCard && onAddCard && (
        <button
          onClick={() => onAddCard(column.id)}
          className="mt-4 w-full py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded border-2 border-dashed border-gray-300 transition-colors"
        >
          + Adicionar Card
        </button>
      )}
    </div>
  );
};

export const KanbanColumn = React.memo<KanbanColumnProps>(
  KanbanColumnComponent,
  (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders desnecessários
    return (
      prevProps.column.id === nextProps.column.id &&
      prevProps.column.cards.length === nextProps.column.cards.length &&
      prevProps.column.titulo === nextProps.column.titulo &&
      prevProps.canAddCard === nextProps.canAddCard &&
      prevProps.isLoading === nextProps.isLoading
    );
  }
);
