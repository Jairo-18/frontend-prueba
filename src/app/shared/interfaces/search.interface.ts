/* eslint-disable @typescript-eslint/no-explicit-any */
export type FieldType =
  | 'text'
  | 'select'
  | 'autocomplete'
  | 'date'
  | 'dateRange';

export interface SelectOption {
  value: any;
  label: string;
}

export interface SearchField {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: SelectOption[];
  validators?: any[];
  autocompleteOptions?: any[];
  defaultValue?: any;
  displayWith?: (value: any) => string;
  onAutocompleteChange?: (value: any) => void;
}

export interface SearchResult {
  title?: string;
  description?: string;
  id?: string | number;
  createdAt?: Date;
  deadline?: Date;
  finishDate?: Date;
  projectId?: number;
  updatedAt?: Date;
}

export interface ActionInterface {
  label: string;
  icon: string;
  action?: (item?: SearchResult) => void;
  routerLink?: string[];
  queryParams?: any;
}
