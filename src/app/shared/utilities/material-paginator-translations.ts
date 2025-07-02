import { MatPaginatorIntl } from '@angular/material/paginator';

export function getMaterialPaginatorTranslations(): MatPaginatorIntl {
  const paginatorIntl = new MatPaginatorIntl();
  paginatorIntl.itemsPerPageLabel = 'Mostrar';
  paginatorIntl.nextPageLabel = 'Página siguiente';
  paginatorIntl.previousPageLabel = 'Página anterior';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.lastPageLabel = 'Última página';
  paginatorIntl.getRangeLabel = rangeLabelTranslations;
  return paginatorIntl;
}

const rangeLabelTranslations = (
  page: number,
  pageSize: number,
  length: number
): string => {
  if (length == 0 || pageSize == 0) {
    return `0 de ${length}`;
  }
  length = Math.max(length, 0);
  const startIndex = page * pageSize;
  const endIndex =
    startIndex < length
      ? Math.min(startIndex + pageSize, length)
      : startIndex + pageSize;
  return `${startIndex + 1} - ${endIndex} de ${length}`;
};
