import * as React from 'react';
import CheckboxCell from '../cells/CheckboxCell';
import { checkedField } from '../constants';
import { editField } from '../services';

/**
 * Responsible for rendering each Cell and adding properties to it.
 * This is similar to GridCellWeb for us.
 */

const TAB_KEY = 9;
const ENTER_KEY = 13;
const ESC_KEY = 27;

const CellRender = (props) => {
  const { cancel, enterEdit, focusNextCell, originalProps, td } = props;
  const { cell, dataItem, field } = originalProps;
  const inEditField = dataItem[editField];

  const additionalProps = {
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

  const isCurrentCellEdited = field === inEditField;
  if (field && isCurrentCellEdited) {
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

  // const isNotCheckedField = field !== checkedField;
  if (!isCurrentCellEdited) {
    // && isNotCheckedField) {
    Object.assign(additionalProps, {
      onClick: () => {
        enterEdit(dataItem, field);
      },
    });
  }
  const clonedProps = { ...td.props, ...additionalProps };
  const childNodes = td.props.children;
  return React.cloneElement(td, clonedProps, childNodes);
};

export default CellRender;
