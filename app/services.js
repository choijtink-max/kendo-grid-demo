import { sampleProducts } from './sample-products';

const initialData = [...sampleProducts];

export const dataItemKey = 'ProductID';
export const editField = 'inEdit';

export const isEqual = (a, b, key = dataItemKey) => a?.[key] === b?.[key];
export const isItemEqualToDataItem = (item, dataItem) => {
  return isEqual(item, dataItem);
};
export const isItemEqualToDataItemCallback = (dataItem) => {
  return (item) => isEqual(item, dataItem, dataItemKey);
};

export const generateId = (data) =>
  data.reduce((acc, current) => Math.max(acc, current[dataItemKey]), 0) + 1;

export const insertItem = (item, data) => {
  item[dataItemKey] = generateId(data);
  item[editField] = false;
  data.unshift(item);
  return data;
};

export const getItems = () => {
  return initialData;
};

export const updateItem = (item, data) => {
  let index = data.findIndex((record) => record[dataItemKey] === item[dataItemKey]);
  data[index] = item;
  return data;
};

export const deleteItem = (item, data) => {
  let index = data.findIndex((record) => record[dataItemKey] === item[dataItemKey]);
  data.splice(index, 1);
  return data;
};
