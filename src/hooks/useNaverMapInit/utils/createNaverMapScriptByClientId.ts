import { SCRIPT_ID } from "../constants";
import type { InitParams } from "../types";

export const createNaverMapScriptByClientId = ({
  ncpClientId,
  submodules,
  language,  // language 파라미터는 이제 Language enum 타입입니다
}: Pick<InitParams, "ncpClientId" | "submodules" | "language">) => {

  const script = document.createElement("script");
  let paramsString = `ncpClientId=${ncpClientId}`;

  if (submodules?.length) {
    paramsString = paramsString.concat(`&submodules=${submodules.join(",")}`);
  }

  if (language) { // language 파라미터 추가
    paramsString = paramsString.concat(`&language=${language}`);
  }

  script.id = SCRIPT_ID;
  script.type = "text/javascript";
  script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?${paramsString}`;

  return script;
};
