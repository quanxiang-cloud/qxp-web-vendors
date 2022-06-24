System.register(['react', '@one-for-all/utils', 'rxjs', 'rxjs/operators', 'rxjs/ajax', 'react-dom'], (function (exports) {
  'use strict';
  var React, useRef, useState, useEffect, useMemo, useContext, useImperativeHandle, logger, switchMap, share, map, catchError, of, BehaviorSubject, Subject, noop, from, firstValueFrom, combineLatest, take, last, combineLatestWith, skip$1, tap, distinctUntilKeyChanged, distinctUntilChanged, map$1, filter, share$1, skip, delay, ajax, ReactDOM;
  return {
    setters: [function (module) {
      React = module["default"];
      useRef = module.useRef;
      useState = module.useState;
      useEffect = module.useEffect;
      useMemo = module.useMemo;
      useContext = module.useContext;
      useImperativeHandle = module.useImperativeHandle;
    }, function (module) {
      logger = module.logger;
    }, function (module) {
      switchMap = module.switchMap;
      share = module.share;
      map = module.map;
      catchError = module.catchError;
      of = module.of;
      BehaviorSubject = module.BehaviorSubject;
      Subject = module.Subject;
      noop = module.noop;
      from = module.from;
      firstValueFrom = module.firstValueFrom;
      combineLatest = module.combineLatest;
      take = module.take;
      last = module.last;
      combineLatestWith = module.combineLatestWith;
      skip$1 = module.skip;
      tap = module.tap;
      distinctUntilKeyChanged = module.distinctUntilKeyChanged;
      distinctUntilChanged = module.distinctUntilChanged;
    }, function (module) {
      map$1 = module.map;
      filter = module.filter;
      share$1 = module.share;
      skip = module.skip;
      delay = module.delay;
    }, function (module) {
      ajax = module.ajax;
    }, function (module) {
      ReactDOM = module["default"];
    }],
    execute: (function () {

      exports('SchemaRender', SchemaRender);

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
      var Action;

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
      })(Action || (Action = {}));

      var readOnly = function (obj) {
        return obj;
      };

      var BeforeUnloadEventType = 'beforeunload';
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

      var __defProp$2 = Object.defineProperty;
      var __defProps$2 = Object.defineProperties;
      var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
      var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
      var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$2 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$2.call(b, prop))
            __defNormalProp$2(a, prop, b[prop]);
        if (__getOwnPropSymbols$2)
          for (var prop of __getOwnPropSymbols$2(b)) {
            if (__propIsEnum$2.call(b, prop))
              __defNormalProp$2(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
      function getAPIStates(statesHubAPI) {
        const handler = {
          get: (target, p) => {
            const apiState = statesHubAPI.getState$(p).getValue();
            return __spreadProps$2(__spreadValues$2({}, apiState), {
              fetch: (fetchParams, callback) => {
                statesHubAPI.fetch(p, { params: fetchParams, callback });
              },
              refresh: () => statesHubAPI.refresh(p)
            });
          }
        };
        return new Proxy({}, handler);
      }

      function isObject(n) {
        return Object.prototype.toString.call(n) === "[object Object]";
      }
      function isFuncSpec(n) {
        if (!isObject(n) || typeof n !== "object" || n === null) {
          return false;
        }
        if ("type" in n && Reflect.get(n, "type") === "state_convert_expression") {
          return true;
        }
        if (Object.keys(n).length === 3 && "type" in n && "args" in n && "body" in n) {
          return true;
        }
        return false;
      }
      function instantiateStateExpression(expression, ctx) {
        try {
          const fn = new Function("state", `return ${expression}`).bind(ctx);
          fn.toString = () => ["", "function wrappedStateConvertor(state) {", `	return ${expression}`, "}"].join("\n");
          return fn;
        } catch (error) {
          throw new Error(["failed to instantiate state convert expression:", "\n", expression, "\n", error].join(""));
        }
      }
      function instantiateFuncSpec(spec, ctx) {
        if ("expression" in spec && spec.type === "state_convert_expression") {
          return instantiateStateExpression(spec.expression, ctx);
        }
        try {
          const fn = new Function(spec.args, spec.body).bind(ctx);
          fn.toString = () => ["", `function wrappedFunc(${spec.args}) {`, `	${spec.body}`, "}", ""].join("\n");
          return fn;
        } catch (error) {
          throw new Error([
            "failed to instantiate function of following spec:",
            "\n",
            "spec.args:",
            spec.args,
            "\n",
            "spec.body:",
            "\n",
            spec.body,
            "\n",
            error
          ].join(""));
        }
      }

      function instantiate(n, ctx) {
        if (!isObject(n) || typeof n !== "object" || n === null) {
          return n;
        }
        Object.entries(n).forEach(([key, v]) => {
          if (isFuncSpec(v)) {
            Reflect.set(n, key, instantiateFuncSpec(v, ctx));
            return;
          }
          if (isObject(v)) {
            Reflect.set(n, key, instantiate(v, ctx));
            return;
          }
          if (Array.isArray(v)) {
            Reflect.set(n, key, v.map((_v) => instantiate(_v, ctx)));
            return;
          }
        });
        return n;
      }

      function deserialize(n, ctx) {
        try {
          return instantiate(JSON.parse(JSON.stringify(n)), ctx);
        } catch (error) {
          logger.error(error);
          return null;
        }
      }

      function sendRequest(ajaxRequest) {
        return ajax(ajaxRequest).pipe(map(({ response }) => ({ result: response, error: void 0 })), catchError((error) => {
          return of({ error, data: void 0 });
        }));
      }
      function http(request$) {
        const response$ = request$.pipe(switchMap(sendRequest), share());
        return response$;
      }

      var __defProp$1 = Object.defineProperty;
      var __defProps$1 = Object.defineProperties;
      var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
      var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
      var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$1 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$1.call(b, prop))
            __defNormalProp$1(a, prop, b[prop]);
        if (__getOwnPropSymbols$1)
          for (var prop of __getOwnPropSymbols$1(b)) {
            if (__propIsEnum$1.call(b, prop))
              __defNormalProp$1(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
      const initialState = { result: void 0, error: void 0, loading: false };
      function getResponseState$(request$, responseAdapter) {
        const state$ = new BehaviorSubject(initialState);
        const response$ = http(request$);
        response$.pipe(map$1(({ result, error }) => ({ result, error, loading: false })), map$1((apiState) => {
          if (!responseAdapter) {
            return apiState;
          }
          const transformed = responseAdapter({ body: apiState.result, error: apiState.error });
          return __spreadProps$1(__spreadValues$1({}, transformed), { loading: apiState.loading });
        })).subscribe(state$);
        request$.pipe(filter(() => state$.getValue().loading === false), map$1(() => __spreadProps$1(__spreadValues$1({}, state$.getValue()), { loading: true }))).subscribe(state$);
        return state$;
      }

      function initAPIState(apiID, apiSpecAdapter) {
        const params$ = new Subject();
        const request$ = params$.pipe(map$1((params) => apiSpecAdapter.build(apiID, params)), filter(Boolean), share$1());
        let _latestFetchOption = void 0;
        const apiState$ = getResponseState$(request$, apiSpecAdapter.responseAdapter);
        apiState$.pipe(skip(1), filter(({ loading }) => !loading), delay(10)).subscribe((state) => {
          var _a;
          (_a = _latestFetchOption == null ? void 0 : _latestFetchOption.callback) == null ? void 0 : _a.call(_latestFetchOption, state);
        });
        return {
          state$: apiState$,
          fetch: (fetchOption) => {
            _latestFetchOption = fetchOption;
            params$.next(fetchOption.params);
          },
          refresh: () => {
            if (!_latestFetchOption) {
              return;
            }
            _latestFetchOption = { params: _latestFetchOption.params };
            params$.next(_latestFetchOption.params);
          }
        };
      }

      const dummyState$WithAction = {
        state$: new BehaviorSubject(initialState),
        fetch: noop,
        refresh: noop
      };
      const dummyAPISpecAdapter = {
        build: () => ({ url: "/api", method: "get" })
      };
      class Hub$1 {
        constructor({ apiStateSpec, apiSpecAdapter }, parentHub) {
          this.parentHub = void 0;
          this.parentHub = parentHub;
          this.cache = Object.entries(apiStateSpec).reduce((acc, [stateID, { apiID }]) => {
            acc[stateID] = initAPIState(apiID, apiSpecAdapter || dummyAPISpecAdapter);
            return acc;
          }, {});
        }
        hasState$(stateID) {
          var _a;
          if (this.cache[stateID]) {
            return true;
          }
          return !!((_a = this.parentHub) == null ? void 0 : _a.hasState$(stateID));
        }
        findState$(stateID) {
          var _a;
          if (this.cache[stateID]) {
            return this.cache[stateID];
          }
          return (_a = this.parentHub) == null ? void 0 : _a.findState$(stateID);
        }
        getState$(stateID) {
          const { state$ } = this.findState$(stateID) || {};
          if (state$) {
            return state$;
          }
          logger.error([
            `can't find api state: ${stateID}, please check apiStateSpec or parent schema.`,
            "In order to prevent UI crash, a dummyState$ will be returned."
          ].join(" "));
          return dummyState$WithAction.state$;
        }
        fetch(stateID, fetchOption) {
          const { fetch } = this.findState$(stateID) || {};
          if (fetch) {
            fetch(fetchOption);
            return;
          }
          logger.error([
            `can't find api state: ${stateID}, please check apiStateSpec or parent schema,`,
            "this fetch action will be ignored."
          ].join(" "));
        }
        refresh(stateID) {
          const { refresh } = this.findState$(stateID) || {};
          if (refresh) {
            refresh();
            return;
          }
          logger.error([
            `can't find api state: ${stateID}, please check apiStateSpec or parent schema,`,
            "this refresh action will be ignored."
          ].join(" "));
        }
      }

      function getSharedStates(statesHubShared) {
        const handler = {
          get: (target, p) => {
            return statesHubShared.getState$(p).value;
          },
          set: (target, p, value) => {
            if (p.startsWith("$")) {
              logger.error("node internal state can not be assigned");
              return false;
            }
            statesHubShared.mutateState(p, value);
            return true;
          }
        };
        return new Proxy({}, handler);
      }

      class Hub {
        constructor(spec, parentHub) {
          this.parentHub = void 0;
          this.unWriteableStates = [];
          this.parentHub = parentHub;
          this.cache = Object.entries(spec).reduce((acc, [stateID, { initial, writeable }]) => {
            acc[stateID] = new BehaviorSubject(initial);
            if (writeable === false) {
              this.unWriteableStates.push(stateID);
            }
            return acc;
          }, {});
        }
        hasState$(stateID) {
          var _a;
          if (this.cache[stateID]) {
            return true;
          }
          return !!((_a = this.parentHub) == null ? void 0 : _a.hasState$(stateID));
        }
        _createState$(stateID, initialValue) {
          this.cache[stateID] = new BehaviorSubject(initialValue);
        }
        findState$(stateID) {
          var _a;
          if (this.cache[stateID]) {
            return this.cache[stateID];
          }
          return (_a = this.parentHub) == null ? void 0 : _a.findState$(stateID);
        }
        getState$(stateID) {
          const state$ = this.findState$(stateID);
          if (state$) {
            return state$;
          }
          this._createState$(stateID);
          return this.cache[stateID];
        }
        mutateState(stateID, state) {
          if (stateID.startsWith("$")) {
            logger.warn("shared stateID can not starts with $, this action will be ignored");
            return;
          }
          if (this.unWriteableStates.includes(stateID)) {
            logger.warn("this shared state is not allowed to be written, this action will be ignored");
            return;
          }
          this.getState$(stateID).next(state);
        }
        getNodeState$(nodePath) {
          const stateID = `$${nodePath}`;
          return this.getState$(stateID);
        }
        exposeNodeState(nodePath, state) {
          const stateID = `$${nodePath}`;
          if (this.cache[stateID]) {
            this.cache[stateID].next(state);
            return;
          }
          this._createState$(stateID, state);
        }
      }

      var __defProp = Object.defineProperty;
      var __defProps = Object.defineProperties;
      var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols = Object.getOwnPropertySymbols;
      var __hasOwnProp = Object.prototype.hasOwnProperty;
      var __propIsEnum = Object.prototype.propertyIsEnumerable;
      var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp.call(b, prop))
            __defNormalProp(a, prop, b[prop]);
        if (__getOwnPropSymbols)
          for (var prop of __getOwnPropSymbols(b)) {
            if (__propIsEnum.call(b, prop))
              __defNormalProp(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
      function toDependency$(apiSpecAdapter, apiID, params) {
        const { state$, fetch } = initAPIState(apiID, apiSpecAdapter);
        const dependency$ = state$.pipe(take(2), last(), map(({ result }) => result));
        fetch({ params });
        return dependency$;
      }
      function toDeps$(deps, apiStates, apiSpecAdapter) {
        const dependencies$ = Object.entries(deps).map(([stateID, fetchParams]) => {
          if (!apiStates[stateID]) {
            logger.error(`no state: ${stateID} found in APIStatesSpec, undefined will be used as this dependency value`);
            return void 0;
          }
          const { apiID } = apiStates[stateID];
          return [stateID, toDependency$(apiSpecAdapter, apiID, fetchParams)];
        }).filter((pair) => !!pair).reduce((acc, [stateID, dependency$]) => {
          acc[stateID] = dependency$;
          return acc;
        }, {});
        if (!Object.keys(dependencies$).length) {
          return of({});
        }
        return combineLatest(dependencies$);
      }
      function promisify(func) {
        return (p) => {
          return Promise.resolve((() => {
            try {
              return func(p);
            } catch (error) {
              return void 0;
            }
          })());
        };
      }
      function toObservableMap(lazyStates, apiStateSpec, apiSpecAdapter) {
        return lazyStates.map(({ stateID, func, dependencies }) => {
          const deps$ = toDeps$(dependencies || {}, apiStateSpec, apiSpecAdapter);
          const state$ = deps$.pipe(switchMap((deps) => {
            return from(promisify(func)(deps));
          }));
          return [stateID, state$];
        }).reduce((acc, [stateID, state$]) => {
          acc[stateID] = state$;
          return acc;
        }, {});
      }
      function filterLazyStates(sharedStateSpec) {
        return Object.entries(sharedStateSpec).map(([stateID, { initializer }]) => {
          if (initializer) {
            return __spreadProps(__spreadValues({}, initializer), { stateID });
          }
          return;
        }).filter((lazyState) => !!lazyState);
      }
      async function initializeLazyStates(sharedStateSpec, apiStateSpec, apiSpecAdapter) {
        if (!apiSpecAdapter) {
          return sharedStateSpec;
        }
        const lazyStates = filterLazyStates(sharedStateSpec);
        const obsStateMap = toObservableMap(lazyStates, apiStateSpec, apiSpecAdapter);
        if (!Object.keys(obsStateMap).length) {
          return sharedStateSpec;
        }
        const lazyStatesMap = await firstValueFrom(combineLatest(obsStateMap));
        Object.entries(lazyStatesMap).forEach(([stateID, value]) => {
          sharedStateSpec[stateID].initial = value;
        });
        return sharedStateSpec;
      }

      async function initCTX({ schema, parentCTX, plugins }) {
        var _a, _b, _c;
        const { apiStateSpec, sharedStatesSpec } = schema;
        const { apiSpecAdapter, repository, refLoader, componentLoader } = plugins || {};
        const statesHubAPI = new Hub$1({
          apiSpecAdapter,
          apiStateSpec: apiStateSpec || {}
        }, parentCTX == null ? void 0 : parentCTX.statesHubAPI);
        const instantiateSpec = deserialize(sharedStatesSpec || {}, void 0);
        const initializedState = await initializeLazyStates(instantiateSpec || {}, apiStateSpec || {}, apiSpecAdapter);
        const statesHubShared = new Hub(initializedState, parentCTX == null ? void 0 : parentCTX.statesHubShared);
        const history = (parentCTX == null ? void 0 : parentCTX.history) || createBrowserHistory();
        const location$ = (parentCTX == null ? void 0 : parentCTX.location$) || new BehaviorSubject(history.location);
        if (!(parentCTX == null ? void 0 : parentCTX.location$)) {
          history.listen(({ location }) => {
            location$.next(location);
          });
        }
        const ctx = {
          statesHubAPI,
          statesHubShared,
          apiStates: getAPIStates(statesHubAPI),
          states: getSharedStates(statesHubShared),
          history,
          location$,
          plugins: {
            repository: repository || ((_a = parentCTX == null ? void 0 : parentCTX.plugins) == null ? void 0 : _a.repository),
            refLoader: refLoader || ((_b = parentCTX == null ? void 0 : parentCTX.plugins) == null ? void 0 : _b.refLoader),
            componentLoader: componentLoader || ((_c = parentCTX == null ? void 0 : parentCTX.plugins) == null ? void 0 : _c.componentLoader)
          }
        };
        const rootNode = deserialize(schema.node, { apiStates: ctx.apiStates, states: ctx.states, history: ctx.history });
        return { ctx, rootNode };
      }

      const PathContext = React.createContext("ROOT");

      function useConstantProps(node) {
        if (!node.props) {
          return {};
        }
        return Object.entries(node.props).filter((pair) => {
          return pair[1].type === "constant_property";
        }).reduce((acc, [key, { value }]) => {
          acc[key] = value;
          return acc;
        }, {});
      }

      function convertState({ state, convertor, fallback, propName }) {
        var _a;
        if (convertor && state !== void 0) {
          try {
            return (_a = convertor(state)) != null ? _a : fallback;
          } catch (error) {
            logger.error(`an error occurred while calling state convertor for prop: "${propName}"`, "with the following state and convertor:", "\n", state, "\n", convertor.toString(), "\n", "So return fallback instead, fallback:", fallback, "\n", "\n", error);
            return fallback;
          }
        }
        return state != null ? state : fallback;
      }
      function getComputedState$({
        propName,
        deps,
        convertor,
        ctx,
        fallback
      }) {
        let _fallback = fallback;
        const deps$ = deps.map(({ type, depID }) => {
          if (type === "api_state") {
            return ctx.statesHubAPI.getState$(depID);
          }
          if (type === "node_state") {
            return ctx.statesHubShared.getNodeState$(depID);
          }
          return ctx.statesHubShared.getState$(depID);
        });
        const initialDeps = deps$.map((dep$) => dep$.value);
        const state$ = new BehaviorSubject(convertState({
          state: initialDeps,
          convertor,
          fallback,
          propName
        }));
        of(true).pipe(combineLatestWith(deps$), map((_, ..._dep) => {
          return convertState({
            state: _dep,
            convertor,
            fallback: _fallback,
            propName
          });
        }), skip$1(1), tap((state) => {
          _fallback = state;
        })).subscribe((state) => state$.next(state));
        return state$;
      }

      function useAPIResultProps(node, ctx) {
        const adapters = {};
        const states$ = {};
        const initialFallbacks = {};
        Object.entries(node.props || {}).filter((pair) => {
          return pair[1].type === "api_result_property";
        }).forEach(([propName, { fallback, convertor: adapter, stateID }]) => {
          initialFallbacks[propName] = fallback;
          adapters[propName] = adapter;
          states$[propName] = ctx.statesHubAPI.getState$(stateID);
        });
        const fallbacksRef = useRef(initialFallbacks);
        const [state, setState] = useState(() => {
          return Object.entries(states$).reduce((acc, [key, state$]) => {
            acc[key] = convertState({
              state: state$.getValue().result,
              convertor: adapters[key],
              fallback: fallbacksRef.current[key],
              propName: key
            });
            return acc;
          }, {});
        });
        useEffect(() => {
          const results$ = Object.entries(states$).reduce((acc, [key, state$]) => {
            acc[key] = state$.pipe(distinctUntilKeyChanged("result"), map(({ result }) => {
              return convertState({
                state: result,
                convertor: adapters[key],
                fallback: fallbacksRef.current[key],
                propName: key
              });
            }), tap((result) => {
              fallbacksRef.current[key] = result;
            }));
            return acc;
          }, {});
          const subscription = combineLatest(results$).pipe(skip$1(1)).subscribe(setState);
          return () => subscription.unsubscribe();
        }, []);
        return state;
      }

      function useAPILoadingProps(node, ctx) {
        const states$ = {};
        Object.entries(node.props || {}).filter((pair) => {
          return pair[1].type === "api_loading_property";
        }).forEach(([propName, { stateID }]) => {
          states$[propName] = ctx.statesHubAPI.getState$(stateID);
        });
        const [state, setState] = useState(() => {
          return Object.entries(states$).reduce((acc, [key, state$]) => {
            acc[key] = state$.getValue().loading;
            return acc;
          }, {});
        });
        useEffect(() => {
          const results$ = Object.entries(states$).reduce((acc, [key, state$]) => {
            acc[key] = state$.pipe(skip$1(1), distinctUntilKeyChanged("loading"), map(({ loading }) => loading));
            return acc;
          }, {});
          const subscription = combineLatest(results$).subscribe(setState);
          return () => subscription.unsubscribe();
        }, []);
        return state;
      }

      function useAPIInvokeProps(node, ctx) {
        return useMemo(() => {
          if (!node.props) {
            return {};
          }
          return Object.entries(node.props).filter((pair) => {
            return pair[1].type === "api_invoke_property";
          }).reduce((acc, [propName, { stateID, paramsBuilder, callback }]) => {
            logger.warn("hook useAPIInvokeProps has been deprecated, please use hook useFuncProps instead");
            function handleAction(...args) {
              try {
                const fetchParams = (paramsBuilder == null ? void 0 : paramsBuilder(...args)) || {};
                ctx.apiStates[stateID].fetch(fetchParams, callback);
              } catch (error) {
                logger.log("failed to run convertor or run action:", error);
              }
            }
            acc[propName] = handleAction;
            return acc;
          }, {});
        }, []);
      }

      function useSharedStateProps(node, ctx) {
        const convertors = {};
        const states$ = {};
        const initialFallbacks = {};
        Object.entries(node.props || {}).filter((pair) => {
          return pair[1].type === "shared_state_property" || pair[1].type === "node_state_property";
        }).forEach(([key, propSpec]) => {
          if (propSpec.type === "shared_state_property") {
            states$[key] = ctx.statesHubShared.getState$(propSpec.stateID);
            convertors[key] = propSpec.convertor;
          } else {
            states$[key] = ctx.statesHubShared.getNodeState$(propSpec.nodePath);
            convertors[key] = propSpec.convertor;
          }
          initialFallbacks[key] = propSpec.fallback;
        });
        const fallbacksRef = useRef(initialFallbacks);
        const [state, setState] = useState(() => {
          return Object.entries(states$).reduce((acc, [key, state$]) => {
            acc[key] = convertState({
              state: state$.getValue(),
              convertor: convertors[key],
              fallback: fallbacksRef.current[key],
              propName: key
            });
            return acc;
          }, {});
        });
        useEffect(() => {
          if (!Object.keys(states$).length) {
            return;
          }
          const results$ = Object.entries(states$).reduce((acc, [key, state$]) => {
            acc[key] = state$.pipe(distinctUntilChanged(), map((result) => {
              return convertState({
                state: result,
                convertor: convertors[key],
                fallback: fallbacksRef.current[key],
                propName: key
              });
            }), tap((result) => {
              fallbacksRef.current[key] = result;
            }));
            return acc;
          }, {});
          const subscription = combineLatest(results$).pipe(skip$1(1)).subscribe(setState);
          return () => subscription.unsubscribe();
        }, []);
        return state;
      }

      function useFuncProps(node) {
        return useMemo(() => {
          if (!node.props) {
            return {};
          }
          return Object.entries(node.props).filter((pair) => {
            return pair[1].type === "functional_property";
          }).reduce((acc, [key, { func }]) => {
            acc[key] = (...args) => {
              try {
                func(...args);
              } catch (error) {
                logger.error(`an error occurred while run node '${node.id}' functional property:`, key, "with the following arguments:", "\n", args, "\n", "function is:", "\n", func.toString(), "\n", error);
              }
            };
            return acc;
          }, {});
        }, []);
      }

      function useSharedStateMutationProps(node, ctx) {
        return useMemo(() => {
          if (!node.props) {
            return {};
          }
          return Object.entries(node.props).filter((pair) => {
            return pair[1].type === "shared_state_mutation_property";
          }).reduce((acc, [key, { stateID, convertor }]) => {
            function mutation(state) {
              if (typeof convertor !== "function") {
                ctx.statesHubShared.mutateState(stateID, state);
                return;
              }
              try {
                const v = convertor(state);
                ctx.statesHubShared.mutateState(stateID, v);
              } catch (error) {
                logger.error("failed to run convertor:\n", convertor.toString(), "\n", error);
              }
            }
            acc[key] = mutation;
            return acc;
          }, {});
        }, []);
      }

      function useInternalHookProps(node, ctx) {
        const parentPath = useContext(PathContext);
        return useMemo(() => {
          if ("supportStateExposure" in node && node.supportStateExposure) {
            return {
              __exposeState: (state) => {
                ctx.statesHubShared.exposeNodeState(`${parentPath}/${node.id}`, state);
              }
            };
          }
          return {};
        }, []);
      }

      function buildRender(node, ctx, adapter) {
        return (...args) => {
          let constantProps = {};
          try {
            const customProps = (adapter == null ? void 0 : adapter(...args)) || {};
            if (typeof customProps === "object") {
              constantProps = Object.entries(customProps).reduce((acc, [key, value]) => {
                acc[key] = { type: "constant_property", value };
                return acc;
              }, {});
            } else {
              logger.error("toProps result is no Object");
            }
          } catch (error) {
            logger.error("failed to call toProps", error);
          }
          node.props = Object.assign({}, node.props, constantProps);
          return React.createElement(NodeRender, { node, ctx });
        };
      }
      function useRenderProps({ props }, ctx) {
        return useMemo(() => {
          return Object.entries(props || {}).filter((pair) => {
            return pair[1].type === "render_property";
          }).reduce((acc, [propName, { adapter, node }]) => {
            acc[propName] = buildRender(node, ctx, adapter);
            return acc;
          }, {});
        }, []);
      }

      function useComputedProps(node, ctx) {
        const states$ = {};
        Object.entries(node.props || {}).filter((pair) => {
          return pair[1].type === "computed_property";
        }).forEach(([propName, { deps, convertor, fallback }]) => {
          states$[propName] = getComputedState$({ propName, deps, convertor, ctx, fallback });
        });
        const [states, setStates] = useState(() => {
          return Object.entries(states$).reduce((acc, [key, state$]) => {
            acc[key] = state$.value;
            return acc;
          }, {});
        });
        useEffect(() => {
          const subscriptions = combineLatest(states$).pipe(skip$1(1)).subscribe(setStates);
          return () => subscriptions.unsubscribe();
        }, []);
        return states;
      }

      function useLinkProps(node, ctx) {
        if ("isLink" in node && node.isLink && node.type === "html-element" && node.name === "a") {
          return {
            onClick: (e) => {
              e.stopPropagation();
              e.preventDefault();
              const href = e.currentTarget.href;
              if (!href) {
                return;
              }
              ctx.history.push(href);
            }
          };
        }
        return {};
      }

      function useInstantiateProps(node, ctx) {
        const constantProps = useConstantProps(node);
        const apiResultProps = useAPIResultProps(node, ctx);
        const apiLoadingProps = useAPILoadingProps(node, ctx);
        const sharedStateProps = useSharedStateProps(node, ctx);
        const internalHookProps = useInternalHookProps(node, ctx);
        const computedProps = useComputedProps(node, ctx);
        const funcProps = useFuncProps(node);
        const sharedStateMutationProps = useSharedStateMutationProps(node, ctx);
        const apiStateInvokeProps = useAPIInvokeProps(node, ctx);
        const renderProps = useRenderProps(node, ctx);
        const linkProps = useLinkProps(node, ctx);
        return useMemo(() => {
          return Object.assign(constantProps, apiStateInvokeProps, apiResultProps, apiLoadingProps, sharedStateProps, computedProps, funcProps, sharedStateMutationProps, internalHookProps, renderProps, linkProps);
        }, [apiResultProps, sharedStateProps, apiLoadingProps, computedProps, constantProps]);
      }

      function useLifecycleHook({ didMount, willUnmount }) {
        useEffect(() => {
          if (didMount) {
            didMount();
          }
          return () => {
            willUnmount == null ? void 0 : willUnmount();
          };
        }, []);
      }
      function useRefResult({ schemaID, refLoader, orphan }, ctx) {
        const [result, setResult] = useState();
        const currentPath = useContext(PathContext);
        useEffect(() => {
          if (!schemaID) {
            logger.error(`schemaID is required on RefNode, please check the spec for node: ${currentPath}`);
            return;
          }
          if (!refLoader) {
            logger.error("refLoader is required on RefNode in order to get ref schema and corresponding APISpecAdapter,", "please implement refLoader and pass it to parent RenderEngine.", `current RefNode path is: ${currentPath}`);
            return;
          }
          let unMounting = false;
          let _schema;
          refLoader(schemaID).then(({ schema, plugins }) => {
            if (unMounting) {
              return;
            }
            _schema = schema;
            return initCTX({
              plugins,
              schema,
              parentCTX: orphan ? void 0 : ctx
            });
          }).then((refCTX) => {
            if (!refCTX || !_schema) {
              return;
            }
            setResult({ refCTX: refCTX.ctx, refNode: refCTX.rootNode });
          }).catch((err) => {
            logger.error(err);
          });
          return () => {
            unMounting = true;
          };
        }, []);
        return result;
      }
      function useShouldRender(node, ctx) {
        const condition = node.shouldRender;
        const placeholderNode = {
          id: "placeholder-node",
          type: "html-element",
          name: "div",
          props: condition ? { shouldRender: condition } : void 0
        };
        const { shouldRender } = useInstantiateProps(placeholderNode, ctx);
        if (!condition) {
          return true;
        }
        if (condition.type === "api_loading_property") {
          return condition.revert ? !shouldRender : !!shouldRender;
        }
        return !!shouldRender;
      }

      function useReactJSXParser() {
        const [com, setComponent] = useState(null);
        useEffect(() => {
          let unMounting = false;
          System.import("react-jsx-parser").then((module) => {
            if (unMounting) {
              return;
            }
            setComponent(() => module.default);
          }).catch((err) => {
            logger.error("failed to load dependance react-jsx-parser:", err);
            return;
          });
          return () => {
            unMounting = true;
          };
        });
        return com;
      }
      function JSXNodeRender({ node, ctx }) {
        const props = useInstantiateProps(node, ctx);
        useLifecycleHook(node.lifecycleHooks || {});
        const currentPath = useContext(PathContext);
        const ReactJSXParser = useReactJSXParser();
        if (!node.jsx) {
          logger.error("jsx string is required,", `please check the spec of node: ${currentPath}.`);
          return null;
        }
        if (!ReactJSXParser) {
          return null;
        }
        return React.createElement(ReactJSXParser, {
          bindings: props,
          renderInWrapper: false,
          jsx: node.jsx,
          onError: (err) => console.log(err)
        });
      }

      function RefNodeRender({ node, ctx }) {
        useLifecycleHook(node.lifecycleHooks || {});
        const refResult = useRefResult({ schemaID: node.schemaID, refLoader: ctx.plugins.refLoader, orphan: node.orphan }, ctx);
        if (!refResult) {
          if (node.fallback) {
            return React.createElement(NodeRender, { node: node.fallback, ctx });
          }
          return null;
        }
        return React.createElement(NodeRender, { node: refResult.refNode, ctx: refResult.refCTX });
      }

      function HTMLNodeRender({ node, ctx }) {
        const props = useInstantiateProps(node, ctx);
        useLifecycleHook(node.lifecycleHooks || {});
        const currentPath = useContext(PathContext);
        if (!node.name) {
          logger.error("name property is required in html node spec,", `please check the spec of node: ${currentPath}.`);
          return null;
        }
        if (!node.children || !node.children.length) {
          return React.createElement(node.name, props);
        }
        return React.createElement(node.name, props, React.createElement(ChildrenRender, { nodes: node.children || [], ctx }));
      }

      function useIterable(iterableState, ctx) {
        const currentPath = useContext(PathContext);
        const dummyNode = {
          type: "html-element",
          id: "dummyLoopContainer",
          name: "div",
          props: { iterable: iterableState }
        };
        const { iterable } = useInstantiateProps(dummyNode, ctx);
        if (!Array.isArray(iterable)) {
          const nodeID = currentPath.split("/").pop();
          logger.error("state is not iterable.", `LoopContainer node [${nodeID}] require a array type state,`, `but got: ${iterable},`, "please check the follow property spec:\n", iterableState);
          return null;
        }
        return iterable;
      }
      function getAppropriateKey(item, loopKey, index) {
        if (typeof item === "string" || typeof item === "number") {
          return item;
        }
        if (typeof item === "undefined" || typeof item === "function" || typeof item === "boolean") {
          return index;
        }
        if (typeof item === "object" && item !== null) {
          return Reflect.get(item, loopKey);
        }
        return index;
      }
      function tryToProps(source, index, toProps, currentPath) {
        try {
          const toPropsResult = toProps(source, index);
          if (typeof toPropsResult !== "object" && !toPropsResult) {
            logger.error("toProps result should be an object, but got: ${toPropsResult},", `please check the toProps spec of node: ${currentPath},`, "the corresponding node will be skipped for render.");
            return null;
          }
          return toPropsResult;
        } catch (error) {
          logger.error("An error occurred while calling toProps with the following parameter:", source, "\n", `please check the toProps spec of node: ${currentPath},`, "the corresponding node will be skipped for render.");
          return null;
        }
      }
      function useMergedPropsList({
        iterableState,
        toProps,
        otherProps,
        ctx,
        loopKey
      }) {
        const iterable = useIterable(iterableState, ctx);
        const currentPath = useContext(PathContext);
        if (!iterable) {
          return null;
        }
        return iterable.map((item, index) => {
          const convertedProps = tryToProps(item, index, toProps, currentPath);
          if (!convertedProps) {
            return null;
          }
          const constProps = Object.entries(convertedProps).reduce((constProps2, [propName, value]) => {
            constProps2[propName] = { type: "constant_property", value };
            return constProps2;
          }, {});
          return [getAppropriateKey(item, loopKey, index), Object.assign({}, otherProps, constProps)];
        }).filter((pair) => !!pair);
      }
      function useComposedPropsSpec(composedState, toProps, index, otherProps) {
        const currentPath = useContext(PathContext);
        return useMemo(() => {
          const composedProps = tryToProps(composedState, index, toProps, currentPath);
          const composedPropsSpec = Object.entries(composedProps || {}).reduce((acc, [key, value]) => {
            acc[key] = {
              type: "constant_property",
              value
            };
            return acc;
          }, {});
          return Object.assign({}, otherProps, composedPropsSpec);
        }, [composedState, otherProps]);
      }

      function LoopIndividual({ iterableState, loopKey, node, ctx, toProps }) {
        const parentPath = useContext(PathContext);
        const mergedPropsList = useMergedPropsList({
          iterableState,
          toProps,
          ctx,
          loopKey,
          otherProps: node.props
        });
        if (!mergedPropsList) {
          return null;
        }
        return React.createElement(React.Fragment, null, mergedPropsList.map(([key, props], index) => {
          const newNode = Object.assign({}, node, { props });
          return React.createElement(PathContext.Provider, { value: `${parentPath}/${index}`, key }, React.createElement(NodeRender, { key, node: newNode, ctx }));
        }));
      }

      function findComponentInRepository(repository, { packageName, packageVersion, exportName }) {
        var _a;
        const packageNameVersion = `${packageName}@${packageVersion}`;
        return (_a = repository[packageNameVersion]) == null ? void 0 : _a[exportName || "default"];
      }
      function systemComponentLoader({
        packageName,
        exportName
      }) {
        return System.import(packageName).then((systemModule) => {
          return systemModule[exportName || "default"];
        }).catch((error) => {
          logger.error("failed to load node component,", error);
          return null;
        });
      }

      function useNodeComponent(node, { repository, componentLoader }) {
        const currentPath = useContext(PathContext);
        const [lazyLoadedComponent, setComponent] = useState(() => {
          if (!repository) {
            return;
          }
          return findComponentInRepository(repository, node);
        });
        useEffect(() => {
          if (lazyLoadedComponent) {
            return;
          }
          let unMounting = false;
          const finialLoader = componentLoader || systemComponentLoader;
          finialLoader({
            packageName: node.packageName,
            packageVersion: node.packageVersion,
            exportName: node.exportName
          }).then((comp) => {
            if (unMounting) {
              return;
            }
            if (!comp) {
              logger.error(`got empty component for package: ${node.packageName},`, `exportName: ${node.exportName}, version: ${node.packageVersion}`, `please check the spec for node: ${currentPath}.`);
              return;
            }
            setComponent(() => comp);
          }).catch(logger.error);
          return () => {
            unMounting = true;
          };
        }, [lazyLoadedComponent]);
        return lazyLoadedComponent;
      }

      function HTMLOutLayerRender({ outLayer, ctx, children }) {
        const props = useInstantiateProps(outLayer, ctx);
        return React.createElement(outLayer.name, props, children);
      }
      function ReactComponentOutLayerRender({
        outLayer,
        ctx,
        children
      }) {
        const props = useInstantiateProps(outLayer, ctx);
        const nodeComponent = useNodeComponent(outLayer, ctx.plugins);
        useLifecycleHook(outLayer.lifecycleHooks || {});
        if (!nodeComponent) {
          return null;
        }
        return React.createElement(nodeComponent, props, children);
      }
      function OutLayerRender({ outLayer, ctx, children }) {
        if ((outLayer == null ? void 0 : outLayer.type) === "html-element") {
          return React.createElement(HTMLOutLayerRender, { outLayer, ctx }, children);
        }
        if ((outLayer == null ? void 0 : outLayer.type) === "react-component") {
          return React.createElement(ReactComponentOutLayerRender, { outLayer, ctx }, children);
        }
        return React.createElement(React.Fragment, null, children);
      }

      function ComposedChildRender({
        node,
        composedState,
        ctx,
        index
      }) {
        const propSpec = useComposedPropsSpec(composedState, node.toProps, index, node.props);
        const _node = Object.assign({}, node, { props: propSpec });
        return React.createElement(NodeRender, { node: _node, ctx });
      }
      function LoopComposed({ iterableState, loopKey, node, ctx }) {
        const parentPath = useContext(PathContext);
        const iterable = useIterable(iterableState, ctx);
        if (!iterable) {
          return null;
        }
        return React.createElement(React.Fragment, null, iterable.map((composedState, index) => {
          const key = getAppropriateKey(composedState, loopKey, index);
          return React.createElement(PathContext.Provider, { value: `${parentPath}/${index}`, key: index }, React.createElement(OutLayerRender, { key, outLayer: node.outLayer, ctx }, (node.nodes || node.children).map((composedChild, index2) => {
            return React.createElement(ComposedChildRender, {
              node: composedChild,
              composedState,
              ctx,
              index: index2,
              key: composedChild.id
            });
          })));
        }));
      }

      function LoopNodeRender({ node, ctx }) {
        useLifecycleHook(node.lifecycleHooks || {});
        const { node: LoopNode } = node;
        if (LoopNode.type !== "composed-node" && "toProps" in node) {
          return React.createElement(LoopIndividual, {
            iterableState: node.iterableState,
            loopKey: node.loopKey,
            node: LoopNode,
            toProps: (v) => node.toProps(v),
            ctx
          });
        }
        if (LoopNode.type === "composed-node") {
          return React.createElement(LoopComposed, {
            iterableState: node.iterableState,
            loopKey: node.loopKey,
            node: LoopNode,
            ctx
          });
        }
        logger.error("Unrecognized loop node:", node);
        return null;
      }

      const RouteContext = React.createContext("/");

      function trimSlash(path) {
        return path.replace(/^\/|\/$/g, "");
      }
      function isParamHolder(fragment) {
        return /^:[a-zA-Z_][[a-zA-Z_$0-9]+$/.test(fragment);
      }

      function exactlyCheck(path, currentRoutePath) {
        const pathFragments = path.split("/");
        const routeFragments = currentRoutePath.split("/");
        if (pathFragments.length !== routeFragments.length) {
          return false;
        }
        return pathFragments.every((fragment, index) => {
          if (isParamHolder(routeFragments[index])) {
            return true;
          }
          return fragment === routeFragments[index];
        });
      }
      function prefixCheck(path, currentRoutePath) {
        const pathFragments = path.split("/");
        const routeFragments = currentRoutePath.split("/");
        if (pathFragments.length < routeFragments.length) {
          return false;
        }
        return routeFragments.every((fragment, index) => {
          if (isParamHolder(fragment)) {
            return true;
          }
          return fragment === pathFragments[index];
        });
      }
      function useMatch(location$, currentRoutePath, exactly) {
        const [match, setMatch] = useState(false);
        useEffect(() => {
          const subscribe = location$.pipe(map(({ pathname }) => {
            return exactly ? exactlyCheck(pathname, currentRoutePath) : prefixCheck(pathname, currentRoutePath);
          }), distinctUntilChanged()).subscribe(setMatch);
          return () => subscribe.unsubscribe();
        }, []);
        return match;
      }

      function buildCurrentPath(parentPath, routePath) {
        if (parentPath === "/") {
          return `/${trimSlash(routePath)}`;
        }
        return `${parentPath}/${trimSlash(routePath)}`;
      }
      function RouteNodeRender({ node, ctx }) {
        var _a;
        useLifecycleHook(node.lifecycleHooks || {});
        const parentRoutePath = useContext(RouteContext);
        const currentRoutePath = buildCurrentPath(parentRoutePath, node.path);
        const match = useMatch(ctx.location$, currentRoutePath, (_a = node.exactly) != null ? _a : false);
        if (match) {
          return React.createElement(RouteContext.Provider, { value: currentRoutePath }, React.createElement(NodeRender, { node: node.node, ctx }));
        }
        return null;
      }

      function ReactComponentNodeRender({ node, ctx }) {
        const props = useInstantiateProps(node, ctx);
        const nodeComponent = useNodeComponent(node, ctx.plugins);
        useLifecycleHook(node.lifecycleHooks || {});
        if (!nodeComponent) {
          return null;
        }
        if (!node.children || !node.children.length) {
          return React.createElement(nodeComponent, props);
        }
        return React.createElement(nodeComponent, props, React.createElement(ChildrenRender, { nodes: node.children || [], ctx }));
      }

      function ChildrenRender({ nodes, ctx }) {
        if (!nodes.length) {
          return null;
        }
        return React.createElement(React.Fragment, null, nodes.map((node) => React.createElement(NodeRender, { key: node.id, node, ctx })));
      }
      function NodeRender({ node, ctx }) {
        const parentPath = useContext(PathContext);
        const currentPath = `${parentPath}/${node.id}`;
        const shouldRender = useShouldRender(node, ctx);
        if (!shouldRender) {
          return null;
        }
        if (node.type === "route-node") {
          return React.createElement(PathContext.Provider, { value: currentPath }, React.createElement(RouteNodeRender, { node, ctx }));
        }
        if (node.type === "loop-container") {
          return React.createElement(PathContext.Provider, { value: currentPath }, React.createElement(LoopNodeRender, { node, ctx }));
        }
        if (node.type === "html-element") {
          return React.createElement(PathContext.Provider, { value: currentPath }, React.createElement(HTMLNodeRender, { node, ctx }));
        }
        if (node.type === "react-component") {
          return React.createElement(PathContext.Provider, { value: currentPath }, React.createElement(ReactComponentNodeRender, { node, ctx }));
        }
        if (node.type === "ref-node") {
          return React.createElement(PathContext.Provider, { value: currentPath }, React.createElement(RefNodeRender, { node, ctx }));
        }
        if (node.type === "jsx-node") {
          return React.createElement(PathContext.Provider, { value: currentPath }, React.createElement(JSXNodeRender, { node, ctx }));
        }
        logger.error("Unrecognized node type of node:", node);
        return null;
      }

      function useCTX(schema, plugins) {
        const [ctx, setCTX] = useState(null);
        useEffect(() => {
          initCTX({ plugins, schema }).then(setCTX).catch(logger.error);
        }, []);
        return ctx;
      }
      function SchemaRender({ schema, plugins }, ref) {
        const ctx = useCTX(schema, plugins);
        useImperativeHandle(ref, () => {
          if (!ctx) {
            return;
          }
          return { apiStates: ctx.ctx.apiStates, states: ctx.ctx.states, history: ctx.ctx.history };
        }, [ctx]);
        if (!ctx) {
          return null;
        }
        return React.createElement(NodeRender, { node: ctx.rootNode, ctx: ctx.ctx });
      }

      class RenderEngine {
        constructor(schema, plugins) {
          this.schema = schema;
          this.plugins = plugins || {};
        }
        async render(renderRoot) {
          const { ctx, rootNode } = await initCTX({
            plugins: this.plugins,
            schema: this.schema
          });
          ReactDOM.render(React.createElement(NodeRender, { node: rootNode, ctx }), renderRoot);
        }
      } exports({ RenderEngine: RenderEngine, 'default': RenderEngine });

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9AYmFiZWwrcnVudGltZUA3LjE3LjIvbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvZXNtL2V4dGVuZHMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vaGlzdG9yeUA1LjMuMC9ub2RlX21vZHVsZXMvaGlzdG9yeS9pbmRleC5qcyIsIi4uLy4uLy4uL3NyYy9jdHgvYXBpLXN0YXRlcy50cyIsIi4uLy4uLy4uL3NyYy9jdHgvZGVzZXJpYWxpemUvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvY3R4L2Rlc2VyaWFsaXplL2luc3RhbnRpYXRlLnRzIiwiLi4vLi4vLi4vc3JjL2N0eC9kZXNlcmlhbGl6ZS9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9jdHgvaHR0cC9odHRwLnRzIiwiLi4vLi4vLi4vc3JjL2N0eC9odHRwL3Jlc3BvbnNlLnRzIiwiLi4vLi4vLi4vc3JjL2N0eC9pbml0LWFwaS1zdGF0ZS50cyIsIi4uLy4uLy4uL3NyYy9jdHgvc3RhdGVzLWh1Yi1hcGkudHMiLCIuLi8uLi8uLi9zcmMvY3R4L3NoYXJlZC1zdGF0ZXMudHMiLCIuLi8uLi8uLi9zcmMvY3R4L3N0YXRlcy1odWItc2hhcmVkLnRzIiwiLi4vLi4vLi4vc3JjL2N0eC9pbml0aWFsaXplLWxhenktc2hhcmVkLXN0YXRlcy50cyIsIi4uLy4uLy4uL3NyYy9jdHgvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvcGF0aC1jb250ZXh0LnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtY29uc3RhbnQtcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3V0aWxzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtYXBpLXJlc3VsdC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWFwaS1sb2FkaW5nLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtYXBpLWludm9rZS1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLXNoYXJlZC1zdGF0ZS1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWZ1bmMtcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1zaGFyZWQtc3RhdGUtbXV0YXRpb24udHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1pbnRlcm5hbC1ob29rLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtcmVuZGVyLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtY29tcHV0ZWQtcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1saW5rLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9ob29rcy9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9qc3gtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvcmVmLW5vZGUtcmVuZGVyLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2h0bWwtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9oZWxwZXJzLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2xvb3Atbm9kZS1yZW5kZXIvbG9vcC1pbmRpdmlkdWFsLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2hvb2tzL2hlbHBlci50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9ob29rcy91c2Utbm9kZS1jb21wb25lbnQudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9vdXQtbGF5ZXItcmVuZGVyLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2xvb3Atbm9kZS1yZW5kZXIvbG9vcC1jb21wb3NlZC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9sb29wLW5vZGUtcmVuZGVyL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL3JvdXRlLW5vZGUtcmVuZGVyL3JvdXRlLXBhdGgtY29udGV4dC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yb3V0ZS1ub2RlLXJlbmRlci91dGlscy50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yb3V0ZS1ub2RlLXJlbmRlci91c2UtbWF0Y2gudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvcm91dGUtbm9kZS1yZW5kZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvcmVhY3QtY29tcG9uZW50LW5vZGUtcmVuZGVyLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL3NjaGVtYS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvcmVuZGVyLWVuZ2luZS50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfZXh0ZW5kcygpIHtcbiAgX2V4dGVuZHMgPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcblxuICAgICAgZm9yICh2YXIga2V5IGluIHNvdXJjZSkge1xuICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHNvdXJjZSwga2V5KSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gc291cmNlW2tleV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9O1xuXG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufSIsImltcG9ydCBfZXh0ZW5kcyBmcm9tICdAYmFiZWwvcnVudGltZS9oZWxwZXJzL2VzbS9leHRlbmRzJztcblxuLyoqXHJcbiAqIEFjdGlvbnMgcmVwcmVzZW50IHRoZSB0eXBlIG9mIGNoYW5nZSB0byBhIGxvY2F0aW9uIHZhbHVlLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI2FjdGlvblxyXG4gKi9cbnZhciBBY3Rpb247XG5cbihmdW5jdGlvbiAoQWN0aW9uKSB7XG4gIC8qKlxyXG4gICAqIEEgUE9QIGluZGljYXRlcyBhIGNoYW5nZSB0byBhbiBhcmJpdHJhcnkgaW5kZXggaW4gdGhlIGhpc3Rvcnkgc3RhY2ssIHN1Y2hcclxuICAgKiBhcyBhIGJhY2sgb3IgZm9yd2FyZCBuYXZpZ2F0aW9uLiBJdCBkb2VzIG5vdCBkZXNjcmliZSB0aGUgZGlyZWN0aW9uIG9mIHRoZVxyXG4gICAqIG5hdmlnYXRpb24sIG9ubHkgdGhhdCB0aGUgY3VycmVudCBpbmRleCBjaGFuZ2VkLlxyXG4gICAqXHJcbiAgICogTm90ZTogVGhpcyBpcyB0aGUgZGVmYXVsdCBhY3Rpb24gZm9yIG5ld2x5IGNyZWF0ZWQgaGlzdG9yeSBvYmplY3RzLlxyXG4gICAqL1xuICBBY3Rpb25bXCJQb3BcIl0gPSBcIlBPUFwiO1xuICAvKipcclxuICAgKiBBIFBVU0ggaW5kaWNhdGVzIGEgbmV3IGVudHJ5IGJlaW5nIGFkZGVkIHRvIHRoZSBoaXN0b3J5IHN0YWNrLCBzdWNoIGFzIHdoZW5cclxuICAgKiBhIGxpbmsgaXMgY2xpY2tlZCBhbmQgYSBuZXcgcGFnZSBsb2Fkcy4gV2hlbiB0aGlzIGhhcHBlbnMsIGFsbCBzdWJzZXF1ZW50XHJcbiAgICogZW50cmllcyBpbiB0aGUgc3RhY2sgYXJlIGxvc3QuXHJcbiAgICovXG5cbiAgQWN0aW9uW1wiUHVzaFwiXSA9IFwiUFVTSFwiO1xuICAvKipcclxuICAgKiBBIFJFUExBQ0UgaW5kaWNhdGVzIHRoZSBlbnRyeSBhdCB0aGUgY3VycmVudCBpbmRleCBpbiB0aGUgaGlzdG9yeSBzdGFja1xyXG4gICAqIGJlaW5nIHJlcGxhY2VkIGJ5IGEgbmV3IG9uZS5cclxuICAgKi9cblxuICBBY3Rpb25bXCJSZXBsYWNlXCJdID0gXCJSRVBMQUNFXCI7XG59KShBY3Rpb24gfHwgKEFjdGlvbiA9IHt9KSk7XG5cbnZhciByZWFkT25seSA9IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIE9iamVjdC5mcmVlemUob2JqKTtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmo7XG59O1xuXG5mdW5jdGlvbiB3YXJuaW5nKGNvbmQsIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnKSBjb25zb2xlLndhcm4obWVzc2FnZSk7XG5cbiAgICB0cnkge1xuICAgICAgLy8gV2VsY29tZSB0byBkZWJ1Z2dpbmcgaGlzdG9yeSFcbiAgICAgIC8vXG4gICAgICAvLyBUaGlzIGVycm9yIGlzIHRocm93biBhcyBhIGNvbnZlbmllbmNlIHNvIHlvdSBjYW4gbW9yZSBlYXNpbHlcbiAgICAgIC8vIGZpbmQgdGhlIHNvdXJjZSBmb3IgYSB3YXJuaW5nIHRoYXQgYXBwZWFycyBpbiB0aGUgY29uc29sZSBieVxuICAgICAgLy8gZW5hYmxpbmcgXCJwYXVzZSBvbiBleGNlcHRpb25zXCIgaW4geW91ciBKYXZhU2NyaXB0IGRlYnVnZ2VyLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpOyAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgICB9IGNhdGNoIChlKSB7fVxuICB9XG59XG5cbnZhciBCZWZvcmVVbmxvYWRFdmVudFR5cGUgPSAnYmVmb3JldW5sb2FkJztcbnZhciBIYXNoQ2hhbmdlRXZlbnRUeXBlID0gJ2hhc2hjaGFuZ2UnO1xudmFyIFBvcFN0YXRlRXZlbnRUeXBlID0gJ3BvcHN0YXRlJztcbi8qKlxyXG4gKiBCcm93c2VyIGhpc3Rvcnkgc3RvcmVzIHRoZSBsb2NhdGlvbiBpbiByZWd1bGFyIFVSTHMuIFRoaXMgaXMgdGhlIHN0YW5kYXJkIGZvclxyXG4gKiBtb3N0IHdlYiBhcHBzLCBidXQgaXQgcmVxdWlyZXMgc29tZSBjb25maWd1cmF0aW9uIG9uIHRoZSBzZXJ2ZXIgdG8gZW5zdXJlIHlvdVxyXG4gKiBzZXJ2ZSB0aGUgc2FtZSBhcHAgYXQgbXVsdGlwbGUgVVJMcy5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVicm93c2VyaGlzdG9yeVxyXG4gKi9cblxuZnVuY3Rpb24gY3JlYXRlQnJvd3Nlckhpc3Rvcnkob3B0aW9ucykge1xuICBpZiAob3B0aW9ucyA9PT0gdm9pZCAwKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG5cbiAgdmFyIF9vcHRpb25zID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zJHdpbmRvdyA9IF9vcHRpb25zLndpbmRvdyxcbiAgICAgIHdpbmRvdyA9IF9vcHRpb25zJHdpbmRvdyA9PT0gdm9pZCAwID8gZG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBfb3B0aW9ucyR3aW5kb3c7XG4gIHZhciBnbG9iYWxIaXN0b3J5ID0gd2luZG93Lmhpc3Rvcnk7XG5cbiAgZnVuY3Rpb24gZ2V0SW5kZXhBbmRMb2NhdGlvbigpIHtcbiAgICB2YXIgX3dpbmRvdyRsb2NhdGlvbiA9IHdpbmRvdy5sb2NhdGlvbixcbiAgICAgICAgcGF0aG5hbWUgPSBfd2luZG93JGxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgICBzZWFyY2ggPSBfd2luZG93JGxvY2F0aW9uLnNlYXJjaCxcbiAgICAgICAgaGFzaCA9IF93aW5kb3ckbG9jYXRpb24uaGFzaDtcbiAgICB2YXIgc3RhdGUgPSBnbG9iYWxIaXN0b3J5LnN0YXRlIHx8IHt9O1xuICAgIHJldHVybiBbc3RhdGUuaWR4LCByZWFkT25seSh7XG4gICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBzdGF0ZTogc3RhdGUudXNyIHx8IG51bGwsXG4gICAgICBrZXk6IHN0YXRlLmtleSB8fCAnZGVmYXVsdCdcbiAgICB9KV07XG4gIH1cblxuICB2YXIgYmxvY2tlZFBvcFR4ID0gbnVsbDtcblxuICBmdW5jdGlvbiBoYW5kbGVQb3AoKSB7XG4gICAgaWYgKGJsb2NrZWRQb3BUeCkge1xuICAgICAgYmxvY2tlcnMuY2FsbChibG9ja2VkUG9wVHgpO1xuICAgICAgYmxvY2tlZFBvcFR4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gICAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb24gPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICAgICAgbmV4dEluZGV4ID0gX2dldEluZGV4QW5kTG9jYXRpb25bMF0sXG4gICAgICAgICAgbmV4dExvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb25bMV07XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5leHRJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBuZXh0SW5kZXg7XG5cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIC8vIFJldmVydCB0aGUgUE9QXG4gICAgICAgICAgICBibG9ja2VkUG9wVHggPSB7XG4gICAgICAgICAgICAgIGFjdGlvbjogbmV4dEFjdGlvbixcbiAgICAgICAgICAgICAgbG9jYXRpb246IG5leHRMb2NhdGlvbixcbiAgICAgICAgICAgICAgcmV0cnk6IGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgICAgICAgICAgIGdvKGRlbHRhICogLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ28oZGVsdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUcnlpbmcgdG8gUE9QIHRvIGEgbG9jYXRpb24gd2l0aCBubyBpbmRleC4gV2UgZGlkIG5vdCBjcmVhdGVcbiAgICAgICAgICAvLyB0aGlzIGxvY2F0aW9uLCBzbyB3ZSBjYW4ndCBlZmZlY3RpdmVseSBibG9jayB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGZhbHNlLCAvLyBUT0RPOiBXcml0ZSB1cCBhIGRvYyB0aGF0IGV4cGxhaW5zIG91ciBibG9ja2luZyBzdHJhdGVneSBpblxuICAgICAgICAgIC8vIGRldGFpbCBhbmQgbGluayB0byBpdCBoZXJlIHNvIHBlb3BsZSBjYW4gdW5kZXJzdGFuZCBiZXR0ZXIgd2hhdFxuICAgICAgICAgIC8vIGlzIGdvaW5nIG9uIGFuZCBob3cgdG8gYXZvaWQgaXQuXG4gICAgICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBibG9jayBhIFBPUCBuYXZpZ2F0aW9uIHRvIGEgbG9jYXRpb24gdGhhdCB3YXMgbm90IFwiICsgXCJjcmVhdGVkIGJ5IHRoZSBoaXN0b3J5IGxpYnJhcnkuIFRoZSBibG9jayB3aWxsIGZhaWwgc2lsZW50bHkgaW4gXCIgKyBcInByb2R1Y3Rpb24sIGJ1dCBpbiBnZW5lcmFsIHlvdSBzaG91bGQgZG8gYWxsIG5hdmlnYXRpb24gd2l0aCB0aGUgXCIgKyBcImhpc3RvcnkgbGlicmFyeSAoaW5zdGVhZCBvZiB1c2luZyB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgZGlyZWN0bHkpIFwiICsgXCJ0byBhdm9pZCB0aGlzIHNpdHVhdGlvbi5cIikgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoUG9wU3RhdGVFdmVudFR5cGUsIGhhbmRsZVBvcCk7XG4gIHZhciBhY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjIgPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uMlswXSxcbiAgICAgIGxvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb24yWzFdO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICBpbmRleCA9IDA7XG4gICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoX2V4dGVuZHMoe30sIGdsb2JhbEhpc3Rvcnkuc3RhdGUsIHtcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9KSwgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gY3JlYXRlSHJlZih0bykge1xuICAgIHJldHVybiB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKTtcbiAgfSAvLyBzdGF0ZSBkZWZhdWx0cyB0byBgbnVsbGAgYmVjYXVzZSBgd2luZG93Lmhpc3Rvcnkuc3RhdGVgIGRvZXNcblxuXG4gIGZ1bmN0aW9uIGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZWFkT25seShfZXh0ZW5kcyh7XG4gICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBoYXNoOiAnJyxcbiAgICAgIHNlYXJjaDogJydcbiAgICB9LCB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gcGFyc2VQYXRoKHRvKSA6IHRvLCB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBrZXk6IGNyZWF0ZUtleSgpXG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXgpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIHVzcjogbmV4dExvY2F0aW9uLnN0YXRlLFxuICAgICAga2V5OiBuZXh0TG9jYXRpb24ua2V5LFxuICAgICAgaWR4OiBpbmRleFxuICAgIH0sIGNyZWF0ZUhyZWYobmV4dExvY2F0aW9uKV07XG4gIH1cblxuICBmdW5jdGlvbiBhbGxvd1R4KGFjdGlvbiwgbG9jYXRpb24sIHJldHJ5KSB7XG4gICAgcmV0dXJuICFibG9ja2Vycy5sZW5ndGggfHwgKGJsb2NrZXJzLmNhbGwoe1xuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb24sXG4gICAgICByZXRyeTogcmV0cnlcbiAgICB9KSwgZmFsc2UpO1xuICB9XG5cbiAgZnVuY3Rpb24gYXBwbHlUeChuZXh0QWN0aW9uKSB7XG4gICAgYWN0aW9uID0gbmV4dEFjdGlvbjtcblxuICAgIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjMgPSBnZXRJbmRleEFuZExvY2F0aW9uKCk7XG5cbiAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uM1swXTtcbiAgICBsb2NhdGlvbiA9IF9nZXRJbmRleEFuZExvY2F0aW9uM1sxXTtcbiAgICBsaXN0ZW5lcnMuY2FsbCh7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaCh0bywgc3RhdGUpIHtcbiAgICB2YXIgbmV4dEFjdGlvbiA9IEFjdGlvbi5QdXNoO1xuICAgIHZhciBuZXh0TG9jYXRpb24gPSBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgcHVzaCh0bywgc3RhdGUpO1xuICAgIH1cblxuICAgIGlmIChhbGxvd1R4KG5leHRBY3Rpb24sIG5leHRMb2NhdGlvbiwgcmV0cnkpKSB7XG4gICAgICB2YXIgX2dldEhpc3RvcnlTdGF0ZUFuZFVyID0gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXggKyAxKSxcbiAgICAgICAgICBoaXN0b3J5U3RhdGUgPSBfZ2V0SGlzdG9yeVN0YXRlQW5kVXJbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyWzFdOyAvLyBUT0RPOiBTdXBwb3J0IGZvcmNlZCByZWxvYWRpbmdcbiAgICAgIC8vIHRyeS4uLmNhdGNoIGJlY2F1c2UgaU9TIGxpbWl0cyB1cyB0byAxMDAgcHVzaFN0YXRlIGNhbGxzIDovXG5cblxuICAgICAgdHJ5IHtcbiAgICAgICAgZ2xvYmFsSGlzdG9yeS5wdXNoU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgdXJsKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIFRoZXkgYXJlIGdvaW5nIHRvIGxvc2Ugc3RhdGUgaGVyZSwgYnV0IHRoZXJlIGlzIG5vIHJlYWxcbiAgICAgICAgLy8gd2F5IHRvIHdhcm4gdGhlbSBhYm91dCBpdCBzaW5jZSB0aGUgcGFnZSB3aWxsIHJlZnJlc2guLi5cbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmFzc2lnbih1cmwpO1xuICAgICAgfVxuXG4gICAgICBhcHBseVR4KG5leHRBY3Rpb24pO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlcGxhY2UodG8sIHN0YXRlKSB7XG4gICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUmVwbGFjZTtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZ2V0TmV4dExvY2F0aW9uKHRvLCBzdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiByZXRyeSgpIHtcbiAgICAgIHJlcGxhY2UodG8sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgdmFyIF9nZXRIaXN0b3J5U3RhdGVBbmRVcjIgPSBnZXRIaXN0b3J5U3RhdGVBbmRVcmwobmV4dExvY2F0aW9uLCBpbmRleCksXG4gICAgICAgICAgaGlzdG9yeVN0YXRlID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyMlswXSxcbiAgICAgICAgICB1cmwgPSBfZ2V0SGlzdG9yeVN0YXRlQW5kVXIyWzFdOyAvLyBUT0RPOiBTdXBwb3J0IGZvcmNlZCByZWxvYWRpbmdcblxuXG4gICAgICBnbG9iYWxIaXN0b3J5LnJlcGxhY2VTdGF0ZShoaXN0b3J5U3RhdGUsICcnLCB1cmwpO1xuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyhkZWx0YSkge1xuICAgIGdsb2JhbEhpc3RvcnkuZ28oZGVsdGEpO1xuICB9XG5cbiAgdmFyIGhpc3RvcnkgPSB7XG4gICAgZ2V0IGFjdGlvbigpIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGdldCBsb2NhdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9LFxuXG4gICAgY3JlYXRlSHJlZjogY3JlYXRlSHJlZixcbiAgICBwdXNoOiBwdXNoLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgZ286IGdvLFxuICAgIGJhY2s6IGZ1bmN0aW9uIGJhY2soKSB7XG4gICAgICBnbygtMSk7XG4gICAgfSxcbiAgICBmb3J3YXJkOiBmdW5jdGlvbiBmb3J3YXJkKCkge1xuICAgICAgZ28oMSk7XG4gICAgfSxcbiAgICBsaXN0ZW46IGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGJsb2NrOiBmdW5jdGlvbiBibG9jayhibG9ja2VyKSB7XG4gICAgICB2YXIgdW5ibG9jayA9IGJsb2NrZXJzLnB1c2goYmxvY2tlcik7XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoQmVmb3JlVW5sb2FkRXZlbnRUeXBlLCBwcm9tcHRCZWZvcmVVbmxvYWQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICB1bmJsb2NrKCk7IC8vIFJlbW92ZSB0aGUgYmVmb3JldW5sb2FkIGxpc3RlbmVyIHNvIHRoZSBkb2N1bWVudCBtYXlcbiAgICAgICAgLy8gc3RpbGwgYmUgc2FsdmFnZWFibGUgaW4gdGhlIHBhZ2VoaWRlIGV2ZW50LlxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9odG1sLnNwZWMud2hhdHdnLm9yZy8jdW5sb2FkaW5nLWRvY3VtZW50c1xuXG4gICAgICAgIGlmICghYmxvY2tlcnMubGVuZ3RoKSB7XG4gICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoQmVmb3JlVW5sb2FkRXZlbnRUeXBlLCBwcm9tcHRCZWZvcmVVbmxvYWQpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGhpc3Rvcnk7XG59XG4vKipcclxuICogSGFzaCBoaXN0b3J5IHN0b3JlcyB0aGUgbG9jYXRpb24gaW4gd2luZG93LmxvY2F0aW9uLmhhc2guIFRoaXMgbWFrZXMgaXQgaWRlYWxcclxuICogZm9yIHNpdHVhdGlvbnMgd2hlcmUgeW91IGRvbid0IHdhbnQgdG8gc2VuZCB0aGUgbG9jYXRpb24gdG8gdGhlIHNlcnZlciBmb3JcclxuICogc29tZSByZWFzb24sIGVpdGhlciBiZWNhdXNlIHlvdSBkbyBjYW5ub3QgY29uZmlndXJlIGl0IG9yIHRoZSBVUkwgc3BhY2UgaXNcclxuICogcmVzZXJ2ZWQgZm9yIHNvbWV0aGluZyBlbHNlLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI2NyZWF0ZWhhc2hoaXN0b3J5XHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVIYXNoSGlzdG9yeShvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zID09PSB2b2lkIDApIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB2YXIgX29wdGlvbnMyID0gb3B0aW9ucyxcbiAgICAgIF9vcHRpb25zMiR3aW5kb3cgPSBfb3B0aW9uczIud2luZG93LFxuICAgICAgd2luZG93ID0gX29wdGlvbnMyJHdpbmRvdyA9PT0gdm9pZCAwID8gZG9jdW1lbnQuZGVmYXVsdFZpZXcgOiBfb3B0aW9uczIkd2luZG93O1xuICB2YXIgZ2xvYmFsSGlzdG9yeSA9IHdpbmRvdy5oaXN0b3J5O1xuXG4gIGZ1bmN0aW9uIGdldEluZGV4QW5kTG9jYXRpb24oKSB7XG4gICAgdmFyIF9wYXJzZVBhdGggPSBwYXJzZVBhdGgod2luZG93LmxvY2F0aW9uLmhhc2guc3Vic3RyKDEpKSxcbiAgICAgICAgX3BhcnNlUGF0aCRwYXRobmFtZSA9IF9wYXJzZVBhdGgucGF0aG5hbWUsXG4gICAgICAgIHBhdGhuYW1lID0gX3BhcnNlUGF0aCRwYXRobmFtZSA9PT0gdm9pZCAwID8gJy8nIDogX3BhcnNlUGF0aCRwYXRobmFtZSxcbiAgICAgICAgX3BhcnNlUGF0aCRzZWFyY2ggPSBfcGFyc2VQYXRoLnNlYXJjaCxcbiAgICAgICAgc2VhcmNoID0gX3BhcnNlUGF0aCRzZWFyY2ggPT09IHZvaWQgMCA/ICcnIDogX3BhcnNlUGF0aCRzZWFyY2gsXG4gICAgICAgIF9wYXJzZVBhdGgkaGFzaCA9IF9wYXJzZVBhdGguaGFzaCxcbiAgICAgICAgaGFzaCA9IF9wYXJzZVBhdGgkaGFzaCA9PT0gdm9pZCAwID8gJycgOiBfcGFyc2VQYXRoJGhhc2g7XG5cbiAgICB2YXIgc3RhdGUgPSBnbG9iYWxIaXN0b3J5LnN0YXRlIHx8IHt9O1xuICAgIHJldHVybiBbc3RhdGUuaWR4LCByZWFkT25seSh7XG4gICAgICBwYXRobmFtZTogcGF0aG5hbWUsXG4gICAgICBzZWFyY2g6IHNlYXJjaCxcbiAgICAgIGhhc2g6IGhhc2gsXG4gICAgICBzdGF0ZTogc3RhdGUudXNyIHx8IG51bGwsXG4gICAgICBrZXk6IHN0YXRlLmtleSB8fCAnZGVmYXVsdCdcbiAgICB9KV07XG4gIH1cblxuICB2YXIgYmxvY2tlZFBvcFR4ID0gbnVsbDtcblxuICBmdW5jdGlvbiBoYW5kbGVQb3AoKSB7XG4gICAgaWYgKGJsb2NrZWRQb3BUeCkge1xuICAgICAgYmxvY2tlcnMuY2FsbChibG9ja2VkUG9wVHgpO1xuICAgICAgYmxvY2tlZFBvcFR4ID0gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gICAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb240ID0gZ2V0SW5kZXhBbmRMb2NhdGlvbigpLFxuICAgICAgICAgIG5leHRJbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uNFswXSxcbiAgICAgICAgICBuZXh0TG9jYXRpb24gPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjRbMV07XG5cbiAgICAgIGlmIChibG9ja2Vycy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKG5leHRJbmRleCAhPSBudWxsKSB7XG4gICAgICAgICAgdmFyIGRlbHRhID0gaW5kZXggLSBuZXh0SW5kZXg7XG5cbiAgICAgICAgICBpZiAoZGVsdGEpIHtcbiAgICAgICAgICAgIC8vIFJldmVydCB0aGUgUE9QXG4gICAgICAgICAgICBibG9ja2VkUG9wVHggPSB7XG4gICAgICAgICAgICAgIGFjdGlvbjogbmV4dEFjdGlvbixcbiAgICAgICAgICAgICAgbG9jYXRpb246IG5leHRMb2NhdGlvbixcbiAgICAgICAgICAgICAgcmV0cnk6IGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgICAgICAgICAgIGdvKGRlbHRhICogLTEpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgZ28oZGVsdGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBUcnlpbmcgdG8gUE9QIHRvIGEgbG9jYXRpb24gd2l0aCBubyBpbmRleC4gV2UgZGlkIG5vdCBjcmVhdGVcbiAgICAgICAgICAvLyB0aGlzIGxvY2F0aW9uLCBzbyB3ZSBjYW4ndCBlZmZlY3RpdmVseSBibG9jayB0aGUgbmF2aWdhdGlvbi5cbiAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGZhbHNlLCAvLyBUT0RPOiBXcml0ZSB1cCBhIGRvYyB0aGF0IGV4cGxhaW5zIG91ciBibG9ja2luZyBzdHJhdGVneSBpblxuICAgICAgICAgIC8vIGRldGFpbCBhbmQgbGluayB0byBpdCBoZXJlIHNvIHBlb3BsZSBjYW4gdW5kZXJzdGFuZCBiZXR0ZXJcbiAgICAgICAgICAvLyB3aGF0IGlzIGdvaW5nIG9uIGFuZCBob3cgdG8gYXZvaWQgaXQuXG4gICAgICAgICAgXCJZb3UgYXJlIHRyeWluZyB0byBibG9jayBhIFBPUCBuYXZpZ2F0aW9uIHRvIGEgbG9jYXRpb24gdGhhdCB3YXMgbm90IFwiICsgXCJjcmVhdGVkIGJ5IHRoZSBoaXN0b3J5IGxpYnJhcnkuIFRoZSBibG9jayB3aWxsIGZhaWwgc2lsZW50bHkgaW4gXCIgKyBcInByb2R1Y3Rpb24sIGJ1dCBpbiBnZW5lcmFsIHlvdSBzaG91bGQgZG8gYWxsIG5hdmlnYXRpb24gd2l0aCB0aGUgXCIgKyBcImhpc3RvcnkgbGlicmFyeSAoaW5zdGVhZCBvZiB1c2luZyB3aW5kb3cuaGlzdG9yeS5wdXNoU3RhdGUgZGlyZWN0bHkpIFwiICsgXCJ0byBhdm9pZCB0aGlzIHNpdHVhdGlvbi5cIikgOiB2b2lkIDA7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoUG9wU3RhdGVFdmVudFR5cGUsIGhhbmRsZVBvcCk7IC8vIHBvcHN0YXRlIGRvZXMgbm90IGZpcmUgb24gaGFzaGNoYW5nZSBpbiBJRSAxMSBhbmQgb2xkICh0cmlkZW50KSBFZGdlXG4gIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2RlL2RvY3MvV2ViL0FQSS9XaW5kb3cvcG9wc3RhdGVfZXZlbnRcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihIYXNoQ2hhbmdlRXZlbnRUeXBlLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9nZXRJbmRleEFuZExvY2F0aW9uNSA9IGdldEluZGV4QW5kTG9jYXRpb24oKSxcbiAgICAgICAgbmV4dExvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb241WzFdOyAvLyBJZ25vcmUgZXh0cmFuZW91cyBoYXNoY2hhbmdlIGV2ZW50cy5cblxuXG4gICAgaWYgKGNyZWF0ZVBhdGgobmV4dExvY2F0aW9uKSAhPT0gY3JlYXRlUGF0aChsb2NhdGlvbikpIHtcbiAgICAgIGhhbmRsZVBvcCgpO1xuICAgIH1cbiAgfSk7XG4gIHZhciBhY3Rpb24gPSBBY3Rpb24uUG9wO1xuXG4gIHZhciBfZ2V0SW5kZXhBbmRMb2NhdGlvbjYgPSBnZXRJbmRleEFuZExvY2F0aW9uKCksXG4gICAgICBpbmRleCA9IF9nZXRJbmRleEFuZExvY2F0aW9uNlswXSxcbiAgICAgIGxvY2F0aW9uID0gX2dldEluZGV4QW5kTG9jYXRpb242WzFdO1xuXG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgaWYgKGluZGV4ID09IG51bGwpIHtcbiAgICBpbmRleCA9IDA7XG4gICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoX2V4dGVuZHMoe30sIGdsb2JhbEhpc3Rvcnkuc3RhdGUsIHtcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9KSwgJycpO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0QmFzZUhyZWYoKSB7XG4gICAgdmFyIGJhc2UgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdiYXNlJyk7XG4gICAgdmFyIGhyZWYgPSAnJztcblxuICAgIGlmIChiYXNlICYmIGJhc2UuZ2V0QXR0cmlidXRlKCdocmVmJykpIHtcbiAgICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgIHZhciBoYXNoSW5kZXggPSB1cmwuaW5kZXhPZignIycpO1xuICAgICAgaHJlZiA9IGhhc2hJbmRleCA9PT0gLTEgPyB1cmwgOiB1cmwuc2xpY2UoMCwgaGFzaEluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gaHJlZjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNyZWF0ZUhyZWYodG8pIHtcbiAgICByZXR1cm4gZ2V0QmFzZUhyZWYoKSArICcjJyArICh0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKSB7XG4gICAgaWYgKHN0YXRlID09PSB2b2lkIDApIHtcbiAgICAgIHN0YXRlID0gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVhZE9ubHkoX2V4dGVuZHMoe1xuICAgICAgcGF0aG5hbWU6IGxvY2F0aW9uLnBhdGhuYW1lLFxuICAgICAgaGFzaDogJycsXG4gICAgICBzZWFyY2g6ICcnXG4gICAgfSwgdHlwZW9mIHRvID09PSAnc3RyaW5nJyA/IHBhcnNlUGF0aCh0bykgOiB0bywge1xuICAgICAgc3RhdGU6IHN0YXRlLFxuICAgICAga2V5OiBjcmVhdGVLZXkoKVxuICAgIH0pKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldEhpc3RvcnlTdGF0ZUFuZFVybChuZXh0TG9jYXRpb24sIGluZGV4KSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICB1c3I6IG5leHRMb2NhdGlvbi5zdGF0ZSxcbiAgICAgIGtleTogbmV4dExvY2F0aW9uLmtleSxcbiAgICAgIGlkeDogaW5kZXhcbiAgICB9LCBjcmVhdGVIcmVmKG5leHRMb2NhdGlvbildO1xuICB9XG5cbiAgZnVuY3Rpb24gYWxsb3dUeChhY3Rpb24sIGxvY2F0aW9uLCByZXRyeSkge1xuICAgIHJldHVybiAhYmxvY2tlcnMubGVuZ3RoIHx8IChibG9ja2Vycy5jYWxsKHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgcmV0cnk6IHJldHJ5XG4gICAgfSksIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5VHgobmV4dEFjdGlvbikge1xuICAgIGFjdGlvbiA9IG5leHRBY3Rpb247XG5cbiAgICB2YXIgX2dldEluZGV4QW5kTG9jYXRpb243ID0gZ2V0SW5kZXhBbmRMb2NhdGlvbigpO1xuXG4gICAgaW5kZXggPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjdbMF07XG4gICAgbG9jYXRpb24gPSBfZ2V0SW5kZXhBbmRMb2NhdGlvbjdbMV07XG4gICAgbGlzdGVuZXJzLmNhbGwoe1xuICAgICAgYWN0aW9uOiBhY3Rpb24sXG4gICAgICBsb2NhdGlvbjogbG9jYXRpb25cbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHB1c2godG8sIHN0YXRlKSB7XG4gICAgdmFyIG5leHRBY3Rpb24gPSBBY3Rpb24uUHVzaDtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZ2V0TmV4dExvY2F0aW9uKHRvLCBzdGF0ZSk7XG5cbiAgICBmdW5jdGlvbiByZXRyeSgpIHtcbiAgICAgIHB1c2godG8sIHN0YXRlKTtcbiAgICB9XG5cbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKG5leHRMb2NhdGlvbi5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJywgXCJSZWxhdGl2ZSBwYXRobmFtZXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gaGFzaCBoaXN0b3J5LnB1c2goXCIgKyBKU09OLnN0cmluZ2lmeSh0bykgKyBcIilcIikgOiB2b2lkIDA7XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgdmFyIF9nZXRIaXN0b3J5U3RhdGVBbmRVcjMgPSBnZXRIaXN0b3J5U3RhdGVBbmRVcmwobmV4dExvY2F0aW9uLCBpbmRleCArIDEpLFxuICAgICAgICAgIGhpc3RvcnlTdGF0ZSA9IF9nZXRIaXN0b3J5U3RhdGVBbmRVcjNbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyM1sxXTsgLy8gVE9ETzogU3VwcG9ydCBmb3JjZWQgcmVsb2FkaW5nXG4gICAgICAvLyB0cnkuLi5jYXRjaCBiZWNhdXNlIGlPUyBsaW1pdHMgdXMgdG8gMTAwIHB1c2hTdGF0ZSBjYWxscyA6L1xuXG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGdsb2JhbEhpc3RvcnkucHVzaFN0YXRlKGhpc3RvcnlTdGF0ZSwgJycsIHVybCk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBUaGV5IGFyZSBnb2luZyB0byBsb3NlIHN0YXRlIGhlcmUsIGJ1dCB0aGVyZSBpcyBubyByZWFsXG4gICAgICAgIC8vIHdheSB0byB3YXJuIHRoZW0gYWJvdXQgaXQgc2luY2UgdGhlIHBhZ2Ugd2lsbCByZWZyZXNoLi4uXG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5hc3NpZ24odXJsKTtcbiAgICAgIH1cblxuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKHRvLCBzdGF0ZSkge1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlJlcGxhY2U7XG4gICAgdmFyIG5leHRMb2NhdGlvbiA9IGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICByZXBsYWNlKHRvLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gd2FybmluZyhuZXh0TG9jYXRpb24ucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycsIFwiUmVsYXRpdmUgcGF0aG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkIGluIGhhc2ggaGlzdG9yeS5yZXBsYWNlKFwiICsgSlNPTi5zdHJpbmdpZnkodG8pICsgXCIpXCIpIDogdm9pZCAwO1xuXG4gICAgaWYgKGFsbG93VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uLCByZXRyeSkpIHtcbiAgICAgIHZhciBfZ2V0SGlzdG9yeVN0YXRlQW5kVXI0ID0gZ2V0SGlzdG9yeVN0YXRlQW5kVXJsKG5leHRMb2NhdGlvbiwgaW5kZXgpLFxuICAgICAgICAgIGhpc3RvcnlTdGF0ZSA9IF9nZXRIaXN0b3J5U3RhdGVBbmRVcjRbMF0sXG4gICAgICAgICAgdXJsID0gX2dldEhpc3RvcnlTdGF0ZUFuZFVyNFsxXTsgLy8gVE9ETzogU3VwcG9ydCBmb3JjZWQgcmVsb2FkaW5nXG5cblxuICAgICAgZ2xvYmFsSGlzdG9yeS5yZXBsYWNlU3RhdGUoaGlzdG9yeVN0YXRlLCAnJywgdXJsKTtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbik7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gZ28oZGVsdGEpIHtcbiAgICBnbG9iYWxIaXN0b3J5LmdvKGRlbHRhKTtcbiAgfVxuXG4gIHZhciBoaXN0b3J5ID0ge1xuICAgIGdldCBhY3Rpb24oKSB7XG4gICAgICByZXR1cm4gYWN0aW9uO1xuICAgIH0sXG5cbiAgICBnZXQgbG9jYXRpb24oKSB7XG4gICAgICByZXR1cm4gbG9jYXRpb247XG4gICAgfSxcblxuICAgIGNyZWF0ZUhyZWY6IGNyZWF0ZUhyZWYsXG4gICAgcHVzaDogcHVzaCxcbiAgICByZXBsYWNlOiByZXBsYWNlLFxuICAgIGdvOiBnbyxcbiAgICBiYWNrOiBmdW5jdGlvbiBiYWNrKCkge1xuICAgICAgZ28oLTEpO1xuICAgIH0sXG4gICAgZm9yd2FyZDogZnVuY3Rpb24gZm9yd2FyZCgpIHtcbiAgICAgIGdvKDEpO1xuICAgIH0sXG4gICAgbGlzdGVuOiBmdW5jdGlvbiBsaXN0ZW4obGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lcnMucHVzaChsaXN0ZW5lcik7XG4gICAgfSxcbiAgICBibG9jazogZnVuY3Rpb24gYmxvY2soYmxvY2tlcikge1xuICAgICAgdmFyIHVuYmxvY2sgPSBibG9ja2Vycy5wdXNoKGJsb2NrZXIpO1xuXG4gICAgICBpZiAoYmxvY2tlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKEJlZm9yZVVubG9hZEV2ZW50VHlwZSwgcHJvbXB0QmVmb3JlVW5sb2FkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdW5ibG9jaygpOyAvLyBSZW1vdmUgdGhlIGJlZm9yZXVubG9hZCBsaXN0ZW5lciBzbyB0aGUgZG9jdW1lbnQgbWF5XG4gICAgICAgIC8vIHN0aWxsIGJlIHNhbHZhZ2VhYmxlIGluIHRoZSBwYWdlaGlkZSBldmVudC5cbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvI3VubG9hZGluZy1kb2N1bWVudHNcblxuICAgICAgICBpZiAoIWJsb2NrZXJzLmxlbmd0aCkge1xuICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKEJlZm9yZVVubG9hZEV2ZW50VHlwZSwgcHJvbXB0QmVmb3JlVW5sb2FkKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBoaXN0b3J5O1xufVxuLyoqXHJcbiAqIE1lbW9yeSBoaXN0b3J5IHN0b3JlcyB0aGUgY3VycmVudCBsb2NhdGlvbiBpbiBtZW1vcnkuIEl0IGlzIGRlc2lnbmVkIGZvciB1c2VcclxuICogaW4gc3RhdGVmdWwgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRzIGxpa2UgdGVzdHMgYW5kIFJlYWN0IE5hdGl2ZS5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVtZW1vcnloaXN0b3J5XHJcbiAqL1xuXG5mdW5jdGlvbiBjcmVhdGVNZW1vcnlIaXN0b3J5KG9wdGlvbnMpIHtcbiAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIHZhciBfb3B0aW9uczMgPSBvcHRpb25zLFxuICAgICAgX29wdGlvbnMzJGluaXRpYWxFbnRyID0gX29wdGlvbnMzLmluaXRpYWxFbnRyaWVzLFxuICAgICAgaW5pdGlhbEVudHJpZXMgPSBfb3B0aW9uczMkaW5pdGlhbEVudHIgPT09IHZvaWQgMCA/IFsnLyddIDogX29wdGlvbnMzJGluaXRpYWxFbnRyLFxuICAgICAgaW5pdGlhbEluZGV4ID0gX29wdGlvbnMzLmluaXRpYWxJbmRleDtcbiAgdmFyIGVudHJpZXMgPSBpbml0aWFsRW50cmllcy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgdmFyIGxvY2F0aW9uID0gcmVhZE9ubHkoX2V4dGVuZHMoe1xuICAgICAgcGF0aG5hbWU6ICcvJyxcbiAgICAgIHNlYXJjaDogJycsXG4gICAgICBoYXNoOiAnJyxcbiAgICAgIHN0YXRlOiBudWxsLFxuICAgICAga2V5OiBjcmVhdGVLZXkoKVxuICAgIH0sIHR5cGVvZiBlbnRyeSA9PT0gJ3N0cmluZycgPyBwYXJzZVBhdGgoZW50cnkpIDogZW50cnkpKTtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gXCJwcm9kdWN0aW9uXCIgPyB3YXJuaW5nKGxvY2F0aW9uLnBhdGhuYW1lLmNoYXJBdCgwKSA9PT0gJy8nLCBcIlJlbGF0aXZlIHBhdGhuYW1lcyBhcmUgbm90IHN1cHBvcnRlZCBpbiBjcmVhdGVNZW1vcnlIaXN0b3J5KHsgaW5pdGlhbEVudHJpZXMgfSkgKGludmFsaWQgZW50cnk6IFwiICsgSlNPTi5zdHJpbmdpZnkoZW50cnkpICsgXCIpXCIpIDogdm9pZCAwO1xuICAgIHJldHVybiBsb2NhdGlvbjtcbiAgfSk7XG4gIHZhciBpbmRleCA9IGNsYW1wKGluaXRpYWxJbmRleCA9PSBudWxsID8gZW50cmllcy5sZW5ndGggLSAxIDogaW5pdGlhbEluZGV4LCAwLCBlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICB2YXIgYWN0aW9uID0gQWN0aW9uLlBvcDtcbiAgdmFyIGxvY2F0aW9uID0gZW50cmllc1tpbmRleF07XG4gIHZhciBsaXN0ZW5lcnMgPSBjcmVhdGVFdmVudHMoKTtcbiAgdmFyIGJsb2NrZXJzID0gY3JlYXRlRXZlbnRzKCk7XG5cbiAgZnVuY3Rpb24gY3JlYXRlSHJlZih0bykge1xuICAgIHJldHVybiB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gdG8gOiBjcmVhdGVQYXRoKHRvKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpIHtcbiAgICBpZiAoc3RhdGUgPT09IHZvaWQgMCkge1xuICAgICAgc3RhdGUgPSBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiByZWFkT25seShfZXh0ZW5kcyh7XG4gICAgICBwYXRobmFtZTogbG9jYXRpb24ucGF0aG5hbWUsXG4gICAgICBzZWFyY2g6ICcnLFxuICAgICAgaGFzaDogJydcbiAgICB9LCB0eXBlb2YgdG8gPT09ICdzdHJpbmcnID8gcGFyc2VQYXRoKHRvKSA6IHRvLCB7XG4gICAgICBzdGF0ZTogc3RhdGUsXG4gICAgICBrZXk6IGNyZWF0ZUtleSgpXG4gICAgfSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gYWxsb3dUeChhY3Rpb24sIGxvY2F0aW9uLCByZXRyeSkge1xuICAgIHJldHVybiAhYmxvY2tlcnMubGVuZ3RoIHx8IChibG9ja2Vycy5jYWxsKHtcbiAgICAgIGFjdGlvbjogYWN0aW9uLFxuICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxuICAgICAgcmV0cnk6IHJldHJ5XG4gICAgfSksIGZhbHNlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKSB7XG4gICAgYWN0aW9uID0gbmV4dEFjdGlvbjtcbiAgICBsb2NhdGlvbiA9IG5leHRMb2NhdGlvbjtcbiAgICBsaXN0ZW5lcnMuY2FsbCh7XG4gICAgICBhY3Rpb246IGFjdGlvbixcbiAgICAgIGxvY2F0aW9uOiBsb2NhdGlvblxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHVzaCh0bywgc3RhdGUpIHtcbiAgICB2YXIgbmV4dEFjdGlvbiA9IEFjdGlvbi5QdXNoO1xuICAgIHZhciBuZXh0TG9jYXRpb24gPSBnZXROZXh0TG9jYXRpb24odG8sIHN0YXRlKTtcblxuICAgIGZ1bmN0aW9uIHJldHJ5KCkge1xuICAgICAgcHVzaCh0bywgc3RhdGUpO1xuICAgIH1cblxuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSBcInByb2R1Y3Rpb25cIiA/IHdhcm5pbmcobG9jYXRpb24ucGF0aG5hbWUuY2hhckF0KDApID09PSAnLycsIFwiUmVsYXRpdmUgcGF0aG5hbWVzIGFyZSBub3Qgc3VwcG9ydGVkIGluIG1lbW9yeSBoaXN0b3J5LnB1c2goXCIgKyBKU09OLnN0cmluZ2lmeSh0bykgKyBcIilcIikgOiB2b2lkIDA7XG5cbiAgICBpZiAoYWxsb3dUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24sIHJldHJ5KSkge1xuICAgICAgaW5kZXggKz0gMTtcbiAgICAgIGVudHJpZXMuc3BsaWNlKGluZGV4LCBlbnRyaWVzLmxlbmd0aCwgbmV4dExvY2F0aW9uKTtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZXBsYWNlKHRvLCBzdGF0ZSkge1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlJlcGxhY2U7XG4gICAgdmFyIG5leHRMb2NhdGlvbiA9IGdldE5leHRMb2NhdGlvbih0bywgc3RhdGUpO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICByZXBsYWNlKHRvLCBzdGF0ZSk7XG4gICAgfVxuXG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09IFwicHJvZHVjdGlvblwiID8gd2FybmluZyhsb2NhdGlvbi5wYXRobmFtZS5jaGFyQXQoMCkgPT09ICcvJywgXCJSZWxhdGl2ZSBwYXRobmFtZXMgYXJlIG5vdCBzdXBwb3J0ZWQgaW4gbWVtb3J5IGhpc3RvcnkucmVwbGFjZShcIiArIEpTT04uc3RyaW5naWZ5KHRvKSArIFwiKVwiKSA6IHZvaWQgMDtcblxuICAgIGlmIChhbGxvd1R4KG5leHRBY3Rpb24sIG5leHRMb2NhdGlvbiwgcmV0cnkpKSB7XG4gICAgICBlbnRyaWVzW2luZGV4XSA9IG5leHRMb2NhdGlvbjtcbiAgICAgIGFwcGx5VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBnbyhkZWx0YSkge1xuICAgIHZhciBuZXh0SW5kZXggPSBjbGFtcChpbmRleCArIGRlbHRhLCAwLCBlbnRyaWVzLmxlbmd0aCAtIDEpO1xuICAgIHZhciBuZXh0QWN0aW9uID0gQWN0aW9uLlBvcDtcbiAgICB2YXIgbmV4dExvY2F0aW9uID0gZW50cmllc1tuZXh0SW5kZXhdO1xuXG4gICAgZnVuY3Rpb24gcmV0cnkoKSB7XG4gICAgICBnbyhkZWx0YSk7XG4gICAgfVxuXG4gICAgaWYgKGFsbG93VHgobmV4dEFjdGlvbiwgbmV4dExvY2F0aW9uLCByZXRyeSkpIHtcbiAgICAgIGluZGV4ID0gbmV4dEluZGV4O1xuICAgICAgYXBwbHlUeChuZXh0QWN0aW9uLCBuZXh0TG9jYXRpb24pO1xuICAgIH1cbiAgfVxuXG4gIHZhciBoaXN0b3J5ID0ge1xuICAgIGdldCBpbmRleCgpIHtcbiAgICAgIHJldHVybiBpbmRleDtcbiAgICB9LFxuXG4gICAgZ2V0IGFjdGlvbigpIHtcbiAgICAgIHJldHVybiBhY3Rpb247XG4gICAgfSxcblxuICAgIGdldCBsb2NhdGlvbigpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbjtcbiAgICB9LFxuXG4gICAgY3JlYXRlSHJlZjogY3JlYXRlSHJlZixcbiAgICBwdXNoOiBwdXNoLFxuICAgIHJlcGxhY2U6IHJlcGxhY2UsXG4gICAgZ286IGdvLFxuICAgIGJhY2s6IGZ1bmN0aW9uIGJhY2soKSB7XG4gICAgICBnbygtMSk7XG4gICAgfSxcbiAgICBmb3J3YXJkOiBmdW5jdGlvbiBmb3J3YXJkKCkge1xuICAgICAgZ28oMSk7XG4gICAgfSxcbiAgICBsaXN0ZW46IGZ1bmN0aW9uIGxpc3RlbihsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVycy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9LFxuICAgIGJsb2NrOiBmdW5jdGlvbiBibG9jayhibG9ja2VyKSB7XG4gICAgICByZXR1cm4gYmxvY2tlcnMucHVzaChibG9ja2VyKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBoaXN0b3J5O1xufSAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gVVRJTFNcbi8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vXG5cbmZ1bmN0aW9uIGNsYW1wKG4sIGxvd2VyQm91bmQsIHVwcGVyQm91bmQpIHtcbiAgcmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG4sIGxvd2VyQm91bmQpLCB1cHBlckJvdW5kKTtcbn1cblxuZnVuY3Rpb24gcHJvbXB0QmVmb3JlVW5sb2FkKGV2ZW50KSB7XG4gIC8vIENhbmNlbCB0aGUgZXZlbnQuXG4gIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7IC8vIENocm9tZSAoYW5kIGxlZ2FjeSBJRSkgcmVxdWlyZXMgcmV0dXJuVmFsdWUgdG8gYmUgc2V0LlxuXG4gIGV2ZW50LnJldHVyblZhbHVlID0gJyc7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUV2ZW50cygpIHtcbiAgdmFyIGhhbmRsZXJzID0gW107XG4gIHJldHVybiB7XG4gICAgZ2V0IGxlbmd0aCgpIHtcbiAgICAgIHJldHVybiBoYW5kbGVycy5sZW5ndGg7XG4gICAgfSxcblxuICAgIHB1c2g6IGZ1bmN0aW9uIHB1c2goZm4pIHtcbiAgICAgIGhhbmRsZXJzLnB1c2goZm4pO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaGFuZGxlcnMgPSBoYW5kbGVycy5maWx0ZXIoZnVuY3Rpb24gKGhhbmRsZXIpIHtcbiAgICAgICAgICByZXR1cm4gaGFuZGxlciAhPT0gZm47XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9LFxuICAgIGNhbGw6IGZ1bmN0aW9uIGNhbGwoYXJnKSB7XG4gICAgICBoYW5kbGVycy5mb3JFYWNoKGZ1bmN0aW9uIChmbikge1xuICAgICAgICByZXR1cm4gZm4gJiYgZm4oYXJnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlS2V5KCkge1xuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDgpO1xufVxuLyoqXHJcbiAqIENyZWF0ZXMgYSBzdHJpbmcgVVJMIHBhdGggZnJvbSB0aGUgZ2l2ZW4gcGF0aG5hbWUsIHNlYXJjaCwgYW5kIGhhc2ggY29tcG9uZW50cy5cclxuICpcclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20vcmVtaXgtcnVuL2hpc3RvcnkvdHJlZS9tYWluL2RvY3MvYXBpLXJlZmVyZW5jZS5tZCNjcmVhdGVwYXRoXHJcbiAqL1xuXG5cbmZ1bmN0aW9uIGNyZWF0ZVBhdGgoX3JlZikge1xuICB2YXIgX3JlZiRwYXRobmFtZSA9IF9yZWYucGF0aG5hbWUsXG4gICAgICBwYXRobmFtZSA9IF9yZWYkcGF0aG5hbWUgPT09IHZvaWQgMCA/ICcvJyA6IF9yZWYkcGF0aG5hbWUsXG4gICAgICBfcmVmJHNlYXJjaCA9IF9yZWYuc2VhcmNoLFxuICAgICAgc2VhcmNoID0gX3JlZiRzZWFyY2ggPT09IHZvaWQgMCA/ICcnIDogX3JlZiRzZWFyY2gsXG4gICAgICBfcmVmJGhhc2ggPSBfcmVmLmhhc2gsXG4gICAgICBoYXNoID0gX3JlZiRoYXNoID09PSB2b2lkIDAgPyAnJyA6IF9yZWYkaGFzaDtcbiAgaWYgKHNlYXJjaCAmJiBzZWFyY2ggIT09ICc/JykgcGF0aG5hbWUgKz0gc2VhcmNoLmNoYXJBdCgwKSA9PT0gJz8nID8gc2VhcmNoIDogJz8nICsgc2VhcmNoO1xuICBpZiAoaGFzaCAmJiBoYXNoICE9PSAnIycpIHBhdGhuYW1lICs9IGhhc2guY2hhckF0KDApID09PSAnIycgPyBoYXNoIDogJyMnICsgaGFzaDtcbiAgcmV0dXJuIHBhdGhuYW1lO1xufVxuLyoqXHJcbiAqIFBhcnNlcyBhIHN0cmluZyBVUkwgcGF0aCBpbnRvIGl0cyBzZXBhcmF0ZSBwYXRobmFtZSwgc2VhcmNoLCBhbmQgaGFzaCBjb21wb25lbnRzLlxyXG4gKlxyXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9yZW1peC1ydW4vaGlzdG9yeS90cmVlL21haW4vZG9jcy9hcGktcmVmZXJlbmNlLm1kI3BhcnNlcGF0aFxyXG4gKi9cblxuZnVuY3Rpb24gcGFyc2VQYXRoKHBhdGgpIHtcbiAgdmFyIHBhcnNlZFBhdGggPSB7fTtcblxuICBpZiAocGF0aCkge1xuICAgIHZhciBoYXNoSW5kZXggPSBwYXRoLmluZGV4T2YoJyMnKTtcblxuICAgIGlmIChoYXNoSW5kZXggPj0gMCkge1xuICAgICAgcGFyc2VkUGF0aC5oYXNoID0gcGF0aC5zdWJzdHIoaGFzaEluZGV4KTtcbiAgICAgIHBhdGggPSBwYXRoLnN1YnN0cigwLCBoYXNoSW5kZXgpO1xuICAgIH1cblxuICAgIHZhciBzZWFyY2hJbmRleCA9IHBhdGguaW5kZXhPZignPycpO1xuXG4gICAgaWYgKHNlYXJjaEluZGV4ID49IDApIHtcbiAgICAgIHBhcnNlZFBhdGguc2VhcmNoID0gcGF0aC5zdWJzdHIoc2VhcmNoSW5kZXgpO1xuICAgICAgcGF0aCA9IHBhdGguc3Vic3RyKDAsIHNlYXJjaEluZGV4KTtcbiAgICB9XG5cbiAgICBpZiAocGF0aCkge1xuICAgICAgcGFyc2VkUGF0aC5wYXRobmFtZSA9IHBhdGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlZFBhdGg7XG59XG5cbmV4cG9ydCB7IEFjdGlvbiwgY3JlYXRlQnJvd3Nlckhpc3RvcnksIGNyZWF0ZUhhc2hIaXN0b3J5LCBjcmVhdGVNZW1vcnlIaXN0b3J5LCBjcmVhdGVQYXRoLCBwYXJzZVBhdGggfTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWluZGV4LmpzLm1hcFxuIiwiaW1wb3J0IHsgRmV0Y2hQYXJhbXMgfSBmcm9tICdAb25lLWZvci1hbGwvYXBpLXNwZWMtYWRhcHRlcic7XG5pbXBvcnQgeyBBUElGZXRjaENhbGxiYWNrIH0gZnJvbSAnLi4nO1xuaW1wb3J0IHsgQVBJU3RhdGVXaXRoRmV0Y2gsIEFQSVN0YXRlLCBTdGF0ZXNIdWJBUEkgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGdldEFQSVN0YXRlcyhzdGF0ZXNIdWJBUEk6IFN0YXRlc0h1YkFQSSk6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIEFQSVN0YXRlV2l0aEZldGNoPj4ge1xuICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgQVBJU3RhdGU+Pj4gPSB7XG4gICAgZ2V0OiAodGFyZ2V0OiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBBUElTdGF0ZT4+LCBwOiBzdHJpbmcpOiBBUElTdGF0ZVdpdGhGZXRjaCA9PiB7XG4gICAgICBjb25zdCBhcGlTdGF0ZSA9IHN0YXRlc0h1YkFQSS5nZXRTdGF0ZSQocCkuZ2V0VmFsdWUoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYXBpU3RhdGUsXG4gICAgICAgIGZldGNoOiAoZmV0Y2hQYXJhbXM6IEZldGNoUGFyYW1zLCBjYWxsYmFjaz86IEFQSUZldGNoQ2FsbGJhY2spOiB2b2lkID0+IHtcbiAgICAgICAgICBzdGF0ZXNIdWJBUEkuZmV0Y2gocCwgeyBwYXJhbXM6IGZldGNoUGFyYW1zLCBjYWxsYmFjayB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVmcmVzaDogKCkgPT4gc3RhdGVzSHViQVBJLnJlZnJlc2gocCksXG4gICAgICB9O1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIG5ldyBQcm94eTxSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBBUElTdGF0ZVdpdGhGZXRjaD4+Pih7fSwgaGFuZGxlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFQSVN0YXRlcztcbiIsImltcG9ydCB0eXBlICogYXMgU2NoZW1hU3BlYyBmcm9tICdAb25lLWZvci1hbGwvc2NoZW1hLXNwZWMnO1xuXG5pbXBvcnQgeyBWZXJzYXRpbGVGdW5jLCBTdGF0ZUNvbnZlcnRvciB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzT2JqZWN0KG46IHVua25vd24pOiBib29sZWFuIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChuKSA9PT0gJ1tvYmplY3QgT2JqZWN0XSc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0Z1bmNTcGVjKG46IHVua25vd24pOiBib29sZWFuIHtcbiAgaWYgKCFpc09iamVjdChuKSB8fCB0eXBlb2YgbiAhPT0gJ29iamVjdCcgfHwgbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICgndHlwZScgaW4gbiAmJiBSZWZsZWN0LmdldChuLCAndHlwZScpID09PSAnc3RhdGVfY29udmVydF9leHByZXNzaW9uJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKE9iamVjdC5rZXlzKG4pLmxlbmd0aCA9PT0gMyAmJiAndHlwZScgaW4gbiAmJiAnYXJncycgaW4gbiAmJiAnYm9keScgaW4gbikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBpbnN0YW50aWF0ZVN0YXRlRXhwcmVzc2lvbihleHByZXNzaW9uOiBzdHJpbmcsIGN0eDogdW5rbm93bik6IFN0YXRlQ29udmVydG9yIHtcbiAgdHJ5IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbignc3RhdGUnLCBgcmV0dXJuICR7ZXhwcmVzc2lvbn1gKS5iaW5kKGN0eCk7XG4gICAgZm4udG9TdHJpbmcgPSAoKSA9PlxuICAgICAgWycnLCAnZnVuY3Rpb24gd3JhcHBlZFN0YXRlQ29udmVydG9yKHN0YXRlKSB7JywgYFxcdHJldHVybiAke2V4cHJlc3Npb259YCwgJ30nXS5qb2luKCdcXG4nKTtcblxuICAgIHJldHVybiBmbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBbJ2ZhaWxlZCB0byBpbnN0YW50aWF0ZSBzdGF0ZSBjb252ZXJ0IGV4cHJlc3Npb246JywgJ1xcbicsIGV4cHJlc3Npb24sICdcXG4nLCBlcnJvcl0uam9pbignJyksXG4gICAgKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaW5zdGFudGlhdGVGdW5jU3BlYyhcbiAgc3BlYzogU2NoZW1hU3BlYy5CYXNlRnVuY3Rpb25TcGVjIHwgU2NoZW1hU3BlYy5TdGF0ZUNvbnZlcnRFeHByZXNzaW9uLFxuICBjdHg6IHVua25vd24sXG4pOiBWZXJzYXRpbGVGdW5jIHtcbiAgaWYgKCdleHByZXNzaW9uJyBpbiBzcGVjICYmIHNwZWMudHlwZSA9PT0gJ3N0YXRlX2NvbnZlcnRfZXhwcmVzc2lvbicpIHtcbiAgICByZXR1cm4gaW5zdGFudGlhdGVTdGF0ZUV4cHJlc3Npb24oc3BlYy5leHByZXNzaW9uLCBjdHgpO1xuICB9XG5cbiAgdHJ5IHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICBjb25zdCBmbiA9IG5ldyBGdW5jdGlvbihzcGVjLmFyZ3MsIHNwZWMuYm9keSkuYmluZChjdHgpO1xuICAgIGZuLnRvU3RyaW5nID0gKCkgPT4gWycnLCBgZnVuY3Rpb24gd3JhcHBlZEZ1bmMoJHtzcGVjLmFyZ3N9KSB7YCwgYFxcdCR7c3BlYy5ib2R5fWAsICd9JywgJyddLmpvaW4oJ1xcbicpO1xuICAgIHJldHVybiBmbjtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICBbXG4gICAgICAgICdmYWlsZWQgdG8gaW5zdGFudGlhdGUgZnVuY3Rpb24gb2YgZm9sbG93aW5nIHNwZWM6JyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgICdzcGVjLmFyZ3M6JyxcbiAgICAgICAgc3BlYy5hcmdzLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgJ3NwZWMuYm9keTonLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgc3BlYy5ib2R5LFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgZXJyb3IsXG4gICAgICBdLmpvaW4oJycpLFxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGluc3RhbnRpYXRlRnVuY1NwZWMsIGlzT2JqZWN0LCBpc0Z1bmNTcGVjIH0gZnJvbSAnLi91dGlscyc7XG5cbmZ1bmN0aW9uIGluc3RhbnRpYXRlKG46IHVua25vd24sIGN0eDogdW5rbm93bik6IHVua25vd24ge1xuICBpZiAoIWlzT2JqZWN0KG4pIHx8IHR5cGVvZiBuICE9PSAnb2JqZWN0JyB8fCBuID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG47XG4gIH1cblxuICBPYmplY3QuZW50cmllcyhuKS5mb3JFYWNoKChba2V5LCB2XSkgPT4ge1xuICAgIGlmIChpc0Z1bmNTcGVjKHYpKSB7XG4gICAgICBSZWZsZWN0LnNldChuLCBrZXksIGluc3RhbnRpYXRlRnVuY1NwZWModiwgY3R4KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGlzT2JqZWN0KHYpKSB7XG4gICAgICBSZWZsZWN0LnNldChuLCBrZXksIGluc3RhbnRpYXRlKHYsIGN0eCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KHYpKSB7XG4gICAgICBSZWZsZWN0LnNldChcbiAgICAgICAgbixcbiAgICAgICAga2V5LFxuICAgICAgICB2Lm1hcCgoX3YpID0+IGluc3RhbnRpYXRlKF92LCBjdHgpKSxcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gbjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5zdGFudGlhdGU7XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHsgUmVuZGVyRW5naW5lQ1RYIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5pbXBvcnQgaW5zdGFudGlhdGUgZnJvbSAnLi9pbnN0YW50aWF0ZSc7XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplKG46IHVua25vd24sIGN0eDogUmVuZGVyRW5naW5lQ1RYIHwgdW5kZWZpbmVkKTogdW5rbm93biB8IG51bGwge1xuICB0cnkge1xuICAgIHJldHVybiBpbnN0YW50aWF0ZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG4pKSwgY3R4KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuZXJyb3IoZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlc2VyaWFsaXplO1xuIiwiaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwLCBPYnNlcnZhYmxlLCBvZiwgc2hhcmUsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgYWpheCwgQWpheENvbmZpZywgQWpheFJlc3BvbnNlIH0gZnJvbSAncnhqcy9hamF4JztcblxuaW1wb3J0IHR5cGUgeyBBUElTdGF0ZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxudHlwZSBSZXNwb25zZSA9IE9taXQ8QVBJU3RhdGUsICdsb2FkaW5nJz47XG50eXBlIFJlc3BvbnNlJCA9IE9ic2VydmFibGU8UmVzcG9uc2U+O1xuXG4vLyB0b2RvIHN1cHBvcnQgcmV0cnkgYW5kIHRpbWVvdXRcbmZ1bmN0aW9uIHNlbmRSZXF1ZXN0KGFqYXhSZXF1ZXN0OiBBamF4Q29uZmlnKTogUmVzcG9uc2UkIHtcbiAgcmV0dXJuIGFqYXgoYWpheFJlcXVlc3QpLnBpcGUoXG4gICAgbWFwPEFqYXhSZXNwb25zZTx1bmtub3duPiwgUmVzcG9uc2U+KCh7IHJlc3BvbnNlIH0pID0+ICh7IHJlc3VsdDogcmVzcG9uc2UsIGVycm9yOiB1bmRlZmluZWQgfSkpLFxuICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICByZXR1cm4gb2YoeyBlcnJvcjogZXJyb3IsIGRhdGE6IHVuZGVmaW5lZCB9KTtcbiAgICB9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaHR0cChyZXF1ZXN0JDogT2JzZXJ2YWJsZTxBamF4Q29uZmlnPik6IFJlc3BvbnNlJCB7XG4gIGNvbnN0IHJlc3BvbnNlJDogUmVzcG9uc2UkID0gcmVxdWVzdCQucGlwZShzd2l0Y2hNYXAoc2VuZFJlcXVlc3QpLCBzaGFyZSgpKTtcblxuICByZXR1cm4gcmVzcG9uc2UkO1xufVxuIiwiaW1wb3J0IHsgUmVzcG9uc2VBZGFwdGVyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FwaS1zcGVjLWFkYXB0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBamF4Q29uZmlnIH0gZnJvbSAncnhqcy9hamF4JztcbmltcG9ydCB7IG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgdHlwZSB7IEFQSVN0YXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5pbXBvcnQgaHR0cCBmcm9tICcuL2h0dHAnO1xuXG4vLyBBUEkgU3RhdGUgVGFibGVcbi8qXG4gICAgfCAgICAgfCBsb2FkaW5nIHwgICBkYXRhICAgIHwgICBlcnJvciAgIHxcbiAgICB8IC0tLSB8IDotLS0tLTogfCA6LS0tLS0tLTogfCA6LS0tLS0tLTogfFxuICAgIHwgMSAgIHwgIGZhbHNlICB8IHVuZGVmaW5lZCB8IHVuZGVmaW5lZCB8XG4gICAgfCAyICAgfCAgdHJ1ZSAgIHwgdW5kZWZpbmVkIHwgdW5kZWZpbmVkIHxcbuKUjOKUgOKUgOKWunwgMyAgIHwgIGZhbHNlICB8ICAgIHt9ICAgICB8IHVuZGVmaW5lZCB84peE4pSA4pSA4pSA4pSA4pSQXG7ilJTilIDilIDilIB8IDQgICB8ICB0cnVlICAgfCAgICB7fSAgICAgfCB1bmRlZmluZWQgfCAgICAg4pSCXG4gICAgfCA1ICAgfCAgZmFsc2UgIHwgdW5kZWZpbmVkIHwgICAgeHh4ICAgIHwgICAgIOKUglxuICAgIHwgNiAgIHwgIHRydWUgICB8IHVuZGVmaW5lZCB8ICAgIHh4eCAgICB84pSA4pSA4pSA4pSA4pSA4pSYXG4qL1xuZXhwb3J0IGNvbnN0IGluaXRpYWxTdGF0ZTogQVBJU3RhdGUgPSB7IHJlc3VsdDogdW5kZWZpbmVkLCBlcnJvcjogdW5kZWZpbmVkLCBsb2FkaW5nOiBmYWxzZSB9O1xuXG5mdW5jdGlvbiBnZXRSZXNwb25zZVN0YXRlJChcbiAgcmVxdWVzdCQ6IE9ic2VydmFibGU8QWpheENvbmZpZz4sXG4gIHJlc3BvbnNlQWRhcHRlcj86IFJlc3BvbnNlQWRhcHRlcixcbik6IEJlaGF2aW9yU3ViamVjdDxBUElTdGF0ZT4ge1xuICBjb25zdCBzdGF0ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPihpbml0aWFsU3RhdGUpO1xuICBjb25zdCByZXNwb25zZSQgPSBodHRwKHJlcXVlc3QkKTtcblxuICByZXNwb25zZSRcbiAgICAucGlwZShcbiAgICAgIG1hcCgoeyByZXN1bHQsIGVycm9yIH0pID0+ICh7IHJlc3VsdCwgZXJyb3IsIGxvYWRpbmc6IGZhbHNlIH0pKSxcbiAgICAgIG1hcDxBUElTdGF0ZSwgQVBJU3RhdGU+KChhcGlTdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIXJlc3BvbnNlQWRhcHRlcikge1xuICAgICAgICAgIHJldHVybiBhcGlTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gcmVzcG9uc2VBZGFwdGVyKHsgYm9keTogYXBpU3RhdGUucmVzdWx0LCBlcnJvcjogYXBpU3RhdGUuZXJyb3IgfSk7XG5cbiAgICAgICAgcmV0dXJuIHsgLi4udHJhbnNmb3JtZWQsIGxvYWRpbmc6IGFwaVN0YXRlLmxvYWRpbmcgfTtcbiAgICAgIH0pLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKHN0YXRlJCk7XG5cbiAgcmVxdWVzdCRcbiAgICAucGlwZShcbiAgICAgIGZpbHRlcigoKSA9PiBzdGF0ZSQuZ2V0VmFsdWUoKS5sb2FkaW5nID09PSBmYWxzZSksXG4gICAgICBtYXAoKCkgPT4gKHsgLi4uc3RhdGUkLmdldFZhbHVlKCksIGxvYWRpbmc6IHRydWUgfSkpLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKHN0YXRlJCk7XG5cbiAgcmV0dXJuIHN0YXRlJDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVzcG9uc2VTdGF0ZSQ7XG4iLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBtYXAsIGZpbHRlciwgc2hhcmUsIHNraXAsIGRlbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHR5cGUgeyBBUElTcGVjQWRhcHRlciwgRmV0Y2hQYXJhbXMgfSBmcm9tICdAb25lLWZvci1hbGwvYXBpLXNwZWMtYWRhcHRlcic7XG5cbmltcG9ydCB0eXBlIHsgRmV0Y2hPcHRpb24sIEFQSVN0YXRlJFdpdGhBY3Rpb25zIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGdldFJlc3BvbnNlU3RhdGUkIGZyb20gJy4vaHR0cC9yZXNwb25zZSc7XG5cbmZ1bmN0aW9uIGluaXRBUElTdGF0ZShhcGlJRDogc3RyaW5nLCBhcGlTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIpOiBBUElTdGF0ZSRXaXRoQWN0aW9ucyB7XG4gIGNvbnN0IHBhcmFtcyQgPSBuZXcgU3ViamVjdDxGZXRjaFBhcmFtcyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgcmVxdWVzdCQgPSBwYXJhbXMkLnBpcGUoXG4gICAgLy8gaXQgaXMgYWRhcHRlcidzIHJlc3BvbnNpYmlsaXR5IHRvIGhhbmRsZSBidWlsZCBlcnJvclxuICAgIC8vIGlmIGEgZXJyb3Igb2NjdXJyZWQsIGJ1aWxkIHNob3VsZCByZXR1cm4gdW5kZWZpbmVkXG4gICAgbWFwKChwYXJhbXMpID0+IGFwaVNwZWNBZGFwdGVyLmJ1aWxkKGFwaUlELCBwYXJhbXMpKSxcbiAgICBmaWx0ZXIoQm9vbGVhbiksXG4gICAgc2hhcmUoKSxcbiAgKTtcblxuICBsZXQgX2xhdGVzdEZldGNoT3B0aW9uOiBGZXRjaE9wdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgY29uc3QgYXBpU3RhdGUkID0gZ2V0UmVzcG9uc2VTdGF0ZSQocmVxdWVzdCQsIGFwaVNwZWNBZGFwdGVyLnJlc3BvbnNlQWRhcHRlcik7XG5cbiAgLy8gZXhlY3V0ZSBmZXRjaCBjYWxsYmFjayBhZnRlciBuZXcgYHJlc3VsdGAgZW1pdHRlZCBmcm9tIGFwaVN0YXRlJFxuICBhcGlTdGF0ZSRcbiAgICAucGlwZShcbiAgICAgIHNraXAoMSksXG4gICAgICBmaWx0ZXIoKHsgbG9hZGluZyB9KSA9PiAhbG9hZGluZyksXG4gICAgICAvLyBiZWNhdXNlIHRoaXMgc3Vic2NyaXB0aW9uIGlzIGhhcHBlbmVkIGJlZm9yZSB0aGFuIHZpZXcncyxcbiAgICAgIC8vIHNvIGRlbGF5IGBjYWxsYmFja2AgZXhlY3V0aW9uIHRvIG5leHQgZnJhbWUuXG4gICAgICBkZWxheSgxMCksXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiB7XG4gICAgICBfbGF0ZXN0RmV0Y2hPcHRpb24/LmNhbGxiYWNrPy4oc3RhdGUpO1xuICAgIH0pO1xuXG4gIHJldHVybiB7XG4gICAgc3RhdGUkOiBhcGlTdGF0ZSQsXG4gICAgZmV0Y2g6IChmZXRjaE9wdGlvbjogRmV0Y2hPcHRpb24pID0+IHtcbiAgICAgIF9sYXRlc3RGZXRjaE9wdGlvbiA9IGZldGNoT3B0aW9uO1xuXG4gICAgICBwYXJhbXMkLm5leHQoZmV0Y2hPcHRpb24ucGFyYW1zKTtcbiAgICB9LFxuICAgIHJlZnJlc2g6ICgpID0+IHtcbiAgICAgIGlmICghX2xhdGVzdEZldGNoT3B0aW9uKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIC8vIG92ZXJyaWRlIG9uU3VjY2VzcyBhbmQgb25FcnJvciB0byB1bmRlZmluZWRcbiAgICAgIF9sYXRlc3RGZXRjaE9wdGlvbiA9IHsgcGFyYW1zOiBfbGF0ZXN0RmV0Y2hPcHRpb24ucGFyYW1zIH07XG4gICAgICBwYXJhbXMkLm5leHQoX2xhdGVzdEZldGNoT3B0aW9uLnBhcmFtcyk7XG4gICAgfSxcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdEFQSVN0YXRlO1xuIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBub29wIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgdHlwZSB7IEFQSVNwZWNBZGFwdGVyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FwaS1zcGVjLWFkYXB0ZXInO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHR5cGUgeyBTdGF0ZXNIdWJBUEksIEFQSVN0YXRlLCBBUElTdGF0ZXNTcGVjLCBGZXRjaE9wdGlvbiwgQVBJU3RhdGUkV2l0aEFjdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpbml0aWFsU3RhdGUgfSBmcm9tICcuL2h0dHAvcmVzcG9uc2UnO1xuaW1wb3J0IGluaXRBUElTdGF0ZSBmcm9tICcuL2luaXQtYXBpLXN0YXRlJztcblxudHlwZSBDYWNoZSA9IFJlY29yZDxzdHJpbmcsIEFQSVN0YXRlJFdpdGhBY3Rpb25zPjtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgYXBpU3BlY0FkYXB0ZXI/OiBBUElTcGVjQWRhcHRlcjtcbiAgYXBpU3RhdGVTcGVjOiBBUElTdGF0ZXNTcGVjO1xufVxuXG5jb25zdCBkdW1teVN0YXRlJFdpdGhBY3Rpb246IEFQSVN0YXRlJFdpdGhBY3Rpb25zID0ge1xuICBzdGF0ZSQ6IG5ldyBCZWhhdmlvclN1YmplY3Q8QVBJU3RhdGU+KGluaXRpYWxTdGF0ZSksXG4gIGZldGNoOiBub29wLFxuICByZWZyZXNoOiBub29wLFxufTtcblxuY29uc3QgZHVtbXlBUElTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIgPSB7XG4gIGJ1aWxkOiAoKSA9PiAoeyB1cmw6ICcvYXBpJywgbWV0aG9kOiAnZ2V0JyB9KSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1YiBpbXBsZW1lbnRzIFN0YXRlc0h1YkFQSSB7XG4gIHB1YmxpYyBjYWNoZTogQ2FjaGU7XG4gIHB1YmxpYyBwYXJlbnRIdWI/OiBTdGF0ZXNIdWJBUEkgPSB1bmRlZmluZWQ7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHsgYXBpU3RhdGVTcGVjLCBhcGlTcGVjQWRhcHRlciB9OiBQcm9wcywgcGFyZW50SHViPzogU3RhdGVzSHViQVBJKSB7XG4gICAgdGhpcy5wYXJlbnRIdWIgPSBwYXJlbnRIdWI7XG5cbiAgICB0aGlzLmNhY2hlID0gT2JqZWN0LmVudHJpZXMoYXBpU3RhdGVTcGVjKS5yZWR1Y2U8Q2FjaGU+KChhY2MsIFtzdGF0ZUlELCB7IGFwaUlEIH1dKSA9PiB7XG4gICAgICBhY2Nbc3RhdGVJRF0gPSBpbml0QVBJU3RhdGUoYXBpSUQsIGFwaVNwZWNBZGFwdGVyIHx8IGR1bW15QVBJU3BlY0FkYXB0ZXIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwdWJsaWMgaGFzU3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gISF0aGlzLnBhcmVudEh1Yj8uaGFzU3RhdGUkKHN0YXRlSUQpO1xuICB9XG5cbiAgcHVibGljIGZpbmRTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogQVBJU3RhdGUkV2l0aEFjdGlvbnMgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtzdGF0ZUlEXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJlbnRIdWI/LmZpbmRTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDxBUElTdGF0ZT4ge1xuICAgIGNvbnN0IHsgc3RhdGUkIH0gPSB0aGlzLmZpbmRTdGF0ZSQoc3RhdGVJRCkgfHwge307XG4gICAgaWYgKHN0YXRlJCkge1xuICAgICAgcmV0dXJuIHN0YXRlJDtcbiAgICB9XG5cbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICBbXG4gICAgICAgIGBjYW4ndCBmaW5kIGFwaSBzdGF0ZTogJHtzdGF0ZUlEfSwgcGxlYXNlIGNoZWNrIGFwaVN0YXRlU3BlYyBvciBwYXJlbnQgc2NoZW1hLmAsXG4gICAgICAgICdJbiBvcmRlciB0byBwcmV2ZW50IFVJIGNyYXNoLCBhIGR1bW15U3RhdGUkIHdpbGwgYmUgcmV0dXJuZWQuJyxcbiAgICAgIF0uam9pbignICcpLFxuICAgICk7XG5cbiAgICByZXR1cm4gZHVtbXlTdGF0ZSRXaXRoQWN0aW9uLnN0YXRlJDtcbiAgfVxuXG4gIHB1YmxpYyBmZXRjaChzdGF0ZUlEOiBzdHJpbmcsIGZldGNoT3B0aW9uOiBGZXRjaE9wdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHsgZmV0Y2ggfSA9IHRoaXMuZmluZFN0YXRlJChzdGF0ZUlEKSB8fCB7fTtcbiAgICBpZiAoZmV0Y2gpIHtcbiAgICAgIGZldGNoKGZldGNoT3B0aW9uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICBbXG4gICAgICAgIGBjYW4ndCBmaW5kIGFwaSBzdGF0ZTogJHtzdGF0ZUlEfSwgcGxlYXNlIGNoZWNrIGFwaVN0YXRlU3BlYyBvciBwYXJlbnQgc2NoZW1hLGAsXG4gICAgICAgICd0aGlzIGZldGNoIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQuJyxcbiAgICAgIF0uam9pbignICcpLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVmcmVzaChzdGF0ZUlEOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCB7IHJlZnJlc2ggfSA9IHRoaXMuZmluZFN0YXRlJChzdGF0ZUlEKSB8fCB7fTtcbiAgICBpZiAocmVmcmVzaCkge1xuICAgICAgcmVmcmVzaCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEsYCxcbiAgICAgICAgJ3RoaXMgcmVmcmVzaCBhY3Rpb24gd2lsbCBiZSBpZ25vcmVkLicsXG4gICAgICBdLmpvaW4oJyAnKSxcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IFNoYXJlZFN0YXRlSHViIGZyb20gJy4vc3RhdGVzLWh1Yi1zaGFyZWQnO1xuXG5mdW5jdGlvbiBnZXRTaGFyZWRTdGF0ZXMoc3RhdGVzSHViU2hhcmVkOiBTaGFyZWRTdGF0ZUh1Yik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgaGFuZGxlcjogUHJveHlIYW5kbGVyPFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHVua25vd24+Pj4gPSB7XG4gICAgZ2V0OiAodGFyZ2V0OiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PiwgcDogc3RyaW5nKTogdW5rbm93biA9PiB7XG4gICAgICByZXR1cm4gc3RhdGVzSHViU2hhcmVkLmdldFN0YXRlJChwKS52YWx1ZTtcbiAgICB9LFxuXG4gICAgc2V0OiAodGFyZ2V0OiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PiwgcDogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKHAuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignbm9kZSBpbnRlcm5hbCBzdGF0ZSBjYW4gbm90IGJlIGFzc2lnbmVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGVzSHViU2hhcmVkLm11dGF0ZVN0YXRlKHAsIHZhbHVlKTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb3h5PFJlY29yZDxzdHJpbmcsIHVua25vd24+Pih7fSwgaGFuZGxlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFNoYXJlZFN0YXRlcztcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgU3RhdGVzSHViU2hhcmVkLCBTaGFyZWRTdGF0ZXNTcGVjIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdWIgaW1wbGVtZW50cyBTdGF0ZXNIdWJTaGFyZWQge1xuICBwdWJsaWMgY2FjaGU6IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj47XG4gIHB1YmxpYyBwYXJlbnRIdWI/OiBTdGF0ZXNIdWJTaGFyZWQgPSB1bmRlZmluZWQ7XG4gIHB1YmxpYyB1bldyaXRlYWJsZVN0YXRlczogc3RyaW5nW10gPSBbXTtcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc3BlYzogU2hhcmVkU3RhdGVzU3BlYywgcGFyZW50SHViPzogU3RhdGVzSHViU2hhcmVkKSB7XG4gICAgdGhpcy5wYXJlbnRIdWIgPSBwYXJlbnRIdWI7XG4gICAgdGhpcy5jYWNoZSA9IE9iamVjdC5lbnRyaWVzKHNwZWMpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtzdGF0ZUlELCB7IGluaXRpYWwsIHdyaXRlYWJsZSB9XSkgPT4ge1xuICAgICAgICBhY2Nbc3RhdGVJRF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGluaXRpYWwpO1xuICAgICAgICBpZiAod3JpdGVhYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMudW5Xcml0ZWFibGVTdGF0ZXMucHVzaChzdGF0ZUlEKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIHt9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgaGFzU3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gISF0aGlzLnBhcmVudEh1Yj8uaGFzU3RhdGUkKHN0YXRlSUQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlU3RhdGUkKHN0YXRlSUQ6IHN0cmluZywgaW5pdGlhbFZhbHVlPzogdW5rbm93bik6IHZvaWQge1xuICAgIHRoaXMuY2FjaGVbc3RhdGVJRF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgZmluZFN0YXRlJChzdGF0ZUlEOiBzdHJpbmcpOiBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4gfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtzdGF0ZUlEXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJlbnRIdWI/LmZpbmRTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDx1bmtub3duPiB7XG4gICAgY29uc3Qgc3RhdGUkID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpO1xuICAgIGlmIChzdGF0ZSQpIHtcbiAgICAgIHJldHVybiBzdGF0ZSQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY3JlYXRlU3RhdGUkKHN0YXRlSUQpO1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGVbc3RhdGVJRF07XG4gIH1cblxuICBwdWJsaWMgbXV0YXRlU3RhdGUoc3RhdGVJRDogc3RyaW5nLCBzdGF0ZTogdW5rbm93bik6IHZvaWQge1xuICAgIGlmIChzdGF0ZUlELnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgbG9nZ2VyLndhcm4oJ3NoYXJlZCBzdGF0ZUlEIGNhbiBub3Qgc3RhcnRzIHdpdGggJCwgdGhpcyBhY3Rpb24gd2lsbCBiZSBpZ25vcmVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudW5Xcml0ZWFibGVTdGF0ZXMuaW5jbHVkZXMoc3RhdGVJRCkpIHtcbiAgICAgIGxvZ2dlci53YXJuKCd0aGlzIHNoYXJlZCBzdGF0ZSBpcyBub3QgYWxsb3dlZCB0byBiZSB3cml0dGVuLCB0aGlzIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmdldFN0YXRlJChzdGF0ZUlEKS5uZXh0KHN0YXRlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROb2RlU3RhdGUkKG5vZGVQYXRoOiBzdHJpbmcpOiBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4ge1xuICAgIGNvbnN0IHN0YXRlSUQgPSBgJCR7bm9kZVBhdGh9YDtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZXhwb3NlTm9kZVN0YXRlKG5vZGVQYXRoOiBzdHJpbmcsIHN0YXRlOiB1bmtub3duKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhdGVJRCA9IGAkJHtub2RlUGF0aH1gO1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICB0aGlzLmNhY2hlW3N0YXRlSURdLm5leHQoc3RhdGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NyZWF0ZVN0YXRlJChzdGF0ZUlELCBzdGF0ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFQSVNwZWNBZGFwdGVyLCBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIGZpcnN0VmFsdWVGcm9tLCBmcm9tLCBsYXN0LCBtYXAsIE9ic2VydmFibGUsIG9mLCBzd2l0Y2hNYXAsIHRha2UsIHRhcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQVBJU3RhdGVzU3BlYywgU2hhcmVkU3RhdGVzU3BlYywgSW5pdGlhbGl6ZXJGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGluaXRBUElTdGF0ZSBmcm9tICcuL2luaXQtYXBpLXN0YXRlJztcblxuaW50ZXJmYWNlIExhenlTdGF0ZSB7XG4gIHN0YXRlSUQ6IHN0cmluZztcbiAgZnVuYzogSW5pdGlhbGl6ZXJGdW5jO1xuICBkZXBlbmRlbmNpZXM/OiB7XG4gICAgW2tleTogc3RyaW5nXTogRmV0Y2hQYXJhbXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvRGVwZW5kZW5jeSQoXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbiAgYXBpSUQ6IHN0cmluZyxcbiAgcGFyYW1zOiBGZXRjaFBhcmFtcyxcbik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCB7IHN0YXRlJCwgZmV0Y2ggfSA9IGluaXRBUElTdGF0ZShhcGlJRCwgYXBpU3BlY0FkYXB0ZXIpO1xuXG4gIC8vIHdlIG9ubHkgbmVlZCB0aGUgYXBpIHJlc3VsdFxuICBjb25zdCBkZXBlbmRlbmN5JCA9IHN0YXRlJC5waXBlKFxuICAgIC8vIGxvYWRpbmcsIHJlc29sdmVkXG4gICAgdGFrZSgyKSxcbiAgICBsYXN0KCksXG4gICAgbWFwKCh7IHJlc3VsdCB9KSA9PiByZXN1bHQpLFxuICApO1xuXG4gIGZldGNoKHsgcGFyYW1zIH0pO1xuXG4gIHJldHVybiBkZXBlbmRlbmN5JDtcbn1cblxuZnVuY3Rpb24gdG9EZXBzJChcbiAgZGVwczogUmVjb3JkPHN0cmluZywgRmV0Y2hQYXJhbXM+LFxuICBhcGlTdGF0ZXM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbik6IE9ic2VydmFibGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgY29uc3QgZGVwZW5kZW5jaWVzJCA9IE9iamVjdC5lbnRyaWVzKGRlcHMpXG4gICAgLm1hcCgoW3N0YXRlSUQsIGZldGNoUGFyYW1zXSkgPT4ge1xuICAgICAgaWYgKCFhcGlTdGF0ZXNbc3RhdGVJRF0pIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgIGBubyBzdGF0ZTogJHtzdGF0ZUlEfSBmb3VuZCBpbiBBUElTdGF0ZXNTcGVjLCB1bmRlZmluZWQgd2lsbCBiZSB1c2VkIGFzIHRoaXMgZGVwZW5kZW5jeSB2YWx1ZWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYXBpSUQgfSA9IGFwaVN0YXRlc1tzdGF0ZUlEXTtcblxuICAgICAgcmV0dXJuIFtzdGF0ZUlELCB0b0RlcGVuZGVuY3kkKGFwaVNwZWNBZGFwdGVyLCBhcGlJRCwgZmV0Y2hQYXJhbXMpXTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj5dID0+ICEhcGFpcilcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgZGVwZW5kZW5jeSRdKSA9PiB7XG4gICAgICBhY2Nbc3RhdGVJRF0gPSBkZXBlbmRlbmN5JDtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuXG4gIGlmICghT2JqZWN0LmtleXMoZGVwZW5kZW5jaWVzJCkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG9mKHt9KTtcbiAgfVxuXG4gIHJldHVybiBjb21iaW5lTGF0ZXN0KGRlcGVuZGVuY2llcyQpO1xufVxuXG5mdW5jdGlvbiBwcm9taXNpZnkoZnVuYzogSW5pdGlhbGl6ZXJGdW5jKTogKHA6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiBQcm9taXNlPHVua25vd24+IHtcbiAgcmV0dXJuIChwOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICAoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmdW5jKHApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9PYnNlcnZhYmxlTWFwKFxuICBsYXp5U3RhdGVzOiBMYXp5U3RhdGVbXSxcbiAgYXBpU3RhdGVTcGVjOiBBUElTdGF0ZXNTcGVjLFxuICBhcGlTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIsXG4pOiBSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+PiB7XG4gIHJldHVybiBsYXp5U3RhdGVzXG4gICAgLm1hcDxbc3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+XT4oKHsgc3RhdGVJRCwgZnVuYywgZGVwZW5kZW5jaWVzIH0pID0+IHtcbiAgICAgIGNvbnN0IGRlcHMkID0gdG9EZXBzJChkZXBlbmRlbmNpZXMgfHwge30sIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICAgICAgY29uc3Qgc3RhdGUkID0gZGVwcyQucGlwZShcbiAgICAgICAgc3dpdGNoTWFwKChkZXBzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGZyb20ocHJvbWlzaWZ5KGZ1bmMpKGRlcHMpKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gW3N0YXRlSUQsIHN0YXRlJF07XG4gICAgfSlcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW3N0YXRlSURdID0gc3RhdGUkO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBmaWx0ZXJMYXp5U3RhdGVzIHJldHVybiBhIGxpc3Qgb2Ygc3RhdGUgd2hpY2ggcmVxdWlyZWQgbGF6eSBpbml0aWFsaXphdGlvblxuICogQHBhcmFtIHNoYXJlZFN0YXRlU3BlYyAtIFNoYXJlZFN0YXRlc1NwZWNcbiAqL1xuZnVuY3Rpb24gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWM6IFNoYXJlZFN0YXRlc1NwZWMpOiBBcnJheTxMYXp5U3RhdGU+IHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHNoYXJlZFN0YXRlU3BlYylcbiAgICAubWFwKChbc3RhdGVJRCwgeyBpbml0aWFsaXplciB9XSkgPT4ge1xuICAgICAgaWYgKGluaXRpYWxpemVyKSB7XG4gICAgICAgIHJldHVybiB7IC4uLmluaXRpYWxpemVyLCBzdGF0ZUlEIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9KVxuICAgIC5maWx0ZXIoKGxhenlTdGF0ZSk6IGxhenlTdGF0ZSBpcyBMYXp5U3RhdGUgPT4gISFsYXp5U3RhdGUpO1xufVxuXG4vKipcbiAqIGluaXRpYWxpemVMYXp5U3RhdGVzIHdpbGwgd2FpdCBmb3IgYWxsIHRoZSBkZXBlbmRlbmNpZXMgdG8gYmUgcmVzb2x2ZWQsXG4gKiB0aGVuIGNhbGwgdGhlIGluaXRpYWxpemUgZnVuY3Rpb24sIHRoZW4gcmV0dXJuIHRoZSBmaW5pYWwgc2hhcmVkIHN0YXRlcy5cbiAqIEBwYXJhbSBzaGFyZWRTdGF0ZVNwZWMgLSB0aGUgb3JpZ2luYWwgc2hhcmVkU3RhdGVTcGVjXG4gKiBAcGFyYW0gYXBpU3RhdGVTcGVjIC0gQVBJU3RhdGVzU3BlYyBpbiBzY2hlbWFcbiAqIEBwYXJhbSBhcGlTcGVjQWRhcHRlciAtIEFQSVNwZWNBZGFwdGVyIHBsdWdpblxuICogQHJldHVybnMgaW5pdGlhbGl6ZWQgc2hhcmVkIHN0YXRlc1xuICovXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplTGF6eVN0YXRlcyhcbiAgc2hhcmVkU3RhdGVTcGVjOiBTaGFyZWRTdGF0ZXNTcGVjLFxuICBhcGlTdGF0ZVNwZWM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyPzogQVBJU3BlY0FkYXB0ZXIsXG4pOiBQcm9taXNlPFNoYXJlZFN0YXRlc1NwZWM+IHtcbiAgaWYgKCFhcGlTcGVjQWRhcHRlcikge1xuICAgIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG4gIH1cblxuICBjb25zdCBsYXp5U3RhdGVzID0gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWMpO1xuICAvLyB0dXJuIGxhenkgc3RhdGVzIHRvIG9ic2VydmFibGVzXG4gIGNvbnN0IG9ic1N0YXRlTWFwID0gdG9PYnNlcnZhYmxlTWFwKGxhenlTdGF0ZXMsIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICBpZiAoIU9iamVjdC5rZXlzKG9ic1N0YXRlTWFwKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc2hhcmVkU3RhdGVTcGVjO1xuICB9XG5cbiAgLy8gd2FpdCBmb3IgYWxsIHRoZSBvYnNlcnZhYmxlcyBlbWl0IHZhbHVlXG4gIGNvbnN0IGxhenlTdGF0ZXNNYXAgPSBhd2FpdCBmaXJzdFZhbHVlRnJvbShjb21iaW5lTGF0ZXN0KG9ic1N0YXRlTWFwKSk7XG5cbiAgLy8gbWVyZ2Ugd2l0aCBvcmlnaW5hbCBzdGF0ZXNcbiAgT2JqZWN0LmVudHJpZXMobGF6eVN0YXRlc01hcCkuZm9yRWFjaCgoW3N0YXRlSUQsIHZhbHVlXSkgPT4ge1xuICAgIHNoYXJlZFN0YXRlU3BlY1tzdGF0ZUlEXS5pbml0aWFsID0gdmFsdWU7XG4gIH0pO1xuXG4gIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpemVMYXp5U3RhdGVzO1xuIiwiaW1wb3J0IHsgY3JlYXRlQnJvd3Nlckhpc3RvcnkgfSBmcm9tICdoaXN0b3J5JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IFNjaGVtYVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IGdldEFQSVN0YXRlcyBmcm9tICcuL2FwaS1zdGF0ZXMnO1xuaW1wb3J0IGRlc2VyaWFsaXplIGZyb20gJy4vZGVzZXJpYWxpemUnO1xuaW1wb3J0IFN0YXRlc0h1YkFQSSBmcm9tICcuL3N0YXRlcy1odWItYXBpJztcbmltcG9ydCBnZXRTaGFyZWRTdGF0ZXMgZnJvbSAnLi9zaGFyZWQtc3RhdGVzJztcbmltcG9ydCBTdGF0ZXNIdWJTaGFyZWQgZnJvbSAnLi9zdGF0ZXMtaHViLXNoYXJlZCc7XG5pbXBvcnQgaW5pdGlhbGl6ZUxhenlTdGF0ZXMgZnJvbSAnLi9pbml0aWFsaXplLWxhenktc2hhcmVkLXN0YXRlcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUGx1Z2lucywgU2NoZW1hTm9kZSwgU2hhcmVkU3RhdGVzU3BlYyB9IGZyb20gJy4uL3R5cGVzJztcblxuaW50ZXJmYWNlIFBhcmFtcyB7XG4gIHNjaGVtYTogU2NoZW1hU3BlYy5TY2hlbWE7XG4gIHBhcmVudENUWD86IENUWDtcbiAgcGx1Z2lucz86IFBsdWdpbnM7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGluaXRDVFgoeyBzY2hlbWEsIHBhcmVudENUWCwgcGx1Z2lucyB9OiBQYXJhbXMpOiBQcm9taXNlPHsgY3R4OiBDVFg7IHJvb3ROb2RlOiBTY2hlbWFOb2RlIH0+IHtcbiAgY29uc3QgeyBhcGlTdGF0ZVNwZWMsIHNoYXJlZFN0YXRlc1NwZWMgfSA9IHNjaGVtYTtcbiAgY29uc3QgeyBhcGlTcGVjQWRhcHRlciwgcmVwb3NpdG9yeSwgcmVmTG9hZGVyLCBjb21wb25lbnRMb2FkZXIgfSA9IHBsdWdpbnMgfHwge307XG5cbiAgY29uc3Qgc3RhdGVzSHViQVBJID0gbmV3IFN0YXRlc0h1YkFQSShcbiAgICB7XG4gICAgICAvLyBUT0RPOiB0aHJvdyBlcnJvciBpbnN0ZWFkIG9mIHRvbGVyYXRpbmcgaXRcbiAgICAgIGFwaVNwZWNBZGFwdGVyOiBhcGlTcGVjQWRhcHRlcixcbiAgICAgIGFwaVN0YXRlU3BlYzogYXBpU3RhdGVTcGVjIHx8IHt9LFxuICAgIH0sXG4gICAgcGFyZW50Q1RYPy5zdGF0ZXNIdWJBUEksXG4gICk7XG5cbiAgY29uc3QgaW5zdGFudGlhdGVTcGVjID0gZGVzZXJpYWxpemUoc2hhcmVkU3RhdGVzU3BlYyB8fCB7fSwgdW5kZWZpbmVkKSBhcyBTaGFyZWRTdGF0ZXNTcGVjIHwgbnVsbDtcbiAgY29uc3QgaW5pdGlhbGl6ZWRTdGF0ZSA9IGF3YWl0IGluaXRpYWxpemVMYXp5U3RhdGVzKFxuICAgIGluc3RhbnRpYXRlU3BlYyB8fCB7fSxcbiAgICBhcGlTdGF0ZVNwZWMgfHwge30sXG4gICAgYXBpU3BlY0FkYXB0ZXIsXG4gICk7XG4gIGNvbnN0IHN0YXRlc0h1YlNoYXJlZCA9IG5ldyBTdGF0ZXNIdWJTaGFyZWQoaW5pdGlhbGl6ZWRTdGF0ZSwgcGFyZW50Q1RYPy5zdGF0ZXNIdWJTaGFyZWQpO1xuXG4gIGNvbnN0IGhpc3RvcnkgPSBwYXJlbnRDVFg/Lmhpc3RvcnkgfHwgY3JlYXRlQnJvd3Nlckhpc3RvcnkoKTtcbiAgY29uc3QgbG9jYXRpb24kID0gcGFyZW50Q1RYPy5sb2NhdGlvbiQgfHwgbmV3IEJlaGF2aW9yU3ViamVjdChoaXN0b3J5LmxvY2F0aW9uKTtcblxuICBpZiAoIXBhcmVudENUWD8ubG9jYXRpb24kKSB7XG4gICAgaGlzdG9yeS5saXN0ZW4oKHsgbG9jYXRpb24gfSkgPT4ge1xuICAgICAgbG9jYXRpb24kLm5leHQobG9jYXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgY3R4OiBDVFggPSB7XG4gICAgc3RhdGVzSHViQVBJOiBzdGF0ZXNIdWJBUEksXG4gICAgc3RhdGVzSHViU2hhcmVkOiBzdGF0ZXNIdWJTaGFyZWQsXG5cbiAgICBhcGlTdGF0ZXM6IGdldEFQSVN0YXRlcyhzdGF0ZXNIdWJBUEkpLFxuICAgIHN0YXRlczogZ2V0U2hhcmVkU3RhdGVzKHN0YXRlc0h1YlNoYXJlZCksXG4gICAgaGlzdG9yeSxcbiAgICBsb2NhdGlvbiQsXG5cbiAgICBwbHVnaW5zOiB7XG4gICAgICByZXBvc2l0b3J5OiByZXBvc2l0b3J5IHx8IHBhcmVudENUWD8ucGx1Z2lucz8ucmVwb3NpdG9yeSxcbiAgICAgIHJlZkxvYWRlcjogcmVmTG9hZGVyIHx8IHBhcmVudENUWD8ucGx1Z2lucz8ucmVmTG9hZGVyLFxuICAgICAgY29tcG9uZW50TG9hZGVyOiBjb21wb25lbnRMb2FkZXIgfHwgcGFyZW50Q1RYPy5wbHVnaW5zPy5jb21wb25lbnRMb2FkZXIsXG4gICAgfSxcbiAgfTtcblxuICAvLyB0b2RvIGhhbmRsZSBlcnJvclxuICBjb25zdCByb290Tm9kZSA9IGRlc2VyaWFsaXplKHNjaGVtYS5ub2RlLCB7IGFwaVN0YXRlczogY3R4LmFwaVN0YXRlcywgc3RhdGVzOiBjdHguc3RhdGVzLCBoaXN0b3J5OiBjdHguaGlzdG9yeSB9KSBhcyBTY2hlbWFOb2RlO1xuXG4gIHJldHVybiB7IGN0eCwgcm9vdE5vZGUgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5pdENUWDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IFBhdGhDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dDxzdHJpbmc+KCdST09UJyk7XG5cbmV4cG9ydCBkZWZhdWx0IFBhdGhDb250ZXh0O1xuIiwiaW1wb3J0IHR5cGUgeyBDb25zdGFudFByb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IHsgU2NoZW1hTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQ29uc3RhbnRQcm9wcyhub2RlOiBTY2hlbWFOb2RlKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBpZiAoIW5vZGUucHJvcHMpIHtcbiAgICByZXR1cm4ge307XG4gIH1cblxuICByZXR1cm4gT2JqZWN0LmVudHJpZXMobm9kZS5wcm9wcylcbiAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbc3RyaW5nLCBDb25zdGFudFByb3BlcnR5XSA9PiB7XG4gICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnY29uc3RhbnRfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgeyB2YWx1ZSB9XSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSB2YWx1ZTtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xufVxuIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0V2l0aCwgbWFwLCBvZiwgc2tpcCwgdGFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBDb21wdXRlZERlcGVuZGVuY3kgfSBmcm9tICdAb25lLWZvci1hbGwvc2NoZW1hLXNwZWMnO1xuXG5pbXBvcnQgeyBDVFgsIFN0YXRlQ29udmVydG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgQ29udmVydFJlc3VsdFBhcmFtcyB7XG4gIHN0YXRlOiB1bmtub3duO1xuICBjb252ZXJ0b3I/OiBTdGF0ZUNvbnZlcnRvcjtcbiAgZmFsbGJhY2s6IHVua25vd247XG4gIHByb3BOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0U3RhdGUoeyBzdGF0ZSwgY29udmVydG9yLCBmYWxsYmFjaywgcHJvcE5hbWUgfTogQ29udmVydFJlc3VsdFBhcmFtcyk6IHVua25vd24ge1xuICBpZiAoY29udmVydG9yICYmIHN0YXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRvcihzdGF0ZSkgPz8gZmFsbGJhY2s7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgYGFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgc3RhdGUgY29udmVydG9yIGZvciBwcm9wOiBcIiR7cHJvcE5hbWV9XCJgLFxuICAgICAgICAnd2l0aCB0aGUgZm9sbG93aW5nIHN0YXRlIGFuZCBjb252ZXJ0b3I6JyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgY29udmVydG9yLnRvU3RyaW5nKCksXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnU28gcmV0dXJuIGZhbGxiYWNrIGluc3RlYWQsIGZhbGxiYWNrOicsXG4gICAgICAgIGZhbGxiYWNrLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIGVycm9yLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RhdGUgPz8gZmFsbGJhY2s7XG59XG5cbmludGVyZmFjZSBHZXRDb21wdXRlZFN0YXRlJFByb3BzIHtcbiAgcHJvcE5hbWU6IHN0cmluZztcbiAgZGVwczogQ29tcHV0ZWREZXBlbmRlbmN5W107XG4gIGNvbnZlcnRvcjogU3RhdGVDb252ZXJ0b3I7XG4gIGN0eDogQ1RYO1xuICBmYWxsYmFjazogdW5rbm93bjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXB1dGVkU3RhdGUkKHtcbiAgcHJvcE5hbWUsXG4gIGRlcHMsXG4gIGNvbnZlcnRvcixcbiAgY3R4LFxuICBmYWxsYmFjayxcbn06IEdldENvbXB1dGVkU3RhdGUkUHJvcHMpOiBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4ge1xuICBsZXQgX2ZhbGxiYWNrID0gZmFsbGJhY2s7XG4gIGNvbnN0IGRlcHMkID0gZGVwcy5tYXA8QmVoYXZpb3JTdWJqZWN0PHVua25vd24+PigoeyB0eXBlLCBkZXBJRCB9KSA9PiB7XG4gICAgaWYgKHR5cGUgPT09ICdhcGlfc3RhdGUnKSB7XG4gICAgICByZXR1cm4gY3R4LnN0YXRlc0h1YkFQSS5nZXRTdGF0ZSQoZGVwSUQpIGFzIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPjtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ25vZGVfc3RhdGUnKSB7XG4gICAgICByZXR1cm4gY3R4LnN0YXRlc0h1YlNoYXJlZC5nZXROb2RlU3RhdGUkKGRlcElEKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3R4LnN0YXRlc0h1YlNoYXJlZC5nZXRTdGF0ZSQoZGVwSUQpO1xuICB9KTtcbiAgY29uc3QgaW5pdGlhbERlcHMgPSBkZXBzJC5tYXAoKGRlcCQpID0+IGRlcCQudmFsdWUpO1xuICBjb25zdCBzdGF0ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFxuICAgIGNvbnZlcnRTdGF0ZSh7XG4gICAgICBzdGF0ZTogaW5pdGlhbERlcHMsXG4gICAgICBjb252ZXJ0b3I6IGNvbnZlcnRvcixcbiAgICAgIGZhbGxiYWNrOiBmYWxsYmFjayxcbiAgICAgIHByb3BOYW1lLFxuICAgIH0pLFxuICApO1xuXG4gIG9mKHRydWUpXG4gICAgLnBpcGUoXG4gICAgICBjb21iaW5lTGF0ZXN0V2l0aChkZXBzJCksXG4gICAgICBtYXAoKF8sIC4uLl9kZXApID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgICAgc3RhdGU6IF9kZXAsXG4gICAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3IsXG4gICAgICAgICAgZmFsbGJhY2s6IF9mYWxsYmFjayxcbiAgICAgICAgICBwcm9wTmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICAgIHNraXAoMSksXG4gICAgICB0YXAoKHN0YXRlKSA9PiB7XG4gICAgICAgIF9mYWxsYmFjayA9IHN0YXRlO1xuICAgICAgfSksXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiBzdGF0ZSQubmV4dChzdGF0ZSkpO1xuXG4gIHJldHVybiBzdGF0ZSQ7XG59XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkLCBtYXAsIE9ic2VydmFibGUsIHNraXAsIHRhcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBBUElSZXN1bHRQcm9wZXJ0eSwgQVBJU3RhdGUsIENUWCwgU2NoZW1hTm9kZSwgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBjb252ZXJ0U3RhdGUgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gdXNlQVBJUmVzdWx0UHJvcHMobm9kZTogU2NoZW1hTm9kZSwgY3R4OiBDVFgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IGFkYXB0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBTdGF0ZUNvbnZlcnRvciB8IHVuZGVmaW5lZD4gPSB7fTtcbiAgY29uc3Qgc3RhdGVzJDogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPj4gPSB7fTtcbiAgY29uc3QgaW5pdGlhbEZhbGxiYWNrczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIEFQSVJlc3VsdFByb3BlcnR5XSA9PiB7XG4gICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnYXBpX3Jlc3VsdF9wcm9wZXJ0eSc7XG4gICAgfSlcbiAgICAuZm9yRWFjaCgoW3Byb3BOYW1lLCB7IGZhbGxiYWNrLCBjb252ZXJ0b3I6IGFkYXB0ZXIsIHN0YXRlSUQgfV0pID0+IHtcbiAgICAgIGluaXRpYWxGYWxsYmFja3NbcHJvcE5hbWVdID0gZmFsbGJhY2s7XG4gICAgICBhZGFwdGVyc1twcm9wTmFtZV0gPSBhZGFwdGVyO1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBjdHguc3RhdGVzSHViQVBJLmdldFN0YXRlJChzdGF0ZUlEKTtcbiAgICB9KTtcblxuICBjb25zdCBmYWxsYmFja3NSZWYgPSB1c2VSZWY8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KGluaXRpYWxGYWxsYmFja3MpO1xuXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgIHN0YXRlOiBzdGF0ZSQuZ2V0VmFsdWUoKS5yZXN1bHQsXG4gICAgICAgIGNvbnZlcnRvcjogYWRhcHRlcnNba2V5XSxcbiAgICAgICAgZmFsbGJhY2s6IGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0sXG4gICAgICAgIHByb3BOYW1lOiBrZXksXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0cyQgPSBPYmplY3QuZW50cmllcyhzdGF0ZXMkKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgT2JzZXJ2YWJsZTx1bmtub3duPj4+KFxuICAgICAgKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgICBhY2Nba2V5XSA9IHN0YXRlJC5waXBlKFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkKCdyZXN1bHQnKSxcbiAgICAgICAgICBtYXAoKHsgcmVzdWx0IH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb252ZXJ0U3RhdGUoe1xuICAgICAgICAgICAgICBzdGF0ZTogcmVzdWx0LFxuICAgICAgICAgICAgICBjb252ZXJ0b3I6IGFkYXB0ZXJzW2tleV0sXG4gICAgICAgICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0gPSByZXN1bHQ7XG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gY29tYmluZUxhdGVzdChyZXN1bHRzJCkucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoc2V0U3RhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VBUElSZXN1bHRQcm9wcztcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkLCBtYXAsIE9ic2VydmFibGUsIHNraXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB0eXBlIHsgQVBJTG9hZGluZ1Byb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IHsgQVBJU3RhdGUsIENUWCwgU2NoZW1hTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZnVuY3Rpb24gdXNlQVBJTG9hZGluZ1Byb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8QVBJU3RhdGU+PiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQVBJTG9hZGluZ1Byb3BlcnR5XSA9PiB7XG4gICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnYXBpX2xvYWRpbmdfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtwcm9wTmFtZSwgeyBzdGF0ZUlEIH1dKSA9PiB7XG4gICAgICBzdGF0ZXMkW3Byb3BOYW1lXSA9IGN0eC5zdGF0ZXNIdWJBUEkuZ2V0U3RhdGUkKHN0YXRlSUQpO1xuICAgIH0pO1xuXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IHN0YXRlJC5nZXRWYWx1ZSgpLmxvYWRpbmc7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMkID0gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSBzdGF0ZSQucGlwZShcbiAgICAgICAgICBza2lwKDEpLFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkKCdsb2FkaW5nJyksXG4gICAgICAgICAgbWFwKCh7IGxvYWRpbmcgfSkgPT4gbG9hZGluZyksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gY29tYmluZUxhdGVzdChyZXN1bHRzJCkuc3Vic2NyaWJlKHNldFN0YXRlKTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQVBJTG9hZGluZ1Byb3BzO1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEZldGNoUGFyYW1zIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FwaS1zcGVjLWFkYXB0ZXInO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQVBJSW52b2tlUHJvcGVydHksIENUWCwgU2NoZW1hTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBBUElDYWxsUHJvcHMgPSBSZWNvcmQ8c3RyaW5nLCAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkPjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQVBJSW52b2tlUHJvcHMobm9kZTogU2NoZW1hTm9kZSwgY3R4OiBDVFgpOiBBUElDYWxsUHJvcHMge1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFub2RlLnByb3BzKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMpXG4gICAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbc3RyaW5nLCBBUElJbnZva2VQcm9wZXJ0eV0gPT4ge1xuICAgICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnYXBpX2ludm9rZV9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxBUElDYWxsUHJvcHM+KChhY2MsIFtwcm9wTmFtZSwgeyBzdGF0ZUlELCBwYXJhbXNCdWlsZGVyLCBjYWxsYmFjayB9XSkgPT4ge1xuICAgICAgICBsb2dnZXIud2FybignaG9vayB1c2VBUElJbnZva2VQcm9wcyBoYXMgYmVlbiBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGhvb2sgdXNlRnVuY1Byb3BzIGluc3RlYWQnKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVBY3Rpb24oLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZldGNoUGFyYW1zOiBGZXRjaFBhcmFtcyA9IHBhcmFtc0J1aWxkZXI/LiguLi5hcmdzKSB8fCB7fTtcbiAgICAgICAgICAgIGN0eC5hcGlTdGF0ZXNbc3RhdGVJRF0uZmV0Y2goZmV0Y2hQYXJhbXMsIGNhbGxiYWNrKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbG9nZ2VyLmxvZygnZmFpbGVkIHRvIHJ1biBjb252ZXJ0b3Igb3IgcnVuIGFjdGlvbjonLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWNjW3Byb3BOYW1lXSA9IGhhbmRsZUFjdGlvbjtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBPYnNlcnZhYmxlLCBza2lwLCB0YXAgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ1RYLCBTaGFyZWRTdGF0ZVByb3BlcnR5LCBOb2RlU3RhdGVQcm9wZXJ0eSwgU2NoZW1hTm9kZSwgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBjb252ZXJ0U3RhdGUgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBQYWlyID0gW3N0cmluZywgU2hhcmVkU3RhdGVQcm9wZXJ0eSB8IE5vZGVTdGF0ZVByb3BlcnR5XTtcblxuZnVuY3Rpb24gdXNlU2hhcmVkU3RhdGVQcm9wcyhub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgY29udmVydG9yczogUmVjb3JkPHN0cmluZywgU3RhdGVDb252ZXJ0b3IgfCB1bmRlZmluZWQ+ID0ge307XG4gIGNvbnN0IHN0YXRlcyQ6IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj4gPSB7fTtcbiAgY29uc3QgaW5pdGlhbEZhbGxiYWNrczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFBhaXIgPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ3NoYXJlZF9zdGF0ZV9wcm9wZXJ0eScgfHwgcGFpclsxXS50eXBlID09PSAnbm9kZV9zdGF0ZV9wcm9wZXJ0eSc7XG4gICAgfSlcbiAgICAuZm9yRWFjaCgoW2tleSwgcHJvcFNwZWNdKSA9PiB7XG4gICAgICBpZiAocHJvcFNwZWMudHlwZSA9PT0gJ3NoYXJlZF9zdGF0ZV9wcm9wZXJ0eScpIHtcbiAgICAgICAgc3RhdGVzJFtrZXldID0gY3R4LnN0YXRlc0h1YlNoYXJlZC5nZXRTdGF0ZSQocHJvcFNwZWMuc3RhdGVJRCk7XG4gICAgICAgIGNvbnZlcnRvcnNba2V5XSA9IHByb3BTcGVjLmNvbnZlcnRvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlcyRba2V5XSA9IGN0eC5zdGF0ZXNIdWJTaGFyZWQuZ2V0Tm9kZVN0YXRlJChwcm9wU3BlYy5ub2RlUGF0aCk7XG4gICAgICAgIGNvbnZlcnRvcnNba2V5XSA9IHByb3BTcGVjLmNvbnZlcnRvcjtcbiAgICAgIH1cblxuICAgICAgaW5pdGlhbEZhbGxiYWNrc1trZXldID0gcHJvcFNwZWMuZmFsbGJhY2s7XG4gICAgfSk7XG5cbiAgY29uc3QgZmFsbGJhY2tzUmVmID0gdXNlUmVmPFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihpbml0aWFsRmFsbGJhY2tzKTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgIHN0YXRlOiBzdGF0ZSQuZ2V0VmFsdWUoKSxcbiAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3JzW2tleV0sXG4gICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghT2JqZWN0LmtleXMoc3RhdGVzJCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0cyQgPSBPYmplY3QuZW50cmllcyhzdGF0ZXMkKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgT2JzZXJ2YWJsZTx1bmtub3duPj4+KFxuICAgICAgKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgICBhY2Nba2V5XSA9IHN0YXRlJC5waXBlKFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgICAgICAgbWFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb252ZXJ0U3RhdGUoe1xuICAgICAgICAgICAgICBzdGF0ZTogcmVzdWx0LFxuICAgICAgICAgICAgICBjb252ZXJ0b3I6IGNvbnZlcnRvcnNba2V5XSxcbiAgICAgICAgICAgICAgZmFsbGJhY2s6IGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0sXG4gICAgICAgICAgICAgIHByb3BOYW1lOiBrZXksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0YXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIHt9LFxuICAgICk7XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBjb21iaW5lTGF0ZXN0KHJlc3VsdHMkKS5waXBlKHNraXAoMSkpLnN1YnNjcmliZShzZXRTdGF0ZSk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVNoYXJlZFN0YXRlUHJvcHM7XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgU2NoZW1hTm9kZSwgRnVuY3Rpb25hbFByb3BlcnR5LCBWZXJzYXRpbGVGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VGdW5jUHJvcHMobm9kZTogU2NoZW1hTm9kZSk6IFJlY29yZDxzdHJpbmcsIFZlcnNhdGlsZUZ1bmM+IHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbm9kZS5wcm9wcykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhub2RlLnByb3BzKVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgRnVuY3Rpb25hbFByb3BlcnR5XSA9PiB7XG4gICAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdmdW5jdGlvbmFsX3Byb3BlcnR5JztcbiAgICAgIH0pXG4gICAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIFZlcnNhdGlsZUZ1bmM+PigoYWNjLCBba2V5LCB7IGZ1bmMgfV0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSAoLi4uYXJnczogdW5rbm93bltdKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgYGFuIGVycm9yIG9jY3VycmVkIHdoaWxlIHJ1biBub2RlICcke25vZGUuaWR9JyBmdW5jdGlvbmFsIHByb3BlcnR5OmAsXG4gICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgJ3dpdGggdGhlIGZvbGxvd2luZyBhcmd1bWVudHM6JyxcbiAgICAgICAgICAgICAgJ1xcbicsXG4gICAgICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICAnZnVuY3Rpb24gaXM6JyxcbiAgICAgICAgICAgICAgJ1xcbicsXG4gICAgICAgICAgICAgIGZ1bmMudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgJ1xcbicsXG4gICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQ1RYLCBTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcGVydHksIFNjaGVtYU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgTXV0YXRlUHJvcHMgPSBSZWNvcmQ8c3RyaW5nLCAodmFsdWU6IHVua25vd24pID0+IHZvaWQ+O1xudHlwZSBQYWlyID0gW3N0cmluZywgU2hhcmVkU3RhdGVNdXRhdGlvblByb3BlcnR5XTtcblxuZnVuY3Rpb24gdXNlU2hhcmVkU3RhdGVNdXRhdGlvblByb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogTXV0YXRlUHJvcHMge1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFub2RlLnByb3BzKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMpXG4gICAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBQYWlyID0+IHtcbiAgICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ3NoYXJlZF9zdGF0ZV9tdXRhdGlvbl9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxNdXRhdGVQcm9wcz4oKGFjYywgW2tleSwgeyBzdGF0ZUlELCBjb252ZXJ0b3IgfV0pID0+IHtcbiAgICAgICAgZnVuY3Rpb24gbXV0YXRpb24oc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbnZlcnRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY3R4LnN0YXRlc0h1YlNoYXJlZC5tdXRhdGVTdGF0ZShzdGF0ZUlELCBzdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBjb252ZXJ0b3Ioc3RhdGUpO1xuICAgICAgICAgICAgY3R4LnN0YXRlc0h1YlNoYXJlZC5tdXRhdGVTdGF0ZShzdGF0ZUlELCB2KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gcnVuIGNvbnZlcnRvcjpcXG4nLCBjb252ZXJ0b3IudG9TdHJpbmcoKSwgJ1xcbicsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhY2Nba2V5XSA9IG11dGF0aW9uO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9LCBbXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcztcbiIsImltcG9ydCB7IHVzZUNvbnRleHQsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vbm9kZS1yZW5kZXIvcGF0aC1jb250ZXh0JztcblxuaW1wb3J0IHsgU2NoZW1hTm9kZSwgQ1RYLCBWZXJzYXRpbGVGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG50eXBlIEludGVybmFsSG9va1Byb3BzID0gUmVjb3JkPHN0cmluZywgVmVyc2F0aWxlRnVuYyB8IHVuZGVmaW5lZD47XG5cbi8vIHRvZG8gZ2l2ZSB0aGlzIGhvb2sgYSBiZXR0ZXIgbmFtZVxuZnVuY3Rpb24gdXNlSW50ZXJuYWxIb29rUHJvcHMobm9kZTogU2NoZW1hTm9kZSwgY3R4OiBDVFgpOiBJbnRlcm5hbEhvb2tQcm9wcyB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICgnc3VwcG9ydFN0YXRlRXhwb3N1cmUnIGluIG5vZGUgJiYgbm9kZS5zdXBwb3J0U3RhdGVFeHBvc3VyZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX19leHBvc2VTdGF0ZTogKHN0YXRlOiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgICAgICAgY3R4LnN0YXRlc0h1YlNoYXJlZC5leHBvc2VOb2RlU3RhdGUoYCR7cGFyZW50UGF0aH0vJHtub2RlLmlkfWAsIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xuICB9LCBbXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUludGVybmFsSG9va1Byb3BzO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBDb25zdGFudFByb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IE5vZGVSZW5kZXIgZnJvbSAnLi4vbm9kZS1yZW5kZXInO1xuaW1wb3J0IHsgQ1RYLCBTY2hlbWFOb2RlLCBSZW5kZXJQcm9wZXJ0eSB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBSZW5kZXIgPSAoLi4uYXJnczogdW5rbm93bltdKSA9PiBSZWFjdC5SZWFjdEVsZW1lbnQ7XG50eXBlIFJlbmRlclByb3BzID0gUmVjb3JkPHN0cmluZywgUmVuZGVyPjtcblxuZnVuY3Rpb24gYnVpbGRSZW5kZXIoXG4gIG5vZGU6IFNjaGVtYU5vZGUsXG4gIGN0eDogQ1RYLFxuICBhZGFwdGVyPzogKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4pOiBSZW5kZXIge1xuICByZXR1cm4gKC4uLmFyZ3M6IHVua25vd25bXSk6IFJlYWN0LlJlYWN0RWxlbWVudCA9PiB7XG4gICAgLy8gY29udmVydCByZW5kZXIgYXJncyB0byBjb25zdGFudCBwcm9wZXJ0aWVzIGZvciByZXVzZSBvZiBOb2RlUmVuZGVyXG4gICAgbGV0IGNvbnN0YW50UHJvcHMgPSB7fTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgY3VzdG9tUHJvcHMgPSBhZGFwdGVyPy4oLi4uYXJncykgfHwge307XG4gICAgICBpZiAodHlwZW9mIGN1c3RvbVByb3BzID09PSAnb2JqZWN0Jykge1xuICAgICAgICBjb25zdGFudFByb3BzID0gT2JqZWN0LmVudHJpZXMoY3VzdG9tUHJvcHMpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBDb25zdGFudFByb3BlcnR5Pj4oXG4gICAgICAgICAgKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgICBhY2Nba2V5XSA9IHsgdHlwZTogJ2NvbnN0YW50X3Byb3BlcnR5JywgdmFsdWUgfTtcbiAgICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB7fSxcbiAgICAgICAgKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIHRvZG8gb3B0aW1pemUgdGhpcyBtZXNzYWdlXG4gICAgICAgIGxvZ2dlci5lcnJvcigndG9Qcm9wcyByZXN1bHQgaXMgbm8gT2JqZWN0Jyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIHRvZG8gb3B0aW1pemUgdGhpcyBtZXNzYWdlXG4gICAgICBsb2dnZXIuZXJyb3IoJ2ZhaWxlZCB0byBjYWxsIHRvUHJvcHMnLCBlcnJvcik7XG4gICAgfVxuXG4gICAgbm9kZS5wcm9wcyA9IE9iamVjdC5hc3NpZ24oe30sIG5vZGUucHJvcHMsIGNvbnN0YW50UHJvcHMpO1xuXG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHVzZVJlbmRlclByb3BzKHsgcHJvcHMgfTogU2NoZW1hTm9kZSwgY3R4OiBDVFgpOiBSZW5kZXJQcm9wcyB7XG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMocHJvcHMgfHwge30pXG4gICAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbc3RyaW5nLCBSZW5kZXJQcm9wZXJ0eV0gPT4ge1xuICAgICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAncmVuZGVyX3Byb3BlcnR5JztcbiAgICAgIH0pXG4gICAgICAucmVkdWNlPFJlbmRlclByb3BzPigoYWNjLCBbcHJvcE5hbWUsIHsgYWRhcHRlciwgbm9kZSB9XSkgPT4ge1xuICAgICAgICBhY2NbcHJvcE5hbWVdID0gYnVpbGRSZW5kZXIobm9kZSwgY3R4LCBhZGFwdGVyKTtcblxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9LCBbXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVJlbmRlclByb3BzO1xuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgc2tpcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDVFgsIFNjaGVtYU5vZGUsIENvbXB1dGVkUHJvcGVydHkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRDb21wdXRlZFN0YXRlJCB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VDb21wdXRlZFByb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4+ID0ge307XG5cbiAgT2JqZWN0LmVudHJpZXMobm9kZS5wcm9wcyB8fCB7fSlcbiAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbc3RyaW5nLCBDb21wdXRlZFByb3BlcnR5XSA9PiB7XG4gICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnY29tcHV0ZWRfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtwcm9wTmFtZSwgeyBkZXBzLCBjb252ZXJ0b3IsIGZhbGxiYWNrIH1dKSA9PiB7XG4gICAgICBzdGF0ZXMkW3Byb3BOYW1lXSA9IGdldENvbXB1dGVkU3RhdGUkKHsgcHJvcE5hbWUsIGRlcHMsIGNvbnZlcnRvciwgY3R4LCBmYWxsYmFjayB9KTtcbiAgICB9KTtcblxuICBjb25zdCBbc3RhdGVzLCBzZXRTdGF0ZXNdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IHN0YXRlJC52YWx1ZTtcblxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9ucyA9IGNvbWJpbmVMYXRlc3Qoc3RhdGVzJCkucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoc2V0U3RhdGVzKTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb25zLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gc3RhdGVzO1xufVxuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IENUWCwgU2NoZW1hTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZnVuY3Rpb24gdXNlTGlua1Byb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBpZiAoJ2lzTGluaycgaW4gbm9kZSAmJiBub2RlLmlzTGluayAmJiBub2RlLnR5cGUgPT09ICdodG1sLWVsZW1lbnQnICYmIG5vZGUubmFtZSA9PT0gJ2EnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9uQ2xpY2s6IChlOiBSZWFjdC5Nb3VzZUV2ZW50PEhUTUxBbmNob3JFbGVtZW50PikgPT4ge1xuICAgICAgICAvLyB0b2RvIHByb3h5IG9uQ2xpY2sgZXZlbnRcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBjb25zdCBocmVmID0gKGUuY3VycmVudFRhcmdldCBhcyBIVE1MQW5jaG9yRWxlbWVudCkuaHJlZjtcbiAgICAgICAgaWYgKCFocmVmKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGN0eC5oaXN0b3J5LnB1c2goaHJlZik7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlTGlua1Byb3BzO1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ1RYLCBTY2hlbWFOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHVzZUNvbnN0YW50UHJvcHMgZnJvbSAnLi91c2UtY29uc3RhbnQtcHJvcHMnO1xuaW1wb3J0IHVzZUFQSVJlc3VsdFByb3BzIGZyb20gJy4vdXNlLWFwaS1yZXN1bHQtcHJvcHMnO1xuaW1wb3J0IHVzZUFQSUxvYWRpbmdQcm9wcyBmcm9tICcuL3VzZS1hcGktbG9hZGluZy1wcm9wcyc7XG5pbXBvcnQgdXNlQVBJSW52b2tlUHJvcHMgZnJvbSAnLi91c2UtYXBpLWludm9rZS1wcm9wcyc7XG5pbXBvcnQgdXNlU2hhcmVkU3RhdGVQcm9wcyBmcm9tICcuL3VzZS1zaGFyZWQtc3RhdGUtcHJvcHMnO1xuaW1wb3J0IHVzZUZ1bmNQcm9wcyBmcm9tICcuL3VzZS1mdW5jLXByb3BzJztcbmltcG9ydCB1c2VTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMgZnJvbSAnLi91c2Utc2hhcmVkLXN0YXRlLW11dGF0aW9uJztcbmltcG9ydCB1c2VJbnRlcm5hbEhvb2tQcm9wcyBmcm9tICcuL3VzZS1pbnRlcm5hbC1ob29rLXByb3BzJztcbmltcG9ydCB1c2VSZW5kZXJQcm9wcyBmcm9tICcuL3VzZS1yZW5kZXItcHJvcHMnO1xuaW1wb3J0IHVzZUNvbXB1dGVkUHJvcHMgZnJvbSAnLi91c2UtY29tcHV0ZWQtcHJvcHMnO1xuaW1wb3J0IHVzZUxpbmtQcm9wcyBmcm9tICcuL3VzZS1saW5rLXByb3BzJztcblxuZnVuY3Rpb24gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgY29uc3RhbnRQcm9wcyA9IHVzZUNvbnN0YW50UHJvcHMobm9kZSk7XG4gIGNvbnN0IGFwaVJlc3VsdFByb3BzID0gdXNlQVBJUmVzdWx0UHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgYXBpTG9hZGluZ1Byb3BzID0gdXNlQVBJTG9hZGluZ1Byb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IHNoYXJlZFN0YXRlUHJvcHMgPSB1c2VTaGFyZWRTdGF0ZVByb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IGludGVybmFsSG9va1Byb3BzID0gdXNlSW50ZXJuYWxIb29rUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgY29tcHV0ZWRQcm9wcyA9IHVzZUNvbXB1dGVkUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgZnVuY1Byb3BzID0gdXNlRnVuY1Byb3BzKG5vZGUpO1xuXG4gIGNvbnN0IHNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcyA9IHVzZVNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBhcGlTdGF0ZUludm9rZVByb3BzID0gdXNlQVBJSW52b2tlUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgcmVuZGVyUHJvcHMgPSB1c2VSZW5kZXJQcm9wcyhub2RlLCBjdHgpO1xuXG4gIC8vIHRvZG8gc3VwcG9ydCB1c2VyIGRlZmluZWQgb25DbGljayBldmVudFxuICBjb25zdCBsaW5rUHJvcHMgPSB1c2VMaW5rUHJvcHMobm9kZSwgY3R4KTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oXG4gICAgICBjb25zdGFudFByb3BzLFxuICAgICAgYXBpU3RhdGVJbnZva2VQcm9wcyxcbiAgICAgIGFwaVJlc3VsdFByb3BzLFxuICAgICAgYXBpTG9hZGluZ1Byb3BzLFxuICAgICAgc2hhcmVkU3RhdGVQcm9wcyxcbiAgICAgIGNvbXB1dGVkUHJvcHMsXG4gICAgICBmdW5jUHJvcHMsXG4gICAgICBzaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMsXG4gICAgICBpbnRlcm5hbEhvb2tQcm9wcyxcbiAgICAgIHJlbmRlclByb3BzLFxuICAgICAgbGlua1Byb3BzLFxuICAgICk7XG4gIH0sIFthcGlSZXN1bHRQcm9wcywgc2hhcmVkU3RhdGVQcm9wcywgYXBpTG9hZGluZ1Byb3BzLCBjb21wdXRlZFByb3BzLCBjb25zdGFudFByb3BzXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUluc3RhbnRpYXRlUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgaW5pdENUWCBmcm9tICcuLi8uLi9jdHgnO1xuaW1wb3J0IHVzZUluc3RhbnRpYXRlUHJvcHMgZnJvbSAnLi4vLi4vdXNlLWluc3RhbnRpYXRlLXByb3BzJztcbmltcG9ydCB0eXBlIHsgQ1RYLCBSZWZMb2FkZXIsIExpZmVjeWNsZUhvb2tzLCBTY2hlbWFOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IFNjaGVtYVNwZWMgZnJvbSAncGFja2FnZXMvc2NoZW1hLXNwZWMvc3JjJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUxpZmVjeWNsZUhvb2soeyBkaWRNb3VudCwgd2lsbFVubW91bnQgfTogTGlmZWN5Y2xlSG9va3MpOiB2b2lkIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoZGlkTW91bnQpIHtcbiAgICAgIGRpZE1vdW50KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbGxVbm1vdW50Py4oKTtcbiAgICB9O1xuICB9LCBbXSk7XG59XG5cbmludGVyZmFjZSBSZWZSZXN1bHQge1xuICByZWZDVFg6IENUWDtcbiAgcmVmTm9kZTogU2NoZW1hTm9kZTtcbn1cbmludGVyZmFjZSBVc2VSZWZSZXN1bHRQcm9wcyB7XG4gIHNjaGVtYUlEOiBzdHJpbmc7XG4gIHJlZkxvYWRlcj86IFJlZkxvYWRlcjtcbiAgb3JwaGFuPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVJlZlJlc3VsdChcbiAgeyBzY2hlbWFJRCwgcmVmTG9hZGVyLCBvcnBoYW4gfTogVXNlUmVmUmVzdWx0UHJvcHMsXG4gIGN0eDogQ1RYLFxuKTogUmVmUmVzdWx0IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgW3Jlc3VsdCwgc2V0UmVzdWx0XSA9IHVzZVN0YXRlPFJlZlJlc3VsdCB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghc2NoZW1hSUQpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihgc2NoZW1hSUQgaXMgcmVxdWlyZWQgb24gUmVmTm9kZSwgcGxlYXNlIGNoZWNrIHRoZSBzcGVjIGZvciBub2RlOiAke2N1cnJlbnRQYXRofWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghcmVmTG9hZGVyKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICdyZWZMb2FkZXIgaXMgcmVxdWlyZWQgb24gUmVmTm9kZSBpbiBvcmRlciB0byBnZXQgcmVmIHNjaGVtYSBhbmQgY29ycmVzcG9uZGluZyBBUElTcGVjQWRhcHRlciwnLFxuICAgICAgICAncGxlYXNlIGltcGxlbWVudCByZWZMb2FkZXIgYW5kIHBhc3MgaXQgdG8gcGFyZW50IFJlbmRlckVuZ2luZS4nLFxuICAgICAgICBgY3VycmVudCBSZWZOb2RlIHBhdGggaXM6ICR7Y3VycmVudFBhdGh9YCxcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHVuTW91bnRpbmcgPSBmYWxzZTtcbiAgICBsZXQgX3NjaGVtYTogU2NoZW1hU3BlYy5TY2hlbWEgfCB1bmRlZmluZWQ7XG5cbiAgICByZWZMb2FkZXIoc2NoZW1hSUQpXG4gICAgICAudGhlbigoeyBzY2hlbWEsIHBsdWdpbnMgfSkgPT4ge1xuICAgICAgICBpZiAodW5Nb3VudGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zY2hlbWEgPSBzY2hlbWE7XG5cbiAgICAgICAgcmV0dXJuIGluaXRDVFgoe1xuICAgICAgICAgIHBsdWdpbnMsXG4gICAgICAgICAgc2NoZW1hLFxuICAgICAgICAgIHBhcmVudENUWDogb3JwaGFuID8gdW5kZWZpbmVkIDogY3R4LFxuICAgICAgICB9KTtcbiAgICAgIH0pXG4gICAgICAudGhlbigocmVmQ1RYKSA9PiB7XG4gICAgICAgIGlmICghcmVmQ1RYIHx8ICFfc2NoZW1hKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0UmVzdWx0KHsgcmVmQ1RYOiByZWZDVFguY3R4LCByZWZOb2RlOiByZWZDVFgucm9vdE5vZGUgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKGVycik7XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB1bk1vdW50aW5nID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVNob3VsZFJlbmRlcihub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IGJvb2xlYW4ge1xuICBjb25zdCBjb25kaXRpb24gPSBub2RlLnNob3VsZFJlbmRlcjtcbiAgY29uc3QgcGxhY2Vob2xkZXJOb2RlOiBTY2hlbWFOb2RlID0ge1xuICAgIGlkOiAncGxhY2Vob2xkZXItbm9kZScsXG4gICAgdHlwZTogJ2h0bWwtZWxlbWVudCcsXG4gICAgbmFtZTogJ2RpdicsXG4gICAgcHJvcHM6IGNvbmRpdGlvbiA/IHsgc2hvdWxkUmVuZGVyOiBjb25kaXRpb24gfSA6IHVuZGVmaW5lZCxcbiAgfTtcblxuICBjb25zdCB7IHNob3VsZFJlbmRlciB9ID0gdXNlSW5zdGFudGlhdGVQcm9wcyhwbGFjZWhvbGRlck5vZGUsIGN0eCk7XG5cbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChjb25kaXRpb24udHlwZSA9PT0gJ2FwaV9sb2FkaW5nX3Byb3BlcnR5Jykge1xuICAgIHJldHVybiBjb25kaXRpb24ucmV2ZXJ0ID8gIXNob3VsZFJlbmRlciA6ICEhc2hvdWxkUmVuZGVyO1xuICB9XG5cbiAgcmV0dXJuICEhc2hvdWxkUmVuZGVyO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBUUHJvcHMgfSBmcm9tICdyZWFjdC1qc3gtcGFyc2VyJztcblxuaW1wb3J0IHVzZUluc3RhbnRpYXRlUHJvcHMgZnJvbSAnLi4vdXNlLWluc3RhbnRpYXRlLXByb3BzJztcbmltcG9ydCB0eXBlIHsgQ1RYLCBKU1hOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vayB9IGZyb20gJy4vaG9va3MnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4vcGF0aC1jb250ZXh0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogSlNYTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIHVzZVJlYWN0SlNYUGFyc2VyKCk6IFJlYWN0LkNvbXBvbmVudDxUUHJvcHM+IHwgbnVsbCB7XG4gIGNvbnN0IFtjb20sIHNldENvbXBvbmVudF0gPSB1c2VTdGF0ZTxSZWFjdC5Db21wb25lbnQ8VFByb3BzPiB8IG51bGw+KG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IHVuTW91bnRpbmcgPSBmYWxzZTtcbiAgICAvLyB0b2RvIGNoYW5nZSAncmVhY3QtanN4LXBhcnNlcicgYXMgcGx1Z2luXG4gICAgU3lzdGVtLmltcG9ydCgncmVhY3QtanN4LXBhcnNlcicpXG4gICAgICAudGhlbigobW9kdWxlKSA9PiB7XG4gICAgICAgIGlmICh1bk1vdW50aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q29tcG9uZW50KCgpID0+IG1vZHVsZS5kZWZhdWx0KTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICBsb2dnZXIuZXJyb3IoJ2ZhaWxlZCB0byBsb2FkIGRlcGVuZGFuY2UgcmVhY3QtanN4LXBhcnNlcjonLCBlcnIpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9KTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB1bk1vdW50aW5nID0gdHJ1ZTtcbiAgICB9O1xuICB9KTtcblxuICByZXR1cm4gY29tO1xufVxuXG5mdW5jdGlvbiBKU1hOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlLCBjdHgpO1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuICBjb25zdCBSZWFjdEpTWFBhcnNlciA9IHVzZVJlYWN0SlNYUGFyc2VyKCk7XG5cbiAgaWYgKCFub2RlLmpzeCkge1xuICAgIGxvZ2dlci5lcnJvcignanN4IHN0cmluZyBpcyByZXF1aXJlZCwnLCBgcGxlYXNlIGNoZWNrIHRoZSBzcGVjIG9mIG5vZGU6ICR7Y3VycmVudFBhdGh9LmApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFSZWFjdEpTWFBhcnNlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3RKU1hQYXJzZXIgYXMgYW55LCB7XG4gICAgYmluZGluZ3M6IHByb3BzLFxuICAgIHJlbmRlckluV3JhcHBlcjogZmFsc2UsXG4gICAganN4OiBub2RlLmpzeCxcbiAgICBvbkVycm9yOiAoZXJyOiBhbnkpID0+IGNvbnNvbGUubG9nKGVyciksXG4gIH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBKU1hOb2RlUmVuZGVyO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IE5vZGVSZW5kZXIgZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rLCB1c2VSZWZSZXN1bHQgfSBmcm9tICcuL2hvb2tzJztcbmltcG9ydCB0eXBlIHsgQ1RYLCBSZWZOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBSZWZOb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVmTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuICBjb25zdCByZWZSZXN1bHQgPSB1c2VSZWZSZXN1bHQoXG4gICAgeyBzY2hlbWFJRDogbm9kZS5zY2hlbWFJRCwgcmVmTG9hZGVyOiBjdHgucGx1Z2lucy5yZWZMb2FkZXIsIG9ycGhhbjogbm9kZS5vcnBoYW4gfSxcbiAgICBjdHgsXG4gICk7XG5cbiAgaWYgKCFyZWZSZXN1bHQpIHtcbiAgICBpZiAobm9kZS5mYWxsYmFjaykge1xuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiBub2RlLmZhbGxiYWNrLCBjdHggfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGU6IHJlZlJlc3VsdC5yZWZOb2RlLCBjdHg6IHJlZlJlc3VsdC5yZWZDVFggfSk7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgSFRNTE5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBDaGlsZHJlblJlbmRlciB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vayB9IGZyb20gJy4vaG9va3MnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4vcGF0aC1jb250ZXh0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogSFRNTE5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBIVE1MTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICBpZiAoIW5vZGUubmFtZSkge1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICduYW1lIHByb3BlcnR5IGlzIHJlcXVpcmVkIGluIGh0bWwgbm9kZSBzcGVjLCcsXG4gICAgICBgcGxlYXNlIGNoZWNrIHRoZSBzcGVjIG9mIG5vZGU6ICR7Y3VycmVudFBhdGh9LmAsXG4gICAgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghbm9kZS5jaGlsZHJlbiB8fCAhbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChub2RlLm5hbWUsIHByb3BzKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIG5vZGUubmFtZSxcbiAgICBwcm9wcyxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENoaWxkcmVuUmVuZGVyLCB7IG5vZGVzOiBub2RlLmNoaWxkcmVuIHx8IFtdLCBjdHggfSksXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhUTUxOb2RlUmVuZGVyO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBDb25zdGFudFByb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IHsgQ1RYLCBTY2hlbWFOb2RlLCBQbGFpblN0YXRlLCBOb2RlUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuLi9wYXRoLWNvbnRleHQnO1xuaW1wb3J0IHVzZUluc3RhbnRpYXRlUHJvcHMgZnJvbSAnLi4vLi4vdXNlLWluc3RhbnRpYXRlLXByb3BzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUl0ZXJhYmxlKGl0ZXJhYmxlU3RhdGU6IFBsYWluU3RhdGUsIGN0eDogQ1RYKTogQXJyYXk8dW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICBjb25zdCBkdW1teU5vZGU6IFNjaGVtYU5vZGUgPSB7XG4gICAgdHlwZTogJ2h0bWwtZWxlbWVudCcsXG4gICAgaWQ6ICdkdW1teUxvb3BDb250YWluZXInLFxuICAgIG5hbWU6ICdkaXYnLFxuICAgIHByb3BzOiB7IGl0ZXJhYmxlOiBpdGVyYWJsZVN0YXRlIH0sXG4gIH07XG5cbiAgY29uc3QgeyBpdGVyYWJsZSB9ID0gdXNlSW5zdGFudGlhdGVQcm9wcyhkdW1teU5vZGUsIGN0eCk7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZXJhYmxlKSkge1xuICAgIGNvbnN0IG5vZGVJRCA9IGN1cnJlbnRQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgJ3N0YXRlIGlzIG5vdCBpdGVyYWJsZS4nLFxuICAgICAgYExvb3BDb250YWluZXIgbm9kZSBbJHtub2RlSUR9XSByZXF1aXJlIGEgYXJyYXkgdHlwZSBzdGF0ZSxgLFxuICAgICAgLy8gdG9kbyBvcHRpbWl6ZSB0b1N0cmluZyBvZiBpdGVyYWJsZVxuICAgICAgYGJ1dCBnb3Q6ICR7aXRlcmFibGV9LGAsXG4gICAgICAncGxlYXNlIGNoZWNrIHRoZSBmb2xsb3cgcHJvcGVydHkgc3BlYzpcXG4nLFxuICAgICAgaXRlcmFibGVTdGF0ZSxcbiAgICApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGl0ZXJhYmxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwcm9wcmlhdGVLZXkoaXRlbTogdW5rbm93biwgbG9vcEtleTogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgaXRlbSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGl0ZW0gPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGl0ZW0gPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbSAhPT0gbnVsbCkge1xuICAgIC8vIGp1c3QgZm9yIG92ZXJyaWRlIHR5cGVzY3JpcHQgXCJObyBpbmRleCBzaWduYXR1cmVcIiBlcnJvclxuICAgIHJldHVybiBSZWZsZWN0LmdldChpdGVtLCBsb29wS2V5KTtcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyeVRvUHJvcHMoXG4gIHNvdXJjZTogdW5rbm93bixcbiAgaW5kZXg6IG51bWJlcixcbiAgdG9Qcm9wczogKGl0ZW06IHVua25vd24sIGluZGV4OiBudW1iZXIpID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0b1Byb3BzUmVzdWx0ID0gdG9Qcm9wcyhzb3VyY2UsIGluZGV4KTtcbiAgICBpZiAodHlwZW9mIHRvUHJvcHNSZXN1bHQgIT09ICdvYmplY3QnICYmICF0b1Byb3BzUmVzdWx0KSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICd0b1Byb3BzIHJlc3VsdCBzaG91bGQgYmUgYW4gb2JqZWN0LCBidXQgZ290OiAke3RvUHJvcHNSZXN1bHR9LCcsXG4gICAgICAgIGBwbGVhc2UgY2hlY2sgdGhlIHRvUHJvcHMgc3BlYyBvZiBub2RlOiAke2N1cnJlbnRQYXRofSxgLFxuICAgICAgICAndGhlIGNvcnJlc3BvbmRpbmcgbm9kZSB3aWxsIGJlIHNraXBwZWQgZm9yIHJlbmRlci4nLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0b1Byb3BzUmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIHRvUHJvcHMgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcjonLFxuICAgICAgc291cmNlLFxuICAgICAgJ1xcbicsXG4gICAgICBgcGxlYXNlIGNoZWNrIHRoZSB0b1Byb3BzIHNwZWMgb2Ygbm9kZTogJHtjdXJyZW50UGF0aH0sYCxcbiAgICAgICd0aGUgY29ycmVzcG9uZGluZyBub2RlIHdpbGwgYmUgc2tpcHBlZCBmb3IgcmVuZGVyLicsXG4gICAgKTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmludGVyZmFjZSBVc2VNZXJnZWRQcm9wc0xpc3RQYXJhbXMge1xuICBpdGVyYWJsZVN0YXRlOiBQbGFpblN0YXRlO1xuICB0b1Byb3BzOiAoaXRlbTogdW5rbm93bikgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIG90aGVyUHJvcHM/OiBOb2RlUHJvcGVydGllcztcbiAgY3R4OiBDVFg7XG4gIGxvb3BLZXk6IHN0cmluZztcbn1cblxuLy8gdXNlTWVyZ2VkUHJvcHNMaXN0IHJldHVybiBhIGxpc3Qgb2YgYHByb3BzYCBhbmQgYGtleWAgd2hpY2ggY291bGQgYmUgdXNlZCBmb3IgaXRlcmF0aW9uLFxuLy8gZWFjaCBgcHJvcHNgIG1lcmdlZCBpdGVyYWJsZVN0YXRlIGFuZCBvdGhlclByb3BzXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVyZ2VkUHJvcHNMaXN0KHtcbiAgaXRlcmFibGVTdGF0ZSxcbiAgdG9Qcm9wcyxcbiAgb3RoZXJQcm9wcyxcbiAgY3R4LFxuICBsb29wS2V5LFxufTogVXNlTWVyZ2VkUHJvcHNMaXN0UGFyYW1zKTogQXJyYXk8W1JlYWN0LktleSwgTm9kZVByb3BlcnRpZXNdPiB8IG51bGwge1xuICBjb25zdCBpdGVyYWJsZSA9IHVzZUl0ZXJhYmxlKGl0ZXJhYmxlU3RhdGUsIGN0eCk7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG5cbiAgaWYgKCFpdGVyYWJsZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGl0ZXJhYmxlXG4gICAgLm1hcDxbUmVhY3QuS2V5LCBOb2RlUHJvcGVydGllc10gfCBudWxsPigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnZlcnRlZFByb3BzID0gdHJ5VG9Qcm9wcyhpdGVtLCBpbmRleCwgdG9Qcm9wcywgY3VycmVudFBhdGgpO1xuICAgICAgaWYgKCFjb252ZXJ0ZWRQcm9wcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gY29udmVydCBpdGVyYWJsZSB0byBjb25zdGFudCBwcm9wZXJ0eSBzcGVjIGZvciByZXVzZSBvZiBOb2RlUmVuZGVyXG4gICAgICBjb25zdCBjb25zdFByb3BzID0gT2JqZWN0LmVudHJpZXMoY29udmVydGVkUHJvcHMpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBDb25zdGFudFByb3BlcnR5Pj4oXG4gICAgICAgIChjb25zdFByb3BzLCBbcHJvcE5hbWUsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGNvbnN0UHJvcHNbcHJvcE5hbWVdID0geyB0eXBlOiAnY29uc3RhbnRfcHJvcGVydHknLCB2YWx1ZSB9O1xuXG4gICAgICAgICAgcmV0dXJuIGNvbnN0UHJvcHM7XG4gICAgICAgIH0sXG4gICAgICAgIHt9LFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIFtnZXRBcHByb3ByaWF0ZUtleShpdGVtLCBsb29wS2V5LCBpbmRleCksIE9iamVjdC5hc3NpZ24oe30sIG90aGVyUHJvcHMsIGNvbnN0UHJvcHMpXTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtSZWFjdC5LZXksIE5vZGVQcm9wZXJ0aWVzXSA9PiAhIXBhaXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQ29tcG9zZWRQcm9wc1NwZWMoXG4gIGNvbXBvc2VkU3RhdGU6IHVua25vd24sXG4gIHRvUHJvcHM6IChzdGF0ZTogdW5rbm93bikgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIGluZGV4OiBudW1iZXIsXG4gIG90aGVyUHJvcHM/OiBOb2RlUHJvcGVydGllcyxcbik6IE5vZGVQcm9wZXJ0aWVzIHtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY29tcG9zZWRQcm9wcyA9IHRyeVRvUHJvcHMoY29tcG9zZWRTdGF0ZSwgaW5kZXgsIHRvUHJvcHMsIGN1cnJlbnRQYXRoKTtcbiAgICBjb25zdCBjb21wb3NlZFByb3BzU3BlYyA9IE9iamVjdC5lbnRyaWVzKGNvbXBvc2VkUHJvcHMgfHwge30pLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBDb25zdGFudFByb3BlcnR5Pj4oXG4gICAgICAoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSB7XG4gICAgICAgICAgdHlwZTogJ2NvbnN0YW50X3Byb3BlcnR5JyxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG90aGVyUHJvcHMsIGNvbXBvc2VkUHJvcHNTcGVjKTtcbiAgfSwgW2NvbXBvc2VkU3RhdGUsIG90aGVyUHJvcHNdKTtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBDVFgsIFNjaGVtYU5vZGUsIFBsYWluU3RhdGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuLic7XG5pbXBvcnQgeyB1c2VNZXJnZWRQcm9wc0xpc3QgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcHMge1xuICBpdGVyYWJsZVN0YXRlOiBQbGFpblN0YXRlO1xuICBsb29wS2V5OiBzdHJpbmc7XG4gIHRvUHJvcHM6IChpdGVtOiB1bmtub3duKSA9PiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgbm9kZTogU2NoZW1hTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIExvb3BJbmRpdmlkdWFsKHsgaXRlcmFibGVTdGF0ZSwgbG9vcEtleSwgbm9kZSwgY3R4LCB0b1Byb3BzIH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgbWVyZ2VkUHJvcHNMaXN0ID0gdXNlTWVyZ2VkUHJvcHNMaXN0KHtcbiAgICBpdGVyYWJsZVN0YXRlLFxuICAgIHRvUHJvcHMsXG4gICAgY3R4LFxuICAgIGxvb3BLZXksXG4gICAgb3RoZXJQcm9wczogbm9kZS5wcm9wcyxcbiAgfSk7XG5cbiAgaWYgKCFtZXJnZWRQcm9wc0xpc3QpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIFJlYWN0LkZyYWdtZW50LFxuICAgIG51bGwsXG4gICAgbWVyZ2VkUHJvcHNMaXN0Lm1hcCgoW2tleSwgcHJvcHNdLCBpbmRleCk6IFJlYWN0LlJlYWN0RWxlbWVudCA9PiB7XG4gICAgICBjb25zdCBuZXdOb2RlID0gT2JqZWN0LmFzc2lnbih7fSwgbm9kZSwgeyBwcm9wcyB9KTtcblxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgICB7IHZhbHVlOiBgJHtwYXJlbnRQYXRofS8ke2luZGV4fWAsIGtleSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsga2V5LCBub2RlOiBuZXdOb2RlLCBjdHggfSksXG4gICAgICApO1xuICAgIH0pLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMb29wSW5kaXZpZHVhbDtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB0eXBlIHsgQ29tcG9uZW50TG9hZGVyUGFyYW0sIER5bmFtaWNDb21wb25lbnQsIFJlcG9zaXRvcnkgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQ29tcG9uZW50SW5SZXBvc2l0b3J5KFxuICByZXBvc2l0b3J5OiBSZXBvc2l0b3J5LFxuICB7IHBhY2thZ2VOYW1lLCBwYWNrYWdlVmVyc2lvbiwgZXhwb3J0TmFtZSB9OiBDb21wb25lbnRMb2FkZXJQYXJhbSxcbik6IER5bmFtaWNDb21wb25lbnQgfCB1bmRlZmluZWQge1xuICBjb25zdCBwYWNrYWdlTmFtZVZlcnNpb24gPSBgJHtwYWNrYWdlTmFtZX1AJHtwYWNrYWdlVmVyc2lvbn1gO1xuXG4gIHJldHVybiByZXBvc2l0b3J5W3BhY2thZ2VOYW1lVmVyc2lvbl0/LltleHBvcnROYW1lIHx8ICdkZWZhdWx0J107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeXN0ZW1Db21wb25lbnRMb2FkZXIoe1xuICBwYWNrYWdlTmFtZSxcbiAgZXhwb3J0TmFtZSxcbn06IENvbXBvbmVudExvYWRlclBhcmFtKTogUHJvbWlzZTxEeW5hbWljQ29tcG9uZW50PiB7XG4gIHJldHVybiBTeXN0ZW0uaW1wb3J0KHBhY2thZ2VOYW1lKVxuICAgIC50aGVuKChzeXN0ZW1Nb2R1bGUpID0+IHtcbiAgICAgIC8vIHRvZG8gY2F0Y2ggdW5kZWZpbmVkIGVycm9yXG4gICAgICByZXR1cm4gc3lzdGVtTW9kdWxlW2V4cG9ydE5hbWUgfHwgJ2RlZmF1bHQnXTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGxvZ2dlci5lcnJvcignZmFpbGVkIHRvIGxvYWQgbm9kZSBjb21wb25lbnQsJywgZXJyb3IpO1xuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuXG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vcGF0aC1jb250ZXh0JztcbmltcG9ydCB7IGZpbmRDb21wb25lbnRJblJlcG9zaXRvcnksIHN5c3RlbUNvbXBvbmVudExvYWRlciB9IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB0eXBlIHsgRHluYW1pY0NvbXBvbmVudCwgUGx1Z2lucywgUmVhY3RDb21wb25lbnROb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VOb2RlQ29tcG9uZW50KFxuICBub2RlOiBQaWNrPFJlYWN0Q29tcG9uZW50Tm9kZSwgJ3BhY2thZ2VOYW1lJyB8ICdwYWNrYWdlVmVyc2lvbicgfCAnZXhwb3J0TmFtZSc+LFxuICB7IHJlcG9zaXRvcnksIGNvbXBvbmVudExvYWRlciB9OiBQaWNrPFBsdWdpbnMsICdyZXBvc2l0b3J5JyB8ICdjb21wb25lbnRMb2FkZXInPixcbik6IER5bmFtaWNDb21wb25lbnQgfCB1bmRlZmluZWQge1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuICBjb25zdCBbbGF6eUxvYWRlZENvbXBvbmVudCwgc2V0Q29tcG9uZW50XSA9IHVzZVN0YXRlPER5bmFtaWNDb21wb25lbnQgfCB1bmRlZmluZWQ+KCgpID0+IHtcbiAgICBpZiAoIXJlcG9zaXRvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gZmluZENvbXBvbmVudEluUmVwb3NpdG9yeShyZXBvc2l0b3J5LCBub2RlKTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobGF6eUxvYWRlZENvbXBvbmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB1bk1vdW50aW5nID0gZmFsc2U7XG4gICAgY29uc3QgZmluaWFsTG9hZGVyID0gY29tcG9uZW50TG9hZGVyIHx8IHN5c3RlbUNvbXBvbmVudExvYWRlcjtcblxuICAgIGZpbmlhbExvYWRlcih7XG4gICAgICBwYWNrYWdlTmFtZTogbm9kZS5wYWNrYWdlTmFtZSxcbiAgICAgIHBhY2thZ2VWZXJzaW9uOiBub2RlLnBhY2thZ2VWZXJzaW9uLFxuICAgICAgZXhwb3J0TmFtZTogbm9kZS5leHBvcnROYW1lLFxuICAgIH0pXG4gICAgICAudGhlbigoY29tcCkgPT4ge1xuICAgICAgICBpZiAodW5Nb3VudGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29tcCkge1xuICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgIGBnb3QgZW1wdHkgY29tcG9uZW50IGZvciBwYWNrYWdlOiAke25vZGUucGFja2FnZU5hbWV9LGAsXG4gICAgICAgICAgICBgZXhwb3J0TmFtZTogJHtub2RlLmV4cG9ydE5hbWV9LCB2ZXJzaW9uOiAke25vZGUucGFja2FnZVZlcnNpb259YCxcbiAgICAgICAgICAgIGBwbGVhc2UgY2hlY2sgdGhlIHNwZWMgZm9yIG5vZGU6ICR7Y3VycmVudFBhdGh9LmAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDb21wb25lbnQoKCkgPT4gY29tcCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGxvZ2dlci5lcnJvcik7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5Nb3VudGluZyA9IHRydWU7XG4gICAgfTtcbiAgfSwgW2xhenlMb2FkZWRDb21wb25lbnRdKTtcblxuICByZXR1cm4gbGF6eUxvYWRlZENvbXBvbmVudDtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ1RYLCBIVE1MTm9kZSwgUmVhY3RDb21wb25lbnROb2RlLCBDb21wb3NlT3V0TGF5ZXIgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgdXNlSW5zdGFudGlhdGVQcm9wcyBmcm9tICcuLi8uLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vayB9IGZyb20gJy4uL2hvb2tzJztcbmltcG9ydCB1c2VOb2RlQ29tcG9uZW50IGZyb20gJy4uL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudCc7XG5cbnR5cGUgSFRNTE91dExheWVyUmVuZGVyUHJvcHMgPSBQcm9wc1dpdGhDaGlsZHJlbjx7XG4gIG91dExheWVyOiBPbWl0PEhUTUxOb2RlLCAnY2hpbGRyZW4nPjtcbiAgY3R4OiBDVFg7XG59PjtcblxuZnVuY3Rpb24gSFRNTE91dExheWVyUmVuZGVyKHsgb3V0TGF5ZXIsIGN0eCwgY2hpbGRyZW4gfTogSFRNTE91dExheWVyUmVuZGVyUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMob3V0TGF5ZXIsIGN0eCk7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG91dExheWVyLm5hbWUsIHByb3BzLCBjaGlsZHJlbik7XG59XG5cbnR5cGUgUmVhY3RDb21wb25lbnRPdXRMYXllclJlbmRlclByb3BzID0gUHJvcHNXaXRoQ2hpbGRyZW48e1xuICBvdXRMYXllcjogT21pdDxSZWFjdENvbXBvbmVudE5vZGUsICdjaGlsZHJlbic+O1xuICBjdHg6IENUWDtcbn0+O1xuXG5mdW5jdGlvbiBSZWFjdENvbXBvbmVudE91dExheWVyUmVuZGVyKHtcbiAgb3V0TGF5ZXIsXG4gIGN0eCxcbiAgY2hpbGRyZW4sXG59OiBSZWFjdENvbXBvbmVudE91dExheWVyUmVuZGVyUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgcHJvcHMgPSB1c2VJbnN0YW50aWF0ZVByb3BzKG91dExheWVyLCBjdHgpO1xuICBjb25zdCBub2RlQ29tcG9uZW50ID0gdXNlTm9kZUNvbXBvbmVudChvdXRMYXllciwgY3R4LnBsdWdpbnMpO1xuICB1c2VMaWZlY3ljbGVIb29rKG91dExheWVyLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcblxuICBpZiAoIW5vZGVDb21wb25lbnQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG5vZGVDb21wb25lbnQsIHByb3BzLCBjaGlsZHJlbik7XG59XG5cbnR5cGUgUHJvcHMgPSBQcm9wc1dpdGhDaGlsZHJlbjx7XG4gIG91dExheWVyPzogQ29tcG9zZU91dExheWVyO1xuICBjdHg6IENUWDtcbn0+O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBPdXRMYXllclJlbmRlcih7IG91dExheWVyLCBjdHgsIGNoaWxkcmVuIH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGlmIChvdXRMYXllcj8udHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChIVE1MT3V0TGF5ZXJSZW5kZXIsIHsgb3V0TGF5ZXIsIGN0eCB9LCBjaGlsZHJlbik7XG4gIH1cblxuICBpZiAob3V0TGF5ZXI/LnR5cGUgPT09ICdyZWFjdC1jb21wb25lbnQnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3RDb21wb25lbnRPdXRMYXllclJlbmRlciwgeyBvdXRMYXllciwgY3R4IH0sIGNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBjaGlsZHJlbik7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ1RYLCBQbGFpblN0YXRlLCBDb21wb3NlZE5vZGUsIENvbXBvc2VkTm9kZUNoaWxkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QXBwcm9wcmlhdGVLZXksIHVzZUl0ZXJhYmxlLCB1c2VDb21wb3NlZFByb3BzU3BlYyB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgT3V0TGF5ZXJSZW5kZXIgZnJvbSAnLi9vdXQtbGF5ZXItcmVuZGVyJztcbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuLi9wYXRoLWNvbnRleHQnO1xuXG5pbnRlcmZhY2UgQ29tcG9zZWRDaGlsZFJlbmRlclByb3BzIHtcbiAgbm9kZTogQ29tcG9zZWROb2RlQ2hpbGQ7XG4gIGNvbXBvc2VkU3RhdGU6IHVua25vd247XG4gIGN0eDogQ1RYO1xuICBpbmRleDogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBDb21wb3NlZENoaWxkUmVuZGVyKHtcbiAgbm9kZSxcbiAgY29tcG9zZWRTdGF0ZSxcbiAgY3R4LFxuICBpbmRleCxcbn06IENvbXBvc2VkQ2hpbGRSZW5kZXJQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB7XG4gIGNvbnN0IHByb3BTcGVjID0gdXNlQ29tcG9zZWRQcm9wc1NwZWMoY29tcG9zZWRTdGF0ZSwgbm9kZS50b1Byb3BzLCBpbmRleCwgbm9kZS5wcm9wcyk7XG4gIGNvbnN0IF9ub2RlID0gT2JqZWN0LmFzc2lnbih7fSwgbm9kZSwgeyBwcm9wczogcHJvcFNwZWMgfSk7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogX25vZGUsIGN0eCB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9wcyB7XG4gIGl0ZXJhYmxlU3RhdGU6IFBsYWluU3RhdGU7XG4gIGxvb3BLZXk6IHN0cmluZztcbiAgbm9kZTogQ29tcG9zZWROb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gTG9vcENvbXBvc2VkKHsgaXRlcmFibGVTdGF0ZSwgbG9vcEtleSwgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgaXRlcmFibGUgPSB1c2VJdGVyYWJsZShpdGVyYWJsZVN0YXRlLCBjdHgpO1xuXG4gIGlmICghaXRlcmFibGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIFJlYWN0LkZyYWdtZW50LFxuICAgIG51bGwsXG4gICAgaXRlcmFibGUubWFwKChjb21wb3NlZFN0YXRlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gZ2V0QXBwcm9wcmlhdGVLZXkoY29tcG9zZWRTdGF0ZSwgbG9vcEtleSwgaW5kZXgpO1xuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICAgIHsgdmFsdWU6IGAke3BhcmVudFBhdGh9LyR7aW5kZXh9YCwga2V5OiBpbmRleCB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgIE91dExheWVyUmVuZGVyLFxuICAgICAgICAgIHsga2V5LCBvdXRMYXllcjogbm9kZS5vdXRMYXllciwgY3R4IH0sXG4gICAgICAgICAgKG5vZGUubm9kZXMgfHwgbm9kZS5jaGlsZHJlbikubWFwKChjb21wb3NlZENoaWxkLCBpbmRleCk6IFJlYWN0LlJlYWN0RWxlbWVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb3NlZENoaWxkUmVuZGVyLCB7XG4gICAgICAgICAgICAgIG5vZGU6IGNvbXBvc2VkQ2hpbGQsXG4gICAgICAgICAgICAgIGNvbXBvc2VkU3RhdGUsXG4gICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgIGtleTogY29tcG9zZWRDaGlsZC5pZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vcENvbXBvc2VkO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCBMb29wSW5kaXZpZHVhbCBmcm9tICcuL2xvb3AtaW5kaXZpZHVhbCc7XG5pbXBvcnQgTG9vcENvbXBvc2VkIGZyb20gJy4vbG9vcC1jb21wb3NlZCc7XG5pbXBvcnQgdHlwZSB7IENUWCwgTG9vcENvbnRhaW5lck5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi4vaG9va3MnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBMb29wQ29udGFpbmVyTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIExvb3BOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIHVzZUxpZmVjeWNsZUhvb2sobm9kZS5saWZlY3ljbGVIb29rcyB8fCB7fSk7XG5cbiAgY29uc3QgeyBub2RlOiBMb29wTm9kZSB9ID0gbm9kZTtcblxuICBpZiAoTG9vcE5vZGUudHlwZSAhPT0gJ2NvbXBvc2VkLW5vZGUnICYmICd0b1Byb3BzJyBpbiBub2RlKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTG9vcEluZGl2aWR1YWwsIHtcbiAgICAgIGl0ZXJhYmxlU3RhdGU6IG5vZGUuaXRlcmFibGVTdGF0ZSxcbiAgICAgIGxvb3BLZXk6IG5vZGUubG9vcEtleSxcbiAgICAgIG5vZGU6IExvb3BOb2RlLFxuICAgICAgdG9Qcm9wczogKHY6IHVua25vd24pID0+IG5vZGUudG9Qcm9wcyh2KSxcbiAgICAgIGN0eCxcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChMb29wTm9kZS50eXBlID09PSAnY29tcG9zZWQtbm9kZScpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChMb29wQ29tcG9zZWQsIHtcbiAgICAgIGl0ZXJhYmxlU3RhdGU6IG5vZGUuaXRlcmFibGVTdGF0ZSxcbiAgICAgIGxvb3BLZXk6IG5vZGUubG9vcEtleSxcbiAgICAgIG5vZGU6IExvb3BOb2RlLFxuICAgICAgY3R4LFxuICAgIH0pO1xuICB9XG5cbiAgbG9nZ2VyLmVycm9yKCdVbnJlY29nbml6ZWQgbG9vcCBub2RlOicsIG5vZGUpO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMb29wTm9kZVJlbmRlcjtcbiIsImltcG9ydCByZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IFJvdXRlQ29udGV4dCA9IHJlYWN0LmNyZWF0ZUNvbnRleHQ8c3RyaW5nPignLycpO1xuXG5leHBvcnQgZGVmYXVsdCBSb3V0ZUNvbnRleHQ7XG4iLCIvLyB0cmltIGJlZ2luIGFuZCBsYXN0IHNsYXNoXG5leHBvcnQgZnVuY3Rpb24gdHJpbVNsYXNoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLnJlcGxhY2UoL15cXC98XFwvJC9nLCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhcmFtSG9sZGVyKGZyYWdtZW50OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC9eOlthLXpBLVpfXVtbYS16QS1aXyQwLTldKyQvLnRlc3QoZnJhZ21lbnQpO1xufVxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUgeyBMb2NhdGlvbiB9IGZyb20gJ2hpc3RvcnknO1xuXG5pbXBvcnQgeyBpc1BhcmFtSG9sZGVyIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGFjdGx5Q2hlY2socGF0aDogc3RyaW5nLCBjdXJyZW50Um91dGVQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgcGF0aEZyYWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgY29uc3Qgcm91dGVGcmFnbWVudHMgPSBjdXJyZW50Um91dGVQYXRoLnNwbGl0KCcvJyk7XG4gIGlmIChwYXRoRnJhZ21lbnRzLmxlbmd0aCAhPT0gcm91dGVGcmFnbWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBhdGhGcmFnbWVudHMuZXZlcnkoKGZyYWdtZW50LCBpbmRleCkgPT4ge1xuICAgIGlmIChpc1BhcmFtSG9sZGVyKHJvdXRlRnJhZ21lbnRzW2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmcmFnbWVudCA9PT0gcm91dGVGcmFnbWVudHNbaW5kZXhdO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZWZpeENoZWNrKHBhdGg6IHN0cmluZywgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdGhGcmFnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gIGNvbnN0IHJvdXRlRnJhZ21lbnRzID0gY3VycmVudFJvdXRlUGF0aC5zcGxpdCgnLycpO1xuICBpZiAocGF0aEZyYWdtZW50cy5sZW5ndGggPCByb3V0ZUZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcm91dGVGcmFnbWVudHMuZXZlcnkoKGZyYWdtZW50LCBpbmRleCkgPT4ge1xuICAgIGlmIChpc1BhcmFtSG9sZGVyKGZyYWdtZW50KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZyYWdtZW50ID09PSBwYXRoRnJhZ21lbnRzW2luZGV4XTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVzZU1hdGNoKGxvY2F0aW9uJDogQmVoYXZpb3JTdWJqZWN0PExvY2F0aW9uPiwgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nLCBleGFjdGx5OiBib29sZWFuKTogYm9vbGVhbiB7XG4gIGNvbnN0IFttYXRjaCwgc2V0TWF0Y2hdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaWJlID0gbG9jYXRpb24kXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKCh7IHBhdGhuYW1lIH0pOiBib29sZWFuID0+IHtcbiAgICAgICAgICByZXR1cm4gZXhhY3RseSA/IGV4YWN0bHlDaGVjayhwYXRobmFtZSwgY3VycmVudFJvdXRlUGF0aCkgOiBwcmVmaXhDaGVjayhwYXRobmFtZSwgY3VycmVudFJvdXRlUGF0aCk7XG4gICAgICAgIH0pLFxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShzZXRNYXRjaCk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaWJlLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gbWF0Y2g7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZU1hdGNoO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCBSb3V0ZVBhdGhDb250ZXh0IGZyb20gJy4vcm91dGUtcGF0aC1jb250ZXh0JztcbmltcG9ydCB1c2VNYXRjaCBmcm9tICcuL3VzZS1tYXRjaCc7XG5pbXBvcnQgeyB0cmltU2xhc2ggfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuLi9ob29rcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUm91dGVOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogUm91dGVOb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gYnVpbGRDdXJyZW50UGF0aChwYXJlbnRQYXRoOiBzdHJpbmcsIHJvdXRlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKHBhcmVudFBhdGggPT09ICcvJykge1xuICAgIHJldHVybiBgLyR7dHJpbVNsYXNoKHJvdXRlUGF0aCl9YDtcbiAgfVxuXG4gIHJldHVybiBgJHtwYXJlbnRQYXRofS8ke3RyaW1TbGFzaChyb3V0ZVBhdGgpfWA7XG59XG5cbmZ1bmN0aW9uIFJvdXRlTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuXG4gIGNvbnN0IHBhcmVudFJvdXRlUGF0aCA9IHVzZUNvbnRleHQoUm91dGVQYXRoQ29udGV4dCk7XG4gIGNvbnN0IGN1cnJlbnRSb3V0ZVBhdGggPSBidWlsZEN1cnJlbnRQYXRoKHBhcmVudFJvdXRlUGF0aCwgbm9kZS5wYXRoKTtcbiAgY29uc3QgbWF0Y2ggPSB1c2VNYXRjaChjdHgubG9jYXRpb24kLCBjdXJyZW50Um91dGVQYXRoLCBub2RlLmV4YWN0bHkgPz8gZmFsc2UpO1xuXG4gIGlmIChtYXRjaCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUm91dGVQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRSb3V0ZVBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiBub2RlLm5vZGUsIGN0eCB9KSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJvdXRlTm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgeyBDaGlsZHJlblJlbmRlciB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFJlYWN0Q29tcG9uZW50Tm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuL2hvb2tzJztcbmltcG9ydCB1c2VOb2RlQ29tcG9uZW50IGZyb20gJy4vaG9va3MvdXNlLW5vZGUtY29tcG9uZW50JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogUmVhY3RDb21wb25lbnROb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gUmVhY3RDb21wb25lbnROb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBub2RlQ29tcG9uZW50ID0gdXNlTm9kZUNvbXBvbmVudChub2RlLCBjdHgucGx1Z2lucyk7XG4gIHVzZUxpZmVjeWNsZUhvb2sobm9kZS5saWZlY3ljbGVIb29rcyB8fCB7fSk7XG5cbiAgaWYgKCFub2RlQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQobm9kZUNvbXBvbmVudCwgcHJvcHMpO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgbm9kZUNvbXBvbmVudCxcbiAgICBwcm9wcyxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENoaWxkcmVuUmVuZGVyLCB7IG5vZGVzOiBub2RlLmNoaWxkcmVuIHx8IFtdLCBjdHggfSksXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4vcGF0aC1jb250ZXh0JztcbmltcG9ydCB7IHVzZVNob3VsZFJlbmRlciB9IGZyb20gJy4vaG9va3MnO1xuaW1wb3J0IHsgQ1RYLCBTY2hlbWFOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IEpTWE5vZGVSZW5kZXIgZnJvbSAnLi9qc3gtbm9kZS1yZW5kZXInO1xuaW1wb3J0IFJlZk5vZGVSZW5kZXIgZnJvbSAnLi9yZWYtbm9kZS1yZW5kZXInO1xuaW1wb3J0IEhUTUxOb2RlUmVuZGVyIGZyb20gJy4vaHRtbC1ub2RlLXJlbmRlcic7XG5pbXBvcnQgTG9vcE5vZGVSZW5kZXIgZnJvbSAnLi9sb29wLW5vZGUtcmVuZGVyJztcbmltcG9ydCBSb3V0ZU5vZGVSZW5kZXIgZnJvbSAnLi9yb3V0ZS1ub2RlLXJlbmRlcic7XG5pbXBvcnQgUmVhY3RDb21wb25lbnROb2RlUmVuZGVyIGZyb20gJy4vcmVhY3QtY29tcG9uZW50LW5vZGUtcmVuZGVyJztcblxuaW50ZXJmYWNlIENoaWxkcmVuUmVuZGVyUHJvcHMge1xuICBub2RlczogU2NoZW1hTm9kZVtdO1xuICBjdHg6IENUWDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENoaWxkcmVuUmVuZGVyKHsgbm9kZXMsIGN0eCB9OiBDaGlsZHJlblJlbmRlclByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGlmICghbm9kZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICBSZWFjdC5GcmFnbWVudCxcbiAgICBudWxsLFxuICAgIG5vZGVzLm1hcCgobm9kZSkgPT4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IGtleTogbm9kZS5pZCwgbm9kZTogbm9kZSwgY3R4IH0pKSxcbiAgKTtcbn1cblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogU2NoZW1hTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIE5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgcGFyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuICBjb25zdCBjdXJyZW50UGF0aCA9IGAke3BhcmVudFBhdGh9LyR7bm9kZS5pZH1gO1xuICBjb25zdCBzaG91bGRSZW5kZXIgPSB1c2VTaG91bGRSZW5kZXIobm9kZSwgY3R4KTtcblxuICBpZiAoIXNob3VsZFJlbmRlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKG5vZGUudHlwZSA9PT0gJ3JvdXRlLW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdsb29wLWNvbnRhaW5lcicpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTG9vcE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAnaHRtbC1lbGVtZW50Jykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50UGF0aCB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIVE1MTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdyZWFjdC1jb21wb25lbnQnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdyZWYtbm9kZScpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVmTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdqc3gtbm9kZScpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSlNYTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGxvZ2dlci5lcnJvcignVW5yZWNvZ25pemVkIG5vZGUgdHlwZSBvZiBub2RlOicsIG5vZGUpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZUltcGVyYXRpdmVIYW5kbGUsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHR5cGUgeyBTY2hlbWEgfSBmcm9tICdAb25lLWZvci1hbGwvc2NoZW1hLXNwZWMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IGluaXRDVFggZnJvbSAnLi9jdHgnO1xuaW1wb3J0IE5vZGVSZW5kZXIgZnJvbSAnLi9ub2RlLXJlbmRlcic7XG5pbXBvcnQgdHlwZSB7IENUWCwgUGx1Z2lucywgUmVuZGVyRW5naW5lQ1RYLCBTY2hlbWFOb2RlIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIHNjaGVtYTogU2NoZW1hO1xuICBwbHVnaW5zPzogUGx1Z2lucztcbn1cblxuaW50ZXJmYWNlIFVzZUNUWFJlc3VsdCB7XG4gIGN0eDogQ1RYO1xuICByb290Tm9kZTogU2NoZW1hTm9kZTtcbn1cblxuZnVuY3Rpb24gdXNlQ1RYKHNjaGVtYTogU2NoZW1hLCBwbHVnaW5zPzogUGx1Z2lucyk6IFVzZUNUWFJlc3VsdCB8IG51bGwge1xuICBjb25zdCBbY3R4LCBzZXRDVFhdID0gdXNlU3RhdGU8VXNlQ1RYUmVzdWx0IHwgbnVsbD4obnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICAvLyB0b2RvIHBhcmVudENUWD9cbiAgICBpbml0Q1RYKHsgcGx1Z2lucywgc2NoZW1hIH0pLnRoZW4oc2V0Q1RYKS5jYXRjaChsb2dnZXIuZXJyb3IpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIGN0eDtcbn1cblxuZnVuY3Rpb24gU2NoZW1hUmVuZGVyKFxuICB7IHNjaGVtYSwgcGx1Z2lucyB9OiBQcm9wcyxcbiAgcmVmOiBSZWFjdC5SZWY8UmVuZGVyRW5naW5lQ1RYIHwgdW5kZWZpbmVkPixcbik6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBjdHggPSB1c2VDVFgoc2NoZW1hLCBwbHVnaW5zKTtcblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKFxuICAgIHJlZixcbiAgICAoKSA9PiB7XG4gICAgICBpZiAoIWN0eCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGFwaVN0YXRlczogY3R4LmN0eC5hcGlTdGF0ZXMsIHN0YXRlczogY3R4LmN0eC5zdGF0ZXMsIGhpc3Rvcnk6IGN0eC5jdHguaGlzdG9yeSB9O1xuICAgIH0sXG4gICAgW2N0eF0sXG4gICk7XG5cbiAgaWYgKCFjdHgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogY3R4LnJvb3ROb2RlLCBjdHg6IGN0eC5jdHggfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNjaGVtYVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB0eXBlIHsgU2NoZW1hIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IE5vZGVSZW5kZXIgZnJvbSAnLi9ub2RlLXJlbmRlcic7XG5pbXBvcnQgaW5pdENUWCBmcm9tICcuL2N0eCc7XG5pbXBvcnQgdHlwZSB7IFBsdWdpbnMgfSBmcm9tICcuL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVuZGVyRW5naW5lIHtcbiAgcHJpdmF0ZSBzY2hlbWE6IFNjaGVtYTtcbiAgcHJpdmF0ZSBwbHVnaW5zOiBQbHVnaW5zO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY2hlbWE6IFNjaGVtYSwgcGx1Z2lucz86IFBsdWdpbnMpIHtcbiAgICB0aGlzLnNjaGVtYSA9IHNjaGVtYTtcbiAgICB0aGlzLnBsdWdpbnMgPSBwbHVnaW5zIHx8IHt9O1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHJlbmRlcihyZW5kZXJSb290OiBFbGVtZW50KTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgeyBjdHgsIHJvb3ROb2RlIH0gPSBhd2FpdCBpbml0Q1RYKHtcbiAgICAgIHBsdWdpbnM6IHRoaXMucGx1Z2lucyxcbiAgICAgIHNjaGVtYTogdGhpcy5zY2hlbWEsXG4gICAgfSk7XG5cbiAgICBSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGU6IHJvb3ROb2RlLCBjdHggfSksIHJlbmRlclJvb3QpO1xuICB9XG59XG4iXSwibmFtZXMiOlsiX19kZWZQcm9wIiwiX19kZWZQcm9wcyIsIl9fZ2V0T3duUHJvcERlc2NzIiwiX19nZXRPd25Qcm9wU3ltYm9scyIsIl9faGFzT3duUHJvcCIsIl9fcHJvcElzRW51bSIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwiX19zcHJlYWRQcm9wcyIsIm1hcCIsInNoYXJlIiwiSHViIiwiU3RhdGVzSHViQVBJIiwiU3RhdGVzSHViU2hhcmVkIiwic2tpcCIsInJlYWN0IiwiUm91dGVQYXRoQ29udGV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BQWUsU0FBUyxRQUFRLEdBQUc7TUFDbkMsRUFBRSxRQUFRLEdBQUcsTUFBTSxDQUFDLE1BQU0sSUFBSSxVQUFVLE1BQU0sRUFBRTtNQUNoRCxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQy9DLE1BQU0sSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2hDO01B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
