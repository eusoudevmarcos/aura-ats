// types.d.ts ou no arquivo da API
export interface CreateEventRequestBody {
  summary: string;
  description?: string;
  start: string;
  end: string;
}
