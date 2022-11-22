import React, { useEffect, useState } from 'react';
import isNil from 'lodash/isNil';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { dataItemKey, editField } from '../constants';
import { useLogMountBehaviour, useLogMountCounter } from '../logger';

const localizedData = [
  { text: 'yes', value: true },
  { text: 'no', value: false },
  { text: '(empty)', value: null },
];

const DropDownCell = (props) => {
  const { ariaColumnIndex, columnIndex } = props;
  const { dataItem, field, onChange, render } = props;
  const [key] = useState(`${dataItem[dataItemKey]}.${field}`);
  const [value, setValue] = useState(dataItem[field]);
  const [isEdited, setIsEdited] = useState(dataItem[editField] === field);
  useLogMountBehaviour('DropDownCell');
  useLogMountCounter();

  useEffect(() => {
    const newValue = dataItem[editField] === field;
    if (isEdited !== newValue) {
      setIsEdited(isEdited);
    }
  }, [dataItem[editField]]);

  useEffect(() => {
    const newValue = dataItem[field];
    if (value !== newValue) {
      setValue(newValue);
    }
  }, [dataItem[field]]);

  const handleChange = (e) => {
    if (onChange) {
      const newValue = e.target.value.value;
      onChange({
        dataIndex: 0,
        dataItem,
        field,
        syntheticEvent: e.syntheticEvent,
        value: newValue,
      });
      if (value !== newValue) {
        setValue(newValue);
      }
    }
  };

  const renderInEdit = () => (
    <DropDownList
      style={{ width: '100px' }}
      onChange={handleChange}
      value={localizedData.find((c) => c.value === value)}
      data={localizedData}
      textField="text"
    />
  );

  // Every custom Cell renders a <td> back and is not wrapped in different types of components.
  // This one can be, but are its children. Its children are responsible for handling there own
  // specific actions. But the top Cell is just return a td and thats it.
  // I think we need to add functionality to the grid cells like onClick not in the GridCellWeb
  // but instead add them in the CellRenderer.
  const defaultRendering = (
    <td
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={columnIndex}
      key={key}
    >
      {dataItem[editField] === field
        ? renderInEdit()
        : (isNil(value) ? '' : value).toString()}
    </td>
  );

  return render?.call(undefined, defaultRendering, props);
};

export default DropDownCell;
