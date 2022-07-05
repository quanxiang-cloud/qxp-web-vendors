System.register(['react', '@one-for-all/utils', 'history', 'rxjs', 'rxjs/operators', 'rxjs/ajax', 'react-dom'], (function (exports) {
  'use strict';
  var React, useRef, useState, useEffect, useMemo, useContext, useImperativeHandle, logger, createBrowserHistory, switchMap, share, map, catchError, of, BehaviorSubject, Subject, merge, noop, from, firstValueFrom, combineLatest, take, last, skip$1, tap, distinctUntilKeyChanged, distinctUntilChanged, map$1, filter, share$1, skip, delay, ajax, ReactDOM;
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

      var __defProp$3 = Object.defineProperty;
      var __defProps$3 = Object.defineProperties;
      var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
      var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
      var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
      var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$3 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$4.call(b, prop))
            __defNormalProp$3(a, prop, b[prop]);
        if (__getOwnPropSymbols$4)
          for (var prop of __getOwnPropSymbols$4(b)) {
            if (__propIsEnum$4.call(b, prop))
              __defNormalProp$3(a, prop, b[prop]);
          }
        return a;
      };
      var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
      function getAPIStates(statesHubAPI) {
        const handler = {
          get: (target, p) => {
            const apiState = statesHubAPI.getState$(p).getValue();
            return __spreadProps$3(__spreadValues$3({}, apiState), {
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
      const initialState = { result: void 0, error: void 0, loading: false };
      function getResponseState$(request$, responseAdapter) {
        const state$ = new BehaviorSubject(initialState);
        const response$ = http(request$);
        response$.pipe(map$1(({ result, error }) => ({ result, error, loading: false })), map$1((apiState) => {
          if (!responseAdapter) {
            return apiState;
          }
          const transformed = responseAdapter({ body: apiState.result, error: apiState.error });
          return __spreadProps$2(__spreadValues$2({}, transformed), { loading: apiState.loading });
        })).subscribe(state$);
        request$.pipe(filter(() => state$.getValue().loading === false), map$1(() => __spreadProps$2(__spreadValues$2({}, state$.getValue()), { loading: true }))).subscribe(state$);
        return state$;
      }
      var response_default = getResponseState$;

      var __getOwnPropSymbols$2 = Object.getOwnPropertySymbols;
      var __hasOwnProp$2 = Object.prototype.hasOwnProperty;
      var __propIsEnum$2 = Object.prototype.propertyIsEnumerable;
      var __objRest = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp$2.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols$2)
          for (var prop of __getOwnPropSymbols$2(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum$2.call(source, prop))
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
            return __spreadProps$1(__spreadValues$1({}, initializer), { stateID });
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
          return __spreadProps(__spreadValues({}, acc), {
            [deps[index].depID]: dep$.value
          });
        }, {});
        const state$ = new BehaviorSubject(convertState({
          state: initialDeps,
          convertor,
          fallback,
          propName
        }));
        combineLatest(deps$).pipe(map((_deps) => {
          const updatedDeps = _deps.reduce((acc, _dep, index) => {
            return __spreadProps(__spreadValues({}, acc), {
              [deps[index].depID]: _dep
            });
          }, {});
          return convertState({
            state: updatedDeps,
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
          logger.error("An error occurred while calling toProps with the following parameter:", source, "\n", "error:", error, "\n", `please check the toProps spec of node: ${currentPath},`, "the corresponding node will be skipped for render.");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9wYXRoLWNvbnRleHQudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9hcGktc3RhdGVzLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvZGVzZXJpYWxpemUvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9kZXNlcmlhbGl6ZS9pbnN0YW50aWF0ZS50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2Rlc2VyaWFsaXplL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaHR0cC9odHRwLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaHR0cC9yZXNwb25zZS50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2luaXQtYXBpLXN0YXRlLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvc3RhdGVzLWh1Yi1hcGkudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9zaGFyZWQtc3RhdGVzLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvc3RhdGVzLWh1Yi1zaGFyZWQudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9pbml0aWFsaXplLWxhenktc2hhcmVkLXN0YXRlcy50cyIsIi4uLy4uLy4uL3NyYy9ib290LXVwL2Rlc2VyaWFsaXplL3BhcnNlLWluaGVyaXQtcHJvcGVydHkudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC9ub2RlLXByb3BzLWNhY2hlLnRzIiwiLi4vLi4vLi4vc3JjL2Jvb3QtdXAvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1jb25zdGFudC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1hcGktcmVzdWx0LXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtYXBpLWxvYWRpbmctcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1hcGktaW52b2tlLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2Utc2hhcmVkLXN0YXRlLXByb3BzLnRzIiwiLi4vLi4vLi4vc3JjL3VzZS1pbnN0YW50aWF0ZS1wcm9wcy91c2UtZnVuYy1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLXNoYXJlZC1zdGF0ZS1tdXRhdGlvbi50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWludGVybmFsLWhvb2stcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1yZW5kZXItcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL3VzZS1jb21wdXRlZC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWluaGVyaXRlZC1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy91c2UtaW5zdGFudGlhdGUtcHJvcHMvdXNlLWxpbmstcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvdXNlLWluc3RhbnRpYXRlLXByb3BzL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2hvb2tzL2luZGV4LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2pzeC1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yZWYtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaHRtbC1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9sb29wLW5vZGUtcmVuZGVyL2hlbHBlcnMudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9sb29wLWluZGl2aWR1YWwudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaG9va3MvaGVscGVyLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9sb29wLW5vZGUtcmVuZGVyL291dC1sYXllci1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvbG9vcC1ub2RlLXJlbmRlci9sb29wLWNvbXBvc2VkLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL2xvb3Atbm9kZS1yZW5kZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvcm91dGUtbm9kZS1yZW5kZXIvcm91dGUtcGF0aC1jb250ZXh0LnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL3JvdXRlLW5vZGUtcmVuZGVyL3V0aWxzLnRzIiwiLi4vLi4vLi4vc3JjL25vZGUtcmVuZGVyL3JvdXRlLW5vZGUtcmVuZGVyL3VzZS1tYXRjaC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yb3V0ZS1ub2RlLXJlbmRlci9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9ub2RlLXJlbmRlci9yZWFjdC1jb21wb25lbnQtbm9kZS1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvbm9kZS1yZW5kZXIvaW5kZXgudHMiLCIuLi8uLi8uLi9zcmMvYm9vdC11cC91c2UtYm9vdC11cC1yZXN1bHQudHMiLCIuLi8uLi8uLi9zcmMvYXJ0ZXJ5LXJlbmRlcmVyLnRzIiwiLi4vLi4vLi4vc3JjL3JlbmRlci1hcnRlcnkudHMiLCIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuY29uc3QgUGF0aENvbnRleHQgPSBSZWFjdC5jcmVhdGVDb250ZXh0PHN0cmluZz4oJ1JPT1QnKTtcblxuZXhwb3J0IGRlZmF1bHQgUGF0aENvbnRleHQ7XG4iLCJpbXBvcnQgeyBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IEFQSUZldGNoQ2FsbGJhY2sgfSBmcm9tICcuLic7XG5pbXBvcnQgeyBBUElTdGF0ZVdpdGhGZXRjaCwgQVBJU3RhdGUsIFN0YXRlc0h1YkFQSSwgUmF3RmV0Y2hPcHRpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGdldEFQSVN0YXRlcyhzdGF0ZXNIdWJBUEk6IFN0YXRlc0h1YkFQSSk6IFJlYWRvbmx5PFJlY29yZDxzdHJpbmcsIEFQSVN0YXRlV2l0aEZldGNoPj4ge1xuICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgQVBJU3RhdGU+Pj4gPSB7XG4gICAgZ2V0OiAodGFyZ2V0OiBSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBBUElTdGF0ZT4+LCBwOiBzdHJpbmcpOiBBUElTdGF0ZVdpdGhGZXRjaCA9PiB7XG4gICAgICBjb25zdCBhcGlTdGF0ZSA9IHN0YXRlc0h1YkFQSS5nZXRTdGF0ZSQocCkuZ2V0VmFsdWUoKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uYXBpU3RhdGUsXG4gICAgICAgIHJlZnJlc2g6ICgpID0+IHN0YXRlc0h1YkFQSS5yZWZyZXNoKHApLFxuICAgICAgICBmZXRjaDogKGZldGNoUGFyYW1zOiBGZXRjaFBhcmFtcywgY2FsbGJhY2s/OiBBUElGZXRjaENhbGxiYWNrKTogdm9pZCA9PiB7XG4gICAgICAgICAgc3RhdGVzSHViQVBJLmZldGNoKHAsIHsgcGFyYW1zOiBmZXRjaFBhcmFtcywgY2FsbGJhY2sgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJhd0ZldGNoOiAocmF3RmV0Y2hPcHRpb246IFJhd0ZldGNoT3B0aW9uLCBjYWxsYmFjaz86IEFQSUZldGNoQ2FsbGJhY2sgfCB1bmRlZmluZWQpOiB2b2lkID0+IHtcbiAgICAgICAgICBzdGF0ZXNIdWJBUEkucmF3RmV0Y2gocCwgcmF3RmV0Y2hPcHRpb24pO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0sXG4gIH07XG5cbiAgcmV0dXJuIG5ldyBQcm94eTxSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCBBUElTdGF0ZVdpdGhGZXRjaD4+Pih7fSwgaGFuZGxlcik7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGdldEFQSVN0YXRlcztcbiIsImltcG9ydCB0eXBlICogYXMgQXJ0ZXJ5U3BlYyBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuaW1wb3J0IHsgVmVyc2F0aWxlRnVuYywgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBpc09iamVjdChuOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobikgPT09ICdbb2JqZWN0IE9iamVjdF0nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNGdW5jU3BlYyhuOiB1bmtub3duKTogYm9vbGVhbiB7XG4gIGlmICghaXNPYmplY3QobikgfHwgdHlwZW9mIG4gIT09ICdvYmplY3QnIHx8IG4gPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoJ3R5cGUnIGluIG4gJiYgUmVmbGVjdC5nZXQobiwgJ3R5cGUnKSA9PT0gJ3N0YXRlX2NvbnZlcnRfZXhwcmVzc2lvbicpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChPYmplY3Qua2V5cyhuKS5sZW5ndGggPT09IDMgJiYgJ3R5cGUnIGluIG4gJiYgJ2FyZ3MnIGluIG4gJiYgJ2JvZHknIGluIG4pIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gaW5zdGFudGlhdGVTdGF0ZUV4cHJlc3Npb24oZXhwcmVzc2lvbjogc3RyaW5nLCBjdHg6IHVua25vd24pOiBTdGF0ZUNvbnZlcnRvciB7XG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oJ3N0YXRlJywgYHJldHVybiAke2V4cHJlc3Npb259YCkuYmluZChjdHgpO1xuICAgIGZuLnRvU3RyaW5nID0gKCkgPT5cbiAgICAgIFsnJywgJ2Z1bmN0aW9uIHdyYXBwZWRTdGF0ZUNvbnZlcnRvcihzdGF0ZSkgeycsIGBcXHRyZXR1cm4gJHtleHByZXNzaW9ufWAsICd9J10uam9pbignXFxuJyk7XG5cbiAgICByZXR1cm4gZm47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgWydmYWlsZWQgdG8gaW5zdGFudGlhdGUgc3RhdGUgY29udmVydCBleHByZXNzaW9uOicsICdcXG4nLCBleHByZXNzaW9uLCAnXFxuJywgZXJyb3JdLmpvaW4oJycpLFxuICAgICk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc3RhbnRpYXRlRnVuY1NwZWMoXG4gIHNwZWM6IEFydGVyeVNwZWMuQmFzZUZ1bmN0aW9uU3BlYyB8IEFydGVyeVNwZWMuU3RhdGVDb252ZXJ0RXhwcmVzc2lvbixcbiAgY3R4OiB1bmtub3duLFxuKTogVmVyc2F0aWxlRnVuYyB7XG4gIGlmICgnZXhwcmVzc2lvbicgaW4gc3BlYyAmJiBzcGVjLnR5cGUgPT09ICdzdGF0ZV9jb252ZXJ0X2V4cHJlc3Npb24nKSB7XG4gICAgcmV0dXJuIGluc3RhbnRpYXRlU3RhdGVFeHByZXNzaW9uKHNwZWMuZXhwcmVzc2lvbiwgY3R4KTtcbiAgfVxuXG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgY29uc3QgZm4gPSBuZXcgRnVuY3Rpb24oc3BlYy5hcmdzLCBzcGVjLmJvZHkpLmJpbmQoY3R4KTtcbiAgICBmbi50b1N0cmluZyA9ICgpID0+IFsnJywgYGZ1bmN0aW9uIHdyYXBwZWRGdW5jKCR7c3BlYy5hcmdzfSkge2AsIGBcXHQke3NwZWMuYm9keX1gLCAnfScsICcnXS5qb2luKCdcXG4nKTtcbiAgICByZXR1cm4gZm47XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgW1xuICAgICAgICAnZmFpbGVkIHRvIGluc3RhbnRpYXRlIGZ1bmN0aW9uIG9mIGZvbGxvd2luZyBzcGVjOicsXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnc3BlYy5hcmdzOicsXG4gICAgICAgIHNwZWMuYXJncyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgICdzcGVjLmJvZHk6JyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIHNwZWMuYm9keSxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIGVycm9yLFxuICAgICAgXS5qb2luKCcnKSxcbiAgICApO1xuICB9XG59XG4iLCJpbXBvcnQgeyBpbnN0YW50aWF0ZUZ1bmNTcGVjLCBpc09iamVjdCwgaXNGdW5jU3BlYyB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBpbnN0YW50aWF0ZShuOiB1bmtub3duLCBjdHg6IHVua25vd24pOiB1bmtub3duIHtcbiAgaWYgKCFpc09iamVjdChuKSB8fCB0eXBlb2YgbiAhPT0gJ29iamVjdCcgfHwgbiA9PT0gbnVsbCkge1xuICAgIHJldHVybiBuO1xuICB9XG5cbiAgT2JqZWN0LmVudHJpZXMobikuZm9yRWFjaCgoW2tleSwgdl0pID0+IHtcbiAgICBpZiAoaXNGdW5jU3BlYyh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQobiwga2V5LCBpbnN0YW50aWF0ZUZ1bmNTcGVjKHYsIGN0eCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChpc09iamVjdCh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQobiwga2V5LCBpbnN0YW50aWF0ZSh2LCBjdHgpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSkge1xuICAgICAgUmVmbGVjdC5zZXQoXG4gICAgICAgIG4sXG4gICAgICAgIGtleSxcbiAgICAgICAgdi5tYXAoKF92KSA9PiBpbnN0YW50aWF0ZShfdiwgY3R4KSksXG4gICAgICApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIG47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluc3RhbnRpYXRlO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB7IEFydGVyeVJlbmRlcmVyQ1RYIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5pbXBvcnQgaW5zdGFudGlhdGUgZnJvbSAnLi9pbnN0YW50aWF0ZSc7XG5cbmZ1bmN0aW9uIGRlc2VyaWFsaXplKG46IHVua25vd24sIGN0eDogQXJ0ZXJ5UmVuZGVyZXJDVFggfCB1bmRlZmluZWQpOiB1bmtub3duIHwgbnVsbCB7XG4gIHRyeSB7XG4gICAgaWYgKHdpbmRvdy5zdHJ1Y3R1cmVkQ2xvbmUpIHtcbiAgICAgIHJldHVybiBpbnN0YW50aWF0ZSh3aW5kb3cuc3RydWN0dXJlZENsb25lKG4pLCBjdHgpO1xuICAgIH1cblxuICAgIHJldHVybiBpbnN0YW50aWF0ZShKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG4pKSwgY3R4KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ2Rlc2VyaWFsaXplIGZhaWxlZDonLCBlcnJvcik7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVzZXJpYWxpemU7XG4iLCJpbXBvcnQgeyBjYXRjaEVycm9yLCBtYXAsIE9ic2VydmFibGUsIG9mLCBzaGFyZSwgc3dpdGNoTWFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBhamF4LCBBamF4Q29uZmlnLCBBamF4UmVzcG9uc2UgfSBmcm9tICdyeGpzL2FqYXgnO1xuXG5pbXBvcnQgdHlwZSB7IEFQSVN0YXRlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG50eXBlIFJlc3BvbnNlID0gT21pdDxBUElTdGF0ZSwgJ2xvYWRpbmcnPjtcbnR5cGUgUmVzcG9uc2UkID0gT2JzZXJ2YWJsZTxSZXNwb25zZT47XG5cbi8vIHRvZG8gc3VwcG9ydCByZXRyeSBhbmQgdGltZW91dFxuZnVuY3Rpb24gc2VuZFJlcXVlc3QoYWpheFJlcXVlc3Q6IEFqYXhDb25maWcpOiBSZXNwb25zZSQge1xuICByZXR1cm4gYWpheChhamF4UmVxdWVzdCkucGlwZShcbiAgICBtYXA8QWpheFJlc3BvbnNlPHVua25vd24+LCBSZXNwb25zZT4oKHsgcmVzcG9uc2UgfSkgPT4gKHsgcmVzdWx0OiByZXNwb25zZSwgZXJyb3I6IHVuZGVmaW5lZCB9KSksXG4gICAgY2F0Y2hFcnJvcigoZXJyb3IpID0+IHtcbiAgICAgIHJldHVybiBvZih7IGVycm9yOiBlcnJvciwgZGF0YTogdW5kZWZpbmVkIH0pO1xuICAgIH0pLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBodHRwKHJlcXVlc3QkOiBPYnNlcnZhYmxlPEFqYXhDb25maWc+KTogUmVzcG9uc2UkIHtcbiAgY29uc3QgcmVzcG9uc2UkOiBSZXNwb25zZSQgPSByZXF1ZXN0JC5waXBlKHN3aXRjaE1hcChzZW5kUmVxdWVzdCksIHNoYXJlKCkpO1xuXG4gIHJldHVybiByZXNwb25zZSQ7XG59XG4iLCJpbXBvcnQgeyBSZXNwb25zZUFkYXB0ZXIgfSBmcm9tICdAb25lLWZvci1hbGwvYXBpLXNwZWMtYWRhcHRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IEFqYXhDb25maWcgfSBmcm9tICdyeGpzL2FqYXgnO1xuaW1wb3J0IHsgbWFwLCBmaWx0ZXIgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB0eXBlIHsgQVBJU3RhdGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmltcG9ydCBodHRwIGZyb20gJy4vaHR0cCc7XG5cbi8vIEFQSSBTdGF0ZSBUYWJsZVxuLypcbiAgICB8ICAgICB8IGxvYWRpbmcgfCAgcmVzdWx0ICAgfCAgIGVycm9yICAgfFxuICAgIHwgLS0tIHwgOi0tLS0tOiB8IDotLS0tLS0tOiB8IDotLS0tLS0tOiB8XG4gICAgfCAxICAgfCAgZmFsc2UgIHwgdW5kZWZpbmVkIHwgdW5kZWZpbmVkIHxcbiAgICB8IDIgICB8ICB0cnVlICAgfCB1bmRlZmluZWQgfCB1bmRlZmluZWQgfFxu4pSM4pSA4pSA4pa6fCAzICAgfCAgZmFsc2UgIHwgICAge30gICAgIHwgdW5kZWZpbmVkIHzil4TilIDilIDilIDilIDilJBcbuKUlOKUgOKUgOKUgHwgNCAgIHwgIHRydWUgICB8ICAgIHt9ICAgICB8IHVuZGVmaW5lZCB8ICAgICDilIJcbiAgICB8IDUgICB8ICBmYWxzZSAgfCB1bmRlZmluZWQgfCAgICB4eHggICAgfCAgICAg4pSCXG4gICAgfCA2ICAgfCAgdHJ1ZSAgIHwgdW5kZWZpbmVkIHwgICAgeHh4ICAgIHzilIDilIDilIDilIDilIDilJhcbiovXG5leHBvcnQgY29uc3QgaW5pdGlhbFN0YXRlOiBBUElTdGF0ZSA9IHsgcmVzdWx0OiB1bmRlZmluZWQsIGVycm9yOiB1bmRlZmluZWQsIGxvYWRpbmc6IGZhbHNlIH07XG5cbmZ1bmN0aW9uIGdldFJlc3BvbnNlU3RhdGUkKFxuICByZXF1ZXN0JDogT2JzZXJ2YWJsZTxBamF4Q29uZmlnPixcbiAgcmVzcG9uc2VBZGFwdGVyPzogUmVzcG9uc2VBZGFwdGVyLFxuKTogQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPiB7XG4gIGNvbnN0IHN0YXRlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8QVBJU3RhdGU+KGluaXRpYWxTdGF0ZSk7XG4gIGNvbnN0IHJlc3BvbnNlJCA9IGh0dHAocmVxdWVzdCQpO1xuXG4gIHJlc3BvbnNlJFxuICAgIC5waXBlKFxuICAgICAgbWFwKCh7IHJlc3VsdCwgZXJyb3IgfSkgPT4gKHsgcmVzdWx0LCBlcnJvciwgbG9hZGluZzogZmFsc2UgfSkpLFxuICAgICAgbWFwPEFQSVN0YXRlLCBBUElTdGF0ZT4oKGFwaVN0YXRlKSA9PiB7XG4gICAgICAgIGlmICghcmVzcG9uc2VBZGFwdGVyKSB7XG4gICAgICAgICAgcmV0dXJuIGFwaVN0YXRlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWQgPSByZXNwb25zZUFkYXB0ZXIoeyBib2R5OiBhcGlTdGF0ZS5yZXN1bHQsIGVycm9yOiBhcGlTdGF0ZS5lcnJvciB9KTtcblxuICAgICAgICByZXR1cm4geyAuLi50cmFuc2Zvcm1lZCwgbG9hZGluZzogYXBpU3RhdGUubG9hZGluZyB9O1xuICAgICAgfSksXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoc3RhdGUkKTtcblxuICByZXF1ZXN0JFxuICAgIC5waXBlKFxuICAgICAgZmlsdGVyKCgpID0+IHN0YXRlJC5nZXRWYWx1ZSgpLmxvYWRpbmcgPT09IGZhbHNlKSxcbiAgICAgIG1hcCgoKSA9PiAoeyAuLi5zdGF0ZSQuZ2V0VmFsdWUoKSwgbG9hZGluZzogdHJ1ZSB9KSksXG4gICAgKVxuICAgIC5zdWJzY3JpYmUoc3RhdGUkKTtcblxuICByZXR1cm4gc3RhdGUkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXRSZXNwb25zZVN0YXRlJDtcbiIsImltcG9ydCB7IG1lcmdlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBBamF4Q29uZmlnIH0gZnJvbSAncnhqcy9hamF4JztcbmltcG9ydCB7IG1hcCwgZmlsdGVyLCBzaGFyZSwgc2tpcCwgZGVsYXkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgdHlwZSB7IEFQSVNwZWNBZGFwdGVyLCBGZXRjaFBhcmFtcyB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcblxuaW1wb3J0IHR5cGUgeyBGZXRjaE9wdGlvbiwgQVBJU3RhdGUkV2l0aEFjdGlvbnMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgZ2V0UmVzcG9uc2VTdGF0ZSQgZnJvbSAnLi9odHRwL3Jlc3BvbnNlJztcblxuZnVuY3Rpb24gaW5pdEFQSVN0YXRlKGFwaUlEOiBzdHJpbmcsIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcik6IEFQSVN0YXRlJFdpdGhBY3Rpb25zIHtcbiAgY29uc3QgcmF3UGFyYW1zJCA9IG5ldyBTdWJqZWN0PEFqYXhDb25maWc+KCk7XG4gIGNvbnN0IHBhcmFtcyQgPSBuZXcgU3ViamVjdDxGZXRjaFBhcmFtcyB8IHVuZGVmaW5lZD4oKTtcbiAgY29uc3QgcmVxdWVzdCQgPSBwYXJhbXMkLnBpcGUoXG4gICAgLy8gaXQgaXMgYWRhcHRlcidzIHJlc3BvbnNpYmlsaXR5IHRvIGhhbmRsZSBidWlsZCBlcnJvclxuICAgIC8vIGlmIGEgZXJyb3Igb2NjdXJyZWQsIGJ1aWxkIHNob3VsZCByZXR1cm4gdW5kZWZpbmVkXG4gICAgbWFwKChwYXJhbXMpID0+IGFwaVNwZWNBZGFwdGVyLmJ1aWxkKGFwaUlELCBwYXJhbXMpKSxcbiAgICBmaWx0ZXIoQm9vbGVhbiksXG4gICAgc2hhcmUoKSxcbiAgKTtcblxuICBsZXQgX2xhdGVzdEZldGNoT3B0aW9uOiBGZXRjaE9wdGlvbiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgY29uc3QgYXBpU3RhdGUkID0gZ2V0UmVzcG9uc2VTdGF0ZSQobWVyZ2UocmVxdWVzdCQsIHJhd1BhcmFtcyQpLCBhcGlTcGVjQWRhcHRlci5yZXNwb25zZUFkYXB0ZXIpO1xuXG4gIC8vIGV4ZWN1dGUgZmV0Y2ggY2FsbGJhY2sgYWZ0ZXIgbmV3IGByZXN1bHRgIGVtaXR0ZWQgZnJvbSBhcGlTdGF0ZSRcbiAgYXBpU3RhdGUkXG4gICAgLnBpcGUoXG4gICAgICBza2lwKDEpLFxuICAgICAgZmlsdGVyKCh7IGxvYWRpbmcgfSkgPT4gIWxvYWRpbmcpLFxuICAgICAgLy8gYmVjYXVzZSB0aGlzIHN1YnNjcmlwdGlvbiBpcyBoYXBwZW5lZCBiZWZvcmUgdGhhbiB2aWV3J3MsXG4gICAgICAvLyBzbyBkZWxheSBgY2FsbGJhY2tgIGV4ZWN1dGlvbiB0byBuZXh0IGZyYW1lLlxuICAgICAgZGVsYXkoMTApLFxuICAgIClcbiAgICAuc3Vic2NyaWJlKChzdGF0ZSkgPT4ge1xuICAgICAgX2xhdGVzdEZldGNoT3B0aW9uPy5jYWxsYmFjaz8uKHN0YXRlKTtcbiAgICB9KTtcblxuICByZXR1cm4ge1xuICAgIHN0YXRlJDogYXBpU3RhdGUkLFxuICAgIGZldGNoOiAoZmV0Y2hPcHRpb246IEZldGNoT3B0aW9uKSA9PiB7XG4gICAgICBfbGF0ZXN0RmV0Y2hPcHRpb24gPSBmZXRjaE9wdGlvbjtcblxuICAgICAgcGFyYW1zJC5uZXh0KGZldGNoT3B0aW9uLnBhcmFtcyk7XG4gICAgfSxcbiAgICByYXdGZXRjaDogKHsgY2FsbGJhY2ssIC4uLmFqYXhDb25maWcgfSkgPT4ge1xuICAgICAgLy8gdG9kbyBmaXggdGhpc1xuICAgICAgX2xhdGVzdEZldGNoT3B0aW9uID0geyBjYWxsYmFjayB9O1xuXG4gICAgICByYXdQYXJhbXMkLm5leHQoYWpheENvbmZpZyk7XG4gICAgfSxcbiAgICByZWZyZXNoOiAoKSA9PiB7XG4gICAgICBpZiAoIV9sYXRlc3RGZXRjaE9wdGlvbikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICAvLyBvdmVycmlkZSBvblN1Y2Nlc3MgYW5kIG9uRXJyb3IgdG8gdW5kZWZpbmVkXG4gICAgICBfbGF0ZXN0RmV0Y2hPcHRpb24gPSB7IHBhcmFtczogX2xhdGVzdEZldGNoT3B0aW9uLnBhcmFtcyB9O1xuICAgICAgcGFyYW1zJC5uZXh0KF9sYXRlc3RGZXRjaE9wdGlvbi5wYXJhbXMpO1xuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRBUElTdGF0ZTtcbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgbm9vcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUgeyBBUElTcGVjQWRhcHRlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcGktc3BlYy1hZGFwdGVyJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB0eXBlIHsgU3RhdGVzSHViQVBJLCBBUElTdGF0ZSwgQVBJU3RhdGVzU3BlYywgRmV0Y2hPcHRpb24sIEFQSVN0YXRlJFdpdGhBY3Rpb25zLCBSYXdGZXRjaE9wdGlvbiwgQVBJRmV0Y2hDYWxsYmFjayB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGluaXRpYWxTdGF0ZSB9IGZyb20gJy4vaHR0cC9yZXNwb25zZSc7XG5pbXBvcnQgaW5pdEFQSVN0YXRlIGZyb20gJy4vaW5pdC1hcGktc3RhdGUnO1xuXG50eXBlIENhY2hlID0gUmVjb3JkPHN0cmluZywgQVBJU3RhdGUkV2l0aEFjdGlvbnM+O1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBhcGlTcGVjQWRhcHRlcj86IEFQSVNwZWNBZGFwdGVyO1xuICBhcGlTdGF0ZVNwZWM6IEFQSVN0YXRlc1NwZWM7XG4gIHBhcmVudEh1Yj86IFN0YXRlc0h1YkFQSTtcbn1cblxuY29uc3QgZHVtbXlTdGF0ZSRXaXRoQWN0aW9uOiBBUElTdGF0ZSRXaXRoQWN0aW9ucyA9IHtcbiAgc3RhdGUkOiBuZXcgQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPihpbml0aWFsU3RhdGUpLFxuICBmZXRjaDogbm9vcCxcbiAgcmF3RmV0Y2g6IG5vb3AsXG4gIHJlZnJlc2g6IG5vb3AsXG59O1xuXG5jb25zdCBkdW1teUFQSVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlciA9IHtcbiAgYnVpbGQ6ICgpID0+ICh7IHVybDogJy9hcGknLCBtZXRob2Q6ICdnZXQnIH0pLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSHViIGltcGxlbWVudHMgU3RhdGVzSHViQVBJIHtcbiAgcHVibGljIGNhY2hlOiBDYWNoZTtcbiAgcHVibGljIHBhcmVudEh1Yj86IFN0YXRlc0h1YkFQSSA9IHVuZGVmaW5lZDtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoeyBhcGlTdGF0ZVNwZWMsIGFwaVNwZWNBZGFwdGVyLCBwYXJlbnRIdWIgfTogUHJvcHMpIHtcbiAgICB0aGlzLnBhcmVudEh1YiA9IHBhcmVudEh1YjtcblxuICAgIHRoaXMuY2FjaGUgPSBPYmplY3QuZW50cmllcyhhcGlTdGF0ZVNwZWMpLnJlZHVjZTxDYWNoZT4oKGFjYywgW3N0YXRlSUQsIHsgYXBpSUQgfV0pID0+IHtcbiAgICAgIGFjY1tzdGF0ZUlEXSA9IGluaXRBUElTdGF0ZShhcGlJRCwgYXBpU3BlY0FkYXB0ZXIgfHwgZHVtbXlBUElTcGVjQWRhcHRlcik7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAhIXRoaXMucGFyZW50SHViPy5oYXNTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwdWJsaWMgZmluZFN0YXRlJChzdGF0ZUlEOiBzdHJpbmcpOiBBUElTdGF0ZSRXaXRoQWN0aW9ucyB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW3N0YXRlSURdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcmVudEh1Yj8uZmluZFN0YXRlJChzdGF0ZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogQmVoYXZpb3JTdWJqZWN0PEFQSVN0YXRlPiB7XG4gICAgY29uc3QgeyBzdGF0ZSQgfSA9IHRoaXMuZmluZFN0YXRlJChzdGF0ZUlEKSB8fCB7fTtcbiAgICBpZiAoc3RhdGUkKSB7XG4gICAgICByZXR1cm4gc3RhdGUkO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEuYCxcbiAgICAgICAgJ0luIG9yZGVyIHRvIHByZXZlbnQgVUkgY3Jhc2gsIGEgZHVtbXlTdGF0ZSQgd2lsbCBiZSByZXR1cm5lZC4nLFxuICAgICAgXS5qb2luKCcgJyksXG4gICAgKTtcblxuICAgIHJldHVybiBkdW1teVN0YXRlJFdpdGhBY3Rpb24uc3RhdGUkO1xuICB9XG5cbiAgcHVibGljIGZldGNoKHN0YXRlSUQ6IHN0cmluZywgZmV0Y2hPcHRpb246IEZldGNoT3B0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgeyBmZXRjaCB9ID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpIHx8IHt9O1xuICAgIGlmIChmZXRjaCkge1xuICAgICAgZmV0Y2goZmV0Y2hPcHRpb24pO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEsYCxcbiAgICAgICAgJ3RoaXMgZmV0Y2ggYWN0aW9uIHdpbGwgYmUgaWdub3JlZC4nLFxuICAgICAgXS5qb2luKCcgJyksXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByYXdGZXRjaChzdGF0ZUlEOiBzdHJpbmcsIHJhd0ZldGNoT3B0aW9uOiBSYXdGZXRjaE9wdGlvbiAmIHsgY2FsbGJhY2s/OiBBUElGZXRjaENhbGxiYWNrOyB9KTogdm9pZCB7XG4gICAgY29uc3QgeyByYXdGZXRjaCB9ID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpIHx8IHt9O1xuICAgIGlmIChyYXdGZXRjaCkge1xuICAgICAgcmF3RmV0Y2gocmF3RmV0Y2hPcHRpb24pO1xuICAgIH1cblxuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgIFtcbiAgICAgICAgYGNhbid0IGZpbmQgYXBpIHN0YXRlOiAke3N0YXRlSUR9LCBwbGVhc2UgY2hlY2sgYXBpU3RhdGVTcGVjIG9yIHBhcmVudCBzY2hlbWEsYCxcbiAgICAgICAgJ3RoaXMgZmV0Y2ggYWN0aW9uIHdpbGwgYmUgaWdub3JlZC4nLFxuICAgICAgXS5qb2luKCcgJyksXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyByZWZyZXNoKHN0YXRlSUQ6IHN0cmluZyk6IHZvaWQge1xuICAgIGNvbnN0IHsgcmVmcmVzaCB9ID0gdGhpcy5maW5kU3RhdGUkKHN0YXRlSUQpIHx8IHt9O1xuICAgIGlmIChyZWZyZXNoKSB7XG4gICAgICByZWZyZXNoKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgW1xuICAgICAgICBgY2FuJ3QgZmluZCBhcGkgc3RhdGU6ICR7c3RhdGVJRH0sIHBsZWFzZSBjaGVjayBhcGlTdGF0ZVNwZWMgb3IgcGFyZW50IHNjaGVtYSxgLFxuICAgICAgICAndGhpcyByZWZyZXNoIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQuJyxcbiAgICAgIF0uam9pbignICcpLFxuICAgICk7XG4gIH1cbn1cbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgU2hhcmVkU3RhdGVIdWIgZnJvbSAnLi9zdGF0ZXMtaHViLXNoYXJlZCc7XG5cbmZ1bmN0aW9uIGdldFNoYXJlZFN0YXRlcyhzdGF0ZXNIdWJTaGFyZWQ6IFNoYXJlZFN0YXRlSHViKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBoYW5kbGVyOiBQcm94eUhhbmRsZXI8UmVhZG9ubHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PiA9IHtcbiAgICBnZXQ6ICh0YXJnZXQ6IFByb3h5SGFuZGxlcjxSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4+LCBwOiBzdHJpbmcpOiB1bmtub3duID0+IHtcbiAgICAgIHJldHVybiBzdGF0ZXNIdWJTaGFyZWQuZ2V0U3RhdGUkKHApLnZhbHVlO1xuICAgIH0sXG5cbiAgICBzZXQ6ICh0YXJnZXQ6IFByb3h5SGFuZGxlcjxSZWFkb25seTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4+LCBwOiBzdHJpbmcsIHZhbHVlOiB1bmtub3duKTogYm9vbGVhbiA9PiB7XG4gICAgICBpZiAocC5zdGFydHNXaXRoKCckJykpIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdub2RlIGludGVybmFsIHN0YXRlIGNhbiBub3QgYmUgYXNzaWduZWQnKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBzdGF0ZXNIdWJTaGFyZWQubXV0YXRlU3RhdGUocCwgdmFsdWUpO1xuXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9LFxuICB9O1xuXG4gIHJldHVybiBuZXcgUHJveHk8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KHt9LCBoYW5kbGVyKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0U2hhcmVkU3RhdGVzO1xuIiwiaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBTdGF0ZXNIdWJTaGFyZWQsIFNoYXJlZFN0YXRlc1NwZWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEh1YiBpbXBsZW1lbnRzIFN0YXRlc0h1YlNoYXJlZCB7XG4gIHB1YmxpYyBjYWNoZTogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PHVua25vd24+PjtcbiAgcHVibGljIHBhcmVudEh1Yj86IFN0YXRlc0h1YlNoYXJlZCA9IHVuZGVmaW5lZDtcbiAgcHVibGljIHVuV3JpdGVhYmxlU3RhdGVzOiBzdHJpbmdbXSA9IFtdO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzcGVjOiBTaGFyZWRTdGF0ZXNTcGVjLCBwYXJlbnRIdWI/OiBTdGF0ZXNIdWJTaGFyZWQpIHtcbiAgICB0aGlzLnBhcmVudEh1YiA9IHBhcmVudEh1YjtcbiAgICB0aGlzLmNhY2hlID0gT2JqZWN0LmVudHJpZXMoc3BlYykucmVkdWNlPFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj4+KFxuICAgICAgKGFjYywgW3N0YXRlSUQsIHsgaW5pdGlhbCwgd3JpdGVhYmxlIH1dKSA9PiB7XG4gICAgICAgIGFjY1tzdGF0ZUlEXSA9IG5ldyBCZWhhdmlvclN1YmplY3QoaW5pdGlhbCk7XG4gICAgICAgIGlmICh3cml0ZWFibGUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgdGhpcy51bldyaXRlYWJsZVN0YXRlcy5wdXNoKHN0YXRlSUQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcbiAgfVxuXG4gIHB1YmxpYyBoYXNTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiAhIXRoaXMucGFyZW50SHViPy5oYXNTdGF0ZSQoc3RhdGVJRCk7XG4gIH1cblxuICBwcml2YXRlIF9jcmVhdGVTdGF0ZSQoc3RhdGVJRDogc3RyaW5nLCBpbml0aWFsVmFsdWU/OiB1bmtub3duKTogdm9pZCB7XG4gICAgdGhpcy5jYWNoZVtzdGF0ZUlEXSA9IG5ldyBCZWhhdmlvclN1YmplY3QoaW5pdGlhbFZhbHVlKTtcbiAgfVxuXG4gIHB1YmxpYyBmaW5kU3RhdGUkKHN0YXRlSUQ6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDx1bmtub3duPiB8IHVuZGVmaW5lZCB7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlW3N0YXRlSURdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBhcmVudEh1Yj8uZmluZFN0YXRlJChzdGF0ZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRTdGF0ZSQoc3RhdGVJRDogc3RyaW5nKTogQmVoYXZpb3JTdWJqZWN0PHVua25vd24+IHtcbiAgICBjb25zdCBzdGF0ZSQgPSB0aGlzLmZpbmRTdGF0ZSQoc3RhdGVJRCk7XG4gICAgaWYgKHN0YXRlJCkge1xuICAgICAgcmV0dXJuIHN0YXRlJDtcbiAgICB9XG5cbiAgICB0aGlzLl9jcmVhdGVTdGF0ZSQoc3RhdGVJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5jYWNoZVtzdGF0ZUlEXTtcbiAgfVxuXG4gIHB1YmxpYyBtdXRhdGVTdGF0ZShzdGF0ZUlEOiBzdHJpbmcsIHN0YXRlOiB1bmtub3duKTogdm9pZCB7XG4gICAgaWYgKHN0YXRlSUQuc3RhcnRzV2l0aCgnJCcpKSB7XG4gICAgICBsb2dnZXIud2Fybignc2hhcmVkIHN0YXRlSUQgY2FuIG5vdCBzdGFydHMgd2l0aCAkLCB0aGlzIGFjdGlvbiB3aWxsIGJlIGlnbm9yZWQnKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy51bldyaXRlYWJsZVN0YXRlcy5pbmNsdWRlcyhzdGF0ZUlEKSkge1xuICAgICAgbG9nZ2VyLndhcm4oJ3RoaXMgc2hhcmVkIHN0YXRlIGlzIG5vdCBhbGxvd2VkIHRvIGJlIHdyaXR0ZW4sIHRoaXMgYWN0aW9uIHdpbGwgYmUgaWdub3JlZCcpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZ2V0U3RhdGUkKHN0YXRlSUQpLm5leHQoc3RhdGUpO1xuICB9XG5cbiAgcHVibGljIGdldE5vZGVTdGF0ZSQobm9kZVBhdGg6IHN0cmluZyk6IEJlaGF2aW9yU3ViamVjdDx1bmtub3duPiB7XG4gICAgY29uc3Qgc3RhdGVJRCA9IGAkJHtub2RlUGF0aH1gO1xuICAgIHJldHVybiB0aGlzLmdldFN0YXRlJChzdGF0ZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBleHBvc2VOb2RlU3RhdGUobm9kZVBhdGg6IHN0cmluZywgc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICBjb25zdCBzdGF0ZUlEID0gYCQke25vZGVQYXRofWA7XG4gICAgaWYgKHRoaXMuY2FjaGVbc3RhdGVJRF0pIHtcbiAgICAgIHRoaXMuY2FjaGVbc3RhdGVJRF0ubmV4dChzdGF0ZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5fY3JlYXRlU3RhdGUkKHN0YXRlSUQsIHN0YXRlKTtcbiAgfVxufVxuIiwiaW1wb3J0IHsgQVBJU3BlY0FkYXB0ZXIsIEZldGNoUGFyYW1zIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FwaS1zcGVjLWFkYXB0ZXInO1xuaW1wb3J0IHsgY29tYmluZUxhdGVzdCwgZmlyc3RWYWx1ZUZyb20sIGZyb20sIGxhc3QsIG1hcCwgT2JzZXJ2YWJsZSwgb2YsIHN3aXRjaE1hcCwgdGFrZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQVBJU3RhdGVzU3BlYywgU2hhcmVkU3RhdGVzU3BlYywgSW5pdGlhbGl6ZXJGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IGluaXRBUElTdGF0ZSBmcm9tICcuL2luaXQtYXBpLXN0YXRlJztcblxuaW50ZXJmYWNlIExhenlTdGF0ZSB7XG4gIHN0YXRlSUQ6IHN0cmluZztcbiAgZnVuYzogSW5pdGlhbGl6ZXJGdW5jO1xuICBkZXBlbmRlbmNpZXM/OiB7XG4gICAgW2tleTogc3RyaW5nXTogRmV0Y2hQYXJhbXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIHRvRGVwZW5kZW5jeSQoXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbiAgYXBpSUQ6IHN0cmluZyxcbiAgcGFyYW1zOiBGZXRjaFBhcmFtcyxcbik6IE9ic2VydmFibGU8dW5rbm93bj4ge1xuICBjb25zdCB7IHN0YXRlJCwgZmV0Y2ggfSA9IGluaXRBUElTdGF0ZShhcGlJRCwgYXBpU3BlY0FkYXB0ZXIpO1xuXG4gIC8vIHdlIG9ubHkgbmVlZCB0aGUgYXBpIHJlc3VsdFxuICBjb25zdCBkZXBlbmRlbmN5JCA9IHN0YXRlJC5waXBlKFxuICAgIC8vIGxvYWRpbmcsIHJlc29sdmVkXG4gICAgdGFrZSgyKSxcbiAgICBsYXN0KCksXG4gICAgbWFwKCh7IHJlc3VsdCB9KSA9PiByZXN1bHQpLFxuICApO1xuXG4gIGZldGNoKHsgcGFyYW1zIH0pO1xuXG4gIHJldHVybiBkZXBlbmRlbmN5JDtcbn1cblxuZnVuY3Rpb24gdG9EZXBzJChcbiAgZGVwczogUmVjb3JkPHN0cmluZywgRmV0Y2hQYXJhbXM+LFxuICBhcGlTdGF0ZXM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyOiBBUElTcGVjQWRhcHRlcixcbik6IE9ic2VydmFibGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHtcbiAgY29uc3QgZGVwZW5kZW5jaWVzJCA9IE9iamVjdC5lbnRyaWVzKGRlcHMpXG4gICAgLm1hcCgoW3N0YXRlSUQsIGZldGNoUGFyYW1zXSkgPT4ge1xuICAgICAgaWYgKCFhcGlTdGF0ZXNbc3RhdGVJRF0pIHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKFxuICAgICAgICAgIGBubyBzdGF0ZTogJHtzdGF0ZUlEfSBmb3VuZCBpbiBBUElTdGF0ZXNTcGVjLCB1bmRlZmluZWQgd2lsbCBiZSB1c2VkIGFzIHRoaXMgZGVwZW5kZW5jeSB2YWx1ZWAsXG4gICAgICAgICk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHsgYXBpSUQgfSA9IGFwaVN0YXRlc1tzdGF0ZUlEXTtcblxuICAgICAgcmV0dXJuIFtzdGF0ZUlELCB0b0RlcGVuZGVuY3kkKGFwaVNwZWNBZGFwdGVyLCBhcGlJRCwgZmV0Y2hQYXJhbXMpXTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj5dID0+ICEhcGFpcilcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgZGVwZW5kZW5jeSRdKSA9PiB7XG4gICAgICBhY2Nbc3RhdGVJRF0gPSBkZXBlbmRlbmN5JDtcbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuXG4gIGlmICghT2JqZWN0LmtleXMoZGVwZW5kZW5jaWVzJCkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG9mKHt9KTtcbiAgfVxuXG4gIHJldHVybiBjb21iaW5lTGF0ZXN0KGRlcGVuZGVuY2llcyQpO1xufVxuXG5mdW5jdGlvbiBwcm9taXNpZnkoZnVuYzogSW5pdGlhbGl6ZXJGdW5jKTogKHA6IFJlY29yZDxzdHJpbmcsIHVua25vd24+KSA9PiBQcm9taXNlPHVua25vd24+IHtcbiAgcmV0dXJuIChwOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikgPT4ge1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICAoKCkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJldHVybiBmdW5jKHApO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pKCksXG4gICAgKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gdG9PYnNlcnZhYmxlTWFwKFxuICBsYXp5U3RhdGVzOiBMYXp5U3RhdGVbXSxcbiAgYXBpU3RhdGVTcGVjOiBBUElTdGF0ZXNTcGVjLFxuICBhcGlTcGVjQWRhcHRlcjogQVBJU3BlY0FkYXB0ZXIsXG4pOiBSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+PiB7XG4gIHJldHVybiBsYXp5U3RhdGVzXG4gICAgLm1hcDxbc3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+XT4oKHsgc3RhdGVJRCwgZnVuYywgZGVwZW5kZW5jaWVzIH0pID0+IHtcbiAgICAgIGNvbnN0IGRlcHMkID0gdG9EZXBzJChkZXBlbmRlbmNpZXMgfHwge30sIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICAgICAgY29uc3Qgc3RhdGUkID0gZGVwcyQucGlwZShcbiAgICAgICAgc3dpdGNoTWFwKChkZXBzKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGZyb20ocHJvbWlzaWZ5KGZ1bmMpKGRlcHMpKTtcbiAgICAgICAgfSksXG4gICAgICApO1xuXG4gICAgICByZXR1cm4gW3N0YXRlSUQsIHN0YXRlJF07XG4gICAgfSlcbiAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PigoYWNjLCBbc3RhdGVJRCwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW3N0YXRlSURdID0gc3RhdGUkO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBmaWx0ZXJMYXp5U3RhdGVzIHJldHVybiBhIGxpc3Qgb2Ygc3RhdGUgd2hpY2ggcmVxdWlyZWQgbGF6eSBpbml0aWFsaXphdGlvblxuICogQHBhcmFtIHNoYXJlZFN0YXRlU3BlYyAtIFNoYXJlZFN0YXRlc1NwZWNcbiAqL1xuZnVuY3Rpb24gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWM6IFNoYXJlZFN0YXRlc1NwZWMpOiBBcnJheTxMYXp5U3RhdGU+IHtcbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHNoYXJlZFN0YXRlU3BlYylcbiAgICAubWFwKChbc3RhdGVJRCwgeyBpbml0aWFsaXplciB9XSkgPT4ge1xuICAgICAgaWYgKGluaXRpYWxpemVyKSB7XG4gICAgICAgIHJldHVybiB7IC4uLmluaXRpYWxpemVyLCBzdGF0ZUlEIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybjtcbiAgICB9KVxuICAgIC5maWx0ZXIoKGxhenlTdGF0ZSk6IGxhenlTdGF0ZSBpcyBMYXp5U3RhdGUgPT4gISFsYXp5U3RhdGUpO1xufVxuXG4vKipcbiAqIGluaXRpYWxpemVMYXp5U3RhdGVzIHdpbGwgd2FpdCBmb3IgYWxsIHRoZSBkZXBlbmRlbmNpZXMgdG8gYmUgcmVzb2x2ZWQsXG4gKiB0aGVuIGNhbGwgdGhlIGluaXRpYWxpemUgZnVuY3Rpb24sIHRoZW4gcmV0dXJuIHRoZSBmaW5pYWwgc2hhcmVkIHN0YXRlcy5cbiAqIEBwYXJhbSBzaGFyZWRTdGF0ZVNwZWMgLSB0aGUgb3JpZ2luYWwgc2hhcmVkU3RhdGVTcGVjXG4gKiBAcGFyYW0gYXBpU3RhdGVTcGVjIC0gQVBJU3RhdGVzU3BlYyBpbiBzY2hlbWFcbiAqIEBwYXJhbSBhcGlTcGVjQWRhcHRlciAtIEFQSVNwZWNBZGFwdGVyIHBsdWdpblxuICogQHJldHVybnMgaW5pdGlhbGl6ZWQgc2hhcmVkIHN0YXRlc1xuICovXG5hc3luYyBmdW5jdGlvbiBpbml0aWFsaXplTGF6eVN0YXRlcyhcbiAgc2hhcmVkU3RhdGVTcGVjOiBTaGFyZWRTdGF0ZXNTcGVjLFxuICBhcGlTdGF0ZVNwZWM6IEFQSVN0YXRlc1NwZWMsXG4gIGFwaVNwZWNBZGFwdGVyPzogQVBJU3BlY0FkYXB0ZXIsXG4pOiBQcm9taXNlPFNoYXJlZFN0YXRlc1NwZWM+IHtcbiAgaWYgKCFhcGlTcGVjQWRhcHRlcikge1xuICAgIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG4gIH1cblxuICBjb25zdCBsYXp5U3RhdGVzID0gZmlsdGVyTGF6eVN0YXRlcyhzaGFyZWRTdGF0ZVNwZWMpO1xuICAvLyB0dXJuIGxhenkgc3RhdGVzIHRvIG9ic2VydmFibGVzXG4gIGNvbnN0IG9ic1N0YXRlTWFwID0gdG9PYnNlcnZhYmxlTWFwKGxhenlTdGF0ZXMsIGFwaVN0YXRlU3BlYywgYXBpU3BlY0FkYXB0ZXIpO1xuICBpZiAoIU9iamVjdC5rZXlzKG9ic1N0YXRlTWFwKS5sZW5ndGgpIHtcbiAgICByZXR1cm4gc2hhcmVkU3RhdGVTcGVjO1xuICB9XG5cbiAgLy8gd2FpdCBmb3IgYWxsIHRoZSBvYnNlcnZhYmxlcyBlbWl0IHZhbHVlXG4gIGNvbnN0IGxhenlTdGF0ZXNNYXAgPSBhd2FpdCBmaXJzdFZhbHVlRnJvbShjb21iaW5lTGF0ZXN0KG9ic1N0YXRlTWFwKSk7XG5cbiAgLy8gbWVyZ2Ugd2l0aCBvcmlnaW5hbCBzdGF0ZXNcbiAgT2JqZWN0LmVudHJpZXMobGF6eVN0YXRlc01hcCkuZm9yRWFjaCgoW3N0YXRlSUQsIHZhbHVlXSkgPT4ge1xuICAgIHNoYXJlZFN0YXRlU3BlY1tzdGF0ZUlEXS5pbml0aWFsID0gdmFsdWU7XG4gIH0pO1xuXG4gIHJldHVybiBzaGFyZWRTdGF0ZVNwZWM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRpYWxpemVMYXp5U3RhdGVzO1xuIiwiaW1wb3J0IEFydGVyeVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHBhcnNlSW5oZXJpdFByb3BlcnR5KFxuICBub2RlOiBBcnRlcnlTcGVjLk5vZGUsXG4gIGNhY2hlSURzOiBTZXQ8c3RyaW5nPixcbik6IFNldDxzdHJpbmc+IHtcbiAgY29uc3QgcHJvcHMgPSBub2RlLnByb3BzIHx8IHt9O1xuXG4gIE9iamVjdC52YWx1ZXMocHJvcHMpLmZvckVhY2goKHByb3BlcnR5KSA9PiB7XG4gICAgaWYgKHByb3BlcnR5LnR5cGUgIT09ICdpbmhlcml0ZWRfcHJvcGVydHknKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYoIXByb3BlcnR5LnBhcmVudElEKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2FjaGVJRHMuYWRkKHByb3BlcnR5LnBhcmVudElEKTtcbiAgfSk7XG5cbiAgaWYgKCdjaGlsZHJlbicgaW4gbm9kZSkge1xuICAgIG5vZGUuY2hpbGRyZW4/LmZvckVhY2goKHN1Yk5vZGUpID0+IHBhcnNlSW5oZXJpdFByb3BlcnR5KHN1Yk5vZGUsIGNhY2hlSURzKSk7XG4gIH1cblxuICBpZiAoJ25vZGUnIGluIG5vZGUpIHtcbiAgICBwYXJzZUluaGVyaXRQcm9wZXJ0eShub2RlLm5vZGUgYXMgQXJ0ZXJ5U3BlYy5Ob2RlLCBjYWNoZUlEcyk7XG4gIH1cblxuICByZXR1cm4gY2FjaGVJRHM7XG59XG4iLCJpbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTm9kZVByb3BzQ2FjaGUsIEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIGdldE5vZGVJREJ5UGF0aChwYXRoOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBjb25zdCBub2RlUGF0aCA9IHBhdGgucmVwbGFjZSgvXFwvKC4rKVxcL1swLTldKy9nLCAnLyQxJyk7XG4gIHJldHVybiBub2RlUGF0aC5zcGxpdCgnLycpLnBvcCgpO1xufVxuXG5jb25zdCBOT0RFX1NIT1VMRF9OT1RfQ0FDSEU6IEFydGVyeU5vZGVbJ2lkJ11bXSA9IFsnZHVtbXlMb29wQ29udGFpbmVyJywgJ3BsYWNlaG9sZGVyLW5vZGUnXTtcbmNsYXNzIFN0b3JlIGltcGxlbWVudHMgTm9kZVByb3BzQ2FjaGUge1xuICBwcml2YXRlIGNhY2hlOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+PjtcbiAgcHJpdmF0ZSBjYWNoZUlEczogU2V0PHN0cmluZz47XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKGNhY2hlSURzOiBTZXQ8c3RyaW5nPikge1xuICAgIHRoaXMuY2FjaGUgPSB7fTtcbiAgICB0aGlzLmNhY2hlSURzID0gY2FjaGVJRHM7XG4gIH1cblxuICBwdWJsaWMgc2hvdWxkQ2FjaGUobm9kZUlEOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jYWNoZUlEcy5oYXMobm9kZUlEKTtcbiAgfVxuXG4gIHB1YmxpYyBpbml0U3RhdGUocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmNhY2hlW3BhdGhdKSB7XG4gICAgICB0aGlzLmNhY2hlW3BhdGhdID0gbmV3IEJlaGF2aW9yU3ViamVjdCh7fSBhcyBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGdldFByb3BzJChwYXJlbnRJRDogc3RyaW5nKTogQmVoYXZpb3JTdWJqZWN0PFJlY29yZDxzdHJpbmcsIHVua25vd24+PiB8IHVuZGVmaW5lZCB7XG4gICAgdGhpcy5pbml0U3RhdGUocGFyZW50SUQpO1xuXG4gICAgcmV0dXJuIHRoaXMuY2FjaGVbcGFyZW50SURdO1xuICB9XG5cbiAgcHVibGljIHNldFByb3BzKHBhdGg6IHN0cmluZywgbm9kZUlEOiBBcnRlcnlOb2RlWydpZCddICxwcm9wczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pOiB2b2lkIHtcbiAgICBjb25zdCBub2RlUGF0aElEID0gZ2V0Tm9kZUlEQnlQYXRoKHBhdGgpO1xuICAgIC8vIHRvIGF2b2lkIHJlc2V0IHByb3BzIHdoaWxlIG5vZGUgaXMgZHVtbXlMb29wQ29udGFpbmVyIG9yIHBsYWNlaG9sZGVyLW5vZGVcbiAgICAvLyBvciBzb21lIG1lYW5pbmdsZXNzIG5vZGUgYnV0IHVzZSB1c2VJbnN0YW50aWF0ZVByb3BzIHRvIHBhcnNlIHNwZWNpZmljIHByb3BzXG4gICAgLy8gbGlrZSBpdGVyYWJsZVN0YXRlLCBzaG91bGRSZW5kZXJcbiAgICBpZighbm9kZVBhdGhJRCB8fCBOT0RFX1NIT1VMRF9OT1RfQ0FDSEUuaW5jbHVkZXMobm9kZUlEKSB8fCF0aGlzLnNob3VsZENhY2hlKG5vZGVQYXRoSUQpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNhY2hlW25vZGVQYXRoSURdKSB7XG4gICAgICB0aGlzLmNhY2hlW25vZGVQYXRoSURdID0gbmV3IEJlaGF2aW9yU3ViamVjdChwcm9wcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jYWNoZVtub2RlUGF0aElEXS5uZXh0KHByb3BzKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTdG9yZTtcbiIsImltcG9ydCB7IGNyZWF0ZUJyb3dzZXJIaXN0b3J5IH0gZnJvbSAnaGlzdG9yeSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB0eXBlIEFydGVyeVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCBnZXRBUElTdGF0ZXMgZnJvbSAnLi9hcGktc3RhdGVzJztcbmltcG9ydCBkZXNlcmlhbGl6ZSBmcm9tICcuL2Rlc2VyaWFsaXplJztcbmltcG9ydCBTdGF0ZXNIdWJBUEkgZnJvbSAnLi9zdGF0ZXMtaHViLWFwaSc7XG5pbXBvcnQgZ2V0U2hhcmVkU3RhdGVzIGZyb20gJy4vc2hhcmVkLXN0YXRlcyc7XG5pbXBvcnQgU3RhdGVzSHViU2hhcmVkIGZyb20gJy4vc3RhdGVzLWh1Yi1zaGFyZWQnO1xuaW1wb3J0IGluaXRpYWxpemVMYXp5U3RhdGVzIGZyb20gJy4vaW5pdGlhbGl6ZS1sYXp5LXNoYXJlZC1zdGF0ZXMnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFBsdWdpbnMsIEFydGVyeU5vZGUsIFNoYXJlZFN0YXRlc1NwZWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgcGFyc2VJbmhlcml0UHJvcGVydHkgZnJvbSAnLi9kZXNlcmlhbGl6ZS9wYXJzZS1pbmhlcml0LXByb3BlcnR5JztcbmltcG9ydCBOb2RlUHJvcHNDYWNoZSBmcm9tICcuL25vZGUtcHJvcHMtY2FjaGUnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEJvb3RVcFBhcmFtcyB7XG4gIGFydGVyeTogQXJ0ZXJ5U3BlYy5BcnRlcnk7XG4gIHBhcmVudENUWD86IENUWDtcbiAgcGx1Z2lucz86IFBsdWdpbnM7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQm9vdFJlc3VsdCB7XG4gIGN0eDogQ1RYO1xuICByb290Tm9kZTogQXJ0ZXJ5Tm9kZTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gaW5pdENUWCh7IGFydGVyeSwgcGFyZW50Q1RYLCBwbHVnaW5zIH06IEJvb3RVcFBhcmFtcyk6IFByb21pc2U8Q1RYPiB7XG4gIGNvbnN0IHsgYXBpU3RhdGVTcGVjLCBzaGFyZWRTdGF0ZXNTcGVjIH0gPSBhcnRlcnk7XG4gIGNvbnN0IF9wbHVnaW5zID0gT2JqZWN0LmFzc2lnbih7fSwgcGFyZW50Q1RYPy5wbHVnaW5zIHx8IHt9LCBwbHVnaW5zIHx8IHt9KTtcblxuICBjb25zdCBzdGF0ZXNIdWJBUEkgPSBuZXcgU3RhdGVzSHViQVBJKHtcbiAgICAvLyBUT0RPOiB0aHJvdyBlcnJvciBpbnN0ZWFkIG9mIHRvbGVyYXRpbmcgaXRcbiAgICBhcGlTcGVjQWRhcHRlcjogX3BsdWdpbnMuYXBpU3BlY0FkYXB0ZXIsXG4gICAgYXBpU3RhdGVTcGVjOiBhcGlTdGF0ZVNwZWMgfHwge30sXG4gICAgcGFyZW50SHViOiBwYXJlbnRDVFg/LnN0YXRlc0h1YkFQSSxcbiAgfSk7XG5cbiAgY29uc3QgaW5zdGFudGlhdGVTcGVjID0gZGVzZXJpYWxpemUoc2hhcmVkU3RhdGVzU3BlYyB8fCB7fSwgdW5kZWZpbmVkKSBhcyBTaGFyZWRTdGF0ZXNTcGVjIHwgbnVsbDtcbiAgY29uc3QgaW5pdGlhbGl6ZWRTdGF0ZSA9IGF3YWl0IGluaXRpYWxpemVMYXp5U3RhdGVzKFxuICAgIGluc3RhbnRpYXRlU3BlYyB8fCB7fSxcbiAgICBhcGlTdGF0ZVNwZWMgfHwge30sXG4gICAgX3BsdWdpbnMuYXBpU3BlY0FkYXB0ZXIsXG4gICk7XG4gIGNvbnN0IHN0YXRlc0h1YlNoYXJlZCA9IG5ldyBTdGF0ZXNIdWJTaGFyZWQoaW5pdGlhbGl6ZWRTdGF0ZSwgcGFyZW50Q1RYPy5zdGF0ZXNIdWJTaGFyZWQpO1xuXG4gIGNvbnN0IGhpc3RvcnkgPSBwYXJlbnRDVFg/Lmhpc3RvcnkgfHwgY3JlYXRlQnJvd3Nlckhpc3RvcnkoKTtcbiAgY29uc3QgbG9jYXRpb24kID0gcGFyZW50Q1RYPy5sb2NhdGlvbiQgfHwgbmV3IEJlaGF2aW9yU3ViamVjdChoaXN0b3J5LmxvY2F0aW9uKTtcblxuICBpZiAoIXBhcmVudENUWD8ubG9jYXRpb24kKSB7XG4gICAgaGlzdG9yeS5saXN0ZW4oKHsgbG9jYXRpb24gfSkgPT4ge1xuICAgICAgbG9jYXRpb24kLm5leHQobG9jYXRpb24pO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgY2FjaGVJRHMgPSBwYXJzZUluaGVyaXRQcm9wZXJ0eShhcnRlcnkubm9kZSwgbmV3IFNldCgpKTtcbiAgY29uc3Qgbm9kZVByb3BzQ2FjaGUgPSBuZXcgTm9kZVByb3BzQ2FjaGUoY2FjaGVJRHMpO1xuXG4gIGNvbnN0IGN0eDogQ1RYID0ge1xuICAgIHN0YXRlc0h1YkFQSTogc3RhdGVzSHViQVBJLFxuICAgIHN0YXRlc0h1YlNoYXJlZDogc3RhdGVzSHViU2hhcmVkLFxuXG4gICAgYXBpU3RhdGVzOiBnZXRBUElTdGF0ZXMoc3RhdGVzSHViQVBJKSxcbiAgICBzdGF0ZXM6IGdldFNoYXJlZFN0YXRlcyhzdGF0ZXNIdWJTaGFyZWQpLFxuICAgIGhpc3RvcnksXG4gICAgbG9jYXRpb24kLFxuICAgIG5vZGVQcm9wc0NhY2hlLFxuXG4gICAgcGx1Z2luczogX3BsdWdpbnMsXG4gIH07XG5cbiAgcmV0dXJuIGN0eDtcbn1cblxuZnVuY3Rpb24gZGVzZXJpYWxpemVOb2RlKG5vZGU6IEFydGVyeVNwZWMuTm9kZSwgY3R4OiBDVFgpOiBBcnRlcnlOb2RlIHtcbiAgY29uc3Qgcm9vdE5vZGUgPSBkZXNlcmlhbGl6ZShub2RlLCB7XG4gICAgYXBpU3RhdGVzOiBjdHguYXBpU3RhdGVzLFxuICAgIHN0YXRlczogY3R4LnN0YXRlcyxcbiAgICBoaXN0b3J5OiBjdHguaGlzdG9yeSxcbiAgfSkgYXMgQXJ0ZXJ5Tm9kZTtcblxuICBpZiAoIXJvb3ROb2RlKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdmYWlsZWQgdG8gaW5pdCBjdHghJyk7XG4gIH1cblxuICByZXR1cm4gcm9vdE5vZGU7XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGJvb3RVcCh7IGFydGVyeSwgcGFyZW50Q1RYLCBwbHVnaW5zIH06IEJvb3RVcFBhcmFtcyk6IFByb21pc2U8Qm9vdFJlc3VsdD4ge1xuICBjb25zdCBjdHggPSBhd2FpdCBpbml0Q1RYKHsgYXJ0ZXJ5LCBwYXJlbnRDVFgsIHBsdWdpbnMgfSk7XG4gIGNvbnN0IHJvb3ROb2RlID0gZGVzZXJpYWxpemVOb2RlKGFydGVyeS5ub2RlLCBjdHgpO1xuXG4gIHJldHVybiB7IGN0eCwgcm9vdE5vZGUgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYm9vdFVwO1xuIiwiaW1wb3J0IHR5cGUgeyBDb25zdGFudFByb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCB7IEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUNvbnN0YW50UHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgaWYgKCFub2RlLnByb3BzKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG5cbiAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMpXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQ29uc3RhbnRQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2NvbnN0YW50X3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5yZWR1Y2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KChhY2MsIFtrZXksIHsgdmFsdWUgfV0pID0+IHtcbiAgICAgIGFjY1trZXldID0gdmFsdWU7XG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbn1cbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgbWFwLCBza2lwLCB0YXAsIGNvbWJpbmVMYXRlc3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgdHlwZSB7IENvbXB1dGVkRGVwZW5kZW5jeSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuXG5pbXBvcnQgeyBDVFgsIFN0YXRlQ29udmVydG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgQ29udmVydFJlc3VsdFBhcmFtcyB7XG4gIHN0YXRlOiB1bmtub3duO1xuICBjb252ZXJ0b3I/OiBTdGF0ZUNvbnZlcnRvcjtcbiAgZmFsbGJhY2s6IHVua25vd247XG4gIHByb3BOYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb252ZXJ0U3RhdGUoeyBzdGF0ZSwgY29udmVydG9yLCBmYWxsYmFjaywgcHJvcE5hbWUgfTogQ29udmVydFJlc3VsdFBhcmFtcyk6IHVua25vd24ge1xuICBpZiAoY29udmVydG9yICYmIHN0YXRlICE9PSB1bmRlZmluZWQpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRvcihzdGF0ZSkgPz8gZmFsbGJhY2s7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgYGFuIGVycm9yIG9jY3VycmVkIHdoaWxlIGNhbGxpbmcgc3RhdGUgY29udmVydG9yIGZvciBwcm9wOiBcIiR7cHJvcE5hbWV9XCJgLFxuICAgICAgICAnd2l0aCB0aGUgZm9sbG93aW5nIHN0YXRlIGFuZCBjb252ZXJ0b3I6JyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIHN0YXRlLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgY29udmVydG9yLnRvU3RyaW5nKCksXG4gICAgICAgICdcXG4nLFxuICAgICAgICAnU28gcmV0dXJuIGZhbGxiYWNrIGluc3RlYWQsIGZhbGxiYWNrOicsXG4gICAgICAgIGZhbGxiYWNrLFxuICAgICAgICAnXFxuJyxcbiAgICAgICAgJ1xcbicsXG4gICAgICAgIGVycm9yLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBmYWxsYmFjaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gc3RhdGUgPz8gZmFsbGJhY2s7XG59XG5cbmludGVyZmFjZSBHZXRDb21wdXRlZFN0YXRlJFByb3BzIHtcbiAgcHJvcE5hbWU6IHN0cmluZztcbiAgZGVwczogQ29tcHV0ZWREZXBlbmRlbmN5W107XG4gIGNvbnZlcnRvcjogU3RhdGVDb252ZXJ0b3I7XG4gIGN0eDogQ1RYO1xuICBmYWxsYmFjazogdW5rbm93bjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXB1dGVkU3RhdGUkKHtcbiAgcHJvcE5hbWUsXG4gIGRlcHMsXG4gIGNvbnZlcnRvcixcbiAgY3R4LFxuICBmYWxsYmFjayxcbn06IEdldENvbXB1dGVkU3RhdGUkUHJvcHMpOiBCZWhhdmlvclN1YmplY3Q8dW5rbm93bj4ge1xuICBsZXQgX2ZhbGxiYWNrID0gZmFsbGJhY2s7XG4gIGNvbnN0IGRlcHMkID0gZGVwcy5tYXA8QmVoYXZpb3JTdWJqZWN0PHVua25vd24+PigoeyB0eXBlLCBkZXBJRCB9KSA9PiB7XG4gICAgaWYgKHR5cGUgPT09ICdhcGlfc3RhdGUnKSB7XG4gICAgICByZXR1cm4gY3R4LnN0YXRlc0h1YkFQSS5nZXRTdGF0ZSQoZGVwSUQpIGFzIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPjtcbiAgICB9XG5cbiAgICBpZiAodHlwZSA9PT0gJ25vZGVfc3RhdGUnKSB7XG4gICAgICByZXR1cm4gY3R4LnN0YXRlc0h1YlNoYXJlZC5nZXROb2RlU3RhdGUkKGRlcElEKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY3R4LnN0YXRlc0h1YlNoYXJlZC5nZXRTdGF0ZSQoZGVwSUQpO1xuICB9KTtcbiAgY29uc3QgaW5pdGlhbERlcHMgPSBkZXBzJC5yZWR1Y2UoKGFjYzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIGRlcCQsIGluZGV4KSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLmFjYyxcbiAgICAgIFtkZXBzW2luZGV4XS5kZXBJRF06IGRlcCQudmFsdWVcbiAgICB9O1xuICB9LCB7fSk7XG4gIGNvbnN0IHN0YXRlJCA9IG5ldyBCZWhhdmlvclN1YmplY3QoXG4gICAgY29udmVydFN0YXRlKHtcbiAgICAgIHN0YXRlOiBpbml0aWFsRGVwcyxcbiAgICAgIGNvbnZlcnRvcjogY29udmVydG9yLFxuICAgICAgZmFsbGJhY2s6IGZhbGxiYWNrLFxuICAgICAgcHJvcE5hbWUsXG4gICAgfSksXG4gICk7XG5cbiAgY29tYmluZUxhdGVzdChkZXBzJClcbiAgICAucGlwZShcbiAgICAgIG1hcCgoX2RlcHMpID0+IHtcbiAgICAgICAgY29uc3QgdXBkYXRlZERlcHMgPSBfZGVwcy5yZWR1Y2UoKGFjYzogUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIF9kZXAsIGluZGV4KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIC4uLmFjYyxcbiAgICAgICAgICAgIFtkZXBzW2luZGV4XS5kZXBJRF06IF9kZXBcbiAgICAgICAgICB9O1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIHJldHVybiBjb252ZXJ0U3RhdGUoe1xuICAgICAgICAgIHN0YXRlOiB1cGRhdGVkRGVwcyxcbiAgICAgICAgICBjb252ZXJ0b3I6IGNvbnZlcnRvcixcbiAgICAgICAgICBmYWxsYmFjazogX2ZhbGxiYWNrLFxuICAgICAgICAgIHByb3BOYW1lLFxuICAgICAgICB9KTtcbiAgICAgIH0pLFxuICAgICAgc2tpcCgxKSxcbiAgICAgIHRhcCgoc3RhdGUpID0+IHtcbiAgICAgICAgX2ZhbGxiYWNrID0gc3RhdGU7XG4gICAgICB9KSxcbiAgICApXG4gICAgLnN1YnNjcmliZSgoc3RhdGUpID0+IHN0YXRlJC5uZXh0KHN0YXRlKSk7XG5cbiAgcmV0dXJuIHN0YXRlJDtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgZGlzdGluY3RVbnRpbEtleUNoYW5nZWQsIG1hcCwgT2JzZXJ2YWJsZSwgc2tpcCwgdGFwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEFQSVJlc3VsdFByb3BlcnR5LCBBUElTdGF0ZSwgQ1RYLCBBcnRlcnlOb2RlLCBTdGF0ZUNvbnZlcnRvciB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGNvbnZlcnRTdGF0ZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiB1c2VBUElSZXN1bHRQcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgYWRhcHRlcnM6IFJlY29yZDxzdHJpbmcsIFN0YXRlQ29udmVydG9yIHwgdW5kZWZpbmVkPiA9IHt9O1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8QVBJU3RhdGU+PiA9IHt9O1xuICBjb25zdCBpbml0aWFsRmFsbGJhY2tzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQVBJUmVzdWx0UHJvcGVydHldID0+IHtcbiAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdhcGlfcmVzdWx0X3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5mb3JFYWNoKChbcHJvcE5hbWUsIHsgZmFsbGJhY2ssIGNvbnZlcnRvcjogYWRhcHRlciwgc3RhdGVJRCB9XSkgPT4ge1xuICAgICAgaW5pdGlhbEZhbGxiYWNrc1twcm9wTmFtZV0gPSBmYWxsYmFjaztcbiAgICAgIGFkYXB0ZXJzW3Byb3BOYW1lXSA9IGFkYXB0ZXI7XG4gICAgICBzdGF0ZXMkW3Byb3BOYW1lXSA9IGN0eC5zdGF0ZXNIdWJBUEkuZ2V0U3RhdGUkKHN0YXRlSUQpO1xuICAgIH0pO1xuXG4gIGNvbnN0IGZhbGxiYWNrc1JlZiA9IHVzZVJlZjxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oaW5pdGlhbEZhbGxiYWNrcyk7XG5cbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKCkgPT4ge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhzdGF0ZXMkKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgIGFjY1trZXldID0gY29udmVydFN0YXRlKHtcbiAgICAgICAgc3RhdGU6IHN0YXRlJC5nZXRWYWx1ZSgpLnJlc3VsdCxcbiAgICAgICAgY29udmVydG9yOiBhZGFwdGVyc1trZXldLFxuICAgICAgICBmYWxsYmFjazogZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSxcbiAgICAgICAgcHJvcE5hbWU6IGtleSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCByZXN1bHRzJCA9IE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBPYnNlcnZhYmxlPHVua25vd24+Pj4oXG4gICAgICAoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICAgIGFjY1trZXldID0gc3RhdGUkLnBpcGUoXG4gICAgICAgICAgZGlzdGluY3RVbnRpbEtleUNoYW5nZWQoJ3Jlc3VsdCcpLFxuICAgICAgICAgIG1hcCgoeyByZXN1bHQgfSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgICAgICAgIHN0YXRlOiByZXN1bHQsXG4gICAgICAgICAgICAgIGNvbnZlcnRvcjogYWRhcHRlcnNba2V5XSxcbiAgICAgICAgICAgICAgZmFsbGJhY2s6IGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0sXG4gICAgICAgICAgICAgIHByb3BOYW1lOiBrZXksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0YXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIHt9LFxuICAgICk7XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBjb21iaW5lTGF0ZXN0KHJlc3VsdHMkKS5waXBlKHNraXAoMSkpLnN1YnNjcmliZShzZXRTdGF0ZSk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUFQSVJlc3VsdFByb3BzO1xuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgZGlzdGluY3RVbnRpbEtleUNoYW5nZWQsIG1hcCwgT2JzZXJ2YWJsZSwgc2tpcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUgeyBBUElMb2FkaW5nUHJvcGVydHkgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuaW1wb3J0IHsgQVBJU3RhdGUsIENUWCwgQXJ0ZXJ5Tm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZnVuY3Rpb24gdXNlQVBJTG9hZGluZ1Byb3BzKG5vZGU6IEFydGVyeU5vZGUsIGN0eDogQ1RYKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8QVBJU3RhdGU+PiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQVBJTG9hZGluZ1Byb3BlcnR5XSA9PiB7XG4gICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnYXBpX2xvYWRpbmdfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtwcm9wTmFtZSwgeyBzdGF0ZUlEIH1dKSA9PiB7XG4gICAgICBzdGF0ZXMkW3Byb3BOYW1lXSA9IGN0eC5zdGF0ZXNIdWJBUEkuZ2V0U3RhdGUkKHN0YXRlSUQpO1xuICAgIH0pO1xuXG4gIGNvbnN0IFtzdGF0ZSwgc2V0U3RhdGVdID0gdXNlU3RhdGU8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+KCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IHN0YXRlJC5nZXRWYWx1ZSgpLmxvYWRpbmc7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHJlc3VsdHMkID0gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSBzdGF0ZSQucGlwZShcbiAgICAgICAgICBza2lwKDEpLFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkKCdsb2FkaW5nJyksXG4gICAgICAgICAgbWFwKCh7IGxvYWRpbmcgfSkgPT4gbG9hZGluZyksXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gY29tYmluZUxhdGVzdChyZXN1bHRzJCkuc3Vic2NyaWJlKHNldFN0YXRlKTtcblxuICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiBzdGF0ZTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlQVBJTG9hZGluZ1Byb3BzO1xuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEZldGNoUGFyYW1zIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FwaS1zcGVjLWFkYXB0ZXInO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQVBJSW52b2tlUHJvcGVydHksIENUWCwgQXJ0ZXJ5Tm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxudHlwZSBBUElDYWxsUHJvcHMgPSBSZWNvcmQ8c3RyaW5nLCAoLi4uYXJnczogdW5rbm93bltdKSA9PiB2b2lkPjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQVBJSW52b2tlUHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBBUElDYWxsUHJvcHMge1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFub2RlLnByb3BzKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMpXG4gICAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBbc3RyaW5nLCBBUElJbnZva2VQcm9wZXJ0eV0gPT4ge1xuICAgICAgICByZXR1cm4gcGFpclsxXS50eXBlID09PSAnYXBpX2ludm9rZV9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxBUElDYWxsUHJvcHM+KChhY2MsIFtwcm9wTmFtZSwgeyBzdGF0ZUlELCBwYXJhbXNCdWlsZGVyLCBjYWxsYmFjayB9XSkgPT4ge1xuICAgICAgICBsb2dnZXIud2FybignaG9vayB1c2VBUElJbnZva2VQcm9wcyBoYXMgYmVlbiBkZXByZWNhdGVkLCBwbGVhc2UgdXNlIGhvb2sgdXNlRnVuY1Byb3BzIGluc3RlYWQnKTtcblxuICAgICAgICBmdW5jdGlvbiBoYW5kbGVBY3Rpb24oLi4uYXJnczogdW5rbm93bltdKTogdm9pZCB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IGZldGNoUGFyYW1zOiBGZXRjaFBhcmFtcyA9IHBhcmFtc0J1aWxkZXI/LiguLi5hcmdzKSB8fCB7fTtcbiAgICAgICAgICAgIGN0eC5hcGlTdGF0ZXNbc3RhdGVJRF0uZmV0Y2goZmV0Y2hQYXJhbXMsIGNhbGxiYWNrKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbG9nZ2VyLmxvZygnZmFpbGVkIHRvIHJ1biBjb252ZXJ0b3Igb3IgcnVuIGFjdGlvbjonLCBlcnJvcik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgYWNjW3Byb3BOYW1lXSA9IGhhbmRsZUFjdGlvbjtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwLCBPYnNlcnZhYmxlLCBza2lwLCB0YXAgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ1RYLCBTaGFyZWRTdGF0ZVByb3BlcnR5LCBOb2RlU3RhdGVQcm9wZXJ0eSwgQXJ0ZXJ5Tm9kZSwgU3RhdGVDb252ZXJ0b3IgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBjb252ZXJ0U3RhdGUgfSBmcm9tICcuL3V0aWxzJztcblxudHlwZSBQYWlyID0gW3N0cmluZywgU2hhcmVkU3RhdGVQcm9wZXJ0eSB8IE5vZGVTdGF0ZVByb3BlcnR5XTtcblxuZnVuY3Rpb24gdXNlU2hhcmVkU3RhdGVQcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgY29udmVydG9yczogUmVjb3JkPHN0cmluZywgU3RhdGVDb252ZXJ0b3IgfCB1bmRlZmluZWQ+ID0ge307XG4gIGNvbnN0IHN0YXRlcyQ6IFJlY29yZDxzdHJpbmcsIEJlaGF2aW9yU3ViamVjdDx1bmtub3duPj4gPSB7fTtcbiAgY29uc3QgaW5pdGlhbEZhbGxiYWNrczogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gPSB7fTtcblxuICBPYmplY3QuZW50cmllcyhub2RlLnByb3BzIHx8IHt9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFBhaXIgPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ3NoYXJlZF9zdGF0ZV9wcm9wZXJ0eScgfHwgcGFpclsxXS50eXBlID09PSAnbm9kZV9zdGF0ZV9wcm9wZXJ0eSc7XG4gICAgfSlcbiAgICAuZm9yRWFjaCgoW2tleSwgcHJvcFNwZWNdKSA9PiB7XG4gICAgICBpZiAocHJvcFNwZWMudHlwZSA9PT0gJ3NoYXJlZF9zdGF0ZV9wcm9wZXJ0eScpIHtcbiAgICAgICAgc3RhdGVzJFtrZXldID0gY3R4LnN0YXRlc0h1YlNoYXJlZC5nZXRTdGF0ZSQocHJvcFNwZWMuc3RhdGVJRCk7XG4gICAgICAgIGNvbnZlcnRvcnNba2V5XSA9IHByb3BTcGVjLmNvbnZlcnRvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHN0YXRlcyRba2V5XSA9IGN0eC5zdGF0ZXNIdWJTaGFyZWQuZ2V0Tm9kZVN0YXRlJChwcm9wU3BlYy5ub2RlUGF0aCk7XG4gICAgICAgIGNvbnZlcnRvcnNba2V5XSA9IHByb3BTcGVjLmNvbnZlcnRvcjtcbiAgICAgIH1cblxuICAgICAgaW5pdGlhbEZhbGxiYWNrc1trZXldID0gcHJvcFNwZWMuZmFsbGJhY2s7XG4gICAgfSk7XG5cbiAgY29uc3QgZmFsbGJhY2tzUmVmID0gdXNlUmVmPFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihpbml0aWFsRmFsbGJhY2tzKTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlKCgpID0+IHtcbiAgICByZXR1cm4gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoYWNjLCBba2V5LCBzdGF0ZSRdKSA9PiB7XG4gICAgICBhY2Nba2V5XSA9IGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgIHN0YXRlOiBzdGF0ZSQuZ2V0VmFsdWUoKSxcbiAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3JzW2tleV0sXG4gICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghT2JqZWN0LmtleXMoc3RhdGVzJCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0cyQgPSBPYmplY3QuZW50cmllcyhzdGF0ZXMkKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgT2JzZXJ2YWJsZTx1bmtub3duPj4+KFxuICAgICAgKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgICBhY2Nba2V5XSA9IHN0YXRlJC5waXBlKFxuICAgICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgICAgICAgbWFwKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBjb252ZXJ0U3RhdGUoe1xuICAgICAgICAgICAgICBzdGF0ZTogcmVzdWx0LFxuICAgICAgICAgICAgICBjb252ZXJ0b3I6IGNvbnZlcnRvcnNba2V5XSxcbiAgICAgICAgICAgICAgZmFsbGJhY2s6IGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0sXG4gICAgICAgICAgICAgIHByb3BOYW1lOiBrZXksXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9KSxcbiAgICAgICAgICB0YXAoKHJlc3VsdCkgPT4ge1xuICAgICAgICAgICAgZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICB9KSxcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSxcbiAgICAgIHt9LFxuICAgICk7XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBjb21iaW5lTGF0ZXN0KHJlc3VsdHMkKS5waXBlKHNraXAoMSkpLnN1YnNjcmliZShzZXRTdGF0ZSk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVNoYXJlZFN0YXRlUHJvcHM7XG4iLCJpbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQXJ0ZXJ5Tm9kZSwgRnVuY3Rpb25hbFByb3BlcnR5LCBWZXJzYXRpbGVGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VGdW5jUHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSk6IFJlY29yZDxzdHJpbmcsIFZlcnNhdGlsZUZ1bmM+IHtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICghbm9kZS5wcm9wcykge1xuICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIHJldHVybiBPYmplY3QuZW50cmllcyhub2RlLnByb3BzKVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgRnVuY3Rpb25hbFByb3BlcnR5XSA9PiB7XG4gICAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdmdW5jdGlvbmFsX3Byb3BlcnR5JztcbiAgICAgIH0pXG4gICAgICAucmVkdWNlPFJlY29yZDxzdHJpbmcsIFZlcnNhdGlsZUZ1bmM+PigoYWNjLCBba2V5LCB7IGZ1bmMgfV0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSAoLi4uYXJnczogdW5rbm93bltdKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGZ1bmMoLi4uYXJncyk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgICAgYGFuIGVycm9yIG9jY3VycmVkIHdoaWxlIHJ1biBub2RlICcke25vZGUuaWR9JyBmdW5jdGlvbmFsIHByb3BlcnR5OmAsXG4gICAgICAgICAgICAgIGtleSxcbiAgICAgICAgICAgICAgJ3dpdGggdGhlIGZvbGxvd2luZyBhcmd1bWVudHM6JyxcbiAgICAgICAgICAgICAgJ1xcbicsXG4gICAgICAgICAgICAgIGFyZ3MsXG4gICAgICAgICAgICAgICdcXG4nLFxuICAgICAgICAgICAgICAnZnVuY3Rpb24gaXM6JyxcbiAgICAgICAgICAgICAgJ1xcbicsXG4gICAgICAgICAgICAgIGZ1bmMudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgJ1xcbicsXG4gICAgICAgICAgICAgIGVycm9yLFxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuIiwiaW1wb3J0IHsgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHsgQ1RYLCBTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcGVydHksIEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgTXV0YXRlUHJvcHMgPSBSZWNvcmQ8c3RyaW5nLCAodmFsdWU6IHVua25vd24pID0+IHZvaWQ+O1xudHlwZSBQYWlyID0gW3N0cmluZywgU2hhcmVkU3RhdGVNdXRhdGlvblByb3BlcnR5XTtcblxuZnVuY3Rpb24gdXNlU2hhcmVkU3RhdGVNdXRhdGlvblByb3BzKG5vZGU6IEFydGVyeU5vZGUsIGN0eDogQ1RYKTogTXV0YXRlUHJvcHMge1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFub2RlLnByb3BzKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMpXG4gICAgICAuZmlsdGVyKChwYWlyKTogcGFpciBpcyBQYWlyID0+IHtcbiAgICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ3NoYXJlZF9zdGF0ZV9tdXRhdGlvbl9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxNdXRhdGVQcm9wcz4oKGFjYywgW2tleSwgeyBzdGF0ZUlELCBjb252ZXJ0b3IgfV0pID0+IHtcbiAgICAgICAgZnVuY3Rpb24gbXV0YXRpb24oc3RhdGU6IHVua25vd24pOiB2b2lkIHtcbiAgICAgICAgICBpZiAodHlwZW9mIGNvbnZlcnRvciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY3R4LnN0YXRlc0h1YlNoYXJlZC5tdXRhdGVTdGF0ZShzdGF0ZUlELCBzdGF0ZSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNvbnN0IHYgPSBjb252ZXJ0b3Ioc3RhdGUpO1xuICAgICAgICAgICAgY3R4LnN0YXRlc0h1YlNoYXJlZC5tdXRhdGVTdGF0ZShzdGF0ZUlELCB2KTtcbiAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gcnVuIGNvbnZlcnRvcjpcXG4nLCBjb252ZXJ0b3IudG9TdHJpbmcoKSwgJ1xcbicsIGVycm9yKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBhY2Nba2V5XSA9IG11dGF0aW9uO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfSwge30pO1xuICB9LCBbXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcztcbiIsImltcG9ydCB7IHVzZUNvbnRleHQsIHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vbm9kZS1yZW5kZXIvcGF0aC1jb250ZXh0JztcblxuaW1wb3J0IHsgQXJ0ZXJ5Tm9kZSwgQ1RYLCBWZXJzYXRpbGVGdW5jIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG50eXBlIEludGVybmFsSG9va1Byb3BzID0gUmVjb3JkPHN0cmluZywgVmVyc2F0aWxlRnVuYyB8IHVuZGVmaW5lZD47XG5cbi8vIHRvZG8gZ2l2ZSB0aGlzIGhvb2sgYSBiZXR0ZXIgbmFtZVxuZnVuY3Rpb24gdXNlSW50ZXJuYWxIb29rUHJvcHMobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBJbnRlcm5hbEhvb2tQcm9wcyB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGlmICgnc3VwcG9ydFN0YXRlRXhwb3N1cmUnIGluIG5vZGUgJiYgbm9kZS5zdXBwb3J0U3RhdGVFeHBvc3VyZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgX19leHBvc2VTdGF0ZTogKHN0YXRlOiB1bmtub3duKTogdm9pZCA9PiB7XG4gICAgICAgICAgY3R4LnN0YXRlc0h1YlNoYXJlZC5leHBvc2VOb2RlU3RhdGUoYCR7cGFyZW50UGF0aH0vJHtub2RlLmlkfWAsIHN0YXRlKTtcbiAgICAgICAgfSxcbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHt9O1xuICB9LCBbXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUludGVybmFsSG9va1Byb3BzO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBDb25zdGFudFByb3BlcnR5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4uL25vZGUtcmVuZGVyJztcbmltcG9ydCB7IENUWCwgQXJ0ZXJ5Tm9kZSwgUmVuZGVyUHJvcGVydHkgfSBmcm9tICcuLi90eXBlcyc7XG5cbnR5cGUgUmVuZGVyID0gKC4uLmFyZ3M6IHVua25vd25bXSkgPT4gUmVhY3QuUmVhY3RFbGVtZW50O1xudHlwZSBSZW5kZXJQcm9wcyA9IFJlY29yZDxzdHJpbmcsIFJlbmRlcj47XG5cbmZ1bmN0aW9uIGJ1aWxkUmVuZGVyKFxuICBub2RlOiBBcnRlcnlOb2RlLFxuICBjdHg6IENUWCxcbiAgYWRhcHRlcj86ICguLi5hcmdzOiB1bmtub3duW10pID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuKTogUmVuZGVyIHtcbiAgcmV0dXJuICguLi5hcmdzOiB1bmtub3duW10pOiBSZWFjdC5SZWFjdEVsZW1lbnQgPT4ge1xuICAgIC8vIGNvbnZlcnQgcmVuZGVyIGFyZ3MgdG8gY29uc3RhbnQgcHJvcGVydGllcyBmb3IgcmV1c2Ugb2YgTm9kZVJlbmRlclxuICAgIGxldCBjb25zdGFudFByb3BzID0ge307XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGN1c3RvbVByb3BzID0gYWRhcHRlcj8uKC4uLmFyZ3MpIHx8IHt9O1xuICAgICAgaWYgKHR5cGVvZiBjdXN0b21Qcm9wcyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uc3RhbnRQcm9wcyA9IE9iamVjdC5lbnRyaWVzKGN1c3RvbVByb3BzKS5yZWR1Y2U8UmVjb3JkPHN0cmluZywgQ29uc3RhbnRQcm9wZXJ0eT4+KFxuICAgICAgICAgIChhY2MsIFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgICAgICAgYWNjW2tleV0gPSB7IHR5cGU6ICdjb25zdGFudF9wcm9wZXJ0eScsIHZhbHVlIH07XG4gICAgICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgICAgIH0sXG4gICAgICAgICAge30sXG4gICAgICAgICk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyB0b2RvIG9wdGltaXplIHRoaXMgbWVzc2FnZVxuICAgICAgICBsb2dnZXIuZXJyb3IoJ3RvUHJvcHMgcmVzdWx0IGlzIG5vIE9iamVjdCcpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyB0b2RvIG9wdGltaXplIHRoaXMgbWVzc2FnZVxuICAgICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gY2FsbCB0b1Byb3BzJywgZXJyb3IpO1xuICAgIH1cblxuICAgIG5vZGUucHJvcHMgPSBPYmplY3QuYXNzaWduKHt9LCBub2RlLnByb3BzLCBjb25zdGFudFByb3BzKTtcblxuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pO1xuICB9O1xufVxuXG5mdW5jdGlvbiB1c2VSZW5kZXJQcm9wcyh7IHByb3BzIH06IEFydGVyeU5vZGUsIGN0eDogQ1RYKTogUmVuZGVyUHJvcHMge1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHByb3BzIHx8IHt9KVxuICAgICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgUmVuZGVyUHJvcGVydHldID0+IHtcbiAgICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ3JlbmRlcl9wcm9wZXJ0eSc7XG4gICAgICB9KVxuICAgICAgLnJlZHVjZTxSZW5kZXJQcm9wcz4oKGFjYywgW3Byb3BOYW1lLCB7IGFkYXB0ZXIsIG5vZGUgfV0pID0+IHtcbiAgICAgICAgYWNjW3Byb3BOYW1lXSA9IGJ1aWxkUmVuZGVyKG5vZGUsIGN0eCwgYWRhcHRlcik7XG5cbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9KTtcbiAgfSwgW10pO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VSZW5kZXJQcm9wcztcbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QsIGNvbWJpbmVMYXRlc3QsIHNraXAgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgQ1RYLCBBcnRlcnlOb2RlLCBDb21wdXRlZFByb3BlcnR5IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0Q29tcHV0ZWRTdGF0ZSQgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQ29tcHV0ZWRQcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3Qgc3RhdGVzJDogUmVjb3JkPHN0cmluZywgQmVoYXZpb3JTdWJqZWN0PHVua25vd24+PiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgQ29tcHV0ZWRQcm9wZXJ0eV0gPT4ge1xuICAgICAgcmV0dXJuIHBhaXJbMV0udHlwZSA9PT0gJ2NvbXB1dGVkX3Byb3BlcnR5JztcbiAgICB9KVxuICAgIC5mb3JFYWNoKChbcHJvcE5hbWUsIHsgZGVwcywgY29udmVydG9yLCBmYWxsYmFjayB9XSkgPT4ge1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBnZXRDb21wdXRlZFN0YXRlJCh7IHByb3BOYW1lLCBkZXBzLCBjb252ZXJ0b3IsIGN0eCwgZmFsbGJhY2sgfSk7XG4gICAgfSk7XG5cbiAgY29uc3QgW3N0YXRlcywgc2V0U3RhdGVzXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgYWNjW2tleV0gPSBzdGF0ZSQudmFsdWU7XG5cbiAgICAgIHJldHVybiBhY2M7XG4gICAgfSwge30pO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbnMgPSBjb21iaW5lTGF0ZXN0KHN0YXRlcyQpLnBpcGUoc2tpcCgxKSkuc3Vic2NyaWJlKHNldFN0YXRlcyk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9ucy51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlcztcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgY29tYmluZUxhdGVzdCwgbWFwLCBPYnNlcnZhYmxlLCBvZiwgc2tpcCwgdGFwIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IENUWCwgSW5oZXJpdGVkUHJvcGVydHksIEFydGVyeU5vZGUsIFN0YXRlQ29udmVydG9yIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgY29udmVydFN0YXRlIH0gZnJvbSAnLi91dGlscyc7XG5cbmZ1bmN0aW9uIHVzZUluaGVyaXRlZFByb3BzKG5vZGU6IEFydGVyeU5vZGUsIGN0eDogQ1RYKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4ge1xuXG4gIGNvbnN0IGNvbnZlcnRvcnM6IFJlY29yZDxzdHJpbmcsIFN0YXRlQ29udmVydG9yIHwgdW5kZWZpbmVkPiA9IHt9O1xuICBjb25zdCBzdGF0ZXMkOiBSZWNvcmQ8c3RyaW5nLCBCZWhhdmlvclN1YmplY3Q8UmVjb3JkPHN0cmluZywgdW5rbm93bj4+IHwgdW5kZWZpbmVkPiA9IHt9O1xuICBjb25zdCBpbml0aWFsRmFsbGJhY2tzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiA9IHt9O1xuXG4gIE9iamVjdC5lbnRyaWVzKG5vZGUucHJvcHMgfHwge30pXG4gICAgLmZpbHRlcigocGFpcik6IHBhaXIgaXMgW3N0cmluZywgSW5oZXJpdGVkUHJvcGVydHldID0+IHtcbiAgICAgIHJldHVybiBwYWlyWzFdLnR5cGUgPT09ICdpbmhlcml0ZWRfcHJvcGVydHknO1xuICAgIH0pXG4gICAgLmZvckVhY2goKFtwcm9wTmFtZSwgeyBmYWxsYmFjaywgY29udmVydG9yLCBwYXJlbnRJRCB9XSkgPT4ge1xuICAgICAgaW5pdGlhbEZhbGxiYWNrc1twcm9wTmFtZV0gPSBmYWxsYmFjaztcbiAgICAgIGNvbnZlcnRvcnNbcHJvcE5hbWVdID0gY29udmVydG9yO1xuICAgICAgc3RhdGVzJFtwcm9wTmFtZV0gPSBjdHgubm9kZVByb3BzQ2FjaGU/LmdldFByb3BzJChwYXJlbnRJRCk7XG4gICAgfSk7XG5cbiAgY29uc3QgZmFsbGJhY2tzUmVmID0gdXNlUmVmPFJlY29yZDxzdHJpbmcsIHVua25vd24+Pihpbml0aWFsRmFsbGJhY2tzKTtcblxuICBjb25zdCBbc3RhdGUsIHNldFN0YXRlXSA9IHVzZVN0YXRlPFJlY29yZDxzdHJpbmcsIHVua25vd24+PigoKSA9PiB7XG4gICAgcmV0dXJuIE9iamVjdC5lbnRyaWVzKHN0YXRlcyQpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCB1bmtub3duPj4oKGFjYywgW2tleSwgc3RhdGUkXSkgPT4ge1xuICAgICAgaWYgKCFzdGF0ZSQpIHtcbiAgICAgICAgYWNjW2tleV0gPSBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldO1xuICAgICAgICByZXR1cm4gYWNjO1xuICAgICAgfVxuXG4gICAgICBhY2Nba2V5XSA9IGNvbnZlcnRTdGF0ZSh7XG4gICAgICAgIHN0YXRlOiBzdGF0ZSQ/LmdldFZhbHVlKCksXG4gICAgICAgIGNvbnZlcnRvcjogY29udmVydG9yc1trZXldLFxuICAgICAgICBmYWxsYmFjazogZmFsbGJhY2tzUmVmLmN1cnJlbnRba2V5XSxcbiAgICAgICAgcHJvcE5hbWU6IGtleSxcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gYWNjO1xuICAgIH0sIHt9KTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBpbmhlcml0UHJvcHMkID0gT2JqZWN0LmVudHJpZXMoc3RhdGVzJCkucmVkdWNlPFJlY29yZDxzdHJpbmcsIE9ic2VydmFibGU8dW5rbm93bj4+PihcbiAgICAgIChhY2MsIFtrZXksIHN0YXRlJF0pID0+IHtcbiAgICAgICAgaWYgKCFzdGF0ZSQpIHtcbiAgICAgICAgICBhY2Nba2V5XSA9IG9mKGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0pO1xuICAgICAgICAgIHJldHVybiBhY2M7XG4gICAgICAgIH1cblxuICAgICAgICBhY2Nba2V5XSA9IHN0YXRlJC5waXBlKFxuICAgICAgICAgIG1hcCgobm9kZVByb3BzKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gY29udmVydFN0YXRlKHtcbiAgICAgICAgICAgICAgc3RhdGU6IG5vZGVQcm9wcyxcbiAgICAgICAgICAgICAgY29udmVydG9yOiBjb252ZXJ0b3JzW2tleV0sXG4gICAgICAgICAgICAgIGZhbGxiYWNrOiBmYWxsYmFja3NSZWYuY3VycmVudFtrZXldLFxuICAgICAgICAgICAgICBwcm9wTmFtZToga2V5LFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICAgdGFwKChjb252ZXJ0ZWRQcm9wcykgPT4gKGZhbGxiYWNrc1JlZi5jdXJyZW50W2tleV0gPSBjb252ZXJ0ZWRQcm9wcykpLFxuICAgICAgICApO1xuXG4gICAgICAgIHJldHVybiBhY2M7XG4gICAgICB9LFxuICAgICAge30sXG4gICAgKTtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGNvbWJpbmVMYXRlc3QoaW5oZXJpdFByb3BzJCkucGlwZShza2lwKDEpKS5zdWJzY3JpYmUoc2V0U3RhdGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHN0YXRlO1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VJbmhlcml0ZWRQcm9wcztcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBDVFgsIEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmZ1bmN0aW9uIHVzZUxpbmtQcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgaWYgKCdpc0xpbmsnIGluIG5vZGUgJiYgbm9kZS5pc0xpbmsgJiYgbm9kZS50eXBlID09PSAnaHRtbC1lbGVtZW50JyAmJiBub2RlLm5hbWUgPT09ICdhJykge1xuICAgIHJldHVybiB7XG4gICAgICBvbkNsaWNrOiAoZTogUmVhY3QuTW91c2VFdmVudDxIVE1MQW5jaG9yRWxlbWVudD4pID0+IHtcbiAgICAgICAgLy8gdG9kbyBwcm94eSBvbkNsaWNrIGV2ZW50XG4gICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgY29uc3QgaHJlZiA9IChlLmN1cnJlbnRUYXJnZXQgYXMgSFRNTEFuY2hvckVsZW1lbnQpLmhyZWY7XG4gICAgICAgIGlmICghaHJlZikge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjdHguaGlzdG9yeS5wdXNoKGhyZWYpO1xuICAgICAgfSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIHt9O1xufVxuXG5leHBvcnQgZGVmYXVsdCB1c2VMaW5rUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VNZW1vLCB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBDVFgsIEFydGVyeU5vZGUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgdXNlQ29uc3RhbnRQcm9wcyBmcm9tICcuL3VzZS1jb25zdGFudC1wcm9wcyc7XG5pbXBvcnQgdXNlQVBJUmVzdWx0UHJvcHMgZnJvbSAnLi91c2UtYXBpLXJlc3VsdC1wcm9wcyc7XG5pbXBvcnQgdXNlQVBJTG9hZGluZ1Byb3BzIGZyb20gJy4vdXNlLWFwaS1sb2FkaW5nLXByb3BzJztcbmltcG9ydCB1c2VBUElJbnZva2VQcm9wcyBmcm9tICcuL3VzZS1hcGktaW52b2tlLXByb3BzJztcbmltcG9ydCB1c2VTaGFyZWRTdGF0ZVByb3BzIGZyb20gJy4vdXNlLXNoYXJlZC1zdGF0ZS1wcm9wcyc7XG5pbXBvcnQgdXNlRnVuY1Byb3BzIGZyb20gJy4vdXNlLWZ1bmMtcHJvcHMnO1xuaW1wb3J0IHVzZVNoYXJlZFN0YXRlTXV0YXRpb25Qcm9wcyBmcm9tICcuL3VzZS1zaGFyZWQtc3RhdGUtbXV0YXRpb24nO1xuaW1wb3J0IHVzZUludGVybmFsSG9va1Byb3BzIGZyb20gJy4vdXNlLWludGVybmFsLWhvb2stcHJvcHMnO1xuaW1wb3J0IHVzZVJlbmRlclByb3BzIGZyb20gJy4vdXNlLXJlbmRlci1wcm9wcyc7XG5pbXBvcnQgdXNlQ29tcHV0ZWRQcm9wcyBmcm9tICcuL3VzZS1jb21wdXRlZC1wcm9wcyc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vbm9kZS1yZW5kZXIvcGF0aC1jb250ZXh0JztcbmltcG9ydCB1c2VJbmhlcml0ZWRQcm9wcyBmcm9tICcuL3VzZS1pbmhlcml0ZWQtcHJvcHMnO1xuaW1wb3J0IHVzZUxpbmtQcm9wcyBmcm9tICcuL3VzZS1saW5rLXByb3BzJztcblxuZnVuY3Rpb24gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlOiBBcnRlcnlOb2RlLCBjdHg6IENUWCk6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IHtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICBjb25zdCBjb25zdGFudFByb3BzID0gdXNlQ29uc3RhbnRQcm9wcyhub2RlKTtcbiAgY29uc3QgYXBpUmVzdWx0UHJvcHMgPSB1c2VBUElSZXN1bHRQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBhcGlMb2FkaW5nUHJvcHMgPSB1c2VBUElMb2FkaW5nUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3Qgc2hhcmVkU3RhdGVQcm9wcyA9IHVzZVNoYXJlZFN0YXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgaW50ZXJuYWxIb29rUHJvcHMgPSB1c2VJbnRlcm5hbEhvb2tQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBjb21wdXRlZFByb3BzID0gdXNlQ29tcHV0ZWRQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBpbmhlcml0ZWRQcm9wcyA9IHVzZUluaGVyaXRlZFByb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IGZ1bmNQcm9wcyA9IHVzZUZ1bmNQcm9wcyhub2RlKTtcblxuICBjb25zdCBzaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMgPSB1c2VTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMobm9kZSwgY3R4KTtcbiAgY29uc3QgYXBpU3RhdGVJbnZva2VQcm9wcyA9IHVzZUFQSUludm9rZVByb3BzKG5vZGUsIGN0eCk7XG4gIGNvbnN0IHJlbmRlclByb3BzID0gdXNlUmVuZGVyUHJvcHMobm9kZSwgY3R4KTtcblxuICAvLyB0b2RvIHN1cHBvcnQgdXNlciBkZWZpbmVkIG9uQ2xpY2sgZXZlbnRcbiAgY29uc3QgbGlua1Byb3BzID0gdXNlTGlua1Byb3BzKG5vZGUsIGN0eCk7XG5cbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIGNvbnN0IGluc3RhbnRpYXRlUHJvcHMgPSBPYmplY3QuYXNzaWduKFxuICAgICAgY29uc3RhbnRQcm9wcyxcbiAgICAgIGFwaVN0YXRlSW52b2tlUHJvcHMsXG4gICAgICBhcGlSZXN1bHRQcm9wcyxcbiAgICAgIGFwaUxvYWRpbmdQcm9wcyxcbiAgICAgIHNoYXJlZFN0YXRlUHJvcHMsXG4gICAgICBjb21wdXRlZFByb3BzLFxuICAgICAgc2hhcmVkU3RhdGVNdXRhdGlvblByb3BzLFxuICAgICAgaW50ZXJuYWxIb29rUHJvcHMsXG4gICAgICByZW5kZXJQcm9wcyxcbiAgICAgIGxpbmtQcm9wcyxcbiAgICAgIGluaGVyaXRlZFByb3BzLFxuICAgICk7XG5cbiAgICBjdHgubm9kZVByb3BzQ2FjaGU/LnNldFByb3BzKGN1cnJlbnRQYXRoLCBub2RlLmlkLCBpbnN0YW50aWF0ZVByb3BzKTtcblxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKGluc3RhbnRpYXRlUHJvcHMsIGZ1bmNQcm9wcyk7XG4gIH0sIFthcGlSZXN1bHRQcm9wcywgc2hhcmVkU3RhdGVQcm9wcywgYXBpTG9hZGluZ1Byb3BzLCBjb21wdXRlZFByb3BzLCBjb25zdGFudFByb3BzXSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUluc3RhbnRpYXRlUHJvcHM7XG4iLCJpbXBvcnQgeyB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5pbXBvcnQgYm9vdFVwLCB7IEJvb3RSZXN1bHQgfSBmcm9tICcuLi8uLi9ib290LXVwJztcbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uLy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUmVmTG9hZGVyLCBMaWZlY3ljbGVIb29rcywgQXJ0ZXJ5Tm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBBcnRlcnlTcGVjIGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuXG5leHBvcnQgZnVuY3Rpb24gdXNlTGlmZWN5Y2xlSG9vayh7IGRpZE1vdW50LCB3aWxsVW5tb3VudCB9OiBMaWZlY3ljbGVIb29rcyk6IHZvaWQge1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGRpZE1vdW50Py4oKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB3aWxsVW5tb3VudD8uKCk7XG4gICAgfTtcbiAgfSwgW10pO1xufVxuXG5pbnRlcmZhY2UgVXNlUmVmUmVzdWx0UHJvcHMge1xuICBhcnRlcnlJRDogc3RyaW5nO1xuICByZWZMb2FkZXI/OiBSZWZMb2FkZXI7XG4gIG9ycGhhbj86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VSZWZSZXN1bHQoXG4gIHsgYXJ0ZXJ5SUQsIHJlZkxvYWRlciwgb3JwaGFuIH06IFVzZVJlZlJlc3VsdFByb3BzLFxuICBwYXJlbnRDVFg6IENUWCxcbik6IEJvb3RSZXN1bHQgfCB1bmRlZmluZWQge1xuICBjb25zdCBbcmVzdWx0LCBzZXRSZXN1bHRdID0gdXNlU3RhdGU8Qm9vdFJlc3VsdD4oKTtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghYXJ0ZXJ5SUQpIHtcbiAgICAgIGxvZ2dlci5lcnJvcihgYXJ0ZXJ5SUQgaXMgcmVxdWlyZWQgb24gUmVmTm9kZSwgcGxlYXNlIGNoZWNrIHRoZSBzcGVjIGZvciBub2RlOiAke2N1cnJlbnRQYXRofWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghcmVmTG9hZGVyKSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICdyZWZMb2FkZXIgaXMgcmVxdWlyZWQgb24gUmVmTm9kZSBpbiBvcmRlciB0byBnZXQgcmVmIHNjaGVtYSBhbmQgY29ycmVzcG9uZGluZyBBUElTcGVjQWRhcHRlciwnLFxuICAgICAgICAncGxlYXNlIGltcGxlbWVudCByZWZMb2FkZXIgYW5kIHBhc3MgaXQgdG8gcGFyZW50IFJlbmRlckVuZ2luZS4nLFxuICAgICAgICBgY3VycmVudCBSZWZOb2RlIHBhdGggaXM6ICR7Y3VycmVudFBhdGh9YCxcbiAgICAgICk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHVuTW91bnRpbmcgPSBmYWxzZTtcbiAgICBsZXQgX3NjaGVtYTogQXJ0ZXJ5U3BlYy5BcnRlcnkgfCB1bmRlZmluZWQ7XG5cbiAgICByZWZMb2FkZXIoYXJ0ZXJ5SUQpXG4gICAgICAudGhlbigoeyBhcnRlcnksIHBsdWdpbnMgfSkgPT4ge1xuICAgICAgICBpZiAodW5Nb3VudGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIF9zY2hlbWEgPSBhcnRlcnk7XG5cbiAgICAgICAgcmV0dXJuIGJvb3RVcCh7XG4gICAgICAgICAgcGx1Z2lucyxcbiAgICAgICAgICBhcnRlcnk6IGFydGVyeSxcbiAgICAgICAgICBwYXJlbnRDVFg6IG9ycGhhbiA/IHVuZGVmaW5lZCA6IHBhcmVudENUWCxcbiAgICAgICAgfSk7XG4gICAgICB9KVxuICAgICAgLnRoZW4oKHJlZkJvb3RSZXN1bHQpID0+IHtcbiAgICAgICAgaWYgKCFyZWZCb290UmVzdWx0IHx8ICFfc2NoZW1hKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgc2V0UmVzdWx0KHsgY3R4OiByZWZCb290UmVzdWx0LmN0eCwgcm9vdE5vZGU6IHJlZkJvb3RSZXN1bHQucm9vdE5vZGUgfSk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGxvZ2dlci5lcnJvcik7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5Nb3VudGluZyA9IHRydWU7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTaG91bGRSZW5kZXIobm9kZTogQXJ0ZXJ5Tm9kZSwgY3R4OiBDVFgpOiBib29sZWFuIHtcbiAgY29uc3QgY29uZGl0aW9uID0gbm9kZS5zaG91bGRSZW5kZXI7XG4gIGNvbnN0IHBsYWNlaG9sZGVyTm9kZTogQXJ0ZXJ5Tm9kZSA9IHtcbiAgICBpZDogJ3BsYWNlaG9sZGVyLW5vZGUnLFxuICAgIHR5cGU6ICdodG1sLWVsZW1lbnQnLFxuICAgIG5hbWU6ICdkaXYnLFxuICAgIHByb3BzOiBjb25kaXRpb24gPyB7IHNob3VsZFJlbmRlcjogY29uZGl0aW9uIH0gOiB1bmRlZmluZWQsXG4gIH07XG5cbiAgY29uc3QgeyBzaG91bGRSZW5kZXIgfSA9IHVzZUluc3RhbnRpYXRlUHJvcHMocGxhY2Vob2xkZXJOb2RlLCBjdHgpO1xuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoY29uZGl0aW9uLnR5cGUgPT09ICdhcGlfbG9hZGluZ19wcm9wZXJ0eScpIHtcbiAgICByZXR1cm4gY29uZGl0aW9uLnJldmVydCA/ICFzaG91bGRSZW5kZXIgOiAhIXNob3VsZFJlbmRlcjtcbiAgfVxuXG4gIHJldHVybiAhIXNob3VsZFJlbmRlcjtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0LCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcbmltcG9ydCB0eXBlIHsgVFByb3BzIH0gZnJvbSAncmVhY3QtanN4LXBhcnNlcic7XG5cbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgSlNYTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuL2hvb2tzJztcbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuL3BhdGgtY29udGV4dCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IEpTWE5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiB1c2VSZWFjdEpTWFBhcnNlcigpOiBSZWFjdC5Db21wb25lbnQ8VFByb3BzPiB8IG51bGwge1xuICBjb25zdCBbY29tLCBzZXRDb21wb25lbnRdID0gdXNlU3RhdGU8UmVhY3QuQ29tcG9uZW50PFRQcm9wcz4gfCBudWxsPihudWxsKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCB1bk1vdW50aW5nID0gZmFsc2U7XG4gICAgLy8gdG9kbyBjaGFuZ2UgJ3JlYWN0LWpzeC1wYXJzZXInIGFzIHBsdWdpblxuICAgIFN5c3RlbS5pbXBvcnQoJ3JlYWN0LWpzeC1wYXJzZXInKVxuICAgICAgLnRoZW4oKG1vZHVsZSkgPT4ge1xuICAgICAgICBpZiAodW5Nb3VudGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHNldENvbXBvbmVudCgoKSA9PiBtb2R1bGUuZGVmYXVsdCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gbG9hZCBkZXBlbmRhbmNlIHJlYWN0LWpzeC1wYXJzZXI6JywgZXJyKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5Nb3VudGluZyA9IHRydWU7XG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGNvbTtcbn1cblxuZnVuY3Rpb24gSlNYTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMobm9kZSwgY3R4KTtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgUmVhY3RKU1hQYXJzZXIgPSB1c2VSZWFjdEpTWFBhcnNlcigpO1xuXG4gIGlmICghbm9kZS5qc3gpIHtcbiAgICBsb2dnZXIuZXJyb3IoJ2pzeCBzdHJpbmcgaXMgcmVxdWlyZWQsJywgYHBsZWFzZSBjaGVjayB0aGUgc3BlYyBvZiBub2RlOiAke2N1cnJlbnRQYXRofS5gKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghUmVhY3RKU1hQYXJzZXIpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0SlNYUGFyc2VyIGFzIGFueSwge1xuICAgIGJpbmRpbmdzOiBwcm9wcyxcbiAgICByZW5kZXJJbldyYXBwZXI6IGZhbHNlLFxuICAgIGpzeDogbm9kZS5qc3gsXG4gICAgb25FcnJvcjogKGVycjogYW55KSA9PiBjb25zb2xlLmxvZyhlcnIpLFxuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSlNYTm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vaywgdXNlUmVmUmVzdWx0IH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUmVmTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogUmVmTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlZk5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcbiAgY29uc3QgcmVzdWx0ID0gdXNlUmVmUmVzdWx0KFxuICAgIHsgYXJ0ZXJ5SUQ6IG5vZGUuYXJ0ZXJ5SUQsIHJlZkxvYWRlcjogY3R4LnBsdWdpbnMucmVmTG9hZGVyLCBvcnBoYW46IG5vZGUub3JwaGFuIH0sXG4gICAgY3R4LFxuICApO1xuXG4gIGlmICghcmVzdWx0KSB7XG4gICAgaWYgKG5vZGUuZmFsbGJhY2spIHtcbiAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogbm9kZS5mYWxsYmFjaywgY3R4IH0pO1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiByZXN1bHQucm9vdE5vZGUsIGN0eDogcmVzdWx0LmN0eCB9KTtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IHVzZUluc3RhbnRpYXRlUHJvcHMgZnJvbSAnLi4vdXNlLWluc3RhbnRpYXRlLXByb3BzJztcbmltcG9ydCB0eXBlIHsgQ1RYLCBIVE1MTm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IENoaWxkcmVuUmVuZGVyIH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQgeyB1c2VMaWZlY3ljbGVIb29rIH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi9wYXRoLWNvbnRleHQnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBIVE1MTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIEhUTUxOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlLCBjdHgpO1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuXG4gIGlmICghbm9kZS5uYW1lKSB7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgJ25hbWUgcHJvcGVydHkgaXMgcmVxdWlyZWQgaW4gaHRtbCBub2RlIHNwZWMsJyxcbiAgICAgIGBwbGVhc2UgY2hlY2sgdGhlIHNwZWMgb2Ygbm9kZTogJHtjdXJyZW50UGF0aH0uYCxcbiAgICApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFub2RlLmNoaWxkcmVuIHx8ICFub2RlLmNoaWxkcmVuLmxlbmd0aCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG5vZGUubmFtZSwgcHJvcHMpO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgbm9kZS5uYW1lLFxuICAgIHByb3BzLFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2hpbGRyZW5SZW5kZXIsIHsgbm9kZXM6IG5vZGUuY2hpbGRyZW4gfHwgW10sIGN0eCB9KSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSFRNTE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgdHlwZSB7IENvbnN0YW50UHJvcGVydHkgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuaW1wb3J0IHsgQ1RYLCBBcnRlcnlOb2RlLCBQbGFpblN0YXRlLCBOb2RlUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuLi9wYXRoLWNvbnRleHQnO1xuaW1wb3J0IHVzZUluc3RhbnRpYXRlUHJvcHMgZnJvbSAnLi4vLi4vdXNlLWluc3RhbnRpYXRlLXByb3BzJztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUl0ZXJhYmxlKGl0ZXJhYmxlU3RhdGU6IFBsYWluU3RhdGUsIGN0eDogQ1RYKTogQXJyYXk8dW5rbm93bj4gfCBudWxsIHtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICBjb25zdCBkdW1teU5vZGU6IEFydGVyeU5vZGUgPSB7XG4gICAgdHlwZTogJ2h0bWwtZWxlbWVudCcsXG4gICAgaWQ6ICdkdW1teUxvb3BDb250YWluZXInLFxuICAgIG5hbWU6ICdkaXYnLFxuICAgIHByb3BzOiB7IGl0ZXJhYmxlOiBpdGVyYWJsZVN0YXRlIH0sXG4gIH07XG5cbiAgY29uc3QgeyBpdGVyYWJsZSB9ID0gdXNlSW5zdGFudGlhdGVQcm9wcyhkdW1teU5vZGUsIGN0eCk7XG5cbiAgaWYgKCFBcnJheS5pc0FycmF5KGl0ZXJhYmxlKSkge1xuICAgIGNvbnN0IG5vZGVJRCA9IGN1cnJlbnRQYXRoLnNwbGl0KCcvJykucG9wKCk7XG4gICAgbG9nZ2VyLmVycm9yKFxuICAgICAgJ3N0YXRlIGlzIG5vdCBpdGVyYWJsZS4nLFxuICAgICAgYExvb3BDb250YWluZXIgbm9kZSBbJHtub2RlSUR9XSByZXF1aXJlIGEgYXJyYXkgdHlwZSBzdGF0ZSxgLFxuICAgICAgLy8gdG9kbyBvcHRpbWl6ZSB0b1N0cmluZyBvZiBpdGVyYWJsZVxuICAgICAgYGJ1dCBnb3Q6ICR7aXRlcmFibGV9LGAsXG4gICAgICAncGxlYXNlIGNoZWNrIHRoZSBmb2xsb3cgcHJvcGVydHkgc3BlYzpcXG4nLFxuICAgICAgaXRlcmFibGVTdGF0ZSxcbiAgICApO1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGl0ZXJhYmxlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXBwcm9wcmlhdGVLZXkoaXRlbTogdW5rbm93biwgbG9vcEtleTogc3RyaW5nLCBpbmRleDogbnVtYmVyKTogc3RyaW5nIHwgbnVtYmVyIHtcbiAgaWYgKHR5cGVvZiBpdGVtID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgaXRlbSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gaXRlbTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIGl0ZW0gPT09ICdmdW5jdGlvbicgfHwgdHlwZW9mIGl0ZW0gPT09ICdib29sZWFuJykge1xuICAgIHJldHVybiBpbmRleDtcbiAgfVxuXG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gJ29iamVjdCcgJiYgaXRlbSAhPT0gbnVsbCkge1xuICAgIC8vIGp1c3QgZm9yIG92ZXJyaWRlIHR5cGVzY3JpcHQgXCJObyBpbmRleCBzaWduYXR1cmVcIiBlcnJvclxuICAgIHJldHVybiBSZWZsZWN0LmdldChpdGVtLCBsb29wS2V5KTtcbiAgfVxuXG4gIHJldHVybiBpbmRleDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHRyeVRvUHJvcHMoXG4gIHNvdXJjZTogdW5rbm93bixcbiAgaW5kZXg6IG51bWJlcixcbiAgdG9Qcm9wczogKGl0ZW06IHVua25vd24sIGluZGV4OiBudW1iZXIpID0+IFJlY29yZDxzdHJpbmcsIHVua25vd24+LFxuICBjdXJyZW50UGF0aDogc3RyaW5nLFxuKTogUmVjb3JkPHN0cmluZywgdW5rbm93bj4gfCBudWxsIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB0b1Byb3BzUmVzdWx0ID0gdG9Qcm9wcyhzb3VyY2UsIGluZGV4KTtcbiAgICBpZiAodHlwZW9mIHRvUHJvcHNSZXN1bHQgIT09ICdvYmplY3QnICYmICF0b1Byb3BzUmVzdWx0KSB7XG4gICAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAgICd0b1Byb3BzIHJlc3VsdCBzaG91bGQgYmUgYW4gb2JqZWN0LCBidXQgZ290OiAke3RvUHJvcHNSZXN1bHR9LCcsXG4gICAgICAgIGBwbGVhc2UgY2hlY2sgdGhlIHRvUHJvcHMgc3BlYyBvZiBub2RlOiAke2N1cnJlbnRQYXRofSxgLFxuICAgICAgICAndGhlIGNvcnJlc3BvbmRpbmcgbm9kZSB3aWxsIGJlIHNraXBwZWQgZm9yIHJlbmRlci4nLFxuICAgICAgKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiB0b1Byb3BzUmVzdWx0O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICdBbiBlcnJvciBvY2N1cnJlZCB3aGlsZSBjYWxsaW5nIHRvUHJvcHMgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcjonLFxuICAgICAgc291cmNlLFxuICAgICAgJ1xcbicsXG4gICAgICAnZXJyb3I6JyxcbiAgICAgIGVycm9yLFxuICAgICAgJ1xcbicsXG4gICAgICBgcGxlYXNlIGNoZWNrIHRoZSB0b1Byb3BzIHNwZWMgb2Ygbm9kZTogJHtjdXJyZW50UGF0aH0sYCxcbiAgICAgICd0aGUgY29ycmVzcG9uZGluZyBub2RlIHdpbGwgYmUgc2tpcHBlZCBmb3IgcmVuZGVyLicsXG4gICAgKTtcblxuICAgIHJldHVybiBudWxsO1xuICB9XG59XG5cbmludGVyZmFjZSBVc2VNZXJnZWRQcm9wc0xpc3RQYXJhbXMge1xuICBpdGVyYWJsZVN0YXRlOiBQbGFpblN0YXRlO1xuICB0b1Byb3BzOiAoaXRlbTogdW5rbm93bikgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj47XG4gIG90aGVyUHJvcHM/OiBOb2RlUHJvcGVydGllcztcbiAgY3R4OiBDVFg7XG4gIGxvb3BLZXk6IHN0cmluZztcbn1cblxuLy8gdXNlTWVyZ2VkUHJvcHNMaXN0IHJldHVybiBhIGxpc3Qgb2YgYHByb3BzYCBhbmQgYGtleWAgd2hpY2ggY291bGQgYmUgdXNlZCBmb3IgaXRlcmF0aW9uLFxuLy8gZWFjaCBgcHJvcHNgIG1lcmdlZCBpdGVyYWJsZVN0YXRlIGFuZCBvdGhlclByb3BzXG5leHBvcnQgZnVuY3Rpb24gdXNlTWVyZ2VkUHJvcHNMaXN0KHtcbiAgaXRlcmFibGVTdGF0ZSxcbiAgdG9Qcm9wcyxcbiAgb3RoZXJQcm9wcyxcbiAgY3R4LFxuICBsb29wS2V5LFxufTogVXNlTWVyZ2VkUHJvcHNMaXN0UGFyYW1zKTogQXJyYXk8W1JlYWN0LktleSwgTm9kZVByb3BlcnRpZXNdPiB8IG51bGwge1xuICBjb25zdCBpdGVyYWJsZSA9IHVzZUl0ZXJhYmxlKGl0ZXJhYmxlU3RhdGUsIGN0eCk7XG4gIGNvbnN0IGN1cnJlbnRQYXRoID0gdXNlQ29udGV4dChQYXRoQ29udGV4dCk7XG5cbiAgaWYgKCFpdGVyYWJsZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIGl0ZXJhYmxlXG4gICAgLm1hcDxbUmVhY3QuS2V5LCBOb2RlUHJvcGVydGllc10gfCBudWxsPigoaXRlbSwgaW5kZXgpID0+IHtcbiAgICAgIGNvbnN0IGNvbnZlcnRlZFByb3BzID0gdHJ5VG9Qcm9wcyhpdGVtLCBpbmRleCwgdG9Qcm9wcywgY3VycmVudFBhdGgpO1xuICAgICAgaWYgKCFjb252ZXJ0ZWRQcm9wcykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cblxuICAgICAgLy8gY29udmVydCBpdGVyYWJsZSB0byBjb25zdGFudCBwcm9wZXJ0eSBzcGVjIGZvciByZXVzZSBvZiBOb2RlUmVuZGVyXG4gICAgICBjb25zdCBjb25zdFByb3BzID0gT2JqZWN0LmVudHJpZXMoY29udmVydGVkUHJvcHMpLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBDb25zdGFudFByb3BlcnR5Pj4oXG4gICAgICAgIChjb25zdFByb3BzLCBbcHJvcE5hbWUsIHZhbHVlXSkgPT4ge1xuICAgICAgICAgIGNvbnN0UHJvcHNbcHJvcE5hbWVdID0geyB0eXBlOiAnY29uc3RhbnRfcHJvcGVydHknLCB2YWx1ZSB9O1xuXG4gICAgICAgICAgcmV0dXJuIGNvbnN0UHJvcHM7XG4gICAgICAgIH0sXG4gICAgICAgIHt9LFxuICAgICAgKTtcblxuICAgICAgcmV0dXJuIFtnZXRBcHByb3ByaWF0ZUtleShpdGVtLCBsb29wS2V5LCBpbmRleCksIE9iamVjdC5hc3NpZ24oe30sIG90aGVyUHJvcHMsIGNvbnN0UHJvcHMpXTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHBhaXIpOiBwYWlyIGlzIFtSZWFjdC5LZXksIE5vZGVQcm9wZXJ0aWVzXSA9PiAhIXBhaXIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlQ29tcG9zZWRQcm9wc1NwZWMoXG4gIGNvbXBvc2VkU3RhdGU6IHVua25vd24sXG4gIHRvUHJvcHM6IChzdGF0ZTogdW5rbm93bikgPT4gUmVjb3JkPHN0cmluZywgdW5rbm93bj4sXG4gIGluZGV4OiBudW1iZXIsXG4gIG90aGVyUHJvcHM/OiBOb2RlUHJvcGVydGllcyxcbik6IE5vZGVQcm9wZXJ0aWVzIHtcbiAgY29uc3QgY3VycmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcblxuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgY29uc3QgY29tcG9zZWRQcm9wcyA9IHRyeVRvUHJvcHMoY29tcG9zZWRTdGF0ZSwgaW5kZXgsIHRvUHJvcHMsIGN1cnJlbnRQYXRoKTtcbiAgICBjb25zdCBjb21wb3NlZFByb3BzU3BlYyA9IE9iamVjdC5lbnRyaWVzKGNvbXBvc2VkUHJvcHMgfHwge30pLnJlZHVjZTxSZWNvcmQ8c3RyaW5nLCBDb25zdGFudFByb3BlcnR5Pj4oXG4gICAgICAoYWNjLCBba2V5LCB2YWx1ZV0pID0+IHtcbiAgICAgICAgYWNjW2tleV0gPSB7XG4gICAgICAgICAgdHlwZTogJ2NvbnN0YW50X3Byb3BlcnR5JyxcbiAgICAgICAgICB2YWx1ZSxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sXG4gICAgICB7fSxcbiAgICApO1xuXG4gICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIG90aGVyUHJvcHMsIGNvbXBvc2VkUHJvcHNTcGVjKTtcbiAgfSwgW2NvbXBvc2VkU3RhdGUsIG90aGVyUHJvcHNdKTtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBDVFgsIEFydGVyeU5vZGUsIFBsYWluU3RhdGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuLic7XG5pbXBvcnQgeyB1c2VNZXJnZWRQcm9wc0xpc3QgfSBmcm9tICcuL2hlbHBlcnMnO1xuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4uL3BhdGgtY29udGV4dCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcHMge1xuICBpdGVyYWJsZVN0YXRlOiBQbGFpblN0YXRlO1xuICBsb29wS2V5OiBzdHJpbmc7XG4gIHRvUHJvcHM6IChpdGVtOiB1bmtub3duKSA9PiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcbiAgbm9kZTogQXJ0ZXJ5Tm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIExvb3BJbmRpdmlkdWFsKHsgaXRlcmFibGVTdGF0ZSwgbG9vcEtleSwgbm9kZSwgY3R4LCB0b1Byb3BzIH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgbWVyZ2VkUHJvcHNMaXN0ID0gdXNlTWVyZ2VkUHJvcHNMaXN0KHtcbiAgICBpdGVyYWJsZVN0YXRlLFxuICAgIHRvUHJvcHMsXG4gICAgY3R4LFxuICAgIGxvb3BLZXksXG4gICAgb3RoZXJQcm9wczogbm9kZS5wcm9wcyxcbiAgfSk7XG5cbiAgaWYgKCFtZXJnZWRQcm9wc0xpc3QpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIFJlYWN0LkZyYWdtZW50LFxuICAgIG51bGwsXG4gICAgbWVyZ2VkUHJvcHNMaXN0Lm1hcCgoW2tleSwgcHJvcHNdLCBpbmRleCk6IFJlYWN0LlJlYWN0RWxlbWVudCA9PiB7XG4gICAgICBjb25zdCBuZXdOb2RlID0gT2JqZWN0LmFzc2lnbih7fSwgbm9kZSwgeyBwcm9wcyB9KTtcblxuICAgICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgICB7IHZhbHVlOiBgJHtwYXJlbnRQYXRofS8ke2luZGV4fWAsIGtleSB9LFxuICAgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsga2V5LCBub2RlOiBuZXdOb2RlLCBjdHggfSksXG4gICAgICApO1xuICAgIH0pLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMb29wSW5kaXZpZHVhbDtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5cbmltcG9ydCB0eXBlIHsgQ29tcG9uZW50TG9hZGVyUGFyYW0sIER5bmFtaWNDb21wb25lbnQsIFJlcG9zaXRvcnkgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kQ29tcG9uZW50SW5SZXBvc2l0b3J5KFxuICByZXBvc2l0b3J5OiBSZXBvc2l0b3J5LFxuICB7IHBhY2thZ2VOYW1lLCBwYWNrYWdlVmVyc2lvbiwgZXhwb3J0TmFtZSB9OiBDb21wb25lbnRMb2FkZXJQYXJhbSxcbik6IER5bmFtaWNDb21wb25lbnQgfCB1bmRlZmluZWQge1xuICBjb25zdCBwYWNrYWdlTmFtZVZlcnNpb24gPSBgJHtwYWNrYWdlTmFtZX1AJHtwYWNrYWdlVmVyc2lvbn1gO1xuXG4gIHJldHVybiByZXBvc2l0b3J5W3BhY2thZ2VOYW1lVmVyc2lvbl0/LltleHBvcnROYW1lIHx8ICdkZWZhdWx0J107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzeXN0ZW1Db21wb25lbnRMb2FkZXIoe1xuICBwYWNrYWdlTmFtZSxcbiAgZXhwb3J0TmFtZSxcbn06IENvbXBvbmVudExvYWRlclBhcmFtKTogUHJvbWlzZTxEeW5hbWljQ29tcG9uZW50PiB7XG4gIHJldHVybiBTeXN0ZW0uaW1wb3J0KHBhY2thZ2VOYW1lKVxuICAgIC50aGVuKChzeXN0ZW1Nb2R1bGUpID0+IHtcbiAgICAgIC8vIHRvZG8gY2F0Y2ggdW5kZWZpbmVkIGVycm9yXG4gICAgICByZXR1cm4gc3lzdGVtTW9kdWxlW2V4cG9ydE5hbWUgfHwgJ2RlZmF1bHQnXTtcbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgIGxvZ2dlci5lcnJvcignZmFpbGVkIHRvIGxvYWQgbm9kZSBjb21wb25lbnQsJywgZXJyb3IpO1xuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbn1cbiIsImltcG9ydCB7IHVzZUNvbnRleHQsIHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuXG5pbXBvcnQgUGF0aENvbnRleHQgZnJvbSAnLi4vcGF0aC1jb250ZXh0JztcbmltcG9ydCB7IGZpbmRDb21wb25lbnRJblJlcG9zaXRvcnksIHN5c3RlbUNvbXBvbmVudExvYWRlciB9IGZyb20gJy4vaGVscGVyJztcbmltcG9ydCB0eXBlIHsgRHluYW1pY0NvbXBvbmVudCwgUGx1Z2lucywgUmVhY3RDb21wb25lbnROb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VOb2RlQ29tcG9uZW50KFxuICBub2RlOiBQaWNrPFJlYWN0Q29tcG9uZW50Tm9kZSwgJ3BhY2thZ2VOYW1lJyB8ICdwYWNrYWdlVmVyc2lvbicgfCAnZXhwb3J0TmFtZSc+LFxuICB7IHJlcG9zaXRvcnksIGNvbXBvbmVudExvYWRlciB9OiBQaWNrPFBsdWdpbnMsICdyZXBvc2l0b3J5JyB8ICdjb21wb25lbnRMb2FkZXInPixcbik6IER5bmFtaWNDb21wb25lbnQgfCB1bmRlZmluZWQge1xuICBjb25zdCBjdXJyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuICBjb25zdCBbbGF6eUxvYWRlZENvbXBvbmVudCwgc2V0Q29tcG9uZW50XSA9IHVzZVN0YXRlPER5bmFtaWNDb21wb25lbnQgfCB1bmRlZmluZWQ+KCgpID0+IHtcbiAgICBpZiAoIXJlcG9zaXRvcnkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gZmluZENvbXBvbmVudEluUmVwb3NpdG9yeShyZXBvc2l0b3J5LCBub2RlKTtcbiAgfSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAobGF6eUxvYWRlZENvbXBvbmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCB1bk1vdW50aW5nID0gZmFsc2U7XG4gICAgY29uc3QgZmluaWFsTG9hZGVyID0gY29tcG9uZW50TG9hZGVyIHx8IHN5c3RlbUNvbXBvbmVudExvYWRlcjtcblxuICAgIGZpbmlhbExvYWRlcih7XG4gICAgICBwYWNrYWdlTmFtZTogbm9kZS5wYWNrYWdlTmFtZSxcbiAgICAgIHBhY2thZ2VWZXJzaW9uOiBub2RlLnBhY2thZ2VWZXJzaW9uLFxuICAgICAgZXhwb3J0TmFtZTogbm9kZS5leHBvcnROYW1lLFxuICAgIH0pXG4gICAgICAudGhlbigoY29tcCkgPT4ge1xuICAgICAgICBpZiAodW5Nb3VudGluZykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghY29tcCkge1xuICAgICAgICAgIGxvZ2dlci5lcnJvcihcbiAgICAgICAgICAgIGBnb3QgZW1wdHkgY29tcG9uZW50IGZvciBwYWNrYWdlOiAke25vZGUucGFja2FnZU5hbWV9LGAsXG4gICAgICAgICAgICBgZXhwb3J0TmFtZTogJHtub2RlLmV4cG9ydE5hbWV9LCB2ZXJzaW9uOiAke25vZGUucGFja2FnZVZlcnNpb259YCxcbiAgICAgICAgICAgIGBwbGVhc2UgY2hlY2sgdGhlIHNwZWMgZm9yIG5vZGU6ICR7Y3VycmVudFBhdGh9LmAsXG4gICAgICAgICAgKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBzZXRDb21wb25lbnQoKCkgPT4gY29tcCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKGxvZ2dlci5lcnJvcik7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5Nb3VudGluZyA9IHRydWU7XG4gICAgfTtcbiAgfSwgW2xhenlMb2FkZWRDb21wb25lbnRdKTtcblxuICByZXR1cm4gbGF6eUxvYWRlZENvbXBvbmVudDtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyBQcm9wc1dpdGhDaGlsZHJlbiB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ1RYLCBIVE1MTm9kZSwgUmVhY3RDb21wb25lbnROb2RlLCBDb21wb3NlT3V0TGF5ZXIgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgdXNlSW5zdGFudGlhdGVQcm9wcyBmcm9tICcuLi8uLi91c2UtaW5zdGFudGlhdGUtcHJvcHMnO1xuaW1wb3J0IHsgdXNlTGlmZWN5Y2xlSG9vayB9IGZyb20gJy4uL2hvb2tzJztcbmltcG9ydCB1c2VOb2RlQ29tcG9uZW50IGZyb20gJy4uL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudCc7XG5cbnR5cGUgSFRNTE91dExheWVyUmVuZGVyUHJvcHMgPSBQcm9wc1dpdGhDaGlsZHJlbjx7XG4gIG91dExheWVyOiBPbWl0PEhUTUxOb2RlLCAnY2hpbGRyZW4nPjtcbiAgY3R4OiBDVFg7XG59PjtcblxuZnVuY3Rpb24gSFRNTE91dExheWVyUmVuZGVyKHsgb3V0TGF5ZXIsIGN0eCwgY2hpbGRyZW4gfTogSFRNTE91dExheWVyUmVuZGVyUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQge1xuICBjb25zdCBwcm9wcyA9IHVzZUluc3RhbnRpYXRlUHJvcHMob3V0TGF5ZXIsIGN0eCk7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG91dExheWVyLm5hbWUsIHByb3BzLCBjaGlsZHJlbik7XG59XG5cbnR5cGUgUmVhY3RDb21wb25lbnRPdXRMYXllclJlbmRlclByb3BzID0gUHJvcHNXaXRoQ2hpbGRyZW48e1xuICBvdXRMYXllcjogT21pdDxSZWFjdENvbXBvbmVudE5vZGUsICdjaGlsZHJlbic+O1xuICBjdHg6IENUWDtcbn0+O1xuXG5mdW5jdGlvbiBSZWFjdENvbXBvbmVudE91dExheWVyUmVuZGVyKHtcbiAgb3V0TGF5ZXIsXG4gIGN0eCxcbiAgY2hpbGRyZW4sXG59OiBSZWFjdENvbXBvbmVudE91dExheWVyUmVuZGVyUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgcHJvcHMgPSB1c2VJbnN0YW50aWF0ZVByb3BzKG91dExheWVyLCBjdHgpO1xuICBjb25zdCBub2RlQ29tcG9uZW50ID0gdXNlTm9kZUNvbXBvbmVudChvdXRMYXllciwgY3R4LnBsdWdpbnMpO1xuICB1c2VMaWZlY3ljbGVIb29rKG91dExheWVyLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcblxuICBpZiAoIW5vZGVDb21wb25lbnQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KG5vZGVDb21wb25lbnQsIHByb3BzLCBjaGlsZHJlbik7XG59XG5cbnR5cGUgUHJvcHMgPSBQcm9wc1dpdGhDaGlsZHJlbjx7XG4gIG91dExheWVyPzogQ29tcG9zZU91dExheWVyO1xuICBjdHg6IENUWDtcbn0+O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBPdXRMYXllclJlbmRlcih7IG91dExheWVyLCBjdHgsIGNoaWxkcmVuIH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGlmIChvdXRMYXllcj8udHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChIVE1MT3V0TGF5ZXJSZW5kZXIsIHsgb3V0TGF5ZXIsIGN0eCB9LCBjaGlsZHJlbik7XG4gIH1cblxuICBpZiAob3V0TGF5ZXI/LnR5cGUgPT09ICdyZWFjdC1jb21wb25lbnQnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVhY3RDb21wb25lbnRPdXRMYXllclJlbmRlciwgeyBvdXRMYXllciwgY3R4IH0sIGNoaWxkcmVuKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0LkZyYWdtZW50LCBudWxsLCBjaGlsZHJlbik7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlQ29udGV4dCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgQ1RYLCBQbGFpblN0YXRlLCBDb21wb3NlZE5vZGUsIENvbXBvc2VkTm9kZUNoaWxkIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuaW1wb3J0IHsgZ2V0QXBwcm9wcmlhdGVLZXksIHVzZUl0ZXJhYmxlLCB1c2VDb21wb3NlZFByb3BzU3BlYyB9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQgTm9kZVJlbmRlciBmcm9tICcuLi9pbmRleCc7XG5pbXBvcnQgT3V0TGF5ZXJSZW5kZXIgZnJvbSAnLi9vdXQtbGF5ZXItcmVuZGVyJztcbmltcG9ydCBQYXRoQ29udGV4dCBmcm9tICcuLi9wYXRoLWNvbnRleHQnO1xuXG5pbnRlcmZhY2UgQ29tcG9zZWRDaGlsZFJlbmRlclByb3BzIHtcbiAgbm9kZTogQ29tcG9zZWROb2RlQ2hpbGQ7XG4gIGNvbXBvc2VkU3RhdGU6IHVua25vd247XG4gIGN0eDogQ1RYO1xuICBpbmRleDogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBDb21wb3NlZENoaWxkUmVuZGVyKHtcbiAgbm9kZSxcbiAgY29tcG9zZWRTdGF0ZSxcbiAgY3R4LFxuICBpbmRleCxcbn06IENvbXBvc2VkQ2hpbGRSZW5kZXJQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB7XG4gIGNvbnN0IHByb3BTcGVjID0gdXNlQ29tcG9zZWRQcm9wc1NwZWMoY29tcG9zZWRTdGF0ZSwgbm9kZS50b1Byb3BzLCBpbmRleCwgbm9kZS5wcm9wcyk7XG4gIGNvbnN0IF9ub2RlID0gT2JqZWN0LmFzc2lnbih7fSwgbm9kZSwgeyBwcm9wczogcHJvcFNwZWMgfSk7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogX25vZGUsIGN0eCB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBQcm9wcyB7XG4gIGl0ZXJhYmxlU3RhdGU6IFBsYWluU3RhdGU7XG4gIGxvb3BLZXk6IHN0cmluZztcbiAgbm9kZTogQ29tcG9zZWROb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gTG9vcENvbXBvc2VkKHsgaXRlcmFibGVTdGF0ZSwgbG9vcEtleSwgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHBhcmVudFBhdGggPSB1c2VDb250ZXh0KFBhdGhDb250ZXh0KTtcbiAgY29uc3QgaXRlcmFibGUgPSB1c2VJdGVyYWJsZShpdGVyYWJsZVN0YXRlLCBjdHgpO1xuXG4gIGlmICghaXRlcmFibGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIFJlYWN0LkZyYWdtZW50LFxuICAgIG51bGwsXG4gICAgaXRlcmFibGUubWFwKChjb21wb3NlZFN0YXRlLCBpbmRleCkgPT4ge1xuICAgICAgY29uc3Qga2V5ID0gZ2V0QXBwcm9wcmlhdGVLZXkoY29tcG9zZWRTdGF0ZSwgbG9vcEtleSwgaW5kZXgpO1xuXG4gICAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICAgIHsgdmFsdWU6IGAke3BhcmVudFBhdGh9LyR7bm9kZS5pZH0vJHtpbmRleH1gLCBrZXk6IGluZGV4IH0sXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgT3V0TGF5ZXJSZW5kZXIsXG4gICAgICAgICAgeyBrZXksIG91dExheWVyOiBub2RlLm91dExheWVyLCBjdHggfSxcbiAgICAgICAgICAobm9kZS5ub2RlcyB8fCBub2RlLmNoaWxkcmVuKS5tYXAoKGNvbXBvc2VkQ2hpbGQsIGluZGV4KTogUmVhY3QuUmVhY3RFbGVtZW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbXBvc2VkQ2hpbGRSZW5kZXIsIHtcbiAgICAgICAgICAgICAgbm9kZTogY29tcG9zZWRDaGlsZCxcbiAgICAgICAgICAgICAgY29tcG9zZWRTdGF0ZSxcbiAgICAgICAgICAgICAgY3R4LFxuICAgICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgICAga2V5OiBjb21wb3NlZENoaWxkLmlkLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSksXG4gICAgICAgICksXG4gICAgICApO1xuICAgIH0pLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMb29wQ29tcG9zZWQ7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IExvb3BJbmRpdmlkdWFsIGZyb20gJy4vbG9vcC1pbmRpdmlkdWFsJztcbmltcG9ydCBMb29wQ29tcG9zZWQgZnJvbSAnLi9sb29wLWNvbXBvc2VkJztcbmltcG9ydCB0eXBlIHsgQ1RYLCBMb29wQ29udGFpbmVyTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuLi9ob29rcyc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IExvb3BDb250YWluZXJOb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gTG9vcE5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgdXNlTGlmZWN5Y2xlSG9vayhub2RlLmxpZmVjeWNsZUhvb2tzIHx8IHt9KTtcblxuICBjb25zdCB7IG5vZGU6IExvb3BlZE5vZGUgfSA9IG5vZGU7XG5cbiAgaWYgKExvb3BlZE5vZGUudHlwZSAhPT0gJ2NvbXBvc2VkLW5vZGUnICYmICd0b1Byb3BzJyBpbiBub2RlKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTG9vcEluZGl2aWR1YWwsIHtcbiAgICAgIGl0ZXJhYmxlU3RhdGU6IG5vZGUuaXRlcmFibGVTdGF0ZSxcbiAgICAgIGxvb3BLZXk6IG5vZGUubG9vcEtleSxcbiAgICAgIG5vZGU6IExvb3BlZE5vZGUsXG4gICAgICB0b1Byb3BzOiAodjogdW5rbm93bikgPT4gbm9kZS50b1Byb3BzKHYpLFxuICAgICAgY3R4LFxuICAgIH0pO1xuICB9XG5cbiAgaWYgKExvb3BlZE5vZGUudHlwZSA9PT0gJ2NvbXBvc2VkLW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTG9vcENvbXBvc2VkLCB7XG4gICAgICBpdGVyYWJsZVN0YXRlOiBub2RlLml0ZXJhYmxlU3RhdGUsXG4gICAgICBsb29wS2V5OiBub2RlLmxvb3BLZXksXG4gICAgICBub2RlOiBMb29wZWROb2RlLFxuICAgICAgY3R4LFxuICAgIH0pO1xuICB9XG5cbiAgbG9nZ2VyLmVycm9yKCdVbnJlY29nbml6ZWQgbG9vcCBub2RlOicsIG5vZGUpO1xuXG4gIHJldHVybiBudWxsO1xufVxuXG5leHBvcnQgZGVmYXVsdCBMb29wTm9kZVJlbmRlcjtcbiIsImltcG9ydCByZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IFJvdXRlQ29udGV4dCA9IHJlYWN0LmNyZWF0ZUNvbnRleHQ8c3RyaW5nPignLycpO1xuXG5leHBvcnQgZGVmYXVsdCBSb3V0ZUNvbnRleHQ7XG4iLCIvLyB0cmltIGJlZ2luIGFuZCBsYXN0IHNsYXNoXG5leHBvcnQgZnVuY3Rpb24gdHJpbVNsYXNoKHBhdGg6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBwYXRoLnJlcGxhY2UoL15cXC98XFwvJC9nLCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1BhcmFtSG9sZGVyKGZyYWdtZW50OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIC9eOlthLXpBLVpfXVtbYS16QS1aXyQwLTldKyQvLnRlc3QoZnJhZ21lbnQpO1xufVxuIiwiaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUgeyBMb2NhdGlvbiB9IGZyb20gJ2hpc3RvcnknO1xuXG5pbXBvcnQgeyBpc1BhcmFtSG9sZGVyIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGFjdGx5Q2hlY2socGF0aDogc3RyaW5nLCBjdXJyZW50Um91dGVQYXRoOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgcGF0aEZyYWdtZW50cyA9IHBhdGguc3BsaXQoJy8nKTtcbiAgY29uc3Qgcm91dGVGcmFnbWVudHMgPSBjdXJyZW50Um91dGVQYXRoLnNwbGl0KCcvJyk7XG4gIGlmIChwYXRoRnJhZ21lbnRzLmxlbmd0aCAhPT0gcm91dGVGcmFnbWVudHMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBhdGhGcmFnbWVudHMuZXZlcnkoKGZyYWdtZW50LCBpbmRleCkgPT4ge1xuICAgIGlmIChpc1BhcmFtSG9sZGVyKHJvdXRlRnJhZ21lbnRzW2luZGV4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmcmFnbWVudCA9PT0gcm91dGVGcmFnbWVudHNbaW5kZXhdO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByZWZpeENoZWNrKHBhdGg6IHN0cmluZywgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIGNvbnN0IHBhdGhGcmFnbWVudHMgPSBwYXRoLnNwbGl0KCcvJyk7XG4gIGNvbnN0IHJvdXRlRnJhZ21lbnRzID0gY3VycmVudFJvdXRlUGF0aC5zcGxpdCgnLycpO1xuICBpZiAocGF0aEZyYWdtZW50cy5sZW5ndGggPCByb3V0ZUZyYWdtZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICByZXR1cm4gcm91dGVGcmFnbWVudHMuZXZlcnkoKGZyYWdtZW50LCBpbmRleCkgPT4ge1xuICAgIGlmIChpc1BhcmFtSG9sZGVyKGZyYWdtZW50KSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZyYWdtZW50ID09PSBwYXRoRnJhZ21lbnRzW2luZGV4XTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHVzZU1hdGNoKGxvY2F0aW9uJDogQmVoYXZpb3JTdWJqZWN0PExvY2F0aW9uPiwgY3VycmVudFJvdXRlUGF0aDogc3RyaW5nLCBleGFjdGx5OiBib29sZWFuKTogYm9vbGVhbiB7XG4gIGNvbnN0IFttYXRjaCwgc2V0TWF0Y2hdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaWJlID0gbG9jYXRpb24kXG4gICAgICAucGlwZShcbiAgICAgICAgbWFwKCh7IHBhdGhuYW1lIH0pOiBib29sZWFuID0+IHtcbiAgICAgICAgICByZXR1cm4gZXhhY3RseSA/IGV4YWN0bHlDaGVjayhwYXRobmFtZSwgY3VycmVudFJvdXRlUGF0aCkgOiBwcmVmaXhDaGVjayhwYXRobmFtZSwgY3VycmVudFJvdXRlUGF0aCk7XG4gICAgICAgIH0pLFxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShzZXRNYXRjaCk7XG5cbiAgICByZXR1cm4gKCkgPT4gc3Vic2NyaWJlLnVuc3Vic2NyaWJlKCk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gbWF0Y2g7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZU1hdGNoO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4uL2luZGV4JztcbmltcG9ydCBSb3V0ZVBhdGhDb250ZXh0IGZyb20gJy4vcm91dGUtcGF0aC1jb250ZXh0JztcbmltcG9ydCB1c2VNYXRjaCBmcm9tICcuL3VzZS1tYXRjaCc7XG5pbXBvcnQgeyB0cmltU2xhc2ggfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuLi9ob29rcyc7XG5pbXBvcnQgdHlwZSB7IENUWCwgUm91dGVOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogUm91dGVOb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gYnVpbGRDdXJyZW50UGF0aChwYXJlbnRQYXRoOiBzdHJpbmcsIHJvdXRlUGF0aDogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKHBhcmVudFBhdGggPT09ICcvJykge1xuICAgIHJldHVybiBgLyR7dHJpbVNsYXNoKHJvdXRlUGF0aCl9YDtcbiAgfVxuXG4gIHJldHVybiBgJHtwYXJlbnRQYXRofS8ke3RyaW1TbGFzaChyb3V0ZVBhdGgpfWA7XG59XG5cbmZ1bmN0aW9uIFJvdXRlTm9kZVJlbmRlcih7IG5vZGUsIGN0eCB9OiBQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICB1c2VMaWZlY3ljbGVIb29rKG5vZGUubGlmZWN5Y2xlSG9va3MgfHwge30pO1xuXG4gIGNvbnN0IHBhcmVudFJvdXRlUGF0aCA9IHVzZUNvbnRleHQoUm91dGVQYXRoQ29udGV4dCk7XG4gIGNvbnN0IGN1cnJlbnRSb3V0ZVBhdGggPSBidWlsZEN1cnJlbnRQYXRoKHBhcmVudFJvdXRlUGF0aCwgbm9kZS5wYXRoKTtcbiAgY29uc3QgbWF0Y2ggPSB1c2VNYXRjaChjdHgubG9jYXRpb24kLCBjdXJyZW50Um91dGVQYXRoLCBub2RlLmV4YWN0bHkgPz8gZmFsc2UpO1xuXG4gIGlmIChtYXRjaCkge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUm91dGVQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRSb3V0ZVBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBub2RlOiBub2RlLm5vZGUsIGN0eCB9KSxcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJvdXRlTm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB1c2VJbnN0YW50aWF0ZVByb3BzIGZyb20gJy4uL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5pbXBvcnQgeyBDaGlsZHJlblJlbmRlciB9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIFJlYWN0Q29tcG9uZW50Tm9kZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHVzZUxpZmVjeWNsZUhvb2sgfSBmcm9tICcuL2hvb2tzJztcbmltcG9ydCB1c2VOb2RlQ29tcG9uZW50IGZyb20gJy4vaG9va3MvdXNlLW5vZGUtY29tcG9uZW50JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogUmVhY3RDb21wb25lbnROb2RlO1xuICBjdHg6IENUWDtcbn1cblxuZnVuY3Rpb24gUmVhY3RDb21wb25lbnROb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBub2RlQ29tcG9uZW50ID0gdXNlTm9kZUNvbXBvbmVudChub2RlLCBjdHgucGx1Z2lucyk7XG4gIHVzZUxpZmVjeWNsZUhvb2sobm9kZS5saWZlY3ljbGVIb29rcyB8fCB7fSk7XG5cbiAgaWYgKCFub2RlQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQobm9kZUNvbXBvbmVudCwgcHJvcHMpO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgbm9kZUNvbXBvbmVudCxcbiAgICBwcm9wcyxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENoaWxkcmVuUmVuZGVyLCB7IG5vZGVzOiBub2RlLmNoaWxkcmVuIHx8IFtdLCBjdHggfSksXG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbG9nZ2VyIH0gZnJvbSAnQG9uZS1mb3ItYWxsL3V0aWxzJztcblxuaW1wb3J0IFBhdGhDb250ZXh0IGZyb20gJy4vcGF0aC1jb250ZXh0JztcbmltcG9ydCB7IHVzZVNob3VsZFJlbmRlciB9IGZyb20gJy4vaG9va3MnO1xuaW1wb3J0IHsgQ1RYLCBBcnRlcnlOb2RlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IEpTWE5vZGVSZW5kZXIgZnJvbSAnLi9qc3gtbm9kZS1yZW5kZXInO1xuaW1wb3J0IFJlZk5vZGVSZW5kZXIgZnJvbSAnLi9yZWYtbm9kZS1yZW5kZXInO1xuaW1wb3J0IEhUTUxOb2RlUmVuZGVyIGZyb20gJy4vaHRtbC1ub2RlLXJlbmRlcic7XG5pbXBvcnQgTG9vcE5vZGVSZW5kZXIgZnJvbSAnLi9sb29wLW5vZGUtcmVuZGVyJztcbmltcG9ydCBSb3V0ZU5vZGVSZW5kZXIgZnJvbSAnLi9yb3V0ZS1ub2RlLXJlbmRlcic7XG5pbXBvcnQgUmVhY3RDb21wb25lbnROb2RlUmVuZGVyIGZyb20gJy4vcmVhY3QtY29tcG9uZW50LW5vZGUtcmVuZGVyJztcblxuaW50ZXJmYWNlIENoaWxkcmVuUmVuZGVyUHJvcHMge1xuICBub2RlczogQXJ0ZXJ5Tm9kZVtdO1xuICBjdHg6IENUWDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIENoaWxkcmVuUmVuZGVyKHsgbm9kZXMsIGN0eCB9OiBDaGlsZHJlblJlbmRlclByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGlmICghbm9kZXMubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICBSZWFjdC5GcmFnbWVudCxcbiAgICBudWxsLFxuICAgIG5vZGVzLm1hcCgobm9kZSkgPT4gUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IGtleTogbm9kZS5pZCwgbm9kZTogbm9kZSwgY3R4IH0pKSxcbiAgKTtcbn1cblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogQXJ0ZXJ5Tm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIE5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgcGFyZW50UGF0aCA9IHVzZUNvbnRleHQoUGF0aENvbnRleHQpO1xuICBjb25zdCBjdXJyZW50UGF0aCA9IGAke3BhcmVudFBhdGh9LyR7bm9kZS5pZH1gO1xuICBjb25zdCBzaG91bGRSZW5kZXIgPSB1c2VTaG91bGRSZW5kZXIobm9kZSwgY3R4KTtcblxuICBpZiAoIXNob3VsZFJlbmRlcikge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKG5vZGUudHlwZSA9PT0gJ3JvdXRlLW5vZGUnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJvdXRlTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdsb29wLWNvbnRhaW5lcicpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoTG9vcE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAnaHRtbC1lbGVtZW50Jykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgUGF0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50UGF0aCB9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChIVE1MTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdyZWFjdC1jb21wb25lbnQnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBQYXRoQ29udGV4dC5Qcm92aWRlcixcbiAgICAgIHsgdmFsdWU6IGN1cnJlbnRQYXRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdyZWYtbm9kZScpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoUmVmTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdqc3gtbm9kZScpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIFBhdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudFBhdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSlNYTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGxvZ2dlci5lcnJvcignVW5yZWNvZ25pemVkIG5vZGUgdHlwZSBvZiBub2RlOicsIG5vZGUpO1xuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVJlbmRlcjtcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgdHlwZSB7IEFydGVyeSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuaW1wb3J0IHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgUGx1Z2lucyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCBib290VXAsIHsgQm9vdFJlc3VsdCB9IGZyb20gJy4vaW5kZXgnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VCb290UmVzdWx0KGFydGVyeTogQXJ0ZXJ5LCBwbHVnaW5zPzogUGx1Z2lucyk6IEJvb3RSZXN1bHQgfCB1bmRlZmluZWQge1xuICBjb25zdCBbcmVzdWx0LCBzZXRSZXN1bHRdID0gdXNlU3RhdGU8Qm9vdFJlc3VsdD4oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCB1bk1vdW50aW5nID0gZmFsc2U7XG5cbiAgICBib290VXAoeyBhcnRlcnksIHBsdWdpbnMgfSlcbiAgICAgIC50aGVuKChib290UmVzdWx0KSA9PiB7XG4gICAgICAgIGlmICghdW5Nb3VudGluZykge1xuICAgICAgICAgIHNldFJlc3VsdChib290UmVzdWx0KTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC5jYXRjaChsb2dnZXIuZXJyb3IpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHVuTW91bnRpbmcgPSB0cnVlO1xuICAgIH07XG4gIH0sIFthcnRlcnldKTtcblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlSW1wZXJhdGl2ZUhhbmRsZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgQXJ0ZXJ5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vbm9kZS1yZW5kZXInO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5zLCBBcnRlcnlSZW5kZXJlckNUWCB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHVzZUJvb3RSZXN1bHQgZnJvbSAnLi9ib290LXVwL3VzZS1ib290LXVwLXJlc3VsdCc7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGFydGVyeTogQXJ0ZXJ5O1xuICBwbHVnaW5zPzogUGx1Z2lucztcbn1cblxuZnVuY3Rpb24gU2NoZW1hUmVuZGVyKFxuICB7IGFydGVyeSwgcGx1Z2lucyB9OiBQcm9wcyxcbiAgcmVmOiBSZWFjdC5SZWY8QXJ0ZXJ5UmVuZGVyZXJDVFggfCB1bmRlZmluZWQ+LFxuKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHsgY3R4LCByb290Tm9kZSB9ID0gdXNlQm9vdFJlc3VsdChhcnRlcnksIHBsdWdpbnMpIHx8IHt9O1xuXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUoXG4gICAgcmVmLFxuICAgICgpID0+IHtcbiAgICAgIGlmICghY3R4KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHsgYXBpU3RhdGVzOiBjdHguYXBpU3RhdGVzLCBzdGF0ZXM6IGN0eC5zdGF0ZXMsIGhpc3Rvcnk6IGN0eC5oaXN0b3J5IH07XG4gICAgfSxcbiAgICBbY3R4XSxcbiAgKTtcblxuICBpZiAoIWN0eCB8fCAhcm9vdE5vZGUpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogcm9vdE5vZGUsIGN0eDogY3R4IH0pO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5mb3J3YXJkUmVmPEFydGVyeVJlbmRlcmVyQ1RYIHwgdW5kZWZpbmVkLCBQcm9wcz4oU2NoZW1hUmVuZGVyKTtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCB0eXBlIHsgQXJ0ZXJ5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vbm9kZS1yZW5kZXInO1xuaW1wb3J0IGJvb3RVcCBmcm9tICcuL2Jvb3QtdXAnO1xuaW1wb3J0IHR5cGUgeyBQbHVnaW5zIH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlbmRlckFydGVyeSB7XG4gIHByaXZhdGUgYXJ0ZXJ5OiBBcnRlcnk7XG4gIHByaXZhdGUgcGx1Z2luczogUGx1Z2lucztcblxuICBwdWJsaWMgY29uc3RydWN0b3IoYXJ0ZXJ5OiBBcnRlcnksIHBsdWdpbnM/OiBQbHVnaW5zKSB7XG4gICAgdGhpcy5hcnRlcnkgPSBhcnRlcnk7XG4gICAgdGhpcy5wbHVnaW5zID0gcGx1Z2lucyB8fCB7fTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZW5kZXIocmVuZGVyUm9vdDogRWxlbWVudCk6IFByb21pc2U8dm9pZD4ge1xuICAgIGNvbnN0IHsgY3R4LCByb290Tm9kZSB9ID0gYXdhaXQgYm9vdFVwKHtcbiAgICAgIHBsdWdpbnM6IHRoaXMucGx1Z2lucyxcbiAgICAgIGFydGVyeTogdGhpcy5hcnRlcnksXG4gICAgfSk7XG5cbiAgICBSZWFjdERPTS5yZW5kZXIoUmVhY3QuY3JlYXRlRWxlbWVudChOb2RlUmVuZGVyLCB7IG5vZGU6IHJvb3ROb2RlLCBjdHggfSksIHJlbmRlclJvb3QpO1xuICB9XG59XG4iLCJpbXBvcnQgQXJ0ZXJ5UmVuZGVyZXIgZnJvbSAnLi9hcnRlcnktcmVuZGVyZXInO1xuaW1wb3J0IFJlbmRlckFydGVyeSBmcm9tICcuL3JlbmRlci1hcnRlcnknO1xuXG4vLyB0b2RvIGZpeCB0aGlzXG5leHBvcnQgeyBkZWZhdWx0IGFzIHVzZU5vZGVDb21wb25lbnQgfSBmcm9tICcuL25vZGUtcmVuZGVyL2hvb2tzL3VzZS1ub2RlLWNvbXBvbmVudCc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIHVzZUluc3RhbnRpYXRlUHJvcHMgfSBmcm9tICcuL3VzZS1pbnN0YW50aWF0ZS1wcm9wcyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIGJvb3RVcH0gZnJvbSAnLi9ib290LXVwJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgdXNlQm9vdFJlc3VsdCB9IGZyb20gJy4vYm9vdC11cC91c2UtYm9vdC11cC1yZXN1bHQnO1xuXG5leHBvcnQgKiBmcm9tICcuL3R5cGVzJztcbmV4cG9ydCB7IFJlbmRlckFydGVyeSwgQXJ0ZXJ5UmVuZGVyZXIgfTtcbmV4cG9ydCBkZWZhdWx0IFJlbmRlckFydGVyeTtcbiJdLCJuYW1lcyI6WyJfX3NwcmVhZFByb3BzIiwiaW5zdGFudGlhdGUiLCJtYXAiLCJzaGFyZSIsImdldFJlc3BvbnNlU3RhdGUkIiwiSHViIiwiaW5pdEFQSVN0YXRlIiwiU3RhdGVzSHViQVBJIiwiZGVzZXJpYWxpemUiLCJpbml0aWFsaXplTGF6eVN0YXRlcyIsIlN0YXRlc0h1YlNoYXJlZCIsIk5vZGVQcm9wc0NhY2hlIiwiZ2V0QVBJU3RhdGVzIiwiZ2V0U2hhcmVkU3RhdGVzIiwic2tpcCIsIlBhdGhDb250ZXh0IiwiTm9kZVJlbmRlciIsInVzZUFQSVJlc3VsdFByb3BzIiwidXNlQVBJTG9hZGluZ1Byb3BzIiwidXNlU2hhcmVkU3RhdGVQcm9wcyIsInVzZUludGVybmFsSG9va1Byb3BzIiwidXNlSW5oZXJpdGVkUHJvcHMiLCJ1c2VTaGFyZWRTdGF0ZU11dGF0aW9uUHJvcHMiLCJ1c2VSZW5kZXJQcm9wcyIsInVzZUxpbmtQcm9wcyIsImJvb3RVcCIsInVzZUluc3RhbnRpYXRlUHJvcHMiLCJMb29wSW5kaXZpZHVhbCIsIkxvb3BDb21wb3NlZCIsInJlYWN0IiwiUm91dGVQYXRoQ29udGV4dCIsInVzZU1hdGNoIiwiUm91dGVOb2RlUmVuZGVyIiwiTG9vcE5vZGVSZW5kZXIiLCJIVE1MTm9kZVJlbmRlciIsIlJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlciIsIkpTWE5vZGVSZW5kZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BRUEsTUFBTSxjQUFjLE1BQU0sY0FBc0IsTUFBTTtNQUV0RCxJQUFPLHVCQUFROzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUNBZixzQkFBc0IsY0FBeUU7TUFDN0YsUUFBTSxVQUE0RDtNQUFBLElBQ2hFLEtBQUssQ0FBQyxRQUE0QyxNQUFpQztNQUNqRixZQUFNLFdBQVcsYUFBYSxVQUFVLENBQUMsRUFBRTtNQUUzQyxhQUFPQSxxQ0FDRixXQURFO01BQUEsUUFFTCxTQUFTLE1BQU0sYUFBYSxRQUFRLENBQUM7TUFBQSxRQUNyQyxPQUFPLENBQUMsYUFBMEIsYUFBc0M7TUFDdEUsdUJBQWEsTUFBTSxHQUFHLEVBQUUsUUFBUSxhQUFhLFVBQVU7TUFBQTtNQUN6RCxRQUNBLFVBQVUsQ0FBQyxnQkFBZ0MsYUFBa0Q7TUFDM0YsdUJBQWEsU0FBUyxHQUFHLGNBQWM7TUFBQTtNQUN6QztNQUNGO01BQ0Y7TUFHRixTQUFPLElBQUksTUFBbUQsSUFBSSxPQUFPO01BQzNFO01BRUEsSUFBTyxxQkFBUTs7TUNyQlIsa0JBQWtCLEdBQXFCO01BQzVDLFNBQU8sT0FBTyxVQUFVLFNBQVMsS0FBSyxDQUFDLE1BQU07TUFDL0M7TUFFTyxvQkFBb0Is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
