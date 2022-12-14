import React, { useCallback, useEffect, useState } from 'react';
import {
  Grid,
  GridColumn as Column,
  GridToolbar,
} from '@progress/kendo-react-grid';
import cloneDeep from 'lodash/cloneDeep';
import get from 'lodash/get';
import isNil from 'lodash/isNil';
import CheckboxCell from './cells/CheckboxCell';
import CheckboxHeaderCell from './header-cells/CheckboxHeaderCell';
import { checkedField, dataItemKey, editField, styling } from './constants';
import { columns, getFirstEditableColumn } from './columns';
import CellRender from './renderers/CellRenderer';
import RowRender from './renderers/RowRenderer';
import {
  changeItemValue,
  createNewItem,
  deleteItem,
  deleteItems,
  getItems,
  getCheckedItems,
  isEveryRowChecked,
  isItemEqualToDataItem,
  insertItem,
  updateItem,
  unselectItems,
  isItemEqualToDataItemCallback,
  setFieldForEachItem,
} from './services';
import DropDownCell from './cells/DropDownCell';
import TextCell from './cells/TextCell';
import { useLogMountBehaviour, useLogMountCounter } from './logger';

const SimpleGrid = () => {
  const [data, setData] = useState(getItems());
  const [dataBeforeSave, setDataBeforeSave] = useState();
  const [isItemChecked, setIsItemChecked] = useState(false);
  const [checkedAll, setCheckedAll] = useState(false);

  const handleSetCheckedAll = () => {
    if (checkedAll) {
      // Change this to isAllChecked
      const newData = setFieldForEachItem(data, checkedField, false);
      setCheckedAll(false);
      setData(newData);
    } else {
      const newData = setFieldForEachItem(data, checkedField, true);
      setCheckedAll(true);
      setData(newData);
    }
  };

  useEffect(() => {
    const checkedItem = data.find((row) => row[checkedField]);
    setIsItemChecked(!isNil(checkedItem));
  }, [data]);

  const onRowChecked = useCallback(
    (dataItem, newValue) => {
      if (!isNil(dataBeforeSave)) {
        exitEdit();
      }

      const rowIndex = data.findIndex(isItemEqualToDataItemCallback(dataItem));
      const newData = data; // [...data];
      newData[rowIndex][checkedField] = newValue;

      const checkedAll = isEveryRowChecked(data);
      // onCheckAllClick(datasetInstanceId, controlId, checkedAll);
      setCheckedAll(checkedAll);
      setData(newData);
    },
    [data, dataBeforeSave]
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
  const discard = () => {
    const newData = data; // [...data];
    data.splice(0, 1);
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
    setData(newData);
    setDataBeforeSave(undefined);
  };

  /**
   * @param {Object} dataItem - The dataItem to update.
   * @param {string} field - The field.
   */
  const enterEdit = (dataItem, field) => {
    setDataBeforeSave({ ...dataItem });
    const newData = setFieldForEachItem(data, editField, (item) =>
      isItemEqualToDataItem(item, dataItem) ? field : undefined
    );
    setData(newData);
  };

  /**
   *
   */
  const exitEdit = () => {
    const newData = setFieldForEachItem(data, editField, undefined);
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
    const newData = changeItemValue(data, dataItem, field, value);
    setData(newData);
  };

  /**
   *
   */
  const addNew = () => {
    const newDataItem = createNewItem(data);
    setDataBeforeSave(newDataItem); // { ...newDataItem });
    const newData = data;
    newData.unshift(newDataItem);
    setData(newData);
  };

  /**
   *
   */
  const removeChecked = () => {
    const checkedItems = getCheckedItems(data, checkedField);
    const newData = deleteItems(checkedItems, data, checkedField);
    setData(newData);
  };

  /**
   * @param {number} editedLineIndex - The index of line that is being edited.
   * @param {number} nextColumnIndex - The index of the next column to navigate to.
   * @param {Array<Object>} newData - The new grid data.
   */
  const focusOnNextCell = (editedLineIndex, nextColumnIndex, newData) => {
    // navigate to the next editable column.
    const nextColumns = columns.slice(nextColumnIndex);
    const nextColumn = getFirstEditableColumn(nextColumns);
    const isNoEditColumnLeft = isNil(nextColumn);

    if (isNoEditColumnLeft) {
      focusOnNextLine(editedLineIndex, newData);
      return;
    }

    newData[editedLineIndex][editField] = nextColumn?.field;
    setData(newData);
    setDataBeforeSave({ ...newData[editedLineIndex] });
  };

  /**
   * @param {number} editedLineIndex - The index of line that is being edited.
   * @param {Array<Object>} newData - The new grid data.
   */
  const focusOnNextLine = (editedLineIndex, newData) => {
    const nextLineIndex = editedLineIndex + 1;
    const isLastLine = nextLineIndex === data.length;

    if (isLastLine) {
      exitEdit();
      return;
    }

    // Navigate to the first editable column in the next line
    const nextEditableColumn = getFirstEditableColumn(columns);
    newData[editedLineIndex][editField] = undefined;
    newData[nextLineIndex][editField] = nextEditableColumn?.field;

    setData(newData);
    setDataBeforeSave({ ...newData[nextLineIndex] });
  };

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

    if (isLastColumn) {
      focusOnNextLine(editedLineIndex, newData);
    } else {
      focusOnNextCell(editedLineIndex, nextColumnIndex, newData);
    }
  };

  const customCheckboxHeaderCell = (props) => (
    <CheckboxHeaderCell
      {...props}
      checkedAll={checkedAll}
      controlId="controlId"
      handleSetCheckedAll={handleSetCheckedAll}
    />
  );

  const customCellRender = (td, props) => (
    <CellRender
      cancel={cancel}
      checkedField={checkedField}
      dataItemKey={dataItemKey}
      editField={editField}
      enterEdit={enterEdit}
      exitEdit={exitEdit}
      focusNextCell={focusNextCell}
      originalProps={props}
      td={td}
    />
  );

  const customRowRender = (tr, props) => (
    <RowRender
      editField={editField}
      exitEdit={exitEdit}
      originalProps={props}
      tr={tr}
    />
  );

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
        <button
          disabled={!isItemChecked}
          title="Remove"
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid"
          onClick={removeChecked}
        >
          Remove
        </button>
      </GridToolbar>
      <Column
        width="40px"
        field={checkedField}
        minResizableWidth={40}
        reorderable={false}
        orderIndex={0}
        resizable={false}
        headerCell={customCheckboxHeaderCell}
        cell={CheckboxCell}
      />
      {columns
        .filter((column) => !get(column, 'hidden', false))
        .map((column) => (
          <Column {...column} />
        ))}
      <Column
        field="Category.CategoryName"
        title="CategoryName"
        width="120px"
        cell={TextCell}
        editable={false}
      />
      {/* <Column
        editable={false}
        cell={customActionCommandCell}
        resizable={false}
        width="90px"
      /> */}
    </Grid>
  );
};

export default SimpleGrid;
