System.register([], (function (exports) {
  'use strict';
  return {
    execute: (function () {

      const noop = () => void 0;
      var logger = exports('logger', new Proxy(console, {
        get: function(target, propKey, receiver) {
          if (window.__verbose_log__) {
            return Reflect.get(target, propKey, receiver);
          }
          if (propKey === "warn" || propKey === "log" || propKey === "debug") {
            return noop;
          }
          return Reflect.get(target, propKey, receiver);
        }
      }));

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dnZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBfX3ZlcmJvc2VfbG9nX186IGJvb2xlYW47XG4gIH1cbn1cblxuY29uc3Qgbm9vcCA9ICgpOiB2b2lkID0+IHVuZGVmaW5lZDtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IFByb3h5KGNvbnNvbGUsIHtcbiAgZ2V0OiBmdW5jdGlvbih0YXJnZXQsIHByb3BLZXksIHJlY2VpdmVyKTogYW55IHtcbiAgICBpZiAod2luZG93Ll9fdmVyYm9zZV9sb2dfXykge1xuICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcEtleSwgcmVjZWl2ZXIpO1xuICAgIH1cblxuICAgIGlmIChwcm9wS2V5ID09PSAnd2FybicgfHwgcHJvcEtleSA9PT0gJ2xvZycgfHwgcHJvcEtleSA9PT0gJ2RlYnVnJykge1xuICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuXG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0KHRhcmdldCwgcHJvcEtleSwgcmVjZWl2ZXIpO1xuICB9LFxufSk7XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7TUFBQSxNQUFNLElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQzFCLHFDQUFlLElBQUksS0FBSyxDQUFDLE9BQU8sRUFBRTtNQUNsQyxFQUFFLEdBQUcsRUFBRSxTQUFTLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFO01BQzNDLElBQUksSUFBSSxNQUFNLENBQUMsZUFBZSxFQUFFO01BQ2hDLE1BQU0sT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDcEQsS0FBSztNQUNMLElBQUksSUFBSSxPQUFPLEtBQUssTUFBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksT0FBTyxLQUFLLE9BQU8sRUFBRTtNQUN4RSxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQ2xELEdBQUc7TUFDSCxDQUFDLEVBQUM7Ozs7Ozs7OyJ9
