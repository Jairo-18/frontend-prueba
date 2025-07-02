import { PaginationInterface } from './pagination.interface';

export interface ApiResponseInterface<T> {
  message?: string;
  title?: string;
  statusCode: number;
  data: T;
  pagination?: PaginationInterface;
  error?: {
    message: string;
    validations: string[];
  };
}

interface DataNewRecordInterface {
  rowId: string;
}

export interface ApiResponseCreateInterface
  extends ApiResponseInterface<DataNewRecordInterface> {
  data: {
    rowId: string;
  };
}
