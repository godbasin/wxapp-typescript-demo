module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// watch 实现，参考https://github.com/jayZOU/watch

module.exports = Behavior({
  lifetimes: {
    created: function created() {
      this._originalSetData = this.setData;
      this.setData = this._setData;
      this._setDataTimes = 0;
    }
  },
  definitionFilter: function definitionFilter(defFields) {
    var watch = defFields.watch || {};
    var watchPaths = Object.keys(watch);
    var observers = new Map();

    // 触发key的对应回调
    function notify(key, newVal, oldVal) {
      if (!observers.has(key)) return;
      if (JSON.stringify(newVal) === JSON.stringify(oldVal)) return;
      if (this._setDataTimes > 5) {
        // eslint-disable-next-line no-console
        console.warn('max call setData in watch function!');
        this._setDataTimes = 0;
        return;
      }
      this._setDataTimes += 1;
      observers.get(key).call(this, newVal, oldVal);
    }

    function getPathArr(path) {
      var REG_KEY = /\[((?:\S+?))\]|\./g;
      return path.toString().split(REG_KEY).filter(function (item) {
        return !!item;
      });
    }

    // 根据路径获取对应 key 的 value
    function getKeyData(data, path) {
      var pathArr = getPathArr(path);
      return pathArr.reduce(function (res, currentPath) {
        var currentValueType = Object.prototype.toString.call(res);
        return (/String|Number|Boolean|Null|Undefined/.test(currentValueType) ? undefined : res[currentPath]
        );
      }, data);
    }

    // 更新值并触发回调 并更新视图
    function checkAndNotify(obj, originData) {
      var _this = this;

      var oldData = JSON.parse(JSON.stringify(originData));
      Object.keys(obj).forEach(function (path) {
        if (observers.has(path)) {
          notify.call(_this, path, obj[path], getKeyData(oldData, path));
        }
      });
    }

    // 初始化 watch
    var initWatch = function initWatch() {
      defFields.data = defFields.data || {};

      // 先将 properties 里的字段写入到 data 中
      var data = defFields.data;
      var properties = defFields.properties;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      if (properties) {
        // eslint-disable-next-line complexity
        Object.keys(properties).forEach(function (key) {
          var value = properties[key];
          var oldObserver = void 0;
          if (value === null || value === Number || value === String || value === Boolean || value === Object || value === Array) {
            properties[key] = {
              type: value
            };
          } else if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
            if (hasOwnProperty.call(value, 'value')) {
              // 处理值
              data[key] = value.value;
            }

            // 若 properties 原有 observer，记录下来
            if (hasOwnProperty.call(value, 'observer') && typeof value.observer === 'function') {
              oldObserver = value.observer;
            }
          }

          // 追加 observer，用于监听变动
          properties[key].observer = function () {
            var originalSetData = this._originalSetData;

            this._setDataTimes = 0;

            // 做 watch

            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            notify.call.apply(notify, [this, key].concat(args));

            // 做 watch 属性的 setData
            originalSetData.call.apply(originalSetData, [this].concat(args));

            if (oldObserver) oldObserver.apply(this, args);
          };
        });
      }
      // check if data.path exist
      function isDataExist(path) {
        return getKeyData(defFields.data, path) !== undefined;
      }

      // 将 watch 数据写入观察者队列
      watchPaths.forEach(function (path) {
        if (isDataExist(path)) {
          observers.set(path, watch[path]);
        }
      });
    };

    initWatch();

    defFields.methods = defFields.methods || {};
    defFields.methods._setData = function (data, callback) {
      var originalSetData = this._originalSetData;

      this._setDataTimes = 0;

      // 做 watch
      checkAndNotify.call(this, data, this.data);

      // 做 data 属性的 setData
      originalSetData.call(this, data, callback);
    };
  }
});

/***/ })
/******/ ]);