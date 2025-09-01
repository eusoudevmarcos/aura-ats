export interface Pagination<T = string> {
  page?: number;
  pageSize?: number;
  search?: T;
}
