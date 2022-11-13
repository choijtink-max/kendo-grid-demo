import * as React from 'react';
import { editField } from '../services';

const TAB_KEY = 9;
const ENTER_KEY = 13;
const ESC_KEY = 27;

const CellRender = (props) => {
  const { enterEdit, exitEdit, focusNextCell, originalProps, td } = props;
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
      console.log(`on key down is called | keyCode: ${keyCode}`);
      if (keyCode === TAB_KEY || keyCode === ENTER_KEY) {
        // const obj = { keyCode, dataItem, field };
        // console.log('focusNextCell will be called', obj);
        focusNextCell(event, dataItem, field);
      } else if (keyCode === ESC_KEY) {
        exitEdit();
      }
    },
  };
  const clonedProps = { ...td.props, ...additionalProps };
  const childNodes = td.props.children;
  return React.cloneElement(td, clonedProps, childNodes);
};

export default CellRender;
