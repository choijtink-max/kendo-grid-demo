import * as React from 'react';
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
  const { dataItem, field } = originalProps;
  const inEditField = dataItem[editField];
  const extraProps =
    field && field === inEditField
      ? {
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
        }
      : {
          onClick: () => {
            enterEdit(dataItem, field);
          },
        };

  const additionalProps = {
    ...extraProps,
    onKeyDown: (event) => {
      const { keyCode } = event;
      if (keyCode === TAB_KEY || keyCode === ENTER_KEY) {
        event.preventDefault();
        focusNextCell(dataItem, field);
      } else if (keyCode === ESC_KEY) {
        cancel(dataItem, field);
      }
    },
  };
  const clonedProps = { ...td.props, ...additionalProps };
  const childNodes = td.props.children;
  return React.cloneElement(td, clonedProps, childNodes);
};

export default CellRender;
