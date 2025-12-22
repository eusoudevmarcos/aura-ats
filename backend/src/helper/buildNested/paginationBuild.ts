import { VagaGetAllQuery } from "../../types/vaga.type";

export default function paginationBuild(query: VagaGetAllQuery) {
  const { page = "1", pageSize = "10", ...restQuery } = query;

  const pageNumber = Number.isNaN(Number(page))
    ? 1
    : parseInt(page as string, 10);
  const pageSizeNumber = Number.isNaN(Number(pageSize))
    ? 10
    : parseInt(pageSize as string, 10);

  return {
    ...restQuery,
    page: pageNumber,
    pageSize: pageSizeNumber,
  };
}
