import React, { useState } from 'react';

const CheckboxCell = (props) => {
  const { checkedField, dataItem, dataItemKey, onRowChecked } = props;
  const _id = dataItem[dataItemKey];
  const isChecked = dataItem[checkedField];
  const key = `${_id}-row-checkbox`;
  const [isChecked, setIsChecked] = useState(dataItem[checkedField]);

  const handleChecked = () => {
    const newIsChecked = !isChecked;
    onRowChecked(_id, newIsChecked);
    setIsChecked(newIsChecked);
  };

  const defaultRendering = () => (
    <td>
      <input
        type="checkbox"
        className="k-checkbox"
        key={key}
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
