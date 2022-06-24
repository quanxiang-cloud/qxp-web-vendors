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
        _flat: flat,
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

      function toNumberPath(keyPath) {
        return keyPath.map((v) => {
          if (typeof v === 'number') {
            return v;
          }

          return 0;
        });
      }

      /**
       *
       * @param {Immutable} node
       * @returns flattened keyPath/node pair list
       */
      function flat(node) {
        const reduction = walk(node, (reduction, keyPath) => {
          if (!reduction) {
            reduction = [];
          }

          reduction.push({ keyPath, node: node.getIn(keyPath), numberPath: toNumberPath(keyPath) });
          return reduction;
        });

        reduction.sort(({ numberPath: numberPathA }, { numberPath: numberPathB }) => {
          if (numberPathA.size === 0) {
            return -1;
          }

          if (numberPathB.size === 0) {
            return 1;
          }

          for (let index = 0; index < Math.min(numberPathA.size, numberPathB.size); index++) {
            if (numberPathB.get(index) === numberPathA.get(index)) {
              continue
            }

            return numberPathA.get(index) - numberPathB.get(index);
          }

          return numberPathA.size < numberPathB.size ? -1 : 1;
        });

        return reduction.map(({ keyPath, node }) => [keyPath, node]);
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

      /**
       *
       * @param {Immutable} node
       * @returns keyPath list of all nodes
       */
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL2NvbW1vbi90ZW1wL25vZGVfbW9kdWxlcy8ucG5wbS9pbW11dGFibGVANC4wLjAvbm9kZV9tb2R1bGVzL2ltbXV0YWJsZS9kaXN0L2ltbXV0YWJsZS5lcy5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvdXRpbHMuanMiLCIuLi8uLi8uLi9zcmMvcmF3L3dhbGsuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2ZpbmQuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2tleVBhdGhCeUlkLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9ieUFyYml0cmFyeS5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvX2FwcGVuZFRvLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9fZmxhdC5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvX2luc2VydENoaWxkQXQuanMiLCIuLi8uLi8uLi9zcmMvcmF3L3BhcmVudC5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvX2luc2VydExlZnRTaWJsaW5nVG8uanMiLCIuLi8uLi8uLi9zcmMvcmF3L19pbnNlcnRSaWdodFNpYmxpbmdUby5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvX3ByZXBlbmRUby5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvYW5jZXN0b3JzLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9jaGlsZEF0LmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9kZXB0aC5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvZmlsdGVyLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9maXJzdENoaWxkLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9nZXRGaXJzdExldmVsQ29uY3JldGVDaGlsZHJlbi5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvaGFzQ2hpbGROb2Rlcy5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvaWQuanMiLCIuLi8uLi8uLi9zcmMvcmF3L2xhc3RDaGlsZC5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvcHJldmlvdXNTaWJsaW5nLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9sZWZ0LmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9uZXh0U2libGluZy5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvbm9kZUhhc0NoaWxkTm9kZXMuanMiLCIuLi8uLi8uLi9zcmMvcmF3L25vZGVzLmpzIiwiLi4vLi4vLi4vc3JjL3Jhdy9wYXJlbnRJZHNTZXEuanMiLCIuLi8uLi8uLi9zcmMvcmF3L3JpZ2h0LmpzIiwiLi4vLi4vLi4vc3JjL2FwcGVuZENoaWxkLmpzIiwiLi4vLi4vLi4vc3JjL2RlbGV0ZUJ5SUQuanMiLCIuLi8uLi8uLi9zcmMvZmluZE5vZGVCeUlELmpzIiwiLi4vLi4vLi4vc3JjL2dldE5vZGVQYXJlbnRJRHMuanMiLCIuLi8uLi8uLi9zcmMvZ2V0Tm9kZVBhcmVudHMuanMiLCIuLi8uLi8uLi9zcmMvcGF0Y2hOb2RlLmpzIiwiLi4vLi4vLi4vc3JjL3RyYXZlbC5qcyIsIi4uLy4uLy4uL3NyYy9yYXcvaW5zZXJ0QXQuanMiLCIuLi8uLi8uLi9zcmMvaW5zZXJ0QmVmb3JlLmpzIiwiLi4vLi4vLi4vc3JjL2luc2VydEFmdGVyLmpzIiwiLi4vLi4vLi4vc3JjL2luc2VydEF0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogTUlUIExpY2Vuc2VcbiAqIFxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIExlZSBCeXJvbiBhbmQgb3RoZXIgY29udHJpYnV0b3JzLlxuICogXG4gKiBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4gKiBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4gKiBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4gKiB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4gKiBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbiAqIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4gKiBcbiAqIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkIGluIGFsbFxuICogY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbiAqIFxuICogVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuICogSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4gKiBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbiAqIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbiAqIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4gKiBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRVxuICogU09GVFdBUkUuXG4gKi9cbnZhciBERUxFVEUgPSAnZGVsZXRlJztcblxuLy8gQ29uc3RhbnRzIGRlc2NyaWJpbmcgdGhlIHNpemUgb2YgdHJpZSBub2Rlcy5cbnZhciBTSElGVCA9IDU7IC8vIFJlc3VsdGVkIGluIGJlc3QgcGVyZm9ybWFuY2UgYWZ0ZXIgX19fX19fP1xudmFyIFNJWkUgPSAxIDw8IFNISUZUO1xudmFyIE1BU0sgPSBTSVpFIC0gMTtcblxuLy8gQSBjb25zaXN0ZW50IHNoYXJlZCB2YWx1ZSByZXByZXNlbnRpbmcgXCJub3Qgc2V0XCIgd2hpY2ggZXF1YWxzIG5vdGhpbmcgb3RoZXJcbi8vIHRoYW4gaXRzZWxmLCBhbmQgbm90aGluZyB0aGF0IGNvdWxkIGJlIHByb3ZpZGVkIGV4dGVybmFsbHkuXG52YXIgTk9UX1NFVCA9IHt9O1xuXG4vLyBCb29sZWFuIHJlZmVyZW5jZXMsIFJvdWdoIGVxdWl2YWxlbnQgb2YgYGJvb2wgJmAuXG5mdW5jdGlvbiBNYWtlUmVmKCkge1xuICByZXR1cm4geyB2YWx1ZTogZmFsc2UgfTtcbn1cblxuZnVuY3Rpb24gU2V0UmVmKHJlZikge1xuICBpZiAocmVmKSB7XG4gICAgcmVmLnZhbHVlID0gdHJ1ZTtcbiAgfVxufVxuXG4vLyBBIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYSB2YWx1ZSByZXByZXNlbnRpbmcgYW4gXCJvd25lclwiIGZvciB0cmFuc2llbnQgd3JpdGVzXG4vLyB0byB0cmllcy4gVGhlIHJldHVybiB2YWx1ZSB3aWxsIG9ubHkgZXZlciBlcXVhbCBpdHNlbGYsIGFuZCB3aWxsIG5vdCBlcXVhbFxuLy8gdGhlIHJldHVybiBvZiBhbnkgc3Vic2VxdWVudCBjYWxsIG9mIHRoaXMgZnVuY3Rpb24uXG5mdW5jdGlvbiBPd25lcklEKCkge31cblxuZnVuY3Rpb24gZW5zdXJlU2l6ZShpdGVyKSB7XG4gIGlmIChpdGVyLnNpemUgPT09IHVuZGVmaW5lZCkge1xuICAgIGl0ZXIuc2l6ZSA9IGl0ZXIuX19pdGVyYXRlKHJldHVyblRydWUpO1xuICB9XG4gIHJldHVybiBpdGVyLnNpemU7XG59XG5cbmZ1bmN0aW9uIHdyYXBJbmRleChpdGVyLCBpbmRleCkge1xuICAvLyBUaGlzIGltcGxlbWVudHMgXCJpcyBhcnJheSBpbmRleFwiIHdoaWNoIHRoZSBFQ01BU3RyaW5nIHNwZWMgZGVmaW5lcyBhczpcbiAgLy9cbiAgLy8gICAgIEEgU3RyaW5nIHByb3BlcnR5IG5hbWUgUCBpcyBhbiBhcnJheSBpbmRleCBpZiBhbmQgb25seSBpZlxuICAvLyAgICAgVG9TdHJpbmcoVG9VaW50MzIoUCkpIGlzIGVxdWFsIHRvIFAgYW5kIFRvVWludDMyKFApIGlzIG5vdCBlcXVhbFxuICAvLyAgICAgdG8gMl4zMuKIkjEuXG4gIC8vXG4gIC8vIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy1hcnJheS1leG90aWMtb2JqZWN0c1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykge1xuICAgIHZhciB1aW50MzJJbmRleCA9IGluZGV4ID4+PiAwOyAvLyBOID4+PiAwIGlzIHNob3J0aGFuZCBmb3IgVG9VaW50MzJcbiAgICBpZiAoJycgKyB1aW50MzJJbmRleCAhPT0gaW5kZXggfHwgdWludDMySW5kZXggPT09IDQyOTQ5NjcyOTUpIHtcbiAgICAgIHJldHVybiBOYU47XG4gICAgfVxuICAgIGluZGV4ID0gdWludDMySW5kZXg7XG4gIH1cbiAgcmV0dXJuIGluZGV4IDwgMCA/IGVuc3VyZVNpemUoaXRlcikgKyBpbmRleCA6IGluZGV4O1xufVxuXG5mdW5jdGlvbiByZXR1cm5UcnVlKCkge1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gd2hvbGVTbGljZShiZWdpbiwgZW5kLCBzaXplKSB7XG4gIHJldHVybiAoXG4gICAgKChiZWdpbiA9PT0gMCAmJiAhaXNOZWcoYmVnaW4pKSB8fFxuICAgICAgKHNpemUgIT09IHVuZGVmaW5lZCAmJiBiZWdpbiA8PSAtc2l6ZSkpICYmXG4gICAgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IChzaXplICE9PSB1bmRlZmluZWQgJiYgZW5kID49IHNpemUpKVxuICApO1xufVxuXG5mdW5jdGlvbiByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpIHtcbiAgcmV0dXJuIHJlc29sdmVJbmRleChiZWdpbiwgc2l6ZSwgMCk7XG59XG5cbmZ1bmN0aW9uIHJlc29sdmVFbmQoZW5kLCBzaXplKSB7XG4gIHJldHVybiByZXNvbHZlSW5kZXgoZW5kLCBzaXplLCBzaXplKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUluZGV4KGluZGV4LCBzaXplLCBkZWZhdWx0SW5kZXgpIHtcbiAgLy8gU2FuaXRpemUgaW5kaWNlcyB1c2luZyB0aGlzIHNob3J0aGFuZCBmb3IgVG9JbnQzMihhcmd1bWVudClcbiAgLy8gaHR0cDovL3d3dy5lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzYuMC8jc2VjLXRvaW50MzJcbiAgcmV0dXJuIGluZGV4ID09PSB1bmRlZmluZWRcbiAgICA/IGRlZmF1bHRJbmRleFxuICAgIDogaXNOZWcoaW5kZXgpXG4gICAgPyBzaXplID09PSBJbmZpbml0eVxuICAgICAgPyBzaXplXG4gICAgICA6IE1hdGgubWF4KDAsIHNpemUgKyBpbmRleCkgfCAwXG4gICAgOiBzaXplID09PSB1bmRlZmluZWQgfHwgc2l6ZSA9PT0gaW5kZXhcbiAgICA/IGluZGV4XG4gICAgOiBNYXRoLm1pbihzaXplLCBpbmRleCkgfCAwO1xufVxuXG5mdW5jdGlvbiBpc05lZyh2YWx1ZSkge1xuICAvLyBBY2NvdW50IGZvciAtMCB3aGljaCBpcyBuZWdhdGl2ZSwgYnV0IG5vdCBsZXNzIHRoYW4gMC5cbiAgcmV0dXJuIHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlID09PSAtSW5maW5pdHkpO1xufVxuXG52YXIgSVNfQ09MTEVDVElPTl9TWU1CT0wgPSAnQEBfX0lNTVVUQUJMRV9JVEVSQUJMRV9fQEAnO1xuXG5mdW5jdGlvbiBpc0NvbGxlY3Rpb24obWF5YmVDb2xsZWN0aW9uKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlQ29sbGVjdGlvbiAmJiBtYXliZUNvbGxlY3Rpb25bSVNfQ09MTEVDVElPTl9TWU1CT0xdKTtcbn1cblxudmFyIElTX0tFWUVEX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX0tFWUVEX19AQCc7XG5cbmZ1bmN0aW9uIGlzS2V5ZWQobWF5YmVLZXllZCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZUtleWVkICYmIG1heWJlS2V5ZWRbSVNfS0VZRURfU1lNQk9MXSk7XG59XG5cbnZhciBJU19JTkRFWEVEX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX0lOREVYRURfX0BAJztcblxuZnVuY3Rpb24gaXNJbmRleGVkKG1heWJlSW5kZXhlZCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZUluZGV4ZWQgJiYgbWF5YmVJbmRleGVkW0lTX0lOREVYRURfU1lNQk9MXSk7XG59XG5cbmZ1bmN0aW9uIGlzQXNzb2NpYXRpdmUobWF5YmVBc3NvY2lhdGl2ZSkge1xuICByZXR1cm4gaXNLZXllZChtYXliZUFzc29jaWF0aXZlKSB8fCBpc0luZGV4ZWQobWF5YmVBc3NvY2lhdGl2ZSk7XG59XG5cbnZhciBDb2xsZWN0aW9uID0gZnVuY3Rpb24gQ29sbGVjdGlvbih2YWx1ZSkge1xuICByZXR1cm4gaXNDb2xsZWN0aW9uKHZhbHVlKSA/IHZhbHVlIDogU2VxKHZhbHVlKTtcbn07XG5cbnZhciBLZXllZENvbGxlY3Rpb24gPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIEtleWVkQ29sbGVjdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBpc0tleWVkKHZhbHVlKSA/IHZhbHVlIDogS2V5ZWRTZXEodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBDb2xsZWN0aW9uICkgS2V5ZWRDb2xsZWN0aW9uLl9fcHJvdG9fXyA9IENvbGxlY3Rpb247XG4gIEtleWVkQ29sbGVjdGlvbi5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIEtleWVkQ29sbGVjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBLZXllZENvbGxlY3Rpb247XG5cbiAgcmV0dXJuIEtleWVkQ29sbGVjdGlvbjtcbn0oQ29sbGVjdGlvbikpO1xuXG52YXIgSW5kZXhlZENvbGxlY3Rpb24gPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIEluZGV4ZWRDb2xsZWN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIGlzSW5kZXhlZCh2YWx1ZSkgPyB2YWx1ZSA6IEluZGV4ZWRTZXEodmFsdWUpO1xuICB9XG5cbiAgaWYgKCBDb2xsZWN0aW9uICkgSW5kZXhlZENvbGxlY3Rpb24uX19wcm90b19fID0gQ29sbGVjdGlvbjtcbiAgSW5kZXhlZENvbGxlY3Rpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZSApO1xuICBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbmRleGVkQ29sbGVjdGlvbjtcblxuICByZXR1cm4gSW5kZXhlZENvbGxlY3Rpb247XG59KENvbGxlY3Rpb24pKTtcblxudmFyIFNldENvbGxlY3Rpb24gPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIFNldENvbGxlY3Rpb24odmFsdWUpIHtcbiAgICByZXR1cm4gaXNDb2xsZWN0aW9uKHZhbHVlKSAmJiAhaXNBc3NvY2lhdGl2ZSh2YWx1ZSkgPyB2YWx1ZSA6IFNldFNlcSh2YWx1ZSk7XG4gIH1cblxuICBpZiAoIENvbGxlY3Rpb24gKSBTZXRDb2xsZWN0aW9uLl9fcHJvdG9fXyA9IENvbGxlY3Rpb247XG4gIFNldENvbGxlY3Rpb24ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZSApO1xuICBTZXRDb2xsZWN0aW9uLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFNldENvbGxlY3Rpb247XG5cbiAgcmV0dXJuIFNldENvbGxlY3Rpb247XG59KENvbGxlY3Rpb24pKTtcblxuQ29sbGVjdGlvbi5LZXllZCA9IEtleWVkQ29sbGVjdGlvbjtcbkNvbGxlY3Rpb24uSW5kZXhlZCA9IEluZGV4ZWRDb2xsZWN0aW9uO1xuQ29sbGVjdGlvbi5TZXQgPSBTZXRDb2xsZWN0aW9uO1xuXG52YXIgSVNfU0VRX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX1NFUV9fQEAnO1xuXG5mdW5jdGlvbiBpc1NlcShtYXliZVNlcSkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZVNlcSAmJiBtYXliZVNlcVtJU19TRVFfU1lNQk9MXSk7XG59XG5cbnZhciBJU19SRUNPUkRfU1lNQk9MID0gJ0BAX19JTU1VVEFCTEVfUkVDT1JEX19AQCc7XG5cbmZ1bmN0aW9uIGlzUmVjb3JkKG1heWJlUmVjb3JkKSB7XG4gIHJldHVybiBCb29sZWFuKG1heWJlUmVjb3JkICYmIG1heWJlUmVjb3JkW0lTX1JFQ09SRF9TWU1CT0xdKTtcbn1cblxuZnVuY3Rpb24gaXNJbW11dGFibGUobWF5YmVJbW11dGFibGUpIHtcbiAgcmV0dXJuIGlzQ29sbGVjdGlvbihtYXliZUltbXV0YWJsZSkgfHwgaXNSZWNvcmQobWF5YmVJbW11dGFibGUpO1xufVxuXG52YXIgSVNfT1JERVJFRF9TWU1CT0wgPSAnQEBfX0lNTVVUQUJMRV9PUkRFUkVEX19AQCc7XG5cbmZ1bmN0aW9uIGlzT3JkZXJlZChtYXliZU9yZGVyZWQpIHtcbiAgcmV0dXJuIEJvb2xlYW4obWF5YmVPcmRlcmVkICYmIG1heWJlT3JkZXJlZFtJU19PUkRFUkVEX1NZTUJPTF0pO1xufVxuXG52YXIgSVRFUkFURV9LRVlTID0gMDtcbnZhciBJVEVSQVRFX1ZBTFVFUyA9IDE7XG52YXIgSVRFUkFURV9FTlRSSUVTID0gMjtcblxudmFyIFJFQUxfSVRFUkFUT1JfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2wuaXRlcmF0b3I7XG52YXIgRkFVWF9JVEVSQVRPUl9TWU1CT0wgPSAnQEBpdGVyYXRvcic7XG5cbnZhciBJVEVSQVRPUl9TWU1CT0wgPSBSRUFMX0lURVJBVE9SX1NZTUJPTCB8fCBGQVVYX0lURVJBVE9SX1NZTUJPTDtcblxudmFyIEl0ZXJhdG9yID0gZnVuY3Rpb24gSXRlcmF0b3IobmV4dCkge1xuICB0aGlzLm5leHQgPSBuZXh0O1xufTtcblxuSXRlcmF0b3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICByZXR1cm4gJ1tJdGVyYXRvcl0nO1xufTtcblxuSXRlcmF0b3IuS0VZUyA9IElURVJBVEVfS0VZUztcbkl0ZXJhdG9yLlZBTFVFUyA9IElURVJBVEVfVkFMVUVTO1xuSXRlcmF0b3IuRU5UUklFUyA9IElURVJBVEVfRU5UUklFUztcblxuSXRlcmF0b3IucHJvdG90eXBlLmluc3BlY3QgPSBJdGVyYXRvci5wcm90b3R5cGUudG9Tb3VyY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG59O1xuSXRlcmF0b3IucHJvdG90eXBlW0lURVJBVE9SX1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gaXRlcmF0b3JWYWx1ZSh0eXBlLCBrLCB2LCBpdGVyYXRvclJlc3VsdCkge1xuICB2YXIgdmFsdWUgPSB0eXBlID09PSAwID8gayA6IHR5cGUgPT09IDEgPyB2IDogW2ssIHZdO1xuICBpdGVyYXRvclJlc3VsdFxuICAgID8gKGl0ZXJhdG9yUmVzdWx0LnZhbHVlID0gdmFsdWUpXG4gICAgOiAoaXRlcmF0b3JSZXN1bHQgPSB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZG9uZTogZmFsc2UsXG4gICAgICB9KTtcbiAgcmV0dXJuIGl0ZXJhdG9yUmVzdWx0O1xufVxuXG5mdW5jdGlvbiBpdGVyYXRvckRvbmUoKSB7XG4gIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbn1cblxuZnVuY3Rpb24gaGFzSXRlcmF0b3IobWF5YmVJdGVyYWJsZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheShtYXliZUl0ZXJhYmxlKSkge1xuICAgIC8vIElFMTEgdHJpY2sgYXMgaXQgZG9lcyBub3Qgc3VwcG9ydCBgU3ltYm9sLml0ZXJhdG9yYFxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuICEhZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKTtcbn1cblxuZnVuY3Rpb24gaXNJdGVyYXRvcihtYXliZUl0ZXJhdG9yKSB7XG4gIHJldHVybiBtYXliZUl0ZXJhdG9yICYmIHR5cGVvZiBtYXliZUl0ZXJhdG9yLm5leHQgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGdldEl0ZXJhdG9yKGl0ZXJhYmxlKSB7XG4gIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihpdGVyYWJsZSk7XG4gIHJldHVybiBpdGVyYXRvckZuICYmIGl0ZXJhdG9yRm4uY2FsbChpdGVyYWJsZSk7XG59XG5cbmZ1bmN0aW9uIGdldEl0ZXJhdG9yRm4oaXRlcmFibGUpIHtcbiAgdmFyIGl0ZXJhdG9yRm4gPVxuICAgIGl0ZXJhYmxlICYmXG4gICAgKChSRUFMX0lURVJBVE9SX1NZTUJPTCAmJiBpdGVyYWJsZVtSRUFMX0lURVJBVE9SX1NZTUJPTF0pIHx8XG4gICAgICBpdGVyYWJsZVtGQVVYX0lURVJBVE9SX1NZTUJPTF0pO1xuICBpZiAodHlwZW9mIGl0ZXJhdG9yRm4gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gaXRlcmF0b3JGbjtcbiAgfVxufVxuXG5mdW5jdGlvbiBpc0VudHJpZXNJdGVyYWJsZShtYXliZUl0ZXJhYmxlKSB7XG4gIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKTtcbiAgcmV0dXJuIGl0ZXJhdG9yRm4gJiYgaXRlcmF0b3JGbiA9PT0gbWF5YmVJdGVyYWJsZS5lbnRyaWVzO1xufVxuXG5mdW5jdGlvbiBpc0tleXNJdGVyYWJsZShtYXliZUl0ZXJhYmxlKSB7XG4gIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKTtcbiAgcmV0dXJuIGl0ZXJhdG9yRm4gJiYgaXRlcmF0b3JGbiA9PT0gbWF5YmVJdGVyYWJsZS5rZXlzO1xufVxuXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG5mdW5jdGlvbiBpc0FycmF5TGlrZSh2YWx1ZSkge1xuICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkgfHwgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIChcbiAgICB2YWx1ZSAmJlxuICAgIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiZcbiAgICBOdW1iZXIuaXNJbnRlZ2VyKHZhbHVlLmxlbmd0aCkgJiZcbiAgICB2YWx1ZS5sZW5ndGggPj0gMCAmJlxuICAgICh2YWx1ZS5sZW5ndGggPT09IDBcbiAgICAgID8gLy8gT25seSB7bGVuZ3RoOiAwfSBpcyBjb25zaWRlcmVkIEFycmF5LWxpa2UuXG4gICAgICAgIE9iamVjdC5rZXlzKHZhbHVlKS5sZW5ndGggPT09IDFcbiAgICAgIDogLy8gQW4gb2JqZWN0IGlzIG9ubHkgQXJyYXktbGlrZSBpZiBpdCBoYXMgYSBwcm9wZXJ0eSB3aGVyZSB0aGUgbGFzdCB2YWx1ZVxuICAgICAgICAvLyBpbiB0aGUgYXJyYXktbGlrZSBtYXkgYmUgZm91bmQgKHdoaWNoIGNvdWxkIGJlIHVuZGVmaW5lZCkuXG4gICAgICAgIHZhbHVlLmhhc093blByb3BlcnR5KHZhbHVlLmxlbmd0aCAtIDEpKVxuICApO1xufVxuXG52YXIgU2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoQ29sbGVjdGlvbikge1xuICBmdW5jdGlvbiBTZXEodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eVNlcXVlbmNlKClcbiAgICAgIDogaXNJbW11dGFibGUodmFsdWUpXG4gICAgICA/IHZhbHVlLnRvU2VxKClcbiAgICAgIDogc2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIGlmICggQ29sbGVjdGlvbiApIFNlcS5fX3Byb3RvX18gPSBDb2xsZWN0aW9uO1xuICBTZXEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZSApO1xuICBTZXEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2VxO1xuXG4gIFNlcS5wcm90b3R5cGUudG9TZXEgPSBmdW5jdGlvbiB0b1NlcSAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgU2VxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTZXEgeycsICd9Jyk7XG4gIH07XG5cbiAgU2VxLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9IGZ1bmN0aW9uIGNhY2hlUmVzdWx0ICgpIHtcbiAgICBpZiAoIXRoaXMuX2NhY2hlICYmIHRoaXMuX19pdGVyYXRlVW5jYWNoZWQpIHtcbiAgICAgIHRoaXMuX2NhY2hlID0gdGhpcy5lbnRyeVNlcSgpLnRvQXJyYXkoKTtcbiAgICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2NhY2hlLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgLy8gYWJzdHJhY3QgX19pdGVyYXRlVW5jYWNoZWQoZm4sIHJldmVyc2UpXG5cbiAgU2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIGNhY2hlID0gdGhpcy5fY2FjaGU7XG4gICAgaWYgKGNhY2hlKSB7XG4gICAgICB2YXIgc2l6ZSA9IGNhY2hlLmxlbmd0aDtcbiAgICAgIHZhciBpID0gMDtcbiAgICAgIHdoaWxlIChpICE9PSBzaXplKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IGNhY2hlW3JldmVyc2UgPyBzaXplIC0gKytpIDogaSsrXTtcbiAgICAgICAgaWYgKGZuKGVudHJ5WzFdLCBlbnRyeVswXSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX2l0ZXJhdGVVbmNhY2hlZChmbiwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgLy8gYWJzdHJhY3QgX19pdGVyYXRvclVuY2FjaGVkKHR5cGUsIHJldmVyc2UpXG5cbiAgU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBjYWNoZSA9IHRoaXMuX2NhY2hlO1xuICAgIGlmIChjYWNoZSkge1xuICAgICAgdmFyIHNpemUgPSBjYWNoZS5sZW5ndGg7XG4gICAgICB2YXIgaSA9IDA7XG4gICAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGkgPT09IHNpemUpIHtcbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gY2FjaGVbcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKytdO1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBlbnRyeVswXSwgZW50cnlbMV0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3JVbmNhY2hlZCh0eXBlLCByZXZlcnNlKTtcbiAgfTtcblxuICByZXR1cm4gU2VxO1xufShDb2xsZWN0aW9uKSk7XG5cbnZhciBLZXllZFNlcSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKFNlcSkge1xuICBmdW5jdGlvbiBLZXllZFNlcSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGVtcHR5U2VxdWVuY2UoKS50b0tleWVkU2VxKClcbiAgICAgIDogaXNDb2xsZWN0aW9uKHZhbHVlKVxuICAgICAgPyBpc0tleWVkKHZhbHVlKVxuICAgICAgICA/IHZhbHVlLnRvU2VxKClcbiAgICAgICAgOiB2YWx1ZS5mcm9tRW50cnlTZXEoKVxuICAgICAgOiBpc1JlY29yZCh2YWx1ZSlcbiAgICAgID8gdmFsdWUudG9TZXEoKVxuICAgICAgOiBrZXllZFNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gIH1cblxuICBpZiAoIFNlcSApIEtleWVkU2VxLl9fcHJvdG9fXyA9IFNlcTtcbiAgS2V5ZWRTZXEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggU2VxICYmIFNlcS5wcm90b3R5cGUgKTtcbiAgS2V5ZWRTZXEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gS2V5ZWRTZXE7XG5cbiAgS2V5ZWRTZXEucHJvdG90eXBlLnRvS2V5ZWRTZXEgPSBmdW5jdGlvbiB0b0tleWVkU2VxICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICByZXR1cm4gS2V5ZWRTZXE7XG59KFNlcSkpO1xuXG52YXIgSW5kZXhlZFNlcSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKFNlcSkge1xuICBmdW5jdGlvbiBJbmRleGVkU2VxKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlTZXF1ZW5jZSgpXG4gICAgICA6IGlzQ29sbGVjdGlvbih2YWx1ZSlcbiAgICAgID8gaXNLZXllZCh2YWx1ZSlcbiAgICAgICAgPyB2YWx1ZS5lbnRyeVNlcSgpXG4gICAgICAgIDogdmFsdWUudG9JbmRleGVkU2VxKClcbiAgICAgIDogaXNSZWNvcmQodmFsdWUpXG4gICAgICA/IHZhbHVlLnRvU2VxKCkuZW50cnlTZXEoKVxuICAgICAgOiBpbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgfVxuXG4gIGlmICggU2VxICkgSW5kZXhlZFNlcS5fX3Byb3RvX18gPSBTZXE7XG4gIEluZGV4ZWRTZXEucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggU2VxICYmIFNlcS5wcm90b3R5cGUgKTtcbiAgSW5kZXhlZFNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBJbmRleGVkU2VxO1xuXG4gIEluZGV4ZWRTZXEub2YgPSBmdW5jdGlvbiBvZiAoLyouLi52YWx1ZXMqLykge1xuICAgIHJldHVybiBJbmRleGVkU2VxKGFyZ3VtZW50cyk7XG4gIH07XG5cbiAgSW5kZXhlZFNlcS5wcm90b3R5cGUudG9JbmRleGVkU2VxID0gZnVuY3Rpb24gdG9JbmRleGVkU2VxICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBJbmRleGVkU2VxLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTZXEgWycsICddJyk7XG4gIH07XG5cbiAgcmV0dXJuIEluZGV4ZWRTZXE7XG59KFNlcSkpO1xuXG52YXIgU2V0U2VxID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoU2VxKSB7XG4gIGZ1bmN0aW9uIFNldFNlcSh2YWx1ZSkge1xuICAgIHJldHVybiAoXG4gICAgICBpc0NvbGxlY3Rpb24odmFsdWUpICYmICFpc0Fzc29jaWF0aXZlKHZhbHVlKSA/IHZhbHVlIDogSW5kZXhlZFNlcSh2YWx1ZSlcbiAgICApLnRvU2V0U2VxKCk7XG4gIH1cblxuICBpZiAoIFNlcSApIFNldFNlcS5fX3Byb3RvX18gPSBTZXE7XG4gIFNldFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXEgJiYgU2VxLnByb3RvdHlwZSApO1xuICBTZXRTZXEucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2V0U2VxO1xuXG4gIFNldFNlcS5vZiA9IGZ1bmN0aW9uIG9mICgvKi4uLnZhbHVlcyovKSB7XG4gICAgcmV0dXJuIFNldFNlcShhcmd1bWVudHMpO1xuICB9O1xuXG4gIFNldFNlcS5wcm90b3R5cGUudG9TZXRTZXEgPSBmdW5jdGlvbiB0b1NldFNlcSAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgcmV0dXJuIFNldFNlcTtcbn0oU2VxKSk7XG5cblNlcS5pc1NlcSA9IGlzU2VxO1xuU2VxLktleWVkID0gS2V5ZWRTZXE7XG5TZXEuU2V0ID0gU2V0U2VxO1xuU2VxLkluZGV4ZWQgPSBJbmRleGVkU2VxO1xuXG5TZXEucHJvdG90eXBlW0lTX1NFUV9TWU1CT0xdID0gdHJ1ZTtcblxuLy8gI3ByYWdtYSBSb290IFNlcXVlbmNlc1xuXG52YXIgQXJyYXlTZXEgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChJbmRleGVkU2VxKSB7XG4gIGZ1bmN0aW9uIEFycmF5U2VxKGFycmF5KSB7XG4gICAgdGhpcy5fYXJyYXkgPSBhcnJheTtcbiAgICB0aGlzLnNpemUgPSBhcnJheS5sZW5ndGg7XG4gIH1cblxuICBpZiAoIEluZGV4ZWRTZXEgKSBBcnJheVNlcS5fX3Byb3RvX18gPSBJbmRleGVkU2VxO1xuICBBcnJheVNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBJbmRleGVkU2VxICYmIEluZGV4ZWRTZXEucHJvdG90eXBlICk7XG4gIEFycmF5U2VxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEFycmF5U2VxO1xuXG4gIEFycmF5U2VxLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhpbmRleCkgPyB0aGlzLl9hcnJheVt3cmFwSW5kZXgodGhpcywgaW5kZXgpXSA6IG5vdFNldFZhbHVlO1xuICB9O1xuXG4gIEFycmF5U2VxLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIGFycmF5ID0gdGhpcy5fYXJyYXk7XG4gICAgdmFyIHNpemUgPSBhcnJheS5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpICE9PSBzaXplKSB7XG4gICAgICB2YXIgaWkgPSByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKztcbiAgICAgIGlmIChmbihhcnJheVtpaV0sIGlpLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9O1xuXG4gIEFycmF5U2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBhcnJheSA9IHRoaXMuX2FycmF5O1xuICAgIHZhciBzaXplID0gYXJyYXkubGVuZ3RoO1xuICAgIHZhciBpID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpID09PSBzaXplKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBpaSA9IHJldmVyc2UgPyBzaXplIC0gKytpIDogaSsrO1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaWksIGFycmF5W2lpXSk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIEFycmF5U2VxO1xufShJbmRleGVkU2VxKSk7XG5cbnZhciBPYmplY3RTZXEgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChLZXllZFNlcSkge1xuICBmdW5jdGlvbiBPYmplY3RTZXEob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpO1xuICAgIHRoaXMuX29iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLl9rZXlzID0ga2V5cztcbiAgICB0aGlzLnNpemUgPSBrZXlzLmxlbmd0aDtcbiAgfVxuXG4gIGlmICggS2V5ZWRTZXEgKSBPYmplY3RTZXEuX19wcm90b19fID0gS2V5ZWRTZXE7XG4gIE9iamVjdFNlcS5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBLZXllZFNlcSAmJiBLZXllZFNlcS5wcm90b3R5cGUgKTtcbiAgT2JqZWN0U2VxLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE9iamVjdFNlcTtcblxuICBPYmplY3RTZXEucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoa2V5LCBub3RTZXRWYWx1ZSkge1xuICAgIGlmIChub3RTZXRWYWx1ZSAhPT0gdW5kZWZpbmVkICYmICF0aGlzLmhhcyhrZXkpKSB7XG4gICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9vYmplY3Rba2V5XTtcbiAgfTtcblxuICBPYmplY3RTZXEucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoa2V5KSB7XG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwodGhpcy5fb2JqZWN0LCBrZXkpO1xuICB9O1xuXG4gIE9iamVjdFNlcS5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBvYmplY3QgPSB0aGlzLl9vYmplY3Q7XG4gICAgdmFyIGtleXMgPSB0aGlzLl9rZXlzO1xuICAgIHZhciBzaXplID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIHdoaWxlIChpICE9PSBzaXplKSB7XG4gICAgICB2YXIga2V5ID0ga2V5c1tyZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrK107XG4gICAgICBpZiAoZm4ob2JqZWN0W2tleV0sIGtleSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaTtcbiAgfTtcblxuICBPYmplY3RTZXEucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIG9iamVjdCA9IHRoaXMuX29iamVjdDtcbiAgICB2YXIga2V5cyA9IHRoaXMuX2tleXM7XG4gICAgdmFyIHNpemUgPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoaSA9PT0gc2l6ZSkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICB9XG4gICAgICB2YXIga2V5ID0ga2V5c1tyZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrK107XG4gICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBrZXksIG9iamVjdFtrZXldKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gT2JqZWN0U2VxO1xufShLZXllZFNlcSkpO1xuT2JqZWN0U2VxLnByb3RvdHlwZVtJU19PUkRFUkVEX1NZTUJPTF0gPSB0cnVlO1xuXG52YXIgQ29sbGVjdGlvblNlcSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRTZXEpIHtcbiAgZnVuY3Rpb24gQ29sbGVjdGlvblNlcShjb2xsZWN0aW9uKSB7XG4gICAgdGhpcy5fY29sbGVjdGlvbiA9IGNvbGxlY3Rpb247XG4gICAgdGhpcy5zaXplID0gY29sbGVjdGlvbi5sZW5ndGggfHwgY29sbGVjdGlvbi5zaXplO1xuICB9XG5cbiAgaWYgKCBJbmRleGVkU2VxICkgQ29sbGVjdGlvblNlcS5fX3Byb3RvX18gPSBJbmRleGVkU2VxO1xuICBDb2xsZWN0aW9uU2VxLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEluZGV4ZWRTZXEgJiYgSW5kZXhlZFNlcS5wcm90b3R5cGUgKTtcbiAgQ29sbGVjdGlvblNlcS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb2xsZWN0aW9uU2VxO1xuXG4gIENvbGxlY3Rpb25TZXEucHJvdG90eXBlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gX19pdGVyYXRlVW5jYWNoZWQgKGZuLCByZXZlcnNlKSB7XG4gICAgaWYgKHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRlKGZuLCByZXZlcnNlKTtcbiAgICB9XG4gICAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzLl9jb2xsZWN0aW9uO1xuICAgIHZhciBpdGVyYXRvciA9IGdldEl0ZXJhdG9yKGNvbGxlY3Rpb24pO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICBpZiAoaXNJdGVyYXRvcihpdGVyYXRvcikpIHtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICBpZiAoZm4oc3RlcC52YWx1ZSwgaXRlcmF0aW9ucysrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcblxuICBDb2xsZWN0aW9uU2VxLnByb3RvdHlwZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yVW5jYWNoZWQgKHR5cGUsIHJldmVyc2UpIHtcbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgY29sbGVjdGlvbiA9IHRoaXMuX2NvbGxlY3Rpb247XG4gICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoY29sbGVjdGlvbik7XG4gICAgaWYgKCFpc0l0ZXJhdG9yKGl0ZXJhdG9yKSkge1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihpdGVyYXRvckRvbmUpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIHJldHVybiBzdGVwLmRvbmUgPyBzdGVwIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHN0ZXAudmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBDb2xsZWN0aW9uU2VxO1xufShJbmRleGVkU2VxKSk7XG5cbi8vICMgcHJhZ21hIEhlbHBlciBmdW5jdGlvbnNcblxudmFyIEVNUFRZX1NFUTtcblxuZnVuY3Rpb24gZW1wdHlTZXF1ZW5jZSgpIHtcbiAgcmV0dXJuIEVNUFRZX1NFUSB8fCAoRU1QVFlfU0VRID0gbmV3IEFycmF5U2VxKFtdKSk7XG59XG5cbmZ1bmN0aW9uIGtleWVkU2VxRnJvbVZhbHVlKHZhbHVlKSB7XG4gIHZhciBzZXEgPSBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpO1xuICBpZiAoc2VxKSB7XG4gICAgcmV0dXJuIHNlcS5mcm9tRW50cnlTZXEoKTtcbiAgfVxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U2VxKHZhbHVlKTtcbiAgfVxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdFeHBlY3RlZCBBcnJheSBvciBjb2xsZWN0aW9uIG9iamVjdCBvZiBbaywgdl0gZW50cmllcywgb3Iga2V5ZWQgb2JqZWN0OiAnICtcbiAgICAgIHZhbHVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIGluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgdmFyIHNlcSA9IG1heWJlSW5kZXhlZFNlcUZyb21WYWx1ZSh2YWx1ZSk7XG4gIGlmIChzZXEpIHtcbiAgICByZXR1cm4gc2VxO1xuICB9XG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ0V4cGVjdGVkIEFycmF5IG9yIGNvbGxlY3Rpb24gb2JqZWN0IG9mIHZhbHVlczogJyArIHZhbHVlXG4gICk7XG59XG5cbmZ1bmN0aW9uIHNlcUZyb21WYWx1ZSh2YWx1ZSkge1xuICB2YXIgc2VxID0gbWF5YmVJbmRleGVkU2VxRnJvbVZhbHVlKHZhbHVlKTtcbiAgaWYgKHNlcSkge1xuICAgIHJldHVybiBpc0VudHJpZXNJdGVyYWJsZSh2YWx1ZSlcbiAgICAgID8gc2VxLmZyb21FbnRyeVNlcSgpXG4gICAgICA6IGlzS2V5c0l0ZXJhYmxlKHZhbHVlKVxuICAgICAgPyBzZXEudG9TZXRTZXEoKVxuICAgICAgOiBzZXE7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICByZXR1cm4gbmV3IE9iamVjdFNlcSh2YWx1ZSk7XG4gIH1cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAnRXhwZWN0ZWQgQXJyYXkgb3IgY29sbGVjdGlvbiBvYmplY3Qgb2YgdmFsdWVzLCBvciBrZXllZCBvYmplY3Q6ICcgKyB2YWx1ZVxuICApO1xufVxuXG5mdW5jdGlvbiBtYXliZUluZGV4ZWRTZXFGcm9tVmFsdWUodmFsdWUpIHtcbiAgcmV0dXJuIGlzQXJyYXlMaWtlKHZhbHVlKVxuICAgID8gbmV3IEFycmF5U2VxKHZhbHVlKVxuICAgIDogaGFzSXRlcmF0b3IodmFsdWUpXG4gICAgPyBuZXcgQ29sbGVjdGlvblNlcSh2YWx1ZSlcbiAgICA6IHVuZGVmaW5lZDtcbn1cblxudmFyIElTX01BUF9TWU1CT0wgPSAnQEBfX0lNTVVUQUJMRV9NQVBfX0BAJztcblxuZnVuY3Rpb24gaXNNYXAobWF5YmVNYXApIHtcbiAgcmV0dXJuIEJvb2xlYW4obWF5YmVNYXAgJiYgbWF5YmVNYXBbSVNfTUFQX1NZTUJPTF0pO1xufVxuXG5mdW5jdGlvbiBpc09yZGVyZWRNYXAobWF5YmVPcmRlcmVkTWFwKSB7XG4gIHJldHVybiBpc01hcChtYXliZU9yZGVyZWRNYXApICYmIGlzT3JkZXJlZChtYXliZU9yZGVyZWRNYXApO1xufVxuXG5mdW5jdGlvbiBpc1ZhbHVlT2JqZWN0KG1heWJlVmFsdWUpIHtcbiAgcmV0dXJuIEJvb2xlYW4oXG4gICAgbWF5YmVWYWx1ZSAmJlxuICAgICAgdHlwZW9mIG1heWJlVmFsdWUuZXF1YWxzID09PSAnZnVuY3Rpb24nICYmXG4gICAgICB0eXBlb2YgbWF5YmVWYWx1ZS5oYXNoQ29kZSA9PT0gJ2Z1bmN0aW9uJ1xuICApO1xufVxuXG4vKipcbiAqIEFuIGV4dGVuc2lvbiBvZiB0aGUgXCJzYW1lLXZhbHVlXCIgYWxnb3JpdGhtIGFzIFtkZXNjcmliZWQgZm9yIHVzZSBieSBFUzYgTWFwXG4gKiBhbmQgU2V0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9NYXAjS2V5X2VxdWFsaXR5KVxuICpcbiAqIE5hTiBpcyBjb25zaWRlcmVkIHRoZSBzYW1lIGFzIE5hTiwgaG93ZXZlciAtMCBhbmQgMCBhcmUgY29uc2lkZXJlZCB0aGUgc2FtZVxuICogdmFsdWUsIHdoaWNoIGlzIGRpZmZlcmVudCBmcm9tIHRoZSBhbGdvcml0aG0gZGVzY3JpYmVkIGJ5XG4gKiBbYE9iamVjdC5pc2BdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pcykuXG4gKlxuICogVGhpcyBpcyBleHRlbmRlZCBmdXJ0aGVyIHRvIGFsbG93IE9iamVjdHMgdG8gZGVzY3JpYmUgdGhlIHZhbHVlcyB0aGV5XG4gKiByZXByZXNlbnQsIGJ5IHdheSBvZiBgdmFsdWVPZmAgb3IgYGVxdWFsc2AgKGFuZCBgaGFzaENvZGVgKS5cbiAqXG4gKiBOb3RlOiBiZWNhdXNlIG9mIHRoaXMgZXh0ZW5zaW9uLCB0aGUga2V5IGVxdWFsaXR5IG9mIEltbXV0YWJsZS5NYXAgYW5kIHRoZVxuICogdmFsdWUgZXF1YWxpdHkgb2YgSW1tdXRhYmxlLlNldCB3aWxsIGRpZmZlciBmcm9tIEVTNiBNYXAgYW5kIFNldC5cbiAqXG4gKiAjIyMgRGVmaW5pbmcgY3VzdG9tIHZhbHVlc1xuICpcbiAqIFRoZSBlYXNpZXN0IHdheSB0byBkZXNjcmliZSB0aGUgdmFsdWUgYW4gb2JqZWN0IHJlcHJlc2VudHMgaXMgYnkgaW1wbGVtZW50aW5nXG4gKiBgdmFsdWVPZmAuIEZvciBleGFtcGxlLCBgRGF0ZWAgcmVwcmVzZW50cyBhIHZhbHVlIGJ5IHJldHVybmluZyBhIHVuaXhcbiAqIHRpbWVzdGFtcCBmb3IgYHZhbHVlT2ZgOlxuICpcbiAqICAgICB2YXIgZGF0ZTEgPSBuZXcgRGF0ZSgxMjM0NTY3ODkwMDAwKTsgLy8gRnJpIEZlYiAxMyAyMDA5IC4uLlxuICogICAgIHZhciBkYXRlMiA9IG5ldyBEYXRlKDEyMzQ1Njc4OTAwMDApO1xuICogICAgIGRhdGUxLnZhbHVlT2YoKTsgLy8gMTIzNDU2Nzg5MDAwMFxuICogICAgIGFzc2VydCggZGF0ZTEgIT09IGRhdGUyICk7XG4gKiAgICAgYXNzZXJ0KCBJbW11dGFibGUuaXMoIGRhdGUxLCBkYXRlMiApICk7XG4gKlxuICogTm90ZTogb3ZlcnJpZGluZyBgdmFsdWVPZmAgbWF5IGhhdmUgb3RoZXIgaW1wbGljYXRpb25zIGlmIHlvdSB1c2UgdGhpcyBvYmplY3RcbiAqIHdoZXJlIEphdmFTY3JpcHQgZXhwZWN0cyBhIHByaW1pdGl2ZSwgc3VjaCBhcyBpbXBsaWNpdCBzdHJpbmcgY29lcmNpb24uXG4gKlxuICogRm9yIG1vcmUgY29tcGxleCB0eXBlcywgZXNwZWNpYWxseSBjb2xsZWN0aW9ucywgaW1wbGVtZW50aW5nIGB2YWx1ZU9mYCBtYXlcbiAqIG5vdCBiZSBwZXJmb3JtYW50LiBBbiBhbHRlcm5hdGl2ZSBpcyB0byBpbXBsZW1lbnQgYGVxdWFsc2AgYW5kIGBoYXNoQ29kZWAuXG4gKlxuICogYGVxdWFsc2AgdGFrZXMgYW5vdGhlciBvYmplY3QsIHByZXN1bWFibHkgb2Ygc2ltaWxhciB0eXBlLCBhbmQgcmV0dXJucyB0cnVlXG4gKiBpZiBpdCBpcyBlcXVhbC4gRXF1YWxpdHkgaXMgc3ltbWV0cmljYWwsIHNvIHRoZSBzYW1lIHJlc3VsdCBzaG91bGQgYmVcbiAqIHJldHVybmVkIGlmIHRoaXMgYW5kIHRoZSBhcmd1bWVudCBhcmUgZmxpcHBlZC5cbiAqXG4gKiAgICAgYXNzZXJ0KCBhLmVxdWFscyhiKSA9PT0gYi5lcXVhbHMoYSkgKTtcbiAqXG4gKiBgaGFzaENvZGVgIHJldHVybnMgYSAzMmJpdCBpbnRlZ2VyIG51bWJlciByZXByZXNlbnRpbmcgdGhlIG9iamVjdCB3aGljaCB3aWxsXG4gKiBiZSB1c2VkIHRvIGRldGVybWluZSBob3cgdG8gc3RvcmUgdGhlIHZhbHVlIG9iamVjdCBpbiBhIE1hcCBvciBTZXQuIFlvdSBtdXN0XG4gKiBwcm92aWRlIGJvdGggb3IgbmVpdGhlciBtZXRob2RzLCBvbmUgbXVzdCBub3QgZXhpc3Qgd2l0aG91dCB0aGUgb3RoZXIuXG4gKlxuICogQWxzbywgYW4gaW1wb3J0YW50IHJlbGF0aW9uc2hpcCBiZXR3ZWVuIHRoZXNlIG1ldGhvZHMgbXVzdCBiZSB1cGhlbGQ6IGlmIHR3b1xuICogdmFsdWVzIGFyZSBlcXVhbCwgdGhleSAqbXVzdCogcmV0dXJuIHRoZSBzYW1lIGhhc2hDb2RlLiBJZiB0aGUgdmFsdWVzIGFyZSBub3RcbiAqIGVxdWFsLCB0aGV5IG1pZ2h0IGhhdmUgdGhlIHNhbWUgaGFzaENvZGU7IHRoaXMgaXMgY2FsbGVkIGEgaGFzaCBjb2xsaXNpb24sXG4gKiBhbmQgd2hpbGUgdW5kZXNpcmFibGUgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMsIGl0IGlzIGFjY2VwdGFibGUuXG4gKlxuICogICAgIGlmIChhLmVxdWFscyhiKSkge1xuICogICAgICAgYXNzZXJ0KCBhLmhhc2hDb2RlKCkgPT09IGIuaGFzaENvZGUoKSApO1xuICogICAgIH1cbiAqXG4gKiBBbGwgSW1tdXRhYmxlIGNvbGxlY3Rpb25zIGFyZSBWYWx1ZSBPYmplY3RzOiB0aGV5IGltcGxlbWVudCBgZXF1YWxzKClgXG4gKiBhbmQgYGhhc2hDb2RlKClgLlxuICovXG5mdW5jdGlvbiBpcyh2YWx1ZUEsIHZhbHVlQikge1xuICBpZiAodmFsdWVBID09PSB2YWx1ZUIgfHwgKHZhbHVlQSAhPT0gdmFsdWVBICYmIHZhbHVlQiAhPT0gdmFsdWVCKSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICghdmFsdWVBIHx8ICF2YWx1ZUIpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKFxuICAgIHR5cGVvZiB2YWx1ZUEudmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgIHR5cGVvZiB2YWx1ZUIudmFsdWVPZiA9PT0gJ2Z1bmN0aW9uJ1xuICApIHtcbiAgICB2YWx1ZUEgPSB2YWx1ZUEudmFsdWVPZigpO1xuICAgIHZhbHVlQiA9IHZhbHVlQi52YWx1ZU9mKCk7XG4gICAgaWYgKHZhbHVlQSA9PT0gdmFsdWVCIHx8ICh2YWx1ZUEgIT09IHZhbHVlQSAmJiB2YWx1ZUIgIT09IHZhbHVlQikpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXZhbHVlQSB8fCAhdmFsdWVCKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiAhIShcbiAgICBpc1ZhbHVlT2JqZWN0KHZhbHVlQSkgJiZcbiAgICBpc1ZhbHVlT2JqZWN0KHZhbHVlQikgJiZcbiAgICB2YWx1ZUEuZXF1YWxzKHZhbHVlQilcbiAgKTtcbn1cblxudmFyIGltdWwgPVxuICB0eXBlb2YgTWF0aC5pbXVsID09PSAnZnVuY3Rpb24nICYmIE1hdGguaW11bCgweGZmZmZmZmZmLCAyKSA9PT0gLTJcbiAgICA/IE1hdGguaW11bFxuICAgIDogZnVuY3Rpb24gaW11bChhLCBiKSB7XG4gICAgICAgIGEgfD0gMDsgLy8gaW50XG4gICAgICAgIGIgfD0gMDsgLy8gaW50XG4gICAgICAgIHZhciBjID0gYSAmIDB4ZmZmZjtcbiAgICAgICAgdmFyIGQgPSBiICYgMHhmZmZmO1xuICAgICAgICAvLyBTaGlmdCBieSAwIGZpeGVzIHRoZSBzaWduIG9uIHRoZSBoaWdoIHBhcnQuXG4gICAgICAgIHJldHVybiAoYyAqIGQgKyAoKCgoYSA+Pj4gMTYpICogZCArIGMgKiAoYiA+Pj4gMTYpKSA8PCAxNikgPj4+IDApKSB8IDA7IC8vIGludFxuICAgICAgfTtcblxuLy8gdjggaGFzIGFuIG9wdGltaXphdGlvbiBmb3Igc3RvcmluZyAzMS1iaXQgc2lnbmVkIG51bWJlcnMuXG4vLyBWYWx1ZXMgd2hpY2ggaGF2ZSBlaXRoZXIgMDAgb3IgMTEgYXMgdGhlIGhpZ2ggb3JkZXIgYml0cyBxdWFsaWZ5LlxuLy8gVGhpcyBmdW5jdGlvbiBkcm9wcyB0aGUgaGlnaGVzdCBvcmRlciBiaXQgaW4gYSBzaWduZWQgbnVtYmVyLCBtYWludGFpbmluZ1xuLy8gdGhlIHNpZ24gYml0LlxuZnVuY3Rpb24gc21pKGkzMikge1xuICByZXR1cm4gKChpMzIgPj4+IDEpICYgMHg0MDAwMDAwMCkgfCAoaTMyICYgMHhiZmZmZmZmZik7XG59XG5cbnZhciBkZWZhdWx0VmFsdWVPZiA9IE9iamVjdC5wcm90b3R5cGUudmFsdWVPZjtcblxuZnVuY3Rpb24gaGFzaChvKSB7XG4gIGlmIChvID09IG51bGwpIHtcbiAgICByZXR1cm4gaGFzaE51bGxpc2gobyk7XG4gIH1cblxuICBpZiAodHlwZW9mIG8uaGFzaENvZGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBEcm9wIGFueSBoaWdoIGJpdHMgZnJvbSBhY2NpZGVudGFsbHkgbG9uZyBoYXNoIGNvZGVzLlxuICAgIHJldHVybiBzbWkoby5oYXNoQ29kZShvKSk7XG4gIH1cblxuICB2YXIgdiA9IHZhbHVlT2Yobyk7XG5cbiAgaWYgKHYgPT0gbnVsbCkge1xuICAgIHJldHVybiBoYXNoTnVsbGlzaCh2KTtcbiAgfVxuXG4gIHN3aXRjaCAodHlwZW9mIHYpIHtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIC8vIFRoZSBoYXNoIHZhbHVlcyBmb3IgYnVpbHQtaW4gY29uc3RhbnRzIGFyZSBhIDEgdmFsdWUgZm9yIGVhY2ggNS1ieXRlXG4gICAgICAvLyBzaGlmdCByZWdpb24gZXhwZWN0IGZvciB0aGUgZmlyc3QsIHdoaWNoIGVuY29kZXMgdGhlIHZhbHVlLiBUaGlzXG4gICAgICAvLyByZWR1Y2VzIHRoZSBvZGRzIG9mIGEgaGFzaCBjb2xsaXNpb24gZm9yIHRoZXNlIGNvbW1vbiB2YWx1ZXMuXG4gICAgICByZXR1cm4gdiA/IDB4NDIxMDg0MjEgOiAweDQyMTA4NDIwO1xuICAgIGNhc2UgJ251bWJlcic6XG4gICAgICByZXR1cm4gaGFzaE51bWJlcih2KTtcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgcmV0dXJuIHYubGVuZ3RoID4gU1RSSU5HX0hBU0hfQ0FDSEVfTUlOX1NUUkxFTlxuICAgICAgICA/IGNhY2hlZEhhc2hTdHJpbmcodilcbiAgICAgICAgOiBoYXNoU3RyaW5nKHYpO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgcmV0dXJuIGhhc2hKU09iaih2KTtcbiAgICBjYXNlICdzeW1ib2wnOlxuICAgICAgcmV0dXJuIGhhc2hTeW1ib2wodik7XG4gICAgZGVmYXVsdDpcbiAgICAgIGlmICh0eXBlb2Ygdi50b1N0cmluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gaGFzaFN0cmluZyh2LnRvU3RyaW5nKCkpO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdWYWx1ZSB0eXBlICcgKyB0eXBlb2YgdiArICcgY2Fubm90IGJlIGhhc2hlZC4nKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBoYXNoTnVsbGlzaChudWxsaXNoKSB7XG4gIHJldHVybiBudWxsaXNoID09PSBudWxsID8gMHg0MjEwODQyMiA6IC8qIHVuZGVmaW5lZCAqLyAweDQyMTA4NDIzO1xufVxuXG4vLyBDb21wcmVzcyBhcmJpdHJhcmlseSBsYXJnZSBudW1iZXJzIGludG8gc21pIGhhc2hlcy5cbmZ1bmN0aW9uIGhhc2hOdW1iZXIobikge1xuICBpZiAobiAhPT0gbiB8fCBuID09PSBJbmZpbml0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIHZhciBoYXNoID0gbiB8IDA7XG4gIGlmIChoYXNoICE9PSBuKSB7XG4gICAgaGFzaCBePSBuICogMHhmZmZmZmZmZjtcbiAgfVxuICB3aGlsZSAobiA+IDB4ZmZmZmZmZmYpIHtcbiAgICBuIC89IDB4ZmZmZmZmZmY7XG4gICAgaGFzaCBePSBuO1xuICB9XG4gIHJldHVybiBzbWkoaGFzaCk7XG59XG5cbmZ1bmN0aW9uIGNhY2hlZEhhc2hTdHJpbmcoc3RyaW5nKSB7XG4gIHZhciBoYXNoZWQgPSBzdHJpbmdIYXNoQ2FjaGVbc3RyaW5nXTtcbiAgaWYgKGhhc2hlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaGFzaGVkID0gaGFzaFN0cmluZyhzdHJpbmcpO1xuICAgIGlmIChTVFJJTkdfSEFTSF9DQUNIRV9TSVpFID09PSBTVFJJTkdfSEFTSF9DQUNIRV9NQVhfU0laRSkge1xuICAgICAgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSA9IDA7XG4gICAgICBzdHJpbmdIYXNoQ2FjaGUgPSB7fTtcbiAgICB9XG4gICAgU1RSSU5HX0hBU0hfQ0FDSEVfU0laRSsrO1xuICAgIHN0cmluZ0hhc2hDYWNoZVtzdHJpbmddID0gaGFzaGVkO1xuICB9XG4gIHJldHVybiBoYXNoZWQ7XG59XG5cbi8vIGh0dHA6Ly9qc3BlcmYuY29tL2hhc2hpbmctc3RyaW5nc1xuZnVuY3Rpb24gaGFzaFN0cmluZyhzdHJpbmcpIHtcbiAgLy8gVGhpcyBpcyB0aGUgaGFzaCBmcm9tIEpWTVxuICAvLyBUaGUgaGFzaCBjb2RlIGZvciBhIHN0cmluZyBpcyBjb21wdXRlZCBhc1xuICAvLyBzWzBdICogMzEgXiAobiAtIDEpICsgc1sxXSAqIDMxIF4gKG4gLSAyKSArIC4uLiArIHNbbiAtIDFdLFxuICAvLyB3aGVyZSBzW2ldIGlzIHRoZSBpdGggY2hhcmFjdGVyIG9mIHRoZSBzdHJpbmcgYW5kIG4gaXMgdGhlIGxlbmd0aCBvZlxuICAvLyB0aGUgc3RyaW5nLiBXZSBcIm1vZFwiIHRoZSByZXN1bHQgdG8gbWFrZSBpdCBiZXR3ZWVuIDAgKGluY2x1c2l2ZSkgYW5kIDJeMzFcbiAgLy8gKGV4Y2x1c2l2ZSkgYnkgZHJvcHBpbmcgaGlnaCBiaXRzLlxuICB2YXIgaGFzaGVkID0gMDtcbiAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHN0cmluZy5sZW5ndGg7IGlpKyspIHtcbiAgICBoYXNoZWQgPSAoMzEgKiBoYXNoZWQgKyBzdHJpbmcuY2hhckNvZGVBdChpaSkpIHwgMDtcbiAgfVxuICByZXR1cm4gc21pKGhhc2hlZCk7XG59XG5cbmZ1bmN0aW9uIGhhc2hTeW1ib2woc3ltKSB7XG4gIHZhciBoYXNoZWQgPSBzeW1ib2xNYXBbc3ltXTtcbiAgaWYgKGhhc2hlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGhhc2hlZDtcbiAgfVxuXG4gIGhhc2hlZCA9IG5leHRIYXNoKCk7XG5cbiAgc3ltYm9sTWFwW3N5bV0gPSBoYXNoZWQ7XG5cbiAgcmV0dXJuIGhhc2hlZDtcbn1cblxuZnVuY3Rpb24gaGFzaEpTT2JqKG9iaikge1xuICB2YXIgaGFzaGVkO1xuICBpZiAodXNpbmdXZWFrTWFwKSB7XG4gICAgaGFzaGVkID0gd2Vha01hcC5nZXQob2JqKTtcbiAgICBpZiAoaGFzaGVkICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBoYXNoZWQ7XG4gICAgfVxuICB9XG5cbiAgaGFzaGVkID0gb2JqW1VJRF9IQVNIX0tFWV07XG4gIGlmIChoYXNoZWQgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBoYXNoZWQ7XG4gIH1cblxuICBpZiAoIWNhbkRlZmluZVByb3BlcnR5KSB7XG4gICAgaGFzaGVkID0gb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlICYmIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZVtVSURfSEFTSF9LRVldO1xuICAgIGlmIChoYXNoZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGhhc2hlZDtcbiAgICB9XG5cbiAgICBoYXNoZWQgPSBnZXRJRU5vZGVIYXNoKG9iaik7XG4gICAgaWYgKGhhc2hlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gaGFzaGVkO1xuICAgIH1cbiAgfVxuXG4gIGhhc2hlZCA9IG5leHRIYXNoKCk7XG5cbiAgaWYgKHVzaW5nV2Vha01hcCkge1xuICAgIHdlYWtNYXAuc2V0KG9iaiwgaGFzaGVkKTtcbiAgfSBlbHNlIGlmIChpc0V4dGVuc2libGUgIT09IHVuZGVmaW5lZCAmJiBpc0V4dGVuc2libGUob2JqKSA9PT0gZmFsc2UpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vbi1leHRlbnNpYmxlIG9iamVjdHMgYXJlIG5vdCBhbGxvd2VkIGFzIGtleXMuJyk7XG4gIH0gZWxzZSBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBVSURfSEFTSF9LRVksIHtcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgIHZhbHVlOiBoYXNoZWQsXG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoXG4gICAgb2JqLnByb3BlcnR5SXNFbnVtZXJhYmxlICE9PSB1bmRlZmluZWQgJiZcbiAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgPT09IG9iai5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGVcbiAgKSB7XG4gICAgLy8gU2luY2Ugd2UgY2FuJ3QgZGVmaW5lIGEgbm9uLWVudW1lcmFibGUgcHJvcGVydHkgb24gdGhlIG9iamVjdFxuICAgIC8vIHdlJ2xsIGhpamFjayBvbmUgb2YgdGhlIGxlc3MtdXNlZCBub24tZW51bWVyYWJsZSBwcm9wZXJ0aWVzIHRvXG4gICAgLy8gc2F2ZSBvdXIgaGFzaCBvbiBpdC4gU2luY2UgdGhpcyBpcyBhIGZ1bmN0aW9uIGl0IHdpbGwgbm90IHNob3cgdXAgaW5cbiAgICAvLyBgSlNPTi5zdHJpbmdpZnlgIHdoaWNoIGlzIHdoYXQgd2Ugd2FudC5cbiAgICBvYmoucHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUucHJvcGVydHlJc0VudW1lcmFibGUuYXBwbHkoXG4gICAgICAgIHRoaXMsXG4gICAgICAgIGFyZ3VtZW50c1xuICAgICAgKTtcbiAgICB9O1xuICAgIG9iai5wcm9wZXJ0eUlzRW51bWVyYWJsZVtVSURfSEFTSF9LRVldID0gaGFzaGVkO1xuICB9IGVsc2UgaWYgKG9iai5ub2RlVHlwZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gQXQgdGhpcyBwb2ludCB3ZSBjb3VsZG4ndCBnZXQgdGhlIElFIGB1bmlxdWVJRGAgdG8gdXNlIGFzIGEgaGFzaFxuICAgIC8vIGFuZCB3ZSBjb3VsZG4ndCB1c2UgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSB0byBleHBsb2l0IHRoZVxuICAgIC8vIGRvbnRFbnVtIGJ1ZyBzbyB3ZSBzaW1wbHkgYWRkIHRoZSBgVUlEX0hBU0hfS0VZYCBvbiB0aGUgbm9kZVxuICAgIC8vIGl0c2VsZi5cbiAgICBvYmpbVUlEX0hBU0hfS0VZXSA9IGhhc2hlZDtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBzZXQgYSBub24tZW51bWVyYWJsZSBwcm9wZXJ0eSBvbiBvYmplY3QuJyk7XG4gIH1cblxuICByZXR1cm4gaGFzaGVkO1xufVxuXG4vLyBHZXQgcmVmZXJlbmNlcyB0byBFUzUgb2JqZWN0IG1ldGhvZHMuXG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZTtcblxuLy8gVHJ1ZSBpZiBPYmplY3QuZGVmaW5lUHJvcGVydHkgd29ya3MgYXMgZXhwZWN0ZWQuIElFOCBmYWlscyB0aGlzIHRlc3QuXG52YXIgY2FuRGVmaW5lUHJvcGVydHkgPSAoZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ0AnLCB7fSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn0pKCk7XG5cbi8vIElFIGhhcyBhIGB1bmlxdWVJRGAgcHJvcGVydHkgb24gRE9NIG5vZGVzLiBXZSBjYW4gY29uc3RydWN0IHRoZSBoYXNoIGZyb20gaXRcbi8vIGFuZCBhdm9pZCBtZW1vcnkgbGVha3MgZnJvbSB0aGUgSUUgY2xvbmVOb2RlIGJ1Zy5cbmZ1bmN0aW9uIGdldElFTm9kZUhhc2gobm9kZSkge1xuICBpZiAobm9kZSAmJiBub2RlLm5vZGVUeXBlID4gMCkge1xuICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgY2FzZSAxOiAvLyBFbGVtZW50XG4gICAgICAgIHJldHVybiBub2RlLnVuaXF1ZUlEO1xuICAgICAgY2FzZSA5OiAvLyBEb2N1bWVudFxuICAgICAgICByZXR1cm4gbm9kZS5kb2N1bWVudEVsZW1lbnQgJiYgbm9kZS5kb2N1bWVudEVsZW1lbnQudW5pcXVlSUQ7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIHZhbHVlT2Yob2JqKSB7XG4gIHJldHVybiBvYmoudmFsdWVPZiAhPT0gZGVmYXVsdFZhbHVlT2YgJiYgdHlwZW9mIG9iai52YWx1ZU9mID09PSAnZnVuY3Rpb24nXG4gICAgPyBvYmoudmFsdWVPZihvYmopXG4gICAgOiBvYmo7XG59XG5cbmZ1bmN0aW9uIG5leHRIYXNoKCkge1xuICB2YXIgbmV4dEhhc2ggPSArK19vYmpIYXNoVUlEO1xuICBpZiAoX29iakhhc2hVSUQgJiAweDQwMDAwMDAwKSB7XG4gICAgX29iakhhc2hVSUQgPSAwO1xuICB9XG4gIHJldHVybiBuZXh0SGFzaDtcbn1cblxuLy8gSWYgcG9zc2libGUsIHVzZSBhIFdlYWtNYXAuXG52YXIgdXNpbmdXZWFrTWFwID0gdHlwZW9mIFdlYWtNYXAgPT09ICdmdW5jdGlvbic7XG52YXIgd2Vha01hcDtcbmlmICh1c2luZ1dlYWtNYXApIHtcbiAgd2Vha01hcCA9IG5ldyBXZWFrTWFwKCk7XG59XG5cbnZhciBzeW1ib2xNYXAgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuXG52YXIgX29iakhhc2hVSUQgPSAwO1xuXG52YXIgVUlEX0hBU0hfS0VZID0gJ19faW1tdXRhYmxlaGFzaF9fJztcbmlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nKSB7XG4gIFVJRF9IQVNIX0tFWSA9IFN5bWJvbChVSURfSEFTSF9LRVkpO1xufVxuXG52YXIgU1RSSU5HX0hBU0hfQ0FDSEVfTUlOX1NUUkxFTiA9IDE2O1xudmFyIFNUUklOR19IQVNIX0NBQ0hFX01BWF9TSVpFID0gMjU1O1xudmFyIFNUUklOR19IQVNIX0NBQ0hFX1NJWkUgPSAwO1xudmFyIHN0cmluZ0hhc2hDYWNoZSA9IHt9O1xuXG52YXIgVG9LZXllZFNlcXVlbmNlID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoS2V5ZWRTZXEpIHtcbiAgZnVuY3Rpb24gVG9LZXllZFNlcXVlbmNlKGluZGV4ZWQsIHVzZUtleXMpIHtcbiAgICB0aGlzLl9pdGVyID0gaW5kZXhlZDtcbiAgICB0aGlzLl91c2VLZXlzID0gdXNlS2V5cztcbiAgICB0aGlzLnNpemUgPSBpbmRleGVkLnNpemU7XG4gIH1cblxuICBpZiAoIEtleWVkU2VxICkgVG9LZXllZFNlcXVlbmNlLl9fcHJvdG9fXyA9IEtleWVkU2VxO1xuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggS2V5ZWRTZXEgJiYgS2V5ZWRTZXEucHJvdG90eXBlICk7XG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUb0tleWVkU2VxdWVuY2U7XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGtleSwgbm90U2V0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci5nZXQoa2V5LCBub3RTZXRWYWx1ZSk7XG4gIH07XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBoYXMgKGtleSkge1xuICAgIHJldHVybiB0aGlzLl9pdGVyLmhhcyhrZXkpO1xuICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUudmFsdWVTZXEgPSBmdW5jdGlvbiB2YWx1ZVNlcSAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIudmFsdWVTZXEoKTtcbiAgfTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiByZXZlcnNlICgpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIHJldmVyc2VkU2VxdWVuY2UgPSByZXZlcnNlRmFjdG9yeSh0aGlzLCB0cnVlKTtcbiAgICBpZiAoIXRoaXMuX3VzZUtleXMpIHtcbiAgICAgIHJldmVyc2VkU2VxdWVuY2UudmFsdWVTZXEgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzJDEkMS5faXRlci50b1NlcSgpLnJldmVyc2UoKTsgfTtcbiAgICB9XG4gICAgcmV0dXJuIHJldmVyc2VkU2VxdWVuY2U7XG4gIH07XG5cbiAgVG9LZXllZFNlcXVlbmNlLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAgKG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICB2YXIgbWFwcGVkU2VxdWVuY2UgPSBtYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCk7XG4gICAgaWYgKCF0aGlzLl91c2VLZXlzKSB7XG4gICAgICBtYXBwZWRTZXF1ZW5jZS52YWx1ZVNlcSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMkMSQxLl9pdGVyLnRvU2VxKCkubWFwKG1hcHBlciwgY29udGV4dCk7IH07XG4gICAgfVxuICAgIHJldHVybiBtYXBwZWRTZXF1ZW5jZTtcbiAgfTtcblxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7IHJldHVybiBmbih2LCBrLCB0aGlzJDEkMSk7IH0sIHJldmVyc2UpO1xuICB9O1xuXG4gIFRvS2V5ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICB9O1xuXG4gIHJldHVybiBUb0tleWVkU2VxdWVuY2U7XG59KEtleWVkU2VxKSk7XG5Ub0tleWVkU2VxdWVuY2UucHJvdG90eXBlW0lTX09SREVSRURfU1lNQk9MXSA9IHRydWU7XG5cbnZhciBUb0luZGV4ZWRTZXF1ZW5jZSA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRTZXEpIHtcbiAgZnVuY3Rpb24gVG9JbmRleGVkU2VxdWVuY2UoaXRlcikge1xuICAgIHRoaXMuX2l0ZXIgPSBpdGVyO1xuICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgfVxuXG4gIGlmICggSW5kZXhlZFNlcSApIFRvSW5kZXhlZFNlcXVlbmNlLl9fcHJvdG9fXyA9IEluZGV4ZWRTZXE7XG4gIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEluZGV4ZWRTZXEgJiYgSW5kZXhlZFNlcS5wcm90b3R5cGUgKTtcbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gVG9JbmRleGVkU2VxdWVuY2U7XG5cbiAgVG9JbmRleGVkU2VxdWVuY2UucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuaW5jbHVkZXModmFsdWUpO1xuICB9O1xuXG4gIFRvSW5kZXhlZFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHZhciBpID0gMDtcbiAgICByZXZlcnNlICYmIGVuc3VyZVNpemUodGhpcyk7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKFxuICAgICAgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIGZuKHYsIHJldmVyc2UgPyB0aGlzJDEkMS5zaXplIC0gKytpIDogaSsrLCB0aGlzJDEkMSk7IH0sXG4gICAgICByZXZlcnNlXG4gICAgKTtcbiAgfTtcblxuICBUb0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuX19pdGVyYXRvciA9IGZ1bmN0aW9uIF9faXRlcmF0b3IgKHR5cGUsIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5faXRlci5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICB2YXIgaSA9IDA7XG4gICAgcmV2ZXJzZSAmJiBlbnN1cmVTaXplKHRoaXMpO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICByZXR1cm4gc3RlcC5kb25lXG4gICAgICAgID8gc3RlcFxuICAgICAgICA6IGl0ZXJhdG9yVmFsdWUoXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgcmV2ZXJzZSA/IHRoaXMkMSQxLnNpemUgLSArK2kgOiBpKyssXG4gICAgICAgICAgICBzdGVwLnZhbHVlLFxuICAgICAgICAgICAgc3RlcFxuICAgICAgICAgICk7XG4gICAgfSk7XG4gIH07XG5cbiAgcmV0dXJuIFRvSW5kZXhlZFNlcXVlbmNlO1xufShJbmRleGVkU2VxKSk7XG5cbnZhciBUb1NldFNlcXVlbmNlID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoU2V0U2VxKSB7XG4gIGZ1bmN0aW9uIFRvU2V0U2VxdWVuY2UoaXRlcikge1xuICAgIHRoaXMuX2l0ZXIgPSBpdGVyO1xuICAgIHRoaXMuc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgfVxuXG4gIGlmICggU2V0U2VxICkgVG9TZXRTZXF1ZW5jZS5fX3Byb3RvX18gPSBTZXRTZXE7XG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggU2V0U2VxICYmIFNldFNlcS5wcm90b3R5cGUgKTtcbiAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBUb1NldFNlcXVlbmNlO1xuXG4gIFRvU2V0U2VxdWVuY2UucHJvdG90eXBlLmhhcyA9IGZ1bmN0aW9uIGhhcyAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuaW5jbHVkZXMoa2V5KTtcbiAgfTtcblxuICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHJldHVybiB0aGlzLl9pdGVyLl9faXRlcmF0ZShmdW5jdGlvbiAodikgeyByZXR1cm4gZm4odiwgdiwgdGhpcyQxJDEpOyB9LCByZXZlcnNlKTtcbiAgfTtcblxuICBUb1NldFNlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIHJldHVybiBzdGVwLmRvbmVcbiAgICAgICAgPyBzdGVwXG4gICAgICAgIDogaXRlcmF0b3JWYWx1ZSh0eXBlLCBzdGVwLnZhbHVlLCBzdGVwLnZhbHVlLCBzdGVwKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gVG9TZXRTZXF1ZW5jZTtcbn0oU2V0U2VxKSk7XG5cbnZhciBGcm9tRW50cmllc1NlcXVlbmNlID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoS2V5ZWRTZXEpIHtcbiAgZnVuY3Rpb24gRnJvbUVudHJpZXNTZXF1ZW5jZShlbnRyaWVzKSB7XG4gICAgdGhpcy5faXRlciA9IGVudHJpZXM7XG4gICAgdGhpcy5zaXplID0gZW50cmllcy5zaXplO1xuICB9XG5cbiAgaWYgKCBLZXllZFNlcSApIEZyb21FbnRyaWVzU2VxdWVuY2UuX19wcm90b19fID0gS2V5ZWRTZXE7XG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggS2V5ZWRTZXEgJiYgS2V5ZWRTZXEucHJvdG90eXBlICk7XG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gRnJvbUVudHJpZXNTZXF1ZW5jZTtcblxuICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5lbnRyeVNlcSA9IGZ1bmN0aW9uIGVudHJ5U2VxICgpIHtcbiAgICByZXR1cm4gdGhpcy5faXRlci50b1NlcSgpO1xuICB9O1xuXG4gIEZyb21FbnRyaWVzU2VxdWVuY2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuX2l0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uIChlbnRyeSkge1xuICAgICAgLy8gQ2hlY2sgaWYgZW50cnkgZXhpc3RzIGZpcnN0IHNvIGFycmF5IGFjY2VzcyBkb2Vzbid0IHRocm93IGZvciBob2xlc1xuICAgICAgLy8gaW4gdGhlIHBhcmVudCBpdGVyYXRpb24uXG4gICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgdmFsaWRhdGVFbnRyeShlbnRyeSk7XG4gICAgICAgIHZhciBpbmRleGVkQ29sbGVjdGlvbiA9IGlzQ29sbGVjdGlvbihlbnRyeSk7XG4gICAgICAgIHJldHVybiBmbihcbiAgICAgICAgICBpbmRleGVkQ29sbGVjdGlvbiA/IGVudHJ5LmdldCgxKSA6IGVudHJ5WzFdLFxuICAgICAgICAgIGluZGV4ZWRDb2xsZWN0aW9uID8gZW50cnkuZ2V0KDApIDogZW50cnlbMF0sXG4gICAgICAgICAgdGhpcyQxJDFcbiAgICAgICAgKTtcbiAgICAgIH1cbiAgICB9LCByZXZlcnNlKTtcbiAgfTtcblxuICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX2l0ZXIuX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgIC8vIENoZWNrIGlmIGVudHJ5IGV4aXN0cyBmaXJzdCBzbyBhcnJheSBhY2Nlc3MgZG9lc24ndCB0aHJvdyBmb3IgaG9sZXNcbiAgICAgICAgLy8gaW4gdGhlIHBhcmVudCBpdGVyYXRpb24uXG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgIHZhbGlkYXRlRW50cnkoZW50cnkpO1xuICAgICAgICAgIHZhciBpbmRleGVkQ29sbGVjdGlvbiA9IGlzQ29sbGVjdGlvbihlbnRyeSk7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUoXG4gICAgICAgICAgICB0eXBlLFxuICAgICAgICAgICAgaW5kZXhlZENvbGxlY3Rpb24gPyBlbnRyeS5nZXQoMCkgOiBlbnRyeVswXSxcbiAgICAgICAgICAgIGluZGV4ZWRDb2xsZWN0aW9uID8gZW50cnkuZ2V0KDEpIDogZW50cnlbMV0sXG4gICAgICAgICAgICBzdGVwXG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIHJldHVybiBGcm9tRW50cmllc1NlcXVlbmNlO1xufShLZXllZFNlcSkpO1xuXG5Ub0luZGV4ZWRTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICBUb0tleWVkU2VxdWVuY2UucHJvdG90eXBlLmNhY2hlUmVzdWx0ID1cbiAgVG9TZXRTZXF1ZW5jZS5wcm90b3R5cGUuY2FjaGVSZXN1bHQgPVxuICBGcm9tRW50cmllc1NlcXVlbmNlLnByb3RvdHlwZS5jYWNoZVJlc3VsdCA9XG4gICAgY2FjaGVSZXN1bHRUaHJvdWdoO1xuXG5mdW5jdGlvbiBmbGlwRmFjdG9yeShjb2xsZWN0aW9uKSB7XG4gIHZhciBmbGlwU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIGZsaXBTZXF1ZW5jZS5faXRlciA9IGNvbGxlY3Rpb247XG4gIGZsaXBTZXF1ZW5jZS5zaXplID0gY29sbGVjdGlvbi5zaXplO1xuICBmbGlwU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbGxlY3Rpb247IH07XG4gIGZsaXBTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXZlcnNlZFNlcXVlbmNlID0gY29sbGVjdGlvbi5yZXZlcnNlLmFwcGx5KHRoaXMpOyAvLyBzdXBlci5yZXZlcnNlKClcbiAgICByZXZlcnNlZFNlcXVlbmNlLmZsaXAgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBjb2xsZWN0aW9uLnJldmVyc2UoKTsgfTtcbiAgICByZXR1cm4gcmV2ZXJzZWRTZXF1ZW5jZTtcbiAgfTtcbiAgZmxpcFNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGNvbGxlY3Rpb24uaW5jbHVkZXMoa2V5KTsgfTtcbiAgZmxpcFNlcXVlbmNlLmluY2x1ZGVzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gY29sbGVjdGlvbi5oYXMoa2V5KTsgfTtcbiAgZmxpcFNlcXVlbmNlLmNhY2hlUmVzdWx0ID0gY2FjaGVSZXN1bHRUaHJvdWdoO1xuICBmbGlwU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7IHJldHVybiBmbihrLCB2LCB0aGlzJDEkMSkgIT09IGZhbHNlOyB9LCByZXZlcnNlKTtcbiAgfTtcbiAgZmxpcFNlcXVlbmNlLl9faXRlcmF0b3JVbmNhY2hlZCA9IGZ1bmN0aW9uICh0eXBlLCByZXZlcnNlKSB7XG4gICAgaWYgKHR5cGUgPT09IElURVJBVEVfRU5UUklFUykge1xuICAgICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoIXN0ZXAuZG9uZSkge1xuICAgICAgICAgIHZhciBrID0gc3RlcC52YWx1ZVswXTtcbiAgICAgICAgICBzdGVwLnZhbHVlWzBdID0gc3RlcC52YWx1ZVsxXTtcbiAgICAgICAgICBzdGVwLnZhbHVlWzFdID0gaztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKFxuICAgICAgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMgPyBJVEVSQVRFX0tFWVMgOiBJVEVSQVRFX1ZBTFVFUyxcbiAgICAgIHJldmVyc2VcbiAgICApO1xuICB9O1xuICByZXR1cm4gZmxpcFNlcXVlbmNlO1xufVxuXG5mdW5jdGlvbiBtYXBGYWN0b3J5KGNvbGxlY3Rpb24sIG1hcHBlciwgY29udGV4dCkge1xuICB2YXIgbWFwcGVkU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIG1hcHBlZFNlcXVlbmNlLnNpemUgPSBjb2xsZWN0aW9uLnNpemU7XG4gIG1hcHBlZFNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIGNvbGxlY3Rpb24uaGFzKGtleSk7IH07XG4gIG1hcHBlZFNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uIChrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIHYgPSBjb2xsZWN0aW9uLmdldChrZXksIE5PVF9TRVQpO1xuICAgIHJldHVybiB2ID09PSBOT1RfU0VUXG4gICAgICA/IG5vdFNldFZhbHVlXG4gICAgICA6IG1hcHBlci5jYWxsKGNvbnRleHQsIHYsIGtleSwgY29sbGVjdGlvbik7XG4gIH07XG4gIG1hcHBlZFNlcXVlbmNlLl9faXRlcmF0ZVVuY2FjaGVkID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHJldHVybiBjb2xsZWN0aW9uLl9faXRlcmF0ZShcbiAgICAgIGZ1bmN0aW9uICh2LCBrLCBjKSB7IHJldHVybiBmbihtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjKSwgaywgdGhpcyQxJDEpICE9PSBmYWxzZTsgfSxcbiAgICAgIHJldmVyc2VcbiAgICApO1xuICB9O1xuICBtYXBwZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfVxuICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgIHZhciBrZXkgPSBlbnRyeVswXTtcbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKFxuICAgICAgICB0eXBlLFxuICAgICAgICBrZXksXG4gICAgICAgIG1hcHBlci5jYWxsKGNvbnRleHQsIGVudHJ5WzFdLCBrZXksIGNvbGxlY3Rpb24pLFxuICAgICAgICBzdGVwXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuICByZXR1cm4gbWFwcGVkU2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIHJldmVyc2VGYWN0b3J5KGNvbGxlY3Rpb24sIHVzZUtleXMpIHtcbiAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICB2YXIgcmV2ZXJzZWRTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShjb2xsZWN0aW9uKTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5faXRlciA9IGNvbGxlY3Rpb247XG4gIHJldmVyc2VkU2VxdWVuY2Uuc2l6ZSA9IGNvbGxlY3Rpb24uc2l6ZTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY29sbGVjdGlvbjsgfTtcbiAgaWYgKGNvbGxlY3Rpb24uZmxpcCkge1xuICAgIHJldmVyc2VkU2VxdWVuY2UuZmxpcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBmbGlwU2VxdWVuY2UgPSBmbGlwRmFjdG9yeShjb2xsZWN0aW9uKTtcbiAgICAgIGZsaXBTZXF1ZW5jZS5yZXZlcnNlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gY29sbGVjdGlvbi5mbGlwKCk7IH07XG4gICAgICByZXR1cm4gZmxpcFNlcXVlbmNlO1xuICAgIH07XG4gIH1cbiAgcmV2ZXJzZWRTZXF1ZW5jZS5nZXQgPSBmdW5jdGlvbiAoa2V5LCBub3RTZXRWYWx1ZSkgeyByZXR1cm4gY29sbGVjdGlvbi5nZXQodXNlS2V5cyA/IGtleSA6IC0xIC0ga2V5LCBub3RTZXRWYWx1ZSk7IH07XG4gIHJldmVyc2VkU2VxdWVuY2UuaGFzID0gZnVuY3Rpb24gKGtleSkgeyByZXR1cm4gY29sbGVjdGlvbi5oYXModXNlS2V5cyA/IGtleSA6IC0xIC0ga2V5KTsgfTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5pbmNsdWRlcyA9IGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gY29sbGVjdGlvbi5pbmNsdWRlcyh2YWx1ZSk7IH07XG4gIHJldmVyc2VkU2VxdWVuY2UuY2FjaGVSZXN1bHQgPSBjYWNoZVJlc3VsdFRocm91Z2g7XG4gIHJldmVyc2VkU2VxdWVuY2UuX19pdGVyYXRlID0gZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHZhciBpID0gMDtcbiAgICByZXZlcnNlICYmIGVuc3VyZVNpemUoY29sbGVjdGlvbik7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb24uX19pdGVyYXRlKFxuICAgICAgZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZuKHYsIHVzZUtleXMgPyBrIDogcmV2ZXJzZSA/IHRoaXMkMSQxLnNpemUgLSArK2kgOiBpKyssIHRoaXMkMSQxKTsgfSxcbiAgICAgICFyZXZlcnNlXG4gICAgKTtcbiAgfTtcbiAgcmV2ZXJzZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICB2YXIgaSA9IDA7XG4gICAgcmV2ZXJzZSAmJiBlbnN1cmVTaXplKGNvbGxlY3Rpb24pO1xuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsICFyZXZlcnNlKTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgIH1cbiAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdXNlS2V5cyA/IGVudHJ5WzBdIDogcmV2ZXJzZSA/IHRoaXMkMSQxLnNpemUgLSArK2kgOiBpKyssXG4gICAgICAgIGVudHJ5WzFdLFxuICAgICAgICBzdGVwXG4gICAgICApO1xuICAgIH0pO1xuICB9O1xuICByZXR1cm4gcmV2ZXJzZWRTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gZmlsdGVyRmFjdG9yeShjb2xsZWN0aW9uLCBwcmVkaWNhdGUsIGNvbnRleHQsIHVzZUtleXMpIHtcbiAgdmFyIGZpbHRlclNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGNvbGxlY3Rpb24pO1xuICBpZiAodXNlS2V5cykge1xuICAgIGZpbHRlclNlcXVlbmNlLmhhcyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgIHZhciB2ID0gY29sbGVjdGlvbi5nZXQoa2V5LCBOT1RfU0VUKTtcbiAgICAgIHJldHVybiB2ICE9PSBOT1RfU0VUICYmICEhcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwga2V5LCBjb2xsZWN0aW9uKTtcbiAgICB9O1xuICAgIGZpbHRlclNlcXVlbmNlLmdldCA9IGZ1bmN0aW9uIChrZXksIG5vdFNldFZhbHVlKSB7XG4gICAgICB2YXIgdiA9IGNvbGxlY3Rpb24uZ2V0KGtleSwgTk9UX1NFVCk7XG4gICAgICByZXR1cm4gdiAhPT0gTk9UX1NFVCAmJiBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrZXksIGNvbGxlY3Rpb24pXG4gICAgICAgID8gdlxuICAgICAgICA6IG5vdFNldFZhbHVlO1xuICAgIH07XG4gIH1cbiAgZmlsdGVyU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIGNvbGxlY3Rpb24uX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrLCBjKSB7XG4gICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpIHtcbiAgICAgICAgaXRlcmF0aW9ucysrO1xuICAgICAgICByZXR1cm4gZm4odiwgdXNlS2V5cyA/IGsgOiBpdGVyYXRpb25zIC0gMSwgdGhpcyQxJDEpO1xuICAgICAgfVxuICAgIH0sIHJldmVyc2UpO1xuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICB9O1xuICBmaWx0ZXJTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lKSB7XG4gICAgICAgICAgcmV0dXJuIHN0ZXA7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVudHJ5ID0gc3RlcC52YWx1ZTtcbiAgICAgICAgdmFyIGtleSA9IGVudHJ5WzBdO1xuICAgICAgICB2YXIgdmFsdWUgPSBlbnRyeVsxXTtcbiAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKGNvbnRleHQsIHZhbHVlLCBrZXksIGNvbGxlY3Rpb24pKSB7XG4gICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgdXNlS2V5cyA/IGtleSA6IGl0ZXJhdGlvbnMrKywgdmFsdWUsIHN0ZXApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBmaWx0ZXJTZXF1ZW5jZTtcbn1cblxuZnVuY3Rpb24gY291bnRCeUZhY3RvcnkoY29sbGVjdGlvbiwgZ3JvdXBlciwgY29udGV4dCkge1xuICB2YXIgZ3JvdXBzID0gTWFwKCkuYXNNdXRhYmxlKCk7XG4gIGNvbGxlY3Rpb24uX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgZ3JvdXBzLnVwZGF0ZShncm91cGVyLmNhbGwoY29udGV4dCwgdiwgaywgY29sbGVjdGlvbiksIDAsIGZ1bmN0aW9uIChhKSB7IHJldHVybiBhICsgMTsgfSk7XG4gIH0pO1xuICByZXR1cm4gZ3JvdXBzLmFzSW1tdXRhYmxlKCk7XG59XG5cbmZ1bmN0aW9uIGdyb3VwQnlGYWN0b3J5KGNvbGxlY3Rpb24sIGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgdmFyIGlzS2V5ZWRJdGVyID0gaXNLZXllZChjb2xsZWN0aW9uKTtcbiAgdmFyIGdyb3VwcyA9IChpc09yZGVyZWQoY29sbGVjdGlvbikgPyBPcmRlcmVkTWFwKCkgOiBNYXAoKSkuYXNNdXRhYmxlKCk7XG4gIGNvbGxlY3Rpb24uX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgZ3JvdXBzLnVwZGF0ZShcbiAgICAgIGdyb3VwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjb2xsZWN0aW9uKSxcbiAgICAgIGZ1bmN0aW9uIChhKSB7IHJldHVybiAoKGEgPSBhIHx8IFtdKSwgYS5wdXNoKGlzS2V5ZWRJdGVyID8gW2ssIHZdIDogdiksIGEpOyB9XG4gICAgKTtcbiAgfSk7XG4gIHZhciBjb2VyY2UgPSBjb2xsZWN0aW9uQ2xhc3MoY29sbGVjdGlvbik7XG4gIHJldHVybiBncm91cHMubWFwKGZ1bmN0aW9uIChhcnIpIHsgcmV0dXJuIHJlaWZ5KGNvbGxlY3Rpb24sIGNvZXJjZShhcnIpKTsgfSkuYXNJbW11dGFibGUoKTtcbn1cblxuZnVuY3Rpb24gc2xpY2VGYWN0b3J5KGNvbGxlY3Rpb24sIGJlZ2luLCBlbmQsIHVzZUtleXMpIHtcbiAgdmFyIG9yaWdpbmFsU2l6ZSA9IGNvbGxlY3Rpb24uc2l6ZTtcblxuICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCBvcmlnaW5hbFNpemUpKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICB2YXIgcmVzb2x2ZWRCZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgb3JpZ2luYWxTaXplKTtcbiAgdmFyIHJlc29sdmVkRW5kID0gcmVzb2x2ZUVuZChlbmQsIG9yaWdpbmFsU2l6ZSk7XG5cbiAgLy8gYmVnaW4gb3IgZW5kIHdpbGwgYmUgTmFOIGlmIHRoZXkgd2VyZSBwcm92aWRlZCBhcyBuZWdhdGl2ZSBudW1iZXJzIGFuZFxuICAvLyB0aGlzIGNvbGxlY3Rpb24ncyBzaXplIGlzIHVua25vd24uIEluIHRoYXQgY2FzZSwgY2FjaGUgZmlyc3Qgc28gdGhlcmUgaXNcbiAgLy8gYSBrbm93biBzaXplIGFuZCB0aGVzZSBkbyBub3QgcmVzb2x2ZSB0byBOYU4uXG4gIGlmIChyZXNvbHZlZEJlZ2luICE9PSByZXNvbHZlZEJlZ2luIHx8IHJlc29sdmVkRW5kICE9PSByZXNvbHZlZEVuZCkge1xuICAgIHJldHVybiBzbGljZUZhY3RvcnkoY29sbGVjdGlvbi50b1NlcSgpLmNhY2hlUmVzdWx0KCksIGJlZ2luLCBlbmQsIHVzZUtleXMpO1xuICB9XG5cbiAgLy8gTm90ZTogcmVzb2x2ZWRFbmQgaXMgdW5kZWZpbmVkIHdoZW4gdGhlIG9yaWdpbmFsIHNlcXVlbmNlJ3MgbGVuZ3RoIGlzXG4gIC8vIHVua25vd24gYW5kIHRoaXMgc2xpY2UgZGlkIG5vdCBzdXBwbHkgYW4gZW5kIGFuZCBzaG91bGQgY29udGFpbiBhbGxcbiAgLy8gZWxlbWVudHMgYWZ0ZXIgcmVzb2x2ZWRCZWdpbi5cbiAgLy8gSW4gdGhhdCBjYXNlLCByZXNvbHZlZFNpemUgd2lsbCBiZSBOYU4gYW5kIHNsaWNlU2l6ZSB3aWxsIHJlbWFpbiB1bmRlZmluZWQuXG4gIHZhciByZXNvbHZlZFNpemUgPSByZXNvbHZlZEVuZCAtIHJlc29sdmVkQmVnaW47XG4gIHZhciBzbGljZVNpemU7XG4gIGlmIChyZXNvbHZlZFNpemUgPT09IHJlc29sdmVkU2l6ZSkge1xuICAgIHNsaWNlU2l6ZSA9IHJlc29sdmVkU2l6ZSA8IDAgPyAwIDogcmVzb2x2ZWRTaXplO1xuICB9XG5cbiAgdmFyIHNsaWNlU2VxID0gbWFrZVNlcXVlbmNlKGNvbGxlY3Rpb24pO1xuXG4gIC8vIElmIGNvbGxlY3Rpb24uc2l6ZSBpcyB1bmRlZmluZWQsIHRoZSBzaXplIG9mIHRoZSByZWFsaXplZCBzbGljZVNlcSBpc1xuICAvLyB1bmtub3duIGF0IHRoaXMgcG9pbnQgdW5sZXNzIHRoZSBudW1iZXIgb2YgaXRlbXMgdG8gc2xpY2UgaXMgMFxuICBzbGljZVNlcS5zaXplID1cbiAgICBzbGljZVNpemUgPT09IDAgPyBzbGljZVNpemUgOiAoY29sbGVjdGlvbi5zaXplICYmIHNsaWNlU2l6ZSkgfHwgdW5kZWZpbmVkO1xuXG4gIGlmICghdXNlS2V5cyAmJiBpc1NlcShjb2xsZWN0aW9uKSAmJiBzbGljZVNpemUgPj0gMCkge1xuICAgIHNsaWNlU2VxLmdldCA9IGZ1bmN0aW9uIChpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICAgIGluZGV4ID0gd3JhcEluZGV4KHRoaXMsIGluZGV4KTtcbiAgICAgIHJldHVybiBpbmRleCA+PSAwICYmIGluZGV4IDwgc2xpY2VTaXplXG4gICAgICAgID8gY29sbGVjdGlvbi5nZXQoaW5kZXggKyByZXNvbHZlZEJlZ2luLCBub3RTZXRWYWx1ZSlcbiAgICAgICAgOiBub3RTZXRWYWx1ZTtcbiAgICB9O1xuICB9XG5cbiAgc2xpY2VTZXEuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgaWYgKHNsaWNlU2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGlmIChyZXZlcnNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5jYWNoZVJlc3VsdCgpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBza2lwcGVkID0gMDtcbiAgICB2YXIgaXNTa2lwcGluZyA9IHRydWU7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIGNvbGxlY3Rpb24uX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICBpZiAoIShpc1NraXBwaW5nICYmIChpc1NraXBwaW5nID0gc2tpcHBlZCsrIDwgcmVzb2x2ZWRCZWdpbikpKSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDEkMSkgIT09IGZhbHNlICYmXG4gICAgICAgICAgaXRlcmF0aW9ucyAhPT0gc2xpY2VTaXplXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG5cbiAgc2xpY2VTZXEuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICBpZiAoc2xpY2VTaXplICE9PSAwICYmIHJldmVyc2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhY2hlUmVzdWx0KCkuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgICB9XG4gICAgLy8gRG9uJ3QgYm90aGVyIGluc3RhbnRpYXRpbmcgcGFyZW50IGl0ZXJhdG9yIGlmIHRha2luZyAwLlxuICAgIGlmIChzbGljZVNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoaXRlcmF0b3JEb25lKTtcbiAgICB9XG4gICAgdmFyIGl0ZXJhdG9yID0gY29sbGVjdGlvbi5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIHZhciBza2lwcGVkID0gMDtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB3aGlsZSAoc2tpcHBlZCsrIDwgcmVzb2x2ZWRCZWdpbikge1xuICAgICAgICBpdGVyYXRvci5uZXh0KCk7XG4gICAgICB9XG4gICAgICBpZiAoKytpdGVyYXRpb25zID4gc2xpY2VTaXplKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgaWYgKHVzZUtleXMgfHwgdHlwZSA9PT0gSVRFUkFURV9WQUxVRVMgfHwgc3RlcC5kb25lKSB7XG4gICAgICAgIHJldHVybiBzdGVwO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGUgPT09IElURVJBVEVfS0VZUykge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zIC0gMSwgdW5kZWZpbmVkLCBzdGVwKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMgLSAxLCBzdGVwLnZhbHVlWzFdLCBzdGVwKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gc2xpY2VTZXE7XG59XG5cbmZ1bmN0aW9uIHRha2VXaGlsZUZhY3RvcnkoY29sbGVjdGlvbiwgcHJlZGljYXRlLCBjb250ZXh0KSB7XG4gIHZhciB0YWtlU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIHRha2VTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgY29sbGVjdGlvbi5fX2l0ZXJhdGUoXG4gICAgICBmdW5jdGlvbiAodiwgaywgYykgeyByZXR1cm4gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykgJiYgKytpdGVyYXRpb25zICYmIGZuKHYsIGssIHRoaXMkMSQxKTsgfVxuICAgICk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG4gIHRha2VTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0b3IgPSBjb2xsZWN0aW9uLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICB2YXIgaXRlcmF0aW5nID0gdHJ1ZTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghaXRlcmF0aW5nKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgIH1cbiAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICB2YXIgayA9IGVudHJ5WzBdO1xuICAgICAgdmFyIHYgPSBlbnRyeVsxXTtcbiAgICAgIGlmICghcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgdGhpcyQxJDEpKSB7XG4gICAgICAgIGl0ZXJhdGluZyA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTID8gc3RlcCA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaywgdiwgc3RlcCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiB0YWtlU2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIHNraXBXaGlsZUZhY3RvcnkoY29sbGVjdGlvbiwgcHJlZGljYXRlLCBjb250ZXh0LCB1c2VLZXlzKSB7XG4gIHZhciBza2lwU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIHNraXBTZXF1ZW5jZS5fX2l0ZXJhdGVVbmNhY2hlZCA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgaXNTa2lwcGluZyA9IHRydWU7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIGNvbGxlY3Rpb24uX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrLCBjKSB7XG4gICAgICBpZiAoIShpc1NraXBwaW5nICYmIChpc1NraXBwaW5nID0gcHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpKSkge1xuICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgIHJldHVybiBmbih2LCB1c2VLZXlzID8gayA6IGl0ZXJhdGlvbnMgLSAxLCB0aGlzJDEkMSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG4gIHNraXBTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0b3IgPSBjb2xsZWN0aW9uLl9faXRlcmF0b3IoSVRFUkFURV9FTlRSSUVTLCByZXZlcnNlKTtcbiAgICB2YXIgc2tpcHBpbmcgPSB0cnVlO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBzdGVwO1xuICAgICAgdmFyIGs7XG4gICAgICB2YXIgdjtcbiAgICAgIGRvIHtcbiAgICAgICAgc3RlcCA9IGl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgaWYgKHN0ZXAuZG9uZSkge1xuICAgICAgICAgIGlmICh1c2VLZXlzIHx8IHR5cGUgPT09IElURVJBVEVfVkFMVUVTKSB7XG4gICAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHR5cGUgPT09IElURVJBVEVfS0VZUykge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCB1bmRlZmluZWQsIHN0ZXApO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHN0ZXAudmFsdWVbMV0sIHN0ZXApO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgIGsgPSBlbnRyeVswXTtcbiAgICAgICAgdiA9IGVudHJ5WzFdO1xuICAgICAgICBza2lwcGluZyAmJiAoc2tpcHBpbmcgPSBwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCB0aGlzJDEkMSkpO1xuICAgICAgfSB3aGlsZSAoc2tpcHBpbmcpO1xuICAgICAgcmV0dXJuIHR5cGUgPT09IElURVJBVEVfRU5UUklFUyA/IHN0ZXAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGssIHYsIHN0ZXApO1xuICAgIH0pO1xuICB9O1xuICByZXR1cm4gc2tpcFNlcXVlbmNlO1xufVxuXG5mdW5jdGlvbiBjb25jYXRGYWN0b3J5KGNvbGxlY3Rpb24sIHZhbHVlcykge1xuICB2YXIgaXNLZXllZENvbGxlY3Rpb24gPSBpc0tleWVkKGNvbGxlY3Rpb24pO1xuICB2YXIgaXRlcnMgPSBbY29sbGVjdGlvbl1cbiAgICAuY29uY2F0KHZhbHVlcylcbiAgICAubWFwKGZ1bmN0aW9uICh2KSB7XG4gICAgICBpZiAoIWlzQ29sbGVjdGlvbih2KSkge1xuICAgICAgICB2ID0gaXNLZXllZENvbGxlY3Rpb25cbiAgICAgICAgICA/IGtleWVkU2VxRnJvbVZhbHVlKHYpXG4gICAgICAgICAgOiBpbmRleGVkU2VxRnJvbVZhbHVlKEFycmF5LmlzQXJyYXkodikgPyB2IDogW3ZdKTtcbiAgICAgIH0gZWxzZSBpZiAoaXNLZXllZENvbGxlY3Rpb24pIHtcbiAgICAgICAgdiA9IEtleWVkQ29sbGVjdGlvbih2KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2O1xuICAgIH0pXG4gICAgLmZpbHRlcihmdW5jdGlvbiAodikgeyByZXR1cm4gdi5zaXplICE9PSAwOyB9KTtcblxuICBpZiAoaXRlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cblxuICBpZiAoaXRlcnMubGVuZ3RoID09PSAxKSB7XG4gICAgdmFyIHNpbmdsZXRvbiA9IGl0ZXJzWzBdO1xuICAgIGlmIChcbiAgICAgIHNpbmdsZXRvbiA9PT0gY29sbGVjdGlvbiB8fFxuICAgICAgKGlzS2V5ZWRDb2xsZWN0aW9uICYmIGlzS2V5ZWQoc2luZ2xldG9uKSkgfHxcbiAgICAgIChpc0luZGV4ZWQoY29sbGVjdGlvbikgJiYgaXNJbmRleGVkKHNpbmdsZXRvbikpXG4gICAgKSB7XG4gICAgICByZXR1cm4gc2luZ2xldG9uO1xuICAgIH1cbiAgfVxuXG4gIHZhciBjb25jYXRTZXEgPSBuZXcgQXJyYXlTZXEoaXRlcnMpO1xuICBpZiAoaXNLZXllZENvbGxlY3Rpb24pIHtcbiAgICBjb25jYXRTZXEgPSBjb25jYXRTZXEudG9LZXllZFNlcSgpO1xuICB9IGVsc2UgaWYgKCFpc0luZGV4ZWQoY29sbGVjdGlvbikpIHtcbiAgICBjb25jYXRTZXEgPSBjb25jYXRTZXEudG9TZXRTZXEoKTtcbiAgfVxuICBjb25jYXRTZXEgPSBjb25jYXRTZXEuZmxhdHRlbih0cnVlKTtcbiAgY29uY2F0U2VxLnNpemUgPSBpdGVycy5yZWR1Y2UoZnVuY3Rpb24gKHN1bSwgc2VxKSB7XG4gICAgaWYgKHN1bSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YXIgc2l6ZSA9IHNlcS5zaXplO1xuICAgICAgaWYgKHNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gc3VtICsgc2l6ZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIDApO1xuICByZXR1cm4gY29uY2F0U2VxO1xufVxuXG5mdW5jdGlvbiBmbGF0dGVuRmFjdG9yeShjb2xsZWN0aW9uLCBkZXB0aCwgdXNlS2V5cykge1xuICB2YXIgZmxhdFNlcXVlbmNlID0gbWFrZVNlcXVlbmNlKGNvbGxlY3Rpb24pO1xuICBmbGF0U2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdGUoZm4sIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgdmFyIHN0b3BwZWQgPSBmYWxzZTtcbiAgICBmdW5jdGlvbiBmbGF0RGVlcChpdGVyLCBjdXJyZW50RGVwdGgpIHtcbiAgICAgIGl0ZXIuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgIGlmICgoIWRlcHRoIHx8IGN1cnJlbnREZXB0aCA8IGRlcHRoKSAmJiBpc0NvbGxlY3Rpb24odikpIHtcbiAgICAgICAgICBmbGF0RGVlcCh2LCBjdXJyZW50RGVwdGggKyAxKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVyYXRpb25zKys7XG4gICAgICAgICAgaWYgKGZuKHYsIHVzZUtleXMgPyBrIDogaXRlcmF0aW9ucyAtIDEsIGZsYXRTZXF1ZW5jZSkgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBzdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICFzdG9wcGVkO1xuICAgICAgfSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIGZsYXREZWVwKGNvbGxlY3Rpb24sIDApO1xuICAgIHJldHVybiBpdGVyYXRpb25zO1xuICB9O1xuICBmbGF0U2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICBpZiAocmV2ZXJzZSkge1xuICAgICAgcmV0dXJuIHRoaXMuY2FjaGVSZXN1bHQoKS5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgIH1cbiAgICB2YXIgaXRlcmF0b3IgPSBjb2xsZWN0aW9uLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgdmFyIHN0YWNrID0gW107XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgd2hpbGUgKGl0ZXJhdG9yKSB7XG4gICAgICAgIHZhciBzdGVwID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgICBpZiAoc3RlcC5kb25lICE9PSBmYWxzZSkge1xuICAgICAgICAgIGl0ZXJhdG9yID0gc3RhY2sucG9wKCk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHYgPSBzdGVwLnZhbHVlO1xuICAgICAgICBpZiAodHlwZSA9PT0gSVRFUkFURV9FTlRSSUVTKSB7XG4gICAgICAgICAgdiA9IHZbMV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCghZGVwdGggfHwgc3RhY2subGVuZ3RoIDwgZGVwdGgpICYmIGlzQ29sbGVjdGlvbih2KSkge1xuICAgICAgICAgIHN0YWNrLnB1c2goaXRlcmF0b3IpO1xuICAgICAgICAgIGl0ZXJhdG9yID0gdi5fX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB1c2VLZXlzID8gc3RlcCA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgaXRlcmF0aW9ucysrLCB2LCBzdGVwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdG9yRG9uZSgpO1xuICAgIH0pO1xuICB9O1xuICByZXR1cm4gZmxhdFNlcXVlbmNlO1xufVxuXG5mdW5jdGlvbiBmbGF0TWFwRmFjdG9yeShjb2xsZWN0aW9uLCBtYXBwZXIsIGNvbnRleHQpIHtcbiAgdmFyIGNvZXJjZSA9IGNvbGxlY3Rpb25DbGFzcyhjb2xsZWN0aW9uKTtcbiAgcmV0dXJuIGNvbGxlY3Rpb25cbiAgICAudG9TZXEoKVxuICAgIC5tYXAoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGNvZXJjZShtYXBwZXIuY2FsbChjb250ZXh0LCB2LCBrLCBjb2xsZWN0aW9uKSk7IH0pXG4gICAgLmZsYXR0ZW4odHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIGludGVycG9zZUZhY3RvcnkoY29sbGVjdGlvbiwgc2VwYXJhdG9yKSB7XG4gIHZhciBpbnRlcnBvc2VkU2VxdWVuY2UgPSBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbik7XG4gIGludGVycG9zZWRTZXF1ZW5jZS5zaXplID0gY29sbGVjdGlvbi5zaXplICYmIGNvbGxlY3Rpb24uc2l6ZSAqIDIgLSAxO1xuICBpbnRlcnBvc2VkU2VxdWVuY2UuX19pdGVyYXRlVW5jYWNoZWQgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIGNvbGxlY3Rpb24uX19pdGVyYXRlKFxuICAgICAgZnVuY3Rpb24gKHYpIHsgcmV0dXJuICghaXRlcmF0aW9ucyB8fCBmbihzZXBhcmF0b3IsIGl0ZXJhdGlvbnMrKywgdGhpcyQxJDEpICE9PSBmYWxzZSkgJiZcbiAgICAgICAgZm4odiwgaXRlcmF0aW9ucysrLCB0aGlzJDEkMSkgIT09IGZhbHNlOyB9LFxuICAgICAgcmV2ZXJzZVxuICAgICk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG4gIGludGVycG9zZWRTZXF1ZW5jZS5fX2l0ZXJhdG9yVW5jYWNoZWQgPSBmdW5jdGlvbiAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpdGVyYXRvciA9IGNvbGxlY3Rpb24uX19pdGVyYXRvcihJVEVSQVRFX1ZBTFVFUywgcmV2ZXJzZSk7XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBzdGVwO1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCFzdGVwIHx8IGl0ZXJhdGlvbnMgJSAyKSB7XG4gICAgICAgIHN0ZXAgPSBpdGVyYXRvci5uZXh0KCk7XG4gICAgICAgIGlmIChzdGVwLmRvbmUpIHtcbiAgICAgICAgICByZXR1cm4gc3RlcDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGl0ZXJhdGlvbnMgJSAyXG4gICAgICAgID8gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHNlcGFyYXRvcilcbiAgICAgICAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIGl0ZXJhdGlvbnMrKywgc3RlcC52YWx1ZSwgc3RlcCk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiBpbnRlcnBvc2VkU2VxdWVuY2U7XG59XG5cbmZ1bmN0aW9uIHNvcnRGYWN0b3J5KGNvbGxlY3Rpb24sIGNvbXBhcmF0b3IsIG1hcHBlcikge1xuICBpZiAoIWNvbXBhcmF0b3IpIHtcbiAgICBjb21wYXJhdG9yID0gZGVmYXVsdENvbXBhcmF0b3I7XG4gIH1cbiAgdmFyIGlzS2V5ZWRDb2xsZWN0aW9uID0gaXNLZXllZChjb2xsZWN0aW9uKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGVudHJpZXMgPSBjb2xsZWN0aW9uXG4gICAgLnRvU2VxKClcbiAgICAubWFwKGZ1bmN0aW9uICh2LCBrKSB7IHJldHVybiBbaywgdiwgaW5kZXgrKywgbWFwcGVyID8gbWFwcGVyKHYsIGssIGNvbGxlY3Rpb24pIDogdl07IH0pXG4gICAgLnZhbHVlU2VxKClcbiAgICAudG9BcnJheSgpO1xuICBlbnRyaWVzXG4gICAgLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIGNvbXBhcmF0b3IoYVszXSwgYlszXSkgfHwgYVsyXSAtIGJbMl07IH0pXG4gICAgLmZvckVhY2goXG4gICAgICBpc0tleWVkQ29sbGVjdGlvblxuICAgICAgICA/IGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICAgICAgICBlbnRyaWVzW2ldLmxlbmd0aCA9IDI7XG4gICAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uICh2LCBpKSB7XG4gICAgICAgICAgICBlbnRyaWVzW2ldID0gdlsxXTtcbiAgICAgICAgICB9XG4gICAgKTtcbiAgcmV0dXJuIGlzS2V5ZWRDb2xsZWN0aW9uXG4gICAgPyBLZXllZFNlcShlbnRyaWVzKVxuICAgIDogaXNJbmRleGVkKGNvbGxlY3Rpb24pXG4gICAgPyBJbmRleGVkU2VxKGVudHJpZXMpXG4gICAgOiBTZXRTZXEoZW50cmllcyk7XG59XG5cbmZ1bmN0aW9uIG1heEZhY3RvcnkoY29sbGVjdGlvbiwgY29tcGFyYXRvciwgbWFwcGVyKSB7XG4gIGlmICghY29tcGFyYXRvcikge1xuICAgIGNvbXBhcmF0b3IgPSBkZWZhdWx0Q29tcGFyYXRvcjtcbiAgfVxuICBpZiAobWFwcGVyKSB7XG4gICAgdmFyIGVudHJ5ID0gY29sbGVjdGlvblxuICAgICAgLnRvU2VxKClcbiAgICAgIC5tYXAoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIFt2LCBtYXBwZXIodiwgaywgY29sbGVjdGlvbildOyB9KVxuICAgICAgLnJlZHVjZShmdW5jdGlvbiAoYSwgYikgeyByZXR1cm4gKG1heENvbXBhcmUoY29tcGFyYXRvciwgYVsxXSwgYlsxXSkgPyBiIDogYSk7IH0pO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeVswXTtcbiAgfVxuICByZXR1cm4gY29sbGVjdGlvbi5yZWR1Y2UoZnVuY3Rpb24gKGEsIGIpIHsgcmV0dXJuIChtYXhDb21wYXJlKGNvbXBhcmF0b3IsIGEsIGIpID8gYiA6IGEpOyB9KTtcbn1cblxuZnVuY3Rpb24gbWF4Q29tcGFyZShjb21wYXJhdG9yLCBhLCBiKSB7XG4gIHZhciBjb21wID0gY29tcGFyYXRvcihiLCBhKTtcbiAgLy8gYiBpcyBjb25zaWRlcmVkIHRoZSBuZXcgbWF4IGlmIHRoZSBjb21wYXJhdG9yIGRlY2xhcmVzIHRoZW0gZXF1YWwsIGJ1dFxuICAvLyB0aGV5IGFyZSBub3QgZXF1YWwgYW5kIGIgaXMgaW4gZmFjdCBhIG51bGxpc2ggdmFsdWUuXG4gIHJldHVybiAoXG4gICAgKGNvbXAgPT09IDAgJiYgYiAhPT0gYSAmJiAoYiA9PT0gdW5kZWZpbmVkIHx8IGIgPT09IG51bGwgfHwgYiAhPT0gYikpIHx8XG4gICAgY29tcCA+IDBcbiAgKTtcbn1cblxuZnVuY3Rpb24gemlwV2l0aEZhY3Rvcnkoa2V5SXRlciwgemlwcGVyLCBpdGVycywgemlwQWxsKSB7XG4gIHZhciB6aXBTZXF1ZW5jZSA9IG1ha2VTZXF1ZW5jZShrZXlJdGVyKTtcbiAgdmFyIHNpemVzID0gbmV3IEFycmF5U2VxKGl0ZXJzKS5tYXAoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGkuc2l6ZTsgfSk7XG4gIHppcFNlcXVlbmNlLnNpemUgPSB6aXBBbGwgPyBzaXplcy5tYXgoKSA6IHNpemVzLm1pbigpO1xuICAvLyBOb3RlOiB0aGlzIGEgZ2VuZXJpYyBiYXNlIGltcGxlbWVudGF0aW9uIG9mIF9faXRlcmF0ZSBpbiB0ZXJtcyBvZlxuICAvLyBfX2l0ZXJhdG9yIHdoaWNoIG1heSBiZSBtb3JlIGdlbmVyaWNhbGx5IHVzZWZ1bCBpbiB0aGUgZnV0dXJlLlxuICB6aXBTZXF1ZW5jZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiAoZm4sIHJldmVyc2UpIHtcbiAgICAvKiBnZW5lcmljOlxuICAgIHZhciBpdGVyYXRvciA9IHRoaXMuX19pdGVyYXRvcihJVEVSQVRFX0VOVFJJRVMsIHJldmVyc2UpO1xuICAgIHZhciBzdGVwO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICBpdGVyYXRpb25zKys7XG4gICAgICBpZiAoZm4oc3RlcC52YWx1ZVsxXSwgc3RlcC52YWx1ZVswXSwgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgICAqL1xuICAgIC8vIGluZGV4ZWQ6XG4gICAgdmFyIGl0ZXJhdG9yID0gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfVkFMVUVTLCByZXZlcnNlKTtcbiAgICB2YXIgc3RlcDtcbiAgICB2YXIgaXRlcmF0aW9ucyA9IDA7XG4gICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgaWYgKGZuKHN0ZXAudmFsdWUsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaXRlcmF0aW9ucztcbiAgfTtcbiAgemlwU2VxdWVuY2UuX19pdGVyYXRvclVuY2FjaGVkID0gZnVuY3Rpb24gKHR5cGUsIHJldmVyc2UpIHtcbiAgICB2YXIgaXRlcmF0b3JzID0gaXRlcnMubWFwKFxuICAgICAgZnVuY3Rpb24gKGkpIHsgcmV0dXJuICgoaSA9IENvbGxlY3Rpb24oaSkpLCBnZXRJdGVyYXRvcihyZXZlcnNlID8gaS5yZXZlcnNlKCkgOiBpKSk7IH1cbiAgICApO1xuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgaXNEb25lID0gZmFsc2U7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RlcHM7XG4gICAgICBpZiAoIWlzRG9uZSkge1xuICAgICAgICBzdGVwcyA9IGl0ZXJhdG9ycy5tYXAoZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGkubmV4dCgpOyB9KTtcbiAgICAgICAgaXNEb25lID0gemlwQWxsID8gc3RlcHMuZXZlcnkoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMuZG9uZTsgfSkgOiBzdGVwcy5zb21lKGZ1bmN0aW9uIChzKSB7IHJldHVybiBzLmRvbmU7IH0pO1xuICAgICAgfVxuICAgICAgaWYgKGlzRG9uZSkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JEb25lKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZShcbiAgICAgICAgdHlwZSxcbiAgICAgICAgaXRlcmF0aW9ucysrLFxuICAgICAgICB6aXBwZXIuYXBwbHkoXG4gICAgICAgICAgbnVsbCxcbiAgICAgICAgICBzdGVwcy5tYXAoZnVuY3Rpb24gKHMpIHsgcmV0dXJuIHMudmFsdWU7IH0pXG4gICAgICAgIClcbiAgICAgICk7XG4gICAgfSk7XG4gIH07XG4gIHJldHVybiB6aXBTZXF1ZW5jZTtcbn1cblxuLy8gI3ByYWdtYSBIZWxwZXIgRnVuY3Rpb25zXG5cbmZ1bmN0aW9uIHJlaWZ5KGl0ZXIsIHNlcSkge1xuICByZXR1cm4gaXRlciA9PT0gc2VxID8gaXRlciA6IGlzU2VxKGl0ZXIpID8gc2VxIDogaXRlci5jb25zdHJ1Y3RvcihzZXEpO1xufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZUVudHJ5KGVudHJ5KSB7XG4gIGlmIChlbnRyeSAhPT0gT2JqZWN0KGVudHJ5KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0V4cGVjdGVkIFtLLCBWXSB0dXBsZTogJyArIGVudHJ5KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb2xsZWN0aW9uQ2xhc3MoY29sbGVjdGlvbikge1xuICByZXR1cm4gaXNLZXllZChjb2xsZWN0aW9uKVxuICAgID8gS2V5ZWRDb2xsZWN0aW9uXG4gICAgOiBpc0luZGV4ZWQoY29sbGVjdGlvbilcbiAgICA/IEluZGV4ZWRDb2xsZWN0aW9uXG4gICAgOiBTZXRDb2xsZWN0aW9uO1xufVxuXG5mdW5jdGlvbiBtYWtlU2VxdWVuY2UoY29sbGVjdGlvbikge1xuICByZXR1cm4gT2JqZWN0LmNyZWF0ZShcbiAgICAoaXNLZXllZChjb2xsZWN0aW9uKVxuICAgICAgPyBLZXllZFNlcVxuICAgICAgOiBpc0luZGV4ZWQoY29sbGVjdGlvbilcbiAgICAgID8gSW5kZXhlZFNlcVxuICAgICAgOiBTZXRTZXFcbiAgICApLnByb3RvdHlwZVxuICApO1xufVxuXG5mdW5jdGlvbiBjYWNoZVJlc3VsdFRocm91Z2goKSB7XG4gIGlmICh0aGlzLl9pdGVyLmNhY2hlUmVzdWx0KSB7XG4gICAgdGhpcy5faXRlci5jYWNoZVJlc3VsdCgpO1xuICAgIHRoaXMuc2l6ZSA9IHRoaXMuX2l0ZXIuc2l6ZTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICByZXR1cm4gU2VxLnByb3RvdHlwZS5jYWNoZVJlc3VsdC5jYWxsKHRoaXMpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyYXRvcihhLCBiKSB7XG4gIGlmIChhID09PSB1bmRlZmluZWQgJiYgYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAoYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICBpZiAoYiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG5cbiAgcmV0dXJuIGEgPiBiID8gMSA6IGEgPCBiID8gLTEgOiAwO1xufVxuXG5mdW5jdGlvbiBhcnJDb3B5KGFyciwgb2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCB8fCAwO1xuICB2YXIgbGVuID0gTWF0aC5tYXgoMCwgYXJyLmxlbmd0aCAtIG9mZnNldCk7XG4gIHZhciBuZXdBcnIgPSBuZXcgQXJyYXkobGVuKTtcbiAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGxlbjsgaWkrKykge1xuICAgIG5ld0FycltpaV0gPSBhcnJbaWkgKyBvZmZzZXRdO1xuICB9XG4gIHJldHVybiBuZXdBcnI7XG59XG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGVycm9yKSB7XG4gIGlmICghY29uZGl0aW9uKSB7IHRocm93IG5ldyBFcnJvcihlcnJvcik7IH1cbn1cblxuZnVuY3Rpb24gYXNzZXJ0Tm90SW5maW5pdGUoc2l6ZSkge1xuICBpbnZhcmlhbnQoXG4gICAgc2l6ZSAhPT0gSW5maW5pdHksXG4gICAgJ0Nhbm5vdCBwZXJmb3JtIHRoaXMgYWN0aW9uIHdpdGggYW4gaW5maW5pdGUgc2l6ZS4nXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNvZXJjZUtleVBhdGgoa2V5UGF0aCkge1xuICBpZiAoaXNBcnJheUxpa2Uoa2V5UGF0aCkgJiYgdHlwZW9mIGtleVBhdGggIT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGtleVBhdGg7XG4gIH1cbiAgaWYgKGlzT3JkZXJlZChrZXlQYXRoKSkge1xuICAgIHJldHVybiBrZXlQYXRoLnRvQXJyYXkoKTtcbiAgfVxuICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICdJbnZhbGlkIGtleVBhdGg6IGV4cGVjdGVkIE9yZGVyZWQgQ29sbGVjdGlvbiBvciBBcnJheTogJyArIGtleVBhdGhcbiAgKTtcbn1cblxudmFyIHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuZnVuY3Rpb24gaXNQbGFpbk9iamVjdCh2YWx1ZSkge1xuICAvLyBUaGUgYmFzZSBwcm90b3R5cGUncyB0b1N0cmluZyBkZWFscyB3aXRoIEFyZ3VtZW50IG9iamVjdHMgYW5kIG5hdGl2ZSBuYW1lc3BhY2VzIGxpa2UgTWF0aFxuICBpZiAoXG4gICAgIXZhbHVlIHx8XG4gICAgdHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0JyB8fFxuICAgIHRvU3RyaW5nLmNhbGwodmFsdWUpICE9PSAnW29iamVjdCBPYmplY3RdJ1xuICApIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICB2YXIgcHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICBpZiAocHJvdG8gPT09IG51bGwpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIEl0ZXJhdGl2ZWx5IGdvaW5nIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4gaXMgbmVlZGVkIGZvciBjcm9zcy1yZWFsbSBlbnZpcm9ubWVudHMgKGRpZmZlcmluZyBjb250ZXh0cywgaWZyYW1lcywgZXRjKVxuICB2YXIgcGFyZW50UHJvdG8gPSBwcm90bztcbiAgdmFyIG5leHRQcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihwcm90byk7XG4gIHdoaWxlIChuZXh0UHJvdG8gIT09IG51bGwpIHtcbiAgICBwYXJlbnRQcm90byA9IG5leHRQcm90bztcbiAgICBuZXh0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YocGFyZW50UHJvdG8pO1xuICB9XG4gIHJldHVybiBwYXJlbnRQcm90byA9PT0gcHJvdG87XG59XG5cbi8qKlxuICogUmV0dXJucyB0cnVlIGlmIHRoZSB2YWx1ZSBpcyBhIHBvdGVudGlhbGx5LXBlcnNpc3RlbnQgZGF0YSBzdHJ1Y3R1cmUsIGVpdGhlclxuICogcHJvdmlkZWQgYnkgSW1tdXRhYmxlLmpzIG9yIGEgcGxhaW4gQXJyYXkgb3IgT2JqZWN0LlxuICovXG5mdW5jdGlvbiBpc0RhdGFTdHJ1Y3R1cmUodmFsdWUpIHtcbiAgcmV0dXJuIChcbiAgICB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmXG4gICAgKGlzSW1tdXRhYmxlKHZhbHVlKSB8fCBBcnJheS5pc0FycmF5KHZhbHVlKSB8fCBpc1BsYWluT2JqZWN0KHZhbHVlKSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gcXVvdGVTdHJpbmcodmFsdWUpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IEpTT04uc3RyaW5naWZ5KHZhbHVlKSA6IFN0cmluZyh2YWx1ZSk7XG4gIH0gY2F0Y2ggKF9pZ25vcmVFcnJvcikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gaGFzKGNvbGxlY3Rpb24sIGtleSkge1xuICByZXR1cm4gaXNJbW11dGFibGUoY29sbGVjdGlvbilcbiAgICA/IGNvbGxlY3Rpb24uaGFzKGtleSlcbiAgICA6IGlzRGF0YVN0cnVjdHVyZShjb2xsZWN0aW9uKSAmJiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbGxlY3Rpb24sIGtleSk7XG59XG5cbmZ1bmN0aW9uIGdldChjb2xsZWN0aW9uLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gIHJldHVybiBpc0ltbXV0YWJsZShjb2xsZWN0aW9uKVxuICAgID8gY29sbGVjdGlvbi5nZXQoa2V5LCBub3RTZXRWYWx1ZSlcbiAgICA6ICFoYXMoY29sbGVjdGlvbiwga2V5KVxuICAgID8gbm90U2V0VmFsdWVcbiAgICA6IHR5cGVvZiBjb2xsZWN0aW9uLmdldCA9PT0gJ2Z1bmN0aW9uJ1xuICAgID8gY29sbGVjdGlvbi5nZXQoa2V5KVxuICAgIDogY29sbGVjdGlvbltrZXldO1xufVxuXG5mdW5jdGlvbiBzaGFsbG93Q29weShmcm9tKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGZyb20pKSB7XG4gICAgcmV0dXJuIGFyckNvcHkoZnJvbSk7XG4gIH1cbiAgdmFyIHRvID0ge307XG4gIGZvciAodmFyIGtleSBpbiBmcm9tKSB7XG4gICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuICAgICAgdG9ba2V5XSA9IGZyb21ba2V5XTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRvO1xufVxuXG5mdW5jdGlvbiByZW1vdmUoY29sbGVjdGlvbiwga2V5KSB7XG4gIGlmICghaXNEYXRhU3RydWN0dXJlKGNvbGxlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdDYW5ub3QgdXBkYXRlIG5vbi1kYXRhLXN0cnVjdHVyZSB2YWx1ZTogJyArIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG4gIGlmIChpc0ltbXV0YWJsZShjb2xsZWN0aW9uKSkge1xuICAgIGlmICghY29sbGVjdGlvbi5yZW1vdmUpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdDYW5ub3QgdXBkYXRlIGltbXV0YWJsZSB2YWx1ZSB3aXRob3V0IC5yZW1vdmUoKSBtZXRob2Q6ICcgKyBjb2xsZWN0aW9uXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbi5yZW1vdmUoa2V5KTtcbiAgfVxuICBpZiAoIWhhc093blByb3BlcnR5LmNhbGwoY29sbGVjdGlvbiwga2V5KSkge1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG4gIHZhciBjb2xsZWN0aW9uQ29weSA9IHNoYWxsb3dDb3B5KGNvbGxlY3Rpb24pO1xuICBpZiAoQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uQ29weSkpIHtcbiAgICBjb2xsZWN0aW9uQ29weS5zcGxpY2Uoa2V5LCAxKTtcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgY29sbGVjdGlvbkNvcHlba2V5XTtcbiAgfVxuICByZXR1cm4gY29sbGVjdGlvbkNvcHk7XG59XG5cbmZ1bmN0aW9uIHNldChjb2xsZWN0aW9uLCBrZXksIHZhbHVlKSB7XG4gIGlmICghaXNEYXRhU3RydWN0dXJlKGNvbGxlY3Rpb24pKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdDYW5ub3QgdXBkYXRlIG5vbi1kYXRhLXN0cnVjdHVyZSB2YWx1ZTogJyArIGNvbGxlY3Rpb25cbiAgICApO1xuICB9XG4gIGlmIChpc0ltbXV0YWJsZShjb2xsZWN0aW9uKSkge1xuICAgIGlmICghY29sbGVjdGlvbi5zZXQpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdDYW5ub3QgdXBkYXRlIGltbXV0YWJsZSB2YWx1ZSB3aXRob3V0IC5zZXQoKSBtZXRob2Q6ICcgKyBjb2xsZWN0aW9uXG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gY29sbGVjdGlvbi5zZXQoa2V5LCB2YWx1ZSk7XG4gIH1cbiAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoY29sbGVjdGlvbiwga2V5KSAmJiB2YWx1ZSA9PT0gY29sbGVjdGlvbltrZXldKSB7XG4gICAgcmV0dXJuIGNvbGxlY3Rpb247XG4gIH1cbiAgdmFyIGNvbGxlY3Rpb25Db3B5ID0gc2hhbGxvd0NvcHkoY29sbGVjdGlvbik7XG4gIGNvbGxlY3Rpb25Db3B5W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIGNvbGxlY3Rpb25Db3B5O1xufVxuXG5mdW5jdGlvbiB1cGRhdGVJbiQxKGNvbGxlY3Rpb24sIGtleVBhdGgsIG5vdFNldFZhbHVlLCB1cGRhdGVyKSB7XG4gIGlmICghdXBkYXRlcikge1xuICAgIHVwZGF0ZXIgPSBub3RTZXRWYWx1ZTtcbiAgICBub3RTZXRWYWx1ZSA9IHVuZGVmaW5lZDtcbiAgfVxuICB2YXIgdXBkYXRlZFZhbHVlID0gdXBkYXRlSW5EZWVwbHkoXG4gICAgaXNJbW11dGFibGUoY29sbGVjdGlvbiksXG4gICAgY29sbGVjdGlvbixcbiAgICBjb2VyY2VLZXlQYXRoKGtleVBhdGgpLFxuICAgIDAsXG4gICAgbm90U2V0VmFsdWUsXG4gICAgdXBkYXRlclxuICApO1xuICByZXR1cm4gdXBkYXRlZFZhbHVlID09PSBOT1RfU0VUID8gbm90U2V0VmFsdWUgOiB1cGRhdGVkVmFsdWU7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUluRGVlcGx5KFxuICBpbkltbXV0YWJsZSxcbiAgZXhpc3RpbmcsXG4gIGtleVBhdGgsXG4gIGksXG4gIG5vdFNldFZhbHVlLFxuICB1cGRhdGVyXG4pIHtcbiAgdmFyIHdhc05vdFNldCA9IGV4aXN0aW5nID09PSBOT1RfU0VUO1xuICBpZiAoaSA9PT0ga2V5UGF0aC5sZW5ndGgpIHtcbiAgICB2YXIgZXhpc3RpbmdWYWx1ZSA9IHdhc05vdFNldCA/IG5vdFNldFZhbHVlIDogZXhpc3Rpbmc7XG4gICAgdmFyIG5ld1ZhbHVlID0gdXBkYXRlcihleGlzdGluZ1ZhbHVlKTtcbiAgICByZXR1cm4gbmV3VmFsdWUgPT09IGV4aXN0aW5nVmFsdWUgPyBleGlzdGluZyA6IG5ld1ZhbHVlO1xuICB9XG4gIGlmICghd2FzTm90U2V0ICYmICFpc0RhdGFTdHJ1Y3R1cmUoZXhpc3RpbmcpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdDYW5ub3QgdXBkYXRlIHdpdGhpbiBub24tZGF0YS1zdHJ1Y3R1cmUgdmFsdWUgaW4gcGF0aCBbJyArXG4gICAgICAgIGtleVBhdGguc2xpY2UoMCwgaSkubWFwKHF1b3RlU3RyaW5nKSArXG4gICAgICAgICddOiAnICtcbiAgICAgICAgZXhpc3RpbmdcbiAgICApO1xuICB9XG4gIHZhciBrZXkgPSBrZXlQYXRoW2ldO1xuICB2YXIgbmV4dEV4aXN0aW5nID0gd2FzTm90U2V0ID8gTk9UX1NFVCA6IGdldChleGlzdGluZywga2V5LCBOT1RfU0VUKTtcbiAgdmFyIG5leHRVcGRhdGVkID0gdXBkYXRlSW5EZWVwbHkoXG4gICAgbmV4dEV4aXN0aW5nID09PSBOT1RfU0VUID8gaW5JbW11dGFibGUgOiBpc0ltbXV0YWJsZShuZXh0RXhpc3RpbmcpLFxuICAgIG5leHRFeGlzdGluZyxcbiAgICBrZXlQYXRoLFxuICAgIGkgKyAxLFxuICAgIG5vdFNldFZhbHVlLFxuICAgIHVwZGF0ZXJcbiAgKTtcbiAgcmV0dXJuIG5leHRVcGRhdGVkID09PSBuZXh0RXhpc3RpbmdcbiAgICA/IGV4aXN0aW5nXG4gICAgOiBuZXh0VXBkYXRlZCA9PT0gTk9UX1NFVFxuICAgID8gcmVtb3ZlKGV4aXN0aW5nLCBrZXkpXG4gICAgOiBzZXQoXG4gICAgICAgIHdhc05vdFNldCA/IChpbkltbXV0YWJsZSA/IGVtcHR5TWFwKCkgOiB7fSkgOiBleGlzdGluZyxcbiAgICAgICAga2V5LFxuICAgICAgICBuZXh0VXBkYXRlZFxuICAgICAgKTtcbn1cblxuZnVuY3Rpb24gc2V0SW4kMShjb2xsZWN0aW9uLCBrZXlQYXRoLCB2YWx1ZSkge1xuICByZXR1cm4gdXBkYXRlSW4kMShjb2xsZWN0aW9uLCBrZXlQYXRoLCBOT1RfU0VULCBmdW5jdGlvbiAoKSB7IHJldHVybiB2YWx1ZTsgfSk7XG59XG5cbmZ1bmN0aW9uIHNldEluKGtleVBhdGgsIHYpIHtcbiAgcmV0dXJuIHNldEluJDEodGhpcywga2V5UGF0aCwgdik7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZUluKGNvbGxlY3Rpb24sIGtleVBhdGgpIHtcbiAgcmV0dXJuIHVwZGF0ZUluJDEoY29sbGVjdGlvbiwga2V5UGF0aCwgZnVuY3Rpb24gKCkgeyByZXR1cm4gTk9UX1NFVDsgfSk7XG59XG5cbmZ1bmN0aW9uIGRlbGV0ZUluKGtleVBhdGgpIHtcbiAgcmV0dXJuIHJlbW92ZUluKHRoaXMsIGtleVBhdGgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGUkMShjb2xsZWN0aW9uLCBrZXksIG5vdFNldFZhbHVlLCB1cGRhdGVyKSB7XG4gIHJldHVybiB1cGRhdGVJbiQxKGNvbGxlY3Rpb24sIFtrZXldLCBub3RTZXRWYWx1ZSwgdXBkYXRlcik7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZShrZXksIG5vdFNldFZhbHVlLCB1cGRhdGVyKSB7XG4gIHJldHVybiBhcmd1bWVudHMubGVuZ3RoID09PSAxXG4gICAgPyBrZXkodGhpcylcbiAgICA6IHVwZGF0ZSQxKHRoaXMsIGtleSwgbm90U2V0VmFsdWUsIHVwZGF0ZXIpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVJbihrZXlQYXRoLCBub3RTZXRWYWx1ZSwgdXBkYXRlcikge1xuICByZXR1cm4gdXBkYXRlSW4kMSh0aGlzLCBrZXlQYXRoLCBub3RTZXRWYWx1ZSwgdXBkYXRlcik7XG59XG5cbmZ1bmN0aW9uIG1lcmdlJDEoKSB7XG4gIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB3aGlsZSAoIGxlbi0tICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICByZXR1cm4gbWVyZ2VJbnRvS2V5ZWRXaXRoKHRoaXMsIGl0ZXJzKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VXaXRoJDEobWVyZ2VyKSB7XG4gIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICBpZiAodHlwZW9mIG1lcmdlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgbWVyZ2VyIGZ1bmN0aW9uOiAnICsgbWVyZ2VyKTtcbiAgfVxuICByZXR1cm4gbWVyZ2VJbnRvS2V5ZWRXaXRoKHRoaXMsIGl0ZXJzLCBtZXJnZXIpO1xufVxuXG5mdW5jdGlvbiBtZXJnZUludG9LZXllZFdpdGgoY29sbGVjdGlvbiwgY29sbGVjdGlvbnMsIG1lcmdlcikge1xuICB2YXIgaXRlcnMgPSBbXTtcbiAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IGNvbGxlY3Rpb25zLmxlbmd0aDsgaWkrKykge1xuICAgIHZhciBjb2xsZWN0aW9uJDEgPSBLZXllZENvbGxlY3Rpb24oY29sbGVjdGlvbnNbaWldKTtcbiAgICBpZiAoY29sbGVjdGlvbiQxLnNpemUgIT09IDApIHtcbiAgICAgIGl0ZXJzLnB1c2goY29sbGVjdGlvbiQxKTtcbiAgICB9XG4gIH1cbiAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBjb2xsZWN0aW9uO1xuICB9XG4gIGlmIChcbiAgICBjb2xsZWN0aW9uLnRvU2VxKCkuc2l6ZSA9PT0gMCAmJlxuICAgICFjb2xsZWN0aW9uLl9fb3duZXJJRCAmJlxuICAgIGl0ZXJzLmxlbmd0aCA9PT0gMVxuICApIHtcbiAgICByZXR1cm4gY29sbGVjdGlvbi5jb25zdHJ1Y3RvcihpdGVyc1swXSk7XG4gIH1cbiAgcmV0dXJuIGNvbGxlY3Rpb24ud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoY29sbGVjdGlvbikge1xuICAgIHZhciBtZXJnZUludG9Db2xsZWN0aW9uID0gbWVyZ2VyXG4gICAgICA/IGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgdXBkYXRlJDEoY29sbGVjdGlvbiwga2V5LCBOT1RfU0VULCBmdW5jdGlvbiAob2xkVmFsKSB7IHJldHVybiBvbGRWYWwgPT09IE5PVF9TRVQgPyB2YWx1ZSA6IG1lcmdlcihvbGRWYWwsIHZhbHVlLCBrZXkpOyB9XG4gICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgIGNvbGxlY3Rpb24uc2V0KGtleSwgdmFsdWUpO1xuICAgICAgICB9O1xuICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCBpdGVycy5sZW5ndGg7IGlpKyspIHtcbiAgICAgIGl0ZXJzW2lpXS5mb3JFYWNoKG1lcmdlSW50b0NvbGxlY3Rpb24pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlKGNvbGxlY3Rpb24pIHtcbiAgdmFyIHNvdXJjZXMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgc291cmNlc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICByZXR1cm4gbWVyZ2VXaXRoU291cmNlcyhjb2xsZWN0aW9uLCBzb3VyY2VzKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VXaXRoKG1lcmdlciwgY29sbGVjdGlvbikge1xuICB2YXIgc291cmNlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgd2hpbGUgKCBsZW4tLSA+IDAgKSBzb3VyY2VzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMiBdO1xuXG4gIHJldHVybiBtZXJnZVdpdGhTb3VyY2VzKGNvbGxlY3Rpb24sIHNvdXJjZXMsIG1lcmdlcik7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcCQxKGNvbGxlY3Rpb24pIHtcbiAgdmFyIHNvdXJjZXMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgc291cmNlc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcblxuICByZXR1cm4gbWVyZ2VEZWVwV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcyk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcFdpdGgkMShtZXJnZXIsIGNvbGxlY3Rpb24pIHtcbiAgdmFyIHNvdXJjZXMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDI7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgc291cmNlc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDIgXTtcblxuICByZXR1cm4gbWVyZ2VEZWVwV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgbWVyZ2VyKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2VEZWVwV2l0aFNvdXJjZXMoY29sbGVjdGlvbiwgc291cmNlcywgbWVyZ2VyKSB7XG4gIHJldHVybiBtZXJnZVdpdGhTb3VyY2VzKGNvbGxlY3Rpb24sIHNvdXJjZXMsIGRlZXBNZXJnZXJXaXRoKG1lcmdlcikpO1xufVxuXG5mdW5jdGlvbiBtZXJnZVdpdGhTb3VyY2VzKGNvbGxlY3Rpb24sIHNvdXJjZXMsIG1lcmdlcikge1xuICBpZiAoIWlzRGF0YVN0cnVjdHVyZShjb2xsZWN0aW9uKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnQ2Fubm90IG1lcmdlIGludG8gbm9uLWRhdGEtc3RydWN0dXJlIHZhbHVlOiAnICsgY29sbGVjdGlvblxuICAgICk7XG4gIH1cbiAgaWYgKGlzSW1tdXRhYmxlKGNvbGxlY3Rpb24pKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBtZXJnZXIgPT09ICdmdW5jdGlvbicgJiYgY29sbGVjdGlvbi5tZXJnZVdpdGhcbiAgICAgID8gY29sbGVjdGlvbi5tZXJnZVdpdGguYXBwbHkoY29sbGVjdGlvbiwgWyBtZXJnZXIgXS5jb25jYXQoIHNvdXJjZXMgKSlcbiAgICAgIDogY29sbGVjdGlvbi5tZXJnZVxuICAgICAgPyBjb2xsZWN0aW9uLm1lcmdlLmFwcGx5KGNvbGxlY3Rpb24sIHNvdXJjZXMpXG4gICAgICA6IGNvbGxlY3Rpb24uY29uY2F0LmFwcGx5KGNvbGxlY3Rpb24sIHNvdXJjZXMpO1xuICB9XG4gIHZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheShjb2xsZWN0aW9uKTtcbiAgdmFyIG1lcmdlZCA9IGNvbGxlY3Rpb247XG4gIHZhciBDb2xsZWN0aW9uID0gaXNBcnJheSA/IEluZGV4ZWRDb2xsZWN0aW9uIDogS2V5ZWRDb2xsZWN0aW9uO1xuICB2YXIgbWVyZ2VJdGVtID0gaXNBcnJheVxuICAgID8gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIENvcHkgb24gd3JpdGVcbiAgICAgICAgaWYgKG1lcmdlZCA9PT0gY29sbGVjdGlvbikge1xuICAgICAgICAgIG1lcmdlZCA9IHNoYWxsb3dDb3B5KG1lcmdlZCk7XG4gICAgICAgIH1cbiAgICAgICAgbWVyZ2VkLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIDogZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgdmFyIGhhc1ZhbCA9IGhhc093blByb3BlcnR5LmNhbGwobWVyZ2VkLCBrZXkpO1xuICAgICAgICB2YXIgbmV4dFZhbCA9XG4gICAgICAgICAgaGFzVmFsICYmIG1lcmdlciA/IG1lcmdlcihtZXJnZWRba2V5XSwgdmFsdWUsIGtleSkgOiB2YWx1ZTtcbiAgICAgICAgaWYgKCFoYXNWYWwgfHwgbmV4dFZhbCAhPT0gbWVyZ2VkW2tleV0pIHtcbiAgICAgICAgICAvLyBDb3B5IG9uIHdyaXRlXG4gICAgICAgICAgaWYgKG1lcmdlZCA9PT0gY29sbGVjdGlvbikge1xuICAgICAgICAgICAgbWVyZ2VkID0gc2hhbGxvd0NvcHkobWVyZ2VkKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgbWVyZ2VkW2tleV0gPSBuZXh0VmFsO1xuICAgICAgICB9XG4gICAgICB9O1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZXMubGVuZ3RoOyBpKyspIHtcbiAgICBDb2xsZWN0aW9uKHNvdXJjZXNbaV0pLmZvckVhY2gobWVyZ2VJdGVtKTtcbiAgfVxuICByZXR1cm4gbWVyZ2VkO1xufVxuXG5mdW5jdGlvbiBkZWVwTWVyZ2VyV2l0aChtZXJnZXIpIHtcbiAgZnVuY3Rpb24gZGVlcE1lcmdlcihvbGRWYWx1ZSwgbmV3VmFsdWUsIGtleSkge1xuICAgIHJldHVybiBpc0RhdGFTdHJ1Y3R1cmUob2xkVmFsdWUpICYmXG4gICAgICBpc0RhdGFTdHJ1Y3R1cmUobmV3VmFsdWUpICYmXG4gICAgICBhcmVNZXJnZWFibGUob2xkVmFsdWUsIG5ld1ZhbHVlKVxuICAgICAgPyBtZXJnZVdpdGhTb3VyY2VzKG9sZFZhbHVlLCBbbmV3VmFsdWVdLCBkZWVwTWVyZ2VyKVxuICAgICAgOiBtZXJnZXJcbiAgICAgID8gbWVyZ2VyKG9sZFZhbHVlLCBuZXdWYWx1ZSwga2V5KVxuICAgICAgOiBuZXdWYWx1ZTtcbiAgfVxuICByZXR1cm4gZGVlcE1lcmdlcjtcbn1cblxuLyoqXG4gKiBJdCdzIHVuY2xlYXIgd2hhdCB0aGUgZGVzaXJlZCBiZWhhdmlvciBpcyBmb3IgbWVyZ2luZyB0d28gY29sbGVjdGlvbnMgdGhhdFxuICogZmFsbCBpbnRvIHNlcGFyYXRlIGNhdGVnb3JpZXMgYmV0d2VlbiBrZXllZCwgaW5kZXhlZCwgb3Igc2V0LWxpa2UsIHNvIHdlIG9ubHlcbiAqIGNvbnNpZGVyIHRoZW0gbWVyZ2VhYmxlIGlmIHRoZXkgZmFsbCBpbnRvIHRoZSBzYW1lIGNhdGVnb3J5LlxuICovXG5mdW5jdGlvbiBhcmVNZXJnZWFibGUob2xkRGF0YVN0cnVjdHVyZSwgbmV3RGF0YVN0cnVjdHVyZSkge1xuICB2YXIgb2xkU2VxID0gU2VxKG9sZERhdGFTdHJ1Y3R1cmUpO1xuICB2YXIgbmV3U2VxID0gU2VxKG5ld0RhdGFTdHJ1Y3R1cmUpO1xuICAvLyBUaGlzIGxvZ2ljIGFzc3VtZXMgdGhhdCBhIHNlcXVlbmNlIGNhbiBvbmx5IGZhbGwgaW50byBvbmUgb2YgdGhlIHRocmVlXG4gIC8vIGNhdGVnb3JpZXMgbWVudGlvbmVkIGFib3ZlIChzaW5jZSB0aGVyZSdzIG5vIGBpc1NldExpa2UoKWAgbWV0aG9kKS5cbiAgcmV0dXJuIChcbiAgICBpc0luZGV4ZWQob2xkU2VxKSA9PT0gaXNJbmRleGVkKG5ld1NlcSkgJiZcbiAgICBpc0tleWVkKG9sZFNlcSkgPT09IGlzS2V5ZWQobmV3U2VxKVxuICApO1xufVxuXG5mdW5jdGlvbiBtZXJnZURlZXAoKSB7XG4gIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB3aGlsZSAoIGxlbi0tICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICByZXR1cm4gbWVyZ2VEZWVwV2l0aFNvdXJjZXModGhpcywgaXRlcnMpO1xufVxuXG5mdW5jdGlvbiBtZXJnZURlZXBXaXRoKG1lcmdlcikge1xuICB2YXIgaXRlcnMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XG4gIHdoaWxlICggbGVuLS0gPiAwICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XG5cbiAgcmV0dXJuIG1lcmdlRGVlcFdpdGhTb3VyY2VzKHRoaXMsIGl0ZXJzLCBtZXJnZXIpO1xufVxuXG5mdW5jdGlvbiBtZXJnZUluKGtleVBhdGgpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGl0ZXJzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHJldHVybiB1cGRhdGVJbiQxKHRoaXMsIGtleVBhdGgsIGVtcHR5TWFwKCksIGZ1bmN0aW9uIChtKSB7IHJldHVybiBtZXJnZVdpdGhTb3VyY2VzKG0sIGl0ZXJzKTsgfSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlRGVlcEluKGtleVBhdGgpIHtcbiAgdmFyIGl0ZXJzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuICB3aGlsZSAoIGxlbi0tID4gMCApIGl0ZXJzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xuXG4gIHJldHVybiB1cGRhdGVJbiQxKHRoaXMsIGtleVBhdGgsIGVtcHR5TWFwKCksIGZ1bmN0aW9uIChtKSB7IHJldHVybiBtZXJnZURlZXBXaXRoU291cmNlcyhtLCBpdGVycyk7IH1cbiAgKTtcbn1cblxuZnVuY3Rpb24gd2l0aE11dGF0aW9ucyhmbikge1xuICB2YXIgbXV0YWJsZSA9IHRoaXMuYXNNdXRhYmxlKCk7XG4gIGZuKG11dGFibGUpO1xuICByZXR1cm4gbXV0YWJsZS53YXNBbHRlcmVkKCkgPyBtdXRhYmxlLl9fZW5zdXJlT3duZXIodGhpcy5fX293bmVySUQpIDogdGhpcztcbn1cblxuZnVuY3Rpb24gYXNNdXRhYmxlKCkge1xuICByZXR1cm4gdGhpcy5fX293bmVySUQgPyB0aGlzIDogdGhpcy5fX2Vuc3VyZU93bmVyKG5ldyBPd25lcklEKCkpO1xufVxuXG5mdW5jdGlvbiBhc0ltbXV0YWJsZSgpIHtcbiAgcmV0dXJuIHRoaXMuX19lbnN1cmVPd25lcigpO1xufVxuXG5mdW5jdGlvbiB3YXNBbHRlcmVkKCkge1xuICByZXR1cm4gdGhpcy5fX2FsdGVyZWQ7XG59XG5cbnZhciBNYXAgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChLZXllZENvbGxlY3Rpb24pIHtcbiAgZnVuY3Rpb24gTWFwKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlNYXAoKVxuICAgICAgOiBpc01hcCh2YWx1ZSkgJiYgIWlzT3JkZXJlZCh2YWx1ZSlcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZW1wdHlNYXAoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgICAgICB2YXIgaXRlciA9IEtleWVkQ29sbGVjdGlvbih2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIG1hcC5zZXQoaywgdik7IH0pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGlmICggS2V5ZWRDb2xsZWN0aW9uICkgTWFwLl9fcHJvdG9fXyA9IEtleWVkQ29sbGVjdGlvbjtcbiAgTWFwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEtleWVkQ29sbGVjdGlvbiAmJiBLZXllZENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIE1hcC5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNYXA7XG5cbiAgTWFwLm9mID0gZnVuY3Rpb24gb2YgKCkge1xuICAgIHZhciBrZXlWYWx1ZXMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAoIGxlbi0tICkga2V5VmFsdWVzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICByZXR1cm4gZW1wdHlNYXAoKS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwga2V5VmFsdWVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgICAgIGlmIChpICsgMSA+PSBrZXlWYWx1ZXMubGVuZ3RoKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nIHZhbHVlIGZvciBrZXk6ICcgKyBrZXlWYWx1ZXNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIG1hcC5zZXQoa2V5VmFsdWVzW2ldLCBrZXlWYWx1ZXNbaSArIDFdKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ01hcCB7JywgJ30nKTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gIE1hcC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChrLCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9yb290XG4gICAgICA/IHRoaXMuX3Jvb3QuZ2V0KDAsIHVuZGVmaW5lZCwgaywgbm90U2V0VmFsdWUpXG4gICAgICA6IG5vdFNldFZhbHVlO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQgKGssIHYpIHtcbiAgICByZXR1cm4gdXBkYXRlTWFwKHRoaXMsIGssIHYpO1xuICB9O1xuXG4gIE1hcC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChrKSB7XG4gICAgcmV0dXJuIHVwZGF0ZU1hcCh0aGlzLCBrLCBOT1RfU0VUKTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLmRlbGV0ZUFsbCA9IGZ1bmN0aW9uIGRlbGV0ZUFsbCAoa2V5cykge1xuICAgIHZhciBjb2xsZWN0aW9uID0gQ29sbGVjdGlvbihrZXlzKTtcblxuICAgIGlmIChjb2xsZWN0aW9uLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKG1hcCkge1xuICAgICAgY29sbGVjdGlvbi5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgcmV0dXJuIG1hcC5yZW1vdmUoa2V5KTsgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgTWFwLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uIGNsZWFyICgpIHtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gZW1wdHlNYXAoKTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIENvbXBvc2l0aW9uXG5cbiAgTWFwLnByb3RvdHlwZS5zb3J0ID0gZnVuY3Rpb24gc29ydCAoY29tcGFyYXRvcikge1xuICAgIC8vIExhdGUgYmluZGluZ1xuICAgIHJldHVybiBPcmRlcmVkTWFwKHNvcnRGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IpKTtcbiAgfTtcblxuICBNYXAucHJvdG90eXBlLnNvcnRCeSA9IGZ1bmN0aW9uIHNvcnRCeSAobWFwcGVyLCBjb21wYXJhdG9yKSB7XG4gICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgcmV0dXJuIE9yZGVyZWRNYXAoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvciwgbWFwcGVyKSk7XG4gIH07XG5cbiAgTWFwLnByb3RvdHlwZS5tYXAgPSBmdW5jdGlvbiBtYXAgKG1hcHBlciwgY29udGV4dCkge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChtYXApIHtcbiAgICAgIG1hcC5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgIG1hcC5zZXQoa2V5LCBtYXBwZXIuY2FsbChjb250ZXh0LCB2YWx1ZSwga2V5LCB0aGlzJDEkMSkpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNdXRhYmlsaXR5XG5cbiAgTWFwLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHJldHVybiBuZXcgTWFwSXRlcmF0b3IodGhpcywgdHlwZSwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgTWFwLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB0aGlzLl9yb290ICYmXG4gICAgICB0aGlzLl9yb290Lml0ZXJhdGUoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgIGl0ZXJhdGlvbnMrKztcbiAgICAgICAgcmV0dXJuIGZuKGVudHJ5WzFdLCBlbnRyeVswXSwgdGhpcyQxJDEpO1xuICAgICAgfSwgcmV2ZXJzZSk7XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG5cbiAgTWFwLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24gX19lbnN1cmVPd25lciAob3duZXJJRCkge1xuICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICghb3duZXJJRCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZW1wdHlNYXAoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gZmFsc2U7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIG1ha2VNYXAodGhpcy5zaXplLCB0aGlzLl9yb290LCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gIH07XG5cbiAgcmV0dXJuIE1hcDtcbn0oS2V5ZWRDb2xsZWN0aW9uKSk7XG5cbk1hcC5pc01hcCA9IGlzTWFwO1xuXG52YXIgTWFwUHJvdG90eXBlID0gTWFwLnByb3RvdHlwZTtcbk1hcFByb3RvdHlwZVtJU19NQVBfU1lNQk9MXSA9IHRydWU7XG5NYXBQcm90b3R5cGVbREVMRVRFXSA9IE1hcFByb3RvdHlwZS5yZW1vdmU7XG5NYXBQcm90b3R5cGUucmVtb3ZlQWxsID0gTWFwUHJvdG90eXBlLmRlbGV0ZUFsbDtcbk1hcFByb3RvdHlwZS5zZXRJbiA9IHNldEluO1xuTWFwUHJvdG90eXBlLnJlbW92ZUluID0gTWFwUHJvdG90eXBlLmRlbGV0ZUluID0gZGVsZXRlSW47XG5NYXBQcm90b3R5cGUudXBkYXRlID0gdXBkYXRlO1xuTWFwUHJvdG90eXBlLnVwZGF0ZUluID0gdXBkYXRlSW47XG5NYXBQcm90b3R5cGUubWVyZ2UgPSBNYXBQcm90b3R5cGUuY29uY2F0ID0gbWVyZ2UkMTtcbk1hcFByb3RvdHlwZS5tZXJnZVdpdGggPSBtZXJnZVdpdGgkMTtcbk1hcFByb3RvdHlwZS5tZXJnZURlZXAgPSBtZXJnZURlZXA7XG5NYXBQcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IG1lcmdlRGVlcFdpdGg7XG5NYXBQcm90b3R5cGUubWVyZ2VJbiA9IG1lcmdlSW47XG5NYXBQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBtZXJnZURlZXBJbjtcbk1hcFByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gd2l0aE11dGF0aW9ucztcbk1hcFByb3RvdHlwZS53YXNBbHRlcmVkID0gd2FzQWx0ZXJlZDtcbk1hcFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IGFzSW1tdXRhYmxlO1xuTWFwUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gTWFwUHJvdG90eXBlLmFzTXV0YWJsZSA9IGFzTXV0YWJsZTtcbk1hcFByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGFycikge1xuICByZXR1cm4gcmVzdWx0LnNldChhcnJbMF0sIGFyclsxXSk7XG59O1xuTWFwUHJvdG90eXBlWydAQHRyYW5zZHVjZXIvcmVzdWx0J10gPSBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmouYXNJbW11dGFibGUoKTtcbn07XG5cbi8vICNwcmFnbWEgVHJpZSBOb2Rlc1xuXG52YXIgQXJyYXlNYXBOb2RlID0gZnVuY3Rpb24gQXJyYXlNYXBOb2RlKG93bmVySUQsIGVudHJpZXMpIHtcbiAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgdGhpcy5lbnRyaWVzID0gZW50cmllcztcbn07XG5cbkFycmF5TWFwTm9kZS5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChzaGlmdCwga2V5SGFzaCwga2V5LCBub3RTZXRWYWx1ZSkge1xuICB2YXIgZW50cmllcyA9IHRoaXMuZW50cmllcztcbiAgZm9yICh2YXIgaWkgPSAwLCBsZW4gPSBlbnRyaWVzLmxlbmd0aDsgaWkgPCBsZW47IGlpKyspIHtcbiAgICBpZiAoaXMoa2V5LCBlbnRyaWVzW2lpXVswXSkpIHtcbiAgICAgIHJldHVybiBlbnRyaWVzW2lpXVsxXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5vdFNldFZhbHVlO1xufTtcblxuQXJyYXlNYXBOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuXG4gIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICB2YXIgaWR4ID0gMDtcbiAgdmFyIGxlbiA9IGVudHJpZXMubGVuZ3RoO1xuICBmb3IgKDsgaWR4IDwgbGVuOyBpZHgrKykge1xuICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWR4XVswXSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgZXhpc3RzID0gaWR4IDwgbGVuO1xuXG4gIGlmIChleGlzdHMgPyBlbnRyaWVzW2lkeF1bMV0gPT09IHZhbHVlIDogcmVtb3ZlZCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgKHJlbW92ZWQgfHwgIWV4aXN0cykgJiYgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuXG4gIGlmIChyZW1vdmVkICYmIGVudHJpZXMubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgfVxuXG4gIGlmICghZXhpc3RzICYmICFyZW1vdmVkICYmIGVudHJpZXMubGVuZ3RoID49IE1BWF9BUlJBWV9NQVBfU0laRSkge1xuICAgIHJldHVybiBjcmVhdGVOb2Rlcyhvd25lcklELCBlbnRyaWVzLCBrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gIHZhciBuZXdFbnRyaWVzID0gaXNFZGl0YWJsZSA/IGVudHJpZXMgOiBhcnJDb3B5KGVudHJpZXMpO1xuXG4gIGlmIChleGlzdHMpIHtcbiAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgaWR4ID09PSBsZW4gLSAxXG4gICAgICAgID8gbmV3RW50cmllcy5wb3AoKVxuICAgICAgICA6IChuZXdFbnRyaWVzW2lkeF0gPSBuZXdFbnRyaWVzLnBvcCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3RW50cmllc1tpZHhdID0gW2tleSwgdmFsdWVdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuZXdFbnRyaWVzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfVxuXG4gIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgdGhpcy5lbnRyaWVzID0gbmV3RW50cmllcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiBuZXcgQXJyYXlNYXBOb2RlKG93bmVySUQsIG5ld0VudHJpZXMpO1xufTtcblxudmFyIEJpdG1hcEluZGV4ZWROb2RlID0gZnVuY3Rpb24gQml0bWFwSW5kZXhlZE5vZGUob3duZXJJRCwgYml0bWFwLCBub2Rlcykge1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xuICB0aGlzLmJpdG1hcCA9IGJpdG1hcDtcbiAgdGhpcy5ub2RlcyA9IG5vZGVzO1xufTtcblxuQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoc2hpZnQsIGtleUhhc2gsIGtleSwgbm90U2V0VmFsdWUpIHtcbiAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gIH1cbiAgdmFyIGJpdCA9IDEgPDwgKChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLKTtcbiAgdmFyIGJpdG1hcCA9IHRoaXMuYml0bWFwO1xuICByZXR1cm4gKGJpdG1hcCAmIGJpdCkgPT09IDBcbiAgICA/IG5vdFNldFZhbHVlXG4gICAgOiB0aGlzLm5vZGVzW3BvcENvdW50KGJpdG1hcCAmIChiaXQgLSAxKSldLmdldChcbiAgICAgICAgc2hpZnQgKyBTSElGVCxcbiAgICAgICAga2V5SGFzaCxcbiAgICAgICAga2V5LFxuICAgICAgICBub3RTZXRWYWx1ZVxuICAgICAgKTtcbn07XG5cbkJpdG1hcEluZGV4ZWROb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgfVxuICB2YXIga2V5SGFzaEZyYWcgPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgdmFyIGJpdCA9IDEgPDwga2V5SGFzaEZyYWc7XG4gIHZhciBiaXRtYXAgPSB0aGlzLmJpdG1hcDtcbiAgdmFyIGV4aXN0cyA9IChiaXRtYXAgJiBiaXQpICE9PSAwO1xuXG4gIGlmICghZXhpc3RzICYmIHZhbHVlID09PSBOT1RfU0VUKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgaWR4ID0gcG9wQ291bnQoYml0bWFwICYgKGJpdCAtIDEpKTtcbiAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgdmFyIG5vZGUgPSBleGlzdHMgPyBub2Rlc1tpZHhdIDogdW5kZWZpbmVkO1xuICB2YXIgbmV3Tm9kZSA9IHVwZGF0ZU5vZGUoXG4gICAgbm9kZSxcbiAgICBvd25lcklELFxuICAgIHNoaWZ0ICsgU0hJRlQsXG4gICAga2V5SGFzaCxcbiAgICBrZXksXG4gICAgdmFsdWUsXG4gICAgZGlkQ2hhbmdlU2l6ZSxcbiAgICBkaWRBbHRlclxuICApO1xuXG4gIGlmIChuZXdOb2RlID09PSBub2RlKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBpZiAoIWV4aXN0cyAmJiBuZXdOb2RlICYmIG5vZGVzLmxlbmd0aCA+PSBNQVhfQklUTUFQX0lOREVYRURfU0laRSkge1xuICAgIHJldHVybiBleHBhbmROb2Rlcyhvd25lcklELCBub2RlcywgYml0bWFwLCBrZXlIYXNoRnJhZywgbmV3Tm9kZSk7XG4gIH1cblxuICBpZiAoXG4gICAgZXhpc3RzICYmXG4gICAgIW5ld05vZGUgJiZcbiAgICBub2Rlcy5sZW5ndGggPT09IDIgJiZcbiAgICBpc0xlYWZOb2RlKG5vZGVzW2lkeCBeIDFdKVxuICApIHtcbiAgICByZXR1cm4gbm9kZXNbaWR4IF4gMV07XG4gIH1cblxuICBpZiAoZXhpc3RzICYmIG5ld05vZGUgJiYgbm9kZXMubGVuZ3RoID09PSAxICYmIGlzTGVhZk5vZGUobmV3Tm9kZSkpIHtcbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxuXG4gIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gIHZhciBuZXdCaXRtYXAgPSBleGlzdHMgPyAobmV3Tm9kZSA/IGJpdG1hcCA6IGJpdG1hcCBeIGJpdCkgOiBiaXRtYXAgfCBiaXQ7XG4gIHZhciBuZXdOb2RlcyA9IGV4aXN0c1xuICAgID8gbmV3Tm9kZVxuICAgICAgPyBzZXRBdChub2RlcywgaWR4LCBuZXdOb2RlLCBpc0VkaXRhYmxlKVxuICAgICAgOiBzcGxpY2VPdXQobm9kZXMsIGlkeCwgaXNFZGl0YWJsZSlcbiAgICA6IHNwbGljZUluKG5vZGVzLCBpZHgsIG5ld05vZGUsIGlzRWRpdGFibGUpO1xuXG4gIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgdGhpcy5iaXRtYXAgPSBuZXdCaXRtYXA7XG4gICAgdGhpcy5ub2RlcyA9IG5ld05vZGVzO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBCaXRtYXBJbmRleGVkTm9kZShvd25lcklELCBuZXdCaXRtYXAsIG5ld05vZGVzKTtcbn07XG5cbnZhciBIYXNoQXJyYXlNYXBOb2RlID0gZnVuY3Rpb24gSGFzaEFycmF5TWFwTm9kZShvd25lcklELCBjb3VudCwgbm9kZXMpIHtcbiAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgdGhpcy5jb3VudCA9IGNvdW50O1xuICB0aGlzLm5vZGVzID0gbm9kZXM7XG59O1xuXG5IYXNoQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gIGlmIChrZXlIYXNoID09PSB1bmRlZmluZWQpIHtcbiAgICBrZXlIYXNoID0gaGFzaChrZXkpO1xuICB9XG4gIHZhciBpZHggPSAoc2hpZnQgPT09IDAgPyBrZXlIYXNoIDoga2V5SGFzaCA+Pj4gc2hpZnQpICYgTUFTSztcbiAgdmFyIG5vZGUgPSB0aGlzLm5vZGVzW2lkeF07XG4gIHJldHVybiBub2RlXG4gICAgPyBub2RlLmdldChzaGlmdCArIFNISUZULCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKVxuICAgIDogbm90U2V0VmFsdWU7XG59O1xuXG5IYXNoQXJyYXlNYXBOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICBpZiAoa2V5SGFzaCA9PT0gdW5kZWZpbmVkKSB7XG4gICAga2V5SGFzaCA9IGhhc2goa2V5KTtcbiAgfVxuICB2YXIgaWR4ID0gKHNoaWZ0ID09PSAwID8ga2V5SGFzaCA6IGtleUhhc2ggPj4+IHNoaWZ0KSAmIE1BU0s7XG4gIHZhciByZW1vdmVkID0gdmFsdWUgPT09IE5PVF9TRVQ7XG4gIHZhciBub2RlcyA9IHRoaXMubm9kZXM7XG4gIHZhciBub2RlID0gbm9kZXNbaWR4XTtcblxuICBpZiAocmVtb3ZlZCAmJiAhbm9kZSkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgdmFyIG5ld05vZGUgPSB1cGRhdGVOb2RlKFxuICAgIG5vZGUsXG4gICAgb3duZXJJRCxcbiAgICBzaGlmdCArIFNISUZULFxuICAgIGtleUhhc2gsXG4gICAga2V5LFxuICAgIHZhbHVlLFxuICAgIGRpZENoYW5nZVNpemUsXG4gICAgZGlkQWx0ZXJcbiAgKTtcbiAgaWYgKG5ld05vZGUgPT09IG5vZGUpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHZhciBuZXdDb3VudCA9IHRoaXMuY291bnQ7XG4gIGlmICghbm9kZSkge1xuICAgIG5ld0NvdW50Kys7XG4gIH0gZWxzZSBpZiAoIW5ld05vZGUpIHtcbiAgICBuZXdDb3VudC0tO1xuICAgIGlmIChuZXdDb3VudCA8IE1JTl9IQVNIX0FSUkFZX01BUF9TSVpFKSB7XG4gICAgICByZXR1cm4gcGFja05vZGVzKG93bmVySUQsIG5vZGVzLCBuZXdDb3VudCwgaWR4KTtcbiAgICB9XG4gIH1cblxuICB2YXIgaXNFZGl0YWJsZSA9IG93bmVySUQgJiYgb3duZXJJRCA9PT0gdGhpcy5vd25lcklEO1xuICB2YXIgbmV3Tm9kZXMgPSBzZXRBdChub2RlcywgaWR4LCBuZXdOb2RlLCBpc0VkaXRhYmxlKTtcblxuICBpZiAoaXNFZGl0YWJsZSkge1xuICAgIHRoaXMuY291bnQgPSBuZXdDb3VudDtcbiAgICB0aGlzLm5vZGVzID0gbmV3Tm9kZXM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICByZXR1cm4gbmV3IEhhc2hBcnJheU1hcE5vZGUob3duZXJJRCwgbmV3Q291bnQsIG5ld05vZGVzKTtcbn07XG5cbnZhciBIYXNoQ29sbGlzaW9uTm9kZSA9IGZ1bmN0aW9uIEhhc2hDb2xsaXNpb25Ob2RlKG93bmVySUQsIGtleUhhc2gsIGVudHJpZXMpIHtcbiAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgdGhpcy5rZXlIYXNoID0ga2V5SGFzaDtcbiAgdGhpcy5lbnRyaWVzID0gZW50cmllcztcbn07XG5cbkhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gIHZhciBlbnRyaWVzID0gdGhpcy5lbnRyaWVzO1xuICBmb3IgKHZhciBpaSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKykge1xuICAgIGlmIChpcyhrZXksIGVudHJpZXNbaWldWzBdKSkge1xuICAgICAgcmV0dXJuIGVudHJpZXNbaWldWzFdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbm90U2V0VmFsdWU7XG59O1xuXG5IYXNoQ29sbGlzaW9uTm9kZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gdXBkYXRlIChvd25lcklELCBzaGlmdCwga2V5SGFzaCwga2V5LCB2YWx1ZSwgZGlkQ2hhbmdlU2l6ZSwgZGlkQWx0ZXIpIHtcbiAgaWYgKGtleUhhc2ggPT09IHVuZGVmaW5lZCkge1xuICAgIGtleUhhc2ggPSBoYXNoKGtleSk7XG4gIH1cblxuICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuXG4gIGlmIChrZXlIYXNoICE9PSB0aGlzLmtleUhhc2gpIHtcbiAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIFNldFJlZihkaWRBbHRlcik7XG4gICAgU2V0UmVmKGRpZENoYW5nZVNpemUpO1xuICAgIHJldHVybiBtZXJnZUludG9Ob2RlKHRoaXMsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBba2V5LCB2YWx1ZV0pO1xuICB9XG5cbiAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gIHZhciBpZHggPSAwO1xuICB2YXIgbGVuID0gZW50cmllcy5sZW5ndGg7XG4gIGZvciAoOyBpZHggPCBsZW47IGlkeCsrKSB7XG4gICAgaWYgKGlzKGtleSwgZW50cmllc1tpZHhdWzBdKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBleGlzdHMgPSBpZHggPCBsZW47XG5cbiAgaWYgKGV4aXN0cyA/IGVudHJpZXNbaWR4XVsxXSA9PT0gdmFsdWUgOiByZW1vdmVkKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBTZXRSZWYoZGlkQWx0ZXIpO1xuICAocmVtb3ZlZCB8fCAhZXhpc3RzKSAmJiBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG5cbiAgaWYgKHJlbW92ZWQgJiYgbGVuID09PSAyKSB7XG4gICAgcmV0dXJuIG5ldyBWYWx1ZU5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBlbnRyaWVzW2lkeCBeIDFdKTtcbiAgfVxuXG4gIHZhciBpc0VkaXRhYmxlID0gb3duZXJJRCAmJiBvd25lcklEID09PSB0aGlzLm93bmVySUQ7XG4gIHZhciBuZXdFbnRyaWVzID0gaXNFZGl0YWJsZSA/IGVudHJpZXMgOiBhcnJDb3B5KGVudHJpZXMpO1xuXG4gIGlmIChleGlzdHMpIHtcbiAgICBpZiAocmVtb3ZlZCkge1xuICAgICAgaWR4ID09PSBsZW4gLSAxXG4gICAgICAgID8gbmV3RW50cmllcy5wb3AoKVxuICAgICAgICA6IChuZXdFbnRyaWVzW2lkeF0gPSBuZXdFbnRyaWVzLnBvcCgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3RW50cmllc1tpZHhdID0gW2tleSwgdmFsdWVdO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBuZXdFbnRyaWVzLnB1c2goW2tleSwgdmFsdWVdKTtcbiAgfVxuXG4gIGlmIChpc0VkaXRhYmxlKSB7XG4gICAgdGhpcy5lbnRyaWVzID0gbmV3RW50cmllcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHJldHVybiBuZXcgSGFzaENvbGxpc2lvbk5vZGUob3duZXJJRCwgdGhpcy5rZXlIYXNoLCBuZXdFbnRyaWVzKTtcbn07XG5cbnZhciBWYWx1ZU5vZGUgPSBmdW5jdGlvbiBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgZW50cnkpIHtcbiAgdGhpcy5vd25lcklEID0gb3duZXJJRDtcbiAgdGhpcy5rZXlIYXNoID0ga2V5SGFzaDtcbiAgdGhpcy5lbnRyeSA9IGVudHJ5O1xufTtcblxuVmFsdWVOb2RlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKHNoaWZ0LCBrZXlIYXNoLCBrZXksIG5vdFNldFZhbHVlKSB7XG4gIHJldHVybiBpcyhrZXksIHRoaXMuZW50cnlbMF0pID8gdGhpcy5lbnRyeVsxXSA6IG5vdFNldFZhbHVlO1xufTtcblxuVmFsdWVOb2RlLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiB1cGRhdGUgKG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBrZXksIHZhbHVlLCBkaWRDaGFuZ2VTaXplLCBkaWRBbHRlcikge1xuICB2YXIgcmVtb3ZlZCA9IHZhbHVlID09PSBOT1RfU0VUO1xuICB2YXIga2V5TWF0Y2ggPSBpcyhrZXksIHRoaXMuZW50cnlbMF0pO1xuICBpZiAoa2V5TWF0Y2ggPyB2YWx1ZSA9PT0gdGhpcy5lbnRyeVsxXSA6IHJlbW92ZWQpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIFNldFJlZihkaWRBbHRlcik7XG5cbiAgaWYgKHJlbW92ZWQpIHtcbiAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgcmV0dXJuOyAvLyB1bmRlZmluZWRcbiAgfVxuXG4gIGlmIChrZXlNYXRjaCkge1xuICAgIGlmIChvd25lcklEICYmIG93bmVySUQgPT09IHRoaXMub3duZXJJRCkge1xuICAgICAgdGhpcy5lbnRyeVsxXSA9IHZhbHVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBuZXcgVmFsdWVOb2RlKG93bmVySUQsIHRoaXMua2V5SGFzaCwgW2tleSwgdmFsdWVdKTtcbiAgfVxuXG4gIFNldFJlZihkaWRDaGFuZ2VTaXplKTtcbiAgcmV0dXJuIG1lcmdlSW50b05vZGUodGhpcywgb3duZXJJRCwgc2hpZnQsIGhhc2goa2V5KSwgW2tleSwgdmFsdWVdKTtcbn07XG5cbi8vICNwcmFnbWEgSXRlcmF0b3JzXG5cbkFycmF5TWFwTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IEhhc2hDb2xsaXNpb25Ob2RlLnByb3RvdHlwZS5pdGVyYXRlID1cbiAgZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIGVudHJpZXMgPSB0aGlzLmVudHJpZXM7XG4gICAgZm9yICh2YXIgaWkgPSAwLCBtYXhJbmRleCA9IGVudHJpZXMubGVuZ3RoIC0gMTsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgIGlmIChmbihlbnRyaWVzW3JldmVyc2UgPyBtYXhJbmRleCAtIGlpIDogaWldKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuQml0bWFwSW5kZXhlZE5vZGUucHJvdG90eXBlLml0ZXJhdGUgPSBIYXNoQXJyYXlNYXBOb2RlLnByb3RvdHlwZS5pdGVyYXRlID1cbiAgZnVuY3Rpb24gKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIG5vZGVzID0gdGhpcy5ub2RlcztcbiAgICBmb3IgKHZhciBpaSA9IDAsIG1heEluZGV4ID0gbm9kZXMubGVuZ3RoIC0gMTsgaWkgPD0gbWF4SW5kZXg7IGlpKyspIHtcbiAgICAgIHZhciBub2RlID0gbm9kZXNbcmV2ZXJzZSA/IG1heEluZGV4IC0gaWkgOiBpaV07XG4gICAgICBpZiAobm9kZSAmJiBub2RlLml0ZXJhdGUoZm4sIHJldmVyc2UpID09PSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcblZhbHVlTm9kZS5wcm90b3R5cGUuaXRlcmF0ZSA9IGZ1bmN0aW9uIChmbiwgcmV2ZXJzZSkge1xuICByZXR1cm4gZm4odGhpcy5lbnRyeSk7XG59O1xuXG52YXIgTWFwSXRlcmF0b3IgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChJdGVyYXRvcikge1xuICBmdW5jdGlvbiBNYXBJdGVyYXRvcihtYXAsIHR5cGUsIHJldmVyc2UpIHtcbiAgICB0aGlzLl90eXBlID0gdHlwZTtcbiAgICB0aGlzLl9yZXZlcnNlID0gcmV2ZXJzZTtcbiAgICB0aGlzLl9zdGFjayA9IG1hcC5fcm9vdCAmJiBtYXBJdGVyYXRvckZyYW1lKG1hcC5fcm9vdCk7XG4gIH1cblxuICBpZiAoIEl0ZXJhdG9yICkgTWFwSXRlcmF0b3IuX19wcm90b19fID0gSXRlcmF0b3I7XG4gIE1hcEl0ZXJhdG9yLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEl0ZXJhdG9yICYmIEl0ZXJhdG9yLnByb3RvdHlwZSApO1xuICBNYXBJdGVyYXRvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNYXBJdGVyYXRvcjtcblxuICBNYXBJdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uIG5leHQgKCkge1xuICAgIHZhciB0eXBlID0gdGhpcy5fdHlwZTtcbiAgICB2YXIgc3RhY2sgPSB0aGlzLl9zdGFjaztcbiAgICB3aGlsZSAoc3RhY2spIHtcbiAgICAgIHZhciBub2RlID0gc3RhY2subm9kZTtcbiAgICAgIHZhciBpbmRleCA9IHN0YWNrLmluZGV4Kys7XG4gICAgICB2YXIgbWF4SW5kZXggPSAodm9pZCAwKTtcbiAgICAgIGlmIChub2RlLmVudHJ5KSB7XG4gICAgICAgIGlmIChpbmRleCA9PT0gMCkge1xuICAgICAgICAgIHJldHVybiBtYXBJdGVyYXRvclZhbHVlKHR5cGUsIG5vZGUuZW50cnkpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKG5vZGUuZW50cmllcykge1xuICAgICAgICBtYXhJbmRleCA9IG5vZGUuZW50cmllcy5sZW5ndGggLSAxO1xuICAgICAgICBpZiAoaW5kZXggPD0gbWF4SW5kZXgpIHtcbiAgICAgICAgICByZXR1cm4gbWFwSXRlcmF0b3JWYWx1ZShcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICBub2RlLmVudHJpZXNbdGhpcy5fcmV2ZXJzZSA/IG1heEluZGV4IC0gaW5kZXggOiBpbmRleF1cbiAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXhJbmRleCA9IG5vZGUubm9kZXMubGVuZ3RoIC0gMTtcbiAgICAgICAgaWYgKGluZGV4IDw9IG1heEluZGV4KSB7XG4gICAgICAgICAgdmFyIHN1Yk5vZGUgPSBub2RlLm5vZGVzW3RoaXMuX3JldmVyc2UgPyBtYXhJbmRleCAtIGluZGV4IDogaW5kZXhdO1xuICAgICAgICAgIGlmIChzdWJOb2RlKSB7XG4gICAgICAgICAgICBpZiAoc3ViTm9kZS5lbnRyeSkge1xuICAgICAgICAgICAgICByZXR1cm4gbWFwSXRlcmF0b3JWYWx1ZSh0eXBlLCBzdWJOb2RlLmVudHJ5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN0YWNrID0gdGhpcy5fc3RhY2sgPSBtYXBJdGVyYXRvckZyYW1lKHN1Yk5vZGUsIHN0YWNrKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN0YWNrID0gdGhpcy5fc3RhY2sgPSB0aGlzLl9zdGFjay5fX3ByZXY7XG4gICAgfVxuICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgfTtcblxuICByZXR1cm4gTWFwSXRlcmF0b3I7XG59KEl0ZXJhdG9yKSk7XG5cbmZ1bmN0aW9uIG1hcEl0ZXJhdG9yVmFsdWUodHlwZSwgZW50cnkpIHtcbiAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgZW50cnlbMF0sIGVudHJ5WzFdKTtcbn1cblxuZnVuY3Rpb24gbWFwSXRlcmF0b3JGcmFtZShub2RlLCBwcmV2KSB7XG4gIHJldHVybiB7XG4gICAgbm9kZTogbm9kZSxcbiAgICBpbmRleDogMCxcbiAgICBfX3ByZXY6IHByZXYsXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1ha2VNYXAoc2l6ZSwgcm9vdCwgb3duZXJJRCwgaGFzaCkge1xuICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShNYXBQcm90b3R5cGUpO1xuICBtYXAuc2l6ZSA9IHNpemU7XG4gIG1hcC5fcm9vdCA9IHJvb3Q7XG4gIG1hcC5fX293bmVySUQgPSBvd25lcklEO1xuICBtYXAuX19oYXNoID0gaGFzaDtcbiAgbWFwLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICByZXR1cm4gbWFwO1xufVxuXG52YXIgRU1QVFlfTUFQO1xuZnVuY3Rpb24gZW1wdHlNYXAoKSB7XG4gIHJldHVybiBFTVBUWV9NQVAgfHwgKEVNUFRZX01BUCA9IG1ha2VNYXAoMCkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVNYXAobWFwLCBrLCB2KSB7XG4gIHZhciBuZXdSb290O1xuICB2YXIgbmV3U2l6ZTtcbiAgaWYgKCFtYXAuX3Jvb3QpIHtcbiAgICBpZiAodiA9PT0gTk9UX1NFVCkge1xuICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG4gICAgbmV3U2l6ZSA9IDE7XG4gICAgbmV3Um9vdCA9IG5ldyBBcnJheU1hcE5vZGUobWFwLl9fb3duZXJJRCwgW1trLCB2XV0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBkaWRDaGFuZ2VTaXplID0gTWFrZVJlZigpO1xuICAgIHZhciBkaWRBbHRlciA9IE1ha2VSZWYoKTtcbiAgICBuZXdSb290ID0gdXBkYXRlTm9kZShcbiAgICAgIG1hcC5fcm9vdCxcbiAgICAgIG1hcC5fX293bmVySUQsXG4gICAgICAwLFxuICAgICAgdW5kZWZpbmVkLFxuICAgICAgayxcbiAgICAgIHYsXG4gICAgICBkaWRDaGFuZ2VTaXplLFxuICAgICAgZGlkQWx0ZXJcbiAgICApO1xuICAgIGlmICghZGlkQWx0ZXIudmFsdWUpIHtcbiAgICAgIHJldHVybiBtYXA7XG4gICAgfVxuICAgIG5ld1NpemUgPSBtYXAuc2l6ZSArIChkaWRDaGFuZ2VTaXplLnZhbHVlID8gKHYgPT09IE5PVF9TRVQgPyAtMSA6IDEpIDogMCk7XG4gIH1cbiAgaWYgKG1hcC5fX293bmVySUQpIHtcbiAgICBtYXAuc2l6ZSA9IG5ld1NpemU7XG4gICAgbWFwLl9yb290ID0gbmV3Um9vdDtcbiAgICBtYXAuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgIG1hcC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgIHJldHVybiBtYXA7XG4gIH1cbiAgcmV0dXJuIG5ld1Jvb3QgPyBtYWtlTWFwKG5ld1NpemUsIG5ld1Jvb3QpIDogZW1wdHlNYXAoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlTm9kZShcbiAgbm9kZSxcbiAgb3duZXJJRCxcbiAgc2hpZnQsXG4gIGtleUhhc2gsXG4gIGtleSxcbiAgdmFsdWUsXG4gIGRpZENoYW5nZVNpemUsXG4gIGRpZEFsdGVyXG4pIHtcbiAgaWYgKCFub2RlKSB7XG4gICAgaWYgKHZhbHVlID09PSBOT1RfU0VUKSB7XG4gICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG4gICAgU2V0UmVmKGRpZEFsdGVyKTtcbiAgICBTZXRSZWYoZGlkQ2hhbmdlU2l6ZSk7XG4gICAgcmV0dXJuIG5ldyBWYWx1ZU5vZGUob3duZXJJRCwga2V5SGFzaCwgW2tleSwgdmFsdWVdKTtcbiAgfVxuICByZXR1cm4gbm9kZS51cGRhdGUoXG4gICAgb3duZXJJRCxcbiAgICBzaGlmdCxcbiAgICBrZXlIYXNoLFxuICAgIGtleSxcbiAgICB2YWx1ZSxcbiAgICBkaWRDaGFuZ2VTaXplLFxuICAgIGRpZEFsdGVyXG4gICk7XG59XG5cbmZ1bmN0aW9uIGlzTGVhZk5vZGUobm9kZSkge1xuICByZXR1cm4gKFxuICAgIG5vZGUuY29uc3RydWN0b3IgPT09IFZhbHVlTm9kZSB8fCBub2RlLmNvbnN0cnVjdG9yID09PSBIYXNoQ29sbGlzaW9uTm9kZVxuICApO1xufVxuXG5mdW5jdGlvbiBtZXJnZUludG9Ob2RlKG5vZGUsIG93bmVySUQsIHNoaWZ0LCBrZXlIYXNoLCBlbnRyeSkge1xuICBpZiAobm9kZS5rZXlIYXNoID09PSBrZXlIYXNoKSB7XG4gICAgcmV0dXJuIG5ldyBIYXNoQ29sbGlzaW9uTm9kZShvd25lcklELCBrZXlIYXNoLCBbbm9kZS5lbnRyeSwgZW50cnldKTtcbiAgfVxuXG4gIHZhciBpZHgxID0gKHNoaWZ0ID09PSAwID8gbm9kZS5rZXlIYXNoIDogbm9kZS5rZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuICB2YXIgaWR4MiA9IChzaGlmdCA9PT0gMCA/IGtleUhhc2ggOiBrZXlIYXNoID4+PiBzaGlmdCkgJiBNQVNLO1xuXG4gIHZhciBuZXdOb2RlO1xuICB2YXIgbm9kZXMgPVxuICAgIGlkeDEgPT09IGlkeDJcbiAgICAgID8gW21lcmdlSW50b05vZGUobm9kZSwgb3duZXJJRCwgc2hpZnQgKyBTSElGVCwga2V5SGFzaCwgZW50cnkpXVxuICAgICAgOiAoKG5ld05vZGUgPSBuZXcgVmFsdWVOb2RlKG93bmVySUQsIGtleUhhc2gsIGVudHJ5KSksXG4gICAgICAgIGlkeDEgPCBpZHgyID8gW25vZGUsIG5ld05vZGVdIDogW25ld05vZGUsIG5vZGVdKTtcblxuICByZXR1cm4gbmV3IEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsICgxIDw8IGlkeDEpIHwgKDEgPDwgaWR4MiksIG5vZGVzKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTm9kZXMob3duZXJJRCwgZW50cmllcywga2V5LCB2YWx1ZSkge1xuICBpZiAoIW93bmVySUQpIHtcbiAgICBvd25lcklEID0gbmV3IE93bmVySUQoKTtcbiAgfVxuICB2YXIgbm9kZSA9IG5ldyBWYWx1ZU5vZGUob3duZXJJRCwgaGFzaChrZXkpLCBba2V5LCB2YWx1ZV0pO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgZW50cmllcy5sZW5ndGg7IGlpKyspIHtcbiAgICB2YXIgZW50cnkgPSBlbnRyaWVzW2lpXTtcbiAgICBub2RlID0gbm9kZS51cGRhdGUob3duZXJJRCwgMCwgdW5kZWZpbmVkLCBlbnRyeVswXSwgZW50cnlbMV0pO1xuICB9XG4gIHJldHVybiBub2RlO1xufVxuXG5mdW5jdGlvbiBwYWNrTm9kZXMob3duZXJJRCwgbm9kZXMsIGNvdW50LCBleGNsdWRpbmcpIHtcbiAgdmFyIGJpdG1hcCA9IDA7XG4gIHZhciBwYWNrZWRJSSA9IDA7XG4gIHZhciBwYWNrZWROb2RlcyA9IG5ldyBBcnJheShjb3VudCk7XG4gIGZvciAodmFyIGlpID0gMCwgYml0ID0gMSwgbGVuID0gbm9kZXMubGVuZ3RoOyBpaSA8IGxlbjsgaWkrKywgYml0IDw8PSAxKSB7XG4gICAgdmFyIG5vZGUgPSBub2Rlc1tpaV07XG4gICAgaWYgKG5vZGUgIT09IHVuZGVmaW5lZCAmJiBpaSAhPT0gZXhjbHVkaW5nKSB7XG4gICAgICBiaXRtYXAgfD0gYml0O1xuICAgICAgcGFja2VkTm9kZXNbcGFja2VkSUkrK10gPSBub2RlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmV3IEJpdG1hcEluZGV4ZWROb2RlKG93bmVySUQsIGJpdG1hcCwgcGFja2VkTm9kZXMpO1xufVxuXG5mdW5jdGlvbiBleHBhbmROb2Rlcyhvd25lcklELCBub2RlcywgYml0bWFwLCBpbmNsdWRpbmcsIG5vZGUpIHtcbiAgdmFyIGNvdW50ID0gMDtcbiAgdmFyIGV4cGFuZGVkTm9kZXMgPSBuZXcgQXJyYXkoU0laRSk7XG4gIGZvciAodmFyIGlpID0gMDsgYml0bWFwICE9PSAwOyBpaSsrLCBiaXRtYXAgPj4+PSAxKSB7XG4gICAgZXhwYW5kZWROb2Rlc1tpaV0gPSBiaXRtYXAgJiAxID8gbm9kZXNbY291bnQrK10gOiB1bmRlZmluZWQ7XG4gIH1cbiAgZXhwYW5kZWROb2Rlc1tpbmNsdWRpbmddID0gbm9kZTtcbiAgcmV0dXJuIG5ldyBIYXNoQXJyYXlNYXBOb2RlKG93bmVySUQsIGNvdW50ICsgMSwgZXhwYW5kZWROb2Rlcyk7XG59XG5cbmZ1bmN0aW9uIHBvcENvdW50KHgpIHtcbiAgeCAtPSAoeCA+PiAxKSAmIDB4NTU1NTU1NTU7XG4gIHggPSAoeCAmIDB4MzMzMzMzMzMpICsgKCh4ID4+IDIpICYgMHgzMzMzMzMzMyk7XG4gIHggPSAoeCArICh4ID4+IDQpKSAmIDB4MGYwZjBmMGY7XG4gIHggKz0geCA+PiA4O1xuICB4ICs9IHggPj4gMTY7XG4gIHJldHVybiB4ICYgMHg3Zjtcbn1cblxuZnVuY3Rpb24gc2V0QXQoYXJyYXksIGlkeCwgdmFsLCBjYW5FZGl0KSB7XG4gIHZhciBuZXdBcnJheSA9IGNhbkVkaXQgPyBhcnJheSA6IGFyckNvcHkoYXJyYXkpO1xuICBuZXdBcnJheVtpZHhdID0gdmFsO1xuICByZXR1cm4gbmV3QXJyYXk7XG59XG5cbmZ1bmN0aW9uIHNwbGljZUluKGFycmF5LCBpZHgsIHZhbCwgY2FuRWRpdCkge1xuICB2YXIgbmV3TGVuID0gYXJyYXkubGVuZ3RoICsgMTtcbiAgaWYgKGNhbkVkaXQgJiYgaWR4ICsgMSA9PT0gbmV3TGVuKSB7XG4gICAgYXJyYXlbaWR4XSA9IHZhbDtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH1cbiAgdmFyIG5ld0FycmF5ID0gbmV3IEFycmF5KG5ld0xlbik7XG4gIHZhciBhZnRlciA9IDA7XG4gIGZvciAodmFyIGlpID0gMDsgaWkgPCBuZXdMZW47IGlpKyspIHtcbiAgICBpZiAoaWkgPT09IGlkeCkge1xuICAgICAgbmV3QXJyYXlbaWldID0gdmFsO1xuICAgICAgYWZ0ZXIgPSAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3QXJyYXlbaWldID0gYXJyYXlbaWkgKyBhZnRlcl07XG4gICAgfVxuICB9XG4gIHJldHVybiBuZXdBcnJheTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT3V0KGFycmF5LCBpZHgsIGNhbkVkaXQpIHtcbiAgdmFyIG5ld0xlbiA9IGFycmF5Lmxlbmd0aCAtIDE7XG4gIGlmIChjYW5FZGl0ICYmIGlkeCA9PT0gbmV3TGVuKSB7XG4gICAgYXJyYXkucG9wKCk7XG4gICAgcmV0dXJuIGFycmF5O1xuICB9XG4gIHZhciBuZXdBcnJheSA9IG5ldyBBcnJheShuZXdMZW4pO1xuICB2YXIgYWZ0ZXIgPSAwO1xuICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgbmV3TGVuOyBpaSsrKSB7XG4gICAgaWYgKGlpID09PSBpZHgpIHtcbiAgICAgIGFmdGVyID0gMTtcbiAgICB9XG4gICAgbmV3QXJyYXlbaWldID0gYXJyYXlbaWkgKyBhZnRlcl07XG4gIH1cbiAgcmV0dXJuIG5ld0FycmF5O1xufVxuXG52YXIgTUFYX0FSUkFZX01BUF9TSVpFID0gU0laRSAvIDQ7XG52YXIgTUFYX0JJVE1BUF9JTkRFWEVEX1NJWkUgPSBTSVpFIC8gMjtcbnZhciBNSU5fSEFTSF9BUlJBWV9NQVBfU0laRSA9IFNJWkUgLyA0O1xuXG52YXIgSVNfTElTVF9TWU1CT0wgPSAnQEBfX0lNTVVUQUJMRV9MSVNUX19AQCc7XG5cbmZ1bmN0aW9uIGlzTGlzdChtYXliZUxpc3QpIHtcbiAgcmV0dXJuIEJvb2xlYW4obWF5YmVMaXN0ICYmIG1heWJlTGlzdFtJU19MSVNUX1NZTUJPTF0pO1xufVxuXG52YXIgTGlzdCA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIExpc3QodmFsdWUpIHtcbiAgICB2YXIgZW1wdHkgPSBlbXB0eUxpc3QoKTtcbiAgICBpZiAodmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGVtcHR5O1xuICAgIH1cbiAgICBpZiAoaXNMaXN0KHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB2YXIgaXRlciA9IEluZGV4ZWRDb2xsZWN0aW9uKHZhbHVlKTtcbiAgICB2YXIgc2l6ZSA9IGl0ZXIuc2l6ZTtcbiAgICBpZiAoc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIGVtcHR5O1xuICAgIH1cbiAgICBhc3NlcnROb3RJbmZpbml0ZShzaXplKTtcbiAgICBpZiAoc2l6ZSA+IDAgJiYgc2l6ZSA8IFNJWkUpIHtcbiAgICAgIHJldHVybiBtYWtlTGlzdCgwLCBzaXplLCBTSElGVCwgbnVsbCwgbmV3IFZOb2RlKGl0ZXIudG9BcnJheSgpKSk7XG4gICAgfVxuICAgIHJldHVybiBlbXB0eS53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICBsaXN0LnNldFNpemUoc2l6ZSk7XG4gICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24gKHYsIGkpIHsgcmV0dXJuIGxpc3Quc2V0KGksIHYpOyB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGlmICggSW5kZXhlZENvbGxlY3Rpb24gKSBMaXN0Ll9fcHJvdG9fXyA9IEluZGV4ZWRDb2xsZWN0aW9uO1xuICBMaXN0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEluZGV4ZWRDb2xsZWN0aW9uICYmIEluZGV4ZWRDb2xsZWN0aW9uLnByb3RvdHlwZSApO1xuICBMaXN0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IExpc3Q7XG5cbiAgTGlzdC5vZiA9IGZ1bmN0aW9uIG9mICgvKi4uLnZhbHVlcyovKSB7XG4gICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdMaXN0IFsnLCAnXScpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQWNjZXNzXG5cbiAgTGlzdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLnNpemUpIHtcbiAgICAgIGluZGV4ICs9IHRoaXMuX29yaWdpbjtcbiAgICAgIHZhciBub2RlID0gbGlzdE5vZGVGb3IodGhpcywgaW5kZXgpO1xuICAgICAgcmV0dXJuIG5vZGUgJiYgbm9kZS5hcnJheVtpbmRleCAmIE1BU0tdO1xuICAgIH1cbiAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBNb2RpZmljYXRpb25cblxuICBMaXN0LnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQgKGluZGV4LCB2YWx1ZSkge1xuICAgIHJldHVybiB1cGRhdGVMaXN0KHRoaXMsIGluZGV4LCB2YWx1ZSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gcmVtb3ZlIChpbmRleCkge1xuICAgIHJldHVybiAhdGhpcy5oYXMoaW5kZXgpXG4gICAgICA/IHRoaXNcbiAgICAgIDogaW5kZXggPT09IDBcbiAgICAgID8gdGhpcy5zaGlmdCgpXG4gICAgICA6IGluZGV4ID09PSB0aGlzLnNpemUgLSAxXG4gICAgICA/IHRoaXMucG9wKClcbiAgICAgIDogdGhpcy5zcGxpY2UoaW5kZXgsIDEpO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uIGluc2VydCAoaW5kZXgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuc3BsaWNlKGluZGV4LCAwLCB2YWx1ZSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gdGhpcy5fb3JpZ2luID0gdGhpcy5fY2FwYWNpdHkgPSAwO1xuICAgICAgdGhpcy5fbGV2ZWwgPSBTSElGVDtcbiAgICAgIHRoaXMuX3Jvb3QgPSB0aGlzLl90YWlsID0gdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5TGlzdCgpO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiBwdXNoICgvKi4uLnZhbHVlcyovKSB7XG4gICAgdmFyIHZhbHVlcyA9IGFyZ3VtZW50cztcbiAgICB2YXIgb2xkU2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICByZXR1cm4gdGhpcy53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICBzZXRMaXN0Qm91bmRzKGxpc3QsIDAsIG9sZFNpemUgKyB2YWx1ZXMubGVuZ3RoKTtcbiAgICAgIGZvciAodmFyIGlpID0gMDsgaWkgPCB2YWx1ZXMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgIGxpc3Quc2V0KG9sZFNpemUgKyBpaSwgdmFsdWVzW2lpXSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUucG9wID0gZnVuY3Rpb24gcG9wICgpIHtcbiAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyh0aGlzLCAwLCAtMSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uIHVuc2hpZnQgKC8qLi4udmFsdWVzKi8pIHtcbiAgICB2YXIgdmFsdWVzID0gYXJndW1lbnRzO1xuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKGxpc3QpIHtcbiAgICAgIHNldExpc3RCb3VuZHMobGlzdCwgLXZhbHVlcy5sZW5ndGgpO1xuICAgICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IHZhbHVlcy5sZW5ndGg7IGlpKyspIHtcbiAgICAgICAgbGlzdC5zZXQoaWksIHZhbHVlc1tpaV0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLnNoaWZ0ID0gZnVuY3Rpb24gc2hpZnQgKCkge1xuICAgIHJldHVybiBzZXRMaXN0Qm91bmRzKHRoaXMsIDEpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQ29tcG9zaXRpb25cblxuICBMaXN0LnByb3RvdHlwZS5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKC8qLi4uY29sbGVjdGlvbnMqLykge1xuICAgIHZhciBhcmd1bWVudHMkMSA9IGFyZ3VtZW50cztcblxuICAgIHZhciBzZXFzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBhcmd1bWVudCA9IGFyZ3VtZW50cyQxW2ldO1xuICAgICAgdmFyIHNlcSA9IEluZGV4ZWRDb2xsZWN0aW9uKFxuICAgICAgICB0eXBlb2YgYXJndW1lbnQgIT09ICdzdHJpbmcnICYmIGhhc0l0ZXJhdG9yKGFyZ3VtZW50KVxuICAgICAgICAgID8gYXJndW1lbnRcbiAgICAgICAgICA6IFthcmd1bWVudF1cbiAgICAgICk7XG4gICAgICBpZiAoc2VxLnNpemUgIT09IDApIHtcbiAgICAgICAgc2Vxcy5wdXNoKHNlcSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChzZXFzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLnNpemUgPT09IDAgJiYgIXRoaXMuX19vd25lcklEICYmIHNlcXMubGVuZ3RoID09PSAxKSB7XG4gICAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3RvcihzZXFzWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobGlzdCkge1xuICAgICAgc2Vxcy5mb3JFYWNoKGZ1bmN0aW9uIChzZXEpIHsgcmV0dXJuIHNlcS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gbGlzdC5wdXNoKHZhbHVlKTsgfSk7IH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLnNldFNpemUgPSBmdW5jdGlvbiBzZXRTaXplIChzaXplKSB7XG4gICAgcmV0dXJuIHNldExpc3RCb3VuZHModGhpcywgMCwgc2l6ZSk7XG4gIH07XG5cbiAgTGlzdC5wcm90b3R5cGUubWFwID0gZnVuY3Rpb24gbWFwIChtYXBwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobGlzdCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzJDEkMS5zaXplOyBpKyspIHtcbiAgICAgICAgbGlzdC5zZXQoaSwgbWFwcGVyLmNhbGwoY29udGV4dCwgbGlzdC5nZXQoaSksIGksIHRoaXMkMSQxKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBJdGVyYXRpb25cblxuICBMaXN0LnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChiZWdpbiwgZW5kKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgaWYgKHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgc2l6ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gc2V0TGlzdEJvdW5kcyhcbiAgICAgIHRoaXMsXG4gICAgICByZXNvbHZlQmVnaW4oYmVnaW4sIHNpemUpLFxuICAgICAgcmVzb2x2ZUVuZChlbmQsIHNpemUpXG4gICAgKTtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBpbmRleCA9IHJldmVyc2UgPyB0aGlzLnNpemUgOiAwO1xuICAgIHZhciB2YWx1ZXMgPSBpdGVyYXRlTGlzdCh0aGlzLCByZXZlcnNlKTtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWx1ZSA9IHZhbHVlcygpO1xuICAgICAgcmV0dXJuIHZhbHVlID09PSBET05FXG4gICAgICAgID8gaXRlcmF0b3JEb25lKClcbiAgICAgICAgOiBpdGVyYXRvclZhbHVlKHR5cGUsIHJldmVyc2UgPyAtLWluZGV4IDogaW5kZXgrKywgdmFsdWUpO1xuICAgIH0pO1xuICB9O1xuXG4gIExpc3QucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgaW5kZXggPSByZXZlcnNlID8gdGhpcy5zaXplIDogMDtcbiAgICB2YXIgdmFsdWVzID0gaXRlcmF0ZUxpc3QodGhpcywgcmV2ZXJzZSk7XG4gICAgdmFyIHZhbHVlO1xuICAgIHdoaWxlICgodmFsdWUgPSB2YWx1ZXMoKSkgIT09IERPTkUpIHtcbiAgICAgIGlmIChmbih2YWx1ZSwgcmV2ZXJzZSA/IC0taW5kZXggOiBpbmRleCsrLCB0aGlzKSA9PT0gZmFsc2UpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBpbmRleDtcbiAgfTtcblxuICBMaXN0LnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24gX19lbnN1cmVPd25lciAob3duZXJJRCkge1xuICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICghb3duZXJJRCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZW1wdHlMaXN0KCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlTGlzdChcbiAgICAgIHRoaXMuX29yaWdpbixcbiAgICAgIHRoaXMuX2NhcGFjaXR5LFxuICAgICAgdGhpcy5fbGV2ZWwsXG4gICAgICB0aGlzLl9yb290LFxuICAgICAgdGhpcy5fdGFpbCxcbiAgICAgIG93bmVySUQsXG4gICAgICB0aGlzLl9faGFzaFxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIExpc3Q7XG59KEluZGV4ZWRDb2xsZWN0aW9uKSk7XG5cbkxpc3QuaXNMaXN0ID0gaXNMaXN0O1xuXG52YXIgTGlzdFByb3RvdHlwZSA9IExpc3QucHJvdG90eXBlO1xuTGlzdFByb3RvdHlwZVtJU19MSVNUX1NZTUJPTF0gPSB0cnVlO1xuTGlzdFByb3RvdHlwZVtERUxFVEVdID0gTGlzdFByb3RvdHlwZS5yZW1vdmU7XG5MaXN0UHJvdG90eXBlLm1lcmdlID0gTGlzdFByb3RvdHlwZS5jb25jYXQ7XG5MaXN0UHJvdG90eXBlLnNldEluID0gc2V0SW47XG5MaXN0UHJvdG90eXBlLmRlbGV0ZUluID0gTGlzdFByb3RvdHlwZS5yZW1vdmVJbiA9IGRlbGV0ZUluO1xuTGlzdFByb3RvdHlwZS51cGRhdGUgPSB1cGRhdGU7XG5MaXN0UHJvdG90eXBlLnVwZGF0ZUluID0gdXBkYXRlSW47XG5MaXN0UHJvdG90eXBlLm1lcmdlSW4gPSBtZXJnZUluO1xuTGlzdFByb3RvdHlwZS5tZXJnZURlZXBJbiA9IG1lcmdlRGVlcEluO1xuTGlzdFByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gd2l0aE11dGF0aW9ucztcbkxpc3RQcm90b3R5cGUud2FzQWx0ZXJlZCA9IHdhc0FsdGVyZWQ7XG5MaXN0UHJvdG90eXBlLmFzSW1tdXRhYmxlID0gYXNJbW11dGFibGU7XG5MaXN0UHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gTGlzdFByb3RvdHlwZS5hc011dGFibGUgPSBhc011dGFibGU7XG5MaXN0UHJvdG90eXBlWydAQHRyYW5zZHVjZXIvc3RlcCddID0gZnVuY3Rpb24gKHJlc3VsdCwgYXJyKSB7XG4gIHJldHVybiByZXN1bHQucHVzaChhcnIpO1xufTtcbkxpc3RQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9yZXN1bHQnXSA9IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iai5hc0ltbXV0YWJsZSgpO1xufTtcblxudmFyIFZOb2RlID0gZnVuY3Rpb24gVk5vZGUoYXJyYXksIG93bmVySUQpIHtcbiAgdGhpcy5hcnJheSA9IGFycmF5O1xuICB0aGlzLm93bmVySUQgPSBvd25lcklEO1xufTtcblxuLy8gVE9ETzogc2VlbXMgbGlrZSB0aGVzZSBtZXRob2RzIGFyZSB2ZXJ5IHNpbWlsYXJcblxuVk5vZGUucHJvdG90eXBlLnJlbW92ZUJlZm9yZSA9IGZ1bmN0aW9uIHJlbW92ZUJlZm9yZSAob3duZXJJRCwgbGV2ZWwsIGluZGV4KSB7XG4gIGlmIChpbmRleCA9PT0gbGV2ZWwgPyAxIDw8IGxldmVsIDogdGhpcy5hcnJheS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB2YXIgb3JpZ2luSW5kZXggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG4gIGlmIChvcmlnaW5JbmRleCA+PSB0aGlzLmFycmF5Lmxlbmd0aCkge1xuICAgIHJldHVybiBuZXcgVk5vZGUoW10sIG93bmVySUQpO1xuICB9XG4gIHZhciByZW1vdmluZ0ZpcnN0ID0gb3JpZ2luSW5kZXggPT09IDA7XG4gIHZhciBuZXdDaGlsZDtcbiAgaWYgKGxldmVsID4gMCkge1xuICAgIHZhciBvbGRDaGlsZCA9IHRoaXMuYXJyYXlbb3JpZ2luSW5kZXhdO1xuICAgIG5ld0NoaWxkID1cbiAgICAgIG9sZENoaWxkICYmIG9sZENoaWxkLnJlbW92ZUJlZm9yZShvd25lcklELCBsZXZlbCAtIFNISUZULCBpbmRleCk7XG4gICAgaWYgKG5ld0NoaWxkID09PSBvbGRDaGlsZCAmJiByZW1vdmluZ0ZpcnN0KSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1cbiAgaWYgKHJlbW92aW5nRmlyc3QgJiYgIW5ld0NoaWxkKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cbiAgdmFyIGVkaXRhYmxlID0gZWRpdGFibGVWTm9kZSh0aGlzLCBvd25lcklEKTtcbiAgaWYgKCFyZW1vdmluZ0ZpcnN0KSB7XG4gICAgZm9yICh2YXIgaWkgPSAwOyBpaSA8IG9yaWdpbkluZGV4OyBpaSsrKSB7XG4gICAgICBlZGl0YWJsZS5hcnJheVtpaV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG4gIGlmIChuZXdDaGlsZCkge1xuICAgIGVkaXRhYmxlLmFycmF5W29yaWdpbkluZGV4XSA9IG5ld0NoaWxkO1xuICB9XG4gIHJldHVybiBlZGl0YWJsZTtcbn07XG5cblZOb2RlLnByb3RvdHlwZS5yZW1vdmVBZnRlciA9IGZ1bmN0aW9uIHJlbW92ZUFmdGVyIChvd25lcklELCBsZXZlbCwgaW5kZXgpIHtcbiAgaWYgKGluZGV4ID09PSAobGV2ZWwgPyAxIDw8IGxldmVsIDogMCkgfHwgdGhpcy5hcnJheS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICB2YXIgc2l6ZUluZGV4ID0gKChpbmRleCAtIDEpID4+PiBsZXZlbCkgJiBNQVNLO1xuICBpZiAoc2l6ZUluZGV4ID49IHRoaXMuYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICB2YXIgbmV3Q2hpbGQ7XG4gIGlmIChsZXZlbCA+IDApIHtcbiAgICB2YXIgb2xkQ2hpbGQgPSB0aGlzLmFycmF5W3NpemVJbmRleF07XG4gICAgbmV3Q2hpbGQgPVxuICAgICAgb2xkQ2hpbGQgJiYgb2xkQ2hpbGQucmVtb3ZlQWZ0ZXIob3duZXJJRCwgbGV2ZWwgLSBTSElGVCwgaW5kZXgpO1xuICAgIGlmIChuZXdDaGlsZCA9PT0gb2xkQ2hpbGQgJiYgc2l6ZUluZGV4ID09PSB0aGlzLmFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIHZhciBlZGl0YWJsZSA9IGVkaXRhYmxlVk5vZGUodGhpcywgb3duZXJJRCk7XG4gIGVkaXRhYmxlLmFycmF5LnNwbGljZShzaXplSW5kZXggKyAxKTtcbiAgaWYgKG5ld0NoaWxkKSB7XG4gICAgZWRpdGFibGUuYXJyYXlbc2l6ZUluZGV4XSA9IG5ld0NoaWxkO1xuICB9XG4gIHJldHVybiBlZGl0YWJsZTtcbn07XG5cbnZhciBET05FID0ge307XG5cbmZ1bmN0aW9uIGl0ZXJhdGVMaXN0KGxpc3QsIHJldmVyc2UpIHtcbiAgdmFyIGxlZnQgPSBsaXN0Ll9vcmlnaW47XG4gIHZhciByaWdodCA9IGxpc3QuX2NhcGFjaXR5O1xuICB2YXIgdGFpbFBvcyA9IGdldFRhaWxPZmZzZXQocmlnaHQpO1xuICB2YXIgdGFpbCA9IGxpc3QuX3RhaWw7XG5cbiAgcmV0dXJuIGl0ZXJhdGVOb2RlT3JMZWFmKGxpc3QuX3Jvb3QsIGxpc3QuX2xldmVsLCAwKTtcblxuICBmdW5jdGlvbiBpdGVyYXRlTm9kZU9yTGVhZihub2RlLCBsZXZlbCwgb2Zmc2V0KSB7XG4gICAgcmV0dXJuIGxldmVsID09PSAwXG4gICAgICA/IGl0ZXJhdGVMZWFmKG5vZGUsIG9mZnNldClcbiAgICAgIDogaXRlcmF0ZU5vZGUobm9kZSwgbGV2ZWwsIG9mZnNldCk7XG4gIH1cblxuICBmdW5jdGlvbiBpdGVyYXRlTGVhZihub2RlLCBvZmZzZXQpIHtcbiAgICB2YXIgYXJyYXkgPSBvZmZzZXQgPT09IHRhaWxQb3MgPyB0YWlsICYmIHRhaWwuYXJyYXkgOiBub2RlICYmIG5vZGUuYXJyYXk7XG4gICAgdmFyIGZyb20gPSBvZmZzZXQgPiBsZWZ0ID8gMCA6IGxlZnQgLSBvZmZzZXQ7XG4gICAgdmFyIHRvID0gcmlnaHQgLSBvZmZzZXQ7XG4gICAgaWYgKHRvID4gU0laRSkge1xuICAgICAgdG8gPSBTSVpFO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKGZyb20gPT09IHRvKSB7XG4gICAgICAgIHJldHVybiBET05FO1xuICAgICAgfVxuICAgICAgdmFyIGlkeCA9IHJldmVyc2UgPyAtLXRvIDogZnJvbSsrO1xuICAgICAgcmV0dXJuIGFycmF5ICYmIGFycmF5W2lkeF07XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGl0ZXJhdGVOb2RlKG5vZGUsIGxldmVsLCBvZmZzZXQpIHtcbiAgICB2YXIgdmFsdWVzO1xuICAgIHZhciBhcnJheSA9IG5vZGUgJiYgbm9kZS5hcnJheTtcbiAgICB2YXIgZnJvbSA9IG9mZnNldCA+IGxlZnQgPyAwIDogKGxlZnQgLSBvZmZzZXQpID4+IGxldmVsO1xuICAgIHZhciB0byA9ICgocmlnaHQgLSBvZmZzZXQpID4+IGxldmVsKSArIDE7XG4gICAgaWYgKHRvID4gU0laRSkge1xuICAgICAgdG8gPSBTSVpFO1xuICAgIH1cbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaWYgKHZhbHVlcykge1xuICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlcygpO1xuICAgICAgICAgIGlmICh2YWx1ZSAhPT0gRE9ORSkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YWx1ZXMgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmcm9tID09PSB0bykge1xuICAgICAgICAgIHJldHVybiBET05FO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpZHggPSByZXZlcnNlID8gLS10byA6IGZyb20rKztcbiAgICAgICAgdmFsdWVzID0gaXRlcmF0ZU5vZGVPckxlYWYoXG4gICAgICAgICAgYXJyYXkgJiYgYXJyYXlbaWR4XSxcbiAgICAgICAgICBsZXZlbCAtIFNISUZULFxuICAgICAgICAgIG9mZnNldCArIChpZHggPDwgbGV2ZWwpXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBtYWtlTGlzdChvcmlnaW4sIGNhcGFjaXR5LCBsZXZlbCwgcm9vdCwgdGFpbCwgb3duZXJJRCwgaGFzaCkge1xuICB2YXIgbGlzdCA9IE9iamVjdC5jcmVhdGUoTGlzdFByb3RvdHlwZSk7XG4gIGxpc3Quc2l6ZSA9IGNhcGFjaXR5IC0gb3JpZ2luO1xuICBsaXN0Ll9vcmlnaW4gPSBvcmlnaW47XG4gIGxpc3QuX2NhcGFjaXR5ID0gY2FwYWNpdHk7XG4gIGxpc3QuX2xldmVsID0gbGV2ZWw7XG4gIGxpc3QuX3Jvb3QgPSByb290O1xuICBsaXN0Ll90YWlsID0gdGFpbDtcbiAgbGlzdC5fX293bmVySUQgPSBvd25lcklEO1xuICBsaXN0Ll9faGFzaCA9IGhhc2g7XG4gIGxpc3QuX19hbHRlcmVkID0gZmFsc2U7XG4gIHJldHVybiBsaXN0O1xufVxuXG52YXIgRU1QVFlfTElTVDtcbmZ1bmN0aW9uIGVtcHR5TGlzdCgpIHtcbiAgcmV0dXJuIEVNUFRZX0xJU1QgfHwgKEVNUFRZX0xJU1QgPSBtYWtlTGlzdCgwLCAwLCBTSElGVCkpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVMaXN0KGxpc3QsIGluZGV4LCB2YWx1ZSkge1xuICBpbmRleCA9IHdyYXBJbmRleChsaXN0LCBpbmRleCk7XG5cbiAgaWYgKGluZGV4ICE9PSBpbmRleCkge1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgaWYgKGluZGV4ID49IGxpc3Quc2l6ZSB8fCBpbmRleCA8IDApIHtcbiAgICByZXR1cm4gbGlzdC53aXRoTXV0YXRpb25zKGZ1bmN0aW9uIChsaXN0KSB7XG4gICAgICBpbmRleCA8IDBcbiAgICAgICAgPyBzZXRMaXN0Qm91bmRzKGxpc3QsIGluZGV4KS5zZXQoMCwgdmFsdWUpXG4gICAgICAgIDogc2V0TGlzdEJvdW5kcyhsaXN0LCAwLCBpbmRleCArIDEpLnNldChpbmRleCwgdmFsdWUpO1xuICAgIH0pO1xuICB9XG5cbiAgaW5kZXggKz0gbGlzdC5fb3JpZ2luO1xuXG4gIHZhciBuZXdUYWlsID0gbGlzdC5fdGFpbDtcbiAgdmFyIG5ld1Jvb3QgPSBsaXN0Ll9yb290O1xuICB2YXIgZGlkQWx0ZXIgPSBNYWtlUmVmKCk7XG4gIGlmIChpbmRleCA+PSBnZXRUYWlsT2Zmc2V0KGxpc3QuX2NhcGFjaXR5KSkge1xuICAgIG5ld1RhaWwgPSB1cGRhdGVWTm9kZShuZXdUYWlsLCBsaXN0Ll9fb3duZXJJRCwgMCwgaW5kZXgsIHZhbHVlLCBkaWRBbHRlcik7XG4gIH0gZWxzZSB7XG4gICAgbmV3Um9vdCA9IHVwZGF0ZVZOb2RlKFxuICAgICAgbmV3Um9vdCxcbiAgICAgIGxpc3QuX19vd25lcklELFxuICAgICAgbGlzdC5fbGV2ZWwsXG4gICAgICBpbmRleCxcbiAgICAgIHZhbHVlLFxuICAgICAgZGlkQWx0ZXJcbiAgICApO1xuICB9XG5cbiAgaWYgKCFkaWRBbHRlci52YWx1ZSkge1xuICAgIHJldHVybiBsaXN0O1xuICB9XG5cbiAgaWYgKGxpc3QuX19vd25lcklEKSB7XG4gICAgbGlzdC5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgbGlzdC5fdGFpbCA9IG5ld1RhaWw7XG4gICAgbGlzdC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgbGlzdC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG4gIHJldHVybiBtYWtlTGlzdChsaXN0Ll9vcmlnaW4sIGxpc3QuX2NhcGFjaXR5LCBsaXN0Ll9sZXZlbCwgbmV3Um9vdCwgbmV3VGFpbCk7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVZOb2RlKG5vZGUsIG93bmVySUQsIGxldmVsLCBpbmRleCwgdmFsdWUsIGRpZEFsdGVyKSB7XG4gIHZhciBpZHggPSAoaW5kZXggPj4+IGxldmVsKSAmIE1BU0s7XG4gIHZhciBub2RlSGFzID0gbm9kZSAmJiBpZHggPCBub2RlLmFycmF5Lmxlbmd0aDtcbiAgaWYgKCFub2RlSGFzICYmIHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIHZhciBuZXdOb2RlO1xuXG4gIGlmIChsZXZlbCA+IDApIHtcbiAgICB2YXIgbG93ZXJOb2RlID0gbm9kZSAmJiBub2RlLmFycmF5W2lkeF07XG4gICAgdmFyIG5ld0xvd2VyTm9kZSA9IHVwZGF0ZVZOb2RlKFxuICAgICAgbG93ZXJOb2RlLFxuICAgICAgb3duZXJJRCxcbiAgICAgIGxldmVsIC0gU0hJRlQsXG4gICAgICBpbmRleCxcbiAgICAgIHZhbHVlLFxuICAgICAgZGlkQWx0ZXJcbiAgICApO1xuICAgIGlmIChuZXdMb3dlck5vZGUgPT09IGxvd2VyTm9kZSkge1xuICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxuICAgIG5ld05vZGUgPSBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpO1xuICAgIG5ld05vZGUuYXJyYXlbaWR4XSA9IG5ld0xvd2VyTm9kZTtcbiAgICByZXR1cm4gbmV3Tm9kZTtcbiAgfVxuXG4gIGlmIChub2RlSGFzICYmIG5vZGUuYXJyYXlbaWR4XSA9PT0gdmFsdWUpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuXG4gIGlmIChkaWRBbHRlcikge1xuICAgIFNldFJlZihkaWRBbHRlcik7XG4gIH1cblxuICBuZXdOb2RlID0gZWRpdGFibGVWTm9kZShub2RlLCBvd25lcklEKTtcbiAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQgJiYgaWR4ID09PSBuZXdOb2RlLmFycmF5Lmxlbmd0aCAtIDEpIHtcbiAgICBuZXdOb2RlLmFycmF5LnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIG5ld05vZGUuYXJyYXlbaWR4XSA9IHZhbHVlO1xuICB9XG4gIHJldHVybiBuZXdOb2RlO1xufVxuXG5mdW5jdGlvbiBlZGl0YWJsZVZOb2RlKG5vZGUsIG93bmVySUQpIHtcbiAgaWYgKG93bmVySUQgJiYgbm9kZSAmJiBvd25lcklEID09PSBub2RlLm93bmVySUQpIHtcbiAgICByZXR1cm4gbm9kZTtcbiAgfVxuICByZXR1cm4gbmV3IFZOb2RlKG5vZGUgPyBub2RlLmFycmF5LnNsaWNlKCkgOiBbXSwgb3duZXJJRCk7XG59XG5cbmZ1bmN0aW9uIGxpc3ROb2RlRm9yKGxpc3QsIHJhd0luZGV4KSB7XG4gIGlmIChyYXdJbmRleCA+PSBnZXRUYWlsT2Zmc2V0KGxpc3QuX2NhcGFjaXR5KSkge1xuICAgIHJldHVybiBsaXN0Ll90YWlsO1xuICB9XG4gIGlmIChyYXdJbmRleCA8IDEgPDwgKGxpc3QuX2xldmVsICsgU0hJRlQpKSB7XG4gICAgdmFyIG5vZGUgPSBsaXN0Ll9yb290O1xuICAgIHZhciBsZXZlbCA9IGxpc3QuX2xldmVsO1xuICAgIHdoaWxlIChub2RlICYmIGxldmVsID4gMCkge1xuICAgICAgbm9kZSA9IG5vZGUuYXJyYXlbKHJhd0luZGV4ID4+PiBsZXZlbCkgJiBNQVNLXTtcbiAgICAgIGxldmVsIC09IFNISUZUO1xuICAgIH1cbiAgICByZXR1cm4gbm9kZTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRMaXN0Qm91bmRzKGxpc3QsIGJlZ2luLCBlbmQpIHtcbiAgLy8gU2FuaXRpemUgYmVnaW4gJiBlbmQgdXNpbmcgdGhpcyBzaG9ydGhhbmQgZm9yIFRvSW50MzIoYXJndW1lbnQpXG4gIC8vIGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi82LjAvI3NlYy10b2ludDMyXG4gIGlmIChiZWdpbiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgYmVnaW4gfD0gMDtcbiAgfVxuICBpZiAoZW5kICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgfD0gMDtcbiAgfVxuICB2YXIgb3duZXIgPSBsaXN0Ll9fb3duZXJJRCB8fCBuZXcgT3duZXJJRCgpO1xuICB2YXIgb2xkT3JpZ2luID0gbGlzdC5fb3JpZ2luO1xuICB2YXIgb2xkQ2FwYWNpdHkgPSBsaXN0Ll9jYXBhY2l0eTtcbiAgdmFyIG5ld09yaWdpbiA9IG9sZE9yaWdpbiArIGJlZ2luO1xuICB2YXIgbmV3Q2FwYWNpdHkgPVxuICAgIGVuZCA9PT0gdW5kZWZpbmVkXG4gICAgICA/IG9sZENhcGFjaXR5XG4gICAgICA6IGVuZCA8IDBcbiAgICAgID8gb2xkQ2FwYWNpdHkgKyBlbmRcbiAgICAgIDogb2xkT3JpZ2luICsgZW5kO1xuICBpZiAobmV3T3JpZ2luID09PSBvbGRPcmlnaW4gJiYgbmV3Q2FwYWNpdHkgPT09IG9sZENhcGFjaXR5KSB7XG4gICAgcmV0dXJuIGxpc3Q7XG4gIH1cblxuICAvLyBJZiBpdCdzIGdvaW5nIHRvIGVuZCBhZnRlciBpdCBzdGFydHMsIGl0J3MgZW1wdHkuXG4gIGlmIChuZXdPcmlnaW4gPj0gbmV3Q2FwYWNpdHkpIHtcbiAgICByZXR1cm4gbGlzdC5jbGVhcigpO1xuICB9XG5cbiAgdmFyIG5ld0xldmVsID0gbGlzdC5fbGV2ZWw7XG4gIHZhciBuZXdSb290ID0gbGlzdC5fcm9vdDtcblxuICAvLyBOZXcgb3JpZ2luIG1pZ2h0IG5lZWQgY3JlYXRpbmcgYSBoaWdoZXIgcm9vdC5cbiAgdmFyIG9mZnNldFNoaWZ0ID0gMDtcbiAgd2hpbGUgKG5ld09yaWdpbiArIG9mZnNldFNoaWZ0IDwgMCkge1xuICAgIG5ld1Jvb3QgPSBuZXcgVk5vZGUoXG4gICAgICBuZXdSb290ICYmIG5ld1Jvb3QuYXJyYXkubGVuZ3RoID8gW3VuZGVmaW5lZCwgbmV3Um9vdF0gOiBbXSxcbiAgICAgIG93bmVyXG4gICAgKTtcbiAgICBuZXdMZXZlbCArPSBTSElGVDtcbiAgICBvZmZzZXRTaGlmdCArPSAxIDw8IG5ld0xldmVsO1xuICB9XG4gIGlmIChvZmZzZXRTaGlmdCkge1xuICAgIG5ld09yaWdpbiArPSBvZmZzZXRTaGlmdDtcbiAgICBvbGRPcmlnaW4gKz0gb2Zmc2V0U2hpZnQ7XG4gICAgbmV3Q2FwYWNpdHkgKz0gb2Zmc2V0U2hpZnQ7XG4gICAgb2xkQ2FwYWNpdHkgKz0gb2Zmc2V0U2hpZnQ7XG4gIH1cblxuICB2YXIgb2xkVGFpbE9mZnNldCA9IGdldFRhaWxPZmZzZXQob2xkQ2FwYWNpdHkpO1xuICB2YXIgbmV3VGFpbE9mZnNldCA9IGdldFRhaWxPZmZzZXQobmV3Q2FwYWNpdHkpO1xuXG4gIC8vIE5ldyBzaXplIG1pZ2h0IG5lZWQgY3JlYXRpbmcgYSBoaWdoZXIgcm9vdC5cbiAgd2hpbGUgKG5ld1RhaWxPZmZzZXQgPj0gMSA8PCAobmV3TGV2ZWwgKyBTSElGVCkpIHtcbiAgICBuZXdSb290ID0gbmV3IFZOb2RlKFxuICAgICAgbmV3Um9vdCAmJiBuZXdSb290LmFycmF5Lmxlbmd0aCA/IFtuZXdSb290XSA6IFtdLFxuICAgICAgb3duZXJcbiAgICApO1xuICAgIG5ld0xldmVsICs9IFNISUZUO1xuICB9XG5cbiAgLy8gTG9jYXRlIG9yIGNyZWF0ZSB0aGUgbmV3IHRhaWwuXG4gIHZhciBvbGRUYWlsID0gbGlzdC5fdGFpbDtcbiAgdmFyIG5ld1RhaWwgPVxuICAgIG5ld1RhaWxPZmZzZXQgPCBvbGRUYWlsT2Zmc2V0XG4gICAgICA/IGxpc3ROb2RlRm9yKGxpc3QsIG5ld0NhcGFjaXR5IC0gMSlcbiAgICAgIDogbmV3VGFpbE9mZnNldCA+IG9sZFRhaWxPZmZzZXRcbiAgICAgID8gbmV3IFZOb2RlKFtdLCBvd25lcilcbiAgICAgIDogb2xkVGFpbDtcblxuICAvLyBNZXJnZSBUYWlsIGludG8gdHJlZS5cbiAgaWYgKFxuICAgIG9sZFRhaWwgJiZcbiAgICBuZXdUYWlsT2Zmc2V0ID4gb2xkVGFpbE9mZnNldCAmJlxuICAgIG5ld09yaWdpbiA8IG9sZENhcGFjaXR5ICYmXG4gICAgb2xkVGFpbC5hcnJheS5sZW5ndGhcbiAgKSB7XG4gICAgbmV3Um9vdCA9IGVkaXRhYmxlVk5vZGUobmV3Um9vdCwgb3duZXIpO1xuICAgIHZhciBub2RlID0gbmV3Um9vdDtcbiAgICBmb3IgKHZhciBsZXZlbCA9IG5ld0xldmVsOyBsZXZlbCA+IFNISUZUOyBsZXZlbCAtPSBTSElGVCkge1xuICAgICAgdmFyIGlkeCA9IChvbGRUYWlsT2Zmc2V0ID4+PiBsZXZlbCkgJiBNQVNLO1xuICAgICAgbm9kZSA9IG5vZGUuYXJyYXlbaWR4XSA9IGVkaXRhYmxlVk5vZGUobm9kZS5hcnJheVtpZHhdLCBvd25lcik7XG4gICAgfVxuICAgIG5vZGUuYXJyYXlbKG9sZFRhaWxPZmZzZXQgPj4+IFNISUZUKSAmIE1BU0tdID0gb2xkVGFpbDtcbiAgfVxuXG4gIC8vIElmIHRoZSBzaXplIGhhcyBiZWVuIHJlZHVjZWQsIHRoZXJlJ3MgYSBjaGFuY2UgdGhlIHRhaWwgbmVlZHMgdG8gYmUgdHJpbW1lZC5cbiAgaWYgKG5ld0NhcGFjaXR5IDwgb2xkQ2FwYWNpdHkpIHtcbiAgICBuZXdUYWlsID0gbmV3VGFpbCAmJiBuZXdUYWlsLnJlbW92ZUFmdGVyKG93bmVyLCAwLCBuZXdDYXBhY2l0eSk7XG4gIH1cblxuICAvLyBJZiB0aGUgbmV3IG9yaWdpbiBpcyB3aXRoaW4gdGhlIHRhaWwsIHRoZW4gd2UgZG8gbm90IG5lZWQgYSByb290LlxuICBpZiAobmV3T3JpZ2luID49IG5ld1RhaWxPZmZzZXQpIHtcbiAgICBuZXdPcmlnaW4gLT0gbmV3VGFpbE9mZnNldDtcbiAgICBuZXdDYXBhY2l0eSAtPSBuZXdUYWlsT2Zmc2V0O1xuICAgIG5ld0xldmVsID0gU0hJRlQ7XG4gICAgbmV3Um9vdCA9IG51bGw7XG4gICAgbmV3VGFpbCA9IG5ld1RhaWwgJiYgbmV3VGFpbC5yZW1vdmVCZWZvcmUob3duZXIsIDAsIG5ld09yaWdpbik7XG5cbiAgICAvLyBPdGhlcndpc2UsIGlmIHRoZSByb290IGhhcyBiZWVuIHRyaW1tZWQsIGdhcmJhZ2UgY29sbGVjdC5cbiAgfSBlbHNlIGlmIChuZXdPcmlnaW4gPiBvbGRPcmlnaW4gfHwgbmV3VGFpbE9mZnNldCA8IG9sZFRhaWxPZmZzZXQpIHtcbiAgICBvZmZzZXRTaGlmdCA9IDA7XG5cbiAgICAvLyBJZGVudGlmeSB0aGUgbmV3IHRvcCByb290IG5vZGUgb2YgdGhlIHN1YnRyZWUgb2YgdGhlIG9sZCByb290LlxuICAgIHdoaWxlIChuZXdSb290KSB7XG4gICAgICB2YXIgYmVnaW5JbmRleCA9IChuZXdPcmlnaW4gPj4+IG5ld0xldmVsKSAmIE1BU0s7XG4gICAgICBpZiAoKGJlZ2luSW5kZXggIT09IG5ld1RhaWxPZmZzZXQgPj4+IG5ld0xldmVsKSAmIE1BU0spIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBpZiAoYmVnaW5JbmRleCkge1xuICAgICAgICBvZmZzZXRTaGlmdCArPSAoMSA8PCBuZXdMZXZlbCkgKiBiZWdpbkluZGV4O1xuICAgICAgfVxuICAgICAgbmV3TGV2ZWwgLT0gU0hJRlQ7XG4gICAgICBuZXdSb290ID0gbmV3Um9vdC5hcnJheVtiZWdpbkluZGV4XTtcbiAgICB9XG5cbiAgICAvLyBUcmltIHRoZSBuZXcgc2lkZXMgb2YgdGhlIG5ldyByb290LlxuICAgIGlmIChuZXdSb290ICYmIG5ld09yaWdpbiA+IG9sZE9yaWdpbikge1xuICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQmVmb3JlKG93bmVyLCBuZXdMZXZlbCwgbmV3T3JpZ2luIC0gb2Zmc2V0U2hpZnQpO1xuICAgIH1cbiAgICBpZiAobmV3Um9vdCAmJiBuZXdUYWlsT2Zmc2V0IDwgb2xkVGFpbE9mZnNldCkge1xuICAgICAgbmV3Um9vdCA9IG5ld1Jvb3QucmVtb3ZlQWZ0ZXIoXG4gICAgICAgIG93bmVyLFxuICAgICAgICBuZXdMZXZlbCxcbiAgICAgICAgbmV3VGFpbE9mZnNldCAtIG9mZnNldFNoaWZ0XG4gICAgICApO1xuICAgIH1cbiAgICBpZiAob2Zmc2V0U2hpZnQpIHtcbiAgICAgIG5ld09yaWdpbiAtPSBvZmZzZXRTaGlmdDtcbiAgICAgIG5ld0NhcGFjaXR5IC09IG9mZnNldFNoaWZ0O1xuICAgIH1cbiAgfVxuXG4gIGlmIChsaXN0Ll9fb3duZXJJRCkge1xuICAgIGxpc3Quc2l6ZSA9IG5ld0NhcGFjaXR5IC0gbmV3T3JpZ2luO1xuICAgIGxpc3QuX29yaWdpbiA9IG5ld09yaWdpbjtcbiAgICBsaXN0Ll9jYXBhY2l0eSA9IG5ld0NhcGFjaXR5O1xuICAgIGxpc3QuX2xldmVsID0gbmV3TGV2ZWw7XG4gICAgbGlzdC5fcm9vdCA9IG5ld1Jvb3Q7XG4gICAgbGlzdC5fdGFpbCA9IG5ld1RhaWw7XG4gICAgbGlzdC5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgbGlzdC5fX2FsdGVyZWQgPSB0cnVlO1xuICAgIHJldHVybiBsaXN0O1xuICB9XG4gIHJldHVybiBtYWtlTGlzdChuZXdPcmlnaW4sIG5ld0NhcGFjaXR5LCBuZXdMZXZlbCwgbmV3Um9vdCwgbmV3VGFpbCk7XG59XG5cbmZ1bmN0aW9uIGdldFRhaWxPZmZzZXQoc2l6ZSkge1xuICByZXR1cm4gc2l6ZSA8IFNJWkUgPyAwIDogKChzaXplIC0gMSkgPj4+IFNISUZUKSA8PCBTSElGVDtcbn1cblxudmFyIE9yZGVyZWRNYXAgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChNYXApIHtcbiAgZnVuY3Rpb24gT3JkZXJlZE1hcCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGVtcHR5T3JkZXJlZE1hcCgpXG4gICAgICA6IGlzT3JkZXJlZE1hcCh2YWx1ZSlcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZW1wdHlPcmRlcmVkTWFwKCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobWFwKSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBLZXllZENvbGxlY3Rpb24odmFsdWUpO1xuICAgICAgICAgIGFzc2VydE5vdEluZmluaXRlKGl0ZXIuc2l6ZSk7XG4gICAgICAgICAgaXRlci5mb3JFYWNoKGZ1bmN0aW9uICh2LCBrKSB7IHJldHVybiBtYXAuc2V0KGssIHYpOyB9KTtcbiAgICAgICAgfSk7XG4gIH1cblxuICBpZiAoIE1hcCApIE9yZGVyZWRNYXAuX19wcm90b19fID0gTWFwO1xuICBPcmRlcmVkTWFwLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIE1hcCAmJiBNYXAucHJvdG90eXBlICk7XG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gT3JkZXJlZE1hcDtcblxuICBPcmRlcmVkTWFwLm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIE9yZGVyZWRNYXAucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ09yZGVyZWRNYXAgeycsICd9Jyk7XG4gIH07XG5cbiAgLy8gQHByYWdtYSBBY2Nlc3NcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGssIG5vdFNldFZhbHVlKSB7XG4gICAgdmFyIGluZGV4ID0gdGhpcy5fbWFwLmdldChrKTtcbiAgICByZXR1cm4gaW5kZXggIT09IHVuZGVmaW5lZCA/IHRoaXMuX2xpc3QuZ2V0KGluZGV4KVsxXSA6IG5vdFNldFZhbHVlO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgT3JkZXJlZE1hcC5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiBjbGVhciAoKSB7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICh0aGlzLl9fb3duZXJJRCkge1xuICAgICAgdGhpcy5zaXplID0gMDtcbiAgICAgIHRoaXMuX21hcC5jbGVhcigpO1xuICAgICAgdGhpcy5fbGlzdC5jbGVhcigpO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBlbXB0eU9yZGVyZWRNYXAoKTtcbiAgfTtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiBzZXQgKGssIHYpIHtcbiAgICByZXR1cm4gdXBkYXRlT3JkZXJlZE1hcCh0aGlzLCBrLCB2KTtcbiAgfTtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUgKGspIHtcbiAgICByZXR1cm4gdXBkYXRlT3JkZXJlZE1hcCh0aGlzLCBrLCBOT1RfU0VUKTtcbiAgfTtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2l0ZXJhdGUgPSBmdW5jdGlvbiBfX2l0ZXJhdGUgKGZuLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHJldHVybiB0aGlzLl9saXN0Ll9faXRlcmF0ZShcbiAgICAgIGZ1bmN0aW9uIChlbnRyeSkgeyByZXR1cm4gZW50cnkgJiYgZm4oZW50cnlbMV0sIGVudHJ5WzBdLCB0aGlzJDEkMSk7IH0sXG4gICAgICByZXZlcnNlXG4gICAgKTtcbiAgfTtcblxuICBPcmRlcmVkTWFwLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHJldHVybiB0aGlzLl9saXN0LmZyb21FbnRyeVNlcSgpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgT3JkZXJlZE1hcC5wcm90b3R5cGUuX19lbnN1cmVPd25lciA9IGZ1bmN0aW9uIF9fZW5zdXJlT3duZXIgKG93bmVySUQpIHtcbiAgICBpZiAob3duZXJJRCA9PT0gdGhpcy5fX293bmVySUQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB2YXIgbmV3TWFwID0gdGhpcy5fbWFwLl9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgdmFyIG5ld0xpc3QgPSB0aGlzLl9saXN0Ll9fZW5zdXJlT3duZXIob3duZXJJRCk7XG4gICAgaWYgKCFvd25lcklEKSB7XG4gICAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICAgIHJldHVybiBlbXB0eU9yZGVyZWRNYXAoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19vd25lcklEID0gb3duZXJJRDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gZmFsc2U7XG4gICAgICB0aGlzLl9tYXAgPSBuZXdNYXA7XG4gICAgICB0aGlzLl9saXN0ID0gbmV3TGlzdDtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZU9yZGVyZWRNYXAobmV3TWFwLCBuZXdMaXN0LCBvd25lcklELCB0aGlzLl9faGFzaCk7XG4gIH07XG5cbiAgcmV0dXJuIE9yZGVyZWRNYXA7XG59KE1hcCkpO1xuXG5PcmRlcmVkTWFwLmlzT3JkZXJlZE1hcCA9IGlzT3JkZXJlZE1hcDtcblxuT3JkZXJlZE1hcC5wcm90b3R5cGVbSVNfT1JERVJFRF9TWU1CT0xdID0gdHJ1ZTtcbk9yZGVyZWRNYXAucHJvdG90eXBlW0RFTEVURV0gPSBPcmRlcmVkTWFwLnByb3RvdHlwZS5yZW1vdmU7XG5cbmZ1bmN0aW9uIG1ha2VPcmRlcmVkTWFwKG1hcCwgbGlzdCwgb3duZXJJRCwgaGFzaCkge1xuICB2YXIgb21hcCA9IE9iamVjdC5jcmVhdGUoT3JkZXJlZE1hcC5wcm90b3R5cGUpO1xuICBvbWFwLnNpemUgPSBtYXAgPyBtYXAuc2l6ZSA6IDA7XG4gIG9tYXAuX21hcCA9IG1hcDtcbiAgb21hcC5fbGlzdCA9IGxpc3Q7XG4gIG9tYXAuX19vd25lcklEID0gb3duZXJJRDtcbiAgb21hcC5fX2hhc2ggPSBoYXNoO1xuICBvbWFwLl9fYWx0ZXJlZCA9IGZhbHNlO1xuICByZXR1cm4gb21hcDtcbn1cblxudmFyIEVNUFRZX09SREVSRURfTUFQO1xuZnVuY3Rpb24gZW1wdHlPcmRlcmVkTWFwKCkge1xuICByZXR1cm4gKFxuICAgIEVNUFRZX09SREVSRURfTUFQIHx8XG4gICAgKEVNUFRZX09SREVSRURfTUFQID0gbWFrZU9yZGVyZWRNYXAoZW1wdHlNYXAoKSwgZW1wdHlMaXN0KCkpKVxuICApO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVPcmRlcmVkTWFwKG9tYXAsIGssIHYpIHtcbiAgdmFyIG1hcCA9IG9tYXAuX21hcDtcbiAgdmFyIGxpc3QgPSBvbWFwLl9saXN0O1xuICB2YXIgaSA9IG1hcC5nZXQoayk7XG4gIHZhciBoYXMgPSBpICE9PSB1bmRlZmluZWQ7XG4gIHZhciBuZXdNYXA7XG4gIHZhciBuZXdMaXN0O1xuICBpZiAodiA9PT0gTk9UX1NFVCkge1xuICAgIC8vIHJlbW92ZWRcbiAgICBpZiAoIWhhcykge1xuICAgICAgcmV0dXJuIG9tYXA7XG4gICAgfVxuICAgIGlmIChsaXN0LnNpemUgPj0gU0laRSAmJiBsaXN0LnNpemUgPj0gbWFwLnNpemUgKiAyKSB7XG4gICAgICBuZXdMaXN0ID0gbGlzdC5maWx0ZXIoZnVuY3Rpb24gKGVudHJ5LCBpZHgpIHsgcmV0dXJuIGVudHJ5ICE9PSB1bmRlZmluZWQgJiYgaSAhPT0gaWR4OyB9KTtcbiAgICAgIG5ld01hcCA9IG5ld0xpc3RcbiAgICAgICAgLnRvS2V5ZWRTZXEoKVxuICAgICAgICAubWFwKGZ1bmN0aW9uIChlbnRyeSkgeyByZXR1cm4gZW50cnlbMF07IH0pXG4gICAgICAgIC5mbGlwKClcbiAgICAgICAgLnRvTWFwKCk7XG4gICAgICBpZiAob21hcC5fX293bmVySUQpIHtcbiAgICAgICAgbmV3TWFwLl9fb3duZXJJRCA9IG5ld0xpc3QuX19vd25lcklEID0gb21hcC5fX293bmVySUQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld01hcCA9IG1hcC5yZW1vdmUoayk7XG4gICAgICBuZXdMaXN0ID0gaSA9PT0gbGlzdC5zaXplIC0gMSA/IGxpc3QucG9wKCkgOiBsaXN0LnNldChpLCB1bmRlZmluZWQpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChoYXMpIHtcbiAgICBpZiAodiA9PT0gbGlzdC5nZXQoaSlbMV0pIHtcbiAgICAgIHJldHVybiBvbWFwO1xuICAgIH1cbiAgICBuZXdNYXAgPSBtYXA7XG4gICAgbmV3TGlzdCA9IGxpc3Quc2V0KGksIFtrLCB2XSk7XG4gIH0gZWxzZSB7XG4gICAgbmV3TWFwID0gbWFwLnNldChrLCBsaXN0LnNpemUpO1xuICAgIG5ld0xpc3QgPSBsaXN0LnNldChsaXN0LnNpemUsIFtrLCB2XSk7XG4gIH1cbiAgaWYgKG9tYXAuX19vd25lcklEKSB7XG4gICAgb21hcC5zaXplID0gbmV3TWFwLnNpemU7XG4gICAgb21hcC5fbWFwID0gbmV3TWFwO1xuICAgIG9tYXAuX2xpc3QgPSBuZXdMaXN0O1xuICAgIG9tYXAuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgIG9tYXAuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICByZXR1cm4gb21hcDtcbiAgfVxuICByZXR1cm4gbWFrZU9yZGVyZWRNYXAobmV3TWFwLCBuZXdMaXN0KTtcbn1cblxudmFyIElTX1NUQUNLX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX1NUQUNLX19AQCc7XG5cbmZ1bmN0aW9uIGlzU3RhY2sobWF5YmVTdGFjaykge1xuICByZXR1cm4gQm9vbGVhbihtYXliZVN0YWNrICYmIG1heWJlU3RhY2tbSVNfU1RBQ0tfU1lNQk9MXSk7XG59XG5cbnZhciBTdGFjayA9IC8qQF9fUFVSRV9fKi8oZnVuY3Rpb24gKEluZGV4ZWRDb2xsZWN0aW9uKSB7XG4gIGZ1bmN0aW9uIFN0YWNrKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSBudWxsIHx8IHZhbHVlID09PSB1bmRlZmluZWRcbiAgICAgID8gZW1wdHlTdGFjaygpXG4gICAgICA6IGlzU3RhY2sodmFsdWUpXG4gICAgICA/IHZhbHVlXG4gICAgICA6IGVtcHR5U3RhY2soKS5wdXNoQWxsKHZhbHVlKTtcbiAgfVxuXG4gIGlmICggSW5kZXhlZENvbGxlY3Rpb24gKSBTdGFjay5fX3Byb3RvX18gPSBJbmRleGVkQ29sbGVjdGlvbjtcbiAgU3RhY2sucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggSW5kZXhlZENvbGxlY3Rpb24gJiYgSW5kZXhlZENvbGxlY3Rpb24ucHJvdG90eXBlICk7XG4gIFN0YWNrLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN0YWNrO1xuXG4gIFN0YWNrLm9mID0gZnVuY3Rpb24gb2YgKC8qLi4udmFsdWVzKi8pIHtcbiAgICByZXR1cm4gdGhpcyhhcmd1bWVudHMpO1xuICB9O1xuXG4gIFN0YWNrLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgICByZXR1cm4gdGhpcy5fX3RvU3RyaW5nKCdTdGFjayBbJywgJ10nKTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gIFN0YWNrLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICBpbmRleCA9IHdyYXBJbmRleCh0aGlzLCBpbmRleCk7XG4gICAgd2hpbGUgKGhlYWQgJiYgaW5kZXgtLSkge1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGhlYWQgPyBoZWFkLnZhbHVlIDogbm90U2V0VmFsdWU7XG4gIH07XG5cbiAgU3RhY2sucHJvdG90eXBlLnBlZWsgPSBmdW5jdGlvbiBwZWVrICgpIHtcbiAgICByZXR1cm4gdGhpcy5faGVhZCAmJiB0aGlzLl9oZWFkLnZhbHVlO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgTW9kaWZpY2F0aW9uXG5cbiAgU3RhY2sucHJvdG90eXBlLnB1c2ggPSBmdW5jdGlvbiBwdXNoICgvKi4uLnZhbHVlcyovKSB7XG4gICAgdmFyIGFyZ3VtZW50cyQxID0gYXJndW1lbnRzO1xuXG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB2YXIgbmV3U2l6ZSA9IHRoaXMuc2l6ZSArIGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIGhlYWQgPSB0aGlzLl9oZWFkO1xuICAgIGZvciAodmFyIGlpID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7IGlpID49IDA7IGlpLS0pIHtcbiAgICAgIGhlYWQgPSB7XG4gICAgICAgIHZhbHVlOiBhcmd1bWVudHMkMVtpaV0sXG4gICAgICAgIG5leHQ6IGhlYWQsXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlU3RhY2sobmV3U2l6ZSwgaGVhZCk7XG4gIH07XG5cbiAgU3RhY2sucHJvdG90eXBlLnB1c2hBbGwgPSBmdW5jdGlvbiBwdXNoQWxsIChpdGVyKSB7XG4gICAgaXRlciA9IEluZGV4ZWRDb2xsZWN0aW9uKGl0ZXIpO1xuICAgIGlmIChpdGVyLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaXplID09PSAwICYmIGlzU3RhY2soaXRlcikpIHtcbiAgICAgIHJldHVybiBpdGVyO1xuICAgIH1cbiAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplO1xuICAgIHZhciBoZWFkID0gdGhpcy5faGVhZDtcbiAgICBpdGVyLl9faXRlcmF0ZShmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIG5ld1NpemUrKztcbiAgICAgIGhlYWQgPSB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgbmV4dDogaGVhZCxcbiAgICAgIH07XG4gICAgfSwgLyogcmV2ZXJzZSAqLyB0cnVlKTtcbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHRoaXMuc2l6ZSA9IG5ld1NpemU7XG4gICAgICB0aGlzLl9oZWFkID0gaGVhZDtcbiAgICAgIHRoaXMuX19oYXNoID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBtYWtlU3RhY2sobmV3U2l6ZSwgaGVhZCk7XG4gIH07XG5cbiAgU3RhY2sucHJvdG90eXBlLnBvcCA9IGZ1bmN0aW9uIHBvcCAoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMSk7XG4gIH07XG5cbiAgU3RhY2sucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIgKCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAodGhpcy5fX293bmVySUQpIHtcbiAgICAgIHRoaXMuc2l6ZSA9IDA7XG4gICAgICB0aGlzLl9oZWFkID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fX2hhc2ggPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9fYWx0ZXJlZCA9IHRydWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIGVtcHR5U3RhY2soKTtcbiAgfTtcblxuICBTdGFjay5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoYmVnaW4sIGVuZCkge1xuICAgIGlmICh3aG9sZVNsaWNlKGJlZ2luLCBlbmQsIHRoaXMuc2l6ZSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB2YXIgcmVzb2x2ZWRCZWdpbiA9IHJlc29sdmVCZWdpbihiZWdpbiwgdGhpcy5zaXplKTtcbiAgICB2YXIgcmVzb2x2ZWRFbmQgPSByZXNvbHZlRW5kKGVuZCwgdGhpcy5zaXplKTtcbiAgICBpZiAocmVzb2x2ZWRFbmQgIT09IHRoaXMuc2l6ZSkge1xuICAgICAgLy8gc3VwZXIuc2xpY2UoYmVnaW4sIGVuZCk7XG4gICAgICByZXR1cm4gSW5kZXhlZENvbGxlY3Rpb24ucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcywgYmVnaW4sIGVuZCk7XG4gICAgfVxuICAgIHZhciBuZXdTaXplID0gdGhpcy5zaXplIC0gcmVzb2x2ZWRCZWdpbjtcbiAgICB2YXIgaGVhZCA9IHRoaXMuX2hlYWQ7XG4gICAgd2hpbGUgKHJlc29sdmVkQmVnaW4tLSkge1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICB9XG4gICAgaWYgKHRoaXMuX19vd25lcklEKSB7XG4gICAgICB0aGlzLnNpemUgPSBuZXdTaXplO1xuICAgICAgdGhpcy5faGVhZCA9IGhlYWQ7XG4gICAgICB0aGlzLl9faGFzaCA9IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX19hbHRlcmVkID0gdHJ1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVN0YWNrKG5ld1NpemUsIGhlYWQpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgTXV0YWJpbGl0eVxuXG4gIFN0YWNrLnByb3RvdHlwZS5fX2Vuc3VyZU93bmVyID0gZnVuY3Rpb24gX19lbnN1cmVPd25lciAob3duZXJJRCkge1xuICAgIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmICghb3duZXJJRCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gZW1wdHlTdGFjaygpO1xuICAgICAgfVxuICAgICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgICAgdGhpcy5fX2FsdGVyZWQgPSBmYWxzZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICByZXR1cm4gbWFrZVN0YWNrKHRoaXMuc2l6ZSwgdGhpcy5faGVhZCwgb3duZXJJRCwgdGhpcy5fX2hhc2gpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgSXRlcmF0aW9uXG5cbiAgU3RhY2sucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgaWYgKHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBuZXcgQXJyYXlTZXEodGhpcy50b0FycmF5KCkpLl9faXRlcmF0ZShcbiAgICAgICAgZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIGZuKHYsIGssIHRoaXMkMSQxKTsgfSxcbiAgICAgICAgcmV2ZXJzZVxuICAgICAgKTtcbiAgICB9XG4gICAgdmFyIGl0ZXJhdGlvbnMgPSAwO1xuICAgIHZhciBub2RlID0gdGhpcy5faGVhZDtcbiAgICB3aGlsZSAobm9kZSkge1xuICAgICAgaWYgKGZuKG5vZGUudmFsdWUsIGl0ZXJhdGlvbnMrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbm9kZSA9IG5vZGUubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGl0ZXJhdGlvbnM7XG4gIH07XG5cbiAgU3RhY2sucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgaWYgKHJldmVyc2UpIHtcbiAgICAgIHJldHVybiBuZXcgQXJyYXlTZXEodGhpcy50b0FycmF5KCkpLl9faXRlcmF0b3IodHlwZSwgcmV2ZXJzZSk7XG4gICAgfVxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICB2YXIgbm9kZSA9IHRoaXMuX2hlYWQ7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAobm9kZSkge1xuICAgICAgICB2YXIgdmFsdWUgPSBub2RlLnZhbHVlO1xuICAgICAgICBub2RlID0gbm9kZS5uZXh0O1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JWYWx1ZSh0eXBlLCBpdGVyYXRpb25zKyssIHZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICB9KTtcbiAgfTtcblxuICByZXR1cm4gU3RhY2s7XG59KEluZGV4ZWRDb2xsZWN0aW9uKSk7XG5cblN0YWNrLmlzU3RhY2sgPSBpc1N0YWNrO1xuXG52YXIgU3RhY2tQcm90b3R5cGUgPSBTdGFjay5wcm90b3R5cGU7XG5TdGFja1Byb3RvdHlwZVtJU19TVEFDS19TWU1CT0xdID0gdHJ1ZTtcblN0YWNrUHJvdG90eXBlLnNoaWZ0ID0gU3RhY2tQcm90b3R5cGUucG9wO1xuU3RhY2tQcm90b3R5cGUudW5zaGlmdCA9IFN0YWNrUHJvdG90eXBlLnB1c2g7XG5TdGFja1Byb3RvdHlwZS51bnNoaWZ0QWxsID0gU3RhY2tQcm90b3R5cGUucHVzaEFsbDtcblN0YWNrUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuU3RhY2tQcm90b3R5cGUud2FzQWx0ZXJlZCA9IHdhc0FsdGVyZWQ7XG5TdGFja1Byb3RvdHlwZS5hc0ltbXV0YWJsZSA9IGFzSW1tdXRhYmxlO1xuU3RhY2tQcm90b3R5cGVbJ0BAdHJhbnNkdWNlci9pbml0J10gPSBTdGFja1Byb3RvdHlwZS5hc011dGFibGUgPSBhc011dGFibGU7XG5TdGFja1Byb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGFycikge1xuICByZXR1cm4gcmVzdWx0LnVuc2hpZnQoYXJyKTtcbn07XG5TdGFja1Byb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqLmFzSW1tdXRhYmxlKCk7XG59O1xuXG5mdW5jdGlvbiBtYWtlU3RhY2soc2l6ZSwgaGVhZCwgb3duZXJJRCwgaGFzaCkge1xuICB2YXIgbWFwID0gT2JqZWN0LmNyZWF0ZShTdGFja1Byb3RvdHlwZSk7XG4gIG1hcC5zaXplID0gc2l6ZTtcbiAgbWFwLl9oZWFkID0gaGVhZDtcbiAgbWFwLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gIG1hcC5fX2hhc2ggPSBoYXNoO1xuICBtYXAuX19hbHRlcmVkID0gZmFsc2U7XG4gIHJldHVybiBtYXA7XG59XG5cbnZhciBFTVBUWV9TVEFDSztcbmZ1bmN0aW9uIGVtcHR5U3RhY2soKSB7XG4gIHJldHVybiBFTVBUWV9TVEFDSyB8fCAoRU1QVFlfU1RBQ0sgPSBtYWtlU3RhY2soMCkpO1xufVxuXG52YXIgSVNfU0VUX1NZTUJPTCA9ICdAQF9fSU1NVVRBQkxFX1NFVF9fQEAnO1xuXG5mdW5jdGlvbiBpc1NldChtYXliZVNldCkge1xuICByZXR1cm4gQm9vbGVhbihtYXliZVNldCAmJiBtYXliZVNldFtJU19TRVRfU1lNQk9MXSk7XG59XG5cbmZ1bmN0aW9uIGlzT3JkZXJlZFNldChtYXliZU9yZGVyZWRTZXQpIHtcbiAgcmV0dXJuIGlzU2V0KG1heWJlT3JkZXJlZFNldCkgJiYgaXNPcmRlcmVkKG1heWJlT3JkZXJlZFNldCk7XG59XG5cbmZ1bmN0aW9uIGRlZXBFcXVhbChhLCBiKSB7XG4gIGlmIChhID09PSBiKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAoXG4gICAgIWlzQ29sbGVjdGlvbihiKSB8fFxuICAgIChhLnNpemUgIT09IHVuZGVmaW5lZCAmJiBiLnNpemUgIT09IHVuZGVmaW5lZCAmJiBhLnNpemUgIT09IGIuc2l6ZSkgfHxcbiAgICAoYS5fX2hhc2ggIT09IHVuZGVmaW5lZCAmJlxuICAgICAgYi5fX2hhc2ggIT09IHVuZGVmaW5lZCAmJlxuICAgICAgYS5fX2hhc2ggIT09IGIuX19oYXNoKSB8fFxuICAgIGlzS2V5ZWQoYSkgIT09IGlzS2V5ZWQoYikgfHxcbiAgICBpc0luZGV4ZWQoYSkgIT09IGlzSW5kZXhlZChiKSB8fFxuICAgIGlzT3JkZXJlZChhKSAhPT0gaXNPcmRlcmVkKGIpXG4gICkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGlmIChhLnNpemUgPT09IDAgJiYgYi5zaXplID09PSAwKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICB2YXIgbm90QXNzb2NpYXRpdmUgPSAhaXNBc3NvY2lhdGl2ZShhKTtcblxuICBpZiAoaXNPcmRlcmVkKGEpKSB7XG4gICAgdmFyIGVudHJpZXMgPSBhLmVudHJpZXMoKTtcbiAgICByZXR1cm4gKFxuICAgICAgYi5ldmVyeShmdW5jdGlvbiAodiwgaykge1xuICAgICAgICB2YXIgZW50cnkgPSBlbnRyaWVzLm5leHQoKS52YWx1ZTtcbiAgICAgICAgcmV0dXJuIGVudHJ5ICYmIGlzKGVudHJ5WzFdLCB2KSAmJiAobm90QXNzb2NpYXRpdmUgfHwgaXMoZW50cnlbMF0sIGspKTtcbiAgICAgIH0pICYmIGVudHJpZXMubmV4dCgpLmRvbmVcbiAgICApO1xuICB9XG5cbiAgdmFyIGZsaXBwZWQgPSBmYWxzZTtcblxuICBpZiAoYS5zaXplID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoYi5zaXplID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgYS5jYWNoZVJlc3VsdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBhLmNhY2hlUmVzdWx0KCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZsaXBwZWQgPSB0cnVlO1xuICAgICAgdmFyIF8gPSBhO1xuICAgICAgYSA9IGI7XG4gICAgICBiID0gXztcbiAgICB9XG4gIH1cblxuICB2YXIgYWxsRXF1YWwgPSB0cnVlO1xuICB2YXIgYlNpemUgPSBiLl9faXRlcmF0ZShmdW5jdGlvbiAodiwgaykge1xuICAgIGlmIChcbiAgICAgIG5vdEFzc29jaWF0aXZlXG4gICAgICAgID8gIWEuaGFzKHYpXG4gICAgICAgIDogZmxpcHBlZFxuICAgICAgICA/ICFpcyh2LCBhLmdldChrLCBOT1RfU0VUKSlcbiAgICAgICAgOiAhaXMoYS5nZXQoaywgTk9UX1NFVCksIHYpXG4gICAgKSB7XG4gICAgICBhbGxFcXVhbCA9IGZhbHNlO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGFsbEVxdWFsICYmIGEuc2l6ZSA9PT0gYlNpemU7XG59XG5cbmZ1bmN0aW9uIG1peGluKGN0b3IsIG1ldGhvZHMpIHtcbiAgdmFyIGtleUNvcGllciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICBjdG9yLnByb3RvdHlwZVtrZXldID0gbWV0aG9kc1trZXldO1xuICB9O1xuICBPYmplY3Qua2V5cyhtZXRob2RzKS5mb3JFYWNoKGtleUNvcGllcik7XG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMgJiZcbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKG1ldGhvZHMpLmZvckVhY2goa2V5Q29waWVyKTtcbiAgcmV0dXJuIGN0b3I7XG59XG5cbmZ1bmN0aW9uIHRvSlModmFsdWUpIHtcbiAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9XG4gIGlmICghaXNDb2xsZWN0aW9uKHZhbHVlKSkge1xuICAgIGlmICghaXNEYXRhU3RydWN0dXJlKHZhbHVlKSkge1xuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICB2YWx1ZSA9IFNlcSh2YWx1ZSk7XG4gIH1cbiAgaWYgKGlzS2V5ZWQodmFsdWUpKSB7XG4gICAgdmFyIHJlc3VsdCQxID0ge307XG4gICAgdmFsdWUuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICByZXN1bHQkMVtrXSA9IHRvSlModik7XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlc3VsdCQxO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFsdWUuX19pdGVyYXRlKGZ1bmN0aW9uICh2KSB7XG4gICAgcmVzdWx0LnB1c2godG9KUyh2KSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG52YXIgU2V0ID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoU2V0Q29sbGVjdGlvbikge1xuICBmdW5jdGlvbiBTZXQodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IG51bGwgfHwgdmFsdWUgPT09IHVuZGVmaW5lZFxuICAgICAgPyBlbXB0eVNldCgpXG4gICAgICA6IGlzU2V0KHZhbHVlKSAmJiAhaXNPcmRlcmVkKHZhbHVlKVxuICAgICAgPyB2YWx1ZVxuICAgICAgOiBlbXB0eVNldCgpLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKHNldCkge1xuICAgICAgICAgIHZhciBpdGVyID0gU2V0Q29sbGVjdGlvbih2YWx1ZSk7XG4gICAgICAgICAgYXNzZXJ0Tm90SW5maW5pdGUoaXRlci5zaXplKTtcbiAgICAgICAgICBpdGVyLmZvckVhY2goZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHNldC5hZGQodik7IH0pO1xuICAgICAgICB9KTtcbiAgfVxuXG4gIGlmICggU2V0Q29sbGVjdGlvbiApIFNldC5fX3Byb3RvX18gPSBTZXRDb2xsZWN0aW9uO1xuICBTZXQucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZSggU2V0Q29sbGVjdGlvbiAmJiBTZXRDb2xsZWN0aW9uLnByb3RvdHlwZSApO1xuICBTZXQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gU2V0O1xuXG4gIFNldC5vZiA9IGZ1bmN0aW9uIG9mICgvKi4uLnZhbHVlcyovKSB7XG4gICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcbiAgfTtcblxuICBTZXQuZnJvbUtleXMgPSBmdW5jdGlvbiBmcm9tS2V5cyAodmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcyhLZXllZENvbGxlY3Rpb24odmFsdWUpLmtleVNlcSgpKTtcbiAgfTtcblxuICBTZXQuaW50ZXJzZWN0ID0gZnVuY3Rpb24gaW50ZXJzZWN0IChzZXRzKSB7XG4gICAgc2V0cyA9IENvbGxlY3Rpb24oc2V0cykudG9BcnJheSgpO1xuICAgIHJldHVybiBzZXRzLmxlbmd0aFxuICAgICAgPyBTZXRQcm90b3R5cGUuaW50ZXJzZWN0LmFwcGx5KFNldChzZXRzLnBvcCgpKSwgc2V0cylcbiAgICAgIDogZW1wdHlTZXQoKTtcbiAgfTtcblxuICBTZXQudW5pb24gPSBmdW5jdGlvbiB1bmlvbiAoc2V0cykge1xuICAgIHNldHMgPSBDb2xsZWN0aW9uKHNldHMpLnRvQXJyYXkoKTtcbiAgICByZXR1cm4gc2V0cy5sZW5ndGhcbiAgICAgID8gU2V0UHJvdG90eXBlLnVuaW9uLmFwcGx5KFNldChzZXRzLnBvcCgpKSwgc2V0cylcbiAgICAgIDogZW1wdHlTZXQoKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIHJldHVybiB0aGlzLl9fdG9TdHJpbmcoJ1NldCB7JywgJ30nKTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIEFjY2Vzc1xuXG4gIFNldC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gaGFzICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLl9tYXAuaGFzKHZhbHVlKTtcbiAgfTtcblxuICAvLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG4gIFNldC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gYWRkICh2YWx1ZSkge1xuICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLnNldCh2YWx1ZSwgdmFsdWUpKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAodmFsdWUpIHtcbiAgICByZXR1cm4gdXBkYXRlU2V0KHRoaXMsIHRoaXMuX21hcC5yZW1vdmUodmFsdWUpKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIgKCkge1xuICAgIHJldHVybiB1cGRhdGVTZXQodGhpcywgdGhpcy5fbWFwLmNsZWFyKCkpO1xuICB9O1xuXG4gIC8vIEBwcmFnbWEgQ29tcG9zaXRpb25cblxuICBTZXQucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIG1hcCAobWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIC8vIGtlZXAgdHJhY2sgaWYgdGhlIHNldCBpcyBhbHRlcmVkIGJ5IHRoZSBtYXAgZnVuY3Rpb25cbiAgICB2YXIgZGlkQ2hhbmdlcyA9IGZhbHNlO1xuXG4gICAgdmFyIG5ld01hcCA9IHVwZGF0ZVNldChcbiAgICAgIHRoaXMsXG4gICAgICB0aGlzLl9tYXAubWFwRW50cmllcyhmdW5jdGlvbiAocmVmKSB7XG4gICAgICAgIHZhciB2ID0gcmVmWzFdO1xuXG4gICAgICAgIHZhciBtYXBwZWQgPSBtYXBwZXIuY2FsbChjb250ZXh0LCB2LCB2LCB0aGlzJDEkMSk7XG5cbiAgICAgICAgaWYgKG1hcHBlZCAhPT0gdikge1xuICAgICAgICAgIGRpZENoYW5nZXMgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFttYXBwZWQsIG1hcHBlZF07XG4gICAgICB9LCBjb250ZXh0KVxuICAgICk7XG5cbiAgICByZXR1cm4gZGlkQ2hhbmdlcyA/IG5ld01hcCA6IHRoaXM7XG4gIH07XG5cbiAgU2V0LnByb3RvdHlwZS51bmlvbiA9IGZ1bmN0aW9uIHVuaW9uICgpIHtcbiAgICB2YXIgaXRlcnMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAoIGxlbi0tICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIGl0ZXJzID0gaXRlcnMuZmlsdGVyKGZ1bmN0aW9uICh4KSB7IHJldHVybiB4LnNpemUgIT09IDA7IH0pO1xuICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAodGhpcy5zaXplID09PSAwICYmICF0aGlzLl9fb3duZXJJRCAmJiBpdGVycy5sZW5ndGggPT09IDEpIHtcbiAgICAgIHJldHVybiB0aGlzLmNvbnN0cnVjdG9yKGl0ZXJzWzBdKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICBmb3IgKHZhciBpaSA9IDA7IGlpIDwgaXRlcnMubGVuZ3RoOyBpaSsrKSB7XG4gICAgICAgIFNldENvbGxlY3Rpb24oaXRlcnNbaWldKS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gc2V0LmFkZCh2YWx1ZSk7IH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuaW50ZXJzZWN0ID0gZnVuY3Rpb24gaW50ZXJzZWN0ICgpIHtcbiAgICB2YXIgaXRlcnMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAoIGxlbi0tICkgaXRlcnNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gXTtcblxuICAgIGlmIChpdGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpdGVycyA9IGl0ZXJzLm1hcChmdW5jdGlvbiAoaXRlcikgeyByZXR1cm4gU2V0Q29sbGVjdGlvbihpdGVyKTsgfSk7XG4gICAgdmFyIHRvUmVtb3ZlID0gW107XG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKCFpdGVycy5ldmVyeShmdW5jdGlvbiAoaXRlcikgeyByZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSk7IH0pKSB7XG4gICAgICAgIHRvUmVtb3ZlLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKHNldCkge1xuICAgICAgdG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgc2V0LnJlbW92ZSh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLnN1YnRyYWN0ID0gZnVuY3Rpb24gc3VidHJhY3QgKCkge1xuICAgIHZhciBpdGVycyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHdoaWxlICggbGVuLS0gKSBpdGVyc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiBdO1xuXG4gICAgaWYgKGl0ZXJzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGl0ZXJzID0gaXRlcnMubWFwKGZ1bmN0aW9uIChpdGVyKSB7IHJldHVybiBTZXRDb2xsZWN0aW9uKGl0ZXIpOyB9KTtcbiAgICB2YXIgdG9SZW1vdmUgPSBbXTtcbiAgICB0aGlzLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICBpZiAoaXRlcnMuc29tZShmdW5jdGlvbiAoaXRlcikgeyByZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSk7IH0pKSB7XG4gICAgICAgIHRvUmVtb3ZlLnB1c2godmFsdWUpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiB0aGlzLndpdGhNdXRhdGlvbnMoZnVuY3Rpb24gKHNldCkge1xuICAgICAgdG9SZW1vdmUuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgc2V0LnJlbW92ZSh2YWx1ZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLnNvcnQgPSBmdW5jdGlvbiBzb3J0IChjb21wYXJhdG9yKSB7XG4gICAgLy8gTGF0ZSBiaW5kaW5nXG4gICAgcmV0dXJuIE9yZGVyZWRTZXQoc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuICB9O1xuXG4gIFNldC5wcm90b3R5cGUuc29ydEJ5ID0gZnVuY3Rpb24gc29ydEJ5IChtYXBwZXIsIGNvbXBhcmF0b3IpIHtcbiAgICAvLyBMYXRlIGJpbmRpbmdcbiAgICByZXR1cm4gT3JkZXJlZFNldChzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLndhc0FsdGVyZWQgPSBmdW5jdGlvbiB3YXNBbHRlcmVkICgpIHtcbiAgICByZXR1cm4gdGhpcy5fbWFwLndhc0FsdGVyZWQoKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHRoaXMuX21hcC5fX2l0ZXJhdGUoZnVuY3Rpb24gKGspIHsgcmV0dXJuIGZuKGssIGssIHRoaXMkMSQxKTsgfSwgcmV2ZXJzZSk7XG4gIH07XG5cbiAgU2V0LnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHJldHVybiB0aGlzLl9tYXAuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbiAgfTtcblxuICBTZXQucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gICAgaWYgKG93bmVySUQgPT09IHRoaXMuX19vd25lcklEKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgdmFyIG5ld01hcCA9IHRoaXMuX21hcC5fX2Vuc3VyZU93bmVyKG93bmVySUQpO1xuICAgIGlmICghb3duZXJJRCkge1xuICAgICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fX2VtcHR5KCk7XG4gICAgICB9XG4gICAgICB0aGlzLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gICAgICB0aGlzLl9tYXAgPSBuZXdNYXA7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX19tYWtlKG5ld01hcCwgb3duZXJJRCk7XG4gIH07XG5cbiAgcmV0dXJuIFNldDtcbn0oU2V0Q29sbGVjdGlvbikpO1xuXG5TZXQuaXNTZXQgPSBpc1NldDtcblxudmFyIFNldFByb3RvdHlwZSA9IFNldC5wcm90b3R5cGU7XG5TZXRQcm90b3R5cGVbSVNfU0VUX1NZTUJPTF0gPSB0cnVlO1xuU2V0UHJvdG90eXBlW0RFTEVURV0gPSBTZXRQcm90b3R5cGUucmVtb3ZlO1xuU2V0UHJvdG90eXBlLm1lcmdlID0gU2V0UHJvdG90eXBlLmNvbmNhdCA9IFNldFByb3RvdHlwZS51bmlvbjtcblNldFByb3RvdHlwZS53aXRoTXV0YXRpb25zID0gd2l0aE11dGF0aW9ucztcblNldFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IGFzSW1tdXRhYmxlO1xuU2V0UHJvdG90eXBlWydAQHRyYW5zZHVjZXIvaW5pdCddID0gU2V0UHJvdG90eXBlLmFzTXV0YWJsZSA9IGFzTXV0YWJsZTtcblNldFByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3N0ZXAnXSA9IGZ1bmN0aW9uIChyZXN1bHQsIGFycikge1xuICByZXR1cm4gcmVzdWx0LmFkZChhcnIpO1xufTtcblNldFByb3RvdHlwZVsnQEB0cmFuc2R1Y2VyL3Jlc3VsdCddID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqLmFzSW1tdXRhYmxlKCk7XG59O1xuXG5TZXRQcm90b3R5cGUuX19lbXB0eSA9IGVtcHR5U2V0O1xuU2V0UHJvdG90eXBlLl9fbWFrZSA9IG1ha2VTZXQ7XG5cbmZ1bmN0aW9uIHVwZGF0ZVNldChzZXQsIG5ld01hcCkge1xuICBpZiAoc2V0Ll9fb3duZXJJRCkge1xuICAgIHNldC5zaXplID0gbmV3TWFwLnNpemU7XG4gICAgc2V0Ll9tYXAgPSBuZXdNYXA7XG4gICAgcmV0dXJuIHNldDtcbiAgfVxuICByZXR1cm4gbmV3TWFwID09PSBzZXQuX21hcFxuICAgID8gc2V0XG4gICAgOiBuZXdNYXAuc2l6ZSA9PT0gMFxuICAgID8gc2V0Ll9fZW1wdHkoKVxuICAgIDogc2V0Ll9fbWFrZShuZXdNYXApO1xufVxuXG5mdW5jdGlvbiBtYWtlU2V0KG1hcCwgb3duZXJJRCkge1xuICB2YXIgc2V0ID0gT2JqZWN0LmNyZWF0ZShTZXRQcm90b3R5cGUpO1xuICBzZXQuc2l6ZSA9IG1hcCA/IG1hcC5zaXplIDogMDtcbiAgc2V0Ll9tYXAgPSBtYXA7XG4gIHNldC5fX293bmVySUQgPSBvd25lcklEO1xuICByZXR1cm4gc2V0O1xufVxuXG52YXIgRU1QVFlfU0VUO1xuZnVuY3Rpb24gZW1wdHlTZXQoKSB7XG4gIHJldHVybiBFTVBUWV9TRVQgfHwgKEVNUFRZX1NFVCA9IG1ha2VTZXQoZW1wdHlNYXAoKSkpO1xufVxuXG4vKipcbiAqIFJldHVybnMgYSBsYXp5IHNlcSBvZiBudW1zIGZyb20gc3RhcnQgKGluY2x1c2l2ZSkgdG8gZW5kXG4gKiAoZXhjbHVzaXZlKSwgYnkgc3RlcCwgd2hlcmUgc3RhcnQgZGVmYXVsdHMgdG8gMCwgc3RlcCB0byAxLCBhbmQgZW5kIHRvXG4gKiBpbmZpbml0eS4gV2hlbiBzdGFydCBpcyBlcXVhbCB0byBlbmQsIHJldHVybnMgZW1wdHkgbGlzdC5cbiAqL1xudmFyIFJhbmdlID0gLypAX19QVVJFX18qLyhmdW5jdGlvbiAoSW5kZXhlZFNlcSkge1xuICBmdW5jdGlvbiBSYW5nZShzdGFydCwgZW5kLCBzdGVwKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJhbmdlKSkge1xuICAgICAgcmV0dXJuIG5ldyBSYW5nZShzdGFydCwgZW5kLCBzdGVwKTtcbiAgICB9XG4gICAgaW52YXJpYW50KHN0ZXAgIT09IDAsICdDYW5ub3Qgc3RlcCBhIFJhbmdlIGJ5IDAnKTtcbiAgICBzdGFydCA9IHN0YXJ0IHx8IDA7XG4gICAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbmQgPSBJbmZpbml0eTtcbiAgICB9XG4gICAgc3RlcCA9IHN0ZXAgPT09IHVuZGVmaW5lZCA/IDEgOiBNYXRoLmFicyhzdGVwKTtcbiAgICBpZiAoZW5kIDwgc3RhcnQpIHtcbiAgICAgIHN0ZXAgPSAtc3RlcDtcbiAgICB9XG4gICAgdGhpcy5fc3RhcnQgPSBzdGFydDtcbiAgICB0aGlzLl9lbmQgPSBlbmQ7XG4gICAgdGhpcy5fc3RlcCA9IHN0ZXA7XG4gICAgdGhpcy5zaXplID0gTWF0aC5tYXgoMCwgTWF0aC5jZWlsKChlbmQgLSBzdGFydCkgLyBzdGVwIC0gMSkgKyAxKTtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICBpZiAoRU1QVFlfUkFOR0UpIHtcbiAgICAgICAgcmV0dXJuIEVNUFRZX1JBTkdFO1xuICAgICAgfVxuICAgICAgRU1QVFlfUkFOR0UgPSB0aGlzO1xuICAgIH1cbiAgfVxuXG4gIGlmICggSW5kZXhlZFNlcSApIFJhbmdlLl9fcHJvdG9fXyA9IEluZGV4ZWRTZXE7XG4gIFJhbmdlLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEluZGV4ZWRTZXEgJiYgSW5kZXhlZFNlcS5wcm90b3R5cGUgKTtcbiAgUmFuZ2UucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gUmFuZ2U7XG5cbiAgUmFuZ2UucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiAnUmFuZ2UgW10nO1xuICAgIH1cbiAgICByZXR1cm4gKFxuICAgICAgJ1JhbmdlIFsgJyArXG4gICAgICB0aGlzLl9zdGFydCArXG4gICAgICAnLi4uJyArXG4gICAgICB0aGlzLl9lbmQgK1xuICAgICAgKHRoaXMuX3N0ZXAgIT09IDEgPyAnIGJ5ICcgKyB0aGlzLl9zdGVwIDogJycpICtcbiAgICAgICcgXSdcbiAgICApO1xuICB9O1xuXG4gIFJhbmdlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiBnZXQgKGluZGV4LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmhhcyhpbmRleClcbiAgICAgID8gdGhpcy5fc3RhcnQgKyB3cmFwSW5kZXgodGhpcywgaW5kZXgpICogdGhpcy5fc3RlcFxuICAgICAgOiBub3RTZXRWYWx1ZTtcbiAgfTtcblxuICBSYW5nZS5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAoc2VhcmNoVmFsdWUpIHtcbiAgICB2YXIgcG9zc2libGVJbmRleCA9IChzZWFyY2hWYWx1ZSAtIHRoaXMuX3N0YXJ0KSAvIHRoaXMuX3N0ZXA7XG4gICAgcmV0dXJuIChcbiAgICAgIHBvc3NpYmxlSW5kZXggPj0gMCAmJlxuICAgICAgcG9zc2libGVJbmRleCA8IHRoaXMuc2l6ZSAmJlxuICAgICAgcG9zc2libGVJbmRleCA9PT0gTWF0aC5mbG9vcihwb3NzaWJsZUluZGV4KVxuICAgICk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKGJlZ2luLCBlbmQpIHtcbiAgICBpZiAod2hvbGVTbGljZShiZWdpbiwgZW5kLCB0aGlzLnNpemUpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgYmVnaW4gPSByZXNvbHZlQmVnaW4oYmVnaW4sIHRoaXMuc2l6ZSk7XG4gICAgZW5kID0gcmVzb2x2ZUVuZChlbmQsIHRoaXMuc2l6ZSk7XG4gICAgaWYgKGVuZCA8PSBiZWdpbikge1xuICAgICAgcmV0dXJuIG5ldyBSYW5nZSgwLCAwKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYW5nZShcbiAgICAgIHRoaXMuZ2V0KGJlZ2luLCB0aGlzLl9lbmQpLFxuICAgICAgdGhpcy5nZXQoZW5kLCB0aGlzLl9lbmQpLFxuICAgICAgdGhpcy5fc3RlcFxuICAgICk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mIChzZWFyY2hWYWx1ZSkge1xuICAgIHZhciBvZmZzZXRWYWx1ZSA9IHNlYXJjaFZhbHVlIC0gdGhpcy5fc3RhcnQ7XG4gICAgaWYgKG9mZnNldFZhbHVlICUgdGhpcy5fc3RlcCA9PT0gMCkge1xuICAgICAgdmFyIGluZGV4ID0gb2Zmc2V0VmFsdWUgLyB0aGlzLl9zdGVwO1xuICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLnNpemUpIHtcbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gLTE7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHNlYXJjaFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5kZXhPZihzZWFyY2hWYWx1ZSk7XG4gIH07XG5cbiAgUmFuZ2UucHJvdG90eXBlLl9faXRlcmF0ZSA9IGZ1bmN0aW9uIF9faXRlcmF0ZSAoZm4sIHJldmVyc2UpIHtcbiAgICB2YXIgc2l6ZSA9IHRoaXMuc2l6ZTtcbiAgICB2YXIgc3RlcCA9IHRoaXMuX3N0ZXA7XG4gICAgdmFyIHZhbHVlID0gcmV2ZXJzZSA/IHRoaXMuX3N0YXJ0ICsgKHNpemUgLSAxKSAqIHN0ZXAgOiB0aGlzLl9zdGFydDtcbiAgICB2YXIgaSA9IDA7XG4gICAgd2hpbGUgKGkgIT09IHNpemUpIHtcbiAgICAgIGlmIChmbih2YWx1ZSwgcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKyssIHRoaXMpID09PSBmYWxzZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHZhbHVlICs9IHJldmVyc2UgPyAtc3RlcCA6IHN0ZXA7XG4gICAgfVxuICAgIHJldHVybiBpO1xuICB9O1xuXG4gIFJhbmdlLnByb3RvdHlwZS5fX2l0ZXJhdG9yID0gZnVuY3Rpb24gX19pdGVyYXRvciAodHlwZSwgcmV2ZXJzZSkge1xuICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuICAgIHZhciBzdGVwID0gdGhpcy5fc3RlcDtcbiAgICB2YXIgdmFsdWUgPSByZXZlcnNlID8gdGhpcy5fc3RhcnQgKyAoc2l6ZSAtIDEpICogc3RlcCA6IHRoaXMuX3N0YXJ0O1xuICAgIHZhciBpID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChpID09PSBzaXplKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvckRvbmUoKTtcbiAgICAgIH1cbiAgICAgIHZhciB2ID0gdmFsdWU7XG4gICAgICB2YWx1ZSArPSByZXZlcnNlID8gLXN0ZXAgOiBzdGVwO1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yVmFsdWUodHlwZSwgcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKyssIHYpO1xuICAgIH0pO1xuICB9O1xuXG4gIFJhbmdlLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKG90aGVyKSB7XG4gICAgcmV0dXJuIG90aGVyIGluc3RhbmNlb2YgUmFuZ2VcbiAgICAgID8gdGhpcy5fc3RhcnQgPT09IG90aGVyLl9zdGFydCAmJlxuICAgICAgICAgIHRoaXMuX2VuZCA9PT0gb3RoZXIuX2VuZCAmJlxuICAgICAgICAgIHRoaXMuX3N0ZXAgPT09IG90aGVyLl9zdGVwXG4gICAgICA6IGRlZXBFcXVhbCh0aGlzLCBvdGhlcik7XG4gIH07XG5cbiAgcmV0dXJuIFJhbmdlO1xufShJbmRleGVkU2VxKSk7XG5cbnZhciBFTVBUWV9SQU5HRTtcblxuZnVuY3Rpb24gZ2V0SW4kMShjb2xsZWN0aW9uLCBzZWFyY2hLZXlQYXRoLCBub3RTZXRWYWx1ZSkge1xuICB2YXIga2V5UGF0aCA9IGNvZXJjZUtleVBhdGgoc2VhcmNoS2V5UGF0aCk7XG4gIHZhciBpID0gMDtcbiAgd2hpbGUgKGkgIT09IGtleVBhdGgubGVuZ3RoKSB7XG4gICAgY29sbGVjdGlvbiA9IGdldChjb2xsZWN0aW9uLCBrZXlQYXRoW2krK10sIE5PVF9TRVQpO1xuICAgIGlmIChjb2xsZWN0aW9uID09PSBOT1RfU0VUKSB7XG4gICAgICByZXR1cm4gbm90U2V0VmFsdWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBjb2xsZWN0aW9uO1xufVxuXG5mdW5jdGlvbiBnZXRJbihzZWFyY2hLZXlQYXRoLCBub3RTZXRWYWx1ZSkge1xuICByZXR1cm4gZ2V0SW4kMSh0aGlzLCBzZWFyY2hLZXlQYXRoLCBub3RTZXRWYWx1ZSk7XG59XG5cbmZ1bmN0aW9uIGhhc0luJDEoY29sbGVjdGlvbiwga2V5UGF0aCkge1xuICByZXR1cm4gZ2V0SW4kMShjb2xsZWN0aW9uLCBrZXlQYXRoLCBOT1RfU0VUKSAhPT0gTk9UX1NFVDtcbn1cblxuZnVuY3Rpb24gaGFzSW4oc2VhcmNoS2V5UGF0aCkge1xuICByZXR1cm4gaGFzSW4kMSh0aGlzLCBzZWFyY2hLZXlQYXRoKTtcbn1cblxuZnVuY3Rpb24gdG9PYmplY3QoKSB7XG4gIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gIHZhciBvYmplY3QgPSB7fTtcbiAgdGhpcy5fX2l0ZXJhdGUoZnVuY3Rpb24gKHYsIGspIHtcbiAgICBvYmplY3Rba10gPSB2O1xuICB9KTtcbiAgcmV0dXJuIG9iamVjdDtcbn1cblxuLy8gTm90ZTogYWxsIG9mIHRoZXNlIG1ldGhvZHMgYXJlIGRlcHJlY2F0ZWQuXG5Db2xsZWN0aW9uLmlzSXRlcmFibGUgPSBpc0NvbGxlY3Rpb247XG5Db2xsZWN0aW9uLmlzS2V5ZWQgPSBpc0tleWVkO1xuQ29sbGVjdGlvbi5pc0luZGV4ZWQgPSBpc0luZGV4ZWQ7XG5Db2xsZWN0aW9uLmlzQXNzb2NpYXRpdmUgPSBpc0Fzc29jaWF0aXZlO1xuQ29sbGVjdGlvbi5pc09yZGVyZWQgPSBpc09yZGVyZWQ7XG5cbkNvbGxlY3Rpb24uSXRlcmF0b3IgPSBJdGVyYXRvcjtcblxubWl4aW4oQ29sbGVjdGlvbiwge1xuICAvLyAjIyMgQ29udmVyc2lvbiB0byBvdGhlciB0eXBlc1xuXG4gIHRvQXJyYXk6IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgYXNzZXJ0Tm90SW5maW5pdGUodGhpcy5zaXplKTtcbiAgICB2YXIgYXJyYXkgPSBuZXcgQXJyYXkodGhpcy5zaXplIHx8IDApO1xuICAgIHZhciB1c2VUdXBsZXMgPSBpc0tleWVkKHRoaXMpO1xuICAgIHZhciBpID0gMDtcbiAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbiAodiwgaykge1xuICAgICAgLy8gS2V5ZWQgY29sbGVjdGlvbnMgcHJvZHVjZSBhbiBhcnJheSBvZiB0dXBsZXMuXG4gICAgICBhcnJheVtpKytdID0gdXNlVHVwbGVzID8gW2ssIHZdIDogdjtcbiAgICB9KTtcbiAgICByZXR1cm4gYXJyYXk7XG4gIH0sXG5cbiAgdG9JbmRleGVkU2VxOiBmdW5jdGlvbiB0b0luZGV4ZWRTZXEoKSB7XG4gICAgcmV0dXJuIG5ldyBUb0luZGV4ZWRTZXF1ZW5jZSh0aGlzKTtcbiAgfSxcblxuICB0b0pTOiBmdW5jdGlvbiB0b0pTJDEoKSB7XG4gICAgcmV0dXJuIHRvSlModGhpcyk7XG4gIH0sXG5cbiAgdG9LZXllZFNlcTogZnVuY3Rpb24gdG9LZXllZFNlcSgpIHtcbiAgICByZXR1cm4gbmV3IFRvS2V5ZWRTZXF1ZW5jZSh0aGlzLCB0cnVlKTtcbiAgfSxcblxuICB0b01hcDogZnVuY3Rpb24gdG9NYXAoKSB7XG4gICAgLy8gVXNlIExhdGUgQmluZGluZyBoZXJlIHRvIHNvbHZlIHRoZSBjaXJjdWxhciBkZXBlbmRlbmN5LlxuICAgIHJldHVybiBNYXAodGhpcy50b0tleWVkU2VxKCkpO1xuICB9LFxuXG4gIHRvT2JqZWN0OiB0b09iamVjdCxcblxuICB0b09yZGVyZWRNYXA6IGZ1bmN0aW9uIHRvT3JkZXJlZE1hcCgpIHtcbiAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgcmV0dXJuIE9yZGVyZWRNYXAodGhpcy50b0tleWVkU2VxKCkpO1xuICB9LFxuXG4gIHRvT3JkZXJlZFNldDogZnVuY3Rpb24gdG9PcmRlcmVkU2V0KCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gT3JkZXJlZFNldChpc0tleWVkKHRoaXMpID8gdGhpcy52YWx1ZVNlcSgpIDogdGhpcyk7XG4gIH0sXG5cbiAgdG9TZXQ6IGZ1bmN0aW9uIHRvU2V0KCkge1xuICAgIC8vIFVzZSBMYXRlIEJpbmRpbmcgaGVyZSB0byBzb2x2ZSB0aGUgY2lyY3VsYXIgZGVwZW5kZW5jeS5cbiAgICByZXR1cm4gU2V0KGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgfSxcblxuICB0b1NldFNlcTogZnVuY3Rpb24gdG9TZXRTZXEoKSB7XG4gICAgcmV0dXJuIG5ldyBUb1NldFNlcXVlbmNlKHRoaXMpO1xuICB9LFxuXG4gIHRvU2VxOiBmdW5jdGlvbiB0b1NlcSgpIHtcbiAgICByZXR1cm4gaXNJbmRleGVkKHRoaXMpXG4gICAgICA/IHRoaXMudG9JbmRleGVkU2VxKClcbiAgICAgIDogaXNLZXllZCh0aGlzKVxuICAgICAgPyB0aGlzLnRvS2V5ZWRTZXEoKVxuICAgICAgOiB0aGlzLnRvU2V0U2VxKCk7XG4gIH0sXG5cbiAgdG9TdGFjazogZnVuY3Rpb24gdG9TdGFjaygpIHtcbiAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgcmV0dXJuIFN0YWNrKGlzS2V5ZWQodGhpcykgPyB0aGlzLnZhbHVlU2VxKCkgOiB0aGlzKTtcbiAgfSxcblxuICB0b0xpc3Q6IGZ1bmN0aW9uIHRvTGlzdCgpIHtcbiAgICAvLyBVc2UgTGF0ZSBCaW5kaW5nIGhlcmUgdG8gc29sdmUgdGhlIGNpcmN1bGFyIGRlcGVuZGVuY3kuXG4gICAgcmV0dXJuIExpc3QoaXNLZXllZCh0aGlzKSA/IHRoaXMudmFsdWVTZXEoKSA6IHRoaXMpO1xuICB9LFxuXG4gIC8vICMjIyBDb21tb24gSmF2YVNjcmlwdCBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXG5cbiAgdG9TdHJpbmc6IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnW0NvbGxlY3Rpb25dJztcbiAgfSxcblxuICBfX3RvU3RyaW5nOiBmdW5jdGlvbiBfX3RvU3RyaW5nKGhlYWQsIHRhaWwpIHtcbiAgICBpZiAodGhpcy5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gaGVhZCArIHRhaWw7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICBoZWFkICtcbiAgICAgICcgJyArXG4gICAgICB0aGlzLnRvU2VxKCkubWFwKHRoaXMuX190b1N0cmluZ01hcHBlcikuam9pbignLCAnKSArXG4gICAgICAnICcgK1xuICAgICAgdGFpbFxuICAgICk7XG4gIH0sXG5cbiAgLy8gIyMjIEVTNiBDb2xsZWN0aW9uIG1ldGhvZHMgKEVTNiBBcnJheSBhbmQgTWFwKVxuXG4gIGNvbmNhdDogZnVuY3Rpb24gY29uY2F0KCkge1xuICAgIHZhciB2YWx1ZXMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB3aGlsZSAoIGxlbi0tICkgdmFsdWVzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XG5cbiAgICByZXR1cm4gcmVpZnkodGhpcywgY29uY2F0RmFjdG9yeSh0aGlzLCB2YWx1ZXMpKTtcbiAgfSxcblxuICBpbmNsdWRlczogZnVuY3Rpb24gaW5jbHVkZXMoc2VhcmNoVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5zb21lKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gaXModmFsdWUsIHNlYXJjaFZhbHVlKTsgfSk7XG4gIH0sXG5cbiAgZW50cmllczogZnVuY3Rpb24gZW50cmllcygpIHtcbiAgICByZXR1cm4gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUyk7XG4gIH0sXG5cbiAgZXZlcnk6IGZ1bmN0aW9uIGV2ZXJ5KHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIGFzc2VydE5vdEluZmluaXRlKHRoaXMuc2l6ZSk7XG4gICAgdmFyIHJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbiAodiwgaywgYykge1xuICAgICAgaWYgKCFwcmVkaWNhdGUuY2FsbChjb250ZXh0LCB2LCBrLCBjKSkge1xuICAgICAgICByZXR1cm5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJldHVyblZhbHVlO1xuICB9LFxuXG4gIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBmaWx0ZXJGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgdHJ1ZSkpO1xuICB9LFxuXG4gIGZpbmQ6IGZ1bmN0aW9uIGZpbmQocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IHRoaXMuZmluZEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMV0gOiBub3RTZXRWYWx1ZTtcbiAgfSxcblxuICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKHNpZGVFZmZlY3QsIGNvbnRleHQpIHtcbiAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgIHJldHVybiB0aGlzLl9faXRlcmF0ZShjb250ZXh0ID8gc2lkZUVmZmVjdC5iaW5kKGNvbnRleHQpIDogc2lkZUVmZmVjdCk7XG4gIH0sXG5cbiAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3IpIHtcbiAgICBhc3NlcnROb3RJbmZpbml0ZSh0aGlzLnNpemUpO1xuICAgIHNlcGFyYXRvciA9IHNlcGFyYXRvciAhPT0gdW5kZWZpbmVkID8gJycgKyBzZXBhcmF0b3IgOiAnLCc7XG4gICAgdmFyIGpvaW5lZCA9ICcnO1xuICAgIHZhciBpc0ZpcnN0ID0gdHJ1ZTtcbiAgICB0aGlzLl9faXRlcmF0ZShmdW5jdGlvbiAodikge1xuICAgICAgaXNGaXJzdCA/IChpc0ZpcnN0ID0gZmFsc2UpIDogKGpvaW5lZCArPSBzZXBhcmF0b3IpO1xuICAgICAgam9pbmVkICs9IHYgIT09IG51bGwgJiYgdiAhPT0gdW5kZWZpbmVkID8gdi50b1N0cmluZygpIDogJyc7XG4gICAgfSk7XG4gICAgcmV0dXJuIGpvaW5lZDtcbiAgfSxcblxuICBrZXlzOiBmdW5jdGlvbiBrZXlzKCkge1xuICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9LRVlTKTtcbiAgfSxcblxuICBtYXA6IGZ1bmN0aW9uIG1hcChtYXBwZXIsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgbWFwRmFjdG9yeSh0aGlzLCBtYXBwZXIsIGNvbnRleHQpKTtcbiAgfSxcblxuICByZWR1Y2U6IGZ1bmN0aW9uIHJlZHVjZSQxKHJlZHVjZXIsIGluaXRpYWxSZWR1Y3Rpb24sIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVkdWNlKFxuICAgICAgdGhpcyxcbiAgICAgIHJlZHVjZXIsXG4gICAgICBpbml0aWFsUmVkdWN0aW9uLFxuICAgICAgY29udGV4dCxcbiAgICAgIGFyZ3VtZW50cy5sZW5ndGggPCAyLFxuICAgICAgZmFsc2VcbiAgICApO1xuICB9LFxuXG4gIHJlZHVjZVJpZ2h0OiBmdW5jdGlvbiByZWR1Y2VSaWdodChyZWR1Y2VyLCBpbml0aWFsUmVkdWN0aW9uLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlZHVjZShcbiAgICAgIHRoaXMsXG4gICAgICByZWR1Y2VyLFxuICAgICAgaW5pdGlhbFJlZHVjdGlvbixcbiAgICAgIGNvbnRleHQsXG4gICAgICBhcmd1bWVudHMubGVuZ3RoIDwgMixcbiAgICAgIHRydWVcbiAgICApO1xuICB9LFxuXG4gIHJldmVyc2U6IGZ1bmN0aW9uIHJldmVyc2UoKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHJldmVyc2VGYWN0b3J5KHRoaXMsIHRydWUpKTtcbiAgfSxcblxuICBzbGljZTogZnVuY3Rpb24gc2xpY2UoYmVnaW4sIGVuZCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBzbGljZUZhY3RvcnkodGhpcywgYmVnaW4sIGVuZCwgdHJ1ZSkpO1xuICB9LFxuXG4gIHNvbWU6IGZ1bmN0aW9uIHNvbWUocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuICF0aGlzLmV2ZXJ5KG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgfSxcblxuICBzb3J0OiBmdW5jdGlvbiBzb3J0KGNvbXBhcmF0b3IpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgc29ydEZhY3RvcnkodGhpcywgY29tcGFyYXRvcikpO1xuICB9LFxuXG4gIHZhbHVlczogZnVuY3Rpb24gdmFsdWVzKCkge1xuICAgIHJldHVybiB0aGlzLl9faXRlcmF0b3IoSVRFUkFURV9WQUxVRVMpO1xuICB9LFxuXG4gIC8vICMjIyBNb3JlIHNlcXVlbnRpYWwgbWV0aG9kc1xuXG4gIGJ1dExhc3Q6IGZ1bmN0aW9uIGJ1dExhc3QoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2xpY2UoMCwgLTEpO1xuICB9LFxuXG4gIGlzRW1wdHk6IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuc2l6ZSAhPT0gdW5kZWZpbmVkID8gdGhpcy5zaXplID09PSAwIDogIXRoaXMuc29tZShmdW5jdGlvbiAoKSB7IHJldHVybiB0cnVlOyB9KTtcbiAgfSxcblxuICBjb3VudDogZnVuY3Rpb24gY291bnQocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGVuc3VyZVNpemUoXG4gICAgICBwcmVkaWNhdGUgPyB0aGlzLnRvU2VxKCkuZmlsdGVyKHByZWRpY2F0ZSwgY29udGV4dCkgOiB0aGlzXG4gICAgKTtcbiAgfSxcblxuICBjb3VudEJ5OiBmdW5jdGlvbiBjb3VudEJ5KGdyb3VwZXIsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gY291bnRCeUZhY3RvcnkodGhpcywgZ3JvdXBlciwgY29udGV4dCk7XG4gIH0sXG5cbiAgZXF1YWxzOiBmdW5jdGlvbiBlcXVhbHMob3RoZXIpIHtcbiAgICByZXR1cm4gZGVlcEVxdWFsKHRoaXMsIG90aGVyKTtcbiAgfSxcblxuICBlbnRyeVNlcTogZnVuY3Rpb24gZW50cnlTZXEoKSB7XG4gICAgdmFyIGNvbGxlY3Rpb24gPSB0aGlzO1xuICAgIGlmIChjb2xsZWN0aW9uLl9jYWNoZSkge1xuICAgICAgLy8gV2UgY2FjaGUgYXMgYW4gZW50cmllcyBhcnJheSwgc28gd2UgY2FuIGp1c3QgcmV0dXJuIHRoZSBjYWNoZSFcbiAgICAgIHJldHVybiBuZXcgQXJyYXlTZXEoY29sbGVjdGlvbi5fY2FjaGUpO1xuICAgIH1cbiAgICB2YXIgZW50cmllc1NlcXVlbmNlID0gY29sbGVjdGlvbi50b1NlcSgpLm1hcChlbnRyeU1hcHBlcikudG9JbmRleGVkU2VxKCk7XG4gICAgZW50cmllc1NlcXVlbmNlLmZyb21FbnRyeVNlcSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGNvbGxlY3Rpb24udG9TZXEoKTsgfTtcbiAgICByZXR1cm4gZW50cmllc1NlcXVlbmNlO1xuICB9LFxuXG4gIGZpbHRlck5vdDogZnVuY3Rpb24gZmlsdGVyTm90KHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLmZpbHRlcihub3QocHJlZGljYXRlKSwgY29udGV4dCk7XG4gIH0sXG5cbiAgZmluZEVudHJ5OiBmdW5jdGlvbiBmaW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgIHZhciBmb3VuZCA9IG5vdFNldFZhbHVlO1xuICAgIHRoaXMuX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrLCBjKSB7XG4gICAgICBpZiAocHJlZGljYXRlLmNhbGwoY29udGV4dCwgdiwgaywgYykpIHtcbiAgICAgICAgZm91bmQgPSBbaywgdl07XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZm91bmQ7XG4gIH0sXG5cbiAgZmluZEtleTogZnVuY3Rpb24gZmluZEtleShwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgZW50cnkgPSB0aGlzLmZpbmRFbnRyeShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeVswXTtcbiAgfSxcblxuICBmaW5kTGFzdDogZnVuY3Rpb24gZmluZExhc3QocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkuZmluZChwcmVkaWNhdGUsIGNvbnRleHQsIG5vdFNldFZhbHVlKTtcbiAgfSxcblxuICBmaW5kTGFzdEVudHJ5OiBmdW5jdGlvbiBmaW5kTGFzdEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCwgbm90U2V0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy50b0tleWVkU2VxKClcbiAgICAgIC5yZXZlcnNlKClcbiAgICAgIC5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0LCBub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgZmluZExhc3RLZXk6IGZ1bmN0aW9uIGZpbmRMYXN0S2V5KHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiB0aGlzLnRvS2V5ZWRTZXEoKS5yZXZlcnNlKCkuZmluZEtleShwcmVkaWNhdGUsIGNvbnRleHQpO1xuICB9LFxuXG4gIGZpcnN0OiBmdW5jdGlvbiBmaXJzdChub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmZpbmQocmV0dXJuVHJ1ZSwgbnVsbCwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIGZsYXRNYXA6IGZ1bmN0aW9uIGZsYXRNYXAobWFwcGVyLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIGZsYXRNYXBGYWN0b3J5KHRoaXMsIG1hcHBlciwgY29udGV4dCkpO1xuICB9LFxuXG4gIGZsYXR0ZW46IGZ1bmN0aW9uIGZsYXR0ZW4oZGVwdGgpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdHRlbkZhY3RvcnkodGhpcywgZGVwdGgsIHRydWUpKTtcbiAgfSxcblxuICBmcm9tRW50cnlTZXE6IGZ1bmN0aW9uIGZyb21FbnRyeVNlcSgpIHtcbiAgICByZXR1cm4gbmV3IEZyb21FbnRyaWVzU2VxdWVuY2UodGhpcyk7XG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiBnZXQoc2VhcmNoS2V5LCBub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmZpbmQoZnVuY3Rpb24gKF8sIGtleSkgeyByZXR1cm4gaXMoa2V5LCBzZWFyY2hLZXkpOyB9LCB1bmRlZmluZWQsIG5vdFNldFZhbHVlKTtcbiAgfSxcblxuICBnZXRJbjogZ2V0SW4sXG5cbiAgZ3JvdXBCeTogZnVuY3Rpb24gZ3JvdXBCeShncm91cGVyLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIGdyb3VwQnlGYWN0b3J5KHRoaXMsIGdyb3VwZXIsIGNvbnRleHQpO1xuICB9LFxuXG4gIGhhczogZnVuY3Rpb24gaGFzKHNlYXJjaEtleSkge1xuICAgIHJldHVybiB0aGlzLmdldChzZWFyY2hLZXksIE5PVF9TRVQpICE9PSBOT1RfU0VUO1xuICB9LFxuXG4gIGhhc0luOiBoYXNJbixcblxuICBpc1N1YnNldDogZnVuY3Rpb24gaXNTdWJzZXQoaXRlcikge1xuICAgIGl0ZXIgPSB0eXBlb2YgaXRlci5pbmNsdWRlcyA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZXIgOiBDb2xsZWN0aW9uKGl0ZXIpO1xuICAgIHJldHVybiB0aGlzLmV2ZXJ5KGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gaXRlci5pbmNsdWRlcyh2YWx1ZSk7IH0pO1xuICB9LFxuXG4gIGlzU3VwZXJzZXQ6IGZ1bmN0aW9uIGlzU3VwZXJzZXQoaXRlcikge1xuICAgIGl0ZXIgPSB0eXBlb2YgaXRlci5pc1N1YnNldCA9PT0gJ2Z1bmN0aW9uJyA/IGl0ZXIgOiBDb2xsZWN0aW9uKGl0ZXIpO1xuICAgIHJldHVybiBpdGVyLmlzU3Vic2V0KHRoaXMpO1xuICB9LFxuXG4gIGtleU9mOiBmdW5jdGlvbiBrZXlPZihzZWFyY2hWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmZpbmRLZXkoZnVuY3Rpb24gKHZhbHVlKSB7IHJldHVybiBpcyh2YWx1ZSwgc2VhcmNoVmFsdWUpOyB9KTtcbiAgfSxcblxuICBrZXlTZXE6IGZ1bmN0aW9uIGtleVNlcSgpIHtcbiAgICByZXR1cm4gdGhpcy50b1NlcSgpLm1hcChrZXlNYXBwZXIpLnRvSW5kZXhlZFNlcSgpO1xuICB9LFxuXG4gIGxhc3Q6IGZ1bmN0aW9uIGxhc3Qobm90U2V0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy50b1NlcSgpLnJldmVyc2UoKS5maXJzdChub3RTZXRWYWx1ZSk7XG4gIH0sXG5cbiAgbGFzdEtleU9mOiBmdW5jdGlvbiBsYXN0S2V5T2Yoc2VhcmNoVmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy50b0tleWVkU2VxKCkucmV2ZXJzZSgpLmtleU9mKHNlYXJjaFZhbHVlKTtcbiAgfSxcblxuICBtYXg6IGZ1bmN0aW9uIG1heChjb21wYXJhdG9yKSB7XG4gICAgcmV0dXJuIG1heEZhY3RvcnkodGhpcywgY29tcGFyYXRvcik7XG4gIH0sXG5cbiAgbWF4Qnk6IGZ1bmN0aW9uIG1heEJ5KG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgIHJldHVybiBtYXhGYWN0b3J5KHRoaXMsIGNvbXBhcmF0b3IsIG1hcHBlcik7XG4gIH0sXG5cbiAgbWluOiBmdW5jdGlvbiBtaW4oY29tcGFyYXRvcikge1xuICAgIHJldHVybiBtYXhGYWN0b3J5KFxuICAgICAgdGhpcyxcbiAgICAgIGNvbXBhcmF0b3IgPyBuZWcoY29tcGFyYXRvcikgOiBkZWZhdWx0TmVnQ29tcGFyYXRvclxuICAgICk7XG4gIH0sXG5cbiAgbWluQnk6IGZ1bmN0aW9uIG1pbkJ5KG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgIHJldHVybiBtYXhGYWN0b3J5KFxuICAgICAgdGhpcyxcbiAgICAgIGNvbXBhcmF0b3IgPyBuZWcoY29tcGFyYXRvcikgOiBkZWZhdWx0TmVnQ29tcGFyYXRvcixcbiAgICAgIG1hcHBlclxuICAgICk7XG4gIH0sXG5cbiAgcmVzdDogZnVuY3Rpb24gcmVzdCgpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgxKTtcbiAgfSxcblxuICBza2lwOiBmdW5jdGlvbiBza2lwKGFtb3VudCkge1xuICAgIHJldHVybiBhbW91bnQgPT09IDAgPyB0aGlzIDogdGhpcy5zbGljZShNYXRoLm1heCgwLCBhbW91bnQpKTtcbiAgfSxcblxuICBza2lwTGFzdDogZnVuY3Rpb24gc2tpcExhc3QoYW1vdW50KSB7XG4gICAgcmV0dXJuIGFtb3VudCA9PT0gMCA/IHRoaXMgOiB0aGlzLnNsaWNlKDAsIC1NYXRoLm1heCgwLCBhbW91bnQpKTtcbiAgfSxcblxuICBza2lwV2hpbGU6IGZ1bmN0aW9uIHNraXBXaGlsZShwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgc2tpcFdoaWxlRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIHRydWUpKTtcbiAgfSxcblxuICBza2lwVW50aWw6IGZ1bmN0aW9uIHNraXBVbnRpbChwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gdGhpcy5za2lwV2hpbGUobm90KHByZWRpY2F0ZSksIGNvbnRleHQpO1xuICB9LFxuXG4gIHNvcnRCeTogZnVuY3Rpb24gc29ydEJ5KG1hcHBlciwgY29tcGFyYXRvcikge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBzb3J0RmFjdG9yeSh0aGlzLCBjb21wYXJhdG9yLCBtYXBwZXIpKTtcbiAgfSxcblxuICB0YWtlOiBmdW5jdGlvbiB0YWtlKGFtb3VudCkge1xuICAgIHJldHVybiB0aGlzLnNsaWNlKDAsIE1hdGgubWF4KDAsIGFtb3VudCkpO1xuICB9LFxuXG4gIHRha2VMYXN0OiBmdW5jdGlvbiB0YWtlTGFzdChhbW91bnQpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZSgtTWF0aC5tYXgoMCwgYW1vdW50KSk7XG4gIH0sXG5cbiAgdGFrZVdoaWxlOiBmdW5jdGlvbiB0YWtlV2hpbGUocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHRha2VXaGlsZUZhY3RvcnkodGhpcywgcHJlZGljYXRlLCBjb250ZXh0KSk7XG4gIH0sXG5cbiAgdGFrZVVudGlsOiBmdW5jdGlvbiB0YWtlVW50aWwocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgcmV0dXJuIHRoaXMudGFrZVdoaWxlKG5vdChwcmVkaWNhdGUpLCBjb250ZXh0KTtcbiAgfSxcblxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShmbikge1xuICAgIHJldHVybiBmbih0aGlzKTtcbiAgfSxcblxuICB2YWx1ZVNlcTogZnVuY3Rpb24gdmFsdWVTZXEoKSB7XG4gICAgcmV0dXJuIHRoaXMudG9JbmRleGVkU2VxKCk7XG4gIH0sXG5cbiAgLy8gIyMjIEhhc2hhYmxlIE9iamVjdFxuXG4gIGhhc2hDb2RlOiBmdW5jdGlvbiBoYXNoQ29kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fX2hhc2ggfHwgKHRoaXMuX19oYXNoID0gaGFzaENvbGxlY3Rpb24odGhpcykpO1xuICB9LFxuXG4gIC8vICMjIyBJbnRlcm5hbFxuXG4gIC8vIGFic3RyYWN0IF9faXRlcmF0ZShmbiwgcmV2ZXJzZSlcblxuICAvLyBhYnN0cmFjdCBfX2l0ZXJhdG9yKHR5cGUsIHJldmVyc2UpXG59KTtcblxudmFyIENvbGxlY3Rpb25Qcm90b3R5cGUgPSBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbkNvbGxlY3Rpb25Qcm90b3R5cGVbSVNfQ09MTEVDVElPTl9TWU1CT0xdID0gdHJ1ZTtcbkNvbGxlY3Rpb25Qcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IENvbGxlY3Rpb25Qcm90b3R5cGUudmFsdWVzO1xuQ29sbGVjdGlvblByb3RvdHlwZS50b0pTT04gPSBDb2xsZWN0aW9uUHJvdG90eXBlLnRvQXJyYXk7XG5Db2xsZWN0aW9uUHJvdG90eXBlLl9fdG9TdHJpbmdNYXBwZXIgPSBxdW90ZVN0cmluZztcbkNvbGxlY3Rpb25Qcm90b3R5cGUuaW5zcGVjdCA9IENvbGxlY3Rpb25Qcm90b3R5cGUudG9Tb3VyY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG59O1xuQ29sbGVjdGlvblByb3RvdHlwZS5jaGFpbiA9IENvbGxlY3Rpb25Qcm90b3R5cGUuZmxhdE1hcDtcbkNvbGxlY3Rpb25Qcm90b3R5cGUuY29udGFpbnMgPSBDb2xsZWN0aW9uUHJvdG90eXBlLmluY2x1ZGVzO1xuXG5taXhpbihLZXllZENvbGxlY3Rpb24sIHtcbiAgLy8gIyMjIE1vcmUgc2VxdWVudGlhbCBtZXRob2RzXG5cbiAgZmxpcDogZnVuY3Rpb24gZmxpcCgpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgZmxpcEZhY3RvcnkodGhpcykpO1xuICB9LFxuXG4gIG1hcEVudHJpZXM6IGZ1bmN0aW9uIG1hcEVudHJpZXMobWFwcGVyLCBjb250ZXh0KSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHZhciBpdGVyYXRpb25zID0gMDtcbiAgICByZXR1cm4gcmVpZnkoXG4gICAgICB0aGlzLFxuICAgICAgdGhpcy50b1NlcSgpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIFtrLCB2XSwgaXRlcmF0aW9ucysrLCB0aGlzJDEkMSk7IH0pXG4gICAgICAgIC5mcm9tRW50cnlTZXEoKVxuICAgICk7XG4gIH0sXG5cbiAgbWFwS2V5czogZnVuY3Rpb24gbWFwS2V5cyhtYXBwZXIsIGNvbnRleHQpIHtcbiAgICB2YXIgdGhpcyQxJDEgPSB0aGlzO1xuXG4gICAgcmV0dXJuIHJlaWZ5KFxuICAgICAgdGhpcyxcbiAgICAgIHRoaXMudG9TZXEoKVxuICAgICAgICAuZmxpcCgpXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGssIHYpIHsgcmV0dXJuIG1hcHBlci5jYWxsKGNvbnRleHQsIGssIHYsIHRoaXMkMSQxKTsgfSlcbiAgICAgICAgLmZsaXAoKVxuICAgICk7XG4gIH0sXG59KTtcblxudmFyIEtleWVkQ29sbGVjdGlvblByb3RvdHlwZSA9IEtleWVkQ29sbGVjdGlvbi5wcm90b3R5cGU7XG5LZXllZENvbGxlY3Rpb25Qcm90b3R5cGVbSVNfS0VZRURfU1lNQk9MXSA9IHRydWU7XG5LZXllZENvbGxlY3Rpb25Qcm90b3R5cGVbSVRFUkFUT1JfU1lNQk9MXSA9IENvbGxlY3Rpb25Qcm90b3R5cGUuZW50cmllcztcbktleWVkQ29sbGVjdGlvblByb3RvdHlwZS50b0pTT04gPSB0b09iamVjdDtcbktleWVkQ29sbGVjdGlvblByb3RvdHlwZS5fX3RvU3RyaW5nTWFwcGVyID0gZnVuY3Rpb24gKHYsIGspIHsgcmV0dXJuIHF1b3RlU3RyaW5nKGspICsgJzogJyArIHF1b3RlU3RyaW5nKHYpOyB9O1xuXG5taXhpbihJbmRleGVkQ29sbGVjdGlvbiwge1xuICAvLyAjIyMgQ29udmVyc2lvbiB0byBvdGhlciB0eXBlc1xuXG4gIHRvS2V5ZWRTZXE6IGZ1bmN0aW9uIHRvS2V5ZWRTZXEoKSB7XG4gICAgcmV0dXJuIG5ldyBUb0tleWVkU2VxdWVuY2UodGhpcywgZmFsc2UpO1xuICB9LFxuXG4gIC8vICMjIyBFUzYgQ29sbGVjdGlvbiBtZXRob2RzIChFUzYgQXJyYXkgYW5kIE1hcClcblxuICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihwcmVkaWNhdGUsIGNvbnRleHQpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgZmlsdGVyRmFjdG9yeSh0aGlzLCBwcmVkaWNhdGUsIGNvbnRleHQsIGZhbHNlKSk7XG4gIH0sXG5cbiAgZmluZEluZGV4OiBmdW5jdGlvbiBmaW5kSW5kZXgocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kRW50cnkocHJlZGljYXRlLCBjb250ZXh0KTtcbiAgICByZXR1cm4gZW50cnkgPyBlbnRyeVswXSA6IC0xO1xuICB9LFxuXG4gIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2Yoc2VhcmNoVmFsdWUpIHtcbiAgICB2YXIga2V5ID0gdGhpcy5rZXlPZihzZWFyY2hWYWx1ZSk7XG4gICAgcmV0dXJuIGtleSA9PT0gdW5kZWZpbmVkID8gLTEgOiBrZXk7XG4gIH0sXG5cbiAgbGFzdEluZGV4T2Y6IGZ1bmN0aW9uIGxhc3RJbmRleE9mKHNlYXJjaFZhbHVlKSB7XG4gICAgdmFyIGtleSA9IHRoaXMubGFzdEtleU9mKHNlYXJjaFZhbHVlKTtcbiAgICByZXR1cm4ga2V5ID09PSB1bmRlZmluZWQgPyAtMSA6IGtleTtcbiAgfSxcblxuICByZXZlcnNlOiBmdW5jdGlvbiByZXZlcnNlKCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCByZXZlcnNlRmFjdG9yeSh0aGlzLCBmYWxzZSkpO1xuICB9LFxuXG4gIHNsaWNlOiBmdW5jdGlvbiBzbGljZShiZWdpbiwgZW5kKSB7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHNsaWNlRmFjdG9yeSh0aGlzLCBiZWdpbiwgZW5kLCBmYWxzZSkpO1xuICB9LFxuXG4gIHNwbGljZTogZnVuY3Rpb24gc3BsaWNlKGluZGV4LCByZW1vdmVOdW0gLyosIC4uLnZhbHVlcyovKSB7XG4gICAgdmFyIG51bUFyZ3MgPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHJlbW92ZU51bSA9IE1hdGgubWF4KHJlbW92ZU51bSB8fCAwLCAwKTtcbiAgICBpZiAobnVtQXJncyA9PT0gMCB8fCAobnVtQXJncyA9PT0gMiAmJiAhcmVtb3ZlTnVtKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8vIElmIGluZGV4IGlzIG5lZ2F0aXZlLCBpdCBzaG91bGQgcmVzb2x2ZSByZWxhdGl2ZSB0byB0aGUgc2l6ZSBvZiB0aGVcbiAgICAvLyBjb2xsZWN0aW9uLiBIb3dldmVyIHNpemUgbWF5IGJlIGV4cGVuc2l2ZSB0byBjb21wdXRlIGlmIG5vdCBjYWNoZWQsIHNvXG4gICAgLy8gb25seSBjYWxsIGNvdW50KCkgaWYgdGhlIG51bWJlciBpcyBpbiBmYWN0IG5lZ2F0aXZlLlxuICAgIGluZGV4ID0gcmVzb2x2ZUJlZ2luKGluZGV4LCBpbmRleCA8IDAgPyB0aGlzLmNvdW50KCkgOiB0aGlzLnNpemUpO1xuICAgIHZhciBzcGxpY2VkID0gdGhpcy5zbGljZSgwLCBpbmRleCk7XG4gICAgcmV0dXJuIHJlaWZ5KFxuICAgICAgdGhpcyxcbiAgICAgIG51bUFyZ3MgPT09IDFcbiAgICAgICAgPyBzcGxpY2VkXG4gICAgICAgIDogc3BsaWNlZC5jb25jYXQoYXJyQ29weShhcmd1bWVudHMsIDIpLCB0aGlzLnNsaWNlKGluZGV4ICsgcmVtb3ZlTnVtKSlcbiAgICApO1xuICB9LFxuXG4gIC8vICMjIyBNb3JlIGNvbGxlY3Rpb24gbWV0aG9kc1xuXG4gIGZpbmRMYXN0SW5kZXg6IGZ1bmN0aW9uIGZpbmRMYXN0SW5kZXgocHJlZGljYXRlLCBjb250ZXh0KSB7XG4gICAgdmFyIGVudHJ5ID0gdGhpcy5maW5kTGFzdEVudHJ5KHByZWRpY2F0ZSwgY29udGV4dCk7XG4gICAgcmV0dXJuIGVudHJ5ID8gZW50cnlbMF0gOiAtMTtcbiAgfSxcblxuICBmaXJzdDogZnVuY3Rpb24gZmlyc3Qobm90U2V0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5nZXQoMCwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIGZsYXR0ZW46IGZ1bmN0aW9uIGZsYXR0ZW4oZGVwdGgpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgZmxhdHRlbkZhY3RvcnkodGhpcywgZGVwdGgsIGZhbHNlKSk7XG4gIH0sXG5cbiAgZ2V0OiBmdW5jdGlvbiBnZXQoaW5kZXgsIG5vdFNldFZhbHVlKSB7XG4gICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgIHJldHVybiBpbmRleCA8IDAgfHxcbiAgICAgIHRoaXMuc2l6ZSA9PT0gSW5maW5pdHkgfHxcbiAgICAgICh0aGlzLnNpemUgIT09IHVuZGVmaW5lZCAmJiBpbmRleCA+IHRoaXMuc2l6ZSlcbiAgICAgID8gbm90U2V0VmFsdWVcbiAgICAgIDogdGhpcy5maW5kKGZ1bmN0aW9uIChfLCBrZXkpIHsgcmV0dXJuIGtleSA9PT0gaW5kZXg7IH0sIHVuZGVmaW5lZCwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIGhhczogZnVuY3Rpb24gaGFzKGluZGV4KSB7XG4gICAgaW5kZXggPSB3cmFwSW5kZXgodGhpcywgaW5kZXgpO1xuICAgIHJldHVybiAoXG4gICAgICBpbmRleCA+PSAwICYmXG4gICAgICAodGhpcy5zaXplICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyB0aGlzLnNpemUgPT09IEluZmluaXR5IHx8IGluZGV4IDwgdGhpcy5zaXplXG4gICAgICAgIDogdGhpcy5pbmRleE9mKGluZGV4KSAhPT0gLTEpXG4gICAgKTtcbiAgfSxcblxuICBpbnRlcnBvc2U6IGZ1bmN0aW9uIGludGVycG9zZShzZXBhcmF0b3IpIHtcbiAgICByZXR1cm4gcmVpZnkodGhpcywgaW50ZXJwb3NlRmFjdG9yeSh0aGlzLCBzZXBhcmF0b3IpKTtcbiAgfSxcblxuICBpbnRlcmxlYXZlOiBmdW5jdGlvbiBpbnRlcmxlYXZlKC8qLi4uY29sbGVjdGlvbnMqLykge1xuICAgIHZhciBjb2xsZWN0aW9ucyA9IFt0aGlzXS5jb25jYXQoYXJyQ29weShhcmd1bWVudHMpKTtcbiAgICB2YXIgemlwcGVkID0gemlwV2l0aEZhY3RvcnkodGhpcy50b1NlcSgpLCBJbmRleGVkU2VxLm9mLCBjb2xsZWN0aW9ucyk7XG4gICAgdmFyIGludGVybGVhdmVkID0gemlwcGVkLmZsYXR0ZW4odHJ1ZSk7XG4gICAgaWYgKHppcHBlZC5zaXplKSB7XG4gICAgICBpbnRlcmxlYXZlZC5zaXplID0gemlwcGVkLnNpemUgKiBjb2xsZWN0aW9ucy5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiByZWlmeSh0aGlzLCBpbnRlcmxlYXZlZCk7XG4gIH0sXG5cbiAga2V5U2VxOiBmdW5jdGlvbiBrZXlTZXEoKSB7XG4gICAgcmV0dXJuIFJhbmdlKDAsIHRoaXMuc2l6ZSk7XG4gIH0sXG5cbiAgbGFzdDogZnVuY3Rpb24gbGFzdChub3RTZXRWYWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmdldCgtMSwgbm90U2V0VmFsdWUpO1xuICB9LFxuXG4gIHNraXBXaGlsZTogZnVuY3Rpb24gc2tpcFdoaWxlKHByZWRpY2F0ZSwgY29udGV4dCkge1xuICAgIHJldHVybiByZWlmeSh0aGlzLCBza2lwV2hpbGVGYWN0b3J5KHRoaXMsIHByZWRpY2F0ZSwgY29udGV4dCwgZmFsc2UpKTtcbiAgfSxcblxuICB6aXA6IGZ1bmN0aW9uIHppcCgvKiwgLi4uY29sbGVjdGlvbnMgKi8pIHtcbiAgICB2YXIgY29sbGVjdGlvbnMgPSBbdGhpc10uY29uY2F0KGFyckNvcHkoYXJndW1lbnRzKSk7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHppcFdpdGhGYWN0b3J5KHRoaXMsIGRlZmF1bHRaaXBwZXIsIGNvbGxlY3Rpb25zKSk7XG4gIH0sXG5cbiAgemlwQWxsOiBmdW5jdGlvbiB6aXBBbGwoLyosIC4uLmNvbGxlY3Rpb25zICovKSB7XG4gICAgdmFyIGNvbGxlY3Rpb25zID0gW3RoaXNdLmNvbmNhdChhcnJDb3B5KGFyZ3VtZW50cykpO1xuICAgIHJldHVybiByZWlmeSh0aGlzLCB6aXBXaXRoRmFjdG9yeSh0aGlzLCBkZWZhdWx0WmlwcGVyLCBjb2xsZWN0aW9ucywgdHJ1ZSkpO1xuICB9LFxuXG4gIHppcFdpdGg6IGZ1bmN0aW9uIHppcFdpdGgoemlwcGVyIC8qLCAuLi5jb2xsZWN0aW9ucyAqLykge1xuICAgIHZhciBjb2xsZWN0aW9ucyA9IGFyckNvcHkoYXJndW1lbnRzKTtcbiAgICBjb2xsZWN0aW9uc1swXSA9IHRoaXM7XG4gICAgcmV0dXJuIHJlaWZ5KHRoaXMsIHppcFdpdGhGYWN0b3J5KHRoaXMsIHppcHBlciwgY29sbGVjdGlvbnMpKTtcbiAgfSxcbn0pO1xuXG52YXIgSW5kZXhlZENvbGxlY3Rpb25Qcm90b3R5cGUgPSBJbmRleGVkQ29sbGVjdGlvbi5wcm90b3R5cGU7XG5JbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZVtJU19JTkRFWEVEX1NZTUJPTF0gPSB0cnVlO1xuSW5kZXhlZENvbGxlY3Rpb25Qcm90b3R5cGVbSVNfT1JERVJFRF9TWU1CT0xdID0gdHJ1ZTtcblxubWl4aW4oU2V0Q29sbGVjdGlvbiwge1xuICAvLyAjIyMgRVM2IENvbGxlY3Rpb24gbWV0aG9kcyAoRVM2IEFycmF5IGFuZCBNYXApXG5cbiAgZ2V0OiBmdW5jdGlvbiBnZXQodmFsdWUsIG5vdFNldFZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKHZhbHVlKSA/IHZhbHVlIDogbm90U2V0VmFsdWU7XG4gIH0sXG5cbiAgaW5jbHVkZXM6IGZ1bmN0aW9uIGluY2x1ZGVzKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzKHZhbHVlKTtcbiAgfSxcblxuICAvLyAjIyMgTW9yZSBzZXF1ZW50aWFsIG1ldGhvZHNcblxuICBrZXlTZXE6IGZ1bmN0aW9uIGtleVNlcSgpIHtcbiAgICByZXR1cm4gdGhpcy52YWx1ZVNlcSgpO1xuICB9LFxufSk7XG5cbnZhciBTZXRDb2xsZWN0aW9uUHJvdG90eXBlID0gU2V0Q29sbGVjdGlvbi5wcm90b3R5cGU7XG5TZXRDb2xsZWN0aW9uUHJvdG90eXBlLmhhcyA9IENvbGxlY3Rpb25Qcm90b3R5cGUuaW5jbHVkZXM7XG5TZXRDb2xsZWN0aW9uUHJvdG90eXBlLmNvbnRhaW5zID0gU2V0Q29sbGVjdGlvblByb3RvdHlwZS5pbmNsdWRlcztcblNldENvbGxlY3Rpb25Qcm90b3R5cGUua2V5cyA9IFNldENvbGxlY3Rpb25Qcm90b3R5cGUudmFsdWVzO1xuXG4vLyBNaXhpbiBzdWJjbGFzc2VzXG5cbm1peGluKEtleWVkU2VxLCBLZXllZENvbGxlY3Rpb25Qcm90b3R5cGUpO1xubWl4aW4oSW5kZXhlZFNlcSwgSW5kZXhlZENvbGxlY3Rpb25Qcm90b3R5cGUpO1xubWl4aW4oU2V0U2VxLCBTZXRDb2xsZWN0aW9uUHJvdG90eXBlKTtcblxuLy8gI3ByYWdtYSBIZWxwZXIgZnVuY3Rpb25zXG5cbmZ1bmN0aW9uIHJlZHVjZShjb2xsZWN0aW9uLCByZWR1Y2VyLCByZWR1Y3Rpb24sIGNvbnRleHQsIHVzZUZpcnN0LCByZXZlcnNlKSB7XG4gIGFzc2VydE5vdEluZmluaXRlKGNvbGxlY3Rpb24uc2l6ZSk7XG4gIGNvbGxlY3Rpb24uX19pdGVyYXRlKGZ1bmN0aW9uICh2LCBrLCBjKSB7XG4gICAgaWYgKHVzZUZpcnN0KSB7XG4gICAgICB1c2VGaXJzdCA9IGZhbHNlO1xuICAgICAgcmVkdWN0aW9uID0gdjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVkdWN0aW9uID0gcmVkdWNlci5jYWxsKGNvbnRleHQsIHJlZHVjdGlvbiwgdiwgaywgYyk7XG4gICAgfVxuICB9LCByZXZlcnNlKTtcbiAgcmV0dXJuIHJlZHVjdGlvbjtcbn1cblxuZnVuY3Rpb24ga2V5TWFwcGVyKHYsIGspIHtcbiAgcmV0dXJuIGs7XG59XG5cbmZ1bmN0aW9uIGVudHJ5TWFwcGVyKHYsIGspIHtcbiAgcmV0dXJuIFtrLCB2XTtcbn1cblxuZnVuY3Rpb24gbm90KHByZWRpY2F0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiAhcHJlZGljYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIG5lZyhwcmVkaWNhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gLXByZWRpY2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0WmlwcGVyKCkge1xuICByZXR1cm4gYXJyQ29weShhcmd1bWVudHMpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0TmVnQ29tcGFyYXRvcihhLCBiKSB7XG4gIHJldHVybiBhIDwgYiA/IDEgOiBhID4gYiA/IC0xIDogMDtcbn1cblxuZnVuY3Rpb24gaGFzaENvbGxlY3Rpb24oY29sbGVjdGlvbikge1xuICBpZiAoY29sbGVjdGlvbi5zaXplID09PSBJbmZpbml0eSkge1xuICAgIHJldHVybiAwO1xuICB9XG4gIHZhciBvcmRlcmVkID0gaXNPcmRlcmVkKGNvbGxlY3Rpb24pO1xuICB2YXIga2V5ZWQgPSBpc0tleWVkKGNvbGxlY3Rpb24pO1xuICB2YXIgaCA9IG9yZGVyZWQgPyAxIDogMDtcbiAgdmFyIHNpemUgPSBjb2xsZWN0aW9uLl9faXRlcmF0ZShcbiAgICBrZXllZFxuICAgICAgPyBvcmRlcmVkXG4gICAgICAgID8gZnVuY3Rpb24gKHYsIGspIHtcbiAgICAgICAgICAgIGggPSAoMzEgKiBoICsgaGFzaE1lcmdlKGhhc2godiksIGhhc2goaykpKSB8IDA7XG4gICAgICAgICAgfVxuICAgICAgICA6IGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgICAgICBoID0gKGggKyBoYXNoTWVyZ2UoaGFzaCh2KSwgaGFzaChrKSkpIHwgMDtcbiAgICAgICAgICB9XG4gICAgICA6IG9yZGVyZWRcbiAgICAgID8gZnVuY3Rpb24gKHYpIHtcbiAgICAgICAgICBoID0gKDMxICogaCArIGhhc2godikpIHwgMDtcbiAgICAgICAgfVxuICAgICAgOiBmdW5jdGlvbiAodikge1xuICAgICAgICAgIGggPSAoaCArIGhhc2godikpIHwgMDtcbiAgICAgICAgfVxuICApO1xuICByZXR1cm4gbXVybXVySGFzaE9mU2l6ZShzaXplLCBoKTtcbn1cblxuZnVuY3Rpb24gbXVybXVySGFzaE9mU2l6ZShzaXplLCBoKSB7XG4gIGggPSBpbXVsKGgsIDB4Y2M5ZTJkNTEpO1xuICBoID0gaW11bCgoaCA8PCAxNSkgfCAoaCA+Pj4gLTE1KSwgMHgxYjg3MzU5Myk7XG4gIGggPSBpbXVsKChoIDw8IDEzKSB8IChoID4+PiAtMTMpLCA1KTtcbiAgaCA9ICgoaCArIDB4ZTY1NDZiNjQpIHwgMCkgXiBzaXplO1xuICBoID0gaW11bChoIF4gKGggPj4+IDE2KSwgMHg4NWViY2E2Yik7XG4gIGggPSBpbXVsKGggXiAoaCA+Pj4gMTMpLCAweGMyYjJhZTM1KTtcbiAgaCA9IHNtaShoIF4gKGggPj4+IDE2KSk7XG4gIHJldHVybiBoO1xufVxuXG5mdW5jdGlvbiBoYXNoTWVyZ2UoYSwgYikge1xuICByZXR1cm4gKGEgXiAoYiArIDB4OWUzNzc5YjkgKyAoYSA8PCA2KSArIChhID4+IDIpKSkgfCAwOyAvLyBpbnRcbn1cblxudmFyIE9yZGVyZWRTZXQgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChTZXQpIHtcbiAgZnVuY3Rpb24gT3JkZXJlZFNldCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdW5kZWZpbmVkXG4gICAgICA/IGVtcHR5T3JkZXJlZFNldCgpXG4gICAgICA6IGlzT3JkZXJlZFNldCh2YWx1ZSlcbiAgICAgID8gdmFsdWVcbiAgICAgIDogZW1wdHlPcmRlcmVkU2V0KCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAoc2V0KSB7XG4gICAgICAgICAgdmFyIGl0ZXIgPSBTZXRDb2xsZWN0aW9uKHZhbHVlKTtcbiAgICAgICAgICBhc3NlcnROb3RJbmZpbml0ZShpdGVyLnNpemUpO1xuICAgICAgICAgIGl0ZXIuZm9yRWFjaChmdW5jdGlvbiAodikgeyByZXR1cm4gc2V0LmFkZCh2KTsgfSk7XG4gICAgICAgIH0pO1xuICB9XG5cbiAgaWYgKCBTZXQgKSBPcmRlcmVkU2V0Ll9fcHJvdG9fXyA9IFNldDtcbiAgT3JkZXJlZFNldC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKCBTZXQgJiYgU2V0LnByb3RvdHlwZSApO1xuICBPcmRlcmVkU2V0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE9yZGVyZWRTZXQ7XG5cbiAgT3JkZXJlZFNldC5vZiA9IGZ1bmN0aW9uIG9mICgvKi4uLnZhbHVlcyovKSB7XG4gICAgcmV0dXJuIHRoaXMoYXJndW1lbnRzKTtcbiAgfTtcblxuICBPcmRlcmVkU2V0LmZyb21LZXlzID0gZnVuY3Rpb24gZnJvbUtleXMgKHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMoS2V5ZWRDb2xsZWN0aW9uKHZhbHVlKS5rZXlTZXEoKSk7XG4gIH07XG5cbiAgT3JkZXJlZFNldC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gICAgcmV0dXJuIHRoaXMuX190b1N0cmluZygnT3JkZXJlZFNldCB7JywgJ30nKTtcbiAgfTtcblxuICByZXR1cm4gT3JkZXJlZFNldDtcbn0oU2V0KSk7XG5cbk9yZGVyZWRTZXQuaXNPcmRlcmVkU2V0ID0gaXNPcmRlcmVkU2V0O1xuXG52YXIgT3JkZXJlZFNldFByb3RvdHlwZSA9IE9yZGVyZWRTZXQucHJvdG90eXBlO1xuT3JkZXJlZFNldFByb3RvdHlwZVtJU19PUkRFUkVEX1NZTUJPTF0gPSB0cnVlO1xuT3JkZXJlZFNldFByb3RvdHlwZS56aXAgPSBJbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZS56aXA7XG5PcmRlcmVkU2V0UHJvdG90eXBlLnppcFdpdGggPSBJbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZS56aXBXaXRoO1xuT3JkZXJlZFNldFByb3RvdHlwZS56aXBBbGwgPSBJbmRleGVkQ29sbGVjdGlvblByb3RvdHlwZS56aXBBbGw7XG5cbk9yZGVyZWRTZXRQcm90b3R5cGUuX19lbXB0eSA9IGVtcHR5T3JkZXJlZFNldDtcbk9yZGVyZWRTZXRQcm90b3R5cGUuX19tYWtlID0gbWFrZU9yZGVyZWRTZXQ7XG5cbmZ1bmN0aW9uIG1ha2VPcmRlcmVkU2V0KG1hcCwgb3duZXJJRCkge1xuICB2YXIgc2V0ID0gT2JqZWN0LmNyZWF0ZShPcmRlcmVkU2V0UHJvdG90eXBlKTtcbiAgc2V0LnNpemUgPSBtYXAgPyBtYXAuc2l6ZSA6IDA7XG4gIHNldC5fbWFwID0gbWFwO1xuICBzZXQuX19vd25lcklEID0gb3duZXJJRDtcbiAgcmV0dXJuIHNldDtcbn1cblxudmFyIEVNUFRZX09SREVSRURfU0VUO1xuZnVuY3Rpb24gZW1wdHlPcmRlcmVkU2V0KCkge1xuICByZXR1cm4gKFxuICAgIEVNUFRZX09SREVSRURfU0VUIHx8IChFTVBUWV9PUkRFUkVEX1NFVCA9IG1ha2VPcmRlcmVkU2V0KGVtcHR5T3JkZXJlZE1hcCgpKSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gdGhyb3dPbkludmFsaWREZWZhdWx0VmFsdWVzKGRlZmF1bHRWYWx1ZXMpIHtcbiAgaWYgKGlzUmVjb3JkKGRlZmF1bHRWYWx1ZXMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0NhbiBub3QgY2FsbCBgUmVjb3JkYCB3aXRoIGFuIGltbXV0YWJsZSBSZWNvcmQgYXMgZGVmYXVsdCB2YWx1ZXMuIFVzZSBhIHBsYWluIGphdmFzY3JpcHQgb2JqZWN0IGluc3RlYWQuJ1xuICAgICk7XG4gIH1cblxuICBpZiAoaXNJbW11dGFibGUoZGVmYXVsdFZhbHVlcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQ2FuIG5vdCBjYWxsIGBSZWNvcmRgIHdpdGggYW4gaW1tdXRhYmxlIENvbGxlY3Rpb24gYXMgZGVmYXVsdCB2YWx1ZXMuIFVzZSBhIHBsYWluIGphdmFzY3JpcHQgb2JqZWN0IGluc3RlYWQuJ1xuICAgICk7XG4gIH1cblxuICBpZiAoZGVmYXVsdFZhbHVlcyA9PT0gbnVsbCB8fCB0eXBlb2YgZGVmYXVsdFZhbHVlcyAhPT0gJ29iamVjdCcpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAnQ2FuIG5vdCBjYWxsIGBSZWNvcmRgIHdpdGggYSBub24tb2JqZWN0IGFzIGRlZmF1bHQgdmFsdWVzLiBVc2UgYSBwbGFpbiBqYXZhc2NyaXB0IG9iamVjdCBpbnN0ZWFkLidcbiAgICApO1xuICB9XG59XG5cbnZhciBSZWNvcmQgPSBmdW5jdGlvbiBSZWNvcmQoZGVmYXVsdFZhbHVlcywgbmFtZSkge1xuICB2YXIgaGFzSW5pdGlhbGl6ZWQ7XG5cbiAgdGhyb3dPbkludmFsaWREZWZhdWx0VmFsdWVzKGRlZmF1bHRWYWx1ZXMpO1xuXG4gIHZhciBSZWNvcmRUeXBlID0gZnVuY3Rpb24gUmVjb3JkKHZhbHVlcykge1xuICAgIHZhciB0aGlzJDEkMSA9IHRoaXM7XG5cbiAgICBpZiAodmFsdWVzIGluc3RhbmNlb2YgUmVjb3JkVHlwZSkge1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFJlY29yZFR5cGUpKSB7XG4gICAgICByZXR1cm4gbmV3IFJlY29yZFR5cGUodmFsdWVzKTtcbiAgICB9XG4gICAgaWYgKCFoYXNJbml0aWFsaXplZCkge1xuICAgICAgaGFzSW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhkZWZhdWx0VmFsdWVzKTtcbiAgICAgIHZhciBpbmRpY2VzID0gKFJlY29yZFR5cGVQcm90b3R5cGUuX2luZGljZXMgPSB7fSk7XG4gICAgICAvLyBEZXByZWNhdGVkOiBsZWZ0IHRvIGF0dGVtcHQgbm90IHRvIGJyZWFrIGFueSBleHRlcm5hbCBjb2RlIHdoaWNoXG4gICAgICAvLyByZWxpZXMgb24gYSAuX25hbWUgcHJvcGVydHkgZXhpc3Rpbmcgb24gcmVjb3JkIGluc3RhbmNlcy5cbiAgICAgIC8vIFVzZSBSZWNvcmQuZ2V0RGVzY3JpcHRpdmVOYW1lKCkgaW5zdGVhZFxuICAgICAgUmVjb3JkVHlwZVByb3RvdHlwZS5fbmFtZSA9IG5hbWU7XG4gICAgICBSZWNvcmRUeXBlUHJvdG90eXBlLl9rZXlzID0ga2V5cztcbiAgICAgIFJlY29yZFR5cGVQcm90b3R5cGUuX2RlZmF1bHRWYWx1ZXMgPSBkZWZhdWx0VmFsdWVzO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBwcm9wTmFtZSA9IGtleXNbaV07XG4gICAgICAgIGluZGljZXNbcHJvcE5hbWVdID0gaTtcbiAgICAgICAgaWYgKFJlY29yZFR5cGVQcm90b3R5cGVbcHJvcE5hbWVdKSB7XG4gICAgICAgICAgLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuICAgICAgICAgIHR5cGVvZiBjb25zb2xlID09PSAnb2JqZWN0JyAmJlxuICAgICAgICAgICAgY29uc29sZS53YXJuICYmXG4gICAgICAgICAgICBjb25zb2xlLndhcm4oXG4gICAgICAgICAgICAgICdDYW5ub3QgZGVmaW5lICcgK1xuICAgICAgICAgICAgICAgIHJlY29yZE5hbWUodGhpcykgK1xuICAgICAgICAgICAgICAgICcgd2l0aCBwcm9wZXJ0eSBcIicgK1xuICAgICAgICAgICAgICAgIHByb3BOYW1lICtcbiAgICAgICAgICAgICAgICAnXCIgc2luY2UgdGhhdCBwcm9wZXJ0eSBuYW1lIGlzIHBhcnQgb2YgdGhlIFJlY29yZCBBUEkuJ1xuICAgICAgICAgICAgKTtcbiAgICAgICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzZXRQcm9wKFJlY29yZFR5cGVQcm90b3R5cGUsIHByb3BOYW1lKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9fb3duZXJJRCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl92YWx1ZXMgPSBMaXN0KCkud2l0aE11dGF0aW9ucyhmdW5jdGlvbiAobCkge1xuICAgICAgbC5zZXRTaXplKHRoaXMkMSQxLl9rZXlzLmxlbmd0aCk7XG4gICAgICBLZXllZENvbGxlY3Rpb24odmFsdWVzKS5mb3JFYWNoKGZ1bmN0aW9uICh2LCBrKSB7XG4gICAgICAgIGwuc2V0KHRoaXMkMSQxLl9pbmRpY2VzW2tdLCB2ID09PSB0aGlzJDEkMS5fZGVmYXVsdFZhbHVlc1trXSA/IHVuZGVmaW5lZCA6IHYpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgdmFyIFJlY29yZFR5cGVQcm90b3R5cGUgPSAoUmVjb3JkVHlwZS5wcm90b3R5cGUgPVxuICAgIE9iamVjdC5jcmVhdGUoUmVjb3JkUHJvdG90eXBlKSk7XG4gIFJlY29yZFR5cGVQcm90b3R5cGUuY29uc3RydWN0b3IgPSBSZWNvcmRUeXBlO1xuXG4gIGlmIChuYW1lKSB7XG4gICAgUmVjb3JkVHlwZS5kaXNwbGF5TmFtZSA9IG5hbWU7XG4gIH1cblxuICByZXR1cm4gUmVjb3JkVHlwZTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZyAoKSB7XG4gIHZhciBzdHIgPSByZWNvcmROYW1lKHRoaXMpICsgJyB7ICc7XG4gIHZhciBrZXlzID0gdGhpcy5fa2V5cztcbiAgdmFyIGs7XG4gIGZvciAodmFyIGkgPSAwLCBsID0ga2V5cy5sZW5ndGg7IGkgIT09IGw7IGkrKykge1xuICAgIGsgPSBrZXlzW2ldO1xuICAgIHN0ciArPSAoaSA/ICcsICcgOiAnJykgKyBrICsgJzogJyArIHF1b3RlU3RyaW5nKHRoaXMuZ2V0KGspKTtcbiAgfVxuICByZXR1cm4gc3RyICsgJyB9Jztcbn07XG5cblJlY29yZC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChvdGhlcikge1xuICByZXR1cm4gKFxuICAgIHRoaXMgPT09IG90aGVyIHx8IChvdGhlciAmJiByZWNvcmRTZXEodGhpcykuZXF1YWxzKHJlY29yZFNlcShvdGhlcikpKVxuICApO1xufTtcblxuUmVjb3JkLnByb3RvdHlwZS5oYXNoQ29kZSA9IGZ1bmN0aW9uIGhhc2hDb2RlICgpIHtcbiAgcmV0dXJuIHJlY29yZFNlcSh0aGlzKS5oYXNoQ29kZSgpO1xufTtcblxuLy8gQHByYWdtYSBBY2Nlc3NcblxuUmVjb3JkLnByb3RvdHlwZS5oYXMgPSBmdW5jdGlvbiBoYXMgKGspIHtcbiAgcmV0dXJuIHRoaXMuX2luZGljZXMuaGFzT3duUHJvcGVydHkoayk7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIGdldCAoaywgbm90U2V0VmFsdWUpIHtcbiAgaWYgKCF0aGlzLmhhcyhrKSkge1xuICAgIHJldHVybiBub3RTZXRWYWx1ZTtcbiAgfVxuICB2YXIgaW5kZXggPSB0aGlzLl9pbmRpY2VzW2tdO1xuICB2YXIgdmFsdWUgPSB0aGlzLl92YWx1ZXMuZ2V0KGluZGV4KTtcbiAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB0aGlzLl9kZWZhdWx0VmFsdWVzW2tdIDogdmFsdWU7XG59O1xuXG4vLyBAcHJhZ21hIE1vZGlmaWNhdGlvblxuXG5SZWNvcmQucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uIHNldCAoaywgdikge1xuICBpZiAodGhpcy5oYXMoaykpIHtcbiAgICB2YXIgbmV3VmFsdWVzID0gdGhpcy5fdmFsdWVzLnNldChcbiAgICAgIHRoaXMuX2luZGljZXNba10sXG4gICAgICB2ID09PSB0aGlzLl9kZWZhdWx0VmFsdWVzW2tdID8gdW5kZWZpbmVkIDogdlxuICAgICk7XG4gICAgaWYgKG5ld1ZhbHVlcyAhPT0gdGhpcy5fdmFsdWVzICYmICF0aGlzLl9fb3duZXJJRCkge1xuICAgICAgcmV0dXJuIG1ha2VSZWNvcmQodGhpcywgbmV3VmFsdWVzKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uIHJlbW92ZSAoaykge1xuICByZXR1cm4gdGhpcy5zZXQoayk7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gY2xlYXIgKCkge1xuICB2YXIgbmV3VmFsdWVzID0gdGhpcy5fdmFsdWVzLmNsZWFyKCkuc2V0U2l6ZSh0aGlzLl9rZXlzLmxlbmd0aCk7XG5cbiAgcmV0dXJuIHRoaXMuX19vd25lcklEID8gdGhpcyA6IG1ha2VSZWNvcmQodGhpcywgbmV3VmFsdWVzKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUud2FzQWx0ZXJlZCA9IGZ1bmN0aW9uIHdhc0FsdGVyZWQgKCkge1xuICByZXR1cm4gdGhpcy5fdmFsdWVzLndhc0FsdGVyZWQoKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUudG9TZXEgPSBmdW5jdGlvbiB0b1NlcSAoKSB7XG4gIHJldHVybiByZWNvcmRTZXEodGhpcyk7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLnRvSlMgPSBmdW5jdGlvbiB0b0pTJDEgKCkge1xuICByZXR1cm4gdG9KUyh0aGlzKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuZW50cmllcyA9IGZ1bmN0aW9uIGVudHJpZXMgKCkge1xuICByZXR1cm4gdGhpcy5fX2l0ZXJhdG9yKElURVJBVEVfRU5UUklFUyk7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gIHJldHVybiByZWNvcmRTZXEodGhpcykuX19pdGVyYXRvcih0eXBlLCByZXZlcnNlKTtcbn07XG5cblJlY29yZC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICByZXR1cm4gcmVjb3JkU2VxKHRoaXMpLl9faXRlcmF0ZShmbiwgcmV2ZXJzZSk7XG59O1xuXG5SZWNvcmQucHJvdG90eXBlLl9fZW5zdXJlT3duZXIgPSBmdW5jdGlvbiBfX2Vuc3VyZU93bmVyIChvd25lcklEKSB7XG4gIGlmIChvd25lcklEID09PSB0aGlzLl9fb3duZXJJRCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG4gIHZhciBuZXdWYWx1ZXMgPSB0aGlzLl92YWx1ZXMuX19lbnN1cmVPd25lcihvd25lcklEKTtcbiAgaWYgKCFvd25lcklEKSB7XG4gICAgdGhpcy5fX293bmVySUQgPSBvd25lcklEO1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ld1ZhbHVlcztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICByZXR1cm4gbWFrZVJlY29yZCh0aGlzLCBuZXdWYWx1ZXMsIG93bmVySUQpO1xufTtcblxuUmVjb3JkLmlzUmVjb3JkID0gaXNSZWNvcmQ7XG5SZWNvcmQuZ2V0RGVzY3JpcHRpdmVOYW1lID0gcmVjb3JkTmFtZTtcbnZhciBSZWNvcmRQcm90b3R5cGUgPSBSZWNvcmQucHJvdG90eXBlO1xuUmVjb3JkUHJvdG90eXBlW0lTX1JFQ09SRF9TWU1CT0xdID0gdHJ1ZTtcblJlY29yZFByb3RvdHlwZVtERUxFVEVdID0gUmVjb3JkUHJvdG90eXBlLnJlbW92ZTtcblJlY29yZFByb3RvdHlwZS5kZWxldGVJbiA9IFJlY29yZFByb3RvdHlwZS5yZW1vdmVJbiA9IGRlbGV0ZUluO1xuUmVjb3JkUHJvdG90eXBlLmdldEluID0gZ2V0SW47XG5SZWNvcmRQcm90b3R5cGUuaGFzSW4gPSBDb2xsZWN0aW9uUHJvdG90eXBlLmhhc0luO1xuUmVjb3JkUHJvdG90eXBlLm1lcmdlID0gbWVyZ2UkMTtcblJlY29yZFByb3RvdHlwZS5tZXJnZVdpdGggPSBtZXJnZVdpdGgkMTtcblJlY29yZFByb3RvdHlwZS5tZXJnZUluID0gbWVyZ2VJbjtcblJlY29yZFByb3RvdHlwZS5tZXJnZURlZXAgPSBtZXJnZURlZXA7XG5SZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwV2l0aCA9IG1lcmdlRGVlcFdpdGg7XG5SZWNvcmRQcm90b3R5cGUubWVyZ2VEZWVwSW4gPSBtZXJnZURlZXBJbjtcblJlY29yZFByb3RvdHlwZS5zZXRJbiA9IHNldEluO1xuUmVjb3JkUHJvdG90eXBlLnVwZGF0ZSA9IHVwZGF0ZTtcblJlY29yZFByb3RvdHlwZS51cGRhdGVJbiA9IHVwZGF0ZUluO1xuUmVjb3JkUHJvdG90eXBlLndpdGhNdXRhdGlvbnMgPSB3aXRoTXV0YXRpb25zO1xuUmVjb3JkUHJvdG90eXBlLmFzTXV0YWJsZSA9IGFzTXV0YWJsZTtcblJlY29yZFByb3RvdHlwZS5hc0ltbXV0YWJsZSA9IGFzSW1tdXRhYmxlO1xuUmVjb3JkUHJvdG90eXBlW0lURVJBVE9SX1NZTUJPTF0gPSBSZWNvcmRQcm90b3R5cGUuZW50cmllcztcblJlY29yZFByb3RvdHlwZS50b0pTT04gPSBSZWNvcmRQcm90b3R5cGUudG9PYmplY3QgPVxuICBDb2xsZWN0aW9uUHJvdG90eXBlLnRvT2JqZWN0O1xuUmVjb3JkUHJvdG90eXBlLmluc3BlY3QgPSBSZWNvcmRQcm90b3R5cGUudG9Tb3VyY2UgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnRvU3RyaW5nKCk7XG59O1xuXG5mdW5jdGlvbiBtYWtlUmVjb3JkKGxpa2VSZWNvcmQsIHZhbHVlcywgb3duZXJJRCkge1xuICB2YXIgcmVjb3JkID0gT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YobGlrZVJlY29yZCkpO1xuICByZWNvcmQuX3ZhbHVlcyA9IHZhbHVlcztcbiAgcmVjb3JkLl9fb3duZXJJRCA9IG93bmVySUQ7XG4gIHJldHVybiByZWNvcmQ7XG59XG5cbmZ1bmN0aW9uIHJlY29yZE5hbWUocmVjb3JkKSB7XG4gIHJldHVybiByZWNvcmQuY29uc3RydWN0b3IuZGlzcGxheU5hbWUgfHwgcmVjb3JkLmNvbnN0cnVjdG9yLm5hbWUgfHwgJ1JlY29yZCc7XG59XG5cbmZ1bmN0aW9uIHJlY29yZFNlcShyZWNvcmQpIHtcbiAgcmV0dXJuIGtleWVkU2VxRnJvbVZhbHVlKHJlY29yZC5fa2V5cy5tYXAoZnVuY3Rpb24gKGspIHsgcmV0dXJuIFtrLCByZWNvcmQuZ2V0KGspXTsgfSkpO1xufVxuXG5mdW5jdGlvbiBzZXRQcm9wKHByb3RvdHlwZSwgbmFtZSkge1xuICB0cnkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShwcm90b3R5cGUsIG5hbWUsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXQobmFtZSk7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaW52YXJpYW50KHRoaXMuX19vd25lcklELCAnQ2Fubm90IHNldCBvbiBhbiBpbW11dGFibGUgcmVjb3JkLicpO1xuICAgICAgICB0aGlzLnNldChuYW1lLCB2YWx1ZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSBmYWlsZWQuIFByb2JhYmx5IElFOC5cbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgYSBsYXp5IFNlcSBvZiBgdmFsdWVgIHJlcGVhdGVkIGB0aW1lc2AgdGltZXMuIFdoZW4gYHRpbWVzYCBpc1xuICogdW5kZWZpbmVkLCByZXR1cm5zIGFuIGluZmluaXRlIHNlcXVlbmNlIG9mIGB2YWx1ZWAuXG4gKi9cbnZhciBSZXBlYXQgPSAvKkBfX1BVUkVfXyovKGZ1bmN0aW9uIChJbmRleGVkU2VxKSB7XG4gIGZ1bmN0aW9uIFJlcGVhdCh2YWx1ZSwgdGltZXMpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgUmVwZWF0KSkge1xuICAgICAgcmV0dXJuIG5ldyBSZXBlYXQodmFsdWUsIHRpbWVzKTtcbiAgICB9XG4gICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnNpemUgPSB0aW1lcyA9PT0gdW5kZWZpbmVkID8gSW5maW5pdHkgOiBNYXRoLm1heCgwLCB0aW1lcyk7XG4gICAgaWYgKHRoaXMuc2l6ZSA9PT0gMCkge1xuICAgICAgaWYgKEVNUFRZX1JFUEVBVCkge1xuICAgICAgICByZXR1cm4gRU1QVFlfUkVQRUFUO1xuICAgICAgfVxuICAgICAgRU1QVFlfUkVQRUFUID0gdGhpcztcbiAgICB9XG4gIH1cblxuICBpZiAoIEluZGV4ZWRTZXEgKSBSZXBlYXQuX19wcm90b19fID0gSW5kZXhlZFNlcTtcbiAgUmVwZWF0LnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoIEluZGV4ZWRTZXEgJiYgSW5kZXhlZFNlcS5wcm90b3R5cGUgKTtcbiAgUmVwZWF0LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlcGVhdDtcblxuICBSZXBlYXQucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICAgIGlmICh0aGlzLnNpemUgPT09IDApIHtcbiAgICAgIHJldHVybiAnUmVwZWF0IFtdJztcbiAgICB9XG4gICAgcmV0dXJuICdSZXBlYXQgWyAnICsgdGhpcy5fdmFsdWUgKyAnICcgKyB0aGlzLnNpemUgKyAnIHRpbWVzIF0nO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gZ2V0IChpbmRleCwgbm90U2V0VmFsdWUpIHtcbiAgICByZXR1cm4gdGhpcy5oYXMoaW5kZXgpID8gdGhpcy5fdmFsdWUgOiBub3RTZXRWYWx1ZTtcbiAgfTtcblxuICBSZXBlYXQucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHNlYXJjaFZhbHVlKSB7XG4gICAgcmV0dXJuIGlzKHRoaXMuX3ZhbHVlLCBzZWFyY2hWYWx1ZSk7XG4gIH07XG5cbiAgUmVwZWF0LnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIHNsaWNlIChiZWdpbiwgZW5kKSB7XG4gICAgdmFyIHNpemUgPSB0aGlzLnNpemU7XG4gICAgcmV0dXJuIHdob2xlU2xpY2UoYmVnaW4sIGVuZCwgc2l6ZSlcbiAgICAgID8gdGhpc1xuICAgICAgOiBuZXcgUmVwZWF0KFxuICAgICAgICAgIHRoaXMuX3ZhbHVlLFxuICAgICAgICAgIHJlc29sdmVFbmQoZW5kLCBzaXplKSAtIHJlc29sdmVCZWdpbihiZWdpbiwgc2l6ZSlcbiAgICAgICAgKTtcbiAgfTtcblxuICBSZXBlYXQucHJvdG90eXBlLnJldmVyc2UgPSBmdW5jdGlvbiByZXZlcnNlICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICBSZXBlYXQucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mIChzZWFyY2hWYWx1ZSkge1xuICAgIGlmIChpcyh0aGlzLl92YWx1ZSwgc2VhcmNoVmFsdWUpKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUubGFzdEluZGV4T2YgPSBmdW5jdGlvbiBsYXN0SW5kZXhPZiAoc2VhcmNoVmFsdWUpIHtcbiAgICBpZiAoaXModGhpcy5fdmFsdWUsIHNlYXJjaFZhbHVlKSkge1xuICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICB9XG4gICAgcmV0dXJuIC0xO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuX19pdGVyYXRlID0gZnVuY3Rpb24gX19pdGVyYXRlIChmbiwgcmV2ZXJzZSkge1xuICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuICAgIHZhciBpID0gMDtcbiAgICB3aGlsZSAoaSAhPT0gc2l6ZSkge1xuICAgICAgaWYgKGZuKHRoaXMuX3ZhbHVlLCByZXZlcnNlID8gc2l6ZSAtICsraSA6IGkrKywgdGhpcykgPT09IGZhbHNlKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gaTtcbiAgfTtcblxuICBSZXBlYXQucHJvdG90eXBlLl9faXRlcmF0b3IgPSBmdW5jdGlvbiBfX2l0ZXJhdG9yICh0eXBlLCByZXZlcnNlKSB7XG4gICAgdmFyIHRoaXMkMSQxID0gdGhpcztcblxuICAgIHZhciBzaXplID0gdGhpcy5zaXplO1xuICAgIHZhciBpID0gMDtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGkgPT09IHNpemVcbiAgICAgICAgPyBpdGVyYXRvckRvbmUoKVxuICAgICAgICA6IGl0ZXJhdG9yVmFsdWUodHlwZSwgcmV2ZXJzZSA/IHNpemUgLSArK2kgOiBpKyssIHRoaXMkMSQxLl92YWx1ZSk7IH1cbiAgICApO1xuICB9O1xuXG4gIFJlcGVhdC5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChvdGhlcikge1xuICAgIHJldHVybiBvdGhlciBpbnN0YW5jZW9mIFJlcGVhdFxuICAgICAgPyBpcyh0aGlzLl92YWx1ZSwgb3RoZXIuX3ZhbHVlKVxuICAgICAgOiBkZWVwRXF1YWwob3RoZXIpO1xuICB9O1xuXG4gIHJldHVybiBSZXBlYXQ7XG59KEluZGV4ZWRTZXEpKTtcblxudmFyIEVNUFRZX1JFUEVBVDtcblxuZnVuY3Rpb24gZnJvbUpTKHZhbHVlLCBjb252ZXJ0ZXIpIHtcbiAgcmV0dXJuIGZyb21KU1dpdGgoXG4gICAgW10sXG4gICAgY29udmVydGVyIHx8IGRlZmF1bHRDb252ZXJ0ZXIsXG4gICAgdmFsdWUsXG4gICAgJycsXG4gICAgY29udmVydGVyICYmIGNvbnZlcnRlci5sZW5ndGggPiAyID8gW10gOiB1bmRlZmluZWQsXG4gICAgeyAnJzogdmFsdWUgfVxuICApO1xufVxuXG5mdW5jdGlvbiBmcm9tSlNXaXRoKHN0YWNrLCBjb252ZXJ0ZXIsIHZhbHVlLCBrZXksIGtleVBhdGgsIHBhcmVudFZhbHVlKSB7XG4gIGlmIChcbiAgICB0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnICYmXG4gICAgIWlzSW1tdXRhYmxlKHZhbHVlKSAmJlxuICAgIChpc0FycmF5TGlrZSh2YWx1ZSkgfHwgaGFzSXRlcmF0b3IodmFsdWUpIHx8IGlzUGxhaW5PYmplY3QodmFsdWUpKVxuICApIHtcbiAgICBpZiAofnN0YWNrLmluZGV4T2YodmFsdWUpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSW1tdXRhYmxlJyk7XG4gICAgfVxuICAgIHN0YWNrLnB1c2godmFsdWUpO1xuICAgIGtleVBhdGggJiYga2V5ICE9PSAnJyAmJiBrZXlQYXRoLnB1c2goa2V5KTtcbiAgICB2YXIgY29udmVydGVkID0gY29udmVydGVyLmNhbGwoXG4gICAgICBwYXJlbnRWYWx1ZSxcbiAgICAgIGtleSxcbiAgICAgIFNlcSh2YWx1ZSkubWFwKGZ1bmN0aW9uICh2LCBrKSB7IHJldHVybiBmcm9tSlNXaXRoKHN0YWNrLCBjb252ZXJ0ZXIsIHYsIGssIGtleVBhdGgsIHZhbHVlKTsgfVxuICAgICAgKSxcbiAgICAgIGtleVBhdGggJiYga2V5UGF0aC5zbGljZSgpXG4gICAgKTtcbiAgICBzdGFjay5wb3AoKTtcbiAgICBrZXlQYXRoICYmIGtleVBhdGgucG9wKCk7XG4gICAgcmV0dXJuIGNvbnZlcnRlZDtcbiAgfVxuICByZXR1cm4gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb252ZXJ0ZXIoaywgdikge1xuICAvLyBFZmZlY3RpdmVseSB0aGUgb3Bwb3NpdGUgb2YgXCJDb2xsZWN0aW9uLnRvU2VxKClcIlxuICByZXR1cm4gaXNJbmRleGVkKHYpID8gdi50b0xpc3QoKSA6IGlzS2V5ZWQodikgPyB2LnRvTWFwKCkgOiB2LnRvU2V0KCk7XG59XG5cbnZhciB2ZXJzaW9uID0gXCI0LjAuMFwiO1xuXG52YXIgSW1tdXRhYmxlID0ge1xuICB2ZXJzaW9uOiB2ZXJzaW9uLFxuXG4gIENvbGxlY3Rpb246IENvbGxlY3Rpb24sXG4gIC8vIE5vdGU6IEl0ZXJhYmxlIGlzIGRlcHJlY2F0ZWRcbiAgSXRlcmFibGU6IENvbGxlY3Rpb24sXG5cbiAgU2VxOiBTZXEsXG4gIE1hcDogTWFwLFxuICBPcmRlcmVkTWFwOiBPcmRlcmVkTWFwLFxuICBMaXN0OiBMaXN0LFxuICBTdGFjazogU3RhY2ssXG4gIFNldDogU2V0LFxuICBPcmRlcmVkU2V0OiBPcmRlcmVkU2V0LFxuXG4gIFJlY29yZDogUmVjb3JkLFxuICBSYW5nZTogUmFuZ2UsXG4gIFJlcGVhdDogUmVwZWF0LFxuXG4gIGlzOiBpcyxcbiAgZnJvbUpTOiBmcm9tSlMsXG4gIGhhc2g6IGhhc2gsXG5cbiAgaXNJbW11dGFibGU6IGlzSW1tdXRhYmxlLFxuICBpc0NvbGxlY3Rpb246IGlzQ29sbGVjdGlvbixcbiAgaXNLZXllZDogaXNLZXllZCxcbiAgaXNJbmRleGVkOiBpc0luZGV4ZWQsXG4gIGlzQXNzb2NpYXRpdmU6IGlzQXNzb2NpYXRpdmUsXG4gIGlzT3JkZXJlZDogaXNPcmRlcmVkLFxuICBpc1ZhbHVlT2JqZWN0OiBpc1ZhbHVlT2JqZWN0LFxuICBpc1BsYWluT2JqZWN0OiBpc1BsYWluT2JqZWN0LFxuICBpc1NlcTogaXNTZXEsXG4gIGlzTGlzdDogaXNMaXN0LFxuICBpc01hcDogaXNNYXAsXG4gIGlzT3JkZXJlZE1hcDogaXNPcmRlcmVkTWFwLFxuICBpc1N0YWNrOiBpc1N0YWNrLFxuICBpc1NldDogaXNTZXQsXG4gIGlzT3JkZXJlZFNldDogaXNPcmRlcmVkU2V0LFxuICBpc1JlY29yZDogaXNSZWNvcmQsXG5cbiAgZ2V0OiBnZXQsXG4gIGdldEluOiBnZXRJbiQxLFxuICBoYXM6IGhhcyxcbiAgaGFzSW46IGhhc0luJDEsXG4gIG1lcmdlOiBtZXJnZSxcbiAgbWVyZ2VEZWVwOiBtZXJnZURlZXAkMSxcbiAgbWVyZ2VXaXRoOiBtZXJnZVdpdGgsXG4gIG1lcmdlRGVlcFdpdGg6IG1lcmdlRGVlcFdpdGgkMSxcbiAgcmVtb3ZlOiByZW1vdmUsXG4gIHJlbW92ZUluOiByZW1vdmVJbixcbiAgc2V0OiBzZXQsXG4gIHNldEluOiBzZXRJbiQxLFxuICB1cGRhdGU6IHVwZGF0ZSQxLFxuICB1cGRhdGVJbjogdXBkYXRlSW4kMSxcbn07XG5cbi8vIE5vdGU6IEl0ZXJhYmxlIGlzIGRlcHJlY2F0ZWRcbnZhciBJdGVyYWJsZSA9IENvbGxlY3Rpb247XG5cbmV4cG9ydCBkZWZhdWx0IEltbXV0YWJsZTtcbmV4cG9ydCB7IENvbGxlY3Rpb24sIEl0ZXJhYmxlLCBMaXN0LCBNYXAsIE9yZGVyZWRNYXAsIE9yZGVyZWRTZXQsIFJhbmdlLCBSZWNvcmQsIFJlcGVhdCwgU2VxLCBTZXQsIFN0YWNrLCBmcm9tSlMsIGdldCwgZ2V0SW4kMSBhcyBnZXRJbiwgaGFzLCBoYXNJbiQxIGFzIGhhc0luLCBoYXNoLCBpcywgaXNBc3NvY2lhdGl2ZSwgaXNDb2xsZWN0aW9uLCBpc0ltbXV0YWJsZSwgaXNJbmRleGVkLCBpc0tleWVkLCBpc0xpc3QsIGlzTWFwLCBpc09yZGVyZWQsIGlzT3JkZXJlZE1hcCwgaXNPcmRlcmVkU2V0LCBpc1BsYWluT2JqZWN0LCBpc1JlY29yZCwgaXNTZXEsIGlzU2V0LCBpc1N0YWNrLCBpc1ZhbHVlT2JqZWN0LCBtZXJnZSwgbWVyZ2VEZWVwJDEgYXMgbWVyZ2VEZWVwLCBtZXJnZURlZXBXaXRoJDEgYXMgbWVyZ2VEZWVwV2l0aCwgbWVyZ2VXaXRoLCByZW1vdmUsIHJlbW92ZUluLCBzZXQsIHNldEluJDEgYXMgc2V0SW4sIHVwZGF0ZSQxIGFzIHVwZGF0ZSwgdXBkYXRlSW4kMSBhcyB1cGRhdGVJbiwgdmVyc2lvbiB9O1xuIiwiZXhwb3J0IGZ1bmN0aW9uIGV4aXN0cyh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IG51bGwgJiYgdHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENoaWxkTm9kZUtleShub2RlKSB7XG4gIGNvbnN0IG5vZGVUeXBlID0gbm9kZS5nZXRJbihbJ3R5cGUnXSk7XG4gIGlmIChub2RlVHlwZSA9PT0gJ2pzeC1ub2RlJyB8fCBub2RlVHlwZSA9PT0gJ3JlZi1ub2RlJykge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChub2RlVHlwZSA9PT0gJ2NvbXBvc2VkLW5vZGUnKSB7XG4gICAgcmV0dXJuICdub2Rlcyc7XG4gIH1cblxuICBpZiAobm9kZVR5cGUgPT09ICdsb29wLWNvbnRhaW5lcicgfHwgbm9kZVR5cGUgPT09ICdyb3V0ZS1ub2RlJykge1xuICAgIHJldHVybiAnbm9kZSc7XG4gIH1cblxuICByZXR1cm4gJ2NoaWxkcmVuJztcbn1cbiIsImltcG9ydCB7IFNlcSwgU3RhY2ssIENvbGxlY3Rpb24gfSBmcm9tICdpbW11dGFibGUnO1xuXG5pbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXkgfSBmcm9tICcuL3V0aWxzJztcblxuLy8gdHlwZSBXYWxrSXRlcmF0b3I8VCwgU3RvcFZhbHVlID0gdW5rbm93bj4gPSAoXG4vLyAgIGFjY3VtdWxhdG9yOiBUIHwgdW5kZWZpbmVkLFxuLy8gICBrZXlQYXRoOiBTZXEuSW5kZXhlZDxzdHJpbmcgfCBudW1iZXI+LFxuLy8gICBzdG9wOiAodmFsdWU6IFN0b3BWYWx1ZSkgPT4gU3RvcFZhbHVlLFxuLy8gKSA9PiBUO1xuXG5mdW5jdGlvbiB3YWxrKG5vZGUsIGl0ZXJhdG9yKSB7XG4gIGxldCBzdGFjayA9IFN0YWNrLm9mKFNlcShbXSkpO1xuICBsZXQgcmVkdWN0aW9uO1xuICBsZXQgc3RvcHBlZCA9IGZhbHNlO1xuICBmdW5jdGlvbiBzdG9wKHYpIHtcbiAgICBzdG9wcGVkID0gdHJ1ZTtcbiAgICByZXR1cm4gdjtcbiAgfVxuXG4gIHdoaWxlICghc3RvcHBlZCAmJiBzdGFjay5zaXplID4gMCkge1xuICAgIGNvbnN0IGtleVBhdGggPSBzdGFjay5maXJzdCgpO1xuXG4gICAgc3RhY2sgPSBzdGFjay5zaGlmdCgpO1xuXG4gICAgaWYgKCFrZXlQYXRoKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICByZWR1Y3Rpb24gPSBpdGVyYXRvcihyZWR1Y3Rpb24sIGtleVBhdGgsIHN0b3ApO1xuICAgIGNvbnN0IG5vZGVDaGlsZHJlbktleSA9IGdldENoaWxkTm9kZUtleShub2RlLmdldEluKGtleVBhdGgpKTtcbiAgICBpZiAoIW5vZGVDaGlsZHJlbktleSkge1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgY29uc3QgY2hpbGROb2RlcyA9IG5vZGUuZ2V0SW4oa2V5UGF0aC5jb25jYXQobm9kZUNoaWxkcmVuS2V5KSk7XG4gICAgaWYgKCFjaGlsZE5vZGVzKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hpbGROb2Rlcy5pc0VtcHR5KCkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkTm9kZXMudG9KUygpKSkge1xuICAgICAgY2hpbGROb2Rlcy5rZXlTZXEoKS5mb3JFYWNoKChpKSA9PiB7XG4gICAgICAgIHN0YWNrID0gc3RhY2sudW5zaGlmdChrZXlQYXRoLmNvbmNhdChbbm9kZUNoaWxkcmVuS2V5LCBpXSkpO1xuICAgICAgfSk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBzdGFjayA9IHN0YWNrLnVuc2hpZnQoa2V5UGF0aC5jb25jYXQobm9kZUNoaWxkcmVuS2V5KSk7XG4gIH1cblxuICByZXR1cm4gcmVkdWN0aW9uO1xufVxuXG5leHBvcnQgZGVmYXVsdCB3YWxrO1xuIiwiaW1wb3J0IHdhbGsgZnJvbSAnLi93YWxrJztcblxuZnVuY3Rpb24gZmluZChub2RlLCBjb21wYXJhdG9yKSB7XG4gIHJldHVybiB3YWxrKG5vZGUsIChfLCBrZXlQYXRoLCBzdG9wKSA9PiB7XG4gICAgaWYgKGNvbXBhcmF0b3Iobm9kZS5nZXRJbihrZXlQYXRoKSwga2V5UGF0aCkpIHtcbiAgICAgIHJldHVybiBzdG9wKGtleVBhdGgpO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbmQ7XG4iLCJpbXBvcnQgZmluZCBmcm9tICcuL2ZpbmQnO1xuXG5mdW5jdGlvbiBrZXlQYXRoQnlJZChub2RlLCBpZCkge1xuICByZXR1cm4gZmluZChub2RlLCAoY2hpbGROb2RlKSA9PiBjaGlsZE5vZGUuZ2V0SW4oWydpZCddKSA9PT0gaWQpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBrZXlQYXRoQnlJZDtcbiIsImltcG9ydCB7IFNlcSB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQga2V5UGF0aEJ5SWQgZnJvbSAnLi9rZXlQYXRoQnlJZCc7XG5cbmZ1bmN0aW9uIGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGlmIChTZXEuaXNTZXEoaWRPcktleVBhdGgpKSB7XG4gICAgcmV0dXJuIGlkT3JLZXlQYXRoO1xuICB9XG5cbiAgcmV0dXJuIGtleVBhdGhCeUlkKG5vZGUsIGlkT3JLZXlQYXRoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYnlBcmJpdHJhcnk7XG4iLCJpbXBvcnQgeyBMaXN0IH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCB7IGdldENoaWxkTm9kZUtleSB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBfYXBwZW5kVG8ocm9vdCwgcGFyZW50SWRPcktleVBhdGgsIG5vZGUpIHtcbiAgY29uc3QgcGFyZW50S2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KHJvb3QsIHBhcmVudElkT3JLZXlQYXRoKTtcbiAgaWYgKCFwYXJlbnRLZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGFyZW50Tm9kZSA9IHJvb3QuZ2V0SW4ocGFyZW50S2V5UGF0aCk7XG4gIGNvbnN0IGNoaWxkTm9kZUtleSA9IGdldENoaWxkTm9kZUtleShwYXJlbnROb2RlKTtcbiAgY29uc3QgY2hpbGRyZW5LZXlQYXRoID0gcGFyZW50S2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleV0pO1xuICBpZiAoY2hpbGROb2RlS2V5ID09PSAnbm9kZScpIHtcbiAgICByZXR1cm4gcm9vdC5zZXRJbihyb290LCBjaGlsZHJlbktleVBhdGgsIG5vZGUpO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW5Ob2RlcyA9IHJvb3QuZ2V0SW4oY2hpbGRyZW5LZXlQYXRoKSB8fCBMaXN0KCk7XG4gIHJldHVybiByb290LnNldEluKGNoaWxkcmVuS2V5UGF0aCwgY2hpbGRyZW5Ob2Rlcy5wdXNoKG5vZGUpKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgX2FwcGVuZFRvO1xuIiwiaW1wb3J0IHdhbGsgZnJvbSAnLi93YWxrJztcblxuZnVuY3Rpb24gdG9OdW1iZXJQYXRoKGtleVBhdGgpIHtcbiAgcmV0dXJuIGtleVBhdGgubWFwKCh2KSA9PiB7XG4gICAgaWYgKHR5cGVvZiB2ID09PSAnbnVtYmVyJykge1xuICAgICAgcmV0dXJuIHY7XG4gICAgfVxuXG4gICAgcmV0dXJuIDA7XG4gIH0pO1xufVxuXG4vKipcbiAqXG4gKiBAcGFyYW0ge0ltbXV0YWJsZX0gbm9kZVxuICogQHJldHVybnMgZmxhdHRlbmVkIGtleVBhdGgvbm9kZSBwYWlyIGxpc3RcbiAqL1xuZnVuY3Rpb24gZmxhdChub2RlKSB7XG4gIGNvbnN0IHJlZHVjdGlvbiA9IHdhbGsobm9kZSwgKHJlZHVjdGlvbiwga2V5UGF0aCkgPT4ge1xuICAgIGlmICghcmVkdWN0aW9uKSB7XG4gICAgICByZWR1Y3Rpb24gPSBbXTtcbiAgICB9XG5cbiAgICByZWR1Y3Rpb24ucHVzaCh7IGtleVBhdGgsIG5vZGU6IG5vZGUuZ2V0SW4oa2V5UGF0aCksIG51bWJlclBhdGg6IHRvTnVtYmVyUGF0aChrZXlQYXRoKSB9KTtcbiAgICByZXR1cm4gcmVkdWN0aW9uO1xuICB9KTtcblxuICByZWR1Y3Rpb24uc29ydCgoeyBudW1iZXJQYXRoOiBudW1iZXJQYXRoQSB9LCB7IG51bWJlclBhdGg6IG51bWJlclBhdGhCIH0pID0+IHtcbiAgICBpZiAobnVtYmVyUGF0aEEuc2l6ZSA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIGlmIChudW1iZXJQYXRoQi5zaXplID09PSAwKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgTWF0aC5taW4obnVtYmVyUGF0aEEuc2l6ZSwgbnVtYmVyUGF0aEIuc2l6ZSk7IGluZGV4KyspIHtcbiAgICAgIGlmIChudW1iZXJQYXRoQi5nZXQoaW5kZXgpID09PSBudW1iZXJQYXRoQS5nZXQoaW5kZXgpKSB7XG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudW1iZXJQYXRoQS5nZXQoaW5kZXgpIC0gbnVtYmVyUGF0aEIuZ2V0KGluZGV4KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVtYmVyUGF0aEEuc2l6ZSA8IG51bWJlclBhdGhCLnNpemUgPyAtMSA6IDE7XG4gIH0pO1xuXG4gIHJldHVybiByZWR1Y3Rpb24ubWFwKCh7IGtleVBhdGgsIG5vZGUgfSkgPT4gW2tleVBhdGgsIG5vZGVdKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmxhdDtcbiIsImltcG9ydCB7IGJ5QXJiaXRyYXJ5IH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeS11dGlscyc7XG5pbXBvcnQgeyBMaXN0IH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7IGdldENoaWxkTm9kZUtleSB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBfaW5zZXJ0Q2hpbGRBdChyb290LCBwYXJlbnRJZE9yS2V5UGF0aCwgaW5kZXgsIG5vZGUpIHtcbiAgY29uc3QgX3BhcmVudElkT3JLZXlQYXRoID0gYnlBcmJpdHJhcnkocm9vdCwgcGFyZW50SWRPcktleVBhdGgpO1xuICBpZiAoIV9wYXJlbnRJZE9yS2V5UGF0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudE5vZGUgPSByb290LmdldEluKF9wYXJlbnRJZE9yS2V5UGF0aCk7XG4gIGNvbnN0IGNoaWxkTm9kZUtleSA9IGdldENoaWxkTm9kZUtleShwYXJlbnROb2RlKTtcbiAgY29uc3QgY2hpbGRyZW5LZXlQYXRoID0gX3BhcmVudElkT3JLZXlQYXRoLmNvbmNhdChbY2hpbGROb2RlS2V5XSk7XG4gIGlmIChjaGlsZE5vZGVLZXkgPT09ICdub2RlJykge1xuICAgIHJldHVybiByb290LnNldEluKHJvb3QsIGNoaWxkcmVuS2V5UGF0aCwgbm9kZSk7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbk5vZGVzID0gcm9vdC5nZXRJbihjaGlsZHJlbktleVBhdGgpIHx8IExpc3QoKTtcbiAgY29uc3QgbGVmdFNpZGVOb2RlcyA9IGNoaWxkcmVuTm9kZXMuc2xpY2UoMCwgaW5kZXgpO1xuICBjb25zdCByaWdodFNpZGVOb2RlcyA9IGNoaWxkcmVuTm9kZXMuc2xpY2UoaW5kZXgpO1xuXG4gIGNvbnN0IGFsbENoaWxkcmVuTm9kZXMgPSBsZWZ0U2lkZU5vZGVzLmNvbmNhdChbbm9kZV0sIHJpZ2h0U2lkZU5vZGVzKTtcbiAgcmV0dXJuIHJvb3Quc2V0SW4oY2hpbGRyZW5LZXlQYXRoLCBhbGxDaGlsZHJlbk5vZGVzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgX2luc2VydENoaWxkQXQ7XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5cbmZ1bmN0aW9uIHBhcmVudChub2RlLCBpZE9yS2V5UGF0aCkge1xuICBjb25zdCBrZXlQYXRoID0gYnlBcmJpdHJhcnkobm9kZSwgaWRPcktleVBhdGgpO1xuXG4gIGlmICgha2V5UGF0aCB8fCAha2V5UGF0aC5zaXplKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKHR5cGVvZiBrZXlQYXRoLmxhc3QoKSA9PT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4ga2V5UGF0aC5zbGljZSgwLCAtMik7XG4gIH1cblxuICByZXR1cm4ga2V5UGF0aC5zbGljZSgwLCAtMSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcmVudDtcbiIsImltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCBwYXJlbnQgZnJvbSAnLi9wYXJlbnQnO1xuaW1wb3J0IF9pbnNlcnRDaGlsZEF0IGZyb20gJy4vX2luc2VydENoaWxkQXQnO1xuXG5mdW5jdGlvbiBfaW5zZXJ0TGVmdFNpYmxpbmdUbyhyb290LCBpZE9yS2V5UGF0aCwgbm9kZSkge1xuICBjb25zdCByZWZlcmVuY2VLZXlQYXRoID0gYnlBcmJpdHJhcnkocm9vdCwgaWRPcktleVBhdGgpO1xuICBpZiAoIXJlZmVyZW5jZUtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWZlcmVuY2VOb2RlSW5kZXggPSByZWZlcmVuY2VLZXlQYXRoLmxhc3QoKTtcbiAgaWYgKHR5cGVvZiByZWZlcmVuY2VOb2RlSW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGFyZW50S2V5UGF0aCA9IHBhcmVudChyb290LCByZWZlcmVuY2VLZXlQYXRoKTtcbiAgcmV0dXJuIF9pbnNlcnRDaGlsZEF0KHJvb3QsIHBhcmVudEtleVBhdGgsIHJlZmVyZW5jZU5vZGVJbmRleCwgbm9kZSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IF9pbnNlcnRMZWZ0U2libGluZ1RvO1xuIiwiaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuaW1wb3J0IHBhcmVudCBmcm9tICcuL3BhcmVudCc7XG5pbXBvcnQgX2luc2VydENoaWxkQXQgZnJvbSAnLi9faW5zZXJ0Q2hpbGRBdCc7XG5cbmZ1bmN0aW9uIF9pbnNlcnRSaWdodFNpYmxpbmdUbyhyb290LCBpZE9yS2V5UGF0aCwgbm9kZSkge1xuICBjb25zdCByZWZlcmVuY2VLZXlQYXRoID0gYnlBcmJpdHJhcnkocm9vdCwgaWRPcktleVBhdGgpO1xuICBpZiAoIXJlZmVyZW5jZUtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWZlcmVuY2VOb2RlSW5kZXggPSByZWZlcmVuY2VLZXlQYXRoLmxhc3QoKTtcbiAgaWYgKHR5cGVvZiByZWZlcmVuY2VOb2RlSW5kZXggIT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGFyZW50S2V5UGF0aCA9IHBhcmVudChyb290LCByZWZlcmVuY2VLZXlQYXRoKTtcbiAgcmV0dXJuIF9pbnNlcnRDaGlsZEF0KHJvb3QsIHBhcmVudEtleVBhdGgsIHJlZmVyZW5jZU5vZGVJbmRleCArIDEsIG5vZGUpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBfaW5zZXJ0UmlnaHRTaWJsaW5nVG87XG4iLCJpbXBvcnQgeyBMaXN0IH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCB7IGdldENoaWxkTm9kZUtleSB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBfcHJlcGVuZFRvKHJvb3QsIHBhcmVudElkT3JLZXlQYXRoLCBub2RlKSB7XG4gIGNvbnN0IHBhcmVudEtleVBhdGggPSBieUFyYml0cmFyeShyb290LCBwYXJlbnRJZE9yS2V5UGF0aCk7XG4gIGlmICghcGFyZW50S2V5UGF0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHBhcmVudE5vZGUgPSByb290LmdldEluKHBhcmVudEtleVBhdGgpO1xuICBjb25zdCBjaGlsZE5vZGVLZXkgPSBnZXRDaGlsZE5vZGVLZXkocGFyZW50Tm9kZSk7XG4gIGNvbnN0IGNoaWxkcmVuS2V5UGF0aCA9IHBhcmVudEtleVBhdGguY29uY2F0KFtjaGlsZE5vZGVLZXldKTtcbiAgaWYgKGNoaWxkTm9kZUtleSA9PT0gJ25vZGUnKSB7XG4gICAgcmV0dXJuIHJvb3Quc2V0SW4ocm9vdCwgY2hpbGRyZW5LZXlQYXRoLCBub2RlKTtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuTm9kZXMgPSByb290LmdldEluKGNoaWxkcmVuS2V5UGF0aCkgfHwgTGlzdCgpO1xuICByZXR1cm4gcm9vdC5zZXRJbihjaGlsZHJlbktleVBhdGgsIFtub2RlXS5jb25jYXQoY2hpbGRyZW5Ob2RlcykpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBfcHJlcGVuZFRvO1xuIiwiaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgcGFyZW50IGZyb20gJy4vcGFyZW50JztcbmltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5Jztcbi8qKlxuICogQGlkIFRyZWVVdGlscy1hbmNlc3RvcnNcbiAqIEBsb29rdXAgYW5jZXN0b3JzXG4gKlxuICogIyMjIyAqbWV0aG9kKiBhbmNlc3RvcnMoKVxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogYW5jZXN0b3JzKFxuICogICAgc3RhdGU6IEltbXV0YWJsZS5JdGVyYWJsZSxcbiAqICAgIGlkT3JLZXlQYXRoOiBzdHJpbmd8SW1tdXRhYmxlLlNlcTxzdHJpbmd8bnVtYmVyPixcbiAqICk6IEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqIGBgYFxuICpcbiAqICMjIyMjIyBSZXR1cm5zOlxuICogQW4gPkltbXV0YWJsZS5MaXN0IG9mIGFsbCBrZXkgcGF0aHMgdGhhdCBwb2ludCBhdCBkaXJlY3QgYW5jZXN0b3JzIG9mIHRoZSBub2RlIGF0IGBpZE9yS2V5UGF0aGAuXG4gKi9cbmZ1bmN0aW9uIGFuY2VzdG9ycyhub2RlLCBpZE9yS2V5UGF0aCkge1xuICBsZXQga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKTtcbiAgaWYgKCFrZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IGxpc3QgPSBMaXN0KCk7XG5cbiAgd2hpbGUgKGtleVBhdGguc2l6ZSkge1xuICAgIGtleVBhdGggPSBwYXJlbnQobm9kZSwga2V5UGF0aCk7XG4gICAgbGlzdCA9IGxpc3QucHVzaChrZXlQYXRoKTtcbiAgfVxuXG4gIHJldHVybiBsaXN0O1xufVxuXG5leHBvcnQgZGVmYXVsdCBhbmNlc3RvcnM7XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5pbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXkgfSBmcm9tICcuL3V0aWxzJztcblxuZnVuY3Rpb24gY2hpbGRBdChub2RlLCBpZE9yS2V5UGF0aCwgaW5kZXgpIHtcbiAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKTtcblxuICBpZiAoIW5vZGUuZ2V0SW4oa2V5UGF0aCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjaGlsZE5vZGVLZXkgPSBnZXRDaGlsZE5vZGVLZXkobm9kZS5nZXRJbihrZXlQYXRoKSk7XG4gIGlmICghY2hpbGROb2RlS2V5KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgX2tleVBhdGggPSBrZXlQYXRoLmNvbmNhdChbY2hpbGROb2RlS2V5LCBpbmRleF0pO1xuICBpZiAobm9kZS5oYXNJbihfa2V5UGF0aCkpIHtcbiAgICByZXR1cm4gX2tleVBhdGg7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgY2hpbGRBdDtcbiIsImltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcblxuLyoqXG4gKiBAaWQgVHJlZVV0aWxzLWRlcHRoXG4gKiBAbG9va3VwIGRlcHRoXG4gKlxuICogIyMjIyAqbWV0aG9kKiBkZXB0aCgpXG4gKlxuICogIyMjIyMjIFNpZ25hdHVyZTpcbiAqIGBgYGpzXG4gKiBkZXB0aChcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj4sXG4gKiApOiBudW1iZXJcbiAqIGBgYFxuICpcbiAqICMjIyMjIyBSZXR1cm5zOlxuICogQSBudW1lcmljIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBkZXB0aCBvZiB0aGUgbm9kZSBhdCBgaWRPcktleVBhdGhgXG4gKi9cbmZ1bmN0aW9uIGRlcHRoKG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG5cbiAgaWYgKCFrZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gY2FsbCBmaWx0ZXIgd2lsbCBub3QgcHJlc2VydmUgdGhlIHNlcSBzaXplXG4gIC8vIGh0dHBzOi8vaW1tdXRhYmxlLWpzLmNvbS9kb2NzL3YzLjguMi9TZXEvI3NpemVcbiAgcmV0dXJuIE1hdGguZmxvb3Ioa2V5UGF0aC5maWx0ZXIoKHYpID0+IHR5cGVvZiB2ICE9PSAnbnVtYmVyJykudG9KUygpLmxlbmd0aCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlcHRoO1xuIiwiaW1wb3J0IHsgTGlzdCB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgd2FsayBmcm9tICcuL3dhbGsnO1xuXG5mdW5jdGlvbiBmaWx0ZXIobm9kZSwgY29tcGFyYXRvcikge1xuICBsZXQgcmVzID0gTGlzdCgpO1xuICB3YWxrKG5vZGUsIChfLCBrZXlQYXRoKSA9PiB7XG4gICAgaWYgKGNvbXBhcmF0b3Iobm9kZS5nZXRJbihrZXlQYXRoKSwga2V5UGF0aCkpIHtcbiAgICAgIHJlcyA9IHJlcy5wdXNoKGtleVBhdGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybjtcbiAgfSk7XG5cbiAgcmV0dXJuIHJlcztcbn1cblxuZXhwb3J0IGRlZmF1bHQgZmlsdGVyO1xuIiwiaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogQGlkIFRyZWVVdGlscy1maXJzdENoaWxkXG4gKiBAbG9va3VwIGZpcnN0Q2hpbGRcbiAqXG4gKiAjIyMjICptZXRob2QqIGZpcnN0Q2hpbGQoKVxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogZmlyc3RDaGlsZChcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqICk6IEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqIGBgYFxuICpcbiAqICMjIyMjIyBSZXR1cm5zOlxuICogUmV0dXJucyB0aGUgZmlyc3QgY2hpbGQgbm9kZSBvZiB0aGUgbm9kZSBhdCBgaWRPcktleVBhdGhgXG4gKi9cbmZ1bmN0aW9uIGZpcnN0Q2hpbGQobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKTtcblxuICBjb25zdCBzdWJOb2RlID0gbm9kZS5nZXRJbihrZXlQYXRoKTtcbiAgaWYgKCFzdWJOb2RlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY2hpbGROb2RlS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KHN1Yk5vZGUpO1xuICBpZiAoIWNoaWxkTm9kZUtleSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaGlsZE5vZGVLZXkgPT09ICdub2RlJyAmJiBub2RlLmhhc0luKGtleVBhdGguY29uY2F0KFsnbm9kZSddKSkpIHtcbiAgICByZXR1cm4ga2V5UGF0aC5jb25jYXQoWydub2RlJ10pO1xuICB9XG5cbiAgaWYgKG5vZGUuaGFzSW4oa2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleSwgMF0pKSkge1xuICAgIHJldHVybiBrZXlQYXRoLmNvbmNhdChbY2hpbGROb2RlS2V5LCAwXSk7XG4gIH1cblxuICByZXR1cm47XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpcnN0Q2hpbGQ7XG4iLCJpbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXkgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBnZXRGaXJzdExldmVsQ29uY3JldGVDaGlsZHJlbihwYXJlbnQpIHtcbiAgY29uc3QgY2hpbGRyZW5LZXkgPSBnZXRDaGlsZE5vZGVLZXkocGFyZW50KTtcbiAgaWYgKCFjaGlsZHJlbktleSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGlmIChjaGlsZHJlbktleSA9PT0gJ25vZGUnKSB7XG4gICAgY29uc3QgY2hpbGROb2RlVHlwZSA9IHBhcmVudC5nZXRJbihbY2hpbGRyZW5LZXksICd0eXBlJ10pO1xuICAgIGlmIChjaGlsZE5vZGVUeXBlID09PSAnaHRtbC1lbGVtZW50JyB8fCBjaGlsZE5vZGVUeXBlID09PSAncmVhY3QtY29tcG9uZW50Jykge1xuICAgICAgcmV0dXJuIFtwYXJlbnQuZ2V0SW4oW2NoaWxkcmVuS2V5XSldXG4gICAgfVxuXG4gICAgcmV0dXJuIGdldEZpcnN0TGV2ZWxDb25jcmV0ZUNoaWxkcmVuKHBhcmVudC5nZXRJbihbY2hpbGRyZW5LZXldKSk7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbiA9IHBhcmVudC5nZXRJbihbY2hpbGRyZW5LZXldKTtcbiAgY29uc3QgY29uY3JldGVOb2RlID0gW107XG4gIChjaGlsZHJlbiB8fFtdKS5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgIGNvbnN0IGNoaWxkTm9kZVR5cGUgPSBjaGlsZC5nZXRJbihbJ3R5cGUnXSlcbiAgICBpZiAoY2hpbGROb2RlVHlwZSA9PT0gJ2h0bWwtZWxlbWVudCcgfHwgY2hpbGROb2RlVHlwZSA9PT0gJ3JlYWN0LWNvbXBvbmVudCcpIHtcbiAgICAgIGNvbmNyZXRlTm9kZS5wdXNoKGNoaWxkKVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbmNyZXRlTm9kZS5wdXNoKC4uLmdldEZpcnN0TGV2ZWxDb25jcmV0ZUNoaWxkcmVuKGNoaWxkKSk7XG4gIH0pO1xuXG4gIHJldHVybiBjb25jcmV0ZU5vZGU7XG59XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG5pbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXksIGV4aXN0cyB9IGZyb20gJy4vdXRpbHMnO1xuLyoqXG4gKiBAaWQgVHJlZVV0aWxzLWhhc0NoaWxkTm9kZXNcbiAqIEBsb29rdXAgaGFzQ2hpbGROb2Rlc1xuICpcbiAqICMjIyMgKm1ldGhvZCogaGFzQ2hpbGROb2RlcygpXG4gKlxuICogIyMjIyMjIFNpZ25hdHVyZTpcbiAqIGBgYGpzXG4gKiBoYXNDaGlsZE5vZGVzKFxuICogICAgc3RhdGU6IEltbXV0YWJsZS5JdGVyYWJsZSxcbiAqICAgIGlkT3JLZXlQYXRoOiBzdHJpbmd8SW1tdXRhYmxlLlNlcTxzdHJpbmd8bnVtYmVyPixcbiAqICk6IGJvb2xlYW5cbiAqIGBgYFxuICpcbiAqICMjIyMjIyBSZXR1cm5zOlxuICogUmV0dXJucyB3aGV0aGVyIHRoZSBub2RlIGF0IGBpZE9yS2V5UGF0aGAgaGFzIGNoaWxkcmVuLlxuICovXG5mdW5jdGlvbiBoYXNDaGlsZE5vZGVzKG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG5cbiAgaWYgKCFub2RlLmhhc0luKGtleVBhdGgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgY2hpbGRLZXkgPSBnZXRDaGlsZE5vZGVLZXkobm9kZS5nZXRJbihrZXlQYXRoKSk7XG4gIGlmICghY2hpbGRLZXkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbk5vZGVzID0gbm9kZS5nZXRJbihrZXlQYXRoLmNvbmNhdChbY2hpbGRLZXldKSk7XG5cbiAgcmV0dXJuIGV4aXN0cyhjaGlsZHJlbk5vZGVzKSAmJiBjaGlsZHJlbk5vZGVzLnNpemUgPiAwO1xufVxuXG5leHBvcnQgZGVmYXVsdCBoYXNDaGlsZE5vZGVzO1xuIiwiLyoqXG4gKlxuICogQHBhcmFtIHtJbW11dGFibGVOb2RlfSBub2RlXG4gKiBAcGFyYW0ge1NlcS5JbmRleGVkPHN0cmluZz59IGtleVBhdGhcbiAqIEByZXR1cm5zIG5vZGUgaWQgb3IgdW5kZWZpbmVkXG4gKi9cbmZ1bmN0aW9uIGlkKG5vZGUsIGtleVBhdGgpIHtcbiAgaWYgKCFub2RlLmdldEluKGtleVBhdGgpKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIG5vZGUuZ2V0SW4oa2V5UGF0aC5jb25jYXQoWydpZCddKSk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGlkO1xuIiwiaW1wb3J0IGJ5QXJiaXRyYXJ5IGZyb20gJy4vYnlBcmJpdHJhcnknO1xuaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5IH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKlxuICogQGlkIFRyZWVVdGlscy1sYXN0Q2hpbGRcbiAqIEBsb29rdXAgbGFzdENoaWxkXG4gKlxuICogIyMjIyAqbWV0aG9kKiBsYXN0Q2hpbGQoKVxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogbGFzdENoaWxkKFxuICogICAgc3RhdGU6IEltbXV0YWJsZS5JdGVyYWJsZSxcbiAqICAgIGlkT3JLZXlQYXRoOiBzdHJpbmd8SW1tdXRhYmxlLlNlcTxzdHJpbmd8bnVtYmVyPlxuICogKTogSW1tdXRhYmxlLlNlcTxzdHJpbmd8bnVtYmVyPlxuICogYGBgXG4gKlxuICogIyMjIyMjIFJldHVybnM6XG4gKiBSZXR1cm5zIHRoZSBsYXN0IGNoaWxkIG5vZGUgb2YgdGhlIG5vZGUgYXQgYGlkT3JLZXlQYXRoYFxuICovXG5mdW5jdGlvbiBsYXN0Q2hpbGQobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKTtcblxuICBjb25zdCBjaGlsZE5vZGUgPSBub2RlLmdldEluKGtleVBhdGgpO1xuICBpZiAoIWNoaWxkTm9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkTm9kZUtleSA9IGdldENoaWxkTm9kZUtleShjaGlsZE5vZGUpO1xuICBpZiAoIWNoaWxkTm9kZUtleSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGlmIChjaGlsZE5vZGVLZXkgPT09ICdub2RlJyAmJiBub2RlLmhhc0luKGtleVBhdGguY29uY2F0KFtub2RlXSkpKSB7XG4gICAgcmV0dXJuIG5vZGUuZ2V0SW4oa2V5UGF0aC5jb25jYXQoW25vZGVdKSk7XG4gIH1cblxuICB2YXIgaXRlbSA9IG5vZGUuZ2V0SW4oa2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleV0pKTtcbiAgaWYgKGl0ZW0gJiYgaXRlbS5zaXplID4gMCkge1xuICAgIHJldHVybiBrZXlQYXRoLmNvbmNhdChbY2hpbGROb2RlS2V5XSkuY29uY2F0KFtpdGVtLnNpemUgLSAxXSk7XG4gIH1cbiAgcmV0dXJuO1xufVxuXG5leHBvcnQgZGVmYXVsdCBsYXN0Q2hpbGQ7XG4iLCJpbXBvcnQgYnlBcmJpdHJhcnkgZnJvbSAnLi9ieUFyYml0cmFyeSc7XG4vKipcbiAqIEBpZCBUcmVlVXRpbHMtcHJldmlvdXNTaWJsaW5nXG4gKiBAbG9va3VwIHByZXZpb3VzU2libGluZ1xuICpcbiAqICMjIyMgKm1ldGhvZCogcHJldmlvdXNTaWJsaW5nKClcbiAqXG4gKiAjIyMjIyMgU2lnbmF0dXJlOlxuICogYGBganNcbiAqIHByZXZpb3VzU2libGluZyhcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqICk6IEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqIGBgYFxuICpcbiAqICMjIyMjIyBSZXR1cm5zOlxuICogUmV0dXJucyB0aGUgcHJldmlvdXMgc2libGluZyBub2RlIG9mIHRoZSBub2RlIGF0IGBpZE9yS2V5UGF0aGBcbiAqL1xuZnVuY3Rpb24gcHJldmlvdXNTaWJsaW5nKHN0YXRlLCBpZE9yS2V5UGF0aCkge1xuICBjb25zdCBrZXlQYXRoID0gYnlBcmJpdHJhcnkoc3RhdGUsIGlkT3JLZXlQYXRoKTtcbiAgY29uc3QgaW5kZXggPSBOdW1iZXIoa2V5UGF0aC5sYXN0KCkpO1xuICBpZiAoaXNOYU4oaW5kZXgpIHx8IGluZGV4ID09PSAwKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIGtleVBhdGguc2tpcExhc3QoMSkuY29uY2F0KFtpbmRleCAtIDFdKTtcbn1cbmV4cG9ydCBkZWZhdWx0IHByZXZpb3VzU2libGluZztcbiIsImltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCBwcmV2aW91c1NpYmxpbmcgZnJvbSAnLi9wcmV2aW91c1NpYmxpbmcnO1xuaW1wb3J0IGhhc0NoaWxkTm9kZXMgZnJvbSAnLi9oYXNDaGlsZE5vZGVzJztcbmltcG9ydCBsYXN0Q2hpbGQgZnJvbSAnLi9sYXN0Q2hpbGQnO1xuaW1wb3J0IHBhcmVudCBmcm9tICcuL3BhcmVudCc7XG5cbi8qKlxuICogQGlkIFRyZWVVdGlscy1sZWZ0XG4gKiBAbG9va3VwIGxlZnRcbiAqXG4gKiAjIyMjICptZXRob2QqIGxlZnQoKVxuICpcbiAqIFJldHVybnMgdGhlIGtleSBwYXRoIHRvIHRoZSBuZXh0IG5vZGUgdG8gdGhlIGxlZnQuIFRoZSBuZXh0IGxlZnQgbm9kZSBpcyBlaXRoZXI6XG4gKiAqIFRoZSBsYXN0IGRlc2NlbmRhbnQgb2YgdGhlIHByZXZpb3VzIHNpYmxpbmcgbm9kZS5cbiAqICogVGhlIHByZXZpb3VzIHNpYmxpbmcgbm9kZS5cbiAqICogVGhlIHBhcmVudCBub2RlLlxuICogKiBUaGUgbm9uZSB2YWx1ZVxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbm9kZVBhdGggPSB0cmVlVXRpbHMubGFzdERlc2NlbmRhbnQoc3RhdGUsICdyb290Jyk7XG4gKiB3aGlsZSAobm9kZVBhdGgpIHtcbiAqICAgIGNvbnNvbGUubG9nKG5vZGVQYXRoKTtcbiAqICAgIG5vZGVQYXRoID0gdHJlZVV0aWxzLmxlZnQoc3RhdGUsIG5vZGVQYXRoKTtcbiAqIH1cbiAqIC8vICdub2RlLTYnXG4gKiAvLyAnbm9kZS01J1xuICogLy8gJ25vZGUtNCdcbiAqIC8vICdub2RlLTMnXG4gKiAvLyAnbm9kZS0yJ1xuICogLy8gJ25vZGUtMSdcbiAqIC8vICdyb290J1xuICogYGBgXG4gKlxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogbGVmdChcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj4sXG4gKiApOiBJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIFJldHVybnMgdGhlIGtleSBwYXRoIHRvIHRoZSBub2RlIHRvIHRoZSByaWdodCBvZiB0aGUgb25lIGF0IGBpZE9yS2V5UGF0aGAuXG4gKi9cbmZ1bmN0aW9uIGxlZnQobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgY29uc3Qga2V5UGF0aCA9IGJ5QXJiaXRyYXJ5KG5vZGUsIGlkT3JLZXlQYXRoKTtcbiAgbGV0IGxhc3RDaGlsZFBhdGggPSBwcmV2aW91c1NpYmxpbmcobm9kZSwga2V5UGF0aCk7XG5cbiAgd2hpbGUgKGxhc3RDaGlsZFBhdGgpIHtcbiAgICBpZiAoIWhhc0NoaWxkTm9kZXMobm9kZSwgbGFzdENoaWxkUGF0aCkpIHtcbiAgICAgIHJldHVybiBsYXN0Q2hpbGRQYXRoO1xuICAgIH1cbiAgICBsYXN0Q2hpbGRQYXRoID0gbGFzdENoaWxkKG5vZGUsIGxhc3RDaGlsZFBhdGgpO1xuICB9XG5cbiAgY29uc3QgcGFyZW50UGF0aCA9IHBhcmVudChub2RlLCBrZXlQYXRoKTtcblxuICBpZiAocGFyZW50UGF0aCAmJiBwYXJlbnRQYXRoLnNpemUpIHtcbiAgICByZXR1cm4gcGFyZW50UGF0aDtcbiAgfVxuXG4gIHJldHVybjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbGVmdDtcbiIsImltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcblxuLyoqXG4gKiBAaWQgVHJlZVV0aWxzLW5leHRTaWJsaW5nXG4gKiBAbG9va3VwIG5leHRTaWJsaW5nXG4gKlxuICogIyMjIyAqbWV0aG9kKiBuZXh0U2libGluZygpXG4gKlxuICogIyMjIyMjIFNpZ25hdHVyZTpcbiAqIGBgYGpzXG4gKiBuZXh0U2libGluZyhcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqICk6IEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj5cbiAqIGBgYFxuICpcbiAqICMjIyMjIyBSZXR1cm5zOlxuICogUmV0dXJucyB0aGUgbmV4dCBzaWJsaW5nIG5vZGUgb2YgdGhlIG5vZGUgYXQgYGlkT3JLZXlQYXRoYFxuICovXG5mdW5jdGlvbiBuZXh0U2libGluZyhub2RlLCBpZE9yS2V5UGF0aCkge1xuICBjb25zdCBrZXlQYXRoID0gYnlBcmJpdHJhcnkobm9kZSwgaWRPcktleVBhdGgpO1xuICBjb25zdCBpbmRleCA9IE51bWJlcihrZXlQYXRoLmxhc3QoKSk7XG4gIGlmIChpc05hTihpbmRleCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBuZXh0U2libGluZ1BhdGggPSBrZXlQYXRoLnNraXBMYXN0KDEpLmNvbmNhdChpbmRleCArIDEpO1xuICBpZiAobm9kZS5oYXNJbihuZXh0U2libGluZ1BhdGgpKSB7XG4gICAgcmV0dXJuIG5leHRTaWJsaW5nUGF0aDtcbiAgfVxuICByZXR1cm47XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5leHRTaWJsaW5nO1xuIiwiaW1wb3J0IHsgZ2V0Q2hpbGROb2RlS2V5LCBleGlzdHMgfSBmcm9tICcuL3V0aWxzJztcbi8qKlxuICogQGlkIFRyZWVVdGlscy1oYXNDaGlsZE5vZGVzXG4gKiBAbG9va3VwIGhhc0NoaWxkTm9kZXNcbiAqXG4gKiAjIyMjICptZXRob2QqIGhhc0NoaWxkTm9kZXMoKVxuICpcbiAqICMjIyMjIyBTaWduYXR1cmU6XG4gKiBgYGBqc1xuICogaGFzQ2hpbGROb2RlcyhcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj4sXG4gKiApOiBib29sZWFuXG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIFJldHVybnMgd2hldGhlciB0aGUgbm9kZSBhdCBgaWRPcktleVBhdGhgIGhhcyBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gbm9kZUhhc0NoaWxkTm9kZXMobm9kZSkge1xuICBjb25zdCBjaGlsZEtleSA9IGdldENoaWxkTm9kZUtleShub2RlKTtcbiAgaWYgKCFjaGlsZEtleSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkcmVuTm9kZXMgPSBub2RlLmdldEluKFtjaGlsZEtleV0pO1xuXG4gIHJldHVybiBleGlzdHMoY2hpbGRyZW5Ob2RlcykgJiYgY2hpbGRyZW5Ob2Rlcy5zaXplID4gMDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgbm9kZUhhc0NoaWxkTm9kZXM7XG4iLCJpbXBvcnQgeyBMaXN0IH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB3YWxrIGZyb20gJy4vd2Fsayc7XG5cbi8qKlxuICpcbiAqIEBwYXJhbSB7SW1tdXRhYmxlfSBub2RlXG4gKiBAcmV0dXJucyBrZXlQYXRoIGxpc3Qgb2YgYWxsIG5vZGVzXG4gKi9cbmZ1bmN0aW9uIG5vZGVzKG5vZGUpIHtcbiAgY29uc3Qgbm9kZUtleVBhdGhzID0gd2Fsayhub2RlLCAoYWNjLCBrZXlQYXRoKSA9PiB7XG4gICAgcmV0dXJuIExpc3QuaXNMaXN0KGFjYykgPyBhY2MucHVzaChrZXlQYXRoKSA6IExpc3Qub2Yoa2V5UGF0aCk7XG4gIH0pO1xuXG4gIHJldHVybiBub2RlS2V5UGF0aHMgPyBub2RlS2V5UGF0aHMgOiBMaXN0Lm9mKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5vZGVzO1xuIiwiaW1wb3J0IHsgU2VxIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCBwYXJlbnQgZnJvbSAnLi9wYXJlbnQnO1xuXG5mdW5jdGlvbiBwYXJlbnRJZHNTZXEobm9kZSwgaWRPcktleVBhdGgpIHtcbiAgbGV0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG4gIGlmICgha2V5UGF0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGxldCBpZFBhdGggPSBTZXEuSW5kZXhlZCgpO1xuICB3aGlsZSAoa2V5UGF0aC5zaXplKSB7XG4gICAga2V5UGF0aCA9IHBhcmVudChub2RlLCBrZXlQYXRoKTtcbiAgICBpZFBhdGggPSBpZFBhdGguY29uY2F0KFtub2RlLmdldEluKGtleVBhdGguY29uY2F0KFsnaWQnXSkpXSk7XG4gIH1cblxuICByZXR1cm4gaWRQYXRoLnJldmVyc2UoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGFyZW50SWRzU2VxO1xuIiwiaW1wb3J0IGZpcnN0Q2hpbGQgZnJvbSAnLi9maXJzdENoaWxkJztcbmltcG9ydCBieUFyYml0cmFyeSBmcm9tICcuL2J5QXJiaXRyYXJ5JztcbmltcG9ydCBuZXh0U2libGluZyBmcm9tICcuL25leHRTaWJsaW5nJztcbmltcG9ydCBwYXJlbnQgZnJvbSAnLi9wYXJlbnQnO1xuXG4vKipcbiAqIEBpZCBUcmVlVXRpbHMtcmlnaHRcbiAqIEBsb29rdXAgcmlnaHRcbiAqXG4gKiAjIyMjICptZXRob2QqIHJpZ2h0KClcbiAqXG4gKiBSZXR1cm5zIHRoZSBrZXkgcGF0aCB0byB0aGUgbmV4dCBub2RlIHRvIHRoZSByaWdodC4gVGhlIG5leHQgcmlnaHQgbm9kZSBpcyBlaXRoZXI6XG4gKiAqIFRoZSBmaXJzdCBjaGlsZCBub2RlLlxuICogKiBUaGUgbmV4dCBzaWJsaW5nLlxuICogKiBUaGUgbmV4dCBzaWJsaW5nIG9mIHRoZSBmaXJzdCBhbmNlc3RvciB0aGF0IGluIGZhY3QgaGFzIGEgbmV4dCBzaWJsaW5nLlxuICogKiBUaGUgbm9uZSB2YWx1ZVxuICpcbiAqIGBgYGpzXG4gKiB2YXIgbm9kZVBhdGggPSB0cmVlVXRpbHMuYnlJZChzdGF0ZSwgJ3Jvb3QnKTtcbiAqIHdoaWxlIChub2RlUGF0aCkge1xuICogICAgY29uc29sZS5sb2cobm9kZVBhdGgpO1xuICogICAgbm9kZVBhdGggPSB0cmVlVXRpbHMucmlnaHQoc3RhdGUsIG5vZGVQYXRoKTtcbiAqIH1cbiAqIC8vICdyb290J1xuICogLy8gJ25vZGUtMSdcbiAqIC8vICdub2RlLTInXG4gKiAvLyAnbm9kZS0zJ1xuICogLy8gJ25vZGUtNCdcbiAqIC8vICdub2RlLTUnXG4gKiAvLyAnbm9kZS02J1xuICogYGBgXG4gKlxuICogIyMjIyMjIFNpZ25hdHVyZTpcbiAqIGBgYGpzXG4gKiByaWdodChcbiAqICAgIHN0YXRlOiBJbW11dGFibGUuSXRlcmFibGUsXG4gKiAgICBpZE9yS2V5UGF0aDogc3RyaW5nfEltbXV0YWJsZS5TZXE8c3RyaW5nfG51bWJlcj4sXG4gKiApOiBJbW11dGFibGUuU2VxPHN0cmluZ3xudW1iZXI+XG4gKiBgYGBcbiAqXG4gKiAjIyMjIyMgUmV0dXJuczpcbiAqIFJldHVybnMgdGhlIGtleSBwYXRoIHRvIHRoZSBub2RlIHRvIHRoZSByaWdodCBvZiB0aGUgb25lIGF0IGBpZE9yS2V5UGF0aGAuXG4gKi9cbmZ1bmN0aW9uIHJpZ2h0KG5vZGUsIGlkT3JLZXlQYXRoKSB7XG4gIGNvbnN0IGtleVBhdGggPSBieUFyYml0cmFyeShub2RlLCBpZE9yS2V5UGF0aCk7XG4gIGNvbnN0IGZpcnN0Q2hpbGRQYXRoID0gZmlyc3RDaGlsZChub2RlLCBrZXlQYXRoKTtcblxuICBpZiAoZmlyc3RDaGlsZFBhdGgpIHtcbiAgICByZXR1cm4gZmlyc3RDaGlsZFBhdGg7XG4gIH1cblxuICBjb25zdCBuZXh0U2libGluZ1BhdGggPSBuZXh0U2libGluZyhub2RlLCBrZXlQYXRoKTtcbiAgaWYgKG5leHRTaWJsaW5nUGF0aCkge1xuICAgIHJldHVybiBuZXh0U2libGluZ1BhdGg7XG4gIH1cblxuICBsZXQgcGFyZW50UGF0aCA9IHBhcmVudChub2RlLCBrZXlQYXRoKTtcbiAgbGV0IG5leHRTaWJsaW5nT2ZQYXJlbnQ7XG5cbiAgd2hpbGUgKHBhcmVudFBhdGggJiYgcGFyZW50UGF0aC5zaXplID49IDApIHtcbiAgICBuZXh0U2libGluZ09mUGFyZW50ID0gbmV4dFNpYmxpbmcobm9kZSwgcGFyZW50UGF0aCk7XG4gICAgaWYgKG5leHRTaWJsaW5nT2ZQYXJlbnQpIHtcbiAgICAgIHJldHVybiBuZXh0U2libGluZ09mUGFyZW50O1xuICAgIH1cbiAgICBwYXJlbnRQYXRoID0gcGFyZW50KG5vZGUsIHBhcmVudFBhdGgpO1xuICB9XG5cbiAgcmV0dXJuO1xufVxuXG5leHBvcnQgZGVmYXVsdCByaWdodDtcbiIsImltcG9ydCB7IGZyb21KUyB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQga2V5UGF0aEJ5SWQgZnJvbSAnLi9yYXcva2V5UGF0aEJ5SWQnO1xuaW1wb3J0IGhhc0NoaWxkTm9kZXMgZnJvbSAnLi9yYXcvaGFzQ2hpbGROb2Rlcyc7XG5pbXBvcnQgeyBzZXRJbiB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgeyBnZXRDaGlsZE5vZGVLZXkgfSBmcm9tICcuL3Jhdy91dGlscyc7XG5pbXBvcnQgeyBJdGVyYWJsZSB9IGZyb20gJ2ltbXV0YWJsZSc7XG5cbmZ1bmN0aW9uIGFwcGVuZENoaWxkKHNjaGVtYU5vZGUsIHBhcmVudElELCBjaGlsZCkge1xuICBsZXQgbm9kZSA9IGZyb21KUyhzY2hlbWFOb2RlKTtcbiAgY29uc3Qga2V5UGF0aCA9IGtleVBhdGhCeUlkKG5vZGUsIHBhcmVudElEKTtcbiAgaWYgKCFrZXlQYXRoKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgcGFyZW50Tm9kZSA9IG5vZGUuZ2V0SW4oa2V5UGF0aCk7XG4gIGlmICghcGFyZW50Tm9kZSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNoaWxkTm9kZUtleSA9IGdldENoaWxkTm9kZUtleShwYXJlbnROb2RlKTtcbiAgaWYgKCFjaGlsZE5vZGVLZXkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZiAoY2hpbGROb2RlS2V5ID09PSAnbm9kZScpIHtcbiAgICByZXR1cm4gc2V0SW4obm9kZSwga2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleV0pLCBjaGlsZCkudG9KUygpO1xuICB9XG5cbiAgY29uc3QgY2hpbGRyZW5LZXlQYXRoID0ga2V5UGF0aC5jb25jYXQoW2NoaWxkTm9kZUtleV0pO1xuICBpZiAoIWhhc0NoaWxkTm9kZXMobm9kZSwga2V5UGF0aCkpIHtcbiAgICBub2RlID0gc2V0SW4obm9kZSwgY2hpbGRyZW5LZXlQYXRoLCBbXSk7XG4gIH1cblxuICBjb25zdCBpdGVtID0gbm9kZS5nZXRJbihjaGlsZHJlbktleVBhdGgpO1xuICBjb25zdCBzaXplID0gSXRlcmFibGUuaXNJdGVyYWJsZShpdGVtKSA/IGl0ZW0uc2l6ZSA6IGl0ZW0ubGVuZ3RoO1xuXG4gIHJldHVybiBub2RlLnNldEluKGNoaWxkcmVuS2V5UGF0aC5jb25jYXQoW3NpemVdKSwgY2hpbGQpLnRvSlMoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYXBwZW5kQ2hpbGQ7XG4iLCJpbXBvcnQgeyBmcm9tSlMsIHJlbW92ZUluIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBrZXlQYXRoQnlJZCBmcm9tICcuL3Jhdy9rZXlQYXRoQnlJZCc7XG5cbmZ1bmN0aW9uIGRlbGV0ZUJ5SUQoc2NoZW1hTm9kZSwgaWQpIHtcbiAgY29uc3Qgbm9kZSA9IGZyb21KUyhzY2hlbWFOb2RlKTtcbiAgY29uc3Qga2V5UGF0aCA9IGtleVBhdGhCeUlkKG5vZGUsIGlkKTtcbiAgaWYgKCFrZXlQYXRoKSB7XG4gICAgcmV0dXJuIHNjaGVtYU5vZGU7XG4gIH1cblxuICByZXR1cm4gcmVtb3ZlSW4obm9kZSwga2V5UGF0aCkudG9KUygpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBkZWxldGVCeUlEO1xuIiwiaW1wb3J0IHsgZnJvbUpTIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBrZXlQYXRoQnlJZCBmcm9tICcuL3Jhdy9rZXlQYXRoQnlJZCc7XG5cbmZ1bmN0aW9uIGZpbmROb2RlQnlJRChzY2hlbWFOb2RlLCBpZCkge1xuICBjb25zdCBub2RlID0gZnJvbUpTKHNjaGVtYU5vZGUpO1xuICBjb25zdCBrZXlQYXRoID0ga2V5UGF0aEJ5SWQobm9kZSwgaWQpO1xuICBpZiAoIWtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gbm9kZS5nZXRJbihrZXlQYXRoKS50b0pTKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZpbmROb2RlQnlJRDtcbiIsImltcG9ydCB7IFNlcSwgZnJvbUpTIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBwYXJlbnRJZHNTZXEgZnJvbSAnLi9yYXcvcGFyZW50SWRzU2VxJztcblxuZnVuY3Rpb24gZ2V0Tm9kZVBhcmVudElEcyhzY2hlbWFOb2RlLCBub2RlSUQpIHtcbiAgY29uc3Qgbm9kZSA9IGZyb21KUyhzY2hlbWFOb2RlKTtcblxuICBjb25zdCBpZHMgPSBwYXJlbnRJZHNTZXEobm9kZSwgbm9kZUlEKTtcblxuICByZXR1cm4gU2VxLmlzU2VxKGlkcykgPyBpZHMudG9KUygpIDogdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXROb2RlUGFyZW50SURzO1xuIiwiaW1wb3J0IGdldE5vZGVQYXJlbnRJRHMgZnJvbSAnLi9nZXROb2RlUGFyZW50SURzJztcbmltcG9ydCBmaW5kTm9kZUJ5SUQgZnJvbSAnLi9maW5kTm9kZUJ5SUQnO1xuXG5mdW5jdGlvbiBnZXROb2RlUGFyZW50cyhzY2hlbWFOb2RlLCBpZCkge1xuICBjb25zdCBwYXJlbnRJRHMgPSBnZXROb2RlUGFyZW50SURzKHNjaGVtYU5vZGUsIGlkKTtcbiAgaWYgKCFwYXJlbnRJRHMpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gcGFyZW50SURzLm1hcCgocGFyZW50SUQpID0+IGZpbmROb2RlQnlJRChzY2hlbWFOb2RlLCBwYXJlbnRJRCkpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBnZXROb2RlUGFyZW50cztcbiIsImltcG9ydCB7IGZyb21KUywgbWVyZ2UgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IGtleVBhdGhCeUlkIGZyb20gJy4vcmF3L2tleVBhdGhCeUlkJztcblxuZnVuY3Rpb24gcGF0Y2hOb2RlKHNjaGVtYU5vZGUsIHBhcnRpYWxOb2RlKSB7XG4gIGNvbnN0IG5vZGUgPSBmcm9tSlMoc2NoZW1hTm9kZSk7XG4gIGNvbnN0IGtleVBhdGggPSBrZXlQYXRoQnlJZChub2RlLCBwYXJ0aWFsTm9kZS5pZCk7XG4gIGlmICgha2V5UGF0aCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IG5vZGVUb1BhdGNoID0gbm9kZS5nZXRJbihrZXlQYXRoKTtcbiAgaWYgKCFub2RlVG9QYXRjaCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBub2RlLnNldEluKGtleVBhdGgsIG1lcmdlKG5vZGVUb1BhdGNoLCBwYXJ0aWFsTm9kZSkpLnRvSlMoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgcGF0Y2hOb2RlO1xuIiwiaW1wb3J0IHsgTWFwIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7IGlzSW1tdXRhYmxlIH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCB7IGZyb21KUyB9IGZyb20gJ2ltbXV0YWJsZSc7XG5pbXBvcnQgd2FsayBmcm9tICcuL3Jhdy93YWxrJztcblxuY29uc3QgTk9ERV9UWVBFX1RSQVZFTEVSX01BUCA9IHtcbiAgJ2h0bWwtZWxlbWVudCc6ICdodG1sTm9kZScsXG4gICdyZWFjdC1jb21wb25lbnQnOiAncmVhY3RDb21wb25lbnROb2RlJyxcbiAgJ2xvb3AtY29udGFpbmVyJzogJ2xvb3BDb250YWluZXJOb2RlJyxcbiAgJ2NvbXBvc2VkLW5vZGUnOiAnY29tcG9zZWROb2RlJyxcbiAgJ3JlZi1ub2RlJzogJ3JlZk5vZGUnLFxuICAnanN4LW5vZGUnOiAnanN4Tm9kZScsXG4gICdyb3V0ZS1ub2RlJzogJ3JvdXRlTm9kZScsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0cmF2ZWwoc2NoZW1hTm9kZSwgVmlzaXRvcnMpIHtcbiAgY29uc3Qgbm9kZSA9IGZyb21KUyhzY2hlbWFOb2RlKTtcbiAgY29uc3QgX25ld1Jvb3QgPSB3YWxrKG5vZGUsIChuZXdSb290LCBrZXlQYXRoKSA9PiB7XG4gICAgaWYgKCFuZXdSb290KSB7XG4gICAgICBuZXdSb290ID0gbm9kZTtcbiAgICB9XG5cbiAgICBjb25zdCBub2RlVHlwZSA9IG5vZGUuZ2V0SW4oa2V5UGF0aC5jb25jYXQoWyd0eXBlJ10pKTtcbiAgICBjb25zdCBjdXJyZW50Tm9kZSA9IG5vZGUuZ2V0SW4oa2V5UGF0aCkudG9KUygpO1xuICAgIGNvbnN0IG5ld05vZGUgPSBWaXNpdG9yc1tOT0RFX1RZUEVfVFJBVkVMRVJfTUFQW25vZGVUeXBlXV0/LihjdXJyZW50Tm9kZSk7XG4gICAgaWYgKG5ld05vZGUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmV3Um9vdCA9IG5ld1Jvb3Quc2V0SW4oa2V5UGF0aCwgbmV3Tm9kZSk7XG4gICAgICBpZiAoIWlzSW1tdXRhYmxlKG5ld1Jvb3QpKSB7XG4gICAgICAgIG5ld1Jvb3QgPSBNYXAobmV3Um9vdCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ld1Jvb3Q7XG4gIH0pO1xuXG4gIHJldHVybiBfbmV3Um9vdC50b0pTKCk7XG59XG4iLCJpbXBvcnQgeyBMaXN0IH0gZnJvbSAnaW1tdXRhYmxlJztcbmltcG9ydCBrZXlQYXRoQnlJZCBmcm9tICcuL2tleVBhdGhCeUlkJztcbmltcG9ydCB7IGdldENoaWxkTm9kZUtleSB9IGZyb20gJy4vdXRpbHMnO1xuXG5mdW5jdGlvbiBpbnNlcnRBdChyb290LCBwYXJlbnROb2RlSUQsIGluZGV4LCBub2RlKSB7XG4gIGNvbnN0IHBhcmVudEtleVBhdGggPSBrZXlQYXRoQnlJZChyb290LCBwYXJlbnROb2RlSUQpO1xuICBpZiAoIXBhcmVudEtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBwYXJlbnROb2RlID0gcm9vdC5nZXRJbihwYXJlbnRLZXlQYXRoKTtcbiAgY29uc3QgY2hpbGROb2RlS2V5ID0gZ2V0Q2hpbGROb2RlS2V5KHBhcmVudE5vZGUpO1xuICBjb25zdCBjaGlsZHJlbktleVBhdGggPSBwYXJlbnRLZXlQYXRoLmNvbmNhdChbY2hpbGROb2RlS2V5XSk7XG4gIGlmIChjaGlsZE5vZGVLZXkgPT09ICdub2RlJykge1xuICAgIHJldHVybiByb290LnNldEluKHJvb3QsIGNoaWxkcmVuS2V5UGF0aCwgbm9kZSk7XG4gIH1cblxuICBjb25zdCBjaGlsZHJlbk5vZGVzID0gcm9vdC5nZXRJbihjaGlsZHJlbktleVBhdGgpIHx8IExpc3QoKTtcbiAgY29uc3QgbGVmdFNpZGVOb2RlcyA9IGNoaWxkcmVuTm9kZXMuc2xpY2UoMCwgaW5kZXgpO1xuICBjb25zdCByaWdodFNpZGVOb2RlcyA9IGNoaWxkcmVuTm9kZXMuc2xpY2UoaW5kZXgpO1xuXG4gIGNvbnN0IGFsbENoaWxkcmVuTm9kZXMgPSBsZWZ0U2lkZU5vZGVzLmNvbmNhdChbbm9kZV0sIHJpZ2h0U2lkZU5vZGVzKTtcbiAgcmV0dXJuIHJvb3Quc2V0SW4oY2hpbGRyZW5LZXlQYXRoLCBhbGxDaGlsZHJlbk5vZGVzKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0QXQ7XG4iLCJpbXBvcnQgeyBmcm9tSlMgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IHBhcmVudCBmcm9tICcuL3Jhdy9wYXJlbnQnO1xuaW1wb3J0IF9pbnNlcnRBdCBmcm9tICcuL3Jhdy9pbnNlcnRBdCc7XG5pbXBvcnQgX2tleVBhdGhCeUlkIGZyb20gJy4vcmF3L2tleVBhdGhCeUlkJztcblxuZnVuY3Rpb24gaW5zZXJ0QmVmb3JlKHJvb3QsIHJlZmVyZW5jZU5vZGVJRCwgbm9kZSkge1xuICBsZXQgX3Jvb3QgPSBmcm9tSlMocm9vdCk7XG5cbiAgY29uc3QgcmVmZXJlbmNlTm9kZUtleVBhdGggPSBfa2V5UGF0aEJ5SWQoX3Jvb3QsIHJlZmVyZW5jZU5vZGVJRCk7XG4gIGlmICghcmVmZXJlbmNlTm9kZUtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWZlcmVuY2VOb2RlSW5kZXggPSByZWZlcmVuY2VOb2RlS2V5UGF0aC5sYXN0KCk7XG4gIGNvbnN0IHBhcmVudEtleVBhdGggPSBwYXJlbnQoX3Jvb3QsIHJlZmVyZW5jZU5vZGVJRCk7XG4gIGNvbnN0IHBhcmVudE5vZGVJRCA9IF9yb290LmdldEluKHBhcmVudEtleVBhdGguY29uY2F0KFsnaWQnXSkpO1xuICBfcm9vdCA9IF9pbnNlcnRBdChfcm9vdCwgcGFyZW50Tm9kZUlELCByZWZlcmVuY2VOb2RlSW5kZXgsIG5vZGUpO1xuXG4gIGlmICghX3Jvb3QpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICByZXR1cm4gX3Jvb3QudG9KUygpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBpbnNlcnRCZWZvcmU7XG4iLCJpbXBvcnQgeyBmcm9tSlMgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IF9wYXJlbnQgZnJvbSAnLi9yYXcvcGFyZW50JztcbmltcG9ydCBfa2V5UGF0aEJ5SWQgZnJvbSAnLi9yYXcva2V5UGF0aEJ5SWQnO1xuaW1wb3J0IF9pbnNlcnRBdCBmcm9tICcuL3Jhdy9pbnNlcnRBdCc7XG5cbmZ1bmN0aW9uIGluc2VydEFmdGVyKHJvb3QsIHJlZmVyZW5jZU5vZGVJRCwgbm9kZSkge1xuICBsZXQgX3Jvb3QgPSBmcm9tSlMocm9vdCk7XG5cbiAgY29uc3QgcmVmZXJlbmNlTm9kZUtleVBhdGggPSBfa2V5UGF0aEJ5SWQoX3Jvb3QsIHJlZmVyZW5jZU5vZGVJRCk7XG4gIGlmICghcmVmZXJlbmNlTm9kZUtleVBhdGgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCByZWZlcmVuY2VOb2RlSW5kZXggPSByZWZlcmVuY2VOb2RlS2V5UGF0aC5sYXN0KCk7XG4gIGNvbnN0IHBhcmVudEtleVBhdGggPSBfcGFyZW50KF9yb290LCByZWZlcmVuY2VOb2RlSUQpO1xuICBjb25zdCBwYXJlbnROb2RlSUQgPSBfcm9vdC5nZXRJbihwYXJlbnRLZXlQYXRoLmNvbmNhdChbJ2lkJ10pKTtcblxuICBfcm9vdCA9IF9pbnNlcnRBdChfcm9vdCwgcGFyZW50Tm9kZUlELCByZWZlcmVuY2VOb2RlSW5kZXggKyAxLCBub2RlKTtcblxuICBpZiAoIV9yb290KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgcmV0dXJuIF9yb290LnRvSlMoKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaW5zZXJ0QWZ0ZXI7XG4iLCJpbXBvcnQgeyBmcm9tSlMgfSBmcm9tICdpbW11dGFibGUnO1xuaW1wb3J0IF9pbnNlcnRBdCBmcm9tICcuL3Jhdy9pbnNlcnRBdCc7XG5cbmZ1bmN0aW9uIGluc2VydEF0KHJvb3QsIHBhcmVudE5vZGVJRCwgaW5kZXgsIG5vZGUpIHtcbiAgbGV0IF9yb290ID0gZnJvbUpTKHJvb3QpO1xuXG4gIF9yb290ID0gX2luc2VydEF0KF9yb290LCBwYXJlbnROb2RlSUQsIGluZGV4LCBub2RlKTtcbiAgaWYgKCFfcm9vdCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHJldHVybiBfcm9vdC50b0pTKCk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGluc2VydEF0O1xuIl0sIm5hbWVzIjpbImJ5QXJiaXRyYXJ5Iiwic2V0SW4iLCJpbnNlcnRBdCIsIl9rZXlQYXRoQnlJZCIsIl9pbnNlcnRBdCIsIl9wYXJlbnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQUFBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtNQUNBO01BQ0E7TUFDQTtN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
