import * as React from 'react';

const CellRender = (props) => {
  const dataItem = props.originalProps.dataItem;
  const cellField = props.originalProps.field;
  const inEditField = dataItem[props.editField || ''];
  const additionalProps =
    cellField && cellField === inEditField
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
            props.enterEdit(dataItem, cellField);
          },
        };

  const clonedProps = { ...props.td.props, ...additionalProps };
  const childNodes = props.td.props.children;
  return React.cloneElement(props.td, clonedProps, childNodes);
};

export default CellRender;