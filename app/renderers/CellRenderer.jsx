import * as React from 'react';

/**
 * Responsible for rendering each Cell and adding properties to it.
 * This is similar to GridCellWeb for us.
 */

const TAB_KEY = 9;
const ENTER_KEY = 13;
const ESC_KEY = 27;

const CellRender = (props) => {
  const { cancel, enterEdit, focusNextCell, originalProps, td } = props;
  const { checkedField, dataItemKey, editField } = props;
  const { dataItem, field } = originalProps;
  const isEditField = dataItem[editField] === field;

  const additionalProps = {
    checkedField,
    dataItemKey,
    editField,
    isEditField,
    onKeyDown: (event) => {
      const { keyCode } = event;
      if (keyCode === TAB_KEY || keyCode === ENTER_KEY) {
        event.preventDefault();
        focusNextCell(dataItem, field);
      } else if (keyCode === ESC_KEY) {
        cancel(dataItem, field);
      }
    },
    // onBlur: () => {
    //   setTimeout(() => {
    //     const activeElement = document.activeElement;
    //     if (
    //       activeElement &&
    //       activeElement.className.indexOf('k-calendar') < 0
    //     ) {
    //       cancel(dataItem, field);
    //     }
    //   });
    // },
  };

  if (field && isEditField) {
    Object.assign(additionalProps, {
      ref: (td) => {
        const input = td && td.querySelector('input');
        const activeElement = document.activeElement;
        if (
          !input ||
          !activeElement ||
          input === activeElement ||
          !activeElement.contains(input)
        ) {
          return;
        }
        if (input?.type === 'checkbox') {
          input.focus();
        } else {
          input.select();
        }
      },
    });
  }

  const isCheckedField = field === checkedField;
  if (!isEditField || !isCheckedField) {
    // && isNotCheckedField) {
    Object.assign(additionalProps, {
      onClick: (event) => {
        console.log(`onClick: ${field}`, event);
        enterEdit(dataItem, field);
      },
      onBlur: (event) => {
        console.log(`onBlur: ${field}`, event);
      },
    });
  }

  if (isCheckedField) {
    Object.assign(additionalProps, {
      onClick: (event) => {
        console.log(`onClick: ${field}`, event);
      },
    });
  }

  const gridProps = { checkedField, dataItemKey, editField };
  const clonedProps = { ...td.props, ...additionalProps, ...gridProps };
  const childNodes = td.props.children;
  return React.cloneElement(td, clonedProps, childNodes);
};

export default CellRender;
