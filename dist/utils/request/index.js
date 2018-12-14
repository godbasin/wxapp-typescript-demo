"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var login_1 = require("../../api/login");
var check_session_1 = require("./check-session");
var global_config_1 = require("../../config/global-config");
var TRY_LOGIN_LIMIT = 3;
function request(obj) {
    if (obj === void 0) { obj = {}; }
    return new Promise(function (resolve, reject) {
        check_session_1.checkSession()
            .then(function () {
            var _a;
            var session = wx.getStorageSync(global_config_1.SESSION_KEY);
            var url = obj.url, data = obj.data, method = obj.method, header = obj.header, dataType = obj.dataType;
            if (method === "POST") {
                header["content-type"] = "application/x-www-form-urlencoded";
            }
            var tryLoginCount = obj.tryLoginCount || 0;
            var dataWithSession = __assign({}, data, (_a = {}, _a[global_config_1.SESSION_KEY] = session, _a));
            console.log("check session:", dataWithSession);
            wx.request({
                url: url,
                data: dataWithSession,
                method: method,
                header: header,
                dataType: dataType,
                success: function (res) {
                    if (res.statusCode === 200) {
                        var dataResponse = res.data;
                        console.log("dataResponse:", dataResponse);
                        if (global_config_1.LOGIN_FAIL_CODES.indexOf(dataResponse.return_code) > -1 &&
                            tryLoginCount < TRY_LOGIN_LIMIT) {
                            wx.removeStorageSync(global_config_1.SESSION_KEY);
                            console.log("doLogin:", obj);
                            login_1.doLogin().then(function () {
                                obj.tryLoginCount = ++tryLoginCount;
                                request(obj)
                                    .then(function (response) {
                                    dealWithCode({ response: response, reject: reject, resolve: resolve });
                                })
                                    .catch(function (err) {
                                    reject(err);
                                });
                            });
                        }
                        else {
                            dealWithCode({ response: res, reject: reject, resolve: resolve });
                        }
                    }
                    else {
                        reject(res);
                    }
                },
                fail: function (err) {
                    reject(err);
                }
            });
        })
            .catch(function (err) {
            reject(err);
        });
    });
}
exports.request = request;
function dealWithCode(_a) {
    var response = _a.response, reject = _a.reject, resolve = _a.resolve;
    var dataResponse = response.data;
    if (dataResponse.return_code === 0) {
        resolve(response);
    }
    else {
        wx.showModal({
            title: "接口请求出错",
            showCancel: false,
            content: dataResponse.return_msg + ("(" + dataResponse.return_code + ")")
        });
        reject(dataResponse);
    }
}
exports.dealWithCode = dealWithCode;

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkF3REM7QUFPRCxTQUFnQixZQUFZLENBQUMsRUFJUDtRQUhwQixzQkFBUSxFQUNSLGtCQUFNLEVBQ04sb0JBQU87SUFFUCxJQUFNLFlBQVksR0FBb0IsUUFBUSxDQUFDLElBQUksQ0FBQztJQUVwRCxJQUFJLFlBQVksQ0FBQyxXQUFXLEtBQUssQ0FBQyxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNuQjtTQUFNO1FBQ0wsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsVUFBVSxFQUFFLEtBQUs7WUFDakIsT0FBTyxFQUFFLFlBQVksQ0FBQyxVQUFVLElBQUcsTUFBSSxZQUFZLENBQUMsV0FBVyxNQUFHLENBQUE7U0FDbkUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQztBQWpCRCxvQ0FpQkMiLCJmaWxlIjoidXRpbHMvcmVxdWVzdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb21tb25SZXNwb25zZSB9IGZyb20gXCIuLi8uLi9hcGkvY29tbW9uXCI7XG5pbXBvcnQgeyBkb0xvZ2luIH0gZnJvbSBcIi4uLy4uL2FwaS9sb2dpblwiO1xuaW1wb3J0IHsgY2hlY2tTZXNzaW9uIH0gZnJvbSBcIi4vY2hlY2stc2Vzc2lvblwiO1xuaW1wb3J0IHsgU0VTU0lPTl9LRVksIExPR0lOX0ZBSUxfQ09ERVMgfSBmcm9tIFwiLi4vLi4vY29uZmlnL2dsb2JhbC1jb25maWdcIjtcblxuY29uc3QgVFJZX0xPR0lOX0xJTUlUID0gMztcblxuZXhwb3J0IGZ1bmN0aW9uIHJlcXVlc3Qob2JqOiBhbnkgPSB7fSk6IFByb21pc2U8b2JqZWN0PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY2hlY2tTZXNzaW9uKClcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2Vzc2lvbiA9IHd4LmdldFN0b3JhZ2VTeW5jKFNFU1NJT05fS0VZKTtcbiAgICAgICAgY29uc3QgeyB1cmwsIGRhdGEsIG1ldGhvZCwgaGVhZGVyLCBkYXRhVHlwZSB9ID0gb2JqO1xuICAgICAgICBpZiAobWV0aG9kID09PSBcIlBPU1RcIikge1xuICAgICAgICAgIGhlYWRlcltcImNvbnRlbnQtdHlwZVwiXSA9IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkXCI7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHRyeUxvZ2luQ291bnQgPSBvYmoudHJ5TG9naW5Db3VudCB8fCAwO1xuICAgICAgICAvLyDlpoLmnpzpnIDopoHpgJrov4cgZGF0YSDmiornmbvlvZXmgIEgc2Vzc2lvbklkIOW4puS4ilxuICAgICAgICBjb25zdCBkYXRhV2l0aFNlc3Npb24gPSB7IC4uLmRhdGEsIFtTRVNTSU9OX0tFWV06IHNlc3Npb24gfTtcbiAgICAgICAgY29uc29sZS5sb2coXCJjaGVjayBzZXNzaW9uOlwiLCBkYXRhV2l0aFNlc3Npb24pO1xuICAgICAgICB3eC5yZXF1ZXN0KHtcbiAgICAgICAgICB1cmwsXG4gICAgICAgICAgZGF0YTogZGF0YVdpdGhTZXNzaW9uLFxuICAgICAgICAgIG1ldGhvZCxcbiAgICAgICAgICBoZWFkZXIsXG4gICAgICAgICAgZGF0YVR5cGUsXG4gICAgICAgICAgc3VjY2VzczogKHJlczogYW55KSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xuICAgICAgICAgICAgICBjb25zdCBkYXRhUmVzcG9uc2U6IElDb21tb25SZXNwb25zZSA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImRhdGFSZXNwb25zZTpcIiwgZGF0YVJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgLy8g55m76ZmG5oCB5aSx5pWI54m55a6a6ZSZ6K+v56CB5Yik5pat77yM5LiU6YeN6K+V5qyh5pWw5pyq6L6+5Yiw5LiK6ZmQXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBMT0dJTl9GQUlMX0NPREVTLmluZGV4T2YoZGF0YVJlc3BvbnNlLnJldHVybl9jb2RlKSA+IC0xICYmXG4gICAgICAgICAgICAgICAgdHJ5TG9naW5Db3VudCA8IFRSWV9MT0dJTl9MSU1JVFxuICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlU3luYyhTRVNTSU9OX0tFWSk7IC8vIOa4hemZpOacrOWcsOe8k+WtmFxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9Mb2dpbjpcIiwgb2JqKTtcbiAgICAgICAgICAgICAgICBkb0xvZ2luKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBvYmoudHJ5TG9naW5Db3VudCA9ICsrdHJ5TG9naW5Db3VudDtcbiAgICAgICAgICAgICAgICAgIHJlcXVlc3Qob2JqKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgZGVhbFdpdGhDb2RlKHsgcmVzcG9uc2UsIHJlamVjdCwgcmVzb2x2ZSB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlYWxXaXRoQ29kZSh7IHJlc3BvbnNlOiByZXMsIHJlamVjdCwgcmVzb2x2ZSB9KTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcmVqZWN0KHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWlsOiBlcnIgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICB9KTtcbiAgfSk7XG59XG5cbmludGVyZmFjZSBJRGVhbFdpdGhDb2RlT3B0aW9uIHtcbiAgcmVzcG9uc2U6IGFueTtcbiAgcmVqZWN0OiAocmVzOiBhbnkpID0+IHZvaWQ7XG4gIHJlc29sdmU6IChlcnI6IGFueSkgPT4gdm9pZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBkZWFsV2l0aENvZGUoe1xuICByZXNwb25zZSxcbiAgcmVqZWN0LFxuICByZXNvbHZlXG59OiBJRGVhbFdpdGhDb2RlT3B0aW9uKSB7XG4gIGNvbnN0IGRhdGFSZXNwb25zZTogSUNvbW1vblJlc3BvbnNlID0gcmVzcG9uc2UuZGF0YTtcbiAgLy8g5q2k5aSE55So5L2c5Lia5Yqh6ZSZ6K+v56CB5Yik5pat5ZKM5aSE55CGXG4gIGlmIChkYXRhUmVzcG9uc2UucmV0dXJuX2NvZGUgPT09IDApIHtcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgfSBlbHNlIHtcbiAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgdGl0bGU6IFwi5o6l5Y+j6K+35rGC5Ye66ZSZXCIsXG4gICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcbiAgICAgIGNvbnRlbnQ6IGRhdGFSZXNwb25zZS5yZXR1cm5fbXNnICsgYCgke2RhdGFSZXNwb25zZS5yZXR1cm5fY29kZX0pYFxuICAgIH0pO1xuICAgIHJlamVjdChkYXRhUmVzcG9uc2UpO1xuICB9XG59XG4iXX0=
