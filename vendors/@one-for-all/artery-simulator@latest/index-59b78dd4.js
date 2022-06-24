System.register(['react-dom', 'react', '@one-for-all/artery-renderer', 'TEMPORARY_PATCH_FOR_ARTERY_PLUGINS', 'rxjs', '@one-for-all/elements-radar', 'rxjs/operators', '@one-for-all/utils', '@one-for-all/artery-utils', '@one-for-all/artery-engine', './inject-css-11ac49aa.js', '@one-for-all/headless-ui', '@one-for-all/icon'], (function () {
  'use strict';
  var ReactDOM, React, useContext, useRef, useEffect, useState, useCallback, useMemo, useInstantiateProps, useNodeComponent, useBootResult, plugins, BehaviorSubject, Subject, map$1, distinctUntilChanged, filter$1, combineLatest, noop, audit, animationFrames, tap, ElementsRadar, filter, map, audit$1, tap$1, distinctUntilChanged$1, logger, byArbitrary, _appendTo, _insertLeftSiblingTo, _insertRightSiblingTo, travel, parentIdsSeq, keyPathById, deleteByID, insertAfter, getFirstLevelConcreteChildren, nodeHasChildNodes, generateNodeId, DND_DATA_TRANSFER_TYPE_NODE_ID, DND_DATA_TRANSFER_TYPE_ARTERY_NODE, DUMMY_ARTERY_ROOT_NODE_ID, Messenger, MESSAGE_TYPE_ARTERY, MESSAGE_TYPE_ACTIVE_NODE, MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID, MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN, cs, FALLBACK_CONTOUR_NODE_ID, FALLBACK_CONTOUR, n, usePopper, Icon;
  return {
    setters: [function (module) {
      ReactDOM = module["default"];
    }, function (module) {
      React = module["default"];
      useContext = module.useContext;
      useRef = module.useRef;
      useEffect = module.useEffect;
      useState = module.useState;
      useCallback = module.useCallback;
      useMemo = module.useMemo;
    }, function (module) {
      useInstantiateProps = module.useInstantiateProps;
      useNodeComponent = module.useNodeComponent;
      useBootResult = module.useBootResult;
    }, function (module) {
      plugins = module["default"];
    }, function (module) {
      BehaviorSubject = module.BehaviorSubject;
      Subject = module.Subject;
      map$1 = module.map;
      distinctUntilChanged = module.distinctUntilChanged;
      filter$1 = module.filter;
      combineLatest = module.combineLatest;
      noop = module.noop;
      audit = module.audit;
      animationFrames = module.animationFrames;
      tap = module.tap;
    }, function (module) {
      ElementsRadar = module["default"];
    }, function (module) {
      filter = module.filter;
      map = module.map;
      audit$1 = module.audit;
      tap$1 = module.tap;
      distinctUntilChanged$1 = module.distinctUntilChanged;
    }, function (module) {
      logger = module.logger;
    }, function (module) {
      byArbitrary = module.byArbitrary;
      _appendTo = module._appendTo;
      _insertLeftSiblingTo = module._insertLeftSiblingTo;
      _insertRightSiblingTo = module._insertRightSiblingTo;
      travel = module.travel;
      parentIdsSeq = module.parentIdsSeq;
      keyPathById = module.keyPathById;
      deleteByID = module.deleteByID;
      insertAfter = module.insertAfter;
      getFirstLevelConcreteChildren = module.getFirstLevelConcreteChildren;
      nodeHasChildNodes = module.nodeHasChildNodes;
    }, function (module) {
      generateNodeId = module.generateNodeId;
    }, function (module) {
      DND_DATA_TRANSFER_TYPE_NODE_ID = module.D;
      DND_DATA_TRANSFER_TYPE_ARTERY_NODE = module.f;
      DUMMY_ARTERY_ROOT_NODE_ID = module.g;
      Messenger = module.d;
      MESSAGE_TYPE_ARTERY = module.c;
      MESSAGE_TYPE_ACTIVE_NODE = module.b;
      MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID = module.a;
      MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN = module.M;
      cs = module.e;
      FALLBACK_CONTOUR_NODE_ID = module.F;
      FALLBACK_CONTOUR = module.h;
      n = module.n;
    }, function (module) {
      usePopper = module.usePopper;
    }, function (module) {
      Icon = module["default"];
    }],
    execute: (function () {

      const MonitoredElementsContext = React.createContext(new BehaviorSubject(/* @__PURE__ */ new Set()));
      var context_default = MonitoredElementsContext;

      function generateContourNodeReport(report, root) {
        const DUPLICATE_CONTOUR_ID = /* @__PURE__ */ new Set();
        return Array.from(report.entries()).map(([element, { relativeRect, raw }]) => {
          const id = element.dataset.simulatorNodeId;
          if (!id) {
            return;
          }
          if (DUPLICATE_CONTOUR_ID.has(id)) {
            return;
          } else {
            DUPLICATE_CONTOUR_ID.add(id);
          }
          const depth = parseInt(element.dataset.simulatorNodeDepth || "0") || 0;
          const { x: offsetX, y: offsetY } = document.body.getBoundingClientRect();
          return {
            id,
            depth,
            raw,
            relativeRect,
            executor: element.dataset.simulatorNodeExecutor || "",
            absolutePosition: {
              height: relativeRect.height,
              width: relativeRect.width,
              x: root ? relativeRect.x : relativeRect.x - offsetX,
              y: root ? relativeRect.y : relativeRect.y - offsetY
            }
          };
        }).filter((n) => !!n);
      }
      function useElementsRadar(onReport, root) {
        const monitoredElements$ = useContext(context_default);
        const radarRef = useRef();
        useEffect(() => {
          const radar = new ElementsRadar(root);
          radarRef.current = radar;
          monitoredElements$.pipe(filter((elements) => !!elements.size)).subscribe((elements) => radar.track(Array.from(elements)));
          const subscription = radar.getReport$().pipe(map((report) => generateContourNodeReport(report, root))).subscribe(onReport);
          return () => {
            subscription.unsubscribe();
          };
        }, [root]);
        return radarRef;
      }

      function ChildrenRender({ nodes, ctx }) {
        if (!nodes.length) {
          return null;
        }
        return React.createElement(React.Fragment, null, nodes.map((node, i) => React.createElement(node_render_default, { key: `${node.id}-${i}`, node, ctx })));
      }
      var children_render_default = ChildrenRender;

      const DepthContext = React.createContext(0);
      var depth_context_default = DepthContext;

      function register(element, monitoredElements$) {
        const monitoredElements = monitoredElements$.value;
        monitoredElements$.next(monitoredElements.add(element));
      }
      function unregister(element, monitoredElements$) {
        const monitoredElements = monitoredElements$.value;
        monitoredElements.delete(element);
        monitoredElements$.next(monitoredElements);
      }

      /**
       * MIT License
       * 
       * Copyright (c) 2014-present, Lee Byron and other contributors.
       * 
       * Permission is hereby granted, free of charge, to any person obtaining a copy
       * of this software and associated documentation files (the "Software"), to deal
       * in the Software without restriction, including without limitation the rights
       * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
       * copies of the Software, and to permit persons to whom the Software is
       * furnished to do so, subject to the following conditions:
       * 
       * The above copyright notice and this permission notice shall be included in all
       * copies or substantial portions of the Software.
       * 
       * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
       * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
       * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
       * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
       * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
       * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
       * SOFTWARE.
       */
      var DELETE = 'delete';

      // Constants describing the size of trie nodes.
      var SHIFT = 5; // Resulted in best performance after ______?
      var SIZE = 1 << SHIFT;
      var MASK = SIZE - 1;

      // A consistent shared value representing "not set" which equals nothing other
      // than itself, and nothing that could be provided externally.
      var NOT_SET = {};

      // Boolean references, Rough equivalent of `bool &`.
      function MakeRef() {
        return { value: false };
      }

      function SetRef(ref) {
        if (ref) {
          ref.value = true;
        }
      }

      // A function which returns a value representing an "owner" for transient writes
      // to tries. The return value will only ever equal itself, and will not equal
      // the return of any subsequent call of this function.
      function OwnerID() {}

      function ensureSize(iter) {
        if (iter.size === undefined) {
          iter.size = iter.__iterate(returnTrue);
        }
        return iter.size;
      }

      function wrapIndex(iter, index) {
        // This implements "is array index" which the ECMAString spec defines as:
        //
        //     A String property name P is an array index if and only if
        //     ToString(ToUint32(P)) is equal to P and ToUint32(P) is not equal
        //     to 2^32−1.
        //
        // http://www.ecma-international.org/ecma-262/6.0/#sec-array-exotic-objects
        if (typeof index !== 'number') {
          var uint32Index = index >>> 0; // N >>> 0 is shorthand for ToUint32
          if ('' + uint32Index !== index || uint32Index === 4294967295) {
            return NaN;
          }
          index = uint32Index;
        }
        return index < 0 ? ensureSize(iter) + index : index;
      }

      function returnTrue() {
        return true;
      }

      function wholeSlice(begin, end, size) {
        return (
          ((begin === 0 && !isNeg(begin)) ||
            (size !== undefined && begin <= -size)) &&
          (end === undefined || (size !== undefined && end >= size))
        );
      }

      function resolveBegin(begin, size) {
        return resolveIndex(begin, size, 0);
      }

      function resolveEnd(end, size) {
        return resolveIndex(end, size, size);
      }

      function resolveIndex(index, size, defaultIndex) {
        // Sanitize indices using this shorthand for ToInt32(argument)
        // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
        return index === undefined
          ? defaultIndex
          : isNeg(index)
          ? size === Infinity
            ? size
            : Math.max(0, size + index) | 0
          : size === undefined || size === index
          ? index
          : Math.min(size, index) | 0;
      }

      function isNeg(value) {
        // Account for -0 which is negative, but not less than 0.
        return value < 0 || (value === 0 && 1 / value === -Infinity);
      }

      var IS_COLLECTION_SYMBOL = '@@__IMMUTABLE_ITERABLE__@@';

      function isCollection(maybeCollection) {
        return Boolean(maybeCollection && maybeCollection[IS_COLLECTION_SYMBOL]);
      }

      var IS_KEYED_SYMBOL = '@@__IMMUTABLE_KEYED__@@';

      function isKeyed(maybeKeyed) {
        return Boolean(maybeKeyed && maybeKeyed[IS_KEYED_SYMBOL]);
      }

      var IS_INDEXED_SYMBOL = '@@__IMMUTABLE_INDEXED__@@';

      function isIndexed(maybeIndexed) {
        return Boolean(maybeIndexed && maybeIndexed[IS_INDEXED_SYMBOL]);
      }

      function isAssociative(maybeAssociative) {
        return isKeyed(maybeAssociative) || isIndexed(maybeAssociative);
      }

      var Collection = function Collection(value) {
        return isCollection(value) ? value : Seq(value);
      };

      var KeyedCollection = /*@__PURE__*/(function (Collection) {
        function KeyedCollection(value) {
          return isKeyed(value) ? value : KeyedSeq(value);
        }

        if ( Collection ) KeyedCollection.__proto__ = Collection;
        KeyedCollection.prototype = Object.create( Collection && Collection.prototype );
        KeyedCollection.prototype.constructor = KeyedCollection;

        return KeyedCollection;
      }(Collection));

      var IndexedCollection = /*@__PURE__*/(function (Collection) {
        function IndexedCollection(value) {
          return isIndexed(value) ? value : IndexedSeq(value);
        }

        if ( Collection ) IndexedCollection.__proto__ = Collection;
        IndexedCollection.prototype = Object.create( Collection && Collection.prototype );
        IndexedCollection.prototype.constructor = IndexedCollection;

        return IndexedCollection;
      }(Collection));

      var SetCollection = /*@__PURE__*/(function (Collection) {
        function SetCollection(value) {
          return isCollection(value) && !isAssociative(value) ? value : SetSeq(value);
        }

        if ( Collection ) SetCollection.__proto__ = Collection;
        SetCollection.prototype = Object.create( Collection && Collection.prototype );
        SetCollection.prototype.constructor = SetCollection;

        return SetCollection;
      }(Collection));

      Collection.Keyed = KeyedCollection;
      Collection.Indexed = IndexedCollection;
      Collection.Set = SetCollection;

      var IS_SEQ_SYMBOL = '@@__IMMUTABLE_SEQ__@@';

      function isSeq(maybeSeq) {
        return Boolean(maybeSeq && maybeSeq[IS_SEQ_SYMBOL]);
      }

      var IS_RECORD_SYMBOL = '@@__IMMUTABLE_RECORD__@@';

      function isRecord(maybeRecord) {
        return Boolean(maybeRecord && maybeRecord[IS_RECORD_SYMBOL]);
      }

      function isImmutable(maybeImmutable) {
        return isCollection(maybeImmutable) || isRecord(maybeImmutable);
      }

      var IS_ORDERED_SYMBOL = '@@__IMMUTABLE_ORDERED__@@';

      function isOrdered(maybeOrdered) {
        return Boolean(maybeOrdered && maybeOrdered[IS_ORDERED_SYMBOL]);
      }

      var ITERATE_KEYS = 0;
      var ITERATE_VALUES = 1;
      var ITERATE_ENTRIES = 2;

      var REAL_ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator';

      var ITERATOR_SYMBOL = REAL_ITERATOR_SYMBOL || FAUX_ITERATOR_SYMBOL;

      var Iterator = function Iterator(next) {
        this.next = next;
      };

      Iterator.prototype.toString = function toString () {
        return '[Iterator]';
      };

      Iterator.KEYS = ITERATE_KEYS;
      Iterator.VALUES = ITERATE_VALUES;
      Iterator.ENTRIES = ITERATE_ENTRIES;

      Iterator.prototype.inspect = Iterator.prototype.toSource = function () {
        return this.toString();
      };
      Iterator.prototype[ITERATOR_SYMBOL] = function () {
        return this;
      };

      function iteratorValue(type, k, v, iteratorResult) {
        var value = type === 0 ? k : type === 1 ? v : [k, v];
        iteratorResult
          ? (iteratorResult.value = value)
          : (iteratorResult = {
              value: value,
              done: false,
            });
        return iteratorResult;
      }

      function iteratorDone() {
        return { value: undefined, done: true };
      }

      function hasIterator(maybeIterable) {
        if (Array.isArray(maybeIterable)) {
          // IE11 trick as it does not support `Symbol.iterator`
          return true;
        }

        return !!getIteratorFn(maybeIterable);
      }

      function isIterator(maybeIterator) {
        return maybeIterator && typeof maybeIterator.next === 'function';
      }

      function getIterator(iterable) {
        var iteratorFn = getIteratorFn(iterable);
        return iteratorFn && iteratorFn.call(iterable);
      }

      function getIteratorFn(iterable) {
        var iteratorFn =
          iterable &&
          ((REAL_ITERATOR_SYMBOL && iterable[REAL_ITERATOR_SYMBOL]) ||
            iterable[FAUX_ITERATOR_SYMBOL]);
        if (typeof iteratorFn === 'function') {
          return iteratorFn;
        }
      }

      function isEntriesIterable(maybeIterable) {
        var iteratorFn = getIteratorFn(maybeIterable);
        return iteratorFn && iteratorFn === maybeIterable.entries;
      }

      function isKeysIterable(maybeIterable) {
        var iteratorFn = getIteratorFn(maybeIterable);
        return iteratorFn && iteratorFn === maybeIterable.keys;
      }

      var hasOwnProperty = Object.prototype.hasOwnProperty;

      function isArrayLike(value) {
        if (Array.isArray(value) || typeof value === 'string') {
          return true;
        }

        return (
          value &&
          typeof value === 'object' &&
          Number.isInteger(value.length) &&
          value.length >= 0 &&
          (value.length === 0
            ? // Only {length: 0} is considered Array-like.
              Object.keys(value).length === 1
            : // An object is only Array-like if it has a property where the last value
              // in the array-like may be found (which could be undefined).
              value.hasOwnProperty(value.length - 1))
        );
      }

      var Seq = /*@__PURE__*/(function (Collection) {
        function Seq(value) {
          return value === null || value === undefined
            ? emptySequence()
            : isImmutable(value)
            ? value.toSeq()
            : seqFromValue(value);
        }

        if ( Collection ) Seq.__proto__ = Collection;
        Seq.prototype = Object.create( Collection && Collection.prototype );
        Seq.prototype.constructor = Seq;

        Seq.prototype.toSeq = function toSeq () {
          return this;
        };

        Seq.prototype.toString = function toString () {
          return this.__toString('Seq {', '}');
        };

        Seq.prototype.cacheResult = function cacheResult () {
          if (!this._cache && this.__iterateUncached) {
            this._cache = this.entrySeq().toArray();
            this.size = this._cache.length;
          }
          return this;
        };

        // abstract __iterateUncached(fn, reverse)

        Seq.prototype.__iterate = function __iterate (fn, reverse) {
          var cache = this._cache;
          if (cache) {
            var size = cache.length;
            var i = 0;
            while (i !== size) {
              var entry = cache[reverse ? size - ++i : i++];
              if (fn(entry[1], entry[0], this) === false) {
                break;
              }
            }
            return i;
          }
          return this.__iterateUncached(fn, reverse);
        };

        // abstract __iteratorUncached(type, reverse)

        Seq.prototype.__iterator = function __iterator (type, reverse) {
          var cache = this._cache;
          if (cache) {
            var size = cache.length;
            var i = 0;
            return new Iterator(function () {
              if (i === size) {
                return iteratorDone();
              }
              var entry = cache[reverse ? size - ++i : i++];
              return iteratorValue(type, entry[0], entry[1]);
            });
          }
          return this.__iteratorUncached(type, reverse);
        };

        return Seq;
      }(Collection));

      var KeyedSeq = /*@__PURE__*/(function (Seq) {
        function KeyedSeq(value) {
          return value === null || value === undefined
            ? emptySequence().toKeyedSeq()
            : isCollection(value)
            ? isKeyed(value)
              ? value.toSeq()
              : value.fromEntrySeq()
            : isRecord(value)
            ? value.toSeq()
            : keyedSeqFromValue(value);
        }

        if ( Seq ) KeyedSeq.__proto__ = Seq;
        KeyedSeq.prototype = Object.create( Seq && Seq.prototype );
        KeyedSeq.prototype.constructor = KeyedSeq;

        KeyedSeq.prototype.toKeyedSeq = function toKeyedSeq () {
          return this;
        };

        return KeyedSeq;
      }(Seq));

      var IndexedSeq = /*@__PURE__*/(function (Seq) {
        function IndexedSeq(value) {
          return value === null || value === undefined
            ? emptySequence()
            : isCollection(value)
            ? isKeyed(value)
              ? value.entrySeq()
              : value.toIndexedSeq()
            : isRecord(value)
            ? value.toSeq().entrySeq()
            : indexedSeqFromValue(value);
        }

        if ( Seq ) IndexedSeq.__proto__ = Seq;
        IndexedSeq.prototype = Object.create( Seq && Seq.prototype );
        IndexedSeq.prototype.constructor = IndexedSeq;

        IndexedSeq.of = function of (/*...values*/) {
          return IndexedSeq(arguments);
        };

        IndexedSeq.prototype.toIndexedSeq = function toIndexedSeq () {
          return this;
        };

        IndexedSeq.prototype.toString = function toString () {
          return this.__toString('Seq [', ']');
        };

        return IndexedSeq;
      }(Seq));

      var SetSeq = /*@__PURE__*/(function (Seq) {
        function SetSeq(value) {
          return (
            isCollection(value) && !isAssociative(value) ? value : IndexedSeq(value)
          ).toSetSeq();
        }

        if ( Seq ) SetSeq.__proto__ = Seq;
        SetSeq.prototype = Object.create( Seq && Seq.prototype );
        SetSeq.prototype.constructor = SetSeq;

        SetSeq.of = function of (/*...values*/) {
          return SetSeq(arguments);
        };

        SetSeq.prototype.toSetSeq = function toSetSeq () {
          return this;
        };

        return SetSeq;
      }(Seq));

      Seq.isSeq = isSeq;
      Seq.Keyed = KeyedSeq;
      Seq.Set = SetSeq;
      Seq.Indexed = IndexedSeq;

      Seq.prototype[IS_SEQ_SYMBOL] = true;

      // #pragma Root Sequences

      var ArraySeq = /*@__PURE__*/(function (IndexedSeq) {
        function ArraySeq(array) {
          this._array = array;
          this.size = array.length;
        }

        if ( IndexedSeq ) ArraySeq.__proto__ = IndexedSeq;
        ArraySeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
        ArraySeq.prototype.constructor = ArraySeq;

        ArraySeq.prototype.get = function get (index, notSetValue) {
          return this.has(index) ? this._array[wrapIndex(this, index)] : notSetValue;
        };

        ArraySeq.prototype.__iterate = function __iterate (fn, reverse) {
          var array = this._array;
          var size = array.length;
          var i = 0;
          while (i !== size) {
            var ii = reverse ? size - ++i : i++;
            if (fn(array[ii], ii, this) === false) {
              break;
            }
          }
          return i;
        };

        ArraySeq.prototype.__iterator = function __iterator (type, reverse) {
          var array = this._array;
          var size = array.length;
          var i = 0;
          return new Iterator(function () {
            if (i === size) {
              return iteratorDone();
            }
            var ii = reverse ? size - ++i : i++;
            return iteratorValue(type, ii, array[ii]);
          });
        };

        return ArraySeq;
      }(IndexedSeq));

      var ObjectSeq = /*@__PURE__*/(function (KeyedSeq) {
        function ObjectSeq(object) {
          var keys = Object.keys(object);
          this._object = object;
          this._keys = keys;
          this.size = keys.length;
        }

        if ( KeyedSeq ) ObjectSeq.__proto__ = KeyedSeq;
        ObjectSeq.prototype = Object.create( KeyedSeq && KeyedSeq.prototype );
        ObjectSeq.prototype.constructor = ObjectSeq;

        ObjectSeq.prototype.get = function get (key, notSetValue) {
          if (notSetValue !== undefined && !this.has(key)) {
            return notSetValue;
          }
          return this._object[key];
        };

        ObjectSeq.prototype.has = function has (key) {
          return hasOwnProperty.call(this._object, key);
        };

        ObjectSeq.prototype.__iterate = function __iterate (fn, reverse) {
          var object = this._object;
          var keys = this._keys;
          var size = keys.length;
          var i = 0;
          while (i !== size) {
            var key = keys[reverse ? size - ++i : i++];
            if (fn(object[key], key, this) === false) {
              break;
            }
          }
          return i;
        };

        ObjectSeq.prototype.__iterator = function __iterator (type, reverse) {
          var object = this._object;
          var keys = this._keys;
          var size = keys.length;
          var i = 0;
          return new Iterator(function () {
            if (i === size) {
              return iteratorDone();
            }
            var key = keys[reverse ? size - ++i : i++];
            return iteratorValue(type, key, object[key]);
          });
        };

        return ObjectSeq;
      }(KeyedSeq));
      ObjectSeq.prototype[IS_ORDERED_SYMBOL] = true;

      var CollectionSeq = /*@__PURE__*/(function (IndexedSeq) {
        function CollectionSeq(collection) {
          this._collection = collection;
          this.size = collection.length || collection.size;
        }

        if ( IndexedSeq ) CollectionSeq.__proto__ = IndexedSeq;
        CollectionSeq.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
        CollectionSeq.prototype.constructor = CollectionSeq;

        CollectionSeq.prototype.__iterateUncached = function __iterateUncached (fn, reverse) {
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var collection = this._collection;
          var iterator = getIterator(collection);
          var iterations = 0;
          if (isIterator(iterator)) {
            var step;
            while (!(step = iterator.next()).done) {
              if (fn(step.value, iterations++, this) === false) {
                break;
              }
            }
          }
          return iterations;
        };

        CollectionSeq.prototype.__iteratorUncached = function __iteratorUncached (type, reverse) {
          if (reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          var collection = this._collection;
          var iterator = getIterator(collection);
          if (!isIterator(iterator)) {
            return new Iterator(iteratorDone);
          }
          var iterations = 0;
          return new Iterator(function () {
            var step = iterator.next();
            return step.done ? step : iteratorValue(type, iterations++, step.value);
          });
        };

        return CollectionSeq;
      }(IndexedSeq));

      // # pragma Helper functions

      var EMPTY_SEQ;

      function emptySequence() {
        return EMPTY_SEQ || (EMPTY_SEQ = new ArraySeq([]));
      }

      function keyedSeqFromValue(value) {
        var seq = maybeIndexedSeqFromValue(value);
        if (seq) {
          return seq.fromEntrySeq();
        }
        if (typeof value === 'object') {
          return new ObjectSeq(value);
        }
        throw new TypeError(
          'Expected Array or collection object of [k, v] entries, or keyed object: ' +
            value
        );
      }

      function indexedSeqFromValue(value) {
        var seq = maybeIndexedSeqFromValue(value);
        if (seq) {
          return seq;
        }
        throw new TypeError(
          'Expected Array or collection object of values: ' + value
        );
      }

      function seqFromValue(value) {
        var seq = maybeIndexedSeqFromValue(value);
        if (seq) {
          return isEntriesIterable(value)
            ? seq.fromEntrySeq()
            : isKeysIterable(value)
            ? seq.toSetSeq()
            : seq;
        }
        if (typeof value === 'object') {
          return new ObjectSeq(value);
        }
        throw new TypeError(
          'Expected Array or collection object of values, or keyed object: ' + value
        );
      }

      function maybeIndexedSeqFromValue(value) {
        return isArrayLike(value)
          ? new ArraySeq(value)
          : hasIterator(value)
          ? new CollectionSeq(value)
          : undefined;
      }

      var IS_MAP_SYMBOL = '@@__IMMUTABLE_MAP__@@';

      function isMap(maybeMap) {
        return Boolean(maybeMap && maybeMap[IS_MAP_SYMBOL]);
      }

      function isOrderedMap(maybeOrderedMap) {
        return isMap(maybeOrderedMap) && isOrdered(maybeOrderedMap);
      }

      function isValueObject(maybeValue) {
        return Boolean(
          maybeValue &&
            typeof maybeValue.equals === 'function' &&
            typeof maybeValue.hashCode === 'function'
        );
      }

      /**
       * An extension of the "same-value" algorithm as [described for use by ES6 Map
       * and Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#Key_equality)
       *
       * NaN is considered the same as NaN, however -0 and 0 are considered the same
       * value, which is different from the algorithm described by
       * [`Object.is`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is).
       *
       * This is extended further to allow Objects to describe the values they
       * represent, by way of `valueOf` or `equals` (and `hashCode`).
       *
       * Note: because of this extension, the key equality of Immutable.Map and the
       * value equality of Immutable.Set will differ from ES6 Map and Set.
       *
       * ### Defining custom values
       *
       * The easiest way to describe the value an object represents is by implementing
       * `valueOf`. For example, `Date` represents a value by returning a unix
       * timestamp for `valueOf`:
       *
       *     var date1 = new Date(1234567890000); // Fri Feb 13 2009 ...
       *     var date2 = new Date(1234567890000);
       *     date1.valueOf(); // 1234567890000
       *     assert( date1 !== date2 );
       *     assert( Immutable.is( date1, date2 ) );
       *
       * Note: overriding `valueOf` may have other implications if you use this object
       * where JavaScript expects a primitive, such as implicit string coercion.
       *
       * For more complex types, especially collections, implementing `valueOf` may
       * not be performant. An alternative is to implement `equals` and `hashCode`.
       *
       * `equals` takes another object, presumably of similar type, and returns true
       * if it is equal. Equality is symmetrical, so the same result should be
       * returned if this and the argument are flipped.
       *
       *     assert( a.equals(b) === b.equals(a) );
       *
       * `hashCode` returns a 32bit integer number representing the object which will
       * be used to determine how to store the value object in a Map or Set. You must
       * provide both or neither methods, one must not exist without the other.
       *
       * Also, an important relationship between these methods must be upheld: if two
       * values are equal, they *must* return the same hashCode. If the values are not
       * equal, they might have the same hashCode; this is called a hash collision,
       * and while undesirable for performance reasons, it is acceptable.
       *
       *     if (a.equals(b)) {
       *       assert( a.hashCode() === b.hashCode() );
       *     }
       *
       * All Immutable collections are Value Objects: they implement `equals()`
       * and `hashCode()`.
       */
      function is(valueA, valueB) {
        if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
          return true;
        }
        if (!valueA || !valueB) {
          return false;
        }
        if (
          typeof valueA.valueOf === 'function' &&
          typeof valueB.valueOf === 'function'
        ) {
          valueA = valueA.valueOf();
          valueB = valueB.valueOf();
          if (valueA === valueB || (valueA !== valueA && valueB !== valueB)) {
            return true;
          }
          if (!valueA || !valueB) {
            return false;
          }
        }
        return !!(
          isValueObject(valueA) &&
          isValueObject(valueB) &&
          valueA.equals(valueB)
        );
      }

      var imul =
        typeof Math.imul === 'function' && Math.imul(0xffffffff, 2) === -2
          ? Math.imul
          : function imul(a, b) {
              a |= 0; // int
              b |= 0; // int
              var c = a & 0xffff;
              var d = b & 0xffff;
              // Shift by 0 fixes the sign on the high part.
              return (c * d + ((((a >>> 16) * d + c * (b >>> 16)) << 16) >>> 0)) | 0; // int
            };

      // v8 has an optimization for storing 31-bit signed numbers.
      // Values which have either 00 or 11 as the high order bits qualify.
      // This function drops the highest order bit in a signed number, maintaining
      // the sign bit.
      function smi(i32) {
        return ((i32 >>> 1) & 0x40000000) | (i32 & 0xbfffffff);
      }

      var defaultValueOf = Object.prototype.valueOf;

      function hash(o) {
        if (o == null) {
          return hashNullish(o);
        }

        if (typeof o.hashCode === 'function') {
          // Drop any high bits from accidentally long hash codes.
          return smi(o.hashCode(o));
        }

        var v = valueOf(o);

        if (v == null) {
          return hashNullish(v);
        }

        switch (typeof v) {
          case 'boolean':
            // The hash values for built-in constants are a 1 value for each 5-byte
            // shift region expect for the first, which encodes the value. This
            // reduces the odds of a hash collision for these common values.
            return v ? 0x42108421 : 0x42108420;
          case 'number':
            return hashNumber(v);
          case 'string':
            return v.length > STRING_HASH_CACHE_MIN_STRLEN
              ? cachedHashString(v)
              : hashString(v);
          case 'object':
          case 'function':
            return hashJSObj(v);
          case 'symbol':
            return hashSymbol(v);
          default:
            if (typeof v.toString === 'function') {
              return hashString(v.toString());
            }
            throw new Error('Value type ' + typeof v + ' cannot be hashed.');
        }
      }

      function hashNullish(nullish) {
        return nullish === null ? 0x42108422 : /* undefined */ 0x42108423;
      }

      // Compress arbitrarily large numbers into smi hashes.
      function hashNumber(n) {
        if (n !== n || n === Infinity) {
          return 0;
        }
        var hash = n | 0;
        if (hash !== n) {
          hash ^= n * 0xffffffff;
        }
        while (n > 0xffffffff) {
          n /= 0xffffffff;
          hash ^= n;
        }
        return smi(hash);
      }

      function cachedHashString(string) {
        var hashed = stringHashCache[string];
        if (hashed === undefined) {
          hashed = hashString(string);
          if (STRING_HASH_CACHE_SIZE === STRING_HASH_CACHE_MAX_SIZE) {
            STRING_HASH_CACHE_SIZE = 0;
            stringHashCache = {};
          }
          STRING_HASH_CACHE_SIZE++;
          stringHashCache[string] = hashed;
        }
        return hashed;
      }

      // http://jsperf.com/hashing-strings
      function hashString(string) {
        // This is the hash from JVM
        // The hash code for a string is computed as
        // s[0] * 31 ^ (n - 1) + s[1] * 31 ^ (n - 2) + ... + s[n - 1],
        // where s[i] is the ith character of the string and n is the length of
        // the string. We "mod" the result to make it between 0 (inclusive) and 2^31
        // (exclusive) by dropping high bits.
        var hashed = 0;
        for (var ii = 0; ii < string.length; ii++) {
          hashed = (31 * hashed + string.charCodeAt(ii)) | 0;
        }
        return smi(hashed);
      }

      function hashSymbol(sym) {
        var hashed = symbolMap[sym];
        if (hashed !== undefined) {
          return hashed;
        }

        hashed = nextHash();

        symbolMap[sym] = hashed;

        return hashed;
      }

      function hashJSObj(obj) {
        var hashed;
        if (usingWeakMap) {
          hashed = weakMap.get(obj);
          if (hashed !== undefined) {
            return hashed;
          }
        }

        hashed = obj[UID_HASH_KEY];
        if (hashed !== undefined) {
          return hashed;
        }

        if (!canDefineProperty) {
          hashed = obj.propertyIsEnumerable && obj.propertyIsEnumerable[UID_HASH_KEY];
          if (hashed !== undefined) {
            return hashed;
          }

          hashed = getIENodeHash(obj);
          if (hashed !== undefined) {
            return hashed;
          }
        }

        hashed = nextHash();

        if (usingWeakMap) {
          weakMap.set(obj, hashed);
        } else if (isExtensible !== undefined && isExtensible(obj) === false) {
          throw new Error('Non-extensible objects are not allowed as keys.');
        } else if (canDefineProperty) {
          Object.defineProperty(obj, UID_HASH_KEY, {
            enumerable: false,
            configurable: false,
            writable: false,
            value: hashed,
          });
        } else if (
          obj.propertyIsEnumerable !== undefined &&
          obj.propertyIsEnumerable === obj.constructor.prototype.propertyIsEnumerable
        ) {
          // Since we can't define a non-enumerable property on the object
          // we'll hijack one of the less-used non-enumerable properties to
          // save our hash on it. Since this is a function it will not show up in
          // `JSON.stringify` which is what we want.
          obj.propertyIsEnumerable = function () {
            return this.constructor.prototype.propertyIsEnumerable.apply(
              this,
              arguments
            );
          };
          obj.propertyIsEnumerable[UID_HASH_KEY] = hashed;
        } else if (obj.nodeType !== undefined) {
          // At this point we couldn't get the IE `uniqueID` to use as a hash
          // and we couldn't use a non-enumerable property to exploit the
          // dontEnum bug so we simply add the `UID_HASH_KEY` on the node
          // itself.
          obj[UID_HASH_KEY] = hashed;
        } else {
          throw new Error('Unable to set a non-enumerable property on object.');
        }

        return hashed;
      }

      // Get references to ES5 object methods.
      var isExtensible = Object.isExtensible;

      // True if Object.defineProperty works as expected. IE8 fails this test.
      var canDefineProperty = (function () {
        try {
          Object.defineProperty({}, '@', {});
          return true;
        } catch (e) {
          return false;
        }
      })();

      // IE has a `uniqueID` property on DOM nodes. We can construct the hash from it
      // and avoid memory leaks from the IE cloneNode bug.
      function getIENodeHash(node) {
        if (node && node.nodeType > 0) {
          switch (node.nodeType) {
            case 1: // Element
              return node.uniqueID;
            case 9: // Document
              return node.documentElement && node.documentElement.uniqueID;
          }
        }
      }

      function valueOf(obj) {
        return obj.valueOf !== defaultValueOf && typeof obj.valueOf === 'function'
          ? obj.valueOf(obj)
          : obj;
      }

      function nextHash() {
        var nextHash = ++_objHashUID;
        if (_objHashUID & 0x40000000) {
          _objHashUID = 0;
        }
        return nextHash;
      }

      // If possible, use a WeakMap.
      var usingWeakMap = typeof WeakMap === 'function';
      var weakMap;
      if (usingWeakMap) {
        weakMap = new WeakMap();
      }

      var symbolMap = Object.create(null);

      var _objHashUID = 0;

      var UID_HASH_KEY = '__immutablehash__';
      if (typeof Symbol === 'function') {
        UID_HASH_KEY = Symbol(UID_HASH_KEY);
      }

      var STRING_HASH_CACHE_MIN_STRLEN = 16;
      var STRING_HASH_CACHE_MAX_SIZE = 255;
      var STRING_HASH_CACHE_SIZE = 0;
      var stringHashCache = {};

      var ToKeyedSequence = /*@__PURE__*/(function (KeyedSeq) {
        function ToKeyedSequence(indexed, useKeys) {
          this._iter = indexed;
          this._useKeys = useKeys;
          this.size = indexed.size;
        }

        if ( KeyedSeq ) ToKeyedSequence.__proto__ = KeyedSeq;
        ToKeyedSequence.prototype = Object.create( KeyedSeq && KeyedSeq.prototype );
        ToKeyedSequence.prototype.constructor = ToKeyedSequence;

        ToKeyedSequence.prototype.get = function get (key, notSetValue) {
          return this._iter.get(key, notSetValue);
        };

        ToKeyedSequence.prototype.has = function has (key) {
          return this._iter.has(key);
        };

        ToKeyedSequence.prototype.valueSeq = function valueSeq () {
          return this._iter.valueSeq();
        };

        ToKeyedSequence.prototype.reverse = function reverse () {
          var this$1$1 = this;

          var reversedSequence = reverseFactory(this, true);
          if (!this._useKeys) {
            reversedSequence.valueSeq = function () { return this$1$1._iter.toSeq().reverse(); };
          }
          return reversedSequence;
        };

        ToKeyedSequence.prototype.map = function map (mapper, context) {
          var this$1$1 = this;

          var mappedSequence = mapFactory(this, mapper, context);
          if (!this._useKeys) {
            mappedSequence.valueSeq = function () { return this$1$1._iter.toSeq().map(mapper, context); };
          }
          return mappedSequence;
        };

        ToKeyedSequence.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          return this._iter.__iterate(function (v, k) { return fn(v, k, this$1$1); }, reverse);
        };

        ToKeyedSequence.prototype.__iterator = function __iterator (type, reverse) {
          return this._iter.__iterator(type, reverse);
        };

        return ToKeyedSequence;
      }(KeyedSeq));
      ToKeyedSequence.prototype[IS_ORDERED_SYMBOL] = true;

      var ToIndexedSequence = /*@__PURE__*/(function (IndexedSeq) {
        function ToIndexedSequence(iter) {
          this._iter = iter;
          this.size = iter.size;
        }

        if ( IndexedSeq ) ToIndexedSequence.__proto__ = IndexedSeq;
        ToIndexedSequence.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
        ToIndexedSequence.prototype.constructor = ToIndexedSequence;

        ToIndexedSequence.prototype.includes = function includes (value) {
          return this._iter.includes(value);
        };

        ToIndexedSequence.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          var i = 0;
          reverse && ensureSize(this);
          return this._iter.__iterate(
            function (v) { return fn(v, reverse ? this$1$1.size - ++i : i++, this$1$1); },
            reverse
          );
        };

        ToIndexedSequence.prototype.__iterator = function __iterator (type, reverse) {
          var this$1$1 = this;

          var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
          var i = 0;
          reverse && ensureSize(this);
          return new Iterator(function () {
            var step = iterator.next();
            return step.done
              ? step
              : iteratorValue(
                  type,
                  reverse ? this$1$1.size - ++i : i++,
                  step.value,
                  step
                );
          });
        };

        return ToIndexedSequence;
      }(IndexedSeq));

      var ToSetSequence = /*@__PURE__*/(function (SetSeq) {
        function ToSetSequence(iter) {
          this._iter = iter;
          this.size = iter.size;
        }

        if ( SetSeq ) ToSetSequence.__proto__ = SetSeq;
        ToSetSequence.prototype = Object.create( SetSeq && SetSeq.prototype );
        ToSetSequence.prototype.constructor = ToSetSequence;

        ToSetSequence.prototype.has = function has (key) {
          return this._iter.includes(key);
        };

        ToSetSequence.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          return this._iter.__iterate(function (v) { return fn(v, v, this$1$1); }, reverse);
        };

        ToSetSequence.prototype.__iterator = function __iterator (type, reverse) {
          var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
          return new Iterator(function () {
            var step = iterator.next();
            return step.done
              ? step
              : iteratorValue(type, step.value, step.value, step);
          });
        };

        return ToSetSequence;
      }(SetSeq));

      var FromEntriesSequence = /*@__PURE__*/(function (KeyedSeq) {
        function FromEntriesSequence(entries) {
          this._iter = entries;
          this.size = entries.size;
        }

        if ( KeyedSeq ) FromEntriesSequence.__proto__ = KeyedSeq;
        FromEntriesSequence.prototype = Object.create( KeyedSeq && KeyedSeq.prototype );
        FromEntriesSequence.prototype.constructor = FromEntriesSequence;

        FromEntriesSequence.prototype.entrySeq = function entrySeq () {
          return this._iter.toSeq();
        };

        FromEntriesSequence.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          return this._iter.__iterate(function (entry) {
            // Check if entry exists first so array access doesn't throw for holes
            // in the parent iteration.
            if (entry) {
              validateEntry(entry);
              var indexedCollection = isCollection(entry);
              return fn(
                indexedCollection ? entry.get(1) : entry[1],
                indexedCollection ? entry.get(0) : entry[0],
                this$1$1
              );
            }
          }, reverse);
        };

        FromEntriesSequence.prototype.__iterator = function __iterator (type, reverse) {
          var iterator = this._iter.__iterator(ITERATE_VALUES, reverse);
          return new Iterator(function () {
            while (true) {
              var step = iterator.next();
              if (step.done) {
                return step;
              }
              var entry = step.value;
              // Check if entry exists first so array access doesn't throw for holes
              // in the parent iteration.
              if (entry) {
                validateEntry(entry);
                var indexedCollection = isCollection(entry);
                return iteratorValue(
                  type,
                  indexedCollection ? entry.get(0) : entry[0],
                  indexedCollection ? entry.get(1) : entry[1],
                  step
                );
              }
            }
          });
        };

        return FromEntriesSequence;
      }(KeyedSeq));

      ToIndexedSequence.prototype.cacheResult =
        ToKeyedSequence.prototype.cacheResult =
        ToSetSequence.prototype.cacheResult =
        FromEntriesSequence.prototype.cacheResult =
          cacheResultThrough;

      function flipFactory(collection) {
        var flipSequence = makeSequence(collection);
        flipSequence._iter = collection;
        flipSequence.size = collection.size;
        flipSequence.flip = function () { return collection; };
        flipSequence.reverse = function () {
          var reversedSequence = collection.reverse.apply(this); // super.reverse()
          reversedSequence.flip = function () { return collection.reverse(); };
          return reversedSequence;
        };
        flipSequence.has = function (key) { return collection.includes(key); };
        flipSequence.includes = function (key) { return collection.has(key); };
        flipSequence.cacheResult = cacheResultThrough;
        flipSequence.__iterateUncached = function (fn, reverse) {
          var this$1$1 = this;

          return collection.__iterate(function (v, k) { return fn(k, v, this$1$1) !== false; }, reverse);
        };
        flipSequence.__iteratorUncached = function (type, reverse) {
          if (type === ITERATE_ENTRIES) {
            var iterator = collection.__iterator(type, reverse);
            return new Iterator(function () {
              var step = iterator.next();
              if (!step.done) {
                var k = step.value[0];
                step.value[0] = step.value[1];
                step.value[1] = k;
              }
              return step;
            });
          }
          return collection.__iterator(
            type === ITERATE_VALUES ? ITERATE_KEYS : ITERATE_VALUES,
            reverse
          );
        };
        return flipSequence;
      }

      function mapFactory(collection, mapper, context) {
        var mappedSequence = makeSequence(collection);
        mappedSequence.size = collection.size;
        mappedSequence.has = function (key) { return collection.has(key); };
        mappedSequence.get = function (key, notSetValue) {
          var v = collection.get(key, NOT_SET);
          return v === NOT_SET
            ? notSetValue
            : mapper.call(context, v, key, collection);
        };
        mappedSequence.__iterateUncached = function (fn, reverse) {
          var this$1$1 = this;

          return collection.__iterate(
            function (v, k, c) { return fn(mapper.call(context, v, k, c), k, this$1$1) !== false; },
            reverse
          );
        };
        mappedSequence.__iteratorUncached = function (type, reverse) {
          var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
          return new Iterator(function () {
            var step = iterator.next();
            if (step.done) {
              return step;
            }
            var entry = step.value;
            var key = entry[0];
            return iteratorValue(
              type,
              key,
              mapper.call(context, entry[1], key, collection),
              step
            );
          });
        };
        return mappedSequence;
      }

      function reverseFactory(collection, useKeys) {
        var this$1$1 = this;

        var reversedSequence = makeSequence(collection);
        reversedSequence._iter = collection;
        reversedSequence.size = collection.size;
        reversedSequence.reverse = function () { return collection; };
        if (collection.flip) {
          reversedSequence.flip = function () {
            var flipSequence = flipFactory(collection);
            flipSequence.reverse = function () { return collection.flip(); };
            return flipSequence;
          };
        }
        reversedSequence.get = function (key, notSetValue) { return collection.get(useKeys ? key : -1 - key, notSetValue); };
        reversedSequence.has = function (key) { return collection.has(useKeys ? key : -1 - key); };
        reversedSequence.includes = function (value) { return collection.includes(value); };
        reversedSequence.cacheResult = cacheResultThrough;
        reversedSequence.__iterate = function (fn, reverse) {
          var this$1$1 = this;

          var i = 0;
          reverse && ensureSize(collection);
          return collection.__iterate(
            function (v, k) { return fn(v, useKeys ? k : reverse ? this$1$1.size - ++i : i++, this$1$1); },
            !reverse
          );
        };
        reversedSequence.__iterator = function (type, reverse) {
          var i = 0;
          reverse && ensureSize(collection);
          var iterator = collection.__iterator(ITERATE_ENTRIES, !reverse);
          return new Iterator(function () {
            var step = iterator.next();
            if (step.done) {
              return step;
            }
            var entry = step.value;
            return iteratorValue(
              type,
              useKeys ? entry[0] : reverse ? this$1$1.size - ++i : i++,
              entry[1],
              step
            );
          });
        };
        return reversedSequence;
      }

      function filterFactory(collection, predicate, context, useKeys) {
        var filterSequence = makeSequence(collection);
        if (useKeys) {
          filterSequence.has = function (key) {
            var v = collection.get(key, NOT_SET);
            return v !== NOT_SET && !!predicate.call(context, v, key, collection);
          };
          filterSequence.get = function (key, notSetValue) {
            var v = collection.get(key, NOT_SET);
            return v !== NOT_SET && predicate.call(context, v, key, collection)
              ? v
              : notSetValue;
          };
        }
        filterSequence.__iterateUncached = function (fn, reverse) {
          var this$1$1 = this;

          var iterations = 0;
          collection.__iterate(function (v, k, c) {
            if (predicate.call(context, v, k, c)) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$1$1);
            }
          }, reverse);
          return iterations;
        };
        filterSequence.__iteratorUncached = function (type, reverse) {
          var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
          var iterations = 0;
          return new Iterator(function () {
            while (true) {
              var step = iterator.next();
              if (step.done) {
                return step;
              }
              var entry = step.value;
              var key = entry[0];
              var value = entry[1];
              if (predicate.call(context, value, key, collection)) {
                return iteratorValue(type, useKeys ? key : iterations++, value, step);
              }
            }
          });
        };
        return filterSequence;
      }

      function countByFactory(collection, grouper, context) {
        var groups = Map$1().asMutable();
        collection.__iterate(function (v, k) {
          groups.update(grouper.call(context, v, k, collection), 0, function (a) { return a + 1; });
        });
        return groups.asImmutable();
      }

      function groupByFactory(collection, grouper, context) {
        var isKeyedIter = isKeyed(collection);
        var groups = (isOrdered(collection) ? OrderedMap() : Map$1()).asMutable();
        collection.__iterate(function (v, k) {
          groups.update(
            grouper.call(context, v, k, collection),
            function (a) { return ((a = a || []), a.push(isKeyedIter ? [k, v] : v), a); }
          );
        });
        var coerce = collectionClass(collection);
        return groups.map(function (arr) { return reify(collection, coerce(arr)); }).asImmutable();
      }

      function sliceFactory(collection, begin, end, useKeys) {
        var originalSize = collection.size;

        if (wholeSlice(begin, end, originalSize)) {
          return collection;
        }

        var resolvedBegin = resolveBegin(begin, originalSize);
        var resolvedEnd = resolveEnd(end, originalSize);

        // begin or end will be NaN if they were provided as negative numbers and
        // this collection's size is unknown. In that case, cache first so there is
        // a known size and these do not resolve to NaN.
        if (resolvedBegin !== resolvedBegin || resolvedEnd !== resolvedEnd) {
          return sliceFactory(collection.toSeq().cacheResult(), begin, end, useKeys);
        }

        // Note: resolvedEnd is undefined when the original sequence's length is
        // unknown and this slice did not supply an end and should contain all
        // elements after resolvedBegin.
        // In that case, resolvedSize will be NaN and sliceSize will remain undefined.
        var resolvedSize = resolvedEnd - resolvedBegin;
        var sliceSize;
        if (resolvedSize === resolvedSize) {
          sliceSize = resolvedSize < 0 ? 0 : resolvedSize;
        }

        var sliceSeq = makeSequence(collection);

        // If collection.size is undefined, the size of the realized sliceSeq is
        // unknown at this point unless the number of items to slice is 0
        sliceSeq.size =
          sliceSize === 0 ? sliceSize : (collection.size && sliceSize) || undefined;

        if (!useKeys && isSeq(collection) && sliceSize >= 0) {
          sliceSeq.get = function (index, notSetValue) {
            index = wrapIndex(this, index);
            return index >= 0 && index < sliceSize
              ? collection.get(index + resolvedBegin, notSetValue)
              : notSetValue;
          };
        }

        sliceSeq.__iterateUncached = function (fn, reverse) {
          var this$1$1 = this;

          if (sliceSize === 0) {
            return 0;
          }
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var skipped = 0;
          var isSkipping = true;
          var iterations = 0;
          collection.__iterate(function (v, k) {
            if (!(isSkipping && (isSkipping = skipped++ < resolvedBegin))) {
              iterations++;
              return (
                fn(v, useKeys ? k : iterations - 1, this$1$1) !== false &&
                iterations !== sliceSize
              );
            }
          });
          return iterations;
        };

        sliceSeq.__iteratorUncached = function (type, reverse) {
          if (sliceSize !== 0 && reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          // Don't bother instantiating parent iterator if taking 0.
          if (sliceSize === 0) {
            return new Iterator(iteratorDone);
          }
          var iterator = collection.__iterator(type, reverse);
          var skipped = 0;
          var iterations = 0;
          return new Iterator(function () {
            while (skipped++ < resolvedBegin) {
              iterator.next();
            }
            if (++iterations > sliceSize) {
              return iteratorDone();
            }
            var step = iterator.next();
            if (useKeys || type === ITERATE_VALUES || step.done) {
              return step;
            }
            if (type === ITERATE_KEYS) {
              return iteratorValue(type, iterations - 1, undefined, step);
            }
            return iteratorValue(type, iterations - 1, step.value[1], step);
          });
        };

        return sliceSeq;
      }

      function takeWhileFactory(collection, predicate, context) {
        var takeSequence = makeSequence(collection);
        takeSequence.__iterateUncached = function (fn, reverse) {
          var this$1$1 = this;

          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var iterations = 0;
          collection.__iterate(
            function (v, k, c) { return predicate.call(context, v, k, c) && ++iterations && fn(v, k, this$1$1); }
          );
          return iterations;
        };
        takeSequence.__iteratorUncached = function (type, reverse) {
          var this$1$1 = this;

          if (reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
          var iterating = true;
          return new Iterator(function () {
            if (!iterating) {
              return iteratorDone();
            }
            var step = iterator.next();
            if (step.done) {
              return step;
            }
            var entry = step.value;
            var k = entry[0];
            var v = entry[1];
            if (!predicate.call(context, v, k, this$1$1)) {
              iterating = false;
              return iteratorDone();
            }
            return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
          });
        };
        return takeSequence;
      }

      function skipWhileFactory(collection, predicate, context, useKeys) {
        var skipSequence = makeSequence(collection);
        skipSequence.__iterateUncached = function (fn, reverse) {
          var this$1$1 = this;

          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var isSkipping = true;
          var iterations = 0;
          collection.__iterate(function (v, k, c) {
            if (!(isSkipping && (isSkipping = predicate.call(context, v, k, c)))) {
              iterations++;
              return fn(v, useKeys ? k : iterations - 1, this$1$1);
            }
          });
          return iterations;
        };
        skipSequence.__iteratorUncached = function (type, reverse) {
          var this$1$1 = this;

          if (reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          var iterator = collection.__iterator(ITERATE_ENTRIES, reverse);
          var skipping = true;
          var iterations = 0;
          return new Iterator(function () {
            var step;
            var k;
            var v;
            do {
              step = iterator.next();
              if (step.done) {
                if (useKeys || type === ITERATE_VALUES) {
                  return step;
                }
                if (type === ITERATE_KEYS) {
                  return iteratorValue(type, iterations++, undefined, step);
                }
                return iteratorValue(type, iterations++, step.value[1], step);
              }
              var entry = step.value;
              k = entry[0];
              v = entry[1];
              skipping && (skipping = predicate.call(context, v, k, this$1$1));
            } while (skipping);
            return type === ITERATE_ENTRIES ? step : iteratorValue(type, k, v, step);
          });
        };
        return skipSequence;
      }

      function concatFactory(collection, values) {
        var isKeyedCollection = isKeyed(collection);
        var iters = [collection]
          .concat(values)
          .map(function (v) {
            if (!isCollection(v)) {
              v = isKeyedCollection
                ? keyedSeqFromValue(v)
                : indexedSeqFromValue(Array.isArray(v) ? v : [v]);
            } else if (isKeyedCollection) {
              v = KeyedCollection(v);
            }
            return v;
          })
          .filter(function (v) { return v.size !== 0; });

        if (iters.length === 0) {
          return collection;
        }

        if (iters.length === 1) {
          var singleton = iters[0];
          if (
            singleton === collection ||
            (isKeyedCollection && isKeyed(singleton)) ||
            (isIndexed(collection) && isIndexed(singleton))
          ) {
            return singleton;
          }
        }

        var concatSeq = new ArraySeq(iters);
        if (isKeyedCollection) {
          concatSeq = concatSeq.toKeyedSeq();
        } else if (!isIndexed(collection)) {
          concatSeq = concatSeq.toSetSeq();
        }
        concatSeq = concatSeq.flatten(true);
        concatSeq.size = iters.reduce(function (sum, seq) {
          if (sum !== undefined) {
            var size = seq.size;
            if (size !== undefined) {
              return sum + size;
            }
          }
        }, 0);
        return concatSeq;
      }

      function flattenFactory(collection, depth, useKeys) {
        var flatSequence = makeSequence(collection);
        flatSequence.__iterateUncached = function (fn, reverse) {
          if (reverse) {
            return this.cacheResult().__iterate(fn, reverse);
          }
          var iterations = 0;
          var stopped = false;
          function flatDeep(iter, currentDepth) {
            iter.__iterate(function (v, k) {
              if ((!depth || currentDepth < depth) && isCollection(v)) {
                flatDeep(v, currentDepth + 1);
              } else {
                iterations++;
                if (fn(v, useKeys ? k : iterations - 1, flatSequence) === false) {
                  stopped = true;
                }
              }
              return !stopped;
            }, reverse);
          }
          flatDeep(collection, 0);
          return iterations;
        };
        flatSequence.__iteratorUncached = function (type, reverse) {
          if (reverse) {
            return this.cacheResult().__iterator(type, reverse);
          }
          var iterator = collection.__iterator(type, reverse);
          var stack = [];
          var iterations = 0;
          return new Iterator(function () {
            while (iterator) {
              var step = iterator.next();
              if (step.done !== false) {
                iterator = stack.pop();
                continue;
              }
              var v = step.value;
              if (type === ITERATE_ENTRIES) {
                v = v[1];
              }
              if ((!depth || stack.length < depth) && isCollection(v)) {
                stack.push(iterator);
                iterator = v.__iterator(type, reverse);
              } else {
                return useKeys ? step : iteratorValue(type, iterations++, v, step);
              }
            }
            return iteratorDone();
          });
        };
        return flatSequence;
      }

      function flatMapFactory(collection, mapper, context) {
        var coerce = collectionClass(collection);
        return collection
          .toSeq()
          .map(function (v, k) { return coerce(mapper.call(context, v, k, collection)); })
          .flatten(true);
      }

      function interposeFactory(collection, separator) {
        var interposedSequence = makeSequence(collection);
        interposedSequence.size = collection.size && collection.size * 2 - 1;
        interposedSequence.__iterateUncached = function (fn, reverse) {
          var this$1$1 = this;

          var iterations = 0;
          collection.__iterate(
            function (v) { return (!iterations || fn(separator, iterations++, this$1$1) !== false) &&
              fn(v, iterations++, this$1$1) !== false; },
            reverse
          );
          return iterations;
        };
        interposedSequence.__iteratorUncached = function (type, reverse) {
          var iterator = collection.__iterator(ITERATE_VALUES, reverse);
          var iterations = 0;
          var step;
          return new Iterator(function () {
            if (!step || iterations % 2) {
              step = iterator.next();
              if (step.done) {
                return step;
              }
            }
            return iterations % 2
              ? iteratorValue(type, iterations++, separator)
              : iteratorValue(type, iterations++, step.value, step);
          });
        };
        return interposedSequence;
      }

      function sortFactory(collection, comparator, mapper) {
        if (!comparator) {
          comparator = defaultComparator;
        }
        var isKeyedCollection = isKeyed(collection);
        var index = 0;
        var entries = collection
          .toSeq()
          .map(function (v, k) { return [k, v, index++, mapper ? mapper(v, k, collection) : v]; })
          .valueSeq()
          .toArray();
        entries
          .sort(function (a, b) { return comparator(a[3], b[3]) || a[2] - b[2]; })
          .forEach(
            isKeyedCollection
              ? function (v, i) {
                  entries[i].length = 2;
                }
              : function (v, i) {
                  entries[i] = v[1];
                }
          );
        return isKeyedCollection
          ? KeyedSeq(entries)
          : isIndexed(collection)
          ? IndexedSeq(entries)
          : SetSeq(entries);
      }

      function maxFactory(collection, comparator, mapper) {
        if (!comparator) {
          comparator = defaultComparator;
        }
        if (mapper) {
          var entry = collection
            .toSeq()
            .map(function (v, k) { return [v, mapper(v, k, collection)]; })
            .reduce(function (a, b) { return (maxCompare(comparator, a[1], b[1]) ? b : a); });
          return entry && entry[0];
        }
        return collection.reduce(function (a, b) { return (maxCompare(comparator, a, b) ? b : a); });
      }

      function maxCompare(comparator, a, b) {
        var comp = comparator(b, a);
        // b is considered the new max if the comparator declares them equal, but
        // they are not equal and b is in fact a nullish value.
        return (
          (comp === 0 && b !== a && (b === undefined || b === null || b !== b)) ||
          comp > 0
        );
      }

      function zipWithFactory(keyIter, zipper, iters, zipAll) {
        var zipSequence = makeSequence(keyIter);
        var sizes = new ArraySeq(iters).map(function (i) { return i.size; });
        zipSequence.size = zipAll ? sizes.max() : sizes.min();
        // Note: this a generic base implementation of __iterate in terms of
        // __iterator which may be more generically useful in the future.
        zipSequence.__iterate = function (fn, reverse) {
          /* generic:
          var iterator = this.__iterator(ITERATE_ENTRIES, reverse);
          var step;
          var iterations = 0;
          while (!(step = iterator.next()).done) {
            iterations++;
            if (fn(step.value[1], step.value[0], this) === false) {
              break;
            }
          }
          return iterations;
          */
          // indexed:
          var iterator = this.__iterator(ITERATE_VALUES, reverse);
          var step;
          var iterations = 0;
          while (!(step = iterator.next()).done) {
            if (fn(step.value, iterations++, this) === false) {
              break;
            }
          }
          return iterations;
        };
        zipSequence.__iteratorUncached = function (type, reverse) {
          var iterators = iters.map(
            function (i) { return ((i = Collection(i)), getIterator(reverse ? i.reverse() : i)); }
          );
          var iterations = 0;
          var isDone = false;
          return new Iterator(function () {
            var steps;
            if (!isDone) {
              steps = iterators.map(function (i) { return i.next(); });
              isDone = zipAll ? steps.every(function (s) { return s.done; }) : steps.some(function (s) { return s.done; });
            }
            if (isDone) {
              return iteratorDone();
            }
            return iteratorValue(
              type,
              iterations++,
              zipper.apply(
                null,
                steps.map(function (s) { return s.value; })
              )
            );
          });
        };
        return zipSequence;
      }

      // #pragma Helper Functions

      function reify(iter, seq) {
        return iter === seq ? iter : isSeq(iter) ? seq : iter.constructor(seq);
      }

      function validateEntry(entry) {
        if (entry !== Object(entry)) {
          throw new TypeError('Expected [K, V] tuple: ' + entry);
        }
      }

      function collectionClass(collection) {
        return isKeyed(collection)
          ? KeyedCollection
          : isIndexed(collection)
          ? IndexedCollection
          : SetCollection;
      }

      function makeSequence(collection) {
        return Object.create(
          (isKeyed(collection)
            ? KeyedSeq
            : isIndexed(collection)
            ? IndexedSeq
            : SetSeq
          ).prototype
        );
      }

      function cacheResultThrough() {
        if (this._iter.cacheResult) {
          this._iter.cacheResult();
          this.size = this._iter.size;
          return this;
        }
        return Seq.prototype.cacheResult.call(this);
      }

      function defaultComparator(a, b) {
        if (a === undefined && b === undefined) {
          return 0;
        }

        if (a === undefined) {
          return 1;
        }

        if (b === undefined) {
          return -1;
        }

        return a > b ? 1 : a < b ? -1 : 0;
      }

      function arrCopy(arr, offset) {
        offset = offset || 0;
        var len = Math.max(0, arr.length - offset);
        var newArr = new Array(len);
        for (var ii = 0; ii < len; ii++) {
          newArr[ii] = arr[ii + offset];
        }
        return newArr;
      }

      function invariant(condition, error) {
        if (!condition) { throw new Error(error); }
      }

      function assertNotInfinite(size) {
        invariant(
          size !== Infinity,
          'Cannot perform this action with an infinite size.'
        );
      }

      function coerceKeyPath(keyPath) {
        if (isArrayLike(keyPath) && typeof keyPath !== 'string') {
          return keyPath;
        }
        if (isOrdered(keyPath)) {
          return keyPath.toArray();
        }
        throw new TypeError(
          'Invalid keyPath: expected Ordered Collection or Array: ' + keyPath
        );
      }

      var toString = Object.prototype.toString;

      function isPlainObject(value) {
        // The base prototype's toString deals with Argument objects and native namespaces like Math
        if (
          !value ||
          typeof value !== 'object' ||
          toString.call(value) !== '[object Object]'
        ) {
          return false;
        }

        var proto = Object.getPrototypeOf(value);
        if (proto === null) {
          return true;
        }

        // Iteratively going up the prototype chain is needed for cross-realm environments (differing contexts, iframes, etc)
        var parentProto = proto;
        var nextProto = Object.getPrototypeOf(proto);
        while (nextProto !== null) {
          parentProto = nextProto;
          nextProto = Object.getPrototypeOf(parentProto);
        }
        return parentProto === proto;
      }

      /**
       * Returns true if the value is a potentially-persistent data structure, either
       * provided by Immutable.js or a plain Array or Object.
       */
      function isDataStructure(value) {
        return (
          typeof value === 'object' &&
          (isImmutable(value) || Array.isArray(value) || isPlainObject(value))
        );
      }

      function quoteString(value) {
        try {
          return typeof value === 'string' ? JSON.stringify(value) : String(value);
        } catch (_ignoreError) {
          return JSON.stringify(value);
        }
      }

      function has(collection, key) {
        return isImmutable(collection)
          ? collection.has(key)
          : isDataStructure(collection) && hasOwnProperty.call(collection, key);
      }

      function get(collection, key, notSetValue) {
        return isImmutable(collection)
          ? collection.get(key, notSetValue)
          : !has(collection, key)
          ? notSetValue
          : typeof collection.get === 'function'
          ? collection.get(key)
          : collection[key];
      }

      function shallowCopy(from) {
        if (Array.isArray(from)) {
          return arrCopy(from);
        }
        var to = {};
        for (var key in from) {
          if (hasOwnProperty.call(from, key)) {
            to[key] = from[key];
          }
        }
        return to;
      }

      function remove(collection, key) {
        if (!isDataStructure(collection)) {
          throw new TypeError(
            'Cannot update non-data-structure value: ' + collection
          );
        }
        if (isImmutable(collection)) {
          if (!collection.remove) {
            throw new TypeError(
              'Cannot update immutable value without .remove() method: ' + collection
            );
          }
          return collection.remove(key);
        }
        if (!hasOwnProperty.call(collection, key)) {
          return collection;
        }
        var collectionCopy = shallowCopy(collection);
        if (Array.isArray(collectionCopy)) {
          collectionCopy.splice(key, 1);
        } else {
          delete collectionCopy[key];
        }
        return collectionCopy;
      }

      function set(collection, key, value) {
        if (!isDataStructure(collection)) {
          throw new TypeError(
            'Cannot update non-data-structure value: ' + collection
          );
        }
        if (isImmutable(collection)) {
          if (!collection.set) {
            throw new TypeError(
              'Cannot update immutable value without .set() method: ' + collection
            );
          }
          return collection.set(key, value);
        }
        if (hasOwnProperty.call(collection, key) && value === collection[key]) {
          return collection;
        }
        var collectionCopy = shallowCopy(collection);
        collectionCopy[key] = value;
        return collectionCopy;
      }

      function updateIn$1(collection, keyPath, notSetValue, updater) {
        if (!updater) {
          updater = notSetValue;
          notSetValue = undefined;
        }
        var updatedValue = updateInDeeply(
          isImmutable(collection),
          collection,
          coerceKeyPath(keyPath),
          0,
          notSetValue,
          updater
        );
        return updatedValue === NOT_SET ? notSetValue : updatedValue;
      }

      function updateInDeeply(
        inImmutable,
        existing,
        keyPath,
        i,
        notSetValue,
        updater
      ) {
        var wasNotSet = existing === NOT_SET;
        if (i === keyPath.length) {
          var existingValue = wasNotSet ? notSetValue : existing;
          var newValue = updater(existingValue);
          return newValue === existingValue ? existing : newValue;
        }
        if (!wasNotSet && !isDataStructure(existing)) {
          throw new TypeError(
            'Cannot update within non-data-structure value in path [' +
              keyPath.slice(0, i).map(quoteString) +
              ']: ' +
              existing
          );
        }
        var key = keyPath[i];
        var nextExisting = wasNotSet ? NOT_SET : get(existing, key, NOT_SET);
        var nextUpdated = updateInDeeply(
          nextExisting === NOT_SET ? inImmutable : isImmutable(nextExisting),
          nextExisting,
          keyPath,
          i + 1,
          notSetValue,
          updater
        );
        return nextUpdated === nextExisting
          ? existing
          : nextUpdated === NOT_SET
          ? remove(existing, key)
          : set(
              wasNotSet ? (inImmutable ? emptyMap() : {}) : existing,
              key,
              nextUpdated
            );
      }

      function setIn$1(collection, keyPath, value) {
        return updateIn$1(collection, keyPath, NOT_SET, function () { return value; });
      }

      function setIn(keyPath, v) {
        return setIn$1(this, keyPath, v);
      }

      function removeIn(collection, keyPath) {
        return updateIn$1(collection, keyPath, function () { return NOT_SET; });
      }

      function deleteIn(keyPath) {
        return removeIn(this, keyPath);
      }

      function update$1(collection, key, notSetValue, updater) {
        return updateIn$1(collection, [key], notSetValue, updater);
      }

      function update(key, notSetValue, updater) {
        return arguments.length === 1
          ? key(this)
          : update$1(this, key, notSetValue, updater);
      }

      function updateIn(keyPath, notSetValue, updater) {
        return updateIn$1(this, keyPath, notSetValue, updater);
      }

      function merge$1() {
        var iters = [], len = arguments.length;
        while ( len-- ) iters[ len ] = arguments[ len ];

        return mergeIntoKeyedWith(this, iters);
      }

      function mergeWith$1(merger) {
        var iters = [], len = arguments.length - 1;
        while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

        if (typeof merger !== 'function') {
          throw new TypeError('Invalid merger function: ' + merger);
        }
        return mergeIntoKeyedWith(this, iters, merger);
      }

      function mergeIntoKeyedWith(collection, collections, merger) {
        var iters = [];
        for (var ii = 0; ii < collections.length; ii++) {
          var collection$1 = KeyedCollection(collections[ii]);
          if (collection$1.size !== 0) {
            iters.push(collection$1);
          }
        }
        if (iters.length === 0) {
          return collection;
        }
        if (
          collection.toSeq().size === 0 &&
          !collection.__ownerID &&
          iters.length === 1
        ) {
          return collection.constructor(iters[0]);
        }
        return collection.withMutations(function (collection) {
          var mergeIntoCollection = merger
            ? function (value, key) {
                update$1(collection, key, NOT_SET, function (oldVal) { return oldVal === NOT_SET ? value : merger(oldVal, value, key); }
                );
              }
            : function (value, key) {
                collection.set(key, value);
              };
          for (var ii = 0; ii < iters.length; ii++) {
            iters[ii].forEach(mergeIntoCollection);
          }
        });
      }

      function mergeDeepWithSources(collection, sources, merger) {
        return mergeWithSources(collection, sources, deepMergerWith(merger));
      }

      function mergeWithSources(collection, sources, merger) {
        if (!isDataStructure(collection)) {
          throw new TypeError(
            'Cannot merge into non-data-structure value: ' + collection
          );
        }
        if (isImmutable(collection)) {
          return typeof merger === 'function' && collection.mergeWith
            ? collection.mergeWith.apply(collection, [ merger ].concat( sources ))
            : collection.merge
            ? collection.merge.apply(collection, sources)
            : collection.concat.apply(collection, sources);
        }
        var isArray = Array.isArray(collection);
        var merged = collection;
        var Collection = isArray ? IndexedCollection : KeyedCollection;
        var mergeItem = isArray
          ? function (value) {
              // Copy on write
              if (merged === collection) {
                merged = shallowCopy(merged);
              }
              merged.push(value);
            }
          : function (value, key) {
              var hasVal = hasOwnProperty.call(merged, key);
              var nextVal =
                hasVal && merger ? merger(merged[key], value, key) : value;
              if (!hasVal || nextVal !== merged[key]) {
                // Copy on write
                if (merged === collection) {
                  merged = shallowCopy(merged);
                }
                merged[key] = nextVal;
              }
            };
        for (var i = 0; i < sources.length; i++) {
          Collection(sources[i]).forEach(mergeItem);
        }
        return merged;
      }

      function deepMergerWith(merger) {
        function deepMerger(oldValue, newValue, key) {
          return isDataStructure(oldValue) &&
            isDataStructure(newValue) &&
            areMergeable(oldValue, newValue)
            ? mergeWithSources(oldValue, [newValue], deepMerger)
            : merger
            ? merger(oldValue, newValue, key)
            : newValue;
        }
        return deepMerger;
      }

      /**
       * It's unclear what the desired behavior is for merging two collections that
       * fall into separate categories between keyed, indexed, or set-like, so we only
       * consider them mergeable if they fall into the same category.
       */
      function areMergeable(oldDataStructure, newDataStructure) {
        var oldSeq = Seq(oldDataStructure);
        var newSeq = Seq(newDataStructure);
        // This logic assumes that a sequence can only fall into one of the three
        // categories mentioned above (since there's no `isSetLike()` method).
        return (
          isIndexed(oldSeq) === isIndexed(newSeq) &&
          isKeyed(oldSeq) === isKeyed(newSeq)
        );
      }

      function mergeDeep() {
        var iters = [], len = arguments.length;
        while ( len-- ) iters[ len ] = arguments[ len ];

        return mergeDeepWithSources(this, iters);
      }

      function mergeDeepWith(merger) {
        var iters = [], len = arguments.length - 1;
        while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

        return mergeDeepWithSources(this, iters, merger);
      }

      function mergeIn(keyPath) {
        var iters = [], len = arguments.length - 1;
        while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

        return updateIn$1(this, keyPath, emptyMap(), function (m) { return mergeWithSources(m, iters); });
      }

      function mergeDeepIn(keyPath) {
        var iters = [], len = arguments.length - 1;
        while ( len-- > 0 ) iters[ len ] = arguments[ len + 1 ];

        return updateIn$1(this, keyPath, emptyMap(), function (m) { return mergeDeepWithSources(m, iters); }
        );
      }

      function withMutations(fn) {
        var mutable = this.asMutable();
        fn(mutable);
        return mutable.wasAltered() ? mutable.__ensureOwner(this.__ownerID) : this;
      }

      function asMutable() {
        return this.__ownerID ? this : this.__ensureOwner(new OwnerID());
      }

      function asImmutable() {
        return this.__ensureOwner();
      }

      function wasAltered() {
        return this.__altered;
      }

      var Map$1 = /*@__PURE__*/(function (KeyedCollection) {
        function Map(value) {
          return value === null || value === undefined
            ? emptyMap()
            : isMap(value) && !isOrdered(value)
            ? value
            : emptyMap().withMutations(function (map) {
                var iter = KeyedCollection(value);
                assertNotInfinite(iter.size);
                iter.forEach(function (v, k) { return map.set(k, v); });
              });
        }

        if ( KeyedCollection ) Map.__proto__ = KeyedCollection;
        Map.prototype = Object.create( KeyedCollection && KeyedCollection.prototype );
        Map.prototype.constructor = Map;

        Map.of = function of () {
          var keyValues = [], len = arguments.length;
          while ( len-- ) keyValues[ len ] = arguments[ len ];

          return emptyMap().withMutations(function (map) {
            for (var i = 0; i < keyValues.length; i += 2) {
              if (i + 1 >= keyValues.length) {
                throw new Error('Missing value for key: ' + keyValues[i]);
              }
              map.set(keyValues[i], keyValues[i + 1]);
            }
          });
        };

        Map.prototype.toString = function toString () {
          return this.__toString('Map {', '}');
        };

        // @pragma Access

        Map.prototype.get = function get (k, notSetValue) {
          return this._root
            ? this._root.get(0, undefined, k, notSetValue)
            : notSetValue;
        };

        // @pragma Modification

        Map.prototype.set = function set (k, v) {
          return updateMap(this, k, v);
        };

        Map.prototype.remove = function remove (k) {
          return updateMap(this, k, NOT_SET);
        };

        Map.prototype.deleteAll = function deleteAll (keys) {
          var collection = Collection(keys);

          if (collection.size === 0) {
            return this;
          }

          return this.withMutations(function (map) {
            collection.forEach(function (key) { return map.remove(key); });
          });
        };

        Map.prototype.clear = function clear () {
          if (this.size === 0) {
            return this;
          }
          if (this.__ownerID) {
            this.size = 0;
            this._root = null;
            this.__hash = undefined;
            this.__altered = true;
            return this;
          }
          return emptyMap();
        };

        // @pragma Composition

        Map.prototype.sort = function sort (comparator) {
          // Late binding
          return OrderedMap(sortFactory(this, comparator));
        };

        Map.prototype.sortBy = function sortBy (mapper, comparator) {
          // Late binding
          return OrderedMap(sortFactory(this, comparator, mapper));
        };

        Map.prototype.map = function map (mapper, context) {
          var this$1$1 = this;

          return this.withMutations(function (map) {
            map.forEach(function (value, key) {
              map.set(key, mapper.call(context, value, key, this$1$1));
            });
          });
        };

        // @pragma Mutability

        Map.prototype.__iterator = function __iterator (type, reverse) {
          return new MapIterator(this, type, reverse);
        };

        Map.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          var iterations = 0;
          this._root &&
            this._root.iterate(function (entry) {
              iterations++;
              return fn(entry[1], entry[0], this$1$1);
            }, reverse);
          return iterations;
        };

        Map.prototype.__ensureOwner = function __ensureOwner (ownerID) {
          if (ownerID === this.__ownerID) {
            return this;
          }
          if (!ownerID) {
            if (this.size === 0) {
              return emptyMap();
            }
            this.__ownerID = ownerID;
            this.__altered = false;
            return this;
          }
          return makeMap(this.size, this._root, ownerID, this.__hash);
        };

        return Map;
      }(KeyedCollection));

      Map$1.isMap = isMap;

      var MapPrototype = Map$1.prototype;
      MapPrototype[IS_MAP_SYMBOL] = true;
      MapPrototype[DELETE] = MapPrototype.remove;
      MapPrototype.removeAll = MapPrototype.deleteAll;
      MapPrototype.setIn = setIn;
      MapPrototype.removeIn = MapPrototype.deleteIn = deleteIn;
      MapPrototype.update = update;
      MapPrototype.updateIn = updateIn;
      MapPrototype.merge = MapPrototype.concat = merge$1;
      MapPrototype.mergeWith = mergeWith$1;
      MapPrototype.mergeDeep = mergeDeep;
      MapPrototype.mergeDeepWith = mergeDeepWith;
      MapPrototype.mergeIn = mergeIn;
      MapPrototype.mergeDeepIn = mergeDeepIn;
      MapPrototype.withMutations = withMutations;
      MapPrototype.wasAltered = wasAltered;
      MapPrototype.asImmutable = asImmutable;
      MapPrototype['@@transducer/init'] = MapPrototype.asMutable = asMutable;
      MapPrototype['@@transducer/step'] = function (result, arr) {
        return result.set(arr[0], arr[1]);
      };
      MapPrototype['@@transducer/result'] = function (obj) {
        return obj.asImmutable();
      };

      // #pragma Trie Nodes

      var ArrayMapNode = function ArrayMapNode(ownerID, entries) {
        this.ownerID = ownerID;
        this.entries = entries;
      };

      ArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
        var entries = this.entries;
        for (var ii = 0, len = entries.length; ii < len; ii++) {
          if (is(key, entries[ii][0])) {
            return entries[ii][1];
          }
        }
        return notSetValue;
      };

      ArrayMapNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        var removed = value === NOT_SET;

        var entries = this.entries;
        var idx = 0;
        var len = entries.length;
        for (; idx < len; idx++) {
          if (is(key, entries[idx][0])) {
            break;
          }
        }
        var exists = idx < len;

        if (exists ? entries[idx][1] === value : removed) {
          return this;
        }

        SetRef(didAlter);
        (removed || !exists) && SetRef(didChangeSize);

        if (removed && entries.length === 1) {
          return; // undefined
        }

        if (!exists && !removed && entries.length >= MAX_ARRAY_MAP_SIZE) {
          return createNodes(ownerID, entries, key, value);
        }

        var isEditable = ownerID && ownerID === this.ownerID;
        var newEntries = isEditable ? entries : arrCopy(entries);

        if (exists) {
          if (removed) {
            idx === len - 1
              ? newEntries.pop()
              : (newEntries[idx] = newEntries.pop());
          } else {
            newEntries[idx] = [key, value];
          }
        } else {
          newEntries.push([key, value]);
        }

        if (isEditable) {
          this.entries = newEntries;
          return this;
        }

        return new ArrayMapNode(ownerID, newEntries);
      };

      var BitmapIndexedNode = function BitmapIndexedNode(ownerID, bitmap, nodes) {
        this.ownerID = ownerID;
        this.bitmap = bitmap;
        this.nodes = nodes;
      };

      BitmapIndexedNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
        if (keyHash === undefined) {
          keyHash = hash(key);
        }
        var bit = 1 << ((shift === 0 ? keyHash : keyHash >>> shift) & MASK);
        var bitmap = this.bitmap;
        return (bitmap & bit) === 0
          ? notSetValue
          : this.nodes[popCount(bitmap & (bit - 1))].get(
              shift + SHIFT,
              keyHash,
              key,
              notSetValue
            );
      };

      BitmapIndexedNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === undefined) {
          keyHash = hash(key);
        }
        var keyHashFrag = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var bit = 1 << keyHashFrag;
        var bitmap = this.bitmap;
        var exists = (bitmap & bit) !== 0;

        if (!exists && value === NOT_SET) {
          return this;
        }

        var idx = popCount(bitmap & (bit - 1));
        var nodes = this.nodes;
        var node = exists ? nodes[idx] : undefined;
        var newNode = updateNode(
          node,
          ownerID,
          shift + SHIFT,
          keyHash,
          key,
          value,
          didChangeSize,
          didAlter
        );

        if (newNode === node) {
          return this;
        }

        if (!exists && newNode && nodes.length >= MAX_BITMAP_INDEXED_SIZE) {
          return expandNodes(ownerID, nodes, bitmap, keyHashFrag, newNode);
        }

        if (
          exists &&
          !newNode &&
          nodes.length === 2 &&
          isLeafNode(nodes[idx ^ 1])
        ) {
          return nodes[idx ^ 1];
        }

        if (exists && newNode && nodes.length === 1 && isLeafNode(newNode)) {
          return newNode;
        }

        var isEditable = ownerID && ownerID === this.ownerID;
        var newBitmap = exists ? (newNode ? bitmap : bitmap ^ bit) : bitmap | bit;
        var newNodes = exists
          ? newNode
            ? setAt(nodes, idx, newNode, isEditable)
            : spliceOut(nodes, idx, isEditable)
          : spliceIn(nodes, idx, newNode, isEditable);

        if (isEditable) {
          this.bitmap = newBitmap;
          this.nodes = newNodes;
          return this;
        }

        return new BitmapIndexedNode(ownerID, newBitmap, newNodes);
      };

      var HashArrayMapNode = function HashArrayMapNode(ownerID, count, nodes) {
        this.ownerID = ownerID;
        this.count = count;
        this.nodes = nodes;
      };

      HashArrayMapNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
        if (keyHash === undefined) {
          keyHash = hash(key);
        }
        var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var node = this.nodes[idx];
        return node
          ? node.get(shift + SHIFT, keyHash, key, notSetValue)
          : notSetValue;
      };

      HashArrayMapNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === undefined) {
          keyHash = hash(key);
        }
        var idx = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;
        var removed = value === NOT_SET;
        var nodes = this.nodes;
        var node = nodes[idx];

        if (removed && !node) {
          return this;
        }

        var newNode = updateNode(
          node,
          ownerID,
          shift + SHIFT,
          keyHash,
          key,
          value,
          didChangeSize,
          didAlter
        );
        if (newNode === node) {
          return this;
        }

        var newCount = this.count;
        if (!node) {
          newCount++;
        } else if (!newNode) {
          newCount--;
          if (newCount < MIN_HASH_ARRAY_MAP_SIZE) {
            return packNodes(ownerID, nodes, newCount, idx);
          }
        }

        var isEditable = ownerID && ownerID === this.ownerID;
        var newNodes = setAt(nodes, idx, newNode, isEditable);

        if (isEditable) {
          this.count = newCount;
          this.nodes = newNodes;
          return this;
        }

        return new HashArrayMapNode(ownerID, newCount, newNodes);
      };

      var HashCollisionNode = function HashCollisionNode(ownerID, keyHash, entries) {
        this.ownerID = ownerID;
        this.keyHash = keyHash;
        this.entries = entries;
      };

      HashCollisionNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
        var entries = this.entries;
        for (var ii = 0, len = entries.length; ii < len; ii++) {
          if (is(key, entries[ii][0])) {
            return entries[ii][1];
          }
        }
        return notSetValue;
      };

      HashCollisionNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        if (keyHash === undefined) {
          keyHash = hash(key);
        }

        var removed = value === NOT_SET;

        if (keyHash !== this.keyHash) {
          if (removed) {
            return this;
          }
          SetRef(didAlter);
          SetRef(didChangeSize);
          return mergeIntoNode(this, ownerID, shift, keyHash, [key, value]);
        }

        var entries = this.entries;
        var idx = 0;
        var len = entries.length;
        for (; idx < len; idx++) {
          if (is(key, entries[idx][0])) {
            break;
          }
        }
        var exists = idx < len;

        if (exists ? entries[idx][1] === value : removed) {
          return this;
        }

        SetRef(didAlter);
        (removed || !exists) && SetRef(didChangeSize);

        if (removed && len === 2) {
          return new ValueNode(ownerID, this.keyHash, entries[idx ^ 1]);
        }

        var isEditable = ownerID && ownerID === this.ownerID;
        var newEntries = isEditable ? entries : arrCopy(entries);

        if (exists) {
          if (removed) {
            idx === len - 1
              ? newEntries.pop()
              : (newEntries[idx] = newEntries.pop());
          } else {
            newEntries[idx] = [key, value];
          }
        } else {
          newEntries.push([key, value]);
        }

        if (isEditable) {
          this.entries = newEntries;
          return this;
        }

        return new HashCollisionNode(ownerID, this.keyHash, newEntries);
      };

      var ValueNode = function ValueNode(ownerID, keyHash, entry) {
        this.ownerID = ownerID;
        this.keyHash = keyHash;
        this.entry = entry;
      };

      ValueNode.prototype.get = function get (shift, keyHash, key, notSetValue) {
        return is(key, this.entry[0]) ? this.entry[1] : notSetValue;
      };

      ValueNode.prototype.update = function update (ownerID, shift, keyHash, key, value, didChangeSize, didAlter) {
        var removed = value === NOT_SET;
        var keyMatch = is(key, this.entry[0]);
        if (keyMatch ? value === this.entry[1] : removed) {
          return this;
        }

        SetRef(didAlter);

        if (removed) {
          SetRef(didChangeSize);
          return; // undefined
        }

        if (keyMatch) {
          if (ownerID && ownerID === this.ownerID) {
            this.entry[1] = value;
            return this;
          }
          return new ValueNode(ownerID, this.keyHash, [key, value]);
        }

        SetRef(didChangeSize);
        return mergeIntoNode(this, ownerID, shift, hash(key), [key, value]);
      };

      // #pragma Iterators

      ArrayMapNode.prototype.iterate = HashCollisionNode.prototype.iterate =
        function (fn, reverse) {
          var entries = this.entries;
          for (var ii = 0, maxIndex = entries.length - 1; ii <= maxIndex; ii++) {
            if (fn(entries[reverse ? maxIndex - ii : ii]) === false) {
              return false;
            }
          }
        };

      BitmapIndexedNode.prototype.iterate = HashArrayMapNode.prototype.iterate =
        function (fn, reverse) {
          var nodes = this.nodes;
          for (var ii = 0, maxIndex = nodes.length - 1; ii <= maxIndex; ii++) {
            var node = nodes[reverse ? maxIndex - ii : ii];
            if (node && node.iterate(fn, reverse) === false) {
              return false;
            }
          }
        };

      // eslint-disable-next-line no-unused-vars
      ValueNode.prototype.iterate = function (fn, reverse) {
        return fn(this.entry);
      };

      var MapIterator = /*@__PURE__*/(function (Iterator) {
        function MapIterator(map, type, reverse) {
          this._type = type;
          this._reverse = reverse;
          this._stack = map._root && mapIteratorFrame(map._root);
        }

        if ( Iterator ) MapIterator.__proto__ = Iterator;
        MapIterator.prototype = Object.create( Iterator && Iterator.prototype );
        MapIterator.prototype.constructor = MapIterator;

        MapIterator.prototype.next = function next () {
          var type = this._type;
          var stack = this._stack;
          while (stack) {
            var node = stack.node;
            var index = stack.index++;
            var maxIndex = (void 0);
            if (node.entry) {
              if (index === 0) {
                return mapIteratorValue(type, node.entry);
              }
            } else if (node.entries) {
              maxIndex = node.entries.length - 1;
              if (index <= maxIndex) {
                return mapIteratorValue(
                  type,
                  node.entries[this._reverse ? maxIndex - index : index]
                );
              }
            } else {
              maxIndex = node.nodes.length - 1;
              if (index <= maxIndex) {
                var subNode = node.nodes[this._reverse ? maxIndex - index : index];
                if (subNode) {
                  if (subNode.entry) {
                    return mapIteratorValue(type, subNode.entry);
                  }
                  stack = this._stack = mapIteratorFrame(subNode, stack);
                }
                continue;
              }
            }
            stack = this._stack = this._stack.__prev;
          }
          return iteratorDone();
        };

        return MapIterator;
      }(Iterator));

      function mapIteratorValue(type, entry) {
        return iteratorValue(type, entry[0], entry[1]);
      }

      function mapIteratorFrame(node, prev) {
        return {
          node: node,
          index: 0,
          __prev: prev,
        };
      }

      function makeMap(size, root, ownerID, hash) {
        var map = Object.create(MapPrototype);
        map.size = size;
        map._root = root;
        map.__ownerID = ownerID;
        map.__hash = hash;
        map.__altered = false;
        return map;
      }

      var EMPTY_MAP;
      function emptyMap() {
        return EMPTY_MAP || (EMPTY_MAP = makeMap(0));
      }

      function updateMap(map, k, v) {
        var newRoot;
        var newSize;
        if (!map._root) {
          if (v === NOT_SET) {
            return map;
          }
          newSize = 1;
          newRoot = new ArrayMapNode(map.__ownerID, [[k, v]]);
        } else {
          var didChangeSize = MakeRef();
          var didAlter = MakeRef();
          newRoot = updateNode(
            map._root,
            map.__ownerID,
            0,
            undefined,
            k,
            v,
            didChangeSize,
            didAlter
          );
          if (!didAlter.value) {
            return map;
          }
          newSize = map.size + (didChangeSize.value ? (v === NOT_SET ? -1 : 1) : 0);
        }
        if (map.__ownerID) {
          map.size = newSize;
          map._root = newRoot;
          map.__hash = undefined;
          map.__altered = true;
          return map;
        }
        return newRoot ? makeMap(newSize, newRoot) : emptyMap();
      }

      function updateNode(
        node,
        ownerID,
        shift,
        keyHash,
        key,
        value,
        didChangeSize,
        didAlter
      ) {
        if (!node) {
          if (value === NOT_SET) {
            return node;
          }
          SetRef(didAlter);
          SetRef(didChangeSize);
          return new ValueNode(ownerID, keyHash, [key, value]);
        }
        return node.update(
          ownerID,
          shift,
          keyHash,
          key,
          value,
          didChangeSize,
          didAlter
        );
      }

      function isLeafNode(node) {
        return (
          node.constructor === ValueNode || node.constructor === HashCollisionNode
        );
      }

      function mergeIntoNode(node, ownerID, shift, keyHash, entry) {
        if (node.keyHash === keyHash) {
          return new HashCollisionNode(ownerID, keyHash, [node.entry, entry]);
        }

        var idx1 = (shift === 0 ? node.keyHash : node.keyHash >>> shift) & MASK;
        var idx2 = (shift === 0 ? keyHash : keyHash >>> shift) & MASK;

        var newNode;
        var nodes =
          idx1 === idx2
            ? [mergeIntoNode(node, ownerID, shift + SHIFT, keyHash, entry)]
            : ((newNode = new ValueNode(ownerID, keyHash, entry)),
              idx1 < idx2 ? [node, newNode] : [newNode, node]);

        return new BitmapIndexedNode(ownerID, (1 << idx1) | (1 << idx2), nodes);
      }

      function createNodes(ownerID, entries, key, value) {
        if (!ownerID) {
          ownerID = new OwnerID();
        }
        var node = new ValueNode(ownerID, hash(key), [key, value]);
        for (var ii = 0; ii < entries.length; ii++) {
          var entry = entries[ii];
          node = node.update(ownerID, 0, undefined, entry[0], entry[1]);
        }
        return node;
      }

      function packNodes(ownerID, nodes, count, excluding) {
        var bitmap = 0;
        var packedII = 0;
        var packedNodes = new Array(count);
        for (var ii = 0, bit = 1, len = nodes.length; ii < len; ii++, bit <<= 1) {
          var node = nodes[ii];
          if (node !== undefined && ii !== excluding) {
            bitmap |= bit;
            packedNodes[packedII++] = node;
          }
        }
        return new BitmapIndexedNode(ownerID, bitmap, packedNodes);
      }

      function expandNodes(ownerID, nodes, bitmap, including, node) {
        var count = 0;
        var expandedNodes = new Array(SIZE);
        for (var ii = 0; bitmap !== 0; ii++, bitmap >>>= 1) {
          expandedNodes[ii] = bitmap & 1 ? nodes[count++] : undefined;
        }
        expandedNodes[including] = node;
        return new HashArrayMapNode(ownerID, count + 1, expandedNodes);
      }

      function popCount(x) {
        x -= (x >> 1) & 0x55555555;
        x = (x & 0x33333333) + ((x >> 2) & 0x33333333);
        x = (x + (x >> 4)) & 0x0f0f0f0f;
        x += x >> 8;
        x += x >> 16;
        return x & 0x7f;
      }

      function setAt(array, idx, val, canEdit) {
        var newArray = canEdit ? array : arrCopy(array);
        newArray[idx] = val;
        return newArray;
      }

      function spliceIn(array, idx, val, canEdit) {
        var newLen = array.length + 1;
        if (canEdit && idx + 1 === newLen) {
          array[idx] = val;
          return array;
        }
        var newArray = new Array(newLen);
        var after = 0;
        for (var ii = 0; ii < newLen; ii++) {
          if (ii === idx) {
            newArray[ii] = val;
            after = -1;
          } else {
            newArray[ii] = array[ii + after];
          }
        }
        return newArray;
      }

      function spliceOut(array, idx, canEdit) {
        var newLen = array.length - 1;
        if (canEdit && idx === newLen) {
          array.pop();
          return array;
        }
        var newArray = new Array(newLen);
        var after = 0;
        for (var ii = 0; ii < newLen; ii++) {
          if (ii === idx) {
            after = 1;
          }
          newArray[ii] = array[ii + after];
        }
        return newArray;
      }

      var MAX_ARRAY_MAP_SIZE = SIZE / 4;
      var MAX_BITMAP_INDEXED_SIZE = SIZE / 2;
      var MIN_HASH_ARRAY_MAP_SIZE = SIZE / 4;

      var IS_LIST_SYMBOL = '@@__IMMUTABLE_LIST__@@';

      function isList(maybeList) {
        return Boolean(maybeList && maybeList[IS_LIST_SYMBOL]);
      }

      var List = /*@__PURE__*/(function (IndexedCollection) {
        function List(value) {
          var empty = emptyList();
          if (value === null || value === undefined) {
            return empty;
          }
          if (isList(value)) {
            return value;
          }
          var iter = IndexedCollection(value);
          var size = iter.size;
          if (size === 0) {
            return empty;
          }
          assertNotInfinite(size);
          if (size > 0 && size < SIZE) {
            return makeList(0, size, SHIFT, null, new VNode(iter.toArray()));
          }
          return empty.withMutations(function (list) {
            list.setSize(size);
            iter.forEach(function (v, i) { return list.set(i, v); });
          });
        }

        if ( IndexedCollection ) List.__proto__ = IndexedCollection;
        List.prototype = Object.create( IndexedCollection && IndexedCollection.prototype );
        List.prototype.constructor = List;

        List.of = function of (/*...values*/) {
          return this(arguments);
        };

        List.prototype.toString = function toString () {
          return this.__toString('List [', ']');
        };

        // @pragma Access

        List.prototype.get = function get (index, notSetValue) {
          index = wrapIndex(this, index);
          if (index >= 0 && index < this.size) {
            index += this._origin;
            var node = listNodeFor(this, index);
            return node && node.array[index & MASK];
          }
          return notSetValue;
        };

        // @pragma Modification

        List.prototype.set = function set (index, value) {
          return updateList(this, index, value);
        };

        List.prototype.remove = function remove (index) {
          return !this.has(index)
            ? this
            : index === 0
            ? this.shift()
            : index === this.size - 1
            ? this.pop()
            : this.splice(index, 1);
        };

        List.prototype.insert = function insert (index, value) {
          return this.splice(index, 0, value);
        };

        List.prototype.clear = function clear () {
          if (this.size === 0) {
            return this;
          }
          if (this.__ownerID) {
            this.size = this._origin = this._capacity = 0;
            this._level = SHIFT;
            this._root = this._tail = this.__hash = undefined;
            this.__altered = true;
            return this;
          }
          return emptyList();
        };

        List.prototype.push = function push (/*...values*/) {
          var values = arguments;
          var oldSize = this.size;
          return this.withMutations(function (list) {
            setListBounds(list, 0, oldSize + values.length);
            for (var ii = 0; ii < values.length; ii++) {
              list.set(oldSize + ii, values[ii]);
            }
          });
        };

        List.prototype.pop = function pop () {
          return setListBounds(this, 0, -1);
        };

        List.prototype.unshift = function unshift (/*...values*/) {
          var values = arguments;
          return this.withMutations(function (list) {
            setListBounds(list, -values.length);
            for (var ii = 0; ii < values.length; ii++) {
              list.set(ii, values[ii]);
            }
          });
        };

        List.prototype.shift = function shift () {
          return setListBounds(this, 1);
        };

        // @pragma Composition

        List.prototype.concat = function concat (/*...collections*/) {
          var arguments$1 = arguments;

          var seqs = [];
          for (var i = 0; i < arguments.length; i++) {
            var argument = arguments$1[i];
            var seq = IndexedCollection(
              typeof argument !== 'string' && hasIterator(argument)
                ? argument
                : [argument]
            );
            if (seq.size !== 0) {
              seqs.push(seq);
            }
          }
          if (seqs.length === 0) {
            return this;
          }
          if (this.size === 0 && !this.__ownerID && seqs.length === 1) {
            return this.constructor(seqs[0]);
          }
          return this.withMutations(function (list) {
            seqs.forEach(function (seq) { return seq.forEach(function (value) { return list.push(value); }); });
          });
        };

        List.prototype.setSize = function setSize (size) {
          return setListBounds(this, 0, size);
        };

        List.prototype.map = function map (mapper, context) {
          var this$1$1 = this;

          return this.withMutations(function (list) {
            for (var i = 0; i < this$1$1.size; i++) {
              list.set(i, mapper.call(context, list.get(i), i, this$1$1));
            }
          });
        };

        // @pragma Iteration

        List.prototype.slice = function slice (begin, end) {
          var size = this.size;
          if (wholeSlice(begin, end, size)) {
            return this;
          }
          return setListBounds(
            this,
            resolveBegin(begin, size),
            resolveEnd(end, size)
          );
        };

        List.prototype.__iterator = function __iterator (type, reverse) {
          var index = reverse ? this.size : 0;
          var values = iterateList(this, reverse);
          return new Iterator(function () {
            var value = values();
            return value === DONE
              ? iteratorDone()
              : iteratorValue(type, reverse ? --index : index++, value);
          });
        };

        List.prototype.__iterate = function __iterate (fn, reverse) {
          var index = reverse ? this.size : 0;
          var values = iterateList(this, reverse);
          var value;
          while ((value = values()) !== DONE) {
            if (fn(value, reverse ? --index : index++, this) === false) {
              break;
            }
          }
          return index;
        };

        List.prototype.__ensureOwner = function __ensureOwner (ownerID) {
          if (ownerID === this.__ownerID) {
            return this;
          }
          if (!ownerID) {
            if (this.size === 0) {
              return emptyList();
            }
            this.__ownerID = ownerID;
            this.__altered = false;
            return this;
          }
          return makeList(
            this._origin,
            this._capacity,
            this._level,
            this._root,
            this._tail,
            ownerID,
            this.__hash
          );
        };

        return List;
      }(IndexedCollection));

      List.isList = isList;

      var ListPrototype = List.prototype;
      ListPrototype[IS_LIST_SYMBOL] = true;
      ListPrototype[DELETE] = ListPrototype.remove;
      ListPrototype.merge = ListPrototype.concat;
      ListPrototype.setIn = setIn;
      ListPrototype.deleteIn = ListPrototype.removeIn = deleteIn;
      ListPrototype.update = update;
      ListPrototype.updateIn = updateIn;
      ListPrototype.mergeIn = mergeIn;
      ListPrototype.mergeDeepIn = mergeDeepIn;
      ListPrototype.withMutations = withMutations;
      ListPrototype.wasAltered = wasAltered;
      ListPrototype.asImmutable = asImmutable;
      ListPrototype['@@transducer/init'] = ListPrototype.asMutable = asMutable;
      ListPrototype['@@transducer/step'] = function (result, arr) {
        return result.push(arr);
      };
      ListPrototype['@@transducer/result'] = function (obj) {
        return obj.asImmutable();
      };

      var VNode = function VNode(array, ownerID) {
        this.array = array;
        this.ownerID = ownerID;
      };

      // TODO: seems like these methods are very similar

      VNode.prototype.removeBefore = function removeBefore (ownerID, level, index) {
        if (index === level ? 1 << level : this.array.length === 0) {
          return this;
        }
        var originIndex = (index >>> level) & MASK;
        if (originIndex >= this.array.length) {
          return new VNode([], ownerID);
        }
        var removingFirst = originIndex === 0;
        var newChild;
        if (level > 0) {
          var oldChild = this.array[originIndex];
          newChild =
            oldChild && oldChild.removeBefore(ownerID, level - SHIFT, index);
          if (newChild === oldChild && removingFirst) {
            return this;
          }
        }
        if (removingFirst && !newChild) {
          return this;
        }
        var editable = editableVNode(this, ownerID);
        if (!removingFirst) {
          for (var ii = 0; ii < originIndex; ii++) {
            editable.array[ii] = undefined;
          }
        }
        if (newChild) {
          editable.array[originIndex] = newChild;
        }
        return editable;
      };

      VNode.prototype.removeAfter = function removeAfter (ownerID, level, index) {
        if (index === (level ? 1 << level : 0) || this.array.length === 0) {
          return this;
        }
        var sizeIndex = ((index - 1) >>> level) & MASK;
        if (sizeIndex >= this.array.length) {
          return this;
        }

        var newChild;
        if (level > 0) {
          var oldChild = this.array[sizeIndex];
          newChild =
            oldChild && oldChild.removeAfter(ownerID, level - SHIFT, index);
          if (newChild === oldChild && sizeIndex === this.array.length - 1) {
            return this;
          }
        }

        var editable = editableVNode(this, ownerID);
        editable.array.splice(sizeIndex + 1);
        if (newChild) {
          editable.array[sizeIndex] = newChild;
        }
        return editable;
      };

      var DONE = {};

      function iterateList(list, reverse) {
        var left = list._origin;
        var right = list._capacity;
        var tailPos = getTailOffset(right);
        var tail = list._tail;

        return iterateNodeOrLeaf(list._root, list._level, 0);

        function iterateNodeOrLeaf(node, level, offset) {
          return level === 0
            ? iterateLeaf(node, offset)
            : iterateNode(node, level, offset);
        }

        function iterateLeaf(node, offset) {
          var array = offset === tailPos ? tail && tail.array : node && node.array;
          var from = offset > left ? 0 : left - offset;
          var to = right - offset;
          if (to > SIZE) {
            to = SIZE;
          }
          return function () {
            if (from === to) {
              return DONE;
            }
            var idx = reverse ? --to : from++;
            return array && array[idx];
          };
        }

        function iterateNode(node, level, offset) {
          var values;
          var array = node && node.array;
          var from = offset > left ? 0 : (left - offset) >> level;
          var to = ((right - offset) >> level) + 1;
          if (to > SIZE) {
            to = SIZE;
          }
          return function () {
            while (true) {
              if (values) {
                var value = values();
                if (value !== DONE) {
                  return value;
                }
                values = null;
              }
              if (from === to) {
                return DONE;
              }
              var idx = reverse ? --to : from++;
              values = iterateNodeOrLeaf(
                array && array[idx],
                level - SHIFT,
                offset + (idx << level)
              );
            }
          };
        }
      }

      function makeList(origin, capacity, level, root, tail, ownerID, hash) {
        var list = Object.create(ListPrototype);
        list.size = capacity - origin;
        list._origin = origin;
        list._capacity = capacity;
        list._level = level;
        list._root = root;
        list._tail = tail;
        list.__ownerID = ownerID;
        list.__hash = hash;
        list.__altered = false;
        return list;
      }

      var EMPTY_LIST;
      function emptyList() {
        return EMPTY_LIST || (EMPTY_LIST = makeList(0, 0, SHIFT));
      }

      function updateList(list, index, value) {
        index = wrapIndex(list, index);

        if (index !== index) {
          return list;
        }

        if (index >= list.size || index < 0) {
          return list.withMutations(function (list) {
            index < 0
              ? setListBounds(list, index).set(0, value)
              : setListBounds(list, 0, index + 1).set(index, value);
          });
        }

        index += list._origin;

        var newTail = list._tail;
        var newRoot = list._root;
        var didAlter = MakeRef();
        if (index >= getTailOffset(list._capacity)) {
          newTail = updateVNode(newTail, list.__ownerID, 0, index, value, didAlter);
        } else {
          newRoot = updateVNode(
            newRoot,
            list.__ownerID,
            list._level,
            index,
            value,
            didAlter
          );
        }

        if (!didAlter.value) {
          return list;
        }

        if (list.__ownerID) {
          list._root = newRoot;
          list._tail = newTail;
          list.__hash = undefined;
          list.__altered = true;
          return list;
        }
        return makeList(list._origin, list._capacity, list._level, newRoot, newTail);
      }

      function updateVNode(node, ownerID, level, index, value, didAlter) {
        var idx = (index >>> level) & MASK;
        var nodeHas = node && idx < node.array.length;
        if (!nodeHas && value === undefined) {
          return node;
        }

        var newNode;

        if (level > 0) {
          var lowerNode = node && node.array[idx];
          var newLowerNode = updateVNode(
            lowerNode,
            ownerID,
            level - SHIFT,
            index,
            value,
            didAlter
          );
          if (newLowerNode === lowerNode) {
            return node;
          }
          newNode = editableVNode(node, ownerID);
          newNode.array[idx] = newLowerNode;
          return newNode;
        }

        if (nodeHas && node.array[idx] === value) {
          return node;
        }

        if (didAlter) {
          SetRef(didAlter);
        }

        newNode = editableVNode(node, ownerID);
        if (value === undefined && idx === newNode.array.length - 1) {
          newNode.array.pop();
        } else {
          newNode.array[idx] = value;
        }
        return newNode;
      }

      function editableVNode(node, ownerID) {
        if (ownerID && node && ownerID === node.ownerID) {
          return node;
        }
        return new VNode(node ? node.array.slice() : [], ownerID);
      }

      function listNodeFor(list, rawIndex) {
        if (rawIndex >= getTailOffset(list._capacity)) {
          return list._tail;
        }
        if (rawIndex < 1 << (list._level + SHIFT)) {
          var node = list._root;
          var level = list._level;
          while (node && level > 0) {
            node = node.array[(rawIndex >>> level) & MASK];
            level -= SHIFT;
          }
          return node;
        }
      }

      function setListBounds(list, begin, end) {
        // Sanitize begin & end using this shorthand for ToInt32(argument)
        // http://www.ecma-international.org/ecma-262/6.0/#sec-toint32
        if (begin !== undefined) {
          begin |= 0;
        }
        if (end !== undefined) {
          end |= 0;
        }
        var owner = list.__ownerID || new OwnerID();
        var oldOrigin = list._origin;
        var oldCapacity = list._capacity;
        var newOrigin = oldOrigin + begin;
        var newCapacity =
          end === undefined
            ? oldCapacity
            : end < 0
            ? oldCapacity + end
            : oldOrigin + end;
        if (newOrigin === oldOrigin && newCapacity === oldCapacity) {
          return list;
        }

        // If it's going to end after it starts, it's empty.
        if (newOrigin >= newCapacity) {
          return list.clear();
        }

        var newLevel = list._level;
        var newRoot = list._root;

        // New origin might need creating a higher root.
        var offsetShift = 0;
        while (newOrigin + offsetShift < 0) {
          newRoot = new VNode(
            newRoot && newRoot.array.length ? [undefined, newRoot] : [],
            owner
          );
          newLevel += SHIFT;
          offsetShift += 1 << newLevel;
        }
        if (offsetShift) {
          newOrigin += offsetShift;
          oldOrigin += offsetShift;
          newCapacity += offsetShift;
          oldCapacity += offsetShift;
        }

        var oldTailOffset = getTailOffset(oldCapacity);
        var newTailOffset = getTailOffset(newCapacity);

        // New size might need creating a higher root.
        while (newTailOffset >= 1 << (newLevel + SHIFT)) {
          newRoot = new VNode(
            newRoot && newRoot.array.length ? [newRoot] : [],
            owner
          );
          newLevel += SHIFT;
        }

        // Locate or create the new tail.
        var oldTail = list._tail;
        var newTail =
          newTailOffset < oldTailOffset
            ? listNodeFor(list, newCapacity - 1)
            : newTailOffset > oldTailOffset
            ? new VNode([], owner)
            : oldTail;

        // Merge Tail into tree.
        if (
          oldTail &&
          newTailOffset > oldTailOffset &&
          newOrigin < oldCapacity &&
          oldTail.array.length
        ) {
          newRoot = editableVNode(newRoot, owner);
          var node = newRoot;
          for (var level = newLevel; level > SHIFT; level -= SHIFT) {
            var idx = (oldTailOffset >>> level) & MASK;
            node = node.array[idx] = editableVNode(node.array[idx], owner);
          }
          node.array[(oldTailOffset >>> SHIFT) & MASK] = oldTail;
        }

        // If the size has been reduced, there's a chance the tail needs to be trimmed.
        if (newCapacity < oldCapacity) {
          newTail = newTail && newTail.removeAfter(owner, 0, newCapacity);
        }

        // If the new origin is within the tail, then we do not need a root.
        if (newOrigin >= newTailOffset) {
          newOrigin -= newTailOffset;
          newCapacity -= newTailOffset;
          newLevel = SHIFT;
          newRoot = null;
          newTail = newTail && newTail.removeBefore(owner, 0, newOrigin);

          // Otherwise, if the root has been trimmed, garbage collect.
        } else if (newOrigin > oldOrigin || newTailOffset < oldTailOffset) {
          offsetShift = 0;

          // Identify the new top root node of the subtree of the old root.
          while (newRoot) {
            var beginIndex = (newOrigin >>> newLevel) & MASK;
            if ((beginIndex !== newTailOffset >>> newLevel) & MASK) {
              break;
            }
            if (beginIndex) {
              offsetShift += (1 << newLevel) * beginIndex;
            }
            newLevel -= SHIFT;
            newRoot = newRoot.array[beginIndex];
          }

          // Trim the new sides of the new root.
          if (newRoot && newOrigin > oldOrigin) {
            newRoot = newRoot.removeBefore(owner, newLevel, newOrigin - offsetShift);
          }
          if (newRoot && newTailOffset < oldTailOffset) {
            newRoot = newRoot.removeAfter(
              owner,
              newLevel,
              newTailOffset - offsetShift
            );
          }
          if (offsetShift) {
            newOrigin -= offsetShift;
            newCapacity -= offsetShift;
          }
        }

        if (list.__ownerID) {
          list.size = newCapacity - newOrigin;
          list._origin = newOrigin;
          list._capacity = newCapacity;
          list._level = newLevel;
          list._root = newRoot;
          list._tail = newTail;
          list.__hash = undefined;
          list.__altered = true;
          return list;
        }
        return makeList(newOrigin, newCapacity, newLevel, newRoot, newTail);
      }

      function getTailOffset(size) {
        return size < SIZE ? 0 : ((size - 1) >>> SHIFT) << SHIFT;
      }

      var OrderedMap = /*@__PURE__*/(function (Map) {
        function OrderedMap(value) {
          return value === null || value === undefined
            ? emptyOrderedMap()
            : isOrderedMap(value)
            ? value
            : emptyOrderedMap().withMutations(function (map) {
                var iter = KeyedCollection(value);
                assertNotInfinite(iter.size);
                iter.forEach(function (v, k) { return map.set(k, v); });
              });
        }

        if ( Map ) OrderedMap.__proto__ = Map;
        OrderedMap.prototype = Object.create( Map && Map.prototype );
        OrderedMap.prototype.constructor = OrderedMap;

        OrderedMap.of = function of (/*...values*/) {
          return this(arguments);
        };

        OrderedMap.prototype.toString = function toString () {
          return this.__toString('OrderedMap {', '}');
        };

        // @pragma Access

        OrderedMap.prototype.get = function get (k, notSetValue) {
          var index = this._map.get(k);
          return index !== undefined ? this._list.get(index)[1] : notSetValue;
        };

        // @pragma Modification

        OrderedMap.prototype.clear = function clear () {
          if (this.size === 0) {
            return this;
          }
          if (this.__ownerID) {
            this.size = 0;
            this._map.clear();
            this._list.clear();
            this.__altered = true;
            return this;
          }
          return emptyOrderedMap();
        };

        OrderedMap.prototype.set = function set (k, v) {
          return updateOrderedMap(this, k, v);
        };

        OrderedMap.prototype.remove = function remove (k) {
          return updateOrderedMap(this, k, NOT_SET);
        };

        OrderedMap.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          return this._list.__iterate(
            function (entry) { return entry && fn(entry[1], entry[0], this$1$1); },
            reverse
          );
        };

        OrderedMap.prototype.__iterator = function __iterator (type, reverse) {
          return this._list.fromEntrySeq().__iterator(type, reverse);
        };

        OrderedMap.prototype.__ensureOwner = function __ensureOwner (ownerID) {
          if (ownerID === this.__ownerID) {
            return this;
          }
          var newMap = this._map.__ensureOwner(ownerID);
          var newList = this._list.__ensureOwner(ownerID);
          if (!ownerID) {
            if (this.size === 0) {
              return emptyOrderedMap();
            }
            this.__ownerID = ownerID;
            this.__altered = false;
            this._map = newMap;
            this._list = newList;
            return this;
          }
          return makeOrderedMap(newMap, newList, ownerID, this.__hash);
        };

        return OrderedMap;
      }(Map$1));

      OrderedMap.isOrderedMap = isOrderedMap;

      OrderedMap.prototype[IS_ORDERED_SYMBOL] = true;
      OrderedMap.prototype[DELETE] = OrderedMap.prototype.remove;

      function makeOrderedMap(map, list, ownerID, hash) {
        var omap = Object.create(OrderedMap.prototype);
        omap.size = map ? map.size : 0;
        omap._map = map;
        omap._list = list;
        omap.__ownerID = ownerID;
        omap.__hash = hash;
        omap.__altered = false;
        return omap;
      }

      var EMPTY_ORDERED_MAP;
      function emptyOrderedMap() {
        return (
          EMPTY_ORDERED_MAP ||
          (EMPTY_ORDERED_MAP = makeOrderedMap(emptyMap(), emptyList()))
        );
      }

      function updateOrderedMap(omap, k, v) {
        var map = omap._map;
        var list = omap._list;
        var i = map.get(k);
        var has = i !== undefined;
        var newMap;
        var newList;
        if (v === NOT_SET) {
          // removed
          if (!has) {
            return omap;
          }
          if (list.size >= SIZE && list.size >= map.size * 2) {
            newList = list.filter(function (entry, idx) { return entry !== undefined && i !== idx; });
            newMap = newList
              .toKeyedSeq()
              .map(function (entry) { return entry[0]; })
              .flip()
              .toMap();
            if (omap.__ownerID) {
              newMap.__ownerID = newList.__ownerID = omap.__ownerID;
            }
          } else {
            newMap = map.remove(k);
            newList = i === list.size - 1 ? list.pop() : list.set(i, undefined);
          }
        } else if (has) {
          if (v === list.get(i)[1]) {
            return omap;
          }
          newMap = map;
          newList = list.set(i, [k, v]);
        } else {
          newMap = map.set(k, list.size);
          newList = list.set(list.size, [k, v]);
        }
        if (omap.__ownerID) {
          omap.size = newMap.size;
          omap._map = newMap;
          omap._list = newList;
          omap.__hash = undefined;
          omap.__altered = true;
          return omap;
        }
        return makeOrderedMap(newMap, newList);
      }

      var IS_STACK_SYMBOL = '@@__IMMUTABLE_STACK__@@';

      function isStack(maybeStack) {
        return Boolean(maybeStack && maybeStack[IS_STACK_SYMBOL]);
      }

      var Stack = /*@__PURE__*/(function (IndexedCollection) {
        function Stack(value) {
          return value === null || value === undefined
            ? emptyStack()
            : isStack(value)
            ? value
            : emptyStack().pushAll(value);
        }

        if ( IndexedCollection ) Stack.__proto__ = IndexedCollection;
        Stack.prototype = Object.create( IndexedCollection && IndexedCollection.prototype );
        Stack.prototype.constructor = Stack;

        Stack.of = function of (/*...values*/) {
          return this(arguments);
        };

        Stack.prototype.toString = function toString () {
          return this.__toString('Stack [', ']');
        };

        // @pragma Access

        Stack.prototype.get = function get (index, notSetValue) {
          var head = this._head;
          index = wrapIndex(this, index);
          while (head && index--) {
            head = head.next;
          }
          return head ? head.value : notSetValue;
        };

        Stack.prototype.peek = function peek () {
          return this._head && this._head.value;
        };

        // @pragma Modification

        Stack.prototype.push = function push (/*...values*/) {
          var arguments$1 = arguments;

          if (arguments.length === 0) {
            return this;
          }
          var newSize = this.size + arguments.length;
          var head = this._head;
          for (var ii = arguments.length - 1; ii >= 0; ii--) {
            head = {
              value: arguments$1[ii],
              next: head,
            };
          }
          if (this.__ownerID) {
            this.size = newSize;
            this._head = head;
            this.__hash = undefined;
            this.__altered = true;
            return this;
          }
          return makeStack(newSize, head);
        };

        Stack.prototype.pushAll = function pushAll (iter) {
          iter = IndexedCollection(iter);
          if (iter.size === 0) {
            return this;
          }
          if (this.size === 0 && isStack(iter)) {
            return iter;
          }
          assertNotInfinite(iter.size);
          var newSize = this.size;
          var head = this._head;
          iter.__iterate(function (value) {
            newSize++;
            head = {
              value: value,
              next: head,
            };
          }, /* reverse */ true);
          if (this.__ownerID) {
            this.size = newSize;
            this._head = head;
            this.__hash = undefined;
            this.__altered = true;
            return this;
          }
          return makeStack(newSize, head);
        };

        Stack.prototype.pop = function pop () {
          return this.slice(1);
        };

        Stack.prototype.clear = function clear () {
          if (this.size === 0) {
            return this;
          }
          if (this.__ownerID) {
            this.size = 0;
            this._head = undefined;
            this.__hash = undefined;
            this.__altered = true;
            return this;
          }
          return emptyStack();
        };

        Stack.prototype.slice = function slice (begin, end) {
          if (wholeSlice(begin, end, this.size)) {
            return this;
          }
          var resolvedBegin = resolveBegin(begin, this.size);
          var resolvedEnd = resolveEnd(end, this.size);
          if (resolvedEnd !== this.size) {
            // super.slice(begin, end);
            return IndexedCollection.prototype.slice.call(this, begin, end);
          }
          var newSize = this.size - resolvedBegin;
          var head = this._head;
          while (resolvedBegin--) {
            head = head.next;
          }
          if (this.__ownerID) {
            this.size = newSize;
            this._head = head;
            this.__hash = undefined;
            this.__altered = true;
            return this;
          }
          return makeStack(newSize, head);
        };

        // @pragma Mutability

        Stack.prototype.__ensureOwner = function __ensureOwner (ownerID) {
          if (ownerID === this.__ownerID) {
            return this;
          }
          if (!ownerID) {
            if (this.size === 0) {
              return emptyStack();
            }
            this.__ownerID = ownerID;
            this.__altered = false;
            return this;
          }
          return makeStack(this.size, this._head, ownerID, this.__hash);
        };

        // @pragma Iteration

        Stack.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          if (reverse) {
            return new ArraySeq(this.toArray()).__iterate(
              function (v, k) { return fn(v, k, this$1$1); },
              reverse
            );
          }
          var iterations = 0;
          var node = this._head;
          while (node) {
            if (fn(node.value, iterations++, this) === false) {
              break;
            }
            node = node.next;
          }
          return iterations;
        };

        Stack.prototype.__iterator = function __iterator (type, reverse) {
          if (reverse) {
            return new ArraySeq(this.toArray()).__iterator(type, reverse);
          }
          var iterations = 0;
          var node = this._head;
          return new Iterator(function () {
            if (node) {
              var value = node.value;
              node = node.next;
              return iteratorValue(type, iterations++, value);
            }
            return iteratorDone();
          });
        };

        return Stack;
      }(IndexedCollection));

      Stack.isStack = isStack;

      var StackPrototype = Stack.prototype;
      StackPrototype[IS_STACK_SYMBOL] = true;
      StackPrototype.shift = StackPrototype.pop;
      StackPrototype.unshift = StackPrototype.push;
      StackPrototype.unshiftAll = StackPrototype.pushAll;
      StackPrototype.withMutations = withMutations;
      StackPrototype.wasAltered = wasAltered;
      StackPrototype.asImmutable = asImmutable;
      StackPrototype['@@transducer/init'] = StackPrototype.asMutable = asMutable;
      StackPrototype['@@transducer/step'] = function (result, arr) {
        return result.unshift(arr);
      };
      StackPrototype['@@transducer/result'] = function (obj) {
        return obj.asImmutable();
      };

      function makeStack(size, head, ownerID, hash) {
        var map = Object.create(StackPrototype);
        map.size = size;
        map._head = head;
        map.__ownerID = ownerID;
        map.__hash = hash;
        map.__altered = false;
        return map;
      }

      var EMPTY_STACK;
      function emptyStack() {
        return EMPTY_STACK || (EMPTY_STACK = makeStack(0));
      }

      var IS_SET_SYMBOL = '@@__IMMUTABLE_SET__@@';

      function isSet(maybeSet) {
        return Boolean(maybeSet && maybeSet[IS_SET_SYMBOL]);
      }

      function isOrderedSet(maybeOrderedSet) {
        return isSet(maybeOrderedSet) && isOrdered(maybeOrderedSet);
      }

      function deepEqual(a, b) {
        if (a === b) {
          return true;
        }

        if (
          !isCollection(b) ||
          (a.size !== undefined && b.size !== undefined && a.size !== b.size) ||
          (a.__hash !== undefined &&
            b.__hash !== undefined &&
            a.__hash !== b.__hash) ||
          isKeyed(a) !== isKeyed(b) ||
          isIndexed(a) !== isIndexed(b) ||
          isOrdered(a) !== isOrdered(b)
        ) {
          return false;
        }

        if (a.size === 0 && b.size === 0) {
          return true;
        }

        var notAssociative = !isAssociative(a);

        if (isOrdered(a)) {
          var entries = a.entries();
          return (
            b.every(function (v, k) {
              var entry = entries.next().value;
              return entry && is(entry[1], v) && (notAssociative || is(entry[0], k));
            }) && entries.next().done
          );
        }

        var flipped = false;

        if (a.size === undefined) {
          if (b.size === undefined) {
            if (typeof a.cacheResult === 'function') {
              a.cacheResult();
            }
          } else {
            flipped = true;
            var _ = a;
            a = b;
            b = _;
          }
        }

        var allEqual = true;
        var bSize = b.__iterate(function (v, k) {
          if (
            notAssociative
              ? !a.has(v)
              : flipped
              ? !is(v, a.get(k, NOT_SET))
              : !is(a.get(k, NOT_SET), v)
          ) {
            allEqual = false;
            return false;
          }
        });

        return allEqual && a.size === bSize;
      }

      function mixin(ctor, methods) {
        var keyCopier = function (key) {
          ctor.prototype[key] = methods[key];
        };
        Object.keys(methods).forEach(keyCopier);
        Object.getOwnPropertySymbols &&
          Object.getOwnPropertySymbols(methods).forEach(keyCopier);
        return ctor;
      }

      function toJS(value) {
        if (!value || typeof value !== 'object') {
          return value;
        }
        if (!isCollection(value)) {
          if (!isDataStructure(value)) {
            return value;
          }
          value = Seq(value);
        }
        if (isKeyed(value)) {
          var result$1 = {};
          value.__iterate(function (v, k) {
            result$1[k] = toJS(v);
          });
          return result$1;
        }
        var result = [];
        value.__iterate(function (v) {
          result.push(toJS(v));
        });
        return result;
      }

      var Set$1 = /*@__PURE__*/(function (SetCollection) {
        function Set(value) {
          return value === null || value === undefined
            ? emptySet()
            : isSet(value) && !isOrdered(value)
            ? value
            : emptySet().withMutations(function (set) {
                var iter = SetCollection(value);
                assertNotInfinite(iter.size);
                iter.forEach(function (v) { return set.add(v); });
              });
        }

        if ( SetCollection ) Set.__proto__ = SetCollection;
        Set.prototype = Object.create( SetCollection && SetCollection.prototype );
        Set.prototype.constructor = Set;

        Set.of = function of (/*...values*/) {
          return this(arguments);
        };

        Set.fromKeys = function fromKeys (value) {
          return this(KeyedCollection(value).keySeq());
        };

        Set.intersect = function intersect (sets) {
          sets = Collection(sets).toArray();
          return sets.length
            ? SetPrototype.intersect.apply(Set(sets.pop()), sets)
            : emptySet();
        };

        Set.union = function union (sets) {
          sets = Collection(sets).toArray();
          return sets.length
            ? SetPrototype.union.apply(Set(sets.pop()), sets)
            : emptySet();
        };

        Set.prototype.toString = function toString () {
          return this.__toString('Set {', '}');
        };

        // @pragma Access

        Set.prototype.has = function has (value) {
          return this._map.has(value);
        };

        // @pragma Modification

        Set.prototype.add = function add (value) {
          return updateSet(this, this._map.set(value, value));
        };

        Set.prototype.remove = function remove (value) {
          return updateSet(this, this._map.remove(value));
        };

        Set.prototype.clear = function clear () {
          return updateSet(this, this._map.clear());
        };

        // @pragma Composition

        Set.prototype.map = function map (mapper, context) {
          var this$1$1 = this;

          // keep track if the set is altered by the map function
          var didChanges = false;

          var newMap = updateSet(
            this,
            this._map.mapEntries(function (ref) {
              var v = ref[1];

              var mapped = mapper.call(context, v, v, this$1$1);

              if (mapped !== v) {
                didChanges = true;
              }

              return [mapped, mapped];
            }, context)
          );

          return didChanges ? newMap : this;
        };

        Set.prototype.union = function union () {
          var iters = [], len = arguments.length;
          while ( len-- ) iters[ len ] = arguments[ len ];

          iters = iters.filter(function (x) { return x.size !== 0; });
          if (iters.length === 0) {
            return this;
          }
          if (this.size === 0 && !this.__ownerID && iters.length === 1) {
            return this.constructor(iters[0]);
          }
          return this.withMutations(function (set) {
            for (var ii = 0; ii < iters.length; ii++) {
              SetCollection(iters[ii]).forEach(function (value) { return set.add(value); });
            }
          });
        };

        Set.prototype.intersect = function intersect () {
          var iters = [], len = arguments.length;
          while ( len-- ) iters[ len ] = arguments[ len ];

          if (iters.length === 0) {
            return this;
          }
          iters = iters.map(function (iter) { return SetCollection(iter); });
          var toRemove = [];
          this.forEach(function (value) {
            if (!iters.every(function (iter) { return iter.includes(value); })) {
              toRemove.push(value);
            }
          });
          return this.withMutations(function (set) {
            toRemove.forEach(function (value) {
              set.remove(value);
            });
          });
        };

        Set.prototype.subtract = function subtract () {
          var iters = [], len = arguments.length;
          while ( len-- ) iters[ len ] = arguments[ len ];

          if (iters.length === 0) {
            return this;
          }
          iters = iters.map(function (iter) { return SetCollection(iter); });
          var toRemove = [];
          this.forEach(function (value) {
            if (iters.some(function (iter) { return iter.includes(value); })) {
              toRemove.push(value);
            }
          });
          return this.withMutations(function (set) {
            toRemove.forEach(function (value) {
              set.remove(value);
            });
          });
        };

        Set.prototype.sort = function sort (comparator) {
          // Late binding
          return OrderedSet(sortFactory(this, comparator));
        };

        Set.prototype.sortBy = function sortBy (mapper, comparator) {
          // Late binding
          return OrderedSet(sortFactory(this, comparator, mapper));
        };

        Set.prototype.wasAltered = function wasAltered () {
          return this._map.wasAltered();
        };

        Set.prototype.__iterate = function __iterate (fn, reverse) {
          var this$1$1 = this;

          return this._map.__iterate(function (k) { return fn(k, k, this$1$1); }, reverse);
        };

        Set.prototype.__iterator = function __iterator (type, reverse) {
          return this._map.__iterator(type, reverse);
        };

        Set.prototype.__ensureOwner = function __ensureOwner (ownerID) {
          if (ownerID === this.__ownerID) {
            return this;
          }
          var newMap = this._map.__ensureOwner(ownerID);
          if (!ownerID) {
            if (this.size === 0) {
              return this.__empty();
            }
            this.__ownerID = ownerID;
            this._map = newMap;
            return this;
          }
          return this.__make(newMap, ownerID);
        };

        return Set;
      }(SetCollection));

      Set$1.isSet = isSet;

      var SetPrototype = Set$1.prototype;
      SetPrototype[IS_SET_SYMBOL] = true;
      SetPrototype[DELETE] = SetPrototype.remove;
      SetPrototype.merge = SetPrototype.concat = SetPrototype.union;
      SetPrototype.withMutations = withMutations;
      SetPrototype.asImmutable = asImmutable;
      SetPrototype['@@transducer/init'] = SetPrototype.asMutable = asMutable;
      SetPrototype['@@transducer/step'] = function (result, arr) {
        return result.add(arr);
      };
      SetPrototype['@@transducer/result'] = function (obj) {
        return obj.asImmutable();
      };

      SetPrototype.__empty = emptySet;
      SetPrototype.__make = makeSet;

      function updateSet(set, newMap) {
        if (set.__ownerID) {
          set.size = newMap.size;
          set._map = newMap;
          return set;
        }
        return newMap === set._map
          ? set
          : newMap.size === 0
          ? set.__empty()
          : set.__make(newMap);
      }

      function makeSet(map, ownerID) {
        var set = Object.create(SetPrototype);
        set.size = map ? map.size : 0;
        set._map = map;
        set.__ownerID = ownerID;
        return set;
      }

      var EMPTY_SET;
      function emptySet() {
        return EMPTY_SET || (EMPTY_SET = makeSet(emptyMap()));
      }

      /**
       * Returns a lazy seq of nums from start (inclusive) to end
       * (exclusive), by step, where start defaults to 0, step to 1, and end to
       * infinity. When start is equal to end, returns empty list.
       */
      var Range = /*@__PURE__*/(function (IndexedSeq) {
        function Range(start, end, step) {
          if (!(this instanceof Range)) {
            return new Range(start, end, step);
          }
          invariant(step !== 0, 'Cannot step a Range by 0');
          start = start || 0;
          if (end === undefined) {
            end = Infinity;
          }
          step = step === undefined ? 1 : Math.abs(step);
          if (end < start) {
            step = -step;
          }
          this._start = start;
          this._end = end;
          this._step = step;
          this.size = Math.max(0, Math.ceil((end - start) / step - 1) + 1);
          if (this.size === 0) {
            if (EMPTY_RANGE) {
              return EMPTY_RANGE;
            }
            EMPTY_RANGE = this;
          }
        }

        if ( IndexedSeq ) Range.__proto__ = IndexedSeq;
        Range.prototype = Object.create( IndexedSeq && IndexedSeq.prototype );
        Range.prototype.constructor = Range;

        Range.prototype.toString = function toString () {
          if (this.size === 0) {
            return 'Range []';
          }
          return (
            'Range [ ' +
            this._start +
            '...' +
            this._end +
            (this._step !== 1 ? ' by ' + this._step : '') +
            ' ]'
          );
        };

        Range.prototype.get = function get (index, notSetValue) {
          return this.has(index)
            ? this._start + wrapIndex(this, index) * this._step
            : notSetValue;
        };

        Range.prototype.includes = function includes (searchValue) {
          var possibleIndex = (searchValue - this._start) / this._step;
          return (
            possibleIndex >= 0 &&
            possibleIndex < this.size &&
            possibleIndex === Math.floor(possibleIndex)
          );
        };

        Range.prototype.slice = function slice (begin, end) {
          if (wholeSlice(begin, end, this.size)) {
            return this;
          }
          begin = resolveBegin(begin, this.size);
          end = resolveEnd(end, this.size);
          if (end <= begin) {
            return new Range(0, 0);
          }
          return new Range(
            this.get(begin, this._end),
            this.get(end, this._end),
            this._step
          );
        };

        Range.prototype.indexOf = function indexOf (searchValue) {
          var offsetValue = searchValue - this._start;
          if (offsetValue % this._step === 0) {
            var index = offsetValue / this._step;
            if (index >= 0 && index < this.size) {
              return index;
            }
          }
          return -1;
        };

        Range.prototype.lastIndexOf = function lastIndexOf (searchValue) {
          return this.indexOf(searchValue);
        };

        Range.prototype.__iterate = function __iterate (fn, reverse) {
          var size = this.size;
          var step = this._step;
          var value = reverse ? this._start + (size - 1) * step : this._start;
          var i = 0;
          while (i !== size) {
            if (fn(value, reverse ? size - ++i : i++, this) === false) {
              break;
            }
            value += reverse ? -step : step;
          }
          return i;
        };

        Range.prototype.__iterator = function __iterator (type, reverse) {
          var size = this.size;
          var step = this._step;
          var value = reverse ? this._start + (size - 1) * step : this._start;
          var i = 0;
          return new Iterator(function () {
            if (i === size) {
              return iteratorDone();
            }
            var v = value;
            value += reverse ? -step : step;
            return iteratorValue(type, reverse ? size - ++i : i++, v);
          });
        };

        Range.prototype.equals = function equals (other) {
          return other instanceof Range
            ? this._start === other._start &&
                this._end === other._end &&
                this._step === other._step
            : deepEqual(this, other);
        };

        return Range;
      }(IndexedSeq));

      var EMPTY_RANGE;

      function getIn$1(collection, searchKeyPath, notSetValue) {
        var keyPath = coerceKeyPath(searchKeyPath);
        var i = 0;
        while (i !== keyPath.length) {
          collection = get(collection, keyPath[i++], NOT_SET);
          if (collection === NOT_SET) {
            return notSetValue;
          }
        }
        return collection;
      }

      function getIn(searchKeyPath, notSetValue) {
        return getIn$1(this, searchKeyPath, notSetValue);
      }

      function hasIn$1(collection, keyPath) {
        return getIn$1(collection, keyPath, NOT_SET) !== NOT_SET;
      }

      function hasIn(searchKeyPath) {
        return hasIn$1(this, searchKeyPath);
      }

      function toObject() {
        assertNotInfinite(this.size);
        var object = {};
        this.__iterate(function (v, k) {
          object[k] = v;
        });
        return object;
      }

      // Note: all of these methods are deprecated.
      Collection.isIterable = isCollection;
      Collection.isKeyed = isKeyed;
      Collection.isIndexed = isIndexed;
      Collection.isAssociative = isAssociative;
      Collection.isOrdered = isOrdered;

      Collection.Iterator = Iterator;

      mixin(Collection, {
        // ### Conversion to other types

        toArray: function toArray() {
          assertNotInfinite(this.size);
          var array = new Array(this.size || 0);
          var useTuples = isKeyed(this);
          var i = 0;
          this.__iterate(function (v, k) {
            // Keyed collections produce an array of tuples.
            array[i++] = useTuples ? [k, v] : v;
          });
          return array;
        },

        toIndexedSeq: function toIndexedSeq() {
          return new ToIndexedSequence(this);
        },

        toJS: function toJS$1() {
          return toJS(this);
        },

        toKeyedSeq: function toKeyedSeq() {
          return new ToKeyedSequence(this, true);
        },

        toMap: function toMap() {
          // Use Late Binding here to solve the circular dependency.
          return Map$1(this.toKeyedSeq());
        },

        toObject: toObject,

        toOrderedMap: function toOrderedMap() {
          // Use Late Binding here to solve the circular dependency.
          return OrderedMap(this.toKeyedSeq());
        },

        toOrderedSet: function toOrderedSet() {
          // Use Late Binding here to solve the circular dependency.
          return OrderedSet(isKeyed(this) ? this.valueSeq() : this);
        },

        toSet: function toSet() {
          // Use Late Binding here to solve the circular dependency.
          return Set$1(isKeyed(this) ? this.valueSeq() : this);
        },

        toSetSeq: function toSetSeq() {
          return new ToSetSequence(this);
        },

        toSeq: function toSeq() {
          return isIndexed(this)
            ? this.toIndexedSeq()
            : isKeyed(this)
            ? this.toKeyedSeq()
            : this.toSetSeq();
        },

        toStack: function toStack() {
          // Use Late Binding here to solve the circular dependency.
          return Stack(isKeyed(this) ? this.valueSeq() : this);
        },

        toList: function toList() {
          // Use Late Binding here to solve the circular dependency.
          return List(isKeyed(this) ? this.valueSeq() : this);
        },

        // ### Common JavaScript methods and properties

        toString: function toString() {
          return '[Collection]';
        },

        __toString: function __toString(head, tail) {
          if (this.size === 0) {
            return head + tail;
          }
          return (
            head +
            ' ' +
            this.toSeq().map(this.__toStringMapper).join(', ') +
            ' ' +
            tail
          );
        },

        // ### ES6 Collection methods (ES6 Array and Map)

        concat: function concat() {
          var values = [], len = arguments.length;
          while ( len-- ) values[ len ] = arguments[ len ];

          return reify(this, concatFactory(this, values));
        },

        includes: function includes(searchValue) {
          return this.some(function (value) { return is(value, searchValue); });
        },

        entries: function entries() {
          return this.__iterator(ITERATE_ENTRIES);
        },

        every: function every(predicate, context) {
          assertNotInfinite(this.size);
          var returnValue = true;
          this.__iterate(function (v, k, c) {
            if (!predicate.call(context, v, k, c)) {
              returnValue = false;
              return false;
            }
          });
          return returnValue;
        },

        filter: function filter(predicate, context) {
          return reify(this, filterFactory(this, predicate, context, true));
        },

        find: function find(predicate, context, notSetValue) {
          var entry = this.findEntry(predicate, context);
          return entry ? entry[1] : notSetValue;
        },

        forEach: function forEach(sideEffect, context) {
          assertNotInfinite(this.size);
          return this.__iterate(context ? sideEffect.bind(context) : sideEffect);
        },

        join: function join(separator) {
          assertNotInfinite(this.size);
          separator = separator !== undefined ? '' + separator : ',';
          var joined = '';
          var isFirst = true;
          this.__iterate(function (v) {
            isFirst ? (isFirst = false) : (joined += separator);
            joined += v !== null && v !== undefined ? v.toString() : '';
          });
          return joined;
        },

        keys: function keys() {
          return this.__iterator(ITERATE_KEYS);
        },

        map: function map(mapper, context) {
          return reify(this, mapFactory(this, mapper, context));
        },

        reduce: function reduce$1(reducer, initialReduction, context) {
          return reduce(
            this,
            reducer,
            initialReduction,
            context,
            arguments.length < 2,
            false
          );
        },

        reduceRight: function reduceRight(reducer, initialReduction, context) {
          return reduce(
            this,
            reducer,
            initialReduction,
            context,
            arguments.length < 2,
            true
          );
        },

        reverse: function reverse() {
          return reify(this, reverseFactory(this, true));
        },

        slice: function slice(begin, end) {
          return reify(this, sliceFactory(this, begin, end, true));
        },

        some: function some(predicate, context) {
          return !this.every(not(predicate), context);
        },

        sort: function sort(comparator) {
          return reify(this, sortFactory(this, comparator));
        },

        values: function values() {
          return this.__iterator(ITERATE_VALUES);
        },

        // ### More sequential methods

        butLast: function butLast() {
          return this.slice(0, -1);
        },

        isEmpty: function isEmpty() {
          return this.size !== undefined ? this.size === 0 : !this.some(function () { return true; });
        },

        count: function count(predicate, context) {
          return ensureSize(
            predicate ? this.toSeq().filter(predicate, context) : this
          );
        },

        countBy: function countBy(grouper, context) {
          return countByFactory(this, grouper, context);
        },

        equals: function equals(other) {
          return deepEqual(this, other);
        },

        entrySeq: function entrySeq() {
          var collection = this;
          if (collection._cache) {
            // We cache as an entries array, so we can just return the cache!
            return new ArraySeq(collection._cache);
          }
          var entriesSequence = collection.toSeq().map(entryMapper).toIndexedSeq();
          entriesSequence.fromEntrySeq = function () { return collection.toSeq(); };
          return entriesSequence;
        },

        filterNot: function filterNot(predicate, context) {
          return this.filter(not(predicate), context);
        },

        findEntry: function findEntry(predicate, context, notSetValue) {
          var found = notSetValue;
          this.__iterate(function (v, k, c) {
            if (predicate.call(context, v, k, c)) {
              found = [k, v];
              return false;
            }
          });
          return found;
        },

        findKey: function findKey(predicate, context) {
          var entry = this.findEntry(predicate, context);
          return entry && entry[0];
        },

        findLast: function findLast(predicate, context, notSetValue) {
          return this.toKeyedSeq().reverse().find(predicate, context, notSetValue);
        },

        findLastEntry: function findLastEntry(predicate, context, notSetValue) {
          return this.toKeyedSeq()
            .reverse()
            .findEntry(predicate, context, notSetValue);
        },

        findLastKey: function findLastKey(predicate, context) {
          return this.toKeyedSeq().reverse().findKey(predicate, context);
        },

        first: function first(notSetValue) {
          return this.find(returnTrue, null, notSetValue);
        },

        flatMap: function flatMap(mapper, context) {
          return reify(this, flatMapFactory(this, mapper, context));
        },

        flatten: function flatten(depth) {
          return reify(this, flattenFactory(this, depth, true));
        },

        fromEntrySeq: function fromEntrySeq() {
          return new FromEntriesSequence(this);
        },

        get: function get(searchKey, notSetValue) {
          return this.find(function (_, key) { return is(key, searchKey); }, undefined, notSetValue);
        },

        getIn: getIn,

        groupBy: function groupBy(grouper, context) {
          return groupByFactory(this, grouper, context);
        },

        has: function has(searchKey) {
          return this.get(searchKey, NOT_SET) !== NOT_SET;
        },

        hasIn: hasIn,

        isSubset: function isSubset(iter) {
          iter = typeof iter.includes === 'function' ? iter : Collection(iter);
          return this.every(function (value) { return iter.includes(value); });
        },

        isSuperset: function isSuperset(iter) {
          iter = typeof iter.isSubset === 'function' ? iter : Collection(iter);
          return iter.isSubset(this);
        },

        keyOf: function keyOf(searchValue) {
          return this.findKey(function (value) { return is(value, searchValue); });
        },

        keySeq: function keySeq() {
          return this.toSeq().map(keyMapper).toIndexedSeq();
        },

        last: function last(notSetValue) {
          return this.toSeq().reverse().first(notSetValue);
        },

        lastKeyOf: function lastKeyOf(searchValue) {
          return this.toKeyedSeq().reverse().keyOf(searchValue);
        },

        max: function max(comparator) {
          return maxFactory(this, comparator);
        },

        maxBy: function maxBy(mapper, comparator) {
          return maxFactory(this, comparator, mapper);
        },

        min: function min(comparator) {
          return maxFactory(
            this,
            comparator ? neg(comparator) : defaultNegComparator
          );
        },

        minBy: function minBy(mapper, comparator) {
          return maxFactory(
            this,
            comparator ? neg(comparator) : defaultNegComparator,
            mapper
          );
        },

        rest: function rest() {
          return this.slice(1);
        },

        skip: function skip(amount) {
          return amount === 0 ? this : this.slice(Math.max(0, amount));
        },

        skipLast: function skipLast(amount) {
          return amount === 0 ? this : this.slice(0, -Math.max(0, amount));
        },

        skipWhile: function skipWhile(predicate, context) {
          return reify(this, skipWhileFactory(this, predicate, context, true));
        },

        skipUntil: function skipUntil(predicate, context) {
          return this.skipWhile(not(predicate), context);
        },

        sortBy: function sortBy(mapper, comparator) {
          return reify(this, sortFactory(this, comparator, mapper));
        },

        take: function take(amount) {
          return this.slice(0, Math.max(0, amount));
        },

        takeLast: function takeLast(amount) {
          return this.slice(-Math.max(0, amount));
        },

        takeWhile: function takeWhile(predicate, context) {
          return reify(this, takeWhileFactory(this, predicate, context));
        },

        takeUntil: function takeUntil(predicate, context) {
          return this.takeWhile(not(predicate), context);
        },

        update: function update(fn) {
          return fn(this);
        },

        valueSeq: function valueSeq() {
          return this.toIndexedSeq();
        },

        // ### Hashable Object

        hashCode: function hashCode() {
          return this.__hash || (this.__hash = hashCollection(this));
        },

        // ### Internal

        // abstract __iterate(fn, reverse)

        // abstract __iterator(type, reverse)
      });

      var CollectionPrototype = Collection.prototype;
      CollectionPrototype[IS_COLLECTION_SYMBOL] = true;
      CollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.values;
      CollectionPrototype.toJSON = CollectionPrototype.toArray;
      CollectionPrototype.__toStringMapper = quoteString;
      CollectionPrototype.inspect = CollectionPrototype.toSource = function () {
        return this.toString();
      };
      CollectionPrototype.chain = CollectionPrototype.flatMap;
      CollectionPrototype.contains = CollectionPrototype.includes;

      mixin(KeyedCollection, {
        // ### More sequential methods

        flip: function flip() {
          return reify(this, flipFactory(this));
        },

        mapEntries: function mapEntries(mapper, context) {
          var this$1$1 = this;

          var iterations = 0;
          return reify(
            this,
            this.toSeq()
              .map(function (v, k) { return mapper.call(context, [k, v], iterations++, this$1$1); })
              .fromEntrySeq()
          );
        },

        mapKeys: function mapKeys(mapper, context) {
          var this$1$1 = this;

          return reify(
            this,
            this.toSeq()
              .flip()
              .map(function (k, v) { return mapper.call(context, k, v, this$1$1); })
              .flip()
          );
        },
      });

      var KeyedCollectionPrototype = KeyedCollection.prototype;
      KeyedCollectionPrototype[IS_KEYED_SYMBOL] = true;
      KeyedCollectionPrototype[ITERATOR_SYMBOL] = CollectionPrototype.entries;
      KeyedCollectionPrototype.toJSON = toObject;
      KeyedCollectionPrototype.__toStringMapper = function (v, k) { return quoteString(k) + ': ' + quoteString(v); };

      mixin(IndexedCollection, {
        // ### Conversion to other types

        toKeyedSeq: function toKeyedSeq() {
          return new ToKeyedSequence(this, false);
        },

        // ### ES6 Collection methods (ES6 Array and Map)

        filter: function filter(predicate, context) {
          return reify(this, filterFactory(this, predicate, context, false));
        },

        findIndex: function findIndex(predicate, context) {
          var entry = this.findEntry(predicate, context);
          return entry ? entry[0] : -1;
        },

        indexOf: function indexOf(searchValue) {
          var key = this.keyOf(searchValue);
          return key === undefined ? -1 : key;
        },

        lastIndexOf: function lastIndexOf(searchValue) {
          var key = this.lastKeyOf(searchValue);
          return key === undefined ? -1 : key;
        },

        reverse: function reverse() {
          return reify(this, reverseFactory(this, false));
        },

        slice: function slice(begin, end) {
          return reify(this, sliceFactory(this, begin, end, false));
        },

        splice: function splice(index, removeNum /*, ...values*/) {
          var numArgs = arguments.length;
          removeNum = Math.max(removeNum || 0, 0);
          if (numArgs === 0 || (numArgs === 2 && !removeNum)) {
            return this;
          }
          // If index is negative, it should resolve relative to the size of the
          // collection. However size may be expensive to compute if not cached, so
          // only call count() if the number is in fact negative.
          index = resolveBegin(index, index < 0 ? this.count() : this.size);
          var spliced = this.slice(0, index);
          return reify(
            this,
            numArgs === 1
              ? spliced
              : spliced.concat(arrCopy(arguments, 2), this.slice(index + removeNum))
          );
        },

        // ### More collection methods

        findLastIndex: function findLastIndex(predicate, context) {
          var entry = this.findLastEntry(predicate, context);
          return entry ? entry[0] : -1;
        },

        first: function first(notSetValue) {
          return this.get(0, notSetValue);
        },

        flatten: function flatten(depth) {
          return reify(this, flattenFactory(this, depth, false));
        },

        get: function get(index, notSetValue) {
          index = wrapIndex(this, index);
          return index < 0 ||
            this.size === Infinity ||
            (this.size !== undefined && index > this.size)
            ? notSetValue
            : this.find(function (_, key) { return key === index; }, undefined, notSetValue);
        },

        has: function has(index) {
          index = wrapIndex(this, index);
          return (
            index >= 0 &&
            (this.size !== undefined
              ? this.size === Infinity || index < this.size
              : this.indexOf(index) !== -1)
          );
        },

        interpose: function interpose(separator) {
          return reify(this, interposeFactory(this, separator));
        },

        interleave: function interleave(/*...collections*/) {
          var collections = [this].concat(arrCopy(arguments));
          var zipped = zipWithFactory(this.toSeq(), IndexedSeq.of, collections);
          var interleaved = zipped.flatten(true);
          if (zipped.size) {
            interleaved.size = zipped.size * collections.length;
          }
          return reify(this, interleaved);
        },

        keySeq: function keySeq() {
          return Range(0, this.size);
        },

        last: function last(notSetValue) {
          return this.get(-1, notSetValue);
        },

        skipWhile: function skipWhile(predicate, context) {
          return reify(this, skipWhileFactory(this, predicate, context, false));
        },

        zip: function zip(/*, ...collections */) {
          var collections = [this].concat(arrCopy(arguments));
          return reify(this, zipWithFactory(this, defaultZipper, collections));
        },

        zipAll: function zipAll(/*, ...collections */) {
          var collections = [this].concat(arrCopy(arguments));
          return reify(this, zipWithFactory(this, defaultZipper, collections, true));
        },

        zipWith: function zipWith(zipper /*, ...collections */) {
          var collections = arrCopy(arguments);
          collections[0] = this;
          return reify(this, zipWithFactory(this, zipper, collections));
        },
      });

      var IndexedCollectionPrototype = IndexedCollection.prototype;
      IndexedCollectionPrototype[IS_INDEXED_SYMBOL] = true;
      IndexedCollectionPrototype[IS_ORDERED_SYMBOL] = true;

      mixin(SetCollection, {
        // ### ES6 Collection methods (ES6 Array and Map)

        get: function get(value, notSetValue) {
          return this.has(value) ? value : notSetValue;
        },

        includes: function includes(value) {
          return this.has(value);
        },

        // ### More sequential methods

        keySeq: function keySeq() {
          return this.valueSeq();
        },
      });

      var SetCollectionPrototype = SetCollection.prototype;
      SetCollectionPrototype.has = CollectionPrototype.includes;
      SetCollectionPrototype.contains = SetCollectionPrototype.includes;
      SetCollectionPrototype.keys = SetCollectionPrototype.values;

      // Mixin subclasses

      mixin(KeyedSeq, KeyedCollectionPrototype);
      mixin(IndexedSeq, IndexedCollectionPrototype);
      mixin(SetSeq, SetCollectionPrototype);

      // #pragma Helper functions

      function reduce(collection, reducer, reduction, context, useFirst, reverse) {
        assertNotInfinite(collection.size);
        collection.__iterate(function (v, k, c) {
          if (useFirst) {
            useFirst = false;
            reduction = v;
          } else {
            reduction = reducer.call(context, reduction, v, k, c);
          }
        }, reverse);
        return reduction;
      }

      function keyMapper(v, k) {
        return k;
      }

      function entryMapper(v, k) {
        return [k, v];
      }

      function not(predicate) {
        return function () {
          return !predicate.apply(this, arguments);
        };
      }

      function neg(predicate) {
        return function () {
          return -predicate.apply(this, arguments);
        };
      }

      function defaultZipper() {
        return arrCopy(arguments);
      }

      function defaultNegComparator(a, b) {
        return a < b ? 1 : a > b ? -1 : 0;
      }

      function hashCollection(collection) {
        if (collection.size === Infinity) {
          return 0;
        }
        var ordered = isOrdered(collection);
        var keyed = isKeyed(collection);
        var h = ordered ? 1 : 0;
        var size = collection.__iterate(
          keyed
            ? ordered
              ? function (v, k) {
                  h = (31 * h + hashMerge(hash(v), hash(k))) | 0;
                }
              : function (v, k) {
                  h = (h + hashMerge(hash(v), hash(k))) | 0;
                }
            : ordered
            ? function (v) {
                h = (31 * h + hash(v)) | 0;
              }
            : function (v) {
                h = (h + hash(v)) | 0;
              }
        );
        return murmurHashOfSize(size, h);
      }

      function murmurHashOfSize(size, h) {
        h = imul(h, 0xcc9e2d51);
        h = imul((h << 15) | (h >>> -15), 0x1b873593);
        h = imul((h << 13) | (h >>> -13), 5);
        h = ((h + 0xe6546b64) | 0) ^ size;
        h = imul(h ^ (h >>> 16), 0x85ebca6b);
        h = imul(h ^ (h >>> 13), 0xc2b2ae35);
        h = smi(h ^ (h >>> 16));
        return h;
      }

      function hashMerge(a, b) {
        return (a ^ (b + 0x9e3779b9 + (a << 6) + (a >> 2))) | 0; // int
      }

      var OrderedSet = /*@__PURE__*/(function (Set) {
        function OrderedSet(value) {
          return value === null || value === undefined
            ? emptyOrderedSet()
            : isOrderedSet(value)
            ? value
            : emptyOrderedSet().withMutations(function (set) {
                var iter = SetCollection(value);
                assertNotInfinite(iter.size);
                iter.forEach(function (v) { return set.add(v); });
              });
        }

        if ( Set ) OrderedSet.__proto__ = Set;
        OrderedSet.prototype = Object.create( Set && Set.prototype );
        OrderedSet.prototype.constructor = OrderedSet;

        OrderedSet.of = function of (/*...values*/) {
          return this(arguments);
        };

        OrderedSet.fromKeys = function fromKeys (value) {
          return this(KeyedCollection(value).keySeq());
        };

        OrderedSet.prototype.toString = function toString () {
          return this.__toString('OrderedSet {', '}');
        };

        return OrderedSet;
      }(Set$1));

      OrderedSet.isOrderedSet = isOrderedSet;

      var OrderedSetPrototype = OrderedSet.prototype;
      OrderedSetPrototype[IS_ORDERED_SYMBOL] = true;
      OrderedSetPrototype.zip = IndexedCollectionPrototype.zip;
      OrderedSetPrototype.zipWith = IndexedCollectionPrototype.zipWith;
      OrderedSetPrototype.zipAll = IndexedCollectionPrototype.zipAll;

      OrderedSetPrototype.__empty = emptyOrderedSet;
      OrderedSetPrototype.__make = makeOrderedSet;

      function makeOrderedSet(map, ownerID) {
        var set = Object.create(OrderedSetPrototype);
        set.size = map ? map.size : 0;
        set._map = map;
        set.__ownerID = ownerID;
        return set;
      }

      var EMPTY_ORDERED_SET;
      function emptyOrderedSet() {
        return (
          EMPTY_ORDERED_SET || (EMPTY_ORDERED_SET = makeOrderedSet(emptyOrderedMap()))
        );
      }

      function fromJS(value, converter) {
        return fromJSWith(
          [],
          converter || defaultConverter,
          value,
          '',
          converter && converter.length > 2 ? [] : undefined,
          { '': value }
        );
      }

      function fromJSWith(stack, converter, value, key, keyPath, parentValue) {
        if (
          typeof value !== 'string' &&
          !isImmutable(value) &&
          (isArrayLike(value) || hasIterator(value) || isPlainObject(value))
        ) {
          if (~stack.indexOf(value)) {
            throw new TypeError('Cannot convert circular structure to Immutable');
          }
          stack.push(value);
          keyPath && key !== '' && keyPath.push(key);
          var converted = converter.call(
            parentValue,
            key,
            Seq(value).map(function (v, k) { return fromJSWith(stack, converter, v, k, keyPath, value); }
            ),
            keyPath && keyPath.slice()
          );
          stack.pop();
          keyPath && keyPath.pop();
          return converted;
        }
        return value;
      }

      function defaultConverter(k, v) {
        // Effectively the opposite of "Collection.toSeq()"
        return isIndexed(v) ? v.toList() : isKeyed(v) ? v.toMap() : v.toSet();
      }

      const img = new Image();
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
      function overrideDragImage(dateTransfer) {
        dateTransfer.setDragImage(img, 0, 0);
      }
      function getNodeExecutor(node) {
        if (node.type === "html-element") {
          return `html-element:${node.name}`;
        }
        if (node.type === "react-component") {
          return `react_component:${node.packageName}:${node.packageVersion}:${node.exportName}`;
        }
        return "";
      }
      function useBehaviorSubjectState(subject) {
        const [state, setState] = useState(subject.value);
        useEffect(() => {
          const subscription = subject.subscribe(setState);
          return () => {
            subscription.unsubscribe();
          };
        }, [subject]);
        return state;
      }
      function jsonParse(json) {
        try {
          return JSON.parse(json);
        } catch (error) {
          return;
        }
      }
      function moveNode({ rootNode, nodeID, greenZone }) {
        let _rootNode = rootNode;
        const nodeToMoveKeyPath = byArbitrary(rootNode, nodeID);
        if (!nodeToMoveKeyPath) {
          return;
        }
        const nodeToMove = rootNode.getIn(nodeToMoveKeyPath);
        if (!nodeToMove) {
          return;
        }
        _rootNode = removeIn(rootNode, nodeToMoveKeyPath);
        return insertNode({ rootNode: _rootNode, node: nodeToMove, greenZone });
      }
      function insertNode({ rootNode, node, greenZone }) {
        if (greenZone.type === "fallback-contour-green-zone") {
          return _appendTo(rootNode, rootNode.getIn(["id"]), node);
        }
        if (greenZone.type === "node_without_children" && (greenZone.position === "inner" || greenZone.position === "inner-left" || greenZone.position === "inner-right")) {
          return _appendTo(rootNode, greenZone.contour.id, node);
        }
        if (greenZone.type === "node_without_children" && greenZone.position === "left") {
          return _insertLeftSiblingTo(rootNode, greenZone.contour.id, node);
        }
        if (greenZone.type === "node_without_children" && greenZone.position === "right") {
          return _insertRightSiblingTo(rootNode, greenZone.contour.id, node);
        }
        if (greenZone.type === "adjacent-with-parent" && greenZone.edge === "left") {
          return _insertLeftSiblingTo(rootNode, greenZone.child.id, node);
        }
        if (greenZone.type === "adjacent-with-parent" && greenZone.edge === "right") {
          return _insertRightSiblingTo(rootNode, greenZone.child.id, node);
        }
        if (greenZone.type !== "between-nodes") {
          return;
        }
        if (greenZone.left.absolutePosition.height < greenZone.right.absolutePosition.height) {
          return _insertRightSiblingTo(rootNode, greenZone.left.id, node);
        }
        if (greenZone.left.absolutePosition.height > greenZone.right.absolutePosition.height) {
          return _insertLeftSiblingTo(rootNode, greenZone.right.id, node);
        }
        return _insertRightSiblingTo(rootNode, greenZone.left.id, node);
      }
      function regenerateNodeID(node) {
        node.id = generateNodeId(node.type);
        return node;
      }
      function duplicateNode(node) {
        const newNode = travel(node, {
          htmlNode: (current) => regenerateNodeID(current),
          reactComponentNode: (current) => regenerateNodeID(current),
          loopContainerNode: (current) => regenerateNodeID(current),
          composedNode: (current) => regenerateNodeID(current),
          refNode: (current) => regenerateNodeID(current),
          jsxNode: (current) => regenerateNodeID(current),
          routeNode: (current) => regenerateNodeID(current)
        });
        return newNode;
      }
      function getDropRequest(dataTransfer) {
        const draggingNodeID = dataTransfer.getData(DND_DATA_TRANSFER_TYPE_NODE_ID);
        if (draggingNodeID) {
          return { type: "move_node_request", nodeID: draggingNodeID };
        }
        const droppedNode = jsonParse(dataTransfer.getData(DND_DATA_TRANSFER_TYPE_ARTERY_NODE));
        if (droppedNode) {
          return { type: "insert_node_request", node: duplicateNode(droppedNode) };
        }
        return;
      }

      function useHTMLNodeProps(node, ctx, depth) {
        const props = useInstantiateProps(node, ctx);
        const [ref, setRef] = useState();
        const layerCtx = useContext(context_default);
        useEffect(() => {
          if (ref) {
            register(ref, layerCtx);
          }
          return () => {
            if (ref) {
              unregister(ref, layerCtx);
            }
          };
        }, [ref]);
        return {
          ...props,
          ref: (_ref) => _ref && setRef(_ref),
          "data-simulator-node-id": node.id,
          "data-simulator-node-depth": depth,
          "data-simulator-node-executor": getNodeExecutor(node)
        };
      }

      function EmptyPlaceholder() {
        return /* @__PURE__ */ React.createElement("div", null, "\u8BF7\u62D6\u62FD\u7EC4\u4EF6\u5230\u6B64\u5904\uFF01");
      }
      function Placeholder() {
        return React.createElement("div", { className: "placeholder-for-container-node-children" }, React.createElement(EmptyPlaceholder));
      }
      var placeholder_default = Placeholder;

      const isNodeSupportChildrenCache = /* @__PURE__ */ new Map();
      new BehaviorSubject(Set$1());
      function _cacheIsNodeSupportChildren(node, isSupport) {
        const cacheKey = getNodeExecutor(node);
        isNodeSupportChildrenCache.set(cacheKey, isSupport);
      }
      function _checkIfNodeSupportChildren(node) {
        return isNodeSupportChildrenCache.get(getNodeExecutor(node));
      }
      function _checkIfNodeIsModalLayer(node) {
        if (node.type !== "react-component") {
          return false;
        }
        return !!window.__OVER_LAYER_COMPONENTS.find(({ packageName, exportName }) => {
          return exportName === node.exportName && packageName === node.packageName;
        });
      }

      const contourNodesReport$ = new BehaviorSubject(void 0);
      const cursor$ = new Subject();
      const draggingArteryImmutableNode$ = new BehaviorSubject(void 0);
      const draggingNodeID$ = new BehaviorSubject("");
      const hoveringContourNode$ = new Subject();
      const hoveringParentID$ = new BehaviorSubject("");
      const inDnd$ = new BehaviorSubject(false);
      const latestFocusedGreenZone$ = new BehaviorSubject(void 0);
      const modalLayerContourNodesReport$ = new BehaviorSubject(void 0);
      const onDropEvent$ = new Subject();
      const dummyArtery = {
        node: { id: DUMMY_ARTERY_ROOT_NODE_ID, type: "html-element", name: "div" }
      };
      const immutableRoot$ = new BehaviorSubject(fromJS({ id: "initial", type: "html", nam: "div" }));
      const artery$ = new BehaviorSubject(dummyArtery);
      const activeNode$ = new BehaviorSubject(void 0);
      const activeContour$ = new BehaviorSubject(void 0);
      const activeOverLayerNodeID$ = new BehaviorSubject(void 0);
      const activeContourToolbarStyle$ = new BehaviorSubject(void 0);
      const activeOverLayerArtery$ = new BehaviorSubject(void 0);
      const rootNodID$ = immutableRoot$.pipe(map$1((node) => node.getIn(["id"])), distinctUntilChanged());
      const dropResult$ = onDropEvent$.pipe(filter$1(() => !!latestFocusedGreenZone$.value), map$1((e) => getDropRequest(e.dataTransfer)), filter$1((request) => !!request), map$1((dropRequest) => {
        if (!latestFocusedGreenZone$.value) {
          return;
        }
        if (dropRequest.type === "move_node_request") {
          return moveNode({
            rootNode: immutableRoot$.value,
            nodeID: dropRequest.nodeID,
            greenZone: latestFocusedGreenZone$.value
          });
        }
        if (dropRequest.type === "insert_node_request" && dropRequest.node.type === "react-component" && _checkIfNodeIsModalLayer(dropRequest.node)) {
          const firstLevelChildren = (immutableRoot$.value.getIn(["children"]) || List()).push(dropRequest.node);
          return setIn$1(immutableRoot$.value, ["children"], firstLevelChildren);
        }
        if (dropRequest.type === "insert_node_request") {
          return insertNode({
            rootNode: immutableRoot$.value,
            node: dropRequest.node,
            greenZone: latestFocusedGreenZone$.value
          });
        }
      }), map$1((newRoot) => newRoot ? newRoot.toJS() : void 0), filter$1((newRoot) => !!newRoot));
      function useArteryRootNodeID() {
        const [rootNodeID, setRootNodeID] = useState("");
        useEffect(() => {
          const subscription = rootNodID$.subscribe(setRootNodeID);
          return () => {
            subscription.unsubscribe();
          };
        }, []);
        return rootNodeID;
      }
      artery$.pipe(map$1((artery) => fromJS(artery.node))).subscribe(immutableRoot$);
      draggingNodeID$.pipe(map$1((draggingNodeID) => {
        if (!draggingNodeID) {
          return void 0;
        }
        return byArbitrary(immutableRoot$.value, draggingNodeID);
      })).subscribe(draggingArteryImmutableNode$);
      combineLatest({ artery: artery$, activeOverLayerNodeID: activeOverLayerNodeID$ }).pipe(map$1(({ activeOverLayerNodeID }) => {
        if (!activeOverLayerNodeID) {
          return void 0;
        }
        const keyPath = byArbitrary(immutableRoot$.value, activeOverLayerNodeID);
        if (!keyPath) {
          return void 0;
        }
        const _node = immutableRoot$.value.getIn(keyPath);
        return _node.toJS();
      }), map$1((node) => {
        if (!node) {
          return void 0;
        }
        return {
          node,
          apiStateSpec: artery$.value.apiStateSpec,
          sharedStatesSpec: artery$.value.sharedStatesSpec
        };
      })).subscribe(activeOverLayerArtery$);
      combineLatest({
        activeNode: activeNode$,
        contourNodesReport: contourNodesReport$,
        modalLayerContourNodesReport: modalLayerContourNodesReport$,
        activeOverLayerNodeID: activeOverLayerNodeID$
      }).pipe(map$1(({ activeNode, contourNodesReport, modalLayerContourNodesReport, activeOverLayerNodeID }) => {
        if (activeOverLayerNodeID) {
          return modalLayerContourNodesReport == null ? void 0 : modalLayerContourNodesReport.find(({ id }) => id === (activeNode == null ? void 0 : activeNode.id));
        }
        return contourNodesReport == null ? void 0 : contourNodesReport.find(({ id }) => id === (activeNode == null ? void 0 : activeNode.id));
      }), distinctUntilChanged((p, c) => (p == null ? void 0 : p.id) === (c == null ? void 0 : c.id))).subscribe(activeContour$);
      activeContour$.pipe(filter$1((n) => !!n), map$1(({ absolutePosition, relativeRect }) => {
        const { x, y, height } = absolutePosition;
        if ((relativeRect == null ? void 0 : relativeRect.y) < 40) {
          return {
            transform: `translate(${x + 4}px, ${y + height}px)`
          };
        }
        return {
          transform: `translate(${x + 4}px, ${y}px)`
        };
      })).subscribe(activeContourToolbarStyle$);

      const messenger = new Messenger(window.parent, "iframe-side");
      messenger.waitForReady().then(() => {
      }).catch(noop);
      messenger.listen(MESSAGE_TYPE_ARTERY).subscribe(artery$);
      messenger.listen(MESSAGE_TYPE_ACTIVE_NODE).pipe(distinctUntilChanged((previous, current) => (previous == null ? void 0 : previous.id) === (current == null ? void 0 : current.id))).subscribe(activeNode$);
      messenger.listen(MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID).subscribe(activeOverLayerNodeID$);
      function setActiveNode(node) {
        messenger.send(MESSAGE_TYPE_ACTIVE_NODE, node);
      }
      function onChangeArtery(artery) {
        messenger.send(MESSAGE_TYPE_ARTERY, artery);
      }
      function checkNodeIsContainer(node) {
        return messenger.request(MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN, node);
      }
      dropResult$.subscribe((node) => {
        onChangeArtery({ ...artery$.value, node });
      });

      function asyncCheckIfNodeSupportChildren(node) {
        const flag = _checkIfNodeSupportChildren(node);
        if (flag !== void 0) {
          return Promise.resolve(flag);
        }
        return checkNodeIsContainer(node).then((isSupportChildren) => {
          _cacheIsNodeSupportChildren(node, isSupportChildren);
          return isSupportChildren;
        });
      }
      function toNodePrimary(node) {
        if (node.type === "html-element") {
          return { type: "html-element", name: node.name };
        }
        return {
          type: "react-component",
          packageName: node.packageName,
          packageVersion: node.packageVersion,
          exportName: node.exportName
        };
      }
      function useNodeBehaviorCheck(node) {
        const [loading, setLoading] = useState(true);
        useEffect(() => {
          let unMounting = false;
          asyncCheckIfNodeSupportChildren(toNodePrimary(node)).then(() => {
            if (!unMounting) {
              setLoading(false);
            }
          }).catch(noop);
          return () => {
            unMounting = true;
          };
        }, []);
        return loading;
      }

      function HTMLNodeRender({ node, ctx }) {
        const currentDepth = useContext(depth_context_default) + 1;
        const props = useHTMLNodeProps(node, ctx, currentDepth);
        const loading = useNodeBehaviorCheck(node);
        if (loading) {
          return null;
        }
        if (!node.name) {
          logger.error("name property is required in html node spec,", `please check the spec of node: ${node.id}.`);
          return null;
        }
        if (!node.children || !node.children.length) {
          return React.createElement(node.name, props, _checkIfNodeSupportChildren(node) ? React.createElement(placeholder_default, { parent: node }) : void 0);
        }
        return React.createElement(depth_context_default.Provider, { value: currentDepth }, React.createElement(node.name, props, React.createElement(children_render_default, { nodes: node.children || [], ctx })));
      }
      var html_node_render_default = HTMLNodeRender;

      const observerInit = { childList: true };
      function mutationCallback(setChildElement) {
        return (mutationsList) => {
          for (const { type, target } of mutationsList) {
            if (type !== "childList") {
              return;
            }
            if (target.nodeType !== Node.ELEMENT_NODE) {
              return;
            }
            const firstChild = target.firstElementChild;
            if (!firstChild) {
              return;
            }
            setChildElement(firstChild);
          }
        };
      }
      function useFirstElementChild(parentElement) {
        const [childElement, setChildElement] = useState(() => {
          if (parentElement == null ? void 0 : parentElement.firstElementChild) {
            return parentElement == null ? void 0 : parentElement.firstElementChild;
          }
          return null;
        });
        useEffect(() => {
          if (!parentElement) {
            return;
          }
          if (parentElement.firstElementChild) {
            setChildElement(parentElement.firstElementChild);
          }
          const observer = new MutationObserver(mutationCallback(setChildElement));
          observer.observe(parentElement, observerInit);
          return () => {
            observer.disconnect();
          };
        }, [parentElement]);
        return childElement;
      }

      function useComponentWrapperRef(node, depth) {
        const [wrapperElement, setWrapperElement] = useState();
        const childElement = useFirstElementChild(wrapperElement);
        const latestChildElementRef = useRef();
        const layerCtx = useContext(context_default);
        useEffect(() => {
          if (latestChildElementRef.current) {
            unregister(latestChildElementRef.current, layerCtx);
          }
          if (!childElement) {
            return;
          }
          childElement.dataset.simulatorNodeId = node.id;
          childElement.dataset.simulatorNodeExecutor = getNodeExecutor(node);
          childElement.dataset.simulatorNodeDepth = `${depth}`;
          register(childElement, layerCtx);
          latestChildElementRef.current = childElement;
          return () => {
            if (childElement) {
              unregister(childElement, layerCtx);
            }
          };
        }, [childElement]);
        return setWrapperElement;
      }

      function useComponentNodeProps(node, ctx, depth) {
        const nodeProps = useInstantiateProps(node, ctx);
        const setWrapperElement = useComponentWrapperRef(node, depth);
        return {
          nodeProps,
          wrapperProps: {
            style: { display: "contents" },
            ref: setWrapperElement
          }
        };
      }
      var use_component_props_default = useComponentNodeProps;

      class HandleNodeRenderErrorBoundary extends React.Component {
        static getDerivedStateFromError() {
          return { hasError: true };
        }
        constructor(props) {
          super(props);
          this.state = { hasError: false };
        }
        componentDidCatch(error, errorInfo) {
          logger.error("failed to render component:", error);
        }
        render() {
          if (this.state.hasError) {
            return null;
          }
          return this.props.children;
        }
      }

      function ReactComponentNodeRender({ node, ctx }) {
        const currentDepth = useContext(depth_context_default) + 1;
        const { nodeProps, wrapperProps } = use_component_props_default(node, ctx, currentDepth);
        const nodeComponent = useNodeComponent(node, ctx.plugins);
        const loading = useNodeBehaviorCheck(node);
        const isLayerRoot = currentDepth === 1;
        if (loading || !nodeComponent) {
          return null;
        }
        if (!isLayerRoot && _checkIfNodeIsModalLayer(node)) {
          return null;
        }
        if (isLayerRoot && _checkIfNodeIsModalLayer(node)) {
          nodeProps.isOpen = true;
          nodeProps.container = "inside";
        }
        if (!node.children || !node.children.length) {
          return React.createElement(HandleNodeRenderErrorBoundary, {}, React.createElement("div", wrapperProps, React.createElement(nodeComponent, nodeProps, _checkIfNodeSupportChildren(node) ? React.createElement(placeholder_default, { parent: node }) : void 0)));
        }
        return React.createElement(depth_context_default.Provider, { value: currentDepth }, React.createElement(HandleNodeRenderErrorBoundary, {}, React.createElement("div", wrapperProps, React.createElement(nodeComponent, nodeProps, React.createElement(children_render_default, { nodes: node.children || [], ctx })))));
      }
      var react_component_render_default = ReactComponentNodeRender;

      function ComposeNodeRender({ node, ctx }) {
        var _a;
        const nodes = node.nodes || node.children;
        if (((_a = node.outLayer) == null ? void 0 : _a.type) === "html-element") {
          const _outLayerNode = {
            ...node.outLayer,
            children: node.nodes || node.children
          };
          React.createElement(html_node_render_default, { node: _outLayerNode, ctx });
        }
        return React.createElement(children_render_default, { nodes, ctx });
      }

      function LoopContainerNodeRender({ node, ctx }) {
        return React.createElement(node_render_default, { node: node.node, ctx });
      }
      var loop_container_node_render_default = LoopContainerNodeRender;

      function NodeRender({ node, ctx }) {
        const currentDepth = useContext(depth_context_default);
        if (node.type === "route-node" || node.type === "jsx-node" || node.type === "ref-node") {
          logger.debug("simulator skip render unsupported node:", node);
          return null;
        }
        if (node.type === "html-element") {
          return React.createElement(depth_context_default.Provider, { value: currentDepth }, React.createElement(html_node_render_default, { node, ctx }));
        }
        if (node.type === "react-component") {
          return React.createElement(depth_context_default.Provider, { value: currentDepth }, React.createElement(react_component_render_default, { node, ctx }));
        }
        if (node.type === "composed-node") {
          return React.createElement(ComposeNodeRender, { node, ctx });
        }
        if (node.type === "loop-container") {
          return React.createElement(loop_container_node_render_default, { node, ctx });
        }
        return null;
      }
      var node_render_default = NodeRender;

      const monitoredElements$1 = new BehaviorSubject(/* @__PURE__ */ new Set());
      function RenderLayer$1({ artery }) {
        const { ctx, rootNode } = useBootResult(artery, plugins) || {};
        const onReport = useCallback((report) => modalLayerContourNodesReport$.next(report), []);
        useElementsRadar(onReport);
        if (!ctx || !rootNode) {
          return null;
        }
        return /* @__PURE__ */ React.createElement("div", {
          className: "simulator-background-layer"
        }, /* @__PURE__ */ React.createElement(node_render_default, {
          node: rootNode,
          ctx
        }));
      }
      function ModalLayerRender() {
        const modalLayerArtery = useBehaviorSubjectState(activeOverLayerArtery$);
        if (!modalLayerArtery) {
          return null;
        }
        return /* @__PURE__ */ React.createElement(context_default.Provider, {
          value: monitoredElements$1
        }, /* @__PURE__ */ React.createElement(RenderLayer$1, {
          artery: modalLayerArtery
        }));
      }
      var modal_layer_render_default = ModalLayerRender;

      const monitoredElements = new BehaviorSubject(/* @__PURE__ */ new Set());
      function RenderLayer({ rootElement }) {
        const artery = useBehaviorSubjectState(artery$);
        const { ctx, rootNode } = useBootResult(artery, plugins) || {};
        const onReport = useCallback((report) => contourNodesReport$.next(report), []);
        useElementsRadar(onReport, rootElement);
        if (!ctx || !rootNode) {
          return null;
        }
        return /* @__PURE__ */ React.createElement(node_render_default, {
          node: rootNode,
          ctx
        });
      }
      function RootLayerRenderLayer() {
        const [rootElement, setRootElement] = useState();
        return /* @__PURE__ */ React.createElement(context_default.Provider, {
          value: monitoredElements
        }, /* @__PURE__ */ React.createElement("div", {
          className: "simulator-background-layer",
          ref: (ref) => {
            if (ref) {
              setRootElement(ref);
            }
          }
        }, rootElement && /* @__PURE__ */ React.createElement(RenderLayer, {
          rootElement
        })));
      }

      function Background() {
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(RootLayerRenderLayer, null), /* @__PURE__ */ React.createElement(modal_layer_render_default, null));
      }
      var background_default = Background;

      function useContourNodeStyle({ depth, absolutePosition }) {
        const { height, width, x, y } = absolutePosition;
        return useMemo(() => {
          return {
            zIndex: depth,
            height,
            width,
            transform: `translate(${x}px, ${y}px)`
          };
        }, [height, width, x, y, depth]);
      }

      function useShouldHandleDndCallback(currentID) {
        const isDraggingParent = useRef();
        const draggingNodeID = useBehaviorSubjectState(draggingNodeID$);
        const draggingNode = useBehaviorSubjectState(draggingArteryImmutableNode$);
        return useCallback((e) => {
          if (e.dataTransfer.types.includes("artery_node")) {
            return true;
          }
          if (!draggingNodeID || !draggingNode) {
            return false;
          }
          if (draggingNodeID === currentID) {
            return false;
          }
          if (isDraggingParent.current === void 0) {
            isDraggingParent.current = !!byArbitrary(draggingNode, currentID);
          }
          return !isDraggingParent.current;
        }, [draggingNodeID, draggingNode]);
      }

      function preventDefault$1(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      function useWhetherActive(currentID) {
        const [flag, setFlag] = useState(false);
        useEffect(() => {
          const subscription = activeContour$.pipe(map$1((activeContour) => (activeContour == null ? void 0 : activeContour.id) === currentID), distinctUntilChanged()).subscribe(setFlag);
          return () => {
            subscription.unsubscribe();
          };
        }, []);
        return flag;
      }
      function RenderContourNode({ contourNode }) {
        const hoveringParentID = useBehaviorSubjectState(hoveringParentID$);
        const rootNodeID = useArteryRootNodeID();
        const style = useContourNodeStyle(contourNode);
        const _shouldHandleDnd = useShouldHandleDndCallback(contourNode.id);
        const currentActive = useWhetherActive(contourNode.id);
        const [isDragging, setIsDragging] = useState(false);
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
          id: `contour-${contourNode.id}`,
          style,
          onClick: () => {
            const keyPath = byArbitrary(immutableRoot$.value, contourNode.id);
            if (!keyPath) {
              return;
            }
            const n = immutableRoot$.value.getIn(keyPath);
            if (!n) {
              return;
            }
            setActiveNode(n.toJS());
          },
          draggable: contourNode.id !== rootNodeID,
          onDragStart: (e) => {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData(DND_DATA_TRANSFER_TYPE_NODE_ID, contourNode.id);
            draggingNodeID$.next(contourNode.id);
            setIsDragging(true);
            overrideDragImage(e.dataTransfer);
          },
          onDragEnd: () => {
            draggingNodeID$.next("");
            setIsDragging(false);
            inDnd$.next(false);
          },
          onDragOver: (e) => {
            if (!_shouldHandleDnd(e)) {
              return;
            }
            inDnd$.next(true);
            preventDefault$1(e);
            cursor$.next({ x: e.clientX, y: e.clientY });
          },
          onDrag: (e) => {
            preventDefault$1(e);
            inDnd$.next(true);
          },
          onDragEnter: (e) => {
            if (!_shouldHandleDnd(e)) {
              return;
            }
            hoveringContourNode$.next(contourNode);
            preventDefault$1(e);
            return false;
          },
          onDragLeave: () => {
            inDnd$.next(false);
          },
          onDrop: (e) => {
            preventDefault$1(e);
            onDropEvent$.next(e);
            inDnd$.next(false);
            return false;
          },
          className: cs("contour-node", {
            "contour-node--root": rootNodeID === contourNode.id,
            "contour-node--active": currentActive,
            "contour-node--hover-as-parent": hoveringParentID === contourNode.id,
            "contour-node--dragging": isDragging
          })
        }));
      }
      var render_contour_node_default = RenderContourNode;

      function ParentNodes({ currentNodeID, onParentClick }) {
        const artery = useBehaviorSubjectState(artery$);
        const [parents, setParents] = useState([]);
        useEffect(() => {
          const parentIDs = parentIdsSeq(immutableRoot$.value, currentNodeID);
          if (!parentIDs) {
            return;
          }
          const _parents = parentIDs.map((parentID) => {
            const keyPath = keyPathById(immutableRoot$.value, parentID);
            if (!keyPath) {
              return;
            }
            return immutableRoot$.value.getIn(keyPath);
          }).filter((parentNode) => {
            if (!parentNode) {
              return false;
            }
            const parentNodeType = parentNode.getIn(["type"]);
            return parentNodeType === "html-element" || parentNodeType === "react-component";
          }).toJS();
          setParents((_parents == null ? void 0 : _parents.reverse().slice(0, 5)) || []);
        }, [artery]);
        if (!parents.length) {
          return null;
        }
        return /* @__PURE__ */ React.createElement("div", {
          className: "active-node-parents"
        }, parents.map((parent) => {
          const { id, label } = parent;
          return /* @__PURE__ */ React.createElement("span", {
            key: id,
            className: "active-node-parents__parent",
            onMouseEnter: () => {
              hoveringParentID$.next(id);
            },
            onMouseLeave: () => {
              hoveringParentID$.next("");
            },
            onClick: (e) => {
              e.stopPropagation();
              hoveringParentID$.next("");
              setActiveNode(parent);
              onParentClick();
            }
          }, label || id);
        }));
      }
      var parent_nodes_default = ParentNodes;

      function useNodeLabel(node) {
        return useMemo(() => {
          if (!node) {
            return "untitled";
          }
          if (node.label) {
            return node == null ? void 0 : node.label;
          }
          if ("exportName" in node) {
            return node.exportName.toUpperCase();
          }
          if ("name" in node) {
            return node.name.toUpperCase();
          }
          return node.id;
        }, [node]);
      }

      const modifiers = [
        {
          name: "offset",
          options: {
            offset: [0, 4]
          }
        }
      ];
      function ContourNodeToolbar() {
        const activeNode = useBehaviorSubjectState(activeNode$);
        const activeContour = useBehaviorSubjectState(activeContour$);
        const { referenceRef, Popper, handleMouseEnter, handleMouseLeave, close } = usePopper();
        const containerRef = useRef(null);
        const style = useBehaviorSubjectState(activeContourToolbarStyle$);
        const activeNodeLabel = useNodeLabel(activeNode);
        const rootNodeID = useArteryRootNodeID();
        function handleDelete() {
          if (!activeContour$.value) {
            return;
          }
          const newRoot = deleteByID(artery$.value.node, activeContour$.value.id);
          onChangeArtery({ ...artery$.value, node: newRoot });
          setActiveNode(void 0);
        }
        function handleDuplicate() {
          if (!activeNode) {
            return;
          }
          const newNode = duplicateNode(activeNode);
          const newRoot = insertAfter(artery$.value.node, activeNode.id, newNode);
          if (!newRoot) {
            return;
          }
          onChangeArtery({ ...artery$.value, node: newRoot });
        }
        if (!activeContour || activeContour.id === rootNodeID) {
          return null;
        }
        return /* @__PURE__ */ React.createElement("div", {
          ref: containerRef,
          className: "active-contour-node-toolbar",
          style
        }, /* @__PURE__ */ React.createElement("span", {
          ref: referenceRef,
          className: "active-contour-node-toolbar__parents",
          onMouseEnter: handleMouseEnter(),
          onMouseLeave: handleMouseLeave()
        }, activeNodeLabel), /* @__PURE__ */ React.createElement("span", {
          onClick: handleDuplicate,
          className: "active-contour-node-toolbar__action",
          title: "\u590D\u5236"
        }, /* @__PURE__ */ React.createElement(Icon, {
          name: "content_copy",
          size: 16
        })), /* @__PURE__ */ React.createElement("span", {
          onClick: handleDelete,
          className: "active-contour-node-toolbar__action",
          title: "\u5220\u9664"
        }, /* @__PURE__ */ React.createElement(Icon, {
          name: "delete_forever",
          size: 16
        })), /* @__PURE__ */ React.createElement(Popper, {
          placement: "bottom-start",
          modifiers,
          container: containerRef.current
        }, /* @__PURE__ */ React.createElement(parent_nodes_default, {
          currentNodeID: activeContour.id,
          onParentClick: close
        })));
      }
      var toolbar_default = ContourNodeToolbar;

      function preventDefault(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
      const fallbackContourStyle = {
        height: "100vh",
        width: "100vw",
        position: "fixed"
      };
      function FallbackContourNode() {
        const [hovering, setHovering] = useState(false);
        useEffect(() => {
          if (!hovering) {
            return;
          }
          latestFocusedGreenZone$.next({ type: "fallback-contour-green-zone" });
        }, [hovering]);
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
          id: FALLBACK_CONTOUR_NODE_ID,
          style: fallbackContourStyle,
          className: cs("contour-node", {
            "green-zone-between-nodes--focused": hovering,
            "green-zone-between-nodes": hovering
          }),
          onDragOver: (e) => {
            preventDefault(e);
            inDnd$.next(true);
            preventDefault(e);
            cursor$.next({ x: e.clientX, y: e.clientY });
          },
          onDragEnter: (e) => {
            preventDefault(e);
            setHovering(true);
            hoveringContourNode$.next(FALLBACK_CONTOUR);
            preventDefault(e);
            return false;
          },
          onDragLeave: () => {
            setHovering(false);
            inDnd$.next(false);
          },
          onDrop: (e) => {
            preventDefault(e);
            onDropEvent$.next(e);
            inDnd$.next(false);
            setHovering(false);
            return false;
          }
        }));
      }
      var fallback_contour_default = FallbackContourNode;

      var css$1 = ".contour-nodes {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n}\n\n.contour-node {\n  position: absolute;\n  top: 0;\n  border-width: 1px;\n  border-color: transparent;\n}\n.contour-node:hover:not(.contour-node--root, .contour-node--active) {\n  outline: 1px dashed #0084ff;\n}\n\n.contour-node--active {\n  box-shadow: inset 0 0 0 2px #0084ff;\n}\n\n.contour-node--hover-as-parent {\n  border-color: #f85900;\n  border-style: dashed;\n}\n\n.contour-node--dragging {\n  opacity: 0.7;\n  background-color: white;\n}\n\n.active-contour-node-toolbar {\n  position: absolute;\n  display: flex;\n  align-items: center;\n  top: -30px;\n  z-index: 1;\n}\n.active-contour-node-toolbar .active-contour-node-toolbar__parents,\n.active-contour-node-toolbar .active-contour-node-toolbar__action {\n  padding: 4px;\n  margin-right: 4px;\n  color: white;\n  font-size: 12px;\n  border-radius: 1px;\n  background-color: #0084ff;\n}\n.active-contour-node-toolbar .active-contour-node-toolbar__parents {\n  display: inline-block;\n  max-width: 150px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.active-contour-node-toolbar .active-contour-node-toolbar__action {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  fill: white;\n}\n\n.active-node-parents {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: flex-start;\n}\n.active-node-parents .active-node-parents__parent {\n  max-width: 200px;\n  padding: 4px;\n  margin-bottom: 4px;\n  color: white;\n  background-color: #0084ff;\n  border-radius: 4px;\n  font-size: 12px;\n  cursor: pointer;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n.active-node-parents .active-node-parents__parent:hover {\n  background-color: #f85900;\n}";
      n(css$1,{});

      function useContourNodes() {
        const contourNodes = useBehaviorSubjectState(contourNodesReport$) || [];
        const modalLayerContourNodes = useBehaviorSubjectState(modalLayerContourNodesReport$) || [];
        const activeOverLayerNodeID = useBehaviorSubjectState(activeOverLayerNodeID$);
        if (activeOverLayerNodeID) {
          return modalLayerContourNodes || [];
        }
        return contourNodes || [];
      }
      function Foreground() {
        const contourNodes = useContourNodes();
        const hideFallbackContour = useBehaviorSubjectState(activeOverLayerNodeID$);
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
          className: "contour-nodes"
        }, contourNodes.map((contour) => {
          return /* @__PURE__ */ React.createElement(render_contour_node_default, {
            key: `contour-${contour.id}`,
            contourNode: contour
          });
        })), !hideFallbackContour && /* @__PURE__ */ React.createElement(fallback_contour_default, null), /* @__PURE__ */ React.createElement(toolbar_default, null));
      }
      var foreground_default = Foreground;

      function getFirstLevelConcreteChildrenContours(root, nodeID, contourNodes) {
        const nodeKeyPath = byArbitrary(root, nodeID);
        if (!nodeKeyPath) {
          return [];
        }
        const parentNode = root.getIn(nodeKeyPath);
        if (!parentNode) {
          return [];
        }
        const ids = getFirstLevelConcreteChildren(parentNode).map((child) => child.getIn(["id"]));
        return contourNodes.filter(({ id }) => ids.includes(id));
      }
      const MIN_GAP = 2;
      function findRightSiblings(current, allSiblings) {
        return allSiblings.filter((sibling) => {
          if (sibling.id === current.id) {
            return false;
          }
          if (current.raw.x + current.raw.width + MIN_GAP > sibling.raw.x) {
            return false;
          }
          if (current.raw.y > sibling.raw.y + sibling.raw.height) {
            return false;
          }
          if (current.raw.y + current.raw.height < sibling.raw.y) {
            return false;
          }
          return true;
        });
      }
      function toGreenZoneBetweenNodes(current, rightSiblings) {
        return rightSiblings.map((right) => {
          const absolutePosition = {
            x: current.absolutePosition.x + current.absolutePosition.width,
            y: Math.min(current.absolutePosition.y, right.absolutePosition.y),
            width: right.absolutePosition.x - (current.absolutePosition.x + current.absolutePosition.width),
            height: Math.min(Math.abs(current.absolutePosition.y - (right.absolutePosition.y + right.absolutePosition.height)), Math.abs(current.absolutePosition.y + current.absolutePosition.height - right.absolutePosition.y))
          };
          const raw = {
            x: current.raw.x + current.absolutePosition.width,
            y: Math.min(current.raw.y, right.raw.y),
            width: absolutePosition.width,
            height: absolutePosition.height
          };
          return { left: current, right, absolutePosition, type: "between-nodes", raw };
        });
      }
      function hasInterSection(rectA, rectB) {
        const xAxisProjectionReactA = [rectA.x, rectA.x + rectA.width];
        const xAxisProjectionReactB = [rectB.x, rectB.x + rectB.width];
        const yAxisProjectionRectA = [rectA.y, rectA.y + rectA.height];
        const yAxisProjectionRectB = [rectB.y, rectB.y + rectB.height];
        const maxStartX = Math.max(xAxisProjectionReactA[0], xAxisProjectionReactB[0]);
        const minEndX = Math.min(xAxisProjectionReactA[1], xAxisProjectionReactB[1]);
        const maxStartY = Math.max(yAxisProjectionRectA[0], yAxisProjectionRectB[0]);
        const minEndY = Math.min(yAxisProjectionRectA[1], yAxisProjectionRectB[1]);
        return maxStartX < minEndX && maxStartY < minEndY;
      }
      function filterGreenZonesIntersectionWithNode(greenZones, contours) {
        return greenZones.filter(({ absolutePosition }) => {
          const isInterSecting = contours.some((contour) => hasInterSection(contour.absolutePosition, absolutePosition));
          return !isInterSecting;
        });
      }
      function getGreenZonesWithParent(parent, children) {
        const greenZoneBetweenParentLeftEdge = children.map((child) => {
          const raw = {
            x: parent.raw.x,
            y: child.raw.y,
            height: child.absolutePosition.height,
            width: child.absolutePosition.x - parent.absolutePosition.x
          };
          return {
            type: "adjacent-with-parent",
            parent,
            child,
            edge: "left",
            raw,
            absolutePosition: {
              x: parent.absolutePosition.x,
              y: child.absolutePosition.y,
              height: child.absolutePosition.height,
              width: child.absolutePosition.x - parent.absolutePosition.x
            }
          };
        });
        const greenZoneBetweenParentRightEdge = children.map((child) => {
          const X = child.absolutePosition.x + child.absolutePosition.width;
          const raw = {
            x: child.raw.x + child.absolutePosition.width,
            y: child.raw.y,
            height: child.absolutePosition.height,
            width: parent.absolutePosition.x + parent.absolutePosition.width - X
          };
          return {
            raw,
            type: "adjacent-with-parent",
            parent,
            child,
            edge: "right",
            absolutePosition: {
              x: X,
              y: child.absolutePosition.y,
              height: child.absolutePosition.height,
              width: parent.absolutePosition.x + parent.absolutePosition.width - X
            }
          };
        });
        return greenZoneBetweenParentLeftEdge.concat(greenZoneBetweenParentRightEdge).filter((greenZone) => {
          if (greenZone.absolutePosition.height < 4 || greenZone.absolutePosition.width < 4) {
            return false;
          }
          return !children.some(({ absolutePosition }) => hasInterSection(absolutePosition, greenZone.absolutePosition));
        });
      }
      function calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(root, hoveringContour, contourNodes) {
        const firstLevelChildrenContours = getFirstLevelConcreteChildrenContours(root, hoveringContour.id, contourNodes);
        const greenZonesBetweenNodes = firstLevelChildrenContours.map((current) => {
          const rightSiblings = findRightSiblings(current, firstLevelChildrenContours);
          return toGreenZoneBetweenNodes(current, rightSiblings);
        }).reduce((acc, greenZones) => acc.concat(greenZones), []);
        const filteredGreenZones = filterGreenZonesIntersectionWithNode(greenZonesBetweenNodes, firstLevelChildrenContours);
        const greenZonesWithParent = getGreenZonesWithParent(hoveringContour, firstLevelChildrenContours);
        return [...filteredGreenZones, ...greenZonesWithParent];
      }

      function useGreenZoneReport() {
        const [greenZonesBetweenNodes, setGreenZones] = useState([]);
        useEffect(() => {
          const subscription = hoveringContourNode$.pipe(distinctUntilChanged(), audit(() => animationFrames()), map$1((hoveringContourNode) => {
            if (!hoveringContourNode || (hoveringContourNode == null ? void 0 : hoveringContourNode.id) === FALLBACK_CONTOUR_NODE_ID) {
              return [];
            }
            const contourNodes = contourNodesReport$.value;
            if (!(contourNodes == null ? void 0 : contourNodes.length)) {
              return [];
            }
            const hoveringNodeKeyPath = byArbitrary(immutableRoot$.value, hoveringContourNode.id);
            if (!hoveringNodeKeyPath) {
              return [];
            }
            const hoveringArteryNode = immutableRoot$.value.getIn(hoveringNodeKeyPath);
            const hasChild = nodeHasChildNodes(hoveringArteryNode);
            if (!hasChild) {
              return { contour: hoveringContourNode, type: "node_without_children", position: "left" };
            }
            return calcGreenZoneOfHoveringNodeSupportChildrenAndChildrenIsNotEmpty(immutableRoot$.value, hoveringContourNode, contourNodes);
          })).subscribe(setGreenZones);
          return () => {
            subscription.unsubscribe();
          };
        }, []);
        return greenZonesBetweenNodes;
      }

      function calcPosition(X, isSupportChildren, rect) {
        if (!isSupportChildren) {
          return Math.abs(X - rect.x) > rect.width / 2 ? "right" : "left";
        }
        if (X < rect.x + 8) {
          return "left";
        }
        if (X > rect.x + rect.width - 8) {
          return "right";
        }
        return "inner";
      }
      function calcStyle(position, absolutePosition) {
        const { height, width, x, y } = absolutePosition;
        const _height = height - 4;
        const _y = y + 2;
        if (position === "inner") {
          return {
            height: _height,
            width: width - 4,
            transform: `translate(${x + 2}px, ${_y}px)`
          };
        }
        if (position === "left") {
          return {
            height: _height,
            width: "8px",
            transform: `translate(${Math.max(x - 9, 0)}px, ${_y}px)`
          };
        }
        if (position === "right") {
          return {
            height: _height,
            width: "8px",
            transform: `translate(${Math.min(x + width + 2, window.innerWidth - 9)}px, ${_y}px)`
          };
        }
        return;
      }
      function RenderGreenZoneForNodeWithoutChildren({ greenZone }) {
        const [style, setStyle] = useState();
        const isSupportChildren = !!isNodeSupportChildrenCache.get(greenZone.contour.executor);
        useEffect(() => {
          const subscription = cursor$.pipe(audit(() => animationFrames()), map$1(({ x }) => calcPosition(x, isSupportChildren, greenZone.contour.raw)), tap((position) => latestFocusedGreenZone$.next({
            position,
            contour: greenZone.contour,
            type: "node_without_children"
          })), map$1((position) => calcStyle(position, greenZone.contour.absolutePosition))).subscribe(setStyle);
          return () => {
            subscription.unsubscribe();
          };
        }, [greenZone]);
        return /* @__PURE__ */ React.createElement("div", {
          className: "green-zone green-zone-for-node-without-children",
          style
        });
      }

      function isInside(cursor, raw) {
        return cursor.x >= raw.x && cursor.x <= raw.x + raw.width && cursor.y >= raw.y && cursor.y <= raw.y + raw.height;
      }
      function getGreenZoneID(greenZone) {
        if (greenZone.type === "adjacent-with-parent") {
          return `adjacent-${greenZone.parent.id}-${greenZone.child.id}-${greenZone.edge}`;
        }
        return `between-${greenZone.left.id}-${greenZone.right.id}`;
      }
      function useInsideID(greenZones) {
        const [inSideID, setInsideID] = useState("");
        useEffect(() => {
          const subscription = cursor$.pipe(audit$1(() => animationFrames()), map((cursor) => greenZones.filter(({ raw }) => isInside(cursor, raw))), map((greenZones2) => greenZones2.length ? greenZones2[0] : void 0), tap$1((greenZone) => greenZone && latestFocusedGreenZone$.next(greenZone)), map((greenZone) => {
            if (!greenZone) {
              return "";
            }
            return getGreenZoneID(greenZone);
          }), distinctUntilChanged$1()).subscribe(setInsideID);
          return () => {
            subscription.unsubscribe();
          };
        }, [greenZones]);
        return inSideID;
      }
      function RenderGreenZonesBetweenNodes({ greenZones }) {
        const insideID = useInsideID(greenZones);
        return /* @__PURE__ */ React.createElement(React.Fragment, null, greenZones.map((greenZone) => {
          const key = getGreenZoneID(greenZone);
          if (greenZone.type === "between-nodes") {
            const { absolutePosition } = greenZone;
            return /* @__PURE__ */ React.createElement("div", {
              key,
              className: cs("green-zone green-zone-between-nodes", {
                "green-zone-between-nodes--focused": key === insideID
              }),
              style: {
                height: absolutePosition.height,
                width: absolutePosition.width,
                transform: `translate(${absolutePosition.x}px, ${absolutePosition.y}px)`
              }
            });
          }
          return /* @__PURE__ */ React.createElement("div", {
            key,
            className: cs("green-zone green-zone-between-nodes", {
              "green-zone-between-nodes--focused": key === insideID
            }),
            style: {
              height: greenZone.absolutePosition.height,
              width: greenZone.absolutePosition.width,
              transform: `translate(${greenZone.absolutePosition.x}px, ${greenZone.absolutePosition.y}px)`
            }
          });
        }));
      }

      function useInDnd() {
        const [flag, setFlag] = useState(false);
        useEffect(() => {
          const subscription = inDnd$.pipe(distinctUntilChanged()).subscribe(setFlag);
          return () => {
            subscription.unsubscribe();
          };
        }, []);
        return flag;
      }
      function GreenZone() {
        const greenZoneReport = useGreenZoneReport();
        const inDnd = useInDnd();
        if (!inDnd || !greenZoneReport) {
          return null;
        }
        if (Array.isArray(greenZoneReport)) {
          return /* @__PURE__ */ React.createElement(RenderGreenZonesBetweenNodes, {
            greenZones: greenZoneReport
          });
        }
        return /* @__PURE__ */ React.createElement(RenderGreenZoneForNodeWithoutChildren, {
          greenZone: greenZoneReport
        });
      }
      var green_zone_default = GreenZone;

      var css = "html,\nbody {\n  width: 100%;\n  height: auto;\n}\n\n* {\n  box-sizing: border-box;\n}\n\n.simulator-background-layer {\n  position: relative;\n  z-index: 0;\n}\n\n.artery-simulator-root--modal-open {\n  height: 100vh;\n  overflow: hidden;\n}\n\n.green-zone {\n  top: 0;\n  position: absolute;\n  will-change: width, height, transform;\n}\n\n.green-zone-for-node-without-children {\n  background-color: rgba(0, 128, 0, 0.3607843137);\n  outline: 1px solid #008000;\n}\n\n.green-zone-between-nodes {\n  outline: 1px dashed #008000;\n}\n\n.green-zone-between-nodes--focused {\n  background-color: rgba(0, 128, 0, 0.3607843137);\n}\n\n.placeholder-for-container-node-children {\n  padding: 8px;\n  color: #94a3b8;\n  text-align: center;\n  background-color: #f8fafc;\n}";
      n(css,{});

      function Simulator() {
        const rootNodeID = useArteryRootNodeID();
        if (rootNodeID === DUMMY_ARTERY_ROOT_NODE_ID) {
          return null;
        }
        return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(background_default, null), /* @__PURE__ */ React.createElement(green_zone_default, null), /* @__PURE__ */ React.createElement(foreground_default, null));
      }
      const iframeAppRoot = document.createElement("div");
      document.body.appendChild(iframeAppRoot);
      ReactDOM.render(/* @__PURE__ */ React.createElement(Simulator, null), iframeAppRoot);

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXgtNTliNzhkZDQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9jb250ZXh0LnRzIiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9iYWNrZ3JvdW5kL3VzZS1yYWRhci1yZWYudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9iYWNrZ3JvdW5kL25vZGUtcmVuZGVyL2NoaWxkcmVuLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9ub2RlLXJlbmRlci9kZXB0aC1jb250ZXh0LnRzIiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9iYWNrZ3JvdW5kL25vZGUtcmVuZGVyL2hvb2tzL3VzZS1lbGVtZW50LXJlZ2lzdHJhdGlvbi50cyIsIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9pbW11dGFibGVANC4wLjAvbm9kZV9tb2R1bGVzL2ltbXV0YWJsZS9kaXN0L2ltbXV0YWJsZS5lcy5qcyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2JhY2tncm91bmQvbm9kZS1yZW5kZXIvaG9va3MvdXNlLWh0bWwtbm9kZS1wcm9wcy50cyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9ub2RlLXJlbmRlci9wbGFjZWhvbGRlci50c3giLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2NhY2hlLnRzIiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9zdGF0ZXMtY2VudGVyLnRzIiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9icmlkZ2UudHMiLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2JhY2tncm91bmQvbm9kZS1yZW5kZXIvaG9va3MvdXNlLW5vZGUtYmVoYXZpb3ItY2hlY2sudHMiLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2JhY2tncm91bmQvbm9kZS1yZW5kZXIvaHRtbC1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9ub2RlLXJlbmRlci9ob29rcy91c2UtZmlyc3QtZWxlbWVudC1jaGlsZC50cyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9ub2RlLXJlbmRlci9ob29rcy91c2UtY29tcG9uZW50LXdyYXBwZXItcmVmLnRzIiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9iYWNrZ3JvdW5kL25vZGUtcmVuZGVyL2hvb2tzL3VzZS1jb21wb25lbnQtcHJvcHMudHMiLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2JhY2tncm91bmQvbm9kZS1yZW5kZXIvZXJyb3ItYm91bmRhcnkudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9iYWNrZ3JvdW5kL25vZGUtcmVuZGVyL3JlYWN0LWNvbXBvbmVudC1yZW5kZXIudHMiLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2JhY2tncm91bmQvbm9kZS1yZW5kZXIvY29tcG9zZS1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9ub2RlLXJlbmRlci9sb29wLWNvbnRhaW5lci1ub2RlLXJlbmRlci50cyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9ub2RlLXJlbmRlci9pbmRleC50cyIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9tb2RhbC1sYXllci1yZW5kZXIudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9iYWNrZ3JvdW5kL3Jvb3QtbGF5ZXItcmVuZGVyLnRzeCIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvYmFja2dyb3VuZC9pbmRleC50c3giLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2ZvcmVncm91bmQvdXNlLWFjdGl2ZS1jb250b3VyLW5vZGUtc3R5bGUudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9mb3JlZ3JvdW5kL3VzZS1zaG91bGQtaGFuZGxlLWRuZC1jYWxsYmFjay50c3giLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2ZvcmVncm91bmQvcmVuZGVyLWNvbnRvdXItbm9kZS50c3giLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2ZvcmVncm91bmQvdG9vbGJhci9wYXJlbnQtbm9kZXMudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9mb3JlZ3JvdW5kL3Rvb2xiYXIvdXNlLW5vZGUtbGFiZWwudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9mb3JlZ3JvdW5kL3Rvb2xiYXIvaW5kZXgudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9mb3JlZ3JvdW5kL2ZhbGxiYWNrLWNvbnRvdXIudHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9mb3JlZ3JvdW5kL2luZGV4LnRzeCIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvZ3JlZW4tem9uZS9ncmVlbi16b25lLWhlbHBlcnMudHMiLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2dyZWVuLXpvbmUvdXNlLWdyZWVuLXpvbmUtcmVwb3J0LnRzIiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9ncmVlbi16b25lL3JlbmRlci1ncmVlbi16b25lLWZvci1ub2RlLXdpdGhvdXQtY2hpbGRyZW4udHN4IiwiLi4vLi4vLi4vc3JjL3NpbXVsYXRvci9ncmVlbi16b25lL3JlbmRlci1ncmVlbi16b25lcy1iZXR3ZWVuLW5vZGVzLnRzeCIsIi4uLy4uLy4uL3NyYy9zaW11bGF0b3IvZ3JlZW4tem9uZS9pbmRleC50c3giLCIuLi8uLi8uLi9zcmMvc2ltdWxhdG9yL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmNvbnN0IE1vbml0b3JlZEVsZW1lbnRzQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQ8QmVoYXZpb3JTdWJqZWN0PFNldDxIVE1MRWxlbWVudD4+PihcbiAgbmV3IEJlaGF2aW9yU3ViamVjdDxTZXQ8SFRNTEVsZW1lbnQ+PihuZXcgU2V0PEhUTUxFbGVtZW50PigpKSxcbik7XG5cbmV4cG9ydCBkZWZhdWx0IE1vbml0b3JlZEVsZW1lbnRzQ29udGV4dDtcbiIsImltcG9ydCB7IHVzZVJlZiwgdXNlRWZmZWN0LCB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IEVsZW1lbnRzUmFkYXIsIHsgUmVwb3J0IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2VsZW1lbnRzLXJhZGFyJztcbmltcG9ydCB7IG1hcCwgZmlsdGVyIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBDb250b3VyTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcbmltcG9ydCBNb25pdG9yZWRFbGVtZW50c0NvbnRleHQgZnJvbSAnLi9jb250ZXh0JztcblxuZnVuY3Rpb24gZ2VuZXJhdGVDb250b3VyTm9kZVJlcG9ydChyZXBvcnQ6IFJlcG9ydCwgcm9vdDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQpOiBDb250b3VyTm9kZVtdIHtcbiAgLy8gdG9kbyBidWcsIHdoeSBjb250b3VyIGlkIGhhcyBkdXBsaWNhdGU/XG4gIGNvbnN0IERVUExJQ0FURV9DT05UT1VSX0lEID0gbmV3IFNldDxzdHJpbmc+KCk7XG5cbiAgcmV0dXJuIEFycmF5LmZyb20ocmVwb3J0LmVudHJpZXMoKSlcbiAgICAubWFwKChbZWxlbWVudCwgeyByZWxhdGl2ZVJlY3QsIHJhdyB9XSkgPT4ge1xuICAgICAgY29uc3QgaWQgPSBlbGVtZW50LmRhdGFzZXQuc2ltdWxhdG9yTm9kZUlkO1xuICAgICAgaWYgKCFpZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChEVVBMSUNBVEVfQ09OVE9VUl9JRC5oYXMoaWQpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERVUExJQ0FURV9DT05UT1VSX0lELmFkZChpZCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlcHRoID0gcGFyc2VJbnQoZWxlbWVudC5kYXRhc2V0LnNpbXVsYXRvck5vZGVEZXB0aCB8fCAnMCcpIHx8IDA7XG4gICAgICBjb25zdCB7IHg6IG9mZnNldFgsIHk6IG9mZnNldFkgfSA9IGRvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlkLFxuICAgICAgICBkZXB0aCxcbiAgICAgICAgcmF3LFxuICAgICAgICByZWxhdGl2ZVJlY3QsXG4gICAgICAgIGV4ZWN1dG9yOiBlbGVtZW50LmRhdGFzZXQuc2ltdWxhdG9yTm9kZUV4ZWN1dG9yIHx8ICcnLFxuICAgICAgICBhYnNvbHV0ZVBvc2l0aW9uOiB7XG4gICAgICAgICAgaGVpZ2h0OiByZWxhdGl2ZVJlY3QuaGVpZ2h0LFxuICAgICAgICAgIHdpZHRoOiByZWxhdGl2ZVJlY3Qud2lkdGgsXG4gICAgICAgICAgLy8gd2hlbiByb290IGlzIHVuZGVmaW5lLCB0aGUgY29tcGFyaW5nIHJvb3Qgd2lsbCBiZSB2aWV3cG9ydCxcbiAgICAgICAgICAvLyB0aGUgcmVsYXRpdmVSZWN0IGlzIHJlbGF0aXZlIHRvIHZpZXdwb3J0LFxuICAgICAgICAgIHg6IHJvb3QgPyByZWxhdGl2ZVJlY3QueCA6IHJlbGF0aXZlUmVjdC54IC0gb2Zmc2V0WCxcbiAgICAgICAgICB5OiByb290ID8gcmVsYXRpdmVSZWN0LnkgOiByZWxhdGl2ZVJlY3QueSAtIG9mZnNldFksXG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0pXG4gICAgLmZpbHRlcigobik6IG4gaXMgQ29udG91ck5vZGUgPT4gISFuKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRWxlbWVudHNSYWRhcihcbiAgb25SZXBvcnQ6IChyZXBvcnQ/OiBDb250b3VyTm9kZVtdKSA9PiB2b2lkLFxuICByb290PzogSFRNTEVsZW1lbnQsXG4pOiBSZWFjdC5NdXRhYmxlUmVmT2JqZWN0PEVsZW1lbnRzUmFkYXIgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3QgbW9uaXRvcmVkRWxlbWVudHMkID0gdXNlQ29udGV4dChNb25pdG9yZWRFbGVtZW50c0NvbnRleHQpO1xuICBjb25zdCByYWRhclJlZiA9IHVzZVJlZjxFbGVtZW50c1JhZGFyPigpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3QgcmFkYXIgPSBuZXcgRWxlbWVudHNSYWRhcihyb290KTtcbiAgICByYWRhclJlZi5jdXJyZW50ID0gcmFkYXI7XG5cbiAgICBtb25pdG9yZWRFbGVtZW50cyRcbiAgICAgIC5waXBlKGZpbHRlcigoZWxlbWVudHMpID0+ICEhZWxlbWVudHMuc2l6ZSkpXG4gICAgICAuc3Vic2NyaWJlKChlbGVtZW50cykgPT4gcmFkYXIudHJhY2soQXJyYXkuZnJvbShlbGVtZW50cykpKTtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHJhZGFyXG4gICAgICAuZ2V0UmVwb3J0JCgpXG4gICAgICAucGlwZShtYXA8UmVwb3J0LCBDb250b3VyTm9kZVtdPigocmVwb3J0KSA9PiBnZW5lcmF0ZUNvbnRvdXJOb2RlUmVwb3J0KHJlcG9ydCwgcm9vdCkpKVxuICAgICAgLnN1YnNjcmliZShvblJlcG9ydCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW3Jvb3RdKTtcblxuICByZXR1cm4gcmFkYXJSZWY7XG59XG4iLCJpbXBvcnQgeyBBcnRlcnlOb2RlLCBDVFggfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXJlbmRlcmVyJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vaW5kZXgnO1xuXG5pbnRlcmZhY2UgQ2hpbGRyZW5SZW5kZXJQcm9wcyB7XG4gIG5vZGVzOiBBcnRlcnlOb2RlW107XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBDaGlsZHJlblJlbmRlcih7IG5vZGVzLCBjdHggfTogQ2hpbGRyZW5SZW5kZXJQcm9wcyk6IFJlYWN0LlJlYWN0RWxlbWVudCB8IG51bGwge1xuICBpZiAoIW5vZGVzLmxlbmd0aCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgUmVhY3QuRnJhZ21lbnQsXG4gICAgbnVsbCxcbiAgICAvLyB3aHkgY29uY2F0IGluZGV4IG9uIGVsZW1lbnQga2V5P1xuICAgIC8vIGh0dHBzOi8vcmVhY3Rqcy5vcmcvZG9jcy9yZWNvbmNpbGlhdGlvbi5odG1sI3JlY3Vyc2luZy1vbi1jaGlsZHJlblxuICAgIC8vIHdlIGRlcGVuZGVkIG9uIG5vZGUgbW91bnQvdW5tb3VudCB0byB1cGRhdGUgbW9uaXRvcmVkRWxlbWVudHMkLFxuICAgIC8vIGFkZCBpbmRleCB0byBub2RlIGtleSB0byBmb3JjZSBpdCByZS1yZW5kZXJcbiAgICBub2Rlcy5tYXAoKG5vZGUsIGkpID0+IFJlYWN0LmNyZWF0ZUVsZW1lbnQoTm9kZVJlbmRlciwgeyBrZXk6IGAke25vZGUuaWR9LSR7aX1gLCBub2RlOiBub2RlLCBjdHggfSkpLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBDaGlsZHJlblJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmNvbnN0IERlcHRoQ29udGV4dCA9IFJlYWN0LmNyZWF0ZUNvbnRleHQ8bnVtYmVyPigwKTtcblxuZXhwb3J0IGRlZmF1bHQgRGVwdGhDb250ZXh0O1xuIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlcihlbGVtZW50OiBIVE1MRWxlbWVudCwgbW9uaXRvcmVkRWxlbWVudHMkOiBCZWhhdmlvclN1YmplY3Q8U2V0PEhUTUxFbGVtZW50Pj4pOiB2b2lkIHtcbiAgY29uc3QgbW9uaXRvcmVkRWxlbWVudHMgPSBtb25pdG9yZWRFbGVtZW50cyQudmFsdWU7XG4gIG1vbml0b3JlZEVsZW1lbnRzJC5uZXh0KG1vbml0b3JlZEVsZW1lbnRzLmFkZChlbGVtZW50KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bnJlZ2lzdGVyKFxuICBlbGVtZW50OiBIVE1MRWxlbWVudCxcbiAgbW9uaXRvcmVkRWxlbWVudHMkOiBCZWhhdmlvclN1YmplY3Q8U2V0PEhUTUxFbGVtZW50Pj4sXG4pOiB2b2lkIHtcbiAgY29uc3QgbW9uaXRvcmVkRWxlbWVudHMgPSBtb25pdG9yZWRFbGVtZW50cyQudmFsdWU7XG4gIG1vbml0b3JlZEVsZW1lbnRzLmRlbGV0ZShlbGVtZW50KTtcbiAgbW9uaXRvcmVkRWxlbWVudHMkLm5leHQobW9uaXRvcmVkRWxlbWVudHMpO1xufVxuIiwiLyoqXG4gKiBNSVQgTGljZW5zZVxuICogXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgTGVlIEJ5cm9uIGFuZCBvdGhlciBjb250cmlidXRvcnMuXG4gKiBcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIFxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xudmFyIERFTEVURSA9ICdkZWxldGUnO1xuXG4vLyBDb25zdGFudHMgZGVzY3JpYmluZyB0aGUgc2l6ZSBvZiB0cmllIG5vZGVzLlxudmFyIFNISUZUID0gNTsgLy8gUmVzdWx0ZWQgaW4gYmVzdCBwZXJmb3JtYW5jZSBhZnRlciBfX19fX18/XG52YXIgU0laRSA9IDEgPDwgU0hJRlQ7XG52YXIgTUFTSyA9IFNJWkUgLSAxO1xuXG4vLyBBIGNvbnNpc3RlbnQgc2hhcmVkIHZhbHVlIHJlcHJlc2VudGluZyBcIm5vdCBzZXRcIiB3aGljaCBlcXVhbHMgbm90aGluZyBvdGhlclxuLy8gdGhhbiBpdHNlbGYsIGFuZCBub3RoaW5nIHRoYXQgY291bGQgYmUgcHJvdmlkZWQgZXh0ZXJuYWxseS5cbnZhciBOT1RfU0VUID0ge307XG5cbi8vIEJvb2xlYW4gcmVmZXJlbmNlcywgUm91Z2ggZXF1aXZhbGVudCBvZiBgYm9vbCAmYC5cbmZ1bmN0aW9uIE1ha2VSZWYoKSB7XG4gIHJldHVybiB7IHZhbHVlOiBmYWxzZSB9O1xufVxuXG5mdW5jdGlvbiBTZXRSZWYocmVmKSB7XG4gIGlmIChyZWYpIHtcbiAgICByZWYudmFsdWUgPSB0cnVlO1xuICB9XG59XG5cbi8vIEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIHZhbHVlIHJlcHJlc2VudGluZyBhbiBcIm93bmVyXCIgZm9yIHRyYW5zaWVudCB3cml0ZXNcbi8vIHRvIHRyaWVzLiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgb25seSBldmVyIGVxdWFsIGl0c2VsZiwgYW5kIHdpbGwgbm90IGVxdWFsXG4vLyB0aGUgcmV0dXJuIG9mIGFueSBzdWJzZXF1ZW50IGNhbGwgb2YgdGhpcyBmdW5jdGlvbi5cbmZ1bmN0aW9uIE93bmVySUQoKSB7fVxuXG5mdW5jdGlvbiBlbnN1cmVTaXplKGl0ZXIpIHtcbiAgaWYgKGl0ZXIuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlci5zaXplID0gaXRlci5fX2l0ZXJhdGUocmV0dXJuVHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIGl0ZXIuc2l6ZTtcbn1cblxuZnVuY3Rpb24gd3JhcEluZGV4KGl0ZXIsIGluZGV4KSB7XG4gIC8vIFRoaXMgaW1wbGVtZW50cyBcImlzIGFycmF5IGluZGV4XCIgd2hpY2ggdGhlIEVDTUFTdHJpbmcgc3BlYyBkZWZpbmVzIGFzOlxuICAvL1xuICAvLyAgICAgQSBTdHJpbmcgcHJvcGVydHkgbmFtZSBQIGlzIGFuIGFycmF5IGluZGV4IGlmIGFuZCBvbmx5IGlmXG4gIC8vICAgICBUb1N0cmluZyhUb1VpbnQzMihQKSkgaXMgZXF1YWwgdG8gUCBhbmQgVG9VaW50MzIoUCkgaXMgbm90IGVxdWFsXG4gIC8vICAgICB0byAyXjMy4oiSMS5cbiAgLy9cbiAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWFycmF5LWV4b3RpYy1vYmplY3RzXG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgdmFyIHVpbnQzMkluZGV4ID0gaW5kZXggPj4+IDA7IC8vIE4gPj4+IDAgaXMgc2hvcnRoYW5kIGZvciBUb1VpbnQzMlxuICAgIGlmICgnJyArIHVpbnQzMkluZGV4ICE9PSBpbmRleCB8fCB1aW50MzJJbmRleCA9PT0gNDI5NDk2NzI5NSkge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgaW5kZXggPSB1aW50MzJJbmRleDtcbiAgfVxuICByZXR1cm4gaW5kZXggPCAwID8gZW5zdXJlU2l6ZShpdGVyKSArIGluZGV4IDogaW5kZXg7XG59XG5cbmZ1bmN0aW9uIHJldHVyblRydWUoKSB7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHNpemUpIHtcbiAgcmV0dXJuIChcbiAgICAoKGJlZ2luID09PSAwICYmICFpc05lZyhiZWdpbikpIHx8XG4gICAgICAoc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGJlZ2luIDw9IC1zaXplKSkgJiZcbiAgICAoZW5kID09PSB1bmRlZmluZWQgfHwgKHNpemUgIT09IHVuZGVmaW5lZCAmJiBlbmQgPj0gc2l6ZSkpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSkge1xuICByZXR1cm4gcmVzb2x2ZUluZGV4KGJlZ2luLCBzaXplLCAwKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUVuZChlbmQsIHNpemUpIHtcbiAgcmV0dXJuIHJlc29sdmVJbmRleChlbmQsIHNpemUsIHNpemUpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlSW5kZXgoaW5kZXgsIHNpemUsIGRlZmF1bHRJbmRleCkge1xuICAvLyBTYW5pdGl6ZSBpbmRpY2VzIHVzaW5nIHRoaXMgc2hvcnRoYW5kIGZvciBUb0ludDMyKGFyZ3VtZW50KVxuICAvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9pbnQzMlxuICByZXR1cm4gaW5kZXggPT09IHVuZGVmaW5lZFxuICAgID8gZGVmYXVsdEluZGV4XG4gICAgOiBpc05lZyhpbmRleClcbiAgICA/IHNpemUgPT09IEluZmluaXR5XG4gICAgICA/IHNpemVcbiAgICAgIDogTWF0aC5tYXgoMCwgc2l6ZSArIGluZGV4KSB8IDBcbiAgICA6IHNpemUgPT09IHVuZGVmaW5lZCB8fCBzaXplID09PSBpbmRleFxuICAgID8gaW5kZXhcbiAgICA6IE1hdGgubWluKHNpemUsIGluZGV4KSB8IDA7XG59XG5cbmZ1bmN0aW9uIGlzTmVnKHZhbHVlKSB7XG4gIC8vIEFjY291bnQgZm9yIC0wIHdoaWNoIGlzIG5lZ2F0aXZlLCBidXQgbm90IGxlc3MgdGhhbiAwLlxuICByZXR1cm4gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPT09IC1JbmZpbml0eSk7XG59XG5cbnZhciBJU19DT0xMRUNUSU9OX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX0lURVJBQkxFX19AQCc7XG5cbmZ1bmN0aW9uIGlzQ29sbGVjdGlvbihtYXliZUNvbGxlY3Rpb24pIHtcbiAgcmV0dXJuIEJvb2xlYW4obWF5YmVDb2xsZWN0aW9uICYmIG1heWJlQ29sbGVjdGlvbltJU19DT0xMRUNUSU9OX1NZTUJPTF0pO1xufVxuXG52YXIgSVNfS0VZRURfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfS0VZRURfX0BAJztcblxuZnVuY3Rpb24gaXNLZXllZChtYXliZUtleWVkKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlS2V5ZWQgJiYgbWF5YmVLZXllZFtJU19LRVlFRF9TWU1CT0xdKTtcbn1cblxudmFyIElTX0lOREVYRURfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfSU5ERVhFRF9fQEAnO1xuXG5mdW5jdGlvbiBpc0luZGV4ZWQobWF5YmVJbmRleGVkKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlSW5kZXhlZCAmJiBtYXliZUluZGV4ZWRbSVNfSU5ERVhFRF9TWU1CT0xdKTtcbn1cblxuZnVuY3Rpb24gaXNBc3NvY2lhdGl2ZShtYXliZUFzc29jaWF0aXZlKSB7XG4gIHJldHVybiBpc0tleWVkKG1heWJlQXNzb2NpYXRpdmUpIHx8IGlzSW5kZXhlZChtYXliZUFzc29jaWF0aXZlKTtcbn1cblxudmFyIENvbGxlY3Rpb24gPSBmdW5jdGlvbiBDb2xsZWN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc0NvbGxlY3Rpb24odmFsdWUpID8gdmFsdWUgOiBTZXEodmFsdWUpO1xufTtcblxudmFyIEtleWVkQ29sbGVjdGlvbiA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gS2V5ZWRDb2xsZWN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzS2V5ZWQodmFsdWUpID8gdmFsdWUgOiBLZXllZFNlcSh2YWx1ZSk7XG4gIH1cblxuICBpZiAoIENvbGxlY3Rpb24gKSBLZXllZENvbGxlY3Rpb24uX19wcm90b19fID0gQ29sbGVjdGlvbjtcbiAgS2V5ZWRDb2xsZWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGUgKTtcbiAgS2V5ZWRDb2xsZWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEtleWVkQ29sbGVjdGlvbjtcblxuICByZXR1cm4gS2V5ZWRDb2xsZWN0aW9uO1xufShDb2xsZWN0aW9uKSk7XG5cbnZhciBJbmRleGVkQ29sbGVjdGlvbiA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gSW5kZXhlZENvbGxlY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gaXNJbmRleGVkKHZhbHVlKSA/IHZhbHVlIDogSW5kZXhlZFNlcSh2YWx1ZSk7XG4gIH1cblxuICBpZiAoIENvbGxlY3Rpb24gKSBJbmRleGVkQ29sbGVjdGlvbi5fX3Byb3RvX18gPSBDb2xsZWN0aW9uO1xuICBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIEluZGV4ZWRDb2xsZWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEluZGV4ZWRDb2xsZWN0aW9uO1xuXG4gIHJldHVybiBJbmRleGVkQ29sbGVjdGlvbjtcbn0oQ29sbGVjdGlvbikpO1xuXG52YXIgU2V0Q29sbGVjdGlvbiA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gU2V0Q29sbGVjdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBpc0NvbGxlY3Rpb24odmFsdWUpICYmICFpc0Fzc29jaWF0aXZlKHZhbHVlKSA/IHZhbHVlIDogU2V0U2VxKHZhbHVlKTtcbiAgfVxuXG4gIGlmICggQ29sbGVjdGlvbiApIFNldENvbGxlY3Rpb24uX19wcm90b19fID0gQ29sbGVjdGlvbjtcbiAgU2V0Q29sbGVjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIFNldENvbGxlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2V0Q29sbGVjdGlvbjtcblxuICByZXR1cm4gU2V0Q29sbGVjdGlvbjtcbn0oQ29sbGVjdGlvbikpO1xuXG5Db2xsZWN0aW9uLktleWVkID0gS2V5ZWRDb2xsZWN0aW9uO1xuQ29sbGVjdGlvbi5JbmRleGVkID0gSW5kZXhlZENvbGxlY3Rpb247XG5Db2xsZWN0aW9uLlNldCA9IFNldENvbGxlY3Rpb247XG5cbnZhciBJU19TRVFfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfU0VRX19AQCc7XG5cbmZ1bmN0aW9uIGlzU2VxKG1heWJlU2VxKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlU2VxICYmIG1heWJlU2VxW0lTX1NFUV9TWU1CT0xdKTtcbn1cblxudmFyIElTX1JFQ09SRF9TWU1CT0wgPSAnQEBfX0lNTVVUQUJMRV9SRUNPUkRfX0BAJztcblxuZnVuY3Rpb24gaXNSZWNvcmQobWF5YmVSZWNvcmQpIHtcbiAgcmV0dXJuIEJvb2xlYW4obWF5YmVSZWNvcmQgJiYgbWF5YmVSZWNvcmRbSVNfUkVDT1JEX1NZTUJPTF0pO1xufVxuXG5mdW5jdGlvbiBpc0ltbXV0YWJsZShtYXliZUltbXV0YWJsZSkge1xuICByZXR1cm4gaXNDb2xsZWN0aW9uKG1heWJlSW1tdXRhYmxlKSB8fCBpc1JlY29yZChtYXliZUltbXV0YWJsZSk7XG59XG5cbnZhciBJU19PUkRFUkVEX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX09SREVSRURfX0BAJztcblxuZnVuY3Rpb24gaXNPcmRlcmVkKG1heWJlT3JkZXJlZCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZU9yZGVyZWQgJiYgbWF5YmVPcmRlcmVkW0lTX09SREVSRURfU1lNQk9MXSk7XG59XG5cbnZhciBJVEVSQVRFX0tFWVMgPSAwO1xudmFyIElURVJBVEVfVkFMVUVTID0gMTtcbnZhciBJVEVSQVRFX0VOVFJJRVMgPSAyO1xuXG52YXIgUkVBTF9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcblxudmFyIElURVJBVE9SX1NZTUJPTCA9IFJFQUxfSVRFUkFUT1JfU1lNQk9MIHx8IEZBVVhfSVRFUkFUT1JfU1lNQk9MO1xuXG52YXIgSXRlcmF0b3IgPSBmdW5jdGlvbiBJdGVyYXRvcihuZXh0KSB7XG4gIHRoaXMubmV4dCA9IG5leHQ7XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHJldHVybiAnW0l0ZXJhdG9yXSc7XG59O1xuXG5JdGVyYXRvci5LRVlTID0gSVRFUkFURV9LRVlTO1xuSXRlcmF0b3IuVkFMVUVTID0gSVRFUkFURV9WQUxVRVM7XG5JdGVyYXRvci5FTlRSSUVTID0gSVRFUkFURV9FTlRSSUVTO1xuXG5JdGVyYXRvci5wcm90b3R5cGUuaW5zcGVjdCA9IEl0ZXJhdG9yLnByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5JdGVyYXRvci5wcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIGl0ZXJhdG9yUmVzdWx0KSB7XG4gIHZhciB2YWx1ZSA9IHR5cGUgPT09IDAgPyBrIDogdHlwZSA9PT0gMSA/IHYgOiBbaywgdl07XG4gIGl0ZXJhdG9yUmVzdWx0XG4gICAgPyAoaXRlcmF0b3JSZXN1bHQudmFsdWUgPSB2YWx1ZSlcbiAgICA6IChpdGVyYXRvclJlc3VsdCA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgIH0pO1xuICByZXR1cm4gaXRlcmF0b3JSZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGl0ZXJhdG9yRG9uZSgpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xufVxuXG5mdW5jdGlvbiBoYXNJdGVyYXRvcihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG1heWJlSXRlcmFibGUpKSB7XG4gICAgLy8gSUUxMSB0cmljayBhcyBpdCBkb2VzIG5vdCBzdXBwb3J0IGBTeW1ib2wuaXRlcmF0b3JgXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gISFnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xufVxuXG5mdW5jdGlvbiBpc0l0ZXJhdG9yKG1heWJlSXRlcmF0b3IpIHtcbiAgcmV0dXJuIG1heWJlSXRlcmF0b3IgJiYgdHlwZW9mIG1heWJlSXRlcmF0b3IubmV4dCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3IoaXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGl0ZXJhYmxlKTtcbiAgcmV0dXJuIGl0ZXJhdG9yRm4gJiYgaXRlcmF0b3JGbi5jYWxsKGl0ZXJhYmxlKTtcbn1cblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihpdGVyYWJsZSkge1xuICB2YXIgaXRlcmF0b3JGbiA9XG4gICAgaXRlcmFibGUgJiZcbiAgICAoKFJFQUxfSVRFUkFUT1JfU1lNQk9MICYmIGl0ZXJhYmxlW1JFQUxfSVRFUkFUT1JfU1lNQk9MXSkgfHxcbiAgICAgIGl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpdGVyYXRvckZuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRW50cmllc0l0ZXJhYmxlKG1heWJlSXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xuICByZXR1cm4gaXRlcmF0b3JGbiAmJiBpdGVyYXRvckZuID09PSBtYXliZUl0ZXJhYmxlLmVudHJpZXM7XG59XG5cbmZ1bmN0aW9uIGlzS2V5c0l0ZXJhYmxlKG1heWJlSXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xuICByZXR1cm4gaXRlcmF0b3JGbiAmJiBpdGVyYXRvckZuID09PSBtYXliZUl0ZXJhYmxlLmtleXM7XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIHZhbHVlICYmXG4gICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgIE51bWJlci5pc0ludGVnZXIodmFsdWUubGVuZ3RoKSAmJlxuICAgIHZhbHVlLmxlbmd0aCA+PSAwICYmXG4gICAgKHZhbHVlLmxlbmd0aCA9PT0gMFxuICAgICAgPyAvLyBPbmx5IHtsZW5ndGg6IDB9IGlzIGNvbnNpZGVyZWQgQXJyYXktbGlrZS5cbiAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMVxuICAgICAgOiAvLyBBbiBvYmplY3QgaXMgb25seSBBcnJheS1saWtlIGlmIGl0IGhhcyBhIHByb3BlcnR5IHdoZXJlIHRoZSBsYXN0IHZhbHVlXG4gICAgICAgIC8vIGluIHRoZSBhcnJheS1saWtlIG1heSBiZSBmb3VuZCAod2hpY2ggY291bGQgYmUgdW5kZWZpbmVkKS5cbiAgICAgICAgdmFsdWUuaGFzT3duUHJvcGVydHkodmFsdWUubGVuZ3RoIC0gMSkpXG4gICk7XG59XG5cbnZhciBTZXEgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIFNlcSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGVtcHR5U2VxdWVuY2UoKVxuICAgICAgOiBpc0ltbXV0YWJsZSh2YWx1ZSlcbiAgICAgID8gdmFsdWUudG9TZXEoKVxuICAgICAgOiBzZXFGcm9tVmFsdWUodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBDb2xsZWN0aW9uICkgU2VxLl9fcHJvdG9fXyA9IENvbGxlY3Rpb247XG4gIFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIFNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXE7XG5cbiAgU2VxLnByb3RvdHlwZS50b1NlcSA9IGZ1bmN0aW9uIHRvU2VxICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSB7JywgJ30nKTtcbiAgfTtcblxuICBTZXEucHJvdG90eXBlLmNhY2hlUmVzdWx0ID0gZnVuY3Rpb24gY2FjaGVSZXN1bHQgKCkge1xuICAgIGlmICghdGhpcy5fY2FjaGUgJiYgdGhpcy5fX2l0ZXJhdGVVbmNhY2hlZCkge1xuICAgICAgdGhpcy5fY2FjaGUgPSB0aGlzLmVudHJ5U2VxKCkudG9BcnJheSgpO1xuICAgICAgdGhpcy5zaXplID0gdGhpcy5fY2FjaGUubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBhYnN0cmFjdCBfX2l0ZXJhdGVVbmNhY2hlZChmbiwgcmV2ZXJzZSlcblxuICBTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLl9jYWNoZTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHZhciBzaXplID0gY2FjaGUubGVuZ3RoO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgIT09IHNpemUpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gY2FjaGVbcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKytdO1xuICAgICAgICBpZiAoZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9faXRlcmF0ZVVuY2FjaGVkKGZuLCByZXZlcnNlKTtcbiAgfTtcblxuICAvLyBhYnN0cmFjdCBfX2l0ZXJhdG9yVW5jYWNoZWQodHlwZSwgcmV2ZXJzZSlcblxuICBTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5fY2FjaGU7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICB2YXIgc2l6ZSA9IGNhY2hlLmxlbmd0aDtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaSA9PT0gc2l6ZSkge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW50cnkgPSBjYWNoZVtyZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrK107XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvclVuY2FjaGVkKHR5cGUsIHJldmVyc2UpO1xuICB9O1xuXG4gIHJldHVybiBTZXE7XG59KENvbGxlY3Rpb24pKTtcblxudmFyIEtleWVkU2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoU2VxKSB7XG4gIGZ1bmN0aW9uIEtleWVkU2VxKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlTZXF1ZW5jZSgpLnRvS2V5ZWRTZXEoKVxuICAgICAgOiBpc0NvbGxlY3Rpb24odmFsdWUpXG4gICAgICA/IGlzS2V5ZWQodmFsdWUpXG4gICAgICAgID8gdmFsdWUudG9TZXEoKVxuICAgICAgICA6IHZhbHVlLmZyb21FbnRyeVNlcSgpXG4gICAgICA6IGlzUmVjb3JkKHZhbHVlKVxuICAgICAgPyB2YWx1ZS50b1NlcSgpXG4gICAgICA6IGtleWVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIGlmICggU2VxICkgS2V5ZWRTZXEuX19wcm90b19fID0gU2VxO1xuICBLZXllZFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXEgJiYgU2VxLnByb3RvdHlwZSApO1xuICBLZXllZFNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBLZXllZFNlcTtcblxuICBLZXllZFNlcS5wcm90b3R5cGUudG9LZXllZFNlcSA9IGZ1bmN0aW9uIHRvS2V5ZWRTZXEgKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBLZXllZFNlcTtcbn0oU2VxKSk7XG5cbnZhciBJbmRleGVkU2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoU2VxKSB7XG4gIGZ1bmN0aW9uIEluZGV4ZWRTZXEodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eVNlcXVlbmNlKClcbiAgICAgIDogaXNDb2xsZWN0aW9uKHZhbHVlKVxuICAgICAgPyBpc0tleWVkKHZhbHVlKVxuICAgICAgICA/IHZhbHVlLmVudHJ5U2VxKClcbiAgICAgICAgOiB2YWx1ZS50b0luZGV4ZWRTZXEoKVxuICAgICAgOiBpc1JlY29yZCh2YWx1ZSlcbiAgICAgID8gdmFsdWUudG9TZXEoKS5lbnRyeVNlcSgpXG4gICAgICA6IGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBTZXEgKSBJbmRleGVkU2VxLl9fcHJvdG9fXyA9IFNlcTtcbiAgSW5kZXhlZFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXEgJiYgU2VxLnByb3RvdHlwZSApO1xuICBJbmRleGVkU2VxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEluZGV4ZWRTZXE7XG5cbiAgSW5kZXhlZFNlcS5vZiA9IGZ1bmN0aW9uIG9mICgvKi4uLnZhbHVlcyovKSB7XG4gICAgcmV0dXJuIEluZGV4ZWRTZXEoYXJndW1lbnRzKTtcbiAgfTtcblxuICBJbmRleGVkU2VxLnByb3RvdHlwZS50b0luZGV4ZWRTZXEgPSBmdW5jdGlvbiB0b0luZGV4ZWRTZXEgKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEluZGV4ZWRTZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSBbJywgJ10nKTtcbiAgfTtcblxuICByZXR1cm4gSW5kZXhlZFNlcTtcbn0oU2VxKSk7XG5cbnZhciBTZXRTZXEgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChTZXEpIHtcbiAgZnVuY3Rpb24gU2V0U2VxKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzQ29sbGVjdGlvbih2YWx1ZSkgJiYgIWlzQXNzb2NpYXRpdmUodmFsdWUpID8gdmFsdWUgOiBJbmRleGVkU2VxKHZhbHVlKVxuICAgICkudG9TZXRTZXEoKTtcbiAgfVxuXG4gIGlmICggU2VxICkgU2V0U2VxLl9fcHJvdG9fXyA9IFNlcTtcbiAgU2V0U2VxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFNlcSAmJiBTZXEucHJvdG90eXBlICk7XG4gIFNldFNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXRTZXE7XG5cbiAgU2V0U2VxLm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gU2V0U2VxKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgU2V0U2VxLnByb3RvdHlwZS50b1NldFNlcSA9IGZ1bmN0aW9uIHRvU2V0U2VxICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gU2V0U2VxO1xufShTZXEpKTtcblxuU2VxLmlzU2VxID0gaXNTZXE7XG5TZXEuS2V5ZWQgPSBLZXllZFNlcTtcblNlcS5TZXQgPSBTZXRTZXE7XG5TZXEuSW5kZXhlZCA9IEluZGV4ZWRTZXE7XG5cblNlcS5wcm90b3R5cGVbSVNfU0VRX1NZTUJPTF0gPSB0cnVlO1xuXG4vLyAjcHJhZ21hIFJvb3QgU2VxdWVuY2VzXG5cbnZhciBBcnJheVNlcSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRTZXEpIHtcbiAgZnVuY3Rpb24gQXJyYXlTZXEoYXJyYXkpIHtcbiAgICB0aGlzLl9hcnJheSA9IGFycmF5O1xuICAgIHRoaXMuc2l6ZSA9IGFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIGlmICggSW5kZXhlZFNlcSApIEFycmF5U2VxLl9fcHJvdG9fXyA9IEluZGV4ZWRTZXE7XG4gIEFycmF5U2VxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEluZGV4ZWRTZXEgJiYgSW5kZXhlZFNlcS5wcm90b3R5cGUgKTtcbiAgQXJyYXlTZXEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQXJyYXlTZXE7XG5cbiAgQXJyYXlTZXEucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KSA/IHRoaXMuX2FycmF5W3dyYXBJbmRleCh0aGlzLCBpbmRleCldIDogbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgYXJyYXkgPSB0aGlzLl9hcnJheTtcbiAgICB2YXIgc2l6ZSA9IGFycmF5Lmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgIT09IHNpemUpIHtcbiAgICAgIHZhciBpaSA9IHJldmVyc2UgPyBzaXplIC0gKytpIDogaSsrO1xuICAgICAgaWYgKGZuKGFycmF5W2lpXSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH07XG5cbiAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGFycmF5ID0gdGhpcy5fYXJyYXk7XG4gICAgdmFyIHNpemUgPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGkgPT09IHNpemUpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIGlpID0gcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKys7XG4gICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpaSwgYXJyYXlbaWldKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gQXJyYXlTZXE7XG59KEluZGV4ZWRTZXEpKTtcblxudmFyIE9iamVjdFNlcSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEtleWVkU2VxKSB7XG4gIGZ1bmN0aW9uIE9iamVjdFNlcShvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG4gICAgdGhpcy5fb2JqZWN0ID0gb2JqZWN0O1xuICAgIHRoaXMuX2tleXMgPSBrZXlzO1xuICAgIHRoaXMuc2l6ZSA9IGtleXMubGVuZ3RoO1xuICB9XG5cbiAgaWYgKCBLZXllZFNlcSApIE9iamVjdFNlcS5fX3Byb3RvX18gPSBLZXllZFNlcTtcbiAgT2JqZWN0U2VxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEtleWVkU2VxICYmIEtleWVkU2VxLnByb3RvdHlwZSApO1xuICBPYmplY3RTZXEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gT2JqZWN0U2VxO1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgaWYgKG5vdFNldFZhbHVlICE9PSB1bmRlZmluZWQgJiYgIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX29iamVjdFtrZXldO1xuICB9O1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gaGFzIChrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9vYmplY3QsIGtleSk7XG4gIH07XG5cbiAgT2JqZWN0U2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIG9iamVjdCA9IHRoaXMuX29iamVjdDtcbiAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG4gICAgdmFyIHNpemUgPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgIT09IHNpemUpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW3JldmVyc2UgPyBzaXplIC0gKytpIDogaSsrXTtcbiAgICAgIGlmIChmbihvYmplY3Rba2V5XSwga2V5LCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9O1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICB2YXIgb2JqZWN0ID0gdGhpcy5fb2JqZWN0O1xuICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcbiAgICB2YXIgc2l6ZSA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBpID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpID09PSBzaXplKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBrZXkgPSBrZXlzW3JldmVyc2UgPyBzaXplIC0gKytpIDogaSsrXTtcbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGtleSwgb2JqZWN0W2tleV0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBPYmplY3RTZXE7XG59KEtleWVkU2VxKSk7XG5PYmplY3RTZXEucHJvdG90eXBlW0lTX09SREVSRURfU1lNQk9MXSA9IHRydWU7XG5cbnZhciBDb2xsZWN0aW9uU2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZFNlcSkge1xuICBmdW5jdGlvbiBDb2xsZWN0aW9uU2VxKGNvbGxlY3Rpb24pIHtcbiAgICB0aGlzLl9jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICB0aGlzLnNpemUgPSBjb2xsZWN0aW9uLmxlbmd0aCB8fCBjb2xsZWN0aW9uLnNpemU7XG4gIH1cblxuICBpZiAoIEluZGV4ZWRTZXEgKSBDb2xsZWN0aW9uU2VxLl9fcHJvdG9fXyA9IEluZGV4ZWRTZXE7XG4gIENvbGxlY3Rpb25TZXEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBDb2xsZWN0aW9uU2VxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbGxlY3Rpb25TZXE7XG5cbiAgQ29sbGVjdGlvblNlcS5wcm90b3R5cGUuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiBfX2l0ZXJhdGVVbmNhY2hlZCAoZm4sIHJldmVyc2UpIHtcbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXMuX2NvbGxlY3Rpb247XG4gICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoY29sbGVjdGlvbik7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIGlmIChpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGlmIChmbihzdGVwLnZhbHVlLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICB9O1xuXG4gIENvbGxlY3Rpb25TZXEucHJvdG90eXBlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uIF9faXRlcmF0b3JVbmNhY2hlZCAodHlwZSwgcmV2ZXJzZSkge1xuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcy5fY29sbGVjdGlvbjtcbiAgICB2YXIgaXRlcmF0b3IgPSBnZXRJdGVyYXRvcihjb2xsZWN0aW9uKTtcbiAgICBpZiAoIWlzSXRlcmF0b3IoaXRlcmF0b3IpKSB7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGl0ZXJhdG9yRG9uZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIENvbGxlY3Rpb25TZXE7XG59KEluZGV4ZWRTZXEpKTtcblxuLy8gIyBwcmFnbWEgSGVscGVyIGZ1bmN0aW9uc1xuXG52YXIgRU1QVFlfU0VRO1xuXG5mdW5jdGlvbiBlbXB0eVNlcXVlbmNlKCkge1xuICByZXR1cm4gRU1QVFlfU0VRIHx8IChFTVBUWV9TRVEgPSBuZXcgQXJyYXlTZXEoW10pKTtcbn1cblxuZnVuY3Rpb24ga2V5ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgdmFyIHNlcSA9IG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gIGlmIChzZXEpIHtcbiAgICByZXR1cm4gc2VxLmZyb21FbnRyeVNlcSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RTZXEodmFsdWUpO1xuICB9XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ0V4cGVjdGVkIEFycmF5IG9yIGNvbGxlY3Rpb24gb2JqZWN0IG9mIFtrLCB2XSBlbnRyaWVzLCBvciBrZXllZCBvYmplY3Q6ICcgK1xuICAgICAgdmFsdWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICB2YXIgc2VxID0gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgaWYgKHNlcSkge1xuICAgIHJldHVybiBzZXE7XG4gIH1cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgY29sbGVjdGlvbiBvYmplY3Qgb2YgdmFsdWVzOiAnICsgdmFsdWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gc2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gIHZhciBzZXEgPSBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICBpZiAoc2VxKSB7XG4gICAgcmV0dXJuIGlzRW50cmllc0l0ZXJhYmxlKHZhbHVlKVxuICAgICAgPyBzZXEuZnJvbUVudHJ5U2VxKClcbiAgICAgIDogaXNLZXlzSXRlcmFibGUodmFsdWUpXG4gICAgICA/IHNlcS50b1NldFNlcSgpXG4gICAgICA6IHNlcTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U2VxKHZhbHVlKTtcbiAgfVxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdFeHBlY3RlZCBBcnJheSBvciBjb2xsZWN0aW9uIG9iamVjdCBvZiB2YWx1ZXMsIG9yIGtleWVkIG9iamVjdDogJyArIHZhbHVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheUxpa2UodmFsdWUpXG4gICAgPyBuZXcgQXJyYXlTZXEodmFsdWUpXG4gICAgOiBoYXNJdGVyYXRvcih2YWx1ZSlcbiAgICA/IG5ldyBDb2xsZWN0aW9uU2VxKHZhbHVlKVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG52YXIgSVNfTUFQX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX01BUF9fQEAnO1xuXG5mdW5jdGlvbiBpc01hcChtYXliZU1hcCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZU1hcCAmJiBtYXliZU1hcFtJU19NQVBfU1lNQk9MXSk7XG59XG5cbmZ1bmN0aW9uIGlzT3JkZXJlZE1hcChtYXliZU9yZGVyZWRNYXApIHtcbiAgcmV0dXJuIGlzTWFwKG1heWJlT3JkZXJlZE1hcCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZE1hcCk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsdWVPYmplY3QobWF5YmVWYWx1ZSkge1xuICByZXR1cm4gQm9vbGVhbihcbiAgICBtYXliZVZhbHVlICYmXG4gICAgICB0eXBlb2YgbWF5YmVWYWx1ZS5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIHR5cGVvZiBtYXliZVZhbHVlLmhhc2hDb2RlID09PSAnZnVuY3Rpb24nXG4gICk7XG59XG5cbi8qKlxuICogQW4gZXh0ZW5zaW9uIG9mIHRoZSBcInNhbWUtdmFsdWVcIiBhbGdvcml0aG0gYXMgW2Rlc2NyaWJlZCBmb3IgdXNlIGJ5IEVTNiBNYXBcbiAqIGFuZCBTZXRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcCNLZXlfZXF1YWxpdHkpXG4gKlxuICogTmFOIGlzIGNvbnNpZGVyZWQgdGhlIHNhbWUgYXMgTmFOLCBob3dldmVyIC0wIGFuZCAwIGFyZSBjb25zaWRlcmVkIHRoZSBzYW1lXG4gKiB2YWx1ZSwgd2hpY2ggaXMgZGlmZmVyZW50IGZyb20gdGhlIGFsZ29yaXRobSBkZXNjcmliZWQgYnlcbiAqIFtgT2JqZWN0LmlzYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzKS5cbiAqXG4gKiBUaGlzIGlzIGV4dGVuZGVkIGZ1cnRoZXIgdG8gYWxsb3cgT2JqZWN0cyB0byBkZXNjcmliZSB0aGUgdmFsdWVzIHRoZXlcbiAqIHJlcHJlc2VudCwgYnkgd2F5IG9mIGB2YWx1ZU9mYCBvciBgZXF1YWxzYCAoYW5kIGBoYXNoQ29kZWApLlxuICpcbiAqIE5vdGU6IGJlY2F1c2Ugb2YgdGhpcyBleHRlbnNpb24sIHRoZSBrZXkgZXF1YWxpdHkgb2YgSW1tdXRhYmxlLk1hcCBhbmQgdGhlXG4gKiB2YWx1ZSBlcXVhbGl0eSBvZiBJbW11dGFibGUuU2V0IHdpbGwgZGlmZmVyIGZyb20gRVM2IE1hcCBhbmQgU2V0LlxuICpcbiAqICMjIyBEZWZpbmluZyBjdXN0b20gdmFsdWVzXG4gKlxuICogVGhlIGVhc2llc3Qgd2F5IHRvIGRlc2NyaWJlIHRoZSB2YWx1ZSBhbiBvYmplY3QgcmVwcmVzZW50cyBpcyBieSBpbXBsZW1lbnRpbmdcbiAqIGB2YWx1ZU9mYC4gRm9yIGV4YW1wbGUsIGBEYXRlYCByZXByZXNlbnRzIGEgdmFsdWUgYnkgcmV0dXJuaW5nIGEgdW5peFxuICogdGltZXN0YW1wIGZvciBgdmFsdWVPZmA6XG4gKlxuICogICAgIHZhciBkYXRlMSA9IG5ldyBEYXRlKDEyMzQ1Njc4OTAwMDApOyAvLyBGcmkgRmViIDEzIDIwMDkgLi4uXG4gKiAgICAgdmFyIGRhdGUyID0gbmV3IERhdGUoMTIzNDU2Nzg5MDAwMCk7XG4gKiAgICAgZGF0ZTEudmFsdWVPZigpOyAvLyAxMjM0NTY3ODkwMDAwXG4gKiAgICAgYXNzZXJ0KCBkYXRlMSAhPT0gZGF0ZTIgKTtcbiAqICAgICBhc3NlcnQoIEltbXV0YWJsZS5pcyggZGF0ZTEsIGRhdGUyICkgKTtcbiAqXG4gKiBOb3RlOiBvdmVycmlkaW5nIGB2YWx1ZU9mYCBtYXkgaGF2ZSBvdGhlciBpbXBsaWNhdGlvbnMgaWYgeW91IHVzZSB0aGlzIG9iamVjdFxuICogd2hlcmUgSmF2YVNjcmlwdCBleHBlY3RzIGEgcHJpbWl0aXZlLCBzdWNoIGFzIGltcGxpY2l0IHN0cmluZyBjb2VyY2lvbi5cbiAqXG4gKiBGb3IgbW9yZSBjb21wbGV4IHR5cGVzLCBlc3BlY2lhbGx5IGNvbGxlY3Rpb25zLCBpbXBsZW1lbnRpbmcgYHZhbHVlT2ZgIG1heVxuICogbm90IGJlIHBlcmZvcm1hbnQuIEFuIGFsdGVybmF0aXZlIGlzIHRvIGltcGxlbWVudCBgZXF1YWxzYCBhbmQgYGhhc2hDb2RlYC5cbiAqXG4gKiBgZXF1YWxzYCB0YWtlcyBhbm90aGVyIG9iamVjdCwgcHJlc3VtYWJseSBvZiBzaW1pbGFyIHR5cGUsIGFuZCByZXR1cm5zIHRydWVcbiAqIGlmIGl0IGlzIGVxdWFsLiBFcXVhbGl0eSBpcyBzeW1tZXRyaWNhbCwgc28gdGhlIHNhbWUgcmVzdWx0IHNob3VsZCBiZVxuICogcmV0dXJuZWQgaWYgdGhpcyBhbmQgdGhlIGFyZ3VtZW50IGFyZSBmbGlwcGVkLlxuICpcbiAqICAgICBhc3NlcnQoIGEuZXF1YWxzKGIpID09PSBiLmVxdWFscyhhKSApO1xuICpcbiAqIGBoYXNoQ29kZWAgcmV0dXJucyBhIDMyYml0IGludGVnZXIgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IHdoaWNoIHdpbGxcbiAqIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIGhvdyB0byBzdG9yZSB0aGUgdmFsdWUgb2JqZWN0IGluIGEgTWFwIG9yIFNldC4gWW91IG11c3RcbiAqIHByb3ZpZGUgYm90aCBvciBuZWl0aGVyIG1ldGhvZHMsIG9uZSBtdXN0IG5vdCBleGlzdCB3aXRob3V0IHRoZSBvdGhlci5cbiAqXG4gKiBBbHNvLCBhbiBpbXBvcnRhbnQgcmVsYXRpb25zaGlwIGJldHdlZW4gdGhlc2UgbWV0aG9kcyBtdXN0IGJlIHVwaGVsZDogaWYgdHdvXG4gKiB2YWx1ZXMgYXJlIGVxdWFsLCB0aGV5ICptdXN0KiByZXR1cm4gdGhlIHNhbWUgaGFzaENvZGUuIElmIHRoZSB2YWx1ZXMgYXJlIG5vdFxuICogZXF1YWwsIHRoZXkgbWlnaHQgaGF2ZSB0aGUgc2FtZSBoYXNoQ29kZTsgdGhpcyBpcyBjYWxsZWQgYSBoYXNoIGNvbGxpc2lvbixcbiAqIGFuZCB3aGlsZSB1bmRlc2lyYWJsZSBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgaXQgaXMgYWNjZXB0YWJsZS5cbiAqXG4gKiAgICAgaWYgKGEuZXF1YWxzKGIpKSB7XG4gKiAgICAgICBhc3NlcnQoIGEuaGFzaENvZGUoKSA9PT0gYi5oYXNoQ29kZSgpICk7XG4gKiAgICAgfVxuICpcbiAqIEFsbCBJbW11dGFibGUgY29sbGVjdGlvbnMgYXJlIFZhbHVlIE9iamVjdHM6IHRoZXkgaW1wbGVtZW50IGBlcXVhbHMoKWBcbiAqIGFuZCBgaGFzaENvZGUoKWAuXG4gKi9cbmZ1bmN0aW9uIGlzKHZhbHVlQSwgdmFsdWVCKSB7XG4gIGlmICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKCF2YWx1ZUEgfHwgIXZhbHVlQikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoXG4gICAgdHlwZW9mIHZhbHVlQS52YWx1ZU9mID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIHZhbHVlQi52YWx1ZU9mID09PSAnZnVuY3Rpb24nXG4gICkge1xuICAgIHZhbHVlQSA9IHZhbHVlQS52YWx1ZU9mKCk7XG4gICAgdmFsdWVCID0gdmFsdWVCLnZhbHVlT2YoKTtcbiAgICBpZiAodmFsdWVBID09PSB2YWx1ZUIgfHwgKHZhbHVlQSAhPT0gdmFsdWVBICYmIHZhbHVlQiAhPT0gdmFsdWVCKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghdmFsdWVBIHx8ICF2YWx1ZUIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICEhKFxuICAgIGlzVmFsdWVPYmplY3QodmFsdWVBKSAmJlxuICAgIGlzVmFsdWVPYmplY3QodmFsdWVCKSAmJlxuICAgIHZhbHVlQS5lcXVhbHModmFsdWVCKVxuICApO1xufVxuXG52YXIgaW11bCA9XG4gIHR5cGVvZiBNYXRoLmltdWwgPT09ICdmdW5jdGlvbicgJiYgTWF0aC5pbXVsKDB4ZmZmZmZmZmYsIDIpID09PSAtMlxuICAgID8gTWF0aC5pbXVsXG4gICAgOiBmdW5jdGlvbiBpbXVsKGEsIGIpIHtcbiAgICAgICAgYSB8PSAwOyAvLyBpbnRcbiAgICAgICAgYiB8PSAwOyAvLyBpbnRcbiAgICAgICAgdmFyIGMgPSBhICYgMHhmZmZmO1xuICAgICAgICB2YXIgZCA9IGIgJiAweGZmZmY7XG4gICAgICAgIC8vIFNoaWZ0IGJ5IDAgZml4ZXMgdGhlIHNpZ24gb24gdGhlIGhpZ2ggcGFydC5cbiAgICAgICAgcmV0dXJuIChjICogZCArICgoKChhID4+PiAxNikgKiBkICsgYyAqIChiID4+PiAxNikpIDw8IDE2KSA+Pj4gMCkpIHwgMDsgLy8gaW50XG4gICAgICB9O1xuXG4vLyB2OCBoYXMgYW4gb3B0aW1pemF0aW9uIGZvciBzdG9yaW5nIDMxLWJpdCBzaWduZWQgbnVtYmVycy5cbi8vIFZhbHVlcyB3aGljaCBoYXZlIGVpdGhlciAwMCBvciAxMSBhcyB0aGUgaGlnaCBvcmRlciBiaXRzIHF1YWxpZnkuXG4vLyBUaGlzIGZ1bmN0aW9uIGRyb3BzIHRoZSBoaWdoZXN0IG9yZGVyIGJpdCBpbiBhIHNpZ25lZCBudW1iZXIsIG1haW50YWluaW5nXG4vLyB0aGUgc2lnbiBiaXQuXG5mdW5jdGlvbiBzbWkoaTMyKSB7XG4gIHJldHVybiAoKGkzMiA+Pj4gMSkgJiAweDQwMDAwMDAwKSB8IChpMzIgJiAweGJmZmZmZmZmKTtcbn1cblxudmFyIGRlZmF1bHRWYWx1ZU9mID0gT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mO1xuXG5mdW5jdGlvbiBoYXNoKG8pIHtcbiAgaWYgKG8gPT0gbnVsbCkge1xuICAgIHJldHVybiBoYXNoTnVsbGlzaChvKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygby5oYXNoQ29kZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIERyb3AgYW55IGhpZ2ggYml0cyBmcm9tIGFjY2lkZW50YWxseSBsb25nIGhhc2ggY29kZXMuXG4gICAgcmV0dXJuIHNtaShvLmhhc2hDb2RlKG8pKTtcbiAgfVxuXG4gIHZhciB2ID0gdmFsdWVPZihvKTtcblxuICBpZiAodiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGhhc2hOdWxsaXNoKHYpO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgLy8gVGhlIGhhc2ggdmFsdWVzIGZvciBidWlsdC1pbiBjb25zdGFudHMgYXJlIGEgMSB2YWx1ZSBmb3IgZWFjaCA1LWJ5dGVcbiAgICAgIC8vIHNoaWZ0IHJlZ2lvbiBleHBlY3QgZm9yIHRoZSBmaXJzdCwgd2hpY2ggZW5jb2RlcyB0aGUgdmFsdWUuIFRoaXNcbiAgICAgIC8vIHJlZHVjZXMgdGhlIG9kZHMgb2YgYSBoYXNoIGNvbGxpc2lvbiBmb3IgdGhlc2UgY29tbW9uIHZhbHVlcy5cbiAgICAgIHJldHVybiB2ID8gMHg0MjEwODQyMSA6IDB4NDIxMDg0MjA7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBoYXNoTnVtYmVyKHYpO1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdi5sZW5ndGggPiBTVFJJTkdfSEFTSF9DQUNIRV9NSU5fU1RSTEVOXG4gICAgICAgID8gY2FjaGVkSGFzaFN0cmluZyh2KVxuICAgICAgICA6IGhhc2hTdHJpbmcodik7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gaGFzaEpTT2JqKHYpO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gaGFzaFN5bWJvbCh2KTtcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHR5cGVvZiB2LnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBoYXNoU3RyaW5nKHYudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIHR5cGUgJyArIHR5cGVvZiB2ICsgJyBjYW5ub3QgYmUgaGFzaGVkLicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhc2hOdWxsaXNoKG51bGxpc2gpIHtcbiAgcmV0dXJuIG51bGxpc2ggPT09IG51bGwgPyAweDQyMTA4NDIyIDogLyogdW5kZWZpbmVkICovIDB4NDIxMDg0MjM7XG59XG5cbi8vIENvbXByZXNzIGFyYml0cmFyaWx5IGxhcmdlIG51bWJlcnMgaW50byBzbWkgaGFzaGVzLlxuZnVuY3Rpb24gaGFzaE51bWJlcihuKSB7XG4gIGlmIChuICE9PSBuIHx8IG4gPT09IEluZmluaXR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgdmFyIGhhc2ggPSBuIHwgMDtcbiAgaWYgKGhhc2ggIT09IG4pIHtcbiAgICBoYXNoIF49IG4gKiAweGZmZmZmZmZmO1xuICB9XG4gIHdoaWxlIChuID4gMHhmZmZmZmZmZikge1xuICAgIG4gLz0gMHhmZmZmZmZmZjtcbiAgICBoYXNoIF49IG47XG4gIH1cbiAgcmV0dXJuIHNtaShoYXNoKTtcbn1cblxuZnVuY3Rpb24gY2FjaGVkSGFzaFN0cmluZyhzdHJpbmcpIHtcbiAgdmFyIGhhc2hlZCA9IHN0cmluZ0hhc2hDYWNoZVtzdHJpbmddO1xuICBpZiAoaGFzaGVkID09PSB1bmRlZmluZWQpIHtcbiAgICBoYXNoZWQgPSBoYXNoU3RyaW5nKHN0cmluZyk7XG4gICAgaWYgKFNUUklOR19IQVNIX0NBQ0hFX1NJWkUgPT09IFNUUklOR19IQVNIX0NBQ0hFX01BWF9TSVpFKSB7XG4gICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID0gMDtcbiAgICAgIHN0cmluZ0hhc2hDYWNoZSA9IHt9O1xuICAgIH1cbiAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFKys7XG4gICAgc3RyaW5nSGFzaENhY2hlW3N0cmluZ10gPSBoYXNoZWQ7XG4gIH1cbiAgcmV0dXJuIGhhc2hlZDtcbn1cblxuLy8gaHR0cDovL2pzcGVyZi5jb20vaGFzaGluZy1zdHJpbmdzXG5mdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZykge1xuICAvLyBUaGlzIGlzIHRoZSBoYXNoIGZyb20gSlZNXG4gIC8vIFRoZSBoYXNoIGNvZGUgZm9yIGEgc3RyaW5nIGlzIGNvbXB1dGVkIGFzXG4gIC8vIHNbMF0gKiAzMSBeIChuIC0gMSkgKyBzWzFdICogMzEgXiAobiAtIDIpICsgLi4uICsgc1tuIC0gMV0sXG4gIC8vIHdoZXJlIHNbaV0gaXMgdGhlIGl0aCBjaGFyYWN0ZXIgb2YgdGhlIHN0cmluZyBhbmQgbiBpcyB0aGUgbGVuZ3RoIG9mXG4gIC8vIHRoZSBzdHJpbmcuIFdlIFwibW9kXCIgdGhlIHJlc3VsdCB0byBtYWtlIGl0IGJldHdlZW4gMCAoaW5jbHVzaXZlKSBhbmQgMl4zMVxuICAvLyAoZXhjbHVzaXZlKSBieSBkcm9wcGluZyBoaWdoIGJpdHMuXG4gIHZhciBoYXNoZWQgPSAwO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgc3RyaW5nLmxlbmd0aDsgaWkrKykge1xuICAgIGhhc2hlZCA9ICgzMSAqIGhhc2hlZCArIHN0cmluZy5jaGFyQ29kZUF0KGlpKSkgfCAwO1xuICB9XG4gIHJldHVybiBzbWkoaGFzaGVkKTtcbn1cblxuZnVuY3Rpb24gaGFzaFN5bWJvbChzeW0pIHtcbiAgdmFyIGhhc2hlZCA9IHN5bWJvbE1hcFtzeW1dO1xuICBpZiAoaGFzaGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gaGFzaGVkO1xuICB9XG5cbiAgaGFzaGVkID0gbmV4dEhhc2goKTtcblxuICBzeW1ib2xNYXBbc3ltXSA9IGhhc2hlZDtcblxuICByZXR1cm4gaGFzaGVkO1xufVxuXG5mdW5jdGlvbiBoYXNoSlNPYmoob2JqKSB7XG4gIHZhciBoYXNoZWQ7XG4gIGlmICh1c2luZ1dlYWtNYXApIHtcbiAgICBoYXNoZWQgPSB3ZWFrTWFwLmdldChvYmopO1xuICAgIGlmIChoYXNoZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhc2hlZDtcbiAgICB9XG4gIH1cblxuICBoYXNoZWQgPSBvYmpbVUlEX0hBU0hfS0VZXTtcbiAgaWYgKGhhc2hlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGhhc2hlZDtcbiAgfVxuXG4gIGlmICghY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICBoYXNoZWQgPSBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgJiYgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlW1VJRF9IQVNIX0tFWV07XG4gICAgaWYgKGhhc2hlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFzaGVkO1xuICAgIH1cblxuICAgIGhhc2hlZCA9IGdldElFTm9kZUhhc2gob2JqKTtcbiAgICBpZiAoaGFzaGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYXNoZWQ7XG4gICAgfVxuICB9XG5cbiAgaGFzaGVkID0gbmV4dEhhc2goKTtcblxuICBpZiAodXNpbmdXZWFrTWFwKSB7XG4gICAgd2Vha01hcC5zZXQob2JqLCBoYXNoZWQpO1xuICB9IGVsc2UgaWYgKGlzRXh0ZW5zaWJsZSAhPT0gdW5kZWZpbmVkICYmIGlzRXh0ZW5zaWJsZShvYmopID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm9uLWV4dGVuc2libGUgb2JqZWN0cyBhcmUgbm90IGFsbG93ZWQgYXMga2V5cy4nKTtcbiAgfSBlbHNlIGlmIChjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIFVJRF9IQVNIX0tFWSwge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGhhc2hlZCxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChcbiAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgIT09IHVuZGVmaW5lZCAmJlxuICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9PT0gb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZVxuICApIHtcbiAgICAvLyBTaW5jZSB3ZSBjYW4ndCBkZWZpbmUgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSBvbiB0aGUgb2JqZWN0XG4gICAgLy8gd2UnbGwgaGlqYWNrIG9uZSBvZiB0aGUgbGVzcy11c2VkIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgdG9cbiAgICAvLyBzYXZlIG91ciBoYXNoIG9uIGl0LiBTaW5jZSB0aGlzIGlzIGEgZnVuY3Rpb24gaXQgd2lsbCBub3Qgc2hvdyB1cCBpblxuICAgIC8vIGBKU09OLnN0cmluZ2lmeWAgd2hpY2ggaXMgd2hhdCB3ZSB3YW50LlxuICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgYXJndW1lbnRzXG4gICAgICApO1xuICAgIH07XG4gICAgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlW1VJRF9IQVNIX0tFWV0gPSBoYXNoZWQ7XG4gIH0gZWxzZSBpZiAob2JqLm5vZGVUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGNvdWxkbid0IGdldCB0aGUgSUUgYHVuaXF1ZUlEYCB0byB1c2UgYXMgYSBoYXNoXG4gICAgLy8gYW5kIHdlIGNvdWxkbid0IHVzZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IHRvIGV4cGxvaXQgdGhlXG4gICAgLy8gZG9udEVudW0gYnVnIHNvIHdlIHNpbXBseSBhZGQgdGhlIGBVSURfSEFTSF9LRVlgIG9uIHRoZSBub2RlXG4gICAgLy8gaXRzZWxmLlxuICAgIG9ialtVSURfSEFTSF9LRVldID0gaGFzaGVkO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHNldCBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG9uIG9iamVjdC4nKTtcbiAgfVxuXG4gIHJldHVybiBoYXNoZWQ7XG59XG5cbi8vIEdldCByZWZlcmVuY2VzIHRvIEVTNSBvYmplY3QgbWV0aG9kcy5cbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuXG4vLyBUcnVlIGlmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB3b3JrcyBhcyBleHBlY3RlZC4gSUU4IGZhaWxzIHRoaXMgdGVzdC5cbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnQCcsIHt9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSkoKTtcblxuLy8gSUUgaGFzIGEgYHVuaXF1ZUlEYCBwcm9wZXJ0eSBvbiBET00gbm9kZXMuIFdlIGNhbiBjb25zdHJ1Y3QgdGhlIGhhc2ggZnJvbSBpdFxuLy8gYW5kIGF2b2lkIG1lbW9yeSBsZWFrcyBmcm9tIHRoZSBJRSBjbG9uZU5vZGUgYnVnLlxuZnVuY3Rpb24gZ2V0SUVOb2RlSGFzaChub2RlKSB7XG4gIGlmIChub2RlICYmIG5vZGUubm9kZVR5cGUgPiAwKSB7XG4gICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICBjYXNlIDE6IC8vIEVsZW1lbnRcbiAgICAgICAgcmV0dXJuIG5vZGUudW5pcXVlSUQ7XG4gICAgICBjYXNlIDk6IC8vIERvY3VtZW50XG4gICAgICAgIHJldHVybiBub2RlLmRvY3VtZW50RWxlbWVudCAmJiBub2RlLmRvY3VtZW50RWxlbWVudC51bmlxdWVJRDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsdWVPZihvYmopIHtcbiAgcmV0dXJuIG9iai52YWx1ZU9mICE9PSBkZWZhdWx0VmFsdWVPZiAmJiB0eXBlb2Ygb2JqLnZhbHVlT2YgPT09ICdmdW5jdGlvbidcbiAgICA/IG9iai52YWx1ZU9mKG9iailcbiAgICA6IG9iajtcbn1cblxuZnVuY3Rpb24gbmV4dEhhc2goKSB7XG4gIHZhciBuZXh0SGFzaCA9ICsrX29iakhhc2hVSUQ7XG4gIGlmIChfb2JqSGFzaFVJRCAmIDB4NDAwMDAwMDApIHtcbiAgICBfb2JqSGFzaFVJRCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5leHRIYXNoO1xufVxuXG4vLyBJZiBwb3NzaWJsZSwgdXNlIGEgV2Vha01hcC5cbnZhciB1c2luZ1dlYWtNYXAgPSB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJztcbnZhciB3ZWFrTWFwO1xuaWYgKHVzaW5nV2Vha01hcCkge1xuICB3ZWFrTWFwID0gbmV3IFdlYWtNYXAoKTtcbn1cblxudmFyIHN5bWJvbE1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbnZhciBfb2JqSGFzaFVJRCA9IDA7XG5cbnZhciBVSURfSEFTSF9LRVkgPSAnX19pbW11dGFibGVoYXNoX18nO1xuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcbiAgVUlEX0hBU0hfS0VZID0gU3ltYm9sKFVJRF9IQVNIX0tFWSk7XG59XG5cbnZhciBTVFJJTkdfSEFTSF9DQUNIRV9NSU5fU1RSTEVOID0gMTY7XG52YXIgU1RSSU5HX0hBU0hfQ0FDSEVfTUFYX1NJWkUgPSAyNTU7XG52YXIgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSA9IDA7XG52YXIgc3RyaW5nSGFzaENhY2hlID0ge307XG5cbnZhciBUb0tleWVkU2VxdWVuY2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChLZXllZFNlcSkge1xuICBmdW5jdGlvbiBUb0tleWVkU2VxdWVuY2UoaW5kZXhlZCwgdXNlS2V5cykge1xuICAgIHRoaXMuX2l0ZXIgPSBpbmRleGVkO1xuICAgIHRoaXMuX3VzZUtleXMgPSB1c2VLZXlzO1xuICAgIHRoaXMuc2l6ZSA9IGluZGV4ZWQuc2l6ZTtcbiAgfVxuXG4gIGlmICggS2V5ZWRTZXEgKSBUb0tleWVkU2VxdWVuY2UuX19wcm90b19fID0gS2V5ZWRTZXE7XG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBLZXllZFNlcSAmJiBLZXllZFNlcS5wcm90b3R5cGUgKTtcbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRvS2V5ZWRTZXF1ZW5jZTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoa2V5LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9pdGVyLmdldChrZXksIG5vdFNldFZhbHVlKTtcbiAgfTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuaGFzKGtleSk7XG4gIH07XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS52YWx1ZVNlcSA9IGZ1bmN0aW9uIHZhbHVlU2VxICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci52YWx1ZVNlcSgpO1xuICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UgKCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IHJldmVyc2VGYWN0b3J5KHRoaXMsIHRydWUpO1xuICAgIGlmICghdGhpcy5fdXNlS2V5cykge1xuICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS52YWx1ZVNlcSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMSQxLl9pdGVyLnRvU2VxKCkucmV2ZXJzZSgpOyB9O1xuICAgIH1cbiAgICByZXR1cm4gcmV2ZXJzZWRTZXF1ZW5jZTtcbiAgfTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcCAobWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHZhciBtYXBwZWRTZXF1ZW5jZSA9IG1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KTtcbiAgICBpZiAoIXRoaXMuX3VzZUtleXMpIHtcbiAgICAgIG1hcHBlZFNlcXVlbmNlLnZhbHVlU2VxID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyQxJDEuX2l0ZXIudG9TZXEoKS5tYXAobWFwcGVyLCBjb250ZXh0KTsgfTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZFNlcXVlbmNlO1xuICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZuKHYsIGssIHRoaXMkMSQxKTsgfSwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgcmV0dXJuIFRvS2V5ZWRTZXF1ZW5jZTtcbn0oS2V5ZWRTZXEpKTtcblRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGVbSVNfT1JERVJFRF9TWU1CT0xdID0gdHJ1ZTtcblxudmFyIFRvSW5kZXhlZFNlcXVlbmNlID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZFNlcSkge1xuICBmdW5jdGlvbiBUb0luZGV4ZWRTZXF1ZW5jZShpdGVyKSB7XG4gICAgdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgdGhpcy5zaXplID0gaXRlci5zaXplO1xuICB9XG5cbiAgaWYgKCBJbmRleGVkU2VxICkgVG9JbmRleGVkU2VxdWVuY2UuX19wcm90b19fID0gSW5kZXhlZFNlcTtcbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUb0luZGV4ZWRTZXF1ZW5jZTtcblxuICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci5pbmNsdWRlcyh2YWx1ZSk7XG4gIH07XG5cbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHJldmVyc2UgJiYgZW5zdXJlU2l6ZSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoXG4gICAgICBmdW5jdGlvbiAodikgeyByZXR1cm4gZm4odiwgcmV2ZXJzZSA/IHRoaXMkMSQxLnNpemUgLSArK2kgOiBpKyssIHRoaXMkMSQxKTsgfSxcbiAgICAgIHJldmVyc2VcbiAgICApO1xuICB9O1xuXG4gIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgIHZhciBpID0gMDtcbiAgICByZXZlcnNlICYmIGVuc3VyZVNpemUodGhpcyk7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIHJldHVybiBzdGVwLmRvbmVcbiAgICAgICAgPyBzdGVwXG4gICAgICAgIDogaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICByZXZlcnNlID8gdGhpcyQxJDEuc2l6ZSAtICsraSA6IGkrKyxcbiAgICAgICAgICAgIHN0ZXAudmFsdWUsXG4gICAgICAgICAgICBzdGVwXG4gICAgICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVG9JbmRleGVkU2VxdWVuY2U7XG59KEluZGV4ZWRTZXEpKTtcblxudmFyIFRvU2V0U2VxdWVuY2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChTZXRTZXEpIHtcbiAgZnVuY3Rpb24gVG9TZXRTZXF1ZW5jZShpdGVyKSB7XG4gICAgdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgdGhpcy5zaXplID0gaXRlci5zaXplO1xuICB9XG5cbiAgaWYgKCBTZXRTZXEgKSBUb1NldFNlcXVlbmNlLl9fcHJvdG9fXyA9IFNldFNlcTtcbiAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXRTZXEgJiYgU2V0U2VxLnByb3RvdHlwZSApO1xuICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRvU2V0U2VxdWVuY2U7XG5cbiAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gaGFzIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci5pbmNsdWRlcyhrZXkpO1xuICB9O1xuXG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uICh2KSB7IHJldHVybiBmbih2LCB2LCB0aGlzJDEkMSk7IH0sIHJldmVyc2UpO1xuICB9O1xuXG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgcmV0dXJuIHN0ZXAuZG9uZVxuICAgICAgICA/IHN0ZXBcbiAgICAgICAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIHN0ZXAudmFsdWUsIHN0ZXAudmFsdWUsIHN0ZXApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBUb1NldFNlcXVlbmNlO1xufShTZXRTZXEpKTtcblxudmFyIEZyb21FbnRyaWVzU2VxdWVuY2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChLZXllZFNlcSkge1xuICBmdW5jdGlvbiBGcm9tRW50cmllc1NlcXVlbmNlKGVudHJpZXMpIHtcbiAgICB0aGlzLl9pdGVyID0gZW50cmllcztcbiAgICB0aGlzLnNpemUgPSBlbnRyaWVzLnNpemU7XG4gIH1cblxuICBpZiAoIEtleWVkU2VxICkgRnJvbUVudHJpZXNTZXF1ZW5jZS5fX3Byb3RvX18gPSBLZXllZFNlcTtcbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBLZXllZFNlcSAmJiBLZXllZFNlcS5wcm90b3R5cGUgKTtcbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBGcm9tRW50cmllc1NlcXVlbmNlO1xuXG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmVudHJ5U2VxID0gZnVuY3Rpb24gZW50cnlTZXEgKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVyLnRvU2VxKCk7XG4gIH07XG5cbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAvLyBDaGVjayBpZiBlbnRyeSBleGlzdHMgZmlyc3Qgc28gYXJyYXkgYWNjZXNzIGRvZXNuJ3QgdGhyb3cgZm9yIGhvbGVzXG4gICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICB2YWxpZGF0ZUVudHJ5KGVudHJ5KTtcbiAgICAgICAgdmFyIGluZGV4ZWRDb2xsZWN0aW9uID0gaXNDb2xsZWN0aW9uKGVudHJ5KTtcbiAgICAgICAgcmV0dXJuIGZuKFxuICAgICAgICAgIGluZGV4ZWRDb2xsZWN0aW9uID8gZW50cnkuZ2V0KDEpIDogZW50cnlbMV0sXG4gICAgICAgICAgaW5kZXhlZENvbGxlY3Rpb24gPyBlbnRyeS5nZXQoMCkgOiBlbnRyeVswXSxcbiAgICAgICAgICB0aGlzJDEkMVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sIHJldmVyc2UpO1xuICB9O1xuXG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuICAgICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG4gICAgICAgICAgdmFyIGluZGV4ZWRDb2xsZWN0aW9uID0gaXNDb2xsZWN0aW9uKGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBpbmRleGVkQ29sbGVjdGlvbiA/IGVudHJ5LmdldCgwKSA6IGVudHJ5WzBdLFxuICAgICAgICAgICAgaW5kZXhlZENvbGxlY3Rpb24gPyBlbnRyeS5nZXQoMSkgOiBlbnRyeVsxXSxcbiAgICAgICAgICAgIHN0ZXBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEZyb21FbnRyaWVzU2VxdWVuY2U7XG59KEtleWVkU2VxKSk7XG5cblRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgICBjYWNoZVJlc3VsdFRocm91Z2g7XG5cbmZ1bmN0aW9uIGZsaXBGYWN0b3J5KGNvbGxlY3Rpb24pIHtcbiAgdmFyIGZsaXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgZmxpcFNlcXVlbmNlLl9pdGVyID0gY29sbGVjdGlvbjtcbiAgZmxpcFNlcXVlbmNlLnNpemUgPSBjb2xsZWN0aW9uLnNpemU7XG4gIGZsaXBTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY29sbGVjdGlvbjsgfTtcbiAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJldmVyc2VkU2VxdWVuY2UgPSBjb2xsZWN0aW9uLnJldmVyc2UuYXBwbHkodGhpcyk7IC8vIHN1cGVyLnJldmVyc2UoKVxuICAgIHJldmVyc2VkU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbGxlY3Rpb24ucmV2ZXJzZSgpOyB9O1xuICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICB9O1xuICBmbGlwU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gY29sbGVjdGlvbi5pbmNsdWRlcyhrZXkpOyB9O1xuICBmbGlwU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBjb2xsZWN0aW9uLmhhcyhrZXkpOyB9O1xuICBmbGlwU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG4gIGZsaXBTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZuKGssIHYsIHRoaXMkMSQxKSAhPT0gZmFsc2U7IH0sIHJldmVyc2UpO1xuICB9O1xuICBmbGlwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBjb2xsZWN0aW9uLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmICghc3RlcC5kb25lKSB7XG4gICAgICAgICAgdmFyIGsgPSBzdGVwLnZhbHVlWzBdO1xuICAgICAgICAgIHN0ZXAudmFsdWVbMF0gPSBzdGVwLnZhbHVlWzFdO1xuICAgICAgICAgIHN0ZXAudmFsdWVbMV0gPSBrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLl9faXRlcmF0b3IoXG4gICAgICB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUyA/IElURVJBVEVfS0VZUyA6IElURVJBVEVfVkFMVUVTLFxuICAgICAgcmV2ZXJzZVxuICAgICk7XG4gIH07XG4gIHJldHVybiBmbGlwU2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIG1hcEZhY3RvcnkoY29sbGVjdGlvbiwgbWFwcGVyLCBjb250ZXh0KSB7XG4gIHZhciBtYXBwZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgbWFwcGVkU2VxdWVuY2Uuc2l6ZSA9IGNvbGxlY3Rpb24uc2l6ZTtcbiAgbWFwcGVkU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gY29sbGVjdGlvbi5oYXMoa2V5KTsgfTtcbiAgbWFwcGVkU2VxdWVuY2UuZ2V0ID0gZnVuY3Rpb24gKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICB2YXIgdiA9IGNvbGxlY3Rpb24uZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgcmV0dXJuIHYgPT09IE5PVF9TRVRcbiAgICAgID8gbm90U2V0VmFsdWVcbiAgICAgIDogbWFwcGVyLmNhbGwoY29udGV4dCwgdiwga2V5LCBjb2xsZWN0aW9uKTtcbiAgfTtcbiAgbWFwcGVkU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uX19pdGVyYXRlKFxuICAgICAgZnVuY3Rpb24gKHYsIGssIGMpIHsgcmV0dXJuIGZuKG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGssIGMpLCBrLCB0aGlzJDEkMSkgIT09IGZhbHNlOyB9LFxuICAgICAgcmV2ZXJzZVxuICAgICk7XG4gIH07XG4gIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICB9XG4gICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgdmFyIGtleSA9IGVudHJ5WzBdO1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGtleSxcbiAgICAgICAgbWFwcGVyLmNhbGwoY29udGV4dCwgZW50cnlbMV0sIGtleSwgY29sbGVjdGlvbiksXG4gICAgICAgIHN0ZXBcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBtYXBwZWRTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gcmV2ZXJzZUZhY3RvcnkoY29sbGVjdGlvbiwgdXNlS2V5cykge1xuICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gIHZhciByZXZlcnNlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGNvbGxlY3Rpb24pO1xuICByZXZlcnNlZFNlcXVlbmNlLl9pdGVyID0gY29sbGVjdGlvbjtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5zaXplID0gY29sbGVjdGlvbi5zaXplO1xuICByZXZlcnNlZFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb2xsZWN0aW9uOyB9O1xuICBpZiAoY29sbGVjdGlvbi5mbGlwKSB7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZsaXBTZXF1ZW5jZSA9IGZsaXBGYWN0b3J5KGNvbGxlY3Rpb24pO1xuICAgICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb2xsZWN0aW9uLmZsaXAoKTsgfTtcbiAgICAgIHJldHVybiBmbGlwU2VxdWVuY2U7XG4gICAgfTtcbiAgfVxuICByZXZlcnNlZFNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uIChrZXksIG5vdFNldFZhbHVlKSB7IHJldHVybiBjb2xsZWN0aW9uLmdldCh1c2VLZXlzID8ga2V5IDogLTEgLSBrZXksIG5vdFNldFZhbHVlKTsgfTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBjb2xsZWN0aW9uLmhhcyh1c2VLZXlzID8ga2V5IDogLTEgLSBrZXkpOyB9O1xuICByZXZlcnNlZFNlcXVlbmNlLmluY2x1ZGVzID0gZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBjb2xsZWN0aW9uLmluY2x1ZGVzKHZhbHVlKTsgfTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5jYWNoZVJlc3VsdCA9IGNhY2hlUmVzdWx0VGhyb3VnaDtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHJldmVyc2UgJiYgZW5zdXJlU2l6ZShjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5fX2l0ZXJhdGUoXG4gICAgICBmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gZm4odiwgdXNlS2V5cyA/IGsgOiByZXZlcnNlID8gdGhpcyQxJDEuc2l6ZSAtICsraSA6IGkrKywgdGhpcyQxJDEpOyB9LFxuICAgICAgIXJldmVyc2VcbiAgICApO1xuICB9O1xuICByZXZlcnNlZFNlcXVlbmNlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpID0gMDtcbiAgICByZXZlcnNlICYmIGVuc3VyZVNpemUoY29sbGVjdGlvbik7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgIXJldmVyc2UpO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfVxuICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICB0eXBlLFxuICAgICAgICB1c2VLZXlzID8gZW50cnlbMF0gOiByZXZlcnNlID8gdGhpcyQxJDEuc2l6ZSAtICsraSA6IGkrKyxcbiAgICAgICAgZW50cnlbMV0sXG4gICAgICAgIHN0ZXBcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJGYWN0b3J5KGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgY29udGV4dCwgdXNlS2V5cykge1xuICB2YXIgZmlsdGVyU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIGlmICh1c2VLZXlzKSB7XG4gICAgZmlsdGVyU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIHYgPSBjb2xsZWN0aW9uLmdldChrZXksIE5PVF9TRVQpO1xuICAgICAgcmV0dXJuIHYgIT09IE5PVF9TRVQgJiYgISFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrZXksIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgZmlsdGVyU2VxdWVuY2UuZ2V0ID0gZnVuY3Rpb24gKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHZhciB2ID0gY29sbGVjdGlvbi5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgIHJldHVybiB2ICE9PSBOT1RfU0VUICYmIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGtleSwgY29sbGVjdGlvbilcbiAgICAgICAgPyB2XG4gICAgICAgIDogbm90U2V0VmFsdWU7XG4gICAgfTtcbiAgfVxuICBmaWx0ZXJTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDEkMSk7XG4gICAgICB9XG4gICAgfSwgcmV2ZXJzZSk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG4gIGZpbHRlclNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICB2YXIga2V5ID0gZW50cnlbMF07XG4gICAgICAgIHZhciB2YWx1ZSA9IGVudHJ5WzFdO1xuICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCB1c2VLZXlzID8ga2V5IDogaXRlcmF0aW9ucysrLCB2YWx1ZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIGZpbHRlclNlcXVlbmNlO1xufVxuXG5mdW5jdGlvbiBjb3VudEJ5RmFjdG9yeShjb2xsZWN0aW9uLCBncm91cGVyLCBjb250ZXh0KSB7XG4gIHZhciBncm91cHMgPSBNYXAoKS5hc011dGFibGUoKTtcbiAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICBncm91cHMudXBkYXRlKGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjb2xsZWN0aW9uKSwgMCwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGEgKyAxOyB9KTtcbiAgfSk7XG4gIHJldHVybiBncm91cHMuYXNJbW11dGFibGUoKTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBCeUZhY3RvcnkoY29sbGVjdGlvbiwgZ3JvdXBlciwgY29udGV4dCkge1xuICB2YXIgaXNLZXllZEl0ZXIgPSBpc0tleWVkKGNvbGxlY3Rpb24pO1xuICB2YXIgZ3JvdXBzID0gKGlzT3JkZXJlZChjb2xsZWN0aW9uKSA/IE9yZGVyZWRNYXAoKSA6IE1hcCgpKS5hc011dGFibGUoKTtcbiAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICBncm91cHMudXBkYXRlKFxuICAgICAgZ3JvdXBlci5jYWxsKGNvbnRleHQsIHYsIGssIGNvbGxlY3Rpb24pLFxuICAgICAgZnVuY3Rpb24gKGEpIHsgcmV0dXJuICgoYSA9IGEgfHwgW10pLCBhLnB1c2goaXNLZXllZEl0ZXIgPyBbaywgdl0gOiB2KSwgYSk7IH1cbiAgICApO1xuICB9KTtcbiAgdmFyIGNvZXJjZSA9IGNvbGxlY3Rpb25DbGFzcyhjb2xsZWN0aW9uKTtcbiAgcmV0dXJuIGdyb3Vwcy5tYXAoZnVuY3Rpb24gKGFycikgeyByZXR1cm4gcmVpZnkoY29sbGVjdGlvbiwgY29lcmNlKGFycikpOyB9KS5hc0ltbXV0YWJsZSgpO1xufVxuXG5mdW5jdGlvbiBzbGljZUZhY3RvcnkoY29sbGVjdGlvbiwgYmVnaW4sIGVuZCwgdXNlS2V5cykge1xuICB2YXIgb3JpZ2luYWxTaXplID0gY29sbGVjdGlvbi5zaXplO1xuXG4gIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIG9yaWdpbmFsU2l6ZSkpIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCBvcmlnaW5hbFNpemUpO1xuICB2YXIgcmVzb2x2ZWRFbmQgPSByZXNvbHZlRW5kKGVuZCwgb3JpZ2luYWxTaXplKTtcblxuICAvLyBiZWdpbiBvciBlbmQgd2lsbCBiZSBOYU4gaWYgdGhleSB3ZXJlIHByb3ZpZGVkIGFzIG5lZ2F0aXZlIG51bWJlcnMgYW5kXG4gIC8vIHRoaXMgY29sbGVjdGlvbidzIHNpemUgaXMgdW5rbm93bi4gSW4gdGhhdCBjYXNlLCBjYWNoZSBmaXJzdCBzbyB0aGVyZSBpc1xuICAvLyBhIGtub3duIHNpemUgYW5kIHRoZXNlIGRvIG5vdCByZXNvbHZlIHRvIE5hTi5cbiAgaWYgKHJlc29sdmVkQmVnaW4gIT09IHJlc29sdmVkQmVnaW4gfHwgcmVzb2x2ZWRFbmQgIT09IHJlc29sdmVkRW5kKSB7XG4gICAgcmV0dXJuIHNsaWNlRmFjdG9yeShjb2xsZWN0aW9uLnRvU2VxKCkuY2FjaGVSZXN1bHQoKSwgYmVnaW4sIGVuZCwgdXNlS2V5cyk7XG4gIH1cblxuICAvLyBOb3RlOiByZXNvbHZlZEVuZCBpcyB1bmRlZmluZWQgd2hlbiB0aGUgb3JpZ2luYWwgc2VxdWVuY2UncyBsZW5ndGggaXNcbiAgLy8gdW5rbm93biBhbmQgdGhpcyBzbGljZSBkaWQgbm90IHN1cHBseSBhbiBlbmQgYW5kIHNob3VsZCBjb250YWluIGFsbFxuICAvLyBlbGVtZW50cyBhZnRlciByZXNvbHZlZEJlZ2luLlxuICAvLyBJbiB0aGF0IGNhc2UsIHJlc29sdmVkU2l6ZSB3aWxsIGJlIE5hTiBhbmQgc2xpY2VTaXplIHdpbGwgcmVtYWluIHVuZGVmaW5lZC5cbiAgdmFyIHJlc29sdmVkU2l6ZSA9IHJlc29sdmVkRW5kIC0gcmVzb2x2ZWRCZWdpbjtcbiAgdmFyIHNsaWNlU2l6ZTtcbiAgaWYgKHJlc29sdmVkU2l6ZSA9PT0gcmVzb2x2ZWRTaXplKSB7XG4gICAgc2xpY2VTaXplID0gcmVzb2x2ZWRTaXplIDwgMCA/IDAgOiByZXNvbHZlZFNpemU7XG4gIH1cblxuICB2YXIgc2xpY2VTZXEgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG5cbiAgLy8gSWYgY29sbGVjdGlvbi5zaXplIGlzIHVuZGVmaW5lZCwgdGhlIHNpemUgb2YgdGhlIHJlYWxpemVkIHNsaWNlU2VxIGlzXG4gIC8vIHVua25vd24gYXQgdGhpcyBwb2ludCB1bmxlc3MgdGhlIG51bWJlciBvZiBpdGVtcyB0byBzbGljZSBpcyAwXG4gIHNsaWNlU2VxLnNpemUgPVxuICAgIHNsaWNlU2l6ZSA9PT0gMCA/IHNsaWNlU2l6ZSA6IChjb2xsZWN0aW9uLnNpemUgJiYgc2xpY2VTaXplKSB8fCB1bmRlZmluZWQ7XG5cbiAgaWYgKCF1c2VLZXlzICYmIGlzU2VxKGNvbGxlY3Rpb24pICYmIHNsaWNlU2l6ZSA+PSAwKSB7XG4gICAgc2xpY2VTZXEuZ2V0ID0gZnVuY3Rpb24gKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBzbGljZVNpemVcbiAgICAgICAgPyBjb2xsZWN0aW9uLmdldChpbmRleCArIHJlc29sdmVkQmVnaW4sIG5vdFNldFZhbHVlKVxuICAgICAgICA6IG5vdFNldFZhbHVlO1xuICAgIH07XG4gIH1cblxuICBzbGljZVNlcS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAoc2xpY2VTaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICB9XG4gICAgdmFyIHNraXBwZWQgPSAwO1xuICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgIGlmICghKGlzU2tpcHBpbmcgJiYgKGlzU2tpcHBpbmcgPSBza2lwcGVkKysgPCByZXNvbHZlZEJlZ2luKSkpIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIHRoaXMkMSQxKSAhPT0gZmFsc2UgJiZcbiAgICAgICAgICBpdGVyYXRpb25zICE9PSBzbGljZVNpemVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcblxuICBzbGljZVNlcS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIGlmIChzbGljZVNpemUgIT09IDAgJiYgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgaW5zdGFudGlhdGluZyBwYXJlbnQgaXRlcmF0b3IgaWYgdGFraW5nIDAuXG4gICAgaWYgKHNsaWNlU2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihpdGVyYXRvckRvbmUpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0b3IgPSBjb2xsZWN0aW9uLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgdmFyIHNraXBwZWQgPSAwO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdoaWxlIChza2lwcGVkKysgPCByZXNvbHZlZEJlZ2luKSB7XG4gICAgICAgIGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIH1cbiAgICAgIGlmICgrK2l0ZXJhdGlvbnMgPiBzbGljZVNpemUpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUyB8fCBzdGVwLmRvbmUpIHtcbiAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCB1bmRlZmluZWQsIHN0ZXApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucyAtIDEsIHN0ZXAudmFsdWVbMV0sIHN0ZXApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBzbGljZVNlcTtcbn1cblxuZnVuY3Rpb24gdGFrZVdoaWxlRmFjdG9yeShjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgdmFyIHRha2VTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgdGFrZVNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICBjb2xsZWN0aW9uLl9faXRlcmF0ZShcbiAgICAgIGZ1bmN0aW9uICh2LCBrLCBjKSB7IHJldHVybiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSAmJiArK2l0ZXJhdGlvbnMgJiYgZm4odiwgaywgdGhpcyQxJDEpOyB9XG4gICAgKTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcbiAgdGFrZVNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgIHZhciBpdGVyYXRpbmcgPSB0cnVlO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFpdGVyYXRpbmcpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfVxuICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgIHZhciBrID0gZW50cnlbMF07XG4gICAgICB2YXIgdiA9IGVudHJ5WzFdO1xuICAgICAgaWYgKCFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDEkMSkpIHtcbiAgICAgICAgaXRlcmF0aW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBzdGVwKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIHRha2VTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gc2tpcFdoaWxlRmFjdG9yeShjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcbiAgdmFyIHNraXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgc2tpcFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICAgIGlmICghKGlzU2tpcHBpbmcgJiYgKGlzU2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkpKSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgcmV0dXJuIGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIHRoaXMkMSQxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcbiAgc2tpcFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgIHZhciBza2lwcGluZyA9IHRydWU7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaztcbiAgICAgIHZhciB2O1xuICAgICAgZG8ge1xuICAgICAgICBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgaWYgKHVzZUtleXMgfHwgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHVuZGVmaW5lZCwgc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZVsxXSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgayA9IGVudHJ5WzBdO1xuICAgICAgICB2ID0gZW50cnlbMV07XG4gICAgICAgIHNraXBwaW5nICYmIChza2lwcGluZyA9IHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIHRoaXMkMSQxKSk7XG4gICAgICB9IHdoaWxlIChza2lwcGluZyk7XG4gICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaywgdiwgc3RlcCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBza2lwU2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIGNvbmNhdEZhY3RvcnkoY29sbGVjdGlvbiwgdmFsdWVzKSB7XG4gIHZhciBpc0tleWVkQ29sbGVjdGlvbiA9IGlzS2V5ZWQoY29sbGVjdGlvbik7XG4gIHZhciBpdGVycyA9IFtjb2xsZWN0aW9uXVxuICAgIC5jb25jYXQodmFsdWVzKVxuICAgIC5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgIGlmICghaXNDb2xsZWN0aW9uKHYpKSB7XG4gICAgICAgIHYgPSBpc0tleWVkQ29sbGVjdGlvblxuICAgICAgICAgID8ga2V5ZWRTZXFGcm9tVmFsdWUodilcbiAgICAgICAgICA6IGluZGV4ZWRTZXFGcm9tVmFsdWUoQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbdl0pO1xuICAgICAgfSBlbHNlIGlmIChpc0tleWVkQ29sbGVjdGlvbikge1xuICAgICAgICB2ID0gS2V5ZWRDb2xsZWN0aW9uKHYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHY7XG4gICAgfSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LnNpemUgIT09IDA7IH0pO1xuXG4gIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIGlmIChpdGVycy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgc2luZ2xldG9uID0gaXRlcnNbMF07XG4gICAgaWYgKFxuICAgICAgc2luZ2xldG9uID09PSBjb2xsZWN0aW9uIHx8XG4gICAgICAoaXNLZXllZENvbGxlY3Rpb24gJiYgaXNLZXllZChzaW5nbGV0b24pKSB8fFxuICAgICAgKGlzSW5kZXhlZChjb2xsZWN0aW9uKSAmJiBpc0luZGV4ZWQoc2luZ2xldG9uKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBzaW5nbGV0b247XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbmNhdFNlcSA9IG5ldyBBcnJheVNlcShpdGVycyk7XG4gIGlmIChpc0tleWVkQ29sbGVjdGlvbikge1xuICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b0tleWVkU2VxKCk7XG4gIH0gZWxzZSBpZiAoIWlzSW5kZXhlZChjb2xsZWN0aW9uKSkge1xuICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b1NldFNlcSgpO1xuICB9XG4gIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS5mbGF0dGVuKHRydWUpO1xuICBjb25jYXRTZXEuc2l6ZSA9IGl0ZXJzLnJlZHVjZShmdW5jdGlvbiAoc3VtLCBzZXEpIHtcbiAgICBpZiAoc3VtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBzaXplID0gc2VxLnNpemU7XG4gICAgICBpZiAoc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBzaXplO1xuICAgICAgfVxuICAgIH1cbiAgfSwgMCk7XG4gIHJldHVybiBjb25jYXRTZXE7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5GYWN0b3J5KGNvbGxlY3Rpb24sIGRlcHRoLCB1c2VLZXlzKSB7XG4gIHZhciBmbGF0U2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgc3RvcHBlZCA9IGZhbHNlO1xuICAgIGZ1bmN0aW9uIGZsYXREZWVwKGl0ZXIsIGN1cnJlbnREZXB0aCkge1xuICAgICAgaXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgaWYgKCghZGVwdGggfHwgY3VycmVudERlcHRoIDwgZGVwdGgpICYmIGlzQ29sbGVjdGlvbih2KSkge1xuICAgICAgICAgIGZsYXREZWVwKHYsIGN1cnJlbnREZXB0aCArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICBpZiAoZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zIC0gMSwgZmxhdFNlcXVlbmNlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXN0b3BwZWQ7XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICB9XG4gICAgZmxhdERlZXAoY29sbGVjdGlvbiwgMCk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG4gIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB3aGlsZSAoaXRlcmF0b3IpIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChzdGVwLmRvbmUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgaXRlcmF0b3IgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdiA9IHN0ZXAudmFsdWU7XG4gICAgICAgIGlmICh0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMpIHtcbiAgICAgICAgICB2ID0gdlsxXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCFkZXB0aCB8fCBzdGFjay5sZW5ndGggPCBkZXB0aCkgJiYgaXNDb2xsZWN0aW9uKHYpKSB7XG4gICAgICAgICAgc3RhY2sucHVzaChpdGVyYXRvcik7XG4gICAgICAgICAgaXRlcmF0b3IgPSB2Ll9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHVzZUtleXMgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHYsIHN0ZXApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBmbGF0U2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIGZsYXRNYXBGYWN0b3J5KGNvbGxlY3Rpb24sIG1hcHBlciwgY29udGV4dCkge1xuICB2YXIgY29lcmNlID0gY29sbGVjdGlvbkNsYXNzKGNvbGxlY3Rpb24pO1xuICByZXR1cm4gY29sbGVjdGlvblxuICAgIC50b1NlcSgpXG4gICAgLm1hcChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gY29lcmNlKG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGssIGNvbGxlY3Rpb24pKTsgfSlcbiAgICAuZmxhdHRlbih0cnVlKTtcbn1cblxuZnVuY3Rpb24gaW50ZXJwb3NlRmFjdG9yeShjb2xsZWN0aW9uLCBzZXBhcmF0b3IpIHtcbiAgdmFyIGludGVycG9zZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgaW50ZXJwb3NlZFNlcXVlbmNlLnNpemUgPSBjb2xsZWN0aW9uLnNpemUgJiYgY29sbGVjdGlvbi5zaXplICogMiAtIDE7XG4gIGludGVycG9zZWRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoXG4gICAgICBmdW5jdGlvbiAodikgeyByZXR1cm4gKCFpdGVyYXRpb25zIHx8IGZuKHNlcGFyYXRvciwgaXRlcmF0aW9ucysrLCB0aGlzJDEkMSkgIT09IGZhbHNlKSAmJlxuICAgICAgICBmbih2LCBpdGVyYXRpb25zKyssIHRoaXMkMSQxKSAhPT0gZmFsc2U7IH0sXG4gICAgICByZXZlcnNlXG4gICAgKTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcbiAgaW50ZXJwb3NlZFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIHN0ZXA7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXN0ZXAgfHwgaXRlcmF0aW9ucyAlIDIpIHtcbiAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucyAlIDJcbiAgICAgICAgPyBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc2VwYXJhdG9yKVxuICAgICAgICA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCBzdGVwLnZhbHVlLCBzdGVwKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIGludGVycG9zZWRTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gc29ydEZhY3RvcnkoY29sbGVjdGlvbiwgY29tcGFyYXRvciwgbWFwcGVyKSB7XG4gIGlmICghY29tcGFyYXRvcikge1xuICAgIGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcbiAgfVxuICB2YXIgaXNLZXllZENvbGxlY3Rpb24gPSBpc0tleWVkKGNvbGxlY3Rpb24pO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgZW50cmllcyA9IGNvbGxlY3Rpb25cbiAgICAudG9TZXEoKVxuICAgIC5tYXAoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIFtrLCB2LCBpbmRleCsrLCBtYXBwZXIgPyBtYXBwZXIodiwgaywgY29sbGVjdGlvbikgOiB2XTsgfSlcbiAgICAudmFsdWVTZXEoKVxuICAgIC50b0FycmF5KCk7XG4gIGVudHJpZXNcbiAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gY29tcGFyYXRvcihhWzNdLCBiWzNdKSB8fCBhWzJdIC0gYlsyXTsgfSlcbiAgICAuZm9yRWFjaChcbiAgICAgIGlzS2V5ZWRDb2xsZWN0aW9uXG4gICAgICAgID8gZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICAgIGVudHJpZXNbaV0ubGVuZ3RoID0gMjtcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICAgIGVudHJpZXNbaV0gPSB2WzFdO1xuICAgICAgICAgIH1cbiAgICApO1xuICByZXR1cm4gaXNLZXllZENvbGxlY3Rpb25cbiAgICA/IEtleWVkU2VxKGVudHJpZXMpXG4gICAgOiBpc0luZGV4ZWQoY29sbGVjdGlvbilcbiAgICA/IEluZGV4ZWRTZXEoZW50cmllcylcbiAgICA6IFNldFNlcShlbnRyaWVzKTtcbn1cblxuZnVuY3Rpb24gbWF4RmFjdG9yeShjb2xsZWN0aW9uLCBjb21wYXJhdG9yLCBtYXBwZXIpIHtcbiAgaWYgKCFjb21wYXJhdG9yKSB7XG4gICAgY29tcGFyYXRvciA9IGRlZmF1bHRDb21wYXJhdG9yO1xuICB9XG4gIGlmIChtYXBwZXIpIHtcbiAgICB2YXIgZW50cnkgPSBjb2xsZWN0aW9uXG4gICAgICAudG9TZXEoKVxuICAgICAgLm1hcChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gW3YsIG1hcHBlcih2LCBrLCBjb2xsZWN0aW9uKV07IH0pXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiAobWF4Q29tcGFyZShjb21wYXJhdG9yLCBhWzFdLCBiWzFdKSA/IGIgOiBhKTsgfSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuICB9XG4gIHJldHVybiBjb2xsZWN0aW9uLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gKG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikgPyBiIDogYSk7IH0pO1xufVxuXG5mdW5jdGlvbiBtYXhDb21wYXJlKGNvbXBhcmF0b3IsIGEsIGIpIHtcbiAgdmFyIGNvbXAgPSBjb21wYXJhdG9yKGIsIGEpO1xuICAvLyBiIGlzIGNvbnNpZGVyZWQgdGhlIG5ldyBtYXggaWYgdGhlIGNvbXBhcmF0b3IgZGVjbGFyZXMgdGhlbSBlcXVhbCwgYnV0XG4gIC8vIHRoZXkgYXJlIG5vdCBlcXVhbCBhbmQgYiBpcyBpbiBmYWN0IGEgbnVsbGlzaCB2YWx1ZS5cbiAgcmV0dXJuIChcbiAgICAoY29tcCA9PT0gMCAmJiBiICE9PSBhICYmIChiID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiICE9PSBiKSkgfHxcbiAgICBjb21wID4gMFxuICApO1xufVxuXG5mdW5jdGlvbiB6aXBXaXRoRmFjdG9yeShrZXlJdGVyLCB6aXBwZXIsIGl0ZXJzLCB6aXBBbGwpIHtcbiAgdmFyIHppcFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGtleUl0ZXIpO1xuICB2YXIgc2l6ZXMgPSBuZXcgQXJyYXlTZXEoaXRlcnMpLm1hcChmdW5jdGlvbiAoaSkgeyByZXR1cm4gaS5zaXplOyB9KTtcbiAgemlwU2VxdWVuY2Uuc2l6ZSA9IHppcEFsbCA/IHNpemVzLm1heCgpIDogc2l6ZXMubWluKCk7XG4gIC8vIE5vdGU6IHRoaXMgYSBnZW5lcmljIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgX19pdGVyYXRlIGluIHRlcm1zIG9mXG4gIC8vIF9faXRlcmF0b3Igd2hpY2ggbWF5IGJlIG1vcmUgZ2VuZXJpY2FsbHkgdXNlZnVsIGluIHRoZSBmdXR1cmUuXG4gIHppcFNlcXVlbmNlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIC8qIGdlbmVyaWM6XG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgdmFyIHN0ZXA7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgIGlmIChmbihzdGVwLnZhbHVlWzFdLCBzdGVwLnZhbHVlWzBdLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgICovXG4gICAgLy8gaW5kZXhlZDpcbiAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgIHZhciBzdGVwO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICBpZiAoZm4oc3RlcC52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICB9O1xuICB6aXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpdGVyYXRvcnMgPSBpdGVycy5tYXAoXG4gICAgICBmdW5jdGlvbiAoaSkgeyByZXR1cm4gKChpID0gQ29sbGVjdGlvbihpKSksIGdldEl0ZXJhdG9yKHJldmVyc2UgPyBpLnJldmVyc2UoKSA6IGkpKTsgfVxuICAgICk7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBpc0RvbmUgPSBmYWxzZTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwcztcbiAgICAgIGlmICghaXNEb25lKSB7XG4gICAgICAgIHN0ZXBzID0gaXRlcmF0b3JzLm1hcChmdW5jdGlvbiAoaSkgeyByZXR1cm4gaS5uZXh0KCk7IH0pO1xuICAgICAgICBpc0RvbmUgPSB6aXBBbGwgPyBzdGVwcy5ldmVyeShmdW5jdGlvbiAocykgeyByZXR1cm4gcy5kb25lOyB9KSA6IHN0ZXBzLnNvbWUoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMuZG9uZTsgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNEb25lKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICB0eXBlLFxuICAgICAgICBpdGVyYXRpb25zKyssXG4gICAgICAgIHppcHBlci5hcHBseShcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHN0ZXBzLm1hcChmdW5jdGlvbiAocykgeyByZXR1cm4gcy52YWx1ZTsgfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIHppcFNlcXVlbmNlO1xufVxuXG4vLyAjcHJhZ21hIEhlbHBlciBGdW5jdGlvbnNcblxuZnVuY3Rpb24gcmVpZnkoaXRlciwgc2VxKSB7XG4gIHJldHVybiBpdGVyID09PSBzZXEgPyBpdGVyIDogaXNTZXEoaXRlcikgPyBzZXEgOiBpdGVyLmNvbnN0cnVjdG9yKHNlcSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlRW50cnkoZW50cnkpIHtcbiAgaWYgKGVudHJ5ICE9PSBPYmplY3QoZW50cnkpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgW0ssIFZdIHR1cGxlOiAnICsgZW50cnkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3Rpb25DbGFzcyhjb2xsZWN0aW9uKSB7XG4gIHJldHVybiBpc0tleWVkKGNvbGxlY3Rpb24pXG4gICAgPyBLZXllZENvbGxlY3Rpb25cbiAgICA6IGlzSW5kZXhlZChjb2xsZWN0aW9uKVxuICAgID8gSW5kZXhlZENvbGxlY3Rpb25cbiAgICA6IFNldENvbGxlY3Rpb247XG59XG5cbmZ1bmN0aW9uIG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKSB7XG4gIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgIChpc0tleWVkKGNvbGxlY3Rpb24pXG4gICAgICA/IEtleWVkU2VxXG4gICAgICA6IGlzSW5kZXhlZChjb2xsZWN0aW9uKVxuICAgICAgPyBJbmRleGVkU2VxXG4gICAgICA6IFNldFNlcVxuICAgICkucHJvdG90eXBlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNhY2hlUmVzdWx0VGhyb3VnaCgpIHtcbiAgaWYgKHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQpIHtcbiAgICB0aGlzLl9pdGVyLmNhY2hlUmVzdWx0KCk7XG4gICAgdGhpcy5zaXplID0gdGhpcy5faXRlci5zaXplO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHJldHVybiBTZXEucHJvdG90eXBlLmNhY2hlUmVzdWx0LmNhbGwodGhpcyk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJhdG9yKGEsIGIpIHtcbiAgaWYgKGEgPT09IHVuZGVmaW5lZCAmJiBiID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChhID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XG59XG5cbmZ1bmN0aW9uIGFyckNvcHkoYXJyLCBvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBsZW4gPSBNYXRoLm1heCgwLCBhcnIubGVuZ3RoIC0gb2Zmc2V0KTtcbiAgdmFyIG5ld0FyciA9IG5ldyBBcnJheShsZW4pO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbGVuOyBpaSsrKSB7XG4gICAgbmV3QXJyW2lpXSA9IGFycltpaSArIG9mZnNldF07XG4gIH1cbiAgcmV0dXJuIG5ld0Fycjtcbn1cblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZXJyb3IpIHtcbiAgaWYgKCFjb25kaXRpb24pIHsgdGhyb3cgbmV3IEVycm9yKGVycm9yKTsgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnROb3RJbmZpbml0ZShzaXplKSB7XG4gIGludmFyaWFudChcbiAgICBzaXplICE9PSBJbmZpbml0eSxcbiAgICAnQ2Fubm90IHBlcmZvcm0gdGhpcyBhY3Rpb24gd2l0aCBhbiBpbmZpbml0ZSBzaXplLidcbiAgKTtcbn1cblxuZnVuY3Rpb24gY29lcmNlS2V5UGF0aChrZXlQYXRoKSB7XG4gIGlmIChpc0FycmF5TGlrZShrZXlQYXRoKSAmJiB0eXBlb2Yga2V5UGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ga2V5UGF0aDtcbiAgfVxuICBpZiAoaXNPcmRlcmVkKGtleVBhdGgpKSB7XG4gICAgcmV0dXJuIGtleVBhdGgudG9BcnJheSgpO1xuICB9XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ0ludmFsaWQga2V5UGF0aDogZXhwZWN0ZWQgT3JkZXJlZCBDb2xsZWN0aW9uIG9yIEFycmF5OiAnICsga2V5UGF0aFxuICApO1xufVxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIC8vIFRoZSBiYXNlIHByb3RvdHlwZSdzIHRvU3RyaW5nIGRlYWxzIHdpdGggQXJndW1lbnQgb2JqZWN0cyBhbmQgbmF0aXZlIG5hbWVzcGFjZXMgbGlrZSBNYXRoXG4gIGlmIChcbiAgICAhdmFsdWUgfHxcbiAgICB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8XG4gICAgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgIT09ICdbb2JqZWN0IE9iamVjdF0nXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSXRlcmF0aXZlbHkgZ29pbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiBpcyBuZWVkZWQgZm9yIGNyb3NzLXJlYWxtIGVudmlyb25tZW50cyAoZGlmZmVyaW5nIGNvbnRleHRzLCBpZnJhbWVzLCBldGMpXG4gIHZhciBwYXJlbnRQcm90byA9IHByb3RvO1xuICB2YXIgbmV4dFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgd2hpbGUgKG5leHRQcm90byAhPT0gbnVsbCkge1xuICAgIHBhcmVudFByb3RvID0gbmV4dFByb3RvO1xuICAgIG5leHRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwYXJlbnRQcm90byk7XG4gIH1cbiAgcmV0dXJuIHBhcmVudFByb3RvID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGlzIGEgcG90ZW50aWFsbHktcGVyc2lzdGVudCBkYXRhIHN0cnVjdHVyZSwgZWl0aGVyXG4gKiBwcm92aWRlZCBieSBJbW11dGFibGUuanMgb3IgYSBwbGFpbiBBcnJheSBvciBPYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGlzRGF0YVN0cnVjdHVyZSh2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAoaXNJbW11dGFibGUodmFsdWUpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpIHx8IGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICApO1xufVxuXG5mdW5jdGlvbiBxdW90ZVN0cmluZyh2YWx1ZSkge1xuICB0cnkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5zdHJpbmdpZnkodmFsdWUpIDogU3RyaW5nKHZhbHVlKTtcbiAgfSBjYXRjaCAoX2lnbm9yZUVycm9yKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXMoY29sbGVjdGlvbiwga2V5KSB7XG4gIHJldHVybiBpc0ltbXV0YWJsZShjb2xsZWN0aW9uKVxuICAgID8gY29sbGVjdGlvbi5oYXMoa2V5KVxuICAgIDogaXNEYXRhU3RydWN0dXJlKGNvbGxlY3Rpb24pICYmIGhhc093blByb3BlcnR5LmNhbGwoY29sbGVjdGlvbiwga2V5KTtcbn1cblxuZnVuY3Rpb24gZ2V0KGNvbGxlY3Rpb24sIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgcmV0dXJuIGlzSW1tdXRhYmxlKGNvbGxlY3Rpb24pXG4gICAgPyBjb2xsZWN0aW9uLmdldChrZXksIG5vdFNldFZhbHVlKVxuICAgIDogIWhhcyhjb2xsZWN0aW9uLCBrZXkpXG4gICAgPyBub3RTZXRWYWx1ZVxuICAgIDogdHlwZW9mIGNvbGxlY3Rpb24uZ2V0ID09PSAnZnVuY3Rpb24nXG4gICAgPyBjb2xsZWN0aW9uLmdldChrZXkpXG4gICAgOiBjb2xsZWN0aW9uW2tleV07XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dDb3B5KGZyb20pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZnJvbSkpIHtcbiAgICByZXR1cm4gYXJyQ29weShmcm9tKTtcbiAgfVxuICB2YXIgdG8gPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG4gICAgICB0b1trZXldID0gZnJvbVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdG87XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShjb2xsZWN0aW9uLCBrZXkpIHtcbiAgaWYgKCFpc0RhdGFTdHJ1Y3R1cmUoY29sbGVjdGlvbikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ0Nhbm5vdCB1cGRhdGUgbm9uLWRhdGEtc3RydWN0dXJlIHZhbHVlOiAnICsgY29sbGVjdGlvblxuICAgICk7XG4gIH1cbiAgaWYgKGlzSW1tdXRhYmxlKGNvbGxlY3Rpb24pKSB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLnJlbW92ZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCB1cGRhdGUgaW1tdXRhYmxlIHZhbHVlIHdpdGhvdXQgLnJlbW92ZSgpIG1ldGhvZDogJyArIGNvbGxlY3Rpb25cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLnJlbW92ZShrZXkpO1xuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChjb2xsZWN0aW9uLCBrZXkpKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cbiAgdmFyIGNvbGxlY3Rpb25Db3B5ID0gc2hhbGxvd0NvcHkoY29sbGVjdGlvbik7XG4gIGlmIChBcnJheS5pc0FycmF5KGNvbGxlY3Rpb25Db3B5KSkge1xuICAgIGNvbGxlY3Rpb25Db3B5LnNwbGljZShrZXksIDEpO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBjb2xsZWN0aW9uQ29weVtrZXldO1xuICB9XG4gIHJldHVybiBjb2xsZWN0aW9uQ29weTtcbn1cblxuZnVuY3Rpb24gc2V0KGNvbGxlY3Rpb24sIGtleSwgdmFsdWUpIHtcbiAgaWYgKCFpc0RhdGFTdHJ1Y3R1cmUoY29sbGVjdGlvbikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ0Nhbm5vdCB1cGRhdGUgbm9uLWRhdGEtc3RydWN0dXJlIHZhbHVlOiAnICsgY29sbGVjdGlvblxuICAgICk7XG4gIH1cbiAgaWYgKGlzSW1tdXRhYmxlKGNvbGxlY3Rpb24pKSB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLnNldCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCB1cGRhdGUgaW1tdXRhYmxlIHZhbHVlIHdpdGhvdXQgLnNldCgpIG1ldGhvZDogJyArIGNvbGxlY3Rpb25cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLnNldChrZXksIHZhbHVlKTtcbiAgfVxuICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb2xsZWN0aW9uLCBrZXkpICYmIHZhbHVlID09PSBjb2xsZWN0aW9uW2tleV0pIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuICB2YXIgY29sbGVjdGlvbkNvcHkgPSBzaGFsbG93Q29weShjb2xsZWN0aW9uKTtcbiAgY29sbGVjdGlvbkNvcHlba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gY29sbGVjdGlvbkNvcHk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUluJDEoY29sbGVjdGlvbiwga2V5UGF0aCwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgaWYgKCF1cGRhdGVyKSB7XG4gICAgdXBkYXRlciA9IG5vdFNldFZhbHVlO1xuICAgIG5vdFNldFZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG4gIHZhciB1cGRhdGVkVmFsdWUgPSB1cGRhdGVJbkRlZXBseShcbiAgICBpc0ltbXV0YWJsZShjb2xsZWN0aW9uKSxcbiAgICBjb2xsZWN0aW9uLFxuICAgIGNvZXJjZUtleVBhdGgoa2V5UGF0aCksXG4gICAgMCxcbiAgICBub3RTZXRWYWx1ZSxcbiAgICB1cGRhdGVyXG4gICk7XG4gIHJldHVybiB1cGRhdGVkVmFsdWUgPT09IE5PVF9TRVQgPyBub3RTZXRWYWx1ZSA6IHVwZGF0ZWRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSW5EZWVwbHkoXG4gIGluSW1tdXRhYmxlLFxuICBleGlzdGluZyxcbiAga2V5UGF0aCxcbiAgaSxcbiAgbm90U2V0VmFsdWUsXG4gIHVwZGF0ZXJcbikge1xuICB2YXIgd2FzTm90U2V0ID0gZXhpc3RpbmcgPT09IE5PVF9TRVQ7XG4gIGlmIChpID09PSBrZXlQYXRoLmxlbmd0aCkge1xuICAgIHZhciBleGlzdGluZ1ZhbHVlID0gd2FzTm90U2V0ID8gbm90U2V0VmFsdWUgOiBleGlzdGluZztcbiAgICB2YXIgbmV3VmFsdWUgPSB1cGRhdGVyKGV4aXN0aW5nVmFsdWUpO1xuICAgIHJldHVybiBuZXdWYWx1ZSA9PT0gZXhpc3RpbmdWYWx1ZSA/IGV4aXN0aW5nIDogbmV3VmFsdWU7XG4gIH1cbiAgaWYgKCF3YXNOb3RTZXQgJiYgIWlzRGF0YVN0cnVjdHVyZShleGlzdGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ0Nhbm5vdCB1cGRhdGUgd2l0aGluIG5vbi1kYXRhLXN0cnVjdHVyZSB2YWx1ZSBpbiBwYXRoIFsnICtcbiAgICAgICAga2V5UGF0aC5zbGljZSgwLCBpKS5tYXAocXVvdGVTdHJpbmcpICtcbiAgICAgICAgJ106ICcgK1xuICAgICAgICBleGlzdGluZ1xuICAgICk7XG4gIH1cbiAgdmFyIGtleSA9IGtleVBhdGhbaV07XG4gIHZhciBuZXh0RXhpc3RpbmcgPSB3YXNOb3RTZXQgPyBOT1RfU0VUIDogZ2V0KGV4aXN0aW5nLCBrZXksIE5PVF9TRVQpO1xuICB2YXIgbmV4dFVwZGF0ZWQgPSB1cGRhdGVJbkRlZXBseShcbiAgICBuZXh0RXhpc3RpbmcgPT09IE5PVF9TRVQgPyBpbkltbXV0YWJsZSA6IGlzSW1tdXRhYmxlKG5leHRFeGlzdGluZyksXG4gICAgbmV4dEV4aXN0aW5nLFxuICAgIGtleVBhdGgsXG4gICAgaSArIDEsXG4gICAgbm90U2V0VmFsdWUsXG4gICAgdXBkYXRlclxuICApO1xuICByZXR1cm4gbmV4dFVwZGF0ZWQgPT09IG5leHRFeGlzdGluZ1xuICAgID8gZXhpc3RpbmdcbiAgICA6IG5leHRVcGRhdGVkID09PSBOT1RfU0VUXG4gICAgPyByZW1vdmUoZXhpc3RpbmcsIGtleSlcbiAgICA6IHNldChcbiAgICAgICAgd2FzTm90U2V0ID8gKGluSW1tdXRhYmxlID8gZW1wdHlNYXAoKSA6IHt9KSA6IGV4aXN0aW5nLFxuICAgICAgICBrZXksXG4gICAgICAgIG5leHRVcGRhdGVkXG4gICAgICApO1xufVxuXG5mdW5jdGlvbiBzZXRJbiQxKGNvbGxlY3Rpb24sIGtleVBhdGgsIHZhbHVlKSB7XG4gIHJldHVybiB1cGRhdGVJbiQxKGNvbGxlY3Rpb24sIGtleVBhdGgsIE5PVF9TRVQsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbHVlOyB9KTtcbn1cblxuZnVuY3Rpb24gc2V0SW4oa2V5UGF0aCwgdikge1xuICByZXR1cm4gc2V0SW4kMSh0aGlzLCBrZXlQYXRoLCB2KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSW4oY29sbGVjdGlvbiwga2V5UGF0aCkge1xuICByZXR1cm4gdXBkYXRlSW4kMShjb2xsZWN0aW9uLCBrZXlQYXRoLCBmdW5jdGlvbiAoKSB7IHJldHVybiBOT1RfU0VUOyB9KTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlSW4oa2V5UGF0aCkge1xuICByZXR1cm4gcmVtb3ZlSW4odGhpcywga2V5UGF0aCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSQxKGNvbGxlY3Rpb24sIGtleSwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgcmV0dXJuIHVwZGF0ZUluJDEoY29sbGVjdGlvbiwgW2tleV0sIG5vdFNldFZhbHVlLCB1cGRhdGVyKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKGtleSwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICA/IGtleSh0aGlzKVxuICAgIDogdXBkYXRlJDEodGhpcywga2V5LCBub3RTZXRWYWx1ZSwgdXBkYXRlcik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUluKGtleVBhdGgsIG5vdFNldFZhbHVlLCB1cGRhdGVyKSB7XG4gIHJldHVybiB1cGRhdGVJbiQxKHRoaXMsIGtleVBhdGgsIG5vdFNldFZhbHVlLCB1cGRhdGVyKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2UkMSgpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gIHJldHVybiBtZXJnZUludG9LZXllZFdpdGgodGhpcywgaXRlcnMpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVdpdGgkMShtZXJnZXIpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGl0ZXJzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIGlmICh0eXBlb2YgbWVyZ2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBtZXJnZXIgZnVuY3Rpb246ICcgKyBtZXJnZXIpO1xuICB9XG4gIHJldHVybiBtZXJnZUludG9LZXllZFdpdGgodGhpcywgaXRlcnMsIG1lcmdlcik7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW50b0tleWVkV2l0aChjb2xsZWN0aW9uLCBjb2xsZWN0aW9ucywgbWVyZ2VyKSB7XG4gIHZhciBpdGVycyA9IFtdO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgY29sbGVjdGlvbnMubGVuZ3RoOyBpaSsrKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24kMSA9IEtleWVkQ29sbGVjdGlvbihjb2xsZWN0aW9uc1tpaV0pO1xuICAgIGlmIChjb2xsZWN0aW9uJDEuc2l6ZSAhPT0gMCkge1xuICAgICAgaXRlcnMucHVzaChjb2xsZWN0aW9uJDEpO1xuICAgIH1cbiAgfVxuICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cbiAgaWYgKFxuICAgIGNvbGxlY3Rpb24udG9TZXEoKS5zaXplID09PSAwICYmXG4gICAgIWNvbGxlY3Rpb24uX19vd25lcklEICYmXG4gICAgaXRlcnMubGVuZ3RoID09PSAxXG4gICkge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmNvbnN0cnVjdG9yKGl0ZXJzWzBdKTtcbiAgfVxuICByZXR1cm4gY29sbGVjdGlvbi53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgdmFyIG1lcmdlSW50b0NvbGxlY3Rpb24gPSBtZXJnZXJcbiAgICAgID8gZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICB1cGRhdGUkMShjb2xsZWN0aW9uLCBrZXksIE5PVF9TRVQsIGZ1bmN0aW9uIChvbGRWYWwpIHsgcmV0dXJuIG9sZFZhbCA9PT0gTk9UX1NFVCA/IHZhbHVlIDogbWVyZ2VyKG9sZFZhbCwgdmFsdWUsIGtleSk7IH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH07XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJzLmxlbmd0aDsgaWkrKykge1xuICAgICAgaXRlcnNbaWldLmZvckVhY2gobWVyZ2VJbnRvQ29sbGVjdGlvbik7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gbWVyZ2UoY29sbGVjdGlvbikge1xuICB2YXIgc291cmNlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBzb3VyY2VzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHJldHVybiBtZXJnZVdpdGhTb3VyY2VzKGNvbGxlY3Rpb24sIHNvdXJjZXMpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVdpdGgobWVyZ2VyLCBjb2xsZWN0aW9uKSB7XG4gIHZhciBzb3VyY2VzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIHNvdXJjZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAyIF07XG5cbiAgcmV0dXJuIG1lcmdlV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgbWVyZ2VyKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwJDEoY29sbGVjdGlvbikge1xuICB2YXIgc291cmNlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBzb3VyY2VzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHJldHVybiBtZXJnZURlZXBXaXRoU291cmNlcyhjb2xsZWN0aW9uLCBzb3VyY2VzKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwV2l0aCQxKG1lcmdlciwgY29sbGVjdGlvbikge1xuICB2YXIgc291cmNlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBzb3VyY2VzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMiBdO1xuXG4gIHJldHVybiBtZXJnZURlZXBXaXRoU291cmNlcyhjb2xsZWN0aW9uLCBzb3VyY2VzLCBtZXJnZXIpO1xufVxuXG5mdW5jdGlvbiBtZXJnZURlZXBXaXRoU291cmNlcyhjb2xsZWN0aW9uLCBzb3VyY2VzLCBtZXJnZXIpIHtcbiAgcmV0dXJuIG1lcmdlV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgZGVlcE1lcmdlcldpdGgobWVyZ2VyKSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgbWVyZ2VyKSB7XG4gIGlmICghaXNEYXRhU3RydWN0dXJlKGNvbGxlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdDYW5ub3QgbWVyZ2UgaW50byBub24tZGF0YS1zdHJ1Y3R1cmUgdmFsdWU6ICcgKyBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuICBpZiAoaXNJbW11dGFibGUoY29sbGVjdGlvbikpIHtcbiAgICByZXR1cm4gdHlwZW9mIG1lcmdlciA9PT0gJ2Z1bmN0aW9uJyAmJiBjb2xsZWN0aW9uLm1lcmdlV2l0aFxuICAgICAgPyBjb2xsZWN0aW9uLm1lcmdlV2l0aC5hcHBseShjb2xsZWN0aW9uLCBbIG1lcmdlciBdLmNvbmNhdCggc291cmNlcyApKVxuICAgICAgOiBjb2xsZWN0aW9uLm1lcmdlXG4gICAgICA/IGNvbGxlY3Rpb24ubWVyZ2UuYXBwbHkoY29sbGVjdGlvbiwgc291cmNlcylcbiAgICAgIDogY29sbGVjdGlvbi5jb25jYXQuYXBwbHkoY29sbGVjdGlvbiwgc291cmNlcyk7XG4gIH1cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvbGxlY3Rpb24pO1xuICB2YXIgbWVyZ2VkID0gY29sbGVjdGlvbjtcbiAgdmFyIENvbGxlY3Rpb24gPSBpc0FycmF5ID8gSW5kZXhlZENvbGxlY3Rpb24gOiBLZXllZENvbGxlY3Rpb247XG4gIHZhciBtZXJnZUl0ZW0gPSBpc0FycmF5XG4gICAgPyBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gQ29weSBvbiB3cml0ZVxuICAgICAgICBpZiAobWVyZ2VkID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgbWVyZ2VkID0gc2hhbGxvd0NvcHkobWVyZ2VkKTtcbiAgICAgICAgfVxuICAgICAgICBtZXJnZWQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgOiBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICB2YXIgaGFzVmFsID0gaGFzT3duUHJvcGVydHkuY2FsbChtZXJnZWQsIGtleSk7XG4gICAgICAgIHZhciBuZXh0VmFsID1cbiAgICAgICAgICBoYXNWYWwgJiYgbWVyZ2VyID8gbWVyZ2VyKG1lcmdlZFtrZXldLCB2YWx1ZSwga2V5KSA6IHZhbHVlO1xuICAgICAgICBpZiAoIWhhc1ZhbCB8fCBuZXh0VmFsICE9PSBtZXJnZWRba2V5XSkge1xuICAgICAgICAgIC8vIENvcHkgb24gd3JpdGVcbiAgICAgICAgICBpZiAobWVyZ2VkID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBtZXJnZWQgPSBzaGFsbG93Q29weShtZXJnZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXJnZWRba2V5XSA9IG5leHRWYWw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuICAgIENvbGxlY3Rpb24oc291cmNlc1tpXSkuZm9yRWFjaChtZXJnZUl0ZW0pO1xuICB9XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZXBNZXJnZXJXaXRoKG1lcmdlcikge1xuICBmdW5jdGlvbiBkZWVwTWVyZ2VyKG9sZFZhbHVlLCBuZXdWYWx1ZSwga2V5KSB7XG4gICAgcmV0dXJuIGlzRGF0YVN0cnVjdHVyZShvbGRWYWx1ZSkgJiZcbiAgICAgIGlzRGF0YVN0cnVjdHVyZShuZXdWYWx1ZSkgJiZcbiAgICAgIGFyZU1lcmdlYWJsZShvbGRWYWx1ZSwgbmV3VmFsdWUpXG4gICAgICA/IG1lcmdlV2l0aFNvdXJjZXMob2xkVmFsdWUsIFtuZXdWYWx1ZV0sIGRlZXBNZXJnZXIpXG4gICAgICA6IG1lcmdlclxuICAgICAgPyBtZXJnZXIob2xkVmFsdWUsIG5ld1ZhbHVlLCBrZXkpXG4gICAgICA6IG5ld1ZhbHVlO1xuICB9XG4gIHJldHVybiBkZWVwTWVyZ2VyO1xufVxuXG4vKipcbiAqIEl0J3MgdW5jbGVhciB3aGF0IHRoZSBkZXNpcmVkIGJlaGF2aW9yIGlzIGZvciBtZXJnaW5nIHR3byBjb2xsZWN0aW9ucyB0aGF0XG4gKiBmYWxsIGludG8gc2VwYXJhdGUgY2F0ZWdvcmllcyBiZXR3ZWVuIGtleWVkLCBpbmRleGVkLCBvciBzZXQtbGlrZSwgc28gd2Ugb25seVxuICogY29uc2lkZXIgdGhlbSBtZXJnZWFibGUgaWYgdGhleSBmYWxsIGludG8gdGhlIHNhbWUgY2F0ZWdvcnkuXG4gKi9cbmZ1bmN0aW9uIGFyZU1lcmdlYWJsZShvbGREYXRhU3RydWN0dXJlLCBuZXdEYXRhU3RydWN0dXJlKSB7XG4gIHZhciBvbGRTZXEgPSBTZXEob2xkRGF0YVN0cnVjdHVyZSk7XG4gIHZhciBuZXdTZXEgPSBTZXEobmV3RGF0YVN0cnVjdHVyZSk7XG4gIC8vIFRoaXMgbG9naWMgYXNzdW1lcyB0aGF0IGEgc2VxdWVuY2UgY2FuIG9ubHkgZmFsbCBpbnRvIG9uZSBvZiB0aGUgdGhyZWVcbiAgLy8gY2F0ZWdvcmllcyBtZW50aW9uZWQgYWJvdmUgKHNpbmNlIHRoZXJlJ3Mgbm8gYGlzU2V0TGlrZSgpYCBtZXRob2QpLlxuICByZXR1cm4gKFxuICAgIGlzSW5kZXhlZChvbGRTZXEpID09PSBpc0luZGV4ZWQobmV3U2VxKSAmJlxuICAgIGlzS2V5ZWQob2xkU2VxKSA9PT0gaXNLZXllZChuZXdTZXEpXG4gICk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcCgpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gIHJldHVybiBtZXJnZURlZXBXaXRoU291cmNlcyh0aGlzLCBpdGVycyk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcFdpdGgobWVyZ2VyKSB7XG4gIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICByZXR1cm4gbWVyZ2VEZWVwV2l0aFNvdXJjZXModGhpcywgaXRlcnMsIG1lcmdlcik7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW4oa2V5UGF0aCkge1xuICB2YXIgaXRlcnMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgcmV0dXJuIHVwZGF0ZUluJDEodGhpcywga2V5UGF0aCwgZW1wdHlNYXAoKSwgZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1lcmdlV2l0aFNvdXJjZXMobSwgaXRlcnMpOyB9KTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwSW4oa2V5UGF0aCkge1xuICB2YXIgaXRlcnMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgcmV0dXJuIHVwZGF0ZUluJDEodGhpcywga2V5UGF0aCwgZW1wdHlNYXAoKSwgZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1lcmdlRGVlcFdpdGhTb3VyY2VzKG0sIGl0ZXJzKTsgfVxuICApO1xufVxuXG5mdW5jdGlvbiB3aXRoTXV0YXRpb25zKGZuKSB7XG4gIHZhciBtdXRhYmxlID0gdGhpcy5hc011dGFibGUoKTtcbiAgZm4obXV0YWJsZSk7XG4gIHJldHVybiBtdXRhYmxlLndhc0FsdGVyZWQoKSA/IG11dGFibGUuX19lbnN1cmVPd25lcih0aGlzLl9fb3duZXJJRCkgOiB0aGlzO1xufVxuXG5mdW5jdGlvbiBhc011dGFibGUoKSB7XG4gIHJldHVybiB0aGlzLl9fb3duZXJJRCA/IHRoaXMgOiB0aGlzLl9fZW5zdXJlT3duZXIobmV3IE93bmVySUQoKSk7XG59XG5cbmZ1bmN0aW9uIGFzSW1tdXRhYmxlKCkge1xuICByZXR1cm4gdGhpcy5fX2Vuc3VyZU93bmVyKCk7XG59XG5cbmZ1bmN0aW9uIHdhc0FsdGVyZWQoKSB7XG4gIHJldHVybiB0aGlzLl9fYWx0ZXJlZDtcbn1cblxudmFyIE1hcCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEtleWVkQ29sbGVjdGlvbikge1xuICBmdW5jdGlvbiBNYXAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eU1hcCgpXG4gICAgICA6IGlzTWFwKHZhbHVlKSAmJiAhaXNPcmRlcmVkKHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgIHZhciBpdGVyID0gS2V5ZWRDb2xsZWN0aW9uKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gbWFwLnNldChrLCB2KTsgfSk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgaWYgKCBLZXllZENvbGxlY3Rpb24gKSBNYXAuX19wcm90b19fID0gS2V5ZWRDb2xsZWN0aW9uO1xuICBNYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggS2V5ZWRDb2xsZWN0aW9uICYmIEtleWVkQ29sbGVjdGlvbi5wcm90b3R5cGUgKTtcbiAgTWFwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1hcDtcblxuICBNYXAub2YgPSBmdW5jdGlvbiBvZiAoKSB7XG4gICAgdmFyIGtleVZhbHVlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBrZXlWYWx1ZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIHJldHVybiBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKG1hcCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgaWYgKGkgKyAxID49IGtleVZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgdmFsdWUgZm9yIGtleTogJyArIGtleVZhbHVlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFwLnNldChrZXlWYWx1ZXNbaV0sIGtleVZhbHVlc1tpICsgMV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIE1hcC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnTWFwIHsnLCAnfScpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGssIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3RcbiAgICAgID8gdGhpcy5fcm9vdC5nZXQoMCwgdW5kZWZpbmVkLCBrLCBub3RTZXRWYWx1ZSlcbiAgICAgIDogbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAoaywgdikge1xuICAgIHJldHVybiB1cGRhdGVNYXAodGhpcywgaywgdik7XG4gIH07XG5cbiAgTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGspIHtcbiAgICByZXR1cm4gdXBkYXRlTWFwKHRoaXMsIGssIE5PVF9TRVQpO1xuICB9O1xuXG4gIE1hcC5wcm90b3R5cGUuZGVsZXRlQWxsID0gZnVuY3Rpb24gZGVsZXRlQWxsIChrZXlzKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBDb2xsZWN0aW9uKGtleXMpO1xuXG4gICAgaWYgKGNvbGxlY3Rpb24uc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobWFwKSB7XG4gICAgICBjb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gbWFwLnJlbW92ZShrZXkpOyB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIgKCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBlbXB0eU1hcCgpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQ29tcG9zaXRpb25cblxuICBNYXAucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiBzb3J0IChjb21wYXJhdG9yKSB7XG4gICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuICB9O1xuXG4gIE1hcC5wcm90b3R5cGUuc29ydEJ5ID0gZnVuY3Rpb24gc29ydEJ5IChtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICByZXR1cm4gT3JkZXJlZE1hcChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpKTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcCAobWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKG1hcCkge1xuICAgICAgbWFwLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgbWFwLnNldChrZXksIG1hcHBlci5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIHRoaXMkMSQxKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIE11dGFiaWxpdHlcblxuICBNYXAucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlKTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHRoaXMuX3Jvb3QgJiZcbiAgICAgIHRoaXMuX3Jvb3QuaXRlcmF0ZShmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICByZXR1cm4gZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDEkMSk7XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eU1hcCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZU1hcCh0aGlzLnNpemUsIHRoaXMuX3Jvb3QsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgfTtcblxuICByZXR1cm4gTWFwO1xufShLZXllZENvbGxlY3Rpb24pKTtcblxuTWFwLmlzTWFwID0gaXNNYXA7XG5cbnZhciBNYXBQcm90b3R5cGUgPSBNYXAucHJvdG90eXBlO1xuTWFwUHJvdG90eXBlW0lTX01BUF9TWU1CT0xdID0gdHJ1ZTtcbk1hcFByb3RvdHlwZVtERUxFVEVdID0gTWFwUHJvdG90eXBlLnJlbW92ZTtcbk1hcFByb3RvdHlwZS5yZW1vdmVBbGwgPSBNYXBQcm90b3R5cGUuZGVsZXRlQWxsO1xuTWFwUHJvdG90eXBlLnNldEluID0gc2V0SW47XG5NYXBQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUuZGVsZXRlSW4gPSBkZWxldGVJbjtcbk1hcFByb3RvdHlwZS51cGRhdGUgPSB1cGRhdGU7XG5NYXBQcm90b3R5cGUudXBkYXRlSW4gPSB1cGRhdGVJbjtcbk1hcFByb3RvdHlwZS5tZXJnZSA9IE1hcFByb3RvdHlwZS5jb25jYXQgPSBtZXJnZSQxO1xuTWFwUHJvdG90eXBlLm1lcmdlV2l0aCA9IG1lcmdlV2l0aCQxO1xuTWFwUHJvdG90eXBlLm1lcmdlRGVlcCA9IG1lcmdlRGVlcDtcbk1hcFByb3RvdHlwZS5tZXJnZURlZXBXaXRoID0gbWVyZ2VEZWVwV2l0aDtcbk1hcFByb3RvdHlwZS5tZXJnZUluID0gbWVyZ2VJbjtcbk1hcFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IG1lcmdlRGVlcEluO1xuTWFwUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuTWFwUHJvdG90eXBlLndhc0FsdGVyZWQgPSB3YXNBbHRlcmVkO1xuTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5NYXBQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlID0gYXNNdXRhYmxlO1xuTWFwUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgYXJyKSB7XG4gIHJldHVybiByZXN1bHQuc2V0KGFyclswXSwgYXJyWzFdKTtcbn07XG5NYXBQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iai5hc0ltbXV0YWJsZSgpO1xufTtcblxuLy8gI3ByYWdtYSBUcmllIE5vZGVzXG5cbnZhciBBcnJheU1hcE5vZGUgPSBmdW5jdGlvbiBBcnJheU1hcE5vZGUob3duZXJJRCwgZW50cmllcykge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xufTtcblxuQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuICAgICAgcmV0dXJuIGVudHJpZXNbaWldWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbm90U2V0VmFsdWU7XG59O1xuXG5BcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7XG4gIGZvciAoOyBpZHggPCBsZW47IGlkeCsrKSB7XG4gICAgaWYgKGlzKGtleSwgZW50cmllc1tpZHhdWzBdKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBleGlzdHMgPSBpZHggPCBsZW47XG5cbiAgaWYgKGV4aXN0cyA/IGVudHJpZXNbaWR4XVsxXSA9PT0gdmFsdWUgOiByZW1vdmVkKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAocmVtb3ZlZCB8fCAhZXhpc3RzKSAmJiBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG5cbiAgaWYgKHJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKCFleGlzdHMgJiYgIXJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPj0gTUFYX0FSUkFZX01BUF9TSVpFKSB7XG4gICAgcmV0dXJuIGNyZWF0ZU5vZGVzKG93bmVySUQsIGVudHJpZXMsIGtleSwgdmFsdWUpO1xuICB9XG5cbiAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cbiAgaWYgKGV4aXN0cykge1xuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICBpZHggPT09IGxlbiAtIDFcbiAgICAgICAgPyBuZXdFbnRyaWVzLnBvcCgpXG4gICAgICAgIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9XG5cbiAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBBcnJheU1hcE5vZGUob3duZXJJRCwgbmV3RW50cmllcyk7XG59O1xuXG52YXIgQml0bWFwSW5kZXhlZE5vZGUgPSBmdW5jdGlvbiBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBiaXRtYXAsIG5vZGVzKSB7XG4gIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gIHRoaXMuYml0bWFwID0gYml0bWFwO1xuICB0aGlzLm5vZGVzID0gbm9kZXM7XG59O1xuXG5CaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgfVxuICB2YXIgYml0ID0gMSA8PCAoKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0spO1xuICB2YXIgYml0bWFwID0gdGhpcy5iaXRtYXA7XG4gIHJldHVybiAoYml0bWFwICYgYml0KSA9PT0gMFxuICAgID8gbm90U2V0VmFsdWVcbiAgICA6IHRoaXMubm9kZXNbcG9wQ291bnQoYml0bWFwICYgKGJpdCAtIDEpKV0uZ2V0KFxuICAgICAgICBzaGlmdCArIFNISUZULFxuICAgICAgICBrZXlIYXNoLFxuICAgICAgICBrZXksXG4gICAgICAgIG5vdFNldFZhbHVlXG4gICAgICApO1xufTtcblxuQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICB9XG4gIHZhciBrZXlIYXNoRnJhZyA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICB2YXIgYml0ID0gMSA8PCBrZXlIYXNoRnJhZztcbiAgdmFyIGJpdG1hcCA9IHRoaXMuYml0bWFwO1xuICB2YXIgZXhpc3RzID0gKGJpdG1hcCAmIGJpdCkgIT09IDA7XG5cbiAgaWYgKCFleGlzdHMgJiYgdmFsdWUgPT09IE5PVF9TRVQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBpZHggPSBwb3BDb3VudChiaXRtYXAgJiAoYml0IC0gMSkpO1xuICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICB2YXIgbm9kZSA9IGV4aXN0cyA/IG5vZGVzW2lkeF0gOiB1bmRlZmluZWQ7XG4gIHZhciBuZXdOb2RlID0gdXBkYXRlTm9kZShcbiAgICBub2RlLFxuICAgIG93bmVySUQsXG4gICAgc2hpZnQgKyBTSElGVCxcbiAgICBrZXlIYXNoLFxuICAgIGtleSxcbiAgICB2YWx1ZSxcbiAgICBkaWRDaGFuZ2VTaXplLFxuICAgIGRpZEFsdGVyXG4gICk7XG5cbiAgaWYgKG5ld05vZGUgPT09IG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmICghZXhpc3RzICYmIG5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID49IE1BWF9CSVRNQVBfSU5ERVhFRF9TSVpFKSB7XG4gICAgcmV0dXJuIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGtleUhhc2hGcmFnLCBuZXdOb2RlKTtcbiAgfVxuXG4gIGlmIChcbiAgICBleGlzdHMgJiZcbiAgICAhbmV3Tm9kZSAmJlxuICAgIG5vZGVzLmxlbmd0aCA9PT0gMiAmJlxuICAgIGlzTGVhZk5vZGUobm9kZXNbaWR4IF4gMV0pXG4gICkge1xuICAgIHJldHVybiBub2Rlc1tpZHggXiAxXTtcbiAgfVxuXG4gIGlmIChleGlzdHMgJiYgbmV3Tm9kZSAmJiBub2Rlcy5sZW5ndGggPT09IDEgJiYgaXNMZWFmTm9kZShuZXdOb2RlKSkge1xuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG5cbiAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgdmFyIG5ld0JpdG1hcCA9IGV4aXN0cyA/IChuZXdOb2RlID8gYml0bWFwIDogYml0bWFwIF4gYml0KSA6IGJpdG1hcCB8IGJpdDtcbiAgdmFyIG5ld05vZGVzID0gZXhpc3RzXG4gICAgPyBuZXdOb2RlXG4gICAgICA/IHNldEF0KG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpXG4gICAgICA6IHNwbGljZU91dChub2RlcywgaWR4LCBpc0VkaXRhYmxlKVxuICAgIDogc3BsaWNlSW4obm9kZXMsIGlkeCwgbmV3Tm9kZSwgaXNFZGl0YWJsZSk7XG5cbiAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICB0aGlzLmJpdG1hcCA9IG5ld0JpdG1hcDtcbiAgICB0aGlzLm5vZGVzID0gbmV3Tm9kZXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gbmV3IEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIG5ld0JpdG1hcCwgbmV3Tm9kZXMpO1xufTtcblxudmFyIEhhc2hBcnJheU1hcE5vZGUgPSBmdW5jdGlvbiBIYXNoQXJyYXlNYXBOb2RlKG93bmVySUQsIGNvdW50LCBub2Rlcykge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmNvdW50ID0gY291bnQ7XG4gIHRoaXMubm9kZXMgPSBub2Rlcztcbn07XG5cbkhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gIH1cbiAgdmFyIGlkeCA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICB2YXIgbm9kZSA9IHRoaXMubm9kZXNbaWR4XTtcbiAgcmV0dXJuIG5vZGVcbiAgICA/IG5vZGUuZ2V0KHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpXG4gICAgOiBub3RTZXRWYWx1ZTtcbn07XG5cbkhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICB9XG4gIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgdmFyIHJlbW92ZWQgPSB2YWx1ZSA9PT0gTk9UX1NFVDtcbiAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgdmFyIG5vZGUgPSBub2Rlc1tpZHhdO1xuXG4gIGlmIChyZW1vdmVkICYmICFub2RlKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHVwZGF0ZU5vZGUoXG4gICAgbm9kZSxcbiAgICBvd25lcklELFxuICAgIHNoaWZ0ICsgU0hJRlQsXG4gICAga2V5SGFzaCxcbiAgICBrZXksXG4gICAgdmFsdWUsXG4gICAgZGlkQ2hhbmdlU2l6ZSxcbiAgICBkaWRBbHRlclxuICApO1xuICBpZiAobmV3Tm9kZSA9PT0gbm9kZSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIG5ld0NvdW50ID0gdGhpcy5jb3VudDtcbiAgaWYgKCFub2RlKSB7XG4gICAgbmV3Q291bnQrKztcbiAgfSBlbHNlIGlmICghbmV3Tm9kZSkge1xuICAgIG5ld0NvdW50LS07XG4gICAgaWYgKG5ld0NvdW50IDwgTUlOX0hBU0hfQVJSQVlfTUFQX1NJWkUpIHtcbiAgICAgIHJldHVybiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIG5ld0NvdW50LCBpZHgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gIHZhciBuZXdOb2RlcyA9IHNldEF0KG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpO1xuXG4gIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgdGhpcy5jb3VudCA9IG5ld0NvdW50O1xuICAgIHRoaXMubm9kZXMgPSBuZXdOb2RlcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiBuZXcgSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBuZXdDb3VudCwgbmV3Tm9kZXMpO1xufTtcblxudmFyIEhhc2hDb2xsaXNpb25Ob2RlID0gZnVuY3Rpb24gSGFzaENvbGxpc2lvbk5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cmllcykge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmtleUhhc2ggPSBrZXlIYXNoO1xuICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xufTtcblxuSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gIGZvciAodmFyIGlpID0gMCwgbGVuID0gZW50cmllcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrKSB7XG4gICAgaWYgKGlzKGtleSwgZW50cmllc1tpaV1bMF0pKSB7XG4gICAgICByZXR1cm4gZW50cmllc1tpaV1bMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBub3RTZXRWYWx1ZTtcbn07XG5cbkhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgfVxuXG4gIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgaWYgKGtleUhhc2ggIT09IHRoaXMua2V5SGFzaCkge1xuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgcmV0dXJuIG1lcmdlSW50b05vZGUodGhpcywgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG4gIH1cblxuICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBlbnRyaWVzLmxlbmd0aDtcbiAgZm9yICg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lkeF1bMF0pKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGV4aXN0cyA9IGlkeCA8IGxlbjtcblxuICBpZiAoZXhpc3RzID8gZW50cmllc1tpZHhdWzFdID09PSB2YWx1ZSA6IHJlbW92ZWQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFNldFJlZihkaWRBbHRlcik7XG4gIChyZW1vdmVkIHx8ICFleGlzdHMpICYmIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblxuICBpZiAocmVtb3ZlZCAmJiBsZW4gPT09IDIpIHtcbiAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIGVudHJpZXNbaWR4IF4gMV0pO1xuICB9XG5cbiAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cbiAgaWYgKGV4aXN0cykge1xuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICBpZHggPT09IGxlbiAtIDFcbiAgICAgICAgPyBuZXdFbnRyaWVzLnBvcCgpXG4gICAgICAgIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9XG5cbiAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIG5ld0VudHJpZXMpO1xufTtcblxudmFyIFZhbHVlTm9kZSA9IGZ1bmN0aW9uIFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBlbnRyeSkge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmtleUhhc2ggPSBrZXlIYXNoO1xuICB0aGlzLmVudHJ5ID0gZW50cnk7XG59O1xuXG5WYWx1ZU5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgcmV0dXJuIGlzKGtleSwgdGhpcy5lbnRyeVswXSkgPyB0aGlzLmVudHJ5WzFdIDogbm90U2V0VmFsdWU7XG59O1xuXG5WYWx1ZU5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG4gIHZhciBrZXlNYXRjaCA9IGlzKGtleSwgdGhpcy5lbnRyeVswXSk7XG4gIGlmIChrZXlNYXRjaCA/IHZhbHVlID09PSB0aGlzLmVudHJ5WzFdIDogcmVtb3ZlZCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgU2V0UmVmKGRpZEFsdGVyKTtcblxuICBpZiAocmVtb3ZlZCkge1xuICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKGtleU1hdGNoKSB7XG4gICAgaWYgKG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEKSB7XG4gICAgICB0aGlzLmVudHJ5WzFdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWYWx1ZU5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICB9XG5cbiAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICByZXR1cm4gbWVyZ2VJbnRvTm9kZSh0aGlzLCBvd25lcklELCBzaGlmdCwgaGFzaChrZXkpLCBba2V5LCB2YWx1ZV0pO1xufTtcblxuLy8gI3ByYWdtYSBJdGVyYXRvcnNcblxuQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5pdGVyYXRlID0gSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLml0ZXJhdGUgPVxuICBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICBmb3IgKHZhciBpaSA9IDAsIG1heEluZGV4ID0gZW50cmllcy5sZW5ndGggLSAxOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgaWYgKGZuKGVudHJpZXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV0pID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5CaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPVxuICBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICAgIGZvciAodmFyIGlpID0gMCwgbWF4SW5kZXggPSBub2Rlcy5sZW5ndGggLSAxOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuaXRlcmF0ZShmbiwgcmV2ZXJzZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuVmFsdWVOb2RlLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gIHJldHVybiBmbih0aGlzLmVudHJ5KTtcbn07XG5cbnZhciBNYXBJdGVyYXRvciA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEl0ZXJhdG9yKSB7XG4gIGZ1bmN0aW9uIE1hcEl0ZXJhdG9yKG1hcCwgdHlwZSwgcmV2ZXJzZSkge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuX3JldmVyc2UgPSByZXZlcnNlO1xuICAgIHRoaXMuX3N0YWNrID0gbWFwLl9yb290ICYmIG1hcEl0ZXJhdG9yRnJhbWUobWFwLl9yb290KTtcbiAgfVxuXG4gIGlmICggSXRlcmF0b3IgKSBNYXBJdGVyYXRvci5fX3Byb3RvX18gPSBJdGVyYXRvcjtcbiAgTWFwSXRlcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSXRlcmF0b3IgJiYgSXRlcmF0b3IucHJvdG90eXBlICk7XG4gIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1hcEl0ZXJhdG9yO1xuXG4gIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gbmV4dCAoKSB7XG4gICAgdmFyIHR5cGUgPSB0aGlzLl90eXBlO1xuICAgIHZhciBzdGFjayA9IHRoaXMuX3N0YWNrO1xuICAgIHdoaWxlIChzdGFjaykge1xuICAgICAgdmFyIG5vZGUgPSBzdGFjay5ub2RlO1xuICAgICAgdmFyIGluZGV4ID0gc3RhY2suaW5kZXgrKztcbiAgICAgIHZhciBtYXhJbmRleCA9ICh2b2lkIDApO1xuICAgICAgaWYgKG5vZGUuZW50cnkpIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyeSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobm9kZS5lbnRyaWVzKSB7XG4gICAgICAgIG1heEluZGV4ID0gbm9kZS5lbnRyaWVzLmxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChpbmRleCA8PSBtYXhJbmRleCkge1xuICAgICAgICAgIHJldHVybiBtYXBJdGVyYXRvclZhbHVlKFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIG5vZGUuZW50cmllc1t0aGlzLl9yZXZlcnNlID8gbWF4SW5kZXggLSBpbmRleCA6IGluZGV4XVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1heEluZGV4ID0gbm9kZS5ub2Rlcy5sZW5ndGggLSAxO1xuICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgICB2YXIgc3ViTm9kZSA9IG5vZGUubm9kZXNbdGhpcy5fcmV2ZXJzZSA/IG1heEluZGV4IC0gaW5kZXggOiBpbmRleF07XG4gICAgICAgICAgaWYgKHN1Yk5vZGUpIHtcbiAgICAgICAgICAgIGlmIChzdWJOb2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBtYXBJdGVyYXRvclZhbHVlKHR5cGUsIHN1Yk5vZGUuZW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IG1hcEl0ZXJhdG9yRnJhbWUoc3ViTm9kZSwgc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IHRoaXMuX3N0YWNrLl9fcHJldjtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICB9O1xuXG4gIHJldHVybiBNYXBJdGVyYXRvcjtcbn0oSXRlcmF0b3IpKTtcblxuZnVuY3Rpb24gbWFwSXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeSkge1xuICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG5mdW5jdGlvbiBtYXBJdGVyYXRvckZyYW1lKG5vZGUsIHByZXYpIHtcbiAgcmV0dXJuIHtcbiAgICBub2RlOiBub2RlLFxuICAgIGluZGV4OiAwLFxuICAgIF9fcHJldjogcHJldixcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFrZU1hcChzaXplLCByb290LCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKE1hcFByb3RvdHlwZSk7XG4gIG1hcC5zaXplID0gc2l6ZTtcbiAgbWFwLl9yb290ID0gcm9vdDtcbiAgbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gIG1hcC5fX2hhc2ggPSBoYXNoO1xuICBtYXAuX19hbHRlcmVkID0gZmFsc2U7XG4gIHJldHVybiBtYXA7XG59XG5cbnZhciBFTVBUWV9NQVA7XG5mdW5jdGlvbiBlbXB0eU1hcCgpIHtcbiAgcmV0dXJuIEVNUFRZX01BUCB8fCAoRU1QVFlfTUFQID0gbWFrZU1hcCgwKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU1hcChtYXAsIGssIHYpIHtcbiAgdmFyIG5ld1Jvb3Q7XG4gIHZhciBuZXdTaXplO1xuICBpZiAoIW1hcC5fcm9vdCkge1xuICAgIGlmICh2ID09PSBOT1RfU0VUKSB7XG4gICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICBuZXdTaXplID0gMTtcbiAgICBuZXdSb290ID0gbmV3IEFycmF5TWFwTm9kZShtYXAuX19vd25lcklELCBbW2ssIHZdXSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGRpZENoYW5nZVNpemUgPSBNYWtlUmVmKCk7XG4gICAgdmFyIGRpZEFsdGVyID0gTWFrZVJlZigpO1xuICAgIG5ld1Jvb3QgPSB1cGRhdGVOb2RlKFxuICAgICAgbWFwLl9yb290LFxuICAgICAgbWFwLl9fb3duZXJJRCxcbiAgICAgIDAsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBrLFxuICAgICAgdixcbiAgICAgIGRpZENoYW5nZVNpemUsXG4gICAgICBkaWRBbHRlclxuICAgICk7XG4gICAgaWYgKCFkaWRBbHRlci52YWx1ZSkge1xuICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgbmV3U2l6ZSA9IG1hcC5zaXplICsgKGRpZENoYW5nZVNpemUudmFsdWUgPyAodiA9PT0gTk9UX1NFVCA/IC0xIDogMSkgOiAwKTtcbiAgfVxuICBpZiAobWFwLl9fb3duZXJJRCkge1xuICAgIG1hcC5zaXplID0gbmV3U2l6ZTtcbiAgICBtYXAuX3Jvb3QgPSBuZXdSb290O1xuICAgIG1hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgbWFwLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuICByZXR1cm4gbmV3Um9vdCA/IG1ha2VNYXAobmV3U2l6ZSwgbmV3Um9vdCkgOiBlbXB0eU1hcCgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVOb2RlKFxuICBub2RlLFxuICBvd25lcklELFxuICBzaGlmdCxcbiAga2V5SGFzaCxcbiAga2V5LFxuICB2YWx1ZSxcbiAgZGlkQ2hhbmdlU2l6ZSxcbiAgZGlkQWx0ZXJcbikge1xuICBpZiAoIW5vZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IE5PVF9TRVQpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICB9XG4gIHJldHVybiBub2RlLnVwZGF0ZShcbiAgICBvd25lcklELFxuICAgIHNoaWZ0LFxuICAgIGtleUhhc2gsXG4gICAga2V5LFxuICAgIHZhbHVlLFxuICAgIGRpZENoYW5nZVNpemUsXG4gICAgZGlkQWx0ZXJcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNMZWFmTm9kZShub2RlKSB7XG4gIHJldHVybiAoXG4gICAgbm9kZS5jb25zdHJ1Y3RvciA9PT0gVmFsdWVOb2RlIHx8IG5vZGUuY29uc3RydWN0b3IgPT09IEhhc2hDb2xsaXNpb25Ob2RlXG4gICk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW50b05vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGVudHJ5KSB7XG4gIGlmIChub2RlLmtleUhhc2ggPT09IGtleUhhc2gpIHtcbiAgICByZXR1cm4gbmV3IEhhc2hDb2xsaXNpb25Ob2RlKG93bmVySUQsIGtleUhhc2gsIFtub2RlLmVudHJ5LCBlbnRyeV0pO1xuICB9XG5cbiAgdmFyIGlkeDEgPSAoc2hpZnQgPT09IDAgPyBub2RlLmtleUhhc2ggOiBub2RlLmtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG4gIHZhciBpZHgyID0gKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG5cbiAgdmFyIG5ld05vZGU7XG4gIHZhciBub2RlcyA9XG4gICAgaWR4MSA9PT0gaWR4MlxuICAgICAgPyBbbWVyZ2VJbnRvTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBlbnRyeSldXG4gICAgICA6ICgobmV3Tm9kZSA9IG5ldyBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cnkpKSxcbiAgICAgICAgaWR4MSA8IGlkeDIgPyBbbm9kZSwgbmV3Tm9kZV0gOiBbbmV3Tm9kZSwgbm9kZV0pO1xuXG4gIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgKDEgPDwgaWR4MSkgfCAoMSA8PCBpZHgyKSwgbm9kZXMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKSB7XG4gIGlmICghb3duZXJJRCkge1xuICAgIG93bmVySUQgPSBuZXcgT3duZXJJRCgpO1xuICB9XG4gIHZhciBub2RlID0gbmV3IFZhbHVlTm9kZShvd25lcklELCBoYXNoKGtleSksIFtrZXksIHZhbHVlXSk7XG4gIGZvciAodmFyIGlpID0gMDsgaWkgPCBlbnRyaWVzLmxlbmd0aDsgaWkrKykge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaWldO1xuICAgIG5vZGUgPSBub2RlLnVwZGF0ZShvd25lcklELCAwLCB1bmRlZmluZWQsIGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHBhY2tOb2Rlcyhvd25lcklELCBub2RlcywgY291bnQsIGV4Y2x1ZGluZykge1xuICB2YXIgYml0bWFwID0gMDtcbiAgdmFyIHBhY2tlZElJID0gMDtcbiAgdmFyIHBhY2tlZE5vZGVzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgZm9yICh2YXIgaWkgPSAwLCBiaXQgPSAxLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrLCBiaXQgPDw9IDEpIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2lpXTtcbiAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkICYmIGlpICE9PSBleGNsdWRpbmcpIHtcbiAgICAgIGJpdG1hcCB8PSBiaXQ7XG4gICAgICBwYWNrZWROb2Rlc1twYWNrZWRJSSsrXSA9IG5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgYml0bWFwLCBwYWNrZWROb2Rlcyk7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGluY2x1ZGluZywgbm9kZSkge1xuICB2YXIgY291bnQgPSAwO1xuICB2YXIgZXhwYW5kZWROb2RlcyA9IG5ldyBBcnJheShTSVpFKTtcbiAgZm9yICh2YXIgaWkgPSAwOyBiaXRtYXAgIT09IDA7IGlpKyssIGJpdG1hcCA+Pj49IDEpIHtcbiAgICBleHBhbmRlZE5vZGVzW2lpXSA9IGJpdG1hcCAmIDEgPyBub2Rlc1tjb3VudCsrXSA6IHVuZGVmaW5lZDtcbiAgfVxuICBleHBhbmRlZE5vZGVzW2luY2x1ZGluZ10gPSBub2RlO1xuICByZXR1cm4gbmV3IEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgY291bnQgKyAxLCBleHBhbmRlZE5vZGVzKTtcbn1cblxuZnVuY3Rpb24gcG9wQ291bnQoeCkge1xuICB4IC09ICh4ID4+IDEpICYgMHg1NTU1NTU1NTtcbiAgeCA9ICh4ICYgMHgzMzMzMzMzMykgKyAoKHggPj4gMikgJiAweDMzMzMzMzMzKTtcbiAgeCA9ICh4ICsgKHggPj4gNCkpICYgMHgwZjBmMGYwZjtcbiAgeCArPSB4ID4+IDg7XG4gIHggKz0geCA+PiAxNjtcbiAgcmV0dXJuIHggJiAweDdmO1xufVxuXG5mdW5jdGlvbiBzZXRBdChhcnJheSwgaWR4LCB2YWwsIGNhbkVkaXQpIHtcbiAgdmFyIG5ld0FycmF5ID0gY2FuRWRpdCA/IGFycmF5IDogYXJyQ29weShhcnJheSk7XG4gIG5ld0FycmF5W2lkeF0gPSB2YWw7XG4gIHJldHVybiBuZXdBcnJheTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlSW4oYXJyYXksIGlkeCwgdmFsLCBjYW5FZGl0KSB7XG4gIHZhciBuZXdMZW4gPSBhcnJheS5sZW5ndGggKyAxO1xuICBpZiAoY2FuRWRpdCAmJiBpZHggKyAxID09PSBuZXdMZW4pIHtcbiAgICBhcnJheVtpZHhdID0gdmFsO1xuICAgIHJldHVybiBhcnJheTtcbiAgfVxuICB2YXIgbmV3QXJyYXkgPSBuZXcgQXJyYXkobmV3TGVuKTtcbiAgdmFyIGFmdGVyID0gMDtcbiAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG5ld0xlbjsgaWkrKykge1xuICAgIGlmIChpaSA9PT0gaWR4KSB7XG4gICAgICBuZXdBcnJheVtpaV0gPSB2YWw7XG4gICAgICBhZnRlciA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdBcnJheVtpaV0gPSBhcnJheVtpaSArIGFmdGVyXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld0FycmF5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPdXQoYXJyYXksIGlkeCwgY2FuRWRpdCkge1xuICB2YXIgbmV3TGVuID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgaWYgKGNhbkVkaXQgJiYgaWR4ID09PSBuZXdMZW4pIHtcbiAgICBhcnJheS5wb3AoKTtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbiAgdmFyIG5ld0FycmF5ID0gbmV3IEFycmF5KG5ld0xlbik7XG4gIHZhciBhZnRlciA9IDA7XG4gIGZvciAodmFyIGlpID0gMDsgaWkgPCBuZXdMZW47IGlpKyspIHtcbiAgICBpZiAoaWkgPT09IGlkeCkge1xuICAgICAgYWZ0ZXIgPSAxO1xuICAgIH1cbiAgICBuZXdBcnJheVtpaV0gPSBhcnJheVtpaSArIGFmdGVyXTtcbiAgfVxuICByZXR1cm4gbmV3QXJyYXk7XG59XG5cbnZhciBNQVhfQVJSQVlfTUFQX1NJWkUgPSBTSVpFIC8gNDtcbnZhciBNQVhfQklUTUFQX0lOREVYRURfU0laRSA9IFNJWkUgLyAyO1xudmFyIE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFID0gU0laRSAvIDQ7XG5cbnZhciBJU19MSVNUX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX0xJU1RfX0BAJztcblxuZnVuY3Rpb24gaXNMaXN0KG1heWJlTGlzdCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZUxpc3QgJiYgbWF5YmVMaXN0W0lTX0xJU1RfU1lNQk9MXSk7XG59XG5cbnZhciBMaXN0ID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gTGlzdCh2YWx1ZSkge1xuICAgIHZhciBlbXB0eSA9IGVtcHR5TGlzdCgpO1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZW1wdHk7XG4gICAgfVxuICAgIGlmIChpc0xpc3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHZhciBpdGVyID0gSW5kZXhlZENvbGxlY3Rpb24odmFsdWUpO1xuICAgIHZhciBzaXplID0gaXRlci5zaXplO1xuICAgIGlmIChzaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gZW1wdHk7XG4gICAgfVxuICAgIGFzc2VydE5vdEluZmluaXRlKHNpemUpO1xuICAgIGlmIChzaXplID4gMCAmJiBzaXplIDwgU0laRSkge1xuICAgICAgcmV0dXJuIG1ha2VMaXN0KDAsIHNpemUsIFNISUZULCBudWxsLCBuZXcgVk5vZGUoaXRlci50b0FycmF5KCkpKTtcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5LndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIGxpc3Quc2V0U2l6ZShzaXplKTtcbiAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkgeyByZXR1cm4gbGlzdC5zZXQoaSwgdik7IH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCBJbmRleGVkQ29sbGVjdGlvbiApIExpc3QuX19wcm90b19fID0gSW5kZXhlZENvbGxlY3Rpb247XG4gIExpc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZENvbGxlY3Rpb24gJiYgSW5kZXhlZENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIExpc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlzdDtcblxuICBMaXN0Lm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ0xpc3QgWycsICddJyk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICBMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2l6ZSkge1xuICAgICAgaW5kZXggKz0gdGhpcy5fb3JpZ2luO1xuICAgICAgdmFyIG5vZGUgPSBsaXN0Tm9kZUZvcih0aGlzLCBpbmRleCk7XG4gICAgICByZXR1cm4gbm9kZSAmJiBub2RlLmFycmF5W2luZGV4ICYgTUFTS107XG4gICAgfVxuICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gIExpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAoaW5kZXgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHVwZGF0ZUxpc3QodGhpcywgaW5kZXgsIHZhbHVlKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGluZGV4KSB7XG4gICAgcmV0dXJuICF0aGlzLmhhcyhpbmRleClcbiAgICAgID8gdGhpc1xuICAgICAgOiBpbmRleCA9PT0gMFxuICAgICAgPyB0aGlzLnNoaWZ0KClcbiAgICAgIDogaW5kZXggPT09IHRoaXMuc2l6ZSAtIDFcbiAgICAgID8gdGhpcy5wb3AoKVxuICAgICAgOiB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0IChpbmRleCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDAsIHZhbHVlKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICB0aGlzLnNpemUgPSB0aGlzLl9vcmlnaW4gPSB0aGlzLl9jYXBhY2l0eSA9IDA7XG4gICAgICB0aGlzLl9sZXZlbCA9IFNISUZUO1xuICAgICAgdGhpcy5fcm9vdCA9IHRoaXMuX3RhaWwgPSB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gZW1wdHlMaXN0KCk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2ggKC8qLi4udmFsdWVzKi8pIHtcbiAgICB2YXIgdmFsdWVzID0gYXJndW1lbnRzO1xuICAgIHZhciBvbGRTaXplID0gdGhpcy5zaXplO1xuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgMCwgb2xkU2l6ZSArIHZhbHVlcy5sZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHZhbHVlcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgbGlzdC5zZXQob2xkU2l6ZSArIGlpLCB2YWx1ZXNbaWldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiBwb3AgKCkge1xuICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDAsIC0xKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24gdW5zaGlmdCAoLyouLi52YWx1ZXMqLykge1xuICAgIHZhciB2YWx1ZXMgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobGlzdCkge1xuICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAtdmFsdWVzLmxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgdmFsdWVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICBsaXN0LnNldChpaSwgdmFsdWVzW2lpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiBzaGlmdCAoKSB7XG4gICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMSk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gIExpc3QucHJvdG90eXBlLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAoLyouLi5jb2xsZWN0aW9ucyovKSB7XG4gICAgdmFyIGFyZ3VtZW50cyQxID0gYXJndW1lbnRzO1xuXG4gICAgdmFyIHNlcXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzJDFbaV07XG4gICAgICB2YXIgc2VxID0gSW5kZXhlZENvbGxlY3Rpb24oXG4gICAgICAgIHR5cGVvZiBhcmd1bWVudCAhPT0gJ3N0cmluZycgJiYgaGFzSXRlcmF0b3IoYXJndW1lbnQpXG4gICAgICAgICAgPyBhcmd1bWVudFxuICAgICAgICAgIDogW2FyZ3VtZW50XVxuICAgICAgKTtcbiAgICAgIGlmIChzZXEuc2l6ZSAhPT0gMCkge1xuICAgICAgICBzZXFzLnB1c2goc2VxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNlcXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCAmJiAhdGhpcy5fX293bmVySUQgJiYgc2Vxcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKHNlcXNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICBzZXFzLmZvckVhY2goZnVuY3Rpb24gKHNlcSkgeyByZXR1cm4gc2VxLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBsaXN0LnB1c2godmFsdWUpOyB9KTsgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uIHNldFNpemUgKHNpemUpIHtcbiAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyh0aGlzLCAwLCBzaXplKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAgKG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMkMSQxLnNpemU7IGkrKykge1xuICAgICAgICBsaXN0LnNldChpLCBtYXBwZXIuY2FsbChjb250ZXh0LCBsaXN0LmdldChpKSwgaSwgdGhpcyQxJDEpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIEl0ZXJhdGlvblxuXG4gIExpc3QucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKGJlZ2luLCBlbmQpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKFxuICAgICAgdGhpcyxcbiAgICAgIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSksXG4gICAgICByZXNvbHZlRW5kKGVuZCwgc2l6ZSlcbiAgICApO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGluZGV4ID0gcmV2ZXJzZSA/IHRoaXMuc2l6ZSA6IDA7XG4gICAgdmFyIHZhbHVlcyA9IGl0ZXJhdGVMaXN0KHRoaXMsIHJldmVyc2UpO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlID0gdmFsdWVzKCk7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IERPTkVcbiAgICAgICAgPyBpdGVyYXRvckRvbmUoKVxuICAgICAgICA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgcmV2ZXJzZSA/IC0taW5kZXggOiBpbmRleCsrLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBpbmRleCA9IHJldmVyc2UgPyB0aGlzLnNpemUgOiAwO1xuICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgd2hpbGUgKCh2YWx1ZSA9IHZhbHVlcygpKSAhPT0gRE9ORSkge1xuICAgICAgaWYgKGZuKHZhbHVlLCByZXZlcnNlID8gLS1pbmRleCA6IGluZGV4KyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eUxpc3QoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VMaXN0KFxuICAgICAgdGhpcy5fb3JpZ2luLFxuICAgICAgdGhpcy5fY2FwYWNpdHksXG4gICAgICB0aGlzLl9sZXZlbCxcbiAgICAgIHRoaXMuX3Jvb3QsXG4gICAgICB0aGlzLl90YWlsLFxuICAgICAgb3duZXJJRCxcbiAgICAgIHRoaXMuX19oYXNoXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gTGlzdDtcbn0oSW5kZXhlZENvbGxlY3Rpb24pKTtcblxuTGlzdC5pc0xpc3QgPSBpc0xpc3Q7XG5cbnZhciBMaXN0UHJvdG90eXBlID0gTGlzdC5wcm90b3R5cGU7XG5MaXN0UHJvdG90eXBlW0lTX0xJU1RfU1lNQk9MXSA9IHRydWU7XG5MaXN0UHJvdG90eXBlW0RFTEVURV0gPSBMaXN0UHJvdG90eXBlLnJlbW92ZTtcbkxpc3RQcm90b3R5cGUubWVyZ2UgPSBMaXN0UHJvdG90eXBlLmNvbmNhdDtcbkxpc3RQcm90b3R5cGUuc2V0SW4gPSBzZXRJbjtcbkxpc3RQcm90b3R5cGUuZGVsZXRlSW4gPSBMaXN0UHJvdG90eXBlLnJlbW92ZUluID0gZGVsZXRlSW47XG5MaXN0UHJvdG90eXBlLnVwZGF0ZSA9IHVwZGF0ZTtcbkxpc3RQcm90b3R5cGUudXBkYXRlSW4gPSB1cGRhdGVJbjtcbkxpc3RQcm90b3R5cGUubWVyZ2VJbiA9IG1lcmdlSW47XG5MaXN0UHJvdG90eXBlLm1lcmdlRGVlcEluID0gbWVyZ2VEZWVwSW47XG5MaXN0UHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuTGlzdFByb3RvdHlwZS53YXNBbHRlcmVkID0gd2FzQWx0ZXJlZDtcbkxpc3RQcm90b3R5cGUuYXNJbW11dGFibGUgPSBhc0ltbXV0YWJsZTtcbkxpc3RQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBMaXN0UHJvdG90eXBlLmFzTXV0YWJsZSA9IGFzTXV0YWJsZTtcbkxpc3RQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBhcnIpIHtcbiAgcmV0dXJuIHJlc3VsdC5wdXNoKGFycik7XG59O1xuTGlzdFByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqLmFzSW1tdXRhYmxlKCk7XG59O1xuXG52YXIgVk5vZGUgPSBmdW5jdGlvbiBWTm9kZShhcnJheSwgb3duZXJJRCkge1xuICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG59O1xuXG4vLyBUT0RPOiBzZWVtcyBsaWtlIHRoZXNlIG1ldGhvZHMgYXJlIHZlcnkgc2ltaWxhclxuXG5WTm9kZS5wcm90b3R5cGUucmVtb3ZlQmVmb3JlID0gZnVuY3Rpb24gcmVtb3ZlQmVmb3JlIChvd25lcklELCBsZXZlbCwgaW5kZXgpIHtcbiAgaWYgKGluZGV4ID09PSBsZXZlbCA/IDEgPDwgbGV2ZWwgOiB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZhciBvcmlnaW5JbmRleCA9IChpbmRleCA+Pj4gbGV2ZWwpICYgTUFTSztcbiAgaWYgKG9yaWdpbkluZGV4ID49IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBWTm9kZShbXSwgb3duZXJJRCk7XG4gIH1cbiAgdmFyIHJlbW92aW5nRmlyc3QgPSBvcmlnaW5JbmRleCA9PT0gMDtcbiAgdmFyIG5ld0NoaWxkO1xuICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgdmFyIG9sZENoaWxkID0gdGhpcy5hcnJheVtvcmlnaW5JbmRleF07XG4gICAgbmV3Q2hpbGQgPVxuICAgICAgb2xkQ2hpbGQgJiYgb2xkQ2hpbGQucmVtb3ZlQmVmb3JlKG93bmVySUQsIGxldmVsIC0gU0hJRlQsIGluZGV4KTtcbiAgICBpZiAobmV3Q2hpbGQgPT09IG9sZENoaWxkICYmIHJlbW92aW5nRmlyc3QpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuICBpZiAocmVtb3ZpbmdGaXJzdCAmJiAhbmV3Q2hpbGQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB2YXIgZWRpdGFibGUgPSBlZGl0YWJsZVZOb2RlKHRoaXMsIG93bmVySUQpO1xuICBpZiAoIXJlbW92aW5nRmlyc3QpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb3JpZ2luSW5kZXg7IGlpKyspIHtcbiAgICAgIGVkaXRhYmxlLmFycmF5W2lpXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgaWYgKG5ld0NoaWxkKSB7XG4gICAgZWRpdGFibGUuYXJyYXlbb3JpZ2luSW5kZXhdID0gbmV3Q2hpbGQ7XG4gIH1cbiAgcmV0dXJuIGVkaXRhYmxlO1xufTtcblxuVk5vZGUucHJvdG90eXBlLnJlbW92ZUFmdGVyID0gZnVuY3Rpb24gcmVtb3ZlQWZ0ZXIgKG93bmVySUQsIGxldmVsLCBpbmRleCkge1xuICBpZiAoaW5kZXggPT09IChsZXZlbCA/IDEgPDwgbGV2ZWwgOiAwKSB8fCB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZhciBzaXplSW5kZXggPSAoKGluZGV4IC0gMSkgPj4+IGxldmVsKSAmIE1BU0s7XG4gIGlmIChzaXplSW5kZXggPj0gdGhpcy5hcnJheS5sZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBuZXdDaGlsZDtcbiAgaWYgKGxldmVsID4gMCkge1xuICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbc2l6ZUluZGV4XTtcbiAgICBuZXdDaGlsZCA9XG4gICAgICBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVBZnRlcihvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCk7XG4gICAgaWYgKG5ld0NoaWxkID09PSBvbGRDaGlsZCAmJiBzaXplSW5kZXggPT09IHRoaXMuYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcbiAgZWRpdGFibGUuYXJyYXkuc3BsaWNlKHNpemVJbmRleCArIDEpO1xuICBpZiAobmV3Q2hpbGQpIHtcbiAgICBlZGl0YWJsZS5hcnJheVtzaXplSW5kZXhdID0gbmV3Q2hpbGQ7XG4gIH1cbiAgcmV0dXJuIGVkaXRhYmxlO1xufTtcblxudmFyIERPTkUgPSB7fTtcblxuZnVuY3Rpb24gaXRlcmF0ZUxpc3QobGlzdCwgcmV2ZXJzZSkge1xuICB2YXIgbGVmdCA9IGxpc3QuX29yaWdpbjtcbiAgdmFyIHJpZ2h0ID0gbGlzdC5fY2FwYWNpdHk7XG4gIHZhciB0YWlsUG9zID0gZ2V0VGFpbE9mZnNldChyaWdodCk7XG4gIHZhciB0YWlsID0gbGlzdC5fdGFpbDtcblxuICByZXR1cm4gaXRlcmF0ZU5vZGVPckxlYWYobGlzdC5fcm9vdCwgbGlzdC5fbGV2ZWwsIDApO1xuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVOb2RlT3JMZWFmKG5vZGUsIGxldmVsLCBvZmZzZXQpIHtcbiAgICByZXR1cm4gbGV2ZWwgPT09IDBcbiAgICAgID8gaXRlcmF0ZUxlYWYobm9kZSwgb2Zmc2V0KVxuICAgICAgOiBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVMZWFmKG5vZGUsIG9mZnNldCkge1xuICAgIHZhciBhcnJheSA9IG9mZnNldCA9PT0gdGFpbFBvcyA/IHRhaWwgJiYgdGFpbC5hcnJheSA6IG5vZGUgJiYgbm9kZS5hcnJheTtcbiAgICB2YXIgZnJvbSA9IG9mZnNldCA+IGxlZnQgPyAwIDogbGVmdCAtIG9mZnNldDtcbiAgICB2YXIgdG8gPSByaWdodCAtIG9mZnNldDtcbiAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICB0byA9IFNJWkU7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgcmV0dXJuIERPTkU7XG4gICAgICB9XG4gICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICByZXR1cm4gYXJyYXkgJiYgYXJyYXlbaWR4XTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaXRlcmF0ZU5vZGUobm9kZSwgbGV2ZWwsIG9mZnNldCkge1xuICAgIHZhciB2YWx1ZXM7XG4gICAgdmFyIGFycmF5ID0gbm9kZSAmJiBub2RlLmFycmF5O1xuICAgIHZhciBmcm9tID0gb2Zmc2V0ID4gbGVmdCA/IDAgOiAobGVmdCAtIG9mZnNldCkgPj4gbGV2ZWw7XG4gICAgdmFyIHRvID0gKChyaWdodCAtIG9mZnNldCkgPj4gbGV2ZWwpICsgMTtcbiAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICB0byA9IFNJWkU7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzKCk7XG4gICAgICAgICAgaWYgKHZhbHVlICE9PSBET05FKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZyb20gPT09IHRvKSB7XG4gICAgICAgICAgcmV0dXJuIERPTkU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkeCA9IHJldmVyc2UgPyAtLXRvIDogZnJvbSsrO1xuICAgICAgICB2YWx1ZXMgPSBpdGVyYXRlTm9kZU9yTGVhZihcbiAgICAgICAgICBhcnJheSAmJiBhcnJheVtpZHhdLFxuICAgICAgICAgIGxldmVsIC0gU0hJRlQsXG4gICAgICAgICAgb2Zmc2V0ICsgKGlkeCA8PCBsZXZlbClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VMaXN0KG9yaWdpbiwgY2FwYWNpdHksIGxldmVsLCByb290LCB0YWlsLCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBsaXN0ID0gT2JqZWN0LmNyZWF0ZShMaXN0UHJvdG90eXBlKTtcbiAgbGlzdC5zaXplID0gY2FwYWNpdHkgLSBvcmlnaW47XG4gIGxpc3QuX29yaWdpbiA9IG9yaWdpbjtcbiAgbGlzdC5fY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgbGlzdC5fbGV2ZWwgPSBsZXZlbDtcbiAgbGlzdC5fcm9vdCA9IHJvb3Q7XG4gIGxpc3QuX3RhaWwgPSB0YWlsO1xuICBsaXN0Ll9fb3duZXJJRCA9IG93bmVySUQ7XG4gIGxpc3QuX19oYXNoID0gaGFzaDtcbiAgbGlzdC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGxpc3Q7XG59XG5cbnZhciBFTVBUWV9MSVNUO1xuZnVuY3Rpb24gZW1wdHlMaXN0KCkge1xuICByZXR1cm4gRU1QVFlfTElTVCB8fCAoRU1QVFlfTElTVCA9IG1ha2VMaXN0KDAsIDAsIFNISUZUKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpc3QobGlzdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGluZGV4ID0gd3JhcEluZGV4KGxpc3QsIGluZGV4KTtcblxuICBpZiAoaW5kZXggIT09IGluZGV4KSB7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICBpZiAoaW5kZXggPj0gbGlzdC5zaXplIHx8IGluZGV4IDwgMCkge1xuICAgIHJldHVybiBsaXN0LndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIGluZGV4IDwgMFxuICAgICAgICA/IHNldExpc3RCb3VuZHMobGlzdCwgaW5kZXgpLnNldCgwLCB2YWx1ZSlcbiAgICAgICAgOiBzZXRMaXN0Qm91bmRzKGxpc3QsIDAsIGluZGV4ICsgMSkuc2V0KGluZGV4LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBpbmRleCArPSBsaXN0Ll9vcmlnaW47XG5cbiAgdmFyIG5ld1RhaWwgPSBsaXN0Ll90YWlsO1xuICB2YXIgbmV3Um9vdCA9IGxpc3QuX3Jvb3Q7XG4gIHZhciBkaWRBbHRlciA9IE1ha2VSZWYoKTtcbiAgaWYgKGluZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgbmV3VGFpbCA9IHVwZGF0ZVZOb2RlKG5ld1RhaWwsIGxpc3QuX19vd25lcklELCAwLCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdSb290ID0gdXBkYXRlVk5vZGUoXG4gICAgICBuZXdSb290LFxuICAgICAgbGlzdC5fX293bmVySUQsXG4gICAgICBsaXN0Ll9sZXZlbCxcbiAgICAgIGluZGV4LFxuICAgICAgdmFsdWUsXG4gICAgICBkaWRBbHRlclxuICAgICk7XG4gIH1cblxuICBpZiAoIWRpZEFsdGVyLnZhbHVlKSB7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICBpZiAobGlzdC5fX293bmVySUQpIHtcbiAgICBsaXN0Ll9yb290ID0gbmV3Um9vdDtcbiAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICBsaXN0Ll9fYWx0ZXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cbiAgcmV0dXJuIG1ha2VMaXN0KGxpc3QuX29yaWdpbiwgbGlzdC5fY2FwYWNpdHksIGxpc3QuX2xldmVsLCBuZXdSb290LCBuZXdUYWlsKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVk5vZGUobm9kZSwgb3duZXJJRCwgbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpIHtcbiAgdmFyIGlkeCA9IChpbmRleCA+Pj4gbGV2ZWwpICYgTUFTSztcbiAgdmFyIG5vZGVIYXMgPSBub2RlICYmIGlkeCA8IG5vZGUuYXJyYXkubGVuZ3RoO1xuICBpZiAoIW5vZGVIYXMgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmFyIG5ld05vZGU7XG5cbiAgaWYgKGxldmVsID4gMCkge1xuICAgIHZhciBsb3dlck5vZGUgPSBub2RlICYmIG5vZGUuYXJyYXlbaWR4XTtcbiAgICB2YXIgbmV3TG93ZXJOb2RlID0gdXBkYXRlVk5vZGUoXG4gICAgICBsb3dlck5vZGUsXG4gICAgICBvd25lcklELFxuICAgICAgbGV2ZWwgLSBTSElGVCxcbiAgICAgIGluZGV4LFxuICAgICAgdmFsdWUsXG4gICAgICBkaWRBbHRlclxuICAgICk7XG4gICAgaWYgKG5ld0xvd2VyTm9kZSA9PT0gbG93ZXJOb2RlKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgbmV3Tm9kZSA9IGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCk7XG4gICAgbmV3Tm9kZS5hcnJheVtpZHhdID0gbmV3TG93ZXJOb2RlO1xuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG5cbiAgaWYgKG5vZGVIYXMgJiYgbm9kZS5hcnJheVtpZHhdID09PSB2YWx1ZSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgaWYgKGRpZEFsdGVyKSB7XG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgfVxuXG4gIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBpZHggPT09IG5ld05vZGUuYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgIG5ld05vZGUuYXJyYXkucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgbmV3Tm9kZS5hcnJheVtpZHhdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIG5ld05vZGU7XG59XG5cbmZ1bmN0aW9uIGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCkge1xuICBpZiAob3duZXJJRCAmJiBub2RlICYmIG93bmVySUQgPT09IG5vZGUub3duZXJJRCkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHJldHVybiBuZXcgVk5vZGUobm9kZSA/IG5vZGUuYXJyYXkuc2xpY2UoKSA6IFtdLCBvd25lcklEKTtcbn1cblxuZnVuY3Rpb24gbGlzdE5vZGVGb3IobGlzdCwgcmF3SW5kZXgpIHtcbiAgaWYgKHJhd0luZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgcmV0dXJuIGxpc3QuX3RhaWw7XG4gIH1cbiAgaWYgKHJhd0luZGV4IDwgMSA8PCAobGlzdC5fbGV2ZWwgKyBTSElGVCkpIHtcbiAgICB2YXIgbm9kZSA9IGxpc3QuX3Jvb3Q7XG4gICAgdmFyIGxldmVsID0gbGlzdC5fbGV2ZWw7XG4gICAgd2hpbGUgKG5vZGUgJiYgbGV2ZWwgPiAwKSB7XG4gICAgICBub2RlID0gbm9kZS5hcnJheVsocmF3SW5kZXggPj4+IGxldmVsKSAmIE1BU0tdO1xuICAgICAgbGV2ZWwgLT0gU0hJRlQ7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldExpc3RCb3VuZHMobGlzdCwgYmVnaW4sIGVuZCkge1xuICAvLyBTYW5pdGl6ZSBiZWdpbiAmIGVuZCB1c2luZyB0aGlzIHNob3J0aGFuZCBmb3IgVG9JbnQzMihhcmd1bWVudClcbiAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50MzJcbiAgaWYgKGJlZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICBiZWdpbiB8PSAwO1xuICB9XG4gIGlmIChlbmQgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCB8PSAwO1xuICB9XG4gIHZhciBvd25lciA9IGxpc3QuX19vd25lcklEIHx8IG5ldyBPd25lcklEKCk7XG4gIHZhciBvbGRPcmlnaW4gPSBsaXN0Ll9vcmlnaW47XG4gIHZhciBvbGRDYXBhY2l0eSA9IGxpc3QuX2NhcGFjaXR5O1xuICB2YXIgbmV3T3JpZ2luID0gb2xkT3JpZ2luICsgYmVnaW47XG4gIHZhciBuZXdDYXBhY2l0eSA9XG4gICAgZW5kID09PSB1bmRlZmluZWRcbiAgICAgID8gb2xkQ2FwYWNpdHlcbiAgICAgIDogZW5kIDwgMFxuICAgICAgPyBvbGRDYXBhY2l0eSArIGVuZFxuICAgICAgOiBvbGRPcmlnaW4gKyBlbmQ7XG4gIGlmIChuZXdPcmlnaW4gPT09IG9sZE9yaWdpbiAmJiBuZXdDYXBhY2l0eSA9PT0gb2xkQ2FwYWNpdHkpIHtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIC8vIElmIGl0J3MgZ29pbmcgdG8gZW5kIGFmdGVyIGl0IHN0YXJ0cywgaXQncyBlbXB0eS5cbiAgaWYgKG5ld09yaWdpbiA+PSBuZXdDYXBhY2l0eSkge1xuICAgIHJldHVybiBsaXN0LmNsZWFyKCk7XG4gIH1cblxuICB2YXIgbmV3TGV2ZWwgPSBsaXN0Ll9sZXZlbDtcbiAgdmFyIG5ld1Jvb3QgPSBsaXN0Ll9yb290O1xuXG4gIC8vIE5ldyBvcmlnaW4gbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICB2YXIgb2Zmc2V0U2hpZnQgPSAwO1xuICB3aGlsZSAobmV3T3JpZ2luICsgb2Zmc2V0U2hpZnQgPCAwKSB7XG4gICAgbmV3Um9vdCA9IG5ldyBWTm9kZShcbiAgICAgIG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbdW5kZWZpbmVkLCBuZXdSb290XSA6IFtdLFxuICAgICAgb3duZXJcbiAgICApO1xuICAgIG5ld0xldmVsICs9IFNISUZUO1xuICAgIG9mZnNldFNoaWZ0ICs9IDEgPDwgbmV3TGV2ZWw7XG4gIH1cbiAgaWYgKG9mZnNldFNoaWZ0KSB7XG4gICAgbmV3T3JpZ2luICs9IG9mZnNldFNoaWZ0O1xuICAgIG9sZE9yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICBuZXdDYXBhY2l0eSArPSBvZmZzZXRTaGlmdDtcbiAgICBvbGRDYXBhY2l0eSArPSBvZmZzZXRTaGlmdDtcbiAgfVxuXG4gIHZhciBvbGRUYWlsT2Zmc2V0ID0gZ2V0VGFpbE9mZnNldChvbGRDYXBhY2l0eSk7XG4gIHZhciBuZXdUYWlsT2Zmc2V0ID0gZ2V0VGFpbE9mZnNldChuZXdDYXBhY2l0eSk7XG5cbiAgLy8gTmV3IHNpemUgbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICB3aGlsZSAobmV3VGFpbE9mZnNldCA+PSAxIDw8IChuZXdMZXZlbCArIFNISUZUKSkge1xuICAgIG5ld1Jvb3QgPSBuZXcgVk5vZGUoXG4gICAgICBuZXdSb290ICYmIG5ld1Jvb3QuYXJyYXkubGVuZ3RoID8gW25ld1Jvb3RdIDogW10sXG4gICAgICBvd25lclxuICAgICk7XG4gICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gIH1cblxuICAvLyBMb2NhdGUgb3IgY3JlYXRlIHRoZSBuZXcgdGFpbC5cbiAgdmFyIG9sZFRhaWwgPSBsaXN0Ll90YWlsO1xuICB2YXIgbmV3VGFpbCA9XG4gICAgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXRcbiAgICAgID8gbGlzdE5vZGVGb3IobGlzdCwgbmV3Q2FwYWNpdHkgLSAxKVxuICAgICAgOiBuZXdUYWlsT2Zmc2V0ID4gb2xkVGFpbE9mZnNldFxuICAgICAgPyBuZXcgVk5vZGUoW10sIG93bmVyKVxuICAgICAgOiBvbGRUYWlsO1xuXG4gIC8vIE1lcmdlIFRhaWwgaW50byB0cmVlLlxuICBpZiAoXG4gICAgb2xkVGFpbCAmJlxuICAgIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ICYmXG4gICAgbmV3T3JpZ2luIDwgb2xkQ2FwYWNpdHkgJiZcbiAgICBvbGRUYWlsLmFycmF5Lmxlbmd0aFxuICApIHtcbiAgICBuZXdSb290ID0gZWRpdGFibGVWTm9kZShuZXdSb290LCBvd25lcik7XG4gICAgdmFyIG5vZGUgPSBuZXdSb290O1xuICAgIGZvciAodmFyIGxldmVsID0gbmV3TGV2ZWw7IGxldmVsID4gU0hJRlQ7IGxldmVsIC09IFNISUZUKSB7XG4gICAgICB2YXIgaWR4ID0gKG9sZFRhaWxPZmZzZXQgPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICBub2RlID0gbm9kZS5hcnJheVtpZHhdID0gZWRpdGFibGVWTm9kZShub2RlLmFycmF5W2lkeF0sIG93bmVyKTtcbiAgICB9XG4gICAgbm9kZS5hcnJheVsob2xkVGFpbE9mZnNldCA+Pj4gU0hJRlQpICYgTUFTS10gPSBvbGRUYWlsO1xuICB9XG5cbiAgLy8gSWYgdGhlIHNpemUgaGFzIGJlZW4gcmVkdWNlZCwgdGhlcmUncyBhIGNoYW5jZSB0aGUgdGFpbCBuZWVkcyB0byBiZSB0cmltbWVkLlxuICBpZiAobmV3Q2FwYWNpdHkgPCBvbGRDYXBhY2l0eSkge1xuICAgIG5ld1RhaWwgPSBuZXdUYWlsICYmIG5ld1RhaWwucmVtb3ZlQWZ0ZXIob3duZXIsIDAsIG5ld0NhcGFjaXR5KTtcbiAgfVxuXG4gIC8vIElmIHRoZSBuZXcgb3JpZ2luIGlzIHdpdGhpbiB0aGUgdGFpbCwgdGhlbiB3ZSBkbyBub3QgbmVlZCBhIHJvb3QuXG4gIGlmIChuZXdPcmlnaW4gPj0gbmV3VGFpbE9mZnNldCkge1xuICAgIG5ld09yaWdpbiAtPSBuZXdUYWlsT2Zmc2V0O1xuICAgIG5ld0NhcGFjaXR5IC09IG5ld1RhaWxPZmZzZXQ7XG4gICAgbmV3TGV2ZWwgPSBTSElGVDtcbiAgICBuZXdSb290ID0gbnVsbDtcbiAgICBuZXdUYWlsID0gbmV3VGFpbCAmJiBuZXdUYWlsLnJlbW92ZUJlZm9yZShvd25lciwgMCwgbmV3T3JpZ2luKTtcblxuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIHJvb3QgaGFzIGJlZW4gdHJpbW1lZCwgZ2FyYmFnZSBjb2xsZWN0LlxuICB9IGVsc2UgaWYgKG5ld09yaWdpbiA+IG9sZE9yaWdpbiB8fCBuZXdUYWlsT2Zmc2V0IDwgb2xkVGFpbE9mZnNldCkge1xuICAgIG9mZnNldFNoaWZ0ID0gMDtcblxuICAgIC8vIElkZW50aWZ5IHRoZSBuZXcgdG9wIHJvb3Qgbm9kZSBvZiB0aGUgc3VidHJlZSBvZiB0aGUgb2xkIHJvb3QuXG4gICAgd2hpbGUgKG5ld1Jvb3QpIHtcbiAgICAgIHZhciBiZWdpbkluZGV4ID0gKG5ld09yaWdpbiA+Pj4gbmV3TGV2ZWwpICYgTUFTSztcbiAgICAgIGlmICgoYmVnaW5JbmRleCAhPT0gbmV3VGFpbE9mZnNldCA+Pj4gbmV3TGV2ZWwpICYgTUFTSykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChiZWdpbkluZGV4KSB7XG4gICAgICAgIG9mZnNldFNoaWZ0ICs9ICgxIDw8IG5ld0xldmVsKSAqIGJlZ2luSW5kZXg7XG4gICAgICB9XG4gICAgICBuZXdMZXZlbCAtPSBTSElGVDtcbiAgICAgIG5ld1Jvb3QgPSBuZXdSb290LmFycmF5W2JlZ2luSW5kZXhdO1xuICAgIH1cblxuICAgIC8vIFRyaW0gdGhlIG5ldyBzaWRlcyBvZiB0aGUgbmV3IHJvb3QuXG4gICAgaWYgKG5ld1Jvb3QgJiYgbmV3T3JpZ2luID4gb2xkT3JpZ2luKSB7XG4gICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVCZWZvcmUob3duZXIsIG5ld0xldmVsLCBuZXdPcmlnaW4gLSBvZmZzZXRTaGlmdCk7XG4gICAgfVxuICAgIGlmIChuZXdSb290ICYmIG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0KSB7XG4gICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVBZnRlcihcbiAgICAgICAgb3duZXIsXG4gICAgICAgIG5ld0xldmVsLFxuICAgICAgICBuZXdUYWlsT2Zmc2V0IC0gb2Zmc2V0U2hpZnRcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChvZmZzZXRTaGlmdCkge1xuICAgICAgbmV3T3JpZ2luIC09IG9mZnNldFNoaWZ0O1xuICAgICAgbmV3Q2FwYWNpdHkgLT0gb2Zmc2V0U2hpZnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKGxpc3QuX19vd25lcklEKSB7XG4gICAgbGlzdC5zaXplID0gbmV3Q2FwYWNpdHkgLSBuZXdPcmlnaW47XG4gICAgbGlzdC5fb3JpZ2luID0gbmV3T3JpZ2luO1xuICAgIGxpc3QuX2NhcGFjaXR5ID0gbmV3Q2FwYWNpdHk7XG4gICAgbGlzdC5fbGV2ZWwgPSBuZXdMZXZlbDtcbiAgICBsaXN0Ll9yb290ID0gbmV3Um9vdDtcbiAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICBsaXN0Ll9fYWx0ZXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cbiAgcmV0dXJuIG1ha2VMaXN0KG5ld09yaWdpbiwgbmV3Q2FwYWNpdHksIG5ld0xldmVsLCBuZXdSb290LCBuZXdUYWlsKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGFpbE9mZnNldChzaXplKSB7XG4gIHJldHVybiBzaXplIDwgU0laRSA/IDAgOiAoKHNpemUgLSAxKSA+Pj4gU0hJRlQpIDw8IFNISUZUO1xufVxuXG52YXIgT3JkZXJlZE1hcCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKE1hcCkge1xuICBmdW5jdGlvbiBPcmRlcmVkTWFwKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlPcmRlcmVkTWFwKClcbiAgICAgIDogaXNPcmRlcmVkTWFwKHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBlbXB0eU9yZGVyZWRNYXAoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgICB2YXIgaXRlciA9IEtleWVkQ29sbGVjdGlvbih2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIG1hcC5zZXQoaywgdik7IH0pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGlmICggTWFwICkgT3JkZXJlZE1hcC5fX3Byb3RvX18gPSBNYXA7XG4gIE9yZGVyZWRNYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggTWFwICYmIE1hcC5wcm90b3R5cGUgKTtcbiAgT3JkZXJlZE1hcC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBPcmRlcmVkTWFwO1xuXG4gIE9yZGVyZWRNYXAub2YgPSBmdW5jdGlvbiBvZiAoLyouLi52YWx1ZXMqLykge1xuICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgT3JkZXJlZE1hcC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZE1hcCB7JywgJ30nKTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaywgbm90U2V0VmFsdWUpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLl9tYXAuZ2V0KGspO1xuICAgIHJldHVybiBpbmRleCAhPT0gdW5kZWZpbmVkID8gdGhpcy5fbGlzdC5nZXQoaW5kZXgpWzFdIDogbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgdGhpcy5fbWFwLmNsZWFyKCk7XG4gICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5T3JkZXJlZE1hcCgpO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAoaywgdikge1xuICAgIHJldHVybiB1cGRhdGVPcmRlcmVkTWFwKHRoaXMsIGssIHYpO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoaykge1xuICAgIHJldHVybiB1cGRhdGVPcmRlcmVkTWFwKHRoaXMsIGssIE5PVF9TRVQpO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuX2xpc3QuX19pdGVyYXRlKFxuICAgICAgZnVuY3Rpb24gKGVudHJ5KSB7IHJldHVybiBlbnRyeSAmJiBmbihlbnRyeVsxXSwgZW50cnlbMF0sIHRoaXMkMSQxKTsgfSxcbiAgICAgIHJldmVyc2VcbiAgICApO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3QuZnJvbUVudHJ5U2VxKCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgfTtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24gX19lbnN1cmVPd25lciAob3duZXJJRCkge1xuICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICB2YXIgbmV3TGlzdCA9IHRoaXMuX2xpc3QuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5T3JkZXJlZE1hcCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgIHRoaXMuX2xpc3QgPSBuZXdMaXN0O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlT3JkZXJlZE1hcChuZXdNYXAsIG5ld0xpc3QsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgfTtcblxuICByZXR1cm4gT3JkZXJlZE1hcDtcbn0oTWFwKSk7XG5cbk9yZGVyZWRNYXAuaXNPcmRlcmVkTWFwID0gaXNPcmRlcmVkTWFwO1xuXG5PcmRlcmVkTWFwLnByb3RvdHlwZVtJU19PUkRFUkVEX1NZTUJPTF0gPSB0cnVlO1xuT3JkZXJlZE1hcC5wcm90b3R5cGVbREVMRVRFXSA9IE9yZGVyZWRNYXAucHJvdG90eXBlLnJlbW92ZTtcblxuZnVuY3Rpb24gbWFrZU9yZGVyZWRNYXAobWFwLCBsaXN0LCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBvbWFwID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkTWFwLnByb3RvdHlwZSk7XG4gIG9tYXAuc2l6ZSA9IG1hcCA/IG1hcC5zaXplIDogMDtcbiAgb21hcC5fbWFwID0gbWFwO1xuICBvbWFwLl9saXN0ID0gbGlzdDtcbiAgb21hcC5fX293bmVySUQgPSBvd25lcklEO1xuICBvbWFwLl9faGFzaCA9IGhhc2g7XG4gIG9tYXAuX19hbHRlcmVkID0gZmFsc2U7XG4gIHJldHVybiBvbWFwO1xufVxuXG52YXIgRU1QVFlfT1JERVJFRF9NQVA7XG5mdW5jdGlvbiBlbXB0eU9yZGVyZWRNYXAoKSB7XG4gIHJldHVybiAoXG4gICAgRU1QVFlfT1JERVJFRF9NQVAgfHxcbiAgICAoRU1QVFlfT1JERVJFRF9NQVAgPSBtYWtlT3JkZXJlZE1hcChlbXB0eU1hcCgpLCBlbXB0eUxpc3QoKSkpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU9yZGVyZWRNYXAob21hcCwgaywgdikge1xuICB2YXIgbWFwID0gb21hcC5fbWFwO1xuICB2YXIgbGlzdCA9IG9tYXAuX2xpc3Q7XG4gIHZhciBpID0gbWFwLmdldChrKTtcbiAgdmFyIGhhcyA9IGkgIT09IHVuZGVmaW5lZDtcbiAgdmFyIG5ld01hcDtcbiAgdmFyIG5ld0xpc3Q7XG4gIGlmICh2ID09PSBOT1RfU0VUKSB7XG4gICAgLy8gcmVtb3ZlZFxuICAgIGlmICghaGFzKSB7XG4gICAgICByZXR1cm4gb21hcDtcbiAgICB9XG4gICAgaWYgKGxpc3Quc2l6ZSA+PSBTSVpFICYmIGxpc3Quc2l6ZSA+PSBtYXAuc2l6ZSAqIDIpIHtcbiAgICAgIG5ld0xpc3QgPSBsaXN0LmZpbHRlcihmdW5jdGlvbiAoZW50cnksIGlkeCkgeyByZXR1cm4gZW50cnkgIT09IHVuZGVmaW5lZCAmJiBpICE9PSBpZHg7IH0pO1xuICAgICAgbmV3TWFwID0gbmV3TGlzdFxuICAgICAgICAudG9LZXllZFNlcSgpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7IHJldHVybiBlbnRyeVswXTsgfSlcbiAgICAgICAgLmZsaXAoKVxuICAgICAgICAudG9NYXAoKTtcbiAgICAgIGlmIChvbWFwLl9fb3duZXJJRCkge1xuICAgICAgICBuZXdNYXAuX19vd25lcklEID0gbmV3TGlzdC5fX293bmVySUQgPSBvbWFwLl9fb3duZXJJRDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3TWFwID0gbWFwLnJlbW92ZShrKTtcbiAgICAgIG5ld0xpc3QgPSBpID09PSBsaXN0LnNpemUgLSAxID8gbGlzdC5wb3AoKSA6IGxpc3Quc2V0KGksIHVuZGVmaW5lZCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGhhcykge1xuICAgIGlmICh2ID09PSBsaXN0LmdldChpKVsxXSkge1xuICAgICAgcmV0dXJuIG9tYXA7XG4gICAgfVxuICAgIG5ld01hcCA9IG1hcDtcbiAgICBuZXdMaXN0ID0gbGlzdC5zZXQoaSwgW2ssIHZdKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdNYXAgPSBtYXAuc2V0KGssIGxpc3Quc2l6ZSk7XG4gICAgbmV3TGlzdCA9IGxpc3Quc2V0KGxpc3Quc2l6ZSwgW2ssIHZdKTtcbiAgfVxuICBpZiAob21hcC5fX293bmVySUQpIHtcbiAgICBvbWFwLnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICBvbWFwLl9tYXAgPSBuZXdNYXA7XG4gICAgb21hcC5fbGlzdCA9IG5ld0xpc3Q7XG4gICAgb21hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgb21hcC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgIHJldHVybiBvbWFwO1xuICB9XG4gIHJldHVybiBtYWtlT3JkZXJlZE1hcChuZXdNYXAsIG5ld0xpc3QpO1xufVxuXG52YXIgSVNfU1RBQ0tfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfU1RBQ0tfX0BAJztcblxuZnVuY3Rpb24gaXNTdGFjayhtYXliZVN0YWNrKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlU3RhY2sgJiYgbWF5YmVTdGFja1tJU19TVEFDS19TWU1CT0xdKTtcbn1cblxudmFyIFN0YWNrID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gU3RhY2sodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eVN0YWNrKClcbiAgICAgIDogaXNTdGFjayh2YWx1ZSlcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZW1wdHlTdGFjaygpLnB1c2hBbGwodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBJbmRleGVkQ29sbGVjdGlvbiApIFN0YWNrLl9fcHJvdG9fXyA9IEluZGV4ZWRDb2xsZWN0aW9uO1xuICBTdGFjay5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBJbmRleGVkQ29sbGVjdGlvbiAmJiBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUgKTtcbiAgU3RhY2sucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3RhY2s7XG5cbiAgU3RhY2sub2YgPSBmdW5jdGlvbiBvZiAoLyouLi52YWx1ZXMqLykge1xuICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgU3RhY2sucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1N0YWNrIFsnLCAnXScpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgU3RhY2sucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICB3aGlsZSAoaGVhZCAmJiBpbmRleC0tKSB7XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgIH1cbiAgICByZXR1cm4gaGVhZCA/IGhlYWQudmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uIHBlZWsgKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFkICYmIHRoaXMuX2hlYWQudmFsdWU7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2ggKC8qLi4udmFsdWVzKi8pIHtcbiAgICB2YXIgYXJndW1lbnRzJDEgPSBhcmd1bWVudHM7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplICsgYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgaGVhZCA9IHRoaXMuX2hlYWQ7XG4gICAgZm9yICh2YXIgaWkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgICAgaGVhZCA9IHtcbiAgICAgICAgdmFsdWU6IGFyZ3VtZW50cyQxW2lpXSxcbiAgICAgICAgbmV4dDogaGVhZCxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgIHRoaXMuX2hlYWQgPSBoZWFkO1xuICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUucHVzaEFsbCA9IGZ1bmN0aW9uIHB1c2hBbGwgKGl0ZXIpIHtcbiAgICBpdGVyID0gSW5kZXhlZENvbGxlY3Rpb24oaXRlcik7XG4gICAgaWYgKGl0ZXIuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgPT09IDAgJiYgaXNTdGFjayhpdGVyKSkge1xuICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgfVxuICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgIGl0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgbmV3U2l6ZSsrO1xuICAgICAgaGVhZCA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBuZXh0OiBoZWFkLFxuICAgICAgfTtcbiAgICB9LCAvKiByZXZlcnNlICovIHRydWUpO1xuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgIHRoaXMuX2hlYWQgPSBoZWFkO1xuICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgxKTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgIHRoaXMuX2hlYWQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gZW1wdHlTdGFjaygpO1xuICB9O1xuXG4gIFN0YWNrLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChiZWdpbiwgZW5kKSB7XG4gICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgdGhpcy5zaXplKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCB0aGlzLnNpemUpO1xuICAgIHZhciByZXNvbHZlZEVuZCA9IHJlc29sdmVFbmQoZW5kLCB0aGlzLnNpemUpO1xuICAgIGlmIChyZXNvbHZlZEVuZCAhPT0gdGhpcy5zaXplKSB7XG4gICAgICAvLyBzdXBlci5zbGljZShiZWdpbiwgZW5kKTtcbiAgICAgIHJldHVybiBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLCBiZWdpbiwgZW5kKTtcbiAgICB9XG4gICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemUgLSByZXNvbHZlZEJlZ2luO1xuICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICB3aGlsZSAocmVzb2x2ZWRCZWdpbi0tKSB7XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgIH1cbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlU3RhY2sobmV3U2l6ZSwgaGVhZCk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNdXRhYmlsaXR5XG5cbiAgU3RhY2sucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eVN0YWNrKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlU3RhY2sodGhpcy5zaXplLCB0aGlzLl9oZWFkLCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBJdGVyYXRpb25cblxuICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIG5ldyBBcnJheVNlcSh0aGlzLnRvQXJyYXkoKSkuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gZm4odiwgaywgdGhpcyQxJDEpOyB9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBpZiAoZm4obm9kZS52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIG5ldyBBcnJheVNlcSh0aGlzLnRvQXJyYXkoKSkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB9XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG5vZGUudmFsdWU7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBTdGFjaztcbn0oSW5kZXhlZENvbGxlY3Rpb24pKTtcblxuU3RhY2suaXNTdGFjayA9IGlzU3RhY2s7XG5cbnZhciBTdGFja1Byb3RvdHlwZSA9IFN0YWNrLnByb3RvdHlwZTtcblN0YWNrUHJvdG90eXBlW0lTX1NUQUNLX1NZTUJPTF0gPSB0cnVlO1xuU3RhY2tQcm90b3R5cGUuc2hpZnQgPSBTdGFja1Byb3RvdHlwZS5wb3A7XG5TdGFja1Byb3RvdHlwZS51bnNoaWZ0ID0gU3RhY2tQcm90b3R5cGUucHVzaDtcblN0YWNrUHJvdG90eXBlLnVuc2hpZnRBbGwgPSBTdGFja1Byb3RvdHlwZS5wdXNoQWxsO1xuU3RhY2tQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IHdpdGhNdXRhdGlvbnM7XG5TdGFja1Byb3RvdHlwZS53YXNBbHRlcmVkID0gd2FzQWx0ZXJlZDtcblN0YWNrUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5TdGFja1Byb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IFN0YWNrUHJvdG90eXBlLmFzTXV0YWJsZSA9IGFzTXV0YWJsZTtcblN0YWNrUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgYXJyKSB7XG4gIHJldHVybiByZXN1bHQudW5zaGlmdChhcnIpO1xufTtcblN0YWNrUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmouYXNJbW11dGFibGUoKTtcbn07XG5cbmZ1bmN0aW9uIG1ha2VTdGFjayhzaXplLCBoZWFkLCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKFN0YWNrUHJvdG90eXBlKTtcbiAgbWFwLnNpemUgPSBzaXplO1xuICBtYXAuX2hlYWQgPSBoZWFkO1xuICBtYXAuX19vd25lcklEID0gb3duZXJJRDtcbiAgbWFwLl9faGFzaCA9IGhhc2g7XG4gIG1hcC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgcmV0dXJuIG1hcDtcbn1cblxudmFyIEVNUFRZX1NUQUNLO1xuZnVuY3Rpb24gZW1wdHlTdGFjaygpIHtcbiAgcmV0dXJuIEVNUFRZX1NUQUNLIHx8IChFTVBUWV9TVEFDSyA9IG1ha2VTdGFjaygwKSk7XG59XG5cbnZhciBJU19TRVRfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfU0VUX19AQCc7XG5cbmZ1bmN0aW9uIGlzU2V0KG1heWJlU2V0KSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlU2V0ICYmIG1heWJlU2V0W0lTX1NFVF9TWU1CT0xdKTtcbn1cblxuZnVuY3Rpb24gaXNPcmRlcmVkU2V0KG1heWJlT3JkZXJlZFNldCkge1xuICByZXR1cm4gaXNTZXQobWF5YmVPcmRlcmVkU2V0KSAmJiBpc09yZGVyZWQobWF5YmVPcmRlcmVkU2V0KTtcbn1cblxuZnVuY3Rpb24gZGVlcEVxdWFsKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICAhaXNDb2xsZWN0aW9uKGIpIHx8XG4gICAgKGEuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGIuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGEuc2l6ZSAhPT0gYi5zaXplKSB8fFxuICAgIChhLl9faGFzaCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBiLl9faGFzaCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBhLl9faGFzaCAhPT0gYi5fX2hhc2gpIHx8XG4gICAgaXNLZXllZChhKSAhPT0gaXNLZXllZChiKSB8fFxuICAgIGlzSW5kZXhlZChhKSAhPT0gaXNJbmRleGVkKGIpIHx8XG4gICAgaXNPcmRlcmVkKGEpICE9PSBpc09yZGVyZWQoYilcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGEuc2l6ZSA9PT0gMCAmJiBiLnNpemUgPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBub3RBc3NvY2lhdGl2ZSA9ICFpc0Fzc29jaWF0aXZlKGEpO1xuXG4gIGlmIChpc09yZGVyZWQoYSkpIHtcbiAgICB2YXIgZW50cmllcyA9IGEuZW50cmllcygpO1xuICAgIHJldHVybiAoXG4gICAgICBiLmV2ZXJ5KGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXMubmV4dCgpLnZhbHVlO1xuICAgICAgICByZXR1cm4gZW50cnkgJiYgaXMoZW50cnlbMV0sIHYpICYmIChub3RBc3NvY2lhdGl2ZSB8fCBpcyhlbnRyeVswXSwgaykpO1xuICAgICAgfSkgJiYgZW50cmllcy5uZXh0KCkuZG9uZVxuICAgICk7XG4gIH1cblxuICB2YXIgZmxpcHBlZCA9IGZhbHNlO1xuXG4gIGlmIChhLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChiLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBhLmNhY2hlUmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGEuY2FjaGVSZXN1bHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZmxpcHBlZCA9IHRydWU7XG4gICAgICB2YXIgXyA9IGE7XG4gICAgICBhID0gYjtcbiAgICAgIGIgPSBfO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhbGxFcXVhbCA9IHRydWU7XG4gIHZhciBiU2l6ZSA9IGIuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgaWYgKFxuICAgICAgbm90QXNzb2NpYXRpdmVcbiAgICAgICAgPyAhYS5oYXModilcbiAgICAgICAgOiBmbGlwcGVkXG4gICAgICAgID8gIWlzKHYsIGEuZ2V0KGssIE5PVF9TRVQpKVxuICAgICAgICA6ICFpcyhhLmdldChrLCBOT1RfU0VUKSwgdilcbiAgICApIHtcbiAgICAgIGFsbEVxdWFsID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYWxsRXF1YWwgJiYgYS5zaXplID09PSBiU2l6ZTtcbn1cblxuZnVuY3Rpb24gbWl4aW4oY3RvciwgbWV0aG9kcykge1xuICB2YXIga2V5Q29waWVyID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGN0b3IucHJvdG90eXBlW2tleV0gPSBtZXRob2RzW2tleV07XG4gIH07XG4gIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJlxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMobWV0aG9kcykuZm9yRWFjaChrZXlDb3BpZXIpO1xuICByZXR1cm4gY3Rvcjtcbn1cblxuZnVuY3Rpb24gdG9KUyh2YWx1ZSkge1xuICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKCFpc0NvbGxlY3Rpb24odmFsdWUpKSB7XG4gICAgaWYgKCFpc0RhdGFTdHJ1Y3R1cmUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHZhbHVlID0gU2VxKHZhbHVlKTtcbiAgfVxuICBpZiAoaXNLZXllZCh2YWx1ZSkpIHtcbiAgICB2YXIgcmVzdWx0JDEgPSB7fTtcbiAgICB2YWx1ZS5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgIHJlc3VsdCQxW2tdID0gdG9KUyh2KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0JDE7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YWx1ZS5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYpIHtcbiAgICByZXN1bHQucHVzaCh0b0pTKHYpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnZhciBTZXQgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChTZXRDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIFNldCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGVtcHR5U2V0KClcbiAgICAgIDogaXNTZXQodmFsdWUpICYmICFpc09yZGVyZWQodmFsdWUpXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGVtcHR5U2V0KCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBTZXRDb2xsZWN0aW9uKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gc2V0LmFkZCh2KTsgfSk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgaWYgKCBTZXRDb2xsZWN0aW9uICkgU2V0Ll9fcHJvdG9fXyA9IFNldENvbGxlY3Rpb247XG4gIFNldC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXRDb2xsZWN0aW9uICYmIFNldENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIFNldC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXQ7XG5cbiAgU2V0Lm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIFNldC5mcm9tS2V5cyA9IGZ1bmN0aW9uIGZyb21LZXlzICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzKEtleWVkQ29sbGVjdGlvbih2YWx1ZSkua2V5U2VxKCkpO1xuICB9O1xuXG4gIFNldC5pbnRlcnNlY3QgPSBmdW5jdGlvbiBpbnRlcnNlY3QgKHNldHMpIHtcbiAgICBzZXRzID0gQ29sbGVjdGlvbihzZXRzKS50b0FycmF5KCk7XG4gICAgcmV0dXJuIHNldHMubGVuZ3RoXG4gICAgICA/IFNldFByb3RvdHlwZS5pbnRlcnNlY3QuYXBwbHkoU2V0KHNldHMucG9wKCkpLCBzZXRzKVxuICAgICAgOiBlbXB0eVNldCgpO1xuICB9O1xuXG4gIFNldC51bmlvbiA9IGZ1bmN0aW9uIHVuaW9uIChzZXRzKSB7XG4gICAgc2V0cyA9IENvbGxlY3Rpb24oc2V0cykudG9BcnJheSgpO1xuICAgIHJldHVybiBzZXRzLmxlbmd0aFxuICAgICAgPyBTZXRQcm90b3R5cGUudW5pb24uYXBwbHkoU2V0KHNldHMucG9wKCkpLCBzZXRzKVxuICAgICAgOiBlbXB0eVNldCgpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2V0IHsnLCAnfScpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBoYXMgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcC5oYXModmFsdWUpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAuc2V0KHZhbHVlLCB2YWx1ZSkpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlICh2YWx1ZSkge1xuICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLnJlbW92ZSh2YWx1ZSkpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAuY2xlYXIoKSk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gIFNldC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwIChtYXBwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgLy8ga2VlcCB0cmFjayBpZiB0aGUgc2V0IGlzIGFsdGVyZWQgYnkgdGhlIG1hcCBmdW5jdGlvblxuICAgIHZhciBkaWRDaGFuZ2VzID0gZmFsc2U7XG5cbiAgICB2YXIgbmV3TWFwID0gdXBkYXRlU2V0KFxuICAgICAgdGhpcyxcbiAgICAgIHRoaXMuX21hcC5tYXBFbnRyaWVzKGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgdmFyIHYgPSByZWZbMV07XG5cbiAgICAgICAgdmFyIG1hcHBlZCA9IG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIHYsIHRoaXMkMSQxKTtcblxuICAgICAgICBpZiAobWFwcGVkICE9PSB2KSB7XG4gICAgICAgICAgZGlkQ2hhbmdlcyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW21hcHBlZCwgbWFwcGVkXTtcbiAgICAgIH0sIGNvbnRleHQpXG4gICAgKTtcblxuICAgIHJldHVybiBkaWRDaGFuZ2VzID8gbmV3TWFwIDogdGhpcztcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24gdW5pb24gKCkge1xuICAgIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gICAgaXRlcnMgPSBpdGVycy5maWx0ZXIoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguc2l6ZSAhPT0gMDsgfSk7XG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgPT09IDAgJiYgIXRoaXMuX19vd25lcklEICYmIGl0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IoaXRlcnNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChzZXQpIHtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVycy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgU2V0Q29sbGVjdGlvbihpdGVyc1tpaV0pLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBzZXQuYWRkKHZhbHVlKTsgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU2V0LnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbiBpbnRlcnNlY3QgKCkge1xuICAgIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGl0ZXJzID0gaXRlcnMubWFwKGZ1bmN0aW9uIChpdGVyKSB7IHJldHVybiBTZXRDb2xsZWN0aW9uKGl0ZXIpOyB9KTtcbiAgICB2YXIgdG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoIWl0ZXJzLmV2ZXJ5KGZ1bmN0aW9uIChpdGVyKSB7IHJldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKTsgfSkpIHtcbiAgICAgICAgdG9SZW1vdmUucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICB0b1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdCAoKSB7XG4gICAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgd2hpbGUgKCBsZW4tLSApIGl0ZXJzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaXRlcnMgPSBpdGVycy5tYXAoZnVuY3Rpb24gKGl0ZXIpIHsgcmV0dXJuIFNldENvbGxlY3Rpb24oaXRlcik7IH0pO1xuICAgIHZhciB0b1JlbW92ZSA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChpdGVycy5zb21lKGZ1bmN0aW9uIChpdGVyKSB7IHJldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKTsgfSkpIHtcbiAgICAgICAgdG9SZW1vdmUucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICB0b1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uIHNvcnQgKGNvbXBhcmF0b3IpIHtcbiAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICByZXR1cm4gT3JkZXJlZFNldChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gIH07XG5cbiAgU2V0LnByb3RvdHlwZS5zb3J0QnkgPSBmdW5jdGlvbiBzb3J0QnkgKG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgIC8vIExhdGUgYmluZGluZ1xuICAgIHJldHVybiBPcmRlcmVkU2V0KHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uIHdhc0FsdGVyZWQgKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5fbWFwLl9faXRlcmF0ZShmdW5jdGlvbiAoaykgeyByZXR1cm4gZm4oaywgaywgdGhpcyQxJDEpOyB9LCByZXZlcnNlKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcC5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uIF9fZW5zdXJlT3duZXIgKG93bmVySUQpIHtcbiAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZW1wdHkoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX21ha2UobmV3TWFwLCBvd25lcklEKTtcbiAgfTtcblxuICByZXR1cm4gU2V0O1xufShTZXRDb2xsZWN0aW9uKSk7XG5cblNldC5pc1NldCA9IGlzU2V0O1xuXG52YXIgU2V0UHJvdG90eXBlID0gU2V0LnByb3RvdHlwZTtcblNldFByb3RvdHlwZVtJU19TRVRfU1lNQk9MXSA9IHRydWU7XG5TZXRQcm90b3R5cGVbREVMRVRFXSA9IFNldFByb3RvdHlwZS5yZW1vdmU7XG5TZXRQcm90b3R5cGUubWVyZ2UgPSBTZXRQcm90b3R5cGUuY29uY2F0ID0gU2V0UHJvdG90eXBlLnVuaW9uO1xuU2V0UHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuU2V0UHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5TZXRQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBTZXRQcm90b3R5cGUuYXNNdXRhYmxlID0gYXNNdXRhYmxlO1xuU2V0UHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgYXJyKSB7XG4gIHJldHVybiByZXN1bHQuYWRkKGFycik7XG59O1xuU2V0UHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmouYXNJbW11dGFibGUoKTtcbn07XG5cblNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlTZXQ7XG5TZXRQcm90b3R5cGUuX19tYWtlID0gbWFrZVNldDtcblxuZnVuY3Rpb24gdXBkYXRlU2V0KHNldCwgbmV3TWFwKSB7XG4gIGlmIChzZXQuX19vd25lcklEKSB7XG4gICAgc2V0LnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICBzZXQuX21hcCA9IG5ld01hcDtcbiAgICByZXR1cm4gc2V0O1xuICB9XG4gIHJldHVybiBuZXdNYXAgPT09IHNldC5fbWFwXG4gICAgPyBzZXRcbiAgICA6IG5ld01hcC5zaXplID09PSAwXG4gICAgPyBzZXQuX19lbXB0eSgpXG4gICAgOiBzZXQuX19tYWtlKG5ld01hcCk7XG59XG5cbmZ1bmN0aW9uIG1ha2VTZXQobWFwLCBvd25lcklEKSB7XG4gIHZhciBzZXQgPSBPYmplY3QuY3JlYXRlKFNldFByb3RvdHlwZSk7XG4gIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICBzZXQuX21hcCA9IG1hcDtcbiAgc2V0Ll9fb3duZXJJRCA9IG93bmVySUQ7XG4gIHJldHVybiBzZXQ7XG59XG5cbnZhciBFTVBUWV9TRVQ7XG5mdW5jdGlvbiBlbXB0eVNldCgpIHtcbiAgcmV0dXJuIEVNUFRZX1NFVCB8fCAoRU1QVFlfU0VUID0gbWFrZVNldChlbXB0eU1hcCgpKSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGxhenkgc2VxIG9mIG51bXMgZnJvbSBzdGFydCAoaW5jbHVzaXZlKSB0byBlbmRcbiAqIChleGNsdXNpdmUpLCBieSBzdGVwLCB3aGVyZSBzdGFydCBkZWZhdWx0cyB0byAwLCBzdGVwIHRvIDEsIGFuZCBlbmQgdG9cbiAqIGluZmluaXR5LiBXaGVuIHN0YXJ0IGlzIGVxdWFsIHRvIGVuZCwgcmV0dXJucyBlbXB0eSBsaXN0LlxuICovXG52YXIgUmFuZ2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChJbmRleGVkU2VxKSB7XG4gIGZ1bmN0aW9uIFJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmFuZ2UpKSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoc3RlcCAhPT0gMCwgJ0Nhbm5vdCBzdGVwIGEgUmFuZ2UgYnkgMCcpO1xuICAgIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVuZCA9IEluZmluaXR5O1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCA9PT0gdW5kZWZpbmVkID8gMSA6IE1hdGguYWJzKHN0ZXApO1xuICAgIGlmIChlbmQgPCBzdGFydCkge1xuICAgICAgc3RlcCA9IC1zdGVwO1xuICAgIH1cbiAgICB0aGlzLl9zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuX2VuZCA9IGVuZDtcbiAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNpemUgPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoKGVuZCAtIHN0YXJ0KSAvIHN0ZXAgLSAxKSArIDEpO1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIGlmIChFTVBUWV9SQU5HRSkge1xuICAgICAgICByZXR1cm4gRU1QVFlfUkFOR0U7XG4gICAgICB9XG4gICAgICBFTVBUWV9SQU5HRSA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBJbmRleGVkU2VxICkgUmFuZ2UuX19wcm90b19fID0gSW5kZXhlZFNlcTtcbiAgUmFuZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBSYW5nZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSYW5nZTtcblxuICBSYW5nZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuICdSYW5nZSBbXSc7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICAnUmFuZ2UgWyAnICtcbiAgICAgIHRoaXMuX3N0YXJ0ICtcbiAgICAgICcuLi4nICtcbiAgICAgIHRoaXMuX2VuZCArXG4gICAgICAodGhpcy5fc3RlcCAhPT0gMSA/ICcgYnkgJyArIHRoaXMuX3N0ZXAgOiAnJykgK1xuICAgICAgJyBdJ1xuICAgICk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KVxuICAgICAgPyB0aGlzLl9zdGFydCArIHdyYXBJbmRleCh0aGlzLCBpbmRleCkgKiB0aGlzLl9zdGVwXG4gICAgICA6IG5vdFNldFZhbHVlO1xuICB9O1xuXG4gIFJhbmdlLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzIChzZWFyY2hWYWx1ZSkge1xuICAgIHZhciBwb3NzaWJsZUluZGV4ID0gKHNlYXJjaFZhbHVlIC0gdGhpcy5fc3RhcnQpIC8gdGhpcy5fc3RlcDtcbiAgICByZXR1cm4gKFxuICAgICAgcG9zc2libGVJbmRleCA+PSAwICYmXG4gICAgICBwb3NzaWJsZUluZGV4IDwgdGhpcy5zaXplICYmXG4gICAgICBwb3NzaWJsZUluZGV4ID09PSBNYXRoLmZsb29yKHBvc3NpYmxlSW5kZXgpXG4gICAgKTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoYmVnaW4sIGVuZCkge1xuICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHRoaXMuc2l6ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBiZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgdGhpcy5zaXplKTtcbiAgICBlbmQgPSByZXNvbHZlRW5kKGVuZCwgdGhpcy5zaXplKTtcbiAgICBpZiAoZW5kIDw9IGJlZ2luKSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKDAsIDApO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhbmdlKFxuICAgICAgdGhpcy5nZXQoYmVnaW4sIHRoaXMuX2VuZCksXG4gICAgICB0aGlzLmdldChlbmQsIHRoaXMuX2VuZCksXG4gICAgICB0aGlzLl9zdGVwXG4gICAgKTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHNlYXJjaFZhbHVlKSB7XG4gICAgdmFyIG9mZnNldFZhbHVlID0gc2VhcmNoVmFsdWUgLSB0aGlzLl9zdGFydDtcbiAgICBpZiAob2Zmc2V0VmFsdWUgJSB0aGlzLl9zdGVwID09PSAwKSB7XG4gICAgICB2YXIgaW5kZXggPSBvZmZzZXRWYWx1ZSAvIHRoaXMuX3N0ZXA7XG4gICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2l6ZSkge1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAoc2VhcmNoVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleE9mKHNlYXJjaFZhbHVlKTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcbiAgICB2YXIgdmFsdWUgPSByZXZlcnNlID8gdGhpcy5fc3RhcnQgKyAoc2l6ZSAtIDEpICogc3RlcCA6IHRoaXMuX3N0YXJ0O1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSAhPT0gc2l6ZSkge1xuICAgICAgaWYgKGZuKHZhbHVlLCByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFsdWUgKz0gcmV2ZXJzZSA/IC1zdGVwIDogc3RlcDtcbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIHN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgIHZhciB2YWx1ZSA9IHJldmVyc2UgPyB0aGlzLl9zdGFydCArIChzaXplIC0gMSkgKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG4gICAgdmFyIGkgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGkgPT09IHNpemUpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIHYgPSB2YWx1ZTtcbiAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG4gICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKywgdik7XG4gICAgfSk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAob3RoZXIpIHtcbiAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBSYW5nZVxuICAgICAgPyB0aGlzLl9zdGFydCA9PT0gb3RoZXIuX3N0YXJ0ICYmXG4gICAgICAgICAgdGhpcy5fZW5kID09PSBvdGhlci5fZW5kICYmXG4gICAgICAgICAgdGhpcy5fc3RlcCA9PT0gb3RoZXIuX3N0ZXBcbiAgICAgIDogZGVlcEVxdWFsKHRoaXMsIG90aGVyKTtcbiAgfTtcblxuICByZXR1cm4gUmFuZ2U7XG59KEluZGV4ZWRTZXEpKTtcblxudmFyIEVNUFRZX1JBTkdFO1xuXG5mdW5jdGlvbiBnZXRJbiQxKGNvbGxlY3Rpb24sIHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKSB7XG4gIHZhciBrZXlQYXRoID0gY29lcmNlS2V5UGF0aChzZWFyY2hLZXlQYXRoKTtcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSAhPT0ga2V5UGF0aC5sZW5ndGgpIHtcbiAgICBjb2xsZWN0aW9uID0gZ2V0KGNvbGxlY3Rpb24sIGtleVBhdGhbaSsrXSwgTk9UX1NFVCk7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE5PVF9TRVQpIHtcbiAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbGxlY3Rpb247XG59XG5cbmZ1bmN0aW9uIGdldEluKHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKSB7XG4gIHJldHVybiBnZXRJbiQxKHRoaXMsIHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaGFzSW4kMShjb2xsZWN0aW9uLCBrZXlQYXRoKSB7XG4gIHJldHVybiBnZXRJbiQxKGNvbGxlY3Rpb24sIGtleVBhdGgsIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xufVxuXG5mdW5jdGlvbiBoYXNJbihzZWFyY2hLZXlQYXRoKSB7XG4gIHJldHVybiBoYXNJbiQxKHRoaXMsIHNlYXJjaEtleVBhdGgpO1xufVxuXG5mdW5jdGlvbiB0b09iamVjdCgpIHtcbiAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgdmFyIG9iamVjdCA9IHt9O1xuICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbiAodiwgaykge1xuICAgIG9iamVjdFtrXSA9IHY7XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vLyBOb3RlOiBhbGwgb2YgdGhlc2UgbWV0aG9kcyBhcmUgZGVwcmVjYXRlZC5cbkNvbGxlY3Rpb24uaXNJdGVyYWJsZSA9IGlzQ29sbGVjdGlvbjtcbkNvbGxlY3Rpb24uaXNLZXllZCA9IGlzS2V5ZWQ7XG5Db2xsZWN0aW9uLmlzSW5kZXhlZCA9IGlzSW5kZXhlZDtcbkNvbGxlY3Rpb24uaXNBc3NvY2lhdGl2ZSA9IGlzQXNzb2NpYXRpdmU7XG5Db2xsZWN0aW9uLmlzT3JkZXJlZCA9IGlzT3JkZXJlZDtcblxuQ29sbGVjdGlvbi5JdGVyYXRvciA9IEl0ZXJhdG9yO1xuXG5taXhpbihDb2xsZWN0aW9uLCB7XG4gIC8vICMjIyBDb252ZXJzaW9uIHRvIG90aGVyIHR5cGVzXG5cbiAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgIHZhciBhcnJheSA9IG5ldyBBcnJheSh0aGlzLnNpemUgfHwgMCk7XG4gICAgdmFyIHVzZVR1cGxlcyA9IGlzS2V5ZWQodGhpcyk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAvLyBLZXllZCBjb2xsZWN0aW9ucyBwcm9kdWNlIGFuIGFycmF5IG9mIHR1cGxlcy5cbiAgICAgIGFycmF5W2krK10gPSB1c2VUdXBsZXMgPyBbaywgdl0gOiB2O1xuICAgIH0pO1xuICAgIHJldHVybiBhcnJheTtcbiAgfSxcblxuICB0b0luZGV4ZWRTZXE6IGZ1bmN0aW9uIHRvSW5kZXhlZFNlcSgpIHtcbiAgICByZXR1cm4gbmV3IFRvSW5kZXhlZFNlcXVlbmNlKHRoaXMpO1xuICB9LFxuXG4gIHRvSlM6IGZ1bmN0aW9uIHRvSlMkMSgpIHtcbiAgICByZXR1cm4gdG9KUyh0aGlzKTtcbiAgfSxcblxuICB0b0tleWVkU2VxOiBmdW5jdGlvbiB0b0tleWVkU2VxKCkge1xuICAgIHJldHVybiBuZXcgVG9LZXllZFNlcXVlbmNlKHRoaXMsIHRydWUpO1xuICB9LFxuXG4gIHRvTWFwOiBmdW5jdGlvbiB0b01hcCgpIHtcbiAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgcmV0dXJuIE1hcCh0aGlzLnRvS2V5ZWRTZXEoKSk7XG4gIH0sXG5cbiAgdG9PYmplY3Q6IHRvT2JqZWN0LFxuXG4gIHRvT3JkZXJlZE1hcDogZnVuY3Rpb24gdG9PcmRlcmVkTWFwKCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gT3JkZXJlZE1hcCh0aGlzLnRvS2V5ZWRTZXEoKSk7XG4gIH0sXG5cbiAgdG9PcmRlcmVkU2V0OiBmdW5jdGlvbiB0b09yZGVyZWRTZXQoKSB7XG4gICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgIHJldHVybiBPcmRlcmVkU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgfSxcblxuICB0b1NldDogZnVuY3Rpb24gdG9TZXQoKSB7XG4gICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgIHJldHVybiBTZXQoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICB9LFxuXG4gIHRvU2V0U2VxOiBmdW5jdGlvbiB0b1NldFNlcSgpIHtcbiAgICByZXR1cm4gbmV3IFRvU2V0U2VxdWVuY2UodGhpcyk7XG4gIH0sXG5cbiAgdG9TZXE6IGZ1bmN0aW9uIHRvU2VxKCkge1xuICAgIHJldHVybiBpc0luZGV4ZWQodGhpcylcbiAgICAgID8gdGhpcy50b0luZGV4ZWRTZXEoKVxuICAgICAgOiBpc0tleWVkKHRoaXMpXG4gICAgICA/IHRoaXMudG9LZXllZFNlcSgpXG4gICAgICA6IHRoaXMudG9TZXRTZXEoKTtcbiAgfSxcblxuICB0b1N0YWNrOiBmdW5jdGlvbiB0b1N0YWNrKCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gU3RhY2soaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICB9LFxuXG4gIHRvTGlzdDogZnVuY3Rpb24gdG9MaXN0KCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gTGlzdChpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG4gIH0sXG5cbiAgLy8gIyMjIENvbW1vbiBKYXZhU2NyaXB0IG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcblxuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdbQ29sbGVjdGlvbl0nO1xuICB9LFxuXG4gIF9fdG9TdHJpbmc6IGZ1bmN0aW9uIF9fdG9TdHJpbmcoaGVhZCwgdGFpbCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiBoZWFkICsgdGFpbDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIGhlYWQgK1xuICAgICAgJyAnICtcbiAgICAgIHRoaXMudG9TZXEoKS5tYXAodGhpcy5fX3RvU3RyaW5nTWFwcGVyKS5qb2luKCcsICcpICtcbiAgICAgICcgJyArXG4gICAgICB0YWlsXG4gICAgKTtcbiAgfSxcblxuICAvLyAjIyMgRVM2IENvbGxlY3Rpb24gbWV0aG9kcyAoRVM2IEFycmF5IGFuZCBNYXApXG5cbiAgY29uY2F0OiBmdW5jdGlvbiBjb25jYXQoKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSB2YWx1ZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIHJldHVybiByZWlmeSh0aGlzLCBjb25jYXRGYWN0b3J5KHRoaXMsIHZhbHVlcykpO1xuICB9LFxuXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNvbWUoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpOyB9KTtcbiAgfSxcblxuICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTKTtcbiAgfSxcblxuICBldmVyeTogZnVuY3Rpb24gZXZlcnkocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICB2YXIgcmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrLCBjKSB7XG4gICAgICBpZiAoIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgIHJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH0sXG5cbiAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZpbHRlckZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCB0cnVlKSk7XG4gIH0sXG5cbiAgZmluZDogZnVuY3Rpb24gZmluZChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gZW50cnkgPyBlbnRyeVsxXSA6IG5vdFNldFZhbHVlO1xuICB9LFxuXG4gIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goc2lkZUVmZmVjdCwgY29udGV4dCkge1xuICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRlKGNvbnRleHQgPyBzaWRlRWZmZWN0LmJpbmQoY29udGV4dCkgOiBzaWRlRWZmZWN0KTtcbiAgfSxcblxuICBqb2luOiBmdW5jdGlvbiBqb2luKHNlcGFyYXRvcikge1xuICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgc2VwYXJhdG9yID0gc2VwYXJhdG9yICE9PSB1bmRlZmluZWQgPyAnJyArIHNlcGFyYXRvciA6ICcsJztcbiAgICB2YXIgam9pbmVkID0gJyc7XG4gICAgdmFyIGlzRmlyc3QgPSB0cnVlO1xuICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uICh2KSB7XG4gICAgICBpc0ZpcnN0ID8gKGlzRmlyc3QgPSBmYWxzZSkgOiAoam9pbmVkICs9IHNlcGFyYXRvcik7XG4gICAgICBqb2luZWQgKz0gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQgPyB2LnRvU3RyaW5nKCkgOiAnJztcbiAgICB9KTtcbiAgICByZXR1cm4gam9pbmVkO1xuICB9LFxuXG4gIGtleXM6IGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX0tFWVMpO1xuICB9LFxuXG4gIG1hcDogZnVuY3Rpb24gbWFwKG1hcHBlciwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCkpO1xuICB9LFxuXG4gIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlJDEocmVkdWNlciwgaW5pdGlhbFJlZHVjdGlvbiwgY29udGV4dCkge1xuICAgIHJldHVybiByZWR1Y2UoXG4gICAgICB0aGlzLFxuICAgICAgcmVkdWNlcixcbiAgICAgIGluaXRpYWxSZWR1Y3Rpb24sXG4gICAgICBjb250ZXh0LFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA8IDIsXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH0sXG5cbiAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVkdWNlKFxuICAgICAgdGhpcyxcbiAgICAgIHJlZHVjZXIsXG4gICAgICBpbml0aWFsUmVkdWN0aW9uLFxuICAgICAgY29udGV4dCxcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPCAyLFxuICAgICAgdHJ1ZVxuICAgICk7XG4gIH0sXG5cbiAgcmV2ZXJzZTogZnVuY3Rpb24gcmV2ZXJzZSgpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgcmV2ZXJzZUZhY3RvcnkodGhpcywgdHJ1ZSkpO1xuICB9LFxuXG4gIHNsaWNlOiBmdW5jdGlvbiBzbGljZShiZWdpbiwgZW5kKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNsaWNlRmFjdG9yeSh0aGlzLCBiZWdpbiwgZW5kLCB0cnVlKSk7XG4gIH0sXG5cbiAgc29tZTogZnVuY3Rpb24gc29tZShwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gIXRoaXMuZXZlcnkobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICB9LFxuXG4gIHNvcnQ6IGZ1bmN0aW9uIHNvcnQoY29tcGFyYXRvcikge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gIH0sXG5cbiAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUyk7XG4gIH0sXG5cbiAgLy8gIyMjIE1vcmUgc2VxdWVudGlhbCBtZXRob2RzXG5cbiAgYnV0TGFzdDogZnVuY3Rpb24gYnV0TGFzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgwLCAtMSk7XG4gIH0sXG5cbiAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaXplICE9PSB1bmRlZmluZWQgPyB0aGlzLnNpemUgPT09IDAgOiAhdGhpcy5zb21lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pO1xuICB9LFxuXG4gIGNvdW50OiBmdW5jdGlvbiBjb3VudChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZW5zdXJlU2l6ZShcbiAgICAgIHByZWRpY2F0ZSA/IHRoaXMudG9TZXEoKS5maWx0ZXIocHJlZGljYXRlLCBjb250ZXh0KSA6IHRoaXNcbiAgICApO1xuICB9LFxuXG4gIGNvdW50Qnk6IGZ1bmN0aW9uIGNvdW50QnkoZ3JvdXBlciwgY29udGV4dCkge1xuICAgIHJldHVybiBjb3VudEJ5RmFjdG9yeSh0aGlzLCBncm91cGVyLCBjb250ZXh0KTtcbiAgfSxcblxuICBlcXVhbHM6IGZ1bmN0aW9uIGVxdWFscyhvdGhlcikge1xuICAgIHJldHVybiBkZWVwRXF1YWwodGhpcywgb3RoZXIpO1xuICB9LFxuXG4gIGVudHJ5U2VxOiBmdW5jdGlvbiBlbnRyeVNlcSgpIHtcbiAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXM7XG4gICAgaWYgKGNvbGxlY3Rpb24uX2NhY2hlKSB7XG4gICAgICAvLyBXZSBjYWNoZSBhcyBhbiBlbnRyaWVzIGFycmF5LCBzbyB3ZSBjYW4ganVzdCByZXR1cm4gdGhlIGNhY2hlIVxuICAgICAgcmV0dXJuIG5ldyBBcnJheVNlcShjb2xsZWN0aW9uLl9jYWNoZSk7XG4gICAgfVxuICAgIHZhciBlbnRyaWVzU2VxdWVuY2UgPSBjb2xsZWN0aW9uLnRvU2VxKCkubWFwKGVudHJ5TWFwcGVyKS50b0luZGV4ZWRTZXEoKTtcbiAgICBlbnRyaWVzU2VxdWVuY2UuZnJvbUVudHJ5U2VxID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY29sbGVjdGlvbi50b1NlcSgpOyB9O1xuICAgIHJldHVybiBlbnRyaWVzU2VxdWVuY2U7XG4gIH0sXG5cbiAgZmlsdGVyTm90OiBmdW5jdGlvbiBmaWx0ZXJOb3QocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgfSxcblxuICBmaW5kRW50cnk6IGZ1bmN0aW9uIGZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIGZvdW5kID0gbm90U2V0VmFsdWU7XG4gICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICBmb3VuZCA9IFtrLCB2XTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZDtcbiAgfSxcblxuICBmaW5kS2V5OiBmdW5jdGlvbiBmaW5kS2V5KHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuICB9LFxuXG4gIGZpbmRMYXN0OiBmdW5jdGlvbiBmaW5kTGFzdChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKS5maW5kKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIGZpbmRMYXN0RW50cnk6IGZ1bmN0aW9uIGZpbmRMYXN0RW50cnkocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKTtcbiAgfSxcblxuICBmaW5kTGFzdEtleTogZnVuY3Rpb24gZmluZExhc3RLZXkocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKS5maW5kS2V5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gIH0sXG5cbiAgZmlyc3Q6IGZ1bmN0aW9uIGZpcnN0KG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZChyZXR1cm5UcnVlLCBudWxsLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgZmxhdE1hcDogZnVuY3Rpb24gZmxhdE1hcChtYXBwZXIsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdE1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KSk7XG4gIH0sXG5cbiAgZmxhdHRlbjogZnVuY3Rpb24gZmxhdHRlbihkZXB0aCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgdHJ1ZSkpO1xuICB9LFxuXG4gIGZyb21FbnRyeVNlcTogZnVuY3Rpb24gZnJvbUVudHJ5U2VxKCkge1xuICAgIHJldHVybiBuZXcgRnJvbUVudHJpZXNTZXF1ZW5jZSh0aGlzKTtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uIGdldChzZWFyY2hLZXksIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZChmdW5jdGlvbiAoXywga2V5KSB7IHJldHVybiBpcyhrZXksIHNlYXJjaEtleSk7IH0sIHVuZGVmaW5lZCwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIGdldEluOiBnZXRJbixcblxuICBncm91cEJ5OiBmdW5jdGlvbiBncm91cEJ5KGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXBCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gIH0sXG5cbiAgaGFzOiBmdW5jdGlvbiBoYXMoc2VhcmNoS2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KHNlYXJjaEtleSwgTk9UX1NFVCkgIT09IE5PVF9TRVQ7XG4gIH0sXG5cbiAgaGFzSW46IGhhc0luLFxuXG4gIGlzU3Vic2V0OiBmdW5jdGlvbiBpc1N1YnNldChpdGVyKSB7XG4gICAgaXRlciA9IHR5cGVvZiBpdGVyLmluY2x1ZGVzID09PSAnZnVuY3Rpb24nID8gaXRlciA6IENvbGxlY3Rpb24oaXRlcik7XG4gICAgcmV0dXJuIHRoaXMuZXZlcnkoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKTsgfSk7XG4gIH0sXG5cbiAgaXNTdXBlcnNldDogZnVuY3Rpb24gaXNTdXBlcnNldChpdGVyKSB7XG4gICAgaXRlciA9IHR5cGVvZiBpdGVyLmlzU3Vic2V0ID09PSAnZnVuY3Rpb24nID8gaXRlciA6IENvbGxlY3Rpb24oaXRlcik7XG4gICAgcmV0dXJuIGl0ZXIuaXNTdWJzZXQodGhpcyk7XG4gIH0sXG5cbiAga2V5T2Y6IGZ1bmN0aW9uIGtleU9mKHNlYXJjaFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZEtleShmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIGlzKHZhbHVlLCBzZWFyY2hWYWx1ZSk7IH0pO1xuICB9LFxuXG4gIGtleVNlcTogZnVuY3Rpb24ga2V5U2VxKCkge1xuICAgIHJldHVybiB0aGlzLnRvU2VxKCkubWFwKGtleU1hcHBlcikudG9JbmRleGVkU2VxKCk7XG4gIH0sXG5cbiAgbGFzdDogZnVuY3Rpb24gbGFzdChub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmZpcnN0KG5vdFNldFZhbHVlKTtcbiAgfSxcblxuICBsYXN0S2V5T2Y6IGZ1bmN0aW9uIGxhc3RLZXlPZihzZWFyY2hWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkua2V5T2Yoc2VhcmNoVmFsdWUpO1xuICB9LFxuXG4gIG1heDogZnVuY3Rpb24gbWF4KGNvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKTtcbiAgfSxcblxuICBtYXhCeTogZnVuY3Rpb24gbWF4QnkobWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKTtcbiAgfSxcblxuICBtaW46IGZ1bmN0aW9uIG1pbihjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heEZhY3RvcnkoXG4gICAgICB0aGlzLFxuICAgICAgY29tcGFyYXRvciA/IG5lZyhjb21wYXJhdG9yKSA6IGRlZmF1bHROZWdDb21wYXJhdG9yXG4gICAgKTtcbiAgfSxcblxuICBtaW5CeTogZnVuY3Rpb24gbWluQnkobWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heEZhY3RvcnkoXG4gICAgICB0aGlzLFxuICAgICAgY29tcGFyYXRvciA/IG5lZyhjb21wYXJhdG9yKSA6IGRlZmF1bHROZWdDb21wYXJhdG9yLFxuICAgICAgbWFwcGVyXG4gICAgKTtcbiAgfSxcblxuICByZXN0OiBmdW5jdGlvbiByZXN0KCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlKDEpO1xuICB9LFxuXG4gIHNraXA6IGZ1bmN0aW9uIHNraXAoYW1vdW50KSB7XG4gICAgcmV0dXJuIGFtb3VudCA9PT0gMCA/IHRoaXMgOiB0aGlzLnNsaWNlKE1hdGgubWF4KDAsIGFtb3VudCkpO1xuICB9LFxuXG4gIHNraXBMYXN0OiBmdW5jdGlvbiBza2lwTGFzdChhbW91bnQpIHtcbiAgICByZXR1cm4gYW1vdW50ID09PSAwID8gdGhpcyA6IHRoaXMuc2xpY2UoMCwgLU1hdGgubWF4KDAsIGFtb3VudCkpO1xuICB9LFxuXG4gIHNraXBXaGlsZTogZnVuY3Rpb24gc2tpcFdoaWxlKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBza2lwV2hpbGVGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgdHJ1ZSkpO1xuICB9LFxuXG4gIHNraXBVbnRpbDogZnVuY3Rpb24gc2tpcFVudGlsKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnNraXBXaGlsZShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gIH0sXG5cbiAgc29ydEJ5OiBmdW5jdGlvbiBzb3J0QnkobWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICB9LFxuXG4gIHRha2U6IGZ1bmN0aW9uIHRha2UoYW1vdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgTWF0aC5tYXgoMCwgYW1vdW50KSk7XG4gIH0sXG5cbiAgdGFrZUxhc3Q6IGZ1bmN0aW9uIHRha2VMYXN0KGFtb3VudCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlKC1NYXRoLm1heCgwLCBhbW91bnQpKTtcbiAgfSxcblxuICB0YWtlV2hpbGU6IGZ1bmN0aW9uIHRha2VXaGlsZShwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgdGFrZVdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQpKTtcbiAgfSxcblxuICB0YWtlVW50aWw6IGZ1bmN0aW9uIHRha2VVbnRpbChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50YWtlV2hpbGUobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGZuKSB7XG4gICAgcmV0dXJuIGZuKHRoaXMpO1xuICB9LFxuXG4gIHZhbHVlU2VxOiBmdW5jdGlvbiB2YWx1ZVNlcSgpIHtcbiAgICByZXR1cm4gdGhpcy50b0luZGV4ZWRTZXEoKTtcbiAgfSxcblxuICAvLyAjIyMgSGFzaGFibGUgT2JqZWN0XG5cbiAgaGFzaENvZGU6IGZ1bmN0aW9uIGhhc2hDb2RlKCkge1xuICAgIHJldHVybiB0aGlzLl9faGFzaCB8fCAodGhpcy5fX2hhc2ggPSBoYXNoQ29sbGVjdGlvbih0aGlzKSk7XG4gIH0sXG5cbiAgLy8gIyMjIEludGVybmFsXG5cbiAgLy8gYWJzdHJhY3QgX19pdGVyYXRlKGZuLCByZXZlcnNlKVxuXG4gIC8vIGFic3RyYWN0IF9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSlcbn0pO1xuXG52YXIgQ29sbGVjdGlvblByb3RvdHlwZSA9IENvbGxlY3Rpb24ucHJvdG90eXBlO1xuQ29sbGVjdGlvblByb3RvdHlwZVtJU19DT0xMRUNUSU9OX1NZTUJPTF0gPSB0cnVlO1xuQ29sbGVjdGlvblByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gQ29sbGVjdGlvblByb3RvdHlwZS52YWx1ZXM7XG5Db2xsZWN0aW9uUHJvdG90eXBlLnRvSlNPTiA9IENvbGxlY3Rpb25Qcm90b3R5cGUudG9BcnJheTtcbkNvbGxlY3Rpb25Qcm90b3R5cGUuX190b1N0cmluZ01hcHBlciA9IHF1b3RlU3RyaW5nO1xuQ29sbGVjdGlvblByb3RvdHlwZS5pbnNwZWN0ID0gQ29sbGVjdGlvblByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5Db2xsZWN0aW9uUHJvdG90eXBlLmNoYWluID0gQ29sbGVjdGlvblByb3RvdHlwZS5mbGF0TWFwO1xuQ29sbGVjdGlvblByb3RvdHlwZS5jb250YWlucyA9IENvbGxlY3Rpb25Qcm90b3R5cGUuaW5jbHVkZXM7XG5cbm1peGluKEtleWVkQ29sbGVjdGlvbiwge1xuICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuICBmbGlwOiBmdW5jdGlvbiBmbGlwKCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGlwRmFjdG9yeSh0aGlzKSk7XG4gIH0sXG5cbiAgbWFwRW50cmllczogZnVuY3Rpb24gbWFwRW50cmllcyhtYXBwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHJldHVybiByZWlmeShcbiAgICAgIHRoaXMsXG4gICAgICB0aGlzLnRvU2VxKClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gbWFwcGVyLmNhbGwoY29udGV4dCwgW2ssIHZdLCBpdGVyYXRpb25zKyssIHRoaXMkMSQxKTsgfSlcbiAgICAgICAgLmZyb21FbnRyeVNlcSgpXG4gICAgKTtcbiAgfSxcblxuICBtYXBLZXlzOiBmdW5jdGlvbiBtYXBLZXlzKG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gcmVpZnkoXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy50b1NlcSgpXG4gICAgICAgIC5mbGlwKClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoaywgdikgeyByZXR1cm4gbWFwcGVyLmNhbGwoY29udGV4dCwgaywgdiwgdGhpcyQxJDEpOyB9KVxuICAgICAgICAuZmxpcCgpXG4gICAgKTtcbiAgfSxcbn0pO1xuXG52YXIgS2V5ZWRDb2xsZWN0aW9uUHJvdG90eXBlID0gS2V5ZWRDb2xsZWN0aW9uLnByb3RvdHlwZTtcbktleWVkQ29sbGVjdGlvblByb3RvdHlwZVtJU19LRVlFRF9TWU1CT0xdID0gdHJ1ZTtcbktleWVkQ29sbGVjdGlvblByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gQ29sbGVjdGlvblByb3RvdHlwZS5lbnRyaWVzO1xuS2V5ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnRvSlNPTiA9IHRvT2JqZWN0O1xuS2V5ZWRDb2xsZWN0aW9uUHJvdG90eXBlLl9fdG9TdHJpbmdNYXBwZXIgPSBmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gcXVvdGVTdHJpbmcoaykgKyAnOiAnICsgcXVvdGVTdHJpbmcodik7IH07XG5cbm1peGluKEluZGV4ZWRDb2xsZWN0aW9uLCB7XG4gIC8vICMjIyBDb252ZXJzaW9uIHRvIG90aGVyIHR5cGVzXG5cbiAgdG9LZXllZFNlcTogZnVuY3Rpb24gdG9LZXllZFNlcSgpIHtcbiAgICByZXR1cm4gbmV3IFRvS2V5ZWRTZXF1ZW5jZSh0aGlzLCBmYWxzZSk7XG4gIH0sXG5cbiAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmaWx0ZXJGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgZmFsc2UpKTtcbiAgfSxcblxuICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHJldHVybiBlbnRyeSA/IGVudHJ5WzBdIDogLTE7XG4gIH0sXG5cbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hWYWx1ZSkge1xuICAgIHZhciBrZXkgPSB0aGlzLmtleU9mKHNlYXJjaFZhbHVlKTtcbiAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgPyAtMSA6IGtleTtcbiAgfSxcblxuICBsYXN0SW5kZXhPZjogZnVuY3Rpb24gbGFzdEluZGV4T2Yoc2VhcmNoVmFsdWUpIHtcbiAgICB2YXIga2V5ID0gdGhpcy5sYXN0S2V5T2Yoc2VhcmNoVmFsdWUpO1xuICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/IC0xIDoga2V5O1xuICB9LFxuXG4gIHJldmVyc2U6IGZ1bmN0aW9uIHJldmVyc2UoKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHJldmVyc2VGYWN0b3J5KHRoaXMsIGZhbHNlKSk7XG4gIH0sXG5cbiAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKGJlZ2luLCBlbmQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgc2xpY2VGYWN0b3J5KHRoaXMsIGJlZ2luLCBlbmQsIGZhbHNlKSk7XG4gIH0sXG5cbiAgc3BsaWNlOiBmdW5jdGlvbiBzcGxpY2UoaW5kZXgsIHJlbW92ZU51bSAvKiwgLi4udmFsdWVzKi8pIHtcbiAgICB2YXIgbnVtQXJncyA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgcmVtb3ZlTnVtID0gTWF0aC5tYXgocmVtb3ZlTnVtIHx8IDAsIDApO1xuICAgIGlmIChudW1BcmdzID09PSAwIHx8IChudW1BcmdzID09PSAyICYmICFyZW1vdmVOdW0pKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gSWYgaW5kZXggaXMgbmVnYXRpdmUsIGl0IHNob3VsZCByZXNvbHZlIHJlbGF0aXZlIHRvIHRoZSBzaXplIG9mIHRoZVxuICAgIC8vIGNvbGxlY3Rpb24uIEhvd2V2ZXIgc2l6ZSBtYXkgYmUgZXhwZW5zaXZlIHRvIGNvbXB1dGUgaWYgbm90IGNhY2hlZCwgc29cbiAgICAvLyBvbmx5IGNhbGwgY291bnQoKSBpZiB0aGUgbnVtYmVyIGlzIGluIGZhY3QgbmVnYXRpdmUuXG4gICAgaW5kZXggPSByZXNvbHZlQmVnaW4oaW5kZXgsIGluZGV4IDwgMCA/IHRoaXMuY291bnQoKSA6IHRoaXMuc2l6ZSk7XG4gICAgdmFyIHNwbGljZWQgPSB0aGlzLnNsaWNlKDAsIGluZGV4KTtcbiAgICByZXR1cm4gcmVpZnkoXG4gICAgICB0aGlzLFxuICAgICAgbnVtQXJncyA9PT0gMVxuICAgICAgICA/IHNwbGljZWRcbiAgICAgICAgOiBzcGxpY2VkLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cywgMiksIHRoaXMuc2xpY2UoaW5kZXggKyByZW1vdmVOdW0pKVxuICAgICk7XG4gIH0sXG5cbiAgLy8gIyMjIE1vcmUgY29sbGVjdGlvbiBtZXRob2RzXG5cbiAgZmluZExhc3RJbmRleDogZnVuY3Rpb24gZmluZExhc3RJbmRleChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRMYXN0RW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gZW50cnkgPyBlbnRyeVswXSA6IC0xO1xuICB9LFxuXG4gIGZpcnN0OiBmdW5jdGlvbiBmaXJzdChub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmdldCgwLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgZmxhdHRlbjogZnVuY3Rpb24gZmxhdHRlbihkZXB0aCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgZmFsc2UpKTtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uIGdldChpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgcmV0dXJuIGluZGV4IDwgMCB8fFxuICAgICAgdGhpcy5zaXplID09PSBJbmZpbml0eSB8fFxuICAgICAgKHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGluZGV4ID4gdGhpcy5zaXplKVxuICAgICAgPyBub3RTZXRWYWx1ZVxuICAgICAgOiB0aGlzLmZpbmQoZnVuY3Rpb24gKF8sIGtleSkgeyByZXR1cm4ga2V5ID09PSBpbmRleDsgfSwgdW5kZWZpbmVkLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgaGFzOiBmdW5jdGlvbiBoYXMoaW5kZXgpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgcmV0dXJuIChcbiAgICAgIGluZGV4ID49IDAgJiZcbiAgICAgICh0aGlzLnNpemUgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHwgaW5kZXggPCB0aGlzLnNpemVcbiAgICAgICAgOiB0aGlzLmluZGV4T2YoaW5kZXgpICE9PSAtMSlcbiAgICApO1xuICB9LFxuXG4gIGludGVycG9zZTogZnVuY3Rpb24gaW50ZXJwb3NlKHNlcGFyYXRvcikge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBpbnRlcnBvc2VGYWN0b3J5KHRoaXMsIHNlcGFyYXRvcikpO1xuICB9LFxuXG4gIGludGVybGVhdmU6IGZ1bmN0aW9uIGludGVybGVhdmUoLyouLi5jb2xsZWN0aW9ucyovKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zID0gW3RoaXNdLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cykpO1xuICAgIHZhciB6aXBwZWQgPSB6aXBXaXRoRmFjdG9yeSh0aGlzLnRvU2VxKCksIEluZGV4ZWRTZXEub2YsIGNvbGxlY3Rpb25zKTtcbiAgICB2YXIgaW50ZXJsZWF2ZWQgPSB6aXBwZWQuZmxhdHRlbih0cnVlKTtcbiAgICBpZiAoemlwcGVkLnNpemUpIHtcbiAgICAgIGludGVybGVhdmVkLnNpemUgPSB6aXBwZWQuc2l6ZSAqIGNvbGxlY3Rpb25zLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGludGVybGVhdmVkKTtcbiAgfSxcblxuICBrZXlTZXE6IGZ1bmN0aW9uIGtleVNlcSgpIHtcbiAgICByZXR1cm4gUmFuZ2UoMCwgdGhpcy5zaXplKTtcbiAgfSxcblxuICBsYXN0OiBmdW5jdGlvbiBsYXN0KG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KC0xLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgc2tpcFdoaWxlOiBmdW5jdGlvbiBza2lwV2hpbGUocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNraXBXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCBmYWxzZSkpO1xuICB9LFxuXG4gIHppcDogZnVuY3Rpb24gemlwKC8qLCAuLi5jb2xsZWN0aW9ucyAqLykge1xuICAgIHZhciBjb2xsZWN0aW9ucyA9IFt0aGlzXS5jb25jYXQoYXJyQ29weShhcmd1bWVudHMpKTtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgemlwV2l0aEZhY3RvcnkodGhpcywgZGVmYXVsdFppcHBlciwgY29sbGVjdGlvbnMpKTtcbiAgfSxcblxuICB6aXBBbGw6IGZ1bmN0aW9uIHppcEFsbCgvKiwgLi4uY29sbGVjdGlvbnMgKi8pIHtcbiAgICB2YXIgY29sbGVjdGlvbnMgPSBbdGhpc10uY29uY2F0KGFyckNvcHkoYXJndW1lbnRzKSk7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHppcFdpdGhGYWN0b3J5KHRoaXMsIGRlZmF1bHRaaXBwZXIsIGNvbGxlY3Rpb25zLCB0cnVlKSk7XG4gIH0sXG5cbiAgemlwV2l0aDogZnVuY3Rpb24gemlwV2l0aCh6aXBwZXIgLyosIC4uLmNvbGxlY3Rpb25zICovKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zID0gYXJyQ29weShhcmd1bWVudHMpO1xuICAgIGNvbGxlY3Rpb25zWzBdID0gdGhpcztcbiAgICByZXR1cm4gcmVpZnkodGhpcywgemlwV2l0aEZhY3RvcnkodGhpcywgemlwcGVyLCBjb2xsZWN0aW9ucykpO1xuICB9LFxufSk7XG5cbnZhciBJbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZSA9IEluZGV4ZWRDb2xsZWN0aW9uLnByb3RvdHlwZTtcbkluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlW0lTX0lOREVYRURfU1lNQk9MXSA9IHRydWU7XG5JbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZVtJU19PUkRFUkVEX1NZTUJPTF0gPSB0cnVlO1xuXG5taXhpbihTZXRDb2xsZWN0aW9uLCB7XG4gIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICBnZXQ6IGZ1bmN0aW9uIGdldCh2YWx1ZSwgbm90U2V0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpID8gdmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgfSxcblxuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXModmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpO1xuICB9LFxuXG4gIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gIGtleVNlcTogZnVuY3Rpb24ga2V5U2VxKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlU2VxKCk7XG4gIH0sXG59KTtcblxudmFyIFNldENvbGxlY3Rpb25Qcm90b3R5cGUgPSBTZXRDb2xsZWN0aW9uLnByb3RvdHlwZTtcblNldENvbGxlY3Rpb25Qcm90b3R5cGUuaGFzID0gQ29sbGVjdGlvblByb3RvdHlwZS5pbmNsdWRlcztcblNldENvbGxlY3Rpb25Qcm90b3R5cGUuY29udGFpbnMgPSBTZXRDb2xsZWN0aW9uUHJvdG90eXBlLmluY2x1ZGVzO1xuU2V0Q29sbGVjdGlvblByb3RvdHlwZS5rZXlzID0gU2V0Q29sbGVjdGlvblByb3RvdHlwZS52YWx1ZXM7XG5cbi8vIE1peGluIHN1YmNsYXNzZXNcblxubWl4aW4oS2V5ZWRTZXEsIEtleWVkQ29sbGVjdGlvblByb3RvdHlwZSk7XG5taXhpbihJbmRleGVkU2VxLCBJbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZSk7XG5taXhpbihTZXRTZXEsIFNldENvbGxlY3Rpb25Qcm90b3R5cGUpO1xuXG4vLyAjcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxuZnVuY3Rpb24gcmVkdWNlKGNvbGxlY3Rpb24sIHJlZHVjZXIsIHJlZHVjdGlvbiwgY29udGV4dCwgdXNlRmlyc3QsIHJldmVyc2UpIHtcbiAgYXNzZXJ0Tm90SW5maW5pdGUoY29sbGVjdGlvbi5zaXplKTtcbiAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICBpZiAodXNlRmlyc3QpIHtcbiAgICAgIHVzZUZpcnN0ID0gZmFsc2U7XG4gICAgICByZWR1Y3Rpb24gPSB2O1xuICAgIH0gZWxzZSB7XG4gICAgICByZWR1Y3Rpb24gPSByZWR1Y2VyLmNhbGwoY29udGV4dCwgcmVkdWN0aW9uLCB2LCBrLCBjKTtcbiAgICB9XG4gIH0sIHJldmVyc2UpO1xuICByZXR1cm4gcmVkdWN0aW9uO1xufVxuXG5mdW5jdGlvbiBrZXlNYXBwZXIodiwgaykge1xuICByZXR1cm4gaztcbn1cblxuZnVuY3Rpb24gZW50cnlNYXBwZXIodiwgaykge1xuICByZXR1cm4gW2ssIHZdO1xufVxuXG5mdW5jdGlvbiBub3QocHJlZGljYXRlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbmVnKHByZWRpY2F0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAtcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRaaXBwZXIoKSB7XG4gIHJldHVybiBhcnJDb3B5KGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHROZWdDb21wYXJhdG9yKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gMSA6IGEgPiBiID8gLTEgOiAwO1xufVxuXG5mdW5jdGlvbiBoYXNoQ29sbGVjdGlvbihjb2xsZWN0aW9uKSB7XG4gIGlmIChjb2xsZWN0aW9uLnNpemUgPT09IEluZmluaXR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgdmFyIG9yZGVyZWQgPSBpc09yZGVyZWQoY29sbGVjdGlvbik7XG4gIHZhciBrZXllZCA9IGlzS2V5ZWQoY29sbGVjdGlvbik7XG4gIHZhciBoID0gb3JkZXJlZCA/IDEgOiAwO1xuICB2YXIgc2l6ZSA9IGNvbGxlY3Rpb24uX19pdGVyYXRlKFxuICAgIGtleWVkXG4gICAgICA/IG9yZGVyZWRcbiAgICAgICAgPyBmdW5jdGlvbiAodiwgaykge1xuICAgICAgICAgICAgaCA9ICgzMSAqIGggKyBoYXNoTWVyZ2UoaGFzaCh2KSwgaGFzaChrKSkpIHwgMDtcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICAgIGggPSAoaCArIGhhc2hNZXJnZShoYXNoKHYpLCBoYXNoKGspKSkgfCAwO1xuICAgICAgICAgIH1cbiAgICAgIDogb3JkZXJlZFxuICAgICAgPyBmdW5jdGlvbiAodikge1xuICAgICAgICAgIGggPSAoMzEgKiBoICsgaGFzaCh2KSkgfCAwO1xuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgaCA9IChoICsgaGFzaCh2KSkgfCAwO1xuICAgICAgICB9XG4gICk7XG4gIHJldHVybiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpO1xufVxuXG5mdW5jdGlvbiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpIHtcbiAgaCA9IGltdWwoaCwgMHhjYzllMmQ1MSk7XG4gIGggPSBpbXVsKChoIDw8IDE1KSB8IChoID4+PiAtMTUpLCAweDFiODczNTkzKTtcbiAgaCA9IGltdWwoKGggPDwgMTMpIHwgKGggPj4+IC0xMyksIDUpO1xuICBoID0gKChoICsgMHhlNjU0NmI2NCkgfCAwKSBeIHNpemU7XG4gIGggPSBpbXVsKGggXiAoaCA+Pj4gMTYpLCAweDg1ZWJjYTZiKTtcbiAgaCA9IGltdWwoaCBeIChoID4+PiAxMyksIDB4YzJiMmFlMzUpO1xuICBoID0gc21pKGggXiAoaCA+Pj4gMTYpKTtcbiAgcmV0dXJuIGg7XG59XG5cbmZ1bmN0aW9uIGhhc2hNZXJnZShhLCBiKSB7XG4gIHJldHVybiAoYSBeIChiICsgMHg5ZTM3NzliOSArIChhIDw8IDYpICsgKGEgPj4gMikpKSB8IDA7IC8vIGludFxufVxuXG52YXIgT3JkZXJlZFNldCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKFNldCkge1xuICBmdW5jdGlvbiBPcmRlcmVkU2V0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlPcmRlcmVkU2V0KClcbiAgICAgIDogaXNPcmRlcmVkU2V0KHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBlbXB0eU9yZGVyZWRTZXQoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChzZXQpIHtcbiAgICAgICAgICB2YXIgaXRlciA9IFNldENvbGxlY3Rpb24odmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7IHJldHVybiBzZXQuYWRkKHYpOyB9KTtcbiAgICAgICAgfSk7XG4gIH1cblxuICBpZiAoIFNldCApIE9yZGVyZWRTZXQuX19wcm90b19fID0gU2V0O1xuICBPcmRlcmVkU2V0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFNldCAmJiBTZXQucHJvdG90eXBlICk7XG4gIE9yZGVyZWRTZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gT3JkZXJlZFNldDtcblxuICBPcmRlcmVkU2V0Lm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIE9yZGVyZWRTZXQuZnJvbUtleXMgPSBmdW5jdGlvbiBmcm9tS2V5cyAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcyhLZXllZENvbGxlY3Rpb24odmFsdWUpLmtleVNlcSgpKTtcbiAgfTtcblxuICBPcmRlcmVkU2V0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdPcmRlcmVkU2V0IHsnLCAnfScpO1xuICB9O1xuXG4gIHJldHVybiBPcmRlcmVkU2V0O1xufShTZXQpKTtcblxuT3JkZXJlZFNldC5pc09yZGVyZWRTZXQgPSBpc09yZGVyZWRTZXQ7XG5cbnZhciBPcmRlcmVkU2V0UHJvdG90eXBlID0gT3JkZXJlZFNldC5wcm90b3R5cGU7XG5PcmRlcmVkU2V0UHJvdG90eXBlW0lTX09SREVSRURfU1lNQk9MXSA9IHRydWU7XG5PcmRlcmVkU2V0UHJvdG90eXBlLnppcCA9IEluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnppcDtcbk9yZGVyZWRTZXRQcm90b3R5cGUuemlwV2l0aCA9IEluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnppcFdpdGg7XG5PcmRlcmVkU2V0UHJvdG90eXBlLnppcEFsbCA9IEluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnppcEFsbDtcblxuT3JkZXJlZFNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlPcmRlcmVkU2V0O1xuT3JkZXJlZFNldFByb3RvdHlwZS5fX21ha2UgPSBtYWtlT3JkZXJlZFNldDtcblxuZnVuY3Rpb24gbWFrZU9yZGVyZWRTZXQobWFwLCBvd25lcklEKSB7XG4gIHZhciBzZXQgPSBPYmplY3QuY3JlYXRlKE9yZGVyZWRTZXRQcm90b3R5cGUpO1xuICBzZXQuc2l6ZSA9IG1hcCA/IG1hcC5zaXplIDogMDtcbiAgc2V0Ll9tYXAgPSBtYXA7XG4gIHNldC5fX293bmVySUQgPSBvd25lcklEO1xuICByZXR1cm4gc2V0O1xufVxuXG52YXIgRU1QVFlfT1JERVJFRF9TRVQ7XG5mdW5jdGlvbiBlbXB0eU9yZGVyZWRTZXQoKSB7XG4gIHJldHVybiAoXG4gICAgRU1QVFlfT1JERVJFRF9TRVQgfHwgKEVNUFRZX09SREVSRURfU0VUID0gbWFrZU9yZGVyZWRTZXQoZW1wdHlPcmRlcmVkTWFwKCkpKVxuICApO1xufVxuXG5mdW5jdGlvbiB0aHJvd09uSW52YWxpZERlZmF1bHRWYWx1ZXMoZGVmYXVsdFZhbHVlcykge1xuICBpZiAoaXNSZWNvcmQoZGVmYXVsdFZhbHVlcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQ2FuIG5vdCBjYWxsIGBSZWNvcmRgIHdpdGggYW4gaW1tdXRhYmxlIFJlY29yZCBhcyBkZWZhdWx0IHZhbHVlcy4gVXNlIGEgcGxhaW4gamF2YXNjcmlwdCBvYmplY3QgaW5zdGVhZC4nXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc0ltbXV0YWJsZShkZWZhdWx0VmFsdWVzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdDYW4gbm90IGNhbGwgYFJlY29yZGAgd2l0aCBhbiBpbW11dGFibGUgQ29sbGVjdGlvbiBhcyBkZWZhdWx0IHZhbHVlcy4gVXNlIGEgcGxhaW4gamF2YXNjcmlwdCBvYmplY3QgaW5zdGVhZC4nXG4gICAgKTtcbiAgfVxuXG4gIGlmIChkZWZhdWx0VmFsdWVzID09PSBudWxsIHx8IHR5cGVvZiBkZWZhdWx0VmFsdWVzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdDYW4gbm90IGNhbGwgYFJlY29yZGAgd2l0aCBhIG5vbi1vYmplY3QgYXMgZGVmYXVsdCB2YWx1ZXMuIFVzZSBhIHBsYWluIGphdmFzY3JpcHQgb2JqZWN0IGluc3RlYWQuJ1xuICAgICk7XG4gIH1cbn1cblxudmFyIFJlY29yZCA9IGZ1bmN0aW9uIFJlY29yZChkZWZhdWx0VmFsdWVzLCBuYW1lKSB7XG4gIHZhciBoYXNJbml0aWFsaXplZDtcblxuICB0aHJvd09uSW52YWxpZERlZmF1bHRWYWx1ZXMoZGVmYXVsdFZhbHVlcyk7XG5cbiAgdmFyIFJlY29yZFR5cGUgPSBmdW5jdGlvbiBSZWNvcmQodmFsdWVzKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmICh2YWx1ZXMgaW5zdGFuY2VvZiBSZWNvcmRUeXBlKSB7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVjb3JkVHlwZSkpIHtcbiAgICAgIHJldHVybiBuZXcgUmVjb3JkVHlwZSh2YWx1ZXMpO1xuICAgIH1cbiAgICBpZiAoIWhhc0luaXRpYWxpemVkKSB7XG4gICAgICBoYXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRlZmF1bHRWYWx1ZXMpO1xuICAgICAgdmFyIGluZGljZXMgPSAoUmVjb3JkVHlwZVByb3RvdHlwZS5faW5kaWNlcyA9IHt9KTtcbiAgICAgIC8vIERlcHJlY2F0ZWQ6IGxlZnQgdG8gYXR0ZW1wdCBub3QgdG8gYnJlYWsgYW55IGV4dGVybmFsIGNvZGUgd2hpY2hcbiAgICAgIC8vIHJlbGllcyBvbiBhIC5fbmFtZSBwcm9wZXJ0eSBleGlzdGluZyBvbiByZWNvcmQgaW5zdGFuY2VzLlxuICAgICAgLy8gVXNlIFJlY29yZC5nZXREZXNjcmlwdGl2ZU5hbWUoKSBpbnN0ZWFkXG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9uYW1lID0gbmFtZTtcbiAgICAgIFJlY29yZFR5cGVQcm90b3R5cGUuX2tleXMgPSBrZXlzO1xuICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5fZGVmYXVsdFZhbHVlcyA9IGRlZmF1bHRWYWx1ZXM7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb3BOYW1lID0ga2V5c1tpXTtcbiAgICAgICAgaW5kaWNlc1twcm9wTmFtZV0gPSBpO1xuICAgICAgICBpZiAoUmVjb3JkVHlwZVByb3RvdHlwZVtwcm9wTmFtZV0pIHtcbiAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgICAgICAgdHlwZW9mIGNvbnNvbGUgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gJiZcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgJ0Nhbm5vdCBkZWZpbmUgJyArXG4gICAgICAgICAgICAgICAgcmVjb3JkTmFtZSh0aGlzKSArXG4gICAgICAgICAgICAgICAgJyB3aXRoIHByb3BlcnR5IFwiJyArXG4gICAgICAgICAgICAgICAgcHJvcE5hbWUgK1xuICAgICAgICAgICAgICAgICdcIiBzaW5jZSB0aGF0IHByb3BlcnR5IG5hbWUgaXMgcGFydCBvZiB0aGUgUmVjb3JkIEFQSS4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFByb3AoUmVjb3JkVHlwZVByb3RvdHlwZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX19vd25lcklEID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3ZhbHVlcyA9IExpc3QoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsKSB7XG4gICAgICBsLnNldFNpemUodGhpcyQxJDEuX2tleXMubGVuZ3RoKTtcbiAgICAgIEtleWVkQ29sbGVjdGlvbih2YWx1ZXMpLmZvckVhY2goZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgbC5zZXQodGhpcyQxJDEuX2luZGljZXNba10sIHYgPT09IHRoaXMkMSQxLl9kZWZhdWx0VmFsdWVzW2tdID8gdW5kZWZpbmVkIDogdik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgUmVjb3JkVHlwZVByb3RvdHlwZSA9IChSZWNvcmRUeXBlLnByb3RvdHlwZSA9XG4gICAgT2JqZWN0LmNyZWF0ZShSZWNvcmRQcm90b3R5cGUpKTtcbiAgUmVjb3JkVHlwZVByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlY29yZFR5cGU7XG5cbiAgaWYgKG5hbWUpIHtcbiAgICBSZWNvcmRUeXBlLmRpc3BsYXlOYW1lID0gbmFtZTtcbiAgfVxuXG4gIHJldHVybiBSZWNvcmRUeXBlO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIHN0ciA9IHJlY29yZE5hbWUodGhpcykgKyAnIHsgJztcbiAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xuICB2YXIgaztcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSAhPT0gbDsgaSsrKSB7XG4gICAgayA9IGtleXNbaV07XG4gICAgc3RyICs9IChpID8gJywgJyA6ICcnKSArIGsgKyAnOiAnICsgcXVvdGVTdHJpbmcodGhpcy5nZXQoaykpO1xuICB9XG4gIHJldHVybiBzdHIgKyAnIH0nO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKG90aGVyKSB7XG4gIHJldHVybiAoXG4gICAgdGhpcyA9PT0gb3RoZXIgfHwgKG90aGVyICYmIHJlY29yZFNlcSh0aGlzKS5lcXVhbHMocmVjb3JkU2VxKG90aGVyKSkpXG4gICk7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLmhhc2hDb2RlID0gZnVuY3Rpb24gaGFzaENvZGUgKCkge1xuICByZXR1cm4gcmVjb3JkU2VxKHRoaXMpLmhhc2hDb2RlKCk7XG59O1xuXG4vLyBAcHJhZ21hIEFjY2Vzc1xuXG5SZWNvcmQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoaykge1xuICByZXR1cm4gdGhpcy5faW5kaWNlcy5oYXNPd25Qcm9wZXJ0eShrKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChrLCBub3RTZXRWYWx1ZSkge1xuICBpZiAoIXRoaXMuaGFzKGspKSB7XG4gICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICB9XG4gIHZhciBpbmRleCA9IHRoaXMuX2luZGljZXNba107XG4gIHZhciB2YWx1ZSA9IHRoaXMuX3ZhbHVlcy5nZXQoaW5kZXgpO1xuICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHRoaXMuX2RlZmF1bHRWYWx1ZXNba10gOiB2YWx1ZTtcbn07XG5cbi8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cblJlY29yZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0IChrLCB2KSB7XG4gIGlmICh0aGlzLmhhcyhrKSkge1xuICAgIHZhciBuZXdWYWx1ZXMgPSB0aGlzLl92YWx1ZXMuc2V0KFxuICAgICAgdGhpcy5faW5kaWNlc1trXSxcbiAgICAgIHYgPT09IHRoaXMuX2RlZmF1bHRWYWx1ZXNba10gPyB1bmRlZmluZWQgOiB2XG4gICAgKTtcbiAgICBpZiAobmV3VmFsdWVzICE9PSB0aGlzLl92YWx1ZXMgJiYgIXRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdWYWx1ZXMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblJlY29yZC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrKSB7XG4gIHJldHVybiB0aGlzLnNldChrKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gIHZhciBuZXdWYWx1ZXMgPSB0aGlzLl92YWx1ZXMuY2xlYXIoKS5zZXRTaXplKHRoaXMuX2tleXMubGVuZ3RoKTtcblxuICByZXR1cm4gdGhpcy5fX293bmVySUQgPyB0aGlzIDogbWFrZVJlY29yZCh0aGlzLCBuZXdWYWx1ZXMpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS53YXNBbHRlcmVkID0gZnVuY3Rpb24gd2FzQWx0ZXJlZCAoKSB7XG4gIHJldHVybiB0aGlzLl92YWx1ZXMud2FzQWx0ZXJlZCgpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS50b1NlcSA9IGZ1bmN0aW9uIHRvU2VxICgpIHtcbiAgcmV0dXJuIHJlY29yZFNlcSh0aGlzKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUudG9KUyA9IGZ1bmN0aW9uIHRvSlMkMSAoKSB7XG4gIHJldHVybiB0b0pTKHRoaXMpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyAoKSB7XG4gIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgcmV0dXJuIHJlY29yZFNlcSh0aGlzKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gIHJldHVybiByZWNvcmRTZXEodGhpcykuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uIF9fZW5zdXJlT3duZXIgKG93bmVySUQpIHtcbiAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdmFyIG5ld1ZhbHVlcyA9IHRoaXMuX3ZhbHVlcy5fX2Vuc3VyZU93bmVyKG93bmVySUQpO1xuICBpZiAoIW93bmVySUQpIHtcbiAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHJldHVybiBtYWtlUmVjb3JkKHRoaXMsIG5ld1ZhbHVlcywgb3duZXJJRCk7XG59O1xuXG5SZWNvcmQuaXNSZWNvcmQgPSBpc1JlY29yZDtcblJlY29yZC5nZXREZXNjcmlwdGl2ZU5hbWUgPSByZWNvcmROYW1lO1xudmFyIFJlY29yZFByb3RvdHlwZSA9IFJlY29yZC5wcm90b3R5cGU7XG5SZWNvcmRQcm90b3R5cGVbSVNfUkVDT1JEX1NZTUJPTF0gPSB0cnVlO1xuUmVjb3JkUHJvdG90eXBlW0RFTEVURV0gPSBSZWNvcmRQcm90b3R5cGUucmVtb3ZlO1xuUmVjb3JkUHJvdG90eXBlLmRlbGV0ZUluID0gUmVjb3JkUHJvdG90eXBlLnJlbW92ZUluID0gZGVsZXRlSW47XG5SZWNvcmRQcm90b3R5cGUuZ2V0SW4gPSBnZXRJbjtcblJlY29yZFByb3RvdHlwZS5oYXNJbiA9IENvbGxlY3Rpb25Qcm90b3R5cGUuaGFzSW47XG5SZWNvcmRQcm90b3R5cGUubWVyZ2UgPSBtZXJnZSQxO1xuUmVjb3JkUHJvdG90eXBlLm1lcmdlV2l0aCA9IG1lcmdlV2l0aCQxO1xuUmVjb3JkUHJvdG90eXBlLm1lcmdlSW4gPSBtZXJnZUluO1xuUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcCA9IG1lcmdlRGVlcDtcblJlY29yZFByb3RvdHlwZS5tZXJnZURlZXBXaXRoID0gbWVyZ2VEZWVwV2l0aDtcblJlY29yZFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IG1lcmdlRGVlcEluO1xuUmVjb3JkUHJvdG90eXBlLnNldEluID0gc2V0SW47XG5SZWNvcmRQcm90b3R5cGUudXBkYXRlID0gdXBkYXRlO1xuUmVjb3JkUHJvdG90eXBlLnVwZGF0ZUluID0gdXBkYXRlSW47XG5SZWNvcmRQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IHdpdGhNdXRhdGlvbnM7XG5SZWNvcmRQcm90b3R5cGUuYXNNdXRhYmxlID0gYXNNdXRhYmxlO1xuUmVjb3JkUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5SZWNvcmRQcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IFJlY29yZFByb3RvdHlwZS5lbnRyaWVzO1xuUmVjb3JkUHJvdG90eXBlLnRvSlNPTiA9IFJlY29yZFByb3RvdHlwZS50b09iamVjdCA9XG4gIENvbGxlY3Rpb25Qcm90b3R5cGUudG9PYmplY3Q7XG5SZWNvcmRQcm90b3R5cGUuaW5zcGVjdCA9IFJlY29yZFByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5cbmZ1bmN0aW9uIG1ha2VSZWNvcmQobGlrZVJlY29yZCwgdmFsdWVzLCBvd25lcklEKSB7XG4gIHZhciByZWNvcmQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihsaWtlUmVjb3JkKSk7XG4gIHJlY29yZC5fdmFsdWVzID0gdmFsdWVzO1xuICByZWNvcmQuX19vd25lcklEID0gb3duZXJJRDtcbiAgcmV0dXJuIHJlY29yZDtcbn1cblxuZnVuY3Rpb24gcmVjb3JkTmFtZShyZWNvcmQpIHtcbiAgcmV0dXJuIHJlY29yZC5jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCByZWNvcmQuY29uc3RydWN0b3IubmFtZSB8fCAnUmVjb3JkJztcbn1cblxuZnVuY3Rpb24gcmVjb3JkU2VxKHJlY29yZCkge1xuICByZXR1cm4ga2V5ZWRTZXFGcm9tVmFsdWUocmVjb3JkLl9rZXlzLm1hcChmdW5jdGlvbiAoaykgeyByZXR1cm4gW2ssIHJlY29yZC5nZXQoayldOyB9KSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3AocHJvdG90eXBlLCBuYW1lKSB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgbmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChuYW1lKTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5fX293bmVySUQsICdDYW5ub3Qgc2V0IG9uIGFuIGltbXV0YWJsZSByZWNvcmQuJyk7XG4gICAgICAgIHRoaXMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5IGZhaWxlZC4gUHJvYmFibHkgSUU4LlxuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGxhenkgU2VxIG9mIGB2YWx1ZWAgcmVwZWF0ZWQgYHRpbWVzYCB0aW1lcy4gV2hlbiBgdGltZXNgIGlzXG4gKiB1bmRlZmluZWQsIHJldHVybnMgYW4gaW5maW5pdGUgc2VxdWVuY2Ugb2YgYHZhbHVlYC5cbiAqL1xudmFyIFJlcGVhdCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRTZXEpIHtcbiAgZnVuY3Rpb24gUmVwZWF0KHZhbHVlLCB0aW1lcykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZXBlYXQpKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGVhdCh2YWx1ZSwgdGltZXMpO1xuICAgIH1cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuc2l6ZSA9IHRpbWVzID09PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IE1hdGgubWF4KDAsIHRpbWVzKTtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICBpZiAoRU1QVFlfUkVQRUFUKSB7XG4gICAgICAgIHJldHVybiBFTVBUWV9SRVBFQVQ7XG4gICAgICB9XG4gICAgICBFTVBUWV9SRVBFQVQgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIGlmICggSW5kZXhlZFNlcSApIFJlcGVhdC5fX3Byb3RvX18gPSBJbmRleGVkU2VxO1xuICBSZXBlYXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBSZXBlYXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVwZWF0O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuICdSZXBlYXQgW10nO1xuICAgIH1cbiAgICByZXR1cm4gJ1JlcGVhdCBbICcgKyB0aGlzLl92YWx1ZSArICcgJyArIHRoaXMuc2l6ZSArICcgdGltZXMgXSc7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhpbmRleCkgPyB0aGlzLl92YWx1ZSA6IG5vdFNldFZhbHVlO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAoc2VhcmNoVmFsdWUpIHtcbiAgICByZXR1cm4gaXModGhpcy5fdmFsdWUsIHNlYXJjaFZhbHVlKTtcbiAgfTtcblxuICBSZXBlYXQucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKGJlZ2luLCBlbmQpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICByZXR1cm4gd2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKVxuICAgICAgPyB0aGlzXG4gICAgICA6IG5ldyBSZXBlYXQoXG4gICAgICAgICAgdGhpcy5fdmFsdWUsXG4gICAgICAgICAgcmVzb2x2ZUVuZChlbmQsIHNpemUpIC0gcmVzb2x2ZUJlZ2luKGJlZ2luLCBzaXplKVxuICAgICAgICApO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UgKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHNlYXJjaFZhbHVlKSB7XG4gICAgaWYgKGlzKHRoaXMuX3ZhbHVlLCBzZWFyY2hWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mIChzZWFyY2hWYWx1ZSkge1xuICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaXplO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpICE9PSBzaXplKSB7XG4gICAgICBpZiAoZm4odGhpcy5fdmFsdWUsIHJldmVyc2UgPyBzaXplIC0gKytpIDogaSsrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIGkgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkgeyByZXR1cm4gaSA9PT0gc2l6ZVxuICAgICAgICA/IGl0ZXJhdG9yRG9uZSgpXG4gICAgICAgIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKywgdGhpcyQxJDEuX3ZhbHVlKTsgfVxuICAgICk7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKG90aGVyKSB7XG4gICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgUmVwZWF0XG4gICAgICA/IGlzKHRoaXMuX3ZhbHVlLCBvdGhlci5fdmFsdWUpXG4gICAgICA6IGRlZXBFcXVhbChvdGhlcik7XG4gIH07XG5cbiAgcmV0dXJuIFJlcGVhdDtcbn0oSW5kZXhlZFNlcSkpO1xuXG52YXIgRU1QVFlfUkVQRUFUO1xuXG5mdW5jdGlvbiBmcm9tSlModmFsdWUsIGNvbnZlcnRlcikge1xuICByZXR1cm4gZnJvbUpTV2l0aChcbiAgICBbXSxcbiAgICBjb252ZXJ0ZXIgfHwgZGVmYXVsdENvbnZlcnRlcixcbiAgICB2YWx1ZSxcbiAgICAnJyxcbiAgICBjb252ZXJ0ZXIgJiYgY29udmVydGVyLmxlbmd0aCA+IDIgPyBbXSA6IHVuZGVmaW5lZCxcbiAgICB7ICcnOiB2YWx1ZSB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGZyb21KU1dpdGgoc3RhY2ssIGNvbnZlcnRlciwgdmFsdWUsIGtleSwga2V5UGF0aCwgcGFyZW50VmFsdWUpIHtcbiAgaWYgKFxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICAhaXNJbW11dGFibGUodmFsdWUpICYmXG4gICAgKGlzQXJyYXlMaWtlKHZhbHVlKSB8fCBoYXNJdGVyYXRvcih2YWx1ZSkgfHwgaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICkge1xuICAgIGlmICh+c3RhY2suaW5kZXhPZih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IGNpcmN1bGFyIHN0cnVjdHVyZSB0byBJbW11dGFibGUnKTtcbiAgICB9XG4gICAgc3RhY2sucHVzaCh2YWx1ZSk7XG4gICAga2V5UGF0aCAmJiBrZXkgIT09ICcnICYmIGtleVBhdGgucHVzaChrZXkpO1xuICAgIHZhciBjb252ZXJ0ZWQgPSBjb252ZXJ0ZXIuY2FsbChcbiAgICAgIHBhcmVudFZhbHVlLFxuICAgICAga2V5LFxuICAgICAgU2VxKHZhbHVlKS5tYXAoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZyb21KU1dpdGgoc3RhY2ssIGNvbnZlcnRlciwgdiwgaywga2V5UGF0aCwgdmFsdWUpOyB9XG4gICAgICApLFxuICAgICAga2V5UGF0aCAmJiBrZXlQYXRoLnNsaWNlKClcbiAgICApO1xuICAgIHN0YWNrLnBvcCgpO1xuICAgIGtleVBhdGggJiYga2V5UGF0aC5wb3AoKTtcbiAgICByZXR1cm4gY29udmVydGVkO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbnZlcnRlcihrLCB2KSB7XG4gIC8vIEVmZmVjdGl2ZWx5IHRoZSBvcHBvc2l0ZSBvZiBcIkNvbGxlY3Rpb24udG9TZXEoKVwiXG4gIHJldHVybiBpc0luZGV4ZWQodikgPyB2LnRvTGlzdCgpIDogaXNLZXllZCh2KSA/IHYudG9NYXAoKSA6IHYudG9TZXQoKTtcbn1cblxudmFyIHZlcnNpb24gPSBcIjQuMC4wXCI7XG5cbnZhciBJbW11dGFibGUgPSB7XG4gIHZlcnNpb246IHZlcnNpb24sXG5cbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbixcbiAgLy8gTm90ZTogSXRlcmFibGUgaXMgZGVwcmVjYXRlZFxuICBJdGVyYWJsZTogQ29sbGVjdGlvbixcblxuICBTZXE6IFNlcSxcbiAgTWFwOiBNYXAsXG4gIE9yZGVyZWRNYXA6IE9yZGVyZWRNYXAsXG4gIExpc3Q6IExpc3QsXG4gIFN0YWNrOiBTdGFjayxcbiAgU2V0OiBTZXQsXG4gIE9yZGVyZWRTZXQ6IE9yZGVyZWRTZXQsXG5cbiAgUmVjb3JkOiBSZWNvcmQsXG4gIFJhbmdlOiBSYW5nZSxcbiAgUmVwZWF0OiBSZXBlYXQsXG5cbiAgaXM6IGlzLFxuICBmcm9tSlM6IGZyb21KUyxcbiAgaGFzaDogaGFzaCxcblxuICBpc0ltbXV0YWJsZTogaXNJbW11dGFibGUsXG4gIGlzQ29sbGVjdGlvbjogaXNDb2xsZWN0aW9uLFxuICBpc0tleWVkOiBpc0tleWVkLFxuICBpc0luZGV4ZWQ6IGlzSW5kZXhlZCxcbiAgaXNBc3NvY2lhdGl2ZTogaXNBc3NvY2lhdGl2ZSxcbiAgaXNPcmRlcmVkOiBpc09yZGVyZWQsXG4gIGlzVmFsdWVPYmplY3Q6IGlzVmFsdWVPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzU2VxOiBpc1NlcSxcbiAgaXNMaXN0OiBpc0xpc3QsXG4gIGlzTWFwOiBpc01hcCxcbiAgaXNPcmRlcmVkTWFwOiBpc09yZGVyZWRNYXAsXG4gIGlzU3RhY2s6IGlzU3RhY2ssXG4gIGlzU2V0OiBpc1NldCxcbiAgaXNPcmRlcmVkU2V0OiBpc09yZGVyZWRTZXQsXG4gIGlzUmVjb3JkOiBpc1JlY29yZCxcblxuICBnZXQ6IGdldCxcbiAgZ2V0SW46IGdldEluJDEsXG4gIGhhczogaGFzLFxuICBoYXNJbjogaGFzSW4kMSxcbiAgbWVyZ2U6IG1lcmdlLFxuICBtZXJnZURlZXA6IG1lcmdlRGVlcCQxLFxuICBtZXJnZVdpdGg6IG1lcmdlV2l0aCxcbiAgbWVyZ2VEZWVwV2l0aDogbWVyZ2VEZWVwV2l0aCQxLFxuICByZW1vdmU6IHJlbW92ZSxcbiAgcmVtb3ZlSW46IHJlbW92ZUluLFxuICBzZXQ6IHNldCxcbiAgc2V0SW46IHNldEluJDEsXG4gIHVwZGF0ZTogdXBkYXRlJDEsXG4gIHVwZGF0ZUluOiB1cGRhdGVJbiQxLFxufTtcblxuLy8gTm90ZTogSXRlcmFibGUgaXMgZGVwcmVjYXRlZFxudmFyIEl0ZXJhYmxlID0gQ29sbGVjdGlvbjtcblxuZXhwb3J0IGRlZmF1bHQgSW1tdXRhYmxlO1xuZXhwb3J0IHsgQ29sbGVjdGlvbiwgSXRlcmFibGUsIExpc3QsIE1hcCwgT3JkZXJlZE1hcCwgT3JkZXJlZFNldCwgUmFuZ2UsIFJlY29yZCwgUmVwZWF0LCBTZXEsIFNldCwgU3RhY2ssIGZyb21KUywgZ2V0LCBnZXRJbiQxIGFzIGdldEluLCBoYXMsIGhhc0luJDEgYXMgaGFzSW4sIGhhc2gsIGlzLCBpc0Fzc29jaWF0aXZlLCBpc0NvbGxlY3Rpb24sIGlzSW1tdXRhYmxlLCBpc0luZGV4ZWQsIGlzS2V5ZWQsIGlzTGlzdCwgaXNNYXAsIGlzT3JkZXJlZCwgaXNPcmRlcmVkTWFwLCBpc09yZGVyZWRTZXQsIGlzUGxhaW5PYmplY3QsIGlzUmVjb3JkLCBpc1NlcSwgaXNTZXQsIGlzU3RhY2ssIGlzVmFsdWVPYmplY3QsIG1lcmdlLCBtZXJnZURlZXAkMSBhcyBtZXJnZURlZXAsIG1lcmdlRGVlcFdpdGgkMSBhcyBtZXJnZURlZXBXaXRoLCBtZXJnZVdpdGgsIHJlbW92ZSwgcmVtb3ZlSW4sIHNldCwgc2V0SW4kMSBhcyBzZXRJbiwgdXBkYXRlJDEgYXMgdXBkYXRlLCB1cGRhdGVJbiQxIGFzIHVwZGF0ZUluLCB2ZXJzaW9uIH07XG4iLCJpbXBvcnQgeyBwYXJlbnRJZHNTZXEgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXV0aWxzJztcbmltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHJlbW92ZUluIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7IGdlbmVyYXRlTm9kZUlkIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS1lbmdpbmUnO1xuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5pbXBvcnQge1xuICBieUFyYml0cmFyeSxcbiAgX2FwcGVuZFRvLFxuICBJbW11dGFibGVOb2RlLFxuICBfaW5zZXJ0TGVmdFNpYmxpbmdUbyxcbiAgX2luc2VydFJpZ2h0U2libGluZ1RvLFxuICBDb21wb3NlZE5vZGUsXG4gIHRyYXZlbCxcbn0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS11dGlscyc7XG5cbmltcG9ydCB0eXBlIHsgR3JlZW5ab25lLCBDdXJzb3IsIFBvc2l0aW9uLCBOb2RlUHJpbWFyeSwgRHJvcFJlcXVlc3QgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBETkRfREFUQV9UUkFOU0ZFUl9UWVBFX0FSVEVSWV9OT0RFLCBETkRfREFUQV9UUkFOU0ZFUl9UWVBFX05PREVfSUQgfSBmcm9tICcuL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBfY2hlY2tJZk5vZGVJc01vZGFsTGF5ZXIgfSBmcm9tICcuL2NhY2hlJztcblxuY29uc3QgaW1nID0gbmV3IEltYWdlKCk7XG5pbWcuc3JjID0gJ2RhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaEFRQUJBSUFBQVAvLy93QUFBQ0g1QkFFQUFBQUFMQUFBQUFBQkFBRUFBQUlDUkFFQU93PT0nO1xuXG5leHBvcnQgZnVuY3Rpb24gb3ZlcnJpZGVEcmFnSW1hZ2UoZGF0ZVRyYW5zZmVyOiBEYXRhVHJhbnNmZXIpOiB2b2lkIHtcbiAgZGF0ZVRyYW5zZmVyLnNldERyYWdJbWFnZShpbWcsIDAsIDApO1xufVxuXG5pbnRlcmZhY2UgR2V0UG9zaXRpb25QYXJhbSB7XG4gIGN1cnNvcjogQ3Vyc29yO1xuICBob3ZlcmluZ1JlY3Q6IERPTVJlY3RSZWFkT25seTtcbiAgc3VwcG9ydElubmVyOiBib29sZWFuO1xufVxuXG4vLyBUT0RPIG9wdGltaXplIHRoaXNcbmV4cG9ydCBmdW5jdGlvbiBjYWxjSG92ZXJQb3NpdGlvbih7IGN1cnNvciwgaG92ZXJpbmdSZWN0LCBzdXBwb3J0SW5uZXIgfTogR2V0UG9zaXRpb25QYXJhbSk6IFBvc2l0aW9uIHtcbiAgY29uc3QgbGVmdERpc3RhbmNlID0gTWF0aC5hYnMoY3Vyc29yLnggLSBob3ZlcmluZ1JlY3QubGVmdCk7XG4gIGNvbnN0IHJpZ2h0RGlzdGFuY2UgPSBNYXRoLmFicyhjdXJzb3IueCAtIGhvdmVyaW5nUmVjdC5yaWdodCk7XG4gIGlmICghc3VwcG9ydElubmVyKSB7XG4gICAgcmV0dXJuIGxlZnREaXN0YW5jZSA8IHJpZ2h0RGlzdGFuY2UgPyAnbGVmdCcgOiAncmlnaHQnO1xuICB9XG5cbiAgaWYgKGxlZnREaXN0YW5jZSA8PSA5KSB7XG4gICAgcmV0dXJuICdsZWZ0JztcbiAgfVxuXG4gIGlmIChyaWdodERpc3RhbmNlIDw9IDkpIHtcbiAgICByZXR1cm4gJ3JpZ2h0JztcbiAgfVxuXG4gIGNvbnN0IG9uZVRoaXJkV2lkdGggPSBob3ZlcmluZ1JlY3Qud2lkdGggLyAzO1xuICBpZiAobGVmdERpc3RhbmNlIDwgb25lVGhpcmRXaWR0aCkge1xuICAgIHJldHVybiAnaW5uZXItbGVmdCc7XG4gIH1cblxuICBpZiAocmlnaHREaXN0YW5jZSA8IG9uZVRoaXJkV2lkdGgpIHtcbiAgICByZXR1cm4gJ2lubmVyLXJpZ2h0JztcbiAgfVxuXG4gIHJldHVybiAnaW5uZXInO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNDaGlsZE5vZGVPZihcbiAgcm9vdDogSW1tdXRhYmxlLkNvbGxlY3Rpb248dW5rbm93biwgdW5rbm93bj4sXG4gIHBhcmVudElEOiBzdHJpbmcsXG4gIGNoaWxkSUQ6IHN0cmluZyxcbik6IGJvb2xlYW4ge1xuICBjb25zdCBwYXJlbnRJRHMgPSBwYXJlbnRJZHNTZXEocm9vdCwgY2hpbGRJRCk7XG4gIGlmICghcGFyZW50SURzKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudElEcy5rZXlPZihwYXJlbnRJRCkgIT09IHVuZGVmaW5lZCA/IHRydWUgOiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE5vZGVFeGVjdXRvcihub2RlOiBOb2RlUHJpbWFyeSk6IHN0cmluZyB7XG4gIGlmIChub2RlLnR5cGUgPT09ICdodG1sLWVsZW1lbnQnKSB7XG4gICAgcmV0dXJuIGBodG1sLWVsZW1lbnQ6JHtub2RlLm5hbWV9YDtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdyZWFjdC1jb21wb25lbnQnKSB7XG4gICAgcmV0dXJuIGByZWFjdF9jb21wb25lbnQ6JHtub2RlLnBhY2thZ2VOYW1lfToke25vZGUucGFja2FnZVZlcnNpb259OiR7bm9kZS5leHBvcnROYW1lfWA7XG4gIH1cblxuICByZXR1cm4gJyc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZTxUPihzdWJqZWN0OiBCZWhhdmlvclN1YmplY3Q8VD4pOiBUIHtcbiAgY29uc3QgW3N0YXRlLCBzZXRTdGF0ZV0gPSB1c2VTdGF0ZShzdWJqZWN0LnZhbHVlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHN1YmplY3Quc3Vic2NyaWJlKHNldFN0YXRlKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW3N1YmplY3RdKTtcblxuICByZXR1cm4gc3RhdGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBqc29uUGFyc2U8VD4oanNvbjogc3RyaW5nKTogVCB8IHVuZGVmaW5lZCB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoanNvbik7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuO1xuICB9XG59XG5cbmludGVyZmFjZSBNb3ZlTm9kZVBhcmFtcyB7XG4gIHJvb3ROb2RlOiBJbW11dGFibGVOb2RlO1xuICBub2RlSUQ6IHN0cmluZztcbiAgZ3JlZW5ab25lOiBHcmVlblpvbmU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3ZlTm9kZSh7IHJvb3ROb2RlLCBub2RlSUQsIGdyZWVuWm9uZSB9OiBNb3ZlTm9kZVBhcmFtcyk6IEltbXV0YWJsZU5vZGUgfCB1bmRlZmluZWQge1xuICBsZXQgX3Jvb3ROb2RlOiBJbW11dGFibGVOb2RlID0gcm9vdE5vZGU7XG4gIGNvbnN0IG5vZGVUb01vdmVLZXlQYXRoID0gYnlBcmJpdHJhcnkocm9vdE5vZGUsIG5vZGVJRCk7XG4gIGlmICghbm9kZVRvTW92ZUtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBub2RlVG9Nb3ZlID0gcm9vdE5vZGUuZ2V0SW4obm9kZVRvTW92ZUtleVBhdGgpIGFzIEltbXV0YWJsZU5vZGUgfCB1bmRlZmluZWQ7XG4gIGlmICghbm9kZVRvTW92ZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIF9yb290Tm9kZSA9IHJlbW92ZUluKHJvb3ROb2RlLCBub2RlVG9Nb3ZlS2V5UGF0aCk7XG5cbiAgcmV0dXJuIGluc2VydE5vZGUoeyByb290Tm9kZTogX3Jvb3ROb2RlLCBub2RlOiBub2RlVG9Nb3ZlLCBncmVlblpvbmUgfSk7XG59XG5cbmludGVyZmFjZSBJbnNlcnROb2RlUGFyYW1zIHtcbiAgcm9vdE5vZGU6IEltbXV0YWJsZU5vZGU7XG4gIG5vZGU6IE5vZGUgfCBJbW11dGFibGVOb2RlO1xuICBncmVlblpvbmU6IEdyZWVuWm9uZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluc2VydE5vZGUoeyByb290Tm9kZSwgbm9kZSwgZ3JlZW5ab25lIH06IEluc2VydE5vZGVQYXJhbXMpOiBJbW11dGFibGVOb2RlIHwgdW5kZWZpbmVkIHtcbiAgaWYoZ3JlZW5ab25lLnR5cGUgPT09ICdmYWxsYmFjay1jb250b3VyLWdyZWVuLXpvbmUnKSB7XG4gICAgcmV0dXJuIF9hcHBlbmRUbyhyb290Tm9kZSwgcm9vdE5vZGUuZ2V0SW4oWydpZCddKSBhcyBzdHJpbmcsIG5vZGUpO1xuICB9XG5cbiAgaWYgKFxuICAgIGdyZWVuWm9uZS50eXBlID09PSAnbm9kZV93aXRob3V0X2NoaWxkcmVuJyAmJlxuICAgIChncmVlblpvbmUucG9zaXRpb24gPT09ICdpbm5lcicgfHxcbiAgICAgIGdyZWVuWm9uZS5wb3NpdGlvbiA9PT0gJ2lubmVyLWxlZnQnIHx8XG4gICAgICBncmVlblpvbmUucG9zaXRpb24gPT09ICdpbm5lci1yaWdodCcpXG4gICkge1xuICAgIHJldHVybiBfYXBwZW5kVG8ocm9vdE5vZGUsIGdyZWVuWm9uZS5jb250b3VyLmlkLCBub2RlKTtcbiAgfVxuXG4gIGlmIChncmVlblpvbmUudHlwZSA9PT0gJ25vZGVfd2l0aG91dF9jaGlsZHJlbicgJiYgZ3JlZW5ab25lLnBvc2l0aW9uID09PSAnbGVmdCcpIHtcbiAgICByZXR1cm4gX2luc2VydExlZnRTaWJsaW5nVG8ocm9vdE5vZGUsIGdyZWVuWm9uZS5jb250b3VyLmlkLCBub2RlKTtcbiAgfVxuXG4gIGlmIChncmVlblpvbmUudHlwZSA9PT0gJ25vZGVfd2l0aG91dF9jaGlsZHJlbicgJiYgZ3JlZW5ab25lLnBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgcmV0dXJuIF9pbnNlcnRSaWdodFNpYmxpbmdUbyhyb290Tm9kZSwgZ3JlZW5ab25lLmNvbnRvdXIuaWQsIG5vZGUpO1xuICB9XG5cbiAgaWYgKGdyZWVuWm9uZS50eXBlID09PSAnYWRqYWNlbnQtd2l0aC1wYXJlbnQnICYmIGdyZWVuWm9uZS5lZGdlID09PSAnbGVmdCcpIHtcbiAgICByZXR1cm4gX2luc2VydExlZnRTaWJsaW5nVG8ocm9vdE5vZGUsIGdyZWVuWm9uZS5jaGlsZC5pZCwgbm9kZSk7XG4gIH1cblxuICBpZiAoZ3JlZW5ab25lLnR5cGUgPT09ICdhZGphY2VudC13aXRoLXBhcmVudCcgJiYgZ3JlZW5ab25lLmVkZ2UgPT09ICdyaWdodCcpIHtcbiAgICByZXR1cm4gX2luc2VydFJpZ2h0U2libGluZ1RvKHJvb3ROb2RlLCBncmVlblpvbmUuY2hpbGQuaWQsIG5vZGUpO1xuICB9XG5cbiAgaWYgKGdyZWVuWm9uZS50eXBlICE9PSAnYmV0d2Vlbi1ub2RlcycpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoZ3JlZW5ab25lLmxlZnQuYWJzb2x1dGVQb3NpdGlvbi5oZWlnaHQgPCBncmVlblpvbmUucmlnaHQuYWJzb2x1dGVQb3NpdGlvbi5oZWlnaHQpIHtcbiAgICByZXR1cm4gX2luc2VydFJpZ2h0U2libGluZ1RvKHJvb3ROb2RlLCBncmVlblpvbmUubGVmdC5pZCwgbm9kZSk7XG4gIH1cblxuICBpZiAoZ3JlZW5ab25lLmxlZnQuYWJzb2x1dGVQb3NpdGlvbi5oZWlnaHQgPiBncmVlblpvbmUucmlnaHQuYWJzb2x1dGVQb3NpdGlvbi5oZWlnaHQpIHtcbiAgICByZXR1cm4gX2luc2VydExlZnRTaWJsaW5nVG8ocm9vdE5vZGUsIGdyZWVuWm9uZS5yaWdodC5pZCwgbm9kZSk7XG4gIH1cblxuICByZXR1cm4gX2luc2VydFJpZ2h0U2libGluZ1RvKHJvb3ROb2RlLCBncmVlblpvbmUubGVmdC5pZCwgbm9kZSk7XG59XG5cbmZ1bmN0aW9uIHJlZ2VuZXJhdGVOb2RlSUQ8VCBleHRlbmRzIE5vZGUgfCBDb21wb3NlZE5vZGU+KG5vZGU6IFQpOiBUIHtcbiAgbm9kZS5pZCA9IGdlbmVyYXRlTm9kZUlkKG5vZGUudHlwZSk7XG5cbiAgcmV0dXJuIG5vZGU7XG59XG5cbi8vIHRvZG8gb3B0aW1pemUgcGVyZm9ybWFuY2VcbmV4cG9ydCBmdW5jdGlvbiBkdXBsaWNhdGVOb2RlKG5vZGU6IE5vZGUpOiBOb2RlIHtcbiAgY29uc3QgbmV3Tm9kZSA9IHRyYXZlbChub2RlLCB7XG4gICAgaHRtbE5vZGU6IChjdXJyZW50KSA9PiByZWdlbmVyYXRlTm9kZUlEKGN1cnJlbnQpLFxuICAgIHJlYWN0Q29tcG9uZW50Tm9kZTogKGN1cnJlbnQpID0+IHJlZ2VuZXJhdGVOb2RlSUQoY3VycmVudCksXG4gICAgbG9vcENvbnRhaW5lck5vZGU6IChjdXJyZW50KSA9PiByZWdlbmVyYXRlTm9kZUlEKGN1cnJlbnQpLFxuICAgIGNvbXBvc2VkTm9kZTogKGN1cnJlbnQpID0+IHJlZ2VuZXJhdGVOb2RlSUQoY3VycmVudCksXG4gICAgcmVmTm9kZTogKGN1cnJlbnQpID0+IHJlZ2VuZXJhdGVOb2RlSUQoY3VycmVudCksXG4gICAganN4Tm9kZTogKGN1cnJlbnQpID0+IHJlZ2VuZXJhdGVOb2RlSUQoY3VycmVudCksXG4gICAgcm91dGVOb2RlOiAoY3VycmVudCkgPT4gcmVnZW5lcmF0ZU5vZGVJRChjdXJyZW50KSxcbiAgfSk7XG5cbiAgcmV0dXJuIG5ld05vZGU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREcm9wUmVxdWVzdChkYXRhVHJhbnNmZXI6IERhdGFUcmFuc2Zlcik6IERyb3BSZXF1ZXN0IHwgdW5kZWZpbmVkIHtcbiAgY29uc3QgZHJhZ2dpbmdOb2RlSUQgPSBkYXRhVHJhbnNmZXIuZ2V0RGF0YShETkRfREFUQV9UUkFOU0ZFUl9UWVBFX05PREVfSUQpO1xuICBpZiAoZHJhZ2dpbmdOb2RlSUQpIHtcbiAgICByZXR1cm4geyB0eXBlOiAnbW92ZV9ub2RlX3JlcXVlc3QnLCBub2RlSUQ6IGRyYWdnaW5nTm9kZUlEIH07XG4gIH1cblxuICBjb25zdCBkcm9wcGVkTm9kZSA9IGpzb25QYXJzZTxOb2RlPihkYXRhVHJhbnNmZXIuZ2V0RGF0YShETkRfREFUQV9UUkFOU0ZFUl9UWVBFX0FSVEVSWV9OT0RFKSk7XG4gIGlmIChkcm9wcGVkTm9kZSkge1xuICAgIHJldHVybiB7IHR5cGU6ICdpbnNlcnRfbm9kZV9yZXF1ZXN0Jywgbm9kZTogZHVwbGljYXRlTm9kZShkcm9wcGVkTm9kZSkgfTtcbiAgfVxuXG4gIHJldHVybjtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlQ29udGV4dCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBDVFgsIEhUTUxOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS1yZW5kZXJlcic7XG5pbXBvcnQgeyB1c2VJbnN0YW50aWF0ZVByb3BzIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS1yZW5kZXJlcic7XG5cbmltcG9ydCB7IHJlZ2lzdGVyLCB1bnJlZ2lzdGVyIH0gZnJvbSAnLi91c2UtZWxlbWVudC1yZWdpc3RyYXRpb24nO1xuaW1wb3J0IHsgZ2V0Tm9kZUV4ZWN1dG9yIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuaW1wb3J0IE1vbml0b3JlZEVsZW1lbnRzQ29udGV4dCBmcm9tICcuLi8uLi9jb250ZXh0JztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlSFRNTE5vZGVQcm9wcyhub2RlOiBIVE1MTm9kZSwgY3R4OiBDVFgsIGRlcHRoOiBudW1iZXIpOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiB7XG4gIGNvbnN0IHByb3BzID0gdXNlSW5zdGFudGlhdGVQcm9wcyhub2RlLCBjdHgpO1xuICBjb25zdCBbcmVmLCBzZXRSZWZdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQ+KCk7XG4gIGNvbnN0IGxheWVyQ3R4ID0gdXNlQ29udGV4dChNb25pdG9yZWRFbGVtZW50c0NvbnRleHQpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHJlZikge1xuICAgICAgcmVnaXN0ZXIocmVmLCBsYXllckN0eCk7XG4gICAgfVxuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChyZWYpIHtcbiAgICAgICAgdW5yZWdpc3RlcihyZWYsIGxheWVyQ3R4KTtcbiAgICAgIH1cbiAgICB9O1xuICB9LCBbcmVmXSk7XG5cbiAgLy8gdG9kbyBzdXBwb3J0IGZvcndhcmQgcmVmIGNhc2VcbiAgcmV0dXJuIHtcbiAgICAuLi5wcm9wcyxcbiAgICByZWY6IChfcmVmOiBIVE1MRWxlbWVudCkgPT4gX3JlZiAmJiBzZXRSZWYoX3JlZiksXG4gICAgJ2RhdGEtc2ltdWxhdG9yLW5vZGUtaWQnOiBub2RlLmlkLFxuICAgICdkYXRhLXNpbXVsYXRvci1ub2RlLWRlcHRoJzogZGVwdGgsXG4gICAgJ2RhdGEtc2ltdWxhdG9yLW5vZGUtZXhlY3V0b3InOiBnZXROb2RlRXhlY3V0b3Iobm9kZSksXG4gIH07XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuLy8gaW1wb3J0IHR5cGUgeyBIVE1MTm9kZSwgUmVhY3RDb21wb25lbnROb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS1yZW5kZXJlcic7XG4vLyBpbXBvcnQgeyBOb2RlUHJpbWFyeSB9IGZyb20gJy4uLy4uLy4uL3R5cGVzJztcblxuLy8gaW50ZXJmYWNlIFByb3BzIHtcbi8vICAgcGFyZW50Tm9kZTogSFRNTE5vZGUgfCBSZWFjdENvbXBvbmVudE5vZGU7XG4vLyB9XG5cbi8vIGV4cG9ydCBmdW5jdGlvbiBnZXRQYXJlbnROb2RlKHBhcmVudDogSFRNTE5vZGUgfCBSZWFjdENvbXBvbmVudE5vZGUpOiBOb2RlUHJpbWFyeSB7XG4vLyAgIGlmIChwYXJlbnQudHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcpIHtcbi8vICAgICByZXR1cm4geyB0eXBlOiAnaHRtbC1lbGVtZW50JywgbmFtZTogcGFyZW50Lm5hbWUgfTtcbi8vICAgfVxuXG4vLyAgIHJldHVybiB7XG4vLyAgICAgdHlwZTogJ3JlYWN0LWNvbXBvbmVudCcsXG4vLyAgICAgcGFja2FnZU5hbWU6IHBhcmVudC5wYWNrYWdlTmFtZSxcbi8vICAgICBwYWNrYWdlVmVyc2lvbjogcGFyZW50LnBhY2thZ2VWZXJzaW9uLFxuLy8gICAgIGV4cG9ydE5hbWU6IHBhcmVudC5leHBvcnROYW1lLFxuLy8gICB9O1xuLy8gfVxuXG5mdW5jdGlvbiBFbXB0eVBsYWNlaG9sZGVyKCk6IEpTWC5FbGVtZW50IHtcbiAgcmV0dXJuIDxkaXY+6K+35ouW5ou957uE5Lu25Yiw5q2k5aSE77yBPC9kaXY+O1xufVxuXG5mdW5jdGlvbiBQbGFjZWhvbGRlcigpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAnZGl2JyxcbiAgICB7IGNsYXNzTmFtZTogJ3BsYWNlaG9sZGVyLWZvci1jb250YWluZXItbm9kZS1jaGlsZHJlbicgfSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEVtcHR5UGxhY2Vob2xkZXIpLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQbGFjZWhvbGRlcjtcbiIsImltcG9ydCB7IFNldCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgeyBCZWhhdmlvclN1YmplY3QgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTm9kZVByaW1hcnkgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBnZXROb2RlRXhlY3V0b3IgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IGlzTm9kZVN1cHBvcnRDaGlsZHJlbkNhY2hlOiBNYXA8c3RyaW5nLCBib29sZWFuPiA9IG5ldyBNYXAoKTtcbmV4cG9ydCBjb25zdCBtb2RhbExheWVyTm9kZUV4ZWN1dG9ycyQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PFNldDxzdHJpbmc+PihTZXQoKSk7XG5cbmV4cG9ydCBmdW5jdGlvbiBfY2FjaGVJc05vZGVTdXBwb3J0Q2hpbGRyZW4obm9kZTogTm9kZVByaW1hcnksIGlzU3VwcG9ydDogYm9vbGVhbik6IHZvaWQge1xuICBjb25zdCBjYWNoZUtleSA9IGdldE5vZGVFeGVjdXRvcihub2RlKTtcblxuICBpc05vZGVTdXBwb3J0Q2hpbGRyZW5DYWNoZS5zZXQoY2FjaGVLZXksIGlzU3VwcG9ydCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfY2hlY2tJZk5vZGVTdXBwb3J0Q2hpbGRyZW4obm9kZTogTm9kZVByaW1hcnkpOiBib29sZWFuIHwgdW5kZWZpbmVkIHtcbiAgcmV0dXJuIGlzTm9kZVN1cHBvcnRDaGlsZHJlbkNhY2hlLmdldChnZXROb2RlRXhlY3V0b3Iobm9kZSkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX2NoZWNrSWZOb2RlSXNNb2RhbExheWVyKG5vZGU6IE5vZGVQcmltYXJ5KTogYm9vbGVhbiB7XG4gIGlmIChub2RlLnR5cGUgIT09ICdyZWFjdC1jb21wb25lbnQnKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuICEhd2luZG93Ll9fT1ZFUl9MQVlFUl9DT01QT05FTlRTLmZpbmQoKHsgcGFja2FnZU5hbWUsIGV4cG9ydE5hbWUgfSkgPT4ge1xuICAgIC8vIHRvZG8gZml4bWVcbiAgICByZXR1cm4gZXhwb3J0TmFtZSA9PT0gbm9kZS5leHBvcnROYW1lICYmIHBhY2thZ2VOYW1lID09PSBub2RlLnBhY2thZ2VOYW1lO1xuICB9KTtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBmcm9tSlMsIExpc3QsIHNldEluIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCwgU3ViamVjdCwgbWFwLCBPYnNlcnZhYmxlLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgY29tYmluZUxhdGVzdCwgZmlsdGVyIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBieUFyYml0cmFyeSwgSW1tdXRhYmxlTm9kZSwgaW5zZXJ0QXQgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXV0aWxzJztcbmltcG9ydCB0eXBlIHsgQXJ0ZXJ5LCBOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmltcG9ydCB7IENvbnRvdXJOb2RlLCBDdXJzb3IsIERyb3BSZXF1ZXN0LCBHcmVlblpvbmUgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBEVU1NWV9BUlRFUllfUk9PVF9OT0RFX0lEIH0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHsgZ2V0RHJvcFJlcXVlc3QsIGluc2VydE5vZGUsIGpzb25QYXJzZSwgbW92ZU5vZGUgfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB7IF9jaGVja0lmTm9kZUlzTW9kYWxMYXllciB9IGZyb20gJy4vY2FjaGUnO1xuXG5leHBvcnQgY29uc3QgY29udG91ck5vZGVzUmVwb3J0JCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q29udG91ck5vZGVbXSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBjdXJzb3IkID0gbmV3IFN1YmplY3Q8Q3Vyc29yPigpO1xuZXhwb3J0IGNvbnN0IGRyYWdnaW5nQXJ0ZXJ5SW1tdXRhYmxlTm9kZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEltbXV0YWJsZU5vZGUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5leHBvcnQgY29uc3QgZHJhZ2dpbmdOb2RlSUQkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxzdHJpbmc+KCcnKTtcbmV4cG9ydCBjb25zdCBob3ZlcmluZ0NvbnRvdXJOb2RlJCA9IG5ldyBTdWJqZWN0PENvbnRvdXJOb2RlIHwgdW5kZWZpbmVkPigpO1xuZXhwb3J0IGNvbnN0IGhvdmVyaW5nUGFyZW50SUQkID0gbmV3IEJlaGF2aW9yU3ViamVjdCgnJyk7XG5leHBvcnQgY29uc3QgaW5EbmQkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG5leHBvcnQgY29uc3QgbGF0ZXN0Rm9jdXNlZEdyZWVuWm9uZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEdyZWVuWm9uZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBtb2RhbExheWVyQ29udG91ck5vZGVzUmVwb3J0JCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q29udG91ck5vZGVbXSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBvbkRyb3BFdmVudCQgPSBuZXcgU3ViamVjdDxSZWFjdC5EcmFnRXZlbnQ+KCk7XG5cbmNvbnN0IGR1bW15QXJ0ZXJ5OiBBcnRlcnkgPSB7XG4gIG5vZGU6IHsgaWQ6IERVTU1ZX0FSVEVSWV9ST09UX05PREVfSUQsIHR5cGU6ICdodG1sLWVsZW1lbnQnLCBuYW1lOiAnZGl2JyB9LFxufTtcblxuZXhwb3J0IGNvbnN0IGltbXV0YWJsZVJvb3QkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxJbW11dGFibGVOb2RlPihcbiAgZnJvbUpTKHsgaWQ6ICdpbml0aWFsJywgdHlwZTogJ2h0bWwnLCBuYW06ICdkaXYnIH0pLFxuKTtcbmV4cG9ydCBjb25zdCBhcnRlcnkkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxBcnRlcnk+KGR1bW15QXJ0ZXJ5KTtcbmV4cG9ydCBjb25zdCBhY3RpdmVOb2RlJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Tm9kZSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCBhY3RpdmVDb250b3VyJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Q29udG91ck5vZGUgfCB1bmRlZmluZWQ+KHVuZGVmaW5lZCk7XG5leHBvcnQgY29uc3QgYWN0aXZlT3ZlckxheWVyTm9kZUlEJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8c3RyaW5nIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuZXhwb3J0IGNvbnN0IGFjdGl2ZUNvbnRvdXJUb29sYmFyU3R5bGUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxSZWFjdC5DU1NQcm9wZXJ0aWVzIHwgdW5kZWZpbmVkPih1bmRlZmluZWQpO1xuZXhwb3J0IGNvbnN0IGFjdGl2ZU92ZXJMYXllckFydGVyeSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PEFydGVyeSB8IHVuZGVmaW5lZD4odW5kZWZpbmVkKTtcbmV4cG9ydCBjb25zdCByb290Tm9kSUQkOiBPYnNlcnZhYmxlPHN0cmluZz4gPSBpbW11dGFibGVSb290JC5waXBlKFxuICBtYXAoKG5vZGUpID0+IG5vZGUuZ2V0SW4oWydpZCddKSBhcyBzdHJpbmcpLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuKTtcblxuZXhwb3J0IGNvbnN0IGRyb3BSZXN1bHQkID0gb25Ecm9wRXZlbnQkLnBpcGUoXG4gIGZpbHRlcigoKSA9PiAhIWxhdGVzdEZvY3VzZWRHcmVlblpvbmUkLnZhbHVlKSxcbiAgbWFwKChlKSA9PiBnZXREcm9wUmVxdWVzdChlLmRhdGFUcmFuc2ZlcikpLFxuICBmaWx0ZXIoKHJlcXVlc3QpOiByZXF1ZXN0IGlzIERyb3BSZXF1ZXN0ID0+ICEhcmVxdWVzdCksXG4gIG1hcCgoZHJvcFJlcXVlc3QpID0+IHtcbiAgICBpZiAoIWxhdGVzdEZvY3VzZWRHcmVlblpvbmUkLnZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGRyb3BSZXF1ZXN0LnR5cGUgPT09ICdtb3ZlX25vZGVfcmVxdWVzdCcpIHtcbiAgICAgIHJldHVybiBtb3ZlTm9kZSh7XG4gICAgICAgIHJvb3ROb2RlOiBpbW11dGFibGVSb290JC52YWx1ZSxcbiAgICAgICAgbm9kZUlEOiBkcm9wUmVxdWVzdC5ub2RlSUQsXG4gICAgICAgIGdyZWVuWm9uZTogbGF0ZXN0Rm9jdXNlZEdyZWVuWm9uZSQudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAoXG4gICAgICBkcm9wUmVxdWVzdC50eXBlID09PSAnaW5zZXJ0X25vZGVfcmVxdWVzdCcgJiZcbiAgICAgIGRyb3BSZXF1ZXN0Lm5vZGUudHlwZSA9PT0gJ3JlYWN0LWNvbXBvbmVudCcgJiZcbiAgICAgIF9jaGVja0lmTm9kZUlzTW9kYWxMYXllcihkcm9wUmVxdWVzdC5ub2RlKVxuICAgICkgIHtcbiAgICAgIGNvbnN0IGZpcnN0TGV2ZWxDaGlsZHJlbiA9ICgoaW1tdXRhYmxlUm9vdCQudmFsdWUuZ2V0SW4oWydjaGlsZHJlbiddKSB8fCBMaXN0KCkpIGFzIHVua25vd24gYXMgTGlzdDxhbnk+KS5wdXNoKGRyb3BSZXF1ZXN0Lm5vZGUpO1xuICAgICAgcmV0dXJuIHNldEluKGltbXV0YWJsZVJvb3QkLnZhbHVlLCBbJ2NoaWxkcmVuJ10sIGZpcnN0TGV2ZWxDaGlsZHJlbik7XG4gICAgfVxuXG4gICAgaWYgKGRyb3BSZXF1ZXN0LnR5cGUgPT09ICdpbnNlcnRfbm9kZV9yZXF1ZXN0Jykge1xuICAgICAgcmV0dXJuIGluc2VydE5vZGUoe1xuICAgICAgICByb290Tm9kZTogaW1tdXRhYmxlUm9vdCQudmFsdWUsXG4gICAgICAgIG5vZGU6IGRyb3BSZXF1ZXN0Lm5vZGUsXG4gICAgICAgIGdyZWVuWm9uZTogbGF0ZXN0Rm9jdXNlZEdyZWVuWm9uZSQudmFsdWUsXG4gICAgICB9KTtcbiAgICB9XG4gIH0pLFxuICBtYXAoKG5ld1Jvb3QpID0+IChuZXdSb290ID8gbmV3Um9vdC50b0pTKCkgOiB1bmRlZmluZWQpKSxcbiAgZmlsdGVyKChuZXdSb290KSA9PiAhIW5ld1Jvb3QpLFxuKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUFydGVyeVJvb3ROb2RlSUQoKTogc3RyaW5nIHtcbiAgY29uc3QgW3Jvb3ROb2RlSUQsIHNldFJvb3ROb2RlSURdID0gdXNlU3RhdGUoJycpO1xuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHJvb3ROb2RJRCQuc3Vic2NyaWJlKHNldFJvb3ROb2RlSUQpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIHJvb3ROb2RlSUQ7XG59XG5cbmFydGVyeSQucGlwZShtYXA8QXJ0ZXJ5LCBJbW11dGFibGVOb2RlPigoYXJ0ZXJ5KSA9PiBmcm9tSlMoYXJ0ZXJ5Lm5vZGUpKSkuc3Vic2NyaWJlKGltbXV0YWJsZVJvb3QkKTtcblxuZHJhZ2dpbmdOb2RlSUQkXG4gIC5waXBlKFxuICAgIG1hcCgoZHJhZ2dpbmdOb2RlSUQpID0+IHtcbiAgICAgIGlmICghZHJhZ2dpbmdOb2RlSUQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGJ5QXJiaXRyYXJ5KGltbXV0YWJsZVJvb3QkLnZhbHVlLCBkcmFnZ2luZ05vZGVJRCkgYXMgSW1tdXRhYmxlTm9kZSB8IHVuZGVmaW5lZDtcbiAgICB9KSxcbiAgKVxuICAuc3Vic2NyaWJlKGRyYWdnaW5nQXJ0ZXJ5SW1tdXRhYmxlTm9kZSQpO1xuXG5cbmNvbWJpbmVMYXRlc3QoeyBhcnRlcnk6IGFydGVyeSQsIGFjdGl2ZU92ZXJMYXllck5vZGVJRDogYWN0aXZlT3ZlckxheWVyTm9kZUlEJH0pXG4gIC5waXBlKFxuICAgIG1hcCgoeyBhY3RpdmVPdmVyTGF5ZXJOb2RlSUQgfSkgPT4ge1xuICAgICAgaWYgKCFhY3RpdmVPdmVyTGF5ZXJOb2RlSUQpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KGltbXV0YWJsZVJvb3QkLnZhbHVlLCBhY3RpdmVPdmVyTGF5ZXJOb2RlSUQpO1xuICAgICAgaWYgKCFrZXlQYXRoKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IF9ub2RlID0gaW1tdXRhYmxlUm9vdCQudmFsdWUuZ2V0SW4oa2V5UGF0aCkgYXMgSW1tdXRhYmxlTm9kZTtcblxuICAgICAgcmV0dXJuIF9ub2RlLnRvSlMoKSBhcyB1bmtub3duIGFzIE5vZGU7XG4gICAgfSksXG4gICAgbWFwKChub2RlKSA9PiB7XG4gICAgICBpZiAoIW5vZGUpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgbm9kZSxcbiAgICAgICAgYXBpU3RhdGVTcGVjOiBhcnRlcnkkLnZhbHVlLmFwaVN0YXRlU3BlYyxcbiAgICAgICAgc2hhcmVkU3RhdGVzU3BlYzogYXJ0ZXJ5JC52YWx1ZS5zaGFyZWRTdGF0ZXNTcGVjLFxuICAgICAgfTtcbiAgICB9KSxcbiAgKVxuICAuc3Vic2NyaWJlKGFjdGl2ZU92ZXJMYXllckFydGVyeSQpO1xuXG5jb21iaW5lTGF0ZXN0KHtcbiAgYWN0aXZlTm9kZTogYWN0aXZlTm9kZSQsXG4gIGNvbnRvdXJOb2Rlc1JlcG9ydDogY29udG91ck5vZGVzUmVwb3J0JCxcbiAgbW9kYWxMYXllckNvbnRvdXJOb2Rlc1JlcG9ydDogbW9kYWxMYXllckNvbnRvdXJOb2Rlc1JlcG9ydCQsXG4gIGFjdGl2ZU92ZXJMYXllck5vZGVJRDogYWN0aXZlT3ZlckxheWVyTm9kZUlEJCxcbn0pXG4gIC5waXBlKFxuICAgIG1hcCgoeyBhY3RpdmVOb2RlLCBjb250b3VyTm9kZXNSZXBvcnQsIG1vZGFsTGF5ZXJDb250b3VyTm9kZXNSZXBvcnQsIGFjdGl2ZU92ZXJMYXllck5vZGVJRCB9KSA9PiB7XG4gICAgICBpZiAoYWN0aXZlT3ZlckxheWVyTm9kZUlEKSB7XG4gICAgICAgIHJldHVybiBtb2RhbExheWVyQ29udG91ck5vZGVzUmVwb3J0Py5maW5kKCh7IGlkIH0pID0+IGlkID09PSBhY3RpdmVOb2RlPy5pZCk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBjb250b3VyTm9kZXNSZXBvcnQ/LmZpbmQoKHsgaWQgfSkgPT4gaWQgPT09IGFjdGl2ZU5vZGU/LmlkKTtcbiAgICB9KSxcbiAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgocCwgYykgPT4gcD8uaWQgPT09IGM/LmlkKSxcbiAgKVxuICAuc3Vic2NyaWJlKGFjdGl2ZUNvbnRvdXIkKTtcblxuYWN0aXZlQ29udG91ciRcbiAgLnBpcGUoXG4gICAgZmlsdGVyKChuKTogbiBpcyBDb250b3VyTm9kZSA9PiAhIW4pLFxuICAgIG1hcCgoeyBhYnNvbHV0ZVBvc2l0aW9uLCByZWxhdGl2ZVJlY3QgfSkgPT4ge1xuICAgICAgY29uc3QgeyB4LCB5LCBoZWlnaHQgfSA9IGFic29sdXRlUG9zaXRpb247XG5cbiAgICAgIGlmIChyZWxhdGl2ZVJlY3Q/LnkgPCA0MCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke3ggKyA0fXB4LCAke3kgKyBoZWlnaHR9cHgpYCxcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7eCArIDR9cHgsICR7eX1weClgLFxuICAgICAgfTtcbiAgICB9KSxcbiAgKVxuICAuc3Vic2NyaWJlKGFjdGl2ZUNvbnRvdXJUb29sYmFyU3R5bGUkKTtcbiIsImltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkLCBub29wIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgdHlwZSB7IEFydGVyeSwgTm9kZSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnknO1xuXG5pbXBvcnQgTWVzc2VuZ2VyIGZyb20gJy4uL2xpYi9tZXNzZW5nZXInO1xuaW1wb3J0IHR5cGUgeyBOb2RlUHJpbWFyeSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGFjdGl2ZU5vZGUkLCBhY3RpdmVPdmVyTGF5ZXJOb2RlSUQkLCBhcnRlcnkkLCBkcm9wUmVzdWx0JCB9IGZyb20gJy4vc3RhdGVzLWNlbnRlcic7XG5pbXBvcnQge1xuICBNRVNTQUdFX1RZUEVfQVJURVJZLFxuICBNRVNTQUdFX1RZUEVfQUNUSVZFX05PREUsXG4gIE1FU1NBR0VfVFlQRV9BQ1RJVkVfT1ZFUl9MQVlFUl9OT0RFX0lELFxuICBNRVNTQUdFX1RZUEVfQ0hFQ0tfTk9ERV9TVVBQT1JUX0NISUxEUkVOLFxufSBmcm9tICcuL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBjb25zdCBtZXNzZW5nZXIgPSBuZXcgTWVzc2VuZ2VyKHdpbmRvdy5wYXJlbnQsICdpZnJhbWUtc2lkZScpO1xuXG5tZXNzZW5nZXJcbiAgLndhaXRGb3JSZWFkeSgpXG4gIC50aGVuKCgpID0+IHt9KVxuICAuY2F0Y2gobm9vcCk7XG5cbm1lc3Nlbmdlci5saXN0ZW48QXJ0ZXJ5PihNRVNTQUdFX1RZUEVfQVJURVJZKS5zdWJzY3JpYmUoYXJ0ZXJ5JCk7XG5cbm1lc3NlbmdlclxuICAubGlzdGVuPE5vZGUgfCB1bmRlZmluZWQ+KE1FU1NBR0VfVFlQRV9BQ1RJVkVfTk9ERSlcbiAgLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKHByZXZpb3VzLCBjdXJyZW50KSA9PiBwcmV2aW91cz8uaWQgPT09IGN1cnJlbnQ/LmlkKSlcbiAgLnN1YnNjcmliZShhY3RpdmVOb2RlJCk7XG5cbm1lc3NlbmdlclxuICAubGlzdGVuPHN0cmluZyB8IHVuZGVmaW5lZD4oTUVTU0FHRV9UWVBFX0FDVElWRV9PVkVSX0xBWUVSX05PREVfSUQpXG4gIC5zdWJzY3JpYmUoYWN0aXZlT3ZlckxheWVyTm9kZUlEJCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVOb2RlKG5vZGU/OiBOb2RlKTogdm9pZCB7XG4gIG1lc3Nlbmdlci5zZW5kKE1FU1NBR0VfVFlQRV9BQ1RJVkVfTk9ERSwgbm9kZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRBY3RpdmVNb2RhbExheWVyKG5vZGVJRDogc3RyaW5nIHwgdW5kZWZpbmVkKTogdm9pZCB7XG4gIG1lc3Nlbmdlci5zZW5kKE1FU1NBR0VfVFlQRV9BQ1RJVkVfT1ZFUl9MQVlFUl9OT0RFX0lELCBub2RlSUQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb25DaGFuZ2VBcnRlcnkoYXJ0ZXJ5OiBBcnRlcnkpOiB2b2lkIHtcbiAgbWVzc2VuZ2VyLnNlbmQoTUVTU0FHRV9UWVBFX0FSVEVSWSwgYXJ0ZXJ5KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrTm9kZUlzQ29udGFpbmVyKG5vZGU6IE5vZGVQcmltYXJ5KTogUHJvbWlzZTxib29sZWFuPiB7XG4gIHJldHVybiBtZXNzZW5nZXIucmVxdWVzdDxOb2RlUHJpbWFyeSwgYm9vbGVhbj4oTUVTU0FHRV9UWVBFX0NIRUNLX05PREVfU1VQUE9SVF9DSElMRFJFTiwgbm9kZSk7XG59XG5cbmRyb3BSZXN1bHQkLnN1YnNjcmliZSgobm9kZSkgPT4ge1xuICBvbkNoYW5nZUFydGVyeSh7IC4uLmFydGVyeSQudmFsdWUsIG5vZGU6IG5vZGUgYXMgdW5rbm93biBhcyBOb2RlIH0pO1xufSk7XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBOb2RlUHJpbWFyeSB9IGZyb20gJy4uLy4uLy4uLy4uL3R5cGVzJztcbmltcG9ydCB7IF9jYWNoZUlzTm9kZVN1cHBvcnRDaGlsZHJlbiwgX2NoZWNrSWZOb2RlU3VwcG9ydENoaWxkcmVuIH0gZnJvbSAnLi4vLi4vLi4vY2FjaGUnO1xuaW1wb3J0IHsgSFRNTE5vZGUsIFJlYWN0Q29tcG9uZW50Tm9kZSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnktcmVuZGVyZXInO1xuaW1wb3J0IHsgY2hlY2tOb2RlSXNDb250YWluZXIgfSBmcm9tICcuLi8uLi8uLi9icmlkZ2UnO1xuXG5mdW5jdGlvbiBhc3luY0NoZWNrSWZOb2RlU3VwcG9ydENoaWxkcmVuKG5vZGU6IE5vZGVQcmltYXJ5KTogUHJvbWlzZTxib29sZWFuPiB7XG4gIGNvbnN0IGZsYWcgPSBfY2hlY2tJZk5vZGVTdXBwb3J0Q2hpbGRyZW4obm9kZSk7XG4gIGlmIChmbGFnICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGZsYWcpO1xuICB9XG5cbiAgcmV0dXJuIGNoZWNrTm9kZUlzQ29udGFpbmVyKG5vZGUpLnRoZW4oKGlzU3VwcG9ydENoaWxkcmVuKSA9PiB7XG4gICAgX2NhY2hlSXNOb2RlU3VwcG9ydENoaWxkcmVuKG5vZGUsIGlzU3VwcG9ydENoaWxkcmVuKTtcblxuICAgIHJldHVybiBpc1N1cHBvcnRDaGlsZHJlbjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHRvTm9kZVByaW1hcnkobm9kZTogSFRNTE5vZGUgfCBSZWFjdENvbXBvbmVudE5vZGUpOiBOb2RlUHJpbWFyeSB7XG4gIGlmIChub2RlLnR5cGUgPT09ICdodG1sLWVsZW1lbnQnKSB7XG4gICAgcmV0dXJuIHsgdHlwZTogJ2h0bWwtZWxlbWVudCcsIG5hbWU6IG5vZGUubmFtZSB9O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAncmVhY3QtY29tcG9uZW50JyxcbiAgICBwYWNrYWdlTmFtZTogbm9kZS5wYWNrYWdlTmFtZSxcbiAgICBwYWNrYWdlVmVyc2lvbjogbm9kZS5wYWNrYWdlVmVyc2lvbixcbiAgICBleHBvcnROYW1lOiBub2RlLmV4cG9ydE5hbWUsXG4gIH07XG59XG5cbi8vIGNoZWNrIG5vZGUgc3VwcG9ydCBjaGlsZHJlbiBhbmQgd2hldGhlciBzaG91bGQgYmUgcmVuZGVyZWQgaW4gbW9kYWwgbGF5ZXJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZU5vZGVCZWhhdmlvckNoZWNrKG5vZGU6IEhUTUxOb2RlIHwgUmVhY3RDb21wb25lbnROb2RlKTogYm9vbGVhbiB7XG4gIGNvbnN0IFtsb2FkaW5nLCBzZXRMb2FkaW5nXSA9IHVzZVN0YXRlKHRydWUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IHVuTW91bnRpbmcgPSBmYWxzZTtcblxuICAgIGFzeW5jQ2hlY2tJZk5vZGVTdXBwb3J0Q2hpbGRyZW4odG9Ob2RlUHJpbWFyeShub2RlKSlcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgaWYgKCF1bk1vdW50aW5nKSB7XG4gICAgICAgICAgc2V0TG9hZGluZyhmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAuY2F0Y2gobm9vcCk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgdW5Nb3VudGluZyA9IHRydWU7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIHJldHVybiBsb2FkaW5nO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBDVFgsIEhUTUxOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS1yZW5kZXJlcic7XG5cbmltcG9ydCBDaGlsZHJlblJlbmRlciBmcm9tICcuL2NoaWxkcmVuLXJlbmRlcic7XG5pbXBvcnQgRGVwdGhDb250ZXh0IGZyb20gJy4vZGVwdGgtY29udGV4dCc7XG5pbXBvcnQgdXNlSFRNTE5vZGVQcm9wcyBmcm9tICcuL2hvb2tzL3VzZS1odG1sLW5vZGUtcHJvcHMnO1xuaW1wb3J0IFBsYWNlaG9sZGVyIGZyb20gJy4vcGxhY2Vob2xkZXInO1xuaW1wb3J0IHsgX2NoZWNrSWZOb2RlU3VwcG9ydENoaWxkcmVuIH0gZnJvbSAnLi4vLi4vY2FjaGUnO1xuaW1wb3J0IHVzZU5vZGVCZWhhdmlvckNoZWNrIGZyb20gJy4vaG9va3MvdXNlLW5vZGUtYmVoYXZpb3ItY2hlY2snO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBIVE1MTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIEhUTUxOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IGN1cnJlbnREZXB0aCA9IHVzZUNvbnRleHQoRGVwdGhDb250ZXh0KSArIDE7XG4gIGNvbnN0IHByb3BzID0gdXNlSFRNTE5vZGVQcm9wcyhub2RlLCBjdHgsIGN1cnJlbnREZXB0aCk7XG4gIGNvbnN0IGxvYWRpbmcgPSB1c2VOb2RlQmVoYXZpb3JDaGVjayhub2RlKTtcblxuICBpZiAobG9hZGluZykge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgaWYgKCFub2RlLm5hbWUpIHtcbiAgICBsb2dnZXIuZXJyb3IoXG4gICAgICAnbmFtZSBwcm9wZXJ0eSBpcyByZXF1aXJlZCBpbiBodG1sIG5vZGUgc3BlYywnLFxuICAgICAgYHBsZWFzZSBjaGVjayB0aGUgc3BlYyBvZiBub2RlOiAke25vZGUuaWR9LmAsXG4gICAgKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghbm9kZS5jaGlsZHJlbiB8fCAhbm9kZS5jaGlsZHJlbi5sZW5ndGgpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgIG5vZGUubmFtZSxcbiAgICAgIHByb3BzLFxuICAgICAgX2NoZWNrSWZOb2RlU3VwcG9ydENoaWxkcmVuKG5vZGUpID8gUmVhY3QuY3JlYXRlRWxlbWVudChQbGFjZWhvbGRlciwgeyBwYXJlbnQ6IG5vZGUgfSkgOiB1bmRlZmluZWQsXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIERlcHRoQ29udGV4dC5Qcm92aWRlcixcbiAgICB7IHZhbHVlOiBjdXJyZW50RGVwdGggfSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgbm9kZS5uYW1lLFxuICAgICAgcHJvcHMsXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KENoaWxkcmVuUmVuZGVyLCB7IG5vZGVzOiBub2RlLmNoaWxkcmVuIHx8IFtdLCBjdHggfSksXG4gICAgKSxcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgSFRNTE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG5jb25zdCBvYnNlcnZlckluaXQ6IE11dGF0aW9uT2JzZXJ2ZXJJbml0ID0geyBjaGlsZExpc3Q6IHRydWUgfTtcblxuZnVuY3Rpb24gbXV0YXRpb25DYWxsYmFjayhzZXRDaGlsZEVsZW1lbnQ6IChjaGlsZDogSFRNTEVsZW1lbnQpID0+IHZvaWQpOiBNdXRhdGlvbkNhbGxiYWNrIHtcbiAgcmV0dXJuIChtdXRhdGlvbnNMaXN0OiBNdXRhdGlvblJlY29yZFtdKSA9PiB7XG4gICAgZm9yIChjb25zdCB7IHR5cGUsIHRhcmdldCB9IG9mIG11dGF0aW9uc0xpc3QpIHtcbiAgICAgIGlmICh0eXBlICE9PSAnY2hpbGRMaXN0Jykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmICh0YXJnZXQubm9kZVR5cGUgIT09IE5vZGUuRUxFTUVOVF9OT0RFKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlyc3RDaGlsZCA9ICh0YXJnZXQgYXMgSFRNTEVsZW1lbnQpLmZpcnN0RWxlbWVudENoaWxkO1xuICAgICAgaWYgKCFmaXJzdENoaWxkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgc2V0Q2hpbGRFbGVtZW50KGZpcnN0Q2hpbGQgYXMgSFRNTEVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlRmlyc3RFbGVtZW50Q2hpbGQocGFyZW50RWxlbWVudDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBbY2hpbGRFbGVtZW50LCBzZXRDaGlsZEVsZW1lbnRdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQgfCBudWxsPigoKSA9PiB7XG4gICAgaWYgKHBhcmVudEVsZW1lbnQ/LmZpcnN0RWxlbWVudENoaWxkKSB7XG4gICAgICByZXR1cm4gcGFyZW50RWxlbWVudD8uZmlyc3RFbGVtZW50Q2hpbGQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFwYXJlbnRFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHBhcmVudEVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgIHNldENoaWxkRWxlbWVudChwYXJlbnRFbGVtZW50LmZpcnN0RWxlbWVudENoaWxkIGFzIEhUTUxFbGVtZW50KTtcbiAgICB9XG5cbiAgICAvLyB0b2RvIG11dGF0aW9uIG9ic2VydmVyIHNob3VsZCBiZSBzaW5nbGV0b25cbiAgICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKG11dGF0aW9uQ2FsbGJhY2soc2V0Q2hpbGRFbGVtZW50KSk7XG4gICAgb2JzZXJ2ZXIub2JzZXJ2ZShwYXJlbnRFbGVtZW50LCBvYnNlcnZlckluaXQpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIG9ic2VydmVyLmRpc2Nvbm5lY3QoKTtcbiAgICB9O1xuICB9LCBbcGFyZW50RWxlbWVudF0pO1xuXG4gIHJldHVybiBjaGlsZEVsZW1lbnQ7XG59XG4iLCJpbXBvcnQgeyB1c2VTdGF0ZSwgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBSZWFjdENvbXBvbmVudE5vZGUgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXJlbmRlcmVyJztcblxuaW1wb3J0IHsgcmVnaXN0ZXIsIHVucmVnaXN0ZXIgfSBmcm9tICcuL3VzZS1lbGVtZW50LXJlZ2lzdHJhdGlvbic7XG5pbXBvcnQgdXNlRmlyc3RFbGVtZW50Q2hpbGQgZnJvbSAnLi91c2UtZmlyc3QtZWxlbWVudC1jaGlsZCc7XG5pbXBvcnQgeyBnZXROb2RlRXhlY3V0b3IgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XG5pbXBvcnQgTW9uaXRvcmVkRWxlbWVudHNDb250ZXh0IGZyb20gJy4uLy4uL2NvbnRleHQnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB1c2VDb21wb25lbnRXcmFwcGVyUmVmKFxuICBub2RlOiBSZWFjdENvbXBvbmVudE5vZGUsXG4gIGRlcHRoOiBudW1iZXIsXG4pOiAocmVmOiBIVE1MRWxlbWVudCkgPT4gdm9pZCB7XG4gIGNvbnN0IFt3cmFwcGVyRWxlbWVudCwgc2V0V3JhcHBlckVsZW1lbnRdID0gdXNlU3RhdGU8SFRNTEVsZW1lbnQ+KCk7XG4gIGNvbnN0IGNoaWxkRWxlbWVudCA9IHVzZUZpcnN0RWxlbWVudENoaWxkKHdyYXBwZXJFbGVtZW50KTtcbiAgY29uc3QgbGF0ZXN0Q2hpbGRFbGVtZW50UmVmID0gdXNlUmVmPEhUTUxFbGVtZW50PigpO1xuICBjb25zdCBsYXllckN0eCA9IHVzZUNvbnRleHQoTW9uaXRvcmVkRWxlbWVudHNDb250ZXh0KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChsYXRlc3RDaGlsZEVsZW1lbnRSZWYuY3VycmVudCkge1xuICAgICAgdW5yZWdpc3RlcihsYXRlc3RDaGlsZEVsZW1lbnRSZWYuY3VycmVudCwgbGF5ZXJDdHgpO1xuICAgIH1cblxuICAgIGlmICghY2hpbGRFbGVtZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY2hpbGRFbGVtZW50LmRhdGFzZXQuc2ltdWxhdG9yTm9kZUlkID0gbm9kZS5pZDtcbiAgICBjaGlsZEVsZW1lbnQuZGF0YXNldC5zaW11bGF0b3JOb2RlRXhlY3V0b3IgPSBnZXROb2RlRXhlY3V0b3Iobm9kZSk7XG4gICAgY2hpbGRFbGVtZW50LmRhdGFzZXQuc2ltdWxhdG9yTm9kZURlcHRoID0gYCR7ZGVwdGh9YDtcbiAgICByZWdpc3RlcihjaGlsZEVsZW1lbnQsIGxheWVyQ3R4KTtcblxuICAgIGxhdGVzdENoaWxkRWxlbWVudFJlZi5jdXJyZW50ID0gY2hpbGRFbGVtZW50O1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIGlmIChjaGlsZEVsZW1lbnQpIHtcbiAgICAgICAgdW5yZWdpc3RlcihjaGlsZEVsZW1lbnQsIGxheWVyQ3R4KTtcbiAgICAgIH1cbiAgICB9O1xuICB9LCBbY2hpbGRFbGVtZW50XSk7XG5cbiAgcmV0dXJuIHNldFdyYXBwZXJFbGVtZW50O1xufVxuIiwiaW1wb3J0IHsgQ1RYLCBSZWFjdENvbXBvbmVudE5vZGUsIHVzZUluc3RhbnRpYXRlUHJvcHMgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXJlbmRlcmVyJztcblxuaW1wb3J0IHVzZUNvbXBvbmVudFdyYXBwZXJSZWYgZnJvbSAnLi91c2UtY29tcG9uZW50LXdyYXBwZXItcmVmJztcblxuZnVuY3Rpb24gdXNlQ29tcG9uZW50Tm9kZVByb3BzKFxuICBub2RlOiBSZWFjdENvbXBvbmVudE5vZGUsXG4gIGN0eDogQ1RYLFxuICBkZXB0aDogbnVtYmVyLFxuKTogeyBub2RlUHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+OyB3cmFwcGVyUHJvcHM6IFJlY29yZDxzdHJpbmcsIHVua25vd24+IH0ge1xuICBjb25zdCBub2RlUHJvcHMgPSB1c2VJbnN0YW50aWF0ZVByb3BzKG5vZGUsIGN0eCk7XG4gIC8vIHVzZSBsZWdhY3kgc3RhdGUgcmVmIGluc3RlYWQgb2YgUmVmT2JqXG4gIC8vIGluIG9yZGVyIHRvIGxldCB1c2VGaXJzdEVsZW1lbnRDaGlsZCByZXR1cm4gdGhlIHJpZ2h0IHZhbHVlXG4gIGNvbnN0IHNldFdyYXBwZXJFbGVtZW50ID0gdXNlQ29tcG9uZW50V3JhcHBlclJlZihub2RlLCBkZXB0aCk7XG5cbiAgcmV0dXJuIHtcbiAgICBub2RlUHJvcHMsXG4gICAgd3JhcHBlclByb3BzOiB7XG4gICAgICBzdHlsZTogeyBkaXNwbGF5OiAnY29udGVudHMnIH0sXG4gICAgICByZWY6IHNldFdyYXBwZXJFbGVtZW50LFxuICAgIH0sXG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZUNvbXBvbmVudE5vZGVQcm9wcztcbiIsImltcG9ydCB7IGxvZ2dlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC91dGlscyc7XG5pbXBvcnQgUmVhY3QsIHsgUHJvcHNXaXRoQ2hpbGRyZW4sIFJlYWN0Tm9kZSB9IGZyb20gJ3JlYWN0JztcblxudHlwZSBTdGF0ZSA9IHsgaGFzRXJyb3I6IGJvb2xlYW4gfTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGFuZGxlTm9kZVJlbmRlckVycm9yQm91bmRhcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8UHJvcHNXaXRoQ2hpbGRyZW48YW55PiwgU3RhdGU+IHtcbiAgc3RhdGljIGdldERlcml2ZWRTdGF0ZUZyb21FcnJvcigpOiBTdGF0ZSB7XG4gICAgLy8gVXBkYXRlIHN0YXRlIHNvIHRoZSBuZXh0IHJlbmRlciB3aWxsIHNob3cgdGhlIGZhbGxiYWNrIFVJLlxuICAgIHJldHVybiB7IGhhc0Vycm9yOiB0cnVlIH07XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wczogUHJvcHNXaXRoQ2hpbGRyZW48YW55Pikge1xuICAgIHN1cGVyKHByb3BzKTtcbiAgICB0aGlzLnN0YXRlID0geyBoYXNFcnJvcjogZmFsc2UgfTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZENhdGNoKGVycm9yOiBhbnksIGVycm9ySW5mbzogYW55KTogdm9pZCB7XG4gICAgbG9nZ2VyLmVycm9yKCdmYWlsZWQgdG8gcmVuZGVyIGNvbXBvbmVudDonLCBlcnJvcik7XG4gIH1cblxuICByZW5kZXIoKTogUmVhY3ROb2RlIHtcbiAgICBpZiAodGhpcy5zdGF0ZS5oYXNFcnJvcikge1xuICAgICAgLy8gWW91IGNhbiByZW5kZXIgYW55IGN1c3RvbSBmYWxsYmFjayBVSVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuY2hpbGRyZW47XG4gIH1cbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDb250ZXh0IH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgdXNlTm9kZUNvbXBvbmVudCwgQ1RYLCBSZWFjdENvbXBvbmVudE5vZGUgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXJlbmRlcmVyJztcblxuaW1wb3J0IENoaWxkcmVuUmVuZGVyIGZyb20gJy4vY2hpbGRyZW4tcmVuZGVyJztcbmltcG9ydCB1c2VDb21wb25lbnROb2RlUHJvcHMgZnJvbSAnLi9ob29rcy91c2UtY29tcG9uZW50LXByb3BzJztcbmltcG9ydCBQbGFjZWhvbGRlciBmcm9tICcuL3BsYWNlaG9sZGVyJztcbmltcG9ydCBEZXB0aENvbnRleHQgZnJvbSAnLi9kZXB0aC1jb250ZXh0JztcbmltcG9ydCBIYW5kbGVOb2RlUmVuZGVyRXJyb3JCb3VuZGFyeSBmcm9tICcuL2Vycm9yLWJvdW5kYXJ5JztcbmltcG9ydCB1c2VOb2RlQmVoYXZpb3JDaGVjayBmcm9tICcuL2hvb2tzL3VzZS1ub2RlLWJlaGF2aW9yLWNoZWNrJztcbmltcG9ydCB7IF9jaGVja0lmTm9kZUlzTW9kYWxMYXllciwgX2NoZWNrSWZOb2RlU3VwcG9ydENoaWxkcmVuIH0gZnJvbSAnLi4vLi4vY2FjaGUnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBSZWFjdENvbXBvbmVudE5vZGU7XG4gIGN0eDogQ1RYO1xufVxuXG5mdW5jdGlvbiBSZWFjdENvbXBvbmVudE5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgY3VycmVudERlcHRoID0gdXNlQ29udGV4dChEZXB0aENvbnRleHQpICsgMTtcbiAgY29uc3QgeyBub2RlUHJvcHMsIHdyYXBwZXJQcm9wcyB9ID0gdXNlQ29tcG9uZW50Tm9kZVByb3BzKG5vZGUsIGN0eCwgY3VycmVudERlcHRoKTtcbiAgY29uc3Qgbm9kZUNvbXBvbmVudCA9IHVzZU5vZGVDb21wb25lbnQobm9kZSwgY3R4LnBsdWdpbnMpO1xuICBjb25zdCBsb2FkaW5nID0gdXNlTm9kZUJlaGF2aW9yQ2hlY2sobm9kZSk7XG4gIGNvbnN0IGlzTGF5ZXJSb290ID0gY3VycmVudERlcHRoID09PSAxO1xuXG4gIGlmIChsb2FkaW5nIHx8ICFub2RlQ29tcG9uZW50KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoIWlzTGF5ZXJSb290ICYmIF9jaGVja0lmTm9kZUlzTW9kYWxMYXllcihub2RlKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgLy8gVE9ETyByZWZhY3RvciB0aGlzXG4gIGlmIChpc0xheWVyUm9vdCAmJiBfY2hlY2tJZk5vZGVJc01vZGFsTGF5ZXIobm9kZSkpIHtcbiAgICBub2RlUHJvcHMuaXNPcGVuID0gdHJ1ZTtcbiAgICBub2RlUHJvcHMuY29udGFpbmVyID0gJ2luc2lkZSc7XG4gIH1cblxuICBpZiAoIW5vZGUuY2hpbGRyZW4gfHwgIW5vZGUuY2hpbGRyZW4ubGVuZ3RoKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBIYW5kbGVOb2RlUmVuZGVyRXJyb3JCb3VuZGFyeSxcbiAgICAgIHt9LFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgJ2RpdicsXG4gICAgICAgIHdyYXBwZXJQcm9wcyxcbiAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcbiAgICAgICAgICBub2RlQ29tcG9uZW50LFxuICAgICAgICAgIG5vZGVQcm9wcyxcbiAgICAgICAgICBfY2hlY2tJZk5vZGVTdXBwb3J0Q2hpbGRyZW4obm9kZSkgPyBSZWFjdC5jcmVhdGVFbGVtZW50KFBsYWNlaG9sZGVyLCB7IHBhcmVudDogbm9kZSB9KSA6IHVuZGVmaW5lZCxcbiAgICAgICAgKSxcbiAgICAgICksXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgIERlcHRoQ29udGV4dC5Qcm92aWRlcixcbiAgICB7IHZhbHVlOiBjdXJyZW50RGVwdGggfSxcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgSGFuZGxlTm9kZVJlbmRlckVycm9yQm91bmRhcnksXG4gICAgICB7fSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICdkaXYnLFxuICAgICAgICB3cmFwcGVyUHJvcHMsXG4gICAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICAgICAgbm9kZUNvbXBvbmVudCxcbiAgICAgICAgICBub2RlUHJvcHMsXG4gICAgICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChDaGlsZHJlblJlbmRlciwgeyBub2Rlczogbm9kZS5jaGlsZHJlbiB8fCBbXSwgY3R4IH0pLFxuICAgICAgICApLFxuICAgICAgKSxcbiAgICApLFxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdENvbXBvbmVudE5vZGVSZW5kZXI7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgQ29tcG9zZWROb2RlLCBDVFgsIEhUTUxOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS1yZW5kZXJlcic7XG5pbXBvcnQgQ2hpbGRyZW5SZW5kZXIgZnJvbSAnLi9jaGlsZHJlbi1yZW5kZXInO1xuaW1wb3J0IEhUTUxOb2RlUmVuZGVyIGZyb20gJy4vaHRtbC1ub2RlLXJlbmRlcic7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIG5vZGU6IENvbXBvc2VkTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENvbXBvc2VOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IG5vZGVzID0gbm9kZS5ub2RlcyB8fCBub2RlLmNoaWxkcmVuO1xuICBpZiAobm9kZS5vdXRMYXllcj8udHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcpIHtcbiAgICBjb25zdCBfb3V0TGF5ZXJOb2RlOiBIVE1MTm9kZSA9IHtcbiAgICAgIC4uLm5vZGUub3V0TGF5ZXIsXG4gICAgICBjaGlsZHJlbjogbm9kZS5ub2RlcyB8fCBub2RlLmNoaWxkcmVuLFxuICAgIH07XG5cbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KEhUTUxOb2RlUmVuZGVyLCB7IG5vZGU6IF9vdXRMYXllck5vZGUsIGN0eCB9KTtcbiAgfVxuXG4gIC8vIHRvZG8gc3VwcG9ydCByZWFjdC1jb21wb25lbnQgYXMgb3V0IGxheWVyXG5cbiAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoQ2hpbGRyZW5SZW5kZXIsIHsgbm9kZXMsIGN0eCB9KTtcbn1cbiIsImltcG9ydCB7IENUWCwgTG9vcENvbnRhaW5lck5vZGUgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXJlbmRlcmVyJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vaW5kZXgnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBub2RlOiBMb29wQ29udGFpbmVyTm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIExvb3BDb250YWluZXJOb2RlUmVuZGVyKHsgbm9kZSwgY3R4IH06IFByb3BzKTogUmVhY3QuUmVhY3RFbGVtZW50IHwgbnVsbCB7XG4gIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KE5vZGVSZW5kZXIsIHsgbm9kZTogbm9kZS5ub2RlLCBjdHggfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IExvb3BDb250YWluZXJOb2RlUmVuZGVyO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNvbnRleHQgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBsb2dnZXIgfSBmcm9tICdAb25lLWZvci1hbGwvdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBBcnRlcnlOb2RlLCBDVFggfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXJlbmRlcmVyJztcblxuaW1wb3J0IEhUTUxOb2RlUmVuZGVyIGZyb20gJy4vaHRtbC1ub2RlLXJlbmRlcic7XG5pbXBvcnQgUmVhY3RDb21wb25lbnROb2RlUmVuZGVyIGZyb20gJy4vcmVhY3QtY29tcG9uZW50LXJlbmRlcic7XG5pbXBvcnQgQ29tcG9zZU5vZGVSZW5kZXIgZnJvbSAnLi9jb21wb3NlLW5vZGUtcmVuZGVyJztcbmltcG9ydCBMb29wQ29udGFpbmVyTm9kZVJlbmRlciBmcm9tICcuL2xvb3AtY29udGFpbmVyLW5vZGUtcmVuZGVyJztcbmltcG9ydCBEZXB0aENvbnRleHQgZnJvbSAnLi9kZXB0aC1jb250ZXh0JztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgbm9kZTogQXJ0ZXJ5Tm9kZTtcbiAgY3R4OiBDVFg7XG59XG5cbmZ1bmN0aW9uIE5vZGVSZW5kZXIoeyBub2RlLCBjdHggfTogUHJvcHMpOiBSZWFjdC5SZWFjdEVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgY3VycmVudERlcHRoID0gdXNlQ29udGV4dChEZXB0aENvbnRleHQpO1xuICAvLyB0b2RvIHN1cHBvcnQgcmVuZGVyIHRoaXMga2luZCBvZiBub2RlXG4gIGlmIChub2RlLnR5cGUgPT09ICdyb3V0ZS1ub2RlJyB8fCBub2RlLnR5cGUgPT09ICdqc3gtbm9kZScgfHwgbm9kZS50eXBlID09PSAncmVmLW5vZGUnKSB7XG4gICAgbG9nZ2VyLmRlYnVnKCdzaW11bGF0b3Igc2tpcCByZW5kZXIgdW5zdXBwb3J0ZWQgbm9kZTonLCBub2RlKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdodG1sLWVsZW1lbnQnKSB7XG4gICAgcmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXG4gICAgICBEZXB0aENvbnRleHQuUHJvdmlkZXIsXG4gICAgICB7IHZhbHVlOiBjdXJyZW50RGVwdGggfSxcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoSFRNTE5vZGVSZW5kZXIsIHsgbm9kZSwgY3R4IH0pLFxuICAgICk7XG4gIH1cblxuICBpZiAobm9kZS50eXBlID09PSAncmVhY3QtY29tcG9uZW50Jykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KFxuICAgICAgRGVwdGhDb250ZXh0LlByb3ZpZGVyLFxuICAgICAgeyB2YWx1ZTogY3VycmVudERlcHRoIH0sXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFJlYWN0Q29tcG9uZW50Tm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSksXG4gICAgKTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdjb21wb3NlZC1ub2RlJykge1xuICAgIHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KENvbXBvc2VOb2RlUmVuZGVyLCB7IG5vZGUsIGN0eCB9KTtcbiAgfVxuXG4gIGlmIChub2RlLnR5cGUgPT09ICdsb29wLWNvbnRhaW5lcicpIHtcbiAgICByZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChMb29wQ29udGFpbmVyTm9kZVJlbmRlciwgeyBub2RlLCBjdHggfSk7XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgTm9kZVJlbmRlcjtcbiIsImltcG9ydCBSZWFjdCwgeyB1c2VDYWxsYmFjayB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgQXJ0ZXJ5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5pbXBvcnQgeyB1c2VCb290UmVzdWx0IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS1yZW5kZXJlcic7XG5pbXBvcnQgcGx1Z2lucyBmcm9tICdURU1QT1JBUllfUEFUQ0hfRk9SX0FSVEVSWV9QTFVHSU5TJztcbmltcG9ydCB7IEJlaGF2aW9yU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgdXNlRWxlbWVudHNSYWRhciBmcm9tICcuL3VzZS1yYWRhci1yZWYnO1xuaW1wb3J0IE5vZGVSZW5kZXIgZnJvbSAnLi9ub2RlLXJlbmRlcic7XG5pbXBvcnQgeyB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZSB9IGZyb20gJy4uL3V0aWxzJztcbmltcG9ydCB7IGFjdGl2ZU92ZXJMYXllckFydGVyeSQgfSBmcm9tICcuLi9zdGF0ZXMtY2VudGVyJztcbmltcG9ydCB7IG1vZGFsTGF5ZXJDb250b3VyTm9kZXNSZXBvcnQkIH0gZnJvbSAnLi4vc3RhdGVzLWNlbnRlcic7XG5pbXBvcnQgTW9uaXRvcmVkRWxlbWVudHNDb250ZXh0IGZyb20gJy4vY29udGV4dCc7XG5cbmNvbnN0IG1vbml0b3JlZEVsZW1lbnRzID0gbmV3IEJlaGF2aW9yU3ViamVjdDxTZXQ8SFRNTEVsZW1lbnQ+PihuZXcgU2V0PEhUTUxFbGVtZW50PigpKTtcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgYXJ0ZXJ5OiBBcnRlcnk7XG59XG5cbmZ1bmN0aW9uIFJlbmRlckxheWVyKHsgYXJ0ZXJ5IH06IFByb3BzKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgeyBjdHgsIHJvb3ROb2RlIH0gPSB1c2VCb290UmVzdWx0KGFydGVyeSwgcGx1Z2lucykgfHwge307XG4gIGNvbnN0IG9uUmVwb3J0ID0gdXNlQ2FsbGJhY2soKHJlcG9ydCkgPT4gbW9kYWxMYXllckNvbnRvdXJOb2Rlc1JlcG9ydCQubmV4dChyZXBvcnQpLCBbXSk7XG4gIHVzZUVsZW1lbnRzUmFkYXIob25SZXBvcnQpO1xuXG4gIGlmICghY3R4IHx8ICFyb290Tm9kZSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cInNpbXVsYXRvci1iYWNrZ3JvdW5kLWxheWVyXCI+XG4gICAgICA8Tm9kZVJlbmRlciBub2RlPXtyb290Tm9kZX0gY3R4PXtjdHh9IC8+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmZ1bmN0aW9uIE1vZGFsTGF5ZXJSZW5kZXIoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgbW9kYWxMYXllckFydGVyeSA9IHVzZUJlaGF2aW9yU3ViamVjdFN0YXRlKGFjdGl2ZU92ZXJMYXllckFydGVyeSQpO1xuXG4gIGlmICghbW9kYWxMYXllckFydGVyeSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8TW9uaXRvcmVkRWxlbWVudHNDb250ZXh0LlByb3ZpZGVyIHZhbHVlPXttb25pdG9yZWRFbGVtZW50c30+XG4gICAgICA8UmVuZGVyTGF5ZXIgYXJ0ZXJ5PXttb2RhbExheWVyQXJ0ZXJ5fSAvPlxuICAgIDwvTW9uaXRvcmVkRWxlbWVudHNDb250ZXh0LlByb3ZpZGVyPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBNb2RhbExheWVyUmVuZGVyO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZUJvb3RSZXN1bHQgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXJlbmRlcmVyJztcbmltcG9ydCBwbHVnaW5zIGZyb20gJ1RFTVBPUkFSWV9QQVRDSF9GT1JfQVJURVJZX1BMVUdJTlMnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCBOb2RlUmVuZGVyIGZyb20gJy4vbm9kZS1yZW5kZXInO1xuaW1wb3J0IHVzZUVsZW1lbnRzUmFkYXIgZnJvbSAnLi91c2UtcmFkYXItcmVmJztcbmltcG9ydCB7IGFydGVyeSQgfSBmcm9tICcuLi9zdGF0ZXMtY2VudGVyJztcbmltcG9ydCB7IHVzZUJlaGF2aW9yU3ViamVjdFN0YXRlIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgY29udG91ck5vZGVzUmVwb3J0JCB9IGZyb20gJy4uL3N0YXRlcy1jZW50ZXInO1xuaW1wb3J0IE1vbml0b3JlZEVsZW1lbnRzQ29udGV4dCBmcm9tICcuL2NvbnRleHQnO1xuXG5jb25zdCBtb25pdG9yZWRFbGVtZW50cyA9IG5ldyBCZWhhdmlvclN1YmplY3Q8U2V0PEhUTUxFbGVtZW50Pj4obmV3IFNldDxIVE1MRWxlbWVudD4oKSk7XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIHJvb3RFbGVtZW50OiBIVE1MRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gUmVuZGVyTGF5ZXIoeyByb290RWxlbWVudCB9OiBQcm9wcyk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IGFydGVyeSA9IHVzZUJlaGF2aW9yU3ViamVjdFN0YXRlKGFydGVyeSQpO1xuICBjb25zdCB7IGN0eCwgcm9vdE5vZGUgfSA9IHVzZUJvb3RSZXN1bHQoYXJ0ZXJ5LCBwbHVnaW5zKSB8fCB7fTtcbiAgY29uc3Qgb25SZXBvcnQgPSB1c2VDYWxsYmFjaygocmVwb3J0KSA9PiBjb250b3VyTm9kZXNSZXBvcnQkLm5leHQocmVwb3J0KSwgW10pO1xuICB1c2VFbGVtZW50c1JhZGFyKG9uUmVwb3J0LCByb290RWxlbWVudCk7XG5cbiAgaWYgKCFjdHggfHwgIXJvb3ROb2RlKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gPE5vZGVSZW5kZXIgbm9kZT17cm9vdE5vZGV9IGN0eD17Y3R4fSAvPjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUm9vdExheWVyUmVuZGVyTGF5ZXIoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgY29uc3QgW3Jvb3RFbGVtZW50LCBzZXRSb290RWxlbWVudF0gPSB1c2VTdGF0ZTxIVE1MRGl2RWxlbWVudD4oKTtcblxuICByZXR1cm4gKFxuICAgIDxNb25pdG9yZWRFbGVtZW50c0NvbnRleHQuUHJvdmlkZXIgdmFsdWU9e21vbml0b3JlZEVsZW1lbnRzfT5cbiAgICAgIDxkaXZcbiAgICAgICAgY2xhc3NOYW1lPVwic2ltdWxhdG9yLWJhY2tncm91bmQtbGF5ZXJcIlxuICAgICAgICByZWY9eyhyZWYpID0+IHtcbiAgICAgICAgICBpZiAocmVmKSB7XG4gICAgICAgICAgICBzZXRSb290RWxlbWVudChyZWYpO1xuICAgICAgICAgIH1cbiAgICAgICAgfX1cbiAgICAgID5cbiAgICAgICAge3Jvb3RFbGVtZW50ICYmIDxSZW5kZXJMYXllciByb290RWxlbWVudD17cm9vdEVsZW1lbnR9IC8+fVxuICAgICAgPC9kaXY+XG4gICAgPC9Nb25pdG9yZWRFbGVtZW50c0NvbnRleHQuUHJvdmlkZXI+XG4gICk7XG59XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgTW9kYWxMYXllclJlbmRlciBmcm9tICcuL21vZGFsLWxheWVyLXJlbmRlcic7XG5pbXBvcnQgUm9vdExheWVyUmVuZGVyTGF5ZXIgZnJvbSAnLi9yb290LWxheWVyLXJlbmRlcic7XG5cbmZ1bmN0aW9uIEJhY2tncm91bmQoKTogSlNYLkVsZW1lbnQgfCBudWxsIHtcbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPFJvb3RMYXllclJlbmRlckxheWVyIC8+XG4gICAgICA8TW9kYWxMYXllclJlbmRlciAvPlxuICAgIDwvPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBCYWNrZ3JvdW5kO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBDb250b3VyTm9kZSB9IGZyb20gJy4uLy4uL3R5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlQ29udG91ck5vZGVTdHlsZSh7IGRlcHRoLCBhYnNvbHV0ZVBvc2l0aW9uIH06IENvbnRvdXJOb2RlKTogUmVhY3QuQ1NTUHJvcGVydGllcyB7XG4gIGNvbnN0IHsgaGVpZ2h0LCB3aWR0aCwgeCwgeSB9ID0gYWJzb2x1dGVQb3NpdGlvbjtcbiAgcmV0dXJuIHVzZU1lbW8oKCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICB6SW5kZXg6IGRlcHRoLFxuICAgICAgaGVpZ2h0OiBoZWlnaHQsXG4gICAgICB3aWR0aDogd2lkdGgsXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHt4fXB4LCAke3l9cHgpYCxcbiAgICB9O1xuICB9LCBbaGVpZ2h0LCB3aWR0aCwgeCwgeSwgZGVwdGhdKTtcbn1cbiIsImltcG9ydCB7IGJ5QXJiaXRyYXJ5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS11dGlscyc7XG5pbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgZHJhZ2dpbmdBcnRlcnlJbW11dGFibGVOb2RlJCwgZHJhZ2dpbmdOb2RlSUQkIH0gZnJvbSAnLi4vc3RhdGVzLWNlbnRlcic7XG5pbXBvcnQgeyB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZSB9IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdXNlU2hvdWxkSGFuZGxlRG5kQ2FsbGJhY2soY3VycmVudElEOiBzdHJpbmcpOiAoZTogUmVhY3QuRHJhZ0V2ZW50KSA9PiBib29sZWFuIHtcbiAgY29uc3QgaXNEcmFnZ2luZ1BhcmVudCA9IHVzZVJlZjxib29sZWFuIHwgdW5kZWZpbmVkPigpO1xuICBjb25zdCBkcmFnZ2luZ05vZGVJRCA9IHVzZUJlaGF2aW9yU3ViamVjdFN0YXRlKGRyYWdnaW5nTm9kZUlEJCk7XG4gIGNvbnN0IGRyYWdnaW5nTm9kZSA9IHVzZUJlaGF2aW9yU3ViamVjdFN0YXRlKGRyYWdnaW5nQXJ0ZXJ5SW1tdXRhYmxlTm9kZSQpO1xuXG4gIHJldHVybiB1c2VDYWxsYmFjayhcbiAgICAoZTogUmVhY3QuRHJhZ0V2ZW50KSA9PiB7XG4gICAgICBpZiAoZS5kYXRhVHJhbnNmZXIudHlwZXMuaW5jbHVkZXMoJ2FydGVyeV9ub2RlJykpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmICghZHJhZ2dpbmdOb2RlSUQgfHwgIWRyYWdnaW5nTm9kZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChkcmFnZ2luZ05vZGVJRCA9PT0gY3VycmVudElEKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzRHJhZ2dpbmdQYXJlbnQuY3VycmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlzRHJhZ2dpbmdQYXJlbnQuY3VycmVudCA9ICEhYnlBcmJpdHJhcnkoZHJhZ2dpbmdOb2RlLCBjdXJyZW50SUQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gIWlzRHJhZ2dpbmdQYXJlbnQuY3VycmVudDtcbiAgICB9LFxuICAgIFtkcmFnZ2luZ05vZGVJRCwgZHJhZ2dpbmdOb2RlXSxcbiAgKTtcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHR5cGUgeyBOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5pbXBvcnQgeyBieUFyYml0cmFyeSwgSW1tdXRhYmxlTm9kZSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnktdXRpbHMnO1xuaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQsIG1hcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgdXNlQ29udG91ck5vZGVTdHlsZSBmcm9tICcuL3VzZS1hY3RpdmUtY29udG91ci1ub2RlLXN0eWxlJztcbmltcG9ydCB0eXBlIHsgQ29udG91ck5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQge1xuICBjdXJzb3IkLFxuICBkcmFnZ2luZ05vZGVJRCQsXG4gIGhvdmVyaW5nQ29udG91ck5vZGUkLFxuICBob3ZlcmluZ1BhcmVudElEJCxcbiAgaW5EbmQkLFxuICBvbkRyb3BFdmVudCQsXG4gIGFjdGl2ZUNvbnRvdXIkLFxuICBpbW11dGFibGVSb290JCxcbiAgdXNlQXJ0ZXJ5Um9vdE5vZGVJRCxcbn0gZnJvbSAnLi4vc3RhdGVzLWNlbnRlcic7XG5pbXBvcnQgeyBvdmVycmlkZURyYWdJbWFnZSwgdXNlQmVoYXZpb3JTdWJqZWN0U3RhdGUgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgdXNlU2hvdWxkSGFuZGxlRG5kQ2FsbGJhY2sgZnJvbSAnLi91c2Utc2hvdWxkLWhhbmRsZS1kbmQtY2FsbGJhY2snO1xuaW1wb3J0IHsgRE5EX0RBVEFfVFJBTlNGRVJfVFlQRV9OT0RFX0lEIH0gZnJvbSAnLi4vY29uc3RhbnRzJztcbmltcG9ydCB7IHNldEFjdGl2ZU5vZGUgfSBmcm9tICcuLi9icmlkZ2UnO1xuXG5mdW5jdGlvbiBwcmV2ZW50RGVmYXVsdChlOiBhbnkpOiBmYWxzZSB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBjb250b3VyTm9kZTogQ29udG91ck5vZGU7XG59XG5cbmZ1bmN0aW9uIHVzZVdoZXRoZXJBY3RpdmUoY3VycmVudElEOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgY29uc3QgW2ZsYWcsIHNldEZsYWddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gYWN0aXZlQ29udG91ciRcbiAgICAgIC5waXBlKFxuICAgICAgICBtYXAoKGFjdGl2ZUNvbnRvdXIpID0+IGFjdGl2ZUNvbnRvdXI/LmlkID09PSBjdXJyZW50SUQpLFxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShzZXRGbGFnKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbXSk7XG5cbiAgcmV0dXJuIGZsYWc7XG59XG5cbmZ1bmN0aW9uIFJlbmRlckNvbnRvdXJOb2RlKHsgY29udG91ck5vZGUgfTogUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IGhvdmVyaW5nUGFyZW50SUQgPSB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZShob3ZlcmluZ1BhcmVudElEJCk7XG4gIGNvbnN0IHJvb3ROb2RlSUQgPSB1c2VBcnRlcnlSb290Tm9kZUlEKCk7XG4gIGNvbnN0IHN0eWxlID0gdXNlQ29udG91ck5vZGVTdHlsZShjb250b3VyTm9kZSk7XG4gIGNvbnN0IF9zaG91bGRIYW5kbGVEbmQgPSB1c2VTaG91bGRIYW5kbGVEbmRDYWxsYmFjayhjb250b3VyTm9kZS5pZCk7XG4gIGNvbnN0IGN1cnJlbnRBY3RpdmUgPSB1c2VXaGV0aGVyQWN0aXZlKGNvbnRvdXJOb2RlLmlkKTtcbiAgY29uc3QgW2lzRHJhZ2dpbmcsIHNldElzRHJhZ2dpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIDxkaXZcbiAgICAgICAgaWQ9e2Bjb250b3VyLSR7Y29udG91ck5vZGUuaWR9YH1cbiAgICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgICAvLyBvbkNsaWNrPXsoKSA9PiBzZXRBY3RpdmVOb2RlKGNvbnRvdXJOb2RlLmlkKX1cbiAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShpbW11dGFibGVSb290JC52YWx1ZSwgY29udG91ck5vZGUuaWQpO1xuICAgICAgICAgIGlmICgha2V5UGF0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBuOiBJbW11dGFibGVOb2RlIHwgdW5kZWZpbmVkID0gaW1tdXRhYmxlUm9vdCQudmFsdWUuZ2V0SW4oa2V5UGF0aCkgYXNcbiAgICAgICAgICAgIHwgSW1tdXRhYmxlTm9kZVxuICAgICAgICAgICAgfCB1bmRlZmluZWQ7XG4gICAgICAgICAgaWYgKCFuKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICAgIHNldEFjdGl2ZU5vZGUobi50b0pTKCkgYXMgTm9kZSk7XG4gICAgICAgIH19XG4gICAgICAgIGRyYWdnYWJsZT17Y29udG91ck5vZGUuaWQgIT09IHJvb3ROb2RlSUR9XG4gICAgICAgIG9uRHJhZ1N0YXJ0PXsoZTogUmVhY3QuRHJhZ0V2ZW50PEhUTUxEaXZFbGVtZW50Pik6IGFueSA9PiB7XG4gICAgICAgICAgLy8gdG9kbyB0aGlzIGhhcyBubyBhZmZlY3QsIGZpeCBpdCFcbiAgICAgICAgICBlLmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gJ21vdmUnO1xuICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoRE5EX0RBVEFfVFJBTlNGRVJfVFlQRV9OT0RFX0lELCBjb250b3VyTm9kZS5pZCk7XG4gICAgICAgICAgZHJhZ2dpbmdOb2RlSUQkLm5leHQoY29udG91ck5vZGUuaWQpO1xuICAgICAgICAgIHNldElzRHJhZ2dpbmcodHJ1ZSk7XG5cbiAgICAgICAgICBvdmVycmlkZURyYWdJbWFnZShlLmRhdGFUcmFuc2Zlcik7XG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZ0VuZD17KCkgPT4ge1xuICAgICAgICAgIGRyYWdnaW5nTm9kZUlEJC5uZXh0KCcnKTtcbiAgICAgICAgICBzZXRJc0RyYWdnaW5nKGZhbHNlKTtcbiAgICAgICAgICBpbkRuZCQubmV4dChmYWxzZSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZ092ZXI9eyhlKSA9PiB7XG4gICAgICAgICAgaWYgKCFfc2hvdWxkSGFuZGxlRG5kKGUpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaW5EbmQkLm5leHQodHJ1ZSk7XG5cbiAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgICBjdXJzb3IkLm5leHQoeyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSB9KTtcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnPXsoZSkgPT4ge1xuICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICAgIGluRG5kJC5uZXh0KHRydWUpO1xuICAgICAgICB9fVxuICAgICAgICBvbkRyYWdFbnRlcj17KGU6IFJlYWN0LkRyYWdFdmVudDxIVE1MRGl2RWxlbWVudD4pOiBhbnkgPT4ge1xuICAgICAgICAgIGlmICghX3Nob3VsZEhhbmRsZURuZChlKSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGhvdmVyaW5nQ29udG91ck5vZGUkLm5leHQoY29udG91ck5vZGUpO1xuXG4gICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9fVxuICAgICAgICBvbkRyYWdMZWF2ZT17KCkgPT4ge1xuICAgICAgICAgIC8vIGhvdmVyaW5nQ29udG91ck5vZGUkLm5leHQodW5kZWZpbmVkKTtcbiAgICAgICAgICBpbkRuZCQubmV4dChmYWxzZSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uRHJvcD17KGU6IFJlYWN0LkRyYWdFdmVudDxIVE1MRGl2RWxlbWVudD4pOiBhbnkgPT4ge1xuICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICAgIG9uRHJvcEV2ZW50JC5uZXh0KGUpO1xuXG4gICAgICAgICAgaW5EbmQkLm5leHQoZmFsc2UpO1xuXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9fVxuICAgICAgICBjbGFzc05hbWU9e2NzKCdjb250b3VyLW5vZGUnLCB7XG4gICAgICAgICAgJ2NvbnRvdXItbm9kZS0tcm9vdCc6IHJvb3ROb2RlSUQgPT09IGNvbnRvdXJOb2RlLmlkLFxuICAgICAgICAgICdjb250b3VyLW5vZGUtLWFjdGl2ZSc6IGN1cnJlbnRBY3RpdmUsXG4gICAgICAgICAgJ2NvbnRvdXItbm9kZS0taG92ZXItYXMtcGFyZW50JzogaG92ZXJpbmdQYXJlbnRJRCA9PT0gY29udG91ck5vZGUuaWQsXG4gICAgICAgICAgJ2NvbnRvdXItbm9kZS0tZHJhZ2dpbmcnOiBpc0RyYWdnaW5nLFxuICAgICAgICB9KX1cbiAgICAgIC8+XG4gICAgPC8+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlbmRlckNvbnRvdXJOb2RlO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5pbXBvcnQgeyBrZXlQYXRoQnlJZCwgcGFyZW50SWRzU2VxIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS11dGlscyc7XG5cbmltcG9ydCB7IHNldEFjdGl2ZU5vZGUgfSBmcm9tICcuLi8uLi9icmlkZ2UnO1xuaW1wb3J0IHsgdXNlQmVoYXZpb3JTdWJqZWN0U3RhdGUgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgeyBob3ZlcmluZ1BhcmVudElEJCwgYXJ0ZXJ5JCwgaW1tdXRhYmxlUm9vdCQgfSBmcm9tICcuLi8uLi9zdGF0ZXMtY2VudGVyJztcblxuaW50ZXJmYWNlIFByb3BzIHtcbiAgY3VycmVudE5vZGVJRDogc3RyaW5nO1xuICBvblBhcmVudENsaWNrOiAoKSA9PiB2b2lkO1xufVxuXG5mdW5jdGlvbiBQYXJlbnROb2Rlcyh7IGN1cnJlbnROb2RlSUQsIG9uUGFyZW50Q2xpY2sgfTogUHJvcHMpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBhcnRlcnkgPSB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZShhcnRlcnkkKTtcbiAgY29uc3QgW3BhcmVudHMsIHNldFBhcmVudHNdID0gdXNlU3RhdGU8Tm9kZVtdPihbXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBwYXJlbnRJRHMgPSBwYXJlbnRJZHNTZXEoaW1tdXRhYmxlUm9vdCQudmFsdWUsIGN1cnJlbnROb2RlSUQpO1xuICAgIGlmICghcGFyZW50SURzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGNvbnN0IF9wYXJlbnRzOiBOb2RlW10gPSBwYXJlbnRJRHNcbiAgICAgIC5tYXAoKHBhcmVudElEKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleVBhdGggPSBrZXlQYXRoQnlJZChpbW11dGFibGVSb290JC52YWx1ZSwgcGFyZW50SUQpO1xuICAgICAgICBpZiAoIWtleVBhdGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGltbXV0YWJsZVJvb3QkLnZhbHVlLmdldEluKGtleVBhdGgpO1xuICAgICAgfSlcbiAgICAgIC5maWx0ZXIoKHBhcmVudE5vZGUpID0+IHtcbiAgICAgICAgaWYgKCFwYXJlbnROb2RlKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgICBjb25zdCBwYXJlbnROb2RlVHlwZSA9IHBhcmVudE5vZGUuZ2V0SW4oWyd0eXBlJ10pO1xuICAgICAgICByZXR1cm4gcGFyZW50Tm9kZVR5cGUgPT09ICdodG1sLWVsZW1lbnQnIHx8IHBhcmVudE5vZGVUeXBlID09PSAncmVhY3QtY29tcG9uZW50JztcbiAgICAgIH0pXG4gICAgICAudG9KUygpO1xuICAgIC8vIGp1c3Qgc2hvdyB0aGUgbWF4IDUgbGV2ZWwgcGFyZW50XG4gICAgc2V0UGFyZW50cyhfcGFyZW50cz8ucmV2ZXJzZSgpLnNsaWNlKDAsIDUpIHx8IFtdKTtcbiAgfSwgW2FydGVyeV0pO1xuXG4gIGlmICghcGFyZW50cy5sZW5ndGgpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJhY3RpdmUtbm9kZS1wYXJlbnRzXCI+XG4gICAgICB7cGFyZW50cy5tYXAoKHBhcmVudCkgPT4ge1xuICAgICAgICBjb25zdCB7IGlkLCBsYWJlbCB9ID0gcGFyZW50O1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICBrZXk9e2lkfVxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYWN0aXZlLW5vZGUtcGFyZW50c19fcGFyZW50XCJcbiAgICAgICAgICAgIG9uTW91c2VFbnRlcj17KCkgPT4ge1xuICAgICAgICAgICAgICBob3ZlcmluZ1BhcmVudElEJC5uZXh0KGlkKTtcbiAgICAgICAgICAgIH19XG4gICAgICAgICAgICBvbk1vdXNlTGVhdmU9eygpID0+IHtcbiAgICAgICAgICAgICAgaG92ZXJpbmdQYXJlbnRJRCQubmV4dCgnJyk7XG4gICAgICAgICAgICB9fVxuICAgICAgICAgICAgb25DbGljaz17KGUpID0+IHtcbiAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgaG92ZXJpbmdQYXJlbnRJRCQubmV4dCgnJyk7XG4gICAgICAgICAgICAgIHNldEFjdGl2ZU5vZGUocGFyZW50KTtcbiAgICAgICAgICAgICAgb25QYXJlbnRDbGljaygpO1xuICAgICAgICAgICAgfX1cbiAgICAgICAgICA+XG4gICAgICAgICAgICB7LyogdG9kbyBvcHRpbWl6ZSB0aGlzIHZhbHVlICovfVxuICAgICAgICAgICAge2xhYmVsIHx8IGlkfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgKTtcbiAgICAgIH0pfVxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQYXJlbnROb2RlcztcbiIsImltcG9ydCB7IHVzZU1lbW8gfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VOb2RlTGFiZWwobm9kZT86IE5vZGUpOiBzdHJpbmcge1xuICByZXR1cm4gdXNlTWVtbygoKSA9PiB7XG4gICAgaWYgKCFub2RlKSB7XG4gICAgICByZXR1cm4gJ3VudGl0bGVkJztcbiAgICB9XG5cbiAgICBpZiAobm9kZS5sYWJlbCkge1xuICAgICAgcmV0dXJuIG5vZGU/LmxhYmVsO1xuICAgIH1cblxuICAgIGlmICgnZXhwb3J0TmFtZScgaW4gbm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGUuZXhwb3J0TmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH1cblxuICAgIGlmICgnbmFtZScgaW4gbm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGUubmFtZS50b1VwcGVyQ2FzZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBub2RlLmlkO1xuICB9LCBbbm9kZV0pO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IHVzZVBvcHBlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC9oZWFkbGVzcy11aSc7XG5pbXBvcnQgeyBkZWxldGVCeUlELCBpbnNlcnRBZnRlciB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnktdXRpbHMnO1xuXG5pbXBvcnQgUGFyZW50Tm9kZXMgZnJvbSAnLi9wYXJlbnQtbm9kZXMnO1xuaW1wb3J0IEljb24gZnJvbSAnQG9uZS1mb3ItYWxsL2ljb24nO1xuaW1wb3J0IHsgdXNlTm9kZUxhYmVsIH0gZnJvbSAnLi91c2Utbm9kZS1sYWJlbCc7XG5pbXBvcnQgeyBvbkNoYW5nZUFydGVyeSwgc2V0QWN0aXZlTm9kZSB9IGZyb20gJy4uLy4uL2JyaWRnZSc7XG5pbXBvcnQge1xuICBhY3RpdmVDb250b3VyJCxcbiAgYWN0aXZlQ29udG91clRvb2xiYXJTdHlsZSQsXG4gIGFjdGl2ZU5vZGUkLFxuICBhcnRlcnkkLFxuICB1c2VBcnRlcnlSb290Tm9kZUlELFxufSBmcm9tICcuLi8uLi9zdGF0ZXMtY2VudGVyJztcbmltcG9ydCB7IGR1cGxpY2F0ZU5vZGUsIHVzZUJlaGF2aW9yU3ViamVjdFN0YXRlIH0gZnJvbSAnLi4vLi4vdXRpbHMnO1xuXG5jb25zdCBtb2RpZmllcnMgPSBbXG4gIHtcbiAgICBuYW1lOiAnb2Zmc2V0JyxcbiAgICBvcHRpb25zOiB7XG4gICAgICBvZmZzZXQ6IFswLCA0XSxcbiAgICB9LFxuICB9LFxuXTtcblxuLy8gcmVuZGVyIHRvb2xiYXIgb24gYW5vdGhlciBjb250ZXh0IHRvIHByZXZlbnQgaXQgYmUgY292ZXJlZCBieSBjb250b3VyIG5vZGVcbmZ1bmN0aW9uIENvbnRvdXJOb2RlVG9vbGJhcigpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBhY3RpdmVOb2RlID0gdXNlQmVoYXZpb3JTdWJqZWN0U3RhdGUoYWN0aXZlTm9kZSQpO1xuICBjb25zdCBhY3RpdmVDb250b3VyID0gdXNlQmVoYXZpb3JTdWJqZWN0U3RhdGUoYWN0aXZlQ29udG91ciQpO1xuICBjb25zdCB7IHJlZmVyZW5jZVJlZiwgUG9wcGVyLCBoYW5kbGVNb3VzZUVudGVyLCBoYW5kbGVNb3VzZUxlYXZlLCBjbG9zZSB9ID0gdXNlUG9wcGVyPEhUTUxTcGFuRWxlbWVudD4oKTtcbiAgY29uc3QgY29udGFpbmVyUmVmID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PihudWxsKTtcbiAgY29uc3Qgc3R5bGUgPSB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZShhY3RpdmVDb250b3VyVG9vbGJhclN0eWxlJCk7XG4gIGNvbnN0IGFjdGl2ZU5vZGVMYWJlbCA9IHVzZU5vZGVMYWJlbChhY3RpdmVOb2RlKTtcbiAgY29uc3Qgcm9vdE5vZGVJRCA9IHVzZUFydGVyeVJvb3ROb2RlSUQoKTtcblxuICBmdW5jdGlvbiBoYW5kbGVEZWxldGUoKTogdm9pZCB7XG4gICAgaWYgKCFhY3RpdmVDb250b3VyJC52YWx1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld1Jvb3QgPSBkZWxldGVCeUlEKGFydGVyeSQudmFsdWUubm9kZSwgYWN0aXZlQ29udG91ciQudmFsdWUuaWQpO1xuICAgIG9uQ2hhbmdlQXJ0ZXJ5KHsgLi4uYXJ0ZXJ5JC52YWx1ZSwgbm9kZTogbmV3Um9vdCB9KTtcbiAgICBzZXRBY3RpdmVOb2RlKHVuZGVmaW5lZCk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVEdXBsaWNhdGUoKTogdm9pZCB7XG4gICAgaWYgKCFhY3RpdmVOb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbmV3Tm9kZSA9IGR1cGxpY2F0ZU5vZGUoYWN0aXZlTm9kZSk7XG4gICAgY29uc3QgbmV3Um9vdCA9IGluc2VydEFmdGVyKGFydGVyeSQudmFsdWUubm9kZSwgYWN0aXZlTm9kZS5pZCwgbmV3Tm9kZSk7XG4gICAgaWYgKCFuZXdSb290KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9uQ2hhbmdlQXJ0ZXJ5KHsgLi4uYXJ0ZXJ5JC52YWx1ZSwgbm9kZTogbmV3Um9vdCB9KTtcbiAgICAvLyB0aGlzIHJlYWxseSBhbm5veWluZyBpZiBjaGFuZ2VkIHRoZSBhY3RpdmUgbm9kZSwgc28gY29tbWVudCBiZWxvdyBsaW5lXG4gICAgLy8gc2V0QWN0aXZlTm9kZShuZXdOb2RlKTtcbiAgfVxuXG4gIGlmICghYWN0aXZlQ29udG91ciB8fCBhY3RpdmVDb250b3VyLmlkID09PSByb290Tm9kZUlEKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxkaXYgcmVmPXtjb250YWluZXJSZWZ9IGNsYXNzTmFtZT1cImFjdGl2ZS1jb250b3VyLW5vZGUtdG9vbGJhclwiIHN0eWxlPXtzdHlsZX0+XG4gICAgICA8c3BhblxuICAgICAgICByZWY9e3JlZmVyZW5jZVJlZn1cbiAgICAgICAgY2xhc3NOYW1lPVwiYWN0aXZlLWNvbnRvdXItbm9kZS10b29sYmFyX19wYXJlbnRzXCJcbiAgICAgICAgLy8gb25DbGljaz17aGFuZGxlQ2xpY2soKX1cbiAgICAgICAgb25Nb3VzZUVudGVyPXtoYW5kbGVNb3VzZUVudGVyKCl9XG4gICAgICAgIG9uTW91c2VMZWF2ZT17aGFuZGxlTW91c2VMZWF2ZSgpfVxuICAgICAgPlxuICAgICAgICB7YWN0aXZlTm9kZUxhYmVsfVxuICAgICAgPC9zcGFuPlxuICAgICAgPHNwYW4gb25DbGljaz17aGFuZGxlRHVwbGljYXRlfSBjbGFzc05hbWU9XCJhY3RpdmUtY29udG91ci1ub2RlLXRvb2xiYXJfX2FjdGlvblwiIHRpdGxlPVwi5aSN5Yi2XCI+XG4gICAgICAgIDxJY29uIG5hbWU9XCJjb250ZW50X2NvcHlcIiBzaXplPXsxNn0gLz5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxzcGFuIG9uQ2xpY2s9e2hhbmRsZURlbGV0ZX0gY2xhc3NOYW1lPVwiYWN0aXZlLWNvbnRvdXItbm9kZS10b29sYmFyX19hY3Rpb25cIiB0aXRsZT1cIuWIoOmZpFwiPlxuICAgICAgICA8SWNvbiBuYW1lPVwiZGVsZXRlX2ZvcmV2ZXJcIiBzaXplPXsxNn0gLz5cbiAgICAgIDwvc3Bhbj5cbiAgICAgIDxQb3BwZXIgcGxhY2VtZW50PVwiYm90dG9tLXN0YXJ0XCIgbW9kaWZpZXJzPXttb2RpZmllcnN9IGNvbnRhaW5lcj17Y29udGFpbmVyUmVmLmN1cnJlbnR9PlxuICAgICAgICA8UGFyZW50Tm9kZXMgY3VycmVudE5vZGVJRD17YWN0aXZlQ29udG91ci5pZH0gb25QYXJlbnRDbGljaz17Y2xvc2V9IC8+XG4gICAgICA8L1BvcHBlcj5cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgQ29udG91ck5vZGVUb29sYmFyO1xuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY3MgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCB7IEZBTExCQUNLX0NPTlRPVVIsIEZBTExCQUNLX0NPTlRPVVJfTk9ERV9JRCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5pbXBvcnQge1xuICBjdXJzb3IkLFxuICBob3ZlcmluZ0NvbnRvdXJOb2RlJCxcbiAgaW5EbmQkLFxuICBsYXRlc3RGb2N1c2VkR3JlZW5ab25lJCxcbiAgb25Ecm9wRXZlbnQkLFxufSBmcm9tICcuLi9zdGF0ZXMtY2VudGVyJztcblxuZnVuY3Rpb24gcHJldmVudERlZmF1bHQoZTogYW55KTogZmFsc2Uge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIHJldHVybiBmYWxzZTtcbn1cblxuY29uc3QgZmFsbGJhY2tDb250b3VyU3R5bGU6IFJlYWN0LkNTU1Byb3BlcnRpZXMgPSB7XG4gIGhlaWdodDogJzEwMHZoJyxcbiAgd2lkdGg6ICcxMDB2dycsXG4gIHBvc2l0aW9uOiAnZml4ZWQnLFxufVxuXG5mdW5jdGlvbiBGYWxsYmFja0NvbnRvdXJOb2RlKCk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgW2hvdmVyaW5nLCBzZXRIb3ZlcmluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFob3ZlcmluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxhdGVzdEZvY3VzZWRHcmVlblpvbmUkLm5leHQoeyB0eXBlOiAnZmFsbGJhY2stY29udG91ci1ncmVlbi16b25lJyB9KTtcbiAgfSwgW2hvdmVyaW5nXSlcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2XG4gICAgICAgIGlkPXtGQUxMQkFDS19DT05UT1VSX05PREVfSUR9XG4gICAgICAgIHN0eWxlPXtmYWxsYmFja0NvbnRvdXJTdHlsZX1cbiAgICAgICAgY2xhc3NOYW1lPXtjcygnY29udG91ci1ub2RlJywge1xuICAgICAgICAgICdncmVlbi16b25lLWJldHdlZW4tbm9kZXMtLWZvY3VzZWQnOiBob3ZlcmluZyxcbiAgICAgICAgICAnZ3JlZW4tem9uZS1iZXR3ZWVuLW5vZGVzJzogaG92ZXJpbmcsXG4gICAgICAgIH0pfVxuICAgICAgICBvbkRyYWdPdmVyPXsoZSkgPT4ge1xuICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICAgIGluRG5kJC5uZXh0KHRydWUpO1xuXG4gICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgICAgY3Vyc29yJC5uZXh0KHsgeDogZS5jbGllbnRYLCB5OiBlLmNsaWVudFkgfSk7XG4gICAgICAgIH19XG4gICAgICAgIG9uRHJhZ0VudGVyPXsoZTogUmVhY3QuRHJhZ0V2ZW50PEhUTUxEaXZFbGVtZW50Pik6IGFueSA9PiB7XG4gICAgICAgICAgcHJldmVudERlZmF1bHQoZSk7XG4gICAgICAgICAgc2V0SG92ZXJpbmcodHJ1ZSk7XG4gICAgICAgICAgaG92ZXJpbmdDb250b3VyTm9kZSQubmV4dChGQUxMQkFDS19DT05UT1VSKTtcblxuICAgICAgICAgIHByZXZlbnREZWZhdWx0KGUpO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfX1cbiAgICAgICAgb25EcmFnTGVhdmU9eygpID0+IHtcbiAgICAgICAgICBzZXRIb3ZlcmluZyhmYWxzZSk7XG4gICAgICAgICAgaW5EbmQkLm5leHQoZmFsc2UpO1xuICAgICAgICB9fVxuICAgICAgICBvbkRyb3A9eyhlOiBSZWFjdC5EcmFnRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KTogYW55ID0+IHtcbiAgICAgICAgICBwcmV2ZW50RGVmYXVsdChlKTtcbiAgICAgICAgICBvbkRyb3BFdmVudCQubmV4dChlKTtcblxuICAgICAgICAgIGluRG5kJC5uZXh0KGZhbHNlKTtcbiAgICAgICAgICBzZXRIb3ZlcmluZyhmYWxzZSk7XG5cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH19XG4gICAgICAvPlxuICAgIDwvPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBGYWxsYmFja0NvbnRvdXJOb2RlO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IFJlbmRlckNvbnRvdXJOb2RlIGZyb20gJy4vcmVuZGVyLWNvbnRvdXItbm9kZSc7XG5pbXBvcnQgVG9vbGJhciBmcm9tICcuL3Rvb2xiYXInO1xuaW1wb3J0IEZhbGxiYWNrQ29udG91ck5vZGUgZnJvbSAnLi9mYWxsYmFjay1jb250b3VyJztcbmltcG9ydCB0eXBlIHsgQ29udG91ck5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBhY3RpdmVPdmVyTGF5ZXJOb2RlSUQkLCBjb250b3VyTm9kZXNSZXBvcnQkLCBtb2RhbExheWVyQ29udG91ck5vZGVzUmVwb3J0JCB9IGZyb20gJy4uL3N0YXRlcy1jZW50ZXInO1xuaW1wb3J0IHsgdXNlQmVoYXZpb3JTdWJqZWN0U3RhdGUgfSBmcm9tICcuLi91dGlscyc7XG5cbmltcG9ydCAnLi9pbmRleC5zY3NzJztcblxuZnVuY3Rpb24gdXNlQ29udG91ck5vZGVzKCk6IEFycmF5PENvbnRvdXJOb2RlPiB7XG4gIGNvbnN0IGNvbnRvdXJOb2RlcyA9IHVzZUJlaGF2aW9yU3ViamVjdFN0YXRlKGNvbnRvdXJOb2Rlc1JlcG9ydCQpIHx8IFtdO1xuICBjb25zdCBtb2RhbExheWVyQ29udG91ck5vZGVzID0gdXNlQmVoYXZpb3JTdWJqZWN0U3RhdGUobW9kYWxMYXllckNvbnRvdXJOb2Rlc1JlcG9ydCQpIHx8IFtdO1xuICBjb25zdCBhY3RpdmVPdmVyTGF5ZXJOb2RlSUQgPSB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZShhY3RpdmVPdmVyTGF5ZXJOb2RlSUQkKTtcblxuICBpZiAoYWN0aXZlT3ZlckxheWVyTm9kZUlEKSB7XG4gICAgcmV0dXJuIG1vZGFsTGF5ZXJDb250b3VyTm9kZXMgfHwgW107XG4gIH1cblxuICByZXR1cm4gY29udG91ck5vZGVzIHx8IFtdO1xufVxuXG5mdW5jdGlvbiBGb3JlZ3JvdW5kKCk6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgY29udG91ck5vZGVzID0gdXNlQ29udG91ck5vZGVzKCk7XG4gIGNvbnN0IGhpZGVGYWxsYmFja0NvbnRvdXIgPSB1c2VCZWhhdmlvclN1YmplY3RTdGF0ZShhY3RpdmVPdmVyTGF5ZXJOb2RlSUQkKTtcblxuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRvdXItbm9kZXNcIj5cbiAgICAgICAge2NvbnRvdXJOb2Rlcy5tYXAoKGNvbnRvdXIpID0+IHtcbiAgICAgICAgICByZXR1cm4gPFJlbmRlckNvbnRvdXJOb2RlIGtleT17YGNvbnRvdXItJHtjb250b3VyLmlkfWB9IGNvbnRvdXJOb2RlPXtjb250b3VyfSAvPjtcbiAgICAgICAgfSl9XG4gICAgICA8L2Rpdj5cbiAgICAgIHshaGlkZUZhbGxiYWNrQ29udG91ciAmJiAoPEZhbGxiYWNrQ29udG91ck5vZGUgLz4pfVxuICAgICAgPFRvb2xiYXIgLz5cbiAgICA8Lz5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRm9yZWdyb3VuZDtcbiIsImltcG9ydCB7IGJ5QXJiaXRyYXJ5LCBnZXRGaXJzdExldmVsQ29uY3JldGVDaGlsZHJlbiB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnktdXRpbHMnO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJ0BvbmUtZm9yLWFsbC9lbGVtZW50cy1yYWRhcic7XG5pbXBvcnQge1xuICBDb250b3VyTm9kZSxcbiAgR3JlZW5ab25lQWRqYWNlbnRXaXRoUGFyZW50LFxuICBHcmVlblpvbmVCZXR3ZWVuTm9kZXMsXG4gIEdyZWVuWm9uZUluc2lkZU5vZGUsXG59IGZyb20gJy4uLy4uL3R5cGVzJztcblxuLy8gdG9kbyBvcHRpbWl6ZSBwZXJmb3JtYW5jZVxuZnVuY3Rpb24gZ2V0Rmlyc3RMZXZlbENvbmNyZXRlQ2hpbGRyZW5Db250b3VycyhcbiAgcm9vdDogSW1tdXRhYmxlLkNvbGxlY3Rpb248dW5rbm93biwgdW5rbm93bj4sXG4gIG5vZGVJRDogc3RyaW5nLFxuICBjb250b3VyTm9kZXM6IENvbnRvdXJOb2RlW10sXG4pOiBBcnJheTxDb250b3VyTm9kZT4ge1xuICBjb25zdCBub2RlS2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KHJvb3QsIG5vZGVJRCk7XG4gIGlmICghbm9kZUtleVBhdGgpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCBwYXJlbnROb2RlID0gcm9vdC5nZXRJbihub2RlS2V5UGF0aCkgYXMgSW1tdXRhYmxlLkNvbGxlY3Rpb248dW5rbm93biwgdW5rbm93bj47XG4gIGlmICghcGFyZW50Tm9kZSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGlkczogc3RyaW5nW10gPSBnZXRGaXJzdExldmVsQ29uY3JldGVDaGlsZHJlbihwYXJlbnROb2RlKS5tYXAoXG4gICAgKGNoaWxkKSA9PiBjaGlsZC5nZXRJbihbJ2lkJ10pIGFzIHN0cmluZyxcbiAgKTtcbiAgcmV0dXJuIGNvbnRvdXJOb2Rlcy5maWx0ZXIoKHsgaWQgfSkgPT4gaWRzLmluY2x1ZGVzKGlkKSk7XG59XG4vLyB0eXBlIE5lYXJlc3RFZGdlID0gJ2xlZnQnIHwgJ3JpZ2h0JztcbmNvbnN0IE1JTl9HQVAgPSAyO1xuXG5mdW5jdGlvbiBmaW5kUmlnaHRTaWJsaW5ncyhjdXJyZW50OiBDb250b3VyTm9kZSwgYWxsU2libGluZ3M6IENvbnRvdXJOb2RlW10pOiBDb250b3VyTm9kZVtdIHtcbiAgcmV0dXJuIGFsbFNpYmxpbmdzLmZpbHRlcigoc2libGluZykgPT4ge1xuICAgIGlmIChzaWJsaW5nLmlkID09PSBjdXJyZW50LmlkKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnQucmF3LnggKyBjdXJyZW50LnJhdy53aWR0aCArIE1JTl9HQVAgPiBzaWJsaW5nLnJhdy54KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnQucmF3LnkgPiBzaWJsaW5nLnJhdy55ICsgc2libGluZy5yYXcuaGVpZ2h0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKGN1cnJlbnQucmF3LnkgKyBjdXJyZW50LnJhdy5oZWlnaHQgPCBzaWJsaW5nLnJhdy55KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiB0b0dyZWVuWm9uZUJldHdlZW5Ob2RlcyhcbiAgY3VycmVudDogQ29udG91ck5vZGUsXG4gIHJpZ2h0U2libGluZ3M6IENvbnRvdXJOb2RlW10sXG4pOiBHcmVlblpvbmVCZXR3ZWVuTm9kZXNbXSB7XG4gIHJldHVybiByaWdodFNpYmxpbmdzLm1hcCgocmlnaHQpID0+IHtcbiAgICBjb25zdCBhYnNvbHV0ZVBvc2l0aW9uOiBSZWN0ID0ge1xuICAgICAgeDogY3VycmVudC5hYnNvbHV0ZVBvc2l0aW9uLnggKyBjdXJyZW50LmFic29sdXRlUG9zaXRpb24ud2lkdGgsXG4gICAgICB5OiBNYXRoLm1pbihjdXJyZW50LmFic29sdXRlUG9zaXRpb24ueSwgcmlnaHQuYWJzb2x1dGVQb3NpdGlvbi55KSxcbiAgICAgIHdpZHRoOiByaWdodC5hYnNvbHV0ZVBvc2l0aW9uLnggLSAoY3VycmVudC5hYnNvbHV0ZVBvc2l0aW9uLnggKyBjdXJyZW50LmFic29sdXRlUG9zaXRpb24ud2lkdGgpLFxuICAgICAgaGVpZ2h0OiBNYXRoLm1pbihcbiAgICAgICAgTWF0aC5hYnMoY3VycmVudC5hYnNvbHV0ZVBvc2l0aW9uLnkgLSAocmlnaHQuYWJzb2x1dGVQb3NpdGlvbi55ICsgcmlnaHQuYWJzb2x1dGVQb3NpdGlvbi5oZWlnaHQpKSxcbiAgICAgICAgTWF0aC5hYnMoY3VycmVudC5hYnNvbHV0ZVBvc2l0aW9uLnkgKyBjdXJyZW50LmFic29sdXRlUG9zaXRpb24uaGVpZ2h0IC0gcmlnaHQuYWJzb2x1dGVQb3NpdGlvbi55KSxcbiAgICAgICksXG4gICAgfTtcblxuICAgIGNvbnN0IHJhdzogUmVjdCA9IHtcbiAgICAgIHg6IGN1cnJlbnQucmF3LnggKyBjdXJyZW50LmFic29sdXRlUG9zaXRpb24ud2lkdGgsXG4gICAgICB5OiBNYXRoLm1pbihjdXJyZW50LnJhdy55LCByaWdodC5yYXcueSksXG4gICAgICB3aWR0aDogYWJzb2x1dGVQb3NpdGlvbi53aWR0aCxcbiAgICAgIGhlaWdodDogYWJzb2x1dGVQb3NpdGlvbi5oZWlnaHQsXG4gICAgfTtcblxuICAgIHJldHVybiB7IGxlZnQ6IGN1cnJlbnQsIHJpZ2h0LCBhYnNvbHV0ZVBvc2l0aW9uLCB0eXBlOiAnYmV0d2Vlbi1ub2RlcycsIHJhdyB9O1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaGFzSW50ZXJTZWN0aW9uKHJlY3RBOiBSZWN0LCByZWN0QjogUmVjdCk6IGJvb2xlYW4ge1xuICBjb25zdCB4QXhpc1Byb2plY3Rpb25SZWFjdEE6IFtudW1iZXIsIG51bWJlcl0gPSBbcmVjdEEueCwgcmVjdEEueCArIHJlY3RBLndpZHRoXTtcbiAgY29uc3QgeEF4aXNQcm9qZWN0aW9uUmVhY3RCOiBbbnVtYmVyLCBudW1iZXJdID0gW3JlY3RCLngsIHJlY3RCLnggKyByZWN0Qi53aWR0aF07XG4gIGNvbnN0IHlBeGlzUHJvamVjdGlvblJlY3RBOiBbbnVtYmVyLCBudW1iZXJdID0gW3JlY3RBLnksIHJlY3RBLnkgKyByZWN0QS5oZWlnaHRdO1xuICBjb25zdCB5QXhpc1Byb2plY3Rpb25SZWN0QjogW251bWJlciwgbnVtYmVyXSA9IFtyZWN0Qi55LCByZWN0Qi55ICsgcmVjdEIuaGVpZ2h0XTtcblxuICBjb25zdCBtYXhTdGFydFggPSBNYXRoLm1heCh4QXhpc1Byb2plY3Rpb25SZWFjdEFbMF0sIHhBeGlzUHJvamVjdGlvblJlYWN0QlswXSk7XG4gIGNvbnN0IG1pbkVuZFggPSBNYXRoLm1pbih4QXhpc1Byb2plY3Rpb25SZWFjdEFbMV0sIHhBeGlzUHJvamVjdGlvblJlYWN0QlsxXSk7XG4gIGNvbnN0IG1heFN0YXJ0WSA9IE1hdGgubWF4KHlBeGlzUHJvamVjdGlvblJlY3RBWzBdLCB5QXhpc1Byb2plY3Rpb25SZWN0QlswXSk7XG4gIGNvbnN0IG1pbkVuZFkgPSBNYXRoLm1pbih5QXhpc1Byb2plY3Rpb25SZWN0QVsxXSwgeUF4aXNQcm9qZWN0aW9uUmVjdEJbMV0pO1xuXG4gIHJldHVybiBtYXhTdGFydFggPCBtaW5FbmRYICYmIG1heFN0YXJ0WSA8IG1pbkVuZFk7XG59XG5cbmZ1bmN0aW9uIGZpbHRlckdyZWVuWm9uZXNJbnRlcnNlY3Rpb25XaXRoTm9kZShcbiAgZ3JlZW5ab25lczogR3JlZW5ab25lQmV0d2Vlbk5vZGVzW10sXG4gIGNvbnRvdXJzOiBDb250b3VyTm9kZVtdLFxuKTogR3JlZW5ab25lQmV0d2Vlbk5vZGVzW10ge1xuICByZXR1cm4gZ3JlZW5ab25lcy5maWx0ZXIoKHsgYWJzb2x1dGVQb3NpdGlvbiB9KSA9PiB7XG4gICAgY29uc3QgaXNJbnRlclNlY3RpbmcgPSBjb250b3Vycy5zb21lKChjb250b3VyKSA9PlxuICAgICAgaGFzSW50ZXJTZWN0aW9uKGNvbnRvdXIuYWJzb2x1dGVQb3NpdGlvbiwgYWJzb2x1dGVQb3NpdGlvbiksXG4gICAgKTtcbiAgICByZXR1cm4gIWlzSW50ZXJTZWN0aW5nO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0R3JlZW5ab25lc1dpdGhQYXJlbnQoXG4gIHBhcmVudDogQ29udG91ck5vZGUsXG4gIGNoaWxkcmVuOiBDb250b3VyTm9kZVtdLFxuKTogR3JlZW5ab25lQWRqYWNlbnRXaXRoUGFyZW50W10ge1xuICBjb25zdCBncmVlblpvbmVCZXR3ZWVuUGFyZW50TGVmdEVkZ2UgPSBjaGlsZHJlbi5tYXA8R3JlZW5ab25lQWRqYWNlbnRXaXRoUGFyZW50PigoY2hpbGQpID0+IHtcbiAgICBjb25zdCByYXc6IFJlY3QgPSB7XG4gICAgICB4OiBwYXJlbnQucmF3LngsXG4gICAgICB5OiBjaGlsZC5yYXcueSxcbiAgICAgIGhlaWdodDogY2hpbGQuYWJzb2x1dGVQb3NpdGlvbi5oZWlnaHQsXG4gICAgICB3aWR0aDogY2hpbGQuYWJzb2x1dGVQb3NpdGlvbi54IC0gcGFyZW50LmFic29sdXRlUG9zaXRpb24ueCxcbiAgICB9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHR5cGU6ICdhZGphY2VudC13aXRoLXBhcmVudCcsXG4gICAgICBwYXJlbnQ6IHBhcmVudCxcbiAgICAgIGNoaWxkOiBjaGlsZCxcbiAgICAgIGVkZ2U6ICdsZWZ0JyxcbiAgICAgIHJhdyxcbiAgICAgIGFic29sdXRlUG9zaXRpb246IHtcbiAgICAgICAgeDogcGFyZW50LmFic29sdXRlUG9zaXRpb24ueCxcbiAgICAgICAgeTogY2hpbGQuYWJzb2x1dGVQb3NpdGlvbi55LFxuICAgICAgICBoZWlnaHQ6IGNoaWxkLmFic29sdXRlUG9zaXRpb24uaGVpZ2h0LFxuICAgICAgICB3aWR0aDogY2hpbGQuYWJzb2x1dGVQb3NpdGlvbi54IC0gcGFyZW50LmFic29sdXRlUG9zaXRpb24ueCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSk7XG5cbiAgY29uc3QgZ3JlZW5ab25lQmV0d2VlblBhcmVudFJpZ2h0RWRnZSA9IGNoaWxkcmVuLm1hcDxHcmVlblpvbmVBZGphY2VudFdpdGhQYXJlbnQ+KChjaGlsZCkgPT4ge1xuICAgIGNvbnN0IFggPSBjaGlsZC5hYnNvbHV0ZVBvc2l0aW9uLnggKyBjaGlsZC5hYnNvbHV0ZVBvc2l0aW9uLndpZHRoO1xuICAgIGNvbnN0IHJhdzogUmVjdCA9IHtcbiAgICAgIHg6IGNoaWxkLnJhdy54ICsgY2hpbGQuYWJzb2x1dGVQb3NpdGlvbi53aWR0aCxcbiAgICAgIHk6IGNoaWxkLnJhdy55LFxuICAgICAgaGVpZ2h0OiBjaGlsZC5hYnNvbHV0ZVBvc2l0aW9uLmhlaWdodCxcbiAgICAgIHdpZHRoOiBwYXJlbnQuYWJzb2x1dGVQb3NpdGlvbi54ICsgcGFyZW50LmFic29sdXRlUG9zaXRpb24ud2lkdGggLSBYLFxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgcmF3LFxuICAgICAgdHlwZTogJ2FkamFjZW50LXdpdGgtcGFyZW50JyxcbiAgICAgIHBhcmVudDogcGFyZW50LFxuICAgICAgY2hpbGQ6IGNoaWxkLFxuICAgICAgZWRnZTogJ3JpZ2h0JyxcbiAgICAgIGFic29sdXRlUG9zaXRpb246IHtcbiAgICAgICAgeDogWCxcbiAgICAgICAgeTogY2hpbGQuYWJzb2x1dGVQb3NpdGlvbi55LFxuICAgICAgICBoZWlnaHQ6IGNoaWxkLmFic29sdXRlUG9zaXRpb24uaGVpZ2h0LFxuICAgICAgICB3aWR0aDogcGFyZW50LmFic29sdXRlUG9zaXRpb24ueCArIHBhcmVudC5hYnNvbHV0ZVBvc2l0aW9uLndpZHRoIC0gWCxcbiAgICAgIH0sXG4gICAgfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGdyZWVuWm9uZUJldHdlZW5QYXJlbnRMZWZ0RWRnZS5jb25jYXQoZ3JlZW5ab25lQmV0d2VlblBhcmVudFJpZ2h0RWRnZSkuZmlsdGVyKChncmVlblpvbmUpID0+IHtcbiAgICBpZiAoZ3JlZW5ab25lLmFic29sdXRlUG9zaXRpb24uaGVpZ2h0IDwgNCB8fCBncmVlblpvbmUuYWJzb2x1dGVQb3NpdGlvbi53aWR0aCA8IDQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gIWNoaWxkcmVuLnNvbWUoKHsgYWJzb2x1dGVQb3NpdGlvbiB9KSA9PlxuICAgICAgaGFzSW50ZXJTZWN0aW9uKGFic29sdXRlUG9zaXRpb24sIGdyZWVuWm9uZS5hYnNvbHV0ZVBvc2l0aW9uKSxcbiAgICApO1xuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNHcmVlblpvbmVPZkhvdmVyaW5nTm9kZVN1cHBvcnRDaGlsZHJlbkFuZENoaWxkcmVuSXNOb3RFbXB0eShcbiAgcm9vdDogSW1tdXRhYmxlLkNvbGxlY3Rpb248dW5rbm93biwgdW5rbm93bj4sXG4gIGhvdmVyaW5nQ29udG91cjogQ29udG91ck5vZGUsXG4gIGNvbnRvdXJOb2RlczogQ29udG91ck5vZGVbXSxcbik6IEFycmF5PEdyZWVuWm9uZUluc2lkZU5vZGU+IHtcbiAgY29uc3QgZmlyc3RMZXZlbENoaWxkcmVuQ29udG91cnMgPSBnZXRGaXJzdExldmVsQ29uY3JldGVDaGlsZHJlbkNvbnRvdXJzKFxuICAgIHJvb3QsXG4gICAgaG92ZXJpbmdDb250b3VyLmlkLFxuICAgIGNvbnRvdXJOb2RlcyxcbiAgKTtcblxuICBjb25zdCBncmVlblpvbmVzQmV0d2Vlbk5vZGVzID0gZmlyc3RMZXZlbENoaWxkcmVuQ29udG91cnNcbiAgICAubWFwKChjdXJyZW50KSA9PiB7XG4gICAgICBjb25zdCByaWdodFNpYmxpbmdzID0gZmluZFJpZ2h0U2libGluZ3MoY3VycmVudCwgZmlyc3RMZXZlbENoaWxkcmVuQ29udG91cnMpO1xuICAgICAgcmV0dXJuIHRvR3JlZW5ab25lQmV0d2Vlbk5vZGVzKGN1cnJlbnQsIHJpZ2h0U2libGluZ3MpO1xuICAgIH0pXG4gICAgLnJlZHVjZSgoYWNjLCBncmVlblpvbmVzKSA9PiBhY2MuY29uY2F0KGdyZWVuWm9uZXMpLCBbXSk7XG4gIGNvbnN0IGZpbHRlcmVkR3JlZW5ab25lcyA9IGZpbHRlckdyZWVuWm9uZXNJbnRlcnNlY3Rpb25XaXRoTm9kZShcbiAgICBncmVlblpvbmVzQmV0d2Vlbk5vZGVzLFxuICAgIGZpcnN0TGV2ZWxDaGlsZHJlbkNvbnRvdXJzLFxuICApO1xuXG4gIGNvbnN0IGdyZWVuWm9uZXNXaXRoUGFyZW50ID0gZ2V0R3JlZW5ab25lc1dpdGhQYXJlbnQoaG92ZXJpbmdDb250b3VyLCBmaXJzdExldmVsQ2hpbGRyZW5Db250b3Vycyk7XG5cbiAgcmV0dXJuIFsuLi5maWx0ZXJlZEdyZWVuWm9uZXMsIC4uLmdyZWVuWm9uZXNXaXRoUGFyZW50XTtcbn1cbiIsImltcG9ydCB7IHVzZUVmZmVjdCwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyBhbmltYXRpb25GcmFtZXMsIGF1ZGl0LCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgbWFwIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBieUFyYml0cmFyeSwgbm9kZUhhc0NoaWxkTm9kZXMgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5LXV0aWxzJztcblxuaW1wb3J0IHsgR3JlZW5ab25lRm9yTm9kZVdpdGhvdXRDaGlsZHJlbiwgR3JlZW5ab25lSW5zaWRlTm9kZSwgQ29udG91ck5vZGUgfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBjYWxjR3JlZW5ab25lT2ZIb3ZlcmluZ05vZGVTdXBwb3J0Q2hpbGRyZW5BbmRDaGlsZHJlbklzTm90RW1wdHkgfSBmcm9tICcuL2dyZWVuLXpvbmUtaGVscGVycyc7XG5pbXBvcnQgeyBob3ZlcmluZ0NvbnRvdXJOb2RlJCwgY29udG91ck5vZGVzUmVwb3J0JCB9IGZyb20gJy4uL3N0YXRlcy1jZW50ZXInO1xuaW1wb3J0IHsgaW1tdXRhYmxlUm9vdCQgfSBmcm9tICcuLi9zdGF0ZXMtY2VudGVyJztcbmltcG9ydCB7IEZBTExCQUNLX0NPTlRPVVJfTk9ERV9JRCB9IGZyb20gJy4uL2NvbnN0YW50cyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHVzZUdyZWVuWm9uZVJlcG9ydCgpIHtcbiAgY29uc3QgW2dyZWVuWm9uZXNCZXR3ZWVuTm9kZXMsIHNldEdyZWVuWm9uZXNdID0gdXNlU3RhdGU8XG4gICAgQXJyYXk8R3JlZW5ab25lSW5zaWRlTm9kZT4gfCBHcmVlblpvbmVGb3JOb2RlV2l0aG91dENoaWxkcmVuXG4gID4oW10pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gaG92ZXJpbmdDb250b3VyTm9kZSRcbiAgICAgIC5waXBlKFxuICAgICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICAgICAgICBhdWRpdCgoKSA9PiBhbmltYXRpb25GcmFtZXMoKSksXG4gICAgICAgIG1hcDxDb250b3VyTm9kZSB8IHVuZGVmaW5lZCwgQXJyYXk8R3JlZW5ab25lSW5zaWRlTm9kZT4gfCBHcmVlblpvbmVGb3JOb2RlV2l0aG91dENoaWxkcmVuPihcbiAgICAgICAgICAoaG92ZXJpbmdDb250b3VyTm9kZSkgPT4ge1xuICAgICAgICAgICAgaWYgKCFob3ZlcmluZ0NvbnRvdXJOb2RlIHx8IGhvdmVyaW5nQ29udG91ck5vZGU/LmlkID09PSBGQUxMQkFDS19DT05UT1VSX05PREVfSUQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBjb250b3VyTm9kZXMgPSBjb250b3VyTm9kZXNSZXBvcnQkLnZhbHVlO1xuICAgICAgICAgICAgaWYgKCFjb250b3VyTm9kZXM/Lmxlbmd0aCkge1xuICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvbnN0IGhvdmVyaW5nTm9kZUtleVBhdGggPSBieUFyYml0cmFyeShpbW11dGFibGVSb290JC52YWx1ZSwgaG92ZXJpbmdDb250b3VyTm9kZS5pZCk7XG4gICAgICAgICAgICBpZiAoIWhvdmVyaW5nTm9kZUtleVBhdGgpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBob3ZlcmluZ0FydGVyeU5vZGUgPSBpbW11dGFibGVSb290JC52YWx1ZS5nZXRJbihcbiAgICAgICAgICAgICAgaG92ZXJpbmdOb2RlS2V5UGF0aCxcbiAgICAgICAgICAgICkgYXMgSW1tdXRhYmxlLkNvbGxlY3Rpb248dW5rbm93biwgdW5rbm93bj47XG4gICAgICAgICAgICBjb25zdCBoYXNDaGlsZCA9IG5vZGVIYXNDaGlsZE5vZGVzKGhvdmVyaW5nQXJ0ZXJ5Tm9kZSk7XG4gICAgICAgICAgICBpZiAoIWhhc0NoaWxkKSB7XG4gICAgICAgICAgICAgIHJldHVybiB7IGNvbnRvdXI6IGhvdmVyaW5nQ29udG91ck5vZGUsIHR5cGU6ICdub2RlX3dpdGhvdXRfY2hpbGRyZW4nLCBwb3NpdGlvbjogJ2xlZnQnIH07XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBjYWxjR3JlZW5ab25lT2ZIb3ZlcmluZ05vZGVTdXBwb3J0Q2hpbGRyZW5BbmRDaGlsZHJlbklzTm90RW1wdHkoXG4gICAgICAgICAgICAgIGltbXV0YWJsZVJvb3QkLnZhbHVlLFxuICAgICAgICAgICAgICBob3ZlcmluZ0NvbnRvdXJOb2RlLFxuICAgICAgICAgICAgICBjb250b3VyTm9kZXMsXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0sXG4gICAgICAgICksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHNldEdyZWVuWm9uZXMpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICByZXR1cm4gZ3JlZW5ab25lc0JldHdlZW5Ob2Rlcztcbn1cbiIsImltcG9ydCBSZWFjdCwgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgUmVjdCB9IGZyb20gJ0BvbmUtZm9yLWFsbC9lbGVtZW50cy1yYWRhcic7XG5pbXBvcnQgeyBhdWRpdCwgbWFwLCBhbmltYXRpb25GcmFtZXMsIHRhcCB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBfY2hlY2tJZk5vZGVTdXBwb3J0Q2hpbGRyZW4sIGlzTm9kZVN1cHBvcnRDaGlsZHJlbkNhY2hlIH0gZnJvbSAnLi4vY2FjaGUnO1xuaW1wb3J0IHsgR3JlZW5ab25lRm9yTm9kZVdpdGhvdXRDaGlsZHJlbiwgUG9zaXRpb24gfSBmcm9tICcuLi8uLi90eXBlcyc7XG5pbXBvcnQgeyBjdXJzb3IkLCBsYXRlc3RGb2N1c2VkR3JlZW5ab25lJCB9IGZyb20gJy4uL3N0YXRlcy1jZW50ZXInO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBncmVlblpvbmU6IEdyZWVuWm9uZUZvck5vZGVXaXRob3V0Q2hpbGRyZW47XG59XG5cbmZ1bmN0aW9uIGNhbGNQb3NpdGlvbihYOiBudW1iZXIsIGlzU3VwcG9ydENoaWxkcmVuOiBib29sZWFuLCByZWN0OiBSZWN0KTogUG9zaXRpb24ge1xuICBpZiAoIWlzU3VwcG9ydENoaWxkcmVuKSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKFggLSByZWN0LngpID4gcmVjdC53aWR0aCAvIDIgPyAncmlnaHQnIDogJ2xlZnQnO1xuICB9XG5cbiAgaWYgKFggPCByZWN0LnggKyA4KSB7XG4gICAgcmV0dXJuICdsZWZ0JztcbiAgfVxuXG4gIGlmIChYID4gcmVjdC54ICsgcmVjdC53aWR0aCAtIDgpIHtcbiAgICByZXR1cm4gJ3JpZ2h0JztcbiAgfVxuXG4gIHJldHVybiAnaW5uZXInO1xufVxuXG5mdW5jdGlvbiBjYWxjU3R5bGUocG9zaXRpb246IFBvc2l0aW9uLCBhYnNvbHV0ZVBvc2l0aW9uOiBSZWN0KTogUmVhY3QuQ1NTUHJvcGVydGllcyB8IHVuZGVmaW5lZCB7XG4gIGNvbnN0IHsgaGVpZ2h0LCB3aWR0aCwgeCwgeSB9ID0gYWJzb2x1dGVQb3NpdGlvbjtcbiAgY29uc3QgX2hlaWdodCA9IGhlaWdodCAtIDQ7XG4gIGNvbnN0IF95ID0geSArIDI7XG5cbiAgaWYgKHBvc2l0aW9uID09PSAnaW5uZXInKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogX2hlaWdodCxcbiAgICAgIHdpZHRoOiB3aWR0aCAtIDQsXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHt4ICsgMn1weCwgJHtfeX1weClgLFxuICAgIH07XG4gIH1cblxuICBpZiAocG9zaXRpb24gPT09ICdsZWZ0Jykge1xuICAgIHJldHVybiB7XG4gICAgICBoZWlnaHQ6IF9oZWlnaHQsXG4gICAgICB3aWR0aDogJzhweCcsXG4gICAgICB0cmFuc2Zvcm06IGB0cmFuc2xhdGUoJHtNYXRoLm1heCh4IC0gOSwgMCl9cHgsICR7X3l9cHgpYCxcbiAgICB9O1xuICB9XG5cbiAgaWYgKHBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogX2hlaWdodCxcbiAgICAgIHdpZHRoOiAnOHB4JyxcbiAgICAgIC8vIHRvZG8gcmVhZCBpbm5lcldpZHRoIGhhcyBwZXJmb3JtYW5jZSBjb3N0LCBvcHRpbWl6ZSBpdFxuICAgICAgdHJhbnNmb3JtOiBgdHJhbnNsYXRlKCR7TWF0aC5taW4oeCArIHdpZHRoICsgMiwgd2luZG93LmlubmVyV2lkdGggLSA5KX1weCwgJHtfeX1weClgLFxuICAgIH07XG4gIH1cblxuICByZXR1cm47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIFJlbmRlckdyZWVuWm9uZUZvck5vZGVXaXRob3V0Q2hpbGRyZW4oeyBncmVlblpvbmUgfTogUHJvcHMpOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IFtzdHlsZSwgc2V0U3R5bGVdID0gdXNlU3RhdGU8UmVhY3QuQ1NTUHJvcGVydGllcz4oKTtcbiAgY29uc3QgaXNTdXBwb3J0Q2hpbGRyZW4gPSAhIWlzTm9kZVN1cHBvcnRDaGlsZHJlbkNhY2hlLmdldChncmVlblpvbmUuY29udG91ci5leGVjdXRvcik7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBjdXJzb3IkXG4gICAgICAucGlwZShcbiAgICAgICAgYXVkaXQoKCkgPT4gYW5pbWF0aW9uRnJhbWVzKCkpLFxuICAgICAgICBtYXAoKHsgeCB9KSA9PiBjYWxjUG9zaXRpb24oeCwgaXNTdXBwb3J0Q2hpbGRyZW4sIGdyZWVuWm9uZS5jb250b3VyLnJhdykpLFxuICAgICAgICB0YXAoKHBvc2l0aW9uKSA9PlxuICAgICAgICAgIGxhdGVzdEZvY3VzZWRHcmVlblpvbmUkLm5leHQoe1xuICAgICAgICAgICAgcG9zaXRpb24sXG4gICAgICAgICAgICBjb250b3VyOiBncmVlblpvbmUuY29udG91cixcbiAgICAgICAgICAgIHR5cGU6ICdub2RlX3dpdGhvdXRfY2hpbGRyZW4nLFxuICAgICAgICAgIH0pLFxuICAgICAgICApLFxuICAgICAgICBtYXAoKHBvc2l0aW9uKSA9PiBjYWxjU3R5bGUocG9zaXRpb24sIGdyZWVuWm9uZS5jb250b3VyLmFic29sdXRlUG9zaXRpb24pKSxcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoc2V0U3R5bGUpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH07XG4gIH0sIFtncmVlblpvbmVdKTtcblxuICByZXR1cm4gPGRpdiBjbGFzc05hbWU9XCJncmVlbi16b25lIGdyZWVuLXpvbmUtZm9yLW5vZGUtd2l0aG91dC1jaGlsZHJlblwiIHN0eWxlPXtzdHlsZX0gLz47XG59XG4iLCJpbXBvcnQgY3MgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IFJlY3QgfSBmcm9tICdAb25lLWZvci1hbGwvZWxlbWVudHMtcmFkYXInO1xuaW1wb3J0IHsgbWFwLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgYXVkaXQsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IGFuaW1hdGlvbkZyYW1lcyB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBjdXJzb3IkLCBsYXRlc3RGb2N1c2VkR3JlZW5ab25lJCB9IGZyb20gJy4uL3N0YXRlcy1jZW50ZXInO1xuaW1wb3J0IHsgQ3Vyc29yLCBHcmVlblpvbmVJbnNpZGVOb2RlIH0gZnJvbSAnLi4vLi4vdHlwZXMnO1xuXG5pbnRlcmZhY2UgUHJvcHMge1xuICBncmVlblpvbmVzOiBHcmVlblpvbmVJbnNpZGVOb2RlW107XG59XG5cbmZ1bmN0aW9uIGlzSW5zaWRlKGN1cnNvcjogQ3Vyc29yLCByYXc6IFJlY3QpOiBib29sZWFuIHtcbiAgcmV0dXJuIChcbiAgICBjdXJzb3IueCA+PSByYXcueCAmJiBjdXJzb3IueCA8PSByYXcueCArIHJhdy53aWR0aCAmJiBjdXJzb3IueSA+PSByYXcueSAmJiBjdXJzb3IueSA8PSByYXcueSArIHJhdy5oZWlnaHRcbiAgKTtcbn1cblxuZnVuY3Rpb24gZ2V0R3JlZW5ab25lSUQoZ3JlZW5ab25lOiBHcmVlblpvbmVJbnNpZGVOb2RlKTogc3RyaW5nIHtcbiAgaWYgKGdyZWVuWm9uZS50eXBlID09PSAnYWRqYWNlbnQtd2l0aC1wYXJlbnQnKSB7XG4gICAgcmV0dXJuIGBhZGphY2VudC0ke2dyZWVuWm9uZS5wYXJlbnQuaWR9LSR7Z3JlZW5ab25lLmNoaWxkLmlkfS0ke2dyZWVuWm9uZS5lZGdlfWA7XG4gIH1cblxuICByZXR1cm4gYGJldHdlZW4tJHtncmVlblpvbmUubGVmdC5pZH0tJHtncmVlblpvbmUucmlnaHQuaWR9YDtcbn1cblxuZnVuY3Rpb24gdXNlSW5zaWRlSUQoZ3JlZW5ab25lczogR3JlZW5ab25lSW5zaWRlTm9kZVtdKTogc3RyaW5nIHtcbiAgY29uc3QgW2luU2lkZUlELCBzZXRJbnNpZGVJRF0gPSB1c2VTdGF0ZTxzdHJpbmc+KCcnKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IGN1cnNvciRcbiAgICAgIC5waXBlKFxuICAgICAgICBhdWRpdCgoKSA9PiBhbmltYXRpb25GcmFtZXMoKSksXG4gICAgICAgIG1hcCgoY3Vyc29yKSA9PiBncmVlblpvbmVzLmZpbHRlcigoeyByYXcgfSkgPT4gaXNJbnNpZGUoY3Vyc29yLCByYXcpKSksXG4gICAgICAgIG1hcCgoZ3JlZW5ab25lcykgPT4gKGdyZWVuWm9uZXMubGVuZ3RoID8gZ3JlZW5ab25lc1swXSA6IHVuZGVmaW5lZCkpLFxuICAgICAgICB0YXAoKGdyZWVuWm9uZSkgPT4gZ3JlZW5ab25lICYmIGxhdGVzdEZvY3VzZWRHcmVlblpvbmUkLm5leHQoZ3JlZW5ab25lKSksXG4gICAgICAgIG1hcCgoZ3JlZW5ab25lKSA9PiB7XG4gICAgICAgICAgaWYgKCFncmVlblpvbmUpIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICByZXR1cm4gZ2V0R3JlZW5ab25lSUQoZ3JlZW5ab25lKTtcbiAgICAgICAgfSksXG4gICAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKHNldEluc2lkZUlEKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9O1xuICB9LCBbZ3JlZW5ab25lc10pO1xuXG4gIHJldHVybiBpblNpZGVJRDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gUmVuZGVyR3JlZW5ab25lc0JldHdlZW5Ob2Rlcyh7IGdyZWVuWm9uZXMgfTogUHJvcHMpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCBpbnNpZGVJRCA9IHVzZUluc2lkZUlEKGdyZWVuWm9uZXMpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtncmVlblpvbmVzLm1hcCgoZ3JlZW5ab25lKSA9PiB7XG4gICAgICAgIGNvbnN0IGtleSA9IGdldEdyZWVuWm9uZUlEKGdyZWVuWm9uZSk7XG4gICAgICAgIGlmIChncmVlblpvbmUudHlwZSA9PT0gJ2JldHdlZW4tbm9kZXMnKSB7XG4gICAgICAgICAgY29uc3QgeyBhYnNvbHV0ZVBvc2l0aW9uIH0gPSBncmVlblpvbmU7XG4gICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICAgIGNsYXNzTmFtZT17Y3MoJ2dyZWVuLXpvbmUgZ3JlZW4tem9uZS1iZXR3ZWVuLW5vZGVzJywge1xuICAgICAgICAgICAgICAgICdncmVlbi16b25lLWJldHdlZW4tbm9kZXMtLWZvY3VzZWQnOiBrZXkgPT09IGluc2lkZUlELFxuICAgICAgICAgICAgICB9KX1cbiAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGFic29sdXRlUG9zaXRpb24uaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdpZHRoOiBhYnNvbHV0ZVBvc2l0aW9uLndpZHRoLFxuICAgICAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke2Fic29sdXRlUG9zaXRpb24ueH1weCwgJHthYnNvbHV0ZVBvc2l0aW9uLnl9cHgpYCxcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAga2V5PXtrZXl9XG4gICAgICAgICAgICBjbGFzc05hbWU9e2NzKCdncmVlbi16b25lIGdyZWVuLXpvbmUtYmV0d2Vlbi1ub2RlcycsIHtcbiAgICAgICAgICAgICAgJ2dyZWVuLXpvbmUtYmV0d2Vlbi1ub2Rlcy0tZm9jdXNlZCc6IGtleSA9PT0gaW5zaWRlSUQsXG4gICAgICAgICAgICB9KX1cbiAgICAgICAgICAgIHN0eWxlPXt7XG4gICAgICAgICAgICAgIGhlaWdodDogZ3JlZW5ab25lLmFic29sdXRlUG9zaXRpb24uaGVpZ2h0LFxuICAgICAgICAgICAgICB3aWR0aDogZ3JlZW5ab25lLmFic29sdXRlUG9zaXRpb24ud2lkdGgsXG4gICAgICAgICAgICAgIHRyYW5zZm9ybTogYHRyYW5zbGF0ZSgke2dyZWVuWm9uZS5hYnNvbHV0ZVBvc2l0aW9uLnh9cHgsICR7Z3JlZW5ab25lLmFic29sdXRlUG9zaXRpb24ueX1weClgLFxuICAgICAgICAgICAgfX1cbiAgICAgICAgICAvPlxuICAgICAgICApO1xuICAgICAgfSl9XG4gICAgPC8+XG4gICk7XG59XG4iLCJpbXBvcnQgUmVhY3QsIHsgdXNlRWZmZWN0LCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB1c2VHcmVlblpvbmVSZXBvcnQgZnJvbSAnLi91c2UtZ3JlZW4tem9uZS1yZXBvcnQnO1xuaW1wb3J0IFJlbmRlckdyZWVuWm9uZUZvck5vZGVXaXRob3V0Q2hpbGRyZW4gZnJvbSAnLi9yZW5kZXItZ3JlZW4tem9uZS1mb3Itbm9kZS13aXRob3V0LWNoaWxkcmVuJztcbmltcG9ydCBSZW5kZXJHcmVlblpvbmVzQmV0d2Vlbk5vZGVzIGZyb20gJy4vcmVuZGVyLWdyZWVuLXpvbmVzLWJldHdlZW4tbm9kZXMnO1xuaW1wb3J0IHsgaW5EbmQkIH0gZnJvbSAnLi4vc3RhdGVzLWNlbnRlcic7XG5cbi8vIHRvZG8gdXRpbCBob29rXG5mdW5jdGlvbiB1c2VJbkRuZCgpOiBib29sZWFuIHtcbiAgY29uc3QgW2ZsYWcsIHNldEZsYWddID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gaW5EbmQkLnBpcGUoZGlzdGluY3RVbnRpbENoYW5nZWQoKSkuc3Vic2NyaWJlKHNldEZsYWcpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH07XG4gIH0sIFtdKTtcblxuICByZXR1cm4gZmxhZztcbn1cblxuZnVuY3Rpb24gR3JlZW5ab25lKCk6IEpTWC5FbGVtZW50IHwgbnVsbCB7XG4gIGNvbnN0IGdyZWVuWm9uZVJlcG9ydCA9IHVzZUdyZWVuWm9uZVJlcG9ydCgpO1xuICBjb25zdCBpbkRuZCA9IHVzZUluRG5kKCk7XG5cbiAgaWYgKCFpbkRuZCB8fCAhZ3JlZW5ab25lUmVwb3J0KSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBpZiAoQXJyYXkuaXNBcnJheShncmVlblpvbmVSZXBvcnQpKSB7XG4gICAgcmV0dXJuIDxSZW5kZXJHcmVlblpvbmVzQmV0d2Vlbk5vZGVzIGdyZWVuWm9uZXM9e2dyZWVuWm9uZVJlcG9ydH0gLz47XG4gIH1cblxuICByZXR1cm4gPFJlbmRlckdyZWVuWm9uZUZvck5vZGVXaXRob3V0Q2hpbGRyZW4gZ3JlZW5ab25lPXtncmVlblpvbmVSZXBvcnR9IC8+O1xufVxuXG5leHBvcnQgZGVmYXVsdCBHcmVlblpvbmU7XG4iLCJpbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmltcG9ydCBCYWNrZ3JvdW5kIGZyb20gJy4vYmFja2dyb3VuZCc7XG5pbXBvcnQgRm9yZWdyb3VuZCBmcm9tICcuL2ZvcmVncm91bmQnO1xuaW1wb3J0IEdyZWVuWm9uZSBmcm9tICcuL2dyZWVuLXpvbmUnO1xuaW1wb3J0IHsgRFVNTVlfQVJURVJZX1JPT1RfTk9ERV9JRCB9IGZyb20gJy4vY29uc3RhbnRzJztcbmltcG9ydCB7IHVzZUFydGVyeVJvb3ROb2RlSUQgfSBmcm9tICcuL3N0YXRlcy1jZW50ZXInO1xuXG5pbXBvcnQgJy4vaW5kZXguc2Nzcyc7XG5cbmZ1bmN0aW9uIFNpbXVsYXRvcigpOiBKU1guRWxlbWVudCB8IG51bGwge1xuICBjb25zdCByb290Tm9kZUlEID0gdXNlQXJ0ZXJ5Um9vdE5vZGVJRCgpO1xuICBpZiAocm9vdE5vZGVJRCA9PT0gRFVNTVlfQVJURVJZX1JPT1RfTk9ERV9JRCkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICA8PlxuICAgICAgPEJhY2tncm91bmQgLz5cbiAgICAgIDxHcmVlblpvbmUgLz5cbiAgICAgIDxGb3JlZ3JvdW5kIC8+XG4gICAgPC8+XG4gICk7XG59XG5cbmNvbnN0IGlmcmFtZUFwcFJvb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaWZyYW1lQXBwUm9vdCk7XG5cblJlYWN0RE9NLnJlbmRlcig8U2ltdWxhdG9yIC8+LCBpZnJhbWVBcHBSb290KTtcbiJdLCJuYW1lcyI6WyJNb25pdG9yZWRFbGVtZW50c0NvbnRleHQiLCJOb2RlUmVuZGVyIiwiTWFwIiwiU2V0IiwibWFwIiwiZmlsdGVyIiwic2V0SW4iLCJEZXB0aENvbnRleHQiLCJQbGFjZWhvbGRlciIsIkNoaWxkcmVuUmVuZGVyIiwidXNlQ29tcG9uZW50Tm9kZVByb3BzIiwiSFRNTE5vZGVSZW5kZXIiLCJSZWFjdENvbXBvbmVudE5vZGVSZW5kZXIiLCJMb29wQ29udGFpbmVyTm9kZVJlbmRlciIsIm1vbml0b3JlZEVsZW1lbnRzIiwiUmVuZGVyTGF5ZXIiLCJNb2RhbExheWVyUmVuZGVyIiwiUGFyZW50Tm9kZXMiLCJSZW5kZXJDb250b3VyTm9kZSIsIkZhbGxiYWNrQ29udG91ck5vZGUiLCJUb29sYmFyIiwiYXVkaXQiLCJ0YXAiLCJkaXN0aW5jdFVudGlsQ2hhbmdlZCIsIkJhY2tncm91bmQiLCJHcmVlblpvbmUiLCJGb3JlZ3JvdW5kIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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SUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztNQUMxRSxDQUFDO0FBQ0Q7TUFDQSxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7TUFDbkQsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFO01BQ2hCLElBQUksT0FBTyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7TUFDNUIsR0FBRztNQUNILEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQzdELEVBQUUsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDOUMsSUFBSSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDNUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDbEUsR0FBRztNQUNILEVBQUUsT0FBTyxJQUFJLENBQUM7TUFDZCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUU7TUFDckQsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDakIsRUFBRSxJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7TUFDbkIsRUFBRSxJQUFJLFdBQVcsR0FBRyxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNyQyxFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FB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RUFBRSxJQUFJLEVBQUU7TUFDNUMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO01BQ3RDLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTTtNQUN0QixRQUFRLFlBQVksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDM0QsUUFBUSxRQUFRLEVBQUUsQ0FBQztNQUNuQixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLEtBQUssR0FBRyxTQUFTLEtBQUssRUFBRSxJQUFJLEVBQUU7TUFDcEMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO01BQ3RDLElBQUksT0FBTyxJQUFJLENBQUMsTUFBTTtNQUN0QixRQUFRLFlBQVksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUM7TUFDdkQsUUFBUSxRQUFRLEVBQUUsQ0FBQztNQUNuQixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxRQUFRLElBQUk7TUFDaEQsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQ3pDLEdBQUcsQ0FBQztBQUNKO01BQ0E7QUFDQTtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO01BQzNDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNoQyxHQUFHLENBQUM7QUFDSjtNQUNBO0FBQ0E7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRTtN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QUNBO01BQ0EsRUFBRSxNQUFNLEVBQUUsU0FBUyxNQUFNLEdBQUc7TUFDNUIsSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7TUFDNUMsSUFBSSxRQUFRLEdBQUcsRUFBRSxHQUFHLE1BQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDckQ7TUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDcEQsR0FBRztBQUNIO01BQ0EsRUFBRSxRQUFRLEVBQUUsU0FBUyxRQUFRLENBQUMsV0FBVyxFQUFFO01BQzNDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQzFFLEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxHQUFHO01BQzlCLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO01BQzVDLEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxFQUFFLFNBQVMsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7TUFDNUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDakMsSUFBSSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7TUFDM0IsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDdEMsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRTtNQUM3QyxRQUFRLFdBQVcsR0FBRyxLQUFLLENBQUM7TUFDNUIsUUFBUSxPQUFPLEtBQUss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
