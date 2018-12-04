"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("../../utils/util");
Page({
    data: {
        logs: []
    },
    onLoad: function () {
        this.setData({
            logs: (wx.getStorageSync('logs') || []).map(function (log) {
                return util_1.formatTime(new Date(log));
            })
        });
    },
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInBhZ2VzL2xvZ3MvbG9ncy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHlDQUE2QztBQUU3QyxJQUFJLENBQUM7SUFDSCxJQUFJLEVBQUU7UUFDSixJQUFJLEVBQUUsRUFBYztLQUNyQjtJQUNELE1BQU07UUFDSixJQUFJLENBQUMsT0FBUSxDQUFDO1lBQ1osSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFXO2dCQUN0RCxPQUFPLGlCQUFVLENBQUMsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQTtZQUNsQyxDQUFDLENBQUM7U0FDSCxDQUFDLENBQUE7SUFDSixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwiZmlsZSI6InBhZ2VzL2xvZ3MvbG9ncy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vbG9ncy5qc1xyXG5pbXBvcnQgeyBmb3JtYXRUaW1lIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbCdcclxuXHJcblBhZ2Uoe1xyXG4gIGRhdGE6IHtcclxuICAgIGxvZ3M6IFtdIGFzIHN0cmluZ1tdXHJcbiAgfSxcclxuICBvbkxvYWQoKSB7XHJcbiAgICB0aGlzLnNldERhdGEhKHtcclxuICAgICAgbG9nczogKHd4LmdldFN0b3JhZ2VTeW5jKCdsb2dzJykgfHwgW10pLm1hcCgobG9nOiBudW1iZXIpID0+IHtcclxuICAgICAgICByZXR1cm4gZm9ybWF0VGltZShuZXcgRGF0ZShsb2cpKVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9LFxyXG59KVxyXG4iXX0=
