import React, { useEffect } from 'react';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import isFunction from 'lodash/isFunction';

/**
 * This is a own made GridCell which is used for Dates.
 * It is setup currently with the Delivered On column.
 */

const DateCell = (props) => {
  const { ariaColumnIndex, columnIndex, dataItem, field, render } = props;
  const isInEdit = field === dataItem.inEdit;
  const value = field && dataItem[field] ? dataItem[field] : '19990101';

  useEffect(() => {
    // console.log(`[DateCell] mount`);
    return () => {
      // console.log(`[DateCell] unmount`);
    };
  }, []);

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

  // We call the render function in here instead of return the
  // defaultRendering, so the CellRenderer is still getting called.
  return render?.call(undefined, defaultRendering, props);
};

export default DateCell;
