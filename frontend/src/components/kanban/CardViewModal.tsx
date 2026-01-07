import {
  atualizarCardKanban,
  criarComentarioCard,
  deletarComentarioCard,
  listarComentariosDoCard,
  listarVinculosDoCard,
  removerVinculo,
} from '@/axios/kanban.axios';
import {
  CardKanban,
  ComentarioCard,
  VinculoCard,
} from '@/schemas/kanban.schema';
import { getUsuarioNome } from '@/utils/kanban';
import { useEffect, useRef, useState } from 'react';
import { FiEdit, FiLoader, FiTrash2, FiX } from 'react-icons/fi';
import Modal from '../modal/Modal';

interface CardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardKanban;
  onUpdate?: () => void;
}

// Debounce utility
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
  dependencies: any[] = []
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);

  function debouncedFunction(...args: Parameters<T>) {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }

  // Clean up
  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
    // eslint-disable-next-line
  }, dependencies);

  return debouncedFunction;
}

export const CardViewModal: React.FC<CardViewModalProps> = ({
  isOpen,
  onClose,
  card,
  onUpdate,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [title, setTitle] = useState(card.titulo);
  const [description, setDescription] = useState(card.descricao || '');
  const [comentarios, setComentarios] = useState<ComentarioCard[]>([]);
  const [vinculos, setVinculos] = useState<VinculoCard[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Loading state for comment submission (not block UI)
  const [commentSubmitting, setCommentSubmitting] = useState(false);

  // For storing whether the textarea is focused
  const [commentAreaFocused, setCommentAreaFocused] = useState(false);

  // We'll need to always have the up-to-date newComment value, so we don't "lose" it after clear
  const latestNewComment = useRef(newComment);
  useEffect(() => {
    latestNewComment.current = newComment;
  }, [newComment]);

  useEffect(() => {
    if (isOpen && card.id) {
      loadData();
    }
  }, [isOpen, card.id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [comentariosData, vinculosData] = await Promise.all([
        listarComentariosDoCard(card.id),
        listarVinculosDoCard(card.id),
      ]);
      setComentarios(comentariosData);
      setVinculos(vinculosData);
    } catch (error) {
      console.log('Erro ao carregar dados do card:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTitle = async () => {
    try {
      await atualizarCardKanban(card.id, { titulo: title });
      setIsEditingTitle(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao salvar título:', error);
    }
  };

  const handleSaveDescription = async () => {
    try {
      await atualizarCardKanban(card.id, { descricao: description });
      setIsEditingDescription(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao salvar descrição:', error);
    }
  };

  const handleAddComment = async (externalComment?: string) => {
    const commentToSend =
      typeof externalComment === 'string'
        ? externalComment
        : latestNewComment.current;
    if (!commentToSend.trim()) return;
    setCommentSubmitting(true);
    try {
      const comentario = await criarComentarioCard(card.id, {
        conteudo: commentToSend,
      });
      setComentarios(prev => [comentario, ...prev]);
      setNewComment('');
    } catch (error) {
      console.log('Erro ao adicionar comentário:', error);
    } finally {
      setCommentSubmitting(false);
    }
  };

  // Debounced version of handleAddComment (4s)
  const debouncedHandleAddComment = useDebouncedCallback(
    handleAddComment,
    4000,
    [card.id]
  );

  const handleDeleteComment = async (id: string) => {
    try {
      await deletarComentarioCard(id);
      setComentarios(comentarios.filter(c => c.id !== id));
    } catch (error) {
      console.log('Erro ao deletar comentário:', error);
    }
  };

  const handleRemoveVinculo = async (id: string) => {
    try {
      await removerVinculo(id);
      setVinculos(vinculos.filter(v => v.id !== id));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao remover vínculo:', error);
    }
  };

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'agora';
    if (diffMins < 60)
      return `há ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`;
    if (diffHours < 24)
      return `há ${diffHours} hora${diffHours !== 1 ? 's' : ''}`;
    if (diffDays < 7) return `há ${diffDays} dia${diffDays !== 1 ? 's' : ''}`;
    return d.toLocaleDateString('pt-BR');
  };

  const getVinculoLabel = (vinculo: VinculoCard): string => {
    if (vinculo.vaga) return `Vaga: ${vinculo.vaga.titulo}`;
    if (vinculo.candidato) return `Candidato: ${vinculo.candidato.pessoa.nome}`;
    if (vinculo.cliente) {
      return `Cliente: ${vinculo.cliente.empresa.razaoSocial}`;
    }
    if (vinculo.compromisso)
      return `Compromisso: ${vinculo.compromisso.titulo}`;
    return 'Vínculo desconhecido';
  };

  // Ensure debounce doesn't fire after closing
  useEffect(() => {
    if (!isOpen) setNewComment('');
    // eslint-disable-next-line
  }, [isOpen]);

  // --- Detect CTRL+S for comment submission ---
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ref = commentTextareaRef.current;
    if (!ref) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleAddComment();
      }
    };

    if (commentAreaFocused) {
      ref.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (ref) ref.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line
  }, [commentAreaFocused, newComment, card.id]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="flex flex-col h-full max-h-[80vh]">
        {/* Header */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Título */}
          <div className="mb-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={handleSaveTitle}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleSaveTitle();
                    }
                    if (e.key === 'Escape') {
                      setTitle(card.titulo);
                      setIsEditingTitle(false);
                    }
                  }}
                  className="flex-1 text-2xl font-bold border-2 border-blue-500 rounded px-2 py-1 focus:outline-none"
                  autoFocus
                />
              </div>
            ) : (
              <h2
                className="text-2xl font-bold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -mx-2 -my-1"
                onClick={() => setIsEditingTitle(true)}
              >
                {card.titulo}
                <FiEdit className="inline-block ml-2 text-gray-500 text-lg" />
              </h2>
            )}
          </div>

          {/* Descrição */}
          <div className="mb-6">
            {isEditingDescription ? (
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={handleSaveDescription}
                onKeyDown={e => {
                  if (e.key === 'Escape') {
                    setDescription(card.descricao || '');
                    setIsEditingDescription(false);
                  }
                }}
                className="w-full border-2 border-blue-500 rounded px-3 py-2 focus:outline-none resize-none"
                rows={4}
                autoFocus
              />
            ) : (
              <div
                className="text-gray-700 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -mx-2 -my-1 min-h-[60px]"
                onClick={() => setIsEditingDescription(true)}
              >
                {description || (
                  <span className="text-gray-400 italic">
                    Clique para adicionar uma descrição...
                  </span>
                )}
                <FiEdit className="inline-block ml-2 text-gray-500" />
              </div>
            )}
          </div>

          <div className="space-y-6 mb-4">
            {/* Vínculos */}
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Vínculos
            </h3>
            <div className="space-y-2">
              {vinculos.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Nenhum vínculo adicionado
                </p>
              ) : (
                vinculos.map(vinculo => (
                  <div
                    key={vinculo.id}
                    className="bg-gray-50 rounded-lg p-2 border border-gray-200 flex justify-between items-center"
                  >
                    <span className="text-sm text-gray-700 flex-1">
                      {getVinculoLabel(vinculo)}
                    </span>
                    <button
                      onClick={() => handleRemoveVinculo(vinculo.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                      title="Remover vínculo"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800">Comentários</h3>

          <div className="flex gap-2 relative items-start mt-2">
            <div className="relative flex-1">
              {/* Loading indicator, on top right of textarea */}
              <span
                className="absolute top-2 right-2"
                style={{ pointerEvents: 'none' }}
              >
                {commentSubmitting && (
                  <FiLoader className="animate-spin text-blue-500" />
                )}
              </span>
              <textarea
                ref={commentTextareaRef}
                value={newComment}
                onChange={e => {
                  setNewComment(e.target.value);
                  debouncedHandleAddComment(e.target.value);
                }}
                placeholder="Adicione um comentário..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none pr-8"
                rows={3}
                onFocus={() => setCommentAreaFocused(true)}
                onBlur={() => setCommentAreaFocused(false)}
              />
            </div>
            {/* Removido o botão "Enviar" */}
          </div>
          <div className="text-xs text-gray-400 mt-1 ml-1">
            O comentário será enviado automaticamente após 4 segundos sem
            digitar ou ao pressionar <b>Ctrl+S</b> enquanto está digitando.
          </div>

          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {comentarios.map(comentario => (
              <div key={comentario.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium text-gray-800">
                      {getUsuarioNome(comentario.usuarioSistema)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(comentario.criadoEm)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteComment(comentario.id)}
                    className="text-red-500 hover:text-red-700"
                    title="Deletar comentário"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {comentario.conteudo}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
