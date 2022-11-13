import React, { useState } from 'react';
import * as ReactDOM from 'react-dom';
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from '@progress/kendo-react-grid';
import { sampleProducts } from './sample-products';
import ActionCommandCell from './cells/ActionCommandCell';
import DateCell from './cells/DateCell';
import DropDownCell from './cells/DropDownCell';
import {
  dataItemKey,
  deleteItem,
  editField,
  isItemEqualToDataItem,
  insertItem,
  updateItem,
} from './services';
import CellRender from './renderers/CellRenderer';
import RowRender from './renderers/RowRenderer';

const App = () => {
  const [data, setData] = useState(sampleProducts);
  const [dataBeforeSave, setDataBeforeSave] = useState(sampleProducts);

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
      enterEdit={enterEdit}
      editField={editField}
    />
  );

  const customRowRender = (tr, props) => (
    <RowRender
      originalProps={props}
      tr={tr}
      exitEdit={exitEdit}
      editField={editField}
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

  const cancel = (dataItem) => {
    const originalItem = dataBeforeSave;
    const newData = data.map((item) =>
      isItemEqualToDataItem(item, dataItem)
        ? { ...originalItem, [editField]: undefined }
        : item
    );
    setData(newData);
  };

  const enterEdit = (dataItem, field) => {
    setDataBeforeSave({ ...dataItem });
    let newData = data.map((item) => ({
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
    const newDataItem = {
      [editField]: true,
      Discontinued: false,
      ProductID: undefined,
      DeliveredOn: undefined,
    };
    setDataBeforeSave({ ...newDataItem });
    setData([newDataItem, ...data]);
  };

  return (
    <Grid
      data={data}
      onItemChange={itemChange}
      cellRender={customCellRender}
      rowRender={customRowRender}
      editField={editField}
      dataItemKey={dataItemKey}
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
      <Column field="ProductID" title="Id" width="40px" editable={false} />
      <Column field="ProductName" title="Product Name" width="150px" />
      <Column
        field="FirstOrderedOn"
        title="First Ordered"
        editor="date"
        format="{0:d}"
        width="140px"
      />
      <Column
        field="DeliveredOn"
        title="Delivered On"
        cell={DateCell}
        width="140px"
      />
      <Column
        field="UnitsInStock"
        title="Units"
        editor="numeric"
        width="100px"
      />
      <Column
        field="Discontinued"
        title="Discontinued"
        cell={DropDownCell}
        width="120px"
      />
      <Column cell={CommandCell} width="120px" />
    </Grid>
  );
};

ReactDOM.render(<App />, document.querySelector('my-app'));
