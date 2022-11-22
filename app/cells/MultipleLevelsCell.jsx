import React, { useCallback, useEffect, useState } from 'react';

const Content = (props) => {
  const { ariaColumnIndex, columnIndex } = props;
  const { handleClick, value } = props;
  return (
    <td>
      <button onClick={handleClick}>{value}</button>
    </td>
  );
};

const Wrapper = (props) => {
  const { ariaColumnIndex, columnIndex } = props;
  const { children, dataItem, field } = props;
  const [randomNumber, setRandomNumber] = useState();
  const [value, setValue] = useState();

  useEffect(() => {
    setRandomNumber(Math.random() * 10);
  }, []);

  useEffect(() => {
    setValue(`${dataItem[field]}.${randomNumber}`);
  }, [dataItem[field], randomNumber]);

  const changeRandomNumber = useCallback(() => {
    setRandomNumber(Math.random() * 10);
  }, []);

  return children(value, changeRandomNumber);
};

const MultipleLevelsCell = (props) => {
  const { ariaColumnIndex, columnIndex } = props;
  const { dataItem, field, render } = props;
  useLogMountBehaviour('MultipleLevelsCell');

  const defaultRendering = (
    <Wrapper
      ariaColumnIndex={ariaColumnIndex}
      columnIndex={columnIndex}
      dataItem={dataItem}
      field={field}
    >
      {(value, changeRandomNumber) => (
        <Content
          ariaColumnIndex={ariaColumnIndex}
          columnIndex={columnIndex}
          value={value}
          handleClick={changeRandomNumber}
        />
      )}
    </Wrapper>
  );

  return render?.call(undefined, defaultRendering, props);
};

export default MultipleLevelsCell;
