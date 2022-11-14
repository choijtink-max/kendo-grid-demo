import { sampleProducts } from './sample-products';
import { checkedField, dataItemKey, editField } from './constants';

const initialData = [...sampleProducts];

/**
 * @param {Object} a - The first item to check.
 * @param {Object} b - The second item to check..
 * @param {string} key - The key used for searching.
 * @returns {boolean} True if items are equal
 */
export function isEqual(a, b, key) {
  return a?.[key] === b?.[key];
}

/**
 * @param {Object} item - The item to check.
 * @param {Object} dataItem - The dataItem to check.
 * @param {string} key - The key used for searching.
 * @returns {boolean} True if items are equal
 */
export const isItemEqualToDataItem = (item, dataItem, key = dataItemKey) => {
  return isEqual(item, dataItem, key);
};

/**
 * @param {Object} dataItem - The dataItem to check.
 * @param {string} key - The key used for searching.
 * @returns {Function<boolean>} True if items are equal
 */
export const isItemEqualToDataItemCallback = (dataItem, key = dataItemKey) => {
  return (item) => isEqual(item, dataItem, key);
};

/**
 * @param {Object} item - The item to delete.
 * @param {Array<Object>} data - The grid data.
 * @returns {string} The generated id.
 */
export const generateId = (data) =>
  data.reduce((acc, current) => Math.max(acc, current[dataItemKey]), 0) + 1;

/**
 * @param {Object} item - The item to delete.
 * @param {Array<Object>} data - The grid data.
 * @returns {Array<Object>} The updated grid data.
 */
export const insertItem = (item, data) => {
  item[dataItemKey] = generateId(data);
  item[editField] = false;
  data.unshift(item);
  return data;
};

/**
 *
 */
export const getItems = () => {
  return initialData;
};

/**
 * @param {Object} item - The item to delete.
 * @param {Array<Object>} data - The grid data.
 * @returns {Array<Object>} The unselected grid data.
 */
export const updateItem = (item, data) => {
  const index = data.findIndex((dataItem) =>
    isItemEqualToDataItem(item, dataItem)
  );
  data[index] = item;
  return data;
};

/**
 * @param {Object} item - The item to delete.
 * @param {Array<Object>} data - The grid data.
 * @returns {Array<Object>} The unselected grid data.
 */
export const deleteItem = (item, data) => {
  const index = data.findIndex((dataItem) =>
    isItemEqualToDataItem(item, dataItem)
  );
  data.splice(index, 1);
  return data;
};

/**
 * @param {Array<Object>} data - The grid data.
 * @returns {Object} The newly created item.
 */
export const createNewItem = (data) => ({
  [editField]: true,
  Discontinued: false,
  ProductID: undefined,
  FirstOrderedOn: null, // new Date(),
  DeliveredOn: null, // new Date(),
});

/**
 * @param {Array<Object>} data - The grid data.
 * @returns {Array<Object>} The unselected grid data.
 */
export function unselectItems(data) {
  return data.map((item) => {
    item[editField] = undefined;
    return item;
  });
}

export function setFieldForEachItem(data, field, value) {
  return data.map((item) => {
    item[field] = value;
    return item;
  })
}

export function isEveryRowChecked(data) {
  const checkedRows = data.filter((item) => item[checkedField]);
  return checkedRows.length === data.length;
}
