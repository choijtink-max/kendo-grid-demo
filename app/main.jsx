import * as React from 'react';
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
import { deleteItem, getItems, insertItem, updateItem } from './services';
import CellRender from './renderers/CellRenderer';
import RowRender from './renderers/RowRenderer';

const App = () => {
  const editField = 'inEdit';
  const [data, setData] = React.useState(sampleProducts);

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

  // modify the data in the store, db etc
  const remove = (dataItem) => {
    const newData = deleteItem(dataItem);
    setData(newData);
  };

  const add = (dataItem) => {
    dataItem.inEdit = true;
    const newData = insertItem(dataItem);
    setData(newData);
  };

  const update = (dataItem) => {
    dataItem.inEdit = false;
    const newData = updateItem(dataItem);
    setData(newData);
  };

  // Local state operations
  const discard = (dataItem) => {
    const newData = [...data];
    newData.splice(0, 1);
    setData(newData);
  };

  const isEqual = (a, b, key = 'ProductID') => a[key] === b[key];
  const isItemEqualToDataItem = (dataItem, item) => {
    if (!item) {
      return (checkedItem) => isEqual(dataItem, checkedItem);
    }
    return isEqual(dataItem, item);
  };

  const cancel = (dataItem) => {
    const originalItem = getItems().find((item) =>
      isItemEqualToDataItem(dataItem, item)
    );
    const newData = data.map((item) =>
      item?.ProductID === originalItem?.ProductID ? originalItem : item
    );
    setData(newData);
  };

  const enterEdit = (dataItem) => {
    let newData = data.map((item) => ({
      ...item,
      [editField]: isItemEqualToDataItem(dataItem, item),
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
    const field = event.field || '';
    const newData = data.map((item) =>
      isItemEqualToDataItem(event.dataItem, item)
        ? {
            ...item,
            [field]: event.value,
          }
        : item
    );
    setData(newData);
  };

  const addNew = () => {
    const newDataItem = {
      [editField]: true,
      Discontinued: false,
      ProductID: undefined,
      DeliveredOn: undefined,
    };
    setData([newDataItem, ...data]);
  };

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

  return (
    <Grid
      data={data}
      onItemChange={itemChange}
      cellRender={customCellRender}
      rowRender={customRowRender}
      editField={editField}
      dataItemKey={'ProductID'}
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
      <Column field="ProductID" title="Id" width="50px" editable={false} />
      <Column field="ProductName" title="Product Name" />
      <Column
        field="FirstOrderedOn"
        title="First Ordered"
        editor="date"
        format="{0:d}"
      />
      {/* <Column
        field="DeliveredOn"
        title="Delivered On"
        cell={DateCell}
        width="140px"
      /> */}
      <Column field="UnitsInStock" title="Units" editor="numeric" />
      <Column field="Discontinued" title="Discontinued" cell={DropDownCell} />
      <Column cell={CommandCell} width="240px" />
    </Grid>
  );
};

ReactDOM.render(<App />, document.querySelector('my-app'));
