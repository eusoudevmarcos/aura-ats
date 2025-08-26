'use client';
import React, { useState } from 'react';
import { PrimaryButton } from './button/PrimaryButton';

export interface TableColumn<T = any> {
  label: string;
  key: keyof T | string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

interface PaginationProps {
  page: number;
  pageSize?: number;
  total: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

interface TableProps<T = any> {
  data: T[] | undefined;
  columns: TableColumn<T>[];
  loading?: boolean;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
  pagination?: PaginationProps;
}

function renderCellValue<T>(
  value: any,
  col: TableColumn<T>,
  row: T,
  index: number
): React.ReactNode {
  if (col.render) {
    return col.render(value, row, index);
  }

  if (Array.isArray(value)) {
    if (value.length === 0) return '-';
    return value.join(', ');
  }

  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value);
  }

  return value !== undefined && value !== null && value !== ''
    ? String(value)
    : '-';
}

function ButtonCopy({ valorCompleto }: any) {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(valorCompleto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 4000);
    }
  };

  React.useEffect(() => {
    let span: HTMLSpanElement | null = null;
    if (copiado) {
      span = document.createElement('span');
      span.className =
        'fixed left-1/2 -translate-x-1/2 bottom-8 z-50 bg-[#8c53ff] text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium';
      span.innerText = 'Copiado para a área de transferência!';
      document.body.appendChild(span);
    }

    return () => {
      if (span && document.body.contains(span)) {
        document.body.removeChild(span);
      }
    };
  }, [copiado]);

  return (
    <>
      <PrimaryButton
        title={copiado ? 'Copiado!' : 'Copiar'}
        className="!p-1"
        onClick={handleCopy}
      >
        <span className="material-icons" style={{ fontSize: 16 }}>
          {copiado ? 'done' : 'content_copy'}
        </span>
      </PrimaryButton>
    </>
  );
}

function TR<T>({
  row,
  columns,
  onRowClick,
  index,
}: {
  row: T;
  columns: TableColumn<T>[];
  onRowClick?: (row: T) => void;
  index: number;
}) {
  // Função que será chamada ao clicar na linha
  const handleRowClick = () => {
    if (onRowClick) {
      onRowClick(row);
    }
  };

  return (
    <tr
      className="result-row"
      onClick={handleRowClick}
      style={{ cursor: onRowClick ? 'pointer' : 'default' }}
    >
      {columns.map(col => {
        const valorCelula = renderCellValue(
          (row as any)[col.key],
          col,
          row,
          index
        );
        const valorCompleto = (row as any)[col.key] ?? valorCelula;

        return (
          <td
            key={String(col.key)}
            className={`relative group max-w-[160px] min-w-[80px] whitespace-nowrap overflow-hidden text-ellipsis align-middle px-4 py-3 ${
              onRowClick ? 'cursor-pointer' : 'cursor-default'
            }`}
          >
            {/* Valor resumido (ellipsis) */}
            <span className="cell-ellipsis block whitespace-nowrap overflow-hidden text-ellipsis w-full transition-colors duration-200">
              {valorCelula}
            </span>

            <span
              title={valorCompleto}
              className="cell-full absolute left-0 top-0 z-20 bg-white shadow-lg px-2 py-2 min-w-full max-w-[400px] whitespace-pre-line overflow-x-auto text-primary font-medium rounded-lg border border-gray-200 word-break-normal group-hover:block "
            >
              <div className="flex flex-row items-center justify-between gap-2">
                <p className="fit m-0">{valorCompleto}</p>
                <ButtonCopy valorCompleto={valorCompleto} />
              </div>
            </span>
            <style jsx>{`
              td.group:hover .cell-ellipsis {
                visibility: hidden;
              }
              td.group:hover .cell-full {
                display: block;
                visibility: visible;
              }
              td.group .cell-full {
                display: none;
                visibility: hidden;
              }
            `}</style>
          </td>
        );
      })}
    </tr>
  );
}

// Componente de paginação simples
const Pagination: React.FC<PaginationProps> = ({
  page,
  total,
  totalPages,
  onPageChange,
}) => {
  const getPages = () => {
    const pages = [];
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, page + 2);

    if (end - start < 4) {
      if (start === 1) {
        end = Math.min(totalPages, start + 4);
      } else if (end === totalPages) {
        start = Math.max(1, end - 4);
      }
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-4">
      <button
        className="px-2 py-1 rounded border text-primary border-primary disabled:opacity-50"
        onClick={() => onPageChange && onPageChange(page - 1)}
        disabled={page === 1}
      >
        {'<'}
      </button>
      {getPages().map(p => (
        <button
          key={p}
          className={`px-3 py-1 rounded border ${
            p === page
              ? 'bg-primary text-white border-primary'
              : 'text-primary border-primary bg-white'
          }`}
          onClick={() => onPageChange && onPageChange(p)}
          disabled={p === page}
        >
          {p}
        </button>
      ))}
      <button
        className="px-2 py-1 rounded border text-primary border-primary disabled:opacity-50"
        onClick={() => onPageChange && onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        {'>'}
      </button>
      <span className="ml-4 text-primary text-sm">
        Página {page} de {totalPages} ({total} registros)
      </span>
    </div>
  );
};

function Table<T>({
  data,
  columns,
  loading = false,
  onRowClick,
  emptyMessage = 'Nenhum resultado encontrado.',
  pagination,
}: TableProps<T>) {
  return (
    <>
      <div className="overflow-x-auto w-full">
        <table
          className="min-w-full border-separate border-spacing-0 bg-white rounded-lg"
          style={{ borderCollapse: 'separate', borderSpacing: 0 }}
        >
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={String(col.key)}
                  className="px-4 py-3 text-left font-semibold bg-neutral text-secondary"
                  style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="relative">
            {loading && (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{ height: '120px', padding: 0 }}
                >
                  <div className="flex justify-center items-center h-[120px] w-full">
                    <svg
                      className="animate-spin h-8 w-8 text-primary"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                  </div>
                </td>
              </tr>
            )}
            {!loading && (!data || data.length === 0) ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center py-6 text-secondary font-medium"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data &&
              data.map((row, i) => (
                <TR
                  row={row}
                  columns={columns}
                  onRowClick={onRowClick}
                  key={i}
                  index={i}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={pagination.onPageChange}
        />
      )}

      <style>
        {`
          .result-row:not(:last-child) td {
            border-bottom: 1px solid rgba(72, 3, 138, 0.2);
          }
          .result-row td, .result-row th {
            vertical-align: middle;
            padding: 12px 16px;
          }
          .result-row:hover {
            background-color: #f3eafd;
            transition: background 0.2s;
          }
          @media (max-width: 768px) {
            .result-row td, .result-row th {
              padding: 8px 8px;
              font-size: 13px;
              max-width: 90vw;
            }
          }
        `}
      </style>
    </>
  );
}

export default Table;
