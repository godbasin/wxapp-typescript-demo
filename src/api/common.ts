export interface ICommonResp<T> {
  ret_msg: string;
  ret_code: number;
  data: T;
}
