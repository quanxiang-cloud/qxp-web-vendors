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

      exports({
        useBootResult: useBootResult,
        useNodeComponent: useNodeComponent
      });

      const PathContext = React.createContext("ROOT");
      var path_context_default = PathContext;

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
      var api_states_default = getAPIStates;

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
      var instantiate_default = instantiate;

      function deserialize(n, ctx) {
        try {
          if (window.structuredClone) {
            return instantiate_default(window.structuredClone(n), ctx);
          }
          return instantiate_default(JSON.parse(JSON.stringify(n)), ctx);
        } catch (error) {
          logger.error("deserialize failed:", error);
          return null;
        }
      }
      var deserialize_default = deserialize;

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
      var response_default = getResponseState$;

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
        const apiState$ = response_default(merge(request$, rawParams$), apiSpecAdapter.responseAdapter);
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
      var init_api_state_default = initAPIState;

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
            acc[stateID] = init_api_state_default(apiID, apiSpecAdapter || dummyAPISpecAdapter);
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
      var shared_states_default = getSharedStates;

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
        const { state$, fetch } = init_api_state_default(apiID, apiSpecAdapter);
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
      var initialize_lazy_shared_states_default = initializeLazyStates;

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
      var node_props_cache_default = Store;

      async function initCTX({ artery, parentCTX, plugins }) {
        const { apiStateSpec, sharedStatesSpec } = artery;
        const _plugins = Object.assign({}, (parentCTX == null ? void 0 : parentCTX.plugins) || {}, plugins || {});
        const statesHubAPI = new Hub$1({
          apiSpecAdapter: _plugins.apiSpecAdapter,
          apiStateSpec: apiStateSpec || {},
          parentHub: parentCTX == null ? void 0 : parentCTX.statesHubAPI
        });
        const instantiateSpec = deserialize_default(sharedStatesSpec || {}, void 0);
        const initializedState = await initialize_lazy_shared_states_default(instantiateSpec || {}, apiStateSpec || {}, _plugins.apiSpecAdapter);
        const statesHubShared = new Hub(initializedState, parentCTX == null ? void 0 : parentCTX.statesHubShared);
        const history = (parentCTX == null ? void 0 : parentCTX.history) || createBrowserHistory();
        const location$ = (parentCTX == null ? void 0 : parentCTX.location$) || new BehaviorSubject(history.location);
        if (!(parentCTX == null ? void 0 : parentCTX.location$)) {
          history.listen(({ location }) => {
            location$.next(location);
          });
        }
        const cacheIDs = parseInheritProperty(artery.node, /* @__PURE__ */ new Set());
        const nodePropsCache = new node_props_cache_default(cacheIDs);
        const ctx = {
          statesHubAPI,
          statesHubShared,
          apiStates: api_states_default(statesHubAPI),
          states: shared_states_default(statesHubShared),
          history,
          location$,
          nodePropsCache,
          plugins: _plugins
        };
        return ctx;
      }
      function deserializeNode(node, ctx) {
        const rootNode = deserialize_default(node, {
          apiStates: ctx.apiStates,
          states: ctx.states,
          history: ctx.history
        });
        if (!rootNode) {
          throw new Error("failed to init ctx!");
        }
        return rootNode;
      }
      async function bootUp({ artery, parentCTX, plugins }) {
        const ctx = await initCTX({ artery, parentCTX, plugins });
        const rootNode = deserializeNode(artery.node, ctx);
        return { ctx, rootNode };
      }
      var boot_up_default = exports('bootUp', bootUp);

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
        const initialDeps = deps$.reduce((acc, dep$, index) => {
          const key = deps[index].depID;
          acc[key] = dep$.value;
          return acc;
        }, {});
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
      var use_api_result_props_default = useAPIResultProps;

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
      var use_api_loading_props_default = useAPILoadingProps;

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
      var use_shared_state_props_default = useSharedStateProps;

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
      var use_shared_state_mutation_default = useSharedStateMutationProps;

      function useInternalHookProps(node, ctx) {
        const parentPath = useContext(path_context_default);
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
      var use_internal_hook_props_default = useInternalHookProps;

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
          return React.createElement(node_render_default, { node, ctx });
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
      var use_render_props_default = useRenderProps;

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
      var use_inherited_props_default = useInheritedProps;

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
      var use_link_props_default = useLinkProps;

      function useInstantiateProps(node, ctx) {
        const currentPath = useContext(path_context_default);
        const constantProps = useConstantProps(node);
        const apiResultProps = use_api_result_props_default(node, ctx);
        const apiLoadingProps = use_api_loading_props_default(node, ctx);
        const sharedStateProps = use_shared_state_props_default(node, ctx);
        const internalHookProps = use_internal_hook_props_default(node, ctx);
        const computedProps = useComputedProps(node, ctx);
        const inheritedProps = use_inherited_props_default(node, ctx);
        const funcProps = useFuncProps(node);
        const sharedStateMutationProps = use_shared_state_mutation_default(node, ctx);
        const apiStateInvokeProps = useAPIInvokeProps(node, ctx);
        const renderProps = use_render_props_default(node, ctx);
        const linkProps = use_link_props_default(node, ctx);
        return useMemo(() => {
          var _a;
          const instantiateProps = Object.assign(constantProps, apiStateInvokeProps, apiResultProps, apiLoadingProps, sharedStateProps, computedProps, sharedStateMutationProps, internalHookProps, renderProps, linkProps, inheritedProps);
          (_a = ctx.nodePropsCache) == null ? void 0 : _a.setProps(currentPath, node.id, instantiateProps);
          return Object.assign(instantiateProps, funcProps);
        }, [apiResultProps, sharedStateProps, apiLoadingProps, computedProps, constantProps]);
      }
      var use_instantiate_props_default = exports('useInstantiateProps', useInstantiateProps);

      function useLifecycleHook({ didMount, willUnmount }) {
        useEffect(() => {
          didMount == null ? void 0 : didMount();
          return () => {
            willUnmount == null ? void 0 : willUnmount();
          };
        }, []);
      }
      function useRefResult({ arteryID, refLoader, orphan }, parentCTX) {
        const [result, setResult] = useState();
        const currentPath = useContext(path_context_default);
        useEffect(() => {
          if (!arteryID) {
            logger.error(`arteryID is required on RefNode, please check the spec for node: ${currentPath}`);
            return;
          }
          if (!refLoader) {
            logger.error("refLoader is required on RefNode in order to get ref schema and corresponding APISpecAdapter,", "please implement refLoader and pass it to parent RenderEngine.", `current RefNode path is: ${currentPath}`);
            return;
          }
          let unMounting = false;
          let _schema;
          refLoader(arteryID).then(({ artery, plugins }) => {
            if (unMounting) {
              return;
            }
            _schema = artery;
            return boot_up_default({
              plugins,
              artery,
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
        const { shouldRender } = use_instantiate_props_default(placeholderNode, ctx);
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
        const props = use_instantiate_props_default(node, ctx);
        useLifecycleHook(node.lifecycleHooks || {});
        const currentPath = useContext(path_context_default);
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
      var jsx_node_render_default = JSXNodeRender;

      function RefNodeRender({ node, ctx }) {
        useLifecycleHook(node.lifecycleHooks || {});
        const result = useRefResult({ arteryID: node.arteryID, refLoader: ctx.plugins.refLoader, orphan: node.orphan }, ctx);
        if (!result) {
          if (node.fallback) {
            return React.createElement(node_render_default, { node: node.fallback, ctx });
          }
          return null;
        }
        return React.createElement(node_render_default, { node: result.rootNode, ctx: result.ctx });
      }

      function HTMLNodeRender({ node, ctx }) {
        const props = use_instantiate_props_default(node, ctx);
        useLifecycleHook(node.lifecycleHooks || {});
        const currentPath = useContext(path_context_default);
        if (!node.name) {
          logger.error("name property is required in html node spec,", `please check the spec of node: ${currentPath}.`);
          return null;
        }
        if (!node.children || !node.children.length) {
          return React.createElement(node.name, props);
        }
        return React.createElement(node.name, props, React.createElement(ChildrenRender, { nodes: node.children || [], ctx }));
      }
      var html_node_render_default = HTMLNodeRender;

      function useIterable(iterableState, ctx) {
        const currentPath = useContext(path_context_default);
        const dummyNode = {
          type: "html-element",
          id: "dummyLoopContainer",
          name: "div",
          props: { iterable: iterableState }
        };
        const { iterable } = use_instantiate_props_default(dummyNode, ctx);
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
        const currentPath = useContext(path_context_default);
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
        const currentPath = useContext(path_context_default);
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
        const parentPath = useContext(path_context_default);
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
          return React.createElement(path_context_default.Provider, { value: `${parentPath}/${index}`, key }, React.createElement(node_render_default, { key, node: newNode, ctx }));
        }));
      }
      var loop_individual_default = LoopIndividual;

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
        const currentPath = useContext(path_context_default);
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
        const props = use_instantiate_props_default(outLayer, ctx);
        return React.createElement(outLayer.name, props, children);
      }
      function ReactComponentOutLayerRender({
        outLayer,
        ctx,
        children
      }) {
        const props = use_instantiate_props_default(outLayer, ctx);
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
        return React.createElement(node_render_default, { node: _node, ctx });
      }
      function LoopComposed({ iterableState, loopKey, node, ctx }) {
        const parentPath = useContext(path_context_default);
        const iterable = useIterable(iterableState, ctx);
        if (!iterable) {
          return null;
        }
        return React.createElement(React.Fragment, null, iterable.map((composedState, index) => {
          const key = getAppropriateKey(composedState, loopKey, index);
          return React.createElement(path_context_default.Provider, { value: `${parentPath}/${node.id}/${index}`, key: index }, React.createElement(OutLayerRender, { key, outLayer: node.outLayer, ctx }, (node.nodes || node.children).map((composedChild, index2) => {
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
      var loop_composed_default = LoopComposed;

      function LoopNodeRender({ node, ctx }) {
        useLifecycleHook(node.lifecycleHooks || {});
        const { node: LoopedNode } = node;
        if (LoopedNode.type !== "composed-node" && "toProps" in node) {
          return React.createElement(loop_individual_default, {
            iterableState: node.iterableState,
            loopKey: node.loopKey,
            node: LoopedNode,
            toProps: (v) => node.toProps(v),
            ctx
          });
        }
        if (LoopedNode.type === "composed-node") {
          return React.createElement(loop_composed_default, {
            iterableState: node.iterableState,
            loopKey: node.loopKey,
            node: LoopedNode,
            ctx
          });
        }
        logger.error("Unrecognized loop node:", node);
        return null;
      }
      var loop_node_render_default = LoopNodeRender;

      const RouteContext = React.createContext("/");
      var route_path_context_default = RouteContext;

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
      var use_match_default = useMatch;

      function buildCurrentPath(parentPath, routePath) {
        if (parentPath === "/") {
          return `/${trimSlash(routePath)}`;
        }
        return `${parentPath}/${trimSlash(routePath)}`;
      }
      function RouteNodeRender({ node, ctx }) {
        var _a;
        useLifecycleHook(node.lifecycleHooks || {});
        const parentRoutePath = useContext(route_path_context_default);
        const currentRoutePath = buildCurrentPath(parentRoutePath, node.path);
        const match = use_match_default(ctx.location$, currentRoutePath, (_a = node.exactly) != null ? _a : false);
        if (match) {
          return React.createElement(route_path_context_default.Provider, { value: currentRoutePath }, React.createElement(node_render_default, { node: node.node, ctx }));
        }
        return null;
      }
      var route_node_render_default = RouteNodeRender;

      function ReactComponentNodeRender({ node, ctx }) {
        const props = use_instantiate_props_default(node, ctx);
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
      var react_component_node_render_default = ReactComponentNodeRender;

      function ChildrenRender({ nodes, ctx }) {
        if (!nodes.length) {
          return null;
        }
        return React.createElement(React.Fragment, null, nodes.map((node) => React.createElement(NodeRender, { key: node.id, node, ctx })));
      }
      function NodeRender({ node, ctx }) {
        const parentPath = useContext(path_context_default);
        const currentPath = `${parentPath}/${node.id}`;
        const shouldRender = useShouldRender(node, ctx);
        if (!shouldRender) {
          return null;
        }
        if (node.type === "route-node") {
          return React.createElement(path_context_default.Provider, { value: currentPath }, React.createElement(route_node_render_default, { node, ctx }));
        }
        if (node.type === "loop-container") {
          return React.createElement(path_context_default.Provider, { value: currentPath }, React.createElement(loop_node_render_default, { node, ctx }));
        }
        if (node.type === "html-element") {
          return React.createElement(path_context_default.Provider, { value: currentPath }, React.createElement(html_node_render_default, { node, ctx }));
        }
        if (node.type === "react-component") {
          return React.createElement(path_context_default.Provider, { value: currentPath }, React.createElement(react_component_node_render_default, { node, ctx }));
        }
        if (node.type === "ref-node") {
          return React.createElement(path_context_default.Provider, { value: currentPath }, React.createElement(RefNodeRender, { node, ctx }));
        }
        if (node.type === "jsx-node") {
          return React.createElement(path_context_default.Provider, { value: currentPath }, React.createElement(jsx_node_render_default, { node, ctx }));
        }
        logger.error("Unrecognized node type of node:", node);
        return null;
      }
      var node_render_default = NodeRender;

      function useBootResult(artery, plugins) {
        const [result, setResult] = useState();
        useEffect(() => {
          let unMounting = false;
          boot_up_default({ artery, plugins }).then((bootResult) => {
            if (!unMounting) {
              setResult(bootResult);
            }
          }).catch(logger.error);
          return () => {
            unMounting = true;
          };
        }, [artery]);
        return result;
      }

      function SchemaRender({ artery, plugins }, ref) {
        const { ctx, rootNode } = useBootResult(artery, plugins) || {};
        useImperativeHandle(ref, () => {
          if (!ctx) {
            return;
          }
          return { apiStates: ctx.apiStates, states: ctx.states, history: ctx.history };
        }, [ctx]);
        if (!ctx || !rootNode) {
          return null;
        }
        return React.createElement(node_render_default, { node: rootNode, ctx });
      }
      var artery_renderer_default = exports('ArteryRenderer', React.forwardRef(SchemaRender));

      class RenderArtery {
        constructor(artery, plugins) {
          this.artery = artery;
          this.plugins = plugins || {};
        }
        async render(renderRoot) {
          const { ctx, rootNode } = await boot_up_default({
            plugins: this.plugins,
            artery: this.artery
          });
          ReactDOM.render(React.createElement(node_render_default, { node: rootNode, ctx }), renderRoot);
        }
      } exports('RenderArtery', RenderArtery);

      var src_default = exports('default', RenderArtery);

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9wYXRoLWNvbnRleHQudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9hcGktc3RhdGVzLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvZGVzZXJpYWxpemUvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9kZXNlcmlhbGl6ZS9pbnN0YW50aWF0ZS50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2Rlc2VyaWFsaXplL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaHR0cC9odHRwLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaHR0cC9yZXNwb25zZS50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2luaXQtYXBpLXN0YXRlLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvc3RhdGVzLWh1Yi1hcGkudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9zaGFyZWQtc3RhdGVzLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvc3RhdGVzLWh1Yi1zaGFyZWQudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9pbml0aWFsaXplLWxhenktc2hhcmVkLXN0YXRlcy50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2Rlc2VyaWFsaXplL3BhcnNlLWluaGVyaXQtcHJvcGVydHkudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9ub2RlLXByb3BzLWNhY2hlLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1jb25zdGFudC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1hcGktcmVzdWx0LXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtYXBpLWxvYWRpbmctcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1hcGktaW52b2tlLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2Utc2hhcmVkLXN0YXRlLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtZnVuYy1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLXNoYXJlZC1zdGF0ZS1tdXRhdGlvbi50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWludGVybmFsLWhvb2stcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1yZW5kZXItcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1jb21wdXRlZC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWluaGVyaXRlZC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWxpbmstcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2hvb2tzL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2pzeC1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yZWYtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaHRtbC1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9sb29wLW5vZGUtcmVuZGVyL2hlbHBlcnMudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9sb29wLWluZGl2aWR1YWwudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaG9va3MvaGVscGVyLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9sb29wLW5vZGUtcmVuZGVyL291dC1sYXllci1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9sb29wLWNvbXBvc2VkLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2xvb3Atbm9kZS1yZW5kZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvcm91dGUtbm9kZS1yZW5kZXIvcm91dGUtcGF0aC1jb250ZXh0LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL3JvdXRlLW5vZGUtcmVuZGVyL3V0aWxzLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL3JvdXRlLW5vZGUtcmVuZGVyL3VzZS1tYXRjaC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yb3V0ZS1ub2RlLXJlbmRlci9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yZWFjdC1jb21wb25lbnQtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC91c2UtYm9vdC11cC1yZXN1bHQudHMiLCIuLi8uLi8uLi9zcmMvYXJ0ZXJ5LXJlbmRlcmVyLnRzIiwiLi4vLi4vLi4vc3JjL3JlbmRlci1hcnRlcnkudHMiLCIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgUGF0aENvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0PHN0cmluZz4oJ1JPT1QnKTtcblxuZXhwb3J0IGRlZmF1bHQgUGF0aENvbnRleHQ7XG4iLCJpbXBvcnQgeyBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IEFQSUZldGNoQ2FsbGJhY2sgfSBmcm9tICcuLic7XG5pbXBvcnQgeyBBUElTdGF0ZVdpdGhGZXRjaCwgQVBJU3RhdGUsIFN0YXRlc0h1YkFQSSwgUmF3RmV0Y2hPcHRpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGdldEFQSVN0YXRlcyhzdGF0ZXNIdWJBUEk6IFN0YXRlc0h1YkFQSSk6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIEFQSVN0YXRlV2l0aEZldGNoPj4ge1xuICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgQVBJU3RhdGU+Pj4gPSB7XG4gICAgZ2V0OiAodGFyZ2V0OiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBBUElTdGF0ZT4+LCBwOiBzdHJpbmcpOiBBUElTdGF0ZVdpdGhGZXRjaCA9PiB7XG4gICAgICBjb25zdCBhcGlTdGF0ZSA9IHN0YXRlc0h1YkFQSS5nZXRTdGF0ZSQocCkuZ2V0VmFsdWUoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYXBpU3RhdGUsXG4gICAgICAgIHJlZnJlc2g6ICgpID0+IHN0YXRlc0h1YkFQSS5yZWZyZXNoKHApLFxuICAgICAgICBmZXRjaDogKGZldGNoUGFyYW1zOiBGZXRjaFBhcmFtcywgY2FsbGJhY2s/OiBBUElGZXRjaENhbGxiYWNrKTogdm9pZCA9PiB7XG4gICAgICAgICAgc3RhdGVzSHViQVBJLmZldGNoKHAsIHsgcGFyYW1zOiBmZXRjaFBhcmFtcywgY2FsbGJhY2sgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJhd0ZldGNoOiAocmF3RmV0Y2hPcHRpb246IFJhd0ZldGNoT3B0aW9uLCBjYWxsYmFjaz86IEFQSUZldGNoQ2FsbGJhY2sgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgICAgICBzdGF0ZXNIdWJBUEkucmF3RmV0Y2gocCwgcmF3RmV0Y2hPcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIG5ldyBQcm94eTxSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBBUElTdGF0ZVdpdGhGZXRjaD4+Pih7fSwgaGFuZGxlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFQSVN0YXRlcztcbiIsImltcG9ydCB0eXBlICogYXMgQXJ0ZXJ5U3BlYyBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuaW1wb3J0IHsgVmVyc2F0aWxlRnVuYywgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChuOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jU3BlYyhuOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICghaXNPYmplY3QobikgfHwgdHlwZW9mIG4gIT09ICdvYmplY3QnIHx8IG4gPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoJ3R5cGUnIGluIG4gJiYgUmVmbGVjdC5nZXQobiwgJ3R5cGUnKSA9PT0gJ3N0YXRlX2NvbnZlcnRfZXhwcmVzc2lvbicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhuKS5sZW5ndGggPT09IDMgJiYgJ3R5cGUnIGluIG4gJiYgJ2FyZ3MnIGluIG4gJiYgJ2JvZHknIGluIG4pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaW5zdGFudGlhdGVTdGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCBjdHg6IHVua25vd24pOiBTdGF0ZUNvbnZlcnRvciB7XG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3N0YXRlJywgYHJldHVybiAke2V4cHJlc3Npb259YCkuYmluZChjdHgpO1xuICAgIGZuLnRvU3RyaW5nID0gKCkgPT5cbiAgICAgIFsnJywgJ2Z1bmN0aW9uIHdyYXBwZWRTdGF0ZUNvbnZlcnRvcihzdGF0ZSkgeycsIGBcXHRyZXR1cm4gJHtleHByZXNzaW9ufWAsICd9J10uam9pbignXFxuJyk7XG5cbiAgICByZXR1cm4gZm47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgWydmYWlsZWQgdG8gaW5zdGFudGlhdGUgc3RhdGUgY29udmVydCBleHByZXNzaW9uOicsICdcXG4nLCBleHByZXNzaW9uLCAnXFxuJywgZXJyb3JdLmpvaW4oJycpLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlRnVuY1NwZWMoXG4gIHNwZWM6IEFydGVyeVNwZWMuQmFzZUZ1bmN0aW9uU3BlYyB8IEFydGVyeVNwZWMuU3RhdGVDb252ZXJ0RXhwcmVzc2lvbixcbiAgY3R4OiB1bmtub3duLFxuKTogVmVyc2F0aWxlRnVuYyB7XG4gIGlmICgnZXhwcmVzc2lvbicgaW4gc3BlYyAmJiBzcGVjLnR5cGUgPT09ICdzdGF0ZV9jb252ZXJ0X2V4cHJlc3Npb24nKSB7XG4gICAgcmV0dXJuIGluc3RhbnRpYXRlU3RhdGVFeHByZXNzaW9uKHNwZWMuZXhwcmVzc2lvbiwgY3R4KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oc3BlYy5hcmdzLCBzcGVjLmJvZHkpLmJpbmQoY3R4KTtcbiAgICBmbi50b1N0cmluZyA9ICgpID0+IFsnJywgYGZ1bmN0aW9uIHdyYXBwZWRGdW5jKCR7c3BlYy5hcmdzfSkge2AsIGBcXHQke3NwZWMuYm9keX1gLCAnfScsICcnXS5qb2luKCdcXG4nKTtcbiAgICByZXR1cm4gZm47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgW1xuICAgICAgICAnZmFpbGVkIHRvIGluc3RhbnRpYXRlIGZ1bmN0aW9uIG9mIGZvbGxvd2luZyBzcGVjOicsXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnc3BlYy5hcmdzOicsXG4gICAgICAgIHNwZWMuYXJncyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgICdzcGVjLmJvZHk6JyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIHNwZWMuYm9keSxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIGVycm9yLFxuICAgICAgXS5qb2luKCcnKSxcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpbnN0YW50aWF0ZUZ1bmNTcGVjLCBpc09iamVjdCwgaXNGdW5jU3BlYyB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBpbnN0YW50aWF0ZShuOiB1bmtub3duLCBjdHg6IHVua25vd24pOiB1bmtub3duIHtcbiAgaWYgKCFpc09iamVjdChuKSB8fCB0eXBlb2YgbiAhPT0gJ29iamVjdCcgfHwgbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBuO1xuICB9XG5cbiAgT2JqZWN0LmVudHJpZXMobikuZm9yRWFjaCgoW2tleSwgdl0pID0+IHtcbiAgICBpZiAoaXNGdW5jU3BlYyh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQobiwga2V5LCBpbnN0YW50aWF0ZUZ1bmNTcGVjKHYsIGN0eCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc09iamVjdCh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQobiwga2V5LCBpbnN0YW50aWF0ZSh2LCBjdHgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQoXG4gICAgICAgIG4sXG4gICAgICAgIGtleSxcbiAgICAgICAgdi5tYXAoKF92KSA9PiBpbnN0YW50aWF0ZShfdiwgY3R4KSksXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluc3RhbnRpYXRlO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB7IEFydGVyeVJlbmRlcmVyQ1RYIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5pbXBvcnQgaW5zdGFudGlhdGUgZnJvbSAnLi9pbnN0YW50aWF0ZSc7XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplKG46IHVua25vd24sIGN0eDogQXJ0ZXJ5UmVuZGVyZXJDVFggfCB1bmRlZmluZWQpOiB1bmtub3duIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgaWYgKHdpbmRvdy5zdHJ1Y3R1cmVkQ2xvbmUpIHtcbiAgICAgIHJldHVybiBpbnN0YW50aWF0ZSh3aW5kb3cuc3RydWN0dXJlZENsb25lKG4pLCBjdHgpO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW50aWF0ZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG4pKSwgY3R4KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ2Rlc2VyaWFsaXplIGZhaWxlZDonLCBlcnJvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVzZXJpYWxpemU7XG4iLCJpbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAsIE9ic2VydmFibGUsIG9mLCBzaGFyZSwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBhamF4LCBBamF4Q29uZmlnLCBBamF4UmVzcG9uc2UgfSBmcm9tICdyeGpzL2FqYXgnO1xuXG5pbXBvcnQgdHlwZSB7IEFQSVN0YXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG50eXBlIFJlc3BvbnNlID0gT21pdDxBUElTdGF0ZSwgJ2xvYWRpbmcnPjtcbnR5cGUgUmVzcG9uc2UkID0gT2JzZXJ2YWJsZTxSZXNwb25zZT47XG5cbi8vIHRvZG8gc3VwcG9ydCByZXRyeSBhbmQgdGltZW91dFxuZnVuY3Rpb24gc2VuZFJlcXVlc3QoYWpheFJlcXVlc3Q6IEFqYXhDb25maWcpOiBSZXNwb25zZSQge1xuICByZXR1cm4gYWpheChhamF4UmVxdWVzdCkucGlwZShcbiAgICBtYXA8QWpheFJlc3BvbnNlPHVua25vd24+LCBSZXNwb25zZT4oKHsgcmVzcG9uc2UgfSkgPT4gKHsgcmVzdWx0OiByZXNwb25zZSwgZXJyb3I6IHVuZGVmaW5lZCB9KSksXG4gICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiBvZih7IGVycm9yOiBlcnJvciwgZGF0YTogdW5kZWZpbmVkIH0pO1xuICAgIH0pLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBodHRwKHJlcXVlc3QkOiBPYnNlcnZhYmxlPEFqYXhDb25maWc+KTogUmVzcG9uc2UkIHtcbiAgY29uc3QgcmVzcG9uc2UkOiBSZXNwb25zZSQgPSByZXF1ZXN0JC5waXBlKHN3aXRjaE1hcChzZW5kUmVxdWVzdCksIHNoYXJlKCkpO1xuXG4gIHJldHVybiByZXNwb25zZSQ7XG59XG4iLCJpbXBvcnQgeyBSZXNwb25zZUFkYXB0ZXIgfSBmcm9tICdAb25lLWZvci1hbGwvYXBpLXNwZWMtYWRhcHRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEFqYXhDb25maWcgfSBmcm9tICdyeGpzL2FqYXgnO1xuaW1wb3J0IHsgbWFwLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB0eXBlIHsgQVBJU3RhdGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmltcG9ydCBodHRwIGZyb20gJy4vaHR0cCc7XG5cbi8vIEFQSSBTdGF0ZSBUYWJsZVxuLypcbiAgICB8ICAgICB8IGxvYWRpbmcgfCAgIGRhdGEgICAgfCAgIGVycm9yICAgfFxuICAgIHwgLS0tIHwgOi0tLS0tOiB8IDotLS0tLS0tOiB8IDotLS0tLS0tOiB8XG4gICAgfCAxICAgfCAgZmFsc2UgIHwgdW5kZWZpbmVkIHwgdW5kZWZpbmVkIHxcbiAgICB8IDIgICB8ICB0cnVlICAgfCB1bmRlZmluZWQgfCB1bmRlZmluZWQgfFxu4pSM4pSA4pSA4pa6fCAzICAgfCAgZmFsc2UgIHwgICAge30gICAgIHwgdW5kZWZpbmVkIHzil4TilIDilIDilIDilIDilJBcbuKUlOKUgOKUgOKUgHwgNCAgIHwgIHRydWUgICB8ICAgIHt9ICAgICB8IHVuZGVmaW5lZCB8ICAgICDilIJcbiAgICB8IDUgICB8ICBmYWxzZSAgfCB1bmRlZmluZWQgfCAgICB4eHggICAgfCAgICAg4pSCXG4gICAgfCA2ICAgfCAgdHJ1ZSAgIHwgdW5kZWZpbmVkIHwgICAgeHh4ICAgIHzilIDilIDilIDilIDilIDilJhcbiovXG5leHBvcnQgY29uc3QgaW5pdGlhbFN0YXRlOiBBUElTdGF0ZSA9IHsgcmVzdWx0OiB1bmRlZmluZWQsIGVycm9yOiB1bmRlZmluZWQsIGxvYWRpbmc6IGZhbHNlIH07XG5cbmZ1bmN0aW9uIGdldFJlc3BvbnNlU3RhdGUkKFxuICByZXF1ZXN0JDogT2JzZXJ2YWJsZTxBamF4Q29uZmlnPixcbiAgcmVzcG9uc2VBZGFwdGVyPzogUmVzcG9uc2VBZGFwdGVyLFxuKTogQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPiB7XG4gIGNvbnN0IHN0YXRlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QVBJU3RhdGU+KGluaXRpYWxTdGF0ZSk7XG4gIGNvbnN0IHJlc3BvbnNlJCA9IGh0dHAocmVxdWVzdCQpO1xuXG4gIHJlc3BvbnNlJFxuICAgIC5waXBlKFxuICAgICAgbWFwKCh7IHJlc3VsdCwgZXJyb3IgfSkgPT4gKHsgcmVzdWx0LCBlcnJvciwgbG9hZGluZzogZmFsc2UgfSkpLFxuICAgICAgbWFwPEFQSVN0YXRlLCBBUElTdGF0ZT4oKGFwaVN0YXRlKSA9PiB7XG4gICAgICAgIGlmICghcmVzcG9uc2VBZGFwdGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGFwaVN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWQgPSByZXNwb25zZUFkYXB0ZXIoeyBib2R5OiBhcGlTdGF0ZS5yZXN1bHQsIGVycm9yOiBhcGlTdGF0ZS5lcnJvciB9KTtcblxuICAgICAgICByZXR1cm4geyAuLi50cmFuc2Zvcm1lZCwgbG9hZGluZzogYXBpU3RhdGUubG9hZGluZyB9O1xuICAgICAgfSksXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoc3RhdGUkKTtcblxuICByZXF1ZXN0JFxuICAgIC5waXBlKFxuICAgICAgZmlsdGVyKCgpID0+IHN0YXRlJC5nZXRWYWx1ZSgpLmxvYWRpbmcgPT09IGZhbHNlKSxcbiAgICAgIG1hcCgoKSA9PiAoeyAuLi5zdGF0ZSQuZ2V0VmFsdWUoKSwgbG9hZGluZzogdHJ1ZSB9KSksXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoc3RhdGUkKTtcblxuICByZXR1cm4gc3RhdGUkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSZXNwb25zZVN0YXRlJDtcbiIsImltcG9ydCB7IG1lcmdlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBamF4Q29uZmlnIH0gZnJvbSAncnhqcy9hamF4JztcbmltcG9ydCB7IG1hcCwgZmlsdGVyLCBzaGFyZSwgc2tpcCwgZGVsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgdHlwZSB7IEFQSVNwZWNBZGFwdGVyLCBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcblxuaW1wb3J0IHR5cGUgeyBGZXRjaE9wdGlvbiwgQVBJU3RhdGUkV2l0aEFjdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgZ2V0UmVzcG9uc2VTdGF0ZSQgZnJvbSAnLi9odHRwL3Jlc3BvbnNlJztcblxuZnVuY3Rpb24gaW5pdEFQSVN0YXRlKGFwaUlEOiBzdHJpbmcsIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcik6IEFQSVN0YXRlJFdpdGhBY3Rpb25zIHtcbiAgY29uc3QgcmF3UGFyYW1zJCA9IG5ldyBTdWJqZWN0PEFqYXhDb25maWc+KCk7XG4gIGNvbnN0IHBhcmFtcyQgPSBuZXcgU3ViamVjdDxGZXRjaFBhcmFtcyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgcmVxdWVzdCQgPSBwYXJhbXMkLnBpcGUoXG4gICAgLy8gaXQgaXMgYWRhcHRlcidzIHJlc3BvbnNpYmlsaXR5IHRvIGhhbmRsZSBidWlsZCBlcnJvclxuICAgIC8vIGlmIGEgZXJyb3Igb2NjdXJyZWQsIGJ1aWxkIHNob3VsZCByZXR1cm4gdW5kZWZpbmVkXG4gICAgbWFwKChwYXJhbXMpID0+IGFwaVNwZWNBZGFwdGVyLmJ1aWxkKGFwaUlELCBwYXJhbXMpKSxcbiAgICBmaWx0ZXIoQm9vbGVhbiksXG4gICAgc2hhcmUoKSxcbiAgKTtcblxuICBsZXQgX2xhdGVzdEZldGNoT3B0aW9uOiBGZXRjaE9wdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgY29uc3QgYXBpU3RhdGUkID0gZ2V0UmVzcG9uc2VTdGF0ZSQobWVyZ2UocmVxdWVzdCQsIHJhd1BhcmFtcyQpLCBhcGlTcGVjQWRhcHRlci5yZXNwb25zZUFkYXB0ZXIpO1xuXG4gIC8vIGV4ZWN1dGUgZmV0Y2ggY2FsbGJhY2sgYWZ0ZXIgbmV3IGByZXN1bHRgIGVtaXR0ZWQgZnJvbSBhcGlTdGF0ZSRcbiAgYXBpU3RhdGUkXG4gICAgLnBpcGUoXG4gICAgICBza2lwKDEpLFxuICAgICAgZmlsdGVyKCh7IGxvYWRpbmcgfSkgPT4gIWxvYWRpbmcpLFxuICAgICAgLy8gYmVjYXVzZSB0aGlzIHN1YnNjcmlwdGlvbiBpcyBoYXBwZW5lZCBiZWZvcmUgdGhhbiB2aWV3J3MsXG4gICAgICAvLyBzbyBkZWxheSBgY2FsbGJhY2tgIGV4ZWN1dGlvbiB0byBuZXh0IGZyYW1lLlxuICAgICAgZGVsYXkoMTApLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgX2xhdGVzdEZldGNoT3B0aW9uPy5jYWxsYmFjaz8uKHN0YXRlKTtcbiAgICB9KTtcblxuICByZXR1cm4ge1xuICAgIHN0YXRlJDogYXBpU3RhdGUkLFxuICAgIGZldGNoOiAoZmV0Y2hPcHRpb246IEZldGNoT3B0aW9uKSA9PiB7XG4gICAgICBfbGF0ZXN0RmV0Y2hPcHRpb24gPSBmZXRjaE9wdGlvbjtcblxuICAgICAgcGFyYW1zJC5uZXh0KGZldGNoT3B0aW9uLnBhcmFtcyk7XG4gICAgfSxcbiAgICByYXdGZXRjaDogKHsgY2FsbGJhY2ssIC4uLmFqYXhDb25maWcgfSkgPT4ge1xuICAgICAgLy8gdG9kbyBmaXggdGhpc1xuICAgICAgX2xhdGVzdEZldGNoT3B0aW9uID0geyBjYWxsYmFjayB9O1xuXG4gICAgICByYXdQYXJhbXMkLm5leHQoYWpheENvbmZpZyk7XG4gICAgfSxcbiAgICByZWZyZXNoOiAoKSA9PiB7XG4gICAgICBpZiAoIV9sYXRlc3RGZXRjaE9wdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBvdmVycmlkZSBvblN1Y2Nlc3MgYW5kIG9uRXJyb3IgdG8gdW5kZWZpbmVkXG4gICAgICBfbGF0ZXN0RmV0Y2hPcHRpb24gPSB7IHBhcmFtczogX2xhdGVzdEZldGNoT3B0aW9uLnBhcmFtcyB9O1xuICAgICAgcGFyYW1zJC5uZXh0KF9sYXRlc3RGZXRjaE9wdGlvbi5wYXJhbXMpO1xuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRBUElTdGF0ZTtcbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgbm9vcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUgeyBBUElTcGVjQWRhcHRlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB0eXBlIHsgU3RhdGVzSHViQVBJLCBBUElTdGF0ZSwgQVBJU3RhdGVzU3BlYywgRmV0Y2hPcHRpb24sIEFQSVN0YXRlJFdpdGhBY3Rpb25zLCBSYXdGZXRjaE9wdGlvbiwgQVBJRmV0Y2hDYWxsYmFjayB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGluaXRpYWxTdGF0ZSB9IGZyb20gJy4vaHR0cC9yZXNwb25zZSc7XG5pbXBvcnQgaW5pdEFQSVN0YXRlIGZyb20gJy4vaW5pdC1hcGktc3RhdGUnO1xuXG50eXBlIENhY2hlID0gUmVjb3JkPHN0cmluZywgQVBJU3RhdGUkV2l0aEFjdGlvbnM+O1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBhcGlTcGVjQWRhcHRlcj86IEFQSVNwZWNBZGFwdGVyO1xuICBhcGlTdGF0ZVNwZWM6IEFQSVN0YXRlc1NwZWM7XG4gIHBhcmVudEh1Yj86IFN0YXRlc0h1YkFQSTtcbn1cblxuY29uc3QgZHVtbXlTdGF0ZSRXaXRoQWN0aW9uOiBBUElTdGF0ZSRXaXRoQWN0aW9ucyA9IHtcbiAgc3RhdGUkOiBuZXcgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPihpbml0aWFsU3RhdGUpLFxuICBmZXRjaDogbm9vcCxcbiAgcmF3RmV0Y2g6IG5vb3AsXG4gIHJlZnJlc2g6IG5vb3AsXG59O1xuXG5jb25zdCBkdW1teUFQSVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlciA9IHtcbiAgYnVpbGQ6ICgpID0+ICh7IHVybDogJy9hcGknLCBtZXRob2Q6ICdnZXQnIH0pLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHViIGltcGxlbWVudHMgU3RhdGVzSHViQVBJIHtcbiAgcHVibGljIGNhY2hlOiBDYWNoZTtcbiAgcHVibGljIHBhcmVudEh1Yj86IFN0YXRlc0h1YkFQSSA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoeyBhcGlTdGF0ZVNwZWMsIGFwaVNwZWNBZGFwdGVyLCBwYXJlbnRIdWIgfTogUHJvcHMpIHtcbiAgICB0aGlzLnBhcmVudEh1YiA9IHBhcmVudEh1YjtcblxuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuZW50cmllcyhhcGlTdGF0ZVNwZWMpLnJlZHVjZTxDYWNoZT4oKGFjYywgW3N0YXRlSUQsIHsgYXBpSUQgfV0pID0+IHtcbiAgICAgIGFjY1tzdGF0ZUlEXSA9IGluaXRBUElTdGF0ZShhcGlJRCwgYXBpU3BlY0FkYXB0ZXIgfHwgZHVtbXlBUElTcGVjQWRhcHRlcik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAhIXRoaXMucGFyZW50SHViPy5oYXNTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZmluZFN0YXRlJChzdGF0ZUlEOiBzdHJpbmcpOiBBUElTdGF0ZSRXaXRoQWN0aW9ucyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW3N0YXRlSURdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcmVudEh1Yj8uZmluZFN0YXRlJChzdGF0ZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPiB7XG4gICAgY29uc3QgeyBzdGF0ZSQgfSA9IHRoaXMuZmluZFN0YXRlJChzdGF0ZUlEKSB8fCB7fTtcbiAgICBpZiAoc3RhdGUkKSB7XG4gICAgICByZXR1cm4gc3RhdGUkO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEuYCxcbiAgICAgICAgJ0luIG9yZGVyIHRvIHByZXZlbnQgVUkgY3Jhc2gsIGEgZHVtbXlTdGF0ZSQgd2lsbCBiZSByZXR1cm5lZC4nLFxuICAgICAgXS5qb2luKCcgJyksXG4gICAgKTtcblxuICAgIHJldHVybiBkdW1teVN0YXRlJFdpdGhBY3Rpb24uc3RhdGUkO1xuICB9XG5cbiAgcHVibGljIGZldGNoKHN0YXRlSUQ6IHN0cmluZywgZmV0Y2hPcHRpb246IEZldGNoT3B0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgeyBmZXRjaCB9ID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpIHx8IHt9O1xuICAgIGlmIChmZXRjaCkge1xuICAgICAgZmV0Y2goZmV0Y2hPcHRpb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEsYCxcbiAgICAgICAgJ3RoaXMgZmV0Y2ggYWN0aW9uIHdpbGwgYmUgaWdub3JlZC4nLFxuICAgICAgXS5qb2luKCcgJyksXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByYXdGZXRjaChzdGF0ZUlEOiBzdHJpbmcsIHJhd0ZldGNoT3B0aW9uOiBSYXdGZXRjaE9wdGlvbiAmIHsgY2FsbGJhY2s/OiBBUElGZXRjaENhbGxiYWNrOyB9KTogdm9pZCB7XG4gICAgY29uc3QgeyByYXdGZXRjaCB9ID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpIHx8IHt9O1xuICAgIGlmIChyYXdGZXRjaCkge1xuICAgICAgcmF3RmV0Y2gocmF3RmV0Y2hPcHRpb24pO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEsYCxcbiAgICAgICAgJ3RoaXMgZmV0Y2ggYWN0aW9uIHdpbGwgYmUgaWdub3JlZC4nLFxuICAgICAgXS5qb2luKCcgJyksXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZWZyZXNoKHN0YXRlSUQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHsgcmVmcmVzaCB9ID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpIHx8IHt9O1xuICAgIGlmIChyZWZyZXNoKSB7XG4gICAgICByZWZyZXNoKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgW1xuICAgICAgICBgY2FuJ3QgZmluZCBhcGkgc3RhdGU6ICR7c3RhdGVJRH0sIHBsZWFzZSBjaGVjayBhcGlTdGF0ZVNwZWMgb3IgcGFyZW50IHNjaGVtYSxgLFxuICAgICAgICAndGhpcyByZWZyZXNoIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQuJyxcbiAgICAgIF0uam9pbignICcpLFxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgU2hhcmVkU3RhdGVIdWIgZnJvbSAnLi9zdGF0ZXMtaHViLXNoYXJlZCc7XG5cbmZ1bmN0aW9uIGdldFNoYXJlZFN0YXRlcyhzdGF0ZXNIdWJTaGFyZWQ6IFNoYXJlZFN0YXRlSHViKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PiA9IHtcbiAgICBnZXQ6ICh0YXJnZXQ6IFByb3h5SGFuZGxlcjxSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4+LCBwOiBzdHJpbmcpOiB1bmtub3duID0+IHtcbiAgICAgIHJldHVybiBzdGF0ZXNIdWJTaGFyZWQuZ2V0U3RhdGUkKHApLnZhbHVlO1xuICAgIH0sXG5cbiAgICBzZXQ6ICh0YXJnZXQ6IFByb3h5SGFuZGxlcjxSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4+LCBwOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiA9PiB7XG4gICAgICBpZiAocC5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdub2RlIGludGVybmFsIHN0YXRlIGNhbiBub3QgYmUgYXNzaWduZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBzdGF0ZXNIdWJTaGFyZWQubXV0YXRlU3RhdGUocCwgdmFsdWUpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJveHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KHt9LCBoYW5kbGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0U2hhcmVkU3RhdGVzO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBTdGF0ZXNIdWJTaGFyZWQsIFNoYXJlZFN0YXRlc1NwZWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1YiBpbXBsZW1lbnRzIFN0YXRlc0h1YlNoYXJlZCB7XG4gIHB1YmxpYyBjYWNoZTogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PHVua25vd24+PjtcbiAgcHVibGljIHBhcmVudEh1Yj86IFN0YXRlc0h1YlNoYXJlZCA9IHVuZGVmaW5lZDtcbiAgcHVibGljIHVuV3JpdGVhYmxlU3RhdGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzcGVjOiBTaGFyZWRTdGF0ZXNTcGVjLCBwYXJlbnRIdWI/OiBTdGF0ZXNIdWJTaGFyZWQpIHtcbiAgICB0aGlzLnBhcmVudEh1YiA9IHBhcmVudEh1YjtcbiAgICB0aGlzLmNhY2hlID0gT2JqZWN0LmVudHJpZXMoc3BlYykucmVkdWNlPFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj4+KFxuICAgICAgKGFjYywgW3N0YXRlSUQsIHsgaW5pdGlhbCwgd3JpdGVhYmxlIH1dKSA9PiB7XG4gICAgICAgIGFjY1tzdGF0ZUlEXSA9IG5ldyBCZWhhdmlvclN1YmplY3QoaW5pdGlhbCk7XG4gICAgICAgIGlmICh3cml0ZWFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy51bldyaXRlYWJsZVN0YXRlcy5wdXNoKHN0YXRlSUQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAhIXRoaXMucGFyZW50SHViPy5oYXNTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVTdGF0ZSQoc3RhdGVJRDogc3RyaW5nLCBpbml0aWFsVmFsdWU/OiB1bmtub3duKTogdm9pZCB7XG4gICAgdGhpcy5jYWNoZVtzdGF0ZUlEXSA9IG5ldyBCZWhhdmlvclN1YmplY3QoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kU3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDx1bmtub3duPiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW3N0YXRlSURdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcmVudEh1Yj8uZmluZFN0YXRlJChzdGF0ZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogQmVoYXZpb3JTdWJqZWN0PHVua25vd24+IHtcbiAgICBjb25zdCBzdGF0ZSQgPSB0aGlzLmZpbmRTdGF0ZSQoc3RhdGVJRCk7XG4gICAgaWYgKHN0YXRlJCkge1xuICAgICAgcmV0dXJuIHN0YXRlJDtcbiAgICB9XG5cbiAgICB0aGlzLl9jcmVhdGVTdGF0ZSQoc3RhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5jYWNoZVtzdGF0ZUlEXTtcbiAgfVxuXG4gIHB1YmxpYyBtdXRhdGVTdGF0ZShzdGF0ZUlEOiBzdHJpbmcsIHN0YXRlOiB1bmtub3duKTogdm9pZCB7XG4gICAgaWYgKHN0YXRlSUQuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICBsb2dnZXIud2Fybignc2hhcmVkIHN0YXRlSUQgY2FuIG5vdCBzdGFydHMgd2l0aCAkLCB0aGlzIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bldyaXRlYWJsZVN0YXRlcy5pbmNsdWRlcyhzdGF0ZUlEKSkge1xuICAgICAgbG9nZ2VyLndhcm4oJ3RoaXMgc2hhcmVkIHN0YXRlIGlzIG5vdCBhbGxvd2VkIHRvIGJlIHdyaXR0ZW4sIHRoaXMgYWN0aW9uIHdpbGwgYmUgaWdub3JlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0U3RhdGUkKHN0YXRlSUQpLm5leHQoc3RhdGUpO1xuICB9XG5cbiAgcHVibGljIGdldE5vZGVTdGF0ZSQobm9kZVBhdGg6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDx1bmtub3duPiB7XG4gICAgY29uc3Qgc3RhdGVJRCA9IGAkJHtub2RlUGF0aH1gO1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlJChzdGF0ZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBleHBvc2VOb2RlU3RhdGUobm9kZVBhdGg6IHN0cmluZywgc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICBjb25zdCBzdGF0ZUlEID0gYCQke25vZGVQYXRofWA7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHRoaXMuY2FjaGVbc3RhdGVJRF0ubmV4dChzdGF0ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fY3JlYXRlU3RhdGUkKHN0YXRlSUQsIHN0YXRlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQVBJU3BlY0FkYXB0ZXIsIEZldGNoUGFyYW1zIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FwaS1zcGVjLWFkYXB0ZXInO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgZmlyc3RWYWx1ZUZyb20sIGZyb20sIGxhc3QsIG1hcCwgT2JzZXJ2YWJsZSwgb2YsIHN3aXRjaE1hcCwgdGFrZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQVBJU3RhdGVzU3BlYywgU2hhcmVkU3RhdGVzU3BlYywgSW5pdGlhbGl6ZXJGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGluaXRBUElTdGF0ZSBmcm9tICcuL2luaXQtYXBpLXN0YXRlJztcblxuaW50ZXJmYWNlIExhenlTdGF0ZSB7XG4gIHN0YXRlSUQ6IHN0cmluZztcbiAgZnVuYzogSW5pdGlhbGl6ZXJGdW5jO1xuICBkZXBlbmRlbmNpZXM/OiB7XG4gICAgW2tleTogc3RyaW5nXTogRmV0Y2hQYXJhbXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvRGVwZW5kZW5jeSQoXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbiAgYXBpSUQ6IHN0cmluZyxcbiAgcGFyYW1zOiBGZXRjaFBhcmFtcyxcbik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCB7IHN0YXRlJCwgZmV0Y2ggfSA9IGluaXRBUElTdGF0ZShhcGlJRCwgYXBpU3BlY0FkYXB0ZXIpO1xuXG4gIC8vIHdlIG9ubHkgbmVlZCB0aGUgYXBpIHJlc3VsdFxuICBjb25zdCBkZXBlbmRlbmN5JCA9IHN0YXRlJC5waXBlKFxuICAgIC8vIGxvYWRpbmcsIHJlc29sdmVkXG4gICAgdGFrZSgyKSxcbiAgICBsYXN0KCksXG4gICAgbWFwKCh7IHJlc3VsdCB9KSA9PiByZXN1bHQpLFxuICApO1xuXG4gIGZldGNoKHsgcGFyYW1zIH0pO1xuXG4gIHJldHVybiBkZXBlbmRlbmN5JDtcbn1cblxuZnVuY3Rpb24gdG9EZXBzJChcbiAgZGVwczogUmVjb3JkPHN0cmluZywgRmV0Y2hQYXJhbXM+LFxuICBhcGlTdGF0ZXM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbik6IE9ic2VydmFibGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgY29uc3QgZGVwZW5kZW5jaWVzJCA9IE9iamVjdC5lbnRyaWVzKGRlcHMpXG4gICAgLm1hcCgoW3N0YXRlSUQsIGZldGNoUGFyYW1zXSkgPT4ge1xuICAgICAgaWYgKCFhcGlTdGF0ZXNbc3RhdGVJRF0pIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgIGBubyBzdGF0ZTogJHtzdGF0ZUlEfSBmb3VuZCBpbiBBUElTdGF0ZXNTcGVjLCB1bmRlZmluZWQgd2lsbCBiZSB1c2VkIGFzIHRoaXMgZGVwZW5kZW5jeSB2YWx1ZWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYXBpSUQgfSA9IGFwaVN0YXRlc1tzdGF0ZUlEXTtcblxuICAgICAgcmV0dXJuIFtzdGF0ZUlELCB0b0RlcGVuZGVuY3kkKGFwaVNwZWNBZGFwdGVyLCBhcGlJRCwgZmV0Y2hQYXJhbXMpXTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj5dID0+ICEhcGFpcilcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgZGVwZW5kZW5jeSRdKSA9PiB7XG4gICAgICBhY2Nbc3RhdGVJRF0gPSBkZXBlbmRlbmN5JDtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuXG4gIGlmICghT2JqZWN0LmtleXMoZGVwZW5kZW5jaWVzJCkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG9mKHt9KTtcbiAgfVxuXG4gIHJldHVybiBjb21iaW5lTGF0ZXN0KGRlcGVuZGVuY2llcyQpO1xufVxuXG5mdW5jdGlvbiBwcm9taXNpZnkoZnVuYzogSW5pdGlhbGl6ZXJGdW5jKTogKHA6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiBQcm9taXNlPHVua25vd24+IHtcbiAgcmV0dXJuIChwOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICAoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmdW5jKHApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9PYnNlcnZhYmxlTWFwKFxuICBsYXp5U3RhdGVzOiBMYXp5U3RhdGVbXSxcbiAgYXBpU3RhdGVTcGVjOiBBUElTdGF0ZXNTcGVjLFxuICBhcGlTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIsXG4pOiBSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+PiB7XG4gIHJldHVybiBsYXp5U3RhdGVzXG4gICAgLm1hcDxbc3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+XT4oKHsgc3RhdGVJRCwgZnVuYywgZGVwZW5kZW5jaWVzIH0pID0+IHtcbiAgICAgIGNvbnN0IGRlcHMkID0gdG9EZXBzJChkZXBlbmRlbmNpZXMgfHwge30sIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICAgICAgY29uc3Qgc3RhdGUkID0gZGVwcyQucGlwZShcbiAgICAgICAgc3dpdGNoTWFwKChkZXBzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGZyb20ocHJvbWlzaWZ5KGZ1bmMpKGRlcHMpKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gW3N0YXRlSUQsIHN0YXRlJF07XG4gICAgfSlcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW3N0YXRlSURdID0gc3RhdGUkO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBmaWx0ZXJMYXp5U3RhdGVzIHJldHVybiBhIGxpc3Qgb2Ygc3RhdGUgd2hpY2ggcmVxdWlyZWQgbGF6eSBpbml0aWFsaXphdGlvblxuICogQHBhcmFtIHNoYXJlZFN0YXRlU3BlYyAtIFNoYXJlZFN0YXRlc1NwZWNcbiAqL1xuZnVuY3Rpb24gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWM6IFNoYXJlZFN0YXRlc1NwZWMpOiBBcnJheTxMYXp5U3RhdGU+IHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHNoYXJlZFN0YXRlU3BlYylcbiAgICAubWFwKChbc3RhdGVJRCwgeyBpbml0aWFsaXplciB9XSkgPT4ge1xuICAgICAgaWYgKGluaXRpYWxpemVyKSB7XG4gICAgICAgIHJldHVybiB7IC4uLmluaXRpYWxpemVyLCBzdGF0ZUlEIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9KVxuICAgIC5maWx0ZXIoKGxhenlTdGF0ZSk6IGxhenlTdGF0ZSBpcyBMYXp5U3RhdGUgPT4gISFsYXp5U3RhdGUpO1xufVxuXG4vKipcbiAqIGluaXRpYWxpemVMYXp5U3RhdGVzIHdpbGwgd2FpdCBmb3IgYWxsIHRoZSBkZXBlbmRlbmNpZXMgdG8gYmUgcmVzb2x2ZWQsXG4gKiB0aGVuIGNhbGwgdGhlIGluaXRpYWxpemUgZnVuY3Rpb24sIHRoZW4gcmV0dXJuIHRoZSBmaW5pYWwgc2hhcmVkIHN0YXRlcy5cbiAqIEBwYXJhbSBzaGFyZWRTdGF0ZVNwZWMgLSB0aGUgb3JpZ2luYWwgc2hhcmVkU3RhdGVTcGVjXG4gKiBAcGFyYW0gYXBpU3RhdGVTcGVjIC0gQVBJU3RhdGVzU3BlYyBpbiBzY2hlbWFcbiAqIEBwYXJhbSBhcGlTcGVjQWRhcHRlciAtIEFQSVNwZWNBZGFwdGVyIHBsdWdpblxuICogQHJldHVybnMgaW5pdGlhbGl6ZWQgc2hhcmVkIHN0YXRlc1xuICovXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplTGF6eVN0YXRlcyhcbiAgc2hhcmVkU3RhdGVTcGVjOiBTaGFyZWRTdGF0ZXNTcGVjLFxuICBhcGlTdGF0ZVNwZWM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyPzogQVBJU3BlY0FkYXB0ZXIsXG4pOiBQcm9taXNlPFNoYXJlZFN0YXRlc1NwZWM+IHtcbiAgaWYgKCFhcGlTcGVjQWRhcHRlcikge1xuICAgIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG4gIH1cblxuICBjb25zdCBsYXp5U3RhdGVzID0gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWMpO1xuICAvLyB0dXJuIGxhenkgc3RhdGVzIHRvIG9ic2VydmFibGVzXG4gIGNvbnN0IG9ic1N0YXRlTWFwID0gdG9PYnNlcnZhYmxlTWFwKGxhenlTdGF0ZXMsIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICBpZiAoIU9iamVjdC5rZXlzKG9ic1N0YXRlTWFwKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc2hhcmVkU3RhdGVTcGVjO1xuICB9XG5cbiAgLy8gd2FpdCBmb3IgYWxsIHRoZSBvYnNlcnZhYmxlcyBlbWl0IHZhbHVlXG4gIGNvbnN0IGxhenlTdGF0ZXNNYXAgPSBhd2FpdCBmaXJzdFZhbHVlRnJvbShjb21iaW5lTGF0ZXN0KG9ic1N0YXRlTWFwKSk7XG5cbiAgLy8gbWVyZ2Ugd2l0aCBvcmlnaW5hbCBzdGF0ZXNcbiAgT2JqZWN0LmVudHJpZXMobGF6eVN0YXRlc01hcCkuZm9yRWFjaCgoW3N0YXRlSUQsIHZhbHVlXSkgPT4ge1xuICAgIHNoYXJlZFN0YXRlU3BlY1tzdGF0ZUlEXS5pbml0aWFsID0gdmFsdWU7XG4gIH0pO1xuXG4gIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpemVMYXp5U3RhdGVzO1xuIiwiaW1wb3J0IEFydGVyeVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlSW5oZXJpdFByb3BlcnR5KFxuICBub2RlOiBBcnRlcnlTcGVjLk5vZGUsXG4gIGNhY2hlSURzOiBTZXQ8c3RyaW5nPixcbik6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgcHJvcHMgPSBub2RlLnByb3BzIHx8IHt9O1xuXG4gIE9iamVjdC52YWx1ZXMocHJvcHMpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5LnR5cGUgIT09ICdpbmhlcml0ZWRfcHJvcGVydHknKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIXByb3BlcnR5LnBhcmVudElEKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2FjaGVJRHMuYWRkKHByb3BlcnR5LnBhcmVudElEKTtcbiAgfSk7XG5cbiAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSkge1xuICAgIG5vZGUuY2hpbGRyZW4/LmZvckVhY2goKHN1Yk5vZGUpID0+IHBhcnNlSW5oZXJpdFByb3BlcnR5KHN1Yk5vZGUsIGNhY2hlSURzKSk7XG4gIH1cblxuICBpZiAoJ25vZGUnIGluIG5vZGUpIHtcbiAgICBwYXJzZUluaGVyaXRQcm9wZXJ0eShub2RlLm5vZGUgYXMgQXJ0ZXJ5U3BlYy5Ob2RlLCBjYWNoZUlEcyk7XG4gIH1cblxuICByZXR1cm4gY2FjaGVJRHM7XG59XG4iLCJpbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTm9kZVByb3BzQ2FjaGUsIEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGdldE5vZGVJREJ5UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCBub2RlUGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvKC4rKVxcL1swLTldKy9nLCAnLyQxJyk7XG4gIHJldHVybiBub2RlUGF0aC5zcGxpdCgnLycpLnBvcCgpO1xufVxuXG5jb25zdCBOT0RFX1NIT1VMRF9OT1RfQ0FDSEU6IEFydGVyeU5vZGVbJ2lkJ11bXSA9IFsnZHVtbXlMb29wQ29udGFpbmVyJywgJ3BsYWNlaG9sZGVyLW5vZGUnXTtcbmNsYXNzIFN0b3JlIGltcGxlbWVudHMgTm9kZVByb3BzQ2FjaGUge1xuICBwcml2YXRlIGNhY2hlOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PjtcbiAgcHJpdmF0ZSBjYWNoZUlEczogU2V0PHN0cmluZz47XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKGNhY2hlSURzOiBTZXQ8c3RyaW5nPikge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgICB0aGlzLmNhY2hlSURzID0gY2FjaGVJRHM7XG4gIH1cblxuICBwdWJsaWMgc2hvdWxkQ2FjaGUobm9kZUlEOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZUlEcy5oYXMobm9kZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0U3RhdGUocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNhY2hlW3BhdGhdKSB7XG4gICAgICB0aGlzLmNhY2hlW3BhdGhdID0gbmV3IEJlaGF2aW9yU3ViamVjdCh7fSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFByb3BzJChwYXJlbnRJRDogc3RyaW5nKTogQmVoYXZpb3JTdWJqZWN0PFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5pbml0U3RhdGUocGFyZW50SUQpO1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGVbcGFyZW50SURdO1xuICB9XG5cbiAgcHVibGljIHNldFByb3BzKHBhdGg6IHN0cmluZywgbm9kZUlEOiBBcnRlcnlOb2RlWydpZCddICxwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgICBjb25zdCBub2RlUGF0aElEID0gZ2V0Tm9kZUlEQnlQYXRoKHBhdGgpO1xuICAgIC8vIHRvIGF2b2lkIHJlc2V0IHByb3BzIHdoaWxlIG5vZGUgaXMgZHVtbXlMb29wQ29udGFpbmVyIG9yIHBsYWNlaG9sZGVyLW5vZGVcbiAgICAvLyBvciBzb21lIG1lYW5pbmdsZXNzIG5vZGUgYnV0IHVzZSB1c2VJbnN0YW50aWF0ZVByb3BzIHRvIHBhcnNlIHNwZWNpZmljIHByb3BzXG4gICAgLy8gbGlrZSBpdGVyYWJsZVN0YXRlLCBzaG91bGRSZW5kZXJcbiAgICBpZighbm9kZVBhdGhJRCB8fCBOT0RFX1NIT1VMRF9OT1RfQ0FDSEUuaW5jbHVkZXMobm9kZUlEKSB8fCF0aGlzLnNob3VsZENhY2hlKG5vZGVQYXRoSUQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNhY2hlW25vZGVQYXRoSURdKSB7XG4gICAgICB0aGlzLmNhY2hlW25vZGVQYXRoSURdID0gbmV3IEJlaGF2aW9yU3ViamVjdChwcm9wcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jYWNoZVtub2RlUGF0aElEXS5uZXh0KHByb3BzKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdG9yZTtcbiIsImltcG9ydCB7IGNyZWF0ZUJyb3dzZXJIaXN0b3J5IH0gZnJvbSAnaGlzdG9yeSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB0eXBlIEFydGVyeVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCBnZXRBUElTdGF0ZXMgZnJvbSAnLi9hcGktc3RhdGVzJztcbmltcG9ydCBkZXNlcmlhbGl6ZSBmcm9tICcuL2Rlc2VyaWFsaXplJztcbmltcG9ydCBTdGF0ZXNIdWJBUEkgZnJvbSAnLi9zdGF0ZXMtaHViLWFwaSc7XG5pbXBvcnQgZ2V0U2hhcmVkU3RhdGVzIGZyb20gJy4vc2hhcmVkLXN0YXRlcyc7XG5pbXBvcnQgU3RhdGVzSHViU2hhcmVkIGZyb20gJy4vc3RhdGVzLWh1Yi1zaGFyZWQnO1xuaW1wb3J0IGluaXRpYWxpemVMYXp5U3RhdGVzIGZyb20gJy4vaW5pdGlhbGl6ZS1sYXp5LXNoYXJlZC1zdGF0ZXMnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFBsdWdpbnMsIEFydGVyeU5vZGUsIFNoYXJlZFN0YXRlc1NwZWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgcGFyc2VJbmhlcml0UHJvcGVydHkgZnJvbSAnLi9kZXNlcmlhbGl6ZS9wYXJzZS1pbmhlcml0LXByb3BlcnR5JztcbmltcG9ydCBOb2RlUHJvcHNDYWNoZSBmcm9tICcuL25vZGUtcHJvcHMtY2FjaGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvb3RVcFBhcmFtcyB7XG4gIGFydGVyeTogQXJ0ZXJ5U3BlYy5BcnRlcnk7XG4gIHBhcmVudENUWD86IENUWDtcbiAgcGx1Z2lucz86IFBsdWdpbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm9vdFJlc3VsdCB7XG4gIGN0eDogQ1RYO1xuICByb290Tm9kZTogQXJ0ZXJ5Tm9kZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdENUWCh7IGFydGVyeSwgcGFyZW50Q1RYLCBwbHVnaW5zIH06IEJvb3RVcFBhcmFtcyk6IFByb21pc2U8Q1RYPiB7XG4gIGNvbnN0IHsgYXBpU3RhdGVTcGVjLCBzaGFyZWRTdGF0ZXNTcGVjIH0gPSBhcnRlcnk7XG4gIGNvbnN0IF9wbHVnaW5zID0gT2JqZWN0LmFzc2lnbih7fSwgcGFyZW50Q1RYPy5wbHVnaW5zIHx8IHt9LCBwbHVnaW5zIHx8IHt9KTtcblxuICBjb25zdCBzdGF0ZXNIdWJBUEkgPSBuZXcgU3RhdGVzSHViQVBJKHtcbiAgICAvLyBUT0RPOiB0aHJvdyBlcnJvciBpbnN0ZWFkIG9mIHRvbGVyYXRpbmcgaXRcbiAgICBhcGlTcGVjQWRhcHRlcjogX3BsdWdpbnMuYXBpU3BlY0FkYXB0ZXIsXG4gICAgYXBpU3RhdGVTcGVjOiBhcGlTdGF0ZVNwZWMgfHwge30sXG4gICAgcGFyZW50SHViOiBwYXJlbnRDVFg/LnN0YXRlc0h1YkFQSSxcbiAgfSk7XG5cbiAgY29uc3QgaW5zdGFudGlhdGVTcGVjID0gZGVzZXJpYWxpemUoc2hhcmVkU3RhdGVzU3BlYyB8fCB7fSwgdW5kZWZpbmVkKSBhcyBTaGFyZWRTdGF0ZXNTcGVjIHwgbnVsbDtcbiAgY29uc3QgaW5pdGlhbGl6ZWRTdGF0ZSA9IGF3YWl0IGluaXRpYWxpemVMYXp5U3RhdGVzKFxuICAgIGluc3RhbnRpYXRlU3BlYyB8fCB7fSxcbiAgICBhcGlTdGF0ZVNwZWMgfHwge30sXG4gICAgX3BsdWdpbnMuYXBpU3BlY0FkYXB0ZXIsXG4gICk7XG4gIGNvbnN0IHN0YXRlc0h1YlNoYXJlZCA9IG5ldyBTdGF0ZXNIdWJTaGFyZWQoaW5pdGlhbGl6ZWRTdGF0ZSwgcGFyZW50Q1RYPy5zdGF0ZXNIdWJTaGFyZWQpO1xuXG4gIGNvbnN0IGhpc3RvcnkgPSBwYXJlbnRDVFg/Lmhpc3RvcnkgfHwgY3JlYXRlQnJvd3Nlckhpc3RvcnkoKTtcbiAgY29uc3QgbG9jYXRpb24kID0gcGFyZW50Q1RYPy5sb2NhdGlvbiQgfHwgbmV3IEJlaGF2aW9yU3ViamVjdChoaXN0b3J5LmxvY2F0aW9uKTtcblxuICBpZiAoIXBhcmVudENUWD8ubG9jYXRpb24kKSB7XG4gICAgaGlzdG9yeS5saXN0ZW4oKHsgbG9jYXRpb24gfSkgPT4ge1xuICAgICAgbG9jYXRpb24kLm5leHQobG9jYXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgY2FjaGVJRHMgPSBwYXJzZUluaGVyaXRQcm9wZXJ0eShhcnRlcnkubm9kZSwgbmV3IFNldCgpKTtcbiAgY29uc3Qgbm9kZVByb3BzQ2FjaGUgPSBuZXcgTm9kZVByb3BzQ2FjaGUoY2FjaGVJRHMpO1xuXG4gIGNvbnN0IGN0eDogQ1RYID0ge1xuICAgIHN0YXRlc0h1YkFQSTogc3RhdGVzSHViQVBJLFxuICAgIHN0YXRlc0h1YlNoYXJlZDogc3RhdGVzSHViU2hhcmVkLFxuXG4gICAgYXBpU3RhdGVzOiBnZXRBUElTdGF0ZXMoc3RhdGVzSHViQVBJKSxcbiAgICBzdGF0ZXM6IGdldFNoYXJlZFN0YXRlcyhzdGF0ZXNIdWJTaGFyZWQpLFxuICAgIGhpc3RvcnksXG4gICAgbG9jYXRpb24kLFxuICAgIG5vZGVQcm9wc0NhY2hlLFxuXG4gICAgcGx1Z2luczogX3BsdWdpbnMsXG4gIH07XG5cbiAgcmV0dXJuIGN0eDtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVOb2RlKG5vZGU6IEFydGVyeVNwZWMuTm9kZSwgY3R4OiBDVFgpOiBBcnRlcnlOb2RlIHtcbiAgY29uc3Qgcm9vdE5vZGUgPSBkZXNlcmlhbGl6ZShub2RlLCB7XG4gICAgYXBpU3RhdGVzOiBjdHguYXBpU3RhdGVzLFxuICAgIHN0YXRlczogY3R4LnN0YXRlcyxcbiAgICBoaXN0b3J5OiBjdHguaGlzdG9yeSxcbiAgfSkgYXMgQXJ0ZXJ5Tm9kZTtcblxuICBpZiAoIXJvb3ROb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gaW5pdCBjdHghJyk7XG4gIH1cblxuICByZXR1cm4gcm9vdE5vZGU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJvb3RVcCh7IGFydGVyeSwgcGFyZW50Q1RYLCBwbHVnaW5zIH06IEJvb3RVcFBhcmFtcyk6IFByb21pc2U8Qm9vdFJlc3VsdD4ge1xuICBjb25zdCBjdHggPSBhd2FpdCBpbml0Q1RYKHsgYXJ0ZXJ5LCBwYXJlbnRDVFgsIHBsdWdpbnMgfSk7XG4gIGNvbnN0IHJvb3ROb2RlID0gZGVzZXJpYWxpemVOb2RlKGFydGVyeS5ub2RlLCBjdHgpO1xuXG4gIHJldHVybiB7IGN0eCwgcm9vdE5vZGUgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYm9vdFVwO1xuIiwiaW1wb3J0IHR5cGUgeyBDb25zdGFudFByb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCB7IEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNvbnN0YW50UHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgaWYgKCFub2RlLnByb3BzKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMpXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQ29uc3RhbnRQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2NvbnN0YW50X3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5yZWR1Y2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KChhY2MsIFtrZXksIHsgdmFsdWUgfV0pID0+IHtcbiAgICAgIGFjY1trZXldID0gdmFsdWU7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdFdpdGgsIG1hcCwgb2YsIHNraXAsIHRhcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgQ29tcHV0ZWREZXBlbmRlbmN5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCB7IENUWCwgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi90eXBlcyc7XG5cbmludGVyZmFjZSBDb252ZXJ0UmVzdWx0UGFyYW1zIHtcbiAgc3RhdGU6IHVua25vd247XG4gIGNvbnZlcnRvcj86IFN0YXRlQ29udmVydG9yO1xuICBmYWxsYmFjazogdW5rbm93bjtcbiAgcHJvcE5hbWU6IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvbnZlcnRTdGF0ZSh7IHN0YXRlLCBjb252ZXJ0b3IsIGZhbGxiYWNrLCBwcm9wTmFtZSB9OiBDb252ZXJ0UmVzdWx0UGFyYW1zKTogdW5rbm93biB7XG4gIGlmIChjb252ZXJ0b3IgJiYgc3RhdGUgIT09IHVuZGVmaW5lZCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gY29udmVydG9yKHN0YXRlKSA/PyBmYWxsYmFjaztcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICBgYW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgY2FsbGluZyBzdGF0ZSBjb252ZXJ0b3IgZm9yIHByb3A6IFwiJHtwcm9wTmFtZX1cImAsXG4gICAgICAgICd3aXRoIHRoZSBmb2xsb3dpbmcgc3RhdGUgYW5kIGNvbnZlcnRvcjonLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgc3RhdGUsXG4gICAgICAgICdcXG4nLFxuICAgICAgICBjb252ZXJ0b3IudG9TdHJpbmcoKSxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgICdTbyByZXR1cm4gZmFsbGJhY2sgaW5zdGVhZCwgZmFsbGJhY2s6JyxcbiAgICAgICAgZmFsbGJhY2ssXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgZXJyb3IsXG4gICAgICApO1xuICAgICAgcmV0dXJuIGZhbGxiYWNrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdGF0ZSA/PyBmYWxsYmFjaztcbn1cblxuaW50ZXJmYWNlIEdldENvbXB1dGVkU3RhdGUkUHJvcHMge1xuICBwcm9wTmFtZTogc3RyaW5nO1xuICBkZXBzOiBDb21wdXRlZERlcGVuZGVuY3lbXTtcbiAgY29udmVydG9yOiBTdGF0ZUNvbnZlcnRvcjtcbiAgY3R4OiBDVFg7XG4gIGZhbGxiYWNrOiB1bmtub3duO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tcHV0ZWRTdGF0ZSQoe1xuICBwcm9wTmFtZSxcbiAgZGVwcyxcbiAgY29udmVydG9yLFxuICBjdHgsXG4gIGZhbGxiYWNrLFxufTogR2V0Q29tcHV0ZWRTdGF0ZSRQcm9wcyk6IEJlaGF2aW9yU3ViamVjdDx1bmtub3duPiB7XG4gIGxldCBfZmFsbGJhY2sgPSBmYWxsYmFjaztcbiAgY29uc3QgZGVwcyQgPSBkZXBzLm1hcDxCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4+KCh7IHR5cGUsIGRlcElEIH0pID0+IHtcbiAgICBpZiAodHlwZSA9PT0gJ2FwaV9zdGF0ZScpIHtcbiAgICAgIHJldHVybiBjdHguc3RhdGVzSHViQVBJLmdldFN0YXRlJChkZXBJRCkgYXMgQmVoYXZpb3JTdWJqZWN0PHVua25vd24+O1xuICAgIH1cblxuICAgIGlmICh0eXBlID09PSAnbm9kZV9zdGF0ZScpIHtcbiAgICAgIHJldHVybiBjdHguc3RhdGVzSHViU2hhcmVkLmdldE5vZGVTdGF0ZSQoZGVwSUQpO1xuICAgIH1cblxuICAgIHJldHVybiBjdHguc3RhdGVzSHViU2hhcmVkLmdldFN0YXRlJChkZXBJRCk7XG4gIH0pO1xuICBjb25zdCBpbml0aWFsRGVwcyA9IGRlcHMkLnJlZHVjZSgoYWNjOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgZGVwJCwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBrZXkgPSBkZXBzW2luZGV4XS5kZXBJRDtcbiAgICBhY2Nba2V5XSA9IGRlcCQudmFsdWU7XG4gICAgXG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xuICBjb25zdCBzdGF0ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0KFxuICAgIGNvbnZlcnRTdGF0ZSh7XG4gICAgICBzdGF0ZTogaW5pdGlhbERlcHMsXG4gICAgICBjb252ZXJ0b3I6IGNvbnZlcnRvcixcbiAgICAgIGZhbGxiYWNrOiBmYWxsYmFjayxcbiAgICAgIHByb3BOYW1lLFxuICAgIH0pLFxuICApO1xuXG4gIG9mKHRydWUpXG4gICAgLnBpcGUoXG4gICAgICBjb21iaW5lTGF0ZXN0V2l0aChkZXBzJCksXG4gICAgICBtYXAoKF8sIC4uLl9kZXApID0+IHtcbiAgICAgICAgcmV0dXJuIGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgICAgc3RhdGU6IF9kZXAsXG4gICAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3IsXG4gICAgICAgICAgZmFsbGJhY2s6IF9mYWxsYmFjayxcbiAgICAgICAgICBwcm9wTmFtZSxcbiAgICAgICAgfSk7XG4gICAgICB9KSxcbiAgICAgIHNraXAoMSksXG4gICAgICB0YXAoKHN0YXRlKSA9PiB7XG4gICAgICAgIF9mYWxsYmFjayA9IHN0YXRlO1xuICAgICAgfSksXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoKHN0YXRlKSA9PiBzdGF0ZSQubmV4dChzdGF0ZSkpO1xuXG4gIHJldHVybiBzdGF0ZSQ7XG59XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkLCBtYXAsIE9ic2VydmFibGUsIHNraXAsIHRhcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBBUElSZXN1bHRQcm9wZXJ0eSwgQVBJU3RhdGUsIENUWCwgQXJ0ZXJ5Tm9kZSwgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBjb252ZXJ0U3RhdGUgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gdXNlQVBJUmVzdWx0UHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IGFkYXB0ZXJzOiBSZWNvcmQ8c3RyaW5nLCBTdGF0ZUNvbnZlcnRvciB8IHVuZGVmaW5lZD4gPSB7fTtcbiAgY29uc3Qgc3RhdGVzJDogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPj4gPSB7fTtcbiAgY29uc3QgaW5pdGlhbEZhbGxiYWNrczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIEFQSVJlc3VsdFByb3BlcnR5XSA9PiB7XG4gICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnYXBpX3Jlc3VsdF9wcm9wZXJ0eSc7XG4gICAgfSlcbiAgICAuZm9yRWFjaCgoW3Byb3BOYW1lLCB7IGZhbGxiYWNrLCBjb252ZXJ0b3I6IGFkYXB0ZXIsIHN0YXRlSUQgfV0pID0+IHtcbiAgICAgIGluaXRpYWxGYWxsYmFja3NbcHJvcE5hbWVdID0gZmFsbGJhY2s7XG4gICAgICBhZGFwdGVyc1twcm9wTmFtZV0gPSBhZGFwdGVyO1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBjdHguc3RhdGVzSHViQVBJLmdldFN0YXRlJChzdGF0ZUlEKTtcbiAgICB9KTtcblxuICBjb25zdCBmYWxsYmFja3NSZWYgPSB1c2VSZWY8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KGluaXRpYWxGYWxsYmFja3MpO1xuXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgIHN0YXRlOiBzdGF0ZSQuZ2V0VmFsdWUoKS5yZXN1bHQsXG4gICAgICAgIGNvbnZlcnRvcjogYWRhcHRlcnNba2V5XSxcbiAgICAgICAgZmFsbGJhY2s6IGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0sXG4gICAgICAgIHByb3BOYW1lOiBrZXksXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcmVzdWx0cyQgPSBPYmplY3QuZW50cmllcyhzdGF0ZXMkKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgT2JzZXJ2YWJsZTx1bmtub3duPj4+KFxuICAgICAgKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgICBhY2Nba2V5XSA9IHN0YXRlJC5waXBlKFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkKCdyZXN1bHQnKSxcbiAgICAgICAgICBtYXAoKHsgcmVzdWx0IH0pID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb252ZXJ0U3RhdGUoe1xuICAgICAgICAgICAgICBzdGF0ZTogcmVzdWx0LFxuICAgICAgICAgICAgICBjb252ZXJ0b3I6IGFkYXB0ZXJzW2tleV0sXG4gICAgICAgICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0gPSByZXN1bHQ7XG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gY29tYmluZUxhdGVzdChyZXN1bHRzJCkucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoc2V0U3RhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VBUElSZXN1bHRQcm9wcztcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkLCBtYXAsIE9ic2VydmFibGUsIHNraXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB0eXBlIHsgQVBJTG9hZGluZ1Byb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCB7IEFQSVN0YXRlLCBDVFgsIEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIHVzZUFQSUxvYWRpbmdQcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgc3RhdGVzJDogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIEFQSUxvYWRpbmdQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2FwaV9sb2FkaW5nX3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5mb3JFYWNoKChbcHJvcE5hbWUsIHsgc3RhdGVJRCB9XSkgPT4ge1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBjdHguc3RhdGVzSHViQVBJLmdldFN0YXRlJChzdGF0ZUlEKTtcbiAgICB9KTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSBzdGF0ZSQuZ2V0VmFsdWUoKS5sb2FkaW5nO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZXN1bHRzJCA9IE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+Pj4oXG4gICAgICAoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gc3RhdGUkLnBpcGUoXG4gICAgICAgICAgc2tpcCgxKSxcbiAgICAgICAgICBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCgnbG9hZGluZycpLFxuICAgICAgICAgIG1hcCgoeyBsb2FkaW5nIH0pID0+IGxvYWRpbmcpLFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGNvbWJpbmVMYXRlc3QocmVzdWx0cyQpLnN1YnNjcmliZShzZXRTdGF0ZSk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUFQSUxvYWRpbmdQcm9wcztcbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB7IEFQSUludm9rZVByb3BlcnR5LCBDVFgsIEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgQVBJQ2FsbFByb3BzID0gUmVjb3JkPHN0cmluZywgKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gdm9pZD47XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUFQSUludm9rZVByb3BzKG5vZGU6IEFydGVyeU5vZGUsIGN0eDogQ1RYKTogQVBJQ2FsbFByb3BzIHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbm9kZS5wcm9wcykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhub2RlLnByb3BzKVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQVBJSW52b2tlUHJvcGVydHldID0+IHtcbiAgICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2FwaV9pbnZva2VfcHJvcGVydHknO1xuICAgICAgfSlcbiAgICAgIC5yZWR1Y2U8QVBJQ2FsbFByb3BzPigoYWNjLCBbcHJvcE5hbWUsIHsgc3RhdGVJRCwgcGFyYW1zQnVpbGRlciwgY2FsbGJhY2sgfV0pID0+IHtcbiAgICAgICAgbG9nZ2VyLndhcm4oJ2hvb2sgdXNlQVBJSW52b2tlUHJvcHMgaGFzIGJlZW4gZGVwcmVjYXRlZCwgcGxlYXNlIHVzZSBob29rIHVzZUZ1bmNQcm9wcyBpbnN0ZWFkJyk7XG5cbiAgICAgICAgZnVuY3Rpb24gaGFuZGxlQWN0aW9uKC4uLmFyZ3M6IHVua25vd25bXSk6IHZvaWQge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCBmZXRjaFBhcmFtczogRmV0Y2hQYXJhbXMgPSBwYXJhbXNCdWlsZGVyPy4oLi4uYXJncykgfHwge307XG4gICAgICAgICAgICBjdHguYXBpU3RhdGVzW3N0YXRlSURdLmZldGNoKGZldGNoUGFyYW1zLCBjYWxsYmFjayk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci5sb2coJ2ZhaWxlZCB0byBydW4gY29udmVydG9yIG9yIHJ1biBhY3Rpb246JywgZXJyb3IpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGFjY1twcm9wTmFtZV0gPSBoYW5kbGVBY3Rpb247XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG4gIH0sIFtdKTtcbn1cbiIsImltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCwgT2JzZXJ2YWJsZSwgc2tpcCwgdGFwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENUWCwgU2hhcmVkU3RhdGVQcm9wZXJ0eSwgTm9kZVN0YXRlUHJvcGVydHksIEFydGVyeU5vZGUsIFN0YXRlQ29udmVydG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgY29udmVydFN0YXRlIH0gZnJvbSAnLi91dGlscyc7XG5cbnR5cGUgUGFpciA9IFtzdHJpbmcsIFNoYXJlZFN0YXRlUHJvcGVydHkgfCBOb2RlU3RhdGVQcm9wZXJ0eV07XG5cbmZ1bmN0aW9uIHVzZVNoYXJlZFN0YXRlUHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IGNvbnZlcnRvcnM6IFJlY29yZDxzdHJpbmcsIFN0YXRlQ29udmVydG9yIHwgdW5kZWZpbmVkPiA9IHt9O1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4+ID0ge307XG4gIGNvbnN0IGluaXRpYWxGYWxsYmFja3M6IFJlY29yZDxzdHJpbmcsIHVua25vd24+ID0ge307XG5cbiAgT2JqZWN0LmVudHJpZXMobm9kZS5wcm9wcyB8fCB7fSlcbiAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBQYWlyID0+IHtcbiAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdzaGFyZWRfc3RhdGVfcHJvcGVydHknIHx8IHBhaXJbMV0udHlwZSA9PT0gJ25vZGVfc3RhdGVfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtrZXksIHByb3BTcGVjXSkgPT4ge1xuICAgICAgaWYgKHByb3BTcGVjLnR5cGUgPT09ICdzaGFyZWRfc3RhdGVfcHJvcGVydHknKSB7XG4gICAgICAgIHN0YXRlcyRba2V5XSA9IGN0eC5zdGF0ZXNIdWJTaGFyZWQuZ2V0U3RhdGUkKHByb3BTcGVjLnN0YXRlSUQpO1xuICAgICAgICBjb252ZXJ0b3JzW2tleV0gPSBwcm9wU3BlYy5jb252ZXJ0b3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZXMkW2tleV0gPSBjdHguc3RhdGVzSHViU2hhcmVkLmdldE5vZGVTdGF0ZSQocHJvcFNwZWMubm9kZVBhdGgpO1xuICAgICAgICBjb252ZXJ0b3JzW2tleV0gPSBwcm9wU3BlYy5jb252ZXJ0b3I7XG4gICAgICB9XG5cbiAgICAgIGluaXRpYWxGYWxsYmFja3Nba2V5XSA9IHByb3BTcGVjLmZhbGxiYWNrO1xuICAgIH0pO1xuXG4gIGNvbnN0IGZhbGxiYWNrc1JlZiA9IHVzZVJlZjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oaW5pdGlhbEZhbGxiYWNrcyk7XG5cbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZSgoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSBjb252ZXJ0U3RhdGUoe1xuICAgICAgICBzdGF0ZTogc3RhdGUkLmdldFZhbHVlKCksXG4gICAgICAgIGNvbnZlcnRvcjogY29udmVydG9yc1trZXldLFxuICAgICAgICBmYWxsYmFjazogZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSxcbiAgICAgICAgcHJvcE5hbWU6IGtleSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIU9iamVjdC5rZXlzKHN0YXRlcyQpLmxlbmd0aCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdHMkID0gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSBzdGF0ZSQucGlwZShcbiAgICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgICAgIG1hcCgocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29udmVydFN0YXRlKHtcbiAgICAgICAgICAgICAgc3RhdGU6IHJlc3VsdCxcbiAgICAgICAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3JzW2tleV0sXG4gICAgICAgICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0gPSByZXN1bHQ7XG4gICAgICAgICAgfSksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gY29tYmluZUxhdGVzdChyZXN1bHRzJCkucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoc2V0U3RhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VTaGFyZWRTdGF0ZVByb3BzO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IEFydGVyeU5vZGUsIEZ1bmN0aW9uYWxQcm9wZXJ0eSwgVmVyc2F0aWxlRnVuYyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRnVuY1Byb3BzKG5vZGU6IEFydGVyeU5vZGUpOiBSZWNvcmQ8c3RyaW5nLCBWZXJzYXRpbGVGdW5jPiB7XG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoIW5vZGUucHJvcHMpIHtcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMobm9kZS5wcm9wcylcbiAgICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIEZ1bmN0aW9uYWxQcm9wZXJ0eV0gPT4ge1xuICAgICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnZnVuY3Rpb25hbF9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBWZXJzYXRpbGVGdW5jPj4oKGFjYywgW2tleSwgeyBmdW5jIH1dKSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gKC4uLmFyZ3M6IHVua25vd25bXSkgPT4ge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmdW5jKC4uLmFyZ3MpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICAgIGBhbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBydW4gbm9kZSAnJHtub2RlLmlkfScgZnVuY3Rpb25hbCBwcm9wZXJ0eTpgLFxuICAgICAgICAgICAgICBrZXksXG4gICAgICAgICAgICAgICd3aXRoIHRoZSBmb2xsb3dpbmcgYXJndW1lbnRzOicsXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICBhcmdzLFxuICAgICAgICAgICAgICAnXFxuJyxcbiAgICAgICAgICAgICAgJ2Z1bmN0aW9uIGlzOicsXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICBmdW5jLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICBlcnJvcixcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG4gIH0sIFtdKTtcbn1cbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB7IENUWCwgU2hhcmVkU3RhdGVNdXRhdGlvblByb3BlcnR5LCBBcnRlcnlOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG50eXBlIE11dGF0ZVByb3BzID0gUmVjb3JkPHN0cmluZywgKHZhbHVlOiB1bmtub3duKSA9PiB2b2lkPjtcbnR5cGUgUGFpciA9IFtzdHJpbmcsIFNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wZXJ0eV07XG5cbmZ1bmN0aW9uIHVzZVNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IE11dGF0ZVByb3BzIHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbm9kZS5wcm9wcykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhub2RlLnByb3BzKVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgUGFpciA9PiB7XG4gICAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdzaGFyZWRfc3RhdGVfbXV0YXRpb25fcHJvcGVydHknO1xuICAgICAgfSlcbiAgICAgIC5yZWR1Y2U8TXV0YXRlUHJvcHM+KChhY2MsIFtrZXksIHsgc3RhdGVJRCwgY29udmVydG9yIH1dKSA9PiB7XG4gICAgICAgIGZ1bmN0aW9uIG11dGF0aW9uKHN0YXRlOiB1bmtub3duKTogdm9pZCB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb252ZXJ0b3IgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGN0eC5zdGF0ZXNIdWJTaGFyZWQubXV0YXRlU3RhdGUoc3RhdGVJRCwgc3RhdGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjb25zdCB2ID0gY29udmVydG9yKHN0YXRlKTtcbiAgICAgICAgICAgIGN0eC5zdGF0ZXNIdWJTaGFyZWQubXV0YXRlU3RhdGUoc3RhdGVJRCwgdik7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcignZmFpbGVkIHRvIHJ1biBjb252ZXJ0b3I6XFxuJywgY29udmVydG9yLnRvU3RyaW5nKCksICdcXG4nLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWNjW2tleV0gPSBtdXRhdGlvbjtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL25vZGUtcmVuZGVyL3BhdGgtY29udGV4dCc7XG5cbmltcG9ydCB7IEFydGVyeU5vZGUsIENUWCwgVmVyc2F0aWxlRnVuYyB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBJbnRlcm5hbEhvb2tQcm9wcyA9IFJlY29yZDxzdHJpbmcsIFZlcnNhdGlsZUZ1bmMgfCB1bmRlZmluZWQ+O1xuXG4vLyB0b2RvIGdpdmUgdGhpcyBob29rIGEgYmV0dGVyIG5hbWVcbmZ1bmN0aW9uIHVzZUludGVybmFsSG9va1Byb3BzKG5vZGU6IEFydGVyeU5vZGUsIGN0eDogQ1RYKTogSW50ZXJuYWxIb29rUHJvcHMge1xuICBjb25zdCBwYXJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBpZiAoJ3N1cHBvcnRTdGF0ZUV4cG9zdXJlJyBpbiBub2RlICYmIG5vZGUuc3VwcG9ydFN0YXRlRXhwb3N1cmUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIF9fZXhwb3NlU3RhdGU6IChzdGF0ZTogdW5rbm93bik6IHZvaWQgPT4ge1xuICAgICAgICAgIGN0eC5zdGF0ZXNIdWJTaGFyZWQuZXhwb3NlTm9kZVN0YXRlKGAke3BhcmVudFBhdGh9LyR7bm9kZS5pZH1gLCBzdGF0ZSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiB7fTtcbiAgfSwgW10pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VJbnRlcm5hbEhvb2tQcm9wcztcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VNZW1vIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgQ29uc3RhbnRQcm9wZXJ0eSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuXG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuLi9ub2RlLXJlbmRlcic7XG5pbXBvcnQgeyBDVFgsIEFydGVyeU5vZGUsIFJlbmRlclByb3BlcnR5IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG50eXBlIFJlbmRlciA9ICguLi5hcmdzOiB1bmtub3duW10pID0+IFJlYWN0LlJlYWN0RWxlbWVudDtcbnR5cGUgUmVuZGVyUHJvcHMgPSBSZWNvcmQ8c3RyaW5nLCBSZW5kZXI+O1xuXG5mdW5jdGlvbiBidWlsZFJlbmRlcihcbiAgbm9kZTogQXJ0ZXJ5Tm9kZSxcbiAgY3R4OiBDVFgsXG4gIGFkYXB0ZXI/OiAoLi4uYXJnczogdW5rbm93bltdKSA9PiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbik6IFJlbmRlciB7XG4gIHJldHVybiAoLi4uYXJnczogdW5rbm93bltdKTogUmVhY3QuUmVhY3RFbGVtZW50ID0+IHtcbiAgICAvLyBjb252ZXJ0IHJlbmRlciBhcmdzIHRvIGNvbnN0YW50IHByb3BlcnRpZXMgZm9yIHJldXNlIG9mIE5vZGVSZW5kZXJcbiAgICBsZXQgY29uc3RhbnRQcm9wcyA9IHt9O1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjdXN0b21Qcm9wcyA9IGFkYXB0ZXI/LiguLi5hcmdzKSB8fCB7fTtcbiAgICAgIGlmICh0eXBlb2YgY3VzdG9tUHJvcHMgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGNvbnN0YW50UHJvcHMgPSBPYmplY3QuZW50cmllcyhjdXN0b21Qcm9wcykucmVkdWNlPFJlY29yZDxzdHJpbmcsIENvbnN0YW50UHJvcGVydHk+PihcbiAgICAgICAgICAoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICAgIGFjY1trZXldID0geyB0eXBlOiAnY29uc3RhbnRfcHJvcGVydHknLCB2YWx1ZSB9O1xuICAgICAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgICAgICB9LFxuICAgICAgICAgIHt9LFxuICAgICAgICApO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gdG9kbyBvcHRpbWl6ZSB0aGlzIG1lc3NhZ2VcbiAgICAgICAgbG9nZ2VyLmVycm9yKCd0b1Byb3BzIHJlc3VsdCBpcyBubyBPYmplY3QnKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gdG9kbyBvcHRpbWl6ZSB0aGlzIG1lc3NhZ2VcbiAgICAgIGxvZ2dlci5lcnJvcignZmFpbGVkIHRvIGNhbGwgdG9Qcm9wcycsIGVycm9yKTtcbiAgICB9XG5cbiAgICBub2RlLnByb3BzID0gT2JqZWN0LmFzc2lnbih7fSwgbm9kZS5wcm9wcywgY29uc3RhbnRQcm9wcyk7XG5cbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGUsIGN0eCB9KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdXNlUmVuZGVyUHJvcHMoeyBwcm9wcyB9OiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlbmRlclByb3BzIHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhwcm9wcyB8fCB7fSlcbiAgICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIFJlbmRlclByb3BlcnR5XSA9PiB7XG4gICAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdyZW5kZXJfcHJvcGVydHknO1xuICAgICAgfSlcbiAgICAgIC5yZWR1Y2U8UmVuZGVyUHJvcHM+KChhY2MsIFtwcm9wTmFtZSwgeyBhZGFwdGVyLCBub2RlIH1dKSA9PiB7XG4gICAgICAgIGFjY1twcm9wTmFtZV0gPSBidWlsZFJlbmRlcihub2RlLCBjdHgsIGFkYXB0ZXIpO1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LCB7fSk7XG4gIH0sIFtdKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlUmVuZGVyUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBza2lwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENUWCwgQXJ0ZXJ5Tm9kZSwgQ29tcHV0ZWRQcm9wZXJ0eSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGdldENvbXB1dGVkU3RhdGUkIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNvbXB1dGVkUHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IHN0YXRlcyQ6IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIENvbXB1dGVkUHJvcGVydHldID0+IHtcbiAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdjb21wdXRlZF9wcm9wZXJ0eSc7XG4gICAgfSlcbiAgICAuZm9yRWFjaCgoW3Byb3BOYW1lLCB7IGRlcHMsIGNvbnZlcnRvciwgZmFsbGJhY2sgfV0pID0+IHtcbiAgICAgIHN0YXRlcyRbcHJvcE5hbWVdID0gZ2V0Q29tcHV0ZWRTdGF0ZSQoeyBwcm9wTmFtZSwgZGVwcywgY29udmVydG9yLCBjdHgsIGZhbGxiYWNrIH0pO1xuICAgIH0pO1xuXG4gIGNvbnN0IFtzdGF0ZXMsIHNldFN0YXRlc10gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhzdGF0ZXMkKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgIGFjY1trZXldID0gc3RhdGUkLnZhbHVlO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb25zID0gY29tYmluZUxhdGVzdChzdGF0ZXMkKS5waXBlKHNraXAoMSkpLnN1YnNjcmliZShzZXRTdGF0ZXMpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiBzdGF0ZXM7XG59XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIG1hcCwgT2JzZXJ2YWJsZSwgb2YsIHNraXAsIHRhcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBDVFgsIEluaGVyaXRlZFByb3BlcnR5LCBBcnRlcnlOb2RlLCBTdGF0ZUNvbnZlcnRvciB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGNvbnZlcnRTdGF0ZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiB1c2VJbmhlcml0ZWRQcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcblxuICBjb25zdCBjb252ZXJ0b3JzOiBSZWNvcmQ8c3RyaW5nLCBTdGF0ZUNvbnZlcnRvciB8IHVuZGVmaW5lZD4gPSB7fTtcbiAgY29uc3Qgc3RhdGVzJDogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB8IHVuZGVmaW5lZD4gPSB7fTtcbiAgY29uc3QgaW5pdGlhbEZhbGxiYWNrczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIEluaGVyaXRlZFByb3BlcnR5XSA9PiB7XG4gICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnaW5oZXJpdGVkX3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5mb3JFYWNoKChbcHJvcE5hbWUsIHsgZmFsbGJhY2ssIGNvbnZlcnRvciwgcGFyZW50SUQgfV0pID0+IHtcbiAgICAgIGluaXRpYWxGYWxsYmFja3NbcHJvcE5hbWVdID0gZmFsbGJhY2s7XG4gICAgICBjb252ZXJ0b3JzW3Byb3BOYW1lXSA9IGNvbnZlcnRvcjtcbiAgICAgIHN0YXRlcyRbcHJvcE5hbWVdID0gY3R4Lm5vZGVQcm9wc0NhY2hlPy5nZXRQcm9wcyQocGFyZW50SUQpO1xuICAgIH0pO1xuXG4gIGNvbnN0IGZhbGxiYWNrc1JlZiA9IHVzZVJlZjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oaW5pdGlhbEZhbGxiYWNrcyk7XG5cbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhzdGF0ZXMkKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgIGlmICghc3RhdGUkKSB7XG4gICAgICAgIGFjY1trZXldID0gZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH1cblxuICAgICAgYWNjW2tleV0gPSBjb252ZXJ0U3RhdGUoe1xuICAgICAgICBzdGF0ZTogc3RhdGUkPy5nZXRWYWx1ZSgpLFxuICAgICAgICBjb252ZXJ0b3I6IGNvbnZlcnRvcnNba2V5XSxcbiAgICAgICAgZmFsbGJhY2s6IGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0sXG4gICAgICAgIHByb3BOYW1lOiBrZXksXG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIGFjYztcbiAgICB9LCB7fSk7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgaW5oZXJpdFByb3BzJCA9IE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+Pj4oXG4gICAgICAoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICAgIGlmICghc3RhdGUkKSB7XG4gICAgICAgICAgYWNjW2tleV0gPSBvZihmYWxsYmFja3NSZWYuY3VycmVudFtrZXldKTtcbiAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICB9XG5cbiAgICAgICAgYWNjW2tleV0gPSBzdGF0ZSQucGlwZShcbiAgICAgICAgICBtYXAoKG5vZGVQcm9wcykgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgICAgICAgIHN0YXRlOiBub2RlUHJvcHMsXG4gICAgICAgICAgICAgIGNvbnZlcnRvcjogY29udmVydG9yc1trZXldLFxuICAgICAgICAgICAgICBmYWxsYmFjazogZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSxcbiAgICAgICAgICAgICAgcHJvcE5hbWU6IGtleSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLFxuICAgICAgICAgIHRhcCgoY29udmVydGVkUHJvcHMpID0+IChmYWxsYmFja3NSZWYuY3VycmVudFtrZXldID0gY29udmVydGVkUHJvcHMpKSxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIHt9LFxuICAgICk7XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBjb21iaW5lTGF0ZXN0KGluaGVyaXRQcm9wcyQpLnBpcGUoc2tpcCgxKSkuc3Vic2NyaWJlKHNldFN0YXRlKTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlSW5oZXJpdGVkUHJvcHM7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQ1RYLCBBcnRlcnlOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5mdW5jdGlvbiB1c2VMaW5rUHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGlmICgnaXNMaW5rJyBpbiBub2RlICYmIG5vZGUuaXNMaW5rICYmIG5vZGUudHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcgJiYgbm9kZS5uYW1lID09PSAnYScpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb25DbGljazogKGU6IFJlYWN0Lk1vdXNlRXZlbnQ8SFRNTEFuY2hvckVsZW1lbnQ+KSA9PiB7XG4gICAgICAgIC8vIHRvZG8gcHJveHkgb25DbGljayBldmVudFxuICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIGNvbnN0IGhyZWYgPSAoZS5jdXJyZW50VGFyZ2V0IGFzIEhUTUxBbmNob3JFbGVtZW50KS5ocmVmO1xuICAgICAgICBpZiAoIWhyZWYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY3R4Lmhpc3RvcnkucHVzaChocmVmKTtcbiAgICAgIH0sXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiB7fTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlTGlua1Byb3BzO1xuIiwiaW1wb3J0IHsgdXNlTWVtbywgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ1RYLCBBcnRlcnlOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHVzZUNvbnN0YW50UHJvcHMgZnJvbSAnLi91c2UtY29uc3RhbnQtcHJvcHMnO1xuaW1wb3J0IHVzZUFQSVJlc3VsdFByb3BzIGZyb20gJy4vdXNlLWFwaS1yZXN1bHQtcHJvcHMnO1xuaW1wb3J0IHVzZUFQSUxvYWRpbmdQcm9wcyBmcm9tICcuL3VzZS1hcGktbG9hZGluZy1wcm9wcyc7XG5pbXBvcnQgdXNlQVBJSW52b2tlUHJvcHMgZnJvbSAnLi91c2UtYXBpLWludm9rZS1wcm9wcyc7XG5pbXBvcnQgdXNlU2hhcmVkU3RhdGVQcm9wcyBmcm9tICcuL3VzZS1zaGFyZWQtc3RhdGUtcHJvcHMnO1xuaW1wb3J0IHVzZUZ1bmNQcm9wcyBmcm9tICcuL3VzZS1mdW5jLXByb3BzJztcbmltcG9ydCB1c2VTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMgZnJvbSAnLi91c2Utc2hhcmVkLXN0YXRlLW11dGF0aW9uJztcbmltcG9ydCB1c2VJbnRlcm5hbEhvb2tQcm9wcyBmcm9tICcuL3VzZS1pbnRlcm5hbC1ob29rLXByb3BzJztcbmltcG9ydCB1c2VSZW5kZXJQcm9wcyBmcm9tICcuL3VzZS1yZW5kZXItcHJvcHMnO1xuaW1wb3J0IHVzZUNvbXB1dGVkUHJvcHMgZnJvbSAnLi91c2UtY29tcHV0ZWQtcHJvcHMnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL25vZGUtcmVuZGVyL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgdXNlSW5oZXJpdGVkUHJvcHMgZnJvbSAnLi91c2UtaW5oZXJpdGVkLXByb3BzJztcbmltcG9ydCB1c2VMaW5rUHJvcHMgZnJvbSAnLi91c2UtbGluay1wcm9wcyc7XG5cbmZ1bmN0aW9uIHVzZUluc3RhbnRpYXRlUHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG5cbiAgY29uc3QgY29uc3RhbnRQcm9wcyA9IHVzZUNvbnN0YW50UHJvcHMobm9kZSk7XG4gIGNvbnN0IGFwaVJlc3VsdFByb3BzID0gdXNlQVBJUmVzdWx0UHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgYXBpTG9hZGluZ1Byb3BzID0gdXNlQVBJTG9hZGluZ1Byb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IHNoYXJlZFN0YXRlUHJvcHMgPSB1c2VTaGFyZWRTdGF0ZVByb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IGludGVybmFsSG9va1Byb3BzID0gdXNlSW50ZXJuYWxIb29rUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgY29tcHV0ZWRQcm9wcyA9IHVzZUNvbXB1dGVkUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgaW5oZXJpdGVkUHJvcHMgPSB1c2VJbmhlcml0ZWRQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBmdW5jUHJvcHMgPSB1c2VGdW5jUHJvcHMobm9kZSk7XG5cbiAgY29uc3Qgc2hhcmVkU3RhdGVNdXRhdGlvblByb3BzID0gdXNlU2hhcmVkU3RhdGVNdXRhdGlvblByb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IGFwaVN0YXRlSW52b2tlUHJvcHMgPSB1c2VBUElJbnZva2VQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCByZW5kZXJQcm9wcyA9IHVzZVJlbmRlclByb3BzKG5vZGUsIGN0eCk7XG5cbiAgLy8gdG9kbyBzdXBwb3J0IHVzZXIgZGVmaW5lZCBvbkNsaWNrIGV2ZW50XG4gIGNvbnN0IGxpbmtQcm9wcyA9IHVzZUxpbmtQcm9wcyhub2RlLCBjdHgpO1xuXG4gIHJldHVybiB1c2VNZW1vKCgpID0+IHtcbiAgICBjb25zdCBpbnN0YW50aWF0ZVByb3BzID0gT2JqZWN0LmFzc2lnbihcbiAgICAgIGNvbnN0YW50UHJvcHMsXG4gICAgICBhcGlTdGF0ZUludm9rZVByb3BzLFxuICAgICAgYXBpUmVzdWx0UHJvcHMsXG4gICAgICBhcGlMb2FkaW5nUHJvcHMsXG4gICAgICBzaGFyZWRTdGF0ZVByb3BzLFxuICAgICAgY29tcHV0ZWRQcm9wcyxcbiAgICAgIHNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcyxcbiAgICAgIGludGVybmFsSG9va1Byb3BzLFxuICAgICAgcmVuZGVyUHJvcHMsXG4gICAgICBsaW5rUHJvcHMsXG4gICAgICBpbmhlcml0ZWRQcm9wcyxcbiAgICApO1xuXG4gICAgY3R4Lm5vZGVQcm9wc0NhY2hlPy5zZXRQcm9wcyhjdXJyZW50UGF0aCwgbm9kZS5pZCwgaW5zdGFudGlhdGVQcm9wcyk7XG5cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihpbnN0YW50aWF0ZVByb3BzLCBmdW5jUHJvcHMpO1xuICB9LCBbYXBpUmVzdWx0UHJvcHMsIHNoYXJlZFN0YXRlUHJvcHMsIGFwaUxvYWRpbmdQcm9wcywgY29tcHV0ZWRQcm9wcywgY29uc3RhbnRQcm9wc10pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VJbnN0YW50aWF0ZVByb3BzO1xuIiwiaW1wb3J0IHsgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuLi9wYXRoLWNvbnRleHQnO1xuaW1wb3J0IGJvb3RVcCwgeyBCb290UmVzdWx0IH0gZnJvbSAnLi4vLi4vYm9vdC11cCc7XG5pbXBvcnQgdXNlSW5zdGFudGlhdGVQcm9wcyBmcm9tICcuLi8uLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFJlZkxvYWRlciwgTGlmZWN5Y2xlSG9va3MsIEFydGVyeU5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgQXJ0ZXJ5U3BlYyBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUxpZmVjeWNsZUhvb2soeyBkaWRNb3VudCwgd2lsbFVubW91bnQgfTogTGlmZWN5Y2xlSG9va3MpOiB2b2lkIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBkaWRNb3VudD8uKCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2lsbFVubW91bnQ/LigpO1xuICAgIH07XG4gIH0sIFtdKTtcbn1cblxuaW50ZXJmYWNlIFVzZVJlZlJlc3VsdFByb3BzIHtcbiAgYXJ0ZXJ5SUQ6IHN0cmluZztcbiAgcmVmTG9hZGVyPzogUmVmTG9hZGVyO1xuICBvcnBoYW4/OiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlUmVmUmVzdWx0KFxuICB7IGFydGVyeUlELCByZWZMb2FkZXIsIG9ycGhhbiB9OiBVc2VSZWZSZXN1bHRQcm9wcyxcbiAgcGFyZW50Q1RYOiBDVFgsXG4pOiBCb290UmVzdWx0IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgW3Jlc3VsdCwgc2V0UmVzdWx0XSA9IHVzZVN0YXRlPEJvb3RSZXN1bHQ+KCk7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWFydGVyeUlEKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoYGFydGVyeUlEIGlzIHJlcXVpcmVkIG9uIFJlZk5vZGUsIHBsZWFzZSBjaGVjayB0aGUgc3BlYyBmb3Igbm9kZTogJHtjdXJyZW50UGF0aH1gKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXJlZkxvYWRlcikge1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAncmVmTG9hZGVyIGlzIHJlcXVpcmVkIG9uIFJlZk5vZGUgaW4gb3JkZXIgdG8gZ2V0IHJlZiBzY2hlbWEgYW5kIGNvcnJlc3BvbmRpbmcgQVBJU3BlY0FkYXB0ZXIsJyxcbiAgICAgICAgJ3BsZWFzZSBpbXBsZW1lbnQgcmVmTG9hZGVyIGFuZCBwYXNzIGl0IHRvIHBhcmVudCBSZW5kZXJFbmdpbmUuJyxcbiAgICAgICAgYGN1cnJlbnQgUmVmTm9kZSBwYXRoIGlzOiAke2N1cnJlbnRQYXRofWAsXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB1bk1vdW50aW5nID0gZmFsc2U7XG4gICAgbGV0IF9zY2hlbWE6IEFydGVyeVNwZWMuQXJ0ZXJ5IHwgdW5kZWZpbmVkO1xuXG4gICAgcmVmTG9hZGVyKGFydGVyeUlEKVxuICAgICAgLnRoZW4oKHsgYXJ0ZXJ5LCBwbHVnaW5zIH0pID0+IHtcbiAgICAgICAgaWYgKHVuTW91bnRpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBfc2NoZW1hID0gYXJ0ZXJ5O1xuXG4gICAgICAgIHJldHVybiBib290VXAoe1xuICAgICAgICAgIHBsdWdpbnMsXG4gICAgICAgICAgYXJ0ZXJ5OiBhcnRlcnksXG4gICAgICAgICAgcGFyZW50Q1RYOiBvcnBoYW4gPyB1bmRlZmluZWQgOiBwYXJlbnRDVFgsXG4gICAgICAgIH0pO1xuICAgICAgfSlcbiAgICAgIC50aGVuKChyZWZCb290UmVzdWx0KSA9PiB7XG4gICAgICAgIGlmICghcmVmQm9vdFJlc3VsdCB8fCAhX3NjaGVtYSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldFJlc3VsdCh7IGN0eDogcmVmQm9vdFJlc3VsdC5jdHgsIHJvb3ROb2RlOiByZWZCb290UmVzdWx0LnJvb3ROb2RlIH0pO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChsb2dnZXIuZXJyb3IpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHVuTW91bnRpbmcgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlU2hvdWxkUmVuZGVyKG5vZGU6IEFydGVyeU5vZGUsIGN0eDogQ1RYKTogYm9vbGVhbiB7XG4gIGNvbnN0IGNvbmRpdGlvbiA9IG5vZGUuc2hvdWxkUmVuZGVyO1xuICBjb25zdCBwbGFjZWhvbGRlck5vZGU6IEFydGVyeU5vZGUgPSB7XG4gICAgaWQ6ICdwbGFjZWhvbGRlci1ub2RlJyxcbiAgICB0eXBlOiAnaHRtbC1lbGVtZW50JyxcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBwcm9wczogY29uZGl0aW9uID8geyBzaG91bGRSZW5kZXI6IGNvbmRpdGlvbiB9IDogdW5kZWZpbmVkLFxuICB9O1xuXG4gIGNvbnN0IHsgc2hvdWxkUmVuZGVyIH0gPSB1c2VJbnN0YW50aWF0ZVByb3BzKHBsYWNlaG9sZGVyTm9kZSwgY3R4KTtcblxuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKGNvbmRpdGlvbi50eXBlID09PSAnYXBpX2xvYWRpbmdfcHJvcGVydHknKSB7XG4gICAgcmV0dXJuIGNvbmRpdGlvbi5yZXZlcnQgPyAhc2hvdWxkUmVuZGVyIDogISFzaG91bGRSZW5kZXI7XG4gIH1cblxuICByZXR1cm4gISFzaG91bGRSZW5kZXI7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCwgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgdHlwZSB7IFRQcm9wcyB9IGZyb20gJ3JlYWN0LWpzeC1wYXJzZXInO1xuXG5pbXBvcnQgdXNlSW5zdGFudGlhdGVQcm9wcyBmcm9tICcuLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIEpTWE5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi9wYXRoLWNvbnRleHQnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBKU1hOb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gdXNlUmVhY3RKU1hQYXJzZXIoKTogUmVhY3QuQ29tcG9uZW50PFRQcm9wcz4gfCBudWxsIHtcbiAgY29uc3QgW2NvbSwgc2V0Q29tcG9uZW50XSA9IHVzZVN0YXRlPFJlYWN0LkNvbXBvbmVudDxUUHJvcHM+IHwgbnVsbD4obnVsbCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdW5Nb3VudGluZyA9IGZhbHNlO1xuICAgIC8vIHRvZG8gY2hhbmdlICdyZWFjdC1qc3gtcGFyc2VyJyBhcyBwbHVnaW5cbiAgICBTeXN0ZW0uaW1wb3J0KCdyZWFjdC1qc3gtcGFyc2VyJylcbiAgICAgIC50aGVuKChtb2R1bGUpID0+IHtcbiAgICAgICAgaWYgKHVuTW91bnRpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDb21wb25lbnQoKCkgPT4gbW9kdWxlLmRlZmF1bHQpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgIGxvZ2dlci5lcnJvcignZmFpbGVkIHRvIGxvYWQgZGVwZW5kYW5jZSByZWFjdC1qc3gtcGFyc2VyOicsIGVycik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHVuTW91bnRpbmcgPSB0cnVlO1xuICAgIH07XG4gIH0pO1xuXG4gIHJldHVybiBjb207XG59XG5cbmZ1bmN0aW9uIEpTWE5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgcHJvcHMgPSB1c2VJbnN0YW50aWF0ZVByb3BzKG5vZGUsIGN0eCk7XG4gIHVzZUxpZmVjeWNsZUhvb2sobm9kZS5saWZlY3ljbGVIb29rcyB8fCB7fSk7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG4gIGNvbnN0IFJlYWN0SlNYUGFyc2VyID0gdXNlUmVhY3RKU1hQYXJzZXIoKTtcblxuICBpZiAoIW5vZGUuanN4KSB7XG4gICAgbG9nZ2VyLmVycm9yKCdqc3ggc3RyaW5nIGlzIHJlcXVpcmVkLCcsIGBwbGVhc2UgY2hlY2sgdGhlIHNwZWMgb2Ygbm9kZTogJHtjdXJyZW50UGF0aH0uYCk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIVJlYWN0SlNYUGFyc2VyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdEpTWFBhcnNlciBhcyBhbnksIHtcbiAgICBiaW5kaW5nczogcHJvcHMsXG4gICAgcmVuZGVySW5XcmFwcGVyOiBmYWxzZSxcbiAgICBqc3g6IG5vZGUuanN4LFxuICAgIG9uRXJyb3I6IChlcnI6IGFueSkgPT4gY29uc29sZS5sb2coZXJyKSxcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEpTWE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2ssIHVzZVJlZlJlc3VsdCB9IGZyb20gJy4vaG9va3MnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFJlZk5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IFJlZk5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBSZWZOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIHVzZUxpZmVjeWNsZUhvb2sobm9kZS5saWZlY3ljbGVIb29rcyB8fCB7fSk7XG4gIGNvbnN0IHJlc3VsdCA9IHVzZVJlZlJlc3VsdChcbiAgICB7IGFydGVyeUlEOiBub2RlLmFydGVyeUlELCByZWZMb2FkZXI6IGN0eC5wbHVnaW5zLnJlZkxvYWRlciwgb3JwaGFuOiBub2RlLm9ycGhhbiB9LFxuICAgIGN0eCxcbiAgKTtcblxuICBpZiAoIXJlc3VsdCkge1xuICAgIGlmIChub2RlLmZhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGU6IG5vZGUuZmFsbGJhY2ssIGN0eCB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogcmVzdWx0LnJvb3ROb2RlLCBjdHg6IHJlc3VsdC5jdHggfSk7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgSFRNTE5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBDaGlsZHJlblJlbmRlciB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vayB9IGZyb20gJy4vaG9va3MnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4vcGF0aC1jb250ZXh0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogSFRNTE5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBIVE1MTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICBpZiAoIW5vZGUubmFtZSkge1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICduYW1lIHByb3BlcnR5IGlzIHJlcXVpcmVkIGluIGh0bWwgbm9kZSBzcGVjLCcsXG4gICAgICBgcGxlYXNlIGNoZWNrIHRoZSBzcGVjIG9mIG5vZGU6ICR7Y3VycmVudFBhdGh9LmAsXG4gICAgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghbm9kZS5jaGlsZHJlbiB8fCAhbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChub2RlLm5hbWUsIHByb3BzKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIG5vZGUubmFtZSxcbiAgICBwcm9wcyxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENoaWxkcmVuUmVuZGVyLCB7IG5vZGVzOiBub2RlLmNoaWxkcmVuIHx8IFtdLCBjdHggfSksXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IEhUTUxOb2RlUmVuZGVyO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBDb25zdGFudFByb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCB7IENUWCwgQXJ0ZXJ5Tm9kZSwgUGxhaW5TdGF0ZSwgTm9kZVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vcGF0aC1jb250ZXh0JztcbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uLy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VJdGVyYWJsZShpdGVyYWJsZVN0YXRlOiBQbGFpblN0YXRlLCBjdHg6IENUWCk6IEFycmF5PHVua25vd24+IHwgbnVsbCB7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG5cbiAgY29uc3QgZHVtbXlOb2RlOiBBcnRlcnlOb2RlID0ge1xuICAgIHR5cGU6ICdodG1sLWVsZW1lbnQnLFxuICAgIGlkOiAnZHVtbXlMb29wQ29udGFpbmVyJyxcbiAgICBuYW1lOiAnZGl2JyxcbiAgICBwcm9wczogeyBpdGVyYWJsZTogaXRlcmFibGVTdGF0ZSB9LFxuICB9O1xuXG4gIGNvbnN0IHsgaXRlcmFibGUgfSA9IHVzZUluc3RhbnRpYXRlUHJvcHMoZHVtbXlOb2RlLCBjdHgpO1xuXG4gIGlmICghQXJyYXkuaXNBcnJheShpdGVyYWJsZSkpIHtcbiAgICBjb25zdCBub2RlSUQgPSBjdXJyZW50UGF0aC5zcGxpdCgnLycpLnBvcCgpO1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICdzdGF0ZSBpcyBub3QgaXRlcmFibGUuJyxcbiAgICAgIGBMb29wQ29udGFpbmVyIG5vZGUgWyR7bm9kZUlEfV0gcmVxdWlyZSBhIGFycmF5IHR5cGUgc3RhdGUsYCxcbiAgICAgIC8vIHRvZG8gb3B0aW1pemUgdG9TdHJpbmcgb2YgaXRlcmFibGVcbiAgICAgIGBidXQgZ290OiAke2l0ZXJhYmxlfSxgLFxuICAgICAgJ3BsZWFzZSBjaGVjayB0aGUgZm9sbG93IHByb3BlcnR5IHNwZWM6XFxuJyxcbiAgICAgIGl0ZXJhYmxlU3RhdGUsXG4gICAgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBpdGVyYWJsZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEFwcHJvcHJpYXRlS2V5KGl0ZW06IHVua25vd24sIGxvb3BLZXk6IHN0cmluZywgaW5kZXg6IG51bWJlcik6IHN0cmluZyB8IG51bWJlciB7XG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGl0ZW0gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGl0ZW07XG4gIH1cblxuICBpZiAodHlwZW9mIGl0ZW0gPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiBpdGVtID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBpdGVtID09PSAnYm9vbGVhbicpIHtcbiAgICByZXR1cm4gaW5kZXg7XG4gIH1cblxuICBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0gIT09IG51bGwpIHtcbiAgICAvLyBqdXN0IGZvciBvdmVycmlkZSB0eXBlc2NyaXB0IFwiTm8gaW5kZXggc2lnbmF0dXJlXCIgZXJyb3JcbiAgICByZXR1cm4gUmVmbGVjdC5nZXQoaXRlbSwgbG9vcEtleSk7XG4gIH1cblxuICByZXR1cm4gaW5kZXg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB0cnlUb1Byb3BzKFxuICBzb3VyY2U6IHVua25vd24sXG4gIGluZGV4OiBudW1iZXIsXG4gIHRvUHJvcHM6IChpdGVtOiB1bmtub3duLCBpbmRleDogbnVtYmVyKSA9PiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPixcbiAgY3VycmVudFBhdGg6IHN0cmluZyxcbik6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgY29uc3QgdG9Qcm9wc1Jlc3VsdCA9IHRvUHJvcHMoc291cmNlLCBpbmRleCk7XG4gICAgaWYgKHR5cGVvZiB0b1Byb3BzUmVzdWx0ICE9PSAnb2JqZWN0JyAmJiAhdG9Qcm9wc1Jlc3VsdCkge1xuICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAndG9Qcm9wcyByZXN1bHQgc2hvdWxkIGJlIGFuIG9iamVjdCwgYnV0IGdvdDogJHt0b1Byb3BzUmVzdWx0fSwnLFxuICAgICAgICBgcGxlYXNlIGNoZWNrIHRoZSB0b1Byb3BzIHNwZWMgb2Ygbm9kZTogJHtjdXJyZW50UGF0aH0sYCxcbiAgICAgICAgJ3RoZSBjb3JyZXNwb25kaW5nIG5vZGUgd2lsbCBiZSBza2lwcGVkIGZvciByZW5kZXIuJyxcbiAgICAgICk7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9Qcm9wc1Jlc3VsdDtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnQW4gZXJyb3Igb2NjdXJyZWQgd2hpbGUgY2FsbGluZyB0b1Byb3BzIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXI6JyxcbiAgICAgIHNvdXJjZSxcbiAgICAgICdcXG4nLFxuICAgICAgYHBsZWFzZSBjaGVjayB0aGUgdG9Qcm9wcyBzcGVjIG9mIG5vZGU6ICR7Y3VycmVudFBhdGh9LGAsXG4gICAgICAndGhlIGNvcnJlc3BvbmRpbmcgbm9kZSB3aWxsIGJlIHNraXBwZWQgZm9yIHJlbmRlci4nLFxuICAgICk7XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5pbnRlcmZhY2UgVXNlTWVyZ2VkUHJvcHNMaXN0UGFyYW1zIHtcbiAgaXRlcmFibGVTdGF0ZTogUGxhaW5TdGF0ZTtcbiAgdG9Qcm9wczogKGl0ZW06IHVua25vd24pID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+O1xuICBvdGhlclByb3BzPzogTm9kZVByb3BlcnRpZXM7XG4gIGN0eDogQ1RYO1xuICBsb29wS2V5OiBzdHJpbmc7XG59XG5cbi8vIHVzZU1lcmdlZFByb3BzTGlzdCByZXR1cm4gYSBsaXN0IG9mIGBwcm9wc2AgYW5kIGBrZXlgIHdoaWNoIGNvdWxkIGJlIHVzZWQgZm9yIGl0ZXJhdGlvbixcbi8vIGVhY2ggYHByb3BzYCBtZXJnZWQgaXRlcmFibGVTdGF0ZSBhbmQgb3RoZXJQcm9wc1xuZXhwb3J0IGZ1bmN0aW9uIHVzZU1lcmdlZFByb3BzTGlzdCh7XG4gIGl0ZXJhYmxlU3RhdGUsXG4gIHRvUHJvcHMsXG4gIG90aGVyUHJvcHMsXG4gIGN0eCxcbiAgbG9vcEtleSxcbn06IFVzZU1lcmdlZFByb3BzTGlzdFBhcmFtcyk6IEFycmF5PFtSZWFjdC5LZXksIE5vZGVQcm9wZXJ0aWVzXT4gfCBudWxsIHtcbiAgY29uc3QgaXRlcmFibGUgPSB1c2VJdGVyYWJsZShpdGVyYWJsZVN0YXRlLCBjdHgpO1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuXG4gIGlmICghaXRlcmFibGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBpdGVyYWJsZVxuICAgIC5tYXA8W1JlYWN0LktleSwgTm9kZVByb3BlcnRpZXNdIHwgbnVsbD4oKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBjb25zdCBjb252ZXJ0ZWRQcm9wcyA9IHRyeVRvUHJvcHMoaXRlbSwgaW5kZXgsIHRvUHJvcHMsIGN1cnJlbnRQYXRoKTtcbiAgICAgIGlmICghY29udmVydGVkUHJvcHMpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbnZlcnQgaXRlcmFibGUgdG8gY29uc3RhbnQgcHJvcGVydHkgc3BlYyBmb3IgcmV1c2Ugb2YgTm9kZVJlbmRlclxuICAgICAgY29uc3QgY29uc3RQcm9wcyA9IE9iamVjdC5lbnRyaWVzKGNvbnZlcnRlZFByb3BzKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgQ29uc3RhbnRQcm9wZXJ0eT4+KFxuICAgICAgICAoY29uc3RQcm9wcywgW3Byb3BOYW1lLCB2YWx1ZV0pID0+IHtcbiAgICAgICAgICBjb25zdFByb3BzW3Byb3BOYW1lXSA9IHsgdHlwZTogJ2NvbnN0YW50X3Byb3BlcnR5JywgdmFsdWUgfTtcblxuICAgICAgICAgIHJldHVybiBjb25zdFByb3BzO1xuICAgICAgICB9LFxuICAgICAgICB7fSxcbiAgICAgICk7XG5cbiAgICAgIHJldHVybiBbZ2V0QXBwcm9wcmlhdGVLZXkoaXRlbSwgbG9vcEtleSwgaW5kZXgpLCBPYmplY3QuYXNzaWduKHt9LCBvdGhlclByb3BzLCBjb25zdFByb3BzKV07XG4gICAgfSlcbiAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbUmVhY3QuS2V5LCBOb2RlUHJvcGVydGllc10gPT4gISFwYWlyKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUNvbXBvc2VkUHJvcHNTcGVjKFxuICBjb21wb3NlZFN0YXRlOiB1bmtub3duLFxuICB0b1Byb3BzOiAoc3RhdGU6IHVua25vd24pID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBpbmRleDogbnVtYmVyLFxuICBvdGhlclByb3BzPzogTm9kZVByb3BlcnRpZXMsXG4pOiBOb2RlUHJvcGVydGllcyB7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGNvbXBvc2VkUHJvcHMgPSB0cnlUb1Byb3BzKGNvbXBvc2VkU3RhdGUsIGluZGV4LCB0b1Byb3BzLCBjdXJyZW50UGF0aCk7XG4gICAgY29uc3QgY29tcG9zZWRQcm9wc1NwZWMgPSBPYmplY3QuZW50cmllcyhjb21wb3NlZFByb3BzIHx8IHt9KS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgQ29uc3RhbnRQcm9wZXJ0eT4+KFxuICAgICAgKGFjYywgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgICAgIGFjY1trZXldID0ge1xuICAgICAgICAgIHR5cGU6ICdjb25zdGFudF9wcm9wZXJ0eScsXG4gICAgICAgICAgdmFsdWUsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBvdGhlclByb3BzLCBjb21wb3NlZFByb3BzU3BlYyk7XG4gIH0sIFtjb21wb3NlZFN0YXRlLCBvdGhlclByb3BzXSk7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ1RYLCBBcnRlcnlOb2RlLCBQbGFpblN0YXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IE5vZGVSZW5kZXIgZnJvbSAnLi4nO1xuaW1wb3J0IHsgdXNlTWVyZ2VkUHJvcHNMaXN0IH0gZnJvbSAnLi9oZWxwZXJzJztcbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuLi9wYXRoLWNvbnRleHQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb3BzIHtcbiAgaXRlcmFibGVTdGF0ZTogUGxhaW5TdGF0ZTtcbiAgbG9vcEtleTogc3RyaW5nO1xuICB0b1Byb3BzOiAoaXRlbTogdW5rbm93bikgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIG5vZGU6IEFydGVyeU5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBMb29wSW5kaXZpZHVhbCh7IGl0ZXJhYmxlU3RhdGUsIGxvb3BLZXksIG5vZGUsIGN0eCwgdG9Qcm9wcyB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwYXJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG4gIGNvbnN0IG1lcmdlZFByb3BzTGlzdCA9IHVzZU1lcmdlZFByb3BzTGlzdCh7XG4gICAgaXRlcmFibGVTdGF0ZSxcbiAgICB0b1Byb3BzLFxuICAgIGN0eCxcbiAgICBsb29wS2V5LFxuICAgIG90aGVyUHJvcHM6IG5vZGUucHJvcHMsXG4gIH0pO1xuXG4gIGlmICghbWVyZ2VkUHJvcHNMaXN0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICBSZWFjdC5GcmFnbWVudCxcbiAgICBudWxsLFxuICAgIG1lcmdlZFByb3BzTGlzdC5tYXAoKFtrZXksIHByb3BzXSwgaW5kZXgpOiBSZWFjdC5SZWFjdEVsZW1lbnQgPT4ge1xuICAgICAgY29uc3QgbmV3Tm9kZSA9IE9iamVjdC5hc3NpZ24oe30sIG5vZGUsIHsgcHJvcHMgfSk7XG5cbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgICAgeyB2YWx1ZTogYCR7cGFyZW50UGF0aH0vJHtpbmRleH1gLCBrZXkgfSxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IGtleSwgbm9kZTogbmV3Tm9kZSwgY3R4IH0pLFxuICAgICAgKTtcbiAgICB9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vcEluZGl2aWR1YWw7XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuXG5pbXBvcnQgdHlwZSB7IENvbXBvbmVudExvYWRlclBhcmFtLCBEeW5hbWljQ29tcG9uZW50LCBSZXBvc2l0b3J5IH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZENvbXBvbmVudEluUmVwb3NpdG9yeShcbiAgcmVwb3NpdG9yeTogUmVwb3NpdG9yeSxcbiAgeyBwYWNrYWdlTmFtZSwgcGFja2FnZVZlcnNpb24sIGV4cG9ydE5hbWUgfTogQ29tcG9uZW50TG9hZGVyUGFyYW0sXG4pOiBEeW5hbWljQ29tcG9uZW50IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgcGFja2FnZU5hbWVWZXJzaW9uID0gYCR7cGFja2FnZU5hbWV9QCR7cGFja2FnZVZlcnNpb259YDtcblxuICByZXR1cm4gcmVwb3NpdG9yeVtwYWNrYWdlTmFtZVZlcnNpb25dPy5bZXhwb3J0TmFtZSB8fCAnZGVmYXVsdCddO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3lzdGVtQ29tcG9uZW50TG9hZGVyKHtcbiAgcGFja2FnZU5hbWUsXG4gIGV4cG9ydE5hbWUsXG59OiBDb21wb25lbnRMb2FkZXJQYXJhbSk6IFByb21pc2U8RHluYW1pY0NvbXBvbmVudD4ge1xuICByZXR1cm4gU3lzdGVtLmltcG9ydChwYWNrYWdlTmFtZSlcbiAgICAudGhlbigoc3lzdGVtTW9kdWxlKSA9PiB7XG4gICAgICAvLyB0b2RvIGNhdGNoIHVuZGVmaW5lZCBlcnJvclxuICAgICAgcmV0dXJuIHN5c3RlbU1vZHVsZVtleHBvcnROYW1lIHx8ICdkZWZhdWx0J107XG4gICAgfSlcbiAgICAuY2F0Y2goKGVycm9yKSA9PiB7XG4gICAgICBsb2dnZXIuZXJyb3IoJ2ZhaWxlZCB0byBsb2FkIG5vZGUgY29tcG9uZW50LCcsIGVycm9yKTtcblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSk7XG59XG4iLCJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgeyBmaW5kQ29tcG9uZW50SW5SZXBvc2l0b3J5LCBzeXN0ZW1Db21wb25lbnRMb2FkZXIgfSBmcm9tICcuL2hlbHBlcic7XG5pbXBvcnQgdHlwZSB7IER5bmFtaWNDb21wb25lbnQsIFBsdWdpbnMsIFJlYWN0Q29tcG9uZW50Tm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlTm9kZUNvbXBvbmVudChcbiAgbm9kZTogUGljazxSZWFjdENvbXBvbmVudE5vZGUsICdwYWNrYWdlTmFtZScgfCAncGFja2FnZVZlcnNpb24nIHwgJ2V4cG9ydE5hbWUnPixcbiAgeyByZXBvc2l0b3J5LCBjb21wb25lbnRMb2FkZXIgfTogUGljazxQbHVnaW5zLCAncmVwb3NpdG9yeScgfCAnY29tcG9uZW50TG9hZGVyJz4sXG4pOiBEeW5hbWljQ29tcG9uZW50IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgW2xhenlMb2FkZWRDb21wb25lbnQsIHNldENvbXBvbmVudF0gPSB1c2VTdGF0ZTxEeW5hbWljQ29tcG9uZW50IHwgdW5kZWZpbmVkPigoKSA9PiB7XG4gICAgaWYgKCFyZXBvc2l0b3J5KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgcmV0dXJuIGZpbmRDb21wb25lbnRJblJlcG9zaXRvcnkocmVwb3NpdG9yeSwgbm9kZSk7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKGxhenlMb2FkZWRDb21wb25lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgdW5Nb3VudGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IGZpbmlhbExvYWRlciA9IGNvbXBvbmVudExvYWRlciB8fCBzeXN0ZW1Db21wb25lbnRMb2FkZXI7XG5cbiAgICBmaW5pYWxMb2FkZXIoe1xuICAgICAgcGFja2FnZU5hbWU6IG5vZGUucGFja2FnZU5hbWUsXG4gICAgICBwYWNrYWdlVmVyc2lvbjogbm9kZS5wYWNrYWdlVmVyc2lvbixcbiAgICAgIGV4cG9ydE5hbWU6IG5vZGUuZXhwb3J0TmFtZSxcbiAgICB9KVxuICAgICAgLnRoZW4oKGNvbXApID0+IHtcbiAgICAgICAgaWYgKHVuTW91bnRpbmcpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWNvbXApIHtcbiAgICAgICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICAgICBgZ290IGVtcHR5IGNvbXBvbmVudCBmb3IgcGFja2FnZTogJHtub2RlLnBhY2thZ2VOYW1lfSxgLFxuICAgICAgICAgICAgYGV4cG9ydE5hbWU6ICR7bm9kZS5leHBvcnROYW1lfSwgdmVyc2lvbjogJHtub2RlLnBhY2thZ2VWZXJzaW9ufWAsXG4gICAgICAgICAgICBgcGxlYXNlIGNoZWNrIHRoZSBzcGVjIGZvciBub2RlOiAke2N1cnJlbnRQYXRofS5gLFxuICAgICAgICAgICk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0Q29tcG9uZW50KCgpID0+IGNvbXApO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChsb2dnZXIuZXJyb3IpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHVuTW91bnRpbmcgPSB0cnVlO1xuICAgIH07XG4gIH0sIFtsYXp5TG9hZGVkQ29tcG9uZW50XSk7XG5cbiAgcmV0dXJuIGxhenlMb2FkZWRDb21wb25lbnQ7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgUHJvcHNXaXRoQ2hpbGRyZW4gfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IENUWCwgSFRNTE5vZGUsIFJlYWN0Q29tcG9uZW50Tm9kZSwgQ29tcG9zZU91dExheWVyIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHVzZUluc3RhbnRpYXRlUHJvcHMgZnJvbSAnLi4vLi4vdXNlLWluc3RhbnRpYXRlLXByb3BzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuLi9ob29rcyc7XG5pbXBvcnQgdXNlTm9kZUNvbXBvbmVudCBmcm9tICcuLi9ob29rcy91c2Utbm9kZS1jb21wb25lbnQnO1xuXG50eXBlIEhUTUxPdXRMYXllclJlbmRlclByb3BzID0gUHJvcHNXaXRoQ2hpbGRyZW48e1xuICBvdXRMYXllcjogT21pdDxIVE1MTm9kZSwgJ2NoaWxkcmVuJz47XG4gIGN0eDogQ1RYO1xufT47XG5cbmZ1bmN0aW9uIEhUTUxPdXRMYXllclJlbmRlcih7IG91dExheWVyLCBjdHgsIGNoaWxkcmVuIH06IEhUTUxPdXRMYXllclJlbmRlclByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHtcbiAgY29uc3QgcHJvcHMgPSB1c2VJbnN0YW50aWF0ZVByb3BzKG91dExheWVyLCBjdHgpO1xuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChvdXRMYXllci5uYW1lLCBwcm9wcywgY2hpbGRyZW4pO1xufVxuXG50eXBlIFJlYWN0Q29tcG9uZW50T3V0TGF5ZXJSZW5kZXJQcm9wcyA9IFByb3BzV2l0aENoaWxkcmVuPHtcbiAgb3V0TGF5ZXI6IE9taXQ8UmVhY3RDb21wb25lbnROb2RlLCAnY2hpbGRyZW4nPjtcbiAgY3R4OiBDVFg7XG59PjtcblxuZnVuY3Rpb24gUmVhY3RDb21wb25lbnRPdXRMYXllclJlbmRlcih7XG4gIG91dExheWVyLFxuICBjdHgsXG4gIGNoaWxkcmVuLFxufTogUmVhY3RDb21wb25lbnRPdXRMYXllclJlbmRlclByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhvdXRMYXllciwgY3R4KTtcbiAgY29uc3Qgbm9kZUNvbXBvbmVudCA9IHVzZU5vZGVDb21wb25lbnQob3V0TGF5ZXIsIGN0eC5wbHVnaW5zKTtcbiAgdXNlTGlmZWN5Y2xlSG9vayhvdXRMYXllci5saWZlY3ljbGVIb29rcyB8fCB7fSk7XG5cbiAgaWYgKCFub2RlQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChub2RlQ29tcG9uZW50LCBwcm9wcywgY2hpbGRyZW4pO1xufVxuXG50eXBlIFByb3BzID0gUHJvcHNXaXRoQ2hpbGRyZW48e1xuICBvdXRMYXllcj86IENvbXBvc2VPdXRMYXllcjtcbiAgY3R4OiBDVFg7XG59PjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gT3V0TGF5ZXJSZW5kZXIoeyBvdXRMYXllciwgY3R4LCBjaGlsZHJlbiB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBpZiAob3V0TGF5ZXI/LnR5cGUgPT09ICdodG1sLWVsZW1lbnQnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSFRNTE91dExheWVyUmVuZGVyLCB7IG91dExheWVyLCBjdHggfSwgY2hpbGRyZW4pO1xuICB9XG5cbiAgaWYgKG91dExheWVyPy50eXBlID09PSAncmVhY3QtY29tcG9uZW50Jykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0Q29tcG9uZW50T3V0TGF5ZXJSZW5kZXIsIHsgb3V0TGF5ZXIsIGN0eCB9LCBjaGlsZHJlbik7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdC5GcmFnbWVudCwgbnVsbCwgY2hpbGRyZW4pO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IENUWCwgUGxhaW5TdGF0ZSwgQ29tcG9zZWROb2RlLCBDb21wb3NlZE5vZGVDaGlsZCB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IGdldEFwcHJvcHJpYXRlS2V5LCB1c2VJdGVyYWJsZSwgdXNlQ29tcG9zZWRQcm9wc1NwZWMgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IE5vZGVSZW5kZXIgZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IE91dExheWVyUmVuZGVyIGZyb20gJy4vb3V0LWxheWVyLXJlbmRlcic7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vcGF0aC1jb250ZXh0JztcblxuaW50ZXJmYWNlIENvbXBvc2VkQ2hpbGRSZW5kZXJQcm9wcyB7XG4gIG5vZGU6IENvbXBvc2VkTm9kZUNoaWxkO1xuICBjb21wb3NlZFN0YXRlOiB1bmtub3duO1xuICBjdHg6IENUWDtcbiAgaW5kZXg6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gQ29tcG9zZWRDaGlsZFJlbmRlcih7XG4gIG5vZGUsXG4gIGNvbXBvc2VkU3RhdGUsXG4gIGN0eCxcbiAgaW5kZXgsXG59OiBDb21wb3NlZENoaWxkUmVuZGVyUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQge1xuICBjb25zdCBwcm9wU3BlYyA9IHVzZUNvbXBvc2VkUHJvcHNTcGVjKGNvbXBvc2VkU3RhdGUsIG5vZGUudG9Qcm9wcywgaW5kZXgsIG5vZGUucHJvcHMpO1xuICBjb25zdCBfbm9kZSA9IE9iamVjdC5hc3NpZ24oe30sIG5vZGUsIHsgcHJvcHM6IHByb3BTcGVjIH0pO1xuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGU6IF9ub2RlLCBjdHggfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcHMge1xuICBpdGVyYWJsZVN0YXRlOiBQbGFpblN0YXRlO1xuICBsb29wS2V5OiBzdHJpbmc7XG4gIG5vZGU6IENvbXBvc2VkTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIExvb3BDb21wb3NlZCh7IGl0ZXJhYmxlU3RhdGUsIGxvb3BLZXksIG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwYXJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG4gIGNvbnN0IGl0ZXJhYmxlID0gdXNlSXRlcmFibGUoaXRlcmFibGVTdGF0ZSwgY3R4KTtcblxuICBpZiAoIWl0ZXJhYmxlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICBSZWFjdC5GcmFnbWVudCxcbiAgICBudWxsLFxuICAgIGl0ZXJhYmxlLm1hcCgoY29tcG9zZWRTdGF0ZSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGtleSA9IGdldEFwcHJvcHJpYXRlS2V5KGNvbXBvc2VkU3RhdGUsIGxvb3BLZXksIGluZGV4KTtcblxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgICB7IHZhbHVlOiBgJHtwYXJlbnRQYXRofS8ke25vZGUuaWR9LyR7aW5kZXh9YCwga2V5OiBpbmRleCB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgICAgIE91dExheWVyUmVuZGVyLFxuICAgICAgICAgIHsga2V5LCBvdXRMYXllcjogbm9kZS5vdXRMYXllciwgY3R4IH0sXG4gICAgICAgICAgKG5vZGUubm9kZXMgfHwgbm9kZS5jaGlsZHJlbikubWFwKChjb21wb3NlZENoaWxkLCBpbmRleCk6IFJlYWN0LlJlYWN0RWxlbWVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChDb21wb3NlZENoaWxkUmVuZGVyLCB7XG4gICAgICAgICAgICAgIG5vZGU6IGNvbXBvc2VkQ2hpbGQsXG4gICAgICAgICAgICAgIGNvbXBvc2VkU3RhdGUsXG4gICAgICAgICAgICAgIGN0eCxcbiAgICAgICAgICAgICAgaW5kZXgsXG4gICAgICAgICAgICAgIGtleTogY29tcG9zZWRDaGlsZC5pZCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pLFxuICAgICAgICApLFxuICAgICAgKTtcbiAgICB9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vcENvbXBvc2VkO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCBMb29wSW5kaXZpZHVhbCBmcm9tICcuL2xvb3AtaW5kaXZpZHVhbCc7XG5pbXBvcnQgTG9vcENvbXBvc2VkIGZyb20gJy4vbG9vcC1jb21wb3NlZCc7XG5pbXBvcnQgdHlwZSB7IENUWCwgTG9vcENvbnRhaW5lck5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi4vaG9va3MnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBMb29wQ29udGFpbmVyTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIExvb3BOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIHVzZUxpZmVjeWNsZUhvb2sobm9kZS5saWZlY3ljbGVIb29rcyB8fCB7fSk7XG5cbiAgY29uc3QgeyBub2RlOiBMb29wZWROb2RlIH0gPSBub2RlO1xuXG4gIGlmIChMb29wZWROb2RlLnR5cGUgIT09ICdjb21wb3NlZC1ub2RlJyAmJiAndG9Qcm9wcycgaW4gbm9kZSkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KExvb3BJbmRpdmlkdWFsLCB7XG4gICAgICBpdGVyYWJsZVN0YXRlOiBub2RlLml0ZXJhYmxlU3RhdGUsXG4gICAgICBsb29wS2V5OiBub2RlLmxvb3BLZXksXG4gICAgICBub2RlOiBMb29wZWROb2RlLFxuICAgICAgdG9Qcm9wczogKHY6IHVua25vd24pID0+IG5vZGUudG9Qcm9wcyh2KSxcbiAgICAgIGN0eCxcbiAgICB9KTtcbiAgfVxuXG4gIGlmIChMb29wZWROb2RlLnR5cGUgPT09ICdjb21wb3NlZC1ub2RlJykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KExvb3BDb21wb3NlZCwge1xuICAgICAgaXRlcmFibGVTdGF0ZTogbm9kZS5pdGVyYWJsZVN0YXRlLFxuICAgICAgbG9vcEtleTogbm9kZS5sb29wS2V5LFxuICAgICAgbm9kZTogTG9vcGVkTm9kZSxcbiAgICAgIGN0eCxcbiAgICB9KTtcbiAgfVxuXG4gIGxvZ2dlci5lcnJvcignVW5yZWNvZ25pemVkIGxvb3Agbm9kZTonLCBub2RlKTtcblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTG9vcE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgcmVhY3QgZnJvbSAncmVhY3QnO1xuXG5jb25zdCBSb3V0ZUNvbnRleHQgPSByZWFjdC5jcmVhdGVDb250ZXh0PHN0cmluZz4oJy8nKTtcblxuZXhwb3J0IGRlZmF1bHQgUm91dGVDb250ZXh0O1xuIiwiLy8gdHJpbSBiZWdpbiBhbmQgbGFzdCBzbGFzaFxuZXhwb3J0IGZ1bmN0aW9uIHRyaW1TbGFzaChwYXRoOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gcGF0aC5yZXBsYWNlKC9eXFwvfFxcLyQvZywgJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQYXJhbUhvbGRlcihmcmFnbWVudDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiAvXjpbYS16QS1aX11bW2EtekEtWl8kMC05XSskLy50ZXN0KGZyYWdtZW50KTtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBtYXAgfSBmcm9tICdyeGpzJztcbmltcG9ydCB0eXBlIHsgTG9jYXRpb24gfSBmcm9tICdoaXN0b3J5JztcblxuaW1wb3J0IHsgaXNQYXJhbUhvbGRlciB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZXhhY3RseUNoZWNrKHBhdGg6IHN0cmluZywgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdGhGcmFnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gIGNvbnN0IHJvdXRlRnJhZ21lbnRzID0gY3VycmVudFJvdXRlUGF0aC5zcGxpdCgnLycpO1xuICBpZiAocGF0aEZyYWdtZW50cy5sZW5ndGggIT09IHJvdXRlRnJhZ21lbnRzLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBwYXRoRnJhZ21lbnRzLmV2ZXJ5KChmcmFnbWVudCwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXNQYXJhbUhvbGRlcihyb3V0ZUZyYWdtZW50c1tpbmRleF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnJhZ21lbnQgPT09IHJvdXRlRnJhZ21lbnRzW2luZGV4XTtcbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcmVmaXhDaGVjayhwYXRoOiBzdHJpbmcsIGN1cnJlbnRSb3V0ZVBhdGg6IHN0cmluZyk6IGJvb2xlYW4ge1xuICBjb25zdCBwYXRoRnJhZ21lbnRzID0gcGF0aC5zcGxpdCgnLycpO1xuICBjb25zdCByb3V0ZUZyYWdtZW50cyA9IGN1cnJlbnRSb3V0ZVBhdGguc3BsaXQoJy8nKTtcbiAgaWYgKHBhdGhGcmFnbWVudHMubGVuZ3RoIDwgcm91dGVGcmFnbWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHJvdXRlRnJhZ21lbnRzLmV2ZXJ5KChmcmFnbWVudCwgaW5kZXgpID0+IHtcbiAgICBpZiAoaXNQYXJhbUhvbGRlcihmcmFnbWVudCkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmcmFnbWVudCA9PT0gcGF0aEZyYWdtZW50c1tpbmRleF07XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB1c2VNYXRjaChsb2NhdGlvbiQ6IEJlaGF2aW9yU3ViamVjdDxMb2NhdGlvbj4sIGN1cnJlbnRSb3V0ZVBhdGg6IHN0cmluZywgZXhhY3RseTogYm9vbGVhbik6IGJvb2xlYW4ge1xuICBjb25zdCBbbWF0Y2gsIHNldE1hdGNoXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmliZSA9IGxvY2F0aW9uJFxuICAgICAgLnBpcGUoXG4gICAgICAgIG1hcCgoeyBwYXRobmFtZSB9KTogYm9vbGVhbiA9PiB7XG4gICAgICAgICAgcmV0dXJuIGV4YWN0bHkgPyBleGFjdGx5Q2hlY2socGF0aG5hbWUsIGN1cnJlbnRSb3V0ZVBhdGgpIDogcHJlZml4Q2hlY2socGF0aG5hbWUsIGN1cnJlbnRSb3V0ZVBhdGgpO1xuICAgICAgICB9KSxcbiAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoc2V0TWF0Y2gpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmliZS51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIG1hdGNoO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VNYXRjaDtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgUm91dGVQYXRoQ29udGV4dCBmcm9tICcuL3JvdXRlLXBhdGgtY29udGV4dCc7XG5pbXBvcnQgdXNlTWF0Y2ggZnJvbSAnLi91c2UtbWF0Y2gnO1xuaW1wb3J0IHsgdHJpbVNsYXNoIH0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi4vaG9va3MnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFJvdXRlTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IFJvdXRlTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIGJ1aWxkQ3VycmVudFBhdGgocGFyZW50UGF0aDogc3RyaW5nLCByb3V0ZVBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIGlmIChwYXJlbnRQYXRoID09PSAnLycpIHtcbiAgICByZXR1cm4gYC8ke3RyaW1TbGFzaChyb3V0ZVBhdGgpfWA7XG4gIH1cblxuICByZXR1cm4gYCR7cGFyZW50UGF0aH0vJHt0cmltU2xhc2gocm91dGVQYXRoKX1gO1xufVxuXG5mdW5jdGlvbiBSb3V0ZU5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcblxuICBjb25zdCBwYXJlbnRSb3V0ZVBhdGggPSB1c2VDb250ZXh0KFJvdXRlUGF0aENvbnRleHQpO1xuICBjb25zdCBjdXJyZW50Um91dGVQYXRoID0gYnVpbGRDdXJyZW50UGF0aChwYXJlbnRSb3V0ZVBhdGgsIG5vZGUucGF0aCk7XG4gIGNvbnN0IG1hdGNoID0gdXNlTWF0Y2goY3R4LmxvY2F0aW9uJCwgY3VycmVudFJvdXRlUGF0aCwgbm9kZS5leGFjdGx5ID8/IGZhbHNlKTtcblxuICBpZiAobWF0Y2gpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFJvdXRlUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50Um91dGVQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogbm9kZS5ub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSb3V0ZU5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdXNlSW5zdGFudGlhdGVQcm9wcyBmcm9tICcuLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuaW1wb3J0IHsgQ2hpbGRyZW5SZW5kZXIgfSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB0eXBlIHsgQ1RYLCBSZWFjdENvbXBvbmVudE5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgdXNlTm9kZUNvbXBvbmVudCBmcm9tICcuL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IFJlYWN0Q29tcG9uZW50Tm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3Qgbm9kZUNvbXBvbmVudCA9IHVzZU5vZGVDb21wb25lbnQobm9kZSwgY3R4LnBsdWdpbnMpO1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuXG4gIGlmICghbm9kZUNvbXBvbmVudCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG5vZGVDb21wb25lbnQsIHByb3BzKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIG5vZGVDb21wb25lbnQsXG4gICAgcHJvcHMsXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChDaGlsZHJlblJlbmRlciwgeyBub2Rlczogbm9kZS5jaGlsZHJlbiB8fCBbXSwgY3R4IH0pLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdENvbXBvbmVudE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgeyB1c2VTaG91bGRSZW5kZXIgfSBmcm9tICcuL2hvb2tzJztcbmltcG9ydCB7IENUWCwgQXJ0ZXJ5Tm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBKU1hOb2RlUmVuZGVyIGZyb20gJy4vanN4LW5vZGUtcmVuZGVyJztcbmltcG9ydCBSZWZOb2RlUmVuZGVyIGZyb20gJy4vcmVmLW5vZGUtcmVuZGVyJztcbmltcG9ydCBIVE1MTm9kZVJlbmRlciBmcm9tICcuL2h0bWwtbm9kZS1yZW5kZXInO1xuaW1wb3J0IExvb3BOb2RlUmVuZGVyIGZyb20gJy4vbG9vcC1ub2RlLXJlbmRlcic7XG5pbXBvcnQgUm91dGVOb2RlUmVuZGVyIGZyb20gJy4vcm91dGUtbm9kZS1yZW5kZXInO1xuaW1wb3J0IFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlciBmcm9tICcuL3JlYWN0LWNvbXBvbmVudC1ub2RlLXJlbmRlcic7XG5cbmludGVyZmFjZSBDaGlsZHJlblJlbmRlclByb3BzIHtcbiAgbm9kZXM6IEFydGVyeU5vZGVbXTtcbiAgY3R4OiBDVFg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBDaGlsZHJlblJlbmRlcih7IG5vZGVzLCBjdHggfTogQ2hpbGRyZW5SZW5kZXJQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBpZiAoIW5vZGVzLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgUmVhY3QuRnJhZ21lbnQsXG4gICAgbnVsbCxcbiAgICBub2Rlcy5tYXAoKG5vZGUpID0+IFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBrZXk6IG5vZGUuaWQsIG5vZGU6IG5vZGUsIGN0eCB9KSksXG4gICk7XG59XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IEFydGVyeU5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgY3VycmVudFBhdGggPSBgJHtwYXJlbnRQYXRofS8ke25vZGUuaWR9YDtcbiAgY29uc3Qgc2hvdWxkUmVuZGVyID0gdXNlU2hvdWxkUmVuZGVyKG5vZGUsIGN0eCk7XG5cbiAgaWYgKCFzaG91bGRSZW5kZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdyb3V0ZS1ub2RlJykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50UGF0aCB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSb3V0ZU5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAnbG9vcC1jb250YWluZXInKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KExvb3BOb2RlUmVuZGVyLCB7IG5vZGUsIGN0eCB9KSxcbiAgICApO1xuICB9XG5cbiAgaWYgKG5vZGUudHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSFRNTE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAncmVhY3QtY29tcG9uZW50Jykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50UGF0aCB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChSZWFjdENvbXBvbmVudE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAncmVmLW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlZk5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAnanN4LW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEpTWE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBsb2dnZXIuZXJyb3IoJ1VucmVjb2duaXplZCBub2RlIHR5cGUgb2Ygbm9kZTonLCBub2RlKTtcbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBBcnRlcnkgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IFBsdWdpbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgYm9vdFVwLCB7IEJvb3RSZXN1bHQgfSBmcm9tICcuL2luZGV4JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQm9vdFJlc3VsdChhcnRlcnk6IEFydGVyeSwgcGx1Z2lucz86IFBsdWdpbnMpOiBCb290UmVzdWx0IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgW3Jlc3VsdCwgc2V0UmVzdWx0XSA9IHVzZVN0YXRlPEJvb3RSZXN1bHQ+KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBsZXQgdW5Nb3VudGluZyA9IGZhbHNlO1xuXG4gICAgYm9vdFVwKHsgYXJ0ZXJ5LCBwbHVnaW5zIH0pXG4gICAgICAudGhlbigoYm9vdFJlc3VsdCkgPT4ge1xuICAgICAgICBpZiAoIXVuTW91bnRpbmcpIHtcbiAgICAgICAgICBzZXRSZXN1bHQoYm9vdFJlc3VsdCk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2gobG9nZ2VyLmVycm9yKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB1bk1vdW50aW5nID0gdHJ1ZTtcbiAgICB9O1xuICB9LCBbYXJ0ZXJ5XSk7XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZUltcGVyYXRpdmVIYW5kbGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgdHlwZSB7IEFydGVyeSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuXG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuL25vZGUtcmVuZGVyJztcbmltcG9ydCB0eXBlIHsgUGx1Z2lucywgQXJ0ZXJ5UmVuZGVyZXJDVFggfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB1c2VCb290UmVzdWx0IGZyb20gJy4vYm9vdC11cC91c2UtYm9vdC11cC1yZXN1bHQnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBhcnRlcnk6IEFydGVyeTtcbiAgcGx1Z2lucz86IFBsdWdpbnM7XG59XG5cbmZ1bmN0aW9uIFNjaGVtYVJlbmRlcihcbiAgeyBhcnRlcnksIHBsdWdpbnMgfTogUHJvcHMsXG4gIHJlZjogUmVhY3QuUmVmPEFydGVyeVJlbmRlcmVyQ1RYIHwgdW5kZWZpbmVkPixcbik6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCB7IGN0eCwgcm9vdE5vZGUgfSA9IHVzZUJvb3RSZXN1bHQoYXJ0ZXJ5LCBwbHVnaW5zKSB8fCB7fTtcblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKFxuICAgIHJlZixcbiAgICAoKSA9PiB7XG4gICAgICBpZiAoIWN0eCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7IGFwaVN0YXRlczogY3R4LmFwaVN0YXRlcywgc3RhdGVzOiBjdHguc3RhdGVzLCBoaXN0b3J5OiBjdHguaGlzdG9yeSB9O1xuICAgIH0sXG4gICAgW2N0eF0sXG4gICk7XG5cbiAgaWYgKCFjdHggfHwgIXJvb3ROb2RlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGU6IHJvb3ROb2RlLCBjdHg6IGN0eCB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuZm9yd2FyZFJlZjxBcnRlcnlSZW5kZXJlckNUWCB8IHVuZGVmaW5lZCwgUHJvcHM+KFNjaGVtYVJlbmRlcik7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgdHlwZSB7IEFydGVyeSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuXG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuL25vZGUtcmVuZGVyJztcbmltcG9ydCBib290VXAgZnJvbSAnLi9ib290LXVwJztcbmltcG9ydCB0eXBlIHsgUGx1Z2lucyB9IGZyb20gJy4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZW5kZXJBcnRlcnkge1xuICBwcml2YXRlIGFydGVyeTogQXJ0ZXJ5O1xuICBwcml2YXRlIHBsdWdpbnM6IFBsdWdpbnM7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKGFydGVyeTogQXJ0ZXJ5LCBwbHVnaW5zPzogUGx1Z2lucykge1xuICAgIHRoaXMuYXJ0ZXJ5ID0gYXJ0ZXJ5O1xuICAgIHRoaXMucGx1Z2lucyA9IHBsdWdpbnMgfHwge307XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVuZGVyKHJlbmRlclJvb3Q6IEVsZW1lbnQpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBjb25zdCB7IGN0eCwgcm9vdE5vZGUgfSA9IGF3YWl0IGJvb3RVcCh7XG4gICAgICBwbHVnaW5zOiB0aGlzLnBsdWdpbnMsXG4gICAgICBhcnRlcnk6IHRoaXMuYXJ0ZXJ5LFxuICAgIH0pO1xuXG4gICAgUmVhY3RET00ucmVuZGVyKFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiByb290Tm9kZSwgY3R4IH0pLCByZW5kZXJSb290KTtcbiAgfVxufVxuIiwiaW1wb3J0IEFydGVyeVJlbmRlcmVyIGZyb20gJy4vYXJ0ZXJ5LXJlbmRlcmVyJztcbmltcG9ydCBSZW5kZXJBcnRlcnkgZnJvbSAnLi9yZW5kZXItYXJ0ZXJ5JztcblxuLy8gdG9kbyBmaXggdGhpc1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1c2VOb2RlQ29tcG9uZW50IH0gZnJvbSAnLi9ub2RlLXJlbmRlci9ob29rcy91c2Utbm9kZS1jb21wb25lbnQnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyB1c2VJbnN0YW50aWF0ZVByb3BzIH0gZnJvbSAnLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBib290VXB9IGZyb20gJy4vYm9vdC11cCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHVzZUJvb3RSZXN1bHQgfSBmcm9tICcuL2Jvb3QtdXAvdXNlLWJvb3QtdXAtcmVzdWx0JztcblxuZXhwb3J0ICogZnJvbSAnLi90eXBlcyc7XG5leHBvcnQgeyBSZW5kZXJBcnRlcnksIEFydGVyeVJlbmRlcmVyIH07XG5leHBvcnQgZGVmYXVsdCBSZW5kZXJBcnRlcnk7XG4iXSwibmFtZXMiOlsiX19zcHJlYWRQcm9wcyIsImluc3RhbnRpYXRlIiwibWFwIiwic2hhcmUiLCJnZXRSZXNwb25zZVN0YXRlJCIsIkh1YiIsImluaXRBUElTdGF0ZSIsIlN0YXRlc0h1YkFQSSIsImRlc2VyaWFsaXplIiwiaW5pdGlhbGl6ZUxhenlTdGF0ZXMiLCJTdGF0ZXNIdWJTaGFyZWQiLCJOb2RlUHJvcHNDYWNoZSIsImdldEFQSVN0YXRlcyIsImdldFNoYXJlZFN0YXRlcyIsInNraXAiLCJQYXRoQ29udGV4dCIsIk5vZGVSZW5kZXIiLCJ1c2VBUElSZXN1bHRQcm9wcyIsInVzZUFQSUxvYWRpbmdQcm9wcyIsInVzZVNoYXJlZFN0YXRlUHJvcHMiLCJ1c2VJbnRlcm5hbEhvb2tQcm9wcyIsInVzZUluaGVyaXRlZFByb3BzIiwidXNlU2hhcmVkU3RhdGVNdXRhdGlvblByb3BzIiwidXNlUmVuZGVyUHJvcHMiLCJ1c2VMaW5rUHJvcHMiLCJib290VXAiLCJ1c2VJbnN0YW50aWF0ZVByb3BzIiwiTG9vcEluZGl2aWR1YWwiLCJMb29wQ29tcG9zZWQiLCJyZWFjdCIsIlJvdXRlUGF0aENvbnRleHQiLCJ1c2VNYXRjaCIsIlJvdXRlTm9kZVJlbmRlciIsIkxvb3BOb2RlUmVuZGVyIiwiSFRNTE5vZGVSZW5kZXIiLCJSZWFjdENvbXBvbmVudE5vZGVSZW5kZXIiLCJKU1hOb2RlUmVuZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFFQSxNQUFNLGNBQWMsTUFBTSxjQUFzQixNQUFNO01BRXRELElBQU8sdUJBQVE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQ0FmLHNCQUFzQixjQUF5RTtNQUM3RixRQUFNLFVBQTREO01BQUEsSUFDaEUsS0FBSyxDQUFDLFFBQTRDLE1BQWlDO01BQ2pGLFlBQU0sV0FBVyxhQUFhLFVBQVUsQ0FBQyxFQUFFO01BRTNDLGFBQU9BLHFDQUNGLFdBREU7TUFBQSxRQUVMLFNBQVMsTUFBTSxhQUFhLFFBQVEsQ0FBQztNQUFBLFFBQ3JDLE9BQU8sQ0FBQyxhQUEwQixhQUFzQztNQUN0RSx1QkFBYSxNQUFNLEdBQUcsRUFBRSxRQUFRLGFBQWEsVUFBVTtNQUFBO01BQ3pELFFBQ0EsVUFBVSxDQUFDLGdCQUFnQyxhQUFrRDtNQUMzRix1QkFBYSxTQUFTLEdBQUcsY0FBYztNQUFBO01BQ3pDO01BQ0Y7TUFDRjtNQUdGLFNBQU8sSUFBSSxNQUFtRCxJQUFJLE9BQU87TUFDM0U7TUFFQSxJQUFPLHFCQUFROztNQ3JCUixrQkFBa0IsR0FBcUI7TUFDNUMsU0FBTyxPQUFPLFVBQVUsU0FBUyxLQUFLLENBQUMsTUFBTTtNQUMvQztNQUVPLG9CQUFvQixHQUFxQjtNQUM5QyxNQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssT0FBTyxNQUFNLFlBQVksTUFBTSxNQUFNO01BQ3ZELFdBQU87TUFBQTtNQUdULE1BQUksVUFBVSxLQUFLLFFBQVEsSUFBSSxHQUFHLE1BQU0sTUFBTSw0QkFBNEI7TUFDeEUsV0FBTztNQUFBO01BR1QsTUFBSSxPQUFPLEtBQUssQ0FBQyxFQUFFLFdBQVcsS0FBSyxVQUFVLEtBQUssVUFBVSxLQUFLLFVB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
