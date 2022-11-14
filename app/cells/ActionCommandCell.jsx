import * as React from 'react';
import { dataItemKey } from '../services';

const ActionCommandCell = (props) => {
  // const { add, cancel, discard, edit, update } = props;
  const { add, dataItem, editField, render, remove } = props;
  const inEdit = dataItem[editField];
  const isNewItem = dataItem[dataItemKey] === undefined;

  const renderInEdit = () => (
    <td className="k-command-cell">
      {isNewItem && (
        <button
          className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-save-command"
          onClick={() => add(dataItem)}
        >
          Save
        </button>
      )}
      {/* <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-cancel-command"
        onClick={() => (isNewItem ? discard(dataItem) : cancel(dataItem))}
      >
        {isNewItem ? 'Discard' : 'Cancel'}
      </button> */}
    </td>
  );

  const renderDefault = () => (
    <td className="k-command-cell">
      {/* <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary k-grid-edit-command"
        onClick={() => edit(dataItem)}
      >
        Edit
      </button> */}
      <button
        className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base k-grid-remove-command"
        onClick={() =>
          confirm('Confirm deleting: ' + dataItem.ProductName) &&
          remove(dataItem)
        }
      >
        Remove
      </button>
    </td>
  );

  const defaultRendering = inEdit ? renderInEdit() : renderDefault();
  return render?.call(undefined, defaultRendering, props);
};

export default ActionCommandCell;
