import React, { useEffect } from 'react';
import get from 'lodash/get';

const TextCell = (props) => {
  const { ariaColumnIndex, columnIndex } = props;
  const { dataItem, field, render } = props;
  const key = `${dataItem._id}.${field}`;
  const value = get(dataItem, field);
  // const [value, setValue] = useState(dataItem[field]);

  useEffect(() => {
    console.log(`[TextCell] mounted`);
    return () => {
      console.log(`[TextCell] unmounted`);
    };
  }, []);

  const defaultRendering = (
    <td
      aria-colindex={ariaColumnIndex}
      data-grid-col-index={columnIndex}
      key={key}
    >
      {value}
    </td>
  );

  return render?.call(undefined, defaultRendering, props);
};

export default TextCell;
