// global log level controls whether to print logs
const GLOBAL_LOG = true;

/**
 * 
 * @param MODULE_LOG module log level controls whether to print logs
 * @returns log function
 */
export function buildLog(MODULE_LOG: boolean = true): (...args: any[]) => void {
  return function (...args: any[]) {
    if (GLOBAL_LOG && MODULE_LOG) {
      console.log(...args);
    }
  };
}

// controled by global rather than module
export function log(...args: any[]): void {
  if (GLOBAL_LOG) {
    console.log(...args);
  }
}
