import React, { useEffect, useState } from 'react';

const CheckboxCell = (props) => {
  const { checkedField, dataItem, dataItemKey, onRowChecked, render } = props;
  const { [dataItemKey]: _id, [checkedField]: checked } = dataItem;
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    if (checked !== isChecked) {
      setIsChecked(checked);
    }
  }, checked);

  const handleChecked = () => {
    const newIsChecked = !isChecked;
    // dataItem[field] = newIsChecked;
    setIsChecked(newIsChecked);
    onRowChecked(dataItem, newIsChecked);
  };

  const defaultRendering = () => (
    <td>
      <input
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
