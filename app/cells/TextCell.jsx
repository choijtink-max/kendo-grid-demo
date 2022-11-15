import React, { useEffect, useState } from 'react';
import get from 'lodash/get';
import { useLogMountBehaviour, useLogMountCounter } from '../logger';
import { dataItemKey } from '../constants';

const TextCell = (props) => {
  const { ariaColumnIndex, columnIndex } = props;
  const { dataItem, field, render } = props;
  const key = `${dataItem[dataItemKey]}.${field}`;
  const value = get(dataItem, field);
  useLogMountBehaviour('TextCell');
  useLogMountCounter();

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
