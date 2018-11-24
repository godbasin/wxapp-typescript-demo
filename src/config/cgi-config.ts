// 是否开发环境
const isDev: boolean = true;

// 开发 HOST
const DEV_HOST = "";
// 正常 HOST
const NORMAL_HOST = "";

export const HOST: string = isDev ? DEV_HOST : NORMAL_HOST;

export const API = {
  login: HOST + `/login`,
  getData: HOST + `/query-data`
};
