// 通用请求
export interface ICommonRequest {
  appid?: string; // appid
  skey?: string; // session
}

// 通用返回
export interface ICommonResponse {
  return_code: number; // 返回码
  return_msg: string; // 返回消息
  return_err_type: string; // 返回错误类型
}
