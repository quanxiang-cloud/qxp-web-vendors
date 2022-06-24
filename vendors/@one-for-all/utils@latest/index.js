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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9sb2dnZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZGVjbGFyZSBnbG9iYWwge1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBfX3ZlcmJvc2VfbG9nX186IGJvb2xlYW47XG4gIH1cbn1cblxuY29uc3Qgbm9vcCA9ICgpOiB2b2lkID0+IHVuZGVmaW5lZDtcblxuZXhwb3J0IGRlZmF1bHQgbmV3IFByb3h5KGNvbnNvbGUsIHtcbiAgZ2V0OiBmdW5jdGlvbiAodGFyZ2V0LCBwcm9wS2V5LCByZWNlaXZlcik6IGFueSB7XG4gICAgaWYgKHdpbmRvdy5fX3ZlcmJvc2VfbG9nX18pIHtcbiAgICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BLZXksIHJlY2VpdmVyKTtcbiAgICB9XG5cbiAgICBpZiAocHJvcEtleSA9PT0gJ3dhcm4nIHx8IHByb3BLZXkgPT09ICdsb2cnIHx8IHByb3BLZXkgPT09ICdkZWJ1ZycpIHtcbiAgICAgIHJldHVybiBub29wO1xuICAgIH1cblxuICAgIHJldHVybiBSZWZsZWN0LmdldCh0YXJnZXQsIHByb3BLZXksIHJlY2VpdmVyKTtcbiAgfSxcbn0pO1xuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O01BQUEsTUFBTSxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUMxQixxQ0FBZSxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7TUFDbEMsRUFBRSxHQUFHLEVBQUUsU0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRTtNQUMzQyxJQUFJLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRTtNQUNoQyxNQUFNLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQ3BELEtBQUs7TUFDTCxJQUFJLElBQUksT0FBTyxLQUFLLE1BQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxJQUFJLE9BQU8sS0FBSyxPQUFPLEVBQUU7TUFDeEUsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztNQUNsRCxHQUFHO01BQ0gsQ0FBQyxFQUFDOzs7Ozs7OzsifQ==
