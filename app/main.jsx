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

  // modify the data in the store, db etc
  const remove = (dataItem) => {
    const newData = deleteItem(dataItem, data);
    setData(newData);
  };

  const add = (dataItem) => {
    dataItem[editField] = true;
    const newData = insertItem(dataItem, data);
    setData(newData);
  };

  const update = (dataItem) => {
    dataItem[editField] = false;
    const newData = updateItem(dataItem, data);
    setData(newData);
  };

  // Local state operations
  const discard = (dataItem) => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
  };

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

  const enterEdit = (dataItem, field) => {
    setDataBeforeSave({ ...dataItem });
    const newData = data.map((item) => ({
      ...item,
      [editField]: isItemEqualToDataItem(item, dataItem) ? field : undefined,
    }));
    setData(newData);
  };

  const exitEdit = () => {
    const newData = data.map((item) => ({
      ...item,
      [editField]: undefined,
    }));
    setData(newData);
  };

  const itemChange = (event) => {
    console.log(`item change is called`);
    const { dataItem, field, value } = event;
    const newData = data.map((item) => {
      if (isItemEqualToDataItem(item, dataItem)) {
        item[field] = value;
      }
      return item;
    });
    setData(newData);
  };

  const addNew = () => {
    const newDataItem = createNewItem();
    setDataBeforeSave({ ...newDataItem });
    setData([newDataItem, ...data]);
  };

  const focusNextCell = (event, dataItem, field) => {
    const editedLineIndex = data.findIndex((item) =>
      isItemEqualToDataItem(item, dataItem)
    );

    if (editedLineIndex === -1) {
    }

    const columnIndex = columns.findIndex((column) => column.field === field);
    const nextColumnIndex = columnIndex + 1;
    const isLastColumn = nextColumnIndex === columns.length;

    const obj1 = { dataItem, field, columns };
    const obj2 = { columnIndex, nextColumnIndex, isLastColumn };
    console.log('[focusNextCell]', { ...obj1, ...obj2 });

    if (isLastColumn) {
      const nextLineIndex = editedLineIndex + 1;
      const isLastLine = nextLineIndex === data.length;

      if (isLastLine) {
        exitEdit();
        return;
      }

      // Navigate to the first editable column in the next line
      const nextEditableColumn = getFirstEditableColumn(columns);
      // const newData = data.map((item, index) => {
      //   if (index === editedLineIndex) {
      //     item[editField] = undefined;
      //   }
      //   if (index === nextLineIndex) {
      //     item[editField] = nextEditableColumn?.field;
      //   }
      //   return item;
      // });
      const newData = [...data];
      newData[editedLineIndex][editField] = undefined;
      newData[nextLineIndex][editField] = nextEditableColumn?.field;

      const newDataItem = newData[nextLineIndex];
      setDataBeforeSave({ ...newDataItem });
      setData(newData);
    } else {
      // dataItem[editField] = columns[nextColumnIndex].field;
      const newData = data.map((item) => {
        if (isItemEqualToDataItem(item, dataItem)) {
          item[editField] = columns[nextColumnIndex].field;
        }
        return item;
      });
      setData(newData);
    }
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
