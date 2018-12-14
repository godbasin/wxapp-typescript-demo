"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cgi_config_1 = require("../config/cgi-config");
var global_config_1 = require("../config/global-config");
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
                            js_code: res.code
                        };
                        wx.request({
                            url: cgi_config_1.API.login,
                            data: reqData,
                            header: { "content-type": "application/x-www-form-urlencoded" },
                            method: "POST",
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaS9sb2dpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1EQUEyQztBQUMzQyx5REFBc0Q7QUFldEQsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBRXZCLFNBQWdCLE9BQU87SUFDckIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1FBQ2pDLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxjQUFjLENBQUMsMkJBQVcsQ0FBQyxDQUFDO1FBQy9DLElBQUksT0FBTyxFQUFFO1lBRVgsT0FBTyxFQUFFLENBQUM7U0FDWDthQUFNLElBQUksVUFBVSxFQUFFO1lBRXJCLFVBQVUsQ0FBQztnQkFDVCxPQUFPLEVBQUU7cUJBQ04sSUFBSSxDQUFDLFVBQUEsR0FBRztvQkFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2YsQ0FBQyxDQUFDO3FCQUNELEtBQUssQ0FBQyxVQUFBLEdBQUc7b0JBQ1IsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNkLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ1Q7YUFBTTtZQUNMLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDbEIsRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDUCxPQUFPLEVBQUUsVUFBQSxHQUFHO29CQUNWLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTt3QkFDWixJQUFNLE9BQU8sR0FBa0I7NEJBQzdCLE9BQU8sRUFBRSxHQUFHLENBQUMsSUFBSTt5QkFDbEIsQ0FBQzt3QkFDRixFQUFFLENBQUMsT0FBTyxDQUFDOzRCQUNULEdBQUcsRUFBRSxnQkFBRyxDQUFDLEtBQUs7NEJBQ2QsSUFBSSxFQUFFLE9BQU87NEJBQ2IsTUFBTSxFQUFFLEVBQUUsY0FBYyxFQUFFLG1DQUFtQyxFQUFFOzRCQUMvRCxNQUFNLEVBQUUsTUFBTTs0QkFDZCxPQUFPLEVBQUUsVUFBQyxJQUFTO2dDQUNqQixJQUFNLElBQUksR0FBbUIsSUFBSSxDQUFDLElBQUksQ0FBQztnQ0FDdkMsVUFBVSxHQUFHLEtBQUssQ0FBQztnQ0FFbkIsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLENBQUMsRUFBRTtvQ0FDMUIsRUFBRSxDQUFDLGNBQWMsQ0FBQywyQkFBVyxFQUFHLElBQVksQ0FBQywyQkFBVyxDQUFDLENBQUMsQ0FBQztvQ0FDM0QsT0FBTyxFQUFFLENBQUM7aUNBQ1g7cUNBQU07b0NBQ0wsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDO29DQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2lDQUN6Qjs0QkFDSCxDQUFDOzRCQUNELElBQUksRUFBRSxVQUFBLEdBQUc7Z0NBRVAsVUFBVSxHQUFHLEtBQUssQ0FBQztnQ0FDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDOzRCQUNkLENBQUM7eUJBQ0YsQ0FBQyxDQUFDO3FCQUNKO3lCQUFNO3dCQUVMLFVBQVUsR0FBRyxLQUFLLENBQUM7d0JBQ25CLE1BQU0sRUFBRSxDQUFDO3FCQUNWO2dCQUNILENBQUM7Z0JBQ0QsSUFBSSxFQUFFLFVBQUEsR0FBRztvQkFFUCxVQUFVLEdBQUcsS0FBSyxDQUFDO29CQUNuQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2QsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBOURELDBCQThEQyIsImZpbGUiOiJhcGkvbG9naW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyDnmbvlvZXmjqXlj6PljY/orq5cclxuaW1wb3J0IHsgQVBJIH0gZnJvbSBcIi4uL2NvbmZpZy9jZ2ktY29uZmlnXCI7XHJcbmltcG9ydCB7IFNFU1NJT05fS0VZIH0gZnJvbSBcIi4uL2NvbmZpZy9nbG9iYWwtY29uZmlnXCI7XHJcblxyXG5pbnRlcmZhY2UgSUxvZ2luUmVxdWVzdCB7XHJcbiAgYXBwaWQ/OiBzdHJpbmc7XHJcbiAganNfY29kZTogc3RyaW5nO1xyXG4gIHNrZXk/OiBzdHJpbmc7XHJcbn1cclxuXHJcbmludGVyZmFjZSBJTG9naW5SZXNwb25zZSB7XHJcbiAgcmV0dXJuX2NvZGU6IG51bWJlcjtcclxuICByZXR1cm5fbXNnOiBzdHJpbmc7XHJcbiAgc2tleTogc3RyaW5nO1xyXG4gIHJldHVybl9lcnJfdHlwZTogc3RyaW5nO1xyXG59XHJcblxyXG5sZXQgaXNMb2dpbmluZyA9IGZhbHNlO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRvTG9naW4oKTogUHJvbWlzZTxzdHJpbmc+IHtcclxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgY29uc3Qgc2Vzc2lvbiA9IHd4LmdldFN0b3JhZ2VTeW5jKFNFU1NJT05fS0VZKTtcclxuICAgIGlmIChzZXNzaW9uKSB7XHJcbiAgICAgIC8vIOe8k+WtmOS4reaciSBzZXNzaW9uXHJcbiAgICAgIHJlc29sdmUoKTtcclxuICAgIH0gZWxzZSBpZiAoaXNMb2dpbmluZykge1xyXG4gICAgICAvLyDmraPlnKjnmbvlvZXkuK3vvIzor7fmsYLova7or6LnqI3lkI7vvIzpgb/lhY3ph43lpI3osIPnlKjnmbvlvZXmjqXlj6NcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgZG9Mb2dpbigpXHJcbiAgICAgICAgICAudGhlbihyZXMgPT4ge1xyXG4gICAgICAgICAgICByZXNvbHZlKHJlcyk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIHJlamVjdChlcnIpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgIH0sIDUwMCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpc0xvZ2luaW5nID0gdHJ1ZTtcclxuICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICBpZiAocmVzLmNvZGUpIHtcclxuICAgICAgICAgICAgY29uc3QgcmVxRGF0YTogSUxvZ2luUmVxdWVzdCA9IHtcclxuICAgICAgICAgICAgICBqc19jb2RlOiByZXMuY29kZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICB1cmw6IEFQSS5sb2dpbixcclxuICAgICAgICAgICAgICBkYXRhOiByZXFEYXRhLFxyXG4gICAgICAgICAgICAgIGhlYWRlcjogeyBcImNvbnRlbnQtdHlwZVwiOiBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiIH0sXHJcbiAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVzcDogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkYXRhOiBJTG9naW5SZXNwb25zZSA9IHJlc3AuZGF0YTtcclxuICAgICAgICAgICAgICAgIGlzTG9naW5pbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIC8vIOS/neWtmOeZu+W9leaAgVxyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEucmV0dXJuX2NvZGUgPT09IDApIHtcclxuICAgICAgICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoU0VTU0lPTl9LRVksIChkYXRhIGFzIGFueSlbU0VTU0lPTl9LRVldKTtcclxuICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHsgdGl0bGU6IGRhdGEucmV0dXJuX21zZywgaWNvbjogXCJub25lXCIgfSk7XHJcbiAgICAgICAgICAgICAgICAgIHJlamVjdChkYXRhLnJldHVybl9tc2cpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgZmFpbDogZXJyID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxyXG4gICAgICAgICAgICAgICAgaXNMb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxyXG4gICAgICAgICAgICBpc0xvZ2luaW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHJlamVjdCgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZmFpbDogZXJyID0+IHtcclxuICAgICAgICAgIC8vIOeZu+W9leWksei0pe+8jOino+mZpOmUge+8jOmYsuatouatu+mUgVxyXG4gICAgICAgICAgaXNMb2dpbmluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KTtcclxufVxyXG4iXX0=
