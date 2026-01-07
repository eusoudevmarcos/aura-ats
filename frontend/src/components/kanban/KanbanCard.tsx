import { CardKanban, VinculoCard } from '@/schemas/kanban.schema';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';
import { FiMoreVertical } from 'react-icons/fi';

interface KanbanCardProps {
  card: CardKanban;
  onEdit?: (card: CardKanban) => void;
  onDelete?: (card: CardKanban) => void;
  onClick?: (card: CardKanban) => void;
  renderVinculos?: (vinculos: VinculoCard[]) => React.ReactNode;
  isItemAnimating?: (itemId: string) => boolean;
}

const KanbanCardComponent: React.FC<KanbanCardProps> = ({
  card,
  onEdit,
  onDelete,
  onClick,
  renderVinculos,
  isItemAnimating,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: 'card',
      card,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const [showMenu, setShowMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!showMenu) return;
    function handleClick(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onEdit) {
      onEdit(card);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    if (onDelete) {
      onDelete(card);
    }
  };

  const vinculos = card.vinculos || [];
  const isAnimating = isItemAnimating ? isItemAnimating(card.id) : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-pointer hover:shadow-md transition-all duration-[2000ms] ease-out p-3 bg-white rounded-md relative border border-gray-200 mb-2 ${
        isAnimating ? 'delete-animating' : ''
      }`}
      onClick={() => onClick?.(card)}
    >
      {/* Menu de ações */}
      {(onEdit || onDelete) && (
        <div className="absolute top-2 right-2 z-10">
          <button
            ref={btnRef}
            onClick={e => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="p-1 hover:bg-gray-100 rounded"
            onMouseDown={e => e.stopPropagation()}
          >
            <FiMoreVertical className="w-4 h-4 text-gray-600" />
          </button>
          {showMenu && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 z-20"
              onMouseDown={e => e.stopPropagation()}
            >
              {onEdit && (
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 rounded-t-md"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600 rounded-b-md"
                >
                  Excluir
                </button>
              )}
            </div>
          )}
        </div>
      )}

      <h3 className="font-semibold text-gray-800 mb-2 pr-8">{card.titulo}</h3>

      {card.descricao && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">
          {card.descricao}
        </p>
      )}

      {/* Vínculos */}
      {vinculos.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {renderVinculos
            ? renderVinculos(vinculos)
            : vinculos.map(vinculo => (
                <span
                  key={vinculo.id}
                  className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                >
                  {vinculo.tipoEntidade}
                </span>
              ))}
        </div>
      )}
    </div>
  );
};

export const KanbanCard = React.memo<KanbanCardProps>(
  KanbanCardComponent,
  (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders desnecessários
    return (
      prevProps.card.id === nextProps.card.id &&
      prevProps.card.titulo === nextProps.card.titulo &&
      prevProps.card.descricao === nextProps.card.descricao &&
      prevProps.card.vinculos?.length === nextProps.card.vinculos?.length
    );
  }
);
