import React, { useState, useCallback } from 'react';
import get from 'lodash/get';
import { styling } from '../constants';
import useLogMountBehaviour from '../logger';

function isItemChecked(dataItem, checkedField) {
  return Boolean(get(dataItem, checkedField, false) == true);
}

const CheckboxCell = (props) => {
  const { ariaColumnIndex, dataItem, columnIndex, render } = props;
  const { checkedField, dataItemKey, onRowChecked } = props;
  const _id = dataItem[dataItemKey] || '';
  const value = dataItem[checkedField];
  const [isChecked, setIsChecked] = useState(value);
  useLogMountBehaviour();

  const handleChecked = useCallback(() => {
    const newIsChecked = !isChecked;
    dataItem[checkedField] = newIsChecked;
    setIsChecked(newIsChecked);
    onRowChecked(dataItem, newIsChecked);
  }, [checkedField, dataItem, isChecked]);

  const defaultRendering = (
    <td 
    aria-colindex={ariaColumnIndex} 
    data-grid-col-index={columnIndex}
    key={_id}
    >
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
