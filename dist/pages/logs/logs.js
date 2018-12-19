"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../utils/util");
var computedBehavior = require("miniprogram-computed");
Component({
    behaviors: [computedBehavior],
    data: {
        logs: []
    },
    computed: {
        logsAfterComputed: function () {
            return this.data.logs.map(function (x) {
                return {
                    log: x,
                    logAfterCompute: x + "logAfterCompute"
                };
            });
        }
    },
    methods: {
        onLoad: function () {
            console.log("onLoad");
            this.setData({
                logs: (wx.getStorageSync("logs") || []).map(function (log) {
                    return util_1.formatTime(new Date(log));
                })
            });
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzL2xvZ3MvbG9ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlDQUE4QztBQUM5QyxJQUFNLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBRXpELFNBQVMsQ0FBQztJQUNSLFNBQVMsRUFBRSxDQUFDLGdCQUFnQixDQUFDO0lBQzdCLElBQUksRUFBRTtRQUNKLElBQUksRUFBRSxFQUFjO0tBQ3JCO0lBQ0QsUUFBUSxFQUFFO1FBQ1IsaUJBQWlCO1lBR2YsT0FBUSxJQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFTO2dCQUM1QyxPQUFPO29CQUNMLEdBQUcsRUFBRSxDQUFDO29CQUNOLGVBQWUsRUFBRSxDQUFDLEdBQUcsaUJBQWlCO2lCQUN2QyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7SUFDRCxPQUFPLEVBQUU7UUFDUCxNQUFNO1lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUNyQixJQUFhLENBQUMsT0FBTyxDQUFDO2dCQUNyQixJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQVc7b0JBQ3RELE9BQU8saUJBQVUsQ0FBQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNuQyxDQUFDLENBQUM7YUFDSCxDQUFDLENBQUM7UUFDTCxDQUFDO0tBQ0Y7Q0FDRixDQUFDLENBQUMiLCJmaWxlIjoicGFnZXMvbG9ncy9sb2dzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy9sb2dzLmpzXHJcbmltcG9ydCB7IGZvcm1hdFRpbWUgfSBmcm9tIFwiLi4vLi4vdXRpbHMvdXRpbFwiO1xyXG5jb25zdCBjb21wdXRlZEJlaGF2aW9yID0gcmVxdWlyZShcIm1pbmlwcm9ncmFtLWNvbXB1dGVkXCIpO1xyXG5cclxuQ29tcG9uZW50KHtcclxuICBiZWhhdmlvcnM6IFtjb21wdXRlZEJlaGF2aW9yXSxcclxuICBkYXRhOiB7XHJcbiAgICBsb2dzOiBbXSBhcyBzdHJpbmdbXVxyXG4gIH0sXHJcbiAgY29tcHV0ZWQ6IHtcclxuICAgIGxvZ3NBZnRlckNvbXB1dGVkKCkge1xyXG4gICAgICAvLyDorqHnrpflsZ7mgKflkIzmoLfmjILlnKggZGF0YSDkuIrvvIzmr4/lvZPov5vooYwgc2V0RGF0YSDnmoTml7blgJnkvJrph43mlrDorqHnrpdcclxuICAgICAgLy8g5q+U5aaC5q2k5a2X5q615Y+v5Lul6YCa6L+HIHRoaXMuZGF0YS5iIOiOt+WPluWIsFxyXG4gICAgICByZXR1cm4gKHRoaXMgYXMgVE9ETykuZGF0YS5sb2dzLm1hcCgoeDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGxvZzogeCxcclxuICAgICAgICAgIGxvZ0FmdGVyQ29tcHV0ZTogeCArIFwibG9nQWZ0ZXJDb21wdXRlXCJcclxuICAgICAgICB9O1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG1ldGhvZHM6IHtcclxuICAgIG9uTG9hZCgpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJvbkxvYWRcIik7XHJcbiAgICAgICh0aGlzIGFzIFRPRE8pLnNldERhdGEoe1xyXG4gICAgICAgIGxvZ3M6ICh3eC5nZXRTdG9yYWdlU3luYyhcImxvZ3NcIikgfHwgW10pLm1hcCgobG9nOiBudW1iZXIpID0+IHtcclxuICAgICAgICAgIHJldHVybiBmb3JtYXRUaW1lKG5ldyBEYXRlKGxvZykpO1xyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufSk7XHJcbiJdfQ==
