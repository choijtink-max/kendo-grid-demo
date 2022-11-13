import DateCell from './cells/DateCell';
import DropDownCell from './cells/DropDownCell';

export function createColumn(field, title, width, props = {}) {
  return { field, title, width: `${width}px`, ...props };
}

export const columns = [
  createColumn('ProductID', 'Id', 40, { editable: false }),
  createColumn('ProductName', 'Product Name', 150),
  createColumn('FirstOrderedOn', 'First Ordered', 140, {
    editor: 'date',
    format: '{0:d}',
  }),
  createColumn('UnitsInStock', 'Units', 100, { editor: 'numeric' }),
  createColumn('Discontinued', 'Discontinued', 120, { cell: DropDownCell }),
  createColumn('DeliveredOn', 'Delivered On', 140, { cell: DateCell }),
];

export function getFirstEditableColumn(columnsToCheck = columns) {
  return columnsToCheck.find((column) => column.editable !== false);
}
