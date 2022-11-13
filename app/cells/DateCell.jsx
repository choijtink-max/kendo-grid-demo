import * as React from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import isFunction from 'lodash/isFunction';

const DateCell = (props) => {
  const { ariaColumnIndex, columnIndex, dataItem, field, render } = props;
  const isInEdit = field === dataItem.inEdit;
  const value = field && dataItem[field] ? dataItem[field] : '19990101';

  const onChange = (e) => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value,
      });
    }
  };

  const renderEditMode = () => (
    <div>
      <DatePicker
        name={field}
        defaultValue={value}
        format="yyyy-MM-dd"
        onChange={onChange}
      />
    </div>
  );

  const renderValue = () =>
    value && isFunction(value.toLocaleDateString)
      ? value.toLocaleDateString()
      : '';

  const defaultRendering = (
    <td
      style={{ textAlign: 'center' }}
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={columnIndex}
    >
      {isInEdit ? renderEditMode() : renderValue()}
    </td>
  );

  return render?.call(undefined, defaultRendering, props);
};

export default DateCell;
