import * as React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { editField } from '../services';

const DropDownCell = (props) => {
  const { dataItem, field = '', onChange, render } = props;
  const localizedData = [
    {
      text: 'yes',
      value: true,
    },
    {
      text: 'no',
      value: false,
    },
    {
      text: '(empty)',
      value: null,
    },
  ];

  const handleChange = (e) => {
    if (onChange) {
      onChange({
        dataIndex: 0,
        dataItem: dataItem,
        field: field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
  };

  const dataValue = dataItem[field] === null ? '' : dataItem[field];

  const renderInEdit = () => (
    <DropDownList
      style={{ width: '100px' }}
      onChange={handleChange}
      value={localizedData.find((c) => c.value === dataValue)}
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
    <td>
      {dataItem[editField] === field ? renderInEdit() : dataValue.toString()}
    </td>
  );

  return render?.call(undefined, defaultRendering, props);
};

export default DropDownCell;
