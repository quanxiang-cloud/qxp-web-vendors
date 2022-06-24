/* rxjs@7.5.2 */
System.register([], (function (exports) {
    'use strict';
    return {
        execute: (function () {

            exports({
                $: empty,
                D: pipe,
                E: noop,
                F: identity,
                G: isObservable,
                H: lastValueFrom,
                I: firstValueFrom,
                Q: bindCallback,
                W: bindNodeCallback,
                X: combineLatest$1,
                Y: concat$1,
                Z: connectable,
                _: defer,
                a: applyMixins,
                a$: isEmpty,
                a0: forkJoin,
                a1: from,
                a2: fromEvent,
                a3: fromEventPattern,
                a4: generate,
                a5: iif,
                a6: interval,
                a7: merge$1,
                a8: never,
                a9: of,
                aA: concatMapTo,
                aB: concatWith,
                aC: connect,
                aD: count,
                aE: debounce,
                aF: debounceTime,
                aG: defaultIfEmpty,
                aH: delay,
                aI: delayWhen,
                aJ: dematerialize,
                aK: distinct,
                aL: distinctUntilChanged,
                aM: distinctUntilKeyChanged,
                aN: elementAt,
                aO: endWith,
                aP: every,
                aR: exhaustAll,
                aS: exhaustMap,
                aT: expand,
                aU: filter,
                aV: finalize,
                aW: find,
                aX: findIndex,
                aY: first,
                aZ: groupBy,
                a_: ignoreElements,
                aa: onErrorResumeNext,
                ab: pairs,
                ac: partition$1,
                ad: race$1,
                ae: range,
                af: throwError,
                ag: timer,
                ah: using,
                ai: zip$1,
                aj: scheduled,
                an: audit,
                ao: auditTime,
                ap: buffer,
                aq: bufferCount,
                ar: bufferTime,
                as: bufferToggle,
                at: bufferWhen,
                au: catchError,
                aw: combineLatestAll,
                ax: combineLatestWith,
                ay: concatAll,
                az: concatMap,
                b$: zipAll,
                b0: last,
                b1: map,
                b2: mapTo,
                b3: materialize,
                b4: max,
                b5: mergeAll,
                b7: mergeMap,
                b8: mergeMapTo,
                b9: mergeScan,
                bA: skipUntil,
                bB: skipWhile,
                bC: startWith,
                bD: subscribeOn,
                bE: switchAll,
                bF: switchMap,
                bG: switchMapTo,
                bH: switchScan,
                bI: take,
                bJ: takeLast,
                bK: takeUntil,
                bL: takeWhile,
                bM: tap,
                bN: throttle,
                bO: throttleTime,
                bP: throwIfEmpty,
                bQ: timeInterval,
                bR: timeout,
                bS: timeoutWith,
                bT: timestamp,
                bU: toArray,
                bV: window,
                bW: windowCount,
                bX: windowTime,
                bY: windowToggle,
                bZ: windowWhen,
                b_: withLatestFrom,
                ba: mergeWith,
                bb: min,
                bc: multicast,
                bd: observeOn,
                be: pairwise,
                bf: pluck,
                bg: publish,
                bh: publishBehavior,
                bi: publishLast,
                bj: publishReplay,
                bk: raceWith,
                bl: reduce,
                bm: repeat,
                bn: repeatWhen,
                bo: retry,
                bp: retryWhen,
                bq: refCount,
                br: sample,
                bs: sampleTime,
                bt: scan,
                bu: sequenceEqual,
                bv: share,
                bw: shareReplay,
                bx: single,
                by: skip,
                bz: skipLast,
                c0: zipWith,
                c1: combineLatest,
                c2: concat,
                c3: merge,
                c4: onErrorResumeNext$1,
                c5: partition,
                c6: race,
                c7: zip,
                cc: fromFetch,
                cd: webSocket,
                e: errorNotification,
                k: animationFrames,
                n: nextNotification,
                o: observeNotification
            });

            function isFunction(value) {
                return typeof value === 'function';
            }

            function createErrorClass(createImpl) {
                const _super = (instance) => {
                    Error.call(instance);
                    instance.stack = new Error().stack;
                };
                const ctorFunc = createImpl(_super);
                ctorFunc.prototype = Object.create(Error.prototype);
                ctorFunc.prototype.constructor = ctorFunc;
                return ctorFunc;
            }

            const UnsubscriptionError = exports('U', createErrorClass((_super) => function UnsubscriptionErrorImpl(errors) {
                _super(this);
                this.message = errors
                    ? `${errors.length} errors occurred during unsubscription:
${errors.map((err, i) => `${i + 1}) ${err.toString()}`).join('\n  ')}`
                    : '';
                this.name = 'UnsubscriptionError';
                this.errors = errors;
            }));

            function arrRemove(arr, item) {
                if (arr) {
                    const index = arr.indexOf(item);
                    0 <= index && arr.splice(index, 1);
                }
            }

            class Subscription {
                constructor(initialTeardown) {
                    this.initialTeardown = initialTeardown;
                    this.closed = false;
                    this._parentage = null;
                    this._teardowns = null;
                }
                unsubscribe() {
                    let errors;
                    if (!this.closed) {
                        this.closed = true;
                        const { _parentage } = this;
                        if (_parentage) {
                            this._parentage = null;
                            if (Array.isArray(_parentage)) {
                                for (const parent of _parentage) {
                                    parent.remove(this);
                                }
                            }
                            else {
                                _parentage.remove(this);
                            }
                        }
                        const { initialTeardown } = this;
                        if (isFunction(initialTeardown)) {
                            try {
                                initialTeardown();
                            }
                            catch (e) {
                                errors = e instanceof UnsubscriptionError ? e.errors : [e];
                            }
                        }
                        const { _teardowns } = this;
                        if (_teardowns) {
                            this._teardowns = null;
                            for (const teardown of _teardowns) {
                                try {
                                    execTeardown(teardown);
                                }
                                catch (err) {
                                    errors = errors !== null && errors !== void 0 ? errors : [];
                                    if (err instanceof UnsubscriptionError) {
                                        errors = [...errors, ...err.errors];
                                    }
                                    else {
                                        errors.push(err);
                                    }
                                }
                            }
                        }
                        if (errors) {
                            throw new UnsubscriptionError(errors);
                        }
                    }
                }
                add(teardown) {
                    var _a;
                    if (teardown && teardown !== this) {
                        if (this.closed) {
                            execTeardown(teardown);
                        }
                        else {
                            if (teardown instanceof Subscription) {
                                if (teardown.closed || teardown._hasParent(this)) {
                                    return;
                                }
                                teardown._addParent(this);
                            }
                            (this._teardowns = (_a = this._teardowns) !== null && _a !== void 0 ? _a : []).push(teardown);
                        }
                    }
                }
                _hasParent(parent) {
                    const { _parentage } = this;
                    return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
                }
                _addParent(parent) {
                    const { _parentage } = this;
                    this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
                }
                _removeParent(parent) {
                    const { _parentage } = this;
                    if (_parentage === parent) {
                        this._parentage = null;
                    }
                    else if (Array.isArray(_parentage)) {
                        arrRemove(_parentage, parent);
                    }
                }
                remove(teardown) {
                    const { _teardowns } = this;
                    _teardowns && arrRemove(_teardowns, teardown);
                    if (teardown instanceof Subscription) {
                        teardown._removeParent(this);
                    }
                }
            } exports('S', Subscription);
            Subscription.EMPTY = (() => {
                const empty = new Subscription();
                empty.closed = true;
                return empty;
            })();
            const EMPTY_SUBSCRIPTION = Subscription.EMPTY;
            function isSubscription(value) {
                return (value instanceof Subscription ||
                    (value && 'closed' in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe)));
            }
            function execTeardown(teardown) {
                if (isFunction(teardown)) {
                    teardown();
                }
                else {
                    teardown.unsubscribe();
                }
            }

            const config = exports('am', {
                onUnhandledError: null,
                onStoppedNotification: null,
                Promise: undefined,
                useDeprecatedSynchronousErrorHandling: false,
                useDeprecatedNextContext: false,
            });

            const timeoutProvider = exports('t', {
                setTimeout(...args) {
                    const { delegate } = timeoutProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) || setTimeout)(...args);
                },
                clearTimeout(handle) {
                    const { delegate } = timeoutProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
                },
                delegate: undefined,
            });

            function reportUnhandledError(err) {
                timeoutProvider.setTimeout(() => {
                    const { onUnhandledError } = config;
                    if (onUnhandledError) {
                        onUnhandledError(err);
                    }
                    else {
                        throw err;
                    }
                });
            }

            function noop() { }

            const COMPLETE_NOTIFICATION = exports('C', (() => createNotification('C', undefined, undefined))());
            function errorNotification(error) {
                return createNotification('E', undefined, error);
            }
            function nextNotification(value) {
                return createNotification('N', value, undefined);
            }
            function createNotification(kind, value, error) {
                return {
                    kind,
                    value,
                    error,
                };
            }

            let context = null;
            function errorContext(cb) {
                if (config.useDeprecatedSynchronousErrorHandling) {
                    const isRoot = !context;
                    if (isRoot) {
                        context = { errorThrown: false, error: null };
                    }
                    cb();
                    if (isRoot) {
                        const { errorThrown, error } = context;
                        context = null;
                        if (errorThrown) {
                            throw error;
                        }
                    }
                }
                else {
                    cb();
                }
            }
            function captureError(err) {
                if (config.useDeprecatedSynchronousErrorHandling && context) {
                    context.errorThrown = true;
                    context.error = err;
                }
            }

            class Subscriber extends Subscription {
                constructor(destination) {
                    super();
                    this.isStopped = false;
                    if (destination) {
                        this.destination = destination;
                        if (isSubscription(destination)) {
                            destination.add(this);
                        }
                    }
                    else {
                        this.destination = EMPTY_OBSERVER;
                    }
                }
                static create(next, error, complete) {
                    return new SafeSubscriber(next, error, complete);
                }
                next(value) {
                    if (this.isStopped) {
                        handleStoppedNotification(nextNotification(value), this);
                    }
                    else {
                        this._next(value);
                    }
                }
                error(err) {
                    if (this.isStopped) {
                        handleStoppedNotification(errorNotification(err), this);
                    }
                    else {
                        this.isStopped = true;
                        this._error(err);
                    }
                }
                complete() {
                    if (this.isStopped) {
                        handleStoppedNotification(COMPLETE_NOTIFICATION, this);
                    }
                    else {
                        this.isStopped = true;
                        this._complete();
                    }
                }
                unsubscribe() {
                    if (!this.closed) {
                        this.isStopped = true;
                        super.unsubscribe();
                        this.destination = null;
                    }
                }
                _next(value) {
                    this.destination.next(value);
                }
                _error(err) {
                    try {
                        this.destination.error(err);
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
                _complete() {
                    try {
                        this.destination.complete();
                    }
                    finally {
                        this.unsubscribe();
                    }
                }
            } exports('y', Subscriber);
            class SafeSubscriber extends Subscriber {
                constructor(observerOrNext, error, complete) {
                    super();
                    let next;
                    if (isFunction(observerOrNext)) {
                        next = observerOrNext;
                    }
                    else if (observerOrNext) {
                        ({ next, error, complete } = observerOrNext);
                        let context;
                        if (this && config.useDeprecatedNextContext) {
                            context = Object.create(observerOrNext);
                            context.unsubscribe = () => this.unsubscribe();
                        }
                        else {
                            context = observerOrNext;
                        }
                        next = next === null || next === void 0 ? void 0 : next.bind(context);
                        error = error === null || error === void 0 ? void 0 : error.bind(context);
                        complete = complete === null || complete === void 0 ? void 0 : complete.bind(context);
                    }
                    this.destination = {
                        next: next ? wrapForErrorHandling(next) : noop,
                        error: wrapForErrorHandling(error !== null && error !== void 0 ? error : defaultErrorHandler),
                        complete: complete ? wrapForErrorHandling(complete) : noop,
                    };
                }
            }
            function wrapForErrorHandling(handler, instance) {
                return (...args) => {
                    try {
                        handler(...args);
                    }
                    catch (err) {
                        if (config.useDeprecatedSynchronousErrorHandling) {
                            captureError(err);
                        }
                        else {
                            reportUnhandledError(err);
                        }
                    }
                };
            }
            function defaultErrorHandler(err) {
                throw err;
            }
            function handleStoppedNotification(notification, subscriber) {
                const { onStoppedNotification } = config;
                onStoppedNotification && timeoutProvider.setTimeout(() => onStoppedNotification(notification, subscriber));
            }
            const EMPTY_OBSERVER = {
                closed: true,
                next: noop,
                error: defaultErrorHandler,
                complete: noop,
            };

            const observable = exports('j', (() => (typeof Symbol === 'function' && Symbol.observable) || '@@observable')());

            function identity(x) {
                return x;
            }

            function pipe(...fns) {
                return pipeFromArray(fns);
            }
            function pipeFromArray(fns) {
                if (fns.length === 0) {
                    return identity;
                }
                if (fns.length === 1) {
                    return fns[0];
                }
                return function piped(input) {
                    return fns.reduce((prev, fn) => fn(prev), input);
                };
            }

            class Observable {
                constructor(subscribe) {
                    if (subscribe) {
                        this._subscribe = subscribe;
                    }
                }
                lift(operator) {
                    const observable = new Observable();
                    observable.source = this;
                    observable.operator = operator;
                    return observable;
                }
                subscribe(observerOrNext, error, complete) {
                    const subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
                    errorContext(() => {
                        const { operator, source } = this;
                        subscriber.add(operator
                            ?
                                operator.call(subscriber, source)
                            : source
                                ?
                                    this._subscribe(subscriber)
                                :
                                    this._trySubscribe(subscriber));
                    });
                    return subscriber;
                }
                _trySubscribe(sink) {
                    try {
                        return this._subscribe(sink);
                    }
                    catch (err) {
                        sink.error(err);
                    }
                }
                forEach(next, promiseCtor) {
                    promiseCtor = getPromiseCtor(promiseCtor);
                    return new promiseCtor((resolve, reject) => {
                        const subscriber = new SafeSubscriber({
                            next: (value) => {
                                try {
                                    next(value);
                                }
                                catch (err) {
                                    reject(err);
                                    subscriber.unsubscribe();
                                }
                            },
                            error: reject,
                            complete: resolve,
                        });
                        this.subscribe(subscriber);
                    });
                }
                _subscribe(subscriber) {
                    var _a;
                    return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
                }
                [observable]() {
                    return this;
                }
                pipe(...operations) {
                    return pipeFromArray(operations)(this);
                }
                toPromise(promiseCtor) {
                    promiseCtor = getPromiseCtor(promiseCtor);
                    return new promiseCtor((resolve, reject) => {
                        let value;
                        this.subscribe((x) => (value = x), (err) => reject(err), () => resolve(value));
                    });
                }
            } exports('O', Observable);
            Observable.create = (subscribe) => {
                return new Observable(subscribe);
            };
            function getPromiseCtor(promiseCtor) {
                var _a;
                return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a !== void 0 ? _a : Promise;
            }
            function isObserver(value) {
                return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
            }
            function isSubscriber(value) {
                return (value && value instanceof Subscriber) || (isObserver(value) && isSubscription(value));
            }

            function hasLift(source) {
                return isFunction(source === null || source === void 0 ? void 0 : source.lift);
            }
            function operate(init) {
                return (source) => {
                    if (hasLift(source)) {
                        return source.lift(function (liftedSource) {
                            try {
                                return init(liftedSource, this);
                            }
                            catch (err) {
                                this.error(err);
                            }
                        });
                    }
                    throw new TypeError('Unable to lift unknown Observable type');
                };
            }

            class OperatorSubscriber extends Subscriber {
                constructor(destination, onNext, onComplete, onError, onFinalize) {
                    super(destination);
                    this.onFinalize = onFinalize;
                    this._next = onNext
                        ? function (value) {
                            try {
                                onNext(value);
                            }
                            catch (err) {
                                destination.error(err);
                            }
                        }
                        : super._next;
                    this._error = onError
                        ? function (err) {
                            try {
                                onError(err);
                            }
                            catch (err) {
                                destination.error(err);
                            }
                            finally {
                                this.unsubscribe();
                            }
                        }
                        : super._error;
                    this._complete = onComplete
                        ? function () {
                            try {
                                onComplete();
                            }
                            catch (err) {
                                destination.error(err);
                            }
                            finally {
                                this.unsubscribe();
                            }
                        }
                        : super._complete;
                }
                unsubscribe() {
                    var _a;
                    const { closed } = this;
                    super.unsubscribe();
                    !closed && ((_a = this.onFinalize) === null || _a === void 0 ? void 0 : _a.call(this));
                }
            }

            function refCount() {
                return operate((source, subscriber) => {
                    let connection = null;
                    source._refCount++;
                    const refCounter = new OperatorSubscriber(subscriber, undefined, undefined, undefined, () => {
                        if (!source || source._refCount <= 0 || 0 < --source._refCount) {
                            connection = null;
                            return;
                        }
                        const sharedConnection = source._connection;
                        const conn = connection;
                        connection = null;
                        if (sharedConnection && (!conn || sharedConnection === conn)) {
                            sharedConnection.unsubscribe();
                        }
                        subscriber.unsubscribe();
                    });
                    source.subscribe(refCounter);
                    if (!refCounter.closed) {
                        connection = source.connect();
                    }
                });
            }

            class ConnectableObservable extends Observable {
                constructor(source, subjectFactory) {
                    super();
                    this.source = source;
                    this.subjectFactory = subjectFactory;
                    this._subject = null;
                    this._refCount = 0;
                    this._connection = null;
                    if (hasLift(source)) {
                        this.lift = source.lift;
                    }
                }
                _subscribe(subscriber) {
                    return this.getSubject().subscribe(subscriber);
                }
                getSubject() {
                    const subject = this._subject;
                    if (!subject || subject.isStopped) {
                        this._subject = this.subjectFactory();
                    }
                    return this._subject;
                }
                _teardown() {
                    this._refCount = 0;
                    const { _connection } = this;
                    this._subject = this._connection = null;
                    _connection === null || _connection === void 0 ? void 0 : _connection.unsubscribe();
                }
                connect() {
                    let connection = this._connection;
                    if (!connection) {
                        connection = this._connection = new Subscription();
                        const subject = this.getSubject();
                        connection.add(this.source.subscribe(new OperatorSubscriber(subject, undefined, () => {
                            this._teardown();
                            subject.complete();
                        }, (err) => {
                            this._teardown();
                            subject.error(err);
                        }, () => this._teardown())));
                        if (connection.closed) {
                            this._connection = null;
                            connection = Subscription.EMPTY;
                        }
                    }
                    return connection;
                }
                refCount() {
                    return refCount()(this);
                }
            } exports('h', ConnectableObservable);

            const performanceTimestampProvider = exports('p', {
                now() {
                    return (performanceTimestampProvider.delegate || performance).now();
                },
                delegate: undefined,
            });

            const animationFrameProvider = exports('d', {
                schedule(callback) {
                    let request = requestAnimationFrame;
                    let cancel = cancelAnimationFrame;
                    const { delegate } = animationFrameProvider;
                    if (delegate) {
                        request = delegate.requestAnimationFrame;
                        cancel = delegate.cancelAnimationFrame;
                    }
                    const handle = request((timestamp) => {
                        cancel = undefined;
                        callback(timestamp);
                    });
                    return new Subscription(() => cancel === null || cancel === void 0 ? void 0 : cancel(handle));
                },
                requestAnimationFrame(...args) {
                    const { delegate } = animationFrameProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.requestAnimationFrame) || requestAnimationFrame)(...args);
                },
                cancelAnimationFrame(...args) {
                    const { delegate } = animationFrameProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.cancelAnimationFrame) || cancelAnimationFrame)(...args);
                },
                delegate: undefined,
            });

            function animationFrames(timestampProvider) {
                return timestampProvider ? animationFramesFactory(timestampProvider) : DEFAULT_ANIMATION_FRAMES;
            }
            function animationFramesFactory(timestampProvider) {
                const { schedule } = animationFrameProvider;
                return new Observable((subscriber) => {
                    const subscription = new Subscription();
                    const provider = timestampProvider || performanceTimestampProvider;
                    const start = provider.now();
                    const run = (timestamp) => {
                        const now = provider.now();
                        subscriber.next({
                            timestamp: timestampProvider ? now : timestamp,
                            elapsed: now - start,
                        });
                        if (!subscriber.closed) {
                            subscription.add(schedule(run));
                        }
                    };
                    subscription.add(schedule(run));
                    return subscription;
                });
            }
            const DEFAULT_ANIMATION_FRAMES = animationFramesFactory();

            const ObjectUnsubscribedError = exports('M', createErrorClass((_super) => function ObjectUnsubscribedErrorImpl() {
                _super(this);
                this.name = 'ObjectUnsubscribedError';
                this.message = 'object unsubscribed';
            }));

            class Subject extends Observable {
                constructor() {
                    super();
                    this.closed = false;
                    this.observers = [];
                    this.isStopped = false;
                    this.hasError = false;
                    this.thrownError = null;
                }
                lift(operator) {
                    const subject = new AnonymousSubject(this, this);
                    subject.operator = operator;
                    return subject;
                }
                _throwIfClosed() {
                    if (this.closed) {
                        throw new ObjectUnsubscribedError();
                    }
                }
                next(value) {
                    errorContext(() => {
                        this._throwIfClosed();
                        if (!this.isStopped) {
                            const copy = this.observers.slice();
                            for (const observer of copy) {
                                observer.next(value);
                            }
                        }
                    });
                }
                error(err) {
                    errorContext(() => {
                        this._throwIfClosed();
                        if (!this.isStopped) {
                            this.hasError = this.isStopped = true;
                            this.thrownError = err;
                            const { observers } = this;
                            while (observers.length) {
                                observers.shift().error(err);
                            }
                        }
                    });
                }
                complete() {
                    errorContext(() => {
                        this._throwIfClosed();
                        if (!this.isStopped) {
                            this.isStopped = true;
                            const { observers } = this;
                            while (observers.length) {
                                observers.shift().complete();
                            }
                        }
                    });
                }
                unsubscribe() {
                    this.isStopped = this.closed = true;
                    this.observers = null;
                }
                get observed() {
                    var _a;
                    return ((_a = this.observers) === null || _a === void 0 ? void 0 : _a.length) > 0;
                }
                _trySubscribe(subscriber) {
                    this._throwIfClosed();
                    return super._trySubscribe(subscriber);
                }
                _subscribe(subscriber) {
                    this._throwIfClosed();
                    this._checkFinalizedStatuses(subscriber);
                    return this._innerSubscribe(subscriber);
                }
                _innerSubscribe(subscriber) {
                    const { hasError, isStopped, observers } = this;
                    return hasError || isStopped
                        ? EMPTY_SUBSCRIPTION
                        : (observers.push(subscriber), new Subscription(() => arrRemove(observers, subscriber)));
                }
                _checkFinalizedStatuses(subscriber) {
                    const { hasError, thrownError, isStopped } = this;
                    if (hasError) {
                        subscriber.error(thrownError);
                    }
                    else if (isStopped) {
                        subscriber.complete();
                    }
                }
                asObservable() {
                    const observable = new Observable();
                    observable.source = this;
                    return observable;
                }
            } exports('b', Subject);
            Subject.create = (destination, source) => {
                return new AnonymousSubject(destination, source);
            };
            class AnonymousSubject extends Subject {
                constructor(destination, source) {
                    super();
                    this.destination = destination;
                    this.source = source;
                }
                next(value) {
                    var _a, _b;
                    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.next) === null || _b === void 0 ? void 0 : _b.call(_a, value);
                }
                error(err) {
                    var _a, _b;
                    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.error) === null || _b === void 0 ? void 0 : _b.call(_a, err);
                }
                complete() {
                    var _a, _b;
                    (_b = (_a = this.destination) === null || _a === void 0 ? void 0 : _a.complete) === null || _b === void 0 ? void 0 : _b.call(_a);
                }
                _subscribe(subscriber) {
                    var _a, _b;
                    return (_b = (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber)) !== null && _b !== void 0 ? _b : EMPTY_SUBSCRIPTION;
                }
            }

            class BehaviorSubject extends Subject {
                constructor(_value) {
                    super();
                    this._value = _value;
                }
                get value() {
                    return this.getValue();
                }
                _subscribe(subscriber) {
                    const subscription = super._subscribe(subscriber);
                    !subscription.closed && subscriber.next(this._value);
                    return subscription;
                }
                getValue() {
                    const { hasError, thrownError, _value } = this;
                    if (hasError) {
                        throw thrownError;
                    }
                    this._throwIfClosed();
                    return _value;
                }
                next(value) {
                    super.next((this._value = value));
                }
            } exports('B', BehaviorSubject);

            const dateTimestampProvider = exports('f', {
                now() {
                    return (dateTimestampProvider.delegate || Date).now();
                },
                delegate: undefined,
            });

            class ReplaySubject extends Subject {
                constructor(_bufferSize = Infinity, _windowTime = Infinity, _timestampProvider = dateTimestampProvider) {
                    super();
                    this._bufferSize = _bufferSize;
                    this._windowTime = _windowTime;
                    this._timestampProvider = _timestampProvider;
                    this._buffer = [];
                    this._infiniteTimeWindow = true;
                    this._infiniteTimeWindow = _windowTime === Infinity;
                    this._bufferSize = Math.max(1, _bufferSize);
                    this._windowTime = Math.max(1, _windowTime);
                }
                next(value) {
                    const { isStopped, _buffer, _infiniteTimeWindow, _timestampProvider, _windowTime } = this;
                    if (!isStopped) {
                        _buffer.push(value);
                        !_infiniteTimeWindow && _buffer.push(_timestampProvider.now() + _windowTime);
                    }
                    this._trimBuffer();
                    super.next(value);
                }
                _subscribe(subscriber) {
                    this._throwIfClosed();
                    this._trimBuffer();
                    const subscription = this._innerSubscribe(subscriber);
                    const { _infiniteTimeWindow, _buffer } = this;
                    const copy = _buffer.slice();
                    for (let i = 0; i < copy.length && !subscriber.closed; i += _infiniteTimeWindow ? 1 : 2) {
                        subscriber.next(copy[i]);
                    }
                    this._checkFinalizedStatuses(subscriber);
                    return subscription;
                }
                _trimBuffer() {
                    const { _bufferSize, _timestampProvider, _buffer, _infiniteTimeWindow } = this;
                    const adjustedBufferSize = (_infiniteTimeWindow ? 1 : 2) * _bufferSize;
                    _bufferSize < Infinity && adjustedBufferSize < _buffer.length && _buffer.splice(0, _buffer.length - adjustedBufferSize);
                    if (!_infiniteTimeWindow) {
                        const now = _timestampProvider.now();
                        let last = 0;
                        for (let i = 1; i < _buffer.length && _buffer[i] <= now; i += 2) {
                            last = i;
                        }
                        last && _buffer.splice(0, last + 1);
                    }
                }
            } exports('R', ReplaySubject);

            class AsyncSubject extends Subject {
                constructor() {
                    super(...arguments);
                    this._value = null;
                    this._hasValue = false;
                    this._isComplete = false;
                }
                _checkFinalizedStatuses(subscriber) {
                    const { hasError, _hasValue, _value, thrownError, isStopped, _isComplete } = this;
                    if (hasError) {
                        subscriber.error(thrownError);
                    }
                    else if (isStopped || _isComplete) {
                        _hasValue && subscriber.next(_value);
                        subscriber.complete();
                    }
                }
                next(value) {
                    if (!this.isStopped) {
                        this._value = value;
                        this._hasValue = true;
                    }
                }
                complete() {
                    const { _hasValue, _value, _isComplete } = this;
                    if (!_isComplete) {
                        this._isComplete = true;
                        _hasValue && super.next(_value);
                        super.complete();
                    }
                }
            } exports('A', AsyncSubject);

            class Action extends Subscription {
                constructor(scheduler, work) {
                    super();
                }
                schedule(state, delay = 0) {
                    return this;
                }
            }

            const intervalProvider = exports('g', {
                setInterval(...args) {
                    const { delegate } = intervalProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setInterval) || setInterval)(...args);
                },
                clearInterval(handle) {
                    const { delegate } = intervalProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearInterval) || clearInterval)(handle);
                },
                delegate: undefined,
            });

            class AsyncAction extends Action {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                    this.pending = false;
                }
                schedule(state, delay = 0) {
                    if (this.closed) {
                        return this;
                    }
                    this.state = state;
                    const id = this.id;
                    const scheduler = this.scheduler;
                    if (id != null) {
                        this.id = this.recycleAsyncId(scheduler, id, delay);
                    }
                    this.pending = true;
                    this.delay = delay;
                    this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
                    return this;
                }
                requestAsyncId(scheduler, _id, delay = 0) {
                    return intervalProvider.setInterval(scheduler.flush.bind(scheduler, this), delay);
                }
                recycleAsyncId(_scheduler, id, delay = 0) {
                    if (delay != null && this.delay === delay && this.pending === false) {
                        return id;
                    }
                    intervalProvider.clearInterval(id);
                    return undefined;
                }
                execute(state, delay) {
                    if (this.closed) {
                        return new Error('executing a cancelled action');
                    }
                    this.pending = false;
                    const error = this._execute(state, delay);
                    if (error) {
                        return error;
                    }
                    else if (this.pending === false && this.id != null) {
                        this.id = this.recycleAsyncId(this.scheduler, this.id, null);
                    }
                }
                _execute(state, _delay) {
                    let errored = false;
                    let errorValue;
                    try {
                        this.work(state);
                    }
                    catch (e) {
                        errored = true;
                        errorValue = e ? e : new Error('Scheduled action threw falsy error');
                    }
                    if (errored) {
                        this.unsubscribe();
                        return errorValue;
                    }
                }
                unsubscribe() {
                    if (!this.closed) {
                        const { id, scheduler } = this;
                        const { actions } = scheduler;
                        this.work = this.state = this.scheduler = null;
                        this.pending = false;
                        arrRemove(actions, this);
                        if (id != null) {
                            this.id = this.recycleAsyncId(scheduler, id, null);
                        }
                        this.delay = null;
                        super.unsubscribe();
                    }
                }
            }

            let nextHandle = 1;
            let resolved;
            const activeHandles = {};
            function findAndClearHandle(handle) {
                if (handle in activeHandles) {
                    delete activeHandles[handle];
                    return true;
                }
                return false;
            }
            const Immediate = {
                setImmediate(cb) {
                    const handle = nextHandle++;
                    activeHandles[handle] = true;
                    if (!resolved) {
                        resolved = Promise.resolve();
                    }
                    resolved.then(() => findAndClearHandle(handle) && cb());
                    return handle;
                },
                clearImmediate(handle) {
                    findAndClearHandle(handle);
                },
            };

            const { setImmediate, clearImmediate } = Immediate;
            const immediateProvider = exports('i', {
                setImmediate(...args) {
                    const { delegate } = immediateProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.setImmediate) || setImmediate)(...args);
                },
                clearImmediate(handle) {
                    const { delegate } = immediateProvider;
                    return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearImmediate) || clearImmediate)(handle);
                },
                delegate: undefined,
            });

            class AsapAction extends AsyncAction {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    if (delay !== null && delay > 0) {
                        return super.requestAsyncId(scheduler, id, delay);
                    }
                    scheduler.actions.push(this);
                    return scheduler._scheduled || (scheduler._scheduled = immediateProvider.setImmediate(scheduler.flush.bind(scheduler, undefined)));
                }
                recycleAsyncId(scheduler, id, delay = 0) {
                    if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
                        return super.recycleAsyncId(scheduler, id, delay);
                    }
                    if (!scheduler.actions.some((action) => action.id === id)) {
                        immediateProvider.clearImmediate(id);
                        scheduler._scheduled = undefined;
                    }
                    return undefined;
                }
            }

            class Scheduler {
                constructor(schedulerActionCtor, now = Scheduler.now) {
                    this.schedulerActionCtor = schedulerActionCtor;
                    this.now = now;
                }
                schedule(work, delay = 0, state) {
                    return new this.schedulerActionCtor(this, work).schedule(state, delay);
                }
            } exports('x', Scheduler);
            Scheduler.now = dateTimestampProvider.now;

            class AsyncScheduler extends Scheduler {
                constructor(SchedulerAction, now = Scheduler.now) {
                    super(SchedulerAction, now);
                    this.actions = [];
                    this._active = false;
                    this._scheduled = undefined;
                }
                flush(action) {
                    const { actions } = this;
                    if (this._active) {
                        actions.push(action);
                        return;
                    }
                    let error;
                    this._active = true;
                    do {
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    } while ((action = actions.shift()));
                    this._active = false;
                    if (error) {
                        while ((action = actions.shift())) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            }

            class AsapScheduler extends AsyncScheduler {
                flush(action) {
                    this._active = true;
                    const flushId = this._scheduled;
                    this._scheduled = undefined;
                    const { actions } = this;
                    let error;
                    action = action || actions.shift();
                    do {
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    } while ((action = actions[0]) && action.id === flushId && actions.shift());
                    this._active = false;
                    if (error) {
                        while ((action = actions[0]) && action.id === flushId && actions.shift()) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            }

            const asapScheduler = exports('m', new AsapScheduler(AsapAction));
            const asap = exports('l', asapScheduler);

            const asyncScheduler = exports('r', new AsyncScheduler(AsyncAction));
            const async = exports('q', asyncScheduler);

            class QueueAction extends AsyncAction {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                }
                schedule(state, delay = 0) {
                    if (delay > 0) {
                        return super.schedule(state, delay);
                    }
                    this.delay = delay;
                    this.state = state;
                    this.scheduler.flush(this);
                    return this;
                }
                execute(state, delay) {
                    return (delay > 0 || this.closed) ?
                        super.execute(state, delay) :
                        this._execute(state, delay);
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
                        return super.requestAsyncId(scheduler, id, delay);
                    }
                    return scheduler.flush(this);
                }
            }

            class QueueScheduler extends AsyncScheduler {
            }

            const queueScheduler = exports('u', new QueueScheduler(QueueAction));
            const queue = exports('s', queueScheduler);

            class AnimationFrameAction extends AsyncAction {
                constructor(scheduler, work) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    if (delay !== null && delay > 0) {
                        return super.requestAsyncId(scheduler, id, delay);
                    }
                    scheduler.actions.push(this);
                    return scheduler._scheduled || (scheduler._scheduled = animationFrameProvider.requestAnimationFrame(() => scheduler.flush(undefined)));
                }
                recycleAsyncId(scheduler, id, delay = 0) {
                    if ((delay != null && delay > 0) || (delay == null && this.delay > 0)) {
                        return super.recycleAsyncId(scheduler, id, delay);
                    }
                    if (!scheduler.actions.some((action) => action.id === id)) {
                        animationFrameProvider.cancelAnimationFrame(id);
                        scheduler._scheduled = undefined;
                    }
                    return undefined;
                }
            }

            class AnimationFrameScheduler extends AsyncScheduler {
                flush(action) {
                    this._active = true;
                    const flushId = this._scheduled;
                    this._scheduled = undefined;
                    const { actions } = this;
                    let error;
                    action = action || actions.shift();
                    do {
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    } while ((action = actions[0]) && action.id === flushId && actions.shift());
                    this._active = false;
                    if (error) {
                        while ((action = actions[0]) && action.id === flushId && actions.shift()) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            }

            const animationFrameScheduler = exports('w', new AnimationFrameScheduler(AnimationFrameAction));
            const animationFrame = exports('v', animationFrameScheduler);

            class VirtualTimeScheduler extends AsyncScheduler {
                constructor(schedulerActionCtor = VirtualAction, maxFrames = Infinity) {
                    super(schedulerActionCtor, () => this.frame);
                    this.maxFrames = maxFrames;
                    this.frame = 0;
                    this.index = -1;
                }
                flush() {
                    const { actions, maxFrames } = this;
                    let error;
                    let action;
                    while ((action = actions[0]) && action.delay <= maxFrames) {
                        actions.shift();
                        this.frame = action.delay;
                        if ((error = action.execute(action.state, action.delay))) {
                            break;
                        }
                    }
                    if (error) {
                        while ((action = actions.shift())) {
                            action.unsubscribe();
                        }
                        throw error;
                    }
                }
            } exports('V', VirtualTimeScheduler);
            VirtualTimeScheduler.frameTimeFactor = 10;
            class VirtualAction extends AsyncAction {
                constructor(scheduler, work, index = (scheduler.index += 1)) {
                    super(scheduler, work);
                    this.scheduler = scheduler;
                    this.work = work;
                    this.index = index;
                    this.active = true;
                    this.index = scheduler.index = index;
                }
                schedule(state, delay = 0) {
                    if (Number.isFinite(delay)) {
                        if (!this.id) {
                            return super.schedule(state, delay);
                        }
                        this.active = false;
                        const action = new VirtualAction(this.scheduler, this.work);
                        this.add(action);
                        return action.schedule(state, delay);
                    }
                    else {
                        return Subscription.EMPTY;
                    }
                }
                requestAsyncId(scheduler, id, delay = 0) {
                    this.delay = scheduler.frame + delay;
                    const { actions } = scheduler;
                    actions.push(this);
                    actions.sort(VirtualAction.sortActions);
                    return true;
                }
                recycleAsyncId(scheduler, id, delay = 0) {
                    return undefined;
                }
                _execute(state, delay) {
                    if (this.active === true) {
                        return super._execute(state, delay);
                    }
                }
                static sortActions(a, b) {
                    if (a.delay === b.delay) {
                        if (a.index === b.index) {
                            return 0;
                        }
                        else if (a.index > b.index) {
                            return 1;
                        }
                        else {
                            return -1;
                        }
                    }
                    else if (a.delay > b.delay) {
                        return 1;
                    }
                    else {
                        return -1;
                    }
                }
            } exports('c', VirtualAction);

            const EMPTY = exports('ak', new Observable((subscriber) => subscriber.complete()));
            function empty(scheduler) {
                return scheduler ? emptyScheduled(scheduler) : EMPTY;
            }
            function emptyScheduled(scheduler) {
                return new Observable((subscriber) => scheduler.schedule(() => subscriber.complete()));
            }

            function isScheduler(value) {
                return value && isFunction(value.schedule);
            }

            function last$1(arr) {
                return arr[arr.length - 1];
            }
            function popResultSelector(args) {
                return isFunction(last$1(args)) ? args.pop() : undefined;
            }
            function popScheduler(args) {
                return isScheduler(last$1(args)) ? args.pop() : undefined;
            }
            function popNumber(args, defaultValue) {
                return typeof last$1(args) === 'number' ? args.pop() : defaultValue;
            }

            /*! *****************************************************************************
            Copyright (c) Microsoft Corporation.

            Permission to use, copy, modify, and/or distribute this software for any
            purpose with or without fee is hereby granted.

            THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
            REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
            AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
            INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
            LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
            OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
            PERFORMANCE OF THIS SOFTWARE.
            ***************************************************************************** */

            function __rest(s, e) {
                var t = {};
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                    t[p] = s[p];
                if (s != null && typeof Object.getOwnPropertySymbols === "function")
                    for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                            t[p[i]] = s[p[i]];
                    }
                return t;
            }

            function __awaiter(thisArg, _arguments, P, generator) {
                function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
                return new (P || (P = Promise))(function (resolve, reject) {
                    function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
                    function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
                    function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
                    step((generator = generator.apply(thisArg, _arguments || [])).next());
                });
            }

            function __values(o) {
                var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
                if (m) return m.call(o);
                if (o && typeof o.length === "number") return {
                    next: function () {
                        if (o && i >= o.length) o = void 0;
                        return { value: o && o[i++], done: !o };
                    }
                };
                throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
            }

            function __await(v) {
                return this instanceof __await ? (this.v = v, this) : new __await(v);
            }

            function __asyncGenerator(thisArg, _arguments, generator) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var g = generator.apply(thisArg, _arguments || []), i, q = [];
                return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
                function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
                function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
                function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
                function fulfill(value) { resume("next", value); }
                function reject(value) { resume("throw", value); }
                function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
            }

            function __asyncValues(o) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var m = o[Symbol.asyncIterator], i;
                return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
                function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
                function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
            }

            const isArrayLike = ((x) => x && typeof x.length === 'number' && typeof x !== 'function');

            function isPromise(value) {
                return isFunction(value === null || value === void 0 ? void 0 : value.then);
            }

            function isInteropObservable(input) {
                return isFunction(input[observable]);
            }

            function isAsyncIterable(obj) {
                return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
            }

            function createInvalidObservableTypeError(input) {
                return new TypeError(`You provided ${input !== null && typeof input === 'object' ? 'an invalid object' : `'${input}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`);
            }

            function getSymbolIterator() {
                if (typeof Symbol !== 'function' || !Symbol.iterator) {
                    return '@@iterator';
                }
                return Symbol.iterator;
            }
            const iterator = getSymbolIterator();

            function isIterable(input) {
                return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
            }

            function readableStreamLikeToAsyncGenerator(readableStream) {
                return __asyncGenerator(this, arguments, function* readableStreamLikeToAsyncGenerator_1() {
                    const reader = readableStream.getReader();
                    try {
                        while (true) {
                            const { value, done } = yield __await(reader.read());
                            if (done) {
                                return yield __await(void 0);
                            }
                            yield yield __await(value);
                        }
                    }
                    finally {
                        reader.releaseLock();
                    }
                });
            }
            function isReadableStreamLike(obj) {
                return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
            }

            function innerFrom(input) {
                if (input instanceof Observable) {
                    return input;
                }
                if (input != null) {
                    if (isInteropObservable(input)) {
                        return fromInteropObservable(input);
                    }
                    if (isArrayLike(input)) {
                        return fromArrayLike(input);
                    }
                    if (isPromise(input)) {
                        return fromPromise(input);
                    }
                    if (isAsyncIterable(input)) {
                        return fromAsyncIterable(input);
                    }
                    if (isIterable(input)) {
                        return fromIterable(input);
                    }
                    if (isReadableStreamLike(input)) {
                        return fromReadableStreamLike(input);
                    }
                }
                throw createInvalidObservableTypeError(input);
            }
            function fromInteropObservable(obj) {
                return new Observable((subscriber) => {
                    const obs = obj[observable]();
                    if (isFunction(obs.subscribe)) {
                        return obs.subscribe(subscriber);
                    }
                    throw new TypeError('Provided object does not correctly implement Symbol.observable');
                });
            }
            function fromArrayLike(array) {
                return new Observable((subscriber) => {
                    for (let i = 0; i < array.length && !subscriber.closed; i++) {
                        subscriber.next(array[i]);
                    }
                    subscriber.complete();
                });
            }
            function fromPromise(promise) {
                return new Observable((subscriber) => {
                    promise
                        .then((value) => {
                        if (!subscriber.closed) {
                            subscriber.next(value);
                            subscriber.complete();
                        }
                    }, (err) => subscriber.error(err))
                        .then(null, reportUnhandledError);
                });
            }
            function fromIterable(iterable) {
                return new Observable((subscriber) => {
                    for (const value of iterable) {
                        subscriber.next(value);
                        if (subscriber.closed) {
                            return;
                        }
                    }
                    subscriber.complete();
                });
            }
            function fromAsyncIterable(asyncIterable) {
                return new Observable((subscriber) => {
                    process(asyncIterable, subscriber).catch((err) => subscriber.error(err));
                });
            }
            function fromReadableStreamLike(readableStream) {
                return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
            }
            function process(asyncIterable, subscriber) {
                var asyncIterable_1, asyncIterable_1_1;
                var e_1, _a;
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        for (asyncIterable_1 = __asyncValues(asyncIterable); asyncIterable_1_1 = yield asyncIterable_1.next(), !asyncIterable_1_1.done;) {
                            const value = asyncIterable_1_1.value;
                            subscriber.next(value);
                            if (subscriber.closed) {
                                return;
                            }
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (asyncIterable_1_1 && !asyncIterable_1_1.done && (_a = asyncIterable_1.return)) yield _a.call(asyncIterable_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                    subscriber.complete();
                });
            }

            function executeSchedule(parentSubscription, scheduler, work, delay = 0, repeat = false) {
                const scheduleSubscription = scheduler.schedule(function () {
                    work();
                    if (repeat) {
                        parentSubscription.add(this.schedule(null, delay));
                    }
                    else {
                        this.unsubscribe();
                    }
                }, delay);
                parentSubscription.add(scheduleSubscription);
                if (!repeat) {
                    return scheduleSubscription;
                }
            }

            function observeOn(scheduler, delay = 0) {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => executeSchedule(subscriber, scheduler, () => subscriber.next(value), delay), () => executeSchedule(subscriber, scheduler, () => subscriber.complete(), delay), (err) => executeSchedule(subscriber, scheduler, () => subscriber.error(err), delay)));
                });
            }

            function subscribeOn(scheduler, delay = 0) {
                return operate((source, subscriber) => {
                    subscriber.add(scheduler.schedule(() => source.subscribe(subscriber), delay));
                });
            }

            function scheduleObservable(input, scheduler) {
                return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
            }

            function schedulePromise(input, scheduler) {
                return innerFrom(input).pipe(subscribeOn(scheduler), observeOn(scheduler));
            }

            function scheduleArray(input, scheduler) {
                return new Observable((subscriber) => {
                    let i = 0;
                    return scheduler.schedule(function () {
                        if (i === input.length) {
                            subscriber.complete();
                        }
                        else {
                            subscriber.next(input[i++]);
                            if (!subscriber.closed) {
                                this.schedule();
                            }
                        }
                    });
                });
            }

            function scheduleIterable(input, scheduler) {
                return new Observable((subscriber) => {
                    let iterator$1;
                    executeSchedule(subscriber, scheduler, () => {
                        iterator$1 = input[iterator]();
                        executeSchedule(subscriber, scheduler, () => {
                            let value;
                            let done;
                            try {
                                ({ value, done } = iterator$1.next());
                            }
                            catch (err) {
                                subscriber.error(err);
                                return;
                            }
                            if (done) {
                                subscriber.complete();
                            }
                            else {
                                subscriber.next(value);
                            }
                        }, 0, true);
                    });
                    return () => isFunction(iterator$1 === null || iterator$1 === void 0 ? void 0 : iterator$1.return) && iterator$1.return();
                });
            }

            function scheduleAsyncIterable(input, scheduler) {
                if (!input) {
                    throw new Error('Iterable cannot be null');
                }
                return new Observable((subscriber) => {
                    executeSchedule(subscriber, scheduler, () => {
                        const iterator = input[Symbol.asyncIterator]();
                        executeSchedule(subscriber, scheduler, () => {
                            iterator.next().then((result) => {
                                if (result.done) {
                                    subscriber.complete();
                                }
                                else {
                                    subscriber.next(result.value);
                                }
                            });
                        }, 0, true);
                    });
                });
            }

            function scheduleReadableStreamLike(input, scheduler) {
                return scheduleAsyncIterable(readableStreamLikeToAsyncGenerator(input), scheduler);
            }

            function scheduled(input, scheduler) {
                if (input != null) {
                    if (isInteropObservable(input)) {
                        return scheduleObservable(input, scheduler);
                    }
                    if (isArrayLike(input)) {
                        return scheduleArray(input, scheduler);
                    }
                    if (isPromise(input)) {
                        return schedulePromise(input, scheduler);
                    }
                    if (isAsyncIterable(input)) {
                        return scheduleAsyncIterable(input, scheduler);
                    }
                    if (isIterable(input)) {
                        return scheduleIterable(input, scheduler);
                    }
                    if (isReadableStreamLike(input)) {
                        return scheduleReadableStreamLike(input, scheduler);
                    }
                }
                throw createInvalidObservableTypeError(input);
            }

            function from(input, scheduler) {
                return scheduler ? scheduled(input, scheduler) : innerFrom(input);
            }

            function of(...args) {
                const scheduler = popScheduler(args);
                return from(args, scheduler);
            }

            function throwError(errorOrErrorFactory, scheduler) {
                const errorFactory = isFunction(errorOrErrorFactory) ? errorOrErrorFactory : () => errorOrErrorFactory;
                const init = (subscriber) => subscriber.error(errorFactory());
                return new Observable(scheduler ? (subscriber) => scheduler.schedule(init, 0, subscriber) : init);
            }

            var NotificationKind; exports('z', NotificationKind);
            (function (NotificationKind) {
                NotificationKind["NEXT"] = "N";
                NotificationKind["ERROR"] = "E";
                NotificationKind["COMPLETE"] = "C";
            })(NotificationKind || (exports('z', NotificationKind = {})));
            class Notification {
                constructor(kind, value, error) {
                    this.kind = kind;
                    this.value = value;
                    this.error = error;
                    this.hasValue = kind === 'N';
                }
                observe(observer) {
                    return observeNotification(this, observer);
                }
                do(nextHandler, errorHandler, completeHandler) {
                    const { kind, value, error } = this;
                    return kind === 'N' ? nextHandler === null || nextHandler === void 0 ? void 0 : nextHandler(value) : kind === 'E' ? errorHandler === null || errorHandler === void 0 ? void 0 : errorHandler(error) : completeHandler === null || completeHandler === void 0 ? void 0 : completeHandler();
                }
                accept(nextOrObserver, error, complete) {
                    var _a;
                    return isFunction((_a = nextOrObserver) === null || _a === void 0 ? void 0 : _a.next)
                        ? this.observe(nextOrObserver)
                        : this.do(nextOrObserver, error, complete);
                }
                toObservable() {
                    const { kind, value, error } = this;
                    const result = kind === 'N'
                        ?
                            of(value)
                        :
                            kind === 'E'
                                ?
                                    throwError(() => error)
                                :
                                    kind === 'C'
                                        ?
                                            EMPTY
                                        :
                                            0;
                    if (!result) {
                        throw new TypeError(`Unexpected notification kind ${kind}`);
                    }
                    return result;
                }
                static createNext(value) {
                    return new Notification('N', value);
                }
                static createError(err) {
                    return new Notification('E', undefined, err);
                }
                static createComplete() {
                    return Notification.completeNotification;
                }
            } exports('N', Notification);
            Notification.completeNotification = new Notification('C');
            function observeNotification(notification, observer) {
                var _a, _b, _c;
                const { kind, value, error } = notification;
                if (typeof kind !== 'string') {
                    throw new TypeError('Invalid notification, missing "kind"');
                }
                kind === 'N' ? (_a = observer.next) === null || _a === void 0 ? void 0 : _a.call(observer, value) : kind === 'E' ? (_b = observer.error) === null || _b === void 0 ? void 0 : _b.call(observer, error) : (_c = observer.complete) === null || _c === void 0 ? void 0 : _c.call(observer);
            }

            function isObservable(obj) {
                return !!obj && (obj instanceof Observable || (isFunction(obj.lift) && isFunction(obj.subscribe)));
            }

            const EmptyError = exports('K', createErrorClass((_super) => function EmptyErrorImpl() {
                _super(this);
                this.name = 'EmptyError';
                this.message = 'no elements in sequence';
            }));

            function lastValueFrom(source, config) {
                const hasConfig = typeof config === 'object';
                return new Promise((resolve, reject) => {
                    let _hasValue = false;
                    let _value;
                    source.subscribe({
                        next: (value) => {
                            _value = value;
                            _hasValue = true;
                        },
                        error: reject,
                        complete: () => {
                            if (_hasValue) {
                                resolve(_value);
                            }
                            else if (hasConfig) {
                                resolve(config.defaultValue);
                            }
                            else {
                                reject(new EmptyError());
                            }
                        },
                    });
                });
            }

            function firstValueFrom(source, config) {
                const hasConfig = typeof config === 'object';
                return new Promise((resolve, reject) => {
                    const subscriber = new SafeSubscriber({
                        next: (value) => {
                            resolve(value);
                            subscriber.unsubscribe();
                        },
                        error: reject,
                        complete: () => {
                            if (hasConfig) {
                                resolve(config.defaultValue);
                            }
                            else {
                                reject(new EmptyError());
                            }
                        },
                    });
                    source.subscribe(subscriber);
                });
            }

            const ArgumentOutOfRangeError = exports('J', createErrorClass((_super) => function ArgumentOutOfRangeErrorImpl() {
                _super(this);
                this.name = 'ArgumentOutOfRangeError';
                this.message = 'argument out of range';
            }));

            const NotFoundError = exports('L', createErrorClass((_super) => function NotFoundErrorImpl(message) {
                _super(this);
                this.name = 'NotFoundError';
                this.message = message;
            }));

            const SequenceError = exports('P', createErrorClass((_super) => function SequenceErrorImpl(message) {
                _super(this);
                this.name = 'SequenceError';
                this.message = message;
            }));

            function isValidDate(value) {
                return value instanceof Date && !isNaN(value);
            }

            const TimeoutError = exports('T', createErrorClass((_super) => function TimeoutErrorImpl(info = null) {
                _super(this);
                this.message = 'Timeout has occurred';
                this.name = 'TimeoutError';
                this.info = info;
            }));
            function timeout(config, schedulerArg) {
                const { first, each, with: _with = timeoutErrorFactory, scheduler = schedulerArg !== null && schedulerArg !== void 0 ? schedulerArg : asyncScheduler, meta = null } = (isValidDate(config)
                    ? { first: config }
                    : typeof config === 'number'
                        ? { each: config }
                        : config);
                if (first == null && each == null) {
                    throw new TypeError('No timeout provided.');
                }
                return operate((source, subscriber) => {
                    let originalSourceSubscription;
                    let timerSubscription;
                    let lastValue = null;
                    let seen = 0;
                    const startTimer = (delay) => {
                        timerSubscription = executeSchedule(subscriber, scheduler, () => {
                            try {
                                originalSourceSubscription.unsubscribe();
                                innerFrom(_with({
                                    meta,
                                    lastValue,
                                    seen,
                                })).subscribe(subscriber);
                            }
                            catch (err) {
                                subscriber.error(err);
                            }
                        }, delay);
                    };
                    originalSourceSubscription = source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
                        seen++;
                        subscriber.next((lastValue = value));
                        each > 0 && startTimer(each);
                    }, undefined, undefined, () => {
                        if (!(timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.closed)) {
                            timerSubscription === null || timerSubscription === void 0 ? void 0 : timerSubscription.unsubscribe();
                        }
                        lastValue = null;
                    }));
                    startTimer(first != null ? (typeof first === 'number' ? first : +first - scheduler.now()) : each);
                });
            }
            function timeoutErrorFactory(info) {
                throw new TimeoutError(info);
            }

            function map(project, thisArg) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        subscriber.next(project.call(thisArg, value, index++));
                    }));
                });
            }

            const { isArray: isArray$2 } = Array;
            function callOrApply(fn, args) {
                return isArray$2(args) ? fn(...args) : fn(args);
            }
            function mapOneOrManyArgs(fn) {
                return map(args => callOrApply(fn, args));
            }

            function bindCallbackInternals(isNodeStyle, callbackFunc, resultSelector, scheduler) {
                if (resultSelector) {
                    if (isScheduler(resultSelector)) {
                        scheduler = resultSelector;
                    }
                    else {
                        return function (...args) {
                            return bindCallbackInternals(isNodeStyle, callbackFunc, scheduler)
                                .apply(this, args)
                                .pipe(mapOneOrManyArgs(resultSelector));
                        };
                    }
                }
                if (scheduler) {
                    return function (...args) {
                        return bindCallbackInternals(isNodeStyle, callbackFunc)
                            .apply(this, args)
                            .pipe(subscribeOn(scheduler), observeOn(scheduler));
                    };
                }
                return function (...args) {
                    const subject = new AsyncSubject();
                    let uninitialized = true;
                    return new Observable((subscriber) => {
                        const subs = subject.subscribe(subscriber);
                        if (uninitialized) {
                            uninitialized = false;
                            let isAsync = false;
                            let isComplete = false;
                            callbackFunc.apply(this, [
                                ...args,
                                (...results) => {
                                    if (isNodeStyle) {
                                        const err = results.shift();
                                        if (err != null) {
                                            subject.error(err);
                                            return;
                                        }
                                    }
                                    subject.next(1 < results.length ? results : results[0]);
                                    isComplete = true;
                                    if (isAsync) {
                                        subject.complete();
                                    }
                                },
                            ]);
                            if (isComplete) {
                                subject.complete();
                            }
                            isAsync = true;
                        }
                        return subs;
                    });
                };
            }

            function bindCallback(callbackFunc, resultSelector, scheduler) {
                return bindCallbackInternals(false, callbackFunc, resultSelector, scheduler);
            }

            function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
                return bindCallbackInternals(true, callbackFunc, resultSelector, scheduler);
            }

            const { isArray: isArray$1 } = Array;
            const { getPrototypeOf, prototype: objectProto, keys: getKeys } = Object;
            function argsArgArrayOrObject(args) {
                if (args.length === 1) {
                    const first = args[0];
                    if (isArray$1(first)) {
                        return { args: first, keys: null };
                    }
                    if (isPOJO(first)) {
                        const keys = getKeys(first);
                        return {
                            args: keys.map((key) => first[key]),
                            keys,
                        };
                    }
                }
                return { args: args, keys: null };
            }
            function isPOJO(obj) {
                return obj && typeof obj === 'object' && getPrototypeOf(obj) === objectProto;
            }

            function createObject(keys, values) {
                return keys.reduce((result, key, i) => ((result[key] = values[i]), result), {});
            }

            function combineLatest$1(...args) {
                const scheduler = popScheduler(args);
                const resultSelector = popResultSelector(args);
                const { args: observables, keys } = argsArgArrayOrObject(args);
                if (observables.length === 0) {
                    return from([], scheduler);
                }
                const result = new Observable(combineLatestInit(observables, scheduler, keys
                    ?
                        (values) => createObject(keys, values)
                    :
                        identity));
                return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
            }
            function combineLatestInit(observables, scheduler, valueTransform = identity) {
                return (subscriber) => {
                    maybeSchedule(scheduler, () => {
                        const { length } = observables;
                        const values = new Array(length);
                        let active = length;
                        let remainingFirstValues = length;
                        for (let i = 0; i < length; i++) {
                            maybeSchedule(scheduler, () => {
                                const source = from(observables[i], scheduler);
                                let hasFirstValue = false;
                                source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                                    values[i] = value;
                                    if (!hasFirstValue) {
                                        hasFirstValue = true;
                                        remainingFirstValues--;
                                    }
                                    if (!remainingFirstValues) {
                                        subscriber.next(valueTransform(values.slice()));
                                    }
                                }, () => {
                                    if (!--active) {
                                        subscriber.complete();
                                    }
                                }));
                            }, subscriber);
                        }
                    }, subscriber);
                };
            }
            function maybeSchedule(scheduler, execute, subscription) {
                if (scheduler) {
                    executeSchedule(subscription, scheduler, execute);
                }
                else {
                    execute();
                }
            }

            function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalTeardown) {
                const buffer = [];
                let active = 0;
                let index = 0;
                let isComplete = false;
                const checkComplete = () => {
                    if (isComplete && !buffer.length && !active) {
                        subscriber.complete();
                    }
                };
                const outerNext = (value) => (active < concurrent ? doInnerSub(value) : buffer.push(value));
                const doInnerSub = (value) => {
                    expand && subscriber.next(value);
                    active++;
                    let innerComplete = false;
                    innerFrom(project(value, index++)).subscribe(new OperatorSubscriber(subscriber, (innerValue) => {
                        onBeforeNext === null || onBeforeNext === void 0 ? void 0 : onBeforeNext(innerValue);
                        if (expand) {
                            outerNext(innerValue);
                        }
                        else {
                            subscriber.next(innerValue);
                        }
                    }, () => {
                        innerComplete = true;
                    }, undefined, () => {
                        if (innerComplete) {
                            try {
                                active--;
                                while (buffer.length && active < concurrent) {
                                    const bufferedValue = buffer.shift();
                                    if (innerSubScheduler) {
                                        executeSchedule(subscriber, innerSubScheduler, () => doInnerSub(bufferedValue));
                                    }
                                    else {
                                        doInnerSub(bufferedValue);
                                    }
                                }
                                checkComplete();
                            }
                            catch (err) {
                                subscriber.error(err);
                            }
                        }
                    }));
                };
                source.subscribe(new OperatorSubscriber(subscriber, outerNext, () => {
                    isComplete = true;
                    checkComplete();
                }));
                return () => {
                    additionalTeardown === null || additionalTeardown === void 0 ? void 0 : additionalTeardown();
                };
            }

            function mergeMap(project, resultSelector, concurrent = Infinity) {
                if (isFunction(resultSelector)) {
                    return mergeMap((a, i) => map((b, ii) => resultSelector(a, b, i, ii))(innerFrom(project(a, i))), concurrent);
                }
                else if (typeof resultSelector === 'number') {
                    concurrent = resultSelector;
                }
                return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent));
            }

            function mergeAll(concurrent = Infinity) {
                return mergeMap(identity, concurrent);
            }

            function concatAll() {
                return mergeAll(1);
            }

            function concat$1(...args) {
                return concatAll()(from(args, popScheduler(args)));
            }

            function defer(observableFactory) {
                return new Observable((subscriber) => {
                    innerFrom(observableFactory()).subscribe(subscriber);
                });
            }

            const DEFAULT_CONFIG$1 = {
                connector: () => new Subject(),
                resetOnDisconnect: true,
            };
            function connectable(source, config = DEFAULT_CONFIG$1) {
                let connection = null;
                const { connector, resetOnDisconnect = true } = config;
                let subject = connector();
                const result = new Observable((subscriber) => {
                    return subject.subscribe(subscriber);
                });
                result.connect = () => {
                    if (!connection || connection.closed) {
                        connection = defer(() => source).subscribe(subject);
                        if (resetOnDisconnect) {
                            connection.add(() => (subject = connector()));
                        }
                    }
                    return connection;
                };
                return result;
            }

            function forkJoin(...args) {
                const resultSelector = popResultSelector(args);
                const { args: sources, keys } = argsArgArrayOrObject(args);
                const result = new Observable((subscriber) => {
                    const { length } = sources;
                    if (!length) {
                        subscriber.complete();
                        return;
                    }
                    const values = new Array(length);
                    let remainingCompletions = length;
                    let remainingEmissions = length;
                    for (let sourceIndex = 0; sourceIndex < length; sourceIndex++) {
                        let hasValue = false;
                        innerFrom(sources[sourceIndex]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                            if (!hasValue) {
                                hasValue = true;
                                remainingEmissions--;
                            }
                            values[sourceIndex] = value;
                        }, () => remainingCompletions--, undefined, () => {
                            if (!remainingCompletions || !hasValue) {
                                if (!remainingEmissions) {
                                    subscriber.next(keys ? createObject(keys, values) : values);
                                }
                                subscriber.complete();
                            }
                        }));
                    }
                });
                return resultSelector ? result.pipe(mapOneOrManyArgs(resultSelector)) : result;
            }

            const nodeEventEmitterMethods = ['addListener', 'removeListener'];
            const eventTargetMethods = ['addEventListener', 'removeEventListener'];
            const jqueryMethods = ['on', 'off'];
            function fromEvent(target, eventName, options, resultSelector) {
                if (isFunction(options)) {
                    resultSelector = options;
                    options = undefined;
                }
                if (resultSelector) {
                    return fromEvent(target, eventName, options).pipe(mapOneOrManyArgs(resultSelector));
                }
                const [add, remove] = isEventTarget(target)
                    ? eventTargetMethods.map((methodName) => (handler) => target[methodName](eventName, handler, options))
                    :
                        isNodeStyleEventEmitter(target)
                            ? nodeEventEmitterMethods.map(toCommonHandlerRegistry(target, eventName))
                            : isJQueryStyleEventEmitter(target)
                                ? jqueryMethods.map(toCommonHandlerRegistry(target, eventName))
                                : [];
                if (!add) {
                    if (isArrayLike(target)) {
                        return mergeMap((subTarget) => fromEvent(subTarget, eventName, options))(innerFrom(target));
                    }
                }
                if (!add) {
                    throw new TypeError('Invalid event target');
                }
                return new Observable((subscriber) => {
                    const handler = (...args) => subscriber.next(1 < args.length ? args : args[0]);
                    add(handler);
                    return () => remove(handler);
                });
            }
            function toCommonHandlerRegistry(target, eventName) {
                return (methodName) => (handler) => target[methodName](eventName, handler);
            }
            function isNodeStyleEventEmitter(target) {
                return isFunction(target.addListener) && isFunction(target.removeListener);
            }
            function isJQueryStyleEventEmitter(target) {
                return isFunction(target.on) && isFunction(target.off);
            }
            function isEventTarget(target) {
                return isFunction(target.addEventListener) && isFunction(target.removeEventListener);
            }

            function fromEventPattern(addHandler, removeHandler, resultSelector) {
                if (resultSelector) {
                    return fromEventPattern(addHandler, removeHandler).pipe(mapOneOrManyArgs(resultSelector));
                }
                return new Observable((subscriber) => {
                    const handler = (...e) => subscriber.next(e.length === 1 ? e[0] : e);
                    const retValue = addHandler(handler);
                    return isFunction(removeHandler) ? () => removeHandler(handler, retValue) : undefined;
                });
            }

            function generate(initialStateOrOptions, condition, iterate, resultSelectorOrScheduler, scheduler) {
                let resultSelector;
                let initialState;
                if (arguments.length === 1) {
                    ({
                        initialState,
                        condition,
                        iterate,
                        resultSelector = identity,
                        scheduler,
                    } = initialStateOrOptions);
                }
                else {
                    initialState = initialStateOrOptions;
                    if (!resultSelectorOrScheduler || isScheduler(resultSelectorOrScheduler)) {
                        resultSelector = identity;
                        scheduler = resultSelectorOrScheduler;
                    }
                    else {
                        resultSelector = resultSelectorOrScheduler;
                    }
                }
                function* gen() {
                    for (let state = initialState; !condition || condition(state); state = iterate(state)) {
                        yield resultSelector(state);
                    }
                }
                return defer((scheduler
                    ?
                        () => scheduleIterable(gen(), scheduler)
                    :
                        gen));
            }

            function iif(condition, trueResult, falseResult) {
                return defer(() => (condition() ? trueResult : falseResult));
            }

            function timer(dueTime = 0, intervalOrScheduler, scheduler = async) {
                let intervalDuration = -1;
                if (intervalOrScheduler != null) {
                    if (isScheduler(intervalOrScheduler)) {
                        scheduler = intervalOrScheduler;
                    }
                    else {
                        intervalDuration = intervalOrScheduler;
                    }
                }
                return new Observable((subscriber) => {
                    let due = isValidDate(dueTime) ? +dueTime - scheduler.now() : dueTime;
                    if (due < 0) {
                        due = 0;
                    }
                    let n = 0;
                    return scheduler.schedule(function () {
                        if (!subscriber.closed) {
                            subscriber.next(n++);
                            if (0 <= intervalDuration) {
                                this.schedule(undefined, intervalDuration);
                            }
                            else {
                                subscriber.complete();
                            }
                        }
                    }, due);
                });
            }

            function interval(period = 0, scheduler = asyncScheduler) {
                if (period < 0) {
                    period = 0;
                }
                return timer(period, period, scheduler);
            }

            function merge$1(...args) {
                const scheduler = popScheduler(args);
                const concurrent = popNumber(args, Infinity);
                const sources = args;
                return !sources.length
                    ?
                        EMPTY
                    : sources.length === 1
                        ?
                            innerFrom(sources[0])
                        :
                            mergeAll(concurrent)(from(sources, scheduler));
            }

            const NEVER = exports('al', new Observable(noop));
            function never() {
                return NEVER;
            }

            const { isArray } = Array;
            function argsOrArgArray(args) {
                return args.length === 1 && isArray(args[0]) ? args[0] : args;
            }

            function onErrorResumeNext$1(...sources) {
                const nextSources = argsOrArgArray(sources);
                return operate((source, subscriber) => {
                    const remaining = [source, ...nextSources];
                    const subscribeNext = () => {
                        if (!subscriber.closed) {
                            if (remaining.length > 0) {
                                let nextSource;
                                try {
                                    nextSource = innerFrom(remaining.shift());
                                }
                                catch (err) {
                                    subscribeNext();
                                    return;
                                }
                                const innerSub = new OperatorSubscriber(subscriber, undefined, noop, noop);
                                subscriber.add(nextSource.subscribe(innerSub));
                                innerSub.add(subscribeNext);
                            }
                            else {
                                subscriber.complete();
                            }
                        }
                    };
                    subscribeNext();
                });
            }

            function onErrorResumeNext(...sources) {
                return onErrorResumeNext$1(argsOrArgArray(sources))(EMPTY);
            }

            function pairs(obj, scheduler) {
                return from(Object.entries(obj), scheduler);
            }

            function not(pred, thisArg) {
                return (value, index) => !pred.call(thisArg, value, index);
            }

            function filter(predicate, thisArg) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => predicate.call(thisArg, value, index++) && subscriber.next(value)));
                });
            }

            function partition$1(source, predicate, thisArg) {
                return [filter(predicate, thisArg)(innerFrom(source)), filter(not(predicate, thisArg))(innerFrom(source))];
            }

            function race$1(...sources) {
                sources = argsOrArgArray(sources);
                return sources.length === 1 ? innerFrom(sources[0]) : new Observable(raceInit(sources));
            }
            function raceInit(sources) {
                return (subscriber) => {
                    let subscriptions = [];
                    for (let i = 0; subscriptions && !subscriber.closed && i < sources.length; i++) {
                        subscriptions.push(innerFrom(sources[i]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                            if (subscriptions) {
                                for (let s = 0; s < subscriptions.length; s++) {
                                    s !== i && subscriptions[s].unsubscribe();
                                }
                                subscriptions = null;
                            }
                            subscriber.next(value);
                        })));
                    }
                };
            }

            function range(start, count, scheduler) {
                if (count == null) {
                    count = start;
                    start = 0;
                }
                if (count <= 0) {
                    return EMPTY;
                }
                const end = count + start;
                return new Observable(scheduler
                    ?
                        (subscriber) => {
                            let n = start;
                            return scheduler.schedule(function () {
                                if (n < end) {
                                    subscriber.next(n++);
                                    this.schedule();
                                }
                                else {
                                    subscriber.complete();
                                }
                            });
                        }
                    :
                        (subscriber) => {
                            let n = start;
                            while (n < end && !subscriber.closed) {
                                subscriber.next(n++);
                            }
                            subscriber.complete();
                        });
            }

            function using(resourceFactory, observableFactory) {
                return new Observable((subscriber) => {
                    const resource = resourceFactory();
                    const result = observableFactory(resource);
                    const source = result ? innerFrom(result) : EMPTY;
                    source.subscribe(subscriber);
                    return () => {
                        if (resource) {
                            resource.unsubscribe();
                        }
                    };
                });
            }

            function zip$1(...args) {
                const resultSelector = popResultSelector(args);
                const sources = argsOrArgArray(args);
                return sources.length
                    ? new Observable((subscriber) => {
                        let buffers = sources.map(() => []);
                        let completed = sources.map(() => false);
                        subscriber.add(() => {
                            buffers = completed = null;
                        });
                        for (let sourceIndex = 0; !subscriber.closed && sourceIndex < sources.length; sourceIndex++) {
                            innerFrom(sources[sourceIndex]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                                buffers[sourceIndex].push(value);
                                if (buffers.every((buffer) => buffer.length)) {
                                    const result = buffers.map((buffer) => buffer.shift());
                                    subscriber.next(resultSelector ? resultSelector(...result) : result);
                                    if (buffers.some((buffer, i) => !buffer.length && completed[i])) {
                                        subscriber.complete();
                                    }
                                }
                            }, () => {
                                completed[sourceIndex] = true;
                                !buffers[sourceIndex].length && subscriber.complete();
                            }));
                        }
                        return () => {
                            buffers = completed = null;
                        };
                    })
                    : EMPTY;
            }

            function audit(durationSelector) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let lastValue = null;
                    let durationSubscriber = null;
                    let isComplete = false;
                    const endDuration = () => {
                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                        durationSubscriber = null;
                        if (hasValue) {
                            hasValue = false;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                        isComplete && subscriber.complete();
                    };
                    const cleanupDuration = () => {
                        durationSubscriber = null;
                        isComplete && subscriber.complete();
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        lastValue = value;
                        if (!durationSubscriber) {
                            innerFrom(durationSelector(value)).subscribe((durationSubscriber = new OperatorSubscriber(subscriber, endDuration, cleanupDuration)));
                        }
                    }, () => {
                        isComplete = true;
                        (!hasValue || !durationSubscriber || durationSubscriber.closed) && subscriber.complete();
                    }));
                });
            }

            function auditTime(duration, scheduler = asyncScheduler) {
                return audit(() => timer(duration, scheduler));
            }

            function buffer(closingNotifier) {
                return operate((source, subscriber) => {
                    let currentBuffer = [];
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => currentBuffer.push(value), () => {
                        subscriber.next(currentBuffer);
                        subscriber.complete();
                    }));
                    closingNotifier.subscribe(new OperatorSubscriber(subscriber, () => {
                        const b = currentBuffer;
                        currentBuffer = [];
                        subscriber.next(b);
                    }, noop));
                    return () => {
                        currentBuffer = null;
                    };
                });
            }

            function bufferCount(bufferSize, startBufferEvery = null) {
                startBufferEvery = startBufferEvery !== null && startBufferEvery !== void 0 ? startBufferEvery : bufferSize;
                return operate((source, subscriber) => {
                    let buffers = [];
                    let count = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        let toEmit = null;
                        if (count++ % startBufferEvery === 0) {
                            buffers.push([]);
                        }
                        for (const buffer of buffers) {
                            buffer.push(value);
                            if (bufferSize <= buffer.length) {
                                toEmit = toEmit !== null && toEmit !== void 0 ? toEmit : [];
                                toEmit.push(buffer);
                            }
                        }
                        if (toEmit) {
                            for (const buffer of toEmit) {
                                arrRemove(buffers, buffer);
                                subscriber.next(buffer);
                            }
                        }
                    }, () => {
                        for (const buffer of buffers) {
                            subscriber.next(buffer);
                        }
                        subscriber.complete();
                    }, undefined, () => {
                        buffers = null;
                    }));
                });
            }

            function bufferTime(bufferTimeSpan, ...otherArgs) {
                var _a, _b;
                const scheduler = (_a = popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : asyncScheduler;
                const bufferCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
                const maxBufferSize = otherArgs[1] || Infinity;
                return operate((source, subscriber) => {
                    let bufferRecords = [];
                    let restartOnEmit = false;
                    const emit = (record) => {
                        const { buffer, subs } = record;
                        subs.unsubscribe();
                        arrRemove(bufferRecords, record);
                        subscriber.next(buffer);
                        restartOnEmit && startBuffer();
                    };
                    const startBuffer = () => {
                        if (bufferRecords) {
                            const subs = new Subscription();
                            subscriber.add(subs);
                            const buffer = [];
                            const record = {
                                buffer,
                                subs,
                            };
                            bufferRecords.push(record);
                            executeSchedule(subs, scheduler, () => emit(record), bufferTimeSpan);
                        }
                    };
                    if (bufferCreationInterval !== null && bufferCreationInterval >= 0) {
                        executeSchedule(subscriber, scheduler, startBuffer, bufferCreationInterval, true);
                    }
                    else {
                        restartOnEmit = true;
                    }
                    startBuffer();
                    const bufferTimeSubscriber = new OperatorSubscriber(subscriber, (value) => {
                        const recordsCopy = bufferRecords.slice();
                        for (const record of recordsCopy) {
                            const { buffer } = record;
                            buffer.push(value);
                            maxBufferSize <= buffer.length && emit(record);
                        }
                    }, () => {
                        while (bufferRecords === null || bufferRecords === void 0 ? void 0 : bufferRecords.length) {
                            subscriber.next(bufferRecords.shift().buffer);
                        }
                        bufferTimeSubscriber === null || bufferTimeSubscriber === void 0 ? void 0 : bufferTimeSubscriber.unsubscribe();
                        subscriber.complete();
                        subscriber.unsubscribe();
                    }, undefined, () => (bufferRecords = null));
                    source.subscribe(bufferTimeSubscriber);
                });
            }

            function bufferToggle(openings, closingSelector) {
                return operate((source, subscriber) => {
                    const buffers = [];
                    innerFrom(openings).subscribe(new OperatorSubscriber(subscriber, (openValue) => {
                        const buffer = [];
                        buffers.push(buffer);
                        const closingSubscription = new Subscription();
                        const emitBuffer = () => {
                            arrRemove(buffers, buffer);
                            subscriber.next(buffer);
                            closingSubscription.unsubscribe();
                        };
                        closingSubscription.add(innerFrom(closingSelector(openValue)).subscribe(new OperatorSubscriber(subscriber, emitBuffer, noop)));
                    }, noop));
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        for (const buffer of buffers) {
                            buffer.push(value);
                        }
                    }, () => {
                        while (buffers.length > 0) {
                            subscriber.next(buffers.shift());
                        }
                        subscriber.complete();
                    }));
                });
            }

            function bufferWhen(closingSelector) {
                return operate((source, subscriber) => {
                    let buffer = null;
                    let closingSubscriber = null;
                    const openBuffer = () => {
                        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                        const b = buffer;
                        buffer = [];
                        b && subscriber.next(b);
                        innerFrom(closingSelector()).subscribe((closingSubscriber = new OperatorSubscriber(subscriber, openBuffer, noop)));
                    };
                    openBuffer();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => buffer === null || buffer === void 0 ? void 0 : buffer.push(value), () => {
                        buffer && subscriber.next(buffer);
                        subscriber.complete();
                    }, undefined, () => (buffer = closingSubscriber = null)));
                });
            }

            function catchError(selector) {
                return operate((source, subscriber) => {
                    let innerSub = null;
                    let syncUnsub = false;
                    let handledResult;
                    innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, undefined, (err) => {
                        handledResult = innerFrom(selector(err, catchError(selector)(source)));
                        if (innerSub) {
                            innerSub.unsubscribe();
                            innerSub = null;
                            handledResult.subscribe(subscriber);
                        }
                        else {
                            syncUnsub = true;
                        }
                    }));
                    if (syncUnsub) {
                        innerSub.unsubscribe();
                        innerSub = null;
                        handledResult.subscribe(subscriber);
                    }
                });
            }

            function scanInternals(accumulator, seed, hasSeed, emitOnNext, emitBeforeComplete) {
                return (source, subscriber) => {
                    let hasState = hasSeed;
                    let state = seed;
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const i = index++;
                        state = hasState
                            ?
                                accumulator(state, value, i)
                            :
                                ((hasState = true), value);
                        emitOnNext && subscriber.next(state);
                    }, emitBeforeComplete &&
                        (() => {
                            hasState && subscriber.next(state);
                            subscriber.complete();
                        })));
                };
            }

            function reduce(accumulator, seed) {
                return operate(scanInternals(accumulator, seed, arguments.length >= 2, false, true));
            }

            const arrReducer = (arr, value) => (arr.push(value), arr);
            function toArray() {
                return operate((source, subscriber) => {
                    reduce(arrReducer, [])(source).subscribe(subscriber);
                });
            }

            function joinAllInternals(joinFn, project) {
                return pipe(toArray(), mergeMap((sources) => joinFn(sources)), project ? mapOneOrManyArgs(project) : identity);
            }

            function combineLatestAll(project) {
                return joinAllInternals(combineLatest$1, project);
            }

            const combineAll = exports('av', combineLatestAll);

            function combineLatest(...args) {
                const resultSelector = popResultSelector(args);
                return resultSelector
                    ? pipe(combineLatest(...args), mapOneOrManyArgs(resultSelector))
                    : operate((source, subscriber) => {
                        combineLatestInit([source, ...argsOrArgArray(args)])(subscriber);
                    });
            }

            function combineLatestWith(...otherSources) {
                return combineLatest(...otherSources);
            }

            function concatMap(project, resultSelector) {
                return isFunction(resultSelector) ? mergeMap(project, resultSelector, 1) : mergeMap(project, 1);
            }

            function concatMapTo(innerObservable, resultSelector) {
                return isFunction(resultSelector) ? concatMap(() => innerObservable, resultSelector) : concatMap(() => innerObservable);
            }

            function concat(...args) {
                const scheduler = popScheduler(args);
                return operate((source, subscriber) => {
                    concatAll()(from([source, ...args], scheduler)).subscribe(subscriber);
                });
            }

            function concatWith(...otherSources) {
                return concat(...otherSources);
            }

            function fromSubscribable(subscribable) {
                return new Observable((subscriber) => subscribable.subscribe(subscriber));
            }

            const DEFAULT_CONFIG = {
                connector: () => new Subject(),
            };
            function connect(selector, config = DEFAULT_CONFIG) {
                const { connector } = config;
                return operate((source, subscriber) => {
                    const subject = connector();
                    from(selector(fromSubscribable(subject))).subscribe(subscriber);
                    subscriber.add(source.subscribe(subject));
                });
            }

            function count(predicate) {
                return reduce((total, value, i) => (!predicate || predicate(value, i) ? total + 1 : total), 0);
            }

            function debounce(durationSelector) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let lastValue = null;
                    let durationSubscriber = null;
                    const emit = () => {
                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                        durationSubscriber = null;
                        if (hasValue) {
                            hasValue = false;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                        hasValue = true;
                        lastValue = value;
                        durationSubscriber = new OperatorSubscriber(subscriber, emit, noop);
                        innerFrom(durationSelector(value)).subscribe(durationSubscriber);
                    }, () => {
                        emit();
                        subscriber.complete();
                    }, undefined, () => {
                        lastValue = durationSubscriber = null;
                    }));
                });
            }

            function debounceTime(dueTime, scheduler = asyncScheduler) {
                return operate((source, subscriber) => {
                    let activeTask = null;
                    let lastValue = null;
                    let lastTime = null;
                    const emit = () => {
                        if (activeTask) {
                            activeTask.unsubscribe();
                            activeTask = null;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                    };
                    function emitWhenIdle() {
                        const targetTime = lastTime + dueTime;
                        const now = scheduler.now();
                        if (now < targetTime) {
                            activeTask = this.schedule(undefined, targetTime - now);
                            subscriber.add(activeTask);
                            return;
                        }
                        emit();
                    }
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        lastValue = value;
                        lastTime = scheduler.now();
                        if (!activeTask) {
                            activeTask = scheduler.schedule(emitWhenIdle, dueTime);
                            subscriber.add(activeTask);
                        }
                    }, () => {
                        emit();
                        subscriber.complete();
                    }, undefined, () => {
                        lastValue = activeTask = null;
                    }));
                });
            }

            function defaultIfEmpty(defaultValue) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        subscriber.next(value);
                    }, () => {
                        if (!hasValue) {
                            subscriber.next(defaultValue);
                        }
                        subscriber.complete();
                    }));
                });
            }

            function take(count) {
                return count <= 0
                    ?
                        () => EMPTY
                    : operate((source, subscriber) => {
                        let seen = 0;
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            if (++seen <= count) {
                                subscriber.next(value);
                                if (count <= seen) {
                                    subscriber.complete();
                                }
                            }
                        }));
                    });
            }

            function ignoreElements() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, noop));
                });
            }

            function mapTo(value) {
                return map(() => value);
            }

            function delayWhen(delayDurationSelector, subscriptionDelay) {
                if (subscriptionDelay) {
                    return (source) => concat$1(subscriptionDelay.pipe(take(1), ignoreElements()), source.pipe(delayWhen(delayDurationSelector)));
                }
                return mergeMap((value, index) => delayDurationSelector(value, index).pipe(take(1), mapTo(value)));
            }

            function delay(due, scheduler = asyncScheduler) {
                const duration = timer(due, scheduler);
                return delayWhen(() => duration);
            }

            function dematerialize() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, (notification) => observeNotification(notification, subscriber)));
                });
            }

            function distinct(keySelector, flushes) {
                return operate((source, subscriber) => {
                    const distinctKeys = new Set();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const key = keySelector ? keySelector(value) : value;
                        if (!distinctKeys.has(key)) {
                            distinctKeys.add(key);
                            subscriber.next(value);
                        }
                    }));
                    flushes === null || flushes === void 0 ? void 0 : flushes.subscribe(new OperatorSubscriber(subscriber, () => distinctKeys.clear(), noop));
                });
            }

            function distinctUntilChanged(comparator, keySelector = identity) {
                comparator = comparator !== null && comparator !== void 0 ? comparator : defaultCompare;
                return operate((source, subscriber) => {
                    let previousKey;
                    let first = true;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const currentKey = keySelector(value);
                        if (first || !comparator(previousKey, currentKey)) {
                            first = false;
                            previousKey = currentKey;
                            subscriber.next(value);
                        }
                    }));
                });
            }
            function defaultCompare(a, b) {
                return a === b;
            }

            function distinctUntilKeyChanged(key, compare) {
                return distinctUntilChanged((x, y) => compare ? compare(x[key], y[key]) : x[key] === y[key]);
            }

            function throwIfEmpty(errorFactory = defaultErrorFactory) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        subscriber.next(value);
                    }, () => (hasValue ? subscriber.complete() : subscriber.error(errorFactory()))));
                });
            }
            function defaultErrorFactory() {
                return new EmptyError();
            }

            function elementAt(index, defaultValue) {
                if (index < 0) {
                    throw new ArgumentOutOfRangeError();
                }
                const hasDefaultValue = arguments.length >= 2;
                return (source) => source.pipe(filter((v, i) => i === index), take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new ArgumentOutOfRangeError()));
            }

            function endWith(...values) {
                return (source) => concat$1(source, of(...values));
            }

            function every(predicate, thisArg) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        if (!predicate.call(thisArg, value, index++, source)) {
                            subscriber.next(false);
                            subscriber.complete();
                        }
                    }, () => {
                        subscriber.next(true);
                        subscriber.complete();
                    }));
                });
            }

            function exhaustAll() {
                return operate((source, subscriber) => {
                    let isComplete = false;
                    let innerSub = null;
                    source.subscribe(new OperatorSubscriber(subscriber, (inner) => {
                        if (!innerSub) {
                            innerSub = innerFrom(inner).subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                                innerSub = null;
                                isComplete && subscriber.complete();
                            }));
                        }
                    }, () => {
                        isComplete = true;
                        !innerSub && subscriber.complete();
                    }));
                });
            }

            const exhaust = exports('aQ', exhaustAll);

            function exhaustMap(project, resultSelector) {
                if (resultSelector) {
                    return (source) => source.pipe(exhaustMap((a, i) => innerFrom(project(a, i)).pipe(map((b, ii) => resultSelector(a, b, i, ii)))));
                }
                return operate((source, subscriber) => {
                    let index = 0;
                    let innerSub = null;
                    let isComplete = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (outerValue) => {
                        if (!innerSub) {
                            innerSub = new OperatorSubscriber(subscriber, undefined, () => {
                                innerSub = null;
                                isComplete && subscriber.complete();
                            });
                            innerFrom(project(outerValue, index++)).subscribe(innerSub);
                        }
                    }, () => {
                        isComplete = true;
                        !innerSub && subscriber.complete();
                    }));
                });
            }

            function expand(project, concurrent = Infinity, scheduler) {
                concurrent = (concurrent || 0) < 1 ? Infinity : concurrent;
                return operate((source, subscriber) => mergeInternals(source, subscriber, project, concurrent, undefined, true, scheduler));
            }

            function finalize(callback) {
                return operate((source, subscriber) => {
                    try {
                        source.subscribe(subscriber);
                    }
                    finally {
                        subscriber.add(callback);
                    }
                });
            }

            function find(predicate, thisArg) {
                return operate(createFind(predicate, thisArg, 'value'));
            }
            function createFind(predicate, thisArg, emit) {
                const findIndex = emit === 'index';
                return (source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const i = index++;
                        if (predicate.call(thisArg, value, i, source)) {
                            subscriber.next(findIndex ? i : value);
                            subscriber.complete();
                        }
                    }, () => {
                        subscriber.next(findIndex ? -1 : undefined);
                        subscriber.complete();
                    }));
                };
            }

            function findIndex(predicate, thisArg) {
                return operate(createFind(predicate, thisArg, 'index'));
            }

            function first(predicate, defaultValue) {
                const hasDefaultValue = arguments.length >= 2;
                return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, take(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
            }

            function groupBy(keySelector, elementOrOptions, duration, connector) {
                return operate((source, subscriber) => {
                    let element;
                    if (!elementOrOptions || typeof elementOrOptions === 'function') {
                        element = elementOrOptions;
                    }
                    else {
                        ({ duration, element, connector } = elementOrOptions);
                    }
                    const groups = new Map();
                    const notify = (cb) => {
                        groups.forEach(cb);
                        cb(subscriber);
                    };
                    const handleError = (err) => notify((consumer) => consumer.error(err));
                    const groupBySourceSubscriber = new GroupBySubscriber(subscriber, (value) => {
                        try {
                            const key = keySelector(value);
                            let group = groups.get(key);
                            if (!group) {
                                groups.set(key, (group = connector ? connector() : new Subject()));
                                const grouped = createGroupedObservable(key, group);
                                subscriber.next(grouped);
                                if (duration) {
                                    const durationSubscriber = new OperatorSubscriber(group, () => {
                                        group.complete();
                                        durationSubscriber === null || durationSubscriber === void 0 ? void 0 : durationSubscriber.unsubscribe();
                                    }, undefined, undefined, () => groups.delete(key));
                                    groupBySourceSubscriber.add(innerFrom(duration(grouped)).subscribe(durationSubscriber));
                                }
                            }
                            group.next(element ? element(value) : value);
                        }
                        catch (err) {
                            handleError(err);
                        }
                    }, () => notify((consumer) => consumer.complete()), handleError, () => groups.clear());
                    source.subscribe(groupBySourceSubscriber);
                    function createGroupedObservable(key, groupSubject) {
                        const result = new Observable((groupSubscriber) => {
                            groupBySourceSubscriber.activeGroups++;
                            const innerSub = groupSubject.subscribe(groupSubscriber);
                            return () => {
                                innerSub.unsubscribe();
                                --groupBySourceSubscriber.activeGroups === 0 &&
                                    groupBySourceSubscriber.teardownAttempted &&
                                    groupBySourceSubscriber.unsubscribe();
                            };
                        });
                        result.key = key;
                        return result;
                    }
                });
            }
            class GroupBySubscriber extends OperatorSubscriber {
                constructor() {
                    super(...arguments);
                    this.activeGroups = 0;
                    this.teardownAttempted = false;
                }
                unsubscribe() {
                    this.teardownAttempted = true;
                    this.activeGroups === 0 && super.unsubscribe();
                }
            }

            function isEmpty() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, () => {
                        subscriber.next(false);
                        subscriber.complete();
                    }, () => {
                        subscriber.next(true);
                        subscriber.complete();
                    }));
                });
            }

            function takeLast(count) {
                return count <= 0
                    ? () => EMPTY
                    : operate((source, subscriber) => {
                        let buffer = [];
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            buffer.push(value);
                            count < buffer.length && buffer.shift();
                        }, () => {
                            for (const value of buffer) {
                                subscriber.next(value);
                            }
                            subscriber.complete();
                        }, undefined, () => {
                            buffer = null;
                        }));
                    });
            }

            function last(predicate, defaultValue) {
                const hasDefaultValue = arguments.length >= 2;
                return (source) => source.pipe(predicate ? filter((v, i) => predicate(v, i, source)) : identity, takeLast(1), hasDefaultValue ? defaultIfEmpty(defaultValue) : throwIfEmpty(() => new EmptyError()));
            }

            function materialize() {
                return operate((source, subscriber) => {
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        subscriber.next(Notification.createNext(value));
                    }, () => {
                        subscriber.next(Notification.createComplete());
                        subscriber.complete();
                    }, (err) => {
                        subscriber.next(Notification.createError(err));
                        subscriber.complete();
                    }));
                });
            }

            function max(comparer) {
                return reduce(isFunction(comparer) ? (x, y) => (comparer(x, y) > 0 ? x : y) : (x, y) => (x > y ? x : y));
            }

            const flatMap = exports('b6', mergeMap);

            function mergeMapTo(innerObservable, resultSelector, concurrent = Infinity) {
                if (isFunction(resultSelector)) {
                    return mergeMap(() => innerObservable, resultSelector, concurrent);
                }
                if (typeof resultSelector === 'number') {
                    concurrent = resultSelector;
                }
                return mergeMap(() => innerObservable, concurrent);
            }

            function mergeScan(accumulator, seed, concurrent = Infinity) {
                return operate((source, subscriber) => {
                    let state = seed;
                    return mergeInternals(source, subscriber, (value, index) => accumulator(state, value, index), concurrent, (value) => {
                        state = value;
                    }, false, undefined, () => (state = null));
                });
            }

            function merge(...args) {
                const scheduler = popScheduler(args);
                const concurrent = popNumber(args, Infinity);
                args = argsOrArgArray(args);
                return operate((source, subscriber) => {
                    mergeAll(concurrent)(from([source, ...args], scheduler)).subscribe(subscriber);
                });
            }

            function mergeWith(...otherSources) {
                return merge(...otherSources);
            }

            function min(comparer) {
                return reduce(isFunction(comparer) ? (x, y) => (comparer(x, y) < 0 ? x : y) : (x, y) => (x < y ? x : y));
            }

            function multicast(subjectOrSubjectFactory, selector) {
                const subjectFactory = isFunction(subjectOrSubjectFactory) ? subjectOrSubjectFactory : () => subjectOrSubjectFactory;
                if (isFunction(selector)) {
                    return connect(selector, {
                        connector: subjectFactory,
                    });
                }
                return (source) => new ConnectableObservable(source, subjectFactory);
            }

            function pairwise() {
                return operate((source, subscriber) => {
                    let prev;
                    let hasPrev = false;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const p = prev;
                        prev = value;
                        hasPrev && subscriber.next([p, value]);
                        hasPrev = true;
                    }));
                });
            }

            function pluck(...properties) {
                const length = properties.length;
                if (length === 0) {
                    throw new Error('list of properties cannot be empty.');
                }
                return map((x) => {
                    let currentProp = x;
                    for (let i = 0; i < length; i++) {
                        const p = currentProp === null || currentProp === void 0 ? void 0 : currentProp[properties[i]];
                        if (typeof p !== 'undefined') {
                            currentProp = p;
                        }
                        else {
                            return undefined;
                        }
                    }
                    return currentProp;
                });
            }

            function publish(selector) {
                return selector ? (source) => connect(selector)(source) : (source) => multicast(new Subject())(source);
            }

            function publishBehavior(initialValue) {
                return (source) => {
                    const subject = new BehaviorSubject(initialValue);
                    return new ConnectableObservable(source, () => subject);
                };
            }

            function publishLast() {
                return (source) => {
                    const subject = new AsyncSubject();
                    return new ConnectableObservable(source, () => subject);
                };
            }

            function publishReplay(bufferSize, windowTime, selectorOrScheduler, timestampProvider) {
                if (selectorOrScheduler && !isFunction(selectorOrScheduler)) {
                    timestampProvider = selectorOrScheduler;
                }
                const selector = isFunction(selectorOrScheduler) ? selectorOrScheduler : undefined;
                return (source) => multicast(new ReplaySubject(bufferSize, windowTime, timestampProvider), selector)(source);
            }

            function raceWith(...otherSources) {
                return !otherSources.length
                    ? identity
                    : operate((source, subscriber) => {
                        raceInit([source, ...otherSources])(subscriber);
                    });
            }

            function repeat(countOrConfig) {
                let count = Infinity;
                let delay;
                if (countOrConfig != null) {
                    if (typeof countOrConfig === 'object') {
                        ({ count = Infinity, delay } = countOrConfig);
                    }
                    else {
                        count = countOrConfig;
                    }
                }
                return count <= 0
                    ? () => EMPTY
                    : operate((source, subscriber) => {
                        let soFar = 0;
                        let sourceSub;
                        const resubscribe = () => {
                            sourceSub === null || sourceSub === void 0 ? void 0 : sourceSub.unsubscribe();
                            sourceSub = null;
                            if (delay != null) {
                                const notifier = typeof delay === 'number' ? timer(delay) : innerFrom(delay(soFar));
                                const notifierSubscriber = new OperatorSubscriber(subscriber, () => {
                                    notifierSubscriber.unsubscribe();
                                    subscribeToSource();
                                });
                                notifier.subscribe(notifierSubscriber);
                            }
                            else {
                                subscribeToSource();
                            }
                        };
                        const subscribeToSource = () => {
                            let syncUnsub = false;
                            sourceSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                                if (++soFar < count) {
                                    if (sourceSub) {
                                        resubscribe();
                                    }
                                    else {
                                        syncUnsub = true;
                                    }
                                }
                                else {
                                    subscriber.complete();
                                }
                            }));
                            if (syncUnsub) {
                                resubscribe();
                            }
                        };
                        subscribeToSource();
                    });
            }

            function repeatWhen(notifier) {
                return operate((source, subscriber) => {
                    let innerSub;
                    let syncResub = false;
                    let completions$;
                    let isNotifierComplete = false;
                    let isMainComplete = false;
                    const checkComplete = () => isMainComplete && isNotifierComplete && (subscriber.complete(), true);
                    const getCompletionSubject = () => {
                        if (!completions$) {
                            completions$ = new Subject();
                            notifier(completions$).subscribe(new OperatorSubscriber(subscriber, () => {
                                if (innerSub) {
                                    subscribeForRepeatWhen();
                                }
                                else {
                                    syncResub = true;
                                }
                            }, () => {
                                isNotifierComplete = true;
                                checkComplete();
                            }));
                        }
                        return completions$;
                    };
                    const subscribeForRepeatWhen = () => {
                        isMainComplete = false;
                        innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                            isMainComplete = true;
                            !checkComplete() && getCompletionSubject().next();
                        }));
                        if (syncResub) {
                            innerSub.unsubscribe();
                            innerSub = null;
                            syncResub = false;
                            subscribeForRepeatWhen();
                        }
                    };
                    subscribeForRepeatWhen();
                });
            }

            function retry(configOrCount = Infinity) {
                let config;
                if (configOrCount && typeof configOrCount === 'object') {
                    config = configOrCount;
                }
                else {
                    config = {
                        count: configOrCount,
                    };
                }
                const { count = Infinity, delay, resetOnSuccess: resetOnSuccess = false } = config;
                return count <= 0
                    ? identity
                    : operate((source, subscriber) => {
                        let soFar = 0;
                        let innerSub;
                        const subscribeForRetry = () => {
                            let syncUnsub = false;
                            innerSub = source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                                if (resetOnSuccess) {
                                    soFar = 0;
                                }
                                subscriber.next(value);
                            }, undefined, (err) => {
                                if (soFar++ < count) {
                                    const resub = () => {
                                        if (innerSub) {
                                            innerSub.unsubscribe();
                                            innerSub = null;
                                            subscribeForRetry();
                                        }
                                        else {
                                            syncUnsub = true;
                                        }
                                    };
                                    if (delay != null) {
                                        const notifier = typeof delay === 'number' ? timer(delay) : innerFrom(delay(err, soFar));
                                        const notifierSubscriber = new OperatorSubscriber(subscriber, () => {
                                            notifierSubscriber.unsubscribe();
                                            resub();
                                        }, () => {
                                            subscriber.complete();
                                        });
                                        notifier.subscribe(notifierSubscriber);
                                    }
                                    else {
                                        resub();
                                    }
                                }
                                else {
                                    subscriber.error(err);
                                }
                            }));
                            if (syncUnsub) {
                                innerSub.unsubscribe();
                                innerSub = null;
                                subscribeForRetry();
                            }
                        };
                        subscribeForRetry();
                    });
            }

            function retryWhen(notifier) {
                return operate((source, subscriber) => {
                    let innerSub;
                    let syncResub = false;
                    let errors$;
                    const subscribeForRetryWhen = () => {
                        innerSub = source.subscribe(new OperatorSubscriber(subscriber, undefined, undefined, (err) => {
                            if (!errors$) {
                                errors$ = new Subject();
                                notifier(errors$).subscribe(new OperatorSubscriber(subscriber, () => innerSub ? subscribeForRetryWhen() : (syncResub = true)));
                            }
                            if (errors$) {
                                errors$.next(err);
                            }
                        }));
                        if (syncResub) {
                            innerSub.unsubscribe();
                            innerSub = null;
                            syncResub = false;
                            subscribeForRetryWhen();
                        }
                    };
                    subscribeForRetryWhen();
                });
            }

            function sample(notifier) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let lastValue = null;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        lastValue = value;
                    }));
                    const emit = () => {
                        if (hasValue) {
                            hasValue = false;
                            const value = lastValue;
                            lastValue = null;
                            subscriber.next(value);
                        }
                    };
                    notifier.subscribe(new OperatorSubscriber(subscriber, emit, noop));
                });
            }

            function sampleTime(period, scheduler = asyncScheduler) {
                return sample(interval(period, scheduler));
            }

            function scan(accumulator, seed) {
                return operate(scanInternals(accumulator, seed, arguments.length >= 2, true));
            }

            function sequenceEqual(compareTo, comparator = (a, b) => a === b) {
                return operate((source, subscriber) => {
                    const aState = createState();
                    const bState = createState();
                    const emit = (isEqual) => {
                        subscriber.next(isEqual);
                        subscriber.complete();
                    };
                    const createSubscriber = (selfState, otherState) => {
                        const sequenceEqualSubscriber = new OperatorSubscriber(subscriber, (a) => {
                            const { buffer, complete } = otherState;
                            if (buffer.length === 0) {
                                complete ? emit(false) : selfState.buffer.push(a);
                            }
                            else {
                                !comparator(a, buffer.shift()) && emit(false);
                            }
                        }, () => {
                            selfState.complete = true;
                            const { complete, buffer } = otherState;
                            complete && emit(buffer.length === 0);
                            sequenceEqualSubscriber === null || sequenceEqualSubscriber === void 0 ? void 0 : sequenceEqualSubscriber.unsubscribe();
                        });
                        return sequenceEqualSubscriber;
                    };
                    source.subscribe(createSubscriber(aState, bState));
                    compareTo.subscribe(createSubscriber(bState, aState));
                });
            }
            function createState() {
                return {
                    buffer: [],
                    complete: false,
                };
            }

            function share(options = {}) {
                const { connector = () => new Subject(), resetOnError = true, resetOnComplete = true, resetOnRefCountZero = true } = options;
                return (wrapperSource) => {
                    let connection = null;
                    let resetConnection = null;
                    let subject = null;
                    let refCount = 0;
                    let hasCompleted = false;
                    let hasErrored = false;
                    const cancelReset = () => {
                        resetConnection === null || resetConnection === void 0 ? void 0 : resetConnection.unsubscribe();
                        resetConnection = null;
                    };
                    const reset = () => {
                        cancelReset();
                        connection = subject = null;
                        hasCompleted = hasErrored = false;
                    };
                    const resetAndUnsubscribe = () => {
                        const conn = connection;
                        reset();
                        conn === null || conn === void 0 ? void 0 : conn.unsubscribe();
                    };
                    return operate((source, subscriber) => {
                        refCount++;
                        if (!hasErrored && !hasCompleted) {
                            cancelReset();
                        }
                        const dest = (subject = subject !== null && subject !== void 0 ? subject : connector());
                        subscriber.add(() => {
                            refCount--;
                            if (refCount === 0 && !hasErrored && !hasCompleted) {
                                resetConnection = handleReset(resetAndUnsubscribe, resetOnRefCountZero);
                            }
                        });
                        dest.subscribe(subscriber);
                        if (!connection) {
                            connection = new SafeSubscriber({
                                next: (value) => dest.next(value),
                                error: (err) => {
                                    hasErrored = true;
                                    cancelReset();
                                    resetConnection = handleReset(reset, resetOnError, err);
                                    dest.error(err);
                                },
                                complete: () => {
                                    hasCompleted = true;
                                    cancelReset();
                                    resetConnection = handleReset(reset, resetOnComplete);
                                    dest.complete();
                                },
                            });
                            from(source).subscribe(connection);
                        }
                    })(wrapperSource);
                };
            }
            function handleReset(reset, on, ...args) {
                if (on === true) {
                    reset();
                    return null;
                }
                if (on === false) {
                    return null;
                }
                return on(...args)
                    .pipe(take(1))
                    .subscribe(() => reset());
            }

            function shareReplay(configOrBufferSize, windowTime, scheduler) {
                var _a, _b;
                let bufferSize;
                let refCount = false;
                if (configOrBufferSize && typeof configOrBufferSize === 'object') {
                    bufferSize = (_a = configOrBufferSize.bufferSize) !== null && _a !== void 0 ? _a : Infinity;
                    windowTime = (_b = configOrBufferSize.windowTime) !== null && _b !== void 0 ? _b : Infinity;
                    refCount = !!configOrBufferSize.refCount;
                    scheduler = configOrBufferSize.scheduler;
                }
                else {
                    bufferSize = configOrBufferSize !== null && configOrBufferSize !== void 0 ? configOrBufferSize : Infinity;
                }
                return share({
                    connector: () => new ReplaySubject(bufferSize, windowTime, scheduler),
                    resetOnError: true,
                    resetOnComplete: false,
                    resetOnRefCountZero: refCount,
                });
            }

            function single(predicate) {
                return operate((source, subscriber) => {
                    let hasValue = false;
                    let singleValue;
                    let seenValue = false;
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        seenValue = true;
                        if (!predicate || predicate(value, index++, source)) {
                            hasValue && subscriber.error(new SequenceError('Too many matching values'));
                            hasValue = true;
                            singleValue = value;
                        }
                    }, () => {
                        if (hasValue) {
                            subscriber.next(singleValue);
                            subscriber.complete();
                        }
                        else {
                            subscriber.error(seenValue ? new NotFoundError('No matching values') : new EmptyError());
                        }
                    }));
                });
            }

            function skip(count) {
                return filter((_, index) => count <= index);
            }

            function skipLast(skipCount) {
                return skipCount <= 0
                    ?
                        identity
                    : operate((source, subscriber) => {
                        let ring = new Array(skipCount);
                        let seen = 0;
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            const valueIndex = seen++;
                            if (valueIndex < skipCount) {
                                ring[valueIndex] = value;
                            }
                            else {
                                const index = valueIndex % skipCount;
                                const oldValue = ring[index];
                                ring[index] = value;
                                subscriber.next(oldValue);
                            }
                        }));
                        return () => {
                            ring = null;
                        };
                    });
            }

            function skipUntil(notifier) {
                return operate((source, subscriber) => {
                    let taking = false;
                    const skipSubscriber = new OperatorSubscriber(subscriber, () => {
                        skipSubscriber === null || skipSubscriber === void 0 ? void 0 : skipSubscriber.unsubscribe();
                        taking = true;
                    }, noop);
                    innerFrom(notifier).subscribe(skipSubscriber);
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => taking && subscriber.next(value)));
                });
            }

            function skipWhile(predicate) {
                return operate((source, subscriber) => {
                    let taking = false;
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => (taking || (taking = !predicate(value, index++))) && subscriber.next(value)));
                });
            }

            function startWith(...values) {
                const scheduler = popScheduler(values);
                return operate((source, subscriber) => {
                    (scheduler ? concat$1(values, source, scheduler) : concat$1(values, source)).subscribe(subscriber);
                });
            }

            function switchMap(project, resultSelector) {
                return operate((source, subscriber) => {
                    let innerSubscriber = null;
                    let index = 0;
                    let isComplete = false;
                    const checkComplete = () => isComplete && !innerSubscriber && subscriber.complete();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        innerSubscriber === null || innerSubscriber === void 0 ? void 0 : innerSubscriber.unsubscribe();
                        let innerIndex = 0;
                        const outerIndex = index++;
                        innerFrom(project(value, outerIndex)).subscribe((innerSubscriber = new OperatorSubscriber(subscriber, (innerValue) => subscriber.next(resultSelector ? resultSelector(value, innerValue, outerIndex, innerIndex++) : innerValue), () => {
                            innerSubscriber = null;
                            checkComplete();
                        })));
                    }, () => {
                        isComplete = true;
                        checkComplete();
                    }));
                });
            }

            function switchAll() {
                return switchMap(identity);
            }

            function switchMapTo(innerObservable, resultSelector) {
                return isFunction(resultSelector) ? switchMap(() => innerObservable, resultSelector) : switchMap(() => innerObservable);
            }

            function switchScan(accumulator, seed) {
                return operate((source, subscriber) => {
                    let state = seed;
                    switchMap((value, index) => accumulator(state, value, index), (_, innerValue) => ((state = innerValue), innerValue))(source).subscribe(subscriber);
                    return () => {
                        state = null;
                    };
                });
            }

            function takeUntil(notifier) {
                return operate((source, subscriber) => {
                    innerFrom(notifier).subscribe(new OperatorSubscriber(subscriber, () => subscriber.complete(), noop));
                    !subscriber.closed && source.subscribe(subscriber);
                });
            }

            function takeWhile(predicate, inclusive = false) {
                return operate((source, subscriber) => {
                    let index = 0;
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const result = predicate(value, index++);
                        (result || inclusive) && subscriber.next(value);
                        !result && subscriber.complete();
                    }));
                });
            }

            function tap(observerOrNext, error, complete) {
                const tapObserver = isFunction(observerOrNext) || error || complete
                    ?
                        { next: observerOrNext, error, complete }
                    : observerOrNext;
                return tapObserver
                    ? operate((source, subscriber) => {
                        var _a;
                        (_a = tapObserver.subscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                        let isUnsub = true;
                        source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                            var _a;
                            (_a = tapObserver.next) === null || _a === void 0 ? void 0 : _a.call(tapObserver, value);
                            subscriber.next(value);
                        }, () => {
                            var _a;
                            isUnsub = false;
                            (_a = tapObserver.complete) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                            subscriber.complete();
                        }, (err) => {
                            var _a;
                            isUnsub = false;
                            (_a = tapObserver.error) === null || _a === void 0 ? void 0 : _a.call(tapObserver, err);
                            subscriber.error(err);
                        }, () => {
                            var _a, _b;
                            if (isUnsub) {
                                (_a = tapObserver.unsubscribe) === null || _a === void 0 ? void 0 : _a.call(tapObserver);
                            }
                            (_b = tapObserver.finalize) === null || _b === void 0 ? void 0 : _b.call(tapObserver);
                        }));
                    })
                    :
                        identity;
            }

            const defaultThrottleConfig = {
                leading: true,
                trailing: false,
            };
            function throttle(durationSelector, config = defaultThrottleConfig) {
                return operate((source, subscriber) => {
                    const { leading, trailing } = config;
                    let hasValue = false;
                    let sendValue = null;
                    let throttled = null;
                    let isComplete = false;
                    const endThrottling = () => {
                        throttled === null || throttled === void 0 ? void 0 : throttled.unsubscribe();
                        throttled = null;
                        if (trailing) {
                            send();
                            isComplete && subscriber.complete();
                        }
                    };
                    const cleanupThrottling = () => {
                        throttled = null;
                        isComplete && subscriber.complete();
                    };
                    const startThrottle = (value) => (throttled = innerFrom(durationSelector(value)).subscribe(new OperatorSubscriber(subscriber, endThrottling, cleanupThrottling)));
                    const send = () => {
                        if (hasValue) {
                            hasValue = false;
                            const value = sendValue;
                            sendValue = null;
                            subscriber.next(value);
                            !isComplete && startThrottle(value);
                        }
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        hasValue = true;
                        sendValue = value;
                        !(throttled && !throttled.closed) && (leading ? send() : startThrottle(value));
                    }, () => {
                        isComplete = true;
                        !(trailing && hasValue && throttled && !throttled.closed) && subscriber.complete();
                    }));
                });
            }

            function throttleTime(duration, scheduler = asyncScheduler, config = defaultThrottleConfig) {
                const duration$ = timer(duration, scheduler);
                return throttle(() => duration$, config);
            }

            function timeInterval(scheduler = asyncScheduler) {
                return (source) => defer(() => {
                    return source.pipe(scan(({ current }, value) => ({ value, current: scheduler.now(), last: current }), {
                        current: scheduler.now(),
                        value: undefined,
                        last: undefined,
                    }), map(({ current, last, value }) => new TimeInterval(value, current - last)));
                });
            }
            class TimeInterval {
                constructor(value, interval) {
                    this.value = value;
                    this.interval = interval;
                }
            }

            function timeoutWith(due, withObservable, scheduler) {
                let first;
                let each;
                let _with;
                scheduler = scheduler !== null && scheduler !== void 0 ? scheduler : async;
                if (isValidDate(due)) {
                    first = due;
                }
                else if (typeof due === 'number') {
                    each = due;
                }
                if (withObservable) {
                    _with = () => withObservable;
                }
                else {
                    throw new TypeError('No observable provided to switch to');
                }
                if (first == null && each == null) {
                    throw new TypeError('No timeout provided.');
                }
                return timeout({
                    first,
                    each,
                    scheduler,
                    with: _with,
                });
            }

            function timestamp(timestampProvider = dateTimestampProvider) {
                return map((value) => ({ value, timestamp: timestampProvider.now() }));
            }

            function window(windowBoundaries) {
                return operate((source, subscriber) => {
                    let windowSubject = new Subject();
                    subscriber.next(windowSubject.asObservable());
                    const errorHandler = (err) => {
                        windowSubject.error(err);
                        subscriber.error(err);
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.next(value), () => {
                        windowSubject.complete();
                        subscriber.complete();
                    }, errorHandler));
                    windowBoundaries.subscribe(new OperatorSubscriber(subscriber, () => {
                        windowSubject.complete();
                        subscriber.next((windowSubject = new Subject()));
                    }, noop, errorHandler));
                    return () => {
                        windowSubject === null || windowSubject === void 0 ? void 0 : windowSubject.unsubscribe();
                        windowSubject = null;
                    };
                });
            }

            function windowCount(windowSize, startWindowEvery = 0) {
                const startEvery = startWindowEvery > 0 ? startWindowEvery : windowSize;
                return operate((source, subscriber) => {
                    let windows = [new Subject()];
                    let starts = [];
                    let count = 0;
                    subscriber.next(windows[0].asObservable());
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        for (const window of windows) {
                            window.next(value);
                        }
                        const c = count - windowSize + 1;
                        if (c >= 0 && c % startEvery === 0) {
                            windows.shift().complete();
                        }
                        if (++count % startEvery === 0) {
                            const window = new Subject();
                            windows.push(window);
                            subscriber.next(window.asObservable());
                        }
                    }, () => {
                        while (windows.length > 0) {
                            windows.shift().complete();
                        }
                        subscriber.complete();
                    }, (err) => {
                        while (windows.length > 0) {
                            windows.shift().error(err);
                        }
                        subscriber.error(err);
                    }, () => {
                        starts = null;
                        windows = null;
                    }));
                });
            }

            function windowTime(windowTimeSpan, ...otherArgs) {
                var _a, _b;
                const scheduler = (_a = popScheduler(otherArgs)) !== null && _a !== void 0 ? _a : asyncScheduler;
                const windowCreationInterval = (_b = otherArgs[0]) !== null && _b !== void 0 ? _b : null;
                const maxWindowSize = otherArgs[1] || Infinity;
                return operate((source, subscriber) => {
                    let windowRecords = [];
                    let restartOnClose = false;
                    const closeWindow = (record) => {
                        const { window, subs } = record;
                        window.complete();
                        subs.unsubscribe();
                        arrRemove(windowRecords, record);
                        restartOnClose && startWindow();
                    };
                    const startWindow = () => {
                        if (windowRecords) {
                            const subs = new Subscription();
                            subscriber.add(subs);
                            const window = new Subject();
                            const record = {
                                window,
                                subs,
                                seen: 0,
                            };
                            windowRecords.push(record);
                            subscriber.next(window.asObservable());
                            executeSchedule(subs, scheduler, () => closeWindow(record), windowTimeSpan);
                        }
                    };
                    if (windowCreationInterval !== null && windowCreationInterval >= 0) {
                        executeSchedule(subscriber, scheduler, startWindow, windowCreationInterval, true);
                    }
                    else {
                        restartOnClose = true;
                    }
                    startWindow();
                    const loop = (cb) => windowRecords.slice().forEach(cb);
                    const terminate = (cb) => {
                        loop(({ window }) => cb(window));
                        cb(subscriber);
                        subscriber.unsubscribe();
                    };
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        loop((record) => {
                            record.window.next(value);
                            maxWindowSize <= ++record.seen && closeWindow(record);
                        });
                    }, () => terminate((consumer) => consumer.complete()), (err) => terminate((consumer) => consumer.error(err))));
                    return () => {
                        windowRecords = null;
                    };
                });
            }

            function windowToggle(openings, closingSelector) {
                return operate((source, subscriber) => {
                    const windows = [];
                    const handleError = (err) => {
                        while (0 < windows.length) {
                            windows.shift().error(err);
                        }
                        subscriber.error(err);
                    };
                    innerFrom(openings).subscribe(new OperatorSubscriber(subscriber, (openValue) => {
                        const window = new Subject();
                        windows.push(window);
                        const closingSubscription = new Subscription();
                        const closeWindow = () => {
                            arrRemove(windows, window);
                            window.complete();
                            closingSubscription.unsubscribe();
                        };
                        let closingNotifier;
                        try {
                            closingNotifier = innerFrom(closingSelector(openValue));
                        }
                        catch (err) {
                            handleError(err);
                            return;
                        }
                        subscriber.next(window.asObservable());
                        closingSubscription.add(closingNotifier.subscribe(new OperatorSubscriber(subscriber, closeWindow, noop, handleError)));
                    }, noop));
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        const windowsCopy = windows.slice();
                        for (const window of windowsCopy) {
                            window.next(value);
                        }
                    }, () => {
                        while (0 < windows.length) {
                            windows.shift().complete();
                        }
                        subscriber.complete();
                    }, handleError, () => {
                        while (0 < windows.length) {
                            windows.shift().unsubscribe();
                        }
                    }));
                });
            }

            function windowWhen(closingSelector) {
                return operate((source, subscriber) => {
                    let window;
                    let closingSubscriber;
                    const handleError = (err) => {
                        window.error(err);
                        subscriber.error(err);
                    };
                    const openWindow = () => {
                        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                        window === null || window === void 0 ? void 0 : window.complete();
                        window = new Subject();
                        subscriber.next(window.asObservable());
                        let closingNotifier;
                        try {
                            closingNotifier = innerFrom(closingSelector());
                        }
                        catch (err) {
                            handleError(err);
                            return;
                        }
                        closingNotifier.subscribe((closingSubscriber = new OperatorSubscriber(subscriber, openWindow, openWindow, handleError)));
                    };
                    openWindow();
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => window.next(value), () => {
                        window.complete();
                        subscriber.complete();
                    }, handleError, () => {
                        closingSubscriber === null || closingSubscriber === void 0 ? void 0 : closingSubscriber.unsubscribe();
                        window = null;
                    }));
                });
            }

            function withLatestFrom(...inputs) {
                const project = popResultSelector(inputs);
                return operate((source, subscriber) => {
                    const len = inputs.length;
                    const otherValues = new Array(len);
                    let hasValue = inputs.map(() => false);
                    let ready = false;
                    for (let i = 0; i < len; i++) {
                        innerFrom(inputs[i]).subscribe(new OperatorSubscriber(subscriber, (value) => {
                            otherValues[i] = value;
                            if (!ready && !hasValue[i]) {
                                hasValue[i] = true;
                                (ready = hasValue.every(identity)) && (hasValue = null);
                            }
                        }, noop));
                    }
                    source.subscribe(new OperatorSubscriber(subscriber, (value) => {
                        if (ready) {
                            const values = [value, ...otherValues];
                            subscriber.next(project ? project(...values) : values);
                        }
                    }));
                });
            }

            function zipAll(project) {
                return joinAllInternals(zip$1, project);
            }

            function zip(...sources) {
                return operate((source, subscriber) => {
                    zip$1(source, ...sources).subscribe(subscriber);
                });
            }

            function zipWith(...otherInputs) {
                return zip(...otherInputs);
            }

            function partition(predicate, thisArg) {
                return (source) => [filter(predicate, thisArg)(source), filter(not(predicate, thisArg))(source)];
            }

            function race(...args) {
                return raceWith(...argsOrArgArray(args));
            }

            function getXHRResponse(xhr) {
                switch (xhr.responseType) {
                    case 'json': {
                        if ('response' in xhr) {
                            return xhr.response;
                        }
                        else {
                            const ieXHR = xhr;
                            return JSON.parse(ieXHR.responseText);
                        }
                    }
                    case 'document':
                        return xhr.responseXML;
                    case 'text':
                    default: {
                        if ('response' in xhr) {
                            return xhr.response;
                        }
                        else {
                            const ieXHR = xhr;
                            return ieXHR.responseText;
                        }
                    }
                }
            }

            class AjaxResponse {
                constructor(originalEvent, xhr, request, type = 'download_load') {
                    this.originalEvent = originalEvent;
                    this.xhr = xhr;
                    this.request = request;
                    this.type = type;
                    const { status, responseType } = xhr;
                    this.status = status !== null && status !== void 0 ? status : 0;
                    this.responseType = responseType !== null && responseType !== void 0 ? responseType : '';
                    const allHeaders = xhr.getAllResponseHeaders();
                    this.responseHeaders = allHeaders
                        ?
                            allHeaders.split('\n').reduce((headers, line) => {
                                const index = line.indexOf(': ');
                                headers[line.slice(0, index)] = line.slice(index + 2);
                                return headers;
                            }, {})
                        : {};
                    this.response = getXHRResponse(xhr);
                    const { loaded, total } = originalEvent;
                    this.loaded = loaded;
                    this.total = total;
                }
            } exports('cb', AjaxResponse);

            const AjaxError = exports('c9', createErrorClass((_super) => function AjaxErrorImpl(message, xhr, request) {
                this.message = message;
                this.name = 'AjaxError';
                this.xhr = xhr;
                this.request = request;
                this.status = xhr.status;
                this.responseType = xhr.responseType;
                let response;
                try {
                    response = getXHRResponse(xhr);
                }
                catch (err) {
                    response = xhr.responseText;
                }
                this.response = response;
            }));
            const AjaxTimeoutError = exports('ca', (() => {
                function AjaxTimeoutErrorImpl(xhr, request) {
                    AjaxError.call(this, 'ajax timeout', xhr, request);
                    this.name = 'AjaxTimeoutError';
                    return this;
                }
                AjaxTimeoutErrorImpl.prototype = Object.create(AjaxError.prototype);
                return AjaxTimeoutErrorImpl;
            })());

            function ajaxGet(url, headers) {
                return ajax({ method: 'GET', url, headers });
            }
            function ajaxPost(url, body, headers) {
                return ajax({ method: 'POST', url, body, headers });
            }
            function ajaxDelete(url, headers) {
                return ajax({ method: 'DELETE', url, headers });
            }
            function ajaxPut(url, body, headers) {
                return ajax({ method: 'PUT', url, body, headers });
            }
            function ajaxPatch(url, body, headers) {
                return ajax({ method: 'PATCH', url, body, headers });
            }
            const mapResponse = map((x) => x.response);
            function ajaxGetJSON(url, headers) {
                return mapResponse(ajax({
                    method: 'GET',
                    url,
                    headers,
                }));
            }
            const ajax = exports('c8', (() => {
                const create = (urlOrConfig) => {
                    const config = typeof urlOrConfig === 'string'
                        ? {
                            url: urlOrConfig,
                        }
                        : urlOrConfig;
                    return fromAjax(config);
                };
                create.get = ajaxGet;
                create.post = ajaxPost;
                create.delete = ajaxDelete;
                create.put = ajaxPut;
                create.patch = ajaxPatch;
                create.getJSON = ajaxGetJSON;
                return create;
            })());
            const UPLOAD = 'upload';
            const DOWNLOAD = 'download';
            const LOADSTART = 'loadstart';
            const PROGRESS = 'progress';
            const LOAD = 'load';
            function fromAjax(init) {
                return new Observable((destination) => {
                    var _a, _b;
                    const config = Object.assign({ async: true, crossDomain: false, withCredentials: false, method: 'GET', timeout: 0, responseType: 'json' }, init);
                    const { queryParams, body: configuredBody, headers: configuredHeaders } = config;
                    let url = config.url;
                    if (!url) {
                        throw new TypeError('url is required');
                    }
                    if (queryParams) {
                        let searchParams;
                        if (url.includes('?')) {
                            const parts = url.split('?');
                            if (2 < parts.length) {
                                throw new TypeError('invalid url');
                            }
                            searchParams = new URLSearchParams(parts[1]);
                            new URLSearchParams(queryParams).forEach((value, key) => searchParams.set(key, value));
                            url = parts[0] + '?' + searchParams;
                        }
                        else {
                            searchParams = new URLSearchParams(queryParams);
                            url = url + '?' + searchParams;
                        }
                    }
                    const headers = {};
                    if (configuredHeaders) {
                        for (const key in configuredHeaders) {
                            if (configuredHeaders.hasOwnProperty(key)) {
                                headers[key.toLowerCase()] = configuredHeaders[key];
                            }
                        }
                    }
                    const crossDomain = config.crossDomain;
                    if (!crossDomain && !('x-requested-with' in headers)) {
                        headers['x-requested-with'] = 'XMLHttpRequest';
                    }
                    const { withCredentials, xsrfCookieName, xsrfHeaderName } = config;
                    if ((withCredentials || !crossDomain) && xsrfCookieName && xsrfHeaderName) {
                        const xsrfCookie = (_b = (_a = document === null || document === void 0 ? void 0 : document.cookie.match(new RegExp(`(^|;\\s*)(${xsrfCookieName})=([^;]*)`))) === null || _a === void 0 ? void 0 : _a.pop()) !== null && _b !== void 0 ? _b : '';
                        if (xsrfCookie) {
                            headers[xsrfHeaderName] = xsrfCookie;
                        }
                    }
                    const body = extractContentTypeAndMaybeSerializeBody(configuredBody, headers);
                    const _request = Object.assign(Object.assign({}, config), { url,
                        headers,
                        body });
                    let xhr;
                    xhr = init.createXHR ? init.createXHR() : new XMLHttpRequest();
                    {
                        const { progressSubscriber, includeDownloadProgress = false, includeUploadProgress = false } = init;
                        const addErrorEvent = (type, errorFactory) => {
                            xhr.addEventListener(type, () => {
                                var _a;
                                const error = errorFactory();
                                (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.error) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber, error);
                                destination.error(error);
                            });
                        };
                        addErrorEvent('timeout', () => new AjaxTimeoutError(xhr, _request));
                        addErrorEvent('abort', () => new AjaxError('aborted', xhr, _request));
                        const createResponse = (direction, event) => new AjaxResponse(event, xhr, _request, `${direction}_${event.type}`);
                        const addProgressEvent = (target, type, direction) => {
                            target.addEventListener(type, (event) => {
                                destination.next(createResponse(direction, event));
                            });
                        };
                        if (includeUploadProgress) {
                            [LOADSTART, PROGRESS, LOAD].forEach((type) => addProgressEvent(xhr.upload, type, UPLOAD));
                        }
                        if (progressSubscriber) {
                            [LOADSTART, PROGRESS].forEach((type) => xhr.upload.addEventListener(type, (e) => { var _a; return (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.next) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber, e); }));
                        }
                        if (includeDownloadProgress) {
                            [LOADSTART, PROGRESS].forEach((type) => addProgressEvent(xhr, type, DOWNLOAD));
                        }
                        const emitError = (status) => {
                            const msg = 'ajax error' + (status ? ' ' + status : '');
                            destination.error(new AjaxError(msg, xhr, _request));
                        };
                        xhr.addEventListener('error', (e) => {
                            var _a;
                            (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.error) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber, e);
                            emitError();
                        });
                        xhr.addEventListener(LOAD, (event) => {
                            var _a, _b;
                            const { status } = xhr;
                            if (status < 400) {
                                (_a = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.complete) === null || _a === void 0 ? void 0 : _a.call(progressSubscriber);
                                let response;
                                try {
                                    response = createResponse(DOWNLOAD, event);
                                }
                                catch (err) {
                                    destination.error(err);
                                    return;
                                }
                                destination.next(response);
                                destination.complete();
                            }
                            else {
                                (_b = progressSubscriber === null || progressSubscriber === void 0 ? void 0 : progressSubscriber.error) === null || _b === void 0 ? void 0 : _b.call(progressSubscriber, event);
                                emitError(status);
                            }
                        });
                    }
                    const { user, method, async } = _request;
                    if (user) {
                        xhr.open(method, url, async, user, _request.password);
                    }
                    else {
                        xhr.open(method, url, async);
                    }
                    if (async) {
                        xhr.timeout = _request.timeout;
                        xhr.responseType = _request.responseType;
                    }
                    if ('withCredentials' in xhr) {
                        xhr.withCredentials = _request.withCredentials;
                    }
                    for (const key in headers) {
                        if (headers.hasOwnProperty(key)) {
                            xhr.setRequestHeader(key, headers[key]);
                        }
                    }
                    if (body) {
                        xhr.send(body);
                    }
                    else {
                        xhr.send();
                    }
                    return () => {
                        if (xhr && xhr.readyState !== 4) {
                            xhr.abort();
                        }
                    };
                });
            }
            function extractContentTypeAndMaybeSerializeBody(body, headers) {
                var _a;
                if (!body ||
                    typeof body === 'string' ||
                    isFormData(body) ||
                    isURLSearchParams(body) ||
                    isArrayBuffer(body) ||
                    isFile(body) ||
                    isBlob(body) ||
                    isReadableStream(body)) {
                    return body;
                }
                if (isArrayBufferView(body)) {
                    return body.buffer;
                }
                if (typeof body === 'object') {
                    headers['content-type'] = (_a = headers['content-type']) !== null && _a !== void 0 ? _a : 'application/json;charset=utf-8';
                    return JSON.stringify(body);
                }
                throw new TypeError('Unknown body type');
            }
            const _toString = Object.prototype.toString;
            function toStringCheck(obj, name) {
                return _toString.call(obj) === `[object ${name}]`;
            }
            function isArrayBuffer(body) {
                return toStringCheck(body, 'ArrayBuffer');
            }
            function isFile(body) {
                return toStringCheck(body, 'File');
            }
            function isBlob(body) {
                return toStringCheck(body, 'Blob');
            }
            function isArrayBufferView(body) {
                return typeof ArrayBuffer !== 'undefined' && ArrayBuffer.isView(body);
            }
            function isFormData(body) {
                return typeof FormData !== 'undefined' && body instanceof FormData;
            }
            function isURLSearchParams(body) {
                return typeof URLSearchParams !== 'undefined' && body instanceof URLSearchParams;
            }
            function isReadableStream(body) {
                return typeof ReadableStream !== 'undefined' && body instanceof ReadableStream;
            }

            function fromFetch(input, initWithSelector = {}) {
                const { selector } = initWithSelector, init = __rest(initWithSelector, ["selector"]);
                return new Observable((subscriber) => {
                    const controller = new AbortController();
                    const { signal } = controller;
                    let abortable = true;
                    const { signal: outerSignal } = init;
                    if (outerSignal) {
                        if (outerSignal.aborted) {
                            controller.abort();
                        }
                        else {
                            const outerSignalHandler = () => {
                                if (!signal.aborted) {
                                    controller.abort();
                                }
                            };
                            outerSignal.addEventListener('abort', outerSignalHandler);
                            subscriber.add(() => outerSignal.removeEventListener('abort', outerSignalHandler));
                        }
                    }
                    const perSubscriberInit = Object.assign(Object.assign({}, init), { signal });
                    const handleError = (err) => {
                        abortable = false;
                        subscriber.error(err);
                    };
                    fetch(input, perSubscriberInit)
                        .then((response) => {
                        if (selector) {
                            innerFrom(selector(response)).subscribe(new OperatorSubscriber(subscriber, undefined, () => {
                                abortable = false;
                                subscriber.complete();
                            }, handleError));
                        }
                        else {
                            abortable = false;
                            subscriber.next(response);
                            subscriber.complete();
                        }
                    })
                        .catch(handleError);
                    return () => {
                        if (abortable) {
                            controller.abort();
                        }
                    };
                });
            }

            const DEFAULT_WEBSOCKET_CONFIG = {
                url: '',
                deserializer: (e) => JSON.parse(e.data),
                serializer: (value) => JSON.stringify(value),
            };
            const WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT = 'WebSocketSubject.error must be called with an object with an error code, and an optional reason: { code: number, reason: string }';
            class WebSocketSubject extends AnonymousSubject {
                constructor(urlConfigOrSource, destination) {
                    super();
                    this._socket = null;
                    if (urlConfigOrSource instanceof Observable) {
                        this.destination = destination;
                        this.source = urlConfigOrSource;
                    }
                    else {
                        const config = (this._config = Object.assign({}, DEFAULT_WEBSOCKET_CONFIG));
                        this._output = new Subject();
                        if (typeof urlConfigOrSource === 'string') {
                            config.url = urlConfigOrSource;
                        }
                        else {
                            for (const key in urlConfigOrSource) {
                                if (urlConfigOrSource.hasOwnProperty(key)) {
                                    config[key] = urlConfigOrSource[key];
                                }
                            }
                        }
                        if (!config.WebSocketCtor && WebSocket) {
                            config.WebSocketCtor = WebSocket;
                        }
                        else if (!config.WebSocketCtor) {
                            throw new Error('no WebSocket constructor can be found');
                        }
                        this.destination = new ReplaySubject();
                    }
                }
                lift(operator) {
                    const sock = new WebSocketSubject(this._config, this.destination);
                    sock.operator = operator;
                    sock.source = this;
                    return sock;
                }
                _resetState() {
                    this._socket = null;
                    if (!this.source) {
                        this.destination = new ReplaySubject();
                    }
                    this._output = new Subject();
                }
                multiplex(subMsg, unsubMsg, messageFilter) {
                    const self = this;
                    return new Observable((observer) => {
                        try {
                            self.next(subMsg());
                        }
                        catch (err) {
                            observer.error(err);
                        }
                        const subscription = self.subscribe((x) => {
                            try {
                                if (messageFilter(x)) {
                                    observer.next(x);
                                }
                            }
                            catch (err) {
                                observer.error(err);
                            }
                        }, (err) => observer.error(err), () => observer.complete());
                        return () => {
                            try {
                                self.next(unsubMsg());
                            }
                            catch (err) {
                                observer.error(err);
                            }
                            subscription.unsubscribe();
                        };
                    });
                }
                _connectSocket() {
                    const { WebSocketCtor, protocol, url, binaryType } = this._config;
                    const observer = this._output;
                    let socket = null;
                    try {
                        socket = protocol ? new WebSocketCtor(url, protocol) : new WebSocketCtor(url);
                        this._socket = socket;
                        if (binaryType) {
                            this._socket.binaryType = binaryType;
                        }
                    }
                    catch (e) {
                        observer.error(e);
                        return;
                    }
                    const subscription = new Subscription(() => {
                        this._socket = null;
                        if (socket && socket.readyState === 1) {
                            socket.close();
                        }
                    });
                    socket.onopen = (evt) => {
                        const { _socket } = this;
                        if (!_socket) {
                            socket.close();
                            this._resetState();
                            return;
                        }
                        const { openObserver } = this._config;
                        if (openObserver) {
                            openObserver.next(evt);
                        }
                        const queue = this.destination;
                        this.destination = Subscriber.create((x) => {
                            if (socket.readyState === 1) {
                                try {
                                    const { serializer } = this._config;
                                    socket.send(serializer(x));
                                }
                                catch (e) {
                                    this.destination.error(e);
                                }
                            }
                        }, (err) => {
                            const { closingObserver } = this._config;
                            if (closingObserver) {
                                closingObserver.next(undefined);
                            }
                            if (err && err.code) {
                                socket.close(err.code, err.reason);
                            }
                            else {
                                observer.error(new TypeError(WEBSOCKETSUBJECT_INVALID_ERROR_OBJECT));
                            }
                            this._resetState();
                        }, () => {
                            const { closingObserver } = this._config;
                            if (closingObserver) {
                                closingObserver.next(undefined);
                            }
                            socket.close();
                            this._resetState();
                        });
                        if (queue && queue instanceof ReplaySubject) {
                            subscription.add(queue.subscribe(this.destination));
                        }
                    };
                    socket.onerror = (e) => {
                        this._resetState();
                        observer.error(e);
                    };
                    socket.onclose = (e) => {
                        if (socket === this._socket) {
                            this._resetState();
                        }
                        const { closeObserver } = this._config;
                        if (closeObserver) {
                            closeObserver.next(e);
                        }
                        if (e.wasClean) {
                            observer.complete();
                        }
                        else {
                            observer.error(e);
                        }
                    };
                    socket.onmessage = (e) => {
                        try {
                            const { deserializer } = this._config;
                            observer.next(deserializer(e));
                        }
                        catch (err) {
                            observer.error(err);
                        }
                    };
                }
                _subscribe(subscriber) {
                    const { source } = this;
                    if (source) {
                        return source.subscribe(subscriber);
                    }
                    if (!this._socket) {
                        this._connectSocket();
                    }
                    this._output.subscribe(subscriber);
                    subscriber.add(() => {
                        const { _socket } = this;
                        if (this._output.observers.length === 0) {
                            if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                                _socket.close();
                            }
                            this._resetState();
                        }
                    });
                    return subscriber;
                }
                unsubscribe() {
                    const { _socket } = this;
                    if (_socket && (_socket.readyState === 1 || _socket.readyState === 0)) {
                        _socket.close();
                    }
                    this._resetState();
                    super.unsubscribe();
                }
            } exports('ce', WebSocketSubject);

            function webSocket(urlConfigOrSource) {
                return new WebSocketSubject(urlConfigOrSource);
            }

            function applyMixins(derivedCtor, baseCtors) {
                for (let i = 0, len = baseCtors.length; i < len; i++) {
                    const baseCtor = baseCtors[i];
                    const propertyKeys = Object.getOwnPropertyNames(baseCtor.prototype);
                    for (let j = 0, len2 = propertyKeys.length; j < len2; j++) {
                        const name = propertyKeys[j];
                        derivedCtor.prototype[name] = baseCtor.prototype[name];
                    }
                }
            }

        })
    };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy1zaGFyZWQuanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNGdW5jdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvY3JlYXRlRXJyb3JDbGFzcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvYXJyUmVtb3ZlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvU3Vic2NyaXB0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvY29uZmlnLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvcmVwb3J0VW5oYW5kbGVkRXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL25vb3AuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9Ob3RpZmljYXRpb25GYWN0b3JpZXMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2Vycm9yQ29udGV4dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL1N1YnNjcmliZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaWRlbnRpdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL3BpcGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9PYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9saWZ0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9yZWZDb3VudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL3BlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvYW5pbWF0aW9uRnJhbWVQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvZG9tL2FuaW1hdGlvbkZyYW1lcy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9TdWJqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvQmVoYXZpb3JTdWJqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL2RhdGVUaW1lc3RhbXBQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL1JlcGxheVN1YmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9Bc3luY1N1YmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvQWN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL2ludGVydmFsUHJvdmlkZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvQXN5bmNBY3Rpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL0ltbWVkaWF0ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9pbW1lZGlhdGVQcm92aWRlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9Bc2FwQWN0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvU2NoZWR1bGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL0FzeW5jU2NoZWR1bGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVyL0FzYXBTY2hlZHVsZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZXIvYXNhcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9hc3luYy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9RdWV1ZUFjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9RdWV1ZVNjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9xdWV1ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZUFjdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZVNjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlci9WaXJ0dWFsVGltZVNjaGVkdWxlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvZW1wdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2lzU2NoZWR1bGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9hcmdzLmpzIiwiLi4vLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNBcnJheUxpa2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2lzUHJvbWlzZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNJbnRlcm9wT2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvaXNBc3luY0l0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC90aHJvd1Vub2JzZXJ2YWJsZUVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc3ltYm9sL2l0ZXJhdG9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc0l0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc1JlYWRhYmxlU3RyZWFtTGlrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvaW5uZXJGcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9leGVjdXRlU2NoZWR1bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvb2JzZXJ2ZU9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N1YnNjcmliZU9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlT2JzZXJ2YWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZVByb21pc2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9zY2hlZHVsZWQvc2NoZWR1bGVBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZUl0ZXJhYmxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvc2NoZWR1bGVkL3NjaGVkdWxlQXN5bmNJdGVyYWJsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZVJlYWRhYmxlU3RyZWFtTGlrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3NjaGVkdWxlZC9zY2hlZHVsZWQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb20uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL29mLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS90aHJvd0Vycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvTm90aWZpY2F0aW9uLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc09ic2VydmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL0VtcHR5RXJyb3IuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9sYXN0VmFsdWVGcm9tLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvZmlyc3RWYWx1ZUZyb20uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9Ob3RGb3VuZEVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9TZXF1ZW5jZUVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9pc0RhdGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGltZW91dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9tYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL21hcE9uZU9yTWFueUFyZ3MuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2JpbmRDYWxsYmFja0ludGVybmFscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvYmluZENhbGxiYWNrLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9iaW5kTm9kZUNhbGxiYWNrLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9hcmdzQXJnQXJyYXlPck9iamVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL3V0aWwvY3JlYXRlT2JqZWN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb21iaW5lTGF0ZXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlSW50ZXJuYWxzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlTWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlQWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2NvbmNhdEFsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvY29uY2F0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9kZWZlci5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvY29ubmVjdGFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2ZvcmtKb2luLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9mcm9tRXZlbnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21FdmVudFBhdHRlcm4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2dlbmVyYXRlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9paWYuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3RpbWVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9pbnRlcnZhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvbWVyZ2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL25ldmVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9hcmdzT3JBcmdBcnJheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9vbkVycm9yUmVzdW1lTmV4dC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvb25FcnJvclJlc3VtZU5leHQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3BhaXJzLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvdXRpbC9ub3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZmlsdGVyLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS9wYXJ0aXRpb24uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhY2UuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhbmdlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb2JzZXJ2YWJsZS91c2luZy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvemlwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2F1ZGl0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2F1ZGl0VGltZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXIuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyQ291bnQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyVGltZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXJUb2dnbGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyV2hlbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jYXRjaEVycm9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3NjYW5JbnRlcm5hbHMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmVkdWNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3RvQXJyYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvam9pbkFsbEludGVybmFscy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb21iaW5lTGF0ZXN0QWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2NvbWJpbmVBbGwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29tYmluZUxhdGVzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb21iaW5lTGF0ZXN0V2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb25jYXRNYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29uY2F0TWFwVG8uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29uY2F0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2NvbmNhdFdpdGguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21TdWJzY3JpYmFibGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvY29ubmVjdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9jb3VudC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kZWJvdW5jZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kZWJvdW5jZVRpbWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZGVmYXVsdElmRW1wdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9pZ25vcmVFbGVtZW50cy5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9tYXBUby5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kZWxheVdoZW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZGVsYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZGVtYXRlcmlhbGl6ZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdFVudGlsQ2hhbmdlZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdFVudGlsS2V5Q2hhbmdlZC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90aHJvd0lmRW1wdHkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZWxlbWVudEF0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2VuZFdpdGguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZXZlcnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZXhoYXVzdEFsbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9leGhhdXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2V4aGF1c3RNYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZXhwYW5kLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2ZpbmFsaXplLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2ZpbmQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvZmluZEluZGV4LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2ZpcnN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL2dyb3VwQnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvaXNFbXB0eS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90YWtlTGFzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9sYXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21hdGVyaWFsaXplLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21heC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9mbGF0TWFwLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlTWFwVG8uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvbWVyZ2VTY2FuLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlV2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9taW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvbXVsdGljYXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3BhaXJ3aXNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3BsdWNrLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3B1Ymxpc2guanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcHVibGlzaEJlaGF2aW9yLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3B1Ymxpc2hMYXN0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3B1Ymxpc2hSZXBsYXkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmFjZVdpdGguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmVwZWF0LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3JlcGVhdFdoZW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmV0cnkuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvcmV0cnlXaGVuLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3NhbXBsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zYW1wbGVUaW1lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3NjYW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc2VxdWVuY2VFcXVhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zaGFyZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zaGFyZVJlcGxheS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zaW5nbGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc2tpcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9za2lwTGFzdC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9za2lwVW50aWwuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc2tpcFdoaWxlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N0YXJ0V2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9zd2l0Y2hNYXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvc3dpdGNoQWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N3aXRjaE1hcFRvLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3N3aXRjaFNjYW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZVVudGlsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3Rha2VXaGlsZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90YXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGhyb3R0bGUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvdGhyb3R0bGVUaW1lLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3RpbWVJbnRlcnZhbC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90aW1lb3V0V2l0aC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy90aW1lc3RhbXAuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvd2luZG93LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd0NvdW50LmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd1RpbWUuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvd2luZG93VG9nZ2xlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd1doZW4uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvd2l0aExhdGVzdEZyb20uanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vcGVyYXRvcnMvemlwQWxsLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3ppcC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy96aXBXaXRoLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvb3BlcmF0b3JzL3BhcnRpdGlvbi5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29wZXJhdG9ycy9yYWNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvYWpheC9nZXRYSFJSZXNwb25zZS5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL2FqYXgvQWpheFJlc3BvbnNlLmpzIiwiLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3J4anMvZGlzdC9lc20vaW50ZXJuYWwvYWpheC9lcnJvcnMuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9hamF4L2FqYXguanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS9mZXRjaC5qcyIsIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9yeGpzL2Rpc3QvZXNtL2ludGVybmFsL29ic2VydmFibGUvZG9tL1dlYlNvY2tldFN1YmplY3QuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS93ZWJTb2NrZXQuanMiLCIuLi8uLi8uLi9ub2RlX21vZHVsZXMvcnhqcy9kaXN0L2VzbS9pbnRlcm5hbC91dGlsL2FwcGx5TWl4aW5zLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWlzRnVuY3Rpb24uanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUVycm9yQ2xhc3MoY3JlYXRlSW1wbCkge1xuICAgIGNvbnN0IF9zdXBlciA9IChpbnN0YW5jZSkgPT4ge1xuICAgICAgICBFcnJvci5jYWxsKGluc3RhbmNlKTtcbiAgICAgICAgaW5zdGFuY2Uuc3RhY2sgPSBuZXcgRXJyb3IoKS5zdGFjaztcbiAgICB9O1xuICAgIGNvbnN0IGN0b3JGdW5jID0gY3JlYXRlSW1wbChfc3VwZXIpO1xuICAgIGN0b3JGdW5jLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoRXJyb3IucHJvdG90eXBlKTtcbiAgICBjdG9yRnVuYy5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBjdG9yRnVuYztcbiAgICByZXR1cm4gY3RvckZ1bmM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jcmVhdGVFcnJvckNsYXNzLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IFVuc3Vic2NyaXB0aW9uRXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKChfc3VwZXIpID0+IGZ1bmN0aW9uIFVuc3Vic2NyaXB0aW9uRXJyb3JJbXBsKGVycm9ycykge1xuICAgIF9zdXBlcih0aGlzKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBlcnJvcnNcbiAgICAgICAgPyBgJHtlcnJvcnMubGVuZ3RofSBlcnJvcnMgb2NjdXJyZWQgZHVyaW5nIHVuc3Vic2NyaXB0aW9uOlxuJHtlcnJvcnMubWFwKChlcnIsIGkpID0+IGAke2kgKyAxfSkgJHtlcnIudG9TdHJpbmcoKX1gKS5qb2luKCdcXG4gICcpfWBcbiAgICAgICAgOiAnJztcbiAgICB0aGlzLm5hbWUgPSAnVW5zdWJzY3JpcHRpb25FcnJvcic7XG4gICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVVuc3Vic2NyaXB0aW9uRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGFyclJlbW92ZShhcnIsIGl0ZW0pIHtcbiAgICBpZiAoYXJyKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gYXJyLmluZGV4T2YoaXRlbSk7XG4gICAgICAgIDAgPD0gaW5kZXggJiYgYXJyLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyUmVtb3ZlLmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBVbnN1YnNjcmlwdGlvbkVycm9yIH0gZnJvbSAnLi91dGlsL1Vuc3Vic2NyaXB0aW9uRXJyb3InO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi91dGlsL2FyclJlbW92ZSc7XG5leHBvcnQgY2xhc3MgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihpbml0aWFsVGVhcmRvd24pIHtcbiAgICAgICAgdGhpcy5pbml0aWFsVGVhcmRvd24gPSBpbml0aWFsVGVhcmRvd247XG4gICAgICAgIHRoaXMuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgIHRoaXMuX3RlYXJkb3ducyA9IG51bGw7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBsZXQgZXJyb3JzO1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgICAgICAgICBjb25zdCB7IF9wYXJlbnRhZ2UgfSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoX3BhcmVudGFnZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3BhcmVudGFnZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBwYXJlbnQgb2YgX3BhcmVudGFnZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFyZW50LnJlbW92ZSh0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3BhcmVudGFnZS5yZW1vdmUodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBpbml0aWFsVGVhcmRvd24gfSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoaXNGdW5jdGlvbihpbml0aWFsVGVhcmRvd24pKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgaW5pdGlhbFRlYXJkb3duKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVycm9ycyA9IGUgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yID8gZS5lcnJvcnMgOiBbZV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBfdGVhcmRvd25zIH0gPSB0aGlzO1xuICAgICAgICAgICAgaWYgKF90ZWFyZG93bnMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl90ZWFyZG93bnMgPSBudWxsO1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdGVhcmRvd24gb2YgX3RlYXJkb3ducykge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhlY1RlYXJkb3duKHRlYXJkb3duKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMgPSBlcnJvcnMgIT09IG51bGwgJiYgZXJyb3JzICE9PSB2b2lkIDAgPyBlcnJvcnMgOiBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlcnIgaW5zdGFuY2VvZiBVbnN1YnNjcmlwdGlvbkVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzID0gWy4uLmVycm9ycywgLi4uZXJyLmVycm9yc107XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGVycm9ycykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBVbnN1YnNjcmlwdGlvbkVycm9yKGVycm9ycyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYWRkKHRlYXJkb3duKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgaWYgKHRlYXJkb3duICYmIHRlYXJkb3duICE9PSB0aGlzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBleGVjVGVhcmRvd24odGVhcmRvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlYXJkb3duIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ZWFyZG93bi5jbG9zZWQgfHwgdGVhcmRvd24uX2hhc1BhcmVudCh0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRlYXJkb3duLl9hZGRQYXJlbnQodGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICh0aGlzLl90ZWFyZG93bnMgPSAoX2EgPSB0aGlzLl90ZWFyZG93bnMpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IFtdKS5wdXNoKHRlYXJkb3duKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfaGFzUGFyZW50KHBhcmVudCkge1xuICAgICAgICBjb25zdCB7IF9wYXJlbnRhZ2UgfSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBfcGFyZW50YWdlID09PSBwYXJlbnQgfHwgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkgJiYgX3BhcmVudGFnZS5pbmNsdWRlcyhwYXJlbnQpKTtcbiAgICB9XG4gICAgX2FkZFBhcmVudChwYXJlbnQpIHtcbiAgICAgICAgY29uc3QgeyBfcGFyZW50YWdlIH0gPSB0aGlzO1xuICAgICAgICB0aGlzLl9wYXJlbnRhZ2UgPSBBcnJheS5pc0FycmF5KF9wYXJlbnRhZ2UpID8gKF9wYXJlbnRhZ2UucHVzaChwYXJlbnQpLCBfcGFyZW50YWdlKSA6IF9wYXJlbnRhZ2UgPyBbX3BhcmVudGFnZSwgcGFyZW50XSA6IHBhcmVudDtcbiAgICB9XG4gICAgX3JlbW92ZVBhcmVudChwYXJlbnQpIHtcbiAgICAgICAgY29uc3QgeyBfcGFyZW50YWdlIH0gPSB0aGlzO1xuICAgICAgICBpZiAoX3BhcmVudGFnZSA9PT0gcGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9wYXJlbnRhZ2UgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoX3BhcmVudGFnZSkpIHtcbiAgICAgICAgICAgIGFyclJlbW92ZShfcGFyZW50YWdlLCBwYXJlbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZSh0ZWFyZG93bikge1xuICAgICAgICBjb25zdCB7IF90ZWFyZG93bnMgfSA9IHRoaXM7XG4gICAgICAgIF90ZWFyZG93bnMgJiYgYXJyUmVtb3ZlKF90ZWFyZG93bnMsIHRlYXJkb3duKTtcbiAgICAgICAgaWYgKHRlYXJkb3duIGluc3RhbmNlb2YgU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICB0ZWFyZG93bi5fcmVtb3ZlUGFyZW50KHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxufVxuU3Vic2NyaXB0aW9uLkVNUFRZID0gKCgpID0+IHtcbiAgICBjb25zdCBlbXB0eSA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBlbXB0eS5jbG9zZWQgPSB0cnVlO1xuICAgIHJldHVybiBlbXB0eTtcbn0pKCk7XG5leHBvcnQgY29uc3QgRU1QVFlfU1VCU0NSSVBUSU9OID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU3Vic2NyaXB0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIFN1YnNjcmlwdGlvbiB8fFxuICAgICAgICAodmFsdWUgJiYgJ2Nsb3NlZCcgaW4gdmFsdWUgJiYgaXNGdW5jdGlvbih2YWx1ZS5yZW1vdmUpICYmIGlzRnVuY3Rpb24odmFsdWUuYWRkKSAmJiBpc0Z1bmN0aW9uKHZhbHVlLnVuc3Vic2NyaWJlKSkpO1xufVxuZnVuY3Rpb24gZXhlY1RlYXJkb3duKHRlYXJkb3duKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odGVhcmRvd24pKSB7XG4gICAgICAgIHRlYXJkb3duKCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0ZWFyZG93bi51bnN1YnNjcmliZSgpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YnNjcmlwdGlvbi5qcy5tYXAiLCJleHBvcnQgY29uc3QgY29uZmlnID0ge1xuICAgIG9uVW5oYW5kbGVkRXJyb3I6IG51bGwsXG4gICAgb25TdG9wcGVkTm90aWZpY2F0aW9uOiBudWxsLFxuICAgIFByb21pc2U6IHVuZGVmaW5lZCxcbiAgICB1c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nOiBmYWxzZSxcbiAgICB1c2VEZXByZWNhdGVkTmV4dENvbnRleHQ6IGZhbHNlLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbmZpZy5qcy5tYXAiLCJleHBvcnQgY29uc3QgdGltZW91dFByb3ZpZGVyID0ge1xuICAgIHNldFRpbWVvdXQoLi4uYXJncykge1xuICAgICAgICBjb25zdCB7IGRlbGVnYXRlIH0gPSB0aW1lb3V0UHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5zZXRUaW1lb3V0KSB8fCBzZXRUaW1lb3V0KSguLi5hcmdzKTtcbiAgICB9LFxuICAgIGNsZWFyVGltZW91dChoYW5kbGUpIHtcbiAgICAgICAgY29uc3QgeyBkZWxlZ2F0ZSB9ID0gdGltZW91dFByb3ZpZGVyO1xuICAgICAgICByZXR1cm4gKChkZWxlZ2F0ZSA9PT0gbnVsbCB8fCBkZWxlZ2F0ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZGVsZWdhdGUuY2xlYXJUaW1lb3V0KSB8fCBjbGVhclRpbWVvdXQpKGhhbmRsZSk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVvdXRQcm92aWRlci5qcy5tYXAiLCJpbXBvcnQgeyBjb25maWcgfSBmcm9tICcuLi9jb25maWcnO1xuaW1wb3J0IHsgdGltZW91dFByb3ZpZGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlcic7XG5leHBvcnQgZnVuY3Rpb24gcmVwb3J0VW5oYW5kbGVkRXJyb3IoZXJyKSB7XG4gICAgdGltZW91dFByb3ZpZGVyLnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICBjb25zdCB7IG9uVW5oYW5kbGVkRXJyb3IgfSA9IGNvbmZpZztcbiAgICAgICAgaWYgKG9uVW5oYW5kbGVkRXJyb3IpIHtcbiAgICAgICAgICAgIG9uVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IGVycjtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVwb3J0VW5oYW5kbGVkRXJyb3IuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIG5vb3AoKSB7IH1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vb3AuanMubWFwIiwiZXhwb3J0IGNvbnN0IENPTVBMRVRFX05PVElGSUNBVElPTiA9ICgoKSA9PiBjcmVhdGVOb3RpZmljYXRpb24oJ0MnLCB1bmRlZmluZWQsIHVuZGVmaW5lZCkpKCk7XG5leHBvcnQgZnVuY3Rpb24gZXJyb3JOb3RpZmljYXRpb24oZXJyb3IpIHtcbiAgICByZXR1cm4gY3JlYXRlTm90aWZpY2F0aW9uKCdFJywgdW5kZWZpbmVkLCBlcnJvcik7XG59XG5leHBvcnQgZnVuY3Rpb24gbmV4dE5vdGlmaWNhdGlvbih2YWx1ZSkge1xuICAgIHJldHVybiBjcmVhdGVOb3RpZmljYXRpb24oJ04nLCB2YWx1ZSwgdW5kZWZpbmVkKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVOb3RpZmljYXRpb24oa2luZCwgdmFsdWUsIGVycm9yKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAga2luZCxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGVycm9yLFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Ob3RpZmljYXRpb25GYWN0b3JpZXMuanMubWFwIiwiaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi4vY29uZmlnJztcbmxldCBjb250ZXh0ID0gbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBlcnJvckNvbnRleHQoY2IpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgY29uc3QgaXNSb290ID0gIWNvbnRleHQ7XG4gICAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSB7IGVycm9yVGhyb3duOiBmYWxzZSwgZXJyb3I6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBjYigpO1xuICAgICAgICBpZiAoaXNSb290KSB7XG4gICAgICAgICAgICBjb25zdCB7IGVycm9yVGhyb3duLCBlcnJvciB9ID0gY29udGV4dDtcbiAgICAgICAgICAgIGNvbnRleHQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGVycm9yVGhyb3duKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNiKCk7XG4gICAgfVxufVxuZXhwb3J0IGZ1bmN0aW9uIGNhcHR1cmVFcnJvcihlcnIpIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcgJiYgY29udGV4dCkge1xuICAgICAgICBjb250ZXh0LmVycm9yVGhyb3duID0gdHJ1ZTtcbiAgICAgICAgY29udGV4dC5lcnJvciA9IGVycjtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvckNvbnRleHQuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGlzU3Vic2NyaXB0aW9uLCBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyByZXBvcnRVbmhhbmRsZWRFcnJvciB9IGZyb20gJy4vdXRpbC9yZXBvcnRVbmhhbmRsZWRFcnJvcic7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgbmV4dE5vdGlmaWNhdGlvbiwgZXJyb3JOb3RpZmljYXRpb24sIENPTVBMRVRFX05PVElGSUNBVElPTiB9IGZyb20gJy4vTm90aWZpY2F0aW9uRmFjdG9yaWVzJztcbmltcG9ydCB7IHRpbWVvdXRQcm92aWRlciB9IGZyb20gJy4vc2NoZWR1bGVyL3RpbWVvdXRQcm92aWRlcic7XG5pbXBvcnQgeyBjYXB0dXJlRXJyb3IgfSBmcm9tICcuL3V0aWwvZXJyb3JDb250ZXh0JztcbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVyIGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IGZhbHNlO1xuICAgICAgICBpZiAoZGVzdGluYXRpb24pIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIGlmIChpc1N1YnNjcmlwdGlvbihkZXN0aW5hdGlvbikpIHtcbiAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5hZGQodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uID0gRU1QVFlfT0JTRVJWRVI7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZShuZXh0LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBTYWZlU3Vic2NyaWJlcihuZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgaGFuZGxlU3RvcHBlZE5vdGlmaWNhdGlvbihuZXh0Tm90aWZpY2F0aW9uKHZhbHVlKSwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9uZXh0KHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlcnJvcihlcnIpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBoYW5kbGVTdG9wcGVkTm90aWZpY2F0aW9uKGVycm9yTm90aWZpY2F0aW9uKGVyciksIHRoaXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICBoYW5kbGVTdG9wcGVkTm90aWZpY2F0aW9uKENPTVBMRVRFX05PVElGSUNBVElPTiwgdGhpcyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBpZiAoIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICBzdXBlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX25leHQodmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9XG4gICAgX2Vycm9yKGVycikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9jb21wbGV0ZSgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydCBjbGFzcyBTYWZlU3Vic2NyaWJlciBleHRlbmRzIFN1YnNjcmliZXIge1xuICAgIGNvbnN0cnVjdG9yKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgbGV0IG5leHQ7XG4gICAgICAgIGlmIChpc0Z1bmN0aW9uKG9ic2VydmVyT3JOZXh0KSkge1xuICAgICAgICAgICAgbmV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKG9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgICAgICAoeyBuZXh0LCBlcnJvciwgY29tcGxldGUgfSA9IG9ic2VydmVyT3JOZXh0KTtcbiAgICAgICAgICAgIGxldCBjb250ZXh0O1xuICAgICAgICAgICAgaWYgKHRoaXMgJiYgY29uZmlnLnVzZURlcHJlY2F0ZWROZXh0Q29udGV4dCkge1xuICAgICAgICAgICAgICAgIGNvbnRleHQgPSBPYmplY3QuY3JlYXRlKG9ic2VydmVyT3JOZXh0KTtcbiAgICAgICAgICAgICAgICBjb250ZXh0LnVuc3Vic2NyaWJlID0gKCkgPT4gdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbmV4dCA9IG5leHQgPT09IG51bGwgfHwgbmV4dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogbmV4dC5iaW5kKGNvbnRleHQpO1xuICAgICAgICAgICAgZXJyb3IgPSBlcnJvciA9PT0gbnVsbCB8fCBlcnJvciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZXJyb3IuYmluZChjb250ZXh0KTtcbiAgICAgICAgICAgIGNvbXBsZXRlID0gY29tcGxldGUgPT09IG51bGwgfHwgY29tcGxldGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNvbXBsZXRlLmJpbmQoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IHtcbiAgICAgICAgICAgIG5leHQ6IG5leHQgPyB3cmFwRm9yRXJyb3JIYW5kbGluZyhuZXh0LCB0aGlzKSA6IG5vb3AsXG4gICAgICAgICAgICBlcnJvcjogd3JhcEZvckVycm9ySGFuZGxpbmcoZXJyb3IgIT09IG51bGwgJiYgZXJyb3IgIT09IHZvaWQgMCA/IGVycm9yIDogZGVmYXVsdEVycm9ySGFuZGxlciwgdGhpcyksXG4gICAgICAgICAgICBjb21wbGV0ZTogY29tcGxldGUgPyB3cmFwRm9yRXJyb3JIYW5kbGluZyhjb21wbGV0ZSwgdGhpcykgOiBub29wLFxuICAgICAgICB9O1xuICAgIH1cbn1cbmZ1bmN0aW9uIHdyYXBGb3JFcnJvckhhbmRsaW5nKGhhbmRsZXIsIGluc3RhbmNlKSB7XG4gICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBoYW5kbGVyKC4uLmFyZ3MpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgICAgICAgICAgIGNhcHR1cmVFcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVwb3J0VW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG59XG5mdW5jdGlvbiBkZWZhdWx0RXJyb3JIYW5kbGVyKGVycikge1xuICAgIHRocm93IGVycjtcbn1cbmZ1bmN0aW9uIGhhbmRsZVN0b3BwZWROb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJzY3JpYmVyKSB7XG4gICAgY29uc3QgeyBvblN0b3BwZWROb3RpZmljYXRpb24gfSA9IGNvbmZpZztcbiAgICBvblN0b3BwZWROb3RpZmljYXRpb24gJiYgdGltZW91dFByb3ZpZGVyLnNldFRpbWVvdXQoKCkgPT4gb25TdG9wcGVkTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbiwgc3Vic2NyaWJlcikpO1xufVxuZXhwb3J0IGNvbnN0IEVNUFRZX09CU0VSVkVSID0ge1xuICAgIGNsb3NlZDogdHJ1ZSxcbiAgICBuZXh0OiBub29wLFxuICAgIGVycm9yOiBkZWZhdWx0RXJyb3JIYW5kbGVyLFxuICAgIGNvbXBsZXRlOiBub29wLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVN1YnNjcmliZXIuanMubWFwIiwiZXhwb3J0IGNvbnN0IG9ic2VydmFibGUgPSAoKCkgPT4gKHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLm9ic2VydmFibGUpIHx8ICdAQG9ic2VydmFibGUnKSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b2JzZXJ2YWJsZS5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gaWRlbnRpdHkoeCkge1xuICAgIHJldHVybiB4O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aWRlbnRpdHkuanMubWFwIiwiaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiBwaXBlKC4uLmZucykge1xuICAgIHJldHVybiBwaXBlRnJvbUFycmF5KGZucyk7XG59XG5leHBvcnQgZnVuY3Rpb24gcGlwZUZyb21BcnJheShmbnMpIHtcbiAgICBpZiAoZm5zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gaWRlbnRpdHk7XG4gICAgfVxuICAgIGlmIChmbnMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIHJldHVybiBmbnNbMF07XG4gICAgfVxuICAgIHJldHVybiBmdW5jdGlvbiBwaXBlZChpbnB1dCkge1xuICAgICAgICByZXR1cm4gZm5zLnJlZHVjZSgocHJldiwgZm4pID0+IGZuKHByZXYpLCBpbnB1dCk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBpcGUuanMubWFwIiwiaW1wb3J0IHsgU2FmZVN1YnNjcmliZXIsIFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgaXNTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBwaXBlRnJvbUFycmF5IH0gZnJvbSAnLi91dGlsL3BpcGUnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IGVycm9yQ29udGV4dCB9IGZyb20gJy4vdXRpbC9lcnJvckNvbnRleHQnO1xuZXhwb3J0IGNsYXNzIE9ic2VydmFibGUge1xuICAgIGNvbnN0cnVjdG9yKHN1YnNjcmliZSkge1xuICAgICAgICBpZiAoc3Vic2NyaWJlKSB7XG4gICAgICAgICAgICB0aGlzLl9zdWJzY3JpYmUgPSBzdWJzY3JpYmU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGlmdChvcGVyYXRvcikge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGUoKTtcbiAgICAgICAgb2JzZXJ2YWJsZS5zb3VyY2UgPSB0aGlzO1xuICAgICAgICBvYnNlcnZhYmxlLm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgIH1cbiAgICBzdWJzY3JpYmUob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gaXNTdWJzY3JpYmVyKG9ic2VydmVyT3JOZXh0KSA/IG9ic2VydmVyT3JOZXh0IDogbmV3IFNhZmVTdWJzY3JpYmVyKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuICAgICAgICBlcnJvckNvbnRleHQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBvcGVyYXRvciwgc291cmNlIH0gPSB0aGlzO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQob3BlcmF0b3JcbiAgICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yLmNhbGwoc3Vic2NyaWJlciwgc291cmNlKVxuICAgICAgICAgICAgICAgIDogc291cmNlXG4gICAgICAgICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N1YnNjcmliZShzdWJzY3JpYmVyKVxuICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl90cnlTdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gICAgfVxuICAgIF90cnlTdWJzY3JpYmUoc2luaykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX3N1YnNjcmliZShzaW5rKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBzaW5rLmVycm9yKGVycik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yRWFjaChuZXh0LCBwcm9taXNlQ3Rvcikge1xuICAgICAgICBwcm9taXNlQ3RvciA9IGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yKTtcbiAgICAgICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVyID0gbmV3IFNhZmVTdWJzY3JpYmVyKHtcbiAgICAgICAgICAgICAgICBuZXh0OiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogcmVqZWN0LFxuICAgICAgICAgICAgICAgIGNvbXBsZXRlOiByZXNvbHZlLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIF9zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiAoX2EgPSB0aGlzLnNvdXJjZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9XG4gICAgW1N5bWJvbF9vYnNlcnZhYmxlXSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHBpcGUoLi4ub3BlcmF0aW9ucykge1xuICAgICAgICByZXR1cm4gcGlwZUZyb21BcnJheShvcGVyYXRpb25zKSh0aGlzKTtcbiAgICB9XG4gICAgdG9Qcm9taXNlKHByb21pc2VDdG9yKSB7XG4gICAgICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuICAgICAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGxldCB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuc3Vic2NyaWJlKCh4KSA9PiAodmFsdWUgPSB4KSwgKGVycikgPT4gcmVqZWN0KGVyciksICgpID0+IHJlc29sdmUodmFsdWUpKTtcbiAgICAgICAgfSk7XG4gICAgfVxufVxuT2JzZXJ2YWJsZS5jcmVhdGUgPSAoc3Vic2NyaWJlKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZSk7XG59O1xuZnVuY3Rpb24gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpIHtcbiAgICB2YXIgX2E7XG4gICAgcmV0dXJuIChfYSA9IHByb21pc2VDdG9yICE9PSBudWxsICYmIHByb21pc2VDdG9yICE9PSB2b2lkIDAgPyBwcm9taXNlQ3RvciA6IGNvbmZpZy5Qcm9taXNlKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBQcm9taXNlO1xufVxuZnVuY3Rpb24gaXNPYnNlcnZlcih2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSAmJiBpc0Z1bmN0aW9uKHZhbHVlLm5leHQpICYmIGlzRnVuY3Rpb24odmFsdWUuZXJyb3IpICYmIGlzRnVuY3Rpb24odmFsdWUuY29tcGxldGUpO1xufVxuZnVuY3Rpb24gaXNTdWJzY3JpYmVyKHZhbHVlKSB7XG4gICAgcmV0dXJuICh2YWx1ZSAmJiB2YWx1ZSBpbnN0YW5jZW9mIFN1YnNjcmliZXIpIHx8IChpc09ic2VydmVyKHZhbHVlKSAmJiBpc1N1YnNjcmlwdGlvbih2YWx1ZSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBoYXNMaWZ0KHNvdXJjZSkge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHNvdXJjZSA9PT0gbnVsbCB8fCBzb3VyY2UgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNvdXJjZS5saWZ0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBvcGVyYXRlKGluaXQpIHtcbiAgICByZXR1cm4gKHNvdXJjZSkgPT4ge1xuICAgICAgICBpZiAoaGFzTGlmdChzb3VyY2UpKSB7XG4gICAgICAgICAgICByZXR1cm4gc291cmNlLmxpZnQoZnVuY3Rpb24gKGxpZnRlZFNvdXJjZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBpbml0KGxpZnRlZFNvdXJjZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1VuYWJsZSB0byBsaWZ0IHVua25vd24gT2JzZXJ2YWJsZSB0eXBlJyk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxpZnQuanMubWFwIiwiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuZXhwb3J0IGNsYXNzIE9wZXJhdG9yU3Vic2NyaWJlciBleHRlbmRzIFN1YnNjcmliZXIge1xuICAgIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uLCBvbk5leHQsIG9uQ29tcGxldGUsIG9uRXJyb3IsIG9uRmluYWxpemUpIHtcbiAgICAgICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgICAgICB0aGlzLm9uRmluYWxpemUgPSBvbkZpbmFsaXplO1xuICAgICAgICB0aGlzLl9uZXh0ID0gb25OZXh0XG4gICAgICAgICAgICA/IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uTmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICA6IHN1cGVyLl9uZXh0O1xuICAgICAgICB0aGlzLl9lcnJvciA9IG9uRXJyb3JcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uRXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogc3VwZXIuX2Vycm9yO1xuICAgICAgICB0aGlzLl9jb21wbGV0ZSA9IG9uQ29tcGxldGVcbiAgICAgICAgICAgID8gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9uQ29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogc3VwZXIuX2NvbXBsZXRlO1xuICAgIH1cbiAgICB1bnN1YnNjcmliZSgpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICBjb25zdCB7IGNsb3NlZCB9ID0gdGhpcztcbiAgICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgIWNsb3NlZCAmJiAoKF9hID0gdGhpcy5vbkZpbmFsaXplKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0aGlzKSk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9T3BlcmF0b3JTdWJzY3JpYmVyLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHJlZkNvdW50KCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICBzb3VyY2UuX3JlZkNvdW50Kys7XG4gICAgICAgIGNvbnN0IHJlZkNvdW50ZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghc291cmNlIHx8IHNvdXJjZS5fcmVmQ291bnQgPD0gMCB8fCAwIDwgLS1zb3VyY2UuX3JlZkNvdW50KSB7XG4gICAgICAgICAgICAgICAgY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc2hhcmVkQ29ubmVjdGlvbiA9IHNvdXJjZS5fY29ubmVjdGlvbjtcbiAgICAgICAgICAgIGNvbnN0IGNvbm4gPSBjb25uZWN0aW9uO1xuICAgICAgICAgICAgY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICBpZiAoc2hhcmVkQ29ubmVjdGlvbiAmJiAoIWNvbm4gfHwgc2hhcmVkQ29ubmVjdGlvbiA9PT0gY29ubikpIHtcbiAgICAgICAgICAgICAgICBzaGFyZWRDb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKHJlZkNvdW50ZXIpO1xuICAgICAgICBpZiAoIXJlZkNvdW50ZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9uID0gc291cmNlLmNvbm5lY3QoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVmQ291bnQuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHJlZkNvdW50IGFzIGhpZ2hlck9yZGVyUmVmQ291bnQgfSBmcm9tICcuLi9vcGVyYXRvcnMvcmVmQ291bnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi4vb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBoYXNMaWZ0IH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmV4cG9ydCBjbGFzcyBDb25uZWN0YWJsZU9ic2VydmFibGUgZXh0ZW5kcyBPYnNlcnZhYmxlIHtcbiAgICBjb25zdHJ1Y3Rvcihzb3VyY2UsIHN1YmplY3RGYWN0b3J5KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICAgICAgICB0aGlzLnN1YmplY3RGYWN0b3J5ID0gc3ViamVjdEZhY3Rvcnk7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSBudWxsO1xuICAgICAgICB0aGlzLl9yZWZDb3VudCA9IDA7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICBpZiAoaGFzTGlmdChzb3VyY2UpKSB7XG4gICAgICAgICAgICB0aGlzLmxpZnQgPSBzb3VyY2UubGlmdDtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3ViamVjdCgpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9XG4gICAgZ2V0U3ViamVjdCgpIHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IHRoaXMuX3N1YmplY3Q7XG4gICAgICAgIGlmICghc3ViamVjdCB8fCBzdWJqZWN0LmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuc3ViamVjdEZhY3RvcnkoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcbiAgICB9XG4gICAgX3RlYXJkb3duKCkge1xuICAgICAgICB0aGlzLl9yZWZDb3VudCA9IDA7XG4gICAgICAgIGNvbnN0IHsgX2Nvbm5lY3Rpb24gfSA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3N1YmplY3QgPSB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgX2Nvbm5lY3Rpb24gPT09IG51bGwgfHwgX2Nvbm5lY3Rpb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9jb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGNvbm5lY3QoKSB7XG4gICAgICAgIGxldCBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvbjtcbiAgICAgICAgaWYgKCFjb25uZWN0aW9uKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLmdldFN1YmplY3QoKTtcbiAgICAgICAgICAgIGNvbm5lY3Rpb24uYWRkKHRoaXMuc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YmplY3QsIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RlYXJkb3duKCk7XG4gICAgICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RlYXJkb3duKCk7XG4gICAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfSwgKCkgPT4gdGhpcy5fdGVhcmRvd24oKSkpKTtcbiAgICAgICAgICAgIGlmIChjb25uZWN0aW9uLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbm5lY3Rpb247XG4gICAgfVxuICAgIHJlZkNvdW50KCkge1xuICAgICAgICByZXR1cm4gaGlnaGVyT3JkZXJSZWZDb3VudCgpKHRoaXMpO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUNvbm5lY3RhYmxlT2JzZXJ2YWJsZS5qcy5tYXAiLCJleHBvcnQgY29uc3QgcGVyZm9ybWFuY2VUaW1lc3RhbXBQcm92aWRlciA9IHtcbiAgICBub3coKSB7XG4gICAgICAgIHJldHVybiAocGVyZm9ybWFuY2VUaW1lc3RhbXBQcm92aWRlci5kZWxlZ2F0ZSB8fCBwZXJmb3JtYW5jZSkubm93KCk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXIuanMubWFwIiwiaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmV4cG9ydCBjb25zdCBhbmltYXRpb25GcmFtZVByb3ZpZGVyID0ge1xuICAgIHNjaGVkdWxlKGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCByZXF1ZXN0ID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICBsZXQgY2FuY2VsID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG4gICAgICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IGFuaW1hdGlvbkZyYW1lUHJvdmlkZXI7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgcmVxdWVzdCA9IGRlbGVnYXRlLnJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICAgICAgICAgIGNhbmNlbCA9IGRlbGVnYXRlLmNhbmNlbEFuaW1hdGlvbkZyYW1lO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IHJlcXVlc3QoKHRpbWVzdGFtcCkgPT4ge1xuICAgICAgICAgICAgY2FuY2VsID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgY2FsbGJhY2sodGltZXN0YW1wKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBuZXcgU3Vic2NyaXB0aW9uKCgpID0+IGNhbmNlbCA9PT0gbnVsbCB8fCBjYW5jZWwgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNhbmNlbChoYW5kbGUpKTtcbiAgICB9LFxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IGFuaW1hdGlvbkZyYW1lUHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUpIHx8IHJlcXVlc3RBbmltYXRpb25GcmFtZSkoLi4uYXJncyk7XG4gICAgfSxcbiAgICBjYW5jZWxBbmltYXRpb25GcmFtZSguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IGFuaW1hdGlvbkZyYW1lUHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5jYW5jZWxBbmltYXRpb25GcmFtZSkgfHwgY2FuY2VsQW5pbWF0aW9uRnJhbWUpKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25GcmFtZVByb3ZpZGVyLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uLy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBwZXJmb3JtYW5jZVRpbWVzdGFtcFByb3ZpZGVyIH0gZnJvbSAnLi4vLi4vc2NoZWR1bGVyL3BlcmZvcm1hbmNlVGltZXN0YW1wUHJvdmlkZXInO1xuaW1wb3J0IHsgYW5pbWF0aW9uRnJhbWVQcm92aWRlciB9IGZyb20gJy4uLy4uL3NjaGVkdWxlci9hbmltYXRpb25GcmFtZVByb3ZpZGVyJztcbmV4cG9ydCBmdW5jdGlvbiBhbmltYXRpb25GcmFtZXModGltZXN0YW1wUHJvdmlkZXIpIHtcbiAgICByZXR1cm4gdGltZXN0YW1wUHJvdmlkZXIgPyBhbmltYXRpb25GcmFtZXNGYWN0b3J5KHRpbWVzdGFtcFByb3ZpZGVyKSA6IERFRkFVTFRfQU5JTUFUSU9OX0ZSQU1FUztcbn1cbmZ1bmN0aW9uIGFuaW1hdGlvbkZyYW1lc0ZhY3RvcnkodGltZXN0YW1wUHJvdmlkZXIpIHtcbiAgICBjb25zdCB7IHNjaGVkdWxlIH0gPSBhbmltYXRpb25GcmFtZVByb3ZpZGVyO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgIGNvbnN0IHByb3ZpZGVyID0gdGltZXN0YW1wUHJvdmlkZXIgfHwgcGVyZm9ybWFuY2VUaW1lc3RhbXBQcm92aWRlcjtcbiAgICAgICAgY29uc3Qgc3RhcnQgPSBwcm92aWRlci5ub3coKTtcbiAgICAgICAgY29uc3QgcnVuID0gKHRpbWVzdGFtcCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgbm93ID0gcHJvdmlkZXIubm93KCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoe1xuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogdGltZXN0YW1wUHJvdmlkZXIgPyBub3cgOiB0aW1lc3RhbXAsXG4gICAgICAgICAgICAgICAgZWxhcHNlZDogbm93IC0gc3RhcnQsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uYWRkKHNjaGVkdWxlKHJ1bikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzdWJzY3JpcHRpb24uYWRkKHNjaGVkdWxlKHJ1bikpO1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH0pO1xufVxuY29uc3QgREVGQVVMVF9BTklNQVRJT05fRlJBTUVTID0gYW5pbWF0aW9uRnJhbWVzRmFjdG9yeSgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5pbWF0aW9uRnJhbWVzLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yID0gY3JlYXRlRXJyb3JDbGFzcygoX3N1cGVyKSA9PiBmdW5jdGlvbiBPYmplY3RVbnN1YnNjcmliZWRFcnJvckltcGwoKSB7XG4gICAgX3N1cGVyKHRoaXMpO1xuICAgIHRoaXMubmFtZSA9ICdPYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG4gICAgdGhpcy5tZXNzYWdlID0gJ29iamVjdCB1bnN1YnNjcmliZWQnO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1PYmplY3RVbnN1YnNjcmliZWRFcnJvci5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiwgRU1QVFlfU1VCU0NSSVBUSU9OIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi91dGlsL2FyclJlbW92ZSc7XG5pbXBvcnQgeyBlcnJvckNvbnRleHQgfSBmcm9tICcuL3V0aWwvZXJyb3JDb250ZXh0JztcbmV4cG9ydCBjbGFzcyBTdWJqZWN0IGV4dGVuZHMgT2JzZXJ2YWJsZSB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuY2xvc2VkID0gZmFsc2U7XG4gICAgICAgIHRoaXMub2JzZXJ2ZXJzID0gW107XG4gICAgICAgIHRoaXMuaXNTdG9wcGVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuaGFzRXJyb3IgPSBmYWxzZTtcbiAgICAgICAgdGhpcy50aHJvd25FcnJvciA9IG51bGw7XG4gICAgfVxuICAgIGxpZnQob3BlcmF0b3IpIHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IG5ldyBBbm9ueW1vdXNTdWJqZWN0KHRoaXMsIHRoaXMpO1xuICAgICAgICBzdWJqZWN0Lm9wZXJhdG9yID0gb3BlcmF0b3I7XG4gICAgICAgIHJldHVybiBzdWJqZWN0O1xuICAgIH1cbiAgICBfdGhyb3dJZkNsb3NlZCgpIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIGVycm9yQ29udGV4dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLl90aHJvd0lmQ2xvc2VkKCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY29weSA9IHRoaXMub2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBvYnNlcnZlciBvZiBjb3B5KSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGVycm9yKGVycikge1xuICAgICAgICBlcnJvckNvbnRleHQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdGhyb3dJZkNsb3NlZCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFzRXJyb3IgPSB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy50aHJvd25FcnJvciA9IGVycjtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9ic2VydmVycyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICB3aGlsZSAob2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcnMuc2hpZnQoKS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGNvbXBsZXRlKCkge1xuICAgICAgICBlcnJvckNvbnRleHQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fdGhyb3dJZkNsb3NlZCgpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBjb25zdCB7IG9ic2VydmVycyB9ID0gdGhpcztcbiAgICAgICAgICAgICAgICB3aGlsZSAob2JzZXJ2ZXJzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlcnMuc2hpZnQoKS5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICB0aGlzLmlzU3RvcHBlZCA9IHRoaXMuY2xvc2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vYnNlcnZlcnMgPSBudWxsO1xuICAgIH1cbiAgICBnZXQgb2JzZXJ2ZWQoKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgcmV0dXJuICgoX2EgPSB0aGlzLm9ic2VydmVycykgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmxlbmd0aCkgPiAwO1xuICAgIH1cbiAgICBfdHJ5U3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgdGhpcy5fdGhyb3dJZkNsb3NlZCgpO1xuICAgICAgICByZXR1cm4gc3VwZXIuX3RyeVN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9XG4gICAgX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgdGhpcy5fY2hlY2tGaW5hbGl6ZWRTdGF0dXNlcyhzdWJzY3JpYmVyKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lubmVyU3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH1cbiAgICBfaW5uZXJTdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgICAgICBjb25zdCB7IGhhc0Vycm9yLCBpc1N0b3BwZWQsIG9ic2VydmVycyB9ID0gdGhpcztcbiAgICAgICAgcmV0dXJuIGhhc0Vycm9yIHx8IGlzU3RvcHBlZFxuICAgICAgICAgICAgPyBFTVBUWV9TVUJTQ1JJUFRJT05cbiAgICAgICAgICAgIDogKG9ic2VydmVycy5wdXNoKHN1YnNjcmliZXIpLCBuZXcgU3Vic2NyaXB0aW9uKCgpID0+IGFyclJlbW92ZShvYnNlcnZlcnMsIHN1YnNjcmliZXIpKSk7XG4gICAgfVxuICAgIF9jaGVja0ZpbmFsaXplZFN0YXR1c2VzKHN1YnNjcmliZXIpIHtcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgdGhyb3duRXJyb3IsIGlzU3RvcHBlZCB9ID0gdGhpcztcbiAgICAgICAgaWYgKGhhc0Vycm9yKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKHRocm93bkVycm9yKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChpc1N0b3BwZWQpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBhc09ic2VydmFibGUoKSB7XG4gICAgICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZSgpO1xuICAgICAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICAgIH1cbn1cblN1YmplY3QuY3JlYXRlID0gKGRlc3RpbmF0aW9uLCBzb3VyY2UpID0+IHtcbiAgICByZXR1cm4gbmV3IEFub255bW91c1N1YmplY3QoZGVzdGluYXRpb24sIHNvdXJjZSk7XG59O1xuZXhwb3J0IGNsYXNzIEFub255bW91c1N1YmplY3QgZXh0ZW5kcyBTdWJqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbiwgc291cmNlKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgfVxuICAgIG5leHQodmFsdWUpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5kZXN0aW5hdGlvbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5leHQpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hLCB2YWx1ZSk7XG4gICAgfVxuICAgIGVycm9yKGVycikge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICAoX2IgPSAoX2EgPSB0aGlzLmRlc3RpbmF0aW9uKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuZXJyb3IpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKF9hLCBlcnIpO1xuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgKF9iID0gKF9hID0gdGhpcy5kZXN0aW5hdGlvbikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNvbXBsZXRlKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChfYSk7XG4gICAgfVxuICAgIF9zdWJzY3JpYmUoc3Vic2NyaWJlcikge1xuICAgICAgICB2YXIgX2EsIF9iO1xuICAgICAgICByZXR1cm4gKF9iID0gKF9hID0gdGhpcy5zb3VyY2UpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5zdWJzY3JpYmUoc3Vic2NyaWJlcikpICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IEVNUFRZX1NVQlNDUklQVElPTjtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TdWJqZWN0LmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuZXhwb3J0IGNsYXNzIEJlaGF2aW9yU3ViamVjdCBleHRlbmRzIFN1YmplY3Qge1xuICAgIGNvbnN0cnVjdG9yKF92YWx1ZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl92YWx1ZSA9IF92YWx1ZTtcbiAgICB9XG4gICAgZ2V0IHZhbHVlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgpO1xuICAgIH1cbiAgICBfc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgIXN1YnNjcmlwdGlvbi5jbG9zZWQgJiYgc3Vic2NyaWJlci5uZXh0KHRoaXMuX3ZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9XG4gICAgZ2V0VmFsdWUoKSB7XG4gICAgICAgIGNvbnN0IHsgaGFzRXJyb3IsIHRocm93bkVycm9yLCBfdmFsdWUgfSA9IHRoaXM7XG4gICAgICAgIGlmIChoYXNFcnJvcikge1xuICAgICAgICAgICAgdGhyb3cgdGhyb3duRXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdGhyb3dJZkNsb3NlZCgpO1xuICAgICAgICByZXR1cm4gX3ZhbHVlO1xuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIHN1cGVyLm5leHQoKHRoaXMuX3ZhbHVlID0gdmFsdWUpKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1CZWhhdmlvclN1YmplY3QuanMubWFwIiwiZXhwb3J0IGNvbnN0IGRhdGVUaW1lc3RhbXBQcm92aWRlciA9IHtcbiAgICBub3coKSB7XG4gICAgICAgIHJldHVybiAoZGF0ZVRpbWVzdGFtcFByb3ZpZGVyLmRlbGVnYXRlIHx8IERhdGUpLm5vdygpO1xuICAgIH0sXG4gICAgZGVsZWdhdGU6IHVuZGVmaW5lZCxcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRlVGltZXN0YW1wUHJvdmlkZXIuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5pbXBvcnQgeyBkYXRlVGltZXN0YW1wUHJvdmlkZXIgfSBmcm9tICcuL3NjaGVkdWxlci9kYXRlVGltZXN0YW1wUHJvdmlkZXInO1xuZXhwb3J0IGNsYXNzIFJlcGxheVN1YmplY3QgZXh0ZW5kcyBTdWJqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcihfYnVmZmVyU2l6ZSA9IEluZmluaXR5LCBfd2luZG93VGltZSA9IEluZmluaXR5LCBfdGltZXN0YW1wUHJvdmlkZXIgPSBkYXRlVGltZXN0YW1wUHJvdmlkZXIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fYnVmZmVyU2l6ZSA9IF9idWZmZXJTaXplO1xuICAgICAgICB0aGlzLl93aW5kb3dUaW1lID0gX3dpbmRvd1RpbWU7XG4gICAgICAgIHRoaXMuX3RpbWVzdGFtcFByb3ZpZGVyID0gX3RpbWVzdGFtcFByb3ZpZGVyO1xuICAgICAgICB0aGlzLl9idWZmZXIgPSBbXTtcbiAgICAgICAgdGhpcy5faW5maW5pdGVUaW1lV2luZG93ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5faW5maW5pdGVUaW1lV2luZG93ID0gX3dpbmRvd1RpbWUgPT09IEluZmluaXR5O1xuICAgICAgICB0aGlzLl9idWZmZXJTaXplID0gTWF0aC5tYXgoMSwgX2J1ZmZlclNpemUpO1xuICAgICAgICB0aGlzLl93aW5kb3dUaW1lID0gTWF0aC5tYXgoMSwgX3dpbmRvd1RpbWUpO1xuICAgIH1cbiAgICBuZXh0KHZhbHVlKSB7XG4gICAgICAgIGNvbnN0IHsgaXNTdG9wcGVkLCBfYnVmZmVyLCBfaW5maW5pdGVUaW1lV2luZG93LCBfdGltZXN0YW1wUHJvdmlkZXIsIF93aW5kb3dUaW1lIH0gPSB0aGlzO1xuICAgICAgICBpZiAoIWlzU3RvcHBlZCkge1xuICAgICAgICAgICAgX2J1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICFfaW5maW5pdGVUaW1lV2luZG93ICYmIF9idWZmZXIucHVzaChfdGltZXN0YW1wUHJvdmlkZXIubm93KCkgKyBfd2luZG93VGltZSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fdHJpbUJ1ZmZlcigpO1xuICAgICAgICBzdXBlci5uZXh0KHZhbHVlKTtcbiAgICB9XG4gICAgX3N1YnNjcmliZShzdWJzY3JpYmVyKSB7XG4gICAgICAgIHRoaXMuX3Rocm93SWZDbG9zZWQoKTtcbiAgICAgICAgdGhpcy5fdHJpbUJ1ZmZlcigpO1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSB0aGlzLl9pbm5lclN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgY29uc3QgeyBfaW5maW5pdGVUaW1lV2luZG93LCBfYnVmZmVyIH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBjb3B5ID0gX2J1ZmZlci5zbGljZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvcHkubGVuZ3RoICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSArPSBfaW5maW5pdGVUaW1lV2luZG93ID8gMSA6IDIpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChjb3B5W2ldKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jaGVja0ZpbmFsaXplZFN0YXR1c2VzKHN1YnNjcmliZXIpO1xuICAgICAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICAgIH1cbiAgICBfdHJpbUJ1ZmZlcigpIHtcbiAgICAgICAgY29uc3QgeyBfYnVmZmVyU2l6ZSwgX3RpbWVzdGFtcFByb3ZpZGVyLCBfYnVmZmVyLCBfaW5maW5pdGVUaW1lV2luZG93IH0gPSB0aGlzO1xuICAgICAgICBjb25zdCBhZGp1c3RlZEJ1ZmZlclNpemUgPSAoX2luZmluaXRlVGltZVdpbmRvdyA/IDEgOiAyKSAqIF9idWZmZXJTaXplO1xuICAgICAgICBfYnVmZmVyU2l6ZSA8IEluZmluaXR5ICYmIGFkanVzdGVkQnVmZmVyU2l6ZSA8IF9idWZmZXIubGVuZ3RoICYmIF9idWZmZXIuc3BsaWNlKDAsIF9idWZmZXIubGVuZ3RoIC0gYWRqdXN0ZWRCdWZmZXJTaXplKTtcbiAgICAgICAgaWYgKCFfaW5maW5pdGVUaW1lV2luZG93KSB7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBfdGltZXN0YW1wUHJvdmlkZXIubm93KCk7XG4gICAgICAgICAgICBsZXQgbGFzdCA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IF9idWZmZXIubGVuZ3RoICYmIF9idWZmZXJbaV0gPD0gbm93OyBpICs9IDIpIHtcbiAgICAgICAgICAgICAgICBsYXN0ID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxhc3QgJiYgX2J1ZmZlci5zcGxpY2UoMCwgbGFzdCArIDEpO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UmVwbGF5U3ViamVjdC5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmV4cG9ydCBjbGFzcyBBc3luY1N1YmplY3QgZXh0ZW5kcyBTdWJqZWN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5fdmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9oYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9pc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgfVxuICAgIF9jaGVja0ZpbmFsaXplZFN0YXR1c2VzKHN1YnNjcmliZXIpIHtcbiAgICAgICAgY29uc3QgeyBoYXNFcnJvciwgX2hhc1ZhbHVlLCBfdmFsdWUsIHRocm93bkVycm9yLCBpc1N0b3BwZWQsIF9pc0NvbXBsZXRlIH0gPSB0aGlzO1xuICAgICAgICBpZiAoaGFzRXJyb3IpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhyb3duRXJyb3IpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGlzU3RvcHBlZCB8fCBfaXNDb21wbGV0ZSkge1xuICAgICAgICAgICAgX2hhc1ZhbHVlICYmIHN1YnNjcmliZXIubmV4dChfdmFsdWUpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIG5leHQodmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgICAgICAgdGhpcy5fdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuX2hhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgY29uc3QgeyBfaGFzVmFsdWUsIF92YWx1ZSwgX2lzQ29tcGxldGUgfSA9IHRoaXM7XG4gICAgICAgIGlmICghX2lzQ29tcGxldGUpIHtcbiAgICAgICAgICAgIHRoaXMuX2lzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgX2hhc1ZhbHVlICYmIHN1cGVyLm5leHQoX3ZhbHVlKTtcbiAgICAgICAgICAgIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Bc3luY1N1YmplY3QuanMubWFwIiwiaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmV4cG9ydCBjbGFzcyBBY3Rpb24gZXh0ZW5kcyBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHNjaGVkdWxlciwgd29yaykge1xuICAgICAgICBzdXBlcigpO1xuICAgIH1cbiAgICBzY2hlZHVsZShzdGF0ZSwgZGVsYXkgPSAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFjdGlvbi5qcy5tYXAiLCJleHBvcnQgY29uc3QgaW50ZXJ2YWxQcm92aWRlciA9IHtcbiAgICBzZXRJbnRlcnZhbCguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHsgZGVsZWdhdGUgfSA9IGludGVydmFsUHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5zZXRJbnRlcnZhbCkgfHwgc2V0SW50ZXJ2YWwpKC4uLmFyZ3MpO1xuICAgIH0sXG4gICAgY2xlYXJJbnRlcnZhbChoYW5kbGUpIHtcbiAgICAgICAgY29uc3QgeyBkZWxlZ2F0ZSB9ID0gaW50ZXJ2YWxQcm92aWRlcjtcbiAgICAgICAgcmV0dXJuICgoZGVsZWdhdGUgPT09IG51bGwgfHwgZGVsZWdhdGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGRlbGVnYXRlLmNsZWFySW50ZXJ2YWwpIHx8IGNsZWFySW50ZXJ2YWwpKGhhbmRsZSk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWludGVydmFsUHJvdmlkZXIuanMubWFwIiwiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi9BY3Rpb24nO1xuaW1wb3J0IHsgaW50ZXJ2YWxQcm92aWRlciB9IGZyb20gJy4vaW50ZXJ2YWxQcm92aWRlcic7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuLi91dGlsL2FyclJlbW92ZSc7XG5leHBvcnQgY2xhc3MgQXN5bmNBY3Rpb24gZXh0ZW5kcyBBY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKHNjaGVkdWxlciwgd29yaykge1xuICAgICAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgICAgdGhpcy53b3JrID0gd29yaztcbiAgICAgICAgdGhpcy5wZW5kaW5nID0gZmFsc2U7XG4gICAgfVxuICAgIHNjaGVkdWxlKHN0YXRlLCBkZWxheSA9IDApIHtcbiAgICAgICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICAgICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgICAgICB0aGlzLmlkID0gdGhpcy5pZCB8fCB0aGlzLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgdGhpcy5pZCwgZGVsYXkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBfaWQsIGRlbGF5ID0gMCkge1xuICAgICAgICByZXR1cm4gaW50ZXJ2YWxQcm92aWRlci5zZXRJbnRlcnZhbChzY2hlZHVsZXIuZmx1c2guYmluZChzY2hlZHVsZXIsIHRoaXMpLCBkZWxheSk7XG4gICAgfVxuICAgIHJlY3ljbGVBc3luY0lkKF9zY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgaWYgKGRlbGF5ICE9IG51bGwgJiYgdGhpcy5kZWxheSA9PT0gZGVsYXkgJiYgdGhpcy5wZW5kaW5nID09PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGlkO1xuICAgICAgICB9XG4gICAgICAgIGludGVydmFsUHJvdmlkZXIuY2xlYXJJbnRlcnZhbChpZCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGV4ZWN1dGUoc3RhdGUsIGRlbGF5KSB7XG4gICAgICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBFcnJvcignZXhlY3V0aW5nIGEgY2FuY2VsbGVkIGFjdGlvbicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgICAgICBjb25zdCBlcnJvciA9IHRoaXMuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodGhpcy5wZW5kaW5nID09PSBmYWxzZSAmJiB0aGlzLmlkICE9IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHRoaXMuc2NoZWR1bGVyLCB0aGlzLmlkLCBudWxsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfZXhlY3V0ZShzdGF0ZSwgX2RlbGF5KSB7XG4gICAgICAgIGxldCBlcnJvcmVkID0gZmFsc2U7XG4gICAgICAgIGxldCBlcnJvclZhbHVlO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpcy53b3JrKHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgZXJyb3JlZCA9IHRydWU7XG4gICAgICAgICAgICBlcnJvclZhbHVlID0gZSA/IGUgOiBuZXcgRXJyb3IoJ1NjaGVkdWxlZCBhY3Rpb24gdGhyZXcgZmFsc3kgZXJyb3InKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXJyb3JlZCkge1xuICAgICAgICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgcmV0dXJuIGVycm9yVmFsdWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgdW5zdWJzY3JpYmUoKSB7XG4gICAgICAgIGlmICghdGhpcy5jbG9zZWQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgaWQsIHNjaGVkdWxlciB9ID0gdGhpcztcbiAgICAgICAgICAgIGNvbnN0IHsgYWN0aW9ucyB9ID0gc2NoZWR1bGVyO1xuICAgICAgICAgICAgdGhpcy53b3JrID0gdGhpcy5zdGF0ZSA9IHRoaXMuc2NoZWR1bGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgYXJyUmVtb3ZlKGFjdGlvbnMsIHRoaXMpO1xuICAgICAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGVsYXkgPSBudWxsO1xuICAgICAgICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFzeW5jQWN0aW9uLmpzLm1hcCIsImxldCBuZXh0SGFuZGxlID0gMTtcbmxldCByZXNvbHZlZDtcbmNvbnN0IGFjdGl2ZUhhbmRsZXMgPSB7fTtcbmZ1bmN0aW9uIGZpbmRBbmRDbGVhckhhbmRsZShoYW5kbGUpIHtcbiAgICBpZiAoaGFuZGxlIGluIGFjdGl2ZUhhbmRsZXMpIHtcbiAgICAgICAgZGVsZXRlIGFjdGl2ZUhhbmRsZXNbaGFuZGxlXTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn1cbmV4cG9ydCBjb25zdCBJbW1lZGlhdGUgPSB7XG4gICAgc2V0SW1tZWRpYXRlKGNiKSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZSA9IG5leHRIYW5kbGUrKztcbiAgICAgICAgYWN0aXZlSGFuZGxlc1toYW5kbGVdID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFyZXNvbHZlZCkge1xuICAgICAgICAgICAgcmVzb2x2ZWQgPSBQcm9taXNlLnJlc29sdmUoKTtcbiAgICAgICAgfVxuICAgICAgICByZXNvbHZlZC50aGVuKCgpID0+IGZpbmRBbmRDbGVhckhhbmRsZShoYW5kbGUpICYmIGNiKCkpO1xuICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgIH0sXG4gICAgY2xlYXJJbW1lZGlhdGUoaGFuZGxlKSB7XG4gICAgICAgIGZpbmRBbmRDbGVhckhhbmRsZShoYW5kbGUpO1xuICAgIH0sXG59O1xuZXhwb3J0IGNvbnN0IFRlc3RUb29scyA9IHtcbiAgICBwZW5kaW5nKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmtleXMoYWN0aXZlSGFuZGxlcykubGVuZ3RoO1xuICAgIH1cbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1JbW1lZGlhdGUuanMubWFwIiwiaW1wb3J0IHsgSW1tZWRpYXRlIH0gZnJvbSAnLi4vdXRpbC9JbW1lZGlhdGUnO1xuY29uc3QgeyBzZXRJbW1lZGlhdGUsIGNsZWFySW1tZWRpYXRlIH0gPSBJbW1lZGlhdGU7XG5leHBvcnQgY29uc3QgaW1tZWRpYXRlUHJvdmlkZXIgPSB7XG4gICAgc2V0SW1tZWRpYXRlKC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3QgeyBkZWxlZ2F0ZSB9ID0gaW1tZWRpYXRlUHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5zZXRJbW1lZGlhdGUpIHx8IHNldEltbWVkaWF0ZSkoLi4uYXJncyk7XG4gICAgfSxcbiAgICBjbGVhckltbWVkaWF0ZShoYW5kbGUpIHtcbiAgICAgICAgY29uc3QgeyBkZWxlZ2F0ZSB9ID0gaW1tZWRpYXRlUHJvdmlkZXI7XG4gICAgICAgIHJldHVybiAoKGRlbGVnYXRlID09PSBudWxsIHx8IGRlbGVnYXRlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkZWxlZ2F0ZS5jbGVhckltbWVkaWF0ZSkgfHwgY2xlYXJJbW1lZGlhdGUpKGhhbmRsZSk7XG4gICAgfSxcbiAgICBkZWxlZ2F0ZTogdW5kZWZpbmVkLFxufTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWltbWVkaWF0ZVByb3ZpZGVyLmpzLm1hcCIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBpbW1lZGlhdGVQcm92aWRlciB9IGZyb20gJy4vaW1tZWRpYXRlUHJvdmlkZXInO1xuZXhwb3J0IGNsYXNzIEFzYXBBY3Rpb24gZXh0ZW5kcyBBc3luY0FjdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioc2NoZWR1bGVyLCB3b3JrKSB7XG4gICAgICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICB0aGlzLndvcmsgPSB3b3JrO1xuICAgIH1cbiAgICByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgaWYgKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICAgICAgfVxuICAgICAgICBzY2hlZHVsZXIuYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVyLl9zY2hlZHVsZWQgfHwgKHNjaGVkdWxlci5fc2NoZWR1bGVkID0gaW1tZWRpYXRlUHJvdmlkZXIuc2V0SW1tZWRpYXRlKHNjaGVkdWxlci5mbHVzaC5iaW5kKHNjaGVkdWxlciwgdW5kZWZpbmVkKSkpO1xuICAgIH1cbiAgICByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgaWYgKChkZWxheSAhPSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc2NoZWR1bGVyLmFjdGlvbnMuc29tZSgoYWN0aW9uKSA9PiBhY3Rpb24uaWQgPT09IGlkKSkge1xuICAgICAgICAgICAgaW1tZWRpYXRlUHJvdmlkZXIuY2xlYXJJbW1lZGlhdGUoaWQpO1xuICAgICAgICAgICAgc2NoZWR1bGVyLl9zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Bc2FwQWN0aW9uLmpzLm1hcCIsImltcG9ydCB7IGRhdGVUaW1lc3RhbXBQcm92aWRlciB9IGZyb20gJy4vc2NoZWR1bGVyL2RhdGVUaW1lc3RhbXBQcm92aWRlcic7XG5leHBvcnQgY2xhc3MgU2NoZWR1bGVyIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlZHVsZXJBY3Rpb25DdG9yLCBub3cgPSBTY2hlZHVsZXIubm93KSB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVyQWN0aW9uQ3RvciA9IHNjaGVkdWxlckFjdGlvbkN0b3I7XG4gICAgICAgIHRoaXMubm93ID0gbm93O1xuICAgIH1cbiAgICBzY2hlZHVsZSh3b3JrLCBkZWxheSA9IDAsIHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcy5zY2hlZHVsZXJBY3Rpb25DdG9yKHRoaXMsIHdvcmspLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgfVxufVxuU2NoZWR1bGVyLm5vdyA9IGRhdGVUaW1lc3RhbXBQcm92aWRlci5ub3c7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1TY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi4vU2NoZWR1bGVyJztcbmV4cG9ydCBjbGFzcyBBc3luY1NjaGVkdWxlciBleHRlbmRzIFNjaGVkdWxlciB7XG4gICAgY29uc3RydWN0b3IoU2NoZWR1bGVyQWN0aW9uLCBub3cgPSBTY2hlZHVsZXIubm93KSB7XG4gICAgICAgIHN1cGVyKFNjaGVkdWxlckFjdGlvbiwgbm93KTtcbiAgICAgICAgdGhpcy5hY3Rpb25zID0gW107XG4gICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGZsdXNoKGFjdGlvbikge1xuICAgICAgICBjb25zdCB7IGFjdGlvbnMgfSA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLl9hY3RpdmUpIHtcbiAgICAgICAgICAgIGFjdGlvbnMucHVzaChhY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCBlcnJvcjtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QXN5bmNTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcbmV4cG9ydCBjbGFzcyBBc2FwU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xuICAgIGZsdXNoKGFjdGlvbikge1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSB0cnVlO1xuICAgICAgICBjb25zdCBmbHVzaElkID0gdGhpcy5fc2NoZWR1bGVkO1xuICAgICAgICB0aGlzLl9zY2hlZHVsZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9ucyB9ID0gdGhpcztcbiAgICAgICAgbGV0IGVycm9yO1xuICAgICAgICBhY3Rpb24gPSBhY3Rpb24gfHwgYWN0aW9ucy5zaGlmdCgpO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBpZiAoKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICgoYWN0aW9uID0gYWN0aW9uc1swXSkgJiYgYWN0aW9uLmlkID09PSBmbHVzaElkICYmIGFjdGlvbnMuc2hpZnQoKSk7XG4gICAgICAgIHRoaXMuX2FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgIHdoaWxlICgoYWN0aW9uID0gYWN0aW9uc1swXSkgJiYgYWN0aW9uLmlkID09PSBmbHVzaElkICYmIGFjdGlvbnMuc2hpZnQoKSkge1xuICAgICAgICAgICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1Bc2FwU2NoZWR1bGVyLmpzLm1hcCIsImltcG9ydCB7IEFzYXBBY3Rpb24gfSBmcm9tICcuL0FzYXBBY3Rpb24nO1xuaW1wb3J0IHsgQXNhcFNjaGVkdWxlciB9IGZyb20gJy4vQXNhcFNjaGVkdWxlcic7XG5leHBvcnQgY29uc3QgYXNhcFNjaGVkdWxlciA9IG5ldyBBc2FwU2NoZWR1bGVyKEFzYXBBY3Rpb24pO1xuZXhwb3J0IGNvbnN0IGFzYXAgPSBhc2FwU2NoZWR1bGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXNhcC5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcbmV4cG9ydCBjb25zdCBhc3luY1NjaGVkdWxlciA9IG5ldyBBc3luY1NjaGVkdWxlcihBc3luY0FjdGlvbik7XG5leHBvcnQgY29uc3QgYXN5bmMgPSBhc3luY1NjaGVkdWxlcjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzeW5jLmpzLm1hcCIsImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5leHBvcnQgY2xhc3MgUXVldWVBY3Rpb24gZXh0ZW5kcyBBc3luY0FjdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioc2NoZWR1bGVyLCB3b3JrKSB7XG4gICAgICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICAgICAgICB0aGlzLndvcmsgPSB3b3JrO1xuICAgIH1cbiAgICBzY2hlZHVsZShzdGF0ZSwgZGVsYXkgPSAwKSB7XG4gICAgICAgIGlmIChkZWxheSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICAgICAgICB0aGlzLnNjaGVkdWxlci5mbHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGV4ZWN1dGUoc3RhdGUsIGRlbGF5KSB7XG4gICAgICAgIHJldHVybiAoZGVsYXkgPiAwIHx8IHRoaXMuY2xvc2VkKSA/XG4gICAgICAgICAgICBzdXBlci5leGVjdXRlKHN0YXRlLCBkZWxheSkgOlxuICAgICAgICAgICAgdGhpcy5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgICByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgaWYgKChkZWxheSAhPSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICAgICAgICByZXR1cm4gc3VwZXIucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuZmx1c2godGhpcyk7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9UXVldWVBY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcbmV4cG9ydCBjbGFzcyBRdWV1ZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVF1ZXVlU2NoZWR1bGVyLmpzLm1hcCIsImltcG9ydCB7IFF1ZXVlQWN0aW9uIH0gZnJvbSAnLi9RdWV1ZUFjdGlvbic7XG5pbXBvcnQgeyBRdWV1ZVNjaGVkdWxlciB9IGZyb20gJy4vUXVldWVTY2hlZHVsZXInO1xuZXhwb3J0IGNvbnN0IHF1ZXVlU2NoZWR1bGVyID0gbmV3IFF1ZXVlU2NoZWR1bGVyKFF1ZXVlQWN0aW9uKTtcbmV4cG9ydCBjb25zdCBxdWV1ZSA9IHF1ZXVlU2NoZWR1bGVyO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cXVldWUuanMubWFwIiwiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IGFuaW1hdGlvbkZyYW1lUHJvdmlkZXIgfSBmcm9tICcuL2FuaW1hdGlvbkZyYW1lUHJvdmlkZXInO1xuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkZyYW1lQWN0aW9uIGV4dGVuZHMgQXN5bmNBY3Rpb24ge1xuICAgIGNvbnN0cnVjdG9yKHNjaGVkdWxlciwgd29yaykge1xuICAgICAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgICAgdGhpcy53b3JrID0gd29yaztcbiAgICB9XG4gICAgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkgPSAwKSB7XG4gICAgICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgc2NoZWR1bGVyLmFjdGlvbnMucHVzaCh0aGlzKTtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5fc2NoZWR1bGVkIHx8IChzY2hlZHVsZXIuX3NjaGVkdWxlZCA9IGFuaW1hdGlvbkZyYW1lUHJvdmlkZXIucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHNjaGVkdWxlci5mbHVzaCh1bmRlZmluZWQpKSk7XG4gICAgfVxuICAgIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5ID0gMCkge1xuICAgICAgICBpZiAoKGRlbGF5ICE9IG51bGwgJiYgZGVsYXkgPiAwKSB8fCAoZGVsYXkgPT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzY2hlZHVsZXIuYWN0aW9ucy5zb21lKChhY3Rpb24pID0+IGFjdGlvbi5pZCA9PT0gaWQpKSB7XG4gICAgICAgICAgICBhbmltYXRpb25GcmFtZVByb3ZpZGVyLmNhbmNlbEFuaW1hdGlvbkZyYW1lKGlkKTtcbiAgICAgICAgICAgIHNjaGVkdWxlci5fc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QW5pbWF0aW9uRnJhbWVBY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcbmV4cG9ydCBjbGFzcyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciBleHRlbmRzIEFzeW5jU2NoZWR1bGVyIHtcbiAgICBmbHVzaChhY3Rpb24pIHtcbiAgICAgICAgdGhpcy5fYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgZmx1c2hJZCA9IHRoaXMuX3NjaGVkdWxlZDtcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVkID0gdW5kZWZpbmVkO1xuICAgICAgICBjb25zdCB7IGFjdGlvbnMgfSA9IHRoaXM7XG4gICAgICAgIGxldCBlcnJvcjtcbiAgICAgICAgYWN0aW9uID0gYWN0aW9uIHx8IGFjdGlvbnMuc2hpZnQoKTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaWYgKChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnNbMF0pICYmIGFjdGlvbi5pZCA9PT0gZmx1c2hJZCAmJiBhY3Rpb25zLnNoaWZ0KCkpO1xuICAgICAgICB0aGlzLl9hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnNbMF0pICYmIGFjdGlvbi5pZCA9PT0gZmx1c2hJZCAmJiBhY3Rpb25zLnNoaWZ0KCkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9QW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgQW5pbWF0aW9uRnJhbWVBY3Rpb24gfSBmcm9tICcuL0FuaW1hdGlvbkZyYW1lQWN0aW9uJztcbmltcG9ydCB7IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyIH0gZnJvbSAnLi9BbmltYXRpb25GcmFtZVNjaGVkdWxlcic7XG5leHBvcnQgY29uc3QgYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIgPSBuZXcgQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXIoQW5pbWF0aW9uRnJhbWVBY3Rpb24pO1xuZXhwb3J0IGNvbnN0IGFuaW1hdGlvbkZyYW1lID0gYW5pbWF0aW9uRnJhbWVTY2hlZHVsZXI7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmltYXRpb25GcmFtZS5qcy5tYXAiLCJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5leHBvcnQgY2xhc3MgVmlydHVhbFRpbWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG4gICAgY29uc3RydWN0b3Ioc2NoZWR1bGVyQWN0aW9uQ3RvciA9IFZpcnR1YWxBY3Rpb24sIG1heEZyYW1lcyA9IEluZmluaXR5KSB7XG4gICAgICAgIHN1cGVyKHNjaGVkdWxlckFjdGlvbkN0b3IsICgpID0+IHRoaXMuZnJhbWUpO1xuICAgICAgICB0aGlzLm1heEZyYW1lcyA9IG1heEZyYW1lcztcbiAgICAgICAgdGhpcy5mcmFtZSA9IDA7XG4gICAgICAgIHRoaXMuaW5kZXggPSAtMTtcbiAgICB9XG4gICAgZmx1c2goKSB7XG4gICAgICAgIGNvbnN0IHsgYWN0aW9ucywgbWF4RnJhbWVzIH0gPSB0aGlzO1xuICAgICAgICBsZXQgZXJyb3I7XG4gICAgICAgIGxldCBhY3Rpb247XG4gICAgICAgIHdoaWxlICgoYWN0aW9uID0gYWN0aW9uc1swXSkgJiYgYWN0aW9uLmRlbGF5IDw9IG1heEZyYW1lcykge1xuICAgICAgICAgICAgYWN0aW9ucy5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5mcmFtZSA9IGFjdGlvbi5kZWxheTtcbiAgICAgICAgICAgIGlmICgoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICB3aGlsZSAoKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkpIHtcbiAgICAgICAgICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICB9XG4gICAgfVxufVxuVmlydHVhbFRpbWVTY2hlZHVsZXIuZnJhbWVUaW1lRmFjdG9yID0gMTA7XG5leHBvcnQgY2xhc3MgVmlydHVhbEFjdGlvbiBleHRlbmRzIEFzeW5jQWN0aW9uIHtcbiAgICBjb25zdHJ1Y3RvcihzY2hlZHVsZXIsIHdvcmssIGluZGV4ID0gKHNjaGVkdWxlci5pbmRleCArPSAxKSkge1xuICAgICAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgICAgICB0aGlzLnNjaGVkdWxlciA9IHNjaGVkdWxlcjtcbiAgICAgICAgdGhpcy53b3JrID0gd29yaztcbiAgICAgICAgdGhpcy5pbmRleCA9IGluZGV4O1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgICAgIHRoaXMuaW5kZXggPSBzY2hlZHVsZXIuaW5kZXggPSBpbmRleDtcbiAgICB9XG4gICAgc2NoZWR1bGUoc3RhdGUsIGRlbGF5ID0gMCkge1xuICAgICAgICBpZiAoTnVtYmVyLmlzRmluaXRlKGRlbGF5KSkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgY29uc3QgYWN0aW9uID0gbmV3IFZpcnR1YWxBY3Rpb24odGhpcy5zY2hlZHVsZXIsIHRoaXMud29yayk7XG4gICAgICAgICAgICB0aGlzLmFkZChhY3Rpb24pO1xuICAgICAgICAgICAgcmV0dXJuIGFjdGlvbi5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgdGhpcy5kZWxheSA9IHNjaGVkdWxlci5mcmFtZSArIGRlbGF5O1xuICAgICAgICBjb25zdCB7IGFjdGlvbnMgfSA9IHNjaGVkdWxlcjtcbiAgICAgICAgYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgICAgICBhY3Rpb25zLnNvcnQoVmlydHVhbEFjdGlvbi5zb3J0QWN0aW9ucyk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSA9IDApIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KSB7XG4gICAgICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhdGljIHNvcnRBY3Rpb25zKGEsIGIpIHtcbiAgICAgICAgaWYgKGEuZGVsYXkgPT09IGIuZGVsYXkpIHtcbiAgICAgICAgICAgIGlmIChhLmluZGV4ID09PSBiLmluZGV4KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChhLmluZGV4ID4gYi5pbmRleCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGEuZGVsYXkgPiBiLmRlbGF5KSB7XG4gICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgfVxuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPVZpcnR1YWxUaW1lU2NoZWR1bGVyLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmV4cG9ydCBjb25zdCBFTVBUWSA9IG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpO1xuZXhwb3J0IGZ1bmN0aW9uIGVtcHR5KHNjaGVkdWxlcikge1xuICAgIHJldHVybiBzY2hlZHVsZXIgPyBlbXB0eVNjaGVkdWxlZChzY2hlZHVsZXIpIDogRU1QVFk7XG59XG5mdW5jdGlvbiBlbXB0eVNjaGVkdWxlZChzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVtcHR5LmpzLm1hcCIsImltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIGlzU2NoZWR1bGVyKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlICYmIGlzRnVuY3Rpb24odmFsdWUuc2NoZWR1bGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNTY2hlZHVsZXIuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4vaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4vaXNTY2hlZHVsZXInO1xuZnVuY3Rpb24gbGFzdChhcnIpIHtcbiAgICByZXR1cm4gYXJyW2Fyci5sZW5ndGggLSAxXTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwb3BSZXN1bHRTZWxlY3RvcihhcmdzKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24obGFzdChhcmdzKSkgPyBhcmdzLnBvcCgpIDogdW5kZWZpbmVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHBvcFNjaGVkdWxlcihhcmdzKSB7XG4gICAgcmV0dXJuIGlzU2NoZWR1bGVyKGxhc3QoYXJncykpID8gYXJncy5wb3AoKSA6IHVuZGVmaW5lZDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwb3BOdW1iZXIoYXJncywgZGVmYXVsdFZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBsYXN0KGFyZ3MpID09PSAnbnVtYmVyJyA/IGFyZ3MucG9wKCkgOiBkZWZhdWx0VmFsdWU7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcmdzLmpzLm1hcCIsIi8qISAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxyXG5Db3B5cmlnaHQgKGMpIE1pY3Jvc29mdCBDb3Jwb3JhdGlvbi5cclxuXHJcblBlcm1pc3Npb24gdG8gdXNlLCBjb3B5LCBtb2RpZnksIGFuZC9vciBkaXN0cmlidXRlIHRoaXMgc29mdHdhcmUgZm9yIGFueVxyXG5wdXJwb3NlIHdpdGggb3Igd2l0aG91dCBmZWUgaXMgaGVyZWJ5IGdyYW50ZWQuXHJcblxyXG5USEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiIEFORCBUSEUgQVVUSE9SIERJU0NMQUlNUyBBTEwgV0FSUkFOVElFUyBXSVRIXHJcblJFR0FSRCBUTyBUSElTIFNPRlRXQVJFIElOQ0xVRElORyBBTEwgSU1QTElFRCBXQVJSQU5USUVTIE9GIE1FUkNIQU5UQUJJTElUWVxyXG5BTkQgRklUTkVTUy4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUiBCRSBMSUFCTEUgRk9SIEFOWSBTUEVDSUFMLCBESVJFQ1QsXHJcbklORElSRUNULCBPUiBDT05TRVFVRU5USUFMIERBTUFHRVMgT1IgQU5ZIERBTUFHRVMgV0hBVFNPRVZFUiBSRVNVTFRJTkcgRlJPTVxyXG5MT1NTIE9GIFVTRSwgREFUQSBPUiBQUk9GSVRTLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgTkVHTElHRU5DRSBPUlxyXG5PVEhFUiBUT1JUSU9VUyBBQ1RJT04sIEFSSVNJTkcgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgVVNFIE9SXHJcblBFUkZPUk1BTkNFIE9GIFRISVMgU09GVFdBUkUuXHJcbioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqICovXHJcbi8qIGdsb2JhbCBSZWZsZWN0LCBQcm9taXNlICovXHJcblxyXG52YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uKGQsIGIpIHtcclxuICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcclxuICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XHJcbiAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcclxuICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZXh0ZW5kcyhkLCBiKSB7XHJcbiAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxyXG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcclxuICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2Fzc2lnbiA9IGZ1bmN0aW9uKCkge1xyXG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uIF9fYXNzaWduKHQpIHtcclxuICAgICAgICBmb3IgKHZhciBzLCBpID0gMSwgbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBuOyBpKyspIHtcclxuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKSB0W3BdID0gc1twXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fcmVzdChzLCBlKSB7XHJcbiAgICB2YXIgdCA9IHt9O1xyXG4gICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApICYmIGUuaW5kZXhPZihwKSA8IDApXHJcbiAgICAgICAgdFtwXSA9IHNbcF07XHJcbiAgICBpZiAocyAhPSBudWxsICYmIHR5cGVvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzID09PSBcImZ1bmN0aW9uXCIpXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIHAgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHMpOyBpIDwgcC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoZS5pbmRleE9mKHBbaV0pIDwgMCAmJiBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocywgcFtpXSkpXHJcbiAgICAgICAgICAgICAgICB0W3BbaV1dID0gc1twW2ldXTtcclxuICAgICAgICB9XHJcbiAgICByZXR1cm4gdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpIHtcclxuICAgIHZhciBjID0gYXJndW1lbnRzLmxlbmd0aCwgciA9IGMgPCAzID8gdGFyZ2V0IDogZGVzYyA9PT0gbnVsbCA/IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KSA6IGRlc2MsIGQ7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QuZGVjb3JhdGUgPT09IFwiZnVuY3Rpb25cIikgciA9IFJlZmxlY3QuZGVjb3JhdGUoZGVjb3JhdG9ycywgdGFyZ2V0LCBrZXksIGRlc2MpO1xyXG4gICAgZWxzZSBmb3IgKHZhciBpID0gZGVjb3JhdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkgaWYgKGQgPSBkZWNvcmF0b3JzW2ldKSByID0gKGMgPCAzID8gZChyKSA6IGMgPiAzID8gZCh0YXJnZXQsIGtleSwgcikgOiBkKHRhcmdldCwga2V5KSkgfHwgcjtcclxuICAgIHJldHVybiBjID4gMyAmJiByICYmIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgciksIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3BhcmFtKHBhcmFtSW5kZXgsIGRlY29yYXRvcikge1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQsIGtleSkgeyBkZWNvcmF0b3IodGFyZ2V0LCBrZXksIHBhcmFtSW5kZXgpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIFJlZmxlY3QgPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIFJlZmxlY3QubWV0YWRhdGEgPT09IFwiZnVuY3Rpb25cIikgcmV0dXJuIFJlZmxlY3QubWV0YWRhdGEobWV0YWRhdGFLZXksIG1ldGFkYXRhVmFsdWUpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdGVyKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xyXG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XHJcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcclxuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XHJcbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cclxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XHJcbiAgICB9KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fZ2VuZXJhdG9yKHRoaXNBcmcsIGJvZHkpIHtcclxuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XHJcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xyXG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcclxuICAgICAgICB3aGlsZSAoXykgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xyXG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XHJcbiAgICAgICAgICAgIHN3aXRjaCAob3BbMF0pIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNTogXy5sYWJlbCsrOyB5ID0gb3BbMV07IG9wID0gWzBdOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEodCA9IF8udHJ5cywgdCA9IHQubGVuZ3RoID4gMCAmJiB0W3QubGVuZ3RoIC0gMV0pICYmIChvcFswXSA9PT0gNiB8fCBvcFswXSA9PT0gMikpIHsgXyA9IDA7IGNvbnRpbnVlOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodCAmJiBfLmxhYmVsIDwgdFsyXSkgeyBfLmxhYmVsID0gdFsyXTsgXy5vcHMucHVzaChvcCk7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxyXG4gICAgICAgIGlmIChvcFswXSAmIDUpIHRocm93IG9wWzFdOyByZXR1cm4geyB2YWx1ZTogb3BbMF0gPyBvcFsxXSA6IHZvaWQgMCwgZG9uZTogdHJ1ZSB9O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgdmFyIF9fY3JlYXRlQmluZGluZyA9IE9iamVjdC5jcmVhdGUgPyAoZnVuY3Rpb24obywgbSwgaywgazIpIHtcclxuICAgIGlmIChrMiA9PT0gdW5kZWZpbmVkKSBrMiA9IGs7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgazIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBmdW5jdGlvbigpIHsgcmV0dXJuIG1ba107IH0gfSk7XHJcbn0pIDogKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgb1trMl0gPSBtW2tdO1xyXG59KTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4cG9ydFN0YXIobSwgbykge1xyXG4gICAgZm9yICh2YXIgcCBpbiBtKSBpZiAocCAhPT0gXCJkZWZhdWx0XCIgJiYgIU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvLCBwKSkgX19jcmVhdGVCaW5kaW5nKG8sIG0sIHApO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX192YWx1ZXMobykge1xyXG4gICAgdmFyIHMgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgU3ltYm9sLml0ZXJhdG9yLCBtID0gcyAmJiBvW3NdLCBpID0gMDtcclxuICAgIGlmIChtKSByZXR1cm4gbS5jYWxsKG8pO1xyXG4gICAgaWYgKG8gJiYgdHlwZW9mIG8ubGVuZ3RoID09PSBcIm51bWJlclwiKSByZXR1cm4ge1xyXG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKG8gJiYgaSA+PSBvLmxlbmd0aCkgbyA9IHZvaWQgMDtcclxuICAgICAgICAgICAgcmV0dXJuIHsgdmFsdWU6IG8gJiYgb1tpKytdLCBkb25lOiAhbyB9O1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHMgPyBcIk9iamVjdCBpcyBub3QgaXRlcmFibGUuXCIgOiBcIlN5bWJvbC5pdGVyYXRvciBpcyBub3QgZGVmaW5lZC5cIik7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3JlYWQobywgbikge1xyXG4gICAgdmFyIG0gPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb1tTeW1ib2wuaXRlcmF0b3JdO1xyXG4gICAgaWYgKCFtKSByZXR1cm4gbztcclxuICAgIHZhciBpID0gbS5jYWxsKG8pLCByLCBhciA9IFtdLCBlO1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB3aGlsZSAoKG4gPT09IHZvaWQgMCB8fCBuLS0gPiAwKSAmJiAhKHIgPSBpLm5leHQoKSkuZG9uZSkgYXIucHVzaChyLnZhbHVlKTtcclxuICAgIH1cclxuICAgIGNhdGNoIChlcnJvcikgeyBlID0geyBlcnJvcjogZXJyb3IgfTsgfVxyXG4gICAgZmluYWxseSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgaWYgKHIgJiYgIXIuZG9uZSAmJiAobSA9IGlbXCJyZXR1cm5cIl0pKSBtLmNhbGwoaSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZpbmFsbHkgeyBpZiAoZSkgdGhyb3cgZS5lcnJvcjsgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkKCkge1xyXG4gICAgZm9yICh2YXIgYXIgPSBbXSwgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspXHJcbiAgICAgICAgYXIgPSBhci5jb25jYXQoX19yZWFkKGFyZ3VtZW50c1tpXSkpO1xyXG4gICAgcmV0dXJuIGFyO1xyXG59XHJcblxyXG4vKiogQGRlcHJlY2F0ZWQgKi9cclxuZXhwb3J0IGZ1bmN0aW9uIF9fc3ByZWFkQXJyYXlzKCkge1xyXG4gICAgZm9yICh2YXIgcyA9IDAsIGkgPSAwLCBpbCA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBpbDsgaSsrKSBzICs9IGFyZ3VtZW50c1tpXS5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciByID0gQXJyYXkocyksIGsgPSAwLCBpID0gMDsgaSA8IGlsOyBpKyspXHJcbiAgICAgICAgZm9yICh2YXIgYSA9IGFyZ3VtZW50c1tpXSwgaiA9IDAsIGpsID0gYS5sZW5ndGg7IGogPCBqbDsgaisrLCBrKyspXHJcbiAgICAgICAgICAgIHJba10gPSBhW2pdO1xyXG4gICAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5KHRvLCBmcm9tLCBwYWNrKSB7XHJcbiAgICBpZiAocGFjayB8fCBhcmd1bWVudHMubGVuZ3RoID09PSAyKSBmb3IgKHZhciBpID0gMCwgbCA9IGZyb20ubGVuZ3RoLCBhcjsgaSA8IGw7IGkrKykge1xyXG4gICAgICAgIGlmIChhciB8fCAhKGkgaW4gZnJvbSkpIHtcclxuICAgICAgICAgICAgaWYgKCFhcikgYXIgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChmcm9tLCAwLCBpKTtcclxuICAgICAgICAgICAgYXJbaV0gPSBmcm9tW2ldO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0by5jb25jYXQoYXIgfHwgQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSkpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiZXhwb3J0IGNvbnN0IGlzQXJyYXlMaWtlID0gKCh4KSA9PiB4ICYmIHR5cGVvZiB4Lmxlbmd0aCA9PT0gJ251bWJlcicgJiYgdHlwZW9mIHggIT09ICdmdW5jdGlvbicpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNBcnJheUxpa2UuanMubWFwIiwiaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gXCIuL2lzRnVuY3Rpb25cIjtcbmV4cG9ydCBmdW5jdGlvbiBpc1Byb21pc2UodmFsdWUpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbih2YWx1ZSA9PT0gbnVsbCB8fCB2YWx1ZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogdmFsdWUudGhlbik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc1Byb21pc2UuanMubWFwIiwiaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIGlzSW50ZXJvcE9ic2VydmFibGUoaW5wdXQpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihpbnB1dFtTeW1ib2xfb2JzZXJ2YWJsZV0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNJbnRlcm9wT2JzZXJ2YWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBpc0FzeW5jSXRlcmFibGUob2JqKSB7XG4gICAgcmV0dXJuIFN5bWJvbC5hc3luY0l0ZXJhdG9yICYmIGlzRnVuY3Rpb24ob2JqID09PSBudWxsIHx8IG9iaiA9PT0gdm9pZCAwID8gdm9pZCAwIDogb2JqW1N5bWJvbC5hc3luY0l0ZXJhdG9yXSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0FzeW5jSXRlcmFibGUuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUludmFsaWRPYnNlcnZhYmxlVHlwZUVycm9yKGlucHV0KSB7XG4gICAgcmV0dXJuIG5ldyBUeXBlRXJyb3IoYFlvdSBwcm92aWRlZCAke2lucHV0ICE9PSBudWxsICYmIHR5cGVvZiBpbnB1dCA9PT0gJ29iamVjdCcgPyAnYW4gaW52YWxpZCBvYmplY3QnIDogYCcke2lucHV0fSdgfSB3aGVyZSBhIHN0cmVhbSB3YXMgZXhwZWN0ZWQuIFlvdSBjYW4gcHJvdmlkZSBhbiBPYnNlcnZhYmxlLCBQcm9taXNlLCBSZWFkYWJsZVN0cmVhbSwgQXJyYXksIEFzeW5jSXRlcmFibGUsIG9yIEl0ZXJhYmxlLmApO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGhyb3dVbm9ic2VydmFibGVFcnJvci5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gZ2V0U3ltYm9sSXRlcmF0b3IoKSB7XG4gICAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICdmdW5jdGlvbicgfHwgIVN5bWJvbC5pdGVyYXRvcikge1xuICAgICAgICByZXR1cm4gJ0BAaXRlcmF0b3InO1xuICAgIH1cbiAgICByZXR1cm4gU3ltYm9sLml0ZXJhdG9yO1xufVxuZXhwb3J0IGNvbnN0IGl0ZXJhdG9yID0gZ2V0U3ltYm9sSXRlcmF0b3IoKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWl0ZXJhdG9yLmpzLm1hcCIsImltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBpc0l0ZXJhYmxlKGlucHV0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24oaW5wdXQgPT09IG51bGwgfHwgaW5wdXQgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGlucHV0W1N5bWJvbF9pdGVyYXRvcl0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXNJdGVyYWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBfX2FzeW5jR2VuZXJhdG9yLCBfX2F3YWl0IH0gZnJvbSBcInRzbGliXCI7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiByZWFkYWJsZVN0cmVhbUxpa2VUb0FzeW5jR2VuZXJhdG9yKHJlYWRhYmxlU3RyZWFtKSB7XG4gICAgcmV0dXJuIF9fYXN5bmNHZW5lcmF0b3IodGhpcywgYXJndW1lbnRzLCBmdW5jdGlvbiogcmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvcl8xKCkge1xuICAgICAgICBjb25zdCByZWFkZXIgPSByZWFkYWJsZVN0cmVhbS5nZXRSZWFkZXIoKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyB2YWx1ZSwgZG9uZSB9ID0geWllbGQgX19hd2FpdChyZWFkZXIucmVhZCgpKTtcbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgX19hd2FpdCh2b2lkIDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB5aWVsZCB5aWVsZCBfX2F3YWl0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmaW5hbGx5IHtcbiAgICAgICAgICAgIHJlYWRlci5yZWxlYXNlTG9jaygpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNSZWFkYWJsZVN0cmVhbUxpa2Uob2JqKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24ob2JqID09PSBudWxsIHx8IG9iaiA9PT0gdm9pZCAwID8gdm9pZCAwIDogb2JqLmdldFJlYWRlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc1JlYWRhYmxlU3RyZWFtTGlrZS5qcy5tYXAiLCJpbXBvcnQgeyBfX2FzeW5jVmFsdWVzLCBfX2F3YWl0ZXIgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IGlzQXJyYXlMaWtlIH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5TGlrZSc7XG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuLi91dGlsL2lzUHJvbWlzZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0ludGVyb3BPYnNlcnZhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0ludGVyb3BPYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXN5bmNJdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvaXNBc3luY0l0ZXJhYmxlJztcbmltcG9ydCB7IGNyZWF0ZUludmFsaWRPYnNlcnZhYmxlVHlwZUVycm9yIH0gZnJvbSAnLi4vdXRpbC90aHJvd1Vub2JzZXJ2YWJsZUVycm9yJztcbmltcG9ydCB7IGlzSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL2lzSXRlcmFibGUnO1xuaW1wb3J0IHsgaXNSZWFkYWJsZVN0cmVhbUxpa2UsIHJlYWRhYmxlU3RyZWFtTGlrZVRvQXN5bmNHZW5lcmF0b3IgfSBmcm9tICcuLi91dGlsL2lzUmVhZGFibGVTdHJlYW1MaWtlJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgcmVwb3J0VW5oYW5kbGVkRXJyb3IgfSBmcm9tICcuLi91dGlsL3JlcG9ydFVuaGFuZGxlZEVycm9yJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gaW5uZXJGcm9tKGlucHV0KSB7XG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgICByZXR1cm4gaW5wdXQ7XG4gICAgfVxuICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChpc0ludGVyb3BPYnNlcnZhYmxlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21JbnRlcm9wT2JzZXJ2YWJsZShpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzQXJyYXlMaWtlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21BcnJheUxpa2UoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1Byb21pc2UoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnJvbVByb21pc2UoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0FzeW5jSXRlcmFibGUoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gZnJvbUFzeW5jSXRlcmFibGUoaW5wdXQpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc0l0ZXJhYmxlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21JdGVyYWJsZShpbnB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzUmVhZGFibGVTdHJlYW1MaWtlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZyb21SZWFkYWJsZVN0cmVhbUxpa2UoaW5wdXQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRocm93IGNyZWF0ZUludmFsaWRPYnNlcnZhYmxlVHlwZUVycm9yKGlucHV0KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmcm9tSW50ZXJvcE9ic2VydmFibGUob2JqKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IG9icyA9IG9ialtTeW1ib2xfb2JzZXJ2YWJsZV0oKTtcbiAgICAgICAgaWYgKGlzRnVuY3Rpb24ob2JzLnN1YnNjcmliZSkpIHtcbiAgICAgICAgICAgIHJldHVybiBvYnMuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICB9XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Byb3ZpZGVkIG9iamVjdCBkb2VzIG5vdCBjb3JyZWN0bHkgaW1wbGVtZW50IFN5bWJvbC5vYnNlcnZhYmxlJyk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbUFycmF5TGlrZShhcnJheSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aCAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfSk7XG59XG5leHBvcnQgZnVuY3Rpb24gZnJvbVByb21pc2UocHJvbWlzZSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBwcm9taXNlXG4gICAgICAgICAgICAudGhlbigodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKGVycikgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpKVxuICAgICAgICAgICAgLnRoZW4obnVsbCwgcmVwb3J0VW5oYW5kbGVkRXJyb3IpO1xuICAgIH0pO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGZyb21JdGVyYWJsZShpdGVyYWJsZSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBmb3IgKGNvbnN0IHZhbHVlIG9mIGl0ZXJhYmxlKSB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmcm9tQXN5bmNJdGVyYWJsZShhc3luY0l0ZXJhYmxlKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIHByb2Nlc3MoYXN5bmNJdGVyYWJsZSwgc3Vic2NyaWJlcikuY2F0Y2goKGVycikgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpKTtcbiAgICB9KTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUmVhZGFibGVTdHJlYW1MaWtlKHJlYWRhYmxlU3RyZWFtKSB7XG4gICAgcmV0dXJuIGZyb21Bc3luY0l0ZXJhYmxlKHJlYWRhYmxlU3RyZWFtTGlrZVRvQXN5bmNHZW5lcmF0b3IocmVhZGFibGVTdHJlYW0pKTtcbn1cbmZ1bmN0aW9uIHByb2Nlc3MoYXN5bmNJdGVyYWJsZSwgc3Vic2NyaWJlcikge1xuICAgIHZhciBhc3luY0l0ZXJhYmxlXzEsIGFzeW5jSXRlcmFibGVfMV8xO1xuICAgIHZhciBlXzEsIF9hO1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmb3IgKGFzeW5jSXRlcmFibGVfMSA9IF9fYXN5bmNWYWx1ZXMoYXN5bmNJdGVyYWJsZSk7IGFzeW5jSXRlcmFibGVfMV8xID0geWllbGQgYXN5bmNJdGVyYWJsZV8xLm5leHQoKSwgIWFzeW5jSXRlcmFibGVfMV8xLmRvbmU7KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBhc3luY0l0ZXJhYmxlXzFfMS52YWx1ZTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlXzFfMSkgeyBlXzEgPSB7IGVycm9yOiBlXzFfMSB9OyB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBpZiAoYXN5bmNJdGVyYWJsZV8xXzEgJiYgIWFzeW5jSXRlcmFibGVfMV8xLmRvbmUgJiYgKF9hID0gYXN5bmNJdGVyYWJsZV8xLnJldHVybikpIHlpZWxkIF9hLmNhbGwoYXN5bmNJdGVyYWJsZV8xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbmFsbHkgeyBpZiAoZV8xKSB0aHJvdyBlXzEuZXJyb3I7IH1cbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbm5lckZyb20uanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGV4ZWN1dGVTY2hlZHVsZShwYXJlbnRTdWJzY3JpcHRpb24sIHNjaGVkdWxlciwgd29yaywgZGVsYXkgPSAwLCByZXBlYXQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHNjaGVkdWxlU3Vic2NyaXB0aW9uID0gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgd29yaygpO1xuICAgICAgICBpZiAocmVwZWF0KSB7XG4gICAgICAgICAgICBwYXJlbnRTdWJzY3JpcHRpb24uYWRkKHRoaXMuc2NoZWR1bGUobnVsbCwgZGVsYXkpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfVxuICAgIH0sIGRlbGF5KTtcbiAgICBwYXJlbnRTdWJzY3JpcHRpb24uYWRkKHNjaGVkdWxlU3Vic2NyaXB0aW9uKTtcbiAgICBpZiAoIXJlcGVhdCkge1xuICAgICAgICByZXR1cm4gc2NoZWR1bGVTdWJzY3JpcHRpb247XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhlY3V0ZVNjaGVkdWxlLmpzLm1hcCIsImltcG9ydCB7IGV4ZWN1dGVTY2hlZHVsZSB9IGZyb20gJy4uL3V0aWwvZXhlY3V0ZVNjaGVkdWxlJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIG9ic2VydmVPbihzY2hlZHVsZXIsIGRlbGF5ID0gMCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4gZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgKCkgPT4gc3Vic2NyaWJlci5uZXh0KHZhbHVlKSwgZGVsYXkpLCAoKSA9PiBleGVjdXRlU2NoZWR1bGUoc3Vic2NyaWJlciwgc2NoZWR1bGVyLCAoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCksIGRlbGF5KSwgKGVycikgPT4gZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgKCkgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpLCBkZWxheSkpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9ic2VydmVPbi5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmVPbihzY2hlZHVsZXIsIGRlbGF5ID0gMCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgc3Vic2NyaWJlci5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlciksIGRlbGF5KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zdWJzY3JpYmVPbi5qcy5tYXAiLCJpbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBvYnNlcnZlT24gfSBmcm9tICcuLi9vcGVyYXRvcnMvb2JzZXJ2ZU9uJztcbmltcG9ydCB7IHN1YnNjcmliZU9uIH0gZnJvbSAnLi4vb3BlcmF0b3JzL3N1YnNjcmliZU9uJztcbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZU9ic2VydmFibGUoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBpbm5lckZyb20oaW5wdXQpLnBpcGUoc3Vic2NyaWJlT24oc2NoZWR1bGVyKSwgb2JzZXJ2ZU9uKHNjaGVkdWxlcikpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVPYnNlcnZhYmxlLmpzLm1hcCIsImltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IG9ic2VydmVPbiB9IGZyb20gJy4uL29wZXJhdG9ycy9vYnNlcnZlT24nO1xuaW1wb3J0IHsgc3Vic2NyaWJlT24gfSBmcm9tICcuLi9vcGVyYXRvcnMvc3Vic2NyaWJlT24nO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlUHJvbWlzZShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIGlubmVyRnJvbShpbnB1dCkucGlwZShzdWJzY3JpYmVPbihzY2hlZHVsZXIpLCBvYnNlcnZlT24oc2NoZWR1bGVyKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZVByb21pc2UuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlQXJyYXkoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKGkgPT09IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChpbnB1dFtpKytdKTtcbiAgICAgICAgICAgICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2NoZWR1bGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2NoZWR1bGVBcnJheS5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBleGVjdXRlU2NoZWR1bGUgfSBmcm9tICcuLi91dGlsL2V4ZWN1dGVTY2hlZHVsZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVJdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpdGVyYXRvcjtcbiAgICAgICAgZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgKCkgPT4ge1xuICAgICAgICAgICAgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2xfaXRlcmF0b3JdKCk7XG4gICAgICAgICAgICBleGVjdXRlU2NoZWR1bGUoc3Vic2NyaWJlciwgc2NoZWR1bGVyLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHZhbHVlO1xuICAgICAgICAgICAgICAgIGxldCBkb25lO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICh7IHZhbHVlLCBkb25lIH0gPSBpdGVyYXRvci5uZXh0KCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDAsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuICgpID0+IGlzRnVuY3Rpb24oaXRlcmF0b3IgPT09IG51bGwgfHwgaXRlcmF0b3IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGl0ZXJhdG9yLnJldHVybikgJiYgaXRlcmF0b3IucmV0dXJuKCk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZUl0ZXJhYmxlLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGV4ZWN1dGVTY2hlZHVsZSB9IGZyb20gJy4uL3V0aWwvZXhlY3V0ZVNjaGVkdWxlJztcbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZUFzeW5jSXRlcmFibGUoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIGlmICghaW5wdXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJdGVyYWJsZSBjYW5ub3QgYmUgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgaXRlcmF0b3IgPSBpbnB1dFtTeW1ib2wuYXN5bmNJdGVyYXRvcl0oKTtcbiAgICAgICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpdGVyYXRvci5uZXh0KCkudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHQuZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHJlc3VsdC52YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sIDAsIHRydWUpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNjaGVkdWxlQXN5bmNJdGVyYWJsZS5qcy5tYXAiLCJpbXBvcnQgeyBzY2hlZHVsZUFzeW5jSXRlcmFibGUgfSBmcm9tICcuL3NjaGVkdWxlQXN5bmNJdGVyYWJsZSc7XG5pbXBvcnQgeyByZWFkYWJsZVN0cmVhbUxpa2VUb0FzeW5jR2VuZXJhdG9yIH0gZnJvbSAnLi4vdXRpbC9pc1JlYWRhYmxlU3RyZWFtTGlrZSc7XG5leHBvcnQgZnVuY3Rpb24gc2NoZWR1bGVSZWFkYWJsZVN0cmVhbUxpa2UoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIHJldHVybiBzY2hlZHVsZUFzeW5jSXRlcmFibGUocmVhZGFibGVTdHJlYW1MaWtlVG9Bc3luY0dlbmVyYXRvcihpbnB1dCksIHNjaGVkdWxlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZVJlYWRhYmxlU3RyZWFtTGlrZS5qcy5tYXAiLCJpbXBvcnQgeyBzY2hlZHVsZU9ic2VydmFibGUgfSBmcm9tICcuL3NjaGVkdWxlT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzY2hlZHVsZVByb21pc2UgfSBmcm9tICcuL3NjaGVkdWxlUHJvbWlzZSc7XG5pbXBvcnQgeyBzY2hlZHVsZUFycmF5IH0gZnJvbSAnLi9zY2hlZHVsZUFycmF5JztcbmltcG9ydCB7IHNjaGVkdWxlSXRlcmFibGUgfSBmcm9tICcuL3NjaGVkdWxlSXRlcmFibGUnO1xuaW1wb3J0IHsgc2NoZWR1bGVBc3luY0l0ZXJhYmxlIH0gZnJvbSAnLi9zY2hlZHVsZUFzeW5jSXRlcmFibGUnO1xuaW1wb3J0IHsgaXNJbnRlcm9wT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJbnRlcm9wT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuLi91dGlsL2lzUHJvbWlzZSc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNJdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJdGVyYWJsZSc7XG5pbXBvcnQgeyBpc0FzeW5jSXRlcmFibGUgfSBmcm9tICcuLi91dGlsL2lzQXN5bmNJdGVyYWJsZSc7XG5pbXBvcnQgeyBjcmVhdGVJbnZhbGlkT2JzZXJ2YWJsZVR5cGVFcnJvciB9IGZyb20gJy4uL3V0aWwvdGhyb3dVbm9ic2VydmFibGVFcnJvcic7XG5pbXBvcnQgeyBpc1JlYWRhYmxlU3RyZWFtTGlrZSB9IGZyb20gJy4uL3V0aWwvaXNSZWFkYWJsZVN0cmVhbUxpa2UnO1xuaW1wb3J0IHsgc2NoZWR1bGVSZWFkYWJsZVN0cmVhbUxpa2UgfSBmcm9tICcuL3NjaGVkdWxlUmVhZGFibGVTdHJlYW1MaWtlJztcbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZWQoaW5wdXQsIHNjaGVkdWxlcikge1xuICAgIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgICAgIGlmIChpc0ludGVyb3BPYnNlcnZhYmxlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVkdWxlT2JzZXJ2YWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBcnJheUxpa2UoaW5wdXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gc2NoZWR1bGVBcnJheShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQcm9taXNlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVkdWxlUHJvbWlzZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNBc3luY0l0ZXJhYmxlKGlucHV0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHNjaGVkdWxlQXN5bmNJdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNJdGVyYWJsZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZUl0ZXJhYmxlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc1JlYWRhYmxlU3RyZWFtTGlrZShpbnB1dCkpIHtcbiAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZVJlYWRhYmxlU3RyZWFtTGlrZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICB0aHJvdyBjcmVhdGVJbnZhbGlkT2JzZXJ2YWJsZVR5cGVFcnJvcihpbnB1dCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2hlZHVsZWQuanMubWFwIiwiaW1wb3J0IHsgc2NoZWR1bGVkIH0gZnJvbSAnLi4vc2NoZWR1bGVkL3NjaGVkdWxlZCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuL2lubmVyRnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gZnJvbShpbnB1dCwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIHNjaGVkdWxlciA/IHNjaGVkdWxlZChpbnB1dCwgc2NoZWR1bGVyKSA6IGlubmVyRnJvbShpbnB1dCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mcm9tLmpzLm1hcCIsImltcG9ydCB7IHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBvZiguLi5hcmdzKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gcG9wU2NoZWR1bGVyKGFyZ3MpO1xuICAgIHJldHVybiBmcm9tKGFyZ3MsIHNjaGVkdWxlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vZi5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiB0aHJvd0Vycm9yKGVycm9yT3JFcnJvckZhY3RvcnksIHNjaGVkdWxlcikge1xuICAgIGNvbnN0IGVycm9yRmFjdG9yeSA9IGlzRnVuY3Rpb24oZXJyb3JPckVycm9yRmFjdG9yeSkgPyBlcnJvck9yRXJyb3JGYWN0b3J5IDogKCkgPT4gZXJyb3JPckVycm9yRmFjdG9yeTtcbiAgICBjb25zdCBpbml0ID0gKHN1YnNjcmliZXIpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyb3JGYWN0b3J5KCkpO1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzY2hlZHVsZXIgPyAoc3Vic2NyaWJlcikgPT4gc2NoZWR1bGVyLnNjaGVkdWxlKGluaXQsIDAsIHN1YnNjcmliZXIpIDogaW5pdCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHJvd0Vycm9yLmpzLm1hcCIsImltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IG9mIH0gZnJvbSAnLi9vYnNlcnZhYmxlL29mJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi91dGlsL2lzRnVuY3Rpb24nO1xuZXhwb3J0IHZhciBOb3RpZmljYXRpb25LaW5kO1xuKGZ1bmN0aW9uIChOb3RpZmljYXRpb25LaW5kKSB7XG4gICAgTm90aWZpY2F0aW9uS2luZFtcIk5FWFRcIl0gPSBcIk5cIjtcbiAgICBOb3RpZmljYXRpb25LaW5kW1wiRVJST1JcIl0gPSBcIkVcIjtcbiAgICBOb3RpZmljYXRpb25LaW5kW1wiQ09NUExFVEVcIl0gPSBcIkNcIjtcbn0pKE5vdGlmaWNhdGlvbktpbmQgfHwgKE5vdGlmaWNhdGlvbktpbmQgPSB7fSkpO1xuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbiB7XG4gICAgY29uc3RydWN0b3Ioa2luZCwgdmFsdWUsIGVycm9yKSB7XG4gICAgICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5lcnJvciA9IGVycm9yO1xuICAgICAgICB0aGlzLmhhc1ZhbHVlID0ga2luZCA9PT0gJ04nO1xuICAgIH1cbiAgICBvYnNlcnZlKG9ic2VydmVyKSB7XG4gICAgICAgIHJldHVybiBvYnNlcnZlTm90aWZpY2F0aW9uKHRoaXMsIG9ic2VydmVyKTtcbiAgICB9XG4gICAgZG8obmV4dEhhbmRsZXIsIGVycm9ySGFuZGxlciwgY29tcGxldGVIYW5kbGVyKSB7XG4gICAgICAgIGNvbnN0IHsga2luZCwgdmFsdWUsIGVycm9yIH0gPSB0aGlzO1xuICAgICAgICByZXR1cm4ga2luZCA9PT0gJ04nID8gbmV4dEhhbmRsZXIgPT09IG51bGwgfHwgbmV4dEhhbmRsZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5leHRIYW5kbGVyKHZhbHVlKSA6IGtpbmQgPT09ICdFJyA/IGVycm9ySGFuZGxlciA9PT0gbnVsbCB8fCBlcnJvckhhbmRsZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGVycm9ySGFuZGxlcihlcnJvcikgOiBjb21wbGV0ZUhhbmRsZXIgPT09IG51bGwgfHwgY29tcGxldGVIYW5kbGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb21wbGV0ZUhhbmRsZXIoKTtcbiAgICB9XG4gICAgYWNjZXB0KG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpIHtcbiAgICAgICAgdmFyIF9hO1xuICAgICAgICByZXR1cm4gaXNGdW5jdGlvbigoX2EgPSBuZXh0T3JPYnNlcnZlcikgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLm5leHQpXG4gICAgICAgICAgICA/IHRoaXMub2JzZXJ2ZShuZXh0T3JPYnNlcnZlcilcbiAgICAgICAgICAgIDogdGhpcy5kbyhuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICB9XG4gICAgdG9PYnNlcnZhYmxlKCkge1xuICAgICAgICBjb25zdCB7IGtpbmQsIHZhbHVlLCBlcnJvciB9ID0gdGhpcztcbiAgICAgICAgY29uc3QgcmVzdWx0ID0ga2luZCA9PT0gJ04nXG4gICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgb2YodmFsdWUpXG4gICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAga2luZCA9PT0gJ0UnXG4gICAgICAgICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93RXJyb3IoKCkgPT4gZXJyb3IpXG4gICAgICAgICAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGtpbmQgPT09ICdDJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRU1QVFlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDA7XG4gICAgICAgIGlmICghcmVzdWx0KSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKGBVbmV4cGVjdGVkIG5vdGlmaWNhdGlvbiBraW5kICR7a2luZH1gKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICBzdGF0aWMgY3JlYXRlTmV4dCh2YWx1ZSkge1xuICAgICAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbignTicsIHZhbHVlKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZUVycm9yKGVycikge1xuICAgICAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbignRScsIHVuZGVmaW5lZCwgZXJyKTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZUNvbXBsZXRlKCkge1xuICAgICAgICByZXR1cm4gTm90aWZpY2F0aW9uLmNvbXBsZXRlTm90aWZpY2F0aW9uO1xuICAgIH1cbn1cbk5vdGlmaWNhdGlvbi5jb21wbGV0ZU5vdGlmaWNhdGlvbiA9IG5ldyBOb3RpZmljYXRpb24oJ0MnKTtcbmV4cG9ydCBmdW5jdGlvbiBvYnNlcnZlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbiwgb2JzZXJ2ZXIpIHtcbiAgICB2YXIgX2EsIF9iLCBfYztcbiAgICBjb25zdCB7IGtpbmQsIHZhbHVlLCBlcnJvciB9ID0gbm90aWZpY2F0aW9uO1xuICAgIGlmICh0eXBlb2Yga2luZCAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBub3RpZmljYXRpb24sIG1pc3NpbmcgXCJraW5kXCInKTtcbiAgICB9XG4gICAga2luZCA9PT0gJ04nID8gKF9hID0gb2JzZXJ2ZXIubmV4dCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwob2JzZXJ2ZXIsIHZhbHVlKSA6IGtpbmQgPT09ICdFJyA/IChfYiA9IG9ic2VydmVyLmVycm9yKSA9PT0gbnVsbCB8fCBfYiA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2IuY2FsbChvYnNlcnZlciwgZXJyb3IpIDogKF9jID0gb2JzZXJ2ZXIuY29tcGxldGUpID09PSBudWxsIHx8IF9jID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYy5jYWxsKG9ic2VydmVyKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vdGlmaWNhdGlvbi5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBpc09ic2VydmFibGUob2JqKSB7XG4gICAgcmV0dXJuICEhb2JqICYmIChvYmogaW5zdGFuY2VvZiBPYnNlcnZhYmxlIHx8IChpc0Z1bmN0aW9uKG9iai5saWZ0KSAmJiBpc0Z1bmN0aW9uKG9iai5zdWJzY3JpYmUpKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc09ic2VydmFibGUuanMubWFwIiwiaW1wb3J0IHsgY3JlYXRlRXJyb3JDbGFzcyB9IGZyb20gJy4vY3JlYXRlRXJyb3JDbGFzcyc7XG5leHBvcnQgY29uc3QgRW1wdHlFcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoKF9zdXBlcikgPT4gZnVuY3Rpb24gRW1wdHlFcnJvckltcGwoKSB7XG4gICAgX3N1cGVyKHRoaXMpO1xuICAgIHRoaXMubmFtZSA9ICdFbXB0eUVycm9yJztcbiAgICB0aGlzLm1lc3NhZ2UgPSAnbm8gZWxlbWVudHMgaW4gc2VxdWVuY2UnO1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1FbXB0eUVycm9yLmpzLm1hcCIsImltcG9ydCB7IEVtcHR5RXJyb3IgfSBmcm9tICcuL3V0aWwvRW1wdHlFcnJvcic7XG5leHBvcnQgZnVuY3Rpb24gbGFzdFZhbHVlRnJvbShzb3VyY2UsIGNvbmZpZykge1xuICAgIGNvbnN0IGhhc0NvbmZpZyA9IHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBfaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgbGV0IF92YWx1ZTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZSh7XG4gICAgICAgICAgICBuZXh0OiAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBfdmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBfaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiByZWplY3QsXG4gICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChfaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShfdmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChoYXNDb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb25maWcuZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRW1wdHlFcnJvcigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxhc3RWYWx1ZUZyb20uanMubWFwIiwiaW1wb3J0IHsgRW1wdHlFcnJvciB9IGZyb20gJy4vdXRpbC9FbXB0eUVycm9yJztcbmltcG9ydCB7IFNhZmVTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBmaXJzdFZhbHVlRnJvbShzb3VyY2UsIGNvbmZpZykge1xuICAgIGNvbnN0IGhhc0NvbmZpZyA9IHR5cGVvZiBjb25maWcgPT09ICdvYmplY3QnO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZXIgPSBuZXcgU2FmZVN1YnNjcmliZXIoe1xuICAgICAgICAgICAgbmV4dDogKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGVycm9yOiByZWplY3QsXG4gICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChoYXNDb25maWcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShjb25maWcuZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChuZXcgRW1wdHlFcnJvcigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpcnN0VmFsdWVGcm9tLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yID0gY3JlYXRlRXJyb3JDbGFzcygoX3N1cGVyKSA9PiBmdW5jdGlvbiBBcmd1bWVudE91dE9mUmFuZ2VFcnJvckltcGwoKSB7XG4gICAgX3N1cGVyKHRoaXMpO1xuICAgIHRoaXMubmFtZSA9ICdBcmd1bWVudE91dE9mUmFuZ2VFcnJvcic7XG4gICAgdGhpcy5tZXNzYWdlID0gJ2FyZ3VtZW50IG91dCBvZiByYW5nZSc7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPUFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yLmpzLm1hcCIsImltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IE5vdEZvdW5kRXJyb3IgPSBjcmVhdGVFcnJvckNsYXNzKChfc3VwZXIpID0+IGZ1bmN0aW9uIE5vdEZvdW5kRXJyb3JJbXBsKG1lc3NhZ2UpIHtcbiAgICBfc3VwZXIodGhpcyk7XG4gICAgdGhpcy5uYW1lID0gJ05vdEZvdW5kRXJyb3InO1xuICAgIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG59KTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vdEZvdW5kRXJyb3IuanMubWFwIiwiaW1wb3J0IHsgY3JlYXRlRXJyb3JDbGFzcyB9IGZyb20gJy4vY3JlYXRlRXJyb3JDbGFzcyc7XG5leHBvcnQgY29uc3QgU2VxdWVuY2VFcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoKF9zdXBlcikgPT4gZnVuY3Rpb24gU2VxdWVuY2VFcnJvckltcGwobWVzc2FnZSkge1xuICAgIF9zdXBlcih0aGlzKTtcbiAgICB0aGlzLm5hbWUgPSAnU2VxdWVuY2VFcnJvcic7XG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbn0pO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9U2VxdWVuY2VFcnJvci5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gaXNWYWxpZERhdGUodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmICFpc05hTih2YWx1ZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0RhdGUuanMubWFwIiwiaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNWYWxpZERhdGUgfSBmcm9tICcuLi91dGlsL2lzRGF0ZSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuLi91dGlsL2NyZWF0ZUVycm9yQ2xhc3MnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgZXhlY3V0ZVNjaGVkdWxlIH0gZnJvbSAnLi4vdXRpbC9leGVjdXRlU2NoZWR1bGUnO1xuZXhwb3J0IGNvbnN0IFRpbWVvdXRFcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoKF9zdXBlcikgPT4gZnVuY3Rpb24gVGltZW91dEVycm9ySW1wbChpbmZvID0gbnVsbCkge1xuICAgIF9zdXBlcih0aGlzKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSAnVGltZW91dCBoYXMgb2NjdXJyZWQnO1xuICAgIHRoaXMubmFtZSA9ICdUaW1lb3V0RXJyb3InO1xuICAgIHRoaXMuaW5mbyA9IGluZm87XG59KTtcbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0KGNvbmZpZywgc2NoZWR1bGVyQXJnKSB7XG4gICAgY29uc3QgeyBmaXJzdCwgZWFjaCwgd2l0aDogX3dpdGggPSB0aW1lb3V0RXJyb3JGYWN0b3J5LCBzY2hlZHVsZXIgPSBzY2hlZHVsZXJBcmcgIT09IG51bGwgJiYgc2NoZWR1bGVyQXJnICE9PSB2b2lkIDAgPyBzY2hlZHVsZXJBcmcgOiBhc3luY1NjaGVkdWxlciwgbWV0YSA9IG51bGwgfSA9IChpc1ZhbGlkRGF0ZShjb25maWcpXG4gICAgICAgID8geyBmaXJzdDogY29uZmlnIH1cbiAgICAgICAgOiB0eXBlb2YgY29uZmlnID09PSAnbnVtYmVyJ1xuICAgICAgICAgICAgPyB7IGVhY2g6IGNvbmZpZyB9XG4gICAgICAgICAgICA6IGNvbmZpZyk7XG4gICAgaWYgKGZpcnN0ID09IG51bGwgJiYgZWFjaCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIHRpbWVvdXQgcHJvdmlkZWQuJyk7XG4gICAgfVxuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IG9yaWdpbmFsU291cmNlU3Vic2NyaXB0aW9uO1xuICAgICAgICBsZXQgdGltZXJTdWJzY3JpcHRpb247XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICBsZXQgc2VlbiA9IDA7XG4gICAgICAgIGNvbnN0IHN0YXJ0VGltZXIgPSAoZGVsYXkpID0+IHtcbiAgICAgICAgICAgIHRpbWVyU3Vic2NyaXB0aW9uID0gZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIHNjaGVkdWxlciwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbmFsU291cmNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyRnJvbShfd2l0aCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRhLFxuICAgICAgICAgICAgICAgICAgICAgICAgbGFzdFZhbHVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VlbixcbiAgICAgICAgICAgICAgICAgICAgfSkpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgZGVsYXkpO1xuICAgICAgICB9O1xuICAgICAgICBvcmlnaW5hbFNvdXJjZVN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIHRpbWVyU3Vic2NyaXB0aW9uID09PSBudWxsIHx8IHRpbWVyU3Vic2NyaXB0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0aW1lclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgc2VlbisrO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KChsYXN0VmFsdWUgPSB2YWx1ZSkpO1xuICAgICAgICAgICAgZWFjaCA+IDAgJiYgc3RhcnRUaW1lcihlYWNoKTtcbiAgICAgICAgfSwgdW5kZWZpbmVkLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgIGlmICghKHRpbWVyU3Vic2NyaXB0aW9uID09PSBudWxsIHx8IHRpbWVyU3Vic2NyaXB0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiB0aW1lclN1YnNjcmlwdGlvbi5jbG9zZWQpKSB7XG4gICAgICAgICAgICAgICAgdGltZXJTdWJzY3JpcHRpb24gPT09IG51bGwgfHwgdGltZXJTdWJzY3JpcHRpb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IHRpbWVyU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICB9KSk7XG4gICAgICAgIHN0YXJ0VGltZXIoZmlyc3QgIT0gbnVsbCA/ICh0eXBlb2YgZmlyc3QgPT09ICdudW1iZXInID8gZmlyc3QgOiArZmlyc3QgLSBzY2hlZHVsZXIubm93KCkpIDogZWFjaCk7XG4gICAgfSk7XG59XG5mdW5jdGlvbiB0aW1lb3V0RXJyb3JGYWN0b3J5KGluZm8pIHtcbiAgICB0aHJvdyBuZXcgVGltZW91dEVycm9yKGluZm8pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZW91dC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBtYXAocHJvamVjdCwgdGhpc0FyZykge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHByb2plY3QuY2FsbCh0aGlzQXJnLCB2YWx1ZSwgaW5kZXgrKykpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXAuanMubWFwIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSBcIi4uL29wZXJhdG9ycy9tYXBcIjtcbmNvbnN0IHsgaXNBcnJheSB9ID0gQXJyYXk7XG5mdW5jdGlvbiBjYWxsT3JBcHBseShmbiwgYXJncykge1xuICAgIHJldHVybiBpc0FycmF5KGFyZ3MpID8gZm4oLi4uYXJncykgOiBmbihhcmdzKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBtYXBPbmVPck1hbnlBcmdzKGZuKSB7XG4gICAgcmV0dXJuIG1hcChhcmdzID0+IGNhbGxPckFwcGx5KGZuLCBhcmdzKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXBPbmVPck1hbnlBcmdzLmpzLm1hcCIsImltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVPbiB9IGZyb20gJy4uL29wZXJhdG9ycy9zdWJzY3JpYmVPbic7XG5pbXBvcnQgeyBtYXBPbmVPck1hbnlBcmdzIH0gZnJvbSAnLi4vdXRpbC9tYXBPbmVPck1hbnlBcmdzJztcbmltcG9ydCB7IG9ic2VydmVPbiB9IGZyb20gJy4uL29wZXJhdG9ycy9vYnNlcnZlT24nO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi4vQXN5bmNTdWJqZWN0JztcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2tJbnRlcm5hbHMoaXNOb2RlU3R5bGUsIGNhbGxiYWNrRnVuYywgcmVzdWx0U2VsZWN0b3IsIHNjaGVkdWxlcikge1xuICAgIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgICAgICBpZiAoaXNTY2hlZHVsZXIocmVzdWx0U2VsZWN0b3IpKSB7XG4gICAgICAgICAgICBzY2hlZHVsZXIgPSByZXN1bHRTZWxlY3RvcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgICAgIHJldHVybiBiaW5kQ2FsbGJhY2tJbnRlcm5hbHMoaXNOb2RlU3R5bGUsIGNhbGxiYWNrRnVuYywgc2NoZWR1bGVyKVxuICAgICAgICAgICAgICAgICAgICAuYXBwbHkodGhpcywgYXJncylcbiAgICAgICAgICAgICAgICAgICAgLnBpcGUobWFwT25lT3JNYW55QXJncyhyZXN1bHRTZWxlY3RvcikpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoc2NoZWR1bGVyKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoLi4uYXJncykge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRDYWxsYmFja0ludGVybmFscyhpc05vZGVTdHlsZSwgY2FsbGJhY2tGdW5jKVxuICAgICAgICAgICAgICAgIC5hcHBseSh0aGlzLCBhcmdzKVxuICAgICAgICAgICAgICAgIC5waXBlKHN1YnNjcmliZU9uKHNjaGVkdWxlciksIG9ic2VydmVPbihzY2hlZHVsZXIpKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGZ1bmN0aW9uICguLi5hcmdzKSB7XG4gICAgICAgIGNvbnN0IHN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0KCk7XG4gICAgICAgIGxldCB1bmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBzdWJzID0gc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgICAgICBpZiAodW5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgICAgIHVuaW5pdGlhbGl6ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBsZXQgaXNBc3luYyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGxldCBpc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KHRoaXMsIFtcbiAgICAgICAgICAgICAgICAgICAgLi4uYXJncyxcbiAgICAgICAgICAgICAgICAgICAgKC4uLnJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc05vZGVTdHlsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGVyciA9IHJlc3VsdHMuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZXJyICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3ViamVjdC5uZXh0KDEgPCByZXN1bHRzLmxlbmd0aCA/IHJlc3VsdHMgOiByZXN1bHRzWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzQXN5bmMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgXSk7XG4gICAgICAgICAgICAgICAgaWYgKGlzQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpc0FzeW5jID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzdWJzO1xuICAgICAgICB9KTtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YmluZENhbGxiYWNrSW50ZXJuYWxzLmpzLm1hcCIsImltcG9ydCB7IGJpbmRDYWxsYmFja0ludGVybmFscyB9IGZyb20gJy4vYmluZENhbGxiYWNrSW50ZXJuYWxzJztcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jLCByZXN1bHRTZWxlY3Rvciwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIGJpbmRDYWxsYmFja0ludGVybmFscyhmYWxzZSwgY2FsbGJhY2tGdW5jLCByZXN1bHRTZWxlY3Rvciwgc2NoZWR1bGVyKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJpbmRDYWxsYmFjay5qcy5tYXAiLCJpbXBvcnQgeyBiaW5kQ2FsbGJhY2tJbnRlcm5hbHMgfSBmcm9tICcuL2JpbmRDYWxsYmFja0ludGVybmFscyc7XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmMsIHJlc3VsdFNlbGVjdG9yLCBzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gYmluZENhbGxiYWNrSW50ZXJuYWxzKHRydWUsIGNhbGxiYWNrRnVuYywgcmVzdWx0U2VsZWN0b3IsIHNjaGVkdWxlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1iaW5kTm9kZUNhbGxiYWNrLmpzLm1hcCIsImNvbnN0IHsgaXNBcnJheSB9ID0gQXJyYXk7XG5jb25zdCB7IGdldFByb3RvdHlwZU9mLCBwcm90b3R5cGU6IG9iamVjdFByb3RvLCBrZXlzOiBnZXRLZXlzIH0gPSBPYmplY3Q7XG5leHBvcnQgZnVuY3Rpb24gYXJnc0FyZ0FycmF5T3JPYmplY3QoYXJncykge1xuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCBmaXJzdCA9IGFyZ3NbMF07XG4gICAgICAgIGlmIChpc0FycmF5KGZpcnN0KSkge1xuICAgICAgICAgICAgcmV0dXJuIHsgYXJnczogZmlyc3QsIGtleXM6IG51bGwgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNQT0pPKGZpcnN0KSkge1xuICAgICAgICAgICAgY29uc3Qga2V5cyA9IGdldEtleXMoZmlyc3QpO1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBhcmdzOiBrZXlzLm1hcCgoa2V5KSA9PiBmaXJzdFtrZXldKSxcbiAgICAgICAgICAgICAgICBrZXlzLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4geyBhcmdzOiBhcmdzLCBrZXlzOiBudWxsIH07XG59XG5mdW5jdGlvbiBpc1BPSk8ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiAmJiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBnZXRQcm90b3R5cGVPZihvYmopID09PSBvYmplY3RQcm90bztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFyZ3NBcmdBcnJheU9yT2JqZWN0LmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjcmVhdGVPYmplY3Qoa2V5cywgdmFsdWVzKSB7XG4gICAgcmV0dXJuIGtleXMucmVkdWNlKChyZXN1bHQsIGtleSwgaSkgPT4gKChyZXN1bHRba2V5XSA9IHZhbHVlc1tpXSksIHJlc3VsdCksIHt9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNyZWF0ZU9iamVjdC5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBhcmdzQXJnQXJyYXlPck9iamVjdCB9IGZyb20gJy4uL3V0aWwvYXJnc0FyZ0FycmF5T3JPYmplY3QnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuaW1wb3J0IHsgbWFwT25lT3JNYW55QXJncyB9IGZyb20gJy4uL3V0aWwvbWFwT25lT3JNYW55QXJncyc7XG5pbXBvcnQgeyBwb3BSZXN1bHRTZWxlY3RvciwgcG9wU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9hcmdzJztcbmltcG9ydCB7IGNyZWF0ZU9iamVjdCB9IGZyb20gJy4uL3V0aWwvY3JlYXRlT2JqZWN0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4uL29wZXJhdG9ycy9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgZXhlY3V0ZVNjaGVkdWxlIH0gZnJvbSAnLi4vdXRpbC9leGVjdXRlU2NoZWR1bGUnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3QoLi4uYXJncykge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHBvcFNjaGVkdWxlcihhcmdzKTtcbiAgICBjb25zdCByZXN1bHRTZWxlY3RvciA9IHBvcFJlc3VsdFNlbGVjdG9yKGFyZ3MpO1xuICAgIGNvbnN0IHsgYXJnczogb2JzZXJ2YWJsZXMsIGtleXMgfSA9IGFyZ3NBcmdBcnJheU9yT2JqZWN0KGFyZ3MpO1xuICAgIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIGZyb20oW10sIHNjaGVkdWxlcik7XG4gICAgfVxuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBPYnNlcnZhYmxlKGNvbWJpbmVMYXRlc3RJbml0KG9ic2VydmFibGVzLCBzY2hlZHVsZXIsIGtleXNcbiAgICAgICAgP1xuICAgICAgICAgICAgKHZhbHVlcykgPT4gY3JlYXRlT2JqZWN0KGtleXMsIHZhbHVlcylcbiAgICAgICAgOlxuICAgICAgICAgICAgaWRlbnRpdHkpKTtcbiAgICByZXR1cm4gcmVzdWx0U2VsZWN0b3IgPyByZXN1bHQucGlwZShtYXBPbmVPck1hbnlBcmdzKHJlc3VsdFNlbGVjdG9yKSkgOiByZXN1bHQ7XG59XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdEluaXQob2JzZXJ2YWJsZXMsIHNjaGVkdWxlciwgdmFsdWVUcmFuc2Zvcm0gPSBpZGVudGl0eSkge1xuICAgIHJldHVybiAoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBtYXliZVNjaGVkdWxlKHNjaGVkdWxlciwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBsZW5ndGggfSA9IG9ic2VydmFibGVzO1xuICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gbmV3IEFycmF5KGxlbmd0aCk7XG4gICAgICAgICAgICBsZXQgYWN0aXZlID0gbGVuZ3RoO1xuICAgICAgICAgICAgbGV0IHJlbWFpbmluZ0ZpcnN0VmFsdWVzID0gbGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIG1heWJlU2NoZWR1bGUoc2NoZWR1bGVyLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHNvdXJjZSA9IGZyb20ob2JzZXJ2YWJsZXNbaV0sIHNjaGVkdWxlcik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBoYXNGaXJzdFZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFoYXNGaXJzdFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzRmlyc3RWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtYWluaW5nRmlyc3RWYWx1ZXMtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghcmVtYWluaW5nRmlyc3RWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWVUcmFuc2Zvcm0odmFsdWVzLnNsaWNlKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCEtLWFjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH0sIHN1YnNjcmliZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBzdWJzY3JpYmVyKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gbWF5YmVTY2hlZHVsZShzY2hlZHVsZXIsIGV4ZWN1dGUsIHN1YnNjcmlwdGlvbikge1xuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgICAgZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmlwdGlvbiwgc2NoZWR1bGVyLCBleGVjdXRlKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGV4ZWN1dGUoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb21iaW5lTGF0ZXN0LmpzLm1hcCIsImltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IGV4ZWN1dGVTY2hlZHVsZSB9IGZyb20gJy4uL3V0aWwvZXhlY3V0ZVNjaGVkdWxlJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUludGVybmFscyhzb3VyY2UsIHN1YnNjcmliZXIsIHByb2plY3QsIGNvbmN1cnJlbnQsIG9uQmVmb3JlTmV4dCwgZXhwYW5kLCBpbm5lclN1YlNjaGVkdWxlciwgYWRkaXRpb25hbFRlYXJkb3duKSB7XG4gICAgY29uc3QgYnVmZmVyID0gW107XG4gICAgbGV0IGFjdGl2ZSA9IDA7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgaXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgIGNvbnN0IGNoZWNrQ29tcGxldGUgPSAoKSA9PiB7XG4gICAgICAgIGlmIChpc0NvbXBsZXRlICYmICFidWZmZXIubGVuZ3RoICYmICFhY3RpdmUpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgY29uc3Qgb3V0ZXJOZXh0ID0gKHZhbHVlKSA9PiAoYWN0aXZlIDwgY29uY3VycmVudCA/IGRvSW5uZXJTdWIodmFsdWUpIDogYnVmZmVyLnB1c2godmFsdWUpKTtcbiAgICBjb25zdCBkb0lubmVyU3ViID0gKHZhbHVlKSA9PiB7XG4gICAgICAgIGV4cGFuZCAmJiBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICBhY3RpdmUrKztcbiAgICAgICAgbGV0IGlubmVyQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgaW5uZXJGcm9tKHByb2plY3QodmFsdWUsIGluZGV4KyspKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoaW5uZXJWYWx1ZSkgPT4ge1xuICAgICAgICAgICAgb25CZWZvcmVOZXh0ID09PSBudWxsIHx8IG9uQmVmb3JlTmV4dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogb25CZWZvcmVOZXh0KGlubmVyVmFsdWUpO1xuICAgICAgICAgICAgaWYgKGV4cGFuZCkge1xuICAgICAgICAgICAgICAgIG91dGVyTmV4dChpbm5lclZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChpbm5lclZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgaW5uZXJDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIH0sIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlubmVyQ29tcGxldGUpIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBhY3RpdmUtLTtcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKGJ1ZmZlci5sZW5ndGggJiYgYWN0aXZlIDwgY29uY3VycmVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgYnVmZmVyZWRWYWx1ZSA9IGJ1ZmZlci5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlubmVyU3ViU2NoZWR1bGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXhlY3V0ZVNjaGVkdWxlKHN1YnNjcmliZXIsIGlubmVyU3ViU2NoZWR1bGVyLCAoKSA9PiBkb0lubmVyU3ViKGJ1ZmZlcmVkVmFsdWUpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRvSW5uZXJTdWIoYnVmZmVyZWRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2hlY2tDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9O1xuICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBvdXRlck5leHQsICgpID0+IHtcbiAgICAgICAgaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgIGNoZWNrQ29tcGxldGUoKTtcbiAgICB9KSk7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgYWRkaXRpb25hbFRlYXJkb3duID09PSBudWxsIHx8IGFkZGl0aW9uYWxUZWFyZG93biA9PT0gdm9pZCAwID8gdm9pZCAwIDogYWRkaXRpb25hbFRlYXJkb3duKCk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlSW50ZXJuYWxzLmpzLm1hcCIsImltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgbWVyZ2VJbnRlcm5hbHMgfSBmcm9tICcuL21lcmdlSW50ZXJuYWxzJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlTWFwKHByb2plY3QsIHJlc3VsdFNlbGVjdG9yLCBjb25jdXJyZW50ID0gSW5maW5pdHkpIHtcbiAgICBpZiAoaXNGdW5jdGlvbihyZXN1bHRTZWxlY3RvcikpIHtcbiAgICAgICAgcmV0dXJuIG1lcmdlTWFwKChhLCBpKSA9PiBtYXAoKGIsIGlpKSA9PiByZXN1bHRTZWxlY3RvcihhLCBiLCBpLCBpaSkpKGlubmVyRnJvbShwcm9qZWN0KGEsIGkpKSksIGNvbmN1cnJlbnQpO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbmN1cnJlbnQgPSByZXN1bHRTZWxlY3RvcjtcbiAgICB9XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4gbWVyZ2VJbnRlcm5hbHMoc291cmNlLCBzdWJzY3JpYmVyLCBwcm9qZWN0LCBjb25jdXJyZW50KSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZXJnZU1hcC5qcy5tYXAiLCJpbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJy4vbWVyZ2VNYXAnO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZUFsbChjb25jdXJyZW50ID0gSW5maW5pdHkpIHtcbiAgICByZXR1cm4gbWVyZ2VNYXAoaWRlbnRpdHksIGNvbmN1cnJlbnQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2VBbGwuanMubWFwIiwiaW1wb3J0IHsgbWVyZ2VBbGwgfSBmcm9tICcuL21lcmdlQWxsJztcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRBbGwoKSB7XG4gICAgcmV0dXJuIG1lcmdlQWxsKDEpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29uY2F0QWxsLmpzLm1hcCIsImltcG9ydCB7IGNvbmNhdEFsbCB9IGZyb20gJy4uL29wZXJhdG9ycy9jb25jYXRBbGwnO1xuaW1wb3J0IHsgcG9wU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9hcmdzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdCguLi5hcmdzKSB7XG4gICAgcmV0dXJuIGNvbmNhdEFsbCgpKGZyb20oYXJncywgcG9wU2NoZWR1bGVyKGFyZ3MpKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25jYXQuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi9pbm5lckZyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmVyKG9ic2VydmFibGVGYWN0b3J5KSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGlubmVyRnJvbShvYnNlcnZhYmxlRmFjdG9yeSgpKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWZlci5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBkZWZlciB9IGZyb20gJy4vZGVmZXInO1xuY29uc3QgREVGQVVMVF9DT05GSUcgPSB7XG4gICAgY29ubmVjdG9yOiAoKSA9PiBuZXcgU3ViamVjdCgpLFxuICAgIHJlc2V0T25EaXNjb25uZWN0OiB0cnVlLFxufTtcbmV4cG9ydCBmdW5jdGlvbiBjb25uZWN0YWJsZShzb3VyY2UsIGNvbmZpZyA9IERFRkFVTFRfQ09ORklHKSB7XG4gICAgbGV0IGNvbm5lY3Rpb24gPSBudWxsO1xuICAgIGNvbnN0IHsgY29ubmVjdG9yLCByZXNldE9uRGlzY29ubmVjdCA9IHRydWUgfSA9IGNvbmZpZztcbiAgICBsZXQgc3ViamVjdCA9IGNvbm5lY3RvcigpO1xuICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIHJldHVybiBzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbiAgICByZXN1bHQuY29ubmVjdCA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFjb25uZWN0aW9uIHx8IGNvbm5lY3Rpb24uY2xvc2VkKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9uID0gZGVmZXIoKCkgPT4gc291cmNlKS5zdWJzY3JpYmUoc3ViamVjdCk7XG4gICAgICAgICAgICBpZiAocmVzZXRPbkRpc2Nvbm5lY3QpIHtcbiAgICAgICAgICAgICAgICBjb25uZWN0aW9uLmFkZCgoKSA9PiAoc3ViamVjdCA9IGNvbm5lY3RvcigpKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNvbm5lY3Rpb247XG4gICAgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29ubmVjdGFibGUuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXJnc0FyZ0FycmF5T3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2FyZ3NBcmdBcnJheU9yT2JqZWN0JztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4vaW5uZXJGcm9tJztcbmltcG9ydCB7IHBvcFJlc3VsdFNlbGVjdG9yIH0gZnJvbSAnLi4vdXRpbC9hcmdzJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4uL29wZXJhdG9ycy9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgbWFwT25lT3JNYW55QXJncyB9IGZyb20gJy4uL3V0aWwvbWFwT25lT3JNYW55QXJncyc7XG5pbXBvcnQgeyBjcmVhdGVPYmplY3QgfSBmcm9tICcuLi91dGlsL2NyZWF0ZU9iamVjdCc7XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW4oLi4uYXJncykge1xuICAgIGNvbnN0IHJlc3VsdFNlbGVjdG9yID0gcG9wUmVzdWx0U2VsZWN0b3IoYXJncyk7XG4gICAgY29uc3QgeyBhcmdzOiBzb3VyY2VzLCBrZXlzIH0gPSBhcmdzQXJnQXJyYXlPck9iamVjdChhcmdzKTtcbiAgICBjb25zdCByZXN1bHQgPSBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCB7IGxlbmd0aCB9ID0gc291cmNlcztcbiAgICAgICAgaWYgKCFsZW5ndGgpIHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB2YWx1ZXMgPSBuZXcgQXJyYXkobGVuZ3RoKTtcbiAgICAgICAgbGV0IHJlbWFpbmluZ0NvbXBsZXRpb25zID0gbGVuZ3RoO1xuICAgICAgICBsZXQgcmVtYWluaW5nRW1pc3Npb25zID0gbGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBzb3VyY2VJbmRleCA9IDA7IHNvdXJjZUluZGV4IDwgbGVuZ3RoOyBzb3VyY2VJbmRleCsrKSB7XG4gICAgICAgICAgICBsZXQgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgIGlubmVyRnJvbShzb3VyY2VzW3NvdXJjZUluZGV4XSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFoYXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBoYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHJlbWFpbmluZ0VtaXNzaW9ucy0tO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YWx1ZXNbc291cmNlSW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICB9LCAoKSA9PiByZW1haW5pbmdDb21wbGV0aW9ucy0tLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIXJlbWFpbmluZ0NvbXBsZXRpb25zIHx8ICFoYXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXJlbWFpbmluZ0VtaXNzaW9ucykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGtleXMgPyBjcmVhdGVPYmplY3Qoa2V5cywgdmFsdWVzKSA6IHZhbHVlcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRTZWxlY3RvciA/IHJlc3VsdC5waXBlKG1hcE9uZU9yTWFueUFyZ3MocmVzdWx0U2VsZWN0b3IpKSA6IHJlc3VsdDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZvcmtKb2luLmpzLm1hcCIsImltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21lcmdlTWFwJztcbmltcG9ydCB7IGlzQXJyYXlMaWtlIH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5TGlrZSc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IG1hcE9uZU9yTWFueUFyZ3MgfSBmcm9tICcuLi91dGlsL21hcE9uZU9yTWFueUFyZ3MnO1xuY29uc3Qgbm9kZUV2ZW50RW1pdHRlck1ldGhvZHMgPSBbJ2FkZExpc3RlbmVyJywgJ3JlbW92ZUxpc3RlbmVyJ107XG5jb25zdCBldmVudFRhcmdldE1ldGhvZHMgPSBbJ2FkZEV2ZW50TGlzdGVuZXInLCAncmVtb3ZlRXZlbnRMaXN0ZW5lciddO1xuY29uc3QganF1ZXJ5TWV0aG9kcyA9IFsnb24nLCAnb2ZmJ107XG5leHBvcnQgZnVuY3Rpb24gZnJvbUV2ZW50KHRhcmdldCwgZXZlbnROYW1lLCBvcHRpb25zLCByZXN1bHRTZWxlY3Rvcikge1xuICAgIGlmIChpc0Z1bmN0aW9uKG9wdGlvbnMpKSB7XG4gICAgICAgIHJlc3VsdFNlbGVjdG9yID0gb3B0aW9ucztcbiAgICAgICAgb3B0aW9ucyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBmcm9tRXZlbnQodGFyZ2V0LCBldmVudE5hbWUsIG9wdGlvbnMpLnBpcGUobWFwT25lT3JNYW55QXJncyhyZXN1bHRTZWxlY3RvcikpO1xuICAgIH1cbiAgICBjb25zdCBbYWRkLCByZW1vdmVdID0gaXNFdmVudFRhcmdldCh0YXJnZXQpXG4gICAgICAgID8gZXZlbnRUYXJnZXRNZXRob2RzLm1hcCgobWV0aG9kTmFtZSkgPT4gKGhhbmRsZXIpID0+IHRhcmdldFttZXRob2ROYW1lXShldmVudE5hbWUsIGhhbmRsZXIsIG9wdGlvbnMpKVxuICAgICAgICA6XG4gICAgICAgICAgICBpc05vZGVTdHlsZUV2ZW50RW1pdHRlcih0YXJnZXQpXG4gICAgICAgICAgICAgICAgPyBub2RlRXZlbnRFbWl0dGVyTWV0aG9kcy5tYXAodG9Db21tb25IYW5kbGVyUmVnaXN0cnkodGFyZ2V0LCBldmVudE5hbWUpKVxuICAgICAgICAgICAgICAgIDogaXNKUXVlcnlTdHlsZUV2ZW50RW1pdHRlcih0YXJnZXQpXG4gICAgICAgICAgICAgICAgICAgID8ganF1ZXJ5TWV0aG9kcy5tYXAodG9Db21tb25IYW5kbGVyUmVnaXN0cnkodGFyZ2V0LCBldmVudE5hbWUpKVxuICAgICAgICAgICAgICAgICAgICA6IFtdO1xuICAgIGlmICghYWRkKSB7XG4gICAgICAgIGlmIChpc0FycmF5TGlrZSh0YXJnZXQpKSB7XG4gICAgICAgICAgICByZXR1cm4gbWVyZ2VNYXAoKHN1YlRhcmdldCkgPT4gZnJvbUV2ZW50KHN1YlRhcmdldCwgZXZlbnROYW1lLCBvcHRpb25zKSkoaW5uZXJGcm9tKHRhcmdldCkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghYWRkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0ludmFsaWQgZXZlbnQgdGFyZ2V0Jyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gKC4uLmFyZ3MpID0+IHN1YnNjcmliZXIubmV4dCgxIDwgYXJncy5sZW5ndGggPyBhcmdzIDogYXJnc1swXSk7XG4gICAgICAgIGFkZChoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHJlbW92ZShoYW5kbGVyKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIHRvQ29tbW9uSGFuZGxlclJlZ2lzdHJ5KHRhcmdldCwgZXZlbnROYW1lKSB7XG4gICAgcmV0dXJuIChtZXRob2ROYW1lKSA9PiAoaGFuZGxlcikgPT4gdGFyZ2V0W21ldGhvZE5hbWVdKGV2ZW50TmFtZSwgaGFuZGxlcik7XG59XG5mdW5jdGlvbiBpc05vZGVTdHlsZUV2ZW50RW1pdHRlcih0YXJnZXQpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbih0YXJnZXQuYWRkTGlzdGVuZXIpICYmIGlzRnVuY3Rpb24odGFyZ2V0LnJlbW92ZUxpc3RlbmVyKTtcbn1cbmZ1bmN0aW9uIGlzSlF1ZXJ5U3R5bGVFdmVudEVtaXR0ZXIodGFyZ2V0KSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGFyZ2V0Lm9uKSAmJiBpc0Z1bmN0aW9uKHRhcmdldC5vZmYpO1xufVxuZnVuY3Rpb24gaXNFdmVudFRhcmdldCh0YXJnZXQpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbih0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcikgJiYgaXNGdW5jdGlvbih0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mcm9tRXZlbnQuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBtYXBPbmVPck1hbnlBcmdzIH0gZnJvbSAnLi4vdXRpbC9tYXBPbmVPck1hbnlBcmdzJztcbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuKGFkZEhhbmRsZXIsIHJlbW92ZUhhbmRsZXIsIHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgICAgIHJldHVybiBmcm9tRXZlbnRQYXR0ZXJuKGFkZEhhbmRsZXIsIHJlbW92ZUhhbmRsZXIpLnBpcGUobWFwT25lT3JNYW55QXJncyhyZXN1bHRTZWxlY3RvcikpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9ICguLi5lKSA9PiBzdWJzY3JpYmVyLm5leHQoZS5sZW5ndGggPT09IDEgPyBlWzBdIDogZSk7XG4gICAgICAgIGNvbnN0IHJldFZhbHVlID0gYWRkSGFuZGxlcihoYW5kbGVyKTtcbiAgICAgICAgcmV0dXJuIGlzRnVuY3Rpb24ocmVtb3ZlSGFuZGxlcikgPyAoKSA9PiByZW1vdmVIYW5kbGVyKGhhbmRsZXIsIHJldFZhbHVlKSA6IHVuZGVmaW5lZDtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZyb21FdmVudFBhdHRlcm4uanMubWFwIiwiaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBkZWZlciB9IGZyb20gJy4vZGVmZXInO1xuaW1wb3J0IHsgc2NoZWR1bGVJdGVyYWJsZSB9IGZyb20gJy4uL3NjaGVkdWxlZC9zY2hlZHVsZUl0ZXJhYmxlJztcbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZShpbml0aWFsU3RhdGVPck9wdGlvbnMsIGNvbmRpdGlvbiwgaXRlcmF0ZSwgcmVzdWx0U2VsZWN0b3JPclNjaGVkdWxlciwgc2NoZWR1bGVyKSB7XG4gICAgbGV0IHJlc3VsdFNlbGVjdG9yO1xuICAgIGxldCBpbml0aWFsU3RhdGU7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgKHtcbiAgICAgICAgICAgIGluaXRpYWxTdGF0ZSxcbiAgICAgICAgICAgIGNvbmRpdGlvbixcbiAgICAgICAgICAgIGl0ZXJhdGUsXG4gICAgICAgICAgICByZXN1bHRTZWxlY3RvciA9IGlkZW50aXR5LFxuICAgICAgICAgICAgc2NoZWR1bGVyLFxuICAgICAgICB9ID0gaW5pdGlhbFN0YXRlT3JPcHRpb25zKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGluaXRpYWxTdGF0ZSA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucztcbiAgICAgICAgaWYgKCFyZXN1bHRTZWxlY3Rvck9yU2NoZWR1bGVyIHx8IGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yT3JTY2hlZHVsZXIpKSB7XG4gICAgICAgICAgICByZXN1bHRTZWxlY3RvciA9IGlkZW50aXR5O1xuICAgICAgICAgICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3JPclNjaGVkdWxlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yID0gcmVzdWx0U2VsZWN0b3JPclNjaGVkdWxlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiogZ2VuKCkge1xuICAgICAgICBmb3IgKGxldCBzdGF0ZSA9IGluaXRpYWxTdGF0ZTsgIWNvbmRpdGlvbiB8fCBjb25kaXRpb24oc3RhdGUpOyBzdGF0ZSA9IGl0ZXJhdGUoc3RhdGUpKSB7XG4gICAgICAgICAgICB5aWVsZCByZXN1bHRTZWxlY3RvcihzdGF0ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlZmVyKChzY2hlZHVsZXJcbiAgICAgICAgP1xuICAgICAgICAgICAgKCkgPT4gc2NoZWR1bGVJdGVyYWJsZShnZW4oKSwgc2NoZWR1bGVyKVxuICAgICAgICA6XG4gICAgICAgICAgICBnZW4pKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdlbmVyYXRlLmpzLm1hcCIsImltcG9ydCB7IGRlZmVyIH0gZnJvbSAnLi9kZWZlcic7XG5leHBvcnQgZnVuY3Rpb24gaWlmKGNvbmRpdGlvbiwgdHJ1ZVJlc3VsdCwgZmFsc2VSZXN1bHQpIHtcbiAgICByZXR1cm4gZGVmZXIoKCkgPT4gKGNvbmRpdGlvbigpID8gdHJ1ZVJlc3VsdCA6IGZhbHNlUmVzdWx0KSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1paWYuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXN5bmMgYXMgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IGlzVmFsaWREYXRlIH0gZnJvbSAnLi4vdXRpbC9pc0RhdGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyKGR1ZVRpbWUgPSAwLCBpbnRlcnZhbE9yU2NoZWR1bGVyLCBzY2hlZHVsZXIgPSBhc3luY1NjaGVkdWxlcikge1xuICAgIGxldCBpbnRlcnZhbER1cmF0aW9uID0gLTE7XG4gICAgaWYgKGludGVydmFsT3JTY2hlZHVsZXIgIT0gbnVsbCkge1xuICAgICAgICBpZiAoaXNTY2hlZHVsZXIoaW50ZXJ2YWxPclNjaGVkdWxlcikpIHtcbiAgICAgICAgICAgIHNjaGVkdWxlciA9IGludGVydmFsT3JTY2hlZHVsZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpbnRlcnZhbER1cmF0aW9uID0gaW50ZXJ2YWxPclNjaGVkdWxlcjtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGR1ZSA9IGlzVmFsaWREYXRlKGR1ZVRpbWUpID8gK2R1ZVRpbWUgLSBzY2hlZHVsZXIubm93KCkgOiBkdWVUaW1lO1xuICAgICAgICBpZiAoZHVlIDwgMCkge1xuICAgICAgICAgICAgZHVlID0gMDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgbiA9IDA7XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChuKyspO1xuICAgICAgICAgICAgICAgIGlmICgwIDw9IGludGVydmFsRHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlZHVsZSh1bmRlZmluZWQsIGludGVydmFsRHVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgZHVlKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVyLmpzLm1hcCIsImltcG9ydCB7IGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IHRpbWVyIH0gZnJvbSAnLi90aW1lcic7XG5leHBvcnQgZnVuY3Rpb24gaW50ZXJ2YWwocGVyaW9kID0gMCwgc2NoZWR1bGVyID0gYXN5bmNTY2hlZHVsZXIpIHtcbiAgICBpZiAocGVyaW9kIDwgMCkge1xuICAgICAgICBwZXJpb2QgPSAwO1xuICAgIH1cbiAgICByZXR1cm4gdGltZXIocGVyaW9kLCBwZXJpb2QsIHNjaGVkdWxlcik7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pbnRlcnZhbC5qcy5tYXAiLCJpbXBvcnQgeyBtZXJnZUFsbCB9IGZyb20gJy4uL29wZXJhdG9ycy9tZXJnZUFsbCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgcG9wTnVtYmVyLCBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UoLi4uYXJncykge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHBvcFNjaGVkdWxlcihhcmdzKTtcbiAgICBjb25zdCBjb25jdXJyZW50ID0gcG9wTnVtYmVyKGFyZ3MsIEluZmluaXR5KTtcbiAgICBjb25zdCBzb3VyY2VzID0gYXJncztcbiAgICByZXR1cm4gIXNvdXJjZXMubGVuZ3RoXG4gICAgICAgID9cbiAgICAgICAgICAgIEVNUFRZXG4gICAgICAgIDogc291cmNlcy5sZW5ndGggPT09IDFcbiAgICAgICAgICAgID9cbiAgICAgICAgICAgICAgICBpbm5lckZyb20oc291cmNlc1swXSlcbiAgICAgICAgICAgIDpcbiAgICAgICAgICAgICAgICBtZXJnZUFsbChjb25jdXJyZW50KShmcm9tKHNvdXJjZXMsIHNjaGVkdWxlcikpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2UuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5leHBvcnQgY29uc3QgTkVWRVIgPSBuZXcgT2JzZXJ2YWJsZShub29wKTtcbmV4cG9ydCBmdW5jdGlvbiBuZXZlcigpIHtcbiAgICByZXR1cm4gTkVWRVI7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1uZXZlci5qcy5tYXAiLCJjb25zdCB7IGlzQXJyYXkgfSA9IEFycmF5O1xuZXhwb3J0IGZ1bmN0aW9uIGFyZ3NPckFyZ0FycmF5KGFyZ3MpIHtcbiAgICByZXR1cm4gYXJncy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShhcmdzWzBdKSA/IGFyZ3NbMF0gOiBhcmdzO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJnc09yQXJnQXJyYXkuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBhcmdzT3JBcmdBcnJheSB9IGZyb20gJy4uL3V0aWwvYXJnc09yQXJnQXJyYXknO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQoLi4uc291cmNlcykge1xuICAgIGNvbnN0IG5leHRTb3VyY2VzID0gYXJnc09yQXJnQXJyYXkoc291cmNlcyk7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCByZW1haW5pbmcgPSBbc291cmNlLCAuLi5uZXh0U291cmNlc107XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZU5leHQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlbWFpbmluZy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXh0U291cmNlO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV4dFNvdXJjZSA9IGlubmVyRnJvbShyZW1haW5pbmcuc2hpZnQoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlTmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGlubmVyU3ViID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB1bmRlZmluZWQsIG5vb3AsIG5vb3ApO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmFkZChuZXh0U291cmNlLnN1YnNjcmliZShpbm5lclN1YikpO1xuICAgICAgICAgICAgICAgICAgICBpbm5lclN1Yi5hZGQoc3Vic2NyaWJlTmV4dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzdWJzY3JpYmVOZXh0KCk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1vbkVycm9yUmVzdW1lTmV4dC5qcy5tYXAiLCJpbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgb25FcnJvclJlc3VtZU5leHQgYXMgb25FcnJvclJlc3VtZU5leHRXaXRoIH0gZnJvbSAnLi4vb3BlcmF0b3JzL29uRXJyb3JSZXN1bWVOZXh0JztcbmltcG9ydCB7IGFyZ3NPckFyZ0FycmF5IH0gZnJvbSAnLi4vdXRpbC9hcmdzT3JBcmdBcnJheSc7XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQoLi4uc291cmNlcykge1xuICAgIHJldHVybiBvbkVycm9yUmVzdW1lTmV4dFdpdGgoYXJnc09yQXJnQXJyYXkoc291cmNlcykpKEVNUFRZKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9uRXJyb3JSZXN1bWVOZXh0LmpzLm1hcCIsImltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIHBhaXJzKG9iaiwgc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIGZyb20oT2JqZWN0LmVudHJpZXMob2JqKSwgc2NoZWR1bGVyKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhaXJzLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBub3QocHJlZCwgdGhpc0FyZykge1xuICAgIHJldHVybiAodmFsdWUsIGluZGV4KSA9PiAhcHJlZC5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpbmRleCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ub3QuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyKHByZWRpY2F0ZSwgdGhpc0FyZykge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4gcHJlZGljYXRlLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4KyspICYmIHN1YnNjcmliZXIubmV4dCh2YWx1ZSkpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbHRlci5qcy5tYXAiLCJpbXBvcnQgeyBub3QgfSBmcm9tICcuLi91dGlsL25vdCc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuLi9vcGVyYXRvcnMvZmlsdGVyJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4vaW5uZXJGcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBwYXJ0aXRpb24oc291cmNlLCBwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gW2ZpbHRlcihwcmVkaWNhdGUsIHRoaXNBcmcpKGlubmVyRnJvbShzb3VyY2UpKSwgZmlsdGVyKG5vdChwcmVkaWNhdGUsIHRoaXNBcmcpKShpbm5lckZyb20oc291cmNlKSldO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFydGl0aW9uLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4vaW5uZXJGcm9tJztcbmltcG9ydCB7IGFyZ3NPckFyZ0FycmF5IH0gZnJvbSAnLi4vdXRpbC9hcmdzT3JBcmdBcnJheSc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuLi9vcGVyYXRvcnMvT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiByYWNlKC4uLnNvdXJjZXMpIHtcbiAgICBzb3VyY2VzID0gYXJnc09yQXJnQXJyYXkoc291cmNlcyk7XG4gICAgcmV0dXJuIHNvdXJjZXMubGVuZ3RoID09PSAxID8gaW5uZXJGcm9tKHNvdXJjZXNbMF0pIDogbmV3IE9ic2VydmFibGUocmFjZUluaXQoc291cmNlcykpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJhY2VJbml0KHNvdXJjZXMpIHtcbiAgICByZXR1cm4gKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHN1YnNjcmlwdGlvbnMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IHN1YnNjcmlwdGlvbnMgJiYgIXN1YnNjcmliZXIuY2xvc2VkICYmIGkgPCBzb3VyY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb25zLnB1c2goaW5uZXJGcm9tKHNvdXJjZXNbaV0pLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdWJzY3JpcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAobGV0IHMgPSAwOyBzIDwgc3Vic2NyaXB0aW9ucy5sZW5ndGg7IHMrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcyAhPT0gaSAmJiBzdWJzY3JpcHRpb25zW3NdLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9ucyA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9KSkpO1xuICAgICAgICB9XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJhY2UuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmV4cG9ydCBmdW5jdGlvbiByYW5nZShzdGFydCwgY291bnQsIHNjaGVkdWxlcikge1xuICAgIGlmIChjb3VudCA9PSBudWxsKSB7XG4gICAgICAgIGNvdW50ID0gc3RhcnQ7XG4gICAgICAgIHN0YXJ0ID0gMDtcbiAgICB9XG4gICAgaWYgKGNvdW50IDw9IDApIHtcbiAgICAgICAgcmV0dXJuIEVNUFRZO1xuICAgIH1cbiAgICBjb25zdCBlbmQgPSBjb3VudCArIHN0YXJ0O1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzY2hlZHVsZXJcbiAgICAgICAgP1xuICAgICAgICAgICAgKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbiA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobiA8IGVuZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KG4rKyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNjaGVkdWxlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgOlxuICAgICAgICAgICAgKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbiA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgIHdoaWxlIChuIDwgZW5kICYmICFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQobisrKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yYW5nZS5qcy5tYXAiLCJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuZXhwb3J0IGZ1bmN0aW9uIHVzaW5nKHJlc291cmNlRmFjdG9yeSwgb2JzZXJ2YWJsZUZhY3RvcnkpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgcmVzb3VyY2UgPSByZXNvdXJjZUZhY3RvcnkoKTtcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gb2JzZXJ2YWJsZUZhY3RvcnkocmVzb3VyY2UpO1xuICAgICAgICBjb25zdCBzb3VyY2UgPSByZXN1bHQgPyBpbm5lckZyb20ocmVzdWx0KSA6IEVNUFRZO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlc291cmNlKSB7XG4gICAgICAgICAgICAgICAgcmVzb3VyY2UudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXVzaW5nLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4vaW5uZXJGcm9tJztcbmltcG9ydCB7IGFyZ3NPckFyZ0FycmF5IH0gZnJvbSAnLi4vdXRpbC9hcmdzT3JBcmdBcnJheSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi4vb3BlcmF0b3JzL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBwb3BSZXN1bHRTZWxlY3RvciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5leHBvcnQgZnVuY3Rpb24gemlwKC4uLmFyZ3MpIHtcbiAgICBjb25zdCByZXN1bHRTZWxlY3RvciA9IHBvcFJlc3VsdFNlbGVjdG9yKGFyZ3MpO1xuICAgIGNvbnN0IHNvdXJjZXMgPSBhcmdzT3JBcmdBcnJheShhcmdzKTtcbiAgICByZXR1cm4gc291cmNlcy5sZW5ndGhcbiAgICAgICAgPyBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAgICAgbGV0IGJ1ZmZlcnMgPSBzb3VyY2VzLm1hcCgoKSA9PiBbXSk7XG4gICAgICAgICAgICBsZXQgY29tcGxldGVkID0gc291cmNlcy5tYXAoKCkgPT4gZmFsc2UpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIGJ1ZmZlcnMgPSBjb21wbGV0ZWQgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBmb3IgKGxldCBzb3VyY2VJbmRleCA9IDA7ICFzdWJzY3JpYmVyLmNsb3NlZCAmJiBzb3VyY2VJbmRleCA8IHNvdXJjZXMubGVuZ3RoOyBzb3VyY2VJbmRleCsrKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJGcm9tKHNvdXJjZXNbc291cmNlSW5kZXhdKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgYnVmZmVyc1tzb3VyY2VJbmRleF0ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChidWZmZXJzLmV2ZXJ5KChidWZmZXIpID0+IGJ1ZmZlci5sZW5ndGgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCByZXN1bHQgPSBidWZmZXJzLm1hcCgoYnVmZmVyKSA9PiBidWZmZXIuc2hpZnQoKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQocmVzdWx0U2VsZWN0b3IgPyByZXN1bHRTZWxlY3RvciguLi5yZXN1bHQpIDogcmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChidWZmZXJzLnNvbWUoKGJ1ZmZlciwgaSkgPT4gIWJ1ZmZlci5sZW5ndGggJiYgY29tcGxldGVkW2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGVkW3NvdXJjZUluZGV4XSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICFidWZmZXJzW3NvdXJjZUluZGV4XS5sZW5ndGggJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYnVmZmVycyA9IGNvbXBsZXRlZCA9IG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KVxuICAgICAgICA6IEVNUFRZO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9emlwLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGF1ZGl0KGR1cmF0aW9uU2VsZWN0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgbGV0IGR1cmF0aW9uU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIGxldCBpc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGVuZER1cmF0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgZHVyYXRpb25TdWJzY3JpYmVyID09PSBudWxsIHx8IGR1cmF0aW9uU3Vic2NyaWJlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogZHVyYXRpb25TdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBkdXJhdGlvblN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGxhc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpc0NvbXBsZXRlICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2xlYW51cER1cmF0aW9uID0gKCkgPT4ge1xuICAgICAgICAgICAgZHVyYXRpb25TdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgICAgIGlzQ29tcGxldGUgJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9O1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBoYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgICAgIGlmICghZHVyYXRpb25TdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJGcm9tKGR1cmF0aW9uU2VsZWN0b3IodmFsdWUpKS5zdWJzY3JpYmUoKGR1cmF0aW9uU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZW5kRHVyYXRpb24sIGNsZWFudXBEdXJhdGlvbikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAoIWhhc1ZhbHVlIHx8ICFkdXJhdGlvblN1YnNjcmliZXIgfHwgZHVyYXRpb25TdWJzY3JpYmVyLmNsb3NlZCkgJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hdWRpdC5qcy5tYXAiLCJpbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBhdWRpdCB9IGZyb20gJy4vYXVkaXQnO1xuaW1wb3J0IHsgdGltZXIgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3RpbWVyJztcbmV4cG9ydCBmdW5jdGlvbiBhdWRpdFRpbWUoZHVyYXRpb24sIHNjaGVkdWxlciA9IGFzeW5jU2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIGF1ZGl0KCgpID0+IHRpbWVyKGR1cmF0aW9uLCBzY2hlZHVsZXIpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWF1ZGl0VGltZS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlcihjbG9zaW5nTm90aWZpZXIpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBjdXJyZW50QnVmZmVyID0gW107XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IGN1cnJlbnRCdWZmZXIucHVzaCh2YWx1ZSksICgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChjdXJyZW50QnVmZmVyKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgICAgICBjbG9zaW5nTm90aWZpZXIuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgYiA9IGN1cnJlbnRCdWZmZXI7XG4gICAgICAgICAgICBjdXJyZW50QnVmZmVyID0gW107XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoYik7XG4gICAgICAgIH0sIG5vb3ApKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGN1cnJlbnRCdWZmZXIgPSBudWxsO1xuICAgICAgICB9O1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YnVmZmVyLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgYXJyUmVtb3ZlIH0gZnJvbSAnLi4vdXRpbC9hcnJSZW1vdmUnO1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlckNvdW50KGJ1ZmZlclNpemUsIHN0YXJ0QnVmZmVyRXZlcnkgPSBudWxsKSB7XG4gICAgc3RhcnRCdWZmZXJFdmVyeSA9IHN0YXJ0QnVmZmVyRXZlcnkgIT09IG51bGwgJiYgc3RhcnRCdWZmZXJFdmVyeSAhPT0gdm9pZCAwID8gc3RhcnRCdWZmZXJFdmVyeSA6IGJ1ZmZlclNpemU7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgYnVmZmVycyA9IFtdO1xuICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBsZXQgdG9FbWl0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChjb3VudCsrICUgc3RhcnRCdWZmZXJFdmVyeSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJ1ZmZlcnMucHVzaChbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJ1ZmZlciBvZiBidWZmZXJzKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChidWZmZXJTaXplIDw9IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdG9FbWl0ID0gdG9FbWl0ICE9PSBudWxsICYmIHRvRW1pdCAhPT0gdm9pZCAwID8gdG9FbWl0IDogW107XG4gICAgICAgICAgICAgICAgICAgIHRvRW1pdC5wdXNoKGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRvRW1pdCkge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgYnVmZmVyIG9mIHRvRW1pdCkge1xuICAgICAgICAgICAgICAgICAgICBhcnJSZW1vdmUoYnVmZmVycywgYnVmZmVyKTtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJ1ZmZlciBvZiBidWZmZXJzKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGJ1ZmZlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgYnVmZmVycyA9IG51bGw7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1ZmZlckNvdW50LmpzLm1hcCIsImltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGFyclJlbW92ZSB9IGZyb20gJy4uL3V0aWwvYXJyUmVtb3ZlJztcbmltcG9ydCB7IGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBleGVjdXRlU2NoZWR1bGUgfSBmcm9tICcuLi91dGlsL2V4ZWN1dGVTY2hlZHVsZSc7XG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVGltZShidWZmZXJUaW1lU3BhbiwgLi4ub3RoZXJBcmdzKSB7XG4gICAgdmFyIF9hLCBfYjtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSAoX2EgPSBwb3BTY2hlZHVsZXIob3RoZXJBcmdzKSkgIT09IG51bGwgJiYgX2EgIT09IHZvaWQgMCA/IF9hIDogYXN5bmNTY2hlZHVsZXI7XG4gICAgY29uc3QgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCA9IChfYiA9IG90aGVyQXJnc1swXSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogbnVsbDtcbiAgICBjb25zdCBtYXhCdWZmZXJTaXplID0gb3RoZXJBcmdzWzFdIHx8IEluZmluaXR5O1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGJ1ZmZlclJlY29yZHMgPSBbXTtcbiAgICAgICAgbGV0IHJlc3RhcnRPbkVtaXQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgZW1pdCA9IChyZWNvcmQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgYnVmZmVyLCBzdWJzIH0gPSByZWNvcmQ7XG4gICAgICAgICAgICBzdWJzLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICBhcnJSZW1vdmUoYnVmZmVyUmVjb3JkcywgcmVjb3JkKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChidWZmZXIpO1xuICAgICAgICAgICAgcmVzdGFydE9uRW1pdCAmJiBzdGFydEJ1ZmZlcigpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBzdGFydEJ1ZmZlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGlmIChidWZmZXJSZWNvcmRzKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VicyA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmFkZChzdWJzKTtcbiAgICAgICAgICAgICAgICBjb25zdCBidWZmZXIgPSBbXTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNvcmQgPSB7XG4gICAgICAgICAgICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICAgICAgICAgICAgc3VicyxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGJ1ZmZlclJlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzLCBzY2hlZHVsZXIsICgpID0+IGVtaXQocmVjb3JkKSwgYnVmZmVyVGltZVNwYW4pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBpZiAoYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCAhPT0gbnVsbCAmJiBidWZmZXJDcmVhdGlvbkludGVydmFsID49IDApIHtcbiAgICAgICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzY3JpYmVyLCBzY2hlZHVsZXIsIHN0YXJ0QnVmZmVyLCBidWZmZXJDcmVhdGlvbkludGVydmFsLCB0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3RhcnRPbkVtaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHN0YXJ0QnVmZmVyKCk7XG4gICAgICAgIGNvbnN0IGJ1ZmZlclRpbWVTdWJzY3JpYmVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJlY29yZHNDb3B5ID0gYnVmZmVyUmVjb3Jkcy5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCByZWNvcmQgb2YgcmVjb3Jkc0NvcHkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGJ1ZmZlciB9ID0gcmVjb3JkO1xuICAgICAgICAgICAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgICAgICAgICAgICBtYXhCdWZmZXJTaXplIDw9IGJ1ZmZlci5sZW5ndGggJiYgZW1pdChyZWNvcmQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAoYnVmZmVyUmVjb3JkcyA9PT0gbnVsbCB8fCBidWZmZXJSZWNvcmRzID09PSB2b2lkIDAgPyB2b2lkIDAgOiBidWZmZXJSZWNvcmRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChidWZmZXJSZWNvcmRzLnNoaWZ0KCkuYnVmZmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJ1ZmZlclRpbWVTdWJzY3JpYmVyID09PSBudWxsIHx8IGJ1ZmZlclRpbWVTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBidWZmZXJUaW1lU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICB9LCB1bmRlZmluZWQsICgpID0+IChidWZmZXJSZWNvcmRzID0gbnVsbCkpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKGJ1ZmZlclRpbWVTdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1ZmZlclRpbWUuanMubWFwIiwiaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuLi91dGlsL2FyclJlbW92ZSc7XG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVG9nZ2xlKG9wZW5pbmdzLCBjbG9zaW5nU2VsZWN0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGJ1ZmZlcnMgPSBbXTtcbiAgICAgICAgaW5uZXJGcm9tKG9wZW5pbmdzKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAob3BlblZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBidWZmZXIgPSBbXTtcbiAgICAgICAgICAgIGJ1ZmZlcnMucHVzaChidWZmZXIpO1xuICAgICAgICAgICAgY29uc3QgY2xvc2luZ1N1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGVtaXRCdWZmZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgYXJyUmVtb3ZlKGJ1ZmZlcnMsIGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgY2xvc2luZ1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGNsb3NpbmdTdWJzY3JpcHRpb24uYWRkKGlubmVyRnJvbShjbG9zaW5nU2VsZWN0b3Iob3BlblZhbHVlKSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZW1pdEJ1ZmZlciwgbm9vcCkpKTtcbiAgICAgICAgfSwgbm9vcCkpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGJ1ZmZlciBvZiBidWZmZXJzKSB7XG4gICAgICAgICAgICAgICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAoYnVmZmVycy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGJ1ZmZlcnMuc2hpZnQoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1ZmZlclRvZ2dsZS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlcldoZW4oY2xvc2luZ1NlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgYnVmZmVyID0gbnVsbDtcbiAgICAgICAgbGV0IGNsb3NpbmdTdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgY29uc3Qgb3BlbkJ1ZmZlciA9ICgpID0+IHtcbiAgICAgICAgICAgIGNsb3NpbmdTdWJzY3JpYmVyID09PSBudWxsIHx8IGNsb3NpbmdTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjbG9zaW5nU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgY29uc3QgYiA9IGJ1ZmZlcjtcbiAgICAgICAgICAgIGJ1ZmZlciA9IFtdO1xuICAgICAgICAgICAgYiAmJiBzdWJzY3JpYmVyLm5leHQoYik7XG4gICAgICAgICAgICBpbm5lckZyb20oY2xvc2luZ1NlbGVjdG9yKCkpLnN1YnNjcmliZSgoY2xvc2luZ1N1YnNjcmliZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIG9wZW5CdWZmZXIsIG5vb3ApKSk7XG4gICAgICAgIH07XG4gICAgICAgIG9wZW5CdWZmZXIoKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4gYnVmZmVyID09PSBudWxsIHx8IGJ1ZmZlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogYnVmZmVyLnB1c2godmFsdWUpLCAoKSA9PiB7XG4gICAgICAgICAgICBidWZmZXIgJiYgc3Vic2NyaWJlci5uZXh0KGJ1ZmZlcik7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIHVuZGVmaW5lZCwgKCkgPT4gKGJ1ZmZlciA9IGNsb3NpbmdTdWJzY3JpYmVyID0gbnVsbCkpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWJ1ZmZlcldoZW4uanMubWFwIiwiaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgZnVuY3Rpb24gY2F0Y2hFcnJvcihzZWxlY3Rvcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgbGV0IHN5bmNVbnN1YiA9IGZhbHNlO1xuICAgICAgICBsZXQgaGFuZGxlZFJlc3VsdDtcbiAgICAgICAgaW5uZXJTdWIgPSBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIChlcnIpID0+IHtcbiAgICAgICAgICAgIGhhbmRsZWRSZXN1bHQgPSBpbm5lckZyb20oc2VsZWN0b3IoZXJyLCBjYXRjaEVycm9yKHNlbGVjdG9yKShzb3VyY2UpKSk7XG4gICAgICAgICAgICBpZiAoaW5uZXJTdWIpIHtcbiAgICAgICAgICAgICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgICAgICAgICBoYW5kbGVkUmVzdWx0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN5bmNVbnN1YiA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICAgICAgaWYgKHN5bmNVbnN1Yikge1xuICAgICAgICAgICAgaW5uZXJTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgICAgIGhhbmRsZWRSZXN1bHQuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jYXRjaEVycm9yLmpzLm1hcCIsImltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBzY2FuSW50ZXJuYWxzKGFjY3VtdWxhdG9yLCBzZWVkLCBoYXNTZWVkLCBlbWl0T25OZXh0LCBlbWl0QmVmb3JlQ29tcGxldGUpIHtcbiAgICByZXR1cm4gKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaGFzU3RhdGUgPSBoYXNTZWVkO1xuICAgICAgICBsZXQgc3RhdGUgPSBzZWVkO1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBpID0gaW5kZXgrKztcbiAgICAgICAgICAgIHN0YXRlID0gaGFzU3RhdGVcbiAgICAgICAgICAgICAgICA/XG4gICAgICAgICAgICAgICAgICAgIGFjY3VtdWxhdG9yKHN0YXRlLCB2YWx1ZSwgaSlcbiAgICAgICAgICAgICAgICA6XG4gICAgICAgICAgICAgICAgICAgICgoaGFzU3RhdGUgPSB0cnVlKSwgdmFsdWUpO1xuICAgICAgICAgICAgZW1pdE9uTmV4dCAmJiBzdWJzY3JpYmVyLm5leHQoc3RhdGUpO1xuICAgICAgICB9LCBlbWl0QmVmb3JlQ29tcGxldGUgJiZcbiAgICAgICAgICAgICgoKSA9PiB7XG4gICAgICAgICAgICAgICAgaGFzU3RhdGUgJiYgc3Vic2NyaWJlci5uZXh0KHN0YXRlKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9KSkpO1xuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2FuSW50ZXJuYWxzLmpzLm1hcCIsImltcG9ydCB7IHNjYW5JbnRlcm5hbHMgfSBmcm9tICcuL3NjYW5JbnRlcm5hbHMnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgZnVuY3Rpb24gcmVkdWNlKGFjY3VtdWxhdG9yLCBzZWVkKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoc2NhbkludGVybmFscyhhY2N1bXVsYXRvciwgc2VlZCwgYXJndW1lbnRzLmxlbmd0aCA+PSAyLCBmYWxzZSwgdHJ1ZSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVkdWNlLmpzLm1hcCIsImltcG9ydCB7IHJlZHVjZSB9IGZyb20gJy4vcmVkdWNlJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuY29uc3QgYXJyUmVkdWNlciA9IChhcnIsIHZhbHVlKSA9PiAoYXJyLnB1c2godmFsdWUpLCBhcnIpO1xuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXkoKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICByZWR1Y2UoYXJyUmVkdWNlciwgW10pKHNvdXJjZSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dG9BcnJheS5qcy5tYXAiLCJpbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuaW1wb3J0IHsgbWFwT25lT3JNYW55QXJncyB9IGZyb20gJy4uL3V0aWwvbWFwT25lT3JNYW55QXJncyc7XG5pbXBvcnQgeyBwaXBlIH0gZnJvbSAnLi4vdXRpbC9waXBlJztcbmltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAnLi9tZXJnZU1hcCc7XG5pbXBvcnQgeyB0b0FycmF5IH0gZnJvbSAnLi90b0FycmF5JztcbmV4cG9ydCBmdW5jdGlvbiBqb2luQWxsSW50ZXJuYWxzKGpvaW5GbiwgcHJvamVjdCkge1xuICAgIHJldHVybiBwaXBlKHRvQXJyYXkoKSwgbWVyZ2VNYXAoKHNvdXJjZXMpID0+IGpvaW5Gbihzb3VyY2VzKSksIHByb2plY3QgPyBtYXBPbmVPck1hbnlBcmdzKHByb2plY3QpIDogaWRlbnRpdHkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9am9pbkFsbEludGVybmFscy5qcy5tYXAiLCJpbXBvcnQgeyBjb21iaW5lTGF0ZXN0IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9jb21iaW5lTGF0ZXN0JztcbmltcG9ydCB7IGpvaW5BbGxJbnRlcm5hbHMgfSBmcm9tICcuL2pvaW5BbGxJbnRlcm5hbHMnO1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVMYXRlc3RBbGwocHJvamVjdCkge1xuICAgIHJldHVybiBqb2luQWxsSW50ZXJuYWxzKGNvbWJpbmVMYXRlc3QsIHByb2plY3QpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29tYmluZUxhdGVzdEFsbC5qcy5tYXAiLCJpbXBvcnQgeyBjb21iaW5lTGF0ZXN0QWxsIH0gZnJvbSAnLi9jb21iaW5lTGF0ZXN0QWxsJztcbmV4cG9ydCBjb25zdCBjb21iaW5lQWxsID0gY29tYmluZUxhdGVzdEFsbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbWJpbmVBbGwuanMubWFwIiwiaW1wb3J0IHsgY29tYmluZUxhdGVzdEluaXQgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2NvbWJpbmVMYXRlc3QnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBhcmdzT3JBcmdBcnJheSB9IGZyb20gJy4uL3V0aWwvYXJnc09yQXJnQXJyYXknO1xuaW1wb3J0IHsgbWFwT25lT3JNYW55QXJncyB9IGZyb20gJy4uL3V0aWwvbWFwT25lT3JNYW55QXJncyc7XG5pbXBvcnQgeyBwaXBlIH0gZnJvbSAnLi4vdXRpbC9waXBlJztcbmltcG9ydCB7IHBvcFJlc3VsdFNlbGVjdG9yIH0gZnJvbSAnLi4vdXRpbC9hcmdzJztcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lTGF0ZXN0KC4uLmFyZ3MpIHtcbiAgICBjb25zdCByZXN1bHRTZWxlY3RvciA9IHBvcFJlc3VsdFNlbGVjdG9yKGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHRTZWxlY3RvclxuICAgICAgICA/IHBpcGUoY29tYmluZUxhdGVzdCguLi5hcmdzKSwgbWFwT25lT3JNYW55QXJncyhyZXN1bHRTZWxlY3RvcikpXG4gICAgICAgIDogb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICBjb21iaW5lTGF0ZXN0SW5pdChbc291cmNlLCAuLi5hcmdzT3JBcmdBcnJheShhcmdzKV0pKHN1YnNjcmliZXIpO1xuICAgICAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbWJpbmVMYXRlc3QuanMubWFwIiwiaW1wb3J0IHsgY29tYmluZUxhdGVzdCB9IGZyb20gJy4vY29tYmluZUxhdGVzdCc7XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUxhdGVzdFdpdGgoLi4ub3RoZXJTb3VyY2VzKSB7XG4gICAgcmV0dXJuIGNvbWJpbmVMYXRlc3QoLi4ub3RoZXJTb3VyY2VzKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbWJpbmVMYXRlc3RXaXRoLmpzLm1hcCIsImltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAnLi9tZXJnZU1hcCc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRNYXAocHJvamVjdCwgcmVzdWx0U2VsZWN0b3IpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbihyZXN1bHRTZWxlY3RvcikgPyBtZXJnZU1hcChwcm9qZWN0LCByZXN1bHRTZWxlY3RvciwgMSkgOiBtZXJnZU1hcChwcm9qZWN0LCAxKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbmNhdE1hcC5qcy5tYXAiLCJpbXBvcnQgeyBjb25jYXRNYXAgfSBmcm9tICcuL2NvbmNhdE1hcCc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRNYXBUbyhpbm5lck9ic2VydmFibGUsIHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24ocmVzdWx0U2VsZWN0b3IpID8gY29uY2F0TWFwKCgpID0+IGlubmVyT2JzZXJ2YWJsZSwgcmVzdWx0U2VsZWN0b3IpIDogY29uY2F0TWFwKCgpID0+IGlubmVyT2JzZXJ2YWJsZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25jYXRNYXBUby5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGNvbmNhdEFsbCB9IGZyb20gJy4vY29uY2F0QWxsJztcbmltcG9ydCB7IHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQoLi4uYXJncykge1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHBvcFNjaGVkdWxlcihhcmdzKTtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbmNhdEFsbCgpKGZyb20oW3NvdXJjZSwgLi4uYXJnc10sIHNjaGVkdWxlcikpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvbmNhdC5qcy5tYXAiLCJpbXBvcnQgeyBjb25jYXQgfSBmcm9tICcuL2NvbmNhdCc7XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0V2l0aCguLi5vdGhlclNvdXJjZXMpIHtcbiAgICByZXR1cm4gY29uY2F0KC4uLm90aGVyU291cmNlcyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1jb25jYXRXaXRoLmpzLm1hcCIsImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmV4cG9ydCBmdW5jdGlvbiBmcm9tU3Vic2NyaWJhYmxlKHN1YnNjcmliYWJsZSkge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgoc3Vic2NyaWJlcikgPT4gc3Vic2NyaWJhYmxlLnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mcm9tU3Vic2NyaWJhYmxlLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb20nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBmcm9tU3Vic2NyaWJhYmxlIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tU3Vic2NyaWJhYmxlJztcbmNvbnN0IERFRkFVTFRfQ09ORklHID0ge1xuICAgIGNvbm5lY3RvcjogKCkgPT4gbmV3IFN1YmplY3QoKSxcbn07XG5leHBvcnQgZnVuY3Rpb24gY29ubmVjdChzZWxlY3RvciwgY29uZmlnID0gREVGQVVMVF9DT05GSUcpIHtcbiAgICBjb25zdCB7IGNvbm5lY3RvciB9ID0gY29uZmlnO1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IGNvbm5lY3RvcigpO1xuICAgICAgICBmcm9tKHNlbGVjdG9yKGZyb21TdWJzY3JpYmFibGUoc3ViamVjdCkpKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgIHN1YnNjcmliZXIuYWRkKHNvdXJjZS5zdWJzY3JpYmUoc3ViamVjdCkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Y29ubmVjdC5qcy5tYXAiLCJpbXBvcnQgeyByZWR1Y2UgfSBmcm9tICcuL3JlZHVjZSc7XG5leHBvcnQgZnVuY3Rpb24gY291bnQocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIHJlZHVjZSgodG90YWwsIHZhbHVlLCBpKSA9PiAoIXByZWRpY2F0ZSB8fCBwcmVkaWNhdGUodmFsdWUsIGkpID8gdG90YWwgKyAxIDogdG90YWwpLCAwKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWNvdW50LmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2UoZHVyYXRpb25TZWxlY3Rvcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICBsZXQgZHVyYXRpb25TdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgY29uc3QgZW1pdCA9ICgpID0+IHtcbiAgICAgICAgICAgIGR1cmF0aW9uU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBkdXJhdGlvblN1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGR1cmF0aW9uU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgZHVyYXRpb25TdWJzY3JpYmVyID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWUgPSBsYXN0VmFsdWU7XG4gICAgICAgICAgICAgICAgbGFzdFZhbHVlID0gbnVsbDtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBkdXJhdGlvblN1YnNjcmliZXIgPT09IG51bGwgfHwgZHVyYXRpb25TdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkdXJhdGlvblN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGhhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgZHVyYXRpb25TdWJzY3JpYmVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBlbWl0LCBub29wKTtcbiAgICAgICAgICAgIGlubmVyRnJvbShkdXJhdGlvblNlbGVjdG9yKHZhbHVlKSkuc3Vic2NyaWJlKGR1cmF0aW9uU3Vic2NyaWJlcik7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGVtaXQoKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSBkdXJhdGlvblN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kZWJvdW5jZS5qcy5tYXAiLCJpbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBkZWJvdW5jZVRpbWUoZHVlVGltZSwgc2NoZWR1bGVyID0gYXN5bmNTY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBhY3RpdmVUYXNrID0gbnVsbDtcbiAgICAgICAgbGV0IGxhc3RWYWx1ZSA9IG51bGw7XG4gICAgICAgIGxldCBsYXN0VGltZSA9IG51bGw7XG4gICAgICAgIGNvbnN0IGVtaXQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoYWN0aXZlVGFzaykge1xuICAgICAgICAgICAgICAgIGFjdGl2ZVRhc2sudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICBhY3RpdmVUYXNrID0gbnVsbDtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGxhc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIGZ1bmN0aW9uIGVtaXRXaGVuSWRsZSgpIHtcbiAgICAgICAgICAgIGNvbnN0IHRhcmdldFRpbWUgPSBsYXN0VGltZSArIGR1ZVRpbWU7XG4gICAgICAgICAgICBjb25zdCBub3cgPSBzY2hlZHVsZXIubm93KCk7XG4gICAgICAgICAgICBpZiAobm93IDwgdGFyZ2V0VGltZSkge1xuICAgICAgICAgICAgICAgIGFjdGl2ZVRhc2sgPSB0aGlzLnNjaGVkdWxlKHVuZGVmaW5lZCwgdGFyZ2V0VGltZSAtIG5vdyk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoYWN0aXZlVGFzayk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZW1pdCgpO1xuICAgICAgICB9XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGxhc3RWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgbGFzdFRpbWUgPSBzY2hlZHVsZXIubm93KCk7XG4gICAgICAgICAgICBpZiAoIWFjdGl2ZVRhc2spIHtcbiAgICAgICAgICAgICAgICBhY3RpdmVUYXNrID0gc2NoZWR1bGVyLnNjaGVkdWxlKGVtaXRXaGVuSWRsZSwgZHVlVGltZSk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoYWN0aXZlVGFzayk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGVtaXQoKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSBhY3RpdmVUYXNrID0gbnVsbDtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVib3VuY2VUaW1lLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRJZkVtcHR5KGRlZmF1bHRWYWx1ZSkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGhhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlmICghaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoZGVmYXVsdFZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVmYXVsdElmRW1wdHkuanMubWFwIiwiaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHRha2UoY291bnQpIHtcbiAgICByZXR1cm4gY291bnQgPD0gMFxuICAgICAgICA/XG4gICAgICAgICAgICAoKSA9PiBFTVBUWVxuICAgICAgICA6IG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAgICAgbGV0IHNlZW4gPSAwO1xuICAgICAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICgrK3NlZW4gPD0gY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGNvdW50IDw9IHNlZW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10YWtlLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5leHBvcnQgZnVuY3Rpb24gaWdub3JlRWxlbWVudHMoKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgbm9vcCkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aWdub3JlRWxlbWVudHMuanMubWFwIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuZXhwb3J0IGZ1bmN0aW9uIG1hcFRvKHZhbHVlKSB7XG4gICAgcmV0dXJuIG1hcCgoKSA9PiB2YWx1ZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXBUby5qcy5tYXAiLCJpbXBvcnQgeyBjb25jYXQgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2NvbmNhdCc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAnLi90YWtlJztcbmltcG9ydCB7IGlnbm9yZUVsZW1lbnRzIH0gZnJvbSAnLi9pZ25vcmVFbGVtZW50cyc7XG5pbXBvcnQgeyBtYXBUbyB9IGZyb20gJy4vbWFwVG8nO1xuaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICcuL21lcmdlTWFwJztcbmV4cG9ydCBmdW5jdGlvbiBkZWxheVdoZW4oZGVsYXlEdXJhdGlvblNlbGVjdG9yLCBzdWJzY3JpcHRpb25EZWxheSkge1xuICAgIGlmIChzdWJzY3JpcHRpb25EZWxheSkge1xuICAgICAgICByZXR1cm4gKHNvdXJjZSkgPT4gY29uY2F0KHN1YnNjcmlwdGlvbkRlbGF5LnBpcGUodGFrZSgxKSwgaWdub3JlRWxlbWVudHMoKSksIHNvdXJjZS5waXBlKGRlbGF5V2hlbihkZWxheUR1cmF0aW9uU2VsZWN0b3IpKSk7XG4gICAgfVxuICAgIHJldHVybiBtZXJnZU1hcCgodmFsdWUsIGluZGV4KSA9PiBkZWxheUR1cmF0aW9uU2VsZWN0b3IodmFsdWUsIGluZGV4KS5waXBlKHRha2UoMSksIG1hcFRvKHZhbHVlKSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVsYXlXaGVuLmpzLm1hcCIsImltcG9ydCB7IGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IGRlbGF5V2hlbiB9IGZyb20gJy4vZGVsYXlXaGVuJztcbmltcG9ydCB7IHRpbWVyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS90aW1lcic7XG5leHBvcnQgZnVuY3Rpb24gZGVsYXkoZHVlLCBzY2hlZHVsZXIgPSBhc3luY1NjaGVkdWxlcikge1xuICAgIGNvbnN0IGR1cmF0aW9uID0gdGltZXIoZHVlLCBzY2hlZHVsZXIpO1xuICAgIHJldHVybiBkZWxheVdoZW4oKCkgPT4gZHVyYXRpb24pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVsYXkuanMubWFwIiwiaW1wb3J0IHsgb2JzZXJ2ZU5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL05vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBkZW1hdGVyaWFsaXplKCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIChub3RpZmljYXRpb24pID0+IG9ic2VydmVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uLCBzdWJzY3JpYmVyKSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGVtYXRlcmlhbGl6ZS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0KGtleVNlbGVjdG9yLCBmbHVzaGVzKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBjb25zdCBkaXN0aW5jdEtleXMgPSBuZXcgU2V0KCk7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGtleSA9IGtleVNlbGVjdG9yID8ga2V5U2VsZWN0b3IodmFsdWUpIDogdmFsdWU7XG4gICAgICAgICAgICBpZiAoIWRpc3RpbmN0S2V5cy5oYXMoa2V5KSkge1xuICAgICAgICAgICAgICAgIGRpc3RpbmN0S2V5cy5hZGQoa2V5KTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICAgIGZsdXNoZXMgPT09IG51bGwgfHwgZmx1c2hlcyA9PT0gdm9pZCAwID8gdm9pZCAwIDogZmx1c2hlcy5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoKSA9PiBkaXN0aW5jdEtleXMuY2xlYXIoKSwgbm9vcCkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzdGluY3QuanMubWFwIiwiaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxDaGFuZ2VkKGNvbXBhcmF0b3IsIGtleVNlbGVjdG9yID0gaWRlbnRpdHkpIHtcbiAgICBjb21wYXJhdG9yID0gY29tcGFyYXRvciAhPT0gbnVsbCAmJiBjb21wYXJhdG9yICE9PSB2b2lkIDAgPyBjb21wYXJhdG9yIDogZGVmYXVsdENvbXBhcmU7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgcHJldmlvdXNLZXk7XG4gICAgICAgIGxldCBmaXJzdCA9IHRydWU7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRLZXkgPSBrZXlTZWxlY3Rvcih2YWx1ZSk7XG4gICAgICAgICAgICBpZiAoZmlyc3QgfHwgIWNvbXBhcmF0b3IocHJldmlvdXNLZXksIGN1cnJlbnRLZXkpKSB7XG4gICAgICAgICAgICAgICAgZmlyc3QgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBwcmV2aW91c0tleSA9IGN1cnJlbnRLZXk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoYSwgYikge1xuICAgIHJldHVybiBhID09PSBiO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGlzdGluY3RVbnRpbENoYW5nZWQuanMubWFwIiwiaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICcuL2Rpc3RpbmN0VW50aWxDaGFuZ2VkJztcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZChrZXksIGNvbXBhcmUpIHtcbiAgICByZXR1cm4gZGlzdGluY3RVbnRpbENoYW5nZWQoKHgsIHkpID0+IGNvbXBhcmUgPyBjb21wYXJlKHhba2V5XSwgeVtrZXldKSA6IHhba2V5XSA9PT0geVtrZXldKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkLmpzLm1hcCIsImltcG9ydCB7IEVtcHR5RXJyb3IgfSBmcm9tICcuLi91dGlsL0VtcHR5RXJyb3InO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gdGhyb3dJZkVtcHR5KGVycm9yRmFjdG9yeSA9IGRlZmF1bHRFcnJvckZhY3RvcnkpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBoYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICB9LCAoKSA9PiAoaGFzVmFsdWUgPyBzdWJzY3JpYmVyLmNvbXBsZXRlKCkgOiBzdWJzY3JpYmVyLmVycm9yKGVycm9yRmFjdG9yeSgpKSkpKTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGRlZmF1bHRFcnJvckZhY3RvcnkoKSB7XG4gICAgcmV0dXJuIG5ldyBFbXB0eUVycm9yKCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aHJvd0lmRW1wdHkuanMubWFwIiwiaW1wb3J0IHsgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IgfSBmcm9tICcuLi91dGlsL0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7IHRocm93SWZFbXB0eSB9IGZyb20gJy4vdGhyb3dJZkVtcHR5JztcbmltcG9ydCB7IGRlZmF1bHRJZkVtcHR5IH0gZnJvbSAnLi9kZWZhdWx0SWZFbXB0eSc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAnLi90YWtlJztcbmV4cG9ydCBmdW5jdGlvbiBlbGVtZW50QXQoaW5kZXgsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yKCk7XG4gICAgfVxuICAgIGNvbnN0IGhhc0RlZmF1bHRWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMjtcbiAgICByZXR1cm4gKHNvdXJjZSkgPT4gc291cmNlLnBpcGUoZmlsdGVyKCh2LCBpKSA9PiBpID09PSBpbmRleCksIHRha2UoMSksIGhhc0RlZmF1bHRWYWx1ZSA/IGRlZmF1bHRJZkVtcHR5KGRlZmF1bHRWYWx1ZSkgOiB0aHJvd0lmRW1wdHkoKCkgPT4gbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yKCkpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWVsZW1lbnRBdC5qcy5tYXAiLCJpbXBvcnQgeyBjb25jYXQgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2NvbmNhdCc7XG5pbXBvcnQgeyBvZiB9IGZyb20gJy4uL29ic2VydmFibGUvb2YnO1xuZXhwb3J0IGZ1bmN0aW9uIGVuZFdpdGgoLi4udmFsdWVzKSB7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IGNvbmNhdChzb3VyY2UsIG9mKC4uLnZhbHVlcykpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZW5kV2l0aC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBldmVyeShwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghcHJlZGljYXRlLmNhbGwodGhpc0FyZywgdmFsdWUsIGluZGV4KyssIHNvdXJjZSkpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHRydWUpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ldmVyeS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBleGhhdXN0QWxsKCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGlzQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgbGV0IGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIChpbm5lcikgPT4ge1xuICAgICAgICAgICAgaWYgKCFpbm5lclN1Yikge1xuICAgICAgICAgICAgICAgIGlubmVyU3ViID0gaW5uZXJGcm9tKGlubmVyKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB1bmRlZmluZWQsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaW5uZXJTdWIgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBpc0NvbXBsZXRlICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgIWlubmVyU3ViICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhoYXVzdEFsbC5qcy5tYXAiLCJpbXBvcnQgeyBleGhhdXN0QWxsIH0gZnJvbSAnLi9leGhhdXN0QWxsJztcbmV4cG9ydCBjb25zdCBleGhhdXN0ID0gZXhoYXVzdEFsbDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWV4aGF1c3QuanMubWFwIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZXhoYXVzdE1hcChwcm9qZWN0LCByZXN1bHRTZWxlY3Rvcikge1xuICAgIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgICAgICByZXR1cm4gKHNvdXJjZSkgPT4gc291cmNlLnBpcGUoZXhoYXVzdE1hcCgoYSwgaSkgPT4gaW5uZXJGcm9tKHByb2plY3QoYSwgaSkpLnBpcGUobWFwKChiLCBpaSkgPT4gcmVzdWx0U2VsZWN0b3IoYSwgYiwgaSwgaWkpKSkpKTtcbiAgICB9XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBsZXQgaW5uZXJTdWIgPSBudWxsO1xuICAgICAgICBsZXQgaXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKG91dGVyVmFsdWUpID0+IHtcbiAgICAgICAgICAgIGlmICghaW5uZXJTdWIpIHtcbiAgICAgICAgICAgICAgICBpbm5lclN1YiA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgaXNDb21wbGV0ZSAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaW5uZXJGcm9tKHByb2plY3Qob3V0ZXJWYWx1ZSwgaW5kZXgrKykpLnN1YnNjcmliZShpbm5lclN1Yik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgIWlubmVyU3ViICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZXhoYXVzdE1hcC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG1lcmdlSW50ZXJuYWxzIH0gZnJvbSAnLi9tZXJnZUludGVybmFscyc7XG5leHBvcnQgZnVuY3Rpb24gZXhwYW5kKHByb2plY3QsIGNvbmN1cnJlbnQgPSBJbmZpbml0eSwgc2NoZWR1bGVyKSB7XG4gICAgY29uY3VycmVudCA9IChjb25jdXJyZW50IHx8IDApIDwgMSA/IEluZmluaXR5IDogY29uY3VycmVudDtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiBtZXJnZUludGVybmFscyhzb3VyY2UsIHN1YnNjcmliZXIsIHByb2plY3QsIGNvbmN1cnJlbnQsIHVuZGVmaW5lZCwgdHJ1ZSwgc2NoZWR1bGVyKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1leHBhbmQuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgZnVuY3Rpb24gZmluYWxpemUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICB9XG4gICAgICAgIGZpbmFsbHkge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maW5hbGl6ZS5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBmaW5kKHByZWRpY2F0ZSwgdGhpc0FyZykge1xuICAgIHJldHVybiBvcGVyYXRlKGNyZWF0ZUZpbmQocHJlZGljYXRlLCB0aGlzQXJnLCAndmFsdWUnKSk7XG59XG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlRmluZChwcmVkaWNhdGUsIHRoaXNBcmcsIGVtaXQpIHtcbiAgICBjb25zdCBmaW5kSW5kZXggPSBlbWl0ID09PSAnaW5kZXgnO1xuICAgIHJldHVybiAoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGkgPSBpbmRleCsrO1xuICAgICAgICAgICAgaWYgKHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcsIHZhbHVlLCBpLCBzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGZpbmRJbmRleCA/IGkgOiB2YWx1ZSk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoZmluZEluZGV4ID8gLTEgOiB1bmRlZmluZWQpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KSk7XG4gICAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbmQuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBjcmVhdGVGaW5kIH0gZnJvbSAnLi9maW5kJztcbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXgocHJlZGljYXRlLCB0aGlzQXJnKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoY3JlYXRlRmluZChwcmVkaWNhdGUsIHRoaXNBcmcsICdpbmRleCcpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZpbmRJbmRleC5qcy5tYXAiLCJpbXBvcnQgeyBFbXB0eUVycm9yIH0gZnJvbSAnLi4vdXRpbC9FbXB0eUVycm9yJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICcuL3Rha2UnO1xuaW1wb3J0IHsgZGVmYXVsdElmRW1wdHkgfSBmcm9tICcuL2RlZmF1bHRJZkVtcHR5JztcbmltcG9ydCB7IHRocm93SWZFbXB0eSB9IGZyb20gJy4vdGhyb3dJZkVtcHR5JztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5leHBvcnQgZnVuY3Rpb24gZmlyc3QocHJlZGljYXRlLCBkZWZhdWx0VmFsdWUpIHtcbiAgICBjb25zdCBoYXNEZWZhdWx0VmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID49IDI7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IHNvdXJjZS5waXBlKHByZWRpY2F0ZSA/IGZpbHRlcigodiwgaSkgPT4gcHJlZGljYXRlKHYsIGksIHNvdXJjZSkpIDogaWRlbnRpdHksIHRha2UoMSksIGhhc0RlZmF1bHRWYWx1ZSA/IGRlZmF1bHRJZkVtcHR5KGRlZmF1bHRWYWx1ZSkgOiB0aHJvd0lmRW1wdHkoKCkgPT4gbmV3IEVtcHR5RXJyb3IoKSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Zmlyc3QuanMubWFwIiwiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gZ3JvdXBCeShrZXlTZWxlY3RvciwgZWxlbWVudE9yT3B0aW9ucywgZHVyYXRpb24sIGNvbm5lY3Rvcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGVsZW1lbnQ7XG4gICAgICAgIGlmICghZWxlbWVudE9yT3B0aW9ucyB8fCB0eXBlb2YgZWxlbWVudE9yT3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgZWxlbWVudCA9IGVsZW1lbnRPck9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAoeyBkdXJhdGlvbiwgZWxlbWVudCwgY29ubmVjdG9yIH0gPSBlbGVtZW50T3JPcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBncm91cHMgPSBuZXcgTWFwKCk7XG4gICAgICAgIGNvbnN0IG5vdGlmeSA9IChjYikgPT4ge1xuICAgICAgICAgICAgZ3JvdXBzLmZvckVhY2goY2IpO1xuICAgICAgICAgICAgY2Ioc3Vic2NyaWJlcik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKGVycikgPT4gbm90aWZ5KChjb25zdW1lcikgPT4gY29uc3VtZXIuZXJyb3IoZXJyKSk7XG4gICAgICAgIGNvbnN0IGdyb3VwQnlTb3VyY2VTdWJzY3JpYmVyID0gbmV3IEdyb3VwQnlTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBrZXkgPSBrZXlTZWxlY3Rvcih2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbGV0IGdyb3VwID0gZ3JvdXBzLmdldChrZXkpO1xuICAgICAgICAgICAgICAgIGlmICghZ3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgZ3JvdXBzLnNldChrZXksIChncm91cCA9IGNvbm5lY3RvciA/IGNvbm5lY3RvcigpIDogbmV3IFN1YmplY3QoKSkpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBncm91cGVkID0gY3JlYXRlR3JvdXBlZE9ic2VydmFibGUoa2V5LCBncm91cCk7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChncm91cGVkKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkdXJhdGlvblN1YnNjcmliZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKGdyb3VwLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXAuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvblN1YnNjcmliZXIgPT09IG51bGwgfHwgZHVyYXRpb25TdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkdXJhdGlvblN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCAoKSA9PiBncm91cHMuZGVsZXRlKGtleSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeVNvdXJjZVN1YnNjcmliZXIuYWRkKGlubmVyRnJvbShkdXJhdGlvbihncm91cGVkKSkuc3Vic2NyaWJlKGR1cmF0aW9uU3Vic2NyaWJlcikpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdyb3VwLm5leHQoZWxlbWVudCA/IGVsZW1lbnQodmFsdWUpIDogdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IG5vdGlmeSgoY29uc3VtZXIpID0+IGNvbnN1bWVyLmNvbXBsZXRlKCkpLCBoYW5kbGVFcnJvciwgKCkgPT4gZ3JvdXBzLmNsZWFyKCkpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKGdyb3VwQnlTb3VyY2VTdWJzY3JpYmVyKTtcbiAgICAgICAgZnVuY3Rpb24gY3JlYXRlR3JvdXBlZE9ic2VydmFibGUoa2V5LCBncm91cFN1YmplY3QpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlc3VsdCA9IG5ldyBPYnNlcnZhYmxlKChncm91cFN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgICAgICBncm91cEJ5U291cmNlU3Vic2NyaWJlci5hY3RpdmVHcm91cHMrKztcbiAgICAgICAgICAgICAgICBjb25zdCBpbm5lclN1YiA9IGdyb3VwU3ViamVjdC5zdWJzY3JpYmUoZ3JvdXBTdWJzY3JpYmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICAtLWdyb3VwQnlTb3VyY2VTdWJzY3JpYmVyLmFjdGl2ZUdyb3VwcyA9PT0gMCAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBCeVNvdXJjZVN1YnNjcmliZXIudGVhcmRvd25BdHRlbXB0ZWQgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwQnlTb3VyY2VTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzdWx0LmtleSA9IGtleTtcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmNsYXNzIEdyb3VwQnlTdWJzY3JpYmVyIGV4dGVuZHMgT3BlcmF0b3JTdWJzY3JpYmVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoLi4uYXJndW1lbnRzKTtcbiAgICAgICAgdGhpcy5hY3RpdmVHcm91cHMgPSAwO1xuICAgICAgICB0aGlzLnRlYXJkb3duQXR0ZW1wdGVkID0gZmFsc2U7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICB0aGlzLnRlYXJkb3duQXR0ZW1wdGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hY3RpdmVHcm91cHMgPT09IDAgJiYgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1ncm91cEJ5LmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIGlzRW1wdHkoKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGZhbHNlKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHRydWUpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1pc0VtcHR5LmpzLm1hcCIsImltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiB0YWtlTGFzdChjb3VudCkge1xuICAgIHJldHVybiBjb3VudCA8PSAwXG4gICAgICAgID8gKCkgPT4gRU1QVFlcbiAgICAgICAgOiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBbXTtcbiAgICAgICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBidWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgY291bnQgPCBidWZmZXIubGVuZ3RoICYmIGJ1ZmZlci5zaGlmdCgpO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgdmFsdWUgb2YgYnVmZmVyKSB7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH0sIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGJ1ZmZlciA9IG51bGw7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGFrZUxhc3QuanMubWFwIiwiaW1wb3J0IHsgRW1wdHlFcnJvciB9IGZyb20gJy4uL3V0aWwvRW1wdHlFcnJvcic7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQgeyB0YWtlTGFzdCB9IGZyb20gJy4vdGFrZUxhc3QnO1xuaW1wb3J0IHsgdGhyb3dJZkVtcHR5IH0gZnJvbSAnLi90aHJvd0lmRW1wdHknO1xuaW1wb3J0IHsgZGVmYXVsdElmRW1wdHkgfSBmcm9tICcuL2RlZmF1bHRJZkVtcHR5JztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5leHBvcnQgZnVuY3Rpb24gbGFzdChwcmVkaWNhdGUsIGRlZmF1bHRWYWx1ZSkge1xuICAgIGNvbnN0IGhhc0RlZmF1bHRWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMjtcbiAgICByZXR1cm4gKHNvdXJjZSkgPT4gc291cmNlLnBpcGUocHJlZGljYXRlID8gZmlsdGVyKCh2LCBpKSA9PiBwcmVkaWNhdGUodiwgaSwgc291cmNlKSkgOiBpZGVudGl0eSwgdGFrZUxhc3QoMSksIGhhc0RlZmF1bHRWYWx1ZSA/IGRlZmF1bHRJZkVtcHR5KGRlZmF1bHRWYWx1ZSkgOiB0aHJvd0lmRW1wdHkoKCkgPT4gbmV3IEVtcHR5RXJyb3IoKSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bGFzdC5qcy5tYXAiLCJpbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gbWF0ZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpKTtcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KE5vdGlmaWNhdGlvbi5jcmVhdGVFcnJvcihlcnIpKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWF0ZXJpYWxpemUuanMubWFwIiwiaW1wb3J0IHsgcmVkdWNlIH0gZnJvbSAnLi9yZWR1Y2UnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gbWF4KGNvbXBhcmVyKSB7XG4gICAgcmV0dXJuIHJlZHVjZShpc0Z1bmN0aW9uKGNvbXBhcmVyKSA/ICh4LCB5KSA9PiAoY29tcGFyZXIoeCwgeSkgPiAwID8geCA6IHkpIDogKHgsIHkpID0+ICh4ID4geSA/IHggOiB5KSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYXguanMubWFwIiwiaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICcuL21lcmdlTWFwJztcbmV4cG9ydCBjb25zdCBmbGF0TWFwID0gbWVyZ2VNYXA7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mbGF0TWFwLmpzLm1hcCIsImltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAnLi9tZXJnZU1hcCc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZU1hcFRvKGlubmVyT2JzZXJ2YWJsZSwgcmVzdWx0U2VsZWN0b3IsIGNvbmN1cnJlbnQgPSBJbmZpbml0eSkge1xuICAgIGlmIChpc0Z1bmN0aW9uKHJlc3VsdFNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gbWVyZ2VNYXAoKCkgPT4gaW5uZXJPYnNlcnZhYmxlLCByZXN1bHRTZWxlY3RvciwgY29uY3VycmVudCk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGNvbmN1cnJlbnQgPSByZXN1bHRTZWxlY3RvcjtcbiAgICB9XG4gICAgcmV0dXJuIG1lcmdlTWFwKCgpID0+IGlubmVyT2JzZXJ2YWJsZSwgY29uY3VycmVudCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tZXJnZU1hcFRvLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgbWVyZ2VJbnRlcm5hbHMgfSBmcm9tICcuL21lcmdlSW50ZXJuYWxzJztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVNjYW4oYWNjdW11bGF0b3IsIHNlZWQsIGNvbmN1cnJlbnQgPSBJbmZpbml0eSkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHN0YXRlID0gc2VlZDtcbiAgICAgICAgcmV0dXJuIG1lcmdlSW50ZXJuYWxzKHNvdXJjZSwgc3Vic2NyaWJlciwgKHZhbHVlLCBpbmRleCkgPT4gYWNjdW11bGF0b3Ioc3RhdGUsIHZhbHVlLCBpbmRleCksIGNvbmN1cnJlbnQsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgc3RhdGUgPSB2YWx1ZTtcbiAgICAgICAgfSwgZmFsc2UsIHVuZGVmaW5lZCwgKCkgPT4gKHN0YXRlID0gbnVsbCkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2VTY2FuLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgYXJnc09yQXJnQXJyYXkgfSBmcm9tICcuLi91dGlsL2FyZ3NPckFyZ0FycmF5JztcbmltcG9ydCB7IG1lcmdlQWxsIH0gZnJvbSAnLi9tZXJnZUFsbCc7XG5pbXBvcnQgeyBwb3BOdW1iZXIsIHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcbmV4cG9ydCBmdW5jdGlvbiBtZXJnZSguLi5hcmdzKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gcG9wU2NoZWR1bGVyKGFyZ3MpO1xuICAgIGNvbnN0IGNvbmN1cnJlbnQgPSBwb3BOdW1iZXIoYXJncywgSW5maW5pdHkpO1xuICAgIGFyZ3MgPSBhcmdzT3JBcmdBcnJheShhcmdzKTtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIG1lcmdlQWxsKGNvbmN1cnJlbnQpKGZyb20oW3NvdXJjZSwgLi4uYXJnc10sIHNjaGVkdWxlcikpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlLmpzLm1hcCIsImltcG9ydCB7IG1lcmdlIH0gZnJvbSAnLi9tZXJnZSc7XG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VXaXRoKC4uLm90aGVyU291cmNlcykge1xuICAgIHJldHVybiBtZXJnZSguLi5vdGhlclNvdXJjZXMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVyZ2VXaXRoLmpzLm1hcCIsImltcG9ydCB7IHJlZHVjZSB9IGZyb20gJy4vcmVkdWNlJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuZXhwb3J0IGZ1bmN0aW9uIG1pbihjb21wYXJlcikge1xuICAgIHJldHVybiByZWR1Y2UoaXNGdW5jdGlvbihjb21wYXJlcikgPyAoeCwgeSkgPT4gKGNvbXBhcmVyKHgsIHkpIDwgMCA/IHggOiB5KSA6ICh4LCB5KSA9PiAoeCA8IHkgPyB4IDogeSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWluLmpzLm1hcCIsImltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJy4vY29ubmVjdCc7XG5leHBvcnQgZnVuY3Rpb24gbXVsdGljYXN0KHN1YmplY3RPclN1YmplY3RGYWN0b3J5LCBzZWxlY3Rvcikge1xuICAgIGNvbnN0IHN1YmplY3RGYWN0b3J5ID0gaXNGdW5jdGlvbihzdWJqZWN0T3JTdWJqZWN0RmFjdG9yeSkgPyBzdWJqZWN0T3JTdWJqZWN0RmFjdG9yeSA6ICgpID0+IHN1YmplY3RPclN1YmplY3RGYWN0b3J5O1xuICAgIGlmIChpc0Z1bmN0aW9uKHNlbGVjdG9yKSkge1xuICAgICAgICByZXR1cm4gY29ubmVjdChzZWxlY3Rvciwge1xuICAgICAgICAgICAgY29ubmVjdG9yOiBzdWJqZWN0RmFjdG9yeSxcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiAoc291cmNlKSA9PiBuZXcgQ29ubmVjdGFibGVPYnNlcnZhYmxlKHNvdXJjZSwgc3ViamVjdEZhY3RvcnkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bXVsdGljYXN0LmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHBhaXJ3aXNlKCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHByZXY7XG4gICAgICAgIGxldCBoYXNQcmV2ID0gZmFsc2U7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHAgPSBwcmV2O1xuICAgICAgICAgICAgcHJldiA9IHZhbHVlO1xuICAgICAgICAgICAgaGFzUHJldiAmJiBzdWJzY3JpYmVyLm5leHQoW3AsIHZhbHVlXSk7XG4gICAgICAgICAgICBoYXNQcmV2ID0gdHJ1ZTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFpcndpc2UuanMubWFwIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuZXhwb3J0IGZ1bmN0aW9uIHBsdWNrKC4uLnByb3BlcnRpZXMpIHtcbiAgICBjb25zdCBsZW5ndGggPSBwcm9wZXJ0aWVzLmxlbmd0aDtcbiAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignbGlzdCBvZiBwcm9wZXJ0aWVzIGNhbm5vdCBiZSBlbXB0eS4nKTtcbiAgICB9XG4gICAgcmV0dXJuIG1hcCgoeCkgPT4ge1xuICAgICAgICBsZXQgY3VycmVudFByb3AgPSB4O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwID0gY3VycmVudFByb3AgPT09IG51bGwgfHwgY3VycmVudFByb3AgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGN1cnJlbnRQcm9wW3Byb3BlcnRpZXNbaV1dO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRQcm9wID0gcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGN1cnJlbnRQcm9wO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGx1Y2suanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgbXVsdGljYXN0IH0gZnJvbSAnLi9tdWx0aWNhc3QnO1xuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJy4vY29ubmVjdCc7XG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaChzZWxlY3Rvcikge1xuICAgIHJldHVybiBzZWxlY3RvciA/IChzb3VyY2UpID0+IGNvbm5lY3Qoc2VsZWN0b3IpKHNvdXJjZSkgOiAoc291cmNlKSA9PiBtdWx0aWNhc3QobmV3IFN1YmplY3QoKSkoc291cmNlKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXB1Ymxpc2guanMubWFwIiwiaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0IH0gZnJvbSAnLi4vQmVoYXZpb3JTdWJqZWN0JztcbmltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoQmVoYXZpb3IoaW5pdGlhbFZhbHVlKSB7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IG5ldyBCZWhhdmlvclN1YmplY3QoaW5pdGlhbFZhbHVlKTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb25uZWN0YWJsZU9ic2VydmFibGUoc291cmNlLCAoKSA9PiBzdWJqZWN0KTtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHVibGlzaEJlaGF2aW9yLmpzLm1hcCIsImltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4uL0FzeW5jU3ViamVjdCc7XG5pbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaExhc3QoKSB7XG4gICAgcmV0dXJuIChzb3VyY2UpID0+IHtcbiAgICAgICAgY29uc3Qgc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3QoKTtcbiAgICAgICAgcmV0dXJuIG5ldyBDb25uZWN0YWJsZU9ic2VydmFibGUoc291cmNlLCAoKSA9PiBzdWJqZWN0KTtcbiAgICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cHVibGlzaExhc3QuanMubWFwIiwiaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJy4uL1JlcGxheVN1YmplY3QnO1xuaW1wb3J0IHsgbXVsdGljYXN0IH0gZnJvbSAnLi9tdWx0aWNhc3QnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaFJlcGxheShidWZmZXJTaXplLCB3aW5kb3dUaW1lLCBzZWxlY3Rvck9yU2NoZWR1bGVyLCB0aW1lc3RhbXBQcm92aWRlcikge1xuICAgIGlmIChzZWxlY3Rvck9yU2NoZWR1bGVyICYmICFpc0Z1bmN0aW9uKHNlbGVjdG9yT3JTY2hlZHVsZXIpKSB7XG4gICAgICAgIHRpbWVzdGFtcFByb3ZpZGVyID0gc2VsZWN0b3JPclNjaGVkdWxlcjtcbiAgICB9XG4gICAgY29uc3Qgc2VsZWN0b3IgPSBpc0Z1bmN0aW9uKHNlbGVjdG9yT3JTY2hlZHVsZXIpID8gc2VsZWN0b3JPclNjaGVkdWxlciA6IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gKHNvdXJjZSkgPT4gbXVsdGljYXN0KG5ldyBSZXBsYXlTdWJqZWN0KGJ1ZmZlclNpemUsIHdpbmRvd1RpbWUsIHRpbWVzdGFtcFByb3ZpZGVyKSwgc2VsZWN0b3IpKHNvdXJjZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wdWJsaXNoUmVwbGF5LmpzLm1hcCIsImltcG9ydCB7IHJhY2VJbml0IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9yYWNlJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiByYWNlV2l0aCguLi5vdGhlclNvdXJjZXMpIHtcbiAgICByZXR1cm4gIW90aGVyU291cmNlcy5sZW5ndGhcbiAgICAgICAgPyBpZGVudGl0eVxuICAgICAgICA6IG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAgICAgcmFjZUluaXQoW3NvdXJjZSwgLi4ub3RoZXJTb3VyY2VzXSkoc3Vic2NyaWJlcik7XG4gICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmFjZVdpdGguanMubWFwIiwiaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgdGltZXIgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3RpbWVyJztcbmV4cG9ydCBmdW5jdGlvbiByZXBlYXQoY291bnRPckNvbmZpZykge1xuICAgIGxldCBjb3VudCA9IEluZmluaXR5O1xuICAgIGxldCBkZWxheTtcbiAgICBpZiAoY291bnRPckNvbmZpZyAhPSBudWxsKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY291bnRPckNvbmZpZyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICh7IGNvdW50ID0gSW5maW5pdHksIGRlbGF5IH0gPSBjb3VudE9yQ29uZmlnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvdW50ID0gY291bnRPckNvbmZpZztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY291bnQgPD0gMFxuICAgICAgICA/ICgpID0+IEVNUFRZXG4gICAgICAgIDogb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICBsZXQgc29GYXIgPSAwO1xuICAgICAgICAgICAgbGV0IHNvdXJjZVN1YjtcbiAgICAgICAgICAgIGNvbnN0IHJlc3Vic2NyaWJlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNvdXJjZVN1YiA9PT0gbnVsbCB8fCBzb3VyY2VTdWIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNvdXJjZVN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIHNvdXJjZVN1YiA9IG51bGw7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGF5ICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm90aWZpZXIgPSB0eXBlb2YgZGVsYXkgPT09ICdudW1iZXInID8gdGltZXIoZGVsYXkpIDogaW5uZXJGcm9tKGRlbGF5KHNvRmFyKSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdGlmaWVyU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbm90aWZpZXJTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb1NvdXJjZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbm90aWZpZXIuc3Vic2NyaWJlKG5vdGlmaWVyU3Vic2NyaWJlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVUb1NvdXJjZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVUb1NvdXJjZSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3luY1Vuc3ViID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc291cmNlU3ViID0gc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHVuZGVmaW5lZCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoKytzb0ZhciA8IGNvdW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoc291cmNlU3ViKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN5bmNVbnN1YiA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgaWYgKHN5bmNVbnN1Yikge1xuICAgICAgICAgICAgICAgICAgICByZXN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBzdWJzY3JpYmVUb1NvdXJjZSgpO1xuICAgICAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJlcGVhdC5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiByZXBlYXRXaGVuKG5vdGlmaWVyKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgaW5uZXJTdWI7XG4gICAgICAgIGxldCBzeW5jUmVzdWIgPSBmYWxzZTtcbiAgICAgICAgbGV0IGNvbXBsZXRpb25zJDtcbiAgICAgICAgbGV0IGlzTm90aWZpZXJDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgaXNNYWluQ29tcGxldGUgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgY2hlY2tDb21wbGV0ZSA9ICgpID0+IGlzTWFpbkNvbXBsZXRlICYmIGlzTm90aWZpZXJDb21wbGV0ZSAmJiAoc3Vic2NyaWJlci5jb21wbGV0ZSgpLCB0cnVlKTtcbiAgICAgICAgY29uc3QgZ2V0Q29tcGxldGlvblN1YmplY3QgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIWNvbXBsZXRpb25zJCkge1xuICAgICAgICAgICAgICAgIGNvbXBsZXRpb25zJCA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICAgICAgbm90aWZpZXIoY29tcGxldGlvbnMkKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpbm5lclN1Yikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlRm9yUmVwZWF0V2hlbigpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3luY1Jlc3ViID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaXNOb3RpZmllckNvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tDb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjb21wbGV0aW9ucyQ7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHN1YnNjcmliZUZvclJlcGVhdFdoZW4gPSAoKSA9PiB7XG4gICAgICAgICAgICBpc01haW5Db21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICAgICAgaW5uZXJTdWIgPSBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgaXNNYWluQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICFjaGVja0NvbXBsZXRlKCkgJiYgZ2V0Q29tcGxldGlvblN1YmplY3QoKS5uZXh0KCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBpZiAoc3luY1Jlc3ViKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgICAgICBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgICAgICAgICAgc3luY1Jlc3ViID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlRm9yUmVwZWF0V2hlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzdWJzY3JpYmVGb3JSZXBlYXRXaGVuKCk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXBlYXRXaGVuLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IHRpbWVyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS90aW1lcic7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5leHBvcnQgZnVuY3Rpb24gcmV0cnkoY29uZmlnT3JDb3VudCA9IEluZmluaXR5KSB7XG4gICAgbGV0IGNvbmZpZztcbiAgICBpZiAoY29uZmlnT3JDb3VudCAmJiB0eXBlb2YgY29uZmlnT3JDb3VudCA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgY29uZmlnID0gY29uZmlnT3JDb3VudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGNvbmZpZyA9IHtcbiAgICAgICAgICAgIGNvdW50OiBjb25maWdPckNvdW50LFxuICAgICAgICB9O1xuICAgIH1cbiAgICBjb25zdCB7IGNvdW50ID0gSW5maW5pdHksIGRlbGF5LCByZXNldE9uU3VjY2VzczogcmVzZXRPblN1Y2Nlc3MgPSBmYWxzZSB9ID0gY29uZmlnO1xuICAgIHJldHVybiBjb3VudCA8PSAwXG4gICAgICAgID8gaWRlbnRpdHlcbiAgICAgICAgOiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGxldCBzb0ZhciA9IDA7XG4gICAgICAgICAgICBsZXQgaW5uZXJTdWI7XG4gICAgICAgICAgICBjb25zdCBzdWJzY3JpYmVGb3JSZXRyeSA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgc3luY1Vuc3ViID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgaW5uZXJTdWIgPSBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNldE9uU3VjY2Vzcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc29GYXIgPSAwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgfSwgdW5kZWZpbmVkLCAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzb0ZhcisrIDwgY291bnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHJlc3ViID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbm5lclN1Yikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbm5lclN1YiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZUZvclJldHJ5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzeW5jVW5zdWIgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGVsYXkgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG5vdGlmaWVyID0gdHlwZW9mIGRlbGF5ID09PSAnbnVtYmVyJyA/IHRpbWVyKGRlbGF5KSA6IGlubmVyRnJvbShkZWxheShlcnIsIHNvRmFyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3Qgbm90aWZpZXJTdWJzY3JpYmVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGlmaWVyU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1YigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdGlmaWVyLnN1YnNjcmliZShub3RpZmllclN1YnNjcmliZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICBpZiAoc3luY1Vuc3ViKSB7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlubmVyU3ViID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgc3Vic2NyaWJlRm9yUmV0cnkoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgc3Vic2NyaWJlRm9yUmV0cnkoKTtcbiAgICAgICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXRyeS5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiByZXRyeVdoZW4obm90aWZpZXIpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCBpbm5lclN1YjtcbiAgICAgICAgbGV0IHN5bmNSZXN1YiA9IGZhbHNlO1xuICAgICAgICBsZXQgZXJyb3JzJDtcbiAgICAgICAgY29uc3Qgc3Vic2NyaWJlRm9yUmV0cnlXaGVuID0gKCkgPT4ge1xuICAgICAgICAgICAgaW5uZXJTdWIgPSBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAoIWVycm9ycyQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzJCA9IG5ldyBTdWJqZWN0KCk7XG4gICAgICAgICAgICAgICAgICAgIG5vdGlmaWVyKGVycm9ycyQpLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICgpID0+IGlubmVyU3ViID8gc3Vic2NyaWJlRm9yUmV0cnlXaGVuKCkgOiAoc3luY1Jlc3ViID0gdHJ1ZSkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGVycm9ycyQpIHtcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzJC5uZXh0KGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgaWYgKHN5bmNSZXN1Yikge1xuICAgICAgICAgICAgICAgIGlubmVyU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICAgICAgaW5uZXJTdWIgPSBudWxsO1xuICAgICAgICAgICAgICAgIHN5bmNSZXN1YiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZUZvclJldHJ5V2hlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBzdWJzY3JpYmVGb3JSZXRyeVdoZW4oKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJldHJ5V2hlbi5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZShub3RpZmllcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIGxldCBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBoYXNWYWx1ZSA9IHRydWU7XG4gICAgICAgICAgICBsYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfSkpO1xuICAgICAgICBjb25zdCBlbWl0ID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKGhhc1ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBjb25zdCB2YWx1ZSA9IGxhc3RWYWx1ZTtcbiAgICAgICAgICAgICAgICBsYXN0VmFsdWUgPSBudWxsO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIG5vdGlmaWVyLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGVtaXQsIG5vb3ApKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNhbXBsZS5qcy5tYXAiLCJpbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBzYW1wbGUgfSBmcm9tICcuL3NhbXBsZSc7XG5pbXBvcnQgeyBpbnRlcnZhbCB9IGZyb20gJy4uL29ic2VydmFibGUvaW50ZXJ2YWwnO1xuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZVRpbWUocGVyaW9kLCBzY2hlZHVsZXIgPSBhc3luY1NjaGVkdWxlcikge1xuICAgIHJldHVybiBzYW1wbGUoaW50ZXJ2YWwocGVyaW9kLCBzY2hlZHVsZXIpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNhbXBsZVRpbWUuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBzY2FuSW50ZXJuYWxzIH0gZnJvbSAnLi9zY2FuSW50ZXJuYWxzJztcbmV4cG9ydCBmdW5jdGlvbiBzY2FuKGFjY3VtdWxhdG9yLCBzZWVkKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoc2NhbkludGVybmFscyhhY2N1bXVsYXRvciwgc2VlZCwgYXJndW1lbnRzLmxlbmd0aCA+PSAyLCB0cnVlKSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zY2FuLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHNlcXVlbmNlRXF1YWwoY29tcGFyZVRvLCBjb21wYXJhdG9yID0gKGEsIGIpID0+IGEgPT09IGIpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGFTdGF0ZSA9IGNyZWF0ZVN0YXRlKCk7XG4gICAgICAgIGNvbnN0IGJTdGF0ZSA9IGNyZWF0ZVN0YXRlKCk7XG4gICAgICAgIGNvbnN0IGVtaXQgPSAoaXNFcXVhbCkgPT4ge1xuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KGlzRXF1YWwpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjcmVhdGVTdWJzY3JpYmVyID0gKHNlbGZTdGF0ZSwgb3RoZXJTdGF0ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgc2VxdWVuY2VFcXVhbFN1YnNjcmliZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsIChhKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBidWZmZXIsIGNvbXBsZXRlIH0gPSBvdGhlclN0YXRlO1xuICAgICAgICAgICAgICAgIGlmIChidWZmZXIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlID8gZW1pdChmYWxzZSkgOiBzZWxmU3RhdGUuYnVmZmVyLnB1c2goYSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAhY29tcGFyYXRvcihhLCBidWZmZXIuc2hpZnQoKSkgJiYgZW1pdChmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHNlbGZTdGF0ZS5jb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBjb21wbGV0ZSwgYnVmZmVyIH0gPSBvdGhlclN0YXRlO1xuICAgICAgICAgICAgICAgIGNvbXBsZXRlICYmIGVtaXQoYnVmZmVyLmxlbmd0aCA9PT0gMCk7XG4gICAgICAgICAgICAgICAgc2VxdWVuY2VFcXVhbFN1YnNjcmliZXIgPT09IG51bGwgfHwgc2VxdWVuY2VFcXVhbFN1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJldHVybiBzZXF1ZW5jZUVxdWFsU3Vic2NyaWJlcjtcbiAgICAgICAgfTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShjcmVhdGVTdWJzY3JpYmVyKGFTdGF0ZSwgYlN0YXRlKSk7XG4gICAgICAgIGNvbXBhcmVUby5zdWJzY3JpYmUoY3JlYXRlU3Vic2NyaWJlcihiU3RhdGUsIGFTdGF0ZSkpO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gY3JlYXRlU3RhdGUoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgYnVmZmVyOiBbXSxcbiAgICAgICAgY29tcGxldGU6IGZhbHNlLFxuICAgIH07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zZXF1ZW5jZUVxdWFsLmpzLm1hcCIsImltcG9ydCB7IGZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb20nO1xuaW1wb3J0IHsgdGFrZSB9IGZyb20gJy4uL29wZXJhdG9ycy90YWtlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFNhZmVTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmV4cG9ydCBmdW5jdGlvbiBzaGFyZShvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB7IGNvbm5lY3RvciA9ICgpID0+IG5ldyBTdWJqZWN0KCksIHJlc2V0T25FcnJvciA9IHRydWUsIHJlc2V0T25Db21wbGV0ZSA9IHRydWUsIHJlc2V0T25SZWZDb3VudFplcm8gPSB0cnVlIH0gPSBvcHRpb25zO1xuICAgIHJldHVybiAod3JhcHBlclNvdXJjZSkgPT4ge1xuICAgICAgICBsZXQgY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgIGxldCByZXNldENvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgICBsZXQgc3ViamVjdCA9IG51bGw7XG4gICAgICAgIGxldCByZWZDb3VudCA9IDA7XG4gICAgICAgIGxldCBoYXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgICAgICAgbGV0IGhhc0Vycm9yZWQgPSBmYWxzZTtcbiAgICAgICAgY29uc3QgY2FuY2VsUmVzZXQgPSAoKSA9PiB7XG4gICAgICAgICAgICByZXNldENvbm5lY3Rpb24gPT09IG51bGwgfHwgcmVzZXRDb25uZWN0aW9uID09PSB2b2lkIDAgPyB2b2lkIDAgOiByZXNldENvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHJlc2V0Q29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IHJlc2V0ID0gKCkgPT4ge1xuICAgICAgICAgICAgY2FuY2VsUmVzZXQoKTtcbiAgICAgICAgICAgIGNvbm5lY3Rpb24gPSBzdWJqZWN0ID0gbnVsbDtcbiAgICAgICAgICAgIGhhc0NvbXBsZXRlZCA9IGhhc0Vycm9yZWQgPSBmYWxzZTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgcmVzZXRBbmRVbnN1YnNjcmliZSA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbm4gPSBjb25uZWN0aW9uO1xuICAgICAgICAgICAgcmVzZXQoKTtcbiAgICAgICAgICAgIGNvbm4gPT09IG51bGwgfHwgY29ubiA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29ubi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgICAgICByZWZDb3VudCsrO1xuICAgICAgICAgICAgaWYgKCFoYXNFcnJvcmVkICYmICFoYXNDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICBjYW5jZWxSZXNldCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZGVzdCA9IChzdWJqZWN0ID0gc3ViamVjdCAhPT0gbnVsbCAmJiBzdWJqZWN0ICE9PSB2b2lkIDAgPyBzdWJqZWN0IDogY29ubmVjdG9yKCkpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlZkNvdW50LS07XG4gICAgICAgICAgICAgICAgaWYgKHJlZkNvdW50ID09PSAwICYmICFoYXNFcnJvcmVkICYmICFoYXNDb21wbGV0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzZXRDb25uZWN0aW9uID0gaGFuZGxlUmVzZXQocmVzZXRBbmRVbnN1YnNjcmliZSwgcmVzZXRPblJlZkNvdW50WmVybyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZXN0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgICAgIGlmICghY29ubmVjdGlvbikge1xuICAgICAgICAgICAgICAgIGNvbm5lY3Rpb24gPSBuZXcgU2FmZVN1YnNjcmliZXIoe1xuICAgICAgICAgICAgICAgICAgICBuZXh0OiAodmFsdWUpID0+IGRlc3QubmV4dCh2YWx1ZSksXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiAoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNFcnJvcmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbFJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNldENvbm5lY3Rpb24gPSBoYW5kbGVSZXNldChyZXNldCwgcmVzZXRPbkVycm9yLCBlcnIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhbmNlbFJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNldENvbm5lY3Rpb24gPSBoYW5kbGVSZXNldChyZXNldCwgcmVzZXRPbkNvbXBsZXRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3QuY29tcGxldGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmcm9tKHNvdXJjZSkuc3Vic2NyaWJlKGNvbm5lY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSh3cmFwcGVyU291cmNlKTtcbiAgICB9O1xufVxuZnVuY3Rpb24gaGFuZGxlUmVzZXQocmVzZXQsIG9uLCAuLi5hcmdzKSB7XG4gICAgaWYgKG9uID09PSB0cnVlKSB7XG4gICAgICAgIHJlc2V0KCk7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBpZiAob24gPT09IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gb24oLi4uYXJncylcbiAgICAgICAgLnBpcGUodGFrZSgxKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiByZXNldCgpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNoYXJlLmpzLm1hcCIsImltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICcuLi9SZXBsYXlTdWJqZWN0JztcbmltcG9ydCB7IHNoYXJlIH0gZnJvbSAnLi9zaGFyZSc7XG5leHBvcnQgZnVuY3Rpb24gc2hhcmVSZXBsYXkoY29uZmlnT3JCdWZmZXJTaXplLCB3aW5kb3dUaW1lLCBzY2hlZHVsZXIpIHtcbiAgICB2YXIgX2EsIF9iO1xuICAgIGxldCBidWZmZXJTaXplO1xuICAgIGxldCByZWZDb3VudCA9IGZhbHNlO1xuICAgIGlmIChjb25maWdPckJ1ZmZlclNpemUgJiYgdHlwZW9mIGNvbmZpZ09yQnVmZmVyU2l6ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgYnVmZmVyU2l6ZSA9IChfYSA9IGNvbmZpZ09yQnVmZmVyU2l6ZS5idWZmZXJTaXplKSAhPT0gbnVsbCAmJiBfYSAhPT0gdm9pZCAwID8gX2EgOiBJbmZpbml0eTtcbiAgICAgICAgd2luZG93VGltZSA9IChfYiA9IGNvbmZpZ09yQnVmZmVyU2l6ZS53aW5kb3dUaW1lKSAhPT0gbnVsbCAmJiBfYiAhPT0gdm9pZCAwID8gX2IgOiBJbmZpbml0eTtcbiAgICAgICAgcmVmQ291bnQgPSAhIWNvbmZpZ09yQnVmZmVyU2l6ZS5yZWZDb3VudDtcbiAgICAgICAgc2NoZWR1bGVyID0gY29uZmlnT3JCdWZmZXJTaXplLnNjaGVkdWxlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGJ1ZmZlclNpemUgPSBjb25maWdPckJ1ZmZlclNpemUgIT09IG51bGwgJiYgY29uZmlnT3JCdWZmZXJTaXplICE9PSB2b2lkIDAgPyBjb25maWdPckJ1ZmZlclNpemUgOiBJbmZpbml0eTtcbiAgICB9XG4gICAgcmV0dXJuIHNoYXJlKHtcbiAgICAgICAgY29ubmVjdG9yOiAoKSA9PiBuZXcgUmVwbGF5U3ViamVjdChidWZmZXJTaXplLCB3aW5kb3dUaW1lLCBzY2hlZHVsZXIpLFxuICAgICAgICByZXNldE9uRXJyb3I6IHRydWUsXG4gICAgICAgIHJlc2V0T25Db21wbGV0ZTogZmFsc2UsXG4gICAgICAgIHJlc2V0T25SZWZDb3VudFplcm86IHJlZkNvdW50LFxuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2hhcmVSZXBsYXkuanMubWFwIiwiaW1wb3J0IHsgRW1wdHlFcnJvciB9IGZyb20gJy4uL3V0aWwvRW1wdHlFcnJvcic7XG5pbXBvcnQgeyBTZXF1ZW5jZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9TZXF1ZW5jZUVycm9yJztcbmltcG9ydCB7IE5vdEZvdW5kRXJyb3IgfSBmcm9tICcuLi91dGlsL05vdEZvdW5kRXJyb3InO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5leHBvcnQgZnVuY3Rpb24gc2luZ2xlKHByZWRpY2F0ZSkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICAgIGxldCBzaW5nbGVWYWx1ZTtcbiAgICAgICAgbGV0IHNlZW5WYWx1ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBzZWVuVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKCFwcmVkaWNhdGUgfHwgcHJlZGljYXRlKHZhbHVlLCBpbmRleCsrLCBzb3VyY2UpKSB7XG4gICAgICAgICAgICAgICAgaGFzVmFsdWUgJiYgc3Vic2NyaWJlci5lcnJvcihuZXcgU2VxdWVuY2VFcnJvcignVG9vIG1hbnkgbWF0Y2hpbmcgdmFsdWVzJykpO1xuICAgICAgICAgICAgICAgIGhhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBzaW5nbGVWYWx1ZSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoc2luZ2xlVmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3Ioc2VlblZhbHVlID8gbmV3IE5vdEZvdW5kRXJyb3IoJ05vIG1hdGNoaW5nIHZhbHVlcycpIDogbmV3IEVtcHR5RXJyb3IoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNpbmdsZS5qcy5tYXAiLCJpbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcic7XG5leHBvcnQgZnVuY3Rpb24gc2tpcChjb3VudCkge1xuICAgIHJldHVybiBmaWx0ZXIoKF8sIGluZGV4KSA9PiBjb3VudCA8PSBpbmRleCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1za2lwLmpzLm1hcCIsImltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBza2lwTGFzdChza2lwQ291bnQpIHtcbiAgICByZXR1cm4gc2tpcENvdW50IDw9IDBcbiAgICAgICAgP1xuICAgICAgICAgICAgaWRlbnRpdHlcbiAgICAgICAgOiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIGxldCByaW5nID0gbmV3IEFycmF5KHNraXBDb3VudCk7XG4gICAgICAgICAgICBsZXQgc2VlbiA9IDA7XG4gICAgICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVJbmRleCA9IHNlZW4rKztcbiAgICAgICAgICAgICAgICBpZiAodmFsdWVJbmRleCA8IHNraXBDb3VudCkge1xuICAgICAgICAgICAgICAgICAgICByaW5nW3ZhbHVlSW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IHZhbHVlSW5kZXggJSBza2lwQ291bnQ7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG9sZFZhbHVlID0gcmluZ1tpbmRleF07XG4gICAgICAgICAgICAgICAgICAgIHJpbmdbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChvbGRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgICAgICByaW5nID0gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcExhc3QuanMubWFwIiwiaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpbm5lckZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2lubmVyRnJvbSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmV4cG9ydCBmdW5jdGlvbiBza2lwVW50aWwobm90aWZpZXIpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCB0YWtpbmcgPSBmYWxzZTtcbiAgICAgICAgY29uc3Qgc2tpcFN1YnNjcmliZXIgPSBuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICgpID0+IHtcbiAgICAgICAgICAgIHNraXBTdWJzY3JpYmVyID09PSBudWxsIHx8IHNraXBTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBza2lwU3Vic2NyaWJlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgdGFraW5nID0gdHJ1ZTtcbiAgICAgICAgfSwgbm9vcCk7XG4gICAgICAgIGlubmVyRnJvbShub3RpZmllcikuc3Vic2NyaWJlKHNraXBTdWJzY3JpYmVyKTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4gdGFraW5nICYmIHN1YnNjcmliZXIubmV4dCh2YWx1ZSkpKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXNraXBVbnRpbC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiBza2lwV2hpbGUocHJlZGljYXRlKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgdGFraW5nID0gZmFsc2U7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+ICh0YWtpbmcgfHwgKHRha2luZyA9ICFwcmVkaWNhdGUodmFsdWUsIGluZGV4KyspKSkgJiYgc3Vic2NyaWJlci5uZXh0KHZhbHVlKSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2tpcFdoaWxlLmpzLm1hcCIsImltcG9ydCB7IGNvbmNhdCB9IGZyb20gJy4uL29ic2VydmFibGUvY29uY2F0JztcbmltcG9ydCB7IHBvcFNjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvYXJncyc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGgoLi4udmFsdWVzKSB7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gcG9wU2NoZWR1bGVyKHZhbHVlcyk7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICAoc2NoZWR1bGVyID8gY29uY2F0KHZhbHVlcywgc291cmNlLCBzY2hlZHVsZXIpIDogY29uY2F0KHZhbHVlcywgc291cmNlKSkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3RhcnRXaXRoLmpzLm1hcCIsImltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaE1hcChwcm9qZWN0LCByZXN1bHRTZWxlY3Rvcikge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGlubmVyU3Vic2NyaWJlciA9IG51bGw7XG4gICAgICAgIGxldCBpbmRleCA9IDA7XG4gICAgICAgIGxldCBpc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICAgIGNvbnN0IGNoZWNrQ29tcGxldGUgPSAoKSA9PiBpc0NvbXBsZXRlICYmICFpbm5lclN1YnNjcmliZXIgJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBpbm5lclN1YnNjcmliZXIgPT09IG51bGwgfHwgaW5uZXJTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBpbm5lclN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGxldCBpbm5lckluZGV4ID0gMDtcbiAgICAgICAgICAgIGNvbnN0IG91dGVySW5kZXggPSBpbmRleCsrO1xuICAgICAgICAgICAgaW5uZXJGcm9tKHByb2plY3QodmFsdWUsIG91dGVySW5kZXgpKS5zdWJzY3JpYmUoKGlubmVyU3Vic2NyaWJlciA9IG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKGlubmVyVmFsdWUpID0+IHN1YnNjcmliZXIubmV4dChyZXN1bHRTZWxlY3RvciA/IHJlc3VsdFNlbGVjdG9yKHZhbHVlLCBpbm5lclZhbHVlLCBvdXRlckluZGV4LCBpbm5lckluZGV4KyspIDogaW5uZXJWYWx1ZSksICgpID0+IHtcbiAgICAgICAgICAgICAgICBpbm5lclN1YnNjcmliZXIgPSBudWxsO1xuICAgICAgICAgICAgICAgIGNoZWNrQ29tcGxldGUoKTtcbiAgICAgICAgICAgIH0pKSk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgY2hlY2tDb21wbGV0ZSgpO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zd2l0Y2hNYXAuanMubWFwIiwiaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAnLi9zd2l0Y2hNYXAnO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hBbGwoKSB7XG4gICAgcmV0dXJuIHN3aXRjaE1hcChpZGVudGl0eSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zd2l0Y2hBbGwuanMubWFwIiwiaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAnLi9zd2l0Y2hNYXAnO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoTWFwVG8oaW5uZXJPYnNlcnZhYmxlLCByZXN1bHRTZWxlY3Rvcikge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHJlc3VsdFNlbGVjdG9yKSA/IHN3aXRjaE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUsIHJlc3VsdFNlbGVjdG9yKSA6IHN3aXRjaE1hcCgoKSA9PiBpbm5lck9ic2VydmFibGUpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c3dpdGNoTWFwVG8uanMubWFwIiwiaW1wb3J0IHsgc3dpdGNoTWFwIH0gZnJvbSAnLi9zd2l0Y2hNYXAnO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoU2NhbihhY2N1bXVsYXRvciwgc2VlZCkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHN0YXRlID0gc2VlZDtcbiAgICAgICAgc3dpdGNoTWFwKCh2YWx1ZSwgaW5kZXgpID0+IGFjY3VtdWxhdG9yKHN0YXRlLCB2YWx1ZSwgaW5kZXgpLCAoXywgaW5uZXJWYWx1ZSkgPT4gKChzdGF0ZSA9IGlubmVyVmFsdWUpLCBpbm5lclZhbHVlKSkoc291cmNlKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICBzdGF0ZSA9IG51bGw7XG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1zd2l0Y2hTY2FuLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5leHBvcnQgZnVuY3Rpb24gdGFrZVVudGlsKG5vdGlmaWVyKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBpbm5lckZyb20obm90aWZpZXIpLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSwgbm9vcCkpO1xuICAgICAgICAhc3Vic2NyaWJlci5jbG9zZWQgJiYgc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VVbnRpbC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGUocHJlZGljYXRlLCBpbmNsdXNpdmUgPSBmYWxzZSkge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IGluZGV4ID0gMDtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVzdWx0ID0gcHJlZGljYXRlKHZhbHVlLCBpbmRleCsrKTtcbiAgICAgICAgICAgIChyZXN1bHQgfHwgaW5jbHVzaXZlKSAmJiBzdWJzY3JpYmVyLm5leHQodmFsdWUpO1xuICAgICAgICAgICAgIXJlc3VsdCAmJiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRha2VXaGlsZS5qcy5tYXAiLCJpbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmV4cG9ydCBmdW5jdGlvbiB0YXAob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSkge1xuICAgIGNvbnN0IHRhcE9ic2VydmVyID0gaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkgfHwgZXJyb3IgfHwgY29tcGxldGVcbiAgICAgICAgP1xuICAgICAgICAgICAgeyBuZXh0OiBvYnNlcnZlck9yTmV4dCwgZXJyb3IsIGNvbXBsZXRlIH1cbiAgICAgICAgOiBvYnNlcnZlck9yTmV4dDtcbiAgICByZXR1cm4gdGFwT2JzZXJ2ZXJcbiAgICAgICAgPyBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgIChfYSA9IHRhcE9ic2VydmVyLnN1YnNjcmliZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgbGV0IGlzVW5zdWIgPSB0cnVlO1xuICAgICAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSB0YXBPYnNlcnZlci5uZXh0KSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0YXBPYnNlcnZlciwgdmFsdWUpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgIGlzVW5zdWIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAoX2EgPSB0YXBPYnNlcnZlci5jb21wbGV0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICB2YXIgX2E7XG4gICAgICAgICAgICAgICAgaXNVbnN1YiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIChfYSA9IHRhcE9ic2VydmVyLmVycm9yKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuY2FsbCh0YXBPYnNlcnZlciwgZXJyKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdmFyIF9hLCBfYjtcbiAgICAgICAgICAgICAgICBpZiAoaXNVbnN1Yikge1xuICAgICAgICAgICAgICAgICAgICAoX2EgPSB0YXBPYnNlcnZlci51bnN1YnNjcmliZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAoX2IgPSB0YXBPYnNlcnZlci5maW5hbGl6ZSkgPT09IG51bGwgfHwgX2IgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9iLmNhbGwodGFwT2JzZXJ2ZXIpO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICB9KVxuICAgICAgICA6XG4gICAgICAgICAgICBpZGVudGl0eTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRhcC5qcy5tYXAiLCJpbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmltcG9ydCB7IGlubmVyRnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvaW5uZXJGcm9tJztcbmV4cG9ydCBjb25zdCBkZWZhdWx0VGhyb3R0bGVDb25maWcgPSB7XG4gICAgbGVhZGluZzogdHJ1ZSxcbiAgICB0cmFpbGluZzogZmFsc2UsXG59O1xuZXhwb3J0IGZ1bmN0aW9uIHRocm90dGxlKGR1cmF0aW9uU2VsZWN0b3IsIGNvbmZpZyA9IGRlZmF1bHRUaHJvdHRsZUNvbmZpZykge1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgeyBsZWFkaW5nLCB0cmFpbGluZyB9ID0gY29uZmlnO1xuICAgICAgICBsZXQgaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgbGV0IHNlbmRWYWx1ZSA9IG51bGw7XG4gICAgICAgIGxldCB0aHJvdHRsZWQgPSBudWxsO1xuICAgICAgICBsZXQgaXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCBlbmRUaHJvdHRsaW5nID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3R0bGVkID09PSBudWxsIHx8IHRocm90dGxlZCA9PT0gdm9pZCAwID8gdm9pZCAwIDogdGhyb3R0bGVkLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB0aHJvdHRsZWQgPSBudWxsO1xuICAgICAgICAgICAgaWYgKHRyYWlsaW5nKSB7XG4gICAgICAgICAgICAgICAgc2VuZCgpO1xuICAgICAgICAgICAgICAgIGlzQ29tcGxldGUgJiYgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjbGVhbnVwVGhyb3R0bGluZyA9ICgpID0+IHtcbiAgICAgICAgICAgIHRocm90dGxlZCA9IG51bGw7XG4gICAgICAgICAgICBpc0NvbXBsZXRlICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3RhcnRUaHJvdHRsZSA9ICh2YWx1ZSkgPT4gKHRocm90dGxlZCA9IGlubmVyRnJvbShkdXJhdGlvblNlbGVjdG9yKHZhbHVlKSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgZW5kVGhyb3R0bGluZywgY2xlYW51cFRocm90dGxpbmcpKSk7XG4gICAgICAgIGNvbnN0IHNlbmQgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoaGFzVmFsdWUpIHtcbiAgICAgICAgICAgICAgICBoYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gc2VuZFZhbHVlO1xuICAgICAgICAgICAgICAgIHNlbmRWYWx1ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAhaXNDb21wbGV0ZSAmJiBzdGFydFRocm90dGxlKHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaGFzVmFsdWUgPSB0cnVlO1xuICAgICAgICAgICAgc2VuZFZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAhKHRocm90dGxlZCAmJiAhdGhyb3R0bGVkLmNsb3NlZCkgJiYgKGxlYWRpbmcgPyBzZW5kKCkgOiBzdGFydFRocm90dGxlKHZhbHVlKSk7XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgICAgISh0cmFpbGluZyAmJiBoYXNWYWx1ZSAmJiB0aHJvdHRsZWQgJiYgIXRocm90dGxlZC5jbG9zZWQpICYmIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGhyb3R0bGUuanMubWFwIiwiaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgZGVmYXVsdFRocm90dGxlQ29uZmlnLCB0aHJvdHRsZSB9IGZyb20gJy4vdGhyb3R0bGUnO1xuaW1wb3J0IHsgdGltZXIgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3RpbWVyJztcbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZVRpbWUoZHVyYXRpb24sIHNjaGVkdWxlciA9IGFzeW5jU2NoZWR1bGVyLCBjb25maWcgPSBkZWZhdWx0VGhyb3R0bGVDb25maWcpIHtcbiAgICBjb25zdCBkdXJhdGlvbiQgPSB0aW1lcihkdXJhdGlvbiwgc2NoZWR1bGVyKTtcbiAgICByZXR1cm4gdGhyb3R0bGUoKCkgPT4gZHVyYXRpb24kLCBjb25maWcpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGhyb3R0bGVUaW1lLmpzLm1hcCIsImltcG9ydCB7IGFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IHNjYW4gfSBmcm9tICcuL3NjYW4nO1xuaW1wb3J0IHsgZGVmZXIgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2RlZmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcbmV4cG9ydCBmdW5jdGlvbiB0aW1lSW50ZXJ2YWwoc2NoZWR1bGVyID0gYXN5bmNTY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gKHNvdXJjZSkgPT4gZGVmZXIoKCkgPT4ge1xuICAgICAgICByZXR1cm4gc291cmNlLnBpcGUoc2NhbigoeyBjdXJyZW50IH0sIHZhbHVlKSA9PiAoeyB2YWx1ZSwgY3VycmVudDogc2NoZWR1bGVyLm5vdygpLCBsYXN0OiBjdXJyZW50IH0pLCB7XG4gICAgICAgICAgICBjdXJyZW50OiBzY2hlZHVsZXIubm93KCksXG4gICAgICAgICAgICB2YWx1ZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgbGFzdDogdW5kZWZpbmVkLFxuICAgICAgICB9KSwgbWFwKCh7IGN1cnJlbnQsIGxhc3QsIHZhbHVlIH0pID0+IG5ldyBUaW1lSW50ZXJ2YWwodmFsdWUsIGN1cnJlbnQgLSBsYXN0KSkpO1xuICAgIH0pO1xufVxuZXhwb3J0IGNsYXNzIFRpbWVJbnRlcnZhbCB7XG4gICAgY29uc3RydWN0b3IodmFsdWUsIGludGVydmFsKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5pbnRlcnZhbCA9IGludGVydmFsO1xuICAgIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXRpbWVJbnRlcnZhbC5qcy5tYXAiLCJpbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBpc1ZhbGlkRGF0ZSB9IGZyb20gJy4uL3V0aWwvaXNEYXRlJztcbmltcG9ydCB7IHRpbWVvdXQgfSBmcm9tICcuL3RpbWVvdXQnO1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRXaXRoKGR1ZSwgd2l0aE9ic2VydmFibGUsIHNjaGVkdWxlcikge1xuICAgIGxldCBmaXJzdDtcbiAgICBsZXQgZWFjaDtcbiAgICBsZXQgX3dpdGg7XG4gICAgc2NoZWR1bGVyID0gc2NoZWR1bGVyICE9PSBudWxsICYmIHNjaGVkdWxlciAhPT0gdm9pZCAwID8gc2NoZWR1bGVyIDogYXN5bmM7XG4gICAgaWYgKGlzVmFsaWREYXRlKGR1ZSkpIHtcbiAgICAgICAgZmlyc3QgPSBkdWU7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBkdWUgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGVhY2ggPSBkdWU7XG4gICAgfVxuICAgIGlmICh3aXRoT2JzZXJ2YWJsZSkge1xuICAgICAgICBfd2l0aCA9ICgpID0+IHdpdGhPYnNlcnZhYmxlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignTm8gb2JzZXJ2YWJsZSBwcm92aWRlZCB0byBzd2l0Y2ggdG8nKTtcbiAgICB9XG4gICAgaWYgKGZpcnN0ID09IG51bGwgJiYgZWFjaCA9PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ05vIHRpbWVvdXQgcHJvdmlkZWQuJyk7XG4gICAgfVxuICAgIHJldHVybiB0aW1lb3V0KHtcbiAgICAgICAgZmlyc3QsXG4gICAgICAgIGVhY2gsXG4gICAgICAgIHNjaGVkdWxlcixcbiAgICAgICAgd2l0aDogX3dpdGgsXG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD10aW1lb3V0V2l0aC5qcy5tYXAiLCJpbXBvcnQgeyBkYXRlVGltZXN0YW1wUHJvdmlkZXIgfSBmcm9tICcuLi9zY2hlZHVsZXIvZGF0ZVRpbWVzdGFtcFByb3ZpZGVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcbmV4cG9ydCBmdW5jdGlvbiB0aW1lc3RhbXAodGltZXN0YW1wUHJvdmlkZXIgPSBkYXRlVGltZXN0YW1wUHJvdmlkZXIpIHtcbiAgICByZXR1cm4gbWFwKCh2YWx1ZSkgPT4gKHsgdmFsdWUsIHRpbWVzdGFtcDogdGltZXN0YW1wUHJvdmlkZXIubm93KCkgfSkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dGltZXN0YW1wLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5leHBvcnQgZnVuY3Rpb24gd2luZG93KHdpbmRvd0JvdW5kYXJpZXMpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCB3aW5kb3dTdWJqZWN0ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHdpbmRvd1N1YmplY3QuYXNPYnNlcnZhYmxlKCkpO1xuICAgICAgICBjb25zdCBlcnJvckhhbmRsZXIgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3dTdWJqZWN0LmVycm9yKGVycik7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHdpbmRvd1N1YmplY3QgPT09IG51bGwgfHwgd2luZG93U3ViamVjdCA9PT0gdm9pZCAwID8gdm9pZCAwIDogd2luZG93U3ViamVjdC5uZXh0KHZhbHVlKSwgKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93U3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9LCBlcnJvckhhbmRsZXIpKTtcbiAgICAgICAgd2luZG93Qm91bmRhcmllcy5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3dTdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLm5leHQoKHdpbmRvd1N1YmplY3QgPSBuZXcgU3ViamVjdCgpKSk7XG4gICAgICAgIH0sIG5vb3AsIGVycm9ySGFuZGxlcikpO1xuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgd2luZG93U3ViamVjdCA9PT0gbnVsbCB8fCB3aW5kb3dTdWJqZWN0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiB3aW5kb3dTdWJqZWN0LnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB3aW5kb3dTdWJqZWN0ID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdpbmRvdy5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBvcGVyYXRlIH0gZnJvbSAnLi4vdXRpbC9saWZ0JztcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4vT3BlcmF0b3JTdWJzY3JpYmVyJztcbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dDb3VudCh3aW5kb3dTaXplLCBzdGFydFdpbmRvd0V2ZXJ5ID0gMCkge1xuICAgIGNvbnN0IHN0YXJ0RXZlcnkgPSBzdGFydFdpbmRvd0V2ZXJ5ID4gMCA/IHN0YXJ0V2luZG93RXZlcnkgOiB3aW5kb3dTaXplO1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgbGV0IHdpbmRvd3MgPSBbbmV3IFN1YmplY3QoKV07XG4gICAgICAgIGxldCBzdGFydHMgPSBbXTtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KHdpbmRvd3NbMF0uYXNPYnNlcnZhYmxlKCkpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IHdpbmRvdyBvZiB3aW5kb3dzKSB7XG4gICAgICAgICAgICAgICAgd2luZG93Lm5leHQodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgYyA9IGNvdW50IC0gd2luZG93U2l6ZSArIDE7XG4gICAgICAgICAgICBpZiAoYyA+PSAwICYmIGMgJSBzdGFydEV2ZXJ5ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgd2luZG93cy5zaGlmdCgpLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoKytjb3VudCAlIHN0YXJ0RXZlcnkgPT09IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3aW5kb3cgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICAgICAgICAgIHdpbmRvd3MucHVzaCh3aW5kb3cpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh3aW5kb3cuYXNPYnNlcnZhYmxlKCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCAoKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAod2luZG93cy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgd2luZG93cy5zaGlmdCgpLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIH0sIChlcnIpID0+IHtcbiAgICAgICAgICAgIHdoaWxlICh3aW5kb3dzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dzLnNoaWZ0KCkuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgc3RhcnRzID0gbnVsbDtcbiAgICAgICAgICAgIHdpbmRvd3MgPSBudWxsO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13aW5kb3dDb3VudC5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgb3BlcmF0ZSB9IGZyb20gJy4uL3V0aWwvbGlmdCc7XG5pbXBvcnQgeyBPcGVyYXRvclN1YnNjcmliZXIgfSBmcm9tICcuL09wZXJhdG9yU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuLi91dGlsL2FyclJlbW92ZSc7XG5pbXBvcnQgeyBwb3BTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuaW1wb3J0IHsgZXhlY3V0ZVNjaGVkdWxlIH0gZnJvbSAnLi4vdXRpbC9leGVjdXRlU2NoZWR1bGUnO1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1RpbWUod2luZG93VGltZVNwYW4sIC4uLm90aGVyQXJncykge1xuICAgIHZhciBfYSwgX2I7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gKF9hID0gcG9wU2NoZWR1bGVyKG90aGVyQXJncykpICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6IGFzeW5jU2NoZWR1bGVyO1xuICAgIGNvbnN0IHdpbmRvd0NyZWF0aW9uSW50ZXJ2YWwgPSAoX2IgPSBvdGhlckFyZ3NbMF0pICE9PSBudWxsICYmIF9iICE9PSB2b2lkIDAgPyBfYiA6IG51bGw7XG4gICAgY29uc3QgbWF4V2luZG93U2l6ZSA9IG90aGVyQXJnc1sxXSB8fCBJbmZpbml0eTtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGxldCB3aW5kb3dSZWNvcmRzID0gW107XG4gICAgICAgIGxldCByZXN0YXJ0T25DbG9zZSA9IGZhbHNlO1xuICAgICAgICBjb25zdCBjbG9zZVdpbmRvdyA9IChyZWNvcmQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgd2luZG93LCBzdWJzIH0gPSByZWNvcmQ7XG4gICAgICAgICAgICB3aW5kb3cuY29tcGxldGUoKTtcbiAgICAgICAgICAgIHN1YnMudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIGFyclJlbW92ZSh3aW5kb3dSZWNvcmRzLCByZWNvcmQpO1xuICAgICAgICAgICAgcmVzdGFydE9uQ2xvc2UgJiYgc3RhcnRXaW5kb3coKTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3Qgc3RhcnRXaW5kb3cgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAod2luZG93UmVjb3Jkcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHN1YnMgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5hZGQoc3Vicyk7XG4gICAgICAgICAgICAgICAgY29uc3Qgd2luZG93ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWNvcmQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdyxcbiAgICAgICAgICAgICAgICAgICAgc3VicyxcbiAgICAgICAgICAgICAgICAgICAgc2VlbjogMCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHdpbmRvd1JlY29yZHMucHVzaChyZWNvcmQpO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh3aW5kb3cuYXNPYnNlcnZhYmxlKCkpO1xuICAgICAgICAgICAgICAgIGV4ZWN1dGVTY2hlZHVsZShzdWJzLCBzY2hlZHVsZXIsICgpID0+IGNsb3NlV2luZG93KHJlY29yZCksIHdpbmRvd1RpbWVTcGFuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgaWYgKHdpbmRvd0NyZWF0aW9uSW50ZXJ2YWwgIT09IG51bGwgJiYgd2luZG93Q3JlYXRpb25JbnRlcnZhbCA+PSAwKSB7XG4gICAgICAgICAgICBleGVjdXRlU2NoZWR1bGUoc3Vic2NyaWJlciwgc2NoZWR1bGVyLCBzdGFydFdpbmRvdywgd2luZG93Q3JlYXRpb25JbnRlcnZhbCwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXN0YXJ0T25DbG9zZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnRXaW5kb3coKTtcbiAgICAgICAgY29uc3QgbG9vcCA9IChjYikgPT4gd2luZG93UmVjb3Jkcy5zbGljZSgpLmZvckVhY2goY2IpO1xuICAgICAgICBjb25zdCB0ZXJtaW5hdGUgPSAoY2IpID0+IHtcbiAgICAgICAgICAgIGxvb3AoKHsgd2luZG93IH0pID0+IGNiKHdpbmRvdykpO1xuICAgICAgICAgICAgY2Ioc3Vic2NyaWJlcik7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH07XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGxvb3AoKHJlY29yZCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlY29yZC53aW5kb3cubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICAgICAgbWF4V2luZG93U2l6ZSA8PSArK3JlY29yZC5zZWVuICYmIGNsb3NlV2luZG93KHJlY29yZCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgKCkgPT4gdGVybWluYXRlKChjb25zdW1lcikgPT4gY29uc3VtZXIuY29tcGxldGUoKSksIChlcnIpID0+IHRlcm1pbmF0ZSgoY29uc3VtZXIpID0+IGNvbnN1bWVyLmVycm9yKGVycikpKSk7XG4gICAgICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAgICAgICB3aW5kb3dSZWNvcmRzID0gbnVsbDtcbiAgICAgICAgfTtcbiAgICB9KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXdpbmRvd1RpbWUuanMubWFwIiwiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBhcnJSZW1vdmUgfSBmcm9tICcuLi91dGlsL2FyclJlbW92ZSc7XG5leHBvcnQgZnVuY3Rpb24gd2luZG93VG9nZ2xlKG9wZW5pbmdzLCBjbG9zaW5nU2VsZWN0b3IpIHtcbiAgICByZXR1cm4gb3BlcmF0ZSgoc291cmNlLCBzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IHdpbmRvd3MgPSBbXTtcbiAgICAgICAgY29uc3QgaGFuZGxlRXJyb3IgPSAoZXJyKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAoMCA8IHdpbmRvd3MubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93cy5zaGlmdCgpLmVycm9yKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIGlubmVyRnJvbShvcGVuaW5ncykuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKG9wZW5WYWx1ZSkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgd2luZG93ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgICAgIHdpbmRvd3MucHVzaCh3aW5kb3cpO1xuICAgICAgICAgICAgY29uc3QgY2xvc2luZ1N1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgICAgIGNvbnN0IGNsb3NlV2luZG93ID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGFyclJlbW92ZSh3aW5kb3dzLCB3aW5kb3cpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgICAgIGNsb3NpbmdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBsZXQgY2xvc2luZ05vdGlmaWVyO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjbG9zaW5nTm90aWZpZXIgPSBpbm5lckZyb20oY2xvc2luZ1NlbGVjdG9yKG9wZW5WYWx1ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgIGhhbmRsZUVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHdpbmRvdy5hc09ic2VydmFibGUoKSk7XG4gICAgICAgICAgICBjbG9zaW5nU3Vic2NyaXB0aW9uLmFkZChjbG9zaW5nTm90aWZpZXIuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgY2xvc2VXaW5kb3csIG5vb3AsIGhhbmRsZUVycm9yKSkpO1xuICAgICAgICB9LCBub29wKSk7XG4gICAgICAgIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHdpbmRvd3NDb3B5ID0gd2luZG93cy5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChjb25zdCB3aW5kb3cgb2Ygd2luZG93c0NvcHkpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sICgpID0+IHtcbiAgICAgICAgICAgIHdoaWxlICgwIDwgd2luZG93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dzLnNoaWZ0KCkuY29tcGxldGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgfSwgaGFuZGxlRXJyb3IsICgpID0+IHtcbiAgICAgICAgICAgIHdoaWxlICgwIDwgd2luZG93cy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3dzLnNoaWZ0KCkudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkpO1xuICAgIH0pO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d2luZG93VG9nZ2xlLmpzLm1hcCIsImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1doZW4oY2xvc2luZ1NlbGVjdG9yKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICBsZXQgd2luZG93O1xuICAgICAgICBsZXQgY2xvc2luZ1N1YnNjcmliZXI7XG4gICAgICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgICAgd2luZG93LmVycm9yKGVycik7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIGNvbnN0IG9wZW5XaW5kb3cgPSAoKSA9PiB7XG4gICAgICAgICAgICBjbG9zaW5nU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBjbG9zaW5nU3Vic2NyaWJlciA9PT0gdm9pZCAwID8gdm9pZCAwIDogY2xvc2luZ1N1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIHdpbmRvdyA9PT0gbnVsbCB8fCB3aW5kb3cgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHdpbmRvdy5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgd2luZG93ID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh3aW5kb3cuYXNPYnNlcnZhYmxlKCkpO1xuICAgICAgICAgICAgbGV0IGNsb3NpbmdOb3RpZmllcjtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgY2xvc2luZ05vdGlmaWVyID0gaW5uZXJGcm9tKGNsb3NpbmdTZWxlY3RvcigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBoYW5kbGVFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNsb3NpbmdOb3RpZmllci5zdWJzY3JpYmUoKGNsb3NpbmdTdWJzY3JpYmVyID0gbmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBvcGVuV2luZG93LCBvcGVuV2luZG93LCBoYW5kbGVFcnJvcikpKTtcbiAgICAgICAgfTtcbiAgICAgICAgb3BlbldpbmRvdygpO1xuICAgICAgICBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgKHZhbHVlKSA9PiB3aW5kb3cubmV4dCh2YWx1ZSksICgpID0+IHtcbiAgICAgICAgICAgIHdpbmRvdy5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICB9LCBoYW5kbGVFcnJvciwgKCkgPT4ge1xuICAgICAgICAgICAgY2xvc2luZ1N1YnNjcmliZXIgPT09IG51bGwgfHwgY2xvc2luZ1N1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGNsb3NpbmdTdWJzY3JpYmVyLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB3aW5kb3cgPSBudWxsO1xuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13aW5kb3dXaGVuLmpzLm1hcCIsImltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuaW1wb3J0IHsgT3BlcmF0b3JTdWJzY3JpYmVyIH0gZnJvbSAnLi9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuaW1wb3J0IHsgaWRlbnRpdHkgfSBmcm9tICcuLi91dGlsL2lkZW50aXR5JztcbmltcG9ydCB7IG5vb3AgfSBmcm9tICcuLi91dGlsL25vb3AnO1xuaW1wb3J0IHsgcG9wUmVzdWx0U2VsZWN0b3IgfSBmcm9tICcuLi91dGlsL2FyZ3MnO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tKC4uLmlucHV0cykge1xuICAgIGNvbnN0IHByb2plY3QgPSBwb3BSZXN1bHRTZWxlY3RvcihpbnB1dHMpO1xuICAgIHJldHVybiBvcGVyYXRlKChzb3VyY2UsIHN1YnNjcmliZXIpID0+IHtcbiAgICAgICAgY29uc3QgbGVuID0gaW5wdXRzLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgb3RoZXJWYWx1ZXMgPSBuZXcgQXJyYXkobGVuKTtcbiAgICAgICAgbGV0IGhhc1ZhbHVlID0gaW5wdXRzLm1hcCgoKSA9PiBmYWxzZSk7XG4gICAgICAgIGxldCByZWFkeSA9IGZhbHNlO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICBpbm5lckZyb20oaW5wdXRzW2ldKS5zdWJzY3JpYmUobmV3IE9wZXJhdG9yU3Vic2NyaWJlcihzdWJzY3JpYmVyLCAodmFsdWUpID0+IHtcbiAgICAgICAgICAgICAgICBvdGhlclZhbHVlc1tpXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGlmICghcmVhZHkgJiYgIWhhc1ZhbHVlW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgIGhhc1ZhbHVlW2ldID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgKHJlYWR5ID0gaGFzVmFsdWUuZXZlcnkoaWRlbnRpdHkpKSAmJiAoaGFzVmFsdWUgPSBudWxsKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCBub29wKSk7XG4gICAgICAgIH1cbiAgICAgICAgc291cmNlLnN1YnNjcmliZShuZXcgT3BlcmF0b3JTdWJzY3JpYmVyKHN1YnNjcmliZXIsICh2YWx1ZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHJlYWR5KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsdWVzID0gW3ZhbHVlLCAuLi5vdGhlclZhbHVlc107XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5uZXh0KHByb2plY3QgPyBwcm9qZWN0KC4uLnZhbHVlcykgOiB2YWx1ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13aXRoTGF0ZXN0RnJvbS5qcy5tYXAiLCJpbXBvcnQgeyB6aXAgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3ppcCc7XG5pbXBvcnQgeyBqb2luQWxsSW50ZXJuYWxzIH0gZnJvbSAnLi9qb2luQWxsSW50ZXJuYWxzJztcbmV4cG9ydCBmdW5jdGlvbiB6aXBBbGwocHJvamVjdCkge1xuICAgIHJldHVybiBqb2luQWxsSW50ZXJuYWxzKHppcCwgcHJvamVjdCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD16aXBBbGwuanMubWFwIiwiaW1wb3J0IHsgemlwIGFzIHppcFN0YXRpYyB9IGZyb20gJy4uL29ic2VydmFibGUvemlwJztcbmltcG9ydCB7IG9wZXJhdGUgfSBmcm9tICcuLi91dGlsL2xpZnQnO1xuZXhwb3J0IGZ1bmN0aW9uIHppcCguLi5zb3VyY2VzKSB7XG4gICAgcmV0dXJuIG9wZXJhdGUoKHNvdXJjZSwgc3Vic2NyaWJlcikgPT4ge1xuICAgICAgICB6aXBTdGF0aWMoc291cmNlLCAuLi5zb3VyY2VzKS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD16aXAuanMubWFwIiwiaW1wb3J0IHsgemlwIH0gZnJvbSAnLi96aXAnO1xuZXhwb3J0IGZ1bmN0aW9uIHppcFdpdGgoLi4ub3RoZXJJbnB1dHMpIHtcbiAgICByZXR1cm4gemlwKC4uLm90aGVySW5wdXRzKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXppcFdpdGguanMubWFwIiwiaW1wb3J0IHsgbm90IH0gZnJvbSAnLi4vdXRpbC9ub3QnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnLi9maWx0ZXInO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbihwcmVkaWNhdGUsIHRoaXNBcmcpIHtcbiAgICByZXR1cm4gKHNvdXJjZSkgPT4gW2ZpbHRlcihwcmVkaWNhdGUsIHRoaXNBcmcpKHNvdXJjZSksIGZpbHRlcihub3QocHJlZGljYXRlLCB0aGlzQXJnKSkoc291cmNlKV07XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJ0aXRpb24uanMubWFwIiwiaW1wb3J0IHsgYXJnc09yQXJnQXJyYXkgfSBmcm9tICcuLi91dGlsL2FyZ3NPckFyZ0FycmF5JztcbmltcG9ydCB7IHJhY2VXaXRoIH0gZnJvbSAnLi9yYWNlV2l0aCc7XG5leHBvcnQgZnVuY3Rpb24gcmFjZSguLi5hcmdzKSB7XG4gICAgcmV0dXJuIHJhY2VXaXRoKC4uLmFyZ3NPckFyZ0FycmF5KGFyZ3MpKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXJhY2UuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGdldFhIUlJlc3BvbnNlKHhocikge1xuICAgIHN3aXRjaCAoeGhyLnJlc3BvbnNlVHlwZSkge1xuICAgICAgICBjYXNlICdqc29uJzoge1xuICAgICAgICAgICAgaWYgKCdyZXNwb25zZScgaW4geGhyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGllWEhSID0geGhyO1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKGllWEhSLnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2FzZSAnZG9jdW1lbnQnOlxuICAgICAgICAgICAgcmV0dXJuIHhoci5yZXNwb25zZVhNTDtcbiAgICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGRlZmF1bHQ6IHtcbiAgICAgICAgICAgIGlmICgncmVzcG9uc2UnIGluIHhocikge1xuICAgICAgICAgICAgICAgIHJldHVybiB4aHIucmVzcG9uc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZVhIUiA9IHhocjtcbiAgICAgICAgICAgICAgICByZXR1cm4gaWVYSFIucmVzcG9uc2VUZXh0O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2V0WEhSUmVzcG9uc2UuanMubWFwIiwiaW1wb3J0IHsgZ2V0WEhSUmVzcG9uc2UgfSBmcm9tICcuL2dldFhIUlJlc3BvbnNlJztcbmV4cG9ydCBjbGFzcyBBamF4UmVzcG9uc2Uge1xuICAgIGNvbnN0cnVjdG9yKG9yaWdpbmFsRXZlbnQsIHhociwgcmVxdWVzdCwgdHlwZSA9ICdkb3dubG9hZF9sb2FkJykge1xuICAgICAgICB0aGlzLm9yaWdpbmFsRXZlbnQgPSBvcmlnaW5hbEV2ZW50O1xuICAgICAgICB0aGlzLnhociA9IHhocjtcbiAgICAgICAgdGhpcy5yZXF1ZXN0ID0gcmVxdWVzdDtcbiAgICAgICAgdGhpcy50eXBlID0gdHlwZTtcbiAgICAgICAgY29uc3QgeyBzdGF0dXMsIHJlc3BvbnNlVHlwZSB9ID0geGhyO1xuICAgICAgICB0aGlzLnN0YXR1cyA9IHN0YXR1cyAhPT0gbnVsbCAmJiBzdGF0dXMgIT09IHZvaWQgMCA/IHN0YXR1cyA6IDA7XG4gICAgICAgIHRoaXMucmVzcG9uc2VUeXBlID0gcmVzcG9uc2VUeXBlICE9PSBudWxsICYmIHJlc3BvbnNlVHlwZSAhPT0gdm9pZCAwID8gcmVzcG9uc2VUeXBlIDogJyc7XG4gICAgICAgIGNvbnN0IGFsbEhlYWRlcnMgPSB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCk7XG4gICAgICAgIHRoaXMucmVzcG9uc2VIZWFkZXJzID0gYWxsSGVhZGVyc1xuICAgICAgICAgICAgP1xuICAgICAgICAgICAgICAgIGFsbEhlYWRlcnMuc3BsaXQoJ1xcbicpLnJlZHVjZSgoaGVhZGVycywgbGluZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBpbmRleCA9IGxpbmUuaW5kZXhPZignOiAnKTtcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyc1tsaW5lLnNsaWNlKDAsIGluZGV4KV0gPSBsaW5lLnNsaWNlKGluZGV4ICsgMik7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBoZWFkZXJzO1xuICAgICAgICAgICAgICAgIH0sIHt9KVxuICAgICAgICAgICAgOiB7fTtcbiAgICAgICAgdGhpcy5yZXNwb25zZSA9IGdldFhIUlJlc3BvbnNlKHhocik7XG4gICAgICAgIGNvbnN0IHsgbG9hZGVkLCB0b3RhbCB9ID0gb3JpZ2luYWxFdmVudDtcbiAgICAgICAgdGhpcy5sb2FkZWQgPSBsb2FkZWQ7XG4gICAgICAgIHRoaXMudG90YWwgPSB0b3RhbDtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1BamF4UmVzcG9uc2UuanMubWFwIiwiaW1wb3J0IHsgZ2V0WEhSUmVzcG9uc2UgfSBmcm9tICcuL2dldFhIUlJlc3BvbnNlJztcbmltcG9ydCB7IGNyZWF0ZUVycm9yQ2xhc3MgfSBmcm9tICcuLi91dGlsL2NyZWF0ZUVycm9yQ2xhc3MnO1xuZXhwb3J0IGNvbnN0IEFqYXhFcnJvciA9IGNyZWF0ZUVycm9yQ2xhc3MoKF9zdXBlcikgPT4gZnVuY3Rpb24gQWpheEVycm9ySW1wbChtZXNzYWdlLCB4aHIsIHJlcXVlc3QpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMubmFtZSA9ICdBamF4RXJyb3InO1xuICAgIHRoaXMueGhyID0geGhyO1xuICAgIHRoaXMucmVxdWVzdCA9IHJlcXVlc3Q7XG4gICAgdGhpcy5zdGF0dXMgPSB4aHIuc3RhdHVzO1xuICAgIHRoaXMucmVzcG9uc2VUeXBlID0geGhyLnJlc3BvbnNlVHlwZTtcbiAgICBsZXQgcmVzcG9uc2U7XG4gICAgdHJ5IHtcbiAgICAgICAgcmVzcG9uc2UgPSBnZXRYSFJSZXNwb25zZSh4aHIpO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgIHJlc3BvbnNlID0geGhyLnJlc3BvbnNlVGV4dDtcbiAgICB9XG4gICAgdGhpcy5yZXNwb25zZSA9IHJlc3BvbnNlO1xufSk7XG5leHBvcnQgY29uc3QgQWpheFRpbWVvdXRFcnJvciA9ICgoKSA9PiB7XG4gICAgZnVuY3Rpb24gQWpheFRpbWVvdXRFcnJvckltcGwoeGhyLCByZXF1ZXN0KSB7XG4gICAgICAgIEFqYXhFcnJvci5jYWxsKHRoaXMsICdhamF4IHRpbWVvdXQnLCB4aHIsIHJlcXVlc3QpO1xuICAgICAgICB0aGlzLm5hbWUgPSAnQWpheFRpbWVvdXRFcnJvcic7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBBamF4VGltZW91dEVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEFqYXhFcnJvci5wcm90b3R5cGUpO1xuICAgIHJldHVybiBBamF4VGltZW91dEVycm9ySW1wbDtcbn0pKCk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1lcnJvcnMuanMubWFwIiwiaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBBamF4UmVzcG9uc2UgfSBmcm9tICcuL0FqYXhSZXNwb25zZSc7XG5pbXBvcnQgeyBBamF4VGltZW91dEVycm9yLCBBamF4RXJyb3IgfSBmcm9tICcuL2Vycm9ycyc7XG5mdW5jdGlvbiBhamF4R2V0KHVybCwgaGVhZGVycykge1xuICAgIHJldHVybiBhamF4KHsgbWV0aG9kOiAnR0VUJywgdXJsLCBoZWFkZXJzIH0pO1xufVxuZnVuY3Rpb24gYWpheFBvc3QodXJsLCBib2R5LCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGFqYXgoeyBtZXRob2Q6ICdQT1NUJywgdXJsLCBib2R5LCBoZWFkZXJzIH0pO1xufVxuZnVuY3Rpb24gYWpheERlbGV0ZSh1cmwsIGhlYWRlcnMpIHtcbiAgICByZXR1cm4gYWpheCh7IG1ldGhvZDogJ0RFTEVURScsIHVybCwgaGVhZGVycyB9KTtcbn1cbmZ1bmN0aW9uIGFqYXhQdXQodXJsLCBib2R5LCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGFqYXgoeyBtZXRob2Q6ICdQVVQnLCB1cmwsIGJvZHksIGhlYWRlcnMgfSk7XG59XG5mdW5jdGlvbiBhamF4UGF0Y2godXJsLCBib2R5LCBoZWFkZXJzKSB7XG4gICAgcmV0dXJuIGFqYXgoeyBtZXRob2Q6ICdQQVRDSCcsIHVybCwgYm9keSwgaGVhZGVycyB9KTtcbn1cbmNvbnN0IG1hcFJlc3BvbnNlID0gbWFwKCh4KSA9PiB4LnJlc3BvbnNlKTtcbmZ1bmN0aW9uIGFqYXhHZXRKU09OKHVybCwgaGVhZGVycykge1xuICAgIHJldHVybiBtYXBSZXNwb25zZShhamF4KHtcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcbiAgICAgICAgdXJsLFxuICAgICAgICBoZWFkZXJzLFxuICAgIH0pKTtcbn1cbmV4cG9ydCBjb25zdCBhamF4ID0gKCgpID0+IHtcbiAgICBjb25zdCBjcmVhdGUgPSAodXJsT3JDb25maWcpID0+IHtcbiAgICAgICAgY29uc3QgY29uZmlnID0gdHlwZW9mIHVybE9yQ29uZmlnID09PSAnc3RyaW5nJ1xuICAgICAgICAgICAgPyB7XG4gICAgICAgICAgICAgICAgdXJsOiB1cmxPckNvbmZpZyxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIDogdXJsT3JDb25maWc7XG4gICAgICAgIHJldHVybiBmcm9tQWpheChjb25maWcpO1xuICAgIH07XG4gICAgY3JlYXRlLmdldCA9IGFqYXhHZXQ7XG4gICAgY3JlYXRlLnBvc3QgPSBhamF4UG9zdDtcbiAgICBjcmVhdGUuZGVsZXRlID0gYWpheERlbGV0ZTtcbiAgICBjcmVhdGUucHV0ID0gYWpheFB1dDtcbiAgICBjcmVhdGUucGF0Y2ggPSBhamF4UGF0Y2g7XG4gICAgY3JlYXRlLmdldEpTT04gPSBhamF4R2V0SlNPTjtcbiAgICByZXR1cm4gY3JlYXRlO1xufSkoKTtcbmNvbnN0IFVQTE9BRCA9ICd1cGxvYWQnO1xuY29uc3QgRE9XTkxPQUQgPSAnZG93bmxvYWQnO1xuY29uc3QgTE9BRFNUQVJUID0gJ2xvYWRzdGFydCc7XG5jb25zdCBQUk9HUkVTUyA9ICdwcm9ncmVzcyc7XG5jb25zdCBMT0FEID0gJ2xvYWQnO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21BamF4KGluaXQpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoKGRlc3RpbmF0aW9uKSA9PiB7XG4gICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgIGNvbnN0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oeyBhc3luYzogdHJ1ZSwgY3Jvc3NEb21haW46IGZhbHNlLCB3aXRoQ3JlZGVudGlhbHM6IGZhbHNlLCBtZXRob2Q6ICdHRVQnLCB0aW1lb3V0OiAwLCByZXNwb25zZVR5cGU6ICdqc29uJyB9LCBpbml0KTtcbiAgICAgICAgY29uc3QgeyBxdWVyeVBhcmFtcywgYm9keTogY29uZmlndXJlZEJvZHksIGhlYWRlcnM6IGNvbmZpZ3VyZWRIZWFkZXJzIH0gPSBjb25maWc7XG4gICAgICAgIGxldCB1cmwgPSBjb25maWcudXJsO1xuICAgICAgICBpZiAoIXVybCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndXJsIGlzIHJlcXVpcmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHF1ZXJ5UGFyYW1zKSB7XG4gICAgICAgICAgICBsZXQgc2VhcmNoUGFyYW1zO1xuICAgICAgICAgICAgaWYgKHVybC5pbmNsdWRlcygnPycpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGFydHMgPSB1cmwuc3BsaXQoJz8nKTtcbiAgICAgICAgICAgICAgICBpZiAoMiA8IHBhcnRzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdpbnZhbGlkIHVybCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWFyY2hQYXJhbXMgPSBuZXcgVVJMU2VhcmNoUGFyYW1zKHBhcnRzWzFdKTtcbiAgICAgICAgICAgICAgICBuZXcgVVJMU2VhcmNoUGFyYW1zKHF1ZXJ5UGFyYW1zKS5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PiBzZWFyY2hQYXJhbXMuc2V0KGtleSwgdmFsdWUpKTtcbiAgICAgICAgICAgICAgICB1cmwgPSBwYXJ0c1swXSArICc/JyArIHNlYXJjaFBhcmFtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMocXVlcnlQYXJhbXMpO1xuICAgICAgICAgICAgICAgIHVybCA9IHVybCArICc/JyArIHNlYXJjaFBhcmFtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBoZWFkZXJzID0ge307XG4gICAgICAgIGlmIChjb25maWd1cmVkSGVhZGVycykge1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gY29uZmlndXJlZEhlYWRlcnMpIHtcbiAgICAgICAgICAgICAgICBpZiAoY29uZmlndXJlZEhlYWRlcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzW2tleS50b0xvd2VyQ2FzZSgpXSA9IGNvbmZpZ3VyZWRIZWFkZXJzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGNyb3NzRG9tYWluID0gY29uZmlnLmNyb3NzRG9tYWluO1xuICAgICAgICBpZiAoIWNyb3NzRG9tYWluICYmICEoJ3gtcmVxdWVzdGVkLXdpdGgnIGluIGhlYWRlcnMpKSB7XG4gICAgICAgICAgICBoZWFkZXJzWyd4LXJlcXVlc3RlZC13aXRoJ10gPSAnWE1MSHR0cFJlcXVlc3QnO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHsgd2l0aENyZWRlbnRpYWxzLCB4c3JmQ29va2llTmFtZSwgeHNyZkhlYWRlck5hbWUgfSA9IGNvbmZpZztcbiAgICAgICAgaWYgKCh3aXRoQ3JlZGVudGlhbHMgfHwgIWNyb3NzRG9tYWluKSAmJiB4c3JmQ29va2llTmFtZSAmJiB4c3JmSGVhZGVyTmFtZSkge1xuICAgICAgICAgICAgY29uc3QgeHNyZkNvb2tpZSA9IChfYiA9IChfYSA9IGRvY3VtZW50ID09PSBudWxsIHx8IGRvY3VtZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBkb2N1bWVudC5jb29raWUubWF0Y2gobmV3IFJlZ0V4cChgKF58O1xcXFxzKikoJHt4c3JmQ29va2llTmFtZX0pPShbXjtdKilgKSkpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5wb3AoKSkgIT09IG51bGwgJiYgX2IgIT09IHZvaWQgMCA/IF9iIDogJyc7XG4gICAgICAgICAgICBpZiAoeHNyZkNvb2tpZSkge1xuICAgICAgICAgICAgICAgIGhlYWRlcnNbeHNyZkhlYWRlck5hbWVdID0geHNyZkNvb2tpZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBjb25zdCBib2R5ID0gZXh0cmFjdENvbnRlbnRUeXBlQW5kTWF5YmVTZXJpYWxpemVCb2R5KGNvbmZpZ3VyZWRCb2R5LCBoZWFkZXJzKTtcbiAgICAgICAgY29uc3QgX3JlcXVlc3QgPSBPYmplY3QuYXNzaWduKE9iamVjdC5hc3NpZ24oe30sIGNvbmZpZyksIHsgdXJsLFxuICAgICAgICAgICAgaGVhZGVycyxcbiAgICAgICAgICAgIGJvZHkgfSk7XG4gICAgICAgIGxldCB4aHI7XG4gICAgICAgIHhociA9IGluaXQuY3JlYXRlWEhSID8gaW5pdC5jcmVhdGVYSFIoKSA6IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICB7XG4gICAgICAgICAgICBjb25zdCB7IHByb2dyZXNzU3Vic2NyaWJlciwgaW5jbHVkZURvd25sb2FkUHJvZ3Jlc3MgPSBmYWxzZSwgaW5jbHVkZVVwbG9hZFByb2dyZXNzID0gZmFsc2UgfSA9IGluaXQ7XG4gICAgICAgICAgICBjb25zdCBhZGRFcnJvckV2ZW50ID0gKHR5cGUsIGVycm9yRmFjdG9yeSkgPT4ge1xuICAgICAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKHR5cGUsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIF9hO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBlcnJvciA9IGVycm9yRmFjdG9yeSgpO1xuICAgICAgICAgICAgICAgICAgICAoX2EgPSBwcm9ncmVzc1N1YnNjcmliZXIgPT09IG51bGwgfHwgcHJvZ3Jlc3NTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcm9ncmVzc1N1YnNjcmliZXIuZXJyb3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHByb2dyZXNzU3Vic2NyaWJlciwgZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgYWRkRXJyb3JFdmVudCgndGltZW91dCcsICgpID0+IG5ldyBBamF4VGltZW91dEVycm9yKHhociwgX3JlcXVlc3QpKTtcbiAgICAgICAgICAgIGFkZEVycm9yRXZlbnQoJ2Fib3J0JywgKCkgPT4gbmV3IEFqYXhFcnJvcignYWJvcnRlZCcsIHhociwgX3JlcXVlc3QpKTtcbiAgICAgICAgICAgIGNvbnN0IGNyZWF0ZVJlc3BvbnNlID0gKGRpcmVjdGlvbiwgZXZlbnQpID0+IG5ldyBBamF4UmVzcG9uc2UoZXZlbnQsIHhociwgX3JlcXVlc3QsIGAke2RpcmVjdGlvbn1fJHtldmVudC50eXBlfWApO1xuICAgICAgICAgICAgY29uc3QgYWRkUHJvZ3Jlc3NFdmVudCA9ICh0YXJnZXQsIHR5cGUsIGRpcmVjdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBkZXN0aW5hdGlvbi5uZXh0KGNyZWF0ZVJlc3BvbnNlKGRpcmVjdGlvbiwgZXZlbnQpKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBpZiAoaW5jbHVkZVVwbG9hZFByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgW0xPQURTVEFSVCwgUFJPR1JFU1MsIExPQURdLmZvckVhY2goKHR5cGUpID0+IGFkZFByb2dyZXNzRXZlbnQoeGhyLnVwbG9hZCwgdHlwZSwgVVBMT0FEKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocHJvZ3Jlc3NTdWJzY3JpYmVyKSB7XG4gICAgICAgICAgICAgICAgW0xPQURTVEFSVCwgUFJPR1JFU1NdLmZvckVhY2goKHR5cGUpID0+IHhoci51cGxvYWQuYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCAoZSkgPT4geyB2YXIgX2E7IHJldHVybiAoX2EgPSBwcm9ncmVzc1N1YnNjcmliZXIgPT09IG51bGwgfHwgcHJvZ3Jlc3NTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcm9ncmVzc1N1YnNjcmliZXIubmV4dCkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwocHJvZ3Jlc3NTdWJzY3JpYmVyLCBlKTsgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGluY2x1ZGVEb3dubG9hZFByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgW0xPQURTVEFSVCwgUFJPR1JFU1NdLmZvckVhY2goKHR5cGUpID0+IGFkZFByb2dyZXNzRXZlbnQoeGhyLCB0eXBlLCBET1dOTE9BRCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgZW1pdEVycm9yID0gKHN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IG1zZyA9ICdhamF4IGVycm9yJyArIChzdGF0dXMgPyAnICcgKyBzdGF0dXMgOiAnJyk7XG4gICAgICAgICAgICAgICAgZGVzdGluYXRpb24uZXJyb3IobmV3IEFqYXhFcnJvcihtc2csIHhociwgX3JlcXVlc3QpKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB4aHIuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoZSkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYTtcbiAgICAgICAgICAgICAgICAoX2EgPSBwcm9ncmVzc1N1YnNjcmliZXIgPT09IG51bGwgfHwgcHJvZ3Jlc3NTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcm9ncmVzc1N1YnNjcmliZXIuZXJyb3IpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5jYWxsKHByb2dyZXNzU3Vic2NyaWJlciwgZSk7XG4gICAgICAgICAgICAgICAgZW1pdEVycm9yKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHhoci5hZGRFdmVudExpc3RlbmVyKExPQUQsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHZhciBfYSwgX2I7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBzdGF0dXMgfSA9IHhocjtcbiAgICAgICAgICAgICAgICBpZiAoc3RhdHVzIDwgNDAwKSB7XG4gICAgICAgICAgICAgICAgICAgIChfYSA9IHByb2dyZXNzU3Vic2NyaWJlciA9PT0gbnVsbCB8fCBwcm9ncmVzc1N1YnNjcmliZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHByb2dyZXNzU3Vic2NyaWJlci5jb21wbGV0ZSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmNhbGwocHJvZ3Jlc3NTdWJzY3JpYmVyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlc3BvbnNlO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSBjcmVhdGVSZXNwb25zZShET1dOTE9BRCwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGVzdGluYXRpb24ubmV4dChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAoX2IgPSBwcm9ncmVzc1N1YnNjcmliZXIgPT09IG51bGwgfHwgcHJvZ3Jlc3NTdWJzY3JpYmVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBwcm9ncmVzc1N1YnNjcmliZXIuZXJyb3IpID09PSBudWxsIHx8IF9iID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYi5jYWxsKHByb2dyZXNzU3Vic2NyaWJlciwgZXZlbnQpO1xuICAgICAgICAgICAgICAgICAgICBlbWl0RXJyb3Ioc3RhdHVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCB7IHVzZXIsIG1ldGhvZCwgYXN5bmMgfSA9IF9yZXF1ZXN0O1xuICAgICAgICBpZiAodXNlcikge1xuICAgICAgICAgICAgeGhyLm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBfcmVxdWVzdC5wYXNzd29yZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4aHIub3BlbihtZXRob2QsIHVybCwgYXN5bmMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChhc3luYykge1xuICAgICAgICAgICAgeGhyLnRpbWVvdXQgPSBfcmVxdWVzdC50aW1lb3V0O1xuICAgICAgICAgICAgeGhyLnJlc3BvbnNlVHlwZSA9IF9yZXF1ZXN0LnJlc3BvbnNlVHlwZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ3dpdGhDcmVkZW50aWFscycgaW4geGhyKSB7XG4gICAgICAgICAgICB4aHIud2l0aENyZWRlbnRpYWxzID0gX3JlcXVlc3Qud2l0aENyZWRlbnRpYWxzO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIGhlYWRlcnMpIHtcbiAgICAgICAgICAgIGlmIChoZWFkZXJzLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihrZXksIGhlYWRlcnNba2V5XSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGJvZHkpIHtcbiAgICAgICAgICAgIHhoci5zZW5kKGJvZHkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeGhyLnNlbmQoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHhociAmJiB4aHIucmVhZHlTdGF0ZSAhPT0gNCkge1xuICAgICAgICAgICAgICAgIHhoci5hYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZXh0cmFjdENvbnRlbnRUeXBlQW5kTWF5YmVTZXJpYWxpemVCb2R5KGJvZHksIGhlYWRlcnMpIHtcbiAgICB2YXIgX2E7XG4gICAgaWYgKCFib2R5IHx8XG4gICAgICAgIHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJyB8fFxuICAgICAgICBpc0Zvcm1EYXRhKGJvZHkpIHx8XG4gICAgICAgIGlzVVJMU2VhcmNoUGFyYW1zKGJvZHkpIHx8XG4gICAgICAgIGlzQXJyYXlCdWZmZXIoYm9keSkgfHxcbiAgICAgICAgaXNGaWxlKGJvZHkpIHx8XG4gICAgICAgIGlzQmxvYihib2R5KSB8fFxuICAgICAgICBpc1JlYWRhYmxlU3RyZWFtKGJvZHkpKSB7XG4gICAgICAgIHJldHVybiBib2R5O1xuICAgIH1cbiAgICBpZiAoaXNBcnJheUJ1ZmZlclZpZXcoYm9keSkpIHtcbiAgICAgICAgcmV0dXJuIGJvZHkuYnVmZmVyO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGJvZHkgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIGhlYWRlcnNbJ2NvbnRlbnQtdHlwZSddID0gKF9hID0gaGVhZGVyc1snY29udGVudC10eXBlJ10pICE9PSBudWxsICYmIF9hICE9PSB2b2lkIDAgPyBfYSA6ICdhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTgnO1xuICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoYm9keSk7XG4gICAgfVxuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gYm9keSB0eXBlJyk7XG59XG5jb25zdCBfdG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuZnVuY3Rpb24gdG9TdHJpbmdDaGVjayhvYmosIG5hbWUpIHtcbiAgICByZXR1cm4gX3RvU3RyaW5nLmNhbGwob2JqKSA9PT0gYFtvYmplY3QgJHtuYW1lfV1gO1xufVxuZnVuY3Rpb24gaXNBcnJheUJ1ZmZlcihib2R5KSB7XG4gICAgcmV0dXJuIHRvU3RyaW5nQ2hlY2soYm9keSwgJ0FycmF5QnVmZmVyJyk7XG59XG5mdW5jdGlvbiBpc0ZpbGUoYm9keSkge1xuICAgIHJldHVybiB0b1N0cmluZ0NoZWNrKGJvZHksICdGaWxlJyk7XG59XG5mdW5jdGlvbiBpc0Jsb2IoYm9keSkge1xuICAgIHJldHVybiB0b1N0cmluZ0NoZWNrKGJvZHksICdCbG9iJyk7XG59XG5mdW5jdGlvbiBpc0FycmF5QnVmZmVyVmlldyhib2R5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiYgQXJyYXlCdWZmZXIuaXNWaWV3KGJvZHkpO1xufVxuZnVuY3Rpb24gaXNGb3JtRGF0YShib2R5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBGb3JtRGF0YSAhPT0gJ3VuZGVmaW5lZCcgJiYgYm9keSBpbnN0YW5jZW9mIEZvcm1EYXRhO1xufVxuZnVuY3Rpb24gaXNVUkxTZWFyY2hQYXJhbXMoYm9keSkge1xuICAgIHJldHVybiB0eXBlb2YgVVJMU2VhcmNoUGFyYW1zICE9PSAndW5kZWZpbmVkJyAmJiBib2R5IGluc3RhbmNlb2YgVVJMU2VhcmNoUGFyYW1zO1xufVxuZnVuY3Rpb24gaXNSZWFkYWJsZVN0cmVhbShib2R5KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBSZWFkYWJsZVN0cmVhbSAhPT0gJ3VuZGVmaW5lZCcgJiYgYm9keSBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YWpheC5qcy5tYXAiLCJpbXBvcnQgeyBfX3Jlc3QgfSBmcm9tIFwidHNsaWJcIjtcbmltcG9ydCB7IE9wZXJhdG9yU3Vic2NyaWJlciB9IGZyb20gJy4uLy4uL29wZXJhdG9ycy9PcGVyYXRvclN1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uLy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaW5uZXJGcm9tIH0gZnJvbSAnLi4vLi4vb2JzZXJ2YWJsZS9pbm5lckZyb20nO1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21GZXRjaChpbnB1dCwgaW5pdFdpdGhTZWxlY3RvciA9IHt9KSB7XG4gICAgY29uc3QgeyBzZWxlY3RvciB9ID0gaW5pdFdpdGhTZWxlY3RvciwgaW5pdCA9IF9fcmVzdChpbml0V2l0aFNlbGVjdG9yLCBbXCJzZWxlY3RvclwiXSk7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKChzdWJzY3JpYmVyKSA9PiB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICAgIGNvbnN0IHsgc2lnbmFsIH0gPSBjb250cm9sbGVyO1xuICAgICAgICBsZXQgYWJvcnRhYmxlID0gdHJ1ZTtcbiAgICAgICAgY29uc3QgeyBzaWduYWw6IG91dGVyU2lnbmFsIH0gPSBpbml0O1xuICAgICAgICBpZiAob3V0ZXJTaWduYWwpIHtcbiAgICAgICAgICAgIGlmIChvdXRlclNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgY29udHJvbGxlci5hYm9ydCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0ZXJTaWduYWxIYW5kbGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIXNpZ25hbC5hYm9ydGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyLmFib3J0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIG91dGVyU2lnbmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2Fib3J0Jywgb3V0ZXJTaWduYWxIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmFkZCgoKSA9PiBvdXRlclNpZ25hbC5yZW1vdmVFdmVudExpc3RlbmVyKCdhYm9ydCcsIG91dGVyU2lnbmFsSGFuZGxlcikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHBlclN1YnNjcmliZXJJbml0ID0gT2JqZWN0LmFzc2lnbihPYmplY3QuYXNzaWduKHt9LCBpbml0KSwgeyBzaWduYWwgfSk7XG4gICAgICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKGVycikgPT4ge1xuICAgICAgICAgICAgYWJvcnRhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgIH07XG4gICAgICAgIGZldGNoKGlucHV0LCBwZXJTdWJzY3JpYmVySW5pdClcbiAgICAgICAgICAgIC50aGVuKChyZXNwb25zZSkgPT4ge1xuICAgICAgICAgICAgaWYgKHNlbGVjdG9yKSB7XG4gICAgICAgICAgICAgICAgaW5uZXJGcm9tKHNlbGVjdG9yKHJlc3BvbnNlKSkuc3Vic2NyaWJlKG5ldyBPcGVyYXRvclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdW5kZWZpbmVkLCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFib3J0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgICAgICAgfSwgaGFuZGxlRXJyb3IpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFib3J0YWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dChyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAgICAgLmNhdGNoKGhhbmRsZUVycm9yKTtcbiAgICAgICAgcmV0dXJuICgpID0+IHtcbiAgICAgICAgICAgIGlmIChhYm9ydGFibGUpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyLmFib3J0KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1mZXRjaC5qcy5tYXAiLCJpbXBvcnQgeyBTdWJqZWN0LCBBbm9ueW1vdXNTdWJqZWN0IH0gZnJvbSAnLi4vLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJy4uLy4uL1JlcGxheVN1YmplY3QnO1xuY29uc3QgREVGQVVMVF9XRUJTT0NLRVRfQ09ORklHID0ge1xuICAgIHVybDogJycsXG4gICAgZGVzZXJpYWxpemVyOiAoZSkgPT4gSlNPTi5wYXJzZShlLmRhdGEpLFxuICAgIHNlcmlhbGl6ZXI6ICh2YWx1ZSkgPT4gSlNPTi5zdHJpbmdpZnkodmFsdWUpLFxufTtcbmNvbnN0IFdFQlNPQ0tFVFNVQkpFQ1RfSU5WQUxJRF9FUlJPUl9PQkpFQ1QgPSAnV2ViU29ja2V0U3ViamVjdC5lcnJvciBtdXN0IGJlIGNhbGxlZCB3aXRoIGFuIG9iamVjdCB3aXRoIGFuIGVycm9yIGNvZGUsIGFuZCBhbiBvcHRpb25hbCByZWFzb246IHsgY29kZTogbnVtYmVyLCByZWFzb246IHN0cmluZyB9JztcbmV4cG9ydCBjbGFzcyBXZWJTb2NrZXRTdWJqZWN0IGV4dGVuZHMgQW5vbnltb3VzU3ViamVjdCB7XG4gICAgY29uc3RydWN0b3IodXJsQ29uZmlnT3JTb3VyY2UsIGRlc3RpbmF0aW9uKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX3NvY2tldCA9IG51bGw7XG4gICAgICAgIGlmICh1cmxDb25maWdPclNvdXJjZSBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgICAgICAgIHRoaXMuZGVzdGluYXRpb24gPSBkZXN0aW5hdGlvbjtcbiAgICAgICAgICAgIHRoaXMuc291cmNlID0gdXJsQ29uZmlnT3JTb3VyY2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBjb25maWcgPSAodGhpcy5fY29uZmlnID0gT2JqZWN0LmFzc2lnbih7fSwgREVGQVVMVF9XRUJTT0NLRVRfQ09ORklHKSk7XG4gICAgICAgICAgICB0aGlzLl9vdXRwdXQgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiB1cmxDb25maWdPclNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICBjb25maWcudXJsID0gdXJsQ29uZmlnT3JTb3VyY2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiB1cmxDb25maWdPclNvdXJjZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodXJsQ29uZmlnT3JTb3VyY2UuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnW2tleV0gPSB1cmxDb25maWdPclNvdXJjZVtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCFjb25maWcuV2ViU29ja2V0Q3RvciAmJiBXZWJTb2NrZXQpIHtcbiAgICAgICAgICAgICAgICBjb25maWcuV2ViU29ja2V0Q3RvciA9IFdlYlNvY2tldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKCFjb25maWcuV2ViU29ja2V0Q3Rvcikge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbm8gV2ViU29ja2V0IGNvbnN0cnVjdG9yIGNhbiBiZSBmb3VuZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBSZXBsYXlTdWJqZWN0KCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgbGlmdChvcGVyYXRvcikge1xuICAgICAgICBjb25zdCBzb2NrID0gbmV3IFdlYlNvY2tldFN1YmplY3QodGhpcy5fY29uZmlnLCB0aGlzLmRlc3RpbmF0aW9uKTtcbiAgICAgICAgc29jay5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgICAgICBzb2NrLnNvdXJjZSA9IHRoaXM7XG4gICAgICAgIHJldHVybiBzb2NrO1xuICAgIH1cbiAgICBfcmVzZXRTdGF0ZSgpIHtcbiAgICAgICAgdGhpcy5fc29ja2V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCF0aGlzLnNvdXJjZSkge1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IG5ldyBSZXBsYXlTdWJqZWN0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb3V0cHV0ID0gbmV3IFN1YmplY3QoKTtcbiAgICB9XG4gICAgbXVsdGlwbGV4KHN1Yk1zZywgdW5zdWJNc2csIG1lc3NhZ2VGaWx0ZXIpIHtcbiAgICAgICAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZSgob2JzZXJ2ZXIpID0+IHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgc2VsZi5uZXh0KHN1Yk1zZygpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc2VsZi5zdWJzY3JpYmUoKHgpID0+IHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobWVzc2FnZUZpbHRlcih4KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb2JzZXJ2ZXIubmV4dCh4KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgKGVycikgPT4gb2JzZXJ2ZXIuZXJyb3IoZXJyKSwgKCkgPT4gb2JzZXJ2ZXIuY29tcGxldGUoKSk7XG4gICAgICAgICAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubmV4dCh1bnN1Yk1zZygpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBfY29ubmVjdFNvY2tldCgpIHtcbiAgICAgICAgY29uc3QgeyBXZWJTb2NrZXRDdG9yLCBwcm90b2NvbCwgdXJsLCBiaW5hcnlUeXBlIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICAgIGNvbnN0IG9ic2VydmVyID0gdGhpcy5fb3V0cHV0O1xuICAgICAgICBsZXQgc29ja2V0ID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHNvY2tldCA9IHByb3RvY29sID8gbmV3IFdlYlNvY2tldEN0b3IodXJsLCBwcm90b2NvbCkgOiBuZXcgV2ViU29ja2V0Q3Rvcih1cmwpO1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0ID0gc29ja2V0O1xuICAgICAgICAgICAgaWYgKGJpbmFyeVR5cGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zb2NrZXQuYmluYXJ5VHlwZSA9IGJpbmFyeVR5cGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGUpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5fc29ja2V0ID0gbnVsbDtcbiAgICAgICAgICAgIGlmIChzb2NrZXQgJiYgc29ja2V0LnJlYWR5U3RhdGUgPT09IDEpIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNvY2tldC5vbm9wZW4gPSAoZXZ0KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB7IF9zb2NrZXQgfSA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoIV9zb2NrZXQpIHtcbiAgICAgICAgICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgeyBvcGVuT2JzZXJ2ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgICAgIGlmIChvcGVuT2JzZXJ2ZXIpIHtcbiAgICAgICAgICAgICAgICBvcGVuT2JzZXJ2ZXIubmV4dChldnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc3QgcXVldWUgPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgICAgICAgICAgdGhpcy5kZXN0aW5hdGlvbiA9IFN1YnNjcmliZXIuY3JlYXRlKCh4KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHNvY2tldC5yZWFkeVN0YXRlID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCB7IHNlcmlhbGl6ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvY2tldC5zZW5kKHNlcmlhbGl6ZXIoeCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSwgKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2xvc2luZ09ic2VydmVyIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICAgICAgICAgICAgaWYgKGNsb3NpbmdPYnNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgICBjbG9zaW5nT2JzZXJ2ZXIubmV4dCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoZXJyICYmIGVyci5jb2RlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNvY2tldC5jbG9zZShlcnIuY29kZSwgZXJyLnJlYXNvbik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihuZXcgVHlwZUVycm9yKFdFQlNPQ0tFVFNVQkpFQ1RfSU5WQUxJRF9FUlJPUl9PQkpFQ1QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgICAgICAgfSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHsgY2xvc2luZ09ic2VydmVyIH0gPSB0aGlzLl9jb25maWc7XG4gICAgICAgICAgICAgICAgaWYgKGNsb3NpbmdPYnNlcnZlcikge1xuICAgICAgICAgICAgICAgICAgICBjbG9zaW5nT2JzZXJ2ZXIubmV4dCh1bmRlZmluZWQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGlmIChxdWV1ZSAmJiBxdWV1ZSBpbnN0YW5jZW9mIFJlcGxheVN1YmplY3QpIHtcbiAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb24uYWRkKHF1ZXVlLnN1YnNjcmliZSh0aGlzLmRlc3RpbmF0aW9uKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNvY2tldC5vbmVycm9yID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICAgICAgICAgIG9ic2VydmVyLmVycm9yKGUpO1xuICAgICAgICB9O1xuICAgICAgICBzb2NrZXQub25jbG9zZSA9IChlKSA9PiB7XG4gICAgICAgICAgICBpZiAoc29ja2V0ID09PSB0aGlzLl9zb2NrZXQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yZXNldFN0YXRlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCB7IGNsb3NlT2JzZXJ2ZXIgfSA9IHRoaXMuX2NvbmZpZztcbiAgICAgICAgICAgIGlmIChjbG9zZU9ic2VydmVyKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VPYnNlcnZlci5uZXh0KGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGUud2FzQ2xlYW4pIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JzZXJ2ZXIuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHNvY2tldC5vbm1lc3NhZ2UgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCB7IGRlc2VyaWFsaXplciB9ID0gdGhpcy5fY29uZmlnO1xuICAgICAgICAgICAgICAgIG9ic2VydmVyLm5leHQoZGVzZXJpYWxpemVyKGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlci5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBfc3Vic2NyaWJlKHN1YnNjcmliZXIpIHtcbiAgICAgICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghdGhpcy5fc29ja2V0KSB7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0U29ja2V0KCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb3V0cHV0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgICAgc3Vic2NyaWJlci5hZGQoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyBfc29ja2V0IH0gPSB0aGlzO1xuICAgICAgICAgICAgaWYgKHRoaXMuX291dHB1dC5vYnNlcnZlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgaWYgKF9zb2NrZXQgJiYgKF9zb2NrZXQucmVhZHlTdGF0ZSA9PT0gMSB8fCBfc29ja2V0LnJlYWR5U3RhdGUgPT09IDApKSB7XG4gICAgICAgICAgICAgICAgICAgIF9zb2NrZXQuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVzZXRTdGF0ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gICAgfVxuICAgIHVuc3Vic2NyaWJlKCkge1xuICAgICAgICBjb25zdCB7IF9zb2NrZXQgfSA9IHRoaXM7XG4gICAgICAgIGlmIChfc29ja2V0ICYmIChfc29ja2V0LnJlYWR5U3RhdGUgPT09IDEgfHwgX3NvY2tldC5yZWFkeVN0YXRlID09PSAwKSkge1xuICAgICAgICAgICAgX3NvY2tldC5jbG9zZSgpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3Jlc2V0U3RhdGUoKTtcbiAgICAgICAgc3VwZXIudW5zdWJzY3JpYmUoKTtcbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1XZWJTb2NrZXRTdWJqZWN0LmpzLm1hcCIsImltcG9ydCB7IFdlYlNvY2tldFN1YmplY3QgfSBmcm9tICcuL1dlYlNvY2tldFN1YmplY3QnO1xuZXhwb3J0IGZ1bmN0aW9uIHdlYlNvY2tldCh1cmxDb25maWdPclNvdXJjZSkge1xuICAgIHJldHVybiBuZXcgV2ViU29ja2V0U3ViamVjdCh1cmxDb25maWdPclNvdXJjZSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD13ZWJTb2NrZXQuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGFwcGx5TWl4aW5zKGRlcml2ZWRDdG9yLCBiYXNlQ3RvcnMpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbGVuID0gYmFzZUN0b3JzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGJhc2VDdG9yID0gYmFzZUN0b3JzW2ldO1xuICAgICAgICBjb25zdCBwcm9wZXJ0eUtleXMgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhiYXNlQ3Rvci5wcm90b3R5cGUpO1xuICAgICAgICBmb3IgKGxldCBqID0gMCwgbGVuMiA9IHByb3BlcnR5S2V5cy5sZW5ndGg7IGogPCBsZW4yOyBqKyspIHtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBwcm9wZXJ0eUtleXNbal07XG4gICAgICAgICAgICBkZXJpdmVkQ3Rvci5wcm90b3R5cGVbbmFtZV0gPSBiYXNlQ3Rvci5wcm90b3R5cGVbbmFtZV07XG4gICAgICAgIH1cbiAgICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcHBseU1peGlucy5qcy5tYXAiXSwibmFtZXMiOlsiU3ltYm9sX29ic2VydmFibGUiLCJoaWdoZXJPcmRlclJlZkNvdW50IiwibGFzdCIsIlN5bWJvbF9pdGVyYXRvciIsIml0ZXJhdG9yIiwiaXNBcnJheSIsImNvbWJpbmVMYXRlc3QiLCJjb25jYXQiLCJERUZBVUxUX0NPTkZJRyIsImFzeW5jU2NoZWR1bGVyIiwibWVyZ2UiLCJvbkVycm9yUmVzdW1lTmV4dCIsIm9uRXJyb3JSZXN1bWVOZXh0V2l0aCIsInBhcnRpdGlvbiIsInJhY2UiLCJ6aXAiLCJ6aXBTdGF0aWMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7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O1lBQy9ELFFBQVEsU0FBUyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNuRyxRQUFRLFNBQVMsUUFBUSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN0RyxRQUFRLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBRTtZQUN0SCxRQUFRLElBQUksQ0FBQyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztZQUM5RSxLQUFLLENBQUMsQ0FBQztZQUNQLENBQUM7QUF5Q0Q7WUFDTyxTQUFTLFFBQVEsQ0FBQyxDQUFDLEVBQUU7WUFDNUIsSUFBSSxJQUFJLENBQUMsR0FBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLElBQUksTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2xGLElBQUksSUFBSSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVCLElBQUksSUFBSSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxLQUFLLFFBQVEsRUFBRSxPQUFPO1lBQ2xELFFBQVEsSUFBSSxFQUFFLFlBQVk7WUFDMUIsWUFBWSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLENBQUM7WUFDL0MsWUFBWSxPQUFPLEVBQUUsS0FBSyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUNwRCxTQUFTO1lBQ1QsS0FBSyxDQUFDO1lBQ04sSUFBSSxNQUFNLElBQUksU0FBUyxDQUFDLENBQUMsR0FBRyx5QkFBeUIsR0FBRyxpQ0FBaUMsQ0FBQyxDQUFDO1lBQzNGLENBQUM7QUE0Q0Q7WUFDTyxTQUFTLE9BQU8sQ0FBQyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxPQUFPLElBQUksWUFBWSxPQUFPLElBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pFLENBQUM7QUFDRDtZQUNPLFNBQVMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUU7WUFDakUsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsRUFBRSxNQUFNLElBQUksU0FBUyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7WUFDM0YsSUFBSSxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxVQUFVLElBQUksRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDbEUsSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxZQUFZLEVBQUUsT0FBTyxJQUFJLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUMxSCxJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDOUksSUFBSSxTQUFTLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUN0RixJQUFJLFNBQVMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxLQUFLLFlBQVksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM1SCxJQUFJLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENB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
