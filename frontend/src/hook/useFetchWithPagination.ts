import api from '@/axios';
import { useCallback, useEffect, useState } from 'react';

type PaginationResponse<T> = {
  data: T[];
  total: number;
  totalPages: number;
  [key: string]: any;
};

type UseFetchWithPaginationOptions = {
  method?: 'get' | 'post';
  page?: number;
  pageSize?: number;
  manual?: boolean;
  dependencies?: any[];
  requestOptions?: any; // opções extras para o axios
};

type UseFetchWithPaginationResult<T> = {
  data: T[];
  total: number;
  totalPages: number;
  loading: boolean;
  error: any;
  refetch: (params?: any) => void;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  page: number;
  pageSize: number;
};

function useFetchWithPagination<T = any>(
  endpoint: string,
  params?: any,
  options?: UseFetchWithPaginationOptions
): UseFetchWithPaginationResult<T> {
  const {
    method = 'get',
    page: initialPage = 1,
    pageSize: initialPageSize = 10,
    manual = false,
    dependencies = [],
    requestOptions = {},
  } = options || {};

  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [internalParams, setInternalParams] = useState(params);

  const fetchData = useCallback(
    async (overrideParams?: any) => {
      setLoading(true);
      setError(null);
      try {
        const finalParams = {
          ...(params || {}),
          ...(overrideParams || {}),
          page,
          pageSize,
        };

        let response;
        if (method === 'get') {
          response = await api.get<PaginationResponse<T>>(endpoint, {
            params: finalParams,
            ...requestOptions,
          });
        } else if (method === 'post') {
          response = await api.post<PaginationResponse<T>>(
            endpoint,
            finalParams,
            {
              ...requestOptions,
            }
          );
        } else {
          throw new Error('Método não suportado');
        }

        if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data);
          setTotal(response.data.total ?? response.data.data.length);
          setTotalPages(response.data.totalPages ?? 1);
        } else if (Array.isArray(response.data)) {
          setData(response.data);
          setTotal(response.data.length);
          setTotalPages(1);
        } else {
          setData([]);
          setTotal(0);
          setTotalPages(1);
        }
      } catch (err: any) {
        setError(err);
        setData([]);
        setTotal(0);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    [
      endpoint,
      method,
      page,
      pageSize,
      JSON.stringify(params),
      JSON.stringify(requestOptions),
    ]
  );

  const refetch = (overrideParams?: any) => {
    setInternalParams(overrideParams || params);
    fetchData(overrideParams);
  };

  useEffect(() => {
    if (!manual) {
      fetchData();
    }
  }, [
    endpoint,
    method,
    page,
    pageSize,
    ...dependencies,
    JSON.stringify(params),
  ]);

  return {
    data,
    total,
    totalPages,
    loading,
    error,
    refetch,
    setPage,
    setPageSize,
    page,
    pageSize,
  };
}

export default useFetchWithPagination;
