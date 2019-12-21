export interface ICommonResp<T> {
  ret_msg: string;
  ret_code: number;
  data: T;
}

// 请求的时候可以带以下参数
export interface IRequestOption {
  showLoading?: boolean; // 是否显示加载中
  loadingText?: string; // 加载中的文字
  tryLoginCount?: number; // 尝试登陆次数
  showErrorToast?: boolean; // 是否显示错误toast
  errorText?: string; // 错误toast的文字
  showNetworkRetry?: boolean; // 展示由于网络原因失败的重试
  networkRetryText?: string; // 由于网络原因失败的文字
  tryRetryCount?: number; // 网络原因重试不超过3次
}
