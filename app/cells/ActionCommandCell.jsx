import React, { useEffect, useState } from 'react';
import { useLogMountCounter, useLogMountBehaviour } from '../logger';

/**
 * This is the last grid column that has the remove button
 * and has the save button when a new item was added.
 */
const getIsNewItem = (dataItem, dataItemKey) =>
  dataItem[dataItemKey] === undefined;

const ActionCommandCell = (props) => {
  // const { add, cancel, discard, edit, update } = props;
  const { ariaColumnIndex, columnIndex } = props;
  const { add, dataItem, dataItemKey, discard, editField, render } = props;
  const [inEdit, setInEdit] = useState(dataItem[editField]);
  const [isNewItem, setIsNewItem] = useState(
    getIsNewItem(dataItem, dataItemKey)
  );
  useLogMountBehaviour('ActionCommandCell');
  useLogMountCounter();

  useEffect(() => {
    const newInEdit = dataItem[editField];
    const newIsNewItem = getIsNewItem(dataItem, dataItemKey);
    if (newInEdit !== inEdit) setInEdit(newInEdit);
    if (newIsNewItem !== isNewItem) setIsNewItem(newInEdit);
  }, [dataItem]);

  const defaultRendering = (
    <td
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={columnIndex}
      className="k-command-cell"
    >
      {inEdit && isNewItem && (
        <>
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
            onClick={() => discard(dataItem)}
          >
            Discard
          </button>
          <button
            className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
            onClick={() => add(dataItem)}
          >
            Save
          </button>
        </>
      )}
    </td>
  );
  return render?.call(undefined, defaultRendering, props);
};

export default ActionCommandCell;
