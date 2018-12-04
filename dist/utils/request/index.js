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
var login_1 = require("./login");
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
            var tryLoginCount = obj.tryLoginCount || 0;
            var dataWithSession = __assign({}, data, (_a = {}, _a[global_config_1.SESSION_KEY] = session, _a.appid = global_config_1.APPID, _a));
            wx.request({
                url: url,
                data: dataWithSession,
                method: method,
                header: header,
                dataType: dataType,
                success: function (res) {
                    if (res.statusCode === 200) {
                        var data_1 = res.data;
                        if (global_config_1.LOGIN_FAIL_CODES.indexOf(data_1.return_code) > -1 &&
                            tryLoginCount < TRY_LOGIN_LIMIT) {
                            login_1.doLogin().then(function () {
                                obj.tryLoginCount = ++tryLoginCount;
                                request(obj)
                                    .then(function (res) {
                                    resolve(res);
                                })
                                    .catch(function (err) {
                                    reject(err);
                                });
                            });
                        }
                        else {
                            resolve(res);
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL3JlcXVlc3QvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQUFBLGlDQUFrQztBQUNsQyxpREFBK0M7QUFDL0MsNERBSW9DO0FBRXBDLElBQU0sZUFBZSxHQUFHLENBQUMsQ0FBQztBQUUxQixTQUFnQixPQUFPLENBQUMsR0FBYTtJQUFiLG9CQUFBLEVBQUEsUUFBYTtJQUNuQyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07UUFDakMsNEJBQVksRUFBRTthQUNYLElBQUksQ0FBQzs7WUFDSixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLDJCQUFXLENBQUMsQ0FBQztZQUNyQyxJQUFBLGFBQUcsRUFBRSxlQUFJLEVBQUUsbUJBQU0sRUFBRSxtQkFBTSxFQUFFLHVCQUFRLENBQVM7WUFDcEQsSUFBSSxhQUFhLEdBQUcsR0FBRyxDQUFDLGFBQWEsSUFBSSxDQUFDLENBQUM7WUFFM0MsSUFBTSxlQUFlLGdCQUNoQixJQUFJLGVBQ04sMkJBQVcsSUFBRyxPQUFPLEVBQ3RCLFFBQUssR0FBRSxxQkFBSyxNQUNiLENBQUM7WUFDRixFQUFFLENBQUMsT0FBTyxDQUFDO2dCQUNULEdBQUcsS0FBQTtnQkFDSCxJQUFJLEVBQUUsZUFBZTtnQkFDckIsTUFBTSxRQUFBO2dCQUNOLE1BQU0sUUFBQTtnQkFDTixRQUFRLFVBQUE7Z0JBQ1IsT0FBTyxFQUFFLFVBQUMsR0FBUTtvQkFDaEIsSUFBSSxHQUFHLENBQUMsVUFBVSxLQUFLLEdBQUcsRUFBRTt3QkFDMUIsSUFBTSxNQUFJLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQzt3QkFFdEIsSUFDRSxnQ0FBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDL0MsYUFBYSxHQUFHLGVBQWUsRUFDL0I7NEJBQ0EsZUFBTyxFQUFFLENBQUMsSUFBSSxDQUFDO2dDQUNiLEdBQUcsQ0FBQyxhQUFhLEdBQUcsRUFBRSxhQUFhLENBQUM7Z0NBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUM7cUNBQ1QsSUFBSSxDQUFDLFVBQUEsR0FBRztvQ0FDUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0NBQ2YsQ0FBQyxDQUFDO3FDQUNELEtBQUssQ0FBQyxVQUFBLEdBQUc7b0NBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dDQUNkLENBQUMsQ0FBQyxDQUFDOzRCQUNQLENBQUMsQ0FBQyxDQUFDO3lCQUNKOzZCQUFNOzRCQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQzt5QkFDZDtxQkFDRjt5QkFBTTt3QkFDTCxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ2I7Z0JBQ0gsQ0FBQztnQkFDRCxJQUFJLEVBQUUsVUFBUyxHQUFHO29CQUNoQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxVQUFBLEdBQUc7WUFDUixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDZCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXJERCwwQkFxREMiLCJmaWxlIjoidXRpbHMvcmVxdWVzdC9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRvTG9naW4gfSBmcm9tIFwiLi9sb2dpblwiO1xuaW1wb3J0IHsgY2hlY2tTZXNzaW9uIH0gZnJvbSBcIi4vY2hlY2stc2Vzc2lvblwiO1xuaW1wb3J0IHtcbiAgU0VTU0lPTl9LRVksXG4gIEFQUElELFxuICBMT0dJTl9GQUlMX0NPREVTXG59IGZyb20gXCIuLi8uLi9jb25maWcvZ2xvYmFsLWNvbmZpZ1wiO1xuXG5jb25zdCBUUllfTE9HSU5fTElNSVQgPSAzO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVxdWVzdChvYmo6IGFueSA9IHt9KTogUHJvbWlzZTxvYmplY3Q+IHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjaGVja1Nlc3Npb24oKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICBsZXQgc2Vzc2lvbiA9IHd4LmdldFN0b3JhZ2VTeW5jKFNFU1NJT05fS0VZKTtcbiAgICAgICAgY29uc3QgeyB1cmwsIGRhdGEsIG1ldGhvZCwgaGVhZGVyLCBkYXRhVHlwZSB9ID0gb2JqO1xuICAgICAgICBsZXQgdHJ5TG9naW5Db3VudCA9IG9iai50cnlMb2dpbkNvdW50IHx8IDA7XG4gICAgICAgIC8vIOWmguaenOmcgOimgemAmui/hyBkYXRhIOaKiueZu+W9leaAgSBzZXNzaW9uSWQg5bim5LiKXG4gICAgICAgIGNvbnN0IGRhdGFXaXRoU2Vzc2lvbiA9IHtcbiAgICAgICAgICAuLi5kYXRhLFxuICAgICAgICAgIFtTRVNTSU9OX0tFWV06IHNlc3Npb24sXG4gICAgICAgICAgYXBwaWQ6IEFQUElEXG4gICAgICAgIH07XG4gICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgIHVybCxcbiAgICAgICAgICBkYXRhOiBkYXRhV2l0aFNlc3Npb24sXG4gICAgICAgICAgbWV0aG9kLFxuICAgICAgICAgIGhlYWRlcixcbiAgICAgICAgICBkYXRhVHlwZSxcbiAgICAgICAgICBzdWNjZXNzOiAocmVzOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGRhdGEgPSByZXMuZGF0YTtcbiAgICAgICAgICAgICAgLy8g55m76ZmG5oCB5aSx5pWI54m55a6a6ZSZ6K+v56CB5Yik5pat77yM5LiU6YeN6K+V5qyh5pWw5pyq6L6+5Yiw5LiK6ZmQXG4gICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBMT0dJTl9GQUlMX0NPREVTLmluZGV4T2YoZGF0YS5yZXR1cm5fY29kZSkgPiAtMSAmJlxuICAgICAgICAgICAgICAgIHRyeUxvZ2luQ291bnQgPCBUUllfTE9HSU5fTElNSVRcbiAgICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgZG9Mb2dpbigpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgb2JqLnRyeUxvZ2luQ291bnQgPSArK3RyeUxvZ2luQ291bnQ7XG4gICAgICAgICAgICAgICAgICByZXF1ZXN0KG9iailcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlcyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlamVjdChyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogZnVuY3Rpb24oZXJyKSB7XG4gICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChlcnIgPT4ge1xuICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==
