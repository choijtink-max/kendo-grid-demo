import { dataItemKey, styling } from '../constants';
import React, { useCallback, useEffect, useState } from 'react';
import { useLogMountBehaviour, useLogMountCounter } from '../logger';

const CheckboxCell2 = (props) => {
  const { ariaColumnIndex, columnIndex, onChange } = props;
  const { dataItem, field, render } = props;
  const checkboxId = dataItem[dataItemKey] || '';
  const [isChecked, setIsChecked] = useState(dataItem[field]);
  useLogMountCounter();
  useLogMountBehaviour('CheckboxCell2');

  useEffect(() => {
    const newIsChecked = dataItem[field];
    if (newIsChecked !== isChecked) {
      setIsChecked(newIsChecked);
    }
  }, [dataItem]);

  const handleChecked = useCallback(
    (e) => {
      const newIsChecked = !dataItem[field];
      dataItem[field] = newIsChecked;
      setIsChecked(newIsChecked);
      // onRowChecked(dataItem, newIsChecked);
      dataItem.fn();

      if (onChange) {
        onChange({
          dataIndex: 0,
          dataItem,
          field,
          value: newIsChecked,
        });
      }
    },
    [dataItem, isChecked]
  );

  const defaultRendering = (
    <td
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={columnIndex}
      key={checkboxId}
    >
      <input
        style={styling.checkbox}
        type="checkbox"
        className="k-checkbox"
        key={`${checkboxId}-row-checkbox`}
        onChange={() => handleChecked()}
        id={checkboxId}
        defaultChecked={isChecked}
      />
      <label className="k-checkbox-label" htmlFor={checkboxId} />
    </td>
  );

  // We call the render function in here instead of return the
  // defaultRendering, so the CellRenderer is still getting called.
  return render?.call(undefined, defaultRendering, props);
};

export default CheckboxCell2;
