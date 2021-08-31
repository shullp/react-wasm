import { useEffect, useState } from 'react';
import * as AsBind from 'as-bind';

export const useWasm = (fileName: string, imports?: any) => {
  const [state, setState] = useState({
    loaded: false,
    loading: false,
    asModule: null,
    error: null,
  });
  useEffect(() => {
    const abortController = new AbortController();

    if (fileName) {
      const fetchWasm = async () => {
        try {
          setState({ ...state, loading: true });
          const wasmResponse = await fetch(fileName, {
            signal: abortController.signal,
          });

          if (!wasmResponse.ok) {
            throw new Error(`Failed to fetch resource ${fileName}.`);
          }

          var importObject = {
            env: {
              memory: new WebAssembly.Memory({ initial: 200 }),
              abort(_msg: string) {
                console.error(`abort called msg: ${_msg}`);
              },
            },
          };

          //@ts-ignore
          const asModule = await AsBind.instantiate(
            wasmResponse,
            importObject
          );
          if (!abortController.signal.aborted) {
            setState({ asModule, loaded: true, error: null, loading: false });
          }
        } catch (error) {
          console.log(error);
          setState({ ...state, error, loading: false });
        }
      };
      fetchWasm();
    }

    return function cleanup() {
      abortController.abort();
    };
  }, [fileName, imports]);
  return state;
};
