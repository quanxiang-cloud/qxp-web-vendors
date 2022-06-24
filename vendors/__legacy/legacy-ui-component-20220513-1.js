System.register(['@one-for-all/ui', 'react'], (function (exports) {
  'use strict';
  var Page, Text, Paragraph, Image, Button, Icon, Link, Modal, Input, Radio, Textarea, Grid, Container, forwardRef, useRef, useImperativeHandle, useEffect, React, Children;
  return {
    setters: [function (module) {
      Page = module.Page;
      Text = module.Text;
      Paragraph = module.Paragraph;
      Image = module.Image;
      Button = module.Button;
      Icon = module.Icon;
      Link = module.Link;
      Modal = module.Modal;
      Input = module.Input;
      Radio = module.Radio;
      Textarea = module.Textarea;
      Grid = module.Grid;
      Container = module.Container;
      exports({ Button: module.Button, Container: module.Container, Grid: module.Grid, Icon: module.Icon, Image: module.Image, Input: module.Input, Link: module.Link, Modal: module.Modal, Page: module.Page, Paragraph: module.Paragraph, Radio: module.Radio, Text: module.Text, Textarea: module.Textarea });
    }, function (module) {
      forwardRef = module.forwardRef;
      useRef = module.useRef;
      useImperativeHandle = module.useImperativeHandle;
      useEffect = module.useEffect;
      React = module["default"];
      Children = module.Children;
    }],
    execute: (function () {

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
      var __objRest$1 = (source, exclude) => {
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
      function serializeForm(formElement) {
        const formData = new FormData(formElement);
        const ret = {};
        formData.forEach((value, name) => {
          if (ret[name]) {
            ret[name] = formData.getAll(name);
          } else {
            ret[name] = value;
          }
        });
        return ret;
      }
      function Form(_a, ref) {
        var _b = _a, { children, placeholder, onSubmit, __exposeState } = _b, rest = __objRest$1(_b, ["children", "placeholder", "onSubmit", "__exposeState"]);
        const formRef = useRef(null);
        useImperativeHandle(ref, () => formRef.current);
        useEffect(() => {
          __exposeState == null ? void 0 : __exposeState({
            submit: formSubmit
          });
        }, []);
        function formSubmit() {
          const data = serializeForm(formRef.current);
          onSubmit == null ? void 0 : onSubmit(data);
        }
        return /* @__PURE__ */ React.createElement("form", __spreadProps$2(__spreadValues$2({}, rest), {
          ref: formRef
        }), children, !Children.count(children) && placeholder);
      }
      var form_default = exports('Form', forwardRef(Form));

      var classnames = {exports: {}};

      /*!
        Copyright (c) 2018 Jed Watson.
        Licensed under the MIT License (MIT), see
        http://jedwatson.github.io/classnames
      */

      (function (module) {
      /* global define */

      (function () {

      	var hasOwn = {}.hasOwnProperty;

      	function classNames() {
      		var classes = [];

      		for (var i = 0; i < arguments.length; i++) {
      			var arg = arguments[i];
      			if (!arg) continue;

      			var argType = typeof arg;

      			if (argType === 'string' || argType === 'number') {
      				classes.push(arg);
      			} else if (Array.isArray(arg)) {
      				if (arg.length) {
      					var inner = classNames.apply(null, arg);
      					if (inner) {
      						classes.push(inner);
      					}
      				}
      			} else if (argType === 'object') {
      				if (arg.toString === Object.prototype.toString) {
      					for (var key in arg) {
      						if (hasOwn.call(arg, key) && arg[key]) {
      							classes.push(key);
      						}
      					}
      				} else {
      					classes.push(arg.toString());
      				}
      			}
      		}

      		return classes.join(' ');
      	}

      	if (module.exports) {
      		classNames.default = classNames;
      		module.exports = classNames;
      	} else {
      		window.classNames = classNames;
      	}
      }());
      }(classnames));

      var cs = classnames.exports;

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
      const cellStylesSticky = {
        position: "sticky",
        zIndex: 3
      };
      function getMargin(columnId, columns) {
        const currentIndex = columns.findIndex(({ id }) => id === columnId);
        let leftMargin = 0;
        let rightMargin = 0;
        for (let i = 0; i < currentIndex; i += 1) {
          if (columns[i].fixed) {
            leftMargin += columns[i].width || 100;
          }
        }
        for (let i = currentIndex + 1; i < columns.length; i += 1) {
          if (columns[i].fixed) {
            rightMargin += columns[i].width || 100;
          }
        }
        return {
          leftMargin,
          rightMargin
        };
      }
      function getStickyStyles(col, columns) {
        let style = {};
        if (!col.fixed) {
          return {};
        }
        style = __spreadValues$1({}, cellStylesSticky);
        const {
          leftMargin,
          rightMargin
        } = getMargin(col.id, columns);
        const index = columns.findIndex(({ id }) => id === col.id);
        const zIndex = columns.length - index + 1;
        style = __spreadProps$1(__spreadValues$1({}, style), {
          zIndex,
          left: `${leftMargin}px`,
          right: `${rightMargin}px`
        });
        return style;
      }

      var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

      var css = ".ofa-table-wrapper {\n  display: flex;\n  flex-direction: column;\n  box-sizing: border-box;\n  width: 100%;\n  background-color: white;\n  opacity: 0.999;\n}\n\n.ofa-table-wrapper .table-selector {\n  min-width: 16px;\n}\n\n.ofa-table-wrapper .ofa-table-middle td {\n  padding: 12px;\n}\n\n.ofa-table-wrapper .ofa-table-middle th {\n  padding-left: 12px;\n  padding-right: 12px;\n}\n\n.ofa-table-wrapper .ofa-table {\n  max-height: 100%;\n  overflow: auto;\n}\n\n.ofa-table-wrapper .ofa-table table {\n  width: 100%;\n  table-layout: fixed;\n  text-align: left;\n  color: var(--gray-900);\n  font-size: 12px;\n}\n\n.ofa-table-wrapper .ofa-table td {\n  background-color: white;\n}\n\n.ofa-table-wrapper .ofa-table th,\n.ofa-table-wrapper .ofa-table td {\n  word-break: break-all;\n  vertical-align: middle;\n  border-bottom: 1px solid var(--gray-200);\n  transition: padding 0.3s;\n}\n\n.ofa-table-wrapper .ofa-table th {\n  position: -webkit-sticky;\n  position: sticky;\n  background: #fff;\n  padding-top: 8px;\n  padding-bottom: 8px;\n  top: 0;\n  line-height: 20px;\n  font-weight: 400;\n  -webkit-user-select: none;\n     -moz-user-select: none;\n      -ms-user-select: none;\n          user-select: none;\n  color: var(--gray-600);\n  z-index: 2;\n}\n\n.ofa-table-wrapper .ofa-table [data-sticky-td] {\n  position: -webkit-sticky;\n  position: sticky;\n}\n\n.ofa-table-wrapper .ofa-table [data-sticky-last-left-td] {\n  box-shadow: 2px 0 3px var(--gray-200);\n}\n\n.ofa-table-wrapper .ofa-table [data-sticky-first-right-td] {\n  box-shadow: -2px 0 3px var(--gray-200);\n}\n\n.ofa-table-wrapper .ofa-table tbody tr:hover td {\n  background-color: var(--blue-100);\n}\n\n.ofa-table-wrapper .ofa-table tbody tr td.table__cell-fixed {\n  position: -webkit-sticky;\n  position: sticky;\n}\n\n.ofa-table-wrapper .ofa-table tbody > tr > .ofa-table-td {\n  padding: 17px 16px;\n  border-bottom: 1px solid;\n  border-color: var(--gray-200);\n  background-color: #fff;\n}\n\n.ofa-table-wrapper .ofa-table-empty {\n  padding: 30px;\n  text-align: center;\n}\n\n.ofa-table-wrapper .ofa-table-empty img {\n  display: inline-block;\n  margin-bottom: 8px;\n}\n\n.ofa-table-wrapper .ofa-table-total-tips {\n  font-size: 12px;\n  line-height: 20px;\n  color: var(--gray-600);\n}\n\n.ofa-table-wrapper .ofa-table-tr:hover .ofa-table-td {\n  background-color: var(--gray-100);\n}";
      n(css,{});

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
      var __objRest = (source, exclude) => {
        var target = {};
        for (var prop in source)
          if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
            target[prop] = source[prop];
        if (source != null && __getOwnPropSymbols)
          for (var prop of __getOwnPropSymbols(source)) {
            if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
              target[prop] = source[prop];
          }
        return target;
      };
      function Table(_a, ref) {
        var _b = _a, { className, cols = [], rows, hasBorder } = _b, rest = __objRest(_b, ["className", "cols", "rows", "hasBorder"]);
        const renderHead = () => {
          try {
            return cols == null ? void 0 : cols.map((col) => {
              const style = getStickyStyles(col, cols);
              return /* @__PURE__ */ React.createElement("th", {
                className: cs("p-4", hasBorder && "border"),
                key: col.id,
                style
              }, col.label);
            });
          } catch (e) {
            return [];
          }
        };
        const renderRows = () => {
          try {
            return rows == null ? void 0 : rows.map((row, index) => {
              const renderContent = cols.map((col) => {
                const content = row[col.key] || "--";
                const style = getStickyStyles(col, cols);
                return /* @__PURE__ */ React.createElement("td", {
                  className: cs("p-4", hasBorder && "border"),
                  key: `row${index}-col${col.id}`,
                  style
                }, content);
              });
              return /* @__PURE__ */ React.createElement("tr", {
                className: "ofa-table-tr",
                key: `row${index}`
              }, renderContent);
            });
          } catch (e) {
            return [];
          }
        };
        return /* @__PURE__ */ React.createElement("div", __spreadProps(__spreadValues({
          className: cs("ofa-table-wrapper", "relative", className)
        }, rest), {
          ref
        }), /* @__PURE__ */ React.createElement("div", {
          className: cs("ofa-table", className, "ofa-table-middle")
        }, /* @__PURE__ */ React.createElement("table", {
          className: cs("table-fixed", "border-collapse", className)
        }, /* @__PURE__ */ React.createElement("colgroup", null, cols.map((col) => {
          const style = getStickyStyles(col, cols);
          return /* @__PURE__ */ React.createElement("col", {
            width: col.width || 100,
            key: `col-${col.id}`,
            span: 1,
            style
          });
        })), /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", {
          className: "ofa-table-tr"
        }, renderHead())), /* @__PURE__ */ React.createElement("tbody", null, renderRows()))));
      }
      var table_default = exports('Table', forwardRef(Table));

      const legacyUIComponents = {
        page: Page,
        text: Text,
        para: Paragraph,
        image: Image,
        button: Button,
        icon: Icon,
        link: Link,
        modal: Modal,
        input: Input,
        radio: Radio,
        textarea: Textarea,
        form: form_default,
        table: table_default,
        grid: Grid,
        container: Container
      };
      var legacy_ui_components_default = exports('default', legacyUIComponents);
      const page = exports('page', Page);
      const text = exports('text', Text);
      const para = exports('para', Paragraph);
      const image = exports('image', Image);
      const button = exports('button', Button);
      const icon = exports('icon', Icon);
      const link = exports('link', Link);
      const modal = exports('modal', Modal);
      const input = exports('input', Input);
      const radio = exports('radio', Radio);
      const textarea = exports('textarea', Textarea);
      const form = exports('form', form_default);
      const table = exports('table', table_default);
      const grid = exports('grid', Grid);
      const container = exports('container', Container);

    })
  };
}));
