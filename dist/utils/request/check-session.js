"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_1 = require("../../api/login");
var global_config_1 = require("../../config/global-config");
var isCheckingSession = false;
var isSessionFresh = false;
function checkSession() {
    return new Promise(function (resolve, reject) {
        var session = wx.getStorageSync(global_config_1.SESSION_KEY);
        if (isCheckingSession) {
            setTimeout(function () {
                checkSession()
                    .then(function (res) {
                    resolve(res);
                })
                    .catch(function (err) {
                    reject(err);
                });
            }, 500);
        }
        else if (!isSessionFresh && session) {
            isCheckingSession = true;
            wx.checkSession({
                success: function () {
                    isSessionFresh = true;
                    resolve();
                },
                fail: function () {
                    wx.removeStorage({
                        key: global_config_1.SESSION_KEY,
                        complete: function () {
                            login_1.doLogin()
                                .then(function () {
                                resolve();
                            })
                                .catch(function (err) {
                                reject(err);
                            });
                        }
                    });
                },
                complete: function () {
                    isCheckingSession = false;
                }
            });
        }
        else {
            login_1.doLogin()
                .then(function (res) {
                resolve(res);
            })
                .catch(function (err) {
                reject(err);
            });
        }
    });
}
exports.checkSession = checkSession;

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL3JlcXVlc3QvY2hlY2stc2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHlDQUEwQztBQUMxQyw0REFBeUQ7QUFFekQsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDOUIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBRTNCLFNBQWdCLFlBQVk7SUFDMUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2pDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsMkJBQVcsQ0FBQyxDQUFDO1FBQy9DLElBQUksaUJBQWlCLEVBQUU7WUFDckIsVUFBVSxDQUFDO2dCQUNULFlBQVksRUFBRTtxQkFDWCxJQUFJLENBQUMsVUFBQSxHQUFHO29CQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztvQkFDUixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDVDthQUFNLElBQUksQ0FBQyxjQUFjLElBQUksT0FBTyxFQUFFO1lBQ3JDLGlCQUFpQixHQUFHLElBQUksQ0FBQztZQUN6QixFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUNkLE9BQU8sRUFBRTtvQkFFUCxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUN0QixPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDO2dCQUNELElBQUksRUFBRTtvQkFFSixFQUFFLENBQUMsYUFBYSxDQUFDO3dCQUNmLEdBQUcsRUFBRSwyQkFBVzt3QkFDaEIsUUFBUSxFQUFFOzRCQUNSLGVBQU8sRUFBRTtpQ0FDTixJQUFJLENBQUM7Z0NBQ0osT0FBTyxFQUFFLENBQUM7NEJBQ1osQ0FBQyxDQUFDO2lDQUNELEtBQUssQ0FBQyxVQUFBLEdBQUc7Z0NBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNkLENBQUMsQ0FBQyxDQUFDO3dCQUNQLENBQUM7cUJBQ0YsQ0FBQyxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsUUFBUSxFQUFFO29CQUNSLGlCQUFpQixHQUFHLEtBQUssQ0FBQztnQkFDNUIsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxlQUFPLEVBQUU7aUJBQ04sSUFBSSxDQUFDLFVBQUEsR0FBRztnQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztnQkFDUixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDZCxDQUFDLENBQUMsQ0FBQztTQUNOO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBbERELG9DQWtEQyIsImZpbGUiOiJ1dGlscy9yZXF1ZXN0L2NoZWNrLXNlc3Npb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkb0xvZ2luIH0gZnJvbSBcIi4uLy4uL2FwaS9sb2dpblwiO1xyXG5pbXBvcnQgeyBTRVNTSU9OX0tFWSB9IGZyb20gXCIuLi8uLi9jb25maWcvZ2xvYmFsLWNvbmZpZ1wiO1xyXG5cclxubGV0IGlzQ2hlY2tpbmdTZXNzaW9uID0gZmFsc2U7XHJcbmxldCBpc1Nlc3Npb25GcmVzaCA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrU2Vzc2lvbigpOiBQcm9taXNlPHN0cmluZz4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICBjb25zdCBzZXNzaW9uID0gd3guZ2V0U3RvcmFnZVN5bmMoU0VTU0lPTl9LRVkpO1xyXG4gICAgaWYgKGlzQ2hlY2tpbmdTZXNzaW9uKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNoZWNrU2Vzc2lvbigpXHJcbiAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICByZXNvbHZlKHJlcyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sIDUwMCk7XHJcbiAgICB9IGVsc2UgaWYgKCFpc1Nlc3Npb25GcmVzaCAmJiBzZXNzaW9uKSB7XHJcbiAgICAgIGlzQ2hlY2tpbmdTZXNzaW9uID0gdHJ1ZTtcclxuICAgICAgd3guY2hlY2tTZXNzaW9uKHtcclxuICAgICAgICBzdWNjZXNzOiAoKSA9PiB7XHJcbiAgICAgICAgICAvLyBzZXNzaW9uX2tleSDmnKrov4fmnJ/vvIzlubbkuJTlnKjmnKznlJ/lkb3lkajmnJ/kuIDnm7TmnInmlYhcclxuICAgICAgICAgIGlzU2Vzc2lvbkZyZXNoID0gdHJ1ZTtcclxuICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGZhaWw6ICgpID0+IHtcclxuICAgICAgICAgIC8vIHNlc3Npb25fa2V5IOW3sue7j+WkseaViO+8jOmcgOimgemHjeaWsOaJp+ihjOeZu+W9lea1geeoi1xyXG4gICAgICAgICAgd3gucmVtb3ZlU3RvcmFnZSh7XHJcbiAgICAgICAgICAgIGtleTogU0VTU0lPTl9LRVksXHJcbiAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgZG9Mb2dpbigpXHJcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgaXNDaGVja2luZ1Nlc3Npb24gPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZG9Mb2dpbigpXHJcbiAgICAgICAgLnRoZW4ocmVzID0+IHtcclxuICAgICAgICAgIHJlc29sdmUocmVzKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn1cclxuIl19
