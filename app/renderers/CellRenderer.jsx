import * as React from 'react';
import { editField } from '../services';

const CellRender = (props) => {
  const { enterEdit, originalProps, td } = props;
  const { dataItem, field } = originalProps;
  const inEditField = dataItem[props[editField] || ''];
  const additionalProps =
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
            if (input.type === 'checkbox') {
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

  const clonedProps = { ...td.props, ...additionalProps };
  const childNodes = td.props.children;
  return React.cloneElement(td, clonedProps, childNodes);
};

export default CellRender;
