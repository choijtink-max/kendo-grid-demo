import React from 'react';

const CheckboxHeaderCell = (props) => {
  const { controlId, checkedAll, handleSetCheckedAll, render } = props;

  const defaultRendering = () => (
    <td>
      <input
        type="checkbox"
        className="k-checkbox"
        key={`checkbox-header-${controlId}`}
        id={`checkbox-header-${controlId}`}
        onChange={(event) => {
          handleSetCheckedAll(event.target.checked);
        }}
        defaultChecked={checkedAll}
      />
      <label
        className="k-checkbox-label"
        htmlFor={`checkbox-header-${controlId}`}
      />
    </td>
  );

  // We call the render function in here instead of return the
  // defaultRendering, so the CellRenderer is still getting called.
  return render?.call(undefined, defaultRendering, props);
};

export default CheckboxHeaderCell;