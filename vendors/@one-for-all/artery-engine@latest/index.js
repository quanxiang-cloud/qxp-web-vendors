System.register(['react', 'rxjs'], (function (exports) {
  'use strict';
  var createContext, useContext, React, useState, useEffect, useCallback, useMemo, useRef, BehaviorSubject;
  return {
    setters: [function (module) {
      createContext = module.createContext;
      useContext = module.useContext;
      React = module["default"];
      useState = module.useState;
      useEffect = module.useEffect;
      useCallback = module.useCallback;
      useMemo = module.useMemo;
      useRef = module.useRef;
    }, function (module) {
      BehaviorSubject = module.BehaviorSubject;
    }],
    execute: (function () {

      exports({
        buildComposedNodeLoopContainerNode: buildComposedNodeLoopContainerNode,
        buildHTMLNode: buildHTMLNode,
        buildIndividualLoopContainerNode: buildIndividualLoopContainerNode,
        buildJSXNode: buildJSXNode,
        buildLinkNode: buildLinkNode,
        buildReactComponentNode: buildReactComponentNode,
        buildRefNode: buildRefNode,
        buildRouteNode: buildRouteNode,
        buildeLayerId: buildeLayerId,
        default: ArteryEngine,
        generateNodeId: generateNodeId,
        isArteryNode: isArteryNode,
        isComposedNodeChildNode: isComposedNodeChildNode,
        isComposedNodeLoopContainerNode: isComposedNodeLoopContainerNode,
        isHTMLNode: isHTMLNode,
        isHasSubNode: isHasSubNode,
        isIndividualLoopContainer: isIndividualLoopContainer,
        isJSXNode: isJSXNode,
        isLinkNode: isLinkNode,
        isLoopContainerNode: isLoopContainerNode,
        isNodeAcceptChild: isNodeAcceptChild,
        isNodeHasToProps: isNodeHasToProps,
        isReactComponentNode: isReactComponentNode,
        isReactComponentNodeWithExportName: isReactComponentNodeWithExportName,
        isRefNode: isRefNode,
        isRouteNode: isRouteNode,
        useArtery: useArtery,
        useCommand: useCommand$1,
        useObservable: useObservable
      });

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

      /**
       * Private `concat` function to merge two array-like objects.
       *
       * @private
       * @param {Array|Arguments} [set1=[]] An array-like object.
       * @param {Array|Arguments} [set2=[]] An array-like object.
       * @return {Array} A new, merged array.
       * @example
       *
       *      _concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]
       */
      function _concat(set1, set2) {
        set1 = set1 || [];
        set2 = set2 || [];
        var idx;
        var len1 = set1.length;
        var len2 = set2.length;
        var result = [];
        idx = 0;

        while (idx < len1) {
          result[result.length] = set1[idx];
          idx += 1;
        }

        idx = 0;

        while (idx < len2) {
          result[result.length] = set2[idx];
          idx += 1;
        }

        return result;
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
       * Returns a function that always returns the given value. Note that for
       * non-primitives the value returned is a reference to the original value.
       *
       * This function is known as `const`, `constant`, or `K` (for K combinator) in
       * other languages and libraries.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category Function
       * @sig a -> (* -> a)
       * @param {*} val The value to wrap in a function
       * @return {Function} A Function :: * -> val.
       * @example
       *
       *      const t = R.always('Tee');
       *      t(); //=> 'Tee'
       */

      var always =
      /*#__PURE__*/
      _curry1(function always(val) {
        return function () {
          return val;
        };
      });

      var always$1 = always;

      /**
       * Returns `true` if both arguments are `true`; `false` otherwise.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category Logic
       * @sig a -> b -> a | b
       * @param {Any} a
       * @param {Any} b
       * @return {Any} the first argument if it is falsy, otherwise the second argument.
       * @see R.both, R.xor
       * @example
       *
       *      R.and(true, true); //=> true
       *      R.and(true, false); //=> false
       *      R.and(false, true); //=> false
       *      R.and(false, false); //=> false
       */

      var and =
      /*#__PURE__*/
      _curry2(function and(a, b) {
        return a && b;
      });

      var and$1 = and;

      /**
       * Returns a new list containing the contents of the given list, followed by
       * the given element.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category List
       * @sig a -> [a] -> [a]
       * @param {*} el The element to add to the end of the new list.
       * @param {Array} list The list of elements to add a new item to.
       *        list.
       * @return {Array} A new list containing the elements of the old list followed by `el`.
       * @see R.prepend
       * @example
       *
       *      R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']
       *      R.append('tests', []); //=> ['tests']
       *      R.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]
       */

      var append =
      /*#__PURE__*/
      _curry2(function append(el, list) {
        return _concat(list, [el]);
      });

      var append$1 = append;

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

      function _arrayFromIterator(iter) {
        var list = [];
        var next;

        while (!(next = iter.next()).done) {
          list.push(next.value);
        }

        return list;
      }

      function _includesWith(pred, x, list) {
        var idx = 0;
        var len = list.length;

        while (idx < len) {
          if (pred(x, list[idx])) {
            return true;
          }

          idx += 1;
        }

        return false;
      }

      function _functionName(f) {
        // String(x => x) evaluates to "x => x", so the pattern may not match.
        var match = String(f).match(/^function (\w*)/);
        return match == null ? '' : match[1];
      }

      // Based on https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
      function _objectIs(a, b) {
        // SameValue algorithm
        if (a === b) {
          // Steps 1-5, 7-10
          // Steps 6.b-6.e: +0 != -0
          return a !== 0 || 1 / a === 1 / b;
        } else {
          // Step 6.a: NaN == NaN
          return a !== a && b !== b;
        }
      }

      var _objectIs$1 = typeof Object.is === 'function' ? Object.is : _objectIs;

      /**
       * private _uniqContentEquals function.
       * That function is checking equality of 2 iterator contents with 2 assumptions
       * - iterators lengths are the same
       * - iterators values are unique
       *
       * false-positive result will be returned for comparision of, e.g.
       * - [1,2,3] and [1,2,3,4]
       * - [1,1,1] and [1,2,3]
       * */

      function _uniqContentEquals(aIterator, bIterator, stackA, stackB) {
        var a = _arrayFromIterator(aIterator);

        var b = _arrayFromIterator(bIterator);

        function eq(_a, _b) {
          return _equals(_a, _b, stackA.slice(), stackB.slice());
        } // if *a* array contains any element that is not included in *b*


        return !_includesWith(function (b, aItem) {
          return !_includesWith(eq, aItem, b);
        }, b, a);
      }

      function _equals(a, b, stackA, stackB) {
        if (_objectIs$1(a, b)) {
          return true;
        }

        var typeA = type$1(a);

        if (typeA !== type$1(b)) {
          return false;
        }

        if (a == null || b == null) {
          return false;
        }

        if (typeof a['fantasy-land/equals'] === 'function' || typeof b['fantasy-land/equals'] === 'function') {
          return typeof a['fantasy-land/equals'] === 'function' && a['fantasy-land/equals'](b) && typeof b['fantasy-land/equals'] === 'function' && b['fantasy-land/equals'](a);
        }

        if (typeof a.equals === 'function' || typeof b.equals === 'function') {
          return typeof a.equals === 'function' && a.equals(b) && typeof b.equals === 'function' && b.equals(a);
        }

        switch (typeA) {
          case 'Arguments':
          case 'Array':
          case 'Object':
            if (typeof a.constructor === 'function' && _functionName(a.constructor) === 'Promise') {
              return a === b;
            }

            break;

          case 'Boolean':
          case 'Number':
          case 'String':
            if (!(typeof a === typeof b && _objectIs$1(a.valueOf(), b.valueOf()))) {
              return false;
            }

            break;

          case 'Date':
            if (!_objectIs$1(a.valueOf(), b.valueOf())) {
              return false;
            }

            break;

          case 'Error':
            return a.name === b.name && a.message === b.message;

          case 'RegExp':
            if (!(a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline && a.sticky === b.sticky && a.unicode === b.unicode)) {
              return false;
            }

            break;
        }

        var idx = stackA.length - 1;

        while (idx >= 0) {
          if (stackA[idx] === a) {
            return stackB[idx] === b;
          }

          idx -= 1;
        }

        switch (typeA) {
          case 'Map':
            if (a.size !== b.size) {
              return false;
            }

            return _uniqContentEquals(a.entries(), b.entries(), stackA.concat([a]), stackB.concat([b]));

          case 'Set':
            if (a.size !== b.size) {
              return false;
            }

            return _uniqContentEquals(a.values(), b.values(), stackA.concat([a]), stackB.concat([b]));

          case 'Arguments':
          case 'Array':
          case 'Object':
          case 'Boolean':
          case 'Number':
          case 'String':
          case 'Date':
          case 'Error':
          case 'RegExp':
          case 'Int8Array':
          case 'Uint8Array':
          case 'Uint8ClampedArray':
          case 'Int16Array':
          case 'Uint16Array':
          case 'Int32Array':
          case 'Uint32Array':
          case 'Float32Array':
          case 'Float64Array':
          case 'ArrayBuffer':
            break;

          default:
            // Values of other types are only equal if identical.
            return false;
        }

        var keysA = keys$1(a);

        if (keysA.length !== keys$1(b).length) {
          return false;
        }

        var extendedStackA = stackA.concat([a]);
        var extendedStackB = stackB.concat([b]);
        idx = keysA.length - 1;

        while (idx >= 0) {
          var key = keysA[idx];

          if (!(_has(key, b) && _equals(b[key], a[key], extendedStackA, extendedStackB))) {
            return false;
          }

          idx -= 1;
        }

        return true;
      }

      /**
       * Returns `true` if its arguments are equivalent, `false` otherwise. Handles
       * cyclical data structures.
       *
       * Dispatches symmetrically to the `equals` methods of both arguments, if
       * present.
       *
       * @func
       * @memberOf R
       * @since v0.15.0
       * @category Relation
       * @sig a -> b -> Boolean
       * @param {*} a
       * @param {*} b
       * @return {Boolean}
       * @example
       *
       *      R.equals(1, 1); //=> true
       *      R.equals(1, '1'); //=> false
       *      R.equals([1, 2, 3], [1, 2, 3]); //=> true
       *
       *      const a = {}; a.v = a;
       *      const b = {}; b.v = b;
       *      R.equals(a, b); //=> true
       */

      var equals =
      /*#__PURE__*/
      _curry2(function equals(a, b) {
        return _equals(a, b, [], []);
      });

      var equals$1 = equals;

      /**
       * Returns `true` if one or both of its arguments are `true`. Returns `false`
       * if both arguments are `false`.
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category Logic
       * @sig a -> b -> a | b
       * @param {Any} a
       * @param {Any} b
       * @return {Any} the first argument if truthy, otherwise the second argument.
       * @see R.either, R.xor
       * @example
       *
       *      R.or(true, true); //=> true
       *      R.or(true, false); //=> true
       *      R.or(false, true); //=> true
       *      R.or(false, false); //=> false
       */

      var or =
      /*#__PURE__*/
      _curry2(function or(a, b) {
        return a || b;
      });

      var or$1 = or;

      /**
       * Returns whether or not a path exists in an object. Only the object's
       * own properties are checked.
       *
       * @func
       * @memberOf R
       * @since v0.26.0
       * @category Object
       * @typedefn Idx = String | Int
       * @sig [Idx] -> {a} -> Boolean
       * @param {Array} path The path to use.
       * @param {Object} obj The object to check the path in.
       * @return {Boolean} Whether the path exists.
       * @see R.has
       * @example
       *
       *      R.hasPath(['a', 'b'], {a: {b: 2}});         // => true
       *      R.hasPath(['a', 'b'], {a: {b: undefined}}); // => true
       *      R.hasPath(['a', 'b'], {a: {c: 2}});         // => false
       *      R.hasPath(['a', 'b'], {});                  // => false
       */

      var hasPath =
      /*#__PURE__*/
      _curry2(function hasPath(_path, obj) {
        if (_path.length === 0 || isNil$1(obj)) {
          return false;
        }

        var val = obj;
        var idx = 0;

        while (idx < _path.length) {
          if (!isNil$1(val) && _has(_path[idx], val)) {
            val = val[_path[idx]];
            idx += 1;
          } else {
            return false;
          }
        }

        return true;
      });

      var hasPath$1 = hasPath;

      /**
       * Returns whether or not an object has an own property with the specified name
       *
       * @func
       * @memberOf R
       * @since v0.7.0
       * @category Object
       * @sig s -> {s: x} -> Boolean
       * @param {String} prop The name of the property to check for.
       * @param {Object} obj The object to query.
       * @return {Boolean} Whether the property exists.
       * @example
       *
       *      const hasName = R.has('name');
       *      hasName({name: 'alice'});   //=> true
       *      hasName({name: 'bob'});     //=> true
       *      hasName({});                //=> false
       *
       *      const point = {x: 0, y: 0};
       *      const pointHas = R.has(R.__, point);
       *      pointHas('x');  //=> true
       *      pointHas('y');  //=> true
       *      pointHas('z');  //=> false
       */

      var has =
      /*#__PURE__*/
      _curry2(function has(prop, obj) {
        return hasPath$1([prop], obj);
      });

      var has$1 = has;

      /**
       * Creates a function that will process either the `onTrue` or the `onFalse`
       * function depending upon the result of the `condition` predicate.
       *
       * @func
       * @memberOf R
       * @since v0.8.0
       * @category Logic
       * @sig (*... -> Boolean) -> (*... -> *) -> (*... -> *) -> (*... -> *)
       * @param {Function} condition A predicate function
       * @param {Function} onTrue A function to invoke when the `condition` evaluates to a truthy value.
       * @param {Function} onFalse A function to invoke when the `condition` evaluates to a falsy value.
       * @return {Function} A new function that will process either the `onTrue` or the `onFalse`
       *                    function depending upon the result of the `condition` predicate.
       * @see R.unless, R.when, R.cond
       * @example
       *
       *      const incCount = R.ifElse(
       *        R.has('count'),
       *        R.over(R.lensProp('count'), R.inc),
       *        R.assoc('count', 1)
       *      );
       *      incCount({});           //=> { count: 1 }
       *      incCount({ count: 1 }); //=> { count: 2 }
       */

      var ifElse =
      /*#__PURE__*/
      _curry3(function ifElse(condition, onTrue, onFalse) {
        return curryN$1(Math.max(condition.length, onTrue.length, onFalse.length), function _ifElse() {
          return condition.apply(this, arguments) ? onTrue.apply(this, arguments) : onFalse.apply(this, arguments);
        });
      });

      var ifElse$1 = ifElse;

      function _objectAssign(target) {
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        var idx = 1;
        var length = arguments.length;

        while (idx < length) {
          var source = arguments[idx];

          if (source != null) {
            for (var nextKey in source) {
              if (_has(nextKey, source)) {
                output[nextKey] = source[nextKey];
              }
            }
          }

          idx += 1;
        }

        return output;
      }

      var _objectAssign$1 = typeof Object.assign === 'function' ? Object.assign : _objectAssign;

      /**
       * See if an object (`val`) is an instance of the supplied constructor. This
       * function will check up the inheritance chain, if any.
       *
       * @func
       * @memberOf R
       * @since v0.3.0
       * @category Type
       * @sig (* -> {*}) -> a -> Boolean
       * @param {Object} ctor A constructor
       * @param {*} val The value to test
       * @return {Boolean}
       * @example
       *
       *      R.is(Object, {}); //=> true
       *      R.is(Number, 1); //=> true
       *      R.is(Object, 1); //=> false
       *      R.is(String, 's'); //=> true
       *      R.is(String, new String('')); //=> true
       *      R.is(Object, new String('')); //=> true
       *      R.is(Object, 's'); //=> false
       *      R.is(Number, {}); //=> false
       */

      var is =
      /*#__PURE__*/
      _curry2(function is(Ctor, val) {
        return val != null && val.constructor === Ctor || val instanceof Ctor;
      });

      var is$1 = is;

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

      /**
       * Create a new object with the own properties of the first object merged with
       * the own properties of the second object. If a key exists in both objects,
       * the value from the second object will be used.
       *
       * @func
       * @memberOf R
       * @since v0.26.0
       * @category Object
       * @sig {k: v} -> {k: v} -> {k: v}
       * @param {Object} l
       * @param {Object} r
       * @return {Object}
       * @see R.mergeLeft, R.mergeDeepRight, R.mergeWith, R.mergeWithKey
       * @example
       *
       *      R.mergeRight({ 'name': 'fred', 'age': 10 }, { 'age': 40 });
       *      //=> { 'name': 'fred', 'age': 40 }
       *
       *      const withDefaults = R.mergeRight({x: 0, y: 0});
       *      withDefaults({y: 2}); //=> {x: 0, y: 2}
       * @symb R.mergeRight(a, b) = {...a, ...b}
       */

      var mergeRight =
      /*#__PURE__*/
      _curry2(function mergeRight(l, r) {
        return _objectAssign$1({}, l, r);
      });

      var mergeRight$1 = mergeRight;

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

      /**
       * Returns `true` if the specified object property is equal, in
       * [`R.equals`](#equals) terms, to the given value; `false` otherwise.
       * You can test multiple properties with [`R.whereEq`](#whereEq).
       *
       * @func
       * @memberOf R
       * @since v0.1.0
       * @category Relation
       * @sig String -> a -> Object -> Boolean
       * @param {String} name
       * @param {*} val
       * @param {*} obj
       * @return {Boolean}
       * @see R.whereEq, R.propSatisfies, R.equals
       * @example
       *
       *      const abby = {name: 'Abby', age: 7, hair: 'blond'};
       *      const fred = {name: 'Fred', age: 12, hair: 'brown'};
       *      const rusty = {name: 'Rusty', age: 10, hair: 'brown'};
       *      const alois = {name: 'Alois', age: 15, disposition: 'surly'};
       *      const kids = [abby, fred, rusty, alois];
       *      const hasBrownHair = R.propEq('hair', 'brown');
       *      R.filter(hasBrownHair, kids); //=> [fred, rusty]
       */

      var propEq =
      /*#__PURE__*/
      _curry3(function propEq(name, val, obj) {
        return equals$1(val, obj[name]);
      });

      var propEq$1 = propEq;

      /**
       * Returns the result of "setting" the portion of the given data structure
       * focused by the given lens to the given value.
       *
       * @func
       * @memberOf R
       * @since v0.16.0
       * @category Object
       * @typedefn Lens s a = Functor f => (a -> f a) -> s -> f s
       * @sig Lens s a -> a -> s -> s
       * @param {Lens} lens
       * @param {*} v
       * @param {*} x
       * @return {*}
       * @see R.prop, R.lensIndex, R.lensProp
       * @example
       *
       *      const xLens = R.lensProp('x');
       *
       *      R.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}
       *      R.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}
       */

      var set$1 =
      /*#__PURE__*/
      _curry3(function set(lens, v, x) {
        return over$1(lens, always$1(v), x);
      });

      var set$2 = set$1;

      /**
       * Tests the final argument by passing it to the given predicate function. If
       * the predicate is satisfied, the function will return the result of calling
       * the `whenTrueFn` function with the same argument. If the predicate is not
       * satisfied, the argument is returned as is.
       *
       * @func
       * @memberOf R
       * @since v0.18.0
       * @category Logic
       * @sig (a -> Boolean) -> (a -> a) -> a -> a
       * @param {Function} pred       A predicate function
       * @param {Function} whenTrueFn A function to invoke when the `condition`
       *                              evaluates to a truthy value.
       * @param {*}        x          An object to test with the `pred` function and
       *                              pass to `whenTrueFn` if necessary.
       * @return {*} Either `x` or the result of applying `x` to `whenTrueFn`.
       * @see R.ifElse, R.unless, R.cond
       * @example
       *
       *      // truncate :: String -> String
       *      const truncate = R.when(
       *        R.propSatisfies(R.gt(R.__, 10), 'length'),
       *        R.pipe(R.take(10), R.append('…'), R.join(''))
       *      );
       *      truncate('12345');         //=> '12345'
       *      truncate('0123456789ABC'); //=> '0123456789…'
       */

      var when =
      /*#__PURE__*/
      _curry3(function when(pred, whenTrueFn, x) {
        return pred(x) ? whenTrueFn(x) : x;
      });

      var when$1 = when;

      class Store extends BehaviorSubject {
        constructor() {
          super(...arguments);
          this.set = (path, value) => {
            this.next(set$2(lensPath$1(path.split(".")), value, this.getValue()));
          };
          this.setActiveNode = (node) => {
            this.set("activeNode", node);
          };
          this.setBlocksCommunicationState = (blocksCommunicationState) => {
            this.set("blocksCommunicationState$", blocksCommunicationState);
          };
        }
        setArteryStore(arteryStore) {
          this.set("arteryStore$", arteryStore);
        }
      }
      function create$2(stateValue) {
        return new Store(stateValue);
      }

      const EngineStoreContext = createContext(new Store({}));
      function EngineStoreContextProvider({ children, value }) {
        return /* @__PURE__ */ React.createElement(EngineStoreContext.Provider, {
          value
        }, children);
      }
      function useEngineStoreContext() {
        return useContext(EngineStoreContext);
      }

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

      function useArtery() {
        const engineStore$ = useEngineStoreContext();
        const { arteryStore$ } = useObservable(engineStore$, {});
        return useObservable(arteryStore$, void 0);
      }

      function useCommand$1() {
        var _a;
        const engineStore$ = useEngineStoreContext();
        const { useCommandState } = useObservable(engineStore$, {});
        return (_a = useCommandState == null ? void 0 : useCommandState.commandNameRunnerMap) != null ? _a : {};
      }

      function create$1(artery) {
        return new BehaviorSubject(artery);
      }
      function set(store$, artery) {
        store$ == null ? void 0 : store$.next(artery);
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
      const uuid = exports('uuid', customAlphabet("1234567890qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM", 8));
      function generateNodeId(prefix) {
        return `${prefix || ""}${uuid()}`;
      }
      function buildHTMLNode(params) {
        return __spreadValues$3({
          id: generateNodeId(`${params.name}-`),
          type: "html-element"
        }, params);
      }
      function buildLinkNode(params) {
        return __spreadValues$3({
          id: generateNodeId("link-"),
          type: "html-element",
          name: "a",
          isLink: true
        }, params);
      }
      function buildReactComponentNode(params) {
        return __spreadValues$3({
          id: generateNodeId("react-component-"),
          type: "react-component"
        }, params);
      }
      function buildIndividualLoopContainerNode(params) {
        return __spreadValues$3({
          id: generateNodeId("individual-loop-container-"),
          type: "loop-container"
        }, params);
      }
      function buildComposedNodeLoopContainerNode(params) {
        return __spreadValues$3({
          id: generateNodeId("composedNode-loop-container-"),
          type: "loop-container"
        }, params);
      }
      function buildRefNode(params) {
        return __spreadValues$3({
          id: generateNodeId("ref-"),
          type: "ref-node"
        }, params);
      }
      function buildJSXNode(params) {
        return __spreadValues$3({
          id: generateNodeId("jsx-"),
          type: "jsx-node"
        }, params);
      }
      function buildRouteNode(params) {
        return __spreadValues$3({
          id: generateNodeId("route-"),
          type: "route-node"
        }, params);
      }
      function buildBlockId(block) {
        if (!block.id) {
          block.id = generateNodeId("block-");
        }
      }
      function buildeLayerId(layer) {
        if (!layer.id) {
          layer.id = generateNodeId("layer-");
        }
        layer.blocks.forEach(buildBlockId);
        return layer;
      }

      function isArteryNode(node) {
        return has$1("id", node);
      }
      function isLoopContainerNode(node) {
        return node.type === "loop-container";
      }
      function isIndividualLoopContainer(node) {
        return isLoopContainerNode(node) && has$1("toProps", node);
      }
      function isComposedNodeLoopContainerNode(node) {
        return isLoopContainerNode(node) && node.node.type === "composed-node";
      }
      function isComposedNodeChildNode(node) {
        return has$1("toProps", node);
      }
      function isNodeHasToProps(node) {
        return isIndividualLoopContainer(node) || isComposedNodeChildNode(node);
      }
      function isHTMLNode(node) {
        return node.type === "html-element";
      }
      function isLinkNode(node) {
        return isHTMLNode(node) && propEq$1("isLink", true, node);
      }
      function isReactComponentNode(node) {
        return node.type === "react-component";
      }
      function isNodeAcceptChild(node) {
        return isHTMLNode(node) || isReactComponentNode(node);
      }
      function isReactComponentNodeWithExportName(node, exportName) {
        return isReactComponentNode(node) && node.exportName === exportName;
      }
      function isRefNode(node) {
        return node.type === "ref-node";
      }
      function isJSXNode(node) {
        return node.type === "jsx-node";
      }
      function isRouteNode(node) {
        return node.type === "route-node";
      }
      function isHasSubNode(node) {
        return isLoopContainerNode(node) || isRouteNode(node);
      }
      const isObject = exports('isObject', is$1(Object));

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
      function Block(props) {
        var _a, _b;
        const { style, render: Render, id = "", onUpdateLayer } = props;
        const engineStore$ = useEngineStoreContext();
        const engineState = useObservable(engineStore$, {});
        const { arteryStore$, blocksCommunicationState$, activeNode, useCommandState } = engineState;
        const artery = useObservable(arteryStore$, void 0);
        const sharedState = useObservable(blocksCommunicationState$, {});
        useCommandState == null ? void 0 : useCommandState.registry({
          name: "updateArtery",
          execute: (newArtery) => {
            if (!artery) {
              return {};
            }
            return {
              redo() {
                set(arteryStore$, newArtery);
              },
              undo() {
                set(arteryStore$, artery);
              }
            };
          }
        });
        const handleArteryChange = useCallback((artery2) => {
          var _a2, _b2;
          (_b2 = (_a2 = useCommandState == null ? void 0 : useCommandState.commandNameRunnerMap) == null ? void 0 : _a2.updateArtery) == null ? void 0 : _b2.call(_a2, artery2);
        }, [useCommandState]);
        const handleSharedStateChange = useCallback((path, value) => {
          blocksCommunicationState$.next(set$2(lensPath$1(path.split(".")), value, sharedState));
        }, [sharedState, blocksCommunicationState$]);
        const handleSetActiveNode = useCallback((node) => {
          engineStore$.setActiveNode(node);
        }, [engineStore$]);
        const onUpdateBlock = useCallback((params) => {
          var _a2;
          onUpdateLayer(__spreadProps$2(__spreadValues$2({}, params), { blockId: (_a2 = params.blockId) != null ? _a2 : id }));
        }, [id, onUpdateLayer]);
        const { currentUndoRedoIndex, redoUndoList } = (_b = (_a = useCommandState == null ? void 0 : useCommandState.commandStateRef) == null ? void 0 : _a.current) != null ? _b : {};
        const hasRedoUndoList = and$1(redoUndoList, currentUndoRedoIndex);
        const commandsHasNext = hasRedoUndoList ? currentUndoRedoIndex < redoUndoList.length - 1 : false;
        const commandsHasPrev = hasRedoUndoList ? currentUndoRedoIndex > -1 : false;
        if (!artery || !blocksCommunicationState$) {
          return null;
        }
        return /* @__PURE__ */ React.createElement("div", {
          className: "artery-engine-layer-block",
          style
        }, /* @__PURE__ */ React.createElement(Render, {
          artery,
          onChange: handleArteryChange,
          sharedState,
          onSharedStateChange: handleSharedStateChange,
          activeNode,
          commands: useCommandState == null ? void 0 : useCommandState.commandNameRunnerMap,
          commandsHasNext,
          commandsHasPrev,
          generateNodeId,
          setActiveNode: handleSetActiveNode,
          onUpdateLayer,
          onUpdateBlock
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

      var css_248z$1 = ".artery-engine-layer {\n  position: fixed;\n  inset: 0;\n  border-radius: 5px;\n  overflow: hidden;\n}";
      styleInject(css_248z$1);

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
      function Layer(props) {
        const { blocks, zIndex, style, updateLayer, id = "" } = props;
        const arteryEngineLayerStyle = mergeRight$1({
          display: "grid",
          gap: "1px",
          zIndex
        }, style);
        const hideFilter = useCallback(({ hide }) => {
          return hide !== true;
        }, []);
        const handleUpdateLayer = useCallback((params) => {
          var _a;
          updateLayer(__spreadProps$1(__spreadValues$1({}, params), { layerId: (_a = params.layerId) != null ? _a : id }));
        }, [id, updateLayer]);
        return /* @__PURE__ */ React.createElement("div", {
          className: "artery-engine-layer",
          style: arteryEngineLayerStyle
        }, blocks.filter(hideFilter).map((block) => /* @__PURE__ */ React.createElement(Block, __spreadProps$1(__spreadValues$1({}, block), {
          key: block.id,
          onUpdateLayer: handleUpdateLayer
        }))));
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
      function Core(props) {
        const { layersStore$, blocksCommunicationStateInitialValue } = props;
        const layers = useObservable(layersStore$, []);
        const engineStore$ = useEngineStoreContext();
        const blocksCommunicationState$ = useMemo(() => new BehaviorSubject(blocksCommunicationStateInitialValue), []);
        useEffect(() => {
          engineStore$.setBlocksCommunicationState(blocksCommunicationState$);
        }, []);
        const updateLayer = useCallback(({ layerId, blockId, name, value }) => {
          var _a;
          const layerIndex = layers.findIndex((layer2) => layer2.id === layerId);
          const layer = layers[layerIndex];
          const blockIndex = (_a = layer == null ? void 0 : layer.blocks.findIndex((block) => block.id === blockId)) != null ? _a : -1;
          const getValue = (leftValue, rightvalue) => {
            const isAllObject = isObject(leftValue) && isObject(rightvalue);
            return isAllObject ? mergeRight$1(leftValue, rightvalue) : rightvalue;
          };
          const updater = () => {
            const getNewLayers = ifElse$1(() => !blockId, () => over$1(lensPath$1([layerIndex]), (layer2) => Object.assign(layer2, { [name]: getValue(layer2[name], value) }), layers), () => over$1(lensPath$1([layerIndex, "blocks", blockIndex]), (block) => Object.assign(block, { [name]: getValue(block[name], value) }), layers));
            layersStore$.next(getNewLayers());
          };
          const updateWhenExists = when$1((layer2) => or$1(and$1(!!layer2, !blockId), and$1(!!blockId, blockIndex !== -1)), updater);
          updateWhenExists(layer);
        }, [layersStore$, layers]);
        const hideFilter = useCallback((layer) => {
          return layer.hide !== true;
        }, []);
        return /* @__PURE__ */ React.createElement(React.Fragment, null, layers.filter(hideFilter).map((layer, index) => /* @__PURE__ */ React.createElement(Layer, __spreadProps(__spreadValues({}, layer), {
          key: layer.id,
          zIndex: index,
          updateLayer
        }))));
      }

      const initialCommandState = {
        currentUndoRedoIndex: -1,
        redoUndoList: [],
        commandList: [],
        commandNameRunnerMap: {},
        destroyList: []
      };
      const getUndoCommand = (commandStateRef) => {
        return {
          name: "undo",
          keyboard: ["ctrl+z"],
          execute() {
            return {
              redo: () => {
                var _a, _b;
                const { currentUndoRedoIndex, redoUndoList } = commandStateRef.current;
                if (currentUndoRedoIndex === -1) {
                  return;
                }
                (_b = (_a = redoUndoList[currentUndoRedoIndex]).undo) == null ? void 0 : _b.call(_a);
                commandStateRef.current.currentUndoRedoIndex--;
              }
            };
          }
        };
      };
      const getRedoCommand = (commandStateRef) => {
        return {
          name: "redo",
          keyboard: ["ctrl+y", "ctrl+shift+z"],
          execute() {
            return {
              redo: () => {
                var _a, _b;
                const { currentUndoRedoIndex, redoUndoList } = commandStateRef.current;
                if (currentUndoRedoIndex === redoUndoList.length - 1) {
                  return;
                }
                (_b = (_a = redoUndoList[currentUndoRedoIndex + 1]).redo) == null ? void 0 : _b.call(_a);
                commandStateRef.current.currentUndoRedoIndex++;
              }
            };
          }
        };
      };
      function useCommandInternal(commandStateRef) {
        const { commandNameRunnerMap } = commandStateRef.current;
        const registry = useCallback((command) => {
          const { name, execute, initer } = command;
          const {
            commandList,
            commandNameRunnerMap: commandNameRunnerMap2,
            redoUndoList,
            currentUndoRedoIndex,
            destroyList
          } = commandStateRef.current;
          const initEffect = initer == null ? void 0 : initer();
          if (initEffect) {
            destroyList.push(initEffect);
          }
          if (commandNameRunnerMap2[name]) {
            const existsIndex = commandList.findIndex((item) => item.name === name);
            commandList.splice(existsIndex, 1);
          }
          commandList.push(command);
          commandNameRunnerMap2[name] = (...args) => {
            const { redo, undo } = execute(...args);
            if (!redo) {
              return;
            }
            redo();
            if (!undo) {
              return;
            }
            let newRedoUndoList = redoUndoList;
            if (newRedoUndoList.length) {
              newRedoUndoList = newRedoUndoList.slice(0, currentUndoRedoIndex + 1);
            }
            newRedoUndoList = append$1({ redo, undo }, newRedoUndoList);
            const newCurrentUndoRedoIndex = currentUndoRedoIndex + 1;
            Object.assign(commandStateRef.current, {
              redoUndoList: newRedoUndoList,
              currentUndoRedoIndex: newCurrentUndoRedoIndex
            });
          };
        }, []);
        const onKeyDown = useCallback((e) => {
          const { commandList, commandNameRunnerMap: commandNameRunnerMap2 } = commandStateRef.current;
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
          commandList.forEach((command) => {
            var _a;
            if (!command.keyboard) {
              return;
            }
            const keys2 = Array.isArray(command.keyboard) ? command.keyboard : [command.keyboard];
            if (keys2.includes(keyNames)) {
              (_a = commandNameRunnerMap2[command.name]) == null ? void 0 : _a.call(commandNameRunnerMap2);
            }
          });
        }, []);
        const init = useCallback(() => {
          registry(getUndoCommand(commandStateRef));
          registry(getRedoCommand(commandStateRef));
        }, []);
        return { registry, onKeyDown, init, commandNameRunnerMap };
      }
      function useCommand() {
        const commandStateRef = useRef(initialCommandState);
        const { registry, onKeyDown, init, commandNameRunnerMap } = useCommandInternal(commandStateRef);
        useEffect(() => {
          init();
        }, [init]);
        useEffect(() => {
          window.addEventListener("keydown", onKeyDown, true);
          return () => {
            window.removeEventListener("keydown", onKeyDown, true);
            commandStateRef.current.destroyList.forEach((fn) => fn == null ? void 0 : fn());
          };
        }, [onKeyDown]);
        return { registry, commandNameRunnerMap, commandStateRef };
      }

      function create(layers) {
        return new BehaviorSubject(layers != null ? layers : []);
      }

      var css_248z = "html, body {\n  height: 100%;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n}";
      styleInject(css_248z);

      function ArteryEngine(props) {
        const { artery, layers, blocksCommunicationStateInitialValue } = props;
        const arteryStore$ = useMemo(() => create$1(artery), []);
        const useCommandState = useCommand();
        const engineStore$ = useMemo(() => create$2({ arteryStore$, useCommandState }), []);
        const layersStore$ = useMemo(() => create(layers.map(buildeLayerId)), []);
        useEffect(() => {
          engineStore$.setArteryStore(arteryStore$);
        }, [arteryStore$]);
        return /* @__PURE__ */ React.createElement(EngineStoreContextProvider, {
          value: engineStore$
        }, /* @__PURE__ */ React.createElement(Core, {
          layersStore$,
          blocksCommunicationStateInitialValue
        }));
      }

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19pc1BsYWNlaG9sZGVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2N1cnJ5MS5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19jdXJyeTIuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9fY29uY2F0LmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2FyaXR5LmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2N1cnJ5Ti5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2N1cnJ5Ti5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19jdXJyeTMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9faXNBcnJheS5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19pc1RyYW5zZm9ybWVyLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2Rpc3BhdGNoYWJsZS5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL194ZkJhc2UuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9fbWFwLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2lzU3RyaW5nLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2lzQXJyYXlMaWtlLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX3h3cmFwLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvYmluZC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19yZWR1Y2UuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9feG1hcC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19oYXMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9faXNBcmd1bWVudHMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9rZXlzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvbWFwLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2lzSW50ZWdlci5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL250aC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL3BhdGhzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvcGF0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2Fsd2F5cy5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2FuZC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2FwcGVuZC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2Fzc29jLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaXNOaWwuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9hc3NvY1BhdGguanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy90eXBlLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2FycmF5RnJvbUl0ZXJhdG9yLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX2luY2x1ZGVzV2l0aC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2ludGVybmFsL19mdW5jdGlvbk5hbWUuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9fb2JqZWN0SXMuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9pbnRlcm5hbC9fZXF1YWxzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvZXF1YWxzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvb3IuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9oYXNQYXRoLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaGFzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaWZFbHNlLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvaW50ZXJuYWwvX29iamVjdEFzc2lnbi5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2lzLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvbGVucy5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL2xlbnNQYXRoLmpzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3JhbWRhQDAuMjcuMi9ub2RlX21vZHVsZXMvcmFtZGEvZXMvbWVyZ2VSaWdodC5qcyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9yYW1kYUAwLjI3LjIvbm9kZV9tb2R1bGVzL3JhbWRhL2VzL292ZXIuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9wcm9wRXEuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy9zZXQuanMiLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcmFtZGFAMC4yNy4yL25vZGVfbW9kdWxlcy9yYW1kYS9lcy93aGVuLmpzIiwiLi4vLi4vLi4vc3JjL3N0b3Jlcy9lbmdpbmUudHMiLCIuLi8uLi8uLi9zcmMvY29udGV4dC50c3giLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLW9ic2VydmFibGUudHMiLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLWFydGVyeS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2UtY29tbWFuZC50cyIsIi4uLy4uLy4uL3NyYy9zdG9yZXMvYXJ0ZXJ5LnRzIiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL25hbm9pZEAzLjMuMy9ub2RlX21vZHVsZXMvbmFub2lkL2luZGV4LmJyb3dzZXIuanMiLCIuLi8uLi8uLi9zcmMvdXRpbHMvYnVpbGQudHMiLCIuLi8uLi8uLi9zcmMvdXRpbHMvcHJlZGljYXRlLnRzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvYmxvY2svaW5kZXgudHN4IiwiLi4vLi4vLi4vLi4vLi4vY29tbW9uL3RlbXAvbm9kZV9tb2R1bGVzLy5wbnBtL3N0eWxlLWluamVjdEAwLjMuMC9ub2RlX21vZHVsZXMvc3R5bGUtaW5qZWN0L2Rpc3Qvc3R5bGUtaW5qZWN0LmVzLmpzIiwiLi4vLi4vLi4vc3JjL2NvbXBvbmVudHMvbGF5ZXIvaW5kZXgudHN4IiwiLi4vLi4vLi4vc3JjL2NvcmUudHN4IiwiLi4vLi4vLi4vc3JjL3BsdWdpbi9jb21tYW5kLnRzIiwiLi4vLi4vLi4vc3JjL3N0b3Jlcy9sYXllci50cyIsIi4uLy4uLy4uL3NyYy9hcHAudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9pc1BsYWNlaG9sZGVyKGEpIHtcbiAgcmV0dXJuIGEgIT0gbnVsbCAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcgJiYgYVsnQEBmdW5jdGlvbmFsL3BsYWNlaG9sZGVyJ10gPT09IHRydWU7XG59IiwiaW1wb3J0IF9pc1BsYWNlaG9sZGVyIGZyb20gXCIuL19pc1BsYWNlaG9sZGVyLmpzXCI7XG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCBvbmUtYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jdXJyeTEoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYxKGEpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCB8fCBfaXNQbGFjZWhvbGRlcihhKSkge1xuICAgICAgcmV0dXJuIGYxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH07XG59IiwiaW1wb3J0IF9jdXJyeTEgZnJvbSBcIi4vX2N1cnJ5MS5qc1wiO1xuaW1wb3J0IF9pc1BsYWNlaG9sZGVyIGZyb20gXCIuL19pc1BsYWNlaG9sZGVyLmpzXCI7XG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCB0d28tYXJpdHkgY3VycnkgZnVuY3Rpb24uXG4gKlxuICogQHByaXZhdGVcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jdXJyeTIoZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGYyKGEsIGIpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgcmV0dXJuIGYyO1xuXG4gICAgICBjYXNlIDE6XG4gICAgICAgIHJldHVybiBfaXNQbGFjZWhvbGRlcihhKSA/IGYyIDogX2N1cnJ5MShmdW5jdGlvbiAoX2IpIHtcbiAgICAgICAgICByZXR1cm4gZm4oYSwgX2IpO1xuICAgICAgICB9KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gZjIgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKF9hLCBiKTtcbiAgICAgICAgfSkgOiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIF9iKTtcbiAgICAgICAgfSkgOiBmbihhLCBiKTtcbiAgICB9XG4gIH07XG59IiwiLyoqXG4gKiBQcml2YXRlIGBjb25jYXRgIGZ1bmN0aW9uIHRvIG1lcmdlIHR3byBhcnJheS1saWtlIG9iamVjdHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7QXJyYXl8QXJndW1lbnRzfSBbc2V0MT1bXV0gQW4gYXJyYXktbGlrZSBvYmplY3QuXG4gKiBAcGFyYW0ge0FycmF5fEFyZ3VtZW50c30gW3NldDI9W11dIEFuIGFycmF5LWxpa2Ugb2JqZWN0LlxuICogQHJldHVybiB7QXJyYXl9IEEgbmV3LCBtZXJnZWQgYXJyYXkuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX2NvbmNhdChbNCwgNSwgNl0sIFsxLCAyLCAzXSk7IC8vPT4gWzQsIDUsIDYsIDEsIDIsIDNdXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jb25jYXQoc2V0MSwgc2V0Mikge1xuICBzZXQxID0gc2V0MSB8fCBbXTtcbiAgc2V0MiA9IHNldDIgfHwgW107XG4gIHZhciBpZHg7XG4gIHZhciBsZW4xID0gc2V0MS5sZW5ndGg7XG4gIHZhciBsZW4yID0gc2V0Mi5sZW5ndGg7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgaWR4ID0gMDtcblxuICB3aGlsZSAoaWR4IDwgbGVuMSkge1xuICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXSA9IHNldDFbaWR4XTtcbiAgICBpZHggKz0gMTtcbiAgfVxuXG4gIGlkeCA9IDA7XG5cbiAgd2hpbGUgKGlkeCA8IGxlbjIpIHtcbiAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF0gPSBzZXQyW2lkeF07XG4gICAgaWR4ICs9IDE7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9hcml0eShuLCBmbikge1xuICAvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xuICBzd2l0Y2ggKG4pIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGEwKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgMjpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgMzpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMikge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDQ6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzKSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgNTpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0KSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgNjpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDc6XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKGEwLCBhMSwgYTIsIGEzLCBhNCwgYTUsIGE2KSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgODpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3KSB7XG4gICAgICAgIHJldHVybiBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcblxuICAgIGNhc2UgOTpcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoYTAsIGExLCBhMiwgYTMsIGE0LCBhNSwgYTYsIGE3LCBhOCkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBjYXNlIDEwOlxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChhMCwgYTEsIGEyLCBhMywgYTQsIGE1LCBhNiwgYTcsIGE4LCBhOSkge1xuICAgICAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG5cbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCB0byBfYXJpdHkgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBpbnRlZ2VyIG5vIGdyZWF0ZXIgdGhhbiB0ZW4nKTtcbiAgfVxufSIsImltcG9ydCBfYXJpdHkgZnJvbSBcIi4vX2FyaXR5LmpzXCI7XG5pbXBvcnQgX2lzUGxhY2Vob2xkZXIgZnJvbSBcIi4vX2lzUGxhY2Vob2xkZXIuanNcIjtcbi8qKlxuICogSW50ZXJuYWwgY3VycnlOIGZ1bmN0aW9uLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBwYXJhbSB7TnVtYmVyfSBsZW5ndGggVGhlIGFyaXR5IG9mIHRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtBcnJheX0gcmVjZWl2ZWQgQW4gYXJyYXkgb2YgYXJndW1lbnRzIHJlY2VpdmVkIHRodXMgZmFyLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IFRoZSBjdXJyaWVkIGZ1bmN0aW9uLlxuICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9jdXJyeU4obGVuZ3RoLCByZWNlaXZlZCwgZm4pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY29tYmluZWQgPSBbXTtcbiAgICB2YXIgYXJnc0lkeCA9IDA7XG4gICAgdmFyIGxlZnQgPSBsZW5ndGg7XG4gICAgdmFyIGNvbWJpbmVkSWR4ID0gMDtcblxuICAgIHdoaWxlIChjb21iaW5lZElkeCA8IHJlY2VpdmVkLmxlbmd0aCB8fCBhcmdzSWR4IDwgYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgdmFyIHJlc3VsdDtcblxuICAgICAgaWYgKGNvbWJpbmVkSWR4IDwgcmVjZWl2ZWQubGVuZ3RoICYmICghX2lzUGxhY2Vob2xkZXIocmVjZWl2ZWRbY29tYmluZWRJZHhdKSB8fCBhcmdzSWR4ID49IGFyZ3VtZW50cy5sZW5ndGgpKSB7XG4gICAgICAgIHJlc3VsdCA9IHJlY2VpdmVkW2NvbWJpbmVkSWR4XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdCA9IGFyZ3VtZW50c1thcmdzSWR4XTtcbiAgICAgICAgYXJnc0lkeCArPSAxO1xuICAgICAgfVxuXG4gICAgICBjb21iaW5lZFtjb21iaW5lZElkeF0gPSByZXN1bHQ7XG5cbiAgICAgIGlmICghX2lzUGxhY2Vob2xkZXIocmVzdWx0KSkge1xuICAgICAgICBsZWZ0IC09IDE7XG4gICAgICB9XG5cbiAgICAgIGNvbWJpbmVkSWR4ICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIGxlZnQgPD0gMCA/IGZuLmFwcGx5KHRoaXMsIGNvbWJpbmVkKSA6IF9hcml0eShsZWZ0LCBfY3VycnlOKGxlbmd0aCwgY29tYmluZWQsIGZuKSk7XG4gIH07XG59IiwiaW1wb3J0IF9hcml0eSBmcm9tIFwiLi9pbnRlcm5hbC9fYXJpdHkuanNcIjtcbmltcG9ydCBfY3VycnkxIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTEuanNcIjtcbmltcG9ydCBfY3VycnkyIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTIuanNcIjtcbmltcG9ydCBfY3VycnlOIGZyb20gXCIuL2ludGVybmFsL19jdXJyeU4uanNcIjtcbi8qKlxuICogUmV0dXJucyBhIGN1cnJpZWQgZXF1aXZhbGVudCBvZiB0aGUgcHJvdmlkZWQgZnVuY3Rpb24sIHdpdGggdGhlIHNwZWNpZmllZFxuICogYXJpdHkuIFRoZSBjdXJyaWVkIGZ1bmN0aW9uIGhhcyB0d28gdW51c3VhbCBjYXBhYmlsaXRpZXMuIEZpcnN0LCBpdHNcbiAqIGFyZ3VtZW50cyBuZWVkbid0IGJlIHByb3ZpZGVkIG9uZSBhdCBhIHRpbWUuIElmIGBnYCBpcyBgUi5jdXJyeU4oMywgZilgLCB0aGVcbiAqIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSkoMikoMylgXG4gKiAgIC0gYGcoMSkoMiwgMylgXG4gKiAgIC0gYGcoMSwgMikoMylgXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKlxuICogU2Vjb25kbHksIHRoZSBzcGVjaWFsIHBsYWNlaG9sZGVyIHZhbHVlIFtgUi5fX2BdKCNfXykgbWF5IGJlIHVzZWQgdG8gc3BlY2lmeVxuICogXCJnYXBzXCIsIGFsbG93aW5nIHBhcnRpYWwgYXBwbGljYXRpb24gb2YgYW55IGNvbWJpbmF0aW9uIG9mIGFyZ3VtZW50cyxcbiAqIHJlZ2FyZGxlc3Mgb2YgdGhlaXIgcG9zaXRpb25zLiBJZiBgZ2AgaXMgYXMgYWJvdmUgYW5kIGBfYCBpcyBbYFIuX19gXSgjX18pLFxuICogdGhlIGZvbGxvd2luZyBhcmUgZXF1aXZhbGVudDpcbiAqXG4gKiAgIC0gYGcoMSwgMiwgMylgXG4gKiAgIC0gYGcoXywgMiwgMykoMSlgXG4gKiAgIC0gYGcoXywgXywgMykoMSkoMilgXG4gKiAgIC0gYGcoXywgXywgMykoMSwgMilgXG4gKiAgIC0gYGcoXywgMikoMSkoMylgXG4gKiAgIC0gYGcoXywgMikoMSwgMylgXG4gKiAgIC0gYGcoXywgMikoXywgMykoMSlgXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuNS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgTnVtYmVyIC0+ICgqIC0+IGEpIC0+ICgqIC0+IGEpXG4gKiBAcGFyYW0ge051bWJlcn0gbGVuZ3RoIFRoZSBhcml0eSBmb3IgdGhlIHJldHVybmVkIGZ1bmN0aW9uLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gVGhlIGZ1bmN0aW9uIHRvIGN1cnJ5LlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3LCBjdXJyaWVkIGZ1bmN0aW9uLlxuICogQHNlZSBSLmN1cnJ5XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3Qgc3VtQXJncyA9ICguLi5hcmdzKSA9PiBSLnN1bShhcmdzKTtcbiAqXG4gKiAgICAgIGNvbnN0IGN1cnJpZWRBZGRGb3VyTnVtYmVycyA9IFIuY3VycnlOKDQsIHN1bUFyZ3MpO1xuICogICAgICBjb25zdCBmID0gY3VycmllZEFkZEZvdXJOdW1iZXJzKDEsIDIpO1xuICogICAgICBjb25zdCBnID0gZigzKTtcbiAqICAgICAgZyg0KTsgLy89PiAxMFxuICovXG5cbnZhciBjdXJyeU4gPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBjdXJyeU4obGVuZ3RoLCBmbikge1xuICBpZiAobGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIF9jdXJyeTEoZm4pO1xuICB9XG5cbiAgcmV0dXJuIF9hcml0eShsZW5ndGgsIF9jdXJyeU4obGVuZ3RoLCBbXSwgZm4pKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBjdXJyeU47IiwiaW1wb3J0IF9jdXJyeTEgZnJvbSBcIi4vX2N1cnJ5MS5qc1wiO1xuaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IF9pc1BsYWNlaG9sZGVyIGZyb20gXCIuL19pc1BsYWNlaG9sZGVyLmpzXCI7XG4vKipcbiAqIE9wdGltaXplZCBpbnRlcm5hbCB0aHJlZS1hcml0eSBjdXJyeSBmdW5jdGlvbi5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gY3VycnkuXG4gKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGN1cnJpZWQgZnVuY3Rpb24uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2N1cnJ5Myhmbikge1xuICByZXR1cm4gZnVuY3Rpb24gZjMoYSwgYiwgYykge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICByZXR1cm4gZjM7XG5cbiAgICAgIGNhc2UgMTpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpID8gZjMgOiBfY3VycnkyKGZ1bmN0aW9uIChfYiwgX2MpIHtcbiAgICAgICAgICByZXR1cm4gZm4oYSwgX2IsIF9jKTtcbiAgICAgICAgfSk7XG5cbiAgICAgIGNhc2UgMjpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpID8gZjMgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTIoZnVuY3Rpb24gKF9hLCBfYykge1xuICAgICAgICAgIHJldHVybiBmbihfYSwgYiwgX2MpO1xuICAgICAgICB9KSA6IF9pc1BsYWNlaG9sZGVyKGIpID8gX2N1cnJ5MihmdW5jdGlvbiAoX2IsIF9jKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIF9iLCBfYyk7XG4gICAgICAgIH0pIDogX2N1cnJ5MShmdW5jdGlvbiAoX2MpIHtcbiAgICAgICAgICByZXR1cm4gZm4oYSwgYiwgX2MpO1xuICAgICAgICB9KTtcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGIpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gZjMgOiBfaXNQbGFjZWhvbGRlcihhKSAmJiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTIoZnVuY3Rpb24gKF9hLCBfYikge1xuICAgICAgICAgIHJldHVybiBmbihfYSwgX2IsIGMpO1xuICAgICAgICB9KSA6IF9pc1BsYWNlaG9sZGVyKGEpICYmIF9pc1BsYWNlaG9sZGVyKGMpID8gX2N1cnJ5MihmdW5jdGlvbiAoX2EsIF9jKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKF9hLCBiLCBfYyk7XG4gICAgICAgIH0pIDogX2lzUGxhY2Vob2xkZXIoYikgJiYgX2lzUGxhY2Vob2xkZXIoYykgPyBfY3VycnkyKGZ1bmN0aW9uIChfYiwgX2MpIHtcbiAgICAgICAgICByZXR1cm4gZm4oYSwgX2IsIF9jKTtcbiAgICAgICAgfSkgOiBfaXNQbGFjZWhvbGRlcihhKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKF9hLCBiLCBjKTtcbiAgICAgICAgfSkgOiBfaXNQbGFjZWhvbGRlcihiKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9iKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIF9iLCBjKTtcbiAgICAgICAgfSkgOiBfaXNQbGFjZWhvbGRlcihjKSA/IF9jdXJyeTEoZnVuY3Rpb24gKF9jKSB7XG4gICAgICAgICAgcmV0dXJuIGZuKGEsIGIsIF9jKTtcbiAgICAgICAgfSkgOiBmbihhLCBiLCBjKTtcbiAgICB9XG4gIH07XG59IiwiLyoqXG4gKiBUZXN0cyB3aGV0aGVyIG9yIG5vdCBhbiBvYmplY3QgaXMgYW4gYXJyYXkuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBvYmplY3QgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgdmFsYCBpcyBhbiBhcnJheSwgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgX2lzQXJyYXkoW10pOyAvLz0+IHRydWVcbiAqICAgICAgX2lzQXJyYXkobnVsbCk7IC8vPT4gZmFsc2VcbiAqICAgICAgX2lzQXJyYXkoe30pOyAvLz0+IGZhbHNlXG4gKi9cbmV4cG9ydCBkZWZhdWx0IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gX2lzQXJyYXkodmFsKSB7XG4gIHJldHVybiB2YWwgIT0gbnVsbCAmJiB2YWwubGVuZ3RoID49IDAgJiYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59OyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9pc1RyYW5zZm9ybWVyKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgdHlwZW9mIG9ialsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9PT0gJ2Z1bmN0aW9uJztcbn0iLCJpbXBvcnQgX2lzQXJyYXkgZnJvbSBcIi4vX2lzQXJyYXkuanNcIjtcbmltcG9ydCBfaXNUcmFuc2Zvcm1lciBmcm9tIFwiLi9faXNUcmFuc2Zvcm1lci5qc1wiO1xuLyoqXG4gKiBSZXR1cm5zIGEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIHdpdGggZGlmZmVyZW50IHN0cmF0ZWdpZXMgYmFzZWQgb24gdGhlXG4gKiBvYmplY3QgaW4gbGlzdCBwb3NpdGlvbiAobGFzdCBhcmd1bWVudCkuIElmIGl0IGlzIGFuIGFycmF5LCBleGVjdXRlcyBbZm5dLlxuICogT3RoZXJ3aXNlLCBpZiBpdCBoYXMgYSBmdW5jdGlvbiB3aXRoIG9uZSBvZiB0aGUgZ2l2ZW4gbWV0aG9kIG5hbWVzLCBpdCB3aWxsXG4gKiBleGVjdXRlIHRoYXQgZnVuY3Rpb24gKGZ1bmN0b3IgY2FzZSkuIE90aGVyd2lzZSwgaWYgaXQgaXMgYSB0cmFuc2Zvcm1lcixcbiAqIHVzZXMgdHJhbnNkdWNlciBbeGZdIHRvIHJldHVybiBhIG5ldyB0cmFuc2Zvcm1lciAodHJhbnNkdWNlciBjYXNlKS5cbiAqIE90aGVyd2lzZSwgaXQgd2lsbCBkZWZhdWx0IHRvIGV4ZWN1dGluZyBbZm5dLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge0FycmF5fSBtZXRob2ROYW1lcyBwcm9wZXJ0aWVzIHRvIGNoZWNrIGZvciBhIGN1c3RvbSBpbXBsZW1lbnRhdGlvblxuICogQHBhcmFtIHtGdW5jdGlvbn0geGYgdHJhbnNkdWNlciB0byBpbml0aWFsaXplIGlmIG9iamVjdCBpcyB0cmFuc2Zvcm1lclxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm4gZGVmYXVsdCByYW1kYSBpbXBsZW1lbnRhdGlvblxuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCBkaXNwYXRjaGVzIG9uIG9iamVjdCBpbiBsaXN0IHBvc2l0aW9uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2Rpc3BhdGNoYWJsZShtZXRob2ROYW1lcywgeGYsIGZuKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBmbigpO1xuICAgIH1cblxuICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAwKTtcbiAgICB2YXIgb2JqID0gYXJncy5wb3AoKTtcblxuICAgIGlmICghX2lzQXJyYXkob2JqKSkge1xuICAgICAgdmFyIGlkeCA9IDA7XG5cbiAgICAgIHdoaWxlIChpZHggPCBtZXRob2ROYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbbWV0aG9kTmFtZXNbaWR4XV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gb2JqW21ldGhvZE5hbWVzW2lkeF1dLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZHggKz0gMTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9pc1RyYW5zZm9ybWVyKG9iaikpIHtcbiAgICAgICAgdmFyIHRyYW5zZHVjZXIgPSB4Zi5hcHBseShudWxsLCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIHRyYW5zZHVjZXIob2JqKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0iLCJleHBvcnQgZGVmYXVsdCB7XG4gIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL2luaXQnXSgpO1xuICB9LFxuICByZXN1bHQ6IGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddKHJlc3VsdCk7XG4gIH1cbn07IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX21hcChmbiwgZnVuY3Rvcikge1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGZ1bmN0b3IubGVuZ3RoO1xuICB2YXIgcmVzdWx0ID0gQXJyYXkobGVuKTtcblxuICB3aGlsZSAoaWR4IDwgbGVuKSB7XG4gICAgcmVzdWx0W2lkeF0gPSBmbihmdW5jdG9yW2lkeF0pO1xuICAgIGlkeCArPSAxO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn0iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfaXNTdHJpbmcoeCkge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBTdHJpbmddJztcbn0iLCJpbXBvcnQgX2N1cnJ5MSBmcm9tIFwiLi9fY3VycnkxLmpzXCI7XG5pbXBvcnQgX2lzQXJyYXkgZnJvbSBcIi4vX2lzQXJyYXkuanNcIjtcbmltcG9ydCBfaXNTdHJpbmcgZnJvbSBcIi4vX2lzU3RyaW5nLmpzXCI7XG4vKipcbiAqIFRlc3RzIHdoZXRoZXIgb3Igbm90IGFuIG9iamVjdCBpcyBzaW1pbGFyIHRvIGFuIGFycmF5LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgKiAtPiBCb29sZWFuXG4gKiBAcGFyYW0geyp9IHggVGhlIG9iamVjdCB0byB0ZXN0LlxuICogQHJldHVybiB7Qm9vbGVhbn0gYHRydWVgIGlmIGB4YCBoYXMgYSBudW1lcmljIGxlbmd0aCBwcm9wZXJ0eSBhbmQgZXh0cmVtZSBpbmRpY2VzIGRlZmluZWQ7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIF9pc0FycmF5TGlrZShbXSk7IC8vPT4gdHJ1ZVxuICogICAgICBfaXNBcnJheUxpa2UodHJ1ZSk7IC8vPT4gZmFsc2VcbiAqICAgICAgX2lzQXJyYXlMaWtlKHt9KTsgLy89PiBmYWxzZVxuICogICAgICBfaXNBcnJheUxpa2Uoe2xlbmd0aDogMTB9KTsgLy89PiBmYWxzZVxuICogICAgICBfaXNBcnJheUxpa2UoezA6ICd6ZXJvJywgOTogJ25pbmUnLCBsZW5ndGg6IDEwfSk7IC8vPT4gdHJ1ZVxuICovXG5cbnZhciBfaXNBcnJheUxpa2UgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MShmdW5jdGlvbiBpc0FycmF5TGlrZSh4KSB7XG4gIGlmIChfaXNBcnJheSh4KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgaWYgKCF4KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKHR5cGVvZiB4ICE9PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChfaXNTdHJpbmcoeCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoeC5ub2RlVHlwZSA9PT0gMSkge1xuICAgIHJldHVybiAhIXgubGVuZ3RoO1xuICB9XG5cbiAgaWYgKHgubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoeC5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHguaGFzT3duUHJvcGVydHkoMCkgJiYgeC5oYXNPd25Qcm9wZXJ0eSh4Lmxlbmd0aCAtIDEpO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF9pc0FycmF5TGlrZTsiLCJ2YXIgWFdyYXAgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBYV3JhcChmbikge1xuICAgIHRoaXMuZiA9IGZuO1xuICB9XG5cbiAgWFdyYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gZnVuY3Rpb24gKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignaW5pdCBub3QgaW1wbGVtZW50ZWQgb24gWFdyYXAnKTtcbiAgfTtcblxuICBYV3JhcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChhY2MpIHtcbiAgICByZXR1cm4gYWNjO1xuICB9O1xuXG4gIFhXcmFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChhY2MsIHgpIHtcbiAgICByZXR1cm4gdGhpcy5mKGFjYywgeCk7XG4gIH07XG5cbiAgcmV0dXJuIFhXcmFwO1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBfeHdyYXAoZm4pIHtcbiAgcmV0dXJuIG5ldyBYV3JhcChmbik7XG59IiwiaW1wb3J0IF9hcml0eSBmcm9tIFwiLi9pbnRlcm5hbC9fYXJpdHkuanNcIjtcbmltcG9ydCBfY3VycnkyIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTIuanNcIjtcbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaXMgYm91bmQgdG8gYSBjb250ZXh0LlxuICogTm90ZTogYFIuYmluZGAgZG9lcyBub3QgcHJvdmlkZSB0aGUgYWRkaXRpb25hbCBhcmd1bWVudC1iaW5kaW5nIGNhcGFiaWxpdGllcyBvZlxuICogW0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kXShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9GdW5jdGlvbi9iaW5kKS5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC42LjBcbiAqIEBjYXRlZ29yeSBGdW5jdGlvblxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHNpZyAoKiAtPiAqKSAtPiB7Kn0gLT4gKCogLT4gKilcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuIFRoZSBmdW5jdGlvbiB0byBiaW5kIHRvIGNvbnRleHRcbiAqIEBwYXJhbSB7T2JqZWN0fSB0aGlzT2JqIFRoZSBjb250ZXh0IHRvIGJpbmQgYGZuYCB0b1xuICogQHJldHVybiB7RnVuY3Rpb259IEEgZnVuY3Rpb24gdGhhdCB3aWxsIGV4ZWN1dGUgaW4gdGhlIGNvbnRleHQgb2YgYHRoaXNPYmpgLlxuICogQHNlZSBSLnBhcnRpYWxcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBjb25zdCBsb2cgPSBSLmJpbmQoY29uc29sZS5sb2csIGNvbnNvbGUpO1xuICogICAgICBSLnBpcGUoUi5hc3NvYygnYScsIDIpLCBSLnRhcChsb2cpLCBSLmFzc29jKCdhJywgMykpKHthOiAxfSk7IC8vPT4ge2E6IDN9XG4gKiAgICAgIC8vIGxvZ3Mge2E6IDJ9XG4gKiBAc3ltYiBSLmJpbmQoZiwgbykoYSwgYikgPSBmLmNhbGwobywgYSwgYilcbiAqL1xuXG52YXIgYmluZCA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkyKGZ1bmN0aW9uIGJpbmQoZm4sIHRoaXNPYmopIHtcbiAgcmV0dXJuIF9hcml0eShmbi5sZW5ndGgsIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhpc09iaiwgYXJndW1lbnRzKTtcbiAgfSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgYmluZDsiLCJpbXBvcnQgX2lzQXJyYXlMaWtlIGZyb20gXCIuL19pc0FycmF5TGlrZS5qc1wiO1xuaW1wb3J0IF94d3JhcCBmcm9tIFwiLi9feHdyYXAuanNcIjtcbmltcG9ydCBiaW5kIGZyb20gXCIuLi9iaW5kLmpzXCI7XG5cbmZ1bmN0aW9uIF9hcnJheVJlZHVjZSh4ZiwgYWNjLCBsaXN0KSB7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGFjYyA9IHhmWydAQHRyYW5zZHVjZXIvc3RlcCddKGFjYywgbGlzdFtpZHhdKTtcblxuICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWR4ICs9IDE7XG4gIH1cblxuICByZXR1cm4geGZbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXShhY2MpO1xufVxuXG5mdW5jdGlvbiBfaXRlcmFibGVSZWR1Y2UoeGYsIGFjYywgaXRlcikge1xuICB2YXIgc3RlcCA9IGl0ZXIubmV4dCgpO1xuXG4gIHdoaWxlICghc3RlcC5kb25lKSB7XG4gICAgYWNjID0geGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10oYWNjLCBzdGVwLnZhbHVlKTtcblxuICAgIGlmIChhY2MgJiYgYWNjWydAQHRyYW5zZHVjZXIvcmVkdWNlZCddKSB7XG4gICAgICBhY2MgPSBhY2NbJ0BAdHJhbnNkdWNlci92YWx1ZSddO1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgc3RlcCA9IGl0ZXIubmV4dCgpO1xuICB9XG5cbiAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10oYWNjKTtcbn1cblxuZnVuY3Rpb24gX21ldGhvZFJlZHVjZSh4ZiwgYWNjLCBvYmosIG1ldGhvZE5hbWUpIHtcbiAgcmV0dXJuIHhmWydAQHRyYW5zZHVjZXIvcmVzdWx0J10ob2JqW21ldGhvZE5hbWVdKGJpbmQoeGZbJ0BAdHJhbnNkdWNlci9zdGVwJ10sIHhmKSwgYWNjKSk7XG59XG5cbnZhciBzeW1JdGVyYXRvciA9IHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnID8gU3ltYm9sLml0ZXJhdG9yIDogJ0BAaXRlcmF0b3InO1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX3JlZHVjZShmbiwgYWNjLCBsaXN0KSB7XG4gIGlmICh0eXBlb2YgZm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICBmbiA9IF94d3JhcChmbik7XG4gIH1cblxuICBpZiAoX2lzQXJyYXlMaWtlKGxpc3QpKSB7XG4gICAgcmV0dXJuIF9hcnJheVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbGlzdFsnZmFudGFzeS1sYW5kL3JlZHVjZSddID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9tZXRob2RSZWR1Y2UoZm4sIGFjYywgbGlzdCwgJ2ZhbnRhc3ktbGFuZC9yZWR1Y2UnKTtcbiAgfVxuXG4gIGlmIChsaXN0W3N5bUl0ZXJhdG9yXSAhPSBudWxsKSB7XG4gICAgcmV0dXJuIF9pdGVyYWJsZVJlZHVjZShmbiwgYWNjLCBsaXN0W3N5bUl0ZXJhdG9yXSgpKTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbGlzdC5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIF9pdGVyYWJsZVJlZHVjZShmbiwgYWNjLCBsaXN0KTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgbGlzdC5yZWR1Y2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gX21ldGhvZFJlZHVjZShmbiwgYWNjLCBsaXN0LCAncmVkdWNlJyk7XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCdyZWR1Y2U6IGxpc3QgbXVzdCBiZSBhcnJheSBvciBpdGVyYWJsZScpO1xufSIsImltcG9ydCBfY3VycnkyIGZyb20gXCIuL19jdXJyeTIuanNcIjtcbmltcG9ydCBfeGZCYXNlIGZyb20gXCIuL194ZkJhc2UuanNcIjtcblxudmFyIFhNYXAgPVxuLyojX19QVVJFX18qL1xuZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBYTWFwKGYsIHhmKSB7XG4gICAgdGhpcy54ZiA9IHhmO1xuICAgIHRoaXMuZiA9IGY7XG4gIH1cblxuICBYTWFwLnByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IF94ZkJhc2UuaW5pdDtcbiAgWE1hcC5wcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IF94ZkJhc2UucmVzdWx0O1xuXG4gIFhNYXAucHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgaW5wdXQpIHtcbiAgICByZXR1cm4gdGhpcy54ZlsnQEB0cmFuc2R1Y2VyL3N0ZXAnXShyZXN1bHQsIHRoaXMuZihpbnB1dCkpO1xuICB9O1xuXG4gIHJldHVybiBYTWFwO1xufSgpO1xuXG52YXIgX3htYXAgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBfeG1hcChmLCB4Zikge1xuICByZXR1cm4gbmV3IFhNYXAoZiwgeGYpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IF94bWFwOyIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9oYXMocHJvcCwgb2JqKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKTtcbn0iLCJpbXBvcnQgX2hhcyBmcm9tIFwiLi9faGFzLmpzXCI7XG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG52YXIgX2lzQXJndW1lbnRzID1cbi8qI19fUFVSRV9fKi9cbmZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoYXJndW1lbnRzKSA9PT0gJ1tvYmplY3QgQXJndW1lbnRzXScgPyBmdW5jdGlvbiBfaXNBcmd1bWVudHMoeCkge1xuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKHgpID09PSAnW29iamVjdCBBcmd1bWVudHNdJztcbiAgfSA6IGZ1bmN0aW9uIF9pc0FyZ3VtZW50cyh4KSB7XG4gICAgcmV0dXJuIF9oYXMoJ2NhbGxlZScsIHgpO1xuICB9O1xufSgpO1xuXG5leHBvcnQgZGVmYXVsdCBfaXNBcmd1bWVudHM7IiwiaW1wb3J0IF9jdXJyeTEgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5MS5qc1wiO1xuaW1wb3J0IF9oYXMgZnJvbSBcIi4vaW50ZXJuYWwvX2hhcy5qc1wiO1xuaW1wb3J0IF9pc0FyZ3VtZW50cyBmcm9tIFwiLi9pbnRlcm5hbC9faXNBcmd1bWVudHMuanNcIjsgLy8gY292ZXIgSUUgPCA5IGtleXMgaXNzdWVzXG5cbnZhciBoYXNFbnVtQnVnID0gIVxuLyojX19QVVJFX18qL1xue1xuICB0b1N0cmluZzogbnVsbFxufS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgndG9TdHJpbmcnKTtcbnZhciBub25FbnVtZXJhYmxlUHJvcHMgPSBbJ2NvbnN0cnVjdG9yJywgJ3ZhbHVlT2YnLCAnaXNQcm90b3R5cGVPZicsICd0b1N0cmluZycsICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICdoYXNPd25Qcm9wZXJ0eScsICd0b0xvY2FsZVN0cmluZyddOyAvLyBTYWZhcmkgYnVnXG5cbnZhciBoYXNBcmdzRW51bUJ1ZyA9XG4vKiNfX1BVUkVfXyovXG5mdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICByZXR1cm4gYXJndW1lbnRzLnByb3BlcnR5SXNFbnVtZXJhYmxlKCdsZW5ndGgnKTtcbn0oKTtcblxudmFyIGNvbnRhaW5zID0gZnVuY3Rpb24gY29udGFpbnMobGlzdCwgaXRlbSkge1xuICB2YXIgaWR4ID0gMDtcblxuICB3aGlsZSAoaWR4IDwgbGlzdC5sZW5ndGgpIHtcbiAgICBpZiAobGlzdFtpZHhdID09PSBpdGVtKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZHggKz0gMTtcbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn07XG4vKipcbiAqIFJldHVybnMgYSBsaXN0IGNvbnRhaW5pbmcgdGhlIG5hbWVzIG9mIGFsbCB0aGUgZW51bWVyYWJsZSBvd24gcHJvcGVydGllcyBvZlxuICogdGhlIHN1cHBsaWVkIG9iamVjdC5cbiAqIE5vdGUgdGhhdCB0aGUgb3JkZXIgb2YgdGhlIG91dHB1dCBhcnJheSBpcyBub3QgZ3VhcmFudGVlZCB0byBiZSBjb25zaXN0ZW50XG4gKiBhY3Jvc3MgZGlmZmVyZW50IEpTIHBsYXRmb3Jtcy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcge2s6IHZ9IC0+IFtrXVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGV4dHJhY3QgcHJvcGVydGllcyBmcm9tXG4gKiBAcmV0dXJuIHtBcnJheX0gQW4gYXJyYXkgb2YgdGhlIG9iamVjdCdzIG93biBwcm9wZXJ0aWVzLlxuICogQHNlZSBSLmtleXNJbiwgUi52YWx1ZXNcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmtleXMoe2E6IDEsIGI6IDIsIGM6IDN9KTsgLy89PiBbJ2EnLCAnYicsICdjJ11cbiAqL1xuXG5cbnZhciBrZXlzID0gdHlwZW9mIE9iamVjdC5rZXlzID09PSAnZnVuY3Rpb24nICYmICFoYXNBcmdzRW51bUJ1ZyA/XG4vKiNfX1BVUkVfXyovXG5fY3VycnkxKGZ1bmN0aW9uIGtleXMob2JqKSB7XG4gIHJldHVybiBPYmplY3Qob2JqKSAhPT0gb2JqID8gW10gOiBPYmplY3Qua2V5cyhvYmopO1xufSkgOlxuLyojX19QVVJFX18qL1xuX2N1cnJ5MShmdW5jdGlvbiBrZXlzKG9iaikge1xuICBpZiAoT2JqZWN0KG9iaikgIT09IG9iaikge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHZhciBwcm9wLCBuSWR4O1xuICB2YXIga3MgPSBbXTtcblxuICB2YXIgY2hlY2tBcmdzTGVuZ3RoID0gaGFzQXJnc0VudW1CdWcgJiYgX2lzQXJndW1lbnRzKG9iaik7XG5cbiAgZm9yIChwcm9wIGluIG9iaikge1xuICAgIGlmIChfaGFzKHByb3AsIG9iaikgJiYgKCFjaGVja0FyZ3NMZW5ndGggfHwgcHJvcCAhPT0gJ2xlbmd0aCcpKSB7XG4gICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICB9XG4gIH1cblxuICBpZiAoaGFzRW51bUJ1Zykge1xuICAgIG5JZHggPSBub25FbnVtZXJhYmxlUHJvcHMubGVuZ3RoIC0gMTtcblxuICAgIHdoaWxlIChuSWR4ID49IDApIHtcbiAgICAgIHByb3AgPSBub25FbnVtZXJhYmxlUHJvcHNbbklkeF07XG5cbiAgICAgIGlmIChfaGFzKHByb3AsIG9iaikgJiYgIWNvbnRhaW5zKGtzLCBwcm9wKSkge1xuICAgICAgICBrc1trcy5sZW5ndGhdID0gcHJvcDtcbiAgICAgIH1cblxuICAgICAgbklkeCAtPSAxO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBrcztcbn0pO1xuZXhwb3J0IGRlZmF1bHQga2V5czsiLCJpbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG5pbXBvcnQgX2Rpc3BhdGNoYWJsZSBmcm9tIFwiLi9pbnRlcm5hbC9fZGlzcGF0Y2hhYmxlLmpzXCI7XG5pbXBvcnQgX21hcCBmcm9tIFwiLi9pbnRlcm5hbC9fbWFwLmpzXCI7XG5pbXBvcnQgX3JlZHVjZSBmcm9tIFwiLi9pbnRlcm5hbC9fcmVkdWNlLmpzXCI7XG5pbXBvcnQgX3htYXAgZnJvbSBcIi4vaW50ZXJuYWwvX3htYXAuanNcIjtcbmltcG9ydCBjdXJyeU4gZnJvbSBcIi4vY3VycnlOLmpzXCI7XG5pbXBvcnQga2V5cyBmcm9tIFwiLi9rZXlzLmpzXCI7XG4vKipcbiAqIFRha2VzIGEgZnVuY3Rpb24gYW5kXG4gKiBhIFtmdW5jdG9yXShodHRwczovL2dpdGh1Yi5jb20vZmFudGFzeWxhbmQvZmFudGFzeS1sYW5kI2Z1bmN0b3IpLFxuICogYXBwbGllcyB0aGUgZnVuY3Rpb24gdG8gZWFjaCBvZiB0aGUgZnVuY3RvcidzIHZhbHVlcywgYW5kIHJldHVybnNcbiAqIGEgZnVuY3RvciBvZiB0aGUgc2FtZSBzaGFwZS5cbiAqXG4gKiBSYW1kYSBwcm92aWRlcyBzdWl0YWJsZSBgbWFwYCBpbXBsZW1lbnRhdGlvbnMgZm9yIGBBcnJheWAgYW5kIGBPYmplY3RgLFxuICogc28gdGhpcyBmdW5jdGlvbiBtYXkgYmUgYXBwbGllZCB0byBgWzEsIDIsIDNdYCBvciBge3g6IDEsIHk6IDIsIHo6IDN9YC5cbiAqXG4gKiBEaXNwYXRjaGVzIHRvIHRoZSBgbWFwYCBtZXRob2Qgb2YgdGhlIHNlY29uZCBhcmd1bWVudCwgaWYgcHJlc2VudC5cbiAqXG4gKiBBY3RzIGFzIGEgdHJhbnNkdWNlciBpZiBhIHRyYW5zZm9ybWVyIGlzIGdpdmVuIGluIGxpc3QgcG9zaXRpb24uXG4gKlxuICogQWxzbyB0cmVhdHMgZnVuY3Rpb25zIGFzIGZ1bmN0b3JzIGFuZCB3aWxsIGNvbXBvc2UgdGhlbSB0b2dldGhlci5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMaXN0XG4gKiBAc2lnIEZ1bmN0b3IgZiA9PiAoYSAtPiBiKSAtPiBmIGEgLT4gZiBiXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmbiBUaGUgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGV2ZXJ5IGVsZW1lbnQgb2YgdGhlIGlucHV0IGBsaXN0YC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3QgdG8gYmUgaXRlcmF0ZWQgb3Zlci5cbiAqIEByZXR1cm4ge0FycmF5fSBUaGUgbmV3IGxpc3QuXG4gKiBAc2VlIFIudHJhbnNkdWNlLCBSLmFkZEluZGV4XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgZG91YmxlID0geCA9PiB4ICogMjtcbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwgWzEsIDIsIDNdKTsgLy89PiBbMiwgNCwgNl1cbiAqXG4gKiAgICAgIFIubWFwKGRvdWJsZSwge3g6IDEsIHk6IDIsIHo6IDN9KTsgLy89PiB7eDogMiwgeTogNCwgejogNn1cbiAqIEBzeW1iIFIubWFwKGYsIFthLCBiXSkgPSBbZihhKSwgZihiKV1cbiAqIEBzeW1iIFIubWFwKGYsIHsgeDogYSwgeTogYiB9KSA9IHsgeDogZihhKSwgeTogZihiKSB9XG4gKiBAc3ltYiBSLm1hcChmLCBmdW5jdG9yX28pID0gZnVuY3Rvcl9vLm1hcChmKVxuICovXG5cbnZhciBtYXAgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5Mihcbi8qI19fUFVSRV9fKi9cbl9kaXNwYXRjaGFibGUoWydmYW50YXN5LWxhbmQvbWFwJywgJ21hcCddLCBfeG1hcCwgZnVuY3Rpb24gbWFwKGZuLCBmdW5jdG9yKSB7XG4gIHN3aXRjaCAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGZ1bmN0b3IpKSB7XG4gICAgY2FzZSAnW29iamVjdCBGdW5jdGlvbl0nOlxuICAgICAgcmV0dXJuIGN1cnJ5TihmdW5jdG9yLmxlbmd0aCwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gZm4uY2FsbCh0aGlzLCBmdW5jdG9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykpO1xuICAgICAgfSk7XG5cbiAgICBjYXNlICdbb2JqZWN0IE9iamVjdF0nOlxuICAgICAgcmV0dXJuIF9yZWR1Y2UoZnVuY3Rpb24gKGFjYywga2V5KSB7XG4gICAgICAgIGFjY1trZXldID0gZm4oZnVuY3RvcltrZXldKTtcbiAgICAgICAgcmV0dXJuIGFjYztcbiAgICAgIH0sIHt9LCBrZXlzKGZ1bmN0b3IpKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gX21hcChmbiwgZnVuY3Rvcik7XG4gIH1cbn0pKTtcblxuZXhwb3J0IGRlZmF1bHQgbWFwOyIsIi8qKlxuICogRGV0ZXJtaW5lIGlmIHRoZSBwYXNzZWQgYXJndW1lbnQgaXMgYW4gaW50ZWdlci5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSBuXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgTnVtYmVyLmlzSW50ZWdlciB8fCBmdW5jdGlvbiBfaXNJbnRlZ2VyKG4pIHtcbiAgcmV0dXJuIG4gPDwgMCA9PT0gbjtcbn07IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IF9pc1N0cmluZyBmcm9tIFwiLi9pbnRlcm5hbC9faXNTdHJpbmcuanNcIjtcbi8qKlxuICogUmV0dXJucyB0aGUgbnRoIGVsZW1lbnQgb2YgdGhlIGdpdmVuIGxpc3Qgb3Igc3RyaW5nLiBJZiBuIGlzIG5lZ2F0aXZlIHRoZVxuICogZWxlbWVudCBhdCBpbmRleCBsZW5ndGggKyBuIGlzIHJldHVybmVkLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgTnVtYmVyIC0+IFthXSAtPiBhIHwgVW5kZWZpbmVkXG4gKiBAc2lnIE51bWJlciAtPiBTdHJpbmcgLT4gU3RyaW5nXG4gKiBAcGFyYW0ge051bWJlcn0gb2Zmc2V0XG4gKiBAcGFyYW0geyp9IGxpc3RcbiAqIEByZXR1cm4geyp9XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgbGlzdCA9IFsnZm9vJywgJ2JhcicsICdiYXonLCAncXV1eCddO1xuICogICAgICBSLm50aCgxLCBsaXN0KTsgLy89PiAnYmFyJ1xuICogICAgICBSLm50aCgtMSwgbGlzdCk7IC8vPT4gJ3F1dXgnXG4gKiAgICAgIFIubnRoKC05OSwgbGlzdCk7IC8vPT4gdW5kZWZpbmVkXG4gKlxuICogICAgICBSLm50aCgyLCAnYWJjJyk7IC8vPT4gJ2MnXG4gKiAgICAgIFIubnRoKDMsICdhYmMnKTsgLy89PiAnJ1xuICogQHN5bWIgUi5udGgoLTEsIFthLCBiLCBjXSkgPSBjXG4gKiBAc3ltYiBSLm50aCgwLCBbYSwgYiwgY10pID0gYVxuICogQHN5bWIgUi5udGgoMSwgW2EsIGIsIGNdKSA9IGJcbiAqL1xuXG52YXIgbnRoID1cbi8qI19fUFVSRV9fKi9cbl9jdXJyeTIoZnVuY3Rpb24gbnRoKG9mZnNldCwgbGlzdCkge1xuICB2YXIgaWR4ID0gb2Zmc2V0IDwgMCA/IGxpc3QubGVuZ3RoICsgb2Zmc2V0IDogb2Zmc2V0O1xuICByZXR1cm4gX2lzU3RyaW5nKGxpc3QpID8gbGlzdC5jaGFyQXQoaWR4KSA6IGxpc3RbaWR4XTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBudGg7IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IF9pc0ludGVnZXIgZnJvbSBcIi4vaW50ZXJuYWwvX2lzSW50ZWdlci5qc1wiO1xuaW1wb3J0IG50aCBmcm9tIFwiLi9udGguanNcIjtcbi8qKlxuICogUmV0cmlldmVzIHRoZSB2YWx1ZXMgYXQgZ2l2ZW4gcGF0aHMgb2YgYW4gb2JqZWN0LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjI3LjFcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBJZHggPSBbU3RyaW5nIHwgSW50XVxuICogQHNpZyBbSWR4XSAtPiB7YX0gLT4gW2EgfCBVbmRlZmluZWRdXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoc0FycmF5IFRoZSBhcnJheSBvZiBwYXRocyB0byBiZSBmZXRjaGVkLlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIHJldHJpZXZlIHRoZSBuZXN0ZWQgcHJvcGVydGllcyBmcm9tLlxuICogQHJldHVybiB7QXJyYXl9IEEgbGlzdCBjb25zaXN0aW5nIG9mIHZhbHVlcyBhdCBwYXRocyBzcGVjaWZpZWQgYnkgXCJwYXRoc0FycmF5XCIuXG4gKiBAc2VlIFIucGF0aFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIucGF0aHMoW1snYScsICdiJ10sIFsncCcsIDAsICdxJ11dLCB7YToge2I6IDJ9LCBwOiBbe3E6IDN9XX0pOyAvLz0+IFsyLCAzXVxuICogICAgICBSLnBhdGhzKFtbJ2EnLCAnYiddLCBbJ3AnLCAnciddXSwge2E6IHtiOiAyfSwgcDogW3txOiAzfV19KTsgLy89PiBbMiwgdW5kZWZpbmVkXVxuICovXG5cbnZhciBwYXRocyA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkyKGZ1bmN0aW9uIHBhdGhzKHBhdGhzQXJyYXksIG9iaikge1xuICByZXR1cm4gcGF0aHNBcnJheS5tYXAoZnVuY3Rpb24gKHBhdGhzKSB7XG4gICAgdmFyIHZhbCA9IG9iajtcbiAgICB2YXIgaWR4ID0gMDtcbiAgICB2YXIgcDtcblxuICAgIHdoaWxlIChpZHggPCBwYXRocy5sZW5ndGgpIHtcbiAgICAgIGlmICh2YWwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHAgPSBwYXRoc1tpZHhdO1xuICAgICAgdmFsID0gX2lzSW50ZWdlcihwKSA/IG50aChwLCB2YWwpIDogdmFsW3BdO1xuICAgICAgaWR4ICs9IDE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHZhbDtcbiAgfSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcGF0aHM7IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IHBhdGhzIGZyb20gXCIuL3BhdGhzLmpzXCI7XG4vKipcbiAqIFJldHJpZXZlIHRoZSB2YWx1ZSBhdCBhIGdpdmVuIHBhdGguXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gSWR4ID0gU3RyaW5nIHwgSW50XG4gKiBAc2lnIFtJZHhdIC0+IHthfSAtPiBhIHwgVW5kZWZpbmVkXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoIFRoZSBwYXRoIHRvIHVzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byByZXRyaWV2ZSB0aGUgbmVzdGVkIHByb3BlcnR5IGZyb20uXG4gKiBAcmV0dXJuIHsqfSBUaGUgZGF0YSBhdCBgcGF0aGAuXG4gKiBAc2VlIFIucHJvcCwgUi5udGhcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLnBhdGgoWydhJywgJ2InXSwge2E6IHtiOiAyfX0pOyAvLz0+IDJcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJ10sIHtjOiB7YjogMn19KTsgLy89PiB1bmRlZmluZWRcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJywgMF0sIHthOiB7YjogWzEsIDIsIDNdfX0pOyAvLz0+IDFcbiAqICAgICAgUi5wYXRoKFsnYScsICdiJywgLTJdLCB7YToge2I6IFsxLCAyLCAzXX19KTsgLy89PiAyXG4gKi9cblxudmFyIHBhdGggPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBwYXRoKHBhdGhBciwgb2JqKSB7XG4gIHJldHVybiBwYXRocyhbcGF0aEFyXSwgb2JqKVswXTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBwYXRoOyIsImltcG9ydCBfY3VycnkxIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTEuanNcIjtcbi8qKlxuICogUmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgYWx3YXlzIHJldHVybnMgdGhlIGdpdmVuIHZhbHVlLiBOb3RlIHRoYXQgZm9yXG4gKiBub24tcHJpbWl0aXZlcyB0aGUgdmFsdWUgcmV0dXJuZWQgaXMgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsIHZhbHVlLlxuICpcbiAqIFRoaXMgZnVuY3Rpb24gaXMga25vd24gYXMgYGNvbnN0YCwgYGNvbnN0YW50YCwgb3IgYEtgIChmb3IgSyBjb21iaW5hdG9yKSBpblxuICogb3RoZXIgbGFuZ3VhZ2VzIGFuZCBsaWJyYXJpZXMuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMS4wXG4gKiBAY2F0ZWdvcnkgRnVuY3Rpb25cbiAqIEBzaWcgYSAtPiAoKiAtPiBhKVxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHdyYXAgaW4gYSBmdW5jdGlvblxuICogQHJldHVybiB7RnVuY3Rpb259IEEgRnVuY3Rpb24gOjogKiAtPiB2YWwuXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgdCA9IFIuYWx3YXlzKCdUZWUnKTtcbiAqICAgICAgdCgpOyAvLz0+ICdUZWUnXG4gKi9cblxudmFyIGFsd2F5cyA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkxKGZ1bmN0aW9uIGFsd2F5cyh2YWwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdmFsO1xuICB9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFsd2F5czsiLCJpbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmIGJvdGggYXJndW1lbnRzIGFyZSBgdHJ1ZWA7IGBmYWxzZWAgb3RoZXJ3aXNlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExvZ2ljXG4gKiBAc2lnIGEgLT4gYiAtPiBhIHwgYlxuICogQHBhcmFtIHtBbnl9IGFcbiAqIEBwYXJhbSB7QW55fSBiXG4gKiBAcmV0dXJuIHtBbnl9IHRoZSBmaXJzdCBhcmd1bWVudCBpZiBpdCBpcyBmYWxzeSwgb3RoZXJ3aXNlIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gKiBAc2VlIFIuYm90aCwgUi54b3JcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmFuZCh0cnVlLCB0cnVlKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuYW5kKHRydWUsIGZhbHNlKTsgLy89PiBmYWxzZVxuICogICAgICBSLmFuZChmYWxzZSwgdHJ1ZSk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5hbmQoZmFsc2UsIGZhbHNlKTsgLy89PiBmYWxzZVxuICovXG5cbnZhciBhbmQgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBhbmQoYSwgYikge1xuICByZXR1cm4gYSAmJiBiO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFuZDsiLCJpbXBvcnQgX2NvbmNhdCBmcm9tIFwiLi9pbnRlcm5hbC9fY29uY2F0LmpzXCI7XG5pbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG4vKipcbiAqIFJldHVybnMgYSBuZXcgbGlzdCBjb250YWluaW5nIHRoZSBjb250ZW50cyBvZiB0aGUgZ2l2ZW4gbGlzdCwgZm9sbG93ZWQgYnlcbiAqIHRoZSBnaXZlbiBlbGVtZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IExpc3RcbiAqIEBzaWcgYSAtPiBbYV0gLT4gW2FdXG4gKiBAcGFyYW0geyp9IGVsIFRoZSBlbGVtZW50IHRvIGFkZCB0byB0aGUgZW5kIG9mIHRoZSBuZXcgbGlzdC5cbiAqIEBwYXJhbSB7QXJyYXl9IGxpc3QgVGhlIGxpc3Qgb2YgZWxlbWVudHMgdG8gYWRkIGEgbmV3IGl0ZW0gdG8uXG4gKiAgICAgICAgbGlzdC5cbiAqIEByZXR1cm4ge0FycmF5fSBBIG5ldyBsaXN0IGNvbnRhaW5pbmcgdGhlIGVsZW1lbnRzIG9mIHRoZSBvbGQgbGlzdCBmb2xsb3dlZCBieSBgZWxgLlxuICogQHNlZSBSLnByZXBlbmRcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmFwcGVuZCgndGVzdHMnLCBbJ3dyaXRlJywgJ21vcmUnXSk7IC8vPT4gWyd3cml0ZScsICdtb3JlJywgJ3Rlc3RzJ11cbiAqICAgICAgUi5hcHBlbmQoJ3Rlc3RzJywgW10pOyAvLz0+IFsndGVzdHMnXVxuICogICAgICBSLmFwcGVuZChbJ3Rlc3RzJ10sIFsnd3JpdGUnLCAnbW9yZSddKTsgLy89PiBbJ3dyaXRlJywgJ21vcmUnLCBbJ3Rlc3RzJ11dXG4gKi9cblxudmFyIGFwcGVuZCA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkyKGZ1bmN0aW9uIGFwcGVuZChlbCwgbGlzdCkge1xuICByZXR1cm4gX2NvbmNhdChsaXN0LCBbZWxdKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBhcHBlbmQ7IiwiaW1wb3J0IF9jdXJyeTMgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5My5qc1wiO1xuLyoqXG4gKiBNYWtlcyBhIHNoYWxsb3cgY2xvbmUgb2YgYW4gb2JqZWN0LCBzZXR0aW5nIG9yIG92ZXJyaWRpbmcgdGhlIHNwZWNpZmllZFxuICogcHJvcGVydHkgd2l0aCB0aGUgZ2l2ZW4gdmFsdWUuIE5vdGUgdGhhdCB0aGlzIGNvcGllcyBhbmQgZmxhdHRlbnMgcHJvdG90eXBlXG4gKiBwcm9wZXJ0aWVzIG9udG8gdGhlIG5ldyBvYmplY3QgYXMgd2VsbC4gQWxsIG5vbi1wcmltaXRpdmUgcHJvcGVydGllcyBhcmVcbiAqIGNvcGllZCBieSByZWZlcmVuY2UuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuOC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAc2lnIFN0cmluZyAtPiBhIC0+IHtrOiB2fSAtPiB7azogdn1cbiAqIEBwYXJhbSB7U3RyaW5nfSBwcm9wIFRoZSBwcm9wZXJ0eSBuYW1lIHRvIHNldFxuICogQHBhcmFtIHsqfSB2YWwgVGhlIG5ldyB2YWx1ZVxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGNsb25lXG4gKiBAcmV0dXJuIHtPYmplY3R9IEEgbmV3IG9iamVjdCBlcXVpdmFsZW50IHRvIHRoZSBvcmlnaW5hbCBleGNlcHQgZm9yIHRoZSBjaGFuZ2VkIHByb3BlcnR5LlxuICogQHNlZSBSLmRpc3NvYywgUi5waWNrXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5hc3NvYygnYycsIDMsIHthOiAxLCBiOiAyfSk7IC8vPT4ge2E6IDEsIGI6IDIsIGM6IDN9XG4gKi9cblxudmFyIGFzc29jID1cbi8qI19fUFVSRV9fKi9cbl9jdXJyeTMoZnVuY3Rpb24gYXNzb2MocHJvcCwgdmFsLCBvYmopIHtcbiAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gIGZvciAodmFyIHAgaW4gb2JqKSB7XG4gICAgcmVzdWx0W3BdID0gb2JqW3BdO1xuICB9XG5cbiAgcmVzdWx0W3Byb3BdID0gdmFsO1xuICByZXR1cm4gcmVzdWx0O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzc29jOyIsImltcG9ydCBfY3VycnkxIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTEuanNcIjtcbi8qKlxuICogQ2hlY2tzIGlmIHRoZSBpbnB1dCB2YWx1ZSBpcyBgbnVsbGAgb3IgYHVuZGVmaW5lZGAuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuOS4wXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQHNpZyAqIC0+IEJvb2xlYW5cbiAqIEBwYXJhbSB7Kn0geCBUaGUgdmFsdWUgdG8gdGVzdC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IGB0cnVlYCBpZiBgeGAgaXMgYHVuZGVmaW5lZGAgb3IgYG51bGxgLCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBSLmlzTmlsKG51bGwpOyAvLz0+IHRydWVcbiAqICAgICAgUi5pc05pbCh1bmRlZmluZWQpOyAvLz0+IHRydWVcbiAqICAgICAgUi5pc05pbCgwKTsgLy89PiBmYWxzZVxuICogICAgICBSLmlzTmlsKFtdKTsgLy89PiBmYWxzZVxuICovXG5cbnZhciBpc05pbCA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkxKGZ1bmN0aW9uIGlzTmlsKHgpIHtcbiAgcmV0dXJuIHggPT0gbnVsbDtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBpc05pbDsiLCJpbXBvcnQgX2N1cnJ5MyBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkzLmpzXCI7XG5pbXBvcnQgX2hhcyBmcm9tIFwiLi9pbnRlcm5hbC9faGFzLmpzXCI7XG5pbXBvcnQgX2lzQXJyYXkgZnJvbSBcIi4vaW50ZXJuYWwvX2lzQXJyYXkuanNcIjtcbmltcG9ydCBfaXNJbnRlZ2VyIGZyb20gXCIuL2ludGVybmFsL19pc0ludGVnZXIuanNcIjtcbmltcG9ydCBhc3NvYyBmcm9tIFwiLi9hc3NvYy5qc1wiO1xuaW1wb3J0IGlzTmlsIGZyb20gXCIuL2lzTmlsLmpzXCI7XG4vKipcbiAqIE1ha2VzIGEgc2hhbGxvdyBjbG9uZSBvZiBhbiBvYmplY3QsIHNldHRpbmcgb3Igb3ZlcnJpZGluZyB0aGUgbm9kZXMgcmVxdWlyZWRcbiAqIHRvIGNyZWF0ZSB0aGUgZ2l2ZW4gcGF0aCwgYW5kIHBsYWNpbmcgdGhlIHNwZWNpZmljIHZhbHVlIGF0IHRoZSB0YWlsIGVuZCBvZlxuICogdGhhdCBwYXRoLiBOb3RlIHRoYXQgdGhpcyBjb3BpZXMgYW5kIGZsYXR0ZW5zIHByb3RvdHlwZSBwcm9wZXJ0aWVzIG9udG8gdGhlXG4gKiBuZXcgb2JqZWN0IGFzIHdlbGwuIEFsbCBub24tcHJpbWl0aXZlIHByb3BlcnRpZXMgYXJlIGNvcGllZCBieSByZWZlcmVuY2UuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuOC4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gSWR4ID0gU3RyaW5nIHwgSW50XG4gKiBAc2lnIFtJZHhdIC0+IGEgLT4ge2F9IC0+IHthfVxuICogQHBhcmFtIHtBcnJheX0gcGF0aCB0aGUgcGF0aCB0byBzZXRcbiAqIEBwYXJhbSB7Kn0gdmFsIFRoZSBuZXcgdmFsdWVcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBjbG9uZVxuICogQHJldHVybiB7T2JqZWN0fSBBIG5ldyBvYmplY3QgZXF1aXZhbGVudCB0byB0aGUgb3JpZ2luYWwgZXhjZXB0IGFsb25nIHRoZSBzcGVjaWZpZWQgcGF0aC5cbiAqIEBzZWUgUi5kaXNzb2NQYXRoXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5hc3NvY1BhdGgoWydhJywgJ2InLCAnYyddLCA0Miwge2E6IHtiOiB7YzogMH19fSk7IC8vPT4ge2E6IHtiOiB7YzogNDJ9fX1cbiAqXG4gKiAgICAgIC8vIEFueSBtaXNzaW5nIG9yIG5vbi1vYmplY3Qga2V5cyBpbiBwYXRoIHdpbGwgYmUgb3ZlcnJpZGRlblxuICogICAgICBSLmFzc29jUGF0aChbJ2EnLCAnYicsICdjJ10sIDQyLCB7YTogNX0pOyAvLz0+IHthOiB7Yjoge2M6IDQyfX19XG4gKi9cblxudmFyIGFzc29jUGF0aCA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkzKGZ1bmN0aW9uIGFzc29jUGF0aChwYXRoLCB2YWwsIG9iaikge1xuICBpZiAocGF0aC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdmFsO1xuICB9XG5cbiAgdmFyIGlkeCA9IHBhdGhbMF07XG5cbiAgaWYgKHBhdGgubGVuZ3RoID4gMSkge1xuICAgIHZhciBuZXh0T2JqID0gIWlzTmlsKG9iaikgJiYgX2hhcyhpZHgsIG9iaikgPyBvYmpbaWR4XSA6IF9pc0ludGVnZXIocGF0aFsxXSkgPyBbXSA6IHt9O1xuICAgIHZhbCA9IGFzc29jUGF0aChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChwYXRoLCAxKSwgdmFsLCBuZXh0T2JqKTtcbiAgfVxuXG4gIGlmIChfaXNJbnRlZ2VyKGlkeCkgJiYgX2lzQXJyYXkob2JqKSkge1xuICAgIHZhciBhcnIgPSBbXS5jb25jYXQob2JqKTtcbiAgICBhcnJbaWR4XSA9IHZhbDtcbiAgICByZXR1cm4gYXJyO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBhc3NvYyhpZHgsIHZhbCwgb2JqKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGFzc29jUGF0aDsiLCJpbXBvcnQgX2N1cnJ5MSBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkxLmpzXCI7XG4vKipcbiAqIEdpdmVzIGEgc2luZ2xlLXdvcmQgc3RyaW5nIGRlc2NyaXB0aW9uIG9mIHRoZSAobmF0aXZlKSB0eXBlIG9mIGEgdmFsdWUsXG4gKiByZXR1cm5pbmcgc3VjaCBhbnN3ZXJzIGFzICdPYmplY3QnLCAnTnVtYmVyJywgJ0FycmF5Jywgb3IgJ051bGwnLiBEb2VzIG5vdFxuICogYXR0ZW1wdCB0byBkaXN0aW5ndWlzaCB1c2VyIE9iamVjdCB0eXBlcyBhbnkgZnVydGhlciwgcmVwb3J0aW5nIHRoZW0gYWxsIGFzXG4gKiAnT2JqZWN0Jy5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC44LjBcbiAqIEBjYXRlZ29yeSBUeXBlXG4gKiBAc2lnICgqIC0+IHsqfSkgLT4gU3RyaW5nXG4gKiBAcGFyYW0geyp9IHZhbCBUaGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybiB7U3RyaW5nfVxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIudHlwZSh7fSk7IC8vPT4gXCJPYmplY3RcIlxuICogICAgICBSLnR5cGUoMSk7IC8vPT4gXCJOdW1iZXJcIlxuICogICAgICBSLnR5cGUoZmFsc2UpOyAvLz0+IFwiQm9vbGVhblwiXG4gKiAgICAgIFIudHlwZSgncycpOyAvLz0+IFwiU3RyaW5nXCJcbiAqICAgICAgUi50eXBlKG51bGwpOyAvLz0+IFwiTnVsbFwiXG4gKiAgICAgIFIudHlwZShbXSk7IC8vPT4gXCJBcnJheVwiXG4gKiAgICAgIFIudHlwZSgvW0Etel0vKTsgLy89PiBcIlJlZ0V4cFwiXG4gKiAgICAgIFIudHlwZSgoKSA9PiB7fSk7IC8vPT4gXCJGdW5jdGlvblwiXG4gKiAgICAgIFIudHlwZSh1bmRlZmluZWQpOyAvLz0+IFwiVW5kZWZpbmVkXCJcbiAqL1xuXG52YXIgdHlwZSA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkxKGZ1bmN0aW9uIHR5cGUodmFsKSB7XG4gIHJldHVybiB2YWwgPT09IG51bGwgPyAnTnVsbCcgOiB2YWwgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZhbCkuc2xpY2UoOCwgLTEpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IHR5cGU7IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2FycmF5RnJvbUl0ZXJhdG9yKGl0ZXIpIHtcbiAgdmFyIGxpc3QgPSBbXTtcbiAgdmFyIG5leHQ7XG5cbiAgd2hpbGUgKCEobmV4dCA9IGl0ZXIubmV4dCgpKS5kb25lKSB7XG4gICAgbGlzdC5wdXNoKG5leHQudmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIGxpc3Q7XG59IiwiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gX2luY2x1ZGVzV2l0aChwcmVkLCB4LCBsaXN0KSB7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gbGlzdC5sZW5ndGg7XG5cbiAgd2hpbGUgKGlkeCA8IGxlbikge1xuICAgIGlmIChwcmVkKHgsIGxpc3RbaWR4XSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlkeCArPSAxO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufSIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9mdW5jdGlvbk5hbWUoZikge1xuICAvLyBTdHJpbmcoeCA9PiB4KSBldmFsdWF0ZXMgdG8gXCJ4ID0+IHhcIiwgc28gdGhlIHBhdHRlcm4gbWF5IG5vdCBtYXRjaC5cbiAgdmFyIG1hdGNoID0gU3RyaW5nKGYpLm1hdGNoKC9eZnVuY3Rpb24gKFxcdyopLyk7XG4gIHJldHVybiBtYXRjaCA9PSBudWxsID8gJycgOiBtYXRjaFsxXTtcbn0iLCIvLyBCYXNlZCBvbiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvaXNcbmZ1bmN0aW9uIF9vYmplY3RJcyhhLCBiKSB7XG4gIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgaWYgKGEgPT09IGIpIHtcbiAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgIHJldHVybiBhICE9PSAwIHx8IDEgLyBhID09PSAxIC8gYjtcbiAgfSBlbHNlIHtcbiAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgIHJldHVybiBhICE9PSBhICYmIGIgIT09IGI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgdHlwZW9mIE9iamVjdC5pcyA9PT0gJ2Z1bmN0aW9uJyA/IE9iamVjdC5pcyA6IF9vYmplY3RJczsiLCJpbXBvcnQgX2FycmF5RnJvbUl0ZXJhdG9yIGZyb20gXCIuL19hcnJheUZyb21JdGVyYXRvci5qc1wiO1xuaW1wb3J0IF9pbmNsdWRlc1dpdGggZnJvbSBcIi4vX2luY2x1ZGVzV2l0aC5qc1wiO1xuaW1wb3J0IF9mdW5jdGlvbk5hbWUgZnJvbSBcIi4vX2Z1bmN0aW9uTmFtZS5qc1wiO1xuaW1wb3J0IF9oYXMgZnJvbSBcIi4vX2hhcy5qc1wiO1xuaW1wb3J0IF9vYmplY3RJcyBmcm9tIFwiLi9fb2JqZWN0SXMuanNcIjtcbmltcG9ydCBrZXlzIGZyb20gXCIuLi9rZXlzLmpzXCI7XG5pbXBvcnQgdHlwZSBmcm9tIFwiLi4vdHlwZS5qc1wiO1xuLyoqXG4gKiBwcml2YXRlIF91bmlxQ29udGVudEVxdWFscyBmdW5jdGlvbi5cbiAqIFRoYXQgZnVuY3Rpb24gaXMgY2hlY2tpbmcgZXF1YWxpdHkgb2YgMiBpdGVyYXRvciBjb250ZW50cyB3aXRoIDIgYXNzdW1wdGlvbnNcbiAqIC0gaXRlcmF0b3JzIGxlbmd0aHMgYXJlIHRoZSBzYW1lXG4gKiAtIGl0ZXJhdG9ycyB2YWx1ZXMgYXJlIHVuaXF1ZVxuICpcbiAqIGZhbHNlLXBvc2l0aXZlIHJlc3VsdCB3aWxsIGJlIHJldHVybmVkIGZvciBjb21wYXJpc2lvbiBvZiwgZS5nLlxuICogLSBbMSwyLDNdIGFuZCBbMSwyLDMsNF1cbiAqIC0gWzEsMSwxXSBhbmQgWzEsMiwzXVxuICogKi9cblxuZnVuY3Rpb24gX3VuaXFDb250ZW50RXF1YWxzKGFJdGVyYXRvciwgYkl0ZXJhdG9yLCBzdGFja0EsIHN0YWNrQikge1xuICB2YXIgYSA9IF9hcnJheUZyb21JdGVyYXRvcihhSXRlcmF0b3IpO1xuXG4gIHZhciBiID0gX2FycmF5RnJvbUl0ZXJhdG9yKGJJdGVyYXRvcik7XG5cbiAgZnVuY3Rpb24gZXEoX2EsIF9iKSB7XG4gICAgcmV0dXJuIF9lcXVhbHMoX2EsIF9iLCBzdGFja0Euc2xpY2UoKSwgc3RhY2tCLnNsaWNlKCkpO1xuICB9IC8vIGlmICphKiBhcnJheSBjb250YWlucyBhbnkgZWxlbWVudCB0aGF0IGlzIG5vdCBpbmNsdWRlZCBpbiAqYipcblxuXG4gIHJldHVybiAhX2luY2x1ZGVzV2l0aChmdW5jdGlvbiAoYiwgYUl0ZW0pIHtcbiAgICByZXR1cm4gIV9pbmNsdWRlc1dpdGgoZXEsIGFJdGVtLCBiKTtcbiAgfSwgYiwgYSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIF9lcXVhbHMoYSwgYiwgc3RhY2tBLCBzdGFja0IpIHtcbiAgaWYgKF9vYmplY3RJcyhhLCBiKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgdmFyIHR5cGVBID0gdHlwZShhKTtcblxuICBpZiAodHlwZUEgIT09IHR5cGUoYikpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoYSA9PSBudWxsIHx8IGIgPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmICh0eXBlb2YgYVsnZmFudGFzeS1sYW5kL2VxdWFscyddID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBiWydmYW50YXN5LWxhbmQvZXF1YWxzJ10gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gdHlwZW9mIGFbJ2ZhbnRhc3ktbGFuZC9lcXVhbHMnXSA9PT0gJ2Z1bmN0aW9uJyAmJiBhWydmYW50YXN5LWxhbmQvZXF1YWxzJ10oYikgJiYgdHlwZW9mIGJbJ2ZhbnRhc3ktbGFuZC9lcXVhbHMnXSA9PT0gJ2Z1bmN0aW9uJyAmJiBiWydmYW50YXN5LWxhbmQvZXF1YWxzJ10oYSk7XG4gIH1cblxuICBpZiAodHlwZW9mIGEuZXF1YWxzID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiBiLmVxdWFscyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiB0eXBlb2YgYS5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiYgYS5lcXVhbHMoYikgJiYgdHlwZW9mIGIuZXF1YWxzID09PSAnZnVuY3Rpb24nICYmIGIuZXF1YWxzKGEpO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlQSkge1xuICAgIGNhc2UgJ0FyZ3VtZW50cyc6XG4gICAgY2FzZSAnQXJyYXknOlxuICAgIGNhc2UgJ09iamVjdCc6XG4gICAgICBpZiAodHlwZW9mIGEuY29uc3RydWN0b3IgPT09ICdmdW5jdGlvbicgJiYgX2Z1bmN0aW9uTmFtZShhLmNvbnN0cnVjdG9yKSA9PT0gJ1Byb21pc2UnKSB7XG4gICAgICAgIHJldHVybiBhID09PSBiO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0Jvb2xlYW4nOlxuICAgIGNhc2UgJ051bWJlcic6XG4gICAgY2FzZSAnU3RyaW5nJzpcbiAgICAgIGlmICghKHR5cGVvZiBhID09PSB0eXBlb2YgYiAmJiBfb2JqZWN0SXMoYS52YWx1ZU9mKCksIGIudmFsdWVPZigpKSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ0RhdGUnOlxuICAgICAgaWYgKCFfb2JqZWN0SXMoYS52YWx1ZU9mKCksIGIudmFsdWVPZigpKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnRXJyb3InOlxuICAgICAgcmV0dXJuIGEubmFtZSA9PT0gYi5uYW1lICYmIGEubWVzc2FnZSA9PT0gYi5tZXNzYWdlO1xuXG4gICAgY2FzZSAnUmVnRXhwJzpcbiAgICAgIGlmICghKGEuc291cmNlID09PSBiLnNvdXJjZSAmJiBhLmdsb2JhbCA9PT0gYi5nbG9iYWwgJiYgYS5pZ25vcmVDYXNlID09PSBiLmlnbm9yZUNhc2UgJiYgYS5tdWx0aWxpbmUgPT09IGIubXVsdGlsaW5lICYmIGEuc3RpY2t5ID09PSBiLnN0aWNreSAmJiBhLnVuaWNvZGUgPT09IGIudW5pY29kZSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBicmVhaztcbiAgfVxuXG4gIHZhciBpZHggPSBzdGFja0EubGVuZ3RoIC0gMTtcblxuICB3aGlsZSAoaWR4ID49IDApIHtcbiAgICBpZiAoc3RhY2tBW2lkeF0gPT09IGEpIHtcbiAgICAgIHJldHVybiBzdGFja0JbaWR4XSA9PT0gYjtcbiAgICB9XG5cbiAgICBpZHggLT0gMTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZUEpIHtcbiAgICBjYXNlICdNYXAnOlxuICAgICAgaWYgKGEuc2l6ZSAhPT0gYi5zaXplKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIF91bmlxQ29udGVudEVxdWFscyhhLmVudHJpZXMoKSwgYi5lbnRyaWVzKCksIHN0YWNrQS5jb25jYXQoW2FdKSwgc3RhY2tCLmNvbmNhdChbYl0pKTtcblxuICAgIGNhc2UgJ1NldCc6XG4gICAgICBpZiAoYS5zaXplICE9PSBiLnNpemUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gX3VuaXFDb250ZW50RXF1YWxzKGEudmFsdWVzKCksIGIudmFsdWVzKCksIHN0YWNrQS5jb25jYXQoW2FdKSwgc3RhY2tCLmNvbmNhdChbYl0pKTtcblxuICAgIGNhc2UgJ0FyZ3VtZW50cyc6XG4gICAgY2FzZSAnQXJyYXknOlxuICAgIGNhc2UgJ09iamVjdCc6XG4gICAgY2FzZSAnQm9vbGVhbic6XG4gICAgY2FzZSAnTnVtYmVyJzpcbiAgICBjYXNlICdTdHJpbmcnOlxuICAgIGNhc2UgJ0RhdGUnOlxuICAgIGNhc2UgJ0Vycm9yJzpcbiAgICBjYXNlICdSZWdFeHAnOlxuICAgIGNhc2UgJ0ludDhBcnJheSc6XG4gICAgY2FzZSAnVWludDhBcnJheSc6XG4gICAgY2FzZSAnVWludDhDbGFtcGVkQXJyYXknOlxuICAgIGNhc2UgJ0ludDE2QXJyYXknOlxuICAgIGNhc2UgJ1VpbnQxNkFycmF5JzpcbiAgICBjYXNlICdJbnQzMkFycmF5JzpcbiAgICBjYXNlICdVaW50MzJBcnJheSc6XG4gICAgY2FzZSAnRmxvYXQzMkFycmF5JzpcbiAgICBjYXNlICdGbG9hdDY0QXJyYXknOlxuICAgIGNhc2UgJ0FycmF5QnVmZmVyJzpcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIC8vIFZhbHVlcyBvZiBvdGhlciB0eXBlcyBhcmUgb25seSBlcXVhbCBpZiBpZGVudGljYWwuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIga2V5c0EgPSBrZXlzKGEpO1xuXG4gIGlmIChrZXlzQS5sZW5ndGggIT09IGtleXMoYikubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIGV4dGVuZGVkU3RhY2tBID0gc3RhY2tBLmNvbmNhdChbYV0pO1xuICB2YXIgZXh0ZW5kZWRTdGFja0IgPSBzdGFja0IuY29uY2F0KFtiXSk7XG4gIGlkeCA9IGtleXNBLmxlbmd0aCAtIDE7XG5cbiAgd2hpbGUgKGlkeCA+PSAwKSB7XG4gICAgdmFyIGtleSA9IGtleXNBW2lkeF07XG5cbiAgICBpZiAoIShfaGFzKGtleSwgYikgJiYgX2VxdWFscyhiW2tleV0sIGFba2V5XSwgZXh0ZW5kZWRTdGFja0EsIGV4dGVuZGVkU3RhY2tCKSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZHggLT0gMTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufSIsImltcG9ydCBfY3VycnkyIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTIuanNcIjtcbmltcG9ydCBfZXF1YWxzIGZyb20gXCIuL2ludGVybmFsL19lcXVhbHMuanNcIjtcbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgaXRzIGFyZ3VtZW50cyBhcmUgZXF1aXZhbGVudCwgYGZhbHNlYCBvdGhlcndpc2UuIEhhbmRsZXNcbiAqIGN5Y2xpY2FsIGRhdGEgc3RydWN0dXJlcy5cbiAqXG4gKiBEaXNwYXRjaGVzIHN5bW1ldHJpY2FsbHkgdG8gdGhlIGBlcXVhbHNgIG1ldGhvZHMgb2YgYm90aCBhcmd1bWVudHMsIGlmXG4gKiBwcmVzZW50LlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE1LjBcbiAqIEBjYXRlZ29yeSBSZWxhdGlvblxuICogQHNpZyBhIC0+IGIgLT4gQm9vbGVhblxuICogQHBhcmFtIHsqfSBhXG4gKiBAcGFyYW0geyp9IGJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5lcXVhbHMoMSwgMSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmVxdWFscygxLCAnMScpOyAvLz0+IGZhbHNlXG4gKiAgICAgIFIuZXF1YWxzKFsxLCAyLCAzXSwgWzEsIDIsIDNdKTsgLy89PiB0cnVlXG4gKlxuICogICAgICBjb25zdCBhID0ge307IGEudiA9IGE7XG4gKiAgICAgIGNvbnN0IGIgPSB7fTsgYi52ID0gYjtcbiAqICAgICAgUi5lcXVhbHMoYSwgYik7IC8vPT4gdHJ1ZVxuICovXG5cbnZhciBlcXVhbHMgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBlcXVhbHMoYSwgYikge1xuICByZXR1cm4gX2VxdWFscyhhLCBiLCBbXSwgW10pO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGVxdWFsczsiLCJpbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG4vKipcbiAqIFJldHVybnMgYHRydWVgIGlmIG9uZSBvciBib3RoIG9mIGl0cyBhcmd1bWVudHMgYXJlIGB0cnVlYC4gUmV0dXJucyBgZmFsc2VgXG4gKiBpZiBib3RoIGFyZ3VtZW50cyBhcmUgYGZhbHNlYC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4xLjBcbiAqIEBjYXRlZ29yeSBMb2dpY1xuICogQHNpZyBhIC0+IGIgLT4gYSB8IGJcbiAqIEBwYXJhbSB7QW55fSBhXG4gKiBAcGFyYW0ge0FueX0gYlxuICogQHJldHVybiB7QW55fSB0aGUgZmlyc3QgYXJndW1lbnQgaWYgdHJ1dGh5LCBvdGhlcndpc2UgdGhlIHNlY29uZCBhcmd1bWVudC5cbiAqIEBzZWUgUi5laXRoZXIsIFIueG9yXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5vcih0cnVlLCB0cnVlKTsgLy89PiB0cnVlXG4gKiAgICAgIFIub3IodHJ1ZSwgZmFsc2UpOyAvLz0+IHRydWVcbiAqICAgICAgUi5vcihmYWxzZSwgdHJ1ZSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLm9yKGZhbHNlLCBmYWxzZSk7IC8vPT4gZmFsc2VcbiAqL1xuXG52YXIgb3IgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBvcihhLCBiKSB7XG4gIHJldHVybiBhIHx8IGI7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgb3I7IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IF9oYXMgZnJvbSBcIi4vaW50ZXJuYWwvX2hhcy5qc1wiO1xuaW1wb3J0IGlzTmlsIGZyb20gXCIuL2lzTmlsLmpzXCI7XG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgYSBwYXRoIGV4aXN0cyBpbiBhbiBvYmplY3QuIE9ubHkgdGhlIG9iamVjdCdzXG4gKiBvd24gcHJvcGVydGllcyBhcmUgY2hlY2tlZC5cbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC4yNi4wXG4gKiBAY2F0ZWdvcnkgT2JqZWN0XG4gKiBAdHlwZWRlZm4gSWR4ID0gU3RyaW5nIHwgSW50XG4gKiBAc2lnIFtJZHhdIC0+IHthfSAtPiBCb29sZWFuXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoIFRoZSBwYXRoIHRvIHVzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBjaGVjayB0aGUgcGF0aCBpbi5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIHBhdGggZXhpc3RzLlxuICogQHNlZSBSLmhhc1xuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIFIuaGFzUGF0aChbJ2EnLCAnYiddLCB7YToge2I6IDJ9fSk7ICAgICAgICAgLy8gPT4gdHJ1ZVxuICogICAgICBSLmhhc1BhdGgoWydhJywgJ2InXSwge2E6IHtiOiB1bmRlZmluZWR9fSk7IC8vID0+IHRydWVcbiAqICAgICAgUi5oYXNQYXRoKFsnYScsICdiJ10sIHthOiB7YzogMn19KTsgICAgICAgICAvLyA9PiBmYWxzZVxuICogICAgICBSLmhhc1BhdGgoWydhJywgJ2InXSwge30pOyAgICAgICAgICAgICAgICAgIC8vID0+IGZhbHNlXG4gKi9cblxudmFyIGhhc1BhdGggPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBoYXNQYXRoKF9wYXRoLCBvYmopIHtcbiAgaWYgKF9wYXRoLmxlbmd0aCA9PT0gMCB8fCBpc05pbChvYmopKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgdmFyIHZhbCA9IG9iajtcbiAgdmFyIGlkeCA9IDA7XG5cbiAgd2hpbGUgKGlkeCA8IF9wYXRoLmxlbmd0aCkge1xuICAgIGlmICghaXNOaWwodmFsKSAmJiBfaGFzKF9wYXRoW2lkeF0sIHZhbCkpIHtcbiAgICAgIHZhbCA9IHZhbFtfcGF0aFtpZHhdXTtcbiAgICAgIGlkeCArPSAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgaGFzUGF0aDsiLCJpbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG5pbXBvcnQgaGFzUGF0aCBmcm9tIFwiLi9oYXNQYXRoLmpzXCI7XG4vKipcbiAqIFJldHVybnMgd2hldGhlciBvciBub3QgYW4gb2JqZWN0IGhhcyBhbiBvd24gcHJvcGVydHkgd2l0aCB0aGUgc3BlY2lmaWVkIG5hbWVcbiAqXG4gKiBAZnVuY1xuICogQG1lbWJlck9mIFJcbiAqIEBzaW5jZSB2MC43LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcgcyAtPiB7czogeH0gLT4gQm9vbGVhblxuICogQHBhcmFtIHtTdHJpbmd9IHByb3AgVGhlIG5hbWUgb2YgdGhlIHByb3BlcnR5IHRvIGNoZWNrIGZvci5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmogVGhlIG9iamVjdCB0byBxdWVyeS5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFdoZXRoZXIgdGhlIHByb3BlcnR5IGV4aXN0cy5cbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBjb25zdCBoYXNOYW1lID0gUi5oYXMoJ25hbWUnKTtcbiAqICAgICAgaGFzTmFtZSh7bmFtZTogJ2FsaWNlJ30pOyAgIC8vPT4gdHJ1ZVxuICogICAgICBoYXNOYW1lKHtuYW1lOiAnYm9iJ30pOyAgICAgLy89PiB0cnVlXG4gKiAgICAgIGhhc05hbWUoe30pOyAgICAgICAgICAgICAgICAvLz0+IGZhbHNlXG4gKlxuICogICAgICBjb25zdCBwb2ludCA9IHt4OiAwLCB5OiAwfTtcbiAqICAgICAgY29uc3QgcG9pbnRIYXMgPSBSLmhhcyhSLl9fLCBwb2ludCk7XG4gKiAgICAgIHBvaW50SGFzKCd4Jyk7ICAvLz0+IHRydWVcbiAqICAgICAgcG9pbnRIYXMoJ3knKTsgIC8vPT4gdHJ1ZVxuICogICAgICBwb2ludEhhcygneicpOyAgLy89PiBmYWxzZVxuICovXG5cbnZhciBoYXMgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBoYXMocHJvcCwgb2JqKSB7XG4gIHJldHVybiBoYXNQYXRoKFtwcm9wXSwgb2JqKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBoYXM7IiwiaW1wb3J0IF9jdXJyeTMgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5My5qc1wiO1xuaW1wb3J0IGN1cnJ5TiBmcm9tIFwiLi9jdXJyeU4uanNcIjtcbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBwcm9jZXNzIGVpdGhlciB0aGUgYG9uVHJ1ZWAgb3IgdGhlIGBvbkZhbHNlYFxuICogZnVuY3Rpb24gZGVwZW5kaW5nIHVwb24gdGhlIHJlc3VsdCBvZiB0aGUgYGNvbmRpdGlvbmAgcHJlZGljYXRlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IExvZ2ljXG4gKiBAc2lnICgqLi4uIC0+IEJvb2xlYW4pIC0+ICgqLi4uIC0+ICopIC0+ICgqLi4uIC0+ICopIC0+ICgqLi4uIC0+ICopXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25kaXRpb24gQSBwcmVkaWNhdGUgZnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IG9uVHJ1ZSBBIGZ1bmN0aW9uIHRvIGludm9rZSB3aGVuIHRoZSBgY29uZGl0aW9uYCBldmFsdWF0ZXMgdG8gYSB0cnV0aHkgdmFsdWUuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBvbkZhbHNlIEEgZnVuY3Rpb24gdG8gaW52b2tlIHdoZW4gdGhlIGBjb25kaXRpb25gIGV2YWx1YXRlcyB0byBhIGZhbHN5IHZhbHVlLlxuICogQHJldHVybiB7RnVuY3Rpb259IEEgbmV3IGZ1bmN0aW9uIHRoYXQgd2lsbCBwcm9jZXNzIGVpdGhlciB0aGUgYG9uVHJ1ZWAgb3IgdGhlIGBvbkZhbHNlYFxuICogICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGRlcGVuZGluZyB1cG9uIHRoZSByZXN1bHQgb2YgdGhlIGBjb25kaXRpb25gIHByZWRpY2F0ZS5cbiAqIEBzZWUgUi51bmxlc3MsIFIud2hlbiwgUi5jb25kXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgaW5jQ291bnQgPSBSLmlmRWxzZShcbiAqICAgICAgICBSLmhhcygnY291bnQnKSxcbiAqICAgICAgICBSLm92ZXIoUi5sZW5zUHJvcCgnY291bnQnKSwgUi5pbmMpLFxuICogICAgICAgIFIuYXNzb2MoJ2NvdW50JywgMSlcbiAqICAgICAgKTtcbiAqICAgICAgaW5jQ291bnQoe30pOyAgICAgICAgICAgLy89PiB7IGNvdW50OiAxIH1cbiAqICAgICAgaW5jQ291bnQoeyBjb3VudDogMSB9KTsgLy89PiB7IGNvdW50OiAyIH1cbiAqL1xuXG52YXIgaWZFbHNlID1cbi8qI19fUFVSRV9fKi9cbl9jdXJyeTMoZnVuY3Rpb24gaWZFbHNlKGNvbmRpdGlvbiwgb25UcnVlLCBvbkZhbHNlKSB7XG4gIHJldHVybiBjdXJyeU4oTWF0aC5tYXgoY29uZGl0aW9uLmxlbmd0aCwgb25UcnVlLmxlbmd0aCwgb25GYWxzZS5sZW5ndGgpLCBmdW5jdGlvbiBfaWZFbHNlKCkge1xuICAgIHJldHVybiBjb25kaXRpb24uYXBwbHkodGhpcywgYXJndW1lbnRzKSA/IG9uVHJ1ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIDogb25GYWxzZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9KTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBpZkVsc2U7IiwiaW1wb3J0IF9oYXMgZnJvbSBcIi4vX2hhcy5qc1wiOyAvLyBCYXNlZCBvbiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9PYmplY3QvYXNzaWduXG5cbmZ1bmN0aW9uIF9vYmplY3RBc3NpZ24odGFyZ2V0KSB7XG4gIGlmICh0YXJnZXQgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IHVuZGVmaW5lZCBvciBudWxsIHRvIG9iamVjdCcpO1xuICB9XG5cbiAgdmFyIG91dHB1dCA9IE9iamVjdCh0YXJnZXQpO1xuICB2YXIgaWR4ID0gMTtcbiAgdmFyIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgd2hpbGUgKGlkeCA8IGxlbmd0aCkge1xuICAgIHZhciBzb3VyY2UgPSBhcmd1bWVudHNbaWR4XTtcblxuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgZm9yICh2YXIgbmV4dEtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKF9oYXMobmV4dEtleSwgc291cmNlKSkge1xuICAgICAgICAgIG91dHB1dFtuZXh0S2V5XSA9IHNvdXJjZVtuZXh0S2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlkeCArPSAxO1xuICB9XG5cbiAgcmV0dXJuIG91dHB1dDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdHlwZW9mIE9iamVjdC5hc3NpZ24gPT09ICdmdW5jdGlvbicgPyBPYmplY3QuYXNzaWduIDogX29iamVjdEFzc2lnbjsiLCJpbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG4vKipcbiAqIFNlZSBpZiBhbiBvYmplY3QgKGB2YWxgKSBpcyBhbiBpbnN0YW5jZSBvZiB0aGUgc3VwcGxpZWQgY29uc3RydWN0b3IuIFRoaXNcbiAqIGZ1bmN0aW9uIHdpbGwgY2hlY2sgdXAgdGhlIGluaGVyaXRhbmNlIGNoYWluLCBpZiBhbnkuXG4gKlxuICogQGZ1bmNcbiAqIEBtZW1iZXJPZiBSXG4gKiBAc2luY2UgdjAuMy4wXG4gKiBAY2F0ZWdvcnkgVHlwZVxuICogQHNpZyAoKiAtPiB7Kn0pIC0+IGEgLT4gQm9vbGVhblxuICogQHBhcmFtIHtPYmplY3R9IGN0b3IgQSBjb25zdHJ1Y3RvclxuICogQHBhcmFtIHsqfSB2YWwgVGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5pcyhPYmplY3QsIHt9KTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaXMoTnVtYmVyLCAxKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaXMoT2JqZWN0LCAxKTsgLy89PiBmYWxzZVxuICogICAgICBSLmlzKFN0cmluZywgJ3MnKTsgLy89PiB0cnVlXG4gKiAgICAgIFIuaXMoU3RyaW5nLCBuZXcgU3RyaW5nKCcnKSk7IC8vPT4gdHJ1ZVxuICogICAgICBSLmlzKE9iamVjdCwgbmV3IFN0cmluZygnJykpOyAvLz0+IHRydWVcbiAqICAgICAgUi5pcyhPYmplY3QsICdzJyk7IC8vPT4gZmFsc2VcbiAqICAgICAgUi5pcyhOdW1iZXIsIHt9KTsgLy89PiBmYWxzZVxuICovXG5cbnZhciBpcyA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkyKGZ1bmN0aW9uIGlzKEN0b3IsIHZhbCkge1xuICByZXR1cm4gdmFsICE9IG51bGwgJiYgdmFsLmNvbnN0cnVjdG9yID09PSBDdG9yIHx8IHZhbCBpbnN0YW5jZW9mIEN0b3I7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgaXM7IiwiaW1wb3J0IF9jdXJyeTIgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5Mi5qc1wiO1xuaW1wb3J0IG1hcCBmcm9tIFwiLi9tYXAuanNcIjtcbi8qKlxuICogUmV0dXJucyBhIGxlbnMgZm9yIHRoZSBnaXZlbiBnZXR0ZXIgYW5kIHNldHRlciBmdW5jdGlvbnMuIFRoZSBnZXR0ZXIgXCJnZXRzXCJcbiAqIHRoZSB2YWx1ZSBvZiB0aGUgZm9jdXM7IHRoZSBzZXR0ZXIgXCJzZXRzXCIgdGhlIHZhbHVlIG9mIHRoZSBmb2N1cy4gVGhlIHNldHRlclxuICogc2hvdWxkIG5vdCBtdXRhdGUgdGhlIGRhdGEgc3RydWN0dXJlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjguMFxuICogQGNhdGVnb3J5IE9iamVjdFxuICogQHR5cGVkZWZuIExlbnMgcyBhID0gRnVuY3RvciBmID0+IChhIC0+IGYgYSkgLT4gcyAtPiBmIHNcbiAqIEBzaWcgKHMgLT4gYSkgLT4gKChhLCBzKSAtPiBzKSAtPiBMZW5zIHMgYVxuICogQHBhcmFtIHtGdW5jdGlvbn0gZ2V0dGVyXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBzZXR0ZXJcbiAqIEByZXR1cm4ge0xlbnN9XG4gKiBAc2VlIFIudmlldywgUi5zZXQsIFIub3ZlciwgUi5sZW5zSW5kZXgsIFIubGVuc1Byb3BcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBjb25zdCB4TGVucyA9IFIubGVucyhSLnByb3AoJ3gnKSwgUi5hc3NvYygneCcpKTtcbiAqXG4gKiAgICAgIFIudmlldyh4TGVucywge3g6IDEsIHk6IDJ9KTsgICAgICAgICAgICAvLz0+IDFcbiAqICAgICAgUi5zZXQoeExlbnMsIDQsIHt4OiAxLCB5OiAyfSk7ICAgICAgICAgIC8vPT4ge3g6IDQsIHk6IDJ9XG4gKiAgICAgIFIub3Zlcih4TGVucywgUi5uZWdhdGUsIHt4OiAxLCB5OiAyfSk7ICAvLz0+IHt4OiAtMSwgeTogMn1cbiAqL1xuXG52YXIgbGVucyA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkyKGZ1bmN0aW9uIGxlbnMoZ2V0dGVyLCBzZXR0ZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0b0Z1bmN0b3JGbikge1xuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gbWFwKGZ1bmN0aW9uIChmb2N1cykge1xuICAgICAgICByZXR1cm4gc2V0dGVyKGZvY3VzLCB0YXJnZXQpO1xuICAgICAgfSwgdG9GdW5jdG9yRm4oZ2V0dGVyKHRhcmdldCkpKTtcbiAgICB9O1xuICB9O1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IGxlbnM7IiwiaW1wb3J0IF9jdXJyeTEgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5MS5qc1wiO1xuaW1wb3J0IGFzc29jUGF0aCBmcm9tIFwiLi9hc3NvY1BhdGguanNcIjtcbmltcG9ydCBsZW5zIGZyb20gXCIuL2xlbnMuanNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCIuL3BhdGguanNcIjtcbi8qKlxuICogUmV0dXJucyBhIGxlbnMgd2hvc2UgZm9jdXMgaXMgdGhlIHNwZWNpZmllZCBwYXRoLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE5LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBJZHggPSBTdHJpbmcgfCBJbnRcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIFtJZHhdIC0+IExlbnMgcyBhXG4gKiBAcGFyYW0ge0FycmF5fSBwYXRoIFRoZSBwYXRoIHRvIHVzZS5cbiAqIEByZXR1cm4ge0xlbnN9XG4gKiBAc2VlIFIudmlldywgUi5zZXQsIFIub3ZlclxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIGNvbnN0IHhIZWFkWUxlbnMgPSBSLmxlbnNQYXRoKFsneCcsIDAsICd5J10pO1xuICpcbiAqICAgICAgUi52aWV3KHhIZWFkWUxlbnMsIHt4OiBbe3k6IDIsIHo6IDN9LCB7eTogNCwgejogNX1dfSk7XG4gKiAgICAgIC8vPT4gMlxuICogICAgICBSLnNldCh4SGVhZFlMZW5zLCAxLCB7eDogW3t5OiAyLCB6OiAzfSwge3k6IDQsIHo6IDV9XX0pO1xuICogICAgICAvLz0+IHt4OiBbe3k6IDEsIHo6IDN9LCB7eTogNCwgejogNX1dfVxuICogICAgICBSLm92ZXIoeEhlYWRZTGVucywgUi5uZWdhdGUsIHt4OiBbe3k6IDIsIHo6IDN9LCB7eTogNCwgejogNX1dfSk7XG4gKiAgICAgIC8vPT4ge3g6IFt7eTogLTIsIHo6IDN9LCB7eTogNCwgejogNX1dfVxuICovXG5cbnZhciBsZW5zUGF0aCA9XG4vKiNfX1BVUkVfXyovXG5fY3VycnkxKGZ1bmN0aW9uIGxlbnNQYXRoKHApIHtcbiAgcmV0dXJuIGxlbnMocGF0aChwKSwgYXNzb2NQYXRoKHApKTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBsZW5zUGF0aDsiLCJpbXBvcnQgX29iamVjdEFzc2lnbiBmcm9tIFwiLi9pbnRlcm5hbC9fb2JqZWN0QXNzaWduLmpzXCI7XG5pbXBvcnQgX2N1cnJ5MiBmcm9tIFwiLi9pbnRlcm5hbC9fY3VycnkyLmpzXCI7XG4vKipcbiAqIENyZWF0ZSBhIG5ldyBvYmplY3Qgd2l0aCB0aGUgb3duIHByb3BlcnRpZXMgb2YgdGhlIGZpcnN0IG9iamVjdCBtZXJnZWQgd2l0aFxuICogdGhlIG93biBwcm9wZXJ0aWVzIG9mIHRoZSBzZWNvbmQgb2JqZWN0LiBJZiBhIGtleSBleGlzdHMgaW4gYm90aCBvYmplY3RzLFxuICogdGhlIHZhbHVlIGZyb20gdGhlIHNlY29uZCBvYmplY3Qgd2lsbCBiZSB1c2VkLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjI2LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEBzaWcge2s6IHZ9IC0+IHtrOiB2fSAtPiB7azogdn1cbiAqIEBwYXJhbSB7T2JqZWN0fSBsXG4gKiBAcGFyYW0ge09iamVjdH0gclxuICogQHJldHVybiB7T2JqZWN0fVxuICogQHNlZSBSLm1lcmdlTGVmdCwgUi5tZXJnZURlZXBSaWdodCwgUi5tZXJnZVdpdGgsIFIubWVyZ2VXaXRoS2V5XG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgUi5tZXJnZVJpZ2h0KHsgJ25hbWUnOiAnZnJlZCcsICdhZ2UnOiAxMCB9LCB7ICdhZ2UnOiA0MCB9KTtcbiAqICAgICAgLy89PiB7ICduYW1lJzogJ2ZyZWQnLCAnYWdlJzogNDAgfVxuICpcbiAqICAgICAgY29uc3Qgd2l0aERlZmF1bHRzID0gUi5tZXJnZVJpZ2h0KHt4OiAwLCB5OiAwfSk7XG4gKiAgICAgIHdpdGhEZWZhdWx0cyh7eTogMn0pOyAvLz0+IHt4OiAwLCB5OiAyfVxuICogQHN5bWIgUi5tZXJnZVJpZ2h0KGEsIGIpID0gey4uLmEsIC4uLmJ9XG4gKi9cblxudmFyIG1lcmdlUmlnaHQgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MihmdW5jdGlvbiBtZXJnZVJpZ2h0KGwsIHIpIHtcbiAgcmV0dXJuIF9vYmplY3RBc3NpZ24oe30sIGwsIHIpO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG1lcmdlUmlnaHQ7IiwiaW1wb3J0IF9jdXJyeTMgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5My5qc1wiOyAvLyBgSWRlbnRpdHlgIGlzIGEgZnVuY3RvciB0aGF0IGhvbGRzIGEgc2luZ2xlIHZhbHVlLCB3aGVyZSBgbWFwYCBzaW1wbHlcbi8vIHRyYW5zZm9ybXMgdGhlIGhlbGQgdmFsdWUgd2l0aCB0aGUgcHJvdmlkZWQgZnVuY3Rpb24uXG5cbnZhciBJZGVudGl0eSA9IGZ1bmN0aW9uICh4KSB7XG4gIHJldHVybiB7XG4gICAgdmFsdWU6IHgsXG4gICAgbWFwOiBmdW5jdGlvbiAoZikge1xuICAgICAgcmV0dXJuIElkZW50aXR5KGYoeCkpO1xuICAgIH1cbiAgfTtcbn07XG4vKipcbiAqIFJldHVybnMgdGhlIHJlc3VsdCBvZiBcInNldHRpbmdcIiB0aGUgcG9ydGlvbiBvZiB0aGUgZ2l2ZW4gZGF0YSBzdHJ1Y3R1cmVcbiAqIGZvY3VzZWQgYnkgdGhlIGdpdmVuIGxlbnMgdG8gdGhlIHJlc3VsdCBvZiBhcHBseWluZyB0aGUgZ2l2ZW4gZnVuY3Rpb24gdG9cbiAqIHRoZSBmb2N1c2VkIHZhbHVlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE2LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIExlbnMgcyBhIC0+IChhIC0+IGEpIC0+IHMgLT4gc1xuICogQHBhcmFtIHtMZW5zfSBsZW5zXG4gKiBAcGFyYW0geyp9IHZcbiAqIEBwYXJhbSB7Kn0geFxuICogQHJldHVybiB7Kn1cbiAqIEBzZWUgUi5wcm9wLCBSLmxlbnNJbmRleCwgUi5sZW5zUHJvcFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIGNvbnN0IGhlYWRMZW5zID0gUi5sZW5zSW5kZXgoMCk7XG4gKlxuICogICAgICBSLm92ZXIoaGVhZExlbnMsIFIudG9VcHBlciwgWydmb28nLCAnYmFyJywgJ2JheiddKTsgLy89PiBbJ0ZPTycsICdiYXInLCAnYmF6J11cbiAqL1xuXG5cbnZhciBvdmVyID1cbi8qI19fUFVSRV9fKi9cbl9jdXJyeTMoZnVuY3Rpb24gb3ZlcihsZW5zLCBmLCB4KSB7XG4gIC8vIFRoZSB2YWx1ZSByZXR1cm5lZCBieSB0aGUgZ2V0dGVyIGZ1bmN0aW9uIGlzIGZpcnN0IHRyYW5zZm9ybWVkIHdpdGggYGZgLFxuICAvLyB0aGVuIHNldCBhcyB0aGUgdmFsdWUgb2YgYW4gYElkZW50aXR5YC4gVGhpcyBpcyB0aGVuIG1hcHBlZCBvdmVyIHdpdGggdGhlXG4gIC8vIHNldHRlciBmdW5jdGlvbiBvZiB0aGUgbGVucy5cbiAgcmV0dXJuIGxlbnMoZnVuY3Rpb24gKHkpIHtcbiAgICByZXR1cm4gSWRlbnRpdHkoZih5KSk7XG4gIH0pKHgpLnZhbHVlO1xufSk7XG5cbmV4cG9ydCBkZWZhdWx0IG92ZXI7IiwiaW1wb3J0IF9jdXJyeTMgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5My5qc1wiO1xuaW1wb3J0IGVxdWFscyBmcm9tIFwiLi9lcXVhbHMuanNcIjtcbi8qKlxuICogUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHNwZWNpZmllZCBvYmplY3QgcHJvcGVydHkgaXMgZXF1YWwsIGluXG4gKiBbYFIuZXF1YWxzYF0oI2VxdWFscykgdGVybXMsIHRvIHRoZSBnaXZlbiB2YWx1ZTsgYGZhbHNlYCBvdGhlcndpc2UuXG4gKiBZb3UgY2FuIHRlc3QgbXVsdGlwbGUgcHJvcGVydGllcyB3aXRoIFtgUi53aGVyZUVxYF0oI3doZXJlRXEpLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjEuMFxuICogQGNhdGVnb3J5IFJlbGF0aW9uXG4gKiBAc2lnIFN0cmluZyAtPiBhIC0+IE9iamVjdCAtPiBCb29sZWFuXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZVxuICogQHBhcmFtIHsqfSB2YWxcbiAqIEBwYXJhbSB7Kn0gb2JqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICogQHNlZSBSLndoZXJlRXEsIFIucHJvcFNhdGlzZmllcywgUi5lcXVhbHNcbiAqIEBleGFtcGxlXG4gKlxuICogICAgICBjb25zdCBhYmJ5ID0ge25hbWU6ICdBYmJ5JywgYWdlOiA3LCBoYWlyOiAnYmxvbmQnfTtcbiAqICAgICAgY29uc3QgZnJlZCA9IHtuYW1lOiAnRnJlZCcsIGFnZTogMTIsIGhhaXI6ICdicm93bid9O1xuICogICAgICBjb25zdCBydXN0eSA9IHtuYW1lOiAnUnVzdHknLCBhZ2U6IDEwLCBoYWlyOiAnYnJvd24nfTtcbiAqICAgICAgY29uc3QgYWxvaXMgPSB7bmFtZTogJ0Fsb2lzJywgYWdlOiAxNSwgZGlzcG9zaXRpb246ICdzdXJseSd9O1xuICogICAgICBjb25zdCBraWRzID0gW2FiYnksIGZyZWQsIHJ1c3R5LCBhbG9pc107XG4gKiAgICAgIGNvbnN0IGhhc0Jyb3duSGFpciA9IFIucHJvcEVxKCdoYWlyJywgJ2Jyb3duJyk7XG4gKiAgICAgIFIuZmlsdGVyKGhhc0Jyb3duSGFpciwga2lkcyk7IC8vPT4gW2ZyZWQsIHJ1c3R5XVxuICovXG5cbnZhciBwcm9wRXEgPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MyhmdW5jdGlvbiBwcm9wRXEobmFtZSwgdmFsLCBvYmopIHtcbiAgcmV0dXJuIGVxdWFscyh2YWwsIG9ialtuYW1lXSk7XG59KTtcblxuZXhwb3J0IGRlZmF1bHQgcHJvcEVxOyIsImltcG9ydCBfY3VycnkzIGZyb20gXCIuL2ludGVybmFsL19jdXJyeTMuanNcIjtcbmltcG9ydCBhbHdheXMgZnJvbSBcIi4vYWx3YXlzLmpzXCI7XG5pbXBvcnQgb3ZlciBmcm9tIFwiLi9vdmVyLmpzXCI7XG4vKipcbiAqIFJldHVybnMgdGhlIHJlc3VsdCBvZiBcInNldHRpbmdcIiB0aGUgcG9ydGlvbiBvZiB0aGUgZ2l2ZW4gZGF0YSBzdHJ1Y3R1cmVcbiAqIGZvY3VzZWQgYnkgdGhlIGdpdmVuIGxlbnMgdG8gdGhlIGdpdmVuIHZhbHVlLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE2LjBcbiAqIEBjYXRlZ29yeSBPYmplY3RcbiAqIEB0eXBlZGVmbiBMZW5zIHMgYSA9IEZ1bmN0b3IgZiA9PiAoYSAtPiBmIGEpIC0+IHMgLT4gZiBzXG4gKiBAc2lnIExlbnMgcyBhIC0+IGEgLT4gcyAtPiBzXG4gKiBAcGFyYW0ge0xlbnN9IGxlbnNcbiAqIEBwYXJhbSB7Kn0gdlxuICogQHBhcmFtIHsqfSB4XG4gKiBAcmV0dXJuIHsqfVxuICogQHNlZSBSLnByb3AsIFIubGVuc0luZGV4LCBSLmxlbnNQcm9wXG4gKiBAZXhhbXBsZVxuICpcbiAqICAgICAgY29uc3QgeExlbnMgPSBSLmxlbnNQcm9wKCd4Jyk7XG4gKlxuICogICAgICBSLnNldCh4TGVucywgNCwge3g6IDEsIHk6IDJ9KTsgIC8vPT4ge3g6IDQsIHk6IDJ9XG4gKiAgICAgIFIuc2V0KHhMZW5zLCA4LCB7eDogMSwgeTogMn0pOyAgLy89PiB7eDogOCwgeTogMn1cbiAqL1xuXG52YXIgc2V0ID1cbi8qI19fUFVSRV9fKi9cbl9jdXJyeTMoZnVuY3Rpb24gc2V0KGxlbnMsIHYsIHgpIHtcbiAgcmV0dXJuIG92ZXIobGVucywgYWx3YXlzKHYpLCB4KTtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCBzZXQ7IiwiaW1wb3J0IF9jdXJyeTMgZnJvbSBcIi4vaW50ZXJuYWwvX2N1cnJ5My5qc1wiO1xuLyoqXG4gKiBUZXN0cyB0aGUgZmluYWwgYXJndW1lbnQgYnkgcGFzc2luZyBpdCB0byB0aGUgZ2l2ZW4gcHJlZGljYXRlIGZ1bmN0aW9uLiBJZlxuICogdGhlIHByZWRpY2F0ZSBpcyBzYXRpc2ZpZWQsIHRoZSBmdW5jdGlvbiB3aWxsIHJldHVybiB0aGUgcmVzdWx0IG9mIGNhbGxpbmdcbiAqIHRoZSBgd2hlblRydWVGbmAgZnVuY3Rpb24gd2l0aCB0aGUgc2FtZSBhcmd1bWVudC4gSWYgdGhlIHByZWRpY2F0ZSBpcyBub3RcbiAqIHNhdGlzZmllZCwgdGhlIGFyZ3VtZW50IGlzIHJldHVybmVkIGFzIGlzLlxuICpcbiAqIEBmdW5jXG4gKiBAbWVtYmVyT2YgUlxuICogQHNpbmNlIHYwLjE4LjBcbiAqIEBjYXRlZ29yeSBMb2dpY1xuICogQHNpZyAoYSAtPiBCb29sZWFuKSAtPiAoYSAtPiBhKSAtPiBhIC0+IGFcbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWQgICAgICAgQSBwcmVkaWNhdGUgZnVuY3Rpb25cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHdoZW5UcnVlRm4gQSBmdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgYGNvbmRpdGlvbmBcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZhbHVhdGVzIHRvIGEgdHJ1dGh5IHZhbHVlLlxuICogQHBhcmFtIHsqfSAgICAgICAgeCAgICAgICAgICBBbiBvYmplY3QgdG8gdGVzdCB3aXRoIHRoZSBgcHJlZGAgZnVuY3Rpb24gYW5kXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3MgdG8gYHdoZW5UcnVlRm5gIGlmIG5lY2Vzc2FyeS5cbiAqIEByZXR1cm4geyp9IEVpdGhlciBgeGAgb3IgdGhlIHJlc3VsdCBvZiBhcHBseWluZyBgeGAgdG8gYHdoZW5UcnVlRm5gLlxuICogQHNlZSBSLmlmRWxzZSwgUi51bmxlc3MsIFIuY29uZFxuICogQGV4YW1wbGVcbiAqXG4gKiAgICAgIC8vIHRydW5jYXRlIDo6IFN0cmluZyAtPiBTdHJpbmdcbiAqICAgICAgY29uc3QgdHJ1bmNhdGUgPSBSLndoZW4oXG4gKiAgICAgICAgUi5wcm9wU2F0aXNmaWVzKFIuZ3QoUi5fXywgMTApLCAnbGVuZ3RoJyksXG4gKiAgICAgICAgUi5waXBlKFIudGFrZSgxMCksIFIuYXBwZW5kKCfigKYnKSwgUi5qb2luKCcnKSlcbiAqICAgICAgKTtcbiAqICAgICAgdHJ1bmNhdGUoJzEyMzQ1Jyk7ICAgICAgICAgLy89PiAnMTIzNDUnXG4gKiAgICAgIHRydW5jYXRlKCcwMTIzNDU2Nzg5QUJDJyk7IC8vPT4gJzAxMjM0NTY3ODnigKYnXG4gKi9cblxudmFyIHdoZW4gPVxuLyojX19QVVJFX18qL1xuX2N1cnJ5MyhmdW5jdGlvbiB3aGVuKHByZWQsIHdoZW5UcnVlRm4sIHgpIHtcbiAgcmV0dXJuIHByZWQoeCkgPyB3aGVuVHJ1ZUZuKHgpIDogeDtcbn0pO1xuXG5leHBvcnQgZGVmYXVsdCB3aGVuOyIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUgeyBBcnRlcnksIE5vZGUgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcbmltcG9ydCB7IHNldCwgbGVuc1BhdGggfSBmcm9tICdyYW1kYSc7XG5cbmV4cG9ydCBjbGFzcyBTdG9yZTxUIGV4dGVuZHMgQXJ0ZXJ5RW5naW5lLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+IGV4dGVuZHMgQmVoYXZpb3JTdWJqZWN0PEFydGVyeUVuZ2luZS5FbmdpbmVTdGF0ZTxUPj4ge1xuICBwcml2YXRlIHNldCA9IDxUPihwYXRoOiBzdHJpbmcsIHZhbHVlOiBUKTogdm9pZCA9PiB7XG4gICAgdGhpcy5uZXh0KHNldChsZW5zUGF0aChwYXRoLnNwbGl0KCcuJykpLCB2YWx1ZSwgdGhpcy5nZXRWYWx1ZSgpKSk7XG4gIH1cblxuICBwdWJsaWMgc2V0QXJ0ZXJ5U3RvcmUoYXJ0ZXJ5U3RvcmU6IEJlaGF2aW9yU3ViamVjdDxBcnRlcnk+KTogdm9pZCB7XG4gICAgdGhpcy5zZXQoJ2FydGVyeVN0b3JlJCcsIGFydGVyeVN0b3JlKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRBY3RpdmVOb2RlID0gKG5vZGU/OiBOb2RlKTogdm9pZCA9PiB7XG4gICAgdGhpcy5zZXQoJ2FjdGl2ZU5vZGUnLCBub2RlKTtcbiAgfVxuXG4gIHB1YmxpYyBzZXRCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGUgPSA8VD4oYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlOiBCZWhhdmlvclN1YmplY3Q8VD4pOiB2b2lkID0+IHtcbiAgICB0aGlzLnNldCgnYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJCcsIGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMgQXJ0ZXJ5RW5naW5lLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHN0YXRlVmFsdWU6IEFydGVyeUVuZ2luZS5FbmdpbmVTdGF0ZTxUPik6IFN0b3JlPFQ+IHtcbiAgcmV0dXJuIG5ldyBTdG9yZTxUPihzdGF0ZVZhbHVlKTtcbn1cblxuIiwiaW1wb3J0IFJlYWN0LCB7IGNyZWF0ZUNvbnRleHQsIHVzZUNvbnRleHQsIFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBTdG9yZSB9IGZyb20gJy4vc3RvcmVzL2VuZ2luZSc7XG5cbmNvbnN0IEVuZ2luZVN0b3JlQ29udGV4dCA9IGNyZWF0ZUNvbnRleHQ8U3RvcmU8QXJ0ZXJ5RW5naW5lLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+PihcbiAgbmV3IFN0b3JlPEFydGVyeUVuZ2luZS5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPih7fSlcbik7XG5cbnR5cGUgUHJvcHMgPSBQcm9wc1dpdGhDaGlsZHJlbjx7XG4gIHZhbHVlOiBTdG9yZTxBcnRlcnlFbmdpbmUuQmFzZUJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZT47XG59PlxuZXhwb3J0IGZ1bmN0aW9uIEVuZ2luZVN0b3JlQ29udGV4dFByb3ZpZGVyKHsgY2hpbGRyZW4sIHZhbHVlIH06IFByb3BzKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gKFxuICAgIDxFbmdpbmVTdG9yZUNvbnRleHQuUHJvdmlkZXIgdmFsdWU9e3ZhbHVlfT5cbiAgICAgIHtjaGlsZHJlbn1cbiAgICA8L0VuZ2luZVN0b3JlQ29udGV4dC5Qcm92aWRlcj5cbiAgKVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlRW5naW5lU3RvcmVDb250ZXh0KCk6IFN0b3JlPEFydGVyeUVuZ2luZS5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPiB7XG4gIHJldHVybiB1c2VDb250ZXh0KEVuZ2luZVN0b3JlQ29udGV4dCk7XG59XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VPYnNlcnZhYmxlPFQgZXh0ZW5kcyB1bmtub3duPihvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFQ+IHwgdW5kZWZpbmVkLCBpbml0aWFsVmFsdWU6IFQpOiBUIHtcbiAgY29uc3QgW3ZhbHVlLCBzZXRWYWx1ZV0gPSB1c2VTdGF0ZShpbml0aWFsVmFsdWUpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChvYnNlcnZhYmxlKSB7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBvYnNlcnZhYmxlLnN1YnNjcmliZShzZXRWYWx1ZSk7XG4gICAgICByZXR1cm4gKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9LCBbb2JzZXJ2YWJsZV0pO1xuXG4gIHJldHVybiB2YWx1ZSA/PyBpbml0aWFsVmFsdWU7XG59XG4iLCJpbXBvcnQgeyBBcnRlcnkgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuaW1wb3J0IHVzZU9ic2VydmFibGUgZnJvbSAnLi91c2Utb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyB1c2VFbmdpbmVTdG9yZUNvbnRleHQgfSBmcm9tICcuLi9jb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQXJ0ZXJ5KCk6IEFydGVyeSB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IGVuZ2luZVN0b3JlJCA9IHVzZUVuZ2luZVN0b3JlQ29udGV4dCgpO1xuICBjb25zdCB7IGFydGVyeVN0b3JlJCB9ID0gdXNlT2JzZXJ2YWJsZShlbmdpbmVTdG9yZSQsIHt9KTtcbiAgcmV0dXJuIHVzZU9ic2VydmFibGU8QXJ0ZXJ5IHwgdW5kZWZpbmVkPihhcnRlcnlTdG9yZSQsIHVuZGVmaW5lZCk7XG59XG4iLCJpbXBvcnQgdXNlT2JzZXJ2YWJsZSBmcm9tICcuL3VzZS1vYnNlcnZhYmxlJztcbmltcG9ydCB7IHVzZUVuZ2luZVN0b3JlQ29udGV4dCB9IGZyb20gJy4uL2NvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VDb21tYW5kKCk6IEFydGVyeUVuZ2luZS5Db21tYW5kTmFtZVJ1bm5lck1hcCB7XG4gIGNvbnN0IGVuZ2luZVN0b3JlJCA9IHVzZUVuZ2luZVN0b3JlQ29udGV4dCgpO1xuICBjb25zdCB7IHVzZUNvbW1hbmRTdGF0ZSB9ID0gdXNlT2JzZXJ2YWJsZShlbmdpbmVTdG9yZSQsIHt9KTtcblxuICByZXR1cm4gdXNlQ29tbWFuZFN0YXRlPy5jb21tYW5kTmFtZVJ1bm5lck1hcCA/PyB7fTtcbn1cbiIsImltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHR5cGUgeyBBcnRlcnkgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZShhcnRlcnk6IEFydGVyeSk6IEJlaGF2aW9yU3ViamVjdDxBcnRlcnk+IHtcbiAgcmV0dXJuIG5ldyBCZWhhdmlvclN1YmplY3Q8QXJ0ZXJ5PihhcnRlcnkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0KHN0b3JlJDogQmVoYXZpb3JTdWJqZWN0PEFydGVyeT4gfCB1bmRlZmluZWQsIGFydGVyeTogQXJ0ZXJ5KTogdm9pZCB7XG4gIHN0b3JlJD8ubmV4dChhcnRlcnkpO1xufVxuIiwiaW1wb3J0IHsgdXJsQWxwaGFiZXQgfSBmcm9tICcuL3VybC1hbHBoYWJldC9pbmRleC5qcydcbmxldCByYW5kb20gPSBieXRlcyA9PiBjcnlwdG8uZ2V0UmFuZG9tVmFsdWVzKG5ldyBVaW50OEFycmF5KGJ5dGVzKSlcbmxldCBjdXN0b21SYW5kb20gPSAoYWxwaGFiZXQsIGRlZmF1bHRTaXplLCBnZXRSYW5kb20pID0+IHtcbiAgbGV0IG1hc2sgPSAoMiA8PCAoTWF0aC5sb2coYWxwaGFiZXQubGVuZ3RoIC0gMSkgLyBNYXRoLkxOMikpIC0gMVxuICBsZXQgc3RlcCA9IC1+KCgxLjYgKiBtYXNrICogZGVmYXVsdFNpemUpIC8gYWxwaGFiZXQubGVuZ3RoKVxuICByZXR1cm4gKHNpemUgPSBkZWZhdWx0U2l6ZSkgPT4ge1xuICAgIGxldCBpZCA9ICcnXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgIGxldCBieXRlcyA9IGdldFJhbmRvbShzdGVwKVxuICAgICAgbGV0IGogPSBzdGVwXG4gICAgICB3aGlsZSAoai0tKSB7XG4gICAgICAgIGlkICs9IGFscGhhYmV0W2J5dGVzW2pdICYgbWFza10gfHwgJydcbiAgICAgICAgaWYgKGlkLmxlbmd0aCA9PT0gc2l6ZSkgcmV0dXJuIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5sZXQgY3VzdG9tQWxwaGFiZXQgPSAoYWxwaGFiZXQsIHNpemUgPSAyMSkgPT5cbiAgY3VzdG9tUmFuZG9tKGFscGhhYmV0LCBzaXplLCByYW5kb20pXG5sZXQgbmFub2lkID0gKHNpemUgPSAyMSkgPT5cbiAgY3J5cHRvLmdldFJhbmRvbVZhbHVlcyhuZXcgVWludDhBcnJheShzaXplKSkucmVkdWNlKChpZCwgYnl0ZSkgPT4ge1xuICAgIGJ5dGUgJj0gNjNcbiAgICBpZiAoYnl0ZSA8IDM2KSB7XG4gICAgICBpZCArPSBieXRlLnRvU3RyaW5nKDM2KVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA8IDYyKSB7XG4gICAgICBpZCArPSAoYnl0ZSAtIDI2KS50b1N0cmluZygzNikudG9VcHBlckNhc2UoKVxuICAgIH0gZWxzZSBpZiAoYnl0ZSA+IDYyKSB7XG4gICAgICBpZCArPSAnLSdcbiAgICB9IGVsc2Uge1xuICAgICAgaWQgKz0gJ18nXG4gICAgfVxuICAgIHJldHVybiBpZFxuICB9LCAnJylcbmV4cG9ydCB7IG5hbm9pZCwgY3VzdG9tQWxwaGFiZXQsIGN1c3RvbVJhbmRvbSwgdXJsQWxwaGFiZXQsIHJhbmRvbSB9XG4iLCJpbXBvcnQge1xuICBJbmRpdmlkdWFsTG9vcENvbnRhaW5lciwgQ29tcG9zZWROb2RlTG9vcENvbnRhaW5lcixcbiAgSFRNTE5vZGUsIFJlYWN0Q29tcG9uZW50Tm9kZSwgTGlua05vZGUsIFJlZk5vZGUsIEpTWE5vZGUsIFJvdXRlTm9kZVxufSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcbmltcG9ydCB7IGN1c3RvbUFscGhhYmV0IH0gZnJvbSAnbmFub2lkJztcblxuZXhwb3J0IGNvbnN0IHV1aWQgPSBjdXN0b21BbHBoYWJldCgnMTIzNDU2Nzg5MHF3ZXJ0eXVpb3Bsa2poZ2Zkc2F6eGN2Ym5tUVdFUlRZVUlPUExLSkhHRkRTQVpYQ1ZCTk0nLCA4KTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlTm9kZUlkKHByZWZpeD86IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBgJHtwcmVmaXggfHwgJyd9JHt1dWlkKCl9YDtcbn1cblxuZXhwb3J0IHR5cGUgQnVpbGRIVE1MTm9kZVBhcmFtcyA9IE9taXQ8SFRNTE5vZGUsICdpZCcgfCAndHlwZSc+O1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSFRNTE5vZGUocGFyYW1zOiBCdWlsZEhUTUxOb2RlUGFyYW1zKTogSFRNTE5vZGUge1xuICByZXR1cm4ge1xuICAgIGlkOiBnZW5lcmF0ZU5vZGVJZChgJHtwYXJhbXMubmFtZX0tYCksXG4gICAgdHlwZTogJ2h0bWwtZWxlbWVudCcsXG4gICAgLi4ucGFyYW1zLFxuICB9O1xufVxuXG5leHBvcnQgdHlwZSBCdWlsZExpbmtOb2RlUGFyYW1zID0gT21pdDxMaW5rTm9kZSwgJ2lkJyB8ICd0eXBlJyB8ICduYW1lJyB8ICdpc0xpbmsnPjtcbmV4cG9ydCBmdW5jdGlvbiBidWlsZExpbmtOb2RlKHBhcmFtczogQnVpbGRMaW5rTm9kZVBhcmFtcyk6IExpbmtOb2RlIHtcbiAgcmV0dXJuIHtcbiAgICBpZDogZ2VuZXJhdGVOb2RlSWQoJ2xpbmstJyksXG4gICAgdHlwZTogJ2h0bWwtZWxlbWVudCcsXG4gICAgbmFtZTogJ2EnLFxuICAgIGlzTGluazogdHJ1ZSxcbiAgICAuLi5wYXJhbXMsXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgQnVpbGRSZWFjdENvbXBvbmVudE5vZGVQYXJhbXMgPSBPbWl0PFJlYWN0Q29tcG9uZW50Tm9kZSwgJ2lkJyB8ICd0eXBlJz47XG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSZWFjdENvbXBvbmVudE5vZGUocGFyYW1zOiBCdWlsZFJlYWN0Q29tcG9uZW50Tm9kZVBhcmFtcyk6IFJlYWN0Q29tcG9uZW50Tm9kZSB7XG4gIHJldHVybiB7XG4gICAgaWQ6IGdlbmVyYXRlTm9kZUlkKCdyZWFjdC1jb21wb25lbnQtJyksXG4gICAgdHlwZTogJ3JlYWN0LWNvbXBvbmVudCcsXG4gICAgLi4ucGFyYW1zLFxuICB9XG59XG5cbmV4cG9ydCB0eXBlIEJ1aWxkSW5kaXZpZHVhbExvb3BDb250YWluZXJQYXJhbXMgPSBPbWl0PEluZGl2aWR1YWxMb29wQ29udGFpbmVyLCAnaWQnIHwgJ3R5cGUnPjtcbmV4cG9ydCBmdW5jdGlvbiBidWlsZEluZGl2aWR1YWxMb29wQ29udGFpbmVyTm9kZShwYXJhbXM6IEJ1aWxkSW5kaXZpZHVhbExvb3BDb250YWluZXJQYXJhbXMpOiBJbmRpdmlkdWFsTG9vcENvbnRhaW5lciB7XG4gIHJldHVybiB7XG4gICAgaWQ6IGdlbmVyYXRlTm9kZUlkKCdpbmRpdmlkdWFsLWxvb3AtY29udGFpbmVyLScpLFxuICAgIHR5cGU6ICdsb29wLWNvbnRhaW5lcicsXG4gICAgLi4ucGFyYW1zLFxuICB9XG59XG5cbmV4cG9ydCB0eXBlIEJ1aWxkQ29tcG9zZWROb2RlTG9vcENvbnRhaW5lclBhcmFtcyA9IE9taXQ8Q29tcG9zZWROb2RlTG9vcENvbnRhaW5lciwgJ2lkJyB8ICd0eXBlJz47XG5leHBvcnQgZnVuY3Rpb24gYnVpbGRDb21wb3NlZE5vZGVMb29wQ29udGFpbmVyTm9kZShwYXJhbXM6IEJ1aWxkQ29tcG9zZWROb2RlTG9vcENvbnRhaW5lclBhcmFtcyk6IENvbXBvc2VkTm9kZUxvb3BDb250YWluZXIge1xuICByZXR1cm4ge1xuICAgIGlkOiBnZW5lcmF0ZU5vZGVJZCgnY29tcG9zZWROb2RlLWxvb3AtY29udGFpbmVyLScpLFxuICAgIHR5cGU6ICdsb29wLWNvbnRhaW5lcicsXG4gICAgLi4ucGFyYW1zLFxuICB9XG59XG5cbmV4cG9ydCB0eXBlIEJ1aWxkUmVmTm9kZVBhcmFtcyA9IE9taXQ8UmVmTm9kZSwgJ2lkJyB8ICd0eXBlJz47XG5leHBvcnQgZnVuY3Rpb24gYnVpbGRSZWZOb2RlKHBhcmFtczogQnVpbGRSZWZOb2RlUGFyYW1zKTogUmVmTm9kZSB7XG4gIHJldHVybiB7XG4gICAgaWQ6IGdlbmVyYXRlTm9kZUlkKCdyZWYtJyksXG4gICAgdHlwZTogJ3JlZi1ub2RlJyxcbiAgICAuLi5wYXJhbXMsXG4gIH1cbn1cblxuZXhwb3J0IHR5cGUgQnVpbGRKU1hOb2RlUGFyYW1zID0gT21pdDxKU1hOb2RlLCAnaWQnIHwgJ3R5cGUnPlxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkSlNYTm9kZShwYXJhbXM6IEJ1aWxkSlNYTm9kZVBhcmFtcyk6IEpTWE5vZGUge1xuICByZXR1cm4ge1xuICAgIGlkOiBnZW5lcmF0ZU5vZGVJZCgnanN4LScpLFxuICAgIHR5cGU6ICdqc3gtbm9kZScsXG4gICAgLi4ucGFyYW1zLFxuICB9XG59XG5cbmV4cG9ydCB0eXBlIEJ1aWxkUm91dGVOb2RlUGFyYW1zID0gT21pdDxSb3V0ZU5vZGUsICdpZCcgfCAndHlwZSc+O1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUm91dGVOb2RlKHBhcmFtczogQnVpbGRSb3V0ZU5vZGVQYXJhbXMpOiBSb3V0ZU5vZGUge1xuICByZXR1cm4ge1xuICAgIGlkOiBnZW5lcmF0ZU5vZGVJZCgncm91dGUtJyksXG4gICAgdHlwZTogJ3JvdXRlLW5vZGUnLFxuICAgIC4uLnBhcmFtcyxcbiAgfVxufVxuXG5mdW5jdGlvbiBidWlsZEJsb2NrSWQ8VD4oYmxvY2s6IEFydGVyeUVuZ2luZS5CbG9jazxUPik6IHZvaWQge1xuICBpZiAoIWJsb2NrLmlkKSB7XG4gICAgYmxvY2suaWQgPSBnZW5lcmF0ZU5vZGVJZCgnYmxvY2stJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkZUxheWVySWQ8VD4obGF5ZXI6IEFydGVyeUVuZ2luZS5MYXllcjxUPik6IEFydGVyeUVuZ2luZS5MYXllcjxUPiB7XG4gIGlmICghbGF5ZXIuaWQpIHtcbiAgICBsYXllci5pZCA9IGdlbmVyYXRlTm9kZUlkKCdsYXllci0nKTtcbiAgfVxuICBsYXllci5ibG9ja3MuZm9yRWFjaChidWlsZEJsb2NrSWQpO1xuICByZXR1cm4gbGF5ZXI7XG59XG4iLCJpbXBvcnQgeyBoYXMsIHByb3BFcSwgaXMgfSBmcm9tICdyYW1kYSc7XG5pbXBvcnQge1xuICBMb29wQ29udGFpbmVyTm9kZSwgTm9kZSwgSW5kaXZpZHVhbExvb3BDb250YWluZXIsIENvbXBvc2VkTm9kZUxvb3BDb250YWluZXIsIENvbXBvc2VkTm9kZUNoaWxkLFxuICBIVE1MTm9kZSwgUmVhY3RDb21wb25lbnROb2RlLCBMaW5rTm9kZSwgUmVmTm9kZSwgSlNYTm9kZSwgUm91dGVOb2RlLFxufSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGlzQXJ0ZXJ5Tm9kZShub2RlOiB1bmtub3duKTogbm9kZSBpcyBOb2RlIHtcbiAgcmV0dXJuIGhhcygnaWQnLCBub2RlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTG9vcENvbnRhaW5lck5vZGUobm9kZTogTm9kZSk6IG5vZGUgaXMgTG9vcENvbnRhaW5lck5vZGUge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnbG9vcC1jb250YWluZXInO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJbmRpdmlkdWFsTG9vcENvbnRhaW5lcihub2RlOiBOb2RlKTogbm9kZSBpcyBJbmRpdmlkdWFsTG9vcENvbnRhaW5lciB7XG4gIHJldHVybiBpc0xvb3BDb250YWluZXJOb2RlKG5vZGUpICYmIGhhcygndG9Qcm9wcycsIG5vZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDb21wb3NlZE5vZGVMb29wQ29udGFpbmVyTm9kZShub2RlOiBOb2RlKTogbm9kZSBpcyBDb21wb3NlZE5vZGVMb29wQ29udGFpbmVyIHtcbiAgcmV0dXJuIGlzTG9vcENvbnRhaW5lck5vZGUobm9kZSkgJiYgbm9kZS5ub2RlLnR5cGUgPT09ICdjb21wb3NlZC1ub2RlJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQ29tcG9zZWROb2RlQ2hpbGROb2RlKG5vZGU6IE5vZGUpOiBub2RlIGlzIENvbXBvc2VkTm9kZUNoaWxkIHtcbiAgcmV0dXJuIGhhcygndG9Qcm9wcycsIG5vZGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlSGFzVG9Qcm9wcyhub2RlOiBOb2RlKTogbm9kZSBpcyBJbmRpdmlkdWFsTG9vcENvbnRhaW5lciB8IENvbXBvc2VkTm9kZUNoaWxkIHtcbiAgcmV0dXJuIGlzSW5kaXZpZHVhbExvb3BDb250YWluZXIobm9kZSkgfHwgaXNDb21wb3NlZE5vZGVDaGlsZE5vZGUobm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0hUTUxOb2RlKG5vZGU6IE5vZGUpOiBub2RlIGlzIEhUTUxOb2RlIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ2h0bWwtZWxlbWVudCc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0xpbmtOb2RlKG5vZGU6IE5vZGUpOiBub2RlIGlzIExpbmtOb2RlIHtcbiAgcmV0dXJuIGlzSFRNTE5vZGUobm9kZSkgJiYgcHJvcEVxKCdpc0xpbmsnLCB0cnVlLCBub2RlIGFzIExpbmtOb2RlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhY3RDb21wb25lbnROb2RlKG5vZGU6IE5vZGUpOiBub2RlIGlzIFJlYWN0Q29tcG9uZW50Tm9kZSB7XG4gIHJldHVybiBub2RlLnR5cGUgPT09ICdyZWFjdC1jb21wb25lbnQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNOb2RlQWNjZXB0Q2hpbGQobm9kZTogTm9kZSk6IG5vZGUgaXMgSFRNTE5vZGUgfCBSZWFjdENvbXBvbmVudE5vZGUge1xuICByZXR1cm4gaXNIVE1MTm9kZShub2RlKSB8fCBpc1JlYWN0Q29tcG9uZW50Tm9kZShub2RlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzUmVhY3RDb21wb25lbnROb2RlV2l0aEV4cG9ydE5hbWUobm9kZTogTm9kZSwgZXhwb3J0TmFtZTogc3RyaW5nKTogbm9kZSBpcyBSZWFjdENvbXBvbmVudE5vZGUge1xuICByZXR1cm4gaXNSZWFjdENvbXBvbmVudE5vZGUobm9kZSkgJiYgbm9kZS5leHBvcnROYW1lID09PSBleHBvcnROYW1lO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSZWZOb2RlKG5vZGU6IE5vZGUpOiBub2RlIGlzIFJlZk5vZGUge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAncmVmLW5vZGUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNKU1hOb2RlKG5vZGU6IE5vZGUpOiBub2RlIGlzIEpTWE5vZGUge1xuICByZXR1cm4gbm9kZS50eXBlID09PSAnanN4LW5vZGUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNSb3V0ZU5vZGUobm9kZTogTm9kZSk6IG5vZGUgaXMgUm91dGVOb2RlIHtcbiAgcmV0dXJuIG5vZGUudHlwZSA9PT0gJ3JvdXRlLW5vZGUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNIYXNTdWJOb2RlKG5vZGU6IE5vZGUpOiBub2RlIGlzIFJvdXRlTm9kZSB8IExvb3BDb250YWluZXJOb2RlIHtcbiAgcmV0dXJuIGlzTG9vcENvbnRhaW5lck5vZGUobm9kZSkgfHwgaXNSb3V0ZU5vZGUobm9kZSlcbn1cblxuZXhwb3J0IGNvbnN0IGlzT2JqZWN0ID0gaXMoT2JqZWN0KTtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGFuZCwgbGVuc1BhdGgsIHNldCB9IGZyb20gJ3JhbWRhJztcbmltcG9ydCB7IEFydGVyeSwgTm9kZSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuXG5pbXBvcnQgeyB1c2VPYnNlcnZhYmxlIH0gZnJvbSAnQGFydGVyeUVuZ2luZS9ob29rcyc7XG5pbXBvcnQgeyBzZXQgYXMgc2V0QXJ0ZXJ5IH0gZnJvbSAnQGFydGVyeUVuZ2luZS9zdG9yZXMvYXJ0ZXJ5JztcbmltcG9ydCB7IGdlbmVyYXRlTm9kZUlkIH0gZnJvbSAnQGFydGVyeUVuZ2luZS91dGlscyc7XG5pbXBvcnQgeyB1c2VFbmdpbmVTdG9yZUNvbnRleHQgfSBmcm9tICdAYXJ0ZXJ5RW5naW5lL2NvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBCbG9jazxUIGV4dGVuZHMgQXJ0ZXJ5RW5naW5lLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHByb3BzOiBBcnRlcnlFbmdpbmUuQmxvY2tQcm9wczxUPik6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IHsgc3R5bGUsIHJlbmRlcjogUmVuZGVyLCBpZCA9ICcnLCBvblVwZGF0ZUxheWVyIH0gPSBwcm9wcztcbiAgY29uc3QgZW5naW5lU3RvcmUkID0gdXNlRW5naW5lU3RvcmVDb250ZXh0KCk7XG4gIGNvbnN0IGVuZ2luZVN0YXRlID0gdXNlT2JzZXJ2YWJsZTxBcnRlcnlFbmdpbmUuRW5naW5lU3RhdGU8VD4+KGVuZ2luZVN0b3JlJCwge30pO1xuICBjb25zdCB7IGFydGVyeVN0b3JlJCwgYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJCwgYWN0aXZlTm9kZSwgdXNlQ29tbWFuZFN0YXRlIH0gPSBlbmdpbmVTdGF0ZTtcbiAgY29uc3QgYXJ0ZXJ5ID0gdXNlT2JzZXJ2YWJsZTxBcnRlcnkgfCB1bmRlZmluZWQ+KGFydGVyeVN0b3JlJCwgdW5kZWZpbmVkKTtcbiAgY29uc3Qgc2hhcmVkU3RhdGUgPSB1c2VPYnNlcnZhYmxlPFQ+KGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSQsIHt9IGFzIFQpO1xuXG4gIHVzZUNvbW1hbmRTdGF0ZT8ucmVnaXN0cnkoe1xuICAgIG5hbWU6ICd1cGRhdGVBcnRlcnknLFxuICAgIGV4ZWN1dGU6IChuZXdBcnRlcnk6IEFydGVyeSkgPT4ge1xuICAgICAgaWYgKCFhcnRlcnkpIHtcbiAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVkbygpIHsgc2V0QXJ0ZXJ5KGFydGVyeVN0b3JlJCwgbmV3QXJ0ZXJ5KTsgfSxcbiAgICAgICAgdW5kbygpIHsgc2V0QXJ0ZXJ5KGFydGVyeVN0b3JlJCwgYXJ0ZXJ5KTsgfSxcbiAgICAgIH07XG4gICAgfVxuICB9KVxuXG4gIGNvbnN0IGhhbmRsZUFydGVyeUNoYW5nZSA9IHVzZUNhbGxiYWNrKChhcnRlcnk6IEFydGVyeSk6IHZvaWQgPT4ge1xuICAgIHVzZUNvbW1hbmRTdGF0ZT8uY29tbWFuZE5hbWVSdW5uZXJNYXA/LnVwZGF0ZUFydGVyeT8uKGFydGVyeSk7XG4gIH0sIFt1c2VDb21tYW5kU3RhdGVdKTtcblxuICBjb25zdCBoYW5kbGVTaGFyZWRTdGF0ZUNoYW5nZSA9IHVzZUNhbGxiYWNrKChwYXRoOiBzdHJpbmcsIHZhbHVlOiBUKTogdm9pZCA9PiB7XG4gICAgYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJC5uZXh0KHNldChsZW5zUGF0aChwYXRoLnNwbGl0KCcuJykpLCB2YWx1ZSwgc2hhcmVkU3RhdGUpKTtcbiAgfSwgW3NoYXJlZFN0YXRlLCBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkXSk7XG5cbiAgY29uc3QgaGFuZGxlU2V0QWN0aXZlTm9kZSA9IHVzZUNhbGxiYWNrKChub2RlPzogTm9kZSk6IHZvaWQgPT4ge1xuICAgIGVuZ2luZVN0b3JlJC5zZXRBY3RpdmVOb2RlKG5vZGUpO1xuICB9LCBbZW5naW5lU3RvcmUkXSk7XG5cbiAgY29uc3Qgb25VcGRhdGVCbG9jayA9IHVzZUNhbGxiYWNrKChwYXJhbXM6IE9taXQ8QXJ0ZXJ5RW5naW5lLlVwZGF0ZUxheWVyLCAnbGF5ZXJJZCc+ICYgeyBsYXllcklkPzogc3RyaW5nIH0pOiB2b2lkID0+IHtcbiAgICBvblVwZGF0ZUxheWVyKHsgLi4ucGFyYW1zLCBibG9ja0lkOiBwYXJhbXMuYmxvY2tJZCA/PyBpZCB9KTtcbiAgfSwgW2lkLCBvblVwZGF0ZUxheWVyXSk7XG5cbiAgY29uc3QgeyBjdXJyZW50VW5kb1JlZG9JbmRleCwgcmVkb1VuZG9MaXN0IH0gPSB1c2VDb21tYW5kU3RhdGU/LmNvbW1hbmRTdGF0ZVJlZj8uY3VycmVudCA/PyB7fTtcbiAgY29uc3QgaGFzUmVkb1VuZG9MaXN0ID0gIGFuZChyZWRvVW5kb0xpc3QsIGN1cnJlbnRVbmRvUmVkb0luZGV4KTtcbiAgY29uc3QgY29tbWFuZHNIYXNOZXh0ID0gIGhhc1JlZG9VbmRvTGlzdCA/IGN1cnJlbnRVbmRvUmVkb0luZGV4IDwgcmVkb1VuZG9MaXN0Lmxlbmd0aCAtIDEgOiBmYWxzZTtcbiAgY29uc3QgY29tbWFuZHNIYXNQcmV2ID0gaGFzUmVkb1VuZG9MaXN0ID8gY3VycmVudFVuZG9SZWRvSW5kZXggPiAtMSA6IGZhbHNlO1xuXG4gIGlmICghYXJ0ZXJ5IHx8ICFibG9ja3NDb21tdW5pY2F0aW9uU3RhdGUkKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPVwiYXJ0ZXJ5LWVuZ2luZS1sYXllci1ibG9ja1wiIHN0eWxlPXtzdHlsZX0+XG4gICAgICA8UmVuZGVyXG4gICAgICAgIGFydGVyeT17YXJ0ZXJ5fVxuICAgICAgICBvbkNoYW5nZT17aGFuZGxlQXJ0ZXJ5Q2hhbmdlfVxuICAgICAgICBzaGFyZWRTdGF0ZT17c2hhcmVkU3RhdGV9XG4gICAgICAgIG9uU2hhcmVkU3RhdGVDaGFuZ2U9e2hhbmRsZVNoYXJlZFN0YXRlQ2hhbmdlfVxuICAgICAgICBhY3RpdmVOb2RlPXthY3RpdmVOb2RlfVxuICAgICAgICBjb21tYW5kcz17dXNlQ29tbWFuZFN0YXRlPy5jb21tYW5kTmFtZVJ1bm5lck1hcH1cbiAgICAgICAgY29tbWFuZHNIYXNOZXh0PXtjb21tYW5kc0hhc05leHR9XG4gICAgICAgIGNvbW1hbmRzSGFzUHJldj17Y29tbWFuZHNIYXNQcmV2fVxuICAgICAgICBnZW5lcmF0ZU5vZGVJZD17Z2VuZXJhdGVOb2RlSWR9XG4gICAgICAgIHNldEFjdGl2ZU5vZGU9e2hhbmRsZVNldEFjdGl2ZU5vZGV9XG4gICAgICAgIG9uVXBkYXRlTGF5ZXI9e29uVXBkYXRlTGF5ZXJ9XG4gICAgICAgIG9uVXBkYXRlQmxvY2s9e29uVXBkYXRlQmxvY2t9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApXG59XG4iLCJmdW5jdGlvbiBzdHlsZUluamVjdChjc3MsIHJlZikge1xuICBpZiAoIHJlZiA9PT0gdm9pZCAwICkgcmVmID0ge307XG4gIHZhciBpbnNlcnRBdCA9IHJlZi5pbnNlcnRBdDtcblxuICBpZiAoIWNzcyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnKSB7IHJldHVybjsgfVxuXG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcblxuICBpZiAoaW5zZXJ0QXQgPT09ICd0b3AnKSB7XG4gICAgaWYgKGhlYWQuZmlyc3RDaGlsZCkge1xuICAgICAgaGVhZC5pbnNlcnRCZWZvcmUoc3R5bGUsIGhlYWQuZmlyc3RDaGlsZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgfVxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IHN0eWxlSW5qZWN0O1xuIiwiaW1wb3J0IFJlYWN0LCB7IENTU1Byb3BlcnRpZXMsIHVzZUNhbGxiYWNrIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgeyBtZXJnZVJpZ2h0IH0gZnJvbSBcInJhbWRhXCI7XG5cbmltcG9ydCBCbG9jayBmcm9tICcuLi9ibG9jayc7XG5cbmltcG9ydCAnLi9zdHlsZS5zY3NzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gTGF5ZXI8VCBleHRlbmRzIEFydGVyeUVuZ2luZS5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihwcm9wczogQXJ0ZXJ5RW5naW5lLkxheWVyUHJvcHM8VD4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHsgYmxvY2tzLCB6SW5kZXgsIHN0eWxlLCB1cGRhdGVMYXllciwgaWQgPSAnJyB9ID0gcHJvcHM7XG4gIGNvbnN0IGFydGVyeUVuZ2luZUxheWVyU3R5bGU6IENTU1Byb3BlcnRpZXMgPSBtZXJnZVJpZ2h0KHtcbiAgICBkaXNwbGF5OiAnZ3JpZCcsXG4gICAgZ2FwOiAnMXB4JyxcbiAgICB6SW5kZXgsXG4gIH0sIHN0eWxlKTtcblxuICBjb25zdCBoaWRlRmlsdGVyID0gdXNlQ2FsbGJhY2soKHsgaGlkZSB9OiBBcnRlcnlFbmdpbmUuQmxvY2s8VD4pOiBib29sZWFuID0+IHtcbiAgICByZXR1cm4gaGlkZSAhPT0gdHJ1ZTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZVVwZGF0ZUxheWVyID0gdXNlQ2FsbGJhY2soKHBhcmFtczogT21pdDxBcnRlcnlFbmdpbmUuVXBkYXRlTGF5ZXIsICdsYXllcklkJz4gJiB7IGxheWVySWQ/OiBzdHJpbmcgfSk6IHZvaWQgPT4ge1xuICAgIHVwZGF0ZUxheWVyKHsgLi4ucGFyYW1zLCBsYXllcklkOiBwYXJhbXMubGF5ZXJJZCA/PyBpZCB9KTtcbiAgfSwgW2lkLCB1cGRhdGVMYXllcl0pO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJhcnRlcnktZW5naW5lLWxheWVyXCIgc3R5bGU9e2FydGVyeUVuZ2luZUxheWVyU3R5bGV9PlxuICAgICAge2Jsb2Nrcy5maWx0ZXIoaGlkZUZpbHRlcikubWFwKChibG9jaykgPT4gKFxuICAgICAgICA8QmxvY2s8VD5cbiAgICAgICAgICB7Li4uYmxvY2t9XG4gICAgICAgICAga2V5PXtibG9jay5pZCF9XG4gICAgICAgICAgb25VcGRhdGVMYXllcj17aGFuZGxlVXBkYXRlTGF5ZXJ9XG4gICAgICAgIC8+XG4gICAgICApKX1cbiAgICA8L2Rpdj5cbiAgKVxufVxuIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBpZkVsc2UsIGxlbnNQYXRoLCBvdmVyLCB3aGVuLCBvciwgYW5kLCBtZXJnZVJpZ2h0IH0gZnJvbSAncmFtZGEnO1xuaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZUVmZmVjdCwgdXNlQ2FsbGJhY2sgfSBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCB7IHVzZUVuZ2luZVN0b3JlQ29udGV4dCB9IGZyb20gJ0BhcnRlcnlFbmdpbmUvY29udGV4dCc7XG5cbmltcG9ydCBMYXllciBmcm9tICcuL2NvbXBvbmVudHMvbGF5ZXInO1xuaW1wb3J0IHsgdXNlT2JzZXJ2YWJsZSB9IGZyb20gJy4vaG9va3MnO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL3V0aWxzJztcblxuaW50ZXJmYWNlIFByb3BzPFQ+IHtcbiAgbGF5ZXJzU3RvcmUkOiBCZWhhdmlvclN1YmplY3Q8QXJ0ZXJ5RW5naW5lLkxheWVyPFQ+W10+O1xuICBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGVJbml0aWFsVmFsdWU6IFQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvcmU8VCBleHRlbmRzIEFydGVyeUVuZ2luZS5CYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihwcm9wczogUHJvcHM8VD4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHsgbGF5ZXJzU3RvcmUkLCBibG9ja3NDb21tdW5pY2F0aW9uU3RhdGVJbml0aWFsVmFsdWUgfSA9IHByb3BzXG4gIGNvbnN0IGxheWVycyA9IHVzZU9ic2VydmFibGU8QXJ0ZXJ5RW5naW5lLkxheWVyPFQ+W10+KGxheWVyc1N0b3JlJCwgW10pO1xuICBjb25zdCBlbmdpbmVTdG9yZSQgPSB1c2VFbmdpbmVTdG9yZUNvbnRleHQoKTtcbiAgY29uc3QgYmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlJCA9IHVzZU1lbW8oKCkgPT4gbmV3IEJlaGF2aW9yU3ViamVjdDxUPihibG9ja3NDb21tdW5pY2F0aW9uU3RhdGVJbml0aWFsVmFsdWUpLCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBlbmdpbmVTdG9yZSQuc2V0QmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPFQ+KGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZSQpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgdXBkYXRlTGF5ZXIgPSB1c2VDYWxsYmFjaygoeyBsYXllcklkLCBibG9ja0lkLCBuYW1lLCB2YWx1ZSB9OiBBcnRlcnlFbmdpbmUuVXBkYXRlTGF5ZXIpID0+IHtcbiAgICBjb25zdCBsYXllckluZGV4ID0gbGF5ZXJzLmZpbmRJbmRleChsYXllciA9PiBsYXllci5pZCA9PT0gbGF5ZXJJZCk7XG4gICAgY29uc3QgbGF5ZXIgPSBsYXllcnNbbGF5ZXJJbmRleF0gYXMgQXJ0ZXJ5RW5naW5lLkxheWVyPFQ+IHwgdW5kZWZpbmVkO1xuICAgIGNvbnN0IGJsb2NrSW5kZXggPSBsYXllcj8uYmxvY2tzLmZpbmRJbmRleChibG9jayA9PiBibG9jay5pZCA9PT0gYmxvY2tJZCkgPz8gLTE7XG5cbiAgICBjb25zdCBnZXRWYWx1ZSA9IChsZWZ0VmFsdWU6IHVua25vd24sIHJpZ2h0dmFsdWU6IHVua25vd24pOiB1bmtub3duID0+IHtcbiAgICAgIGNvbnN0IGlzQWxsT2JqZWN0ID0gaXNPYmplY3QobGVmdFZhbHVlKSAmJiBpc09iamVjdChyaWdodHZhbHVlKTtcbiAgICAgIHJldHVybiBpc0FsbE9iamVjdCA/IG1lcmdlUmlnaHQobGVmdFZhbHVlLCByaWdodHZhbHVlKSA6IHJpZ2h0dmFsdWU7XG4gICAgfVxuXG4gICAgY29uc3QgdXBkYXRlciA9ICgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnN0IGdldE5ld0xheWVycyA9IGlmRWxzZShcbiAgICAgICAgKCkgPT4gIWJsb2NrSWQsXG4gICAgICAgICgpID0+IG92ZXIoXG4gICAgICAgICAgbGVuc1BhdGgoW2xheWVySW5kZXhdKSxcbiAgICAgICAgICBsYXllciA9PiBPYmplY3QuYXNzaWduKGxheWVyLCB7IFtuYW1lXTogZ2V0VmFsdWUobGF5ZXJbbmFtZSBhcyBrZXlvZiBBcnRlcnlFbmdpbmUuTGF5ZXI8VD5dLCB2YWx1ZSl9KSxcbiAgICAgICAgICBsYXllcnNcbiAgICAgICAgKSxcbiAgICAgICAgKCkgPT4gb3ZlcihcbiAgICAgICAgICBsZW5zUGF0aChbbGF5ZXJJbmRleCwgJ2Jsb2NrcycsIGJsb2NrSW5kZXhdKSxcbiAgICAgICAgICBibG9jayA9PiBPYmplY3QuYXNzaWduKGJsb2NrLCB7IFtuYW1lXTogZ2V0VmFsdWUoYmxvY2tbbmFtZSBhcyBrZXlvZiBBcnRlcnlFbmdpbmUuQmxvY2s8VD5dLCB2YWx1ZSl9KSxcbiAgICAgICAgICBsYXllcnNcbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgbGF5ZXJzU3RvcmUkLm5leHQoZ2V0TmV3TGF5ZXJzKCkpO1xuICAgIH1cblxuICAgIGNvbnN0IHVwZGF0ZVdoZW5FeGlzdHMgPSB3aGVuKChsYXllcik6IGJvb2xlYW4gPT4gb3IoYW5kKCEhbGF5ZXIsICFibG9ja0lkKSwgYW5kKCEhYmxvY2tJZCwgYmxvY2tJbmRleCAhPT0gLTEpKSwgdXBkYXRlcik7XG4gICAgdXBkYXRlV2hlbkV4aXN0cyhsYXllcik7XG4gIH0sIFtsYXllcnNTdG9yZSQsIGxheWVyc10pO1xuXG4gIGNvbnN0IGhpZGVGaWx0ZXIgPSB1c2VDYWxsYmFjaygobGF5ZXI6IEFydGVyeUVuZ2luZS5MYXllcjxUPik6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiBsYXllci5oaWRlICE9PSB0cnVlO1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAge2xheWVycy5maWx0ZXIoaGlkZUZpbHRlcikubWFwKChsYXllciwgaW5kZXgpID0+IChcbiAgICAgICAgPExheWVyPFQ+XG4gICAgICAgICAgey4uLmxheWVyfVxuICAgICAgICAgIGtleT17bGF5ZXIuaWQhfVxuICAgICAgICAgIHpJbmRleD17aW5kZXh9XG4gICAgICAgICAgdXBkYXRlTGF5ZXI9e3VwZGF0ZUxheWVyfVxuICAgICAgICAvPlxuICAgICAgKSl9XG4gICAgPC8+XG4gIClcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlUmVmLCB1c2VDYWxsYmFjaywgTXV0YWJsZVJlZk9iamVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHsgYXBwZW5kLCBwaWNrIH0gZnJvbSAncmFtZGEnO1xuXG5leHBvcnQgY29uc3QgaW5pdGlhbENvbW1hbmRTdGF0ZSA9IHtcbiAgY3VycmVudFVuZG9SZWRvSW5kZXg6IC0xLFxuICByZWRvVW5kb0xpc3Q6IFtdLFxuICBjb21tYW5kTGlzdDogW10sXG4gIGNvbW1hbmROYW1lUnVubmVyTWFwOiB7fSxcbiAgZGVzdHJveUxpc3Q6IFtdLFxufVxuXG5jb25zdCBnZXRVbmRvQ29tbWFuZCA9IChjb21tYW5kU3RhdGVSZWY6IE11dGFibGVSZWZPYmplY3Q8QXJ0ZXJ5RW5naW5lLkNvbW1hbmRTdGF0ZT4pOiBBcnRlcnlFbmdpbmUuQ29tbWFuZCA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3VuZG8nLFxuICAgIGtleWJvYXJkOiBbJ2N0cmwreiddLFxuICAgIGV4ZWN1dGUoKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByZWRvOiAoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBjdXJyZW50VW5kb1JlZG9JbmRleCwgcmVkb1VuZG9MaXN0IH0gPSBjb21tYW5kU3RhdGVSZWYuY3VycmVudDtcbiAgICAgICAgICBpZiAoY3VycmVudFVuZG9SZWRvSW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHJlZG9VbmRvTGlzdFtjdXJyZW50VW5kb1JlZG9JbmRleF0udW5kbz8uKCk7XG4gICAgICAgICAgY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQuY3VycmVudFVuZG9SZWRvSW5kZXgtLTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5jb25zdCBnZXRSZWRvQ29tbWFuZCA9IChjb21tYW5kU3RhdGVSZWY6IE11dGFibGVSZWZPYmplY3Q8QXJ0ZXJ5RW5naW5lLkNvbW1hbmRTdGF0ZT4pOiBBcnRlcnlFbmdpbmUuQ29tbWFuZCA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ3JlZG8nLFxuICAgIGtleWJvYXJkOiBbJ2N0cmwreScsICdjdHJsK3NoaWZ0K3onXSxcbiAgICBleGVjdXRlKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgcmVkbzogKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgY3VycmVudFVuZG9SZWRvSW5kZXgsIHJlZG9VbmRvTGlzdCB9ID0gY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQ7XG4gICAgICAgICAgaWYgKGN1cnJlbnRVbmRvUmVkb0luZGV4ID09PSByZWRvVW5kb0xpc3QubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZWRvVW5kb0xpc3RbY3VycmVudFVuZG9SZWRvSW5kZXggKyAxXS5yZWRvPy4oKTtcbiAgICAgICAgICBjb21tYW5kU3RhdGVSZWYuY3VycmVudC5jdXJyZW50VW5kb1JlZG9JbmRleCsrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmludGVyZmFjZSBVc2VDb21tYW5kRXhwb3NlSW50ZXJuYWwge1xuICByZWdpc3RyeTogKGNvbW1hbmQ6IEFydGVyeUVuZ2luZS5Db21tYW5kKSA9PiB2b2lkO1xuICBpbml0OiAoKSA9PiB2b2lkO1xuICBvbktleURvd246IChldmVudDogS2V5Ym9hcmRFdmVudCkgPT4gdm9pZDtcbiAgY29tbWFuZE5hbWVSdW5uZXJNYXA6IEFydGVyeUVuZ2luZS5Db21tYW5kTmFtZVJ1bm5lck1hcDtcbn1cbmZ1bmN0aW9uIHVzZUNvbW1hbmRJbnRlcm5hbChjb21tYW5kU3RhdGVSZWY6IE11dGFibGVSZWZPYmplY3Q8QXJ0ZXJ5RW5naW5lLkNvbW1hbmRTdGF0ZT4pOiBVc2VDb21tYW5kRXhwb3NlSW50ZXJuYWwge1xuICBjb25zdCB7IGNvbW1hbmROYW1lUnVubmVyTWFwIH0gPSBjb21tYW5kU3RhdGVSZWYuY3VycmVudDtcblxuICBjb25zdCByZWdpc3RyeSA9IHVzZUNhbGxiYWNrKChjb21tYW5kOiBBcnRlcnlFbmdpbmUuQ29tbWFuZCk6IHZvaWQgPT4ge1xuICAgIGNvbnN0IHsgbmFtZSwgZXhlY3V0ZSwgaW5pdGVyIH0gPSBjb21tYW5kO1xuICAgIGNvbnN0IHtcbiAgICAgIGNvbW1hbmRMaXN0LCBjb21tYW5kTmFtZVJ1bm5lck1hcCwgcmVkb1VuZG9MaXN0LCBjdXJyZW50VW5kb1JlZG9JbmRleCwgZGVzdHJveUxpc3QsXG4gICAgfSA9IGNvbW1hbmRTdGF0ZVJlZi5jdXJyZW50O1xuICAgIGNvbnN0IGluaXRFZmZlY3QgPSBpbml0ZXI/LigpO1xuICAgIGlmIChpbml0RWZmZWN0KSB7XG4gICAgICBkZXN0cm95TGlzdC5wdXNoKGluaXRFZmZlY3QpO1xuICAgIH1cbiAgICBpZiAoY29tbWFuZE5hbWVSdW5uZXJNYXBbbmFtZV0pIHtcbiAgICAgIGNvbnN0IGV4aXN0c0luZGV4ID0gY29tbWFuZExpc3QuZmluZEluZGV4KGl0ZW0gPT4gaXRlbS5uYW1lID09PSBuYW1lKTtcbiAgICAgIGNvbW1hbmRMaXN0LnNwbGljZShleGlzdHNJbmRleCwgMSk7XG4gICAgfVxuICAgIGNvbW1hbmRMaXN0LnB1c2goY29tbWFuZCk7XG4gICAgY29tbWFuZE5hbWVSdW5uZXJNYXBbbmFtZV0gPSAoLi4uYXJnczogdW5rbm93bltdKTogdm9pZCA9PiB7XG4gICAgICBjb25zdCB7IHJlZG8sIHVuZG8gfT0gZXhlY3V0ZSguLi5hcmdzKTtcbiAgICAgIGlmICghcmVkbykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZWRvKCk7XG4gICAgICBpZiAoIXVuZG8pIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IG5ld1JlZG9VbmRvTGlzdCA9IHJlZG9VbmRvTGlzdDtcbiAgICAgIGlmIChuZXdSZWRvVW5kb0xpc3QubGVuZ3RoKSB7XG4gICAgICAgIG5ld1JlZG9VbmRvTGlzdCA9IG5ld1JlZG9VbmRvTGlzdC5zbGljZSgwLCBjdXJyZW50VW5kb1JlZG9JbmRleCArIDEpO1xuICAgICAgfVxuICAgICAgbmV3UmVkb1VuZG9MaXN0ID0gYXBwZW5kKHsgcmVkbywgdW5kbyB9LCBuZXdSZWRvVW5kb0xpc3QpO1xuICAgICAgY29uc3QgbmV3Q3VycmVudFVuZG9SZWRvSW5kZXggPSBjdXJyZW50VW5kb1JlZG9JbmRleCArIDE7XG4gICAgICBPYmplY3QuYXNzaWduKGNvbW1hbmRTdGF0ZVJlZi5jdXJyZW50LCB7XG4gICAgICAgIHJlZG9VbmRvTGlzdDogbmV3UmVkb1VuZG9MaXN0LFxuICAgICAgICBjdXJyZW50VW5kb1JlZG9JbmRleDogbmV3Q3VycmVudFVuZG9SZWRvSW5kZXgsXG4gICAgICB9KVxuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IG9uS2V5RG93biA9IHVzZUNhbGxiYWNrKChlOiBLZXlib2FyZEV2ZW50KTogdm9pZCA9PiB7XG4gICAgY29uc3QgeyBjb21tYW5kTGlzdCwgY29tbWFuZE5hbWVSdW5uZXJNYXAgfSA9IGNvbW1hbmRTdGF0ZVJlZi5jdXJyZW50O1xuICAgIGNvbnN0IHsga2V5LCBzaGlmdEtleSwgYWx0S2V5LCBjdHJsS2V5LCBtZXRhS2V5IH0gPSBlO1xuICAgIGNvbnN0IGtleXM6IHN0cmluZ1tdID0gW107XG4gICAgaWYgKGN0cmxLZXkgfHwgbWV0YUtleSkge1xuICAgICBrZXlzLnB1c2goJ2N0cmwnKTtcbiAgICB9XG4gICAgaWYgKHNoaWZ0S2V5KSB7XG4gICAgICBrZXlzLnB1c2goJ3NoaWZ0Jyk7XG4gICAgfVxuICAgIGlmIChhbHRLZXkpIHtcbiAgICAgIGtleXMucHVzaCgnYWx0Jyk7XG4gICAgfVxuICAgIGtleXMucHVzaChrZXkudG9Mb3dlckNhc2UoKSk7XG4gICAgY29uc3Qga2V5TmFtZXMgPSBrZXlzLmpvaW4oJysnKTtcbiAgICBjb21tYW5kTGlzdC5mb3JFYWNoKGNvbW1hbmQgPT4ge1xuICAgICAgaWYgKCFjb21tYW5kLmtleWJvYXJkKSB7XG4gICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBrZXlzID0gQXJyYXkuaXNBcnJheShjb21tYW5kLmtleWJvYXJkKSA/IGNvbW1hbmQua2V5Ym9hcmQgOiBbY29tbWFuZC5rZXlib2FyZF07XG4gICAgICBpZiAoa2V5cy5pbmNsdWRlcyhrZXlOYW1lcykpIHtcbiAgICAgICAgY29tbWFuZE5hbWVSdW5uZXJNYXBbY29tbWFuZC5uYW1lXT8uKCk7XG4gICAgICB9XG4gICAgfSlcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGluaXQgPSB1c2VDYWxsYmFjaygoKSA9PiB7XG4gICAgcmVnaXN0cnkoZ2V0VW5kb0NvbW1hbmQoY29tbWFuZFN0YXRlUmVmKSk7XG4gICAgcmVnaXN0cnkoZ2V0UmVkb0NvbW1hbmQoY29tbWFuZFN0YXRlUmVmKSk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4geyByZWdpc3RyeSwgb25LZXlEb3duLCBpbml0LCBjb21tYW5kTmFtZVJ1bm5lck1hcCB9O1xufVxuXG5leHBvcnQgdHlwZSBVc2VDb21tYW5kRXhwb3NlUHVibGljID0gT21pdDxVc2VDb21tYW5kRXhwb3NlSW50ZXJuYWwsICdpbml0JyB8ICdvbktleURvd24nPjtcbmV4cG9ydCBmdW5jdGlvbiB1c2VDb21tYW5kUHVibGljKGNvbW1hbmRTdGF0ZVJlZjogTXV0YWJsZVJlZk9iamVjdDxBcnRlcnlFbmdpbmUuQ29tbWFuZFN0YXRlPik6IFVzZUNvbW1hbmRFeHBvc2VQdWJsaWMge1xuICByZXR1cm4gcGljayhbJ3JlZ2lzdHJ5JywgJ2NvbW1hbmROYW1lUnVubmVyTWFwJ10sIHVzZUNvbW1hbmRJbnRlcm5hbChjb21tYW5kU3RhdGVSZWYpKTtcbn1cblxuaW50ZXJmYWNlIFVzZUNvbW1hbmRFeHBvc2VXaXRoQ29tbWFuZFN0YXRlUmVmIGV4dGVuZHMgVXNlQ29tbWFuZEV4cG9zZVB1YmxpYyB7XG4gIGNvbW1hbmRTdGF0ZVJlZjogTXV0YWJsZVJlZk9iamVjdDxBcnRlcnlFbmdpbmUuQ29tbWFuZFN0YXRlPjtcbn1cbmV4cG9ydCBmdW5jdGlvbiB1c2VDb21tYW5kKCk6IFVzZUNvbW1hbmRFeHBvc2VXaXRoQ29tbWFuZFN0YXRlUmVmIHtcbiAgY29uc3QgY29tbWFuZFN0YXRlUmVmID0gdXNlUmVmPEFydGVyeUVuZ2luZS5Db21tYW5kU3RhdGU+KGluaXRpYWxDb21tYW5kU3RhdGUpO1xuICBjb25zdCB7IHJlZ2lzdHJ5LCBvbktleURvd24sIGluaXQsIGNvbW1hbmROYW1lUnVubmVyTWFwIH0gPSB1c2VDb21tYW5kSW50ZXJuYWwoY29tbWFuZFN0YXRlUmVmKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGluaXQoKTtcbiAgfSwgW2luaXRdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgb25LZXlEb3duLCB0cnVlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBvbktleURvd24sIHRydWUpO1xuICAgICAgY29tbWFuZFN0YXRlUmVmLmN1cnJlbnQuZGVzdHJveUxpc3QuZm9yRWFjaChmbiA9PiBmbj8uKCkpO1xuICAgIH1cbiAgfSwgW29uS2V5RG93bl0pO1xuXG4gIHJldHVybiB7IHJlZ2lzdHJ5LCBjb21tYW5kTmFtZVJ1bm5lck1hcCwgY29tbWFuZFN0YXRlUmVmIH07XG59XG4iLCJpbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tIFwicnhqc1wiO1xuXG5pbXBvcnQgeyBCYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlIH0gZnJvbSBcIi4uL3R5cGVcIjtcblxuZnVuY3Rpb24gYWRkPFQgZXh0ZW5kcyBCYXNlQmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlPihzdG9yZSQ6IEJlaGF2aW9yU3ViamVjdDxBcnRlcnlFbmdpbmUuTGF5ZXI8VD5bXT4sIGxheWVyOiBBcnRlcnlFbmdpbmUuTGF5ZXI8VD4pOiB2b2lkIHtcbiAgc3RvcmUkLm5leHQoWy4uLnN0b3JlJC52YWx1ZSwgbGF5ZXJdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZTxUIGV4dGVuZHMgQmFzZUJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZT4obGF5ZXJzPzogQXJ0ZXJ5RW5naW5lLkxheWVyPFQ+W10pOiBCZWhhdmlvclN1YmplY3Q8QXJ0ZXJ5RW5naW5lLkxheWVyPFQ+W10+IHtcbiAgcmV0dXJuIG5ldyBCZWhhdmlvclN1YmplY3Q8QXJ0ZXJ5RW5naW5lLkxheWVyPFQ+W10+KGxheWVycyA/PyBbXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXQ8VCBleHRlbmRzIEJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHN0b3JlJDogQmVoYXZpb3JTdWJqZWN0PEFydGVyeUVuZ2luZS5MYXllcjxUPltdPiwgbGF5ZXJzOiBBcnRlcnlFbmdpbmUuTGF5ZXI8VD5bXSk6IHZvaWQge1xuICBzdG9yZSQubmV4dChsYXllcnMpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0cnlMYXllcnM8VCBleHRlbmRzIEJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHN0b3JlJDogQmVoYXZpb3JTdWJqZWN0PEFydGVyeUVuZ2luZS5MYXllcjxUPltdPiwgbGF5ZXJzOiBBcnRlcnlFbmdpbmUuTGF5ZXI8VD5bXSk6IHZvaWQge1xuICBsYXllcnMuZm9yRWFjaChsYXllciA9PiBhZGQ8VD4oc3RvcmUkLCBsYXllcikpO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8sIHVzZUVmZmVjdCB9IGZyb20gXCJyZWFjdFwiO1xuaW1wb3J0IHR5cGUgeyBBcnRlcnkgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcblxuaW1wb3J0IENvcmUgZnJvbSAnLi9jb3JlJztcbmltcG9ydCB7ICB1c2VDb21tYW5kIH0gZnJvbSAnLi9wbHVnaW4vY29tbWFuZCc7XG5pbXBvcnQgeyBjcmVhdGVBcnRlcnlTdG9yZSwgY3JlYXRlTGF5ZXJzU3RvcmUsIGNyZWF0ZUVuZ2luZVN0b3JlICB9IGZyb20gJy4vc3RvcmVzJztcbmltcG9ydCB7IEVuZ2luZVN0b3JlQ29udGV4dFByb3ZpZGVyIH0gZnJvbSAnLi9jb250ZXh0JztcbmltcG9ydCB7IGJ1aWxkZUxheWVySWQgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5pbXBvcnQgJy4vc3R5bGVzL2luZGV4LnNjc3MnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb3BzPFQ+IHtcbiAgYXJ0ZXJ5OiBBcnRlcnk7XG4gIGxheWVyczogQXJ0ZXJ5RW5naW5lLkxheWVyPFQ+W107XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIEFydGVyeUVuZ2luZTxUIGV4dGVuZHMgQXJ0ZXJ5RW5naW5lLkJhc2VCbG9ja3NDb21tdW5pY2F0aW9uU3RhdGU+KHByb3BzOiBBcnRlcnlFbmdpbmUuUHJvcHM8VD4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHsgYXJ0ZXJ5LCBsYXllcnMsIGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZUluaXRpYWxWYWx1ZSB9ID0gcHJvcHM7XG4gIGNvbnN0IGFydGVyeVN0b3JlJCA9IHVzZU1lbW8oKCkgPT4gY3JlYXRlQXJ0ZXJ5U3RvcmUoYXJ0ZXJ5KSwgW10pO1xuICBjb25zdCB1c2VDb21tYW5kU3RhdGUgPSB1c2VDb21tYW5kKCk7XG4gIGNvbnN0IGVuZ2luZVN0b3JlJCA9IHVzZU1lbW8oKCkgPT4gY3JlYXRlRW5naW5lU3RvcmU8VD4oeyBhcnRlcnlTdG9yZSQsIHVzZUNvbW1hbmRTdGF0ZSB9KSwgW10pO1xuICBjb25zdCBsYXllcnNTdG9yZSQgPSB1c2VNZW1vKCgpID0+IGNyZWF0ZUxheWVyc1N0b3JlKGxheWVycy5tYXAoYnVpbGRlTGF5ZXJJZCkpLCBbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBlbmdpbmVTdG9yZSQuc2V0QXJ0ZXJ5U3RvcmUoYXJ0ZXJ5U3RvcmUkKTtcbiAgfSwgW2FydGVyeVN0b3JlJF0pO1xuXG4gIHJldHVybiAoXG4gICAgPEVuZ2luZVN0b3JlQ29udGV4dFByb3ZpZGVyIHZhbHVlPXtlbmdpbmVTdG9yZSR9PlxuICAgICAgPENvcmU8VD4gbGF5ZXJzU3RvcmUkPXtsYXllcnNTdG9yZSR9IGJsb2Nrc0NvbW11bmljYXRpb25TdGF0ZUluaXRpYWxWYWx1ZT17YmxvY2tzQ29tbXVuaWNhdGlvblN0YXRlSW5pdGlhbFZhbHVlfSAvPlxuICAgIDwvRW5naW5lU3RvcmVDb250ZXh0UHJvdmlkZXI+XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJiaW5kIiwiX2lzQXJyYXlMaWtlIiwiX2lzQXJndW1lbnRzIiwiX3htYXAiLCJjdXJyeU4iLCJrZXlzIiwibnRoIiwicGF0aHMiLCJpc05pbCIsImFzc29jIiwiX29iamVjdElzIiwidHlwZSIsImhhc1BhdGgiLCJtYXAiLCJsZW5zIiwicGF0aCIsImFzc29jUGF0aCIsIl9vYmplY3RBc3NpZ24iLCJlcXVhbHMiLCJzZXQiLCJvdmVyIiwiYWx3YXlzIiwibGVuc1BhdGgiLCJjcmVhdGUiLCJ1c2VDb21tYW5kIiwiX19kZWZQcm9wIiwiX19nZXRPd25Qcm9wU3ltYm9scyIsIl9faGFzT3duUHJvcCIsIl9fcHJvcElzRW51bSIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwiaGFzIiwicHJvcEVxIiwiaXMiLCJfX2RlZlByb3BzIiwiX19nZXRPd25Qcm9wRGVzY3MiLCJfX3NwcmVhZFByb3BzIiwic2V0QXJ0ZXJ5IiwiYW5kIiwibWVyZ2VSaWdodCIsImlmRWxzZSIsIndoZW4iLCJvciIsImFwcGVuZCIsImNyZWF0ZUFydGVyeVN0b3JlIiwiY3JlYXRlRW5naW5lU3RvcmUiLCJjcmVhdGVMYXllcnNTdG9yZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7TUFBZSxTQUFTLGNBQWMsQ0FBQyxDQUFDLEVBQUU7TUFDMUMsRUFBRSxPQUFPLENBQUMsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLEtBQUssUUFBUSxJQUFJLENBQUMsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLElBQUksQ0FBQztNQUN0Rjs7TUNEQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01B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QUM7TUFDaEI7O01DakNlLFNBQVMsTUFBTSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7TUFDdEM7TUFDQSxFQUFFLFFBQVEsQ0FBQztNQUNYLElBQUksS0FBSyxDQUFDO01BQ1YsTUFBTSxPQUFPLFlBQVk7TUFDekIsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUU7TUFDM0IsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQy9CLFFBQVEsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztNQUN6QyxPQUFPLENBQUM7QUFDUjtNQUNBLElBQUksS0FBSyxDQUFDO01BQ1YsTUFBTSxPQUFPLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDbkMsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDdkMsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQzNDLFFBQVEsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztNQUN6QyxPQUFPLENBQUM7QUFDUjtNQUNBLElBQUksS0FBSyxDQUFDO01BQ1YsTUFBTSxPQUFPLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDL0MsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDbkQsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLENBQUM7TUFDVixNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQ3ZELFFBQVEsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztNQUN6QyxPQUFPLENBQUM7QUFDUjtNQUNBLElBQUksS0FBSyxDQUFDO01BQ1YsTUFBTSxPQUFPLFVBQVUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDM0QsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLE9BQU8sQ0FBQztBQUNSO01BQ0EsSUFBSSxLQUFLLEVBQUU7TUFDWCxNQUFNLE9BQU8sVUFBVSxFQUFFLEVBQUUsRUFB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LElBQUksTUFBTSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEdBQUcsS0FBSyxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsRUFBRSxLQUFLLE9BQU8sQ0FBQyxLQUFLLElBQUksR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDakksSUFBSSxNQUFNLFFBQVEsR0FBRyxDQUFDLFNBQVMsRUFBRSxVQUFVLEtBQUs7TUFDaEQsTUFBTSxNQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQ3RFLE1BQU0sT0FBTyxXQUFXLEdBQUdTLFlBQVUsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO01BQzFFLEtBQUssQ0FBQztNQUNOLElBQUksTUFBTSxPQUFPLEdBQUcsTUFBTTtNQUMxQixNQUFNLE1BQU0sWUFBWSxHQUFHQyxRQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNcEIsTUFBSSxDQUFDRSxVQUFRLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsTUFBTUYsTUFBSSxDQUFDRSxVQUFRLENBQUMsQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO01B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
