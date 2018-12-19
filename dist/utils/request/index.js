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

//# sourceMappingURL=data:application/json;charset=utf8;base64,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QkF3REM7QUFPRCxTQUFnQixZQUFZLENBQUMsRUFJUDtRQUhwQixzQkFBUSxFQUNSLGtCQUFNLEVBQ04sb0JBQU87SUFFUCxJQUFNLFlBQVksR0FBb0IsUUFBUSxDQUFDLElBQUksQ0FBQztJQUVwRCxJQUFJLFlBQVksQ0FBQyxXQUFXLEtBQUssQ0FBQyxFQUFFO1FBQ2xDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztLQUNuQjtTQUFNO1FBQ0wsRUFBRSxDQUFDLFNBQVMsQ0FBQztZQUNYLEtBQUssRUFBRSxRQUFRO1lBQ2YsVUFBVSxFQUFFLEtBQUs7WUFDakIsT0FBTyxFQUFFLFlBQVksQ0FBQyxVQUFVLElBQUcsTUFBSSxZQUFZLENBQUMsV0FBVyxNQUFHLENBQUE7U0FDbkUsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO0tBQ3RCO0FBQ0gsQ0FBQztBQWpCRCxvQ0FpQkMiLCJmaWxlIjoidXRpbHMvcmVxdWVzdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElDb21tb25SZXNwb25zZSB9IGZyb20gXCIuLi8uLi9hcGkvY29tbW9uXCI7XHJcbmltcG9ydCB7IGRvTG9naW4gfSBmcm9tIFwiLi4vLi4vYXBpL2xvZ2luXCI7XHJcbmltcG9ydCB7IGNoZWNrU2Vzc2lvbiB9IGZyb20gXCIuL2NoZWNrLXNlc3Npb25cIjtcclxuaW1wb3J0IHsgU0VTU0lPTl9LRVksIExPR0lOX0ZBSUxfQ09ERVMgfSBmcm9tIFwiLi4vLi4vY29uZmlnL2dsb2JhbC1jb25maWdcIjtcclxuXHJcbmNvbnN0IFRSWV9MT0dJTl9MSU1JVCA9IDM7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdChvYmo6IGFueSA9IHt9KTogUHJvbWlzZTxvYmplY3Q+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY2hlY2tTZXNzaW9uKClcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IHNlc3Npb24gPSB3eC5nZXRTdG9yYWdlU3luYyhTRVNTSU9OX0tFWSk7XHJcbiAgICAgICAgY29uc3QgeyB1cmwsIGRhdGEsIG1ldGhvZCwgaGVhZGVyLCBkYXRhVHlwZSB9ID0gb2JqO1xyXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwiUE9TVFwiKSB7XHJcbiAgICAgICAgICBoZWFkZXJbXCJjb250ZW50LXR5cGVcIl0gPSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgdHJ5TG9naW5Db3VudCA9IG9iai50cnlMb2dpbkNvdW50IHx8IDA7XHJcbiAgICAgICAgLy8g5aaC5p6c6ZyA6KaB6YCa6L+HIGRhdGEg5oqK55m75b2V5oCBIHNlc3Npb25JZCDluKbkuIpcclxuICAgICAgICBjb25zdCBkYXRhV2l0aFNlc3Npb24gPSB7IC4uLmRhdGEsIFtTRVNTSU9OX0tFWV06IHNlc3Npb24gfTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcImNoZWNrIHNlc3Npb246XCIsIGRhdGFXaXRoU2Vzc2lvbik7XHJcbiAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICB1cmwsXHJcbiAgICAgICAgICBkYXRhOiBkYXRhV2l0aFNlc3Npb24sXHJcbiAgICAgICAgICBtZXRob2QsXHJcbiAgICAgICAgICBoZWFkZXIsXHJcbiAgICAgICAgICBkYXRhVHlwZSxcclxuICAgICAgICAgIHN1Y2Nlc3M6IChyZXM6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDIwMCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IGRhdGFSZXNwb25zZTogSUNvbW1vblJlc3BvbnNlID0gcmVzLmRhdGE7XHJcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJkYXRhUmVzcG9uc2U6XCIsIGRhdGFSZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgLy8g55m76ZmG5oCB5aSx5pWI54m55a6a6ZSZ6K+v56CB5Yik5pat77yM5LiU6YeN6K+V5qyh5pWw5pyq6L6+5Yiw5LiK6ZmQXHJcbiAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgTE9HSU5fRkFJTF9DT0RFUy5pbmRleE9mKGRhdGFSZXNwb25zZS5yZXR1cm5fY29kZSkgPiAtMSAmJlxyXG4gICAgICAgICAgICAgICAgdHJ5TG9naW5Db3VudCA8IFRSWV9MT0dJTl9MSU1JVFxyXG4gICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZVN5bmMoU0VTU0lPTl9LRVkpOyAvLyDmuIXpmaTmnKzlnLDnvJPlrZhcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZG9Mb2dpbjpcIiwgb2JqKTtcclxuICAgICAgICAgICAgICAgIGRvTG9naW4oKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgb2JqLnRyeUxvZ2luQ291bnQgPSArK3RyeUxvZ2luQ291bnQ7XHJcbiAgICAgICAgICAgICAgICAgIHJlcXVlc3Qob2JqKVxyXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgIGRlYWxXaXRoQ29kZSh7IHJlc3BvbnNlLCByZWplY3QsIHJlc29sdmUgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGRlYWxXaXRoQ29kZSh7IHJlc3BvbnNlOiByZXMsIHJlamVjdCwgcmVzb2x2ZSB9KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KHJlcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBmYWlsOiBlcnIgPT4ge1xyXG4gICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgIH0pO1xyXG4gIH0pO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSURlYWxXaXRoQ29kZU9wdGlvbiB7XHJcbiAgcmVzcG9uc2U6IGFueTtcclxuICByZWplY3Q6IChyZXM6IGFueSkgPT4gdm9pZDtcclxuICByZXNvbHZlOiAoZXJyOiBhbnkpID0+IHZvaWQ7XHJcbn1cclxuZXhwb3J0IGZ1bmN0aW9uIGRlYWxXaXRoQ29kZSh7XHJcbiAgcmVzcG9uc2UsXHJcbiAgcmVqZWN0LFxyXG4gIHJlc29sdmVcclxufTogSURlYWxXaXRoQ29kZU9wdGlvbikge1xyXG4gIGNvbnN0IGRhdGFSZXNwb25zZTogSUNvbW1vblJlc3BvbnNlID0gcmVzcG9uc2UuZGF0YTtcclxuICAvLyDmraTlpITnlKjkvZzkuJrliqHplJnor6/noIHliKTmlq3lkozlpITnkIZcclxuICBpZiAoZGF0YVJlc3BvbnNlLnJldHVybl9jb2RlID09PSAwKSB7XHJcbiAgICByZXNvbHZlKHJlc3BvbnNlKTtcclxuICB9IGVsc2Uge1xyXG4gICAgd3guc2hvd01vZGFsKHtcclxuICAgICAgdGl0bGU6IFwi5o6l5Y+j6K+35rGC5Ye66ZSZXCIsXHJcbiAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxyXG4gICAgICBjb250ZW50OiBkYXRhUmVzcG9uc2UucmV0dXJuX21zZyArIGAoJHtkYXRhUmVzcG9uc2UucmV0dXJuX2NvZGV9KWBcclxuICAgIH0pO1xyXG4gICAgcmVqZWN0KGRhdGFSZXNwb25zZSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==
