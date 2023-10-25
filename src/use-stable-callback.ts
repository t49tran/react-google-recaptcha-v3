import { useRef, useEffect, useState } from 'react';

type AnyFunc = (...args: any[]) => any | undefined;

const useStableCallback = <T extends AnyFunc>(fn: T): T => {
  const ref = useRef(fn);

  useEffect(() => {
    ref.current = fn;
  }, [fn]);

  const [stableFn] = useState(() => {
    const newFn = (...args: any[]) => {
      if (ref.current) {
        return ref.current(...args);
      }
    };

    return newFn as T;
  });

  return stableFn;
};

export { useStableCallback };
