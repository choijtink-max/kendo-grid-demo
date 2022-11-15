import { useEffect } from 'react';

let mountCounter = 0;
let unmountCounter = 0;

let mountPrintTimeout;
let unmountPrintTimeout;

export function logCellMount() {
  clearTimeout(mountPrintTimeout);
  mountCounter += 1;
  mountPrintTimeout = setTimeout(() => {
    console.log(`[Cell] mount | called ${mountCounter}`);
    mountCounter = 0;
  }, 15);
}

export function logCellUnmount() {
  clearTimeout(unmountPrintTimeout);
  unmountCounter += 1;
  unmountPrintTimeout = setTimeout(() => {
    console.log(`[Cell] unmount | called ${unmountCounter}`);
    unmountCounter = 0;
  }, 15);
}

const useLogMountBehaviour = () => {
  useEffect(() => {
    logCellMount();
    return () => {
      logCellUnmount();
    };
  }, []);
};

export default useLogMountBehaviour;
