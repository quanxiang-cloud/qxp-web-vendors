System.register(['react', '@one-for-all/icon', 'lodash', 'react-dom'], (function (exports) {
	'use strict';
	var forwardRef, React__default, useState, useContext, useRef, useImperativeHandle, useEffect, memo, useLayoutEffect, useMemo, React, Icon, omit, ReactDOM;
	return {
		setters: [function (module) {
			forwardRef = module.forwardRef;
			React__default = module["default"];
			useState = module.useState;
			useContext = module.useContext;
			useRef = module.useRef;
			useImperativeHandle = module.useImperativeHandle;
			useEffect = module.useEffect;
			memo = module.memo;
			useLayoutEffect = module.useLayoutEffect;
			useMemo = module.useMemo;
			React = module;
		}, function (module) {
			Icon = module["default"];
		}, function (module) {
			omit = module.omit;
		}, function (module) {
			ReactDOM = module["default"];
		}],
		execute: (function () {

			exports({
				DatePicker: DatePicker,
				DateTimePicker: DateTimePicker,
				MediocreDialog: MediocreDialog,
				Select: Select,
				Tab: Tab,
				Table: Table,
				TimePicker: TimePicker,
				usePopper: usePopper
			});

			var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

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

			function Breadcrumb(props, ref) {
			  const {
			    segments,
			    separator = "/",
			    activeClass,
			    segmentRender,
			    style,
			    className,
			    segmentClass,
			    segmentStyle
			  } = props;
			  function BreadcrumbChild({ segment, isLast }) {
			    if (segmentRender) {
			      return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, segmentRender(segment, isLast), !isLast && /* @__PURE__ */ React__default.createElement("span", {
			        className: "ofa-breadcrumb-separator"
			      }, separator));
			    }
			    if (!isLast) {
			      return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, segment.render ? segment.render(segment) : breadItem(segment), /* @__PURE__ */ React__default.createElement("span", {
			        className: "ofa-breadcrumb-separator"
			      }, separator));
			    }
			    return /* @__PURE__ */ React__default.createElement("span", {
			      className: "ofa-breadcrumb-link"
			    }, segment.text);
			  }
			  const breadItem = (link) => {
			    return !link.path ? link.text : /* @__PURE__ */ React__default.createElement("a", {
			      href: link.path,
			      className: "ofa-breadcrumb-link"
			    }, link.text);
			  };
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: cs("ofa-breadcrumb", className),
			    style,
			    ref
			  }, segments.map((segment, index) => {
			    const isLast = index === segments.length - 1;
			    return /* @__PURE__ */ React__default.createElement("div", {
			      key: segment.key,
			      style: segmentStyle,
			      className: cs("ofa-breadcrumb-item", segmentClass, {
			        "ofa-breadcrumb-active": isLast
			      })
			    }, /* @__PURE__ */ React__default.createElement(BreadcrumbChild, {
			      segment,
			      isLast
			    }));
			  }));
			}
			var index$6 = exports('Breadcrumb', forwardRef(Breadcrumb));

			var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

			var css$f = ".ofa-btn {\n  display: inline-flex;\n  justify-content: center;\n  align-items: center;\n  cursor: pointer;\n  user-select: none;\n  flex-shrink: 0;\n  transition: all 0.3s linear;\n}\n\n.ofa-btn--disable, .ofa-btn--loading, .ofa-btn--forbidden,\n.ofa-btn--disable > svg,\n.ofa-btn--loading > svg,\n.ofa-btn--forbidden > svg {\n  pointer-events: none;\n}\n\n.ofa-btn--forbidden {\n  cursor: not-allowed;\n}\n\n.ofa-btn--loading > svg {\n  animation: ofa-spin 1s linear infinite;\n}\n\n.ofa-btn-icon {\n  color: inherit;\n  margin-right: 4px;\n  fill: currentColor;\n}";
			n(css$f,{});

			var __defProp$j = Object.defineProperty;
			var __defProps$7 = Object.defineProperties;
			var __getOwnPropDescs$7 = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$n = Object.getOwnPropertySymbols;
			var __hasOwnProp$n = Object.prototype.hasOwnProperty;
			var __propIsEnum$n = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$j = (obj, key, value) => key in obj ? __defProp$j(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$j = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$n.call(b, prop))
			      __defNormalProp$j(a, prop, b[prop]);
			  if (__getOwnPropSymbols$n)
			    for (var prop of __getOwnPropSymbols$n(b)) {
			      if (__propIsEnum$n.call(b, prop))
			        __defNormalProp$j(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps$7 = (a, b) => __defProps$7(a, __getOwnPropDescs$7(b));
			var __objRest$b = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$n.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$n)
			    for (var prop of __getOwnPropSymbols$n(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$n.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function Button(_a, ref) {
			  var _b = _a, {
			    children,
			    iconName,
			    className,
			    modifier,
			    forbidden,
			    loading,
			    iconSize = 20,
			    textClassName,
			    iconClassName,
			    type = "button",
			    onClick,
			    size
			  } = _b, rest = __objRest$b(_b, [
			    "children",
			    "iconName",
			    "className",
			    "modifier",
			    "forbidden",
			    "loading",
			    "iconSize",
			    "textClassName",
			    "iconClassName",
			    "type",
			    "onClick",
			    "size"
			  ]);
			  return /* @__PURE__ */ React__default.createElement("button", __spreadProps$7(__spreadValues$j({}, rest), {
			    onClick,
			    type,
			    ref,
			    className: cs("ofa-btn", className, {
			      [`ofa-btn--${modifier}`]: modifier,
			      [`ofa-btn--${size}`]: size,
			      "ofa-btn--forbidden": forbidden,
			      "ofa-btn--loading": loading
			    }),
			    disabled: forbidden
			  }), (iconName || loading) && /* @__PURE__ */ React__default.createElement(Icon, {
			    name: loading ? "refresh" : iconName || "refresh",
			    size: Number(iconSize),
			    className: cs("ofa-btn-icon", iconClassName)
			  }), /* @__PURE__ */ React__default.createElement("span", {
			    className: textClassName
			  }, !loading && children));
			}
			var Button$1 = exports('Button', forwardRef(Button));

			var GroupContext$1 = React__default.createContext(null);

			var __getOwnPropSymbols$m = Object.getOwnPropertySymbols;
			var __hasOwnProp$m = Object.prototype.hasOwnProperty;
			var __propIsEnum$m = Object.prototype.propertyIsEnumerable;
			var __objRest$a = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$m.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$m)
			    for (var prop of __getOwnPropSymbols$m(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$m.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function InternalCheckbox(_a, ref) {
			  var _b = _a, { className, style, label, indeterminate, error, onChange } = _b, restProps = __objRest$a(_b, ["className", "style", "label", "indeterminate", "error", "onChange"]);
			  const [name, setName] = useState();
			  const [checked, setChecked] = useState(!!restProps.checked);
			  const [disabled, setDisabled] = useState(!!restProps.disabled);
			  const groupContext = useContext(GroupContext$1);
			  const prevValue = useRef(restProps.value);
			  const rootRef = useRef(null);
			  const inputRef = useRef(null);
			  useImperativeHandle(ref, () => {
			    if (rootRef.current && inputRef.current) {
			      rootRef.current.inputInstance = inputRef.current;
			    }
			    return rootRef.current;
			  });
			  useEffect(() => {
			    groupContext == null ? void 0 : groupContext.registerValue(restProps.value);
			  }, []);
			  useEffect(() => {
			    if (restProps.value !== prevValue.current) {
			      groupContext == null ? void 0 : groupContext.cancelValue(prevValue.current);
			      groupContext == null ? void 0 : groupContext.registerValue(restProps.value);
			    }
			    return () => groupContext == null ? void 0 : groupContext.cancelValue(restProps.value);
			  }, [restProps.value]);
			  useEffect(() => {
			    setName(groupContext == null ? void 0 : groupContext.name);
			  }, [groupContext == null ? void 0 : groupContext.name]);
			  useEffect(() => {
			    let checked2 = !!restProps.checked;
			    if (groupContext == null ? void 0 : groupContext.value) {
			      checked2 = groupContext.value.indexOf(restProps.value) !== -1;
			    }
			    setChecked(checked2);
			  }, [restProps.value, groupContext == null ? void 0 : groupContext.value]);
			  useEffect(() => {
			    setDisabled(restProps.disabled || !!(groupContext == null ? void 0 : groupContext.disabled));
			  }, [restProps.disabled, groupContext == null ? void 0 : groupContext.disabled]);
			  function handleChange(checked2, e) {
			    if (disabled) {
			      return;
			    }
			    setChecked(checked2);
			    groupContext && groupContext.toggleOption({ label, value: restProps.value });
			    onChange && onChange(restProps.value, e);
			  }
			  return /* @__PURE__ */ React__default.createElement("label", {
			    ref: rootRef,
			    style,
			    className: cs("ofa-checkbox-wrapper", {
			      "ofa-checkbox-wrapper__indeterminate": indeterminate,
			      "ofa-checkbox-wrapper__checked": checked,
			      "ofa-checkbox-wrapper__disabled": disabled,
			      "ofa-checkbox-wrapper__error": error
			    }, className)
			  }, /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-checkbox-item"
			  }, /* @__PURE__ */ React__default.createElement("input", {
			    ref: inputRef,
			    type: "checkbox",
			    style: { display: "none" },
			    checked,
			    name,
			    disabled,
			    onChange: (e) => {
			      const { checked: checked2 } = e.target;
			      handleChange(checked2, e);
			    }
			  }), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-checkbox-icon"
			  })), label && /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-checkbox-label"
			  }, label));
			}
			var Checkbox = exports('Checkbox', forwardRef(InternalCheckbox));

			var __getOwnPropSymbols$l = Object.getOwnPropertySymbols;
			var __hasOwnProp$l = Object.prototype.hasOwnProperty;
			var __propIsEnum$l = Object.prototype.propertyIsEnumerable;
			var __objRest$9 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$l.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$l)
			    for (var prop of __getOwnPropSymbols$l(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$l.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function InternalCheckboxGroup(_a, ref) {
			  var _b = _a, {
			    className,
			    style,
			    options = [],
			    disabled,
			    children,
			    onChange
			  } = _b, restProps = __objRest$9(_b, [
			    "className",
			    "style",
			    "options",
			    "disabled",
			    "children",
			    "onChange"
			  ]);
			  const [value, setValue] = useState(restProps.value || []);
			  const [registeredValues, setRegisteredValues] = useState([]);
			  useEffect(() => {
			    setValue(restProps.value || []);
			  }, [restProps.value]);
			  const getOptions = () => options.map((option) => {
			    if (typeof option === "string") {
			      return {
			        label: option,
			        value: option
			      };
			    }
			    return option;
			  });
			  const cancelValue = (val) => {
			    setRegisteredValues((prevValues) => prevValues.filter((v) => v !== val));
			  };
			  const registerValue = (val) => {
			    setRegisteredValues((prevValues) => [...prevValues, val]);
			  };
			  const toggleOption = (option) => {
			    const optionIndex = value.indexOf(option.value);
			    const newValue = [...value];
			    if (optionIndex === -1) {
			      newValue.push(option.value);
			    } else {
			      newValue.splice(optionIndex, 1);
			    }
			    setValue(newValue);
			    const opts = getOptions();
			    onChange == null ? void 0 : onChange(newValue.filter((val) => registeredValues.indexOf(val) !== -1).sort((a, b) => {
			      const indexA = opts.findIndex((opt) => opt.value === a);
			      const indexB = opts.findIndex((opt) => opt.value === b);
			      return indexA - indexB;
			    }));
			  };
			  let child = children;
			  if (options && options.length > 0) {
			    child = getOptions().map((option) => /* @__PURE__ */ React__default.createElement(Checkbox, {
			      key: option.value.toString(),
			      disabled: "disabled" in option ? option.disabled : disabled,
			      label: option.label,
			      value: option.value,
			      checked: value.indexOf(option.value) !== -1,
			      onChange: option.onChange
			    }));
			  }
			  const context = {
			    value,
			    disabled: !!disabled,
			    name: restProps.name,
			    toggleOption,
			    registerValue,
			    cancelValue
			  };
			  return /* @__PURE__ */ React__default.createElement("div", {
			    ref,
			    style,
			    className: cs({ "checkbox-group-wrapper__disbaled": disabled }, className)
			  }, /* @__PURE__ */ React__default.createElement(GroupContext$1.Provider, {
			    value: context
			  }, child));
			}
			const CheckboxGroup = forwardRef(InternalCheckboxGroup);
			var group$1 = exports('CheckboxGroup', memo(CheckboxGroup));

			var css$e = ".ofa-checkbox-wrapper {\n  background-color: white;\n  cursor: pointer;\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n\n.ofa-checkbox-icon {\n  position: relative;\n  transition: all 0.24s;\n  border-radius: 4px;\n  border: 1px solid gray;\n  box-sizing: border-box;\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n}\n\n.ofa-checkbox-icon::after {\n  position: absolute;\n  display: table;\n  border: 2px solid #fff;\n  border-top: 0;\n  border-left: 0;\n  transform: rotate(45deg) scale(1) translate(-50%, -50%);\n  opacity: 0;\n  transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;\n  content: ' ';\n  width: 5px;\n  height: 9px;\n  left: 16.5%;\n  top: 50%;\n}\n\n.ofa-checkbox-item {\n  display: flex;\n}\n\n.ofa-checkbox-wrapper__checked .ofa-checkbox-icon {\n  background-color: blue;\n  border-color: blue;\n}\n\n.ofa-checkbox-item input:checked + span::after {\n  opacity: 1;\n}\n\n.ofa-checkbox-wrapper__disabled {\n  cursor: no-drop;\n}\n\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-label {\n  color: #00000040;\n}\n\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-icon,\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-item input:checked + span::after,\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-item input:checked + span {\n  background-color: #f5f5f5;\n  border-color: #d9d9d9 !important;\n}\n";
			n(css$e,{});

			var __defProp$i = Object.defineProperty;
			var __getOwnPropSymbols$k = Object.getOwnPropertySymbols;
			var __hasOwnProp$k = Object.prototype.hasOwnProperty;
			var __propIsEnum$k = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$i = (obj, key, value) => key in obj ? __defProp$i(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$i = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$k.call(b, prop))
			      __defNormalProp$i(a, prop, b[prop]);
			  if (__getOwnPropSymbols$k)
			    for (var prop of __getOwnPropSymbols$k(b)) {
			      if (__propIsEnum$k.call(b, prop))
			        __defNormalProp$i(a, prop, b[prop]);
			    }
			  return a;
			};
			function Divider(props, ref) {
			  const { className, size = "100%", direction = "horizontal", thickness = "1px", style = {} } = props;
			  const _style = {};
			  if (direction === "horizontal") {
			    _style.height = thickness;
			    _style.width = size;
			  } else {
			    _style.width = thickness;
			    _style.height = size;
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    ref,
			    style: __spreadValues$i(__spreadValues$i({}, _style), style),
			    className: cs("ofa-divider", className)
			  });
			}
			var index$5 = exports('Divider', forwardRef(Divider));

			var css$d = ".ofa-input {\n  outline: none;\n}\n";
			n(css$d,{});

			var __defProp$h = Object.defineProperty;
			var __defProps$6 = Object.defineProperties;
			var __getOwnPropDescs$6 = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$j = Object.getOwnPropertySymbols;
			var __hasOwnProp$j = Object.prototype.hasOwnProperty;
			var __propIsEnum$j = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$h = (obj, key, value) => key in obj ? __defProp$h(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$h = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$j.call(b, prop))
			      __defNormalProp$h(a, prop, b[prop]);
			  if (__getOwnPropSymbols$j)
			    for (var prop of __getOwnPropSymbols$j(b)) {
			      if (__propIsEnum$j.call(b, prop))
			        __defNormalProp$h(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps$6 = (a, b) => __defProps$6(a, __getOwnPropDescs$6(b));
			var __objRest$8 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$j.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$j)
			    for (var prop of __getOwnPropSymbols$j(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$j.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function Input(_a, ref) {
			  var _b = _a, {
			    className,
			    value,
			    style,
			    error,
			    disabled,
			    readOnly,
			    defaultValue,
			    onChange,
			    onEnterPress,
			    onFocus,
			    onBlur,
			    onKeyDown
			  } = _b, otherProps = __objRest$8(_b, [
			    "className",
			    "value",
			    "style",
			    "error",
			    "disabled",
			    "readOnly",
			    "defaultValue",
			    "onChange",
			    "onEnterPress",
			    "onFocus",
			    "onBlur",
			    "onKeyDown"
			  ]);
			  const [inputValue, setValue] = useState(defaultValue != null ? defaultValue : "");
			  const [focused, setFocused] = useState(false);
			  const inputRef = useRef(null);
			  useEffect(() => {
			    if (value === void 0) {
			      return;
			    }
			    setValue(value);
			  }, [value]);
			  useLayoutEffect(() => {
			    var _a2;
			    if (!otherProps.enterKeyHint)
			      return;
			    (_a2 = inputRef.current) == null ? void 0 : _a2.setAttribute("enterkeyhint", otherProps.enterKeyHint);
			    return () => {
			      var _a3;
			      (_a3 = inputRef.current) == null ? void 0 : _a3.removeAttribute("enterkeyhint");
			    };
			  }, [otherProps.enterKeyHint]);
			  useImperativeHandle(ref, () => inputRef.current);
			  function handleChange(e) {
			    setValue(e.target.value);
			    onChange == null ? void 0 : onChange(e.target.value, e);
			  }
			  function handleKeyDown(e) {
			    if (onEnterPress && (e.code === "Enter" || e.keyCode === 13)) {
			      onEnterPress(e);
			    }
			    onKeyDown == null ? void 0 : onKeyDown(e);
			  }
			  function handleFocus(e) {
			    setFocused(true);
			    onFocus == null ? void 0 : onFocus(e);
			  }
			  function handleBlur(e) {
			    setFocused(false);
			    onBlur == null ? void 0 : onBlur(e);
			  }
			  return /* @__PURE__ */ React__default.createElement("input", __spreadProps$6(__spreadValues$h({}, omit(otherProps, "enterKeyHint")), {
			    ref: inputRef,
			    value: inputValue,
			    disabled,
			    readOnly,
			    style,
			    className: cs("ofa-input", {
			      "ofa-input__disabled": disabled,
			      "ofa-input__readOnly": readOnly,
			      "ofa-input__focus": focused,
			      "ofa-input__error": error
			    }, className),
			    onChange: handleChange,
			    onKeyDown: handleKeyDown,
			    onFocus: handleFocus,
			    onBlur: handleBlur
			  }));
			}
			var Input$1 = exports('Input', forwardRef(Input));

			const inBrowser = typeof window !== "undefined";
			let rootFontSize;
			function getRootFontSize() {
			  if (!rootFontSize) {
			    const doc = document.documentElement;
			    const fontSize = doc.style.fontSize || window.getComputedStyle(doc).fontSize;
			    rootFontSize = parseFloat(fontSize);
			  }
			  return rootFontSize;
			}
			function convertRem(value) {
			  const _value = value.replace(/rem/g, "");
			  return +_value * getRootFontSize();
			}
			function convertVw(value) {
			  const _value = value.replace(/vw/g, "");
			  return +_value * window.innerWidth / 100;
			}
			function convertVh(value) {
			  const _value = value.replace(/vh/g, "");
			  return +_value * window.innerHeight / 100;
			}
			function unitToPx(value) {
			  if (typeof value === "number") {
			    return value;
			  }
			  if (inBrowser) {
			    if (value.indexOf("rem") !== -1) {
			      return convertRem(value);
			    }
			    if (value.indexOf("vw") !== -1) {
			      return convertVw(value);
			    }
			    if (value.indexOf("vh") !== -1) {
			      return convertVh(value);
			    }
			  }
			  return parseFloat(value);
			}

			var css$c = ".ofa-loading {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\n\n.ofa-loading__desc {\n  display: inline-block;\n  margin-left: 8px;\n  margin-right: 8px;\n  vertical-align: middle;\n}\n\n.ofa-loading--vertical {\n  flex-direction: column;\n}\n.ofa-loading--vertical .ofa-loading__desc {\n  margin-top: 8px;\n}\n\n.ofa-loading__icon {\n  animation: ofa-spin 1s linear infinite;\n}";
			n(css$c,{});

			function Loading({ desc, className, iconSize = 24, vertical }, ref) {
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: cs("ofa-loading", className, { "ofa-loading--vertical": vertical }),
			    ref
			  }, /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "refresh",
			    size: unitToPx(iconSize != null ? iconSize : 0),
			    className: "ofa-loading__icon"
			  }), !!desc && /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-loading__desc"
			  }, desc));
			}
			var index$4 = exports('Loading', React__default.forwardRef(Loading));

			function useMountPoint(defaultMountPoint) {
			  const mountPoint = defaultMountPoint || document.createElement("div");
			  if (!mountPoint.parentElement) {
			    document.body.appendChild(mountPoint);
			  }
			  useEffect(() => {
			    return () => {
			      var _a;
			      (_a = mountPoint.parentElement) == null ? void 0 : _a.removeChild(mountPoint);
			    };
			  }, []);
			  return mountPoint;
			}
			function Portal$1({ children, mountPoint }) {
			  const container = useMountPoint(mountPoint);
			  return ReactDOM.createPortal(children, container);
			}

			function uesHandleEsc({ isOpen, callOnCloseWhenEscDown, onClose }) {
			  useEffect(() => {
			    if (!isOpen || !callOnCloseWhenEscDown) {
			      return;
			    }
			    function onEscDown(e) {
			      if (e.key === "Escape" && !e.isComposing) {
			        onClose == null ? void 0 : onClose();
			      }
			    }
			    document.addEventListener("keydown", onEscDown);
			    return () => document.removeEventListener("keydown", onEscDown);
			  }, [isOpen, callOnCloseWhenEscDown]);
			}
			function useToggleCallback({ isOpen, onClose }) {
			  useEffect(() => {
			    if (!isOpen) {
			      onClose == null ? void 0 : onClose();
			    }
			  }, [isOpen]);
			}
			function usePreventBodyScroll(shouldPreventScroll) {
			  const originalOverflowRef = useRef(document.body.style.overflow);
			  useEffect(() => {
			    if (shouldPreventScroll) {
			      document.body.style.overflow = "hidden";
			    } else {
			      document.body.style.overflow = originalOverflowRef.current;
			    }
			    return () => {
			      document.body.style.overflow = originalOverflowRef.current;
			    };
			  }, [shouldPreventScroll]);
			}

			var css$b = ".ofa-modal-layer {\n  position: fixed;\n  height: 100vh;\n  width: 100vw;\n  inset: 0;\n  overflow: auto;\n}\n\n.ofa-modal-layer__backdrop {\n  position: absolute;\n  height: 100%;\n  width: 100%;\n  background-color: rgba(255, 255, 255, 0.3);\n  backdrop-filter: blur(10px);\n  z-index: -1;\n}";
			n(css$b,{});

			function ModalLayer({
			  className,
			  isOpen,
			  onClose,
			  container,
			  callOnCloseWhenEscDown,
			  children
			}) {
			  uesHandleEsc({ isOpen, onClose, callOnCloseWhenEscDown });
			  useToggleCallback({ isOpen, onClose });
			  usePreventBodyScroll(isOpen);
			  if (!isOpen) {
			    return null;
			  }
			  if (container === "inside") {
			    return /* @__PURE__ */ React__default.createElement("div", {
			      className: cs("ofa-modal-layer", "ofa-modal-layer--inside", className)
			    }, /* @__PURE__ */ React__default.createElement("div", {
			      className: "ofa-modal-layer__backdrop",
			      onClick: () => onClose == null ? void 0 : onClose()
			    }), children);
			  }
			  return /* @__PURE__ */ React__default.createElement(Portal$1, {
			    mountPoint: typeof container === "function" ? container() : container
			  }, /* @__PURE__ */ React__default.createElement("div", {
			    className: cs("ofa-modal-layer", className)
			  }, /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-modal-layer__backdrop",
			    onClick: () => onClose == null ? void 0 : onClose()
			  }), children));
			}

			var css$a = ".ofa-mediocre-dialog {\n  margin: auto;\n  margin-top: 20vh;\n  background-color: white;\n  border: 1px solid #cbd5e1;\n  border-radius: 4px;\n  min-width: 200px;\n  max-width: 90vw;\n}\n\n.ofa-mediocre-dialog__title {\n  padding: 8px;\n  line-height: 20px;\n}\n\n.ofa-mediocre-dialog__body {\n  min-height: 200px;\n  padding: 16px;\n}\n\n.ofa-mediocre-dialog__footer {\n  display: flex;\n  justify-content: flex-end;\n  align-items: center;\n  padding: 8px 16px;\n}\n.ofa-mediocre-dialog__footer .ofa-btn {\n  margin-left: 8px;\n}";
			n(css$a,{});

			function MediocreDialog({
			  children,
			  isOpen,
			  onClose,
			  onOk,
			  title,
			  okBtnText = "\u786E\u5B9A",
			  cancelBtnText = "\u53D6\u6D88",
			  container
			}) {
			  return /* @__PURE__ */ React__default.createElement(ModalLayer, {
			    isOpen,
			    container,
			    onClose
			  }, /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-mediocre-dialog"
			  }, title && /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-mediocre-dialog__title"
			  }, title), /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-mediocre-dialog__body"
			  }, children), /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-mediocre-dialog__footer"
			  }, /* @__PURE__ */ React__default.createElement(Button$1, {
			    onClick: onClose
			  }, cancelBtnText), /* @__PURE__ */ React__default.createElement(Button$1, {
			    onClick: onOk,
			    modifier: "primary"
			  }, okBtnText))));
			}

			var top = 'top';
			var bottom = 'bottom';
			var right = 'right';
			var left = 'left';
			var auto = 'auto';
			var basePlacements = [top, bottom, right, left];
			var start = 'start';
			var end = 'end';
			var clippingParents = 'clippingParents';
			var viewport = 'viewport';
			var popper = 'popper';
			var reference = 'reference';
			var variationPlacements = /*#__PURE__*/basePlacements.reduce(function (acc, placement) {
			  return acc.concat([placement + "-" + start, placement + "-" + end]);
			}, []);
			var placements = /*#__PURE__*/[].concat(basePlacements, [auto]).reduce(function (acc, placement) {
			  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
			}, []); // modifiers that need to read the DOM

			var beforeRead = 'beforeRead';
			var read = 'read';
			var afterRead = 'afterRead'; // pure-logic modifiers

			var beforeMain = 'beforeMain';
			var main = 'main';
			var afterMain = 'afterMain'; // modifier with the purpose to write to the DOM (or write into a framework state)

			var beforeWrite = 'beforeWrite';
			var write = 'write';
			var afterWrite = 'afterWrite';
			var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

			function getNodeName(element) {
			  return element ? (element.nodeName || '').toLowerCase() : null;
			}

			function getWindow(node) {
			  if (node == null) {
			    return window;
			  }

			  if (node.toString() !== '[object Window]') {
			    var ownerDocument = node.ownerDocument;
			    return ownerDocument ? ownerDocument.defaultView || window : window;
			  }

			  return node;
			}

			function isElement(node) {
			  var OwnElement = getWindow(node).Element;
			  return node instanceof OwnElement || node instanceof Element;
			}

			function isHTMLElement(node) {
			  var OwnElement = getWindow(node).HTMLElement;
			  return node instanceof OwnElement || node instanceof HTMLElement;
			}

			function isShadowRoot(node) {
			  // IE 11 has no ShadowRoot
			  if (typeof ShadowRoot === 'undefined') {
			    return false;
			  }

			  var OwnElement = getWindow(node).ShadowRoot;
			  return node instanceof OwnElement || node instanceof ShadowRoot;
			}

			// and applies them to the HTMLElements such as popper and arrow

			function applyStyles(_ref) {
			  var state = _ref.state;
			  Object.keys(state.elements).forEach(function (name) {
			    var style = state.styles[name] || {};
			    var attributes = state.attributes[name] || {};
			    var element = state.elements[name]; // arrow is optional + virtual elements

			    if (!isHTMLElement(element) || !getNodeName(element)) {
			      return;
			    } // Flow doesn't support to extend this property, but it's the most
			    // effective way to apply styles to an HTMLElement
			    // $FlowFixMe[cannot-write]


			    Object.assign(element.style, style);
			    Object.keys(attributes).forEach(function (name) {
			      var value = attributes[name];

			      if (value === false) {
			        element.removeAttribute(name);
			      } else {
			        element.setAttribute(name, value === true ? '' : value);
			      }
			    });
			  });
			}

			function effect$2(_ref2) {
			  var state = _ref2.state;
			  var initialStyles = {
			    popper: {
			      position: state.options.strategy,
			      left: '0',
			      top: '0',
			      margin: '0'
			    },
			    arrow: {
			      position: 'absolute'
			    },
			    reference: {}
			  };
			  Object.assign(state.elements.popper.style, initialStyles.popper);
			  state.styles = initialStyles;

			  if (state.elements.arrow) {
			    Object.assign(state.elements.arrow.style, initialStyles.arrow);
			  }

			  return function () {
			    Object.keys(state.elements).forEach(function (name) {
			      var element = state.elements[name];
			      var attributes = state.attributes[name] || {};
			      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]); // Set all values to an empty string to unset them

			      var style = styleProperties.reduce(function (style, property) {
			        style[property] = '';
			        return style;
			      }, {}); // arrow is optional + virtual elements

			      if (!isHTMLElement(element) || !getNodeName(element)) {
			        return;
			      }

			      Object.assign(element.style, style);
			      Object.keys(attributes).forEach(function (attribute) {
			        element.removeAttribute(attribute);
			      });
			    });
			  };
			} // eslint-disable-next-line import/no-unused-modules


			var applyStyles$1 = {
			  name: 'applyStyles',
			  enabled: true,
			  phase: 'write',
			  fn: applyStyles,
			  effect: effect$2,
			  requires: ['computeStyles']
			};

			function getBasePlacement(placement) {
			  return placement.split('-')[0];
			}

			var max = Math.max;
			var min = Math.min;
			var round = Math.round;

			function getBoundingClientRect(element, includeScale) {
			  if (includeScale === void 0) {
			    includeScale = false;
			  }

			  var rect = element.getBoundingClientRect();
			  var scaleX = 1;
			  var scaleY = 1;

			  if (isHTMLElement(element) && includeScale) {
			    var offsetHeight = element.offsetHeight;
			    var offsetWidth = element.offsetWidth; // Do not attempt to divide by 0, otherwise we get `Infinity` as scale
			    // Fallback to 1 in case both values are `0`

			    if (offsetWidth > 0) {
			      scaleX = round(rect.width) / offsetWidth || 1;
			    }

			    if (offsetHeight > 0) {
			      scaleY = round(rect.height) / offsetHeight || 1;
			    }
			  }

			  return {
			    width: rect.width / scaleX,
			    height: rect.height / scaleY,
			    top: rect.top / scaleY,
			    right: rect.right / scaleX,
			    bottom: rect.bottom / scaleY,
			    left: rect.left / scaleX,
			    x: rect.left / scaleX,
			    y: rect.top / scaleY
			  };
			}

			// means it doesn't take into account transforms.

			function getLayoutRect(element) {
			  var clientRect = getBoundingClientRect(element); // Use the clientRect sizes if it's not been transformed.
			  // Fixes https://github.com/popperjs/popper-core/issues/1223

			  var width = element.offsetWidth;
			  var height = element.offsetHeight;

			  if (Math.abs(clientRect.width - width) <= 1) {
			    width = clientRect.width;
			  }

			  if (Math.abs(clientRect.height - height) <= 1) {
			    height = clientRect.height;
			  }

			  return {
			    x: element.offsetLeft,
			    y: element.offsetTop,
			    width: width,
			    height: height
			  };
			}

			function contains(parent, child) {
			  var rootNode = child.getRootNode && child.getRootNode(); // First, attempt with faster native method

			  if (parent.contains(child)) {
			    return true;
			  } // then fallback to custom implementation with Shadow DOM support
			  else if (rootNode && isShadowRoot(rootNode)) {
			      var next = child;

			      do {
			        if (next && parent.isSameNode(next)) {
			          return true;
			        } // $FlowFixMe[prop-missing]: need a better way to handle this...


			        next = next.parentNode || next.host;
			      } while (next);
			    } // Give up, the result is false


			  return false;
			}

			function getComputedStyle(element) {
			  return getWindow(element).getComputedStyle(element);
			}

			function isTableElement(element) {
			  return ['table', 'td', 'th'].indexOf(getNodeName(element)) >= 0;
			}

			function getDocumentElement(element) {
			  // $FlowFixMe[incompatible-return]: assume body is always available
			  return ((isElement(element) ? element.ownerDocument : // $FlowFixMe[prop-missing]
			  element.document) || window.document).documentElement;
			}

			function getParentNode(element) {
			  if (getNodeName(element) === 'html') {
			    return element;
			  }

			  return (// this is a quicker (but less type safe) way to save quite some bytes from the bundle
			    // $FlowFixMe[incompatible-return]
			    // $FlowFixMe[prop-missing]
			    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
			    element.parentNode || ( // DOM Element detected
			    isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
			    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
			    getDocumentElement(element) // fallback

			  );
			}

			function getTrueOffsetParent(element) {
			  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
			  getComputedStyle(element).position === 'fixed') {
			    return null;
			  }

			  return element.offsetParent;
			} // `.offsetParent` reports `null` for fixed elements, while absolute elements
			// return the containing block


			function getContainingBlock(element) {
			  var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;
			  var isIE = navigator.userAgent.indexOf('Trident') !== -1;

			  if (isIE && isHTMLElement(element)) {
			    // In IE 9, 10 and 11 fixed elements containing block is always established by the viewport
			    var elementCss = getComputedStyle(element);

			    if (elementCss.position === 'fixed') {
			      return null;
			    }
			  }

			  var currentNode = getParentNode(element);

			  if (isShadowRoot(currentNode)) {
			    currentNode = currentNode.host;
			  }

			  while (isHTMLElement(currentNode) && ['html', 'body'].indexOf(getNodeName(currentNode)) < 0) {
			    var css = getComputedStyle(currentNode); // This is non-exhaustive but covers the most common CSS properties that
			    // create a containing block.
			    // https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block#identifying_the_containing_block

			    if (css.transform !== 'none' || css.perspective !== 'none' || css.contain === 'paint' || ['transform', 'perspective'].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === 'filter' || isFirefox && css.filter && css.filter !== 'none') {
			      return currentNode;
			    } else {
			      currentNode = currentNode.parentNode;
			    }
			  }

			  return null;
			} // Gets the closest ancestor positioned element. Handles some edge cases,
			// such as table ancestors and cross browser bugs.


			function getOffsetParent(element) {
			  var window = getWindow(element);
			  var offsetParent = getTrueOffsetParent(element);

			  while (offsetParent && isTableElement(offsetParent) && getComputedStyle(offsetParent).position === 'static') {
			    offsetParent = getTrueOffsetParent(offsetParent);
			  }

			  if (offsetParent && (getNodeName(offsetParent) === 'html' || getNodeName(offsetParent) === 'body' && getComputedStyle(offsetParent).position === 'static')) {
			    return window;
			  }

			  return offsetParent || getContainingBlock(element) || window;
			}

			function getMainAxisFromPlacement(placement) {
			  return ['top', 'bottom'].indexOf(placement) >= 0 ? 'x' : 'y';
			}

			function within(min$1, value, max$1) {
			  return max(min$1, min(value, max$1));
			}
			function withinMaxClamp(min, value, max) {
			  var v = within(min, value, max);
			  return v > max ? max : v;
			}

			function getFreshSideObject() {
			  return {
			    top: 0,
			    right: 0,
			    bottom: 0,
			    left: 0
			  };
			}

			function mergePaddingObject(paddingObject) {
			  return Object.assign({}, getFreshSideObject(), paddingObject);
			}

			function expandToHashMap(value, keys) {
			  return keys.reduce(function (hashMap, key) {
			    hashMap[key] = value;
			    return hashMap;
			  }, {});
			}

			var toPaddingObject = function toPaddingObject(padding, state) {
			  padding = typeof padding === 'function' ? padding(Object.assign({}, state.rects, {
			    placement: state.placement
			  })) : padding;
			  return mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
			};

			function arrow(_ref) {
			  var _state$modifiersData$;

			  var state = _ref.state,
			      name = _ref.name,
			      options = _ref.options;
			  var arrowElement = state.elements.arrow;
			  var popperOffsets = state.modifiersData.popperOffsets;
			  var basePlacement = getBasePlacement(state.placement);
			  var axis = getMainAxisFromPlacement(basePlacement);
			  var isVertical = [left, right].indexOf(basePlacement) >= 0;
			  var len = isVertical ? 'height' : 'width';

			  if (!arrowElement || !popperOffsets) {
			    return;
			  }

			  var paddingObject = toPaddingObject(options.padding, state);
			  var arrowRect = getLayoutRect(arrowElement);
			  var minProp = axis === 'y' ? top : left;
			  var maxProp = axis === 'y' ? bottom : right;
			  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets[axis] - state.rects.popper[len];
			  var startDiff = popperOffsets[axis] - state.rects.reference[axis];
			  var arrowOffsetParent = getOffsetParent(arrowElement);
			  var clientSize = arrowOffsetParent ? axis === 'y' ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
			  var centerToReference = endDiff / 2 - startDiff / 2; // Make sure the arrow doesn't overflow the popper if the center point is
			  // outside of the popper bounds

			  var min = paddingObject[minProp];
			  var max = clientSize - arrowRect[len] - paddingObject[maxProp];
			  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
			  var offset = within(min, center, max); // Prevents breaking syntax highlighting...

			  var axisProp = axis;
			  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset, _state$modifiersData$.centerOffset = offset - center, _state$modifiersData$);
			}

			function effect$1(_ref2) {
			  var state = _ref2.state,
			      options = _ref2.options;
			  var _options$element = options.element,
			      arrowElement = _options$element === void 0 ? '[data-popper-arrow]' : _options$element;

			  if (arrowElement == null) {
			    return;
			  } // CSS selector


			  if (typeof arrowElement === 'string') {
			    arrowElement = state.elements.popper.querySelector(arrowElement);

			    if (!arrowElement) {
			      return;
			    }
			  }

			  if (!contains(state.elements.popper, arrowElement)) {

			    return;
			  }

			  state.elements.arrow = arrowElement;
			} // eslint-disable-next-line import/no-unused-modules


			var arrow$1 = {
			  name: 'arrow',
			  enabled: true,
			  phase: 'main',
			  fn: arrow,
			  effect: effect$1,
			  requires: ['popperOffsets'],
			  requiresIfExists: ['preventOverflow']
			};

			function getVariation(placement) {
			  return placement.split('-')[1];
			}

			var unsetSides = {
			  top: 'auto',
			  right: 'auto',
			  bottom: 'auto',
			  left: 'auto'
			}; // Round the offsets to the nearest suitable subpixel based on the DPR.
			// Zooming can change the DPR, but it seems to report a value that will
			// cleanly divide the values into the appropriate subpixels.

			function roundOffsetsByDPR(_ref) {
			  var x = _ref.x,
			      y = _ref.y;
			  var win = window;
			  var dpr = win.devicePixelRatio || 1;
			  return {
			    x: round(x * dpr) / dpr || 0,
			    y: round(y * dpr) / dpr || 0
			  };
			}

			function mapToStyles(_ref2) {
			  var _Object$assign2;

			  var popper = _ref2.popper,
			      popperRect = _ref2.popperRect,
			      placement = _ref2.placement,
			      variation = _ref2.variation,
			      offsets = _ref2.offsets,
			      position = _ref2.position,
			      gpuAcceleration = _ref2.gpuAcceleration,
			      adaptive = _ref2.adaptive,
			      roundOffsets = _ref2.roundOffsets,
			      isFixed = _ref2.isFixed;
			  var _offsets$x = offsets.x,
			      x = _offsets$x === void 0 ? 0 : _offsets$x,
			      _offsets$y = offsets.y,
			      y = _offsets$y === void 0 ? 0 : _offsets$y;

			  var _ref3 = typeof roundOffsets === 'function' ? roundOffsets({
			    x: x,
			    y: y
			  }) : {
			    x: x,
			    y: y
			  };

			  x = _ref3.x;
			  y = _ref3.y;
			  var hasX = offsets.hasOwnProperty('x');
			  var hasY = offsets.hasOwnProperty('y');
			  var sideX = left;
			  var sideY = top;
			  var win = window;

			  if (adaptive) {
			    var offsetParent = getOffsetParent(popper);
			    var heightProp = 'clientHeight';
			    var widthProp = 'clientWidth';

			    if (offsetParent === getWindow(popper)) {
			      offsetParent = getDocumentElement(popper);

			      if (getComputedStyle(offsetParent).position !== 'static' && position === 'absolute') {
			        heightProp = 'scrollHeight';
			        widthProp = 'scrollWidth';
			      }
			    } // $FlowFixMe[incompatible-cast]: force type refinement, we compare offsetParent with window above, but Flow doesn't detect it


			    offsetParent = offsetParent;

			    if (placement === top || (placement === left || placement === right) && variation === end) {
			      sideY = bottom;
			      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : // $FlowFixMe[prop-missing]
			      offsetParent[heightProp];
			      y -= offsetY - popperRect.height;
			      y *= gpuAcceleration ? 1 : -1;
			    }

			    if (placement === left || (placement === top || placement === bottom) && variation === end) {
			      sideX = right;
			      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : // $FlowFixMe[prop-missing]
			      offsetParent[widthProp];
			      x -= offsetX - popperRect.width;
			      x *= gpuAcceleration ? 1 : -1;
			    }
			  }

			  var commonStyles = Object.assign({
			    position: position
			  }, adaptive && unsetSides);

			  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
			    x: x,
			    y: y
			  }) : {
			    x: x,
			    y: y
			  };

			  x = _ref4.x;
			  y = _ref4.y;

			  if (gpuAcceleration) {
			    var _Object$assign;

			    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? '0' : '', _Object$assign[sideX] = hasX ? '0' : '', _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
			  }

			  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : '', _Object$assign2[sideX] = hasX ? x + "px" : '', _Object$assign2.transform = '', _Object$assign2));
			}

			function computeStyles(_ref5) {
			  var state = _ref5.state,
			      options = _ref5.options;
			  var _options$gpuAccelerat = options.gpuAcceleration,
			      gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat,
			      _options$adaptive = options.adaptive,
			      adaptive = _options$adaptive === void 0 ? true : _options$adaptive,
			      _options$roundOffsets = options.roundOffsets,
			      roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;

			  var commonStyles = {
			    placement: getBasePlacement(state.placement),
			    variation: getVariation(state.placement),
			    popper: state.elements.popper,
			    popperRect: state.rects.popper,
			    gpuAcceleration: gpuAcceleration,
			    isFixed: state.options.strategy === 'fixed'
			  };

			  if (state.modifiersData.popperOffsets != null) {
			    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
			      offsets: state.modifiersData.popperOffsets,
			      position: state.options.strategy,
			      adaptive: adaptive,
			      roundOffsets: roundOffsets
			    })));
			  }

			  if (state.modifiersData.arrow != null) {
			    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
			      offsets: state.modifiersData.arrow,
			      position: 'absolute',
			      adaptive: false,
			      roundOffsets: roundOffsets
			    })));
			  }

			  state.attributes.popper = Object.assign({}, state.attributes.popper, {
			    'data-popper-placement': state.placement
			  });
			} // eslint-disable-next-line import/no-unused-modules


			var computeStyles$1 = {
			  name: 'computeStyles',
			  enabled: true,
			  phase: 'beforeWrite',
			  fn: computeStyles,
			  data: {}
			};

			var passive = {
			  passive: true
			};

			function effect(_ref) {
			  var state = _ref.state,
			      instance = _ref.instance,
			      options = _ref.options;
			  var _options$scroll = options.scroll,
			      scroll = _options$scroll === void 0 ? true : _options$scroll,
			      _options$resize = options.resize,
			      resize = _options$resize === void 0 ? true : _options$resize;
			  var window = getWindow(state.elements.popper);
			  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);

			  if (scroll) {
			    scrollParents.forEach(function (scrollParent) {
			      scrollParent.addEventListener('scroll', instance.update, passive);
			    });
			  }

			  if (resize) {
			    window.addEventListener('resize', instance.update, passive);
			  }

			  return function () {
			    if (scroll) {
			      scrollParents.forEach(function (scrollParent) {
			        scrollParent.removeEventListener('scroll', instance.update, passive);
			      });
			    }

			    if (resize) {
			      window.removeEventListener('resize', instance.update, passive);
			    }
			  };
			} // eslint-disable-next-line import/no-unused-modules


			var eventListeners = {
			  name: 'eventListeners',
			  enabled: true,
			  phase: 'write',
			  fn: function fn() {},
			  effect: effect,
			  data: {}
			};

			var hash$1 = {
			  left: 'right',
			  right: 'left',
			  bottom: 'top',
			  top: 'bottom'
			};
			function getOppositePlacement(placement) {
			  return placement.replace(/left|right|bottom|top/g, function (matched) {
			    return hash$1[matched];
			  });
			}

			var hash = {
			  start: 'end',
			  end: 'start'
			};
			function getOppositeVariationPlacement(placement) {
			  return placement.replace(/start|end/g, function (matched) {
			    return hash[matched];
			  });
			}

			function getWindowScroll(node) {
			  var win = getWindow(node);
			  var scrollLeft = win.pageXOffset;
			  var scrollTop = win.pageYOffset;
			  return {
			    scrollLeft: scrollLeft,
			    scrollTop: scrollTop
			  };
			}

			function getWindowScrollBarX(element) {
			  // If <html> has a CSS width greater than the viewport, then this will be
			  // incorrect for RTL.
			  // Popper 1 is broken in this case and never had a bug report so let's assume
			  // it's not an issue. I don't think anyone ever specifies width on <html>
			  // anyway.
			  // Browsers where the left scrollbar doesn't cause an issue report `0` for
			  // this (e.g. Edge 2019, IE11, Safari)
			  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
			}

			function getViewportRect(element) {
			  var win = getWindow(element);
			  var html = getDocumentElement(element);
			  var visualViewport = win.visualViewport;
			  var width = html.clientWidth;
			  var height = html.clientHeight;
			  var x = 0;
			  var y = 0; // NB: This isn't supported on iOS <= 12. If the keyboard is open, the popper
			  // can be obscured underneath it.
			  // Also, `html.clientHeight` adds the bottom bar height in Safari iOS, even
			  // if it isn't open, so if this isn't available, the popper will be detected
			  // to overflow the bottom of the screen too early.

			  if (visualViewport) {
			    width = visualViewport.width;
			    height = visualViewport.height; // Uses Layout Viewport (like Chrome; Safari does not currently)
			    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
			    // errors due to floating point numbers, so we need to check precision.
			    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
			    // Feature detection fails in mobile emulation mode in Chrome.
			    // Math.abs(win.innerWidth / visualViewport.scale - visualViewport.width) <
			    // 0.001
			    // Fallback here: "Not Safari" userAgent

			    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
			      x = visualViewport.offsetLeft;
			      y = visualViewport.offsetTop;
			    }
			  }

			  return {
			    width: width,
			    height: height,
			    x: x + getWindowScrollBarX(element),
			    y: y
			  };
			}

			// of the `<html>` and `<body>` rect bounds if horizontally scrollable

			function getDocumentRect(element) {
			  var _element$ownerDocumen;

			  var html = getDocumentElement(element);
			  var winScroll = getWindowScroll(element);
			  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
			  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
			  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
			  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
			  var y = -winScroll.scrollTop;

			  if (getComputedStyle(body || html).direction === 'rtl') {
			    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
			  }

			  return {
			    width: width,
			    height: height,
			    x: x,
			    y: y
			  };
			}

			function isScrollParent(element) {
			  // Firefox wants us to check `-x` and `-y` variations as well
			  var _getComputedStyle = getComputedStyle(element),
			      overflow = _getComputedStyle.overflow,
			      overflowX = _getComputedStyle.overflowX,
			      overflowY = _getComputedStyle.overflowY;

			  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
			}

			function getScrollParent(node) {
			  if (['html', 'body', '#document'].indexOf(getNodeName(node)) >= 0) {
			    // $FlowFixMe[incompatible-return]: assume body is always available
			    return node.ownerDocument.body;
			  }

			  if (isHTMLElement(node) && isScrollParent(node)) {
			    return node;
			  }

			  return getScrollParent(getParentNode(node));
			}

			/*
			given a DOM element, return the list of all scroll parents, up the list of ancesors
			until we get to the top window object. This list is what we attach scroll listeners
			to, because if any of these parent elements scroll, we'll need to re-calculate the
			reference element's position.
			*/

			function listScrollParents(element, list) {
			  var _element$ownerDocumen;

			  if (list === void 0) {
			    list = [];
			  }

			  var scrollParent = getScrollParent(element);
			  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
			  var win = getWindow(scrollParent);
			  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
			  var updatedList = list.concat(target);
			  return isBody ? updatedList : // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
			  updatedList.concat(listScrollParents(getParentNode(target)));
			}

			function rectToClientRect(rect) {
			  return Object.assign({}, rect, {
			    left: rect.x,
			    top: rect.y,
			    right: rect.x + rect.width,
			    bottom: rect.y + rect.height
			  });
			}

			function getInnerBoundingClientRect(element) {
			  var rect = getBoundingClientRect(element);
			  rect.top = rect.top + element.clientTop;
			  rect.left = rect.left + element.clientLeft;
			  rect.bottom = rect.top + element.clientHeight;
			  rect.right = rect.left + element.clientWidth;
			  rect.width = element.clientWidth;
			  rect.height = element.clientHeight;
			  rect.x = rect.left;
			  rect.y = rect.top;
			  return rect;
			}

			function getClientRectFromMixedType(element, clippingParent) {
			  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
			} // A "clipping parent" is an overflowable container with the characteristic of
			// clipping (or hiding) overflowing elements with a position different from
			// `initial`


			function getClippingParents(element) {
			  var clippingParents = listScrollParents(getParentNode(element));
			  var canEscapeClipping = ['absolute', 'fixed'].indexOf(getComputedStyle(element).position) >= 0;
			  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;

			  if (!isElement(clipperElement)) {
			    return [];
			  } // $FlowFixMe[incompatible-return]: https://github.com/facebook/flow/issues/1414


			  return clippingParents.filter(function (clippingParent) {
			    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== 'body';
			  });
			} // Gets the maximum area that the element is visible in due to any number of
			// clipping parents


			function getClippingRect(element, boundary, rootBoundary) {
			  var mainClippingParents = boundary === 'clippingParents' ? getClippingParents(element) : [].concat(boundary);
			  var clippingParents = [].concat(mainClippingParents, [rootBoundary]);
			  var firstClippingParent = clippingParents[0];
			  var clippingRect = clippingParents.reduce(function (accRect, clippingParent) {
			    var rect = getClientRectFromMixedType(element, clippingParent);
			    accRect.top = max(rect.top, accRect.top);
			    accRect.right = min(rect.right, accRect.right);
			    accRect.bottom = min(rect.bottom, accRect.bottom);
			    accRect.left = max(rect.left, accRect.left);
			    return accRect;
			  }, getClientRectFromMixedType(element, firstClippingParent));
			  clippingRect.width = clippingRect.right - clippingRect.left;
			  clippingRect.height = clippingRect.bottom - clippingRect.top;
			  clippingRect.x = clippingRect.left;
			  clippingRect.y = clippingRect.top;
			  return clippingRect;
			}

			function computeOffsets(_ref) {
			  var reference = _ref.reference,
			      element = _ref.element,
			      placement = _ref.placement;
			  var basePlacement = placement ? getBasePlacement(placement) : null;
			  var variation = placement ? getVariation(placement) : null;
			  var commonX = reference.x + reference.width / 2 - element.width / 2;
			  var commonY = reference.y + reference.height / 2 - element.height / 2;
			  var offsets;

			  switch (basePlacement) {
			    case top:
			      offsets = {
			        x: commonX,
			        y: reference.y - element.height
			      };
			      break;

			    case bottom:
			      offsets = {
			        x: commonX,
			        y: reference.y + reference.height
			      };
			      break;

			    case right:
			      offsets = {
			        x: reference.x + reference.width,
			        y: commonY
			      };
			      break;

			    case left:
			      offsets = {
			        x: reference.x - element.width,
			        y: commonY
			      };
			      break;

			    default:
			      offsets = {
			        x: reference.x,
			        y: reference.y
			      };
			  }

			  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;

			  if (mainAxis != null) {
			    var len = mainAxis === 'y' ? 'height' : 'width';

			    switch (variation) {
			      case start:
			        offsets[mainAxis] = offsets[mainAxis] - (reference[len] / 2 - element[len] / 2);
			        break;

			      case end:
			        offsets[mainAxis] = offsets[mainAxis] + (reference[len] / 2 - element[len] / 2);
			        break;
			    }
			  }

			  return offsets;
			}

			function detectOverflow(state, options) {
			  if (options === void 0) {
			    options = {};
			  }

			  var _options = options,
			      _options$placement = _options.placement,
			      placement = _options$placement === void 0 ? state.placement : _options$placement,
			      _options$boundary = _options.boundary,
			      boundary = _options$boundary === void 0 ? clippingParents : _options$boundary,
			      _options$rootBoundary = _options.rootBoundary,
			      rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary,
			      _options$elementConte = _options.elementContext,
			      elementContext = _options$elementConte === void 0 ? popper : _options$elementConte,
			      _options$altBoundary = _options.altBoundary,
			      altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary,
			      _options$padding = _options.padding,
			      padding = _options$padding === void 0 ? 0 : _options$padding;
			  var paddingObject = mergePaddingObject(typeof padding !== 'number' ? padding : expandToHashMap(padding, basePlacements));
			  var altContext = elementContext === popper ? reference : popper;
			  var popperRect = state.rects.popper;
			  var element = state.elements[altBoundary ? altContext : elementContext];
			  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
			  var referenceClientRect = getBoundingClientRect(state.elements.reference);
			  var popperOffsets = computeOffsets({
			    reference: referenceClientRect,
			    element: popperRect,
			    strategy: 'absolute',
			    placement: placement
			  });
			  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets));
			  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect; // positive = overflowing the clipping rect
			  // 0 or negative = within the clipping rect

			  var overflowOffsets = {
			    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
			    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
			    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
			    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
			  };
			  var offsetData = state.modifiersData.offset; // Offsets can be applied only to the popper element

			  if (elementContext === popper && offsetData) {
			    var offset = offsetData[placement];
			    Object.keys(overflowOffsets).forEach(function (key) {
			      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
			      var axis = [top, bottom].indexOf(key) >= 0 ? 'y' : 'x';
			      overflowOffsets[key] += offset[axis] * multiply;
			    });
			  }

			  return overflowOffsets;
			}

			function computeAutoPlacement(state, options) {
			  if (options === void 0) {
			    options = {};
			  }

			  var _options = options,
			      placement = _options.placement,
			      boundary = _options.boundary,
			      rootBoundary = _options.rootBoundary,
			      padding = _options.padding,
			      flipVariations = _options.flipVariations,
			      _options$allowedAutoP = _options.allowedAutoPlacements,
			      allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
			  var variation = getVariation(placement);
			  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function (placement) {
			    return getVariation(placement) === variation;
			  }) : basePlacements;
			  var allowedPlacements = placements$1.filter(function (placement) {
			    return allowedAutoPlacements.indexOf(placement) >= 0;
			  });

			  if (allowedPlacements.length === 0) {
			    allowedPlacements = placements$1;
			  } // $FlowFixMe[incompatible-type]: Flow seems to have problems with two array unions...


			  var overflows = allowedPlacements.reduce(function (acc, placement) {
			    acc[placement] = detectOverflow(state, {
			      placement: placement,
			      boundary: boundary,
			      rootBoundary: rootBoundary,
			      padding: padding
			    })[getBasePlacement(placement)];
			    return acc;
			  }, {});
			  return Object.keys(overflows).sort(function (a, b) {
			    return overflows[a] - overflows[b];
			  });
			}

			function getExpandedFallbackPlacements(placement) {
			  if (getBasePlacement(placement) === auto) {
			    return [];
			  }

			  var oppositePlacement = getOppositePlacement(placement);
			  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
			}

			function flip(_ref) {
			  var state = _ref.state,
			      options = _ref.options,
			      name = _ref.name;

			  if (state.modifiersData[name]._skip) {
			    return;
			  }

			  var _options$mainAxis = options.mainAxis,
			      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
			      _options$altAxis = options.altAxis,
			      checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis,
			      specifiedFallbackPlacements = options.fallbackPlacements,
			      padding = options.padding,
			      boundary = options.boundary,
			      rootBoundary = options.rootBoundary,
			      altBoundary = options.altBoundary,
			      _options$flipVariatio = options.flipVariations,
			      flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio,
			      allowedAutoPlacements = options.allowedAutoPlacements;
			  var preferredPlacement = state.options.placement;
			  var basePlacement = getBasePlacement(preferredPlacement);
			  var isBasePlacement = basePlacement === preferredPlacement;
			  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
			  var placements = [preferredPlacement].concat(fallbackPlacements).reduce(function (acc, placement) {
			    return acc.concat(getBasePlacement(placement) === auto ? computeAutoPlacement(state, {
			      placement: placement,
			      boundary: boundary,
			      rootBoundary: rootBoundary,
			      padding: padding,
			      flipVariations: flipVariations,
			      allowedAutoPlacements: allowedAutoPlacements
			    }) : placement);
			  }, []);
			  var referenceRect = state.rects.reference;
			  var popperRect = state.rects.popper;
			  var checksMap = new Map();
			  var makeFallbackChecks = true;
			  var firstFittingPlacement = placements[0];

			  for (var i = 0; i < placements.length; i++) {
			    var placement = placements[i];

			    var _basePlacement = getBasePlacement(placement);

			    var isStartVariation = getVariation(placement) === start;
			    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
			    var len = isVertical ? 'width' : 'height';
			    var overflow = detectOverflow(state, {
			      placement: placement,
			      boundary: boundary,
			      rootBoundary: rootBoundary,
			      altBoundary: altBoundary,
			      padding: padding
			    });
			    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;

			    if (referenceRect[len] > popperRect[len]) {
			      mainVariationSide = getOppositePlacement(mainVariationSide);
			    }

			    var altVariationSide = getOppositePlacement(mainVariationSide);
			    var checks = [];

			    if (checkMainAxis) {
			      checks.push(overflow[_basePlacement] <= 0);
			    }

			    if (checkAltAxis) {
			      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
			    }

			    if (checks.every(function (check) {
			      return check;
			    })) {
			      firstFittingPlacement = placement;
			      makeFallbackChecks = false;
			      break;
			    }

			    checksMap.set(placement, checks);
			  }

			  if (makeFallbackChecks) {
			    // `2` may be desired in some cases – research later
			    var numberOfChecks = flipVariations ? 3 : 1;

			    var _loop = function _loop(_i) {
			      var fittingPlacement = placements.find(function (placement) {
			        var checks = checksMap.get(placement);

			        if (checks) {
			          return checks.slice(0, _i).every(function (check) {
			            return check;
			          });
			        }
			      });

			      if (fittingPlacement) {
			        firstFittingPlacement = fittingPlacement;
			        return "break";
			      }
			    };

			    for (var _i = numberOfChecks; _i > 0; _i--) {
			      var _ret = _loop(_i);

			      if (_ret === "break") break;
			    }
			  }

			  if (state.placement !== firstFittingPlacement) {
			    state.modifiersData[name]._skip = true;
			    state.placement = firstFittingPlacement;
			    state.reset = true;
			  }
			} // eslint-disable-next-line import/no-unused-modules


			var flip$1 = {
			  name: 'flip',
			  enabled: true,
			  phase: 'main',
			  fn: flip,
			  requiresIfExists: ['offset'],
			  data: {
			    _skip: false
			  }
			};

			function getSideOffsets(overflow, rect, preventedOffsets) {
			  if (preventedOffsets === void 0) {
			    preventedOffsets = {
			      x: 0,
			      y: 0
			    };
			  }

			  return {
			    top: overflow.top - rect.height - preventedOffsets.y,
			    right: overflow.right - rect.width + preventedOffsets.x,
			    bottom: overflow.bottom - rect.height + preventedOffsets.y,
			    left: overflow.left - rect.width - preventedOffsets.x
			  };
			}

			function isAnySideFullyClipped(overflow) {
			  return [top, right, bottom, left].some(function (side) {
			    return overflow[side] >= 0;
			  });
			}

			function hide(_ref) {
			  var state = _ref.state,
			      name = _ref.name;
			  var referenceRect = state.rects.reference;
			  var popperRect = state.rects.popper;
			  var preventedOffsets = state.modifiersData.preventOverflow;
			  var referenceOverflow = detectOverflow(state, {
			    elementContext: 'reference'
			  });
			  var popperAltOverflow = detectOverflow(state, {
			    altBoundary: true
			  });
			  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
			  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
			  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
			  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
			  state.modifiersData[name] = {
			    referenceClippingOffsets: referenceClippingOffsets,
			    popperEscapeOffsets: popperEscapeOffsets,
			    isReferenceHidden: isReferenceHidden,
			    hasPopperEscaped: hasPopperEscaped
			  };
			  state.attributes.popper = Object.assign({}, state.attributes.popper, {
			    'data-popper-reference-hidden': isReferenceHidden,
			    'data-popper-escaped': hasPopperEscaped
			  });
			} // eslint-disable-next-line import/no-unused-modules


			var hide$1 = {
			  name: 'hide',
			  enabled: true,
			  phase: 'main',
			  requiresIfExists: ['preventOverflow'],
			  fn: hide
			};

			function distanceAndSkiddingToXY(placement, rects, offset) {
			  var basePlacement = getBasePlacement(placement);
			  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;

			  var _ref = typeof offset === 'function' ? offset(Object.assign({}, rects, {
			    placement: placement
			  })) : offset,
			      skidding = _ref[0],
			      distance = _ref[1];

			  skidding = skidding || 0;
			  distance = (distance || 0) * invertDistance;
			  return [left, right].indexOf(basePlacement) >= 0 ? {
			    x: distance,
			    y: skidding
			  } : {
			    x: skidding,
			    y: distance
			  };
			}

			function offset(_ref2) {
			  var state = _ref2.state,
			      options = _ref2.options,
			      name = _ref2.name;
			  var _options$offset = options.offset,
			      offset = _options$offset === void 0 ? [0, 0] : _options$offset;
			  var data = placements.reduce(function (acc, placement) {
			    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset);
			    return acc;
			  }, {});
			  var _data$state$placement = data[state.placement],
			      x = _data$state$placement.x,
			      y = _data$state$placement.y;

			  if (state.modifiersData.popperOffsets != null) {
			    state.modifiersData.popperOffsets.x += x;
			    state.modifiersData.popperOffsets.y += y;
			  }

			  state.modifiersData[name] = data;
			} // eslint-disable-next-line import/no-unused-modules


			var offset$1 = {
			  name: 'offset',
			  enabled: true,
			  phase: 'main',
			  requires: ['popperOffsets'],
			  fn: offset
			};

			function popperOffsets(_ref) {
			  var state = _ref.state,
			      name = _ref.name;
			  // Offsets are the actual position the popper needs to have to be
			  // properly positioned near its reference element
			  // This is the most basic placement, and will be adjusted by
			  // the modifiers in the next step
			  state.modifiersData[name] = computeOffsets({
			    reference: state.rects.reference,
			    element: state.rects.popper,
			    strategy: 'absolute',
			    placement: state.placement
			  });
			} // eslint-disable-next-line import/no-unused-modules


			var popperOffsets$1 = {
			  name: 'popperOffsets',
			  enabled: true,
			  phase: 'read',
			  fn: popperOffsets,
			  data: {}
			};

			function getAltAxis(axis) {
			  return axis === 'x' ? 'y' : 'x';
			}

			function preventOverflow(_ref) {
			  var state = _ref.state,
			      options = _ref.options,
			      name = _ref.name;
			  var _options$mainAxis = options.mainAxis,
			      checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis,
			      _options$altAxis = options.altAxis,
			      checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis,
			      boundary = options.boundary,
			      rootBoundary = options.rootBoundary,
			      altBoundary = options.altBoundary,
			      padding = options.padding,
			      _options$tether = options.tether,
			      tether = _options$tether === void 0 ? true : _options$tether,
			      _options$tetherOffset = options.tetherOffset,
			      tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
			  var overflow = detectOverflow(state, {
			    boundary: boundary,
			    rootBoundary: rootBoundary,
			    padding: padding,
			    altBoundary: altBoundary
			  });
			  var basePlacement = getBasePlacement(state.placement);
			  var variation = getVariation(state.placement);
			  var isBasePlacement = !variation;
			  var mainAxis = getMainAxisFromPlacement(basePlacement);
			  var altAxis = getAltAxis(mainAxis);
			  var popperOffsets = state.modifiersData.popperOffsets;
			  var referenceRect = state.rects.reference;
			  var popperRect = state.rects.popper;
			  var tetherOffsetValue = typeof tetherOffset === 'function' ? tetherOffset(Object.assign({}, state.rects, {
			    placement: state.placement
			  })) : tetherOffset;
			  var normalizedTetherOffsetValue = typeof tetherOffsetValue === 'number' ? {
			    mainAxis: tetherOffsetValue,
			    altAxis: tetherOffsetValue
			  } : Object.assign({
			    mainAxis: 0,
			    altAxis: 0
			  }, tetherOffsetValue);
			  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
			  var data = {
			    x: 0,
			    y: 0
			  };

			  if (!popperOffsets) {
			    return;
			  }

			  if (checkMainAxis) {
			    var _offsetModifierState$;

			    var mainSide = mainAxis === 'y' ? top : left;
			    var altSide = mainAxis === 'y' ? bottom : right;
			    var len = mainAxis === 'y' ? 'height' : 'width';
			    var offset = popperOffsets[mainAxis];
			    var min$1 = offset + overflow[mainSide];
			    var max$1 = offset - overflow[altSide];
			    var additive = tether ? -popperRect[len] / 2 : 0;
			    var minLen = variation === start ? referenceRect[len] : popperRect[len];
			    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len]; // We need to include the arrow in the calculation so the arrow doesn't go
			    // outside the reference bounds

			    var arrowElement = state.elements.arrow;
			    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
			      width: 0,
			      height: 0
			    };
			    var arrowPaddingObject = state.modifiersData['arrow#persistent'] ? state.modifiersData['arrow#persistent'].padding : getFreshSideObject();
			    var arrowPaddingMin = arrowPaddingObject[mainSide];
			    var arrowPaddingMax = arrowPaddingObject[altSide]; // If the reference length is smaller than the arrow length, we don't want
			    // to include its full size in the calculation. If the reference is small
			    // and near the edge of a boundary, the popper can overflow even if the
			    // reference is not overflowing as well (e.g. virtual elements with no
			    // width or height)

			    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
			    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
			    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
			    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
			    var clientOffset = arrowOffsetParent ? mainAxis === 'y' ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
			    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
			    var tetherMin = offset + minOffset - offsetModifierValue - clientOffset;
			    var tetherMax = offset + maxOffset - offsetModifierValue;
			    var preventedOffset = within(tether ? min(min$1, tetherMin) : min$1, offset, tether ? max(max$1, tetherMax) : max$1);
			    popperOffsets[mainAxis] = preventedOffset;
			    data[mainAxis] = preventedOffset - offset;
			  }

			  if (checkAltAxis) {
			    var _offsetModifierState$2;

			    var _mainSide = mainAxis === 'x' ? top : left;

			    var _altSide = mainAxis === 'x' ? bottom : right;

			    var _offset = popperOffsets[altAxis];

			    var _len = altAxis === 'y' ? 'height' : 'width';

			    var _min = _offset + overflow[_mainSide];

			    var _max = _offset - overflow[_altSide];

			    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;

			    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;

			    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;

			    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;

			    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);

			    popperOffsets[altAxis] = _preventedOffset;
			    data[altAxis] = _preventedOffset - _offset;
			  }

			  state.modifiersData[name] = data;
			} // eslint-disable-next-line import/no-unused-modules


			var preventOverflow$1 = {
			  name: 'preventOverflow',
			  enabled: true,
			  phase: 'main',
			  fn: preventOverflow,
			  requiresIfExists: ['offset']
			};

			function getHTMLElementScroll(element) {
			  return {
			    scrollLeft: element.scrollLeft,
			    scrollTop: element.scrollTop
			  };
			}

			function getNodeScroll(node) {
			  if (node === getWindow(node) || !isHTMLElement(node)) {
			    return getWindowScroll(node);
			  } else {
			    return getHTMLElementScroll(node);
			  }
			}

			function isElementScaled(element) {
			  var rect = element.getBoundingClientRect();
			  var scaleX = round(rect.width) / element.offsetWidth || 1;
			  var scaleY = round(rect.height) / element.offsetHeight || 1;
			  return scaleX !== 1 || scaleY !== 1;
			} // Returns the composite rect of an element relative to its offsetParent.
			// Composite means it takes into account transforms as well as layout.


			function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
			  if (isFixed === void 0) {
			    isFixed = false;
			  }

			  var isOffsetParentAnElement = isHTMLElement(offsetParent);
			  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
			  var documentElement = getDocumentElement(offsetParent);
			  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
			  var scroll = {
			    scrollLeft: 0,
			    scrollTop: 0
			  };
			  var offsets = {
			    x: 0,
			    y: 0
			  };

			  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
			    if (getNodeName(offsetParent) !== 'body' || // https://github.com/popperjs/popper-core/issues/1078
			    isScrollParent(documentElement)) {
			      scroll = getNodeScroll(offsetParent);
			    }

			    if (isHTMLElement(offsetParent)) {
			      offsets = getBoundingClientRect(offsetParent, true);
			      offsets.x += offsetParent.clientLeft;
			      offsets.y += offsetParent.clientTop;
			    } else if (documentElement) {
			      offsets.x = getWindowScrollBarX(documentElement);
			    }
			  }

			  return {
			    x: rect.left + scroll.scrollLeft - offsets.x,
			    y: rect.top + scroll.scrollTop - offsets.y,
			    width: rect.width,
			    height: rect.height
			  };
			}

			function order(modifiers) {
			  var map = new Map();
			  var visited = new Set();
			  var result = [];
			  modifiers.forEach(function (modifier) {
			    map.set(modifier.name, modifier);
			  }); // On visiting object, check for its dependencies and visit them recursively

			  function sort(modifier) {
			    visited.add(modifier.name);
			    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
			    requires.forEach(function (dep) {
			      if (!visited.has(dep)) {
			        var depModifier = map.get(dep);

			        if (depModifier) {
			          sort(depModifier);
			        }
			      }
			    });
			    result.push(modifier);
			  }

			  modifiers.forEach(function (modifier) {
			    if (!visited.has(modifier.name)) {
			      // check for visited object
			      sort(modifier);
			    }
			  });
			  return result;
			}

			function orderModifiers(modifiers) {
			  // order based on dependencies
			  var orderedModifiers = order(modifiers); // order based on phase

			  return modifierPhases.reduce(function (acc, phase) {
			    return acc.concat(orderedModifiers.filter(function (modifier) {
			      return modifier.phase === phase;
			    }));
			  }, []);
			}

			function debounce(fn) {
			  var pending;
			  return function () {
			    if (!pending) {
			      pending = new Promise(function (resolve) {
			        Promise.resolve().then(function () {
			          pending = undefined;
			          resolve(fn());
			        });
			      });
			    }

			    return pending;
			  };
			}

			function mergeByName(modifiers) {
			  var merged = modifiers.reduce(function (merged, current) {
			    var existing = merged[current.name];
			    merged[current.name] = existing ? Object.assign({}, existing, current, {
			      options: Object.assign({}, existing.options, current.options),
			      data: Object.assign({}, existing.data, current.data)
			    }) : current;
			    return merged;
			  }, {}); // IE11 does not support Object.values

			  return Object.keys(merged).map(function (key) {
			    return merged[key];
			  });
			}

			var DEFAULT_OPTIONS = {
			  placement: 'bottom',
			  modifiers: [],
			  strategy: 'absolute'
			};

			function areValidElements() {
			  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
			    args[_key] = arguments[_key];
			  }

			  return !args.some(function (element) {
			    return !(element && typeof element.getBoundingClientRect === 'function');
			  });
			}

			function popperGenerator(generatorOptions) {
			  if (generatorOptions === void 0) {
			    generatorOptions = {};
			  }

			  var _generatorOptions = generatorOptions,
			      _generatorOptions$def = _generatorOptions.defaultModifiers,
			      defaultModifiers = _generatorOptions$def === void 0 ? [] : _generatorOptions$def,
			      _generatorOptions$def2 = _generatorOptions.defaultOptions,
			      defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
			  return function createPopper(reference, popper, options) {
			    if (options === void 0) {
			      options = defaultOptions;
			    }

			    var state = {
			      placement: 'bottom',
			      orderedModifiers: [],
			      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
			      modifiersData: {},
			      elements: {
			        reference: reference,
			        popper: popper
			      },
			      attributes: {},
			      styles: {}
			    };
			    var effectCleanupFns = [];
			    var isDestroyed = false;
			    var instance = {
			      state: state,
			      setOptions: function setOptions(setOptionsAction) {
			        var options = typeof setOptionsAction === 'function' ? setOptionsAction(state.options) : setOptionsAction;
			        cleanupModifierEffects();
			        state.options = Object.assign({}, defaultOptions, state.options, options);
			        state.scrollParents = {
			          reference: isElement(reference) ? listScrollParents(reference) : reference.contextElement ? listScrollParents(reference.contextElement) : [],
			          popper: listScrollParents(popper)
			        }; // Orders the modifiers based on their dependencies and `phase`
			        // properties

			        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers, state.options.modifiers))); // Strip out disabled modifiers

			        state.orderedModifiers = orderedModifiers.filter(function (m) {
			          return m.enabled;
			        }); // Validate the provided modifiers so that the consumer will get warned

			        runModifierEffects();
			        return instance.update();
			      },
			      // Sync update – it will always be executed, even if not necessary. This
			      // is useful for low frequency updates where sync behavior simplifies the
			      // logic.
			      // For high frequency updates (e.g. `resize` and `scroll` events), always
			      // prefer the async Popper#update method
			      forceUpdate: function forceUpdate() {
			        if (isDestroyed) {
			          return;
			        }

			        var _state$elements = state.elements,
			            reference = _state$elements.reference,
			            popper = _state$elements.popper; // Don't proceed if `reference` or `popper` are not valid elements
			        // anymore

			        if (!areValidElements(reference, popper)) {

			          return;
			        } // Store the reference and popper rects to be read by modifiers


			        state.rects = {
			          reference: getCompositeRect(reference, getOffsetParent(popper), state.options.strategy === 'fixed'),
			          popper: getLayoutRect(popper)
			        }; // Modifiers have the ability to reset the current update cycle. The
			        // most common use case for this is the `flip` modifier changing the
			        // placement, which then needs to re-run all the modifiers, because the
			        // logic was previously ran for the previous placement and is therefore
			        // stale/incorrect

			        state.reset = false;
			        state.placement = state.options.placement; // On each update cycle, the `modifiersData` property for each modifier
			        // is filled with the initial data specified by the modifier. This means
			        // it doesn't persist and is fresh on each update.
			        // To ensure persistent data, use `${name}#persistent`

			        state.orderedModifiers.forEach(function (modifier) {
			          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
			        });

			        for (var index = 0; index < state.orderedModifiers.length; index++) {

			          if (state.reset === true) {
			            state.reset = false;
			            index = -1;
			            continue;
			          }

			          var _state$orderedModifie = state.orderedModifiers[index],
			              fn = _state$orderedModifie.fn,
			              _state$orderedModifie2 = _state$orderedModifie.options,
			              _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2,
			              name = _state$orderedModifie.name;

			          if (typeof fn === 'function') {
			            state = fn({
			              state: state,
			              options: _options,
			              name: name,
			              instance: instance
			            }) || state;
			          }
			        }
			      },
			      // Async and optimistically optimized update – it will not be executed if
			      // not necessary (debounced to run at most once-per-tick)
			      update: debounce(function () {
			        return new Promise(function (resolve) {
			          instance.forceUpdate();
			          resolve(state);
			        });
			      }),
			      destroy: function destroy() {
			        cleanupModifierEffects();
			        isDestroyed = true;
			      }
			    };

			    if (!areValidElements(reference, popper)) {

			      return instance;
			    }

			    instance.setOptions(options).then(function (state) {
			      if (!isDestroyed && options.onFirstUpdate) {
			        options.onFirstUpdate(state);
			      }
			    }); // Modifiers have the ability to execute arbitrary code before the first
			    // update cycle runs. They will be executed in the same order as the update
			    // cycle. This is useful when a modifier adds some persistent data that
			    // other modifiers need to use, but the modifier is run after the dependent
			    // one.

			    function runModifierEffects() {
			      state.orderedModifiers.forEach(function (_ref3) {
			        var name = _ref3.name,
			            _ref3$options = _ref3.options,
			            options = _ref3$options === void 0 ? {} : _ref3$options,
			            effect = _ref3.effect;

			        if (typeof effect === 'function') {
			          var cleanupFn = effect({
			            state: state,
			            name: name,
			            instance: instance,
			            options: options
			          });

			          var noopFn = function noopFn() {};

			          effectCleanupFns.push(cleanupFn || noopFn);
			        }
			      });
			    }

			    function cleanupModifierEffects() {
			      effectCleanupFns.forEach(function (fn) {
			        return fn();
			      });
			      effectCleanupFns = [];
			    }

			    return instance;
			  };
			}

			var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
			var createPopper = /*#__PURE__*/popperGenerator({
			  defaultModifiers: defaultModifiers
			}); // eslint-disable-next-line import/no-unused-modules

			function Portal({ getContainer, children }) {
			  const containerRef = useRef();
			  const initRef = useRef(false);
			  if (!initRef.current) {
			    containerRef.current = getContainer();
			    initRef.current = true;
			  }
			  useEffect(() => {
			    return () => {
			      var _a, _b;
			      (_b = (_a = containerRef.current) == null ? void 0 : _a.parentNode) == null ? void 0 : _b.removeChild(containerRef.current);
			    };
			  }, []);
			  if (containerRef.current) {
			    return ReactDOM.createPortal(children, containerRef.current);
			  }
			  return null;
			}

			const PopperContext = React__default.createContext(null);

			function addEventListener(target, eventType, cb, option) {
			  const callback = ReactDOM.unstable_batchedUpdates ? function run(e) {
			    ReactDOM.unstable_batchedUpdates(cb, e);
			  } : cb;
			  if (target.addEventListener) {
			    target.addEventListener(eventType, callback, option);
			  }
			  return () => {
			    if (target.removeEventListener) {
			      target.removeEventListener(eventType, callback);
			    }
			  };
			}

			function usePopperShow(onDocumentClick) {
			  const [popperShow, setPopperShow] = useState(false);
			  let removeClickOutside = null;
			  let removeTouchOutside = null;
			  useEffect(() => {
			    if (popperShow) {
			      removeClickOutside = addEventListener(document, "mousedown", onDocumentClick);
			      removeTouchOutside = addEventListener(document, "touchstart", onDocumentClick);
			    } else {
			      clearOutsideHandler();
			    }
			    return () => clearOutsideHandler();
			  }, [popperShow]);
			  function clearOutsideHandler() {
			    if (removeClickOutside) {
			      removeClickOutside();
			      removeClickOutside = null;
			    }
			    if (removeTouchOutside) {
			      removeTouchOutside();
			      removeTouchOutside = null;
			    }
			  }
			  return [popperShow, setPopperShow];
			}

			const arrowModifier = {
			  name: "arrow",
			  options: {
			    element: "[data-popper-arrow]"
			  }
			};
			function usePopper(onVisibleChange) {
			  const referenceRef = useRef(null);
			  const popupRef = useRef(null);
			  const context = useContext(PopperContext);
			  const [popperShow, setPopperShow] = usePopperShow(onDocumentClick);
			  useEffect(() => {
			    onVisibleChange == null ? void 0 : onVisibleChange(popperShow);
			  }, [popperShow]);
			  let isHoverTrigger = false;
			  let hasPopupMouseDown = false;
			  let delayTimer = null;
			  let mouseDownTimeout = null;
			  function onDocumentClick(event) {
			    const { target } = event;
			    const root = referenceRef.current;
			    const popupNode = popupRef.current;
			    if (!(root == null ? void 0 : root.contains(target)) && !(popupNode == null ? void 0 : popupNode.contains(target)) && !hasPopupMouseDown) {
			      close();
			    }
			  }
			  function setPopupVisible(visible) {
			    clearDelayTimer();
			    if (visible !== popperShow) {
			      setPopperShow(visible);
			    }
			  }
			  function delaySetPopupVisible(visible, delay) {
			    clearDelayTimer();
			    if (delay) {
			      delayTimer = window.setTimeout(() => {
			        setPopupVisible(visible);
			        clearDelayTimer();
			      }, delay);
			    } else {
			      setPopupVisible(visible);
			    }
			  }
			  function close() {
			    setPopupVisible(false);
			  }
			  function clearDelayTimer() {
			    clearTimeout(delayTimer);
			  }
			  function handleClick(handler) {
			    return (e) => {
			      setPopupVisible(!popperShow);
			      handler && handler(e);
			    };
			  }
			  function handleContextMenu(handler) {
			    return (e) => {
			      setPopupVisible(!popperShow);
			      handler && handler(e);
			    };
			  }
			  function handleTouchStart(handler) {
			    return (e) => {
			      setPopupVisible(!popperShow);
			      handler && handler(e);
			    };
			  }
			  function handleTouchEnd(handler) {
			    return (e) => {
			      delaySetPopupVisible(false, 150);
			      handler && handler(e);
			    };
			  }
			  function handleMouseEnter(handler) {
			    isHoverTrigger = true;
			    return (e) => {
			      setPopupVisible(true);
			      handler && handler(e);
			    };
			  }
			  function handleMouseLeave(handler) {
			    return (e) => {
			      delaySetPopupVisible(false, 150);
			      handler && handler(e);
			    };
			  }
			  function handleFocus(handler) {
			    return (e) => {
			      delaySetPopupVisible(true, 150);
			      handler && handler(e);
			    };
			  }
			  function handleBlur(handler) {
			    return (e) => {
			      delaySetPopupVisible(false, 150);
			      handler && handler(e);
			    };
			  }
			  function onPopupMouseEnter() {
			    isHoverTrigger && clearDelayTimer();
			  }
			  function onPopupMouseLeave() {
			    isHoverTrigger && delaySetPopupVisible(false, 150);
			  }
			  function onPopupMouseDown(e) {
			    hasPopupMouseDown = true;
			    clearTimeout(mouseDownTimeout);
			    mouseDownTimeout = window.setTimeout(() => {
			      hasPopupMouseDown = false;
			    }, 0);
			    if (context && context.onPopupMouseDown) {
			      context.onPopupMouseDown(e);
			    }
			  }
			  function Popper({
			    className,
			    style,
			    placement,
			    modifiers,
			    container,
			    enableArrow = false,
			    children
			  }) {
			    function getContainer() {
			      const popupContainer = document.createElement("div");
			      popupContainer.classList.add("ofa-popper-container");
			      if (enableArrow) {
			        const arrowEle = document.createElement("div");
			        arrowEle.setAttribute("data-popper-arrow", "");
			        popupContainer.append(arrowEle);
			      }
			      attachParent(popupContainer);
			      return popupContainer;
			    }
			    function attachParent(popupContainer) {
			      const parent = container ? container : document.body;
			      parent.appendChild(popupContainer);
			      createPopperInstance(popupContainer);
			    }
			    function createPopperInstance(popupContainer) {
			      referenceRef.current && createPopper(referenceRef.current, popupContainer, {
			        placement: placement || "bottom",
			        modifiers: (modifiers || []).concat(arrowModifier)
			      });
			    }
			    return /* @__PURE__ */ React__default.createElement(PopperContext.Provider, {
			      value: { onPopupMouseDown }
			    }, popperShow ? /* @__PURE__ */ React__default.createElement(Portal, {
			      key: "portal",
			      getContainer
			    }, /* @__PURE__ */ React__default.createElement("div", {
			      ref: popupRef,
			      className,
			      onTouchStartCapture: onPopupMouseDown,
			      onMouseDownCapture: onPopupMouseDown,
			      onMouseLeave: onPopupMouseLeave,
			      onMouseEnter: onPopupMouseEnter,
			      style
			    }, children)) : null);
			  }
			  return useMemo(() => ({
			    referenceRef,
			    handleClick,
			    handleContextMenu,
			    handleTouchStart,
			    handleTouchEnd,
			    handleMouseEnter,
			    handleMouseLeave,
			    handleFocus,
			    handleBlur,
			    Popper,
			    close
			  }), [popperShow]);
			}

			var css$9 = ".ofa-tag {\n  display: inline-block;\n}\n\n.ofa-tag-disabled {\n  cursor: not-allowed;\n  color: rgba(0, 0, 0, 0.2509803922);\n  background: #f5f5f5;\n}\n\n.ofa-tag-delete-icon {\n  cursor: pointer;\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n}";
			n(css$9,{});

			function Tag(props, ref) {
			  const { value, label = "", onDelete, deleteIconSize = 12, modifier, className, style, disabled } = props;
			  return /* @__PURE__ */ React__default.createElement("span", {
			    ref,
			    style,
			    className: cs("ofa-tag", className, {
			      "ofa-tag-disabled": disabled,
			      [`ofa-tag--${modifier}`]: modifier
			    })
			  }, label, onDelete && !disabled && /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-tag-delete-icon",
			    onClick: (e) => onDelete(value, e)
			  }, /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "close",
			    size: deleteIconSize
			  })));
			}
			var Tag$1 = exports('Tag', forwardRef(Tag));

			function SingleSelectTrigger({
			  selectedOption,
			  placeholder
			}) {
			  if (!selectedOption) {
			    return /* @__PURE__ */ React.createElement("span", null, placeholder);
			  }
			  return /* @__PURE__ */ React.createElement("span", null, selectedOption.label);
			}
			function MultipleSelectTrigger({
			  selectedOption,
			  placeholder,
			  onUnselect,
			  disabled
			}) {
			  if (!selectedOption || !selectedOption.length) {
			    return /* @__PURE__ */ React.createElement("span", null, placeholder);
			  }
			  return /* @__PURE__ */ React.createElement(React.Fragment, null, selectedOption.map(({ value, label }) => {
			    return /* @__PURE__ */ React.createElement(Tag$1, {
			      style: { marginRight: "5px" },
			      key: value,
			      disabled,
			      value,
			      label,
			      onDelete: (id, e) => {
			        e.stopPropagation();
			        onUnselect(id);
			      }
			    });
			  }));
			}

			var css$8 = ".ofa-trigger {\n  display: flex;\n  gap: 4px;\n}\n\n.ofa-select-options {\n  min-width: 90px;\n  max-width: 500px;\n  max-height: 300px;\n  box-shadow: 0px 8px 24px 4px rgba(148, 163, 184, 0.25);\n  padding: 16px 0;\n  background-color: #fff;\n  overflow-y: auto;\n}\n\n.ofa-select-option {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 16px;\n  height: 36px;\n  cursor: pointer;\n  user-select: none;\n  font-weight: 500;\n}\n.ofa-select-option:hover {\n  background-color: #f1f5f9;\n}\n\n.ofa-select-option-active {\n  color: #375ff3;\n}\n\n.ofa-select-option-label {\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  min-width: 0px;\n}\n\n.ofa-select-trigger {\n  min-width: 90px;\n  max-width: 500px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  height: 32px;\n  padding: 0 16px;\n  cursor: pointer;\n  user-select: none;\n  position: relative;\n  background-color: #fff;\n  border: 1px solid #d9d9d9;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n}\n\n.ofa-select-trigger-active {\n  border-color: #375ff3;\n}\n\n.ofa-select-trigger-disabled {\n  cursor: not-allowed;\n  color: rgba(0, 0, 0, 0.2509803922);\n  background: #f5f5f5;\n}";
			n(css$8,{});

			var __defProp$g = Object.defineProperty;
			var __defProps$5 = Object.defineProperties;
			var __getOwnPropDescs$5 = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$i = Object.getOwnPropertySymbols;
			var __hasOwnProp$i = Object.prototype.hasOwnProperty;
			var __propIsEnum$i = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$g = (obj, key, value) => key in obj ? __defProp$g(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$g = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$i.call(b, prop))
			      __defNormalProp$g(a, prop, b[prop]);
			  if (__getOwnPropSymbols$i)
			    for (var prop of __getOwnPropSymbols$i(b)) {
			      if (__propIsEnum$i.call(b, prop))
			        __defNormalProp$g(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps$5 = (a, b) => __defProps$5(a, __getOwnPropDescs$5(b));
			const DEFAULT_PLACEHOLDER = "\u8BF7\u9009\u62E9";
			const modifiers = [
			  {
			    name: "offset",
			    options: {
			      offset: [0, 4]
			    }
			  }
			];
			function Select(props) {
			  const [selectedValue, setSelectedValue] = useState(props.value || props.defaultValue);
			  const [triggerActive, setTriggerActive] = useState(false);
			  const [selectedOption, setSelectedOption] = useState(Array.isArray(selectedValue) ? props.options.filter(({ value }) => {
			    return selectedValue.includes(value);
			  }) : props.options.find(({ value }) => value === selectedValue));
			  const triggerContentRef = useRef(null);
			  useEffect(() => {
			    setSelectedValue(props.value);
			  }, [props.value]);
			  useEffect(() => {
			    const { options } = props;
			    let _selectedOption = void 0;
			    if (selectedValue && Array.isArray(selectedValue)) {
			      _selectedOption = options.filter((option) => {
			        return selectedValue.includes(option.value);
			      });
			    }
			    if (selectedValue && !Array.isArray(selectedValue)) {
			      _selectedOption = options.find((option) => {
			        return selectedValue === option.value;
			      });
			    }
			    setSelectedOption(_selectedOption);
			  }, [selectedValue, props.options]);
			  const { children, triggerRender, name, inputRef, style, className, disabled, id } = props;
			  function handleVisibleChange(visible) {
			    setTriggerActive(visible);
			  }
			  const { referenceRef, Popper, handleClick: handlePopperClick, close } = usePopper(handleVisibleChange);
			  function getTriggerWidth() {
			    var _a, _b;
			    const rects = (_b = (_a = triggerContentRef.current) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.getClientRects();
			    if (!rects || !rects.length) {
			      return 150;
			    }
			    return Array.from(rects)[0].width;
			  }
			  function renderOptions() {
			    const { options, optionsDesc, optionClassName } = props;
			    return /* @__PURE__ */ React__default.createElement("div", {
			      className: `${optionClassName} ofa-select-options`,
			      style: { width: `${getTriggerWidth()}px` }
			    }, optionsDesc && /* @__PURE__ */ React__default.createElement("p", {
			      className: "ofa-select-options-desc"
			    }, optionsDesc), options.map((option) => {
			      const isSelected = Array.isArray(selectedValue) ? selectedValue.includes(option.value) : selectedValue === option.value;
			      return /* @__PURE__ */ React__default.createElement("div", {
			        key: option.value,
			        onClick: () => handleClick(option.value),
			        className: cs("ofa-select-option", { "ofa-select-option-active": isSelected })
			      }, /* @__PURE__ */ React__default.createElement("div", {
			        className: "ofa-select-option-label"
			      }, option.label), isSelected && /* @__PURE__ */ React__default.createElement(Icon, {
			        name: "check",
			        className: "text-current"
			      }));
			    }));
			  }
			  function renderCustomTrigger() {
			    const { triggerRender: triggerRender2 } = props;
			    if (!triggerRender2) {
			      return null;
			    }
			    if (Array.isArray(selectedOption)) {
			      return triggerRender2({
			        selectedOption,
			        triggerActive
			      });
			    }
			    return triggerRender2({
			      selectedOption,
			      triggerActive
			    });
			  }
			  function handleClick(value) {
			    var _a, _b, _c;
			    if (!props.multiple) {
			      (_a = props.onChange) == null ? void 0 : _a.call(props, value);
			      setSelectedValue(value);
			      close();
			      return;
			    }
			    if (selectedValue === void 0) {
			      setSelectedValue([value]);
			      (_b = props.onChange) == null ? void 0 : _b.call(props, [value]);
			      return;
			    }
			    const _selectedValue = selectedValue.includes(value) ? selectedValue.filter((_value) => {
			      return _value !== value;
			    }) : [...selectedValue, value];
			    setSelectedValue(_selectedValue);
			    (_c = props.onChange) == null ? void 0 : _c.call(props, _selectedValue);
			  }
			  function renderDefaultTrigger() {
			    const { placeholder = DEFAULT_PLACEHOLDER } = props;
			    if (Array.isArray(selectedOption)) {
			      return /* @__PURE__ */ React__default.createElement(MultipleSelectTrigger, {
			        selectedOption,
			        disabled,
			        placeholder,
			        onUnselect: (value) => {
			          handleClick(value);
			        }
			      });
			    }
			    return /* @__PURE__ */ React__default.createElement(SingleSelectTrigger, {
			      selectedOption,
			      placeholder
			    });
			  }
			  const arrowStyle = triggerActive ? {
			    transform: "rotate(180deg)"
			  } : void 0;
			  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, children ? React__default.cloneElement(children, { ref: referenceRef }) : /* @__PURE__ */ React__default.createElement("div", __spreadProps$5(__spreadValues$g({}, disabled ? {} : { onClick: handlePopperClick() }), {
			    ref: referenceRef,
			    style,
			    className: cs("ofa-select-trigger", className, {
			      "ofa-select-trigger-active": triggerActive && !disabled,
			      "ofa-select-trigger-disabled": disabled
			    })
			  }), name && /* @__PURE__ */ React__default.createElement("input", {
			    id,
			    type: "hidden",
			    name,
			    ref: inputRef,
			    defaultValue: selectedValue
			  }), /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-trigger-content",
			    ref: triggerContentRef
			  }, triggerRender ? renderCustomTrigger() : renderDefaultTrigger()), /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "keyboard_arrow_down",
			    style: arrowStyle,
			    className: "trigger-arrow-icon"
			  })), /* @__PURE__ */ React__default.createElement(Popper, {
			    placement: "bottom-start",
			    modifiers
			  }, renderOptions()));
			}

			function Pager({ page, active, onClick }) {
			  return /* @__PURE__ */ React__default.createElement("li", {
			    onClick,
			    className: cs("ofa-pagination-page-item", { "ofa-pagination-current-page": active })
			  }, page);
			}

			var css$7 = ".ofa-pagination {\n  display: flex;\n  list-style-type: none;\n  gap: 8px;\n  align-items: center;\n}\n\n.ofa-pagination-select-wrapper {\n  display: flex;\n  align-items: center;\n  column-gap: 8px;\n}\n\n.ofa-pagination-disabled {\n  color: gray;\n}\n\n.ofa-pagination-current-page {\n  color: blue;\n}\n\n.ofa-pagination-quick-jumper {\n  display: flex;\n  column-gap: 8px;\n}\n\n.ofa-pagination-quick-jumper-input {\n  width: 50px;\n}";
			n(css$7,{});

			var __defProp$f = Object.defineProperty;
			var __defProps$4 = Object.defineProperties;
			var __getOwnPropDescs$4 = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$h = Object.getOwnPropertySymbols;
			var __hasOwnProp$h = Object.prototype.hasOwnProperty;
			var __propIsEnum$h = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$f = (obj, key, value) => key in obj ? __defProp$f(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$f = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$h.call(b, prop))
			      __defNormalProp$f(a, prop, b[prop]);
			  if (__getOwnPropSymbols$h)
			    for (var prop of __getOwnPropSymbols$h(b)) {
			      if (__propIsEnum$h.call(b, prop))
			        __defNormalProp$f(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps$4 = (a, b) => __defProps$4(a, __getOwnPropDescs$4(b));
			function Pagination({
			  current = 1,
			  total = 0,
			  pageSize = 10,
			  pageSizeOptions = [10, 20, 50, 100],
			  renderTotalTip,
			  showSizeChanger = true,
			  showQuickJumper,
			  showLessItems,
			  onChange,
			  style,
			  className
			}, ref) {
			  const [pageParams, setPageParams] = React__default.useState({
			    current: current || 0,
			    _current: "",
			    pageSize: 10
			  });
			  useEffect(() => {
			    setPageParams((params) => __spreadProps$4(__spreadValues$f({}, params), { current, pageSize: pageSize || params.pageSize }));
			  }, [pageSize, current]);
			  function calcPage(p) {
			    let pageSizes = p;
			    if (typeof pageSizes === "undefined") {
			      pageSizes = pageParams.pageSize;
			    }
			    return Math.floor((total - 1) / pageSizes) + 1;
			  }
			  function isValid(page) {
			    return typeof page === "number" && page >= 1 && page !== pageParams.current;
			  }
			  function handleChange(p) {
			    let page = p;
			    if (isValid(page)) {
			      if (page > calcPage()) {
			        page = calcPage();
			      }
			    }
			    setPageParams({
			      current: page,
			      pageSize: pageParams.pageSize,
			      _current: ""
			    });
			    onChange && onChange(page, pageParams.pageSize);
			    return pageParams.current;
			  }
			  function changePageSize(size) {
			    setPageParams({
			      current: 1,
			      pageSize: size,
			      _current: ""
			    });
			    onChange && onChange(1, size);
			  }
			  function handleInputOnblur() {
			    const isNumber = pageParams._current !== "" && !isNaN(Number(pageParams._current));
			    if (isNumber) {
			      handleChange(Number(pageParams._current));
			    }
			  }
			  function handleInputKeydown(e) {
			    if (e.key !== "Enter") {
			      return;
			    }
			    handleInputOnblur();
			  }
			  function handPrev() {
			    if (hasPrev()) {
			      handleChange(pageParams.current - 1);
			    }
			  }
			  function handleNext() {
			    if (hasNext()) {
			      handleChange(pageParams.current + 1);
			    }
			  }
			  function handleJumpPrev() {
			    handleChange(Math.max(1, pageParams.current - 5));
			  }
			  function handleJumpNext() {
			    handleChange(Math.min(calcPage(), pageParams.current + 5));
			  }
			  function hasPrev() {
			    return pageParams.current > 1;
			  }
			  function hasNext() {
			    return pageParams.current < calcPage();
			  }
			  function handleInputChange(value) {
			    setPageParams({
			      pageSize: pageParams.pageSize,
			      current: pageParams.current,
			      _current: value
			    });
			  }
			  const prevIcon = /* @__PURE__ */ React__default.createElement("li", {
			    className: cs("ofa-pagination-prev", {
			      "ofa-pagination-disabled": pageParams.current === 1
			    }),
			    onClick: handPrev
			  }, /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "chevron_left"
			  }));
			  const nextIcon = /* @__PURE__ */ React__default.createElement("li", {
			    className: cs("ofa-pagination-next", {
			      "ofa-pagination-disabled": pageParams.current === calcPage()
			    }),
			    onClick: handleNext
			  }, /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "chevron_right"
			  }));
			  const allPages = calcPage();
			  const pagerList = [];
			  let firstPager = null;
			  let lastPager = null;
			  let jumpPrev = null;
			  let jumpNext = null;
			  let totalText = null;
			  let pageSizeText = null;
			  let quickJumperText = null;
			  if (allPages <= 9) {
			    for (let i = 1; i <= allPages; i += 1) {
			      const active = pageParams.current === i;
			      pagerList.push(/* @__PURE__ */ React__default.createElement(Pager, {
			        key: i,
			        page: i,
			        active,
			        onClick: () => handleChange(i)
			      }));
			    }
			  } else {
			    lastPager = /* @__PURE__ */ React__default.createElement(Pager, {
			      key: allPages,
			      page: allPages,
			      active: false,
			      onClick: () => handleChange(allPages)
			    });
			    firstPager = /* @__PURE__ */ React__default.createElement(Pager, {
			      key: 1,
			      page: 1,
			      active: false,
			      onClick: () => handleChange(1)
			    });
			    jumpPrev = /* @__PURE__ */ React__default.createElement("li", {
			      key: "jumpPrev",
			      className: "ofa-pagination-page ofa-pagination-jump ofa-pagination-jump-prev",
			      onClick: handleJumpPrev
			    }, /* @__PURE__ */ React__default.createElement(Icon, {
			      className: "icon",
			      name: "more_horiz"
			    }), /* @__PURE__ */ React__default.createElement(Icon, {
			      className: "prev",
			      name: "double_arrow"
			    }));
			    jumpNext = /* @__PURE__ */ React__default.createElement("li", {
			      key: "jumpNext",
			      className: "ofa-pagination-page ofa-pagination-jump ofa-pagination-jump-next",
			      onClick: handleJumpNext
			    }, /* @__PURE__ */ React__default.createElement(Icon, {
			      className: "icon",
			      name: "more_horiz"
			    }), /* @__PURE__ */ React__default.createElement(Icon, {
			      className: "next",
			      name: "double_arrow"
			    }));
			    const num = showLessItems ? 2 : 4;
			    const secondNum = showLessItems ? 3 : 4;
			    const _current = pageParams.current;
			    let left = Math.max(1, _current - num / 2);
			    let right = Math.min(_current + num / 2, allPages);
			    if (_current - 1 <= num / 2) {
			      right = 1 + num;
			    }
			    if (allPages - _current <= num / 2) {
			      left = allPages - num;
			    }
			    for (let i = left; i <= right; i += 1) {
			      const active = _current === i;
			      pagerList.push(/* @__PURE__ */ React__default.createElement(Pager, {
			        key: i,
			        page: i,
			        active,
			        onClick: () => handleChange(i)
			      }));
			    }
			    if (_current - 1 >= secondNum) {
			      pagerList.unshift(jumpPrev);
			    }
			    if (allPages - _current >= secondNum) {
			      pagerList.push(jumpNext);
			    }
			    if (left !== 1) {
			      pagerList.unshift(firstPager);
			    }
			    if (right !== allPages) {
			      pagerList.push(lastPager);
			    }
			  }
			  if (renderTotalTip) {
			    totalText = /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, renderTotalTip(allPages));
			  }
			  if (showSizeChanger && total <= 50 || total > 50) {
			    pageSizeText = /* @__PURE__ */ React__default.createElement("li", {
			      className: "ofa-pagination-select-wrapper"
			    }, /* @__PURE__ */ React__default.createElement("div", null, "\u6BCF\u9875"), /* @__PURE__ */ React__default.createElement(Select, {
			      value: pageParams.pageSize,
			      onChange: changePageSize,
			      options: pageSizeOptions ? pageSizeOptions.map((page) => ({
			        label: `${page} \u6761`,
			        value: page
			      })) : []
			    }));
			  }
			  if (showQuickJumper) {
			    quickJumperText = /* @__PURE__ */ React__default.createElement("li", {
			      className: "ofa-pagination-quick-jumper"
			    }, /* @__PURE__ */ React__default.createElement("div", null, "\u8DF3\u81F3"), /* @__PURE__ */ React__default.createElement(Input$1, {
			      className: "ofa-pagination-quick-jumper-input",
			      value: pageParams._current,
			      onChange: handleInputChange,
			      onBlur: handleInputOnblur,
			      onKeyDown: handleInputKeydown
			    }), /* @__PURE__ */ React__default.createElement("div", null, "\u9875"));
			  }
			  return /* @__PURE__ */ React__default.createElement("ul", {
			    ref,
			    className: cs("ofa-pagination", className),
			    style
			  }, /* @__PURE__ */ React__default.createElement("li", {
			    className: "ofa-pagination-total"
			  }, totalText || `\u5171 ${total} \u6761\u6570\u636E`), prevIcon, pagerList, nextIcon, pageSizeText, quickJumperText);
			}
			var index$3 = exports('Pagination', forwardRef(Pagination));

			var GroupContext = React__default.createContext(null);

			var __getOwnPropSymbols$g = Object.getOwnPropertySymbols;
			var __hasOwnProp$g = Object.prototype.hasOwnProperty;
			var __propIsEnum$g = Object.prototype.propertyIsEnumerable;
			var __objRest$7 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$g.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$g)
			    for (var prop of __getOwnPropSymbols$g(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$g.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function InternalRadio(_a, ref) {
			  var _b = _a, { className, style, label, error, onChange } = _b, restProps = __objRest$7(_b, ["className", "style", "label", "error", "onChange"]);
			  const groupContext = useContext(GroupContext);
			  const [name, setName] = useState();
			  const [disabled, setDisabled] = useState(!!restProps.disabled);
			  const [checked, setChecked] = useState(!!restProps.checked);
			  const rootRef = useRef(null);
			  const inputRef = useRef(null);
			  useImperativeHandle(ref, () => {
			    if (rootRef.current && inputRef.current) {
			      rootRef.current.inputInstance = inputRef.current;
			    }
			    return rootRef.current;
			  });
			  useEffect(() => {
			    setName(groupContext == null ? void 0 : groupContext.name);
			  }, [groupContext == null ? void 0 : groupContext.name]);
			  useEffect(() => {
			    let checked2 = !!restProps.checked;
			    if (groupContext == null ? void 0 : groupContext.value) {
			      checked2 = groupContext.value === restProps.value;
			    }
			    setChecked(checked2);
			  }, [restProps.value, groupContext == null ? void 0 : groupContext.value]);
			  useEffect(() => {
			    setDisabled(restProps.disabled || !!(groupContext == null ? void 0 : groupContext.disabled));
			  }, [restProps.disabled, groupContext == null ? void 0 : groupContext.disabled]);
			  function handleChange(checked2, e) {
			    if (disabled) {
			      return;
			    }
			    setChecked(checked2);
			    groupContext && groupContext.onChange(restProps.value);
			    onChange && onChange(restProps.value, e);
			  }
			  return /* @__PURE__ */ React__default.createElement("label", {
			    ref: rootRef,
			    style,
			    className: cs("ofa-radio-wrapper", {
			      "ofa-radio-wrapper__checked": checked,
			      "ofa-radio-wrapper__disabled": disabled,
			      "ofa-radio-wrapper__error": error
			    }, className)
			  }, /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-radio-item"
			  }, /* @__PURE__ */ React__default.createElement("input", {
			    ref: inputRef,
			    type: "radio",
			    style: { display: "none" },
			    checked,
			    name,
			    value: restProps.value,
			    disabled,
			    onChange: (e) => {
			      const { checked: checked2 } = e.target;
			      handleChange(checked2, e);
			    }
			  }), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-radio-icon"
			  })), label && /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-radio-label"
			  }, label));
			}
			const Radio = exports('Radio', forwardRef(InternalRadio));

			var __getOwnPropSymbols$f = Object.getOwnPropertySymbols;
			var __hasOwnProp$f = Object.prototype.hasOwnProperty;
			var __propIsEnum$f = Object.prototype.propertyIsEnumerable;
			var __objRest$6 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$f.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$f)
			    for (var prop of __getOwnPropSymbols$f(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$f.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function InternalRadioGroup(_a, ref) {
			  var _b = _a, {
			    className,
			    style,
			    options = [],
			    children,
			    disabled,
			    onChange,
			    name
			  } = _b, restProps = __objRest$6(_b, [
			    "className",
			    "style",
			    "options",
			    "children",
			    "disabled",
			    "onChange",
			    "name"
			  ]);
			  const [value, setValue] = useState(restProps.value);
			  useEffect(() => {
			    setValue(restProps.value);
			  }, [restProps.value]);
			  const onRadioChange = (val) => {
			    const lastValue = value;
			    setValue(val);
			    if (onChange && val !== lastValue) {
			      onChange(val);
			    }
			  };
			  const getOptions = () => options.map((option) => {
			    if (typeof option === "string") {
			      return {
			        label: option,
			        value: option
			      };
			    }
			    return option;
			  });
			  let child = children;
			  if (options && options.length > 0) {
			    child = getOptions().map((option) => /* @__PURE__ */ React__default.createElement(Radio, {
			      key: option.value.toString(),
			      disabled: option.disabled || disabled,
			      label: option.label,
			      value: option.value,
			      checked: value === option.value,
			      onChange: option.onChange
			    }));
			  }
			  const context = {
			    value,
			    disabled: !!disabled,
			    name,
			    onChange: onRadioChange
			  };
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: cs({ "radio-group-wrapper__disbaled": disabled }, className),
			    style,
			    ref
			  }, /* @__PURE__ */ React__default.createElement(GroupContext.Provider, {
			    value: context
			  }, child));
			}
			const RadioGroup = forwardRef(InternalRadioGroup);
			var group = exports('RadioGroup', memo(RadioGroup));

			var css$6 = ".ofa-radio-wrapper {\n  background-color: white;\n  cursor: pointer;\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n\n.ofa-radio-icon {\n  position: relative;\n  transition: all 0.24s;\n  border-radius: 9999px;\n  border: 1px solid gray;\n  box-sizing: border-box;\n  position: relative;\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n}\n\n.ofa-radio-icon::after {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  display: block;\n  width: 16px;\n  height: 16px;\n  margin-top: -8px;\n  margin-left: -8px;\n  background-color: blue;\n  border-top: 0;\n  border-left: 0;\n  border-radius: 16px;\n  transform: scale(0);\n  opacity: 0;\n  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);\n  content: \" \";\n}\n\n.ofa-radio-item {\n  display: flex;\n}\n\n.ofa-radio-wrapper__checked .ofa-radio-icon {\n  border-color: blue;\n}\n.ofa-radio-wrapper__checked .ofa-radio-icon::after {\n  transform: scale(0.5);\n  opacity: 1;\n  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n\n.ofa-radio-wrapper__disabled,\n.ofa-radio-wrapper__checked.ofa-radio-wrapper__disabled {\n  cursor: no-drop;\n}\n.ofa-radio-wrapper__disabled .ofa-radio-icon,\n.ofa-radio-wrapper__checked.ofa-radio-wrapper__disabled .ofa-radio-icon {\n  border-color: #d9d9d9;\n}\n.ofa-radio-wrapper__disabled .ofa-radio-icon::after,\n.ofa-radio-wrapper__checked.ofa-radio-wrapper__disabled .ofa-radio-icon::after {\n  background-color: rgba(0, 0, 0, 0.2);\n}\n\n.ofa-radio-wrapper__disabled .ofa-radio-label {\n  color: rgba(0, 0, 0, 0.2509803922);\n}";
			n(css$6,{});

			var css$5 = ".ofa-switch {\n  height: 24px;\n  cursor: pointer;\n  min-width: 40px;\n  position: relative;\n  line-height: 24px;\n  user-select: none;\n  border-radius: 16px;\n  display: inline-block;\n  transition: all 0.16s linear;\n  background-color: #cbd5e1;\n}\n\n.ofa-switch:after {\n  position: absolute;\n  left: 4px;\n  top: 50%;\n  content: '';\n  width: 16px;\n  height: 16px;\n  border-radius: 8px;\n  background-color: #fff;\n  transition: all 0.16s linear;\n  transform: translateY(-50%);\n  box-shadow: 0 1px 2px 0 rgba(50, 69, 88, 0.08);\n}\n\n.ofa-switch:active:after {\n  width: 24px;\n}\n\n.ofa-switch:active {\n  background-color: #819aea;\n}\n\n.ofa-switch-disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n}\n\n.ofa-switch-disabled:before {\n  content: '';\n  height: 24px;\n  min-width: 44px;\n  line-height: 20px;\n  position: absolute;\n  pointer-events: none;\n}\n\n.ofa-switch-disabled:after {\n  cursor: not-allowed;\n  pointer-events: none;\n}\n\n.ofa-switch-disabled:active:after {\n  width: 18px;\n}\n\n.ofa-switch-checked {\n  background-color: #375ff3;\n}\n\n.ofa-switch-checked:after {\n  left: calc(100% - 20px);\n}\n\n.ofa-switch-checked:active:after {\n  left: calc(100% - 28px);\n}\n\n.ofa-switch-text {\n  color: #fff;\n  display: block;\n  font-size: 14px;\n  min-width: 10px;\n  line-height: 24px;\n  margin-right: 6px;\n  margin-left: 24px;\n  transition: all 0.16s linear;\n}\n\n.ofa-switch-text-checked {\n  margin-left: 6px;\n  margin-right: 24px;\n}\n";
			n(css$5,{});

			function Switch({ onChange, className, style, onText = "", offText = "", disabled = false, checked = false }, ref) {
			  const [switcChecked, setSwitchChecked] = useState(checked);
			  const handleToggleSwitch = () => {
			    if (disabled) {
			      return;
			    }
			    setSwitchChecked(!switcChecked);
			    onChange && onChange(!switcChecked);
			  };
			  return /* @__PURE__ */ React__default.createElement("label", {
			    className: cs("ofa-switch", className, {
			      "ofa-switch-disabled": disabled,
			      "ofa-switch-checked": switcChecked
			    }),
			    style,
			    onClick: handleToggleSwitch,
			    ref
			  }, /* @__PURE__ */ React__default.createElement("span", {
			    className: cs("ofa-switch-text", {
			      "ofa-switch-text-checked": switcChecked
			    })
			  }, checked ? onText : offText));
			}
			var index$2 = exports('Switch', forwardRef(Switch));

			function TabNavs({ navs, className, navsClassName, currentKey, onClick, style }, ref) {
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-tab-navs-wrapper"
			  }, " ", /* @__PURE__ */ React__default.createElement("div", {
			    ref,
			    style,
			    className: cs("ofa-tab-navs", className)
			  }, navs.map((item) => {
			    const active = item.id === currentKey;
			    return /* @__PURE__ */ React__default.createElement("div", {
			      key: item.id,
			      onClick: () => onClick == null ? void 0 : onClick(item),
			      className: cs("ofa-tab-nav-item", {
			        "ofa-tab-nav-disabled": item.disabled,
			        [`ofa-tab-nav-active`]: active,
			        [`tab-nav__${item.state}`]: item.state
			      }, navsClassName)
			    }, item.name);
			  })));
			}
			var TabNavs$1 = forwardRef(TabNavs);

			var css$4 = ".ofa-tab-direction__vertical {\n  display: flex;\n}\n\n.ofa-tab-direction__horizon .ofa-tab-navs {\n  display: flex;\n  gap: 5px;\n}\n\n.ofa-tab-nav-item {\n  cursor: pointer;\n}\n\n.ofa-tab-nav-disabled {\n  cursor: no-drop;\n}\n";
			n(css$4,{});

			var __defProp$e = Object.defineProperty;
			var __getOwnPropSymbols$e = Object.getOwnPropertySymbols;
			var __hasOwnProp$e = Object.prototype.hasOwnProperty;
			var __propIsEnum$e = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$e = (obj, key, value) => key in obj ? __defProp$e(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$e = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$e.call(b, prop))
			      __defNormalProp$e(a, prop, b[prop]);
			  if (__getOwnPropSymbols$e)
			    for (var prop of __getOwnPropSymbols$e(b)) {
			      if (__propIsEnum$e.call(b, prop))
			        __defNormalProp$e(a, prop, b[prop]);
			    }
			  return a;
			};
			function Tab({
			  items,
			  style,
			  className,
			  direction = "horizon",
			  maxHeight,
			  navsClassName,
			  currentKey,
			  onChange
			}) {
			  const navsRef = useRef(null);
			  const [key, setKey] = useState(currentKey || items[0].id);
			  useEffect(() => {
			    setKey(currentKey || items[0].id);
			  }, [currentKey]);
			  return /* @__PURE__ */ React__default.createElement("div", {
			    style: __spreadValues$e({ maxHeight }, style),
			    className: cs("ofa-tab-wrapper", {
			      [`ofa-tab-direction__${direction}`]: direction
			    }, className)
			  }, /* @__PURE__ */ React__default.createElement(TabNavs$1, {
			    ref: navsRef,
			    navs: items,
			    currentKey: key,
			    navsClassName,
			    onClick: ({ id, disabled }) => {
			      if (disabled)
			        return;
			      setKey(id);
			      onChange == null ? void 0 : onChange(id);
			    }
			  }));
			}

			var reactTable = {exports: {}};

			var reactTable_production_min = {exports: {}};

			(function (module, exports) {
			!function(e,t){t(exports,React__default);}(commonjsGlobal,(function(e,t){function n(e,t,n,o,r,i,u){try{var l=e[i](u),s=l.value;}catch(e){return void n(e)}l.done?t(s):Promise.resolve(s).then(o,r);}function o(e){return function(){var t=this,o=arguments;return new Promise((function(r,i){var u=e.apply(t,o);function l(e){n(u,r,i,l,s,"next",e);}function s(e){n(u,r,i,l,s,"throw",e);}l(void 0);}))}}function r(){return (r=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(e[o]=n[o]);}return e}).apply(this,arguments)}function i(e,t){if(null==e)return {};var n,o,r={},i=Object.keys(e);for(o=0;o<i.length;o++)n=i[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}function u(e){var t=function(e,t){if("object"!=typeof e||null===e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,t||"default");if("object"!=typeof o)return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return ("string"===t?String:Number)(e)}(e,"string");return "symbol"==typeof t?t:String(t)}t=t&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t;var l={init:"init"},s=function(e){var t=e.value;return void 0===t?"":t},a=function(){return t.createElement(t.Fragment,null," ")},c={Cell:s,width:150,minWidth:0,maxWidth:Number.MAX_SAFE_INTEGER};function d(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return t.reduce((function(e,t){var n=t.style,o=t.className;return e=r({},e,{},i(t,["style","className"])),n&&(e.style=e.style?r({},e.style||{},{},n||{}):n),o&&(e.className=e.className?e.className+" "+o:o),""===e.className&&delete e.className,e}),{})}var f=function(e,t){return void 0===t&&(t={}),function(n){return void 0===n&&(n={}),[].concat(e,[n]).reduce((function(e,o){return function e(t,n,o){return "function"==typeof n?e({},n(t,o)):Array.isArray(n)?d.apply(void 0,[t].concat(n)):d(t,n)}(e,o,r({},t,{userProps:n}))}),{})}},p=function(e,t,n,o){return void 0===n&&(n={}),e.reduce((function(e,t){return t(e,n)}),t)},g=function(e,t,n){return void 0===n&&(n={}),e.forEach((function(e){e(t,n);}))};function v(e,t,n,o){e.findIndex((function(e){return e.pluginName===n}));t.forEach((function(t){e.findIndex((function(e){return e.pluginName===t}));}));}function m(e,t){return "function"==typeof e?e(t):e}function h(e){var n=t.useRef();return n.current=e,t.useCallback((function(){return n.current}),[])}var y="undefined"!=typeof document?t.useLayoutEffect:t.useEffect;function w(e,n){var o=t.useRef(!1);y((function(){o.current&&e(),o.current=!0;}),n);}function R(e,t,n){return void 0===n&&(n={}),function(o,i){void 0===i&&(i={});var u="string"==typeof o?t[o]:o;if(void 0===u)throw console.info(t),new Error("Renderer Error ☝️");return b(u,r({},e,{column:t},n,{},i))}}function b(e,n){return function(e){return "function"==typeof e&&((t=Object.getPrototypeOf(e)).prototype&&t.prototype.isReactComponent);var t;}(o=e)||"function"==typeof o||function(e){return "object"==typeof e&&"symbol"==typeof e.$$typeof&&["react.memo","react.forward_ref"].includes(e.$$typeof.description)}(o)?t.createElement(e,n):e;var o;}function S(e,t,n){return void 0===n&&(n=0),e.map((function(e){return x(e=r({},e,{parent:t,depth:n})),e.columns&&(e.columns=S(e.columns,e,n+1)),e}))}function C(e){return G(e,"columns")}function x(e){var t=e.id,n=e.accessor,o=e.Header;if("string"==typeof n){t=t||n;var r=n.split(".");n=function(e){return function(e,t,n){if(!t)return e;var o,r="function"==typeof t?t:JSON.stringify(t),i=E.get(r)||function(){var e=function(e){return function e(t,n){void 0===n&&(n=[]);if(Array.isArray(t))for(var o=0;o<t.length;o+=1)e(t[o],n);else n.push(t);return n}(e).map((function(e){return String(e).replace(".","_")})).join(".").replace(W,".").replace(O,"").split(".")}(t);return E.set(r,e),e}();try{o=i.reduce((function(e,t){return e[t]}),e);}catch(e){}return void 0!==o?o:n}(e,r)};}if(!t&&"string"==typeof o&&o&&(t=o),!t&&e.columns)throw console.error(e),new Error('A column ID (or unique "Header" value) is required!');if(!t)throw console.error(e),new Error("A column ID (or string accessor) is required!");return Object.assign(e,{id:t,accessor:n}),e}function P(e,t){if(!t)throw new Error;return Object.assign(e,r({Header:a,Footer:a},c,{},t,{},e)),Object.assign(e,{originalWidth:e.width}),e}function B(e,t,n){void 0===n&&(n=function(){return {}});for(var o=[],i=e,u=0,l=function(){return u++},s=function(){var e={headers:[]},u=[],s=i.some((function(e){return e.parent}));i.forEach((function(o){var i,a=[].concat(u).reverse()[0];if(s){if(o.parent)i=r({},o.parent,{originalId:o.parent.id,id:o.parent.id+"_"+l(),headers:[o]},n(o));else i=P(r({originalId:o.id+"_placeholder",id:o.id+"_placeholder_"+l(),placeholderOf:o,headers:[o]},n(o)),t);a&&a.originalId===i.originalId?a.headers.push(o):u.push(i);}e.headers.push(o);})),o.push(e),i=u;};i.length;)s();return o.reverse()}var E=new Map;function I(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];for(var o=0;o<t.length;o+=1)if(void 0!==t[o])return t[o]}function F(e){if("function"==typeof e)return e}function G(e,t){var n=[];return function e(o){o.forEach((function(o){o[t]?e(o[t]):n.push(o);}));}(e),n}function A(e,t){var n=t.manualExpandedKey,o=t.expanded,r=t.expandSubRows,i=void 0===r||r,u=[];return e.forEach((function(e){return function e(t,r){void 0===r&&(r=!0),t.isExpanded=t.original&&t.original[n]||o[t.id],t.canExpand=t.subRows&&!!t.subRows.length,r&&u.push(t),t.subRows&&t.subRows.length&&t.isExpanded&&t.subRows.forEach((function(t){return e(t,i)}));}(e)})),u}function k(e,t,n){return F(e)||t[e]||n[e]||n.text}function H(e,t,n){return e?e(t,n):void 0===t}function T(){throw new Error("React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.")}var z=null;var W=/\[/g,O=/\]/g;var M=function(e){return r({role:"table"},e)},j=function(e){return r({role:"rowgroup"},e)},N=function(e,t){var n=t.column;return r({key:"header_"+n.id,colSpan:n.totalVisibleHeaderCount,role:"columnheader"},e)},L=function(e,t){var n=t.column;return r({key:"footer_"+n.id,colSpan:n.totalVisibleHeaderCount},e)},D=function(e,t){return r({key:"headerGroup_"+t.index,role:"row"},e)},V=function(e,t){return r({key:"footerGroup_"+t.index},e)},_=function(e,t){return r({key:"row_"+t.row.id,role:"row"},e)},X=function(e,t){var n=t.cell;return r({key:"cell_"+n.row.id+"_"+n.column.id,role:"cell"},e)};function q(){return {useOptions:[],stateReducers:[],useControlledState:[],columns:[],columnsDeps:[],allColumns:[],allColumnsDeps:[],accessValue:[],materializedColumns:[],materializedColumnsDeps:[],useInstanceAfterData:[],visibleColumns:[],visibleColumnsDeps:[],headerGroups:[],headerGroupsDeps:[],useInstanceBeforeDimensions:[],useInstance:[],prepareRow:[],getTableProps:[M],getTableBodyProps:[j],getHeaderGroupProps:[D],getFooterGroupProps:[V],getHeaderProps:[N],getFooterProps:[L],getRowProps:[_],getCellProps:[X],useFinalInstance:[]}}l.resetHiddenColumns="resetHiddenColumns",l.toggleHideColumn="toggleHideColumn",l.setHiddenColumns="setHiddenColumns",l.toggleHideAllColumns="toggleHideAllColumns";var K=function(e){e.getToggleHiddenProps=[U],e.getToggleHideAllColumnsProps=[$],e.stateReducers.push(J),e.useInstanceBeforeDimensions.push(Y),e.headerGroupsDeps.push((function(e,t){var n=t.instance;return [].concat(e,[n.state.hiddenColumns])})),e.useInstance.push(Q);};K.pluginName="useColumnVisibility";var U=function(e,t){var n=t.column;return [e,{onChange:function(e){n.toggleHidden(!e.target.checked);},style:{cursor:"pointer"},checked:n.isVisible,title:"Toggle Column Visible"}]},$=function(e,t){var n=t.instance;return [e,{onChange:function(e){n.toggleHideAllColumns(!e.target.checked);},style:{cursor:"pointer"},checked:!n.allColumnsHidden&&!n.state.hiddenColumns.length,title:"Toggle All Columns Hidden",indeterminate:!n.allColumnsHidden&&n.state.hiddenColumns.length}]};function J(e,t,n,o){if(t.type===l.init)return r({hiddenColumns:[]},e);if(t.type===l.resetHiddenColumns)return r({},e,{hiddenColumns:o.initialState.hiddenColumns||[]});if(t.type===l.toggleHideColumn){var i=(void 0!==t.value?t.value:!e.hiddenColumns.includes(t.columnId))?[].concat(e.hiddenColumns,[t.columnId]):e.hiddenColumns.filter((function(e){return e!==t.columnId}));return r({},e,{hiddenColumns:i})}return t.type===l.setHiddenColumns?r({},e,{hiddenColumns:m(t.value,e.hiddenColumns)}):t.type===l.toggleHideAllColumns?r({},e,{hiddenColumns:(void 0!==t.value?t.value:!e.hiddenColumns.length)?o.allColumns.map((function(e){return e.id})):[]}):void 0}function Y(e){var n=e.headers,o=e.state.hiddenColumns;t.useRef(!1).current;var r=0;n.forEach((function(e){return r+=function e(t,n){t.isVisible=n&&!o.includes(t.id);var r=0;return t.headers&&t.headers.length?t.headers.forEach((function(n){return r+=e(n,t.isVisible)})):r=t.isVisible?1:0,t.totalVisibleHeaderCount=r,r}(e,!0)}));}function Q(e){var n=e.columns,o=e.flatHeaders,r=e.dispatch,i=e.allColumns,u=e.getHooks,s=e.state.hiddenColumns,a=e.autoResetHiddenColumns,c=void 0===a||a,d=h(e),p=i.length===s.length,g=t.useCallback((function(e,t){return r({type:l.toggleHideColumn,columnId:e,value:t})}),[r]),v=t.useCallback((function(e){return r({type:l.setHiddenColumns,value:e})}),[r]),m=t.useCallback((function(e){return r({type:l.toggleHideAllColumns,value:e})}),[r]),y=f(u().getToggleHideAllColumnsProps,{instance:d()});o.forEach((function(e){e.toggleHidden=function(t){r({type:l.toggleHideColumn,columnId:e.id,value:t});},e.getToggleHiddenProps=f(u().getToggleHiddenProps,{instance:d(),column:e});}));var R=h(c);w((function(){R()&&r({type:l.resetHiddenColumns});}),[r,n]),Object.assign(e,{allColumnsHidden:p,toggleHideColumn:g,setHiddenColumns:v,toggleHideAllColumns:m,getToggleHideAllColumnsProps:y});}var Z={},ee={},te=function(e,t,n){return e},ne=function(e,t){return e.subRows||[]},oe=function(e,t,n){return ""+(n?[n.id,t].join("."):t)},re=function(e){return e};function ie(e){var t=e.initialState,n=void 0===t?Z:t,o=e.defaultColumn,u=void 0===o?ee:o,l=e.getSubRows,s=void 0===l?ne:l,a=e.getRowId,c=void 0===a?oe:a,d=e.stateReducer,f=void 0===d?te:d,p=e.useControlledState,g=void 0===p?re:p;return r({},i(e,["initialState","defaultColumn","getSubRows","getRowId","stateReducer","useControlledState"]),{initialState:n,defaultColumn:u,getSubRows:s,getRowId:c,stateReducer:f,useControlledState:g})}function ue(e,t){void 0===t&&(t=0);var n=0,o=0,r=0,i=0;return e.forEach((function(e){var u=e.headers;if(e.totalLeft=t,u&&u.length){var l=ue(u,t),s=l[0],a=l[1],c=l[2],d=l[3];e.totalMinWidth=s,e.totalWidth=a,e.totalMaxWidth=c,e.totalFlexWidth=d;}else e.totalMinWidth=e.minWidth,e.totalWidth=Math.min(Math.max(e.minWidth,e.width),e.maxWidth),e.totalMaxWidth=e.maxWidth,e.totalFlexWidth=e.canResize?e.totalWidth:0;e.isVisible&&(t+=e.totalWidth,n+=e.totalMinWidth,o+=e.totalWidth,r+=e.totalMaxWidth,i+=e.totalFlexWidth);})),[n,o,r,i]}function le(e){var t=e.data,n=e.rows,o=e.flatRows,r=e.rowsById,i=e.column,u=e.getRowId,l=e.getSubRows,s=e.accessValueHooks,a=e.getInstance;t.forEach((function(e,c){return function e(n,c,d,f,g){void 0===d&&(d=0);var v=n,m=u(n,c,f),h=r[m];if(h)h.subRows&&h.originalSubRows.forEach((function(t,n){return e(t,n,d+1,h)}));else if((h={id:m,original:v,index:c,depth:d,cells:[{}]}).cells.map=T,h.cells.filter=T,h.cells.forEach=T,h.cells[0].getCellProps=T,h.values={},g.push(h),o.push(h),r[m]=h,h.originalSubRows=l(n,c),h.originalSubRows){var y=[];h.originalSubRows.forEach((function(t,n){return e(t,n,d+1,h,y)})),h.subRows=y;}i.accessor&&(h.values[i.id]=i.accessor(n,c,h,g,t)),h.values[i.id]=p(s,h.values[i.id],{row:h,column:i,instance:a()});}(e,c,0,void 0,n)}));}l.resetExpanded="resetExpanded",l.toggleRowExpanded="toggleRowExpanded",l.toggleAllRowsExpanded="toggleAllRowsExpanded";var se=function(e){e.getToggleAllRowsExpandedProps=[ae],e.getToggleRowExpandedProps=[ce],e.stateReducers.push(de),e.useInstance.push(fe),e.prepareRow.push(pe);};se.pluginName="useExpanded";var ae=function(e,t){var n=t.instance;return [e,{onClick:function(e){n.toggleAllRowsExpanded();},style:{cursor:"pointer"},title:"Toggle All Rows Expanded"}]},ce=function(e,t){var n=t.row;return [e,{onClick:function(){n.toggleRowExpanded();},style:{cursor:"pointer"},title:"Toggle Row Expanded"}]};function de(e,t,n,o){if(t.type===l.init)return r({expanded:{}},e);if(t.type===l.resetExpanded)return r({},e,{expanded:o.initialState.expanded||{}});if(t.type===l.toggleAllRowsExpanded){var s=t.value,a=o.isAllRowsExpanded,c=o.rowsById;if(void 0!==s?s:!a){var d={};return Object.keys(c).forEach((function(e){d[e]=!0;})),r({},e,{expanded:d})}return r({},e,{expanded:{}})}if(t.type===l.toggleRowExpanded){var f,p=t.id,g=t.value,v=e.expanded[p],m=void 0!==g?g:!v;if(!v&&m)return r({},e,{expanded:r({},e.expanded,(f={},f[p]=!0,f))});if(v&&!m){var h=e.expanded;h[p];return r({},e,{expanded:i(h,[p].map(u))})}return e}}function fe(e){var n=e.data,o=e.rows,r=e.rowsById,i=e.manualExpandedKey,u=void 0===i?"expanded":i,s=e.paginateExpandedRows,a=void 0===s||s,c=e.expandSubRows,d=void 0===c||c,p=e.autoResetExpanded,g=void 0===p||p,m=e.getHooks,y=e.plugins,R=e.state.expanded,b=e.dispatch;v(y,["useSortBy","useGroupBy","usePivotColumns","useGlobalFilter"],"useExpanded");var S=h(g),C=Boolean(Object.keys(r).length&&Object.keys(R).length);C&&Object.keys(r).some((function(e){return !R[e]}))&&(C=!1),w((function(){S()&&b({type:l.resetExpanded});}),[b,n]);var x=t.useCallback((function(e,t){b({type:l.toggleRowExpanded,id:e,value:t});}),[b]),P=t.useCallback((function(e){return b({type:l.toggleAllRowsExpanded,value:e})}),[b]),B=t.useMemo((function(){return a?A(o,{manualExpandedKey:u,expanded:R,expandSubRows:d}):o}),[a,o,u,R,d]),E=t.useMemo((function(){return function(e){var t=0;return Object.keys(e).forEach((function(e){var n=e.split(".");t=Math.max(t,n.length);})),t}(R)}),[R]),I=h(e),F=f(m().getToggleAllRowsExpandedProps,{instance:I()});Object.assign(e,{preExpandedRows:o,expandedRows:B,rows:B,expandedDepth:E,isAllRowsExpanded:C,toggleRowExpanded:x,toggleAllRowsExpanded:P,getToggleAllRowsExpandedProps:F});}function pe(e,t){var n=t.instance.getHooks,o=t.instance;e.toggleRowExpanded=function(t){return o.toggleRowExpanded(e.id,t)},e.getToggleRowExpandedProps=f(n().getToggleRowExpandedProps,{instance:o,row:e});}var ge=function(e,t,n){return e=e.filter((function(e){return t.some((function(t){var o=e.values[t];return String(o).toLowerCase().includes(String(n).toLowerCase())}))}))};ge.autoRemove=function(e){return !e};var ve=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return void 0===o||String(o).toLowerCase()===String(n).toLowerCase()}))}))};ve.autoRemove=function(e){return !e};var me=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return void 0===o||String(o)===String(n)}))}))};me.autoRemove=function(e){return !e};var he=function(e,t,n){return e.filter((function(e){return t.some((function(t){return e.values[t].includes(n)}))}))};he.autoRemove=function(e){return !e||!e.length};var ye=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return o&&o.length&&n.every((function(e){return o.includes(e)}))}))}))};ye.autoRemove=function(e){return !e||!e.length};var we=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return o&&o.length&&n.some((function(e){return o.includes(e)}))}))}))};we.autoRemove=function(e){return !e||!e.length};var Re=function(e,t,n){return e.filter((function(e){return t.some((function(t){var o=e.values[t];return n.includes(o)}))}))};Re.autoRemove=function(e){return !e||!e.length};var be=function(e,t,n){return e.filter((function(e){return t.some((function(t){return e.values[t]===n}))}))};be.autoRemove=function(e){return void 0===e};var Se=function(e,t,n){return e.filter((function(e){return t.some((function(t){return e.values[t]==n}))}))};Se.autoRemove=function(e){return null==e};var Ce=function(e,t,n){var o=n||[],r=o[0],i=o[1];if((r="number"==typeof r?r:-1/0)>(i="number"==typeof i?i:1/0)){var u=r;r=i,i=u;}return e.filter((function(e){return t.some((function(t){var n=e.values[t];return n>=r&&n<=i}))}))};Ce.autoRemove=function(e){return !e||"number"!=typeof e[0]&&"number"!=typeof e[1]};var xe=Object.freeze({__proto__:null,text:ge,exactText:ve,exactTextCase:me,includes:he,includesAll:ye,includesSome:we,includesValue:Re,exact:be,equals:Se,between:Ce});l.resetFilters="resetFilters",l.setFilter="setFilter",l.setAllFilters="setAllFilters";var Pe=function(e){e.stateReducers.push(Be),e.useInstance.push(Ee);};function Be(e,t,n,o){if(t.type===l.init)return r({filters:[]},e);if(t.type===l.resetFilters)return r({},e,{filters:o.initialState.filters||[]});if(t.type===l.setFilter){var i=t.columnId,u=t.filterValue,s=o.allColumns,a=o.filterTypes,c=s.find((function(e){return e.id===i}));if(!c)throw new Error("React-Table: Could not find a column with id: "+i);var d=k(c.filter,a||{},xe),f=e.filters.find((function(e){return e.id===i})),p=m(u,f&&f.value);return H(d.autoRemove,p,c)?r({},e,{filters:e.filters.filter((function(e){return e.id!==i}))}):r({},e,f?{filters:e.filters.map((function(e){return e.id===i?{id:i,value:p}:e}))}:{filters:[].concat(e.filters,[{id:i,value:p}])})}if(t.type===l.setAllFilters){var g=t.filters,v=o.allColumns,h=o.filterTypes;return r({},e,{filters:m(g,e.filters).filter((function(e){var t=v.find((function(t){return t.id===e.id}));return !H(k(t.filter,h||{},xe).autoRemove,e.value,t)}))})}}function Ee(e){var n=e.data,o=e.rows,r=e.flatRows,i=e.rowsById,u=e.allColumns,s=e.filterTypes,a=e.manualFilters,c=e.defaultCanFilter,d=void 0!==c&&c,f=e.disableFilters,p=e.state.filters,g=e.dispatch,v=e.autoResetFilters,m=void 0===v||v,y=t.useCallback((function(e,t){g({type:l.setFilter,columnId:e,filterValue:t});}),[g]),R=t.useCallback((function(e){g({type:l.setAllFilters,filters:e});}),[g]);u.forEach((function(e){var t=e.id,n=e.accessor,o=e.defaultCanFilter,r=e.disableFilters;e.canFilter=n?I(!0!==r&&void 0,!0!==f&&void 0,!0):I(o,d,!1),e.setFilter=function(t){return y(e.id,t)};var i=p.find((function(e){return e.id===t}));e.filterValue=i&&i.value;}));var b=t.useMemo((function(){if(a||!p.length)return [o,r,i];var e=[],t={};return [function n(o,r){void 0===r&&(r=0);var i=o;return (i=p.reduce((function(e,t){var n=t.id,o=t.value,i=u.find((function(e){return e.id===n}));if(!i)return e;0===r&&(i.preFilteredRows=e);var l=k(i.filter,s||{},xe);return l?(i.filteredRows=l(e,[n],o),i.filteredRows):(console.warn("Could not find a valid 'column.filter' for column with the ID: "+i.id+"."),e)}),o)).forEach((function(o){e.push(o),t[o.id]=o,o.subRows&&(o.subRows=o.subRows&&o.subRows.length>0?n(o.subRows,r+1):o.subRows);})),i}(o),e,t]}),[a,p,o,r,i,u,s]),S=b[0],C=b[1],x=b[2];t.useMemo((function(){u.filter((function(e){return !p.find((function(t){return t.id===e.id}))})).forEach((function(e){e.preFilteredRows=S,e.filteredRows=S;}));}),[S,p,u]);var P=h(m);w((function(){P()&&g({type:l.resetFilters});}),[g,a?null:n]),Object.assign(e,{preFilteredRows:o,preFilteredFlatRows:r,preFilteredRowsById:i,filteredRows:S,filteredFlatRows:C,filteredRowsById:x,rows:S,flatRows:C,rowsById:x,setFilter:y,setAllFilters:R});}Pe.pluginName="useFilters",l.resetGlobalFilter="resetGlobalFilter",l.setGlobalFilter="setGlobalFilter";var Ie=function(e){e.stateReducers.push(Fe),e.useInstance.push(Ge);};function Fe(e,t,n,o){if(t.type===l.resetGlobalFilter)return r({},e,{globalFilter:o.initialState.globalFilter||void 0});if(t.type===l.setGlobalFilter){var u=t.filterValue,s=o.userFilterTypes,a=k(o.globalFilter,s||{},xe),c=m(u,e.globalFilter);if(H(a.autoRemove,c)){e.globalFilter;return i(e,["globalFilter"])}return r({},e,{globalFilter:c})}}function Ge(e){var n=e.data,o=e.rows,r=e.flatRows,i=e.rowsById,u=e.allColumns,s=e.filterTypes,a=e.globalFilter,c=e.manualGlobalFilter,d=e.state.globalFilter,f=e.dispatch,p=e.autoResetGlobalFilter,g=void 0===p||p,v=e.disableGlobalFilter,m=t.useCallback((function(e){f({type:l.setGlobalFilter,filterValue:e});}),[f]),y=t.useMemo((function(){if(c||void 0===d)return [o,r,i];var e=[],t={},n=k(a,s||{},xe);if(!n)return console.warn("Could not find a valid 'globalFilter' option."),o;u.forEach((function(e){var t=e.disableGlobalFilter;e.canFilter=I(!0!==t&&void 0,!0!==v&&void 0,!0);}));var l=u.filter((function(e){return !0===e.canFilter}));return [function o(r){return (r=n(r,l.map((function(e){return e.id})),d)).forEach((function(n){e.push(n),t[n.id]=n,n.subRows=n.subRows&&n.subRows.length?o(n.subRows):n.subRows;})),r}(o),e,t]}),[c,d,a,s,u,o,r,i,v]),R=y[0],b=y[1],S=y[2],C=h(g);w((function(){C()&&f({type:l.resetGlobalFilter});}),[f,c?null:n]),Object.assign(e,{preGlobalFilteredRows:o,preGlobalFilteredFlatRows:r,preGlobalFilteredRowsById:i,globalFilteredRows:R,globalFilteredFlatRows:b,globalFilteredRowsById:S,rows:R,flatRows:b,rowsById:S,setGlobalFilter:m,disableGlobalFilter:v});}function Ae(e,t){return t.reduce((function(e,t){return e+("number"==typeof t?t:0)}),0)}Ie.pluginName="useGlobalFilter";var ke=Object.freeze({__proto__:null,sum:Ae,min:function(e){var t=e[0]||0;return e.forEach((function(e){"number"==typeof e&&(t=Math.min(t,e));})),t},max:function(e){var t=e[0]||0;return e.forEach((function(e){"number"==typeof e&&(t=Math.max(t,e));})),t},minMax:function(e){var t=e[0]||0,n=e[0]||0;return e.forEach((function(e){"number"==typeof e&&(t=Math.min(t,e),n=Math.max(n,e));})),t+".."+n},average:function(e){return Ae(0,e)/e.length},median:function(e){if(!e.length)return null;var t=Math.floor(e.length/2),n=[].concat(e).sort((function(e,t){return e-t}));return e.length%2!=0?n[t]:(n[t-1]+n[t])/2},unique:function(e){return Array.from(new Set(e).values())},uniqueCount:function(e){return new Set(e).size},count:function(e){return e.length}}),He=[],Te={};l.resetGroupBy="resetGroupBy",l.setGroupBy="setGroupBy",l.toggleGroupBy="toggleGroupBy";var ze=function(e){e.getGroupByToggleProps=[We],e.stateReducers.push(Oe),e.visibleColumnsDeps.push((function(e,t){var n=t.instance;return [].concat(e,[n.state.groupBy])})),e.visibleColumns.push(Me),e.useInstance.push(Ne),e.prepareRow.push(Le);};ze.pluginName="useGroupBy";var We=function(e,t){var n=t.header;return [e,{onClick:n.canGroupBy?function(e){e.persist(),n.toggleGroupBy();}:void 0,style:{cursor:n.canGroupBy?"pointer":void 0},title:"Toggle GroupBy"}]};function Oe(e,t,n,o){if(t.type===l.init)return r({groupBy:[]},e);if(t.type===l.resetGroupBy)return r({},e,{groupBy:o.initialState.groupBy||[]});if(t.type===l.setGroupBy)return r({},e,{groupBy:t.value});if(t.type===l.toggleGroupBy){var i=t.columnId,u=t.value,s=void 0!==u?u:!e.groupBy.includes(i);return r({},e,s?{groupBy:[].concat(e.groupBy,[i])}:{groupBy:e.groupBy.filter((function(e){return e!==i}))})}}function Me(e,t){var n=t.instance.state.groupBy,o=n.map((function(t){return e.find((function(e){return e.id===t}))})).filter(Boolean),r=e.filter((function(e){return !n.includes(e.id)}));return (e=[].concat(o,r)).forEach((function(e){e.isGrouped=n.includes(e.id),e.groupedIndex=n.indexOf(e.id);})),e}var je={};function Ne(e){var n=e.data,o=e.rows,r=e.flatRows,i=e.rowsById,u=e.allColumns,s=e.flatHeaders,a=e.groupByFn,c=void 0===a?De:a,d=e.manualGroupBy,p=e.aggregations,g=void 0===p?je:p,m=e.plugins,y=e.state.groupBy,R=e.dispatch,b=e.autoResetGroupBy,S=void 0===b||b,C=e.disableGroupBy,x=e.defaultCanGroupBy,P=e.getHooks;v(m,["useColumnOrder","useFilters"],"useGroupBy");var B=h(e);u.forEach((function(t){var n=t.accessor,o=t.defaultGroupBy,r=t.disableGroupBy;t.canGroupBy=n?I(t.canGroupBy,!0!==r&&void 0,!0!==C&&void 0,!0):I(t.canGroupBy,o,x,!1),t.canGroupBy&&(t.toggleGroupBy=function(){return e.toggleGroupBy(t.id)}),t.Aggregated=t.Aggregated||t.Cell;}));var E=t.useCallback((function(e,t){R({type:l.toggleGroupBy,columnId:e,value:t});}),[R]),F=t.useCallback((function(e){R({type:l.setGroupBy,value:e});}),[R]);s.forEach((function(e){e.getGroupByToggleProps=f(P().getGroupByToggleProps,{instance:B(),header:e});}));var A=t.useMemo((function(){if(d||!y.length)return [o,r,i,He,Te,r,i];var e=y.filter((function(e){return u.find((function(t){return t.id===e}))})),t=[],n={},l=[],s={},a=[],f={},p=function o(r,i,d){if(void 0===i&&(i=0),i===e.length)return r;var p=e[i],v=c(r,p);return Object.entries(v).map((function(r,c){var v=r[0],m=r[1],h=p+":"+v,y=o(m,i+1,h=d?d+">"+h:h),w=i?G(m,"leafRows"):m,R=function(t,n,o){var r={};return u.forEach((function(i){if(e.includes(i.id))r[i.id]=n[0]?n[0].values[i.id]:null;else {var u="function"==typeof i.aggregate?i.aggregate:g[i.aggregate]||ke[i.aggregate];if(u){var l=n.map((function(e){return e.values[i.id]})),s=t.map((function(e){var t=e.values[i.id];if(!o&&i.aggregateValue){var n="function"==typeof i.aggregateValue?i.aggregateValue:g[i.aggregateValue]||ke[i.aggregateValue];if(!n)throw console.info({column:i}),new Error("React Table: Invalid column.aggregateValue option for column listed above");t=n(t,e,i);}return t}));r[i.id]=u(s,l);}else {if(i.aggregate)throw console.info({column:i}),new Error("React Table: Invalid column.aggregate option for column listed above");r[i.id]=null;}}})),r}(w,m,i),b={id:h,isGrouped:!0,groupByID:p,groupByVal:v,values:R,subRows:y,leafRows:w,depth:i,index:c};return y.forEach((function(e){t.push(e),n[e.id]=e,e.isGrouped?(l.push(e),s[e.id]=e):(a.push(e),f[e.id]=e);})),b}))}(o);return p.forEach((function(e){t.push(e),n[e.id]=e,e.isGrouped?(l.push(e),s[e.id]=e):(a.push(e),f[e.id]=e);})),[p,t,n,l,s,a,f]}),[d,y,o,r,i,u,g,c]),k=A[0],H=A[1],T=A[2],z=A[3],W=A[4],O=A[5],M=A[6],j=h(S);w((function(){j()&&R({type:l.resetGroupBy});}),[R,d?null:n]),Object.assign(e,{preGroupedRows:o,preGroupedFlatRow:r,preGroupedRowsById:i,groupedRows:k,groupedFlatRows:H,groupedRowsById:T,onlyGroupedFlatRows:z,onlyGroupedRowsById:W,nonGroupedFlatRows:O,nonGroupedRowsById:M,rows:k,flatRows:H,rowsById:T,toggleGroupBy:E,setGroupBy:F});}function Le(e){e.allCells.forEach((function(t){var n;t.isGrouped=t.column.isGrouped&&t.column.id===e.groupByID,t.isPlaceholder=!t.isGrouped&&t.column.isGrouped,t.isAggregated=!t.isGrouped&&!t.isPlaceholder&&(null==(n=e.subRows)?void 0:n.length);}));}function De(e,t){return e.reduce((function(e,n,o){var r=""+n.values[t];return e[r]=Array.isArray(e[r])?e[r]:[],e[r].push(n),e}),{})}var Ve=/([0-9]+)/gm;function _e(e,t){return e===t?0:e>t?1:-1}function Xe(e,t,n){return [e.values[n],t.values[n]]}function qe(e){return "number"==typeof e?isNaN(e)||e===1/0||e===-1/0?"":String(e):"string"==typeof e?e:""}var Ke=Object.freeze({__proto__:null,alphanumeric:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1];for(r=qe(r),i=qe(i),r=r.split(Ve).filter(Boolean),i=i.split(Ve).filter(Boolean);r.length&&i.length;){var u=r.shift(),l=i.shift(),s=parseInt(u,10),a=parseInt(l,10),c=[s,a].sort();if(isNaN(c[0])){if(u>l)return 1;if(l>u)return -1}else {if(isNaN(c[1]))return isNaN(s)?-1:1;if(s>a)return 1;if(a>s)return -1}}return r.length-i.length},datetime:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1];return _e(r=r.getTime(),i=i.getTime())},basic:function(e,t,n){var o=Xe(e,t,n);return _e(o[0],o[1])},string:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1];for(r=r.split("").filter(Boolean),i=i.split("").filter(Boolean);r.length&&i.length;){var u=r.shift(),l=i.shift(),s=u.toLowerCase(),a=l.toLowerCase();if(s>a)return 1;if(a>s)return -1;if(u>l)return 1;if(l>u)return -1}return r.length-i.length},number:function(e,t,n){var o=Xe(e,t,n),r=o[0],i=o[1],u=/[^0-9.]/gi;return _e(r=Number(String(r).replace(u,"")),i=Number(String(i).replace(u,"")))}});l.resetSortBy="resetSortBy",l.setSortBy="setSortBy",l.toggleSortBy="toggleSortBy",l.clearSortBy="clearSortBy",c.sortType="alphanumeric",c.sortDescFirst=!1;var Ue=function(e){e.getSortByToggleProps=[$e],e.stateReducers.push(Je),e.useInstance.push(Ye);};Ue.pluginName="useSortBy";var $e=function(e,t){var n=t.instance,o=t.column,r=n.isMultiSortEvent,i=void 0===r?function(e){return e.shiftKey}:r;return [e,{onClick:o.canSort?function(e){e.persist(),o.toggleSortBy(void 0,!n.disableMultiSort&&i(e));}:void 0,style:{cursor:o.canSort?"pointer":void 0},title:o.canSort?"Toggle SortBy":void 0}]};function Je(e,t,n,o){if(t.type===l.init)return r({sortBy:[]},e);if(t.type===l.resetSortBy)return r({},e,{sortBy:o.initialState.sortBy||[]});if(t.type===l.clearSortBy)return r({},e,{sortBy:e.sortBy.filter((function(e){return e.id!==t.columnId}))});if(t.type===l.setSortBy)return r({},e,{sortBy:t.sortBy});if(t.type===l.toggleSortBy){var i,u=t.columnId,s=t.desc,a=t.multi,c=o.allColumns,d=o.disableMultiSort,f=o.disableSortRemove,p=o.disableMultiRemove,g=o.maxMultiSortColCount,v=void 0===g?Number.MAX_SAFE_INTEGER:g,m=e.sortBy,h=c.find((function(e){return e.id===u})).sortDescFirst,y=m.find((function(e){return e.id===u})),w=m.findIndex((function(e){return e.id===u})),R=null!=s,b=[];return "toggle"!==(i=!d&&a?y?"toggle":"add":w!==m.length-1||1!==m.length?"replace":y?"toggle":"replace")||f||R||a&&p||!(y&&y.desc&&!h||!y.desc&&h)||(i="remove"),"replace"===i?b=[{id:u,desc:R?s:h}]:"add"===i?(b=[].concat(m,[{id:u,desc:R?s:h}])).splice(0,b.length-v):"toggle"===i?b=m.map((function(e){return e.id===u?r({},e,{desc:R?s:!y.desc}):e})):"remove"===i&&(b=m.filter((function(e){return e.id!==u}))),r({},e,{sortBy:b})}}function Ye(e){var n=e.data,o=e.rows,r=e.flatRows,i=e.allColumns,u=e.orderByFn,s=void 0===u?Qe:u,a=e.sortTypes,c=e.manualSortBy,d=e.defaultCanSort,p=e.disableSortBy,g=e.flatHeaders,m=e.state.sortBy,y=e.dispatch,R=e.plugins,b=e.getHooks,S=e.autoResetSortBy,C=void 0===S||S;v(R,["useFilters","useGlobalFilter","useGroupBy","usePivotColumns"],"useSortBy");var x=t.useCallback((function(e){y({type:l.setSortBy,sortBy:e});}),[y]),P=t.useCallback((function(e,t,n){y({type:l.toggleSortBy,columnId:e,desc:t,multi:n});}),[y]),B=h(e);g.forEach((function(e){var t=e.accessor,n=e.canSort,o=e.disableSortBy,r=e.id,i=t?I(!0!==o&&void 0,!0!==p&&void 0,!0):I(d,n,!1);e.canSort=i,e.canSort&&(e.toggleSortBy=function(t,n){return P(e.id,t,n)},e.clearSortBy=function(){y({type:l.clearSortBy,columnId:e.id});}),e.getSortByToggleProps=f(b().getSortByToggleProps,{instance:B(),column:e});var u=m.find((function(e){return e.id===r}));e.isSorted=!!u,e.sortedIndex=m.findIndex((function(e){return e.id===r})),e.isSortedDesc=e.isSorted?u.desc:void 0;}));var E=t.useMemo((function(){if(c||!m.length)return [o,r];var e=[],t=m.filter((function(e){return i.find((function(t){return t.id===e.id}))}));return [function n(o){var r=s(o,t.map((function(e){var t=i.find((function(t){return t.id===e.id}));if(!t)throw new Error("React-Table: Could not find a column with id: "+e.id+" while sorting");var n=t.sortType,o=F(n)||(a||{})[n]||Ke[n];if(!o)throw new Error("React-Table: Could not find a valid sortType of '"+n+"' for column '"+e.id+"'.");return function(t,n){return o(t,n,e.id,e.desc)}})),t.map((function(e){var t=i.find((function(t){return t.id===e.id}));return t&&t.sortInverted?e.desc:!e.desc})));return r.forEach((function(t){e.push(t),t.subRows&&0!==t.subRows.length&&(t.subRows=n(t.subRows));})),r}(o),e]}),[c,m,o,r,i,s,a]),G=E[0],A=E[1],k=h(C);w((function(){k()&&y({type:l.resetSortBy});}),[c?null:n]),Object.assign(e,{preSortedRows:o,preSortedFlatRows:r,sortedRows:G,sortedFlatRows:A,rows:G,flatRows:A,setSortBy:x,toggleSortBy:P});}function Qe(e,t,n){return [].concat(e).sort((function(e,o){for(var r=0;r<t.length;r+=1){var i=t[r],u=!1===n[r]||"desc"===n[r],l=i(e,o);if(0!==l)return u?-l:l}return n[0]?e.index-o.index:o.index-e.index}))}l.resetPage="resetPage",l.gotoPage="gotoPage",l.setPageSize="setPageSize";var Ze=function(e){e.stateReducers.push(et),e.useInstance.push(tt);};function et(e,t,n,o){if(t.type===l.init)return r({pageSize:10,pageIndex:0},e);if(t.type===l.resetPage)return r({},e,{pageIndex:o.initialState.pageIndex||0});if(t.type===l.gotoPage){var i=o.pageCount,u=o.page,s=m(t.pageIndex,e.pageIndex),a=!1;return s>e.pageIndex?a=-1===i?u.length>=e.pageSize:s<i:s<e.pageIndex&&(a=s>-1),a?r({},e,{pageIndex:s}):e}if(t.type===l.setPageSize){var c=t.pageSize,d=e.pageSize*e.pageIndex;return r({},e,{pageIndex:Math.floor(d/c),pageSize:c})}}function tt(e){var n=e.rows,o=e.autoResetPage,r=void 0===o||o,i=e.manualExpandedKey,u=void 0===i?"expanded":i,s=e.plugins,a=e.pageCount,c=e.paginateExpandedRows,d=void 0===c||c,f=e.expandSubRows,p=void 0===f||f,g=e.state,m=g.pageSize,y=g.pageIndex,R=g.expanded,b=g.globalFilter,S=g.filters,C=g.groupBy,x=g.sortBy,P=e.dispatch,B=e.data,E=e.manualPagination;v(s,["useGlobalFilter","useFilters","useGroupBy","useSortBy","useExpanded"],"usePagination");var I=h(r);w((function(){I()&&P({type:l.resetPage});}),[P,E?null:B,b,S,C,x]);var F=E?a:Math.ceil(n.length/m),G=t.useMemo((function(){return F>0?[].concat(new Array(F)).fill(null).map((function(e,t){return t})):[]}),[F]),k=t.useMemo((function(){var e;if(E)e=n;else {var t=m*y,o=t+m;e=n.slice(t,o);}return d?e:A(e,{manualExpandedKey:u,expanded:R,expandSubRows:p})}),[p,R,u,E,y,m,d,n]),H=y>0,T=-1===F?k.length>=m:y<F-1,z=t.useCallback((function(e){P({type:l.gotoPage,pageIndex:e});}),[P]),W=t.useCallback((function(){return z((function(e){return e-1}))}),[z]),O=t.useCallback((function(){return z((function(e){return e+1}))}),[z]),M=t.useCallback((function(e){P({type:l.setPageSize,pageSize:e});}),[P]);Object.assign(e,{pageOptions:G,pageCount:F,page:k,canPreviousPage:H,canNextPage:T,gotoPage:z,previousPage:W,nextPage:O,setPageSize:M});}Ze.pluginName="usePagination",l.resetPivot="resetPivot",l.togglePivot="togglePivot";var nt=function(e){e.getPivotToggleProps=[rt],e.stateReducers.push(it),e.useInstanceAfterData.push(ut),e.allColumns.push(lt),e.accessValue.push(st),e.materializedColumns.push(at),e.materializedColumnsDeps.push(ct),e.visibleColumns.push(dt),e.visibleColumnsDeps.push(ft),e.useInstance.push(pt),e.prepareRow.push(gt);};nt.pluginName="usePivotColumns";var ot=[],rt=function(e,t){var n=t.header;return [e,{onClick:n.canPivot?function(e){e.persist(),n.togglePivot();}:void 0,style:{cursor:n.canPivot?"pointer":void 0},title:"Toggle Pivot"}]};function it(e,t,n,o){if(t.type===l.init)return r({pivotColumns:ot},e);if(t.type===l.resetPivot)return r({},e,{pivotColumns:o.initialState.pivotColumns||ot});if(t.type===l.togglePivot){var i=t.columnId,u=t.value,s=void 0!==u?u:!e.pivotColumns.includes(i);return r({},e,s?{pivotColumns:[].concat(e.pivotColumns,[i])}:{pivotColumns:e.pivotColumns.filter((function(e){return e!==i}))})}}function ut(e){e.allColumns.forEach((function(t){t.isPivotSource=e.state.pivotColumns.includes(t.id);}));}function lt(e,t){var n=t.instance;return e.forEach((function(e){e.isPivotSource=n.state.pivotColumns.includes(e.id),e.uniqueValues=new Set;})),e}function st(e,t){var n=t.column;return n.uniqueValues&&void 0!==e&&n.uniqueValues.add(e),e}function at(e,t){var n=t.instance,o=n.allColumns,i=n.state;if(!i.pivotColumns.length||!i.groupBy||!i.groupBy.length)return e;var u=i.pivotColumns.map((function(e){return o.find((function(t){return t.id===e}))})).filter(Boolean),l=o.filter((function(e){return !e.isPivotSource&&!i.groupBy.includes(e.id)&&!i.pivotColumns.includes(e.id)})),s=C(function e(t,n,o){void 0===t&&(t=0),void 0===o&&(o=[]);var i=u[t];return i?Array.from(i.uniqueValues).sort().map((function(u){var l=r({},i,{Header:i.PivotHeader||"string"==typeof i.header?i.Header+": "+u:u,isPivotGroup:!0,parent:n,depth:t,id:n?n.id+"."+i.id+"."+u:i.id+"."+u,pivotValue:u});return l.columns=e(t+1,l,[].concat(o,[function(e){return e.values[i.id]===u}])),l})):l.map((function(e){return r({},e,{canPivot:!1,isPivoted:!0,parent:n,depth:t,id:""+(n?n.id+"."+e.id:e.id),accessor:function(t,n,r){if(o.every((function(e){return e(r)})))return r.values[e.id]}})}))}());return [].concat(e,s)}function ct(e,t){var n=t.instance.state,o=n.pivotColumns,r=n.groupBy;return [].concat(e,[o,r])}function dt(e,t){var n=t.instance.state;return e=e.filter((function(e){return !e.isPivotSource})),n.pivotColumns.length&&n.groupBy&&n.groupBy.length&&(e=e.filter((function(e){return e.isGrouped||e.isPivoted}))),e}function ft(e,t){var n=t.instance;return [].concat(e,[n.state.pivotColumns,n.state.groupBy])}function pt(e){var t=e.columns,n=e.allColumns,o=e.flatHeaders,r=e.getHooks,i=e.plugins,u=e.dispatch,s=e.autoResetPivot,a=void 0===s||s,c=e.manaulPivot,d=e.disablePivot,p=e.defaultCanPivot;v(i,["useGroupBy"],"usePivotColumns");var g=h(e);n.forEach((function(t){var n=t.accessor,o=t.defaultPivot,r=t.disablePivot;t.canPivot=n?I(t.canPivot,!0!==r&&void 0,!0!==d&&void 0,!0):I(t.canPivot,o,p,!1),t.canPivot&&(t.togglePivot=function(){return e.togglePivot(t.id)}),t.Aggregated=t.Aggregated||t.Cell;}));o.forEach((function(e){e.getPivotToggleProps=f(r().getPivotToggleProps,{instance:g(),header:e});}));var m=h(a);w((function(){m()&&u({type:l.resetPivot});}),[u,c?null:t]),Object.assign(e,{togglePivot:function(e,t){u({type:l.togglePivot,columnId:e,value:t});}});}function gt(e){e.allCells.forEach((function(e){e.isPivoted=e.column.isPivoted;}));}l.resetSelectedRows="resetSelectedRows",l.toggleAllRowsSelected="toggleAllRowsSelected",l.toggleRowSelected="toggleRowSelected",l.toggleAllPageRowsSelected="toggleAllPageRowsSelected";var vt=function(e){e.getToggleRowSelectedProps=[mt],e.getToggleAllRowsSelectedProps=[ht],e.getToggleAllPageRowsSelectedProps=[yt],e.stateReducers.push(wt),e.useInstance.push(Rt),e.prepareRow.push(bt);};vt.pluginName="useRowSelect";var mt=function(e,t){var n=t.instance,o=t.row,r=n.manualRowSelectedKey,i=void 0===r?"isSelected":r;return [e,{onChange:function(e){o.toggleRowSelected(e.target.checked);},style:{cursor:"pointer"},checked:!(!o.original||!o.original[i])||o.isSelected,title:"Toggle Row Selected",indeterminate:o.isSomeSelected}]},ht=function(e,t){var n=t.instance;return [e,{onChange:function(e){n.toggleAllRowsSelected(e.target.checked);},style:{cursor:"pointer"},checked:n.isAllRowsSelected,title:"Toggle All Rows Selected",indeterminate:Boolean(!n.isAllRowsSelected&&Object.keys(n.state.selectedRowIds).length)}]},yt=function(e,t){var n=t.instance;return [e,{onChange:function(e){n.toggleAllPageRowsSelected(e.target.checked);},style:{cursor:"pointer"},checked:n.isAllPageRowsSelected,title:"Toggle All Current Page Rows Selected",indeterminate:Boolean(!n.isAllPageRowsSelected&&n.page.some((function(e){var t=e.id;return n.state.selectedRowIds[t]})))}]};function wt(e,t,n,o){if(t.type===l.init)return r({selectedRowIds:{}},e);if(t.type===l.resetSelectedRows)return r({},e,{selectedRowIds:o.initialState.selectedRowIds||{}});if(t.type===l.toggleAllRowsSelected){var i=t.value,u=o.isAllRowsSelected,s=o.rowsById,a=o.nonGroupedRowsById,c=void 0===a?s:a,d=void 0!==i?i:!u,f=Object.assign({},e.selectedRowIds);return d?Object.keys(c).forEach((function(e){f[e]=!0;})):Object.keys(c).forEach((function(e){delete f[e];})),r({},e,{selectedRowIds:f})}if(t.type===l.toggleRowSelected){var p=t.id,g=t.value,v=o.rowsById,m=o.selectSubRows,h=void 0===m||m,y=o.getSubRows,w=e.selectedRowIds[p],R=void 0!==g?g:!w;if(w===R)return e;var b=r({},e.selectedRowIds);return function e(t){var n=v[t];if(n.isGrouped||(R?b[t]=!0:delete b[t]),h&&y(n))return y(n).forEach((function(t){return e(t.id)}))}(p),r({},e,{selectedRowIds:b})}if(t.type===l.toggleAllPageRowsSelected){var S=t.value,C=o.page,x=o.rowsById,P=o.selectSubRows,B=void 0===P||P,E=o.isAllPageRowsSelected,I=o.getSubRows,F=void 0!==S?S:!E,G=r({},e.selectedRowIds);return C.forEach((function(e){return function e(t){var n=x[t];if(n.isGrouped||(F?G[t]=!0:delete G[t]),B&&I(n))return I(n).forEach((function(t){return e(t.id)}))}(e.id)})),r({},e,{selectedRowIds:G})}return e}function Rt(e){var n=e.data,o=e.rows,r=e.getHooks,i=e.plugins,u=e.rowsById,s=e.nonGroupedRowsById,a=void 0===s?u:s,c=e.autoResetSelectedRows,d=void 0===c||c,p=e.state.selectedRowIds,g=e.selectSubRows,m=void 0===g||g,y=e.dispatch,R=e.page,b=e.getSubRows;v(i,["useFilters","useGroupBy","useSortBy","useExpanded","usePagination"],"useRowSelect");var S=t.useMemo((function(){var e=[];return o.forEach((function(t){var n=m?function e(t,n,o){if(n[t.id])return !0;var r=o(t);if(r&&r.length){var i=!0,u=!1;return r.forEach((function(t){u&&!i||(e(t,n,o)?u=!0:i=!1);})),!!i||!!u&&null}return !1}(t,p,b):!!p[t.id];t.isSelected=!!n,t.isSomeSelected=null===n,n&&e.push(t);})),e}),[o,m,p,b]),C=Boolean(Object.keys(a).length&&Object.keys(p).length),x=C;C&&Object.keys(a).some((function(e){return !p[e]}))&&(C=!1),C||R&&R.length&&R.some((function(e){var t=e.id;return !p[t]}))&&(x=!1);var P=h(d);w((function(){P()&&y({type:l.resetSelectedRows});}),[y,n]);var B=t.useCallback((function(e){return y({type:l.toggleAllRowsSelected,value:e})}),[y]),E=t.useCallback((function(e){return y({type:l.toggleAllPageRowsSelected,value:e})}),[y]),I=t.useCallback((function(e,t){return y({type:l.toggleRowSelected,id:e,value:t})}),[y]),F=h(e),G=f(r().getToggleAllRowsSelectedProps,{instance:F()}),A=f(r().getToggleAllPageRowsSelectedProps,{instance:F()});Object.assign(e,{selectedFlatRows:S,isAllRowsSelected:C,isAllPageRowsSelected:x,toggleRowSelected:I,toggleAllRowsSelected:B,getToggleAllRowsSelectedProps:G,getToggleAllPageRowsSelectedProps:A,toggleAllPageRowsSelected:E});}function bt(e,t){var n=t.instance;e.toggleRowSelected=function(t){return n.toggleRowSelected(e.id,t)},e.getToggleRowSelectedProps=f(n.getHooks().getToggleRowSelectedProps,{instance:n,row:e});}var St=function(e){return {}},Ct=function(e){return {}};l.setRowState="setRowState",l.setCellState="setCellState",l.resetRowState="resetRowState";var xt=function(e){e.stateReducers.push(Pt),e.useInstance.push(Bt),e.prepareRow.push(Et);};function Pt(e,t,n,o){var i=o.initialRowStateAccessor,u=void 0===i?St:i,s=o.initialCellStateAccessor,a=void 0===s?Ct:s,c=o.rowsById;if(t.type===l.init)return r({rowState:{}},e);if(t.type===l.resetRowState)return r({},e,{rowState:o.initialState.rowState||{}});if(t.type===l.setRowState){var d,f=t.rowId,p=t.value,g=void 0!==e.rowState[f]?e.rowState[f]:u(c[f]);return r({},e,{rowState:r({},e.rowState,(d={},d[f]=m(p,g),d))})}if(t.type===l.setCellState){var v,h,y,w,R,b=t.rowId,S=t.columnId,C=t.value,x=void 0!==e.rowState[b]?e.rowState[b]:u(c[b]),P=void 0!==(null==x?void 0:null==(v=x.cellState)?void 0:v[S])?x.cellState[S]:a(null==(h=c[b])?void 0:null==(y=h.cells)?void 0:y.find((function(e){return e.column.id===S})));return r({},e,{rowState:r({},e.rowState,(R={},R[b]=r({},x,{cellState:r({},x.cellState||{},(w={},w[S]=m(C,P),w))}),R))})}}function Bt(e){var n=e.autoResetRowState,o=void 0===n||n,r=e.data,i=e.dispatch,u=t.useCallback((function(e,t){return i({type:l.setRowState,rowId:e,value:t})}),[i]),s=t.useCallback((function(e,t,n){return i({type:l.setCellState,rowId:e,columnId:t,value:n})}),[i]),a=h(o);w((function(){a()&&i({type:l.resetRowState});}),[r]),Object.assign(e,{setRowState:u,setCellState:s});}function Et(e,t){var n=t.instance,o=n.initialRowStateAccessor,r=void 0===o?St:o,i=n.initialCellStateAccessor,u=void 0===i?Ct:i,l=n.state.rowState;e&&(e.state=void 0!==l[e.id]?l[e.id]:r(e),e.setState=function(t){return n.setRowState(e.id,t)},e.cells.forEach((function(t){e.state.cellState||(e.state.cellState={}),t.state=void 0!==e.state.cellState[t.column.id]?e.state.cellState[t.column.id]:u(t),t.setState=function(o){return n.setCellState(e.id,t.column.id,o)};})));}xt.pluginName="useRowState",l.resetColumnOrder="resetColumnOrder",l.setColumnOrder="setColumnOrder";var It=function(e){e.stateReducers.push(Ft),e.visibleColumnsDeps.push((function(e,t){var n=t.instance;return [].concat(e,[n.state.columnOrder])})),e.visibleColumns.push(Gt),e.useInstance.push(At);};function Ft(e,t,n,o){return t.type===l.init?r({columnOrder:[]},e):t.type===l.resetColumnOrder?r({},e,{columnOrder:o.initialState.columnOrder||[]}):t.type===l.setColumnOrder?r({},e,{columnOrder:m(t.columnOrder,e.columnOrder)}):void 0}function Gt(e,t){var n=t.instance.state.columnOrder;if(!n||!n.length)return e;for(var o=[].concat(n),r=[].concat(e),i=[],u=function(){var e=o.shift(),t=r.findIndex((function(t){return t.id===e}));t>-1&&i.push(r.splice(t,1)[0]);};r.length&&o.length;)u();return [].concat(i,r)}function At(e){var n=e.dispatch;e.setColumnOrder=t.useCallback((function(e){return n({type:l.setColumnOrder,columnOrder:e})}),[n]);}It.pluginName="useColumnOrder",c.canResize=!0,l.columnStartResizing="columnStartResizing",l.columnResizing="columnResizing",l.columnDoneResizing="columnDoneResizing",l.resetResize="resetResize";var kt=function(e){e.getResizerProps=[Ht],e.getHeaderProps.push({style:{position:"relative"}}),e.stateReducers.push(Tt),e.useInstance.push(Wt),e.useInstanceBeforeDimensions.push(zt);},Ht=function(e,t){var n=t.instance,o=t.header,r=n.dispatch,i=function(e,t){var n=!1;if("touchstart"===e.type){if(e.touches&&e.touches.length>1)return;n=!0;}var o=function(e){var t=[];return function e(n){n.columns&&n.columns.length&&n.columns.map(e);t.push(n);}(e),t}(t).map((function(e){return [e.id,e.totalWidth]})),i=n?Math.round(e.touches[0].clientX):e.clientX,u=function(e){r({type:l.columnResizing,clientX:e});},s=function(){return r({type:l.columnDoneResizing})},a={mouse:{moveEvent:"mousemove",moveHandler:function(e){return u(e.clientX)},upEvent:"mouseup",upHandler:function(e){document.removeEventListener("mousemove",a.mouse.moveHandler),document.removeEventListener("mouseup",a.mouse.upHandler),s();}},touch:{moveEvent:"touchmove",moveHandler:function(e){return e.cancelable&&(e.preventDefault(),e.stopPropagation()),u(e.touches[0].clientX),!1},upEvent:"touchend",upHandler:function(e){document.removeEventListener(a.touch.moveEvent,a.touch.moveHandler),document.removeEventListener(a.touch.upEvent,a.touch.moveHandler),s();}}},c=n?a.touch:a.mouse,d=!!function(){if("boolean"==typeof z)return z;var e=!1;try{var t={get passive(){return e=!0,!1}};window.addEventListener("test",null,t),window.removeEventListener("test",null,t);}catch(t){e=!1;}return z=e}()&&{passive:!1};document.addEventListener(c.moveEvent,c.moveHandler,d),document.addEventListener(c.upEvent,c.upHandler,d),r({type:l.columnStartResizing,columnId:t.id,columnWidth:t.totalWidth,headerIdWidths:o,clientX:i});};return [e,{onMouseDown:function(e){return e.persist()||i(e,o)},onTouchStart:function(e){return e.persist()||i(e,o)},style:{cursor:"col-resize"},draggable:!1,role:"separator"}]};function Tt(e,t){if(t.type===l.init)return r({columnResizing:{columnWidths:{}}},e);if(t.type===l.resetResize)return r({},e,{columnResizing:{columnWidths:{}}});if(t.type===l.columnStartResizing){var n=t.clientX,o=t.columnId,i=t.columnWidth,u=t.headerIdWidths;return r({},e,{columnResizing:r({},e.columnResizing,{startX:n,headerIdWidths:u,columnWidth:i,isResizingColumn:o})})}if(t.type===l.columnResizing){var s=t.clientX,a=e.columnResizing,c=a.startX,d=a.columnWidth,f=a.headerIdWidths,p=(s-c)/d,g={};return (void 0===f?[]:f).forEach((function(e){var t=e[0],n=e[1];g[t]=Math.max(n+n*p,0);})),r({},e,{columnResizing:r({},e.columnResizing,{columnWidths:r({},e.columnResizing.columnWidths,{},g)})})}return t.type===l.columnDoneResizing?r({},e,{columnResizing:r({},e.columnResizing,{startX:null,isResizingColumn:null})}):void 0}kt.pluginName="useResizeColumns";var zt=function(e){var t=e.flatHeaders,n=e.disableResizing,o=e.getHooks,r=e.state.columnResizing,i=h(e);t.forEach((function(e){var t=I(!0!==e.disableResizing&&void 0,!0!==n&&void 0,!0);e.canResize=t,e.width=r.columnWidths[e.id]||e.originalWidth||e.width,e.isResizing=r.isResizingColumn===e.id,t&&(e.getResizerProps=f(o().getResizerProps,{instance:i(),header:e}));}));};function Wt(e){var n=e.plugins,o=e.dispatch,r=e.autoResetResize,i=void 0===r||r,u=e.columns;v(n,["useAbsoluteLayout"],"useResizeColumns");var s=h(i);w((function(){s()&&o({type:l.resetResize});}),[u]);var a=t.useCallback((function(){return o({type:l.resetResize})}),[o]);Object.assign(e,{resetResizing:a});}var Ot={position:"absolute",top:0},Mt=function(e){e.getTableBodyProps.push(jt),e.getRowProps.push(jt),e.getHeaderGroupProps.push(jt),e.getFooterGroupProps.push(jt),e.getHeaderProps.push((function(e,t){var n=t.column;return [e,{style:r({},Ot,{left:n.totalLeft+"px",width:n.totalWidth+"px"})}]})),e.getCellProps.push((function(e,t){var n=t.cell;return [e,{style:r({},Ot,{left:n.column.totalLeft+"px",width:n.column.totalWidth+"px"})}]})),e.getFooterProps.push((function(e,t){var n=t.column;return [e,{style:r({},Ot,{left:n.totalLeft+"px",width:n.totalWidth+"px"})}]}));};Mt.pluginName="useAbsoluteLayout";var jt=function(e,t){return [e,{style:{position:"relative",width:t.instance.totalColumnsWidth+"px"}}]},Nt={display:"inline-block",boxSizing:"border-box"},Lt=function(e,t){return [e,{style:{display:"flex",width:t.instance.totalColumnsWidth+"px"}}]},Dt=function(e){e.getRowProps.push(Lt),e.getHeaderGroupProps.push(Lt),e.getFooterGroupProps.push(Lt),e.getHeaderProps.push((function(e,t){var n=t.column;return [e,{style:r({},Nt,{width:n.totalWidth+"px"})}]})),e.getCellProps.push((function(e,t){var n=t.cell;return [e,{style:r({},Nt,{width:n.column.totalWidth+"px"})}]})),e.getFooterProps.push((function(e,t){var n=t.column;return [e,{style:r({},Nt,{width:n.totalWidth+"px"})}]}));};function Vt(e){e.getTableProps.push(_t),e.getRowProps.push(Xt),e.getHeaderGroupProps.push(Xt),e.getFooterGroupProps.push(Xt),e.getHeaderProps.push(qt),e.getCellProps.push(Kt),e.getFooterProps.push(Ut);}Dt.pluginName="useBlockLayout",Vt.pluginName="useFlexLayout";var _t=function(e,t){return [e,{style:{minWidth:t.instance.totalColumnsMinWidth+"px"}}]},Xt=function(e,t){return [e,{style:{display:"flex",flex:"1 0 auto",minWidth:t.instance.totalColumnsMinWidth+"px"}}]},qt=function(e,t){var n=t.column;return [e,{style:{boxSizing:"border-box",flex:n.totalFlexWidth?n.totalFlexWidth+" 0 auto":void 0,minWidth:n.totalMinWidth+"px",width:n.totalWidth+"px"}}]},Kt=function(e,t){var n=t.cell;return [e,{style:{boxSizing:"border-box",flex:n.column.totalFlexWidth+" 0 auto",minWidth:n.column.totalMinWidth+"px",width:n.column.totalWidth+"px"}}]},Ut=function(e,t){var n=t.column;return [e,{style:{boxSizing:"border-box",flex:n.totalFlexWidth?n.totalFlexWidth+" 0 auto":void 0,minWidth:n.totalMinWidth+"px",width:n.totalWidth+"px"}}]};function $t(e){e.stateReducers.push(Qt),e.getTableProps.push(Jt),e.getHeaderProps.push(Yt);}$t.pluginName="useGridLayout";var Jt=function(e,t){return [e,{style:{display:"grid",gridTemplateColumns:t.instance.state.gridLayout.columnWidths.map((function(e){return e})).join(" ")}}]},Yt=function(e,t){return [e,{id:"header-cell-"+t.column.id,style:{position:"sticky"}}]};function Qt(e,t,n,o){if("init"===t.type)return r({gridLayout:{columnWidths:o.columns.map((function(){return "auto"}))}},e);if("columnStartResizing"===t.type){var i=t.columnId,u=o.visibleColumns.findIndex((function(e){return e.id===i})),l=function(e){var t,n=null==(t=document.getElementById("header-cell-"+e))?void 0:t.offsetWidth;if(void 0!==n)return n}(i);return void 0!==l?r({},e,{gridLayout:r({},e.gridLayout,{columnId:i,columnIndex:u,startingWidth:l})}):e}if("columnResizing"===t.type){var s=e.gridLayout,a=s.columnIndex,c=s.startingWidth,d=s.columnWidths,f=c-(e.columnResizing.startX-t.clientX),p=[].concat(d);return p[a]=f+"px",r({},e,{gridLayout:r({},e.gridLayout,{columnWidths:p})})}}e._UNSTABLE_usePivotColumns=nt,e.actions=l,e.defaultColumn=c,e.defaultGroupByFn=De,e.defaultOrderByFn=Qe,e.defaultRenderer=s,e.emptyRenderer=a,e.ensurePluginOrder=v,e.flexRender=b,e.functionalUpdate=m,e.loopHooks=g,e.makePropGetter=f,e.makeRenderer=R,e.reduceHooks=p,e.safeUseLayoutEffect=y,e.useAbsoluteLayout=Mt,e.useAsyncDebounce=function(e,n){void 0===n&&(n=0);var r=t.useRef({}),i=h(e),u=h(n);return t.useCallback(function(){var e=o(regeneratorRuntime.mark((function e(){var t,n,l,s=arguments;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:for(t=s.length,n=new Array(t),l=0;l<t;l++)n[l]=s[l];return r.current.promise||(r.current.promise=new Promise((function(e,t){r.current.resolve=e,r.current.reject=t;}))),r.current.timeout&&clearTimeout(r.current.timeout),r.current.timeout=setTimeout(o(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return delete r.current.timeout,e.prev=1,e.t0=r.current,e.next=5,i().apply(void 0,n);case 5:e.t1=e.sent,e.t0.resolve.call(e.t0,e.t1),e.next=12;break;case 9:e.prev=9,e.t2=e.catch(1),r.current.reject(e.t2);case 12:return e.prev=12,delete r.current.promise,e.finish(12);case 15:case"end":return e.stop()}}),e,null,[[1,9,12,15]])}))),u()),e.abrupt("return",r.current.promise);case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),[i,u])},e.useBlockLayout=Dt,e.useColumnOrder=It,e.useExpanded=se,e.useFilters=Pe,e.useFlexLayout=Vt,e.useGetLatest=h,e.useGlobalFilter=Ie,e.useGridLayout=$t,e.useGroupBy=ze,e.useMountedLayoutEffect=w,e.usePagination=Ze,e.useResizeColumns=kt,e.useRowSelect=vt,e.useRowState=xt,e.useSortBy=Ue,e.useTable=function(e){for(var n=arguments.length,o=new Array(n>1?n-1:0),i=1;i<n;i++)o[i-1]=arguments[i];e=ie(e),o=[K].concat(o);var u=t.useRef({}),s=h(u.current);Object.assign(s(),r({},e,{plugins:o,hooks:q()})),o.filter(Boolean).forEach((function(e){e(s().hooks);}));var a=h(s().hooks);s().getHooks=a,delete s().hooks,Object.assign(s(),p(a().useOptions,ie(e)));var c=s(),d=c.data,v=c.columns,m=c.initialState,y=c.defaultColumn,w=c.getSubRows,b=c.getRowId,E=c.stateReducer,I=c.useControlledState,F=h(E),G=t.useCallback((function(e,t){if(!t.type)throw console.info({action:t}),new Error("Unknown Action 👆");return [].concat(a().stateReducers,Array.isArray(F())?F():[F()]).reduce((function(n,o){return o(n,t,e,s())||n}),e)}),[a,F,s]),A=t.useReducer(G,void 0,(function(){return G(m,{type:l.init})})),k=A[0],H=A[1],T=p([].concat(a().useControlledState,[I]),k,{instance:s()});Object.assign(s(),{state:T,dispatch:H});var z=t.useMemo((function(){return S(p(a().columns,v,{instance:s()}))}),[a,s,v].concat(p(a().columnsDeps,[],{instance:s()})));s().columns=z;var W=t.useMemo((function(){return p(a().allColumns,C(z),{instance:s()}).map(x)}),[z,a,s].concat(p(a().allColumnsDeps,[],{instance:s()})));s().allColumns=W;var O=t.useMemo((function(){for(var e=[],t=[],n={},o=[].concat(W);o.length;){var r=o.shift();le({data:d,rows:e,flatRows:t,rowsById:n,column:r,getRowId:b,getSubRows:w,accessValueHooks:a().accessValue,getInstance:s});}return [e,t,n]}),[W,d,b,w,a,s]),M=O[0],j=O[1],N=O[2];Object.assign(s(),{rows:M,initialRows:[].concat(M),flatRows:j,rowsById:N}),g(a().useInstanceAfterData,s());var L=t.useMemo((function(){return p(a().visibleColumns,W,{instance:s()}).map((function(e){return P(e,y)}))}),[a,W,s,y].concat(p(a().visibleColumnsDeps,[],{instance:s()})));W=t.useMemo((function(){var e=[].concat(L);return W.forEach((function(t){e.find((function(e){return e.id===t.id}))||e.push(t);})),e}),[W,L]),s().allColumns=W;var D=t.useMemo((function(){return p(a().headerGroups,B(L,y),s())}),[a,L,y,s].concat(p(a().headerGroupsDeps,[],{instance:s()})));s().headerGroups=D;var V=t.useMemo((function(){return D.length?D[0].headers:[]}),[D]);s().headers=V,s().flatHeaders=D.reduce((function(e,t){return [].concat(e,t.headers)}),[]),g(a().useInstanceBeforeDimensions,s());var _=L.filter((function(e){return e.isVisible})).map((function(e){return e.id})).sort().join("_");L=t.useMemo((function(){return L.filter((function(e){return e.isVisible}))}),[L,_]),s().visibleColumns=L;var X=ue(V),U=X[0],$=X[1],J=X[2];return s().totalColumnsMinWidth=U,s().totalColumnsWidth=$,s().totalColumnsMaxWidth=J,g(a().useInstance,s()),[].concat(s().flatHeaders,s().allColumns).forEach((function(e){e.render=R(s(),e),e.getHeaderProps=f(a().getHeaderProps,{instance:s(),column:e}),e.getFooterProps=f(a().getFooterProps,{instance:s(),column:e});})),s().headerGroups=t.useMemo((function(){return D.filter((function(e,t){return e.headers=e.headers.filter((function(e){return e.headers?function e(t){return t.filter((function(t){return t.headers?e(t.headers):t.isVisible})).length}(e.headers):e.isVisible})),!!e.headers.length&&(e.getHeaderGroupProps=f(a().getHeaderGroupProps,{instance:s(),headerGroup:e,index:t}),e.getFooterGroupProps=f(a().getFooterGroupProps,{instance:s(),headerGroup:e,index:t}),!0)}))}),[D,s,a]),s().footerGroups=[].concat(s().headerGroups).reverse(),s().prepareRow=t.useCallback((function(e){e.getRowProps=f(a().getRowProps,{instance:s(),row:e}),e.allCells=W.map((function(t){var n=e.values[t.id],o={column:t,row:e,value:n};return o.getCellProps=f(a().getCellProps,{instance:s(),cell:o}),o.render=R(s(),t,{row:e,cell:o,value:n}),o})),e.cells=L.map((function(t){return e.allCells.find((function(e){return e.column.id===t.id}))})),g(a().prepareRow,e,{instance:s()});}),[a,s,W,L]),s().getTableProps=f(a().getTableProps,{instance:s()}),s().getTableBodyProps=f(a().getTableBodyProps,{instance:s()}),g(a().useFinalInstance,s()),s()},Object.defineProperty(e,"__esModule",{value:!0});}));

			}(reactTable_production_min, reactTable_production_min.exports));

			var reactTable_development = {exports: {}};

			(function (module, exports) {
			(function (global, factory) {
			  factory(exports, React__default) ;
			}(commonjsGlobal, (function (exports, React) {
			  React = React && Object.prototype.hasOwnProperty.call(React, 'default') ? React['default'] : React;

			  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
			    try {
			      var info = gen[key](arg);
			      var value = info.value;
			    } catch (error) {
			      reject(error);
			      return;
			    }

			    if (info.done) {
			      resolve(value);
			    } else {
			      Promise.resolve(value).then(_next, _throw);
			    }
			  }

			  function _asyncToGenerator(fn) {
			    return function () {
			      var self = this,
			          args = arguments;
			      return new Promise(function (resolve, reject) {
			        var gen = fn.apply(self, args);

			        function _next(value) {
			          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
			        }

			        function _throw(err) {
			          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
			        }

			        _next(undefined);
			      });
			    };
			  }

			  function _extends() {
			    _extends = Object.assign || function (target) {
			      for (var i = 1; i < arguments.length; i++) {
			        var source = arguments[i];

			        for (var key in source) {
			          if (Object.prototype.hasOwnProperty.call(source, key)) {
			            target[key] = source[key];
			          }
			        }
			      }

			      return target;
			    };

			    return _extends.apply(this, arguments);
			  }

			  function _objectWithoutPropertiesLoose(source, excluded) {
			    if (source == null) return {};
			    var target = {};
			    var sourceKeys = Object.keys(source);
			    var key, i;

			    for (i = 0; i < sourceKeys.length; i++) {
			      key = sourceKeys[i];
			      if (excluded.indexOf(key) >= 0) continue;
			      target[key] = source[key];
			    }

			    return target;
			  }

			  function _toPrimitive(input, hint) {
			    if (typeof input !== "object" || input === null) return input;
			    var prim = input[Symbol.toPrimitive];

			    if (prim !== undefined) {
			      var res = prim.call(input, hint || "default");
			      if (typeof res !== "object") return res;
			      throw new TypeError("@@toPrimitive must return a primitive value.");
			    }

			    return (hint === "string" ? String : Number)(input);
			  }

			  function _toPropertyKey(arg) {
			    var key = _toPrimitive(arg, "string");

			    return typeof key === "symbol" ? key : String(key);
			  }

			  var renderErr = 'Renderer Error ☝️';
			  var actions = {
			    init: 'init'
			  };
			  var defaultRenderer = function defaultRenderer(_ref) {
			    var _ref$value = _ref.value,
			        value = _ref$value === void 0 ? '' : _ref$value;
			    return value;
			  };
			  var emptyRenderer = function emptyRenderer() {
			    return React.createElement(React.Fragment, null, "\xA0");
			  };
			  var defaultColumn = {
			    Cell: defaultRenderer,
			    width: 150,
			    minWidth: 0,
			    maxWidth: Number.MAX_SAFE_INTEGER
			  };

			  function mergeProps() {
			    for (var _len = arguments.length, propList = new Array(_len), _key = 0; _key < _len; _key++) {
			      propList[_key] = arguments[_key];
			    }

			    return propList.reduce(function (props, next) {
			      var style = next.style,
			          className = next.className,
			          rest = _objectWithoutPropertiesLoose(next, ["style", "className"]);

			      props = _extends({}, props, {}, rest);

			      if (style) {
			        props.style = props.style ? _extends({}, props.style || {}, {}, style || {}) : style;
			      }

			      if (className) {
			        props.className = props.className ? props.className + ' ' + className : className;
			      }

			      if (props.className === '') {
			        delete props.className;
			      }

			      return props;
			    }, {});
			  }

			  function handlePropGetter(prevProps, userProps, meta) {
			    // Handle a lambda, pass it the previous props
			    if (typeof userProps === 'function') {
			      return handlePropGetter({}, userProps(prevProps, meta));
			    } // Handle an array, merge each item as separate props


			    if (Array.isArray(userProps)) {
			      return mergeProps.apply(void 0, [prevProps].concat(userProps));
			    } // Handle an object by default, merge the two objects


			    return mergeProps(prevProps, userProps);
			  }

			  var makePropGetter = function makePropGetter(hooks, meta) {
			    if (meta === void 0) {
			      meta = {};
			    }

			    return function (userProps) {
			      if (userProps === void 0) {
			        userProps = {};
			      }

			      return [].concat(hooks, [userProps]).reduce(function (prev, next) {
			        return handlePropGetter(prev, next, _extends({}, meta, {
			          userProps: userProps
			        }));
			      }, {});
			    };
			  };
			  var reduceHooks = function reduceHooks(hooks, initial, meta, allowUndefined) {
			    if (meta === void 0) {
			      meta = {};
			    }

			    return hooks.reduce(function (prev, next) {
			      var nextValue = next(prev, meta);

			      {
			        if (!allowUndefined && typeof nextValue === 'undefined') {
			          console.info(next);
			          throw new Error('React Table: A reducer hook ☝️ just returned undefined! This is not allowed.');
			        }
			      }

			      return nextValue;
			    }, initial);
			  };
			  var loopHooks = function loopHooks(hooks, context, meta) {
			    if (meta === void 0) {
			      meta = {};
			    }

			    return hooks.forEach(function (hook) {
			      var nextValue = hook(context, meta);

			      {
			        if (typeof nextValue !== 'undefined') {
			          console.info(hook, nextValue);
			          throw new Error('React Table: A loop-type hook ☝️ just returned a value! This is not allowed.');
			        }
			      }
			    });
			  };
			  function ensurePluginOrder(plugins, befores, pluginName, afters) {
			    if ( afters) {
			      throw new Error("Defining plugins in the \"after\" section of ensurePluginOrder is no longer supported (see plugin " + pluginName + ")");
			    }

			    var pluginIndex = plugins.findIndex(function (plugin) {
			      return plugin.pluginName === pluginName;
			    });

			    if (pluginIndex === -1) {
			      {
			        throw new Error("The plugin \"" + pluginName + "\" was not found in the plugin list!\nThis usually means you need to need to name your plugin hook by setting the 'pluginName' property of the hook function, eg:\n\n  " + pluginName + ".pluginName = '" + pluginName + "'\n");
			      }
			    }

			    befores.forEach(function (before) {
			      var beforeIndex = plugins.findIndex(function (plugin) {
			        return plugin.pluginName === before;
			      });

			      if (beforeIndex > -1 && beforeIndex > pluginIndex) {
			        {
			          throw new Error("React Table: The " + pluginName + " plugin hook must be placed after the " + before + " plugin hook!");
			        }
			      }
			    });
			  }
			  function functionalUpdate(updater, old) {
			    return typeof updater === 'function' ? updater(old) : updater;
			  }
			  function useGetLatest(obj) {
			    var ref = React.useRef();
			    ref.current = obj;
			    return React.useCallback(function () {
			      return ref.current;
			    }, []);
			  } // SSR has issues with useLayoutEffect still, so use useEffect during SSR

			  var safeUseLayoutEffect = typeof document !== 'undefined' ? React.useLayoutEffect : React.useEffect;
			  function useMountedLayoutEffect(fn, deps) {
			    var mountedRef = React.useRef(false);
			    safeUseLayoutEffect(function () {
			      if (mountedRef.current) {
			        fn();
			      }

			      mountedRef.current = true; // eslint-disable-next-line
			    }, deps);
			  }
			  function useAsyncDebounce(defaultFn, defaultWait) {
			    if (defaultWait === void 0) {
			      defaultWait = 0;
			    }

			    var debounceRef = React.useRef({});
			    var getDefaultFn = useGetLatest(defaultFn);
			    var getDefaultWait = useGetLatest(defaultWait);
			    return React.useCallback(
			    /*#__PURE__*/
			    function () {
			      var _ref2 = _asyncToGenerator(
			      /*#__PURE__*/
			      regeneratorRuntime.mark(function _callee2() {
			        var _len2,
			            args,
			            _key2,
			            _args2 = arguments;

			        return regeneratorRuntime.wrap(function _callee2$(_context2) {
			          while (1) {
			            switch (_context2.prev = _context2.next) {
			              case 0:
			                for (_len2 = _args2.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
			                  args[_key2] = _args2[_key2];
			                }

			                if (!debounceRef.current.promise) {
			                  debounceRef.current.promise = new Promise(function (resolve, reject) {
			                    debounceRef.current.resolve = resolve;
			                    debounceRef.current.reject = reject;
			                  });
			                }

			                if (debounceRef.current.timeout) {
			                  clearTimeout(debounceRef.current.timeout);
			                }

			                debounceRef.current.timeout = setTimeout(
			                /*#__PURE__*/
			                _asyncToGenerator(
			                /*#__PURE__*/
			                regeneratorRuntime.mark(function _callee() {
			                  return regeneratorRuntime.wrap(function _callee$(_context) {
			                    while (1) {
			                      switch (_context.prev = _context.next) {
			                        case 0:
			                          delete debounceRef.current.timeout;
			                          _context.prev = 1;
			                          _context.t0 = debounceRef.current;
			                          _context.next = 5;
			                          return getDefaultFn().apply(void 0, args);

			                        case 5:
			                          _context.t1 = _context.sent;

			                          _context.t0.resolve.call(_context.t0, _context.t1);

			                          _context.next = 12;
			                          break;

			                        case 9:
			                          _context.prev = 9;
			                          _context.t2 = _context["catch"](1);
			                          debounceRef.current.reject(_context.t2);

			                        case 12:
			                          _context.prev = 12;
			                          delete debounceRef.current.promise;
			                          return _context.finish(12);

			                        case 15:
			                        case "end":
			                          return _context.stop();
			                      }
			                    }
			                  }, _callee, null, [[1, 9, 12, 15]]);
			                })), getDefaultWait());
			                return _context2.abrupt("return", debounceRef.current.promise);

			              case 5:
			              case "end":
			                return _context2.stop();
			            }
			          }
			        }, _callee2);
			      }));

			      return function () {
			        return _ref2.apply(this, arguments);
			      };
			    }(), [getDefaultFn, getDefaultWait]);
			  }
			  function makeRenderer(instance, column, meta) {
			    if (meta === void 0) {
			      meta = {};
			    }

			    return function (type, userProps) {
			      if (userProps === void 0) {
			        userProps = {};
			      }

			      var Comp = typeof type === 'string' ? column[type] : type;

			      if (typeof Comp === 'undefined') {
			        console.info(column);
			        throw new Error(renderErr);
			      }

			      return flexRender(Comp, _extends({}, instance, {
			        column: column
			      }, meta, {}, userProps));
			    };
			  }
			  function flexRender(Comp, props) {
			    return isReactComponent(Comp) ? React.createElement(Comp, props) : Comp;
			  }

			  function isReactComponent(component) {
			    return isClassComponent(component) || typeof component === 'function' || isExoticComponent(component);
			  }

			  function isClassComponent(component) {
			    return typeof component === 'function' && function () {
			      var proto = Object.getPrototypeOf(component);
			      return proto.prototype && proto.prototype.isReactComponent;
			    }();
			  }

			  function isExoticComponent(component) {
			    return typeof component === 'object' && typeof component.$$typeof === 'symbol' && ['react.memo', 'react.forward_ref'].includes(component.$$typeof.description);
			  }

			  function linkColumnStructure(columns, parent, depth) {
			    if (depth === void 0) {
			      depth = 0;
			    }

			    return columns.map(function (column) {
			      column = _extends({}, column, {
			        parent: parent,
			        depth: depth
			      });
			      assignColumnAccessor(column);

			      if (column.columns) {
			        column.columns = linkColumnStructure(column.columns, column, depth + 1);
			      }

			      return column;
			    });
			  }
			  function flattenColumns(columns) {
			    return flattenBy(columns, 'columns');
			  }
			  function assignColumnAccessor(column) {
			    // First check for string accessor
			    var id = column.id,
			        accessor = column.accessor,
			        Header = column.Header;

			    if (typeof accessor === 'string') {
			      id = id || accessor;
			      var accessorPath = accessor.split('.');

			      accessor = function accessor(row) {
			        return getBy(row, accessorPath);
			      };
			    }

			    if (!id && typeof Header === 'string' && Header) {
			      id = Header;
			    }

			    if (!id && column.columns) {
			      console.error(column);
			      throw new Error('A column ID (or unique "Header" value) is required!');
			    }

			    if (!id) {
			      console.error(column);
			      throw new Error('A column ID (or string accessor) is required!');
			    }

			    Object.assign(column, {
			      id: id,
			      accessor: accessor
			    });
			    return column;
			  }
			  function decorateColumn(column, userDefaultColumn) {
			    if (!userDefaultColumn) {
			      throw new Error();
			    }

			    Object.assign(column, _extends({
			      // Make sure there is a fallback header, just in case
			      Header: emptyRenderer,
			      Footer: emptyRenderer
			    }, defaultColumn, {}, userDefaultColumn, {}, column));
			    Object.assign(column, {
			      originalWidth: column.width
			    });
			    return column;
			  } // Build the header groups from the bottom up

			  function makeHeaderGroups(allColumns, defaultColumn, additionalHeaderProperties) {
			    if (additionalHeaderProperties === void 0) {
			      additionalHeaderProperties = function additionalHeaderProperties() {
			        return {};
			      };
			    }

			    var headerGroups = [];
			    var scanColumns = allColumns;
			    var uid = 0;

			    var getUID = function getUID() {
			      return uid++;
			    };

			    var _loop = function _loop() {
			      // The header group we are creating
			      var headerGroup = {
			        headers: []
			      }; // The parent columns we're going to scan next

			      var parentColumns = [];
			      var hasParents = scanColumns.some(function (d) {
			        return d.parent;
			      }); // Scan each column for parents

			      scanColumns.forEach(function (column) {
			        // What is the latest (last) parent column?
			        var latestParentColumn = [].concat(parentColumns).reverse()[0];
			        var newParent;

			        if (hasParents) {
			          // If the column has a parent, add it if necessary
			          if (column.parent) {
			            newParent = _extends({}, column.parent, {
			              originalId: column.parent.id,
			              id: column.parent.id + "_" + getUID(),
			              headers: [column]
			            }, additionalHeaderProperties(column));
			          } else {
			            // If other columns have parents, we'll need to add a place holder if necessary
			            var originalId = column.id + "_placeholder";
			            newParent = decorateColumn(_extends({
			              originalId: originalId,
			              id: column.id + "_placeholder_" + getUID(),
			              placeholderOf: column,
			              headers: [column]
			            }, additionalHeaderProperties(column)), defaultColumn);
			          } // If the resulting parent columns are the same, just add
			          // the column and increment the header span


			          if (latestParentColumn && latestParentColumn.originalId === newParent.originalId) {
			            latestParentColumn.headers.push(column);
			          } else {
			            parentColumns.push(newParent);
			          }
			        }

			        headerGroup.headers.push(column);
			      });
			      headerGroups.push(headerGroup); // Start scanning the parent columns

			      scanColumns = parentColumns;
			    };

			    while (scanColumns.length) {
			      _loop();
			    }

			    return headerGroups.reverse();
			  }
			  var pathObjCache = new Map();
			  function getBy(obj, path, def) {
			    if (!path) {
			      return obj;
			    }

			    var cacheKey = typeof path === 'function' ? path : JSON.stringify(path);

			    var pathObj = pathObjCache.get(cacheKey) || function () {
			      var pathObj = makePathArray(path);
			      pathObjCache.set(cacheKey, pathObj);
			      return pathObj;
			    }();

			    var val;

			    try {
			      val = pathObj.reduce(function (cursor, pathPart) {
			        return cursor[pathPart];
			      }, obj);
			    } catch (e) {// continue regardless of error
			    }

			    return typeof val !== 'undefined' ? val : def;
			  }
			  function getFirstDefined() {
			    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
			      args[_key] = arguments[_key];
			    }

			    for (var i = 0; i < args.length; i += 1) {
			      if (typeof args[i] !== 'undefined') {
			        return args[i];
			      }
			    }
			  }
			  function isFunction(a) {
			    if (typeof a === 'function') {
			      return a;
			    }
			  }
			  function flattenBy(arr, key) {
			    var flat = [];

			    var recurse = function recurse(arr) {
			      arr.forEach(function (d) {
			        if (!d[key]) {
			          flat.push(d);
			        } else {
			          recurse(d[key]);
			        }
			      });
			    };

			    recurse(arr);
			    return flat;
			  }
			  function expandRows(rows, _ref) {
			    var manualExpandedKey = _ref.manualExpandedKey,
			        expanded = _ref.expanded,
			        _ref$expandSubRows = _ref.expandSubRows,
			        expandSubRows = _ref$expandSubRows === void 0 ? true : _ref$expandSubRows;
			    var expandedRows = [];

			    var handleRow = function handleRow(row, addToExpandedRows) {
			      if (addToExpandedRows === void 0) {
			        addToExpandedRows = true;
			      }

			      row.isExpanded = row.original && row.original[manualExpandedKey] || expanded[row.id];
			      row.canExpand = row.subRows && !!row.subRows.length;

			      if (addToExpandedRows) {
			        expandedRows.push(row);
			      }

			      if (row.subRows && row.subRows.length && row.isExpanded) {
			        row.subRows.forEach(function (row) {
			          return handleRow(row, expandSubRows);
			        });
			      }
			    };

			    rows.forEach(function (row) {
			      return handleRow(row);
			    });
			    return expandedRows;
			  }
			  function getFilterMethod(filter, userFilterTypes, filterTypes) {
			    return isFunction(filter) || userFilterTypes[filter] || filterTypes[filter] || filterTypes.text;
			  }
			  function shouldAutoRemoveFilter(autoRemove, value, column) {
			    return autoRemove ? autoRemove(value, column) : typeof value === 'undefined';
			  }
			  function unpreparedAccessWarning() {
			    throw new Error('React-Table: You have not called prepareRow(row) one or more rows you are attempting to render.');
			  }
			  var passiveSupported = null;
			  function passiveEventSupported() {
			    // memoize support to avoid adding multiple test events
			    if (typeof passiveSupported === 'boolean') return passiveSupported;
			    var supported = false;

			    try {
			      var options = {
			        get passive() {
			          supported = true;
			          return false;
			        }

			      };
			      window.addEventListener('test', null, options);
			      window.removeEventListener('test', null, options);
			    } catch (err) {
			      supported = false;
			    }

			    passiveSupported = supported;
			    return passiveSupported;
			  } //

			  var reOpenBracket = /\[/g;
			  var reCloseBracket = /\]/g;

			  function makePathArray(obj) {
			    return flattenDeep(obj) // remove all periods in parts
			    .map(function (d) {
			      return String(d).replace('.', '_');
			    }) // join parts using period
			    .join('.') // replace brackets with periods
			    .replace(reOpenBracket, '.').replace(reCloseBracket, '') // split it back out on periods
			    .split('.');
			  }

			  function flattenDeep(arr, newArr) {
			    if (newArr === void 0) {
			      newArr = [];
			    }

			    if (!Array.isArray(arr)) {
			      newArr.push(arr);
			    } else {
			      for (var i = 0; i < arr.length; i += 1) {
			        flattenDeep(arr[i], newArr);
			      }
			    }

			    return newArr;
			  }

			  var defaultGetTableProps = function defaultGetTableProps(props) {
			    return _extends({
			      role: 'table'
			    }, props);
			  };

			  var defaultGetTableBodyProps = function defaultGetTableBodyProps(props) {
			    return _extends({
			      role: 'rowgroup'
			    }, props);
			  };

			  var defaultGetHeaderProps = function defaultGetHeaderProps(props, _ref) {
			    var column = _ref.column;
			    return _extends({
			      key: "header_" + column.id,
			      colSpan: column.totalVisibleHeaderCount,
			      role: 'columnheader'
			    }, props);
			  };

			  var defaultGetFooterProps = function defaultGetFooterProps(props, _ref2) {
			    var column = _ref2.column;
			    return _extends({
			      key: "footer_" + column.id,
			      colSpan: column.totalVisibleHeaderCount
			    }, props);
			  };

			  var defaultGetHeaderGroupProps = function defaultGetHeaderGroupProps(props, _ref3) {
			    var index = _ref3.index;
			    return _extends({
			      key: "headerGroup_" + index,
			      role: 'row'
			    }, props);
			  };

			  var defaultGetFooterGroupProps = function defaultGetFooterGroupProps(props, _ref4) {
			    var index = _ref4.index;
			    return _extends({
			      key: "footerGroup_" + index
			    }, props);
			  };

			  var defaultGetRowProps = function defaultGetRowProps(props, _ref5) {
			    var row = _ref5.row;
			    return _extends({
			      key: "row_" + row.id,
			      role: 'row'
			    }, props);
			  };

			  var defaultGetCellProps = function defaultGetCellProps(props, _ref6) {
			    var cell = _ref6.cell;
			    return _extends({
			      key: "cell_" + cell.row.id + "_" + cell.column.id,
			      role: 'cell'
			    }, props);
			  };

			  function makeDefaultPluginHooks() {
			    return {
			      useOptions: [],
			      stateReducers: [],
			      useControlledState: [],
			      columns: [],
			      columnsDeps: [],
			      allColumns: [],
			      allColumnsDeps: [],
			      accessValue: [],
			      materializedColumns: [],
			      materializedColumnsDeps: [],
			      useInstanceAfterData: [],
			      visibleColumns: [],
			      visibleColumnsDeps: [],
			      headerGroups: [],
			      headerGroupsDeps: [],
			      useInstanceBeforeDimensions: [],
			      useInstance: [],
			      prepareRow: [],
			      getTableProps: [defaultGetTableProps],
			      getTableBodyProps: [defaultGetTableBodyProps],
			      getHeaderGroupProps: [defaultGetHeaderGroupProps],
			      getFooterGroupProps: [defaultGetFooterGroupProps],
			      getHeaderProps: [defaultGetHeaderProps],
			      getFooterProps: [defaultGetFooterProps],
			      getRowProps: [defaultGetRowProps],
			      getCellProps: [defaultGetCellProps],
			      useFinalInstance: []
			    };
			  }

			  actions.resetHiddenColumns = 'resetHiddenColumns';
			  actions.toggleHideColumn = 'toggleHideColumn';
			  actions.setHiddenColumns = 'setHiddenColumns';
			  actions.toggleHideAllColumns = 'toggleHideAllColumns';
			  var useColumnVisibility = function useColumnVisibility(hooks) {
			    hooks.getToggleHiddenProps = [defaultGetToggleHiddenProps];
			    hooks.getToggleHideAllColumnsProps = [defaultGetToggleHideAllColumnsProps];
			    hooks.stateReducers.push(reducer);
			    hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions);
			    hooks.headerGroupsDeps.push(function (deps, _ref) {
			      var instance = _ref.instance;
			      return [].concat(deps, [instance.state.hiddenColumns]);
			    });
			    hooks.useInstance.push(useInstance);
			  };
			  useColumnVisibility.pluginName = 'useColumnVisibility';

			  var defaultGetToggleHiddenProps = function defaultGetToggleHiddenProps(props, _ref2) {
			    var column = _ref2.column;
			    return [props, {
			      onChange: function onChange(e) {
			        column.toggleHidden(!e.target.checked);
			      },
			      style: {
			        cursor: 'pointer'
			      },
			      checked: column.isVisible,
			      title: 'Toggle Column Visible'
			    }];
			  };

			  var defaultGetToggleHideAllColumnsProps = function defaultGetToggleHideAllColumnsProps(props, _ref3) {
			    var instance = _ref3.instance;
			    return [props, {
			      onChange: function onChange(e) {
			        instance.toggleHideAllColumns(!e.target.checked);
			      },
			      style: {
			        cursor: 'pointer'
			      },
			      checked: !instance.allColumnsHidden && !instance.state.hiddenColumns.length,
			      title: 'Toggle All Columns Hidden',
			      indeterminate: !instance.allColumnsHidden && instance.state.hiddenColumns.length
			    }];
			  };

			  function reducer(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        hiddenColumns: []
			      }, state);
			    }

			    if (action.type === actions.resetHiddenColumns) {
			      return _extends({}, state, {
			        hiddenColumns: instance.initialState.hiddenColumns || []
			      });
			    }

			    if (action.type === actions.toggleHideColumn) {
			      var should = typeof action.value !== 'undefined' ? action.value : !state.hiddenColumns.includes(action.columnId);
			      var hiddenColumns = should ? [].concat(state.hiddenColumns, [action.columnId]) : state.hiddenColumns.filter(function (d) {
			        return d !== action.columnId;
			      });
			      return _extends({}, state, {
			        hiddenColumns: hiddenColumns
			      });
			    }

			    if (action.type === actions.setHiddenColumns) {
			      return _extends({}, state, {
			        hiddenColumns: functionalUpdate(action.value, state.hiddenColumns)
			      });
			    }

			    if (action.type === actions.toggleHideAllColumns) {
			      var shouldAll = typeof action.value !== 'undefined' ? action.value : !state.hiddenColumns.length;
			      return _extends({}, state, {
			        hiddenColumns: shouldAll ? instance.allColumns.map(function (d) {
			          return d.id;
			        }) : []
			      });
			    }
			  }

			  function useInstanceBeforeDimensions(instance) {
			    var headers = instance.headers,
			        hiddenColumns = instance.state.hiddenColumns;
			    var isMountedRef = React.useRef(false);

			    if (!isMountedRef.current) ;

			    var handleColumn = function handleColumn(column, parentVisible) {
			      column.isVisible = parentVisible && !hiddenColumns.includes(column.id);
			      var totalVisibleHeaderCount = 0;

			      if (column.headers && column.headers.length) {
			        column.headers.forEach(function (subColumn) {
			          return totalVisibleHeaderCount += handleColumn(subColumn, column.isVisible);
			        });
			      } else {
			        totalVisibleHeaderCount = column.isVisible ? 1 : 0;
			      }

			      column.totalVisibleHeaderCount = totalVisibleHeaderCount;
			      return totalVisibleHeaderCount;
			    };

			    var totalVisibleHeaderCount = 0;
			    headers.forEach(function (subHeader) {
			      return totalVisibleHeaderCount += handleColumn(subHeader, true);
			    });
			  }

			  function useInstance(instance) {
			    var columns = instance.columns,
			        flatHeaders = instance.flatHeaders,
			        dispatch = instance.dispatch,
			        allColumns = instance.allColumns,
			        getHooks = instance.getHooks,
			        hiddenColumns = instance.state.hiddenColumns,
			        _instance$autoResetHi = instance.autoResetHiddenColumns,
			        autoResetHiddenColumns = _instance$autoResetHi === void 0 ? true : _instance$autoResetHi;
			    var getInstance = useGetLatest(instance);
			    var allColumnsHidden = allColumns.length === hiddenColumns.length;
			    var toggleHideColumn = React.useCallback(function (columnId, value) {
			      return dispatch({
			        type: actions.toggleHideColumn,
			        columnId: columnId,
			        value: value
			      });
			    }, [dispatch]);
			    var setHiddenColumns = React.useCallback(function (value) {
			      return dispatch({
			        type: actions.setHiddenColumns,
			        value: value
			      });
			    }, [dispatch]);
			    var toggleHideAllColumns = React.useCallback(function (value) {
			      return dispatch({
			        type: actions.toggleHideAllColumns,
			        value: value
			      });
			    }, [dispatch]);
			    var getToggleHideAllColumnsProps = makePropGetter(getHooks().getToggleHideAllColumnsProps, {
			      instance: getInstance()
			    });
			    flatHeaders.forEach(function (column) {
			      column.toggleHidden = function (value) {
			        dispatch({
			          type: actions.toggleHideColumn,
			          columnId: column.id,
			          value: value
			        });
			      };

			      column.getToggleHiddenProps = makePropGetter(getHooks().getToggleHiddenProps, {
			        instance: getInstance(),
			        column: column
			      });
			    });
			    var getAutoResetHiddenColumns = useGetLatest(autoResetHiddenColumns);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetHiddenColumns()) {
			        dispatch({
			          type: actions.resetHiddenColumns
			        });
			      }
			    }, [dispatch, columns]);
			    Object.assign(instance, {
			      allColumnsHidden: allColumnsHidden,
			      toggleHideColumn: toggleHideColumn,
			      setHiddenColumns: setHiddenColumns,
			      toggleHideAllColumns: toggleHideAllColumns,
			      getToggleHideAllColumnsProps: getToggleHideAllColumnsProps
			    });
			  }

			  var defaultInitialState = {};
			  var defaultColumnInstance = {};

			  var defaultReducer = function defaultReducer(state, action, prevState) {
			    return state;
			  };

			  var defaultGetSubRows = function defaultGetSubRows(row, index) {
			    return row.subRows || [];
			  };

			  var defaultGetRowId = function defaultGetRowId(row, index, parent) {
			    return "" + (parent ? [parent.id, index].join('.') : index);
			  };

			  var defaultUseControlledState = function defaultUseControlledState(d) {
			    return d;
			  };

			  function applyDefaults(props) {
			    var _props$initialState = props.initialState,
			        initialState = _props$initialState === void 0 ? defaultInitialState : _props$initialState,
			        _props$defaultColumn = props.defaultColumn,
			        defaultColumn = _props$defaultColumn === void 0 ? defaultColumnInstance : _props$defaultColumn,
			        _props$getSubRows = props.getSubRows,
			        getSubRows = _props$getSubRows === void 0 ? defaultGetSubRows : _props$getSubRows,
			        _props$getRowId = props.getRowId,
			        getRowId = _props$getRowId === void 0 ? defaultGetRowId : _props$getRowId,
			        _props$stateReducer = props.stateReducer,
			        stateReducer = _props$stateReducer === void 0 ? defaultReducer : _props$stateReducer,
			        _props$useControlledS = props.useControlledState,
			        useControlledState = _props$useControlledS === void 0 ? defaultUseControlledState : _props$useControlledS,
			        rest = _objectWithoutPropertiesLoose(props, ["initialState", "defaultColumn", "getSubRows", "getRowId", "stateReducer", "useControlledState"]);

			    return _extends({}, rest, {
			      initialState: initialState,
			      defaultColumn: defaultColumn,
			      getSubRows: getSubRows,
			      getRowId: getRowId,
			      stateReducer: stateReducer,
			      useControlledState: useControlledState
			    });
			  }

			  var useTable = function useTable(props) {
			    for (var _len = arguments.length, plugins = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
			      plugins[_key - 1] = arguments[_key];
			    }

			    // Apply default props
			    props = applyDefaults(props); // Add core plugins

			    plugins = [useColumnVisibility].concat(plugins); // Create the table instance

			    var instanceRef = React.useRef({}); // Create a getter for the instance (helps avoid a lot of potential memory leaks)

			    var getInstance = useGetLatest(instanceRef.current); // Assign the props, plugins and hooks to the instance

			    Object.assign(getInstance(), _extends({}, props, {
			      plugins: plugins,
			      hooks: makeDefaultPluginHooks()
			    })); // Allow plugins to register hooks as early as possible

			    plugins.filter(Boolean).forEach(function (plugin) {
			      plugin(getInstance().hooks);
			    }); // Consume all hooks and make a getter for them

			    var getHooks = useGetLatest(getInstance().hooks);
			    getInstance().getHooks = getHooks;
			    delete getInstance().hooks; // Allow useOptions hooks to modify the options coming into the table

			    Object.assign(getInstance(), reduceHooks(getHooks().useOptions, applyDefaults(props)));

			    var _getInstance = getInstance(),
			        data = _getInstance.data,
			        userColumns = _getInstance.columns,
			        initialState = _getInstance.initialState,
			        defaultColumn = _getInstance.defaultColumn,
			        getSubRows = _getInstance.getSubRows,
			        getRowId = _getInstance.getRowId,
			        stateReducer = _getInstance.stateReducer,
			        useControlledState = _getInstance.useControlledState; // Setup user reducer ref


			    var getStateReducer = useGetLatest(stateReducer); // Build the reducer

			    var reducer = React.useCallback(function (state, action) {
			      // Detect invalid actions
			      if (!action.type) {
			        console.info({
			          action: action
			        });
			        throw new Error('Unknown Action 👆');
			      } // Reduce the state from all plugin reducers


			      return [].concat(getHooks().stateReducers, Array.isArray(getStateReducer()) ? getStateReducer() : [getStateReducer()]).reduce(function (s, handler) {
			        return handler(s, action, state, getInstance()) || s;
			      }, state);
			    }, [getHooks, getStateReducer, getInstance]); // Start the reducer

			    var _React$useReducer = React.useReducer(reducer, undefined, function () {
			      return reducer(initialState, {
			        type: actions.init
			      });
			    }),
			        reducerState = _React$useReducer[0],
			        dispatch = _React$useReducer[1]; // Allow the user to control the final state with hooks


			    var state = reduceHooks([].concat(getHooks().useControlledState, [useControlledState]), reducerState, {
			      instance: getInstance()
			    });
			    Object.assign(getInstance(), {
			      state: state,
			      dispatch: dispatch
			    }); // Decorate All the columns

			    var columns = React.useMemo(function () {
			      return linkColumnStructure(reduceHooks(getHooks().columns, userColumns, {
			        instance: getInstance()
			      }));
			    }, [getHooks, getInstance, userColumns].concat(reduceHooks(getHooks().columnsDeps, [], {
			      instance: getInstance()
			    })));
			    getInstance().columns = columns; // Get the flat list of all columns and allow hooks to decorate
			    // those columns (and trigger this memoization via deps)

			    var allColumns = React.useMemo(function () {
			      return reduceHooks(getHooks().allColumns, flattenColumns(columns), {
			        instance: getInstance()
			      }).map(assignColumnAccessor);
			    }, [columns, getHooks, getInstance].concat(reduceHooks(getHooks().allColumnsDeps, [], {
			      instance: getInstance()
			    })));
			    getInstance().allColumns = allColumns; // Access the row model using initial columns

			    var _React$useMemo = React.useMemo(function () {
			      var rows = [];
			      var flatRows = [];
			      var rowsById = {};
			      var allColumnsQueue = [].concat(allColumns);

			      while (allColumnsQueue.length) {
			        var column = allColumnsQueue.shift();
			        accessRowsForColumn({
			          data: data,
			          rows: rows,
			          flatRows: flatRows,
			          rowsById: rowsById,
			          column: column,
			          getRowId: getRowId,
			          getSubRows: getSubRows,
			          accessValueHooks: getHooks().accessValue,
			          getInstance: getInstance
			        });
			      }

			      return [rows, flatRows, rowsById];
			    }, [allColumns, data, getRowId, getSubRows, getHooks, getInstance]),
			        rows = _React$useMemo[0],
			        flatRows = _React$useMemo[1],
			        rowsById = _React$useMemo[2];

			    Object.assign(getInstance(), {
			      rows: rows,
			      initialRows: [].concat(rows),
			      flatRows: flatRows,
			      rowsById: rowsById // materializedColumns,

			    });
			    loopHooks(getHooks().useInstanceAfterData, getInstance()); // Get the flat list of all columns AFTER the rows
			    // have been access, and allow hooks to decorate
			    // those columns (and trigger this memoization via deps)

			    var visibleColumns = React.useMemo(function () {
			      return reduceHooks(getHooks().visibleColumns, allColumns, {
			        instance: getInstance()
			      }).map(function (d) {
			        return decorateColumn(d, defaultColumn);
			      });
			    }, [getHooks, allColumns, getInstance, defaultColumn].concat(reduceHooks(getHooks().visibleColumnsDeps, [], {
			      instance: getInstance()
			    }))); // Combine new visible columns with all columns

			    allColumns = React.useMemo(function () {
			      var columns = [].concat(visibleColumns);
			      allColumns.forEach(function (column) {
			        if (!columns.find(function (d) {
			          return d.id === column.id;
			        })) {
			          columns.push(column);
			        }
			      });
			      return columns;
			    }, [allColumns, visibleColumns]);
			    getInstance().allColumns = allColumns;

			    {
			      var duplicateColumns = allColumns.filter(function (column, i) {
			        return allColumns.findIndex(function (d) {
			          return d.id === column.id;
			        }) !== i;
			      });

			      if (duplicateColumns.length) {
			        console.info(allColumns);
			        throw new Error("Duplicate columns were found with ids: \"" + duplicateColumns.map(function (d) {
			          return d.id;
			        }).join(', ') + "\" in the columns array above");
			      }
			    } // Make the headerGroups


			    var headerGroups = React.useMemo(function () {
			      return reduceHooks(getHooks().headerGroups, makeHeaderGroups(visibleColumns, defaultColumn), getInstance());
			    }, [getHooks, visibleColumns, defaultColumn, getInstance].concat(reduceHooks(getHooks().headerGroupsDeps, [], {
			      instance: getInstance()
			    })));
			    getInstance().headerGroups = headerGroups; // Get the first level of headers

			    var headers = React.useMemo(function () {
			      return headerGroups.length ? headerGroups[0].headers : [];
			    }, [headerGroups]);
			    getInstance().headers = headers; // Provide a flat header list for utilities

			    getInstance().flatHeaders = headerGroups.reduce(function (all, headerGroup) {
			      return [].concat(all, headerGroup.headers);
			    }, []);
			    loopHooks(getHooks().useInstanceBeforeDimensions, getInstance()); // Filter columns down to visible ones

			    var visibleColumnsDep = visibleColumns.filter(function (d) {
			      return d.isVisible;
			    }).map(function (d) {
			      return d.id;
			    }).sort().join('_');
			    visibleColumns = React.useMemo(function () {
			      return visibleColumns.filter(function (d) {
			        return d.isVisible;
			      });
			    }, // eslint-disable-next-line react-hooks/exhaustive-deps
			    [visibleColumns, visibleColumnsDep]);
			    getInstance().visibleColumns = visibleColumns; // Header Visibility is needed by this point

			    var _calculateHeaderWidth = calculateHeaderWidths(headers),
			        totalColumnsMinWidth = _calculateHeaderWidth[0],
			        totalColumnsWidth = _calculateHeaderWidth[1],
			        totalColumnsMaxWidth = _calculateHeaderWidth[2];

			    getInstance().totalColumnsMinWidth = totalColumnsMinWidth;
			    getInstance().totalColumnsWidth = totalColumnsWidth;
			    getInstance().totalColumnsMaxWidth = totalColumnsMaxWidth;
			    loopHooks(getHooks().useInstance, getInstance()) // Each materialized header needs to be assigned a render function and other
			    // prop getter properties here.
			    ;
			    [].concat(getInstance().flatHeaders, getInstance().allColumns).forEach(function (column) {
			      // Give columns/headers rendering power
			      column.render = makeRenderer(getInstance(), column); // Give columns/headers a default getHeaderProps

			      column.getHeaderProps = makePropGetter(getHooks().getHeaderProps, {
			        instance: getInstance(),
			        column: column
			      }); // Give columns/headers a default getFooterProps

			      column.getFooterProps = makePropGetter(getHooks().getFooterProps, {
			        instance: getInstance(),
			        column: column
			      });
			    });
			    getInstance().headerGroups = React.useMemo(function () {
			      return headerGroups.filter(function (headerGroup, i) {
			        // Filter out any headers and headerGroups that don't have visible columns
			        headerGroup.headers = headerGroup.headers.filter(function (column) {
			          var recurse = function recurse(headers) {
			            return headers.filter(function (column) {
			              if (column.headers) {
			                return recurse(column.headers);
			              }

			              return column.isVisible;
			            }).length;
			          };

			          if (column.headers) {
			            return recurse(column.headers);
			          }

			          return column.isVisible;
			        }); // Give headerGroups getRowProps

			        if (headerGroup.headers.length) {
			          headerGroup.getHeaderGroupProps = makePropGetter(getHooks().getHeaderGroupProps, {
			            instance: getInstance(),
			            headerGroup: headerGroup,
			            index: i
			          });
			          headerGroup.getFooterGroupProps = makePropGetter(getHooks().getFooterGroupProps, {
			            instance: getInstance(),
			            headerGroup: headerGroup,
			            index: i
			          });
			          return true;
			        }

			        return false;
			      });
			    }, [headerGroups, getInstance, getHooks]);
			    getInstance().footerGroups = [].concat(getInstance().headerGroups).reverse(); // The prepareRow function is absolutely necessary and MUST be called on
			    // any rows the user wishes to be displayed.

			    getInstance().prepareRow = React.useCallback(function (row) {
			      row.getRowProps = makePropGetter(getHooks().getRowProps, {
			        instance: getInstance(),
			        row: row
			      }); // Build the visible cells for each row

			      row.allCells = allColumns.map(function (column) {
			        var value = row.values[column.id];
			        var cell = {
			          column: column,
			          row: row,
			          value: value
			        }; // Give each cell a getCellProps base

			        cell.getCellProps = makePropGetter(getHooks().getCellProps, {
			          instance: getInstance(),
			          cell: cell
			        }); // Give each cell a renderer function (supports multiple renderers)

			        cell.render = makeRenderer(getInstance(), column, {
			          row: row,
			          cell: cell,
			          value: value
			        });
			        return cell;
			      });
			      row.cells = visibleColumns.map(function (column) {
			        return row.allCells.find(function (cell) {
			          return cell.column.id === column.id;
			        });
			      }); // need to apply any row specific hooks (useExpanded requires this)

			      loopHooks(getHooks().prepareRow, row, {
			        instance: getInstance()
			      });
			    }, [getHooks, getInstance, allColumns, visibleColumns]);
			    getInstance().getTableProps = makePropGetter(getHooks().getTableProps, {
			      instance: getInstance()
			    });
			    getInstance().getTableBodyProps = makePropGetter(getHooks().getTableBodyProps, {
			      instance: getInstance()
			    });
			    loopHooks(getHooks().useFinalInstance, getInstance());
			    return getInstance();
			  };

			  function calculateHeaderWidths(headers, left) {
			    if (left === void 0) {
			      left = 0;
			    }

			    var sumTotalMinWidth = 0;
			    var sumTotalWidth = 0;
			    var sumTotalMaxWidth = 0;
			    var sumTotalFlexWidth = 0;
			    headers.forEach(function (header) {
			      var subHeaders = header.headers;
			      header.totalLeft = left;

			      if (subHeaders && subHeaders.length) {
			        var _calculateHeaderWidth2 = calculateHeaderWidths(subHeaders, left),
			            totalMinWidth = _calculateHeaderWidth2[0],
			            totalWidth = _calculateHeaderWidth2[1],
			            totalMaxWidth = _calculateHeaderWidth2[2],
			            totalFlexWidth = _calculateHeaderWidth2[3];

			        header.totalMinWidth = totalMinWidth;
			        header.totalWidth = totalWidth;
			        header.totalMaxWidth = totalMaxWidth;
			        header.totalFlexWidth = totalFlexWidth;
			      } else {
			        header.totalMinWidth = header.minWidth;
			        header.totalWidth = Math.min(Math.max(header.minWidth, header.width), header.maxWidth);
			        header.totalMaxWidth = header.maxWidth;
			        header.totalFlexWidth = header.canResize ? header.totalWidth : 0;
			      }

			      if (header.isVisible) {
			        left += header.totalWidth;
			        sumTotalMinWidth += header.totalMinWidth;
			        sumTotalWidth += header.totalWidth;
			        sumTotalMaxWidth += header.totalMaxWidth;
			        sumTotalFlexWidth += header.totalFlexWidth;
			      }
			    });
			    return [sumTotalMinWidth, sumTotalWidth, sumTotalMaxWidth, sumTotalFlexWidth];
			  }

			  function accessRowsForColumn(_ref) {
			    var data = _ref.data,
			        rows = _ref.rows,
			        flatRows = _ref.flatRows,
			        rowsById = _ref.rowsById,
			        column = _ref.column,
			        getRowId = _ref.getRowId,
			        getSubRows = _ref.getSubRows,
			        accessValueHooks = _ref.accessValueHooks,
			        getInstance = _ref.getInstance;

			    // Access the row's data column-by-column
			    // We do it this way so we can incrementally add materialized
			    // columns after the first pass and avoid excessive looping
			    var accessRow = function accessRow(originalRow, rowIndex, depth, parent, parentRows) {
			      if (depth === void 0) {
			        depth = 0;
			      }

			      // Keep the original reference around
			      var original = originalRow;
			      var id = getRowId(originalRow, rowIndex, parent);
			      var row = rowsById[id]; // If the row hasn't been created, let's make it

			      if (!row) {
			        row = {
			          id: id,
			          original: original,
			          index: rowIndex,
			          depth: depth,
			          cells: [{}] // This is a dummy cell

			        }; // Override common array functions (and the dummy cell's getCellProps function)
			        // to show an error if it is accessed without calling prepareRow

			        row.cells.map = unpreparedAccessWarning;
			        row.cells.filter = unpreparedAccessWarning;
			        row.cells.forEach = unpreparedAccessWarning;
			        row.cells[0].getCellProps = unpreparedAccessWarning; // Create the cells and values

			        row.values = {}; // Push this row into the parentRows array

			        parentRows.push(row); // Keep track of every row in a flat array

			        flatRows.push(row); // Also keep track of every row by its ID

			        rowsById[id] = row; // Get the original subrows

			        row.originalSubRows = getSubRows(originalRow, rowIndex); // Then recursively access them

			        if (row.originalSubRows) {
			          var subRows = [];
			          row.originalSubRows.forEach(function (d, i) {
			            return accessRow(d, i, depth + 1, row, subRows);
			          }); // Keep the new subRows array on the row

			          row.subRows = subRows;
			        }
			      } else if (row.subRows) {
			        // If the row exists, then it's already been accessed
			        // Keep recursing, but don't worry about passing the
			        // accumlator array (those rows already exist)
			        row.originalSubRows.forEach(function (d, i) {
			          return accessRow(d, i, depth + 1, row);
			        });
			      } // If the column has an accessor, use it to get a value


			      if (column.accessor) {
			        row.values[column.id] = column.accessor(originalRow, rowIndex, row, parentRows, data);
			      } // Allow plugins to manipulate the column value


			      row.values[column.id] = reduceHooks(accessValueHooks, row.values[column.id], {
			        row: row,
			        column: column,
			        instance: getInstance()
			      }, true);
			    };

			    data.forEach(function (originalRow, rowIndex) {
			      return accessRow(originalRow, rowIndex, 0, undefined, rows);
			    });
			  }

			  actions.resetExpanded = 'resetExpanded';
			  actions.toggleRowExpanded = 'toggleRowExpanded';
			  actions.toggleAllRowsExpanded = 'toggleAllRowsExpanded';
			  var useExpanded = function useExpanded(hooks) {
			    hooks.getToggleAllRowsExpandedProps = [defaultGetToggleAllRowsExpandedProps];
			    hooks.getToggleRowExpandedProps = [defaultGetToggleRowExpandedProps];
			    hooks.stateReducers.push(reducer$1);
			    hooks.useInstance.push(useInstance$1);
			    hooks.prepareRow.push(prepareRow);
			  };
			  useExpanded.pluginName = 'useExpanded';

			  var defaultGetToggleAllRowsExpandedProps = function defaultGetToggleAllRowsExpandedProps(props, _ref) {
			    var instance = _ref.instance;
			    return [props, {
			      onClick: function onClick(e) {
			        instance.toggleAllRowsExpanded();
			      },
			      style: {
			        cursor: 'pointer'
			      },
			      title: 'Toggle All Rows Expanded'
			    }];
			  };

			  var defaultGetToggleRowExpandedProps = function defaultGetToggleRowExpandedProps(props, _ref2) {
			    var row = _ref2.row;
			    return [props, {
			      onClick: function onClick() {
			        row.toggleRowExpanded();
			      },
			      style: {
			        cursor: 'pointer'
			      },
			      title: 'Toggle Row Expanded'
			    }];
			  }; // Reducer


			  function reducer$1(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        expanded: {}
			      }, state);
			    }

			    if (action.type === actions.resetExpanded) {
			      return _extends({}, state, {
			        expanded: instance.initialState.expanded || {}
			      });
			    }

			    if (action.type === actions.toggleAllRowsExpanded) {
			      var value = action.value;
			      var isAllRowsExpanded = instance.isAllRowsExpanded,
			          rowsById = instance.rowsById;
			      var expandAll = typeof value !== 'undefined' ? value : !isAllRowsExpanded;

			      if (expandAll) {
			        var expanded = {};
			        Object.keys(rowsById).forEach(function (rowId) {
			          expanded[rowId] = true;
			        });
			        return _extends({}, state, {
			          expanded: expanded
			        });
			      }

			      return _extends({}, state, {
			        expanded: {}
			      });
			    }

			    if (action.type === actions.toggleRowExpanded) {
			      var id = action.id,
			          setExpanded = action.value;
			      var exists = state.expanded[id];
			      var shouldExist = typeof setExpanded !== 'undefined' ? setExpanded : !exists;

			      if (!exists && shouldExist) {
			        var _extends2;

			        return _extends({}, state, {
			          expanded: _extends({}, state.expanded, (_extends2 = {}, _extends2[id] = true, _extends2))
			        });
			      } else if (exists && !shouldExist) {
			        var _state$expanded = state.expanded;
			            _state$expanded[id];
			            var rest = _objectWithoutPropertiesLoose(_state$expanded, [id].map(_toPropertyKey));

			        return _extends({}, state, {
			          expanded: rest
			        });
			      } else {
			        return state;
			      }
			    }
			  }

			  function useInstance$1(instance) {
			    var data = instance.data,
			        rows = instance.rows,
			        rowsById = instance.rowsById,
			        _instance$manualExpan = instance.manualExpandedKey,
			        manualExpandedKey = _instance$manualExpan === void 0 ? 'expanded' : _instance$manualExpan,
			        _instance$paginateExp = instance.paginateExpandedRows,
			        paginateExpandedRows = _instance$paginateExp === void 0 ? true : _instance$paginateExp,
			        _instance$expandSubRo = instance.expandSubRows,
			        expandSubRows = _instance$expandSubRo === void 0 ? true : _instance$expandSubRo,
			        _instance$autoResetEx = instance.autoResetExpanded,
			        autoResetExpanded = _instance$autoResetEx === void 0 ? true : _instance$autoResetEx,
			        getHooks = instance.getHooks,
			        plugins = instance.plugins,
			        expanded = instance.state.expanded,
			        dispatch = instance.dispatch;
			    ensurePluginOrder(plugins, ['useSortBy', 'useGroupBy', 'usePivotColumns', 'useGlobalFilter'], 'useExpanded');
			    var getAutoResetExpanded = useGetLatest(autoResetExpanded);
			    var isAllRowsExpanded = Boolean(Object.keys(rowsById).length && Object.keys(expanded).length);

			    if (isAllRowsExpanded) {
			      if (Object.keys(rowsById).some(function (id) {
			        return !expanded[id];
			      })) {
			        isAllRowsExpanded = false;
			      }
			    } // Bypass any effects from firing when this changes


			    useMountedLayoutEffect(function () {
			      if (getAutoResetExpanded()) {
			        dispatch({
			          type: actions.resetExpanded
			        });
			      }
			    }, [dispatch, data]);
			    var toggleRowExpanded = React.useCallback(function (id, value) {
			      dispatch({
			        type: actions.toggleRowExpanded,
			        id: id,
			        value: value
			      });
			    }, [dispatch]);
			    var toggleAllRowsExpanded = React.useCallback(function (value) {
			      return dispatch({
			        type: actions.toggleAllRowsExpanded,
			        value: value
			      });
			    }, [dispatch]);
			    var expandedRows = React.useMemo(function () {
			      if (paginateExpandedRows) {
			        return expandRows(rows, {
			          manualExpandedKey: manualExpandedKey,
			          expanded: expanded,
			          expandSubRows: expandSubRows
			        });
			      }

			      return rows;
			    }, [paginateExpandedRows, rows, manualExpandedKey, expanded, expandSubRows]);
			    var expandedDepth = React.useMemo(function () {
			      return findExpandedDepth(expanded);
			    }, [expanded]);
			    var getInstance = useGetLatest(instance);
			    var getToggleAllRowsExpandedProps = makePropGetter(getHooks().getToggleAllRowsExpandedProps, {
			      instance: getInstance()
			    });
			    Object.assign(instance, {
			      preExpandedRows: rows,
			      expandedRows: expandedRows,
			      rows: expandedRows,
			      expandedDepth: expandedDepth,
			      isAllRowsExpanded: isAllRowsExpanded,
			      toggleRowExpanded: toggleRowExpanded,
			      toggleAllRowsExpanded: toggleAllRowsExpanded,
			      getToggleAllRowsExpandedProps: getToggleAllRowsExpandedProps
			    });
			  }

			  function prepareRow(row, _ref3) {
			    var getHooks = _ref3.instance.getHooks,
			        instance = _ref3.instance;

			    row.toggleRowExpanded = function (set) {
			      return instance.toggleRowExpanded(row.id, set);
			    };

			    row.getToggleRowExpandedProps = makePropGetter(getHooks().getToggleRowExpandedProps, {
			      instance: instance,
			      row: row
			    });
			  }

			  function findExpandedDepth(expanded) {
			    var maxDepth = 0;
			    Object.keys(expanded).forEach(function (id) {
			      var splitId = id.split('.');
			      maxDepth = Math.max(maxDepth, splitId.length);
			    });
			    return maxDepth;
			  }

			  var text = function text(rows, ids, filterValue) {
			    rows = rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return String(rowValue).toLowerCase().includes(String(filterValue).toLowerCase());
			      });
			    });
			    return rows;
			  };

			  text.autoRemove = function (val) {
			    return !val;
			  };

			  var exactText = function exactText(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return rowValue !== undefined ? String(rowValue).toLowerCase() === String(filterValue).toLowerCase() : true;
			      });
			    });
			  };

			  exactText.autoRemove = function (val) {
			    return !val;
			  };

			  var exactTextCase = function exactTextCase(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return rowValue !== undefined ? String(rowValue) === String(filterValue) : true;
			      });
			    });
			  };

			  exactTextCase.autoRemove = function (val) {
			    return !val;
			  };

			  var includes = function includes(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return rowValue.includes(filterValue);
			      });
			    });
			  };

			  includes.autoRemove = function (val) {
			    return !val || !val.length;
			  };

			  var includesAll = function includesAll(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return rowValue && rowValue.length && filterValue.every(function (val) {
			          return rowValue.includes(val);
			        });
			      });
			    });
			  };

			  includesAll.autoRemove = function (val) {
			    return !val || !val.length;
			  };

			  var includesSome = function includesSome(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return rowValue && rowValue.length && filterValue.some(function (val) {
			          return rowValue.includes(val);
			        });
			      });
			    });
			  };

			  includesSome.autoRemove = function (val) {
			    return !val || !val.length;
			  };

			  var includesValue = function includesValue(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return filterValue.includes(rowValue);
			      });
			    });
			  };

			  includesValue.autoRemove = function (val) {
			    return !val || !val.length;
			  };

			  var exact = function exact(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return rowValue === filterValue;
			      });
			    });
			  };

			  exact.autoRemove = function (val) {
			    return typeof val === 'undefined';
			  };

			  var equals = function equals(rows, ids, filterValue) {
			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id]; // eslint-disable-next-line eqeqeq

			        return rowValue == filterValue;
			      });
			    });
			  };

			  equals.autoRemove = function (val) {
			    return val == null;
			  };

			  var between = function between(rows, ids, filterValue) {
			    var _ref = filterValue || [],
			        min = _ref[0],
			        max = _ref[1];

			    min = typeof min === 'number' ? min : -Infinity;
			    max = typeof max === 'number' ? max : Infinity;

			    if (min > max) {
			      var temp = min;
			      min = max;
			      max = temp;
			    }

			    return rows.filter(function (row) {
			      return ids.some(function (id) {
			        var rowValue = row.values[id];
			        return rowValue >= min && rowValue <= max;
			      });
			    });
			  };

			  between.autoRemove = function (val) {
			    return !val || typeof val[0] !== 'number' && typeof val[1] !== 'number';
			  };

			  var filterTypes = /*#__PURE__*/Object.freeze({
			    __proto__: null,
			    text: text,
			    exactText: exactText,
			    exactTextCase: exactTextCase,
			    includes: includes,
			    includesAll: includesAll,
			    includesSome: includesSome,
			    includesValue: includesValue,
			    exact: exact,
			    equals: equals,
			    between: between
			  });

			  actions.resetFilters = 'resetFilters';
			  actions.setFilter = 'setFilter';
			  actions.setAllFilters = 'setAllFilters';
			  var useFilters = function useFilters(hooks) {
			    hooks.stateReducers.push(reducer$2);
			    hooks.useInstance.push(useInstance$2);
			  };
			  useFilters.pluginName = 'useFilters';

			  function reducer$2(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        filters: []
			      }, state);
			    }

			    if (action.type === actions.resetFilters) {
			      return _extends({}, state, {
			        filters: instance.initialState.filters || []
			      });
			    }

			    if (action.type === actions.setFilter) {
			      var columnId = action.columnId,
			          filterValue = action.filterValue;
			      var allColumns = instance.allColumns,
			          userFilterTypes = instance.filterTypes;
			      var column = allColumns.find(function (d) {
			        return d.id === columnId;
			      });

			      if (!column) {
			        throw new Error("React-Table: Could not find a column with id: " + columnId);
			      }

			      var filterMethod = getFilterMethod(column.filter, userFilterTypes || {}, filterTypes);
			      var previousfilter = state.filters.find(function (d) {
			        return d.id === columnId;
			      });
			      var newFilter = functionalUpdate(filterValue, previousfilter && previousfilter.value); //

			      if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter, column)) {
			        return _extends({}, state, {
			          filters: state.filters.filter(function (d) {
			            return d.id !== columnId;
			          })
			        });
			      }

			      if (previousfilter) {
			        return _extends({}, state, {
			          filters: state.filters.map(function (d) {
			            if (d.id === columnId) {
			              return {
			                id: columnId,
			                value: newFilter
			              };
			            }

			            return d;
			          })
			        });
			      }

			      return _extends({}, state, {
			        filters: [].concat(state.filters, [{
			          id: columnId,
			          value: newFilter
			        }])
			      });
			    }

			    if (action.type === actions.setAllFilters) {
			      var filters = action.filters;
			      var _allColumns = instance.allColumns,
			          _userFilterTypes = instance.filterTypes;
			      return _extends({}, state, {
			        // Filter out undefined values
			        filters: functionalUpdate(filters, state.filters).filter(function (filter) {
			          var column = _allColumns.find(function (d) {
			            return d.id === filter.id;
			          });

			          var filterMethod = getFilterMethod(column.filter, _userFilterTypes || {}, filterTypes);

			          if (shouldAutoRemoveFilter(filterMethod.autoRemove, filter.value, column)) {
			            return false;
			          }

			          return true;
			        })
			      });
			    }
			  }

			  function useInstance$2(instance) {
			    var data = instance.data,
			        rows = instance.rows,
			        flatRows = instance.flatRows,
			        rowsById = instance.rowsById,
			        allColumns = instance.allColumns,
			        userFilterTypes = instance.filterTypes,
			        manualFilters = instance.manualFilters,
			        _instance$defaultCanF = instance.defaultCanFilter,
			        defaultCanFilter = _instance$defaultCanF === void 0 ? false : _instance$defaultCanF,
			        disableFilters = instance.disableFilters,
			        filters = instance.state.filters,
			        dispatch = instance.dispatch,
			        _instance$autoResetFi = instance.autoResetFilters,
			        autoResetFilters = _instance$autoResetFi === void 0 ? true : _instance$autoResetFi;
			    var setFilter = React.useCallback(function (columnId, filterValue) {
			      dispatch({
			        type: actions.setFilter,
			        columnId: columnId,
			        filterValue: filterValue
			      });
			    }, [dispatch]);
			    var setAllFilters = React.useCallback(function (filters) {
			      dispatch({
			        type: actions.setAllFilters,
			        filters: filters
			      });
			    }, [dispatch]);
			    allColumns.forEach(function (column) {
			      var id = column.id,
			          accessor = column.accessor,
			          columnDefaultCanFilter = column.defaultCanFilter,
			          columnDisableFilters = column.disableFilters; // Determine if a column is filterable

			      column.canFilter = accessor ? getFirstDefined(columnDisableFilters === true ? false : undefined, disableFilters === true ? false : undefined, true) : getFirstDefined(columnDefaultCanFilter, defaultCanFilter, false); // Provide the column a way of updating the filter value

			      column.setFilter = function (val) {
			        return setFilter(column.id, val);
			      }; // Provide the current filter value to the column for
			      // convenience


			      var found = filters.find(function (d) {
			        return d.id === id;
			      });
			      column.filterValue = found && found.value;
			    });

			    var _React$useMemo = React.useMemo(function () {
			      if (manualFilters || !filters.length) {
			        return [rows, flatRows, rowsById];
			      }

			      var filteredFlatRows = [];
			      var filteredRowsById = {}; // Filters top level and nested rows

			      var filterRows = function filterRows(rows, depth) {
			        if (depth === void 0) {
			          depth = 0;
			        }

			        var filteredRows = rows;
			        filteredRows = filters.reduce(function (filteredSoFar, _ref) {
			          var columnId = _ref.id,
			              filterValue = _ref.value;
			          // Find the filters column
			          var column = allColumns.find(function (d) {
			            return d.id === columnId;
			          });

			          if (!column) {
			            return filteredSoFar;
			          }

			          if (depth === 0) {
			            column.preFilteredRows = filteredSoFar;
			          }

			          var filterMethod = getFilterMethod(column.filter, userFilterTypes || {}, filterTypes);

			          if (!filterMethod) {
			            console.warn("Could not find a valid 'column.filter' for column with the ID: " + column.id + ".");
			            return filteredSoFar;
			          } // Pass the rows, id, filterValue and column to the filterMethod
			          // to get the filtered rows back


			          column.filteredRows = filterMethod(filteredSoFar, [columnId], filterValue);
			          return column.filteredRows;
			        }, rows); // Apply the filter to any subRows
			        // We technically could do this recursively in the above loop,
			        // but that would severely hinder the API for the user, since they
			        // would be required to do that recursion in some scenarios

			        filteredRows.forEach(function (row) {
			          filteredFlatRows.push(row);
			          filteredRowsById[row.id] = row;

			          if (!row.subRows) {
			            return;
			          }

			          row.subRows = row.subRows && row.subRows.length > 0 ? filterRows(row.subRows, depth + 1) : row.subRows;
			        });
			        return filteredRows;
			      };

			      return [filterRows(rows), filteredFlatRows, filteredRowsById];
			    }, [manualFilters, filters, rows, flatRows, rowsById, allColumns, userFilterTypes]),
			        filteredRows = _React$useMemo[0],
			        filteredFlatRows = _React$useMemo[1],
			        filteredRowsById = _React$useMemo[2];

			    React.useMemo(function () {
			      // Now that each filtered column has it's partially filtered rows,
			      // lets assign the final filtered rows to all of the other columns
			      var nonFilteredColumns = allColumns.filter(function (column) {
			        return !filters.find(function (d) {
			          return d.id === column.id;
			        });
			      }); // This essentially enables faceted filter options to be built easily
			      // using every column's preFilteredRows value

			      nonFilteredColumns.forEach(function (column) {
			        column.preFilteredRows = filteredRows;
			        column.filteredRows = filteredRows;
			      });
			    }, [filteredRows, filters, allColumns]);
			    var getAutoResetFilters = useGetLatest(autoResetFilters);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetFilters()) {
			        dispatch({
			          type: actions.resetFilters
			        });
			      }
			    }, [dispatch, manualFilters ? null : data]);
			    Object.assign(instance, {
			      preFilteredRows: rows,
			      preFilteredFlatRows: flatRows,
			      preFilteredRowsById: rowsById,
			      filteredRows: filteredRows,
			      filteredFlatRows: filteredFlatRows,
			      filteredRowsById: filteredRowsById,
			      rows: filteredRows,
			      flatRows: filteredFlatRows,
			      rowsById: filteredRowsById,
			      setFilter: setFilter,
			      setAllFilters: setAllFilters
			    });
			  }

			  actions.resetGlobalFilter = 'resetGlobalFilter';
			  actions.setGlobalFilter = 'setGlobalFilter';
			  var useGlobalFilter = function useGlobalFilter(hooks) {
			    hooks.stateReducers.push(reducer$3);
			    hooks.useInstance.push(useInstance$3);
			  };
			  useGlobalFilter.pluginName = 'useGlobalFilter';

			  function reducer$3(state, action, previousState, instance) {
			    if (action.type === actions.resetGlobalFilter) {
			      return _extends({}, state, {
			        globalFilter: instance.initialState.globalFilter || undefined
			      });
			    }

			    if (action.type === actions.setGlobalFilter) {
			      var filterValue = action.filterValue;
			      var userFilterTypes = instance.userFilterTypes;
			      var filterMethod = getFilterMethod(instance.globalFilter, userFilterTypes || {}, filterTypes);
			      var newFilter = functionalUpdate(filterValue, state.globalFilter); //

			      if (shouldAutoRemoveFilter(filterMethod.autoRemove, newFilter)) {
			        state.globalFilter;
			            var stateWithoutGlobalFilter = _objectWithoutPropertiesLoose(state, ["globalFilter"]);

			        return stateWithoutGlobalFilter;
			      }

			      return _extends({}, state, {
			        globalFilter: newFilter
			      });
			    }
			  }

			  function useInstance$3(instance) {
			    var data = instance.data,
			        rows = instance.rows,
			        flatRows = instance.flatRows,
			        rowsById = instance.rowsById,
			        allColumns = instance.allColumns,
			        userFilterTypes = instance.filterTypes,
			        globalFilter = instance.globalFilter,
			        manualGlobalFilter = instance.manualGlobalFilter,
			        globalFilterValue = instance.state.globalFilter,
			        dispatch = instance.dispatch,
			        _instance$autoResetGl = instance.autoResetGlobalFilter,
			        autoResetGlobalFilter = _instance$autoResetGl === void 0 ? true : _instance$autoResetGl,
			        disableGlobalFilter = instance.disableGlobalFilter;
			    var setGlobalFilter = React.useCallback(function (filterValue) {
			      dispatch({
			        type: actions.setGlobalFilter,
			        filterValue: filterValue
			      });
			    }, [dispatch]); // TODO: Create a filter cache for incremental high speed multi-filtering
			    // This gets pretty complicated pretty fast, since you have to maintain a
			    // cache for each row group (top-level rows, and each row's recursive subrows)
			    // This would make multi-filtering a lot faster though. Too far?

			    var _React$useMemo = React.useMemo(function () {
			      if (manualGlobalFilter || typeof globalFilterValue === 'undefined') {
			        return [rows, flatRows, rowsById];
			      }

			      var filteredFlatRows = [];
			      var filteredRowsById = {};
			      var filterMethod = getFilterMethod(globalFilter, userFilterTypes || {}, filterTypes);

			      if (!filterMethod) {
			        console.warn("Could not find a valid 'globalFilter' option.");
			        return rows;
			      }

			      allColumns.forEach(function (column) {
			        var columnDisableGlobalFilter = column.disableGlobalFilter;
			        column.canFilter = getFirstDefined(columnDisableGlobalFilter === true ? false : undefined, disableGlobalFilter === true ? false : undefined, true);
			      });
			      var filterableColumns = allColumns.filter(function (c) {
			        return c.canFilter === true;
			      }); // Filters top level and nested rows

			      var filterRows = function filterRows(filteredRows) {
			        filteredRows = filterMethod(filteredRows, filterableColumns.map(function (d) {
			          return d.id;
			        }), globalFilterValue);
			        filteredRows.forEach(function (row) {
			          filteredFlatRows.push(row);
			          filteredRowsById[row.id] = row;
			          row.subRows = row.subRows && row.subRows.length ? filterRows(row.subRows) : row.subRows;
			        });
			        return filteredRows;
			      };

			      return [filterRows(rows), filteredFlatRows, filteredRowsById];
			    }, [manualGlobalFilter, globalFilterValue, globalFilter, userFilterTypes, allColumns, rows, flatRows, rowsById, disableGlobalFilter]),
			        globalFilteredRows = _React$useMemo[0],
			        globalFilteredFlatRows = _React$useMemo[1],
			        globalFilteredRowsById = _React$useMemo[2];

			    var getAutoResetGlobalFilter = useGetLatest(autoResetGlobalFilter);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetGlobalFilter()) {
			        dispatch({
			          type: actions.resetGlobalFilter
			        });
			      }
			    }, [dispatch, manualGlobalFilter ? null : data]);
			    Object.assign(instance, {
			      preGlobalFilteredRows: rows,
			      preGlobalFilteredFlatRows: flatRows,
			      preGlobalFilteredRowsById: rowsById,
			      globalFilteredRows: globalFilteredRows,
			      globalFilteredFlatRows: globalFilteredFlatRows,
			      globalFilteredRowsById: globalFilteredRowsById,
			      rows: globalFilteredRows,
			      flatRows: globalFilteredFlatRows,
			      rowsById: globalFilteredRowsById,
			      setGlobalFilter: setGlobalFilter,
			      disableGlobalFilter: disableGlobalFilter
			    });
			  }

			  function sum(values, aggregatedValues) {
			    // It's faster to just add the aggregations together instead of
			    // process leaf nodes individually
			    return aggregatedValues.reduce(function (sum, next) {
			      return sum + (typeof next === 'number' ? next : 0);
			    }, 0);
			  }
			  function min(values) {
			    var min = values[0] || 0;
			    values.forEach(function (value) {
			      if (typeof value === 'number') {
			        min = Math.min(min, value);
			      }
			    });
			    return min;
			  }
			  function max(values) {
			    var max = values[0] || 0;
			    values.forEach(function (value) {
			      if (typeof value === 'number') {
			        max = Math.max(max, value);
			      }
			    });
			    return max;
			  }
			  function minMax(values) {
			    var min = values[0] || 0;
			    var max = values[0] || 0;
			    values.forEach(function (value) {
			      if (typeof value === 'number') {
			        min = Math.min(min, value);
			        max = Math.max(max, value);
			      }
			    });
			    return min + ".." + max;
			  }
			  function average(values) {
			    return sum(null, values) / values.length;
			  }
			  function median(values) {
			    if (!values.length) {
			      return null;
			    }

			    var mid = Math.floor(values.length / 2);
			    var nums = [].concat(values).sort(function (a, b) {
			      return a - b;
			    });
			    return values.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
			  }
			  function unique(values) {
			    return Array.from(new Set(values).values());
			  }
			  function uniqueCount(values) {
			    return new Set(values).size;
			  }
			  function count(values) {
			    return values.length;
			  }

			  var aggregations = /*#__PURE__*/Object.freeze({
			    __proto__: null,
			    sum: sum,
			    min: min,
			    max: max,
			    minMax: minMax,
			    average: average,
			    median: median,
			    unique: unique,
			    uniqueCount: uniqueCount,
			    count: count
			  });

			  var emptyArray = [];
			  var emptyObject = {}; // Actions

			  actions.resetGroupBy = 'resetGroupBy';
			  actions.setGroupBy = 'setGroupBy';
			  actions.toggleGroupBy = 'toggleGroupBy';
			  var useGroupBy = function useGroupBy(hooks) {
			    hooks.getGroupByToggleProps = [defaultGetGroupByToggleProps];
			    hooks.stateReducers.push(reducer$4);
			    hooks.visibleColumnsDeps.push(function (deps, _ref) {
			      var instance = _ref.instance;
			      return [].concat(deps, [instance.state.groupBy]);
			    });
			    hooks.visibleColumns.push(visibleColumns);
			    hooks.useInstance.push(useInstance$4);
			    hooks.prepareRow.push(prepareRow$1);
			  };
			  useGroupBy.pluginName = 'useGroupBy';

			  var defaultGetGroupByToggleProps = function defaultGetGroupByToggleProps(props, _ref2) {
			    var header = _ref2.header;
			    return [props, {
			      onClick: header.canGroupBy ? function (e) {
			        e.persist();
			        header.toggleGroupBy();
			      } : undefined,
			      style: {
			        cursor: header.canGroupBy ? 'pointer' : undefined
			      },
			      title: 'Toggle GroupBy'
			    }];
			  }; // Reducer


			  function reducer$4(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        groupBy: []
			      }, state);
			    }

			    if (action.type === actions.resetGroupBy) {
			      return _extends({}, state, {
			        groupBy: instance.initialState.groupBy || []
			      });
			    }

			    if (action.type === actions.setGroupBy) {
			      var value = action.value;
			      return _extends({}, state, {
			        groupBy: value
			      });
			    }

			    if (action.type === actions.toggleGroupBy) {
			      var columnId = action.columnId,
			          setGroupBy = action.value;
			      var resolvedGroupBy = typeof setGroupBy !== 'undefined' ? setGroupBy : !state.groupBy.includes(columnId);

			      if (resolvedGroupBy) {
			        return _extends({}, state, {
			          groupBy: [].concat(state.groupBy, [columnId])
			        });
			      }

			      return _extends({}, state, {
			        groupBy: state.groupBy.filter(function (d) {
			          return d !== columnId;
			        })
			      });
			    }
			  }

			  function visibleColumns(columns, _ref3) {
			    var groupBy = _ref3.instance.state.groupBy;
			    // Sort grouped columns to the start of the column list
			    // before the headers are built
			    var groupByColumns = groupBy.map(function (g) {
			      return columns.find(function (col) {
			        return col.id === g;
			      });
			    }).filter(Boolean);
			    var nonGroupByColumns = columns.filter(function (col) {
			      return !groupBy.includes(col.id);
			    });
			    columns = [].concat(groupByColumns, nonGroupByColumns);
			    columns.forEach(function (column) {
			      column.isGrouped = groupBy.includes(column.id);
			      column.groupedIndex = groupBy.indexOf(column.id);
			    });
			    return columns;
			  }

			  var defaultUserAggregations = {};

			  function useInstance$4(instance) {
			    var data = instance.data,
			        rows = instance.rows,
			        flatRows = instance.flatRows,
			        rowsById = instance.rowsById,
			        allColumns = instance.allColumns,
			        flatHeaders = instance.flatHeaders,
			        _instance$groupByFn = instance.groupByFn,
			        groupByFn = _instance$groupByFn === void 0 ? defaultGroupByFn : _instance$groupByFn,
			        manualGroupBy = instance.manualGroupBy,
			        _instance$aggregation = instance.aggregations,
			        userAggregations = _instance$aggregation === void 0 ? defaultUserAggregations : _instance$aggregation,
			        plugins = instance.plugins,
			        groupBy = instance.state.groupBy,
			        dispatch = instance.dispatch,
			        _instance$autoResetGr = instance.autoResetGroupBy,
			        autoResetGroupBy = _instance$autoResetGr === void 0 ? true : _instance$autoResetGr,
			        disableGroupBy = instance.disableGroupBy,
			        defaultCanGroupBy = instance.defaultCanGroupBy,
			        getHooks = instance.getHooks;
			    ensurePluginOrder(plugins, ['useColumnOrder', 'useFilters'], 'useGroupBy');
			    var getInstance = useGetLatest(instance);
			    allColumns.forEach(function (column) {
			      var accessor = column.accessor,
			          defaultColumnGroupBy = column.defaultGroupBy,
			          columnDisableGroupBy = column.disableGroupBy;
			      column.canGroupBy = accessor ? getFirstDefined(column.canGroupBy, columnDisableGroupBy === true ? false : undefined, disableGroupBy === true ? false : undefined, true) : getFirstDefined(column.canGroupBy, defaultColumnGroupBy, defaultCanGroupBy, false);

			      if (column.canGroupBy) {
			        column.toggleGroupBy = function () {
			          return instance.toggleGroupBy(column.id);
			        };
			      }

			      column.Aggregated = column.Aggregated || column.Cell;
			    });
			    var toggleGroupBy = React.useCallback(function (columnId, value) {
			      dispatch({
			        type: actions.toggleGroupBy,
			        columnId: columnId,
			        value: value
			      });
			    }, [dispatch]);
			    var setGroupBy = React.useCallback(function (value) {
			      dispatch({
			        type: actions.setGroupBy,
			        value: value
			      });
			    }, [dispatch]);
			    flatHeaders.forEach(function (header) {
			      header.getGroupByToggleProps = makePropGetter(getHooks().getGroupByToggleProps, {
			        instance: getInstance(),
			        header: header
			      });
			    });

			    var _React$useMemo = React.useMemo(function () {
			      if (manualGroupBy || !groupBy.length) {
			        return [rows, flatRows, rowsById, emptyArray, emptyObject, flatRows, rowsById];
			      } // Ensure that the list of filtered columns exist


			      var existingGroupBy = groupBy.filter(function (g) {
			        return allColumns.find(function (col) {
			          return col.id === g;
			        });
			      }); // Find the columns that can or are aggregating
			      // Uses each column to aggregate rows into a single value

			      var aggregateRowsToValues = function aggregateRowsToValues(leafRows, groupedRows, depth) {
			        var values = {};
			        allColumns.forEach(function (column) {
			          // Don't aggregate columns that are in the groupBy
			          if (existingGroupBy.includes(column.id)) {
			            values[column.id] = groupedRows[0] ? groupedRows[0].values[column.id] : null;
			            return;
			          } // Aggregate the values


			          var aggregateFn = typeof column.aggregate === 'function' ? column.aggregate : userAggregations[column.aggregate] || aggregations[column.aggregate];

			          if (aggregateFn) {
			            // Get the columnValues to aggregate
			            var groupedValues = groupedRows.map(function (row) {
			              return row.values[column.id];
			            }); // Get the columnValues to aggregate

			            var leafValues = leafRows.map(function (row) {
			              var columnValue = row.values[column.id];

			              if (!depth && column.aggregateValue) {
			                var aggregateValueFn = typeof column.aggregateValue === 'function' ? column.aggregateValue : userAggregations[column.aggregateValue] || aggregations[column.aggregateValue];

			                if (!aggregateValueFn) {
			                  console.info({
			                    column: column
			                  });
			                  throw new Error("React Table: Invalid column.aggregateValue option for column listed above");
			                }

			                columnValue = aggregateValueFn(columnValue, row, column);
			              }

			              return columnValue;
			            });
			            values[column.id] = aggregateFn(leafValues, groupedValues);
			          } else if (column.aggregate) {
			            console.info({
			              column: column
			            });
			            throw new Error("React Table: Invalid column.aggregate option for column listed above");
			          } else {
			            values[column.id] = null;
			          }
			        });
			        return values;
			      };

			      var groupedFlatRows = [];
			      var groupedRowsById = {};
			      var onlyGroupedFlatRows = [];
			      var onlyGroupedRowsById = {};
			      var nonGroupedFlatRows = [];
			      var nonGroupedRowsById = {}; // Recursively group the data

			      var groupUpRecursively = function groupUpRecursively(rows, depth, parentId) {
			        if (depth === void 0) {
			          depth = 0;
			        }

			        // This is the last level, just return the rows
			        if (depth === existingGroupBy.length) {
			          return rows;
			        }

			        var columnId = existingGroupBy[depth]; // Group the rows together for this level

			        var rowGroupsMap = groupByFn(rows, columnId); // Peform aggregations for each group

			        var aggregatedGroupedRows = Object.entries(rowGroupsMap).map(function (_ref4, index) {
			          var groupByVal = _ref4[0],
			              groupedRows = _ref4[1];
			          var id = columnId + ":" + groupByVal;
			          id = parentId ? parentId + ">" + id : id; // First, Recurse to group sub rows before aggregation

			          var subRows = groupUpRecursively(groupedRows, depth + 1, id); // Flatten the leaf rows of the rows in this group

			          var leafRows = depth ? flattenBy(groupedRows, 'leafRows') : groupedRows;
			          var values = aggregateRowsToValues(leafRows, groupedRows, depth);
			          var row = {
			            id: id,
			            isGrouped: true,
			            groupByID: columnId,
			            groupByVal: groupByVal,
			            values: values,
			            subRows: subRows,
			            leafRows: leafRows,
			            depth: depth,
			            index: index
			          };
			          subRows.forEach(function (subRow) {
			            groupedFlatRows.push(subRow);
			            groupedRowsById[subRow.id] = subRow;

			            if (subRow.isGrouped) {
			              onlyGroupedFlatRows.push(subRow);
			              onlyGroupedRowsById[subRow.id] = subRow;
			            } else {
			              nonGroupedFlatRows.push(subRow);
			              nonGroupedRowsById[subRow.id] = subRow;
			            }
			          });
			          return row;
			        });
			        return aggregatedGroupedRows;
			      };

			      var groupedRows = groupUpRecursively(rows);
			      groupedRows.forEach(function (subRow) {
			        groupedFlatRows.push(subRow);
			        groupedRowsById[subRow.id] = subRow;

			        if (subRow.isGrouped) {
			          onlyGroupedFlatRows.push(subRow);
			          onlyGroupedRowsById[subRow.id] = subRow;
			        } else {
			          nonGroupedFlatRows.push(subRow);
			          nonGroupedRowsById[subRow.id] = subRow;
			        }
			      }); // Assign the new data

			      return [groupedRows, groupedFlatRows, groupedRowsById, onlyGroupedFlatRows, onlyGroupedRowsById, nonGroupedFlatRows, nonGroupedRowsById];
			    }, [manualGroupBy, groupBy, rows, flatRows, rowsById, allColumns, userAggregations, groupByFn]),
			        groupedRows = _React$useMemo[0],
			        groupedFlatRows = _React$useMemo[1],
			        groupedRowsById = _React$useMemo[2],
			        onlyGroupedFlatRows = _React$useMemo[3],
			        onlyGroupedRowsById = _React$useMemo[4],
			        nonGroupedFlatRows = _React$useMemo[5],
			        nonGroupedRowsById = _React$useMemo[6];

			    var getAutoResetGroupBy = useGetLatest(autoResetGroupBy);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetGroupBy()) {
			        dispatch({
			          type: actions.resetGroupBy
			        });
			      }
			    }, [dispatch, manualGroupBy ? null : data]);
			    Object.assign(instance, {
			      preGroupedRows: rows,
			      preGroupedFlatRow: flatRows,
			      preGroupedRowsById: rowsById,
			      groupedRows: groupedRows,
			      groupedFlatRows: groupedFlatRows,
			      groupedRowsById: groupedRowsById,
			      onlyGroupedFlatRows: onlyGroupedFlatRows,
			      onlyGroupedRowsById: onlyGroupedRowsById,
			      nonGroupedFlatRows: nonGroupedFlatRows,
			      nonGroupedRowsById: nonGroupedRowsById,
			      rows: groupedRows,
			      flatRows: groupedFlatRows,
			      rowsById: groupedRowsById,
			      toggleGroupBy: toggleGroupBy,
			      setGroupBy: setGroupBy
			    });
			  }

			  function prepareRow$1(row) {
			    row.allCells.forEach(function (cell) {
			      var _row$subRows;

			      // Grouped cells are in the groupBy and the pivot cell for the row
			      cell.isGrouped = cell.column.isGrouped && cell.column.id === row.groupByID; // Placeholder cells are any columns in the groupBy that are not grouped

			      cell.isPlaceholder = !cell.isGrouped && cell.column.isGrouped; // Aggregated cells are not grouped, not repeated, but still have subRows

			      cell.isAggregated = !cell.isGrouped && !cell.isPlaceholder && ((_row$subRows = row.subRows) == null ? void 0 : _row$subRows.length);
			    });
			  }

			  function defaultGroupByFn(rows, columnId) {
			    return rows.reduce(function (prev, row, i) {
			      // TODO: Might want to implement a key serializer here so
			      // irregular column values can still be grouped if needed?
			      var resKey = "" + row.values[columnId];
			      prev[resKey] = Array.isArray(prev[resKey]) ? prev[resKey] : [];
			      prev[resKey].push(row);
			      return prev;
			    }, {});
			  }

			  var reSplitAlphaNumeric = /([0-9]+)/gm; // Mixed sorting is slow, but very inclusive of many edge cases.
			  // It handles numbers, mixed alphanumeric combinations, and even
			  // null, undefined, and Infinity

			  var alphanumeric = function alphanumeric(rowA, rowB, columnId) {
			    var _getRowValuesByColumn = getRowValuesByColumnID(rowA, rowB, columnId),
			        a = _getRowValuesByColumn[0],
			        b = _getRowValuesByColumn[1]; // Force to strings (or "" for unsupported types)


			    a = toString(a);
			    b = toString(b); // Split on number groups, but keep the delimiter
			    // Then remove falsey split values

			    a = a.split(reSplitAlphaNumeric).filter(Boolean);
			    b = b.split(reSplitAlphaNumeric).filter(Boolean); // While

			    while (a.length && b.length) {
			      var aa = a.shift();
			      var bb = b.shift();
			      var an = parseInt(aa, 10);
			      var bn = parseInt(bb, 10);
			      var combo = [an, bn].sort(); // Both are string

			      if (isNaN(combo[0])) {
			        if (aa > bb) {
			          return 1;
			        }

			        if (bb > aa) {
			          return -1;
			        }

			        continue;
			      } // One is a string, one is a number


			      if (isNaN(combo[1])) {
			        return isNaN(an) ? -1 : 1;
			      } // Both are numbers


			      if (an > bn) {
			        return 1;
			      }

			      if (bn > an) {
			        return -1;
			      }
			    }

			    return a.length - b.length;
			  };
			  function datetime(rowA, rowB, columnId) {
			    var _getRowValuesByColumn2 = getRowValuesByColumnID(rowA, rowB, columnId),
			        a = _getRowValuesByColumn2[0],
			        b = _getRowValuesByColumn2[1];

			    a = a.getTime();
			    b = b.getTime();
			    return compareBasic(a, b);
			  }
			  function basic(rowA, rowB, columnId) {
			    var _getRowValuesByColumn3 = getRowValuesByColumnID(rowA, rowB, columnId),
			        a = _getRowValuesByColumn3[0],
			        b = _getRowValuesByColumn3[1];

			    return compareBasic(a, b);
			  }
			  function string(rowA, rowB, columnId) {
			    var _getRowValuesByColumn4 = getRowValuesByColumnID(rowA, rowB, columnId),
			        a = _getRowValuesByColumn4[0],
			        b = _getRowValuesByColumn4[1];

			    a = a.split('').filter(Boolean);
			    b = b.split('').filter(Boolean);

			    while (a.length && b.length) {
			      var aa = a.shift();
			      var bb = b.shift();
			      var alower = aa.toLowerCase();
			      var blower = bb.toLowerCase(); // Case insensitive comparison until characters match

			      if (alower > blower) {
			        return 1;
			      }

			      if (blower > alower) {
			        return -1;
			      } // If lowercase characters are identical


			      if (aa > bb) {
			        return 1;
			      }

			      if (bb > aa) {
			        return -1;
			      }

			      continue;
			    }

			    return a.length - b.length;
			  }
			  function number(rowA, rowB, columnId) {
			    var _getRowValuesByColumn5 = getRowValuesByColumnID(rowA, rowB, columnId),
			        a = _getRowValuesByColumn5[0],
			        b = _getRowValuesByColumn5[1];

			    var replaceNonNumeric = /[^0-9.]/gi;
			    a = Number(String(a).replace(replaceNonNumeric, ''));
			    b = Number(String(b).replace(replaceNonNumeric, ''));
			    return compareBasic(a, b);
			  } // Utils

			  function compareBasic(a, b) {
			    return a === b ? 0 : a > b ? 1 : -1;
			  }

			  function getRowValuesByColumnID(row1, row2, columnId) {
			    return [row1.values[columnId], row2.values[columnId]];
			  }

			  function toString(a) {
			    if (typeof a === 'number') {
			      if (isNaN(a) || a === Infinity || a === -Infinity) {
			        return '';
			      }

			      return String(a);
			    }

			    if (typeof a === 'string') {
			      return a;
			    }

			    return '';
			  }

			  var sortTypes = /*#__PURE__*/Object.freeze({
			    __proto__: null,
			    alphanumeric: alphanumeric,
			    datetime: datetime,
			    basic: basic,
			    string: string,
			    number: number
			  });

			  actions.resetSortBy = 'resetSortBy';
			  actions.setSortBy = 'setSortBy';
			  actions.toggleSortBy = 'toggleSortBy';
			  actions.clearSortBy = 'clearSortBy';
			  defaultColumn.sortType = 'alphanumeric';
			  defaultColumn.sortDescFirst = false;
			  var useSortBy = function useSortBy(hooks) {
			    hooks.getSortByToggleProps = [defaultGetSortByToggleProps];
			    hooks.stateReducers.push(reducer$5);
			    hooks.useInstance.push(useInstance$5);
			  };
			  useSortBy.pluginName = 'useSortBy';

			  var defaultGetSortByToggleProps = function defaultGetSortByToggleProps(props, _ref) {
			    var instance = _ref.instance,
			        column = _ref.column;
			    var _instance$isMultiSort = instance.isMultiSortEvent,
			        isMultiSortEvent = _instance$isMultiSort === void 0 ? function (e) {
			      return e.shiftKey;
			    } : _instance$isMultiSort;
			    return [props, {
			      onClick: column.canSort ? function (e) {
			        e.persist();
			        column.toggleSortBy(undefined, !instance.disableMultiSort && isMultiSortEvent(e));
			      } : undefined,
			      style: {
			        cursor: column.canSort ? 'pointer' : undefined
			      },
			      title: column.canSort ? 'Toggle SortBy' : undefined
			    }];
			  }; // Reducer


			  function reducer$5(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        sortBy: []
			      }, state);
			    }

			    if (action.type === actions.resetSortBy) {
			      return _extends({}, state, {
			        sortBy: instance.initialState.sortBy || []
			      });
			    }

			    if (action.type === actions.clearSortBy) {
			      var sortBy = state.sortBy;
			      var newSortBy = sortBy.filter(function (d) {
			        return d.id !== action.columnId;
			      });
			      return _extends({}, state, {
			        sortBy: newSortBy
			      });
			    }

			    if (action.type === actions.setSortBy) {
			      var _sortBy = action.sortBy;
			      return _extends({}, state, {
			        sortBy: _sortBy
			      });
			    }

			    if (action.type === actions.toggleSortBy) {
			      var columnId = action.columnId,
			          desc = action.desc,
			          multi = action.multi;
			      var allColumns = instance.allColumns,
			          disableMultiSort = instance.disableMultiSort,
			          disableSortRemove = instance.disableSortRemove,
			          disableMultiRemove = instance.disableMultiRemove,
			          _instance$maxMultiSor = instance.maxMultiSortColCount,
			          maxMultiSortColCount = _instance$maxMultiSor === void 0 ? Number.MAX_SAFE_INTEGER : _instance$maxMultiSor;
			      var _sortBy2 = state.sortBy; // Find the column for this columnId

			      var column = allColumns.find(function (d) {
			        return d.id === columnId;
			      });
			      var sortDescFirst = column.sortDescFirst; // Find any existing sortBy for this column

			      var existingSortBy = _sortBy2.find(function (d) {
			        return d.id === columnId;
			      });

			      var existingIndex = _sortBy2.findIndex(function (d) {
			        return d.id === columnId;
			      });

			      var hasDescDefined = typeof desc !== 'undefined' && desc !== null;
			      var _newSortBy = []; // What should we do with this sort action?

			      var sortAction;

			      if (!disableMultiSort && multi) {
			        if (existingSortBy) {
			          sortAction = 'toggle';
			        } else {
			          sortAction = 'add';
			        }
			      } else {
			        // Normal mode
			        if (existingIndex !== _sortBy2.length - 1 || _sortBy2.length !== 1) {
			          sortAction = 'replace';
			        } else if (existingSortBy) {
			          sortAction = 'toggle';
			        } else {
			          sortAction = 'replace';
			        }
			      } // Handle toggle states that will remove the sortBy


			      if (sortAction === 'toggle' && // Must be toggling
			      !disableSortRemove && // If disableSortRemove, disable in general
			      !hasDescDefined && ( // Must not be setting desc
			      multi ? !disableMultiRemove : true) && ( // If multi, don't allow if disableMultiRemove
			      existingSortBy && // Finally, detect if it should indeed be removed
			      existingSortBy.desc && !sortDescFirst || !existingSortBy.desc && sortDescFirst)) {
			        sortAction = 'remove';
			      }

			      if (sortAction === 'replace') {
			        _newSortBy = [{
			          id: columnId,
			          desc: hasDescDefined ? desc : sortDescFirst
			        }];
			      } else if (sortAction === 'add') {
			        _newSortBy = [].concat(_sortBy2, [{
			          id: columnId,
			          desc: hasDescDefined ? desc : sortDescFirst
			        }]); // Take latest n columns

			        _newSortBy.splice(0, _newSortBy.length - maxMultiSortColCount);
			      } else if (sortAction === 'toggle') {
			        // This flips (or sets) the
			        _newSortBy = _sortBy2.map(function (d) {
			          if (d.id === columnId) {
			            return _extends({}, d, {
			              desc: hasDescDefined ? desc : !existingSortBy.desc
			            });
			          }

			          return d;
			        });
			      } else if (sortAction === 'remove') {
			        _newSortBy = _sortBy2.filter(function (d) {
			          return d.id !== columnId;
			        });
			      }

			      return _extends({}, state, {
			        sortBy: _newSortBy
			      });
			    }
			  }

			  function useInstance$5(instance) {
			    var data = instance.data,
			        rows = instance.rows,
			        flatRows = instance.flatRows,
			        allColumns = instance.allColumns,
			        _instance$orderByFn = instance.orderByFn,
			        orderByFn = _instance$orderByFn === void 0 ? defaultOrderByFn : _instance$orderByFn,
			        userSortTypes = instance.sortTypes,
			        manualSortBy = instance.manualSortBy,
			        defaultCanSort = instance.defaultCanSort,
			        disableSortBy = instance.disableSortBy,
			        flatHeaders = instance.flatHeaders,
			        sortBy = instance.state.sortBy,
			        dispatch = instance.dispatch,
			        plugins = instance.plugins,
			        getHooks = instance.getHooks,
			        _instance$autoResetSo = instance.autoResetSortBy,
			        autoResetSortBy = _instance$autoResetSo === void 0 ? true : _instance$autoResetSo;
			    ensurePluginOrder(plugins, ['useFilters', 'useGlobalFilter', 'useGroupBy', 'usePivotColumns'], 'useSortBy');
			    var setSortBy = React.useCallback(function (sortBy) {
			      dispatch({
			        type: actions.setSortBy,
			        sortBy: sortBy
			      });
			    }, [dispatch]); // Updates sorting based on a columnId, desc flag and multi flag

			    var toggleSortBy = React.useCallback(function (columnId, desc, multi) {
			      dispatch({
			        type: actions.toggleSortBy,
			        columnId: columnId,
			        desc: desc,
			        multi: multi
			      });
			    }, [dispatch]); // use reference to avoid memory leak in #1608

			    var getInstance = useGetLatest(instance); // Add the getSortByToggleProps method to columns and headers

			    flatHeaders.forEach(function (column) {
			      var accessor = column.accessor,
			          defaultColumnCanSort = column.canSort,
			          columnDisableSortBy = column.disableSortBy,
			          id = column.id;
			      var canSort = accessor ? getFirstDefined(columnDisableSortBy === true ? false : undefined, disableSortBy === true ? false : undefined, true) : getFirstDefined(defaultCanSort, defaultColumnCanSort, false);
			      column.canSort = canSort;

			      if (column.canSort) {
			        column.toggleSortBy = function (desc, multi) {
			          return toggleSortBy(column.id, desc, multi);
			        };

			        column.clearSortBy = function () {
			          dispatch({
			            type: actions.clearSortBy,
			            columnId: column.id
			          });
			        };
			      }

			      column.getSortByToggleProps = makePropGetter(getHooks().getSortByToggleProps, {
			        instance: getInstance(),
			        column: column
			      });
			      var columnSort = sortBy.find(function (d) {
			        return d.id === id;
			      });
			      column.isSorted = !!columnSort;
			      column.sortedIndex = sortBy.findIndex(function (d) {
			        return d.id === id;
			      });
			      column.isSortedDesc = column.isSorted ? columnSort.desc : undefined;
			    });

			    var _React$useMemo = React.useMemo(function () {
			      if (manualSortBy || !sortBy.length) {
			        return [rows, flatRows];
			      }

			      var sortedFlatRows = []; // Filter out sortBys that correspond to non existing columns

			      var availableSortBy = sortBy.filter(function (sort) {
			        return allColumns.find(function (col) {
			          return col.id === sort.id;
			        });
			      });

			      var sortData = function sortData(rows) {
			        // Use the orderByFn to compose multiple sortBy's together.
			        // This will also perform a stable sorting using the row index
			        // if needed.
			        var sortedData = orderByFn(rows, availableSortBy.map(function (sort) {
			          // Support custom sorting methods for each column
			          var column = allColumns.find(function (d) {
			            return d.id === sort.id;
			          });

			          if (!column) {
			            throw new Error("React-Table: Could not find a column with id: " + sort.id + " while sorting");
			          }

			          var sortType = column.sortType; // Look up sortBy functions in this order:
			          // column function
			          // column string lookup on user sortType
			          // column string lookup on built-in sortType
			          // default function
			          // default string lookup on user sortType
			          // default string lookup on built-in sortType

			          var sortMethod = isFunction(sortType) || (userSortTypes || {})[sortType] || sortTypes[sortType];

			          if (!sortMethod) {
			            throw new Error("React-Table: Could not find a valid sortType of '" + sortType + "' for column '" + sort.id + "'.");
			          } // Return the correct sortFn.
			          // This function should always return in ascending order


			          return function (a, b) {
			            return sortMethod(a, b, sort.id, sort.desc);
			          };
			        }), // Map the directions
			        availableSortBy.map(function (sort) {
			          // Detect and use the sortInverted option
			          var column = allColumns.find(function (d) {
			            return d.id === sort.id;
			          });

			          if (column && column.sortInverted) {
			            return sort.desc;
			          }

			          return !sort.desc;
			        })); // If there are sub-rows, sort them

			        sortedData.forEach(function (row) {
			          sortedFlatRows.push(row);

			          if (!row.subRows || row.subRows.length === 0) {
			            return;
			          }

			          row.subRows = sortData(row.subRows);
			        });
			        return sortedData;
			      };

			      return [sortData(rows), sortedFlatRows];
			    }, [manualSortBy, sortBy, rows, flatRows, allColumns, orderByFn, userSortTypes]),
			        sortedRows = _React$useMemo[0],
			        sortedFlatRows = _React$useMemo[1];

			    var getAutoResetSortBy = useGetLatest(autoResetSortBy);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetSortBy()) {
			        dispatch({
			          type: actions.resetSortBy
			        });
			      }
			    }, [manualSortBy ? null : data]);
			    Object.assign(instance, {
			      preSortedRows: rows,
			      preSortedFlatRows: flatRows,
			      sortedRows: sortedRows,
			      sortedFlatRows: sortedFlatRows,
			      rows: sortedRows,
			      flatRows: sortedFlatRows,
			      setSortBy: setSortBy,
			      toggleSortBy: toggleSortBy
			    });
			  }

			  function defaultOrderByFn(arr, funcs, dirs) {
			    return [].concat(arr).sort(function (rowA, rowB) {
			      for (var i = 0; i < funcs.length; i += 1) {
			        var sortFn = funcs[i];
			        var desc = dirs[i] === false || dirs[i] === 'desc';
			        var sortInt = sortFn(rowA, rowB);

			        if (sortInt !== 0) {
			          return desc ? -sortInt : sortInt;
			        }
			      }

			      return dirs[0] ? rowA.index - rowB.index : rowB.index - rowA.index;
			    });
			  }

			  var pluginName = 'usePagination'; // Actions

			  actions.resetPage = 'resetPage';
			  actions.gotoPage = 'gotoPage';
			  actions.setPageSize = 'setPageSize';
			  var usePagination = function usePagination(hooks) {
			    hooks.stateReducers.push(reducer$6);
			    hooks.useInstance.push(useInstance$6);
			  };
			  usePagination.pluginName = pluginName;

			  function reducer$6(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        pageSize: 10,
			        pageIndex: 0
			      }, state);
			    }

			    if (action.type === actions.resetPage) {
			      return _extends({}, state, {
			        pageIndex: instance.initialState.pageIndex || 0
			      });
			    }

			    if (action.type === actions.gotoPage) {
			      var pageCount = instance.pageCount,
			          page = instance.page;
			      var newPageIndex = functionalUpdate(action.pageIndex, state.pageIndex);
			      var canNavigate = false;

			      if (newPageIndex > state.pageIndex) {
			        // next page
			        canNavigate = pageCount === -1 ? page.length >= state.pageSize : newPageIndex < pageCount;
			      } else if (newPageIndex < state.pageIndex) {
			        // prev page
			        canNavigate = newPageIndex > -1;
			      }

			      if (!canNavigate) {
			        return state;
			      }

			      return _extends({}, state, {
			        pageIndex: newPageIndex
			      });
			    }

			    if (action.type === actions.setPageSize) {
			      var pageSize = action.pageSize;
			      var topRowIndex = state.pageSize * state.pageIndex;
			      var pageIndex = Math.floor(topRowIndex / pageSize);
			      return _extends({}, state, {
			        pageIndex: pageIndex,
			        pageSize: pageSize
			      });
			    }
			  }

			  function useInstance$6(instance) {
			    var rows = instance.rows,
			        _instance$autoResetPa = instance.autoResetPage,
			        autoResetPage = _instance$autoResetPa === void 0 ? true : _instance$autoResetPa,
			        _instance$manualExpan = instance.manualExpandedKey,
			        manualExpandedKey = _instance$manualExpan === void 0 ? 'expanded' : _instance$manualExpan,
			        plugins = instance.plugins,
			        userPageCount = instance.pageCount,
			        _instance$paginateExp = instance.paginateExpandedRows,
			        paginateExpandedRows = _instance$paginateExp === void 0 ? true : _instance$paginateExp,
			        _instance$expandSubRo = instance.expandSubRows,
			        expandSubRows = _instance$expandSubRo === void 0 ? true : _instance$expandSubRo,
			        _instance$state = instance.state,
			        pageSize = _instance$state.pageSize,
			        pageIndex = _instance$state.pageIndex,
			        expanded = _instance$state.expanded,
			        globalFilter = _instance$state.globalFilter,
			        filters = _instance$state.filters,
			        groupBy = _instance$state.groupBy,
			        sortBy = _instance$state.sortBy,
			        dispatch = instance.dispatch,
			        data = instance.data,
			        manualPagination = instance.manualPagination;
			    ensurePluginOrder(plugins, ['useGlobalFilter', 'useFilters', 'useGroupBy', 'useSortBy', 'useExpanded'], 'usePagination');
			    var getAutoResetPage = useGetLatest(autoResetPage);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetPage()) {
			        dispatch({
			          type: actions.resetPage
			        });
			      }
			    }, [dispatch, manualPagination ? null : data, globalFilter, filters, groupBy, sortBy]);
			    var pageCount = manualPagination ? userPageCount : Math.ceil(rows.length / pageSize);
			    var pageOptions = React.useMemo(function () {
			      return pageCount > 0 ? [].concat(new Array(pageCount)).fill(null).map(function (d, i) {
			        return i;
			      }) : [];
			    }, [pageCount]);
			    var page = React.useMemo(function () {
			      var page;

			      if (manualPagination) {
			        page = rows;
			      } else {
			        var pageStart = pageSize * pageIndex;
			        var pageEnd = pageStart + pageSize;
			        page = rows.slice(pageStart, pageEnd);
			      }

			      if (paginateExpandedRows) {
			        return page;
			      }

			      return expandRows(page, {
			        manualExpandedKey: manualExpandedKey,
			        expanded: expanded,
			        expandSubRows: expandSubRows
			      });
			    }, [expandSubRows, expanded, manualExpandedKey, manualPagination, pageIndex, pageSize, paginateExpandedRows, rows]);
			    var canPreviousPage = pageIndex > 0;
			    var canNextPage = pageCount === -1 ? page.length >= pageSize : pageIndex < pageCount - 1;
			    var gotoPage = React.useCallback(function (pageIndex) {
			      dispatch({
			        type: actions.gotoPage,
			        pageIndex: pageIndex
			      });
			    }, [dispatch]);
			    var previousPage = React.useCallback(function () {
			      return gotoPage(function (old) {
			        return old - 1;
			      });
			    }, [gotoPage]);
			    var nextPage = React.useCallback(function () {
			      return gotoPage(function (old) {
			        return old + 1;
			      });
			    }, [gotoPage]);
			    var setPageSize = React.useCallback(function (pageSize) {
			      dispatch({
			        type: actions.setPageSize,
			        pageSize: pageSize
			      });
			    }, [dispatch]);
			    Object.assign(instance, {
			      pageOptions: pageOptions,
			      pageCount: pageCount,
			      page: page,
			      canPreviousPage: canPreviousPage,
			      canNextPage: canNextPage,
			      gotoPage: gotoPage,
			      previousPage: previousPage,
			      nextPage: nextPage,
			      setPageSize: setPageSize
			    });
			  }

			  actions.resetPivot = 'resetPivot';
			  actions.togglePivot = 'togglePivot';
			  var _UNSTABLE_usePivotColumns = function _UNSTABLE_usePivotColumns(hooks) {
			    hooks.getPivotToggleProps = [defaultGetPivotToggleProps];
			    hooks.stateReducers.push(reducer$7);
			    hooks.useInstanceAfterData.push(useInstanceAfterData);
			    hooks.allColumns.push(allColumns);
			    hooks.accessValue.push(accessValue);
			    hooks.materializedColumns.push(materializedColumns);
			    hooks.materializedColumnsDeps.push(materializedColumnsDeps);
			    hooks.visibleColumns.push(visibleColumns$1);
			    hooks.visibleColumnsDeps.push(visibleColumnsDeps);
			    hooks.useInstance.push(useInstance$7);
			    hooks.prepareRow.push(prepareRow$2);
			  };
			  _UNSTABLE_usePivotColumns.pluginName = 'usePivotColumns';
			  var defaultPivotColumns = [];

			  var defaultGetPivotToggleProps = function defaultGetPivotToggleProps(props, _ref) {
			    var header = _ref.header;
			    return [props, {
			      onClick: header.canPivot ? function (e) {
			        e.persist();
			        header.togglePivot();
			      } : undefined,
			      style: {
			        cursor: header.canPivot ? 'pointer' : undefined
			      },
			      title: 'Toggle Pivot'
			    }];
			  }; // Reducer


			  function reducer$7(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        pivotColumns: defaultPivotColumns
			      }, state);
			    }

			    if (action.type === actions.resetPivot) {
			      return _extends({}, state, {
			        pivotColumns: instance.initialState.pivotColumns || defaultPivotColumns
			      });
			    }

			    if (action.type === actions.togglePivot) {
			      var columnId = action.columnId,
			          setPivot = action.value;
			      var resolvedPivot = typeof setPivot !== 'undefined' ? setPivot : !state.pivotColumns.includes(columnId);

			      if (resolvedPivot) {
			        return _extends({}, state, {
			          pivotColumns: [].concat(state.pivotColumns, [columnId])
			        });
			      }

			      return _extends({}, state, {
			        pivotColumns: state.pivotColumns.filter(function (d) {
			          return d !== columnId;
			        })
			      });
			    }
			  }

			  function useInstanceAfterData(instance) {
			    instance.allColumns.forEach(function (column) {
			      column.isPivotSource = instance.state.pivotColumns.includes(column.id);
			    });
			  }

			  function allColumns(columns, _ref2) {
			    var instance = _ref2.instance;
			    columns.forEach(function (column) {
			      column.isPivotSource = instance.state.pivotColumns.includes(column.id);
			      column.uniqueValues = new Set();
			    });
			    return columns;
			  }

			  function accessValue(value, _ref3) {
			    var column = _ref3.column;

			    if (column.uniqueValues && typeof value !== 'undefined') {
			      column.uniqueValues.add(value);
			    }

			    return value;
			  }

			  function materializedColumns(materialized, _ref4) {
			    var instance = _ref4.instance;
			    var allColumns = instance.allColumns,
			        state = instance.state;

			    if (!state.pivotColumns.length || !state.groupBy || !state.groupBy.length) {
			      return materialized;
			    }

			    var pivotColumns = state.pivotColumns.map(function (id) {
			      return allColumns.find(function (d) {
			        return d.id === id;
			      });
			    }).filter(Boolean);
			    var sourceColumns = allColumns.filter(function (d) {
			      return !d.isPivotSource && !state.groupBy.includes(d.id) && !state.pivotColumns.includes(d.id);
			    });

			    var buildPivotColumns = function buildPivotColumns(depth, parent, pivotFilters) {
			      if (depth === void 0) {
			        depth = 0;
			      }

			      if (pivotFilters === void 0) {
			        pivotFilters = [];
			      }

			      var pivotColumn = pivotColumns[depth];

			      if (!pivotColumn) {
			        return sourceColumns.map(function (sourceColumn) {
			          // TODO: We could offer support here for renesting pivoted
			          // columns inside copies of their header groups. For now,
			          // that seems like it would be (1) overkill on nesting, considering
			          // you already get nesting for every pivot level and (2)
			          // really hard. :)
			          return _extends({}, sourceColumn, {
			            canPivot: false,
			            isPivoted: true,
			            parent: parent,
			            depth: depth,
			            id: "" + (parent ? parent.id + "." + sourceColumn.id : sourceColumn.id),
			            accessor: function accessor(originalRow, i, row) {
			              if (pivotFilters.every(function (filter) {
			                return filter(row);
			              })) {
			                return row.values[sourceColumn.id];
			              }
			            }
			          });
			        });
			      }

			      var uniqueValues = Array.from(pivotColumn.uniqueValues).sort();
			      return uniqueValues.map(function (uniqueValue) {
			        var columnGroup = _extends({}, pivotColumn, {
			          Header: pivotColumn.PivotHeader || typeof pivotColumn.header === 'string' ? pivotColumn.Header + ": " + uniqueValue : uniqueValue,
			          isPivotGroup: true,
			          parent: parent,
			          depth: depth,
			          id: parent ? parent.id + "." + pivotColumn.id + "." + uniqueValue : pivotColumn.id + "." + uniqueValue,
			          pivotValue: uniqueValue
			        });

			        columnGroup.columns = buildPivotColumns(depth + 1, columnGroup, [].concat(pivotFilters, [function (row) {
			          return row.values[pivotColumn.id] === uniqueValue;
			        }]));
			        return columnGroup;
			      });
			    };

			    var newMaterialized = flattenColumns(buildPivotColumns());
			    return [].concat(materialized, newMaterialized);
			  }

			  function materializedColumnsDeps(deps, _ref5) {
			    var _ref5$instance$state = _ref5.instance.state,
			        pivotColumns = _ref5$instance$state.pivotColumns,
			        groupBy = _ref5$instance$state.groupBy;
			    return [].concat(deps, [pivotColumns, groupBy]);
			  }

			  function visibleColumns$1(visibleColumns, _ref6) {
			    var state = _ref6.instance.state;
			    visibleColumns = visibleColumns.filter(function (d) {
			      return !d.isPivotSource;
			    });

			    if (state.pivotColumns.length && state.groupBy && state.groupBy.length) {
			      visibleColumns = visibleColumns.filter(function (column) {
			        return column.isGrouped || column.isPivoted;
			      });
			    }

			    return visibleColumns;
			  }

			  function visibleColumnsDeps(deps, _ref7) {
			    var instance = _ref7.instance;
			    return [].concat(deps, [instance.state.pivotColumns, instance.state.groupBy]);
			  }

			  function useInstance$7(instance) {
			    var columns = instance.columns,
			        allColumns = instance.allColumns,
			        flatHeaders = instance.flatHeaders,
			        getHooks = instance.getHooks,
			        plugins = instance.plugins,
			        dispatch = instance.dispatch,
			        _instance$autoResetPi = instance.autoResetPivot,
			        autoResetPivot = _instance$autoResetPi === void 0 ? true : _instance$autoResetPi,
			        manaulPivot = instance.manaulPivot,
			        disablePivot = instance.disablePivot,
			        defaultCanPivot = instance.defaultCanPivot;
			    ensurePluginOrder(plugins, ['useGroupBy'], 'usePivotColumns');
			    var getInstance = useGetLatest(instance);
			    allColumns.forEach(function (column) {
			      var accessor = column.accessor,
			          defaultColumnPivot = column.defaultPivot,
			          columnDisablePivot = column.disablePivot;
			      column.canPivot = accessor ? getFirstDefined(column.canPivot, columnDisablePivot === true ? false : undefined, disablePivot === true ? false : undefined, true) : getFirstDefined(column.canPivot, defaultColumnPivot, defaultCanPivot, false);

			      if (column.canPivot) {
			        column.togglePivot = function () {
			          return instance.togglePivot(column.id);
			        };
			      }

			      column.Aggregated = column.Aggregated || column.Cell;
			    });

			    var togglePivot = function togglePivot(columnId, value) {
			      dispatch({
			        type: actions.togglePivot,
			        columnId: columnId,
			        value: value
			      });
			    };

			    flatHeaders.forEach(function (header) {
			      header.getPivotToggleProps = makePropGetter(getHooks().getPivotToggleProps, {
			        instance: getInstance(),
			        header: header
			      });
			    });
			    var getAutoResetPivot = useGetLatest(autoResetPivot);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetPivot()) {
			        dispatch({
			          type: actions.resetPivot
			        });
			      }
			    }, [dispatch, manaulPivot ? null : columns]);
			    Object.assign(instance, {
			      togglePivot: togglePivot
			    });
			  }

			  function prepareRow$2(row) {
			    row.allCells.forEach(function (cell) {
			      // Grouped cells are in the pivotColumns and the pivot cell for the row
			      cell.isPivoted = cell.column.isPivoted;
			    });
			  }

			  var pluginName$1 = 'useRowSelect'; // Actions

			  actions.resetSelectedRows = 'resetSelectedRows';
			  actions.toggleAllRowsSelected = 'toggleAllRowsSelected';
			  actions.toggleRowSelected = 'toggleRowSelected';
			  actions.toggleAllPageRowsSelected = 'toggleAllPageRowsSelected';
			  var useRowSelect = function useRowSelect(hooks) {
			    hooks.getToggleRowSelectedProps = [defaultGetToggleRowSelectedProps];
			    hooks.getToggleAllRowsSelectedProps = [defaultGetToggleAllRowsSelectedProps];
			    hooks.getToggleAllPageRowsSelectedProps = [defaultGetToggleAllPageRowsSelectedProps];
			    hooks.stateReducers.push(reducer$8);
			    hooks.useInstance.push(useInstance$8);
			    hooks.prepareRow.push(prepareRow$3);
			  };
			  useRowSelect.pluginName = pluginName$1;

			  var defaultGetToggleRowSelectedProps = function defaultGetToggleRowSelectedProps(props, _ref) {
			    var instance = _ref.instance,
			        row = _ref.row;
			    var _instance$manualRowSe = instance.manualRowSelectedKey,
			        manualRowSelectedKey = _instance$manualRowSe === void 0 ? 'isSelected' : _instance$manualRowSe;
			    var checked = false;

			    if (row.original && row.original[manualRowSelectedKey]) {
			      checked = true;
			    } else {
			      checked = row.isSelected;
			    }

			    return [props, {
			      onChange: function onChange(e) {
			        row.toggleRowSelected(e.target.checked);
			      },
			      style: {
			        cursor: 'pointer'
			      },
			      checked: checked,
			      title: 'Toggle Row Selected',
			      indeterminate: row.isSomeSelected
			    }];
			  };

			  var defaultGetToggleAllRowsSelectedProps = function defaultGetToggleAllRowsSelectedProps(props, _ref2) {
			    var instance = _ref2.instance;
			    return [props, {
			      onChange: function onChange(e) {
			        instance.toggleAllRowsSelected(e.target.checked);
			      },
			      style: {
			        cursor: 'pointer'
			      },
			      checked: instance.isAllRowsSelected,
			      title: 'Toggle All Rows Selected',
			      indeterminate: Boolean(!instance.isAllRowsSelected && Object.keys(instance.state.selectedRowIds).length)
			    }];
			  };

			  var defaultGetToggleAllPageRowsSelectedProps = function defaultGetToggleAllPageRowsSelectedProps(props, _ref3) {
			    var instance = _ref3.instance;
			    return [props, {
			      onChange: function onChange(e) {
			        instance.toggleAllPageRowsSelected(e.target.checked);
			      },
			      style: {
			        cursor: 'pointer'
			      },
			      checked: instance.isAllPageRowsSelected,
			      title: 'Toggle All Current Page Rows Selected',
			      indeterminate: Boolean(!instance.isAllPageRowsSelected && instance.page.some(function (_ref4) {
			        var id = _ref4.id;
			        return instance.state.selectedRowIds[id];
			      }))
			    }];
			  }; // eslint-disable-next-line max-params


			  function reducer$8(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        selectedRowIds: {}
			      }, state);
			    }

			    if (action.type === actions.resetSelectedRows) {
			      return _extends({}, state, {
			        selectedRowIds: instance.initialState.selectedRowIds || {}
			      });
			    }

			    if (action.type === actions.toggleAllRowsSelected) {
			      var setSelected = action.value;
			      var isAllRowsSelected = instance.isAllRowsSelected,
			          rowsById = instance.rowsById,
			          _instance$nonGroupedR = instance.nonGroupedRowsById,
			          nonGroupedRowsById = _instance$nonGroupedR === void 0 ? rowsById : _instance$nonGroupedR;
			      var selectAll = typeof setSelected !== 'undefined' ? setSelected : !isAllRowsSelected; // Only remove/add the rows that are visible on the screen
			      //  Leave all the other rows that are selected alone.

			      var selectedRowIds = Object.assign({}, state.selectedRowIds);

			      if (selectAll) {
			        Object.keys(nonGroupedRowsById).forEach(function (rowId) {
			          selectedRowIds[rowId] = true;
			        });
			      } else {
			        Object.keys(nonGroupedRowsById).forEach(function (rowId) {
			          delete selectedRowIds[rowId];
			        });
			      }

			      return _extends({}, state, {
			        selectedRowIds: selectedRowIds
			      });
			    }

			    if (action.type === actions.toggleRowSelected) {
			      var id = action.id,
			          _setSelected = action.value;
			      var _rowsById = instance.rowsById,
			          _instance$selectSubRo = instance.selectSubRows,
			          selectSubRows = _instance$selectSubRo === void 0 ? true : _instance$selectSubRo,
			          getSubRows = instance.getSubRows;
			      var isSelected = state.selectedRowIds[id];
			      var shouldExist = typeof _setSelected !== 'undefined' ? _setSelected : !isSelected;

			      if (isSelected === shouldExist) {
			        return state;
			      }

			      var newSelectedRowIds = _extends({}, state.selectedRowIds);

			      var handleRowById = function handleRowById(id) {
			        var row = _rowsById[id];

			        if (!row.isGrouped) {
			          if (shouldExist) {
			            newSelectedRowIds[id] = true;
			          } else {
			            delete newSelectedRowIds[id];
			          }
			        }

			        if (selectSubRows && getSubRows(row)) {
			          return getSubRows(row).forEach(function (row) {
			            return handleRowById(row.id);
			          });
			        }
			      };

			      handleRowById(id);
			      return _extends({}, state, {
			        selectedRowIds: newSelectedRowIds
			      });
			    }

			    if (action.type === actions.toggleAllPageRowsSelected) {
			      var _setSelected2 = action.value;

			      var page = instance.page,
			          _rowsById2 = instance.rowsById,
			          _instance$selectSubRo2 = instance.selectSubRows,
			          _selectSubRows = _instance$selectSubRo2 === void 0 ? true : _instance$selectSubRo2,
			          isAllPageRowsSelected = instance.isAllPageRowsSelected,
			          _getSubRows = instance.getSubRows;

			      var _selectAll = typeof _setSelected2 !== 'undefined' ? _setSelected2 : !isAllPageRowsSelected;

			      var _newSelectedRowIds = _extends({}, state.selectedRowIds);

			      var _handleRowById = function _handleRowById(id) {
			        var row = _rowsById2[id];

			        if (!row.isGrouped) {
			          if (_selectAll) {
			            _newSelectedRowIds[id] = true;
			          } else {
			            delete _newSelectedRowIds[id];
			          }
			        }

			        if (_selectSubRows && _getSubRows(row)) {
			          return _getSubRows(row).forEach(function (row) {
			            return _handleRowById(row.id);
			          });
			        }
			      };

			      page.forEach(function (row) {
			        return _handleRowById(row.id);
			      });
			      return _extends({}, state, {
			        selectedRowIds: _newSelectedRowIds
			      });
			    }

			    return state;
			  }

			  function useInstance$8(instance) {
			    var data = instance.data,
			        rows = instance.rows,
			        getHooks = instance.getHooks,
			        plugins = instance.plugins,
			        rowsById = instance.rowsById,
			        _instance$nonGroupedR2 = instance.nonGroupedRowsById,
			        nonGroupedRowsById = _instance$nonGroupedR2 === void 0 ? rowsById : _instance$nonGroupedR2,
			        _instance$autoResetSe = instance.autoResetSelectedRows,
			        autoResetSelectedRows = _instance$autoResetSe === void 0 ? true : _instance$autoResetSe,
			        selectedRowIds = instance.state.selectedRowIds,
			        _instance$selectSubRo3 = instance.selectSubRows,
			        selectSubRows = _instance$selectSubRo3 === void 0 ? true : _instance$selectSubRo3,
			        dispatch = instance.dispatch,
			        page = instance.page,
			        getSubRows = instance.getSubRows;
			    ensurePluginOrder(plugins, ['useFilters', 'useGroupBy', 'useSortBy', 'useExpanded', 'usePagination'], 'useRowSelect');
			    var selectedFlatRows = React.useMemo(function () {
			      var selectedFlatRows = [];
			      rows.forEach(function (row) {
			        var isSelected = selectSubRows ? getRowIsSelected(row, selectedRowIds, getSubRows) : !!selectedRowIds[row.id];
			        row.isSelected = !!isSelected;
			        row.isSomeSelected = isSelected === null;

			        if (isSelected) {
			          selectedFlatRows.push(row);
			        }
			      });
			      return selectedFlatRows;
			    }, [rows, selectSubRows, selectedRowIds, getSubRows]);
			    var isAllRowsSelected = Boolean(Object.keys(nonGroupedRowsById).length && Object.keys(selectedRowIds).length);
			    var isAllPageRowsSelected = isAllRowsSelected;

			    if (isAllRowsSelected) {
			      if (Object.keys(nonGroupedRowsById).some(function (id) {
			        return !selectedRowIds[id];
			      })) {
			        isAllRowsSelected = false;
			      }
			    }

			    if (!isAllRowsSelected) {
			      if (page && page.length && page.some(function (_ref5) {
			        var id = _ref5.id;
			        return !selectedRowIds[id];
			      })) {
			        isAllPageRowsSelected = false;
			      }
			    }

			    var getAutoResetSelectedRows = useGetLatest(autoResetSelectedRows);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetSelectedRows()) {
			        dispatch({
			          type: actions.resetSelectedRows
			        });
			      }
			    }, [dispatch, data]);
			    var toggleAllRowsSelected = React.useCallback(function (value) {
			      return dispatch({
			        type: actions.toggleAllRowsSelected,
			        value: value
			      });
			    }, [dispatch]);
			    var toggleAllPageRowsSelected = React.useCallback(function (value) {
			      return dispatch({
			        type: actions.toggleAllPageRowsSelected,
			        value: value
			      });
			    }, [dispatch]);
			    var toggleRowSelected = React.useCallback(function (id, value) {
			      return dispatch({
			        type: actions.toggleRowSelected,
			        id: id,
			        value: value
			      });
			    }, [dispatch]);
			    var getInstance = useGetLatest(instance);
			    var getToggleAllRowsSelectedProps = makePropGetter(getHooks().getToggleAllRowsSelectedProps, {
			      instance: getInstance()
			    });
			    var getToggleAllPageRowsSelectedProps = makePropGetter(getHooks().getToggleAllPageRowsSelectedProps, {
			      instance: getInstance()
			    });
			    Object.assign(instance, {
			      selectedFlatRows: selectedFlatRows,
			      isAllRowsSelected: isAllRowsSelected,
			      isAllPageRowsSelected: isAllPageRowsSelected,
			      toggleRowSelected: toggleRowSelected,
			      toggleAllRowsSelected: toggleAllRowsSelected,
			      getToggleAllRowsSelectedProps: getToggleAllRowsSelectedProps,
			      getToggleAllPageRowsSelectedProps: getToggleAllPageRowsSelectedProps,
			      toggleAllPageRowsSelected: toggleAllPageRowsSelected
			    });
			  }

			  function prepareRow$3(row, _ref6) {
			    var instance = _ref6.instance;

			    row.toggleRowSelected = function (set) {
			      return instance.toggleRowSelected(row.id, set);
			    };

			    row.getToggleRowSelectedProps = makePropGetter(instance.getHooks().getToggleRowSelectedProps, {
			      instance: instance,
			      row: row
			    });
			  }

			  function getRowIsSelected(row, selectedRowIds, getSubRows) {
			    if (selectedRowIds[row.id]) {
			      return true;
			    }

			    var subRows = getSubRows(row);

			    if (subRows && subRows.length) {
			      var allChildrenSelected = true;
			      var someSelected = false;
			      subRows.forEach(function (subRow) {
			        // Bail out early if we know both of these
			        if (someSelected && !allChildrenSelected) {
			          return;
			        }

			        if (getRowIsSelected(subRow, selectedRowIds, getSubRows)) {
			          someSelected = true;
			        } else {
			          allChildrenSelected = false;
			        }
			      });
			      return allChildrenSelected ? true : someSelected ? null : false;
			    }

			    return false;
			  }

			  var defaultInitialRowStateAccessor = function defaultInitialRowStateAccessor(row) {
			    return {};
			  };

			  var defaultInitialCellStateAccessor = function defaultInitialCellStateAccessor(cell) {
			    return {};
			  }; // Actions


			  actions.setRowState = 'setRowState';
			  actions.setCellState = 'setCellState';
			  actions.resetRowState = 'resetRowState';
			  var useRowState = function useRowState(hooks) {
			    hooks.stateReducers.push(reducer$9);
			    hooks.useInstance.push(useInstance$9);
			    hooks.prepareRow.push(prepareRow$4);
			  };
			  useRowState.pluginName = 'useRowState';

			  function reducer$9(state, action, previousState, instance) {
			    var _instance$initialRowS = instance.initialRowStateAccessor,
			        initialRowStateAccessor = _instance$initialRowS === void 0 ? defaultInitialRowStateAccessor : _instance$initialRowS,
			        _instance$initialCell = instance.initialCellStateAccessor,
			        initialCellStateAccessor = _instance$initialCell === void 0 ? defaultInitialCellStateAccessor : _instance$initialCell,
			        rowsById = instance.rowsById;

			    if (action.type === actions.init) {
			      return _extends({
			        rowState: {}
			      }, state);
			    }

			    if (action.type === actions.resetRowState) {
			      return _extends({}, state, {
			        rowState: instance.initialState.rowState || {}
			      });
			    }

			    if (action.type === actions.setRowState) {
			      var _extends2;

			      var rowId = action.rowId,
			          value = action.value;
			      var oldRowState = typeof state.rowState[rowId] !== 'undefined' ? state.rowState[rowId] : initialRowStateAccessor(rowsById[rowId]);
			      return _extends({}, state, {
			        rowState: _extends({}, state.rowState, (_extends2 = {}, _extends2[rowId] = functionalUpdate(value, oldRowState), _extends2))
			      });
			    }

			    if (action.type === actions.setCellState) {
			      var _oldRowState$cellStat, _rowsById$_rowId, _rowsById$_rowId$cell, _extends3, _extends4;

			      var _rowId = action.rowId,
			          columnId = action.columnId,
			          _value = action.value;

			      var _oldRowState = typeof state.rowState[_rowId] !== 'undefined' ? state.rowState[_rowId] : initialRowStateAccessor(rowsById[_rowId]);

			      var oldCellState = typeof (_oldRowState == null ? void 0 : (_oldRowState$cellStat = _oldRowState.cellState) == null ? void 0 : _oldRowState$cellStat[columnId]) !== 'undefined' ? _oldRowState.cellState[columnId] : initialCellStateAccessor((_rowsById$_rowId = rowsById[_rowId]) == null ? void 0 : (_rowsById$_rowId$cell = _rowsById$_rowId.cells) == null ? void 0 : _rowsById$_rowId$cell.find(function (cell) {
			        return cell.column.id === columnId;
			      }));
			      return _extends({}, state, {
			        rowState: _extends({}, state.rowState, (_extends4 = {}, _extends4[_rowId] = _extends({}, _oldRowState, {
			          cellState: _extends({}, _oldRowState.cellState || {}, (_extends3 = {}, _extends3[columnId] = functionalUpdate(_value, oldCellState), _extends3))
			        }), _extends4))
			      });
			    }
			  }

			  function useInstance$9(instance) {
			    var _instance$autoResetRo = instance.autoResetRowState,
			        autoResetRowState = _instance$autoResetRo === void 0 ? true : _instance$autoResetRo,
			        data = instance.data,
			        dispatch = instance.dispatch;
			    var setRowState = React.useCallback(function (rowId, value) {
			      return dispatch({
			        type: actions.setRowState,
			        rowId: rowId,
			        value: value
			      });
			    }, [dispatch]);
			    var setCellState = React.useCallback(function (rowId, columnId, value) {
			      return dispatch({
			        type: actions.setCellState,
			        rowId: rowId,
			        columnId: columnId,
			        value: value
			      });
			    }, [dispatch]);
			    var getAutoResetRowState = useGetLatest(autoResetRowState);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetRowState()) {
			        dispatch({
			          type: actions.resetRowState
			        });
			      }
			    }, [data]);
			    Object.assign(instance, {
			      setRowState: setRowState,
			      setCellState: setCellState
			    });
			  }

			  function prepareRow$4(row, _ref) {
			    var instance = _ref.instance;
			    var _instance$initialRowS2 = instance.initialRowStateAccessor,
			        initialRowStateAccessor = _instance$initialRowS2 === void 0 ? defaultInitialRowStateAccessor : _instance$initialRowS2,
			        _instance$initialCell2 = instance.initialCellStateAccessor,
			        initialCellStateAccessor = _instance$initialCell2 === void 0 ? defaultInitialCellStateAccessor : _instance$initialCell2,
			        rowState = instance.state.rowState;

			    if (row) {
			      row.state = typeof rowState[row.id] !== 'undefined' ? rowState[row.id] : initialRowStateAccessor(row);

			      row.setState = function (updater) {
			        return instance.setRowState(row.id, updater);
			      };

			      row.cells.forEach(function (cell) {
			        if (!row.state.cellState) {
			          row.state.cellState = {};
			        }

			        cell.state = typeof row.state.cellState[cell.column.id] !== 'undefined' ? row.state.cellState[cell.column.id] : initialCellStateAccessor(cell);

			        cell.setState = function (updater) {
			          return instance.setCellState(row.id, cell.column.id, updater);
			        };
			      });
			    }
			  }

			  actions.resetColumnOrder = 'resetColumnOrder';
			  actions.setColumnOrder = 'setColumnOrder';
			  var useColumnOrder = function useColumnOrder(hooks) {
			    hooks.stateReducers.push(reducer$a);
			    hooks.visibleColumnsDeps.push(function (deps, _ref) {
			      var instance = _ref.instance;
			      return [].concat(deps, [instance.state.columnOrder]);
			    });
			    hooks.visibleColumns.push(visibleColumns$2);
			    hooks.useInstance.push(useInstance$a);
			  };
			  useColumnOrder.pluginName = 'useColumnOrder';

			  function reducer$a(state, action, previousState, instance) {
			    if (action.type === actions.init) {
			      return _extends({
			        columnOrder: []
			      }, state);
			    }

			    if (action.type === actions.resetColumnOrder) {
			      return _extends({}, state, {
			        columnOrder: instance.initialState.columnOrder || []
			      });
			    }

			    if (action.type === actions.setColumnOrder) {
			      return _extends({}, state, {
			        columnOrder: functionalUpdate(action.columnOrder, state.columnOrder)
			      });
			    }
			  }

			  function visibleColumns$2(columns, _ref2) {
			    var columnOrder = _ref2.instance.state.columnOrder;

			    // If there is no order, return the normal columns
			    if (!columnOrder || !columnOrder.length) {
			      return columns;
			    }

			    var columnOrderCopy = [].concat(columnOrder); // If there is an order, make a copy of the columns

			    var columnsCopy = [].concat(columns); // And make a new ordered array of the columns

			    var columnsInOrder = []; // Loop over the columns and place them in order into the new array

			    var _loop = function _loop() {
			      var targetColumnId = columnOrderCopy.shift();
			      var foundIndex = columnsCopy.findIndex(function (d) {
			        return d.id === targetColumnId;
			      });

			      if (foundIndex > -1) {
			        columnsInOrder.push(columnsCopy.splice(foundIndex, 1)[0]);
			      }
			    };

			    while (columnsCopy.length && columnOrderCopy.length) {
			      _loop();
			    } // If there are any columns left, add them to the end


			    return [].concat(columnsInOrder, columnsCopy);
			  }

			  function useInstance$a(instance) {
			    var dispatch = instance.dispatch;
			    instance.setColumnOrder = React.useCallback(function (columnOrder) {
			      return dispatch({
			        type: actions.setColumnOrder,
			        columnOrder: columnOrder
			      });
			    }, [dispatch]);
			  }

			  defaultColumn.canResize = true; // Actions

			  actions.columnStartResizing = 'columnStartResizing';
			  actions.columnResizing = 'columnResizing';
			  actions.columnDoneResizing = 'columnDoneResizing';
			  actions.resetResize = 'resetResize';
			  var useResizeColumns = function useResizeColumns(hooks) {
			    hooks.getResizerProps = [defaultGetResizerProps];
			    hooks.getHeaderProps.push({
			      style: {
			        position: 'relative'
			      }
			    });
			    hooks.stateReducers.push(reducer$b);
			    hooks.useInstance.push(useInstance$b);
			    hooks.useInstanceBeforeDimensions.push(useInstanceBeforeDimensions$1);
			  };

			  var defaultGetResizerProps = function defaultGetResizerProps(props, _ref) {
			    var instance = _ref.instance,
			        header = _ref.header;
			    var dispatch = instance.dispatch;

			    var onResizeStart = function onResizeStart(e, header) {
			      var isTouchEvent = false;

			      if (e.type === 'touchstart') {
			        // lets not respond to multiple touches (e.g. 2 or 3 fingers)
			        if (e.touches && e.touches.length > 1) {
			          return;
			        }

			        isTouchEvent = true;
			      }

			      var headersToResize = getLeafHeaders(header);
			      var headerIdWidths = headersToResize.map(function (d) {
			        return [d.id, d.totalWidth];
			      });
			      var clientX = isTouchEvent ? Math.round(e.touches[0].clientX) : e.clientX;

			      var dispatchMove = function dispatchMove(clientXPos) {
			        dispatch({
			          type: actions.columnResizing,
			          clientX: clientXPos
			        });
			      };

			      var dispatchEnd = function dispatchEnd() {
			        return dispatch({
			          type: actions.columnDoneResizing
			        });
			      };

			      var handlersAndEvents = {
			        mouse: {
			          moveEvent: 'mousemove',
			          moveHandler: function moveHandler(e) {
			            return dispatchMove(e.clientX);
			          },
			          upEvent: 'mouseup',
			          upHandler: function upHandler(e) {
			            document.removeEventListener('mousemove', handlersAndEvents.mouse.moveHandler);
			            document.removeEventListener('mouseup', handlersAndEvents.mouse.upHandler);
			            dispatchEnd();
			          }
			        },
			        touch: {
			          moveEvent: 'touchmove',
			          moveHandler: function moveHandler(e) {
			            if (e.cancelable) {
			              e.preventDefault();
			              e.stopPropagation();
			            }

			            dispatchMove(e.touches[0].clientX);
			            return false;
			          },
			          upEvent: 'touchend',
			          upHandler: function upHandler(e) {
			            document.removeEventListener(handlersAndEvents.touch.moveEvent, handlersAndEvents.touch.moveHandler);
			            document.removeEventListener(handlersAndEvents.touch.upEvent, handlersAndEvents.touch.moveHandler);
			            dispatchEnd();
			          }
			        }
			      };
			      var events = isTouchEvent ? handlersAndEvents.touch : handlersAndEvents.mouse;
			      var passiveIfSupported = passiveEventSupported() ? {
			        passive: false
			      } : false;
			      document.addEventListener(events.moveEvent, events.moveHandler, passiveIfSupported);
			      document.addEventListener(events.upEvent, events.upHandler, passiveIfSupported);
			      dispatch({
			        type: actions.columnStartResizing,
			        columnId: header.id,
			        columnWidth: header.totalWidth,
			        headerIdWidths: headerIdWidths,
			        clientX: clientX
			      });
			    };

			    return [props, {
			      onMouseDown: function onMouseDown(e) {
			        return e.persist() || onResizeStart(e, header);
			      },
			      onTouchStart: function onTouchStart(e) {
			        return e.persist() || onResizeStart(e, header);
			      },
			      style: {
			        cursor: 'col-resize'
			      },
			      draggable: false,
			      role: 'separator'
			    }];
			  };

			  useResizeColumns.pluginName = 'useResizeColumns';

			  function reducer$b(state, action) {
			    if (action.type === actions.init) {
			      return _extends({
			        columnResizing: {
			          columnWidths: {}
			        }
			      }, state);
			    }

			    if (action.type === actions.resetResize) {
			      return _extends({}, state, {
			        columnResizing: {
			          columnWidths: {}
			        }
			      });
			    }

			    if (action.type === actions.columnStartResizing) {
			      var clientX = action.clientX,
			          columnId = action.columnId,
			          columnWidth = action.columnWidth,
			          headerIdWidths = action.headerIdWidths;
			      return _extends({}, state, {
			        columnResizing: _extends({}, state.columnResizing, {
			          startX: clientX,
			          headerIdWidths: headerIdWidths,
			          columnWidth: columnWidth,
			          isResizingColumn: columnId
			        })
			      });
			    }

			    if (action.type === actions.columnResizing) {
			      var _clientX = action.clientX;

			      var _state$columnResizing = state.columnResizing,
			          startX = _state$columnResizing.startX,
			          _columnWidth = _state$columnResizing.columnWidth,
			          _state$columnResizing2 = _state$columnResizing.headerIdWidths,
			          _headerIdWidths = _state$columnResizing2 === void 0 ? [] : _state$columnResizing2;

			      var deltaX = _clientX - startX;
			      var percentageDeltaX = deltaX / _columnWidth;
			      var newColumnWidths = {};

			      _headerIdWidths.forEach(function (_ref2) {
			        var headerId = _ref2[0],
			            headerWidth = _ref2[1];
			        newColumnWidths[headerId] = Math.max(headerWidth + headerWidth * percentageDeltaX, 0);
			      });

			      return _extends({}, state, {
			        columnResizing: _extends({}, state.columnResizing, {
			          columnWidths: _extends({}, state.columnResizing.columnWidths, {}, newColumnWidths)
			        })
			      });
			    }

			    if (action.type === actions.columnDoneResizing) {
			      return _extends({}, state, {
			        columnResizing: _extends({}, state.columnResizing, {
			          startX: null,
			          isResizingColumn: null
			        })
			      });
			    }
			  }

			  var useInstanceBeforeDimensions$1 = function useInstanceBeforeDimensions(instance) {
			    var flatHeaders = instance.flatHeaders,
			        disableResizing = instance.disableResizing,
			        getHooks = instance.getHooks,
			        columnResizing = instance.state.columnResizing;
			    var getInstance = useGetLatest(instance);
			    flatHeaders.forEach(function (header) {
			      var canResize = getFirstDefined(header.disableResizing === true ? false : undefined, disableResizing === true ? false : undefined, true);
			      header.canResize = canResize;
			      header.width = columnResizing.columnWidths[header.id] || header.originalWidth || header.width;
			      header.isResizing = columnResizing.isResizingColumn === header.id;

			      if (canResize) {
			        header.getResizerProps = makePropGetter(getHooks().getResizerProps, {
			          instance: getInstance(),
			          header: header
			        });
			      }
			    });
			  };

			  function useInstance$b(instance) {
			    var plugins = instance.plugins,
			        dispatch = instance.dispatch,
			        _instance$autoResetRe = instance.autoResetResize,
			        autoResetResize = _instance$autoResetRe === void 0 ? true : _instance$autoResetRe,
			        columns = instance.columns;
			    ensurePluginOrder(plugins, ['useAbsoluteLayout'], 'useResizeColumns');
			    var getAutoResetResize = useGetLatest(autoResetResize);
			    useMountedLayoutEffect(function () {
			      if (getAutoResetResize()) {
			        dispatch({
			          type: actions.resetResize
			        });
			      }
			    }, [columns]);
			    var resetResizing = React.useCallback(function () {
			      return dispatch({
			        type: actions.resetResize
			      });
			    }, [dispatch]);
			    Object.assign(instance, {
			      resetResizing: resetResizing
			    });
			  }

			  function getLeafHeaders(header) {
			    var leafHeaders = [];

			    var recurseHeader = function recurseHeader(header) {
			      if (header.columns && header.columns.length) {
			        header.columns.map(recurseHeader);
			      }

			      leafHeaders.push(header);
			    };

			    recurseHeader(header);
			    return leafHeaders;
			  }

			  var cellStyles = {
			    position: 'absolute',
			    top: 0
			  };
			  var useAbsoluteLayout = function useAbsoluteLayout(hooks) {
			    hooks.getTableBodyProps.push(getRowStyles);
			    hooks.getRowProps.push(getRowStyles);
			    hooks.getHeaderGroupProps.push(getRowStyles);
			    hooks.getFooterGroupProps.push(getRowStyles);
			    hooks.getHeaderProps.push(function (props, _ref) {
			      var column = _ref.column;
			      return [props, {
			        style: _extends({}, cellStyles, {
			          left: column.totalLeft + "px",
			          width: column.totalWidth + "px"
			        })
			      }];
			    });
			    hooks.getCellProps.push(function (props, _ref2) {
			      var cell = _ref2.cell;
			      return [props, {
			        style: _extends({}, cellStyles, {
			          left: cell.column.totalLeft + "px",
			          width: cell.column.totalWidth + "px"
			        })
			      }];
			    });
			    hooks.getFooterProps.push(function (props, _ref3) {
			      var column = _ref3.column;
			      return [props, {
			        style: _extends({}, cellStyles, {
			          left: column.totalLeft + "px",
			          width: column.totalWidth + "px"
			        })
			      }];
			    });
			  };
			  useAbsoluteLayout.pluginName = 'useAbsoluteLayout';

			  var getRowStyles = function getRowStyles(props, _ref4) {
			    var instance = _ref4.instance;
			    return [props, {
			      style: {
			        position: 'relative',
			        width: instance.totalColumnsWidth + "px"
			      }
			    }];
			  };

			  var cellStyles$1 = {
			    display: 'inline-block',
			    boxSizing: 'border-box'
			  };

			  var getRowStyles$1 = function getRowStyles(props, _ref) {
			    var instance = _ref.instance;
			    return [props, {
			      style: {
			        display: 'flex',
			        width: instance.totalColumnsWidth + "px"
			      }
			    }];
			  };

			  var useBlockLayout = function useBlockLayout(hooks) {
			    hooks.getRowProps.push(getRowStyles$1);
			    hooks.getHeaderGroupProps.push(getRowStyles$1);
			    hooks.getFooterGroupProps.push(getRowStyles$1);
			    hooks.getHeaderProps.push(function (props, _ref2) {
			      var column = _ref2.column;
			      return [props, {
			        style: _extends({}, cellStyles$1, {
			          width: column.totalWidth + "px"
			        })
			      }];
			    });
			    hooks.getCellProps.push(function (props, _ref3) {
			      var cell = _ref3.cell;
			      return [props, {
			        style: _extends({}, cellStyles$1, {
			          width: cell.column.totalWidth + "px"
			        })
			      }];
			    });
			    hooks.getFooterProps.push(function (props, _ref4) {
			      var column = _ref4.column;
			      return [props, {
			        style: _extends({}, cellStyles$1, {
			          width: column.totalWidth + "px"
			        })
			      }];
			    });
			  };
			  useBlockLayout.pluginName = 'useBlockLayout';

			  function useFlexLayout(hooks) {
			    hooks.getTableProps.push(getTableProps);
			    hooks.getRowProps.push(getRowStyles$2);
			    hooks.getHeaderGroupProps.push(getRowStyles$2);
			    hooks.getFooterGroupProps.push(getRowStyles$2);
			    hooks.getHeaderProps.push(getHeaderProps);
			    hooks.getCellProps.push(getCellProps);
			    hooks.getFooterProps.push(getFooterProps);
			  }
			  useFlexLayout.pluginName = 'useFlexLayout';

			  var getTableProps = function getTableProps(props, _ref) {
			    var instance = _ref.instance;
			    return [props, {
			      style: {
			        minWidth: instance.totalColumnsMinWidth + "px"
			      }
			    }];
			  };

			  var getRowStyles$2 = function getRowStyles(props, _ref2) {
			    var instance = _ref2.instance;
			    return [props, {
			      style: {
			        display: 'flex',
			        flex: '1 0 auto',
			        minWidth: instance.totalColumnsMinWidth + "px"
			      }
			    }];
			  };

			  var getHeaderProps = function getHeaderProps(props, _ref3) {
			    var column = _ref3.column;
			    return [props, {
			      style: {
			        boxSizing: 'border-box',
			        flex: column.totalFlexWidth ? column.totalFlexWidth + " 0 auto" : undefined,
			        minWidth: column.totalMinWidth + "px",
			        width: column.totalWidth + "px"
			      }
			    }];
			  };

			  var getCellProps = function getCellProps(props, _ref4) {
			    var cell = _ref4.cell;
			    return [props, {
			      style: {
			        boxSizing: 'border-box',
			        flex: cell.column.totalFlexWidth + " 0 auto",
			        minWidth: cell.column.totalMinWidth + "px",
			        width: cell.column.totalWidth + "px"
			      }
			    }];
			  };

			  var getFooterProps = function getFooterProps(props, _ref5) {
			    var column = _ref5.column;
			    return [props, {
			      style: {
			        boxSizing: 'border-box',
			        flex: column.totalFlexWidth ? column.totalFlexWidth + " 0 auto" : undefined,
			        minWidth: column.totalMinWidth + "px",
			        width: column.totalWidth + "px"
			      }
			    }];
			  };

			  function useGridLayout(hooks) {
			    hooks.stateReducers.push(reducer$c);
			    hooks.getTableProps.push(getTableProps$1);
			    hooks.getHeaderProps.push(getHeaderProps$1);
			  }
			  useGridLayout.pluginName = 'useGridLayout';

			  var getTableProps$1 = function getTableProps(props, _ref) {
			    var instance = _ref.instance;
			    return [props, {
			      style: {
			        display: "grid",
			        gridTemplateColumns: instance.state.gridLayout.columnWidths.map(function (w) {
			          return w;
			        }).join(" ")
			      }
			    }];
			  };

			  var getHeaderProps$1 = function getHeaderProps(props, _ref2) {
			    var column = _ref2.column;
			    return [props, {
			      id: "header-cell-" + column.id,
			      style: {
			        position: "sticky" //enables a scroll wrapper to be placed around the table and have sticky headers

			      }
			    }];
			  };

			  function reducer$c(state, action, previousState, instance) {
			    if (action.type === "init") {
			      return _extends({
			        gridLayout: {
			          columnWidths: instance.columns.map(function () {
			            return "auto";
			          })
			        }
			      }, state);
			    }

			    if (action.type === "columnStartResizing") {
			      var columnId = action.columnId;
			      var columnIndex = instance.visibleColumns.findIndex(function (col) {
			        return col.id === columnId;
			      });
			      var elWidth = getElementWidth(columnId);

			      if (elWidth !== undefined) {
			        return _extends({}, state, {
			          gridLayout: _extends({}, state.gridLayout, {
			            columnId: columnId,
			            columnIndex: columnIndex,
			            startingWidth: elWidth
			          })
			        });
			      } else {
			        return state;
			      }
			    }

			    if (action.type === "columnResizing") {
			      var _state$gridLayout = state.gridLayout,
			          _columnIndex = _state$gridLayout.columnIndex,
			          startingWidth = _state$gridLayout.startingWidth,
			          columnWidths = _state$gridLayout.columnWidths;
			      var change = state.columnResizing.startX - action.clientX;
			      var newWidth = startingWidth - change;
			      var columnWidthsCopy = [].concat(columnWidths);
			      columnWidthsCopy[_columnIndex] = newWidth + "px";
			      return _extends({}, state, {
			        gridLayout: _extends({}, state.gridLayout, {
			          columnWidths: columnWidthsCopy
			        })
			      });
			    }
			  }

			  function getElementWidth(columnId) {
			    var _document$getElementB;

			    var width = (_document$getElementB = document.getElementById("header-cell-" + columnId)) == null ? void 0 : _document$getElementB.offsetWidth;

			    if (width !== undefined) {
			      return width;
			    }
			  }

			  exports._UNSTABLE_usePivotColumns = _UNSTABLE_usePivotColumns;
			  exports.actions = actions;
			  exports.defaultColumn = defaultColumn;
			  exports.defaultGroupByFn = defaultGroupByFn;
			  exports.defaultOrderByFn = defaultOrderByFn;
			  exports.defaultRenderer = defaultRenderer;
			  exports.emptyRenderer = emptyRenderer;
			  exports.ensurePluginOrder = ensurePluginOrder;
			  exports.flexRender = flexRender;
			  exports.functionalUpdate = functionalUpdate;
			  exports.loopHooks = loopHooks;
			  exports.makePropGetter = makePropGetter;
			  exports.makeRenderer = makeRenderer;
			  exports.reduceHooks = reduceHooks;
			  exports.safeUseLayoutEffect = safeUseLayoutEffect;
			  exports.useAbsoluteLayout = useAbsoluteLayout;
			  exports.useAsyncDebounce = useAsyncDebounce;
			  exports.useBlockLayout = useBlockLayout;
			  exports.useColumnOrder = useColumnOrder;
			  exports.useExpanded = useExpanded;
			  exports.useFilters = useFilters;
			  exports.useFlexLayout = useFlexLayout;
			  exports.useGetLatest = useGetLatest;
			  exports.useGlobalFilter = useGlobalFilter;
			  exports.useGridLayout = useGridLayout;
			  exports.useGroupBy = useGroupBy;
			  exports.useMountedLayoutEffect = useMountedLayoutEffect;
			  exports.usePagination = usePagination;
			  exports.useResizeColumns = useResizeColumns;
			  exports.useRowSelect = useRowSelect;
			  exports.useRowState = useRowState;
			  exports.useSortBy = useSortBy;
			  exports.useTable = useTable;

			  Object.defineProperty(exports, '__esModule', { value: true });

			})));

			}(reactTable_development, reactTable_development.exports));

			{
			  reactTable.exports = reactTable_production_min.exports;
			}

			var __defProp$d = Object.defineProperty;
			var __getOwnPropSymbols$d = Object.getOwnPropertySymbols;
			var __hasOwnProp$d = Object.prototype.hasOwnProperty;
			var __propIsEnum$d = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$d = (obj, key, value) => key in obj ? __defProp$d(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$d = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$d.call(b, prop))
			      __defNormalProp$d(a, prop, b[prop]);
			  if (__getOwnPropSymbols$d)
			    for (var prop of __getOwnPropSymbols$d(b)) {
			      if (__propIsEnum$d.call(b, prop))
			        __defNormalProp$d(a, prop, b[prop]);
			    }
			  return a;
			};
			var checkboxColumn = {
			  id: "_selector",
			  disableResizing: true,
			  disableGroupBy: true,
			  width: 48,
			  Header: ({ getToggleAllRowsSelectedProps }) => /* @__PURE__ */ React__default.createElement("input", __spreadValues$d({
			    type: "checkbox"
			  }, getToggleAllRowsSelectedProps())),
			  Cell: ({ row }) => /* @__PURE__ */ React__default.createElement("input", __spreadValues$d({
			    type: "checkbox"
			  }, row.getToggleRowSelectedProps()))
			};

			var __defProp$c = Object.defineProperty;
			var __defProps$3 = Object.defineProperties;
			var __getOwnPropDescs$3 = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$c = Object.getOwnPropertySymbols;
			var __hasOwnProp$c = Object.prototype.hasOwnProperty;
			var __propIsEnum$c = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$c = (obj, key, value) => key in obj ? __defProp$c(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$c = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$c.call(b, prop))
			      __defNormalProp$c(a, prop, b[prop]);
			  if (__getOwnPropSymbols$c)
			    for (var prop of __getOwnPropSymbols$c(b)) {
			      if (__propIsEnum$c.call(b, prop))
			        __defNormalProp$c(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps$3 = (a, b) => __defProps$3(a, __getOwnPropDescs$3(b));
			const DEFAULT_WIDTH = 150;
			const MINIMUM_WIDTH = 50;
			const getDefaultSelectMap = (keys) => {
			  if (!keys) {
			    return {};
			  }
			  const keyMap = {};
			  keys.forEach((key) => {
			    keyMap[key] = true;
			  });
			  return keyMap;
			};
			function useExtendColumns(originalColumns, showCheckbox) {
			  return useMemo(() => {
			    const _originalColumns = originalColumns.map((col) => {
			      if (col.width) {
			        return col;
			      }
			      return __spreadProps$3(__spreadValues$c({}, col), { width: DEFAULT_WIDTH });
			    });
			    if (!showCheckbox) {
			      return _originalColumns;
			    }
			    const firstColumnFixed = _originalColumns.length > 0 && _originalColumns[0].fixed;
			    return [__spreadProps$3(__spreadValues$c({}, checkboxColumn), { fixed: firstColumnFixed }), ..._originalColumns];
			  }, [showCheckbox, originalColumns]);
			}

			var __defProp$b = Object.defineProperty;
			var __defProps$2 = Object.defineProperties;
			var __getOwnPropDescs$2 = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$b = Object.getOwnPropertySymbols;
			var __hasOwnProp$b = Object.prototype.hasOwnProperty;
			var __propIsEnum$b = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$b = (obj, key, value) => key in obj ? __defProp$b(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$b = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$b.call(b, prop))
			      __defNormalProp$b(a, prop, b[prop]);
			  if (__getOwnPropSymbols$b)
			    for (var prop of __getOwnPropSymbols$b(b)) {
			      if (__propIsEnum$b.call(b, prop))
			        __defNormalProp$b(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps$2 = (a, b) => __defProps$2(a, __getOwnPropDescs$2(b));
			function columnIsLastLeftSticky(columnId, columns) {
			  const index = columns.findIndex(({ id }) => id === columnId);
			  const column = columns[index];
			  const nextColumn = columns[index + 1];
			  return nextColumn && !(nextColumn == null ? void 0 : nextColumn.fixed) && column.fixed;
			}
			function columnIsFirstRightSticky(columnId, columns) {
			  const index = columns.findIndex(({ id }) => id === columnId);
			  const column = columns[index];
			  const prevColumn = columns[index - 1];
			  return prevColumn && !(prevColumn == null ? void 0 : prevColumn.fixed) && column.fixed;
			}
			function getMargin(columnId, columns) {
			  const currentIndex = columns.findIndex(({ id }) => id === columnId);
			  let leftMargin = 0;
			  let rightMargin = 0;
			  for (let i = 0; i < currentIndex; i += 1) {
			    if (columns[i].fixed) {
			      leftMargin += columns[i].width;
			    }
			  }
			  for (let i = currentIndex + 1; i < columns.length; i += 1) {
			    if (columns[i].fixed) {
			      rightMargin += columns[i].width;
			    }
			  }
			  return { leftMargin, rightMargin };
			}
			const cellStylesSticky = {
			  position: "sticky",
			  zIndex: 3
			};
			function findHeadersSameLevel(header, headers) {
			  return headers.filter((flatHeaderItem) => {
			    return flatHeaderItem.depth === header.depth;
			  });
			}
			function getStickyProps(header, instance) {
			  let style = {};
			  const dataAttrs = {};
			  if (!header.fixed) {
			    return __spreadValues$b({
			      style
			    }, dataAttrs);
			  }
			  style = __spreadValues$b({}, cellStylesSticky);
			  dataAttrs["data-sticky-td"] = true;
			  const headers = findHeadersSameLevel(header, instance.flatHeaders);
			  const { leftMargin, rightMargin } = getMargin(header.id, headers);
			  const index = headers.findIndex(({ id }) => id === header.id);
			  const zIndex = headers.length - index + 1;
			  style = __spreadProps$2(__spreadValues$b({}, style), {
			    zIndex,
			    minWidth: header.minWidth,
			    maxWidth: header.maxWidth,
			    left: `${leftMargin}px`,
			    right: `${rightMargin}px`
			  });
			  const isLastLeftSticky = columnIsLastLeftSticky(header.id, headers);
			  if (isLastLeftSticky) {
			    dataAttrs["data-sticky-last-left-td"] = true;
			  } else if (columnIsFirstRightSticky(header.id, headers)) {
			    dataAttrs["data-sticky-first-right-td"] = true;
			  }
			  return __spreadValues$b({
			    style
			  }, dataAttrs);
			}
			const useSticky = (hooks) => {
			  hooks.getHeaderProps.push((props, { instance, column }) => {
			    const nextProps = getStickyProps(column, instance);
			    return [props, nextProps];
			  });
			  hooks.getCellProps.push((props, { instance, cell }) => {
			    const nextProps = getStickyProps(cell.column, instance);
			    nextProps.style.zIndex = 1;
			    return [props, nextProps];
			  });
			};
			useSticky.pluginName = "useSticky";

			function AdjustHandle({ onChange, thID, onMouseUp }) {
			  const ref = useRef(null);
			  let x = 0;
			  let w = 0;
			  const mouseMoveHandler = (e) => {
			    onChange(w + e.clientX - x);
			  };
			  const mouseUpHandler = () => {
			    document.removeEventListener("mousemove", mouseMoveHandler);
			    document.removeEventListener("mouseup", mouseUpHandler);
			    onMouseUp();
			  };
			  const onMouseDown = (e) => {
			    var _a;
			    document.addEventListener("mousemove", mouseMoveHandler);
			    document.addEventListener("mouseup", mouseUpHandler);
			    x = e.clientX;
			    w = parseInt(((_a = document.querySelector(`#${thID}`)) == null ? void 0 : _a.getAttribute("width")) || "0");
			  };
			  useEffect(() => {
			    var _a;
			    (_a = ref.current) == null ? void 0 : _a.addEventListener("mousedown", onMouseDown);
			  }, []);
			  return /* @__PURE__ */ React__default.createElement("div", {
			    ref,
			    className: "ofa-table-adjust-handle"
			  });
			}

			var css$3 = ".ofa-table {\n  max-height: 100%;\n  overflow: auto;\n  position: relative;\n}\n.ofa-table table {\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate;\n  font-size: 12px;\n}\n.ofa-table [data-sticky-td] {\n  position: sticky;\n}\n.ofa-table [data-sticky-last-left-td] {\n  box-shadow: 2px 0 3px var(--gray-200);\n}\n.ofa-table [data-sticky-first-right-td] {\n  box-shadow: -2px 0 3px var(--gray-200);\n}\n\n.ofa-table-adjust-header th {\n  background: #f8fafc;\n  box-shadow: inset 0px -1px 0px var(--gray-200);\n  border-bottom-width: 0;\n}\n\n.ofa-table-empty {\n  padding: 30px;\n  text-align: center;\n}\n\n.ofa-table-th,\n.ofa-table-td {\n  word-break: break-all;\n  vertical-align: middle;\n  transition: padding 0.3s;\n}\n\n.ofa-table-tr:hover .ofa-table-td {\n  background-color: var(--gray-100);\n}\n\n.ofa-table-th {\n  position: sticky;\n  top: 0;\n  user-select: none;\n  z-index: 2;\n}\n\n.ofa-table-compact th,\n.ofa-table-compact td {\n  text-overflow: ellipsis;\n  white-space: nowrap;\n  overflow: hidden;\n}\n\n.ofa-table-loading-box {\n  position: absolute;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: rgba(255, 255, 255, 0.7);\n  z-index: 5;\n}\n\n.ofa-table-adjust-handle {\n  display: flex;\n  justify-content: right;\n  width: 24px;\n  height: 20px;\n  position: absolute;\n  right: 0;\n  top: 50%;\n  transform: translateY(-50%);\n  z-index: 1;\n  touch-action: none;\n  cursor: col-resize;\n}\n.ofa-table-adjust-handle::after {\n  content: \"\";\n  display: inline-block;\n  width: 1px;\n  height: 100%;\n  background-color: var(--gray-200);\n}\n.ofa-table-adjust-handle:hover::after {\n  background-color: var(--gray-400);\n}\n.ofa-table-adjust-handle:active::after {\n  background-color: var(--gray-600);\n}";
			n(css$3,{});

			var __defProp$a = Object.defineProperty;
			var __defProps$1 = Object.defineProperties;
			var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$a = Object.getOwnPropertySymbols;
			var __hasOwnProp$a = Object.prototype.hasOwnProperty;
			var __propIsEnum$a = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$a = (obj, key, value) => key in obj ? __defProp$a(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$a = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$a.call(b, prop))
			      __defNormalProp$a(a, prop, b[prop]);
			  if (__getOwnPropSymbols$a)
			    for (var prop of __getOwnPropSymbols$a(b)) {
			      if (__propIsEnum$a.call(b, prop))
			        __defNormalProp$a(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
			function Table({
			  className,
			  columns,
			  data,
			  emptyTips,
			  initialSelectedRowKeys,
			  loading,
			  onRowClick,
			  isCompact,
			  onSelectChange,
			  rowKey = "id",
			  showCheckbox,
			  style,
			  canSetColumnWidth,
			  canAcrossPageChoose,
			  initWidthMap,
			  widthMapChange
			}) {
			  const _columns = useExtendColumns(columns, showCheckbox);
			  const widthMapRef = useRef({});
			  const [widthMap, setWidthMap] = useState(initWidthMap || {});
			  widthMapRef.current = widthMap;
			  const {
			    getTableProps,
			    getTableBodyProps,
			    headerGroups,
			    prepareRow,
			    rows,
			    selectedFlatRows,
			    state: { selectedRowIds }
			  } = reactTable.exports.useTable({
			    data,
			    columns: _columns,
			    getRowId: (row) => row[rowKey],
			    initialState: { selectedRowIds: getDefaultSelectMap(initialSelectedRowKeys || []) }
			  }, reactTable.exports.useRowSelect, useSticky);
			  const handleWidthChange = (x, columnID) => {
			    if (x < MINIMUM_WIDTH) {
			      return;
			    }
			    const _widthMap = __spreadProps$1(__spreadValues$a({}, widthMapRef.current), {
			      [columnID]: x
			    });
			    setWidthMap(_widthMap);
			  };
			  useEffect(() => {
			    const _widthMap = {};
			    _columns.forEach((col) => {
			      const _width = widthMapRef.current[col.id];
			      if (!_width || !canSetColumnWidth) {
			        _widthMap[col.id] = col.width || DEFAULT_WIDTH;
			      } else {
			        _widthMap[col.id] = _width;
			      }
			    });
			    setWidthMap(__spreadValues$a(__spreadValues$a({}, widthMapRef.current), _widthMap));
			  }, [_columns]);
			  useEffect(() => {
			    if (!onSelectChange) {
			      return;
			    }
			    const selectedRows = selectedFlatRows.map(({ original }) => original);
			    const selectedKeys = canAcrossPageChoose ? Object.keys(selectedRowIds) : selectedRows.map((row) => row[rowKey]);
			    onSelectChange(selectedKeys, selectedRows);
			  }, [Object.keys(selectedRowIds).length]);
			  const tableFooterRender = () => {
			    if (rows.length === 0) {
			      return /* @__PURE__ */ React__default.createElement("div", {
			        className: "ofa-table-empty"
			      }, emptyTips);
			    }
			  };
			  if (!headerGroups.length) {
			    return /* @__PURE__ */ React__default.createElement("div", null, "data error");
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: cs("ofa-table", className, { "ofa-table-compact": isCompact }),
			    style
			  }, /* @__PURE__ */ React__default.createElement("table", __spreadValues$a({}, getTableProps()), /* @__PURE__ */ React__default.createElement("colgroup", {
			    id: "colgroup"
			  }, headerGroups[0].headers.map((header) => {
			    return /* @__PURE__ */ React__default.createElement("col", __spreadProps$1(__spreadValues$a({}, header.getHeaderProps()), {
			      id: `th-${header.id}`,
			      width: widthMap[header.id],
			      key: header.id
			    }));
			  })), /* @__PURE__ */ React__default.createElement("thead", null, /* @__PURE__ */ React__default.createElement("tr", {
			    className: cs({ "ofa-table-adjust-header": canSetColumnWidth })
			  }, headerGroups[0].headers.map((header, index) => {
			    return /* @__PURE__ */ React__default.createElement("th", __spreadProps$1(__spreadValues$a({
			      "data-width": widthMap[header.id]
			    }, header.getHeaderProps()), {
			      key: header.id,
			      className: "ofa-table-th"
			    }), header.render("Header"), canSetColumnWidth && header.id !== "_selector" && index !== _columns.length - 1 && /* @__PURE__ */ React__default.createElement(AdjustHandle, {
			      onMouseUp: () => widthMapChange == null ? void 0 : widthMapChange(widthMapRef.current),
			      thID: `th-${header.id}`,
			      onChange: (x) => handleWidthChange(x, header.id)
			    }));
			  }))), /* @__PURE__ */ React__default.createElement("tbody", __spreadValues$a({}, getTableBodyProps()), rows.map((row) => {
			    var _a, _b;
			    prepareRow(row);
			    return /* @__PURE__ */ React__default.createElement("tr", __spreadProps$1(__spreadValues$a({}, row.getRowProps()), {
			      onClick: () => onRowClick == null ? void 0 : onRowClick(row.id, row.original),
			      key: row.id,
			      className: "ofa-table-tr",
			      "data-row": JSON.stringify({
			        id: (_a = row == null ? void 0 : row.id) != null ? _a : "",
			        selectedRow: (_b = row == null ? void 0 : row.original) != null ? _b : {}
			      })
			    }), row.cells.map((cell) => {
			      return /* @__PURE__ */ React__default.createElement("td", __spreadProps$1(__spreadValues$a({
			        className: "ofa-table-td"
			      }, cell.getCellProps()), {
			        key: cell.column.id
			      }), cell.render("Cell"));
			    }));
			  }))), tableFooterRender(), loading && /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-table-loading-box"
			  }, "Loading..."));
			}

			function removeDuplicate(arr) {
			  const obj = {};
			  return arr.reduce(function(newArr, next) {
			    if (!(next in obj)) {
			      obj[next] = true;
			      newArr.push(next);
			    }
			    return newArr;
			  }, []);
			}
			function useNext(images, defaultIndex, disableAutoplay, autoplaySpeed, onChange) {
			  const [newImages, setNewImages] = useState(removeDuplicate(images));
			  const [current, setCurrent] = useState(defaultIndex < newImages.length && defaultIndex > -1 ? defaultIndex : 0);
			  const timer = useRef(null);
			  useEffect(() => {
			    if (current > newImages.length - 1) {
			      setCurrent(0);
			    }
			    if (newImages.length > 1 && !disableAutoplay) {
			      setNext();
			    }
			    return () => clearTimer();
			  }, [newImages, disableAutoplay, autoplaySpeed]);
			  useEffect(() => {
			    setNewImages(removeDuplicate(images));
			  }, [images]);
			  function setNext() {
			    const nextInterval = setInterval(() => {
			      setCurrent((val) => {
			        let nextStep = val + 1;
			        if (nextStep === newImages.length) {
			          nextStep = 0;
			        }
			        onChange == null ? void 0 : onChange(nextStep);
			        return nextStep;
			      });
			    }, autoplaySpeed);
			    timer.current = nextInterval;
			  }
			  function clearTimer() {
			    if (timer.current) {
			      clearInterval(timer.current);
			      timer.current = null;
			    }
			  }
			  return {
			    newImages,
			    current,
			    setCurrent,
			    setNext,
			    clearTimer
			  };
			}

			var css$2 = ".ofa-swiper-image-wrapper {\n  width: 100px;\n  height: 100px;\n  position: relative;\n  overflow: hidden;\n}\n\n.ofa-swiper-image-slide {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  opacity: 0;\n  transition: opacity 0.5s ease;\n  background-repeat: no-repeat;\n}\n\n.ofa-swiper-image-active {\n  opacity: 1;\n}\n\n.ofa-swiper-image-dots {\n  position: absolute;\n  display: flex;\n  right: 0;\n  bottom: 20px;\n  left: 0;\n  z-index: 1;\n  list-style: none;\n  justify-content: center;\n}\n\n.ofa-swiper-image-dot {\n  cursor: pointer;\n  width: 10px;\n  height: 10px;\n  background: #ccc;\n  margin-right: 3px;\n  margin-left: 3px;\n}\n\n.ofa-swiper-image-dot-active {\n  background: #fff;\n}";
			n(css$2,{});

			function SwiperImage({
			  images = [],
			  defaultIndex = 0,
			  disableAutoplay = false,
			  fillMode = "cover",
			  autoplaySpeed = 3e3,
			  hideDots = false,
			  onChange,
			  className,
			  style
			}, ref) {
			  const { newImages, current, setCurrent, setNext, clearTimer } = useNext(images, defaultIndex, disableAutoplay, autoplaySpeed, onChange);
			  const [dots, setDots] = useState(hideDots);
			  useEffect(() => {
			    setDots(hideDots);
			  }, [hideDots]);
			  return /* @__PURE__ */ React__default.createElement("div", {
			    style,
			    ref,
			    className: cs("ofa-swiper-image-wrapper", className),
			    onMouseEnter: () => clearTimer(),
			    onMouseLeave: () => !disableAutoplay && setNext()
			  }, newImages.map((imgUrl) => {
			    return /* @__PURE__ */ React__default.createElement("div", {
			      key: imgUrl,
			      style: { backgroundImage: `url(${imgUrl})`, backgroundSize: `${fillMode}` },
			      className: cs("ofa-swiper-image-slide", {
			        "ofa-swiper-image-active": newImages[current] === imgUrl
			      })
			    });
			  }), !dots && /* @__PURE__ */ React__default.createElement("ul", {
			    className: "ofa-swiper-image-dots"
			  }, newImages.map((imgUrl, index) => {
			    return /* @__PURE__ */ React__default.createElement("li", {
			      key: imgUrl,
			      className: cs("ofa-swiper-image-dot", {
			        "ofa-swiper-image-dot-active": newImages[current] === imgUrl
			      }),
			      onClick: () => {
			        onChange == null ? void 0 : onChange(index);
			        setCurrent(index);
			      }
			    });
			  })));
			}
			var index$1 = exports('SwiperImage', React__default.forwardRef(SwiperImage));

			var __defProp$9 = Object.defineProperty;
			var __defProps = Object.defineProperties;
			var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
			var __getOwnPropSymbols$9 = Object.getOwnPropertySymbols;
			var __hasOwnProp$9 = Object.prototype.hasOwnProperty;
			var __propIsEnum$9 = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$9 = (obj, key, value) => key in obj ? __defProp$9(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$9 = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$9.call(b, prop))
			      __defNormalProp$9(a, prop, b[prop]);
			  if (__getOwnPropSymbols$9)
			    for (var prop of __getOwnPropSymbols$9(b)) {
			      if (__propIsEnum$9.call(b, prop))
			        __defNormalProp$9(a, prop, b[prop]);
			    }
			  return a;
			};
			var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
			var __objRest$5 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$9.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$9)
			    for (var prop of __getOwnPropSymbols$9(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$9.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function Textarea(_a, ref) {
			  var _b = _a, {
			    className,
			    value,
			    style,
			    error,
			    disabled,
			    cols,
			    rows,
			    readOnly,
			    defaultValue,
			    onChange,
			    onEnterPress,
			    onFocus,
			    onBlur,
			    onKeyDown
			  } = _b, otherProps = __objRest$5(_b, [
			    "className",
			    "value",
			    "style",
			    "error",
			    "disabled",
			    "cols",
			    "rows",
			    "readOnly",
			    "defaultValue",
			    "onChange",
			    "onEnterPress",
			    "onFocus",
			    "onBlur",
			    "onKeyDown"
			  ]);
			  const [inputValue, setValue] = useState(defaultValue != null ? defaultValue : "");
			  const [focused, setFocused] = useState(false);
			  const inputRef = useRef(null);
			  useEffect(() => {
			    if (value === void 0) {
			      return;
			    }
			    setValue(value);
			  }, [value]);
			  useLayoutEffect(() => {
			    var _a2;
			    if (!otherProps.enterKeyHint)
			      return;
			    (_a2 = inputRef.current) == null ? void 0 : _a2.setAttribute("enterkeyhint", otherProps.enterKeyHint);
			    return () => {
			      var _a3;
			      (_a3 = inputRef.current) == null ? void 0 : _a3.removeAttribute("enterkeyhint");
			    };
			  }, [otherProps.enterKeyHint]);
			  useImperativeHandle(ref, () => inputRef.current);
			  function handleChange(e) {
			    setValue(e.target.value);
			    onChange == null ? void 0 : onChange(e.target.value, e);
			  }
			  function handleKeyDown(e) {
			    if (onEnterPress && (e.code === "Enter" || e.keyCode === 13)) {
			      onEnterPress(e);
			    }
			    onKeyDown == null ? void 0 : onKeyDown(e);
			  }
			  function handleFocus(e) {
			    setFocused(true);
			    onFocus == null ? void 0 : onFocus(e);
			  }
			  function handleBlur(e) {
			    setFocused(false);
			    onBlur == null ? void 0 : onBlur(e);
			  }
			  return /* @__PURE__ */ React__default.createElement("textarea", __spreadProps(__spreadValues$9({}, omit(otherProps, "enterKeyHint")), {
			    ref: inputRef,
			    value: inputValue,
			    disabled,
			    readOnly,
			    cols,
			    rows,
			    style,
			    className: cs("ofa-textarea", {
			      "ofa-textarea__disabled": disabled,
			      "ofa-textarea__readOnly": readOnly,
			      "ofa-textarea__focus": focused,
			      "ofa-textarea__error": error
			    }, className),
			    onChange: handleChange,
			    onKeyDown: handleKeyDown,
			    onFocus: handleFocus,
			    onBlur: handleBlur
			  }));
			}
			var index = exports('Textarea', forwardRef(Textarea));

			var dayjs_min = {exports: {}};

			(function (module, exports) {
			!function(t,e){module.exports=e();}(commonjsGlobal,(function(){var t=1e3,e=6e4,n=36e5,r="millisecond",i="second",s="minute",u="hour",a="day",o="week",f="month",h="quarter",c="year",d="date",$="Invalid Date",l=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,M={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_")},m=function(t,e,n){var r=String(t);return !r||r.length>=e?t:""+Array(e+1-r.length).join(n)+t},g={s:m,z:function(t){var e=-t.utcOffset(),n=Math.abs(e),r=Math.floor(n/60),i=n%60;return (e<=0?"+":"-")+m(r,2,"0")+":"+m(i,2,"0")},m:function t(e,n){if(e.date()<n.date())return -t(n,e);var r=12*(n.year()-e.year())+(n.month()-e.month()),i=e.clone().add(r,f),s=n-i<0,u=e.clone().add(r+(s?-1:1),f);return +(-(r+(n-i)/(s?i-u:u-i))||0)},a:function(t){return t<0?Math.ceil(t)||0:Math.floor(t)},p:function(t){return {M:f,y:c,w:o,d:a,D:d,h:u,m:s,s:i,ms:r,Q:h}[t]||String(t||"").toLowerCase().replace(/s$/,"")},u:function(t){return void 0===t}},v="en",D={};D[v]=M;var p=function(t){return t instanceof _},S=function t(e,n,r){var i;if(!e)return v;if("string"==typeof e){var s=e.toLowerCase();D[s]&&(i=s),n&&(D[s]=n,i=s);var u=e.split("-");if(!i&&u.length>1)return t(u[0])}else {var a=e.name;D[a]=e,i=a;}return !r&&i&&(v=i),i||!r&&v},w=function(t,e){if(p(t))return t.clone();var n="object"==typeof e?e:{};return n.date=t,n.args=arguments,new _(n)},O=g;O.l=S,O.i=p,O.w=function(t,e){return w(t,{locale:e.$L,utc:e.$u,x:e.$x,$offset:e.$offset})};var _=function(){function M(t){this.$L=S(t.locale,null,!0),this.parse(t);}var m=M.prototype;return m.parse=function(t){this.$d=function(t){var e=t.date,n=t.utc;if(null===e)return new Date(NaN);if(O.u(e))return new Date;if(e instanceof Date)return new Date(e);if("string"==typeof e&&!/Z$/i.test(e)){var r=e.match(l);if(r){var i=r[2]-1||0,s=(r[7]||"0").substring(0,3);return n?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,s)}}return new Date(e)}(t),this.$x=t.x||{},this.init();},m.init=function(){var t=this.$d;this.$y=t.getFullYear(),this.$M=t.getMonth(),this.$D=t.getDate(),this.$W=t.getDay(),this.$H=t.getHours(),this.$m=t.getMinutes(),this.$s=t.getSeconds(),this.$ms=t.getMilliseconds();},m.$utils=function(){return O},m.isValid=function(){return !(this.$d.toString()===$)},m.isSame=function(t,e){var n=w(t);return this.startOf(e)<=n&&n<=this.endOf(e)},m.isAfter=function(t,e){return w(t)<this.startOf(e)},m.isBefore=function(t,e){return this.endOf(e)<w(t)},m.$g=function(t,e,n){return O.u(t)?this[e]:this.set(n,t)},m.unix=function(){return Math.floor(this.valueOf()/1e3)},m.valueOf=function(){return this.$d.getTime()},m.startOf=function(t,e){var n=this,r=!!O.u(e)||e,h=O.p(t),$=function(t,e){var i=O.w(n.$u?Date.UTC(n.$y,e,t):new Date(n.$y,e,t),n);return r?i:i.endOf(a)},l=function(t,e){return O.w(n.toDate()[t].apply(n.toDate("s"),(r?[0,0,0,0]:[23,59,59,999]).slice(e)),n)},y=this.$W,M=this.$M,m=this.$D,g="set"+(this.$u?"UTC":"");switch(h){case c:return r?$(1,0):$(31,11);case f:return r?$(1,M):$(0,M+1);case o:var v=this.$locale().weekStart||0,D=(y<v?y+7:y)-v;return $(r?m-D:m+(6-D),M);case a:case d:return l(g+"Hours",0);case u:return l(g+"Minutes",1);case s:return l(g+"Seconds",2);case i:return l(g+"Milliseconds",3);default:return this.clone()}},m.endOf=function(t){return this.startOf(t,!1)},m.$set=function(t,e){var n,o=O.p(t),h="set"+(this.$u?"UTC":""),$=(n={},n[a]=h+"Date",n[d]=h+"Date",n[f]=h+"Month",n[c]=h+"FullYear",n[u]=h+"Hours",n[s]=h+"Minutes",n[i]=h+"Seconds",n[r]=h+"Milliseconds",n)[o],l=o===a?this.$D+(e-this.$W):e;if(o===f||o===c){var y=this.clone().set(d,1);y.$d[$](l),y.init(),this.$d=y.set(d,Math.min(this.$D,y.daysInMonth())).$d;}else $&&this.$d[$](l);return this.init(),this},m.set=function(t,e){return this.clone().$set(t,e)},m.get=function(t){return this[O.p(t)]()},m.add=function(r,h){var d,$=this;r=Number(r);var l=O.p(h),y=function(t){var e=w($);return O.w(e.date(e.date()+Math.round(t*r)),$)};if(l===f)return this.set(f,this.$M+r);if(l===c)return this.set(c,this.$y+r);if(l===a)return y(1);if(l===o)return y(7);var M=(d={},d[s]=e,d[u]=n,d[i]=t,d)[l]||1,m=this.$d.getTime()+r*M;return O.w(m,this)},m.subtract=function(t,e){return this.add(-1*t,e)},m.format=function(t){var e=this,n=this.$locale();if(!this.isValid())return n.invalidDate||$;var r=t||"YYYY-MM-DDTHH:mm:ssZ",i=O.z(this),s=this.$H,u=this.$m,a=this.$M,o=n.weekdays,f=n.months,h=function(t,n,i,s){return t&&(t[n]||t(e,r))||i[n].slice(0,s)},c=function(t){return O.s(s%12||12,t,"0")},d=n.meridiem||function(t,e,n){var r=t<12?"AM":"PM";return n?r.toLowerCase():r},l={YY:String(this.$y).slice(-2),YYYY:this.$y,M:a+1,MM:O.s(a+1,2,"0"),MMM:h(n.monthsShort,a,f,3),MMMM:h(f,a),D:this.$D,DD:O.s(this.$D,2,"0"),d:String(this.$W),dd:h(n.weekdaysMin,this.$W,o,2),ddd:h(n.weekdaysShort,this.$W,o,3),dddd:o[this.$W],H:String(s),HH:O.s(s,2,"0"),h:c(1),hh:c(2),a:d(s,u,!0),A:d(s,u,!1),m:String(u),mm:O.s(u,2,"0"),s:String(this.$s),ss:O.s(this.$s,2,"0"),SSS:O.s(this.$ms,3,"0"),Z:i};return r.replace(y,(function(t,e){return e||l[t]||i.replace(":","")}))},m.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},m.diff=function(r,d,$){var l,y=O.p(d),M=w(r),m=(M.utcOffset()-this.utcOffset())*e,g=this-M,v=O.m(this,M);return v=(l={},l[c]=v/12,l[f]=v,l[h]=v/3,l[o]=(g-m)/6048e5,l[a]=(g-m)/864e5,l[u]=g/n,l[s]=g/e,l[i]=g/t,l)[y]||g,$?v:O.a(v)},m.daysInMonth=function(){return this.endOf(f).$D},m.$locale=function(){return D[this.$L]},m.locale=function(t,e){if(!t)return this.$L;var n=this.clone(),r=S(t,e,!0);return r&&(n.$L=r),n},m.clone=function(){return O.w(this.$d,this)},m.toDate=function(){return new Date(this.valueOf())},m.toJSON=function(){return this.isValid()?this.toISOString():null},m.toISOString=function(){return this.$d.toISOString()},m.toString=function(){return this.$d.toUTCString()},M}(),T=_.prototype;return w.prototype=T,[["$ms",r],["$s",i],["$m",s],["$H",u],["$W",a],["$M",f],["$y",c],["$D",d]].forEach((function(t){T[t[1]]=function(e){return this.$g(e,t[0],t[1])};})),w.extend=function(t,e){return t.$i||(t(e,_,w),t.$i=!0),w},w.locale=S,w.isDayjs=p,w.unix=function(t){return w(1e3*t)},w.en=D[v],w.Ls=D,w.p={},w}));
			}(dayjs_min));

			var dayjs = dayjs_min.exports;

			var css$1 = ".ofa-date-picker {\n  display: inline-block;\n}\n\n.ofa-date-picker-input {\n  display: flex;\n  align-items: center;\n  border: 1px solid #d9d9d9;\n  padding: 5px;\n}\n.ofa-date-picker-input.is-disabled {\n  cursor: not-allowed;\n  color: rgba(0, 0, 0, 0.2509803922);\n  background: #f5f5f5;\n}\n.ofa-date-picker-input.is-disabled .ofa-svg-icon {\n  cursor: not-allowed;\n}\n.ofa-date-picker-input > input {\n  width: 100%;\n  border: none;\n  outline: none;\n  background-color: transparent;\n}\n.ofa-date-picker-input .ofa-svg-icon {\n  cursor: pointer;\n}\n\n.ofa-date-picker-panel {\n  margin-top: 4px;\n  background-color: #fff;\n  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);\n}\n.ofa-date-picker-panel .ofa-date-picker-header {\n  display: flex;\n  align-items: center;\n  width: 100%;\n  box-sizing: border-box;\n  border-bottom: 1px solid #d9d9d9;\n}\n.ofa-date-picker-panel .ofa-date-picker-header .ofa-date-picker-time {\n  flex: 1;\n  text-align: center;\n}\n.ofa-date-picker-panel .ofa-date-picker-header .ofa-date-picker-icon-box {\n  display: inline-flex;\n  cursor: pointer;\n}\n.ofa-date-picker-panel .ofa-date-picker-header .ofa-date-picker-icon-box:hover {\n  background-color: #d9d9d9;\n}\n.ofa-date-picker-panel .ofa-pick-time-header {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-left: 1px solid #d9d9d9;\n  padding: 10px 0;\n  flex: 1;\n}\n.ofa-date-picker-panel .ofa-pick-time-container {\n  display: flex;\n  height: 180px;\n}\n.ofa-date-picker-panel .ofa-pick-time-container.left-border-none .ofa-pick-time-column:first-child {\n  border-left: none;\n}\n.ofa-date-picker-panel .ofa-pick-time-container .ofa-pick-time-column {\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  overflow-y: auto;\n  border-left: 1px solid #d9d9d9;\n}\n.ofa-date-picker-panel .ofa-pick-time-container .ofa-pick-time-column > span {\n  text-align: center;\n  cursor: pointer;\n  padding: 5px 20px 5px 10px;\n}\n.ofa-date-picker-panel .ofa-pick-time-container .ofa-pick-time-column > span:hover {\n  background-color: #d9d9d9;\n}\n.ofa-date-picker-panel .ofa-pick-time-container .ofa-pick-time-column > span.is-selected {\n  background-color: aqua;\n}\n.ofa-date-picker-panel .ofa-pick-time-container .ofa-pick-time-column > span.is-disabled {\n  color: rgba(0, 0, 0, 0.2509803922);\n  background: #f5f5f5;\n  cursor: not-allowed;\n}\n.ofa-date-picker-panel .ofa-date-picker-body {\n  display: flex;\n}\n.ofa-date-picker-panel .ofa-date-picker-footer {\n  text-align: center;\n  border-top: 1px solid #d9d9d9;\n}\n.ofa-date-picker-panel .ofa-date-picker-footer .ofa-date-picker-common-footer {\n  position: relative;\n  padding: 10px;\n}\n.ofa-date-picker-panel .ofa-date-picker-footer .ofa-date-picker-common-footer .ofa-date-picker-text-button {\n  float: left;\n}\n.ofa-date-picker-panel .ofa-date-picker-footer .ofa-date-picker-common-footer button {\n  float: right;\n}\n.ofa-date-picker-panel .ofa-date-picker-footer .ofa-date-picker-common-footer::after {\n  content: \".\";\n  clear: both;\n  height: 0;\n  display: block;\n  visibility: hidden;\n}\n.ofa-date-picker-panel .ofa-date-picker-common-header {\n  display: flex;\n  align-items: center;\n  width: 240px;\n  padding: 10px;\n}\n.ofa-date-picker-panel .ofa-pick-date,\n.ofa-date-picker-panel .ofa-pick-year,\n.ofa-date-picker-panel .ofa-pick-month,\n.ofa-date-picker-panel .ofa-pick-century,\n.ofa-date-picker-panel .ofa-pick-quarter {\n  display: grid;\n  width: 240px;\n  padding: 10px;\n}\n.ofa-date-picker-panel .ofa-pick-date > span,\n.ofa-date-picker-panel .ofa-pick-year > span,\n.ofa-date-picker-panel .ofa-pick-month > span,\n.ofa-date-picker-panel .ofa-pick-century > span,\n.ofa-date-picker-panel .ofa-pick-quarter > span {\n  text-align: center;\n}\n.ofa-date-picker-panel .ofa-pick-date {\n  grid-template-columns: repeat(7, 1fr);\n  grid-gap: 5px;\n}\n.ofa-date-picker-panel .ofa-pick-year,\n.ofa-date-picker-panel .ofa-pick-month {\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 20px;\n}\n.ofa-date-picker-panel .ofa-pick-century {\n  grid-template-columns: repeat(3, 1fr);\n  grid-gap: 10px 5px;\n  font-size: 14px;\n}\n.ofa-date-picker-panel .ofa-pick-quarter {\n  grid-template-columns: repeat(4, 1fr);\n  grid-gap: 20px;\n}\n.ofa-date-picker-panel .ofa-pick-item {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  height: 100%;\n  cursor: pointer;\n}\n.ofa-date-picker-panel .ofa-pick-item:hover {\n  background-color: #d9d9d9;\n}\n.ofa-date-picker-panel .ofa-pick-item.is-other-panel {\n  background: #f5f5f5;\n}\n.ofa-date-picker-panel .ofa-pick-item.is-today {\n  border: 1px solid aqua;\n}\n.ofa-date-picker-panel .ofa-pick-item.is-selected {\n  background-color: aqua;\n}\n.ofa-date-picker-panel .ofa-pick-item.is-disabled {\n  color: rgba(0, 0, 0, 0.2509803922);\n  background: #f5f5f5;\n  border: none;\n  cursor: not-allowed;\n}\n.ofa-date-picker-panel .ofa-date-picker-text-button {\n  cursor: pointer;\n}\n.ofa-date-picker-panel .ofa-date-picker-text-button:hover {\n  color: aqua;\n}\n.ofa-date-picker-panel .ofa-date-picker-text-button:not(:last-child) {\n  margin-right: 5px;\n}\n.ofa-date-picker-panel .ofa-date-picker-text-button.is-disabled {\n  color: rgba(0, 0, 0, 0.2509803922);\n  background: #f5f5f5;\n  cursor: not-allowed;\n}";
			n(css$1,{});

			var quarterOfYear$1 = {exports: {}};

			(function (module, exports) {
			!function(t,n){module.exports=n();}(commonjsGlobal,(function(){var t="month",n="quarter";return function(e,i){var r=i.prototype;r.quarter=function(t){return this.$utils().u(t)?Math.ceil((this.month()+1)/3):this.month(this.month()%3+3*(t-1))};var s=r.add;r.add=function(e,i){return e=Number(e),this.$utils().p(i)===n?this.add(3*e,t):s.bind(this)(e,i)};var u=r.startOf;r.startOf=function(e,i){var r=this.$utils(),s=!!r.u(i)||i;if(r.p(e)===n){var o=this.quarter()-1;return s?this.month(3*o).startOf(t).startOf("day"):this.month(3*o+2).endOf(t).endOf("day")}return u.bind(this)(e,i)};}}));
			}(quarterOfYear$1));

			var quarterOfYear = quarterOfYear$1.exports;

			dayjs.extend(quarterOfYear);
			const defaultFormatMap = {
			  "time": "HH:mm:ss",
			  "date": "YYYY-MM-DD",
			  "month": "YYYY-MM",
			  "quarter": "YYYY-Q",
			  "year": "YYYY"
			};
			function getDefaultFormat(mode, timeAccuracy) {
			  let formatStr = defaultFormatMap[mode];
			  if (mode === "date" && timeAccuracy) {
			    formatStr = "YYYY-MM-DD HH:mm:ss";
			  }
			  return formatStr;
			}
			function isLegalDate(dateStr, mode) {
			  return dayjs(transformDate(dateStr, mode)).isValid();
			}
			function transformDate(dateStr, mode) {
			  var _a;
			  let transformDate2 = dateStr;
			  const matchStr = (_a = dateStr.match(/Q\d/)) == null ? void 0 : _a[0];
			  if (matchStr) {
			    transformDate2 = transformDate2.replace(matchStr, "" + getStartMonthOfQuarter(matchStr) + 1);
			  }
			  if (mode === "time") {
			    transformDate2 = dayjs().format("YYYY-MM-DD") + " " + transformDate2;
			  }
			  return transformDate2;
			}
			function getDatesOfMonth(date, disabledDate) {
			  const startDate = date.startOf("month").date();
			  const endDate = date.endOf("month").date();
			  const beforeMonthLastDate = date.subtract(1, "month").endOf("month").date();
			  const startDay = date.startOf("month").day();
			  const endDay = date.endOf("month").day();
			  const dates = [];
			  for (let i = startDay; i > 0; i--) {
			    dates.push({
			      value: beforeMonthLastDate - i + 1,
			      relativeMonth: -1,
			      disabled: disabledDate == null ? void 0 : disabledDate(date.subtract(1, "month").set("date", beforeMonthLastDate - i + 1).toDate())
			    });
			  }
			  for (let i = startDate; i <= endDate; i++) {
			    dates.push({
			      value: i,
			      relativeMonth: 0,
			      disabled: disabledDate == null ? void 0 : disabledDate(date.clone().set("date", i).toDate())
			    });
			  }
			  for (let i = endDay; i < 6; i++) {
			    dates.push({
			      value: i - endDay + 1,
			      relativeMonth: 1,
			      disabled: disabledDate == null ? void 0 : disabledDate(date.add(1, "month").set("date", i - endDay + 1).toDate())
			    });
			  }
			  return dates;
			}
			function getStartYear(date, type) {
			  const curYear = date.get("year");
			  if (type === "ten_years")
			    return curYear - curYear % 10;
			  return curYear - curYear % 100;
			}
			function getQuarterByMonth(month) {
			  return `Q${dayjs().month(month).quarter()}`;
			}
			function getStartMonthOfQuarter(quarter) {
			  return dayjs().quarter(Number(quarter.replace("Q", ""))).startOf("quarter").month();
			}
			function getDate(mode, timeAccuracy) {
			  if (timeAccuracy)
			    return dayjs().startOf(timeAccuracy);
			  if (mode === "")
			    return dayjs().startOf("date");
			  if (mode === "time")
			    return dayjs().startOf("second");
			  if (mode === "century")
			    return dayjs().startOf("year");
			  return dayjs().startOf(mode);
			}
			function scrollTo(dom, location, delay) {
			  if (!window.requestAnimationFrame) {
			    dom.scrollTop = location;
			    return;
			  }
			  const times = Math.ceil((delay || 600) / 60);
			  const speed = (location - dom.scrollTop) / times;
			  function scrollByTimes(dom2, location2, speed2, times2) {
			    if (times2 <= 0) {
			      dom2.scrollTop = location2;
			      return;
			    }
			    dom2.scrollTop += speed2;
			    requestAnimationFrame(() => scrollByTimes(dom2, location2, speed2, times2 - 1));
			  }
			  requestAnimationFrame(() => scrollByTimes(dom, location, speed, times));
			}
			function formatDate(date, format) {
			  if (!date)
			    return "";
			  if (typeof format === "string") {
			    return date.format(format).replace("Q", getQuarterByMonth(date.month()));
			  } else {
			    return format(date.toDate());
			  }
			}

			function DatePickerInput({
			  placeholder = "\u8BF7\u8F93\u5165\u65E5\u671F",
			  date,
			  disabled,
			  readOnly,
			  suffixIcon,
			  mode,
			  format,
			  onChangeInput,
			  onBlur,
			  onClick,
			  onClear
			}, ref) {
			  const [inputValue, setInputValue] = useState(formatDate(date, format));
			  const [hover, setHover] = useState(false);
			  useEffect(() => {
			    setInputValue(formatDate(date, format));
			  }, [date]);
			  function handleChange(e) {
			    setInputValue(e.target.value);
			  }
			  function handleBlur() {
			    onBlur == null ? void 0 : onBlur();
			    setInputValue(formatDate(date, format));
			  }
			  function handleKeyDown(e) {
			    if (e.keyCode !== 13)
			      return;
			    if (inputValue && isLegalDate(inputValue, mode)) {
			      const inputDate = dayjs(transformDate(inputValue, mode));
			      if ((onChangeInput == null ? void 0 : onChangeInput(inputDate)) === false) {
			        setInputValue(formatDate(date, format));
			      }
			    } else {
			      setInputValue(formatDate(date, format));
			    }
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    ref,
			    className: cs("ofa-date-picker-input", disabled && "is-disabled"),
			    onMouseEnter: () => !disabled && setHover(true),
			    onMouseLeave: () => setHover(false)
			  }, /* @__PURE__ */ React__default.createElement("input", {
			    placeholder,
			    value: inputValue,
			    onChange: handleChange,
			    onBlur: handleBlur,
			    onClick,
			    onKeyDown: handleKeyDown,
			    disabled,
			    readOnly: readOnly || !!format
			  }), hover ? /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "close",
			    size: 16,
			    onClick: onClear
			  }) : suffixIcon || /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "calendar_today",
			    size: 16
			  }));
			}
			var DatePickerInput$1 = React__default.forwardRef(DatePickerInput);

			function DatePickerPanel({
			  timeAccuracy,
			  mode,
			  date,
			  onChangePicker,
			  onClose,
			  renderHeader,
			  renderBody,
			  renderFooter
			}) {
			  const [_date, setDate] = useState(date || getDate(mode, timeAccuracy));
			  const [pickedDate, setPickedDate] = useState(date);
			  function changePick(date2) {
			    setDate(date2);
			    setPickedDate(date2);
			  }
			  function confirmPick(date2) {
			    onChangePicker == null ? void 0 : onChangePicker(date2 || pickedDate);
			  }
			  function closePanel() {
			    onClose == null ? void 0 : onClose();
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-date-picker-panel"
			  }, renderHeader && /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-date-picker-header"
			  }, renderHeader({
			    changePanelDate: setDate,
			    panelDate: _date
			  })), renderBody && /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-date-picker-body"
			  }, renderBody({
			    changePick,
			    confirmPick,
			    closePanel,
			    panelDate: _date,
			    pickedDate
			  })), renderFooter && /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-date-picker-footer"
			  }, renderFooter({
			    changePick,
			    confirmPick,
			    closePanel
			  })));
			}

			const WEEK_HEAD = ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"];
			function RenderDatePicker({
			  date,
			  pickedDate,
			  onChange,
			  disabledDate
			}) {
			  const dates = useMemo(() => {
			    return getDatesOfMonth(date, disabledDate);
			  }, [date.year(), date.month()]);
			  function isSameDate(baseDate, { relativeMonth, value }) {
			    return !!(baseDate == null ? void 0 : baseDate.isSame(date.add(relativeMonth, "month").set("date", value), "date"));
			  }
			  function handleChangeDate(pickDate) {
			    onChange == null ? void 0 : onChange(date.add(pickDate.relativeMonth, "month").date(pickDate.value));
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-pick-date"
			  }, WEEK_HEAD.map((value) => /* @__PURE__ */ React__default.createElement("span", {
			    key: value
			  }, value)), dates.map((curDate) => {
			    const { value, relativeMonth } = curDate;
			    if (curDate.disabled) {
			      return /* @__PURE__ */ React__default.createElement("span", {
			        className: "ofa-pick-item is-disabled",
			        key: `${value}${relativeMonth}`
			      }, value);
			    }
			    return /* @__PURE__ */ React__default.createElement("span", {
			      className: cs("ofa-pick-item", isSameDate(dayjs(), curDate) && "is-today", isSameDate(pickedDate, curDate) && "is-selected", relativeMonth !== 0 && "is-other-panel"),
			      key: `${value}${relativeMonth}`,
			      onClick: () => handleChangeDate(curDate)
			    }, value);
			  }));
			}

			const MONTH = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
			function RenderMonthPicker({
			  date,
			  pickedDate,
			  onChange,
			  disabledDate
			}) {
			  const month = useMemo(() => {
			    return MONTH.map((curMonth) => ({
			      value: curMonth,
			      isDisabled: !!(disabledDate == null ? void 0 : disabledDate(date.clone().set("month", curMonth).toDate()))
			    }));
			  }, [date.year()]);
			  function handleChangeMonth(month2) {
			    onChange == null ? void 0 : onChange(date.month(month2));
			  }
			  function isSameMonth(baseDate, month2) {
			    return !!(baseDate == null ? void 0 : baseDate.isSame(date.clone().month(month2), "month"));
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-pick-month"
			  }, month.map(({ value, isDisabled }) => {
			    if (isDisabled) {
			      return /* @__PURE__ */ React__default.createElement("span", {
			        className: "ofa-pick-item is-disabled",
			        key: value
			      }, value + 1, "\u6708");
			    }
			    return /* @__PURE__ */ React__default.createElement("span", {
			      className: cs("ofa-pick-item", isSameMonth(dayjs(), value) && "is-today", isSameMonth(pickedDate, value) && "is-selected"),
			      key: value,
			      onClick: () => handleChangeMonth(value)
			    }, value + 1, "\u6708");
			  }));
			}

			const QUARTER = ["Q1", "Q2", "Q3", "Q4"];
			function RenderQuarterPicker({
			  date,
			  pickedDate,
			  onChange,
			  disabledDate
			}) {
			  const quarter = useMemo(() => {
			    return QUARTER.map((curQuarter) => ({
			      value: curQuarter,
			      isDisabled: !!(disabledDate == null ? void 0 : disabledDate(date.clone().set("month", getStartMonthOfQuarter(curQuarter)).toDate()))
			    }));
			  }, [date.year()]);
			  function handleChangeMonth(quarter2) {
			    const startMonth = getStartMonthOfQuarter(quarter2);
			    onChange == null ? void 0 : onChange(date.month(startMonth));
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-pick-quarter"
			  }, quarter.map(({ value, isDisabled }) => {
			    if (isDisabled) {
			      return /* @__PURE__ */ React__default.createElement("span", {
			        className: "ofa-pick-item is-disabled",
			        key: value
			      }, value);
			    }
			    return /* @__PURE__ */ React__default.createElement("span", {
			      className: cs("ofa-pick-item", getQuarterByMonth(dayjs().month()) === value && "is-today", pickedDate && getQuarterByMonth(pickedDate.month()) === value && "is-selected"),
			      key: value,
			      onClick: () => handleChangeMonth(value)
			    }, value);
			  }));
			}

			function RenderYearPicker({
			  date,
			  pickedDate,
			  onChange,
			  disabledDate
			}) {
			  const years = useMemo(() => {
			    const year = date.get("year");
			    const startYear = year - year % 10;
			    return new Array(12).fill(1).map((val, index) => ({
			      value: startYear + index - 1,
			      isDisabled: !!(disabledDate == null ? void 0 : disabledDate(date.clone().set("year", startYear + index - 1).toDate()))
			    }));
			  }, [date.year()]);
			  function handleChangeYear(year) {
			    onChange == null ? void 0 : onChange(date.year(year));
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-pick-year"
			  }, years.map(({ value, isDisabled }, index) => {
			    if (isDisabled) {
			      return /* @__PURE__ */ React__default.createElement("span", {
			        className: "ofa-pick-item is-disabled",
			        key: value
			      }, value, "\u5E74");
			    }
			    return /* @__PURE__ */ React__default.createElement("span", {
			      className: cs("ofa-pick-item", dayjs().year() === value && "is-today", (pickedDate == null ? void 0 : pickedDate.year()) === value && "is-selected", [0, years.length - 1].includes(index) && "is-other-panel"),
			      key: value,
			      onClick: () => handleChangeYear(value)
			    }, value, "\u5E74");
			  }));
			}

			function RenderCenturyPicker({
			  date,
			  pickedDate,
			  onChange
			}) {
			  const years = useMemo(() => {
			    const year = date.year();
			    const startYear = year - year % 100;
			    return new Array(12).fill(1).map((val, index) => startYear + (index - 1) * 10);
			  }, [date.year()]);
			  const pickedYear = useMemo(() => pickedDate == null ? void 0 : pickedDate.year(), [pickedDate == null ? void 0 : pickedDate.year()]);
			  function toFloorTen(num) {
			    if (!num)
			      return 0;
			    return Math.floor(num / 10) * 10;
			  }
			  function handleChangeTenYear(startYear) {
			    onChange == null ? void 0 : onChange(date.year(startYear));
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-pick-century"
			  }, years.map((startYear, index) => /* @__PURE__ */ React__default.createElement("span", {
			    className: cs("ofa-pick-item", toFloorTen(dayjs().year()) === startYear && "is-today", toFloorTen(pickedYear) === startYear && "is-selected", [0, years.length - 1].includes(index) && "is-other-panel"),
			    key: startYear,
			    onClick: () => handleChangeTenYear(startYear)
			  }, startYear, "-", startYear + 9)));
			}

			const HOURS = new Array(24).fill(1).map((val, index) => index);
			const MINUTES = new Array(60).fill(1).map((val, index) => index);
			const SECONDS = [...MINUTES];
			function RenderTimePicker({
			  timeAccuracy,
			  pickedDate,
			  hasLeftBorder,
			  onChange,
			  disabledTime
			}) {
			  const { pickedHour, pickedMinute, pickedSecond } = useMemo(() => {
			    return {
			      pickedHour: (pickedDate == null ? void 0 : pickedDate.hour()) || 0,
			      pickedMinute: (pickedDate == null ? void 0 : pickedDate.minute()) || 0,
			      pickedSecond: (pickedDate == null ? void 0 : pickedDate.second()) || 0
			    };
			  }, [pickedDate]);
			  const { hours, minutes, seconds } = useMemo(() => {
			    return {
			      hours: HOURS.map((hour) => ({ value: hour, isDisabled: !!(disabledTime == null ? void 0 : disabledTime("hour", hour)) })),
			      minutes: MINUTES.map((minute) => ({ value: minute, isDisabled: !!(disabledTime == null ? void 0 : disabledTime("minute", minute)) })),
			      seconds: SECONDS.map((second) => ({ value: second, isDisabled: !!(disabledTime == null ? void 0 : disabledTime("second", second)) }))
			    };
			  }, [disabledTime]);
			  function handleChange(type, num) {
			    onChange == null ? void 0 : onChange((pickedDate || dayjs().startOf("date")).set(type, num));
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: cs("ofa-pick-time-container", !hasLeftBorder && "left-border-none")
			  }, /* @__PURE__ */ React__default.createElement(PickerTimeColumn, {
			    data: hours,
			    pickedTime: pickedHour,
			    onChange: (time) => handleChange("hour", time)
			  }), ["minute", "second"].includes(timeAccuracy || "") && /* @__PURE__ */ React__default.createElement(PickerTimeColumn, {
			    data: minutes,
			    pickedTime: pickedMinute,
			    onChange: (time) => handleChange("minute", time)
			  }), timeAccuracy === "second" && /* @__PURE__ */ React__default.createElement(PickerTimeColumn, {
			    data: seconds,
			    pickedTime: pickedSecond,
			    onChange: (time) => handleChange("second", time)
			  }));
			}
			function PickerTimeColumn({ data, pickedTime, onChange }) {
			  const timeColumnRef = useRef(null);
			  useEffect(() => {
			    if (pickedTime && timeColumnRef.current) {
			      const itemHeight = timeColumnRef.current.scrollHeight / data.length;
			      scrollTo(timeColumnRef.current, itemHeight * pickedTime);
			    }
			  }, [pickedTime]);
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-pick-time-column",
			    ref: timeColumnRef
			  }, data.map(({ value, isDisabled }) => {
			    return /* @__PURE__ */ React__default.createElement("span", {
			      key: value,
			      className: cs(pickedTime === value && "is-selected", isDisabled && "is-disabled"),
			      onClick: () => !isDisabled && onChange(value)
			    }, value);
			  }));
			}

			function RenderBody({
			  pickScope,
			  mode,
			  timeAccuracy,
			  onPickScopeChange,
			  disabledDate,
			  disabledTime,
			  panelDate,
			  pickedDate,
			  changePick,
			  confirmPick
			}) {
			  function handleChangePicker(date, nextScope) {
			    if (mode === pickScope && !timeAccuracy) {
			      confirmPick(date);
			      return;
			    }
			    nextScope && onPickScopeChange(nextScope);
			    changePick(date);
			  }
			  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, pickScope === "date" && /* @__PURE__ */ React__default.createElement(RenderDatePicker, {
			    date: panelDate,
			    pickedDate,
			    onChange: (date) => handleChangePicker(date, ""),
			    disabledDate
			  }), pickScope === "month" && /* @__PURE__ */ React__default.createElement(RenderMonthPicker, {
			    date: panelDate,
			    pickedDate,
			    onChange: (date) => handleChangePicker(date, "date"),
			    disabledDate
			  }), pickScope === "quarter" && /* @__PURE__ */ React__default.createElement(RenderQuarterPicker, {
			    date: panelDate,
			    pickedDate,
			    onChange: (date) => handleChangePicker(date, "date"),
			    disabledDate
			  }), pickScope === "year" && /* @__PURE__ */ React__default.createElement(RenderYearPicker, {
			    date: panelDate,
			    pickedDate,
			    onChange: (date) => handleChangePicker(date, mode === "quarter" ? "quarter" : "month"),
			    disabledDate
			  }), pickScope === "century" && /* @__PURE__ */ React__default.createElement(RenderCenturyPicker, {
			    date: panelDate,
			    pickedDate,
			    onChange: (date) => handleChangePicker(date, "year")
			  }), timeAccuracy && /* @__PURE__ */ React__default.createElement(RenderTimePicker, {
			    hasLeftBorder: mode !== "time",
			    timeAccuracy,
			    pickedDate,
			    onChange: changePick,
			    disabledTime
			  }));
			}

			function CommonHeader({
			  nextIcon,
			  prevIcon,
			  superNextIcon,
			  superPrevIcon,
			  hiddenArrow = false,
			  children,
			  onSubtract,
			  onAdd,
			  onSuperSubtract,
			  onSupperAdd
			}) {
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-date-picker-common-header"
			  }, /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-icon-box",
			    onClick: onSuperSubtract
			  }, superPrevIcon || /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "arrow_left",
			    size: 20
			  })), !hiddenArrow && /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-icon-box",
			    onClick: onSubtract
			  }, prevIcon || /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "keyboard_arrow_left",
			    size: 20
			  })), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-time"
			  }, children), !hiddenArrow && /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-icon-box",
			    onClick: onAdd
			  }, nextIcon || /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "keyboard_arrow_right",
			    size: 20
			  })), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-icon-box",
			    onClick: onSupperAdd
			  }, superNextIcon || /* @__PURE__ */ React__default.createElement(Icon, {
			    name: "arrow_right",
			    size: 20
			  })));
			}

			var __defProp$8 = Object.defineProperty;
			var __getOwnPropSymbols$8 = Object.getOwnPropertySymbols;
			var __hasOwnProp$8 = Object.prototype.hasOwnProperty;
			var __propIsEnum$8 = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$8 = (obj, key, value) => key in obj ? __defProp$8(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$8 = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$8.call(b, prop))
			      __defNormalProp$8(a, prop, b[prop]);
			  if (__getOwnPropSymbols$8)
			    for (var prop of __getOwnPropSymbols$8(b)) {
			      if (__propIsEnum$8.call(b, prop))
			        __defNormalProp$8(a, prop, b[prop]);
			    }
			  return a;
			};
			var __objRest$4 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$8.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$8)
			    for (var prop of __getOwnPropSymbols$8(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$8.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function RenderDateHeader$1(_a) {
			  var _b = _a, {
			    panelDate,
			    changePanelDate,
			    onPickScopeChange
			  } = _b, props = __objRest$4(_b, [
			    "panelDate",
			    "changePanelDate",
			    "onPickScopeChange"
			  ]);
			  return /* @__PURE__ */ React__default.createElement(CommonHeader, __spreadValues$8({
			    onAdd: () => changePanelDate(panelDate.add(1, "month")),
			    onSubtract: () => changePanelDate(panelDate.subtract(1, "month")),
			    onSupperAdd: () => changePanelDate(panelDate.add(1, "year")),
			    onSuperSubtract: () => changePanelDate(panelDate.subtract(1, "year"))
			  }, props), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-text-button",
			    onClick: () => onPickScopeChange("year")
			  }, panelDate.format("YYYY\u5E74")), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-text-button",
			    onClick: () => onPickScopeChange("month")
			  }, panelDate.format("MM\u6708")));
			}

			var __defProp$7 = Object.defineProperty;
			var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
			var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
			var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$7 = (obj, key, value) => key in obj ? __defProp$7(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$7 = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$7.call(b, prop))
			      __defNormalProp$7(a, prop, b[prop]);
			  if (__getOwnPropSymbols$7)
			    for (var prop of __getOwnPropSymbols$7(b)) {
			      if (__propIsEnum$7.call(b, prop))
			        __defNormalProp$7(a, prop, b[prop]);
			    }
			  return a;
			};
			var __objRest$3 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$7.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$7)
			    for (var prop of __getOwnPropSymbols$7(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$7.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function RenderMonthHeader$1(_a) {
			  var _b = _a, {
			    panelDate,
			    changePanelDate,
			    onPickScopeChange
			  } = _b, props = __objRest$3(_b, [
			    "panelDate",
			    "changePanelDate",
			    "onPickScopeChange"
			  ]);
			  return /* @__PURE__ */ React__default.createElement(CommonHeader, __spreadValues$7({
			    hiddenArrow: true,
			    onSupperAdd: () => changePanelDate(panelDate.add(1, "year")),
			    onSuperSubtract: () => changePanelDate(panelDate.subtract(1, "year"))
			  }, props), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-text-button",
			    onClick: () => onPickScopeChange("year")
			  }, panelDate.format("YYYY\u5E74")));
			}

			var __defProp$6 = Object.defineProperty;
			var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
			var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
			var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$6 = (obj, key, value) => key in obj ? __defProp$6(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$6 = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$6.call(b, prop))
			      __defNormalProp$6(a, prop, b[prop]);
			  if (__getOwnPropSymbols$6)
			    for (var prop of __getOwnPropSymbols$6(b)) {
			      if (__propIsEnum$6.call(b, prop))
			        __defNormalProp$6(a, prop, b[prop]);
			    }
			  return a;
			};
			var __objRest$2 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$6.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$6)
			    for (var prop of __getOwnPropSymbols$6(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$6.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function RenderYearHeader(_a) {
			  var _b = _a, {
			    panelDate,
			    changePanelDate,
			    onPickScopeChange
			  } = _b, props = __objRest$2(_b, [
			    "panelDate",
			    "changePanelDate",
			    "onPickScopeChange"
			  ]);
			  return /* @__PURE__ */ React__default.createElement(CommonHeader, __spreadValues$6({
			    hiddenArrow: true,
			    onSupperAdd: () => changePanelDate(panelDate.add(10, "year")),
			    onSuperSubtract: () => changePanelDate(panelDate.subtract(10, "year"))
			  }, props), /* @__PURE__ */ React__default.createElement("span", {
			    className: "ofa-date-picker-text-button",
			    onClick: () => onPickScopeChange("century")
			  }, getStartYear(panelDate, "ten_years"), "-", getStartYear(panelDate, "ten_years") + 9));
			}

			var __defProp$5 = Object.defineProperty;
			var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
			var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
			var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$5 = (obj, key, value) => key in obj ? __defProp$5(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$5 = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$5.call(b, prop))
			      __defNormalProp$5(a, prop, b[prop]);
			  if (__getOwnPropSymbols$5)
			    for (var prop of __getOwnPropSymbols$5(b)) {
			      if (__propIsEnum$5.call(b, prop))
			        __defNormalProp$5(a, prop, b[prop]);
			    }
			  return a;
			};
			var __objRest$1 = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$5.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$5)
			    for (var prop of __getOwnPropSymbols$5(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$5.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function RenderDateHeader(_a) {
			  var _b = _a, {
			    panelDate,
			    changePanelDate
			  } = _b, props = __objRest$1(_b, [
			    "panelDate",
			    "changePanelDate"
			  ]);
			  return /* @__PURE__ */ React__default.createElement(CommonHeader, __spreadValues$5({
			    hiddenArrow: true,
			    onSupperAdd: () => changePanelDate(panelDate.add(100, "year")),
			    onSuperSubtract: () => changePanelDate(panelDate.subtract(100, "year"))
			  }, props), /* @__PURE__ */ React__default.createElement("span", null, getStartYear(panelDate, "century"), "-", getStartYear(panelDate, "century") + 99));
			}

			function RenderMonthHeader({
			  format,
			  panelDate,
			  timeAccuracy
			}) {
			  const formatTime = useMemo(() => {
			    if (format)
			      return format;
			    if (!timeAccuracy)
			      return "HH:mm:ss";
			    return {
			      "hour": "HH",
			      "minute": "HH:mm",
			      "second": "HH:mm:ss"
			    }[timeAccuracy];
			  }, [timeAccuracy, format]);
			  function formatPickedTime() {
			    const date = panelDate || dayjs().startOf("date");
			    return date.format(formatTime);
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-pick-time-header"
			  }, formatPickedTime());
			}

			var __defProp$4 = Object.defineProperty;
			var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
			var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
			var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
			var __defNormalProp$4 = (obj, key, value) => key in obj ? __defProp$4(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
			var __spreadValues$4 = (a, b) => {
			  for (var prop in b || (b = {}))
			    if (__hasOwnProp$4.call(b, prop))
			      __defNormalProp$4(a, prop, b[prop]);
			  if (__getOwnPropSymbols$4)
			    for (var prop of __getOwnPropSymbols$4(b)) {
			      if (__propIsEnum$4.call(b, prop))
			        __defNormalProp$4(a, prop, b[prop]);
			    }
			  return a;
			};
			var __objRest = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$4.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$4)
			    for (var prop of __getOwnPropSymbols$4(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$4.call(source, prop))
			        target[prop] = source[prop];
			    }
			  return target;
			};
			function RenderHeader(_a) {
			  var _b = _a, {
			    pickScope,
			    format,
			    timeAccuracy
			  } = _b, props = __objRest(_b, [
			    "pickScope",
			    "format",
			    "timeAccuracy"
			  ]);
			  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null, pickScope === "date" && /* @__PURE__ */ React__default.createElement(RenderDateHeader$1, __spreadValues$4({}, props)), ["month", "quarter"].includes(pickScope) && /* @__PURE__ */ React__default.createElement(RenderMonthHeader$1, __spreadValues$4({}, props)), pickScope === "year" && /* @__PURE__ */ React__default.createElement(RenderYearHeader, __spreadValues$4({}, props)), pickScope === "century" && /* @__PURE__ */ React__default.createElement(RenderDateHeader, __spreadValues$4({}, props)), pickScope !== "time" && timeAccuracy && /* @__PURE__ */ React__default.createElement(RenderMonthHeader, __spreadValues$4({
			    format,
			    timeAccuracy
			  }, props)));
			}

			function CommonFooter({
			  onPickPresent,
			  onConfirm,
			  disabledPresent,
			  buttonText = "\u786E\u5B9A",
			  presentText = "\u4ECA\u5929"
			}) {
			  function handleClickPresent() {
			    if (disabledPresent)
			      return;
			    onPickPresent == null ? void 0 : onPickPresent();
			  }
			  if (!onPickPresent && !onConfirm)
			    return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null);
			  return /* @__PURE__ */ React__default.createElement("div", {
			    className: "ofa-date-picker-common-footer"
			  }, onPickPresent && /* @__PURE__ */ React__default.createElement("span", {
			    className: cs("ofa-date-picker-text-button", disabledPresent && "is-disabled"),
			    onClick: handleClickPresent
			  }, presentText), onConfirm && /* @__PURE__ */ React__default.createElement("button", {
			    onClick: onConfirm
			  }, buttonText));
			}

			dayjs.extend(quarterOfYear);
			function RenderFooter({
			  mode,
			  pickScope,
			  timeAccuracy,
			  hiddenPresent = false,
			  onPickScopeChange,
			  changePick,
			  confirmPick,
			  disabledDate,
			  disabledTime
			}) {
			  function handleChangePicker(date, nextScope) {
			    if (mode === pickScope) {
			      confirmPick(date);
			      return;
			    }
			    nextScope && onPickScopeChange(nextScope);
			    changePick(date);
			  }
			  function handlePickPresent(startScope, nextScope) {
			    if (startScope === "time")
			      return;
			    handleChangePicker(dayjs().startOf(startScope), nextScope);
			  }
			  function isDisabledPresent(startScope) {
			    if (startScope === "time")
			      return false;
			    return !!(disabledDate == null ? void 0 : disabledDate(dayjs().startOf(startScope).toDate()));
			  }
			  if (timeAccuracy)
			    return /* @__PURE__ */ React__default.createElement(CommonFooter, {
			      onPickPresent: hiddenPresent || disabledTime ? void 0 : () => handlePickPresent(timeAccuracy, ""),
			      presentText: "\u6B64\u523B",
			      onConfirm: () => confirmPick()
			    });
			  if (pickScope === "date")
			    return /* @__PURE__ */ React__default.createElement(CommonFooter, {
			      disabledPresent: isDisabledPresent("date"),
			      onPickPresent: hiddenPresent ? void 0 : () => handlePickPresent("date", ""),
			      presentText: "\u4ECA\u5929"
			    });
			  if (pickScope === "month")
			    return /* @__PURE__ */ React__default.createElement(CommonFooter, {
			      disabledPresent: isDisabledPresent("month"),
			      onPickPresent: hiddenPresent ? void 0 : () => handlePickPresent("month", "date"),
			      presentText: "\u5F53\u524D\u6708"
			    });
			  if (pickScope === "quarter")
			    return /* @__PURE__ */ React__default.createElement(CommonFooter, {
			      disabledPresent: isDisabledPresent("quarter"),
			      onPickPresent: hiddenPresent ? void 0 : () => handlePickPresent("quarter", ""),
			      presentText: "\u5F53\u524D\u5B63\u5EA6"
			    });
			  if (pickScope === "year")
			    return /* @__PURE__ */ React__default.createElement(CommonFooter, {
			      disabledPresent: isDisabledPresent("year"),
			      onPickPresent: hiddenPresent ? void 0 : () => handlePickPresent("year", mode === "quarter" ? "quarter" : "month"),
			      presentText: "\u4ECA\u5E74"
			    });
			  return /* @__PURE__ */ React__default.createElement(React__default.Fragment, null);
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
			function DatePicker$1({
			  defaultValue,
			  value,
			  mode = "date",
			  placeholder,
			  disabled,
			  inputReadOnly,
			  className,
			  style,
			  popupClassName,
			  popupStyle,
			  placement = "bottom-start",
			  suffixIcon,
			  nextIcon,
			  prevIcon,
			  superNextIcon,
			  superPrevIcon,
			  hiddenPresent = false,
			  timeAccuracy,
			  format,
			  disabledDate,
			  disabledTime,
			  onOpenChange,
			  onChange
			}, ref) {
			  const [date, setDate] = useState();
			  const [pickScope, setPickScope] = useState(mode);
			  const { referenceRef, Popper, handleClick, close, handleBlur } = usePopper(onVisibleChange);
			  const _timeAccuracy = useMemo(() => {
			    if (mode === "time" && !timeAccuracy)
			      return "second";
			    if (["time", "date"].includes(mode))
			      return timeAccuracy;
			  }, [mode, timeAccuracy]);
			  const formatWays = format || getDefaultFormat(mode, timeAccuracy);
			  useEffect(() => createDateByValue(defaultValue), []);
			  useEffect(() => createDateByValue(value), [value]);
			  function onVisibleChange(visible) {
			    if (!visible)
			      setPickScope(mode);
			    onOpenChange == null ? void 0 : onOpenChange(visible);
			  }
			  function createDateByValue(value2) {
			    if (!value2)
			      return;
			    const date2 = initDate(value2);
			    if (disabledDate == null ? void 0 : disabledDate(date2.toDate()))
			      return;
			    setDate(date2);
			  }
			  function handleChange(date2) {
			    if (date2 && ((disabledDate == null ? void 0 : disabledDate(date2.toDate())) || (disabledTime == null ? void 0 : disabledTime("hour", date2.hour())) || (disabledTime == null ? void 0 : disabledTime("minute", date2.minute())) || (disabledTime == null ? void 0 : disabledTime("second", date2.second())))) {
			      return false;
			    }
			    setDate(date2);
			    if (format || mode === "time") {
			      onChange == null ? void 0 : onChange(formatDate(date2, formatWays));
			    } else {
			      onChange == null ? void 0 : onChange(date2 == null ? void 0 : date2.toDate());
			    }
			    close();
			    return true;
			  }
			  function initDate(value2) {
			    if (value2 instanceof Date)
			      return dayjs(value2);
			    return dayjs(transformDate(value2, mode));
			  }
			  function renderHeader(props) {
			    const extraProps = {
			      nextIcon,
			      superNextIcon,
			      prevIcon,
			      superPrevIcon
			    };
			    return /* @__PURE__ */ React__default.createElement(RenderHeader, __spreadValues$3(__spreadValues$3({
			      pickScope,
			      timeAccuracy: _timeAccuracy,
			      onPickScopeChange: setPickScope
			    }, props), extraProps));
			  }
			  function renderBody(props) {
			    return /* @__PURE__ */ React__default.createElement(RenderBody, __spreadValues$3({
			      mode,
			      pickScope,
			      timeAccuracy: _timeAccuracy,
			      onPickScopeChange: setPickScope,
			      disabledDate,
			      disabledTime
			    }, props));
			  }
			  function renderFooter(props) {
			    return /* @__PURE__ */ React__default.createElement(RenderFooter, __spreadValues$3({
			      mode,
			      pickScope,
			      timeAccuracy: _timeAccuracy,
			      hiddenPresent,
			      onPickScopeChange: setPickScope,
			      disabledDate,
			      disabledTime
			    }, props));
			  }
			  return /* @__PURE__ */ React__default.createElement("div", {
			    ref,
			    className: cs("ofa-date-picker", className),
			    style
			  }, /* @__PURE__ */ React__default.createElement(DatePickerInput$1, {
			    ref: referenceRef,
			    date,
			    placeholder,
			    disabled,
			    readOnly: inputReadOnly,
			    suffixIcon,
			    mode,
			    format: formatWays,
			    timeAccuracy: _timeAccuracy,
			    onClick: (e) => !disabled && handleClick()(e),
			    onBlur: handleBlur,
			    onChangeInput: handleChange,
			    onClear: () => {
			      setDate(void 0);
			      onChange == null ? void 0 : onChange(void 0);
			    }
			  }), /* @__PURE__ */ React__default.createElement(Popper, {
			    placement,
			    className: popupClassName,
			    style: popupStyle
			  }, /* @__PURE__ */ React__default.createElement(DatePickerPanel, {
			    timeAccuracy: _timeAccuracy,
			    mode,
			    date,
			    onChangePicker: handleChange,
			    renderHeader,
			    renderFooter,
			    renderBody,
			    onClose: close
			  })));
			}
			var datePickerComp = React__default.forwardRef(DatePicker$1);

			var __defProp$2 = Object.defineProperty;
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
			function DatePicker(props) {
			  return /* @__PURE__ */ React__default.createElement(datePickerComp, __spreadValues$2({
			    mode: "date"
			  }, props));
			}

			var __defProp$1 = Object.defineProperty;
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
			function TimePicker(props) {
			  return /* @__PURE__ */ React__default.createElement(datePickerComp, __spreadValues$1({
			    mode: "time"
			  }, props));
			}

			var __defProp = Object.defineProperty;
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
			function DateTimePicker(props) {
			  return /* @__PURE__ */ React__default.createElement(datePickerComp, __spreadValues({
			    mode: "date",
			    timeAccuracy: "second"
			  }, props));
			}

			var css = "@keyframes ofa-spin {\n  from {\n    transform: rotate(0deg);\n  }\n\n  to {\n    transform: rotate(360deg);\n  }\n}\n";
			n(css,{});

		})
	};
}));