import React, { useEffect, useState, useCallback } from 'react';
import { styling } from '../constants';

const CheckboxCell = (props) => {
  const { ariaColumnIndex, dataItem, columnIndex, render } = props;
  const { checkedField, dataItemKey, onRowChecked } = props;
  const _id = dataItem[dataItemKey] || '';
  const checked = dataItem[checkedField] || false;
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    if (checked !== isChecked) {
      setIsChecked(checked);
    }
  }, [checked]);

  const handleChecked = useCallback(() => {
    const newIsChecked = !isChecked;
    // dataItem[field] = newIsChecked;
    setIsChecked(newIsChecked);
    onRowChecked(dataItem, newIsChecked);
  }, [dataItem, isChecked]);

  const defaultRendering = (
    <td aria-colindex={ariaColumnIndex} data-grid-col-index={columnIndex}>
      <input
        style={styling.checkbox}
        type="checkbox"
        className="k-checkbox"
        key={`${_id}-row-checkbox`}
        onChange={() => handleChecked()}
        id={_id}
        defaultChecked={isChecked}
      />
      <label className="k-checkbox-label" htmlFor={_id} />
    </td>
  );

  // We call the render function in here instead of return the
  // defaultRendering, so the CellRenderer is still getting called.
  return render?.call(undefined, defaultRendering, props);
};

export default CheckboxCell;
