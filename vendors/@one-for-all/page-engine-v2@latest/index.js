System.register(['react', 'react-dom', 'rxjs', '@one-for-all/render-engine'], (function (exports) {
  'use strict';
  var useState, useEffect, createContext, useMemo, useContext, useCallback, React, Fragment, useRef, ReactDOM, BehaviorSubject, RenderEngine;
  return {
    setters: [function (module) {
      useState = module.useState;
      useEffect = module.useEffect;
      createContext = module.createContext;
      useMemo = module.useMemo;
      useContext = module.useContext;
      useCallback = module.useCallback;
      React = module["default"];
      Fragment = module.Fragment;
      useRef = module.useRef;
    }, function (module) {
      ReactDOM = module["default"];
    }, function (module) {
      BehaviorSubject = module.BehaviorSubject;
    }, function (module) {
      RenderEngine = module["default"];
    }],
    execute: (function () {

      exports({
        RenderSchema: RenderSchema,
        getNodeParentPathFromSchemaByNodeId: getNodeParentPathFromSchemaByNodeId,
        loadComponentsFromSchema: loadComponentsFromSchema,
        loadPackage: loadPackage,
        removeAllNodeFromSchema: removeAllNodeFromSchema,
        removeNodeFromSchemaByNodeId: removeNodeFromSchemaByNodeId,
        schemaNodeWithChildren: schemaNodeWithChildren,
        schemaNodeWithNode: schemaNodeWithNode,
        traverseSchema: traverseSchema,
        useCanvasCommand: useCanvasCommand,
        useCommand: useCommand
      });

      function useObservable(observable, initialValue) {
        const [value, setValue] = useState(initialValue);
        useEffect(() => {
          if (observable) {
            const subscription = observable.subscribe(setValue);
            return () => subscription.unsubscribe();
          }
        }, [observable]);
        return value != null ? value : initialValue;
      }

      function useLayers(store$) {
        return useObservable(store$, []);
      }

      function useSchema(store$, defaultSchema) {
        return useObservable(store$, defaultSchema);
      }

      function create$2(schema) {
        return new BehaviorSubject(schema);
      }
      function set$1(store$, schema) {
        store$ == null ? void 0 : store$.next(schema);
      }

      var __defProp$3 = Object.defineProperty;
      var __getOwnPropSymbols$3 = Object.getOwnPropertySymbols;
      var __hasOwnProp$3 = Object.prototype.hasOwnProperty;
      var __propIsEnum$3 = Object.prototype.propertyIsEnumerable;
      var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
      var __spreadValues$3 = (a, b) => {
        for (var prop in b || (b = {}))
          if (__hasOwnProp$3.call(b, prop))
            __defNormalProp$3(a, prop, b[prop]);
        if (__getOwnPropSymbols$3)
          for (var prop of __getOwnPropSymbols$3(b)) {
            if (__propIsEnum$3.call(b, prop))
              __defNormalProp$3(a, prop, b[prop]);
          }
        return a;
      };
      function buildContextGetter() {
        const contextMap = {};
        return (instanceId) => {
          const context = contextMap[instanceId];
          if (context) {
            return context;
          }
          const Context2 = createContext(create$1({}));
          contextMap[instanceId] = Context2;
          return Context2;
        };
      }
      function create$1(stateValue) {
        return new BehaviorSubject(stateValue);
      }
      function update(store$, engineState) {
        store$.next(__spreadValues$3(__spreadValues$3({}, store$.value), engineState));
      }
      const getContext = buildContextGetter();

      function Block(props) {
        const { gridColumnStart, gridColumnEnd, gridRowStart, gridRowEnd, render: Render, engineId, setLayer } = props;
        const EngineStoreContext = useMemo(() => getContext(engineId), [engineId]);
        const engineStore$ = useContext(EngineStoreContext);
        const { schemaStore$, blocksCommunicationState$ } = useObservable(engineStore$, {
          schemaStore$: engineStore$.value.schemaStore$
        });
        const schema = useObservable(schemaStore$, void 0);
        const style = {
          gridColumnStart,
          gridColumnEnd,
          gridRowStart,
          gridRowEnd
        };
        const handleSchemaChange = useCallback((schema2) => {
          set$1(schemaStore$, schema2);
        }, [schemaStore$, schema]);
        if (!schema || !blocksCommunicationState$) {
          return null;
        }
        return /* @__PURE__ */ React.createElement("div", {
          className: "page-engine-layer-block",
          style
        }, /* @__PURE__ */ React.createElement(Render, {
          schema,
          onChange: handleSchemaChange,
          blocksCommunicationState$,
          engineId,
          setLayer
        }));
      }

      function styleInject(css, ref) {
        if ( ref === void 0 ) ref = {};
        var insertAt = ref.insertAt;

        if (!css || typeof document === 'undefined') { return; }

        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');
        style.type = 'text/css';

        if (insertAt === 'top') {
          if (head.firstChild) {
            head.insertBefore(style, head.firstChild);
          } else {
            head.appendChild(style);
          }
        } else {
          head.appendChild(style);
        }

        if (style.styleSheet) {
          style.styleSheet.cssText = css;
        } else {
          style.appendChild(document.createTextNode(css));
        }
      }

      var css_248z$1 = ".page-engine-layer {\n  position: fixed;\n  left: 20px;\n  right: 20px;\n  bottom: 20px;\n  top: 20px;\n  box-shadow: 0 0 1000px 1px blue;\n  border-radius: 5px;\n  overflow: hidden;\n}";
      styleInject(css_248z$1);

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
      function Layer(props) {
        const { blocks, gridTemplateColumns, gridTemplateRows, zIndex, engineId, blocksCommunicationStateInitialValue, setLayer } = props;
        const EngineStoreContext = useMemo(() => getContext(engineId), [engineId]);
        const engineStore$ = useContext(EngineStoreContext);
        const blocksCommunicationState$ = useMemo(() => new BehaviorSubject(blocksCommunicationStateInitialValue), [blocksCommunicationStateInitialValue]);
        useEffect(() => {
          update(engineStore$, { blocksCommunicationState$ });
        }, [blocksCommunicationState$]);
        const pageEngineLayerStyle = {
          display: "grid",
          gap: "1px",
          gridTemplateColumns,
          gridTemplateRows,
          zIndex
        };
        return /* @__PURE__ */ React.createElement("div", {
          className: "page-engine-layer",
          style: pageEngineLayerStyle
        }, blocks.filter(({ visible }) => visible !== false).map((block, index) => /* @__PURE__ */ React.createElement(Block, __spreadProps$2(__spreadValues$2({}, block), {
          key: index,
          engineId,
          setLayer
        }))));
      }

      function _isPlaceholder(a) {
        return a != null && typeof a === 'object' && a['@@functional/placeholder'] === true;
      }

      /**
       * Optimized internal one-arity curry function.
       *
       * @private
       * @category Function
       * @param {Function} fn The function to curry.
       * @return {Function} The curried function.
       */

      function _curry1(fn) {
        return function f1(a) {
          if (arguments.length === 0 || _isPlaceholder(a)) {
            return f1;
          } else {
            return fn.apply(this, arguments);
          }
        };
      }

      /**
       * Optimized internal two-arity curry function.
       *
       * @private
       * @category Function
       * @param {Function} fn The function to curry.
       * @return {Function} The curried function.
       */

      function _curry2(fn) {
        return function f2(a, b) {
          switch (arguments.length) {
            case 0:
              return f2;

            case 1:
              return _isPlaceholder(a) ? f2 : _curry1(function (_b) {
                return fn(a, _b);
              });

            default:
              return _isPlaceholder(a) && _isPlaceholder(b) ? f2 : _isPlaceholder(a) ? _curry1(function (_a) {
                return fn(_a, b);
              }) : _isPlaceholder(b) ? _curry1(function (_b) {
                return fn(a, _b);
              }) : fn(a, b);
          }
        };
      }

      function _arity(n, fn) {
        /* eslint-disable no-unused-vars */
        switch (n) {
          case 0:
            return function () {
              return fn.apply(this, arguments);
            };

          case 1:
            return function (a0) {
              return fn.apply(this, arguments);
            };

          case 2:
            return function (a0, a1) {
              return fn.apply(this, arguments);
            };

          case 3:
            return function (a0, a1, a2) {
              return fn.apply(this, arguments);
            };

          case 4:
            return function (a0, a1, a2, a3) {
              return fn.apply(this, arguments);
            };

          case 5:
            return function (a0, a1, a2, a3, a4) {
              return fn.apply(this, arguments);
            };

          case 6:
            return function (a0, a1, a2, a3, a4, a5) {
              return fn.apply(this, arguments);
            };

          case 7:
            return function (a0, a1, a2, a3, a4, a5, a6) {
              return fn.apply(this, arguments);
            };

          case 8:
            return function (a0, a1, a2, a3, a4, a5, a6, a7) {
              return fn.apply(this, arguments);
            };

          case 9:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
              return fn.apply(this, arguments);
            };

          case 10:
            return function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9) {
              return fn.apply(this, arguments);
            };

          default:
            throw new Error('First argument to _arity must be a non-negative integer no greater than ten');
        }
      }

      /**
       * Internal curryN function.
       *
       * @private
       * @category Function
       * @param {Number} length The arity of the curried function.
       * @param {Array} received An array of arguments received thus far.
       * @param {Function} fn The function to curry.
       * @return {Function} The curried function.
       */

      function _curryN(length, received, fn) {
        return function () {
          var combined = [];
          var argsIdx = 0;
          var left = length;
          var combinedIdx = 0;

          while (combinedIdx < received.length || argsIdx < arguments.length) {
            var result;

            if (combinedIdx < received.length && (!_isPlaceholder(received[combinedIdx]) || argsIdx >= arguments.length)) {
              result = received[combinedIdx];
            } else {
              result = arguments[argsIdx];
              argsIdx += 1;
            }

            combined[combinedIdx] = result;

            if (!_isPlaceholder(result)) {
              left -= 1;
            }

            combinedIdx += 1;
          }

          return left <= 0 ? fn.apply(this, combined) : _arity(left, _curryN(length, combined, fn));
        };
      }

      /**
       * Returns a curried equivalent of the provided function, with the specified
       * arity. The curried function has two unusual capabilities. First, its
       * arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the
       * following are equivalent:
       *
       *   - `g(1)(2)(3)`
       *   - `g(1)(2, 3)`
       *   - `g(1, 2)(3)`
       *   - `g(1, 2, 3)`
       *
       * Secondly, the special placeholder value [`R.__`](#__) may be used to specify
       * "gaps", allowing partial application of any combination of arguments,
       * regardless of their positions. If `g` is as above and `_` is [`R.__`](#__),
       * the following are equivalent:
       *
       *   - `g(1, 2, 3)`
       *   - `g(_, 2, 3)(1)`
       *   - `g(_, _, 3)(1)(2)`
       *   - `g(_, _, 3)(1, 2)`
       *   - `g(_, 2)(1)(3)`
       *   - `g(_, 2)(1, 3)`
       *   - `g(_, 2)(_, 3)(1)`
       *
       * @func
       * @memberOf R
       * @since v0.5.0
       * @category Function
       * @sig Number -> (* -> a) -> (* -> a)
       * @param {Number} length The arity for the returned function.
       * @param {Function} fn The function to curry.
       * @return {Function} A new, curried function.
       * @see R.curry
       * @example
       *
       *      const sumArgs = (...args) => R.sum(args);
       *
       *      const curriedAddFourNumbers = R.curryN(4, sumArgs);
       *      const f = curriedAddFourNumbers(1, 2);
       *      const g = f(3);
       *      g(4); //=> 10
       */

      var curryN =
      /*#__PURE__*/
      _curry2(function curryN(length, fn) {
        if (length === 1) {
          return _curry1(fn);
        }

        return _arity(length, _curryN(length, [], fn));
      });

      var curryN$1 = curryN;

      /**
       * Optimized internal three-arity curry function.
       *
       * @private
       * @category Function
       * @param {Function} fn The function to curry.
       * @return {Function} The curried function.
       */

      function _curry3(fn) {
        return function f3(a, b, c) {
          switch (arguments.length) {
            case 0:
              return f3;

            case 1:
              return _isPlaceholder(a) ? f3 : _curry2(function (_b, _c) {
                return fn(a, _b, _c);
              });

            case 2:
              return _isPlaceholder(a) && _isPlaceholder(b) ? f3 : _isPlaceholder(a) ? _curry2(function (_a, _c) {
                return fn(_a, b, _c);
              }) : _isPlaceholder(b) ? _curry2(function (_b, _c) {
                return fn(a, _b, _c);
              }) : _curry1(function (_c) {
                return fn(a, b, _c);
              });

            default:
              return _isPlaceholder(a) && _isPlaceholder(b) && _isPlaceholder(c) ? f3 : _isPlaceholder(a) && _isPlaceholder(b) ? _curry2(function (_a, _b) {
                return fn(_a, _b, c);
              }) : _isPlaceholder(a) && _isPlaceholder(c) ? _curry2(function (_a, _c) {
                return fn(_a, b, _c);
              }) : _isPlaceholder(b) && _isPlaceholder(c) ? _curry2(function (_b, _c) {
                return fn(a, _b, _c);
              }) : _isPlaceholder(a) ? _curry1(function (_a) {
                return fn(_a, b, c);
              }) : _isPlaceholder(b) ? _curry1(function (_b) {
                return fn(a, _b, c);
              }) : _isPlaceholder(c) ? _curry1(function (_c) {
                return fn(a, b, _c);
              }) : fn(a, b, c);
          }
        };
      }

      /**
       * Tests whether or not an object is an array.
       *
       * @private
       * @param {*} val The object to test.
       * @return {Boolean} `true` if `val` is an array, `false` otherwise.
       * @example
       *
       *      _isArray([]); //=> true
       *      _isArray(null); //=> false
       *      _isArray({}); //=> false
       */
      var _isArray = Array.isArray || function _isArray(val) {
        return val != null && val.length >= 0 && Object.prototype.toString.call(val) === '[object Array]';
      };

      function _isTransformer(obj) {
        return obj != null && typeof obj['@@transducer/step'] === 'function';
      }

      /**
       * Returns a function that dispatches with different strategies based on the
       * object in list position (last argument). If it is an array, executes [fn].
       * Otherwise, if it has a function with one of the given method names, it will
       * execute that function (functor case). Otherwise, if it is a transformer,
       * uses transducer [xf] to return a new transformer (transducer case).
       * Otherwise, it will default to executing [fn].
       *
       * @private
       * @param {Array} methodNames properties to check for a custom implementation
       * @param {Function} xf transducer to initialize if object is transformer
       * @param {Function} fn default ramda implementation
       * @return {Function} A function that dispatches on object in list position
       */

      function _dispatchable(methodNames, xf, fn) {
        return function () {
          if (arguments.length === 0) {
            return fn();
          }

          var args = Array.prototype.slice.call(arguments, 0);
          var obj = args.pop();

          if (!_isArray(obj)) {
            var idx = 0;

            while (idx < methodNames.length) {
              if (typeof obj[methodNames[idx]] === 'function') {
                return obj[methodNames[idx]].apply(obj, args);
              }

              idx += 1;
            }

            if (_isTransformer(obj)) {
              var transducer = xf.apply(null, args);
              return transducer(obj);
            }
          }

          return fn.apply(this, arguments);
        };
      }

      var _xfBase = {
        init: function () {
          return this.xf['@@transducer/init']();
        },
        result: function (result) {
          return this.xf['@@transducer/result'](result);
        }
      };

      function _map(fn, functor) {
        var idx = 0;
        var len = functor.length;
        var result = Array(len);

        while (idx < len) {
          result[idx] = fn(functor[idx]);
          idx += 1;
        }

        return result;
      }

      function _isString(x) {
        return Object.prototype.toString.call(x) === '[object String]';
      }

      /**
       * Tests whether or not an object is similar to an array.
       *
       * @private
       * @category Type
       * @category List
       * @sig * -> Boolean
       * @param {*} x The object to test.
       * @return {Boolean} `true` if `x` has a numeric length property and extreme indices defined; `false` otherwise.
       * @example
       *
       *      _isArrayLike([]); //=> true
       *      _isArrayLike(true); //=> false
       *      _isArrayLike({}); //=> false
       *      _isArrayLike({length: 10}); //=> false
       *      _isArrayLike({0: 'zero', 9: 'nine', length: 10}); //=> true
       */

      var _isArrayLike =
      /*#__PURE__*/
      _curry1(function isArrayLike(x) {
        if (_isArray(x)) {
          return true;
        }

        if (!x) {
          return false;
        }

        if (typeof x !== 'object') {
          return false;
        }

        if (_isString(x)) {
          return false;
        }

        if (x.nodeType === 1) {
          return !!x.length;
        }

        if (x.length === 0) {
          return true;
        }

        if (x.length > 0) {
          return x.hasOwnProperty(0) && x.hasOwnProperty(x.length - 1);
        }

        return false;
      });

      var _isArrayLike$1 = _isArrayLike;

      var XWrap =
      /*#__PURE__*/
      function () {
        function XWrap(fn) {
          this.f = fn;
        }

        XWrap.prototype['@@transducer/init'] = function () {
          throw new Error('init not implemented on XWrap');
        };

        XWrap.prototype['@@transducer/result'] = function (acc) {
          return acc;
        };

        XWrap.prototype['@@transducer/step'] = function (acc, x) {
          return this.f(acc, x);
        };

        return XWrap;
      }();

      function _xwrap(fn) {
        return new XWrap(fn);
      }

      /**
       * Creates a function that is bound to a context.
       * Note: `R.bind` does not provide the additional argument-binding capabilities of
       * [Function.prototype.bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
       *
       * @func
       * @memberOf R
       * @since v0.6.0
       * @category Function
       * @category Object
       * @sig (* -> *) -> {*} -> (* -> *)
       * @param {Function} fn The function to bind to context
       * @param {Object} thisObj The context to bind `fn` to
       * @return {Function} A function that will execute in the context of `thisObj`.
       * @see R.partial
       * @example
       *
       *      const log = R.bind(console.log, console);
       *      R.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}
       *      // logs {a: 2}
       * @symb R.bind(f, o)(a, b) = f.call(o, a, b)
       */

      var bind =
      /*#__PURE__*/
      _curry2(function bind(fn, thisObj) {
        return _arity(fn.length, function () {
          return fn.apply(thisObj, arguments);
        });
      });

      var bind$1 = bind;

      function _arrayReduce(xf, acc, list) {
        var idx = 0;
        var len = list.length;

        while (idx < len) {
          acc = xf['@@transducer/step'](acc, list[idx]);

          if (acc && acc['@@transducer/reduced']) {
            acc = acc['@@transducer/value'];
            break;
          }

          idx += 1;
        }

        return xf['@@transducer/result'](acc);
      }

      function _iterableReduce(xf, acc, iter) {
        var step = iter.next();

        while (!step.done) {
          acc = xf['@@transducer/step'](acc, step.value);

          if (acc && acc['@@transducer/reduced']) {
            acc = acc['@@transducer/value'];
            break;
          }

          step = iter.next();
        }

        return xf['@@transducer/result'](acc);
      }

      function _methodReduce(xf, acc, obj, methodName) {
        return xf['@@transducer/result'](obj[methodName](bind$1(xf['@@transducer/step'], xf), acc));
      }

      var symIterator = typeof Symbol !== 'undefined' ? Symbol.iterator : '@@iterator';
      function _reduce(fn, acc, list) {
        if (typeof fn === 'function') {
          fn = _xwrap(fn);
        }

        if (_isArrayLike$1(list)) {
          return _arrayReduce(fn, acc, list);
        }

        if (typeof list['fantasy-land/reduce'] === 'function') {
          return _methodReduce(fn, acc, list, 'fantasy-land/reduce');
        }

        if (list[symIterator] != null) {
          return _iterableReduce(fn, acc, list[symIterator]());
        }

        if (typeof list.next === 'function') {
          return _iterableReduce(fn, acc, list);
        }

        if (typeof list.reduce === 'function') {
          return _methodReduce(fn, acc, list, 'reduce');
        }

        throw new TypeError('reduce: list must be array or iterable');
      }

      var XMap =
      /*#__PURE__*/
      function () {
        function XMap(f, xf) {
          this.xf = xf;
          this.f = f;
        }

        XMap.prototype['@@transducer/init'] = _xfBase.init;
        XMap.prototype['@@transducer/result'] = _xfBase.result;

        XMap.prototype['@@transducer/step'] = function (result, input) {
          return this.xf['@@transducer/step'](result, this.f(input));
        };

        return XMap;
      }();

      var _xmap =
      /*#__PURE__*/
      _curry2(function _xmap(f, xf) {
        return new XMap(f, xf);
      });

      var _xmap$1 = _xmap;

      function _has(prop, obj) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
      }

      var toString = Object.prototype.toString;

      var _isArguments =
      /*#__PURE__*/
      function () {
        return toString.call(arguments) === '[object Arguments]' ? function _isArguments(x) {
          return toString.call(x) === '[object Arguments]';
        } : function _isArguments(x) {
          return _has('callee', x);
        };
      }();

      var _isArguments$1 = _isArguments;

      var hasEnumBug = !
      /*#__PURE__*/
      {
        toString: null
      }.propertyIsEnumerable('toString');
      var nonEnumerableProps = ['constructor', 'valueOf', 'isPrototypeOf', 'toString', 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString']; // Safari bug

      var hasArgsEnumBug =
      /*#__PURE__*/
      function () {

        return arguments.propertyIsEnumerable('length');
      }();

      var contains = function contains(list, item) {
        var idx = 0;

        while (idx < list.length) {
          if (list[idx] === item) {
            return true;
          }

          idx += 1;
        }

        return false;
      };
      /**
       * Returns a list containing the names of all the enumerable own properties of
       * the supplied object.
       * Note that the order of the output array is not guaranteed to be consistent
       * across different JS platforms.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category Object
       * @sig {k: v} -> [k]
       * @param {Object} obj The object to extract properties from
       * @return {Array} An array of the object's own properties.
       * @see R.keysIn, R.values
       * @example
       *
       *      R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']
       */


      var keys = typeof Object.keys === 'function' && !hasArgsEnumBug ?
      /*#__PURE__*/
      _curry1(function keys(obj) {
        return Object(obj) !== obj ? [] : Object.keys(obj);
      }) :
      /*#__PURE__*/
      _curry1(function keys(obj) {
        if (Object(obj) !== obj) {
          return [];
        }

        var prop, nIdx;
        var ks = [];

        var checkArgsLength = hasArgsEnumBug && _isArguments$1(obj);

        for (prop in obj) {
          if (_has(prop, obj) && (!checkArgsLength || prop !== 'length')) {
            ks[ks.length] = prop;
          }
        }

        if (hasEnumBug) {
          nIdx = nonEnumerableProps.length - 1;

          while (nIdx >= 0) {
            prop = nonEnumerableProps[nIdx];

            if (_has(prop, obj) && !contains(ks, prop)) {
              ks[ks.length] = prop;
            }

            nIdx -= 1;
          }
        }

        return ks;
      });
      var keys$1 = keys;

      /**
       * Takes a function and
       * a [functor](https://github.com/fantasyland/fantasy-land#functor),
       * applies the function to each of the functor's values, and returns
       * a functor of the same shape.
       *
       * Ramda provides suitable `map` implementations for `Array` and `Object`,
       * so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`.
       *
       * Dispatches to the `map` method of the second argument, if present.
       *
       * Acts as a transducer if a transformer is given in list position.
       *
       * Also treats functions as functors and will compose them together.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category List
       * @sig Functor f => (a -> b) -> f a -> f b
       * @param {Function} fn The function to be called on every element of the input `list`.
       * @param {Array} list The list to be iterated over.
       * @return {Array} The new list.
       * @see R.transduce, R.addIndex
       * @example
       *
       *      const double = x => x * 2;
       *
       *      R.map(double, [1, 2, 3]); //=> [2, 4, 6]
       *
       *      R.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}
       * @symb R.map(f, [a, b]) = [f(a), f(b)]
       * @symb R.map(f, { x: a, y: b }) = { x: f(a), y: f(b) }
       * @symb R.map(f, functor_o) = functor_o.map(f)
       */

      var map =
      /*#__PURE__*/
      _curry2(
      /*#__PURE__*/
      _dispatchable(['fantasy-land/map', 'map'], _xmap$1, function map(fn, functor) {
        switch (Object.prototype.toString.call(functor)) {
          case '[object Function]':
            return curryN$1(functor.length, function () {
              return fn.call(this, functor.apply(this, arguments));
            });

          case '[object Object]':
            return _reduce(function (acc, key) {
              acc[key] = fn(functor[key]);
              return acc;
            }, {}, keys$1(functor));

          default:
            return _map(fn, functor);
        }
      }));

      var map$1 = map;

      /**
       * Determine if the passed argument is an integer.
       *
       * @private
       * @param {*} n
       * @category Type
       * @return {Boolean}
       */
      var _isInteger = Number.isInteger || function _isInteger(n) {
        return n << 0 === n;
      };

      /**
       * Returns the nth element of the given list or string. If n is negative the
       * element at index length + n is returned.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category List
       * @sig Number -> [a] -> a | Undefined
       * @sig Number -> String -> String
       * @param {Number} offset
       * @param {*} list
       * @return {*}
       * @example
       *
       *      const list = ['foo', 'bar', 'baz', 'quux'];
       *      R.nth(1, list); //=> 'bar'
       *      R.nth(-1, list); //=> 'quux'
       *      R.nth(-99, list); //=> undefined
       *
       *      R.nth(2, 'abc'); //=> 'c'
       *      R.nth(3, 'abc'); //=> ''
       * @symb R.nth(-1, [a, b, c]) = c
       * @symb R.nth(0, [a, b, c]) = a
       * @symb R.nth(1, [a, b, c]) = b
       */

      var nth =
      /*#__PURE__*/
      _curry2(function nth(offset, list) {
        var idx = offset < 0 ? list.length + offset : offset;
        return _isString(list) ? list.charAt(idx) : list[idx];
      });

      var nth$1 = nth;

      /**
       * Retrieves the values at given paths of an object.
       *
       * @func
       * @memberOf R
       * @since v0.27.1
       * @category Object
       * @typedefn Idx = [String | Int]
       * @sig [Idx] -> {a} -> [a | Undefined]
       * @param {Array} pathsArray The array of paths to be fetched.
       * @param {Object} obj The object to retrieve the nested properties from.
       * @return {Array} A list consisting of values at paths specified by "pathsArray".
       * @see R.path
       * @example
       *
       *      R.paths([['a', 'b'], ['p', 0, 'q']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, 3]
       *      R.paths([['a', 'b'], ['p', 'r']], {a: {b: 2}, p: [{q: 3}]}); //=> [2, undefined]
       */

      var paths =
      /*#__PURE__*/
      _curry2(function paths(pathsArray, obj) {
        return pathsArray.map(function (paths) {
          var val = obj;
          var idx = 0;
          var p;

          while (idx < paths.length) {
            if (val == null) {
              return;
            }

            p = paths[idx];
            val = _isInteger(p) ? nth$1(p, val) : val[p];
            idx += 1;
          }

          return val;
        });
      });

      var paths$1 = paths;

      /**
       * Retrieve the value at a given path.
       *
       * @func
       * @memberOf R
       * @since v0.2.0
       * @category Object
       * @typedefn Idx = String | Int
       * @sig [Idx] -> {a} -> a | Undefined
       * @param {Array} path The path to use.
       * @param {Object} obj The object to retrieve the nested property from.
       * @return {*} The data at `path`.
       * @see R.prop, R.nth
       * @example
       *
       *      R.path(['a', 'b'], {a: {b: 2}}); //=> 2
       *      R.path(['a', 'b'], {c: {b: 2}}); //=> undefined
       *      R.path(['a', 'b', 0], {a: {b: [1, 2, 3]}}); //=> 1
       *      R.path(['a', 'b', -2], {a: {b: [1, 2, 3]}}); //=> 2
       */

      var path =
      /*#__PURE__*/
      _curry2(function path(pathAr, obj) {
        return paths$1([pathAr], obj)[0];
      });

      var path$1 = path;

      /**
       * Makes a shallow clone of an object, setting or overriding the specified
       * property with the given value. Note that this copies and flattens prototype
       * properties onto the new object as well. All non-primitive properties are
       * copied by reference.
       *
       * @func
       * @memberOf R
       * @since v0.8.0
       * @category Object
       * @sig String -> a -> {k: v} -> {k: v}
       * @param {String} prop The property name to set
       * @param {*} val The new value
       * @param {Object} obj The object to clone
       * @return {Object} A new object equivalent to the original except for the changed property.
       * @see R.dissoc, R.pick
       * @example
       *
       *      R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}
       */

      var assoc =
      /*#__PURE__*/
      _curry3(function assoc(prop, val, obj) {
        var result = {};

        for (var p in obj) {
          result[p] = obj[p];
        }

        result[prop] = val;
        return result;
      });

      var assoc$1 = assoc;

      /**
       * Checks if the input value is `null` or `undefined`.
       *
       * @func
       * @memberOf R
       * @since v0.9.0
       * @category Type
       * @sig * -> Boolean
       * @param {*} x The value to test.
       * @return {Boolean} `true` if `x` is `undefined` or `null`, otherwise `false`.
       * @example
       *
       *      R.isNil(null); //=> true
       *      R.isNil(undefined); //=> true
       *      R.isNil(0); //=> false
       *      R.isNil([]); //=> false
       */

      var isNil =
      /*#__PURE__*/
      _curry1(function isNil(x) {
        return x == null;
      });

      var isNil$1 = isNil;

      /**
       * Makes a shallow clone of an object, setting or overriding the nodes required
       * to create the given path, and placing the specific value at the tail end of
       * that path. Note that this copies and flattens prototype properties onto the
       * new object as well. All non-primitive properties are copied by reference.
       *
       * @func
       * @memberOf R
       * @since v0.8.0
       * @category Object
       * @typedefn Idx = String | Int
       * @sig [Idx] -> a -> {a} -> {a}
       * @param {Array} path the path to set
       * @param {*} val The new value
       * @param {Object} obj The object to clone
       * @return {Object} A new object equivalent to the original except along the specified path.
       * @see R.dissocPath
       * @example
       *
       *      R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}
       *
       *      // Any missing or non-object keys in path will be overridden
       *      R.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}
       */

      var assocPath =
      /*#__PURE__*/
      _curry3(function assocPath(path, val, obj) {
        if (path.length === 0) {
          return val;
        }

        var idx = path[0];

        if (path.length > 1) {
          var nextObj = !isNil$1(obj) && _has(idx, obj) ? obj[idx] : _isInteger(path[1]) ? [] : {};
          val = assocPath(Array.prototype.slice.call(path, 1), val, nextObj);
        }

        if (_isInteger(idx) && _isArray(obj)) {
          var arr = [].concat(obj);
          arr[idx] = val;
          return arr;
        } else {
          return assoc$1(idx, val, obj);
        }
      });

      var assocPath$1 = assocPath;

      function _cloneRegExp(pattern) {
        return new RegExp(pattern.source, (pattern.global ? 'g' : '') + (pattern.ignoreCase ? 'i' : '') + (pattern.multiline ? 'm' : '') + (pattern.sticky ? 'y' : '') + (pattern.unicode ? 'u' : ''));
      }

      /**
       * Gives a single-word string description of the (native) type of a value,
       * returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not
       * attempt to distinguish user Object types any further, reporting them all as
       * 'Object'.
       *
       * @func
       * @memberOf R
       * @since v0.8.0
       * @category Type
       * @sig (* -> {*}) -> String
       * @param {*} val The value to test
       * @return {String}
       * @example
       *
       *      R.type({}); //=> "Object"
       *      R.type(1); //=> "Number"
       *      R.type(false); //=> "Boolean"
       *      R.type('s'); //=> "String"
       *      R.type(null); //=> "Null"
       *      R.type([]); //=> "Array"
       *      R.type(/[A-z]/); //=> "RegExp"
       *      R.type(() => {}); //=> "Function"
       *      R.type(undefined); //=> "Undefined"
       */

      var type =
      /*#__PURE__*/
      _curry1(function type(val) {
        return val === null ? 'Null' : val === undefined ? 'Undefined' : Object.prototype.toString.call(val).slice(8, -1);
      });

      var type$1 = type;

      /**
       * Copies an object.
       *
       * @private
       * @param {*} value The value to be copied
       * @param {Array} refFrom Array containing the source references
       * @param {Array} refTo Array containing the copied source references
       * @param {Boolean} deep Whether or not to perform deep cloning.
       * @return {*} The copied value.
       */

      function _clone(value, refFrom, refTo, deep) {
        var copy = function copy(copiedValue) {
          var len = refFrom.length;
          var idx = 0;

          while (idx < len) {
            if (value === refFrom[idx]) {
              return refTo[idx];
            }

            idx += 1;
          }

          refFrom[idx + 1] = value;
          refTo[idx + 1] = copiedValue;

          for (var key in value) {
            copiedValue[key] = deep ? _clone(value[key], refFrom, refTo, true) : value[key];
          }

          return copiedValue;
        };

        switch (type$1(value)) {
          case 'Object':
            return copy({});

          case 'Array':
            return copy([]);

          case 'Date':
            return new Date(value.valueOf());

          case 'RegExp':
            return _cloneRegExp(value);

          default:
            return value;
        }
      }

      /**
       * Creates a deep copy of the value which may contain (nested) `Array`s and
       * `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are
       * assigned by reference rather than copied
       *
       * Dispatches to a `clone` method if present.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category Object
       * @sig {*} -> {*}
       * @param {*} value The object or array to clone
       * @return {*} A deeply cloned copy of `val`
       * @example
       *
       *      const objects = [{}, {}, {}];
       *      const objectsClone = R.clone(objects);
       *      objects === objectsClone; //=> false
       *      objects[0] === objectsClone[0]; //=> false
       */

      var clone =
      /*#__PURE__*/
      _curry1(function clone(value) {
        return value != null && typeof value.clone === 'function' ? value.clone() : _clone(value, [], [], true);
      });

      var clone$1 = clone;

      /**
       * Returns a lens for the given getter and setter functions. The getter "gets"
       * the value of the focus; the setter "sets" the value of the focus. The setter
       * should not mutate the data structure.
       *
       * @func
       * @memberOf R
       * @since v0.8.0
       * @category Object
       * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
       * @sig (s -> a) -> ((a, s) -> s) -> Lens s a
       * @param {Function} getter
       * @param {Function} setter
       * @return {Lens}
       * @see R.view, R.set, R.over, R.lensIndex, R.lensProp
       * @example
       *
       *      const xLens = R.lens(R.prop('x'), R.assoc('x'));
       *
       *      R.view(xLens, {x: 1, y: 2});            //=> 1
       *      R.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}
       *      R.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}
       */

      var lens =
      /*#__PURE__*/
      _curry2(function lens(getter, setter) {
        return function (toFunctorFn) {
          return function (target) {
            return map$1(function (focus) {
              return setter(focus, target);
            }, toFunctorFn(getter(target)));
          };
        };
      });

      var lens$1 = lens;

      /**
       * Returns a lens whose focus is the specified path.
       *
       * @func
       * @memberOf R
       * @since v0.19.0
       * @category Object
       * @typedefn Idx = String | Int
       * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
       * @sig [Idx] -> Lens s a
       * @param {Array} path The path to use.
       * @return {Lens}
       * @see R.view, R.set, R.over
       * @example
       *
       *      const xHeadYLens = R.lensPath(['x', 0, 'y']);
       *
       *      R.view(xHeadYLens, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
       *      //=> 2
       *      R.set(xHeadYLens, 1, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
       *      //=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}
       *      R.over(xHeadYLens, R.negate, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});
       *      //=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}
       */

      var lensPath =
      /*#__PURE__*/
      _curry1(function lensPath(p) {
        return lens$1(path$1(p), assocPath$1(p));
      });

      var lensPath$1 = lensPath;

      // transforms the held value with the provided function.

      var Identity = function (x) {
        return {
          value: x,
          map: function (f) {
            return Identity(f(x));
          }
        };
      };
      /**
       * Returns the result of "setting" the portion of the given data structure
       * focused by the given lens to the result of applying the given function to
       * the focused value.
       *
       * @func
       * @memberOf R
       * @since v0.16.0
       * @category Object
       * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
       * @sig Lens s a -> (a -> a) -> s -> s
       * @param {Lens} lens
       * @param {*} v
       * @param {*} x
       * @return {*}
       * @see R.prop, R.lensIndex, R.lensProp
       * @example
       *
       *      const headLens = R.lensIndex(0);
       *
       *      R.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']
       */


      var over =
      /*#__PURE__*/
      _curry3(function over(lens, f, x) {
        // The value returned by the getter function is first transformed with `f`,
        // then set as the value of an `Identity`. This is then mapped over with the
        // setter function of the lens.
        return lens(function (y) {
          return Identity(f(y));
        })(x).value;
      });

      var over$1 = over;

      function add(store$, layer) {
        store$.next([...store$.value, layer]);
      }
      function create(layers) {
        return new BehaviorSubject(layers != null ? layers : []);
      }
      function set(store$, layers) {
        store$.next(layers);
      }
      function registryLayers(store$, layers) {
        layers.forEach((layer) => add(store$, layer));
      }
      function setLayerByIndex(store$, layer, index) {
        set(store$, over$1(lensPath$1([index]), () => layer, store$.value));
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
      function Core({ layersStore$, engineId }) {
        const layers = useObservable(layersStore$, []);
        function getSetLayer(index) {
          return (transfer) => {
            setLayerByIndex(layersStore$, transfer(layers[index]), index);
          };
        }
        return /* @__PURE__ */ React.createElement(Fragment, null, layers.map((layer, index) => /* @__PURE__ */ React.createElement(Layer, __spreadProps$1(__spreadValues$1({}, layer), {
          key: index,
          zIndex: index,
          engineId,
          setLayer: getSetLayer(index)
        }))));
      }

      let random = bytes => crypto.getRandomValues(new Uint8Array(bytes));
      let customRandom = (alphabet, defaultSize, getRandom) => {
        let mask = (2 << (Math.log(alphabet.length - 1) / Math.LN2)) - 1;
        let step = -~((1.6 * mask * defaultSize) / alphabet.length);
        return (size = defaultSize) => {
          let id = '';
          while (true) {
            let bytes = getRandom(step);
            let j = step;
            while (j--) {
              id += alphabet[bytes[j] & mask] || '';
              if (id.length === size) return id
            }
          }
        }
      };
      let customAlphabet = (alphabet, size = 21) =>
        customRandom(alphabet, size, random);

      const uuid = exports('uuid', customAlphabet("1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM", 8));
      async function loadPackage({ packageName, packageVersion, exportName }, defaultValue) {
        try {
          const packagePath = packageVersion ? `${packageName}@${packageVersion}` : packageName;
          const component = await System.import(packagePath);
          return component[exportName];
        } catch (error) {
          return defaultValue;
        }
      }
      function RenderSchema({ schema, elementId }) {
        const renderEngine = new RenderEngine(schema);
        useEffect(() => {
          const el = document.getElementById(elementId);
          if (el) {
            renderEngine.render(el).catch(() => {
            });
          }
        }, []);
        return /* @__PURE__ */ React.createElement("div", {
          id: elementId,
          style: { display: "unset" }
        });
      }
      async function loadComponentsFromSchema(schema) {
        const nodes = [];
        traverseSchema(schema, (node) => nodes.push(node));
        const componentsInPromise = nodes.map(async (node) => {
          const id = `${node.id}`;
          if (node.type === "react-component") {
            const Render = await loadPackage(node, () => null);
            return { id, Render };
          }
          return false;
        }).filter(Boolean);
        return await Promise.all(componentsInPromise);
      }
      function traverseSchema(schema, callback, level = 0, parent, path) {
        var _a;
        const { node } = schema;
        callback(node, { level, parentNode: parent, path: path != null ? path : "node" });
        if (schemaNodeWithChildren(node)) {
          (_a = node.children) == null ? void 0 : _a.forEach((child, index) => {
            traverseSchema({ node: child }, callback, level + 1, node, `${path != null ? path : "node"}.children.${index}`);
          });
        }
        if (schemaNodeWithNode(node) && node.node.type !== "composed-node") {
          traverseSchema({ node: node.node }, callback, level + 1, node, `${path != null ? path : "node"}.node`);
        }
      }
      function getNodeParentPathFromSchemaByNodeId(schema, nodeID) {
        let nodePath;
        traverseSchema(schema, (node, { path }) => {
          if (node.id === nodeID) {
            nodePath = path;
          }
        });
        return nodePath ? nodePath.split(".").slice(0, -1).join(".") : void 0;
      }
      function removeNodeFromSchemaByNodeId(schema, nodeID) {
        const nodeParentPath = getNodeParentPathFromSchemaByNodeId(schema, nodeID);
        if (nodeParentPath) {
          return over$1(lensPath$1(nodeParentPath.split(".")), (children) => children.filter((child) => child.id !== nodeID), schema);
        }
        return schema;
      }
      function schemaNodeWithChildren(node) {
        return node.type === "html-element" || node.type === "react-component";
      }
      function schemaNodeWithNode(node) {
        return node.type === "loop-container" || node.type === "route-node";
      }
      function removeAllNodeFromSchema(schema) {
        const nodeIDs = [];
        traverseSchema(schema, (node, { level, parentNode, path }) => {
          if (parentNode && schemaNodeWithChildren(parentNode)) {
            nodeIDs.push(`${node.id}`);
          }
        });
        return nodeIDs.reduce((schemaAcc, nodeID) => removeNodeFromSchemaByNodeId(schemaAcc, nodeID), schema);
      }

      var css_248z = "html, body {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n}";
      styleInject(css_248z);

      function App({ schema, layers, setSchemaStore, setLayersStore, engineId }) {
        const schemaStore$ = useMemo(() => create$2(schema), [schema]);
        const layersStore$ = useMemo(() => create(layers), [layers]);
        const engineStore$ = useMemo(() => create$1({ schemaStore$ }), [schemaStore$]);
        const EngineStoreContext = useMemo(() => getContext(engineId), [engineId]);
        useEffect(() => {
          setSchemaStore(schemaStore$);
        }, [schemaStore$]);
        useEffect(() => {
          setLayersStore(layersStore$);
        }, [layersStore$]);
        return /* @__PURE__ */ React.createElement(EngineStoreContext.Provider, {
          value: engineStore$
        }, /* @__PURE__ */ React.createElement(Core, {
          layersStore$,
          engineId
        }));
      }
      const _PageEngine = class {
        constructor(schema, layers) {
          this.setSchemaStore = (store$) => {
            this.schemaStore$ = store$;
          };
          this.setLayersStore = (store$) => {
            this.layerStore$ = store$;
          };
          this.render = (selector) => {
            ReactDOM.render(/* @__PURE__ */ React.createElement(App, {
              schema: this.schema,
              layers: this.layers,
              setSchemaStore: this.setSchemaStore,
              setLayersStore: this.setLayersStore,
              engineId: this.engineId
            }), document.getElementById(selector));
          };
          this.schema = schema;
          this.layers = layers;
          this.engineId = uuid();
          _PageEngine.instanceMap[this.engineId] = this;
        }
        static useLayers(engineId) {
          const engine = _PageEngine.instanceMap[engineId];
          return useLayers(engine.layerStore$);
        }
        static registryLayers(engineId, layers) {
          const engine = _PageEngine.instanceMap[engineId];
          return registryLayers(engine.layerStore$, layers);
        }
      };
      let PageEngine = exports('default', _PageEngine);
      PageEngine.instanceMap = {};
      PageEngine.useObservable = useObservable;
      PageEngine.useSchema = (engineId) => {
        const engine = _PageEngine.instanceMap[engineId];
        return useSchema(engine.schemaStore$, engine.schema);
      };

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
      function useCommand() {
        const commandStateRef = useRef({
          current: -1,
          queue: [],
          commands: [],
          commandName2Execute: {},
          destroyList: []
        });
        const registry = useCallback((command) => {
          const { commands, commandName2Execute, queue, current } = commandStateRef.current;
          if (commandName2Execute[command.name]) {
            const existIndex = commands.findIndex((item) => item.name === command.name);
            commands.splice(existIndex, 1);
          }
          commands.push(command);
          commandName2Execute[command.name] = (...args) => {
            const { redo, undo } = command.execute(...args);
            if (!redo) {
              return;
            }
            redo();
            if (command.followQueue === false) {
              return;
            }
            if (queue.length) {
              commandStateRef.current.queue = queue.slice(0, current + 1);
            }
            commandStateRef.current.queue.push({ redo, undo });
            commandStateRef.current.current = current + 1;
          };
        }, []);
        const onKeydown = useCallback((e) => {
          const { key, shiftKey, altKey, ctrlKey, metaKey } = e;
          const keys = [];
          if (ctrlKey || metaKey) {
            keys.push("ctrl");
          }
          if (shiftKey) {
            keys.push("shift");
          }
          if (altKey) {
            keys.push("alt");
          }
          keys.push(key.toLowerCase());
          const keyNames = keys.join("+");
          commandStateRef.current.commands.forEach((command) => {
            if (!command.keyboard) {
              return;
            }
            const keys2 = Array.isArray(command.keyboard) ? command.keyboard : [command.keyboard];
            if (keys2.includes(keyNames)) {
              commandStateRef.current.commandName2Execute[command.name]();
              e.stopPropagation();
              e.preventDefault();
            }
          });
        }, []);
        const useInit = useCallback(() => {
          useEffect(() => {
            const { commands, destroyList } = commandStateRef.current;
            commands.forEach((command) => {
              const init = command.init;
              if (init) {
                destroyList.push(init());
              }
            });
            registry({
              name: "undo",
              keyboard: ["ctrl+z"],
              followQueue: false,
              execute() {
                return {
                  redo: () => {
                    var _a, _b;
                    const { current, queue } = commandStateRef.current;
                    if (current === -1) {
                      return;
                    }
                    (_b = (_a = queue[current]).undo) == null ? void 0 : _b.call(_a);
                    commandStateRef.current.current--;
                  }
                };
              }
            });
            registry({
              name: "redo",
              keyboard: ["ctrl+y", "ctrl+shift+z"],
              followQueue: false,
              execute() {
                return {
                  redo: () => {
                    var _a, _b;
                    const { current, queue } = commandStateRef.current;
                    if (current === queue.length - 1) {
                      return;
                    }
                    (_b = (_a = queue[current + 1]).redo) == null ? void 0 : _b.call(_a);
                    commandStateRef.current.current++;
                  }
                };
              }
            });
          }, []);
        }, []);
        useEffect(() => {
          window.addEventListener("keydown", onKeydown, true);
          return () => {
            window.removeEventListener("keydown", onKeydown, true);
            commandStateRef.current.destroyList.forEach((fn) => fn == null ? void 0 : fn());
          };
        }, []);
        return {
          registry,
          useInit,
          commands: commandStateRef.current.commandName2Execute
        };
      }
      function useCanvasCommand({ schema, onChange, blocksCommunicationState$ }) {
        const expose = useCommand();
        expose.registry({
          name: "delete",
          keyboard: ["delete", "backspace", "ctrl+d"],
          execute() {
            const beforeSchema = clone$1(schema);
            const { activeNodeID } = blocksCommunicationState$.getValue();
            if (!activeNodeID) {
              return {};
            }
            const afterSchema = removeNodeFromSchemaByNodeId(schema, activeNodeID);
            return {
              redo() {
                onChange(afterSchema);
                blocksCommunicationState$.next(__spreadProps(__spreadValues({}, blocksCommunicationState$.getValue()), { activeNodeID: "" }));
              },
              undo() {
                onChange(beforeSchema);
                blocksCommunicationState$.next(__spreadProps(__spreadValues({}, blocksCommunicationState$.getValue()), { activeNodeID }));
              }
            };
          }
        });
        expose.registry({
          name: "clear",
          keyboard: ["ctrl+c"],
          execute() {
            const beforeSchema = clone$1(schema);
            const afterSchema = removeAllNodeFromSchema(schema);
            const { activeNodeID } = blocksCommunicationState$.getValue();
            return {
              redo() {
                onChange(afterSchema);
                blocksCommunicationState$.next(__spreadProps(__spreadValues({}, blocksCommunicationState$.getValue()), { activeNodeID: "" }));
              },
              undo() {
                onChange(beforeSchema);
                blocksCommunicationState$.next(__spreadProps(__spreadValues({}, blocksCommunicationState$.getValue()), { activeNodeID }));
              }
            };
          }
        });
        return expose;
      }

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9ob29rcy91c2Utb2JzZXJ2YWJsZS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2UtbGF5ZXIudHMiLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLXNjaGVtYS50cyIsIi4uLy4uLy4uL3NyYy9zdG9yZXMvc2NoZW1hLnRzIiwiLi4vLi4vLi4vc3JjL3N0b3Jlcy9lbmdpbmUudHMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9ibG9jay9pbmRleC50c3giLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vc3R5bGUtaW5qZWN0QDAuMy4wL25vZGVfbW9kdWxlcy9zdHlsZS1pbmplY3QvZGlzdC9zdHlsZS1pbmplY3QuZXMuanMiLCIuLi8uLi8uLi9zcmMvY29tcG9uZW50cy9sYXllci9pbmRleC50c3giLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9faXNQbGFjZWhvbGRlci5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19jdXJyeTEuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9fY3VycnkyLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2FyaXR5LmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2N1cnJ5Ti5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2N1cnJ5Ti5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19jdXJyeTMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9faXNBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19pc1RyYW5zZm9ybWVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2Rpc3BhdGNoYWJsZS5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL194ZkJhc2UuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9fbWFwLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2lzU3RyaW5nLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2lzQXJyYXlMaWtlLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX3h3cmFwLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvYmluZC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19yZWR1Y2UuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9feG1hcC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19oYXMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9faXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9rZXlzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvbWFwLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2lzSW50ZWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL250aC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL3BhdGhzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvcGF0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2Fzc29jLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaXNOaWwuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9hc3NvY1BhdGguanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9fY2xvbmVSZWdFeHAuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy90eXBlLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2Nsb25lLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvY2xvbmUuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9sZW5zLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvbGVuc1BhdGguanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9vdmVyLmpzIiwiLi4vLi4vLi4vc3JjL3N0b3Jlcy9sYXllci50cyIsIi4uLy4uLy4uL3NyYy9jb3JlLnRzeCIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9uYW5vaWRAMy4zLjEvbm9kZV9tb2R1bGVzL25hbm9pZC9pbmRleC5icm93c2VyLmpzIiwiLi4vLi4vLi4vc3JjL3V0aWxzLnRzeCIsIi4uLy4uLy4uL3NyYy9hcHAudHN4IiwiLi4vLi4vLi4vc3JjL3BsdWdpbi9jb21tYW5kLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZU9ic2VydmFibGU8VCBleHRlbmRzIHVua25vd24+KG9ic2VydmFibGU6IE9ic2VydmFibGU8VD4gfCB1bmRlZmluZWQsIGluaXRpYWxWYWx1ZTogVCk6IFQge1xuICBjb25zdCBbdmFsdWUsIHNldFZhbHVlXSA9IHVzZVN0YXRlKGluaXRpYWxWYWx1ZSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKG9ic2VydmFibGUpIHtcbiAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKHNldFZhbHVlKTtcbiAgICAgIHJldHVybiAoKSA9PiBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH0sIFtvYnNlcnZhYmxlXSk7XG5cbiAgcmV0dXJuIHZhbHVlID8/IGluaXRpYWxWYWx1ZTtcbn1cbiIsImltcG9ydCB0eXBlIHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IEJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGUgfSBmcm9tICcuLi90eXBlJztcbmltcG9ydCB1c2VPYnNlcnZhYmxlIGZyb20gJy4vdXNlLW9ic2VydmFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VMYXllcnM8VCBleHRlbmRzIEJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHN0b3JlJDogQmVoYXZpb3JTdWJqZWN0PFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdPik6IFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdIHtcbiAgcmV0dXJuIHVzZU9ic2VydmFibGU8UGFnZUVuZ2luZVYyLkxheWVyPFQ+W10+KHN0b3JlJCwgW10pO1xufVxuIiwiaW1wb3J0IFNjaGVtYVNwZWMgZnJvbSAnQG9uZS1mb3ItYWxsL3NjaGVtYS1zcGVjJztcbmltcG9ydCB0eXBlIHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB1c2VPYnNlcnZhYmxlIGZyb20gJy4vdXNlLW9ic2VydmFibGUnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VTY2hlbWEoc3RvcmUkOiBCZWhhdmlvclN1YmplY3Q8U2NoZW1hU3BlYy5TY2hlbWE+LCBkZWZhdWx0U2NoZW1hOiBTY2hlbWFTcGVjLlNjaGVtYSk6IFNjaGVtYVNwZWMuU2NoZW1hIHtcbiAgcmV0dXJuIHVzZU9ic2VydmFibGU8U2NoZW1hU3BlYy5TY2hlbWE+KHN0b3JlJCwgZGVmYXVsdFNjaGVtYSk7XG59XG4iLCJpbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCBTY2hlbWFTcGVjIGZyb20gJ0BvbmUtZm9yLWFsbC9zY2hlbWEtc3BlYyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGUoc2NoZW1hOiBTY2hlbWFTcGVjLlNjaGVtYSk6IEJlaGF2aW9yU3ViamVjdDxTY2hlbWFTcGVjLlNjaGVtYT4ge1xuICByZXR1cm4gbmV3IEJlaGF2aW9yU3ViamVjdDxTY2hlbWFTcGVjLlNjaGVtYT4oc2NoZW1hKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldChzdG9yZSQ6IEJlaGF2aW9yU3ViamVjdDxTY2hlbWFTcGVjLlNjaGVtYT4gfCB1bmRlZmluZWQsIHNjaGVtYTogU2NoZW1hU3BlYy5TY2hlbWEpOiB2b2lkIHtcbiAgc3RvcmUkPy5uZXh0KHNjaGVtYSk7XG59XG4iLCJpbXBvcnQgeyBDb250ZXh0LCBjcmVhdGVDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmZ1bmN0aW9uIGJ1aWxkQ29udGV4dEdldHRlcigpOiA8UyBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihpbnN0YW5jZUlkOiBzdHJpbmcpID0+IENvbnRleHQ8QmVoYXZpb3JTdWJqZWN0PFBhZ2VFbmdpbmVWMi5FbmdpbmVTdGF0ZTxTPj4+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgY29uc3QgY29udGV4dE1hcDogUmVjb3JkPHN0cmluZywgQ29udGV4dDxCZWhhdmlvclN1YmplY3Q8UGFnZUVuZ2luZVYyLkVuZ2luZVN0YXRlPGFueT4+Pj4gPSB7fTtcblxuICByZXR1cm4gPFMgZXh0ZW5kcyBQYWdlRW5naW5lVjIuQmFzZUJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZT4oaW5zdGFuY2VJZDogc3RyaW5nKTogQ29udGV4dDxCZWhhdmlvclN1YmplY3Q8UGFnZUVuZ2luZVYyLkVuZ2luZVN0YXRlPFM+Pj4gPT4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0TWFwW2luc3RhbmNlSWRdO1xuICAgIGlmIChjb250ZXh0KSB7XG4gICAgICByZXR1cm4gY29udGV4dDtcbiAgICB9XG4gICAgY29uc3QgQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8QmVoYXZpb3JTdWJqZWN0PFBhZ2VFbmdpbmVWMi5FbmdpbmVTdGF0ZTxTPj4+KGNyZWF0ZTxTPih7fSkpO1xuICAgIGNvbnRleHRNYXBbaW5zdGFuY2VJZF0gPSBDb250ZXh0O1xuICAgIHJldHVybiBDb250ZXh0O1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGU8VCBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihzdGF0ZVZhbHVlOiBQYWdlRW5naW5lVjIuRW5naW5lU3RhdGU8VD4pOiBCZWhhdmlvclN1YmplY3Q8UGFnZUVuZ2luZVYyLkVuZ2luZVN0YXRlPFQ+PiB7XG4gIHJldHVybiBuZXcgQmVoYXZpb3JTdWJqZWN0PFBhZ2VFbmdpbmVWMi5FbmdpbmVTdGF0ZTxUPj4oc3RhdGVWYWx1ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGRhdGU8VCBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihzdG9yZSQ6IEJlaGF2aW9yU3ViamVjdDxQYWdlRW5naW5lVjIuRW5naW5lU3RhdGU8VD4+LCBlbmdpbmVTdGF0ZTogUGFydGlhbDxQYWdlRW5naW5lVjIuRW5naW5lU3RhdGU8VD4+KTogdm9pZCB7XG4gIHN0b3JlJC5uZXh0KHsgLi4uc3RvcmUkLnZhbHVlLCAuLi5lbmdpbmVTdGF0ZSB9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGdldENvbnRleHQgPSBidWlsZENvbnRleHRHZXR0ZXIoKTtcbiIsImltcG9ydCBSZWFjdCwgeyBDU1NQcm9wZXJ0aWVzLCB1c2VDYWxsYmFjaywgdXNlQ29udGV4dCwgdXNlTWVtbyB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgdXNlT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL2hvb2tzJztcbmltcG9ydCB7IHNldCBhcyBzZXRTY2hlbWEgfSBmcm9tICcuLi8uLi9zdG9yZXMvc2NoZW1hJztcbmltcG9ydCB7IGdldENvbnRleHQgYXMgZ2V0RW5naW5lU3RvcmVDb250ZXh0IH0gZnJvbSAnLi4vLi4vc3RvcmVzL2VuZ2luZSc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAcnVzaHN0YWNrL25vLW5ldy1udWxsXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9jazxUIGV4dGVuZHMgUGFnZUVuZ2luZVYyLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHByb3BzOiBQYWdlRW5naW5lVjIuQmxvY2tQcm9wczxUPik6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHsgZ3JpZENvbHVtblN0YXJ0LCBncmlkQ29sdW1uRW5kLCBncmlkUm93U3RhcnQsIGdyaWRSb3dFbmQsIHJlbmRlcjogUmVuZGVyLCBlbmdpbmVJZCwgc2V0TGF5ZXIgfSA9IHByb3BzO1xuICBjb25zdCBFbmdpbmVTdG9yZUNvbnRleHQgPSB1c2VNZW1vKCgpID0+IGdldEVuZ2luZVN0b3JlQ29udGV4dDxUPihlbmdpbmVJZCksIFtlbmdpbmVJZF0pO1xuICBjb25zdCBlbmdpbmVTdG9yZSQgPSB1c2VDb250ZXh0KEVuZ2luZVN0b3JlQ29udGV4dCk7XG4gIGNvbnN0IHsgc2NoZW1hU3RvcmUkLCBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkIH0gPSB1c2VPYnNlcnZhYmxlPFBhZ2VFbmdpbmVWMi5FbmdpbmVTdGF0ZTxUPj4oZW5naW5lU3RvcmUkLCB7XG4gICAgc2NoZW1hU3RvcmUkOiBlbmdpbmVTdG9yZSQudmFsdWUuc2NoZW1hU3RvcmUkLFxuICB9KTtcbiAgY29uc3Qgc2NoZW1hID0gdXNlT2JzZXJ2YWJsZTxQYWdlRW5naW5lVjIuU2NoZW1hIHwgdW5kZWZpbmVkPihzY2hlbWFTdG9yZSQsIHVuZGVmaW5lZCk7XG5cbiAgY29uc3Qgc3R5bGU6IENTU1Byb3BlcnRpZXMgPSB7XG4gICAgZ3JpZENvbHVtblN0YXJ0LFxuICAgIGdyaWRDb2x1bW5FbmQsXG4gICAgZ3JpZFJvd1N0YXJ0LFxuICAgIGdyaWRSb3dFbmQsXG4gIH1cblxuICBjb25zdCBoYW5kbGVTY2hlbWFDaGFuZ2UgPSB1c2VDYWxsYmFjaygoc2NoZW1hOiBTY2hlbWFTcGVjLlNjaGVtYSk6IHZvaWQgPT4ge1xuICAgIHNldFNjaGVtYShzY2hlbWFTdG9yZSQsIHNjaGVtYSk7XG4gIH0sIFtzY2hlbWFTdG9yZSQsIHNjaGVtYV0pO1xuXG4gIGlmICghc2NoZW1hIHx8ICFibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1lbmdpbmUtbGF5ZXItYmxvY2tcIiBzdHlsZT17c3R5bGV9PlxuICAgICAgPFJlbmRlclxuICAgICAgICBzY2hlbWE9e3NjaGVtYX1cbiAgICAgICAgb25DaGFuZ2U9e2hhbmRsZVNjaGVtYUNoYW5nZX1cbiAgICAgICAgYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJD17YmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJH1cbiAgICAgICAgZW5naW5lSWQ9e2VuZ2luZUlkfVxuICAgICAgICBzZXRMYXllcj17c2V0TGF5ZXJ9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IFJlYWN0LCB7IENTU1Byb3BlcnRpZXMsIHVzZU1lbW8sIHVzZUVmZmVjdCwgdXNlQ29udGV4dCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSBcInJ4anNcIjtcblxuaW1wb3J0IEJsb2NrIGZyb20gJy4uL2Jsb2NrJztcbmltcG9ydCB7IGdldENvbnRleHQgYXMgZ2V0RW5naW5lU3RvcmVDb250ZXh0LCB1cGRhdGUgYXMgdXBkYXRlRW5naW5lU3RvcmUgIH0gZnJvbSAnLi4vLi4vc3RvcmVzL2VuZ2luZSc7XG5cbmltcG9ydCAnLi9zdHlsZS5zY3NzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGF5ZXI8VCBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihwcm9wczogUGFnZUVuZ2luZVYyLkxheWVyUHJvcHM8VD4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHsgYmxvY2tzLCBncmlkVGVtcGxhdGVDb2x1bW5zLCBncmlkVGVtcGxhdGVSb3dzLCB6SW5kZXgsIGVuZ2luZUlkLCBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGVJbml0aWFsVmFsdWUsIHNldExheWVyIH0gPSBwcm9wcztcbiAgY29uc3QgRW5naW5lU3RvcmVDb250ZXh0ID0gdXNlTWVtbygoKSA9PiBnZXRFbmdpbmVTdG9yZUNvbnRleHQ8VD4oZW5naW5lSWQpLCBbZW5naW5lSWRdKTtcbiAgY29uc3QgZW5naW5lU3RvcmUkID0gdXNlQ29udGV4dChFbmdpbmVTdG9yZUNvbnRleHQpO1xuICBjb25zdCBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkID0gdXNlTWVtbyhcbiAgICAoKSA9PiBuZXcgQmVoYXZpb3JTdWJqZWN0PFQ+KGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZUluaXRpYWxWYWx1ZSksXG4gICAgW2Jsb2Nrc0NvbW11bmljYXRpb25TdGF0ZUluaXRpYWxWYWx1ZV1cbiAgKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHVwZGF0ZUVuZ2luZVN0b3JlKGVuZ2luZVN0b3JlJCwgeyBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkIH0pO1xuICB9LCBbYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJF0pO1xuXG4gIGNvbnN0IHBhZ2VFbmdpbmVMYXllclN0eWxlOiBDU1NQcm9wZXJ0aWVzID0ge1xuICAgIGRpc3BsYXk6ICdncmlkJyxcbiAgICBnYXA6ICcxcHgnLFxuICAgIGdyaWRUZW1wbGF0ZUNvbHVtbnMsXG4gICAgZ3JpZFRlbXBsYXRlUm93cyxcbiAgICB6SW5kZXgsXG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1lbmdpbmUtbGF5ZXJcIiBzdHlsZT17cGFnZUVuZ2luZUxheWVyU3R5bGV9PlxuICAgICAge2Jsb2Nrcy5maWx0ZXIoKHsgdmlzaWJsZSB9KSA9PiB2aXNpYmxlICE9PSBmYWxzZSkubWFwKChibG9jaywgaW5kZXgpID0+IChcbiAgICAgICAgPEJsb2NrPFQ+XG4gICAgICAgICAgey4uLmJsb2NrfVxuICAgICAgICAgIGtleT17aW5kZXh9XG4gICAgICAgICAgZW5naW5lSWQ9e2VuZ2luZUlkfVxuICAgICAgICAgIHNldExheWVyPXtzZXRMYXllcn1cbiAgICAgICAgLz5cbiAgICAgICkpfVxuICAgIDwvZGl2PlxuICApXG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfaXNQbGFjZWhvbGRlcihhKSB7XG4gIHJldHVybiBhICE9IG51bGwgJiYgdHlwZW9mIGEgPT09ICdvYmplY3QnICYmIGFbJ0BAZnVuY3Rpb25hbC9wbGFjZWhvbGRlciddID09PSB0cnVlO1xufSIsImltcG9ydCBfaXNQbGFjZWhvbGRlciBmcm9tIFwiLi9faXNQbGFjZWhvbGRlci5qc1wiO1xuLyoqXG4gKiBPcHRpbWl6ZWQgaW50ZXJuYWwgb25lLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY3VycnkxKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmMShhKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDAgfHwgX2lzUGxhY2Vob2xkZXIoYSkpIHtcbiAgICAgIHJldHVybiBmMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9O1xufSIsImltcG9ydCBfY3VycnkxIGZyb20gXCIuL19jdXJyeTEuanNcIjtcbmltcG9ydCBfaXNQbGFjZWhvbGRlciBmcm9tIFwiLi9faXNQbGFjZWhvbGRlci5qc1wiO1xuLyoqXG4gKiBPcHRpbWl6ZWQgaW50ZXJuYWwgdHdvLWFyaXR5IGN1cnJ5IGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBjdXJyeS5cbiAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgY3VycmllZCBmdW5jdGlvbi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfY3VycnkyKGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiBmMihhLCBiKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIHJldHVybiBmMjtcblxuICAgICAgY2FzZSAxOlxuICAgICAgICByZXR1cm4gX2lzUGxhY2Vob2xkZXIoYSkgPyBmMiA6IF9jdXJyeTEoZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIF9iKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IGYyIDogX2lzUGxhY2Vob2xkZXIoYSkgPyBfY3VycnkxKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgIHJldHVybiBmbihfYSwgYik7XG4gICAgICAgIH0pIDogX2lzUGxhY2Vob2xkZXIoYikgPyBfY3VycnkxKGZ1bmN0aW9uIChfYikge1xuICAgICAgICAgIHJldHVybiBmbihhLCBfYik7XG4gICAgICAgIH0pIDogZm4oYSwgYik7XG4gICAgfVxuICB9O1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcml0eShuLCBmbikge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBzd2l0Y2ggKG4pIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGEwKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMikge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0KSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgNjpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDc6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2KSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgODpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3KSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgOTpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDEwOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBfYXJpdHkgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIG5vIGdyZWF0ZXIgdGhhbiB0ZW4nKTtcbiAgfVxufSIsImltcG9ydCBfYXJpdHkgZnJvbSBcIi4vX2FyaXR5LmpzXCI7XG5pbXBvcnQgX2lzUGxhY2Vob2xkZXIgZnJvbSBcIi4vX2lzUGxhY2Vob2xkZXIuanNcIjtcbi8qKlxuICogSW50ZXJuYWwgY3VycnlOIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IG9mIHRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtBcnJheX0gcmVjZWl2ZWQgQW4gYXJyYXkgb2YgYXJndW1lbnRzIHJlY2VpdmVkIHRodXMgZmFyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jdXJyeU4obGVuZ3RoLCByZWNlaXZlZCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29tYmluZWQgPSBbXTtcbiAgICB2YXIgYXJnc0lkeCA9IDA7XG4gICAgdmFyIGxlZnQgPSBsZW5ndGg7XG4gICAgdmFyIGNvbWJpbmVkSWR4ID0gMDtcblxuICAgIHdoaWxlIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCB8fCBhcmdzSWR4IDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgaWYgKGNvbWJpbmVkSWR4IDwgcmVjZWl2ZWQubGVuZ3RoICYmICghX2lzUGxhY2Vob2xkZXIocmVjZWl2ZWRbY29tYmluZWRJZHhdKSB8fCBhcmdzSWR4ID49IGFyZ3VtZW50cy5sZW5ndGgpKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlY2VpdmVkW2NvbWJpbmVkSWR4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1thcmdzSWR4XTtcbiAgICAgICAgYXJnc0lkeCArPSAxO1xuICAgICAgfVxuXG4gICAgICBjb21iaW5lZFtjb21iaW5lZElkeF0gPSByZXN1bHQ7XG5cbiAgICAgIGlmICghX2lzUGxhY2Vob2xkZXIocmVzdWx0KSkge1xuICAgICAgICBsZWZ0IC09IDE7XG4gICAgICB9XG5cbiAgICAgIGNvbWJpbmVkSWR4ICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnQgPD0gMCA/IGZuLmFwcGx5KHRoaXMsIGNvbWJpbmVkKSA6IF9hcml0eShsZWZ0LCBfY3VycnlOKGxlbmd0aCwgY29tYmluZWQsIGZuKSk7XG4gIH07XG59IiwiaW1wb3J0IF9hcml0eSBmcm9tIFwiLi9pbnRlcm5hbC9fYXJpdHkuanNcIjtcbmltcG9ydCBfY3VycnkxIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTEuanNcIjtcbmltcG9ydCBfY3VycnkyIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTIuanNcIjtcbmltcG9ydCBfY3VycnlOIGZyb20gXCIuL2ludGVybmFsL19jdXJyeU4uanNcIjtcbi8qKlxuICogUmV0dXJucyBhIGN1cnJpZWQgZXF1aXZhbGVudCBvZiB0aGUgcHJvdmlkZWQgZnVuY3Rpb24sIHdpdGggdGhlIHNwZWNpZmllZFxuICogYXJpdHkuIFRoZSBjdXJyaWVkIGZ1bmN0aW9uIGhhcyB0d28gdW51c3VhbCBjYXBhYmlsaXRpZXMuIEZpcnN0LCBpdHNcbiAqIGFyZ3VtZW50cyBuZWVkbid0IGJlIHByb3ZpZGVkIG9uZSBhdCBhIHRpbWUuIElmIGBnYCBpcyBgUi5jdXJyeU4oMywgZilgLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSkoMikoMylgXG4gKiAgIC0gYGcoMSkoMiwgMylgXG4gKiAgIC0gYGcoMSwgMikoMylgXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKlxuICogU2Vjb25kbHksIHRoZSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIFtgUi5fX2BdKCNfXykgbWF5IGJlIHVzZWQgdG8gc3BlY2lmeVxuICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLiBJZiBgZ2AgaXMgYXMgYWJvdmUgYW5kIGBfYCBpcyBbYFIuX19gXSgjX18pLFxuICogdGhlIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKiAgIC0gYGcoXywgMiwgMykoMSlgXG4gKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gKiAgIC0gYGcoXywgMikoMSkoMylgXG4gKiAgIC0gYGcoXywgMikoMSwgMylgXG4gKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuNS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgTnVtYmVyIC0+ICgqIC0+IGEpIC0+ICgqIC0+IGEpXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBhcml0eSBmb3IgdGhlIHJldHVybmVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHNlZSBSLmN1cnJ5XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3Qgc3VtQXJncyA9ICguLi5hcmdzKSA9PiBSLnN1bShhcmdzKTtcbiAqXG4gKiAgICAgIGNvbnN0IGN1cnJpZWRBZGRGb3VyTnVtYmVycyA9IFIuY3VycnlOKDQsIHN1bUFyZ3MpO1xuICogICAgICBjb25zdCBmID0gY3VycmllZEFkZEZvdXJOdW1iZXJzKDEsIDIpO1xuICogICAgICBjb25zdCBnID0gZigzKTtcbiAqICAgICAgZyg0KTsgLy89PiAxMFxuICovXG5cbnZhciBjdXJyeU4gPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBjdXJyeU4obGVuZ3RoLCBmbikge1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIF9jdXJyeTEoZm4pO1xuICB9XG5cbiAgcmV0dXJuIF9hcml0eShsZW5ndGgsIF9jdXJyeU4obGVuZ3RoLCBbXSwgZm4pKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjdXJyeU47IiwiaW1wb3J0IF9jdXJyeTEgZnJvbSBcIi4vX2N1cnJ5MS5qc1wiO1xuaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IF9pc1BsYWNlaG9sZGVyIGZyb20gXCIuL19pc1BsYWNlaG9sZGVyLmpzXCI7XG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCB0aHJlZS1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2N1cnJ5Myhmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZjMoYSwgYiwgYykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gZjM7XG5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpID8gZjMgOiBfY3VycnkyKGZ1bmN0aW9uIChfYiwgX2MpIHtcbiAgICAgICAgICByZXR1cm4gZm4oYSwgX2IsIF9jKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gZjMgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTIoZnVuY3Rpb24gKF9hLCBfYykge1xuICAgICAgICAgIHJldHVybiBmbihfYSwgYiwgX2MpO1xuICAgICAgICB9KSA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MihmdW5jdGlvbiAoX2IsIF9jKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIF9iLCBfYyk7XG4gICAgICAgIH0pIDogX2N1cnJ5MShmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICByZXR1cm4gZm4oYSwgYiwgX2MpO1xuICAgICAgICB9KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gZjMgOiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTIoZnVuY3Rpb24gKF9hLCBfYikge1xuICAgICAgICAgIHJldHVybiBmbihfYSwgX2IsIGMpO1xuICAgICAgICB9KSA6IF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gX2N1cnJ5MihmdW5jdGlvbiAoX2EsIF9jKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKF9hLCBiLCBfYyk7XG4gICAgICAgIH0pIDogX2lzUGxhY2Vob2xkZXIoYikgJiYgX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkyKGZ1bmN0aW9uIChfYiwgX2MpIHtcbiAgICAgICAgICByZXR1cm4gZm4oYSwgX2IsIF9jKTtcbiAgICAgICAgfSkgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKF9hLCBiLCBjKTtcbiAgICAgICAgfSkgOiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIF9iLCBjKTtcbiAgICAgICAgfSkgOiBfaXNQbGFjZWhvbGRlcihjKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIF9jKTtcbiAgICAgICAgfSkgOiBmbihhLCBiLCBjKTtcbiAgICB9XG4gIH07XG59IiwiLyoqXG4gKiBUZXN0cyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QgaXMgYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBvYmplY3QgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgdmFsYCBpcyBhbiBhcnJheSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX2lzQXJyYXkoW10pOyAvLz0+IHRydWVcbiAqICAgICAgX2lzQXJyYXkobnVsbCk7IC8vPT4gZmFsc2VcbiAqICAgICAgX2lzQXJyYXkoe30pOyAvLz0+IGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gX2lzQXJyYXkodmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwubGVuZ3RoID49IDAgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9pc1RyYW5zZm9ybWVyKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9ialsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9PT0gJ2Z1bmN0aW9uJztcbn0iLCJpbXBvcnQgX2lzQXJyYXkgZnJvbSBcIi4vX2lzQXJyYXkuanNcIjtcbmltcG9ydCBfaXNUcmFuc2Zvcm1lciBmcm9tIFwiLi9faXNUcmFuc2Zvcm1lci5qc1wiO1xuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIHdpdGggZGlmZmVyZW50IHN0cmF0ZWdpZXMgYmFzZWQgb24gdGhlXG4gKiBvYmplY3QgaW4gbGlzdCBwb3NpdGlvbiAobGFzdCBhcmd1bWVudCkuIElmIGl0IGlzIGFuIGFycmF5LCBleGVjdXRlcyBbZm5dLlxuICogT3RoZXJ3aXNlLCBpZiBpdCBoYXMgYSBmdW5jdGlvbiB3aXRoIG9uZSBvZiB0aGUgZ2l2ZW4gbWV0aG9kIG5hbWVzLCBpdCB3aWxsXG4gKiBleGVjdXRlIHRoYXQgZnVuY3Rpb24gKGZ1bmN0b3IgY2FzZSkuIE90aGVyd2lzZSwgaWYgaXQgaXMgYSB0cmFuc2Zvcm1lcixcbiAqIHVzZXMgdHJhbnNkdWNlciBbeGZdIHRvIHJldHVybiBhIG5ldyB0cmFuc2Zvcm1lciAodHJhbnNkdWNlciBjYXNlKS5cbiAqIE90aGVyd2lzZSwgaXQgd2lsbCBkZWZhdWx0IHRvIGV4ZWN1dGluZyBbZm5dLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBtZXRob2ROYW1lcyBwcm9wZXJ0aWVzIHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0geGYgdHJhbnNkdWNlciB0byBpbml0aWFsaXplIGlmIG9iamVjdCBpcyB0cmFuc2Zvcm1lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gZGVmYXVsdCByYW1kYSBpbXBsZW1lbnRhdGlvblxuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIG9uIG9iamVjdCBpbiBsaXN0IHBvc2l0aW9uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2Rpc3BhdGNoYWJsZShtZXRob2ROYW1lcywgeGYsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmbigpO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICB2YXIgb2JqID0gYXJncy5wb3AoKTtcblxuICAgIGlmICghX2lzQXJyYXkob2JqKSkge1xuICAgICAgdmFyIGlkeCA9IDA7XG5cbiAgICAgIHdoaWxlIChpZHggPCBtZXRob2ROYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbbWV0aG9kTmFtZXNbaWR4XV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gb2JqW21ldGhvZE5hbWVzW2lkeF1dLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZHggKz0gMTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9pc1RyYW5zZm9ybWVyKG9iaikpIHtcbiAgICAgICAgdmFyIHRyYW5zZHVjZXIgPSB4Zi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRyYW5zZHVjZXIob2JqKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL2luaXQnXSgpO1xuICB9LFxuICByZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX21hcChmbiwgZnVuY3Rvcikge1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGZ1bmN0b3IubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuKTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgcmVzdWx0W2lkeF0gPSBmbihmdW5jdG9yW2lkeF0pO1xuICAgIGlkeCArPSAxO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfaXNTdHJpbmcoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBTdHJpbmddJztcbn0iLCJpbXBvcnQgX2N1cnJ5MSBmcm9tIFwiLi9fY3VycnkxLmpzXCI7XG5pbXBvcnQgX2lzQXJyYXkgZnJvbSBcIi4vX2lzQXJyYXkuanNcIjtcbmltcG9ydCBfaXNTdHJpbmcgZnJvbSBcIi4vX2lzU3RyaW5nLmpzXCI7XG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBzaW1pbGFyIHRvIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKiAtPiBCb29sZWFuXG4gKiBAcGFyYW0geyp9IHggVGhlIG9iamVjdCB0byB0ZXN0LlxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB4YCBoYXMgYSBudW1lcmljIGxlbmd0aCBwcm9wZXJ0eSBhbmQgZXh0cmVtZSBpbmRpY2VzIGRlZmluZWQ7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIF9pc0FycmF5TGlrZShbXSk7IC8vPT4gdHJ1ZVxuICogICAgICBfaXNBcnJheUxpa2UodHJ1ZSk7IC8vPT4gZmFsc2VcbiAqICAgICAgX2lzQXJyYXlMaWtlKHt9KTsgLy89PiBmYWxzZVxuICogICAgICBfaXNBcnJheUxpa2Uoe2xlbmd0aDogMTB9KTsgLy89PiBmYWxzZVxuICogICAgICBfaXNBcnJheUxpa2UoezA6ICd6ZXJvJywgOTogJ25pbmUnLCBsZW5ndGg6IDEwfSk7IC8vPT4gdHJ1ZVxuICovXG5cbnZhciBfaXNBcnJheUxpa2UgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MShmdW5jdGlvbiBpc0FycmF5TGlrZSh4KSB7XG4gIGlmIChfaXNBcnJheSh4KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChfaXNTdHJpbmcoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoeC5ub2RlVHlwZSA9PT0gMSkge1xuICAgIHJldHVybiAhIXgubGVuZ3RoO1xuICB9XG5cbiAgaWYgKHgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoeC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHguaGFzT3duUHJvcGVydHkoMCkgJiYgeC5oYXNPd25Qcm9wZXJ0eSh4Lmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9pc0FycmF5TGlrZTsiLCJ2YXIgWFdyYXAgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBYV3JhcChmbikge1xuICAgIHRoaXMuZiA9IGZuO1xuICB9XG5cbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW5pdCBub3QgaW1wbGVtZW50ZWQgb24gWFdyYXAnKTtcbiAgfTtcblxuICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChhY2MpIHtcbiAgICByZXR1cm4gYWNjO1xuICB9O1xuXG4gIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChhY2MsIHgpIHtcbiAgICByZXR1cm4gdGhpcy5mKGFjYywgeCk7XG4gIH07XG5cbiAgcmV0dXJuIFhXcmFwO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfeHdyYXAoZm4pIHtcbiAgcmV0dXJuIG5ldyBYV3JhcChmbik7XG59IiwiaW1wb3J0IF9hcml0eSBmcm9tIFwiLi9pbnRlcm5hbC9fYXJpdHkuanNcIjtcbmltcG9ydCBfY3VycnkyIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTIuanNcIjtcbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgYm91bmQgdG8gYSBjb250ZXh0LlxuICogTm90ZTogYFIuYmluZGAgZG9lcyBub3QgcHJvdmlkZSB0aGUgYWRkaXRpb25hbCBhcmd1bWVudC1iaW5kaW5nIGNhcGFiaWxpdGllcyBvZlxuICogW0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9iaW5kKS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC42LjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyAoKiAtPiAqKSAtPiB7Kn0gLT4gKCogLT4gKilcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiaW5kIHRvIGNvbnRleHRcbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzT2JqIFRoZSBjb250ZXh0IHRvIGJpbmQgYGZuYCB0b1xuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgaW4gdGhlIGNvbnRleHQgb2YgYHRoaXNPYmpgLlxuICogQHNlZSBSLnBhcnRpYWxcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBjb25zdCBsb2cgPSBSLmJpbmQoY29uc29sZS5sb2csIGNvbnNvbGUpO1xuICogICAgICBSLnBpcGUoUi5hc3NvYygnYScsIDIpLCBSLnRhcChsb2cpLCBSLmFzc29jKCdhJywgMykpKHthOiAxfSk7IC8vPT4ge2E6IDN9XG4gKiAgICAgIC8vIGxvZ3Mge2E6IDJ9XG4gKiBAc3ltYiBSLmJpbmQoZiwgbykoYSwgYikgPSBmLmNhbGwobywgYSwgYilcbiAqL1xuXG52YXIgYmluZCA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkyKGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNPYmopIHtcbiAgcmV0dXJuIF9hcml0eShmbi5sZW5ndGgsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc09iaiwgYXJndW1lbnRzKTtcbiAgfSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYmluZDsiLCJpbXBvcnQgX2lzQXJyYXlMaWtlIGZyb20gXCIuL19pc0FycmF5TGlrZS5qc1wiO1xuaW1wb3J0IF94d3JhcCBmcm9tIFwiLi9feHdyYXAuanNcIjtcbmltcG9ydCBiaW5kIGZyb20gXCIuLi9iaW5kLmpzXCI7XG5cbmZ1bmN0aW9uIF9hcnJheVJlZHVjZSh4ZiwgYWNjLCBsaXN0KSB7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgbGlzdFtpZHhdKTtcblxuICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWR4ICs9IDE7XG4gIH1cblxuICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShhY2MpO1xufVxuXG5mdW5jdGlvbiBfaXRlcmFibGVSZWR1Y2UoeGYsIGFjYywgaXRlcikge1xuICB2YXIgc3RlcCA9IGl0ZXIubmV4dCgpO1xuXG4gIHdoaWxlICghc3RlcC5kb25lKSB7XG4gICAgYWNjID0geGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10oYWNjLCBzdGVwLnZhbHVlKTtcblxuICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3RlcCA9IGl0ZXIubmV4dCgpO1xuICB9XG5cbiAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10oYWNjKTtcbn1cblxuZnVuY3Rpb24gX21ldGhvZFJlZHVjZSh4ZiwgYWNjLCBvYmosIG1ldGhvZE5hbWUpIHtcbiAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ob2JqW21ldGhvZE5hbWVdKGJpbmQoeGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10sIHhmKSwgYWNjKSk7XG59XG5cbnZhciBzeW1JdGVyYXRvciA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnID8gU3ltYm9sLml0ZXJhdG9yIDogJ0BAaXRlcmF0b3InO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3JlZHVjZShmbiwgYWNjLCBsaXN0KSB7XG4gIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICBmbiA9IF94d3JhcChmbik7XG4gIH1cblxuICBpZiAoX2lzQXJyYXlMaWtlKGxpc3QpKSB7XG4gICAgcmV0dXJuIF9hcnJheVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbGlzdFsnZmFudGFzeS1sYW5kL3JlZHVjZSddID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9tZXRob2RSZWR1Y2UoZm4sIGFjYywgbGlzdCwgJ2ZhbnRhc3ktbGFuZC9yZWR1Y2UnKTtcbiAgfVxuXG4gIGlmIChsaXN0W3N5bUl0ZXJhdG9yXSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIF9pdGVyYWJsZVJlZHVjZShmbiwgYWNjLCBsaXN0W3N5bUl0ZXJhdG9yXSgpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbGlzdC5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9pdGVyYWJsZVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbGlzdC5yZWR1Y2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gX21ldGhvZFJlZHVjZShmbiwgYWNjLCBsaXN0LCAncmVkdWNlJyk7XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2U6IGxpc3QgbXVzdCBiZSBhcnJheSBvciBpdGVyYWJsZScpO1xufSIsImltcG9ydCBfY3VycnkyIGZyb20gXCIuL19jdXJyeTIuanNcIjtcbmltcG9ydCBfeGZCYXNlIGZyb20gXCIuL194ZkJhc2UuanNcIjtcblxudmFyIFhNYXAgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBYTWFwKGYsIHhmKSB7XG4gICAgdGhpcy54ZiA9IHhmO1xuICAgIHRoaXMuZiA9IGY7XG4gIH1cblxuICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuXG4gIFhNYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHRoaXMuZihpbnB1dCkpO1xuICB9O1xuXG4gIHJldHVybiBYTWFwO1xufSgpO1xuXG52YXIgX3htYXAgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBfeG1hcChmLCB4Zikge1xuICByZXR1cm4gbmV3IFhNYXAoZiwgeGYpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF94bWFwOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9oYXMocHJvcCwgb2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn0iLCJpbXBvcnQgX2hhcyBmcm9tIFwiLi9faGFzLmpzXCI7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgX2lzQXJndW1lbnRzID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJndW1lbnRzKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScgPyBmdW5jdGlvbiBfaXNBcmd1bWVudHMoeCkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcbiAgfSA6IGZ1bmN0aW9uIF9pc0FyZ3VtZW50cyh4KSB7XG4gICAgcmV0dXJuIF9oYXMoJ2NhbGxlZScsIHgpO1xuICB9O1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBfaXNBcmd1bWVudHM7IiwiaW1wb3J0IF9jdXJyeTEgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5MS5qc1wiO1xuaW1wb3J0IF9oYXMgZnJvbSBcIi4vaW50ZXJuYWwvX2hhcy5qc1wiO1xuaW1wb3J0IF9pc0FyZ3VtZW50cyBmcm9tIFwiLi9pbnRlcm5hbC9faXNBcmd1bWVudHMuanNcIjsgLy8gY292ZXIgSUUgPCA5IGtleXMgaXNzdWVzXG5cbnZhciBoYXNFbnVtQnVnID0gIVxuLyojX19QVVJFX18qL1xue1xuICB0b1N0cmluZzogbnVsbFxufS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbnZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ2NvbnN0cnVjdG9yJywgJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddOyAvLyBTYWZhcmkgYnVnXG5cbnZhciBoYXNBcmdzRW51bUJ1ZyA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICByZXR1cm4gYXJndW1lbnRzLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKTtcbn0oKTtcblxudmFyIGNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMobGlzdCwgaXRlbSkge1xuICB2YXIgaWR4ID0gMDtcblxuICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICBpZiAobGlzdFtpZHhdID09PSBpdGVtKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZHggKz0gMTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG4vKipcbiAqIFJldHVybnMgYSBsaXN0IGNvbnRhaW5pbmcgdGhlIG5hbWVzIG9mIGFsbCB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZlxuICogdGhlIHN1cHBsaWVkIG9iamVjdC5cbiAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSBjb25zaXN0ZW50XG4gKiBhY3Jvc3MgZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcge2s6IHZ9IC0+IFtrXVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgcHJvcGVydGllcyBmcm9tXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICogQHNlZSBSLmtleXNJbiwgUi52YWx1ZXNcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmtleXMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbJ2EnLCAnYicsICdjJ11cbiAqL1xuXG5cbnZhciBrZXlzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nICYmICFoYXNBcmdzRW51bUJ1ZyA/XG4vKiNfX1BVUkVfXyovXG5fY3VycnkxKGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gIHJldHVybiBPYmplY3Qob2JqKSAhPT0gb2JqID8gW10gOiBPYmplY3Qua2V5cyhvYmopO1xufSkgOlxuLyojX19QVVJFX18qL1xuX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICBpZiAoT2JqZWN0KG9iaikgIT09IG9iaikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBwcm9wLCBuSWR4O1xuICB2YXIga3MgPSBbXTtcblxuICB2YXIgY2hlY2tBcmdzTGVuZ3RoID0gaGFzQXJnc0VudW1CdWcgJiYgX2lzQXJndW1lbnRzKG9iaik7XG5cbiAgZm9yIChwcm9wIGluIG9iaikge1xuICAgIGlmIChfaGFzKHByb3AsIG9iaikgJiYgKCFjaGVja0FyZ3NMZW5ndGggfHwgcHJvcCAhPT0gJ2xlbmd0aCcpKSB7XG4gICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICB9XG4gIH1cblxuICBpZiAoaGFzRW51bUJ1Zykge1xuICAgIG5JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoIC0gMTtcblxuICAgIHdoaWxlIChuSWR4ID49IDApIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbklkeF07XG5cbiAgICAgIGlmIChfaGFzKHByb3AsIG9iaikgJiYgIWNvbnRhaW5zKGtzLCBwcm9wKSkge1xuICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgIH1cblxuICAgICAgbklkeCAtPSAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBrcztcbn0pO1xuZXhwb3J0IGRlZmF1bHQga2V5czsiLCJpbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG5pbXBvcnQgX2Rpc3BhdGNoYWJsZSBmcm9tIFwiLi9pbnRlcm5hbC9fZGlzcGF0Y2hhYmxlLmpzXCI7XG5pbXBvcnQgX21hcCBmcm9tIFwiLi9pbnRlcm5hbC9fbWFwLmpzXCI7XG5pbXBvcnQgX3JlZHVjZSBmcm9tIFwiLi9pbnRlcm5hbC9fcmVkdWNlLmpzXCI7XG5pbXBvcnQgX3htYXAgZnJvbSBcIi4vaW50ZXJuYWwvX3htYXAuanNcIjtcbmltcG9ydCBjdXJyeU4gZnJvbSBcIi4vY3VycnlOLmpzXCI7XG5pbXBvcnQga2V5cyBmcm9tIFwiLi9rZXlzLmpzXCI7XG4vKipcbiAqIFRha2VzIGEgZnVuY3Rpb24gYW5kXG4gKiBhIFtmdW5jdG9yXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI2Z1bmN0b3IpLFxuICogYXBwbGllcyB0aGUgZnVuY3Rpb24gdG8gZWFjaCBvZiB0aGUgZnVuY3RvcidzIHZhbHVlcywgYW5kIHJldHVybnNcbiAqIGEgZnVuY3RvciBvZiB0aGUgc2FtZSBzaGFwZS5cbiAqXG4gKiBSYW1kYSBwcm92aWRlcyBzdWl0YWJsZSBgbWFwYCBpbXBsZW1lbnRhdGlvbnMgZm9yIGBBcnJheWAgYW5kIGBPYmplY3RgLFxuICogc28gdGhpcyBmdW5jdGlvbiBtYXkgYmUgYXBwbGllZCB0byBgWzEsIDIsIDNdYCBvciBge3g6IDEsIHk6IDIsIHo6IDN9YC5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgbWFwYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gKlxuICogQWxzbyB0cmVhdHMgZnVuY3Rpb25zIGFzIGZ1bmN0b3JzIGFuZCB3aWxsIGNvbXBvc2UgdGhlbSB0b2dldGhlci5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIEZ1bmN0b3IgZiA9PiAoYSAtPiBiKSAtPiBmIGEgLT4gZiBiXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gYmUgaXRlcmF0ZWQgb3Zlci5cbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGxpc3QuXG4gKiBAc2VlIFIudHJhbnNkdWNlLCBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgZG91YmxlID0geCA9PiB4ICogMjtcbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwgWzEsIDIsIDNdKTsgLy89PiBbMiwgNCwgNl1cbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwge3g6IDEsIHk6IDIsIHo6IDN9KTsgLy89PiB7eDogMiwgeTogNCwgejogNn1cbiAqIEBzeW1iIFIubWFwKGYsIFthLCBiXSkgPSBbZihhKSwgZihiKV1cbiAqIEBzeW1iIFIubWFwKGYsIHsgeDogYSwgeTogYiB9KSA9IHsgeDogZihhKSwgeTogZihiKSB9XG4gKiBAc3ltYiBSLm1hcChmLCBmdW5jdG9yX28pID0gZnVuY3Rvcl9vLm1hcChmKVxuICovXG5cbnZhciBtYXAgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5Mihcbi8qI19fUFVSRV9fKi9cbl9kaXNwYXRjaGFibGUoWydmYW50YXN5LWxhbmQvbWFwJywgJ21hcCddLCBfeG1hcCwgZnVuY3Rpb24gbWFwKGZuLCBmdW5jdG9yKSB7XG4gIHN3aXRjaCAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0b3IpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgICAgcmV0dXJuIGN1cnJ5TihmdW5jdG9yLmxlbmd0aCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBmdW5jdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfSk7XG5cbiAgICBjYXNlICdbb2JqZWN0IE9iamVjdF0nOlxuICAgICAgcmV0dXJuIF9yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICAgIGFjY1trZXldID0gZm4oZnVuY3RvcltrZXldKTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9LCBrZXlzKGZ1bmN0b3IpKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gX21hcChmbiwgZnVuY3Rvcik7XG4gIH1cbn0pKTtcblxuZXhwb3J0IGRlZmF1bHQgbWFwOyIsIi8qKlxuICogRGV0ZXJtaW5lIGlmIHRoZSBwYXNzZWQgYXJndW1lbnQgaXMgYW4gaW50ZWdlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBuXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiBfaXNJbnRlZ2VyKG4pIHtcbiAgcmV0dXJuIG4gPDwgMCA9PT0gbjtcbn07IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IF9pc1N0cmluZyBmcm9tIFwiLi9pbnRlcm5hbC9faXNTdHJpbmcuanNcIjtcbi8qKlxuICogUmV0dXJucyB0aGUgbnRoIGVsZW1lbnQgb2YgdGhlIGdpdmVuIGxpc3Qgb3Igc3RyaW5nLiBJZiBuIGlzIG5lZ2F0aXZlIHRoZVxuICogZWxlbWVudCBhdCBpbmRleCBsZW5ndGggKyBuIGlzIHJldHVybmVkLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgTnVtYmVyIC0+IFthXSAtPiBhIHwgVW5kZWZpbmVkXG4gKiBAc2lnIE51bWJlciAtPiBTdHJpbmcgLT4gU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0XG4gKiBAcGFyYW0geyp9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgbGlzdCA9IFsnZm9vJywgJ2JhcicsICdiYXonLCAncXV1eCddO1xuICogICAgICBSLm50aCgxLCBsaXN0KTsgLy89PiAnYmFyJ1xuICogICAgICBSLm50aCgtMSwgbGlzdCk7IC8vPT4gJ3F1dXgnXG4gKiAgICAgIFIubnRoKC05OSwgbGlzdCk7IC8vPT4gdW5kZWZpbmVkXG4gKlxuICogICAgICBSLm50aCgyLCAnYWJjJyk7IC8vPT4gJ2MnXG4gKiAgICAgIFIubnRoKDMsICdhYmMnKTsgLy89PiAnJ1xuICogQHN5bWIgUi5udGgoLTEsIFthLCBiLCBjXSkgPSBjXG4gKiBAc3ltYiBSLm50aCgwLCBbYSwgYiwgY10pID0gYVxuICogQHN5bWIgUi5udGgoMSwgW2EsIGIsIGNdKSA9IGJcbiAqL1xuXG52YXIgbnRoID1cbi8qI19fUFVSRV9fKi9cbl9jdXJyeTIoZnVuY3Rpb24gbnRoKG9mZnNldCwgbGlzdCkge1xuICB2YXIgaWR4ID0gb2Zmc2V0IDwgMCA/IGxpc3QubGVuZ3RoICsgb2Zmc2V0IDogb2Zmc2V0O1xuICByZXR1cm4gX2lzU3RyaW5nKGxpc3QpID8gbGlzdC5jaGFyQXQoaWR4KSA6IGxpc3RbaWR4XTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBudGg7IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IF9pc0ludGVnZXIgZnJvbSBcIi4vaW50ZXJuYWwvX2lzSW50ZWdlci5qc1wiO1xuaW1wb3J0IG50aCBmcm9tIFwiLi9udGguanNcIjtcbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZXMgYXQgZ2l2ZW4gcGF0aHMgb2YgYW4gb2JqZWN0LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjI3LjFcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBJZHggPSBbU3RyaW5nIHwgSW50XVxuICogQHNpZyBbSWR4XSAtPiB7YX0gLT4gW2EgfCBVbmRlZmluZWRdXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoc0FycmF5IFRoZSBhcnJheSBvZiBwYXRocyB0byBiZSBmZXRjaGVkLlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHJldHJpZXZlIHRoZSBuZXN0ZWQgcHJvcGVydGllcyBmcm9tLlxuICogQHJldHVybiB7QXJyYXl9IEEgbGlzdCBjb25zaXN0aW5nIG9mIHZhbHVlcyBhdCBwYXRocyBzcGVjaWZpZWQgYnkgXCJwYXRoc0FycmF5XCIuXG4gKiBAc2VlIFIucGF0aFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIucGF0aHMoW1snYScsICdiJ10sIFsncCcsIDAsICdxJ11dLCB7YToge2I6IDJ9LCBwOiBbe3E6IDN9XX0pOyAvLz0+IFsyLCAzXVxuICogICAgICBSLnBhdGhzKFtbJ2EnLCAnYiddLCBbJ3AnLCAnciddXSwge2E6IHtiOiAyfSwgcDogW3txOiAzfV19KTsgLy89PiBbMiwgdW5kZWZpbmVkXVxuICovXG5cbnZhciBwYXRocyA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkyKGZ1bmN0aW9uIHBhdGhzKHBhdGhzQXJyYXksIG9iaikge1xuICByZXR1cm4gcGF0aHNBcnJheS5tYXAoZnVuY3Rpb24gKHBhdGhzKSB7XG4gICAgdmFyIHZhbCA9IG9iajtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcDtcblxuICAgIHdoaWxlIChpZHggPCBwYXRocy5sZW5ndGgpIHtcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHAgPSBwYXRoc1tpZHhdO1xuICAgICAgdmFsID0gX2lzSW50ZWdlcihwKSA/IG50aChwLCB2YWwpIDogdmFsW3BdO1xuICAgICAgaWR4ICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcGF0aHM7IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IHBhdGhzIGZyb20gXCIuL3BhdGhzLmpzXCI7XG4vKipcbiAqIFJldHJpZXZlIHRoZSB2YWx1ZSBhdCBhIGdpdmVuIHBhdGguXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gSWR4ID0gU3RyaW5nIHwgSW50XG4gKiBAc2lnIFtJZHhdIC0+IHthfSAtPiBhIHwgVW5kZWZpbmVkXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoIFRoZSBwYXRoIHRvIHVzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byByZXRyaWV2ZSB0aGUgbmVzdGVkIHByb3BlcnR5IGZyb20uXG4gKiBAcmV0dXJuIHsqfSBUaGUgZGF0YSBhdCBgcGF0aGAuXG4gKiBAc2VlIFIucHJvcCwgUi5udGhcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnBhdGgoWydhJywgJ2InXSwge2E6IHtiOiAyfX0pOyAvLz0+IDJcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJ10sIHtjOiB7YjogMn19KTsgLy89PiB1bmRlZmluZWRcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJywgMF0sIHthOiB7YjogWzEsIDIsIDNdfX0pOyAvLz0+IDFcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJywgLTJdLCB7YToge2I6IFsxLCAyLCAzXX19KTsgLy89PiAyXG4gKi9cblxudmFyIHBhdGggPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBwYXRoKHBhdGhBciwgb2JqKSB7XG4gIHJldHVybiBwYXRocyhbcGF0aEFyXSwgb2JqKVswXTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBwYXRoOyIsImltcG9ydCBfY3VycnkzIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTMuanNcIjtcbi8qKlxuICogTWFrZXMgYSBzaGFsbG93IGNsb25lIG9mIGFuIG9iamVjdCwgc2V0dGluZyBvciBvdmVycmlkaW5nIHRoZSBzcGVjaWZpZWRcbiAqIHByb3BlcnR5IHdpdGggdGhlIGdpdmVuIHZhbHVlLiBOb3RlIHRoYXQgdGhpcyBjb3BpZXMgYW5kIGZsYXR0ZW5zIHByb3RvdHlwZVxuICogcHJvcGVydGllcyBvbnRvIHRoZSBuZXcgb2JqZWN0IGFzIHdlbGwuIEFsbCBub24tcHJpbWl0aXZlIHByb3BlcnRpZXMgYXJlXG4gKiBjb3BpZWQgYnkgcmVmZXJlbmNlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyBTdHJpbmcgLT4gYSAtPiB7azogdn0gLT4ge2s6IHZ9XG4gKiBAcGFyYW0ge1N0cmluZ30gcHJvcCBUaGUgcHJvcGVydHkgbmFtZSB0byBzZXRcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBuZXcgdmFsdWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBjbG9uZVxuICogQHJldHVybiB7T2JqZWN0fSBBIG5ldyBvYmplY3QgZXF1aXZhbGVudCB0byB0aGUgb3JpZ2luYWwgZXhjZXB0IGZvciB0aGUgY2hhbmdlZCBwcm9wZXJ0eS5cbiAqIEBzZWUgUi5kaXNzb2MsIFIucGlja1xuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuYXNzb2MoJ2MnLCAzLCB7YTogMSwgYjogMn0pOyAvLz0+IHthOiAxLCBiOiAyLCBjOiAzfVxuICovXG5cbnZhciBhc3NvYyA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkzKGZ1bmN0aW9uIGFzc29jKHByb3AsIHZhbCwgb2JqKSB7XG4gIHZhciByZXN1bHQgPSB7fTtcblxuICBmb3IgKHZhciBwIGluIG9iaikge1xuICAgIHJlc3VsdFtwXSA9IG9ialtwXTtcbiAgfVxuXG4gIHJlc3VsdFtwcm9wXSA9IHZhbDtcbiAgcmV0dXJuIHJlc3VsdDtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBhc3NvYzsiLCJpbXBvcnQgX2N1cnJ5MSBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkxLmpzXCI7XG4vKipcbiAqIENoZWNrcyBpZiB0aGUgaW5wdXQgdmFsdWUgaXMgYG51bGxgIG9yIGB1bmRlZmluZWRgLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjkuMFxuICogQGNhdGVnb3J5IFR5cGVcbiAqIEBzaWcgKiAtPiBCb29sZWFuXG4gKiBAcGFyYW0geyp9IHggVGhlIHZhbHVlIHRvIHRlc3QuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBgdHJ1ZWAgaWYgYHhgIGlzIGB1bmRlZmluZWRgIG9yIGBudWxsYCwgb3RoZXJ3aXNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5pc05pbChudWxsKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaXNOaWwodW5kZWZpbmVkKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaXNOaWwoMCk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pc05pbChbXSk7IC8vPT4gZmFsc2VcbiAqL1xuXG52YXIgaXNOaWwgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MShmdW5jdGlvbiBpc05pbCh4KSB7XG4gIHJldHVybiB4ID09IG51bGw7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgaXNOaWw7IiwiaW1wb3J0IF9jdXJyeTMgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5My5qc1wiO1xuaW1wb3J0IF9oYXMgZnJvbSBcIi4vaW50ZXJuYWwvX2hhcy5qc1wiO1xuaW1wb3J0IF9pc0FycmF5IGZyb20gXCIuL2ludGVybmFsL19pc0FycmF5LmpzXCI7XG5pbXBvcnQgX2lzSW50ZWdlciBmcm9tIFwiLi9pbnRlcm5hbC9faXNJbnRlZ2VyLmpzXCI7XG5pbXBvcnQgYXNzb2MgZnJvbSBcIi4vYXNzb2MuanNcIjtcbmltcG9ydCBpc05pbCBmcm9tIFwiLi9pc05pbC5qc1wiO1xuLyoqXG4gKiBNYWtlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYW4gb2JqZWN0LCBzZXR0aW5nIG9yIG92ZXJyaWRpbmcgdGhlIG5vZGVzIHJlcXVpcmVkXG4gKiB0byBjcmVhdGUgdGhlIGdpdmVuIHBhdGgsIGFuZCBwbGFjaW5nIHRoZSBzcGVjaWZpYyB2YWx1ZSBhdCB0aGUgdGFpbCBlbmQgb2ZcbiAqIHRoYXQgcGF0aC4gTm90ZSB0aGF0IHRoaXMgY29waWVzIGFuZCBmbGF0dGVucyBwcm90b3R5cGUgcHJvcGVydGllcyBvbnRvIHRoZVxuICogbmV3IG9iamVjdCBhcyB3ZWxsLiBBbGwgbm9uLXByaW1pdGl2ZSBwcm9wZXJ0aWVzIGFyZSBjb3BpZWQgYnkgcmVmZXJlbmNlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIElkeCA9IFN0cmluZyB8IEludFxuICogQHNpZyBbSWR4XSAtPiBhIC0+IHthfSAtPiB7YX1cbiAqIEBwYXJhbSB7QXJyYXl9IHBhdGggdGhlIHBhdGggdG8gc2V0XG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgbmV3IHZhbHVlXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gY2xvbmVcbiAqIEByZXR1cm4ge09iamVjdH0gQSBuZXcgb2JqZWN0IGVxdWl2YWxlbnQgdG8gdGhlIG9yaWdpbmFsIGV4Y2VwdCBhbG9uZyB0aGUgc3BlY2lmaWVkIHBhdGguXG4gKiBAc2VlIFIuZGlzc29jUGF0aFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuYXNzb2NQYXRoKFsnYScsICdiJywgJ2MnXSwgNDIsIHthOiB7Yjoge2M6IDB9fX0pOyAvLz0+IHthOiB7Yjoge2M6IDQyfX19XG4gKlxuICogICAgICAvLyBBbnkgbWlzc2luZyBvciBub24tb2JqZWN0IGtleXMgaW4gcGF0aCB3aWxsIGJlIG92ZXJyaWRkZW5cbiAqICAgICAgUi5hc3NvY1BhdGgoWydhJywgJ2InLCAnYyddLCA0Miwge2E6IDV9KTsgLy89PiB7YToge2I6IHtjOiA0Mn19fVxuICovXG5cbnZhciBhc3NvY1BhdGggPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MyhmdW5jdGlvbiBhc3NvY1BhdGgocGF0aCwgdmFsLCBvYmopIHtcbiAgaWYgKHBhdGgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHZhbDtcbiAgfVxuXG4gIHZhciBpZHggPSBwYXRoWzBdO1xuXG4gIGlmIChwYXRoLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgbmV4dE9iaiA9ICFpc05pbChvYmopICYmIF9oYXMoaWR4LCBvYmopID8gb2JqW2lkeF0gOiBfaXNJbnRlZ2VyKHBhdGhbMV0pID8gW10gOiB7fTtcbiAgICB2YWwgPSBhc3NvY1BhdGgoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwocGF0aCwgMSksIHZhbCwgbmV4dE9iaik7XG4gIH1cblxuICBpZiAoX2lzSW50ZWdlcihpZHgpICYmIF9pc0FycmF5KG9iaikpIHtcbiAgICB2YXIgYXJyID0gW10uY29uY2F0KG9iaik7XG4gICAgYXJyW2lkeF0gPSB2YWw7XG4gICAgcmV0dXJuIGFycjtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYXNzb2MoaWR4LCB2YWwsIG9iaik7XG4gIH1cbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBhc3NvY1BhdGg7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2Nsb25lUmVnRXhwKHBhdHRlcm4pIHtcbiAgcmV0dXJuIG5ldyBSZWdFeHAocGF0dGVybi5zb3VyY2UsIChwYXR0ZXJuLmdsb2JhbCA/ICdnJyA6ICcnKSArIChwYXR0ZXJuLmlnbm9yZUNhc2UgPyAnaScgOiAnJykgKyAocGF0dGVybi5tdWx0aWxpbmUgPyAnbScgOiAnJykgKyAocGF0dGVybi5zdGlja3kgPyAneScgOiAnJykgKyAocGF0dGVybi51bmljb2RlID8gJ3UnIDogJycpKTtcbn0iLCJpbXBvcnQgX2N1cnJ5MSBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkxLmpzXCI7XG4vKipcbiAqIEdpdmVzIGEgc2luZ2xlLXdvcmQgc3RyaW5nIGRlc2NyaXB0aW9uIG9mIHRoZSAobmF0aXZlKSB0eXBlIG9mIGEgdmFsdWUsXG4gKiByZXR1cm5pbmcgc3VjaCBhbnN3ZXJzIGFzICdPYmplY3QnLCAnTnVtYmVyJywgJ0FycmF5Jywgb3IgJ051bGwnLiBEb2VzIG5vdFxuICogYXR0ZW1wdCB0byBkaXN0aW5ndWlzaCB1c2VyIE9iamVjdCB0eXBlcyBhbnkgZnVydGhlciwgcmVwb3J0aW5nIHRoZW0gYWxsIGFzXG4gKiAnT2JqZWN0Jy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC44LjBcbiAqIEBjYXRlZ29yeSBUeXBlXG4gKiBAc2lnICgqIC0+IHsqfSkgLT4gU3RyaW5nXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIudHlwZSh7fSk7IC8vPT4gXCJPYmplY3RcIlxuICogICAgICBSLnR5cGUoMSk7IC8vPT4gXCJOdW1iZXJcIlxuICogICAgICBSLnR5cGUoZmFsc2UpOyAvLz0+IFwiQm9vbGVhblwiXG4gKiAgICAgIFIudHlwZSgncycpOyAvLz0+IFwiU3RyaW5nXCJcbiAqICAgICAgUi50eXBlKG51bGwpOyAvLz0+IFwiTnVsbFwiXG4gKiAgICAgIFIudHlwZShbXSk7IC8vPT4gXCJBcnJheVwiXG4gKiAgICAgIFIudHlwZSgvW0Etel0vKTsgLy89PiBcIlJlZ0V4cFwiXG4gKiAgICAgIFIudHlwZSgoKSA9PiB7fSk7IC8vPT4gXCJGdW5jdGlvblwiXG4gKiAgICAgIFIudHlwZSh1bmRlZmluZWQpOyAvLz0+IFwiVW5kZWZpbmVkXCJcbiAqL1xuXG52YXIgdHlwZSA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkxKGZ1bmN0aW9uIHR5cGUodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IG51bGwgPyAnTnVsbCcgOiB2YWwgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkuc2xpY2UoOCwgLTEpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGU7IiwiaW1wb3J0IF9jbG9uZVJlZ0V4cCBmcm9tIFwiLi9fY2xvbmVSZWdFeHAuanNcIjtcbmltcG9ydCB0eXBlIGZyb20gXCIuLi90eXBlLmpzXCI7XG4vKipcbiAqIENvcGllcyBhbiBvYmplY3QuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGJlIGNvcGllZFxuICogQHBhcmFtIHtBcnJheX0gcmVmRnJvbSBBcnJheSBjb250YWluaW5nIHRoZSBzb3VyY2UgcmVmZXJlbmNlc1xuICogQHBhcmFtIHtBcnJheX0gcmVmVG8gQXJyYXkgY29udGFpbmluZyB0aGUgY29waWVkIHNvdXJjZSByZWZlcmVuY2VzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGRlZXAgV2hldGhlciBvciBub3QgdG8gcGVyZm9ybSBkZWVwIGNsb25pbmcuXG4gKiBAcmV0dXJuIHsqfSBUaGUgY29waWVkIHZhbHVlLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jbG9uZSh2YWx1ZSwgcmVmRnJvbSwgcmVmVG8sIGRlZXApIHtcbiAgdmFyIGNvcHkgPSBmdW5jdGlvbiBjb3B5KGNvcGllZFZhbHVlKSB7XG4gICAgdmFyIGxlbiA9IHJlZkZyb20ubGVuZ3RoO1xuICAgIHZhciBpZHggPSAwO1xuXG4gICAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgICAgaWYgKHZhbHVlID09PSByZWZGcm9tW2lkeF0pIHtcbiAgICAgICAgcmV0dXJuIHJlZlRvW2lkeF07XG4gICAgICB9XG5cbiAgICAgIGlkeCArPSAxO1xuICAgIH1cblxuICAgIHJlZkZyb21baWR4ICsgMV0gPSB2YWx1ZTtcbiAgICByZWZUb1tpZHggKyAxXSA9IGNvcGllZFZhbHVlO1xuXG4gICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICBjb3BpZWRWYWx1ZVtrZXldID0gZGVlcCA/IF9jbG9uZSh2YWx1ZVtrZXldLCByZWZGcm9tLCByZWZUbywgdHJ1ZSkgOiB2YWx1ZVtrZXldO1xuICAgIH1cblxuICAgIHJldHVybiBjb3BpZWRWYWx1ZTtcbiAgfTtcblxuICBzd2l0Y2ggKHR5cGUodmFsdWUpKSB7XG4gICAgY2FzZSAnT2JqZWN0JzpcbiAgICAgIHJldHVybiBjb3B5KHt9KTtcblxuICAgIGNhc2UgJ0FycmF5JzpcbiAgICAgIHJldHVybiBjb3B5KFtdKTtcblxuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlLnZhbHVlT2YoKSk7XG5cbiAgICBjYXNlICdSZWdFeHAnOlxuICAgICAgcmV0dXJuIF9jbG9uZVJlZ0V4cCh2YWx1ZSk7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICB9XG59IiwiaW1wb3J0IF9jbG9uZSBmcm9tIFwiLi9pbnRlcm5hbC9fY2xvbmUuanNcIjtcbmltcG9ydCBfY3VycnkxIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTEuanNcIjtcbi8qKlxuICogQ3JlYXRlcyBhIGRlZXAgY29weSBvZiB0aGUgdmFsdWUgd2hpY2ggbWF5IGNvbnRhaW4gKG5lc3RlZCkgYEFycmF5YHMgYW5kXG4gKiBgT2JqZWN0YHMsIGBOdW1iZXJgcywgYFN0cmluZ2BzLCBgQm9vbGVhbmBzIGFuZCBgRGF0ZWBzLiBgRnVuY3Rpb25gcyBhcmVcbiAqIGFzc2lnbmVkIGJ5IHJlZmVyZW5jZSByYXRoZXIgdGhhbiBjb3BpZWRcbiAqXG4gKiBEaXNwYXRjaGVzIHRvIGEgYGNsb25lYCBtZXRob2QgaWYgcHJlc2VudC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcgeyp9IC0+IHsqfVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgb2JqZWN0IG9yIGFycmF5IHRvIGNsb25lXG4gKiBAcmV0dXJuIHsqfSBBIGRlZXBseSBjbG9uZWQgY29weSBvZiBgdmFsYFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIGNvbnN0IG9iamVjdHMgPSBbe30sIHt9LCB7fV07XG4gKiAgICAgIGNvbnN0IG9iamVjdHNDbG9uZSA9IFIuY2xvbmUob2JqZWN0cyk7XG4gKiAgICAgIG9iamVjdHMgPT09IG9iamVjdHNDbG9uZTsgLy89PiBmYWxzZVxuICogICAgICBvYmplY3RzWzBdID09PSBvYmplY3RzQ2xvbmVbMF07IC8vPT4gZmFsc2VcbiAqL1xuXG52YXIgY2xvbmUgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MShmdW5jdGlvbiBjbG9uZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUuY2xvbmUgPT09ICdmdW5jdGlvbicgPyB2YWx1ZS5jbG9uZSgpIDogX2Nsb25lKHZhbHVlLCBbXSwgW10sIHRydWUpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGNsb25lOyIsImltcG9ydCBfY3VycnkyIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTIuanNcIjtcbmltcG9ydCBtYXAgZnJvbSBcIi4vbWFwLmpzXCI7XG4vKipcbiAqIFJldHVybnMgYSBsZW5zIGZvciB0aGUgZ2l2ZW4gZ2V0dGVyIGFuZCBzZXR0ZXIgZnVuY3Rpb25zLiBUaGUgZ2V0dGVyIFwiZ2V0c1wiXG4gKiB0aGUgdmFsdWUgb2YgdGhlIGZvY3VzOyB0aGUgc2V0dGVyIFwic2V0c1wiIHRoZSB2YWx1ZSBvZiB0aGUgZm9jdXMuIFRoZSBzZXR0ZXJcbiAqIHNob3VsZCBub3QgbXV0YXRlIHRoZSBkYXRhIHN0cnVjdHVyZS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC44LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIChzIC0+IGEpIC0+ICgoYSwgcykgLT4gcykgLT4gTGVucyBzIGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGdldHRlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gc2V0dGVyXG4gKiBAcmV0dXJuIHtMZW5zfVxuICogQHNlZSBSLnZpZXcsIFIuc2V0LCBSLm92ZXIsIFIubGVuc0luZGV4LCBSLmxlbnNQcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgeExlbnMgPSBSLmxlbnMoUi5wcm9wKCd4JyksIFIuYXNzb2MoJ3gnKSk7XG4gKlxuICogICAgICBSLnZpZXcoeExlbnMsIHt4OiAxLCB5OiAyfSk7ICAgICAgICAgICAgLy89PiAxXG4gKiAgICAgIFIuc2V0KHhMZW5zLCA0LCB7eDogMSwgeTogMn0pOyAgICAgICAgICAvLz0+IHt4OiA0LCB5OiAyfVxuICogICAgICBSLm92ZXIoeExlbnMsIFIubmVnYXRlLCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogLTEsIHk6IDJ9XG4gKi9cblxudmFyIGxlbnMgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBsZW5zKGdldHRlciwgc2V0dGVyKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodG9GdW5jdG9yRm4pIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHRhcmdldCkge1xuICAgICAgcmV0dXJuIG1hcChmdW5jdGlvbiAoZm9jdXMpIHtcbiAgICAgICAgcmV0dXJuIHNldHRlcihmb2N1cywgdGFyZ2V0KTtcbiAgICAgIH0sIHRvRnVuY3RvckZuKGdldHRlcih0YXJnZXQpKSk7XG4gICAgfTtcbiAgfTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBsZW5zOyIsImltcG9ydCBfY3VycnkxIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTEuanNcIjtcbmltcG9ydCBhc3NvY1BhdGggZnJvbSBcIi4vYXNzb2NQYXRoLmpzXCI7XG5pbXBvcnQgbGVucyBmcm9tIFwiLi9sZW5zLmpzXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwiLi9wYXRoLmpzXCI7XG4vKipcbiAqIFJldHVybnMgYSBsZW5zIHdob3NlIGZvY3VzIGlzIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xOS4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gSWR4ID0gU3RyaW5nIHwgSW50XG4gKiBAdHlwZWRlZm4gTGVucyBzIGEgPSBGdW5jdG9yIGYgPT4gKGEgLT4gZiBhKSAtPiBzIC0+IGYgc1xuICogQHNpZyBbSWR4XSAtPiBMZW5zIHMgYVxuICogQHBhcmFtIHtBcnJheX0gcGF0aCBUaGUgcGF0aCB0byB1c2UuXG4gKiBAcmV0dXJuIHtMZW5zfVxuICogQHNlZSBSLnZpZXcsIFIuc2V0LCBSLm92ZXJcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBjb25zdCB4SGVhZFlMZW5zID0gUi5sZW5zUGF0aChbJ3gnLCAwLCAneSddKTtcbiAqXG4gKiAgICAgIFIudmlldyh4SGVhZFlMZW5zLCB7eDogW3t5OiAyLCB6OiAzfSwge3k6IDQsIHo6IDV9XX0pO1xuICogICAgICAvLz0+IDJcbiAqICAgICAgUi5zZXQoeEhlYWRZTGVucywgMSwge3g6IFt7eTogMiwgejogM30sIHt5OiA0LCB6OiA1fV19KTtcbiAqICAgICAgLy89PiB7eDogW3t5OiAxLCB6OiAzfSwge3k6IDQsIHo6IDV9XX1cbiAqICAgICAgUi5vdmVyKHhIZWFkWUxlbnMsIFIubmVnYXRlLCB7eDogW3t5OiAyLCB6OiAzfSwge3k6IDQsIHo6IDV9XX0pO1xuICogICAgICAvLz0+IHt4OiBbe3k6IC0yLCB6OiAzfSwge3k6IDQsIHo6IDV9XX1cbiAqL1xuXG52YXIgbGVuc1BhdGggPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MShmdW5jdGlvbiBsZW5zUGF0aChwKSB7XG4gIHJldHVybiBsZW5zKHBhdGgocCksIGFzc29jUGF0aChwKSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgbGVuc1BhdGg7IiwiaW1wb3J0IF9jdXJyeTMgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5My5qc1wiOyAvLyBgSWRlbnRpdHlgIGlzIGEgZnVuY3RvciB0aGF0IGhvbGRzIGEgc2luZ2xlIHZhbHVlLCB3aGVyZSBgbWFwYCBzaW1wbHlcbi8vIHRyYW5zZm9ybXMgdGhlIGhlbGQgdmFsdWUgd2l0aCB0aGUgcHJvdmlkZWQgZnVuY3Rpb24uXG5cbnZhciBJZGVudGl0eSA9IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiB7XG4gICAgdmFsdWU6IHgsXG4gICAgbWFwOiBmdW5jdGlvbiAoZikge1xuICAgICAgcmV0dXJuIElkZW50aXR5KGYoeCkpO1xuICAgIH1cbiAgfTtcbn07XG4vKipcbiAqIFJldHVybnMgdGhlIHJlc3VsdCBvZiBcInNldHRpbmdcIiB0aGUgcG9ydGlvbiBvZiB0aGUgZ2l2ZW4gZGF0YSBzdHJ1Y3R1cmVcbiAqIGZvY3VzZWQgYnkgdGhlIGdpdmVuIGxlbnMgdG8gdGhlIHJlc3VsdCBvZiBhcHBseWluZyB0aGUgZ2l2ZW4gZnVuY3Rpb24gdG9cbiAqIHRoZSBmb2N1c2VkIHZhbHVlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE2LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIExlbnMgcyBhIC0+IChhIC0+IGEpIC0+IHMgLT4gc1xuICogQHBhcmFtIHtMZW5zfSBsZW5zXG4gKiBAcGFyYW0geyp9IHZcbiAqIEBwYXJhbSB7Kn0geFxuICogQHJldHVybiB7Kn1cbiAqIEBzZWUgUi5wcm9wLCBSLmxlbnNJbmRleCwgUi5sZW5zUHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIGNvbnN0IGhlYWRMZW5zID0gUi5sZW5zSW5kZXgoMCk7XG4gKlxuICogICAgICBSLm92ZXIoaGVhZExlbnMsIFIudG9VcHBlciwgWydmb28nLCAnYmFyJywgJ2JheiddKTsgLy89PiBbJ0ZPTycsICdiYXInLCAnYmF6J11cbiAqL1xuXG5cbnZhciBvdmVyID1cbi8qI19fUFVSRV9fKi9cbl9jdXJyeTMoZnVuY3Rpb24gb3ZlcihsZW5zLCBmLCB4KSB7XG4gIC8vIFRoZSB2YWx1ZSByZXR1cm5lZCBieSB0aGUgZ2V0dGVyIGZ1bmN0aW9uIGlzIGZpcnN0IHRyYW5zZm9ybWVkIHdpdGggYGZgLFxuICAvLyB0aGVuIHNldCBhcyB0aGUgdmFsdWUgb2YgYW4gYElkZW50aXR5YC4gVGhpcyBpcyB0aGVuIG1hcHBlZCBvdmVyIHdpdGggdGhlXG4gIC8vIHNldHRlciBmdW5jdGlvbiBvZiB0aGUgbGVucy5cbiAgcmV0dXJuIGxlbnMoZnVuY3Rpb24gKHkpIHtcbiAgICByZXR1cm4gSWRlbnRpdHkoZih5KSk7XG4gIH0pKHgpLnZhbHVlO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG92ZXI7IiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSBcInJ4anNcIjtcbmltcG9ydCB7IG92ZXIsIGxlbnNQYXRoIH0gZnJvbSAncmFtZGEnO1xuXG5pbXBvcnQgeyBCYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlIH0gZnJvbSBcIi4uL3R5cGVcIjtcblxuZnVuY3Rpb24gYWRkPFQgZXh0ZW5kcyBCYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihzdG9yZSQ6IEJlaGF2aW9yU3ViamVjdDxQYWdlRW5naW5lVjIuTGF5ZXI8VD5bXT4sIGxheWVyOiBQYWdlRW5naW5lVjIuTGF5ZXI8VD4pOiB2b2lkIHtcbiAgc3RvcmUkLm5leHQoWy4uLnN0b3JlJC52YWx1ZSwgbGF5ZXJdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMgQmFzZUJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZT4obGF5ZXJzPzogUGFnZUVuZ2luZVYyLkxheWVyPFQ+W10pOiBCZWhhdmlvclN1YmplY3Q8UGFnZUVuZ2luZVYyLkxheWVyPFQ+W10+IHtcbiAgcmV0dXJuIG5ldyBCZWhhdmlvclN1YmplY3Q8UGFnZUVuZ2luZVYyLkxheWVyPFQ+W10+KGxheWVycyA/PyBbXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXQ8VCBleHRlbmRzIEJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHN0b3JlJDogQmVoYXZpb3JTdWJqZWN0PFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdPiwgbGF5ZXJzOiBQYWdlRW5naW5lVjIuTGF5ZXI8VD5bXSk6IHZvaWQge1xuICBzdG9yZSQubmV4dChsYXllcnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0cnlMYXllcnM8VCBleHRlbmRzIEJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHN0b3JlJDogQmVoYXZpb3JTdWJqZWN0PFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdPiwgbGF5ZXJzOiBQYWdlRW5naW5lVjIuTGF5ZXI8VD5bXSk6IHZvaWQge1xuICBsYXllcnMuZm9yRWFjaChsYXllciA9PiBhZGQ8VD4oc3RvcmUkLCBsYXllcikpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0TGF5ZXJCeUluZGV4PFQgZXh0ZW5kcyBCYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihzdG9yZSQ6IEJlaGF2aW9yU3ViamVjdDxQYWdlRW5naW5lVjIuTGF5ZXI8VD5bXT4sIGxheWVyOiBQYWdlRW5naW5lVjIuTGF5ZXI8VD4sIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgc2V0KHN0b3JlJCwgb3ZlcihsZW5zUGF0aChbaW5kZXhdKSwgKCkgPT4gbGF5ZXIsIHN0b3JlJC52YWx1ZSkpO1xufVxuIiwiaW1wb3J0IHR5cGUgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCBSZWFjdCwgeyBGcmFnbWVudCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IExheWVyIGZyb20gJy4vY29tcG9uZW50cy9sYXllcic7XG5pbXBvcnQgeyB1c2VPYnNlcnZhYmxlIH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgeyBzZXRMYXllckJ5SW5kZXggfSBmcm9tICcuL3N0b3Jlcy9sYXllcic7XG5cbmludGVyZmFjZSBQcm9wczxUIGV4dGVuZHMgUGFnZUVuZ2luZVYyLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+IHtcbiAgbGF5ZXJzU3RvcmUkOiBCZWhhdmlvclN1YmplY3Q8UGFnZUVuZ2luZVYyLkxheWVyPFQ+W10+O1xuICBlbmdpbmVJZDogc3RyaW5nO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBDb3JlPFQgZXh0ZW5kcyBQYWdlRW5naW5lVjIuQmFzZUJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZT4oeyBsYXllcnNTdG9yZSQsIGVuZ2luZUlkIH06IFByb3BzPFQ+KTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBsYXllcnMgPSB1c2VPYnNlcnZhYmxlPFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdPihsYXllcnNTdG9yZSQsIFtdKTtcblxuICBmdW5jdGlvbiBnZXRTZXRMYXllcihpbmRleDogbnVtYmVyKTogKHRyYW5zZmVyOiBQYWdlRW5naW5lVjIuTGF5ZXJUcmFuc2ZlcjxUPikgPT4gdm9pZCB7XG4gICAgcmV0dXJuICh0cmFuc2ZlcjogUGFnZUVuZ2luZVYyLkxheWVyVHJhbnNmZXI8VD4pID0+IHtcbiAgICAgIHNldExheWVyQnlJbmRleChsYXllcnNTdG9yZSQsIHRyYW5zZmVyKGxheWVyc1tpbmRleF0pLCBpbmRleCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8RnJhZ21lbnQ+XG4gICAgICB7bGF5ZXJzLm1hcCgobGF5ZXIsIGluZGV4KSA9PiAoXG4gICAgICAgIDxMYXllcjxUPiB7Li4ubGF5ZXJ9IGtleT17aW5kZXh9IHpJbmRleD17aW5kZXh9IGVuZ2luZUlkPXtlbmdpbmVJZH0gc2V0TGF5ZXI9e2dldFNldExheWVyKGluZGV4KX0gLz5cbiAgICAgICkpfVxuICAgIDwvRnJhZ21lbnQ+XG4gIClcbn1cbiIsImltcG9ydCB7IHVybEFscGhhYmV0IH0gZnJvbSAnLi91cmwtYWxwaGFiZXQvaW5kZXguanMnXG5sZXQgcmFuZG9tID0gYnl0ZXMgPT4gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShieXRlcykpXG5sZXQgY3VzdG9tUmFuZG9tID0gKGFscGhhYmV0LCBkZWZhdWx0U2l6ZSwgZ2V0UmFuZG9tKSA9PiB7XG4gIGxldCBtYXNrID0gKDIgPDwgKE1hdGgubG9nKGFscGhhYmV0Lmxlbmd0aCAtIDEpIC8gTWF0aC5MTjIpKSAtIDFcbiAgbGV0IHN0ZXAgPSAtfigoMS42ICogbWFzayAqIGRlZmF1bHRTaXplKSAvIGFscGhhYmV0Lmxlbmd0aClcbiAgcmV0dXJuIChzaXplID0gZGVmYXVsdFNpemUpID0+IHtcbiAgICBsZXQgaWQgPSAnJ1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBsZXQgYnl0ZXMgPSBnZXRSYW5kb20oc3RlcClcbiAgICAgIGxldCBqID0gc3RlcFxuICAgICAgd2hpbGUgKGotLSkge1xuICAgICAgICBpZCArPSBhbHBoYWJldFtieXRlc1tqXSAmIG1hc2tdIHx8ICcnXG4gICAgICAgIGlmIChpZC5sZW5ndGggPT09IHNpemUpIHJldHVybiBpZFxuICAgICAgfVxuICAgIH1cbiAgfVxufVxubGV0IGN1c3RvbUFscGhhYmV0ID0gKGFscGhhYmV0LCBzaXplID0gMjEpID0+XG4gIGN1c3RvbVJhbmRvbShhbHBoYWJldCwgc2l6ZSwgcmFuZG9tKVxubGV0IG5hbm9pZCA9IChzaXplID0gMjEpID0+IHtcbiAgbGV0IGlkID0gJydcbiAgbGV0IGJ5dGVzID0gY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSlcbiAgd2hpbGUgKHNpemUtLSkge1xuICAgIGxldCBieXRlID0gYnl0ZXNbc2l6ZV0gJiA2M1xuICAgIGlmIChieXRlIDwgMzYpIHtcbiAgICAgIGlkICs9IGJ5dGUudG9TdHJpbmcoMzYpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjIpIHtcbiAgICAgIGlkICs9IChieXRlIC0gMjYpLnRvU3RyaW5nKDM2KS50b1VwcGVyQ2FzZSgpXG4gICAgfSBlbHNlIGlmIChieXRlIDwgNjMpIHtcbiAgICAgIGlkICs9ICdfJ1xuICAgIH0gZWxzZSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlkXG59XG5leHBvcnQgeyBuYW5vaWQsIGN1c3RvbUFscGhhYmV0LCBjdXN0b21SYW5kb20sIHVybEFscGhhYmV0LCByYW5kb20gfVxuIiwiaW1wb3J0IHsgY3VzdG9tQWxwaGFiZXQgfSBmcm9tICduYW5vaWQnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBSZW5kZXJFbmdpbmUgZnJvbSAnQG9uZS1mb3ItYWxsL3JlbmRlci1lbmdpbmUnO1xuaW1wb3J0IHsgSFRNTE5vZGUsIFJlYWN0Q29tcG9uZW50Tm9kZSwgTG9vcENvbnRhaW5lck5vZGUsIFJvdXRlTm9kZSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9zY2hlbWEtc3BlYyc7XG5pbXBvcnQgeyBvdmVyLCBsZW5zUGF0aCB9IGZyb20gJ3JhbWRhJztcblxuZXhwb3J0IGNvbnN0IHV1aWQgPSBjdXN0b21BbHBoYWJldCgnMTIzNDU2Nzg5MHF3ZXJ0eXVpb3Bsa2poZ2Zkc2F6eGN2Ym5tUVdFUlRZVUlPUExLSkhHRkRTQVpYQ1ZCTk0nLCA4KTtcblxuZXhwb3J0IGludGVyZmFjZSBMb2FkUGFja2NhZ2VQcm9wcyB7XG4gIHBhY2thZ2VOYW1lOiBzdHJpbmc7XG4gIHBhY2thZ2VWZXJzaW9uOiBzdHJpbmc7XG4gIGV4cG9ydE5hbWU6IHN0cmluZztcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2FkUGFja2FnZTxUPih7IHBhY2thZ2VOYW1lLCBwYWNrYWdlVmVyc2lvbiwgZXhwb3J0TmFtZSB9OiBMb2FkUGFja2NhZ2VQcm9wcywgZGVmYXVsdFZhbHVlOiBUKTogUHJvbWlzZTxUPiB7XG4gIHRyeSB7XG4gICAgY29uc3QgcGFja2FnZVBhdGggPSBwYWNrYWdlVmVyc2lvbiA/IGAke3BhY2thZ2VOYW1lfUAke3BhY2thZ2VWZXJzaW9ufWAgOiBwYWNrYWdlTmFtZTtcbiAgICBjb25zdCBjb21wb25lbnQgPSBhd2FpdCBTeXN0ZW0uaW1wb3J0KHBhY2thZ2VQYXRoKTtcbiAgICByZXR1cm4gY29tcG9uZW50W2V4cG9ydE5hbWVdO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiBkZWZhdWx0VmFsdWU7XG4gIH1cbn1cblxuaW50ZXJmYWNlIFJlbmRlclNjaGVtYVByb3BzIHtcbiAgc2NoZW1hOiBQYWdlRW5naW5lVjIuU2NoZW1hO1xuICBlbGVtZW50SWQ6IHN0cmluZztcbn1cbmV4cG9ydCBmdW5jdGlvbiBSZW5kZXJTY2hlbWEoeyBzY2hlbWEsIGVsZW1lbnRJZCB9OiBSZW5kZXJTY2hlbWFQcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgcmVuZGVyRW5naW5lID0gbmV3IFJlbmRlckVuZ2luZShzY2hlbWEpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudElkKTtcbiAgICBpZiAoZWwpIHtcbiAgICAgIHJlbmRlckVuZ2luZS5yZW5kZXIoZWwpLmNhdGNoKCgpID0+IHt9KTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgaWQ9e2VsZW1lbnRJZH0gc3R5bGU9e3tkaXNwbGF5OiAndW5zZXQnfX0gLz5cbiAgKVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNjaGVtYUNvbXBvbmVudCB7XG4gIGlkOiBzdHJpbmc7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIGxhYmVsPzogc3RyaW5nO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgUHJldmlldz86ICguLi5hcmdzOiBhbnlbXSkgPT4gSlNYLkVsZW1lbnQgfCBudWxsO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgUmVuZGVyPzogKC4uLmFyZ3M6IGFueVtdKSA9PiBKU1guRWxlbWVudCB8IG51bGw7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZENvbXBvbmVudHNGcm9tU2NoZW1hKHNjaGVtYTogUGFnZUVuZ2luZVYyLlNjaGVtYSk6IFByb21pc2U8U2NoZW1hQ29tcG9uZW50W10+IHtcbiAgY29uc3Qgbm9kZXM6IFBhZ2VFbmdpbmVWMi5TY2hlbWFOb2RlW10gPSBbXTtcbiAgdHJhdmVyc2VTY2hlbWEoc2NoZW1hLCBub2RlID0+IG5vZGVzLnB1c2gobm9kZSkpO1xuXG4gIGNvbnN0IGNvbXBvbmVudHNJblByb21pc2UgPSBub2Rlcy5tYXAoYXN5bmMgbm9kZSA9PiB7XG4gICAgY29uc3QgaWQgPSBgJHtub2RlLmlkfWA7XG4gICAgaWYgKG5vZGUudHlwZSA9PT0gJ3JlYWN0LWNvbXBvbmVudCcpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZVxuICAgICAgY29uc3QgUmVuZGVyID0gYXdhaXQgbG9hZFBhY2thZ2U8KC4uLmFyZ3M6IGFueVtdKSA9PiBKU1guRWxlbWVudCB8IG51bGw+KG5vZGUsICgpID0+IG51bGwpO1xuICAgICAgcmV0dXJuIHsgaWQsIFJlbmRlciB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbiAgICAvLyByZXR1cm4geyBpZCwgUmVuZGVyOiAoKSA9PiA8UmVuZGVyU2NoZW1hIHNjaGVtYT17ey4uLnNjaGVtYSwgbm9kZX19IGVsZW1lbnRJZD17aWR9IC8+IH1cbiAgfSkuZmlsdGVyKEJvb2xlYW4pIGFzIFByb21pc2U8U2NoZW1hQ29tcG9uZW50PltdO1xuXG4gIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChjb21wb25lbnRzSW5Qcm9taXNlKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBUcmF2ZXJzZVNjaGVtYU9wdGlvbiB7XG4gIGxldmVsOiBudW1iZXI7XG4gIHBhcmVudE5vZGU/OiBQYWdlRW5naW5lVjIuU2NoZW1hTm9kZTtcbiAgcGF0aD86IHN0cmluZztcbn1cbmV4cG9ydCB0eXBlIE9uVHJhdmVyc2UgPSAobm9kZTogUGFnZUVuZ2luZVYyLlNjaGVtYU5vZGUsIHsgbGV2ZWwsIHBhcmVudE5vZGUsIHBhdGggfTogVHJhdmVyc2VTY2hlbWFPcHRpb24pID0+IHZvaWQ7XG5leHBvcnQgZnVuY3Rpb24gdHJhdmVyc2VTY2hlbWEoXG4gIHNjaGVtYTogUGFnZUVuZ2luZVYyLlNjaGVtYSxcbiAgY2FsbGJhY2s6IE9uVHJhdmVyc2UsXG4gIGxldmVsID0gMCxcbiAgcGFyZW50PzogUGFnZUVuZ2luZVYyLlNjaGVtYU5vZGUsXG4gIHBhdGg/OiBzdHJpbmcsXG4pOiB2b2lkIHtcbiAgY29uc3QgeyBub2RlIH0gPSBzY2hlbWFcbiAgY2FsbGJhY2sobm9kZSwgeyBsZXZlbCwgcGFyZW50Tm9kZTogcGFyZW50LCBwYXRoOiBwYXRoID8/ICdub2RlJyB9KTtcbiAgaWYgKHNjaGVtYU5vZGVXaXRoQ2hpbGRyZW4obm9kZSkpIHtcbiAgICBub2RlLmNoaWxkcmVuPy5mb3JFYWNoKChjaGlsZCwgaW5kZXgpID0+IHtcbiAgICAgIHRyYXZlcnNlU2NoZW1hKHsgbm9kZTogY2hpbGQgfSwgY2FsbGJhY2ssIGxldmVsICsgMSwgbm9kZSwgYCR7cGF0aCA/PyAnbm9kZSd9LmNoaWxkcmVuLiR7aW5kZXh9YClcbiAgICB9KTtcbiAgfVxuICBpZiAoc2NoZW1hTm9kZVdpdGhOb2RlKG5vZGUpICYmIG5vZGUubm9kZS50eXBlICE9PSAnY29tcG9zZWQtbm9kZScpIHtcbiAgICB0cmF2ZXJzZVNjaGVtYSh7IG5vZGU6IG5vZGUubm9kZSB9LCBjYWxsYmFjaywgbGV2ZWwgKyAxLCBub2RlLCBgJHtwYXRoID8/ICdub2RlJ30ubm9kZWApXG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVQYXJlbnRQYXRoRnJvbVNjaGVtYUJ5Tm9kZUlkKHNjaGVtYTogUGFnZUVuZ2luZVYyLlNjaGVtYSwgbm9kZUlEOiBzdHJpbmcpOiBzdHJpbmcgfCB1bmRlZmluZWQge1xuICBsZXQgbm9kZVBhdGg6IHN0cmluZyB8IHVuZGVmaW5lZFxuICB0cmF2ZXJzZVNjaGVtYShzY2hlbWEsIChub2RlLCB7IHBhdGggfSkgPT4ge1xuICAgIGlmIChub2RlLmlkID09PSBub2RlSUQpIHtcbiAgICAgIG5vZGVQYXRoID0gcGF0aDtcbiAgICB9XG4gIH0pXG5cbiAgcmV0dXJuIG5vZGVQYXRoID8gbm9kZVBhdGguc3BsaXQoJy4nKS5zbGljZSgwLCAtMSkuam9pbignLicpIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlTm9kZUZyb21TY2hlbWFCeU5vZGVJZChzY2hlbWE6IFBhZ2VFbmdpbmVWMi5TY2hlbWEsIG5vZGVJRDogc3RyaW5nKTogUGFnZUVuZ2luZVYyLlNjaGVtYSB7XG4gIGNvbnN0IG5vZGVQYXJlbnRQYXRoID0gZ2V0Tm9kZVBhcmVudFBhdGhGcm9tU2NoZW1hQnlOb2RlSWQoc2NoZW1hLCBub2RlSUQpO1xuICBpZiAobm9kZVBhcmVudFBhdGgpIHtcbiAgICByZXR1cm4gb3ZlcihcbiAgICAgIGxlbnNQYXRoKG5vZGVQYXJlbnRQYXRoLnNwbGl0KCcuJykpLFxuICAgICAgY2hpbGRyZW4gPT4gY2hpbGRyZW4uZmlsdGVyKChjaGlsZDogUGFnZUVuZ2luZVYyLlNjaGVtYU5vZGUpID0+IGNoaWxkLmlkICE9PSBub2RlSUQpLFxuICAgICAgc2NoZW1hXG4gICAgKTtcbiAgfVxuICByZXR1cm4gc2NoZW1hO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2NoZW1hTm9kZVdpdGhDaGlsZHJlbihub2RlOiBQYWdlRW5naW5lVjIuU2NoZW1hTm9kZSk6IG5vZGUgaXMgKEhUTUxOb2RlIHwgUmVhY3RDb21wb25lbnROb2RlKSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdodG1sLWVsZW1lbnQnIHx8IG5vZGUudHlwZSA9PT0gJ3JlYWN0LWNvbXBvbmVudCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2hlbWFOb2RlV2l0aE5vZGUobm9kZTogUGFnZUVuZ2luZVYyLlNjaGVtYU5vZGUpOiBub2RlIGlzIChSb3V0ZU5vZGUgfCBMb29wQ29udGFpbmVyTm9kZSkge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnbG9vcC1jb250YWluZXInIHx8IG5vZGUudHlwZSA9PT0gJ3JvdXRlLW5vZGUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlQWxsTm9kZUZyb21TY2hlbWEoc2NoZW1hOiBQYWdlRW5naW5lVjIuU2NoZW1hKTogUGFnZUVuZ2luZVYyLlNjaGVtYSB7XG4gIGNvbnN0IG5vZGVJRHM6IHN0cmluZ1tdID0gW107XG4gIHRyYXZlcnNlU2NoZW1hKHNjaGVtYSwgKG5vZGUsIHsgbGV2ZWwsIHBhcmVudE5vZGUsIHBhdGggfSkgPT4ge1xuICAgIGlmIChwYXJlbnROb2RlICYmIHNjaGVtYU5vZGVXaXRoQ2hpbGRyZW4ocGFyZW50Tm9kZSkpIHtcbiAgICAgIG5vZGVJRHMucHVzaChgJHtub2RlLmlkfWApO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBub2RlSURzLnJlZHVjZSgoc2NoZW1hQWNjLCBub2RlSUQpID0+IHJlbW92ZU5vZGVGcm9tU2NoZW1hQnlOb2RlSWQoc2NoZW1hQWNjLCBub2RlSUQpLCBzY2hlbWEpO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gXCJyZWFjdC1kb21cIjtcbmltcG9ydCB0eXBlIHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSBcInJ4anNcIjtcblxuaW1wb3J0IENvcmUgZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7IHV1aWQgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IHVzZVNjaGVtYSwgdXNlTGF5ZXJzLCB1c2VPYnNlcnZhYmxlIH0gZnJvbSAnLi9ob29rcyc7XG5pbXBvcnQgeyBjcmVhdGUgYXMgY3JlYXRlU2NoZW1hU3RvcmUgfSBmcm9tICcuL3N0b3Jlcy9zY2hlbWEnO1xuaW1wb3J0IHsgY3JlYXRlIGFzIGNyZWF0ZUxheWVyc1N0b3JlLCByZWdpc3RyeUxheWVycyB9IGZyb20gJy4vc3RvcmVzL2xheWVyJztcbmltcG9ydCB7IGNyZWF0ZSBhcyBjcmVhdGVFbmdpbmVTdG9yZSwgZ2V0Q29udGV4dCBhcyBnZXRFbmdpbmVTdG9yZUNvbnRleHQgfSBmcm9tICcuL3N0b3Jlcy9lbmdpbmUnO1xuXG5pbXBvcnQgJy4vc3R5bGVzL2luZGV4LnNjc3MnO1xuXG5pbnRlcmZhY2UgUHJvcHM8VCBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPiBleHRlbmRzIFBhZ2VFbmdpbmVWMi5Qcm9wczxUPiB7XG4gIGVuZ2luZUlkOiBzdHJpbmc7XG4gIHNldFNjaGVtYVN0b3JlOiAoc3RvcmU6IEJlaGF2aW9yU3ViamVjdDxTY2hlbWFTcGVjLlNjaGVtYT4pID0+IHZvaWQ7XG4gIHNldExheWVyc1N0b3JlOiAoc3RvcmU6IEJlaGF2aW9yU3ViamVjdDxQYWdlRW5naW5lVjIuTGF5ZXI8VD5bXT4pID0+IHZvaWQ7XG59XG5cbmZ1bmN0aW9uIEFwcDxUIGV4dGVuZHMgUGFnZUVuZ2luZVYyLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHsgc2NoZW1hLCBsYXllcnMsIHNldFNjaGVtYVN0b3JlLCBzZXRMYXllcnNTdG9yZSwgZW5naW5lSWQgfTogUHJvcHM8VD4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHNjaGVtYVN0b3JlJCA9IHVzZU1lbW8oKCkgPT4gY3JlYXRlU2NoZW1hU3RvcmUoc2NoZW1hKSwgW3NjaGVtYV0pO1xuICBjb25zdCBsYXllcnNTdG9yZSQgPSB1c2VNZW1vKCgpID0+IGNyZWF0ZUxheWVyc1N0b3JlKGxheWVycyksIFtsYXllcnNdKTtcbiAgY29uc3QgZW5naW5lU3RvcmUkID0gdXNlTWVtbygoKSA9PiBjcmVhdGVFbmdpbmVTdG9yZTxUPih7IHNjaGVtYVN0b3JlJCB9KSwgW3NjaGVtYVN0b3JlJF0pO1xuICBjb25zdCBFbmdpbmVTdG9yZUNvbnRleHQgPSB1c2VNZW1vKCgpID0+IGdldEVuZ2luZVN0b3JlQ29udGV4dDxUPihlbmdpbmVJZCksIFtlbmdpbmVJZF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0U2NoZW1hU3RvcmUoc2NoZW1hU3RvcmUkKTtcbiAgfSwgW3NjaGVtYVN0b3JlJF0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0TGF5ZXJzU3RvcmUobGF5ZXJzU3RvcmUkKTtcbiAgfSwgW2xheWVyc1N0b3JlJF0pO1xuXG4gIHJldHVybiAoXG4gICAgPEVuZ2luZVN0b3JlQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17ZW5naW5lU3RvcmUkfT5cbiAgICAgIDxDb3JlPFQ+IGxheWVyc1N0b3JlJD17bGF5ZXJzU3RvcmUkfSBlbmdpbmVJZD17ZW5naW5lSWR9IC8+XG4gICAgPC9FbmdpbmVTdG9yZUNvbnRleHQuUHJvdmlkZXI+XG4gIClcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGFnZUVuZ2luZTxUIGV4dGVuZHMgUGFnZUVuZ2luZVYyLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+IHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnlcbiAgcHJpdmF0ZSBzdGF0aWMgaW5zdGFuY2VNYXA6IFJlY29yZDxzdHJpbmcsIFBhZ2VFbmdpbmU8YW55Pj4gPSB7fTtcbiAgcHJpdmF0ZSBzY2hlbWE6IFNjaGVtYVNwZWMuU2NoZW1hO1xuICBwcml2YXRlIGxheWVyczogUGFnZUVuZ2luZVYyLkxheWVyPFQ+W107XG4gIHByaXZhdGUgc2NoZW1hU3RvcmUkITogQmVoYXZpb3JTdWJqZWN0PFNjaGVtYVNwZWMuU2NoZW1hPjtcbiAgcHJpdmF0ZSBsYXllclN0b3JlJCE6IEJlaGF2aW9yU3ViamVjdDxQYWdlRW5naW5lVjIuTGF5ZXI8VD5bXT47XG4gIHB1YmxpYyBlbmdpbmVJZDogc3RyaW5nO1xuICBwdWJsaWMgc3RhdGljIHVzZU9ic2VydmFibGUgPSB1c2VPYnNlcnZhYmxlO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihzY2hlbWE6IFNjaGVtYVNwZWMuU2NoZW1hLCBsYXllcnM6IFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdKSB7XG4gICAgdGhpcy5zY2hlbWEgPSBzY2hlbWE7XG4gICAgdGhpcy5sYXllcnMgPSBsYXllcnM7XG4gICAgdGhpcy5lbmdpbmVJZD0gdXVpZCgpO1xuICAgIFBhZ2VFbmdpbmUuaW5zdGFuY2VNYXBbdGhpcy5lbmdpbmVJZF0gPSB0aGlzO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyB1c2VTY2hlbWEgPSAoZW5naW5lSWQ6IHN0cmluZyk6IFNjaGVtYVNwZWMuU2NoZW1hID0+IHtcbiAgICBjb25zdCBlbmdpbmUgPSBQYWdlRW5naW5lLmluc3RhbmNlTWFwW2VuZ2luZUlkXTtcbiAgICByZXR1cm4gdXNlU2NoZW1hKGVuZ2luZS5zY2hlbWFTdG9yZSQsIGVuZ2luZS5zY2hlbWEpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyB1c2VMYXllcnM8VCBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihlbmdpbmVJZDogc3RyaW5nKTogUGFnZUVuZ2luZVYyLkxheWVyPFQ+W10ge1xuICAgIGNvbnN0IGVuZ2luZSA9IFBhZ2VFbmdpbmUuaW5zdGFuY2VNYXBbZW5naW5lSWRdO1xuICAgIHJldHVybiB1c2VMYXllcnMoZW5naW5lLmxheWVyU3RvcmUkKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgcmVnaXN0cnlMYXllcnM8VCBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihlbmdpbmVJZDogc3RyaW5nLCBsYXllcnM6IFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdKTogdm9pZCB7XG4gICAgY29uc3QgZW5naW5lID0gUGFnZUVuZ2luZS5pbnN0YW5jZU1hcFtlbmdpbmVJZF07XG4gICAgcmV0dXJuIHJlZ2lzdHJ5TGF5ZXJzKGVuZ2luZS5sYXllclN0b3JlJCwgbGF5ZXJzKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0U2NoZW1hU3RvcmUgPSAoc3RvcmUkOiBCZWhhdmlvclN1YmplY3Q8U2NoZW1hU3BlYy5TY2hlbWE+KTogdm9pZCA9PiB7XG4gICAgdGhpcy5zY2hlbWFTdG9yZSQgPSBzdG9yZSQ7XG4gIH1cblxuICBwcml2YXRlIHNldExheWVyc1N0b3JlID0gKHN0b3JlJDogQmVoYXZpb3JTdWJqZWN0PFBhZ2VFbmdpbmVWMi5MYXllcjxUPltdPik6IHZvaWQgPT4ge1xuICAgIHRoaXMubGF5ZXJTdG9yZSQgPSBzdG9yZSQ7XG4gIH1cblxuICBwdWJsaWMgcmVuZGVyID0gKHNlbGVjdG9yOiBzdHJpbmcpOiB2b2lkID0+IHtcbiAgICBSZWFjdERPTS5yZW5kZXIoXG4gICAgICA8QXBwPFQ+XG4gICAgICAgIHNjaGVtYT17dGhpcy5zY2hlbWF9XG4gICAgICAgIGxheWVycz17dGhpcy5sYXllcnN9XG4gICAgICAgIHNldFNjaGVtYVN0b3JlPXt0aGlzLnNldFNjaGVtYVN0b3JlfVxuICAgICAgICBzZXRMYXllcnNTdG9yZT17dGhpcy5zZXRMYXllcnNTdG9yZX1cbiAgICAgICAgZW5naW5lSWQ9e3RoaXMuZW5naW5lSWR9XG4gICAgICAvPixcbiAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHNlbGVjdG9yKVxuICAgICk7XG4gIH1cbn1cbiIsIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby1leHBsaWNpdC1hbnkgKi9cbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VDYWxsYmFjayB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgY2xvbmUgfSBmcm9tICdyYW1kYSc7XG5cbmltcG9ydCB7IHJlbW92ZU5vZGVGcm9tU2NoZW1hQnlOb2RlSWQsIHJlbW92ZUFsbE5vZGVGcm9tU2NoZW1hIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmludGVyZmFjZSBDb21tYW5kRXhlY3V0ZSB7XG4gIHVuZG8/OiAoKSA9PiB2b2lkO1xuICByZWRvPzogKCkgPT4gdm9pZDtcbn1cblxudHlwZSBDb21tYW5kTmFtZSA9IHN0cmluZyB8ICgndW5kbycgfCAncmVkbycgfCAnZGVsZXRlJyB8ICdjbGVhcicpO1xuaW50ZXJmYWNlIENvbW1hbmQge1xuICBuYW1lOiBDb21tYW5kTmFtZTsgLy8g5ZG95Luk55qE5ZSv5LiA5qCH6K+GXG4gIGtleWJvYXJkPzogc3RyaW5nIHwgc3RyaW5nW107IC8vIOWRveS7pOebkeWQrOeahOW/q+aNt+mUrlxuICBleGVjdXRlOiAoLi4uYXJnczogYW55W10pID0+IENvbW1hbmRFeGVjdXRlOyAvLyDlkb3ku6TlhbfkvZPlrp7njrDnmoTliqjkvZxcbiAgZm9sbG93UXVldWU/OiBib29sZWFuOyAvLyDlkb3ku6TmiafooYzlrozkuYvlkI7vvIwg5piv5ZCm6ZyA6KaB5bCGQ29tbWFuZEV4ZWN1dGXmlL7lhaXlkb3ku6TpmJ/liJdcbiAgaW5pdD86ICgpID0+ICgoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWQpOyAvLyDlkb3ku6TliJ3lp4vljJblh73mlbBcbiAgZGF0YT86IGFueTsgLy8g5ZG95Luk57yT5a2Y5omA6ZyA6KaB55qE5pWw5o2uXG59XG5cbnR5cGUgQ29tbWFuZE5hbWUyRXhlY3V0ZSA9IFJlY29yZDxDb21tYW5kTmFtZSwgKC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkPjtcbmludGVyZmFjZSBTdGF0ZSB7XG4gIGN1cnJlbnQ6IG51bWJlcjtcbiAgcXVldWU6IENvbW1hbmRFeGVjdXRlW107XG4gIGNvbW1hbmRzOiBBcnJheTxDb21tYW5kPjtcbiAgY29tbWFuZE5hbWUyRXhlY3V0ZTogQ29tbWFuZE5hbWUyRXhlY3V0ZTtcbiAgZGVzdHJveUxpc3Q6IEFycmF5PCgoKCkgPT4gdm9pZCkgfCB1bmRlZmluZWQpPjtcbn1cbmludGVyZmFjZSBVc2VDb21tYW5kRXhwb3NlIHtcbiAgcmVnaXN0cnk6IChjb21tYW5kOiBDb21tYW5kKSA9PiB2b2lkO1xuICB1c2VJbml0OiAoKSA9PiB2b2lkO1xuICBjb21tYW5kczogQ29tbWFuZE5hbWUyRXhlY3V0ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1c2VDb21tYW5kKCk6IFVzZUNvbW1hbmRFeHBvc2Uge1xuICBjb25zdCBjb21tYW5kU3RhdGVSZWYgPSB1c2VSZWY8U3RhdGU+KHtcbiAgICBjdXJyZW50OiAtMSwgLy8g5b2T5YmN5ZG95Luk6Zif5YiX5Lit5pyA5ZCO5omn6KGM55qE5ZG95Luk6L+U5Zue55qEIENvbW1hbmRFeGVjdXRlIOWvueixoVxuICAgIHF1ZXVlOiBbXSwgLy8gdW5kbyByZWRvIOWRveS7pOmYn+WIl1xuICAgIGNvbW1hbmRzOiBbXSwgLy8g5ZG95Luk55qE5pWw57uEXG4gICAgY29tbWFuZE5hbWUyRXhlY3V0ZToge30sIC8vIOmAmui/h+WRveS7pOWQjeensOiOt+WPluWRveS7pOaJp+ihjOWHveaVsOeahOaYoOWwhFxuICAgIGRlc3Ryb3lMaXN0OiBbXSwgLy8g5ZG95Luk6ZSA5q+B5Ye95pWw55qE5pWw57uEXG4gIH0pXG5cbiAgY29uc3QgcmVnaXN0cnkgPSB1c2VDYWxsYmFjaygoY29tbWFuZDogQ29tbWFuZCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgY29tbWFuZHMsIGNvbW1hbmROYW1lMkV4ZWN1dGUsIHF1ZXVlLCBjdXJyZW50IH0gPSBjb21tYW5kU3RhdGVSZWYuY3VycmVudDtcbiAgICBpZiAoY29tbWFuZE5hbWUyRXhlY3V0ZVtjb21tYW5kLm5hbWVdKSB7XG4gICAgICBjb25zdCBleGlzdEluZGV4ID0gY29tbWFuZHMuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5uYW1lID09PSBjb21tYW5kLm5hbWUpO1xuICAgICAgY29tbWFuZHMuc3BsaWNlKGV4aXN0SW5kZXgsIDEpXG4gICAgfVxuICAgIGNvbW1hbmRzLnB1c2goY29tbWFuZCk7XG4gICAgY29tbWFuZE5hbWUyRXhlY3V0ZVtjb21tYW5kLm5hbWVdID0gKC4uLmFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCB7IHJlZG8sIHVuZG8gfT0gY29tbWFuZC5leGVjdXRlKC4uLmFyZ3MpO1xuICAgICAgaWYgKCFyZWRvKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJlZG8oKTtcbiAgICAgIGlmIChjb21tYW5kLmZvbGxvd1F1ZXVlID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocXVldWUubGVuZ3RoKSB7XG4gICAgICAgIGNvbW1hbmRTdGF0ZVJlZi5jdXJyZW50LnF1ZXVlID0gcXVldWUuc2xpY2UoMCwgY3VycmVudCArIDEpO1xuICAgICAgfVxuICAgICAgY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQucXVldWUucHVzaCh7IHJlZG8sIHVuZG8gfSk7XG4gICAgICBjb21tYW5kU3RhdGVSZWYuY3VycmVudC5jdXJyZW50ID0gY3VycmVudCArIDE7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IG9uS2V5ZG93biA9IHVzZUNhbGxiYWNrKChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgeyBrZXksIHNoaWZ0S2V5LCBhbHRLZXksIGN0cmxLZXksIG1ldGFLZXkgfSA9IGU7XG4gICAgY29uc3Qga2V5czogc3RyaW5nW10gPSBbXTtcbiAgICBpZiAoY3RybEtleSB8fCBtZXRhS2V5KSB7XG4gICAgIGtleXMucHVzaCgnY3RybCcpO1xuICAgIH1cbiAgICBpZiAoc2hpZnRLZXkpIHtcbiAgICAgIGtleXMucHVzaCgnc2hpZnQnKTtcbiAgICB9XG4gICAgaWYgKGFsdEtleSkge1xuICAgICAga2V5cy5wdXNoKCdhbHQnKTtcbiAgICB9XG4gICAga2V5cy5wdXNoKGtleS50b0xvd2VyQ2FzZSgpKTtcbiAgICBjb25zdCBrZXlOYW1lcyA9IGtleXMuam9pbignKycpO1xuICAgIGNvbW1hbmRTdGF0ZVJlZi5jdXJyZW50LmNvbW1hbmRzLmZvckVhY2goY29tbWFuZCA9PiB7XG4gICAgICBpZiAoIWNvbW1hbmQua2V5Ym9hcmQpIHtcbiAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIGNvbnN0IGtleXMgPSBBcnJheS5pc0FycmF5KGNvbW1hbmQua2V5Ym9hcmQpID8gY29tbWFuZC5rZXlib2FyZCA6IFtjb21tYW5kLmtleWJvYXJkXTtcbiAgICAgIGlmIChrZXlzLmluY2x1ZGVzKGtleU5hbWVzKSkge1xuICAgICAgICBjb21tYW5kU3RhdGVSZWYuY3VycmVudC5jb21tYW5kTmFtZTJFeGVjdXRlW2NvbW1hbmQubmFtZV0oKTtcbiAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgIH0pXG4gIH0sIFtdKTtcblxuICBjb25zdCB1c2VJbml0ID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgICBjb25zdCB7IGNvbW1hbmRzLCBkZXN0cm95TGlzdCB9ID0gY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQ7XG4gICAgICBjb21tYW5kcy5mb3JFYWNoKGNvbW1hbmQgPT4ge1xuICAgICAgICBjb25zdCBpbml0ID0gY29tbWFuZC5pbml0O1xuICAgICAgICBpZiAoaW5pdCkge1xuICAgICAgICAgIGRlc3Ryb3lMaXN0LnB1c2goaW5pdCgpKTtcbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIHJlZ2lzdHJ5KHtcbiAgICAgICAgbmFtZTogJ3VuZG8nLFxuICAgICAgICBrZXlib2FyZDogWydjdHJsK3onXSxcbiAgICAgICAgZm9sbG93UXVldWU6IGZhbHNlLFxuICAgICAgICBleGVjdXRlKCkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICByZWRvOiAoKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnN0IHsgY3VycmVudCwgcXVldWUgfSA9IGNvbW1hbmRTdGF0ZVJlZi5jdXJyZW50O1xuICAgICAgICAgICAgICBpZiAoY3VycmVudCA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcXVldWVbY3VycmVudF0udW5kbz8uKCk7XG4gICAgICAgICAgICAgIGNvbW1hbmRTdGF0ZVJlZi5jdXJyZW50LmN1cnJlbnQtLTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICByZWdpc3RyeSh7XG4gICAgICAgIG5hbWU6ICdyZWRvJyxcbiAgICAgICAga2V5Ym9hcmQ6IFsnY3RybCt5JywgJ2N0cmwrc2hpZnQreiddLFxuICAgICAgICBmb2xsb3dRdWV1ZTogZmFsc2UsXG4gICAgICAgIGV4ZWN1dGUoKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHJlZG86ICgpID0+IHtcbiAgICAgICAgICAgICAgY29uc3QgeyBjdXJyZW50LCBxdWV1ZSB9ID0gY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQ7XG4gICAgICAgICAgICAgIGlmIChjdXJyZW50ID09PSBxdWV1ZS5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHF1ZXVlW2N1cnJlbnQgKyAxXS5yZWRvPy4oKTtcbiAgICAgICAgICAgICAgY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQuY3VycmVudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICB9LCBbXSk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlkb3duLCB0cnVlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleWRvd24sIHRydWUpO1xuICAgICAgY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQuZGVzdHJveUxpc3QuZm9yRWFjaChmbiA9PiBmbj8uKCkpO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIHJldHVybiB7XG4gICAgcmVnaXN0cnksXG4gICAgdXNlSW5pdCxcbiAgICBjb21tYW5kczogY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQuY29tbWFuZE5hbWUyRXhlY3V0ZSxcbiAgfVxufVxuXG5pbnRlcmZhY2UgUHJvcHM8VCBleHRlbmRzIFBhZ2VFbmdpbmVWMi5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPiB7XG4gIHNjaGVtYTogUGFnZUVuZ2luZVYyLlNjaGVtYTtcbiAgb25DaGFuZ2U6IChzY2hlbWE6IFBhZ2VFbmdpbmVWMi5TY2hlbWEpID0+IHZvaWQ7XG4gIGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSQ6IFBhZ2VFbmdpbmVWMi5CbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU8VD47XG59XG5leHBvcnQgZnVuY3Rpb24gdXNlQ2FudmFzQ29tbWFuZDxUIGV4dGVuZHMgUGFnZUVuZ2luZVYyLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KFxuICB7ICBzY2hlbWEsIG9uQ2hhbmdlLCBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkICB9OiBQcm9wczxUPlxuKTogVXNlQ29tbWFuZEV4cG9zZSB7XG4gIGNvbnN0IGV4cG9zZSA9IHVzZUNvbW1hbmQoKTtcbiAgZXhwb3NlLnJlZ2lzdHJ5KHtcbiAgICBuYW1lOiAnZGVsZXRlJyxcbiAgICBrZXlib2FyZDogWydkZWxldGUnLCAnYmFja3NwYWNlJywgJ2N0cmwrZCddLFxuICAgIGV4ZWN1dGUoKSB7XG4gICAgICBjb25zdCBiZWZvcmVTY2hlbWEgPSBjbG9uZShzY2hlbWEpO1xuICAgICAgY29uc3QgeyBhY3RpdmVOb2RlSUQgfSA9IGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSQuZ2V0VmFsdWUoKTtcbiAgICAgIGlmICghYWN0aXZlTm9kZUlEKSB7XG4gICAgICAgIHJldHVybiB7fTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGFmdGVyU2NoZW1hID0gcmVtb3ZlTm9kZUZyb21TY2hlbWFCeU5vZGVJZChzY2hlbWEsIGFjdGl2ZU5vZGVJRCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWRvKCkge1xuICAgICAgICAgIG9uQ2hhbmdlKGFmdGVyU2NoZW1hKTtcbiAgICAgICAgICBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkLm5leHQoey4uLmJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSQuZ2V0VmFsdWUoKSwgYWN0aXZlTm9kZUlEOiAnJyB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgdW5kbygpIHtcbiAgICAgICAgICBvbkNoYW5nZShiZWZvcmVTY2hlbWEpO1xuICAgICAgICAgIGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSQubmV4dCh7Li4uYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJC5nZXRWYWx1ZSgpLCBhY3RpdmVOb2RlSUQgfSk7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0sXG4gIH0pO1xuICBleHBvc2UucmVnaXN0cnkoe1xuICAgIG5hbWU6ICdjbGVhcicsXG4gICAga2V5Ym9hcmQ6IFsnY3RybCtjJ10sXG4gICAgZXhlY3V0ZSgpIHtcbiAgICAgIGNvbnN0IGJlZm9yZVNjaGVtYSA9IGNsb25lKHNjaGVtYSk7XG4gICAgICBjb25zdCBhZnRlclNjaGVtYSA9IHJlbW92ZUFsbE5vZGVGcm9tU2NoZW1hKHNjaGVtYSk7XG4gICAgICBjb25zdCB7IGFjdGl2ZU5vZGVJRCB9ID0gYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJC5nZXRWYWx1ZSgpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVkbygpIHtcbiAgICAgICAgICBvbkNoYW5nZShhZnRlclNjaGVtYSk7XG4gICAgICAgICAgYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJC5uZXh0KHsuLi5ibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkLmdldFZhbHVlKCksIGFjdGl2ZU5vZGVJRDogJycgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHVuZG8oKSB7XG4gICAgICAgICAgb25DaGFuZ2UoYmVmb3JlU2NoZW1hKTtcbiAgICAgICAgICBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkLm5leHQoey4uLmJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSQuZ2V0VmFsdWUoKSwgYWN0aXZlTm9kZUlEIH0pO1xuICAgICAgICB9LFxuICAgICAgfTtcbiAgICB9XG4gIH0pXG4gIHJldHVybiBleHBvc2U7XG59XG4iXSwibmFtZXMiOlsiY3JlYXRlIiwic2V0IiwiX19kZWZQcm9wIiwiX19nZXRPd25Qcm9wU3ltYm9scyIsIl9faGFzT3duUHJvcCIsIl9fcHJvcElzRW51bSIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwiZ2V0RW5naW5lU3RvcmVDb250ZXh0Iiwic2V0U2NoZW1hIiwiX19kZWZQcm9wcyIsIl9fZ2V0T3duUHJvcERlc2NzIiwiX19zcHJlYWRQcm9wcyIsInVwZGF0ZUVuZ2luZVN0b3JlIiwiYmluZCIsIl9pc0FycmF5TGlrZSIsIl9pc0FyZ3VtZW50cyIsIl94bWFwIiwiY3VycnlOIiwia2V5cyIsIm50aCIsInBhdGhzIiwiaXNOaWwiLCJhc3NvYyIsInR5cGUiLCJtYXAiLCJsZW5zIiwicGF0aCIsImFzc29jUGF0aCIsIm92ZXIiLCJsZW5zUGF0aCIsImNyZWF0ZVNjaGVtYVN0b3JlIiwiY3JlYXRlTGF5ZXJzU3RvcmUiLCJjcmVhdGVFbmdpbmVTdG9yZSIsImNsb25lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BQ2UsU0FBUyxhQUFhLENBQUMsVUFBVSxFQUFFLFlBQVksRUFBRTtNQUNoRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEdBQUcsUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ25ELEVBQUUsU0FBUyxDQUFDLE1BQU07TUFDbEIsSUFBSSxJQUFJLFVBQVUsRUFBRTtNQUNwQixNQUFNLE1BQU0sWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDMUQsTUFBTSxPQUFPLE1BQU0sWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO01BQzlDLEtBQUs7TUFDTCxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO01BQ25CLEVBQUUsT0FBTyxLQUFLLElBQUksSUFBSSxHQUFHLEtBQUssR0FBRyxZQUFZLENBQUM7TUFDOUM7O01DVGUsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFO01BQzFDLEVBQUUsT0FBTyxhQUFhLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ25DOztNQ0ZlLFNBQVMsU0FBUyxDQUFDLE1BQU0sRUFBRSxhQUFhLEVBQUU7TUFDekQsRUFBRSxPQUFPLGFBQWEsQ0FBQyxNQUFNLEVBQUUsYUFBYSxDQUFDLENBQUM7TUFDOUM7O01DRk8sU0FBU0EsUUFBTSxDQUFDLE1BQU0sRUFBRTtNQUMvQixFQUFFLE9BQU8sSUFBSSxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDckMsQ0FBQztNQUNNLFNBQVNDLEtBQUcsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFO01BQ3BDLEVBQUUsTUFBTSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ2hEOztNQ05BLElBQUlDLFdBQVMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO01BQ3RDLElBQUlDLHFCQUFtQixHQUFHLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQztNQUN2RCxJQUFJQyxjQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7TUFDbkQsSUFBSUMsY0FBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUM7TUFDekQsSUFBSUMsaUJBQWUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsS0FBSyxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUdKLFdBQVMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxZQUFZLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQ2hLLElBQUlLLGdCQUFjLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLO01BQy9CLEVBQUUsS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUNoQyxJQUFJLElBQUlILGNBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUNsQyxNQUFNRSxpQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDeEMsRUFBRSxJQUFJSCxxQkFBbUI7TUFDekIsSUFBSSxLQUFLLElBQUksSUFBSSxJQUFJQSxxQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUM3QyxNQUFNLElBQUlFLGNBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUNwQyxRQUFRQyxpQkFBZSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDMUMsS0FBSztNQUNMLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDWCxDQUFDLENBQUM7TUFHRixTQUFTLGtCQUFrQixHQUFHO01BQzlCLEVBQUUsTUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDO01BQ3hCLEVBQUUsT0FBTyxDQUFDLFVBQVUsS0FBSztNQUN6QixJQUFJLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUMzQyxJQUFJLElBQUksT0FBTyxFQUFFO01BQ2pCLE1BQU0sT0FBTyxPQUFPLENBQUM7TUFDckIsS0FBSztNQUNMLElBQUksTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDTixRQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUMvQyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsR0FBRyxRQUFRLENBQUM7TUFDdEMsSUFBSSxPQUFPLFFBQVEsQ0FBQztNQUNwQixHQUFHLENBQUM7TUFDSixDQUFDO01BQ00sU0FBU0EsUUFBTSxDQUFDLFVBQVUsRUFBRTtNQUNuQyxFQUFFLE9BQU8sSUFBSSxlQUFlLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDekMsQ0FBQztNQUNNLFNBQVMsTUFBTSxDQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUU7TUFDNUMsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDTyxnQkFBYyxDQUFDQSxnQkFBYyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztNQUM3RSxDQUFDO01BQ00sTUFBTSxVQUFVLEdBQUcsa0JBQWtCLEVBQUU7O01DaEMvQixTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUU7TUFDckMsRUFBRSxNQUFNLEVBQUUsZUFBZSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQztNQUNqSCxFQUFFLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLE1BQU1DLFVBQXFCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO01BQ3hGLEVBQUUsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7TUFDdEQsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLHlCQUF5QixFQUFFLEdBQUcsYUFBYSxDQUFDLFlBQVksRUFBRTtNQUNsRixJQUFJLFlBQVksRUFBRSxZQUFZLENBQUMsS0FBSyxDQUFDLFlBQVk7TUFDakQsR0FBRyxDQUFDLENBQUM7TUFDTCxFQUFFLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxZQUFZLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUNyRCxFQUFFLE1BQU0sS0FBSyxHQUFHO01BQ2hCLElBQUksZUFBZTtNQUNuQixJQUFJLGFBQWE7TUFDakIsSUFBSSxZQUFZO01BQ2hCLElBQUksVUFBVTtNQUNkLEdBQUcsQ0FBQztNQUNKLEVBQUUsTUFBTSxrQkFBa0IsR0FBRyxXQUFXLENBQUMsQ0FBQyxPQUFPLEtBQUs7TUFDdEQsSUFBSUMsS0FBUyxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNyQyxHQUFHLEVBQUUsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUM3QixFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyx5QkFBeUIsRUFBRTtNQUM3QyxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7TUFDSCxFQUFFLHVCQUF1QixLQUFLLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRTtNQUNwRCxJQUFJLFNBQVMsRUFBRSx5QkFBeUI7TUFDeEMsSUFBSSxLQUFLO01BQ1QsR0FBRyxrQkFBa0IsS0FBSyxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUU7TUFDakQsSUFBSSxNQUFNO01BQ1YsSUFBSSxRQUFRLEVBQUUsa0JBQWtCO01BQ2hDLElBQUkseUJBQXlCO01BQzdCLElBQUksUUFBUTtNQUNaLElBQUksUUFBUTtNQUNaLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDTjs7TUNsQ0EsU0FBUyxXQUFXLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRTtNQUMvQixFQUFFLEtBQUssR0FBRyxLQUFLLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUM7TUFDakMsRUFBRSxJQUFJLFFBQVEsR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDO0FBQzlCO01BQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxJQUFJLE9BQU8sUUFBUSxLQUFLLFdBQVcsRUFBRSxFQUFFLE9BQU8sRUFBRTtBQUMxRDtNQUNBLEVBQUUsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsb0JBQW9CLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdkUsRUFBRSxJQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQzlDLEVBQUUsS0FBSyxDQUFDLElBQUksR0FBRyxVQUFVLENBQUM7QUFDMUI7TUFDQSxFQUFFLElBQUksUUFBUSxLQUFLLEtBQUssRUFBRTtNQUMxQixJQUFJLElBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTtNQUN6QixNQUFNLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUNoRCxLQUFLLE1BQU07TUFDWCxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDOUIsS0FBSztNQUNMLEdBQUcsTUFBTTtNQUNULElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUM1QixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksS0FBSyxDQUFDLFVBQVUsRUFBRTtNQUN4QixJQUFJLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztNQUNuQyxHQUFHLE1BQU07TUFDVCxJQUFJLEtBQUssQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ3BELEdBQUc7TUFDSDs7Ozs7TUN6QkEsSUFBSVAsV0FBUyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7TUFDdEMsSUFBSVEsWUFBVSxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztNQUN6QyxJQUFJQyxtQkFBaUIsR0FBRyxNQUFNLENBQUMseUJBQXlCLENBQUM7TUFDekQsSUFBSVIscUJBQW1CLEdBQUcsTUFBTSxDQUFDLHFCQUFxQixDQUFDO01BQ3ZELElBQUlDLGNBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQztNQUNuRCxJQUFJQyxjQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQztNQUN6RCxJQUFJQyxpQkFBZSxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxLQUFLLEtBQUssR0FBRyxJQUFJLEdBQUcsR0FBR0osV0FBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDaEssSUFBSUssZ0JBQWMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUs7TUFDL0IsRUFBRSxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ2hDLElBQUksSUFBSUgsY0FBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO01BQ2xDLE1BQU1FLGlCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUN4QyxFQUFFLElBQUlILHFCQUFtQjtNQUN6QixJQUFJLEtBQUssSUFBSSxJQUFJLElBQUlBLHFCQUFtQixDQUFDLENBQUMsQ0FBQyxFQUFFO01BQzdDLE1BQU0sSUFBSUUsY0FBWSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDO01BQ3BDLFFBQVFDLGlCQUFlLENBQUMsQ0FBQyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUMxQyxLQUFLO01BQ0wsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNYLENBQUMsQ0FBQztNQUNGLElBQUlNLGVBQWEsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLEtBQUtGLFlBQVUsQ0FBQyxDQUFDLEVBQUVDLG1CQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFNbkQsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFO01BQ3JDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxnQkFBZ0IsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLG9DQUFvQyxFQUFFLFFBQVEsRUFBRSxHQUFHLEtBQUssQ0FBQztNQUNwSSxFQUFFLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDLE1BQU1ILFVBQXFCLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO01BQ3hGLEVBQUUsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7TUFDdEQsRUFBRSxNQUFNLHlCQUF5QixHQUFHLE9BQU8sQ0FBQyxNQUFNLElBQUksZUFBZSxDQUFDLG9DQUFvQyxDQUFDLEVBQUUsQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFDLENBQUM7TUFDckosRUFBRSxTQUFTLENBQUMsTUFBTTtNQUNsQixJQUFJSyxNQUFpQixDQUFDLFlBQVksRUFBRSxFQUFFLHlCQUF5QixFQUFFLENBQUMsQ0FBQztNQUNuRSxHQUFHLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7TUFDbEMsRUFBRSxNQUFNLG9CQUFvQixHQUFHO01BQy9CLElBQUksT0FBTyxFQUFFLE1BQU07TUFDbkIsSUFBSSxHQUFHLEVBQUUsS0FBSztNQUNkLElBQUksbUJBQW1CO01BQ3ZCLElBQUksZ0JBQWdCO01BQ3BCLElBQUksTUFBTTtNQUNWLEdBQUcsQ0FBQztNQUNKLEVBQUUsdUJBQXVCLEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBSyxFQUFFO01BQ3BELElBQUksU0FBUyxFQUFFLG1CQUFtQjtNQUNsQyxJQUFJLEtBQUssRUFBRSxvQkFBb0I7TUFDL0IsR0FBRyxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxLQUFLLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxxQkFBcUIsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUVELGVBQWEsQ0FBQ0wsZ0JBQWMsQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUU7TUFDakssSUFBSSxHQUFHLEVBQUUsS0FBSztNQUNkLElBQUksUUFBUTtNQUNaLElBQUksUUFBUTtNQUNaLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ1I7O01DL0NlLFNBQVMsY0FBYyxDQUFDLENBQUMsRUFBRTtNQUMxQyxFQUFFLE9BQU8sQ0FBQyxJQUFJLElBQUksSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLElBQUksQ0FBQyxDQUFDLDBCQUEwQixDQUFDLEtBQUssSUFBSSxDQUFDO01BQ3RGOztNQ0RBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7QUFDQTtNQUNlLFNBQVMsT0FBTyxDQUFDLEVBQUUsRUFBRTtNQUNwQyxFQUFFLE9BQU8sU0FBUyxFQUFFLENBQUMsQ0FBQyxFQUFFO01BQ3hCLElBQUksSUFBSSxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDckQsTUFBTSxPQUFPLEVBQUUsQ0FBQztNQUNoQixLQUFLLE1BQU07TUFDWCxNQUFNLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDdkMsS0FBSztNQUNMLEdBQUcsQ0FBQztNQUNKOztNQ2hCQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO0FBQ0E7TUFDZSxTQUFTLE9BQU8sQ0FBQyxFQUFFLEVBQUU7TUFDcEMsRUFBRSxPQUFPLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDM0IsSUFBSSxRQUFRLFNBQVMsQ0FBQyxNQUFNO01BQzVCLE1BQU0sS0FBSyxDQUFDO01BQ1osUUFBUSxPQUFPLEVBQUUsQ0FBQztBQUNsQjtNQUNBLE1BQU0sS0FBSyxDQUFDO01BQ1osUUFBUSxPQUFPLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFO01BQzlELFVBQVUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQzNCLFNBQVMsQ0FBQyxDQUFDO0FBQ1g7TUFDQSxNQUFNO01BQ04sUUFBUSxPQUFPLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsVUFBVSxFQUFFLEVBQUU7TUFDdkcsVUFBVSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDM0IsU0FBUyxDQUFDLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxVQUFVLEVBQUUsRUFBRTtNQUN2RCxVQUFVLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUMzQixTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3RCLEtBQUs7TUFDTCxHQUFHLENBQUM7TUFDSjs7TUM5QmUsU0FBUyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRTtNQUN0QztNQUNBLEVBQUUsUUFBUSxDQUFDO01BQ1gsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sWUFBWTtNQUN6QixRQUFRLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDekMsT0FBTyxDQUFDO0FBQ1I7TUFDQSxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sT0FBTyxVQUFVLEVBQUUsRUFBRTtNQUMzQixRQUFRLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDekMsT0FBTyxDQUFDO0FBQ1I7TUFDQSxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sT0FBTyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDL0IsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUNuQyxRQUFRLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDekMsT0FBTyxDQUFDO0FBQ1I7TUFDQSxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sT0FBTyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUN2QyxRQUFRLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDekMsT0FBTyxDQUFDO0FBQ1I7TUFDQSxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sT0FBTyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDM0MsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUMvQyxRQUFRLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDekMsT0FBTyxDQUFDO0FBQ1I7TUFDQSxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sT0FBTyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUNuRCxRQUFRLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDekMsT0FBTyxDQUFDO0FBQ1I7TUFDQSxJQUFJLEtBQUssQ0FBQztNQUNWLE1BQU0sT0FBTyxVQUFVLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDdkQsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMs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
