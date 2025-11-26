import { getPlanos } from '@/axios/plano.axios';
import {
  Plano,
  PlanoAssinado,
  PlanoCategoriaEnum,
} from '@/schemas/plano.schema';
import { getError } from '@/utils/getError';
import { useEffect, useState } from 'react';
import { FormInput } from '../input/FormInput';
import { FormSelect } from '../input/FormSelect';
// Importa o componente de tabela reutilizável
import Table, { TableColumn } from '../Table';

type PlanosFormProps = {
  errors?: any;
  onChange?: (planosIds: PlanoAssinado[]) => void;
  initialValues: PlanoAssinado[];
  disabledFields?: boolean;
};

export default function PlanosForm(props: PlanosFormProps) {
  const { errors, onChange, disabledFields } = props;
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loadingPlanos, setLoadingPlanos] = useState(false);

  // Controle dos campos para adicionar plano
  const [categoria, setCategoria] = useState<string>('');
  const [selectedPlanoId, setSelectedPlanoId] = useState<string>('');
  const [qtdVagas, setQtdVagas] = useState<string>('1');
  const [porcentagemMinima, setPorcentagemMinima] = useState<string>('');

  // Array de planos selecionados pelo usuário
  const [planosSelecionados, setPlanosSelecionados] = useState<PlanoAssinado[]>(
    props.initialValues || []
  );

  // Preço final calculado para o plano atual
  const [calculoPlanoMaisQdtVagas, setCalculoPlanoMaisQdtVagas] =
    useState<number>(0);

  useEffect(() => {
    const fetchPlanos = async () => {
      setLoadingPlanos(true);
      try {
        const resp = await getPlanos();
        setPlanos(resp.data.data || []);
      } catch (error) {
        setPlanos([]);
      } finally {
        setLoadingPlanos(false);
      }
    };
    fetchPlanos();
  }, []);

  useEffect(() => {
    // Recalcula o valor do plano considerando quantidade de vagas
    if (!selectedPlanoId) {
      setCalculoPlanoMaisQdtVagas(0);
      return;
    }
    const planoSelecionado = planos.find(p => p.id === selectedPlanoId);
    if (planoSelecionado && planoSelecionado.preco) {
      setCalculoPlanoMaisQdtVagas(
        Number(qtdVagas || 1) * planoSelecionado.preco
      );
    } else {
      setCalculoPlanoMaisQdtVagas(0);
    }
  }, [selectedPlanoId, qtdVagas, planos]);

  // Limpa seleção de plano ao mudar a categoria
  useEffect(() => {
    setSelectedPlanoId('');
  }, [categoria]);

  // Envia array de ids para o componente pai quando planosSelecionados é atualizado
  useEffect(() => {
    if (onChange) {
      onChange(planosSelecionados);
    }
  }, [planosSelecionados]);

  function handleAddPlano() {
    if (!selectedPlanoId) return;

    // Não deixar duplicar plano selecionado (pelo id)
    if (planosSelecionados.some(p => p.planoId === selectedPlanoId)) {
      return;
    }

    const plano = planos.find(p => p.id === selectedPlanoId);

    if (!plano) return;

    setPlanosSelecionados(prev => [
      ...prev,
      {
        status: 'ATIVA',
        qtdVagas: Number(qtdVagas),
        porcentagemMinima: Number(porcentagemMinima),
        planoId: plano.id,
        plano: { nome: plano.nome, categoria: plano.categoria },
      },
    ]);

    setCategoria('');
    setSelectedPlanoId('');
    setQtdVagas('1');
    setPorcentagemMinima('');
    setCalculoPlanoMaisQdtVagas(0);
  }

  function handleRemovePlano(id: string) {
    setPlanosSelecionados(prev => prev.filter(p => p.planoId !== id));
  }

  // Definição das colunas da tabela de planos selecionados
  const columns: TableColumn[] = [
    {
      label: 'Plano',
      key: 'plano.nome',
      hiddeBtnCopy: true,
      render: row => row.plano.nome.replace(/_/g, ' '),
    },
    {
      label: 'Categoria',
      key: 'plano.categoria',
      hiddeBtnCopy: true,
      render: row => row.plano.categoria.replace(/_/g, ' '),
    },
    {
      label: 'Qtd. Vagas',
      key: 'qtdVagas',
      hiddeBtnCopy: true,
    },
    {
      label: 'Pagamento Min. (%)',
      key: 'porcentagemMinima',
      hiddeBtnCopy: true,
      render: row => row.porcentagemMinima,
    },
    {
      label: '',
      key: 'actions',
      hiddeBtnCopy: true,
      render: row => (
        <button
          type="button"
          className="text-red-500 hover:text-red-700 ml-2"
          onClick={() => handleRemovePlano(row.planoId)}
        >
          Remover
        </button>
      ),
    },
  ];

  return (
    <>
      <label className="block text-primary text-xl font-bold mb-2">
        Planos do Cliente:
      </label>

      {loadingPlanos ? (
        <div className="flex items-center justify-center flex-col py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <span className="ml-2 text-primary">Carregando planos...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {PlanoCategoriaEnum && (
              <FormSelect
                name=""
                label="Categoria do Plano"
                placeholder="Selecione a categoria"
                selectProps={{
                  classNameContainer: 'flex-1/2',
                  onChange: e => setCategoria(e.target.value),
                  value: categoria,
                  disabled: disabledFields,
                }}
              >
                <>
                  <option value="">Selecione a categoria</option>
                  {PlanoCategoriaEnum.options.map((categoriaOption: string) => (
                    <option key={categoriaOption} value={categoriaOption}>
                      {categoriaOption.replace(/_/g, ' ')}
                    </option>
                  ))}
                </>
              </FormSelect>
            )}

            {!!categoria && (
              <FormSelect
                name=""
                label="Tipo de Plano"
                placeholder="Selecione o plano"
                selectProps={{
                  classNameContainer: 'flex-1/2',
                  onChange: e => setSelectedPlanoId(e.target.value),
                  value: selectedPlanoId,
                  disabled: disabledFields,
                }}
              >
                <>
                  {planos
                    .filter((plano: Plano) => plano.categoria === categoria)
                    .map((plano: Plano) => (
                      <option key={plano.id} value={plano.id}>
                        {plano.nome.replace('1 VAGA', '')}
                      </option>
                    ))}
                </>
              </FormSelect>
            )}

            {!!categoria && categoria.includes('RECRUTAMENTO') && (
              <div>
                <FormInput
                  name=""
                  label="Quantidade de vagas"
                  onChange={e => {
                    setQtdVagas(e.target.value);
                  }}
                  maskProps={{ mask: '00' }}
                  inputProps={{
                    max: 10,
                    value: qtdVagas ?? '',
                    disabled: disabledFields,
                  }}
                ></FormInput>
                <label>
                  Valor a pagar:{' '}
                  {categoria.includes('DIVERSOS')
                    ? 'percentual'
                    : `R$ ${calculoPlanoMaisQdtVagas}`}
                </label>
              </div>
            )}

            {!!selectedPlanoId && (
              <div>
                <FormInput
                  name=""
                  label="Valor de entrada a pagar (em %)"
                  maskProps={{ mask: '000', prefix: '%' }}
                  onChange={e => {
                    setPorcentagemMinima(e.target.value);
                  }}
                  inputProps={{
                    min: 1,
                    max: 100,
                    value: porcentagemMinima ?? '',
                    disabled: disabledFields,
                  }}
                ></FormInput>
                <label>
                  Valor de entrada a pagar:{' '}
                  {porcentagemMinima
                    ? `R$ ${(
                        Number(calculoPlanoMaisQdtVagas) *
                        (Number(porcentagemMinima) / 100)
                      ).toFixed(2)}`
                    : 'Informe a %'}
                </label>
              </div>
            )}

            {/* Botão adicionar plano */}
            <div className="col-span-2 flex mt-2">
              <button
                type="button"
                className="ml-auto px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
                onClick={handleAddPlano}
                disabled={
                  !selectedPlanoId ||
                  planosSelecionados.some(p => p.planoId === selectedPlanoId)
                }
              >
                Adicionar plano
              </button>
            </div>
          </div>

          {/* Lista de planos selecionados */}
          {planosSelecionados.length > 0 && (
            <div className="mt-6">
              <h3 className="block text-primary text-lg font-bold mb-2">
                Planos Selecionados
              </h3>
              <div className="overflow-x-auto">
                <Table
                  data={planosSelecionados}
                  columns={columns}
                  loading={false}
                  emptyMessage="Nenhum plano selecionado."
                />
              </div>
            </div>
          )}
        </>
      )}

      {getError(errors, 'planos') && (
        <p className="text-red-500 text-xs italic mt-2">
          {getError(errors, 'planos')}
        </p>
      )}
    </>
  );
}

// -------------------------------------------------------------------------
// Exemplo de uso do componente PlanosForm
// (Este exemplo pode estar em qualquer componente pai, ex: pages/planos.tsx)

// export function ExemploUsoPlanosForm() {
//   const [planosIds, setPlanosIds] = useState<string[]>([]);
//   // Simulação de validação de erro de planos
//   const errors =
//     planosIds.length === 0 ? { planos: 'Selecione pelo menos um plano' } : {};

//   return (
//     <div className="max-w-2xl mx-auto mt-6">
//       <PlanosForm errors={errors} onChange={setPlanosIds} />
//       <div className="mt-6">
//         <strong>Planos Selecionados (ids):</strong>
//         <pre className="bg-gray-100 p-2 rounded">
//           {JSON.stringify(planosIds, null, 2)}
//         </pre>
//       </div>
//     </div>
//   );
// }
