import {
  adicionarMembroAoCard,
  atualizarCardKanban,
  atualizarChecklist,
  atualizarChecklistItem,
  atualizarEtiquetaQuadro,
  buscarUsuariosSistema,
  criarChecklist,
  criarChecklistItem,
  criarComentarioCard,
  criarEtiquetaQuadro,
  deletarChecklist,
  deletarChecklistItem,
  deletarComentarioCard,
  deletarEtiquetaQuadro,
  listarComentariosDoCard,
  listarVinculosDoCard,
  removerMembroDoCard,
  removerVinculo,
} from '@/axios/kanban.axios';
import { useKanban } from '@/context/KanbanContext';
import {
  CardKanban,
  ChecklistCard,
  ComentarioCard,
  UsuarioSistema,
  VinculoCard
} from '@/schemas/kanban.schema';
import { getUsuarioNome } from '@/utils/kanban';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FiCalendar,
  FiCheckSquare,
  FiEdit,
  FiLoader,
  FiTag,
  FiUsers,
  FiX
} from 'react-icons/fi';
import Modal from '../modal/Modal';

interface CardViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: CardKanban;
  onUpdate?: () => void;
  columnName: string;
}

// Debounce utility
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
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
  }, []);

  return debouncedFunction;
}

export const CardViewModal: React.FC<CardViewModalProps> = ({
  isOpen,
  onClose,
  card,
  columnName,
  onUpdate,
}) => {
  const { quadro, toggleCardChecklistCompleto, updateCardLabels, updateCardDates } =
    useKanban();

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

  const [activePanel, setActivePanel] = useState<
    'labels' | 'dates' | 'checklist' | 'members' | null
  >(null);

  const quadroEtiquetas = useMemo(
    () => quadro?.etiquetas ?? [],
    [quadro?.etiquetas]
  );

  const selectedEtiquetaIds = useMemo(() => {
    const ids = new Set<string>();
    (card.etiquetas || []).forEach(et => {
      if (et.etiqueta?.id) {
        ids.add(et.etiqueta.id);
      } else if (et.etiquetaQuadroId) {
        ids.add(et.etiquetaQuadroId);
      }
    });
    return ids;
  }, [card.etiquetas]);

  // Estados para criação de etiquetas
  const [newEtiquetaNome, setNewEtiquetaNome] = useState('');
  const [newEtiquetaCor, setNewEtiquetaCor] = useState('#4b5563');
  const [creatingEtiqueta, setCreatingEtiqueta] = useState(false);
  const [editingEtiquetaId, setEditingEtiquetaId] = useState<string | null>(null);
  const [editingEtiquetaNome, setEditingEtiquetaNome] = useState('');

  // Cores predefinidas para etiquetas
  const coresPredefinidas = [
    '#4b5563', // gray
    '#ef4444', // red
    '#f59e0b', // amber
    '#10b981', // green
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#06b6d4', // cyan
  ];

  // Estados para criação de checklists
  const [newChecklistTitulo, setNewChecklistTitulo] = useState('');
  const [creatingChecklist, setCreatingChecklist] = useState(false);
  const [editingChecklistId, setEditingChecklistId] = useState<string | null>(null);
  const [editingChecklistTitulo, setEditingChecklistTitulo] = useState('');
  const [newItemDescricao, setNewItemDescricao] = useState<Record<string, string>>({});
  const [creatingItem, setCreatingItem] = useState<Record<string, boolean>>({});

  // Estado local para manter os checklists atualizados dentro do modal
  const [localChecklists, setLocalChecklists] = useState<ChecklistCard[]>(
    card.checklists || []
  );

  // Sempre que o card vindo de fora mudar (ex: refresh do quadro), sincroniza
  useEffect(() => {
    setLocalChecklists(card.checklists || []);
  }, [card.checklists]);

  // Estados para autocomplete de membros
  const [searchUsuario, setSearchUsuario] = useState('');
  const [usuariosSugeridos, setUsuariosSugeridos] = useState<UsuarioSistema[]>([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [addingMember, setAddingMember] = useState(false);

  // Estados para datas (valores locais antes de salvar)
  const [localDataInicio, setLocalDataInicio] = useState<string>('');
  const [localDataEntrega, setLocalDataEntrega] = useState<string>('');
  const [savingDates, setSavingDates] = useState(false);

  // Estado local para checklistCompleto (atualização imediata do botão)
  const [localChecklistCompleto, setLocalChecklistCompleto] = useState<boolean>(
    card.checklistCompleto || false
  );

  const loadData = useCallback(async () => {
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
  }, [card.id]); // Corrigido: adicionar dependência card.id

  useEffect(() => {
    if (isOpen && card.id) {
      loadData();
      // Inicializar estados locais de datas quando o card é aberto
      if (card.datas?.dataInicio) {
        setLocalDataInicio(
          new Date(card.datas.dataInicio).toISOString().slice(0, 10)
        );
      } else {
        setLocalDataInicio('');
      }
      if (card.datas?.dataEntrega) {
        setLocalDataEntrega(
          new Date(card.datas.dataEntrega).toISOString().slice(0, 10)
        );
      } else {
        setLocalDataEntrega('');
      }
      // Sincronizar estado local de checklistCompleto
      setLocalChecklistCompleto(card.checklistCompleto || false);
    }
  }, [isOpen, card.id, card.datas?.dataInicio, card.datas?.dataEntrega, card.checklistCompleto, loadData]);



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

  const handleCancelDescription = () => {
    setDescription(card.descricao || '');
    setIsEditingDescription(false);
  };

  const handleAddComment = async () => {
    const commentToSend = newComment.trim();
    if (!commentToSend || commentSubmitting) return;

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

  // Funções para gerenciar etiquetas
  const handleCriarEtiqueta = async () => {
    if (!newEtiquetaNome.trim() || !quadro?.id) return;
    setCreatingEtiqueta(true);
    try {
      await criarEtiquetaQuadro(quadro.id, {
        nome: newEtiquetaNome.trim(),
        cor: newEtiquetaCor,
      });
      setNewEtiquetaNome('');
      setNewEtiquetaCor('#4b5563');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao criar etiqueta:', error);
    } finally {
      setCreatingEtiqueta(false);
    }
  };

  const handleEditarEtiqueta = async (etiquetaId: string, novoNome: string) => {
    if (!novoNome.trim()) {
      setEditingEtiquetaId(null);
      return;
    }
    try {
      await atualizarEtiquetaQuadro(etiquetaId, { nome: novoNome.trim() });
      setEditingEtiquetaId(null);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao editar etiqueta:', error);
    }
  };

  const handleDeletarEtiqueta = async (etiquetaId: string) => {
    try {
      await deletarEtiquetaQuadro(etiquetaId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao deletar etiqueta:', error);
    }
  };

  // Funções para gerenciar checklists
  const handleCriarChecklist = async () => {
    if (!newChecklistTitulo.trim()) return;
    setCreatingChecklist(true);
    try {
      const novoChecklist = await criarChecklist(card.id, {
        titulo: newChecklistTitulo.trim(),
      });
      // Atualiza estado local imediatamente
      setLocalChecklists(prev => [...prev, novoChecklist]);
      setNewChecklistTitulo('');
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao criar checklist:', error);
    } finally {
      setCreatingChecklist(false);
    }
  };

  const handleEditarChecklist = async (checklistId: string, novoTitulo: string) => {
    if (!novoTitulo.trim()) {
      setEditingChecklistId(null);
      return;
    }
    try {
      await atualizarChecklist(checklistId, { titulo: novoTitulo.trim() });
      setEditingChecklistId(null);
      // Atualiza título no estado local
      setLocalChecklists(prev =>
        prev.map(cl =>
          cl.id === checklistId ? { ...cl, titulo: novoTitulo.trim() } : cl
        )
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao editar checklist:', error);
    }
  };

  const handleDeletarChecklist = async (checklistId: string) => {
    try {
      await deletarChecklist(checklistId);
      // Remove do estado local
      setLocalChecklists(prev => prev.filter(cl => cl.id !== checklistId));
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao deletar checklist:', error);
    }
  };

  const handleCriarChecklistItem = async (checklistId: string) => {
    const descricao = newItemDescricao[checklistId]?.trim();
    if (!descricao) return;
    setCreatingItem(prev => ({ ...prev, [checklistId]: true }));
    try {
      const novoItem = await criarChecklistItem(checklistId, { descricao });
      setNewItemDescricao(prev => ({ ...prev, [checklistId]: '' }));
      // Adiciona item ao checklist correspondente no estado local
      setLocalChecklists(prev =>
        prev.map(cl =>
          cl.id === checklistId
            ? {
              ...cl,
              itens: [...(cl.itens || []), novoItem],
            }
            : cl
        )
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao criar item de checklist:', error);
    } finally {
      setCreatingItem(prev => ({ ...prev, [checklistId]: false }));
    }
  };

  const handleToggleChecklistItem = async (
    itemId: string,
    concluido: boolean
  ) => {
    try {
      await atualizarChecklistItem(itemId, { concluido: !concluido });
      // Atualiza item no estado local
      setLocalChecklists(prev =>
        prev.map(cl => ({
          ...cl,
          itens: cl.itens?.map(item =>
            item.id === itemId ? { ...item, concluido: !concluido } : item
          ),
        }))
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao atualizar item de checklist:', error);
    }
  };

  const handleDeletarChecklistItem = async (itemId: string) => {
    try {
      await deletarChecklistItem(itemId);
      // Remove item do estado local
      setLocalChecklists(prev =>
        prev.map(cl => ({
          ...cl,
          itens: cl.itens?.filter(item => item.id !== itemId) || [],
        }))
      );
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao deletar item de checklist:', error);
    }
  };

  // Funções para gerenciar membros
  const buscarUsuariosCallback = useCallback(
    async (search: string) => {
      const termo = search.trim();

      if (!termo || termo.length < 2) {
        setUsuariosSugeridos([]);
        setShowAutocomplete(false);
        return;
      }

      setLoadingUsuarios(true);
      try {
        const usuarios = await buscarUsuariosSistema(termo, 10);
        // Filtrar usuários que já são membros do card
        const membrosIds = new Set(
          (card.membros || []).map(m => m.usuarioSistemaId)
        );
        const usuariosDisponiveis = usuarios.filter(
          u => u && !membrosIds.has(u.id)
        );
        setUsuariosSugeridos(usuariosDisponiveis);
        setShowAutocomplete(usuariosDisponiveis.length > 0);
      } catch (error) {
        console.log('Erro ao buscar usuários:', error);
        setUsuariosSugeridos([]);
        setShowAutocomplete(false);
      } finally {
        setLoadingUsuarios(false);
      }
    },
    [card.membros]
  );

  const buscarUsuariosDebounced = useDebouncedCallback(
    buscarUsuariosCallback,
    300
  );

  useEffect(() => {
    const termo = searchUsuario.trim();
    if (!termo) {
      setUsuariosSugeridos([]);
      setShowAutocomplete(false);
      return;
    }
    buscarUsuariosDebounced(termo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchUsuario]);

  const handleAdicionarMembro = async (usuarioSistemaId: string) => {
    setAddingMember(true);
    try {
      await adicionarMembroAoCard(card.id, usuarioSistemaId);
      setSearchUsuario('');
      setUsuariosSugeridos([]);
      setShowAutocomplete(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao adicionar membro:', error);
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoverMembro = async (usuarioSistemaId: string) => {
    try {
      await removerMembroDoCard(card.id, usuarioSistemaId);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.log('Erro ao remover membro:', error);
    }
  };

  // Fechar autocomplete ao clicar fora
  useEffect(() => {
    if (!showAutocomplete) return;
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.autocomplete-container')) {
        setShowAutocomplete(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAutocomplete]);

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
    if (!isOpen) {
      setNewComment('');
      setSearchUsuario('');
      setUsuariosSugeridos([]);
      setShowAutocomplete(false);
    }

  }, [isOpen]);

  // --- Textarea ref for focus management ---
  const commentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Refs para os botões de ação para posicionar os pop-ups
  const labelsButtonRef = useRef<HTMLButtonElement>(null);
  const datesButtonRef = useRef<HTMLButtonElement>(null);
  const checklistButtonRef = useRef<HTMLButtonElement>(null);
  const membersButtonRef = useRef<HTMLButtonElement>(null);

  // Estado para posição dos pop-ups
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number } | null>(null);

  // Calcular posição do pop-up quando activePanel muda
  useEffect(() => {
    if (!activePanel) {
      setPopupPosition(null);
      return;
    }

    let buttonElement: HTMLButtonElement | null = null;
    if (activePanel === 'labels') buttonElement = labelsButtonRef.current;
    else if (activePanel === 'dates') buttonElement = datesButtonRef.current;
    else if (activePanel === 'checklist') buttonElement = checklistButtonRef.current;
    else if (activePanel === 'members') buttonElement = membersButtonRef.current;

    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();
      const containerRect = buttonElement.closest('.flex-1')?.getBoundingClientRect();
      if (containerRect) {
        setPopupPosition({
          top: rect.bottom - containerRect.top + 70,
          left: rect.left - containerRect.left + 12,
        });
      }
    }
  }, [activePanel]);

  // Fechar pop-up ao clicar fora
  useEffect(() => {
    if (!activePanel) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      let buttonElement: HTMLButtonElement | null = null;

      if (activePanel === 'labels') buttonElement = labelsButtonRef.current;
      else if (activePanel === 'dates') buttonElement = datesButtonRef.current;
      else if (activePanel === 'checklist') buttonElement = checklistButtonRef.current;
      else if (activePanel === 'members') buttonElement = membersButtonRef.current;

      const panel = document.querySelector(`[data-panel="${activePanel}"]`);

      if (
        buttonElement &&
        !buttonElement.contains(target) &&
        panel &&
        !panel.contains(target)
      ) {
        setActivePanel(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePanel]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={columnName}>
      <div className="flex h-full max-h-[80vh]">
        {/* Coluna esquerda: detalhes do card */}
        <div className="flex-1 overflow-y-auto p-2">
          {/* Título com checkbox */}
          <div className="mb-2 flex items-start justify-between gap-4">
            {isEditingTitle ? (
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="checkbox"
                  checked={localChecklistCompleto}
                  onChange={async () => {
                    const novoEstado = !localChecklistCompleto;
                    setLocalChecklistCompleto(novoEstado);
                    try {
                      await toggleCardChecklistCompleto(card.id, novoEstado);
                      if (onUpdate) onUpdate();
                    } catch (error) {
                      setLocalChecklistCompleto(!novoEstado);
                      console.log('Erro ao atualizar status do card:', error);
                    }
                  }}
                  className="h-5 w-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                />
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
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={localChecklistCompleto}
                    onChange={async () => {
                      const novoEstado = !localChecklistCompleto;
                      setLocalChecklistCompleto(novoEstado);
                      try {
                        await toggleCardChecklistCompleto(card.id, novoEstado);
                        if (onUpdate) onUpdate();
                      } catch (error) {
                        setLocalChecklistCompleto(!novoEstado);
                        console.log('Erro ao atualizar status do card:', error);
                      }
                    }}
                    className="h-5 w-5 cursor-pointer rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500"
                  />
                  <h2
                    className="text-2xl font-bold text-gray-800 cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -mx-2 -my-1 flex-1"
                    onClick={() => setIsEditingTitle(true)}
                  >
                    {card.titulo}
                    <FiEdit className="inline-block ml-2 text-gray-500 text-lg" />
                  </h2>
                </div>
              </div>
            )}
          </div>

          {/* Barra de ações - abaixo do título */}
          <div className="mb-4 flex flex-wrap items-center gap-3 relative">
            <div className="flex flex-wrap gap-2">
              <button
                ref={labelsButtonRef}
                type="button"
                onClick={() => setActivePanel(activePanel === 'labels' ? null : 'labels')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activePanel === 'labels'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <FiTag className="w-4 h-4" />
                Etiquetas
              </button>
              <button
                ref={datesButtonRef}
                type="button"
                onClick={() => setActivePanel(activePanel === 'dates' ? null : 'dates')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activePanel === 'dates'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <FiCalendar className="w-4 h-4" />
                Datas
              </button>
              <button
                ref={checklistButtonRef}
                type="button"
                onClick={() => setActivePanel(activePanel === 'checklist' ? null : 'checklist')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activePanel === 'checklist'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <FiCheckSquare className="w-4 h-4" />
                Checklist
              </button>
              <button
                ref={membersButtonRef}
                type="button"
                onClick={() => setActivePanel(activePanel === 'members' ? null : 'members')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${activePanel === 'members'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                <FiUsers className="w-4 h-4" />
                Membros
              </button>
            </div>
          </div>

          {/* Pop-ups de ações flutuantes */}
          {activePanel === 'labels' && popupPosition && (
            <div
              data-panel="labels"
              className="absolute z-50 p-2 bg-white border border-gray-200 rounded-lg shadow-xl"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
                minWidth: '320px',
                maxWidth: '400px',
              }}
            >
              <h3 className="text-md font-semibold text-gray-700 mb-3">Etiquetas</h3>

              {/* Criar nova etiqueta */}
              <div className="mb-4">
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={newEtiquetaNome}
                    onChange={e => setNewEtiquetaNome(e.target.value)}
                    placeholder="Nome da etiqueta"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        handleCriarEtiqueta();
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={handleCriarEtiqueta}
                    disabled={!newEtiquetaNome.trim() || creatingEtiqueta}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {creatingEtiqueta ? <FiLoader className="animate-spin" /> : 'Criar'}
                  </button>
                </div>
                <div className="flex gap-1 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 py-1">
                  <div className="flex flex-row" style={{ minWidth: 'max-content' }}>
                    {coresPredefinidas.map(cor => (
                      <button
                        key={cor}
                        type="button"
                        onClick={() => setNewEtiquetaCor(cor)}
                        className={`w-8 h-8 rounded border-2 ${newEtiquetaCor === cor ? 'border-gray-800' : 'border-gray-300'
                          }`}
                        style={{ backgroundColor: cor }}
                        title={cor}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Lista de etiquetas do quadro */}
              <div className="max-h-48 overflow-y-auto">
                {quadroEtiquetas.map(etiqueta => {
                  const isSelected = selectedEtiquetaIds.has(etiqueta.id);
                  return (
                    <div
                      key={etiqueta.id}
                      className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
                      onClick={async () => {
                        const newIds = isSelected
                          ? Array.from(selectedEtiquetaIds).filter(id => id !== etiqueta.id)
                          : [...Array.from(selectedEtiquetaIds), etiqueta.id];
                        try {
                          await updateCardLabels(card.id, newIds);
                          if (onUpdate) onUpdate();
                        } catch (error) {
                          console.log('Erro ao atualizar etiquetas:', error);
                        }
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => { }}
                        className="cursor-pointer"
                      />
                      <span
                        className="flex-1 inline-flex items-center gap-1 rounded px-2 py-1 text-sm font-medium text-white"
                        style={{ backgroundColor: etiqueta.cor || '#4b5563' }}
                      >
                        <span
                          className="inline-block h-2 w-2 rounded-full"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                        />
                        {etiqueta.nome}
                      </span>
                    </div>
                  );
                })}
                {quadroEtiquetas.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma etiqueta criada ainda
                  </p>
                )}
              </div>
            </div>
          )}

          {activePanel === 'dates' && popupPosition && (
            <div
              data-panel="dates"
              className="absolute z-50 p-4 bg-white border border-gray-200 rounded-lg shadow-xl"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
                minWidth: '280px',
                maxWidth: '350px',
              }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Datas</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Início
                  </label>
                  <input
                    type="date"
                    value={localDataInicio}
                    onChange={e => setLocalDataInicio(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Entrega
                  </label>
                  <input
                    type="date"
                    value={localDataEntrega}
                    onChange={e => setLocalDataEntrega(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      setSavingDates(true);
                      try {
                        await updateCardDates(card.id, {
                          dataInicio: localDataInicio || undefined,
                          dataEntrega: localDataEntrega || undefined,
                        });
                        if (onUpdate) onUpdate();
                      } catch (error) {
                        console.log('Erro ao salvar datas:', error);
                      } finally {
                        setSavingDates(false);
                      }
                    }}
                    disabled={savingDates}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {savingDates ? <FiLoader className="animate-spin mx-auto" /> : 'Salvar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalDataInicio('');
                      setLocalDataEntrega('');
                    }}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md text-sm hover:bg-gray-400"
                  >
                    Limpar
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePanel === 'checklist' && popupPosition && (
            <div
              data-panel="checklist"
              className="absolute z-50 p-4 bg-white border border-gray-200 rounded-lg shadow-xl w-full"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
                minWidth: '280px',
                maxWidth: '350px',
              }}
            >
              <h3 className="text-md font-semibold text-gray-700 mb-3">Adicionar Checklist</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newChecklistTitulo}
                  onChange={e => setNewChecklistTitulo(e.target.value)}
                  placeholder="Título do checklist"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      handleCriarChecklist();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleCriarChecklist}
                  disabled={!newChecklistTitulo.trim() || creatingChecklist}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {creatingChecklist ? <FiLoader className="animate-spin" /> : 'Salvar'}
                </button>
              </div>
              {localChecklists.length === 0 && (
                <p className="text-[11px] text-gray-400 text-center">
                  Nenhum checklist criado ainda
                </p>
              )}
            </div>
          )}

          {activePanel === 'members' && popupPosition && (
            <div
              data-panel="members"
              className="absolute z-50 p-4 bg-white border border-gray-200 rounded-lg shadow-xl"
              style={{
                top: `${popupPosition.top}px`,
                left: `${popupPosition.left}px`,
                minWidth: '280px',
                maxWidth: '350px',
              }}
            >
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Membros</h3>
              <div className="mb-3 autocomplete-container relative">
                <input
                  type="text"
                  value={searchUsuario}
                  onChange={e => setSearchUsuario(e.target.value)}
                  placeholder="Buscar usuário..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {showAutocomplete && usuariosSugeridos.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {usuariosSugeridos
                      .filter((u): u is UsuarioSistema => Boolean(u))
                      .map((usuario: UsuarioSistema) => (
                        <button
                          key={usuario!.id}
                          type="button"
                          onClick={() => handleAdicionarMembro(usuario!.id)}
                          disabled={addingMember}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          {getUsuarioNome(usuario)}
                        </button>
                      ))}
                  </div>
                )}
                {loadingUsuarios && (
                  <div className="absolute right-3 top-2.5">
                    <FiLoader className="animate-spin text-gray-400" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                {(card.membros || []).map(membro => (
                  <div
                    key={membro.usuarioSistemaId}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm text-gray-700">
                      {getUsuarioNome(membro.usuarioSistema)}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoverMembro(membro.usuarioSistemaId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {(!card.membros || card.membros.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhum membro adicionado
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Apresentação das datas de início e fim abaixo dos membros */}
          {(() => {
            // Parse the end date string and get today at 00:00 for comparison
            const entregaDefined = !!localDataEntrega;
            let isEntregaAfterToday = false;
            if (entregaDefined) {
              const dataEntrega = new Date(localDataEntrega);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              dataEntrega.setHours(0, 0, 0, 0);
              isEntregaAfterToday = dataEntrega > today;
            }
            return (
              <div className="my-4">
                <div className="flex items-center gap-8">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500">
                      Data de Início
                    </label>
                    <span className="block text-sm text-gray-800 bg-gray-100 px-2 py-0.5 rounded">
                      {localDataInicio
                        ? new Date(localDataInicio).toLocaleDateString('pt-BR')
                        : <span className="text-gray-400">Não definida</span>
                      }
                    </span>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500">
                      Data de Entrega
                    </label>
                    <span className={`block text-sm text-gray-800 px-2 py-0.5 rounded ${entregaDefined ? (isEntregaAfterToday ? 'bg-red-200' : 'bg-gray-100') : 'bg-gray-100'}`}>
                      {localDataEntrega
                        ? new Date(localDataEntrega).toLocaleDateString('pt-BR')
                        : <span className="text-gray-400">Não definida</span>
                      }
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Seção de Etiquetas - abaixo dos botões de ações */}
          {(() => {
            // Buscar etiquetas do card, tentando primeiro a relação populada, depois do quadro
            const etiquetasDoCard = (card.etiquetas || [])
              .map(et => {
                // Se a relação etiqueta estiver populada, usa ela
                if (et.etiqueta) {
                  return et.etiqueta;
                }
                // Caso contrário, busca no quadro usando o etiquetaQuadroId
                if (et.etiquetaQuadroId && quadroEtiquetas.length > 0) {
                  return quadroEtiquetas.find(eq => eq.id === et.etiquetaQuadroId);
                }
                return null;
              })
              .filter(Boolean);

            return etiquetasDoCard.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Etiquetas</h3>
                <div className="flex flex-wrap gap-2">
                  {etiquetasDoCard.map(etiqueta => (
                    <span
                      key={etiqueta!.id}
                      className="inline-flex items-center gap-1 rounded px-3 py-1.5 text-sm font-medium text-white"
                      style={{ backgroundColor: (etiqueta as any).cor || '#4b5563' }}
                    >
                      <span
                        className="inline-block h-3 w-3 rounded-full"
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.3)' }}
                      />
                      {etiqueta!.nome}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          {/* Descrição */}
          <div className="mb-2">
            <div className="text-lg font-semibold text-gray-800">
              <span className="material-icons text-gray-500 mr-1 align-middle">list</span>
              Descrição
            </div>
            <div className="ml-6">
              {isEditingDescription ? (
                <>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    // Remover onBlur automático e só sair dos botões
                    // onBlur={handleSaveDescription}
                    onKeyDown={e => {
                      if (e.key === 'Escape') {
                        handleCancelDescription();
                      }
                    }}
                    className="w-full border-2 border-blue-500 rounded px-3 py-2 focus:outline-none resize-none"
                    rows={4}
                    autoFocus
                  />
                  {/* Botões de ação para salvar e cancelar */}
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveDescription}
                      className="rounded bg-blue-600 text-white px-4 py-1.5 hover:bg-blue-700 transition-colors"
                    >
                      Salvar
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelDescription}
                      className="rounded bg-gray-300 text-gray-800 px-4 py-1.5 hover:bg-gray-400 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </>
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
          </div>

          {/* Vínculos */}
          <div className="space-y-6 mb-4">
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

          {/* Checklist */}
          {localChecklists.length !== 0 &&
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                Lista de tarefas
              </h3>

              {localChecklists.map(checklist => {
                const isEditing = editingChecklistId === checklist.id;
                const totalItens = checklist.itens?.length || 0;
                const itensConcluidos =
                  checklist.itens?.filter(i => i.concluido).length || 0;
                const progresso = totalItens > 0 ? `${itensConcluidos}/${totalItens}` : '0/0';

                return (
                  <div
                    key={checklist.id}
                    className="rounded ml-4"
                  >
                    {/* Cabeçalho do checklist */}
                    <div className="mb-2 flex items-center gap-2 group">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editingChecklistTitulo}
                          onChange={e =>
                            setEditingChecklistTitulo(e.target.value)
                          }
                          onBlur={() =>
                            handleEditarChecklist(
                              checklist.id,
                              editingChecklistTitulo
                            )
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              handleEditarChecklist(
                                checklist.id,
                                editingChecklistTitulo
                              );
                            }
                            if (e.key === 'Escape') {
                              setEditingChecklistId(null);
                            }
                          }}
                          className="flex-1 rounded border border-gray-300 px-1 py-0.5 text-xs focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <>
                          <span
                            className="flex-1 cursor-pointer text-md font-semibold"
                            onClick={() => {
                              setEditingChecklistId(checklist.id);
                              setEditingChecklistTitulo(checklist.titulo);
                            }}
                            title="Clique para editar"
                          >
                            {checklist.titulo}
                          </span>
                          <span className="text-xs text-gray-500">
                            {progresso}
                          </span>
                        </>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeletarChecklist(checklist.id)}
                        className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100"
                        title="Deletar checklist"
                      >
                        <FiX className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Lista de itens do checklist */}
                    <div className="space-y-1 ml-4">
                      {checklist.itens?.map(item => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 rounded p-1 hover:bg-gray-50 group"
                        >
                          <input
                            type="checkbox"
                            checked={item.concluido}
                            onChange={() =>
                              handleToggleChecklistItem(
                                item.id,
                                item.concluido
                              )
                            }
                            className="cursor-pointer"
                          />
                          <span
                            className={`flex-1 text-md ${item.concluido
                              ? 'line-through text-gray-400'
                              : 'text-gray-700'
                              }`}
                          >
                            {item.descricao}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleDeletarChecklistItem(item.id)
                            }
                            className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Deletar item"
                          >
                            <FiX className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Input para adicionar novo item */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newItemDescricao[checklist.id] || ''}
                        onChange={e =>
                          setNewItemDescricao(prev => ({
                            ...prev,
                            [checklist.id]: e.target.value,
                          }))
                        }
                        onKeyDown={e => {
                          if (
                            e.key === 'Enter' &&
                            newItemDescricao[checklist.id]?.trim()
                          ) {
                            handleCriarChecklistItem(checklist.id);
                          }
                        }}
                        placeholder="Adicionar um item..."
                        className="flex-1 rounded border border-gray-300 px-2 py-1 text-xs focus:outline-none"
                        disabled={creatingItem[checklist.id]}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleCriarChecklistItem(checklist.id)
                        }
                        disabled={
                          !newItemDescricao[checklist.id]?.trim() ||
                          creatingItem[checklist.id]
                        }
                        className="rounded bg-gray-600 px-2 py-1 text-xs text-white hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        {creatingItem[checklist.id] ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          '+'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>}

        </div>

        {/* Coluna direita: comentários */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-4 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Comentários</h3>

          <div className="mb-3">
            <div className="relative">
              <textarea
                ref={commentTextareaRef}
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="Adicione um comentário..."
                disabled={commentSubmitting}
                className="w-full resize-none rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
                rows={3}
                onFocus={() => setCommentAreaFocused(true)}
                onBlur={() => setCommentAreaFocused(false)}
              />
            </div>
            <button
              onClick={handleAddComment}
              disabled={commentSubmitting || !newComment.trim()}
              className="mt-2 w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {commentSubmitting ? (
                <>
                  <FiLoader className="h-4 w-4 animate-spin" />
                  <span>Adicionando...</span>
                </>
              ) : (
                <span>Adicionar Comentário</span>
              )}
            </button>
            <div className="mt-1 text-xs text-gray-400">
              Pressione <b>Ctrl+Enter</b> para adicionar rapidamente.
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {comentarios.map(comentario => (
              <div key={comentario.id} className="rounded-lg p-2">
                <div className="mb-1 flex items-start justify-between">
                  <div>
                    <p className="font-medium text-gray-800">
                      {getUsuarioNome(comentario.usuarioSistema)}
                    </p>

                  </div>
                </div>
                <p className="whitespace-pre-wrap text-gray-700 bg-gray-200 px-2 py-1 rounded-lg">
                  {comentario.conteudo}
                </p>
                <div className="flex items-center gap-2 justify-between">

                  <p className="text-xs text-gray-500">
                    {formatDate(comentario.criadoEm)}
                  </p>
                  <button
                    onClick={() => handleDeleteComment(comentario.id)}
                    className=" hover:text-red-700 text-sm underline"
                    title="Deletar comentário"
                  >
                    excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal >
  );
};
