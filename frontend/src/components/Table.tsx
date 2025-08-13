import React from "react";

// Tipo genérico para coluna
export interface TableColumn<T = any> {
  label: string;
  key: keyof T | string;
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

// Props do componente de tabela genérica
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
    if (value.length === 0) return "-";
    return value.join(", ");
  }

  if (typeof value === "object" && value !== null) {
    return JSON.stringify(value);
  }

  return value !== undefined && value !== null && value !== ""
    ? String(value)
    : "-";
}

// Função para enviar informações da linha ao clicar
// function enviarInformacoesDaLinha<T>(row: T) {}

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
      style={{ cursor: onRowClick ? "pointer" : "default" }}
    >
      {columns.map((col) => (
        <td key={String(col.key)}>
          {renderCellValue((row as any)[col.key], col, row, index)}
        </td>
      ))}
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
  // Gera um array de páginas para exibir (máximo de 5 páginas ao redor da atual)
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
        className="px-2 py-1 rounded border text-[#48038a] border-[#48038a] disabled:opacity-50"
        onClick={() => onPageChange && onPageChange(page - 1)}
        disabled={page === 1}
      >
        {"<"}
      </button>
      {getPages().map((p) => (
        <button
          key={p}
          className={`px-3 py-1 rounded border ${
            p === page
              ? "bg-[#48038a] text-white border-[#48038a]"
              : "text-[#48038a] border-[#48038a] bg-white"
          }`}
          onClick={() => onPageChange && onPageChange(p)}
          disabled={p === page}
        >
          {p}
        </button>
      ))}
      <button
        className="px-2 py-1 rounded border text-[#48038a] border-[#48038a] disabled:opacity-50"
        onClick={() => onPageChange && onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        {">"}
      </button>
      <span className="ml-4 text-[#48038a] text-sm">
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
  emptyMessage = "Nenhum resultado encontrado.",
  pagination,
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto w-full ">
      <table
        className="min-w-full border-separate border-spacing-0 bg-white rounded-lg"
        style={{ borderCollapse: "separate", borderSpacing: 0 }}
      >
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left font-semibold bg-[#f0f2f5] text-[#48038a]"
                style={{ position: "sticky", top: 0, zIndex: 1 }}
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
                style={{ height: "120px", padding: 0 }}
              >
                <div className="flex justify-center items-center h-[120px] w-full">
                  <svg
                    className="animate-spin h-8 w-8 text-[rgb(72,3,138)]"
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
                className="text-center py-6 text-[#48038a] font-medium"
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
      {/* Renderiza a paginação se as props de paginação forem passadas */}
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
        `}
      </style>
    </div>
  );
}

export default Table;
