System.register([], (function (exports) {
  'use strict';
  return {
    execute: (function () {

      exports({
        createBrowserHistory: createBrowserHistory,
        createHashHistory: createHashHistory,
        createMemoryHistory: createMemoryHistory,
        createPath: createPath,
        parsePath: parsePath
      });

      function _extends() {
        _extends = Object.assign || function (target) {
          for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }

          return target;
        };

        return _extends.apply(this, arguments);
      }

      /**
       * Actions represent the type of change to a location value.
       *
       * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#action
       */
      var Action; exports('Action', Action);

      (function (Action) {
        /**
         * A POP indicates a change to an arbitrary index in the history stack, such
         * as a back or forward navigation. It does not describe the direction of the
         * navigation, only that the current index changed.
         *
         * Note: This is the default action for newly created history objects.
         */
        Action["Pop"] = "POP";
        /**
         * A PUSH indicates a new entry being added to the history stack, such as when
         * a link is clicked and a new page loads. When this happens, all subsequent
         * entries in the stack are lost.
         */

        Action["Push"] = "PUSH";
        /**
         * A REPLACE indicates the entry at the current index in the history stack
         * being replaced by a new one.
         */

        Action["Replace"] = "REPLACE";
      })(Action || (exports('Action', Action = {})));

      var readOnly = function (obj) {
        return obj;
      };

      var BeforeUnloadEventType = 'beforeunload';
      var HashChangeEventType = 'hashchange';
      var PopStateEventType = 'popstate';
      /**
       * Browser history stores the location in regular URLs. This is the standard for
       * most web apps, but it requires some configuration on the server to ensure you
       * serve the same app at multiple URLs.
       *
       * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createbrowserhistory
       */

      function createBrowserHistory(options) {
        if (options === void 0) {
          options = {};
        }

        var _options = options,
            _options$window = _options.window,
            window = _options$window === void 0 ? document.defaultView : _options$window;
        var globalHistory = window.history;

        function getIndexAndLocation() {
          var _window$location = window.location,
              pathname = _window$location.pathname,
              search = _window$location.search,
              hash = _window$location.hash;
          var state = globalHistory.state || {};
          return [state.idx, readOnly({
            pathname: pathname,
            search: search,
            hash: hash,
            state: state.usr || null,
            key: state.key || 'default'
          })];
        }

        var blockedPopTx = null;

        function handlePop() {
          if (blockedPopTx) {
            blockers.call(blockedPopTx);
            blockedPopTx = null;
          } else {
            var nextAction = Action.Pop;

            var _getIndexAndLocation = getIndexAndLocation(),
                nextIndex = _getIndexAndLocation[0],
                nextLocation = _getIndexAndLocation[1];

            if (blockers.length) {
              if (nextIndex != null) {
                var delta = index - nextIndex;

                if (delta) {
                  // Revert the POP
                  blockedPopTx = {
                    action: nextAction,
                    location: nextLocation,
                    retry: function retry() {
                      go(delta * -1);
                    }
                  };
                  go(delta);
                }
              }
            } else {
              applyTx(nextAction);
            }
          }
        }

        window.addEventListener(PopStateEventType, handlePop);
        var action = Action.Pop;

        var _getIndexAndLocation2 = getIndexAndLocation(),
            index = _getIndexAndLocation2[0],
            location = _getIndexAndLocation2[1];

        var listeners = createEvents();
        var blockers = createEvents();

        if (index == null) {
          index = 0;
          globalHistory.replaceState(_extends({}, globalHistory.state, {
            idx: index
          }), '');
        }

        function createHref(to) {
          return typeof to === 'string' ? to : createPath(to);
        } // state defaults to `null` because `window.history.state` does


        function getNextLocation(to, state) {
          if (state === void 0) {
            state = null;
          }

          return readOnly(_extends({
            pathname: location.pathname,
            hash: '',
            search: ''
          }, typeof to === 'string' ? parsePath(to) : to, {
            state: state,
            key: createKey()
          }));
        }

        function getHistoryStateAndUrl(nextLocation, index) {
          return [{
            usr: nextLocation.state,
            key: nextLocation.key,
            idx: index
          }, createHref(nextLocation)];
        }

        function allowTx(action, location, retry) {
          return !blockers.length || (blockers.call({
            action: action,
            location: location,
            retry: retry
          }), false);
        }

        function applyTx(nextAction) {
          action = nextAction;

          var _getIndexAndLocation3 = getIndexAndLocation();

          index = _getIndexAndLocation3[0];
          location = _getIndexAndLocation3[1];
          listeners.call({
            action: action,
            location: location
          });
        }

        function push(to, state) {
          var nextAction = Action.Push;
          var nextLocation = getNextLocation(to, state);

          function retry() {
            push(to, state);
          }

          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr = getHistoryStateAndUrl(nextLocation, index + 1),
                historyState = _getHistoryStateAndUr[0],
                url = _getHistoryStateAndUr[1]; // TODO: Support forced reloading
            // try...catch because iOS limits us to 100 pushState calls :/


            try {
              globalHistory.pushState(historyState, '', url);
            } catch (error) {
              // They are going to lose state here, but there is no real
              // way to warn them about it since the page will refresh...
              window.location.assign(url);
            }

            applyTx(nextAction);
          }
        }

        function replace(to, state) {
          var nextAction = Action.Replace;
          var nextLocation = getNextLocation(to, state);

          function retry() {
            replace(to, state);
          }

          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr2 = getHistoryStateAndUrl(nextLocation, index),
                historyState = _getHistoryStateAndUr2[0],
                url = _getHistoryStateAndUr2[1]; // TODO: Support forced reloading


            globalHistory.replaceState(historyState, '', url);
            applyTx(nextAction);
          }
        }

        function go(delta) {
          globalHistory.go(delta);
        }

        var history = {
          get action() {
            return action;
          },

          get location() {
            return location;
          },

          createHref: createHref,
          push: push,
          replace: replace,
          go: go,
          back: function back() {
            go(-1);
          },
          forward: function forward() {
            go(1);
          },
          listen: function listen(listener) {
            return listeners.push(listener);
          },
          block: function block(blocker) {
            var unblock = blockers.push(blocker);

            if (blockers.length === 1) {
              window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
            }

            return function () {
              unblock(); // Remove the beforeunload listener so the document may
              // still be salvageable in the pagehide event.
              // See https://html.spec.whatwg.org/#unloading-documents

              if (!blockers.length) {
                window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
              }
            };
          }
        };
        return history;
      }
      /**
       * Hash history stores the location in window.location.hash. This makes it ideal
       * for situations where you don't want to send the location to the server for
       * some reason, either because you do cannot configure it or the URL space is
       * reserved for something else.
       *
       * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createhashhistory
       */

      function createHashHistory(options) {
        if (options === void 0) {
          options = {};
        }

        var _options2 = options,
            _options2$window = _options2.window,
            window = _options2$window === void 0 ? document.defaultView : _options2$window;
        var globalHistory = window.history;

        function getIndexAndLocation() {
          var _parsePath = parsePath(window.location.hash.substr(1)),
              _parsePath$pathname = _parsePath.pathname,
              pathname = _parsePath$pathname === void 0 ? '/' : _parsePath$pathname,
              _parsePath$search = _parsePath.search,
              search = _parsePath$search === void 0 ? '' : _parsePath$search,
              _parsePath$hash = _parsePath.hash,
              hash = _parsePath$hash === void 0 ? '' : _parsePath$hash;

          var state = globalHistory.state || {};
          return [state.idx, readOnly({
            pathname: pathname,
            search: search,
            hash: hash,
            state: state.usr || null,
            key: state.key || 'default'
          })];
        }

        var blockedPopTx = null;

        function handlePop() {
          if (blockedPopTx) {
            blockers.call(blockedPopTx);
            blockedPopTx = null;
          } else {
            var nextAction = Action.Pop;

            var _getIndexAndLocation4 = getIndexAndLocation(),
                nextIndex = _getIndexAndLocation4[0],
                nextLocation = _getIndexAndLocation4[1];

            if (blockers.length) {
              if (nextIndex != null) {
                var delta = index - nextIndex;

                if (delta) {
                  // Revert the POP
                  blockedPopTx = {
                    action: nextAction,
                    location: nextLocation,
                    retry: function retry() {
                      go(delta * -1);
                    }
                  };
                  go(delta);
                }
              }
            } else {
              applyTx(nextAction);
            }
          }
        }

        window.addEventListener(PopStateEventType, handlePop); // popstate does not fire on hashchange in IE 11 and old (trident) Edge
        // https://developer.mozilla.org/de/docs/Web/API/Window/popstate_event

        window.addEventListener(HashChangeEventType, function () {
          var _getIndexAndLocation5 = getIndexAndLocation(),
              nextLocation = _getIndexAndLocation5[1]; // Ignore extraneous hashchange events.


          if (createPath(nextLocation) !== createPath(location)) {
            handlePop();
          }
        });
        var action = Action.Pop;

        var _getIndexAndLocation6 = getIndexAndLocation(),
            index = _getIndexAndLocation6[0],
            location = _getIndexAndLocation6[1];

        var listeners = createEvents();
        var blockers = createEvents();

        if (index == null) {
          index = 0;
          globalHistory.replaceState(_extends({}, globalHistory.state, {
            idx: index
          }), '');
        }

        function getBaseHref() {
          var base = document.querySelector('base');
          var href = '';

          if (base && base.getAttribute('href')) {
            var url = window.location.href;
            var hashIndex = url.indexOf('#');
            href = hashIndex === -1 ? url : url.slice(0, hashIndex);
          }

          return href;
        }

        function createHref(to) {
          return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
        }

        function getNextLocation(to, state) {
          if (state === void 0) {
            state = null;
          }

          return readOnly(_extends({
            pathname: location.pathname,
            hash: '',
            search: ''
          }, typeof to === 'string' ? parsePath(to) : to, {
            state: state,
            key: createKey()
          }));
        }

        function getHistoryStateAndUrl(nextLocation, index) {
          return [{
            usr: nextLocation.state,
            key: nextLocation.key,
            idx: index
          }, createHref(nextLocation)];
        }

        function allowTx(action, location, retry) {
          return !blockers.length || (blockers.call({
            action: action,
            location: location,
            retry: retry
          }), false);
        }

        function applyTx(nextAction) {
          action = nextAction;

          var _getIndexAndLocation7 = getIndexAndLocation();

          index = _getIndexAndLocation7[0];
          location = _getIndexAndLocation7[1];
          listeners.call({
            action: action,
            location: location
          });
        }

        function push(to, state) {
          var nextAction = Action.Push;
          var nextLocation = getNextLocation(to, state);

          function retry() {
            push(to, state);
          }

          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr3 = getHistoryStateAndUrl(nextLocation, index + 1),
                historyState = _getHistoryStateAndUr3[0],
                url = _getHistoryStateAndUr3[1]; // TODO: Support forced reloading
            // try...catch because iOS limits us to 100 pushState calls :/


            try {
              globalHistory.pushState(historyState, '', url);
            } catch (error) {
              // They are going to lose state here, but there is no real
              // way to warn them about it since the page will refresh...
              window.location.assign(url);
            }

            applyTx(nextAction);
          }
        }

        function replace(to, state) {
          var nextAction = Action.Replace;
          var nextLocation = getNextLocation(to, state);

          function retry() {
            replace(to, state);
          }

          if (allowTx(nextAction, nextLocation, retry)) {
            var _getHistoryStateAndUr4 = getHistoryStateAndUrl(nextLocation, index),
                historyState = _getHistoryStateAndUr4[0],
                url = _getHistoryStateAndUr4[1]; // TODO: Support forced reloading


            globalHistory.replaceState(historyState, '', url);
            applyTx(nextAction);
          }
        }

        function go(delta) {
          globalHistory.go(delta);
        }

        var history = {
          get action() {
            return action;
          },

          get location() {
            return location;
          },

          createHref: createHref,
          push: push,
          replace: replace,
          go: go,
          back: function back() {
            go(-1);
          },
          forward: function forward() {
            go(1);
          },
          listen: function listen(listener) {
            return listeners.push(listener);
          },
          block: function block(blocker) {
            var unblock = blockers.push(blocker);

            if (blockers.length === 1) {
              window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
            }

            return function () {
              unblock(); // Remove the beforeunload listener so the document may
              // still be salvageable in the pagehide event.
              // See https://html.spec.whatwg.org/#unloading-documents

              if (!blockers.length) {
                window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
              }
            };
          }
        };
        return history;
      }
      /**
       * Memory history stores the current location in memory. It is designed for use
       * in stateful non-browser environments like tests and React Native.
       *
       * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#creatememoryhistory
       */

      function createMemoryHistory(options) {
        if (options === void 0) {
          options = {};
        }

        var _options3 = options,
            _options3$initialEntr = _options3.initialEntries,
            initialEntries = _options3$initialEntr === void 0 ? ['/'] : _options3$initialEntr,
            initialIndex = _options3.initialIndex;
        var entries = initialEntries.map(function (entry) {
          var location = readOnly(_extends({
            pathname: '/',
            search: '',
            hash: '',
            state: null,
            key: createKey()
          }, typeof entry === 'string' ? parsePath(entry) : entry));
          return location;
        });
        var index = clamp(initialIndex == null ? entries.length - 1 : initialIndex, 0, entries.length - 1);
        var action = Action.Pop;
        var location = entries[index];
        var listeners = createEvents();
        var blockers = createEvents();

        function createHref(to) {
          return typeof to === 'string' ? to : createPath(to);
        }

        function getNextLocation(to, state) {
          if (state === void 0) {
            state = null;
          }

          return readOnly(_extends({
            pathname: location.pathname,
            search: '',
            hash: ''
          }, typeof to === 'string' ? parsePath(to) : to, {
            state: state,
            key: createKey()
          }));
        }

        function allowTx(action, location, retry) {
          return !blockers.length || (blockers.call({
            action: action,
            location: location,
            retry: retry
          }), false);
        }

        function applyTx(nextAction, nextLocation) {
          action = nextAction;
          location = nextLocation;
          listeners.call({
            action: action,
            location: location
          });
        }

        function push(to, state) {
          var nextAction = Action.Push;
          var nextLocation = getNextLocation(to, state);

          function retry() {
            push(to, state);
          }

          if (allowTx(nextAction, nextLocation, retry)) {
            index += 1;
            entries.splice(index, entries.length, nextLocation);
            applyTx(nextAction, nextLocation);
          }
        }

        function replace(to, state) {
          var nextAction = Action.Replace;
          var nextLocation = getNextLocation(to, state);

          function retry() {
            replace(to, state);
          }

          if (allowTx(nextAction, nextLocation, retry)) {
            entries[index] = nextLocation;
            applyTx(nextAction, nextLocation);
          }
        }

        function go(delta) {
          var nextIndex = clamp(index + delta, 0, entries.length - 1);
          var nextAction = Action.Pop;
          var nextLocation = entries[nextIndex];

          function retry() {
            go(delta);
          }

          if (allowTx(nextAction, nextLocation, retry)) {
            index = nextIndex;
            applyTx(nextAction, nextLocation);
          }
        }

        var history = {
          get index() {
            return index;
          },

          get action() {
            return action;
          },

          get location() {
            return location;
          },

          createHref: createHref,
          push: push,
          replace: replace,
          go: go,
          back: function back() {
            go(-1);
          },
          forward: function forward() {
            go(1);
          },
          listen: function listen(listener) {
            return listeners.push(listener);
          },
          block: function block(blocker) {
            return blockers.push(blocker);
          }
        };
        return history;
      } ////////////////////////////////////////////////////////////////////////////////
      // UTILS
      ////////////////////////////////////////////////////////////////////////////////

      function clamp(n, lowerBound, upperBound) {
        return Math.min(Math.max(n, lowerBound), upperBound);
      }

      function promptBeforeUnload(event) {
        // Cancel the event.
        event.preventDefault(); // Chrome (and legacy IE) requires returnValue to be set.

        event.returnValue = '';
      }

      function createEvents() {
        var handlers = [];
        return {
          get length() {
            return handlers.length;
          },

          push: function push(fn) {
            handlers.push(fn);
            return function () {
              handlers = handlers.filter(function (handler) {
                return handler !== fn;
              });
            };
          },
          call: function call(arg) {
            handlers.forEach(function (fn) {
              return fn && fn(arg);
            });
          }
        };
      }

      function createKey() {
        return Math.random().toString(36).substr(2, 8);
      }
      /**
       * Creates a string URL path from the given pathname, search, and hash components.
       *
       * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#createpath
       */


      function createPath(_ref) {
        var _ref$pathname = _ref.pathname,
            pathname = _ref$pathname === void 0 ? '/' : _ref$pathname,
            _ref$search = _ref.search,
            search = _ref$search === void 0 ? '' : _ref$search,
            _ref$hash = _ref.hash,
            hash = _ref$hash === void 0 ? '' : _ref$hash;
        if (search && search !== '?') pathname += search.charAt(0) === '?' ? search : '?' + search;
        if (hash && hash !== '#') pathname += hash.charAt(0) === '#' ? hash : '#' + hash;
        return pathname;
      }
      /**
       * Parses a string URL path into its separate pathname, search, and hash components.
       *
       * @see https://github.com/remix-run/history/tree/main/docs/api-reference.md#parsepath
       */

      function parsePath(path) {
        var parsedPath = {};

        if (path) {
          var hashIndex = path.indexOf('#');

          if (hashIndex >= 0) {
            parsedPath.hash = path.substr(hashIndex);
            path = path.substr(0, hashIndex);
          }

          var searchIndex = path.indexOf('?');

          if (searchIndex >= 0) {
            parsedPath.search = path.substr(searchIndex);
            path = path.substr(0, searchIndex);
          }

          if (path) {
            parsedPath.pathname = path;
          }
        }

        return parsedPath;
      }

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9AYmFiZWwrcnVudGltZUA3LjE3LjIvbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vaGlzdG9yeUA1LjMuMC9ub2RlX21vZHVsZXMvaGlzdG9yeS9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufSIsImltcG9ydCBfZXh0ZW5kcyBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9leHRlbmRzJztcblxuLyoqXHJcbiAqIEFjdGlvbnMgcmVwcmVzZW50IHRoZSB0eXBlIG9mIGNoYW5nZSB0byBhIGxvY2F0aW9uIHZhbHVlLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI2FjdGlvblxyXG4gKi9cbnZhciBBY3Rpb247XG5cbihmdW5jdGlvbiAoQWN0aW9uKSB7XG4gIC8qKlxyXG4gICAqIEEgUE9QIGluZGljYXRlcyBhIGNoYW5nZSB0byBhbiBhcmJpdHJhcnkgaW5kZXggaW4gdGhlIGhpc3Rvcnkgc3RhY2ssIHN1Y2hcclxuICAgKiBhcyBhIGJhY2sgb3IgZm9yd2FyZCBuYXZpZ2F0aW9uLiBJdCBkb2VzIG5vdCBkZXNjcmliZSB0aGUgZGlyZWN0aW9uIG9mIHRoZVxyXG4gICAqIG5hdmlnYXRpb24sIG9ubHkgdGhhdCB0aGUgY3VycmVudCBpbmRleCBjaGFuZ2VkLlxyXG4gICAqXHJcbiAgICogTm90ZTogVGhpcyBpcyB0aGUgZGVmYXVsdCBhY3Rpb24gZm9yIG5ld2x5IGNyZWF0ZWQgaGlzdG9yeSBvYmplY3RzLlxyXG4gICAqL1xuICBBY3Rpb25bXCJQb3BcIl0gPSBcIlBPUFwiO1xuICAvKipcclxuICAgKiBBIFBVU0ggaW5kaWNhdGVzIGEgbmV3IGVudHJ5IGJlaW5nIGFkZGVkIHRvIHRoZSBoaXN0b3J5IHN0YWNrLCBzdWNoIGFzIHdoZW5cclxuICAgKiBhIGxpbmsgaXMgY2xpY2tlZCBhbmQgYSBuZXcgcGFnZSBsb2Fkcy4gV2hlbiB0aGlzIGhhcHBlbnMsIGFsbCBzdWJzZXF1ZW50XHJcbiAgICogZW50cmllcyBpbiB0aGUgc3RhY2sgYXJlIGxvc3QuXHJcbiAgICovXG5cbiAgQWN0aW9uW1wiUHVzaFwiXSA9IFwiUFVTSFwiO1xuICAvKipcclxuICAgKiBBIFJFUExBQ0UgaW5kaWNhdGVzIHRoZSBlbnRyeSBhdCB0aGUgY3VycmVudCBpbmRleCBpbiB0aGUgaGlzdG9yeSBzdGFja1xyXG4gICAqIGJlaW5nIHJlcGxhY2VkIGJ5IGEgbmV3IG9uZS5cclxuICAgKi9cblxuICBBY3Rpb25bXCJSZXBsYWNlXCJdID0gXCJSRVBMQUNFXCI7XG59KShBY3Rpb24gfHwgKEFjdGlvbiA9IHt9KSk7XG5cbnZhciByZWFkT25seSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5mcmVlemUob2JqKTtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmo7XG59O1xuXG5mdW5jdGlvbiB3YXJuaW5nKGNvbmQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSBjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gV2VsY29tZSB0byBkZWJ1Z2dpbmcgaGlzdG9yeSFcbiAgICAgIC8vXG4gICAgICAvLyBUaGlzIGVycm9yIGlzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHlvdSBjYW4gbW9yZSBlYXNpbHlcbiAgICAgIC8vIGZpbmQgdGhlIHNvdXJjZSBmb3IgYSB3YXJuaW5nIHRoYXQgYXBwZWFycyBpbiB0aGUgY29uc29sZSBieVxuICAgICAgLy8gZW5hYmxpbmcgXCJwYXVzZSBvbiBleGNlcHRpb25zXCIgaW4geW91ciBKYXZhU2NyaXB0IGRlYnVnZ2VyLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG59XG5cbnZhciBCZWZvcmVVbmxvYWRFdmVudFR5cGUgPSAnYmVmb3JldW5sb2FkJztcbnZhciBIYXNoQ2hhbmdlRXZlbnRUeXBlID0gJ2hhc2hjaGFuZ2UnO1xudmFyIFBvcFN0YXRlRXZlbnRUeXBlID0gJ3BvcHN0YXRlJztcbi8qKlxyXG4gKiBCcm93c2VyIGhpc3Rvcnkgc3RvcmVzIHRoZSBsb2NhdGlvbiBpbiByZWd1bGFyIFVSTHMuIFRoaXMgaXMgdGhlIHN0YW5kYXJkIGZvclxyXG4gKiBtb3N0IHdlYiBhcHBzLCBidXQgaXQgcmVxdWlyZXMgc29tZSBjb25maWd1cmF0aW9uIG9uIHRoZSBzZXJ2ZXIgdG8gZW5zdXJlIHlvdVxyXG4gKiBzZXJ2ZSB0aGUgc2FtZSBhcHAgYXQgbXVsdGlwbGUgVVJMcy5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVicm93c2VyaGlzdG9yeVxyXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlQnJvd3Nlckhpc3Rvcnkob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHdpbmRvdyA9IF9vcHRpb25zLndpbmRvdyxcbiAgICAgIHdpbmRvdyA9IF9vcHRpb25zJHdpbmRvdyA9PT0gdm9pZCAwID8gZG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBfb3B0aW9ucyR3aW5kb3c7XG4gIHZhciBnbG9iYWxIaXN0b3J5ID0gd2luZG93Lmhpc3Rvcnk7XG5cbiAgZnVuY3Rpb24gZ2V0SW5kZXhBbmRMb2NhdGlvbigpIHtcbiAgICB2YXIgX3dpbmRvdyRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbixcbiAgICAgICAgcGF0aG5hbWUgPSBfd2luZG93JGxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICBzZWFyY2ggPSBfd2luZG93JGxvY2F0aW9uLnNlYXJjaCxcbiAgICAgICAgaGFzaCA9IF93aW5kb3ckbG9jYXRpb24uaGFzaDtcbiAgICB2YXIgc3RhdGUgPSBnbG9iYWxIaXN0b3J5LnN0YXRlIHx8IHt9O1xuICAgIHJldHVybiBbc3RhdGUuaWR4LCByZWFkT25seSh7XG4gICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBzdGF0ZTogc3RhdGUudXNyIHx8IG51bGwsXG4gICAgICBrZXk6IHN0YXRlLmtleSB8fCAnZGVmYXVsdCdcbiAgICB9KV07XG4gIH1cblxuICB2YXIgYmxvY2tlZFBvcFR4ID0gbnVsbDtcblxuICBmdW5jdGlvbiBoYW5kbGVQb3AoKSB7XG4gICAgaWYgKGJsb2NrZWRQb3BUeCkge1xuICAgICAgYmxvY2tlcnMuY2FsbChibG9ja2VkUG9wVHgpO1xuICAgICAgYmxvY2tlZFBvcFR4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gICAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb24gPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICAgICAgbmV4dEluZGV4ID0gX2dldEluZGV4QW5kTG9jYXRpb25bMF0sXG4gICAgICAgICAgbmV4dExvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb25bMV07XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5leHRJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBuZXh0SW5kZXg7XG5cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIC8vIFJldmVydCB0aGUgUE9QXG4gICAgICAgICAgICBibG9ja2VkUG9wVHggPSB7XG4gICAgICAgICAgICAgIGFjdGlvbjogbmV4dEFjdGlvbixcbiAgICAgICAgICAgICAgbG9jYXRpb246IG5leHRMb2NhdGlvbixcbiAgICAgICAgICAgICAgcmV0cnk6IGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgICAgICAgICAgIGdvKGRlbHRhICogLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ28oZGVsdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUcnlpbmcgdG8gUE9QIHRvIGEgbG9jYXRpb24gd2l0aCBubyBpbmRleC4gV2UgZGlkIG5vdCBjcmVhdGVcbiAgICAgICAgICAvLyB0aGlzIGxvY2F0aW9uLCBzbyB3ZSBjYW4ndCBlZmZlY3RpdmVseSBibG9jayB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGZhbHNlLCAvLyBUT0RPOiBXcml0ZSB1cCBhIGRvYyB0aGF0IGV4cGxhaW5zIG91ciBibG9ja2luZyBzdHJhdGVneSBpblxuICAgICAgICAgIC8vIGRldGFpbCBhbmQgbGluayB0byBpdCBoZXJlIHNvIHBlb3BsZSBjYW4gdW5kZXJzdGFuZCBiZXR0ZXIgd2hhdFxuICAgICAgICAgIC8vIGlzIGdvaW5nIG9uIGFuZCBob3cgdG8gYXZvaWQgaXQuXG4gICAgICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBibG9jayBhIFBPUCBuYXZpZ2F0aW9uIHRvIGEgbG9jYXRpb24gdGhhdCB3YXMgbm90IFwiICsgXCJjcmVhdGVkIGJ5IHRoZSBoaXN0b3J5IGxpYnJhcnkuIFRoZSBibG9jayB3aWxsIGZhaWwgc2lsZW50bHkgaW4gXCIgKyBcInByb2R1Y3Rpb24sIGJ1dCBpbiBnZW5lcmFsIHlvdSBzaG91bGQgZG8gYWxsIG5hdmlnYXRpb24gd2l0aCB0aGUgXCIgKyBcImhpc3RvcnkgbGlicmFyeSAoaW5zdGVhZCBvZiB1c2luZyB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgZGlyZWN0bHkpIFwiICsgXCJ0byBhdm9pZCB0aGlzIHNpdHVhdGlvbi5cIikgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoUG9wU3RhdGVFdmVudFR5cGUsIGhhbmRsZVBvcCk7XG4gIHZhciBhY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjIgPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uMlswXSxcbiAgICAgIGxvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb24yWzFdO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICBpbmRleCA9IDA7XG4gICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoX2V4dGVuZHMoe30sIGdsb2JhbEhpc3Rvcnkuc3RhdGUsIHtcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9KSwgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSHJlZih0bykge1xuICAgIHJldHVybiB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKTtcbiAgfSAvLyBzdGF0ZSBkZWZhdWx0cyB0byBgbnVsbGAgYmVjYXVzZSBgd2luZG93Lmhpc3Rvcnkuc3RhdGVgIGRvZXNcblxuXG4gIGZ1bmN0aW9uIGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZWFkT25seShfZXh0ZW5kcyh7XG4gICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBoYXNoOiAnJyxcbiAgICAgIHNlYXJjaDogJydcbiAgICB9LCB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gcGFyc2VQYXRoKHRvKSA6IHRvLCB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBrZXk6IGNyZWF0ZUtleSgpXG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXgpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIHVzcjogbmV4dExvY2F0aW9uLnN0YXRlLFxuICAgICAga2V5OiBuZXh0TG9jYXRpb24ua2V5LFxuICAgICAgaWR4OiBpbmRleFxuICAgIH0sIGNyZWF0ZUhyZWYobmV4dExvY2F0aW9uKV07XG4gIH1cblxuICBmdW5jdGlvbiBhbGxvd1R4KGFjdGlvbiwgbG9jYXRpb24sIHJldHJ5KSB7XG4gICAgcmV0dXJuICFibG9ja2Vycy5sZW5ndGggfHwgKGJsb2NrZXJzLmNhbGwoe1xuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICByZXRyeTogcmV0cnlcbiAgICB9KSwgZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHlUeChuZXh0QWN0aW9uKSB7XG4gICAgYWN0aW9uID0gbmV4dEFjdGlvbjtcblxuICAgIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjMgPSBnZXRJbmRleEFuZExvY2F0aW9uKCk7XG5cbiAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uM1swXTtcbiAgICBsb2NhdGlvbiA9IF9nZXRJbmRleEFuZExvY2F0aW9uM1sxXTtcbiAgICBsaXN0ZW5lcnMuY2FsbCh7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaCh0bywgc3RhdGUpIHtcbiAgICB2YXIgbmV4dEFjdGlvbiA9IEFjdGlvbi5QdXNoO1xuICAgIHZhciBuZXh0TG9jYXRpb24gPSBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgcHVzaCh0bywgc3RhdGUpO1xuICAgIH1cblxuICAgIGlmIChhbGxvd1R4KG5leHRBY3Rpb24sIG5leHRMb2NhdGlvbiwgcmV0cnkpKSB7XG4gICAgICB2YXIgX2dldEhpc3RvcnlTdGF0ZUFuZFVyID0gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXggKyAxKSxcbiAgICAgICAgICBoaXN0b3J5U3RhdGUgPSBfZ2V0SGlzdG9yeVN0YXRlQW5kVXJbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyWzFdOyAvLyBUT0RPOiBTdXBwb3J0IGZvcmNlZCByZWxvYWRpbmdcbiAgICAgIC8vIHRyeS4uLmNhdGNoIGJlY2F1c2UgaU9TIGxpbWl0cyB1cyB0byAxMDAgcHVzaFN0YXRlIGNhbGxzIDovXG5cblxuICAgICAgdHJ5IHtcbiAgICAgICAgZ2xvYmFsSGlzdG9yeS5wdXNoU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgdXJsKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIFRoZXkgYXJlIGdvaW5nIHRvIGxvc2Ugc3RhdGUgaGVyZSwgYnV0IHRoZXJlIGlzIG5vIHJlYWxcbiAgICAgICAgLy8gd2F5IHRvIHdhcm4gdGhlbSBhYm91dCBpdCBzaW5jZSB0aGUgcGFnZSB3aWxsIHJlZnJlc2guLi5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpO1xuICAgICAgfVxuXG4gICAgICBhcHBseVR4KG5leHRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGxhY2UodG8sIHN0YXRlKSB7XG4gICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUmVwbGFjZTtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZ2V0TmV4dExvY2F0aW9uKHRvLCBzdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiByZXRyeSgpIHtcbiAgICAgIHJlcGxhY2UodG8sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgdmFyIF9nZXRIaXN0b3J5U3RhdGVBbmRVcjIgPSBnZXRIaXN0b3J5U3RhdGVBbmRVcmwobmV4dExvY2F0aW9uLCBpbmRleCksXG4gICAgICAgICAgaGlzdG9yeVN0YXRlID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyMlswXSxcbiAgICAgICAgICB1cmwgPSBfZ2V0SGlzdG9yeVN0YXRlQW5kVXIyWzFdOyAvLyBUT0RPOiBTdXBwb3J0IGZvcmNlZCByZWxvYWRpbmdcblxuXG4gICAgICBnbG9iYWxIaXN0b3J5LnJlcGxhY2VTdGF0ZShoaXN0b3J5U3RhdGUsICcnLCB1cmwpO1xuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyhkZWx0YSkge1xuICAgIGdsb2JhbEhpc3RvcnkuZ28oZGVsdGEpO1xuICB9XG5cbiAgdmFyIGhpc3RvcnkgPSB7XG4gICAgZ2V0IGFjdGlvbigpIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGdldCBsb2NhdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9LFxuXG4gICAgY3JlYXRlSHJlZjogY3JlYXRlSHJlZixcbiAgICBwdXNoOiBwdXNoLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgZ286IGdvLFxuICAgIGJhY2s6IGZ1bmN0aW9uIGJhY2soKSB7XG4gICAgICBnbygtMSk7XG4gICAgfSxcbiAgICBmb3J3YXJkOiBmdW5jdGlvbiBmb3J3YXJkKCkge1xuICAgICAgZ28oMSk7XG4gICAgfSxcbiAgICBsaXN0ZW46IGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGJsb2NrOiBmdW5jdGlvbiBibG9jayhibG9ja2VyKSB7XG4gICAgICB2YXIgdW5ibG9jayA9IGJsb2NrZXJzLnB1c2goYmxvY2tlcik7XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoQmVmb3JlVW5sb2FkRXZlbnRUeXBlLCBwcm9tcHRCZWZvcmVVbmxvYWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB1bmJsb2NrKCk7IC8vIFJlbW92ZSB0aGUgYmVmb3JldW5sb2FkIGxpc3RlbmVyIHNvIHRoZSBkb2N1bWVudCBtYXlcbiAgICAgICAgLy8gc3RpbGwgYmUgc2FsdmFnZWFibGUgaW4gdGhlIHBhZ2VoaWRlIGV2ZW50LlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jdW5sb2FkaW5nLWRvY3VtZW50c1xuXG4gICAgICAgIGlmICghYmxvY2tlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoQmVmb3JlVW5sb2FkRXZlbnRUeXBlLCBwcm9tcHRCZWZvcmVVbmxvYWQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGhpc3Rvcnk7XG59XG4vKipcclxuICogSGFzaCBoaXN0b3J5IHN0b3JlcyB0aGUgbG9jYXRpb24gaW4gd2luZG93LmxvY2F0aW9uLmhhc2guIFRoaXMgbWFrZXMgaXQgaWRlYWxcclxuICogZm9yIHNpdHVhdGlvbnMgd2hlcmUgeW91IGRvbid0IHdhbnQgdG8gc2VuZCB0aGUgbG9jYXRpb24gdG8gdGhlIHNlcnZlciBmb3JcclxuICogc29tZSByZWFzb24sIGVpdGhlciBiZWNhdXNlIHlvdSBkbyBjYW5ub3QgY29uZmlndXJlIGl0IG9yIHRoZSBVUkwgc3BhY2UgaXNcclxuICogcmVzZXJ2ZWQgZm9yIHNvbWV0aGluZyBlbHNlLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI2NyZWF0ZWhhc2hoaXN0b3J5XHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVIYXNoSGlzdG9yeShvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMyID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zMiR3aW5kb3cgPSBfb3B0aW9uczIud2luZG93LFxuICAgICAgd2luZG93ID0gX29wdGlvbnMyJHdpbmRvdyA9PT0gdm9pZCAwID8gZG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBfb3B0aW9uczIkd2luZG93O1xuICB2YXIgZ2xvYmFsSGlzdG9yeSA9IHdpbmRvdy5oaXN0b3J5O1xuXG4gIGZ1bmN0aW9uIGdldEluZGV4QW5kTG9jYXRpb24oKSB7XG4gICAgdmFyIF9wYXJzZVBhdGggPSBwYXJzZVBhdGgod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKSxcbiAgICAgICAgX3BhcnNlUGF0aCRwYXRobmFtZSA9IF9wYXJzZVBhdGgucGF0aG5hbWUsXG4gICAgICAgIHBhdGhuYW1lID0gX3BhcnNlUGF0aCRwYXRobmFtZSA9PT0gdm9pZCAwID8gJy8nIDogX3BhcnNlUGF0aCRwYXRobmFtZSxcbiAgICAgICAgX3BhcnNlUGF0aCRzZWFyY2ggPSBfcGFyc2VQYXRoLnNlYXJjaCxcbiAgICAgICAgc2VhcmNoID0gX3BhcnNlUGF0aCRzZWFyY2ggPT09IHZvaWQgMCA/ICcnIDogX3BhcnNlUGF0aCRzZWFyY2gsXG4gICAgICAgIF9wYXJzZVBhdGgkaGFzaCA9IF9wYXJzZVBhdGguaGFzaCxcbiAgICAgICAgaGFzaCA9IF9wYXJzZVBhdGgkaGFzaCA9PT0gdm9pZCAwID8gJycgOiBfcGFyc2VQYXRoJGhhc2g7XG5cbiAgICB2YXIgc3RhdGUgPSBnbG9iYWxIaXN0b3J5LnN0YXRlIHx8IHt9O1xuICAgIHJldHVybiBbc3RhdGUuaWR4LCByZWFkT25seSh7XG4gICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBzdGF0ZTogc3RhdGUudXNyIHx8IG51bGwsXG4gICAgICBrZXk6IHN0YXRlLmtleSB8fCAnZGVmYXVsdCdcbiAgICB9KV07XG4gIH1cblxuICB2YXIgYmxvY2tlZFBvcFR4ID0gbnVsbDtcblxuICBmdW5jdGlvbiBoYW5kbGVQb3AoKSB7XG4gICAgaWYgKGJsb2NrZWRQb3BUeCkge1xuICAgICAgYmxvY2tlcnMuY2FsbChibG9ja2VkUG9wVHgpO1xuICAgICAgYmxvY2tlZFBvcFR4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gICAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb240ID0gZ2V0SW5kZXhBbmRMb2NhdGlvbigpLFxuICAgICAgICAgIG5leHRJbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uNFswXSxcbiAgICAgICAgICBuZXh0TG9jYXRpb24gPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjRbMV07XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5leHRJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBuZXh0SW5kZXg7XG5cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIC8vIFJldmVydCB0aGUgUE9QXG4gICAgICAgICAgICBibG9ja2VkUG9wVHggPSB7XG4gICAgICAgICAgICAgIGFjdGlvbjogbmV4dEFjdGlvbixcbiAgICAgICAgICAgICAgbG9jYXRpb246IG5leHRMb2NhdGlvbixcbiAgICAgICAgICAgICAgcmV0cnk6IGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgICAgICAgICAgIGdvKGRlbHRhICogLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ28oZGVsdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUcnlpbmcgdG8gUE9QIHRvIGEgbG9jYXRpb24gd2l0aCBubyBpbmRleC4gV2UgZGlkIG5vdCBjcmVhdGVcbiAgICAgICAgICAvLyB0aGlzIGxvY2F0aW9uLCBzbyB3ZSBjYW4ndCBlZmZlY3RpdmVseSBibG9jayB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGZhbHNlLCAvLyBUT0RPOiBXcml0ZSB1cCBhIGRvYyB0aGF0IGV4cGxhaW5zIG91ciBibG9ja2luZyBzdHJhdGVneSBpblxuICAgICAgICAgIC8vIGRldGFpbCBhbmQgbGluayB0byBpdCBoZXJlIHNvIHBlb3BsZSBjYW4gdW5kZXJzdGFuZCBiZXR0ZXJcbiAgICAgICAgICAvLyB3aGF0IGlzIGdvaW5nIG9uIGFuZCBob3cgdG8gYXZvaWQgaXQuXG4gICAgICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBibG9jayBhIFBPUCBuYXZpZ2F0aW9uIHRvIGEgbG9jYXRpb24gdGhhdCB3YXMgbm90IFwiICsgXCJjcmVhdGVkIGJ5IHRoZSBoaXN0b3J5IGxpYnJhcnkuIFRoZSBibG9jayB3aWxsIGZhaWwgc2lsZW50bHkgaW4gXCIgKyBcInByb2R1Y3Rpb24sIGJ1dCBpbiBnZW5lcmFsIHlvdSBzaG91bGQgZG8gYWxsIG5hdmlnYXRpb24gd2l0aCB0aGUgXCIgKyBcImhpc3RvcnkgbGlicmFyeSAoaW5zdGVhZCBvZiB1c2luZyB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgZGlyZWN0bHkpIFwiICsgXCJ0byBhdm9pZCB0aGlzIHNpdHVhdGlvbi5cIikgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoUG9wU3RhdGVFdmVudFR5cGUsIGhhbmRsZVBvcCk7IC8vIHBvcHN0YXRlIGRvZXMgbm90IGZpcmUgb24gaGFzaGNoYW5nZSBpbiBJRSAxMSBhbmQgb2xkICh0cmlkZW50KSBFZGdlXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RlL2RvY3MvV2ViL0FQSS9XaW5kb3cvcG9wc3RhdGVfZXZlbnRcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihIYXNoQ2hhbmdlRXZlbnRUeXBlLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9nZXRJbmRleEFuZExvY2F0aW9uNSA9IGdldEluZGV4QW5kTG9jYXRpb24oKSxcbiAgICAgICAgbmV4dExvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb241WzFdOyAvLyBJZ25vcmUgZXh0cmFuZW91cyBoYXNoY2hhbmdlIGV2ZW50cy5cblxuXG4gICAgaWYgKGNyZWF0ZVBhdGgobmV4dExvY2F0aW9uKSAhPT0gY3JlYXRlUGF0aChsb2NhdGlvbikpIHtcbiAgICAgIGhhbmRsZVBvcCgpO1xuICAgIH1cbiAgfSk7XG4gIHZhciBhY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjYgPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uNlswXSxcbiAgICAgIGxvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb242WzFdO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICBpbmRleCA9IDA7XG4gICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoX2V4dGVuZHMoe30sIGdsb2JhbEhpc3Rvcnkuc3RhdGUsIHtcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9KSwgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QmFzZUhyZWYoKSB7XG4gICAgdmFyIGJhc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdiYXNlJyk7XG4gICAgdmFyIGhyZWYgPSAnJztcblxuICAgIGlmIChiYXNlICYmIGJhc2UuZ2V0QXR0cmlidXRlKCdocmVmJykpIHtcbiAgICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgIHZhciBoYXNoSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgICAgaHJlZiA9IGhhc2hJbmRleCA9PT0gLTEgPyB1cmwgOiB1cmwuc2xpY2UoMCwgaGFzaEluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHJlZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUhyZWYodG8pIHtcbiAgICByZXR1cm4gZ2V0QmFzZUhyZWYoKSArICcjJyArICh0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhZE9ubHkoX2V4dGVuZHMoe1xuICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgaGFzaDogJycsXG4gICAgICBzZWFyY2g6ICcnXG4gICAgfSwgdHlwZW9mIHRvID09PSAnc3RyaW5nJyA/IHBhcnNlUGF0aCh0bykgOiB0bywge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAga2V5OiBjcmVhdGVLZXkoKVxuICAgIH0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEhpc3RvcnlTdGF0ZUFuZFVybChuZXh0TG9jYXRpb24sIGluZGV4KSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICB1c3I6IG5leHRMb2NhdGlvbi5zdGF0ZSxcbiAgICAgIGtleTogbmV4dExvY2F0aW9uLmtleSxcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9LCBjcmVhdGVIcmVmKG5leHRMb2NhdGlvbildO1xuICB9XG5cbiAgZnVuY3Rpb24gYWxsb3dUeChhY3Rpb24sIGxvY2F0aW9uLCByZXRyeSkge1xuICAgIHJldHVybiAhYmxvY2tlcnMubGVuZ3RoIHx8IChibG9ja2Vycy5jYWxsKHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgcmV0cnk6IHJldHJ5XG4gICAgfSksIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5VHgobmV4dEFjdGlvbikge1xuICAgIGFjdGlvbiA9IG5leHRBY3Rpb247XG5cbiAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb243ID0gZ2V0SW5kZXhBbmRMb2NhdGlvbigpO1xuXG4gICAgaW5kZXggPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjdbMF07XG4gICAgbG9jYXRpb24gPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjdbMV07XG4gICAgbGlzdGVuZXJzLmNhbGwoe1xuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb25cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2godG8sIHN0YXRlKSB7XG4gICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUHVzaDtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZ2V0TmV4dExvY2F0aW9uKHRvLCBzdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiByZXRyeSgpIHtcbiAgICAgIHB1c2godG8sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKG5leHRMb2NhdGlvbi5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJywgXCJSZWxhdGl2ZSBwYXRobmFtZXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gaGFzaCBoaXN0b3J5LnB1c2goXCIgKyBKU09OLnN0cmluZ2lmeSh0bykgKyBcIilcIikgOiB2b2lkIDA7XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgdmFyIF9nZXRIaXN0b3J5U3RhdGVBbmRVcjMgPSBnZXRIaXN0b3J5U3RhdGVBbmRVcmwobmV4dExvY2F0aW9uLCBpbmRleCArIDEpLFxuICAgICAgICAgIGhpc3RvcnlTdGF0ZSA9IF9nZXRIaXN0b3J5U3RhdGVBbmRVcjNbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyM1sxXTsgLy8gVE9ETzogU3VwcG9ydCBmb3JjZWQgcmVsb2FkaW5nXG4gICAgICAvLyB0cnkuLi5jYXRjaCBiZWNhdXNlIGlPUyBsaW1pdHMgdXMgdG8gMTAwIHB1c2hTdGF0ZSBjYWxscyA6L1xuXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbEhpc3RvcnkucHVzaFN0YXRlKGhpc3RvcnlTdGF0ZSwgJycsIHVybCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBUaGV5IGFyZSBnb2luZyB0byBsb3NlIHN0YXRlIGhlcmUsIGJ1dCB0aGVyZSBpcyBubyByZWFsXG4gICAgICAgIC8vIHdheSB0byB3YXJuIHRoZW0gYWJvdXQgaXQgc2luY2UgdGhlIHBhZ2Ugd2lsbCByZWZyZXNoLi4uXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKHRvLCBzdGF0ZSkge1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlJlcGxhY2U7XG4gICAgdmFyIG5leHRMb2NhdGlvbiA9IGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICByZXBsYWNlKHRvLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gd2FybmluZyhuZXh0TG9jYXRpb24ucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycsIFwiUmVsYXRpdmUgcGF0aG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkIGluIGhhc2ggaGlzdG9yeS5yZXBsYWNlKFwiICsgSlNPTi5zdHJpbmdpZnkodG8pICsgXCIpXCIpIDogdm9pZCAwO1xuXG4gICAgaWYgKGFsbG93VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uLCByZXRyeSkpIHtcbiAgICAgIHZhciBfZ2V0SGlzdG9yeVN0YXRlQW5kVXI0ID0gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXgpLFxuICAgICAgICAgIGhpc3RvcnlTdGF0ZSA9IF9nZXRIaXN0b3J5U3RhdGVBbmRVcjRbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyNFsxXTsgLy8gVE9ETzogU3VwcG9ydCBmb3JjZWQgcmVsb2FkaW5nXG5cblxuICAgICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgdXJsKTtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ28oZGVsdGEpIHtcbiAgICBnbG9iYWxIaXN0b3J5LmdvKGRlbHRhKTtcbiAgfVxuXG4gIHZhciBoaXN0b3J5ID0ge1xuICAgIGdldCBhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBnZXQgbG9jYXRpb24oKSB7XG4gICAgICByZXR1cm4gbG9jYXRpb247XG4gICAgfSxcblxuICAgIGNyZWF0ZUhyZWY6IGNyZWF0ZUhyZWYsXG4gICAgcHVzaDogcHVzaCxcbiAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgIGdvOiBnbyxcbiAgICBiYWNrOiBmdW5jdGlvbiBiYWNrKCkge1xuICAgICAgZ28oLTEpO1xuICAgIH0sXG4gICAgZm9yd2FyZDogZnVuY3Rpb24gZm9yd2FyZCgpIHtcbiAgICAgIGdvKDEpO1xuICAgIH0sXG4gICAgbGlzdGVuOiBmdW5jdGlvbiBsaXN0ZW4obGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfSxcbiAgICBibG9jazogZnVuY3Rpb24gYmxvY2soYmxvY2tlcikge1xuICAgICAgdmFyIHVuYmxvY2sgPSBibG9ja2Vycy5wdXNoKGJsb2NrZXIpO1xuXG4gICAgICBpZiAoYmxvY2tlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKEJlZm9yZVVubG9hZEV2ZW50VHlwZSwgcHJvbXB0QmVmb3JlVW5sb2FkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdW5ibG9jaygpOyAvLyBSZW1vdmUgdGhlIGJlZm9yZXVubG9hZCBsaXN0ZW5lciBzbyB0aGUgZG9jdW1lbnQgbWF5XG4gICAgICAgIC8vIHN0aWxsIGJlIHNhbHZhZ2VhYmxlIGluIHRoZSBwYWdlaGlkZSBldmVudC5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvI3VubG9hZGluZy1kb2N1bWVudHNcblxuICAgICAgICBpZiAoIWJsb2NrZXJzLmxlbmd0aCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKEJlZm9yZVVubG9hZEV2ZW50VHlwZSwgcHJvbXB0QmVmb3JlVW5sb2FkKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBoaXN0b3J5O1xufVxuLyoqXHJcbiAqIE1lbW9yeSBoaXN0b3J5IHN0b3JlcyB0aGUgY3VycmVudCBsb2NhdGlvbiBpbiBtZW1vcnkuIEl0IGlzIGRlc2lnbmVkIGZvciB1c2VcclxuICogaW4gc3RhdGVmdWwgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzIGxpa2UgdGVzdHMgYW5kIFJlYWN0IE5hdGl2ZS5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVtZW1vcnloaXN0b3J5XHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnlIaXN0b3J5KG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9uczMgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMzJGluaXRpYWxFbnRyID0gX29wdGlvbnMzLmluaXRpYWxFbnRyaWVzLFxuICAgICAgaW5pdGlhbEVudHJpZXMgPSBfb3B0aW9uczMkaW5pdGlhbEVudHIgPT09IHZvaWQgMCA/IFsnLyddIDogX29wdGlvbnMzJGluaXRpYWxFbnRyLFxuICAgICAgaW5pdGlhbEluZGV4ID0gX29wdGlvbnMzLmluaXRpYWxJbmRleDtcbiAgdmFyIGVudHJpZXMgPSBpbml0aWFsRW50cmllcy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgdmFyIGxvY2F0aW9uID0gcmVhZE9ubHkoX2V4dGVuZHMoe1xuICAgICAgcGF0aG5hbWU6ICcvJyxcbiAgICAgIHNlYXJjaDogJycsXG4gICAgICBoYXNoOiAnJyxcbiAgICAgIHN0YXRlOiBudWxsLFxuICAgICAga2V5OiBjcmVhdGVLZXkoKVxuICAgIH0sIHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycgPyBwYXJzZVBhdGgoZW50cnkpIDogZW50cnkpKTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGxvY2F0aW9uLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nLCBcIlJlbGF0aXZlIHBhdGhuYW1lcyBhcmUgbm90IHN1cHBvcnRlZCBpbiBjcmVhdGVNZW1vcnlIaXN0b3J5KHsgaW5pdGlhbEVudHJpZXMgfSkgKGludmFsaWQgZW50cnk6IFwiICsgSlNPTi5zdHJpbmdpZnkoZW50cnkpICsgXCIpXCIpIDogdm9pZCAwO1xuICAgIHJldHVybiBsb2NhdGlvbjtcbiAgfSk7XG4gIHZhciBpbmRleCA9IGNsYW1wKGluaXRpYWxJbmRleCA9PSBudWxsID8gZW50cmllcy5sZW5ndGggLSAxIDogaW5pdGlhbEluZGV4LCAwLCBlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICB2YXIgYWN0aW9uID0gQWN0aW9uLlBvcDtcbiAgdmFyIGxvY2F0aW9uID0gZW50cmllc1tpbmRleF07XG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlSHJlZih0bykge1xuICAgIHJldHVybiB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZWFkT25seShfZXh0ZW5kcyh7XG4gICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBzZWFyY2g6ICcnLFxuICAgICAgaGFzaDogJydcbiAgICB9LCB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gcGFyc2VQYXRoKHRvKSA6IHRvLCB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBrZXk6IGNyZWF0ZUtleSgpXG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWxsb3dUeChhY3Rpb24sIGxvY2F0aW9uLCByZXRyeSkge1xuICAgIHJldHVybiAhYmxvY2tlcnMubGVuZ3RoIHx8IChibG9ja2Vycy5jYWxsKHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgcmV0cnk6IHJldHJ5XG4gICAgfSksIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKSB7XG4gICAgYWN0aW9uID0gbmV4dEFjdGlvbjtcbiAgICBsb2NhdGlvbiA9IG5leHRMb2NhdGlvbjtcbiAgICBsaXN0ZW5lcnMuY2FsbCh7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaCh0bywgc3RhdGUpIHtcbiAgICB2YXIgbmV4dEFjdGlvbiA9IEFjdGlvbi5QdXNoO1xuICAgIHZhciBuZXh0TG9jYXRpb24gPSBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgcHVzaCh0bywgc3RhdGUpO1xuICAgIH1cblxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IHdhcm5pbmcobG9jYXRpb24ucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycsIFwiUmVsYXRpdmUgcGF0aG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkIGluIG1lbW9yeSBoaXN0b3J5LnB1c2goXCIgKyBKU09OLnN0cmluZ2lmeSh0bykgKyBcIilcIikgOiB2b2lkIDA7XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgaW5kZXggKz0gMTtcbiAgICAgIGVudHJpZXMuc3BsaWNlKGluZGV4LCBlbnRyaWVzLmxlbmd0aCwgbmV4dExvY2F0aW9uKTtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKHRvLCBzdGF0ZSkge1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlJlcGxhY2U7XG4gICAgdmFyIG5leHRMb2NhdGlvbiA9IGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICByZXBsYWNlKHRvLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gd2FybmluZyhsb2NhdGlvbi5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJywgXCJSZWxhdGl2ZSBwYXRobmFtZXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gbWVtb3J5IGhpc3RvcnkucmVwbGFjZShcIiArIEpTT04uc3RyaW5naWZ5KHRvKSArIFwiKVwiKSA6IHZvaWQgMDtcblxuICAgIGlmIChhbGxvd1R4KG5leHRBY3Rpb24sIG5leHRMb2NhdGlvbiwgcmV0cnkpKSB7XG4gICAgICBlbnRyaWVzW2luZGV4XSA9IG5leHRMb2NhdGlvbjtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyhkZWx0YSkge1xuICAgIHZhciBuZXh0SW5kZXggPSBjbGFtcChpbmRleCArIGRlbHRhLCAwLCBlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlBvcDtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZW50cmllc1tuZXh0SW5kZXhdO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICBnbyhkZWx0YSk7XG4gICAgfVxuXG4gICAgaWYgKGFsbG93VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uLCByZXRyeSkpIHtcbiAgICAgIGluZGV4ID0gbmV4dEluZGV4O1xuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBoaXN0b3J5ID0ge1xuICAgIGdldCBpbmRleCgpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgZ2V0IGFjdGlvbigpIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGdldCBsb2NhdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9LFxuXG4gICAgY3JlYXRlSHJlZjogY3JlYXRlSHJlZixcbiAgICBwdXNoOiBwdXNoLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgZ286IGdvLFxuICAgIGJhY2s6IGZ1bmN0aW9uIGJhY2soKSB7XG4gICAgICBnbygtMSk7XG4gICAgfSxcbiAgICBmb3J3YXJkOiBmdW5jdGlvbiBmb3J3YXJkKCkge1xuICAgICAgZ28oMSk7XG4gICAgfSxcbiAgICBsaXN0ZW46IGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGJsb2NrOiBmdW5jdGlvbiBibG9jayhibG9ja2VyKSB7XG4gICAgICByZXR1cm4gYmxvY2tlcnMucHVzaChibG9ja2VyKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBoaXN0b3J5O1xufSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gVVRJTFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGNsYW1wKG4sIGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG4sIGxvd2VyQm91bmQpLCB1cHBlckJvdW5kKTtcbn1cblxuZnVuY3Rpb24gcHJvbXB0QmVmb3JlVW5sb2FkKGV2ZW50KSB7XG4gIC8vIENhbmNlbCB0aGUgZXZlbnQuXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIENocm9tZSAoYW5kIGxlZ2FjeSBJRSkgcmVxdWlyZXMgcmV0dXJuVmFsdWUgdG8gYmUgc2V0LlxuXG4gIGV2ZW50LnJldHVyblZhbHVlID0gJyc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50cygpIHtcbiAgdmFyIGhhbmRsZXJzID0gW107XG4gIHJldHVybiB7XG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgIHJldHVybiBoYW5kbGVycy5sZW5ndGg7XG4gICAgfSxcblxuICAgIHB1c2g6IGZ1bmN0aW9uIHB1c2goZm4pIHtcbiAgICAgIGhhbmRsZXJzLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFuZGxlcnMgPSBoYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gaGFuZGxlciAhPT0gZm47XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9LFxuICAgIGNhbGw6IGZ1bmN0aW9uIGNhbGwoYXJnKSB7XG4gICAgICBoYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZm4gJiYgZm4oYXJnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlS2V5KCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDgpO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzdHJpbmcgVVJMIHBhdGggZnJvbSB0aGUgZ2l2ZW4gcGF0aG5hbWUsIHNlYXJjaCwgYW5kIGhhc2ggY29tcG9uZW50cy5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVwYXRoXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZVBhdGgoX3JlZikge1xuICB2YXIgX3JlZiRwYXRobmFtZSA9IF9yZWYucGF0aG5hbWUsXG4gICAgICBwYXRobmFtZSA9IF9yZWYkcGF0aG5hbWUgPT09IHZvaWQgMCA/ICcvJyA6IF9yZWYkcGF0aG5hbWUsXG4gICAgICBfcmVmJHNlYXJjaCA9IF9yZWYuc2VhcmNoLFxuICAgICAgc2VhcmNoID0gX3JlZiRzZWFyY2ggPT09IHZvaWQgMCA/ICcnIDogX3JlZiRzZWFyY2gsXG4gICAgICBfcmVmJGhhc2ggPSBfcmVmLmhhc2gsXG4gICAgICBoYXNoID0gX3JlZiRoYXNoID09PSB2b2lkIDAgPyAnJyA6IF9yZWYkaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2ggIT09ICc/JykgcGF0aG5hbWUgKz0gc2VhcmNoLmNoYXJBdCgwKSA9PT0gJz8nID8gc2VhcmNoIDogJz8nICsgc2VhcmNoO1xuICBpZiAoaGFzaCAmJiBoYXNoICE9PSAnIycpIHBhdGhuYW1lICs9IGhhc2guY2hhckF0KDApID09PSAnIycgPyBoYXNoIDogJyMnICsgaGFzaDtcbiAgcmV0dXJuIHBhdGhuYW1lO1xufVxuLyoqXHJcbiAqIFBhcnNlcyBhIHN0cmluZyBVUkwgcGF0aCBpbnRvIGl0cyBzZXBhcmF0ZSBwYXRobmFtZSwgc2VhcmNoLCBhbmQgaGFzaCBjb21wb25lbnRzLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI3BhcnNlcGF0aFxyXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGgpIHtcbiAgdmFyIHBhcnNlZFBhdGggPSB7fTtcblxuICBpZiAocGF0aCkge1xuICAgIHZhciBoYXNoSW5kZXggPSBwYXRoLmluZGV4T2YoJyMnKTtcblxuICAgIGlmIChoYXNoSW5kZXggPj0gMCkge1xuICAgICAgcGFyc2VkUGF0aC5oYXNoID0gcGF0aC5zdWJzdHIoaGFzaEluZGV4KTtcbiAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLCBoYXNoSW5kZXgpO1xuICAgIH1cblxuICAgIHZhciBzZWFyY2hJbmRleCA9IHBhdGguaW5kZXhPZignPycpO1xuXG4gICAgaWYgKHNlYXJjaEluZGV4ID49IDApIHtcbiAgICAgIHBhcnNlZFBhdGguc2VhcmNoID0gcGF0aC5zdWJzdHIoc2VhcmNoSW5kZXgpO1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHNlYXJjaEluZGV4KTtcbiAgICB9XG5cbiAgICBpZiAocGF0aCkge1xuICAgICAgcGFyc2VkUGF0aC5wYXRobmFtZSA9IHBhdGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZFBhdGg7XG59XG5cbmV4cG9ydCB7IEFjdGlvbiwgY3JlYXRlQnJvd3Nlckhpc3RvcnksIGNyZWF0ZUhhc2hIaXN0b3J5LCBjcmVhdGVNZW1vcnlIaXN0b3J5LCBjcmVhdGVQYXRoLCBwYXJzZVBhdGggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3Mi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
