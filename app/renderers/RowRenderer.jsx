import * as React from 'react';

const RowRender = (props) => {
  const { exitEdit, tr } = props;

  const trProps = {
    ...tr.props,
    onBlur: () => {
      // setTimeout(() => {
      //   const activeElement = document.activeElement;
      //   if (
      //     activeElement &&
      //     activeElement.className.indexOf('k-calendar') < 0
      //   ) {
      //     exitEdit();
      //   }
      // });
    },
  };

  const childNodes = tr.props.children;
  return React.cloneElement(tr, { ...trProps }, childNodes);
};

export default RowRender;
