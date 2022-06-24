System.register(['react', '@one-for-all/utils', 'history', 'rxjs', 'rxjs/operators', 'rxjs/ajax', 'react-dom'], (function (exports) {
  'use strict';
  var React, useRef, useState, useEffect, useMemo, useContext, useImperativeHandle, logger, createBrowserHistory, switchMap, share, map, catchError, of, BehaviorSubject, Subject, merge, noop, from, firstValueFrom, combineLatest, take, last, combineLatestWith, skip$1, tap, distinctUntilKeyChanged, distinctUntilChanged, map$1, filter, share$1, skip, delay, ajax, ReactDOM;
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
      createBrowserHistory = module.createBrowserHistory;
    }, function (module) {
      switchMap = module.switchMap;
      share = module.share;
      map = module.map;
      catchError = module.catchError;
      of = module.of;
      BehaviorSubject = module.BehaviorSubject;
      Subject = module.Subject;
      merge = module.merge;
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

      const PathContext = React.createContext("ROOT");

      var __defProp$2 = Object.defineProperty;
      var __defProps$2 = Object.defineProperties;
      var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
      var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
      var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$2 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$3.call(b, prop))
            __defNormalProp$2(a, prop, b[prop]);
        if (__getOwnPropSymbols$3)
          for (var prop of __getOwnPropSymbols$3(b)) {
            if (__propIsEnum$3.call(b, prop))
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
              refresh: () => statesHubAPI.refresh(p),
              fetch: (fetchParams, callback) => {
                statesHubAPI.fetch(p, { params: fetchParams, callback });
              },
              rawFetch: (rawFetchOption, callback) => {
                statesHubAPI.rawFetch(p, rawFetchOption);
              }
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
          logger.error("deserialize failed:", error);
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
      var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
      var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
      var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$1 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$2.call(b, prop))
            __defNormalProp$1(a, prop, b[prop]);
        if (__getOwnPropSymbols$2)
          for (var prop of __getOwnPropSymbols$2(b)) {
            if (__propIsEnum$2.call(b, prop))
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

      var __getOwnPropSymbols$1 = Object.getOwnPropertySymbols;
      var __hasOwnProp$1 = Object.prototype.hasOwnProperty;
      var __propIsEnum$1 = Object.prototype.propertyIsEnumerable;
      var __objRest = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$1.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$1)
          for (var prop of __getOwnPropSymbols$1(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$1.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      function initAPIState(apiID, apiSpecAdapter) {
        const rawParams$ = new Subject();
        const params$ = new Subject();
        const request$ = params$.pipe(map$1((params) => apiSpecAdapter.build(apiID, params)), filter(Boolean), share$1());
        let _latestFetchOption = void 0;
        const apiState$ = getResponseState$(merge(request$, rawParams$), apiSpecAdapter.responseAdapter);
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
          rawFetch: (_a) => {
            var _b = _a, { callback } = _b, ajaxConfig = __objRest(_b, ["callback"]);
            _latestFetchOption = { callback };
            rawParams$.next(ajaxConfig);
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
        rawFetch: noop,
        refresh: noop
      };
      const dummyAPISpecAdapter = {
        build: () => ({ url: "/api", method: "get" })
      };
      class Hub$1 {
        constructor({ apiStateSpec, apiSpecAdapter, parentHub }) {
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
        rawFetch(stateID, rawFetchOption) {
          const { rawFetch } = this.findState$(stateID) || {};
          if (rawFetch) {
            rawFetch(rawFetchOption);
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

      function parseInheritProperty(node, cacheIDs) {
        var _a;
        const props = node.props || {};
        Object.values(props).forEach((property) => {
          if (property.type !== "inherited_property") {
            return;
          }
          if (!property.parentID) {
            return;
          }
          cacheIDs.add(property.parentID);
        });
        if ("children" in node) {
          (_a = node.children) == null ? void 0 : _a.forEach((subNode) => parseInheritProperty(subNode, cacheIDs));
        }
        if ("node" in node) {
          parseInheritProperty(node.node, cacheIDs);
        }
        return cacheIDs;
      }

      function getNodeIDByPath(path) {
        const nodePath = path.replace(/\/(.+)\/[0-9]+/g, "/$1");
        return nodePath.split("/").pop();
      }
      const NODE_SHOULD_NOT_CACHE = ["dummyLoopContainer", "placeholder-node"];
      class Store {
        constructor(cacheIDs) {
          this.cache = {};
          this.cacheIDs = cacheIDs;
        }
        shouldCache(nodeID) {
          return this.cacheIDs.has(nodeID);
        }
        initState(path) {
          if (!this.cache[path]) {
            this.cache[path] = new BehaviorSubject({});
          }
        }
        getProps$(parentID) {
          this.initState(parentID);
          return this.cache[parentID];
        }
        setProps(path, nodeID, props) {
          const nodePathID = getNodeIDByPath(path);
          if (!nodePathID || NODE_SHOULD_NOT_CACHE.includes(nodeID) || !this.shouldCache(nodePathID)) {
            return;
          }
          if (!this.cache[nodePathID]) {
            this.cache[nodePathID] = new BehaviorSubject(props);
            return;
          }
          this.cache[nodePathID].next(props);
        }
      }

      async function bootUp({ schema, parentCTX, plugins }) {
        const { apiStateSpec, sharedStatesSpec } = schema;
        const _plugins = Object.assign({}, (parentCTX == null ? void 0 : parentCTX.plugins) || {}, plugins || {});
        const statesHubAPI = new Hub$1({
          apiSpecAdapter: _plugins.apiSpecAdapter,
          apiStateSpec: apiStateSpec || {},
          parentHub: parentCTX == null ? void 0 : parentCTX.statesHubAPI
        });
        const instantiateSpec = deserialize(sharedStatesSpec || {}, void 0);
        const initializedState = await initializeLazyStates(instantiateSpec || {}, apiStateSpec || {}, _plugins.apiSpecAdapter);
        const statesHubShared = new Hub(initializedState, parentCTX == null ? void 0 : parentCTX.statesHubShared);
        const history = (parentCTX == null ? void 0 : parentCTX.history) || createBrowserHistory();
        const location$ = (parentCTX == null ? void 0 : parentCTX.location$) || new BehaviorSubject(history.location);
        if (!(parentCTX == null ? void 0 : parentCTX.location$)) {
          history.listen(({ location }) => {
            location$.next(location);
          });
        }
        const cacheIDs = parseInheritProperty(schema.node, /* @__PURE__ */ new Set());
        const nodePropsCache = new Store(cacheIDs);
        const ctx = {
          statesHubAPI,
          statesHubShared,
          apiStates: getAPIStates(statesHubAPI),
          states: getSharedStates(statesHubShared),
          history,
          location$,
          nodePropsCache,
          plugins: _plugins
        };
        const rootNode = deserialize(schema.node, {
          apiStates: ctx.apiStates,
          states: ctx.states,
          history: ctx.history
        });
        if (!rootNode) {
          return Promise.reject(new Error("failed to init ctx!"));
        }
        return { ctx, rootNode };
      }

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

      function useInheritedProps(node, ctx) {
        const convertors = {};
        const states$ = {};
        const initialFallbacks = {};
        Object.entries(node.props || {}).filter((pair) => {
          return pair[1].type === "inherited_property";
        }).forEach(([propName, { fallback, convertor, parentID }]) => {
          var _a;
          initialFallbacks[propName] = fallback;
          convertors[propName] = convertor;
          states$[propName] = (_a = ctx.nodePropsCache) == null ? void 0 : _a.getProps$(parentID);
        });
        const fallbacksRef = useRef(initialFallbacks);
        const [state, setState] = useState(() => {
          return Object.entries(states$).reduce((acc, [key, state$]) => {
            if (!state$) {
              acc[key] = fallbacksRef.current[key];
              return acc;
            }
            acc[key] = convertState({
              state: state$ == null ? void 0 : state$.getValue(),
              convertor: convertors[key],
              fallback: fallbacksRef.current[key],
              propName: key
            });
            return acc;
          }, {});
        });
        useEffect(() => {
          const inheritProps$ = Object.entries(states$).reduce((acc, [key, state$]) => {
            if (!state$) {
              acc[key] = of(fallbacksRef.current[key]);
              return acc;
            }
            acc[key] = state$.pipe(map((nodeProps) => {
              return convertState({
                state: nodeProps,
                convertor: convertors[key],
                fallback: fallbacksRef.current[key],
                propName: key
              });
            }), tap((convertedProps) => fallbacksRef.current[key] = convertedProps));
            return acc;
          }, {});
          const subscription = combineLatest(inheritProps$).pipe(skip$1(1)).subscribe(setState);
          return () => subscription.unsubscribe();
        }, []);
        return state;
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
        const currentPath = useContext(PathContext);
        const constantProps = useConstantProps(node);
        const apiResultProps = useAPIResultProps(node, ctx);
        const apiLoadingProps = useAPILoadingProps(node, ctx);
        const sharedStateProps = useSharedStateProps(node, ctx);
        const internalHookProps = useInternalHookProps(node, ctx);
        const computedProps = useComputedProps(node, ctx);
        const inheritedProps = useInheritedProps(node, ctx);
        const funcProps = useFuncProps(node);
        const sharedStateMutationProps = useSharedStateMutationProps(node, ctx);
        const apiStateInvokeProps = useAPIInvokeProps(node, ctx);
        const renderProps = useRenderProps(node, ctx);
        const linkProps = useLinkProps(node, ctx);
        return useMemo(() => {
          var _a;
          const instantiateProps = Object.assign(constantProps, apiStateInvokeProps, apiResultProps, apiLoadingProps, sharedStateProps, computedProps, sharedStateMutationProps, internalHookProps, renderProps, linkProps, inheritedProps);
          (_a = ctx.nodePropsCache) == null ? void 0 : _a.setProps(currentPath, node.id, instantiateProps);
          return Object.assign(instantiateProps, funcProps);
        }, [apiResultProps, sharedStateProps, apiLoadingProps, computedProps, constantProps]);
      }

      function useLifecycleHook({ didMount, willUnmount }) {
        useEffect(() => {
          didMount == null ? void 0 : didMount();
          return () => {
            willUnmount == null ? void 0 : willUnmount();
          };
        }, []);
      }
      function useRefResult({ schemaID, refLoader, orphan }, parentCTX) {
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
            return bootUp({
              plugins,
              schema,
              parentCTX: orphan ? void 0 : parentCTX
            });
          }).then((refBootResult) => {
            if (!refBootResult || !_schema) {
              return;
            }
            setResult({ ctx: refBootResult.ctx, rootNode: refBootResult.rootNode });
          }).catch(logger.error);
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
        const result = useRefResult({ schemaID: node.schemaID, refLoader: ctx.plugins.refLoader, orphan: node.orphan }, ctx);
        if (!result) {
          if (node.fallback) {
            return React.createElement(NodeRender, { node: node.fallback, ctx });
          }
          return null;
        }
        return React.createElement(NodeRender, { node: result.rootNode, ctx: result.ctx });
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
          return React.createElement(PathContext.Provider, { value: `${parentPath}/${node.id}/${index}`, key: index }, React.createElement(OutLayerRender, { key, outLayer: node.outLayer, ctx }, (node.nodes || node.children).map((composedChild, index2) => {
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

      function useBootResult(schema, plugins) {
        const [result, setResult] = useState();
        useEffect(() => {
          let unMounting = false;
          bootUp({ schema, plugins }).then((bootResult) => {
            if (!unMounting) {
              setResult(bootResult);
            }
          }).catch(logger.error);
          return () => {
            unMounting = true;
          };
        }, []);
        return result;
      }
      function SchemaRender({ schema, plugins }, ref) {
        const { ctx, rootNode } = useBootResult(schema, plugins) || {};
        useImperativeHandle(ref, () => {
          if (!ctx) {
            return;
          }
          return { apiStates: ctx.apiStates, states: ctx.states, history: ctx.history };
        }, [ctx]);
        if (!ctx || !rootNode) {
          return null;
        }
        return React.createElement(NodeRender, { node: rootNode, ctx });
      }
      var schemaRender = exports('SchemaRender', React.forwardRef(SchemaRender));

      class RenderEngine {
        constructor(schema, plugins) {
          this.schema = schema;
          this.plugins = plugins || {};
        }
        async render(renderRoot) {
          const { ctx, rootNode } = await bootUp({
            plugins: this.plugins,
            schema: this.schema
          });
          ReactDOM.render(React.createElement(NodeRender, { node: rootNode, ctx }), renderRoot);
        }
      } exports({ RenderEngine: RenderEngine, 'default': RenderEngine });

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9wYXRoLWNvbnRleHQudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9hcGktc3RhdGVzLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvZGVzZXJpYWxpemUvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9kZXNlcmlhbGl6ZS9pbnN0YW50aWF0ZS50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2Rlc2VyaWFsaXplL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaHR0cC9odHRwLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaHR0cC9yZXNwb25zZS50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2luaXQtYXBpLXN0YXRlLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvc3RhdGVzLWh1Yi1hcGkudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9zaGFyZWQtc3RhdGVzLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvc3RhdGVzLWh1Yi1zaGFyZWQudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9pbml0aWFsaXplLWxhenktc2hhcmVkLXN0YXRlcy50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2Rlc2VyaWFsaXplL3BhcnNlLWluaGVyaXQtcHJvcGVydHkudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9ub2RlLXByb3BzLWNhY2hlLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1jb25zdGFudC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1hcGktcmVzdWx0LXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtYXBpLWxvYWRpbmctcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1hcGktaW52b2tlLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2Utc2hhcmVkLXN0YXRlLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtZnVuYy1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLXNoYXJlZC1zdGF0ZS1tdXRhdGlvbi50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWludGVybmFsLWhvb2stcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1yZW5kZXItcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1jb21wdXRlZC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWluaGVyaXRlZC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWxpbmstcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2hvb2tzL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2pzeC1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yZWYtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaHRtbC1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9sb29wLW5vZGUtcmVuZGVyL2hlbHBlcnMudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9sb29wLWluZGl2aWR1YWwudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaG9va3MvaGVscGVyLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9sb29wLW5vZGUtcmVuZGVyL291dC1sYXllci1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9sb29wLWNvbXBvc2VkLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2xvb3Atbm9kZS1yZW5kZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvcm91dGUtbm9kZS1yZW5kZXIvcm91dGUtcGF0aC1jb250ZXh0LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL3JvdXRlLW5vZGUtcmVuZGVyL3V0aWxzLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL3JvdXRlLW5vZGUtcmVuZGVyL3VzZS1tYXRjaC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yb3V0ZS1ub2RlLXJlbmRlci9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yZWFjdC1jb21wb25lbnQtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvc2NoZW1hLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9yZW5kZXItZW5naW5lLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IFBhdGhDb250ZXh0ID0gUmVhY3QuY3JlYXRlQ29udGV4dDxzdHJpbmc+KCdST09UJyk7XG5cbmV4cG9ydCBkZWZhdWx0IFBhdGhDb250ZXh0O1xuIiwiaW1wb3J0IHsgRmV0Y2hQYXJhbXMgfSBmcm9tICdAb25lLWZvci1hbGwvYXBpLXNwZWMtYWRhcHRlcic7XG5pbXBvcnQgeyBBUElGZXRjaENhbGxiYWNrIH0gZnJvbSAnLi4nO1xuaW1wb3J0IHsgQVBJU3RhdGVXaXRoRmV0Y2gsIEFQSVN0YXRlLCBTdGF0ZXNIdWJBUEksIFJhd0ZldGNoT3B0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5mdW5jdGlvbiBnZXRBUElTdGF0ZXMoc3RhdGVzSHViQVBJOiBTdGF0ZXNIdWJBUEkpOiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBBUElTdGF0ZVdpdGhGZXRjaD4+IHtcbiAgY29uc3QgaGFuZGxlcjogUHJveHlIYW5kbGVyPFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIEFQSVN0YXRlPj4+ID0ge1xuICAgIGdldDogKHRhcmdldDogUmVhZG9ubHk8UmVjb3JkPHN0cmluZywgQVBJU3RhdGU+PiwgcDogc3RyaW5nKTogQVBJU3RhdGVXaXRoRmV0Y2ggPT4ge1xuICAgICAgY29uc3QgYXBpU3RhdGUgPSBzdGF0ZXNIdWJBUEkuZ2V0U3RhdGUkKHApLmdldFZhbHVlKCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmFwaVN0YXRlLFxuICAgICAgICByZWZyZXNoOiAoKSA9PiBzdGF0ZXNIdWJBUEkucmVmcmVzaChwKSxcbiAgICAgICAgZmV0Y2g6IChmZXRjaFBhcmFtczogRmV0Y2hQYXJhbXMsIGNhbGxiYWNrPzogQVBJRmV0Y2hDYWxsYmFjayk6IHZvaWQgPT4ge1xuICAgICAgICAgIHN0YXRlc0h1YkFQSS5mZXRjaChwLCB7IHBhcmFtczogZmV0Y2hQYXJhbXMsIGNhbGxiYWNrIH0pO1xuICAgICAgICB9LFxuICAgICAgICByYXdGZXRjaDogKHJhd0ZldGNoT3B0aW9uOiBSYXdGZXRjaE9wdGlvbiwgY2FsbGJhY2s/OiBBUElGZXRjaENhbGxiYWNrIHwgdW5kZWZpbmVkKTogdm9pZCA9PiB7XG4gICAgICAgICAgc3RhdGVzSHViQVBJLnJhd0ZldGNoKHAsIHJhd0ZldGNoT3B0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJveHk8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgQVBJU3RhdGVXaXRoRmV0Y2g+Pj4oe30sIGhhbmRsZXIpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRBUElTdGF0ZXM7XG4iLCJpbXBvcnQgdHlwZSAqIGFzIFNjaGVtYVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IHsgVmVyc2F0aWxlRnVuYywgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChuOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jU3BlYyhuOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICghaXNPYmplY3QobikgfHwgdHlwZW9mIG4gIT09ICdvYmplY3QnIHx8IG4gPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoJ3R5cGUnIGluIG4gJiYgUmVmbGVjdC5nZXQobiwgJ3R5cGUnKSA9PT0gJ3N0YXRlX2NvbnZlcnRfZXhwcmVzc2lvbicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhuKS5sZW5ndGggPT09IDMgJiYgJ3R5cGUnIGluIG4gJiYgJ2FyZ3MnIGluIG4gJiYgJ2JvZHknIGluIG4pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaW5zdGFudGlhdGVTdGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCBjdHg6IHVua25vd24pOiBTdGF0ZUNvbnZlcnRvciB7XG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3N0YXRlJywgYHJldHVybiAke2V4cHJlc3Npb259YCkuYmluZChjdHgpO1xuICAgIGZuLnRvU3RyaW5nID0gKCkgPT5cbiAgICAgIFsnJywgJ2Z1bmN0aW9uIHdyYXBwZWRTdGF0ZUNvbnZlcnRvcihzdGF0ZSkgeycsIGBcXHRyZXR1cm4gJHtleHByZXNzaW9ufWAsICd9J10uam9pbignXFxuJyk7XG5cbiAgICByZXR1cm4gZm47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgWydmYWlsZWQgdG8gaW5zdGFudGlhdGUgc3RhdGUgY29udmVydCBleHByZXNzaW9uOicsICdcXG4nLCBleHByZXNzaW9uLCAnXFxuJywgZXJyb3JdLmpvaW4oJycpLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlRnVuY1NwZWMoXG4gIHNwZWM6IFNjaGVtYVNwZWMuQmFzZUZ1bmN0aW9uU3BlYyB8IFNjaGVtYVNwZWMuU3RhdGVDb252ZXJ0RXhwcmVzc2lvbixcbiAgY3R4OiB1bmtub3duLFxuKTogVmVyc2F0aWxlRnVuYyB7XG4gIGlmICgnZXhwcmVzc2lvbicgaW4gc3BlYyAmJiBzcGVjLnR5cGUgPT09ICdzdGF0ZV9jb252ZXJ0X2V4cHJlc3Npb24nKSB7XG4gICAgcmV0dXJuIGluc3RhbnRpYXRlU3RhdGVFeHByZXNzaW9uKHNwZWMuZXhwcmVzc2lvbiwgY3R4KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oc3BlYy5hcmdzLCBzcGVjLmJvZHkpLmJpbmQoY3R4KTtcbiAgICBmbi50b1N0cmluZyA9ICgpID0+IFsnJywgYGZ1bmN0aW9uIHdyYXBwZWRGdW5jKCR7c3BlYy5hcmdzfSkge2AsIGBcXHQke3NwZWMuYm9keX1gLCAnfScsICcnXS5qb2luKCdcXG4nKTtcbiAgICByZXR1cm4gZm47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgW1xuICAgICAgICAnZmFpbGVkIHRvIGluc3RhbnRpYXRlIGZ1bmN0aW9uIG9mIGZvbGxvd2luZyBzcGVjOicsXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnc3BlYy5hcmdzOicsXG4gICAgICAgIHNwZWMuYXJncyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgICdzcGVjLmJvZHk6JyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIHNwZWMuYm9keSxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIGVycm9yLFxuICAgICAgXS5qb2luKCcnKSxcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpbnN0YW50aWF0ZUZ1bmNTcGVjLCBpc09iamVjdCwgaXNGdW5jU3BlYyB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBpbnN0YW50aWF0ZShuOiB1bmtub3duLCBjdHg6IHVua25vd24pOiB1bmtub3duIHtcbiAgaWYgKCFpc09iamVjdChuKSB8fCB0eXBlb2YgbiAhPT0gJ29iamVjdCcgfHwgbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBuO1xuICB9XG5cbiAgT2JqZWN0LmVudHJpZXMobikuZm9yRWFjaCgoW2tleSwgdl0pID0+IHtcbiAgICBpZiAoaXNGdW5jU3BlYyh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQobiwga2V5LCBpbnN0YW50aWF0ZUZ1bmNTcGVjKHYsIGN0eCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc09iamVjdCh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQobiwga2V5LCBpbnN0YW50aWF0ZSh2LCBjdHgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQoXG4gICAgICAgIG4sXG4gICAgICAgIGtleSxcbiAgICAgICAgdi5tYXAoKF92KSA9PiBpbnN0YW50aWF0ZShfdiwgY3R4KSksXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluc3RhbnRpYXRlO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB7IFJlbmRlckVuZ2luZUNUWCB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuaW1wb3J0IGluc3RhbnRpYXRlIGZyb20gJy4vaW5zdGFudGlhdGUnO1xuXG5mdW5jdGlvbiBkZXNlcmlhbGl6ZShuOiB1bmtub3duLCBjdHg6IFJlbmRlckVuZ2luZUNUWCB8IHVuZGVmaW5lZCk6IHVua25vd24gfCBudWxsIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaW5zdGFudGlhdGUoSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShuKSksIGN0eCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKCdkZXNlcmlhbGl6ZSBmYWlsZWQ6JywgZXJyb3IpO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlc2VyaWFsaXplO1xuIiwiaW1wb3J0IHsgY2F0Y2hFcnJvciwgbWFwLCBPYnNlcnZhYmxlLCBvZiwgc2hhcmUsIHN3aXRjaE1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgYWpheCwgQWpheENvbmZpZywgQWpheFJlc3BvbnNlIH0gZnJvbSAncnhqcy9hamF4JztcblxuaW1wb3J0IHR5cGUgeyBBUElTdGF0ZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxudHlwZSBSZXNwb25zZSA9IE9taXQ8QVBJU3RhdGUsICdsb2FkaW5nJz47XG50eXBlIFJlc3BvbnNlJCA9IE9ic2VydmFibGU8UmVzcG9uc2U+O1xuXG4vLyB0b2RvIHN1cHBvcnQgcmV0cnkgYW5kIHRpbWVvdXRcbmZ1bmN0aW9uIHNlbmRSZXF1ZXN0KGFqYXhSZXF1ZXN0OiBBamF4Q29uZmlnKTogUmVzcG9uc2UkIHtcbiAgcmV0dXJuIGFqYXgoYWpheFJlcXVlc3QpLnBpcGUoXG4gICAgbWFwPEFqYXhSZXNwb25zZTx1bmtub3duPiwgUmVzcG9uc2U+KCh7IHJlc3BvbnNlIH0pID0+ICh7IHJlc3VsdDogcmVzcG9uc2UsIGVycm9yOiB1bmRlZmluZWQgfSkpLFxuICAgIGNhdGNoRXJyb3IoKGVycm9yKSA9PiB7XG4gICAgICByZXR1cm4gb2YoeyBlcnJvcjogZXJyb3IsIGRhdGE6IHVuZGVmaW5lZCB9KTtcbiAgICB9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaHR0cChyZXF1ZXN0JDogT2JzZXJ2YWJsZTxBamF4Q29uZmlnPik6IFJlc3BvbnNlJCB7XG4gIGNvbnN0IHJlc3BvbnNlJDogUmVzcG9uc2UkID0gcmVxdWVzdCQucGlwZShzd2l0Y2hNYXAoc2VuZFJlcXVlc3QpLCBzaGFyZSgpKTtcblxuICByZXR1cm4gcmVzcG9uc2UkO1xufVxuIiwiaW1wb3J0IHsgUmVzcG9uc2VBZGFwdGVyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FwaS1zcGVjLWFkYXB0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBamF4Q29uZmlnIH0gZnJvbSAncnhqcy9hamF4JztcbmltcG9ydCB7IG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgdHlwZSB7IEFQSVN0YXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5pbXBvcnQgaHR0cCBmcm9tICcuL2h0dHAnO1xuXG4vLyBBUEkgU3RhdGUgVGFibGVcbi8qXG4gICAgfCAgICAgfCBsb2FkaW5nIHwgICBkYXRhICAgIHwgICBlcnJvciAgIHxcbiAgICB8IC0tLSB8IDotLS0tLTogfCA6LS0tLS0tLTogfCA6LS0tLS0tLTogfFxuICAgIHwgMSAgIHwgIGZhbHNlICB8IHVuZGVmaW5lZCB8IHVuZGVmaW5lZCB8XG4gICAgfCAyICAgfCAgdHJ1ZSAgIHwgdW5kZWZpbmVkIHwgdW5kZWZpbmVkIHxcbuKUjOKUgOKUgOKWunwgMyAgIHwgIGZhbHNlICB8ICAgIHt9ICAgICB8IHVuZGVmaW5lZCB84peE4pSA4pSA4pSA4pSA4pSQXG7ilJTilIDilIDilIB8IDQgICB8ICB0cnVlICAgfCAgICB7fSAgICAgfCB1bmRlZmluZWQgfCAgICAg4pSCXG4gICAgfCA1ICAgfCAgZmFsc2UgIHwgdW5kZWZpbmVkIHwgICAgeHh4ICAgIHwgICAgIOKUglxuICAgIHwgNiAgIHwgIHRydWUgICB8IHVuZGVmaW5lZCB8ICAgIHh4eCAgICB84pSA4pSA4pSA4pSA4pSA4pSYXG4qL1xuZXhwb3J0IGNvbnN0IGluaXRpYWxTdGF0ZTogQVBJU3RhdGUgPSB7IHJlc3VsdDogdW5kZWZpbmVkLCBlcnJvcjogdW5kZWZpbmVkLCBsb2FkaW5nOiBmYWxzZSB9O1xuXG5mdW5jdGlvbiBnZXRSZXNwb25zZVN0YXRlJChcbiAgcmVxdWVzdCQ6IE9ic2VydmFibGU8QWpheENvbmZpZz4sXG4gIHJlc3BvbnNlQWRhcHRlcj86IFJlc3BvbnNlQWRhcHRlcixcbik6IEJlaGF2aW9yU3ViamVjdDxBUElTdGF0ZT4ge1xuICBjb25zdCBzdGF0ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPihpbml0aWFsU3RhdGUpO1xuICBjb25zdCByZXNwb25zZSQgPSBodHRwKHJlcXVlc3QkKTtcblxuICByZXNwb25zZSRcbiAgICAucGlwZShcbiAgICAgIG1hcCgoeyByZXN1bHQsIGVycm9yIH0pID0+ICh7IHJlc3VsdCwgZXJyb3IsIGxvYWRpbmc6IGZhbHNlIH0pKSxcbiAgICAgIG1hcDxBUElTdGF0ZSwgQVBJU3RhdGU+KChhcGlTdGF0ZSkgPT4ge1xuICAgICAgICBpZiAoIXJlc3BvbnNlQWRhcHRlcikge1xuICAgICAgICAgIHJldHVybiBhcGlTdGF0ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkID0gcmVzcG9uc2VBZGFwdGVyKHsgYm9keTogYXBpU3RhdGUucmVzdWx0LCBlcnJvcjogYXBpU3RhdGUuZXJyb3IgfSk7XG5cbiAgICAgICAgcmV0dXJuIHsgLi4udHJhbnNmb3JtZWQsIGxvYWRpbmc6IGFwaVN0YXRlLmxvYWRpbmcgfTtcbiAgICAgIH0pLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKHN0YXRlJCk7XG5cbiAgcmVxdWVzdCRcbiAgICAucGlwZShcbiAgICAgIGZpbHRlcigoKSA9PiBzdGF0ZSQuZ2V0VmFsdWUoKS5sb2FkaW5nID09PSBmYWxzZSksXG4gICAgICBtYXAoKCkgPT4gKHsgLi4uc3RhdGUkLmdldFZhbHVlKCksIGxvYWRpbmc6IHRydWUgfSkpLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKHN0YXRlJCk7XG5cbiAgcmV0dXJuIHN0YXRlJDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0UmVzcG9uc2VTdGF0ZSQ7XG4iLCJpbXBvcnQgeyBtZXJnZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgQWpheENvbmZpZyB9IGZyb20gJ3J4anMvYWpheCc7XG5pbXBvcnQgeyBtYXAsIGZpbHRlciwgc2hhcmUsIHNraXAsIGRlbGF5IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHR5cGUgeyBBUElTcGVjQWRhcHRlciwgRmV0Y2hQYXJhbXMgfSBmcm9tICdAb25lLWZvci1hbGwvYXBpLXNwZWMtYWRhcHRlcic7XG5cbmltcG9ydCB0eXBlIHsgRmV0Y2hPcHRpb24sIEFQSVN0YXRlJFdpdGhBY3Rpb25zIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGdldFJlc3BvbnNlU3RhdGUkIGZyb20gJy4vaHR0cC9yZXNwb25zZSc7XG5cbmZ1bmN0aW9uIGluaXRBUElTdGF0ZShhcGlJRDogc3RyaW5nLCBhcGlTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIpOiBBUElTdGF0ZSRXaXRoQWN0aW9ucyB7XG4gIGNvbnN0IHJhd1BhcmFtcyQgPSBuZXcgU3ViamVjdDxBamF4Q29uZmlnPigpO1xuICBjb25zdCBwYXJhbXMkID0gbmV3IFN1YmplY3Q8RmV0Y2hQYXJhbXMgfCB1bmRlZmluZWQ+KCk7XG4gIGNvbnN0IHJlcXVlc3QkID0gcGFyYW1zJC5waXBlKFxuICAgIC8vIGl0IGlzIGFkYXB0ZXIncyByZXNwb25zaWJpbGl0eSB0byBoYW5kbGUgYnVpbGQgZXJyb3JcbiAgICAvLyBpZiBhIGVycm9yIG9jY3VycmVkLCBidWlsZCBzaG91bGQgcmV0dXJuIHVuZGVmaW5lZFxuICAgIG1hcCgocGFyYW1zKSA9PiBhcGlTcGVjQWRhcHRlci5idWlsZChhcGlJRCwgcGFyYW1zKSksXG4gICAgZmlsdGVyKEJvb2xlYW4pLFxuICAgIHNoYXJlKCksXG4gICk7XG5cbiAgbGV0IF9sYXRlc3RGZXRjaE9wdGlvbjogRmV0Y2hPcHRpb24gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gIGNvbnN0IGFwaVN0YXRlJCA9IGdldFJlc3BvbnNlU3RhdGUkKG1lcmdlKHJlcXVlc3QkLCByYXdQYXJhbXMkKSwgYXBpU3BlY0FkYXB0ZXIucmVzcG9uc2VBZGFwdGVyKTtcblxuICAvLyBleGVjdXRlIGZldGNoIGNhbGxiYWNrIGFmdGVyIG5ldyBgcmVzdWx0YCBlbWl0dGVkIGZyb20gYXBpU3RhdGUkXG4gIGFwaVN0YXRlJFxuICAgIC5waXBlKFxuICAgICAgc2tpcCgxKSxcbiAgICAgIGZpbHRlcigoeyBsb2FkaW5nIH0pID0+ICFsb2FkaW5nKSxcbiAgICAgIC8vIGJlY2F1c2UgdGhpcyBzdWJzY3JpcHRpb24gaXMgaGFwcGVuZWQgYmVmb3JlIHRoYW4gdmlldydzLFxuICAgICAgLy8gc28gZGVsYXkgYGNhbGxiYWNrYCBleGVjdXRpb24gdG8gbmV4dCBmcmFtZS5cbiAgICAgIGRlbGF5KDEwKSxcbiAgICApXG4gICAgLnN1YnNjcmliZSgoc3RhdGUpID0+IHtcbiAgICAgIF9sYXRlc3RGZXRjaE9wdGlvbj8uY2FsbGJhY2s/LihzdGF0ZSk7XG4gICAgfSk7XG5cbiAgcmV0dXJuIHtcbiAgICBzdGF0ZSQ6IGFwaVN0YXRlJCxcbiAgICBmZXRjaDogKGZldGNoT3B0aW9uOiBGZXRjaE9wdGlvbikgPT4ge1xuICAgICAgX2xhdGVzdEZldGNoT3B0aW9uID0gZmV0Y2hPcHRpb247XG5cbiAgICAgIHBhcmFtcyQubmV4dChmZXRjaE9wdGlvbi5wYXJhbXMpO1xuICAgIH0sXG4gICAgcmF3RmV0Y2g6ICh7IGNhbGxiYWNrLCAuLi5hamF4Q29uZmlnIH0pID0+IHtcbiAgICAgIC8vIHRvZG8gZml4IHRoaXNcbiAgICAgIF9sYXRlc3RGZXRjaE9wdGlvbiA9IHsgY2FsbGJhY2sgfTtcblxuICAgICAgcmF3UGFyYW1zJC5uZXh0KGFqYXhDb25maWcpO1xuICAgIH0sXG4gICAgcmVmcmVzaDogKCkgPT4ge1xuICAgICAgaWYgKCFfbGF0ZXN0RmV0Y2hPcHRpb24pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgLy8gb3ZlcnJpZGUgb25TdWNjZXNzIGFuZCBvbkVycm9yIHRvIHVuZGVmaW5lZFxuICAgICAgX2xhdGVzdEZldGNoT3B0aW9uID0geyBwYXJhbXM6IF9sYXRlc3RGZXRjaE9wdGlvbi5wYXJhbXMgfTtcbiAgICAgIHBhcmFtcyQubmV4dChfbGF0ZXN0RmV0Y2hPcHRpb24ucGFyYW1zKTtcbiAgICB9LFxuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0QVBJU3RhdGU7XG4iLCJpbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIG5vb3AgfSBmcm9tICdyeGpzJztcbmltcG9ydCB0eXBlIHsgQVBJU3BlY0FkYXB0ZXIgfSBmcm9tICdAb25lLWZvci1hbGwvYXBpLXNwZWMtYWRhcHRlcic7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuXG5pbXBvcnQgdHlwZSB7IFN0YXRlc0h1YkFQSSwgQVBJU3RhdGUsIEFQSVN0YXRlc1NwZWMsIEZldGNoT3B0aW9uLCBBUElTdGF0ZSRXaXRoQWN0aW9ucywgUmF3RmV0Y2hPcHRpb24sIEFQSUZldGNoQ2FsbGJhY2sgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpbml0aWFsU3RhdGUgfSBmcm9tICcuL2h0dHAvcmVzcG9uc2UnO1xuaW1wb3J0IGluaXRBUElTdGF0ZSBmcm9tICcuL2luaXQtYXBpLXN0YXRlJztcblxudHlwZSBDYWNoZSA9IFJlY29yZDxzdHJpbmcsIEFQSVN0YXRlJFdpdGhBY3Rpb25zPjtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgYXBpU3BlY0FkYXB0ZXI/OiBBUElTcGVjQWRhcHRlcjtcbiAgYXBpU3RhdGVTcGVjOiBBUElTdGF0ZXNTcGVjO1xuICBwYXJlbnRIdWI/OiBTdGF0ZXNIdWJBUEk7XG59XG5cbmNvbnN0IGR1bW15U3RhdGUkV2l0aEFjdGlvbjogQVBJU3RhdGUkV2l0aEFjdGlvbnMgPSB7XG4gIHN0YXRlJDogbmV3IEJlaGF2aW9yU3ViamVjdDxBUElTdGF0ZT4oaW5pdGlhbFN0YXRlKSxcbiAgZmV0Y2g6IG5vb3AsXG4gIHJhd0ZldGNoOiBub29wLFxuICByZWZyZXNoOiBub29wLFxufTtcblxuY29uc3QgZHVtbXlBUElTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIgPSB7XG4gIGJ1aWxkOiAoKSA9PiAoeyB1cmw6ICcvYXBpJywgbWV0aG9kOiAnZ2V0JyB9KSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1YiBpbXBsZW1lbnRzIFN0YXRlc0h1YkFQSSB7XG4gIHB1YmxpYyBjYWNoZTogQ2FjaGU7XG4gIHB1YmxpYyBwYXJlbnRIdWI/OiBTdGF0ZXNIdWJBUEkgPSB1bmRlZmluZWQ7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHsgYXBpU3RhdGVTcGVjLCBhcGlTcGVjQWRhcHRlciwgcGFyZW50SHViIH06IFByb3BzKSB7XG4gICAgdGhpcy5wYXJlbnRIdWIgPSBwYXJlbnRIdWI7XG5cbiAgICB0aGlzLmNhY2hlID0gT2JqZWN0LmVudHJpZXMoYXBpU3RhdGVTcGVjKS5yZWR1Y2U8Q2FjaGU+KChhY2MsIFtzdGF0ZUlELCB7IGFwaUlEIH1dKSA9PiB7XG4gICAgICBhY2Nbc3RhdGVJRF0gPSBpbml0QVBJU3RhdGUoYXBpSUQsIGFwaVNwZWNBZGFwdGVyIHx8IGR1bW15QVBJU3BlY0FkYXB0ZXIpO1xuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwdWJsaWMgaGFzU3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gISF0aGlzLnBhcmVudEh1Yj8uaGFzU3RhdGUkKHN0YXRlSUQpO1xuICB9XG5cbiAgcHVibGljIGZpbmRTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogQVBJU3RhdGUkV2l0aEFjdGlvbnMgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtzdGF0ZUlEXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJlbnRIdWI/LmZpbmRTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDxBUElTdGF0ZT4ge1xuICAgIGNvbnN0IHsgc3RhdGUkIH0gPSB0aGlzLmZpbmRTdGF0ZSQoc3RhdGVJRCkgfHwge307XG4gICAgaWYgKHN0YXRlJCkge1xuICAgICAgcmV0dXJuIHN0YXRlJDtcbiAgICB9XG5cbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICBbXG4gICAgICAgIGBjYW4ndCBmaW5kIGFwaSBzdGF0ZTogJHtzdGF0ZUlEfSwgcGxlYXNlIGNoZWNrIGFwaVN0YXRlU3BlYyBvciBwYXJlbnQgc2NoZW1hLmAsXG4gICAgICAgICdJbiBvcmRlciB0byBwcmV2ZW50IFVJIGNyYXNoLCBhIGR1bW15U3RhdGUkIHdpbGwgYmUgcmV0dXJuZWQuJyxcbiAgICAgIF0uam9pbignICcpLFxuICAgICk7XG5cbiAgICByZXR1cm4gZHVtbXlTdGF0ZSRXaXRoQWN0aW9uLnN0YXRlJDtcbiAgfVxuXG4gIHB1YmxpYyBmZXRjaChzdGF0ZUlEOiBzdHJpbmcsIGZldGNoT3B0aW9uOiBGZXRjaE9wdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IHsgZmV0Y2ggfSA9IHRoaXMuZmluZFN0YXRlJChzdGF0ZUlEKSB8fCB7fTtcbiAgICBpZiAoZmV0Y2gpIHtcbiAgICAgIGZldGNoKGZldGNoT3B0aW9uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICBbXG4gICAgICAgIGBjYW4ndCBmaW5kIGFwaSBzdGF0ZTogJHtzdGF0ZUlEfSwgcGxlYXNlIGNoZWNrIGFwaVN0YXRlU3BlYyBvciBwYXJlbnQgc2NoZW1hLGAsXG4gICAgICAgICd0aGlzIGZldGNoIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQuJyxcbiAgICAgIF0uam9pbignICcpLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmF3RmV0Y2goc3RhdGVJRDogc3RyaW5nLCByYXdGZXRjaE9wdGlvbjogUmF3RmV0Y2hPcHRpb24gJiB7IGNhbGxiYWNrPzogQVBJRmV0Y2hDYWxsYmFjazsgfSk6IHZvaWQge1xuICAgIGNvbnN0IHsgcmF3RmV0Y2ggfSA9IHRoaXMuZmluZFN0YXRlJChzdGF0ZUlEKSB8fCB7fTtcbiAgICBpZiAocmF3RmV0Y2gpIHtcbiAgICAgIHJhd0ZldGNoKHJhd0ZldGNoT3B0aW9uKTtcbiAgICB9XG5cbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICBbXG4gICAgICAgIGBjYW4ndCBmaW5kIGFwaSBzdGF0ZTogJHtzdGF0ZUlEfSwgcGxlYXNlIGNoZWNrIGFwaVN0YXRlU3BlYyBvciBwYXJlbnQgc2NoZW1hLGAsXG4gICAgICAgICd0aGlzIGZldGNoIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQuJyxcbiAgICAgIF0uam9pbignICcpLFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmVmcmVzaChzdGF0ZUlEOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCB7IHJlZnJlc2ggfSA9IHRoaXMuZmluZFN0YXRlJChzdGF0ZUlEKSB8fCB7fTtcbiAgICBpZiAocmVmcmVzaCkge1xuICAgICAgcmVmcmVzaCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEsYCxcbiAgICAgICAgJ3RoaXMgcmVmcmVzaCBhY3Rpb24gd2lsbCBiZSBpZ25vcmVkLicsXG4gICAgICBdLmpvaW4oJyAnKSxcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IFNoYXJlZFN0YXRlSHViIGZyb20gJy4vc3RhdGVzLWh1Yi1zaGFyZWQnO1xuXG5mdW5jdGlvbiBnZXRTaGFyZWRTdGF0ZXMoc3RhdGVzSHViU2hhcmVkOiBTaGFyZWRTdGF0ZUh1Yik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgaGFuZGxlcjogUHJveHlIYW5kbGVyPFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIHVua25vd24+Pj4gPSB7XG4gICAgZ2V0OiAodGFyZ2V0OiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PiwgcDogc3RyaW5nKTogdW5rbm93biA9PiB7XG4gICAgICByZXR1cm4gc3RhdGVzSHViU2hhcmVkLmdldFN0YXRlJChwKS52YWx1ZTtcbiAgICB9LFxuXG4gICAgc2V0OiAodGFyZ2V0OiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PiwgcDogc3RyaW5nLCB2YWx1ZTogdW5rbm93bik6IGJvb2xlYW4gPT4ge1xuICAgICAgaWYgKHAuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignbm9kZSBpbnRlcm5hbCBzdGF0ZSBjYW4gbm90IGJlIGFzc2lnbmVkJyk7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgc3RhdGVzSHViU2hhcmVkLm11dGF0ZVN0YXRlKHAsIHZhbHVlKTtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSxcbiAgfTtcblxuICByZXR1cm4gbmV3IFByb3h5PFJlY29yZDxzdHJpbmcsIHVua25vd24+Pih7fSwgaGFuZGxlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldFNoYXJlZFN0YXRlcztcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgU3RhdGVzSHViU2hhcmVkLCBTaGFyZWRTdGF0ZXNTcGVjIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIdWIgaW1wbGVtZW50cyBTdGF0ZXNIdWJTaGFyZWQge1xuICBwdWJsaWMgY2FjaGU6IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj47XG4gIHB1YmxpYyBwYXJlbnRIdWI/OiBTdGF0ZXNIdWJTaGFyZWQgPSB1bmRlZmluZWQ7XG4gIHB1YmxpYyB1bldyaXRlYWJsZVN0YXRlczogc3RyaW5nW10gPSBbXTtcblxuICBwdWJsaWMgY29uc3RydWN0b3Ioc3BlYzogU2hhcmVkU3RhdGVzU3BlYywgcGFyZW50SHViPzogU3RhdGVzSHViU2hhcmVkKSB7XG4gICAgdGhpcy5wYXJlbnRIdWIgPSBwYXJlbnRIdWI7XG4gICAgdGhpcy5jYWNoZSA9IE9iamVjdC5lbnRyaWVzKHNwZWMpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtzdGF0ZUlELCB7IGluaXRpYWwsIHdyaXRlYWJsZSB9XSkgPT4ge1xuICAgICAgICBhY2Nbc3RhdGVJRF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGluaXRpYWwpO1xuICAgICAgICBpZiAod3JpdGVhYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgIHRoaXMudW5Xcml0ZWFibGVTdGF0ZXMucHVzaChzdGF0ZUlEKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIHt9LFxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgaGFzU3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gISF0aGlzLnBhcmVudEh1Yj8uaGFzU3RhdGUkKHN0YXRlSUQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfY3JlYXRlU3RhdGUkKHN0YXRlSUQ6IHN0cmluZywgaW5pdGlhbFZhbHVlPzogdW5rbm93bik6IHZvaWQge1xuICAgIHRoaXMuY2FjaGVbc3RhdGVJRF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KGluaXRpYWxWYWx1ZSk7XG4gIH1cblxuICBwdWJsaWMgZmluZFN0YXRlJChzdGF0ZUlEOiBzdHJpbmcpOiBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4gfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVtzdGF0ZUlEXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5wYXJlbnRIdWI/LmZpbmRTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDx1bmtub3duPiB7XG4gICAgY29uc3Qgc3RhdGUkID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpO1xuICAgIGlmIChzdGF0ZSQpIHtcbiAgICAgIHJldHVybiBzdGF0ZSQ7XG4gICAgfVxuXG4gICAgdGhpcy5fY3JlYXRlU3RhdGUkKHN0YXRlSUQpO1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGVbc3RhdGVJRF07XG4gIH1cblxuICBwdWJsaWMgbXV0YXRlU3RhdGUoc3RhdGVJRDogc3RyaW5nLCBzdGF0ZTogdW5rbm93bik6IHZvaWQge1xuICAgIGlmIChzdGF0ZUlELnN0YXJ0c1dpdGgoJyQnKSkge1xuICAgICAgbG9nZ2VyLndhcm4oJ3NoYXJlZCBzdGF0ZUlEIGNhbiBub3Qgc3RhcnRzIHdpdGggJCwgdGhpcyBhY3Rpb24gd2lsbCBiZSBpZ25vcmVkJyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMudW5Xcml0ZWFibGVTdGF0ZXMuaW5jbHVkZXMoc3RhdGVJRCkpIHtcbiAgICAgIGxvZ2dlci53YXJuKCd0aGlzIHNoYXJlZCBzdGF0ZSBpcyBub3QgYWxsb3dlZCB0byBiZSB3cml0dGVuLCB0aGlzIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmdldFN0YXRlJChzdGF0ZUlEKS5uZXh0KHN0YXRlKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXROb2RlU3RhdGUkKG5vZGVQYXRoOiBzdHJpbmcpOiBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4ge1xuICAgIGNvbnN0IHN0YXRlSUQgPSBgJCR7bm9kZVBhdGh9YDtcbiAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZXhwb3NlTm9kZVN0YXRlKG5vZGVQYXRoOiBzdHJpbmcsIHN0YXRlOiB1bmtub3duKTogdm9pZCB7XG4gICAgY29uc3Qgc3RhdGVJRCA9IGAkJHtub2RlUGF0aH1gO1xuICAgIGlmICh0aGlzLmNhY2hlW3N0YXRlSURdKSB7XG4gICAgICB0aGlzLmNhY2hlW3N0YXRlSURdLm5leHQoc3RhdGUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuX2NyZWF0ZVN0YXRlJChzdGF0ZUlELCBzdGF0ZSk7XG4gIH1cbn1cbiIsImltcG9ydCB7IEFQSVNwZWNBZGFwdGVyLCBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIGZpcnN0VmFsdWVGcm9tLCBmcm9tLCBsYXN0LCBtYXAsIE9ic2VydmFibGUsIG9mLCBzd2l0Y2hNYXAsIHRha2UsIHRhcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQVBJU3RhdGVzU3BlYywgU2hhcmVkU3RhdGVzU3BlYywgSW5pdGlhbGl6ZXJGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGluaXRBUElTdGF0ZSBmcm9tICcuL2luaXQtYXBpLXN0YXRlJztcblxuaW50ZXJmYWNlIExhenlTdGF0ZSB7XG4gIHN0YXRlSUQ6IHN0cmluZztcbiAgZnVuYzogSW5pdGlhbGl6ZXJGdW5jO1xuICBkZXBlbmRlbmNpZXM/OiB7XG4gICAgW2tleTogc3RyaW5nXTogRmV0Y2hQYXJhbXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvRGVwZW5kZW5jeSQoXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbiAgYXBpSUQ6IHN0cmluZyxcbiAgcGFyYW1zOiBGZXRjaFBhcmFtcyxcbik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCB7IHN0YXRlJCwgZmV0Y2ggfSA9IGluaXRBUElTdGF0ZShhcGlJRCwgYXBpU3BlY0FkYXB0ZXIpO1xuXG4gIC8vIHdlIG9ubHkgbmVlZCB0aGUgYXBpIHJlc3VsdFxuICBjb25zdCBkZXBlbmRlbmN5JCA9IHN0YXRlJC5waXBlKFxuICAgIC8vIGxvYWRpbmcsIHJlc29sdmVkXG4gICAgdGFrZSgyKSxcbiAgICBsYXN0KCksXG4gICAgbWFwKCh7IHJlc3VsdCB9KSA9PiByZXN1bHQpLFxuICApO1xuXG4gIGZldGNoKHsgcGFyYW1zIH0pO1xuXG4gIHJldHVybiBkZXBlbmRlbmN5JDtcbn1cblxuZnVuY3Rpb24gdG9EZXBzJChcbiAgZGVwczogUmVjb3JkPHN0cmluZywgRmV0Y2hQYXJhbXM+LFxuICBhcGlTdGF0ZXM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbik6IE9ic2VydmFibGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgY29uc3QgZGVwZW5kZW5jaWVzJCA9IE9iamVjdC5lbnRyaWVzKGRlcHMpXG4gICAgLm1hcCgoW3N0YXRlSUQsIGZldGNoUGFyYW1zXSkgPT4ge1xuICAgICAgaWYgKCFhcGlTdGF0ZXNbc3RhdGVJRF0pIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgIGBubyBzdGF0ZTogJHtzdGF0ZUlEfSBmb3VuZCBpbiBBUElTdGF0ZXNTcGVjLCB1bmRlZmluZWQgd2lsbCBiZSB1c2VkIGFzIHRoaXMgZGVwZW5kZW5jeSB2YWx1ZWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYXBpSUQgfSA9IGFwaVN0YXRlc1tzdGF0ZUlEXTtcblxuICAgICAgcmV0dXJuIFtzdGF0ZUlELCB0b0RlcGVuZGVuY3kkKGFwaVNwZWNBZGFwdGVyLCBhcGlJRCwgZmV0Y2hQYXJhbXMpXTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj5dID0+ICEhcGFpcilcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgZGVwZW5kZW5jeSRdKSA9PiB7XG4gICAgICBhY2Nbc3RhdGVJRF0gPSBkZXBlbmRlbmN5JDtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuXG4gIGlmICghT2JqZWN0LmtleXMoZGVwZW5kZW5jaWVzJCkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG9mKHt9KTtcbiAgfVxuXG4gIHJldHVybiBjb21iaW5lTGF0ZXN0KGRlcGVuZGVuY2llcyQpO1xufVxuXG5mdW5jdGlvbiBwcm9taXNpZnkoZnVuYzogSW5pdGlhbGl6ZXJGdW5jKTogKHA6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiBQcm9taXNlPHVua25vd24+IHtcbiAgcmV0dXJuIChwOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICAoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmdW5jKHApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9PYnNlcnZhYmxlTWFwKFxuICBsYXp5U3RhdGVzOiBMYXp5U3RhdGVbXSxcbiAgYXBpU3RhdGVTcGVjOiBBUElTdGF0ZXNTcGVjLFxuICBhcGlTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIsXG4pOiBSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+PiB7XG4gIHJldHVybiBsYXp5U3RhdGVzXG4gICAgLm1hcDxbc3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+XT4oKHsgc3RhdGVJRCwgZnVuYywgZGVwZW5kZW5jaWVzIH0pID0+IHtcbiAgICAgIGNvbnN0IGRlcHMkID0gdG9EZXBzJChkZXBlbmRlbmNpZXMgfHwge30sIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICAgICAgY29uc3Qgc3RhdGUkID0gZGVwcyQucGlwZShcbiAgICAgICAgc3dpdGNoTWFwKChkZXBzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGZyb20ocHJvbWlzaWZ5KGZ1bmMpKGRlcHMpKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gW3N0YXRlSUQsIHN0YXRlJF07XG4gICAgfSlcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW3N0YXRlSURdID0gc3RhdGUkO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBmaWx0ZXJMYXp5U3RhdGVzIHJldHVybiBhIGxpc3Qgb2Ygc3RhdGUgd2hpY2ggcmVxdWlyZWQgbGF6eSBpbml0aWFsaXphdGlvblxuICogQHBhcmFtIHNoYXJlZFN0YXRlU3BlYyAtIFNoYXJlZFN0YXRlc1NwZWNcbiAqL1xuZnVuY3Rpb24gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWM6IFNoYXJlZFN0YXRlc1NwZWMpOiBBcnJheTxMYXp5U3RhdGU+IHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHNoYXJlZFN0YXRlU3BlYylcbiAgICAubWFwKChbc3RhdGVJRCwgeyBpbml0aWFsaXplciB9XSkgPT4ge1xuICAgICAgaWYgKGluaXRpYWxpemVyKSB7XG4gICAgICAgIHJldHVybiB7IC4uLmluaXRpYWxpemVyLCBzdGF0ZUlEIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9KVxuICAgIC5maWx0ZXIoKGxhenlTdGF0ZSk6IGxhenlTdGF0ZSBpcyBMYXp5U3RhdGUgPT4gISFsYXp5U3RhdGUpO1xufVxuXG4vKipcbiAqIGluaXRpYWxpemVMYXp5U3RhdGVzIHdpbGwgd2FpdCBmb3IgYWxsIHRoZSBkZXBlbmRlbmNpZXMgdG8gYmUgcmVzb2x2ZWQsXG4gKiB0aGVuIGNhbGwgdGhlIGluaXRpYWxpemUgZnVuY3Rpb24sIHRoZW4gcmV0dXJuIHRoZSBmaW5pYWwgc2hhcmVkIHN0YXRlcy5cbiAqIEBwYXJhbSBzaGFyZWRTdGF0ZVNwZWMgLSB0aGUgb3JpZ2luYWwgc2hhcmVkU3RhdGVTcGVjXG4gKiBAcGFyYW0gYXBpU3RhdGVTcGVjIC0gQVBJU3RhdGVzU3BlYyBpbiBzY2hlbWFcbiAqIEBwYXJhbSBhcGlTcGVjQWRhcHRlciAtIEFQSVNwZWNBZGFwdGVyIHBsdWdpblxuICogQHJldHVybnMgaW5pdGlhbGl6ZWQgc2hhcmVkIHN0YXRlc1xuICovXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplTGF6eVN0YXRlcyhcbiAgc2hhcmVkU3RhdGVTcGVjOiBTaGFyZWRTdGF0ZXNTcGVjLFxuICBhcGlTdGF0ZVNwZWM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyPzogQVBJU3BlY0FkYXB0ZXIsXG4pOiBQcm9taXNlPFNoYXJlZFN0YXRlc1NwZWM+IHtcbiAgaWYgKCFhcGlTcGVjQWRhcHRlcikge1xuICAgIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG4gIH1cblxuICBjb25zdCBsYXp5U3RhdGVzID0gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWMpO1xuICAvLyB0dXJuIGxhenkgc3RhdGVzIHRvIG9ic2VydmFibGVzXG4gIGNvbnN0IG9ic1N0YXRlTWFwID0gdG9PYnNlcnZhYmxlTWFwKGxhenlTdGF0ZXMsIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICBpZiAoIU9iamVjdC5rZXlzKG9ic1N0YXRlTWFwKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc2hhcmVkU3RhdGVTcGVjO1xuICB9XG5cbiAgLy8gd2FpdCBmb3IgYWxsIHRoZSBvYnNlcnZhYmxlcyBlbWl0IHZhbHVlXG4gIGNvbnN0IGxhenlTdGF0ZXNNYXAgPSBhd2FpdCBmaXJzdFZhbHVlRnJvbShjb21iaW5lTGF0ZXN0KG9ic1N0YXRlTWFwKSk7XG5cbiAgLy8gbWVyZ2Ugd2l0aCBvcmlnaW5hbCBzdGF0ZXNcbiAgT2JqZWN0LmVudHJpZXMobGF6eVN0YXRlc01hcCkuZm9yRWFjaCgoW3N0YXRlSUQsIHZhbHVlXSkgPT4ge1xuICAgIHNoYXJlZFN0YXRlU3BlY1tzdGF0ZUlEXS5pbml0aWFsID0gdmFsdWU7XG4gIH0pO1xuXG4gIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpemVMYXp5U3RhdGVzO1xuIiwiaW1wb3J0IFNjaGVtYVNwZWMgZnJvbSAncGFja2FnZXMvc2NoZW1hLXNwZWMvc3JjJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcGFyc2VJbmhlcml0UHJvcGVydHkoXG4gIG5vZGU6IFNjaGVtYVNwZWMuU2NoZW1hTm9kZSxcbiAgY2FjaGVJRHM6IFNldDxzdHJpbmc+LFxuKTogU2V0PHN0cmluZz4ge1xuICBjb25zdCBwcm9wcyA9IG5vZGUucHJvcHMgfHwge307XG5cbiAgT2JqZWN0LnZhbHVlcyhwcm9wcykuZm9yRWFjaCgocHJvcGVydHkpID0+IHtcbiAgICBpZiAocHJvcGVydHkudHlwZSAhPT0gJ2luaGVyaXRlZF9wcm9wZXJ0eScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZighcHJvcGVydHkucGFyZW50SUQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjYWNoZUlEcy5hZGQocHJvcGVydHkucGFyZW50SUQpO1xuICB9KTtcblxuICBpZiAoJ2NoaWxkcmVuJyBpbiBub2RlKSB7XG4gICAgbm9kZS5jaGlsZHJlbj8uZm9yRWFjaCgoc3ViTm9kZSkgPT4gcGFyc2VJbmhlcml0UHJvcGVydHkoc3ViTm9kZSwgY2FjaGVJRHMpKTtcbiAgfVxuXG4gIGlmICgnbm9kZScgaW4gbm9kZSkge1xuICAgIHBhcnNlSW5oZXJpdFByb3BlcnR5KG5vZGUubm9kZSBhcyBTY2hlbWFTcGVjLlNjaGVtYU5vZGUsIGNhY2hlSURzKTtcbiAgfVxuXG4gIHJldHVybiBjYWNoZUlEcztcbn1cbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBOb2RlUHJvcHNDYWNoZSwgU2NoZW1hTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZnVuY3Rpb24gZ2V0Tm9kZUlEQnlQYXRoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IG5vZGVQYXRoID0gcGF0aC5yZXBsYWNlKC9cXC8oLispXFwvWzAtOV0rL2csICcvJDEnKTtcbiAgcmV0dXJuIG5vZGVQYXRoLnNwbGl0KCcvJykucG9wKCk7XG59XG5cbmNvbnN0IE5PREVfU0hPVUxEX05PVF9DQUNIRTogU2NoZW1hTm9kZVsnaWQnXVtdID0gWydkdW1teUxvb3BDb250YWluZXInLCAncGxhY2Vob2xkZXItbm9kZSddO1xuY2xhc3MgU3RvcmUgaW1wbGVtZW50cyBOb2RlUHJvcHNDYWNoZSB7XG4gIHByaXZhdGUgY2FjaGU6IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4+O1xuICBwcml2YXRlIGNhY2hlSURzOiBTZXQ8c3RyaW5nPjtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoY2FjaGVJRHM6IFNldDxzdHJpbmc+KSB7XG4gICAgdGhpcy5jYWNoZSA9IHt9O1xuICAgIHRoaXMuY2FjaGVJRHMgPSBjYWNoZUlEcztcbiAgfVxuXG4gIHB1YmxpYyBzaG91bGRDYWNoZShub2RlSUQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNhY2hlSURzLmhhcyhub2RlSUQpO1xuICB9XG5cbiAgcHVibGljIGluaXRTdGF0ZShwYXRoOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2FjaGVbcGF0aF0pIHtcbiAgICAgIHRoaXMuY2FjaGVbcGF0aF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHt9IGFzIFJlY29yZDxzdHJpbmcsIHVua25vd24+KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZ2V0UHJvcHMkKHBhcmVudElEOiBzdHJpbmcpOiBCZWhhdmlvclN1YmplY3Q8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHwgdW5kZWZpbmVkIHtcbiAgICB0aGlzLmluaXRTdGF0ZShwYXJlbnRJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5jYWNoZVtwYXJlbnRJRF07XG4gIH1cblxuICBwdWJsaWMgc2V0UHJvcHMocGF0aDogc3RyaW5nLCBub2RlSUQ6IFNjaGVtYU5vZGVbJ2lkJ10gLHByb3BzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik6IHZvaWQge1xuICAgIGNvbnN0IG5vZGVQYXRoSUQgPSBnZXROb2RlSURCeVBhdGgocGF0aCk7XG4gICAgLy8gdG8gYXZvaWQgcmVzZXQgcHJvcHMgd2hpbGUgbm9kZSBpcyBkdW1teUxvb3BDb250YWluZXIgb3IgcGxhY2Vob2xkZXItbm9kZVxuICAgIC8vIG9yIHNvbWUgbWVhbmluZ2xlc3Mgbm9kZSBidXQgdXNlIHVzZUluc3RhbnRpYXRlUHJvcHMgdG8gcGFyc2Ugc3BlY2lmaWMgcHJvcHNcbiAgICAvLyBsaWtlIGl0ZXJhYmxlU3RhdGUsIHNob3VsZFJlbmRlclxuICAgIGlmKCFub2RlUGF0aElEIHx8IE5PREVfU0hPVUxEX05PVF9DQUNIRS5pbmNsdWRlcyhub2RlSUQpIHx8IXRoaXMuc2hvdWxkQ2FjaGUobm9kZVBhdGhJRCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuY2FjaGVbbm9kZVBhdGhJRF0pIHtcbiAgICAgIHRoaXMuY2FjaGVbbm9kZVBhdGhJRF0gPSBuZXcgQmVoYXZpb3JTdWJqZWN0KHByb3BzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNhY2hlW25vZGVQYXRoSURdLm5leHQocHJvcHMpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN0b3JlO1xuIiwiaW1wb3J0IHsgY3JlYXRlQnJvd3Nlckhpc3RvcnkgfSBmcm9tICdoaXN0b3J5JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IFNjaGVtYVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IGdldEFQSVN0YXRlcyBmcm9tICcuL2FwaS1zdGF0ZXMnO1xuaW1wb3J0IGRlc2VyaWFsaXplIGZyb20gJy4vZGVzZXJpYWxpemUnO1xuaW1wb3J0IFN0YXRlc0h1YkFQSSBmcm9tICcuL3N0YXRlcy1odWItYXBpJztcbmltcG9ydCBnZXRTaGFyZWRTdGF0ZXMgZnJvbSAnLi9zaGFyZWQtc3RhdGVzJztcbmltcG9ydCBTdGF0ZXNIdWJTaGFyZWQgZnJvbSAnLi9zdGF0ZXMtaHViLXNoYXJlZCc7XG5pbXBvcnQgaW5pdGlhbGl6ZUxhenlTdGF0ZXMgZnJvbSAnLi9pbml0aWFsaXplLWxhenktc2hhcmVkLXN0YXRlcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUGx1Z2lucywgU2NoZW1hTm9kZSwgU2hhcmVkU3RhdGVzU3BlYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBwYXJzZUluaGVyaXRQcm9wZXJ0eSBmcm9tICcuL2Rlc2VyaWFsaXplL3BhcnNlLWluaGVyaXQtcHJvcGVydHknO1xuaW1wb3J0IE5vZGVQcm9wc0NhY2hlIGZyb20gJy4vbm9kZS1wcm9wcy1jYWNoZSc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm9vdFVwUGFyYW1zIHtcbiAgc2NoZW1hOiBTY2hlbWFTcGVjLlNjaGVtYTtcbiAgcGFyZW50Q1RYPzogQ1RYO1xuICBwbHVnaW5zPzogUGx1Z2lucztcbn1cblxuZXhwb3J0IGludGVyZmFjZSBCb290UmVzdWx0IHtcbiAgY3R4OiBDVFg7XG4gIHJvb3ROb2RlOiBTY2hlbWFOb2RlO1xufVxuXG5hc3luYyBmdW5jdGlvbiBib290VXAoeyBzY2hlbWEsIHBhcmVudENUWCwgcGx1Z2lucyB9OiBCb290VXBQYXJhbXMpOiBQcm9taXNlPEJvb3RSZXN1bHQ+IHtcbiAgY29uc3QgeyBhcGlTdGF0ZVNwZWMsIHNoYXJlZFN0YXRlc1NwZWMgfSA9IHNjaGVtYTtcbiAgY29uc3QgX3BsdWdpbnMgPSBPYmplY3QuYXNzaWduKHt9LCBwYXJlbnRDVFg/LnBsdWdpbnMgfHwge30sIHBsdWdpbnMgfHwge30pO1xuXG4gIGNvbnN0IHN0YXRlc0h1YkFQSSA9IG5ldyBTdGF0ZXNIdWJBUEkoe1xuICAgIC8vIFRPRE86IHRocm93IGVycm9yIGluc3RlYWQgb2YgdG9sZXJhdGluZyBpdFxuICAgIGFwaVNwZWNBZGFwdGVyOiBfcGx1Z2lucy5hcGlTcGVjQWRhcHRlcixcbiAgICBhcGlTdGF0ZVNwZWM6IGFwaVN0YXRlU3BlYyB8fCB7fSxcbiAgICBwYXJlbnRIdWI6IHBhcmVudENUWD8uc3RhdGVzSHViQVBJLFxuICB9KTtcblxuICBjb25zdCBpbnN0YW50aWF0ZVNwZWMgPSBkZXNlcmlhbGl6ZShzaGFyZWRTdGF0ZXNTcGVjIHx8IHt9LCB1bmRlZmluZWQpIGFzIFNoYXJlZFN0YXRlc1NwZWMgfCBudWxsO1xuICBjb25zdCBpbml0aWFsaXplZFN0YXRlID0gYXdhaXQgaW5pdGlhbGl6ZUxhenlTdGF0ZXMoXG4gICAgaW5zdGFudGlhdGVTcGVjIHx8IHt9LFxuICAgIGFwaVN0YXRlU3BlYyB8fCB7fSxcbiAgICBfcGx1Z2lucy5hcGlTcGVjQWRhcHRlcixcbiAgKTtcbiAgY29uc3Qgc3RhdGVzSHViU2hhcmVkID0gbmV3IFN0YXRlc0h1YlNoYXJlZChpbml0aWFsaXplZFN0YXRlLCBwYXJlbnRDVFg/LnN0YXRlc0h1YlNoYXJlZCk7XG5cbiAgY29uc3QgaGlzdG9yeSA9IHBhcmVudENUWD8uaGlzdG9yeSB8fCBjcmVhdGVCcm93c2VySGlzdG9yeSgpO1xuICBjb25zdCBsb2NhdGlvbiQgPSBwYXJlbnRDVFg/LmxvY2F0aW9uJCB8fCBuZXcgQmVoYXZpb3JTdWJqZWN0KGhpc3RvcnkubG9jYXRpb24pO1xuXG4gIGlmICghcGFyZW50Q1RYPy5sb2NhdGlvbiQpIHtcbiAgICBoaXN0b3J5Lmxpc3RlbigoeyBsb2NhdGlvbiB9KSA9PiB7XG4gICAgICBsb2NhdGlvbiQubmV4dChsb2NhdGlvbik7XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBjYWNoZUlEcyA9IHBhcnNlSW5oZXJpdFByb3BlcnR5KHNjaGVtYS5ub2RlLCBuZXcgU2V0KCkpO1xuICBjb25zdCBub2RlUHJvcHNDYWNoZSA9IG5ldyBOb2RlUHJvcHNDYWNoZShjYWNoZUlEcyk7XG5cbiAgY29uc3QgY3R4OiBDVFggPSB7XG4gICAgc3RhdGVzSHViQVBJOiBzdGF0ZXNIdWJBUEksXG4gICAgc3RhdGVzSHViU2hhcmVkOiBzdGF0ZXNIdWJTaGFyZWQsXG5cbiAgICBhcGlTdGF0ZXM6IGdldEFQSVN0YXRlcyhzdGF0ZXNIdWJBUEkpLFxuICAgIHN0YXRlczogZ2V0U2hhcmVkU3RhdGVzKHN0YXRlc0h1YlNoYXJlZCksXG4gICAgaGlzdG9yeSxcbiAgICBsb2NhdGlvbiQsXG4gICAgbm9kZVByb3BzQ2FjaGUsXG5cbiAgICBwbHVnaW5zOiBfcGx1Z2lucyxcbiAgfTtcblxuICBjb25zdCByb290Tm9kZSA9IGRlc2VyaWFsaXplKHNjaGVtYS5ub2RlLCB7XG4gICAgYXBpU3RhdGVzOiBjdHguYXBpU3RhdGVzLFxuICAgIHN0YXRlczogY3R4LnN0YXRlcyxcbiAgICBoaXN0b3J5OiBjdHguaGlzdG9yeSxcbiAgfSkgYXMgU2NoZW1hTm9kZTtcbiAgaWYgKCFyb290Tm9kZSkge1xuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgRXJyb3IoJ2ZhaWxlZCB0byBpbml0IGN0eCEnKSk7XG4gIH1cblxuICByZXR1cm4geyBjdHgsIHJvb3ROb2RlIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGJvb3RVcDtcbiIsImltcG9ydCB0eXBlIHsgQ29uc3RhbnRQcm9wZXJ0eSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9zY2hlbWEtc3BlYyc7XG5cbmltcG9ydCB7IFNjaGVtYU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNvbnN0YW50UHJvcHMobm9kZTogU2NoZW1hTm9kZSk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgaWYgKCFub2RlLnByb3BzKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMpXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQ29uc3RhbnRQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2NvbnN0YW50X3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5yZWR1Y2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KChhY2MsIFtrZXksIHsgdmFsdWUgfV0pID0+IHtcbiAgICAgIGFjY1trZXldID0gdmFsdWU7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdFdpdGgsIG1hcCwgb2YsIHNraXAsIHRhcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgQ29tcHV0ZWREZXBlbmRlbmN5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcblxuaW1wb3J0IHsgQ1RYLCBTdGF0ZUNvbnZlcnRvciB9IGZyb20gJy4uL3R5cGVzJztcblxuaW50ZXJmYWNlIENvbnZlcnRSZXN1bHRQYXJhbXMge1xuICBzdGF0ZTogdW5rbm93bjtcbiAgY29udmVydG9yPzogU3RhdGVDb252ZXJ0b3I7XG4gIGZhbGxiYWNrOiB1bmtub3duO1xuICBwcm9wTmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29udmVydFN0YXRlKHsgc3RhdGUsIGNvbnZlcnRvciwgZmFsbGJhY2ssIHByb3BOYW1lIH06IENvbnZlcnRSZXN1bHRQYXJhbXMpOiB1bmtub3duIHtcbiAgaWYgKGNvbnZlcnRvciAmJiBzdGF0ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiBjb252ZXJ0b3Ioc3RhdGUpID8/IGZhbGxiYWNrO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgIGBhbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIHN0YXRlIGNvbnZlcnRvciBmb3IgcHJvcDogXCIke3Byb3BOYW1lfVwiYCxcbiAgICAgICAgJ3dpdGggdGhlIGZvbGxvd2luZyBzdGF0ZSBhbmQgY29udmVydG9yOicsXG4gICAgICAgICdcXG4nLFxuICAgICAgICBzdGF0ZSxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIGNvbnZlcnRvci50b1N0cmluZygpLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgJ1NvIHJldHVybiBmYWxsYmFjayBpbnN0ZWFkLCBmYWxsYmFjazonLFxuICAgICAgICBmYWxsYmFjayxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgICdcXG4nLFxuICAgICAgICBlcnJvcixcbiAgICAgICk7XG4gICAgICByZXR1cm4gZmFsbGJhY2s7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHN0YXRlID8/IGZhbGxiYWNrO1xufVxuXG5pbnRlcmZhY2UgR2V0Q29tcHV0ZWRTdGF0ZSRQcm9wcyB7XG4gIHByb3BOYW1lOiBzdHJpbmc7XG4gIGRlcHM6IENvbXB1dGVkRGVwZW5kZW5jeVtdO1xuICBjb252ZXJ0b3I6IFN0YXRlQ29udmVydG9yO1xuICBjdHg6IENUWDtcbiAgZmFsbGJhY2s6IHVua25vd247XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21wdXRlZFN0YXRlJCh7XG4gIHByb3BOYW1lLFxuICBkZXBzLFxuICBjb252ZXJ0b3IsXG4gIGN0eCxcbiAgZmFsbGJhY2ssXG59OiBHZXRDb21wdXRlZFN0YXRlJFByb3BzKTogQmVoYXZpb3JTdWJqZWN0PHVua25vd24+IHtcbiAgbGV0IF9mYWxsYmFjayA9IGZhbGxiYWNrO1xuICBjb25zdCBkZXBzJCA9IGRlcHMubWFwPEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj4oKHsgdHlwZSwgZGVwSUQgfSkgPT4ge1xuICAgIGlmICh0eXBlID09PSAnYXBpX3N0YXRlJykge1xuICAgICAgcmV0dXJuIGN0eC5zdGF0ZXNIdWJBUEkuZ2V0U3RhdGUkKGRlcElEKSBhcyBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj47XG4gICAgfVxuXG4gICAgaWYgKHR5cGUgPT09ICdub2RlX3N0YXRlJykge1xuICAgICAgcmV0dXJuIGN0eC5zdGF0ZXNIdWJTaGFyZWQuZ2V0Tm9kZVN0YXRlJChkZXBJRCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGN0eC5zdGF0ZXNIdWJTaGFyZWQuZ2V0U3RhdGUkKGRlcElEKTtcbiAgfSk7XG4gIGNvbnN0IGluaXRpYWxEZXBzID0gZGVwcyQubWFwKChkZXAkKSA9PiBkZXAkLnZhbHVlKTtcbiAgY29uc3Qgc3RhdGUkID0gbmV3IEJlaGF2aW9yU3ViamVjdChcbiAgICBjb252ZXJ0U3RhdGUoe1xuICAgICAgc3RhdGU6IGluaXRpYWxEZXBzLFxuICAgICAgY29udmVydG9yOiBjb252ZXJ0b3IsXG4gICAgICBmYWxsYmFjazogZmFsbGJhY2ssXG4gICAgICBwcm9wTmFtZSxcbiAgICB9KSxcbiAgKTtcblxuICBvZih0cnVlKVxuICAgIC5waXBlKFxuICAgICAgY29tYmluZUxhdGVzdFdpdGgoZGVwcyQpLFxuICAgICAgbWFwKChfLCAuLi5fZGVwKSA9PiB7XG4gICAgICAgIHJldHVybiBjb252ZXJ0U3RhdGUoe1xuICAgICAgICAgIHN0YXRlOiBfZGVwLFxuICAgICAgICAgIGNvbnZlcnRvcjogY29udmVydG9yLFxuICAgICAgICAgIGZhbGxiYWNrOiBfZmFsbGJhY2ssXG4gICAgICAgICAgcHJvcE5hbWUsXG4gICAgICAgIH0pO1xuICAgICAgfSksXG4gICAgICBza2lwKDEpLFxuICAgICAgdGFwKChzdGF0ZSkgPT4ge1xuICAgICAgICBfZmFsbGJhY2sgPSBzdGF0ZTtcbiAgICAgIH0pLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4gc3RhdGUkLm5leHQoc3RhdGUpKTtcblxuICByZXR1cm4gc3RhdGUkO1xufVxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCwgbWFwLCBPYnNlcnZhYmxlLCBza2lwLCB0YXAgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQVBJUmVzdWx0UHJvcGVydHksIEFQSVN0YXRlLCBDVFgsIFNjaGVtYU5vZGUsIFN0YXRlQ29udmVydG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgY29udmVydFN0YXRlIH0gZnJvbSAnLi91dGlscyc7XG5cbmZ1bmN0aW9uIHVzZUFQSVJlc3VsdFByb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBhZGFwdGVyczogUmVjb3JkPHN0cmluZywgU3RhdGVDb252ZXJ0b3IgfCB1bmRlZmluZWQ+ID0ge307XG4gIGNvbnN0IHN0YXRlcyQ6IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDxBUElTdGF0ZT4+ID0ge307XG4gIGNvbnN0IGluaXRpYWxGYWxsYmFja3M6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG5cbiAgT2JqZWN0LmVudHJpZXMobm9kZS5wcm9wcyB8fCB7fSlcbiAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbc3RyaW5nLCBBUElSZXN1bHRQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2FwaV9yZXN1bHRfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtwcm9wTmFtZSwgeyBmYWxsYmFjaywgY29udmVydG9yOiBhZGFwdGVyLCBzdGF0ZUlEIH1dKSA9PiB7XG4gICAgICBpbml0aWFsRmFsbGJhY2tzW3Byb3BOYW1lXSA9IGZhbGxiYWNrO1xuICAgICAgYWRhcHRlcnNbcHJvcE5hbWVdID0gYWRhcHRlcjtcbiAgICAgIHN0YXRlcyRbcHJvcE5hbWVdID0gY3R4LnN0YXRlc0h1YkFQSS5nZXRTdGF0ZSQoc3RhdGVJRCk7XG4gICAgfSk7XG5cbiAgY29uc3QgZmFsbGJhY2tzUmVmID0gdXNlUmVmPFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihpbml0aWFsRmFsbGJhY2tzKTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSBjb252ZXJ0U3RhdGUoe1xuICAgICAgICBzdGF0ZTogc3RhdGUkLmdldFZhbHVlKCkucmVzdWx0LFxuICAgICAgICBjb252ZXJ0b3I6IGFkYXB0ZXJzW2tleV0sXG4gICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMkID0gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSBzdGF0ZSQucGlwZShcbiAgICAgICAgICBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCgncmVzdWx0JyksXG4gICAgICAgICAgbWFwKCh7IHJlc3VsdCB9KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29udmVydFN0YXRlKHtcbiAgICAgICAgICAgICAgc3RhdGU6IHJlc3VsdCxcbiAgICAgICAgICAgICAgY29udmVydG9yOiBhZGFwdGVyc1trZXldLFxuICAgICAgICAgICAgICBmYWxsYmFjazogZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSxcbiAgICAgICAgICAgICAgcHJvcE5hbWU6IGtleSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRhcCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldID0gcmVzdWx0O1xuICAgICAgICAgIH0pLFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGNvbWJpbmVMYXRlc3QocmVzdWx0cyQpLnBpcGUoc2tpcCgxKSkuc3Vic2NyaWJlKHNldFN0YXRlKTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQVBJUmVzdWx0UHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCwgbWFwLCBPYnNlcnZhYmxlLCBza2lwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgdHlwZSB7IEFQSUxvYWRpbmdQcm9wZXJ0eSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9zY2hlbWEtc3BlYyc7XG5cbmltcG9ydCB7IEFQSVN0YXRlLCBDVFgsIFNjaGVtYU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIHVzZUFQSUxvYWRpbmdQcm9wcyhub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgc3RhdGVzJDogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIEFQSUxvYWRpbmdQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2FwaV9sb2FkaW5nX3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5mb3JFYWNoKChbcHJvcE5hbWUsIHsgc3RhdGVJRCB9XSkgPT4ge1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBjdHguc3RhdGVzSHViQVBJLmdldFN0YXRlJChzdGF0ZUlEKTtcbiAgICB9KTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSBzdGF0ZSQuZ2V0VmFsdWUoKS5sb2FkaW5nO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZXN1bHRzJCA9IE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+Pj4oXG4gICAgICAoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gc3RhdGUkLnBpcGUoXG4gICAgICAgICAgc2tpcCgxKSxcbiAgICAgICAgICBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCgnbG9hZGluZycpLFxuICAgICAgICAgIG1hcCgoeyBsb2FkaW5nIH0pID0+IGxvYWRpbmcpLFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGNvbWJpbmVMYXRlc3QocmVzdWx0cyQpLnN1YnNjcmliZShzZXRTdGF0ZSk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUFQSUxvYWRpbmdQcm9wcztcbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB7IEFQSUludm9rZVByb3BlcnR5LCBDVFgsIFNjaGVtYU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgQVBJQ2FsbFByb3BzID0gUmVjb3JkPHN0cmluZywgKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZD47XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUFQSUludm9rZVByb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogQVBJQ2FsbFByb3BzIHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbm9kZS5wcm9wcykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhub2RlLnByb3BzKVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQVBJSW52b2tlUHJvcGVydHldID0+IHtcbiAgICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2FwaV9pbnZva2VfcHJvcGVydHknO1xuICAgICAgfSlcbiAgICAgIC5yZWR1Y2U8QVBJQ2FsbFByb3BzPigoYWNjLCBbcHJvcE5hbWUsIHsgc3RhdGVJRCwgcGFyYW1zQnVpbGRlciwgY2FsbGJhY2sgfV0pID0+IHtcbiAgICAgICAgbG9nZ2VyLndhcm4oJ2hvb2sgdXNlQVBJSW52b2tlUHJvcHMgaGFzIGJlZW4gZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBob29rIHVzZUZ1bmNQcm9wcyBpbnN0ZWFkJyk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlQWN0aW9uKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBmZXRjaFBhcmFtczogRmV0Y2hQYXJhbXMgPSBwYXJhbXNCdWlsZGVyPy4oLi4uYXJncykgfHwge307XG4gICAgICAgICAgICBjdHguYXBpU3RhdGVzW3N0YXRlSURdLmZldGNoKGZldGNoUGFyYW1zLCBjYWxsYmFjayk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci5sb2coJ2ZhaWxlZCB0byBydW4gY29udmVydG9yIG9yIHJ1biBhY3Rpb246JywgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFjY1twcm9wTmFtZV0gPSBoYW5kbGVBY3Rpb247XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG4gIH0sIFtdKTtcbn1cbiIsImltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgT2JzZXJ2YWJsZSwgc2tpcCwgdGFwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENUWCwgU2hhcmVkU3RhdGVQcm9wZXJ0eSwgTm9kZVN0YXRlUHJvcGVydHksIFNjaGVtYU5vZGUsIFN0YXRlQ29udmVydG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgY29udmVydFN0YXRlIH0gZnJvbSAnLi91dGlscyc7XG5cbnR5cGUgUGFpciA9IFtzdHJpbmcsIFNoYXJlZFN0YXRlUHJvcGVydHkgfCBOb2RlU3RhdGVQcm9wZXJ0eV07XG5cbmZ1bmN0aW9uIHVzZVNoYXJlZFN0YXRlUHJvcHMobm9kZTogU2NoZW1hTm9kZSwgY3R4OiBDVFgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IGNvbnZlcnRvcnM6IFJlY29yZDxzdHJpbmcsIFN0YXRlQ29udmVydG9yIHwgdW5kZWZpbmVkPiA9IHt9O1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4+ID0ge307XG4gIGNvbnN0IGluaXRpYWxGYWxsYmFja3M6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG5cbiAgT2JqZWN0LmVudHJpZXMobm9kZS5wcm9wcyB8fCB7fSlcbiAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBQYWlyID0+IHtcbiAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdzaGFyZWRfc3RhdGVfcHJvcGVydHknIHx8IHBhaXJbMV0udHlwZSA9PT0gJ25vZGVfc3RhdGVfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtrZXksIHByb3BTcGVjXSkgPT4ge1xuICAgICAgaWYgKHByb3BTcGVjLnR5cGUgPT09ICdzaGFyZWRfc3RhdGVfcHJvcGVydHknKSB7XG4gICAgICAgIHN0YXRlcyRba2V5XSA9IGN0eC5zdGF0ZXNIdWJTaGFyZWQuZ2V0U3RhdGUkKHByb3BTcGVjLnN0YXRlSUQpO1xuICAgICAgICBjb252ZXJ0b3JzW2tleV0gPSBwcm9wU3BlYy5jb252ZXJ0b3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZXMkW2tleV0gPSBjdHguc3RhdGVzSHViU2hhcmVkLmdldE5vZGVTdGF0ZSQocHJvcFNwZWMubm9kZVBhdGgpO1xuICAgICAgICBjb252ZXJ0b3JzW2tleV0gPSBwcm9wU3BlYy5jb252ZXJ0b3I7XG4gICAgICB9XG5cbiAgICAgIGluaXRpYWxGYWxsYmFja3Nba2V5XSA9IHByb3BTcGVjLmZhbGxiYWNrO1xuICAgIH0pO1xuXG4gIGNvbnN0IGZhbGxiYWNrc1JlZiA9IHVzZVJlZjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oaW5pdGlhbEZhbGxiYWNrcyk7XG5cbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSgoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSBjb252ZXJ0U3RhdGUoe1xuICAgICAgICBzdGF0ZTogc3RhdGUkLmdldFZhbHVlKCksXG4gICAgICAgIGNvbnZlcnRvcjogY29udmVydG9yc1trZXldLFxuICAgICAgICBmYWxsYmFjazogZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSxcbiAgICAgICAgcHJvcE5hbWU6IGtleSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHN0YXRlcyQpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHMkID0gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSBzdGF0ZSQucGlwZShcbiAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgICAgIG1hcCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29udmVydFN0YXRlKHtcbiAgICAgICAgICAgICAgc3RhdGU6IHJlc3VsdCxcbiAgICAgICAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3JzW2tleV0sXG4gICAgICAgICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0gPSByZXN1bHQ7XG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gY29tYmluZUxhdGVzdChyZXN1bHRzJCkucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoc2V0U3RhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VTaGFyZWRTdGF0ZVByb3BzO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IFNjaGVtYU5vZGUsIEZ1bmN0aW9uYWxQcm9wZXJ0eSwgVmVyc2F0aWxlRnVuYyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRnVuY1Byb3BzKG5vZGU6IFNjaGVtYU5vZGUpOiBSZWNvcmQ8c3RyaW5nLCBWZXJzYXRpbGVGdW5jPiB7XG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIW5vZGUucHJvcHMpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMobm9kZS5wcm9wcylcbiAgICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIEZ1bmN0aW9uYWxQcm9wZXJ0eV0gPT4ge1xuICAgICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnZnVuY3Rpb25hbF9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBWZXJzYXRpbGVGdW5jPj4oKGFjYywgW2tleSwgeyBmdW5jIH1dKSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gKC4uLmFyZ3M6IHVua25vd25bXSkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmdW5jKC4uLmFyZ3MpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgIGBhbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBydW4gbm9kZSAnJHtub2RlLmlkfScgZnVuY3Rpb25hbCBwcm9wZXJ0eTpgLFxuICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICd3aXRoIHRoZSBmb2xsb3dpbmcgYXJndW1lbnRzOicsXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICBhcmdzLFxuICAgICAgICAgICAgICAnXFxuJyxcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGlzOicsXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICBmdW5jLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG4gIH0sIFtdKTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB7IENUWCwgU2hhcmVkU3RhdGVNdXRhdGlvblByb3BlcnR5LCBTY2hlbWFOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG50eXBlIE11dGF0ZVByb3BzID0gUmVjb3JkPHN0cmluZywgKHZhbHVlOiB1bmtub3duKSA9PiB2b2lkPjtcbnR5cGUgUGFpciA9IFtzdHJpbmcsIFNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wZXJ0eV07XG5cbmZ1bmN0aW9uIHVzZVNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcyhub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IE11dGF0ZVByb3BzIHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbm9kZS5wcm9wcykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhub2RlLnByb3BzKVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgUGFpciA9PiB7XG4gICAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdzaGFyZWRfc3RhdGVfbXV0YXRpb25fcHJvcGVydHknO1xuICAgICAgfSlcbiAgICAgIC5yZWR1Y2U8TXV0YXRlUHJvcHM+KChhY2MsIFtrZXksIHsgc3RhdGVJRCwgY29udmVydG9yIH1dKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIG11dGF0aW9uKHN0YXRlOiB1bmtub3duKTogdm9pZCB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb252ZXJ0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGN0eC5zdGF0ZXNIdWJTaGFyZWQubXV0YXRlU3RhdGUoc3RhdGVJRCwgc3RhdGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gY29udmVydG9yKHN0YXRlKTtcbiAgICAgICAgICAgIGN0eC5zdGF0ZXNIdWJTaGFyZWQubXV0YXRlU3RhdGUoc3RhdGVJRCwgdik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignZmFpbGVkIHRvIHJ1biBjb252ZXJ0b3I6XFxuJywgY29udmVydG9yLnRvU3RyaW5nKCksICdcXG4nLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWNjW2tleV0gPSBtdXRhdGlvbjtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL25vZGUtcmVuZGVyL3BhdGgtY29udGV4dCc7XG5cbmltcG9ydCB7IFNjaGVtYU5vZGUsIENUWCwgVmVyc2F0aWxlRnVuYyB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBJbnRlcm5hbEhvb2tQcm9wcyA9IFJlY29yZDxzdHJpbmcsIFZlcnNhdGlsZUZ1bmMgfCB1bmRlZmluZWQ+O1xuXG4vLyB0b2RvIGdpdmUgdGhpcyBob29rIGEgYmV0dGVyIG5hbWVcbmZ1bmN0aW9uIHVzZUludGVybmFsSG9va1Byb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogSW50ZXJuYWxIb29rUHJvcHMge1xuICBjb25zdCBwYXJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoJ3N1cHBvcnRTdGF0ZUV4cG9zdXJlJyBpbiBub2RlICYmIG5vZGUuc3VwcG9ydFN0YXRlRXhwb3N1cmUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9fZXhwb3NlU3RhdGU6IChzdGF0ZTogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgICAgICAgIGN0eC5zdGF0ZXNIdWJTaGFyZWQuZXhwb3NlTm9kZVN0YXRlKGAke3BhcmVudFBhdGh9LyR7bm9kZS5pZH1gLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbiAgfSwgW10pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VJbnRlcm5hbEhvb2tQcm9wcztcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgQ29uc3RhbnRQcm9wZXJ0eSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9zY2hlbWEtc3BlYyc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4uL25vZGUtcmVuZGVyJztcbmltcG9ydCB7IENUWCwgU2NoZW1hTm9kZSwgUmVuZGVyUHJvcGVydHkgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgUmVuZGVyID0gKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gUmVhY3QuUmVhY3RFbGVtZW50O1xudHlwZSBSZW5kZXJQcm9wcyA9IFJlY29yZDxzdHJpbmcsIFJlbmRlcj47XG5cbmZ1bmN0aW9uIGJ1aWxkUmVuZGVyKFxuICBub2RlOiBTY2hlbWFOb2RlLFxuICBjdHg6IENUWCxcbiAgYWRhcHRlcj86ICguLi5hcmdzOiB1bmtub3duW10pID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVuZGVyIHtcbiAgcmV0dXJuICguLi5hcmdzOiB1bmtub3duW10pOiBSZWFjdC5SZWFjdEVsZW1lbnQgPT4ge1xuICAgIC8vIGNvbnZlcnQgcmVuZGVyIGFyZ3MgdG8gY29uc3RhbnQgcHJvcGVydGllcyBmb3IgcmV1c2Ugb2YgTm9kZVJlbmRlclxuICAgIGxldCBjb25zdGFudFByb3BzID0ge307XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN1c3RvbVByb3BzID0gYWRhcHRlcj8uKC4uLmFyZ3MpIHx8IHt9O1xuICAgICAgaWYgKHR5cGVvZiBjdXN0b21Qcm9wcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3RhbnRQcm9wcyA9IE9iamVjdC5lbnRyaWVzKGN1c3RvbVByb3BzKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgQ29uc3RhbnRQcm9wZXJ0eT4+KFxuICAgICAgICAgIChhY2MsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgYWNjW2tleV0gPSB7IHR5cGU6ICdjb25zdGFudF9wcm9wZXJ0eScsIHZhbHVlIH07XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0b2RvIG9wdGltaXplIHRoaXMgbWVzc2FnZVxuICAgICAgICBsb2dnZXIuZXJyb3IoJ3RvUHJvcHMgcmVzdWx0IGlzIG5vIE9iamVjdCcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyB0b2RvIG9wdGltaXplIHRoaXMgbWVzc2FnZVxuICAgICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gY2FsbCB0b1Byb3BzJywgZXJyb3IpO1xuICAgIH1cblxuICAgIG5vZGUucHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBub2RlLnByb3BzLCBjb25zdGFudFByb3BzKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VSZW5kZXJQcm9wcyh7IHByb3BzIH06IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogUmVuZGVyUHJvcHMge1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHByb3BzIHx8IHt9KVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgUmVuZGVyUHJvcGVydHldID0+IHtcbiAgICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ3JlbmRlcl9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxSZW5kZXJQcm9wcz4oKGFjYywgW3Byb3BOYW1lLCB7IGFkYXB0ZXIsIG5vZGUgfV0pID0+IHtcbiAgICAgICAgYWNjW3Byb3BOYW1lXSA9IGJ1aWxkUmVuZGVyKG5vZGUsIGN0eCwgYWRhcHRlcik7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VSZW5kZXJQcm9wcztcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIHNraXAgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ1RYLCBTY2hlbWFOb2RlLCBDb21wdXRlZFByb3BlcnR5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0Q29tcHV0ZWRTdGF0ZSQgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQ29tcHV0ZWRQcm9wcyhub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgc3RhdGVzJDogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PHVua25vd24+PiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQ29tcHV0ZWRQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2NvbXB1dGVkX3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5mb3JFYWNoKChbcHJvcE5hbWUsIHsgZGVwcywgY29udmVydG9yLCBmYWxsYmFjayB9XSkgPT4ge1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBnZXRDb21wdXRlZFN0YXRlJCh7IHByb3BOYW1lLCBkZXBzLCBjb252ZXJ0b3IsIGN0eCwgZmFsbGJhY2sgfSk7XG4gICAgfSk7XG5cbiAgY29uc3QgW3N0YXRlcywgc2V0U3RhdGVzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSBzdGF0ZSQudmFsdWU7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBjb21iaW5lTGF0ZXN0KHN0YXRlcyQpLnBpcGUoc2tpcCgxKSkuc3Vic2NyaWJlKHNldFN0YXRlcyk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlcztcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgbWFwLCBPYnNlcnZhYmxlLCBvZiwgc2tpcCwgdGFwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENUWCwgSW5oZXJpdGVkUHJvcGVydHksIFNjaGVtYU5vZGUsIFN0YXRlQ29udmVydG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgY29udmVydFN0YXRlIH0gZnJvbSAnLi91dGlscyc7XG5cbmZ1bmN0aW9uIHVzZUluaGVyaXRlZFByb3BzKG5vZGU6IFNjaGVtYU5vZGUsIGN0eDogQ1RYKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuXG4gIGNvbnN0IGNvbnZlcnRvcnM6IFJlY29yZDxzdHJpbmcsIFN0YXRlQ29udmVydG9yIHwgdW5kZWZpbmVkPiA9IHt9O1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHwgdW5kZWZpbmVkPiA9IHt9O1xuICBjb25zdCBpbml0aWFsRmFsbGJhY2tzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgSW5oZXJpdGVkUHJvcGVydHldID0+IHtcbiAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdpbmhlcml0ZWRfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtwcm9wTmFtZSwgeyBmYWxsYmFjaywgY29udmVydG9yLCBwYXJlbnRJRCB9XSkgPT4ge1xuICAgICAgaW5pdGlhbEZhbGxiYWNrc1twcm9wTmFtZV0gPSBmYWxsYmFjaztcbiAgICAgIGNvbnZlcnRvcnNbcHJvcE5hbWVdID0gY29udmVydG9yO1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBjdHgubm9kZVByb3BzQ2FjaGU/LmdldFByb3BzJChwYXJlbnRJRCk7XG4gICAgfSk7XG5cbiAgY29uc3QgZmFsbGJhY2tzUmVmID0gdXNlUmVmPFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihpbml0aWFsRmFsbGJhY2tzKTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgaWYgKCFzdGF0ZSQpIHtcbiAgICAgICAgYWNjW2tleV0gPSBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfVxuXG4gICAgICBhY2Nba2V5XSA9IGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgIHN0YXRlOiBzdGF0ZSQ/LmdldFZhbHVlKCksXG4gICAgICAgIGNvbnZlcnRvcjogY29udmVydG9yc1trZXldLFxuICAgICAgICBmYWxsYmFjazogZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSxcbiAgICAgICAgcHJvcE5hbWU6IGtleSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBpbmhlcml0UHJvcHMkID0gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgICAgaWYgKCFzdGF0ZSQpIHtcbiAgICAgICAgICBhY2Nba2V5XSA9IG9mKGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0pO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH1cblxuICAgICAgICBhY2Nba2V5XSA9IHN0YXRlJC5waXBlKFxuICAgICAgICAgIG1hcCgobm9kZVByb3BzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29udmVydFN0YXRlKHtcbiAgICAgICAgICAgICAgc3RhdGU6IG5vZGVQcm9wcyxcbiAgICAgICAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3JzW2tleV0sXG4gICAgICAgICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFwKChjb252ZXJ0ZWRQcm9wcykgPT4gKGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0gPSBjb252ZXJ0ZWRQcm9wcykpLFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGNvbWJpbmVMYXRlc3QoaW5oZXJpdFByb3BzJCkucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoc2V0U3RhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VJbmhlcml0ZWRQcm9wcztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBDVFgsIFNjaGVtYU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIHVzZUxpbmtQcm9wcyhub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgaWYgKCdpc0xpbmsnIGluIG5vZGUgJiYgbm9kZS5pc0xpbmsgJiYgbm9kZS50eXBlID09PSAnaHRtbC1lbGVtZW50JyAmJiBub2RlLm5hbWUgPT09ICdhJykge1xuICAgIHJldHVybiB7XG4gICAgICBvbkNsaWNrOiAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MQW5jaG9yRWxlbWVudD4pID0+IHtcbiAgICAgICAgLy8gdG9kbyBwcm94eSBvbkNsaWNrIGV2ZW50XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgaHJlZiA9IChlLmN1cnJlbnRUYXJnZXQgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWY7XG4gICAgICAgIGlmICghaHJlZikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdHguaGlzdG9yeS5wdXNoKGhyZWYpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VMaW5rUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VNZW1vLCB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBDVFgsIFNjaGVtYU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdXNlQ29uc3RhbnRQcm9wcyBmcm9tICcuL3VzZS1jb25zdGFudC1wcm9wcyc7XG5pbXBvcnQgdXNlQVBJUmVzdWx0UHJvcHMgZnJvbSAnLi91c2UtYXBpLXJlc3VsdC1wcm9wcyc7XG5pbXBvcnQgdXNlQVBJTG9hZGluZ1Byb3BzIGZyb20gJy4vdXNlLWFwaS1sb2FkaW5nLXByb3BzJztcbmltcG9ydCB1c2VBUElJbnZva2VQcm9wcyBmcm9tICcuL3VzZS1hcGktaW52b2tlLXByb3BzJztcbmltcG9ydCB1c2VTaGFyZWRTdGF0ZVByb3BzIGZyb20gJy4vdXNlLXNoYXJlZC1zdGF0ZS1wcm9wcyc7XG5pbXBvcnQgdXNlRnVuY1Byb3BzIGZyb20gJy4vdXNlLWZ1bmMtcHJvcHMnO1xuaW1wb3J0IHVzZVNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcyBmcm9tICcuL3VzZS1zaGFyZWQtc3RhdGUtbXV0YXRpb24nO1xuaW1wb3J0IHVzZUludGVybmFsSG9va1Byb3BzIGZyb20gJy4vdXNlLWludGVybmFsLWhvb2stcHJvcHMnO1xuaW1wb3J0IHVzZVJlbmRlclByb3BzIGZyb20gJy4vdXNlLXJlbmRlci1wcm9wcyc7XG5pbXBvcnQgdXNlQ29tcHV0ZWRQcm9wcyBmcm9tICcuL3VzZS1jb21wdXRlZC1wcm9wcyc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vbm9kZS1yZW5kZXIvcGF0aC1jb250ZXh0JztcbmltcG9ydCB1c2VJbmhlcml0ZWRQcm9wcyBmcm9tICcuL3VzZS1pbmhlcml0ZWQtcHJvcHMnO1xuaW1wb3J0IHVzZUxpbmtQcm9wcyBmcm9tICcuL3VzZS1saW5rLXByb3BzJztcblxuZnVuY3Rpb24gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlOiBTY2hlbWFOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICBjb25zdCBjb25zdGFudFByb3BzID0gdXNlQ29uc3RhbnRQcm9wcyhub2RlKTtcbiAgY29uc3QgYXBpUmVzdWx0UHJvcHMgPSB1c2VBUElSZXN1bHRQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBhcGlMb2FkaW5nUHJvcHMgPSB1c2VBUElMb2FkaW5nUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3Qgc2hhcmVkU3RhdGVQcm9wcyA9IHVzZVNoYXJlZFN0YXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgaW50ZXJuYWxIb29rUHJvcHMgPSB1c2VJbnRlcm5hbEhvb2tQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBjb21wdXRlZFByb3BzID0gdXNlQ29tcHV0ZWRQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBpbmhlcml0ZWRQcm9wcyA9IHVzZUluaGVyaXRlZFByb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IGZ1bmNQcm9wcyA9IHVzZUZ1bmNQcm9wcyhub2RlKTtcblxuICBjb25zdCBzaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMgPSB1c2VTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgYXBpU3RhdGVJbnZva2VQcm9wcyA9IHVzZUFQSUludm9rZVByb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IHJlbmRlclByb3BzID0gdXNlUmVuZGVyUHJvcHMobm9kZSwgY3R4KTtcblxuICAvLyB0b2RvIHN1cHBvcnQgdXNlciBkZWZpbmVkIG9uQ2xpY2sgZXZlbnRcbiAgY29uc3QgbGlua1Byb3BzID0gdXNlTGlua1Byb3BzKG5vZGUsIGN0eCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGluc3RhbnRpYXRlUHJvcHMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgY29uc3RhbnRQcm9wcyxcbiAgICAgIGFwaVN0YXRlSW52b2tlUHJvcHMsXG4gICAgICBhcGlSZXN1bHRQcm9wcyxcbiAgICAgIGFwaUxvYWRpbmdQcm9wcyxcbiAgICAgIHNoYXJlZFN0YXRlUHJvcHMsXG4gICAgICBjb21wdXRlZFByb3BzLFxuICAgICAgc2hhcmVkU3RhdGVNdXRhdGlvblByb3BzLFxuICAgICAgaW50ZXJuYWxIb29rUHJvcHMsXG4gICAgICByZW5kZXJQcm9wcyxcbiAgICAgIGxpbmtQcm9wcyxcbiAgICAgIGluaGVyaXRlZFByb3BzLFxuICAgICk7XG5cbiAgICBjdHgubm9kZVByb3BzQ2FjaGU/LnNldFByb3BzKGN1cnJlbnRQYXRoLCBub2RlLmlkLCBpbnN0YW50aWF0ZVByb3BzKTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbnRpYXRlUHJvcHMsIGZ1bmNQcm9wcyk7XG4gIH0sIFthcGlSZXN1bHRQcm9wcywgc2hhcmVkU3RhdGVQcm9wcywgYXBpTG9hZGluZ1Byb3BzLCBjb21wdXRlZFByb3BzLCBjb25zdGFudFByb3BzXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUluc3RhbnRpYXRlUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgYm9vdFVwLCB7IEJvb3RSZXN1bHQgfSBmcm9tICcuLi8uLi9ib290LXVwJztcbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uLy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUmVmTG9hZGVyLCBMaWZlY3ljbGVIb29rcywgU2NoZW1hTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBTY2hlbWFTcGVjIGZyb20gJ3BhY2thZ2VzL3NjaGVtYS1zcGVjL3NyYyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VMaWZlY3ljbGVIb29rKHsgZGlkTW91bnQsIHdpbGxVbm1vdW50IH06IExpZmVjeWNsZUhvb2tzKTogdm9pZCB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZGlkTW91bnQ/LigpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHdpbGxVbm1vdW50Py4oKTtcbiAgICB9O1xuICB9LCBbXSk7XG59XG5cbmludGVyZmFjZSBVc2VSZWZSZXN1bHRQcm9wcyB7XG4gIHNjaGVtYUlEOiBzdHJpbmc7XG4gIHJlZkxvYWRlcj86IFJlZkxvYWRlcjtcbiAgb3JwaGFuPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVJlZlJlc3VsdChcbiAgeyBzY2hlbWFJRCwgcmVmTG9hZGVyLCBvcnBoYW4gfTogVXNlUmVmUmVzdWx0UHJvcHMsXG4gIHBhcmVudENUWDogQ1RYLFxuKTogQm9vdFJlc3VsdCB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IFtyZXN1bHQsIHNldFJlc3VsdF0gPSB1c2VTdGF0ZTxCb290UmVzdWx0PigpO1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFzY2hlbWFJRCkge1xuICAgICAgbG9nZ2VyLmVycm9yKGBzY2hlbWFJRCBpcyByZXF1aXJlZCBvbiBSZWZOb2RlLCBwbGVhc2UgY2hlY2sgdGhlIHNwZWMgZm9yIG5vZGU6ICR7Y3VycmVudFBhdGh9YCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFyZWZMb2FkZXIpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgJ3JlZkxvYWRlciBpcyByZXF1aXJlZCBvbiBSZWZOb2RlIGluIG9yZGVyIHRvIGdldCByZWYgc2NoZW1hIGFuZCBjb3JyZXNwb25kaW5nIEFQSVNwZWNBZGFwdGVyLCcsXG4gICAgICAgICdwbGVhc2UgaW1wbGVtZW50IHJlZkxvYWRlciBhbmQgcGFzcyBpdCB0byBwYXJlbnQgUmVuZGVyRW5naW5lLicsXG4gICAgICAgIGBjdXJyZW50IFJlZk5vZGUgcGF0aCBpczogJHtjdXJyZW50UGF0aH1gLFxuICAgICAgKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdW5Nb3VudGluZyA9IGZhbHNlO1xuICAgIGxldCBfc2NoZW1hOiBTY2hlbWFTcGVjLlNjaGVtYSB8IHVuZGVmaW5lZDtcblxuICAgIHJlZkxvYWRlcihzY2hlbWFJRClcbiAgICAgIC50aGVuKCh7IHNjaGVtYSwgcGx1Z2lucyB9KSA9PiB7XG4gICAgICAgIGlmICh1bk1vdW50aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgX3NjaGVtYSA9IHNjaGVtYTtcblxuICAgICAgICByZXR1cm4gYm9vdFVwKHtcbiAgICAgICAgICBwbHVnaW5zLFxuICAgICAgICAgIHNjaGVtYSxcbiAgICAgICAgICBwYXJlbnRDVFg6IG9ycGhhbiA/IHVuZGVmaW5lZCA6IHBhcmVudENUWCxcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKHJlZkJvb3RSZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKCFyZWZCb290UmVzdWx0IHx8ICFfc2NoZW1hKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0UmVzdWx0KHsgY3R4OiByZWZCb290UmVzdWx0LmN0eCwgcm9vdE5vZGU6IHJlZkJvb3RSZXN1bHQucm9vdE5vZGUgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGxvZ2dlci5lcnJvcik7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5Nb3VudGluZyA9IHRydWU7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTaG91bGRSZW5kZXIobm9kZTogU2NoZW1hTm9kZSwgY3R4OiBDVFgpOiBib29sZWFuIHtcbiAgY29uc3QgY29uZGl0aW9uID0gbm9kZS5zaG91bGRSZW5kZXI7XG4gIGNvbnN0IHBsYWNlaG9sZGVyTm9kZTogU2NoZW1hTm9kZSA9IHtcbiAgICBpZDogJ3BsYWNlaG9sZGVyLW5vZGUnLFxuICAgIHR5cGU6ICdodG1sLWVsZW1lbnQnLFxuICAgIG5hbWU6ICdkaXYnLFxuICAgIHByb3BzOiBjb25kaXRpb24gPyB7IHNob3VsZFJlbmRlcjogY29uZGl0aW9uIH0gOiB1bmRlZmluZWQsXG4gIH07XG5cbiAgY29uc3QgeyBzaG91bGRSZW5kZXIgfSA9IHVzZUluc3RhbnRpYXRlUHJvcHMocGxhY2Vob2xkZXJOb2RlLCBjdHgpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoY29uZGl0aW9uLnR5cGUgPT09ICdhcGlfbG9hZGluZ19wcm9wZXJ0eScpIHtcbiAgICByZXR1cm4gY29uZGl0aW9uLnJldmVydCA/ICFzaG91bGRSZW5kZXIgOiAhIXNob3VsZFJlbmRlcjtcbiAgfVxuXG4gIHJldHVybiAhIXNob3VsZFJlbmRlcjtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgVFByb3BzIH0gZnJvbSAncmVhY3QtanN4LXBhcnNlcic7XG5cbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgSlNYTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuL2hvb2tzJztcbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuL3BhdGgtY29udGV4dCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IEpTWE5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiB1c2VSZWFjdEpTWFBhcnNlcigpOiBSZWFjdC5Db21wb25lbnQ8VFByb3BzPiB8IG51bGwge1xuICBjb25zdCBbY29tLCBzZXRDb21wb25lbnRdID0gdXNlU3RhdGU8UmVhY3QuQ29tcG9uZW50PFRQcm9wcz4gfCBudWxsPihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCB1bk1vdW50aW5nID0gZmFsc2U7XG4gICAgLy8gdG9kbyBjaGFuZ2UgJ3JlYWN0LWpzeC1wYXJzZXInIGFzIHBsdWdpblxuICAgIFN5c3RlbS5pbXBvcnQoJ3JlYWN0LWpzeC1wYXJzZXInKVxuICAgICAgLnRoZW4oKG1vZHVsZSkgPT4ge1xuICAgICAgICBpZiAodW5Nb3VudGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldENvbXBvbmVudCgoKSA9PiBtb2R1bGUuZGVmYXVsdCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gbG9hZCBkZXBlbmRhbmNlIHJlYWN0LWpzeC1wYXJzZXI6JywgZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5Nb3VudGluZyA9IHRydWU7XG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbTtcbn1cblxuZnVuY3Rpb24gSlNYTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgUmVhY3RKU1hQYXJzZXIgPSB1c2VSZWFjdEpTWFBhcnNlcigpO1xuXG4gIGlmICghbm9kZS5qc3gpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ2pzeCBzdHJpbmcgaXMgcmVxdWlyZWQsJywgYHBsZWFzZSBjaGVjayB0aGUgc3BlYyBvZiBub2RlOiAke2N1cnJlbnRQYXRofS5gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghUmVhY3RKU1hQYXJzZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0SlNYUGFyc2VyIGFzIGFueSwge1xuICAgIGJpbmRpbmdzOiBwcm9wcyxcbiAgICByZW5kZXJJbldyYXBwZXI6IGZhbHNlLFxuICAgIGpzeDogbm9kZS5qc3gsXG4gICAgb25FcnJvcjogKGVycjogYW55KSA9PiBjb25zb2xlLmxvZyhlcnIpLFxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSlNYTm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vaywgdXNlUmVmUmVzdWx0IH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUmVmTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogUmVmTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlZk5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcbiAgY29uc3QgcmVzdWx0ID0gdXNlUmVmUmVzdWx0KFxuICAgIHsgc2NoZW1hSUQ6IG5vZGUuc2NoZW1hSUQsIHJlZkxvYWRlcjogY3R4LnBsdWdpbnMucmVmTG9hZGVyLCBvcnBoYW46IG5vZGUub3JwaGFuIH0sXG4gICAgY3R4LFxuICApO1xuXG4gIGlmICghcmVzdWx0KSB7XG4gICAgaWYgKG5vZGUuZmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogbm9kZS5mYWxsYmFjaywgY3R4IH0pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiByZXN1bHQucm9vdE5vZGUsIGN0eDogcmVzdWx0LmN0eCB9KTtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHVzZUluc3RhbnRpYXRlUHJvcHMgZnJvbSAnLi4vdXNlLWluc3RhbnRpYXRlLXByb3BzJztcbmltcG9ydCB0eXBlIHsgQ1RYLCBIVE1MTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IENoaWxkcmVuUmVuZGVyIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi9wYXRoLWNvbnRleHQnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBIVE1MTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIEhUTUxOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlLCBjdHgpO1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuXG4gIGlmICghbm9kZS5uYW1lKSB7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgJ25hbWUgcHJvcGVydHkgaXMgcmVxdWlyZWQgaW4gaHRtbCBub2RlIHNwZWMsJyxcbiAgICAgIGBwbGVhc2UgY2hlY2sgdGhlIHNwZWMgb2Ygbm9kZTogJHtjdXJyZW50UGF0aH0uYCxcbiAgICApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSwgcHJvcHMpO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgbm9kZS5uYW1lLFxuICAgIHByb3BzLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2hpbGRyZW5SZW5kZXIsIHsgbm9kZXM6IG5vZGUuY2hpbGRyZW4gfHwgW10sIGN0eCB9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSFRNTE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgdHlwZSB7IENvbnN0YW50UHJvcGVydHkgfSBmcm9tICdAb25lLWZvci1hbGwvc2NoZW1hLXNwZWMnO1xuXG5pbXBvcnQgeyBDVFgsIFNjaGVtYU5vZGUsIFBsYWluU3RhdGUsIE5vZGVQcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgdXNlSW5zdGFudGlhdGVQcm9wcyBmcm9tICcuLi8uLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlSXRlcmFibGUoaXRlcmFibGVTdGF0ZTogUGxhaW5TdGF0ZSwgY3R4OiBDVFgpOiBBcnJheTx1bmtub3duPiB8IG51bGwge1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuXG4gIGNvbnN0IGR1bW15Tm9kZTogU2NoZW1hTm9kZSA9IHtcbiAgICB0eXBlOiAnaHRtbC1lbGVtZW50JyxcbiAgICBpZDogJ2R1bW15TG9vcENvbnRhaW5lcicsXG4gICAgbmFtZTogJ2RpdicsXG4gICAgcHJvcHM6IHsgaXRlcmFibGU6IGl0ZXJhYmxlU3RhdGUgfSxcbiAgfTtcblxuICBjb25zdCB7IGl0ZXJhYmxlIH0gPSB1c2VJbnN0YW50aWF0ZVByb3BzKGR1bW15Tm9kZSwgY3R4KTtcblxuICBpZiAoIUFycmF5LmlzQXJyYXkoaXRlcmFibGUpKSB7XG4gICAgY29uc3Qgbm9kZUlEID0gY3VycmVudFBhdGguc3BsaXQoJy8nKS5wb3AoKTtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnc3RhdGUgaXMgbm90IGl0ZXJhYmxlLicsXG4gICAgICBgTG9vcENvbnRhaW5lciBub2RlIFske25vZGVJRH1dIHJlcXVpcmUgYSBhcnJheSB0eXBlIHN0YXRlLGAsXG4gICAgICAvLyB0b2RvIG9wdGltaXplIHRvU3RyaW5nIG9mIGl0ZXJhYmxlXG4gICAgICBgYnV0IGdvdDogJHtpdGVyYWJsZX0sYCxcbiAgICAgICdwbGVhc2UgY2hlY2sgdGhlIGZvbGxvdyBwcm9wZXJ0eSBzcGVjOlxcbicsXG4gICAgICBpdGVyYWJsZVN0YXRlLFxuICAgICk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gaXRlcmFibGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBcHByb3ByaWF0ZUtleShpdGVtOiB1bmtub3duLCBsb29wS2V5OiBzdHJpbmcsIGluZGV4OiBudW1iZXIpOiBzdHJpbmcgfCBudW1iZXIge1xuICBpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBpdGVtID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBpdGVtID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2YgaXRlbSA9PT0gJ2Z1bmN0aW9uJyB8fCB0eXBlb2YgaXRlbSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgcmV0dXJuIGluZGV4O1xuICB9XG5cbiAgaWYgKHR5cGVvZiBpdGVtID09PSAnb2JqZWN0JyAmJiBpdGVtICE9PSBudWxsKSB7XG4gICAgLy8ganVzdCBmb3Igb3ZlcnJpZGUgdHlwZXNjcmlwdCBcIk5vIGluZGV4IHNpZ25hdHVyZVwiIGVycm9yXG4gICAgcmV0dXJuIFJlZmxlY3QuZ2V0KGl0ZW0sIGxvb3BLZXkpO1xuICB9XG5cbiAgcmV0dXJuIGluZGV4O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdHJ5VG9Qcm9wcyhcbiAgc291cmNlOiB1bmtub3duLFxuICBpbmRleDogbnVtYmVyLFxuICB0b1Byb3BzOiAoaXRlbTogdW5rbm93biwgaW5kZXg6IG51bWJlcikgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIGN1cnJlbnRQYXRoOiBzdHJpbmcsXG4pOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB8IG51bGwge1xuICB0cnkge1xuICAgIGNvbnN0IHRvUHJvcHNSZXN1bHQgPSB0b1Byb3BzKHNvdXJjZSwgaW5kZXgpO1xuICAgIGlmICh0eXBlb2YgdG9Qcm9wc1Jlc3VsdCAhPT0gJ29iamVjdCcgJiYgIXRvUHJvcHNSZXN1bHQpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgJ3RvUHJvcHMgcmVzdWx0IHNob3VsZCBiZSBhbiBvYmplY3QsIGJ1dCBnb3Q6ICR7dG9Qcm9wc1Jlc3VsdH0sJyxcbiAgICAgICAgYHBsZWFzZSBjaGVjayB0aGUgdG9Qcm9wcyBzcGVjIG9mIG5vZGU6ICR7Y3VycmVudFBhdGh9LGAsXG4gICAgICAgICd0aGUgY29ycmVzcG9uZGluZyBub2RlIHdpbGwgYmUgc2tpcHBlZCBmb3IgcmVuZGVyLicsXG4gICAgICApO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvUHJvcHNSZXN1bHQ7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgJ0FuIGVycm9yIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgdG9Qcm9wcyB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyOicsXG4gICAgICBzb3VyY2UsXG4gICAgICAnXFxuJyxcbiAgICAgIGBwbGVhc2UgY2hlY2sgdGhlIHRvUHJvcHMgc3BlYyBvZiBub2RlOiAke2N1cnJlbnRQYXRofSxgLFxuICAgICAgJ3RoZSBjb3JyZXNwb25kaW5nIG5vZGUgd2lsbCBiZSBza2lwcGVkIGZvciByZW5kZXIuJyxcbiAgICApO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFVzZU1lcmdlZFByb3BzTGlzdFBhcmFtcyB7XG4gIGl0ZXJhYmxlU3RhdGU6IFBsYWluU3RhdGU7XG4gIHRvUHJvcHM6IChpdGVtOiB1bmtub3duKSA9PiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgb3RoZXJQcm9wcz86IE5vZGVQcm9wZXJ0aWVzO1xuICBjdHg6IENUWDtcbiAgbG9vcEtleTogc3RyaW5nO1xufVxuXG4vLyB1c2VNZXJnZWRQcm9wc0xpc3QgcmV0dXJuIGEgbGlzdCBvZiBgcHJvcHNgIGFuZCBga2V5YCB3aGljaCBjb3VsZCBiZSB1c2VkIGZvciBpdGVyYXRpb24sXG4vLyBlYWNoIGBwcm9wc2AgbWVyZ2VkIGl0ZXJhYmxlU3RhdGUgYW5kIG90aGVyUHJvcHNcbmV4cG9ydCBmdW5jdGlvbiB1c2VNZXJnZWRQcm9wc0xpc3Qoe1xuICBpdGVyYWJsZVN0YXRlLFxuICB0b1Byb3BzLFxuICBvdGhlclByb3BzLFxuICBjdHgsXG4gIGxvb3BLZXksXG59OiBVc2VNZXJnZWRQcm9wc0xpc3RQYXJhbXMpOiBBcnJheTxbUmVhY3QuS2V5LCBOb2RlUHJvcGVydGllc10+IHwgbnVsbCB7XG4gIGNvbnN0IGl0ZXJhYmxlID0gdXNlSXRlcmFibGUoaXRlcmFibGVTdGF0ZSwgY3R4KTtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICBpZiAoIWl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gaXRlcmFibGVcbiAgICAubWFwPFtSZWFjdC5LZXksIE5vZGVQcm9wZXJ0aWVzXSB8IG51bGw+KChpdGVtLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3QgY29udmVydGVkUHJvcHMgPSB0cnlUb1Byb3BzKGl0ZW0sIGluZGV4LCB0b1Byb3BzLCBjdXJyZW50UGF0aCk7XG4gICAgICBpZiAoIWNvbnZlcnRlZFByb3BzKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuXG4gICAgICAvLyBjb252ZXJ0IGl0ZXJhYmxlIHRvIGNvbnN0YW50IHByb3BlcnR5IHNwZWMgZm9yIHJldXNlIG9mIE5vZGVSZW5kZXJcbiAgICAgIGNvbnN0IGNvbnN0UHJvcHMgPSBPYmplY3QuZW50cmllcyhjb252ZXJ0ZWRQcm9wcykucmVkdWNlPFJlY29yZDxzdHJpbmcsIENvbnN0YW50UHJvcGVydHk+PihcbiAgICAgICAgKGNvbnN0UHJvcHMsIFtwcm9wTmFtZSwgdmFsdWVdKSA9PiB7XG4gICAgICAgICAgY29uc3RQcm9wc1twcm9wTmFtZV0gPSB7IHR5cGU6ICdjb25zdGFudF9wcm9wZXJ0eScsIHZhbHVlIH07XG5cbiAgICAgICAgICByZXR1cm4gY29uc3RQcm9wcztcbiAgICAgICAgfSxcbiAgICAgICAge30sXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gW2dldEFwcHJvcHJpYXRlS2V5KGl0ZW0sIGxvb3BLZXksIGluZGV4KSwgT2JqZWN0LmFzc2lnbih7fSwgb3RoZXJQcm9wcywgY29uc3RQcm9wcyldO1xuICAgIH0pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW1JlYWN0LktleSwgTm9kZVByb3BlcnRpZXNdID0+ICEhcGFpcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VDb21wb3NlZFByb3BzU3BlYyhcbiAgY29tcG9zZWRTdGF0ZTogdW5rbm93bixcbiAgdG9Qcm9wczogKHN0YXRlOiB1bmtub3duKSA9PiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgaW5kZXg6IG51bWJlcixcbiAgb3RoZXJQcm9wcz86IE5vZGVQcm9wZXJ0aWVzLFxuKTogTm9kZVByb3BlcnRpZXMge1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBjb21wb3NlZFByb3BzID0gdHJ5VG9Qcm9wcyhjb21wb3NlZFN0YXRlLCBpbmRleCwgdG9Qcm9wcywgY3VycmVudFBhdGgpO1xuICAgIGNvbnN0IGNvbXBvc2VkUHJvcHNTcGVjID0gT2JqZWN0LmVudHJpZXMoY29tcG9zZWRQcm9wcyB8fCB7fSkucmVkdWNlPFJlY29yZDxzdHJpbmcsIENvbnN0YW50UHJvcGVydHk+PihcbiAgICAgIChhY2MsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICBhY2Nba2V5XSA9IHtcbiAgICAgICAgICB0eXBlOiAnY29uc3RhbnRfcHJvcGVydHknLFxuICAgICAgICAgIHZhbHVlLFxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIHt9LFxuICAgICk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgb3RoZXJQcm9wcywgY29tcG9zZWRQcm9wc1NwZWMpO1xuICB9LCBbY29tcG9zZWRTdGF0ZSwgb3RoZXJQcm9wc10pO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IENUWCwgU2NoZW1hTm9kZSwgUGxhaW5TdGF0ZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4uJztcbmltcG9ydCB7IHVzZU1lcmdlZFByb3BzTGlzdCB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vcGF0aC1jb250ZXh0JztcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wcyB7XG4gIGl0ZXJhYmxlU3RhdGU6IFBsYWluU3RhdGU7XG4gIGxvb3BLZXk6IHN0cmluZztcbiAgdG9Qcm9wczogKGl0ZW06IHVua25vd24pID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBub2RlOiBTY2hlbWFOb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gTG9vcEluZGl2aWR1YWwoeyBpdGVyYWJsZVN0YXRlLCBsb29wS2V5LCBub2RlLCBjdHgsIHRvUHJvcHMgfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgcGFyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuICBjb25zdCBtZXJnZWRQcm9wc0xpc3QgPSB1c2VNZXJnZWRQcm9wc0xpc3Qoe1xuICAgIGl0ZXJhYmxlU3RhdGUsXG4gICAgdG9Qcm9wcyxcbiAgICBjdHgsXG4gICAgbG9vcEtleSxcbiAgICBvdGhlclByb3BzOiBub2RlLnByb3BzLFxuICB9KTtcblxuICBpZiAoIW1lcmdlZFByb3BzTGlzdCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgUmVhY3QuRnJhZ21lbnQsXG4gICAgbnVsbCxcbiAgICBtZXJnZWRQcm9wc0xpc3QubWFwKChba2V5LCBwcm9wc10sIGluZGV4KTogUmVhY3QuUmVhY3RFbGVtZW50ID0+IHtcbiAgICAgIGNvbnN0IG5ld05vZGUgPSBPYmplY3QuYXNzaWduKHt9LCBub2RlLCB7IHByb3BzIH0pO1xuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICAgIHsgdmFsdWU6IGAke3BhcmVudFBhdGh9LyR7aW5kZXh9YCwga2V5IH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBrZXksIG5vZGU6IG5ld05vZGUsIGN0eCB9KSxcbiAgICAgICk7XG4gICAgfSksXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvb3BJbmRpdmlkdWFsO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHR5cGUgeyBDb21wb25lbnRMb2FkZXJQYXJhbSwgRHluYW1pY0NvbXBvbmVudCwgUmVwb3NpdG9yeSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRDb21wb25lbnRJblJlcG9zaXRvcnkoXG4gIHJlcG9zaXRvcnk6IFJlcG9zaXRvcnksXG4gIHsgcGFja2FnZU5hbWUsIHBhY2thZ2VWZXJzaW9uLCBleHBvcnROYW1lIH06IENvbXBvbmVudExvYWRlclBhcmFtLFxuKTogRHluYW1pY0NvbXBvbmVudCB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHBhY2thZ2VOYW1lVmVyc2lvbiA9IGAke3BhY2thZ2VOYW1lfUAke3BhY2thZ2VWZXJzaW9ufWA7XG5cbiAgcmV0dXJuIHJlcG9zaXRvcnlbcGFja2FnZU5hbWVWZXJzaW9uXT8uW2V4cG9ydE5hbWUgfHwgJ2RlZmF1bHQnXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN5c3RlbUNvbXBvbmVudExvYWRlcih7XG4gIHBhY2thZ2VOYW1lLFxuICBleHBvcnROYW1lLFxufTogQ29tcG9uZW50TG9hZGVyUGFyYW0pOiBQcm9taXNlPER5bmFtaWNDb21wb25lbnQ+IHtcbiAgcmV0dXJuIFN5c3RlbS5pbXBvcnQocGFja2FnZU5hbWUpXG4gICAgLnRoZW4oKHN5c3RlbU1vZHVsZSkgPT4ge1xuICAgICAgLy8gdG9kbyBjYXRjaCB1bmRlZmluZWQgZXJyb3JcbiAgICAgIHJldHVybiBzeXN0ZW1Nb2R1bGVbZXhwb3J0TmFtZSB8fCAnZGVmYXVsdCddO1xuICAgIH0pXG4gICAgLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gbG9hZCBub2RlIGNvbXBvbmVudCwnLCBlcnJvcik7XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0pO1xufVxuIiwiaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuLi9wYXRoLWNvbnRleHQnO1xuaW1wb3J0IHsgZmluZENvbXBvbmVudEluUmVwb3NpdG9yeSwgc3lzdGVtQ29tcG9uZW50TG9hZGVyIH0gZnJvbSAnLi9oZWxwZXInO1xuaW1wb3J0IHR5cGUgeyBEeW5hbWljQ29tcG9uZW50LCBQbHVnaW5zLCBSZWFjdENvbXBvbmVudE5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZU5vZGVDb21wb25lbnQoXG4gIG5vZGU6IFBpY2s8UmVhY3RDb21wb25lbnROb2RlLCAncGFja2FnZU5hbWUnIHwgJ3BhY2thZ2VWZXJzaW9uJyB8ICdleHBvcnROYW1lJz4sXG4gIHsgcmVwb3NpdG9yeSwgY29tcG9uZW50TG9hZGVyIH06IFBpY2s8UGx1Z2lucywgJ3JlcG9zaXRvcnknIHwgJ2NvbXBvbmVudExvYWRlcic+LFxuKTogRHluYW1pY0NvbXBvbmVudCB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG4gIGNvbnN0IFtsYXp5TG9hZGVkQ29tcG9uZW50LCBzZXRDb21wb25lbnRdID0gdXNlU3RhdGU8RHluYW1pY0NvbXBvbmVudCB8IHVuZGVmaW5lZD4oKCkgPT4ge1xuICAgIGlmICghcmVwb3NpdG9yeSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiBmaW5kQ29tcG9uZW50SW5SZXBvc2l0b3J5KHJlcG9zaXRvcnksIG5vZGUpO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChsYXp5TG9hZGVkQ29tcG9uZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHVuTW91bnRpbmcgPSBmYWxzZTtcbiAgICBjb25zdCBmaW5pYWxMb2FkZXIgPSBjb21wb25lbnRMb2FkZXIgfHwgc3lzdGVtQ29tcG9uZW50TG9hZGVyO1xuXG4gICAgZmluaWFsTG9hZGVyKHtcbiAgICAgIHBhY2thZ2VOYW1lOiBub2RlLnBhY2thZ2VOYW1lLFxuICAgICAgcGFja2FnZVZlcnNpb246IG5vZGUucGFja2FnZVZlcnNpb24sXG4gICAgICBleHBvcnROYW1lOiBub2RlLmV4cG9ydE5hbWUsXG4gICAgfSlcbiAgICAgIC50aGVuKChjb21wKSA9PiB7XG4gICAgICAgIGlmICh1bk1vdW50aW5nKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjb21wKSB7XG4gICAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgICAgYGdvdCBlbXB0eSBjb21wb25lbnQgZm9yIHBhY2thZ2U6ICR7bm9kZS5wYWNrYWdlTmFtZX0sYCxcbiAgICAgICAgICAgIGBleHBvcnROYW1lOiAke25vZGUuZXhwb3J0TmFtZX0sIHZlcnNpb246ICR7bm9kZS5wYWNrYWdlVmVyc2lvbn1gLFxuICAgICAgICAgICAgYHBsZWFzZSBjaGVjayB0aGUgc3BlYyBmb3Igbm9kZTogJHtjdXJyZW50UGF0aH0uYCxcbiAgICAgICAgICApO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldENvbXBvbmVudCgoKSA9PiBjb21wKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2gobG9nZ2VyLmVycm9yKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB1bk1vdW50aW5nID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbbGF6eUxvYWRlZENvbXBvbmVudF0pO1xuXG4gIHJldHVybiBsYXp5TG9hZGVkQ29tcG9uZW50O1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBDVFgsIEhUTUxOb2RlLCBSZWFjdENvbXBvbmVudE5vZGUsIENvbXBvc2VPdXRMYXllciB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uLy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi4vaG9va3MnO1xuaW1wb3J0IHVzZU5vZGVDb21wb25lbnQgZnJvbSAnLi4vaG9va3MvdXNlLW5vZGUtY29tcG9uZW50JztcblxudHlwZSBIVE1MT3V0TGF5ZXJSZW5kZXJQcm9wcyA9IFByb3BzV2l0aENoaWxkcmVuPHtcbiAgb3V0TGF5ZXI6IE9taXQ8SFRNTE5vZGUsICdjaGlsZHJlbic+O1xuICBjdHg6IENUWDtcbn0+O1xuXG5mdW5jdGlvbiBIVE1MT3V0TGF5ZXJSZW5kZXIoeyBvdXRMYXllciwgY3R4LCBjaGlsZHJlbiB9OiBIVE1MT3V0TGF5ZXJSZW5kZXJQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhvdXRMYXllciwgY3R4KTtcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQob3V0TGF5ZXIubmFtZSwgcHJvcHMsIGNoaWxkcmVuKTtcbn1cblxudHlwZSBSZWFjdENvbXBvbmVudE91dExheWVyUmVuZGVyUHJvcHMgPSBQcm9wc1dpdGhDaGlsZHJlbjx7XG4gIG91dExheWVyOiBPbWl0PFJlYWN0Q29tcG9uZW50Tm9kZSwgJ2NoaWxkcmVuJz47XG4gIGN0eDogQ1RYO1xufT47XG5cbmZ1bmN0aW9uIFJlYWN0Q29tcG9uZW50T3V0TGF5ZXJSZW5kZXIoe1xuICBvdXRMYXllcixcbiAgY3R4LFxuICBjaGlsZHJlbixcbn06IFJlYWN0Q29tcG9uZW50T3V0TGF5ZXJSZW5kZXJQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMob3V0TGF5ZXIsIGN0eCk7XG4gIGNvbnN0IG5vZGVDb21wb25lbnQgPSB1c2VOb2RlQ29tcG9uZW50KG91dExheWVyLCBjdHgucGx1Z2lucyk7XG4gIHVzZUxpZmVjeWNsZUhvb2sob3V0TGF5ZXIubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuXG4gIGlmICghbm9kZUNvbXBvbmVudCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQobm9kZUNvbXBvbmVudCwgcHJvcHMsIGNoaWxkcmVuKTtcbn1cblxudHlwZSBQcm9wcyA9IFByb3BzV2l0aENoaWxkcmVuPHtcbiAgb3V0TGF5ZXI/OiBDb21wb3NlT3V0TGF5ZXI7XG4gIGN0eDogQ1RYO1xufT47XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIE91dExheWVyUmVuZGVyKHsgb3V0TGF5ZXIsIGN0eCwgY2hpbGRyZW4gfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgaWYgKG91dExheWVyPy50eXBlID09PSAnaHRtbC1lbGVtZW50Jykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEhUTUxPdXRMYXllclJlbmRlciwgeyBvdXRMYXllciwgY3R4IH0sIGNoaWxkcmVuKTtcbiAgfVxuXG4gIGlmIChvdXRMYXllcj8udHlwZSA9PT0gJ3JlYWN0LWNvbXBvbmVudCcpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdENvbXBvbmVudE91dExheWVyUmVuZGVyLCB7IG91dExheWVyLCBjdHggfSwgY2hpbGRyZW4pO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3QuRnJhZ21lbnQsIG51bGwsIGNoaWxkcmVuKTtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBDVFgsIFBsYWluU3RhdGUsIENvbXBvc2VkTm9kZSwgQ29tcG9zZWROb2RlQ2hpbGQgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBnZXRBcHByb3ByaWF0ZUtleSwgdXNlSXRlcmFibGUsIHVzZUNvbXBvc2VkUHJvcHNTcGVjIH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCBPdXRMYXllclJlbmRlciBmcm9tICcuL291dC1sYXllci1yZW5kZXInO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5cbmludGVyZmFjZSBDb21wb3NlZENoaWxkUmVuZGVyUHJvcHMge1xuICBub2RlOiBDb21wb3NlZE5vZGVDaGlsZDtcbiAgY29tcG9zZWRTdGF0ZTogdW5rbm93bjtcbiAgY3R4OiBDVFg7XG4gIGluZGV4OiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIENvbXBvc2VkQ2hpbGRSZW5kZXIoe1xuICBub2RlLFxuICBjb21wb3NlZFN0YXRlLFxuICBjdHgsXG4gIGluZGV4LFxufTogQ29tcG9zZWRDaGlsZFJlbmRlclByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHtcbiAgY29uc3QgcHJvcFNwZWMgPSB1c2VDb21wb3NlZFByb3BzU3BlYyhjb21wb3NlZFN0YXRlLCBub2RlLnRvUHJvcHMsIGluZGV4LCBub2RlLnByb3BzKTtcbiAgY29uc3QgX25vZGUgPSBPYmplY3QuYXNzaWduKHt9LCBub2RlLCB7IHByb3BzOiBwcm9wU3BlYyB9KTtcbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiBfbm9kZSwgY3R4IH0pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFByb3BzIHtcbiAgaXRlcmFibGVTdGF0ZTogUGxhaW5TdGF0ZTtcbiAgbG9vcEtleTogc3RyaW5nO1xuICBub2RlOiBDb21wb3NlZE5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBMb29wQ29tcG9zZWQoeyBpdGVyYWJsZVN0YXRlLCBsb29wS2V5LCBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgcGFyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuICBjb25zdCBpdGVyYWJsZSA9IHVzZUl0ZXJhYmxlKGl0ZXJhYmxlU3RhdGUsIGN0eCk7XG5cbiAgaWYgKCFpdGVyYWJsZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgUmVhY3QuRnJhZ21lbnQsXG4gICAgbnVsbCxcbiAgICBpdGVyYWJsZS5tYXAoKGNvbXBvc2VkU3RhdGUsIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBrZXkgPSBnZXRBcHByb3ByaWF0ZUtleShjb21wb3NlZFN0YXRlLCBsb29wS2V5LCBpbmRleCk7XG5cbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgICAgeyB2YWx1ZTogYCR7cGFyZW50UGF0aH0vJHtub2RlLmlkfS8ke2luZGV4fWAsIGtleTogaW5kZXggfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICBPdXRMYXllclJlbmRlcixcbiAgICAgICAgICB7IGtleSwgb3V0TGF5ZXI6IG5vZGUub3V0TGF5ZXIsIGN0eCB9LFxuICAgICAgICAgIChub2RlLm5vZGVzIHx8IG5vZGUuY2hpbGRyZW4pLm1hcCgoY29tcG9zZWRDaGlsZCwgaW5kZXgpOiBSZWFjdC5SZWFjdEVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ29tcG9zZWRDaGlsZFJlbmRlciwge1xuICAgICAgICAgICAgICBub2RlOiBjb21wb3NlZENoaWxkLFxuICAgICAgICAgICAgICBjb21wb3NlZFN0YXRlLFxuICAgICAgICAgICAgICBjdHgsXG4gICAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgICBrZXk6IGNvbXBvc2VkQ2hpbGQuaWQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKSxcbiAgICAgICk7XG4gICAgfSksXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvb3BDb21wb3NlZDtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuXG5pbXBvcnQgTG9vcEluZGl2aWR1YWwgZnJvbSAnLi9sb29wLWluZGl2aWR1YWwnO1xuaW1wb3J0IExvb3BDb21wb3NlZCBmcm9tICcuL2xvb3AtY29tcG9zZWQnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIExvb3BDb250YWluZXJOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vayB9IGZyb20gJy4uL2hvb2tzJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogTG9vcENvbnRhaW5lck5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBMb29wTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuXG4gIGNvbnN0IHsgbm9kZTogTG9vcE5vZGUgfSA9IG5vZGU7XG5cbiAgaWYgKExvb3BOb2RlLnR5cGUgIT09ICdjb21wb3NlZC1ub2RlJyAmJiAndG9Qcm9wcycgaW4gbm9kZSkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KExvb3BJbmRpdmlkdWFsLCB7XG4gICAgICBpdGVyYWJsZVN0YXRlOiBub2RlLml0ZXJhYmxlU3RhdGUsXG4gICAgICBsb29wS2V5OiBub2RlLmxvb3BLZXksXG4gICAgICBub2RlOiBMb29wTm9kZSxcbiAgICAgIHRvUHJvcHM6ICh2OiB1bmtub3duKSA9PiBub2RlLnRvUHJvcHModiksXG4gICAgICBjdHgsXG4gICAgfSk7XG4gIH1cblxuICBpZiAoTG9vcE5vZGUudHlwZSA9PT0gJ2NvbXBvc2VkLW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTG9vcENvbXBvc2VkLCB7XG4gICAgICBpdGVyYWJsZVN0YXRlOiBub2RlLml0ZXJhYmxlU3RhdGUsXG4gICAgICBsb29wS2V5OiBub2RlLmxvb3BLZXksXG4gICAgICBub2RlOiBMb29wTm9kZSxcbiAgICAgIGN0eCxcbiAgICB9KTtcbiAgfVxuXG4gIGxvZ2dlci5lcnJvcignVW5yZWNvZ25pemVkIGxvb3Agbm9kZTonLCBub2RlKTtcblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vcE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgcmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBSb3V0ZUNvbnRleHQgPSByZWFjdC5jcmVhdGVDb250ZXh0PHN0cmluZz4oJy8nKTtcblxuZXhwb3J0IGRlZmF1bHQgUm91dGVDb250ZXh0O1xuIiwiLy8gdHJpbSBiZWdpbiBhbmQgbGFzdCBzbGFzaFxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1TbGFzaChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5yZXBsYWNlKC9eXFwvfFxcLyQvZywgJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQYXJhbUhvbGRlcihmcmFnbWVudDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAvXjpbYS16QS1aX11bW2EtekEtWl8kMC05XSskLy50ZXN0KGZyYWdtZW50KTtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB0eXBlIHsgTG9jYXRpb24gfSBmcm9tICdoaXN0b3J5JztcblxuaW1wb3J0IHsgaXNQYXJhbUhvbGRlciB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhhY3RseUNoZWNrKHBhdGg6IHN0cmluZywgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdGhGcmFnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gIGNvbnN0IHJvdXRlRnJhZ21lbnRzID0gY3VycmVudFJvdXRlUGF0aC5zcGxpdCgnLycpO1xuICBpZiAocGF0aEZyYWdtZW50cy5sZW5ndGggIT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwYXRoRnJhZ21lbnRzLmV2ZXJ5KChmcmFnbWVudCwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXNQYXJhbUhvbGRlcihyb3V0ZUZyYWdtZW50c1tpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnJhZ21lbnQgPT09IHJvdXRlRnJhZ21lbnRzW2luZGV4XTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVmaXhDaGVjayhwYXRoOiBzdHJpbmcsIGN1cnJlbnRSb3V0ZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBwYXRoRnJhZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICBjb25zdCByb3V0ZUZyYWdtZW50cyA9IGN1cnJlbnRSb3V0ZVBhdGguc3BsaXQoJy8nKTtcbiAgaWYgKHBhdGhGcmFnbWVudHMubGVuZ3RoIDwgcm91dGVGcmFnbWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJvdXRlRnJhZ21lbnRzLmV2ZXJ5KChmcmFnbWVudCwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXNQYXJhbUhvbGRlcihmcmFnbWVudCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmcmFnbWVudCA9PT0gcGF0aEZyYWdtZW50c1tpbmRleF07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1c2VNYXRjaChsb2NhdGlvbiQ6IEJlaGF2aW9yU3ViamVjdDxMb2NhdGlvbj4sIGN1cnJlbnRSb3V0ZVBhdGg6IHN0cmluZywgZXhhY3RseTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBjb25zdCBbbWF0Y2gsIHNldE1hdGNoXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmliZSA9IGxvY2F0aW9uJFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgoeyBwYXRobmFtZSB9KTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgcmV0dXJuIGV4YWN0bHkgPyBleGFjdGx5Q2hlY2socGF0aG5hbWUsIGN1cnJlbnRSb3V0ZVBhdGgpIDogcHJlZml4Q2hlY2socGF0aG5hbWUsIGN1cnJlbnRSb3V0ZVBhdGgpO1xuICAgICAgICB9KSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoc2V0TWF0Y2gpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmliZS51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIG1hdGNoO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VNYXRjaDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgUm91dGVQYXRoQ29udGV4dCBmcm9tICcuL3JvdXRlLXBhdGgtY29udGV4dCc7XG5pbXBvcnQgdXNlTWF0Y2ggZnJvbSAnLi91c2UtbWF0Y2gnO1xuaW1wb3J0IHsgdHJpbVNsYXNoIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi4vaG9va3MnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFJvdXRlTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IFJvdXRlTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ3VycmVudFBhdGgocGFyZW50UGF0aDogc3RyaW5nLCByb3V0ZVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChwYXJlbnRQYXRoID09PSAnLycpIHtcbiAgICByZXR1cm4gYC8ke3RyaW1TbGFzaChyb3V0ZVBhdGgpfWA7XG4gIH1cblxuICByZXR1cm4gYCR7cGFyZW50UGF0aH0vJHt0cmltU2xhc2gocm91dGVQYXRoKX1gO1xufVxuXG5mdW5jdGlvbiBSb3V0ZU5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcblxuICBjb25zdCBwYXJlbnRSb3V0ZVBhdGggPSB1c2VDb250ZXh0KFJvdXRlUGF0aENvbnRleHQpO1xuICBjb25zdCBjdXJyZW50Um91dGVQYXRoID0gYnVpbGRDdXJyZW50UGF0aChwYXJlbnRSb3V0ZVBhdGgsIG5vZGUucGF0aCk7XG4gIGNvbnN0IG1hdGNoID0gdXNlTWF0Y2goY3R4LmxvY2F0aW9uJCwgY3VycmVudFJvdXRlUGF0aCwgbm9kZS5leGFjdGx5ID8/IGZhbHNlKTtcblxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFJvdXRlUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50Um91dGVQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogbm9kZS5ub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSb3V0ZU5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdXNlSW5zdGFudGlhdGVQcm9wcyBmcm9tICcuLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuaW1wb3J0IHsgQ2hpbGRyZW5SZW5kZXIgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB0eXBlIHsgQ1RYLCBSZWFjdENvbXBvbmVudE5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgdXNlTm9kZUNvbXBvbmVudCBmcm9tICcuL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IFJlYWN0Q29tcG9uZW50Tm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3Qgbm9kZUNvbXBvbmVudCA9IHVzZU5vZGVDb21wb25lbnQobm9kZSwgY3R4LnBsdWdpbnMpO1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuXG4gIGlmICghbm9kZUNvbXBvbmVudCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG5vZGVDb21wb25lbnQsIHByb3BzKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIG5vZGVDb21wb25lbnQsXG4gICAgcHJvcHMsXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChDaGlsZHJlblJlbmRlciwgeyBub2Rlczogbm9kZS5jaGlsZHJlbiB8fCBbXSwgY3R4IH0pLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdENvbXBvbmVudE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VTaG91bGRSZW5kZXIgfSBmcm9tICcuL2hvb2tzJztcbmltcG9ydCB7IENUWCwgU2NoZW1hTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBKU1hOb2RlUmVuZGVyIGZyb20gJy4vanN4LW5vZGUtcmVuZGVyJztcbmltcG9ydCBSZWZOb2RlUmVuZGVyIGZyb20gJy4vcmVmLW5vZGUtcmVuZGVyJztcbmltcG9ydCBIVE1MTm9kZVJlbmRlciBmcm9tICcuL2h0bWwtbm9kZS1yZW5kZXInO1xuaW1wb3J0IExvb3BOb2RlUmVuZGVyIGZyb20gJy4vbG9vcC1ub2RlLXJlbmRlcic7XG5pbXBvcnQgUm91dGVOb2RlUmVuZGVyIGZyb20gJy4vcm91dGUtbm9kZS1yZW5kZXInO1xuaW1wb3J0IFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlciBmcm9tICcuL3JlYWN0LWNvbXBvbmVudC1ub2RlLXJlbmRlcic7XG5cbmludGVyZmFjZSBDaGlsZHJlblJlbmRlclByb3BzIHtcbiAgbm9kZXM6IFNjaGVtYU5vZGVbXTtcbiAgY3R4OiBDVFg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDaGlsZHJlblJlbmRlcih7IG5vZGVzLCBjdHggfTogQ2hpbGRyZW5SZW5kZXJQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBpZiAoIW5vZGVzLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgUmVhY3QuRnJhZ21lbnQsXG4gICAgbnVsbCxcbiAgICBub2Rlcy5tYXAoKG5vZGUpID0+IFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBrZXk6IG5vZGUuaWQsIG5vZGU6IG5vZGUsIGN0eCB9KSksXG4gICk7XG59XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IFNjaGVtYU5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgY3VycmVudFBhdGggPSBgJHtwYXJlbnRQYXRofS8ke25vZGUuaWR9YDtcbiAgY29uc3Qgc2hvdWxkUmVuZGVyID0gdXNlU2hvdWxkUmVuZGVyKG5vZGUsIGN0eCk7XG5cbiAgaWYgKCFzaG91bGRSZW5kZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdyb3V0ZS1ub2RlJykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50UGF0aCB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZU5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAnbG9vcC1jb250YWluZXInKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExvb3BOb2RlUmVuZGVyLCB7IG5vZGUsIGN0eCB9KSxcbiAgICApO1xuICB9XG5cbiAgaWYgKG5vZGUudHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSFRNTE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAncmVhY3QtY29tcG9uZW50Jykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50UGF0aCB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdENvbXBvbmVudE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAncmVmLW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlZk5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAnanN4LW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEpTWE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBsb2dnZXIuZXJyb3IoJ1VucmVjb2duaXplZCBub2RlIHR5cGUgb2Ygbm9kZTonLCBub2RlKTtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VJbXBlcmF0aXZlSGFuZGxlLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgU2NoZW1hIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vbm9kZS1yZW5kZXInO1xuaW1wb3J0IGJvb3RVcCwgeyBCb290UmVzdWx0IH0gZnJvbSAnLi9ib290LXVwJztcbmltcG9ydCB0eXBlIHsgUGx1Z2lucywgUmVuZGVyRW5naW5lQ1RYIH0gZnJvbSAnLi90eXBlcyc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIHNjaGVtYTogU2NoZW1hO1xuICBwbHVnaW5zPzogUGx1Z2lucztcbn1cblxuZnVuY3Rpb24gdXNlQm9vdFJlc3VsdChzY2hlbWE6IFNjaGVtYSwgcGx1Z2lucz86IFBsdWdpbnMpOiBCb290UmVzdWx0IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgW3Jlc3VsdCwgc2V0UmVzdWx0XSA9IHVzZVN0YXRlPEJvb3RSZXN1bHQ+KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdW5Nb3VudGluZyA9IGZhbHNlO1xuXG4gICAgYm9vdFVwKHsgc2NoZW1hLCBwbHVnaW5zIH0pXG4gICAgICAudGhlbigoYm9vdFJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAoIXVuTW91bnRpbmcpIHtcbiAgICAgICAgICBzZXRSZXN1bHQoYm9vdFJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2gobG9nZ2VyLmVycm9yKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB1bk1vdW50aW5nID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gU2NoZW1hUmVuZGVyKFxuICB7IHNjaGVtYSwgcGx1Z2lucyB9OiBQcm9wcyxcbiAgcmVmOiBSZWFjdC5SZWY8UmVuZGVyRW5naW5lQ1RYIHwgdW5kZWZpbmVkPixcbik6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCB7IGN0eCwgcm9vdE5vZGUgfSA9IHVzZUJvb3RSZXN1bHQoc2NoZW1hLCBwbHVnaW5zKSB8fCB7fTtcblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKFxuICAgIHJlZixcbiAgICAoKSA9PiB7XG4gICAgICBpZiAoIWN0eCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGFwaVN0YXRlczogY3R4LmFwaVN0YXRlcywgc3RhdGVzOiBjdHguc3RhdGVzLCBoaXN0b3J5OiBjdHguaGlzdG9yeSB9O1xuICAgIH0sXG4gICAgW2N0eF0sXG4gICk7XG5cbiAgaWYgKCFjdHggfHwgIXJvb3ROb2RlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGU6IHJvb3ROb2RlLCBjdHg6IGN0eCB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuZm9yd2FyZFJlZjxSZW5kZXJFbmdpbmVDVFggfCB1bmRlZmluZWQsIFByb3BzPihTY2hlbWFSZW5kZXIpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xuaW1wb3J0IHR5cGUgeyBTY2hlbWEgfSBmcm9tICdAb25lLWZvci1hbGwvc2NoZW1hLXNwZWMnO1xuXG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuL25vZGUtcmVuZGVyJztcbmltcG9ydCBib290VXAgZnJvbSAnLi9ib290LXVwJztcbmltcG9ydCB0eXBlIHsgUGx1Z2lucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJFbmdpbmUge1xuICBwcml2YXRlIHNjaGVtYTogU2NoZW1hO1xuICBwcml2YXRlIHBsdWdpbnM6IFBsdWdpbnM7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHNjaGVtYTogU2NoZW1hLCBwbHVnaW5zPzogUGx1Z2lucykge1xuICAgIHRoaXMuc2NoZW1hID0gc2NoZW1hO1xuICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnMgfHwge307XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVuZGVyKHJlbmRlclJvb3Q6IEVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGN0eCwgcm9vdE5vZGUgfSA9IGF3YWl0IGJvb3RVcCh7XG4gICAgICBwbHVnaW5zOiB0aGlzLnBsdWdpbnMsXG4gICAgICBzY2hlbWE6IHRoaXMuc2NoZW1hLFxuICAgIH0pO1xuXG4gICAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiByb290Tm9kZSwgY3R4IH0pLCByZW5kZXJSb290KTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbIl9fZGVmUHJvcCIsIl9fZGVmUHJvcHMiLCJfX2dldE93blByb3BEZXNjcyIsIl9fZ2V0T3duUHJvcFN5bWJvbHMiLCJfX2hhc093blByb3AiLCJfX3Byb3BJc0VudW0iLCJfX2RlZk5vcm1hbFByb3AiLCJfX3NwcmVhZFZhbHVlcyIsIl9fc3ByZWFkUHJvcHMiLCJtYXAiLCJzaGFyZSIsIkh1YiIsIlN0YXRlc0h1YkFQSSIsIlN0YXRlc0h1YlNoYXJlZCIsIk5vZGVQcm9wc0NhY2hlIiwic2tpcCIsInJlYWN0IiwiUm91dGVQYXRoQ29udGV4dCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUNBLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDOztNQ0QvQyxJQUFJQSxXQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztNQUN0QyxJQUFJQyxZQUFVLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDO01BQ3pDLElBQUlDLG1CQUFpQixHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQztNQUN6RCxJQUFJQyxxQkFBbUIsR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7TUFDdkQsSUFBSUMsY0FBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO01BQ25ELElBQUlDLGNBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLG9CQUFvQixDQUFDO01BQ3pELElBQUlDLGlCQUFlLEdBQUcsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEtBQUssS0FBSyxHQUFHLElBQUksR0FBRyxHQUFHTixXQUFTLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUss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
