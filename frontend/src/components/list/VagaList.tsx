import { getVagas, patchVagaStatus } from '@/axios/vaga.axios';
import {
  CategoriaVagaEnum,
  KanbanVagaResponse,
  StatusVagaEnum,
} from '@/schemas/vaga.schema';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Board from 'react-trello';
import { PrimaryButton } from '../button/PrimaryButton';
import VagaForm from '../form/VagaForm';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
import { CardKanban } from '../kanban/CardKanban';
import Modal from '../modal/Modal';
import ModalDelete from '../modal/ModalDelete';
import ModalHistoricoVaga from '../modal/ModalHistoricoVaga';

// ATENÇÃO: você deve criar isso depois no axios
// import { postDuplicarVaga } from '@/axios/vaga.axios';

const PAGE_SIZE = 10;

interface VagaListProps {
  initialValues?: KanbanVagaResponse;
}

// Hook controlável: ativa/desativa listeners de scroll horizontal totalmente
function useHorizontalDragScroll(
  ref: React.RefObject<HTMLElement>,
  enabled: boolean
) {
  useEffect(() => {
    if (!enabled) return;
    const elem = ref.current;
    if (!elem) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    function isCardDragTarget(target: EventTarget | null) {
      if (!(target instanceof HTMLElement)) return false;
      return !!target.closest('.react-trello-card');
    }

    const mouseDownHandler = (e: MouseEvent) => {
      if (isCardDragTarget(e.target)) return;
      if (e.button !== 0) return;
      isDown = true;
      elem.classList.add('scroll-grabbing');
      startX = e.pageX;
      scrollLeft = elem.scrollLeft;
      document.body.style.userSelect = 'none';
    };

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = x - startX;
      elem.scrollLeft = scrollLeft - walk;
    };

    const mouseUpHandler = () => {
      isDown = false;
      elem.classList.remove('scroll-grabbing');
      document.body.style.userSelect = '';
    };

    const wheelHandler = (e: WheelEvent) => {
      if (e.shiftKey || e.deltaX !== 0) {
        elem.scrollLeft += e.deltaY + e.deltaX;
      }
    };

    elem.addEventListener('mousedown', mouseDownHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
    elem.addEventListener('wheel', wheelHandler);
    elem.style.cursor = 'grab';

    return () => {
      elem.removeEventListener('mousedown', mouseDownHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
      elem.removeEventListener('wheel', wheelHandler);
      elem.style.cursor = '';
      elem.classList.remove('scroll-grabbing');
      document.body.style.userSelect = '';
    };
  }, [ref, enabled]);
}

const VagaList: React.FC<VagaListProps> = ({ initialValues }) => {
  const router = useRouter();
  const { uuid } = router.query;
  const resetKanbanVagaData = {
    lanes: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    totalPages: 1,
  };

  const [kanbanData, setKanbanData] = useState<KanbanVagaResponse>(
    initialValues ?? resetKanbanVagaData
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [showHistoricoModal, setShowHistoricoModal] = useState<boolean>(false);
  const [selectedVagaId, setSelectedVagaId] = useState<string>('');

  // Modal remover e editar (novo)
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [vagaToAction, setVagaToAction] = useState<any | null>(null); // info do card selecionado para ação

  const [showEditModal, setShowEditModal] = useState(false);
  const [vagaToEdit, setVagaToEdit] = useState<any | null>(null);

  const [searchInput, setSearchInput] = useState('');
  const [statusInput, setStatusInput] = useState('');
  const [categoriaInput, setCategoriaInput] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');
  const [categoriaQuery, setCategoriaQuery] = useState('');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const boardWrapperRef = useRef(null);

  // Controle total do scroll do hook via variável reativa
  const [dragScrollEnabled, setDragScrollEnabled] = useState(true);

  // useHorizontalDragScroll(boardWrapperRef, dragScrollEnabled);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setStatusQuery(statusInput);
    setCategoriaQuery(categoriaInput);
    setPage(1);
  };

  // Ao mover o card, desabilita o scroll horizontal IMEDIATAMENTE e só reabilita depois da finalização da ação
  // debounce util
  function debounce<F extends (...args: any[]) => void>(fn: F, delay = 200) {
    let timer: ReturnType<typeof setTimeout>;
    return (...args: Parameters<F>) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  const enableDragScroll = debounce(() => setDragScrollEnabled(true), 200);

  const handleCardMove = async (
    cardId: string,
    sourceLaneId: string,
    targetLaneId: string
  ) => {
    setDragScrollEnabled(false);
    try {
      const response = await patchVagaStatus({
        id: targetLaneId,
        status: sourceLaneId as StatusVagaEnum,
      });

      if (!response) {
        setKanbanData(prev => prev);
      }
    } catch (err) {
      console.log('Erro ao atualizar status', err);
      // opcional: rollback
    } finally {
      enableDragScroll();
    }
  };

  // ======== NOVAS FUNÇÕES PARA EDITAR E REMOVER =======
  const handleEditCard = (cardData: any) => {
    // cardData provavelmente tem o .id e demais campos
    setVagaToEdit(cardData);
    setShowEditModal(true);
  };

  const handleDeleteCard = (cardData: any) => {
    setVagaToAction(cardData);
    setShowDeleteModal(true);
  };

  // Assume que você criará este método de delete no axios
  const handleConfirmDelete = async () => {
    if (!vagaToAction) return;
    setLoading(true);
    try {
      // Você precisa criar a função deleteVagaById no axios/vaga.axios.ts
      // await deleteVagaById(vagaToAction.id);

      // Remove do frontend em memória:
      setKanbanData(prev => ({
        ...prev,
        lanes: prev.lanes.map(lane => ({
          ...lane,
          cards: lane.cards.filter(card => card.id !== vagaToAction.id),
        })),
      }));

      setTotal(old => Math.max(old - 1, 0));
    } catch (e) {
      // handle error
      alert('Erro ao remover vaga');
    }
    setLoading(false);
    setShowDeleteModal(false);
    setVagaToAction(null);
  };

  // Salvar edição (substitui apenas no frontend, você pode adaptar depois p/ PATCH ou PUT)
  const handleConfirmEdit = async (values: any) => {
    setLoading(true);
    try {
      // await patchVagaById(vagaToEdit.id, values); // implemente se quiser update real
      setKanbanData(prev => ({
        ...prev,
        lanes: prev.lanes.map(lane => ({
          ...lane,
          cards: lane.cards.map(card =>
            card.id === values.id ? { ...card, ...values } : card
          ),
        })),
      }));
      setShowEditModal(false);
      setVagaToEdit(null);
    } catch (e) {
      alert('Erro ao editar vaga');
    }
    setLoading(false);
  };

  // ======= DUPLICAR CARD =======
  const handleDuplicateCard = async (cardData: any) => {
    setLoading(true);
    try {
      // O método deve retornar a vaga duplicada no formato card
      // const duplicatedVaga = await postDuplicarVaga(cardData.id);

      // Simulação frontend: copia o card e altera id (remova esse mock depois)
      // const duplicatedCard = { ...cardData, id: Date.now().toString(), title: cardData.title + ' (cópia)' };

      // Exemplo correto depois da API:
      // Adicione where lane/cards (mantém na mesma coluna)
      setKanbanData(prev => ({
        ...prev,
        lanes: prev.lanes.map(lane => {
          if (lane.cards.find(c => c.id === cardData.id)) {
            // const cardApi = duplicatedVaga ou duplicatedCard (mock)
            // const cardApi = duplicatedCard;
            // Adicione pelo final da lista
            return {
              ...lane,
              cards: [
                ...lane.cards,
                // duplicatedVaga
                // duplicar mock:
                {
                  ...cardData,
                  id: `copy-${Date.now()}`,
                  title: cardData.title + ' (cópia)',
                },
              ],
            };
          }
          return lane;
        }),
      }));
      setTotal(t => t + 1);
    } catch (e) {
      alert('Erro ao duplicar vaga');
    }
    setLoading(false);
  };

  const fetchVagas = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVagas({
        ...(statusQuery ? { status: statusQuery } : {}),
        ...(categoriaQuery ? { categoria: categoriaQuery } : {}),
        ...(searchQuery ? { titulo: searchQuery } : {}),
        ...(uuid ? { clienteId: uuid } : {}),
        page,
        pageSize,
      });
      setKanbanData(result);
      setTotal(result.total ?? 0);
      setTotalPages(result.totalPages ?? 1);
    } catch (err) {
      console.log('Erro ao buscar vagas:', err);
      setKanbanData(resetKanbanVagaData);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusQuery, categoriaQuery, page, pageSize]);

  useEffect(() => {
    if (initialValues) return;
    fetchVagas();
  }, [searchQuery, statusQuery, categoriaQuery, page, pageSize]);

  return (
    <>
      <div className="flex justify-end items-end flex-wrap mb-4 gap-2 w-full">
        <FormInput
          name="Titulo"
          label="Titulo"
          placeholder="Buscar por título, descrição ou cidade..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
          clear
          inputProps={{
            className:
              'flex-grow w-full max-w-[400px] px-3 py-2 rounded-lg border border-gray-200 outline-none',
            disabled: loading,
          }}
        />

        <FormSelect
          name="Status"
          label="Status"
          value={statusInput}
          onChange={e => setStatusInput(e.target.value)}
          selectProps={{
            className: 'p-2 border border-gray-300 rounded',
            disabled: loading,
          }}
          placeholder="TODOS"
          placeholderDisable={false}
        >
          {StatusVagaEnum.options.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </FormSelect>

        <FormSelect
          name="Categoria"
          label="Categoria"
          value={categoriaInput}
          onChange={e => setCategoriaInput(e.target.value)}
          selectProps={{
            className: 'p-2 border border-gray-300 rounded',
            disabled: loading,
          }}
          placeholder="TODOS"
          placeholderDisable={false}
        >
          {CategoriaVagaEnum.options.map(area => (
            <option key={area} value={area}>
              {area}
            </option>
          ))}
        </FormSelect>

        <PrimaryButton
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <span className="material-icons-outlined">search</span>
        </PrimaryButton>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-secondary">Carregando vagas...</p>
        </div>
      ) : (
        kanbanData && (
          <div
            ref={boardWrapperRef}
            style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              minHeight: '10vh',
              maxHeight: '70vh',
              width: '100%',
              WebkitOverflowScrolling: 'touch',
            }}
            className="board-horizontal-scroll draggable-x"
          >
            <Board
              data={kanbanData}
              style={{
                minHeight: '10vh',
                maxHeight: '70vh',
                backgroundColor: 'transparent',
                boxShadow:
                  'inset 6px 0 10px -8px #c3b3e7, inset -6px 0 10px -8px #c3b3e7',
                scrollbarColor: '#8c53ff #e5e5e5',
                scrollbarWidth: 'thin',
                width: 'max-content',
                minWidth: '100%',
              }}
              laneStyle={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: '10px',
              }}
              onCardMoveAcrossLanes={handleCardMove}
              // Agora, as ações são tratadas aqui
              components={{
                Card: props => (
                  <CardKanban
                    {...props}
                    onEdit={_id => {
                      // _id pode ser string (id), mas props contém .data = cardData
                      if (props && props.data) {
                        handleEditCard(props.data);
                      }
                    }}
                    onDuplicate={_id => {
                      if (props && props.data) {
                        handleDuplicateCard(props.data);
                      }
                    }}
                    onDelete={_id => {
                      handleDeleteCard(props.data);
                      // if (props && props.data) {
                      // }
                    }}
                  />
                ),
              }}
            />
          </div>
        )
      )}

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1 || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages} ({total} vagas)
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || loading}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Próxima
          </button>
        </div>
      )}

      {/* Modal editar */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setVagaToEdit(null);
        }}
        title="Editar Vaga"
      >
        <VagaForm
          initialValues={vagaToEdit}
          onSubmit={async values => {
            await handleConfirmEdit(values);
          }}
        />
      </Modal>

      {/* Modal remover */}
      <ModalDelete
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setVagaToAction(null);
        }}
        message="Deseja deletar essa vaga?"
        btn={{
          next: {
            label: 'Tem certeza?',
            onClick: handleConfirmDelete,
          },
        }}
      />

      <ModalHistoricoVaga
        isOpen={showHistoricoModal}
        onClose={() => {
          setShowHistoricoModal(false);
          setSelectedVagaId('');
        }}
        vagaId={selectedVagaId}
      />

      <style jsx global>{`
        .board-horizontal-scroll {
          cursor: grab;
        }
        .board-horizontal-scroll.scroll-grabbing {
          cursor: grabbing !important;
        }
        .board-horizontal-scroll,
        .board-horizontal-scroll * {
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default VagaList;
