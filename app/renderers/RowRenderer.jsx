import * as React from 'react';

const RowRender = (props) => {
  const trProps = {
    ...props.tr.props,
    onBlur: () => {
      setTimeout(() => {
        const activeElement = document.activeElement;
        if (
          activeElement &&
          activeElement.className.indexOf('k-calendar') < 0
        ) {
          props.exitEdit();
        }
      });
    },
  };

  const childNodes = props.tr.props.children;
  return React.cloneElement(props.tr, { ...trProps }, childNodes);
};

export default RowRender;
