System.register(['rxjs', 'rxjs/operators'], (function (exports) {
  'use strict';
  var BehaviorSubject, Subject, fromEvent, merge, tap, audit, map, distinctUntilChanged;
  return {
    setters: [function (module) {
      BehaviorSubject = module.BehaviorSubject;
      Subject = module.Subject;
      fromEvent = module.fromEvent;
      merge = module.merge;
    }, function (module) {
      tap = module.tap;
      audit = module.audit;
      map = module.map;
      distinctUntilChanged = module.distinctUntilChanged;
    }],
    execute: (function () {

      const rectKeys = ["height", "width", "x", "y"];
      function isSame(previous, current) {
        if (previous.size !== current.size) {
          return false;
        }
        return Array.from(previous.entries()).every(([element, { raw }]) => {
          const newRect = current.get(element);
          if (!newRect) {
            return false;
          }
          return rectKeys.every((key) => newRect.raw[key] === raw[key]);
        });
      }
      function calcRect(raw, rootXY) {
        const X = rootXY.x;
        const Y = rootXY.y;
        const rect = {
          height: Math.round(raw.height),
          width: Math.round(raw.width),
          x: Math.round(raw.x - X),
          y: Math.round(raw.y - Y)
        };
        return rect;
      }

      class Radar {
        constructor(root) {
          this.targets$ = new BehaviorSubject([]);
          this.resizeSign$ = new Subject();
          this.report = /* @__PURE__ */ new Map();
          this.reportUpdatedSign$ = new Subject();
          this.onResize = () => {
            this.resizeSign$.next("resized");
          };
          this.intersectionObserverCallback = (entries) => {
            var _a, _b;
            if (!entries.length) {
              return;
            }
            const rootXY = this.root ? { x: ((_a = entries[0].rootBounds) == null ? void 0 : _a.x) || 0, y: ((_b = entries[0].rootBounds) == null ? void 0 : _b.y) || 0 } : { x: 0, y: 0 };
            this.report = /* @__PURE__ */ new Map();
            entries.forEach(({ target, boundingClientRect, isIntersecting }) => {
              if (isIntersecting) {
                const relativeRect = calcRect(boundingClientRect, rootXY);
                this.report.set(target, { relativeRect, raw: boundingClientRect });
              }
            });
            this.reportUpdatedSign$.next();
          };
          this.root = root;
          this.visibleObserver = new IntersectionObserver(this.intersectionObserverCallback, { root });
          const scroll$ = fromEvent(document, "scroll");
          const scrollDone$ = new BehaviorSubject(void 0);
          let timer;
          scroll$.subscribe(() => {
            clearTimeout(timer);
            timer = window.setTimeout(() => {
              scrollDone$.next();
            }, 250);
          });
          this.resizeObserver = new ResizeObserver(this.onResize);
          this.resizeObserver.observe(document.body);
          this.targets$.subscribe((targets) => {
            this.resizeObserver.disconnect();
            this.resizeObserver.observe(document.body);
            targets.forEach((target) => {
              this.resizeObserver.observe(target);
            });
          });
          merge(this.targets$, this.resizeSign$).pipe(tap(() => {
            this.visibleObserver.disconnect();
          }), audit(() => scrollDone$)).subscribe(() => {
            this.targets$.value.forEach((ele) => {
              this.visibleObserver.observe(ele);
            });
          });
        }
        addTargets(elements) {
          this.targets$.next([...this.targets$.value, ...elements]);
        }
        removeTargets(element) {
          const leftTargets = this.targets$.value.filter((ele) => !element.includes(ele));
          this.track(leftTargets);
        }
        track(elements) {
          this.targets$.next(elements);
        }
        getReport$() {
          return this.reportUpdatedSign$.pipe(map(() => {
            const newReport = /* @__PURE__ */ new Map();
            this.report.forEach((value, key) => newReport.set(key, value));
            return newReport;
          }), distinctUntilChanged(isSame));
        }
      } exports('default', Radar);

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy91dGlscy50cyIsIi4uLy4uLy4uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdHlwZSB7IFJlY3QsIFJlcG9ydCB9IGZyb20gJy4vdHlwZSc7XG5cbmNvbnN0IHJlY3RLZXlzOiBBcnJheTxrZXlvZiBSZWN0PiA9IFsnaGVpZ2h0JywgJ3dpZHRoJywgJ3gnLCAneSddO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNTYW1lKHByZXZpb3VzOiBSZXBvcnQsIGN1cnJlbnQ6IFJlcG9ydCk6IGJvb2xlYW4ge1xuICBpZiAocHJldmlvdXMuc2l6ZSAhPT0gY3VycmVudC5zaXplKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIEFycmF5LmZyb20ocHJldmlvdXMuZW50cmllcygpKS5ldmVyeSgoW2VsZW1lbnQsIHsgcmF3IH1dKSA9PiB7XG4gICAgY29uc3QgbmV3UmVjdCA9IGN1cnJlbnQuZ2V0KGVsZW1lbnQpO1xuICAgIGlmICghbmV3UmVjdCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiByZWN0S2V5cy5ldmVyeSgoa2V5KSA9PiBuZXdSZWN0LnJhd1trZXldID09PSByYXdba2V5XSk7XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2FsY1JlY3QocmF3OiBET01SZWN0UmVhZE9ubHksIHJvb3RYWTogeyB4OiBudW1iZXI7IHk6IG51bWJlciB9KTogUmVjdCB7XG4gIGNvbnN0IFggPSByb290WFkueDtcbiAgY29uc3QgWSA9IHJvb3RYWS55O1xuXG4gIGNvbnN0IHJlY3Q6IFJlY3QgPSB7XG4gICAgaGVpZ2h0OiBNYXRoLnJvdW5kKHJhdy5oZWlnaHQpLFxuICAgIHdpZHRoOiBNYXRoLnJvdW5kKHJhdy53aWR0aCksXG4gICAgeDogTWF0aC5yb3VuZChyYXcueCAtIFgpLFxuICAgIHk6IE1hdGgucm91bmQocmF3LnkgLSBZKSxcbiAgfTtcblxuICByZXR1cm4gcmVjdDtcbn1cbiIsImltcG9ydCB7IG1lcmdlLCBmcm9tRXZlbnQsIEJlaGF2aW9yU3ViamVjdCwgU3ViamVjdCwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgbWFwLCBhdWRpdCwgdGFwLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgY2FsY1JlY3QsIGlzU2FtZSB9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IHR5cGUgeyBSZXBvcnQsIFJlY3QsIEVsZW1lbnRSZWN0IH0gZnJvbSAnLi90eXBlJztcblxuZXhwb3J0IHR5cGUgeyBSZXBvcnQsIFJlY3QsIEVsZW1lbnRSZWN0IH07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJhZGFyIHtcbiAgcHJpdmF0ZSB0YXJnZXRzJDogQmVoYXZpb3JTdWJqZWN0PEhUTUxFbGVtZW50W10+ID0gbmV3IEJlaGF2aW9yU3ViamVjdDxIVE1MRWxlbWVudFtdPihbXSk7XG4gIHByaXZhdGUgcmVzaXplU2lnbiQ6IFN1YmplY3Q8dW5rbm93bj4gPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIHJlc2l6ZU9ic2VydmVyOiBSZXNpemVPYnNlcnZlcjtcbiAgcHJpdmF0ZSByZXBvcnQ6IFJlcG9ydCA9IG5ldyBNYXAoKTtcbiAgcHJpdmF0ZSByZXBvcnRVcGRhdGVkU2lnbiQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIHZpc2libGVPYnNlcnZlcjogSW50ZXJzZWN0aW9uT2JzZXJ2ZXI7XG4gIHByaXZhdGUgcm9vdDogSFRNTEVsZW1lbnQgfCB1bmRlZmluZWQ7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKHJvb3Q/OiBIVE1MRWxlbWVudCkge1xuICAgIHRoaXMucm9vdCA9IHJvb3Q7XG4gICAgdGhpcy52aXNpYmxlT2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIodGhpcy5pbnRlcnNlY3Rpb25PYnNlcnZlckNhbGxiYWNrLCB7IHJvb3QgfSk7XG5cbiAgICBjb25zdCBzY3JvbGwkID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnc2Nyb2xsJyk7XG5cbiAgICBjb25zdCBzY3JvbGxEb25lJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8dm9pZD4odW5kZWZpbmVkKTtcbiAgICBsZXQgdGltZXI6IG51bWJlcjtcblxuICAgIHNjcm9sbCQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgICB0aW1lciA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgc2Nyb2xsRG9uZSQubmV4dCgpO1xuICAgICAgfSwgMjUwKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIgPSBuZXcgUmVzaXplT2JzZXJ2ZXIodGhpcy5vblJlc2l6ZSk7XG4gICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgdGhpcy50YXJnZXRzJC5zdWJzY3JpYmUoKHRhcmdldHMpID0+IHtcbiAgICAgIHRoaXMucmVzaXplT2JzZXJ2ZXIuZGlzY29ubmVjdCgpO1xuICAgICAgdGhpcy5yZXNpemVPYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgICB0YXJnZXRzLmZvckVhY2goKHRhcmdldCkgPT4ge1xuICAgICAgICB0aGlzLnJlc2l6ZU9ic2VydmVyLm9ic2VydmUodGFyZ2V0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgbWVyZ2UodGhpcy50YXJnZXRzJCwgdGhpcy5yZXNpemVTaWduJClcbiAgICAgIC5waXBlKFxuICAgICAgICAvLyBhdWRpdFRpbWUoMTAwKSxcbiAgICAgICAgLy8gZGVib3VuY2UoKCkgPT4gYW5pbWF0aW9uRnJhbWVzKCkpLFxuICAgICAgICAvLyBhdWRpdFRpbWUoMTUwKSxcbiAgICAgICAgdGFwKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnZpc2libGVPYnNlcnZlci5kaXNjb25uZWN0KCk7XG4gICAgICAgIH0pLFxuICAgICAgICBhdWRpdCgoKSA9PiBzY3JvbGxEb25lJCksXG4gICAgICApXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy50YXJnZXRzJC52YWx1ZS5mb3JFYWNoKChlbGUpID0+IHtcbiAgICAgICAgICB0aGlzLnZpc2libGVPYnNlcnZlci5vYnNlcnZlKGVsZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIG9uUmVzaXplID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMucmVzaXplU2lnbiQubmV4dCgncmVzaXplZCcpO1xuICB9O1xuXG4gIHByaXZhdGUgaW50ZXJzZWN0aW9uT2JzZXJ2ZXJDYWxsYmFjayA9IChlbnRyaWVzOiBJbnRlcnNlY3Rpb25PYnNlcnZlckVudHJ5W10pOiB2b2lkID0+IHtcbiAgICBpZiAoIWVudHJpZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgcm9vdFhZID0gdGhpcy5yb290XG4gICAgICA/IHsgeDogZW50cmllc1swXS5yb290Qm91bmRzPy54IHx8IDAsIHk6IGVudHJpZXNbMF0ucm9vdEJvdW5kcz8ueSB8fCAwIH1cbiAgICAgIDogeyB4OiAwLCB5OiAwIH07XG4gICAgdGhpcy5yZXBvcnQgPSBuZXcgTWFwPEhUTUxFbGVtZW50LCBFbGVtZW50UmVjdD4oKTtcbiAgICBlbnRyaWVzLmZvckVhY2goKHsgdGFyZ2V0LCBib3VuZGluZ0NsaWVudFJlY3QsIGlzSW50ZXJzZWN0aW5nIH0pID0+IHtcbiAgICAgIGlmIChpc0ludGVyc2VjdGluZykge1xuICAgICAgICBjb25zdCByZWxhdGl2ZVJlY3Q6IFJlY3QgPSBjYWxjUmVjdChib3VuZGluZ0NsaWVudFJlY3QsIHJvb3RYWSk7XG4gICAgICAgIHRoaXMucmVwb3J0LnNldCh0YXJnZXQgYXMgSFRNTEVsZW1lbnQsIHsgcmVsYXRpdmVSZWN0LCByYXc6IGJvdW5kaW5nQ2xpZW50UmVjdCB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMucmVwb3J0VXBkYXRlZFNpZ24kLm5leHQoKTtcbiAgfTtcblxuICBwdWJsaWMgYWRkVGFyZ2V0cyhlbGVtZW50czogSFRNTEVsZW1lbnRbXSk6IHZvaWQge1xuICAgIHRoaXMudGFyZ2V0cyQubmV4dChbLi4udGhpcy50YXJnZXRzJC52YWx1ZSwgLi4uZWxlbWVudHNdKTtcbiAgfVxuXG4gIHB1YmxpYyByZW1vdmVUYXJnZXRzKGVsZW1lbnQ6IEVsZW1lbnRbXSk6IHZvaWQge1xuICAgIGNvbnN0IGxlZnRUYXJnZXRzID0gdGhpcy50YXJnZXRzJC52YWx1ZS5maWx0ZXIoKGVsZSkgPT4gIWVsZW1lbnQuaW5jbHVkZXMoZWxlKSk7XG4gICAgdGhpcy50cmFjayhsZWZ0VGFyZ2V0cyk7XG4gIH1cblxuICBwdWJsaWMgdHJhY2soZWxlbWVudHM6IEhUTUxFbGVtZW50W10pOiB2b2lkIHtcbiAgICB0aGlzLnRhcmdldHMkLm5leHQoZWxlbWVudHMpO1xuICB9XG5cbiAgcHVibGljIGdldFJlcG9ydCQoKTogT2JzZXJ2YWJsZTxSZXBvcnQ+IHtcbiAgICByZXR1cm4gdGhpcy5yZXBvcnRVcGRhdGVkU2lnbiQucGlwZShcbiAgICAgIG1hcCgoKSA9PiB7XG4gICAgICAgIC8vIHRvZG8gb3B0aW1pemUgdGhpcyBvZiBtYWtpbmcgY29weVxuICAgICAgICBjb25zdCBuZXdSZXBvcnQ6IFJlcG9ydCA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5yZXBvcnQuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4gbmV3UmVwb3J0LnNldChrZXksIHZhbHVlKSk7XG4gICAgICAgIHJldHVybiBuZXdSZXBvcnQ7XG4gICAgICB9KSxcbiAgICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKGlzU2FtZSksXG4gICAgKTtcbiAgfVxufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O01BRUEsTUFBTSxXQUE4QixDQUFDLFVBQVUsU0FBUyxLQUFLLEdB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
