export interface PaginationInterface {
  page: number;
  perPage: number;
  total: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface ParamsPaginationInterface {
  order?: 'ASC' | 'DESC';
  page?: number;
  perPage?: number;
  search?: string;
  userId?: string;
}
