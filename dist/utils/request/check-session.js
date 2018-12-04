"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var login_1 = require("./login");
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
                        key: "skey",
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInV0aWxzL3JlcXVlc3QvY2hlY2stc2Vzc2lvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlDQUFrQztBQUNsQyw0REFBeUQ7QUFFekQsSUFBSSxpQkFBaUIsR0FBRyxLQUFLLENBQUM7QUFDOUIsSUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDO0FBRTNCLFNBQWdCLFlBQVk7SUFDMUIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2pDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsMkJBQVcsQ0FBQyxDQUFDO1FBQy9DLElBQUksaUJBQWlCLEVBQUU7WUFDckIsVUFBVSxDQUFDO2dCQUNULFlBQVksRUFBRTtxQkFDWCxJQUFJLENBQUMsVUFBQSxHQUFHO29CQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUM7cUJBQ0QsS0FBSyxDQUFDLFVBQUEsR0FBRztvQkFDUixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7U0FDVDthQUFNLElBQUksQ0FBQyxjQUFjLElBQUksT0FBTyxFQUFFO1lBQ3JDLGlCQUFpQixHQUFHLElBQUksQ0FBQztZQUN6QixFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUNkLE9BQU8sRUFBRTtvQkFFUCxjQUFjLEdBQUcsSUFBSSxDQUFDO29CQUN0QixPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDO2dCQUNELElBQUksRUFBRTtvQkFFSixFQUFFLENBQUMsYUFBYSxDQUFDO3dCQUNmLEdBQUcsRUFBRSxNQUFNO3dCQUNYLFFBQVEsRUFBRTs0QkFDUixlQUFPLEVBQUU7aUNBQ04sSUFBSSxDQUFDO2dDQUNKLE9BQU8sRUFBRSxDQUFDOzRCQUNaLENBQUMsQ0FBQztpQ0FDRCxLQUFLLENBQUMsVUFBQSxHQUFHO2dDQUNSLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQzs0QkFDZCxDQUFDLENBQUMsQ0FBQzt3QkFDUCxDQUFDO3FCQUNGLENBQUMsQ0FBQztnQkFDTCxDQUFDO2dCQUNELFFBQVEsRUFBRTtvQkFDUixpQkFBaUIsR0FBRyxLQUFLLENBQUM7Z0JBQzVCLENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsZUFBTyxFQUFFO2lCQUNOLElBQUksQ0FBQyxVQUFBLEdBQUc7Z0JBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2YsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxVQUFBLEdBQUc7Z0JBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2QsQ0FBQyxDQUFDLENBQUM7U0FDTjtJQUNILENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQWxERCxvQ0FrREMiLCJmaWxlIjoidXRpbHMvcmVxdWVzdC9jaGVjay1zZXNzaW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZG9Mb2dpbiB9IGZyb20gXCIuL2xvZ2luXCI7XHJcbmltcG9ydCB7IFNFU1NJT05fS0VZIH0gZnJvbSBcIi4uLy4uL2NvbmZpZy9nbG9iYWwtY29uZmlnXCI7XHJcblxyXG5sZXQgaXNDaGVja2luZ1Nlc3Npb24gPSBmYWxzZTtcclxubGV0IGlzU2Vzc2lvbkZyZXNoID0gZmFsc2U7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gY2hlY2tTZXNzaW9uKCk6IFByb21pc2U8c3RyaW5nPiB7XHJcbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgIGNvbnN0IHNlc3Npb24gPSB3eC5nZXRTdG9yYWdlU3luYyhTRVNTSU9OX0tFWSk7XHJcbiAgICBpZiAoaXNDaGVja2luZ1Nlc3Npb24pIHtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgY2hlY2tTZXNzaW9uKClcclxuICAgICAgICAgIC50aGVuKHJlcyA9PiB7XHJcbiAgICAgICAgICAgIHJlc29sdmUocmVzKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgfSwgNTAwKTtcclxuICAgIH0gZWxzZSBpZiAoIWlzU2Vzc2lvbkZyZXNoICYmIHNlc3Npb24pIHtcclxuICAgICAgaXNDaGVja2luZ1Nlc3Npb24gPSB0cnVlO1xyXG4gICAgICB3eC5jaGVja1Nlc3Npb24oe1xyXG4gICAgICAgIHN1Y2Nlc3M6ICgpID0+IHtcclxuICAgICAgICAgIC8vIHNlc3Npb25fa2V5IOacqui/h+acn++8jOW5tuS4lOWcqOacrOeUn+WRveWRqOacn+S4gOebtOacieaViFxyXG4gICAgICAgICAgaXNTZXNzaW9uRnJlc2ggPSB0cnVlO1xyXG4gICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogKCkgPT4ge1xyXG4gICAgICAgICAgLy8gc2Vzc2lvbl9rZXkg5bey57uP5aSx5pWI77yM6ZyA6KaB6YeN5paw5omn6KGM55m75b2V5rWB56iLXHJcbiAgICAgICAgICB3eC5yZW1vdmVTdG9yYWdlKHtcclxuICAgICAgICAgICAga2V5OiBcInNrZXlcIixcclxuICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICBkb0xvZ2luKClcclxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICBpc0NoZWNraW5nU2Vzc2lvbiA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkb0xvZ2luKClcclxuICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgcmVzb2x2ZShyZXMpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG4iXX0=
