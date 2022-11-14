import * as React from 'react';

/**
 * Responsible for rendering each Row and adding properties to it.
 * This is similar to GridCellWeb for us. It only does less then
 * it does on GridRowWeb. More of that functionality is now handled
 * in the CellRenderer and is probably the better place for it.
 */

const RowRender = (props) => {
  const { exitEdit, tr } = props;

  const trProps = {
    ...tr.props,
    onBlur: () => {
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          activeElement.className.indexOf('k-calendar') < 0
        ) {
          exitEdit();
        }
      });
    },
  };

  const childNodes = tr.props.children;
  return React.cloneElement(tr, { ...trProps }, childNodes);
};

export default RowRender;
