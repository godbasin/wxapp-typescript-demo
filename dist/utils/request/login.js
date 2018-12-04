"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cgi_config_1 = require("../../config/cgi-config");
var global_config_1 = require("../../config/global-config");
var isLogining = false;
function doLogin() {
    return new Promise(function (resolve, reject) {
        var session = wx.getStorageSync(global_config_1.SESSION_KEY);
        if (session) {
            resolve();
        }
        else if (isLogining) {
            setTimeout(function () {
                doLogin()
                    .then(function (res) {
                    resolve(res);
                })
                    .catch(function (err) {
                    reject(err);
                });
            }, 500);
        }
        else {
            isLogining = true;
            wx.login({
                success: function (res) {
                    if (res.code) {
                        var reqData = {
                            code: res.code
                        };
                        wx.request({
                            url: cgi_config_1.API.login,
                            data: reqData,
                            success: function (resp) {
                                var data = resp.data;
                                isLogining = false;
                                if (data.return_code === 0) {
                                    wx.setStorageSync(global_config_1.SESSION_KEY, data[global_config_1.SESSION_KEY]);
                                    resolve();
                                }
                                else {
                                    wx.showToast({ title: data.return_msg, icon: "none" });
                                    reject(data.return_msg);
                                }
                            },
                            fail: function (err) {
                                isLogining = false;
                                reject(err);
                            }
                        });
                    }
                    else {
                        isLogining = false;
                        reject();
                    }
                },
                fail: function (err) {
                    isLogining = false;
                    reject(err);
                }
            });
        }
    });
}
exports.doLogin = doLogin;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL3JlcXVlc3QvbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxzREFBOEM7QUFDOUMsNERBQXlEO0FBRXpELElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztBQUV2QixTQUFnQixPQUFPO0lBQ3JCLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtRQUNqQyxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsY0FBYyxDQUFDLDJCQUFXLENBQUMsQ0FBQztRQUMvQyxJQUFJLE9BQU8sRUFBRTtZQUVYLE9BQU8sRUFBRSxDQUFDO1NBQ1g7YUFBTSxJQUFJLFVBQVUsRUFBRTtZQUVyQixVQUFVLENBQUM7Z0JBQ1QsT0FBTyxFQUFFO3FCQUNOLElBQUksQ0FBQyxVQUFBLEdBQUc7b0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNmLENBQUMsQ0FBQztxQkFDRCxLQUFLLENBQUMsVUFBQSxHQUFHO29CQUNSLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZCxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUNUO2FBQU07WUFDTCxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLEVBQUUsQ0FBQyxLQUFLLENBQUM7Z0JBQ1AsT0FBTyxFQUFFLFVBQUEsR0FBRztvQkFDVixJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUU7d0JBQ1osSUFBTSxPQUFPLEdBQUc7NEJBQ2QsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO3lCQUNmLENBQUM7d0JBQ0YsRUFBRSxDQUFDLE9BQU8sQ0FBQzs0QkFDVCxHQUFHLEVBQUUsZ0JBQUcsQ0FBQyxLQUFLOzRCQUNkLElBQUksRUFBRSxPQUFPOzRCQUViLE9BQU8sRUFBRSxVQUFDLElBQVM7Z0NBQ2pCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7Z0NBQ3ZCLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0NBRW5CLElBQUksSUFBSSxDQUFDLFdBQVcsS0FBSyxDQUFDLEVBQUU7b0NBQzFCLEVBQUUsQ0FBQyxjQUFjLENBQUMsMkJBQVcsRUFBRSxJQUFJLENBQUMsMkJBQVcsQ0FBQyxDQUFDLENBQUM7b0NBQ2xELE9BQU8sRUFBRSxDQUFDO2lDQUNYO3FDQUFNO29DQUNMLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztvQ0FDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztpQ0FDekI7NEJBQ0gsQ0FBQzs0QkFDRCxJQUFJLEVBQUUsVUFBQSxHQUFHO2dDQUVQLFVBQVUsR0FBRyxLQUFLLENBQUM7Z0NBQ25CLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDZCxDQUFDO3lCQUNGLENBQUMsQ0FBQztxQkFDSjt5QkFBTTt3QkFFTCxVQUFVLEdBQUcsS0FBSyxDQUFDO3dCQUNuQixNQUFNLEVBQUUsQ0FBQztxQkFDVjtnQkFDSCxDQUFDO2dCQUNELElBQUksRUFBRSxVQUFBLEdBQUc7b0JBRVAsVUFBVSxHQUFHLEtBQUssQ0FBQztvQkFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTdERCwwQkE2REMiLCJmaWxlIjoidXRpbHMvcmVxdWVzdC9sb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIOeZu+W9leaOpeWPo+WNj+iurlxyXG5pbXBvcnQgeyBBUEkgfSBmcm9tIFwiLi4vLi4vY29uZmlnL2NnaS1jb25maWdcIjtcclxuaW1wb3J0IHsgU0VTU0lPTl9LRVkgfSBmcm9tIFwiLi4vLi4vY29uZmlnL2dsb2JhbC1jb25maWdcIjtcclxuXHJcbmxldCBpc0xvZ2luaW5nID0gZmFsc2U7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZG9Mb2dpbigpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBjb25zdCBzZXNzaW9uID0gd3guZ2V0U3RvcmFnZVN5bmMoU0VTU0lPTl9LRVkpO1xyXG4gICAgaWYgKHNlc3Npb24pIHtcclxuICAgICAgLy8g57yT5a2Y5Lit5pyJIHNlc3Npb25cclxuICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgfSBlbHNlIGlmIChpc0xvZ2luaW5nKSB7XHJcbiAgICAgIC8vIOato+WcqOeZu+W9leS4re+8jOivt+axgui9ruivoueojeWQju+8jOmBv+WFjemHjeWkjeiwg+eUqOeZu+W9leaOpeWPo1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBkb0xvZ2luKClcclxuICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgIHJlc29sdmUocmVzKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSwgNTAwKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlzTG9naW5pbmcgPSB0cnVlO1xyXG4gICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgIGlmIChyZXMuY29kZSkge1xyXG4gICAgICAgICAgICBjb25zdCByZXFEYXRhID0ge1xyXG4gICAgICAgICAgICAgIGNvZGU6IHJlcy5jb2RlXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgIHVybDogQVBJLmxvZ2luLFxyXG4gICAgICAgICAgICAgIGRhdGE6IHJlcURhdGEsXHJcbiAgICAgICAgICAgICAgLy8gbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVzcDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhID0gcmVzcC5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaXNMb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgLy8g5L+d5a2Y55m75b2V5oCBXHJcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5yZXR1cm5fY29kZSA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyhTRVNTSU9OX0tFWSwgZGF0YVtTRVNTSU9OX0tFWV0pO1xyXG4gICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICB3eC5zaG93VG9hc3QoeyB0aXRsZTogZGF0YS5yZXR1cm5fbXNnLCBpY29uOiBcIm5vbmVcIiB9KTtcclxuICAgICAgICAgICAgICAgICAgcmVqZWN0KGRhdGEucmV0dXJuX21zZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICBmYWlsOiBlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXHJcbiAgICAgICAgICAgICAgICBpc0xvZ2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXHJcbiAgICAgICAgICAgIGlzTG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgcmVqZWN0KCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBmYWlsOiBlcnIgPT4ge1xyXG4gICAgICAgICAgLy8g55m75b2V5aSx6LSl77yM6Kej6Zmk6ZSB77yM6Ziy5q2i5q276ZSBXHJcbiAgICAgICAgICBpc0xvZ2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59XHJcbiJdfQ==
