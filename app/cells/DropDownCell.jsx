import * as React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';

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

  const defaultRendering = (
    <td>{dataItem.inEdit ? renderInEdit() : dataValue.toString()}</td>
  );

  return render?.call(undefined, defaultRendering, props);
};

export default DropDownCell;
