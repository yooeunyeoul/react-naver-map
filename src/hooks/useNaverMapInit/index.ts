import { useState } from "react";
import { isClientSide, isFunction } from "../../utils";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";
import { SCRIPT_ID } from "./constants";
import type { InitResult, UseNaverMapInit } from "./types";
import {
  createNaverMapScriptByClientId,
  insertNaverMapScriptIntoHead,
} from "./utils";

export enum Language {
  EN = "en",
  KO = "ko",
  JA = "ja",
  ZH = "zh",
}

/**
 * Load naver map script with provided client id.
 *
 * `Map` component will automatically load script. But, if you want to load naver map script in advance, you can use this hook.
 *
 * @param onLoad - This function will triggered when loading script finished. If 'onLoad' changes too often, wrap that definition in useCallback
 * @param onError - This function will triggered when loading script failed. If 'onError' changes too often, wrap that definition in useCallback
 */
export const useNaverMapInit: UseNaverMapInit = ({
  ncpClientId,
  submodules,
  language = Language.EN,  // language 파라미터 추가
  onLoad,
  onError,
}) => {
  const [{ isLoaded, isError }, setInitResult] = useState<InitResult>({
    isLoaded: false,
    isError: false,
  });

  useIsomorphicLayoutEffect(() => {
    if (!isClientSide) {
      setInitResult({ isLoaded: false, isError: false });
      return;
    }

     // Remove existing script if it exists
     const existingScript = document.getElementById(SCRIPT_ID);
     if (existingScript) {
       existingScript.remove();
     }

    const initNaverMapScript = async () => {
      const scriptInitResult = new Promise<InitResult>((resolve, reject) => {
        const script = createNaverMapScriptByClientId({
          ncpClientId,
          submodules,
          language, // language 파라미터 추가
        });
        insertNaverMapScriptIntoHead(script);

        script.addEventListener("load", function () {
          console.info("react-naver-map is initialized ");
          resolve({ isLoaded: true, isError: false });
        });

        script.addEventListener("error", function () {
          console.warn("Failed to initialize react-naver-map.");
          document.getElementById(SCRIPT_ID)?.remove();
          reject({ isLoaded: false, isError: true });
        });
      });

      const result = await scriptInitResult;
      setInitResult(result);
    };

    initNaverMapScript();
  }, [ncpClientId,language,submodules]);

  useIsomorphicLayoutEffect(() => {
    if (onLoad && isFunction(onLoad) && isLoaded) {
      onLoad();
    }
    if (onError && isFunction(onError) && isError) {
      onError();
    }
  }, [isLoaded, isError, onLoad, onError]);

  return { isLoaded, isError };
};
