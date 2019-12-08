import { getLaunchOptions } from "../utils/util";

// 开发 HOST
const DEV_HOST = "";
// 正常 HOST
const NORMAL_HOST = "";
// 本地Mock HOST
const MOCK_HOST = "";

export function getHost(): string {
  const options = getLaunchOptions();
  if (options.query && options.query.env) {
    return options.query.env == "beta"
      ? DEV_HOST
      : options.query.env == "mock"
      ? MOCK_HOST
      : NORMAL_HOST;
  }
  return NORMAL_HOST;
}

export interface ICgiConfig {
  url: string;
  method:
    | "OPTIONS"
    | "GET"
    | "HEAD"
    | "POST"
    | "PUT"
    | "DELETE"
    | "TRACE"
    | "CONNECT";
  contentType?: string;
}

interface IAPI {
  [key: string]: ICgiConfig;
}

export const API: IAPI = {
  login: {
    url: "/login",
    method: "POST"
  },
  getInfo: {
    url: "/getInfo",
    method: "POST"
  }
};
