import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

type TrelloCardProps = {
  id: string;
  title: string;
  label?: string;
  metadata?: any;
  onDuplicate?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
};

export const CardKanban: React.FC<TrelloCardProps> = ({
  id,
  title,
  label,
  metadata,
  onDuplicate,
  onEdit,
  onDelete,
}) => {
  const router = useRouter();

  const [showMenu, setShowMenu] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fecha o popup ao clicar fora
  useEffect(() => {
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

  const handleDuplicate = () => {
    setShowMenu(false);
    if (onDuplicate) {
      onDuplicate(id);
    }
  };

  const handleEdit = () => {
    setShowMenu(false);
    if (onEdit) {
      onEdit(id);
    }
  };

  const handleDelete = () => {
    setShowMenu(false);
    if (onDelete) {
      onDelete(id);
    }
  };

  const handleCardClick = async () => {
    console.log('aqui');
    await router.push(`/vaga/${id}`);
  };

  return (
    <div
      className="cursor-pointer hover:shadow-sm transition-shadow p-3 bg-gray-100 rounded-md mb-2 relative"
      onClick={handleCardClick}
    >
      <div className="absolute right-2 top-2 flex gap-2 z-2">
        <button
          ref={btnRef}
          type="button"
          title="Opções"
          className="hover:bg-white text-gray-600 p-1 transition flex items-center justify-center"
          onClick={() => setShowMenu(v => !v)}
        >
          <span className="material-icons text-[16px]!">more_vert</span>
        </button>
        {showMenu && (
          <div
            ref={menuRef}
            className="absolute right-0  w-28 bg-white border border-gray-200 rounded shadow-lg flex flex-col animate-fadeIn z-9999"
            style={{ zIndex: 20, top: '20px' }}
          >
            <button
              title="Duplicar"
              className="w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-gray-100 text-gray-600 transition bg-white border-0"
              onClick={handleDuplicate}
            >
              <span className="material-icons text-[12px]!">copy_all</span>
              Duplicar
            </button>
            <button
              title="Editar"
              className="w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-blue-100 text-blue-600 transition bg-white border-0"
              onClick={handleEdit}
            >
              <span className="material-icons text-[12px]!">edit</span>
              Editar
            </button>
            <button
              title="Deletar"
              className="w-full flex items-center gap-2 px-3 py-2 text-[10px] hover:bg-red-100 text-red-600 transition bg-white border-0"
              onClick={handleDelete}
            >
              <span className="material-icons text-[12px]!">delete</span>
              Deletar
            </button>
          </div>
        )}
      </div>

      <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>

      {label && <p className="text-xs text-gray-500 mb-2">{label}</p>}

      {metadata?.categoria && (
        <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded mb-2">
          {metadata.categoria}
        </span>
      )}
    </div>
  );
};
