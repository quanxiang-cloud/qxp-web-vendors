System.register(['@one-for-all/artery-utils'], (function (exports) {
  'use strict';
  var byArbitrary$1;
  return {
    setters: [function (module) {
      byArbitrary$1 = module.byArbitrary;
    }],
    execute: (function () {

      exports({
        _appendTo: _appendTo,
        _insertChildAt: _insertChildAt,
        _insertLeftSiblingTo: _insertLeftSiblingTo,
        _insertRightSiblingTo: _insertRightSiblingTo,
        _prependTo: _prependTo,
        ancestors: ancestors,
        appendChild: appendChild,
        byArbitrary: byArbitrary,
        childAt: childAt,
        deleteByID: deleteByID,
        depth: depth,
        exists: exists,
        filter: filter,
        find: find,
        findNodeByID: findNodeByID,
        firstChild: firstChild,
        getChildNodeKey: getChildNodeKey,
        getFirstLevelConcreteChildren: getFirstLevelConcreteChildren,
        getNodeParentIDs: getNodeParentIDs,
        getNodeParents: getNodeParents,
        hasChildNodes: hasChildNodes,
        id: id,
        insertAfter: insertAfter,
        insertAt: insertAt,
        insertBefore: insertBefore,
        keyPathById: keyPathById,
        lastChild: lastChild,
        left: left,
        nextSibling: nextSibling,
        nodeHasChildNodes: nodeHasChildNodes,
        nodes: nodes,
        parent: parent,
        parentIdsSeq: parentIdsSeq,
        patchNode: patchNode,
        previousSibling: previousSibling,
        right: right,
        travel: travel,
        walk: walk
      });

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
        var groups = Map().asMutable();
        collection.__iterate(function (v, k) {
          groups.update(grouper.call(context, v, k, collection), 0, function (a) { return a + 1; });
        });
        return groups.asImmutable();
      }

      function groupByFactory(collection, grouper, context) {
        var isKeyedIter = isKeyed(collection);
        var groups = (isOrdered(collection) ? OrderedMap() : Map()).asMutable();
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

      function merge(collection) {
        var sources = [], len = arguments.length - 1;
        while ( len-- > 0 ) sources[ len ] = arguments[ len + 1 ];

        return mergeWithSources(collection, sources);
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

      var Map = /*@__PURE__*/(function (KeyedCollection) {
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

      Map.isMap = isMap;

      var MapPrototype = Map.prototype;
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
      }(Map));

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

      var Set = /*@__PURE__*/(function (SetCollection) {
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

      Set.isSet = isSet;

      var SetPrototype = Set.prototype;
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
          return Map(this.toKeyedSeq());
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
          return Set(isKeyed(this) ? this.valueSeq() : this);
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
      }(Set));

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

      // Note: Iterable is deprecated
      var Iterable = Collection;

      function exists(value) {
        return value !== null && typeof value !== 'undefined';
      }

      function getChildNodeKey(node) {
        const nodeType = node.getIn(['type']);
        if (nodeType === 'jsx-node' || nodeType === 'ref-node') {
          return;
        }

        if (nodeType === 'composed-node') {
          return 'nodes';
        }

        if (nodeType === 'loop-container' || nodeType === 'route-node') {
          return 'node';
        }

        return 'children';
      }

      // type WalkIterator<T, StopValue = unknown> = (
      //   accumulator: T | undefined,
      //   keyPath: Seq.Indexed<string | number>,
      //   stop: (value: StopValue) => StopValue,
      // ) => T;

      function walk(node, iterator) {
        let stack = Stack.of(Seq([]));
        let reduction;
        let stopped = false;
        function stop(v) {
          stopped = true;
          return v;
        }

        while (!stopped && stack.size > 0) {
          const keyPath = stack.first();

          stack = stack.shift();

          if (!keyPath) {
            continue;
          }

          reduction = iterator(reduction, keyPath, stop);
          const nodeChildrenKey = getChildNodeKey(node.getIn(keyPath));
          if (!nodeChildrenKey) {
            continue;
          }

          const childNodes = node.getIn(keyPath.concat(nodeChildrenKey));
          if (!childNodes) {
            continue;
          }

          if (childNodes.isEmpty()) {
            continue;
          }

          if (Array.isArray(childNodes.toJS())) {
            childNodes.keySeq().forEach((i) => {
              stack = stack.unshift(keyPath.concat([nodeChildrenKey, i]));
            });
            continue;
          }

          stack = stack.unshift(keyPath.concat(nodeChildrenKey));
        }

        return reduction;
      }

      function find(node, comparator) {
        return walk(node, (_, keyPath, stop) => {
          if (comparator(node.getIn(keyPath), keyPath)) {
            return stop(keyPath);
          }

          return;
        });
      }

      function keyPathById(node, id) {
        return find(node, (childNode) => childNode.getIn(['id']) === id);
      }

      function byArbitrary(node, idOrKeyPath) {
        if (Seq.isSeq(idOrKeyPath)) {
          return idOrKeyPath;
        }

        return keyPathById(node, idOrKeyPath);
      }

      function _appendTo(root, parentIdOrKeyPath, node) {
        const parentKeyPath = byArbitrary(root, parentIdOrKeyPath);
        if (!parentKeyPath) {
          return;
        }

        const parentNode = root.getIn(parentKeyPath);
        const childNodeKey = getChildNodeKey(parentNode);
        const childrenKeyPath = parentKeyPath.concat([childNodeKey]);
        if (childNodeKey === 'node') {
          return root.setIn(root, childrenKeyPath, node);
        }

        const childrenNodes = root.getIn(childrenKeyPath) || List();
        return root.setIn(childrenKeyPath, childrenNodes.push(node));
      }

      function _insertChildAt(root, parentIdOrKeyPath, index, node) {
        const _parentIdOrKeyPath = byArbitrary$1(root, parentIdOrKeyPath);
        if (!_parentIdOrKeyPath) {
          return;
        }

        const parentNode = root.getIn(_parentIdOrKeyPath);
        const childNodeKey = getChildNodeKey(parentNode);
        const childrenKeyPath = _parentIdOrKeyPath.concat([childNodeKey]);
        if (childNodeKey === 'node') {
          return root.setIn(root, childrenKeyPath, node);
        }

        const childrenNodes = root.getIn(childrenKeyPath) || List();
        const leftSideNodes = childrenNodes.slice(0, index);
        const rightSideNodes = childrenNodes.slice(index);

        const allChildrenNodes = leftSideNodes.concat([node], rightSideNodes);
        return root.setIn(childrenKeyPath, allChildrenNodes);
      }

      function parent(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);

        if (!keyPath || !keyPath.size) {
          return;
        }

        if (typeof keyPath.last() === 'number') {
          return keyPath.slice(0, -2);
        }

        return keyPath.slice(0, -1);
      }

      function _insertLeftSiblingTo(root, idOrKeyPath, node) {
        const referenceKeyPath = byArbitrary(root, idOrKeyPath);
        if (!referenceKeyPath) {
          return;
        }

        const referenceNodeIndex = referenceKeyPath.last();
        if (typeof referenceNodeIndex !== 'number') {
          return;
        }

        const parentKeyPath = parent(root, referenceKeyPath);
        return _insertChildAt(root, parentKeyPath, referenceNodeIndex, node);
      }

      function _insertRightSiblingTo(root, idOrKeyPath, node) {
        const referenceKeyPath = byArbitrary(root, idOrKeyPath);
        if (!referenceKeyPath) {
          return;
        }

        const referenceNodeIndex = referenceKeyPath.last();
        if (typeof referenceNodeIndex !== 'number') {
          return;
        }

        const parentKeyPath = parent(root, referenceKeyPath);
        return _insertChildAt(root, parentKeyPath, referenceNodeIndex + 1, node);
      }

      function _prependTo(root, parentIdOrKeyPath, node) {
        const parentKeyPath = byArbitrary(root, parentIdOrKeyPath);
        if (!parentKeyPath) {
          return;
        }

        const parentNode = root.getIn(parentKeyPath);
        const childNodeKey = getChildNodeKey(parentNode);
        const childrenKeyPath = parentKeyPath.concat([childNodeKey]);
        if (childNodeKey === 'node') {
          return root.setIn(root, childrenKeyPath, node);
        }

        const childrenNodes = root.getIn(childrenKeyPath) || List();
        return root.setIn(childrenKeyPath, [node].concat(childrenNodes));
      }

      /**
       * @id TreeUtils-ancestors
       * @lookup ancestors
       *
       * #### *method* ancestors()
       *
       * ###### Signature:
       * ```js
       * ancestors(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>,
       * ): Immutable.Seq<string|number>
       * ```
       *
       * ###### Returns:
       * An >Immutable.List of all key paths that point at direct ancestors of the node at `idOrKeyPath`.
       */
      function ancestors(node, idOrKeyPath) {
        let keyPath = byArbitrary(node, idOrKeyPath);
        if (!keyPath) {
          return;
        }

        let list = List();

        while (keyPath.size) {
          keyPath = parent(node, keyPath);
          list = list.push(keyPath);
        }

        return list;
      }

      function childAt(node, idOrKeyPath, index) {
        const keyPath = byArbitrary(node, idOrKeyPath);

        if (!node.getIn(keyPath)) {
          return;
        }

        const childNodeKey = getChildNodeKey(node.getIn(keyPath));
        if (!childNodeKey) {
          return;
        }

        const _keyPath = keyPath.concat([childNodeKey, index]);
        if (node.hasIn(_keyPath)) {
          return _keyPath;
        }
      }

      /**
       * @id TreeUtils-depth
       * @lookup depth
       *
       * #### *method* depth()
       *
       * ###### Signature:
       * ```js
       * depth(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>,
       * ): number
       * ```
       *
       * ###### Returns:
       * A numeric representation of the depth of the node at `idOrKeyPath`
       */
      function depth(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);

        if (!keyPath) {
          return;
        }

        // call filter will not preserve the seq size
        // https://immutable-js.com/docs/v3.8.2/Seq/#size
        return Math.floor(keyPath.filter((v) => typeof v !== 'number').toJS().length);
      }

      function filter(node, comparator) {
        let res = List();
        walk(node, (_, keyPath) => {
          if (comparator(node.getIn(keyPath), keyPath)) {
            res = res.push(keyPath);
            return;
          }

          return;
        });

        return res;
      }

      /**
       * @id TreeUtils-firstChild
       * @lookup firstChild
       *
       * #### *method* firstChild()
       *
       * ###### Signature:
       * ```js
       * firstChild(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>
       * ): Immutable.Seq<string|number>
       * ```
       *
       * ###### Returns:
       * Returns the first child node of the node at `idOrKeyPath`
       */
      function firstChild(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);

        const subNode = node.getIn(keyPath);
        if (!subNode) {
          return;
        }

        const childNodeKey = getChildNodeKey(subNode);
        if (!childNodeKey) {
          return;
        }

        if (childNodeKey === 'node' && node.hasIn(keyPath.concat(['node']))) {
          return keyPath.concat(['node']);
        }

        if (node.hasIn(keyPath.concat([childNodeKey, 0]))) {
          return keyPath.concat([childNodeKey, 0]);
        }

        return;
      }

      function getFirstLevelConcreteChildren(parent) {
        const childrenKey = getChildNodeKey(parent);
        if (!childrenKey) {
          return [];
        }

        if (childrenKey === 'node') {
          const childNodeType = parent.getIn([childrenKey, 'type']);
          if (childNodeType === 'html-element' || childNodeType === 'react-component') {
            return [parent.getIn([childrenKey])]
          }

          return getFirstLevelConcreteChildren(parent.getIn([childrenKey]));
        }

        const children = parent.getIn([childrenKey]);
        const concreteNode = [];
        (children ||[]).forEach((child) => {
          const childNodeType = child.getIn(['type']);
          if (childNodeType === 'html-element' || childNodeType === 'react-component') {
            concreteNode.push(child);
            return;
          }

          concreteNode.push(...getFirstLevelConcreteChildren(child));
        });

        return concreteNode;
      }

      /**
       * @id TreeUtils-hasChildNodes
       * @lookup hasChildNodes
       *
       * #### *method* hasChildNodes()
       *
       * ###### Signature:
       * ```js
       * hasChildNodes(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>,
       * ): boolean
       * ```
       *
       * ###### Returns:
       * Returns whether the node at `idOrKeyPath` has children.
       */
      function hasChildNodes(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);

        if (!node.hasIn(keyPath)) {
          return false;
        }

        const childKey = getChildNodeKey(node.getIn(keyPath));
        if (!childKey) {
          return false;
        }

        const childrenNodes = node.getIn(keyPath.concat([childKey]));

        return exists(childrenNodes) && childrenNodes.size > 0;
      }

      /**
       *
       * @param {ImmutableNode} node
       * @param {Seq.Indexed<string>} keyPath
       * @returns node id or undefined
       */
      function id(node, keyPath) {
        if (!node.getIn(keyPath)) {
          return;
        }

        return node.getIn(keyPath.concat(['id']));
      }

      /**
       * @id TreeUtils-lastChild
       * @lookup lastChild
       *
       * #### *method* lastChild()
       *
       * ###### Signature:
       * ```js
       * lastChild(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>
       * ): Immutable.Seq<string|number>
       * ```
       *
       * ###### Returns:
       * Returns the last child node of the node at `idOrKeyPath`
       */
      function lastChild(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);

        const childNode = node.getIn(keyPath);
        if (!childNode) {
          return;
        }

        const childNodeKey = getChildNodeKey(childNode);
        if (!childNodeKey) {
          return;
        }

        if (childNodeKey === 'node' && node.hasIn(keyPath.concat([node]))) {
          return node.getIn(keyPath.concat([node]));
        }

        var item = node.getIn(keyPath.concat([childNodeKey]));
        if (item && item.size > 0) {
          return keyPath.concat([childNodeKey]).concat([item.size - 1]);
        }
        return;
      }

      /**
       * @id TreeUtils-previousSibling
       * @lookup previousSibling
       *
       * #### *method* previousSibling()
       *
       * ###### Signature:
       * ```js
       * previousSibling(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>
       * ): Immutable.Seq<string|number>
       * ```
       *
       * ###### Returns:
       * Returns the previous sibling node of the node at `idOrKeyPath`
       */
      function previousSibling(state, idOrKeyPath) {
        const keyPath = byArbitrary(state, idOrKeyPath);
        const index = Number(keyPath.last());
        if (isNaN(index) || index === 0) {
          return;
        }

        return keyPath.skipLast(1).concat([index - 1]);
      }

      /**
       * @id TreeUtils-left
       * @lookup left
       *
       * #### *method* left()
       *
       * Returns the key path to the next node to the left. The next left node is either:
       * * The last descendant of the previous sibling node.
       * * The previous sibling node.
       * * The parent node.
       * * The none value
       *
       * ```js
       * var nodePath = treeUtils.lastDescendant(state, 'root');
       * while (nodePath) {
       *    console.log(nodePath);
       *    nodePath = treeUtils.left(state, nodePath);
       * }
       * // 'node-6'
       * // 'node-5'
       * // 'node-4'
       * // 'node-3'
       * // 'node-2'
       * // 'node-1'
       * // 'root'
       * ```
       *
       *
       * ###### Signature:
       * ```js
       * left(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>,
       * ): Immutable.Seq<string|number>
       * ```
       *
       * ###### Returns:
       * Returns the key path to the node to the right of the one at `idOrKeyPath`.
       */
      function left(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);
        let lastChildPath = previousSibling(node, keyPath);

        while (lastChildPath) {
          if (!hasChildNodes(node, lastChildPath)) {
            return lastChildPath;
          }
          lastChildPath = lastChild(node, lastChildPath);
        }

        const parentPath = parent(node, keyPath);

        if (parentPath && parentPath.size) {
          return parentPath;
        }

        return;
      }

      /**
       * @id TreeUtils-nextSibling
       * @lookup nextSibling
       *
       * #### *method* nextSibling()
       *
       * ###### Signature:
       * ```js
       * nextSibling(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>
       * ): Immutable.Seq<string|number>
       * ```
       *
       * ###### Returns:
       * Returns the next sibling node of the node at `idOrKeyPath`
       */
      function nextSibling(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);
        const index = Number(keyPath.last());
        if (isNaN(index)) {
          return;
        }

        const nextSiblingPath = keyPath.skipLast(1).concat(index + 1);
        if (node.hasIn(nextSiblingPath)) {
          return nextSiblingPath;
        }
        return;
      }

      /**
       * @id TreeUtils-hasChildNodes
       * @lookup hasChildNodes
       *
       * #### *method* hasChildNodes()
       *
       * ###### Signature:
       * ```js
       * hasChildNodes(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>,
       * ): boolean
       * ```
       *
       * ###### Returns:
       * Returns whether the node at `idOrKeyPath` has children.
       */
      function nodeHasChildNodes(node) {
        const childKey = getChildNodeKey(node);
        if (!childKey) {
          return false;
        }

        const childrenNodes = node.getIn([childKey]);

        return exists(childrenNodes) && childrenNodes.size > 0;
      }

      function nodes(node) {
        const nodeKeyPaths = walk(node, (acc, keyPath) => {
          return List.isList(acc) ? acc.push(keyPath) : List.of(keyPath);
        });

        return nodeKeyPaths ? nodeKeyPaths : List.of();
      }

      function parentIdsSeq(node, idOrKeyPath) {
        let keyPath = byArbitrary(node, idOrKeyPath);
        if (!keyPath) {
          return;
        }

        let idPath = Seq.Indexed();
        while (keyPath.size) {
          keyPath = parent(node, keyPath);
          idPath = idPath.concat([node.getIn(keyPath.concat(['id']))]);
        }

        return idPath.reverse();
      }

      /**
       * @id TreeUtils-right
       * @lookup right
       *
       * #### *method* right()
       *
       * Returns the key path to the next node to the right. The next right node is either:
       * * The first child node.
       * * The next sibling.
       * * The next sibling of the first ancestor that in fact has a next sibling.
       * * The none value
       *
       * ```js
       * var nodePath = treeUtils.byId(state, 'root');
       * while (nodePath) {
       *    console.log(nodePath);
       *    nodePath = treeUtils.right(state, nodePath);
       * }
       * // 'root'
       * // 'node-1'
       * // 'node-2'
       * // 'node-3'
       * // 'node-4'
       * // 'node-5'
       * // 'node-6'
       * ```
       *
       * ###### Signature:
       * ```js
       * right(
       *    state: Immutable.Iterable,
       *    idOrKeyPath: string|Immutable.Seq<string|number>,
       * ): Immutable.Seq<string|number>
       * ```
       *
       * ###### Returns:
       * Returns the key path to the node to the right of the one at `idOrKeyPath`.
       */
      function right(node, idOrKeyPath) {
        const keyPath = byArbitrary(node, idOrKeyPath);
        const firstChildPath = firstChild(node, keyPath);

        if (firstChildPath) {
          return firstChildPath;
        }

        const nextSiblingPath = nextSibling(node, keyPath);
        if (nextSiblingPath) {
          return nextSiblingPath;
        }

        let parentPath = parent(node, keyPath);
        let nextSiblingOfParent;

        while (parentPath && parentPath.size >= 0) {
          nextSiblingOfParent = nextSibling(node, parentPath);
          if (nextSiblingOfParent) {
            return nextSiblingOfParent;
          }
          parentPath = parent(node, parentPath);
        }

        return;
      }

      function appendChild(schemaNode, parentID, child) {
        let node = fromJS(schemaNode);
        const keyPath = keyPathById(node, parentID);
        if (!keyPath) {
          return;
        }

        const parentNode = node.getIn(keyPath);
        if (!parentNode) {
          return;
        }

        const childNodeKey = getChildNodeKey(parentNode);
        if (!childNodeKey) {
          return;
        }

        if (childNodeKey === 'node') {
          return setIn$1(node, keyPath.concat([childNodeKey]), child).toJS();
        }

        const childrenKeyPath = keyPath.concat([childNodeKey]);
        if (!hasChildNodes(node, keyPath)) {
          node = setIn$1(node, childrenKeyPath, []);
        }

        const item = node.getIn(childrenKeyPath);
        const size = Iterable.isIterable(item) ? item.size : item.length;

        return node.setIn(childrenKeyPath.concat([size]), child).toJS();
      }

      function deleteByID(schemaNode, id) {
        const node = fromJS(schemaNode);
        const keyPath = keyPathById(node, id);
        if (!keyPath) {
          return schemaNode;
        }

        return removeIn(node, keyPath).toJS();
      }

      function findNodeByID(schemaNode, id) {
        const node = fromJS(schemaNode);
        const keyPath = keyPathById(node, id);
        if (!keyPath) {
          return;
        }

        return node.getIn(keyPath).toJS();
      }

      function getNodeParentIDs(schemaNode, nodeID) {
        const node = fromJS(schemaNode);

        const ids = parentIdsSeq(node, nodeID);

        return Seq.isSeq(ids) ? ids.toJS() : undefined;
      }

      function getNodeParents(schemaNode, id) {
        const parentIDs = getNodeParentIDs(schemaNode, id);
        if (!parentIDs) {
          return;
        }

        return parentIDs.map((parentID) => findNodeByID(schemaNode, parentID));
      }

      function patchNode(schemaNode, partialNode) {
        const node = fromJS(schemaNode);
        const keyPath = keyPathById(node, partialNode.id);
        if (!keyPath) {
          return;
        }

        const nodeToPatch = node.getIn(keyPath);
        if (!nodeToPatch) {
          return;
        }

        return node.setIn(keyPath, merge(nodeToPatch, partialNode)).toJS();
      }

      const NODE_TYPE_TRAVELER_MAP = {
        'html-element': 'htmlNode',
        'react-component': 'reactComponentNode',
        'loop-container': 'loopContainerNode',
        'composed-node': 'composedNode',
        'ref-node': 'refNode',
        'jsx-node': 'jsxNode',
        'route-node': 'routeNode',
      };

      function travel(schemaNode, Visitors) {
        const node = fromJS(schemaNode);
        const _newRoot = walk(node, (newRoot, keyPath) => {
          if (!newRoot) {
            newRoot = node;
          }

          const nodeType = node.getIn(keyPath.concat(['type']));
          const currentNode = node.getIn(keyPath).toJS();
          const newNode = Visitors[NODE_TYPE_TRAVELER_MAP[nodeType]]?.(currentNode);
          if (newNode !== undefined) {
            newRoot = newRoot.setIn(keyPath, newNode);
            if (!isImmutable(newRoot)) {
              newRoot = Map(newRoot);
            }
          }

          return newRoot;
        });

        return _newRoot.toJS();
      }

      function insertAt$1(root, parentNodeID, index, node) {
        const parentKeyPath = keyPathById(root, parentNodeID);
        if (!parentKeyPath) {
          return;
        }

        const parentNode = root.getIn(parentKeyPath);
        const childNodeKey = getChildNodeKey(parentNode);
        const childrenKeyPath = parentKeyPath.concat([childNodeKey]);
        if (childNodeKey === 'node') {
          return root.setIn(root, childrenKeyPath, node);
        }

        const childrenNodes = root.getIn(childrenKeyPath) || List();
        const leftSideNodes = childrenNodes.slice(0, index);
        const rightSideNodes = childrenNodes.slice(index);

        const allChildrenNodes = leftSideNodes.concat([node], rightSideNodes);
        return root.setIn(childrenKeyPath, allChildrenNodes);
      }

      function insertBefore(root, referenceNodeID, node) {
        let _root = fromJS(root);

        const referenceNodeKeyPath = keyPathById(_root, referenceNodeID);
        if (!referenceNodeKeyPath) {
          return;
        }

        const referenceNodeIndex = referenceNodeKeyPath.last();
        const parentKeyPath = parent(_root, referenceNodeID);
        const parentNodeID = _root.getIn(parentKeyPath.concat(['id']));
        _root = insertAt$1(_root, parentNodeID, referenceNodeIndex, node);

        if (!_root) {
          return;
        }

        return _root.toJS();
      }

      function insertAfter(root, referenceNodeID, node) {
        let _root = fromJS(root);

        const referenceNodeKeyPath = keyPathById(_root, referenceNodeID);
        if (!referenceNodeKeyPath) {
          return;
        }

        const referenceNodeIndex = referenceNodeKeyPath.last();
        const parentKeyPath = parent(_root, referenceNodeID);
        const parentNodeID = _root.getIn(parentKeyPath.concat(['id']));

        _root = insertAt$1(_root, parentNodeID, referenceNodeIndex + 1, node);

        if (!_root) {
          return;
        }

        return _root.toJS();
      }

      function insertAt(root, parentNodeID, index, node) {
        let _root = fromJS(root);

        _root = insertAt$1(_root, parentNodeID, index, node);
        if (!_root) {
          return;
        }

        return _root.toJS();
      }

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9pbW11dGFibGVANC4wLjAvbm9kZV9tb2R1bGVzL2ltbXV0YWJsZS9kaXN0L2ltbXV0YWJsZS5lcy5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvdXRpbHMuanMiLCIuLi8uLi8uLi9zcmMvcmF3L3dhbGsuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2ZpbmQuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2tleVBhdGhCeUlkLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9ieUFyYml0cmFyeS5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvX2FwcGVuZFRvLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9faW5zZXJ0Q2hpbGRBdC5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvcGFyZW50LmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9faW5zZXJ0TGVmdFNpYmxpbmdUby5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvX2luc2VydFJpZ2h0U2libGluZ1RvLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9fcHJlcGVuZFRvLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9hbmNlc3RvcnMuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2NoaWxkQXQuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2RlcHRoLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9maWx0ZXIuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2ZpcnN0Q2hpbGQuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2dldEZpcnN0TGV2ZWxDb25jcmV0ZUNoaWxkcmVuLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9oYXNDaGlsZE5vZGVzLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9pZC5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvbGFzdENoaWxkLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9wcmV2aW91c1NpYmxpbmcuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2xlZnQuanMiLCIuLi8uLi8uLi9zcmMvcmF3L25leHRTaWJsaW5nLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9ub2RlSGFzQ2hpbGROb2Rlcy5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvbm9kZXMuanMiLCIuLi8uLi8uLi9zcmMvcmF3L3BhcmVudElkc1NlcS5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvcmlnaHQuanMiLCIuLi8uLi8uLi9zcmMvYXBwZW5kQ2hpbGQuanMiLCIuLi8uLi8uLi9zcmMvZGVsZXRlQnlJRC5qcyIsIi4uLy4uLy4uL3NyYy9maW5kTm9kZUJ5SUQuanMiLCIuLi8uLi8uLi9zcmMvZ2V0Tm9kZVBhcmVudElEcy5qcyIsIi4uLy4uLy4uL3NyYy9nZXROb2RlUGFyZW50cy5qcyIsIi4uLy4uLy4uL3NyYy9wYXRjaE5vZGUuanMiLCIuLi8uLi8uLi9zcmMvdHJhdmVsLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9pbnNlcnRBdC5qcyIsIi4uLy4uLy4uL3NyYy9pbnNlcnRCZWZvcmUuanMiLCIuLi8uLi8uLi9zcmMvaW5zZXJ0QWZ0ZXIuanMiLCIuLi8uLi8uLi9zcmMvaW5zZXJ0QXQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBNSVQgTGljZW5zZVxuICogXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTQtcHJlc2VudCwgTGVlIEJ5cm9uIGFuZCBvdGhlciBjb250cmlidXRvcnMuXG4gKiBcbiAqIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbiAqIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbiAqIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbiAqIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbiAqIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuICogZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbiAqIFxuICogVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW4gYWxsXG4gKiBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuICogXG4gKiBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTIE9SXG4gKiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWSxcbiAqIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOIE5PIEVWRU5UIFNIQUxMIFRIRVxuICogQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSwgREFNQUdFUyBPUiBPVEhFUlxuICogTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUiBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSxcbiAqIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRSBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFXG4gKiBTT0ZUV0FSRS5cbiAqL1xudmFyIERFTEVURSA9ICdkZWxldGUnO1xuXG4vLyBDb25zdGFudHMgZGVzY3JpYmluZyB0aGUgc2l6ZSBvZiB0cmllIG5vZGVzLlxudmFyIFNISUZUID0gNTsgLy8gUmVzdWx0ZWQgaW4gYmVzdCBwZXJmb3JtYW5jZSBhZnRlciBfX19fX18/XG52YXIgU0laRSA9IDEgPDwgU0hJRlQ7XG52YXIgTUFTSyA9IFNJWkUgLSAxO1xuXG4vLyBBIGNvbnNpc3RlbnQgc2hhcmVkIHZhbHVlIHJlcHJlc2VudGluZyBcIm5vdCBzZXRcIiB3aGljaCBlcXVhbHMgbm90aGluZyBvdGhlclxuLy8gdGhhbiBpdHNlbGYsIGFuZCBub3RoaW5nIHRoYXQgY291bGQgYmUgcHJvdmlkZWQgZXh0ZXJuYWxseS5cbnZhciBOT1RfU0VUID0ge307XG5cbi8vIEJvb2xlYW4gcmVmZXJlbmNlcywgUm91Z2ggZXF1aXZhbGVudCBvZiBgYm9vbCAmYC5cbmZ1bmN0aW9uIE1ha2VSZWYoKSB7XG4gIHJldHVybiB7IHZhbHVlOiBmYWxzZSB9O1xufVxuXG5mdW5jdGlvbiBTZXRSZWYocmVmKSB7XG4gIGlmIChyZWYpIHtcbiAgICByZWYudmFsdWUgPSB0cnVlO1xuICB9XG59XG5cbi8vIEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhIHZhbHVlIHJlcHJlc2VudGluZyBhbiBcIm93bmVyXCIgZm9yIHRyYW5zaWVudCB3cml0ZXNcbi8vIHRvIHRyaWVzLiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgb25seSBldmVyIGVxdWFsIGl0c2VsZiwgYW5kIHdpbGwgbm90IGVxdWFsXG4vLyB0aGUgcmV0dXJuIG9mIGFueSBzdWJzZXF1ZW50IGNhbGwgb2YgdGhpcyBmdW5jdGlvbi5cbmZ1bmN0aW9uIE93bmVySUQoKSB7fVxuXG5mdW5jdGlvbiBlbnN1cmVTaXplKGl0ZXIpIHtcbiAgaWYgKGl0ZXIuc2l6ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaXRlci5zaXplID0gaXRlci5fX2l0ZXJhdGUocmV0dXJuVHJ1ZSk7XG4gIH1cbiAgcmV0dXJuIGl0ZXIuc2l6ZTtcbn1cblxuZnVuY3Rpb24gd3JhcEluZGV4KGl0ZXIsIGluZGV4KSB7XG4gIC8vIFRoaXMgaW1wbGVtZW50cyBcImlzIGFycmF5IGluZGV4XCIgd2hpY2ggdGhlIEVDTUFTdHJpbmcgc3BlYyBkZWZpbmVzIGFzOlxuICAvL1xuICAvLyAgICAgQSBTdHJpbmcgcHJvcGVydHkgbmFtZSBQIGlzIGFuIGFycmF5IGluZGV4IGlmIGFuZCBvbmx5IGlmXG4gIC8vICAgICBUb1N0cmluZyhUb1VpbnQzMihQKSkgaXMgZXF1YWwgdG8gUCBhbmQgVG9VaW50MzIoUCkgaXMgbm90IGVxdWFsXG4gIC8vICAgICB0byAyXjMy4oiSMS5cbiAgLy9cbiAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLWFycmF5LWV4b3RpYy1vYmplY3RzXG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgdmFyIHVpbnQzMkluZGV4ID0gaW5kZXggPj4+IDA7IC8vIE4gPj4+IDAgaXMgc2hvcnRoYW5kIGZvciBUb1VpbnQzMlxuICAgIGlmICgnJyArIHVpbnQzMkluZGV4ICE9PSBpbmRleCB8fCB1aW50MzJJbmRleCA9PT0gNDI5NDk2NzI5NSkge1xuICAgICAgcmV0dXJuIE5hTjtcbiAgICB9XG4gICAgaW5kZXggPSB1aW50MzJJbmRleDtcbiAgfVxuICByZXR1cm4gaW5kZXggPCAwID8gZW5zdXJlU2l6ZShpdGVyKSArIGluZGV4IDogaW5kZXg7XG59XG5cbmZ1bmN0aW9uIHJldHVyblRydWUoKSB7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiB3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHNpemUpIHtcbiAgcmV0dXJuIChcbiAgICAoKGJlZ2luID09PSAwICYmICFpc05lZyhiZWdpbikpIHx8XG4gICAgICAoc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGJlZ2luIDw9IC1zaXplKSkgJiZcbiAgICAoZW5kID09PSB1bmRlZmluZWQgfHwgKHNpemUgIT09IHVuZGVmaW5lZCAmJiBlbmQgPj0gc2l6ZSkpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSkge1xuICByZXR1cm4gcmVzb2x2ZUluZGV4KGJlZ2luLCBzaXplLCAwKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUVuZChlbmQsIHNpemUpIHtcbiAgcmV0dXJuIHJlc29sdmVJbmRleChlbmQsIHNpemUsIHNpemUpO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlSW5kZXgoaW5kZXgsIHNpemUsIGRlZmF1bHRJbmRleCkge1xuICAvLyBTYW5pdGl6ZSBpbmRpY2VzIHVzaW5nIHRoaXMgc2hvcnRoYW5kIGZvciBUb0ludDMyKGFyZ3VtZW50KVxuICAvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNi4wLyNzZWMtdG9pbnQzMlxuICByZXR1cm4gaW5kZXggPT09IHVuZGVmaW5lZFxuICAgID8gZGVmYXVsdEluZGV4XG4gICAgOiBpc05lZyhpbmRleClcbiAgICA/IHNpemUgPT09IEluZmluaXR5XG4gICAgICA/IHNpemVcbiAgICAgIDogTWF0aC5tYXgoMCwgc2l6ZSArIGluZGV4KSB8IDBcbiAgICA6IHNpemUgPT09IHVuZGVmaW5lZCB8fCBzaXplID09PSBpbmRleFxuICAgID8gaW5kZXhcbiAgICA6IE1hdGgubWluKHNpemUsIGluZGV4KSB8IDA7XG59XG5cbmZ1bmN0aW9uIGlzTmVnKHZhbHVlKSB7XG4gIC8vIEFjY291bnQgZm9yIC0wIHdoaWNoIGlzIG5lZ2F0aXZlLCBidXQgbm90IGxlc3MgdGhhbiAwLlxuICByZXR1cm4gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPT09IC1JbmZpbml0eSk7XG59XG5cbnZhciBJU19DT0xMRUNUSU9OX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX0lURVJBQkxFX19AQCc7XG5cbmZ1bmN0aW9uIGlzQ29sbGVjdGlvbihtYXliZUNvbGxlY3Rpb24pIHtcbiAgcmV0dXJuIEJvb2xlYW4obWF5YmVDb2xsZWN0aW9uICYmIG1heWJlQ29sbGVjdGlvbltJU19DT0xMRUNUSU9OX1NZTUJPTF0pO1xufVxuXG52YXIgSVNfS0VZRURfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfS0VZRURfX0BAJztcblxuZnVuY3Rpb24gaXNLZXllZChtYXliZUtleWVkKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlS2V5ZWQgJiYgbWF5YmVLZXllZFtJU19LRVlFRF9TWU1CT0xdKTtcbn1cblxudmFyIElTX0lOREVYRURfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfSU5ERVhFRF9fQEAnO1xuXG5mdW5jdGlvbiBpc0luZGV4ZWQobWF5YmVJbmRleGVkKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlSW5kZXhlZCAmJiBtYXliZUluZGV4ZWRbSVNfSU5ERVhFRF9TWU1CT0xdKTtcbn1cblxuZnVuY3Rpb24gaXNBc3NvY2lhdGl2ZShtYXliZUFzc29jaWF0aXZlKSB7XG4gIHJldHVybiBpc0tleWVkKG1heWJlQXNzb2NpYXRpdmUpIHx8IGlzSW5kZXhlZChtYXliZUFzc29jaWF0aXZlKTtcbn1cblxudmFyIENvbGxlY3Rpb24gPSBmdW5jdGlvbiBDb2xsZWN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiBpc0NvbGxlY3Rpb24odmFsdWUpID8gdmFsdWUgOiBTZXEodmFsdWUpO1xufTtcblxudmFyIEtleWVkQ29sbGVjdGlvbiA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gS2V5ZWRDb2xsZWN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzS2V5ZWQodmFsdWUpID8gdmFsdWUgOiBLZXllZFNlcSh2YWx1ZSk7XG4gIH1cblxuICBpZiAoIENvbGxlY3Rpb24gKSBLZXllZENvbGxlY3Rpb24uX19wcm90b19fID0gQ29sbGVjdGlvbjtcbiAgS2V5ZWRDb2xsZWN0aW9uLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGUgKTtcbiAgS2V5ZWRDb2xsZWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEtleWVkQ29sbGVjdGlvbjtcblxuICByZXR1cm4gS2V5ZWRDb2xsZWN0aW9uO1xufShDb2xsZWN0aW9uKSk7XG5cbnZhciBJbmRleGVkQ29sbGVjdGlvbiA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gSW5kZXhlZENvbGxlY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gaXNJbmRleGVkKHZhbHVlKSA/IHZhbHVlIDogSW5kZXhlZFNlcSh2YWx1ZSk7XG4gIH1cblxuICBpZiAoIENvbGxlY3Rpb24gKSBJbmRleGVkQ29sbGVjdGlvbi5fX3Byb3RvX18gPSBDb2xsZWN0aW9uO1xuICBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIEluZGV4ZWRDb2xsZWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEluZGV4ZWRDb2xsZWN0aW9uO1xuXG4gIHJldHVybiBJbmRleGVkQ29sbGVjdGlvbjtcbn0oQ29sbGVjdGlvbikpO1xuXG52YXIgU2V0Q29sbGVjdGlvbiA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gU2V0Q29sbGVjdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBpc0NvbGxlY3Rpb24odmFsdWUpICYmICFpc0Fzc29jaWF0aXZlKHZhbHVlKSA/IHZhbHVlIDogU2V0U2VxKHZhbHVlKTtcbiAgfVxuXG4gIGlmICggQ29sbGVjdGlvbiApIFNldENvbGxlY3Rpb24uX19wcm90b19fID0gQ29sbGVjdGlvbjtcbiAgU2V0Q29sbGVjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIFNldENvbGxlY3Rpb24ucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2V0Q29sbGVjdGlvbjtcblxuICByZXR1cm4gU2V0Q29sbGVjdGlvbjtcbn0oQ29sbGVjdGlvbikpO1xuXG5Db2xsZWN0aW9uLktleWVkID0gS2V5ZWRDb2xsZWN0aW9uO1xuQ29sbGVjdGlvbi5JbmRleGVkID0gSW5kZXhlZENvbGxlY3Rpb247XG5Db2xsZWN0aW9uLlNldCA9IFNldENvbGxlY3Rpb247XG5cbnZhciBJU19TRVFfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfU0VRX19AQCc7XG5cbmZ1bmN0aW9uIGlzU2VxKG1heWJlU2VxKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlU2VxICYmIG1heWJlU2VxW0lTX1NFUV9TWU1CT0xdKTtcbn1cblxudmFyIElTX1JFQ09SRF9TWU1CT0wgPSAnQEBfX0lNTVVUQUJMRV9SRUNPUkRfX0BAJztcblxuZnVuY3Rpb24gaXNSZWNvcmQobWF5YmVSZWNvcmQpIHtcbiAgcmV0dXJuIEJvb2xlYW4obWF5YmVSZWNvcmQgJiYgbWF5YmVSZWNvcmRbSVNfUkVDT1JEX1NZTUJPTF0pO1xufVxuXG5mdW5jdGlvbiBpc0ltbXV0YWJsZShtYXliZUltbXV0YWJsZSkge1xuICByZXR1cm4gaXNDb2xsZWN0aW9uKG1heWJlSW1tdXRhYmxlKSB8fCBpc1JlY29yZChtYXliZUltbXV0YWJsZSk7XG59XG5cbnZhciBJU19PUkRFUkVEX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX09SREVSRURfX0BAJztcblxuZnVuY3Rpb24gaXNPcmRlcmVkKG1heWJlT3JkZXJlZCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZU9yZGVyZWQgJiYgbWF5YmVPcmRlcmVkW0lTX09SREVSRURfU1lNQk9MXSk7XG59XG5cbnZhciBJVEVSQVRFX0tFWVMgPSAwO1xudmFyIElURVJBVEVfVkFMVUVTID0gMTtcbnZhciBJVEVSQVRFX0VOVFJJRVMgPSAyO1xuXG52YXIgUkVBTF9JVEVSQVRPUl9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIFN5bWJvbC5pdGVyYXRvcjtcbnZhciBGQVVYX0lURVJBVE9SX1NZTUJPTCA9ICdAQGl0ZXJhdG9yJztcblxudmFyIElURVJBVE9SX1NZTUJPTCA9IFJFQUxfSVRFUkFUT1JfU1lNQk9MIHx8IEZBVVhfSVRFUkFUT1JfU1lNQk9MO1xuXG52YXIgSXRlcmF0b3IgPSBmdW5jdGlvbiBJdGVyYXRvcihuZXh0KSB7XG4gIHRoaXMubmV4dCA9IG5leHQ7XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHJldHVybiAnW0l0ZXJhdG9yXSc7XG59O1xuXG5JdGVyYXRvci5LRVlTID0gSVRFUkFURV9LRVlTO1xuSXRlcmF0b3IuVkFMVUVTID0gSVRFUkFURV9WQUxVRVM7XG5JdGVyYXRvci5FTlRSSUVTID0gSVRFUkFURV9FTlRSSUVTO1xuXG5JdGVyYXRvci5wcm90b3R5cGUuaW5zcGVjdCA9IEl0ZXJhdG9yLnByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5JdGVyYXRvci5wcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIGl0ZXJhdG9yUmVzdWx0KSB7XG4gIHZhciB2YWx1ZSA9IHR5cGUgPT09IDAgPyBrIDogdHlwZSA9PT0gMSA/IHYgOiBbaywgdl07XG4gIGl0ZXJhdG9yUmVzdWx0XG4gICAgPyAoaXRlcmF0b3JSZXN1bHQudmFsdWUgPSB2YWx1ZSlcbiAgICA6IChpdGVyYXRvclJlc3VsdCA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgIH0pO1xuICByZXR1cm4gaXRlcmF0b3JSZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIGl0ZXJhdG9yRG9uZSgpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xufVxuXG5mdW5jdGlvbiBoYXNJdGVyYXRvcihtYXliZUl0ZXJhYmxlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KG1heWJlSXRlcmFibGUpKSB7XG4gICAgLy8gSUUxMSB0cmljayBhcyBpdCBkb2VzIG5vdCBzdXBwb3J0IGBTeW1ib2wuaXRlcmF0b3JgXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gISFnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xufVxuXG5mdW5jdGlvbiBpc0l0ZXJhdG9yKG1heWJlSXRlcmF0b3IpIHtcbiAgcmV0dXJuIG1heWJlSXRlcmF0b3IgJiYgdHlwZW9mIG1heWJlSXRlcmF0b3IubmV4dCA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3IoaXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKGl0ZXJhYmxlKTtcbiAgcmV0dXJuIGl0ZXJhdG9yRm4gJiYgaXRlcmF0b3JGbi5jYWxsKGl0ZXJhYmxlKTtcbn1cblxuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihpdGVyYWJsZSkge1xuICB2YXIgaXRlcmF0b3JGbiA9XG4gICAgaXRlcmFibGUgJiZcbiAgICAoKFJFQUxfSVRFUkFUT1JfU1lNQk9MICYmIGl0ZXJhYmxlW1JFQUxfSVRFUkFUT1JfU1lNQk9MXSkgfHxcbiAgICAgIGl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpdGVyYXRvckZuO1xuICB9XG59XG5cbmZ1bmN0aW9uIGlzRW50cmllc0l0ZXJhYmxlKG1heWJlSXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xuICByZXR1cm4gaXRlcmF0b3JGbiAmJiBpdGVyYXRvckZuID09PSBtYXliZUl0ZXJhYmxlLmVudHJpZXM7XG59XG5cbmZ1bmN0aW9uIGlzS2V5c0l0ZXJhYmxlKG1heWJlSXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG1heWJlSXRlcmFibGUpO1xuICByZXR1cm4gaXRlcmF0b3JGbiAmJiBpdGVyYXRvckZuID09PSBtYXliZUl0ZXJhYmxlLmtleXM7XG59XG5cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbmZ1bmN0aW9uIGlzQXJyYXlMaWtlKHZhbHVlKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSB8fCB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIHZhbHVlICYmXG4gICAgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJlxuICAgIE51bWJlci5pc0ludGVnZXIodmFsdWUubGVuZ3RoKSAmJlxuICAgIHZhbHVlLmxlbmd0aCA+PSAwICYmXG4gICAgKHZhbHVlLmxlbmd0aCA9PT0gMFxuICAgICAgPyAvLyBPbmx5IHtsZW5ndGg6IDB9IGlzIGNvbnNpZGVyZWQgQXJyYXktbGlrZS5cbiAgICAgICAgT2JqZWN0LmtleXModmFsdWUpLmxlbmd0aCA9PT0gMVxuICAgICAgOiAvLyBBbiBvYmplY3QgaXMgb25seSBBcnJheS1saWtlIGlmIGl0IGhhcyBhIHByb3BlcnR5IHdoZXJlIHRoZSBsYXN0IHZhbHVlXG4gICAgICAgIC8vIGluIHRoZSBhcnJheS1saWtlIG1heSBiZSBmb3VuZCAod2hpY2ggY291bGQgYmUgdW5kZWZpbmVkKS5cbiAgICAgICAgdmFsdWUuaGFzT3duUHJvcGVydHkodmFsdWUubGVuZ3RoIC0gMSkpXG4gICk7XG59XG5cbnZhciBTZXEgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIFNlcSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGVtcHR5U2VxdWVuY2UoKVxuICAgICAgOiBpc0ltbXV0YWJsZSh2YWx1ZSlcbiAgICAgID8gdmFsdWUudG9TZXEoKVxuICAgICAgOiBzZXFGcm9tVmFsdWUodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBDb2xsZWN0aW9uICkgU2VxLl9fcHJvdG9fXyA9IENvbGxlY3Rpb247XG4gIFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIFNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXE7XG5cbiAgU2VxLnByb3RvdHlwZS50b1NlcSA9IGZ1bmN0aW9uIHRvU2VxICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBTZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSB7JywgJ30nKTtcbiAgfTtcblxuICBTZXEucHJvdG90eXBlLmNhY2hlUmVzdWx0ID0gZnVuY3Rpb24gY2FjaGVSZXN1bHQgKCkge1xuICAgIGlmICghdGhpcy5fY2FjaGUgJiYgdGhpcy5fX2l0ZXJhdGVVbmNhY2hlZCkge1xuICAgICAgdGhpcy5fY2FjaGUgPSB0aGlzLmVudHJ5U2VxKCkudG9BcnJheSgpO1xuICAgICAgdGhpcy5zaXplID0gdGhpcy5fY2FjaGUubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICAvLyBhYnN0cmFjdCBfX2l0ZXJhdGVVbmNhY2hlZChmbiwgcmV2ZXJzZSlcblxuICBTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgY2FjaGUgPSB0aGlzLl9jYWNoZTtcbiAgICBpZiAoY2FjaGUpIHtcbiAgICAgIHZhciBzaXplID0gY2FjaGUubGVuZ3RoO1xuICAgICAgdmFyIGkgPSAwO1xuICAgICAgd2hpbGUgKGkgIT09IHNpemUpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gY2FjaGVbcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKytdO1xuICAgICAgICBpZiAoZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9faXRlcmF0ZVVuY2FjaGVkKGZuLCByZXZlcnNlKTtcbiAgfTtcblxuICAvLyBhYnN0cmFjdCBfX2l0ZXJhdG9yVW5jYWNoZWQodHlwZSwgcmV2ZXJzZSlcblxuICBTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5fY2FjaGU7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICB2YXIgc2l6ZSA9IGNhY2hlLmxlbmd0aDtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaSA9PT0gc2l6ZSkge1xuICAgICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW50cnkgPSBjYWNoZVtyZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrK107XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvclVuY2FjaGVkKHR5cGUsIHJldmVyc2UpO1xuICB9O1xuXG4gIHJldHVybiBTZXE7XG59KENvbGxlY3Rpb24pKTtcblxudmFyIEtleWVkU2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoU2VxKSB7XG4gIGZ1bmN0aW9uIEtleWVkU2VxKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlTZXF1ZW5jZSgpLnRvS2V5ZWRTZXEoKVxuICAgICAgOiBpc0NvbGxlY3Rpb24odmFsdWUpXG4gICAgICA/IGlzS2V5ZWQodmFsdWUpXG4gICAgICAgID8gdmFsdWUudG9TZXEoKVxuICAgICAgICA6IHZhbHVlLmZyb21FbnRyeVNlcSgpXG4gICAgICA6IGlzUmVjb3JkKHZhbHVlKVxuICAgICAgPyB2YWx1ZS50b1NlcSgpXG4gICAgICA6IGtleWVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIGlmICggU2VxICkgS2V5ZWRTZXEuX19wcm90b19fID0gU2VxO1xuICBLZXllZFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXEgJiYgU2VxLnByb3RvdHlwZSApO1xuICBLZXllZFNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBLZXllZFNlcTtcblxuICBLZXllZFNlcS5wcm90b3R5cGUudG9LZXllZFNlcSA9IGZ1bmN0aW9uIHRvS2V5ZWRTZXEgKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIHJldHVybiBLZXllZFNlcTtcbn0oU2VxKSk7XG5cbnZhciBJbmRleGVkU2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoU2VxKSB7XG4gIGZ1bmN0aW9uIEluZGV4ZWRTZXEodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eVNlcXVlbmNlKClcbiAgICAgIDogaXNDb2xsZWN0aW9uKHZhbHVlKVxuICAgICAgPyBpc0tleWVkKHZhbHVlKVxuICAgICAgICA/IHZhbHVlLmVudHJ5U2VxKClcbiAgICAgICAgOiB2YWx1ZS50b0luZGV4ZWRTZXEoKVxuICAgICAgOiBpc1JlY29yZCh2YWx1ZSlcbiAgICAgID8gdmFsdWUudG9TZXEoKS5lbnRyeVNlcSgpXG4gICAgICA6IGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBTZXEgKSBJbmRleGVkU2VxLl9fcHJvdG9fXyA9IFNlcTtcbiAgSW5kZXhlZFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXEgJiYgU2VxLnByb3RvdHlwZSApO1xuICBJbmRleGVkU2VxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEluZGV4ZWRTZXE7XG5cbiAgSW5kZXhlZFNlcS5vZiA9IGZ1bmN0aW9uIG9mICgvKi4uLnZhbHVlcyovKSB7XG4gICAgcmV0dXJuIEluZGV4ZWRTZXEoYXJndW1lbnRzKTtcbiAgfTtcblxuICBJbmRleGVkU2VxLnByb3RvdHlwZS50b0luZGV4ZWRTZXEgPSBmdW5jdGlvbiB0b0luZGV4ZWRTZXEgKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEluZGV4ZWRTZXEucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NlcSBbJywgJ10nKTtcbiAgfTtcblxuICByZXR1cm4gSW5kZXhlZFNlcTtcbn0oU2VxKSk7XG5cbnZhciBTZXRTZXEgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChTZXEpIHtcbiAgZnVuY3Rpb24gU2V0U2VxKHZhbHVlKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzQ29sbGVjdGlvbih2YWx1ZSkgJiYgIWlzQXNzb2NpYXRpdmUodmFsdWUpID8gdmFsdWUgOiBJbmRleGVkU2VxKHZhbHVlKVxuICAgICkudG9TZXRTZXEoKTtcbiAgfVxuXG4gIGlmICggU2VxICkgU2V0U2VxLl9fcHJvdG9fXyA9IFNlcTtcbiAgU2V0U2VxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFNlcSAmJiBTZXEucHJvdG90eXBlICk7XG4gIFNldFNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXRTZXE7XG5cbiAgU2V0U2VxLm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gU2V0U2VxKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgU2V0U2VxLnByb3RvdHlwZS50b1NldFNlcSA9IGZ1bmN0aW9uIHRvU2V0U2VxICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gU2V0U2VxO1xufShTZXEpKTtcblxuU2VxLmlzU2VxID0gaXNTZXE7XG5TZXEuS2V5ZWQgPSBLZXllZFNlcTtcblNlcS5TZXQgPSBTZXRTZXE7XG5TZXEuSW5kZXhlZCA9IEluZGV4ZWRTZXE7XG5cblNlcS5wcm90b3R5cGVbSVNfU0VRX1NZTUJPTF0gPSB0cnVlO1xuXG4vLyAjcHJhZ21hIFJvb3QgU2VxdWVuY2VzXG5cbnZhciBBcnJheVNlcSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRTZXEpIHtcbiAgZnVuY3Rpb24gQXJyYXlTZXEoYXJyYXkpIHtcbiAgICB0aGlzLl9hcnJheSA9IGFycmF5O1xuICAgIHRoaXMuc2l6ZSA9IGFycmF5Lmxlbmd0aDtcbiAgfVxuXG4gIGlmICggSW5kZXhlZFNlcSApIEFycmF5U2VxLl9fcHJvdG9fXyA9IEluZGV4ZWRTZXE7XG4gIEFycmF5U2VxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEluZGV4ZWRTZXEgJiYgSW5kZXhlZFNlcS5wcm90b3R5cGUgKTtcbiAgQXJyYXlTZXEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gQXJyYXlTZXE7XG5cbiAgQXJyYXlTZXEucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KSA/IHRoaXMuX2FycmF5W3dyYXBJbmRleCh0aGlzLCBpbmRleCldIDogbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgYXJyYXkgPSB0aGlzLl9hcnJheTtcbiAgICB2YXIgc2l6ZSA9IGFycmF5Lmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgIT09IHNpemUpIHtcbiAgICAgIHZhciBpaSA9IHJldmVyc2UgPyBzaXplIC0gKytpIDogaSsrO1xuICAgICAgaWYgKGZuKGFycmF5W2lpXSwgaWksIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH07XG5cbiAgQXJyYXlTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGFycmF5ID0gdGhpcy5fYXJyYXk7XG4gICAgdmFyIHNpemUgPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGkgPT09IHNpemUpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIGlpID0gcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKys7XG4gICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpaSwgYXJyYXlbaWldKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gQXJyYXlTZXE7XG59KEluZGV4ZWRTZXEpKTtcblxudmFyIE9iamVjdFNlcSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEtleWVkU2VxKSB7XG4gIGZ1bmN0aW9uIE9iamVjdFNlcShvYmplY3QpIHtcbiAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7XG4gICAgdGhpcy5fb2JqZWN0ID0gb2JqZWN0O1xuICAgIHRoaXMuX2tleXMgPSBrZXlzO1xuICAgIHRoaXMuc2l6ZSA9IGtleXMubGVuZ3RoO1xuICB9XG5cbiAgaWYgKCBLZXllZFNlcSApIE9iamVjdFNlcS5fX3Byb3RvX18gPSBLZXllZFNlcTtcbiAgT2JqZWN0U2VxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEtleWVkU2VxICYmIEtleWVkU2VxLnByb3RvdHlwZSApO1xuICBPYmplY3RTZXEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gT2JqZWN0U2VxO1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgaWYgKG5vdFNldFZhbHVlICE9PSB1bmRlZmluZWQgJiYgIXRoaXMuaGFzKGtleSkpIHtcbiAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX29iamVjdFtrZXldO1xuICB9O1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gaGFzIChrZXkpIHtcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbCh0aGlzLl9vYmplY3QsIGtleSk7XG4gIH07XG5cbiAgT2JqZWN0U2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIG9iamVjdCA9IHRoaXMuX29iamVjdDtcbiAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG4gICAgdmFyIHNpemUgPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgIT09IHNpemUpIHtcbiAgICAgIHZhciBrZXkgPSBrZXlzW3JldmVyc2UgPyBzaXplIC0gKytpIDogaSsrXTtcbiAgICAgIGlmIChmbihvYmplY3Rba2V5XSwga2V5LCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9O1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICB2YXIgb2JqZWN0ID0gdGhpcy5fb2JqZWN0O1xuICAgIHZhciBrZXlzID0gdGhpcy5fa2V5cztcbiAgICB2YXIgc2l6ZSA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBpID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpID09PSBzaXplKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBrZXkgPSBrZXlzW3JldmVyc2UgPyBzaXplIC0gKytpIDogaSsrXTtcbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGtleSwgb2JqZWN0W2tleV0pO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBPYmplY3RTZXE7XG59KEtleWVkU2VxKSk7XG5PYmplY3RTZXEucHJvdG90eXBlW0lTX09SREVSRURfU1lNQk9MXSA9IHRydWU7XG5cbnZhciBDb2xsZWN0aW9uU2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZFNlcSkge1xuICBmdW5jdGlvbiBDb2xsZWN0aW9uU2VxKGNvbGxlY3Rpb24pIHtcbiAgICB0aGlzLl9jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcbiAgICB0aGlzLnNpemUgPSBjb2xsZWN0aW9uLmxlbmd0aCB8fCBjb2xsZWN0aW9uLnNpemU7XG4gIH1cblxuICBpZiAoIEluZGV4ZWRTZXEgKSBDb2xsZWN0aW9uU2VxLl9fcHJvdG9fXyA9IEluZGV4ZWRTZXE7XG4gIENvbGxlY3Rpb25TZXEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBDb2xsZWN0aW9uU2VxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbGxlY3Rpb25TZXE7XG5cbiAgQ29sbGVjdGlvblNlcS5wcm90b3R5cGUuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiBfX2l0ZXJhdGVVbmNhY2hlZCAoZm4sIHJldmVyc2UpIHtcbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXMuX2NvbGxlY3Rpb247XG4gICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoY29sbGVjdGlvbik7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIGlmIChpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgIGlmIChmbihzdGVwLnZhbHVlLCBpdGVyYXRpb25zKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICB9O1xuXG4gIENvbGxlY3Rpb25TZXEucHJvdG90eXBlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uIF9faXRlcmF0b3JVbmNhY2hlZCAodHlwZSwgcmV2ZXJzZSkge1xuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBjb2xsZWN0aW9uID0gdGhpcy5fY29sbGVjdGlvbjtcbiAgICB2YXIgaXRlcmF0b3IgPSBnZXRJdGVyYXRvcihjb2xsZWN0aW9uKTtcbiAgICBpZiAoIWlzSXRlcmF0b3IoaXRlcmF0b3IpKSB7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGl0ZXJhdG9yRG9uZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgcmV0dXJuIHN0ZXAuZG9uZSA/IHN0ZXAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIENvbGxlY3Rpb25TZXE7XG59KEluZGV4ZWRTZXEpKTtcblxuLy8gIyBwcmFnbWEgSGVscGVyIGZ1bmN0aW9uc1xuXG52YXIgRU1QVFlfU0VRO1xuXG5mdW5jdGlvbiBlbXB0eVNlcXVlbmNlKCkge1xuICByZXR1cm4gRU1QVFlfU0VRIHx8IChFTVBUWV9TRVEgPSBuZXcgQXJyYXlTZXEoW10pKTtcbn1cblxuZnVuY3Rpb24ga2V5ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgdmFyIHNlcSA9IG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gIGlmIChzZXEpIHtcbiAgICByZXR1cm4gc2VxLmZyb21FbnRyeVNlcSgpO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIG5ldyBPYmplY3RTZXEodmFsdWUpO1xuICB9XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ0V4cGVjdGVkIEFycmF5IG9yIGNvbGxlY3Rpb24gb2JqZWN0IG9mIFtrLCB2XSBlbnRyaWVzLCBvciBrZXllZCBvYmplY3Q6ICcgK1xuICAgICAgdmFsdWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gaW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICB2YXIgc2VxID0gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgaWYgKHNlcSkge1xuICAgIHJldHVybiBzZXE7XG4gIH1cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgY29sbGVjdGlvbiBvYmplY3Qgb2YgdmFsdWVzOiAnICsgdmFsdWVcbiAgKTtcbn1cblxuZnVuY3Rpb24gc2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gIHZhciBzZXEgPSBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICBpZiAoc2VxKSB7XG4gICAgcmV0dXJuIGlzRW50cmllc0l0ZXJhYmxlKHZhbHVlKVxuICAgICAgPyBzZXEuZnJvbUVudHJ5U2VxKClcbiAgICAgIDogaXNLZXlzSXRlcmFibGUodmFsdWUpXG4gICAgICA/IHNlcS50b1NldFNlcSgpXG4gICAgICA6IHNlcTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U2VxKHZhbHVlKTtcbiAgfVxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdFeHBlY3RlZCBBcnJheSBvciBjb2xsZWN0aW9uIG9iamVjdCBvZiB2YWx1ZXMsIG9yIGtleWVkIG9iamVjdDogJyArIHZhbHVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICByZXR1cm4gaXNBcnJheUxpa2UodmFsdWUpXG4gICAgPyBuZXcgQXJyYXlTZXEodmFsdWUpXG4gICAgOiBoYXNJdGVyYXRvcih2YWx1ZSlcbiAgICA/IG5ldyBDb2xsZWN0aW9uU2VxKHZhbHVlKVxuICAgIDogdW5kZWZpbmVkO1xufVxuXG52YXIgSVNfTUFQX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX01BUF9fQEAnO1xuXG5mdW5jdGlvbiBpc01hcChtYXliZU1hcCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZU1hcCAmJiBtYXliZU1hcFtJU19NQVBfU1lNQk9MXSk7XG59XG5cbmZ1bmN0aW9uIGlzT3JkZXJlZE1hcChtYXliZU9yZGVyZWRNYXApIHtcbiAgcmV0dXJuIGlzTWFwKG1heWJlT3JkZXJlZE1hcCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZE1hcCk7XG59XG5cbmZ1bmN0aW9uIGlzVmFsdWVPYmplY3QobWF5YmVWYWx1ZSkge1xuICByZXR1cm4gQm9vbGVhbihcbiAgICBtYXliZVZhbHVlICYmXG4gICAgICB0eXBlb2YgbWF5YmVWYWx1ZS5lcXVhbHMgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIHR5cGVvZiBtYXliZVZhbHVlLmhhc2hDb2RlID09PSAnZnVuY3Rpb24nXG4gICk7XG59XG5cbi8qKlxuICogQW4gZXh0ZW5zaW9uIG9mIHRoZSBcInNhbWUtdmFsdWVcIiBhbGdvcml0aG0gYXMgW2Rlc2NyaWJlZCBmb3IgdXNlIGJ5IEVTNiBNYXBcbiAqIGFuZCBTZXRdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL01hcCNLZXlfZXF1YWxpdHkpXG4gKlxuICogTmFOIGlzIGNvbnNpZGVyZWQgdGhlIHNhbWUgYXMgTmFOLCBob3dldmVyIC0wIGFuZCAwIGFyZSBjb25zaWRlcmVkIHRoZSBzYW1lXG4gKiB2YWx1ZSwgd2hpY2ggaXMgZGlmZmVyZW50IGZyb20gdGhlIGFsZ29yaXRobSBkZXNjcmliZWQgYnlcbiAqIFtgT2JqZWN0LmlzYF0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvT2JqZWN0L2lzKS5cbiAqXG4gKiBUaGlzIGlzIGV4dGVuZGVkIGZ1cnRoZXIgdG8gYWxsb3cgT2JqZWN0cyB0byBkZXNjcmliZSB0aGUgdmFsdWVzIHRoZXlcbiAqIHJlcHJlc2VudCwgYnkgd2F5IG9mIGB2YWx1ZU9mYCBvciBgZXF1YWxzYCAoYW5kIGBoYXNoQ29kZWApLlxuICpcbiAqIE5vdGU6IGJlY2F1c2Ugb2YgdGhpcyBleHRlbnNpb24sIHRoZSBrZXkgZXF1YWxpdHkgb2YgSW1tdXRhYmxlLk1hcCBhbmQgdGhlXG4gKiB2YWx1ZSBlcXVhbGl0eSBvZiBJbW11dGFibGUuU2V0IHdpbGwgZGlmZmVyIGZyb20gRVM2IE1hcCBhbmQgU2V0LlxuICpcbiAqICMjIyBEZWZpbmluZyBjdXN0b20gdmFsdWVzXG4gKlxuICogVGhlIGVhc2llc3Qgd2F5IHRvIGRlc2NyaWJlIHRoZSB2YWx1ZSBhbiBvYmplY3QgcmVwcmVzZW50cyBpcyBieSBpbXBsZW1lbnRpbmdcbiAqIGB2YWx1ZU9mYC4gRm9yIGV4YW1wbGUsIGBEYXRlYCByZXByZXNlbnRzIGEgdmFsdWUgYnkgcmV0dXJuaW5nIGEgdW5peFxuICogdGltZXN0YW1wIGZvciBgdmFsdWVPZmA6XG4gKlxuICogICAgIHZhciBkYXRlMSA9IG5ldyBEYXRlKDEyMzQ1Njc4OTAwMDApOyAvLyBGcmkgRmViIDEzIDIwMDkgLi4uXG4gKiAgICAgdmFyIGRhdGUyID0gbmV3IERhdGUoMTIzNDU2Nzg5MDAwMCk7XG4gKiAgICAgZGF0ZTEudmFsdWVPZigpOyAvLyAxMjM0NTY3ODkwMDAwXG4gKiAgICAgYXNzZXJ0KCBkYXRlMSAhPT0gZGF0ZTIgKTtcbiAqICAgICBhc3NlcnQoIEltbXV0YWJsZS5pcyggZGF0ZTEsIGRhdGUyICkgKTtcbiAqXG4gKiBOb3RlOiBvdmVycmlkaW5nIGB2YWx1ZU9mYCBtYXkgaGF2ZSBvdGhlciBpbXBsaWNhdGlvbnMgaWYgeW91IHVzZSB0aGlzIG9iamVjdFxuICogd2hlcmUgSmF2YVNjcmlwdCBleHBlY3RzIGEgcHJpbWl0aXZlLCBzdWNoIGFzIGltcGxpY2l0IHN0cmluZyBjb2VyY2lvbi5cbiAqXG4gKiBGb3IgbW9yZSBjb21wbGV4IHR5cGVzLCBlc3BlY2lhbGx5IGNvbGxlY3Rpb25zLCBpbXBsZW1lbnRpbmcgYHZhbHVlT2ZgIG1heVxuICogbm90IGJlIHBlcmZvcm1hbnQuIEFuIGFsdGVybmF0aXZlIGlzIHRvIGltcGxlbWVudCBgZXF1YWxzYCBhbmQgYGhhc2hDb2RlYC5cbiAqXG4gKiBgZXF1YWxzYCB0YWtlcyBhbm90aGVyIG9iamVjdCwgcHJlc3VtYWJseSBvZiBzaW1pbGFyIHR5cGUsIGFuZCByZXR1cm5zIHRydWVcbiAqIGlmIGl0IGlzIGVxdWFsLiBFcXVhbGl0eSBpcyBzeW1tZXRyaWNhbCwgc28gdGhlIHNhbWUgcmVzdWx0IHNob3VsZCBiZVxuICogcmV0dXJuZWQgaWYgdGhpcyBhbmQgdGhlIGFyZ3VtZW50IGFyZSBmbGlwcGVkLlxuICpcbiAqICAgICBhc3NlcnQoIGEuZXF1YWxzKGIpID09PSBiLmVxdWFscyhhKSApO1xuICpcbiAqIGBoYXNoQ29kZWAgcmV0dXJucyBhIDMyYml0IGludGVnZXIgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgb2JqZWN0IHdoaWNoIHdpbGxcbiAqIGJlIHVzZWQgdG8gZGV0ZXJtaW5lIGhvdyB0byBzdG9yZSB0aGUgdmFsdWUgb2JqZWN0IGluIGEgTWFwIG9yIFNldC4gWW91IG11c3RcbiAqIHByb3ZpZGUgYm90aCBvciBuZWl0aGVyIG1ldGhvZHMsIG9uZSBtdXN0IG5vdCBleGlzdCB3aXRob3V0IHRoZSBvdGhlci5cbiAqXG4gKiBBbHNvLCBhbiBpbXBvcnRhbnQgcmVsYXRpb25zaGlwIGJldHdlZW4gdGhlc2UgbWV0aG9kcyBtdXN0IGJlIHVwaGVsZDogaWYgdHdvXG4gKiB2YWx1ZXMgYXJlIGVxdWFsLCB0aGV5ICptdXN0KiByZXR1cm4gdGhlIHNhbWUgaGFzaENvZGUuIElmIHRoZSB2YWx1ZXMgYXJlIG5vdFxuICogZXF1YWwsIHRoZXkgbWlnaHQgaGF2ZSB0aGUgc2FtZSBoYXNoQ29kZTsgdGhpcyBpcyBjYWxsZWQgYSBoYXNoIGNvbGxpc2lvbixcbiAqIGFuZCB3aGlsZSB1bmRlc2lyYWJsZSBmb3IgcGVyZm9ybWFuY2UgcmVhc29ucywgaXQgaXMgYWNjZXB0YWJsZS5cbiAqXG4gKiAgICAgaWYgKGEuZXF1YWxzKGIpKSB7XG4gKiAgICAgICBhc3NlcnQoIGEuaGFzaENvZGUoKSA9PT0gYi5oYXNoQ29kZSgpICk7XG4gKiAgICAgfVxuICpcbiAqIEFsbCBJbW11dGFibGUgY29sbGVjdGlvbnMgYXJlIFZhbHVlIE9iamVjdHM6IHRoZXkgaW1wbGVtZW50IGBlcXVhbHMoKWBcbiAqIGFuZCBgaGFzaENvZGUoKWAuXG4gKi9cbmZ1bmN0aW9uIGlzKHZhbHVlQSwgdmFsdWVCKSB7XG4gIGlmICh2YWx1ZUEgPT09IHZhbHVlQiB8fCAodmFsdWVBICE9PSB2YWx1ZUEgJiYgdmFsdWVCICE9PSB2YWx1ZUIpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKCF2YWx1ZUEgfHwgIXZhbHVlQikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBpZiAoXG4gICAgdHlwZW9mIHZhbHVlQS52YWx1ZU9mID09PSAnZnVuY3Rpb24nICYmXG4gICAgdHlwZW9mIHZhbHVlQi52YWx1ZU9mID09PSAnZnVuY3Rpb24nXG4gICkge1xuICAgIHZhbHVlQSA9IHZhbHVlQS52YWx1ZU9mKCk7XG4gICAgdmFsdWVCID0gdmFsdWVCLnZhbHVlT2YoKTtcbiAgICBpZiAodmFsdWVBID09PSB2YWx1ZUIgfHwgKHZhbHVlQSAhPT0gdmFsdWVBICYmIHZhbHVlQiAhPT0gdmFsdWVCKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmICghdmFsdWVBIHx8ICF2YWx1ZUIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICEhKFxuICAgIGlzVmFsdWVPYmplY3QodmFsdWVBKSAmJlxuICAgIGlzVmFsdWVPYmplY3QodmFsdWVCKSAmJlxuICAgIHZhbHVlQS5lcXVhbHModmFsdWVCKVxuICApO1xufVxuXG52YXIgaW11bCA9XG4gIHR5cGVvZiBNYXRoLmltdWwgPT09ICdmdW5jdGlvbicgJiYgTWF0aC5pbXVsKDB4ZmZmZmZmZmYsIDIpID09PSAtMlxuICAgID8gTWF0aC5pbXVsXG4gICAgOiBmdW5jdGlvbiBpbXVsKGEsIGIpIHtcbiAgICAgICAgYSB8PSAwOyAvLyBpbnRcbiAgICAgICAgYiB8PSAwOyAvLyBpbnRcbiAgICAgICAgdmFyIGMgPSBhICYgMHhmZmZmO1xuICAgICAgICB2YXIgZCA9IGIgJiAweGZmZmY7XG4gICAgICAgIC8vIFNoaWZ0IGJ5IDAgZml4ZXMgdGhlIHNpZ24gb24gdGhlIGhpZ2ggcGFydC5cbiAgICAgICAgcmV0dXJuIChjICogZCArICgoKChhID4+PiAxNikgKiBkICsgYyAqIChiID4+PiAxNikpIDw8IDE2KSA+Pj4gMCkpIHwgMDsgLy8gaW50XG4gICAgICB9O1xuXG4vLyB2OCBoYXMgYW4gb3B0aW1pemF0aW9uIGZvciBzdG9yaW5nIDMxLWJpdCBzaWduZWQgbnVtYmVycy5cbi8vIFZhbHVlcyB3aGljaCBoYXZlIGVpdGhlciAwMCBvciAxMSBhcyB0aGUgaGlnaCBvcmRlciBiaXRzIHF1YWxpZnkuXG4vLyBUaGlzIGZ1bmN0aW9uIGRyb3BzIHRoZSBoaWdoZXN0IG9yZGVyIGJpdCBpbiBhIHNpZ25lZCBudW1iZXIsIG1haW50YWluaW5nXG4vLyB0aGUgc2lnbiBiaXQuXG5mdW5jdGlvbiBzbWkoaTMyKSB7XG4gIHJldHVybiAoKGkzMiA+Pj4gMSkgJiAweDQwMDAwMDAwKSB8IChpMzIgJiAweGJmZmZmZmZmKTtcbn1cblxudmFyIGRlZmF1bHRWYWx1ZU9mID0gT2JqZWN0LnByb3RvdHlwZS52YWx1ZU9mO1xuXG5mdW5jdGlvbiBoYXNoKG8pIHtcbiAgaWYgKG8gPT0gbnVsbCkge1xuICAgIHJldHVybiBoYXNoTnVsbGlzaChvKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygby5oYXNoQ29kZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIERyb3AgYW55IGhpZ2ggYml0cyBmcm9tIGFjY2lkZW50YWxseSBsb25nIGhhc2ggY29kZXMuXG4gICAgcmV0dXJuIHNtaShvLmhhc2hDb2RlKG8pKTtcbiAgfVxuXG4gIHZhciB2ID0gdmFsdWVPZihvKTtcblxuICBpZiAodiA9PSBudWxsKSB7XG4gICAgcmV0dXJuIGhhc2hOdWxsaXNoKHYpO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlb2Ygdikge1xuICAgIGNhc2UgJ2Jvb2xlYW4nOlxuICAgICAgLy8gVGhlIGhhc2ggdmFsdWVzIGZvciBidWlsdC1pbiBjb25zdGFudHMgYXJlIGEgMSB2YWx1ZSBmb3IgZWFjaCA1LWJ5dGVcbiAgICAgIC8vIHNoaWZ0IHJlZ2lvbiBleHBlY3QgZm9yIHRoZSBmaXJzdCwgd2hpY2ggZW5jb2RlcyB0aGUgdmFsdWUuIFRoaXNcbiAgICAgIC8vIHJlZHVjZXMgdGhlIG9kZHMgb2YgYSBoYXNoIGNvbGxpc2lvbiBmb3IgdGhlc2UgY29tbW9uIHZhbHVlcy5cbiAgICAgIHJldHVybiB2ID8gMHg0MjEwODQyMSA6IDB4NDIxMDg0MjA7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICAgIHJldHVybiBoYXNoTnVtYmVyKHYpO1xuICAgIGNhc2UgJ3N0cmluZyc6XG4gICAgICByZXR1cm4gdi5sZW5ndGggPiBTVFJJTkdfSEFTSF9DQUNIRV9NSU5fU1RSTEVOXG4gICAgICAgID8gY2FjaGVkSGFzaFN0cmluZyh2KVxuICAgICAgICA6IGhhc2hTdHJpbmcodik7XG4gICAgY2FzZSAnb2JqZWN0JzpcbiAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICByZXR1cm4gaGFzaEpTT2JqKHYpO1xuICAgIGNhc2UgJ3N5bWJvbCc6XG4gICAgICByZXR1cm4gaGFzaFN5bWJvbCh2KTtcbiAgICBkZWZhdWx0OlxuICAgICAgaWYgKHR5cGVvZiB2LnRvU3RyaW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBoYXNoU3RyaW5nKHYudG9TdHJpbmcoKSk7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIHR5cGUgJyArIHR5cGVvZiB2ICsgJyBjYW5ub3QgYmUgaGFzaGVkLicpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGhhc2hOdWxsaXNoKG51bGxpc2gpIHtcbiAgcmV0dXJuIG51bGxpc2ggPT09IG51bGwgPyAweDQyMTA4NDIyIDogLyogdW5kZWZpbmVkICovIDB4NDIxMDg0MjM7XG59XG5cbi8vIENvbXByZXNzIGFyYml0cmFyaWx5IGxhcmdlIG51bWJlcnMgaW50byBzbWkgaGFzaGVzLlxuZnVuY3Rpb24gaGFzaE51bWJlcihuKSB7XG4gIGlmIChuICE9PSBuIHx8IG4gPT09IEluZmluaXR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgdmFyIGhhc2ggPSBuIHwgMDtcbiAgaWYgKGhhc2ggIT09IG4pIHtcbiAgICBoYXNoIF49IG4gKiAweGZmZmZmZmZmO1xuICB9XG4gIHdoaWxlIChuID4gMHhmZmZmZmZmZikge1xuICAgIG4gLz0gMHhmZmZmZmZmZjtcbiAgICBoYXNoIF49IG47XG4gIH1cbiAgcmV0dXJuIHNtaShoYXNoKTtcbn1cblxuZnVuY3Rpb24gY2FjaGVkSGFzaFN0cmluZyhzdHJpbmcpIHtcbiAgdmFyIGhhc2hlZCA9IHN0cmluZ0hhc2hDYWNoZVtzdHJpbmddO1xuICBpZiAoaGFzaGVkID09PSB1bmRlZmluZWQpIHtcbiAgICBoYXNoZWQgPSBoYXNoU3RyaW5nKHN0cmluZyk7XG4gICAgaWYgKFNUUklOR19IQVNIX0NBQ0hFX1NJWkUgPT09IFNUUklOR19IQVNIX0NBQ0hFX01BWF9TSVpFKSB7XG4gICAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID0gMDtcbiAgICAgIHN0cmluZ0hhc2hDYWNoZSA9IHt9O1xuICAgIH1cbiAgICBTVFJJTkdfSEFTSF9DQUNIRV9TSVpFKys7XG4gICAgc3RyaW5nSGFzaENhY2hlW3N0cmluZ10gPSBoYXNoZWQ7XG4gIH1cbiAgcmV0dXJuIGhhc2hlZDtcbn1cblxuLy8gaHR0cDovL2pzcGVyZi5jb20vaGFzaGluZy1zdHJpbmdzXG5mdW5jdGlvbiBoYXNoU3RyaW5nKHN0cmluZykge1xuICAvLyBUaGlzIGlzIHRoZSBoYXNoIGZyb20gSlZNXG4gIC8vIFRoZSBoYXNoIGNvZGUgZm9yIGEgc3RyaW5nIGlzIGNvbXB1dGVkIGFzXG4gIC8vIHNbMF0gKiAzMSBeIChuIC0gMSkgKyBzWzFdICogMzEgXiAobiAtIDIpICsgLi4uICsgc1tuIC0gMV0sXG4gIC8vIHdoZXJlIHNbaV0gaXMgdGhlIGl0aCBjaGFyYWN0ZXIgb2YgdGhlIHN0cmluZyBhbmQgbiBpcyB0aGUgbGVuZ3RoIG9mXG4gIC8vIHRoZSBzdHJpbmcuIFdlIFwibW9kXCIgdGhlIHJlc3VsdCB0byBtYWtlIGl0IGJldHdlZW4gMCAoaW5jbHVzaXZlKSBhbmQgMl4zMVxuICAvLyAoZXhjbHVzaXZlKSBieSBkcm9wcGluZyBoaWdoIGJpdHMuXG4gIHZhciBoYXNoZWQgPSAwO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgc3RyaW5nLmxlbmd0aDsgaWkrKykge1xuICAgIGhhc2hlZCA9ICgzMSAqIGhhc2hlZCArIHN0cmluZy5jaGFyQ29kZUF0KGlpKSkgfCAwO1xuICB9XG4gIHJldHVybiBzbWkoaGFzaGVkKTtcbn1cblxuZnVuY3Rpb24gaGFzaFN5bWJvbChzeW0pIHtcbiAgdmFyIGhhc2hlZCA9IHN5bWJvbE1hcFtzeW1dO1xuICBpZiAoaGFzaGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gaGFzaGVkO1xuICB9XG5cbiAgaGFzaGVkID0gbmV4dEhhc2goKTtcblxuICBzeW1ib2xNYXBbc3ltXSA9IGhhc2hlZDtcblxuICByZXR1cm4gaGFzaGVkO1xufVxuXG5mdW5jdGlvbiBoYXNoSlNPYmoob2JqKSB7XG4gIHZhciBoYXNoZWQ7XG4gIGlmICh1c2luZ1dlYWtNYXApIHtcbiAgICBoYXNoZWQgPSB3ZWFrTWFwLmdldChvYmopO1xuICAgIGlmIChoYXNoZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhc2hlZDtcbiAgICB9XG4gIH1cblxuICBoYXNoZWQgPSBvYmpbVUlEX0hBU0hfS0VZXTtcbiAgaWYgKGhhc2hlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGhhc2hlZDtcbiAgfVxuXG4gIGlmICghY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICBoYXNoZWQgPSBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgJiYgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlW1VJRF9IQVNIX0tFWV07XG4gICAgaWYgKGhhc2hlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFzaGVkO1xuICAgIH1cblxuICAgIGhhc2hlZCA9IGdldElFTm9kZUhhc2gob2JqKTtcbiAgICBpZiAoaGFzaGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYXNoZWQ7XG4gICAgfVxuICB9XG5cbiAgaGFzaGVkID0gbmV4dEhhc2goKTtcblxuICBpZiAodXNpbmdXZWFrTWFwKSB7XG4gICAgd2Vha01hcC5zZXQob2JqLCBoYXNoZWQpO1xuICB9IGVsc2UgaWYgKGlzRXh0ZW5zaWJsZSAhPT0gdW5kZWZpbmVkICYmIGlzRXh0ZW5zaWJsZShvYmopID09PSBmYWxzZSkge1xuICAgIHRocm93IG5ldyBFcnJvcignTm9uLWV4dGVuc2libGUgb2JqZWN0cyBhcmUgbm90IGFsbG93ZWQgYXMga2V5cy4nKTtcbiAgfSBlbHNlIGlmIChjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIFVJRF9IQVNIX0tFWSwge1xuICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IGZhbHNlLFxuICAgICAgdmFsdWU6IGhhc2hlZCxcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChcbiAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgIT09IHVuZGVmaW5lZCAmJlxuICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9PT0gb2JqLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZVxuICApIHtcbiAgICAvLyBTaW5jZSB3ZSBjYW4ndCBkZWZpbmUgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSBvbiB0aGUgb2JqZWN0XG4gICAgLy8gd2UnbGwgaGlqYWNrIG9uZSBvZiB0aGUgbGVzcy11c2VkIG5vbi1lbnVtZXJhYmxlIHByb3BlcnRpZXMgdG9cbiAgICAvLyBzYXZlIG91ciBoYXNoIG9uIGl0LiBTaW5jZSB0aGlzIGlzIGEgZnVuY3Rpb24gaXQgd2lsbCBub3Qgc2hvdyB1cCBpblxuICAgIC8vIGBKU09OLnN0cmluZ2lmeWAgd2hpY2ggaXMgd2hhdCB3ZSB3YW50LlxuICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yLnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5hcHBseShcbiAgICAgICAgdGhpcyxcbiAgICAgICAgYXJndW1lbnRzXG4gICAgICApO1xuICAgIH07XG4gICAgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlW1VJRF9IQVNIX0tFWV0gPSBoYXNoZWQ7XG4gIH0gZWxzZSBpZiAob2JqLm5vZGVUeXBlICE9PSB1bmRlZmluZWQpIHtcbiAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGNvdWxkbid0IGdldCB0aGUgSUUgYHVuaXF1ZUlEYCB0byB1c2UgYXMgYSBoYXNoXG4gICAgLy8gYW5kIHdlIGNvdWxkbid0IHVzZSBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IHRvIGV4cGxvaXQgdGhlXG4gICAgLy8gZG9udEVudW0gYnVnIHNvIHdlIHNpbXBseSBhZGQgdGhlIGBVSURfSEFTSF9LRVlgIG9uIHRoZSBub2RlXG4gICAgLy8gaXRzZWxmLlxuICAgIG9ialtVSURfSEFTSF9LRVldID0gaGFzaGVkO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignVW5hYmxlIHRvIHNldCBhIG5vbi1lbnVtZXJhYmxlIHByb3BlcnR5IG9uIG9iamVjdC4nKTtcbiAgfVxuXG4gIHJldHVybiBoYXNoZWQ7XG59XG5cbi8vIEdldCByZWZlcmVuY2VzIHRvIEVTNSBvYmplY3QgbWV0aG9kcy5cbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlO1xuXG4vLyBUcnVlIGlmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSB3b3JrcyBhcyBleHBlY3RlZC4gSUU4IGZhaWxzIHRoaXMgdGVzdC5cbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IChmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnQCcsIHt9KTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSkoKTtcblxuLy8gSUUgaGFzIGEgYHVuaXF1ZUlEYCBwcm9wZXJ0eSBvbiBET00gbm9kZXMuIFdlIGNhbiBjb25zdHJ1Y3QgdGhlIGhhc2ggZnJvbSBpdFxuLy8gYW5kIGF2b2lkIG1lbW9yeSBsZWFrcyBmcm9tIHRoZSBJRSBjbG9uZU5vZGUgYnVnLlxuZnVuY3Rpb24gZ2V0SUVOb2RlSGFzaChub2RlKSB7XG4gIGlmIChub2RlICYmIG5vZGUubm9kZVR5cGUgPiAwKSB7XG4gICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICBjYXNlIDE6IC8vIEVsZW1lbnRcbiAgICAgICAgcmV0dXJuIG5vZGUudW5pcXVlSUQ7XG4gICAgICBjYXNlIDk6IC8vIERvY3VtZW50XG4gICAgICAgIHJldHVybiBub2RlLmRvY3VtZW50RWxlbWVudCAmJiBub2RlLmRvY3VtZW50RWxlbWVudC51bmlxdWVJRDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gdmFsdWVPZihvYmopIHtcbiAgcmV0dXJuIG9iai52YWx1ZU9mICE9PSBkZWZhdWx0VmFsdWVPZiAmJiB0eXBlb2Ygb2JqLnZhbHVlT2YgPT09ICdmdW5jdGlvbidcbiAgICA/IG9iai52YWx1ZU9mKG9iailcbiAgICA6IG9iajtcbn1cblxuZnVuY3Rpb24gbmV4dEhhc2goKSB7XG4gIHZhciBuZXh0SGFzaCA9ICsrX29iakhhc2hVSUQ7XG4gIGlmIChfb2JqSGFzaFVJRCAmIDB4NDAwMDAwMDApIHtcbiAgICBfb2JqSGFzaFVJRCA9IDA7XG4gIH1cbiAgcmV0dXJuIG5leHRIYXNoO1xufVxuXG4vLyBJZiBwb3NzaWJsZSwgdXNlIGEgV2Vha01hcC5cbnZhciB1c2luZ1dlYWtNYXAgPSB0eXBlb2YgV2Vha01hcCA9PT0gJ2Z1bmN0aW9uJztcbnZhciB3ZWFrTWFwO1xuaWYgKHVzaW5nV2Vha01hcCkge1xuICB3ZWFrTWFwID0gbmV3IFdlYWtNYXAoKTtcbn1cblxudmFyIHN5bWJvbE1hcCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG5cbnZhciBfb2JqSGFzaFVJRCA9IDA7XG5cbnZhciBVSURfSEFTSF9LRVkgPSAnX19pbW11dGFibGVoYXNoX18nO1xuaWYgKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicpIHtcbiAgVUlEX0hBU0hfS0VZID0gU3ltYm9sKFVJRF9IQVNIX0tFWSk7XG59XG5cbnZhciBTVFJJTkdfSEFTSF9DQUNIRV9NSU5fU1RSTEVOID0gMTY7XG52YXIgU1RSSU5HX0hBU0hfQ0FDSEVfTUFYX1NJWkUgPSAyNTU7XG52YXIgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSA9IDA7XG52YXIgc3RyaW5nSGFzaENhY2hlID0ge307XG5cbnZhciBUb0tleWVkU2VxdWVuY2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChLZXllZFNlcSkge1xuICBmdW5jdGlvbiBUb0tleWVkU2VxdWVuY2UoaW5kZXhlZCwgdXNlS2V5cykge1xuICAgIHRoaXMuX2l0ZXIgPSBpbmRleGVkO1xuICAgIHRoaXMuX3VzZUtleXMgPSB1c2VLZXlzO1xuICAgIHRoaXMuc2l6ZSA9IGluZGV4ZWQuc2l6ZTtcbiAgfVxuXG4gIGlmICggS2V5ZWRTZXEgKSBUb0tleWVkU2VxdWVuY2UuX19wcm90b19fID0gS2V5ZWRTZXE7XG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBLZXllZFNlcSAmJiBLZXllZFNlcS5wcm90b3R5cGUgKTtcbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRvS2V5ZWRTZXF1ZW5jZTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoa2V5LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9pdGVyLmdldChrZXksIG5vdFNldFZhbHVlKTtcbiAgfTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuaGFzKGtleSk7XG4gIH07XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS52YWx1ZVNlcSA9IGZ1bmN0aW9uIHZhbHVlU2VxICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci52YWx1ZVNlcSgpO1xuICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UgKCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IHJldmVyc2VGYWN0b3J5KHRoaXMsIHRydWUpO1xuICAgIGlmICghdGhpcy5fdXNlS2V5cykge1xuICAgICAgcmV2ZXJzZWRTZXF1ZW5jZS52YWx1ZVNlcSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMSQxLl9pdGVyLnRvU2VxKCkucmV2ZXJzZSgpOyB9O1xuICAgIH1cbiAgICByZXR1cm4gcmV2ZXJzZWRTZXF1ZW5jZTtcbiAgfTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcCAobWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHZhciBtYXBwZWRTZXF1ZW5jZSA9IG1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KTtcbiAgICBpZiAoIXRoaXMuX3VzZUtleXMpIHtcbiAgICAgIG1hcHBlZFNlcXVlbmNlLnZhbHVlU2VxID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcyQxJDEuX2l0ZXIudG9TZXEoKS5tYXAobWFwcGVyLCBjb250ZXh0KTsgfTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcHBlZFNlcXVlbmNlO1xuICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZuKHYsIGssIHRoaXMkMSQxKTsgfSwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgcmV0dXJuIFRvS2V5ZWRTZXF1ZW5jZTtcbn0oS2V5ZWRTZXEpKTtcblRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGVbSVNfT1JERVJFRF9TWU1CT0xdID0gdHJ1ZTtcblxudmFyIFRvSW5kZXhlZFNlcXVlbmNlID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZFNlcSkge1xuICBmdW5jdGlvbiBUb0luZGV4ZWRTZXF1ZW5jZShpdGVyKSB7XG4gICAgdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgdGhpcy5zaXplID0gaXRlci5zaXplO1xuICB9XG5cbiAgaWYgKCBJbmRleGVkU2VxICkgVG9JbmRleGVkU2VxdWVuY2UuX19wcm90b19fID0gSW5kZXhlZFNlcTtcbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUb0luZGV4ZWRTZXF1ZW5jZTtcblxuICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci5pbmNsdWRlcyh2YWx1ZSk7XG4gIH07XG5cbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHJldmVyc2UgJiYgZW5zdXJlU2l6ZSh0aGlzKTtcbiAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoXG4gICAgICBmdW5jdGlvbiAodikgeyByZXR1cm4gZm4odiwgcmV2ZXJzZSA/IHRoaXMkMSQxLnNpemUgLSArK2kgOiBpKyssIHRoaXMkMSQxKTsgfSxcbiAgICAgIHJldmVyc2VcbiAgICApO1xuICB9O1xuXG4gIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9pdGVyLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgIHZhciBpID0gMDtcbiAgICByZXZlcnNlICYmIGVuc3VyZVNpemUodGhpcyk7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIHJldHVybiBzdGVwLmRvbmVcbiAgICAgICAgPyBzdGVwXG4gICAgICAgIDogaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICByZXZlcnNlID8gdGhpcyQxJDEuc2l6ZSAtICsraSA6IGkrKyxcbiAgICAgICAgICAgIHN0ZXAudmFsdWUsXG4gICAgICAgICAgICBzdGVwXG4gICAgICAgICAgKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVG9JbmRleGVkU2VxdWVuY2U7XG59KEluZGV4ZWRTZXEpKTtcblxudmFyIFRvU2V0U2VxdWVuY2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChTZXRTZXEpIHtcbiAgZnVuY3Rpb24gVG9TZXRTZXF1ZW5jZShpdGVyKSB7XG4gICAgdGhpcy5faXRlciA9IGl0ZXI7XG4gICAgdGhpcy5zaXplID0gaXRlci5zaXplO1xuICB9XG5cbiAgaWYgKCBTZXRTZXEgKSBUb1NldFNlcXVlbmNlLl9fcHJvdG9fXyA9IFNldFNlcTtcbiAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXRTZXEgJiYgU2V0U2VxLnByb3RvdHlwZSApO1xuICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFRvU2V0U2VxdWVuY2U7XG5cbiAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gaGFzIChrZXkpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci5pbmNsdWRlcyhrZXkpO1xuICB9O1xuXG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uICh2KSB7IHJldHVybiBmbih2LCB2LCB0aGlzJDEkMSk7IH0sIHJldmVyc2UpO1xuICB9O1xuXG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgcmV0dXJuIHN0ZXAuZG9uZVxuICAgICAgICA/IHN0ZXBcbiAgICAgICAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIHN0ZXAudmFsdWUsIHN0ZXAudmFsdWUsIHN0ZXApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBUb1NldFNlcXVlbmNlO1xufShTZXRTZXEpKTtcblxudmFyIEZyb21FbnRyaWVzU2VxdWVuY2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChLZXllZFNlcSkge1xuICBmdW5jdGlvbiBGcm9tRW50cmllc1NlcXVlbmNlKGVudHJpZXMpIHtcbiAgICB0aGlzLl9pdGVyID0gZW50cmllcztcbiAgICB0aGlzLnNpemUgPSBlbnRyaWVzLnNpemU7XG4gIH1cblxuICBpZiAoIEtleWVkU2VxICkgRnJvbUVudHJpZXNTZXF1ZW5jZS5fX3Byb3RvX18gPSBLZXllZFNlcTtcbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBLZXllZFNlcSAmJiBLZXllZFNlcS5wcm90b3R5cGUgKTtcbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBGcm9tRW50cmllc1NlcXVlbmNlO1xuXG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmVudHJ5U2VxID0gZnVuY3Rpb24gZW50cnlTZXEgKCkge1xuICAgIHJldHVybiB0aGlzLl9pdGVyLnRvU2VxKCk7XG4gIH07XG5cbiAgRnJvbUVudHJpZXNTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAvLyBDaGVjayBpZiBlbnRyeSBleGlzdHMgZmlyc3Qgc28gYXJyYXkgYWNjZXNzIGRvZXNuJ3QgdGhyb3cgZm9yIGhvbGVzXG4gICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICB2YWxpZGF0ZUVudHJ5KGVudHJ5KTtcbiAgICAgICAgdmFyIGluZGV4ZWRDb2xsZWN0aW9uID0gaXNDb2xsZWN0aW9uKGVudHJ5KTtcbiAgICAgICAgcmV0dXJuIGZuKFxuICAgICAgICAgIGluZGV4ZWRDb2xsZWN0aW9uID8gZW50cnkuZ2V0KDEpIDogZW50cnlbMV0sXG4gICAgICAgICAgaW5kZXhlZENvbGxlY3Rpb24gPyBlbnRyeS5nZXQoMCkgOiBlbnRyeVswXSxcbiAgICAgICAgICB0aGlzJDEkMVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0sIHJldmVyc2UpO1xuICB9O1xuXG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuICAgICAgICAvLyBpbiB0aGUgcGFyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG4gICAgICAgICAgdmFyIGluZGV4ZWRDb2xsZWN0aW9uID0gaXNDb2xsZWN0aW9uKGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBpbmRleGVkQ29sbGVjdGlvbiA/IGVudHJ5LmdldCgwKSA6IGVudHJ5WzBdLFxuICAgICAgICAgICAgaW5kZXhlZENvbGxlY3Rpb24gPyBlbnRyeS5nZXQoMSkgOiBlbnRyeVsxXSxcbiAgICAgICAgICAgIHN0ZXBcbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEZyb21FbnRyaWVzU2VxdWVuY2U7XG59KEtleWVkU2VxKSk7XG5cblRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgICBjYWNoZVJlc3VsdFRocm91Z2g7XG5cbmZ1bmN0aW9uIGZsaXBGYWN0b3J5KGNvbGxlY3Rpb24pIHtcbiAgdmFyIGZsaXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgZmxpcFNlcXVlbmNlLl9pdGVyID0gY29sbGVjdGlvbjtcbiAgZmxpcFNlcXVlbmNlLnNpemUgPSBjb2xsZWN0aW9uLnNpemU7XG4gIGZsaXBTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY29sbGVjdGlvbjsgfTtcbiAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJldmVyc2VkU2VxdWVuY2UgPSBjb2xsZWN0aW9uLnJldmVyc2UuYXBwbHkodGhpcyk7IC8vIHN1cGVyLnJldmVyc2UoKVxuICAgIHJldmVyc2VkU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbGxlY3Rpb24ucmV2ZXJzZSgpOyB9O1xuICAgIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xuICB9O1xuICBmbGlwU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gY29sbGVjdGlvbi5pbmNsdWRlcyhrZXkpOyB9O1xuICBmbGlwU2VxdWVuY2UuaW5jbHVkZXMgPSBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBjb2xsZWN0aW9uLmhhcyhrZXkpOyB9O1xuICBmbGlwU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG4gIGZsaXBTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZuKGssIHYsIHRoaXMkMSQxKSAhPT0gZmFsc2U7IH0sIHJldmVyc2UpO1xuICB9O1xuICBmbGlwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTKSB7XG4gICAgICB2YXIgaXRlcmF0b3IgPSBjb2xsZWN0aW9uLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmICghc3RlcC5kb25lKSB7XG4gICAgICAgICAgdmFyIGsgPSBzdGVwLnZhbHVlWzBdO1xuICAgICAgICAgIHN0ZXAudmFsdWVbMF0gPSBzdGVwLnZhbHVlWzFdO1xuICAgICAgICAgIHN0ZXAudmFsdWVbMV0gPSBrO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLl9faXRlcmF0b3IoXG4gICAgICB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUyA/IElURVJBVEVfS0VZUyA6IElURVJBVEVfVkFMVUVTLFxuICAgICAgcmV2ZXJzZVxuICAgICk7XG4gIH07XG4gIHJldHVybiBmbGlwU2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIG1hcEZhY3RvcnkoY29sbGVjdGlvbiwgbWFwcGVyLCBjb250ZXh0KSB7XG4gIHZhciBtYXBwZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgbWFwcGVkU2VxdWVuY2Uuc2l6ZSA9IGNvbGxlY3Rpb24uc2l6ZTtcbiAgbWFwcGVkU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gY29sbGVjdGlvbi5oYXMoa2V5KTsgfTtcbiAgbWFwcGVkU2VxdWVuY2UuZ2V0ID0gZnVuY3Rpb24gKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICB2YXIgdiA9IGNvbGxlY3Rpb24uZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgcmV0dXJuIHYgPT09IE5PVF9TRVRcbiAgICAgID8gbm90U2V0VmFsdWVcbiAgICAgIDogbWFwcGVyLmNhbGwoY29udGV4dCwgdiwga2V5LCBjb2xsZWN0aW9uKTtcbiAgfTtcbiAgbWFwcGVkU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uX19pdGVyYXRlKFxuICAgICAgZnVuY3Rpb24gKHYsIGssIGMpIHsgcmV0dXJuIGZuKG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGssIGMpLCBrLCB0aGlzJDEkMSkgIT09IGZhbHNlOyB9LFxuICAgICAgcmV2ZXJzZVxuICAgICk7XG4gIH07XG4gIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICB9XG4gICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgdmFyIGtleSA9IGVudHJ5WzBdO1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUoXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGtleSxcbiAgICAgICAgbWFwcGVyLmNhbGwoY29udGV4dCwgZW50cnlbMV0sIGtleSwgY29sbGVjdGlvbiksXG4gICAgICAgIHN0ZXBcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBtYXBwZWRTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gcmV2ZXJzZUZhY3RvcnkoY29sbGVjdGlvbiwgdXNlS2V5cykge1xuICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gIHZhciByZXZlcnNlZFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGNvbGxlY3Rpb24pO1xuICByZXZlcnNlZFNlcXVlbmNlLl9pdGVyID0gY29sbGVjdGlvbjtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5zaXplID0gY29sbGVjdGlvbi5zaXplO1xuICByZXZlcnNlZFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb2xsZWN0aW9uOyB9O1xuICBpZiAoY29sbGVjdGlvbi5mbGlwKSB7XG4gICAgcmV2ZXJzZWRTZXF1ZW5jZS5mbGlwID0gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGZsaXBTZXF1ZW5jZSA9IGZsaXBGYWN0b3J5KGNvbGxlY3Rpb24pO1xuICAgICAgZmxpcFNlcXVlbmNlLnJldmVyc2UgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb2xsZWN0aW9uLmZsaXAoKTsgfTtcbiAgICAgIHJldHVybiBmbGlwU2VxdWVuY2U7XG4gICAgfTtcbiAgfVxuICByZXZlcnNlZFNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uIChrZXksIG5vdFNldFZhbHVlKSB7IHJldHVybiBjb2xsZWN0aW9uLmdldCh1c2VLZXlzID8ga2V5IDogLTEgLSBrZXksIG5vdFNldFZhbHVlKTsgfTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5oYXMgPSBmdW5jdGlvbiAoa2V5KSB7IHJldHVybiBjb2xsZWN0aW9uLmhhcyh1c2VLZXlzID8ga2V5IDogLTEgLSBrZXkpOyB9O1xuICByZXZlcnNlZFNlcXVlbmNlLmluY2x1ZGVzID0gZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBjb2xsZWN0aW9uLmluY2x1ZGVzKHZhbHVlKTsgfTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5jYWNoZVJlc3VsdCA9IGNhY2hlUmVzdWx0VGhyb3VnaDtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGkgPSAwO1xuICAgIHJldmVyc2UgJiYgZW5zdXJlU2l6ZShjb2xsZWN0aW9uKTtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5fX2l0ZXJhdGUoXG4gICAgICBmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gZm4odiwgdXNlS2V5cyA/IGsgOiByZXZlcnNlID8gdGhpcyQxJDEuc2l6ZSAtICsraSA6IGkrKywgdGhpcyQxJDEpOyB9LFxuICAgICAgIXJldmVyc2VcbiAgICApO1xuICB9O1xuICByZXZlcnNlZFNlcXVlbmNlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpID0gMDtcbiAgICByZXZlcnNlICYmIGVuc3VyZVNpemUoY29sbGVjdGlvbik7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgIXJldmVyc2UpO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfVxuICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICB0eXBlLFxuICAgICAgICB1c2VLZXlzID8gZW50cnlbMF0gOiByZXZlcnNlID8gdGhpcyQxJDEuc2l6ZSAtICsraSA6IGkrKyxcbiAgICAgICAgZW50cnlbMV0sXG4gICAgICAgIHN0ZXBcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiByZXZlcnNlZFNlcXVlbmNlO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJGYWN0b3J5KGNvbGxlY3Rpb24sIHByZWRpY2F0ZSwgY29udGV4dCwgdXNlS2V5cykge1xuICB2YXIgZmlsdGVyU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIGlmICh1c2VLZXlzKSB7XG4gICAgZmlsdGVyU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24gKGtleSkge1xuICAgICAgdmFyIHYgPSBjb2xsZWN0aW9uLmdldChrZXksIE5PVF9TRVQpO1xuICAgICAgcmV0dXJuIHYgIT09IE5PVF9TRVQgJiYgISFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrZXksIGNvbGxlY3Rpb24pO1xuICAgIH07XG4gICAgZmlsdGVyU2VxdWVuY2UuZ2V0ID0gZnVuY3Rpb24gKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICAgIHZhciB2ID0gY29sbGVjdGlvbi5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgIHJldHVybiB2ICE9PSBOT1RfU0VUICYmIHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGtleSwgY29sbGVjdGlvbilcbiAgICAgICAgPyB2XG4gICAgICAgIDogbm90U2V0VmFsdWU7XG4gICAgfTtcbiAgfVxuICBmaWx0ZXJTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDEkMSk7XG4gICAgICB9XG4gICAgfSwgcmV2ZXJzZSk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG4gIGZpbHRlclNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZW50cnkgPSBzdGVwLnZhbHVlO1xuICAgICAgICB2YXIga2V5ID0gZW50cnlbMF07XG4gICAgICAgIHZhciB2YWx1ZSA9IGVudHJ5WzFdO1xuICAgICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdmFsdWUsIGtleSwgY29sbGVjdGlvbikpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCB1c2VLZXlzID8ga2V5IDogaXRlcmF0aW9ucysrLCB2YWx1ZSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIGZpbHRlclNlcXVlbmNlO1xufVxuXG5mdW5jdGlvbiBjb3VudEJ5RmFjdG9yeShjb2xsZWN0aW9uLCBncm91cGVyLCBjb250ZXh0KSB7XG4gIHZhciBncm91cHMgPSBNYXAoKS5hc011dGFibGUoKTtcbiAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICBncm91cHMudXBkYXRlKGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjb2xsZWN0aW9uKSwgMCwgZnVuY3Rpb24gKGEpIHsgcmV0dXJuIGEgKyAxOyB9KTtcbiAgfSk7XG4gIHJldHVybiBncm91cHMuYXNJbW11dGFibGUoKTtcbn1cblxuZnVuY3Rpb24gZ3JvdXBCeUZhY3RvcnkoY29sbGVjdGlvbiwgZ3JvdXBlciwgY29udGV4dCkge1xuICB2YXIgaXNLZXllZEl0ZXIgPSBpc0tleWVkKGNvbGxlY3Rpb24pO1xuICB2YXIgZ3JvdXBzID0gKGlzT3JkZXJlZChjb2xsZWN0aW9uKSA/IE9yZGVyZWRNYXAoKSA6IE1hcCgpKS5hc011dGFibGUoKTtcbiAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICBncm91cHMudXBkYXRlKFxuICAgICAgZ3JvdXBlci5jYWxsKGNvbnRleHQsIHYsIGssIGNvbGxlY3Rpb24pLFxuICAgICAgZnVuY3Rpb24gKGEpIHsgcmV0dXJuICgoYSA9IGEgfHwgW10pLCBhLnB1c2goaXNLZXllZEl0ZXIgPyBbaywgdl0gOiB2KSwgYSk7IH1cbiAgICApO1xuICB9KTtcbiAgdmFyIGNvZXJjZSA9IGNvbGxlY3Rpb25DbGFzcyhjb2xsZWN0aW9uKTtcbiAgcmV0dXJuIGdyb3Vwcy5tYXAoZnVuY3Rpb24gKGFycikgeyByZXR1cm4gcmVpZnkoY29sbGVjdGlvbiwgY29lcmNlKGFycikpOyB9KS5hc0ltbXV0YWJsZSgpO1xufVxuXG5mdW5jdGlvbiBzbGljZUZhY3RvcnkoY29sbGVjdGlvbiwgYmVnaW4sIGVuZCwgdXNlS2V5cykge1xuICB2YXIgb3JpZ2luYWxTaXplID0gY29sbGVjdGlvbi5zaXplO1xuXG4gIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIG9yaWdpbmFsU2l6ZSkpIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCBvcmlnaW5hbFNpemUpO1xuICB2YXIgcmVzb2x2ZWRFbmQgPSByZXNvbHZlRW5kKGVuZCwgb3JpZ2luYWxTaXplKTtcblxuICAvLyBiZWdpbiBvciBlbmQgd2lsbCBiZSBOYU4gaWYgdGhleSB3ZXJlIHByb3ZpZGVkIGFzIG5lZ2F0aXZlIG51bWJlcnMgYW5kXG4gIC8vIHRoaXMgY29sbGVjdGlvbidzIHNpemUgaXMgdW5rbm93bi4gSW4gdGhhdCBjYXNlLCBjYWNoZSBmaXJzdCBzbyB0aGVyZSBpc1xuICAvLyBhIGtub3duIHNpemUgYW5kIHRoZXNlIGRvIG5vdCByZXNvbHZlIHRvIE5hTi5cbiAgaWYgKHJlc29sdmVkQmVnaW4gIT09IHJlc29sdmVkQmVnaW4gfHwgcmVzb2x2ZWRFbmQgIT09IHJlc29sdmVkRW5kKSB7XG4gICAgcmV0dXJuIHNsaWNlRmFjdG9yeShjb2xsZWN0aW9uLnRvU2VxKCkuY2FjaGVSZXN1bHQoKSwgYmVnaW4sIGVuZCwgdXNlS2V5cyk7XG4gIH1cblxuICAvLyBOb3RlOiByZXNvbHZlZEVuZCBpcyB1bmRlZmluZWQgd2hlbiB0aGUgb3JpZ2luYWwgc2VxdWVuY2UncyBsZW5ndGggaXNcbiAgLy8gdW5rbm93biBhbmQgdGhpcyBzbGljZSBkaWQgbm90IHN1cHBseSBhbiBlbmQgYW5kIHNob3VsZCBjb250YWluIGFsbFxuICAvLyBlbGVtZW50cyBhZnRlciByZXNvbHZlZEJlZ2luLlxuICAvLyBJbiB0aGF0IGNhc2UsIHJlc29sdmVkU2l6ZSB3aWxsIGJlIE5hTiBhbmQgc2xpY2VTaXplIHdpbGwgcmVtYWluIHVuZGVmaW5lZC5cbiAgdmFyIHJlc29sdmVkU2l6ZSA9IHJlc29sdmVkRW5kIC0gcmVzb2x2ZWRCZWdpbjtcbiAgdmFyIHNsaWNlU2l6ZTtcbiAgaWYgKHJlc29sdmVkU2l6ZSA9PT0gcmVzb2x2ZWRTaXplKSB7XG4gICAgc2xpY2VTaXplID0gcmVzb2x2ZWRTaXplIDwgMCA/IDAgOiByZXNvbHZlZFNpemU7XG4gIH1cblxuICB2YXIgc2xpY2VTZXEgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG5cbiAgLy8gSWYgY29sbGVjdGlvbi5zaXplIGlzIHVuZGVmaW5lZCwgdGhlIHNpemUgb2YgdGhlIHJlYWxpemVkIHNsaWNlU2VxIGlzXG4gIC8vIHVua25vd24gYXQgdGhpcyBwb2ludCB1bmxlc3MgdGhlIG51bWJlciBvZiBpdGVtcyB0byBzbGljZSBpcyAwXG4gIHNsaWNlU2VxLnNpemUgPVxuICAgIHNsaWNlU2l6ZSA9PT0gMCA/IHNsaWNlU2l6ZSA6IChjb2xsZWN0aW9uLnNpemUgJiYgc2xpY2VTaXplKSB8fCB1bmRlZmluZWQ7XG5cbiAgaWYgKCF1c2VLZXlzICYmIGlzU2VxKGNvbGxlY3Rpb24pICYmIHNsaWNlU2l6ZSA+PSAwKSB7XG4gICAgc2xpY2VTZXEuZ2V0ID0gZnVuY3Rpb24gKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIGluZGV4ID49IDAgJiYgaW5kZXggPCBzbGljZVNpemVcbiAgICAgICAgPyBjb2xsZWN0aW9uLmdldChpbmRleCArIHJlc29sdmVkQmVnaW4sIG5vdFNldFZhbHVlKVxuICAgICAgICA6IG5vdFNldFZhbHVlO1xuICAgIH07XG4gIH1cblxuICBzbGljZVNlcS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAoc2xpY2VTaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgaWYgKHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICB9XG4gICAgdmFyIHNraXBwZWQgPSAwO1xuICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgIGlmICghKGlzU2tpcHBpbmcgJiYgKGlzU2tpcHBpbmcgPSBza2lwcGVkKysgPCByZXNvbHZlZEJlZ2luKSkpIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgIGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIHRoaXMkMSQxKSAhPT0gZmFsc2UgJiZcbiAgICAgICAgICBpdGVyYXRpb25zICE9PSBzbGljZVNpemVcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcblxuICBzbGljZVNlcS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIGlmIChzbGljZVNpemUgIT09IDAgJiYgcmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgaW5zdGFudGlhdGluZyBwYXJlbnQgaXRlcmF0b3IgaWYgdGFraW5nIDAuXG4gICAgaWYgKHNsaWNlU2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihpdGVyYXRvckRvbmUpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0b3IgPSBjb2xsZWN0aW9uLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgdmFyIHNraXBwZWQgPSAwO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdoaWxlIChza2lwcGVkKysgPCByZXNvbHZlZEJlZ2luKSB7XG4gICAgICAgIGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIH1cbiAgICAgIGlmICgrK2l0ZXJhdGlvbnMgPiBzbGljZVNpemUpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAodXNlS2V5cyB8fCB0eXBlID09PSBJVEVSQVRFX1ZBTFVFUyB8fCBzdGVwLmRvbmUpIHtcbiAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICB9XG4gICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCB1bmRlZmluZWQsIHN0ZXApO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucyAtIDEsIHN0ZXAudmFsdWVbMV0sIHN0ZXApO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBzbGljZVNlcTtcbn1cblxuZnVuY3Rpb24gdGFrZVdoaWxlRmFjdG9yeShjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgdmFyIHRha2VTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgdGFrZVNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICBjb2xsZWN0aW9uLl9faXRlcmF0ZShcbiAgICAgIGZ1bmN0aW9uICh2LCBrLCBjKSB7IHJldHVybiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSAmJiArK2l0ZXJhdGlvbnMgJiYgZm4odiwgaywgdGhpcyQxJDEpOyB9XG4gICAgKTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcbiAgdGFrZVNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgIHZhciBpdGVyYXRpbmcgPSB0cnVlO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFpdGVyYXRpbmcpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfVxuICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgIHZhciBrID0gZW50cnlbMF07XG4gICAgICB2YXIgdiA9IGVudHJ5WzFdO1xuICAgICAgaWYgKCFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDEkMSkpIHtcbiAgICAgICAgaXRlcmF0aW5nID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBzdGVwKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIHRha2VTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gc2tpcFdoaWxlRmFjdG9yeShjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcbiAgdmFyIHNraXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgc2tpcFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpc1NraXBwaW5nID0gdHJ1ZTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICAgIGlmICghKGlzU2tpcHBpbmcgJiYgKGlzU2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkpKSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgcmV0dXJuIGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIHRoaXMkMSQxKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcbiAgc2tpcFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgIHZhciBza2lwcGluZyA9IHRydWU7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0ZXA7XG4gICAgICB2YXIgaztcbiAgICAgIHZhciB2O1xuICAgICAgZG8ge1xuICAgICAgICBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgaWYgKHVzZUtleXMgfHwgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMpIHtcbiAgICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9LRVlTKSB7XG4gICAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHVuZGVmaW5lZCwgc3RlcCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZVsxXSwgc3RlcCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgayA9IGVudHJ5WzBdO1xuICAgICAgICB2ID0gZW50cnlbMV07XG4gICAgICAgIHNraXBwaW5nICYmIChza2lwcGluZyA9IHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIHRoaXMkMSQxKSk7XG4gICAgICB9IHdoaWxlIChza2lwcGluZyk7XG4gICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaywgdiwgc3RlcCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBza2lwU2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIGNvbmNhdEZhY3RvcnkoY29sbGVjdGlvbiwgdmFsdWVzKSB7XG4gIHZhciBpc0tleWVkQ29sbGVjdGlvbiA9IGlzS2V5ZWQoY29sbGVjdGlvbik7XG4gIHZhciBpdGVycyA9IFtjb2xsZWN0aW9uXVxuICAgIC5jb25jYXQodmFsdWVzKVxuICAgIC5tYXAoZnVuY3Rpb24gKHYpIHtcbiAgICAgIGlmICghaXNDb2xsZWN0aW9uKHYpKSB7XG4gICAgICAgIHYgPSBpc0tleWVkQ29sbGVjdGlvblxuICAgICAgICAgID8ga2V5ZWRTZXFGcm9tVmFsdWUodilcbiAgICAgICAgICA6IGluZGV4ZWRTZXFGcm9tVmFsdWUoQXJyYXkuaXNBcnJheSh2KSA/IHYgOiBbdl0pO1xuICAgICAgfSBlbHNlIGlmIChpc0tleWVkQ29sbGVjdGlvbikge1xuICAgICAgICB2ID0gS2V5ZWRDb2xsZWN0aW9uKHYpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHY7XG4gICAgfSlcbiAgICAuZmlsdGVyKGZ1bmN0aW9uICh2KSB7IHJldHVybiB2LnNpemUgIT09IDA7IH0pO1xuXG4gIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuXG4gIGlmIChpdGVycy5sZW5ndGggPT09IDEpIHtcbiAgICB2YXIgc2luZ2xldG9uID0gaXRlcnNbMF07XG4gICAgaWYgKFxuICAgICAgc2luZ2xldG9uID09PSBjb2xsZWN0aW9uIHx8XG4gICAgICAoaXNLZXllZENvbGxlY3Rpb24gJiYgaXNLZXllZChzaW5nbGV0b24pKSB8fFxuICAgICAgKGlzSW5kZXhlZChjb2xsZWN0aW9uKSAmJiBpc0luZGV4ZWQoc2luZ2xldG9uKSlcbiAgICApIHtcbiAgICAgIHJldHVybiBzaW5nbGV0b247XG4gICAgfVxuICB9XG5cbiAgdmFyIGNvbmNhdFNlcSA9IG5ldyBBcnJheVNlcShpdGVycyk7XG4gIGlmIChpc0tleWVkQ29sbGVjdGlvbikge1xuICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b0tleWVkU2VxKCk7XG4gIH0gZWxzZSBpZiAoIWlzSW5kZXhlZChjb2xsZWN0aW9uKSkge1xuICAgIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS50b1NldFNlcSgpO1xuICB9XG4gIGNvbmNhdFNlcSA9IGNvbmNhdFNlcS5mbGF0dGVuKHRydWUpO1xuICBjb25jYXRTZXEuc2l6ZSA9IGl0ZXJzLnJlZHVjZShmdW5jdGlvbiAoc3VtLCBzZXEpIHtcbiAgICBpZiAoc3VtICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHZhciBzaXplID0gc2VxLnNpemU7XG4gICAgICBpZiAoc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBzdW0gKyBzaXplO1xuICAgICAgfVxuICAgIH1cbiAgfSwgMCk7XG4gIHJldHVybiBjb25jYXRTZXE7XG59XG5cbmZ1bmN0aW9uIGZsYXR0ZW5GYWN0b3J5KGNvbGxlY3Rpb24sIGRlcHRoLCB1c2VLZXlzKSB7XG4gIHZhciBmbGF0U2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgc3RvcHBlZCA9IGZhbHNlO1xuICAgIGZ1bmN0aW9uIGZsYXREZWVwKGl0ZXIsIGN1cnJlbnREZXB0aCkge1xuICAgICAgaXRlci5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgaWYgKCghZGVwdGggfHwgY3VycmVudERlcHRoIDwgZGVwdGgpICYmIGlzQ29sbGVjdGlvbih2KSkge1xuICAgICAgICAgIGZsYXREZWVwKHYsIGN1cnJlbnREZXB0aCArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgICBpZiAoZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zIC0gMSwgZmxhdFNlcXVlbmNlKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gIXN0b3BwZWQ7XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICB9XG4gICAgZmxhdERlZXAoY29sbGVjdGlvbiwgMCk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG4gIGZsYXRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB2YXIgc3RhY2sgPSBbXTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB3aGlsZSAoaXRlcmF0b3IpIHtcbiAgICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChzdGVwLmRvbmUgIT09IGZhbHNlKSB7XG4gICAgICAgICAgaXRlcmF0b3IgPSBzdGFjay5wb3AoKTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdiA9IHN0ZXAudmFsdWU7XG4gICAgICAgIGlmICh0eXBlID09PSBJVEVSQVRFX0VOVFJJRVMpIHtcbiAgICAgICAgICB2ID0gdlsxXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoKCFkZXB0aCB8fCBzdGFjay5sZW5ndGggPCBkZXB0aCkgJiYgaXNDb2xsZWN0aW9uKHYpKSB7XG4gICAgICAgICAgc3RhY2sucHVzaChpdGVyYXRvcik7XG4gICAgICAgICAgaXRlcmF0b3IgPSB2Ll9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHVzZUtleXMgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHYsIHN0ZXApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBmbGF0U2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIGZsYXRNYXBGYWN0b3J5KGNvbGxlY3Rpb24sIG1hcHBlciwgY29udGV4dCkge1xuICB2YXIgY29lcmNlID0gY29sbGVjdGlvbkNsYXNzKGNvbGxlY3Rpb24pO1xuICByZXR1cm4gY29sbGVjdGlvblxuICAgIC50b1NlcSgpXG4gICAgLm1hcChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gY29lcmNlKG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGssIGNvbGxlY3Rpb24pKTsgfSlcbiAgICAuZmxhdHRlbih0cnVlKTtcbn1cblxuZnVuY3Rpb24gaW50ZXJwb3NlRmFjdG9yeShjb2xsZWN0aW9uLCBzZXBhcmF0b3IpIHtcbiAgdmFyIGludGVycG9zZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgaW50ZXJwb3NlZFNlcXVlbmNlLnNpemUgPSBjb2xsZWN0aW9uLnNpemUgJiYgY29sbGVjdGlvbi5zaXplICogMiAtIDE7XG4gIGludGVycG9zZWRTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoXG4gICAgICBmdW5jdGlvbiAodikgeyByZXR1cm4gKCFpdGVyYXRpb25zIHx8IGZuKHNlcGFyYXRvciwgaXRlcmF0aW9ucysrLCB0aGlzJDEkMSkgIT09IGZhbHNlKSAmJlxuICAgICAgICBmbih2LCBpdGVyYXRpb25zKyssIHRoaXMkMSQxKSAhPT0gZmFsc2U7IH0sXG4gICAgICByZXZlcnNlXG4gICAgKTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcbiAgaW50ZXJwb3NlZFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIHN0ZXA7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIXN0ZXAgfHwgaXRlcmF0aW9ucyAlIDIpIHtcbiAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0aW9ucyAlIDJcbiAgICAgICAgPyBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc2VwYXJhdG9yKVxuICAgICAgICA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCBzdGVwLnZhbHVlLCBzdGVwKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIGludGVycG9zZWRTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gc29ydEZhY3RvcnkoY29sbGVjdGlvbiwgY29tcGFyYXRvciwgbWFwcGVyKSB7XG4gIGlmICghY29tcGFyYXRvcikge1xuICAgIGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcbiAgfVxuICB2YXIgaXNLZXllZENvbGxlY3Rpb24gPSBpc0tleWVkKGNvbGxlY3Rpb24pO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgZW50cmllcyA9IGNvbGxlY3Rpb25cbiAgICAudG9TZXEoKVxuICAgIC5tYXAoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIFtrLCB2LCBpbmRleCsrLCBtYXBwZXIgPyBtYXBwZXIodiwgaywgY29sbGVjdGlvbikgOiB2XTsgfSlcbiAgICAudmFsdWVTZXEoKVxuICAgIC50b0FycmF5KCk7XG4gIGVudHJpZXNcbiAgICAuc29ydChmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gY29tcGFyYXRvcihhWzNdLCBiWzNdKSB8fCBhWzJdIC0gYlsyXTsgfSlcbiAgICAuZm9yRWFjaChcbiAgICAgIGlzS2V5ZWRDb2xsZWN0aW9uXG4gICAgICAgID8gZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICAgIGVudHJpZXNbaV0ubGVuZ3RoID0gMjtcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHYsIGkpIHtcbiAgICAgICAgICAgIGVudHJpZXNbaV0gPSB2WzFdO1xuICAgICAgICAgIH1cbiAgICApO1xuICByZXR1cm4gaXNLZXllZENvbGxlY3Rpb25cbiAgICA/IEtleWVkU2VxKGVudHJpZXMpXG4gICAgOiBpc0luZGV4ZWQoY29sbGVjdGlvbilcbiAgICA/IEluZGV4ZWRTZXEoZW50cmllcylcbiAgICA6IFNldFNlcShlbnRyaWVzKTtcbn1cblxuZnVuY3Rpb24gbWF4RmFjdG9yeShjb2xsZWN0aW9uLCBjb21wYXJhdG9yLCBtYXBwZXIpIHtcbiAgaWYgKCFjb21wYXJhdG9yKSB7XG4gICAgY29tcGFyYXRvciA9IGRlZmF1bHRDb21wYXJhdG9yO1xuICB9XG4gIGlmIChtYXBwZXIpIHtcbiAgICB2YXIgZW50cnkgPSBjb2xsZWN0aW9uXG4gICAgICAudG9TZXEoKVxuICAgICAgLm1hcChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gW3YsIG1hcHBlcih2LCBrLCBjb2xsZWN0aW9uKV07IH0pXG4gICAgICAucmVkdWNlKGZ1bmN0aW9uIChhLCBiKSB7IHJldHVybiAobWF4Q29tcGFyZShjb21wYXJhdG9yLCBhWzFdLCBiWzFdKSA/IGIgOiBhKTsgfSk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuICB9XG4gIHJldHVybiBjb2xsZWN0aW9uLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gKG1heENvbXBhcmUoY29tcGFyYXRvciwgYSwgYikgPyBiIDogYSk7IH0pO1xufVxuXG5mdW5jdGlvbiBtYXhDb21wYXJlKGNvbXBhcmF0b3IsIGEsIGIpIHtcbiAgdmFyIGNvbXAgPSBjb21wYXJhdG9yKGIsIGEpO1xuICAvLyBiIGlzIGNvbnNpZGVyZWQgdGhlIG5ldyBtYXggaWYgdGhlIGNvbXBhcmF0b3IgZGVjbGFyZXMgdGhlbSBlcXVhbCwgYnV0XG4gIC8vIHRoZXkgYXJlIG5vdCBlcXVhbCBhbmQgYiBpcyBpbiBmYWN0IGEgbnVsbGlzaCB2YWx1ZS5cbiAgcmV0dXJuIChcbiAgICAoY29tcCA9PT0gMCAmJiBiICE9PSBhICYmIChiID09PSB1bmRlZmluZWQgfHwgYiA9PT0gbnVsbCB8fCBiICE9PSBiKSkgfHxcbiAgICBjb21wID4gMFxuICApO1xufVxuXG5mdW5jdGlvbiB6aXBXaXRoRmFjdG9yeShrZXlJdGVyLCB6aXBwZXIsIGl0ZXJzLCB6aXBBbGwpIHtcbiAgdmFyIHppcFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGtleUl0ZXIpO1xuICB2YXIgc2l6ZXMgPSBuZXcgQXJyYXlTZXEoaXRlcnMpLm1hcChmdW5jdGlvbiAoaSkgeyByZXR1cm4gaS5zaXplOyB9KTtcbiAgemlwU2VxdWVuY2Uuc2l6ZSA9IHppcEFsbCA/IHNpemVzLm1heCgpIDogc2l6ZXMubWluKCk7XG4gIC8vIE5vdGU6IHRoaXMgYSBnZW5lcmljIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgX19pdGVyYXRlIGluIHRlcm1zIG9mXG4gIC8vIF9faXRlcmF0b3Igd2hpY2ggbWF5IGJlIG1vcmUgZ2VuZXJpY2FsbHkgdXNlZnVsIGluIHRoZSBmdXR1cmUuXG4gIHppcFNlcXVlbmNlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIC8qIGdlbmVyaWM6XG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUywgcmV2ZXJzZSk7XG4gICAgdmFyIHN0ZXA7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgIGlmIChmbihzdGVwLnZhbHVlWzFdLCBzdGVwLnZhbHVlWzBdLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICAgICovXG4gICAgLy8gaW5kZXhlZDpcbiAgICB2YXIgaXRlcmF0b3IgPSB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMsIHJldmVyc2UpO1xuICAgIHZhciBzdGVwO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICBpZiAoZm4oc3RlcC52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICB9O1xuICB6aXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpdGVyYXRvcnMgPSBpdGVycy5tYXAoXG4gICAgICBmdW5jdGlvbiAoaSkgeyByZXR1cm4gKChpID0gQ29sbGVjdGlvbihpKSksIGdldEl0ZXJhdG9yKHJldmVyc2UgPyBpLnJldmVyc2UoKSA6IGkpKTsgfVxuICAgICk7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBpc0RvbmUgPSBmYWxzZTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwcztcbiAgICAgIGlmICghaXNEb25lKSB7XG4gICAgICAgIHN0ZXBzID0gaXRlcmF0b3JzLm1hcChmdW5jdGlvbiAoaSkgeyByZXR1cm4gaS5uZXh0KCk7IH0pO1xuICAgICAgICBpc0RvbmUgPSB6aXBBbGwgPyBzdGVwcy5ldmVyeShmdW5jdGlvbiAocykgeyByZXR1cm4gcy5kb25lOyB9KSA6IHN0ZXBzLnNvbWUoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMuZG9uZTsgfSk7XG4gICAgICB9XG4gICAgICBpZiAoaXNEb25lKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICB0eXBlLFxuICAgICAgICBpdGVyYXRpb25zKyssXG4gICAgICAgIHppcHBlci5hcHBseShcbiAgICAgICAgICBudWxsLFxuICAgICAgICAgIHN0ZXBzLm1hcChmdW5jdGlvbiAocykgeyByZXR1cm4gcy52YWx1ZTsgfSlcbiAgICAgICAgKVxuICAgICAgKTtcbiAgICB9KTtcbiAgfTtcbiAgcmV0dXJuIHppcFNlcXVlbmNlO1xufVxuXG4vLyAjcHJhZ21hIEhlbHBlciBGdW5jdGlvbnNcblxuZnVuY3Rpb24gcmVpZnkoaXRlciwgc2VxKSB7XG4gIHJldHVybiBpdGVyID09PSBzZXEgPyBpdGVyIDogaXNTZXEoaXRlcikgPyBzZXEgOiBpdGVyLmNvbnN0cnVjdG9yKHNlcSk7XG59XG5cbmZ1bmN0aW9uIHZhbGlkYXRlRW50cnkoZW50cnkpIHtcbiAgaWYgKGVudHJ5ICE9PSBPYmplY3QoZW50cnkpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRXhwZWN0ZWQgW0ssIFZdIHR1cGxlOiAnICsgZW50cnkpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3Rpb25DbGFzcyhjb2xsZWN0aW9uKSB7XG4gIHJldHVybiBpc0tleWVkKGNvbGxlY3Rpb24pXG4gICAgPyBLZXllZENvbGxlY3Rpb25cbiAgICA6IGlzSW5kZXhlZChjb2xsZWN0aW9uKVxuICAgID8gSW5kZXhlZENvbGxlY3Rpb25cbiAgICA6IFNldENvbGxlY3Rpb247XG59XG5cbmZ1bmN0aW9uIG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKSB7XG4gIHJldHVybiBPYmplY3QuY3JlYXRlKFxuICAgIChpc0tleWVkKGNvbGxlY3Rpb24pXG4gICAgICA/IEtleWVkU2VxXG4gICAgICA6IGlzSW5kZXhlZChjb2xsZWN0aW9uKVxuICAgICAgPyBJbmRleGVkU2VxXG4gICAgICA6IFNldFNlcVxuICAgICkucHJvdG90eXBlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNhY2hlUmVzdWx0VGhyb3VnaCgpIHtcbiAgaWYgKHRoaXMuX2l0ZXIuY2FjaGVSZXN1bHQpIHtcbiAgICB0aGlzLl9pdGVyLmNhY2hlUmVzdWx0KCk7XG4gICAgdGhpcy5zaXplID0gdGhpcy5faXRlci5zaXplO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHJldHVybiBTZXEucHJvdG90eXBlLmNhY2hlUmVzdWx0LmNhbGwodGhpcyk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJhdG9yKGEsIGIpIHtcbiAgaWYgKGEgPT09IHVuZGVmaW5lZCAmJiBiID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChhID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIGlmIChiID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICByZXR1cm4gYSA+IGIgPyAxIDogYSA8IGIgPyAtMSA6IDA7XG59XG5cbmZ1bmN0aW9uIGFyckNvcHkoYXJyLCBvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0IHx8IDA7XG4gIHZhciBsZW4gPSBNYXRoLm1heCgwLCBhcnIubGVuZ3RoIC0gb2Zmc2V0KTtcbiAgdmFyIG5ld0FyciA9IG5ldyBBcnJheShsZW4pO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbGVuOyBpaSsrKSB7XG4gICAgbmV3QXJyW2lpXSA9IGFycltpaSArIG9mZnNldF07XG4gIH1cbiAgcmV0dXJuIG5ld0Fycjtcbn1cblxuZnVuY3Rpb24gaW52YXJpYW50KGNvbmRpdGlvbiwgZXJyb3IpIHtcbiAgaWYgKCFjb25kaXRpb24pIHsgdGhyb3cgbmV3IEVycm9yKGVycm9yKTsgfVxufVxuXG5mdW5jdGlvbiBhc3NlcnROb3RJbmZpbml0ZShzaXplKSB7XG4gIGludmFyaWFudChcbiAgICBzaXplICE9PSBJbmZpbml0eSxcbiAgICAnQ2Fubm90IHBlcmZvcm0gdGhpcyBhY3Rpb24gd2l0aCBhbiBpbmZpbml0ZSBzaXplLidcbiAgKTtcbn1cblxuZnVuY3Rpb24gY29lcmNlS2V5UGF0aChrZXlQYXRoKSB7XG4gIGlmIChpc0FycmF5TGlrZShrZXlQYXRoKSAmJiB0eXBlb2Yga2V5UGF0aCAhPT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4ga2V5UGF0aDtcbiAgfVxuICBpZiAoaXNPcmRlcmVkKGtleVBhdGgpKSB7XG4gICAgcmV0dXJuIGtleVBhdGgudG9BcnJheSgpO1xuICB9XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ0ludmFsaWQga2V5UGF0aDogZXhwZWN0ZWQgT3JkZXJlZCBDb2xsZWN0aW9uIG9yIEFycmF5OiAnICsga2V5UGF0aFxuICApO1xufVxuXG52YXIgdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuXG5mdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlKSB7XG4gIC8vIFRoZSBiYXNlIHByb3RvdHlwZSdzIHRvU3RyaW5nIGRlYWxzIHdpdGggQXJndW1lbnQgb2JqZWN0cyBhbmQgbmF0aXZlIG5hbWVzcGFjZXMgbGlrZSBNYXRoXG4gIGlmIChcbiAgICAhdmFsdWUgfHxcbiAgICB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnIHx8XG4gICAgdG9TdHJpbmcuY2FsbCh2YWx1ZSkgIT09ICdbb2JqZWN0IE9iamVjdF0nXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHZhciBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gIGlmIChwcm90byA9PT0gbnVsbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gSXRlcmF0aXZlbHkgZ29pbmcgdXAgdGhlIHByb3RvdHlwZSBjaGFpbiBpcyBuZWVkZWQgZm9yIGNyb3NzLXJlYWxtIGVudmlyb25tZW50cyAoZGlmZmVyaW5nIGNvbnRleHRzLCBpZnJhbWVzLCBldGMpXG4gIHZhciBwYXJlbnRQcm90byA9IHByb3RvO1xuICB2YXIgbmV4dFByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgd2hpbGUgKG5leHRQcm90byAhPT0gbnVsbCkge1xuICAgIHBhcmVudFByb3RvID0gbmV4dFByb3RvO1xuICAgIG5leHRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwYXJlbnRQcm90byk7XG4gIH1cbiAgcmV0dXJuIHBhcmVudFByb3RvID09PSBwcm90bztcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRydWUgaWYgdGhlIHZhbHVlIGlzIGEgcG90ZW50aWFsbHktcGVyc2lzdGVudCBkYXRhIHN0cnVjdHVyZSwgZWl0aGVyXG4gKiBwcm92aWRlZCBieSBJbW11dGFibGUuanMgb3IgYSBwbGFpbiBBcnJheSBvciBPYmplY3QuXG4gKi9cbmZ1bmN0aW9uIGlzRGF0YVN0cnVjdHVyZSh2YWx1ZSkge1xuICByZXR1cm4gKFxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICAoaXNJbW11dGFibGUodmFsdWUpIHx8IEFycmF5LmlzQXJyYXkodmFsdWUpIHx8IGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICApO1xufVxuXG5mdW5jdGlvbiBxdW90ZVN0cmluZyh2YWx1ZSkge1xuICB0cnkge1xuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gSlNPTi5zdHJpbmdpZnkodmFsdWUpIDogU3RyaW5nKHZhbHVlKTtcbiAgfSBjYXRjaCAoX2lnbm9yZUVycm9yKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHZhbHVlKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXMoY29sbGVjdGlvbiwga2V5KSB7XG4gIHJldHVybiBpc0ltbXV0YWJsZShjb2xsZWN0aW9uKVxuICAgID8gY29sbGVjdGlvbi5oYXMoa2V5KVxuICAgIDogaXNEYXRhU3RydWN0dXJlKGNvbGxlY3Rpb24pICYmIGhhc093blByb3BlcnR5LmNhbGwoY29sbGVjdGlvbiwga2V5KTtcbn1cblxuZnVuY3Rpb24gZ2V0KGNvbGxlY3Rpb24sIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgcmV0dXJuIGlzSW1tdXRhYmxlKGNvbGxlY3Rpb24pXG4gICAgPyBjb2xsZWN0aW9uLmdldChrZXksIG5vdFNldFZhbHVlKVxuICAgIDogIWhhcyhjb2xsZWN0aW9uLCBrZXkpXG4gICAgPyBub3RTZXRWYWx1ZVxuICAgIDogdHlwZW9mIGNvbGxlY3Rpb24uZ2V0ID09PSAnZnVuY3Rpb24nXG4gICAgPyBjb2xsZWN0aW9uLmdldChrZXkpXG4gICAgOiBjb2xsZWN0aW9uW2tleV07XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dDb3B5KGZyb20pIHtcbiAgaWYgKEFycmF5LmlzQXJyYXkoZnJvbSkpIHtcbiAgICByZXR1cm4gYXJyQ29weShmcm9tKTtcbiAgfVxuICB2YXIgdG8gPSB7fTtcbiAgZm9yICh2YXIga2V5IGluIGZyb20pIHtcbiAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChmcm9tLCBrZXkpKSB7XG4gICAgICB0b1trZXldID0gZnJvbVtrZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdG87XG59XG5cbmZ1bmN0aW9uIHJlbW92ZShjb2xsZWN0aW9uLCBrZXkpIHtcbiAgaWYgKCFpc0RhdGFTdHJ1Y3R1cmUoY29sbGVjdGlvbikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ0Nhbm5vdCB1cGRhdGUgbm9uLWRhdGEtc3RydWN0dXJlIHZhbHVlOiAnICsgY29sbGVjdGlvblxuICAgICk7XG4gIH1cbiAgaWYgKGlzSW1tdXRhYmxlKGNvbGxlY3Rpb24pKSB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLnJlbW92ZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCB1cGRhdGUgaW1tdXRhYmxlIHZhbHVlIHdpdGhvdXQgLnJlbW92ZSgpIG1ldGhvZDogJyArIGNvbGxlY3Rpb25cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLnJlbW92ZShrZXkpO1xuICB9XG4gIGlmICghaGFzT3duUHJvcGVydHkuY2FsbChjb2xsZWN0aW9uLCBrZXkpKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cbiAgdmFyIGNvbGxlY3Rpb25Db3B5ID0gc2hhbGxvd0NvcHkoY29sbGVjdGlvbik7XG4gIGlmIChBcnJheS5pc0FycmF5KGNvbGxlY3Rpb25Db3B5KSkge1xuICAgIGNvbGxlY3Rpb25Db3B5LnNwbGljZShrZXksIDEpO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBjb2xsZWN0aW9uQ29weVtrZXldO1xuICB9XG4gIHJldHVybiBjb2xsZWN0aW9uQ29weTtcbn1cblxuZnVuY3Rpb24gc2V0KGNvbGxlY3Rpb24sIGtleSwgdmFsdWUpIHtcbiAgaWYgKCFpc0RhdGFTdHJ1Y3R1cmUoY29sbGVjdGlvbikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ0Nhbm5vdCB1cGRhdGUgbm9uLWRhdGEtc3RydWN0dXJlIHZhbHVlOiAnICsgY29sbGVjdGlvblxuICAgICk7XG4gIH1cbiAgaWYgKGlzSW1tdXRhYmxlKGNvbGxlY3Rpb24pKSB7XG4gICAgaWYgKCFjb2xsZWN0aW9uLnNldCkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ0Nhbm5vdCB1cGRhdGUgaW1tdXRhYmxlIHZhbHVlIHdpdGhvdXQgLnNldCgpIG1ldGhvZDogJyArIGNvbGxlY3Rpb25cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBjb2xsZWN0aW9uLnNldChrZXksIHZhbHVlKTtcbiAgfVxuICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb2xsZWN0aW9uLCBrZXkpICYmIHZhbHVlID09PSBjb2xsZWN0aW9uW2tleV0pIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbjtcbiAgfVxuICB2YXIgY29sbGVjdGlvbkNvcHkgPSBzaGFsbG93Q29weShjb2xsZWN0aW9uKTtcbiAgY29sbGVjdGlvbkNvcHlba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gY29sbGVjdGlvbkNvcHk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUluJDEoY29sbGVjdGlvbiwga2V5UGF0aCwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgaWYgKCF1cGRhdGVyKSB7XG4gICAgdXBkYXRlciA9IG5vdFNldFZhbHVlO1xuICAgIG5vdFNldFZhbHVlID0gdW5kZWZpbmVkO1xuICB9XG4gIHZhciB1cGRhdGVkVmFsdWUgPSB1cGRhdGVJbkRlZXBseShcbiAgICBpc0ltbXV0YWJsZShjb2xsZWN0aW9uKSxcbiAgICBjb2xsZWN0aW9uLFxuICAgIGNvZXJjZUtleVBhdGgoa2V5UGF0aCksXG4gICAgMCxcbiAgICBub3RTZXRWYWx1ZSxcbiAgICB1cGRhdGVyXG4gICk7XG4gIHJldHVybiB1cGRhdGVkVmFsdWUgPT09IE5PVF9TRVQgPyBub3RTZXRWYWx1ZSA6IHVwZGF0ZWRWYWx1ZTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlSW5EZWVwbHkoXG4gIGluSW1tdXRhYmxlLFxuICBleGlzdGluZyxcbiAga2V5UGF0aCxcbiAgaSxcbiAgbm90U2V0VmFsdWUsXG4gIHVwZGF0ZXJcbikge1xuICB2YXIgd2FzTm90U2V0ID0gZXhpc3RpbmcgPT09IE5PVF9TRVQ7XG4gIGlmIChpID09PSBrZXlQYXRoLmxlbmd0aCkge1xuICAgIHZhciBleGlzdGluZ1ZhbHVlID0gd2FzTm90U2V0ID8gbm90U2V0VmFsdWUgOiBleGlzdGluZztcbiAgICB2YXIgbmV3VmFsdWUgPSB1cGRhdGVyKGV4aXN0aW5nVmFsdWUpO1xuICAgIHJldHVybiBuZXdWYWx1ZSA9PT0gZXhpc3RpbmdWYWx1ZSA/IGV4aXN0aW5nIDogbmV3VmFsdWU7XG4gIH1cbiAgaWYgKCF3YXNOb3RTZXQgJiYgIWlzRGF0YVN0cnVjdHVyZShleGlzdGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ0Nhbm5vdCB1cGRhdGUgd2l0aGluIG5vbi1kYXRhLXN0cnVjdHVyZSB2YWx1ZSBpbiBwYXRoIFsnICtcbiAgICAgICAga2V5UGF0aC5zbGljZSgwLCBpKS5tYXAocXVvdGVTdHJpbmcpICtcbiAgICAgICAgJ106ICcgK1xuICAgICAgICBleGlzdGluZ1xuICAgICk7XG4gIH1cbiAgdmFyIGtleSA9IGtleVBhdGhbaV07XG4gIHZhciBuZXh0RXhpc3RpbmcgPSB3YXNOb3RTZXQgPyBOT1RfU0VUIDogZ2V0KGV4aXN0aW5nLCBrZXksIE5PVF9TRVQpO1xuICB2YXIgbmV4dFVwZGF0ZWQgPSB1cGRhdGVJbkRlZXBseShcbiAgICBuZXh0RXhpc3RpbmcgPT09IE5PVF9TRVQgPyBpbkltbXV0YWJsZSA6IGlzSW1tdXRhYmxlKG5leHRFeGlzdGluZyksXG4gICAgbmV4dEV4aXN0aW5nLFxuICAgIGtleVBhdGgsXG4gICAgaSArIDEsXG4gICAgbm90U2V0VmFsdWUsXG4gICAgdXBkYXRlclxuICApO1xuICByZXR1cm4gbmV4dFVwZGF0ZWQgPT09IG5leHRFeGlzdGluZ1xuICAgID8gZXhpc3RpbmdcbiAgICA6IG5leHRVcGRhdGVkID09PSBOT1RfU0VUXG4gICAgPyByZW1vdmUoZXhpc3RpbmcsIGtleSlcbiAgICA6IHNldChcbiAgICAgICAgd2FzTm90U2V0ID8gKGluSW1tdXRhYmxlID8gZW1wdHlNYXAoKSA6IHt9KSA6IGV4aXN0aW5nLFxuICAgICAgICBrZXksXG4gICAgICAgIG5leHRVcGRhdGVkXG4gICAgICApO1xufVxuXG5mdW5jdGlvbiBzZXRJbiQxKGNvbGxlY3Rpb24sIGtleVBhdGgsIHZhbHVlKSB7XG4gIHJldHVybiB1cGRhdGVJbiQxKGNvbGxlY3Rpb24sIGtleVBhdGgsIE5PVF9TRVQsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHZhbHVlOyB9KTtcbn1cblxuZnVuY3Rpb24gc2V0SW4oa2V5UGF0aCwgdikge1xuICByZXR1cm4gc2V0SW4kMSh0aGlzLCBrZXlQYXRoLCB2KTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlSW4oY29sbGVjdGlvbiwga2V5UGF0aCkge1xuICByZXR1cm4gdXBkYXRlSW4kMShjb2xsZWN0aW9uLCBrZXlQYXRoLCBmdW5jdGlvbiAoKSB7IHJldHVybiBOT1RfU0VUOyB9KTtcbn1cblxuZnVuY3Rpb24gZGVsZXRlSW4oa2V5UGF0aCkge1xuICByZXR1cm4gcmVtb3ZlSW4odGhpcywga2V5UGF0aCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZSQxKGNvbGxlY3Rpb24sIGtleSwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgcmV0dXJuIHVwZGF0ZUluJDEoY29sbGVjdGlvbiwgW2tleV0sIG5vdFNldFZhbHVlLCB1cGRhdGVyKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlKGtleSwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpIHtcbiAgcmV0dXJuIGFyZ3VtZW50cy5sZW5ndGggPT09IDFcbiAgICA/IGtleSh0aGlzKVxuICAgIDogdXBkYXRlJDEodGhpcywga2V5LCBub3RTZXRWYWx1ZSwgdXBkYXRlcik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUluKGtleVBhdGgsIG5vdFNldFZhbHVlLCB1cGRhdGVyKSB7XG4gIHJldHVybiB1cGRhdGVJbiQxKHRoaXMsIGtleVBhdGgsIG5vdFNldFZhbHVlLCB1cGRhdGVyKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2UkMSgpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gIHJldHVybiBtZXJnZUludG9LZXllZFdpdGgodGhpcywgaXRlcnMpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVdpdGgkMShtZXJnZXIpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGl0ZXJzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIGlmICh0eXBlb2YgbWVyZ2VyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBtZXJnZXIgZnVuY3Rpb246ICcgKyBtZXJnZXIpO1xuICB9XG4gIHJldHVybiBtZXJnZUludG9LZXllZFdpdGgodGhpcywgaXRlcnMsIG1lcmdlcik7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW50b0tleWVkV2l0aChjb2xsZWN0aW9uLCBjb2xsZWN0aW9ucywgbWVyZ2VyKSB7XG4gIHZhciBpdGVycyA9IFtdO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgY29sbGVjdGlvbnMubGVuZ3RoOyBpaSsrKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24kMSA9IEtleWVkQ29sbGVjdGlvbihjb2xsZWN0aW9uc1tpaV0pO1xuICAgIGlmIChjb2xsZWN0aW9uJDEuc2l6ZSAhPT0gMCkge1xuICAgICAgaXRlcnMucHVzaChjb2xsZWN0aW9uJDEpO1xuICAgIH1cbiAgfVxuICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cbiAgaWYgKFxuICAgIGNvbGxlY3Rpb24udG9TZXEoKS5zaXplID09PSAwICYmXG4gICAgIWNvbGxlY3Rpb24uX19vd25lcklEICYmXG4gICAgaXRlcnMubGVuZ3RoID09PSAxXG4gICkge1xuICAgIHJldHVybiBjb2xsZWN0aW9uLmNvbnN0cnVjdG9yKGl0ZXJzWzBdKTtcbiAgfVxuICByZXR1cm4gY29sbGVjdGlvbi53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChjb2xsZWN0aW9uKSB7XG4gICAgdmFyIG1lcmdlSW50b0NvbGxlY3Rpb24gPSBtZXJnZXJcbiAgICAgID8gZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICB1cGRhdGUkMShjb2xsZWN0aW9uLCBrZXksIE5PVF9TRVQsIGZ1bmN0aW9uIChvbGRWYWwpIHsgcmV0dXJuIG9sZFZhbCA9PT0gTk9UX1NFVCA/IHZhbHVlIDogbWVyZ2VyKG9sZFZhbCwgdmFsdWUsIGtleSk7IH1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgY29sbGVjdGlvbi5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgICAgIH07XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGl0ZXJzLmxlbmd0aDsgaWkrKykge1xuICAgICAgaXRlcnNbaWldLmZvckVhY2gobWVyZ2VJbnRvQ29sbGVjdGlvbik7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gbWVyZ2UoY29sbGVjdGlvbikge1xuICB2YXIgc291cmNlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBzb3VyY2VzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHJldHVybiBtZXJnZVdpdGhTb3VyY2VzKGNvbGxlY3Rpb24sIHNvdXJjZXMpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVdpdGgobWVyZ2VyLCBjb2xsZWN0aW9uKSB7XG4gIHZhciBzb3VyY2VzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIHNvdXJjZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAyIF07XG5cbiAgcmV0dXJuIG1lcmdlV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgbWVyZ2VyKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwJDEoY29sbGVjdGlvbikge1xuICB2YXIgc291cmNlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBzb3VyY2VzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHJldHVybiBtZXJnZURlZXBXaXRoU291cmNlcyhjb2xsZWN0aW9uLCBzb3VyY2VzKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwV2l0aCQxKG1lcmdlciwgY29sbGVjdGlvbikge1xuICB2YXIgc291cmNlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBzb3VyY2VzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMiBdO1xuXG4gIHJldHVybiBtZXJnZURlZXBXaXRoU291cmNlcyhjb2xsZWN0aW9uLCBzb3VyY2VzLCBtZXJnZXIpO1xufVxuXG5mdW5jdGlvbiBtZXJnZURlZXBXaXRoU291cmNlcyhjb2xsZWN0aW9uLCBzb3VyY2VzLCBtZXJnZXIpIHtcbiAgcmV0dXJuIG1lcmdlV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgZGVlcE1lcmdlcldpdGgobWVyZ2VyKSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgbWVyZ2VyKSB7XG4gIGlmICghaXNEYXRhU3RydWN0dXJlKGNvbGxlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdDYW5ub3QgbWVyZ2UgaW50byBub24tZGF0YS1zdHJ1Y3R1cmUgdmFsdWU6ICcgKyBjb2xsZWN0aW9uXG4gICAgKTtcbiAgfVxuICBpZiAoaXNJbW11dGFibGUoY29sbGVjdGlvbikpIHtcbiAgICByZXR1cm4gdHlwZW9mIG1lcmdlciA9PT0gJ2Z1bmN0aW9uJyAmJiBjb2xsZWN0aW9uLm1lcmdlV2l0aFxuICAgICAgPyBjb2xsZWN0aW9uLm1lcmdlV2l0aC5hcHBseShjb2xsZWN0aW9uLCBbIG1lcmdlciBdLmNvbmNhdCggc291cmNlcyApKVxuICAgICAgOiBjb2xsZWN0aW9uLm1lcmdlXG4gICAgICA/IGNvbGxlY3Rpb24ubWVyZ2UuYXBwbHkoY29sbGVjdGlvbiwgc291cmNlcylcbiAgICAgIDogY29sbGVjdGlvbi5jb25jYXQuYXBwbHkoY29sbGVjdGlvbiwgc291cmNlcyk7XG4gIH1cbiAgdmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5KGNvbGxlY3Rpb24pO1xuICB2YXIgbWVyZ2VkID0gY29sbGVjdGlvbjtcbiAgdmFyIENvbGxlY3Rpb24gPSBpc0FycmF5ID8gSW5kZXhlZENvbGxlY3Rpb24gOiBLZXllZENvbGxlY3Rpb247XG4gIHZhciBtZXJnZUl0ZW0gPSBpc0FycmF5XG4gICAgPyBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgLy8gQ29weSBvbiB3cml0ZVxuICAgICAgICBpZiAobWVyZ2VkID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgbWVyZ2VkID0gc2hhbGxvd0NvcHkobWVyZ2VkKTtcbiAgICAgICAgfVxuICAgICAgICBtZXJnZWQucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgOiBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICB2YXIgaGFzVmFsID0gaGFzT3duUHJvcGVydHkuY2FsbChtZXJnZWQsIGtleSk7XG4gICAgICAgIHZhciBuZXh0VmFsID1cbiAgICAgICAgICBoYXNWYWwgJiYgbWVyZ2VyID8gbWVyZ2VyKG1lcmdlZFtrZXldLCB2YWx1ZSwga2V5KSA6IHZhbHVlO1xuICAgICAgICBpZiAoIWhhc1ZhbCB8fCBuZXh0VmFsICE9PSBtZXJnZWRba2V5XSkge1xuICAgICAgICAgIC8vIENvcHkgb24gd3JpdGVcbiAgICAgICAgICBpZiAobWVyZ2VkID09PSBjb2xsZWN0aW9uKSB7XG4gICAgICAgICAgICBtZXJnZWQgPSBzaGFsbG93Q29weShtZXJnZWQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBtZXJnZWRba2V5XSA9IG5leHRWYWw7XG4gICAgICAgIH1cbiAgICAgIH07XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlcy5sZW5ndGg7IGkrKykge1xuICAgIENvbGxlY3Rpb24oc291cmNlc1tpXSkuZm9yRWFjaChtZXJnZUl0ZW0pO1xuICB9XG4gIHJldHVybiBtZXJnZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZXBNZXJnZXJXaXRoKG1lcmdlcikge1xuICBmdW5jdGlvbiBkZWVwTWVyZ2VyKG9sZFZhbHVlLCBuZXdWYWx1ZSwga2V5KSB7XG4gICAgcmV0dXJuIGlzRGF0YVN0cnVjdHVyZShvbGRWYWx1ZSkgJiZcbiAgICAgIGlzRGF0YVN0cnVjdHVyZShuZXdWYWx1ZSkgJiZcbiAgICAgIGFyZU1lcmdlYWJsZShvbGRWYWx1ZSwgbmV3VmFsdWUpXG4gICAgICA/IG1lcmdlV2l0aFNvdXJjZXMob2xkVmFsdWUsIFtuZXdWYWx1ZV0sIGRlZXBNZXJnZXIpXG4gICAgICA6IG1lcmdlclxuICAgICAgPyBtZXJnZXIob2xkVmFsdWUsIG5ld1ZhbHVlLCBrZXkpXG4gICAgICA6IG5ld1ZhbHVlO1xuICB9XG4gIHJldHVybiBkZWVwTWVyZ2VyO1xufVxuXG4vKipcbiAqIEl0J3MgdW5jbGVhciB3aGF0IHRoZSBkZXNpcmVkIGJlaGF2aW9yIGlzIGZvciBtZXJnaW5nIHR3byBjb2xsZWN0aW9ucyB0aGF0XG4gKiBmYWxsIGludG8gc2VwYXJhdGUgY2F0ZWdvcmllcyBiZXR3ZWVuIGtleWVkLCBpbmRleGVkLCBvciBzZXQtbGlrZSwgc28gd2Ugb25seVxuICogY29uc2lkZXIgdGhlbSBtZXJnZWFibGUgaWYgdGhleSBmYWxsIGludG8gdGhlIHNhbWUgY2F0ZWdvcnkuXG4gKi9cbmZ1bmN0aW9uIGFyZU1lcmdlYWJsZShvbGREYXRhU3RydWN0dXJlLCBuZXdEYXRhU3RydWN0dXJlKSB7XG4gIHZhciBvbGRTZXEgPSBTZXEob2xkRGF0YVN0cnVjdHVyZSk7XG4gIHZhciBuZXdTZXEgPSBTZXEobmV3RGF0YVN0cnVjdHVyZSk7XG4gIC8vIFRoaXMgbG9naWMgYXNzdW1lcyB0aGF0IGEgc2VxdWVuY2UgY2FuIG9ubHkgZmFsbCBpbnRvIG9uZSBvZiB0aGUgdGhyZWVcbiAgLy8gY2F0ZWdvcmllcyBtZW50aW9uZWQgYWJvdmUgKHNpbmNlIHRoZXJlJ3Mgbm8gYGlzU2V0TGlrZSgpYCBtZXRob2QpLlxuICByZXR1cm4gKFxuICAgIGlzSW5kZXhlZChvbGRTZXEpID09PSBpc0luZGV4ZWQobmV3U2VxKSAmJlxuICAgIGlzS2V5ZWQob2xkU2VxKSA9PT0gaXNLZXllZChuZXdTZXEpXG4gICk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcCgpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gIHJldHVybiBtZXJnZURlZXBXaXRoU291cmNlcyh0aGlzLCBpdGVycyk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcFdpdGgobWVyZ2VyKSB7XG4gIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICByZXR1cm4gbWVyZ2VEZWVwV2l0aFNvdXJjZXModGhpcywgaXRlcnMsIG1lcmdlcik7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW4oa2V5UGF0aCkge1xuICB2YXIgaXRlcnMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgcmV0dXJuIHVwZGF0ZUluJDEodGhpcywga2V5UGF0aCwgZW1wdHlNYXAoKSwgZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1lcmdlV2l0aFNvdXJjZXMobSwgaXRlcnMpOyB9KTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwSW4oa2V5UGF0aCkge1xuICB2YXIgaXRlcnMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgcmV0dXJuIHVwZGF0ZUluJDEodGhpcywga2V5UGF0aCwgZW1wdHlNYXAoKSwgZnVuY3Rpb24gKG0pIHsgcmV0dXJuIG1lcmdlRGVlcFdpdGhTb3VyY2VzKG0sIGl0ZXJzKTsgfVxuICApO1xufVxuXG5mdW5jdGlvbiB3aXRoTXV0YXRpb25zKGZuKSB7XG4gIHZhciBtdXRhYmxlID0gdGhpcy5hc011dGFibGUoKTtcbiAgZm4obXV0YWJsZSk7XG4gIHJldHVybiBtdXRhYmxlLndhc0FsdGVyZWQoKSA/IG11dGFibGUuX19lbnN1cmVPd25lcih0aGlzLl9fb3duZXJJRCkgOiB0aGlzO1xufVxuXG5mdW5jdGlvbiBhc011dGFibGUoKSB7XG4gIHJldHVybiB0aGlzLl9fb3duZXJJRCA/IHRoaXMgOiB0aGlzLl9fZW5zdXJlT3duZXIobmV3IE93bmVySUQoKSk7XG59XG5cbmZ1bmN0aW9uIGFzSW1tdXRhYmxlKCkge1xuICByZXR1cm4gdGhpcy5fX2Vuc3VyZU93bmVyKCk7XG59XG5cbmZ1bmN0aW9uIHdhc0FsdGVyZWQoKSB7XG4gIHJldHVybiB0aGlzLl9fYWx0ZXJlZDtcbn1cblxudmFyIE1hcCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEtleWVkQ29sbGVjdGlvbikge1xuICBmdW5jdGlvbiBNYXAodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eU1hcCgpXG4gICAgICA6IGlzTWFwKHZhbHVlKSAmJiAhaXNPcmRlcmVkKHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKG1hcCkge1xuICAgICAgICAgIHZhciBpdGVyID0gS2V5ZWRDb2xsZWN0aW9uKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gbWFwLnNldChrLCB2KTsgfSk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgaWYgKCBLZXllZENvbGxlY3Rpb24gKSBNYXAuX19wcm90b19fID0gS2V5ZWRDb2xsZWN0aW9uO1xuICBNYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggS2V5ZWRDb2xsZWN0aW9uICYmIEtleWVkQ29sbGVjdGlvbi5wcm90b3R5cGUgKTtcbiAgTWFwLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1hcDtcblxuICBNYXAub2YgPSBmdW5jdGlvbiBvZiAoKSB7XG4gICAgdmFyIGtleVZhbHVlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBrZXlWYWx1ZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIHJldHVybiBlbXB0eU1hcCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKG1hcCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlWYWx1ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICAgICAgaWYgKGkgKyAxID49IGtleVZhbHVlcy5sZW5ndGgpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pc3NpbmcgdmFsdWUgZm9yIGtleTogJyArIGtleVZhbHVlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgICAgbWFwLnNldChrZXlWYWx1ZXNbaV0sIGtleVZhbHVlc1tpICsgMV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIE1hcC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnTWFwIHsnLCAnfScpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGssIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX3Jvb3RcbiAgICAgID8gdGhpcy5fcm9vdC5nZXQoMCwgdW5kZWZpbmVkLCBrLCBub3RTZXRWYWx1ZSlcbiAgICAgIDogbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICBNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAoaywgdikge1xuICAgIHJldHVybiB1cGRhdGVNYXAodGhpcywgaywgdik7XG4gIH07XG5cbiAgTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGspIHtcbiAgICByZXR1cm4gdXBkYXRlTWFwKHRoaXMsIGssIE5PVF9TRVQpO1xuICB9O1xuXG4gIE1hcC5wcm90b3R5cGUuZGVsZXRlQWxsID0gZnVuY3Rpb24gZGVsZXRlQWxsIChrZXlzKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSBDb2xsZWN0aW9uKGtleXMpO1xuXG4gICAgaWYgKGNvbGxlY3Rpb24uc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobWFwKSB7XG4gICAgICBjb2xsZWN0aW9uLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gbWFwLnJlbW92ZShrZXkpOyB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIgKCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBlbXB0eU1hcCgpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQ29tcG9zaXRpb25cblxuICBNYXAucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiBzb3J0IChjb21wYXJhdG9yKSB7XG4gICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuICB9O1xuXG4gIE1hcC5wcm90b3R5cGUuc29ydEJ5ID0gZnVuY3Rpb24gc29ydEJ5IChtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICByZXR1cm4gT3JkZXJlZE1hcChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpKTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcCAobWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKG1hcCkge1xuICAgICAgbWFwLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgbWFwLnNldChrZXksIG1hcHBlci5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIHRoaXMkMSQxKSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIE11dGFiaWxpdHlcblxuICBNYXAucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIG5ldyBNYXBJdGVyYXRvcih0aGlzLCB0eXBlLCByZXZlcnNlKTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHRoaXMuX3Jvb3QgJiZcbiAgICAgIHRoaXMuX3Jvb3QuaXRlcmF0ZShmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICByZXR1cm4gZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDEkMSk7XG4gICAgICB9LCByZXZlcnNlKTtcbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eU1hcCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZU1hcCh0aGlzLnNpemUsIHRoaXMuX3Jvb3QsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgfTtcblxuICByZXR1cm4gTWFwO1xufShLZXllZENvbGxlY3Rpb24pKTtcblxuTWFwLmlzTWFwID0gaXNNYXA7XG5cbnZhciBNYXBQcm90b3R5cGUgPSBNYXAucHJvdG90eXBlO1xuTWFwUHJvdG90eXBlW0lTX01BUF9TWU1CT0xdID0gdHJ1ZTtcbk1hcFByb3RvdHlwZVtERUxFVEVdID0gTWFwUHJvdG90eXBlLnJlbW92ZTtcbk1hcFByb3RvdHlwZS5yZW1vdmVBbGwgPSBNYXBQcm90b3R5cGUuZGVsZXRlQWxsO1xuTWFwUHJvdG90eXBlLnNldEluID0gc2V0SW47XG5NYXBQcm90b3R5cGUucmVtb3ZlSW4gPSBNYXBQcm90b3R5cGUuZGVsZXRlSW4gPSBkZWxldGVJbjtcbk1hcFByb3RvdHlwZS51cGRhdGUgPSB1cGRhdGU7XG5NYXBQcm90b3R5cGUudXBkYXRlSW4gPSB1cGRhdGVJbjtcbk1hcFByb3RvdHlwZS5tZXJnZSA9IE1hcFByb3RvdHlwZS5jb25jYXQgPSBtZXJnZSQxO1xuTWFwUHJvdG90eXBlLm1lcmdlV2l0aCA9IG1lcmdlV2l0aCQxO1xuTWFwUHJvdG90eXBlLm1lcmdlRGVlcCA9IG1lcmdlRGVlcDtcbk1hcFByb3RvdHlwZS5tZXJnZURlZXBXaXRoID0gbWVyZ2VEZWVwV2l0aDtcbk1hcFByb3RvdHlwZS5tZXJnZUluID0gbWVyZ2VJbjtcbk1hcFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IG1lcmdlRGVlcEluO1xuTWFwUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuTWFwUHJvdG90eXBlLndhc0FsdGVyZWQgPSB3YXNBbHRlcmVkO1xuTWFwUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5NYXBQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBNYXBQcm90b3R5cGUuYXNNdXRhYmxlID0gYXNNdXRhYmxlO1xuTWFwUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgYXJyKSB7XG4gIHJldHVybiByZXN1bHQuc2V0KGFyclswXSwgYXJyWzFdKTtcbn07XG5NYXBQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iai5hc0ltbXV0YWJsZSgpO1xufTtcblxuLy8gI3ByYWdtYSBUcmllIE5vZGVzXG5cbnZhciBBcnJheU1hcE5vZGUgPSBmdW5jdGlvbiBBcnJheU1hcE5vZGUob3duZXJJRCwgZW50cmllcykge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xufTtcblxuQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuICAgICAgcmV0dXJuIGVudHJpZXNbaWldWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbm90U2V0VmFsdWU7XG59O1xuXG5BcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7XG4gIGZvciAoOyBpZHggPCBsZW47IGlkeCsrKSB7XG4gICAgaWYgKGlzKGtleSwgZW50cmllc1tpZHhdWzBdKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBleGlzdHMgPSBpZHggPCBsZW47XG5cbiAgaWYgKGV4aXN0cyA/IGVudHJpZXNbaWR4XVsxXSA9PT0gdmFsdWUgOiByZW1vdmVkKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAocmVtb3ZlZCB8fCAhZXhpc3RzKSAmJiBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG5cbiAgaWYgKHJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKCFleGlzdHMgJiYgIXJlbW92ZWQgJiYgZW50cmllcy5sZW5ndGggPj0gTUFYX0FSUkFZX01BUF9TSVpFKSB7XG4gICAgcmV0dXJuIGNyZWF0ZU5vZGVzKG93bmVySUQsIGVudHJpZXMsIGtleSwgdmFsdWUpO1xuICB9XG5cbiAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cbiAgaWYgKGV4aXN0cykge1xuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICBpZHggPT09IGxlbiAtIDFcbiAgICAgICAgPyBuZXdFbnRyaWVzLnBvcCgpXG4gICAgICAgIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9XG5cbiAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBBcnJheU1hcE5vZGUob3duZXJJRCwgbmV3RW50cmllcyk7XG59O1xuXG52YXIgQml0bWFwSW5kZXhlZE5vZGUgPSBmdW5jdGlvbiBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBiaXRtYXAsIG5vZGVzKSB7XG4gIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG4gIHRoaXMuYml0bWFwID0gYml0bWFwO1xuICB0aGlzLm5vZGVzID0gbm9kZXM7XG59O1xuXG5CaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgfVxuICB2YXIgYml0ID0gMSA8PCAoKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0spO1xuICB2YXIgYml0bWFwID0gdGhpcy5iaXRtYXA7XG4gIHJldHVybiAoYml0bWFwICYgYml0KSA9PT0gMFxuICAgID8gbm90U2V0VmFsdWVcbiAgICA6IHRoaXMubm9kZXNbcG9wQ291bnQoYml0bWFwICYgKGJpdCAtIDEpKV0uZ2V0KFxuICAgICAgICBzaGlmdCArIFNISUZULFxuICAgICAgICBrZXlIYXNoLFxuICAgICAgICBrZXksXG4gICAgICAgIG5vdFNldFZhbHVlXG4gICAgICApO1xufTtcblxuQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICB9XG4gIHZhciBrZXlIYXNoRnJhZyA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICB2YXIgYml0ID0gMSA8PCBrZXlIYXNoRnJhZztcbiAgdmFyIGJpdG1hcCA9IHRoaXMuYml0bWFwO1xuICB2YXIgZXhpc3RzID0gKGJpdG1hcCAmIGJpdCkgIT09IDA7XG5cbiAgaWYgKCFleGlzdHMgJiYgdmFsdWUgPT09IE5PVF9TRVQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBpZHggPSBwb3BDb3VudChiaXRtYXAgJiAoYml0IC0gMSkpO1xuICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICB2YXIgbm9kZSA9IGV4aXN0cyA/IG5vZGVzW2lkeF0gOiB1bmRlZmluZWQ7XG4gIHZhciBuZXdOb2RlID0gdXBkYXRlTm9kZShcbiAgICBub2RlLFxuICAgIG93bmVySUQsXG4gICAgc2hpZnQgKyBTSElGVCxcbiAgICBrZXlIYXNoLFxuICAgIGtleSxcbiAgICB2YWx1ZSxcbiAgICBkaWRDaGFuZ2VTaXplLFxuICAgIGRpZEFsdGVyXG4gICk7XG5cbiAgaWYgKG5ld05vZGUgPT09IG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGlmICghZXhpc3RzICYmIG5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID49IE1BWF9CSVRNQVBfSU5ERVhFRF9TSVpFKSB7XG4gICAgcmV0dXJuIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGtleUhhc2hGcmFnLCBuZXdOb2RlKTtcbiAgfVxuXG4gIGlmIChcbiAgICBleGlzdHMgJiZcbiAgICAhbmV3Tm9kZSAmJlxuICAgIG5vZGVzLmxlbmd0aCA9PT0gMiAmJlxuICAgIGlzTGVhZk5vZGUobm9kZXNbaWR4IF4gMV0pXG4gICkge1xuICAgIHJldHVybiBub2Rlc1tpZHggXiAxXTtcbiAgfVxuXG4gIGlmIChleGlzdHMgJiYgbmV3Tm9kZSAmJiBub2Rlcy5sZW5ndGggPT09IDEgJiYgaXNMZWFmTm9kZShuZXdOb2RlKSkge1xuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG5cbiAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgdmFyIG5ld0JpdG1hcCA9IGV4aXN0cyA/IChuZXdOb2RlID8gYml0bWFwIDogYml0bWFwIF4gYml0KSA6IGJpdG1hcCB8IGJpdDtcbiAgdmFyIG5ld05vZGVzID0gZXhpc3RzXG4gICAgPyBuZXdOb2RlXG4gICAgICA/IHNldEF0KG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpXG4gICAgICA6IHNwbGljZU91dChub2RlcywgaWR4LCBpc0VkaXRhYmxlKVxuICAgIDogc3BsaWNlSW4obm9kZXMsIGlkeCwgbmV3Tm9kZSwgaXNFZGl0YWJsZSk7XG5cbiAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICB0aGlzLmJpdG1hcCA9IG5ld0JpdG1hcDtcbiAgICB0aGlzLm5vZGVzID0gbmV3Tm9kZXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gbmV3IEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIG5ld0JpdG1hcCwgbmV3Tm9kZXMpO1xufTtcblxudmFyIEhhc2hBcnJheU1hcE5vZGUgPSBmdW5jdGlvbiBIYXNoQXJyYXlNYXBOb2RlKG93bmVySUQsIGNvdW50LCBub2Rlcykge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmNvdW50ID0gY291bnQ7XG4gIHRoaXMubm9kZXMgPSBub2Rlcztcbn07XG5cbkhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gIH1cbiAgdmFyIGlkeCA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICB2YXIgbm9kZSA9IHRoaXMubm9kZXNbaWR4XTtcbiAgcmV0dXJuIG5vZGVcbiAgICA/IG5vZGUuZ2V0KHNoaWZ0ICsgU0hJRlQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpXG4gICAgOiBub3RTZXRWYWx1ZTtcbn07XG5cbkhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICB9XG4gIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgdmFyIHJlbW92ZWQgPSB2YWx1ZSA9PT0gTk9UX1NFVDtcbiAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgdmFyIG5vZGUgPSBub2Rlc1tpZHhdO1xuXG4gIGlmIChyZW1vdmVkICYmICFub2RlKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgbmV3Tm9kZSA9IHVwZGF0ZU5vZGUoXG4gICAgbm9kZSxcbiAgICBvd25lcklELFxuICAgIHNoaWZ0ICsgU0hJRlQsXG4gICAga2V5SGFzaCxcbiAgICBrZXksXG4gICAgdmFsdWUsXG4gICAgZGlkQ2hhbmdlU2l6ZSxcbiAgICBkaWRBbHRlclxuICApO1xuICBpZiAobmV3Tm9kZSA9PT0gbm9kZSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIG5ld0NvdW50ID0gdGhpcy5jb3VudDtcbiAgaWYgKCFub2RlKSB7XG4gICAgbmV3Q291bnQrKztcbiAgfSBlbHNlIGlmICghbmV3Tm9kZSkge1xuICAgIG5ld0NvdW50LS07XG4gICAgaWYgKG5ld0NvdW50IDwgTUlOX0hBU0hfQVJSQVlfTUFQX1NJWkUpIHtcbiAgICAgIHJldHVybiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIG5ld0NvdW50LCBpZHgpO1xuICAgIH1cbiAgfVxuXG4gIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gIHZhciBuZXdOb2RlcyA9IHNldEF0KG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpO1xuXG4gIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgdGhpcy5jb3VudCA9IG5ld0NvdW50O1xuICAgIHRoaXMubm9kZXMgPSBuZXdOb2RlcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiBuZXcgSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBuZXdDb3VudCwgbmV3Tm9kZXMpO1xufTtcblxudmFyIEhhc2hDb2xsaXNpb25Ob2RlID0gZnVuY3Rpb24gSGFzaENvbGxpc2lvbk5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cmllcykge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmtleUhhc2ggPSBrZXlIYXNoO1xuICB0aGlzLmVudHJpZXMgPSBlbnRyaWVzO1xufTtcblxuSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gIGZvciAodmFyIGlpID0gMCwgbGVuID0gZW50cmllcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrKSB7XG4gICAgaWYgKGlzKGtleSwgZW50cmllc1tpaV1bMF0pKSB7XG4gICAgICByZXR1cm4gZW50cmllc1tpaV1bMV07XG4gICAgfVxuICB9XG4gIHJldHVybiBub3RTZXRWYWx1ZTtcbn07XG5cbkhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgfVxuXG4gIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG5cbiAgaWYgKGtleUhhc2ggIT09IHRoaXMua2V5SGFzaCkge1xuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgcmV0dXJuIG1lcmdlSW50b05vZGUodGhpcywgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIFtrZXksIHZhbHVlXSk7XG4gIH1cblxuICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgdmFyIGlkeCA9IDA7XG4gIHZhciBsZW4gPSBlbnRyaWVzLmxlbmd0aDtcbiAgZm9yICg7IGlkeCA8IGxlbjsgaWR4KyspIHtcbiAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lkeF1bMF0pKSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgdmFyIGV4aXN0cyA9IGlkeCA8IGxlbjtcblxuICBpZiAoZXhpc3RzID8gZW50cmllc1tpZHhdWzFdID09PSB2YWx1ZSA6IHJlbW92ZWQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFNldFJlZihkaWRBbHRlcik7XG4gIChyZW1vdmVkIHx8ICFleGlzdHMpICYmIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcblxuICBpZiAocmVtb3ZlZCAmJiBsZW4gPT09IDIpIHtcbiAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIGVudHJpZXNbaWR4IF4gMV0pO1xuICB9XG5cbiAgdmFyIGlzRWRpdGFibGUgPSBvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRDtcbiAgdmFyIG5ld0VudHJpZXMgPSBpc0VkaXRhYmxlID8gZW50cmllcyA6IGFyckNvcHkoZW50cmllcyk7XG5cbiAgaWYgKGV4aXN0cykge1xuICAgIGlmIChyZW1vdmVkKSB7XG4gICAgICBpZHggPT09IGxlbiAtIDFcbiAgICAgICAgPyBuZXdFbnRyaWVzLnBvcCgpXG4gICAgICAgIDogKG5ld0VudHJpZXNbaWR4XSA9IG5ld0VudHJpZXMucG9wKCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdFbnRyaWVzW2lkeF0gPSBba2V5LCB2YWx1ZV07XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG5ld0VudHJpZXMucHVzaChba2V5LCB2YWx1ZV0pO1xuICB9XG5cbiAgaWYgKGlzRWRpdGFibGUpIHtcbiAgICB0aGlzLmVudHJpZXMgPSBuZXdFbnRyaWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCB0aGlzLmtleUhhc2gsIG5ld0VudHJpZXMpO1xufTtcblxudmFyIFZhbHVlTm9kZSA9IGZ1bmN0aW9uIFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBlbnRyeSkge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmtleUhhc2ggPSBrZXlIYXNoO1xuICB0aGlzLmVudHJ5ID0gZW50cnk7XG59O1xuXG5WYWx1ZU5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgcmV0dXJuIGlzKGtleSwgdGhpcy5lbnRyeVswXSkgPyB0aGlzLmVudHJ5WzFdIDogbm90U2V0VmFsdWU7XG59O1xuXG5WYWx1ZU5vZGUucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uIHVwZGF0ZSAob3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGtleSwgdmFsdWUsIGRpZENoYW5nZVNpemUsIGRpZEFsdGVyKSB7XG4gIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG4gIHZhciBrZXlNYXRjaCA9IGlzKGtleSwgdGhpcy5lbnRyeVswXSk7XG4gIGlmIChrZXlNYXRjaCA/IHZhbHVlID09PSB0aGlzLmVudHJ5WzFdIDogcmVtb3ZlZCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgU2V0UmVmKGRpZEFsdGVyKTtcblxuICBpZiAocmVtb3ZlZCkge1xuICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICByZXR1cm47IC8vIHVuZGVmaW5lZFxuICB9XG5cbiAgaWYgKGtleU1hdGNoKSB7XG4gICAgaWYgKG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEKSB7XG4gICAgICB0aGlzLmVudHJ5WzFdID0gdmFsdWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBWYWx1ZU5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICB9XG5cbiAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICByZXR1cm4gbWVyZ2VJbnRvTm9kZSh0aGlzLCBvd25lcklELCBzaGlmdCwgaGFzaChrZXkpLCBba2V5LCB2YWx1ZV0pO1xufTtcblxuLy8gI3ByYWdtYSBJdGVyYXRvcnNcblxuQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5pdGVyYXRlID0gSGFzaENvbGxpc2lvbk5vZGUucHJvdG90eXBlLml0ZXJhdGUgPVxuICBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgICBmb3IgKHZhciBpaSA9IDAsIG1heEluZGV4ID0gZW50cmllcy5sZW5ndGggLSAxOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgaWYgKGZuKGVudHJpZXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV0pID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG5CaXRtYXBJbmRleGVkTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IEhhc2hBcnJheU1hcE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPVxuICBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgbm9kZXMgPSB0aGlzLm5vZGVzO1xuICAgIGZvciAodmFyIGlpID0gMCwgbWF4SW5kZXggPSBub2Rlcy5sZW5ndGggLSAxOyBpaSA8PSBtYXhJbmRleDsgaWkrKykge1xuICAgICAgdmFyIG5vZGUgPSBub2Rlc1tyZXZlcnNlID8gbWF4SW5kZXggLSBpaSA6IGlpXTtcbiAgICAgIGlmIChub2RlICYmIG5vZGUuaXRlcmF0ZShmbiwgcmV2ZXJzZSkgPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuVmFsdWVOb2RlLnByb3RvdHlwZS5pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gIHJldHVybiBmbih0aGlzLmVudHJ5KTtcbn07XG5cbnZhciBNYXBJdGVyYXRvciA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEl0ZXJhdG9yKSB7XG4gIGZ1bmN0aW9uIE1hcEl0ZXJhdG9yKG1hcCwgdHlwZSwgcmV2ZXJzZSkge1xuICAgIHRoaXMuX3R5cGUgPSB0eXBlO1xuICAgIHRoaXMuX3JldmVyc2UgPSByZXZlcnNlO1xuICAgIHRoaXMuX3N0YWNrID0gbWFwLl9yb290ICYmIG1hcEl0ZXJhdG9yRnJhbWUobWFwLl9yb290KTtcbiAgfVxuXG4gIGlmICggSXRlcmF0b3IgKSBNYXBJdGVyYXRvci5fX3Byb3RvX18gPSBJdGVyYXRvcjtcbiAgTWFwSXRlcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSXRlcmF0b3IgJiYgSXRlcmF0b3IucHJvdG90eXBlICk7XG4gIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1hcEl0ZXJhdG9yO1xuXG4gIE1hcEl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gbmV4dCAoKSB7XG4gICAgdmFyIHR5cGUgPSB0aGlzLl90eXBlO1xuICAgIHZhciBzdGFjayA9IHRoaXMuX3N0YWNrO1xuICAgIHdoaWxlIChzdGFjaykge1xuICAgICAgdmFyIG5vZGUgPSBzdGFjay5ub2RlO1xuICAgICAgdmFyIGluZGV4ID0gc3RhY2suaW5kZXgrKztcbiAgICAgIHZhciBtYXhJbmRleCA9ICh2b2lkIDApO1xuICAgICAgaWYgKG5vZGUuZW50cnkpIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgcmV0dXJuIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgbm9kZS5lbnRyeSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAobm9kZS5lbnRyaWVzKSB7XG4gICAgICAgIG1heEluZGV4ID0gbm9kZS5lbnRyaWVzLmxlbmd0aCAtIDE7XG4gICAgICAgIGlmIChpbmRleCA8PSBtYXhJbmRleCkge1xuICAgICAgICAgIHJldHVybiBtYXBJdGVyYXRvclZhbHVlKFxuICAgICAgICAgICAgdHlwZSxcbiAgICAgICAgICAgIG5vZGUuZW50cmllc1t0aGlzLl9yZXZlcnNlID8gbWF4SW5kZXggLSBpbmRleCA6IGluZGV4XVxuICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1heEluZGV4ID0gbm9kZS5ub2Rlcy5sZW5ndGggLSAxO1xuICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgICB2YXIgc3ViTm9kZSA9IG5vZGUubm9kZXNbdGhpcy5fcmV2ZXJzZSA/IG1heEluZGV4IC0gaW5kZXggOiBpbmRleF07XG4gICAgICAgICAgaWYgKHN1Yk5vZGUpIHtcbiAgICAgICAgICAgIGlmIChzdWJOb2RlLmVudHJ5KSB7XG4gICAgICAgICAgICAgIHJldHVybiBtYXBJdGVyYXRvclZhbHVlKHR5cGUsIHN1Yk5vZGUuZW50cnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IG1hcEl0ZXJhdG9yRnJhbWUoc3ViTm9kZSwgc3RhY2spO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgc3RhY2sgPSB0aGlzLl9zdGFjayA9IHRoaXMuX3N0YWNrLl9fcHJldjtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICB9O1xuXG4gIHJldHVybiBNYXBJdGVyYXRvcjtcbn0oSXRlcmF0b3IpKTtcblxuZnVuY3Rpb24gbWFwSXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeSkge1xuICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeVswXSwgZW50cnlbMV0pO1xufVxuXG5mdW5jdGlvbiBtYXBJdGVyYXRvckZyYW1lKG5vZGUsIHByZXYpIHtcbiAgcmV0dXJuIHtcbiAgICBub2RlOiBub2RlLFxuICAgIGluZGV4OiAwLFxuICAgIF9fcHJldjogcHJldixcbiAgfTtcbn1cblxuZnVuY3Rpb24gbWFrZU1hcChzaXplLCByb290LCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKE1hcFByb3RvdHlwZSk7XG4gIG1hcC5zaXplID0gc2l6ZTtcbiAgbWFwLl9yb290ID0gcm9vdDtcbiAgbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gIG1hcC5fX2hhc2ggPSBoYXNoO1xuICBtYXAuX19hbHRlcmVkID0gZmFsc2U7XG4gIHJldHVybiBtYXA7XG59XG5cbnZhciBFTVBUWV9NQVA7XG5mdW5jdGlvbiBlbXB0eU1hcCgpIHtcbiAgcmV0dXJuIEVNUFRZX01BUCB8fCAoRU1QVFlfTUFQID0gbWFrZU1hcCgwKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU1hcChtYXAsIGssIHYpIHtcbiAgdmFyIG5ld1Jvb3Q7XG4gIHZhciBuZXdTaXplO1xuICBpZiAoIW1hcC5fcm9vdCkge1xuICAgIGlmICh2ID09PSBOT1RfU0VUKSB7XG4gICAgICByZXR1cm4gbWFwO1xuICAgIH1cbiAgICBuZXdTaXplID0gMTtcbiAgICBuZXdSb290ID0gbmV3IEFycmF5TWFwTm9kZShtYXAuX19vd25lcklELCBbW2ssIHZdXSk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGRpZENoYW5nZVNpemUgPSBNYWtlUmVmKCk7XG4gICAgdmFyIGRpZEFsdGVyID0gTWFrZVJlZigpO1xuICAgIG5ld1Jvb3QgPSB1cGRhdGVOb2RlKFxuICAgICAgbWFwLl9yb290LFxuICAgICAgbWFwLl9fb3duZXJJRCxcbiAgICAgIDAsXG4gICAgICB1bmRlZmluZWQsXG4gICAgICBrLFxuICAgICAgdixcbiAgICAgIGRpZENoYW5nZVNpemUsXG4gICAgICBkaWRBbHRlclxuICAgICk7XG4gICAgaWYgKCFkaWRBbHRlci52YWx1ZSkge1xuICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgbmV3U2l6ZSA9IG1hcC5zaXplICsgKGRpZENoYW5nZVNpemUudmFsdWUgPyAodiA9PT0gTk9UX1NFVCA/IC0xIDogMSkgOiAwKTtcbiAgfVxuICBpZiAobWFwLl9fb3duZXJJRCkge1xuICAgIG1hcC5zaXplID0gbmV3U2l6ZTtcbiAgICBtYXAuX3Jvb3QgPSBuZXdSb290O1xuICAgIG1hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgbWFwLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIG1hcDtcbiAgfVxuICByZXR1cm4gbmV3Um9vdCA/IG1ha2VNYXAobmV3U2l6ZSwgbmV3Um9vdCkgOiBlbXB0eU1hcCgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVOb2RlKFxuICBub2RlLFxuICBvd25lcklELFxuICBzaGlmdCxcbiAga2V5SGFzaCxcbiAga2V5LFxuICB2YWx1ZSxcbiAgZGlkQ2hhbmdlU2l6ZSxcbiAgZGlkQWx0ZXJcbikge1xuICBpZiAoIW5vZGUpIHtcbiAgICBpZiAodmFsdWUgPT09IE5PVF9TRVQpIHtcbiAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbiAgICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAgIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgICByZXR1cm4gbmV3IFZhbHVlTm9kZShvd25lcklELCBrZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICB9XG4gIHJldHVybiBub2RlLnVwZGF0ZShcbiAgICBvd25lcklELFxuICAgIHNoaWZ0LFxuICAgIGtleUhhc2gsXG4gICAga2V5LFxuICAgIHZhbHVlLFxuICAgIGRpZENoYW5nZVNpemUsXG4gICAgZGlkQWx0ZXJcbiAgKTtcbn1cblxuZnVuY3Rpb24gaXNMZWFmTm9kZShub2RlKSB7XG4gIHJldHVybiAoXG4gICAgbm9kZS5jb25zdHJ1Y3RvciA9PT0gVmFsdWVOb2RlIHx8IG5vZGUuY29uc3RydWN0b3IgPT09IEhhc2hDb2xsaXNpb25Ob2RlXG4gICk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlSW50b05vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQsIGtleUhhc2gsIGVudHJ5KSB7XG4gIGlmIChub2RlLmtleUhhc2ggPT09IGtleUhhc2gpIHtcbiAgICByZXR1cm4gbmV3IEhhc2hDb2xsaXNpb25Ob2RlKG93bmVySUQsIGtleUhhc2gsIFtub2RlLmVudHJ5LCBlbnRyeV0pO1xuICB9XG5cbiAgdmFyIGlkeDEgPSAoc2hpZnQgPT09IDAgPyBub2RlLmtleUhhc2ggOiBub2RlLmtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG4gIHZhciBpZHgyID0gKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG5cbiAgdmFyIG5ld05vZGU7XG4gIHZhciBub2RlcyA9XG4gICAgaWR4MSA9PT0gaWR4MlxuICAgICAgPyBbbWVyZ2VJbnRvTm9kZShub2RlLCBvd25lcklELCBzaGlmdCArIFNISUZULCBrZXlIYXNoLCBlbnRyeSldXG4gICAgICA6ICgobmV3Tm9kZSA9IG5ldyBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cnkpKSxcbiAgICAgICAgaWR4MSA8IGlkeDIgPyBbbm9kZSwgbmV3Tm9kZV0gOiBbbmV3Tm9kZSwgbm9kZV0pO1xuXG4gIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgKDEgPDwgaWR4MSkgfCAoMSA8PCBpZHgyKSwgbm9kZXMpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKSB7XG4gIGlmICghb3duZXJJRCkge1xuICAgIG93bmVySUQgPSBuZXcgT3duZXJJRCgpO1xuICB9XG4gIHZhciBub2RlID0gbmV3IFZhbHVlTm9kZShvd25lcklELCBoYXNoKGtleSksIFtrZXksIHZhbHVlXSk7XG4gIGZvciAodmFyIGlpID0gMDsgaWkgPCBlbnRyaWVzLmxlbmd0aDsgaWkrKykge1xuICAgIHZhciBlbnRyeSA9IGVudHJpZXNbaWldO1xuICAgIG5vZGUgPSBub2RlLnVwZGF0ZShvd25lcklELCAwLCB1bmRlZmluZWQsIGVudHJ5WzBdLCBlbnRyeVsxXSk7XG4gIH1cbiAgcmV0dXJuIG5vZGU7XG59XG5cbmZ1bmN0aW9uIHBhY2tOb2Rlcyhvd25lcklELCBub2RlcywgY291bnQsIGV4Y2x1ZGluZykge1xuICB2YXIgYml0bWFwID0gMDtcbiAgdmFyIHBhY2tlZElJID0gMDtcbiAgdmFyIHBhY2tlZE5vZGVzID0gbmV3IEFycmF5KGNvdW50KTtcbiAgZm9yICh2YXIgaWkgPSAwLCBiaXQgPSAxLCBsZW4gPSBub2Rlcy5sZW5ndGg7IGlpIDwgbGVuOyBpaSsrLCBiaXQgPDw9IDEpIHtcbiAgICB2YXIgbm9kZSA9IG5vZGVzW2lpXTtcbiAgICBpZiAobm9kZSAhPT0gdW5kZWZpbmVkICYmIGlpICE9PSBleGNsdWRpbmcpIHtcbiAgICAgIGJpdG1hcCB8PSBiaXQ7XG4gICAgICBwYWNrZWROb2Rlc1twYWNrZWRJSSsrXSA9IG5vZGU7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXcgQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgYml0bWFwLCBwYWNrZWROb2Rlcyk7XG59XG5cbmZ1bmN0aW9uIGV4cGFuZE5vZGVzKG93bmVySUQsIG5vZGVzLCBiaXRtYXAsIGluY2x1ZGluZywgbm9kZSkge1xuICB2YXIgY291bnQgPSAwO1xuICB2YXIgZXhwYW5kZWROb2RlcyA9IG5ldyBBcnJheShTSVpFKTtcbiAgZm9yICh2YXIgaWkgPSAwOyBiaXRtYXAgIT09IDA7IGlpKyssIGJpdG1hcCA+Pj49IDEpIHtcbiAgICBleHBhbmRlZE5vZGVzW2lpXSA9IGJpdG1hcCAmIDEgPyBub2Rlc1tjb3VudCsrXSA6IHVuZGVmaW5lZDtcbiAgfVxuICBleHBhbmRlZE5vZGVzW2luY2x1ZGluZ10gPSBub2RlO1xuICByZXR1cm4gbmV3IEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgY291bnQgKyAxLCBleHBhbmRlZE5vZGVzKTtcbn1cblxuZnVuY3Rpb24gcG9wQ291bnQoeCkge1xuICB4IC09ICh4ID4+IDEpICYgMHg1NTU1NTU1NTtcbiAgeCA9ICh4ICYgMHgzMzMzMzMzMykgKyAoKHggPj4gMikgJiAweDMzMzMzMzMzKTtcbiAgeCA9ICh4ICsgKHggPj4gNCkpICYgMHgwZjBmMGYwZjtcbiAgeCArPSB4ID4+IDg7XG4gIHggKz0geCA+PiAxNjtcbiAgcmV0dXJuIHggJiAweDdmO1xufVxuXG5mdW5jdGlvbiBzZXRBdChhcnJheSwgaWR4LCB2YWwsIGNhbkVkaXQpIHtcbiAgdmFyIG5ld0FycmF5ID0gY2FuRWRpdCA/IGFycmF5IDogYXJyQ29weShhcnJheSk7XG4gIG5ld0FycmF5W2lkeF0gPSB2YWw7XG4gIHJldHVybiBuZXdBcnJheTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlSW4oYXJyYXksIGlkeCwgdmFsLCBjYW5FZGl0KSB7XG4gIHZhciBuZXdMZW4gPSBhcnJheS5sZW5ndGggKyAxO1xuICBpZiAoY2FuRWRpdCAmJiBpZHggKyAxID09PSBuZXdMZW4pIHtcbiAgICBhcnJheVtpZHhdID0gdmFsO1xuICAgIHJldHVybiBhcnJheTtcbiAgfVxuICB2YXIgbmV3QXJyYXkgPSBuZXcgQXJyYXkobmV3TGVuKTtcbiAgdmFyIGFmdGVyID0gMDtcbiAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG5ld0xlbjsgaWkrKykge1xuICAgIGlmIChpaSA9PT0gaWR4KSB7XG4gICAgICBuZXdBcnJheVtpaV0gPSB2YWw7XG4gICAgICBhZnRlciA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdBcnJheVtpaV0gPSBhcnJheVtpaSArIGFmdGVyXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5ld0FycmF5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPdXQoYXJyYXksIGlkeCwgY2FuRWRpdCkge1xuICB2YXIgbmV3TGVuID0gYXJyYXkubGVuZ3RoIC0gMTtcbiAgaWYgKGNhbkVkaXQgJiYgaWR4ID09PSBuZXdMZW4pIHtcbiAgICBhcnJheS5wb3AoKTtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbiAgdmFyIG5ld0FycmF5ID0gbmV3IEFycmF5KG5ld0xlbik7XG4gIHZhciBhZnRlciA9IDA7XG4gIGZvciAodmFyIGlpID0gMDsgaWkgPCBuZXdMZW47IGlpKyspIHtcbiAgICBpZiAoaWkgPT09IGlkeCkge1xuICAgICAgYWZ0ZXIgPSAxO1xuICAgIH1cbiAgICBuZXdBcnJheVtpaV0gPSBhcnJheVtpaSArIGFmdGVyXTtcbiAgfVxuICByZXR1cm4gbmV3QXJyYXk7XG59XG5cbnZhciBNQVhfQVJSQVlfTUFQX1NJWkUgPSBTSVpFIC8gNDtcbnZhciBNQVhfQklUTUFQX0lOREVYRURfU0laRSA9IFNJWkUgLyAyO1xudmFyIE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFID0gU0laRSAvIDQ7XG5cbnZhciBJU19MSVNUX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX0xJU1RfX0BAJztcblxuZnVuY3Rpb24gaXNMaXN0KG1heWJlTGlzdCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZUxpc3QgJiYgbWF5YmVMaXN0W0lTX0xJU1RfU1lNQk9MXSk7XG59XG5cbnZhciBMaXN0ID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gTGlzdCh2YWx1ZSkge1xuICAgIHZhciBlbXB0eSA9IGVtcHR5TGlzdCgpO1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZW1wdHk7XG4gICAgfVxuICAgIGlmIChpc0xpc3QodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHZhciBpdGVyID0gSW5kZXhlZENvbGxlY3Rpb24odmFsdWUpO1xuICAgIHZhciBzaXplID0gaXRlci5zaXplO1xuICAgIGlmIChzaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gZW1wdHk7XG4gICAgfVxuICAgIGFzc2VydE5vdEluZmluaXRlKHNpemUpO1xuICAgIGlmIChzaXplID4gMCAmJiBzaXplIDwgU0laRSkge1xuICAgICAgcmV0dXJuIG1ha2VMaXN0KDAsIHNpemUsIFNISUZULCBudWxsLCBuZXcgVk5vZGUoaXRlci50b0FycmF5KCkpKTtcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5LndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIGxpc3Quc2V0U2l6ZShzaXplKTtcbiAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbiAodiwgaSkgeyByZXR1cm4gbGlzdC5zZXQoaSwgdik7IH0pO1xuICAgIH0pO1xuICB9XG5cbiAgaWYgKCBJbmRleGVkQ29sbGVjdGlvbiApIExpc3QuX19wcm90b19fID0gSW5kZXhlZENvbGxlY3Rpb247XG4gIExpc3QucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZENvbGxlY3Rpb24gJiYgSW5kZXhlZENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIExpc3QucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTGlzdDtcblxuICBMaXN0Lm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ0xpc3QgWycsICddJyk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICBMaXN0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2l6ZSkge1xuICAgICAgaW5kZXggKz0gdGhpcy5fb3JpZ2luO1xuICAgICAgdmFyIG5vZGUgPSBsaXN0Tm9kZUZvcih0aGlzLCBpbmRleCk7XG4gICAgICByZXR1cm4gbm9kZSAmJiBub2RlLmFycmF5W2luZGV4ICYgTUFTS107XG4gICAgfVxuICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gIExpc3QucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAoaW5kZXgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHVwZGF0ZUxpc3QodGhpcywgaW5kZXgsIHZhbHVlKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGluZGV4KSB7XG4gICAgcmV0dXJuICF0aGlzLmhhcyhpbmRleClcbiAgICAgID8gdGhpc1xuICAgICAgOiBpbmRleCA9PT0gMFxuICAgICAgPyB0aGlzLnNoaWZ0KClcbiAgICAgIDogaW5kZXggPT09IHRoaXMuc2l6ZSAtIDFcbiAgICAgID8gdGhpcy5wb3AoKVxuICAgICAgOiB0aGlzLnNwbGljZShpbmRleCwgMSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24gaW5zZXJ0IChpbmRleCwgdmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zcGxpY2UoaW5kZXgsIDAsIHZhbHVlKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICB0aGlzLnNpemUgPSB0aGlzLl9vcmlnaW4gPSB0aGlzLl9jYXBhY2l0eSA9IDA7XG4gICAgICB0aGlzLl9sZXZlbCA9IFNISUZUO1xuICAgICAgdGhpcy5fcm9vdCA9IHRoaXMuX3RhaWwgPSB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gZW1wdHlMaXN0KCk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2ggKC8qLi4udmFsdWVzKi8pIHtcbiAgICB2YXIgdmFsdWVzID0gYXJndW1lbnRzO1xuICAgIHZhciBvbGRTaXplID0gdGhpcy5zaXplO1xuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgMCwgb2xkU2l6ZSArIHZhbHVlcy5sZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHZhbHVlcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgbGlzdC5zZXQob2xkU2l6ZSArIGlpLCB2YWx1ZXNbaWldKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiBwb3AgKCkge1xuICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDAsIC0xKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS51bnNoaWZ0ID0gZnVuY3Rpb24gdW5zaGlmdCAoLyouLi52YWx1ZXMqLykge1xuICAgIHZhciB2YWx1ZXMgPSBhcmd1bWVudHM7XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobGlzdCkge1xuICAgICAgc2V0TGlzdEJvdW5kcyhsaXN0LCAtdmFsdWVzLmxlbmd0aCk7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgdmFsdWVzLmxlbmd0aDsgaWkrKykge1xuICAgICAgICBsaXN0LnNldChpaSwgdmFsdWVzW2lpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiBzaGlmdCAoKSB7XG4gICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMSk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gIExpc3QucHJvdG90eXBlLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAoLyouLi5jb2xsZWN0aW9ucyovKSB7XG4gICAgdmFyIGFyZ3VtZW50cyQxID0gYXJndW1lbnRzO1xuXG4gICAgdmFyIHNlcXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGFyZ3VtZW50ID0gYXJndW1lbnRzJDFbaV07XG4gICAgICB2YXIgc2VxID0gSW5kZXhlZENvbGxlY3Rpb24oXG4gICAgICAgIHR5cGVvZiBhcmd1bWVudCAhPT0gJ3N0cmluZycgJiYgaGFzSXRlcmF0b3IoYXJndW1lbnQpXG4gICAgICAgICAgPyBhcmd1bWVudFxuICAgICAgICAgIDogW2FyZ3VtZW50XVxuICAgICAgKTtcbiAgICAgIGlmIChzZXEuc2l6ZSAhPT0gMCkge1xuICAgICAgICBzZXFzLnB1c2goc2VxKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHNlcXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCAmJiAhdGhpcy5fX293bmVySUQgJiYgc2Vxcy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKHNlcXNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICBzZXFzLmZvckVhY2goZnVuY3Rpb24gKHNlcSkgeyByZXR1cm4gc2VxLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBsaXN0LnB1c2godmFsdWUpOyB9KTsgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuc2V0U2l6ZSA9IGZ1bmN0aW9uIHNldFNpemUgKHNpemUpIHtcbiAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyh0aGlzLCAwLCBzaXplKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAgKG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMkMSQxLnNpemU7IGkrKykge1xuICAgICAgICBsaXN0LnNldChpLCBtYXBwZXIuY2FsbChjb250ZXh0LCBsaXN0LmdldChpKSwgaSwgdGhpcyQxJDEpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIEl0ZXJhdGlvblxuXG4gIExpc3QucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKGJlZ2luLCBlbmQpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKFxuICAgICAgdGhpcyxcbiAgICAgIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSksXG4gICAgICByZXNvbHZlRW5kKGVuZCwgc2l6ZSlcbiAgICApO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIGluZGV4ID0gcmV2ZXJzZSA/IHRoaXMuc2l6ZSA6IDA7XG4gICAgdmFyIHZhbHVlcyA9IGl0ZXJhdGVMaXN0KHRoaXMsIHJldmVyc2UpO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlID0gdmFsdWVzKCk7XG4gICAgICByZXR1cm4gdmFsdWUgPT09IERPTkVcbiAgICAgICAgPyBpdGVyYXRvckRvbmUoKVxuICAgICAgICA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgcmV2ZXJzZSA/IC0taW5kZXggOiBpbmRleCsrLCB2YWx1ZSk7XG4gICAgfSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBpbmRleCA9IHJldmVyc2UgPyB0aGlzLnNpemUgOiAwO1xuICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgd2hpbGUgKCh2YWx1ZSA9IHZhbHVlcygpKSAhPT0gRE9ORSkge1xuICAgICAgaWYgKGZuKHZhbHVlLCByZXZlcnNlID8gLS1pbmRleCA6IGluZGV4KyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGluZGV4O1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eUxpc3QoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VMaXN0KFxuICAgICAgdGhpcy5fb3JpZ2luLFxuICAgICAgdGhpcy5fY2FwYWNpdHksXG4gICAgICB0aGlzLl9sZXZlbCxcbiAgICAgIHRoaXMuX3Jvb3QsXG4gICAgICB0aGlzLl90YWlsLFxuICAgICAgb3duZXJJRCxcbiAgICAgIHRoaXMuX19oYXNoXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gTGlzdDtcbn0oSW5kZXhlZENvbGxlY3Rpb24pKTtcblxuTGlzdC5pc0xpc3QgPSBpc0xpc3Q7XG5cbnZhciBMaXN0UHJvdG90eXBlID0gTGlzdC5wcm90b3R5cGU7XG5MaXN0UHJvdG90eXBlW0lTX0xJU1RfU1lNQk9MXSA9IHRydWU7XG5MaXN0UHJvdG90eXBlW0RFTEVURV0gPSBMaXN0UHJvdG90eXBlLnJlbW92ZTtcbkxpc3RQcm90b3R5cGUubWVyZ2UgPSBMaXN0UHJvdG90eXBlLmNvbmNhdDtcbkxpc3RQcm90b3R5cGUuc2V0SW4gPSBzZXRJbjtcbkxpc3RQcm90b3R5cGUuZGVsZXRlSW4gPSBMaXN0UHJvdG90eXBlLnJlbW92ZUluID0gZGVsZXRlSW47XG5MaXN0UHJvdG90eXBlLnVwZGF0ZSA9IHVwZGF0ZTtcbkxpc3RQcm90b3R5cGUudXBkYXRlSW4gPSB1cGRhdGVJbjtcbkxpc3RQcm90b3R5cGUubWVyZ2VJbiA9IG1lcmdlSW47XG5MaXN0UHJvdG90eXBlLm1lcmdlRGVlcEluID0gbWVyZ2VEZWVwSW47XG5MaXN0UHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuTGlzdFByb3RvdHlwZS53YXNBbHRlcmVkID0gd2FzQWx0ZXJlZDtcbkxpc3RQcm90b3R5cGUuYXNJbW11dGFibGUgPSBhc0ltbXV0YWJsZTtcbkxpc3RQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBMaXN0UHJvdG90eXBlLmFzTXV0YWJsZSA9IGFzTXV0YWJsZTtcbkxpc3RQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9zdGVwJ10gPSBmdW5jdGlvbiAocmVzdWx0LCBhcnIpIHtcbiAgcmV0dXJuIHJlc3VsdC5wdXNoKGFycik7XG59O1xuTGlzdFByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqLmFzSW1tdXRhYmxlKCk7XG59O1xuXG52YXIgVk5vZGUgPSBmdW5jdGlvbiBWTm9kZShhcnJheSwgb3duZXJJRCkge1xuICB0aGlzLmFycmF5ID0gYXJyYXk7XG4gIHRoaXMub3duZXJJRCA9IG93bmVySUQ7XG59O1xuXG4vLyBUT0RPOiBzZWVtcyBsaWtlIHRoZXNlIG1ldGhvZHMgYXJlIHZlcnkgc2ltaWxhclxuXG5WTm9kZS5wcm90b3R5cGUucmVtb3ZlQmVmb3JlID0gZnVuY3Rpb24gcmVtb3ZlQmVmb3JlIChvd25lcklELCBsZXZlbCwgaW5kZXgpIHtcbiAgaWYgKGluZGV4ID09PSBsZXZlbCA/IDEgPDwgbGV2ZWwgOiB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZhciBvcmlnaW5JbmRleCA9IChpbmRleCA+Pj4gbGV2ZWwpICYgTUFTSztcbiAgaWYgKG9yaWdpbkluZGV4ID49IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIG5ldyBWTm9kZShbXSwgb3duZXJJRCk7XG4gIH1cbiAgdmFyIHJlbW92aW5nRmlyc3QgPSBvcmlnaW5JbmRleCA9PT0gMDtcbiAgdmFyIG5ld0NoaWxkO1xuICBpZiAobGV2ZWwgPiAwKSB7XG4gICAgdmFyIG9sZENoaWxkID0gdGhpcy5hcnJheVtvcmlnaW5JbmRleF07XG4gICAgbmV3Q2hpbGQgPVxuICAgICAgb2xkQ2hpbGQgJiYgb2xkQ2hpbGQucmVtb3ZlQmVmb3JlKG93bmVySUQsIGxldmVsIC0gU0hJRlQsIGluZGV4KTtcbiAgICBpZiAobmV3Q2hpbGQgPT09IG9sZENoaWxkICYmIHJlbW92aW5nRmlyc3QpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuICBpZiAocmVtb3ZpbmdGaXJzdCAmJiAhbmV3Q2hpbGQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB2YXIgZWRpdGFibGUgPSBlZGl0YWJsZVZOb2RlKHRoaXMsIG93bmVySUQpO1xuICBpZiAoIXJlbW92aW5nRmlyc3QpIHtcbiAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgb3JpZ2luSW5kZXg7IGlpKyspIHtcbiAgICAgIGVkaXRhYmxlLmFycmF5W2lpXSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgaWYgKG5ld0NoaWxkKSB7XG4gICAgZWRpdGFibGUuYXJyYXlbb3JpZ2luSW5kZXhdID0gbmV3Q2hpbGQ7XG4gIH1cbiAgcmV0dXJuIGVkaXRhYmxlO1xufTtcblxuVk5vZGUucHJvdG90eXBlLnJlbW92ZUFmdGVyID0gZnVuY3Rpb24gcmVtb3ZlQWZ0ZXIgKG93bmVySUQsIGxldmVsLCBpbmRleCkge1xuICBpZiAoaW5kZXggPT09IChsZXZlbCA/IDEgPDwgbGV2ZWwgOiAwKSB8fCB0aGlzLmFycmF5Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZhciBzaXplSW5kZXggPSAoKGluZGV4IC0gMSkgPj4+IGxldmVsKSAmIE1BU0s7XG4gIGlmIChzaXplSW5kZXggPj0gdGhpcy5hcnJheS5sZW5ndGgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBuZXdDaGlsZDtcbiAgaWYgKGxldmVsID4gMCkge1xuICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbc2l6ZUluZGV4XTtcbiAgICBuZXdDaGlsZCA9XG4gICAgICBvbGRDaGlsZCAmJiBvbGRDaGlsZC5yZW1vdmVBZnRlcihvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCk7XG4gICAgaWYgKG5ld0NoaWxkID09PSBvbGRDaGlsZCAmJiBzaXplSW5kZXggPT09IHRoaXMuYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XG5cbiAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcbiAgZWRpdGFibGUuYXJyYXkuc3BsaWNlKHNpemVJbmRleCArIDEpO1xuICBpZiAobmV3Q2hpbGQpIHtcbiAgICBlZGl0YWJsZS5hcnJheVtzaXplSW5kZXhdID0gbmV3Q2hpbGQ7XG4gIH1cbiAgcmV0dXJuIGVkaXRhYmxlO1xufTtcblxudmFyIERPTkUgPSB7fTtcblxuZnVuY3Rpb24gaXRlcmF0ZUxpc3QobGlzdCwgcmV2ZXJzZSkge1xuICB2YXIgbGVmdCA9IGxpc3QuX29yaWdpbjtcbiAgdmFyIHJpZ2h0ID0gbGlzdC5fY2FwYWNpdHk7XG4gIHZhciB0YWlsUG9zID0gZ2V0VGFpbE9mZnNldChyaWdodCk7XG4gIHZhciB0YWlsID0gbGlzdC5fdGFpbDtcblxuICByZXR1cm4gaXRlcmF0ZU5vZGVPckxlYWYobGlzdC5fcm9vdCwgbGlzdC5fbGV2ZWwsIDApO1xuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVOb2RlT3JMZWFmKG5vZGUsIGxldmVsLCBvZmZzZXQpIHtcbiAgICByZXR1cm4gbGV2ZWwgPT09IDBcbiAgICAgID8gaXRlcmF0ZUxlYWYobm9kZSwgb2Zmc2V0KVxuICAgICAgOiBpdGVyYXRlTm9kZShub2RlLCBsZXZlbCwgb2Zmc2V0KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVMZWFmKG5vZGUsIG9mZnNldCkge1xuICAgIHZhciBhcnJheSA9IG9mZnNldCA9PT0gdGFpbFBvcyA/IHRhaWwgJiYgdGFpbC5hcnJheSA6IG5vZGUgJiYgbm9kZS5hcnJheTtcbiAgICB2YXIgZnJvbSA9IG9mZnNldCA+IGxlZnQgPyAwIDogbGVmdCAtIG9mZnNldDtcbiAgICB2YXIgdG8gPSByaWdodCAtIG9mZnNldDtcbiAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICB0byA9IFNJWkU7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoZnJvbSA9PT0gdG8pIHtcbiAgICAgICAgcmV0dXJuIERPTkU7XG4gICAgICB9XG4gICAgICB2YXIgaWR4ID0gcmV2ZXJzZSA/IC0tdG8gOiBmcm9tKys7XG4gICAgICByZXR1cm4gYXJyYXkgJiYgYXJyYXlbaWR4XTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gaXRlcmF0ZU5vZGUobm9kZSwgbGV2ZWwsIG9mZnNldCkge1xuICAgIHZhciB2YWx1ZXM7XG4gICAgdmFyIGFycmF5ID0gbm9kZSAmJiBub2RlLmFycmF5O1xuICAgIHZhciBmcm9tID0gb2Zmc2V0ID4gbGVmdCA/IDAgOiAobGVmdCAtIG9mZnNldCkgPj4gbGV2ZWw7XG4gICAgdmFyIHRvID0gKChyaWdodCAtIG9mZnNldCkgPj4gbGV2ZWwpICsgMTtcbiAgICBpZiAodG8gPiBTSVpFKSB7XG4gICAgICB0byA9IFNJWkU7XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpZiAodmFsdWVzKSB7XG4gICAgICAgICAgdmFyIHZhbHVlID0gdmFsdWVzKCk7XG4gICAgICAgICAgaWYgKHZhbHVlICE9PSBET05FKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhbHVlcyA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZyb20gPT09IHRvKSB7XG4gICAgICAgICAgcmV0dXJuIERPTkU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGlkeCA9IHJldmVyc2UgPyAtLXRvIDogZnJvbSsrO1xuICAgICAgICB2YWx1ZXMgPSBpdGVyYXRlTm9kZU9yTGVhZihcbiAgICAgICAgICBhcnJheSAmJiBhcnJheVtpZHhdLFxuICAgICAgICAgIGxldmVsIC0gU0hJRlQsXG4gICAgICAgICAgb2Zmc2V0ICsgKGlkeCA8PCBsZXZlbClcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmZ1bmN0aW9uIG1ha2VMaXN0KG9yaWdpbiwgY2FwYWNpdHksIGxldmVsLCByb290LCB0YWlsLCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBsaXN0ID0gT2JqZWN0LmNyZWF0ZShMaXN0UHJvdG90eXBlKTtcbiAgbGlzdC5zaXplID0gY2FwYWNpdHkgLSBvcmlnaW47XG4gIGxpc3QuX29yaWdpbiA9IG9yaWdpbjtcbiAgbGlzdC5fY2FwYWNpdHkgPSBjYXBhY2l0eTtcbiAgbGlzdC5fbGV2ZWwgPSBsZXZlbDtcbiAgbGlzdC5fcm9vdCA9IHJvb3Q7XG4gIGxpc3QuX3RhaWwgPSB0YWlsO1xuICBsaXN0Ll9fb3duZXJJRCA9IG93bmVySUQ7XG4gIGxpc3QuX19oYXNoID0gaGFzaDtcbiAgbGlzdC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgcmV0dXJuIGxpc3Q7XG59XG5cbnZhciBFTVBUWV9MSVNUO1xuZnVuY3Rpb24gZW1wdHlMaXN0KCkge1xuICByZXR1cm4gRU1QVFlfTElTVCB8fCAoRU1QVFlfTElTVCA9IG1ha2VMaXN0KDAsIDAsIFNISUZUKSk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpc3QobGlzdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGluZGV4ID0gd3JhcEluZGV4KGxpc3QsIGluZGV4KTtcblxuICBpZiAoaW5kZXggIT09IGluZGV4KSB7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICBpZiAoaW5kZXggPj0gbGlzdC5zaXplIHx8IGluZGV4IDwgMCkge1xuICAgIHJldHVybiBsaXN0LndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIGluZGV4IDwgMFxuICAgICAgICA/IHNldExpc3RCb3VuZHMobGlzdCwgaW5kZXgpLnNldCgwLCB2YWx1ZSlcbiAgICAgICAgOiBzZXRMaXN0Qm91bmRzKGxpc3QsIDAsIGluZGV4ICsgMSkuc2V0KGluZGV4LCB2YWx1ZSk7XG4gICAgfSk7XG4gIH1cblxuICBpbmRleCArPSBsaXN0Ll9vcmlnaW47XG5cbiAgdmFyIG5ld1RhaWwgPSBsaXN0Ll90YWlsO1xuICB2YXIgbmV3Um9vdCA9IGxpc3QuX3Jvb3Q7XG4gIHZhciBkaWRBbHRlciA9IE1ha2VSZWYoKTtcbiAgaWYgKGluZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgbmV3VGFpbCA9IHVwZGF0ZVZOb2RlKG5ld1RhaWwsIGxpc3QuX19vd25lcklELCAwLCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdSb290ID0gdXBkYXRlVk5vZGUoXG4gICAgICBuZXdSb290LFxuICAgICAgbGlzdC5fX293bmVySUQsXG4gICAgICBsaXN0Ll9sZXZlbCxcbiAgICAgIGluZGV4LFxuICAgICAgdmFsdWUsXG4gICAgICBkaWRBbHRlclxuICAgICk7XG4gIH1cblxuICBpZiAoIWRpZEFsdGVyLnZhbHVlKSB7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICBpZiAobGlzdC5fX293bmVySUQpIHtcbiAgICBsaXN0Ll9yb290ID0gbmV3Um9vdDtcbiAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICBsaXN0Ll9fYWx0ZXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cbiAgcmV0dXJuIG1ha2VMaXN0KGxpc3QuX29yaWdpbiwgbGlzdC5fY2FwYWNpdHksIGxpc3QuX2xldmVsLCBuZXdSb290LCBuZXdUYWlsKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlVk5vZGUobm9kZSwgb3duZXJJRCwgbGV2ZWwsIGluZGV4LCB2YWx1ZSwgZGlkQWx0ZXIpIHtcbiAgdmFyIGlkeCA9IChpbmRleCA+Pj4gbGV2ZWwpICYgTUFTSztcbiAgdmFyIG5vZGVIYXMgPSBub2RlICYmIGlkeCA8IG5vZGUuYXJyYXkubGVuZ3RoO1xuICBpZiAoIW5vZGVIYXMgJiYgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgdmFyIG5ld05vZGU7XG5cbiAgaWYgKGxldmVsID4gMCkge1xuICAgIHZhciBsb3dlck5vZGUgPSBub2RlICYmIG5vZGUuYXJyYXlbaWR4XTtcbiAgICB2YXIgbmV3TG93ZXJOb2RlID0gdXBkYXRlVk5vZGUoXG4gICAgICBsb3dlck5vZGUsXG4gICAgICBvd25lcklELFxuICAgICAgbGV2ZWwgLSBTSElGVCxcbiAgICAgIGluZGV4LFxuICAgICAgdmFsdWUsXG4gICAgICBkaWRBbHRlclxuICAgICk7XG4gICAgaWYgKG5ld0xvd2VyTm9kZSA9PT0gbG93ZXJOb2RlKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgbmV3Tm9kZSA9IGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCk7XG4gICAgbmV3Tm9kZS5hcnJheVtpZHhdID0gbmV3TG93ZXJOb2RlO1xuICAgIHJldHVybiBuZXdOb2RlO1xuICB9XG5cbiAgaWYgKG5vZGVIYXMgJiYgbm9kZS5hcnJheVtpZHhdID09PSB2YWx1ZSkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG5cbiAgaWYgKGRpZEFsdGVyKSB7XG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgfVxuXG4gIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBpZHggPT09IG5ld05vZGUuYXJyYXkubGVuZ3RoIC0gMSkge1xuICAgIG5ld05vZGUuYXJyYXkucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgbmV3Tm9kZS5hcnJheVtpZHhdID0gdmFsdWU7XG4gIH1cbiAgcmV0dXJuIG5ld05vZGU7XG59XG5cbmZ1bmN0aW9uIGVkaXRhYmxlVk5vZGUobm9kZSwgb3duZXJJRCkge1xuICBpZiAob3duZXJJRCAmJiBub2RlICYmIG93bmVySUQgPT09IG5vZGUub3duZXJJRCkge1xuICAgIHJldHVybiBub2RlO1xuICB9XG4gIHJldHVybiBuZXcgVk5vZGUobm9kZSA/IG5vZGUuYXJyYXkuc2xpY2UoKSA6IFtdLCBvd25lcklEKTtcbn1cblxuZnVuY3Rpb24gbGlzdE5vZGVGb3IobGlzdCwgcmF3SW5kZXgpIHtcbiAgaWYgKHJhd0luZGV4ID49IGdldFRhaWxPZmZzZXQobGlzdC5fY2FwYWNpdHkpKSB7XG4gICAgcmV0dXJuIGxpc3QuX3RhaWw7XG4gIH1cbiAgaWYgKHJhd0luZGV4IDwgMSA8PCAobGlzdC5fbGV2ZWwgKyBTSElGVCkpIHtcbiAgICB2YXIgbm9kZSA9IGxpc3QuX3Jvb3Q7XG4gICAgdmFyIGxldmVsID0gbGlzdC5fbGV2ZWw7XG4gICAgd2hpbGUgKG5vZGUgJiYgbGV2ZWwgPiAwKSB7XG4gICAgICBub2RlID0gbm9kZS5hcnJheVsocmF3SW5kZXggPj4+IGxldmVsKSAmIE1BU0tdO1xuICAgICAgbGV2ZWwgLT0gU0hJRlQ7XG4gICAgfVxuICAgIHJldHVybiBub2RlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNldExpc3RCb3VuZHMobGlzdCwgYmVnaW4sIGVuZCkge1xuICAvLyBTYW5pdGl6ZSBiZWdpbiAmIGVuZCB1c2luZyB0aGlzIHNob3J0aGFuZCBmb3IgVG9JbnQzMihhcmd1bWVudClcbiAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50MzJcbiAgaWYgKGJlZ2luICE9PSB1bmRlZmluZWQpIHtcbiAgICBiZWdpbiB8PSAwO1xuICB9XG4gIGlmIChlbmQgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuZCB8PSAwO1xuICB9XG4gIHZhciBvd25lciA9IGxpc3QuX19vd25lcklEIHx8IG5ldyBPd25lcklEKCk7XG4gIHZhciBvbGRPcmlnaW4gPSBsaXN0Ll9vcmlnaW47XG4gIHZhciBvbGRDYXBhY2l0eSA9IGxpc3QuX2NhcGFjaXR5O1xuICB2YXIgbmV3T3JpZ2luID0gb2xkT3JpZ2luICsgYmVnaW47XG4gIHZhciBuZXdDYXBhY2l0eSA9XG4gICAgZW5kID09PSB1bmRlZmluZWRcbiAgICAgID8gb2xkQ2FwYWNpdHlcbiAgICAgIDogZW5kIDwgMFxuICAgICAgPyBvbGRDYXBhY2l0eSArIGVuZFxuICAgICAgOiBvbGRPcmlnaW4gKyBlbmQ7XG4gIGlmIChuZXdPcmlnaW4gPT09IG9sZE9yaWdpbiAmJiBuZXdDYXBhY2l0eSA9PT0gb2xkQ2FwYWNpdHkpIHtcbiAgICByZXR1cm4gbGlzdDtcbiAgfVxuXG4gIC8vIElmIGl0J3MgZ29pbmcgdG8gZW5kIGFmdGVyIGl0IHN0YXJ0cywgaXQncyBlbXB0eS5cbiAgaWYgKG5ld09yaWdpbiA+PSBuZXdDYXBhY2l0eSkge1xuICAgIHJldHVybiBsaXN0LmNsZWFyKCk7XG4gIH1cblxuICB2YXIgbmV3TGV2ZWwgPSBsaXN0Ll9sZXZlbDtcbiAgdmFyIG5ld1Jvb3QgPSBsaXN0Ll9yb290O1xuXG4gIC8vIE5ldyBvcmlnaW4gbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICB2YXIgb2Zmc2V0U2hpZnQgPSAwO1xuICB3aGlsZSAobmV3T3JpZ2luICsgb2Zmc2V0U2hpZnQgPCAwKSB7XG4gICAgbmV3Um9vdCA9IG5ldyBWTm9kZShcbiAgICAgIG5ld1Jvb3QgJiYgbmV3Um9vdC5hcnJheS5sZW5ndGggPyBbdW5kZWZpbmVkLCBuZXdSb290XSA6IFtdLFxuICAgICAgb3duZXJcbiAgICApO1xuICAgIG5ld0xldmVsICs9IFNISUZUO1xuICAgIG9mZnNldFNoaWZ0ICs9IDEgPDwgbmV3TGV2ZWw7XG4gIH1cbiAgaWYgKG9mZnNldFNoaWZ0KSB7XG4gICAgbmV3T3JpZ2luICs9IG9mZnNldFNoaWZ0O1xuICAgIG9sZE9yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICBuZXdDYXBhY2l0eSArPSBvZmZzZXRTaGlmdDtcbiAgICBvbGRDYXBhY2l0eSArPSBvZmZzZXRTaGlmdDtcbiAgfVxuXG4gIHZhciBvbGRUYWlsT2Zmc2V0ID0gZ2V0VGFpbE9mZnNldChvbGRDYXBhY2l0eSk7XG4gIHZhciBuZXdUYWlsT2Zmc2V0ID0gZ2V0VGFpbE9mZnNldChuZXdDYXBhY2l0eSk7XG5cbiAgLy8gTmV3IHNpemUgbWlnaHQgbmVlZCBjcmVhdGluZyBhIGhpZ2hlciByb290LlxuICB3aGlsZSAobmV3VGFpbE9mZnNldCA+PSAxIDw8IChuZXdMZXZlbCArIFNISUZUKSkge1xuICAgIG5ld1Jvb3QgPSBuZXcgVk5vZGUoXG4gICAgICBuZXdSb290ICYmIG5ld1Jvb3QuYXJyYXkubGVuZ3RoID8gW25ld1Jvb3RdIDogW10sXG4gICAgICBvd25lclxuICAgICk7XG4gICAgbmV3TGV2ZWwgKz0gU0hJRlQ7XG4gIH1cblxuICAvLyBMb2NhdGUgb3IgY3JlYXRlIHRoZSBuZXcgdGFpbC5cbiAgdmFyIG9sZFRhaWwgPSBsaXN0Ll90YWlsO1xuICB2YXIgbmV3VGFpbCA9XG4gICAgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXRcbiAgICAgID8gbGlzdE5vZGVGb3IobGlzdCwgbmV3Q2FwYWNpdHkgLSAxKVxuICAgICAgOiBuZXdUYWlsT2Zmc2V0ID4gb2xkVGFpbE9mZnNldFxuICAgICAgPyBuZXcgVk5vZGUoW10sIG93bmVyKVxuICAgICAgOiBvbGRUYWlsO1xuXG4gIC8vIE1lcmdlIFRhaWwgaW50byB0cmVlLlxuICBpZiAoXG4gICAgb2xkVGFpbCAmJlxuICAgIG5ld1RhaWxPZmZzZXQgPiBvbGRUYWlsT2Zmc2V0ICYmXG4gICAgbmV3T3JpZ2luIDwgb2xkQ2FwYWNpdHkgJiZcbiAgICBvbGRUYWlsLmFycmF5Lmxlbmd0aFxuICApIHtcbiAgICBuZXdSb290ID0gZWRpdGFibGVWTm9kZShuZXdSb290LCBvd25lcik7XG4gICAgdmFyIG5vZGUgPSBuZXdSb290O1xuICAgIGZvciAodmFyIGxldmVsID0gbmV3TGV2ZWw7IGxldmVsID4gU0hJRlQ7IGxldmVsIC09IFNISUZUKSB7XG4gICAgICB2YXIgaWR4ID0gKG9sZFRhaWxPZmZzZXQgPj4+IGxldmVsKSAmIE1BU0s7XG4gICAgICBub2RlID0gbm9kZS5hcnJheVtpZHhdID0gZWRpdGFibGVWTm9kZShub2RlLmFycmF5W2lkeF0sIG93bmVyKTtcbiAgICB9XG4gICAgbm9kZS5hcnJheVsob2xkVGFpbE9mZnNldCA+Pj4gU0hJRlQpICYgTUFTS10gPSBvbGRUYWlsO1xuICB9XG5cbiAgLy8gSWYgdGhlIHNpemUgaGFzIGJlZW4gcmVkdWNlZCwgdGhlcmUncyBhIGNoYW5jZSB0aGUgdGFpbCBuZWVkcyB0byBiZSB0cmltbWVkLlxuICBpZiAobmV3Q2FwYWNpdHkgPCBvbGRDYXBhY2l0eSkge1xuICAgIG5ld1RhaWwgPSBuZXdUYWlsICYmIG5ld1RhaWwucmVtb3ZlQWZ0ZXIob3duZXIsIDAsIG5ld0NhcGFjaXR5KTtcbiAgfVxuXG4gIC8vIElmIHRoZSBuZXcgb3JpZ2luIGlzIHdpdGhpbiB0aGUgdGFpbCwgdGhlbiB3ZSBkbyBub3QgbmVlZCBhIHJvb3QuXG4gIGlmIChuZXdPcmlnaW4gPj0gbmV3VGFpbE9mZnNldCkge1xuICAgIG5ld09yaWdpbiAtPSBuZXdUYWlsT2Zmc2V0O1xuICAgIG5ld0NhcGFjaXR5IC09IG5ld1RhaWxPZmZzZXQ7XG4gICAgbmV3TGV2ZWwgPSBTSElGVDtcbiAgICBuZXdSb290ID0gbnVsbDtcbiAgICBuZXdUYWlsID0gbmV3VGFpbCAmJiBuZXdUYWlsLnJlbW92ZUJlZm9yZShvd25lciwgMCwgbmV3T3JpZ2luKTtcblxuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIHJvb3QgaGFzIGJlZW4gdHJpbW1lZCwgZ2FyYmFnZSBjb2xsZWN0LlxuICB9IGVsc2UgaWYgKG5ld09yaWdpbiA+IG9sZE9yaWdpbiB8fCBuZXdUYWlsT2Zmc2V0IDwgb2xkVGFpbE9mZnNldCkge1xuICAgIG9mZnNldFNoaWZ0ID0gMDtcblxuICAgIC8vIElkZW50aWZ5IHRoZSBuZXcgdG9wIHJvb3Qgbm9kZSBvZiB0aGUgc3VidHJlZSBvZiB0aGUgb2xkIHJvb3QuXG4gICAgd2hpbGUgKG5ld1Jvb3QpIHtcbiAgICAgIHZhciBiZWdpbkluZGV4ID0gKG5ld09yaWdpbiA+Pj4gbmV3TGV2ZWwpICYgTUFTSztcbiAgICAgIGlmICgoYmVnaW5JbmRleCAhPT0gbmV3VGFpbE9mZnNldCA+Pj4gbmV3TGV2ZWwpICYgTUFTSykge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGlmIChiZWdpbkluZGV4KSB7XG4gICAgICAgIG9mZnNldFNoaWZ0ICs9ICgxIDw8IG5ld0xldmVsKSAqIGJlZ2luSW5kZXg7XG4gICAgICB9XG4gICAgICBuZXdMZXZlbCAtPSBTSElGVDtcbiAgICAgIG5ld1Jvb3QgPSBuZXdSb290LmFycmF5W2JlZ2luSW5kZXhdO1xuICAgIH1cblxuICAgIC8vIFRyaW0gdGhlIG5ldyBzaWRlcyBvZiB0aGUgbmV3IHJvb3QuXG4gICAgaWYgKG5ld1Jvb3QgJiYgbmV3T3JpZ2luID4gb2xkT3JpZ2luKSB7XG4gICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVCZWZvcmUob3duZXIsIG5ld0xldmVsLCBuZXdPcmlnaW4gLSBvZmZzZXRTaGlmdCk7XG4gICAgfVxuICAgIGlmIChuZXdSb290ICYmIG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0KSB7XG4gICAgICBuZXdSb290ID0gbmV3Um9vdC5yZW1vdmVBZnRlcihcbiAgICAgICAgb3duZXIsXG4gICAgICAgIG5ld0xldmVsLFxuICAgICAgICBuZXdUYWlsT2Zmc2V0IC0gb2Zmc2V0U2hpZnRcbiAgICAgICk7XG4gICAgfVxuICAgIGlmIChvZmZzZXRTaGlmdCkge1xuICAgICAgbmV3T3JpZ2luIC09IG9mZnNldFNoaWZ0O1xuICAgICAgbmV3Q2FwYWNpdHkgLT0gb2Zmc2V0U2hpZnQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKGxpc3QuX19vd25lcklEKSB7XG4gICAgbGlzdC5zaXplID0gbmV3Q2FwYWNpdHkgLSBuZXdPcmlnaW47XG4gICAgbGlzdC5fb3JpZ2luID0gbmV3T3JpZ2luO1xuICAgIGxpc3QuX2NhcGFjaXR5ID0gbmV3Q2FwYWNpdHk7XG4gICAgbGlzdC5fbGV2ZWwgPSBuZXdMZXZlbDtcbiAgICBsaXN0Ll9yb290ID0gbmV3Um9vdDtcbiAgICBsaXN0Ll90YWlsID0gbmV3VGFpbDtcbiAgICBsaXN0Ll9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICBsaXN0Ll9fYWx0ZXJlZCA9IHRydWU7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cbiAgcmV0dXJuIG1ha2VMaXN0KG5ld09yaWdpbiwgbmV3Q2FwYWNpdHksIG5ld0xldmVsLCBuZXdSb290LCBuZXdUYWlsKTtcbn1cblxuZnVuY3Rpb24gZ2V0VGFpbE9mZnNldChzaXplKSB7XG4gIHJldHVybiBzaXplIDwgU0laRSA/IDAgOiAoKHNpemUgLSAxKSA+Pj4gU0hJRlQpIDw8IFNISUZUO1xufVxuXG52YXIgT3JkZXJlZE1hcCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKE1hcCkge1xuICBmdW5jdGlvbiBPcmRlcmVkTWFwKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlPcmRlcmVkTWFwKClcbiAgICAgIDogaXNPcmRlcmVkTWFwKHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBlbXB0eU9yZGVyZWRNYXAoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgICB2YXIgaXRlciA9IEtleWVkQ29sbGVjdGlvbih2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIG1hcC5zZXQoaywgdik7IH0pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGlmICggTWFwICkgT3JkZXJlZE1hcC5fX3Byb3RvX18gPSBNYXA7XG4gIE9yZGVyZWRNYXAucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggTWFwICYmIE1hcC5wcm90b3R5cGUgKTtcbiAgT3JkZXJlZE1hcC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBPcmRlcmVkTWFwO1xuXG4gIE9yZGVyZWRNYXAub2YgPSBmdW5jdGlvbiBvZiAoLyouLi52YWx1ZXMqLykge1xuICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgT3JkZXJlZE1hcC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZE1hcCB7JywgJ30nKTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaywgbm90U2V0VmFsdWUpIHtcbiAgICB2YXIgaW5kZXggPSB0aGlzLl9tYXAuZ2V0KGspO1xuICAgIHJldHVybiBpbmRleCAhPT0gdW5kZWZpbmVkID8gdGhpcy5fbGlzdC5nZXQoaW5kZXgpWzFdIDogbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgdGhpcy5fbWFwLmNsZWFyKCk7XG4gICAgICB0aGlzLl9saXN0LmNsZWFyKCk7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5T3JkZXJlZE1hcCgpO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAoaywgdikge1xuICAgIHJldHVybiB1cGRhdGVPcmRlcmVkTWFwKHRoaXMsIGssIHYpO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoaykge1xuICAgIHJldHVybiB1cGRhdGVPcmRlcmVkTWFwKHRoaXMsIGssIE5PVF9TRVQpO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuX2xpc3QuX19pdGVyYXRlKFxuICAgICAgZnVuY3Rpb24gKGVudHJ5KSB7IHJldHVybiBlbnRyeSAmJiBmbihlbnRyeVsxXSwgZW50cnlbMF0sIHRoaXMkMSQxKTsgfSxcbiAgICAgIHJldmVyc2VcbiAgICApO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpc3QuZnJvbUVudHJ5U2VxKCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgfTtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24gX19lbnN1cmVPd25lciAob3duZXJJRCkge1xuICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciBuZXdNYXAgPSB0aGlzLl9tYXAuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICB2YXIgbmV3TGlzdCA9IHRoaXMuX2xpc3QuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgICBpZiAoIW93bmVySUQpIHtcbiAgICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGVtcHR5T3JkZXJlZE1hcCgpO1xuICAgICAgfVxuICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgIHRoaXMuX2xpc3QgPSBuZXdMaXN0O1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlT3JkZXJlZE1hcChuZXdNYXAsIG5ld0xpc3QsIG93bmVySUQsIHRoaXMuX19oYXNoKTtcbiAgfTtcblxuICByZXR1cm4gT3JkZXJlZE1hcDtcbn0oTWFwKSk7XG5cbk9yZGVyZWRNYXAuaXNPcmRlcmVkTWFwID0gaXNPcmRlcmVkTWFwO1xuXG5PcmRlcmVkTWFwLnByb3RvdHlwZVtJU19PUkRFUkVEX1NZTUJPTF0gPSB0cnVlO1xuT3JkZXJlZE1hcC5wcm90b3R5cGVbREVMRVRFXSA9IE9yZGVyZWRNYXAucHJvdG90eXBlLnJlbW92ZTtcblxuZnVuY3Rpb24gbWFrZU9yZGVyZWRNYXAobWFwLCBsaXN0LCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBvbWFwID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkTWFwLnByb3RvdHlwZSk7XG4gIG9tYXAuc2l6ZSA9IG1hcCA/IG1hcC5zaXplIDogMDtcbiAgb21hcC5fbWFwID0gbWFwO1xuICBvbWFwLl9saXN0ID0gbGlzdDtcbiAgb21hcC5fX293bmVySUQgPSBvd25lcklEO1xuICBvbWFwLl9faGFzaCA9IGhhc2g7XG4gIG9tYXAuX19hbHRlcmVkID0gZmFsc2U7XG4gIHJldHVybiBvbWFwO1xufVxuXG52YXIgRU1QVFlfT1JERVJFRF9NQVA7XG5mdW5jdGlvbiBlbXB0eU9yZGVyZWRNYXAoKSB7XG4gIHJldHVybiAoXG4gICAgRU1QVFlfT1JERVJFRF9NQVAgfHxcbiAgICAoRU1QVFlfT1JERVJFRF9NQVAgPSBtYWtlT3JkZXJlZE1hcChlbXB0eU1hcCgpLCBlbXB0eUxpc3QoKSkpXG4gICk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZU9yZGVyZWRNYXAob21hcCwgaywgdikge1xuICB2YXIgbWFwID0gb21hcC5fbWFwO1xuICB2YXIgbGlzdCA9IG9tYXAuX2xpc3Q7XG4gIHZhciBpID0gbWFwLmdldChrKTtcbiAgdmFyIGhhcyA9IGkgIT09IHVuZGVmaW5lZDtcbiAgdmFyIG5ld01hcDtcbiAgdmFyIG5ld0xpc3Q7XG4gIGlmICh2ID09PSBOT1RfU0VUKSB7XG4gICAgLy8gcmVtb3ZlZFxuICAgIGlmICghaGFzKSB7XG4gICAgICByZXR1cm4gb21hcDtcbiAgICB9XG4gICAgaWYgKGxpc3Quc2l6ZSA+PSBTSVpFICYmIGxpc3Quc2l6ZSA+PSBtYXAuc2l6ZSAqIDIpIHtcbiAgICAgIG5ld0xpc3QgPSBsaXN0LmZpbHRlcihmdW5jdGlvbiAoZW50cnksIGlkeCkgeyByZXR1cm4gZW50cnkgIT09IHVuZGVmaW5lZCAmJiBpICE9PSBpZHg7IH0pO1xuICAgICAgbmV3TWFwID0gbmV3TGlzdFxuICAgICAgICAudG9LZXllZFNlcSgpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7IHJldHVybiBlbnRyeVswXTsgfSlcbiAgICAgICAgLmZsaXAoKVxuICAgICAgICAudG9NYXAoKTtcbiAgICAgIGlmIChvbWFwLl9fb3duZXJJRCkge1xuICAgICAgICBuZXdNYXAuX19vd25lcklEID0gbmV3TGlzdC5fX293bmVySUQgPSBvbWFwLl9fb3duZXJJRDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbmV3TWFwID0gbWFwLnJlbW92ZShrKTtcbiAgICAgIG5ld0xpc3QgPSBpID09PSBsaXN0LnNpemUgLSAxID8gbGlzdC5wb3AoKSA6IGxpc3Quc2V0KGksIHVuZGVmaW5lZCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGhhcykge1xuICAgIGlmICh2ID09PSBsaXN0LmdldChpKVsxXSkge1xuICAgICAgcmV0dXJuIG9tYXA7XG4gICAgfVxuICAgIG5ld01hcCA9IG1hcDtcbiAgICBuZXdMaXN0ID0gbGlzdC5zZXQoaSwgW2ssIHZdKTtcbiAgfSBlbHNlIHtcbiAgICBuZXdNYXAgPSBtYXAuc2V0KGssIGxpc3Quc2l6ZSk7XG4gICAgbmV3TGlzdCA9IGxpc3Quc2V0KGxpc3Quc2l6ZSwgW2ssIHZdKTtcbiAgfVxuICBpZiAob21hcC5fX293bmVySUQpIHtcbiAgICBvbWFwLnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICBvbWFwLl9tYXAgPSBuZXdNYXA7XG4gICAgb21hcC5fbGlzdCA9IG5ld0xpc3Q7XG4gICAgb21hcC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgb21hcC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgIHJldHVybiBvbWFwO1xuICB9XG4gIHJldHVybiBtYWtlT3JkZXJlZE1hcChuZXdNYXAsIG5ld0xpc3QpO1xufVxuXG52YXIgSVNfU1RBQ0tfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfU1RBQ0tfX0BAJztcblxuZnVuY3Rpb24gaXNTdGFjayhtYXliZVN0YWNrKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlU3RhY2sgJiYgbWF5YmVTdGFja1tJU19TVEFDS19TWU1CT0xdKTtcbn1cblxudmFyIFN0YWNrID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gU3RhY2sodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eVN0YWNrKClcbiAgICAgIDogaXNTdGFjayh2YWx1ZSlcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZW1wdHlTdGFjaygpLnB1c2hBbGwodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBJbmRleGVkQ29sbGVjdGlvbiApIFN0YWNrLl9fcHJvdG9fXyA9IEluZGV4ZWRDb2xsZWN0aW9uO1xuICBTdGFjay5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBJbmRleGVkQ29sbGVjdGlvbiAmJiBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUgKTtcbiAgU3RhY2sucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU3RhY2s7XG5cbiAgU3RhY2sub2YgPSBmdW5jdGlvbiBvZiAoLyouLi52YWx1ZXMqLykge1xuICAgIHJldHVybiB0aGlzKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgU3RhY2sucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1N0YWNrIFsnLCAnXScpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgU3RhY2sucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICB3aGlsZSAoaGVhZCAmJiBpbmRleC0tKSB7XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgIH1cbiAgICByZXR1cm4gaGVhZCA/IGhlYWQudmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUucGVlayA9IGZ1bmN0aW9uIHBlZWsgKCkge1xuICAgIHJldHVybiB0aGlzLl9oZWFkICYmIHRoaXMuX2hlYWQudmFsdWU7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICBTdGFjay5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uIHB1c2ggKC8qLi4udmFsdWVzKi8pIHtcbiAgICB2YXIgYXJndW1lbnRzJDEgPSBhcmd1bWVudHM7XG5cbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplICsgYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgaGVhZCA9IHRoaXMuX2hlYWQ7XG4gICAgZm9yICh2YXIgaWkgPSBhcmd1bWVudHMubGVuZ3RoIC0gMTsgaWkgPj0gMDsgaWktLSkge1xuICAgICAgaGVhZCA9IHtcbiAgICAgICAgdmFsdWU6IGFyZ3VtZW50cyQxW2lpXSxcbiAgICAgICAgbmV4dDogaGVhZCxcbiAgICAgIH07XG4gICAgfVxuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgIHRoaXMuX2hlYWQgPSBoZWFkO1xuICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUucHVzaEFsbCA9IGZ1bmN0aW9uIHB1c2hBbGwgKGl0ZXIpIHtcbiAgICBpdGVyID0gSW5kZXhlZENvbGxlY3Rpb24oaXRlcik7XG4gICAgaWYgKGl0ZXIuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgPT09IDAgJiYgaXNTdGFjayhpdGVyKSkge1xuICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgfVxuICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgIGl0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgbmV3U2l6ZSsrO1xuICAgICAgaGVhZCA9IHtcbiAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICBuZXh0OiBoZWFkLFxuICAgICAgfTtcbiAgICB9LCAvKiByZXZlcnNlICovIHRydWUpO1xuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gbmV3U2l6ZTtcbiAgICAgIHRoaXMuX2hlYWQgPSBoZWFkO1xuICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VTdGFjayhuZXdTaXplLCBoZWFkKTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgxKTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgIHRoaXMuX2hlYWQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gZW1wdHlTdGFjaygpO1xuICB9O1xuXG4gIFN0YWNrLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChiZWdpbiwgZW5kKSB7XG4gICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgdGhpcy5zaXplKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHZhciByZXNvbHZlZEJlZ2luID0gcmVzb2x2ZUJlZ2luKGJlZ2luLCB0aGlzLnNpemUpO1xuICAgIHZhciByZXNvbHZlZEVuZCA9IHJlc29sdmVFbmQoZW5kLCB0aGlzLnNpemUpO1xuICAgIGlmIChyZXNvbHZlZEVuZCAhPT0gdGhpcy5zaXplKSB7XG4gICAgICAvLyBzdXBlci5zbGljZShiZWdpbiwgZW5kKTtcbiAgICAgIHJldHVybiBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLCBiZWdpbiwgZW5kKTtcbiAgICB9XG4gICAgdmFyIG5ld1NpemUgPSB0aGlzLnNpemUgLSByZXNvbHZlZEJlZ2luO1xuICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICB3aGlsZSAocmVzb2x2ZWRCZWdpbi0tKSB7XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgIH1cbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlU3RhY2sobmV3U2l6ZSwgaGVhZCk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNdXRhYmlsaXR5XG5cbiAgU3RhY2sucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eVN0YWNrKCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlU3RhY2sodGhpcy5zaXplLCB0aGlzLl9oZWFkLCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBJdGVyYXRpb25cblxuICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIG5ldyBBcnJheVNlcSh0aGlzLnRvQXJyYXkoKSkuX19pdGVyYXRlKFxuICAgICAgICBmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gZm4odiwgaywgdGhpcyQxJDEpOyB9LFxuICAgICAgICByZXZlcnNlXG4gICAgICApO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9oZWFkO1xuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICBpZiAoZm4obm9kZS52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgIH1cbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIG5ldyBBcnJheVNlcSh0aGlzLnRvQXJyYXkoKSkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB9XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChub2RlKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG5vZGUudmFsdWU7XG4gICAgICAgIG5vZGUgPSBub2RlLm5leHQ7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgdmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBTdGFjaztcbn0oSW5kZXhlZENvbGxlY3Rpb24pKTtcblxuU3RhY2suaXNTdGFjayA9IGlzU3RhY2s7XG5cbnZhciBTdGFja1Byb3RvdHlwZSA9IFN0YWNrLnByb3RvdHlwZTtcblN0YWNrUHJvdG90eXBlW0lTX1NUQUNLX1NZTUJPTF0gPSB0cnVlO1xuU3RhY2tQcm90b3R5cGUuc2hpZnQgPSBTdGFja1Byb3RvdHlwZS5wb3A7XG5TdGFja1Byb3RvdHlwZS51bnNoaWZ0ID0gU3RhY2tQcm90b3R5cGUucHVzaDtcblN0YWNrUHJvdG90eXBlLnVuc2hpZnRBbGwgPSBTdGFja1Byb3RvdHlwZS5wdXNoQWxsO1xuU3RhY2tQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IHdpdGhNdXRhdGlvbnM7XG5TdGFja1Byb3RvdHlwZS53YXNBbHRlcmVkID0gd2FzQWx0ZXJlZDtcblN0YWNrUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5TdGFja1Byb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL2luaXQnXSA9IFN0YWNrUHJvdG90eXBlLmFzTXV0YWJsZSA9IGFzTXV0YWJsZTtcblN0YWNrUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgYXJyKSB7XG4gIHJldHVybiByZXN1bHQudW5zaGlmdChhcnIpO1xufTtcblN0YWNrUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmouYXNJbW11dGFibGUoKTtcbn07XG5cbmZ1bmN0aW9uIG1ha2VTdGFjayhzaXplLCBoZWFkLCBvd25lcklELCBoYXNoKSB7XG4gIHZhciBtYXAgPSBPYmplY3QuY3JlYXRlKFN0YWNrUHJvdG90eXBlKTtcbiAgbWFwLnNpemUgPSBzaXplO1xuICBtYXAuX2hlYWQgPSBoZWFkO1xuICBtYXAuX19vd25lcklEID0gb3duZXJJRDtcbiAgbWFwLl9faGFzaCA9IGhhc2g7XG4gIG1hcC5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgcmV0dXJuIG1hcDtcbn1cblxudmFyIEVNUFRZX1NUQUNLO1xuZnVuY3Rpb24gZW1wdHlTdGFjaygpIHtcbiAgcmV0dXJuIEVNUFRZX1NUQUNLIHx8IChFTVBUWV9TVEFDSyA9IG1ha2VTdGFjaygwKSk7XG59XG5cbnZhciBJU19TRVRfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfU0VUX19AQCc7XG5cbmZ1bmN0aW9uIGlzU2V0KG1heWJlU2V0KSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlU2V0ICYmIG1heWJlU2V0W0lTX1NFVF9TWU1CT0xdKTtcbn1cblxuZnVuY3Rpb24gaXNPcmRlcmVkU2V0KG1heWJlT3JkZXJlZFNldCkge1xuICByZXR1cm4gaXNTZXQobWF5YmVPcmRlcmVkU2V0KSAmJiBpc09yZGVyZWQobWF5YmVPcmRlcmVkU2V0KTtcbn1cblxuZnVuY3Rpb24gZGVlcEVxdWFsKGEsIGIpIHtcbiAgaWYgKGEgPT09IGIpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChcbiAgICAhaXNDb2xsZWN0aW9uKGIpIHx8XG4gICAgKGEuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGIuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGEuc2l6ZSAhPT0gYi5zaXplKSB8fFxuICAgIChhLl9faGFzaCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBiLl9faGFzaCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICBhLl9faGFzaCAhPT0gYi5fX2hhc2gpIHx8XG4gICAgaXNLZXllZChhKSAhPT0gaXNLZXllZChiKSB8fFxuICAgIGlzSW5kZXhlZChhKSAhPT0gaXNJbmRleGVkKGIpIHx8XG4gICAgaXNPcmRlcmVkKGEpICE9PSBpc09yZGVyZWQoYilcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgaWYgKGEuc2l6ZSA9PT0gMCAmJiBiLnNpemUgPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHZhciBub3RBc3NvY2lhdGl2ZSA9ICFpc0Fzc29jaWF0aXZlKGEpO1xuXG4gIGlmIChpc09yZGVyZWQoYSkpIHtcbiAgICB2YXIgZW50cmllcyA9IGEuZW50cmllcygpO1xuICAgIHJldHVybiAoXG4gICAgICBiLmV2ZXJ5KGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGVudHJpZXMubmV4dCgpLnZhbHVlO1xuICAgICAgICByZXR1cm4gZW50cnkgJiYgaXMoZW50cnlbMV0sIHYpICYmIChub3RBc3NvY2lhdGl2ZSB8fCBpcyhlbnRyeVswXSwgaykpO1xuICAgICAgfSkgJiYgZW50cmllcy5uZXh0KCkuZG9uZVxuICAgICk7XG4gIH1cblxuICB2YXIgZmxpcHBlZCA9IGZhbHNlO1xuXG4gIGlmIChhLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmIChiLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiBhLmNhY2hlUmVzdWx0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGEuY2FjaGVSZXN1bHQoKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZmxpcHBlZCA9IHRydWU7XG4gICAgICB2YXIgXyA9IGE7XG4gICAgICBhID0gYjtcbiAgICAgIGIgPSBfO1xuICAgIH1cbiAgfVxuXG4gIHZhciBhbGxFcXVhbCA9IHRydWU7XG4gIHZhciBiU2l6ZSA9IGIuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgaWYgKFxuICAgICAgbm90QXNzb2NpYXRpdmVcbiAgICAgICAgPyAhYS5oYXModilcbiAgICAgICAgOiBmbGlwcGVkXG4gICAgICAgID8gIWlzKHYsIGEuZ2V0KGssIE5PVF9TRVQpKVxuICAgICAgICA6ICFpcyhhLmdldChrLCBOT1RfU0VUKSwgdilcbiAgICApIHtcbiAgICAgIGFsbEVxdWFsID0gZmFsc2U7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYWxsRXF1YWwgJiYgYS5zaXplID09PSBiU2l6ZTtcbn1cblxuZnVuY3Rpb24gbWl4aW4oY3RvciwgbWV0aG9kcykge1xuICB2YXIga2V5Q29waWVyID0gZnVuY3Rpb24gKGtleSkge1xuICAgIGN0b3IucHJvdG90eXBlW2tleV0gPSBtZXRob2RzW2tleV07XG4gIH07XG4gIE9iamVjdC5rZXlzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcbiAgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyAmJlxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMobWV0aG9kcykuZm9yRWFjaChrZXlDb3BpZXIpO1xuICByZXR1cm4gY3Rvcjtcbn1cblxuZnVuY3Rpb24gdG9KUyh2YWx1ZSkge1xuICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKCFpc0NvbGxlY3Rpb24odmFsdWUpKSB7XG4gICAgaWYgKCFpc0RhdGFTdHJ1Y3R1cmUodmFsdWUpKSB7XG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICAgIHZhbHVlID0gU2VxKHZhbHVlKTtcbiAgfVxuICBpZiAoaXNLZXllZCh2YWx1ZSkpIHtcbiAgICB2YXIgcmVzdWx0JDEgPSB7fTtcbiAgICB2YWx1ZS5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgIHJlc3VsdCQxW2tdID0gdG9KUyh2KTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0JDE7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YWx1ZS5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYpIHtcbiAgICByZXN1bHQucHVzaCh0b0pTKHYpKTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnZhciBTZXQgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChTZXRDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIFNldCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGVtcHR5U2V0KClcbiAgICAgIDogaXNTZXQodmFsdWUpICYmICFpc09yZGVyZWQodmFsdWUpXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGVtcHR5U2V0KCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBTZXRDb2xsZWN0aW9uKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gc2V0LmFkZCh2KTsgfSk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgaWYgKCBTZXRDb2xsZWN0aW9uICkgU2V0Ll9fcHJvdG9fXyA9IFNldENvbGxlY3Rpb247XG4gIFNldC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXRDb2xsZWN0aW9uICYmIFNldENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIFNldC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBTZXQ7XG5cbiAgU2V0Lm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIFNldC5mcm9tS2V5cyA9IGZ1bmN0aW9uIGZyb21LZXlzICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzKEtleWVkQ29sbGVjdGlvbih2YWx1ZSkua2V5U2VxKCkpO1xuICB9O1xuXG4gIFNldC5pbnRlcnNlY3QgPSBmdW5jdGlvbiBpbnRlcnNlY3QgKHNldHMpIHtcbiAgICBzZXRzID0gQ29sbGVjdGlvbihzZXRzKS50b0FycmF5KCk7XG4gICAgcmV0dXJuIHNldHMubGVuZ3RoXG4gICAgICA/IFNldFByb3RvdHlwZS5pbnRlcnNlY3QuYXBwbHkoU2V0KHNldHMucG9wKCkpLCBzZXRzKVxuICAgICAgOiBlbXB0eVNldCgpO1xuICB9O1xuXG4gIFNldC51bmlvbiA9IGZ1bmN0aW9uIHVuaW9uIChzZXRzKSB7XG4gICAgc2V0cyA9IENvbGxlY3Rpb24oc2V0cykudG9BcnJheSgpO1xuICAgIHJldHVybiBzZXRzLmxlbmd0aFxuICAgICAgPyBTZXRQcm90b3R5cGUudW5pb24uYXBwbHkoU2V0KHNldHMucG9wKCkpLCBzZXRzKVxuICAgICAgOiBlbXB0eVNldCgpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnU2V0IHsnLCAnfScpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgU2V0LnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBoYXMgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcC5oYXModmFsdWUpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiBhZGQgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAuc2V0KHZhbHVlLCB2YWx1ZSkpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlICh2YWx1ZSkge1xuICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLnJlbW92ZSh2YWx1ZSkpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgcmV0dXJuIHVwZGF0ZVNldCh0aGlzLCB0aGlzLl9tYXAuY2xlYXIoKSk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBDb21wb3NpdGlvblxuXG4gIFNldC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwIChtYXBwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgLy8ga2VlcCB0cmFjayBpZiB0aGUgc2V0IGlzIGFsdGVyZWQgYnkgdGhlIG1hcCBmdW5jdGlvblxuICAgIHZhciBkaWRDaGFuZ2VzID0gZmFsc2U7XG5cbiAgICB2YXIgbmV3TWFwID0gdXBkYXRlU2V0KFxuICAgICAgdGhpcyxcbiAgICAgIHRoaXMuX21hcC5tYXBFbnRyaWVzKGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgdmFyIHYgPSByZWZbMV07XG5cbiAgICAgICAgdmFyIG1hcHBlZCA9IG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIHYsIHRoaXMkMSQxKTtcblxuICAgICAgICBpZiAobWFwcGVkICE9PSB2KSB7XG4gICAgICAgICAgZGlkQ2hhbmdlcyA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW21hcHBlZCwgbWFwcGVkXTtcbiAgICAgIH0sIGNvbnRleHQpXG4gICAgKTtcblxuICAgIHJldHVybiBkaWRDaGFuZ2VzID8gbmV3TWFwIDogdGhpcztcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLnVuaW9uID0gZnVuY3Rpb24gdW5pb24gKCkge1xuICAgIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gICAgaXRlcnMgPSBpdGVycy5maWx0ZXIoZnVuY3Rpb24gKHgpIHsgcmV0dXJuIHguc2l6ZSAhPT0gMDsgfSk7XG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgPT09IDAgJiYgIXRoaXMuX19vd25lcklEICYmIGl0ZXJzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IoaXRlcnNbMF0pO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChzZXQpIHtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVycy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgU2V0Q29sbGVjdGlvbihpdGVyc1tpaV0pLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBzZXQuYWRkKHZhbHVlKTsgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgU2V0LnByb3RvdHlwZS5pbnRlcnNlY3QgPSBmdW5jdGlvbiBpbnRlcnNlY3QgKCkge1xuICAgIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGl0ZXJzID0gaXRlcnMubWFwKGZ1bmN0aW9uIChpdGVyKSB7IHJldHVybiBTZXRDb2xsZWN0aW9uKGl0ZXIpOyB9KTtcbiAgICB2YXIgdG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoIWl0ZXJzLmV2ZXJ5KGZ1bmN0aW9uIChpdGVyKSB7IHJldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKTsgfSkpIHtcbiAgICAgICAgdG9SZW1vdmUucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICB0b1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiBzdWJ0cmFjdCAoKSB7XG4gICAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgd2hpbGUgKCBsZW4tLSApIGl0ZXJzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaXRlcnMgPSBpdGVycy5tYXAoZnVuY3Rpb24gKGl0ZXIpIHsgcmV0dXJuIFNldENvbGxlY3Rpb24oaXRlcik7IH0pO1xuICAgIHZhciB0b1JlbW92ZSA9IFtdO1xuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmIChpdGVycy5zb21lKGZ1bmN0aW9uIChpdGVyKSB7IHJldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKTsgfSkpIHtcbiAgICAgICAgdG9SZW1vdmUucHVzaCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICB0b1JlbW92ZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBzZXQucmVtb3ZlKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuc29ydCA9IGZ1bmN0aW9uIHNvcnQgKGNvbXBhcmF0b3IpIHtcbiAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICByZXR1cm4gT3JkZXJlZFNldChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gIH07XG5cbiAgU2V0LnByb3RvdHlwZS5zb3J0QnkgPSBmdW5jdGlvbiBzb3J0QnkgKG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgIC8vIExhdGUgYmluZGluZ1xuICAgIHJldHVybiBPcmRlcmVkU2V0KHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uIHdhc0FsdGVyZWQgKCkge1xuICAgIHJldHVybiB0aGlzLl9tYXAud2FzQWx0ZXJlZCgpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy5fbWFwLl9faXRlcmF0ZShmdW5jdGlvbiAoaykgeyByZXR1cm4gZm4oaywgaywgdGhpcyQxJDEpOyB9LCByZXZlcnNlKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgcmV0dXJuIHRoaXMuX21hcC5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uIF9fZW5zdXJlT3duZXIgKG93bmVySUQpIHtcbiAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fZW1wdHkoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX21ha2UobmV3TWFwLCBvd25lcklEKTtcbiAgfTtcblxuICByZXR1cm4gU2V0O1xufShTZXRDb2xsZWN0aW9uKSk7XG5cblNldC5pc1NldCA9IGlzU2V0O1xuXG52YXIgU2V0UHJvdG90eXBlID0gU2V0LnByb3RvdHlwZTtcblNldFByb3RvdHlwZVtJU19TRVRfU1lNQk9MXSA9IHRydWU7XG5TZXRQcm90b3R5cGVbREVMRVRFXSA9IFNldFByb3RvdHlwZS5yZW1vdmU7XG5TZXRQcm90b3R5cGUubWVyZ2UgPSBTZXRQcm90b3R5cGUuY29uY2F0ID0gU2V0UHJvdG90eXBlLnVuaW9uO1xuU2V0UHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuU2V0UHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5TZXRQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBTZXRQcm90b3R5cGUuYXNNdXRhYmxlID0gYXNNdXRhYmxlO1xuU2V0UHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgYXJyKSB7XG4gIHJldHVybiByZXN1bHQuYWRkKGFycik7XG59O1xuU2V0UHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmouYXNJbW11dGFibGUoKTtcbn07XG5cblNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlTZXQ7XG5TZXRQcm90b3R5cGUuX19tYWtlID0gbWFrZVNldDtcblxuZnVuY3Rpb24gdXBkYXRlU2V0KHNldCwgbmV3TWFwKSB7XG4gIGlmIChzZXQuX19vd25lcklEKSB7XG4gICAgc2V0LnNpemUgPSBuZXdNYXAuc2l6ZTtcbiAgICBzZXQuX21hcCA9IG5ld01hcDtcbiAgICByZXR1cm4gc2V0O1xuICB9XG4gIHJldHVybiBuZXdNYXAgPT09IHNldC5fbWFwXG4gICAgPyBzZXRcbiAgICA6IG5ld01hcC5zaXplID09PSAwXG4gICAgPyBzZXQuX19lbXB0eSgpXG4gICAgOiBzZXQuX19tYWtlKG5ld01hcCk7XG59XG5cbmZ1bmN0aW9uIG1ha2VTZXQobWFwLCBvd25lcklEKSB7XG4gIHZhciBzZXQgPSBPYmplY3QuY3JlYXRlKFNldFByb3RvdHlwZSk7XG4gIHNldC5zaXplID0gbWFwID8gbWFwLnNpemUgOiAwO1xuICBzZXQuX21hcCA9IG1hcDtcbiAgc2V0Ll9fb3duZXJJRCA9IG93bmVySUQ7XG4gIHJldHVybiBzZXQ7XG59XG5cbnZhciBFTVBUWV9TRVQ7XG5mdW5jdGlvbiBlbXB0eVNldCgpIHtcbiAgcmV0dXJuIEVNUFRZX1NFVCB8fCAoRU1QVFlfU0VUID0gbWFrZVNldChlbXB0eU1hcCgpKSk7XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGxhenkgc2VxIG9mIG51bXMgZnJvbSBzdGFydCAoaW5jbHVzaXZlKSB0byBlbmRcbiAqIChleGNsdXNpdmUpLCBieSBzdGVwLCB3aGVyZSBzdGFydCBkZWZhdWx0cyB0byAwLCBzdGVwIHRvIDEsIGFuZCBlbmQgdG9cbiAqIGluZmluaXR5LiBXaGVuIHN0YXJ0IGlzIGVxdWFsIHRvIGVuZCwgcmV0dXJucyBlbXB0eSBsaXN0LlxuICovXG52YXIgUmFuZ2UgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChJbmRleGVkU2VxKSB7XG4gIGZ1bmN0aW9uIFJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmFuZ2UpKSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKHN0YXJ0LCBlbmQsIHN0ZXApO1xuICAgIH1cbiAgICBpbnZhcmlhbnQoc3RlcCAhPT0gMCwgJ0Nhbm5vdCBzdGVwIGEgUmFuZ2UgYnkgMCcpO1xuICAgIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGVuZCA9IEluZmluaXR5O1xuICAgIH1cbiAgICBzdGVwID0gc3RlcCA9PT0gdW5kZWZpbmVkID8gMSA6IE1hdGguYWJzKHN0ZXApO1xuICAgIGlmIChlbmQgPCBzdGFydCkge1xuICAgICAgc3RlcCA9IC1zdGVwO1xuICAgIH1cbiAgICB0aGlzLl9zdGFydCA9IHN0YXJ0O1xuICAgIHRoaXMuX2VuZCA9IGVuZDtcbiAgICB0aGlzLl9zdGVwID0gc3RlcDtcbiAgICB0aGlzLnNpemUgPSBNYXRoLm1heCgwLCBNYXRoLmNlaWwoKGVuZCAtIHN0YXJ0KSAvIHN0ZXAgLSAxKSArIDEpO1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIGlmIChFTVBUWV9SQU5HRSkge1xuICAgICAgICByZXR1cm4gRU1QVFlfUkFOR0U7XG4gICAgICB9XG4gICAgICBFTVBUWV9SQU5HRSA9IHRoaXM7XG4gICAgfVxuICB9XG5cbiAgaWYgKCBJbmRleGVkU2VxICkgUmFuZ2UuX19wcm90b19fID0gSW5kZXhlZFNlcTtcbiAgUmFuZ2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBSYW5nZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBSYW5nZTtcblxuICBSYW5nZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuICdSYW5nZSBbXSc7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICAnUmFuZ2UgWyAnICtcbiAgICAgIHRoaXMuX3N0YXJ0ICtcbiAgICAgICcuLi4nICtcbiAgICAgIHRoaXMuX2VuZCArXG4gICAgICAodGhpcy5fc3RlcCAhPT0gMSA/ICcgYnkgJyArIHRoaXMuX3N0ZXAgOiAnJykgK1xuICAgICAgJyBdJ1xuICAgICk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKGluZGV4KVxuICAgICAgPyB0aGlzLl9zdGFydCArIHdyYXBJbmRleCh0aGlzLCBpbmRleCkgKiB0aGlzLl9zdGVwXG4gICAgICA6IG5vdFNldFZhbHVlO1xuICB9O1xuXG4gIFJhbmdlLnByb3RvdHlwZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzIChzZWFyY2hWYWx1ZSkge1xuICAgIHZhciBwb3NzaWJsZUluZGV4ID0gKHNlYXJjaFZhbHVlIC0gdGhpcy5fc3RhcnQpIC8gdGhpcy5fc3RlcDtcbiAgICByZXR1cm4gKFxuICAgICAgcG9zc2libGVJbmRleCA+PSAwICYmXG4gICAgICBwb3NzaWJsZUluZGV4IDwgdGhpcy5zaXplICYmXG4gICAgICBwb3NzaWJsZUluZGV4ID09PSBNYXRoLmZsb29yKHBvc3NpYmxlSW5kZXgpXG4gICAgKTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoYmVnaW4sIGVuZCkge1xuICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHRoaXMuc2l6ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBiZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgdGhpcy5zaXplKTtcbiAgICBlbmQgPSByZXNvbHZlRW5kKGVuZCwgdGhpcy5zaXplKTtcbiAgICBpZiAoZW5kIDw9IGJlZ2luKSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKDAsIDApO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhbmdlKFxuICAgICAgdGhpcy5nZXQoYmVnaW4sIHRoaXMuX2VuZCksXG4gICAgICB0aGlzLmdldChlbmQsIHRoaXMuX2VuZCksXG4gICAgICB0aGlzLl9zdGVwXG4gICAgKTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHNlYXJjaFZhbHVlKSB7XG4gICAgdmFyIG9mZnNldFZhbHVlID0gc2VhcmNoVmFsdWUgLSB0aGlzLl9zdGFydDtcbiAgICBpZiAob2Zmc2V0VmFsdWUgJSB0aGlzLl9zdGVwID09PSAwKSB7XG4gICAgICB2YXIgaW5kZXggPSBvZmZzZXRWYWx1ZSAvIHRoaXMuX3N0ZXA7XG4gICAgICBpZiAoaW5kZXggPj0gMCAmJiBpbmRleCA8IHRoaXMuc2l6ZSkge1xuICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiAtMTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAoc2VhcmNoVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5pbmRleE9mKHNlYXJjaFZhbHVlKTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcbiAgICB2YXIgdmFsdWUgPSByZXZlcnNlID8gdGhpcy5fc3RhcnQgKyAoc2l6ZSAtIDEpICogc3RlcCA6IHRoaXMuX3N0YXJ0O1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSAhPT0gc2l6ZSkge1xuICAgICAgaWYgKGZuKHZhbHVlLCByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgdmFsdWUgKz0gcmV2ZXJzZSA/IC1zdGVwIDogc3RlcDtcbiAgICB9XG4gICAgcmV0dXJuIGk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIHN0ZXAgPSB0aGlzLl9zdGVwO1xuICAgIHZhciB2YWx1ZSA9IHJldmVyc2UgPyB0aGlzLl9zdGFydCArIChzaXplIC0gMSkgKiBzdGVwIDogdGhpcy5fc3RhcnQ7XG4gICAgdmFyIGkgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGkgPT09IHNpemUpIHtcbiAgICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgICAgfVxuICAgICAgdmFyIHYgPSB2YWx1ZTtcbiAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG4gICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKywgdik7XG4gICAgfSk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyAob3RoZXIpIHtcbiAgICByZXR1cm4gb3RoZXIgaW5zdGFuY2VvZiBSYW5nZVxuICAgICAgPyB0aGlzLl9zdGFydCA9PT0gb3RoZXIuX3N0YXJ0ICYmXG4gICAgICAgICAgdGhpcy5fZW5kID09PSBvdGhlci5fZW5kICYmXG4gICAgICAgICAgdGhpcy5fc3RlcCA9PT0gb3RoZXIuX3N0ZXBcbiAgICAgIDogZGVlcEVxdWFsKHRoaXMsIG90aGVyKTtcbiAgfTtcblxuICByZXR1cm4gUmFuZ2U7XG59KEluZGV4ZWRTZXEpKTtcblxudmFyIEVNUFRZX1JBTkdFO1xuXG5mdW5jdGlvbiBnZXRJbiQxKGNvbGxlY3Rpb24sIHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKSB7XG4gIHZhciBrZXlQYXRoID0gY29lcmNlS2V5UGF0aChzZWFyY2hLZXlQYXRoKTtcbiAgdmFyIGkgPSAwO1xuICB3aGlsZSAoaSAhPT0ga2V5UGF0aC5sZW5ndGgpIHtcbiAgICBjb2xsZWN0aW9uID0gZ2V0KGNvbGxlY3Rpb24sIGtleVBhdGhbaSsrXSwgTk9UX1NFVCk7XG4gICAgaWYgKGNvbGxlY3Rpb24gPT09IE5PVF9TRVQpIHtcbiAgICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGNvbGxlY3Rpb247XG59XG5cbmZ1bmN0aW9uIGdldEluKHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKSB7XG4gIHJldHVybiBnZXRJbiQxKHRoaXMsIHNlYXJjaEtleVBhdGgsIG5vdFNldFZhbHVlKTtcbn1cblxuZnVuY3Rpb24gaGFzSW4kMShjb2xsZWN0aW9uLCBrZXlQYXRoKSB7XG4gIHJldHVybiBnZXRJbiQxKGNvbGxlY3Rpb24sIGtleVBhdGgsIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xufVxuXG5mdW5jdGlvbiBoYXNJbihzZWFyY2hLZXlQYXRoKSB7XG4gIHJldHVybiBoYXNJbiQxKHRoaXMsIHNlYXJjaEtleVBhdGgpO1xufVxuXG5mdW5jdGlvbiB0b09iamVjdCgpIHtcbiAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgdmFyIG9iamVjdCA9IHt9O1xuICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbiAodiwgaykge1xuICAgIG9iamVjdFtrXSA9IHY7XG4gIH0pO1xuICByZXR1cm4gb2JqZWN0O1xufVxuXG4vLyBOb3RlOiBhbGwgb2YgdGhlc2UgbWV0aG9kcyBhcmUgZGVwcmVjYXRlZC5cbkNvbGxlY3Rpb24uaXNJdGVyYWJsZSA9IGlzQ29sbGVjdGlvbjtcbkNvbGxlY3Rpb24uaXNLZXllZCA9IGlzS2V5ZWQ7XG5Db2xsZWN0aW9uLmlzSW5kZXhlZCA9IGlzSW5kZXhlZDtcbkNvbGxlY3Rpb24uaXNBc3NvY2lhdGl2ZSA9IGlzQXNzb2NpYXRpdmU7XG5Db2xsZWN0aW9uLmlzT3JkZXJlZCA9IGlzT3JkZXJlZDtcblxuQ29sbGVjdGlvbi5JdGVyYXRvciA9IEl0ZXJhdG9yO1xuXG5taXhpbihDb2xsZWN0aW9uLCB7XG4gIC8vICMjIyBDb252ZXJzaW9uIHRvIG90aGVyIHR5cGVzXG5cbiAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheSgpIHtcbiAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgIHZhciBhcnJheSA9IG5ldyBBcnJheSh0aGlzLnNpemUgfHwgMCk7XG4gICAgdmFyIHVzZVR1cGxlcyA9IGlzS2V5ZWQodGhpcyk7XG4gICAgdmFyIGkgPSAwO1xuICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAvLyBLZXllZCBjb2xsZWN0aW9ucyBwcm9kdWNlIGFuIGFycmF5IG9mIHR1cGxlcy5cbiAgICAgIGFycmF5W2krK10gPSB1c2VUdXBsZXMgPyBbaywgdl0gOiB2O1xuICAgIH0pO1xuICAgIHJldHVybiBhcnJheTtcbiAgfSxcblxuICB0b0luZGV4ZWRTZXE6IGZ1bmN0aW9uIHRvSW5kZXhlZFNlcSgpIHtcbiAgICByZXR1cm4gbmV3IFRvSW5kZXhlZFNlcXVlbmNlKHRoaXMpO1xuICB9LFxuXG4gIHRvSlM6IGZ1bmN0aW9uIHRvSlMkMSgpIHtcbiAgICByZXR1cm4gdG9KUyh0aGlzKTtcbiAgfSxcblxuICB0b0tleWVkU2VxOiBmdW5jdGlvbiB0b0tleWVkU2VxKCkge1xuICAgIHJldHVybiBuZXcgVG9LZXllZFNlcXVlbmNlKHRoaXMsIHRydWUpO1xuICB9LFxuXG4gIHRvTWFwOiBmdW5jdGlvbiB0b01hcCgpIHtcbiAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgcmV0dXJuIE1hcCh0aGlzLnRvS2V5ZWRTZXEoKSk7XG4gIH0sXG5cbiAgdG9PYmplY3Q6IHRvT2JqZWN0LFxuXG4gIHRvT3JkZXJlZE1hcDogZnVuY3Rpb24gdG9PcmRlcmVkTWFwKCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gT3JkZXJlZE1hcCh0aGlzLnRvS2V5ZWRTZXEoKSk7XG4gIH0sXG5cbiAgdG9PcmRlcmVkU2V0OiBmdW5jdGlvbiB0b09yZGVyZWRTZXQoKSB7XG4gICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgIHJldHVybiBPcmRlcmVkU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgfSxcblxuICB0b1NldDogZnVuY3Rpb24gdG9TZXQoKSB7XG4gICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgIHJldHVybiBTZXQoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICB9LFxuXG4gIHRvU2V0U2VxOiBmdW5jdGlvbiB0b1NldFNlcSgpIHtcbiAgICByZXR1cm4gbmV3IFRvU2V0U2VxdWVuY2UodGhpcyk7XG4gIH0sXG5cbiAgdG9TZXE6IGZ1bmN0aW9uIHRvU2VxKCkge1xuICAgIHJldHVybiBpc0luZGV4ZWQodGhpcylcbiAgICAgID8gdGhpcy50b0luZGV4ZWRTZXEoKVxuICAgICAgOiBpc0tleWVkKHRoaXMpXG4gICAgICA/IHRoaXMudG9LZXllZFNlcSgpXG4gICAgICA6IHRoaXMudG9TZXRTZXEoKTtcbiAgfSxcblxuICB0b1N0YWNrOiBmdW5jdGlvbiB0b1N0YWNrKCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gU3RhY2soaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICB9LFxuXG4gIHRvTGlzdDogZnVuY3Rpb24gdG9MaXN0KCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gTGlzdChpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG4gIH0sXG5cbiAgLy8gIyMjIENvbW1vbiBKYXZhU2NyaXB0IG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcblxuICB0b1N0cmluZzogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdbQ29sbGVjdGlvbl0nO1xuICB9LFxuXG4gIF9fdG9TdHJpbmc6IGZ1bmN0aW9uIF9fdG9TdHJpbmcoaGVhZCwgdGFpbCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiBoZWFkICsgdGFpbDtcbiAgICB9XG4gICAgcmV0dXJuIChcbiAgICAgIGhlYWQgK1xuICAgICAgJyAnICtcbiAgICAgIHRoaXMudG9TZXEoKS5tYXAodGhpcy5fX3RvU3RyaW5nTWFwcGVyKS5qb2luKCcsICcpICtcbiAgICAgICcgJyArXG4gICAgICB0YWlsXG4gICAgKTtcbiAgfSxcblxuICAvLyAjIyMgRVM2IENvbGxlY3Rpb24gbWV0aG9kcyAoRVM2IEFycmF5IGFuZCBNYXApXG5cbiAgY29uY2F0OiBmdW5jdGlvbiBjb25jYXQoKSB7XG4gICAgdmFyIHZhbHVlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSB2YWx1ZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIHJldHVybiByZWlmeSh0aGlzLCBjb25jYXRGYWN0b3J5KHRoaXMsIHZhbHVlcykpO1xuICB9LFxuXG4gIGluY2x1ZGVzOiBmdW5jdGlvbiBpbmNsdWRlcyhzZWFyY2hWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnNvbWUoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpOyB9KTtcbiAgfSxcblxuICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKCkge1xuICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTKTtcbiAgfSxcblxuICBldmVyeTogZnVuY3Rpb24gZXZlcnkocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICB2YXIgcmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrLCBjKSB7XG4gICAgICBpZiAoIXByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHYsIGssIGMpKSB7XG4gICAgICAgIHJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmV0dXJuVmFsdWU7XG4gIH0sXG5cbiAgZmlsdGVyOiBmdW5jdGlvbiBmaWx0ZXIocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZpbHRlckZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCB0cnVlKSk7XG4gIH0sXG5cbiAgZmluZDogZnVuY3Rpb24gZmluZChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gZW50cnkgPyBlbnRyeVsxXSA6IG5vdFNldFZhbHVlO1xuICB9LFxuXG4gIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goc2lkZUVmZmVjdCwgY29udGV4dCkge1xuICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRlKGNvbnRleHQgPyBzaWRlRWZmZWN0LmJpbmQoY29udGV4dCkgOiBzaWRlRWZmZWN0KTtcbiAgfSxcblxuICBqb2luOiBmdW5jdGlvbiBqb2luKHNlcGFyYXRvcikge1xuICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgc2VwYXJhdG9yID0gc2VwYXJhdG9yICE9PSB1bmRlZmluZWQgPyAnJyArIHNlcGFyYXRvciA6ICcsJztcbiAgICB2YXIgam9pbmVkID0gJyc7XG4gICAgdmFyIGlzRmlyc3QgPSB0cnVlO1xuICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uICh2KSB7XG4gICAgICBpc0ZpcnN0ID8gKGlzRmlyc3QgPSBmYWxzZSkgOiAoam9pbmVkICs9IHNlcGFyYXRvcik7XG4gICAgICBqb2luZWQgKz0gdiAhPT0gbnVsbCAmJiB2ICE9PSB1bmRlZmluZWQgPyB2LnRvU3RyaW5nKCkgOiAnJztcbiAgICB9KTtcbiAgICByZXR1cm4gam9pbmVkO1xuICB9LFxuXG4gIGtleXM6IGZ1bmN0aW9uIGtleXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX0tFWVMpO1xuICB9LFxuXG4gIG1hcDogZnVuY3Rpb24gbWFwKG1hcHBlciwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCkpO1xuICB9LFxuXG4gIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlJDEocmVkdWNlciwgaW5pdGlhbFJlZHVjdGlvbiwgY29udGV4dCkge1xuICAgIHJldHVybiByZWR1Y2UoXG4gICAgICB0aGlzLFxuICAgICAgcmVkdWNlcixcbiAgICAgIGluaXRpYWxSZWR1Y3Rpb24sXG4gICAgICBjb250ZXh0LFxuICAgICAgYXJndW1lbnRzLmxlbmd0aCA8IDIsXG4gICAgICBmYWxzZVxuICAgICk7XG4gIH0sXG5cbiAgcmVkdWNlUmlnaHQ6IGZ1bmN0aW9uIHJlZHVjZVJpZ2h0KHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVkdWNlKFxuICAgICAgdGhpcyxcbiAgICAgIHJlZHVjZXIsXG4gICAgICBpbml0aWFsUmVkdWN0aW9uLFxuICAgICAgY29udGV4dCxcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPCAyLFxuICAgICAgdHJ1ZVxuICAgICk7XG4gIH0sXG5cbiAgcmV2ZXJzZTogZnVuY3Rpb24gcmV2ZXJzZSgpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgcmV2ZXJzZUZhY3RvcnkodGhpcywgdHJ1ZSkpO1xuICB9LFxuXG4gIHNsaWNlOiBmdW5jdGlvbiBzbGljZShiZWdpbiwgZW5kKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNsaWNlRmFjdG9yeSh0aGlzLCBiZWdpbiwgZW5kLCB0cnVlKSk7XG4gIH0sXG5cbiAgc29tZTogZnVuY3Rpb24gc29tZShwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gIXRoaXMuZXZlcnkobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICB9LFxuXG4gIHNvcnQ6IGZ1bmN0aW9uIHNvcnQoY29tcGFyYXRvcikge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKSk7XG4gIH0sXG5cbiAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUyk7XG4gIH0sXG5cbiAgLy8gIyMjIE1vcmUgc2VxdWVudGlhbCBtZXRob2RzXG5cbiAgYnV0TGFzdDogZnVuY3Rpb24gYnV0TGFzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgwLCAtMSk7XG4gIH0sXG5cbiAgaXNFbXB0eTogZnVuY3Rpb24gaXNFbXB0eSgpIHtcbiAgICByZXR1cm4gdGhpcy5zaXplICE9PSB1bmRlZmluZWQgPyB0aGlzLnNpemUgPT09IDAgOiAhdGhpcy5zb21lKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRydWU7IH0pO1xuICB9LFxuXG4gIGNvdW50OiBmdW5jdGlvbiBjb3VudChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZW5zdXJlU2l6ZShcbiAgICAgIHByZWRpY2F0ZSA/IHRoaXMudG9TZXEoKS5maWx0ZXIocHJlZGljYXRlLCBjb250ZXh0KSA6IHRoaXNcbiAgICApO1xuICB9LFxuXG4gIGNvdW50Qnk6IGZ1bmN0aW9uIGNvdW50QnkoZ3JvdXBlciwgY29udGV4dCkge1xuICAgIHJldHVybiBjb3VudEJ5RmFjdG9yeSh0aGlzLCBncm91cGVyLCBjb250ZXh0KTtcbiAgfSxcblxuICBlcXVhbHM6IGZ1bmN0aW9uIGVxdWFscyhvdGhlcikge1xuICAgIHJldHVybiBkZWVwRXF1YWwodGhpcywgb3RoZXIpO1xuICB9LFxuXG4gIGVudHJ5U2VxOiBmdW5jdGlvbiBlbnRyeVNlcSgpIHtcbiAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXM7XG4gICAgaWYgKGNvbGxlY3Rpb24uX2NhY2hlKSB7XG4gICAgICAvLyBXZSBjYWNoZSBhcyBhbiBlbnRyaWVzIGFycmF5LCBzbyB3ZSBjYW4ganVzdCByZXR1cm4gdGhlIGNhY2hlIVxuICAgICAgcmV0dXJuIG5ldyBBcnJheVNlcShjb2xsZWN0aW9uLl9jYWNoZSk7XG4gICAgfVxuICAgIHZhciBlbnRyaWVzU2VxdWVuY2UgPSBjb2xsZWN0aW9uLnRvU2VxKCkubWFwKGVudHJ5TWFwcGVyKS50b0luZGV4ZWRTZXEoKTtcbiAgICBlbnRyaWVzU2VxdWVuY2UuZnJvbUVudHJ5U2VxID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY29sbGVjdGlvbi50b1NlcSgpOyB9O1xuICAgIHJldHVybiBlbnRyaWVzU2VxdWVuY2U7XG4gIH0sXG5cbiAgZmlsdGVyTm90OiBmdW5jdGlvbiBmaWx0ZXJOb3QocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMuZmlsdGVyKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgfSxcblxuICBmaW5kRW50cnk6IGZ1bmN0aW9uIGZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIGZvdW5kID0gbm90U2V0VmFsdWU7XG4gICAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICAgIGlmIChwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICBmb3VuZCA9IFtrLCB2XTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBmb3VuZDtcbiAgfSxcblxuICBmaW5kS2V5OiBmdW5jdGlvbiBmaW5kS2V5KHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5WzBdO1xuICB9LFxuXG4gIGZpbmRMYXN0OiBmdW5jdGlvbiBmaW5kTGFzdChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKS5maW5kKHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIGZpbmRMYXN0RW50cnk6IGZ1bmN0aW9uIGZpbmRMYXN0RW50cnkocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKVxuICAgICAgLnJldmVyc2UoKVxuICAgICAgLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKTtcbiAgfSxcblxuICBmaW5kTGFzdEtleTogZnVuY3Rpb24gZmluZExhc3RLZXkocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudG9LZXllZFNlcSgpLnJldmVyc2UoKS5maW5kS2V5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gIH0sXG5cbiAgZmlyc3Q6IGZ1bmN0aW9uIGZpcnN0KG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZChyZXR1cm5UcnVlLCBudWxsLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgZmxhdE1hcDogZnVuY3Rpb24gZmxhdE1hcChtYXBwZXIsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdE1hcEZhY3RvcnkodGhpcywgbWFwcGVyLCBjb250ZXh0KSk7XG4gIH0sXG5cbiAgZmxhdHRlbjogZnVuY3Rpb24gZmxhdHRlbihkZXB0aCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgdHJ1ZSkpO1xuICB9LFxuXG4gIGZyb21FbnRyeVNlcTogZnVuY3Rpb24gZnJvbUVudHJ5U2VxKCkge1xuICAgIHJldHVybiBuZXcgRnJvbUVudHJpZXNTZXF1ZW5jZSh0aGlzKTtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uIGdldChzZWFyY2hLZXksIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZChmdW5jdGlvbiAoXywga2V5KSB7IHJldHVybiBpcyhrZXksIHNlYXJjaEtleSk7IH0sIHVuZGVmaW5lZCwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIGdldEluOiBnZXRJbixcblxuICBncm91cEJ5OiBmdW5jdGlvbiBncm91cEJ5KGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gZ3JvdXBCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gIH0sXG5cbiAgaGFzOiBmdW5jdGlvbiBoYXMoc2VhcmNoS2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KHNlYXJjaEtleSwgTk9UX1NFVCkgIT09IE5PVF9TRVQ7XG4gIH0sXG5cbiAgaGFzSW46IGhhc0luLFxuXG4gIGlzU3Vic2V0OiBmdW5jdGlvbiBpc1N1YnNldChpdGVyKSB7XG4gICAgaXRlciA9IHR5cGVvZiBpdGVyLmluY2x1ZGVzID09PSAnZnVuY3Rpb24nID8gaXRlciA6IENvbGxlY3Rpb24oaXRlcik7XG4gICAgcmV0dXJuIHRoaXMuZXZlcnkoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBpdGVyLmluY2x1ZGVzKHZhbHVlKTsgfSk7XG4gIH0sXG5cbiAgaXNTdXBlcnNldDogZnVuY3Rpb24gaXNTdXBlcnNldChpdGVyKSB7XG4gICAgaXRlciA9IHR5cGVvZiBpdGVyLmlzU3Vic2V0ID09PSAnZnVuY3Rpb24nID8gaXRlciA6IENvbGxlY3Rpb24oaXRlcik7XG4gICAgcmV0dXJuIGl0ZXIuaXNTdWJzZXQodGhpcyk7XG4gIH0sXG5cbiAga2V5T2Y6IGZ1bmN0aW9uIGtleU9mKHNlYXJjaFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZmluZEtleShmdW5jdGlvbiAodmFsdWUpIHsgcmV0dXJuIGlzKHZhbHVlLCBzZWFyY2hWYWx1ZSk7IH0pO1xuICB9LFxuXG4gIGtleVNlcTogZnVuY3Rpb24ga2V5U2VxKCkge1xuICAgIHJldHVybiB0aGlzLnRvU2VxKCkubWFwKGtleU1hcHBlcikudG9JbmRleGVkU2VxKCk7XG4gIH0sXG5cbiAgbGFzdDogZnVuY3Rpb24gbGFzdChub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRvU2VxKCkucmV2ZXJzZSgpLmZpcnN0KG5vdFNldFZhbHVlKTtcbiAgfSxcblxuICBsYXN0S2V5T2Y6IGZ1bmN0aW9uIGxhc3RLZXlPZihzZWFyY2hWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkua2V5T2Yoc2VhcmNoVmFsdWUpO1xuICB9LFxuXG4gIG1heDogZnVuY3Rpb24gbWF4KGNvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gbWF4RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yKTtcbiAgfSxcblxuICBtYXhCeTogZnVuY3Rpb24gbWF4QnkobWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKTtcbiAgfSxcblxuICBtaW46IGZ1bmN0aW9uIG1pbihjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heEZhY3RvcnkoXG4gICAgICB0aGlzLFxuICAgICAgY29tcGFyYXRvciA/IG5lZyhjb21wYXJhdG9yKSA6IGRlZmF1bHROZWdDb21wYXJhdG9yXG4gICAgKTtcbiAgfSxcblxuICBtaW5CeTogZnVuY3Rpb24gbWluQnkobWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heEZhY3RvcnkoXG4gICAgICB0aGlzLFxuICAgICAgY29tcGFyYXRvciA/IG5lZyhjb21wYXJhdG9yKSA6IGRlZmF1bHROZWdDb21wYXJhdG9yLFxuICAgICAgbWFwcGVyXG4gICAgKTtcbiAgfSxcblxuICByZXN0OiBmdW5jdGlvbiByZXN0KCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlKDEpO1xuICB9LFxuXG4gIHNraXA6IGZ1bmN0aW9uIHNraXAoYW1vdW50KSB7XG4gICAgcmV0dXJuIGFtb3VudCA9PT0gMCA/IHRoaXMgOiB0aGlzLnNsaWNlKE1hdGgubWF4KDAsIGFtb3VudCkpO1xuICB9LFxuXG4gIHNraXBMYXN0OiBmdW5jdGlvbiBza2lwTGFzdChhbW91bnQpIHtcbiAgICByZXR1cm4gYW1vdW50ID09PSAwID8gdGhpcyA6IHRoaXMuc2xpY2UoMCwgLU1hdGgubWF4KDAsIGFtb3VudCkpO1xuICB9LFxuXG4gIHNraXBXaGlsZTogZnVuY3Rpb24gc2tpcFdoaWxlKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBza2lwV2hpbGVGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgdHJ1ZSkpO1xuICB9LFxuXG4gIHNraXBVbnRpbDogZnVuY3Rpb24gc2tpcFVudGlsKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnNraXBXaGlsZShub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gIH0sXG5cbiAgc29ydEJ5OiBmdW5jdGlvbiBzb3J0QnkobWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcikpO1xuICB9LFxuXG4gIHRha2U6IGZ1bmN0aW9uIHRha2UoYW1vdW50KSB7XG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgTWF0aC5tYXgoMCwgYW1vdW50KSk7XG4gIH0sXG5cbiAgdGFrZUxhc3Q6IGZ1bmN0aW9uIHRha2VMYXN0KGFtb3VudCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlKC1NYXRoLm1heCgwLCBhbW91bnQpKTtcbiAgfSxcblxuICB0YWtlV2hpbGU6IGZ1bmN0aW9uIHRha2VXaGlsZShwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgdGFrZVdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQpKTtcbiAgfSxcblxuICB0YWtlVW50aWw6IGZ1bmN0aW9uIHRha2VVbnRpbChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy50YWtlV2hpbGUobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICB9LFxuXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGZuKSB7XG4gICAgcmV0dXJuIGZuKHRoaXMpO1xuICB9LFxuXG4gIHZhbHVlU2VxOiBmdW5jdGlvbiB2YWx1ZVNlcSgpIHtcbiAgICByZXR1cm4gdGhpcy50b0luZGV4ZWRTZXEoKTtcbiAgfSxcblxuICAvLyAjIyMgSGFzaGFibGUgT2JqZWN0XG5cbiAgaGFzaENvZGU6IGZ1bmN0aW9uIGhhc2hDb2RlKCkge1xuICAgIHJldHVybiB0aGlzLl9faGFzaCB8fCAodGhpcy5fX2hhc2ggPSBoYXNoQ29sbGVjdGlvbih0aGlzKSk7XG4gIH0sXG5cbiAgLy8gIyMjIEludGVybmFsXG5cbiAgLy8gYWJzdHJhY3QgX19pdGVyYXRlKGZuLCByZXZlcnNlKVxuXG4gIC8vIGFic3RyYWN0IF9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSlcbn0pO1xuXG52YXIgQ29sbGVjdGlvblByb3RvdHlwZSA9IENvbGxlY3Rpb24ucHJvdG90eXBlO1xuQ29sbGVjdGlvblByb3RvdHlwZVtJU19DT0xMRUNUSU9OX1NZTUJPTF0gPSB0cnVlO1xuQ29sbGVjdGlvblByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gQ29sbGVjdGlvblByb3RvdHlwZS52YWx1ZXM7XG5Db2xsZWN0aW9uUHJvdG90eXBlLnRvSlNPTiA9IENvbGxlY3Rpb25Qcm90b3R5cGUudG9BcnJheTtcbkNvbGxlY3Rpb25Qcm90b3R5cGUuX190b1N0cmluZ01hcHBlciA9IHF1b3RlU3RyaW5nO1xuQ29sbGVjdGlvblByb3RvdHlwZS5pbnNwZWN0ID0gQ29sbGVjdGlvblByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5Db2xsZWN0aW9uUHJvdG90eXBlLmNoYWluID0gQ29sbGVjdGlvblByb3RvdHlwZS5mbGF0TWFwO1xuQ29sbGVjdGlvblByb3RvdHlwZS5jb250YWlucyA9IENvbGxlY3Rpb25Qcm90b3R5cGUuaW5jbHVkZXM7XG5cbm1peGluKEtleWVkQ29sbGVjdGlvbiwge1xuICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuICBmbGlwOiBmdW5jdGlvbiBmbGlwKCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGlwRmFjdG9yeSh0aGlzKSk7XG4gIH0sXG5cbiAgbWFwRW50cmllczogZnVuY3Rpb24gbWFwRW50cmllcyhtYXBwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHJldHVybiByZWlmeShcbiAgICAgIHRoaXMsXG4gICAgICB0aGlzLnRvU2VxKClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gbWFwcGVyLmNhbGwoY29udGV4dCwgW2ssIHZdLCBpdGVyYXRpb25zKyssIHRoaXMkMSQxKTsgfSlcbiAgICAgICAgLmZyb21FbnRyeVNlcSgpXG4gICAgKTtcbiAgfSxcblxuICBtYXBLZXlzOiBmdW5jdGlvbiBtYXBLZXlzKG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gcmVpZnkoXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy50b1NlcSgpXG4gICAgICAgIC5mbGlwKClcbiAgICAgICAgLm1hcChmdW5jdGlvbiAoaywgdikgeyByZXR1cm4gbWFwcGVyLmNhbGwoY29udGV4dCwgaywgdiwgdGhpcyQxJDEpOyB9KVxuICAgICAgICAuZmxpcCgpXG4gICAgKTtcbiAgfSxcbn0pO1xuXG52YXIgS2V5ZWRDb2xsZWN0aW9uUHJvdG90eXBlID0gS2V5ZWRDb2xsZWN0aW9uLnByb3RvdHlwZTtcbktleWVkQ29sbGVjdGlvblByb3RvdHlwZVtJU19LRVlFRF9TWU1CT0xdID0gdHJ1ZTtcbktleWVkQ29sbGVjdGlvblByb3RvdHlwZVtJVEVSQVRPUl9TWU1CT0xdID0gQ29sbGVjdGlvblByb3RvdHlwZS5lbnRyaWVzO1xuS2V5ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnRvSlNPTiA9IHRvT2JqZWN0O1xuS2V5ZWRDb2xsZWN0aW9uUHJvdG90eXBlLl9fdG9TdHJpbmdNYXBwZXIgPSBmdW5jdGlvbiAodiwgaykgeyByZXR1cm4gcXVvdGVTdHJpbmcoaykgKyAnOiAnICsgcXVvdGVTdHJpbmcodik7IH07XG5cbm1peGluKEluZGV4ZWRDb2xsZWN0aW9uLCB7XG4gIC8vICMjIyBDb252ZXJzaW9uIHRvIG90aGVyIHR5cGVzXG5cbiAgdG9LZXllZFNlcTogZnVuY3Rpb24gdG9LZXllZFNlcSgpIHtcbiAgICByZXR1cm4gbmV3IFRvS2V5ZWRTZXF1ZW5jZSh0aGlzLCBmYWxzZSk7XG4gIH0sXG5cbiAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmaWx0ZXJGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgZmFsc2UpKTtcbiAgfSxcblxuICBmaW5kSW5kZXg6IGZ1bmN0aW9uIGZpbmRJbmRleChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHJldHVybiBlbnRyeSA/IGVudHJ5WzBdIDogLTE7XG4gIH0sXG5cbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hWYWx1ZSkge1xuICAgIHZhciBrZXkgPSB0aGlzLmtleU9mKHNlYXJjaFZhbHVlKTtcbiAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgPyAtMSA6IGtleTtcbiAgfSxcblxuICBsYXN0SW5kZXhPZjogZnVuY3Rpb24gbGFzdEluZGV4T2Yoc2VhcmNoVmFsdWUpIHtcbiAgICB2YXIga2V5ID0gdGhpcy5sYXN0S2V5T2Yoc2VhcmNoVmFsdWUpO1xuICAgIHJldHVybiBrZXkgPT09IHVuZGVmaW5lZCA/IC0xIDoga2V5O1xuICB9LFxuXG4gIHJldmVyc2U6IGZ1bmN0aW9uIHJldmVyc2UoKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHJldmVyc2VGYWN0b3J5KHRoaXMsIGZhbHNlKSk7XG4gIH0sXG5cbiAgc2xpY2U6IGZ1bmN0aW9uIHNsaWNlKGJlZ2luLCBlbmQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgc2xpY2VGYWN0b3J5KHRoaXMsIGJlZ2luLCBlbmQsIGZhbHNlKSk7XG4gIH0sXG5cbiAgc3BsaWNlOiBmdW5jdGlvbiBzcGxpY2UoaW5kZXgsIHJlbW92ZU51bSAvKiwgLi4udmFsdWVzKi8pIHtcbiAgICB2YXIgbnVtQXJncyA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgcmVtb3ZlTnVtID0gTWF0aC5tYXgocmVtb3ZlTnVtIHx8IDAsIDApO1xuICAgIGlmIChudW1BcmdzID09PSAwIHx8IChudW1BcmdzID09PSAyICYmICFyZW1vdmVOdW0pKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLy8gSWYgaW5kZXggaXMgbmVnYXRpdmUsIGl0IHNob3VsZCByZXNvbHZlIHJlbGF0aXZlIHRvIHRoZSBzaXplIG9mIHRoZVxuICAgIC8vIGNvbGxlY3Rpb24uIEhvd2V2ZXIgc2l6ZSBtYXkgYmUgZXhwZW5zaXZlIHRvIGNvbXB1dGUgaWYgbm90IGNhY2hlZCwgc29cbiAgICAvLyBvbmx5IGNhbGwgY291bnQoKSBpZiB0aGUgbnVtYmVyIGlzIGluIGZhY3QgbmVnYXRpdmUuXG4gICAgaW5kZXggPSByZXNvbHZlQmVnaW4oaW5kZXgsIGluZGV4IDwgMCA/IHRoaXMuY291bnQoKSA6IHRoaXMuc2l6ZSk7XG4gICAgdmFyIHNwbGljZWQgPSB0aGlzLnNsaWNlKDAsIGluZGV4KTtcbiAgICByZXR1cm4gcmVpZnkoXG4gICAgICB0aGlzLFxuICAgICAgbnVtQXJncyA9PT0gMVxuICAgICAgICA/IHNwbGljZWRcbiAgICAgICAgOiBzcGxpY2VkLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cywgMiksIHRoaXMuc2xpY2UoaW5kZXggKyByZW1vdmVOdW0pKVxuICAgICk7XG4gIH0sXG5cbiAgLy8gIyMjIE1vcmUgY29sbGVjdGlvbiBtZXRob2RzXG5cbiAgZmluZExhc3RJbmRleDogZnVuY3Rpb24gZmluZExhc3RJbmRleChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRMYXN0RW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gZW50cnkgPyBlbnRyeVswXSA6IC0xO1xuICB9LFxuXG4gIGZpcnN0OiBmdW5jdGlvbiBmaXJzdChub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmdldCgwLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgZmxhdHRlbjogZnVuY3Rpb24gZmxhdHRlbihkZXB0aCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmbGF0dGVuRmFjdG9yeSh0aGlzLCBkZXB0aCwgZmFsc2UpKTtcbiAgfSxcblxuICBnZXQ6IGZ1bmN0aW9uIGdldChpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgcmV0dXJuIGluZGV4IDwgMCB8fFxuICAgICAgdGhpcy5zaXplID09PSBJbmZpbml0eSB8fFxuICAgICAgKHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkICYmIGluZGV4ID4gdGhpcy5zaXplKVxuICAgICAgPyBub3RTZXRWYWx1ZVxuICAgICAgOiB0aGlzLmZpbmQoZnVuY3Rpb24gKF8sIGtleSkgeyByZXR1cm4ga2V5ID09PSBpbmRleDsgfSwgdW5kZWZpbmVkLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgaGFzOiBmdW5jdGlvbiBoYXMoaW5kZXgpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgcmV0dXJuIChcbiAgICAgIGluZGV4ID49IDAgJiZcbiAgICAgICh0aGlzLnNpemUgIT09IHVuZGVmaW5lZFxuICAgICAgICA/IHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHwgaW5kZXggPCB0aGlzLnNpemVcbiAgICAgICAgOiB0aGlzLmluZGV4T2YoaW5kZXgpICE9PSAtMSlcbiAgICApO1xuICB9LFxuXG4gIGludGVycG9zZTogZnVuY3Rpb24gaW50ZXJwb3NlKHNlcGFyYXRvcikge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBpbnRlcnBvc2VGYWN0b3J5KHRoaXMsIHNlcGFyYXRvcikpO1xuICB9LFxuXG4gIGludGVybGVhdmU6IGZ1bmN0aW9uIGludGVybGVhdmUoLyouLi5jb2xsZWN0aW9ucyovKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zID0gW3RoaXNdLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cykpO1xuICAgIHZhciB6aXBwZWQgPSB6aXBXaXRoRmFjdG9yeSh0aGlzLnRvU2VxKCksIEluZGV4ZWRTZXEub2YsIGNvbGxlY3Rpb25zKTtcbiAgICB2YXIgaW50ZXJsZWF2ZWQgPSB6aXBwZWQuZmxhdHRlbih0cnVlKTtcbiAgICBpZiAoemlwcGVkLnNpemUpIHtcbiAgICAgIGludGVybGVhdmVkLnNpemUgPSB6aXBwZWQuc2l6ZSAqIGNvbGxlY3Rpb25zLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGludGVybGVhdmVkKTtcbiAgfSxcblxuICBrZXlTZXE6IGZ1bmN0aW9uIGtleVNlcSgpIHtcbiAgICByZXR1cm4gUmFuZ2UoMCwgdGhpcy5zaXplKTtcbiAgfSxcblxuICBsYXN0OiBmdW5jdGlvbiBsYXN0KG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0KC0xLCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgc2tpcFdoaWxlOiBmdW5jdGlvbiBza2lwV2hpbGUocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNraXBXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0LCBmYWxzZSkpO1xuICB9LFxuXG4gIHppcDogZnVuY3Rpb24gemlwKC8qLCAuLi5jb2xsZWN0aW9ucyAqLykge1xuICAgIHZhciBjb2xsZWN0aW9ucyA9IFt0aGlzXS5jb25jYXQoYXJyQ29weShhcmd1bWVudHMpKTtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgemlwV2l0aEZhY3RvcnkodGhpcywgZGVmYXVsdFppcHBlciwgY29sbGVjdGlvbnMpKTtcbiAgfSxcblxuICB6aXBBbGw6IGZ1bmN0aW9uIHppcEFsbCgvKiwgLi4uY29sbGVjdGlvbnMgKi8pIHtcbiAgICB2YXIgY29sbGVjdGlvbnMgPSBbdGhpc10uY29uY2F0KGFyckNvcHkoYXJndW1lbnRzKSk7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHppcFdpdGhGYWN0b3J5KHRoaXMsIGRlZmF1bHRaaXBwZXIsIGNvbGxlY3Rpb25zLCB0cnVlKSk7XG4gIH0sXG5cbiAgemlwV2l0aDogZnVuY3Rpb24gemlwV2l0aCh6aXBwZXIgLyosIC4uLmNvbGxlY3Rpb25zICovKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zID0gYXJyQ29weShhcmd1bWVudHMpO1xuICAgIGNvbGxlY3Rpb25zWzBdID0gdGhpcztcbiAgICByZXR1cm4gcmVpZnkodGhpcywgemlwV2l0aEZhY3RvcnkodGhpcywgemlwcGVyLCBjb2xsZWN0aW9ucykpO1xuICB9LFxufSk7XG5cbnZhciBJbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZSA9IEluZGV4ZWRDb2xsZWN0aW9uLnByb3RvdHlwZTtcbkluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlW0lTX0lOREVYRURfU1lNQk9MXSA9IHRydWU7XG5JbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZVtJU19PUkRFUkVEX1NZTUJPTF0gPSB0cnVlO1xuXG5taXhpbihTZXRDb2xsZWN0aW9uLCB7XG4gIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICBnZXQ6IGZ1bmN0aW9uIGdldCh2YWx1ZSwgbm90U2V0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpID8gdmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgfSxcblxuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXModmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXModmFsdWUpO1xuICB9LFxuXG4gIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gIGtleVNlcTogZnVuY3Rpb24ga2V5U2VxKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlU2VxKCk7XG4gIH0sXG59KTtcblxudmFyIFNldENvbGxlY3Rpb25Qcm90b3R5cGUgPSBTZXRDb2xsZWN0aW9uLnByb3RvdHlwZTtcblNldENvbGxlY3Rpb25Qcm90b3R5cGUuaGFzID0gQ29sbGVjdGlvblByb3RvdHlwZS5pbmNsdWRlcztcblNldENvbGxlY3Rpb25Qcm90b3R5cGUuY29udGFpbnMgPSBTZXRDb2xsZWN0aW9uUHJvdG90eXBlLmluY2x1ZGVzO1xuU2V0Q29sbGVjdGlvblByb3RvdHlwZS5rZXlzID0gU2V0Q29sbGVjdGlvblByb3RvdHlwZS52YWx1ZXM7XG5cbi8vIE1peGluIHN1YmNsYXNzZXNcblxubWl4aW4oS2V5ZWRTZXEsIEtleWVkQ29sbGVjdGlvblByb3RvdHlwZSk7XG5taXhpbihJbmRleGVkU2VxLCBJbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZSk7XG5taXhpbihTZXRTZXEsIFNldENvbGxlY3Rpb25Qcm90b3R5cGUpO1xuXG4vLyAjcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxuZnVuY3Rpb24gcmVkdWNlKGNvbGxlY3Rpb24sIHJlZHVjZXIsIHJlZHVjdGlvbiwgY29udGV4dCwgdXNlRmlyc3QsIHJldmVyc2UpIHtcbiAgYXNzZXJ0Tm90SW5maW5pdGUoY29sbGVjdGlvbi5zaXplKTtcbiAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGssIGMpIHtcbiAgICBpZiAodXNlRmlyc3QpIHtcbiAgICAgIHVzZUZpcnN0ID0gZmFsc2U7XG4gICAgICByZWR1Y3Rpb24gPSB2O1xuICAgIH0gZWxzZSB7XG4gICAgICByZWR1Y3Rpb24gPSByZWR1Y2VyLmNhbGwoY29udGV4dCwgcmVkdWN0aW9uLCB2LCBrLCBjKTtcbiAgICB9XG4gIH0sIHJldmVyc2UpO1xuICByZXR1cm4gcmVkdWN0aW9uO1xufVxuXG5mdW5jdGlvbiBrZXlNYXBwZXIodiwgaykge1xuICByZXR1cm4gaztcbn1cblxuZnVuY3Rpb24gZW50cnlNYXBwZXIodiwgaykge1xuICByZXR1cm4gW2ssIHZdO1xufVxuXG5mdW5jdGlvbiBub3QocHJlZGljYXRlKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICFwcmVkaWNhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gbmVnKHByZWRpY2F0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAtcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRaaXBwZXIoKSB7XG4gIHJldHVybiBhcnJDb3B5KGFyZ3VtZW50cyk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHROZWdDb21wYXJhdG9yKGEsIGIpIHtcbiAgcmV0dXJuIGEgPCBiID8gMSA6IGEgPiBiID8gLTEgOiAwO1xufVxuXG5mdW5jdGlvbiBoYXNoQ29sbGVjdGlvbihjb2xsZWN0aW9uKSB7XG4gIGlmIChjb2xsZWN0aW9uLnNpemUgPT09IEluZmluaXR5KSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgdmFyIG9yZGVyZWQgPSBpc09yZGVyZWQoY29sbGVjdGlvbik7XG4gIHZhciBrZXllZCA9IGlzS2V5ZWQoY29sbGVjdGlvbik7XG4gIHZhciBoID0gb3JkZXJlZCA/IDEgOiAwO1xuICB2YXIgc2l6ZSA9IGNvbGxlY3Rpb24uX19pdGVyYXRlKFxuICAgIGtleWVkXG4gICAgICA/IG9yZGVyZWRcbiAgICAgICAgPyBmdW5jdGlvbiAodiwgaykge1xuICAgICAgICAgICAgaCA9ICgzMSAqIGggKyBoYXNoTWVyZ2UoaGFzaCh2KSwgaGFzaChrKSkpIHwgMDtcbiAgICAgICAgICB9XG4gICAgICAgIDogZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICAgIGggPSAoaCArIGhhc2hNZXJnZShoYXNoKHYpLCBoYXNoKGspKSkgfCAwO1xuICAgICAgICAgIH1cbiAgICAgIDogb3JkZXJlZFxuICAgICAgPyBmdW5jdGlvbiAodikge1xuICAgICAgICAgIGggPSAoMzEgKiBoICsgaGFzaCh2KSkgfCAwO1xuICAgICAgICB9XG4gICAgICA6IGZ1bmN0aW9uICh2KSB7XG4gICAgICAgICAgaCA9IChoICsgaGFzaCh2KSkgfCAwO1xuICAgICAgICB9XG4gICk7XG4gIHJldHVybiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpO1xufVxuXG5mdW5jdGlvbiBtdXJtdXJIYXNoT2ZTaXplKHNpemUsIGgpIHtcbiAgaCA9IGltdWwoaCwgMHhjYzllMmQ1MSk7XG4gIGggPSBpbXVsKChoIDw8IDE1KSB8IChoID4+PiAtMTUpLCAweDFiODczNTkzKTtcbiAgaCA9IGltdWwoKGggPDwgMTMpIHwgKGggPj4+IC0xMyksIDUpO1xuICBoID0gKChoICsgMHhlNjU0NmI2NCkgfCAwKSBeIHNpemU7XG4gIGggPSBpbXVsKGggXiAoaCA+Pj4gMTYpLCAweDg1ZWJjYTZiKTtcbiAgaCA9IGltdWwoaCBeIChoID4+PiAxMyksIDB4YzJiMmFlMzUpO1xuICBoID0gc21pKGggXiAoaCA+Pj4gMTYpKTtcbiAgcmV0dXJuIGg7XG59XG5cbmZ1bmN0aW9uIGhhc2hNZXJnZShhLCBiKSB7XG4gIHJldHVybiAoYSBeIChiICsgMHg5ZTM3NzliOSArIChhIDw8IDYpICsgKGEgPj4gMikpKSB8IDA7IC8vIGludFxufVxuXG52YXIgT3JkZXJlZFNldCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKFNldCkge1xuICBmdW5jdGlvbiBPcmRlcmVkU2V0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlPcmRlcmVkU2V0KClcbiAgICAgIDogaXNPcmRlcmVkU2V0KHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBlbXB0eU9yZGVyZWRTZXQoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChzZXQpIHtcbiAgICAgICAgICB2YXIgaXRlciA9IFNldENvbGxlY3Rpb24odmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uICh2KSB7IHJldHVybiBzZXQuYWRkKHYpOyB9KTtcbiAgICAgICAgfSk7XG4gIH1cblxuICBpZiAoIFNldCApIE9yZGVyZWRTZXQuX19wcm90b19fID0gU2V0O1xuICBPcmRlcmVkU2V0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIFNldCAmJiBTZXQucHJvdG90eXBlICk7XG4gIE9yZGVyZWRTZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gT3JkZXJlZFNldDtcblxuICBPcmRlcmVkU2V0Lm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIE9yZGVyZWRTZXQuZnJvbUtleXMgPSBmdW5jdGlvbiBmcm9tS2V5cyAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcyhLZXllZENvbGxlY3Rpb24odmFsdWUpLmtleVNlcSgpKTtcbiAgfTtcblxuICBPcmRlcmVkU2V0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdPcmRlcmVkU2V0IHsnLCAnfScpO1xuICB9O1xuXG4gIHJldHVybiBPcmRlcmVkU2V0O1xufShTZXQpKTtcblxuT3JkZXJlZFNldC5pc09yZGVyZWRTZXQgPSBpc09yZGVyZWRTZXQ7XG5cbnZhciBPcmRlcmVkU2V0UHJvdG90eXBlID0gT3JkZXJlZFNldC5wcm90b3R5cGU7XG5PcmRlcmVkU2V0UHJvdG90eXBlW0lTX09SREVSRURfU1lNQk9MXSA9IHRydWU7XG5PcmRlcmVkU2V0UHJvdG90eXBlLnppcCA9IEluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnppcDtcbk9yZGVyZWRTZXRQcm90b3R5cGUuemlwV2l0aCA9IEluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnppcFdpdGg7XG5PcmRlcmVkU2V0UHJvdG90eXBlLnppcEFsbCA9IEluZGV4ZWRDb2xsZWN0aW9uUHJvdG90eXBlLnppcEFsbDtcblxuT3JkZXJlZFNldFByb3RvdHlwZS5fX2VtcHR5ID0gZW1wdHlPcmRlcmVkU2V0O1xuT3JkZXJlZFNldFByb3RvdHlwZS5fX21ha2UgPSBtYWtlT3JkZXJlZFNldDtcblxuZnVuY3Rpb24gbWFrZU9yZGVyZWRTZXQobWFwLCBvd25lcklEKSB7XG4gIHZhciBzZXQgPSBPYmplY3QuY3JlYXRlKE9yZGVyZWRTZXRQcm90b3R5cGUpO1xuICBzZXQuc2l6ZSA9IG1hcCA/IG1hcC5zaXplIDogMDtcbiAgc2V0Ll9tYXAgPSBtYXA7XG4gIHNldC5fX293bmVySUQgPSBvd25lcklEO1xuICByZXR1cm4gc2V0O1xufVxuXG52YXIgRU1QVFlfT1JERVJFRF9TRVQ7XG5mdW5jdGlvbiBlbXB0eU9yZGVyZWRTZXQoKSB7XG4gIHJldHVybiAoXG4gICAgRU1QVFlfT1JERVJFRF9TRVQgfHwgKEVNUFRZX09SREVSRURfU0VUID0gbWFrZU9yZGVyZWRTZXQoZW1wdHlPcmRlcmVkTWFwKCkpKVxuICApO1xufVxuXG5mdW5jdGlvbiB0aHJvd09uSW52YWxpZERlZmF1bHRWYWx1ZXMoZGVmYXVsdFZhbHVlcykge1xuICBpZiAoaXNSZWNvcmQoZGVmYXVsdFZhbHVlcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQ2FuIG5vdCBjYWxsIGBSZWNvcmRgIHdpdGggYW4gaW1tdXRhYmxlIFJlY29yZCBhcyBkZWZhdWx0IHZhbHVlcy4gVXNlIGEgcGxhaW4gamF2YXNjcmlwdCBvYmplY3QgaW5zdGVhZC4nXG4gICAgKTtcbiAgfVxuXG4gIGlmIChpc0ltbXV0YWJsZShkZWZhdWx0VmFsdWVzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdDYW4gbm90IGNhbGwgYFJlY29yZGAgd2l0aCBhbiBpbW11dGFibGUgQ29sbGVjdGlvbiBhcyBkZWZhdWx0IHZhbHVlcy4gVXNlIGEgcGxhaW4gamF2YXNjcmlwdCBvYmplY3QgaW5zdGVhZC4nXG4gICAgKTtcbiAgfVxuXG4gIGlmIChkZWZhdWx0VmFsdWVzID09PSBudWxsIHx8IHR5cGVvZiBkZWZhdWx0VmFsdWVzICE9PSAnb2JqZWN0Jykge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdDYW4gbm90IGNhbGwgYFJlY29yZGAgd2l0aCBhIG5vbi1vYmplY3QgYXMgZGVmYXVsdCB2YWx1ZXMuIFVzZSBhIHBsYWluIGphdmFzY3JpcHQgb2JqZWN0IGluc3RlYWQuJ1xuICAgICk7XG4gIH1cbn1cblxudmFyIFJlY29yZCA9IGZ1bmN0aW9uIFJlY29yZChkZWZhdWx0VmFsdWVzLCBuYW1lKSB7XG4gIHZhciBoYXNJbml0aWFsaXplZDtcblxuICB0aHJvd09uSW52YWxpZERlZmF1bHRWYWx1ZXMoZGVmYXVsdFZhbHVlcyk7XG5cbiAgdmFyIFJlY29yZFR5cGUgPSBmdW5jdGlvbiBSZWNvcmQodmFsdWVzKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIGlmICh2YWx1ZXMgaW5zdGFuY2VvZiBSZWNvcmRUeXBlKSB7XG4gICAgICByZXR1cm4gdmFsdWVzO1xuICAgIH1cbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVjb3JkVHlwZSkpIHtcbiAgICAgIHJldHVybiBuZXcgUmVjb3JkVHlwZSh2YWx1ZXMpO1xuICAgIH1cbiAgICBpZiAoIWhhc0luaXRpYWxpemVkKSB7XG4gICAgICBoYXNJbml0aWFsaXplZCA9IHRydWU7XG4gICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGRlZmF1bHRWYWx1ZXMpO1xuICAgICAgdmFyIGluZGljZXMgPSAoUmVjb3JkVHlwZVByb3RvdHlwZS5faW5kaWNlcyA9IHt9KTtcbiAgICAgIC8vIERlcHJlY2F0ZWQ6IGxlZnQgdG8gYXR0ZW1wdCBub3QgdG8gYnJlYWsgYW55IGV4dGVybmFsIGNvZGUgd2hpY2hcbiAgICAgIC8vIHJlbGllcyBvbiBhIC5fbmFtZSBwcm9wZXJ0eSBleGlzdGluZyBvbiByZWNvcmQgaW5zdGFuY2VzLlxuICAgICAgLy8gVXNlIFJlY29yZC5nZXREZXNjcmlwdGl2ZU5hbWUoKSBpbnN0ZWFkXG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9uYW1lID0gbmFtZTtcbiAgICAgIFJlY29yZFR5cGVQcm90b3R5cGUuX2tleXMgPSBrZXlzO1xuICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5fZGVmYXVsdFZhbHVlcyA9IGRlZmF1bHRWYWx1ZXM7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHByb3BOYW1lID0ga2V5c1tpXTtcbiAgICAgICAgaW5kaWNlc1twcm9wTmFtZV0gPSBpO1xuICAgICAgICBpZiAoUmVjb3JkVHlwZVByb3RvdHlwZVtwcm9wTmFtZV0pIHtcbiAgICAgICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgICAgICAgdHlwZW9mIGNvbnNvbGUgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICBjb25zb2xlLndhcm4gJiZcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihcbiAgICAgICAgICAgICAgJ0Nhbm5vdCBkZWZpbmUgJyArXG4gICAgICAgICAgICAgICAgcmVjb3JkTmFtZSh0aGlzKSArXG4gICAgICAgICAgICAgICAgJyB3aXRoIHByb3BlcnR5IFwiJyArXG4gICAgICAgICAgICAgICAgcHJvcE5hbWUgK1xuICAgICAgICAgICAgICAgICdcIiBzaW5jZSB0aGF0IHByb3BlcnR5IG5hbWUgaXMgcGFydCBvZiB0aGUgUmVjb3JkIEFQSS4nXG4gICAgICAgICAgICApO1xuICAgICAgICAgIC8qIGVzbGludC1lbmFibGUgbm8tY29uc29sZSAqL1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNldFByb3AoUmVjb3JkVHlwZVByb3RvdHlwZSwgcHJvcE5hbWUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX19vd25lcklEID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX3ZhbHVlcyA9IExpc3QoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsKSB7XG4gICAgICBsLnNldFNpemUodGhpcyQxJDEuX2tleXMubGVuZ3RoKTtcbiAgICAgIEtleWVkQ29sbGVjdGlvbih2YWx1ZXMpLmZvckVhY2goZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgbC5zZXQodGhpcyQxJDEuX2luZGljZXNba10sIHYgPT09IHRoaXMkMSQxLl9kZWZhdWx0VmFsdWVzW2tdID8gdW5kZWZpbmVkIDogdik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgUmVjb3JkVHlwZVByb3RvdHlwZSA9IChSZWNvcmRUeXBlLnByb3RvdHlwZSA9XG4gICAgT2JqZWN0LmNyZWF0ZShSZWNvcmRQcm90b3R5cGUpKTtcbiAgUmVjb3JkVHlwZVByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlY29yZFR5cGU7XG5cbiAgaWYgKG5hbWUpIHtcbiAgICBSZWNvcmRUeXBlLmRpc3BsYXlOYW1lID0gbmFtZTtcbiAgfVxuXG4gIHJldHVybiBSZWNvcmRUeXBlO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgdmFyIHN0ciA9IHJlY29yZE5hbWUodGhpcykgKyAnIHsgJztcbiAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xuICB2YXIgaztcbiAgZm9yICh2YXIgaSA9IDAsIGwgPSBrZXlzLmxlbmd0aDsgaSAhPT0gbDsgaSsrKSB7XG4gICAgayA9IGtleXNbaV07XG4gICAgc3RyICs9IChpID8gJywgJyA6ICcnKSArIGsgKyAnOiAnICsgcXVvdGVTdHJpbmcodGhpcy5nZXQoaykpO1xuICB9XG4gIHJldHVybiBzdHIgKyAnIH0nO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKG90aGVyKSB7XG4gIHJldHVybiAoXG4gICAgdGhpcyA9PT0gb3RoZXIgfHwgKG90aGVyICYmIHJlY29yZFNlcSh0aGlzKS5lcXVhbHMocmVjb3JkU2VxKG90aGVyKSkpXG4gICk7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLmhhc2hDb2RlID0gZnVuY3Rpb24gaGFzaENvZGUgKCkge1xuICByZXR1cm4gcmVjb3JkU2VxKHRoaXMpLmhhc2hDb2RlKCk7XG59O1xuXG4vLyBAcHJhZ21hIEFjY2Vzc1xuXG5SZWNvcmQucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoaykge1xuICByZXR1cm4gdGhpcy5faW5kaWNlcy5oYXNPd25Qcm9wZXJ0eShrKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChrLCBub3RTZXRWYWx1ZSkge1xuICBpZiAoIXRoaXMuaGFzKGspKSB7XG4gICAgcmV0dXJuIG5vdFNldFZhbHVlO1xuICB9XG4gIHZhciBpbmRleCA9IHRoaXMuX2luZGljZXNba107XG4gIHZhciB2YWx1ZSA9IHRoaXMuX3ZhbHVlcy5nZXQoaW5kZXgpO1xuICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/IHRoaXMuX2RlZmF1bHRWYWx1ZXNba10gOiB2YWx1ZTtcbn07XG5cbi8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cblJlY29yZC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gc2V0IChrLCB2KSB7XG4gIGlmICh0aGlzLmhhcyhrKSkge1xuICAgIHZhciBuZXdWYWx1ZXMgPSB0aGlzLl92YWx1ZXMuc2V0KFxuICAgICAgdGhpcy5faW5kaWNlc1trXSxcbiAgICAgIHYgPT09IHRoaXMuX2RlZmF1bHRWYWx1ZXNba10gPyB1bmRlZmluZWQgOiB2XG4gICAgKTtcbiAgICBpZiAobmV3VmFsdWVzICE9PSB0aGlzLl92YWx1ZXMgJiYgIXRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdWYWx1ZXMpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGhpcztcbn07XG5cblJlY29yZC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrKSB7XG4gIHJldHVybiB0aGlzLnNldChrKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gIHZhciBuZXdWYWx1ZXMgPSB0aGlzLl92YWx1ZXMuY2xlYXIoKS5zZXRTaXplKHRoaXMuX2tleXMubGVuZ3RoKTtcblxuICByZXR1cm4gdGhpcy5fX293bmVySUQgPyB0aGlzIDogbWFrZVJlY29yZCh0aGlzLCBuZXdWYWx1ZXMpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS53YXNBbHRlcmVkID0gZnVuY3Rpb24gd2FzQWx0ZXJlZCAoKSB7XG4gIHJldHVybiB0aGlzLl92YWx1ZXMud2FzQWx0ZXJlZCgpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS50b1NlcSA9IGZ1bmN0aW9uIHRvU2VxICgpIHtcbiAgcmV0dXJuIHJlY29yZFNlcSh0aGlzKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUudG9KUyA9IGZ1bmN0aW9uIHRvSlMkMSAoKSB7XG4gIHJldHVybiB0b0pTKHRoaXMpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS5lbnRyaWVzID0gZnVuY3Rpb24gZW50cmllcyAoKSB7XG4gIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgcmV0dXJuIHJlY29yZFNlcSh0aGlzKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gIHJldHVybiByZWNvcmRTZXEodGhpcykuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uIF9fZW5zdXJlT3duZXIgKG93bmVySUQpIHtcbiAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdmFyIG5ld1ZhbHVlcyA9IHRoaXMuX3ZhbHVlcy5fX2Vuc3VyZU93bmVyKG93bmVySUQpO1xuICBpZiAoIW93bmVySUQpIHtcbiAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgdGhpcy5fdmFsdWVzID0gbmV3VmFsdWVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHJldHVybiBtYWtlUmVjb3JkKHRoaXMsIG5ld1ZhbHVlcywgb3duZXJJRCk7XG59O1xuXG5SZWNvcmQuaXNSZWNvcmQgPSBpc1JlY29yZDtcblJlY29yZC5nZXREZXNjcmlwdGl2ZU5hbWUgPSByZWNvcmROYW1lO1xudmFyIFJlY29yZFByb3RvdHlwZSA9IFJlY29yZC5wcm90b3R5cGU7XG5SZWNvcmRQcm90b3R5cGVbSVNfUkVDT1JEX1NZTUJPTF0gPSB0cnVlO1xuUmVjb3JkUHJvdG90eXBlW0RFTEVURV0gPSBSZWNvcmRQcm90b3R5cGUucmVtb3ZlO1xuUmVjb3JkUHJvdG90eXBlLmRlbGV0ZUluID0gUmVjb3JkUHJvdG90eXBlLnJlbW92ZUluID0gZGVsZXRlSW47XG5SZWNvcmRQcm90b3R5cGUuZ2V0SW4gPSBnZXRJbjtcblJlY29yZFByb3RvdHlwZS5oYXNJbiA9IENvbGxlY3Rpb25Qcm90b3R5cGUuaGFzSW47XG5SZWNvcmRQcm90b3R5cGUubWVyZ2UgPSBtZXJnZSQxO1xuUmVjb3JkUHJvdG90eXBlLm1lcmdlV2l0aCA9IG1lcmdlV2l0aCQxO1xuUmVjb3JkUHJvdG90eXBlLm1lcmdlSW4gPSBtZXJnZUluO1xuUmVjb3JkUHJvdG90eXBlLm1lcmdlRGVlcCA9IG1lcmdlRGVlcDtcblJlY29yZFByb3RvdHlwZS5tZXJnZURlZXBXaXRoID0gbWVyZ2VEZWVwV2l0aDtcblJlY29yZFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IG1lcmdlRGVlcEluO1xuUmVjb3JkUHJvdG90eXBlLnNldEluID0gc2V0SW47XG5SZWNvcmRQcm90b3R5cGUudXBkYXRlID0gdXBkYXRlO1xuUmVjb3JkUHJvdG90eXBlLnVwZGF0ZUluID0gdXBkYXRlSW47XG5SZWNvcmRQcm90b3R5cGUud2l0aE11dGF0aW9ucyA9IHdpdGhNdXRhdGlvbnM7XG5SZWNvcmRQcm90b3R5cGUuYXNNdXRhYmxlID0gYXNNdXRhYmxlO1xuUmVjb3JkUHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5SZWNvcmRQcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IFJlY29yZFByb3RvdHlwZS5lbnRyaWVzO1xuUmVjb3JkUHJvdG90eXBlLnRvSlNPTiA9IFJlY29yZFByb3RvdHlwZS50b09iamVjdCA9XG4gIENvbGxlY3Rpb25Qcm90b3R5cGUudG9PYmplY3Q7XG5SZWNvcmRQcm90b3R5cGUuaW5zcGVjdCA9IFJlY29yZFByb3RvdHlwZS50b1NvdXJjZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMudG9TdHJpbmcoKTtcbn07XG5cbmZ1bmN0aW9uIG1ha2VSZWNvcmQobGlrZVJlY29yZCwgdmFsdWVzLCBvd25lcklEKSB7XG4gIHZhciByZWNvcmQgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5nZXRQcm90b3R5cGVPZihsaWtlUmVjb3JkKSk7XG4gIHJlY29yZC5fdmFsdWVzID0gdmFsdWVzO1xuICByZWNvcmQuX19vd25lcklEID0gb3duZXJJRDtcbiAgcmV0dXJuIHJlY29yZDtcbn1cblxuZnVuY3Rpb24gcmVjb3JkTmFtZShyZWNvcmQpIHtcbiAgcmV0dXJuIHJlY29yZC5jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCByZWNvcmQuY29uc3RydWN0b3IubmFtZSB8fCAnUmVjb3JkJztcbn1cblxuZnVuY3Rpb24gcmVjb3JkU2VxKHJlY29yZCkge1xuICByZXR1cm4ga2V5ZWRTZXFGcm9tVmFsdWUocmVjb3JkLl9rZXlzLm1hcChmdW5jdGlvbiAoaykgeyByZXR1cm4gW2ssIHJlY29yZC5nZXQoayldOyB9KSk7XG59XG5cbmZ1bmN0aW9uIHNldFByb3AocHJvdG90eXBlLCBuYW1lKSB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvdHlwZSwgbmFtZSwge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldChuYW1lKTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpbnZhcmlhbnQodGhpcy5fX293bmVySUQsICdDYW5ub3Qgc2V0IG9uIGFuIGltbXV0YWJsZSByZWNvcmQuJyk7XG4gICAgICAgIHRoaXMuc2V0KG5hbWUsIHZhbHVlKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgLy8gT2JqZWN0LmRlZmluZVByb3BlcnR5IGZhaWxlZC4gUHJvYmFibHkgSUU4LlxuICB9XG59XG5cbi8qKlxuICogUmV0dXJucyBhIGxhenkgU2VxIG9mIGB2YWx1ZWAgcmVwZWF0ZWQgYHRpbWVzYCB0aW1lcy4gV2hlbiBgdGltZXNgIGlzXG4gKiB1bmRlZmluZWQsIHJldHVybnMgYW4gaW5maW5pdGUgc2VxdWVuY2Ugb2YgYHZhbHVlYC5cbiAqL1xudmFyIFJlcGVhdCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRTZXEpIHtcbiAgZnVuY3Rpb24gUmVwZWF0KHZhbHVlLCB0aW1lcykge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBSZXBlYXQpKSB7XG4gICAgICByZXR1cm4gbmV3IFJlcGVhdCh2YWx1ZSwgdGltZXMpO1xuICAgIH1cbiAgICB0aGlzLl92YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuc2l6ZSA9IHRpbWVzID09PSB1bmRlZmluZWQgPyBJbmZpbml0eSA6IE1hdGgubWF4KDAsIHRpbWVzKTtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICBpZiAoRU1QVFlfUkVQRUFUKSB7XG4gICAgICAgIHJldHVybiBFTVBUWV9SRVBFQVQ7XG4gICAgICB9XG4gICAgICBFTVBUWV9SRVBFQVQgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIGlmICggSW5kZXhlZFNlcSApIFJlcGVhdC5fX3Byb3RvX18gPSBJbmRleGVkU2VxO1xuICBSZXBlYXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZFNlcSAmJiBJbmRleGVkU2VxLnByb3RvdHlwZSApO1xuICBSZXBlYXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmVwZWF0O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuICdSZXBlYXQgW10nO1xuICAgIH1cbiAgICByZXR1cm4gJ1JlcGVhdCBbICcgKyB0aGlzLl92YWx1ZSArICcgJyArIHRoaXMuc2l6ZSArICcgdGltZXMgXSc7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhpbmRleCkgPyB0aGlzLl92YWx1ZSA6IG5vdFNldFZhbHVlO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAoc2VhcmNoVmFsdWUpIHtcbiAgICByZXR1cm4gaXModGhpcy5fdmFsdWUsIHNlYXJjaFZhbHVlKTtcbiAgfTtcblxuICBSZXBlYXQucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKGJlZ2luLCBlbmQpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICByZXR1cm4gd2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKVxuICAgICAgPyB0aGlzXG4gICAgICA6IG5ldyBSZXBlYXQoXG4gICAgICAgICAgdGhpcy5fdmFsdWUsXG4gICAgICAgICAgcmVzb2x2ZUVuZChlbmQsIHNpemUpIC0gcmVzb2x2ZUJlZ2luKGJlZ2luLCBzaXplKVxuICAgICAgICApO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUucmV2ZXJzZSA9IGZ1bmN0aW9uIHJldmVyc2UgKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIGluZGV4T2YgKHNlYXJjaFZhbHVlKSB7XG4gICAgaWYgKGlzKHRoaXMuX3ZhbHVlLCBzZWFyY2hWYWx1ZSkpIHtcbiAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mIChzZWFyY2hWYWx1ZSkge1xuICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG4gICAgICByZXR1cm4gdGhpcy5zaXplO1xuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpICE9PSBzaXplKSB7XG4gICAgICBpZiAoZm4odGhpcy5fdmFsdWUsIHJldmVyc2UgPyBzaXplIC0gKytpIDogaSsrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgdmFyIGkgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkgeyByZXR1cm4gaSA9PT0gc2l6ZVxuICAgICAgICA/IGl0ZXJhdG9yRG9uZSgpXG4gICAgICAgIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKywgdGhpcyQxJDEuX3ZhbHVlKTsgfVxuICAgICk7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKG90aGVyKSB7XG4gICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgUmVwZWF0XG4gICAgICA/IGlzKHRoaXMuX3ZhbHVlLCBvdGhlci5fdmFsdWUpXG4gICAgICA6IGRlZXBFcXVhbChvdGhlcik7XG4gIH07XG5cbiAgcmV0dXJuIFJlcGVhdDtcbn0oSW5kZXhlZFNlcSkpO1xuXG52YXIgRU1QVFlfUkVQRUFUO1xuXG5mdW5jdGlvbiBmcm9tSlModmFsdWUsIGNvbnZlcnRlcikge1xuICByZXR1cm4gZnJvbUpTV2l0aChcbiAgICBbXSxcbiAgICBjb252ZXJ0ZXIgfHwgZGVmYXVsdENvbnZlcnRlcixcbiAgICB2YWx1ZSxcbiAgICAnJyxcbiAgICBjb252ZXJ0ZXIgJiYgY29udmVydGVyLmxlbmd0aCA+IDIgPyBbXSA6IHVuZGVmaW5lZCxcbiAgICB7ICcnOiB2YWx1ZSB9XG4gICk7XG59XG5cbmZ1bmN0aW9uIGZyb21KU1dpdGgoc3RhY2ssIGNvbnZlcnRlciwgdmFsdWUsIGtleSwga2V5UGF0aCwgcGFyZW50VmFsdWUpIHtcbiAgaWYgKFxuICAgIHR5cGVvZiB2YWx1ZSAhPT0gJ3N0cmluZycgJiZcbiAgICAhaXNJbW11dGFibGUodmFsdWUpICYmXG4gICAgKGlzQXJyYXlMaWtlKHZhbHVlKSB8fCBoYXNJdGVyYXRvcih2YWx1ZSkgfHwgaXNQbGFpbk9iamVjdCh2YWx1ZSkpXG4gICkge1xuICAgIGlmICh+c3RhY2suaW5kZXhPZih2YWx1ZSkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBjb252ZXJ0IGNpcmN1bGFyIHN0cnVjdHVyZSB0byBJbW11dGFibGUnKTtcbiAgICB9XG4gICAgc3RhY2sucHVzaCh2YWx1ZSk7XG4gICAga2V5UGF0aCAmJiBrZXkgIT09ICcnICYmIGtleVBhdGgucHVzaChrZXkpO1xuICAgIHZhciBjb252ZXJ0ZWQgPSBjb252ZXJ0ZXIuY2FsbChcbiAgICAgIHBhcmVudFZhbHVlLFxuICAgICAga2V5LFxuICAgICAgU2VxKHZhbHVlKS5tYXAoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZyb21KU1dpdGgoc3RhY2ssIGNvbnZlcnRlciwgdiwgaywga2V5UGF0aCwgdmFsdWUpOyB9XG4gICAgICApLFxuICAgICAga2V5UGF0aCAmJiBrZXlQYXRoLnNsaWNlKClcbiAgICApO1xuICAgIHN0YWNrLnBvcCgpO1xuICAgIGtleVBhdGggJiYga2V5UGF0aC5wb3AoKTtcbiAgICByZXR1cm4gY29udmVydGVkO1xuICB9XG4gIHJldHVybiB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbnZlcnRlcihrLCB2KSB7XG4gIC8vIEVmZmVjdGl2ZWx5IHRoZSBvcHBvc2l0ZSBvZiBcIkNvbGxlY3Rpb24udG9TZXEoKVwiXG4gIHJldHVybiBpc0luZGV4ZWQodikgPyB2LnRvTGlzdCgpIDogaXNLZXllZCh2KSA/IHYudG9NYXAoKSA6IHYudG9TZXQoKTtcbn1cblxudmFyIHZlcnNpb24gPSBcIjQuMC4wXCI7XG5cbnZhciBJbW11dGFibGUgPSB7XG4gIHZlcnNpb246IHZlcnNpb24sXG5cbiAgQ29sbGVjdGlvbjogQ29sbGVjdGlvbixcbiAgLy8gTm90ZTogSXRlcmFibGUgaXMgZGVwcmVjYXRlZFxuICBJdGVyYWJsZTogQ29sbGVjdGlvbixcblxuICBTZXE6IFNlcSxcbiAgTWFwOiBNYXAsXG4gIE9yZGVyZWRNYXA6IE9yZGVyZWRNYXAsXG4gIExpc3Q6IExpc3QsXG4gIFN0YWNrOiBTdGFjayxcbiAgU2V0OiBTZXQsXG4gIE9yZGVyZWRTZXQ6IE9yZGVyZWRTZXQsXG5cbiAgUmVjb3JkOiBSZWNvcmQsXG4gIFJhbmdlOiBSYW5nZSxcbiAgUmVwZWF0OiBSZXBlYXQsXG5cbiAgaXM6IGlzLFxuICBmcm9tSlM6IGZyb21KUyxcbiAgaGFzaDogaGFzaCxcblxuICBpc0ltbXV0YWJsZTogaXNJbW11dGFibGUsXG4gIGlzQ29sbGVjdGlvbjogaXNDb2xsZWN0aW9uLFxuICBpc0tleWVkOiBpc0tleWVkLFxuICBpc0luZGV4ZWQ6IGlzSW5kZXhlZCxcbiAgaXNBc3NvY2lhdGl2ZTogaXNBc3NvY2lhdGl2ZSxcbiAgaXNPcmRlcmVkOiBpc09yZGVyZWQsXG4gIGlzVmFsdWVPYmplY3Q6IGlzVmFsdWVPYmplY3QsXG4gIGlzUGxhaW5PYmplY3Q6IGlzUGxhaW5PYmplY3QsXG4gIGlzU2VxOiBpc1NlcSxcbiAgaXNMaXN0OiBpc0xpc3QsXG4gIGlzTWFwOiBpc01hcCxcbiAgaXNPcmRlcmVkTWFwOiBpc09yZGVyZWRNYXAsXG4gIGlzU3RhY2s6IGlzU3RhY2ssXG4gIGlzU2V0OiBpc1NldCxcbiAgaXNPcmRlcmVkU2V0OiBpc09yZGVyZWRTZXQsXG4gIGlzUmVjb3JkOiBpc1JlY29yZCxcblxuICBnZXQ6IGdldCxcbiAgZ2V0SW46IGdldEluJDEsXG4gIGhhczogaGFzLFxuICBoYXNJbjogaGFzSW4kMSxcbiAgbWVyZ2U6IG1lcmdlLFxuICBtZXJnZURlZXA6IG1lcmdlRGVlcCQxLFxuICBtZXJnZVdpdGg6IG1lcmdlV2l0aCxcbiAgbWVyZ2VEZWVwV2l0aDogbWVyZ2VEZWVwV2l0aCQxLFxuICByZW1vdmU6IHJlbW92ZSxcbiAgcmVtb3ZlSW46IHJlbW92ZUluLFxuICBzZXQ6IHNldCxcbiAgc2V0SW46IHNldEluJDEsXG4gIHVwZGF0ZTogdXBkYXRlJDEsXG4gIHVwZGF0ZUluOiB1cGRhdGVJbiQxLFxufTtcblxuLy8gTm90ZTogSXRlcmFibGUgaXMgZGVwcmVjYXRlZFxudmFyIEl0ZXJhYmxlID0gQ29sbGVjdGlvbjtcblxuZXhwb3J0IGRlZmF1bHQgSW1tdXRhYmxlO1xuZXhwb3J0IHsgQ29sbGVjdGlvbiwgSXRlcmFibGUsIExpc3QsIE1hcCwgT3JkZXJlZE1hcCwgT3JkZXJlZFNldCwgUmFuZ2UsIFJlY29yZCwgUmVwZWF0LCBTZXEsIFNldCwgU3RhY2ssIGZyb21KUywgZ2V0LCBnZXRJbiQxIGFzIGdldEluLCBoYXMsIGhhc0luJDEgYXMgaGFzSW4sIGhhc2gsIGlzLCBpc0Fzc29jaWF0aXZlLCBpc0NvbGxlY3Rpb24sIGlzSW1tdXRhYmxlLCBpc0luZGV4ZWQsIGlzS2V5ZWQsIGlzTGlzdCwgaXNNYXAsIGlzT3JkZXJlZCwgaXNPcmRlcmVkTWFwLCBpc09yZGVyZWRTZXQsIGlzUGxhaW5PYmplY3QsIGlzUmVjb3JkLCBpc1NlcSwgaXNTZXQsIGlzU3RhY2ssIGlzVmFsdWVPYmplY3QsIG1lcmdlLCBtZXJnZURlZXAkMSBhcyBtZXJnZURlZXAsIG1lcmdlRGVlcFdpdGgkMSBhcyBtZXJnZURlZXBXaXRoLCBtZXJnZVdpdGgsIHJlbW92ZSwgcmVtb3ZlSW4sIHNldCwgc2V0SW4kMSBhcyBzZXRJbiwgdXBkYXRlJDEgYXMgdXBkYXRlLCB1cGRhdGVJbiQxIGFzIHVwZGF0ZUluLCB2ZXJzaW9uIH07XG4iLCJleHBvcnQgZnVuY3Rpb24gZXhpc3RzKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q2hpbGROb2RlS2V5KG5vZGUpIHtcbiAgY29uc3Qgbm9kZVR5cGUgPSBub2RlLmdldEluKFsndHlwZSddKTtcbiAgaWYgKG5vZGVUeXBlID09PSAnanN4LW5vZGUnIHx8IG5vZGVUeXBlID09PSAncmVmLW5vZGUnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKG5vZGVUeXBlID09PSAnY29tcG9zZWQtbm9kZScpIHtcbiAgICByZXR1cm4gJ25vZGVzJztcbiAgfVxuXG4gIGlmIChub2RlVHlwZSA9PT0gJ2xvb3AtY29udGFpbmVyJyB8fCBub2RlVHlwZSA9PT0gJ3JvdXRlLW5vZGUnKSB7XG4gICAgcmV0dXJuICdub2RlJztcbiAgfVxuXG4gIHJldHVybiAnY2hpbGRyZW4nO1xufVxuIiwiaW1wb3J0IHsgU2VxLCBTdGFjaywgQ29sbGVjdGlvbiB9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmltcG9ydCB7IGdldENoaWxkTm9kZUtleSB9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyB0eXBlIFdhbGtJdGVyYXRvcjxULCBTdG9wVmFsdWUgPSB1bmtub3duPiA9IChcbi8vICAgYWNjdW11bGF0b3I6IFQgfCB1bmRlZmluZWQsXG4vLyAgIGtleVBhdGg6IFNlcS5JbmRleGVkPHN0cmluZyB8IG51bWJlcj4sXG4vLyAgIHN0b3A6ICh2YWx1ZTogU3RvcFZhbHVlKSA9PiBTdG9wVmFsdWUsXG4vLyApID0+IFQ7XG5cbmZ1bmN0aW9uIHdhbGsobm9kZSwgaXRlcmF0b3IpIHtcbiAgbGV0IHN0YWNrID0gU3RhY2sub2YoU2VxKFtdKSk7XG4gIGxldCByZWR1Y3Rpb247XG4gIGxldCBzdG9wcGVkID0gZmFsc2U7XG4gIGZ1bmN0aW9uIHN0b3Aodikge1xuICAgIHN0b3BwZWQgPSB0cnVlO1xuICAgIHJldHVybiB2O1xuICB9XG5cbiAgd2hpbGUgKCFzdG9wcGVkICYmIHN0YWNrLnNpemUgPiAwKSB7XG4gICAgY29uc3Qga2V5UGF0aCA9IHN0YWNrLmZpcnN0KCk7XG5cbiAgICBzdGFjayA9IHN0YWNrLnNoaWZ0KCk7XG5cbiAgICBpZiAoIWtleVBhdGgpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHJlZHVjdGlvbiA9IGl0ZXJhdG9yKHJlZHVjdGlvbiwga2V5UGF0aCwgc3RvcCk7XG4gICAgY29uc3Qgbm9kZUNoaWxkcmVuS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KG5vZGUuZ2V0SW4oa2V5UGF0aCkpO1xuICAgIGlmICghbm9kZUNoaWxkcmVuS2V5KSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBjb25zdCBjaGlsZE5vZGVzID0gbm9kZS5nZXRJbihrZXlQYXRoLmNvbmNhdChub2RlQ2hpbGRyZW5LZXkpKTtcbiAgICBpZiAoIWNoaWxkTm9kZXMpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChjaGlsZE5vZGVzLmlzRW1wdHkoKSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGROb2Rlcy50b0pTKCkpKSB7XG4gICAgICBjaGlsZE5vZGVzLmtleVNlcSgpLmZvckVhY2goKGkpID0+IHtcbiAgICAgICAgc3RhY2sgPSBzdGFjay51bnNoaWZ0KGtleVBhdGguY29uY2F0KFtub2RlQ2hpbGRyZW5LZXksIGldKSk7XG4gICAgICB9KTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHN0YWNrID0gc3RhY2sudW5zaGlmdChrZXlQYXRoLmNvbmNhdChub2RlQ2hpbGRyZW5LZXkpKTtcbiAgfVxuXG4gIHJldHVybiByZWR1Y3Rpb247XG59XG5cbmV4cG9ydCBkZWZhdWx0IHdhbGs7XG4iLCJpbXBvcnQgd2FsayBmcm9tICcuL3dhbGsnO1xuXG5mdW5jdGlvbiBmaW5kKG5vZGUsIGNvbXBhcmF0b3IpIHtcbiAgcmV0dXJuIHdhbGsobm9kZSwgKF8sIGtleVBhdGgsIHN0b3ApID0+IHtcbiAgICBpZiAoY29tcGFyYXRvcihub2RlLmdldEluKGtleVBhdGgpLCBrZXlQYXRoKSkge1xuICAgICAgcmV0dXJuIHN0b3Aoa2V5UGF0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9KTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmluZDtcbiIsImltcG9ydCBmaW5kIGZyb20gJy4vZmluZCc7XG5cbmZ1bmN0aW9uIGtleVBhdGhCeUlkKG5vZGUsIGlkKSB7XG4gIHJldHVybiBmaW5kKG5vZGUsIChjaGlsZE5vZGUpID0+IGNoaWxkTm9kZS5nZXRJbihbJ2lkJ10pID09PSBpZCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGtleVBhdGhCeUlkO1xuIiwiaW1wb3J0IHsgU2VxIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBrZXlQYXRoQnlJZCBmcm9tICcuL2tleVBhdGhCeUlkJztcblxuZnVuY3Rpb24gYnlBcmJpdHJhcnkobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgaWYgKFNlcS5pc1NlcShpZE9yS2V5UGF0aCkpIHtcbiAgICByZXR1cm4gaWRPcktleVBhdGg7XG4gIH1cblxuICByZXR1cm4ga2V5UGF0aEJ5SWQobm9kZSwgaWRPcktleVBhdGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBieUFyYml0cmFyeTtcbiIsImltcG9ydCB7IExpc3QgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5IH0gZnJvbSAnLi91dGlscyc7XG5cbmZ1bmN0aW9uIF9hcHBlbmRUbyhyb290LCBwYXJlbnRJZE9yS2V5UGF0aCwgbm9kZSkge1xuICBjb25zdCBwYXJlbnRLZXlQYXRoID0gYnlBcmJpdHJhcnkocm9vdCwgcGFyZW50SWRPcktleVBhdGgpO1xuICBpZiAoIXBhcmVudEtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXJlbnROb2RlID0gcm9vdC5nZXRJbihwYXJlbnRLZXlQYXRoKTtcbiAgY29uc3QgY2hpbGROb2RlS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KHBhcmVudE5vZGUpO1xuICBjb25zdCBjaGlsZHJlbktleVBhdGggPSBwYXJlbnRLZXlQYXRoLmNvbmNhdChbY2hpbGROb2RlS2V5XSk7XG4gIGlmIChjaGlsZE5vZGVLZXkgPT09ICdub2RlJykge1xuICAgIHJldHVybiByb290LnNldEluKHJvb3QsIGNoaWxkcmVuS2V5UGF0aCwgbm9kZSk7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbk5vZGVzID0gcm9vdC5nZXRJbihjaGlsZHJlbktleVBhdGgpIHx8IExpc3QoKTtcbiAgcmV0dXJuIHJvb3Quc2V0SW4oY2hpbGRyZW5LZXlQYXRoLCBjaGlsZHJlbk5vZGVzLnB1c2gobm9kZSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBfYXBwZW5kVG87XG4iLCJpbXBvcnQgeyBieUFyYml0cmFyeSB9IGZyb20gJ0BvbmUtZm9yLWFsbC9hcnRlcnktdXRpbHMnO1xuaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXkgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gX2luc2VydENoaWxkQXQocm9vdCwgcGFyZW50SWRPcktleVBhdGgsIGluZGV4LCBub2RlKSB7XG4gIGNvbnN0IF9wYXJlbnRJZE9yS2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KHJvb3QsIHBhcmVudElkT3JLZXlQYXRoKTtcbiAgaWYgKCFfcGFyZW50SWRPcktleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXJlbnROb2RlID0gcm9vdC5nZXRJbihfcGFyZW50SWRPcktleVBhdGgpO1xuICBjb25zdCBjaGlsZE5vZGVLZXkgPSBnZXRDaGlsZE5vZGVLZXkocGFyZW50Tm9kZSk7XG4gIGNvbnN0IGNoaWxkcmVuS2V5UGF0aCA9IF9wYXJlbnRJZE9yS2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleV0pO1xuICBpZiAoY2hpbGROb2RlS2V5ID09PSAnbm9kZScpIHtcbiAgICByZXR1cm4gcm9vdC5zZXRJbihyb290LCBjaGlsZHJlbktleVBhdGgsIG5vZGUpO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW5Ob2RlcyA9IHJvb3QuZ2V0SW4oY2hpbGRyZW5LZXlQYXRoKSB8fCBMaXN0KCk7XG4gIGNvbnN0IGxlZnRTaWRlTm9kZXMgPSBjaGlsZHJlbk5vZGVzLnNsaWNlKDAsIGluZGV4KTtcbiAgY29uc3QgcmlnaHRTaWRlTm9kZXMgPSBjaGlsZHJlbk5vZGVzLnNsaWNlKGluZGV4KTtcblxuICBjb25zdCBhbGxDaGlsZHJlbk5vZGVzID0gbGVmdFNpZGVOb2Rlcy5jb25jYXQoW25vZGVdLCByaWdodFNpZGVOb2Rlcyk7XG4gIHJldHVybiByb290LnNldEluKGNoaWxkcmVuS2V5UGF0aCwgYWxsQ2hpbGRyZW5Ob2Rlcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IF9pbnNlcnRDaGlsZEF0O1xuIiwiaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuXG5mdW5jdGlvbiBwYXJlbnQobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKTtcblxuICBpZiAoIWtleVBhdGggfHwgIWtleVBhdGguc2l6ZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmICh0eXBlb2Yga2V5UGF0aC5sYXN0KCkgPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIGtleVBhdGguc2xpY2UoMCwgLTIpO1xuICB9XG5cbiAgcmV0dXJuIGtleVBhdGguc2xpY2UoMCwgLTEpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJlbnQ7XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5pbXBvcnQgcGFyZW50IGZyb20gJy4vcGFyZW50JztcbmltcG9ydCBfaW5zZXJ0Q2hpbGRBdCBmcm9tICcuL19pbnNlcnRDaGlsZEF0JztcblxuZnVuY3Rpb24gX2luc2VydExlZnRTaWJsaW5nVG8ocm9vdCwgaWRPcktleVBhdGgsIG5vZGUpIHtcbiAgY29uc3QgcmVmZXJlbmNlS2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KHJvb3QsIGlkT3JLZXlQYXRoKTtcbiAgaWYgKCFyZWZlcmVuY2VLZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVmZXJlbmNlTm9kZUluZGV4ID0gcmVmZXJlbmNlS2V5UGF0aC5sYXN0KCk7XG4gIGlmICh0eXBlb2YgcmVmZXJlbmNlTm9kZUluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudEtleVBhdGggPSBwYXJlbnQocm9vdCwgcmVmZXJlbmNlS2V5UGF0aCk7XG4gIHJldHVybiBfaW5zZXJ0Q2hpbGRBdChyb290LCBwYXJlbnRLZXlQYXRoLCByZWZlcmVuY2VOb2RlSW5kZXgsIG5vZGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBfaW5zZXJ0TGVmdFNpYmxpbmdUbztcbiIsImltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCBwYXJlbnQgZnJvbSAnLi9wYXJlbnQnO1xuaW1wb3J0IF9pbnNlcnRDaGlsZEF0IGZyb20gJy4vX2luc2VydENoaWxkQXQnO1xuXG5mdW5jdGlvbiBfaW5zZXJ0UmlnaHRTaWJsaW5nVG8ocm9vdCwgaWRPcktleVBhdGgsIG5vZGUpIHtcbiAgY29uc3QgcmVmZXJlbmNlS2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KHJvb3QsIGlkT3JLZXlQYXRoKTtcbiAgaWYgKCFyZWZlcmVuY2VLZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVmZXJlbmNlTm9kZUluZGV4ID0gcmVmZXJlbmNlS2V5UGF0aC5sYXN0KCk7XG4gIGlmICh0eXBlb2YgcmVmZXJlbmNlTm9kZUluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudEtleVBhdGggPSBwYXJlbnQocm9vdCwgcmVmZXJlbmNlS2V5UGF0aCk7XG4gIHJldHVybiBfaW5zZXJ0Q2hpbGRBdChyb290LCBwYXJlbnRLZXlQYXRoLCByZWZlcmVuY2VOb2RlSW5kZXggKyAxLCBub2RlKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgX2luc2VydFJpZ2h0U2libGluZ1RvO1xuIiwiaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5pbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXkgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gX3ByZXBlbmRUbyhyb290LCBwYXJlbnRJZE9yS2V5UGF0aCwgbm9kZSkge1xuICBjb25zdCBwYXJlbnRLZXlQYXRoID0gYnlBcmJpdHJhcnkocm9vdCwgcGFyZW50SWRPcktleVBhdGgpO1xuICBpZiAoIXBhcmVudEtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXJlbnROb2RlID0gcm9vdC5nZXRJbihwYXJlbnRLZXlQYXRoKTtcbiAgY29uc3QgY2hpbGROb2RlS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KHBhcmVudE5vZGUpO1xuICBjb25zdCBjaGlsZHJlbktleVBhdGggPSBwYXJlbnRLZXlQYXRoLmNvbmNhdChbY2hpbGROb2RlS2V5XSk7XG4gIGlmIChjaGlsZE5vZGVLZXkgPT09ICdub2RlJykge1xuICAgIHJldHVybiByb290LnNldEluKHJvb3QsIGNoaWxkcmVuS2V5UGF0aCwgbm9kZSk7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbk5vZGVzID0gcm9vdC5nZXRJbihjaGlsZHJlbktleVBhdGgpIHx8IExpc3QoKTtcbiAgcmV0dXJuIHJvb3Quc2V0SW4oY2hpbGRyZW5LZXlQYXRoLCBbbm9kZV0uY29uY2F0KGNoaWxkcmVuTm9kZXMpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgX3ByZXBlbmRUbztcbiIsImltcG9ydCB7IExpc3QgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHBhcmVudCBmcm9tICcuL3BhcmVudCc7XG5pbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG4vKipcbiAqIEBpZCBUcmVlVXRpbHMtYW5jZXN0b3JzXG4gKiBAbG9va3VwIGFuY2VzdG9yc1xuICpcbiAqICMjIyMgKm1ldGhvZCogYW5jZXN0b3JzKClcbiAqXG4gKiAjIyMjIyMgU2lnbmF0dXJlOlxuICogYGBganNcbiAqIGFuY2VzdG9ycyhcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj4sXG4gKiApOiBJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIEFuID5JbW11dGFibGUuTGlzdCBvZiBhbGwga2V5IHBhdGhzIHRoYXQgcG9pbnQgYXQgZGlyZWN0IGFuY2VzdG9ycyBvZiB0aGUgbm9kZSBhdCBgaWRPcktleVBhdGhgLlxuICovXG5mdW5jdGlvbiBhbmNlc3RvcnMobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgbGV0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG4gIGlmICgha2V5UGF0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBsaXN0ID0gTGlzdCgpO1xuXG4gIHdoaWxlIChrZXlQYXRoLnNpemUpIHtcbiAgICBrZXlQYXRoID0gcGFyZW50KG5vZGUsIGtleVBhdGgpO1xuICAgIGxpc3QgPSBsaXN0LnB1c2goa2V5UGF0aCk7XG4gIH1cblxuICByZXR1cm4gbGlzdDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYW5jZXN0b3JzO1xuIiwiaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5IH0gZnJvbSAnLi91dGlscyc7XG5cbmZ1bmN0aW9uIGNoaWxkQXQobm9kZSwgaWRPcktleVBhdGgsIGluZGV4KSB7XG4gIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG5cbiAgaWYgKCFub2RlLmdldEluKGtleVBhdGgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY2hpbGROb2RlS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KG5vZGUuZ2V0SW4oa2V5UGF0aCkpO1xuICBpZiAoIWNoaWxkTm9kZUtleSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IF9rZXlQYXRoID0ga2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleSwgaW5kZXhdKTtcbiAgaWYgKG5vZGUuaGFzSW4oX2tleVBhdGgpKSB7XG4gICAgcmV0dXJuIF9rZXlQYXRoO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNoaWxkQXQ7XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5cbi8qKlxuICogQGlkIFRyZWVVdGlscy1kZXB0aFxuICogQGxvb2t1cCBkZXB0aFxuICpcbiAqICMjIyMgKm1ldGhvZCogZGVwdGgoKVxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogZGVwdGgoXG4gKiAgICBzdGF0ZTogSW1tdXRhYmxlLkl0ZXJhYmxlLFxuICogICAgaWRPcktleVBhdGg6IHN0cmluZ3xJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+LFxuICogKTogbnVtYmVyXG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIEEgbnVtZXJpYyByZXByZXNlbnRhdGlvbiBvZiB0aGUgZGVwdGggb2YgdGhlIG5vZGUgYXQgYGlkT3JLZXlQYXRoYFxuICovXG5mdW5jdGlvbiBkZXB0aChub2RlLCBpZE9yS2V5UGF0aCkge1xuICBjb25zdCBrZXlQYXRoID0gYnlBcmJpdHJhcnkobm9kZSwgaWRPcktleVBhdGgpO1xuXG4gIGlmICgha2V5UGF0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIGNhbGwgZmlsdGVyIHdpbGwgbm90IHByZXNlcnZlIHRoZSBzZXEgc2l6ZVxuICAvLyBodHRwczovL2ltbXV0YWJsZS1qcy5jb20vZG9jcy92My44LjIvU2VxLyNzaXplXG4gIHJldHVybiBNYXRoLmZsb29yKGtleVBhdGguZmlsdGVyKCh2KSA9PiB0eXBlb2YgdiAhPT0gJ251bWJlcicpLnRvSlMoKS5sZW5ndGgpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZXB0aDtcbiIsImltcG9ydCB7IExpc3QgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHdhbGsgZnJvbSAnLi93YWxrJztcblxuZnVuY3Rpb24gZmlsdGVyKG5vZGUsIGNvbXBhcmF0b3IpIHtcbiAgbGV0IHJlcyA9IExpc3QoKTtcbiAgd2Fsayhub2RlLCAoXywga2V5UGF0aCkgPT4ge1xuICAgIGlmIChjb21wYXJhdG9yKG5vZGUuZ2V0SW4oa2V5UGF0aCksIGtleVBhdGgpKSB7XG4gICAgICByZXMgPSByZXMucHVzaChrZXlQYXRoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm47XG4gIH0pO1xuXG4gIHJldHVybiByZXM7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbHRlcjtcbiIsImltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCB7IGdldENoaWxkTm9kZUtleSB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEBpZCBUcmVlVXRpbHMtZmlyc3RDaGlsZFxuICogQGxvb2t1cCBmaXJzdENoaWxkXG4gKlxuICogIyMjIyAqbWV0aG9kKiBmaXJzdENoaWxkKClcbiAqXG4gKiAjIyMjIyMgU2lnbmF0dXJlOlxuICogYGBganNcbiAqIGZpcnN0Q2hpbGQoXG4gKiAgICBzdGF0ZTogSW1tdXRhYmxlLkl0ZXJhYmxlLFxuICogICAgaWRPcktleVBhdGg6IHN0cmluZ3xJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiApOiBJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIFJldHVybnMgdGhlIGZpcnN0IGNoaWxkIG5vZGUgb2YgdGhlIG5vZGUgYXQgYGlkT3JLZXlQYXRoYFxuICovXG5mdW5jdGlvbiBmaXJzdENoaWxkKG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG5cbiAgY29uc3Qgc3ViTm9kZSA9IG5vZGUuZ2V0SW4oa2V5UGF0aCk7XG4gIGlmICghc3ViTm9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkTm9kZUtleSA9IGdldENoaWxkTm9kZUtleShzdWJOb2RlKTtcbiAgaWYgKCFjaGlsZE5vZGVLZXkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hpbGROb2RlS2V5ID09PSAnbm9kZScgJiYgbm9kZS5oYXNJbihrZXlQYXRoLmNvbmNhdChbJ25vZGUnXSkpKSB7XG4gICAgcmV0dXJuIGtleVBhdGguY29uY2F0KFsnbm9kZSddKTtcbiAgfVxuXG4gIGlmIChub2RlLmhhc0luKGtleVBhdGguY29uY2F0KFtjaGlsZE5vZGVLZXksIDBdKSkpIHtcbiAgICByZXR1cm4ga2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleSwgMF0pO1xuICB9XG5cbiAgcmV0dXJuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmaXJzdENoaWxkO1xuIiwiaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5IH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0Rmlyc3RMZXZlbENvbmNyZXRlQ2hpbGRyZW4ocGFyZW50KSB7XG4gIGNvbnN0IGNoaWxkcmVuS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KHBhcmVudCk7XG4gIGlmICghY2hpbGRyZW5LZXkpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBpZiAoY2hpbGRyZW5LZXkgPT09ICdub2RlJykge1xuICAgIGNvbnN0IGNoaWxkTm9kZVR5cGUgPSBwYXJlbnQuZ2V0SW4oW2NoaWxkcmVuS2V5LCAndHlwZSddKTtcbiAgICBpZiAoY2hpbGROb2RlVHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcgfHwgY2hpbGROb2RlVHlwZSA9PT0gJ3JlYWN0LWNvbXBvbmVudCcpIHtcbiAgICAgIHJldHVybiBbcGFyZW50LmdldEluKFtjaGlsZHJlbktleV0pXVxuICAgIH1cblxuICAgIHJldHVybiBnZXRGaXJzdExldmVsQ29uY3JldGVDaGlsZHJlbihwYXJlbnQuZ2V0SW4oW2NoaWxkcmVuS2V5XSkpO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW4gPSBwYXJlbnQuZ2V0SW4oW2NoaWxkcmVuS2V5XSk7XG4gIGNvbnN0IGNvbmNyZXRlTm9kZSA9IFtdO1xuICAoY2hpbGRyZW4gfHxbXSkuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICBjb25zdCBjaGlsZE5vZGVUeXBlID0gY2hpbGQuZ2V0SW4oWyd0eXBlJ10pXG4gICAgaWYgKGNoaWxkTm9kZVR5cGUgPT09ICdodG1sLWVsZW1lbnQnIHx8IGNoaWxkTm9kZVR5cGUgPT09ICdyZWFjdC1jb21wb25lbnQnKSB7XG4gICAgICBjb25jcmV0ZU5vZGUucHVzaChjaGlsZClcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25jcmV0ZU5vZGUucHVzaCguLi5nZXRGaXJzdExldmVsQ29uY3JldGVDaGlsZHJlbihjaGlsZCkpO1xuICB9KTtcblxuICByZXR1cm4gY29uY3JldGVOb2RlO1xufVxuIiwiaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5LCBleGlzdHMgfSBmcm9tICcuL3V0aWxzJztcbi8qKlxuICogQGlkIFRyZWVVdGlscy1oYXNDaGlsZE5vZGVzXG4gKiBAbG9va3VwIGhhc0NoaWxkTm9kZXNcbiAqXG4gKiAjIyMjICptZXRob2QqIGhhc0NoaWxkTm9kZXMoKVxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogaGFzQ2hpbGROb2RlcyhcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj4sXG4gKiApOiBib29sZWFuXG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIFJldHVybnMgd2hldGhlciB0aGUgbm9kZSBhdCBgaWRPcktleVBhdGhgIGhhcyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gaGFzQ2hpbGROb2Rlcyhub2RlLCBpZE9yS2V5UGF0aCkge1xuICBjb25zdCBrZXlQYXRoID0gYnlBcmJpdHJhcnkobm9kZSwgaWRPcktleVBhdGgpO1xuXG4gIGlmICghbm9kZS5oYXNJbihrZXlQYXRoKSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KG5vZGUuZ2V0SW4oa2V5UGF0aCkpO1xuICBpZiAoIWNoaWxkS2V5KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW5Ob2RlcyA9IG5vZGUuZ2V0SW4oa2V5UGF0aC5jb25jYXQoW2NoaWxkS2V5XSkpO1xuXG4gIHJldHVybiBleGlzdHMoY2hpbGRyZW5Ob2RlcykgJiYgY2hpbGRyZW5Ob2Rlcy5zaXplID4gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGFzQ2hpbGROb2RlcztcbiIsIi8qKlxuICpcbiAqIEBwYXJhbSB7SW1tdXRhYmxlTm9kZX0gbm9kZVxuICogQHBhcmFtIHtTZXEuSW5kZXhlZDxzdHJpbmc+fSBrZXlQYXRoXG4gKiBAcmV0dXJucyBub2RlIGlkIG9yIHVuZGVmaW5lZFxuICovXG5mdW5jdGlvbiBpZChub2RlLCBrZXlQYXRoKSB7XG4gIGlmICghbm9kZS5nZXRJbihrZXlQYXRoKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBub2RlLmdldEluKGtleVBhdGguY29uY2F0KFsnaWQnXSkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpZDtcbiIsImltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCB7IGdldENoaWxkTm9kZUtleSB9IGZyb20gJy4vdXRpbHMnO1xuXG4vKipcbiAqIEBpZCBUcmVlVXRpbHMtbGFzdENoaWxkXG4gKiBAbG9va3VwIGxhc3RDaGlsZFxuICpcbiAqICMjIyMgKm1ldGhvZCogbGFzdENoaWxkKClcbiAqXG4gKiAjIyMjIyMgU2lnbmF0dXJlOlxuICogYGBganNcbiAqIGxhc3RDaGlsZChcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqICk6IEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqIGBgYFxuICpcbiAqICMjIyMjIyBSZXR1cm5zOlxuICogUmV0dXJucyB0aGUgbGFzdCBjaGlsZCBub2RlIG9mIHRoZSBub2RlIGF0IGBpZE9yS2V5UGF0aGBcbiAqL1xuZnVuY3Rpb24gbGFzdENoaWxkKG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG5cbiAgY29uc3QgY2hpbGROb2RlID0gbm9kZS5nZXRJbihrZXlQYXRoKTtcbiAgaWYgKCFjaGlsZE5vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjaGlsZE5vZGVLZXkgPSBnZXRDaGlsZE5vZGVLZXkoY2hpbGROb2RlKTtcbiAgaWYgKCFjaGlsZE5vZGVLZXkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hpbGROb2RlS2V5ID09PSAnbm9kZScgJiYgbm9kZS5oYXNJbihrZXlQYXRoLmNvbmNhdChbbm9kZV0pKSkge1xuICAgIHJldHVybiBub2RlLmdldEluKGtleVBhdGguY29uY2F0KFtub2RlXSkpO1xuICB9XG5cbiAgdmFyIGl0ZW0gPSBub2RlLmdldEluKGtleVBhdGguY29uY2F0KFtjaGlsZE5vZGVLZXldKSk7XG4gIGlmIChpdGVtICYmIGl0ZW0uc2l6ZSA+IDApIHtcbiAgICByZXR1cm4ga2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleV0pLmNvbmNhdChbaXRlbS5zaXplIC0gMV0pO1xuICB9XG4gIHJldHVybjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGFzdENoaWxkO1xuIiwiaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuLyoqXG4gKiBAaWQgVHJlZVV0aWxzLXByZXZpb3VzU2libGluZ1xuICogQGxvb2t1cCBwcmV2aW91c1NpYmxpbmdcbiAqXG4gKiAjIyMjICptZXRob2QqIHByZXZpb3VzU2libGluZygpXG4gKlxuICogIyMjIyMjIFNpZ25hdHVyZTpcbiAqIGBgYGpzXG4gKiBwcmV2aW91c1NpYmxpbmcoXG4gKiAgICBzdGF0ZTogSW1tdXRhYmxlLkl0ZXJhYmxlLFxuICogICAgaWRPcktleVBhdGg6IHN0cmluZ3xJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiApOiBJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIFJldHVybnMgdGhlIHByZXZpb3VzIHNpYmxpbmcgbm9kZSBvZiB0aGUgbm9kZSBhdCBgaWRPcktleVBhdGhgXG4gKi9cbmZ1bmN0aW9uIHByZXZpb3VzU2libGluZyhzdGF0ZSwgaWRPcktleVBhdGgpIHtcbiAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KHN0YXRlLCBpZE9yS2V5UGF0aCk7XG4gIGNvbnN0IGluZGV4ID0gTnVtYmVyKGtleVBhdGgubGFzdCgpKTtcbiAgaWYgKGlzTmFOKGluZGV4KSB8fCBpbmRleCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBrZXlQYXRoLnNraXBMYXN0KDEpLmNvbmNhdChbaW5kZXggLSAxXSk7XG59XG5leHBvcnQgZGVmYXVsdCBwcmV2aW91c1NpYmxpbmc7XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5pbXBvcnQgcHJldmlvdXNTaWJsaW5nIGZyb20gJy4vcHJldmlvdXNTaWJsaW5nJztcbmltcG9ydCBoYXNDaGlsZE5vZGVzIGZyb20gJy4vaGFzQ2hpbGROb2Rlcyc7XG5pbXBvcnQgbGFzdENoaWxkIGZyb20gJy4vbGFzdENoaWxkJztcbmltcG9ydCBwYXJlbnQgZnJvbSAnLi9wYXJlbnQnO1xuXG4vKipcbiAqIEBpZCBUcmVlVXRpbHMtbGVmdFxuICogQGxvb2t1cCBsZWZ0XG4gKlxuICogIyMjIyAqbWV0aG9kKiBsZWZ0KClcbiAqXG4gKiBSZXR1cm5zIHRoZSBrZXkgcGF0aCB0byB0aGUgbmV4dCBub2RlIHRvIHRoZSBsZWZ0LiBUaGUgbmV4dCBsZWZ0IG5vZGUgaXMgZWl0aGVyOlxuICogKiBUaGUgbGFzdCBkZXNjZW5kYW50IG9mIHRoZSBwcmV2aW91cyBzaWJsaW5nIG5vZGUuXG4gKiAqIFRoZSBwcmV2aW91cyBzaWJsaW5nIG5vZGUuXG4gKiAqIFRoZSBwYXJlbnQgbm9kZS5cbiAqICogVGhlIG5vbmUgdmFsdWVcbiAqXG4gKiBgYGBqc1xuICogdmFyIG5vZGVQYXRoID0gdHJlZVV0aWxzLmxhc3REZXNjZW5kYW50KHN0YXRlLCAncm9vdCcpO1xuICogd2hpbGUgKG5vZGVQYXRoKSB7XG4gKiAgICBjb25zb2xlLmxvZyhub2RlUGF0aCk7XG4gKiAgICBub2RlUGF0aCA9IHRyZWVVdGlscy5sZWZ0KHN0YXRlLCBub2RlUGF0aCk7XG4gKiB9XG4gKiAvLyAnbm9kZS02J1xuICogLy8gJ25vZGUtNSdcbiAqIC8vICdub2RlLTQnXG4gKiAvLyAnbm9kZS0zJ1xuICogLy8gJ25vZGUtMidcbiAqIC8vICdub2RlLTEnXG4gKiAvLyAncm9vdCdcbiAqIGBgYFxuICpcbiAqXG4gKiAjIyMjIyMgU2lnbmF0dXJlOlxuICogYGBganNcbiAqIGxlZnQoXG4gKiAgICBzdGF0ZTogSW1tdXRhYmxlLkl0ZXJhYmxlLFxuICogICAgaWRPcktleVBhdGg6IHN0cmluZ3xJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+LFxuICogKTogSW1tdXRhYmxlLlNlcTxzdHJpbmd8bnVtYmVyPlxuICogYGBgXG4gKlxuICogIyMjIyMjIFJldHVybnM6XG4gKiBSZXR1cm5zIHRoZSBrZXkgcGF0aCB0byB0aGUgbm9kZSB0byB0aGUgcmlnaHQgb2YgdGhlIG9uZSBhdCBgaWRPcktleVBhdGhgLlxuICovXG5mdW5jdGlvbiBsZWZ0KG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG4gIGxldCBsYXN0Q2hpbGRQYXRoID0gcHJldmlvdXNTaWJsaW5nKG5vZGUsIGtleVBhdGgpO1xuXG4gIHdoaWxlIChsYXN0Q2hpbGRQYXRoKSB7XG4gICAgaWYgKCFoYXNDaGlsZE5vZGVzKG5vZGUsIGxhc3RDaGlsZFBhdGgpKSB7XG4gICAgICByZXR1cm4gbGFzdENoaWxkUGF0aDtcbiAgICB9XG4gICAgbGFzdENoaWxkUGF0aCA9IGxhc3RDaGlsZChub2RlLCBsYXN0Q2hpbGRQYXRoKTtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudFBhdGggPSBwYXJlbnQobm9kZSwga2V5UGF0aCk7XG5cbiAgaWYgKHBhcmVudFBhdGggJiYgcGFyZW50UGF0aC5zaXplKSB7XG4gICAgcmV0dXJuIHBhcmVudFBhdGg7XG4gIH1cblxuICByZXR1cm47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGxlZnQ7XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5cbi8qKlxuICogQGlkIFRyZWVVdGlscy1uZXh0U2libGluZ1xuICogQGxvb2t1cCBuZXh0U2libGluZ1xuICpcbiAqICMjIyMgKm1ldGhvZCogbmV4dFNpYmxpbmcoKVxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogbmV4dFNpYmxpbmcoXG4gKiAgICBzdGF0ZTogSW1tdXRhYmxlLkl0ZXJhYmxlLFxuICogICAgaWRPcktleVBhdGg6IHN0cmluZ3xJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiApOiBJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIFJldHVybnMgdGhlIG5leHQgc2libGluZyBub2RlIG9mIHRoZSBub2RlIGF0IGBpZE9yS2V5UGF0aGBcbiAqL1xuZnVuY3Rpb24gbmV4dFNpYmxpbmcobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKTtcbiAgY29uc3QgaW5kZXggPSBOdW1iZXIoa2V5UGF0aC5sYXN0KCkpO1xuICBpZiAoaXNOYU4oaW5kZXgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgbmV4dFNpYmxpbmdQYXRoID0ga2V5UGF0aC5za2lwTGFzdCgxKS5jb25jYXQoaW5kZXggKyAxKTtcbiAgaWYgKG5vZGUuaGFzSW4obmV4dFNpYmxpbmdQYXRoKSkge1xuICAgIHJldHVybiBuZXh0U2libGluZ1BhdGg7XG4gIH1cbiAgcmV0dXJuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBuZXh0U2libGluZztcbiIsImltcG9ydCB7IGdldENoaWxkTm9kZUtleSwgZXhpc3RzIH0gZnJvbSAnLi91dGlscyc7XG4vKipcbiAqIEBpZCBUcmVlVXRpbHMtaGFzQ2hpbGROb2Rlc1xuICogQGxvb2t1cCBoYXNDaGlsZE5vZGVzXG4gKlxuICogIyMjIyAqbWV0aG9kKiBoYXNDaGlsZE5vZGVzKClcbiAqXG4gKiAjIyMjIyMgU2lnbmF0dXJlOlxuICogYGBganNcbiAqIGhhc0NoaWxkTm9kZXMoXG4gKiAgICBzdGF0ZTogSW1tdXRhYmxlLkl0ZXJhYmxlLFxuICogICAgaWRPcktleVBhdGg6IHN0cmluZ3xJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+LFxuICogKTogYm9vbGVhblxuICogYGBgXG4gKlxuICogIyMjIyMjIFJldHVybnM6XG4gKiBSZXR1cm5zIHdoZXRoZXIgdGhlIG5vZGUgYXQgYGlkT3JLZXlQYXRoYCBoYXMgY2hpbGRyZW4uXG4gKi9cbmZ1bmN0aW9uIG5vZGVIYXNDaGlsZE5vZGVzKG5vZGUpIHtcbiAgY29uc3QgY2hpbGRLZXkgPSBnZXRDaGlsZE5vZGVLZXkobm9kZSk7XG4gIGlmICghY2hpbGRLZXkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbk5vZGVzID0gbm9kZS5nZXRJbihbY2hpbGRLZXldKTtcblxuICByZXR1cm4gZXhpc3RzKGNoaWxkcmVuTm9kZXMpICYmIGNoaWxkcmVuTm9kZXMuc2l6ZSA+IDA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVIYXNDaGlsZE5vZGVzO1xuIiwiaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgd2FsayBmcm9tICcuL3dhbGsnO1xuXG5mdW5jdGlvbiBub2Rlcyhub2RlKSB7XG4gIGNvbnN0IG5vZGVLZXlQYXRocyA9IHdhbGsobm9kZSwgKGFjYywga2V5UGF0aCkgPT4ge1xuICAgIHJldHVybiBMaXN0LmlzTGlzdChhY2MpID8gYWNjLnB1c2goa2V5UGF0aCkgOiBMaXN0Lm9mKGtleVBhdGgpO1xuICB9KTtcblxuICByZXR1cm4gbm9kZUtleVBhdGhzID8gbm9kZUtleVBhdGhzIDogTGlzdC5vZigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBub2RlcztcbiIsImltcG9ydCB7IFNlcSB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5pbXBvcnQgcGFyZW50IGZyb20gJy4vcGFyZW50JztcblxuZnVuY3Rpb24gcGFyZW50SWRzU2VxKG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGxldCBrZXlQYXRoID0gYnlBcmJpdHJhcnkobm9kZSwgaWRPcktleVBhdGgpO1xuICBpZiAoIWtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBsZXQgaWRQYXRoID0gU2VxLkluZGV4ZWQoKTtcbiAgd2hpbGUgKGtleVBhdGguc2l6ZSkge1xuICAgIGtleVBhdGggPSBwYXJlbnQobm9kZSwga2V5UGF0aCk7XG4gICAgaWRQYXRoID0gaWRQYXRoLmNvbmNhdChbbm9kZS5nZXRJbihrZXlQYXRoLmNvbmNhdChbJ2lkJ10pKV0pO1xuICB9XG5cbiAgcmV0dXJuIGlkUGF0aC5yZXZlcnNlKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcmVudElkc1NlcTtcbiIsImltcG9ydCBmaXJzdENoaWxkIGZyb20gJy4vZmlyc3RDaGlsZCc7XG5pbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5pbXBvcnQgbmV4dFNpYmxpbmcgZnJvbSAnLi9uZXh0U2libGluZyc7XG5pbXBvcnQgcGFyZW50IGZyb20gJy4vcGFyZW50JztcblxuLyoqXG4gKiBAaWQgVHJlZVV0aWxzLXJpZ2h0XG4gKiBAbG9va3VwIHJpZ2h0XG4gKlxuICogIyMjIyAqbWV0aG9kKiByaWdodCgpXG4gKlxuICogUmV0dXJucyB0aGUga2V5IHBhdGggdG8gdGhlIG5leHQgbm9kZSB0byB0aGUgcmlnaHQuIFRoZSBuZXh0IHJpZ2h0IG5vZGUgaXMgZWl0aGVyOlxuICogKiBUaGUgZmlyc3QgY2hpbGQgbm9kZS5cbiAqICogVGhlIG5leHQgc2libGluZy5cbiAqICogVGhlIG5leHQgc2libGluZyBvZiB0aGUgZmlyc3QgYW5jZXN0b3IgdGhhdCBpbiBmYWN0IGhhcyBhIG5leHQgc2libGluZy5cbiAqICogVGhlIG5vbmUgdmFsdWVcbiAqXG4gKiBgYGBqc1xuICogdmFyIG5vZGVQYXRoID0gdHJlZVV0aWxzLmJ5SWQoc3RhdGUsICdyb290Jyk7XG4gKiB3aGlsZSAobm9kZVBhdGgpIHtcbiAqICAgIGNvbnNvbGUubG9nKG5vZGVQYXRoKTtcbiAqICAgIG5vZGVQYXRoID0gdHJlZVV0aWxzLnJpZ2h0KHN0YXRlLCBub2RlUGF0aCk7XG4gKiB9XG4gKiAvLyAncm9vdCdcbiAqIC8vICdub2RlLTEnXG4gKiAvLyAnbm9kZS0yJ1xuICogLy8gJ25vZGUtMydcbiAqIC8vICdub2RlLTQnXG4gKiAvLyAnbm9kZS01J1xuICogLy8gJ25vZGUtNidcbiAqIGBgYFxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogcmlnaHQoXG4gKiAgICBzdGF0ZTogSW1tdXRhYmxlLkl0ZXJhYmxlLFxuICogICAgaWRPcktleVBhdGg6IHN0cmluZ3xJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+LFxuICogKTogSW1tdXRhYmxlLlNlcTxzdHJpbmd8bnVtYmVyPlxuICogYGBgXG4gKlxuICogIyMjIyMjIFJldHVybnM6XG4gKiBSZXR1cm5zIHRoZSBrZXkgcGF0aCB0byB0aGUgbm9kZSB0byB0aGUgcmlnaHQgb2YgdGhlIG9uZSBhdCBgaWRPcktleVBhdGhgLlxuICovXG5mdW5jdGlvbiByaWdodChub2RlLCBpZE9yS2V5UGF0aCkge1xuICBjb25zdCBrZXlQYXRoID0gYnlBcmJpdHJhcnkobm9kZSwgaWRPcktleVBhdGgpO1xuICBjb25zdCBmaXJzdENoaWxkUGF0aCA9IGZpcnN0Q2hpbGQobm9kZSwga2V5UGF0aCk7XG5cbiAgaWYgKGZpcnN0Q2hpbGRQYXRoKSB7XG4gICAgcmV0dXJuIGZpcnN0Q2hpbGRQYXRoO1xuICB9XG5cbiAgY29uc3QgbmV4dFNpYmxpbmdQYXRoID0gbmV4dFNpYmxpbmcobm9kZSwga2V5UGF0aCk7XG4gIGlmIChuZXh0U2libGluZ1BhdGgpIHtcbiAgICByZXR1cm4gbmV4dFNpYmxpbmdQYXRoO1xuICB9XG5cbiAgbGV0IHBhcmVudFBhdGggPSBwYXJlbnQobm9kZSwga2V5UGF0aCk7XG4gIGxldCBuZXh0U2libGluZ09mUGFyZW50O1xuXG4gIHdoaWxlIChwYXJlbnRQYXRoICYmIHBhcmVudFBhdGguc2l6ZSA+PSAwKSB7XG4gICAgbmV4dFNpYmxpbmdPZlBhcmVudCA9IG5leHRTaWJsaW5nKG5vZGUsIHBhcmVudFBhdGgpO1xuICAgIGlmIChuZXh0U2libGluZ09mUGFyZW50KSB7XG4gICAgICByZXR1cm4gbmV4dFNpYmxpbmdPZlBhcmVudDtcbiAgICB9XG4gICAgcGFyZW50UGF0aCA9IHBhcmVudChub2RlLCBwYXJlbnRQYXRoKTtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcmlnaHQ7XG4iLCJpbXBvcnQgeyBmcm9tSlMgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IGtleVBhdGhCeUlkIGZyb20gJy4vcmF3L2tleVBhdGhCeUlkJztcbmltcG9ydCBoYXNDaGlsZE5vZGVzIGZyb20gJy4vcmF3L2hhc0NoaWxkTm9kZXMnO1xuaW1wb3J0IHsgc2V0SW4gfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5IH0gZnJvbSAnLi9yYXcvdXRpbHMnO1xuaW1wb3J0IHsgSXRlcmFibGUgfSBmcm9tICdpbW11dGFibGUnO1xuXG5mdW5jdGlvbiBhcHBlbmRDaGlsZChzY2hlbWFOb2RlLCBwYXJlbnRJRCwgY2hpbGQpIHtcbiAgbGV0IG5vZGUgPSBmcm9tSlMoc2NoZW1hTm9kZSk7XG4gIGNvbnN0IGtleVBhdGggPSBrZXlQYXRoQnlJZChub2RlLCBwYXJlbnRJRCk7XG4gIGlmICgha2V5UGF0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudE5vZGUgPSBub2RlLmdldEluKGtleVBhdGgpO1xuICBpZiAoIXBhcmVudE5vZGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjaGlsZE5vZGVLZXkgPSBnZXRDaGlsZE5vZGVLZXkocGFyZW50Tm9kZSk7XG4gIGlmICghY2hpbGROb2RlS2V5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGNoaWxkTm9kZUtleSA9PT0gJ25vZGUnKSB7XG4gICAgcmV0dXJuIHNldEluKG5vZGUsIGtleVBhdGguY29uY2F0KFtjaGlsZE5vZGVLZXldKSwgY2hpbGQpLnRvSlMoKTtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuS2V5UGF0aCA9IGtleVBhdGguY29uY2F0KFtjaGlsZE5vZGVLZXldKTtcbiAgaWYgKCFoYXNDaGlsZE5vZGVzKG5vZGUsIGtleVBhdGgpKSB7XG4gICAgbm9kZSA9IHNldEluKG5vZGUsIGNoaWxkcmVuS2V5UGF0aCwgW10pO1xuICB9XG5cbiAgY29uc3QgaXRlbSA9IG5vZGUuZ2V0SW4oY2hpbGRyZW5LZXlQYXRoKTtcbiAgY29uc3Qgc2l6ZSA9IEl0ZXJhYmxlLmlzSXRlcmFibGUoaXRlbSkgPyBpdGVtLnNpemUgOiBpdGVtLmxlbmd0aDtcblxuICByZXR1cm4gbm9kZS5zZXRJbihjaGlsZHJlbktleVBhdGguY29uY2F0KFtzaXplXSksIGNoaWxkKS50b0pTKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGFwcGVuZENoaWxkO1xuIiwiaW1wb3J0IHsgZnJvbUpTLCByZW1vdmVJbiB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQga2V5UGF0aEJ5SWQgZnJvbSAnLi9yYXcva2V5UGF0aEJ5SWQnO1xuXG5mdW5jdGlvbiBkZWxldGVCeUlEKHNjaGVtYU5vZGUsIGlkKSB7XG4gIGNvbnN0IG5vZGUgPSBmcm9tSlMoc2NoZW1hTm9kZSk7XG4gIGNvbnN0IGtleVBhdGggPSBrZXlQYXRoQnlJZChub2RlLCBpZCk7XG4gIGlmICgha2V5UGF0aCkge1xuICAgIHJldHVybiBzY2hlbWFOb2RlO1xuICB9XG5cbiAgcmV0dXJuIHJlbW92ZUluKG5vZGUsIGtleVBhdGgpLnRvSlMoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVsZXRlQnlJRDtcbiIsImltcG9ydCB7IGZyb21KUyB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQga2V5UGF0aEJ5SWQgZnJvbSAnLi9yYXcva2V5UGF0aEJ5SWQnO1xuXG5mdW5jdGlvbiBmaW5kTm9kZUJ5SUQoc2NoZW1hTm9kZSwgaWQpIHtcbiAgY29uc3Qgbm9kZSA9IGZyb21KUyhzY2hlbWFOb2RlKTtcbiAgY29uc3Qga2V5UGF0aCA9IGtleVBhdGhCeUlkKG5vZGUsIGlkKTtcbiAgaWYgKCFrZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG5vZGUuZ2V0SW4oa2V5UGF0aCkudG9KUygpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmaW5kTm9kZUJ5SUQ7XG4iLCJpbXBvcnQgeyBTZXEsIGZyb21KUyB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgcGFyZW50SWRzU2VxIGZyb20gJy4vcmF3L3BhcmVudElkc1NlcSc7XG5cbmZ1bmN0aW9uIGdldE5vZGVQYXJlbnRJRHMoc2NoZW1hTm9kZSwgbm9kZUlEKSB7XG4gIGNvbnN0IG5vZGUgPSBmcm9tSlMoc2NoZW1hTm9kZSk7XG5cbiAgY29uc3QgaWRzID0gcGFyZW50SWRzU2VxKG5vZGUsIG5vZGVJRCk7XG5cbiAgcmV0dXJuIFNlcS5pc1NlcShpZHMpID8gaWRzLnRvSlMoKSA6IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0Tm9kZVBhcmVudElEcztcbiIsImltcG9ydCBnZXROb2RlUGFyZW50SURzIGZyb20gJy4vZ2V0Tm9kZVBhcmVudElEcyc7XG5pbXBvcnQgZmluZE5vZGVCeUlEIGZyb20gJy4vZmluZE5vZGVCeUlEJztcblxuZnVuY3Rpb24gZ2V0Tm9kZVBhcmVudHMoc2NoZW1hTm9kZSwgaWQpIHtcbiAgY29uc3QgcGFyZW50SURzID0gZ2V0Tm9kZVBhcmVudElEcyhzY2hlbWFOb2RlLCBpZCk7XG4gIGlmICghcGFyZW50SURzKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIHBhcmVudElEcy5tYXAoKHBhcmVudElEKSA9PiBmaW5kTm9kZUJ5SUQoc2NoZW1hTm9kZSwgcGFyZW50SUQpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0Tm9kZVBhcmVudHM7XG4iLCJpbXBvcnQgeyBmcm9tSlMsIG1lcmdlIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBrZXlQYXRoQnlJZCBmcm9tICcuL3Jhdy9rZXlQYXRoQnlJZCc7XG5cbmZ1bmN0aW9uIHBhdGNoTm9kZShzY2hlbWFOb2RlLCBwYXJ0aWFsTm9kZSkge1xuICBjb25zdCBub2RlID0gZnJvbUpTKHNjaGVtYU5vZGUpO1xuICBjb25zdCBrZXlQYXRoID0ga2V5UGF0aEJ5SWQobm9kZSwgcGFydGlhbE5vZGUuaWQpO1xuICBpZiAoIWtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBub2RlVG9QYXRjaCA9IG5vZGUuZ2V0SW4oa2V5UGF0aCk7XG4gIGlmICghbm9kZVRvUGF0Y2gpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gbm9kZS5zZXRJbihrZXlQYXRoLCBtZXJnZShub2RlVG9QYXRjaCwgcGFydGlhbE5vZGUpKS50b0pTKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhdGNoTm9kZTtcbiIsImltcG9ydCB7IE1hcCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgeyBpc0ltbXV0YWJsZSB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgeyBmcm9tSlMgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHdhbGsgZnJvbSAnLi9yYXcvd2Fsayc7XG5cbmNvbnN0IE5PREVfVFlQRV9UUkFWRUxFUl9NQVAgPSB7XG4gICdodG1sLWVsZW1lbnQnOiAnaHRtbE5vZGUnLFxuICAncmVhY3QtY29tcG9uZW50JzogJ3JlYWN0Q29tcG9uZW50Tm9kZScsXG4gICdsb29wLWNvbnRhaW5lcic6ICdsb29wQ29udGFpbmVyTm9kZScsXG4gICdjb21wb3NlZC1ub2RlJzogJ2NvbXBvc2VkTm9kZScsXG4gICdyZWYtbm9kZSc6ICdyZWZOb2RlJyxcbiAgJ2pzeC1ub2RlJzogJ2pzeE5vZGUnLFxuICAncm91dGUtbm9kZSc6ICdyb3V0ZU5vZGUnLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gdHJhdmVsKHNjaGVtYU5vZGUsIFZpc2l0b3JzKSB7XG4gIGNvbnN0IG5vZGUgPSBmcm9tSlMoc2NoZW1hTm9kZSk7XG4gIGNvbnN0IF9uZXdSb290ID0gd2Fsayhub2RlLCAobmV3Um9vdCwga2V5UGF0aCkgPT4ge1xuICAgIGlmICghbmV3Um9vdCkge1xuICAgICAgbmV3Um9vdCA9IG5vZGU7XG4gICAgfVxuXG4gICAgY29uc3Qgbm9kZVR5cGUgPSBub2RlLmdldEluKGtleVBhdGguY29uY2F0KFsndHlwZSddKSk7XG4gICAgY29uc3QgY3VycmVudE5vZGUgPSBub2RlLmdldEluKGtleVBhdGgpLnRvSlMoKTtcbiAgICBjb25zdCBuZXdOb2RlID0gVmlzaXRvcnNbTk9ERV9UWVBFX1RSQVZFTEVSX01BUFtub2RlVHlwZV1dPy4oY3VycmVudE5vZGUpO1xuICAgIGlmIChuZXdOb2RlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG5ld1Jvb3QgPSBuZXdSb290LnNldEluKGtleVBhdGgsIG5ld05vZGUpO1xuICAgICAgaWYgKCFpc0ltbXV0YWJsZShuZXdSb290KSkge1xuICAgICAgICBuZXdSb290ID0gTWFwKG5ld1Jvb3QpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdSb290O1xuICB9KTtcblxuICByZXR1cm4gX25ld1Jvb3QudG9KUygpO1xufVxuIiwiaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQga2V5UGF0aEJ5SWQgZnJvbSAnLi9rZXlQYXRoQnlJZCc7XG5pbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXkgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gaW5zZXJ0QXQocm9vdCwgcGFyZW50Tm9kZUlELCBpbmRleCwgbm9kZSkge1xuICBjb25zdCBwYXJlbnRLZXlQYXRoID0ga2V5UGF0aEJ5SWQocm9vdCwgcGFyZW50Tm9kZUlEKTtcbiAgaWYgKCFwYXJlbnRLZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGFyZW50Tm9kZSA9IHJvb3QuZ2V0SW4ocGFyZW50S2V5UGF0aCk7XG4gIGNvbnN0IGNoaWxkTm9kZUtleSA9IGdldENoaWxkTm9kZUtleShwYXJlbnROb2RlKTtcbiAgY29uc3QgY2hpbGRyZW5LZXlQYXRoID0gcGFyZW50S2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleV0pO1xuICBpZiAoY2hpbGROb2RlS2V5ID09PSAnbm9kZScpIHtcbiAgICByZXR1cm4gcm9vdC5zZXRJbihyb290LCBjaGlsZHJlbktleVBhdGgsIG5vZGUpO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW5Ob2RlcyA9IHJvb3QuZ2V0SW4oY2hpbGRyZW5LZXlQYXRoKSB8fCBMaXN0KCk7XG4gIGNvbnN0IGxlZnRTaWRlTm9kZXMgPSBjaGlsZHJlbk5vZGVzLnNsaWNlKDAsIGluZGV4KTtcbiAgY29uc3QgcmlnaHRTaWRlTm9kZXMgPSBjaGlsZHJlbk5vZGVzLnNsaWNlKGluZGV4KTtcblxuICBjb25zdCBhbGxDaGlsZHJlbk5vZGVzID0gbGVmdFNpZGVOb2Rlcy5jb25jYXQoW25vZGVdLCByaWdodFNpZGVOb2Rlcyk7XG4gIHJldHVybiByb290LnNldEluKGNoaWxkcmVuS2V5UGF0aCwgYWxsQ2hpbGRyZW5Ob2Rlcyk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluc2VydEF0O1xuIiwiaW1wb3J0IHsgZnJvbUpTIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBwYXJlbnQgZnJvbSAnLi9yYXcvcGFyZW50JztcbmltcG9ydCBfaW5zZXJ0QXQgZnJvbSAnLi9yYXcvaW5zZXJ0QXQnO1xuaW1wb3J0IF9rZXlQYXRoQnlJZCBmcm9tICcuL3Jhdy9rZXlQYXRoQnlJZCc7XG5cbmZ1bmN0aW9uIGluc2VydEJlZm9yZShyb290LCByZWZlcmVuY2VOb2RlSUQsIG5vZGUpIHtcbiAgbGV0IF9yb290ID0gZnJvbUpTKHJvb3QpO1xuXG4gIGNvbnN0IHJlZmVyZW5jZU5vZGVLZXlQYXRoID0gX2tleVBhdGhCeUlkKF9yb290LCByZWZlcmVuY2VOb2RlSUQpO1xuICBpZiAoIXJlZmVyZW5jZU5vZGVLZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVmZXJlbmNlTm9kZUluZGV4ID0gcmVmZXJlbmNlTm9kZUtleVBhdGgubGFzdCgpO1xuICBjb25zdCBwYXJlbnRLZXlQYXRoID0gcGFyZW50KF9yb290LCByZWZlcmVuY2VOb2RlSUQpO1xuICBjb25zdCBwYXJlbnROb2RlSUQgPSBfcm9vdC5nZXRJbihwYXJlbnRLZXlQYXRoLmNvbmNhdChbJ2lkJ10pKTtcbiAgX3Jvb3QgPSBfaW5zZXJ0QXQoX3Jvb3QsIHBhcmVudE5vZGVJRCwgcmVmZXJlbmNlTm9kZUluZGV4LCBub2RlKTtcblxuICBpZiAoIV9yb290KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIF9yb290LnRvSlMoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0QmVmb3JlO1xuIiwiaW1wb3J0IHsgZnJvbUpTIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBfcGFyZW50IGZyb20gJy4vcmF3L3BhcmVudCc7XG5pbXBvcnQgX2tleVBhdGhCeUlkIGZyb20gJy4vcmF3L2tleVBhdGhCeUlkJztcbmltcG9ydCBfaW5zZXJ0QXQgZnJvbSAnLi9yYXcvaW5zZXJ0QXQnO1xuXG5mdW5jdGlvbiBpbnNlcnRBZnRlcihyb290LCByZWZlcmVuY2VOb2RlSUQsIG5vZGUpIHtcbiAgbGV0IF9yb290ID0gZnJvbUpTKHJvb3QpO1xuXG4gIGNvbnN0IHJlZmVyZW5jZU5vZGVLZXlQYXRoID0gX2tleVBhdGhCeUlkKF9yb290LCByZWZlcmVuY2VOb2RlSUQpO1xuICBpZiAoIXJlZmVyZW5jZU5vZGVLZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcmVmZXJlbmNlTm9kZUluZGV4ID0gcmVmZXJlbmNlTm9kZUtleVBhdGgubGFzdCgpO1xuICBjb25zdCBwYXJlbnRLZXlQYXRoID0gX3BhcmVudChfcm9vdCwgcmVmZXJlbmNlTm9kZUlEKTtcbiAgY29uc3QgcGFyZW50Tm9kZUlEID0gX3Jvb3QuZ2V0SW4ocGFyZW50S2V5UGF0aC5jb25jYXQoWydpZCddKSk7XG5cbiAgX3Jvb3QgPSBfaW5zZXJ0QXQoX3Jvb3QsIHBhcmVudE5vZGVJRCwgcmVmZXJlbmNlTm9kZUluZGV4ICsgMSwgbm9kZSk7XG5cbiAgaWYgKCFfcm9vdCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBfcm9vdC50b0pTKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluc2VydEFmdGVyO1xuIiwiaW1wb3J0IHsgZnJvbUpTIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBfaW5zZXJ0QXQgZnJvbSAnLi9yYXcvaW5zZXJ0QXQnO1xuXG5mdW5jdGlvbiBpbnNlcnRBdChyb290LCBwYXJlbnROb2RlSUQsIGluZGV4LCBub2RlKSB7XG4gIGxldCBfcm9vdCA9IGZyb21KUyhyb290KTtcblxuICBfcm9vdCA9IF9pbnNlcnRBdChfcm9vdCwgcGFyZW50Tm9kZUlELCBpbmRleCwgbm9kZSk7XG4gIGlmICghX3Jvb3QpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gX3Jvb3QudG9KUygpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbnNlcnRBdDtcbiJdLCJuYW1lcyI6WyJieUFyYml0cmFyeSIsInNldEluIiwiaW5zZXJ0QXQiLCJfa2V5UGF0aEJ5SWQiLCJfaW5zZXJ0QXQiLCJfcGFyZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFDdEI7TUFDQTtNQUNBLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztNQUNkLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUM7TUFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUNwQjtNQUNBO01BQ0E7TUFDQSxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDakI7TUFDQTtNQUNBLFNBQVMsT0FBTyxHQUFHO01BQ25CLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQztNQUMxQixDQUFDO0FBQ0Q7TUFDQSxTQUFTLE1BQU0sQ0FBQyxH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QUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7TUFDN0IsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLFVBQVUsR0FBRyxRQUFRLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztNQUNwRCxFQUFFLFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUksVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO01BQzNFLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsUUFBUSxDQUFDO0FBQzVDO01BQ0EsRUFBRSxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO01BQzdELElBQUksT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztNQUMvRSxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUNsRSxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDNUIsSUFBSSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO01BQzVCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2QsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7TUFDdkIsTUFBTSxJQUFJLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO01BQzFDLE1BQU0sSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7TUFDN0MsUUFBUSxNQUFNO01BQ2QsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLE9BQU8sQ0FBQyxDQUFDO01BQ2IsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDdEUsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO01BQzVCLElBQUksSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztNQUM1QixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNkLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO01BQ3BDLE1BQU0sSUFBSSxDQUFDLEtBQUssSUFBSSxFQUFFO01BQ3RCLFFBQVEsT0FBTyxZQUFZLEVBQUUsQ0FBQztNQUM5QixPQUFPO01BQ1AsTUFBTSxJQUFJLEVBQUUsR0FBRyxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDO01BQzFDLE1BQU0sT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUNoRCxLQUFLLENBQUMsQ0FBQztNQUNQLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxPQUFPLFFBQVEsQ0FBQztNQUNsQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNmO01BQ0EsSUFBSSxTQUFTLGlCQUFpQixVQUFVLFFBQVEsRUFBRTtNQUNsRCxFQUFFLFNBQVMsU0FBUyxDQUFDLE1BQU0sRUFBRTtNQUM3QixJQUFJLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDbkMsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQztNQUMxQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3RCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO01BQzVCLEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxRQUFRLEdBQUcsU0FBUyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7TUFDakQsRUFBRSxTQUFTLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztNQUN4RSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztBQUM5QztNQUNBLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRTtNQUM1RCxJQUFJLElBQUksV0FBVyxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDckQsTUFBTSxPQUFPLFdBQVcsQ0FBQztNQUN6QixLQUFLO01BQ0wsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDN0IsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLEdBQUcsRUFBRTtNQUMvQyxJQUFJLE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQ2xELEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO01BQ25FLElBQUksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUM5QixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDMUIsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO01BQzNCLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2QsSUFBSSxPQUFPLENBQUMsS0FBSyxJQUFJLEVBQUU7TUFDdkIsTUFBTSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ2pELE1BQU0sSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxLQUFLLEVBQUU7TUFDaEQsUUFBUSxNQUFNO01BQ2QsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLE9BQU8sQ0FBQyxDQUFDO01BQ2IsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLFNBQVMsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDdkUsSUFBSSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO01BQzlCLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMxQixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDM0IsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDZCxJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtNQUN0QixRQUFRLE9BQU8sWUFBWSxFQUFFLENBQUM7TUFDOUIsT0FBTztNQUNQLE1BQU0sSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNqRCxNQUFNLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDbkQsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxTQUFTLENBQUM7TUFDbkIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7TUFDYixTQUFTLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQzlDO01BQ0EsSUFBSSxhQUFhLGlCQUFpQixVQUFVLFVBQVUsRUFBRTtNQUN4RCxFQUFFLFNBQVMsYUFBYSxDQUFDLFVBQVUsRUFBRTtNQUNyQyxJQUFJLElBQUksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO01BQ2xDLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsTUFBTSxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUM7TUFDckQsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLFVBQVUsR0FBRyxhQUFhLENBQUMsU0FBUyxHQUFHLFVBQVUsQ0FBQztNQUN6RCxFQUFFLGFBQWEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUksVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO01BQ2hGLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsYUFBYSxDQUFDO0FBQ3REO01BQ0EsRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLGlCQUFpQixHQUFHLFNBQVMsaUJBQWlCLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUN2RixJQUFJLElBQUksT0FBTyxFQUFFO01BQ2pCLE1BQU0sT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN2RCxLQUFLO01BQ0wsSUFBSSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO01BQ3RDLElBQUksSUFBSSxRQUFRLEdBQUcsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQzNDLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7TUFDOUIsTUFBTSxJQUFJLElBQUksQ0FBQztNQUNmLE1BQU0sT0FBTyxDQUFDLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUU7TUFDN0MsUUFBUSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUMxRCxVQUFVLE1BQU07TUFDaEIsU0FBUztNQUNULE9BQU87TUFDUCxLQUFLO01BQ0wsSUFBSSxPQUFPLFVBQVUsQ0FBQztNQUN0QixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxrQkFBa0IsR0FBRyxTQUFTLGtCQUFrQixFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDM0YsSUFBSSxJQUFJLE9BQU8sRUFBRTtNQUNqQixNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDMUQsS0FBSztNQUNMLElBQUksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztNQUN0QyxJQUFJLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUMzQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEVBQUU7TUFDL0IsTUFBTSxPQUFPLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ3hDLEtBQUs7TUFDTCxJQUFJLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztNQUN2QixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNqQyxNQUFNLE9BQU8sSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDOUUsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxhQUFhLENBQUM7TUFDdkIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDZjtNQUNBO0FBQ0E7TUFDQSxJQUFJLFNBQVMsQ0FBQztBQUNkO01BQ0EsU0FBUyxhQUFhLEdBQUc7TUFDekIsRUFBRSxPQUFPLFNBQVMsS0FBSyxTQUFTLEdBQUcsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUNyRCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLGlCQUFpQixDQUFDLEtBQUssRUFBRTtNQUNsQyxFQUFFLElBQUksR0FBRyxHQUFHLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzVDLEVBQUUsSUFBSSxHQUFHLEVBQUU7TUFDWCxJQUFJLE9BQU8sR0FBRyxDQUFDLFlBQVksRUFBRSxDQUFDO01BQzlCLEdBQUc7TUFDSCxFQUFFLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO01BQ2pDLElBQUksT0FBTyxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNoQyxHQUFHO01BQ0gsRUFBRSxNQUFNLElBQUksU0FBUztNQUNyQixJQUFJLDBFQUEwRTtNQUM5RSxNQUFNLEtBQUs7TUFDWCxHQUFHLENBQUM7TUFDSixDQUFDO0FBQ0Q7TUFDQSxTQUFTLG1CQUFtQixDQUFDLEtBQUssRUFBRTtNQUNwQyxFQUFFLElBQUksR0FBRyxHQUFHLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzVDLEVBQUUsSUFBSSxHQUFHLEVBQUU7TUFDWCxJQUFJLE9BQU8sR0FBRyxDQUFDO01BQ2YsR0FBRztNQUNILEVBQUUsTUFBTSxJQUFJLFNBQVM7TUFDckIsSUFBSSxpREFBaUQsR0FBRyxLQUFLO01BQzdELEdBQUcsQ0FBQztNQUNKLENBQUM7QUFDRDtNQUNBLFNBQVMsWUFBWSxDQUFDLEtBQUssRUFBRTtNQUM3QixFQUFFLElBQUksR0FBRyxHQUFHLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzVDLEVBQUUsSUFBSSxHQUFHLEVBQUU7TUFDWCxJQUFJLE9BQU8saUJBQWlCLENBQUMsS0FBSyxDQUFDO01BQ25DLFFBQVEsR0FBRyxDQUFDLFlBQVksRUFBRTtNQUMxQixRQUFRLGNBQWMsQ0FBQyxLQUFLLENBQUM7TUFDN0IsUUFBUSxHQUFHLENBQUMsUUFBUSxFQUFFO01BQ3RCLFFBQVEsR0FBRyxDQUFDO01BQ1osR0FBRztNQUNILEVBQUUsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7TUFDakMsSUFBSSxPQUFPLElBQUksU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2hDLEdBQUc7TUFDSCxFQUFFLE1BQU0sSUFBSSxTQUFTO01BQ3JCLElBQUksa0VBQWtFLEdBQUcsS0FBSztNQUM5RSxHQUFHLENBQUM7TUFDSixDQUFDO0FBQ0Q7TUFDQSxTQUFTLHdCQUF3QixDQUFDLEtBQUssRUFBRTtNQUN6QyxFQUFFLE9BQU8sV0FBVyxDQUFDLEtBQUssQ0FBQztNQUMzQixNQUFNLElBQUksUUFBUSxDQUFDLEtBQUssQ0FBQztNQUN6QixNQUFNLFdBQVcsQ0FBQyxLQUFLLENBQUM7TUFDeEIsTUFBTSxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUM7TUFDOUIsTUFBTSxTQUFTLENBQUM7TUFDaEIsQ0FBQztBQUNEO01BQ0EsSUFBSSxhQUFhLEdBQUcsdUJBQXVCLENBQUM7QUFDNUM7TUFDQSxTQUFTLEtBQUssQ0FBQyxRQUFRLEVBQUU7TUFDekIsRUFBRSxPQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7TUFDdEQsQ0FBQztBQUNEO01BQ0EsU0FBUyxZQUFZLENBQUMsZUFBZSxFQUFFO01BQ3ZDLEVBQUUsT0FBTyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO01BQzlELENBQUM7QUFDRDtNQUNBLFNBQVMsYUFBYSxDQUFDLFVBQVUsRUFBRTtNQUNuQyxFQUFFLE9BQU8sT0FBTztNQUNoQixJQUFJLFVBQVU7TUFDZCxNQUFNLE9BQU8sVUFBVSxDQUFDLE1BQU0sS0FBSyxVQUFVO01BQzdDLE1BQU0sT0FBTyxVQUFVLENBQUMsUUFBUSxLQUFLLFVBQVU7TUFDL0MsR0FBRyxDQUFDO01BQ0osQ0FBQztBQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsU0FBUyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtNQUM1QixFQUFFLElBQUksTUFBTSxLQUFLLE1BQU0sS0FBSyxNQUFNLEtBQUssTUFBTSxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsRUFBRTtNQUNyRSxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7TUFDSCxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDMUIsSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO01BQ0gsRUFBRTtNQUNGLElBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxLQUFLLFVBQVU7TUFDeEMsSUFBSSxPQUFPLE1BQU0sQ0FBQyxPQUFPLEtBQUssVUFBVTtNQUN4QyxJQUFJO01BQ0osSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO01BQzlCLElBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztNQUM5QixJQUFJLElBQUksTUFBTSxLQUFLLE1BQU0sS0FBSyxNQUFNLEtBQUssTUFBTSxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUMsRUFBRTtNQUN2RSxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDNUIsTUFBTSxPQUFPLEtBQUssQ0FBQztNQUNuQixLQUFLO01BQ0wsR0FBRztNQUNILEVBQUUsT0FBTyxDQUFDO01BQ1YsSUFBSSxhQUFhLENBQUMsTUFBTSxDQUFDO01BQ3pCLElBQUksYUFBYSxDQUFDLE1BQU0sQ0FBQztNQUN6QixJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO01BQ3pCLEdBQUcsQ0FBQztNQUNKLENBQUM7QUFDRDtNQUNBLElBQUksSUFBSTtNQUNSLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDcEUsTUFBTSxJQUFJLENBQUMsSUFBSTtNQUNmLE1BQU0sU0FBUyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUMxQixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDZixRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDZixRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7TUFDM0IsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDO01BQzNCO01BQ0EsUUFBUSxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDL0UsT0FBTyxDQUFDO0FBQ1I7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsR0FBRyxDQUFDLEdBQUcsRUFBRTtNQUNsQixFQUFFLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksVUFBVSxLQUFLLEdBQUcsR0FBRyxVQUFVLENBQUMsQ0FBQztNQUN6RCxDQUFDO0FBQ0Q7TUFDQSxJQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztBQUM5QztNQUNBLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRTtNQUNqQixFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtNQUNqQixJQUFJLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzFCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO01BQ3hDO01BQ0EsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDOUIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckI7TUFDQSxFQUFFLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRTtNQUNqQixJQUFJLE9BQU8sV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzFCLEdBQUc7QUFDSDtNQUNBLEVBQUUsUUFBUSxPQUFPLENBQUM7TUFDbEIsSUFBSSxLQUFLLFNBQVM7TUFDbEI7TUFDQTtNQUNBO01BQ0EsTUFBTSxPQUFPLENBQUMsR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDO01BQ3pDLElBQUksS0FBSyxRQUFRO01BQ2pCLE1BQU0sT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDM0IsSUFBSSxLQUFLLFFBQVE7TUFDakIsTUFBTSxPQUFPLENBQUMsQ0FBQyxNQUFNLEdBQUcsNEJBQTRCO01BQ3BELFVBQVUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO01BQzdCLFVBQVUsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3hCLElBQUksS0FBSyxRQUFRLENBQUM7TUFDbEIsSUFBSSxLQUFLLFVBQVU7TUFDbkIsTUFBTSxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUMxQixJQUFJLEtBQUssUUFBUTtNQUNqQixNQUFNLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzNCLElBQUk7TUFDSixNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtNQUM1QyxRQUFRLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO01BQ3hDLE9BQU87TUFDUCxNQUFNLE1BQU0sSUFBSSxLQUFLLENBQUMsYUFBYSxHQUFHLE9BQU8sQ0FBQyxHQUFHLG9CQUFvQixDQUFDLENBQUM7TUFDdkUsR0FBRztNQUNILENBQUM7QUFDRDtNQUNBLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRTtNQUM5QixFQUFFLE9BQU8sT0FBTyxLQUFLLElBQUksR0FBRyxVQUFVLG1CQUFtQixVQUFVLENBQUM7TUFDcEUsQ0FBQztBQUNEO01BQ0E7TUFDQSxTQUFTLFVBQVUsQ0FBQyxDQUFDLEVBQUU7TUFDdkIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLFFBQVEsRUFBRTtNQUNqQyxJQUFJLE9BQU8sQ0FBQyxDQUFDO01BQ2IsR0FBRztNQUNILEVBQUUsSUFBSSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNuQixFQUFFLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtNQUNsQixJQUFJLElBQUksSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDO01BQzNCLEdBQUc7TUFDSCxFQUFFLE9BQU8sQ0FBQyxHQUFHLFVBQVUsRUFBRTtNQUN6QixJQUFJLENBQUMsSUFBSSxVQUFVLENBQUM7TUFDcEIsSUFBSSxJQUFJLElBQUksQ0FBQyxDQUFDO01BQ2QsR0FBRztNQUNILEVBQUUsT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbkIsQ0FBQztBQUNEO01BQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7TUFDbEMsRUFBRSxJQUFJLE1BQU0sR0FBRyxlQUFlLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDdkMsRUFBRSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDNUIsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQ2hDLElBQUksSUFBSSxzQkFBc0IsS0FBSywwQkFBMEIsRUFBRTtNQUMvRCxNQUFNLHNCQUFzQixHQUFHLENBQUMsQ0FBQztNQUNqQyxNQUFNLGVBQWUsR0FBRyxFQUFFLENBQUM7TUFDM0IsS0FBSztNQUNMLElBQUksc0JBQXNCLEVBQUUsQ0FBQztNQUM3QixJQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7TUFDckMsR0FBRztNQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7TUFDaEIsQ0FBQztBQUNEO01BQ0E7TUFDQSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7TUFDNUI7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDakIsRUFBRSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUM3QyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUUsR0FBRyxNQUFNLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdkQsR0FBRztNQUNILEVBQUUsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDckIsQ0FBQztBQUNEO01BQ0EsU0FBUyxVQUFVLENBQUMsR0FBRyxFQUFFO01BQ3pCLEVBQUUsSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzlCLEVBQUUsSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO01BQzVCLElBQUksT0FBTyxNQUFNLENBQUM7TUFDbEIsR0FBRztBQUNIO01BQ0EsRUFBRSxNQUFNLEdBQUcsUUFBUSxFQUFFLENBQUM7QUFDdEI7TUFDQSxFQUFFLFNBQVMsQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUM7QUFDMUI7TUFDQSxFQUFFLE9BQU8sTUFBTSxDQUFDO01BQ2hCLENBQUM7QUFDRDtNQUNBLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRTtNQUN4QixFQUFFLElBQUksTUFBTSxDQUFDO01BQ2IsRUFBRSxJQUFJLFlBQVksRUFBRTtNQUNwQixJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzlCLElBQUksSUFBSSxNQUFNLEtBQUssU0FBUyxFQUFFO01BQzlCLE1BQU0sT0FBTyxNQUFNLENBQUM7TUFDcEIsS0FBSztNQUNMLEdBQUc7QUFDSDtNQUNBLEVBQUUsTUFBTSxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztNQUM3QixFQUFFLElBQUksTUFBTSxLQUFLLFNBQVMsRUFBRTtNQUM1QixJQUFJLE9BQU8sTUFBTSxDQUFDO01BQ2xCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxDQUFDLGlCQUFpQixFQUFFO01BQzFCLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxHQUFHLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDaEYsSUFBSSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDOUIsTUFBTSxPQUFPLE1BQU0sQ0FBQztNQUNwQixLQUFLO0FBQ0w7TUFDQSxJQUFJLE1BQU0sR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDaEMsSUFBSSxJQUFJLE1BQU0sS0FBSyxTQUFTLEVBQUU7TUFDOUIsTUFBTSxPQUFPLE1BQU0sQ0FBQztNQUNwQixLQUFLO01BQ0wsR0FBRztBQUNIO01BQ0EsRUFBRSxNQUFNLEdBQUcsUUFBUSxFQUFFLENBQUM7QUFDdEI7TUFDQSxFQUFFLElBQUksWUFBWSxFQUFFO01BQ3BCLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDN0IsR0FBRyxNQUFNLElBQUksWUFBWSxLQUFLLFNBQVMsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssS0FBSyxFQUFFO01BQ3hFLElBQUksTUFBTSxJQUFJLEtBQUssQ0FBQyxpREFBaUQsQ0FBQyxDQUFDO01BQ3ZFLEdBQUcsTUFBTSxJQUFJLGlCQUFpQixFQUFFO01BQ2hDLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsWUFBWSxFQUFFO01BQzdDLE1BQU0sVUFBVSxFQUFFLEtBQUs7TUFDdkIsTUFBTSxZQUFZLEVBQUUsS0FBSztNQUN6QixNQUFNLFFBQVEsRUFBRSxLQUFLO01BQ3JCLE1BQU0sS0FBSyxFQUFFLE1BQU07TUFDbkIsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLE1BQU07TUFDVCxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsS0FBSyxTQUFTO01BQzFDLElBQUksR0FBRyxDQUFDLG9CQUFvQixLQUFLLEdBQUcsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLG9CQUFvQjtNQUMvRSxJQUFJO01BQ0o7TUFDQTtNQUNBO01BQ0E7TUFDQSxJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsR0FBRyxZQUFZO01BQzNDLE1BQU0sT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLO01BQ2xFLFFBQVEsSUFBSTtNQUNaLFFBQVEsU0FBUztNQUNqQixPQUFPLENBQUM7TUFDUixLQUFLLENBQUM7TUFDTixJQUFJLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFNLENBQUM7TUFDcEQsR0FBRyxNQUFNLElBQUksR0FBRyxDQUFDLFFBQVEsS0FBSyxTQUFTLEVBQUU7TUFDekM7TUFDQTtNQUNBO01BQ0E7TUFDQSxJQUFJLEdBQUcsQ0FBQyxZQUFZLENBQUMsR0FBRyxNQUFNLENBQUM7TUFDL0IsR0FBRyxNQUFNO01BQ1QsSUFBSSxNQUFNLElBQUksS0FBSyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7TUFDMUUsR0FBRztBQUNIO01BQ0EsRUFBRSxPQUFPLE1BQU0sQ0FBQztNQUNoQixDQUFDO0FBQ0Q7TUFDQTtNQUNBLElBQUksWUFBWSxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUM7QUFDdkM7TUFDQTtNQUNBLElBQUksaUJBQWlCLEdBQUcsQ0FBQyxZQUFZO01BQ3JDLEVBQUUsSUFBSTtNQUNOLElBQUksTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQ3ZDLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRyxDQUFDLE9BQU8sQ0FBQyxFQUFFO01BQ2QsSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO01BQ0gsQ0FBQyxHQUFHLENBQUM7QUFDTDtNQUNBO01BQ0E7TUFDQSxTQUFTLGFBQWEsQ0FBQyxJQUFJLEVBQUU7TUFDN0IsRUFBRSxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRTtNQUNqQyxJQUFJLFFBQVEsSUFBSSxDQUFDLFFBQVE7TUFDekIsTUFBTSxLQUFLLENBQUM7TUFDWixRQUFRLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztNQUM3QixNQUFNLEtBQUssQ0FBQztNQUNaLFFBQVEsT0FBTyxJQUFJLENBQUMsZUFBZSxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsUUFBUSxDQUFDO01BQ3JFLEtBQUs7TUFDTCxHQUFHO01BQ0gsQ0FBQztBQUNEO01BQ0EsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFO01BQ3RCLEVBQUUsT0FBTyxHQUFHLENBQUMsT0FBTyxLQUFLLGNBQWMsSUFBSSxPQUFPLEdBQUcsQ0FBQyxPQUFPLEtBQUssVUFBVTtNQUM1RSxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO01BQ3RCLE1BQU0sR0FBRyxDQUFDO01BQ1YsQ0FBQztBQUNEO01BQ0EsU0FBUyxRQUFRLEdBQUc7TUFDcEIsRUFBRSxJQUFJLFFBQVEsR0FBRyxFQUFFLFdBQVcsQ0FBQztNQUMvQixFQUFFLElBQUksV0FBVyxHQUFHLFVBQVUsRUFBRTtNQUNoQyxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7TUFDcEIsR0FBRztNQUNILEVBQUUsT0FBTyxRQUFRLENBQUM7TUFDbEIsQ0FBQztBQUNEO01BQ0E7TUFDQSxJQUFJLFlBQVksR0FBRyxPQUFPLE9BQU8sS0FBSyxVQUFVLENBQUM7TUFDakQsSUFBSSxPQUFPLENBQUM7TUFDWixJQUFJLFlBQVksRUFBRTtNQUNsQixFQUFFLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO01BQzFCLENBQUM7QUFDRDtNQUNBLElBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDcEM7TUFDQSxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEI7TUFDQSxJQUFJLFlBQVksR0FBRyxtQkFBbUIsQ0FBQztNQUN2QyxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtNQUNsQyxFQUFFLFlBQVksR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDdEMsQ0FBQztBQUNEO01BQ0EsSUFBSSw0QkFBNEIsR0FBRyxFQUFFLENBQUM7TUFDdEMsSUFBSSwwQkFBMEIsR0FBRyxHQUFHLENBQUM7TUFDckMsSUFBSSxzQkFBc0IsR0FBRyxDQUFDLENBQUM7TUFDL0IsSUFBSSxlQUFlLEdBQUcsRUFBRSxDQUFDO0FBQ3pCO01BQ0EsSUFBSSxlQUFlLGlCQUFpQixVQUFVLFFBQVEsRUFBRTtNQUN4RCxFQUFFLFNBQVMsZUFBZSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7TUFDN0MsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztNQUN6QixJQUFJLElBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDO01BQzVCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO01BQzdCLEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxRQUFRLEdBQUcsZUFBZSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7TUFDdkQsRUFBRSxlQUFlLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztNQUM5RSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQztBQUMxRDtNQUNBLEVBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRTtNQUNsRSxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO01BQzVDLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsRUFBRSxHQUFHLEVBQUU7TUFDckQsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQy9CLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxlQUFlLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsSUFBSTtNQUM1RCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztNQUNqQyxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLElBQUk7TUFDMUQsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksZ0JBQWdCLEdBQUcsY0FBYyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUN0RCxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO01BQ3hCLE1BQU0sZ0JBQWdCLENBQUMsUUFBUSxHQUFHLFlBQVksRUFBRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO01BQzNGLEtBQUs7TUFDTCxJQUFJLE9BQU8sZ0JBQWdCLENBQUM7TUFDNUIsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7TUFDakUsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksY0FBYyxHQUFHLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQzNELElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7TUFDeEIsTUFBTSxjQUFjLENBQUMsUUFBUSxHQUFHLFlBQVksRUFBRSxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUM7TUFDcEcsS0FBSztNQUNMLElBQUksT0FBTyxjQUFjLENBQUM7TUFDMUIsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDekUsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDekYsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLGVBQWUsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDN0UsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNoRCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxlQUFlLENBQUM7TUFDekIsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7TUFDYixlQUFlLENBQUMsU0FBUyxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDO0FBQ3BEO01BQ0EsSUFBSSxpQkFBaUIsaUJBQWlCLFVBQVUsVUFBVSxFQUFFO01BQzVELEVBQUUsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUU7TUFDbkMsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztNQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUMxQixHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssVUFBVSxHQUFHLGlCQUFpQixDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUM7TUFDN0QsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxVQUFVLElBQUksVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDO01BQ3BGLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxpQkFBaUIsQ0FBQztBQUM5RDtNQUNBLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsRUFBRSxLQUFLLEVBQUU7TUFDbkUsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3RDLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDM0UsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNkLElBQUksT0FBTyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTO01BQy9CLE1BQU0sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLFFBQVEsQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtNQUNuRixNQUFNLE9BQU87TUFDYixLQUFLLENBQUM7TUFDTixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQy9FLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3hCO01BQ0EsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDbEUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDZCxJQUFJLE9BQU8sSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDaEMsSUFBSSxPQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7TUFDcEMsTUFBTSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDakMsTUFBTSxPQUFPLElBQUksQ0FBQyxJQUFJO01BQ3RCLFVBQVUsSUFBSTtNQUNkLFVBQVUsYUFBYTtNQUN2QixZQUFZLElBQUk7TUFDaEIsWUFBWSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDL0MsWUFBWSxJQUFJLENBQUMsS0FBSztNQUN0QixZQUFZLElBQUk7TUFDaEIsV0FBVyxDQUFDO01BQ1osS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxpQkFBaUIsQ0FBQztNQUMzQixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNmO01BQ0EsSUFBSSxhQUFhLGlCQUFpQixVQUFVLE1BQU0sRUFBRTtNQUNwRCxFQUFFLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRTtNQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3RCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQzFCLEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxNQUFNLEdBQUcsYUFBYSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7TUFDakQsRUFBRSxhQUFhLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQztNQUN4RSxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLGFBQWEsQ0FBQztBQUN0RDtNQUNBLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsR0FBRyxFQUFFO01BQ25ELElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNwQyxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUN2RSxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ3RGLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxhQUFhLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQzNFLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2xFLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO01BQ3BDLE1BQU0sSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ2pDLE1BQU0sT0FBTyxJQUFJLENBQUMsSUFBSTtNQUN0QixVQUFVLElBQUk7TUFDZCxVQUFVLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQzVELEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLE9BQU8sYUFBYSxDQUFDO01BQ3ZCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ1g7TUFDQSxJQUFJLG1CQUFtQixpQkFBaUIsVUFBVSxRQUFRLEVBQUU7TUFDNUQsRUFBRSxTQUFTLG1CQUFtQixDQUFDLE9BQU8sRUFBRTtNQUN4QyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO01BQ3pCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO01BQzdCLEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxRQUFRLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQztNQUMzRCxFQUFFLG1CQUFtQixDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsSUFBSSxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7TUFDbEYsRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLG1CQUFtQixDQUFDO0FBQ2xFO01BQ0EsRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxJQUFJO01BQ2hFLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO01BQzlCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDN0UsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxLQUFLLEVBQUU7TUFDakQ7TUFDQTtNQUNBLE1BQU0sSUFBSSxLQUFLLEVBQUU7TUFDakIsUUFBUSxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDN0IsUUFBUSxJQUFJLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUNwRCxRQUFRLE9BQU8sRUFBRTtNQUNqQixVQUFVLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUNyRCxVQUFVLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUNyRCxVQUFVLFFBQVE7TUFDbEIsU0FBUyxDQUFDO01BQ1YsT0FBTztNQUNQLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNoQixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQ2pGLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2xFLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO01BQ3BDLE1BQU0sT0FBTyxJQUFJLEVBQUU7TUFDbkIsUUFBUSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDbkMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDdkIsVUFBVSxPQUFPLElBQUksQ0FBQztNQUN0QixTQUFTO01BQ1QsUUFBUSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO01BQy9CO01BQ0E7TUFDQSxRQUFRLElBQUksS0FBSyxFQUFFO01BQ25CLFVBQVUsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQy9CLFVBQVUsSUFBSSxpQkFBaUIsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdEQsVUFBVSxPQUFPLGFBQWE7TUFDOUIsWUFBWSxJQUFJO01BQ2hCLFlBQVksaUJBQWlCLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQ3ZELFlBQVksaUJBQWlCLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQ3ZELFlBQVksSUFBSTtNQUNoQixXQUFXLENBQUM7TUFDWixTQUFTO01BQ1QsT0FBTztNQUNQLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLE9BQU8sbUJBQW1CLENBQUM7TUFDN0IsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDYjtNQUNBLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxXQUFXO01BQ3ZDLEVBQUUsZUFBZSxDQUFDLFNBQVMsQ0FBQyxXQUFXO01BQ3ZDLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxXQUFXO01BQ3JDLEVBQUUsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFdBQVc7TUFDM0MsSUFBSSxrQkFBa0IsQ0FBQztBQUN2QjtNQUNBLFNBQVMsV0FBVyxDQUFDLFVBQVUsRUFBRTtNQUNqQyxFQUFFLElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUM5QyxFQUFFLFlBQVksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDO01BQ2xDLEVBQUUsWUFBWSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO01BQ3RDLEVBQUUsWUFBWSxDQUFDLElBQUksR0FBRyxZQUFZLEVBQUUsT0FBTyxVQUFVLENBQUMsRUFBRSxDQUFDO01BQ3pELEVBQUUsWUFBWSxDQUFDLE9BQU8sR0FBRyxZQUFZO01BQ3JDLElBQUksSUFBSSxnQkFBZ0IsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUMxRCxJQUFJLGdCQUFnQixDQUFDLElBQUksR0FBRyxZQUFZLEVBQUUsT0FBTyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDO01BQ3pFLElBQUksT0FBTyxnQkFBZ0IsQ0FBQztNQUM1QixHQUFHLENBQUM7TUFDSixFQUFFLFlBQVksQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ3pFLEVBQUUsWUFBWSxDQUFDLFFBQVEsR0FBRyxVQUFVLEdBQUcsRUFBRSxFQUFFLE9BQU8sVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUM7TUFDekUsRUFBRSxZQUFZLENBQUMsV0FBVyxHQUFHLGtCQUFrQixDQUFDO01BQ2hELEVBQUUsWUFBWSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUMxRCxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksT0FBTyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNuRyxHQUFHLENBQUM7TUFDSixFQUFFLFlBQVksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDN0QsSUFBSSxJQUFJLElBQUksS0FBSyxlQUFlLEVBQUU7TUFDbEMsTUFBTSxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUMxRCxNQUFNLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUN0QyxRQUFRLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNuQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFO01BQ3hCLFVBQVUsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNoQyxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN4QyxVQUFVLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzVCLFNBQVM7TUFDVCxRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLE9BQU8sQ0FBQyxDQUFDO01BQ1QsS0FBSztNQUNMLElBQUksT0FBTyxVQUFVLENBQUMsVUFBVTtNQUNoQyxNQUFNLElBQUksS0FBSyxjQUFjLEdBQUcsWUFBWSxHQUFHLGNBQWM7TUFDN0QsTUFBTSxPQUFPO01BQ2IsS0FBSyxDQUFDO01BQ04sR0FBRyxDQUFDO01BQ0osRUFBRSxPQUFPLFlBQVksQ0FBQztNQUN0QixDQUFDO0FBQ0Q7TUFDQSxTQUFTLFVBQVUsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtNQUNqRCxFQUFFLElBQUksY0FBYyxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUNoRCxFQUFFLGNBQWMsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQztNQUN4QyxFQUFFLGNBQWMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ3RFLEVBQUUsY0FBYyxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsRUFBRSxXQUFXLEVBQUU7TUFDbkQsSUFBSSxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN6QyxJQUFJLE9BQU8sQ0FBQyxLQUFLLE9BQU87TUFDeEIsUUFBUSxXQUFXO01BQ25CLFFBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztNQUNqRCxHQUFHLENBQUM7TUFDSixFQUFFLGNBQWMsQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDNUQsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLFNBQVM7TUFDL0IsTUFBTSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssS0FBSyxDQUFDLEVBQUU7TUFDN0YsTUFBTSxPQUFPO01BQ2IsS0FBSyxDQUFDO01BQ04sR0FBRyxDQUFDO01BQ0osRUFBRSxjQUFjLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQy9ELElBQUksSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDbkUsSUFBSSxPQUFPLElBQUksUUFBUSxDQUFDLFlBQVk7TUFDcEMsTUFBTSxJQUFJLElBQUksR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDakMsTUFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDckIsUUFBUSxPQUFPLElBQUksQ0FBQztNQUNwQixPQUFPO01BQ1AsTUFBTSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO01BQzdCLE1BQU0sSUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3pCLE1BQU0sT0FBTyxhQUFhO01BQzFCLFFBQVEsSUFBSTtNQUNaLFFBQVEsR0FBRztNQUNYLFFBQVEsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUM7TUFDdkQsUUFBUSxJQUFJO01BQ1osT0FBTyxDQUFDO01BQ1IsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7TUFDSixFQUFFLE9BQU8sY0FBYyxDQUFDO01BQ3hCLENBQUM7QUFDRDtNQUNBLFNBQVMsY0FBYyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7TUFDN0MsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDdEI7TUFDQSxFQUFFLElBQUksZ0JBQWdCLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQ2xELEVBQUUsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztNQUN0QyxFQUFFLGdCQUFnQixDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO01BQzFDLEVBQUUsZ0JBQWdCLENBQUMsT0FBTyxHQUFHLFlBQVksRUFBRSxPQUFPLFVBQVUsQ0FBQyxFQUFFLENBQUM7TUFDaEUsRUFBRSxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUU7TUFDdkIsSUFBSSxnQkFBZ0IsQ0FBQyxJQUFJLEdBQUcsWUFBWTtNQUN4QyxNQUFNLElBQUksWUFBWSxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUNqRCxNQUFNLFlBQVksQ0FBQyxPQUFPLEdBQUcsWUFBWSxFQUFFLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQztNQUN2RSxNQUFNLE9BQU8sWUFBWSxDQUFDO01BQzFCLEtBQUssQ0FBQztNQUNOLEdBQUc7TUFDSCxFQUFFLGdCQUFnQixDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsRUFBRSxXQUFXLEVBQUUsRUFBRSxPQUFPLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ3ZILEVBQUUsZ0JBQWdCLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQzdGLEVBQUUsZ0JBQWdCLENBQUMsUUFBUSxHQUFHLFVBQVUsS0FBSyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztNQUN0RixFQUFFLGdCQUFnQixDQUFDLFdBQVcsR0FBRyxrQkFBa0IsQ0FBQztNQUNwRCxFQUFFLGdCQUFnQixDQUFDLFNBQVMsR0FBRyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDdEQsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNkLElBQUksT0FBTyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUN0QyxJQUFJLE9BQU8sVUFBVSxDQUFDLFNBQVM7TUFDL0IsTUFBTSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO01BQ3BHLE1BQU0sQ0FBQyxPQUFPO01BQ2QsS0FBSyxDQUFDO01BQ04sR0FBRyxDQUFDO01BQ0osRUFBRSxnQkFBZ0IsQ0FBQyxVQUFVLEdBQUcsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQ3pELElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2QsSUFBSSxPQUFPLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQ3RDLElBQUksSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUNwRSxJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNqQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtNQUNyQixRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLE9BQU87TUFDUCxNQUFNLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDN0IsTUFBTSxPQUFPLGFBQWE7TUFDMUIsUUFBUSxJQUFJO01BQ1osUUFBUSxPQUFPLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRTtNQUNoRSxRQUFRLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDaEIsUUFBUSxJQUFJO01BQ1osT0FBTyxDQUFDO01BQ1IsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7TUFDSixFQUFFLE9BQU8sZ0JBQWdCLENBQUM7TUFDMUIsQ0FBQztBQUNEO01BQ0EsU0FBUyxhQUFhLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO01BQ2hFLEVBQUUsSUFBSSxjQUFjLEdBQUcsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQ2hELEVBQUUsSUFBSSxPQUFPLEVBQUU7TUFDZixJQUFJLGNBQWMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUU7TUFDeEMsTUFBTSxJQUFJLENBQUMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUMzQyxNQUFNLE9BQU8sQ0FBQyxLQUFLLE9BQU8sSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsQ0FBQztNQUM1RSxLQUFLLENBQUM7TUFDTixJQUFJLGNBQWMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxHQUFHLEVBQUUsV0FBVyxFQUFFO01BQ3JELE1BQU0sSUFBSSxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDM0MsTUFBTSxPQUFPLENBQUMsS0FBSyxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUM7TUFDekUsVUFBVSxDQUFDO01BQ1gsVUFBVSxXQUFXLENBQUM7TUFDdEIsS0FBSyxDQUFDO01BQ04sR0FBRztNQUNILEVBQUUsY0FBYyxDQUFDLGlCQUFpQixHQUFHLFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUM1RCxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQzVDLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO01BQzVDLFFBQVEsVUFBVSxFQUFFLENBQUM7TUFDckIsUUFBUSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsT0FBTyxHQUFHLENBQUMsR0FBRyxVQUFVLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQzdELE9BQU87TUFDUCxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDaEIsSUFBSSxPQUFPLFVBQVUsQ0FBQztNQUN0QixHQUFHLENBQUM7TUFDSixFQUFFLGNBQWMsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDL0QsSUFBSSxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNuRSxJQUFJLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztNQUN2QixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLE9BQU8sSUFBSSxFQUFFO01BQ25CLFFBQVEsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ25DLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFO01BQ3ZCLFVBQVUsT0FBTyxJQUFJLENBQUM7TUFDdEIsU0FBUztNQUNULFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMvQixRQUFRLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUMzQixRQUFRLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM3QixRQUFRLElBQUksU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUMsRUFBRTtNQUM3RCxVQUFVLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsR0FBRyxHQUFHLFVBQVUsRUFBRSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNoRixTQUFTO01BQ1QsT0FBTztNQUNQLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO01BQ0osRUFBRSxPQUFPLGNBQWMsQ0FBQztNQUN4QixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGNBQWMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtNQUN0RCxFQUFFLElBQUksTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLFNBQVMsRUFBRSxDQUFDO01BQ2pDLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDdkMsSUFBSSxNQUFNLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQzlGLEdBQUcsQ0FBQyxDQUFDO01BQ0wsRUFBRSxPQUFPLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztNQUM5QixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGNBQWMsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtNQUN0RCxFQUFFLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUN4QyxFQUFFLElBQUksTUFBTSxHQUFHLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsRUFBRSxHQUFHLEdBQUcsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDO01BQzFFLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDdkMsSUFBSSxNQUFNLENBQUMsTUFBTTtNQUNqQixNQUFNLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDO01BQzdDLE1BQU0sVUFBVSxDQUFDLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDbkYsS0FBSyxDQUFDO01BQ04sR0FBRyxDQUFDLENBQUM7TUFDTCxFQUFFLElBQUksTUFBTSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUMzQyxFQUFFLE9BQU8sTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUcsRUFBRSxFQUFFLE9BQU8sS0FBSyxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztNQUM3RixDQUFDO0FBQ0Q7TUFDQSxTQUFTLFlBQVksQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUU7TUFDdkQsRUFBRSxJQUFJLFlBQVksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDO0FBQ3JDO01BQ0EsRUFBRSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLFlBQVksQ0FBQyxFQUFFO01BQzVDLElBQUksT0FBTyxVQUFVLENBQUM7TUFDdEIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLGFBQWEsR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxDQUFDO01BQ3hELEVBQUUsSUFBSSxXQUFXLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxZQUFZLENBQUMsQ0FBQztBQUNsRDtNQUNBO01BQ0E7TUFDQTtNQUNBLEVBQUUsSUFBSSxhQUFhLEtBQUssYUFBYSxJQUFJLFdBQVcsS0FBSyxXQUFXLEVBQUU7TUFDdEUsSUFBSSxPQUFPLFlBQVksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLENBQUMsV0FBVyxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUMvRSxHQUFHO0FBQ0g7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLEVBQUUsSUFBSSxZQUFZLEdBQUcsV0FBVyxHQUFHLGFBQWEsQ0FBQztNQUNqRCxFQUFFLElBQUksU0FBUyxDQUFDO01BQ2hCLEVBQUUsSUFBSSxZQUFZLEtBQUssWUFBWSxFQUFFO01BQ3JDLElBQUksU0FBUyxHQUFHLFlBQVksR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFlBQVksQ0FBQztNQUNwRCxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUMxQztNQUNBO01BQ0E7TUFDQSxFQUFFLFFBQVEsQ0FBQyxJQUFJO01BQ2YsSUFBSSxTQUFTLEtBQUssQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksU0FBUyxLQUFLLFNBQVMsQ0FBQztBQUM5RTtNQUNBLEVBQUUsSUFBSSxDQUFDLE9BQU8sSUFBSSxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksU0FBUyxJQUFJLENBQUMsRUFBRTtNQUN2RCxJQUFJLFFBQVEsQ0FBQyxHQUFHLEdBQUcsVUFBVSxLQUFLLEVBQUUsV0FBVyxFQUFFO01BQ2pELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDckMsTUFBTSxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLFNBQVM7TUFDNUMsVUFBVSxVQUFVLENBQUMsR0FBRyxDQUFDLEtBQUssR0FBRyxhQUFhLEVBQUUsV0FBVyxDQUFDO01BQzVELFVBQVUsV0FBVyxDQUFDO01BQ3RCLEtBQUssQ0FBQztNQUNOLEdBQUc7QUFDSDtNQUNBLEVBQUUsUUFBUSxDQUFDLGlCQUFpQixHQUFHLFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUN0RCxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksSUFBSSxTQUFTLEtBQUssQ0FBQyxFQUFFO01BQ3pCLE1BQU0sT0FBTyxDQUFDLENBQUM7TUFDZixLQUFLO01BQ0wsSUFBSSxJQUFJLE9BQU8sRUFBRTtNQUNqQixNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDdkQsS0FBSztNQUNMLElBQUksSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLElBQUksSUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO01BQzFCLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksVUFBVSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDekMsTUFBTSxJQUFJLEVBQUUsVUFBVSxLQUFLLFVBQVUsR0FBRyxPQUFPLEVBQUUsR0FBRyxhQUFhLENBQUMsQ0FBQyxFQUFFO01BQ3JFLFFBQVEsVUFBVSxFQUFFLENBQUM7TUFDckIsUUFBUTtNQUNSLFVBQVUsRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsUUFBUSxDQUFDLEtBQUssS0FBSztNQUNqRSxVQUFVLFVBQVUsS0FBSyxTQUFTO01BQ2xDLFVBQVU7TUFDVixPQUFPO01BQ1AsS0FBSyxDQUFDLENBQUM7TUFDUCxJQUFJLE9BQU8sVUFBVSxDQUFDO01BQ3RCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxRQUFRLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQ3pELElBQUksSUFBSSxTQUFTLEtBQUssQ0FBQyxJQUFJLE9BQU8sRUFBRTtNQUNwQyxNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDMUQsS0FBSztNQUNMO01BQ0EsSUFBSSxJQUFJLFNBQVMsS0FBSyxDQUFDLEVBQUU7TUFDekIsTUFBTSxPQUFPLElBQUksUUFBUSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQ3hDLEtBQUs7TUFDTCxJQUFJLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ3hELElBQUksSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO01BQ3BDLE1BQU0sT0FBTyxPQUFPLEVBQUUsR0FBRyxhQUFhLEVBQUU7TUFDeEMsUUFBUSxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7TUFDeEIsT0FBTztNQUNQLE1BQU0sSUFBSSxFQUFFLFVBQVUsR0FBRyxTQUFTLEVBQUU7TUFDcEMsUUFBUSxPQUFPLFlBQVksRUFBRSxDQUFDO01BQzlCLE9BQU87TUFDUCxNQUFNLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNqQyxNQUFNLElBQUksT0FBTyxJQUFJLElBQUksS0FBSyxjQUFjLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtNQUMzRCxRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLE9BQU87TUFDUCxNQUFNLElBQUksSUFBSSxLQUFLLFlBQVksRUFBRTtNQUNqQyxRQUFRLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEdBQUcsQ0FBQyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNwRSxPQUFPO01BQ1AsTUFBTSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ3RFLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLE9BQU8sUUFBUSxDQUFDO01BQ2xCLENBQUM7QUFDRDtNQUNBLFNBQVMsZ0JBQWdCLENBQUMsVUFBVSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUU7TUFDMUQsRUFBRSxJQUFJLFlBQVksR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDOUMsRUFBRSxZQUFZLENBQUMsaUJBQWlCLEdBQUcsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFO01BQzFELElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO0FBQ3hCO01BQ0EsSUFBSSxJQUFJLE9BQU8sRUFBRTtNQUNqQixNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDdkQsS0FBSztNQUNMLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksVUFBVSxDQUFDLFNBQVM7TUFDeEIsTUFBTSxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7TUFDM0csS0FBSyxDQUFDO01BQ04sSUFBSSxPQUFPLFVBQVUsQ0FBQztNQUN0QixHQUFHLENBQUM7TUFDSixFQUFFLFlBQVksQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDN0QsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksT0FBTyxFQUFFO01BQ2pCLE1BQU0sT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUMxRCxLQUFLO01BQ0wsSUFBSSxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNuRSxJQUFJLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztNQUN6QixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFDdEIsUUFBUSxPQUFPLFlBQVksRUFBRSxDQUFDO01BQzlCLE9BQU87TUFDUCxNQUFNLElBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUNqQyxNQUFNLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtNQUNyQixRQUFRLE9BQU8sSUFBSSxDQUFDO01BQ3BCLE9BQU87TUFDUCxNQUFNLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDN0IsTUFBTSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdkIsTUFBTSxJQUFJLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdkIsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsRUFBRTtNQUNwRCxRQUFRLFNBQVMsR0FBRyxLQUFLLENBQUM7TUFDMUIsUUFBUSxPQUFPLFlBQVksRUFBRSxDQUFDO01BQzlCLE9BQU87TUFDUCxNQUFNLE9BQU8sSUFBSSxLQUFLLGVBQWUsR0FBRyxJQUFJLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQy9FLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO01BQ0osRUFBRSxPQUFPLFlBQVksQ0FBQztNQUN0QixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtNQUNuRSxFQUFFLElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUM5QyxFQUFFLFlBQVksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDMUQsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksT0FBTyxFQUFFO01BQ2pCLE1BQU0sT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN2RCxLQUFLO01BQ0wsSUFBSSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUM7TUFDMUIsSUFBSSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7TUFDdkIsSUFBSSxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDNUMsTUFBTSxJQUFJLEVBQUUsVUFBVSxLQUFLLFVBQVUsR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUM1RSxRQUFRLFVBQVUsRUFBRSxDQUFDO01BQ3JCLFFBQVEsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLE9BQU8sR0FBRyxDQUFDLEdBQUcsVUFBVSxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztNQUM3RCxPQUFPO01BQ1AsS0FBSyxDQUFDLENBQUM7TUFDUCxJQUFJLE9BQU8sVUFBVSxDQUFDO01BQ3RCLEdBQUcsQ0FBQztNQUNKLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRTtNQUM3RCxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksSUFBSSxPQUFPLEVBQUU7TUFDakIsTUFBTSxPQUFPLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQzFELEtBQUs7TUFDTCxJQUFJLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ25FLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDO01BQ3hCLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO01BQ3BDLE1BQU0sSUFBSSxJQUFJLENBQUM7TUFDZixNQUFNLElBQUksQ0FBQyxDQUFDO01BQ1osTUFBTSxJQUFJLENBQUMsQ0FBQztNQUNaLE1BQU0sR0FBRztNQUNULFFBQVEsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUMvQixRQUFRLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtNQUN2QixVQUFVLElBQUksT0FBTyxJQUFJLElBQUksS0FBSyxjQUFjLEVBQUU7TUFDbEQsWUFBWSxPQUFPLElBQUksQ0FBQztNQUN4QixXQUFXO01BQ1gsVUFBVSxJQUFJLElBQUksS0FBSyxZQUFZLEVBQUU7TUFDckMsWUFBWSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ3RFLFdBQVc7TUFDWCxVQUFVLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ3hFLFNBQVM7TUFDVCxRQUFRLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDL0IsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3JCLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNyQixRQUFRLFFBQVEsS0FBSyxRQUFRLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO01BQ3pFLE9BQU8sUUFBUSxRQUFRLEVBQUU7TUFDekIsTUFBTSxPQUFPLElBQUksS0FBSyxlQUFlLEdBQUcsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztNQUMvRSxLQUFLLENBQUMsQ0FBQztNQUNQLEdBQUcsQ0FBQztNQUNKLEVBQUUsT0FBTyxZQUFZLENBQUM7TUFDdEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxhQUFhLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRTtNQUMzQyxFQUFFLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQzlDLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxVQUFVLENBQUM7TUFDMUIsS0FBSyxNQUFNLENBQUMsTUFBTSxDQUFDO01BQ25CLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFO01BQ3RCLE1BQU0sSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUM1QixRQUFRLENBQUMsR0FBRyxpQkFBaUI7TUFDN0IsWUFBWSxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7TUFDaEMsWUFBWSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUQsT0FBTyxNQUFNLElBQUksaUJBQWlCLEVBQUU7TUFDcEMsUUFBUSxDQUFDLEdBQUcsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQy9CLE9BQU87TUFDUCxNQUFNLE9BQU8sQ0FBQyxDQUFDO01BQ2YsS0FBSyxDQUFDO01BQ04sS0FBSyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ25EO01BQ0EsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzFCLElBQUksT0FBTyxVQUFVLENBQUM7TUFDdEIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzFCLElBQUksSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzdCLElBQUk7TUFDSixNQUFNLFNBQVMsS0FBSyxVQUFVO01BQzlCLE9BQU8saUJBQWlCLElBQUksT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQy9DLE9BQU8sU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUNyRCxNQUFNO01BQ04sTUFBTSxPQUFPLFNBQVMsQ0FBQztNQUN2QixLQUFLO01BQ0wsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLFNBQVMsR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN0QyxFQUFFLElBQUksaUJBQWlCLEVBQUU7TUFDekIsSUFBSSxTQUFTLEdBQUcsU0FBUyxDQUFDLFVBQVUsRUFBRSxDQUFDO01BQ3ZDLEdBQUcsTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFO01BQ3JDLElBQUksU0FBUyxHQUFHLFNBQVMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztNQUNyQyxHQUFHO01BQ0gsRUFBRSxTQUFTLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN0QyxFQUFFLFNBQVMsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsRUFBRSxHQUFHLEVBQUU7TUFDcEQsSUFBSSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7TUFDM0IsTUFBTSxJQUFJLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDO01BQzFCLE1BQU0sSUFBSSxJQUFJLEtBQUssU0FBUyxFQUFFO01BQzlCLFFBQVEsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDO01BQzFCLE9BQU87TUFDUCxLQUFLO01BQ0wsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ1IsRUFBRSxPQUFPLFNBQVMsQ0FBQztNQUNuQixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGNBQWMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRTtNQUNwRCxFQUFFLElBQUksWUFBWSxHQUFHLFlBQVksQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUM5QyxFQUFFLFlBQVksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDMUQsSUFBSSxJQUFJLE9BQU8sRUFBRTtNQUNqQixNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDdkQsS0FBSztNQUNMLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO01BQ3hCLElBQUksU0FBUyxRQUFRLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtNQUMxQyxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQ3JDLFFBQVEsSUFBSSxDQUFDLENBQUMsS0FBSyxJQUFJLFlBQVksR0FBRyxLQUFLLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQ2pFLFVBQVUsUUFBUSxDQUFDLENBQUMsRUFBRSxZQUFZLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDeEMsU0FBUyxNQUFNO01BQ2YsVUFBVSxVQUFVLEVBQUUsQ0FBQztNQUN2QixVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLFVBQVUsR0FBRyxDQUFDLEVBQUUsWUFBWSxDQUFDLEtBQUssS0FBSyxFQUFFO01BQzNFLFlBQVksT0FBTyxHQUFHLElBQUksQ0FBQztNQUMzQixXQUFXO01BQ1gsU0FBUztNQUNULFFBQVEsT0FBTyxDQUFDLE9BQU8sQ0FBQztNQUN4QixPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksUUFBUSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUM1QixJQUFJLE9BQU8sVUFBVSxDQUFDO01BQ3RCLEdBQUcsQ0FBQztNQUNKLEVBQUUsWUFBWSxDQUFDLGtCQUFrQixHQUFHLFVBQVUsSUFBSSxFQUFFLE9BQU8sRUFBRTtNQUM3RCxJQUFJLElBQUksT0FBTyxFQUFFO01BQ2pCLE1BQU0sT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUMxRCxLQUFLO01BQ0wsSUFBSSxJQUFJLFFBQVEsR0FBRyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN4RCxJQUFJLElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztNQUNuQixJQUFJLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztNQUN2QixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLE9BQU8sUUFBUSxFQUFFO01BQ3ZCLFFBQVEsSUFBSSxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ25DLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLEtBQUssRUFBRTtNQUNqQyxVQUFVLFFBQVEsR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7TUFDakMsVUFBVSxTQUFTO01BQ25CLFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDM0IsUUFBUSxJQUFJLElBQUksS0FBSyxlQUFlLEVBQUU7TUFDdEMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ25CLFNBQVM7TUFDVCxRQUFRLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDakUsVUFBVSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQy9CLFVBQVUsUUFBUSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2pELFNBQVMsTUFBTTtNQUNmLFVBQVUsT0FBTyxPQUFPLEdBQUcsSUFBSSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQzdFLFNBQVM7TUFDVCxPQUFPO01BQ1AsTUFBTSxPQUFPLFlBQVksRUFBRSxDQUFDO01BQzVCLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO01BQ0osRUFBRSxPQUFPLFlBQVksQ0FBQztNQUN0QixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGNBQWMsQ0FBQyxVQUFVLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtNQUNyRCxFQUFFLElBQUksTUFBTSxHQUFHLGVBQWUsQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUMzQyxFQUFFLE9BQU8sVUFBVTtNQUNuQixLQUFLLEtBQUssRUFBRTtNQUNaLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7TUFDcEYsS0FBSyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbkIsQ0FBQztBQUNEO01BQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsU0FBUyxFQUFFO01BQ2pELEVBQUUsSUFBSSxrQkFBa0IsR0FBRyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDcEQsRUFBRSxrQkFBa0IsQ0FBQyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDdkUsRUFBRSxrQkFBa0IsQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDaEUsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztNQUN2QixJQUFJLFVBQVUsQ0FBQyxTQUFTO01BQ3hCLE1BQU0sVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLFNBQVMsRUFBRSxVQUFVLEVBQUUsRUFBRSxRQUFRLENBQUMsS0FBSyxLQUFLO01BQzNGLFFBQVEsRUFBRSxDQUFDLENBQUMsRUFBRSxVQUFVLEVBQUUsRUFBRSxRQUFRLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtNQUNsRCxNQUFNLE9BQU87TUFDYixLQUFLLENBQUM7TUFDTixJQUFJLE9BQU8sVUFBVSxDQUFDO01BQ3RCLEdBQUcsQ0FBQztNQUNKLEVBQUUsa0JBQWtCLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQ25FLElBQUksSUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDbEUsSUFBSSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7TUFDdkIsSUFBSSxJQUFJLElBQUksQ0FBQztNQUNiLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO01BQ3BDLE1BQU0sSUFBSSxDQUFDLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFO01BQ25DLFFBQVEsSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztNQUMvQixRQUFRLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtNQUN2QixVQUFVLE9BQU8sSUFBSSxDQUFDO01BQ3RCLFNBQVM7TUFDVCxPQUFPO01BQ1AsTUFBTSxPQUFPLFVBQVUsR0FBRyxDQUFDO01BQzNCLFVBQVUsYUFBYSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxTQUFTLENBQUM7TUFDdEQsVUFBVSxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDOUQsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7TUFDSixFQUFFLE9BQU8sa0JBQWtCLENBQUM7TUFDNUIsQ0FBQztBQUNEO01BQ0EsU0FBUyxXQUFXLENBQUMsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUU7TUFDckQsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFO01BQ25CLElBQUksVUFBVSxHQUFHLGlCQUFpQixDQUFDO01BQ25DLEdBQUc7TUFDSCxFQUFFLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQzlDLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO01BQ2hCLEVBQUUsSUFBSSxPQUFPLEdBQUcsVUFBVTtNQUMxQixLQUFLLEtBQUssRUFBRTtNQUNaLEtBQUssR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7TUFDNUYsS0FBSyxRQUFRLEVBQUU7TUFDZixLQUFLLE9BQU8sRUFBRSxDQUFDO01BQ2YsRUFBRSxPQUFPO01BQ1QsS0FBSyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQzVFLEtBQUssT0FBTztNQUNaLE1BQU0saUJBQWlCO01BQ3ZCLFVBQVUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQzFCLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDbEMsV0FBVztNQUNYLFVBQVUsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQzFCLFlBQVksT0FBTyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM5QixXQUFXO01BQ1gsS0FBSyxDQUFDO01BQ04sRUFBRSxPQUFPLGlCQUFpQjtNQUMxQixNQUFNLFFBQVEsQ0FBQyxPQUFPLENBQUM7TUFDdkIsTUFBTSxTQUFTLENBQUMsVUFBVSxDQUFDO01BQzNCLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQztNQUN6QixNQUFNLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztNQUN0QixDQUFDO0FBQ0Q7TUFDQSxTQUFTLFVBQVUsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRTtNQUNwRCxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUU7TUFDbkIsSUFBSSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7TUFDbkMsR0FBRztNQUNILEVBQUUsSUFBSSxNQUFNLEVBQUU7TUFDZCxJQUFJLElBQUksS0FBSyxHQUFHLFVBQVU7TUFDMUIsT0FBTyxLQUFLLEVBQUU7TUFDZCxPQUFPLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ3JFLE9BQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLFFBQVEsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztNQUN4RixJQUFJLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM3QixHQUFHO01BQ0gsRUFBRSxPQUFPLFVBQVUsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsUUFBUSxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQy9GLENBQUM7QUFDRDtNQUNBLFNBQVMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQ3RDLEVBQUUsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUM5QjtNQUNBO01BQ0EsRUFBRTtNQUNGLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDeEUsSUFBSSxJQUFJLEdBQUcsQ0FBQztNQUNaLElBQUk7TUFDSixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGNBQWMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7TUFDeEQsRUFBRSxJQUFJLFdBQVcsR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDMUMsRUFBRSxJQUFJLEtBQUssR0FBRyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDdkUsRUFBRSxXQUFXLENBQUMsSUFBSSxHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ3hEO01BQ0E7TUFDQSxFQUFFLFdBQVcsQ0FBQyxTQUFTLEdBQUcsVUFBVSxFQUFFLEVBQUUsT0FBTyxFQUFFO01BQ2pEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0EsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUM1RCxJQUFJLElBQUksSUFBSSxDQUFDO01BQ2IsSUFBSSxJQUFJLFVBQVUsR0FBRyxDQUFDLENBQUM7TUFDdkIsSUFBSSxPQUFPLENBQUMsQ0FBQyxJQUFJLEdBQUcsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRTtNQUMzQyxNQUFNLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO01BQ3hELFFBQVEsTUFBTTtNQUNkLE9BQU87TUFDUCxLQUFLO01BQ0wsSUFBSSxPQUFPLFVBQVUsQ0FBQztNQUN0QixHQUFHLENBQUM7TUFDSixFQUFFLFdBQVcsQ0FBQyxrQkFBa0IsR0FBRyxVQUFVLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDNUQsSUFBSSxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsR0FBRztNQUM3QixNQUFNLFVBQVUsQ0FBQyxFQUFFLEVBQUUsUUFBUSxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRTtNQUM1RixLQUFLLENBQUM7TUFDTixJQUFJLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztNQUN2QixJQUFJLElBQUksTUFBTSxHQUFHLEtBQUssQ0FBQztNQUN2QixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLElBQUksS0FBSyxDQUFDO01BQ2hCLE1BQU0sSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNuQixRQUFRLEtBQUssR0FBRyxTQUFTLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDakUsUUFBUSxNQUFNLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNySCxPQUFPO01BQ1AsTUFBTSxJQUFJLE1BQU0sRUFBRTtNQUNsQixRQUFRLE9BQU8sWUFBWSxFQUFFLENBQUM7TUFDOUIsT0FBTztNQUNQLE1BQU0sT0FBTyxhQUFhO01BQzFCLFFBQVEsSUFBSTtNQUNaLFFBQVEsVUFBVSxFQUFFO01BQ3BCLFFBQVEsTUFBTSxDQUFDLEtBQUs7TUFDcEIsVUFBVSxJQUFJO01BQ2QsVUFBVSxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQztNQUNyRCxTQUFTO01BQ1QsT0FBTyxDQUFDO01BQ1IsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7TUFDSixFQUFFLE9BQU8sV0FBVyxDQUFDO01BQ3JCLENBQUM7QUFDRDtNQUNBO0FBQ0E7TUFDQSxTQUFTLEtBQUssQ0FBQyxJQUFJLEVBQUUsR0FBRyxFQUFFO01BQzFCLEVBQUUsT0FBTyxJQUFJLEtBQUssR0FBRyxHQUFHLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDekUsQ0FBQztBQUNEO01BQ0EsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFO01BQzlCLEVBQUUsSUFBSSxLQUFLLEtBQUssTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQy9CLElBQUksTUFBTSxJQUFJLFNBQVMsQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUMsQ0FBQztNQUMzRCxHQUFHO01BQ0gsQ0FBQztBQUNEO01BQ0EsU0FBUyxlQUFlLENBQUMsVUFBVSxFQUFFO01BQ3JDLEVBQUUsT0FBTyxPQUFPLENBQUMsVUFBVSxDQUFDO01BQzVCLE1BQU0sZUFBZTtNQUNyQixNQUFNLFNBQVMsQ0FBQyxVQUFVLENBQUM7TUFDM0IsTUFBTSxpQkFBaUI7TUFDdkIsTUFBTSxhQUFhLENBQUM7TUFDcEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxZQUFZLENBQUMsVUFBVSxFQUFFO01BQ2xDLEVBQUUsT0FBTyxNQUFNLENBQUMsTUFBTTtNQUN0QixJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztNQUN4QixRQUFRLFFBQVE7TUFDaEIsUUFBUSxTQUFTLENBQUMsVUFBVSxDQUFDO01BQzdCLFFBQVEsVUFBVTtNQUNsQixRQUFRLE1BQU07TUFDZCxNQUFNLFNBQVM7TUFDZixHQUFHLENBQUM7TUFDSixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGtCQUFrQixHQUFHO01BQzlCLEVBQUUsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtNQUM5QixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7TUFDN0IsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO01BQ2hDLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztNQUNILEVBQUUsT0FBTyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDOUMsQ0FBQztBQUNEO01BQ0EsU0FBUyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQ2pDLEVBQUUsSUFBSSxDQUFDLEtBQUssU0FBUyxJQUFJLENBQUMsS0FBSyxTQUFTLEVBQUU7TUFDMUMsSUFBSSxPQUFPLENBQUMsQ0FBQztNQUNiLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxDQUFDLEtBQUssU0FBUyxFQUFFO01BQ3ZCLElBQUksT0FBTyxDQUFDLENBQUM7TUFDYixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksQ0FBQyxLQUFLLFNBQVMsRUFBRTtNQUN2QixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7TUFDZCxHQUFHO0FBQ0g7TUFDQSxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDcEMsQ0FBQztBQUNEO01BQ0EsU0FBUyxPQUFPLENBQUMsR0FBRyxFQUFFLE1BQU0sRUFBRTtNQUM5QixFQUFFLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxDQUFDO01BQ3ZCLEVBQUUsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQztNQUM3QyxFQUFFLElBQUksTUFBTSxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzlCLEVBQUUsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLEdBQUcsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUNuQyxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDO01BQ2xDLEdBQUc7TUFDSCxFQUFFLE9BQU8sTUFBTSxDQUFDO01BQ2hCLENBQUM7QUFDRDtNQUNBLFNBQVMsU0FBUyxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUU7TUFDckMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO01BQzdDLENBQUM7QUFDRDtNQUNBLFNBQVMsaUJBQWlCLENBQUMsSUFBSSxFQUFFO01BQ2pDLEVBQUUsU0FBUztNQUNYLElBQUksSUFBSSxLQUFLLFFBQVE7TUFDckIsSUFBSSxtREFBbUQ7TUFDdkQsR0FBRyxDQUFDO01BQ0osQ0FBQztBQUNEO01BQ0EsU0FBUyxhQUFhLENBQUMsT0FBTyxFQUFFO01BQ2hDLEVBQUUsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO01BQzNELElBQUksT0FBTyxPQUFPLENBQUM7TUFDbkIsR0FBRztNQUNILEVBQUUsSUFBSSxTQUFTLENBQUMsT0FBTyxDQUFDLEVBQUU7TUFDMUIsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztNQUM3QixHQUFHO01BQ0gsRUFBRSxNQUFNLElBQUksU0FBUztNQUNyQixJQUFJLHlEQUF5RCxHQUFHLE9BQU87TUFDdkUsR0FBRyxDQUFDO01BQ0osQ0FBQztBQUNEO01BQ0EsSUFBSSxRQUFRLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7QUFDekM7TUFDQSxTQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUU7TUFDOUI7TUFDQSxFQUFFO01BQ0YsSUFBSSxDQUFDLEtBQUs7TUFDVixJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVE7TUFDN0IsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGlCQUFpQjtNQUM5QyxJQUFJO01BQ0osSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDM0MsRUFBRSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7TUFDdEIsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO0FBQ0g7TUFDQTtNQUNBLEVBQUUsSUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO01BQzFCLEVBQUUsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUMvQyxFQUFFLE9BQU8sU0FBUyxLQUFLLElBQUksRUFBRTtNQUM3QixJQUFJLFdBQVcsR0FBRyxTQUFTLENBQUM7TUFDNUIsSUFBSSxTQUFTLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUNuRCxHQUFHO01BQ0gsRUFBRSxPQUFPLFdBQVcsS0FBSyxLQUFLLENBQUM7TUFDL0IsQ0FBQztBQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxTQUFTLGVBQWUsQ0FBQyxLQUFLLEVBQUU7TUFDaEMsRUFBRTtNQUNGLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUTtNQUM3QixLQUFLLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN4RSxJQUFJO01BQ0osQ0FBQztBQUNEO01BQ0EsU0FBUyxXQUFXLENBQUMsS0FBSyxFQUFFO01BQzVCLEVBQUUsSUFBSTtNQUNOLElBQUksT0FBTyxPQUFPLEtBQUssS0FBSyxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDN0UsR0FBRyxDQUFDLE9BQU8sWUFBWSxFQUFFO01BQ3pCLElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2pDLEdBQUc7TUFDSCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFO01BQzlCLEVBQUUsT0FBTyxXQUFXLENBQUMsVUFBVSxDQUFDO01BQ2hDLE1BQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7TUFDekIsTUFBTSxlQUFlLENBQUMsVUFBVSxDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDMUUsQ0FBQztBQUNEO01BQ0EsU0FBUyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUU7TUFDM0MsRUFBRSxPQUFPLFdBQVcsQ0FBQyxVQUFVLENBQUM7TUFDaEMsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUM7TUFDdEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDO01BQzNCLE1BQU0sV0FBVztNQUNqQixNQUFNLE9BQU8sVUFBVSxDQUFDLEdBQUcsS0FBSyxVQUFVO01BQzFDLE1BQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUM7TUFDekIsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDdEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFO01BQzNCLEVBQUUsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzNCLElBQUksT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDekIsR0FBRztNQUNILEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDO01BQ2QsRUFBRSxLQUFLLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtNQUN4QixJQUFJLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUU7TUFDeEMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzFCLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxPQUFPLEVBQUUsQ0FBQztNQUNaLENBQUM7QUFDRDtNQUNBLFNBQVMsTUFBTSxDQUFDLFVBQVUsRUFBRSxHQUFHLEVBQUU7TUFDakMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFO01BQ3BDLElBQUksTUFBTSxJQUFJLFNBQVM7TUFDdkIsTUFBTSwwQ0FBMEMsR0FBRyxVQUFVO01BQzdELEtBQUssQ0FBQztNQUNOLEdBQUc7TUFDSCxFQUFFLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFO01BQy9CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7TUFDNUIsTUFBTSxNQUFNLElBQUksU0FBUztNQUN6QixRQUFRLDBEQUEwRCxHQUFHLFVBQVU7TUFDL0UsT0FBTyxDQUFDO01BQ1IsS0FBSztNQUNMLElBQUksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2xDLEdBQUc7TUFDSCxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsRUFBRTtNQUM3QyxJQUFJLE9BQU8sVUFBVSxDQUFDO01BQ3RCLEdBQUc7TUFDSCxFQUFFLElBQUksY0FBYyxHQUFHLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztNQUMvQyxFQUFFLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsRUFBRTtNQUNyQyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ2xDLEdBQUcsTUFBTTtNQUNULElBQUksT0FBTyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDL0IsR0FBRztNQUNILEVBQUUsT0FBTyxjQUFjLENBQUM7TUFDeEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxHQUFHLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUU7TUFDckMsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxFQUFFO01BQ3BDLElBQUksTUFBTSxJQUFJLFNBQVM7TUFDdkIsTUFBTSwwQ0FBMEMsR0FBRyxVQUFVO01BQzdELEtBQUssQ0FBQztNQUNOLEdBQUc7TUFDSCxFQUFFLElBQUksV0FBVyxDQUFDLFVBQVUsQ0FBQyxFQUFFO01BQy9CLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUU7TUFDekIsTUFBTSxNQUFNLElBQUksU0FBUztNQUN6QixRQUFRLHVEQUF1RCxHQUFHLFVBQVU7TUFDNUUsT0FBTyxDQUFDO01BQ1IsS0FBSztNQUNMLElBQUksT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztNQUN0QyxHQUFHO01BQ0gsRUFBRSxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEtBQUssS0FBSyxVQUFVLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDekUsSUFBSSxPQUFPLFVBQVUsQ0FBQztNQUN0QixHQUFHO01BQ0gsRUFBRSxJQUFJLGNBQWMsR0FBRyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDL0MsRUFBRSxjQUFjLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQzlCLEVBQUUsT0FBTyxjQUFjLENBQUM7TUFDeEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxVQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO01BQy9ELEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtNQUNoQixJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUM7TUFDMUIsSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDO01BQzVCLEdBQUc7TUFDSCxFQUFFLElBQUksWUFBWSxHQUFHLGNBQWM7TUFDbkMsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDO01BQzNCLElBQUksVUFBVTtNQUNkLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQztNQUMxQixJQUFJLENBQUM7TUFDTCxJQUFJLFdBQVc7TUFDZixJQUFJLE9BQU87TUFDWCxHQUFHLENBQUM7TUFDSixFQUFFLE9BQU8sWUFBWSxLQUFLLE9BQU8sR0FBRyxXQUFXLEdBQUcsWUFBWSxDQUFDO01BQy9ELENBQUM7QUFDRDtNQUNBLFNBQVMsY0FBYztNQUN2QixFQUFFLFdBQVc7TUFDYixFQUFFLFFBQVE7TUFDVixFQUFFLE9BQU87TUFDVCxFQUFFLENBQUM7TUFDSCxFQUFFLFdBQVc7TUFDYixFQUFFLE9BQU87TUFDVCxFQUFFO01BQ0YsRUFBRSxJQUFJLFNBQVMsR0FBRyxRQUFRLEtBQUssT0FBTyxDQUFDO01BQ3ZDLEVBQUUsSUFBSSxDQUFDLEtBQUssT0FBTyxDQUFDLE1BQU0sRUFBRTtNQUM1QixJQUFJLElBQUksYUFBYSxHQUFHLFNBQVMsR0FBRyxXQUFXLEdBQUcsUUFBUSxDQUFDO01BQzNELElBQUksSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO01BQzFDLElBQUksT0FBTyxRQUFRLEtBQUssYUFBYSxHQUFHLFFBQVEsR0FBRyxRQUFRLENBQUM7TUFDNUQsR0FBRztNQUNILEVBQUUsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsRUFBRTtNQUNoRCxJQUFJLE1BQU0sSUFBSSxTQUFTO01BQ3ZCLE1BQU0seURBQXlEO01BQy9ELFFBQVEsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQztNQUM1QyxRQUFRLEtBQUs7TUFDYixRQUFRLFFBQVE7TUFDaEIsS0FBSyxDQUFDO01BQ04sR0FBRztNQUNILEVBQUUsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3ZCLEVBQUUsSUFBSSxZQUFZLEdBQUcsU0FBUyxHQUFHLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN2RSxFQUFFLElBQUksV0FBVyxHQUFHLGNBQWM7TUFDbEMsSUFBSSxZQUFZLEtBQUssT0FBTyxHQUFHLFdBQVcsR0FBRyxXQUFXLENBQUMsWUFBWSxDQUFDO01BQ3RFLElBQUksWUFBWTtNQUNoQixJQUFJLE9BQU87TUFDWCxJQUFJLENBQUMsR0FBRyxDQUFDO01BQ1QsSUFBSSxXQUFXO01BQ2YsSUFBSSxPQUFPO01BQ1gsR0FBRyxDQUFDO01BQ0osRUFBRSxPQUFPLFdBQVcsS0FBSyxZQUFZO01BQ3JDLE1BQU0sUUFBUTtNQUNkLE1BQU0sV0FBVyxLQUFLLE9BQU87TUFDN0IsTUFBTSxNQUFNLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQztNQUMzQixNQUFNLEdBQUc7TUFDVCxRQUFRLFNBQVMsSUFBSSxXQUFXLEdBQUcsUUFBUSxFQUFFLEdBQUcsRUFBRSxJQUFJLFFBQVE7TUFDOUQsUUFBUSxHQUFHO01BQ1gsUUFBUSxXQUFXO01BQ25CLE9BQU8sQ0FBQztNQUNSLENBQUM7QUFDRDtNQUNBLFNBQVMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO01BQzdDLEVBQUUsT0FBTyxVQUFVLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ2pGLENBQUM7QUFDRDtNQUNBLFNBQVMsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUU7TUFDM0IsRUFBRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ25DLENBQUM7QUFDRDtNQUNBLFNBQVMsUUFBUSxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7TUFDdkMsRUFBRSxPQUFPLFVBQVUsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUMxRSxDQUFDO0FBQ0Q7TUFDQSxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUU7TUFDM0IsRUFBRSxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDakMsQ0FBQztBQUNEO01BQ0EsU0FBUyxRQUFRLENBQUMsVUFBVSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO01BQ3pELEVBQUUsT0FBTyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQzdELENBQUM7QUFDRDtNQUNBLFNBQVMsTUFBTSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxFQUFFO01BQzNDLEVBQUUsT0FBTyxTQUFTLENBQUMsTUFBTSxLQUFLLENBQUM7TUFDL0IsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDO01BQ2YsTUFBTSxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDaEQsQ0FBQztBQUNEO01BQ0EsU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLEVBQUU7TUFDakQsRUFBRSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN6RCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLE9BQU8sR0FBRztNQUNuQixFQUFFLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztNQUN6QyxFQUFFLFFBQVEsR0FBRyxFQUFFLEdBQUcsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLFNBQVMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNsRDtNQUNBLEVBQUUsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDekMsQ0FBQztBQUNEO01BQ0EsU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFO01BQzdCLEVBQUUsSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztNQUM3QyxFQUFFLFFBQVEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLEVBQUUsR0FBRyxHQUFHLENBQUMsRUFBRSxDQUFDO0FBQzFEO01BQ0EsRUFBRSxJQUFJLE9BQU8sTUFBTSxLQUFLLFVBQVUsRUFBRTtNQUNwQyxJQUFJLE1BQU0sSUFBSSxTQUFTLENBQUMsMkJBQTJCLEdBQUcsTUFBTSxDQUFDLENBQUM7TUFDOUQsR0FBRztNQUNILEVBQUUsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ2pELENBQUM7QUFDRDtNQUNBLFNBQVMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7TUFDN0QsRUFBRSxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7TUFDakIsRUFBRSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsV0FBVyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUNsRCxJQUFJLElBQUksWUFBWSxHQUFHLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUN4RCxJQUFJLElBQUksWUFBWSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7TUFDakMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO01BQy9CLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzFCLElBQUksT0FBTyxVQUFVLENBQUM7TUFDdEIsR0FBRztNQUNILEVBQUU7TUFDRixJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLEtBQUssQ0FBQztNQUNqQyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVM7TUFDekIsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUM7TUFDdEIsSUFBSTtNQUNKLElBQUksT0FBTyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzVDLEdBQUc7TUFDSCxFQUFFLE9BQU8sVUFBVSxDQUFDLGFBQWEsQ0FBQyxVQUFVLFVBQVUsRUFBRTtNQUN4RCxJQUFJLElBQUksbUJBQW1CLEdBQUcsTUFBTTtNQUNwQyxRQUFRLFVBQVUsS0FBSyxFQUFFLEdBQUcsRUFBRTtNQUM5QixVQUFVLFFBQVEsQ0FBQyxVQUFVLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLE1BQU0sRUFBRSxFQUFFLE9BQU8sTUFBTSxLQUFLLE9BQU8sR0FBRyxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUMsRUFBRTtNQUNsSSxXQUFXLENBQUM7TUFDWixTQUFTO01BQ1QsUUFBUSxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUU7TUFDOUIsVUFBVSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztNQUNyQyxTQUFTLENBQUM7TUFDVixJQUFJLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQzlDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO01BQzdDLEtBQUs7TUFDTCxHQUFHLENBQUMsQ0FBQztNQUNMLENBQUM7QUFDRDtNQUNBLFNBQVMsS0FBSyxDQUFDLFVBQVUsRUFBRTtNQUMzQixFQUFFLElBQUksT0FBTyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDL0MsRUFBRSxRQUFRLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxPQUFPLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUM1RDtNQUNBLEVBQUUsT0FBTyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDL0MsQ0FBQztBQXNCRDtNQUNBLFNBQVMsb0JBQW9CLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7TUFDM0QsRUFBRSxPQUFPLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDdkUsQ0FBQztBQUNEO01BQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRTtNQUN2RCxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLEVBQUU7TUFDcEMsSUFBSSxNQUFNLElBQUksU0FBUztNQUN2QixNQUFNLDhDQUE4QyxHQUFHLFVBQVU7TUFDakUsS0FBSyxDQUFDO01BQ04sR0FBRztNQUNILEVBQUUsSUFBSSxXQUFXLENBQUMsVUFBVSxDQUFDLEVBQUU7TUFDL0IsSUFBSSxPQUFPLE9BQU8sTUFBTSxLQUFLLFVBQVUsSUFBSSxVQUFVLENBQUMsU0FBUztNQUMvRCxRQUFRLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsQ0FBQztNQUM1RSxRQUFRLFVBQVUsQ0FBQyxLQUFLO01BQ3hCLFFBQVEsVUFBVSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQztNQUNuRCxRQUFRLFVBQVUsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNyRCxHQUFHO01BQ0gsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO01BQzFDLEVBQUUsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDO01BQzFCLEVBQUUsSUFBSSxVQUFVLEdBQUcsT0FBTyxHQUFHLGlCQUFpQixHQUFHLGVBQWUsQ0FBQztNQUNqRSxFQUFFLElBQUksU0FBUyxHQUFHLE9BQU87TUFDekIsTUFBTSxVQUFVLEtBQUssRUFBRTtNQUN2QjtNQUNBLFFBQVEsSUFBSSxNQUFNLEtBQUssVUFBVSxFQUFFO01BQ25DLFVBQVUsTUFBTSxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN2QyxTQUFTO01BQ1QsUUFBUSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzNCLE9BQU87TUFDUCxNQUFNLFVBQVUsS0FBSyxFQUFFLEdBQUcsRUFBRTtNQUM1QixRQUFRLElBQUksTUFBTSxHQUFHLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQ3RELFFBQVEsSUFBSSxPQUFPO01BQ25CLFVBQVUsTUFBTSxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7TUFDckUsUUFBUSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sS0FBSyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUU7TUFDaEQ7TUFDQSxVQUFVLElBQUksTUFBTSxLQUFLLFVBQVUsRUFBRTtNQUNyQyxZQUFZLE1BQU0sR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDekMsV0FBVztNQUNYLFVBQVUsTUFBTSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztNQUNoQyxTQUFTO01BQ1QsT0FBTyxDQUFDO01BQ1IsRUFBRSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUMzQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7TUFDOUMsR0FBRztNQUNILEVBQUUsT0FBTyxNQUFNLENBQUM7TUFDaEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxjQUFjLENBQUMsTUFBTSxFQUFFO01BQ2hDLEVBQUUsU0FBUyxVQUFVLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLEVBQUU7TUFDL0MsSUFBSSxPQUFPLGVBQWUsQ0FBQyxRQUFRLENBQUM7TUFDcEMsTUFBTSxlQUFlLENBQUMsUUFBUSxDQUFDO01BQy9CLE1BQU0sWUFBWSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUM7TUFDdEMsUUFBUSxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLENBQUM7TUFDMUQsUUFBUSxNQUFNO01BQ2QsUUFBUSxNQUFNLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxHQUFHLENBQUM7TUFDdkMsUUFBUSxRQUFRLENBQUM7TUFDakIsR0FBRztNQUNILEVBQUUsT0FBTyxVQUFVLENBQUM7TUFDcEIsQ0FBQztBQUNEO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBLFNBQVMsWUFBWSxDQUFDLGdCQUFnQixFQUFFLGdCQUFnQixFQUFFO01BQzFELEVBQUUsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUM7TUFDckMsRUFBRSxJQUFJLE1BQU0sR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztNQUNyQztNQUNBO01BQ0EsRUFBRTtNQUNGLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxLQUFLLFNBQVMsQ0FBQyxNQUFNLENBQUM7TUFDM0MsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQztNQUN2QyxJQUFJO01BQ0osQ0FBQztBQUNEO01BQ0EsU0FBUyxTQUFTLEdBQUc7TUFDckIsRUFBRSxJQUFJLEtBQUssR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7TUFDekMsRUFBRSxRQUFRLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDbEQ7TUFDQSxFQUFFLE9BQU8sb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQzNDLENBQUM7QUFDRDtNQUNBLFNBQVMsYUFBYSxDQUFDLE1BQU0sRUFBRTtNQUMvQixFQUFFLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDN0MsRUFBRSxRQUFRLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUMxRDtNQUNBLEVBQUUsT0FBTyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ25ELENBQUM7QUFDRDtNQUNBLFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRTtNQUMxQixFQUFFLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDN0MsRUFBRSxRQUFRLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUMxRDtNQUNBLEVBQUUsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ3BHLENBQUM7QUFDRDtNQUNBLFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRTtNQUM5QixFQUFFLElBQUksS0FBSyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDN0MsRUFBRSxRQUFRLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQztBQUMxRDtNQUNBLEVBQUUsT0FBTyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsRUFBRSxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sb0JBQW9CLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLEVBQUU7TUFDdEcsR0FBRyxDQUFDO01BQ0osQ0FBQztBQUNEO01BQ0EsU0FBUyxhQUFhLENBQUMsRUFBRSxFQUFFO01BQzNCLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO01BQ2pDLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQ2QsRUFBRSxPQUFPLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDN0UsQ0FBQztBQUNEO01BQ0EsU0FBUyxTQUFTLEdBQUc7TUFDckIsRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDO01BQ25FLENBQUM7QUFDRDtNQUNBLFNBQVMsV0FBVyxHQUFHO01BQ3ZCLEVBQUUsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7TUFDOUIsQ0FBQztBQUNEO01BQ0EsU0FBUyxVQUFVLEdBQUc7TUFDdEIsRUFBRSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7TUFDeEIsQ0FBQztBQUNEO01BQ0EsSUFBSSxHQUFHLGlCQUFpQixVQUFVLGVBQWUsRUFBRTtNQUNuRCxFQUFFLFNBQVMsR0FBRyxDQUFDLEtBQUssRUFBRTtNQUN0QixJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUztNQUNoRCxRQUFRLFFBQVEsRUFBRTtNQUNsQixRQUFRLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7TUFDekMsUUFBUSxLQUFLO01BQ2IsUUFBUSxRQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLEVBQUU7TUFDaEQsVUFBVSxJQUFJLElBQUksR0FBRyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDNUMsVUFBVSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdkMsVUFBVSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDbEUsU0FBUyxDQUFDLENBQUM7TUFDWCxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssZUFBZSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsZUFBZSxDQUFDO01BQ3pELEVBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLGVBQWUsSUFBSSxlQUFlLENBQUMsU0FBUyxFQUFFLENBQUM7TUFDaEYsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDbEM7TUFDQSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsU0FBUyxFQUFFLElBQUk7TUFDMUIsSUFBSSxJQUFJLFNBQVMsR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7TUFDL0MsSUFBSSxRQUFRLEdBQUcsRUFBRSxHQUFHLFNBQVMsRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDeEQ7TUFDQSxJQUFJLE9BQU8sUUFBUSxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxFQUFFO01BQ25ELE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUNwRCxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxTQUFTLENBQUMsTUFBTSxFQUFFO01BQ3ZDLFVBQVUsTUFBTSxJQUFJLEtBQUssQ0FBQyx5QkFBeUIsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwRSxTQUFTO01BQ1QsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDaEQsT0FBTztNQUNQLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxJQUFJO01BQ2hELElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQztNQUN6QyxHQUFHLENBQUM7QUFDSjtNQUNBO0FBQ0E7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUU7TUFDcEQsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLO01BQ3JCLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsV0FBVyxDQUFDO01BQ3BELFFBQVEsV0FBVyxDQUFDO01BQ3BCLEdBQUcsQ0FBQztBQUNKO01BQ0E7QUFDQTtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUMxQyxJQUFJLE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDakMsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLENBQUMsRUFBRTtNQUM3QyxJQUFJLE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDdkMsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLElBQUksRUFBRTtNQUN0RCxJQUFJLElBQUksVUFBVSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QztNQUNBLElBQUksSUFBSSxVQUFVLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUMvQixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7QUFDTDtNQUNBLElBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxFQUFFO01BQzdDLE1BQU0sVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEdBQUcsRUFBRSxFQUFFLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNyRSxLQUFLLENBQUMsQ0FBQztNQUNQLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxTQUFTLEtBQUssSUFBSTtNQUMxQyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7TUFDekIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFDeEIsTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztNQUNwQixNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3hCLE1BQU0sSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDOUIsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztNQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE9BQU8sUUFBUSxFQUFFLENBQUM7TUFDdEIsR0FBRyxDQUFDO0FBQ0o7TUFDQTtBQUNBO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksRUFBRSxVQUFVLEVBQUU7TUFDbEQ7TUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztNQUNyRCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRTtNQUM5RDtNQUNBLElBQUksT0FBTyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUM3RCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtNQUNyRCxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxFQUFFO01BQzdDLE1BQU0sR0FBRyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUU7TUFDeEMsUUFBUSxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7TUFDakUsT0FBTyxDQUFDLENBQUM7TUFDVCxLQUFLLENBQUMsQ0FBQztNQUNQLEdBQUcsQ0FBQztBQUNKO01BQ0E7QUFDQTtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtNQUNqRSxJQUFJLE9BQU8sSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNoRCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUM3RCxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUs7TUFDZCxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxFQUFFO01BQzFDLFFBQVEsVUFBVSxFQUFFLENBQUM7TUFDckIsUUFBUSxPQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDO01BQ2hELE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNsQixJQUFJLE9BQU8sVUFBVSxDQUFDO01BQ3RCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxPQUFPLEVBQUU7TUFDakUsSUFBSSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ3BDLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtNQUNsQixNQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7TUFDM0IsUUFBUSxPQUFPLFFBQVEsRUFBRSxDQUFDO01BQzFCLE9BQU87TUFDUCxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO01BQy9CLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7TUFDN0IsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNoRSxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxHQUFHLENBQUM7TUFDYixDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztBQUNwQjtNQUNBLEdBQUcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ2xCO01BQ0EsSUFBSSxZQUFZLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQztNQUNqQyxZQUFZLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDO01BQ25DLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDO01BQzNDLFlBQVksQ0FBQyxTQUFTLEdBQUcsWUFBWSxDQUFDLFNBQVMsQ0FBQztNQUNoRCxZQUFZLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztNQUMzQixZQUFZLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO01BQ3pELFlBQVksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO01BQzdCLFlBQVksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO01BQ2pDLFlBQVksQ0FBQyxLQUFLLEdBQUcsWUFBWSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUM7TUFDbkQsWUFBWSxDQUFDLFNBQVMsR0FBRyxXQUFXLENBQUM7TUFDckMsWUFBWSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7TUFDbkMsWUFBWSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7TUFDM0MsWUFBWSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7TUFDL0IsWUFBWSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7TUFDdkMsWUFBWSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7TUFDM0MsWUFBWSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7TUFDckMsWUFBWSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7TUFDdkMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsWUFBWSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7TUFDdkUsWUFBWSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsVUFBVSxNQUFNLEVBQUUsR0FBRyxFQUFFO01BQzNELEVBQUUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwQyxDQUFDLENBQUM7TUFDRixZQUFZLENBQUMscUJBQXFCLENBQUMsR0FBRyxVQUFVLEdBQUcsRUFBRTtNQUNyRCxFQUFFLE9BQU8sR0FBRyxDQUFDLFdBQVcsRUFBRSxDQUFDO01BQzNCLENBQUMsQ0FBQztBQUNGO01BQ0E7QUFDQTtNQUNBLElBQUksWUFBWSxHQUFHLFNBQVMsWUFBWSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7TUFDM0QsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztNQUN6QixFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO01BQ3pCLENBQUMsQ0FBQztBQUNGO01BQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFO01BQzdFLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUM3QixFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDekQsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDakMsTUFBTSxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM1QixLQUFLO01BQ0wsR0FBRztNQUNILEVBQUUsT0FBTyxXQUFXLENBQUM7TUFDckIsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxZQUFZLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUU7TUFDL0csRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLEtBQUssT0FBTyxDQUFDO0FBQ2xDO01BQ0EsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO01BQzdCLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO01BQ2QsRUFBRSxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO01BQzNCLEVBQUUsT0FBTyxHQUFHLEdBQUcsR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO01BQzNCLElBQUksSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO01BQ2xDLE1BQU0sTUFBTTtNQUNaLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxJQUFJLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0FBQ3pCO01BQ0EsRUFBRSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssS0FBSyxHQUFHLE9BQU8sRUFBRTtNQUNwRCxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO01BQ25CLEVBQUUsQ0FBQyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hEO01BQ0EsRUFBRSxJQUFJLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUN2QyxJQUFJLE9BQU87TUFDWCxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLE1BQU0sSUFBSSxrQkFBa0IsRUFBRTtNQUNuRSxJQUFJLE9BQU8sV0FBVyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ3JELEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxVQUFVLEdBQUcsT0FBTyxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDO01BQ3ZELEVBQUUsSUFBSSxVQUFVLEdBQUcsVUFBVSxHQUFHLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0Q7TUFDQSxFQUFFLElBQUksTUFBTSxFQUFFO01BQ2QsSUFBSSxJQUFJLE9BQU8sRUFBRTtNQUNqQixNQUFNLEdBQUcsS0FBSyxHQUFHLEdBQUcsQ0FBQztNQUNyQixVQUFVLFVBQVUsQ0FBQyxHQUFHLEVBQUU7TUFDMUIsV0FBVyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7TUFDL0MsS0FBSyxNQUFNO01BQ1gsTUFBTSxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDckMsS0FBSztNQUNMLEdBQUcsTUFBTTtNQUNULElBQUksVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQ2xDLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxVQUFVLEVBQUU7TUFDbEIsSUFBSSxJQUFJLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztNQUM5QixJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxJQUFJLFlBQVksQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7TUFDL0MsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxJQUFJLGlCQUFpQixHQUFHLFNBQVMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7TUFDM0UsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztNQUN6QixFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO01BQ3ZCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7TUFDckIsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRTtNQUNsRixFQUFFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtNQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDeEIsR0FBRztNQUNILEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxPQUFPLEdBQUcsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQztNQUN0RSxFQUFFLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDM0IsRUFBRSxPQUFPLENBQUMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDO01BQzdCLE1BQU0sV0FBVztNQUNqQixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUc7TUFDbEQsUUFBUSxLQUFLLEdBQUcsS0FBSztNQUNyQixRQUFRLE9BQU87TUFDZixRQUFRLEdBQUc7TUFDWCxRQUFRLFdBQVc7TUFDbkIsT0FBTyxDQUFDO01BQ1IsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTtNQUNwSCxFQUFFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtNQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDeEIsR0FBRztNQUNILEVBQUUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLE9BQU8sR0FBRyxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQztNQUN2RSxFQUFFLElBQUksR0FBRyxHQUFHLENBQUMsSUFBSSxXQUFXLENBQUM7TUFDN0IsRUFBRSxJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO01BQzNCLEVBQUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQztBQUNwQztNQUNBLEVBQUUsSUFBSSxDQUFDLE1BQU0sSUFBSSxLQUFLLEtBQUssT0FBTyxFQUFFO01BQ3BDLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3pDLEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUN6QixFQUFFLElBQUksSUFBSSxHQUFHLE1BQU0sR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsU0FBUyxDQUFDO01BQzdDLEVBQUUsSUFBSSxPQUFPLEdBQUcsVUFBVTtNQUMxQixJQUFJLElBQUk7TUFDUixJQUFJLE9BQU87TUFDWCxJQUFJLEtBQUssR0FBRyxLQUFLO01BQ2pCLElBQUksT0FBTztNQUNYLElBQUksR0FBRztNQUNQLElBQUksS0FBSztNQUNULElBQUksYUFBYTtNQUNqQixJQUFJLFFBQVE7TUFDWixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO01BQ3hCLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLENBQUMsTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsTUFBTSxJQUFJLHVCQUF1QixFQUFFO01BQ3JFLElBQUksT0FBTyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ3JFLEdBQUc7QUFDSDtNQUNBLEVBQUU7TUFDRixJQUFJLE1BQU07TUFDVixJQUFJLENBQUMsT0FBTztNQUNaLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDO01BQ3RCLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDOUIsSUFBSTtNQUNKLElBQUksT0FBTyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQzFCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLFVBQVUsQ0FBQyxPQUFPLENBQUMsRUFBRTtNQUN0RSxJQUFJLE9BQU8sT0FBTyxDQUFDO01BQ25CLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxVQUFVLEdBQUcsT0FBTyxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDO01BQ3ZELEVBQUUsSUFBSSxTQUFTLEdBQUcsTUFBTSxJQUFJLE9BQU8sR0FBRyxNQUFNLEdBQUcsTUFBTSxHQUFHLEdBQUcsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO01BQzVFLEVBQUUsSUFBSSxRQUFRLEdBQUcsTUFBTTtNQUN2QixNQUFNLE9BQU87TUFDYixRQUFRLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUM7TUFDOUMsUUFBUSxTQUFTLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxVQUFVLENBQUM7TUFDekMsTUFBTSxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDaEQ7TUFDQSxFQUFFLElBQUksVUFBVSxFQUFFO01BQ2xCLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDNUIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztNQUMxQixJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxJQUFJLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDN0QsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxJQUFJLGdCQUFnQixHQUFHLFNBQVMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7TUFDeEUsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztNQUN6QixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQ3JCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7TUFDckIsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFdBQVcsRUFBRTtNQUNqRixFQUFFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtNQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDeEIsR0FBRztNQUNILEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEtBQUssQ0FBQyxHQUFHLE9BQU8sR0FBRyxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQztNQUMvRCxFQUFFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDN0IsRUFBRSxPQUFPLElBQUk7TUFDYixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxHQUFHLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLFdBQVcsQ0FBQztNQUN4RCxNQUFNLFdBQVcsQ0FBQztNQUNsQixDQUFDLENBQUM7QUFDRjtNQUNBLGdCQUFnQixDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxNQUFNLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsUUFBUSxFQUFFO01BQ25ILEVBQUUsSUFBSSxPQUFPLEtBQUssU0FBUyxFQUFFO01BQzdCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUN4QixHQUFHO01BQ0gsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsT0FBTyxHQUFHLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDO01BQy9ELEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxLQUFLLE9BQU8sQ0FBQztNQUNsQyxFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDekIsRUFBRSxJQUFJLElBQUksR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDeEI7TUFDQSxFQUFFLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxFQUFFO01BQ3hCLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLE9BQU8sR0FBRyxVQUFVO01BQzFCLElBQUksSUFBSTtNQUNSLElBQUksT0FBTztNQUNYLElBQUksS0FBSyxHQUFHLEtBQUs7TUFDakIsSUFBSSxPQUFPO01BQ1gsSUFBSSxHQUFHO01BQ1AsSUFBSSxLQUFLO01BQ1QsSUFBSSxhQUFhO01BQ2pCLElBQUksUUFBUTtNQUNaLEdBQUcsQ0FBQztNQUNKLEVBQUUsSUFBSSxPQUFPLEtBQUssSUFBSSxFQUFFO01BQ3hCLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO01BQzVCLEVBQUUsSUFBSSxDQUFDLElBQUksRUFBRTtNQUNiLElBQUksUUFBUSxFQUFFLENBQUM7TUFDZixHQUFHLE1BQU0sSUFBSSxDQUFDLE9BQU8sRUFBRTtNQUN2QixJQUFJLFFBQVEsRUFBRSxDQUFDO01BQ2YsSUFBSSxJQUFJLFFBQVEsR0FBRyx1QkFBdUIsRUFBRTtNQUM1QyxNQUFNLE9BQU8sU0FBUyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQ3RELEtBQUs7TUFDTCxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksVUFBVSxHQUFHLE9BQU8sSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUN2RCxFQUFFLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztBQUN4RDtNQUNBLEVBQUUsSUFBSSxVQUFVLEVBQUU7TUFDbEIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQztNQUMxQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO01BQzFCLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztBQUNIO01BQ0EsRUFBRSxPQUFPLElBQUksZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztNQUMzRCxDQUFDLENBQUM7QUFDRjtNQUNBLElBQUksaUJBQWlCLEdBQUcsU0FBUyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtNQUM5RSxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO01BQ3pCLEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7TUFDekIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztNQUN6QixDQUFDLENBQUM7QUFDRjtNQUNBLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFO01BQ2xGLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUM3QixFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDekQsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDakMsTUFBTSxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUM1QixLQUFLO01BQ0wsR0FBRztNQUNILEVBQUUsT0FBTyxXQUFXLENBQUM7TUFDckIsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTtNQUNwSCxFQUFFLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtNQUM3QixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDeEIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLE9BQU8sR0FBRyxLQUFLLEtBQUssT0FBTyxDQUFDO0FBQ2xDO01BQ0EsRUFBRSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsT0FBTyxFQUFFO01BQ2hDLElBQUksSUFBSSxPQUFPLEVBQUU7TUFDakIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDckIsSUFBSSxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7TUFDMUIsSUFBSSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUN0RSxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7TUFDN0IsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7TUFDZCxFQUFFLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7TUFDM0IsRUFBRSxPQUFPLEdBQUcsR0FBRyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7TUFDM0IsSUFBSSxJQUFJLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDbEMsTUFBTSxNQUFNO01BQ1osS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLElBQUksTUFBTSxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7QUFDekI7TUFDQSxFQUFFLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEdBQUcsT0FBTyxFQUFFO01BQ3BELElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztBQUNIO01BQ0EsRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDbkIsRUFBRSxDQUFDLE9BQU8sSUFBSSxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEQ7TUFDQSxFQUFFLElBQUksT0FBTyxJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7TUFDNUIsSUFBSSxPQUFPLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNsRSxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksVUFBVSxHQUFHLE9BQU8sSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUN2RCxFQUFFLElBQUksVUFBVSxHQUFHLFVBQVUsR0FBRyxPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNEO01BQ0EsRUFBRSxJQUFJLE1BQU0sRUFBRTtNQUNkLElBQUksSUFBSSxPQUFPLEVBQUU7TUFDakIsTUFBTSxHQUFHLEtBQUssR0FBRyxHQUFHLENBQUM7TUFDckIsVUFBVSxVQUFVLENBQUMsR0FBRyxFQUFFO01BQzFCLFdBQVcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO01BQy9DLEtBQUssTUFBTTtNQUNYLE1BQU0sVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ3JDLEtBQUs7TUFDTCxHQUFHLE1BQU07TUFDVCxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUNsQyxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksVUFBVSxFQUFFO01BQ2xCLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUM7TUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO0FBQ0g7TUFDQSxFQUFFLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztNQUNsRSxDQUFDLENBQUM7QUFDRjtNQUNBLElBQUksU0FBUyxHQUFHLFNBQVMsU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFO01BQzVELEVBQUUsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7TUFDekIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztNQUN6QixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQ3JCLENBQUMsQ0FBQztBQUNGO01BQ0EsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsV0FBVyxFQUFFO01BQzFFLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztNQUM5RCxDQUFDLENBQUM7QUFDRjtNQUNBLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxLQUFLLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRTtNQUM1RyxFQUFFLElBQUksT0FBTyxHQUFHLEtBQUssS0FBSyxPQUFPLENBQUM7TUFDbEMsRUFBRSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN4QyxFQUFFLElBQUksUUFBUSxHQUFHLEtBQUssS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sRUFBRTtNQUNwRCxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ25CO01BQ0EsRUFBRSxJQUFJLE9BQU8sRUFBRTtNQUNmLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO01BQzFCLElBQUksT0FBTztNQUNYLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxRQUFRLEVBQUU7TUFDaEIsSUFBSSxJQUFJLE9BQU8sSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLE9BQU8sRUFBRTtNQUM3QyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQzVCLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksT0FBTyxJQUFJLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQzlELEdBQUc7QUFDSDtNQUNBLEVBQUUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDO01BQ3hCLEVBQUUsT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDdEUsQ0FBQyxDQUFDO0FBQ0Y7TUFDQTtBQUNBO01BQ0EsWUFBWSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE9BQU87TUFDcEUsRUFBRSxVQUFVLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDekIsSUFBSSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO01BQy9CLElBQUksS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLEVBQUUsSUFBSSxRQUFRLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDMUUsTUFBTSxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsT0FBTyxHQUFHLFFBQVEsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7TUFDL0QsUUFBUSxPQUFPLEtBQUssQ0FBQztNQUNyQixPQUFPO01BQ1AsS0FBSztNQUNMLEdBQUcsQ0FBQztBQUNKO01BQ0EsaUJBQWlCLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsT0FBTztNQUN4RSxFQUFFLFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUN6QixJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDM0IsSUFBSSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxRQUFRLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUN4RSxNQUFNLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLEdBQUcsUUFBUSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztNQUNyRCxNQUFNLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUN2RCxRQUFRLE9BQU8sS0FBSyxDQUFDO01BQ3JCLE9BQU87TUFDUCxLQUFLO01BQ0wsR0FBRyxDQUFDO0FBQ0o7TUFDQTtNQUNBLFNBQVMsQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUNyRCxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUN4QixDQUFDLENBQUM7QUFDRjtNQUNBLElBQUksV0FBVyxpQkFBaUIsVUFBVSxRQUFRLEVBQUU7TUFDcEQsRUFBRSxTQUFTLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtNQUMzQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7TUFDNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLElBQUksZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzNELEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxRQUFRLEdBQUcsV0FBVyxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7TUFDbkQsRUFBRSxXQUFXLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxJQUFJLFFBQVEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztNQUMxRSxFQUFFLFdBQVcsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztBQUNsRDtNQUNBLEVBQUUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLElBQUk7TUFDaEQsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO01BQzFCLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUM1QixJQUFJLE9BQU8sS0FBSyxFQUFFO01BQ2xCLE1BQU0sSUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztNQUM1QixNQUFNLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUNoQyxNQUFNLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7TUFDOUIsTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDdEIsUUFBUSxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7TUFDekIsVUFBVSxPQUFPLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDcEQsU0FBUztNQUNULE9BQU8sTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7TUFDL0IsUUFBUSxRQUFRLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO01BQzNDLFFBQVEsSUFBSSxLQUFLLElBQUksUUFBUSxFQUFFO01BQy9CLFVBQVUsT0FBTyxnQkFBZ0I7TUFDakMsWUFBWSxJQUFJO01BQ2hCLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQ2xFLFdBQVcsQ0FBQztNQUNaLFNBQVM7TUFDVCxPQUFPLE1BQU07TUFDYixRQUFRLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDekMsUUFBUSxJQUFJLEtBQUssSUFBSSxRQUFRLEVBQUU7TUFDL0IsVUFBVSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztNQUM3RSxVQUFVLElBQUksT0FBTyxFQUFFO01BQ3ZCLFlBQVksSUFBSSxPQUFPLENBQUMsS0FBSyxFQUFFO01BQy9CLGNBQWMsT0FBTyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzNELGFBQWE7TUFDYixZQUFZLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztNQUNuRSxXQUFXO01BQ1gsVUFBVSxTQUFTO01BQ25CLFNBQVM7TUFDVCxPQUFPO01BQ1AsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztNQUMvQyxLQUFLO01BQ0wsSUFBSSxPQUFPLFlBQVksRUFBRSxDQUFDO01BQzFCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxPQUFPLFdBQVcsQ0FBQztNQUNyQixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNiO01BQ0EsU0FBUyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO01BQ3ZDLEVBQUUsT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNqRCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJLEVBQUU7TUFDdEMsRUFBRSxPQUFPO01BQ1QsSUFBSSxJQUFJLEVBQUUsSUFBSTtNQUNkLElBQUksS0FBSyxFQUFFLENBQUM7TUFDWixJQUFJLE1BQU0sRUFBRSxJQUFJO01BQ2hCLEdBQUcsQ0FBQztNQUNKLENBQUM7QUFDRDtNQUNBLFNBQVMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtNQUM1QyxFQUFFLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7TUFDeEMsRUFBRSxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztNQUNsQixFQUFFLEdBQUcsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ25CLEVBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7TUFDMUIsRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztNQUNwQixFQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO01BQ3hCLEVBQUUsT0FBTyxHQUFHLENBQUM7TUFDYixDQUFDO0FBQ0Q7TUFDQSxJQUFJLFNBQVMsQ0FBQztNQUNkLFNBQVMsUUFBUSxHQUFHO01BQ3BCLEVBQUUsT0FBTyxTQUFTLEtBQUssU0FBUyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQy9DLENBQUM7QUFDRDtNQUNBLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQzlCLEVBQUUsSUFBSSxPQUFPLENBQUM7TUFDZCxFQUFFLElBQUksT0FBTyxDQUFDO01BQ2QsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtNQUNsQixJQUFJLElBQUksQ0FBQyxLQUFLLE9BQU8sRUFBRTtNQUN2QixNQUFNLE9BQU8sR0FBRyxDQUFDO01BQ2pCLEtBQUs7TUFDTCxJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7TUFDaEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN4RCxHQUFHLE1BQU07TUFDVCxJQUFJLElBQUksYUFBYSxHQUFHLE9BQU8sRUFBRSxDQUFDO01BQ2xDLElBQUksSUFBSSxRQUFRLEdBQUcsT0FBTyxFQUFFLENBQUM7TUFDN0IsSUFBSSxPQUFPLEdBQUcsVUFBVTtNQUN4QixNQUFNLEdBQUcsQ0FBQyxLQUFLO01BQ2YsTUFBTSxHQUFHLENBQUMsU0FBUztNQUNuQixNQUFNLENBQUM7TUFDUCxNQUFNLFNBQVM7TUFDZixNQUFNLENBQUM7TUFDUCxNQUFNLENBQUM7TUFDUCxNQUFNLGFBQWE7TUFDbkIsTUFBTSxRQUFRO01BQ2QsS0FBSyxDQUFDO01BQ04sSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtNQUN6QixNQUFNLE9BQU8sR0FBRyxDQUFDO01BQ2pCLEtBQUs7TUFDTCxJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxJQUFJLGFBQWEsQ0FBQyxLQUFLLElBQUksQ0FBQyxLQUFLLE9BQU8sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7TUFDOUUsR0FBRztNQUNILEVBQUUsSUFBSSxHQUFHLENBQUMsU0FBUyxFQUFFO01BQ3JCLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7TUFDdkIsSUFBSSxHQUFHLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztNQUN4QixJQUFJLEdBQUcsQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQzNCLElBQUksR0FBRyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7TUFDekIsSUFBSSxPQUFPLEdBQUcsQ0FBQztNQUNmLEdBQUc7TUFDSCxFQUFFLE9BQU8sT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsUUFBUSxFQUFFLENBQUM7TUFDMUQsQ0FBQztBQUNEO01BQ0EsU0FBUyxVQUFVO01BQ25CLEVBQUUsSUFBSTtNQUNOLEVBQUUsT0FBTztNQUNULEVBQUUsS0FBSztNQUNQLEVBQUUsT0FBTztNQUNULEVBQUUsR0FBRztNQUNMLEVBQUUsS0FBSztNQUNQLEVBQUUsYUFBYTtNQUNmLEVBQUUsUUFBUTtNQUNWLEVBQUU7TUFDRixFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDYixJQUFJLElBQUksS0FBSyxLQUFLLE9BQU8sRUFBRTtNQUMzQixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztNQUNyQixJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztNQUMxQixJQUFJLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQ3pELEdBQUc7TUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDLE1BQU07TUFDcEIsSUFBSSxPQUFPO01BQ1gsSUFBSSxLQUFLO01BQ1QsSUFBSSxPQUFPO01BQ1gsSUFBSSxHQUFHO01BQ1AsSUFBSSxLQUFLO01BQ1QsSUFBSSxhQUFhO01BQ2pCLElBQUksUUFBUTtNQUNaLEdBQUcsQ0FBQztNQUNKLENBQUM7QUFDRDtNQUNBLFNBQVMsVUFBVSxDQUFDLElBQUksRUFBRTtNQUMxQixFQUFFO01BQ0YsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLGlCQUFpQjtNQUM1RSxJQUFJO01BQ0osQ0FBQztBQUNEO01BQ0EsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRTtNQUM3RCxFQUFFLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxPQUFPLEVBQUU7TUFDaEMsSUFBSSxPQUFPLElBQUksaUJBQWlCLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUN4RSxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksQ0FBQztNQUMxRSxFQUFFLElBQUksSUFBSSxHQUFHLENBQUMsS0FBSyxLQUFLLENBQUMsR0FBRyxPQUFPLEdBQUcsT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUM7QUFDaEU7TUFDQSxFQUFFLElBQUksT0FBTyxDQUFDO01BQ2QsRUFBRSxJQUFJLEtBQUs7TUFDWCxJQUFJLElBQUksS0FBSyxJQUFJO01BQ2pCLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztNQUNyRSxTQUFTLENBQUMsT0FBTyxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDO01BQzFELFFBQVEsSUFBSSxHQUFHLElBQUksR0FBRyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ3pEO01BQ0EsRUFBRSxPQUFPLElBQUksaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDMUUsQ0FBQztBQUNEO01BQ0EsU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFO01BQ25ELEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRTtNQUNoQixJQUFJLE9BQU8sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO01BQzVCLEdBQUc7TUFDSCxFQUFFLElBQUksSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUM3RCxFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQzlDLElBQUksSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQzVCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ2xFLEdBQUc7TUFDSCxFQUFFLE9BQU8sSUFBSSxDQUFDO01BQ2QsQ0FBQztBQUNEO01BQ0EsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFO01BQ3JELEVBQUUsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFDO01BQ2pCLEVBQUUsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO01BQ25CLEVBQUUsSUFBSSxXQUFXLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDckMsRUFBRSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLEVBQUUsR0FBRyxHQUFHLEVBQUUsRUFBRSxFQUFFLEVBQUUsR0FBRyxLQUFLLENBQUMsRUFBRTtNQUMzRSxJQUFJLElBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUN6QixJQUFJLElBQUksSUFBSSxLQUFLLFNBQVMsSUFBSSxFQUFFLEtBQUssU0FBUyxFQUFFO01BQ2hELE1BQU0sTUFBTSxJQUFJLEdBQUcsQ0FBQztNQUNwQixNQUFNLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQztNQUNyQyxLQUFLO01BQ0wsR0FBRztNQUNILEVBQUUsT0FBTyxJQUFJLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7TUFDN0QsQ0FBQztBQUNEO01BQ0EsU0FBUyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRTtNQUM5RCxFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztNQUNoQixFQUFFLElBQUksYUFBYSxHQUFHLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3RDLEVBQUUsS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsTUFBTSxLQUFLLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxNQUFNLE1BQU0sQ0FBQyxFQUFFO01BQ3RELElBQUksYUFBYSxDQUFDLEVBQUUsQ0FBQyxHQUFHLE1BQU0sR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDO01BQ2hFLEdBQUc7TUFDSCxFQUFFLGFBQWEsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDbEMsRUFBRSxPQUFPLElBQUksZ0JBQWdCLENBQUMsT0FBTyxFQUFFLEtBQUssR0FBRyxDQUFDLEVBQUUsYUFBYSxDQUFDLENBQUM7TUFDakUsQ0FBQztBQUNEO01BQ0EsU0FBUyxRQUFRLENBQUMsQ0FBQyxFQUFFO01BQ3JCLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUM7TUFDN0IsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsQ0FBQztNQUNqRCxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksVUFBVSxDQUFDO01BQ2xDLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDZCxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO01BQ2YsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDbEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFO01BQ3pDLEVBQUUsSUFBSSxRQUFRLEdBQUcsT0FBTyxHQUFHLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDbEQsRUFBRSxRQUFRLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO01BQ3RCLEVBQUUsT0FBTyxRQUFRLENBQUM7TUFDbEIsQ0FBQztBQUNEO01BQ0EsU0FBUyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFO01BQzVDLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDaEMsRUFBRSxJQUFJLE9BQU8sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLE1BQU0sRUFBRTtNQUNyQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7TUFDckIsSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO01BQ0gsRUFBRSxJQUFJLFFBQVEsR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNuQyxFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztNQUNoQixFQUFFLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEVBQUUsR0FBRyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDdEMsSUFBSSxJQUFJLEVBQUUsS0FBSyxHQUFHLEVBQUU7TUFDcEIsTUFBTSxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDO01BQ3pCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ2pCLEtBQUssTUFBTTtNQUNYLE1BQU0sUUFBUSxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQUM7TUFDdkMsS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLE9BQU8sUUFBUSxDQUFDO01BQ2xCLENBQUM7QUFDRDtNQUNBLFNBQVMsU0FBUyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFO01BQ3hDLEVBQUUsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7TUFDaEMsRUFBRSxJQUFJLE9BQU8sSUFBSSxHQUFHLEtBQUssTUFBTSxFQUFFO01BQ2pDLElBQUksS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO01BQ2hCLElBQUksT0FBTyxLQUFLLENBQUM7TUFDakIsR0FBRztNQUNILEVBQUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDbkMsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7TUFDaEIsRUFBRSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxFQUFFLEVBQUUsRUFBRSxFQUFFO01BQ3RDLElBQUksSUFBSSxFQUFFLEtBQUssR0FBRyxFQUFFO01BQ3BCLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztNQUNoQixLQUFLO01BQ0wsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQztNQUNyQyxHQUFHO01BQ0gsRUFBRSxPQUFPLFFBQVEsQ0FBQztNQUNsQixDQUFDO0FBQ0Q7TUFDQSxJQUFJLGtCQUFrQixHQUFHLElBQUksR0FBRyxDQUFDLENBQUM7TUFDbEMsSUFBSSx1QkFBdUIsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO01BQ3ZDLElBQUksdUJBQXVCLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQztBQUN2QztNQUNBLElBQUksY0FBYyxHQUFHLHdCQUF3QixDQUFDO0FBQzlDO01BQ0EsU0FBUyxNQUFNLENBQUMsU0FBUyxFQUFFO01BQzNCLEVBQUUsT0FBTyxPQUFPLENBQUMsU0FBUyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO01BQ3pELENBQUM7QUFDRDtNQUNBLElBQUksSUFBSSxpQkFBaUIsVUFBVSxpQkFBaUIsRUFBRTtNQUN0RCxFQUFFLFNBQVMsSUFBSSxDQUFDLEtBQUssRUFBRTtNQUN2QixJQUFJLElBQUksS0FBSyxHQUFHLFNBQVMsRUFBRSxDQUFDO01BQzVCLElBQUksSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7TUFDL0MsTUFBTSxPQUFPLEtBQUssQ0FBQztNQUNuQixLQUFLO01BQ0wsSUFBSSxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUN2QixNQUFNLE9BQU8sS0FBSyxDQUFDO01BQ25CLEtBQUs7TUFDTCxJQUFJLElBQUksSUFBSSxHQUFHLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ3hDLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUN6QixJQUFJLElBQUksSUFBSSxLQUFLLENBQUMsRUFBRTtNQUNwQixNQUFNLE9BQU8sS0FBSyxDQUFDO01BQ25CLEtBQUs7TUFDTCxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO01BQzVCLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxJQUFJLEVBQUU7TUFDakMsTUFBTSxPQUFPLFFBQVEsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQztNQUN2RSxLQUFLO01BQ0wsSUFBSSxPQUFPLEtBQUssQ0FBQyxhQUFhLENBQUMsVUFBVSxJQUFJLEVBQUU7TUFDL0MsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3pCLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQy9ELEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLGlCQUFpQixHQUFHLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7TUFDOUQsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7TUFDckYsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDcEM7TUFDQSxFQUFFLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUyxFQUFFLGlCQUFpQjtNQUN4QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQzNCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsSUFBSTtNQUNqRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDMUMsR0FBRyxDQUFDO0FBQ0o7TUFDQTtBQUNBO01BQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO01BQ3pELElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDbkMsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDekMsTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUM1QixNQUFNLElBQUksSUFBSSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDMUMsTUFBTSxPQUFPLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQztNQUM5QyxLQUFLO01BQ0wsSUFBSSxPQUFPLFdBQVcsQ0FBQztNQUN2QixHQUFHLENBQUM7QUFDSjtNQUNBO0FBQ0E7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7TUFDbkQsSUFBSSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQzFDLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUU7TUFDbEQsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7TUFDM0IsUUFBUSxJQUFJO01BQ1osUUFBUSxLQUFLLEtBQUssQ0FBQztNQUNuQixRQUFRLElBQUksQ0FBQyxLQUFLLEVBQUU7TUFDcEIsUUFBUSxLQUFLLEtBQUssSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDO01BQy9CLFFBQVEsSUFBSSxDQUFDLEdBQUcsRUFBRTtNQUNsQixRQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQzlCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFO01BQ3pELElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDeEMsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxJQUFJO01BQzNDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUN4QixNQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztNQUNwRCxNQUFNLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO01BQzFCLE1BQU0sSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQ3hELE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7TUFDNUIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLFNBQVMsRUFBRSxDQUFDO01BQ3ZCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksaUJBQWlCO01BQ3RELElBQUksSUFBSSxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQzNCLElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUM1QixJQUFJLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLElBQUksRUFBRTtNQUM5QyxNQUFNLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDdEQsTUFBTSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUNqRCxRQUFRLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxHQUFHLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUMzQyxPQUFPO01BQ1AsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLElBQUk7TUFDdkMsSUFBSSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDdEMsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsT0FBTyxpQkFBaUI7TUFDNUQsSUFBSSxJQUFJLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDM0IsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxJQUFJLEVBQUU7TUFDOUMsTUFBTSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO01BQzFDLE1BQU0sS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsRUFBRSxFQUFFLEVBQUU7TUFDakQsUUFBUSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUNqQyxPQUFPO01BQ1AsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLElBQUk7TUFDM0MsSUFBSSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDbEMsR0FBRyxDQUFDO0FBQ0o7TUFDQTtBQUNBO01BQ0EsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sc0JBQXNCO01BQy9ELElBQUksSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDO0FBQ2hDO01BQ0EsSUFBSSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7TUFDbEIsSUFBSSxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUMvQyxNQUFNLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUNwQyxNQUFNLElBQUksR0FBRyxHQUFHLGlCQUFpQjtNQUNqQyxRQUFRLE9BQU8sUUFBUSxLQUFLLFFBQVEsSUFBSSxXQUFXLENBQUMsUUFBUSxDQUFDO01BQzdELFlBQVksUUFBUTtNQUNwQixZQUFZLENBQUMsUUFBUSxDQUFDO01BQ3RCLE9BQU8sQ0FBQztNQUNSLE1BQU0sSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUMxQixRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDdkIsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDM0IsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUNqRSxNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN2QyxLQUFLO01BQ0wsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxJQUFJLEVBQUU7TUFDOUMsTUFBTSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsR0FBRyxFQUFFLEVBQUUsT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxFQUFFLEVBQUUsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQzFHLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFNBQVMsT0FBTyxFQUFFLElBQUksRUFBRTtNQUNuRCxJQUFJLE9BQU8sYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDeEMsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUU7TUFDdEQsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLElBQUksRUFBRTtNQUM5QyxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFO01BQzlDLFFBQVEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztNQUNwRSxPQUFPO01BQ1AsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBO0FBQ0E7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7TUFDckQsSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3pCLElBQUksSUFBSSxVQUFVLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtNQUN0QyxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE9BQU8sYUFBYTtNQUN4QixNQUFNLElBQUk7TUFDVixNQUFNLFlBQVksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO01BQy9CLE1BQU0sVUFBVSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUM7TUFDM0IsS0FBSyxDQUFDO01BQ04sR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDbEUsSUFBSSxJQUFJLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7TUFDeEMsSUFBSSxJQUFJLE1BQU0sR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQzVDLElBQUksT0FBTyxJQUFJLFFBQVEsQ0FBQyxZQUFZO01BQ3BDLE1BQU0sSUFBSSxLQUFLLEdBQUcsTUFBTSxFQUFFLENBQUM7TUFDM0IsTUFBTSxPQUFPLEtBQUssS0FBSyxJQUFJO01BQzNCLFVBQVUsWUFBWSxFQUFFO01BQ3hCLFVBQVUsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLEdBQUcsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDbEUsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUM5RCxJQUFJLElBQUksS0FBSyxHQUFHLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztNQUN4QyxJQUFJLElBQUksTUFBTSxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDNUMsSUFBSSxJQUFJLEtBQUssQ0FBQztNQUNkLElBQUksT0FBTyxDQUFDLEtBQUssR0FBRyxNQUFNLEVBQUUsTUFBTSxJQUFJLEVBQUU7TUFDeEMsTUFBTSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLEVBQUUsS0FBSyxHQUFHLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUNsRSxRQUFRLE1BQU07TUFDZCxPQUFPO01BQ1AsS0FBSztNQUNMLElBQUksT0FBTyxLQUFLLENBQUM7TUFDakIsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxHQUFHLFNBQVMsYUFBYSxFQUFFLE9BQU8sRUFBRTtNQUNsRSxJQUFJLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFDcEMsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO01BQ2xCLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUMzQixRQUFRLE9BQU8sU0FBUyxFQUFFLENBQUM7TUFDM0IsT0FBTztNQUNQLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7TUFDL0IsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztNQUM3QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE9BQU8sUUFBUTtNQUNuQixNQUFNLElBQUksQ0FBQyxPQUFPO01BQ2xCLE1BQU0sSUFBSSxDQUFDLFNBQVM7TUFDcEIsTUFBTSxJQUFJLENBQUMsTUFBTTtNQUNqQixNQUFNLElBQUksQ0FBQyxLQUFLO01BQ2hCLE1BQU0sSUFBSSxDQUFDLEtBQUs7TUFDaEIsTUFBTSxPQUFPO01BQ2IsTUFBTSxJQUFJLENBQUMsTUFBTTtNQUNqQixLQUFLLENBQUM7TUFDTixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxJQUFJLENBQUM7TUFDZCxDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBQ3RCO01BQ0EsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7QUFDckI7TUFDQSxJQUFJLGFBQWEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO01BQ25DLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDckMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxHQUFHLGFBQWEsQ0FBQyxNQUFNLENBQUM7TUFDN0MsYUFBYSxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsTUFBTSxDQUFDO01BQzNDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO01BQzVCLGFBQWEsQ0FBQyxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7TUFDM0QsYUFBYSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7TUFDOUIsYUFBYSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7TUFDbEMsYUFBYSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7TUFDaEMsYUFBYSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7TUFDeEMsYUFBYSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7TUFDNUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7TUFDdEMsYUFBYSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7TUFDeEMsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsYUFBYSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7TUFDekUsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsVUFBVSxNQUFNLEVBQUUsR0FBRyxFQUFFO01BQzVELEVBQUUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzFCLENBQUMsQ0FBQztNQUNGLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFFO01BQ3RELEVBQUUsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7TUFDM0IsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxJQUFJLEtBQUssR0FBRyxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFO01BQzNDLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7TUFDckIsRUFBRSxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztNQUN6QixDQUFDLENBQUM7QUFDRjtNQUNBO0FBQ0E7TUFDQSxLQUFLLENBQUMsU0FBUyxDQUFDLFlBQVksR0FBRyxTQUFTLFlBQVksRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtNQUM3RSxFQUFFLElBQUksS0FBSyxLQUFLLEtBQUssR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUM5RCxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7TUFDSCxFQUFFLElBQUksV0FBVyxHQUFHLENBQUMsS0FBSyxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUM7TUFDN0MsRUFBRSxJQUFJLFdBQVcsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtNQUN4QyxJQUFJLE9BQU8sSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2xDLEdBQUc7TUFDSCxFQUFFLElBQUksYUFBYSxHQUFHLFdBQVcsS0FBSyxDQUFDLENBQUM7TUFDeEMsRUFBRSxJQUFJLFFBQVEsQ0FBQztNQUNmLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO01BQ2pCLElBQUksSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUMzQyxJQUFJLFFBQVE7TUFDWixNQUFNLFFBQVEsSUFBSSxRQUFRLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ3ZFLElBQUksSUFBSSxRQUFRLEtBQUssUUFBUSxJQUFJLGFBQWEsRUFBRTtNQUNoRCxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxJQUFJLGFBQWEsSUFBSSxDQUFDLFFBQVEsRUFBRTtNQUNsQyxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7TUFDSCxFQUFFLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDOUMsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFO01BQ3RCLElBQUksS0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFDLEVBQUUsRUFBRSxHQUFHLFdBQVcsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUM3QyxNQUFNLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDO01BQ3JDLEtBQUs7TUFDTCxHQUFHO01BQ0gsRUFBRSxJQUFJLFFBQVEsRUFBRTtNQUNoQixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsUUFBUSxDQUFDO01BQzNDLEdBQUc7TUFDSCxFQUFFLE9BQU8sUUFBUSxDQUFDO01BQ2xCLENBQUMsQ0FBQztBQUNGO01BQ0EsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7TUFDM0UsRUFBRSxJQUFJLEtBQUssTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDckUsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO01BQ0gsRUFBRSxJQUFJLFNBQVMsR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLENBQUMsTUFBTSxLQUFLLElBQUksSUFBSSxDQUFDO01BQ2pELEVBQUUsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7TUFDdEMsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksUUFBUSxDQUFDO01BQ2YsRUFBRSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7TUFDakIsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ3pDLElBQUksUUFBUTtNQUNaLE1BQU0sUUFBUSxJQUFJLFFBQVEsQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssR0FBRyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDdEUsSUFBSSxJQUFJLFFBQVEsS0FBSyxRQUFRLElBQUksU0FBUyxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtNQUN0RSxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDOUMsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDdkMsRUFBRSxJQUFJLFFBQVEsRUFBRTtNQUNoQixJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsUUFBUSxDQUFDO01BQ3pDLEdBQUc7TUFDSCxFQUFFLE9BQU8sUUFBUSxDQUFDO01BQ2xCLENBQUMsQ0FBQztBQUNGO01BQ0EsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2Q7TUFDQSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQ3BDLEVBQUUsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUMxQixFQUFFLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7TUFDN0IsRUFBRSxJQUFJLE9BQU8sR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDckMsRUFBRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO0FBQ3hCO01BQ0EsRUFBRSxPQUFPLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN2RDtNQUNBLEVBQUUsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRTtNQUNsRCxJQUFJLE9BQU8sS0FBSyxLQUFLLENBQUM7TUFDdEIsUUFBUSxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztNQUNqQyxRQUFRLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO01BQ3pDLEdBQUc7QUFDSDtNQUNBLEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRTtNQUNyQyxJQUFJLElBQUksS0FBSyxHQUFHLE1BQU0sS0FBSyxPQUFPLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDN0UsSUFBSSxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLEdBQUcsTUFBTSxDQUFDO01BQ2pELElBQUksSUFBSSxFQUFFLEdBQUcsS0FBSyxHQUFHLE1BQU0sQ0FBQztNQUM1QixJQUFJLElBQUksRUFBRSxHQUFHLElBQUksRUFBRTtNQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7TUFDaEIsS0FBSztNQUNMLElBQUksT0FBTyxZQUFZO01BQ3ZCLE1BQU0sSUFBSSxJQUFJLEtBQUssRUFBRSxFQUFFO01BQ3ZCLFFBQVEsT0FBTyxJQUFJLENBQUM7TUFDcEIsT0FBTztNQUNQLE1BQU0sSUFBSSxHQUFHLEdBQUcsT0FBTyxHQUFHLEVBQUUsRUFBRSxHQUFHLElBQUksRUFBRSxDQUFDO01BQ3hDLE1BQU0sT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2pDLEtBQUssQ0FBQztNQUNOLEdBQUc7QUFDSDtNQUNBLEVBQUUsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUU7TUFDNUMsSUFBSSxJQUFJLE1BQU0sQ0FBQztNQUNmLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDbkMsSUFBSSxJQUFJLElBQUksR0FBRyxNQUFNLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxNQUFNLEtBQUssS0FBSyxDQUFDO01BQzVELElBQUksSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxNQUFNLEtBQUssS0FBSyxJQUFJLENBQUMsQ0FBQztNQUM3QyxJQUFJLElBQUksRUFBRSxHQUFHLElBQUksRUFBRTtNQUNuQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7TUFDaEIsS0FBSztNQUNMLElBQUksT0FBTyxZQUFZO01BQ3ZCLE1BQU0sT0FBTyxJQUFJLEVBQUU7TUFDbkIsUUFBUSxJQUFJLE1BQU0sRUFBRTtNQUNwQixVQUFVLElBQUksS0FBSyxHQUFHLE1BQU0sRUFBRSxDQUFDO01BQy9CLFVBQVUsSUFBSSxLQUFLLEtBQUssSUFBSSxFQUFFO01BQzlCLFlBQVksT0FBTyxLQUFLLENBQUM7TUFDekIsV0FBVztNQUNYLFVBQVUsTUFBTSxHQUFHLElBQUksQ0FBQztNQUN4QixTQUFTO01BQ1QsUUFBUSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7TUFDekIsVUFBVSxPQUFPLElBQUksQ0FBQztNQUN0QixTQUFTO01BQ1QsUUFBUSxJQUFJLEdBQUcsR0FBRyxPQUFPLEdBQUcsRUFBRSxFQUFFLEdBQUcsSUFBSSxFQUFFLENBQUM7TUFDMUMsUUFBUSxNQUFNLEdBQUcsaUJBQWlCO01BQ2xDLFVBQVUsS0FBSyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUM7TUFDN0IsVUFBVSxLQUFLLEdBQUcsS0FBSztNQUN2QixVQUFVLE1BQU0sSUFBSSxHQUFHLElBQUksS0FBSyxDQUFDO01BQ2pDLFNBQVMsQ0FBQztNQUNWLE9BQU87TUFDUCxLQUFLLENBQUM7TUFDTixHQUFHO01BQ0gsQ0FBQztBQUNEO01BQ0EsU0FBUyxRQUFRLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFO01BQ3RFLEVBQUUsSUFBSSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztNQUMxQyxFQUFFLElBQUksQ0FBQyxJQUFJLEdBQUcsUUFBUSxHQUFHLE1BQU0sQ0FBQztNQUNoQyxFQUFFLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO01BQ3hCLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUM7TUFDNUIsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztNQUN0QixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3BCLEVBQUUsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7TUFDcEIsRUFBRSxJQUFJLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztNQUMzQixFQUFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO01BQ3JCLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7TUFDekIsRUFBRSxPQUFPLElBQUksQ0FBQztNQUNkLENBQUM7QUFDRDtNQUNBLElBQUksVUFBVSxDQUFDO01BQ2YsU0FBUyxTQUFTLEdBQUc7TUFDckIsRUFBRSxPQUFPLFVBQVUsS0FBSyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUM1RCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtNQUN4QyxFQUFFLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ2pDO01BQ0EsRUFBRSxJQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7TUFDdkIsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksS0FBSyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtNQUN2QyxJQUFJLE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLElBQUksRUFBRTtNQUM5QyxNQUFNLEtBQUssR0FBRyxDQUFDO01BQ2YsVUFBVSxhQUFhLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDO01BQ2xELFVBQVUsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDOUQsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDO0FBQ3hCO01BQ0EsRUFBRSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO01BQzNCLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMzQixFQUFFLElBQUksUUFBUSxHQUFHLE9BQU8sRUFBRSxDQUFDO01BQzNCLEVBQUUsSUFBSSxLQUFLLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtNQUM5QyxJQUFJLE9BQU8sR0FBRyxXQUFXLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7TUFDOUUsR0FBRyxNQUFNO01BQ1QsSUFBSSxPQUFPLEdBQUcsV0FBVztNQUN6QixNQUFNLE9BQU87TUFDYixNQUFNLElBQUksQ0FBQyxTQUFTO01BQ3BCLE1BQU0sSUFBSSxDQUFDLE1BQU07TUFDakIsTUFBTSxLQUFLO01BQ1gsTUFBTSxLQUFLO01BQ1gsTUFBTSxRQUFRO01BQ2QsS0FBSyxDQUFDO01BQ04sR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRTtNQUN2QixJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ3RCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7TUFDekIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztNQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQzVCLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7TUFDMUIsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO01BQ0gsRUFBRSxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDL0UsQ0FBQztBQUNEO01BQ0EsU0FBUyxXQUFXLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUU7TUFDbkUsRUFBRSxJQUFJLEdBQUcsR0FBRyxDQUFDLEtBQUssS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDO01BQ3JDLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztNQUNoRCxFQUFFLElBQUksQ0FBQyxPQUFPLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtNQUN2QyxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxPQUFPLENBQUM7QUFDZDtNQUNBLEVBQUUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO01BQ2pCLElBQUksSUFBSSxTQUFTLEdBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDNUMsSUFBSSxJQUFJLFlBQVksR0FBRyxXQUFXO01BQ2xDLE1BQU0sU0FBUztNQUNmLE1BQU0sT0FBTztNQUNiLE1BQU0sS0FBSyxHQUFHLEtBQUs7TUFDbkIsTUFBTSxLQUFLO01BQ1gsTUFBTSxLQUFLO01BQ1gsTUFBTSxRQUFRO01BQ2QsS0FBSyxDQUFDO01BQ04sSUFBSSxJQUFJLFlBQVksS0FBSyxTQUFTLEVBQUU7TUFDcEMsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUMzQyxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsWUFBWSxDQUFDO01BQ3RDLElBQUksT0FBTyxPQUFPLENBQUM7TUFDbkIsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLE9BQU8sSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUM1QyxJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxRQUFRLEVBQUU7TUFDaEIsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7TUFDckIsR0FBRztBQUNIO01BQ0EsRUFBRSxPQUFPLEdBQUcsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUN6QyxFQUFFLElBQUksS0FBSyxLQUFLLFNBQVMsSUFBSSxHQUFHLEtBQUssT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO01BQy9ELElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztNQUN4QixHQUFHLE1BQU07TUFDVCxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQy9CLEdBQUc7TUFDSCxFQUFFLE9BQU8sT0FBTyxDQUFDO01BQ2pCLENBQUM7QUFDRDtNQUNBLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDdEMsRUFBRSxJQUFJLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxLQUFLLElBQUksQ0FBQyxPQUFPLEVBQUU7TUFDbkQsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO01BQ0gsRUFBRSxPQUFPLElBQUksS0FBSyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUM1RCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFO01BQ3JDLEVBQUUsSUFBSSxRQUFRLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtNQUNqRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztNQUN0QixHQUFHO01BQ0gsRUFBRSxJQUFJLFFBQVEsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsRUFBRTtNQUM3QyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDMUIsSUFBSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO01BQzVCLElBQUksT0FBTyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtNQUM5QixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxLQUFLLEtBQUssSUFBSSxJQUFJLENBQUMsQ0FBQztNQUNyRCxNQUFNLEtBQUssSUFBSSxLQUFLLENBQUM7TUFDckIsS0FBSztNQUNMLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztNQUNILENBQUM7QUFDRDtNQUNBLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO01BQ3pDO01BQ0E7TUFDQSxFQUFFLElBQUksS0FBSyxLQUFLLFNBQVMsRUFBRTtNQUMzQixJQUFJLEtBQUssSUFBSSxDQUFDLENBQUM7TUFDZixHQUFHO01BQ0gsRUFBRSxJQUFJLEdBQUcsS0FBSyxTQUFTLEVBQUU7TUFDekIsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDO01BQ2IsR0FBRztNQUNILEVBQUUsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsSUFBSSxJQUFJLE9BQU8sRUFBRSxDQUFDO01BQzlDLEVBQUUsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztNQUMvQixFQUFFLElBQUksV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7TUFDbkMsRUFBRSxJQUFJLFNBQVMsR0FBRyxTQUFTLEdBQUcsS0FBSyxDQUFDO01BQ3BDLEVBQUUsSUFBSSxXQUFXO01BQ2pCLElBQUksR0FBRyxLQUFLLFNBQVM7TUFDckIsUUFBUSxXQUFXO01BQ25CLFFBQVEsR0FBRyxHQUFHLENBQUM7TUFDZixRQUFRLFdBQVcsR0FBRyxHQUFHO01BQ3pCLFFBQVEsU0FBUyxHQUFHLEdBQUcsQ0FBQztNQUN4QixFQUFFLElBQUksU0FBUyxLQUFLLFNBQVMsSUFBSSxXQUFXLEtBQUssV0FBVyxFQUFFO01BQzlELElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztBQUNIO01BQ0E7TUFDQSxFQUFFLElBQUksU0FBUyxJQUFJLFdBQVcsRUFBRTtNQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO01BQ3hCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztNQUM3QixFQUFFLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7QUFDM0I7TUFDQTtNQUNBLEVBQUUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO01BQ3RCLEVBQUUsT0FBTyxTQUFTLEdBQUcsV0FBVyxHQUFHLENBQUMsRUFBRTtNQUN0QyxJQUFJLE9BQU8sR0FBRyxJQUFJLEtBQUs7TUFDdkIsTUFBTSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRTtNQUNqRSxNQUFNLEtBQUs7TUFDWCxLQUFLLENBQUM7TUFDTixJQUFJLFFBQVEsSUFBSSxLQUFLLENBQUM7TUFDdEIsSUFBSSxXQUFXLElBQUksQ0FBQyxJQUFJLFFBQVEsQ0FBQztNQUNqQyxHQUFHO01BQ0gsRUFBRSxJQUFJLFdBQVcsRUFBRTtNQUNuQixJQUFJLFNBQVMsSUFBSSxXQUFXLENBQUM7TUFDN0IsSUFBSSxTQUFTLElBQUksV0FBVyxDQUFDO01BQzdCLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQztNQUMvQixJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUM7TUFDL0IsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7TUFDakQsRUFBRSxJQUFJLGFBQWEsR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDakQ7TUFDQTtNQUNBLEVBQUUsT0FBTyxhQUFhLElBQUksQ0FBQyxLQUFLLFFBQVEsR0FBRyxLQUFLLENBQUMsRUFBRTtNQUNuRCxJQUFJLE9BQU8sR0FBRyxJQUFJLEtBQUs7TUFDdkIsTUFBTSxPQUFPLElBQUksT0FBTyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFO01BQ3RELE1BQU0sS0FBSztNQUNYLEtBQUssQ0FBQztNQUNOLElBQUksUUFBUSxJQUFJLEtBQUssQ0FBQztNQUN0QixHQUFHO0FBQ0g7TUFDQTtNQUNBLEVBQUUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMzQixFQUFFLElBQUksT0FBTztNQUNiLElBQUksYUFBYSxHQUFHLGFBQWE7TUFDakMsUUFBUSxXQUFXLENBQUMsSUFBSSxFQUFFLFdBQVcsR0FBRyxDQUFDLENBQUM7TUFDMUMsUUFBUSxhQUFhLEdBQUcsYUFBYTtNQUNyQyxRQUFRLElBQUksS0FBSyxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUM7TUFDNUIsUUFBUSxPQUFPLENBQUM7QUFDaEI7TUFDQTtNQUNBLEVBQUU7TUFDRixJQUFJLE9BQU87TUFDWCxJQUFJLGFBQWEsR0FBRyxhQUFhO01BQ2pDLElBQUksU0FBUyxHQUFHLFdBQVc7TUFDM0IsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU07TUFDeEIsSUFBSTtNQUNKLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDNUMsSUFBSSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUM7TUFDdkIsSUFBSSxLQUFLLElBQUksS0FBSyxHQUFHLFFBQVEsRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQUssSUFBSSxLQUFLLEVBQUU7TUFDOUQsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLGFBQWEsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDO01BQ2pELE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7TUFDckUsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLGFBQWEsS0FBSyxLQUFLLElBQUksSUFBSSxDQUFDLEdBQUcsT0FBTyxDQUFDO01BQzNELEdBQUc7QUFDSDtNQUNBO01BQ0EsRUFBRSxJQUFJLFdBQVcsR0FBRyxXQUFXLEVBQUU7TUFDakMsSUFBSSxPQUFPLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztNQUNwRSxHQUFHO0FBQ0g7TUFDQTtNQUNBLEVBQUUsSUFBSSxTQUFTLElBQUksYUFBYSxFQUFFO01BQ2xDLElBQUksU0FBUyxJQUFJLGFBQWEsQ0FBQztNQUMvQixJQUFJLFdBQVcsSUFBSSxhQUFhLENBQUM7TUFDakMsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO01BQ3JCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztNQUNuQixJQUFJLE9BQU8sR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ25FO01BQ0E7TUFDQSxHQUFHLE1BQU0sSUFBSSxTQUFTLEdBQUcsU0FBUyxJQUFJLGFBQWEsR0FBRyxhQUFhLEVBQUU7TUFDckUsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCO01BQ0E7TUFDQSxJQUFJLE9BQU8sT0FBTyxFQUFFO01BQ3BCLE1BQU0sSUFBSSxVQUFVLEdBQUcsQ0FBQyxTQUFTLEtBQUssUUFBUSxJQUFJLElBQUksQ0FBQztNQUN2RCxNQUFNLElBQUksQ0FBQyxVQUFVLEtBQUssYUFBYSxLQUFLLFFBQVEsSUFBSSxJQUFJLEVBQUU7TUFDOUQsUUFBUSxNQUFNO01BQ2QsT0FBTztNQUNQLE1BQU0sSUFBSSxVQUFVLEVBQUU7TUFDdEIsUUFBUSxXQUFXLElBQUksQ0FBQyxDQUFDLElBQUksUUFBUSxJQUFJLFVBQVUsQ0FBQztNQUNwRCxPQUFPO01BQ1AsTUFBTSxRQUFRLElBQUksS0FBSyxDQUFDO01BQ3hCLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7TUFDMUMsS0FBSztBQUNMO01BQ0E7TUFDQSxJQUFJLElBQUksT0FBTyxJQUFJLFNBQVMsR0FBRyxTQUFTLEVBQUU7TUFDMUMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLFNBQVMsR0FBRyxXQUFXLENBQUMsQ0FBQztNQUMvRSxLQUFLO01BQ0wsSUFBSSxJQUFJLE9BQU8sSUFBSSxhQUFhLEdBQUcsYUFBYSxFQUFFO01BQ2xELE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXO01BQ25DLFFBQVEsS0FBSztNQUNiLFFBQVEsUUFBUTtNQUNoQixRQUFRLGFBQWEsR0FBRyxXQUFXO01BQ25DLE9BQU8sQ0FBQztNQUNSLEtBQUs7TUFDTCxJQUFJLElBQUksV0FBVyxFQUFFO01BQ3JCLE1BQU0sU0FBUyxJQUFJLFdBQVcsQ0FBQztNQUMvQixNQUFNLFdBQVcsSUFBSSxXQUFXLENBQUM7TUFDakMsS0FBSztNQUNMLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ3RCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxXQUFXLEdBQUcsU0FBUyxDQUFDO01BQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUM7TUFDN0IsSUFBSSxJQUFJLENBQUMsU0FBUyxHQUFHLFdBQVcsQ0FBQztNQUNqQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO01BQzNCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7TUFDekIsSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQztNQUN6QixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQzVCLElBQUksSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7TUFDMUIsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO01BQ0gsRUFBRSxPQUFPLFFBQVEsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDdEUsQ0FBQztBQUNEO01BQ0EsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFO01BQzdCLEVBQUUsT0FBTyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsTUFBTSxLQUFLLEtBQUssS0FBSyxDQUFDO01BQzNELENBQUM7QUFDRDtNQUNBLElBQUksVUFBVSxpQkFBaUIsVUFBVSxHQUFHLEVBQUU7TUFDOUMsRUFBRSxTQUFTLFVBQVUsQ0FBQyxLQUFLLEVBQUU7TUFDN0IsSUFBSSxPQUFPLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxLQUFLLFNBQVM7TUFDaEQsUUFBUSxlQUFlLEVBQUU7TUFDekIsUUFBUSxZQUFZLENBQUMsS0FBSyxDQUFDO01BQzNCLFFBQVEsS0FBSztNQUNiLFFBQVEsZUFBZSxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxFQUFFO01BQ3ZELFVBQVUsSUFBSSxJQUFJLEdBQUcsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzVDLFVBQVUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3ZDLFVBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO01BQ2xFLFNBQVMsQ0FBQyxDQUFDO01BQ1gsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLEdBQUcsR0FBRyxVQUFVLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztNQUN4QyxFQUFFLFVBQVUsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLElBQUksR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO01BQy9ELEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDO0FBQ2hEO01BQ0EsRUFBRSxVQUFVLENBQUMsRUFBRSxHQUFHLFNBQVMsRUFBRSxpQkFBaUI7TUFDOUMsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUMzQixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxRQUFRLElBQUk7TUFDdkQsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxDQUFDO01BQ2hELEdBQUcsQ0FBQztBQUNKO01BQ0E7QUFDQTtNQUNBLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRTtNQUMzRCxJQUFJLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ2pDLElBQUksT0FBTyxLQUFLLEtBQUssU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFdBQVcsQ0FBQztNQUN4RSxHQUFHLENBQUM7QUFDSjtNQUNBO0FBQ0E7TUFDQSxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxJQUFJO01BQ2pELElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUN4QixNQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLE1BQU0sSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztNQUN4QixNQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7TUFDekIsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztNQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE9BQU8sZUFBZSxFQUFFLENBQUM7TUFDN0IsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDakQsSUFBSSxPQUFPLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFDeEMsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLFNBQVMsTUFBTSxFQUFFLENBQUMsRUFBRTtNQUNwRCxJQUFJLE9BQU8sZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUM5QyxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxTQUFTLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRTtNQUNwRSxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVM7TUFDL0IsTUFBTSxVQUFVLEtBQUssRUFBRSxFQUFFLE9BQU8sS0FBSyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUU7TUFDNUUsTUFBTSxPQUFPO01BQ2IsS0FBSyxDQUFDO01BQ04sR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDeEUsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztNQUMvRCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsU0FBUyxhQUFhLEVBQUUsT0FBTyxFQUFFO01BQ3hFLElBQUksSUFBSSxPQUFPLEtBQUssSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUNwQyxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO01BQ2xELElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDcEQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO01BQ2xCLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUMzQixRQUFRLE9BQU8sZUFBZSxFQUFFLENBQUM7TUFDakMsT0FBTztNQUNQLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7TUFDL0IsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztNQUM3QixNQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO01BQ3pCLE1BQU0sSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7TUFDM0IsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLGNBQWMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDakUsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLE9BQU8sVUFBVSxDQUFDO01BQ3BCLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ1I7TUFDQSxVQUFVLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztBQUN2QztNQUNBLFVBQVUsQ0FBQyxTQUFTLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDL0MsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUMzRDtNQUNBLFNBQVMsY0FBYyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRTtNQUNsRCxFQUFFLElBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQ2pELEVBQUUsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7TUFDakMsRUFBRSxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztNQUNsQixFQUFFLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3BCLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLENBQUM7TUFDM0IsRUFBRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztNQUNyQixFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO01BQ3pCLEVBQUUsT0FBTyxJQUFJLENBQUM7TUFDZCxDQUFDO0FBQ0Q7TUFDQSxJQUFJLGlCQUFpQixDQUFDO01BQ3RCLFNBQVMsZUFBZSxHQUFHO01BQzNCLEVBQUU7TUFDRixJQUFJLGlCQUFpQjtNQUNyQixLQUFLLGlCQUFpQixHQUFHLGNBQWMsQ0FBQyxRQUFRLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxDQUFDO01BQ2pFLElBQUk7TUFDSixDQUFDO0FBQ0Q7TUFDQSxTQUFTLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQ3RDLEVBQUUsSUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUN0QixFQUFFLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDeEIsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3JCLEVBQUUsSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLFNBQVMsQ0FBQztNQUM1QixFQUFFLElBQUksTUFBTSxDQUFDO01BQ2IsRUFBRSxJQUFJLE9BQU8sQ0FBQztNQUNkLEVBQUUsSUFBSSxDQUFDLEtBQUssT0FBTyxFQUFFO01BQ3JCO01BQ0EsSUFBSSxJQUFJLENBQUMsR0FBRyxFQUFFO01BQ2QsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUU7TUFDeEQsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxPQUFPLEtBQUssS0FBSyxTQUFTLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNoRyxNQUFNLE1BQU0sR0FBRyxPQUFPO01BQ3RCLFNBQVMsVUFBVSxFQUFFO01BQ3JCLFNBQVMsR0FBRyxDQUFDLFVBQVUsS0FBSyxFQUFFLEVBQUUsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO01BQ25ELFNBQVMsSUFBSSxFQUFFO01BQ2YsU0FBUyxLQUFLLEVBQUUsQ0FBQztNQUNqQixNQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUMxQixRQUFRLE1BQU0sQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO01BQzlELE9BQU87TUFDUCxLQUFLLE1BQU07TUFDWCxNQUFNLE1BQU0sR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzdCLE1BQU0sT0FBTyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7TUFDMUUsS0FBSztNQUNMLEdBQUcsTUFBTSxJQUFJLEdBQUcsRUFBRTtNQUNsQixJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7TUFDOUIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDO01BQ2pCLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDbEMsR0FBRyxNQUFNO01BQ1QsSUFBSSxNQUFNLEdBQUcsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ25DLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQzFDLEdBQUc7TUFDSCxFQUFFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUN0QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztNQUM1QixJQUFJLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTSxDQUFDO01BQ3ZCLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7TUFDekIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztNQUM1QixJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO01BQzFCLElBQUksT0FBTyxJQUFJLENBQUM7TUFDaEIsR0FBRztNQUNILEVBQUUsT0FBTyxjQUFjLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ3pDLENBQUM7QUFDRDtNQUNBLElBQUksZUFBZSxHQUFHLHlCQUF5QixDQUFDO0FBQ2hEO01BQ0EsU0FBUyxPQUFPLENBQUMsVUFBVSxFQUFFO01BQzdCLEVBQUUsT0FBTyxPQUFPLENBQUMsVUFBVSxJQUFJLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO01BQzVELENBQUM7QUFDRDtNQUNBLElBQUksS0FBSyxpQkFBaUIsVUFBVSxpQkFBaUIsRUFBRTtNQUN2RCxFQUFFLFNBQVMsS0FBSyxDQUFDLEtBQUssRUFBRTtNQUN4QixJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEtBQUssU0FBUztNQUNoRCxRQUFRLFVBQVUsRUFBRTtNQUNwQixRQUFRLE9BQU8sQ0FBQyxLQUFLLENBQUM7TUFDdEIsUUFBUSxLQUFLO01BQ2IsUUFBUSxVQUFVLEVBQUUsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDcEMsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLGlCQUFpQixHQUFHLEtBQUssQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUM7TUFDL0QsRUFBRSxLQUFLLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLENBQUM7TUFDdEYsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDdEM7TUFDQSxFQUFFLEtBQUssQ0FBQyxFQUFFLEdBQUcsU0FBUyxFQUFFLGlCQUFpQjtNQUN6QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQzNCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsSUFBSTtNQUNsRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDM0MsR0FBRyxDQUFDO0FBQ0o7TUFDQTtBQUNBO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFO01BQzFELElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMxQixJQUFJLEtBQUssR0FBRyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ25DLElBQUksT0FBTyxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7TUFDNUIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUN2QixLQUFLO01BQ0wsSUFBSSxPQUFPLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztNQUMzQyxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsU0FBUyxJQUFJLElBQUk7TUFDMUMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7TUFDMUMsR0FBRyxDQUFDO0FBQ0o7TUFDQTtBQUNBO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksaUJBQWlCO01BQ3ZELElBQUksSUFBSSxXQUFXLEdBQUcsU0FBUyxDQUFDO0FBQ2hDO01BQ0EsSUFBSSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQ2hDLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO01BQy9DLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMxQixJQUFJLEtBQUssSUFBSSxFQUFFLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUN2RCxNQUFNLElBQUksR0FBRztNQUNiLFFBQVEsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUFFLENBQUM7TUFDOUIsUUFBUSxJQUFJLEVBQUUsSUFBSTtNQUNsQixPQUFPLENBQUM7TUFDUixLQUFLO01BQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFDeEIsTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztNQUMxQixNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3hCLE1BQU0sSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDOUIsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztNQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE9BQU8sU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNwQyxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLEVBQUUsSUFBSSxFQUFFO01BQ3BELElBQUksSUFBSSxHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO01BQ25DLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzFDLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ2pDLElBQUksSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUM1QixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDMUIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsS0FBSyxFQUFFO01BQ3BDLE1BQU0sT0FBTyxFQUFFLENBQUM7TUFDaEIsTUFBTSxJQUFJLEdBQUc7TUFDYixRQUFRLEtBQUssRUFBRSxLQUFLO01BQ3BCLFFBQVEsSUFBSSxFQUFFLElBQUk7TUFDbEIsT0FBTyxDQUFDO01BQ1IsS0FBSyxnQkFBZ0IsSUFBSSxDQUFDLENBQUM7TUFDM0IsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7TUFDeEIsTUFBTSxJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztNQUMxQixNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3hCLE1BQU0sSUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7TUFDOUIsTUFBTSxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztNQUM1QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLE9BQU8sU0FBUyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztNQUNwQyxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLElBQUk7TUFDeEMsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDekIsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxJQUFJO01BQzVDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QixNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtNQUN4QixNQUFNLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO01BQ3BCLE1BQU0sSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUM7TUFDN0IsTUFBTSxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztNQUM5QixNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO01BQzVCLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksT0FBTyxVQUFVLEVBQUUsQ0FBQztNQUN4QixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtNQUN0RCxJQUFJLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO01BQzNDLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksSUFBSSxhQUFhLEdBQUcsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdkQsSUFBSSxJQUFJLFdBQVcsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNqRCxJQUFJLElBQUksV0FBVyxLQUFLLElBQUksQ0FBQyxJQUFJLEVBQUU7TUFDbkM7TUFDQSxNQUFNLE9BQU8saUJBQWlCLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztNQUN0RSxLQUFLO01BQ0wsSUFBSSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztNQUM1QyxJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDMUIsSUFBSSxPQUFPLGFBQWEsRUFBRSxFQUFFO01BQzVCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7TUFDdkIsS0FBSztNQUNMLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ3hCLE1BQU0sSUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7TUFDMUIsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztNQUN4QixNQUFNLElBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO01BQzlCLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7TUFDNUIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLFNBQVMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUM7TUFDcEMsR0FBRyxDQUFDO0FBQ0o7TUFDQTtBQUNBO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxPQUFPLEVBQUU7TUFDbkUsSUFBSSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ3BDLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtNQUNsQixNQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7TUFDM0IsUUFBUSxPQUFPLFVBQVUsRUFBRSxDQUFDO01BQzVCLE9BQU87TUFDUCxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO01BQy9CLE1BQU0sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7TUFDN0IsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUNsRSxHQUFHLENBQUM7QUFDSjtNQUNBO0FBQ0E7TUFDQSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDL0QsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLElBQUksT0FBTyxFQUFFO01BQ2pCLE1BQU0sT0FBTyxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxTQUFTO01BQ25ELFFBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQyxFQUFFO01BQ3RELFFBQVEsT0FBTztNQUNmLE9BQU8sQ0FBQztNQUNSLEtBQUs7TUFDTCxJQUFJLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztNQUN2QixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDMUIsSUFBSSxPQUFPLElBQUksRUFBRTtNQUNqQixNQUFNLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEVBQUUsSUFBSSxDQUFDLEtBQUssS0FBSyxFQUFFO01BQ3hELFFBQVEsTUFBTTtNQUNkLE9BQU87TUFDUCxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3ZCLEtBQUs7TUFDTCxJQUFJLE9BQU8sVUFBVSxDQUFDO01BQ3RCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQ25FLElBQUksSUFBSSxPQUFPLEVBQUU7TUFDakIsTUFBTSxPQUFPLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDcEUsS0FBSztNQUNMLElBQUksSUFBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO01BQ3ZCLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMxQixJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLElBQUksSUFBSSxFQUFFO01BQ2hCLFFBQVEsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztNQUMvQixRQUFRLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO01BQ3pCLFFBQVEsT0FBTyxhQUFhLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO01BQ3hELE9BQU87TUFDUCxNQUFNLE9BQU8sWUFBWSxFQUFFLENBQUM7TUFDNUIsS0FBSyxDQUFDLENBQUM7TUFDUCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxLQUFLLENBQUM7TUFDZixDQUFDLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO0FBQ3RCO01BQ0EsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7QUFDeEI7TUFDQSxJQUFJLGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDO01BQ3JDLGNBQWMsQ0FBQyxlQUFlLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDdkMsY0FBYyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDO01BQzFDLGNBQWMsQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLElBQUksQ0FBQztNQUM3QyxjQUFjLENBQUMsVUFBVSxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUM7TUFDbkQsY0FBYyxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7TUFDN0MsY0FBYyxDQUFDLFVBQVUsR0FBRyxVQUFVLENBQUM7TUFDdkMsY0FBYyxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7TUFDekMsY0FBYyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsY0FBYyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7TUFDM0UsY0FBYyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsVUFBVSxNQUFNLEVBQUUsR0FBRyxFQUFFO01BQzdELEVBQUUsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQzdCLENBQUMsQ0FBQztNQUNGLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFFO01BQ3ZELEVBQUUsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7TUFDM0IsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxTQUFTLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUU7TUFDOUMsRUFBRSxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO01BQzFDLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7TUFDbEIsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztNQUNuQixFQUFFLEdBQUcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO01BQzFCLEVBQUUsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7TUFDcEIsRUFBRSxHQUFHLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztNQUN4QixFQUFFLE9BQU8sR0FBRyxDQUFDO01BQ2IsQ0FBQztBQUNEO01BQ0EsSUFBSSxXQUFXLENBQUM7TUFDaEIsU0FBUyxVQUFVLEdBQUc7TUFDdEIsRUFBRSxPQUFPLFdBQVcsS0FBSyxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDckQsQ0FBQztBQUNEO01BQ0EsSUFBSSxhQUFhLEdBQUcsdUJBQXVCLENBQUM7QUFDNUM7TUFDQSxTQUFTLEtBQUssQ0FBQyxRQUFRLEVBQUU7TUFDekIsRUFBRSxPQUFPLE9BQU8sQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7TUFDdEQsQ0FBQztBQUNEO01BQ0EsU0FBUyxZQUFZLENBQUMsZUFBZSxFQUFFO01BQ3ZDLEVBQUUsT0FBTyxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksU0FBUyxDQUFDLGVBQWUsQ0FBQyxDQUFDO01BQzlELENBQUM7QUFDRDtNQUNBLFNBQVMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDekIsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDZixJQUFJLE9BQU8sSUFBSSxDQUFDO01BQ2hCLEdBQUc7QUFDSDtNQUNBLEVBQUU7TUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztNQUNwQixLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztNQUN2RSxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUssU0FBUztNQUMzQixNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssU0FBUztNQUM1QixNQUFNLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQztNQUM1QixJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDO01BQzdCLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7TUFDakMsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztNQUNqQyxJQUFJO01BQ0osSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7TUFDcEMsSUFBSSxPQUFPLElBQUksQ0FBQztNQUNoQixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksY0FBYyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pDO01BQ0EsRUFBRSxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtNQUNwQixJQUFJLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztNQUM5QixJQUFJO01BQ0osTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUM5QixRQUFRLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7TUFDekMsUUFBUSxPQUFPLEtBQUssSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxLQUFLLGNBQWMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDL0UsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLElBQUk7TUFDL0IsTUFBTTtNQUNOLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3RCO01BQ0EsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxFQUFFO01BQzVCLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtNQUM5QixNQUFNLElBQUksT0FBTyxDQUFDLENBQUMsV0FBVyxLQUFLLFVBQVUsRUFBRTtNQUMvQyxRQUFRLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztNQUN4QixPQUFPO01BQ1AsS0FBSyxNQUFNO01BQ1gsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO01BQ3JCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNaLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNaLEtBQUs7TUFDTCxHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztNQUN0QixFQUFFLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQzFDLElBQUk7TUFDSixNQUFNLGNBQWM7TUFDcEIsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO01BQ25CLFVBQVUsT0FBTztNQUNqQixVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNuQyxVQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNuQyxNQUFNO01BQ04sTUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDO01BQ3ZCLE1BQU0sT0FBTyxLQUFLLENBQUM7TUFDbkIsS0FBSztNQUNMLEdBQUcsQ0FBQyxDQUFDO0FBQ0w7TUFDQSxFQUFFLE9BQU8sUUFBUSxJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDO01BQ3RDLENBQUM7QUFDRDtNQUNBLFNBQVMsS0FBSyxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUU7TUFDOUIsRUFBRSxJQUFJLFNBQVMsR0FBRyxVQUFVLEdBQUcsRUFBRTtNQUNqQyxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3ZDLEdBQUcsQ0FBQztNQUNKLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7TUFDMUMsRUFBRSxNQUFNLENBQUMscUJBQXFCO01BQzlCLElBQUksTUFBTSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztNQUM3RCxFQUFFLE9BQU8sSUFBSSxDQUFDO01BQ2QsQ0FBQztBQUNEO01BQ0EsU0FBUyxJQUFJLENBQUMsS0FBSyxFQUFFO01BQ3JCLEVBQUUsSUFBSSxDQUFDLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7TUFDM0MsSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO01BQ0gsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO01BQzVCLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNqQyxNQUFNLE9BQU8sS0FBSyxDQUFDO01BQ25CLEtBQUs7TUFDTCxJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDdkIsR0FBRztNQUNILEVBQUUsSUFBSSxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDdEIsSUFBSSxJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7TUFDdEIsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUNwQyxNQUFNLFFBQVEsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDNUIsS0FBSyxDQUFDLENBQUM7TUFDUCxJQUFJLE9BQU8sUUFBUSxDQUFDO01BQ3BCLEdBQUc7TUFDSCxFQUFFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztNQUNsQixFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUU7TUFDL0IsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3pCLEdBQUcsQ0FBQyxDQUFDO01BQ0wsRUFBRSxPQUFPLE1BQU0sQ0FBQztNQUNoQixDQUFDO0FBQ0Q7TUFDQSxJQUFJLEdBQUcsaUJBQWlCLFVBQVUsYUFBYSxFQUFFO01BQ2pELEVBQUUsU0FBUyxHQUFHLENBQUMsS0FBSyxFQUFFO01BQ3RCLElBQUksT0FBTyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssS0FBSyxTQUFTO01BQ2hELFFBQVEsUUFBUSxFQUFFO01BQ2xCLFFBQVEsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQztNQUN6QyxRQUFRLEtBQUs7TUFDYixRQUFRLFFBQVEsRUFBRSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsRUFBRTtNQUNoRCxVQUFVLElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUMxQyxVQUFVLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN2QyxVQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDNUQsU0FBUyxDQUFDLENBQUM7TUFDWCxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssYUFBYSxHQUFHLEdBQUcsQ0FBQyxTQUFTLEdBQUcsYUFBYSxDQUFDO01BQ3JELEVBQUUsR0FBRyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLGFBQWEsSUFBSSxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUM7TUFDNUUsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7QUFDbEM7TUFDQSxFQUFFLEdBQUcsQ0FBQyxFQUFFLEdBQUcsU0FBUyxFQUFFLGlCQUFpQjtNQUN2QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO01BQzNCLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxFQUFFLEtBQUssRUFBRTtNQUMzQyxJQUFJLE9BQU8sSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO01BQ2pELEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLElBQUksRUFBRTtNQUM1QyxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7TUFDdEMsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNO01BQ3RCLFFBQVEsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUMzRCxRQUFRLFFBQVEsRUFBRSxDQUFDO01BQ25CLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxFQUFFLElBQUksRUFBRTtNQUNwQyxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7TUFDdEMsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNO01BQ3RCLFFBQVEsWUFBWSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQztNQUN2RCxRQUFRLFFBQVEsRUFBRSxDQUFDO01BQ25CLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxTQUFTLFFBQVEsSUFBSTtNQUNoRCxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7TUFDekMsR0FBRyxDQUFDO0FBQ0o7TUFDQTtBQUNBO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsRUFBRSxLQUFLLEVBQUU7TUFDM0MsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQ2hDLEdBQUcsQ0FBQztBQUNKO01BQ0E7QUFDQTtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO01BQzNDLElBQUksT0FBTyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO01BQ3hELEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUU7TUFDakQsSUFBSSxPQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztNQUNwRCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLElBQUk7TUFDMUMsSUFBSSxPQUFPLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO01BQzlDLEdBQUcsQ0FBQztBQUNKO01BQ0E7QUFDQTtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRTtNQUNyRCxJQUFJLElBQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUN4QjtNQUNBO01BQ0EsSUFBSSxJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDM0I7TUFDQSxJQUFJLElBQUksTUFBTSxHQUFHLFNBQVM7TUFDMUIsTUFBTSxJQUFJO01BQ1YsTUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEdBQUcsRUFBRTtNQUMxQyxRQUFRLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QjtNQUNBLFFBQVEsSUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUMxRDtNQUNBLFFBQVEsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzFCLFVBQVUsVUFBVSxHQUFHLElBQUksQ0FBQztNQUM1QixTQUFTO0FBQ1Q7TUFDQSxRQUFRLE9BQU8sQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDaEMsT0FBTyxFQUFFLE9BQU8sQ0FBQztNQUNqQixLQUFLLENBQUM7QUFDTjtNQUNBLElBQUksT0FBTyxVQUFVLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQztNQUN0QyxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxLQUFLLElBQUk7TUFDMUMsSUFBSSxJQUFJLEtBQUssR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUM7TUFDM0MsSUFBSSxRQUFRLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxHQUFHLEVBQUUsR0FBRyxTQUFTLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFDcEQ7TUFDQSxJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUNoRSxJQUFJLElBQUksS0FBSyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7TUFDNUIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUNsRSxNQUFNLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztNQUN4QyxLQUFLO01BQ0wsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLEVBQUU7TUFDN0MsTUFBTSxLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtNQUNoRCxRQUFRLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUUsRUFBRSxPQUFPLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDdEYsT0FBTztNQUNQLEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxJQUFJO01BQ2xELElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO01BQzNDLElBQUksUUFBUSxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3BEO01BQ0EsSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzVCLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsRUFBRSxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUN2RSxJQUFJLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztNQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUU7TUFDbEMsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxVQUFVLElBQUksRUFBRSxFQUFFLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUMxRSxRQUFRLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDN0IsT0FBTztNQUNQLEtBQUssQ0FBQyxDQUFDO01BQ1AsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLEVBQUU7TUFDN0MsTUFBTSxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQVUsS0FBSyxFQUFFO01BQ3hDLFFBQVEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztNQUMxQixPQUFPLENBQUMsQ0FBQztNQUNULEtBQUssQ0FBQyxDQUFDO01BQ1AsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxJQUFJO01BQ2hELElBQUksSUFBSSxLQUFLLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO01BQzNDLElBQUksUUFBUSxHQUFHLEVBQUUsR0FBRyxLQUFLLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3BEO01BQ0EsSUFBSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO01BQzVCLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLEVBQUUsRUFBRSxPQUFPLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUN2RSxJQUFJLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztNQUN0QixJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUU7TUFDbEMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDeEUsUUFBUSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO01BQzdCLE9BQU87TUFDUCxLQUFLLENBQUMsQ0FBQztNQUNQLElBQUksT0FBTyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsR0FBRyxFQUFFO01BQzdDLE1BQU0sUUFBUSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUssRUFBRTtNQUN4QyxRQUFRLEdBQUcsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDMUIsT0FBTyxDQUFDLENBQUM7TUFDVCxLQUFLLENBQUMsQ0FBQztNQUNQLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxTQUFTLElBQUksRUFBRSxVQUFVLEVBQUU7TUFDbEQ7TUFDQSxJQUFJLE9BQU8sVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztNQUNyRCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsU0FBUyxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRTtNQUM5RDtNQUNBLElBQUksT0FBTyxVQUFVLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztNQUM3RCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLElBQUk7TUFDcEQsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7TUFDbEMsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEdBQUcsQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsU0FBUyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7TUFDN0QsSUFBSSxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDeEI7TUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNyRixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsR0FBRyxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtNQUNqRSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQy9DLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxHQUFHLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxTQUFTLGFBQWEsRUFBRSxPQUFPLEVBQUU7TUFDakUsSUFBSSxJQUFJLE9BQU8sS0FBSyxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ3BDLE1BQU0sT0FBTyxJQUFJLENBQUM7TUFDbEIsS0FBSztNQUNMLElBQUksSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUM7TUFDbEQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO01BQ2xCLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUMzQixRQUFRLE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO01BQzlCLE9BQU87TUFDUCxNQUFNLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO01BQy9CLE1BQU0sSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7TUFDekIsTUFBTSxPQUFPLElBQUksQ0FBQztNQUNsQixLQUFLO01BQ0wsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ3hDLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxPQUFPLEdBQUcsQ0FBQztNQUNiLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0FBQ2xCO01BQ0EsR0FBRyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7QUFDbEI7TUFDQSxJQUFJLFlBQVksR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO01BQ2pDLFlBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUM7TUFDbkMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7TUFDM0MsWUFBWSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUMsTUFBTSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUM7TUFDOUQsWUFBWSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7TUFDM0MsWUFBWSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7TUFDdkMsWUFBWSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsWUFBWSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7TUFDdkUsWUFBWSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsVUFBVSxNQUFNLEVBQUUsR0FBRyxFQUFFO01BQzNELEVBQUUsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO01BQ3pCLENBQUMsQ0FBQztNQUNGLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxHQUFHLFVBQVUsR0FBRyxFQUFFO01BQ3JELEVBQUUsT0FBTyxHQUFHLENBQUMsV0FBVyxFQUFFLENBQUM7TUFDM0IsQ0FBQyxDQUFDO0FBQ0Y7TUFDQSxZQUFZLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztNQUNoQyxZQUFZLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztBQUM5QjtNQUNBLFNBQVMsU0FBUyxDQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUU7TUFDaEMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxTQUFTLEVBQUU7TUFDckIsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUM7TUFDM0IsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztNQUN0QixJQUFJLE9BQU8sR0FBRyxDQUFDO01BQ2YsR0FBRztNQUNILEVBQUUsT0FBTyxNQUFNLEtBQUssR0FBRyxDQUFDLElBQUk7TUFDNUIsTUFBTSxHQUFHO01BQ1QsTUFBTSxNQUFNLENBQUMsSUFBSSxLQUFLLENBQUM7TUFDdkIsTUFBTSxHQUFHLENBQUMsT0FBTyxFQUFFO01BQ25CLE1BQU0sR0FBRyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztNQUN6QixDQUFDO0FBQ0Q7TUFDQSxTQUFTLE9BQU8sQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFO01BQy9CLEVBQUUsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztNQUN4QyxFQUFFLEdBQUcsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO01BQ2hDLEVBQUUsR0FBRyxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7TUFDakIsRUFBRSxHQUFHLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQztNQUMxQixFQUFFLE9BQU8sR0FBRyxDQUFDO01BQ2IsQ0FBQztBQUNEO01BQ0EsSUFBSSxTQUFTLENBQUM7TUFDZCxTQUFTLFFBQVEsR0FBRztNQUNwQixFQUFFLE9BQU8sU0FBUyxLQUFLLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3hELENBQUM7QUFDRDtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQSxJQUFJLEtBQUssaUJBQWlCLFVBQVUsVUFBVSxFQUFFO01BQ2hELEVBQUUsU0FBUyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7TUFDbkMsSUFBSSxJQUFJLEVBQUUsSUFBSSxZQUFZLEtBQUssQ0FBQyxFQUFFO01BQ2xDLE1BQU0sT0FBTyxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO01BQ3pDLEtBQUs7TUFDTCxJQUFJLFNBQVMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFLDBCQUEwQixDQUFDLENBQUM7TUFDdEQsSUFBSSxLQUFLLEdBQUcsS0FBSyxJQUFJLENBQUMsQ0FBQztNQUN2QixJQUFJLElBQUksR0FBRyxLQUFLLFNBQVMsRUFBRTtNQUMzQixNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUM7TUFDckIsS0FBSztNQUNMLElBQUksSUFBSSxHQUFHLElBQUksS0FBSyxTQUFTLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbkQsSUFBSSxJQUFJLEdBQUcsR0FBRyxLQUFLLEVBQUU7TUFDckIsTUFBTSxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUM7TUFDbkIsS0FBSztNQUNMLElBQUksSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7TUFDeEIsSUFBSSxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztNQUNwQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO01BQ3RCLElBQUksSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxHQUFHLEtBQUssSUFBSSxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7TUFDckUsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO01BQ3pCLE1BQU0sSUFBSSxXQUFXLEVBQUU7TUFDdkIsUUFBUSxPQUFPLFdBQVcsQ0FBQztNQUMzQixPQUFPO01BQ1AsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDO01BQ3pCLEtBQUs7TUFDTCxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLEdBQUcsVUFBVSxDQUFDO01BQ2pELEVBQUUsS0FBSyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLFVBQVUsSUFBSSxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUM7TUFDeEUsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7QUFDdEM7TUFDQSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxJQUFJO01BQ2xELElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsRUFBRTtNQUN6QixNQUFNLE9BQU8sVUFBVSxDQUFDO01BQ3hCLEtBQUs7TUFDTCxJQUFJO01BQ0osTUFBTSxVQUFVO01BQ2hCLE1BQU0sSUFBSSxDQUFDLE1BQU07TUFDakIsTUFBTSxLQUFLO01BQ1gsTUFBTSxJQUFJLENBQUMsSUFBSTtNQUNmLE9BQU8sSUFBSSxDQUFDLEtBQUssS0FBSyxDQUFDLEdBQUcsTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO01BQ25ELE1BQU0sSUFBSTtNQUNWLE1BQU07TUFDTixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBRTtNQUMxRCxJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUM7TUFDMUIsUUFBUSxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUs7TUFDekQsUUFBUSxXQUFXLENBQUM7TUFDcEIsR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFNBQVMsUUFBUSxFQUFFLFdBQVcsRUFBRTtNQUM3RCxJQUFJLElBQUksYUFBYSxHQUFHLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQztNQUNqRSxJQUFJO01BQ0osTUFBTSxhQUFhLElBQUksQ0FBQztNQUN4QixNQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsSUFBSTtNQUMvQixNQUFNLGFBQWEsS0FBSyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQztNQUNqRCxNQUFNO01BQ04sR0FBRyxDQUFDO0FBQ0o7TUFDQSxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFNBQVMsS0FBSyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7TUFDdEQsSUFBSSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtNQUMzQyxNQUFNLE9BQU8sSUFBSSxDQUFDO01BQ2xCLEtBQUs7TUFDTCxJQUFJLEtBQUssR0FBRyxZQUFZLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUMzQyxJQUFJLEdBQUcsR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNyQyxJQUFJLElBQUksR0FBRyxJQUFJLEtBQUssRUFBRTtNQUN0QixNQUFNLE9BQU8sSUFBSSxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQzdCLEtBQUs7TUFDTCxJQUFJLE9BQU8sSUFBSSxLQUFLO01BQ3BCLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQztNQUNoQyxNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7TUFDOUIsTUFBTSxJQUFJLENBQUMsS0FBSztNQUNoQixLQUFLLENBQUM7TUFDTixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxPQUFPLEVBQUUsV0FBVyxFQUFFO01BQzNELElBQUksSUFBSSxXQUFXLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDaEQsSUFBSSxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsRUFBRTtNQUN4QyxNQUFNLElBQUksS0FBSyxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO01BQzNDLE1BQU0sSUFBSSxLQUFLLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFO01BQzNDLFFBQVEsT0FBTyxLQUFLLENBQUM7TUFDckIsT0FBTztNQUNQLEtBQUs7TUFDTCxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7TUFDZCxHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsU0FBUyxXQUFXLEVBQUUsV0FBVyxFQUFFO01BQ25FLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO01BQ3JDLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLFNBQVMsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFO01BQy9ELElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUN6QixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDMUIsSUFBSSxJQUFJLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDeEUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDZCxJQUFJLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRTtNQUN2QixNQUFNLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxPQUFPLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLEtBQUssRUFBRTtNQUNqRSxRQUFRLE1BQU07TUFDZCxPQUFPO01BQ1AsTUFBTSxLQUFLLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztNQUN0QyxLQUFLO01BQ0wsSUFBSSxPQUFPLENBQUMsQ0FBQztNQUNiLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxTQUFTLFVBQVUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO01BQ25FLElBQUksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztNQUN6QixJQUFJLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7TUFDMUIsSUFBSSxJQUFJLEtBQUssR0FBRyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7TUFDeEUsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDZCxJQUFJLE9BQU8sSUFBSSxRQUFRLENBQUMsWUFBWTtNQUNwQyxNQUFNLElBQUksQ0FBQyxLQUFLLElBQUksRUFBRTtNQUN0QixRQUFRLE9BQU8sWUFBWSxFQUFFLENBQUM7TUFDOUIsT0FBTztNQUNQLE1BQU0sSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDO01BQ3BCLE1BQU0sS0FBSyxJQUFJLE9BQU8sR0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7TUFDdEMsTUFBTSxPQUFPLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUNoRSxLQUFLLENBQUMsQ0FBQztNQUNQLEdBQUcsQ0FBQztBQUNKO01BQ0EsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxTQUFTLE1BQU0sRUFBRSxLQUFLLEVBQUU7TUFDbkQsSUFBSSxPQUFPLEtBQUssWUFBWSxLQUFLO01BQ2pDLFFBQVEsSUFBSSxDQUFDLE1BQU0sS0FBSyxLQUFLLENBQUMsTUFBTTtNQUNwQyxVQUFVLElBQUksQ0FBQyxJQUFJLEtBQUssS0FBSyxDQUFDLElBQUk7TUFDbEMsVUFBVSxJQUFJLENBQUMsS0FBSyxLQUFLLEtBQUssQ0FBQyxLQUFLO01BQ3BDLFFBQVEsU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztNQUMvQixHQUFHLENBQUM7QUFDSjtNQUNBLEVBQUUsT0FBTyxLQUFLLENBQUM7TUFDZixDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUNmO01BQ0EsSUFBSSxXQUFXLENBQUM7QUFDaEI7TUFDQSxTQUFTLE9BQU8sQ0FBQyxVQUFVLEVBQUUsYUFBYSxFQUFFLFdBQVcsRUFBRTtNQUN6RCxFQUFFLElBQUksT0FBTyxHQUFHLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztNQUM3QyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNaLEVBQUUsT0FBTyxDQUFDLEtBQUssT0FBTyxDQUFDLE1BQU0sRUFBRTtNQUMvQixJQUFJLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ3hELElBQUksSUFBSSxVQUFVLEtBQUssT0FBTyxFQUFFO01BQ2hDLE1BQU0sT0FBTyxXQUFXLENBQUM7TUFDekIsS0FBSztNQUNMLEdBQUc7TUFDSCxFQUFFLE9BQU8sVUFBVSxDQUFDO01BQ3BCLENBQUM7QUFDRDtNQUNBLFNBQVMsS0FBSyxDQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUU7TUFDM0MsRUFBRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO01BQ25ELENBQUM7QUFDRDtNQUNBLFNBQVMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7TUFDdEMsRUFBRSxPQUFPLE9BQU8sQ0FBQyxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxLQUFLLE9BQU8sQ0FBQztNQUMzRCxDQUFDO0FBQ0Q7TUFDQSxTQUFTLEtBQUssQ0FBQyxhQUFhLEVBQUU7TUFDOUIsRUFBRSxPQUFPLE9BQU8sQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7TUFDdEMsQ0FBQztBQUNEO01BQ0EsU0FBUyxRQUFRLEdBQUc7TUFDcEIsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDL0IsRUFBRSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7TUFDbEIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBRTtNQUNqQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDbEIsR0FBRyxDQUFDLENBQUM7TUFDTCxFQUFFLE9BQU8sTUFBTSxDQUFDO01BQ2hCLENBQUM7QUFDRDtNQUNBO01BQ0EsVUFBVSxDQUFDLFVBQVUsR0FBRyxZQUFZLENBQUM7TUFDckMsVUFBVSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7TUFDN0IsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7TUFDakMsVUFBVSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7TUFDekMsVUFBVSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7QUFDakM7TUFDQSxVQUFVLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUMvQjtNQUNBLEtBQUssQ0FBQyxVQUFVLEVBQUU7TUFDbEI7QUFDQTtNQUNBLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxHQUFHO01BQzlCLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ2pDLElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQztNQUMxQyxJQUFJLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUNsQyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztNQUNkLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUU7TUFDbkM7TUFDQSxNQUFNLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFNBQVMsR0FBRyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7TUFDMUMsS0FBSyxDQUFDLENBQUM7TUFDUCxJQUFJLE9BQU8sS0FBSyxDQUFDO01BQ2pCLEdBQUc7QUFDSDtNQUNBLEVBQUUsWUFBWSxFQUFFLFNBQVMsWUFBWSxHQUFHO01BQ3hDLElBQUksT0FBTyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3ZDLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxFQUFFLFNBQVMsTUFBTSxHQUFHO01BQzFCLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdEIsR0FBRztBQUNIO01BQ0EsRUFBRSxVQUFVLEVBQUUsU0FBUyxVQUFVLEdBQUc7TUFDcEMsSUFBSSxPQUFPLElBQUksZUFBZSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztNQUMzQyxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssRUFBRSxTQUFTLEtBQUssR0FBRztNQUMxQjtNQUNBLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7TUFDbEMsR0FBRztBQUNIO01BQ0EsRUFBRSxRQUFRLEVBQUUsUUFBUTtBQUNwQjtNQUNBLEVBQUUsWUFBWSxFQUFFLFNBQVMsWUFBWSxHQUFHO01BQ3hDO01BQ0EsSUFBSSxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQztNQUN6QyxHQUFHO0FBQ0g7TUFDQSxFQUFFLFlBQVksRUFBRSxTQUFTLFlBQVksR0FBRztNQUN4QztNQUNBLElBQUksT0FBTyxVQUFVLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztNQUM5RCxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssRUFBRSxTQUFTLEtBQUssR0FBRztNQUMxQjtNQUNBLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztNQUN2RCxHQUFHO0FBQ0g7TUFDQSxFQUFFLFFBQVEsRUFBRSxTQUFTLFFBQVEsR0FBRztNQUNoQyxJQUFJLE9BQU8sSUFBSSxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDbkMsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLEVBQUUsU0FBUyxLQUFLLEdBQUc7TUFDMUIsSUFBSSxPQUFPLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDMUIsUUFBUSxJQUFJLENBQUMsWUFBWSxFQUFFO01BQzNCLFFBQVEsT0FBTyxDQUFDLElBQUksQ0FBQztNQUNyQixRQUFRLElBQUksQ0FBQyxVQUFVLEVBQUU7TUFDekIsUUFBUSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7TUFDeEIsR0FBRztBQUNIO01BQ0EsRUFBRSxPQUFPLEVBQUUsU0FBUyxPQUFPLEdBQUc7TUFDOUI7TUFDQSxJQUFJLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7TUFDekQsR0FBRztBQUNIO01BQ0EsRUFBRSxNQUFNLEVBQUUsU0FBUyxNQUFNLEdBQUc7TUFDNUI7TUFDQSxJQUFJLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUM7TUFDeEQsR0FBRztBQUNIO01BQ0E7QUFDQTtNQUNBLEVBQUUsUUFBUSxFQUFFLFNBQVMsUUFBUSxHQUFHO01BQ2hDLElBQUksT0FBTyxjQUFjLENBQUM7TUFDMUIsR0FBRztBQUNIO01BQ0EsRUFBRSxVQUFVLEVBQUUsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRTtNQUM5QyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLEVBQUU7TUFDekIsTUFBTSxPQUFPLElBQUksR0FBRyxJQUFJLENBQUM7TUFDekIsS0FBSztNQUNMLElBQUk7TUFDSixNQUFNLElBQUk7TUFDVixNQUFNLEdBQUc7TUFDVCxNQUFNLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztNQUN4RCxNQUFNLEdBQUc7TUFDVCxNQUFNLElBQUk7TUFDVixNQUFNO01BQ04sR0FBRztBQUNIO01BQ0E7QUFDQTtNQUNBLEVBQUUsTUFBTSxFQUFFLFNBQVMsTUFBTSxHQUFHO01BQzVCLElBQUksSUFBSSxNQUFNLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDO01BQzVDLElBQUksUUFBUSxHQUFHLEVBQUUsR0FBRyxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsU0FBUyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBQ3JEO01BQ0EsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO01BQ3BELEdBQUc7QUFDSDtNQUNBLEVBQUUsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFDLFdBQVcsRUFBRTtNQUMzQyxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztNQUMxRSxHQUFHO0FBQ0g7TUFDQSxFQUFFLE9BQU8sRUFBRSxTQUFTLE9BQU8sR0FBRztNQUM5QixJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztNQUM1QyxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssRUFBRSxTQUFTLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO01BQzVDLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ2pDLElBQUksSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDO01BQzNCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQ3RDLE1BQU0sSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7TUFDN0MsUUFBUSxXQUFXLEdBQUcsS0FBSyxDQUFDO01BQzVCLFFBQVEsT0FBTyxLQUFLLENBQUM7TUFDckIsT0FBTztNQUNQLEtBQUssQ0FBQyxDQUFDO01BQ1AsSUFBSSxPQUFPLFdBQVcsQ0FBQztNQUN2QixHQUFHO0FBQ0g7TUFDQSxFQUFFLE1BQU0sRUFBRSxTQUFTLE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO01BQzlDLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQ3RFLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxFQUFFLFNBQVMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO01BQ3ZELElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDbkQsSUFBSSxPQUFPLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDO01BQzFDLEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxDQUFDLFVBQVUsRUFBRSxPQUFPLEVBQUU7TUFDakQsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDakMsSUFBSSxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUM7TUFDM0UsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsU0FBUyxFQUFFO01BQ2pDLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ2pDLElBQUksU0FBUyxHQUFHLFNBQVMsS0FBSyxTQUFTLEdBQUcsRUFBRSxHQUFHLFNBQVMsR0FBRyxHQUFHLENBQUM7TUFDL0QsSUFBSSxJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7TUFDcEIsSUFBSSxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUM7TUFDdkIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxFQUFFO01BQ2hDLE1BQU0sT0FBTyxJQUFJLE9BQU8sR0FBRyxLQUFLLEtBQUssTUFBTSxJQUFJLFNBQVMsQ0FBQyxDQUFDO01BQzFELE1BQU0sTUFBTSxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLFNBQVMsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEdBQUcsRUFBRSxDQUFDO01BQ2xFLEtBQUssQ0FBQyxDQUFDO01BQ1AsSUFBSSxPQUFPLE1BQU0sQ0FBQztNQUNsQixHQUFHO0FBQ0g7TUFDQSxFQUFFLElBQUksRUFBRSxTQUFTLElBQUksR0FBRztNQUN4QixJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztNQUN6QyxHQUFHO0FBQ0g7TUFDQSxFQUFFLEdBQUcsRUFBRSxTQUFTLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFO01BQ3JDLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7TUFDMUQsR0FBRztBQUNIO01BQ0EsRUFBRSxNQUFNLEVBQUUsU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRTtNQUNoRSxJQUFJLE9BQU8sTUFBTTtNQUNqQixNQUFNLElBQUk7TUFDVixNQUFNLE9BQU87TUFDYixNQUFNLGdCQUFnQjtNQUN0QixNQUFNLE9BQU87TUFDYixNQUFNLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztNQUMxQixNQUFNLEtBQUs7TUFDWCxLQUFLLENBQUM7TUFDTixHQUFHO0FBQ0g7TUFDQSxFQUFFLFdBQVcsRUFBRSxTQUFTLFdBQVcsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFO01BQ3hFLElBQUksT0FBTyxNQUFNO01BQ2pCLE1BQU0sSUFBSTtNQUNWLE1BQU0sT0FBTztNQUNiLE1BQU0sZ0JBQWdCO01BQ3RCLE1BQU0sT0FBTztNQUNiLE1BQU0sU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDO01BQzFCLE1BQU0sSUFBSTtNQUNWLEtBQUssQ0FBQztNQUNOLEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxHQUFHO01BQzlCLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUNuRCxHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssRUFBRSxTQUFTLEtBQUssQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFO01BQ3BDLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO01BQzdELEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxFQUFFLFNBQVMsSUFBSSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7TUFDMUMsSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDaEQsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsVUFBVSxFQUFFO01BQ2xDLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztNQUN0RCxHQUFHO0FBQ0g7TUFDQSxFQUFFLE1BQU0sRUFBRSxTQUFTLE1BQU0sR0FBRztNQUM1QixJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztNQUMzQyxHQUFHO0FBQ0g7TUFDQTtBQUNBO01BQ0EsRUFBRSxPQUFPLEVBQUUsU0FBUyxPQUFPLEdBQUc7TUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDN0IsR0FBRztBQUNIO01BQ0EsRUFBRSxPQUFPLEVBQUUsU0FBUyxPQUFPLEdBQUc7TUFDOUIsSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDaEcsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLEVBQUUsU0FBUyxLQUFLLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRTtNQUM1QyxJQUFJLE9BQU8sVUFBVTtNQUNyQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsR0FBRyxJQUFJO01BQ2hFLEtBQUssQ0FBQztNQUNOLEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7TUFDOUMsSUFBSSxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2xELEdBQUc7QUFDSDtNQUNBLEVBQUUsTUFBTSxFQUFFLFNBQVMsTUFBTSxDQUFDLEtBQUssRUFBRTtNQUNqQyxJQUFJLE9BQU8sU0FBUyxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztNQUNsQyxHQUFHO0FBQ0g7TUFDQSxFQUFFLFFBQVEsRUFBRSxTQUFTLFFBQVEsR0FBRztNQUNoQyxJQUFJLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztNQUMxQixJQUFJLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtNQUMzQjtNQUNBLE1BQU0sT0FBTyxJQUFJLFFBQVEsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7TUFDN0MsS0FBSztNQUNMLElBQUksSUFBSSxlQUFlLEdBQUcsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQztNQUM3RSxJQUFJLGVBQWUsQ0FBQyxZQUFZLEdBQUcsWUFBWSxFQUFFLE9BQU8sVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsQ0FBQztNQUM5RSxJQUFJLE9BQU8sZUFBZSxDQUFDO01BQzNCLEdBQUc7QUFDSDtNQUNBLEVBQUUsU0FBUyxFQUFFLFNBQVMsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7TUFDcEQsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2hELEdBQUc7QUFDSDtNQUNBLEVBQUUsU0FBUyxFQUFFLFNBQVMsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFO01BQ2pFLElBQUksSUFBSSxLQUFLLEdBQUcsV0FBVyxDQUFDO01BQzVCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFO01BQ3RDLE1BQU0sSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO01BQzVDLFFBQVEsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQ3ZCLFFBQVEsT0FBTyxLQUFLLENBQUM7TUFDckIsT0FBTztNQUNQLEtBQUssQ0FBQyxDQUFDO01BQ1AsSUFBSSxPQUFPLEtBQUssQ0FBQztNQUNqQixHQUFHO0FBQ0g7TUFDQSxFQUFFLE9BQU8sRUFBRSxTQUFTLE9BQU8sQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO01BQ2hELElBQUksSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUM7TUFDbkQsSUFBSSxPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7TUFDN0IsR0FBRztBQUNIO01BQ0EsRUFBRSxRQUFRLEVBQUUsU0FBUyxRQUFRLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUU7TUFDL0QsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQztNQUM3RSxHQUFHO0FBQ0g7TUFDQSxFQUFFLGFBQWEsRUFBRSxTQUFTLGFBQWEsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRTtNQUN6RSxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRTtNQUM1QixPQUFPLE9BQU8sRUFBRTtNQUNoQixPQUFPLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcsQ0FBQyxDQUFDO01BQ2xELEdBQUc7QUFDSDtNQUNBLEVBQUUsV0FBVyxFQUFFLFNBQVMsV0FBVyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7TUFDeEQsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ25FLEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxFQUFFLFNBQVMsS0FBSyxDQUFDLFdBQVcsRUFBRTtNQUNyQyxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDO01BQ3BELEdBQUc7QUFDSDtNQUNBLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUU7TUFDN0MsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztNQUM5RCxHQUFHO0FBQ0g7TUFDQSxFQUFFLE9BQU8sRUFBRSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7TUFDbkMsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUMxRCxHQUFHO0FBQ0g7TUFDQSxFQUFFLFlBQVksRUFBRSxTQUFTLFlBQVksR0FBRztNQUN4QyxJQUFJLE9BQU8sSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN6QyxHQUFHO0FBQ0g7TUFDQSxFQUFFLEdBQUcsRUFBRSxTQUFTLEdBQUcsQ0FBQyxTQUFTLEVBQUUsV0FBVyxFQUFFO01BQzVDLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLFdBQVcsQ0FBQyxDQUFDO01BQy9GLEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxFQUFFLEtBQUs7QUFDZDtNQUNBLEVBQUUsT0FBTyxFQUFFLFNBQVMsT0FBTyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7TUFDOUMsSUFBSSxPQUFPLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO01BQ2xELEdBQUc7QUFDSDtNQUNBLEVBQUUsR0FBRyxFQUFFLFNBQVMsR0FBRyxDQUFDLFNBQVMsRUFBRTtNQUMvQixJQUFJLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLEtBQUssT0FBTyxDQUFDO01BQ3BELEdBQUc7QUFDSDtNQUNBLEVBQUUsS0FBSyxFQUFFLEtBQUs7QUFDZDtNQUNBLEVBQUUsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFDLElBQUksRUFBRTtNQUNwQyxJQUFJLElBQUksR0FBRyxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssVUFBVSxHQUFHLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDekUsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxLQUFLLEVBQUUsRUFBRSxPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDekUsR0FBRztBQUNIO01BQ0EsRUFBRSxVQUFVLEVBQUUsU0FBUyxVQUFVLENBQUMsSUFBSSxFQUFFO01BQ3hDLElBQUksSUFBSSxHQUFHLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxVQUFVLEdBQUcsSUFBSSxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN6RSxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUMvQixHQUFHO0FBQ0g7TUFDQSxFQUFFLEtBQUssRUFBRSxTQUFTLEtBQUssQ0FBQyxXQUFXLEVBQUU7TUFDckMsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7TUFDN0UsR0FBRztBQUNIO01BQ0EsRUFBRSxNQUFNLEVBQUUsU0FBUyxNQUFNLEdBQUc7TUFDNUIsSUFBSSxPQUFPLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUM7TUFDdEQsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsV0FBVyxFQUFFO01BQ25DLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO01BQ3JELEdBQUc7QUFDSDtNQUNBLEVBQUUsU0FBUyxFQUFFLFNBQVMsU0FBUyxDQUFDLFdBQVcsRUFBRTtNQUM3QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztNQUMxRCxHQUFHO0FBQ0g7TUFDQSxFQUFFLEdBQUcsRUFBRSxTQUFTLEdBQUcsQ0FBQyxVQUFVLEVBQUU7TUFDaEMsSUFBSSxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7TUFDeEMsR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLEVBQUUsU0FBUyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtNQUM1QyxJQUFJLE9BQU8sVUFBVSxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUM7TUFDaEQsR0FBRztBQUNIO01BQ0EsRUFBRSxHQUFHLEVBQUUsU0FBUyxHQUFHLENBQUMsVUFBVSxFQUFFO01BQ2hDLElBQUksT0FBTyxVQUFVO01BQ3JCLE1BQU0sSUFBSTtNQUNWLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxvQkFBb0I7TUFDekQsS0FBSyxDQUFDO01BQ04sR0FBRztBQUNIO01BQ0EsRUFBRSxLQUFLLEVBQUUsU0FBUyxLQUFLLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtNQUM1QyxJQUFJLE9BQU8sVUFBVTtNQUNyQixNQUFNLElBQUk7TUFDVixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsb0JBQW9CO01BQ3pELE1BQU0sTUFBTTtNQUNaLEtBQUssQ0FBQztNQUNOLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxFQUFFLFNBQVMsSUFBSSxHQUFHO01BQ3hCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO01BQ3pCLEdBQUc7QUFDSDtNQUNBLEVBQUUsSUFBSSxFQUFFLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUM5QixJQUFJLE9BQU8sTUFBTSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO01BQ2pFLEdBQUc7QUFDSDtNQUNBLEVBQUUsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRTtNQUN0QyxJQUFJLE9BQU8sTUFBTSxLQUFLLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO01BQ3JFLEdBQUc7QUFDSDtNQUNBLEVBQUUsU0FBUyxFQUFFLFNBQVMsU0FBUyxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUU7TUFDcEQsSUFBSSxPQUFPLEtBQUssQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztNQUN6RSxHQUFHO0FBQ0g7TUFDQSxFQUFFLFNBQVMsRUFBRSxTQUFTLFNBQVMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFO01BQ3BELElBQUksT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztNQUNuRCxHQUFHO0FBQ0g7TUFDQSxFQUFFLE1BQU0sRUFBRSxTQUFTLE1BQU0sQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO01BQzlDLElBQUksT0FBTyxLQUFLLENBQUMsSUFBSSxFQUFFLFdBQVcsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7TUFDOUQsR0FBRztBQUNIO01BQ0EsRUFBRSxJQUFJLEVBQUUsU0FBUyxJQUFJLENBQUMsTUFBTSxFQUFFO01BQzlCLElBQUksT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO01BQzlDLEdBQUc7QUFDSDtNQUNBLEVBQUUsUUFBUSxFQUFFLFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRTtNQUN0QyxJQUFJLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFF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
