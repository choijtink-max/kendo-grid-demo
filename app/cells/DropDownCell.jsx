import * as React from 'react';
import { DropDownList } from '@progress/kendo-react-dropdowns';

const DropDownCell = (props) => {
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
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
  };
  const { dataItem } = props;
  const field = props.field || '';
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

  return <td>{dataItem.inEdit ? renderInEdit() : dataValue.toString()}</td>;
};

export default DropDownCell;