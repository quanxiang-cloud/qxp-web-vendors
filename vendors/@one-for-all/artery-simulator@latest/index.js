System.register(['react', './inject-css-11ac49aa.js', 'rxjs', '@one-for-all/utils'], (function (exports, module) {
  'use strict';
  var React, useState, useEffect, useRef, useImperativeHandle, MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN, MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID, MESSAGE_TYPE_ACTIVE_NODE, MESSAGE_TYPE_ARTERY, n, Messenger, cs, noop;
  return {
    setters: [function (module) {
      React = module["default"];
      useState = module.useState;
      useEffect = module.useEffect;
      useRef = module.useRef;
      useImperativeHandle = module.useImperativeHandle;
    }, function (module) {
      MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN = module.M;
      MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID = module.a;
      MESSAGE_TYPE_ACTIVE_NODE = module.b;
      MESSAGE_TYPE_ARTERY = module.c;
      n = module.n;
      Messenger = module.d;
      cs = module.e;
    }, function (module) {
      noop = module.noop;
    }, function () {}],
    execute: (function () {

      function toHTML(elements) {
        const template = document.createElement("div");
        elements.forEach((element) => {
          const n = document.createElement(element.name);
          Object.entries(element.attrs).forEach(([key, value]) => {
            n.setAttribute(key, value);
          });
          if (element.innerText) {
            n.innerHTML = element.innerText;
          }
          template.appendChild(n);
        });
        return template.innerHTML;
      }
      function injectHTML(iframe, headElements, onLoad) {
        var _a, _b, _c;
        if (iframe.contentWindow) {
          iframe.contentWindow.__fenceIframeLoad = () => {
            onLoad == null ? void 0 : onLoad();
          };
        }
        (_a = iframe.contentDocument) == null ? void 0 : _a.open();
        (_b = iframe.contentDocument) == null ? void 0 : _b.write(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script>
      window.onload = (event) => {
        if (window.__fenceIframeLoad) {
          window.__fenceIframeLoad();
        }
      };
    <\/script>
    ${toHTML(headElements)}
  </head>
  <body>
  </body>
  </html>
  `);
        (_c = iframe.contentDocument) == null ? void 0 : _c.close();
      }
      function Fence({ headElements, onLoad }, ref) {
        const [iframeElement, setIframe] = useState();
        useEffect(() => {
          if (!iframeElement) {
            return;
          }
          injectHTML(iframeElement, headElements, onLoad);
        }, [iframeElement]);
        return /* @__PURE__ */ React.createElement("iframe", {
          className: "simulator-fence",
          ref: (_ref) => {
            if (!_ref) {
              return;
            }
            if (typeof ref === "function") {
              ref(_ref);
            } else if (ref && "current" in ref) {
              ref.current = _ref;
            }
            setIframe(_ref);
          }
        });
      }
      var fence_default = React.forwardRef(Fence);

      function useSyncResponders(messenger, isNodeSupportChildren) {
        useEffect(() => {
          if (!messenger) {
            return;
          }
          messenger.addResponders({
            [MESSAGE_TYPE_CHECK_NODE_SUPPORT_CHILDREN]: isNodeSupportChildren
          });
        }, [isNodeSupportChildren, messenger]);
      }
      function useSyncActiveModalLayer(messenger, setActiveOverLayerNodeID, activeOverLayerNodeID) {
        useEffect(() => {
          if (!messenger) {
            return;
          }
          const subscription = messenger.listen(MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID).subscribe((activeModalRootID) => {
            setActiveOverLayerNodeID(activeModalRootID);
          });
          return () => {
            subscription.unsubscribe();
          };
        }, [setActiveOverLayerNodeID, messenger]);
        useEffect(() => {
          if (!messenger) {
            return;
          }
          messenger.send(MESSAGE_TYPE_ACTIVE_OVER_LAYER_NODE_ID, activeOverLayerNodeID);
        }, [activeOverLayerNodeID, messenger]);
      }
      function useSyncActiveNode(messenger, setActiveNode, activeNode) {
        const activeNodeID = useRef();
        useEffect(() => {
          if (!messenger) {
            return;
          }
          const subscription = messenger.listen(MESSAGE_TYPE_ACTIVE_NODE).subscribe((_activeNode) => {
            setActiveNode(_activeNode);
          });
          return () => {
            subscription.unsubscribe();
          };
        }, [setActiveNode, messenger]);
        useEffect(() => {
          if (!messenger) {
            return;
          }
          if (activeNodeID.current !== (activeNode == null ? void 0 : activeNode.id)) {
            messenger.send(MESSAGE_TYPE_ACTIVE_NODE, activeNode);
            activeNodeID.current = activeNode == null ? void 0 : activeNode.id;
          }
        }, [activeNode, messenger]);
      }
      function useSyncArtery(messenger, onChange, artery) {
        useEffect(() => {
          if (!messenger) {
            return;
          }
          const subscription = messenger.listen(MESSAGE_TYPE_ARTERY).subscribe((_artery) => {
            onChange(_artery);
          });
          return () => {
            subscription.unsubscribe();
          };
        }, [onChange, messenger]);
        useEffect(() => {
          if (!messenger) {
            return;
          }
          messenger.send(MESSAGE_TYPE_ARTERY, artery);
        }, [artery, messenger]);
      }

      var simulatorRef = new URL('index-9cf3f96b.js', module.meta.url).href;

      function buildHeadElements(pluginsSrc, cssURLs) {
        const importMaps = Array.from(document.scripts).filter((s) => s.type === "systemjs-importmap").map((s) => JSON.parse(s.innerText)).map((s) => JSON.stringify(s)).map((s) => ({
          name: "script",
          attrs: { type: "systemjs-importmap" },
          innerText: s
        }));
        const patchSrc = pluginsSrc.startsWith("http") ? pluginsSrc : `${window.origin}${pluginsSrc}`;
        const headElements = importMaps.concat([
          {
            name: "script",
            attrs: { type: "systemjs-importmap" },
            innerText: `{
        "imports": {
          "TEMPORARY_PATCH_FOR_ARTERY_PLUGINS": "${patchSrc}"
        }
      }`
          },
          {
            name: "script",
            attrs: { src: "https://ofapkg.pek3b.qingstor.com/system@6.10.3/system.6.10.3.min.js" }
          },
          {
            name: "script",
            attrs: { src: simulatorRef }
          }
        ]);
        const links = (cssURLs || []).map((url) => {
          return { name: "link", attrs: { rel: "stylesheet", href: url } };
        });
        return headElements.concat(links);
      }

      var css = ".artery-simulator {\n  position: relative;\n  display: grid;\n  grid-template-columns: 1fr;\n  grid-template-columns: 1fr;\n  padding: 16px;\n}\n\n.simulator-fence {\n  width: 100%;\n  height: 100%;\n  background-color: white;\n  border: none;\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.11), 0 2px 2px rgba(0, 0, 0, 0.11), 0 4px 4px rgba(0, 0, 0, 0.11), 0 6px 8px rgba(0, 0, 0, 0.11), 0 8px 16px rgba(0, 0, 0, 0.11);\n}";
      n(css,{});

      function Simulator({
        activeOverLayerNodeID,
        activeNode,
        artery,
        className,
        cssURLs,
        isContainer,
        onChange,
        pluginsSrc,
        setActiveOverLayerNodeID,
        setActiveNode,
        overLayerComponents
      }, simulatorRef) {
        const iframeRef = useRef(null);
        const [messenger, setMessenger] = useState();
        const [iframeLoad, setIframeLoad] = useState(false);
        useImperativeHandle(simulatorRef, () => {
          return { iframe: iframeRef.current || null };
        });
        useEffect(() => {
          var _a, _b;
          if (!((_a = iframeRef.current) == null ? void 0 : _a.contentWindow) || !iframeLoad) {
            return;
          }
          const msgr = new Messenger((_b = iframeRef.current) == null ? void 0 : _b.contentWindow, "host-side");
          msgr.waitForReady().then(() => {
            msgr.send(MESSAGE_TYPE_ARTERY, artery);
          }).catch(noop);
          setMessenger(msgr);
          iframeRef.current.contentWindow.__OVER_LAYER_COMPONENTS = overLayerComponents;
        }, [iframeLoad]);
        useSyncResponders(messenger, isContainer);
        useSyncArtery(messenger, onChange, artery);
        useSyncActiveNode(messenger, setActiveNode, activeNode);
        useSyncActiveModalLayer(messenger, setActiveOverLayerNodeID, activeOverLayerNodeID);
        return /* @__PURE__ */ React.createElement("div", {
          className: cs("artery-simulator", className)
        }, /* @__PURE__ */ React.createElement(fence_default, {
          ref: iframeRef,
          headElements: buildHeadElements(pluginsSrc, cssURLs),
          onLoad: () => setIframeLoad(true)
        }));
      }
      var src_default = exports('default', React.forwardRef(Simulator));

    })
  };
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvZmVuY2UudHN4IiwiLi4vLi4vLi4vc3JjL3N5bmMtaG9va3MudHN4IiwiLi4vLi4vLi4vc3JjL2J1aWxkLWhlYWQtZWxlbWVudHMudHN4IiwiLi4vLi4vLi4vc3JjL2luZGV4LnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QsIHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IHR5cGUgSW5qZWN0RWxlbWVudCA9IHtcbiAgbmFtZTogc3RyaW5nO1xuICBhdHRyczogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgaW5uZXJUZXh0Pzogc3RyaW5nO1xufTtcblxuZnVuY3Rpb24gdG9IVE1MKGVsZW1lbnRzOiBJbmplY3RFbGVtZW50W10pOiBzdHJpbmcge1xuICBjb25zdCB0ZW1wbGF0ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gIGVsZW1lbnRzLmZvckVhY2goKGVsZW1lbnQpID0+IHtcbiAgICBjb25zdCBuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlbGVtZW50Lm5hbWUpO1xuICAgIE9iamVjdC5lbnRyaWVzKGVsZW1lbnQuYXR0cnMpLmZvckVhY2goKFtrZXksIHZhbHVlXSkgPT4ge1xuICAgICAgbi5zZXRBdHRyaWJ1dGUoa2V5LCB2YWx1ZSk7XG4gICAgfSk7XG5cbiAgICBpZiAoZWxlbWVudC5pbm5lclRleHQpIHtcbiAgICAgIG4uaW5uZXJIVE1MID0gZWxlbWVudC5pbm5lclRleHQ7XG4gICAgfVxuXG4gICAgdGVtcGxhdGUuYXBwZW5kQ2hpbGQobik7XG4gIH0pO1xuXG4gIHJldHVybiB0ZW1wbGF0ZS5pbm5lckhUTUw7XG59XG5cbmZ1bmN0aW9uIGluamVjdEhUTUwoXG4gIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQsXG4gIGhlYWRFbGVtZW50czogQXJyYXk8SW5qZWN0RWxlbWVudD4sXG4gIG9uTG9hZD86ICgpID0+IHZvaWQsXG4pOiB2b2lkIHtcbiAgaWYgKGlmcmFtZS5jb250ZW50V2luZG93KSB7XG4gICAgLy8gQHRzLWlnbm9yZVxuICAgIGlmcmFtZS5jb250ZW50V2luZG93Ll9fZmVuY2VJZnJhbWVMb2FkID0gKCkgPT4ge1xuICAgICAgb25Mb2FkPy4oKTtcbiAgICB9O1xuICB9XG4gIGlmcmFtZS5jb250ZW50RG9jdW1lbnQ/Lm9wZW4oKTtcbiAgaWZyYW1lLmNvbnRlbnREb2N1bWVudD8ud3JpdGUoYFxuICA8IURPQ1RZUEUgaHRtbD5cbiAgPGh0bWwgbGFuZz1cImVuXCI+XG4gIDxoZWFkPlxuICAgIDxtZXRhIGNoYXJzZXQ9XCJVVEYtOFwiPlxuICAgIDxtZXRhIGh0dHAtZXF1aXY9XCJYLVVBLUNvbXBhdGlibGVcIiBjb250ZW50PVwiSUU9ZWRnZVwiPlxuICAgIDxtZXRhIG5hbWU9XCJ2aWV3cG9ydFwiIGNvbnRlbnQ9XCJ3aWR0aD1kZXZpY2Utd2lkdGgsIGluaXRpYWwtc2NhbGU9MS4wXCI+XG4gICAgPHRpdGxlPkRvY3VtZW50PC90aXRsZT5cbiAgICA8c2NyaXB0PlxuICAgICAgd2luZG93Lm9ubG9hZCA9IChldmVudCkgPT4ge1xuICAgICAgICBpZiAod2luZG93Ll9fZmVuY2VJZnJhbWVMb2FkKSB7XG4gICAgICAgICAgd2luZG93Ll9fZmVuY2VJZnJhbWVMb2FkKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgPC9zY3JpcHQ+XG4gICAgJHt0b0hUTUwoaGVhZEVsZW1lbnRzKX1cbiAgPC9oZWFkPlxuICA8Ym9keT5cbiAgPC9ib2R5PlxuICA8L2h0bWw+XG4gIGApO1xuXG4gIGlmcmFtZS5jb250ZW50RG9jdW1lbnQ/LmNsb3NlKCk7XG59XG5cbmludGVyZmFjZSBQcm9wcyB7XG4gIGhlYWRFbGVtZW50czogQXJyYXk8SW5qZWN0RWxlbWVudD47XG4gIG9uTG9hZD86ICgpID0+IHZvaWQ7XG59XG5cbmZ1bmN0aW9uIEZlbmNlKHsgaGVhZEVsZW1lbnRzLCBvbkxvYWQgfTogUHJvcHMsIHJlZjogUmVhY3QuRm9yd2FyZGVkUmVmPEhUTUxJRnJhbWVFbGVtZW50Pik6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgW2lmcmFtZUVsZW1lbnQsIHNldElmcmFtZV0gPSB1c2VTdGF0ZTxIVE1MSUZyYW1lRWxlbWVudD4oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghaWZyYW1lRWxlbWVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGluamVjdEhUTUwoaWZyYW1lRWxlbWVudCwgaGVhZEVsZW1lbnRzLCBvbkxvYWQpO1xuICB9LCBbaWZyYW1lRWxlbWVudF0pO1xuXG4gIHJldHVybiAoXG4gICAgPGlmcmFtZVxuICAgICAgY2xhc3NOYW1lPVwic2ltdWxhdG9yLWZlbmNlXCJcbiAgICAgIHJlZj17KF9yZWYpID0+IHtcbiAgICAgICAgLy8gdG9kbyBmaXggdGhpc1xuICAgICAgICBpZiAoIV9yZWYpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHR5cGVvZiByZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZWYoX3JlZik7XG4gICAgICAgIH0gZWxzZSBpZiAocmVmICYmICdjdXJyZW50JyBpbiByZWYpIHtcbiAgICAgICAgICByZWYuY3VycmVudCA9IF9yZWY7XG4gICAgICAgIH1cblxuICAgICAgICBzZXRJZnJhbWUoX3JlZik7XG4gICAgICB9fVxuICAgIC8+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmZvcndhcmRSZWY8SFRNTElGcmFtZUVsZW1lbnQsIFByb3BzPihGZW5jZSk7XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBNZXNzZW5nZXIgZnJvbSAnLi9saWIvbWVzc2VuZ2VyJztcbmltcG9ydCB7XG4gIE1FU1NBR0VfVFlQRV9BUlRFUlksXG4gIE1FU1NBR0VfVFlQRV9BQ1RJVkVfTk9ERSxcbiAgTUVTU0FHRV9UWVBFX0FDVElWRV9PVkVSX0xBWUVSX05PREVfSUQsXG4gIE1FU1NBR0VfVFlQRV9DSEVDS19OT0RFX1NVUFBPUlRfQ0hJTERSRU4sXG59IGZyb20gJy4vc2ltdWxhdG9yL2NvbnN0YW50cyc7XG5pbXBvcnQgeyBBcnRlcnksIE5vZGUgfSBmcm9tICdAb25lLWZvci1hbGwvYXJ0ZXJ5JztcbmltcG9ydCB7IE5vZGVQcmltYXJ5IH0gZnJvbSAnLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTeW5jUmVzcG9uZGVycyhcbiAgbWVzc2VuZ2VyOiBNZXNzZW5nZXIgfCB1bmRlZmluZWQsXG4gIGlzTm9kZVN1cHBvcnRDaGlsZHJlbjogKG5vZGU6IE5vZGVQcmltYXJ5KSA9PiBib29sZWFuLFxuKSB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFtZXNzZW5nZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBtZXNzZW5nZXIuYWRkUmVzcG9uZGVycyh7XG4gICAgICBbTUVTU0FHRV9UWVBFX0NIRUNLX05PREVfU1VQUE9SVF9DSElMRFJFTl06IGlzTm9kZVN1cHBvcnRDaGlsZHJlbixcbiAgICB9KTtcbiAgfSwgW2lzTm9kZVN1cHBvcnRDaGlsZHJlbiwgbWVzc2VuZ2VyXSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1c2VTeW5jQWN0aXZlTW9kYWxMYXllcihcbiAgbWVzc2VuZ2VyOiBNZXNzZW5nZXIgfCB1bmRlZmluZWQsXG4gIHNldEFjdGl2ZU92ZXJMYXllck5vZGVJRDogKGFjdGl2ZU92ZXJMYXllck5vZGVJRD86IHN0cmluZyB8IHVuZGVmaW5lZCkgPT4gdm9pZCxcbiAgYWN0aXZlT3ZlckxheWVyTm9kZUlEOiBzdHJpbmcgfCB1bmRlZmluZWQsXG4pIHtcbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG1lc3NlbmdlclxuICAgICAgLmxpc3RlbihNRVNTQUdFX1RZUEVfQUNUSVZFX09WRVJfTEFZRVJfTk9ERV9JRClcbiAgICAgIC5zdWJzY3JpYmUoKGFjdGl2ZU1vZGFsUm9vdElEKSA9PiB7XG4gICAgICAgIHNldEFjdGl2ZU92ZXJMYXllck5vZGVJRChhY3RpdmVNb2RhbFJvb3RJRCBhcyBzdHJpbmcpO1xuICAgICAgfSk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfTtcbiAgfSwgW3NldEFjdGl2ZU92ZXJMYXllck5vZGVJRCwgbWVzc2VuZ2VyXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1lc3Nlbmdlci5zZW5kKE1FU1NBR0VfVFlQRV9BQ1RJVkVfT1ZFUl9MQVlFUl9OT0RFX0lELCBhY3RpdmVPdmVyTGF5ZXJOb2RlSUQpO1xuICB9LCBbYWN0aXZlT3ZlckxheWVyTm9kZUlELCBtZXNzZW5nZXJdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVzZVN5bmNBY3RpdmVOb2RlKFxuICBtZXNzZW5nZXI6IE1lc3NlbmdlciB8IHVuZGVmaW5lZCxcbiAgc2V0QWN0aXZlTm9kZTogKG5vZGU/OiBOb2RlIHwgdW5kZWZpbmVkKSA9PiB2b2lkLFxuICBhY3RpdmVOb2RlOiBOb2RlIHwgdW5kZWZpbmVkLFxuKSB7XG4gIGNvbnN0IGFjdGl2ZU5vZGVJRCA9IHVzZVJlZjxzdHJpbmc+KCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG1lc3Nlbmdlci5saXN0ZW4oTUVTU0FHRV9UWVBFX0FDVElWRV9OT0RFKS5zdWJzY3JpYmUoKF9hY3RpdmVOb2RlKSA9PiB7XG4gICAgICBzZXRBY3RpdmVOb2RlKF9hY3RpdmVOb2RlIGFzIE5vZGUpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH07XG4gIH0sIFtzZXRBY3RpdmVOb2RlLCBtZXNzZW5nZXJdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghbWVzc2VuZ2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChhY3RpdmVOb2RlSUQuY3VycmVudCAhPT0gYWN0aXZlTm9kZT8uaWQpIHtcbiAgICAgIG1lc3Nlbmdlci5zZW5kKE1FU1NBR0VfVFlQRV9BQ1RJVkVfTk9ERSwgYWN0aXZlTm9kZSk7XG4gICAgICBhY3RpdmVOb2RlSUQuY3VycmVudCA9IGFjdGl2ZU5vZGU/LmlkO1xuICAgIH1cbiAgfSwgW2FjdGl2ZU5vZGUsIG1lc3Nlbmdlcl0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdXNlU3luY0FydGVyeShcbiAgbWVzc2VuZ2VyOiBNZXNzZW5nZXIgfCB1bmRlZmluZWQsXG4gIG9uQ2hhbmdlOiAoYXJ0ZXJ5OiBBcnRlcnkpID0+IHZvaWQsXG4gIGFydGVyeTogQXJ0ZXJ5LFxuKSB7XG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFtZXNzZW5nZXIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBtZXNzZW5nZXIubGlzdGVuKE1FU1NBR0VfVFlQRV9BUlRFUlkpLnN1YnNjcmliZSgoX2FydGVyeSkgPT4ge1xuICAgICAgb25DaGFuZ2UoX2FydGVyeSBhcyBBcnRlcnkpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH07XG4gIH0sIFtvbkNoYW5nZSwgbWVzc2VuZ2VyXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIW1lc3Nlbmdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1lc3Nlbmdlci5zZW5kKE1FU1NBR0VfVFlQRV9BUlRFUlksIGFydGVyeSk7XG4gIH0sIFthcnRlcnksIG1lc3Nlbmdlcl0pO1xufVxuIiwiaW1wb3J0IHNpbXVsYXRvclJlZiBmcm9tICdSRUY6Li9zaW11bGF0b3IvaW5kZXgnO1xuaW1wb3J0IHsgSW5qZWN0RWxlbWVudCB9IGZyb20gJy4vbGliL2ZlbmNlJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYnVpbGRIZWFkRWxlbWVudHMocGx1Z2luc1NyYzogc3RyaW5nLCBjc3NVUkxzPzogQXJyYXk8c3RyaW5nPik6IEluamVjdEVsZW1lbnRbXSB7XG4gIGNvbnN0IGltcG9ydE1hcHM6IEluamVjdEVsZW1lbnRbXSA9IEFycmF5LmZyb20oZG9jdW1lbnQuc2NyaXB0cylcbiAgICAuZmlsdGVyKChzKSA9PiBzLnR5cGUgPT09ICdzeXN0ZW1qcy1pbXBvcnRtYXAnKVxuICAgIC5tYXAoKHMpID0+IEpTT04ucGFyc2Uocy5pbm5lclRleHQpKVxuICAgIC5tYXAoKHMpID0+IEpTT04uc3RyaW5naWZ5KHMpKVxuICAgIC5tYXAoKHMpID0+ICh7XG4gICAgICBuYW1lOiAnc2NyaXB0JyxcbiAgICAgIGF0dHJzOiB7IHR5cGU6ICdzeXN0ZW1qcy1pbXBvcnRtYXAnIH0sXG4gICAgICBpbm5lclRleHQ6IHMsXG4gICAgfSkpO1xuXG4gIGNvbnN0IHBhdGNoU3JjID0gcGx1Z2luc1NyYy5zdGFydHNXaXRoKCdodHRwJykgPyBwbHVnaW5zU3JjIDogYCR7d2luZG93Lm9yaWdpbn0ke3BsdWdpbnNTcmN9YDtcblxuICBjb25zdCBoZWFkRWxlbWVudHMgPSBpbXBvcnRNYXBzLmNvbmNhdChbXG4gICAgLy8gYnVuZGxlIFRFTVBPUkFSWV9QQVRDSF9GT1JfQVJURVJZX1BMVUdJTlMgYXMgcmVhbCBkbGxcbiAgICAvLyB0b2RvIGZpeCBtZVxuICAgIHtcbiAgICAgIG5hbWU6ICdzY3JpcHQnLFxuICAgICAgYXR0cnM6IHsgdHlwZTogJ3N5c3RlbWpzLWltcG9ydG1hcCcgfSxcbiAgICAgIGlubmVyVGV4dDogYHtcbiAgICAgICAgXCJpbXBvcnRzXCI6IHtcbiAgICAgICAgICBcIlRFTVBPUkFSWV9QQVRDSF9GT1JfQVJURVJZX1BMVUdJTlNcIjogXCIke3BhdGNoU3JjfVwiXG4gICAgICAgIH1cbiAgICAgIH1gLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3NjcmlwdCcsXG4gICAgICBhdHRyczogeyBzcmM6ICdodHRwczovL29mYXBrZy5wZWszYi5xaW5nc3Rvci5jb20vc3lzdGVtQDYuMTAuMy9zeXN0ZW0uNi4xMC4zLm1pbi5qcycgfSxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdzY3JpcHQnLFxuICAgICAgYXR0cnM6IHsgc3JjOiBzaW11bGF0b3JSZWYgfSxcbiAgICB9LFxuICBdKTtcblxuICBjb25zdCBsaW5rczogSW5qZWN0RWxlbWVudFtdID0gKGNzc1VSTHMgfHwgW10pLm1hcCgodXJsKSA9PiB7XG4gICAgcmV0dXJuIHsgbmFtZTogJ2xpbmsnLCBhdHRyczogeyByZWw6ICdzdHlsZXNoZWV0JywgaHJlZjogdXJsIH0gfTtcbiAgfSk7XG5cbiAgcmV0dXJuIGhlYWRFbGVtZW50cy5jb25jYXQobGlua3MpO1xufVxuIiwiaW1wb3J0IFJlYWN0LCB7IHVzZVN0YXRlLCB1c2VFZmZlY3QsIHVzZVJlZiwgdXNlSW1wZXJhdGl2ZUhhbmRsZSB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCB0eXBlIHsgQXJ0ZXJ5LCBOb2RlIH0gZnJvbSAnQG9uZS1mb3ItYWxsL2FydGVyeSc7XG5pbXBvcnQgY3MgZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCBNZXNzZW5nZXIgZnJvbSAnLi9saWIvbWVzc2VuZ2VyJztcbmltcG9ydCBGZW5jZSBmcm9tICcuL2xpYi9mZW5jZSc7XG5pbXBvcnQgeyBOb2RlUHJpbWFyeSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgdXNlU3luY1Jlc3BvbmRlcnMsIHVzZVN5bmNBcnRlcnksIHVzZVN5bmNBY3RpdmVOb2RlLCB1c2VTeW5jQWN0aXZlTW9kYWxMYXllciB9IGZyb20gJy4vc3luYy1ob29rcyc7XG5pbXBvcnQgeyBNRVNTQUdFX1RZUEVfQVJURVJZIH0gZnJvbSAnLi9zaW11bGF0b3IvY29uc3RhbnRzJztcbmltcG9ydCBidWlsZEhlYWRFbGVtZW50cyBmcm9tICcuL2J1aWxkLWhlYWQtZWxlbWVudHMnO1xuXG5pbXBvcnQgJy4vaW5kZXguc2Nzcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJvcHMge1xuICBhcnRlcnk6IEFydGVyeTtcbiAgc2V0QWN0aXZlTm9kZTogKG5vZGU/OiBOb2RlKSA9PiB2b2lkO1xuICBvbkNoYW5nZTogKGFydGVyeTogQXJ0ZXJ5KSA9PiB2b2lkO1xuICBhY3RpdmVOb2RlPzogTm9kZTtcbiAgLy8gbW9kYWwgbGF5ZXIgcm9vdCBub2RlIGlkXG4gIGFjdGl2ZU92ZXJMYXllck5vZGVJRD86IHN0cmluZztcbiAgc2V0QWN0aXZlT3ZlckxheWVyTm9kZUlEOiAoYWN0aXZlT3ZlckxheWVyTm9kZUlEPzogc3RyaW5nKSA9PiB2b2lkO1xuXG4gIC8vIHRvZG8gcGx1Z2luIHVybFxuICBwbHVnaW5zU3JjOiBzdHJpbmc7XG4gIC8vIHRvZG8gYSBiZXR0ZXIgZGVzaWduXG4gIGNzc1VSTHM/OiBBcnJheTxzdHJpbmc+O1xuICBjbGFzc05hbWU/OiBzdHJpbmc7XG4gIGlzQ29udGFpbmVyOiAobm9kZTogTm9kZVByaW1hcnkpID0+IGJvb2xlYW47XG4gIG92ZXJMYXllckNvbXBvbmVudHM6IEFycmF5PHsgcGFja2FnZU5hbWU6IHN0cmluZzsgZXhwb3J0TmFtZTogc3RyaW5nIH0+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNpbXVsYXRvclJlZiB7XG4gIGlmcmFtZTogSFRNTElGcmFtZUVsZW1lbnQgfCBudWxsO1xufVxuXG5mdW5jdGlvbiBTaW11bGF0b3IoXG4gIHtcbiAgICBhY3RpdmVPdmVyTGF5ZXJOb2RlSUQsXG4gICAgYWN0aXZlTm9kZSxcbiAgICBhcnRlcnksXG4gICAgY2xhc3NOYW1lLFxuICAgIGNzc1VSTHMsXG4gICAgaXNDb250YWluZXIsXG4gICAgb25DaGFuZ2UsXG4gICAgcGx1Z2luc1NyYyxcbiAgICBzZXRBY3RpdmVPdmVyTGF5ZXJOb2RlSUQsXG4gICAgc2V0QWN0aXZlTm9kZSxcbiAgICBvdmVyTGF5ZXJDb21wb25lbnRzLFxuICB9OiBQcm9wcyxcbiAgc2ltdWxhdG9yUmVmOiBSZWFjdC5Gb3J3YXJkZWRSZWY8U2ltdWxhdG9yUmVmPixcbik6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgaWZyYW1lUmVmID0gdXNlUmVmPEhUTUxJRnJhbWVFbGVtZW50PihudWxsKTtcbiAgY29uc3QgW21lc3Nlbmdlciwgc2V0TWVzc2VuZ2VyXSA9IHVzZVN0YXRlPE1lc3Nlbmdlcj4oKTtcbiAgY29uc3QgW2lmcmFtZUxvYWQsIHNldElmcmFtZUxvYWRdID0gdXNlU3RhdGUoZmFsc2UpO1xuXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUoc2ltdWxhdG9yUmVmLCAoKSA9PiB7XG4gICAgcmV0dXJuIHsgaWZyYW1lOiBpZnJhbWVSZWYuY3VycmVudCB8fCBudWxsIH07XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKCFpZnJhbWVSZWYuY3VycmVudD8uY29udGVudFdpbmRvdyB8fCAhaWZyYW1lTG9hZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG1zZ3IgPSBuZXcgTWVzc2VuZ2VyKGlmcmFtZVJlZi5jdXJyZW50Py5jb250ZW50V2luZG93LCAnaG9zdC1zaWRlJyk7XG4gICAgbXNnclxuICAgICAgLndhaXRGb3JSZWFkeSgpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIG1zZ3Iuc2VuZChNRVNTQUdFX1RZUEVfQVJURVJZLCBhcnRlcnkpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaChub29wKTtcblxuICAgIHNldE1lc3Nlbmdlcihtc2dyKTtcblxuICAgIC8vIFRPRE8gZml4bWVcbiAgICBpZnJhbWVSZWYuY3VycmVudC5jb250ZW50V2luZG93Ll9fT1ZFUl9MQVlFUl9DT01QT05FTlRTID0gb3ZlckxheWVyQ29tcG9uZW50cztcbiAgfSwgW2lmcmFtZUxvYWRdKTtcblxuICB1c2VTeW5jUmVzcG9uZGVycyhtZXNzZW5nZXIsIGlzQ29udGFpbmVyKTtcbiAgdXNlU3luY0FydGVyeShtZXNzZW5nZXIsIG9uQ2hhbmdlLCBhcnRlcnkpO1xuICB1c2VTeW5jQWN0aXZlTm9kZShtZXNzZW5nZXIsIHNldEFjdGl2ZU5vZGUsIGFjdGl2ZU5vZGUpO1xuICB1c2VTeW5jQWN0aXZlTW9kYWxMYXllcihtZXNzZW5nZXIsIHNldEFjdGl2ZU92ZXJMYXllck5vZGVJRCwgYWN0aXZlT3ZlckxheWVyTm9kZUlEKTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjcygnYXJ0ZXJ5LXNpbXVsYXRvcicsIGNsYXNzTmFtZSl9PlxuICAgICAgPEZlbmNlXG4gICAgICAgIHJlZj17aWZyYW1lUmVmfVxuICAgICAgICBoZWFkRWxlbWVudHM9e2J1aWxkSGVhZEVsZW1lbnRzKHBsdWdpbnNTcmMsIGNzc1VSTHMpfVxuICAgICAgICBvbkxvYWQ9eygpID0+IHNldElmcmFtZUxvYWQodHJ1ZSl9XG4gICAgICAvPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5mb3J3YXJkUmVmPFNpbXVsYXRvclJlZiwgUHJvcHM+KFNpbXVsYXRvcik7XG4iXSwibmFtZXMiOlsiRmVuY2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O01BUUEsZ0JBQWdCLFVBQW1DO01BQ2pELFFBQU0sV0FBVyxTQUFTLGNBQWMsS0FBSztNQUU3QyxXQUFTLFFBQVEsQ0FBQyxZQUFZO01BQzVCLFVBQU0sSUFBSSxTQUFTLGNBQWMsUUFBUSxJQUFJO01BQzdDLFdBQU8sUUFBUSxRQUFRLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxLQUFLLFdBQVc7TUFDdEQsUUFBRSxhQUFhLEtBQUssS0FB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
