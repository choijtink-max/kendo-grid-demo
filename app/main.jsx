import React, { useState } from 'react';
import * as ReactDOM from 'react-dom';
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from '@progress/kendo-react-grid';
import { sampleProducts } from './sample-products';
import ActionCommandCell from './cells/ActionCommandCell';
import CellRender from './renderers/CellRenderer';
import { columns, getFirstEditableColumn } from './columns';
import RowRender from './renderers/RowRenderer';
import {
  createNewItem,
  dataItemKey,
  deleteItem,
  editField,
  isItemEqualToDataItem,
  insertItem,
  updateItem,
  unselectItems,
  isItemEqualToDataItemCallback,
} from './services';

const App = () => {
  const [data, setData] = useState(sampleProducts);
  const [dataBeforeSave, setDataBeforeSave] = useState();

  const CommandCell = (props) => (
    <ActionCommandCell
      {...props}
      edit={enterEdit}
      remove={remove}
      add={add}
      discard={discard}
      update={update}
      cancel={cancel}
      editField={editField}
    />
  );

  const customCellRender = (td, props) => (
    <CellRender
      originalProps={props}
      td={td}
      cancel={cancel}
      editField={editField}
      enterEdit={enterEdit}
      exitEdit={exitEdit}
      focusNextCell={focusNextCell}
    />
  );

  const customRowRender = (tr, props) => (
    <RowRender
      originalProps={props}
      tr={tr}
      editField={editField}
      exitEdit={exitEdit}
    />
  );

  /**
   * Modify the data in the store, db etc
   * @param {Object} dataItem - The dataItem to remove.
   */
  const remove = (dataItem) => {
    const newData = deleteItem(dataItem, data);
    setData(newData);
  };

  /**
   * @param {Object} dataItem - The dataItem to add.
   */
  const add = (dataItem) => {
    dataItem[editField] = true;
    const newData = insertItem(dataItem, data);
    setData(newData);
  };

  /**
   * @param {Object} dataItem - The dataItem to update.
   */
  const update = (dataItem) => {
    dataItem[editField] = false;
    const newData = updateItem(dataItem, data);
    setData(newData);
  };

  /**
   * Local state operations
   * @param {Object} dataItem - The dataItem to update.
   */
  const discard = (dataItem) => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
  };

  /**
   * @param {Object} dataItem - The dataItem to update.
   * @param {string} field - The field.
   */
  const cancel = (dataItem, field) => {
    const originalItem = dataBeforeSave;
    const indexItem = data.findIndex((item) =>
      isItemEqualToDataItem(item, dataItem)
    );
    const newData = unselectItems(data);
    newData[indexItem][field] = originalItem[field];
    const obj1 = { dataItem, field, indexItem };
    console.log(`[cancel]`, { ...obj1, originalItem, newData });
    setData(newData);
    setDataBeforeSave(undefined);
  };

  /**
   * @param {Object} dataItem - The dataItem to update.
   * @param {string} field - The field.
   */
  const enterEdit = (dataItem, field) => {
    setDataBeforeSave({ ...dataItem });
    const newData = data.map((item) => ({
      ...item,
      [editField]: isItemEqualToDataItem(item, dataItem) ? field : undefined,
    }));
    setData(newData);
  };

  /**
   *
   */
  const exitEdit = () => {
    const newData = data.map((item) => ({
      ...item,
      [editField]: undefined,
    }));
    setData(newData);
  };

  /**
   * @param {Object} event - The event.
   * @param {Object} event.dataItem - The dataItem.
   * @param {Object} event.field - The event.
   * @param {Object} event.value - The value.
   */
  const itemChange = (event) => {
    const { dataItem, field, value } = event;
    const newData = data.map((item) => {
      if (isItemEqualToDataItem(item, dataItem)) {
        item[field] = value;
      }
      return item;
    });
    setData(newData);
  };

  /**
   *
   */
  const addNew = () => {
    const newDataItem = createNewItem(data);
    setDataBeforeSave({ ...newDataItem });
    setData([newDataItem, ...data]);
  };

  const focusOnNextLine = (editedLineIndex, nextLineIndex, newData, field) => {
    const isLastLine = nextLineIndex === data.length;

    const columnIndex = columns.findIndex((column) => column.field === field);
    const nextColumnIndex = columnIndex + 1;
    const isLastColumn = nextColumnIndex === columns.length;

    if (isLastLine) {
      exitEdit();
      return;
    }

    // Navigate to the first editable column in the next line
    const nextEditableColumn = getFirstEditableColumn(columns);
    newData[editedLineIndex][editField] = undefined;
    newData[nextLineIndex][editField] = nextEditableColumn?.field;

    setData(newData);
  };

  const focusOnNextCell = () => {};

  /**
   * @param {Object} dataItem - The dataItem to update.
   * @param {string} field - The field.
   */
  const focusNextCell = (dataItem, field) => {
    const editedLineIndex = data.findIndex(
      isItemEqualToDataItemCallback(dataItem)
    );

    if (editedLineIndex === -1) {
      return;
    }

    const columnIndex = columns.findIndex((column) => column.field === field);
    const nextColumnIndex = columnIndex + 1;
    const isLastColumn = nextColumnIndex === columns.length;
    const newData = [...data];
    let lineToUpdate = editedLineIndex;

    if (isLastColumn) {
      const nextLineIndex = editedLineIndex + 1;
      lineToUpdate = nextLineIndex;
      focusOnNextLine(editedLineIndex, nextLineIndex, newData, field);
    } else {
      // navigate to the next editable column.
      const nextColumns = columns.slice(nextColumnIndex);
      const nextColumn = getFirstEditableColumn(nextColumns);
      newData[editedLineIndex][editField] = nextColumn?.field;
      setData(newData);
    }
    const newDataItem = newData[lineToUpdate];
    setDataBeforeSave({ ...newDataItem });
  };

  return (
    <Grid
      data={data}
      onItemChange={itemChange}
      cellRender={customCellRender}
      rowRender={customRowRender}
      editField={editField}
      dataItemKey={dataItemKey}
      resizable
    >
      <GridToolbar>
        <button
          title="Add new"
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
          onClick={addNew}
        >
          Add new
        </button>
      </GridToolbar>
      {columns.map((column) => (
        <Column {...column} />
      ))}
      <Column cell={CommandCell} width="92px" />
    </Grid>
  );
};

ReactDOM.render(<App />, document.querySelector('my-app'));
