import { sampleProducts } from './sample-products';

const initialData = [...sampleProducts];

export const dataItemKey = 'ProductID';
export const editField = 'inEdit';

export function isEqual(a, b, key) {
  return a?.[key] === b?.[key];
}

export const isItemEqualToDataItem = (item, dataItem, key = dataItemKey) => {
  return isEqual(item, dataItem, key);
};

export const isItemEqualToDataItemCallback = (dataItem, key = dataItemKey) => {
  return (item) => isEqual(item, dataItem, key);
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
  const index = data.findIndex((dataItem) =>
    isItemEqualToDataItem(item, dataItem)
  );
  data[index] = item;
  return data;
};

export const deleteItem = (item, data) => {
  const index = data.findIndex((dataItem) =>
    isItemEqualToDataItem(item, dataItem)
  );
  data.splice(index, 1);
  return data;
};

export const createNewItem = () => ({
  [editField]: true,
  Discontinued: false,
  ProductID: undefined,
  FirstOrderedOn: undefined, // new Date(),
  DeliveredOn: undefined, // new Date(),
});
