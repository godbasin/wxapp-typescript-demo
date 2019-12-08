/**
 * @file 封装日志
 */
import { VERSION } from "../config/global-config";

const canIUseLogManage = wx.canIUse("getLogManager");
const logger = canIUseLogManage
  ? wx.getLogManager({
      level: 0
    })
  : null;
var realtimeLogger = wx.getRealtimeLogManager
  ? wx.getRealtimeLogManager()
  : null;

/**
 * 格式化时间
 * @param {*} Date
 */
export function formatTime(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join("/") +
    " " +
    [hour, minute, second].map(formatNumber).join(":")
  );
}

const formatNumber = (n: number) => {
  const str = n.toString();
  return str[1] ? str : "0" + str;
};

/**
 * 日志只打印到本地，不上传到服务器
 * @param {string} file 所在文件名
 * @param  {...any} arg 参数
 */

export function DEBUG(file: string, ...args) {
  console.debug(file, " | ", ...args);
  if (canIUseLogManage) {
    logger!.debug(`[${VERSION}]`, file, " | ", ...args);
  }
  realtimeLogger && realtimeLogger.info(`[${VERSION}]`, file, " | ", ...args);
}

/**
 *
 * @param {string} file 所在文件名
 * @param {string} func 所在函数名
 * @param  {...any} arg 参数
 */
export function RUN(file: string, ...args) {
  console.log(file, " | ", ...args);
  if (canIUseLogManage) {
    logger!.log(`[${VERSION}]`, file, " | ", ...args);
  }
  realtimeLogger && realtimeLogger.info(`[${VERSION}]`, file, " | ", ...args);

  // 记录到本地，用来logs页面展示
  // 展示本地存储能力
  var logs: string[] = wx.getStorageSync("logs") || [];
  logs.unshift(`${formatTime(new Date())} ${file} | ${args[0]}`);
  wx.setStorageSync("logs", logs);
}

/**
 *
 * @param {string} file 所在文件名
 * @param {string} func 所在函数名
 * @param  {...any} arg 参数
 */
export function ERROR(file: string, ...args) {
  console.error(file, " | ", ...args);
  if (canIUseLogManage) {
    logger!.warn(`[${VERSION}]`, file, " | ", ...args);
  }
  if (realtimeLogger) {
    realtimeLogger.error(`[${VERSION}]`, file, " | ", ...args);
    // 判断是否支持设置模糊搜索
    if (realtimeLogger.setFilterMsg) {
      try {
        realtimeLogger.setFilterMsg(
          `[${VERSION}] ${file} ${JSON.stringify(args)}`
        );
      } catch (e) {
        realtimeLogger.setFilterMsg(`[${VERSION}] ${file}`);
      }
    }
  }
}

export function getLogger(fileName: string) {
  return {
    DEBUG: function(...args) {
      DEBUG(fileName, ...args);
    },
    RUN: function(...args) {
      RUN(fileName, ...args);
    },
    ERROR: function(...args) {
      ERROR(fileName, ...args);
    }
  };
}
