import { useEffect } from 'react';

let mountCounter = 0;
let unmountCounter = 0;

let mountPrintTimeout;
let unmountPrintTimeout;

export function logCellMount() {
  if (mountPrintTimeout) clearTimeout(mountPrintTimeout);
  mountCounter += 1;
  mountPrintTimeout = setTimeout(() => {
    console.log(`[Cell] mount | called ${mountCounter}`);
    mountCounter = 0;
  }, 15);
}

export function logCellUnmount() {
  if (unmountPrintTimeout) clearTimeout(unmountPrintTimeout);
  unmountCounter += 1;
  unmountPrintTimeout = setTimeout(() => {
    console.log(`[Cell] unmount | called ${unmountCounter}`);
    unmountCounter = 0;
  }, 15);
}

export const useLogMountCounter = () => {
  useEffect(() => {
    logCellMount();
    return () => {
      logCellUnmount();
    };
  }, []);
};

export const useLogMountBehaviour = (ComponentName) => {
  useEffect(() => {
    console.log(`[${ComponentName}] mount`);
    return () => {
      console.log(`[${ComponentName}] unmount`);
    };
  }, []);
};
