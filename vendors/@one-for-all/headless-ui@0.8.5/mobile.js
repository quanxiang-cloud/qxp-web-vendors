System.register(['react', 'lodash', '@one-for-all/icon'], (function (exports) {
	'use strict';
	var React, forwardRef, useContext, useState, useRef, useImperativeHandle, useEffect, memo, useLayoutEffect, useCallback, isValidElement, useMemo, omit, Icon;
	return {
		setters: [function (module) {
			React = module["default"];
			forwardRef = module.forwardRef;
			useContext = module.useContext;
			useState = module.useState;
			useRef = module.useRef;
			useImperativeHandle = module.useImperativeHandle;
			useEffect = module.useEffect;
			memo = module.memo;
			useLayoutEffect = module.useLayoutEffect;
			useCallback = module.useCallback;
			isValidElement = module.isValidElement;
			useMemo = module.useMemo;
		}, function (module) {
			omit = module.omit;
		}, function (module) {
			Icon = module["default"];
		}],
		execute: (function () {

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

			var GroupContext$1 = React.createContext(null);

			var __getOwnPropSymbols$7 = Object.getOwnPropertySymbols;
			var __hasOwnProp$7 = Object.prototype.hasOwnProperty;
			var __propIsEnum$7 = Object.prototype.propertyIsEnumerable;
			var __objRest$4 = (source, exclude) => {
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
			function InternalRadio(_a, ref) {
			  var _b = _a, { className, style, label, error, onChange } = _b, restProps = __objRest$4(_b, ["className", "style", "label", "error", "onChange"]);
			  const groupContext = useContext(GroupContext$1);
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
			  return /* @__PURE__ */ React.createElement("label", {
			    ref: rootRef,
			    style,
			    className: cs("ofa-radio-wrapper", {
			      "ofa-radio-wrapper__checked": checked,
			      "ofa-radio-wrapper__disabled": disabled,
			      "ofa-radio-wrapper__error": error
			    }, className)
			  }, /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-radio-item"
			  }, /* @__PURE__ */ React.createElement("input", {
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
			  }), /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-radio-icon"
			  })), label && /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-radio-label"
			  }, label));
			}
			const Radio = exports('Radio', forwardRef(InternalRadio));

			var __getOwnPropSymbols$6 = Object.getOwnPropertySymbols;
			var __hasOwnProp$6 = Object.prototype.hasOwnProperty;
			var __propIsEnum$6 = Object.prototype.propertyIsEnumerable;
			var __objRest$3 = (source, exclude) => {
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
			function InternalRadioGroup(_a, ref) {
			  var _b = _a, {
			    className,
			    style,
			    options = [],
			    children,
			    disabled,
			    onChange,
			    name
			  } = _b, restProps = __objRest$3(_b, [
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
			    child = getOptions().map((option) => /* @__PURE__ */ React.createElement(Radio, {
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
			  return /* @__PURE__ */ React.createElement("div", {
			    className: cs({ "radio-group-wrapper__disbaled": disabled }, className),
			    style,
			    ref
			  }, /* @__PURE__ */ React.createElement(GroupContext$1.Provider, {
			    value: context
			  }, child));
			}
			const RadioGroup = forwardRef(InternalRadioGroup);
			var group$1 = exports('RadioGroup', memo(RadioGroup));

			var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

			var css$6 = ".ofa-radio-wrapper {\n  background-color: white;\n  cursor: pointer;\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n\n.ofa-radio-icon {\n  position: relative;\n  transition: all 0.24s;\n  border-radius: 9999px;\n  border: 1px solid gray;\n  box-sizing: border-box;\n  position: relative;\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n}\n\n.ofa-radio-icon::after {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  display: block;\n  width: 16px;\n  height: 16px;\n  margin-top: -8px;\n  margin-left: -8px;\n  background-color: blue;\n  border-top: 0;\n  border-left: 0;\n  border-radius: 16px;\n  transform: scale(0);\n  opacity: 0;\n  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);\n  content: \" \";\n}\n\n.ofa-radio-item {\n  display: flex;\n}\n\n.ofa-radio-wrapper__checked .ofa-radio-icon {\n  border-color: blue;\n}\n.ofa-radio-wrapper__checked .ofa-radio-icon::after {\n  transform: scale(0.5);\n  opacity: 1;\n  transition: all 0.3s cubic-bezier(0.78, 0.14, 0.15, 0.86);\n}\n\n.ofa-radio-wrapper__disabled,\n.ofa-radio-wrapper__checked.ofa-radio-wrapper__disabled {\n  cursor: no-drop;\n}\n.ofa-radio-wrapper__disabled .ofa-radio-icon,\n.ofa-radio-wrapper__checked.ofa-radio-wrapper__disabled .ofa-radio-icon {\n  border-color: #d9d9d9;\n}\n.ofa-radio-wrapper__disabled .ofa-radio-icon::after,\n.ofa-radio-wrapper__checked.ofa-radio-wrapper__disabled .ofa-radio-icon::after {\n  background-color: rgba(0, 0, 0, 0.2);\n}\n\n.ofa-radio-wrapper__disabled .ofa-radio-label {\n  color: rgba(0, 0, 0, 0.2509803922);\n}";
			n(css$6,{});

			var GroupContext = React.createContext(null);

			var __getOwnPropSymbols$5 = Object.getOwnPropertySymbols;
			var __hasOwnProp$5 = Object.prototype.hasOwnProperty;
			var __propIsEnum$5 = Object.prototype.propertyIsEnumerable;
			var __objRest$2 = (source, exclude) => {
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
			function InternalCheckbox(_a, ref) {
			  var _b = _a, { className, style, label, indeterminate, error, onChange } = _b, restProps = __objRest$2(_b, ["className", "style", "label", "indeterminate", "error", "onChange"]);
			  const [name, setName] = useState();
			  const [checked, setChecked] = useState(!!restProps.checked);
			  const [disabled, setDisabled] = useState(!!restProps.disabled);
			  const groupContext = useContext(GroupContext);
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
			  return /* @__PURE__ */ React.createElement("label", {
			    ref: rootRef,
			    style,
			    className: cs("ofa-checkbox-wrapper", {
			      "ofa-checkbox-wrapper__indeterminate": indeterminate,
			      "ofa-checkbox-wrapper__checked": checked,
			      "ofa-checkbox-wrapper__disabled": disabled,
			      "ofa-checkbox-wrapper__error": error
			    }, className)
			  }, /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-checkbox-item"
			  }, /* @__PURE__ */ React.createElement("input", {
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
			  }), /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-checkbox-icon"
			  })), label && /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-checkbox-label"
			  }, label));
			}
			var Checkbox = exports('Checkbox', forwardRef(InternalCheckbox));

			var __getOwnPropSymbols$4 = Object.getOwnPropertySymbols;
			var __hasOwnProp$4 = Object.prototype.hasOwnProperty;
			var __propIsEnum$4 = Object.prototype.propertyIsEnumerable;
			var __objRest$1 = (source, exclude) => {
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
			function InternalCheckboxGroup(_a, ref) {
			  var _b = _a, {
			    className,
			    style,
			    options = [],
			    disabled,
			    children,
			    onChange
			  } = _b, restProps = __objRest$1(_b, [
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
			    child = getOptions().map((option) => /* @__PURE__ */ React.createElement(Checkbox, {
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
			  return /* @__PURE__ */ React.createElement("div", {
			    ref,
			    style,
			    className: cs({ "checkbox-group-wrapper__disbaled": disabled }, className)
			  }, /* @__PURE__ */ React.createElement(GroupContext.Provider, {
			    value: context
			  }, child));
			}
			const CheckboxGroup = forwardRef(InternalCheckboxGroup);
			var group = exports('CheckboxGroup', memo(CheckboxGroup));

			var css$5 = ".ofa-checkbox-wrapper {\n  background-color: white;\n  cursor: pointer;\n  position: relative;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n\n.ofa-checkbox-icon {\n  position: relative;\n  transition: all 0.24s;\n  border-radius: 4px;\n  border: 1px solid gray;\n  box-sizing: border-box;\n  display: inline-block;\n  width: 16px;\n  height: 16px;\n}\n\n.ofa-checkbox-icon::after {\n  position: absolute;\n  display: table;\n  border: 2px solid #fff;\n  border-top: 0;\n  border-left: 0;\n  transform: rotate(45deg) scale(1) translate(-50%, -50%);\n  opacity: 0;\n  transition: all 0.2s cubic-bezier(0.12, 0.4, 0.29, 1.46) 0.1s;\n  content: ' ';\n  width: 5px;\n  height: 9px;\n  left: 16.5%;\n  top: 50%;\n}\n\n.ofa-checkbox-item {\n  display: flex;\n}\n\n.ofa-checkbox-wrapper__checked .ofa-checkbox-icon {\n  background-color: blue;\n  border-color: blue;\n}\n\n.ofa-checkbox-item input:checked + span::after {\n  opacity: 1;\n}\n\n.ofa-checkbox-wrapper__disabled {\n  cursor: no-drop;\n}\n\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-label {\n  color: #00000040;\n}\n\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-icon,\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-item input:checked + span::after,\n.ofa-checkbox-wrapper__disabled .ofa-checkbox-item input:checked + span {\n  background-color: #f5f5f5;\n  border-color: #d9d9d9 !important;\n}\n";
			n(css$5,{});

			var css$4 = ".ofa-input {\n  outline: none;\n}\n";
			n(css$4,{});

			var __defProp$3 = Object.defineProperty;
			var __defProps$1 = Object.defineProperties;
			var __getOwnPropDescs$1 = Object.getOwnPropertyDescriptors;
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
			var __spreadProps$1 = (a, b) => __defProps$1(a, __getOwnPropDescs$1(b));
			var __objRest = (source, exclude) => {
			  var target = {};
			  for (var prop in source)
			    if (__hasOwnProp$3.call(source, prop) && exclude.indexOf(prop) < 0)
			      target[prop] = source[prop];
			  if (source != null && __getOwnPropSymbols$3)
			    for (var prop of __getOwnPropSymbols$3(source)) {
			      if (exclude.indexOf(prop) < 0 && __propIsEnum$3.call(source, prop))
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
			  } = _b, otherProps = __objRest(_b, [
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
			  return /* @__PURE__ */ React.createElement("input", __spreadProps$1(__spreadValues$3({}, omit(otherProps, "enterKeyHint")), {
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
			var index$6 = exports('Input', forwardRef(Input));

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
			  return /* @__PURE__ */ React.createElement("div", {
			    ref,
			    style: __spreadValues$2(__spreadValues$2({}, _style), style),
			    className: cs("ofa-divider", className)
			  });
			}
			var index$5 = exports('Divider', forwardRef(Divider));

			var css$3 = ".ofa-tag {\n  display: inline-block;\n}\n\n.ofa-tag-disabled {\n  cursor: not-allowed;\n  color: rgba(0, 0, 0, 0.2509803922);\n  background: #f5f5f5;\n}\n\n.ofa-tag-delete-icon {\n  cursor: pointer;\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n}";
			n(css$3,{});

			function Tag(props, ref) {
			  const { value, label = "", onDelete, deleteIconSize = 12, modifier, className, style, disabled } = props;
			  return /* @__PURE__ */ React.createElement("span", {
			    ref,
			    style,
			    className: cs("ofa-tag", className, {
			      "ofa-tag-disabled": disabled,
			      [`ofa-tag--${modifier}`]: modifier
			    })
			  }, label, onDelete && !disabled && /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-tag-delete-icon",
			    onClick: (e) => onDelete(value, e)
			  }, /* @__PURE__ */ React.createElement(Icon, {
			    name: "close",
			    size: deleteIconSize
			  })));
			}
			var index$4 = exports('Tag', forwardRef(Tag));

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
			      return /* @__PURE__ */ React.createElement(React.Fragment, null, segmentRender(segment, isLast), !isLast && /* @__PURE__ */ React.createElement("span", {
			        className: "ofa-breadcrumb-separator"
			      }, separator));
			    }
			    if (!isLast) {
			      return /* @__PURE__ */ React.createElement(React.Fragment, null, segment.render ? segment.render(segment) : breadItem(segment), /* @__PURE__ */ React.createElement("span", {
			        className: "ofa-breadcrumb-separator"
			      }, separator));
			    }
			    return /* @__PURE__ */ React.createElement("span", {
			      className: "ofa-breadcrumb-link"
			    }, segment.text);
			  }
			  const breadItem = (link) => {
			    return !link.path ? link.text : /* @__PURE__ */ React.createElement("a", {
			      href: link.path,
			      className: "ofa-breadcrumb-link"
			    }, link.text);
			  };
			  return /* @__PURE__ */ React.createElement("div", {
			    className: cs("ofa-breadcrumb", className),
			    style,
			    ref
			  }, segments.map((segment, index) => {
			    const isLast = index === segments.length - 1;
			    return /* @__PURE__ */ React.createElement("div", {
			      key: segment.key,
			      style: segmentStyle,
			      className: cs("ofa-breadcrumb-item", segmentClass, {
			        "ofa-breadcrumb-active": isLast
			      })
			    }, /* @__PURE__ */ React.createElement(BreadcrumbChild, {
			      segment,
			      isLast
			    }));
			  }));
			}
			var index$3 = exports('Breadcrumb', forwardRef(Breadcrumb));

			const useSetState = (initialState = {}) => {
			  const [state, set] = useState(initialState);
			  const setState = useCallback((patch) => {
			    set((prevState) => Object.assign({}, prevState, patch instanceof Function ? patch(prevState) : patch));
			  }, []);
			  return [state, setState];
			};

			function useFirstMountState() {
			  const isFirst = useRef(true);
			  if (isFirst.current) {
			    isFirst.current = false;
			    return true;
			  }
			  return isFirst.current;
			}

			const useUpdateEffect = (effect, deps) => {
			  const isFirstMount = useFirstMountState();
			  useEffect(() => {
			    if (!isFirstMount) {
			      return effect();
			    }
			  }, deps);
			};

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
			const inBrowser = typeof window !== "undefined";
			function getTargetElement(target, defaultElement) {
			  if (!target) {
			    return defaultElement;
			  }
			  let targetElement;
			  if (typeof target === "function") {
			    targetElement = target();
			  } else if ("current" in target) {
			    targetElement = target.current;
			  } else {
			    targetElement = target;
			  }
			  return targetElement;
			}
			function getScrollTop(el) {
			  const top = "scrollTop" in el ? el.scrollTop : el.pageYOffset;
			  return Math.max(top, 0);
			}
			function isHidden(elementRef) {
			  const el = elementRef;
			  if (!el) {
			    return false;
			  }
			  const style = window.getComputedStyle(el);
			  const hidden = style.display === "none";
			  const parentHidden = el.offsetParent === null && style.position !== "fixed";
			  return hidden || parentHidden;
			}
			function isWindow(val) {
			  return val === window;
			}
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
			function getZIndexStyle(zIndex, originStyle) {
			  const style = __spreadValues$1({}, originStyle || {});
			  if (zIndex !== void 0) {
			    style.zIndex = +zIndex;
			  }
			  return style;
			}

			const overflowScrollReg = /scroll|auto/i;
			const defaultRoot = inBrowser ? window : void 0;
			function isElement(node) {
			  const ELEMENT_NODE_TYPE = 1;
			  return node.tagName !== "HTML" && node.tagName !== "BODY" && node.nodeType === ELEMENT_NODE_TYPE;
			}
			function getScrollParent(el, root = defaultRoot) {
			  let _root = root;
			  if (_root === void 0) {
			    _root = window;
			  }
			  let node = el;
			  while (node && node !== _root && isElement(node)) {
			    const { overflowY } = window.getComputedStyle(node);
			    if (overflowScrollReg.test(overflowY)) {
			      if (node.tagName !== "BODY") {
			        return node;
			      }
			      const htmlOverflowY = window.getComputedStyle(node.parentNode).overflowY;
			      if (overflowScrollReg.test(htmlOverflowY)) {
			        return node;
			      }
			    }
			    node = node.parentNode;
			  }
			  return _root;
			}
			function useScrollParent(el) {
			  const [scrollParent, setScrollParent] = useState();
			  useEffect(() => {
			    if (el) {
			      const element = getTargetElement(el);
			      setScrollParent(getScrollParent(element));
			    }
			  }, []);
			  return scrollParent;
			}

			const useRect = (elementRef) => {
			  const element = elementRef;
			  if (isWindow(element)) {
			    const width = element.innerWidth;
			    const height = element.innerHeight;
			    return {
			      top: 0,
			      left: 0,
			      right: width,
			      bottom: height,
			      width,
			      height
			    };
			  }
			  if (element && element.getBoundingClientRect) {
			    return element.getBoundingClientRect();
			  }
			  return {
			    top: 0,
			    left: 0,
			    right: 0,
			    bottom: 0,
			    width: 0,
			    height: 0
			  };
			};

			let supportsPassive = false;
			if (inBrowser) {
			  try {
			    const opts = {};
			    Object.defineProperty(opts, "passive", {
			      get() {
			        supportsPassive = true;
			      }
			    });
			    window.addEventListener("test-passive", null, opts);
			  } catch (e) {
			  }
			}
			function useEventListener(type, listener, options = {}) {
			  if (!inBrowser) {
			    return;
			  }
			  const { target = window, passive = false, capture = false, depends = [] } = options;
			  let attached;
			  const add = () => {
			    const element = getTargetElement(target);
			    if (element && !attached) {
			      element.addEventListener(type, listener, supportsPassive ? { capture, passive } : capture);
			      attached = true;
			    }
			  };
			  const remove = () => {
			    const element = getTargetElement(target);
			    if (element && attached) {
			      element.removeEventListener(type, listener, capture);
			      attached = false;
			    }
			  };
			  useEffect(() => {
			    add();
			    return () => remove();
			  }, [target, ...depends]);
			}

			var css$2 = ".ofa-loading {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding-top: 4px;\n  padding-bottom: 4px;\n}\n\n.ofa-loading__desc {\n  display: inline-block;\n  margin-left: 8px;\n  margin-right: 8px;\n  vertical-align: middle;\n}\n\n.ofa-loading--vertical {\n  flex-direction: column;\n}\n.ofa-loading--vertical .ofa-loading__desc {\n  margin-top: 8px;\n}\n\n.ofa-loading__icon {\n  animation: ofa-spin 1s linear infinite;\n}";
			n(css$2,{});

			function Loading({ desc, className, iconSize = 24, vertical }, ref) {
			  return /* @__PURE__ */ React.createElement("div", {
			    className: cs("ofa-loading", className, { "ofa-loading--vertical": vertical }),
			    ref
			  }, /* @__PURE__ */ React.createElement(Icon, {
			    name: "refresh",
			    size: unitToPx(iconSize != null ? iconSize : 0),
			    className: "ofa-loading__icon"
			  }), !!desc && /* @__PURE__ */ React.createElement("span", {
			    className: "ofa-loading__desc"
			  }, desc));
			}
			var Loading$1 = React.forwardRef(Loading);

			function List(props, ref) {
			  const {
			    offset = 300,
			    direction = "down",
			    immediateCheck = true,
			    autoCheck = true,
			    loadingText = "\u52A0\u8F7D\u4E2D...",
			    finishedText,
			    errorText,
			    loading = false,
			    error = false,
			    finished
			  } = props;
			  const [state, updateState] = useSetState({
			    loading,
			    error
			  });
			  const root = useRef();
			  const scrollParent = useRef(null);
			  const placeholder = useRef();
			  scrollParent.current = useScrollParent(root);
			  const check = async () => {
			    if (!props.onLoad)
			      return;
			    if (state.loading || finished || state.error) {
			      return;
			    }
			    const scrollParentRect = useRect(scrollParent.current);
			    if (!scrollParentRect.height || isHidden(root.current)) {
			      return;
			    }
			    let isReachEdge;
			    const placeholderRect = useRect(placeholder.current);
			    if (direction === "up") {
			      isReachEdge = scrollParentRect.top - placeholderRect.top <= offset;
			    } else {
			      isReachEdge = placeholderRect.bottom - scrollParentRect.bottom <= offset;
			    }
			    if (isReachEdge) {
			      try {
			        updateState({ loading: true });
			        if (props.onLoad)
			          await props.onLoad();
			        updateState({ loading: false });
			      } catch (error2) {
			        updateState({ loading: false, error: true });
			      }
			    }
			  };
			  const renderFinishedText = () => {
			    if (finished && finishedText) {
			      return /* @__PURE__ */ React.createElement("div", {
			        className: "ofa-list__finished-text text-placeholder"
			      }, finishedText);
			    }
			    return null;
			  };
			  const clickErrorText = () => {
			    updateState({ error: false });
			    check();
			  };
			  const renderErrorText = () => {
			    if (state.error && errorText) {
			      return /* @__PURE__ */ React.createElement("div", {
			        className: "ofa-list__error-text text-placeholder",
			        onClick: clickErrorText
			      }, errorText);
			    }
			    return null;
			  };
			  const renderLoading = () => {
			    if (state.loading && !finished) {
			      return /* @__PURE__ */ React.createElement("div", {
			        className: "ofa-list__loading text-placeholder"
			      }, typeof loadingText === "function" && isValidElement(loadingText) ? loadingText() : /* @__PURE__ */ React.createElement(Loading$1, {
			        className: "ofa-list__loading-icon text-placeholder",
			        iconSize: ".18rem"
			      }, loadingText));
			    }
			    return null;
			  };
			  useUpdateEffect(() => {
			    if (autoCheck) {
			      check();
			    }
			  }, [state.loading, finished, error]);
			  useUpdateEffect(() => {
			    updateState({ loading, error });
			  }, [loading, error]);
			  useUpdateEffect(() => {
			    if (scrollParent.current && immediateCheck) {
			      check();
			    }
			  }, [scrollParent.current]);
			  useEventListener("scroll", check, {
			    target: scrollParent.current,
			    depends: [state.loading, finished, state.error]
			  });
			  useImperativeHandle(ref, () => ({
			    check,
			    state
			  }));
			  const Placeholder = /* @__PURE__ */ React.createElement("div", {
			    ref: placeholder,
			    className: "ofa-list__placeholder"
			  });
			  return /* @__PURE__ */ React.createElement("div", {
			    ref: root,
			    role: "feed",
			    className: cs("ofa-list", props.className),
			    style: props.style,
			    "aria-busy": state.loading
			  }, direction === "down" ? props.children : Placeholder, renderLoading(), renderFinishedText(), renderErrorText(), direction === "up" ? props.children : Placeholder);
			}
			var index$2 = exports('List', React.forwardRef(List));

			const useHeight = (element) => {
			  const [height, setHeight] = useState(0);
			  useEffect(() => {
			    if (element.current) {
			      setHeight(useRect(element.current).height);
			    }
			  }, [element.current]);
			  return height;
			};

			var css$1 = ":root {\n  --nav-bar-height: 0.44rem;\n}\n\n.ofa-nav-bar {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  background-color: white;\n  user-select: none;\n}\n.ofa-nav-bar--fixed {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n}\n.ofa-nav-bar__content {\n  position: relative;\n  display: flex;\n  align-items: center;\n  height: var(--nav-bar-height);\n}\n.ofa-nav-bar__title {\n  max-width: 60%;\n  margin: 0 auto;\n}\n.ofa-nav-bar__left, .ofa-nav-bar__right {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  display: flex;\n  align-items: center;\n  padding: 0.08rem;\n  margin: 0 0.08rem;\n  cursor: pointer;\n}\n.ofa-nav-bar__left:active, .ofa-nav-bar__right:active {\n  opacity: 0.6;\n}\n.ofa-nav-bar__left {\n  left: 0;\n}\n.ofa-nav-bar__right {\n  right: 0;\n}";
			n(css$1,{});

			function NavBar(props, ref) {
			  const {
			    onClickLeft,
			    onClickRight,
			    left,
			    leftArrow,
			    right,
			    fixed,
			    placeholder,
			    safeAreaInsetTop = true,
			    title,
			    zIndex
			  } = props;
			  const navBarRef = useRef(null);
			  const navBarHeight = useHeight(navBarRef);
			  const renderLeft = () => {
			    if (typeof left !== "string" && isValidElement(left)) {
			      return left;
			    }
			    return [
			      !!leftArrow && /* @__PURE__ */ React.createElement(Icon, {
			        key: "ofa-nav-bar__arrow",
			        className: "ofa-nav-bar__arrow",
			        name: "keyboard_backspace",
			        size: 24
			      }),
			      !!left && /* @__PURE__ */ React.createElement("span", {
			        key: "ofa-nav-bar__text",
			        className: "ofa-nav-bar__text"
			      }, left)
			    ];
			  };
			  const renderRight = () => {
			    if (typeof right !== "string" && isValidElement(right)) {
			      return right;
			    }
			    return /* @__PURE__ */ React.createElement("span", {
			      className: "ofa-nav-bar__text"
			    }, right);
			  };
			  const renderNavBar = () => {
			    const style = getZIndexStyle(zIndex, props.style);
			    const hasLeft = leftArrow || !!left;
			    const hasRight = !!right;
			    return /* @__PURE__ */ React.createElement("div", {
			      ref: navBarRef,
			      style,
			      className: cs("ofa-nav-bar", { "ofa-nav-bar--fixed": fixed, "ofa-safe-area-inset-top": safeAreaInsetTop }, props.className)
			    }, /* @__PURE__ */ React.createElement("div", {
			      className: "ofa-nav-bar__content text-primary"
			    }, hasLeft && /* @__PURE__ */ React.createElement("div", {
			      className: "ofa-nav-bar__left",
			      onClick: onClickLeft
			    }, renderLeft()), /* @__PURE__ */ React.createElement("div", {
			      className: "ofa-nav-bar__title title3 truncate"
			    }, title), hasRight && /* @__PURE__ */ React.createElement("div", {
			      className: "ofa-nav-bar__right",
			      onClick: onClickRight
			    }, renderRight())));
			  };
			  const renderPlaceholder = () => {
			    if (fixed && placeholder) {
			      return /* @__PURE__ */ React.createElement("div", {
			        className: "ofa-nav-bar__placeholder",
			        style: { height: navBarHeight ? `${navBarHeight}px` : void 0 }
			      });
			    }
			    return null;
			  };
			  useImperativeHandle(ref, () => navBarRef == null ? void 0 : navBarRef.current);
			  return /* @__PURE__ */ React.createElement(React.Fragment, null, renderPlaceholder(), renderNavBar());
			}
			var index$1 = exports('NavBar', React.forwardRef(NavBar));

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
			const MIN_DISTANCE = 10;
			function getDirection(x, y) {
			  if (x > y && x > MIN_DISTANCE) {
			    return "horizontal";
			  }
			  if (y > x && y > MIN_DISTANCE) {
			    return "vertical";
			  }
			  return "";
			}
			const INITIAL_STATE = {
			  startX: 0,
			  startY: 0,
			  deltaX: 0,
			  deltaY: 0,
			  offsetX: 0,
			  offsetY: 0,
			  direction: ""
			};
			const useTouch = (canState) => {
			  const refState = useRef(INITIAL_STATE);
			  const state = useSetState(INITIAL_STATE);
			  const innerState = canState ? state[0] : refState.current;
			  const update = (value) => {
			    if (canState) {
			      state[1](value);
			      return;
			    }
			    let _value = value;
			    if (typeof value === "function") {
			      _value = value(refState.current);
			    }
			    Object.entries(_value).forEach(([k, v]) => {
			      refState.current[k] = v;
			    });
			  };
			  const isVertical = useCallback(() => innerState.direction === "vertical", [innerState.direction]);
			  const isHorizontal = useCallback(() => innerState.direction === "horizontal", [innerState.direction]);
			  const reset = () => {
			    update({
			      deltaX: 0,
			      deltaY: 0,
			      offsetX: 0,
			      offsetY: 0,
			      direction: ""
			    });
			  };
			  const start = (event) => {
			    reset();
			    update({
			      startX: event.touches[0].clientX,
			      startY: event.touches[0].clientY
			    });
			  };
			  const move = (event) => {
			    const touch = event.touches[0];
			    update((value) => {
			      const newState = __spreadValues({}, value);
			      newState.deltaX = touch.clientX < 0 ? 0 : touch.clientX - newState.startX;
			      newState.deltaY = touch.clientY - newState.startY;
			      newState.offsetX = Math.abs(newState.deltaX);
			      newState.offsetY = Math.abs(newState.deltaY);
			      if (!newState.direction) {
			        newState.direction = getDirection(newState.offsetX, newState.offsetY);
			      }
			      return newState;
			    });
			  };
			  return __spreadProps(__spreadValues({}, innerState), {
			    move,
			    start,
			    reset,
			    isVertical,
			    isHorizontal
			  });
			};

			var css = ":root {\n  --pull-refresh-head-height: 0.5rem;\n}\n\n.ofa-pull-refresh {\n  overflow: hidden;\n  user-select: none;\n}\n.ofa-pull-refresh__track {\n  position: relative;\n  height: 100%;\n  transition-property: transform;\n}\n.ofa-pull-refresh__head {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  height: var(--pull-refresh-head-height);\n  overflow: hidden;\n  text-align: center;\n  transform: translateY(-100%);\n  display: flex;\n  justify-content: center;\n}";
			n(css,{});

			const DEFAULT_HEAD_HEIGHT = 50;
			const TEXT_STATUS = ["pulling", "loosing", "success"];
			function PullRefresh(props, ref) {
			  const {
			    disabled,
			    headHeight = 50,
			    animationDuration = 300,
			    successDuration = 500,
			    successText,
			    pullDistance,
			    pullingText = "\u4E0B\u62C9\u5373\u53EF\u5237\u65B0...",
			    loosingText = "\u91CA\u653E\u5373\u53EF\u5237\u65B0...",
			    loadingText = "\u52A0\u8F7D\u4E2D..."
			  } = props;
			  const [state, updateState] = useSetState({
			    refreshing: false,
			    status: "normal",
			    distance: 0,
			    duration: 0
			  });
			  const track = useRef();
			  const reachTop = useRef(null);
			  const touch = useTouch();
			  const getHeadStyle = () => {
			    if (headHeight !== DEFAULT_HEAD_HEIGHT) {
			      return {
			        height: `${headHeight}px`
			      };
			    }
			    return void 0;
			  };
			  const isTouchable = useCallback(() => {
			    return state.status !== "loading" && state.status !== "success" && !disabled;
			  }, [state.status, disabled]);
			  const ease = (distance) => {
			    const _pullDistance = +(pullDistance || headHeight);
			    let _distance = distance;
			    if (_distance > _pullDistance) {
			      if (_distance < _pullDistance * 2) {
			        _distance = _pullDistance + (_distance - _pullDistance) / 2;
			      } else {
			        _distance = _pullDistance * 1.5 + (_distance - _pullDistance * 2) / 4;
			      }
			    }
			    return Math.round(_distance);
			  };
			  const setStatus = (distance, isLoading) => {
			    const _pullDistance = +(pullDistance || headHeight);
			    const newState = { distance };
			    if (isLoading) {
			      newState.status = "loading";
			    } else if (distance === 0) {
			      newState.status = "normal";
			    } else if (distance < _pullDistance) {
			      newState.status = "pulling";
			    } else {
			      newState.status = "loosing";
			    }
			    updateState(newState);
			  };
			  const getStatusText = () => {
			    switch (state.status) {
			      case "normal":
			        return "";
			      case "pulling":
			        return pullingText;
			      case "loading":
			        return loadingText;
			      case "loosing":
			        return loosingText;
			    }
			    return props[`${state.status}Text`];
			  };
			  const renderStatus = () => {
			    const { status, distance } = state;
			    const statusText = getStatusText();
			    if (typeof statusText === "function") {
			      return statusText({ distance });
			    }
			    const nodes = [];
			    if (TEXT_STATUS.includes(status)) {
			      nodes.push(/* @__PURE__ */ React.createElement("div", {
			        key: "ofa-text",
			        className: "ofa-pull-refresh__text text-placeholder"
			      }, statusText));
			    }
			    if (status === "loading") {
			      nodes.push(/* @__PURE__ */ React.createElement(Loading$1, {
			        key: "ofa-loading",
			        iconSize: ".16rem",
			        className: "ofa-pull-refresh__loading text-placeholder"
			      }, statusText));
			    }
			    return nodes;
			  };
			  const showSuccessTip = () => {
			    updateState({ status: "success" });
			    setTimeout(() => {
			      setStatus(0);
			    }, +successDuration);
			  };
			  const onRefresh = async () => {
			    try {
			      updateState({ refreshing: true });
			      await props.onRefresh();
			      updateState({ refreshing: false });
			    } catch (error) {
			      updateState({ refreshing: false });
			    }
			  };
			  const checkPosition = (event) => {
			    const scrollTarget = getScrollParent(event.target);
			    reachTop.current = getScrollTop(scrollTarget) === 0;
			    if (reachTop.current) {
			      updateState({ duration: 0 });
			      touch.start(event);
			    }
			  };
			  const onTouchStart = (event) => {
			    if (isTouchable()) {
			      checkPosition(event.nativeEvent);
			    }
			  };
			  const onTouchMove = useCallback((event) => {
			    if (isTouchable()) {
			      if (!reachTop.current) {
			        checkPosition(event);
			      }
			      touch.move(event);
			      if (reachTop.current && touch.deltaY >= 0 && touch.isVertical()) {
			        setStatus(ease(touch.deltaY));
			        event.preventDefault();
			      } else {
			        setStatus(0);
			      }
			    }
			  }, [reachTop.current, touch.deltaY, isTouchable]);
			  const onTouchEnd = async () => {
			    if (reachTop.current && touch.deltaY && isTouchable()) {
			      updateState({ duration: +animationDuration });
			      if (state.status === "loosing") {
			        setStatus(+headHeight, true);
			        onRefresh();
			      } else {
			        setStatus(0);
			      }
			    }
			  };
			  useEventListener("touchmove", onTouchMove, {
			    target: track.current,
			    depends: [reachTop.current, isTouchable(), touch.deltaY]
			  });
			  useUpdateEffect(() => {
			    updateState({ duration: +animationDuration });
			    if (state.refreshing) {
			      setStatus(+headHeight, true);
			    } else if (successText) {
			      showSuccessTip();
			    } else {
			      setStatus(0, false);
			    }
			  }, [state.refreshing]);
			  const trackStyle = useMemo(() => ({
			    transitionDuration: `${state.duration}ms`,
			    transform: state.distance ? `translate3d(0,${state.distance}px, 0)` : ""
			  }), [state.duration, state.distance]);
			  return /* @__PURE__ */ React.createElement("div", {
			    ref,
			    className: cs(props.className, "pull-refresh"),
			    style: props.style
			  }, /* @__PURE__ */ React.createElement("div", {
			    ref: track,
			    className: "ofa-pull-refresh__track",
			    style: trackStyle,
			    onTouchStart,
			    onTouchEnd,
			    onTouchCancel: onTouchEnd
			  }, /* @__PURE__ */ React.createElement("div", {
			    className: "ofa-pull-refresh__head",
			    style: getHeadStyle()
			  }, renderStatus()), props.children));
			}
			var index = exports('PullRefresh', React.forwardRef(PullRefresh));

		})
	};
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9iaWxlLmpzIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vY2xhc3NuYW1lc0AyLjMuMS9ub2RlX21vZHVsZXMvY2xhc3NuYW1lcy9pbmRleC5qcyIsIi4uLy4uLy4uL3NyYy9zaGFyZWQvcmFkaW8vY29udGV4dC50cyIsIi4uLy4uLy4uL3NyYy9zaGFyZWQvcmFkaW8vcmFkaW8udHN4IiwiLi4vLi4vLi4vc3JjL3NoYXJlZC9yYWRpby9ncm91cC50c3giLCIuLi8uLi8uLi8uLi8uLi9jb21tb24vdGVtcC9ub2RlX21vZHVsZXMvLnBucG0vcm9sbHVwLXBsdWdpbi1zdHlsZXNAMy4xNC4xX3JvbGx1cEAyLjY2LjAvbm9kZV9tb2R1bGVzL3JvbGx1cC1wbHVnaW4tc3R5bGVzL2Rpc3QvcnVudGltZS9pbmplY3QtY3NzLmpzIiwiLi4vLi4vLi4vc3JjL3NoYXJlZC9jaGVja2JveC9jb250ZXh0LnRzIiwiLi4vLi4vLi4vc3JjL3NoYXJlZC9jaGVja2JveC9jaGVja2JveC50c3giLCIuLi8uLi8uLi9zcmMvc2hhcmVkL2NoZWNrYm94L2dyb3VwLnRzeCIsIi4uLy4uLy4uL3NyYy9zaGFyZWQvaW5wdXQvaW5kZXgudHN4IiwiLi4vLi4vLi4vc3JjL3NoYXJlZC9kaXZpZGVyL2luZGV4LnRzeCIsIi4uLy4uLy4uL3NyYy9zaGFyZWQvdGFnL2luZGV4LnRzeCIsIi4uLy4uLy4uL3NyYy9zaGFyZWQvYnJlYWRjcnVtYi9pbmRleC50c3giLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLXNldC1zdGF0ZS50cyIsIi4uLy4uLy4uL3NyYy9ob29rcy91c2UtZmlyc3QtbW91bnQtc3RhdGUudHMiLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLXVwZGF0ZS1lZmZlY3QudHMiLCIuLi8uLi8uLi9zcmMvdXRpbHMudHMiLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLXNjcm9sbC1wYXJlbnQudHMiLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLXJlY3QudHMiLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLWV2ZW50LWxpc3RlbmVyLnRzIiwiLi4vLi4vLi4vc3JjL3NoYXJlZC9sb2FkaW5nL2luZGV4LnRzeCIsIi4uLy4uLy4uL3NyYy9tb2JpbGUvbGlzdC9pbmRleC50c3giLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLWhlaWdodC50cyIsIi4uLy4uLy4uL3NyYy9tb2JpbGUvbmF2LWJhci9pbmRleC50c3giLCIuLi8uLi8uLi9zcmMvaG9va3MvdXNlLXRvdWNoLnRzIiwiLi4vLi4vLi4vc3JjL21vYmlsZS9wdWxsLXJlZnJlc2gvaW5kZXgudHN4Il0sInNvdXJjZXNDb250ZW50IjpbIi8qIVxuICBDb3B5cmlnaHQgKGMpIDIwMTggSmVkIFdhdHNvbi5cbiAgTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlIChNSVQpLCBzZWVcbiAgaHR0cDovL2plZHdhdHNvbi5naXRodWIuaW8vY2xhc3NuYW1lc1xuKi9cbi8qIGdsb2JhbCBkZWZpbmUgKi9cblxuKGZ1bmN0aW9uICgpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG5cdHZhciBoYXNPd24gPSB7fS5oYXNPd25Qcm9wZXJ0eTtcblxuXHRmdW5jdGlvbiBjbGFzc05hbWVzKCkge1xuXHRcdHZhciBjbGFzc2VzID0gW107XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGFyZyA9IGFyZ3VtZW50c1tpXTtcblx0XHRcdGlmICghYXJnKSBjb250aW51ZTtcblxuXHRcdFx0dmFyIGFyZ1R5cGUgPSB0eXBlb2YgYXJnO1xuXG5cdFx0XHRpZiAoYXJnVHlwZSA9PT0gJ3N0cmluZycgfHwgYXJnVHlwZSA9PT0gJ251bWJlcicpIHtcblx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGFyZyk7XG5cdFx0XHR9IGVsc2UgaWYgKEFycmF5LmlzQXJyYXkoYXJnKSkge1xuXHRcdFx0XHRpZiAoYXJnLmxlbmd0aCkge1xuXHRcdFx0XHRcdHZhciBpbm5lciA9IGNsYXNzTmFtZXMuYXBwbHkobnVsbCwgYXJnKTtcblx0XHRcdFx0XHRpZiAoaW5uZXIpIHtcblx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChpbm5lcik7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGFyZ1R5cGUgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRcdGlmIChhcmcudG9TdHJpbmcgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpIHtcblx0XHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0XHRpZiAoaGFzT3duLmNhbGwoYXJnLCBrZXkpICYmIGFyZ1trZXldKSB7XG5cdFx0XHRcdFx0XHRcdGNsYXNzZXMucHVzaChrZXkpO1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnLnRvU3RyaW5nKCkpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0Y2xhc3NOYW1lcy5kZWZhdWx0ID0gY2xhc3NOYW1lcztcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGNsYXNzTmFtZXM7XG5cdH0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcgJiYgZGVmaW5lLmFtZCkge1xuXHRcdC8vIHJlZ2lzdGVyIGFzICdjbGFzc25hbWVzJywgY29uc2lzdGVudCB3aXRoIG5wbSBwYWNrYWdlIG5hbWVcblx0XHRkZWZpbmUoJ2NsYXNzbmFtZXMnLCBbXSwgZnVuY3Rpb24gKCkge1xuXHRcdFx0cmV0dXJuIGNsYXNzTmFtZXM7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0d2luZG93LmNsYXNzTmFtZXMgPSBjbGFzc05hbWVzO1xuXHR9XG59KCkpO1xuIiwiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGludGVyZmFjZSBSYWRpb0dyb3VwQ29udGV4dDxUIGV4dGVuZHMgVmFsdWVUeXBlPiB7XG4gIG5hbWU/OiBzdHJpbmc7XG4gIHZhbHVlOiBUO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgb25DaGFuZ2U6ICh2YWw6IFQpID0+IHZvaWQ7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmNyZWF0ZUNvbnRleHQ8UmFkaW9Hcm91cENvbnRleHQ8YW55PiB8IG51bGw+KG51bGwpO1xuIiwiaW1wb3J0IFJlYWN0LCB7XG4gIGZvcndhcmRSZWYsXG4gIHVzZVN0YXRlLFxuICB1c2VDb250ZXh0LFxuICB1c2VFZmZlY3QsXG4gIHVzZVJlZixcbiAgdXNlSW1wZXJhdGl2ZUhhbmRsZSxcbiAgQ2hhbmdlRXZlbnQsXG4gIEZvcndhcmRlZFJlZixcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgY29udGV4dCBmcm9tICcuL2NvbnRleHQnO1xuXG5leHBvcnQgdHlwZSBMYWJlbFdpdGhJbnB1dEluc3RhY2UgPSBIVE1MTGFiZWxFbGVtZW50ICYge1xuICBpbnB1dEluc3RhbmNlOiBIVE1MSW5wdXRFbGVtZW50O1xufTtcblxuZnVuY3Rpb24gSW50ZXJuYWxSYWRpbzxUIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyPihcbiAgeyBjbGFzc05hbWUsIHN0eWxlLCBsYWJlbCwgZXJyb3IsIG9uQ2hhbmdlLCAuLi5yZXN0UHJvcHMgfTogUmFkaW9Qcm9wczxUPixcbiAgcmVmPzogRm9yd2FyZGVkUmVmPExhYmVsV2l0aElucHV0SW5zdGFjZT4sXG4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IGdyb3VwQ29udGV4dCA9IHVzZUNvbnRleHQoY29udGV4dCk7XG4gIGNvbnN0IFtuYW1lLCBzZXROYW1lXSA9IHVzZVN0YXRlPHN0cmluZz4oKTtcbiAgY29uc3QgW2Rpc2FibGVkLCBzZXREaXNhYmxlZF0gPSB1c2VTdGF0ZTxib29sZWFuPighIXJlc3RQcm9wcy5kaXNhYmxlZCk7XG4gIGNvbnN0IFtjaGVja2VkLCBzZXRDaGVja2VkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KCEhcmVzdFByb3BzLmNoZWNrZWQpO1xuICBjb25zdCByb290UmVmID0gdXNlUmVmPEhUTUxMYWJlbEVsZW1lbnQ+KG51bGwpO1xuICBjb25zdCBpbnB1dFJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgKCk6IExhYmVsV2l0aElucHV0SW5zdGFjZSA9PiB7XG4gICAgaWYgKHJvb3RSZWYuY3VycmVudCAmJiBpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICAocm9vdFJlZi5jdXJyZW50IGFzIExhYmVsV2l0aElucHV0SW5zdGFjZSkuaW5wdXRJbnN0YW5jZSA9IGlucHV0UmVmLmN1cnJlbnQ7XG4gICAgfVxuICAgIHJldHVybiByb290UmVmLmN1cnJlbnQgYXMgTGFiZWxXaXRoSW5wdXRJbnN0YWNlO1xuICB9KTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldE5hbWUoZ3JvdXBDb250ZXh0Py5uYW1lKTtcbiAgfSwgW2dyb3VwQ29udGV4dD8ubmFtZV0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgbGV0IGNoZWNrZWQgPSAhIXJlc3RQcm9wcy5jaGVja2VkO1xuICAgIGlmIChncm91cENvbnRleHQ/LnZhbHVlKSB7XG4gICAgICBjaGVja2VkID0gZ3JvdXBDb250ZXh0LnZhbHVlID09PSByZXN0UHJvcHMudmFsdWU7XG4gICAgfVxuICAgIHNldENoZWNrZWQoY2hlY2tlZCk7XG4gIH0sIFtyZXN0UHJvcHMudmFsdWUsIGdyb3VwQ29udGV4dD8udmFsdWVdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldERpc2FibGVkKHJlc3RQcm9wcy5kaXNhYmxlZCB8fCAhIWdyb3VwQ29udGV4dD8uZGlzYWJsZWQpO1xuICB9LCBbcmVzdFByb3BzLmRpc2FibGVkLCBncm91cENvbnRleHQ/LmRpc2FibGVkXSk7XG5cbiAgZnVuY3Rpb24gaGFuZGxlQ2hhbmdlKGNoZWNrZWQ6IGJvb2xlYW4sIGU6IENoYW5nZUV2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KTogdm9pZCB7XG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNldENoZWNrZWQoY2hlY2tlZCk7XG4gICAgZ3JvdXBDb250ZXh0ICYmIGdyb3VwQ29udGV4dC5vbkNoYW5nZShyZXN0UHJvcHMudmFsdWUpO1xuICAgIG9uQ2hhbmdlICYmIG9uQ2hhbmdlKHJlc3RQcm9wcy52YWx1ZSwgZSk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxsYWJlbFxuICAgICAgcmVmPXtyb290UmVmfVxuICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgY2xhc3NOYW1lPXtjcyhcbiAgICAgICAgJ29mYS1yYWRpby13cmFwcGVyJyxcbiAgICAgICAge1xuICAgICAgICAgICdvZmEtcmFkaW8td3JhcHBlcl9fY2hlY2tlZCc6IGNoZWNrZWQsXG4gICAgICAgICAgJ29mYS1yYWRpby13cmFwcGVyX19kaXNhYmxlZCc6IGRpc2FibGVkLFxuICAgICAgICAgICdvZmEtcmFkaW8td3JhcHBlcl9fZXJyb3InOiBlcnJvcixcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgKX1cbiAgICA+XG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJvZmEtcmFkaW8taXRlbVwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICByZWY9e2lucHV0UmVmfVxuICAgICAgICAgIHR5cGU9XCJyYWRpb1wiXG4gICAgICAgICAgc3R5bGU9e3sgZGlzcGxheTogJ25vbmUnIH19XG4gICAgICAgICAgY2hlY2tlZD17Y2hlY2tlZH1cbiAgICAgICAgICBuYW1lPXtuYW1lfVxuICAgICAgICAgIHZhbHVlPXtyZXN0UHJvcHMudmFsdWV9XG4gICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoZTogQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tlZCB9ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICBoYW5kbGVDaGFuZ2UoY2hlY2tlZCwgZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib2ZhLXJhZGlvLWljb25cIj48L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgICB7bGFiZWwgJiYgPHNwYW4gY2xhc3NOYW1lPVwib2ZhLXJhZGlvLWxhYmVsXCI+e2xhYmVsfTwvc3Bhbj59XG4gICAgPC9sYWJlbD5cbiAgKTtcbn1cblxuY29uc3QgUmFkaW8gPSBmb3J3YXJkUmVmKEludGVybmFsUmFkaW8pO1xuXG5leHBvcnQgZGVmYXVsdCBSYWRpbztcbiIsImltcG9ydCBSZWFjdCwgeyBGb3J3YXJkZWRSZWYsIHVzZVN0YXRlLCB1c2VFZmZlY3QsIGZvcndhcmRSZWYsIG1lbW8sIFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgUmFkaW8gZnJvbSAnLi9yYWRpbyc7XG5pbXBvcnQgR3JvdXBDb250ZXh0IGZyb20gJy4vY29udGV4dCc7XG5cbmZ1bmN0aW9uIEludGVybmFsUmFkaW9Hcm91cDxUIGV4dGVuZHMgc3RyaW5nIHwgbnVtYmVyPihcbiAge1xuICAgIGNsYXNzTmFtZSxcbiAgICBzdHlsZSxcbiAgICBvcHRpb25zID0gW10sXG4gICAgY2hpbGRyZW4sXG4gICAgZGlzYWJsZWQsXG4gICAgb25DaGFuZ2UsXG4gICAgbmFtZSxcbiAgICAuLi5yZXN0UHJvcHNcbiAgfTogUHJvcHNXaXRoQ2hpbGRyZW48UmFkaW9Hcm91cFByb3BzPFQ+PixcbiAgcmVmPzogRm9yd2FyZGVkUmVmPEhUTUxEaXZFbGVtZW50Pixcbik6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgW3ZhbHVlLCBzZXRWYWx1ZV0gPSB1c2VTdGF0ZTxUIHwgdW5kZWZpbmVkPihyZXN0UHJvcHMudmFsdWUpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgc2V0VmFsdWUocmVzdFByb3BzLnZhbHVlKTtcbiAgfSwgW3Jlc3RQcm9wcy52YWx1ZV0pO1xuXG4gIGNvbnN0IG9uUmFkaW9DaGFuZ2UgPSAodmFsOiBUKTogdm9pZCA9PiB7XG4gICAgY29uc3QgbGFzdFZhbHVlID0gdmFsdWU7XG4gICAgc2V0VmFsdWUodmFsKTtcbiAgICBpZiAob25DaGFuZ2UgJiYgdmFsICE9PSBsYXN0VmFsdWUpIHtcbiAgICAgIG9uQ2hhbmdlKHZhbCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGdldE9wdGlvbnMgPSAoKTogT3B0aW9uVHlwZTxUPltdID0+XG4gICAgb3B0aW9ucy5tYXAoKG9wdGlvbikgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBvcHRpb24gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbGFiZWw6IG9wdGlvbixcbiAgICAgICAgICB2YWx1ZTogb3B0aW9uLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9wdGlvbjtcbiAgICB9KSBhcyBPcHRpb25UeXBlPFQ+W107XG5cbiAgbGV0IGNoaWxkID0gY2hpbGRyZW47XG5cbiAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgY2hpbGQgPSBnZXRPcHRpb25zKCkubWFwKChvcHRpb24pID0+IChcbiAgICAgIDxSYWRpb1xuICAgICAgICBrZXk9e29wdGlvbi52YWx1ZS50b1N0cmluZygpfVxuICAgICAgICBkaXNhYmxlZD17b3B0aW9uLmRpc2FibGVkIHx8IGRpc2FibGVkfVxuICAgICAgICBsYWJlbD17b3B0aW9uLmxhYmVsfVxuICAgICAgICB2YWx1ZT17b3B0aW9uLnZhbHVlfVxuICAgICAgICBjaGVja2VkPXt2YWx1ZSA9PT0gb3B0aW9uLnZhbHVlfVxuICAgICAgICBvbkNoYW5nZT17b3B0aW9uLm9uQ2hhbmdlIGFzICh2YWw6IFZhbHVlVHlwZSwgZTogUmVhY3QuQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHZvaWR9XG4gICAgICA+PC9SYWRpbz5cbiAgICApKTtcbiAgfVxuXG4gIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgdmFsdWUsXG4gICAgZGlzYWJsZWQ6ICEhZGlzYWJsZWQsXG4gICAgbmFtZTogbmFtZSxcbiAgICBvbkNoYW5nZTogb25SYWRpb0NoYW5nZSxcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjcyh7ICdyYWRpby1ncm91cC13cmFwcGVyX19kaXNiYWxlZCc6IGRpc2FibGVkIH0sIGNsYXNzTmFtZSl9IHN0eWxlPXtzdHlsZX0gcmVmPXtyZWZ9PlxuICAgICAgPEdyb3VwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17Y29udGV4dH0+e2NoaWxkfTwvR3JvdXBDb250ZXh0LlByb3ZpZGVyPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5jb25zdCBSYWRpb0dyb3VwID0gZm9yd2FyZFJlZjxIVE1MRGl2RWxlbWVudCwgUHJvcHNXaXRoQ2hpbGRyZW48UmFkaW9Hcm91cFByb3BzPHN0cmluZyB8IG51bWJlcj4+PihcbiAgSW50ZXJuYWxSYWRpb0dyb3VwLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhSYWRpb0dyb3VwKTtcbiIsInZhciBlPVtdLHQ9W107ZnVuY3Rpb24gbihuLHIpe2lmKG4mJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBkb2N1bWVudCl7dmFyIGEscz0hMD09PXIucHJlcGVuZD9cInByZXBlbmRcIjpcImFwcGVuZFwiLGQ9ITA9PT1yLnNpbmdsZVRhZyxpPVwic3RyaW5nXCI9PXR5cGVvZiByLmNvbnRhaW5lcj9kb2N1bWVudC5xdWVyeVNlbGVjdG9yKHIuY29udGFpbmVyKTpkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07aWYoZCl7dmFyIHU9ZS5pbmRleE9mKGkpOy0xPT09dSYmKHU9ZS5wdXNoKGkpLTEsdFt1XT17fSksYT10W3VdJiZ0W3VdW3NdP3RbdV1bc106dFt1XVtzXT1jKCl9ZWxzZSBhPWMoKTs2NTI3OT09PW4uY2hhckNvZGVBdCgwKSYmKG49bi5zdWJzdHJpbmcoMSkpLGEuc3R5bGVTaGVldD9hLnN0eWxlU2hlZXQuY3NzVGV4dCs9bjphLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKG4pKX1mdW5jdGlvbiBjKCl7dmFyIGU9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO2lmKGUuc2V0QXR0cmlidXRlKFwidHlwZVwiLFwidGV4dC9jc3NcIiksci5hdHRyaWJ1dGVzKWZvcih2YXIgdD1PYmplY3Qua2V5cyhyLmF0dHJpYnV0ZXMpLG49MDtuPHQubGVuZ3RoO24rKyllLnNldEF0dHJpYnV0ZSh0W25dLHIuYXR0cmlidXRlc1t0W25dXSk7dmFyIGE9XCJwcmVwZW5kXCI9PT1zP1wiYWZ0ZXJiZWdpblwiOlwiYmVmb3JlZW5kXCI7cmV0dXJuIGkuaW5zZXJ0QWRqYWNlbnRFbGVtZW50KGEsZSksZX19ZXhwb3J0IGRlZmF1bHQgbjtcbiIsImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2hlY2tib3hHcm91cENvbnRleHQ8VCBleHRlbmRzIFZhbHVlVHlwZT4ge1xuICBuYW1lPzogc3RyaW5nO1xuICB2YWx1ZTogVFtdO1xuICBkaXNhYmxlZDogYm9vbGVhbjtcbiAgdG9nZ2xlT3B0aW9uOiAob3B0aW9uOiBPcHRpb25UeXBlPFQ+KSA9PiB2b2lkO1xuICByZWdpc3RlclZhbHVlOiAodmFsOiBUKSA9PiB2b2lkO1xuICBjYW5jZWxWYWx1ZTogKHZhbDogVCkgPT4gdm9pZDtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuY3JlYXRlQ29udGV4dDxDaGVja2JveEdyb3VwQ29udGV4dDxhbnk+IHwgbnVsbD4obnVsbCk7XG4iLCJpbXBvcnQgUmVhY3QsIHtcbiAgZm9yd2FyZFJlZixcbiAgdXNlU3RhdGUsXG4gIHVzZUVmZmVjdCxcbiAgdXNlQ29udGV4dCxcbiAgdXNlUmVmLFxuICBGb3J3YXJkZWRSZWYsXG4gIENoYW5nZUV2ZW50LFxuICB1c2VJbXBlcmF0aXZlSGFuZGxlLFxufSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgY3MgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCBjb250ZXh0IGZyb20gJy4vY29udGV4dCc7XG5cbmV4cG9ydCB0eXBlIExhYmVsV2l0aElucHV0SW5zdGFuY2UgPSBIVE1MTGFiZWxFbGVtZW50ICYge1xuICBpbnB1dEluc3RhbmNlOiBIVE1MSW5wdXRFbGVtZW50O1xufTtcblxuZnVuY3Rpb24gSW50ZXJuYWxDaGVja2JveDxUIGV4dGVuZHMgVmFsdWVUeXBlPihcbiAgeyBjbGFzc05hbWUsIHN0eWxlLCBsYWJlbCwgaW5kZXRlcm1pbmF0ZSwgZXJyb3IsIG9uQ2hhbmdlLCAuLi5yZXN0UHJvcHMgfTogQ2hlY2tib3hQcm9wczxUPixcbiAgcmVmPzogRm9yd2FyZGVkUmVmPExhYmVsV2l0aElucHV0SW5zdGFuY2U+LFxuKTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBbbmFtZSwgc2V0TmFtZV0gPSB1c2VTdGF0ZTxzdHJpbmc+KCk7XG4gIGNvbnN0IFtjaGVja2VkLCBzZXRDaGVja2VkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KCEhcmVzdFByb3BzLmNoZWNrZWQpO1xuICBjb25zdCBbZGlzYWJsZWQsIHNldERpc2FibGVkXSA9IHVzZVN0YXRlPGJvb2xlYW4+KCEhcmVzdFByb3BzLmRpc2FibGVkKTtcbiAgY29uc3QgZ3JvdXBDb250ZXh0ID0gdXNlQ29udGV4dChjb250ZXh0KTtcbiAgY29uc3QgcHJldlZhbHVlID0gdXNlUmVmKHJlc3RQcm9wcy52YWx1ZSk7XG4gIGNvbnN0IHJvb3RSZWYgPSB1c2VSZWY8SFRNTExhYmVsRWxlbWVudD4obnVsbCk7XG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xuXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUocmVmLCAoKTogTGFiZWxXaXRoSW5wdXRJbnN0YW5jZSA9PiB7XG4gICAgaWYgKHJvb3RSZWYuY3VycmVudCAmJiBpbnB1dFJlZi5jdXJyZW50KSB7XG4gICAgICAocm9vdFJlZi5jdXJyZW50IGFzIExhYmVsV2l0aElucHV0SW5zdGFuY2UpLmlucHV0SW5zdGFuY2UgPSBpbnB1dFJlZi5jdXJyZW50O1xuICAgIH1cbiAgICByZXR1cm4gcm9vdFJlZi5jdXJyZW50IGFzIExhYmVsV2l0aElucHV0SW5zdGFuY2U7XG4gIH0pO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZ3JvdXBDb250ZXh0Py5yZWdpc3RlclZhbHVlKHJlc3RQcm9wcy52YWx1ZSk7XG4gIH0sIFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChyZXN0UHJvcHMudmFsdWUgIT09IHByZXZWYWx1ZS5jdXJyZW50KSB7XG4gICAgICBncm91cENvbnRleHQ/LmNhbmNlbFZhbHVlKHByZXZWYWx1ZS5jdXJyZW50KTtcbiAgICAgIGdyb3VwQ29udGV4dD8ucmVnaXN0ZXJWYWx1ZShyZXN0UHJvcHMudmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gKCkgPT4gZ3JvdXBDb250ZXh0Py5jYW5jZWxWYWx1ZShyZXN0UHJvcHMudmFsdWUpO1xuICB9LCBbcmVzdFByb3BzLnZhbHVlXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXROYW1lKGdyb3VwQ29udGV4dD8ubmFtZSk7XG4gIH0sIFtncm91cENvbnRleHQ/Lm5hbWVdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGxldCBjaGVja2VkID0gISFyZXN0UHJvcHMuY2hlY2tlZDtcbiAgICBpZiAoZ3JvdXBDb250ZXh0Py52YWx1ZSkge1xuICAgICAgY2hlY2tlZCA9IGdyb3VwQ29udGV4dC52YWx1ZS5pbmRleE9mKHJlc3RQcm9wcy52YWx1ZSkgIT09IC0xO1xuICAgIH1cbiAgICBzZXRDaGVja2VkKGNoZWNrZWQpO1xuICB9LCBbcmVzdFByb3BzLnZhbHVlLCBncm91cENvbnRleHQ/LnZhbHVlXSk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBzZXREaXNhYmxlZChyZXN0UHJvcHMuZGlzYWJsZWQgfHwgISFncm91cENvbnRleHQ/LmRpc2FibGVkKTtcbiAgfSwgW3Jlc3RQcm9wcy5kaXNhYmxlZCwgZ3JvdXBDb250ZXh0Py5kaXNhYmxlZF0pO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZUNoYW5nZShjaGVja2VkOiBib29sZWFuLCBlOiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50Pik6IHZvaWQge1xuICAgIGlmIChkaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBzZXRDaGVja2VkKGNoZWNrZWQpO1xuICAgIGdyb3VwQ29udGV4dCAmJiBncm91cENvbnRleHQudG9nZ2xlT3B0aW9uKHsgbGFiZWw6IGxhYmVsLCB2YWx1ZTogcmVzdFByb3BzLnZhbHVlIH0pO1xuICAgIG9uQ2hhbmdlICYmIG9uQ2hhbmdlKHJlc3RQcm9wcy52YWx1ZSwgZSk7XG4gIH1cblxuICByZXR1cm4gKFxuICAgIDxsYWJlbFxuICAgICAgcmVmPXtyb290UmVmfVxuICAgICAgc3R5bGU9e3N0eWxlfVxuICAgICAgY2xhc3NOYW1lPXtjcyhcbiAgICAgICAgJ29mYS1jaGVja2JveC13cmFwcGVyJyxcbiAgICAgICAge1xuICAgICAgICAgICdvZmEtY2hlY2tib3gtd3JhcHBlcl9faW5kZXRlcm1pbmF0ZSc6IGluZGV0ZXJtaW5hdGUsXG4gICAgICAgICAgJ29mYS1jaGVja2JveC13cmFwcGVyX19jaGVja2VkJzogY2hlY2tlZCxcbiAgICAgICAgICAnb2ZhLWNoZWNrYm94LXdyYXBwZXJfX2Rpc2FibGVkJzogZGlzYWJsZWQsXG4gICAgICAgICAgJ29mYS1jaGVja2JveC13cmFwcGVyX19lcnJvcic6IGVycm9yLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUsXG4gICAgICApfVxuICAgID5cbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9mYS1jaGVja2JveC1pdGVtXCI+XG4gICAgICAgIDxpbnB1dFxuICAgICAgICAgIHJlZj17aW5wdXRSZWZ9XG4gICAgICAgICAgdHlwZT1cImNoZWNrYm94XCJcbiAgICAgICAgICBzdHlsZT17eyBkaXNwbGF5OiAnbm9uZScgfX1cbiAgICAgICAgICBjaGVja2VkPXtjaGVja2VkfVxuICAgICAgICAgIG5hbWU9e25hbWV9XG4gICAgICAgICAgZGlzYWJsZWQ9e2Rpc2FibGVkfVxuICAgICAgICAgIG9uQ2hhbmdlPXsoZTogQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgY2hlY2tlZCB9ID0gZS50YXJnZXQ7XG4gICAgICAgICAgICBoYW5kbGVDaGFuZ2UoY2hlY2tlZCwgZSk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwib2ZhLWNoZWNrYm94LWljb25cIj48L3NwYW4+XG4gICAgICA8L3NwYW4+XG4gICAgICB7bGFiZWwgJiYgPHNwYW4gY2xhc3NOYW1lPVwib2ZhLWNoZWNrYm94LWxhYmVsXCI+e2xhYmVsfTwvc3Bhbj59XG4gICAgPC9sYWJlbD5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9yd2FyZFJlZihJbnRlcm5hbENoZWNrYm94KTtcbiIsImltcG9ydCBSZWFjdCwge1xuICB1c2VTdGF0ZSxcbiAgdXNlRWZmZWN0LFxuICBmb3J3YXJkUmVmLFxuICBtZW1vLFxuICBDaGFuZ2VFdmVudCxcbiAgRm9yd2FyZGVkUmVmLFxuICBQcm9wc1dpdGhDaGlsZHJlbixcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgQ2hlY2tib3ggZnJvbSAnLi9jaGVja2JveCc7XG5pbXBvcnQgR3JvdXBDb250ZXh0IGZyb20gJy4vY29udGV4dCc7XG5cbmZ1bmN0aW9uIEludGVybmFsQ2hlY2tib3hHcm91cDxUIGV4dGVuZHMgVmFsdWVUeXBlPihcbiAge1xuICAgIGNsYXNzTmFtZSxcbiAgICBzdHlsZSxcbiAgICBvcHRpb25zID0gW10sXG4gICAgZGlzYWJsZWQsXG4gICAgY2hpbGRyZW4sXG4gICAgb25DaGFuZ2UsXG4gICAgLi4ucmVzdFByb3BzXG4gIH06IFByb3BzV2l0aENoaWxkcmVuPENoZWNrYm94R3JvdXBQcm9wczxUPj4sXG4gIHJlZj86IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudD4sXG4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IFt2YWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGU8VFtdPihyZXN0UHJvcHMudmFsdWUgfHwgW10pO1xuICBjb25zdCBbcmVnaXN0ZXJlZFZhbHVlcywgc2V0UmVnaXN0ZXJlZFZhbHVlc10gPSB1c2VTdGF0ZTxUW10+KFtdKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIHNldFZhbHVlKHJlc3RQcm9wcy52YWx1ZSB8fCBbXSk7XG4gIH0sIFtyZXN0UHJvcHMudmFsdWVdKTtcblxuICBjb25zdCBnZXRPcHRpb25zID0gKCk6IE9wdGlvblR5cGU8VD5bXSA9PlxuICAgIG9wdGlvbnMubWFwKChvcHRpb24pID0+IHtcbiAgICAgIGlmICh0eXBlb2Ygb3B0aW9uID09PSAnc3RyaW5nJykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGxhYmVsOiBvcHRpb24sXG4gICAgICAgICAgdmFsdWU6IG9wdGlvbixcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBvcHRpb247XG4gICAgfSkgYXMgT3B0aW9uVHlwZTxUPltdO1xuXG4gIGNvbnN0IGNhbmNlbFZhbHVlID0gKHZhbDogVCk6IHZvaWQgPT4ge1xuICAgIHNldFJlZ2lzdGVyZWRWYWx1ZXMoKHByZXZWYWx1ZXMpID0+IHByZXZWYWx1ZXMuZmlsdGVyKCh2KSA9PiB2ICE9PSB2YWwpKTtcbiAgfTtcblxuICBjb25zdCByZWdpc3RlclZhbHVlID0gKHZhbDogVCk6IHZvaWQgPT4ge1xuICAgIHNldFJlZ2lzdGVyZWRWYWx1ZXMoKHByZXZWYWx1ZXMpID0+IFsuLi5wcmV2VmFsdWVzLCB2YWxdKTtcbiAgfTtcblxuICBjb25zdCB0b2dnbGVPcHRpb24gPSAob3B0aW9uOiBPcHRpb25UeXBlPFQ+KTogdm9pZCA9PiB7XG4gICAgY29uc3Qgb3B0aW9uSW5kZXggPSB2YWx1ZS5pbmRleE9mKG9wdGlvbi52YWx1ZSk7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBbLi4udmFsdWVdO1xuICAgIGlmIChvcHRpb25JbmRleCA9PT0gLTEpIHtcbiAgICAgIG5ld1ZhbHVlLnB1c2gob3B0aW9uLnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3VmFsdWUuc3BsaWNlKG9wdGlvbkluZGV4LCAxKTtcbiAgICB9XG4gICAgc2V0VmFsdWUobmV3VmFsdWUpO1xuICAgIGNvbnN0IG9wdHMgPSBnZXRPcHRpb25zKCk7XG4gICAgb25DaGFuZ2U/LihcbiAgICAgIG5ld1ZhbHVlXG4gICAgICAgIC5maWx0ZXIoKHZhbCkgPT4gcmVnaXN0ZXJlZFZhbHVlcy5pbmRleE9mKHZhbCkgIT09IC0xKVxuICAgICAgICAuc29ydCgoYSwgYikgPT4ge1xuICAgICAgICAgIGNvbnN0IGluZGV4QSA9IG9wdHMuZmluZEluZGV4KChvcHQpID0+IG9wdC52YWx1ZSA9PT0gYSk7XG4gICAgICAgICAgY29uc3QgaW5kZXhCID0gb3B0cy5maW5kSW5kZXgoKG9wdCkgPT4gb3B0LnZhbHVlID09PSBiKTtcbiAgICAgICAgICByZXR1cm4gaW5kZXhBIC0gaW5kZXhCO1xuICAgICAgICB9KSxcbiAgICApO1xuICB9O1xuXG4gIGxldCBjaGlsZCA9IGNoaWxkcmVuO1xuXG4gIGlmIChvcHRpb25zICYmIG9wdGlvbnMubGVuZ3RoID4gMCkge1xuICAgIGNoaWxkID0gZ2V0T3B0aW9ucygpLm1hcCgob3B0aW9uKSA9PiAoXG4gICAgICA8Q2hlY2tib3hcbiAgICAgICAga2V5PXtvcHRpb24udmFsdWUudG9TdHJpbmcoKX1cbiAgICAgICAgZGlzYWJsZWQ9eydkaXNhYmxlZCcgaW4gb3B0aW9uID8gb3B0aW9uLmRpc2FibGVkIDogZGlzYWJsZWR9XG4gICAgICAgIGxhYmVsPXtvcHRpb24ubGFiZWx9XG4gICAgICAgIHZhbHVlPXtvcHRpb24udmFsdWV9XG4gICAgICAgIGNoZWNrZWQ9e3ZhbHVlLmluZGV4T2Yob3B0aW9uLnZhbHVlKSAhPT0gLTF9XG4gICAgICAgIG9uQ2hhbmdlPXtvcHRpb24ub25DaGFuZ2UgYXMgKHZhbDogVmFsdWVUeXBlLCBlOiBDaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4gdm9pZH1cbiAgICAgID48L0NoZWNrYm94PlxuICAgICkpO1xuICB9XG5cbiAgY29uc3QgY29udGV4dCA9IHtcbiAgICB2YWx1ZSxcbiAgICBkaXNhYmxlZDogISFkaXNhYmxlZCxcbiAgICBuYW1lOiByZXN0UHJvcHMubmFtZSxcbiAgICB0b2dnbGVPcHRpb24sXG4gICAgcmVnaXN0ZXJWYWx1ZSxcbiAgICBjYW5jZWxWYWx1ZSxcbiAgfTtcblxuICByZXR1cm4gKFxuICAgIDxkaXYgcmVmPXtyZWZ9IHN0eWxlPXtzdHlsZX0gY2xhc3NOYW1lPXtjcyh7ICdjaGVja2JveC1ncm91cC13cmFwcGVyX19kaXNiYWxlZCc6IGRpc2FibGVkIH0sIGNsYXNzTmFtZSl9PlxuICAgICAgPEdyb3VwQ29udGV4dC5Qcm92aWRlciB2YWx1ZT17Y29udGV4dH0+e2NoaWxkfTwvR3JvdXBDb250ZXh0LlByb3ZpZGVyPlxuICAgIDwvZGl2PlxuICApO1xufVxuXG5jb25zdCBDaGVja2JveEdyb3VwID0gZm9yd2FyZFJlZjxIVE1MRGl2RWxlbWVudCwgUHJvcHNXaXRoQ2hpbGRyZW48Q2hlY2tib3hHcm91cFByb3BzPFZhbHVlVHlwZT4+PihcbiAgSW50ZXJuYWxDaGVja2JveEdyb3VwLFxuKTtcblxuZXhwb3J0IGRlZmF1bHQgbWVtbyhDaGVja2JveEdyb3VwKTtcbiIsImltcG9ydCBSZWFjdCwge1xuICB1c2VTdGF0ZSxcbiAgdXNlTGF5b3V0RWZmZWN0LFxuICBmb3J3YXJkUmVmLFxuICBDaGFuZ2VFdmVudCxcbiAgS2V5Ym9hcmRFdmVudCxcbiAgRm9jdXNFdmVudCxcbiAgRm9yd2FyZGVkUmVmLFxuICB1c2VSZWYsXG4gIHVzZUVmZmVjdCxcbiAgdXNlSW1wZXJhdGl2ZUhhbmRsZSxcbn0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgb21pdCB9IGZyb20gJ2xvZGFzaCc7XG5pbXBvcnQgY3MgZnJvbSAnY2xhc3NuYW1lcyc7XG5cbmltcG9ydCAnLi9pbmRleC5jc3MnO1xuXG5mdW5jdGlvbiBJbnB1dChcbiAge1xuICAgIGNsYXNzTmFtZSxcbiAgICB2YWx1ZSxcbiAgICBzdHlsZSxcbiAgICBlcnJvcixcbiAgICBkaXNhYmxlZCxcbiAgICByZWFkT25seSxcbiAgICBkZWZhdWx0VmFsdWUsXG4gICAgb25DaGFuZ2UsXG4gICAgb25FbnRlclByZXNzLFxuICAgIG9uRm9jdXMsXG4gICAgb25CbHVyLFxuICAgIG9uS2V5RG93bixcbiAgICAuLi5vdGhlclByb3BzXG4gIH06IElucHV0UHJvcHMsXG4gIHJlZjogRm9yd2FyZGVkUmVmPEhUTUxJbnB1dEVsZW1lbnQ+LFxuKTogSlNYLkVsZW1lbnQge1xuICBjb25zdCBbaW5wdXRWYWx1ZSwgc2V0VmFsdWVdID0gdXNlU3RhdGU8c3RyaW5nPihkZWZhdWx0VmFsdWUgPz8gJycpO1xuICBjb25zdCBbZm9jdXNlZCwgc2V0Rm9jdXNlZF0gPSB1c2VTdGF0ZTxib29sZWFuPihmYWxzZSk7XG4gIGNvbnN0IGlucHV0UmVmID0gdXNlUmVmPEhUTUxJbnB1dEVsZW1lbnQ+KG51bGwpO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgaWYgKHZhbHVlID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgc2V0VmFsdWUodmFsdWUpO1xuICB9LCBbdmFsdWVdKTtcblxuICB1c2VMYXlvdXRFZmZlY3QoKCkgPT4ge1xuICAgIGlmICghb3RoZXJQcm9wcy5lbnRlcktleUhpbnQpIHJldHVybjtcbiAgICBpbnB1dFJlZi5jdXJyZW50Py5zZXRBdHRyaWJ1dGUoJ2VudGVya2V5aGludCcsIG90aGVyUHJvcHMuZW50ZXJLZXlIaW50KTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgaW5wdXRSZWYuY3VycmVudD8ucmVtb3ZlQXR0cmlidXRlKCdlbnRlcmtleWhpbnQnKTtcbiAgICB9O1xuICB9LCBbb3RoZXJQcm9wcy5lbnRlcktleUhpbnRdKTtcblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgKCkgPT4gaW5wdXRSZWYuY3VycmVudCBhcyBIVE1MSW5wdXRFbGVtZW50KTtcblxuICBmdW5jdGlvbiBoYW5kbGVDaGFuZ2UoZTogQ2hhbmdlRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pOiB2b2lkIHtcbiAgICBzZXRWYWx1ZShlLnRhcmdldC52YWx1ZSk7XG4gICAgb25DaGFuZ2U/LihlLnRhcmdldC52YWx1ZSwgZSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVLZXlEb3duKGU6IEtleWJvYXJkRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pOiB2b2lkIHtcbiAgICBpZiAob25FbnRlclByZXNzICYmIChlLmNvZGUgPT09ICdFbnRlcicgfHwgZS5rZXlDb2RlID09PSAxMykpIHtcbiAgICAgIG9uRW50ZXJQcmVzcyhlKTtcbiAgICB9XG4gICAgb25LZXlEb3duPy4oZSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVGb2N1cyhlOiBGb2N1c0V2ZW50PEhUTUxJbnB1dEVsZW1lbnQ+KTogdm9pZCB7XG4gICAgc2V0Rm9jdXNlZCh0cnVlKTtcbiAgICBvbkZvY3VzPy4oZSk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVCbHVyKGU6IEZvY3VzRXZlbnQ8SFRNTElucHV0RWxlbWVudD4pOiB2b2lkIHtcbiAgICBzZXRGb2N1c2VkKGZhbHNlKTtcbiAgICBvbkJsdXI/LihlKTtcbiAgfVxuXG4gIHJldHVybiAoXG4gICAgPGlucHV0XG4gICAgICB7Li4ub21pdChvdGhlclByb3BzLCAnZW50ZXJLZXlIaW50Jyl9XG4gICAgICByZWY9e2lucHV0UmVmfVxuICAgICAgdmFsdWU9e2lucHV0VmFsdWV9XG4gICAgICBkaXNhYmxlZD17ZGlzYWJsZWR9XG4gICAgICByZWFkT25seT17cmVhZE9ubHl9XG4gICAgICBzdHlsZT17c3R5bGV9XG4gICAgICBjbGFzc05hbWU9e2NzKFxuICAgICAgICAnb2ZhLWlucHV0JyxcbiAgICAgICAge1xuICAgICAgICAgICdvZmEtaW5wdXRfX2Rpc2FibGVkJzogZGlzYWJsZWQsXG4gICAgICAgICAgJ29mYS1pbnB1dF9fcmVhZE9ubHknOiByZWFkT25seSxcbiAgICAgICAgICAnb2ZhLWlucHV0X19mb2N1cyc6IGZvY3VzZWQsXG4gICAgICAgICAgJ29mYS1pbnB1dF9fZXJyb3InOiBlcnJvcixcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lLFxuICAgICAgKX1cbiAgICAgIG9uQ2hhbmdlPXtoYW5kbGVDaGFuZ2V9XG4gICAgICBvbktleURvd249e2hhbmRsZUtleURvd259XG4gICAgICBvbkZvY3VzPXtoYW5kbGVGb2N1c31cbiAgICAgIG9uQmx1cj17aGFuZGxlQmx1cn1cbiAgICAvPlxuICApO1xufVxuZXhwb3J0IGRlZmF1bHQgZm9yd2FyZFJlZjxIVE1MSW5wdXRFbGVtZW50LCBJbnB1dFByb3BzPihJbnB1dCk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgRm9yd2FyZGVkUmVmLCBmb3J3YXJkUmVmLCBDU1NQcm9wZXJ0aWVzIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5mdW5jdGlvbiBEaXZpZGVyKHByb3BzOiBEaXZpZGVyUHJvcHMsIHJlZjogRm9yd2FyZGVkUmVmPEhUTUxEaXZFbGVtZW50Pik6IEpTWC5FbGVtZW50IHtcbiAgY29uc3QgeyBjbGFzc05hbWUsIHNpemUgPSAnMTAwJScsIGRpcmVjdGlvbiA9ICdob3Jpem9udGFsJywgdGhpY2tuZXNzID0gJzFweCcsIHN0eWxlID0ge30gfSA9IHByb3BzO1xuICBjb25zdCBfc3R5bGU6IENTU1Byb3BlcnRpZXMgPSB7fTtcblxuICBpZiAoZGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICBfc3R5bGUuaGVpZ2h0ID0gdGhpY2tuZXNzO1xuICAgIF9zdHlsZS53aWR0aCA9IHNpemU7XG4gIH0gZWxzZSB7XG4gICAgX3N0eWxlLndpZHRoID0gdGhpY2tuZXNzO1xuICAgIF9zdHlsZS5oZWlnaHQgPSBzaXplO1xuICB9XG5cbiAgcmV0dXJuIDxkaXYgcmVmPXtyZWZ9IHN0eWxlPXt7IC4uLl9zdHlsZSwgLi4uc3R5bGUgfX0gY2xhc3NOYW1lPXtjcygnb2ZhLWRpdmlkZXInLCBjbGFzc05hbWUpfSAvPjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9yd2FyZFJlZihEaXZpZGVyKTtcbiIsImltcG9ydCBSZWFjdCwgeyBSZWYsIGZvcndhcmRSZWYsIEZvcndhcmRlZFJlZiB9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IEljb24gZnJvbSAnQG9uZS1mb3ItYWxsL2ljb24nO1xuXG5pbXBvcnQgJy4vaW5kZXguc2Nzcyc7XG5cbmZ1bmN0aW9uIFRhZzxUIGV4dGVuZHMgUmVhY3QuS2V5Pihwcm9wczogVGFnUHJvcHM8VD4sIHJlZj86IEZvcndhcmRlZFJlZjxIVE1MU3BhbkVsZW1lbnQ+KTogSlNYLkVsZW1lbnQge1xuICBjb25zdCB7IHZhbHVlLCBsYWJlbCA9ICcnLCBvbkRlbGV0ZSwgZGVsZXRlSWNvblNpemUgPSAxMiwgbW9kaWZpZXIsIGNsYXNzTmFtZSwgc3R5bGUsIGRpc2FibGVkIH0gPSBwcm9wcztcblxuICByZXR1cm4gKFxuICAgIDxzcGFuXG4gICAgICByZWY9e3JlZn1cbiAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgIGNsYXNzTmFtZT17Y3MoJ29mYS10YWcnLCBjbGFzc05hbWUsIHtcbiAgICAgICAgJ29mYS10YWctZGlzYWJsZWQnOiBkaXNhYmxlZCxcbiAgICAgICAgW2BvZmEtdGFnLS0ke21vZGlmaWVyfWBdOiBtb2RpZmllcixcbiAgICAgIH0pfVxuICAgID5cbiAgICAgIHtsYWJlbH1cbiAgICAgIHtvbkRlbGV0ZSAmJiAhZGlzYWJsZWQgJiYgKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJvZmEtdGFnLWRlbGV0ZS1pY29uXCIgb25DbGljaz17KGUpOiB2b2lkID0+IG9uRGVsZXRlKHZhbHVlLCBlKX0+XG4gICAgICAgICAgPEljb24gbmFtZT1cImNsb3NlXCIgc2l6ZT17ZGVsZXRlSWNvblNpemV9IC8+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICl9XG4gICAgPC9zcGFuPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBmb3J3YXJkUmVmKFRhZyk7XG4iLCJpbXBvcnQgUmVhY3QsIHsgRm9yd2FyZGVkUmVmLCBmb3J3YXJkUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG50eXBlIEJyZWFkY3J1bWJDaGlsZFByb3BzID0ge1xuICBzZWdtZW50OiBTZWdtZW50O1xuICBpc0xhc3Q6IGJvb2xlYW47XG59O1xuXG5mdW5jdGlvbiBCcmVhZGNydW1iKHByb3BzOiBCcmVhZGNydW1iUHJvcHMsIHJlZj86IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudD4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHtcbiAgICBzZWdtZW50cyxcbiAgICBzZXBhcmF0b3IgPSAnLycsXG4gICAgYWN0aXZlQ2xhc3MsXG4gICAgc2VnbWVudFJlbmRlcixcbiAgICBzdHlsZSxcbiAgICBjbGFzc05hbWUsXG4gICAgc2VnbWVudENsYXNzLFxuICAgIHNlZ21lbnRTdHlsZSxcbiAgfSA9IHByb3BzO1xuXG4gIGZ1bmN0aW9uIEJyZWFkY3J1bWJDaGlsZCh7IHNlZ21lbnQsIGlzTGFzdCB9OiBCcmVhZGNydW1iQ2hpbGRQcm9wcyk6IEpTWC5FbGVtZW50IHtcbiAgICBpZiAoc2VnbWVudFJlbmRlcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPD5cbiAgICAgICAgICB7c2VnbWVudFJlbmRlcihzZWdtZW50LCBpc0xhc3QpfVxuICAgICAgICAgIHshaXNMYXN0ICYmIDxzcGFuIGNsYXNzTmFtZT1cIm9mYS1icmVhZGNydW1iLXNlcGFyYXRvclwiPntzZXBhcmF0b3J9PC9zcGFuPn1cbiAgICAgICAgPC8+XG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghaXNMYXN0KSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8PlxuICAgICAgICAgIHtzZWdtZW50LnJlbmRlciA/IHNlZ21lbnQucmVuZGVyKHNlZ21lbnQpIDogYnJlYWRJdGVtKHNlZ21lbnQpfVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9mYS1icmVhZGNydW1iLXNlcGFyYXRvclwiPntzZXBhcmF0b3J9PC9zcGFuPlxuICAgICAgICA8Lz5cbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIDxzcGFuIGNsYXNzTmFtZT1cIm9mYS1icmVhZGNydW1iLWxpbmtcIj57c2VnbWVudC50ZXh0fTwvc3Bhbj47XG4gIH1cblxuICBjb25zdCBicmVhZEl0ZW0gPSAobGluazogU2VnbWVudCk6IEpTWC5FbGVtZW50IHwgc3RyaW5nID0+IHtcbiAgICByZXR1cm4gIWxpbmsucGF0aCA/IChcbiAgICAgIGxpbmsudGV4dFxuICAgICkgOiAoXG4gICAgICA8YSBocmVmPXtsaW5rLnBhdGh9IGNsYXNzTmFtZT1cIm9mYS1icmVhZGNydW1iLWxpbmtcIj5cbiAgICAgICAge2xpbmsudGV4dH1cbiAgICAgIDwvYT5cbiAgICApO1xuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9e2NzKCdvZmEtYnJlYWRjcnVtYicsIGNsYXNzTmFtZSl9IHN0eWxlPXtzdHlsZX0gcmVmPXtyZWZ9PlxuICAgICAge3NlZ21lbnRzLm1hcCgoc2VnbWVudCwgaW5kZXgpID0+IHtcbiAgICAgICAgY29uc3QgaXNMYXN0ID0gaW5kZXggPT09IHNlZ21lbnRzLmxlbmd0aCAtIDE7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBrZXk9e3NlZ21lbnQua2V5fVxuICAgICAgICAgICAgc3R5bGU9e3NlZ21lbnRTdHlsZX1cbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3MoJ29mYS1icmVhZGNydW1iLWl0ZW0nLCBzZWdtZW50Q2xhc3MsIHtcbiAgICAgICAgICAgICAgJ29mYS1icmVhZGNydW1iLWFjdGl2ZSc6IGlzTGFzdCxcbiAgICAgICAgICAgIH0pfVxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxCcmVhZGNydW1iQ2hpbGQgc2VnbWVudD17c2VnbWVudH0gaXNMYXN0PXtpc0xhc3R9IC8+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgICB9KX1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZm9yd2FyZFJlZihCcmVhZGNydW1iKTtcbiIsImltcG9ydCB7IHVzZUNhbGxiYWNrLCB1c2VTdGF0ZSB9IGZyb20gJ3JlYWN0JztcblxuY29uc3QgdXNlU2V0U3RhdGUgPSA8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIHVua25vd24+PihcbiAgaW5pdGlhbFN0YXRlOiBUID0ge30gYXMgVCxcbik6IFtULCAocGF0Y2g6IFBhcnRpYWw8VD4gfCAoKHByZXZTdGF0ZTogVCkgPT4gUGFydGlhbDxUPikpID0+IHZvaWRdID0+IHtcbiAgY29uc3QgW3N0YXRlLCBzZXRdID0gdXNlU3RhdGU8VD4oaW5pdGlhbFN0YXRlKTtcbiAgY29uc3Qgc2V0U3RhdGUgPSB1c2VDYWxsYmFjaygocGF0Y2gpID0+IHtcbiAgICBzZXQoKHByZXZTdGF0ZSkgPT4gT2JqZWN0LmFzc2lnbih7fSwgcHJldlN0YXRlLCBwYXRjaCBpbnN0YW5jZW9mIEZ1bmN0aW9uID8gcGF0Y2gocHJldlN0YXRlKSA6IHBhdGNoKSk7XG4gIH0sIFtdKTtcblxuICByZXR1cm4gW3N0YXRlLCBzZXRTdGF0ZV07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1c2VTZXRTdGF0ZTtcbiIsImltcG9ydCB7IHVzZVJlZiB9IGZyb20gJ3JlYWN0JztcblxuZXhwb3J0IGZ1bmN0aW9uIHVzZUZpcnN0TW91bnRTdGF0ZSgpOiBib29sZWFuIHtcbiAgY29uc3QgaXNGaXJzdCA9IHVzZVJlZih0cnVlKTtcblxuICBpZiAoaXNGaXJzdC5jdXJyZW50KSB7XG4gICAgaXNGaXJzdC5jdXJyZW50ID0gZmFsc2U7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBpc0ZpcnN0LmN1cnJlbnQ7XG59XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QgfSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgeyB1c2VGaXJzdE1vdW50U3RhdGUgfSBmcm9tICcuL3VzZS1maXJzdC1tb3VudC1zdGF0ZSc7XG5cbmNvbnN0IHVzZVVwZGF0ZUVmZmVjdDogdHlwZW9mIHVzZUVmZmVjdCA9IChlZmZlY3QsIGRlcHMpID0+IHtcbiAgY29uc3QgaXNGaXJzdE1vdW50ID0gdXNlRmlyc3RNb3VudFN0YXRlKCk7XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBpZiAoIWlzRmlyc3RNb3VudCkge1xuICAgICAgcmV0dXJuIGVmZmVjdCgpO1xuICAgIH1cbiAgfSwgZGVwcyk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1c2VVcGRhdGVFZmZlY3Q7XG4iLCJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgbmFub2lkIH0gZnJvbSAnbmFub2lkJztcblxuaW1wb3J0IHsgQmFzaWNUYXJnZXQsIFNjcm9sbEVsZW1lbnQsIFRhcmdldEVsZW1lbnQgfSBmcm9tICcuL3R5cGUnO1xuXG5leHBvcnQgZnVuY3Rpb24gdXVpZCgpOiBzdHJpbmcge1xuICByZXR1cm4gbmFub2lkKCk7XG59XG5cbmV4cG9ydCBjb25zdCBpbkJyb3dzZXIgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRhcmdldEVsZW1lbnQoXG4gIHRhcmdldD86IEJhc2ljVGFyZ2V0PFRhcmdldEVsZW1lbnQ+LFxuICBkZWZhdWx0RWxlbWVudD86IFRhcmdldEVsZW1lbnQsXG4pOiBUYXJnZXRFbGVtZW50IHwgdW5kZWZpbmVkIHwgbnVsbCB7XG4gIGlmICghdGFyZ2V0KSB7XG4gICAgcmV0dXJuIGRlZmF1bHRFbGVtZW50O1xuICB9XG5cbiAgbGV0IHRhcmdldEVsZW1lbnQ6IFRhcmdldEVsZW1lbnQgfCB1bmRlZmluZWQgfCBudWxsO1xuXG4gIGlmICh0eXBlb2YgdGFyZ2V0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdGFyZ2V0RWxlbWVudCA9IHRhcmdldCgpO1xuICB9IGVsc2UgaWYgKCdjdXJyZW50JyBpbiB0YXJnZXQpIHtcbiAgICB0YXJnZXRFbGVtZW50ID0gdGFyZ2V0LmN1cnJlbnQ7XG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0RWxlbWVudCA9IHRhcmdldDtcbiAgfVxuXG4gIHJldHVybiB0YXJnZXRFbGVtZW50O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Nyb2xsVG9wKGVsOiBTY3JvbGxFbGVtZW50KTogbnVtYmVyIHtcbiAgY29uc3QgdG9wID0gJ3Njcm9sbFRvcCcgaW4gZWwgPyBlbC5zY3JvbGxUb3AgOiBlbC5wYWdlWU9mZnNldDtcblxuICAvLyBpT1Mgc2Nyb2xsIGJvdW5jZSBjYXVzZSBtaW51cyBzY3JvbGxUb3BcbiAgcmV0dXJuIE1hdGgubWF4KHRvcCwgMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0RlZjxUPih2YWw/OiBUKTogdmFsIGlzIE5vbk51bGxhYmxlPFQ+IHtcbiAgcmV0dXJuIHZhbCAhPT0gdW5kZWZpbmVkICYmIHZhbCAhPT0gbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzTnVtZXJpYyh2YWw/OiBzdHJpbmcpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzRGVmKHZhbCkgPyAvXlxcZCsoXFwuXFxkKyk/JC8udGVzdCh2YWwpIDogZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRVbml0KHZhbHVlPzogTnVtYmVyU3RyaW5nKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgaWYgKCFpc0RlZih2YWx1ZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgX3ZhbHVlID0gU3RyaW5nKHZhbHVlKTtcbiAgcmV0dXJuIGlzTnVtZXJpYyhfdmFsdWUpID8gYCR7X3ZhbHVlfXB4YCA6IF92YWx1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNpemVTdHlsZShcbiAgb3JpZ2luU2l6ZT86IHN0cmluZyB8IG51bWJlcixcbiAgb3JpZ2luU3R5bGU/OiBSZWFjdC5DU1NQcm9wZXJ0aWVzLFxuKTogUmVhY3QuQ1NTUHJvcGVydGllcyB7XG4gIGlmIChpc0RlZihvcmlnaW5TaXplKSkge1xuICAgIGNvbnN0IHNpemUgPSBhZGRVbml0KG9yaWdpblNpemUpO1xuICAgIHJldHVybiB7XG4gICAgICAuLi4ob3JpZ2luU3R5bGUgfHwge30pLFxuICAgICAgd2lkdGg6IHNpemUsXG4gICAgICBoZWlnaHQ6IHNpemUsXG4gICAgfTtcbiAgfVxuICByZXR1cm4gb3JpZ2luU3R5bGUgfHwge307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0hpZGRlbihlbGVtZW50UmVmPzogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgY29uc3QgZWwgPSBlbGVtZW50UmVmO1xuICBpZiAoIWVsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3Qgc3R5bGUgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbCk7XG4gIGNvbnN0IGhpZGRlbiA9IHN0eWxlLmRpc3BsYXkgPT09ICdub25lJztcblxuICAvLyBvZmZzZXRQYXJlbnQgcmV0dXJucyBudWxsIGluIHRoZSBmb2xsb3dpbmcgc2l0dWF0aW9uczpcbiAgLy8gMS4gVGhlIGVsZW1lbnQgb3IgaXRzIHBhcmVudCBlbGVtZW50IGhhcyB0aGUgZGlzcGxheSBwcm9wZXJ0eSBzZXQgdG8gbm9uZS5cbiAgLy8gMi4gVGhlIGVsZW1lbnQgaGFzIHRoZSBwb3NpdGlvbiBwcm9wZXJ0eSBzZXQgdG8gZml4ZWRcbiAgY29uc3QgcGFyZW50SGlkZGVuID0gZWwub2Zmc2V0UGFyZW50ID09PSBudWxsICYmIHN0eWxlLnBvc2l0aW9uICE9PSAnZml4ZWQnO1xuICByZXR1cm4gaGlkZGVuIHx8IHBhcmVudEhpZGRlbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzV2luZG93KHZhbDogdW5rbm93bik6IHZhbCBpcyBXaW5kb3cge1xuICByZXR1cm4gdmFsID09PSB3aW5kb3c7XG59XG5cbi8vIGNhY2hlXG5sZXQgcm9vdEZvbnRTaXplOiBudW1iZXI7XG5cbmZ1bmN0aW9uIGdldFJvb3RGb250U2l6ZSgpOiBudW1iZXIge1xuICBpZiAoIXJvb3RGb250U2l6ZSkge1xuICAgIGNvbnN0IGRvYyA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICBjb25zdCBmb250U2l6ZSA9IGRvYy5zdHlsZS5mb250U2l6ZSB8fCB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShkb2MpLmZvbnRTaXplO1xuXG4gICAgcm9vdEZvbnRTaXplID0gcGFyc2VGbG9hdChmb250U2l6ZSk7XG4gIH1cblxuICByZXR1cm4gcm9vdEZvbnRTaXplO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0UmVtKHZhbHVlOiBzdHJpbmcpOiBudW1iZXIge1xuICBjb25zdCBfdmFsdWUgPSB2YWx1ZS5yZXBsYWNlKC9yZW0vZywgJycpO1xuICByZXR1cm4gK192YWx1ZSAqIGdldFJvb3RGb250U2l6ZSgpO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VncodmFsdWU6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IF92YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL3Z3L2csICcnKTtcbiAgcmV0dXJuICgrX3ZhbHVlICogd2luZG93LmlubmVyV2lkdGgpIC8gMTAwO1xufVxuXG5mdW5jdGlvbiBjb252ZXJ0VmgodmFsdWU6IHN0cmluZyk6IG51bWJlciB7XG4gIGNvbnN0IF92YWx1ZSA9IHZhbHVlLnJlcGxhY2UoL3ZoL2csICcnKTtcbiAgcmV0dXJuICgrX3ZhbHVlICogd2luZG93LmlubmVySGVpZ2h0KSAvIDEwMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVuaXRUb1B4KHZhbHVlOiBOdW1iZXJTdHJpbmcpOiBudW1iZXIge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGlmIChpbkJyb3dzZXIpIHtcbiAgICBpZiAodmFsdWUuaW5kZXhPZigncmVtJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gY29udmVydFJlbSh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5pbmRleE9mKCd2dycpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRWdyh2YWx1ZSk7XG4gICAgfVxuICAgIGlmICh2YWx1ZS5pbmRleE9mKCd2aCcpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIGNvbnZlcnRWaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHBhcnNlRmxvYXQodmFsdWUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0WkluZGV4U3R5bGUoXG4gIHpJbmRleD86IE51bWJlclN0cmluZyxcbiAgb3JpZ2luU3R5bGU/OiBSZWFjdC5DU1NQcm9wZXJ0aWVzLFxuKTogUmVhY3QuQ1NTUHJvcGVydGllcyB7XG4gIGNvbnN0IHN0eWxlOiBSZWFjdC5DU1NQcm9wZXJ0aWVzID0geyAuLi4ob3JpZ2luU3R5bGUgfHwge30pIH07XG4gIGlmICh6SW5kZXggIT09IHVuZGVmaW5lZCkge1xuICAgIHN0eWxlLnpJbmRleCA9ICt6SW5kZXg7XG4gIH1cbiAgcmV0dXJuIHN0eWxlO1xufVxuIiwiaW1wb3J0IHsgdXNlU3RhdGUsIHVzZUVmZmVjdCB9IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgZ2V0VGFyZ2V0RWxlbWVudCwgaW5Ccm93c2VyIH0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IHsgQmFzaWNUYXJnZXQgfSBmcm9tICcuLi90eXBlJztcblxudHlwZSBTY3JvbGxFbGVtZW50ID0gRWxlbWVudCB8IEhUTUxFbGVtZW50IHwgV2luZG93O1xuXG5jb25zdCBvdmVyZmxvd1Njcm9sbFJlZyA9IC9zY3JvbGx8YXV0by9pO1xuY29uc3QgZGVmYXVsdFJvb3QgPSBpbkJyb3dzZXIgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGlzRWxlbWVudChub2RlOiBFbGVtZW50KTogYm9vbGVhbiB7XG4gIGNvbnN0IEVMRU1FTlRfTk9ERV9UWVBFID0gMTtcbiAgcmV0dXJuIG5vZGUudGFnTmFtZSAhPT0gJ0hUTUwnICYmIG5vZGUudGFnTmFtZSAhPT0gJ0JPRFknICYmIG5vZGUubm9kZVR5cGUgPT09IEVMRU1FTlRfTk9ERV9UWVBFO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0U2Nyb2xsUGFyZW50KGVsOiBFbGVtZW50LCByb290OiBTY3JvbGxFbGVtZW50IHwgdW5kZWZpbmVkID0gZGVmYXVsdFJvb3QpOiBTY3JvbGxFbGVtZW50IHtcbiAgbGV0IF9yb290ID0gcm9vdDtcbiAgaWYgKF9yb290ID09PSB1bmRlZmluZWQpIHtcbiAgICBfcm9vdCA9IHdpbmRvdztcbiAgfVxuICBsZXQgbm9kZSA9IGVsO1xuICB3aGlsZSAobm9kZSAmJiBub2RlICE9PSBfcm9vdCAmJiBpc0VsZW1lbnQobm9kZSkpIHtcbiAgICBjb25zdCB7IG92ZXJmbG93WSB9ID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZSk7XG4gICAgaWYgKG92ZXJmbG93U2Nyb2xsUmVnLnRlc3Qob3ZlcmZsb3dZKSkge1xuICAgICAgaWYgKG5vZGUudGFnTmFtZSAhPT0gJ0JPRFknKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBodG1sT3ZlcmZsb3dZID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUobm9kZS5wYXJlbnROb2RlIGFzIEVsZW1lbnQpLm92ZXJmbG93WTtcbiAgICAgIGlmIChvdmVyZmxvd1Njcm9sbFJlZy50ZXN0KGh0bWxPdmVyZmxvd1kpKSB7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgICAgfVxuICAgIH1cbiAgICBub2RlID0gbm9kZS5wYXJlbnROb2RlIGFzIEVsZW1lbnQ7XG4gIH1cbiAgcmV0dXJuIF9yb290O1xufVxuXG5mdW5jdGlvbiB1c2VTY3JvbGxQYXJlbnQoZWw6IEJhc2ljVGFyZ2V0PEhUTUxFbGVtZW50IHwgRWxlbWVudCB8IFdpbmRvdyB8IERvY3VtZW50Pik6IEVsZW1lbnQgfCBXaW5kb3cge1xuICBjb25zdCBbc2Nyb2xsUGFyZW50LCBzZXRTY3JvbGxQYXJlbnRdID0gdXNlU3RhdGU8RWxlbWVudCB8IFdpbmRvdz4oKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChlbCkge1xuICAgICAgY29uc3QgZWxlbWVudCA9IGdldFRhcmdldEVsZW1lbnQoZWwpIGFzIEVsZW1lbnQ7XG4gICAgICBzZXRTY3JvbGxQYXJlbnQoZ2V0U2Nyb2xsUGFyZW50KGVsZW1lbnQpKTtcbiAgICB9XG4gIH0sIFtdKTtcblxuICByZXR1cm4gc2Nyb2xsUGFyZW50IGFzIEVsZW1lbnQgfCBXaW5kb3c7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHVzZVNjcm9sbFBhcmVudDtcbiIsImltcG9ydCB7IGlzV2luZG93IH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5pbnRlcmZhY2UgUmVjdCB7XG4gIHRvcDogbnVtYmVyO1xuICBsZWZ0OiBudW1iZXI7XG4gIHJpZ2h0OiBudW1iZXI7XG4gIGJvdHRvbTogbnVtYmVyO1xuICB3aWR0aDogbnVtYmVyO1xuICBoZWlnaHQ6IG51bWJlcjtcbn1cblxuY29uc3QgdXNlUmVjdCA9IChlbGVtZW50UmVmPzogRWxlbWVudCB8IFdpbmRvdyB8IG51bGwpOiBSZWN0ID0+IHtcbiAgY29uc3QgZWxlbWVudCA9IGVsZW1lbnRSZWY7XG5cbiAgaWYgKGlzV2luZG93KGVsZW1lbnQpKSB7XG4gICAgY29uc3Qgd2lkdGggPSBlbGVtZW50LmlubmVyV2lkdGg7XG4gICAgY29uc3QgaGVpZ2h0ID0gZWxlbWVudC5pbm5lckhlaWdodDtcblxuICAgIHJldHVybiB7XG4gICAgICB0b3A6IDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgcmlnaHQ6IHdpZHRoLFxuICAgICAgYm90dG9tOiBoZWlnaHQsXG4gICAgICB3aWR0aCxcbiAgICAgIGhlaWdodCxcbiAgICB9O1xuICB9XG5cbiAgaWYgKGVsZW1lbnQgJiYgZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QpIHtcbiAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgdG9wOiAwLFxuICAgIGxlZnQ6IDAsXG4gICAgcmlnaHQ6IDAsXG4gICAgYm90dG9tOiAwLFxuICAgIHdpZHRoOiAwLFxuICAgIGhlaWdodDogMCxcbiAgfTtcbn07XG5cbmV4cG9ydCB7IHVzZVJlY3QgYXMgZ2V0UmVjdCB9O1xuXG5leHBvcnQgZGVmYXVsdCB1c2VSZWN0O1xuIiwiaW1wb3J0IHsgdXNlRWZmZWN0IH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBpbkJyb3dzZXIsIGdldFRhcmdldEVsZW1lbnQgfSBmcm9tICcuLi91dGlscyc7XG5pbXBvcnQgeyBCYXNpY1RhcmdldCwgVGFyZ2V0RWxlbWVudCB9IGZyb20gJy4uL3R5cGUnO1xuXG5sZXQgc3VwcG9ydHNQYXNzaXZlID0gZmFsc2U7XG5cbmludGVyZmFjZSBXaW5kb3cge1xuICBhZGRFdmVudExpc3RlbmVyOiAoXG4gICAgdHlwZTogc3RyaW5nLFxuICAgIGxpc3RlbmVyOiAoKCkgPT4gdm9pZCkgfCBudWxsLFxuICAgIG9wdHM6IGJvb2xlYW4gfCBBZGRFdmVudExpc3RlbmVyT3B0aW9ucyxcbiAgKSA9PiB2b2lkO1xufVxuXG5pZiAoaW5Ccm93c2VyKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3B0cyA9IHt9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvcHRzLCAncGFzc2l2ZScsIHtcbiAgICAgIGdldCgpIHtcbiAgICAgICAgc3VwcG9ydHNQYXNzaXZlID0gdHJ1ZTtcbiAgICAgIH0sXG4gICAgfSk7XG4gICAgKHdpbmRvdyBhcyBXaW5kb3cpLmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QtcGFzc2l2ZScsIG51bGwsIG9wdHMpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gTm8tb3BcbiAgfVxufVxuXG50eXBlIFRhcmdldCA9IEJhc2ljVGFyZ2V0PFRhcmdldEVsZW1lbnQ+O1xuXG5leHBvcnQgdHlwZSBVc2VFdmVudExpc3RlbmVyT3B0aW9ucyA9IHtcbiAgdGFyZ2V0PzogVGFyZ2V0O1xuICBjYXB0dXJlPzogYm9vbGVhbjtcbiAgcGFzc2l2ZT86IGJvb2xlYW47XG4gIGRlcGVuZHM/OiBBcnJheTx1bmtub3duPjtcbn07XG5cbmZ1bmN0aW9uIHVzZUV2ZW50TGlzdGVuZXIoXG4gIHR5cGU6IHN0cmluZyxcbiAgbGlzdGVuZXI6IEV2ZW50TGlzdGVuZXIsXG4gIG9wdGlvbnM6IFVzZUV2ZW50TGlzdGVuZXJPcHRpb25zID0ge30sXG4pOiB2b2lkIHtcbiAgaWYgKCFpbkJyb3dzZXIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgeyB0YXJnZXQgPSB3aW5kb3csIHBhc3NpdmUgPSBmYWxzZSwgY2FwdHVyZSA9IGZhbHNlLCBkZXBlbmRzID0gW10gfSA9IG9wdGlvbnM7XG4gIGxldCBhdHRhY2hlZDogYm9vbGVhbjtcblxuICBjb25zdCBhZGQgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWxlbWVudCA9IGdldFRhcmdldEVsZW1lbnQodGFyZ2V0KTtcblxuICAgIGlmIChlbGVtZW50ICYmICFhdHRhY2hlZCkge1xuICAgICAgZWxlbWVudC5hZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCBzdXBwb3J0c1Bhc3NpdmUgPyB7IGNhcHR1cmUsIHBhc3NpdmUgfSA6IGNhcHR1cmUpO1xuICAgICAgYXR0YWNoZWQgPSB0cnVlO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCByZW1vdmUgPSAoKTogdm9pZCA9PiB7XG4gICAgY29uc3QgZWxlbWVudCA9IGdldFRhcmdldEVsZW1lbnQodGFyZ2V0KTtcblxuICAgIGlmIChlbGVtZW50ICYmIGF0dGFjaGVkKSB7XG4gICAgICBlbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIGNhcHR1cmUpO1xuICAgICAgYXR0YWNoZWQgPSBmYWxzZTtcbiAgICB9XG4gIH07XG5cbiAgdXNlRWZmZWN0KCgpID0+IHtcbiAgICBhZGQoKTtcbiAgICByZXR1cm4gKCkgPT4gcmVtb3ZlKCk7XG4gIH0sIFt0YXJnZXQsIC4uLmRlcGVuZHNdKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgdXNlRXZlbnRMaXN0ZW5lcjtcbiIsImltcG9ydCBSZWFjdCwgeyBGb3J3YXJkZWRSZWYsIFByb3BzV2l0aENoaWxkcmVuIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgSWNvbiBmcm9tICdAb25lLWZvci1hbGwvaWNvbic7XG5pbXBvcnQgeyB1bml0VG9QeCB9IGZyb20gJy4uLy4uL3V0aWxzJztcblxuaW1wb3J0ICcuL2xvYWRpbmcuc2Nzcyc7XG5cbmZ1bmN0aW9uIExvYWRpbmcoXG4gIHsgZGVzYywgY2xhc3NOYW1lLCBpY29uU2l6ZSA9IDI0LCB2ZXJ0aWNhbCB9OiBQcm9wc1dpdGhDaGlsZHJlbjxMb2FkaW5nUHJvcHM+LFxuICByZWY/OiBGb3J3YXJkZWRSZWY8SFRNTERpdkVsZW1lbnQ+LFxuKTogSlNYLkVsZW1lbnQge1xuICByZXR1cm4gKFxuICAgIDxkaXYgY2xhc3NOYW1lPXtjcygnb2ZhLWxvYWRpbmcnLCBjbGFzc05hbWUsIHsgJ29mYS1sb2FkaW5nLS12ZXJ0aWNhbCc6IHZlcnRpY2FsIH0pfSByZWY9e3JlZn0+XG4gICAgICA8SWNvbiBuYW1lPVwicmVmcmVzaFwiIHNpemU9e3VuaXRUb1B4KGljb25TaXplID8/IDApfSBjbGFzc05hbWU9XCJvZmEtbG9hZGluZ19faWNvblwiIC8+XG4gICAgICB7ISFkZXNjICYmIDxzcGFuIGNsYXNzTmFtZT1cIm9mYS1sb2FkaW5nX19kZXNjXCI+e2Rlc2N9PC9zcGFuPn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuZm9yd2FyZFJlZjxIVE1MRGl2RWxlbWVudCwgTG9hZGluZ1Byb3BzPihMb2FkaW5nKTtcbiIsImltcG9ydCBSZWFjdCwge1xuICB1c2VSZWYsXG4gIHVzZUltcGVyYXRpdmVIYW5kbGUsXG4gIGlzVmFsaWRFbGVtZW50LFxuICBNdXRhYmxlUmVmT2JqZWN0LFxuICBSZWFjdE5vZGUsXG4gIEZvcndhcmRlZFJlZixcbiAgUHJvcHNXaXRoQ2hpbGRyZW4sXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHVzZVNldFN0YXRlIGZyb20gJy4uLy4uL2hvb2tzL3VzZS1zZXQtc3RhdGUnO1xuaW1wb3J0IHVzZVVwZGF0ZUVmZmVjdCBmcm9tICcuLi8uLi9ob29rcy91c2UtdXBkYXRlLWVmZmVjdCc7XG5pbXBvcnQgdXNlU2Nyb2xsUGFyZW50IGZyb20gJy4uLy4uL2hvb2tzL3VzZS1zY3JvbGwtcGFyZW50JztcbmltcG9ydCB7IGdldFJlY3QgfSBmcm9tICcuLi8uLi9ob29rcy91c2UtcmVjdCc7XG5pbXBvcnQgeyBpc0hpZGRlbiB9IGZyb20gJy4uLy4uL3V0aWxzJztcbmltcG9ydCB1c2VFdmVudExpc3RlbmVyIGZyb20gJy4uLy4uL2hvb2tzL3VzZS1ldmVudC1saXN0ZW5lcic7XG5pbXBvcnQgTG9hZGluZyBmcm9tICcuLi8uLi9zaGFyZWQvbG9hZGluZyc7XG5cbmZ1bmN0aW9uIExpc3QocHJvcHM6IFByb3BzV2l0aENoaWxkcmVuPExpc3RQcm9wcz4sIHJlZjogRm9yd2FyZGVkUmVmPExpc3RJbnN0YW5jZT4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHtcbiAgICBvZmZzZXQgPSAzMDAsXG4gICAgZGlyZWN0aW9uID0gJ2Rvd24nLFxuICAgIGltbWVkaWF0ZUNoZWNrID0gdHJ1ZSxcbiAgICBhdXRvQ2hlY2sgPSB0cnVlLFxuICAgIGxvYWRpbmdUZXh0ID0gJ+WKoOi9veS4rS4uLicsXG4gICAgZmluaXNoZWRUZXh0LFxuICAgIGVycm9yVGV4dCxcbiAgICBsb2FkaW5nID0gZmFsc2UsXG4gICAgZXJyb3IgPSBmYWxzZSxcbiAgICBmaW5pc2hlZCxcbiAgfSA9IHByb3BzO1xuICBjb25zdCBbc3RhdGUsIHVwZGF0ZVN0YXRlXSA9IHVzZVNldFN0YXRlKHtcbiAgICBsb2FkaW5nLFxuICAgIGVycm9yLFxuICB9KTtcblxuICBjb25zdCByb290ID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PigpO1xuICBjb25zdCBzY3JvbGxQYXJlbnQgPSB1c2VSZWY8RWxlbWVudCB8IFdpbmRvdz4obnVsbCkgYXMgTXV0YWJsZVJlZk9iamVjdDxFbGVtZW50IHwgV2luZG93PjtcbiAgY29uc3QgcGxhY2Vob2xkZXIgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KCk7XG5cbiAgc2Nyb2xsUGFyZW50LmN1cnJlbnQgPSB1c2VTY3JvbGxQYXJlbnQocm9vdCk7XG5cbiAgY29uc3QgY2hlY2sgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKCFwcm9wcy5vbkxvYWQpIHJldHVybjtcbiAgICBpZiAoc3RhdGUubG9hZGluZyB8fCBmaW5pc2hlZCB8fCBzdGF0ZS5lcnJvcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBzY3JvbGxQYXJlbnRSZWN0ID0gZ2V0UmVjdChzY3JvbGxQYXJlbnQuY3VycmVudCk7XG5cbiAgICBpZiAoIXNjcm9sbFBhcmVudFJlY3QuaGVpZ2h0IHx8IGlzSGlkZGVuKHJvb3QuY3VycmVudCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaXNSZWFjaEVkZ2U7XG4gICAgY29uc3QgcGxhY2Vob2xkZXJSZWN0ID0gZ2V0UmVjdChwbGFjZWhvbGRlci5jdXJyZW50KTtcblxuICAgIGlmIChkaXJlY3Rpb24gPT09ICd1cCcpIHtcbiAgICAgIGlzUmVhY2hFZGdlID0gc2Nyb2xsUGFyZW50UmVjdC50b3AgLSBwbGFjZWhvbGRlclJlY3QudG9wIDw9IG9mZnNldDtcbiAgICB9IGVsc2Uge1xuICAgICAgaXNSZWFjaEVkZ2UgPSBwbGFjZWhvbGRlclJlY3QuYm90dG9tIC0gc2Nyb2xsUGFyZW50UmVjdC5ib3R0b20gPD0gb2Zmc2V0O1xuICAgIH1cbiAgICBpZiAoaXNSZWFjaEVkZ2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHVwZGF0ZVN0YXRlKHsgbG9hZGluZzogdHJ1ZSB9KTtcbiAgICAgICAgaWYgKHByb3BzLm9uTG9hZCkgYXdhaXQgcHJvcHMub25Mb2FkKCk7XG4gICAgICAgIHVwZGF0ZVN0YXRlKHsgbG9hZGluZzogZmFsc2UgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICB1cGRhdGVTdGF0ZSh7IGxvYWRpbmc6IGZhbHNlLCBlcnJvcjogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyRmluaXNoZWRUZXh0ID0gKCk6IFJlYWN0Tm9kZSA9PiB7XG4gICAgaWYgKGZpbmlzaGVkICYmIGZpbmlzaGVkVGV4dCkge1xuICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwib2ZhLWxpc3RfX2ZpbmlzaGVkLXRleHQgdGV4dC1wbGFjZWhvbGRlclwiPntmaW5pc2hlZFRleHR9PC9kaXY+O1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBjb25zdCBjbGlja0Vycm9yVGV4dCA9ICgpOiB2b2lkID0+IHtcbiAgICB1cGRhdGVTdGF0ZSh7IGVycm9yOiBmYWxzZSB9KTtcbiAgICBjaGVjaygpO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckVycm9yVGV4dCA9ICgpOiBSZWFjdE5vZGUgPT4ge1xuICAgIGlmIChzdGF0ZS5lcnJvciAmJiBlcnJvclRleHQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ZhLWxpc3RfX2Vycm9yLXRleHQgdGV4dC1wbGFjZWhvbGRlclwiIG9uQ2xpY2s9e2NsaWNrRXJyb3JUZXh0fT5cbiAgICAgICAgICB7ZXJyb3JUZXh0fVxuICAgICAgICA8L2Rpdj5cbiAgICAgICk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIGNvbnN0IHJlbmRlckxvYWRpbmcgPSAoKTogUmVhY3ROb2RlID0+IHtcbiAgICBpZiAoc3RhdGUubG9hZGluZyAmJiAhZmluaXNoZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ZhLWxpc3RfX2xvYWRpbmcgdGV4dC1wbGFjZWhvbGRlclwiPlxuICAgICAgICAgIHt0eXBlb2YgbG9hZGluZ1RleHQgPT09ICdmdW5jdGlvbicgJiYgaXNWYWxpZEVsZW1lbnQobG9hZGluZ1RleHQpID8gKFxuICAgICAgICAgICAgbG9hZGluZ1RleHQoKVxuICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICA8TG9hZGluZyBjbGFzc05hbWU9XCJvZmEtbGlzdF9fbG9hZGluZy1pY29uIHRleHQtcGxhY2Vob2xkZXJcIiBpY29uU2l6ZT1cIi4xOHJlbVwiPlxuICAgICAgICAgICAgICB7bG9hZGluZ1RleHR9XG4gICAgICAgICAgICA8L0xvYWRpbmc+XG4gICAgICAgICAgKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICB1c2VVcGRhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChhdXRvQ2hlY2spIHtcbiAgICAgIGNoZWNrKCk7XG4gICAgfVxuICB9LCBbc3RhdGUubG9hZGluZywgZmluaXNoZWQsIGVycm9yXSk7XG5cbiAgdXNlVXBkYXRlRWZmZWN0KCgpID0+IHtcbiAgICB1cGRhdGVTdGF0ZSh7IGxvYWRpbmcsIGVycm9yIH0pO1xuICB9LCBbbG9hZGluZywgZXJyb3JdKTtcblxuICB1c2VVcGRhdGVFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChzY3JvbGxQYXJlbnQuY3VycmVudCAmJiBpbW1lZGlhdGVDaGVjaykge1xuICAgICAgY2hlY2soKTtcbiAgICB9XG4gIH0sIFtzY3JvbGxQYXJlbnQuY3VycmVudF0pO1xuXG4gIHVzZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGNoZWNrLCB7XG4gICAgdGFyZ2V0OiBzY3JvbGxQYXJlbnQuY3VycmVudCxcbiAgICBkZXBlbmRzOiBbc3RhdGUubG9hZGluZywgZmluaXNoZWQsIHN0YXRlLmVycm9yXSxcbiAgfSk7XG5cbiAgdXNlSW1wZXJhdGl2ZUhhbmRsZShyZWYsICgpID0+ICh7XG4gICAgY2hlY2ssXG4gICAgc3RhdGUsXG4gIH0pKTtcblxuICBjb25zdCBQbGFjZWhvbGRlciA9IChcbiAgICA8ZGl2IHJlZj17cGxhY2Vob2xkZXIgYXMgTXV0YWJsZVJlZk9iamVjdDxIVE1MRGl2RWxlbWVudD59IGNsYXNzTmFtZT1cIm9mYS1saXN0X19wbGFjZWhvbGRlclwiIC8+XG4gICk7XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2XG4gICAgICByZWY9e3Jvb3QgYXMgTXV0YWJsZVJlZk9iamVjdDxIVE1MRGl2RWxlbWVudD59XG4gICAgICByb2xlPVwiZmVlZFwiXG4gICAgICBjbGFzc05hbWU9e2NzKCdvZmEtbGlzdCcsIHByb3BzLmNsYXNzTmFtZSl9XG4gICAgICBzdHlsZT17cHJvcHMuc3R5bGV9XG4gICAgICBhcmlhLWJ1c3k9e3N0YXRlLmxvYWRpbmd9XG4gICAgPlxuICAgICAge2RpcmVjdGlvbiA9PT0gJ2Rvd24nID8gcHJvcHMuY2hpbGRyZW4gOiBQbGFjZWhvbGRlcn1cbiAgICAgIHtyZW5kZXJMb2FkaW5nKCl9XG4gICAgICB7cmVuZGVyRmluaXNoZWRUZXh0KCl9XG4gICAgICB7cmVuZGVyRXJyb3JUZXh0KCl9XG4gICAgICB7ZGlyZWN0aW9uID09PSAndXAnID8gcHJvcHMuY2hpbGRyZW4gOiBQbGFjZWhvbGRlcn1cbiAgICA8L2Rpdj5cbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgUmVhY3QuZm9yd2FyZFJlZjxMaXN0SW5zdGFuY2UsIExpc3RQcm9wcz4oTGlzdCk7XG4iLCJpbXBvcnQgeyB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgeyBnZXRSZWN0IH0gZnJvbSAnLi91c2UtcmVjdCc7XG5cbmV4cG9ydCBjb25zdCB1c2VIZWlnaHQgPSAoZWxlbWVudDogeyBjdXJyZW50PzogRWxlbWVudCB8IG51bGwgfSk6IG51bWJlciA9PiB7XG4gIGNvbnN0IFtoZWlnaHQsIHNldEhlaWdodF0gPSB1c2VTdGF0ZSgwKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGlmIChlbGVtZW50LmN1cnJlbnQpIHtcbiAgICAgIHNldEhlaWdodChnZXRSZWN0KGVsZW1lbnQuY3VycmVudCkuaGVpZ2h0KTtcbiAgICB9XG4gIH0sIFtlbGVtZW50LmN1cnJlbnRdKTtcblxuICByZXR1cm4gaGVpZ2h0O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgdXNlSGVpZ2h0O1xuIiwiaW1wb3J0IFJlYWN0LCB7IEZvcndhcmRlZFJlZiwgaXNWYWxpZEVsZW1lbnQsIFJlYWN0RWxlbWVudCwgdXNlSW1wZXJhdGl2ZUhhbmRsZSwgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IGNzIGZyb20gJ2NsYXNzbmFtZXMnO1xuXG5pbXBvcnQgdXNlSGVpZ2h0IGZyb20gJy4uLy4uL2hvb2tzL3VzZS1oZWlnaHQnO1xuaW1wb3J0IHsgZ2V0WkluZGV4U3R5bGUgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgSWNvbiBmcm9tICdAb25lLWZvci1hbGwvaWNvbic7XG5cbmltcG9ydCAnLi4vLi4vc3R5bGVzX3RvZG9fZGVsZXRlX3RoaXMvY29tcG9uZW50cy9uYXYtYmFyLnNjc3MnO1xuXG5mdW5jdGlvbiBOYXZCYXIocHJvcHM6IE5hdkJhclByb3BzLCByZWY6IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudD4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHtcbiAgICBvbkNsaWNrTGVmdCxcbiAgICBvbkNsaWNrUmlnaHQsXG4gICAgbGVmdCxcbiAgICBsZWZ0QXJyb3csXG4gICAgcmlnaHQsXG4gICAgZml4ZWQsXG4gICAgcGxhY2Vob2xkZXIsXG4gICAgc2FmZUFyZWFJbnNldFRvcCA9IHRydWUsXG4gICAgdGl0bGUsXG4gICAgekluZGV4LFxuICB9ID0gcHJvcHM7XG5cbiAgY29uc3QgbmF2QmFyUmVmID0gdXNlUmVmKG51bGwpO1xuXG4gIGNvbnN0IG5hdkJhckhlaWdodCA9IHVzZUhlaWdodChuYXZCYXJSZWYpO1xuXG4gIGNvbnN0IHJlbmRlckxlZnQgPSAoKTogUmVhY3QuUmVhY3ROb2RlID0+IHtcbiAgICBpZiAodHlwZW9mIGxlZnQgIT09ICdzdHJpbmcnICYmIGlzVmFsaWRFbGVtZW50KGxlZnQpKSB7XG4gICAgICByZXR1cm4gbGVmdDtcbiAgICB9XG5cbiAgICByZXR1cm4gW1xuICAgICAgISFsZWZ0QXJyb3cgJiYgKFxuICAgICAgICA8SWNvbiBrZXk9XCJvZmEtbmF2LWJhcl9fYXJyb3dcIiBjbGFzc05hbWU9XCJvZmEtbmF2LWJhcl9fYXJyb3dcIiBuYW1lPVwia2V5Ym9hcmRfYmFja3NwYWNlXCIgc2l6ZT17MjR9IC8+XG4gICAgICApLFxuICAgICAgISFsZWZ0ICYmIChcbiAgICAgICAgPHNwYW4ga2V5PVwib2ZhLW5hdi1iYXJfX3RleHRcIiBjbGFzc05hbWU9XCJvZmEtbmF2LWJhcl9fdGV4dFwiPlxuICAgICAgICAgIHtsZWZ0fVxuICAgICAgICA8L3NwYW4+XG4gICAgICApLFxuICAgIF07XG4gIH07XG5cbiAgY29uc3QgcmVuZGVyUmlnaHQgPSAoKTogUmVhY3QuUmVhY3ROb2RlID0+IHtcbiAgICBpZiAodHlwZW9mIHJpZ2h0ICE9PSAnc3RyaW5nJyAmJiBpc1ZhbGlkRWxlbWVudChyaWdodCkpIHtcbiAgICAgIHJldHVybiByaWdodDtcbiAgICB9XG5cbiAgICByZXR1cm4gPHNwYW4gY2xhc3NOYW1lPVwib2ZhLW5hdi1iYXJfX3RleHRcIj57cmlnaHR9PC9zcGFuPjtcbiAgfTtcblxuICBjb25zdCByZW5kZXJOYXZCYXIgPSAoKTogUmVhY3RFbGVtZW50ID0+IHtcbiAgICBjb25zdCBzdHlsZSA9IGdldFpJbmRleFN0eWxlKHpJbmRleCwgcHJvcHMuc3R5bGUpO1xuXG4gICAgY29uc3QgaGFzTGVmdCA9IGxlZnRBcnJvdyB8fCAhIWxlZnQ7XG4gICAgY29uc3QgaGFzUmlnaHQgPSAhIXJpZ2h0O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXtuYXZCYXJSZWZ9XG4gICAgICAgIHN0eWxlPXtzdHlsZX1cbiAgICAgICAgY2xhc3NOYW1lPXtjcyhcbiAgICAgICAgICAnb2ZhLW5hdi1iYXInLFxuICAgICAgICAgIHsgJ29mYS1uYXYtYmFyLS1maXhlZCc6IGZpeGVkLCAnb2ZhLXNhZmUtYXJlYS1pbnNldC10b3AnOiBzYWZlQXJlYUluc2V0VG9wIH0sXG4gICAgICAgICAgcHJvcHMuY2xhc3NOYW1lLFxuICAgICAgICApfVxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm9mYS1uYXYtYmFyX19jb250ZW50IHRleHQtcHJpbWFyeVwiPlxuICAgICAgICAgIHtoYXNMZWZ0ICYmIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ZhLW5hdi1iYXJfX2xlZnRcIiBvbkNsaWNrPXtvbkNsaWNrTGVmdH0+XG4gICAgICAgICAgICAgIHtyZW5kZXJMZWZ0KCl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICApfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ZhLW5hdi1iYXJfX3RpdGxlIHRpdGxlMyB0cnVuY2F0ZVwiPnt0aXRsZX08L2Rpdj5cbiAgICAgICAgICB7aGFzUmlnaHQgJiYgKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJvZmEtbmF2LWJhcl9fcmlnaHRcIiBvbkNsaWNrPXtvbkNsaWNrUmlnaHR9PlxuICAgICAgICAgICAgICB7cmVuZGVyUmlnaHQoKX1cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJQbGFjZWhvbGRlciA9ICgpOiBSZWFjdC5SZWFjdE5vZGUgPT4ge1xuICAgIGlmIChmaXhlZCAmJiBwbGFjZWhvbGRlcikge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGRpdlxuICAgICAgICAgIGNsYXNzTmFtZT1cIm9mYS1uYXYtYmFyX19wbGFjZWhvbGRlclwiXG4gICAgICAgICAgc3R5bGU9e3sgaGVpZ2h0OiBuYXZCYXJIZWlnaHQgPyBgJHtuYXZCYXJIZWlnaHR9cHhgIDogdW5kZWZpbmVkIH19XG4gICAgICAgIC8+XG4gICAgICApO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICB1c2VJbXBlcmF0aXZlSGFuZGxlKHJlZiwgKCkgPT4gbmF2QmFyUmVmPy5jdXJyZW50IGFzIHVua25vd24gYXMgSFRNTERpdkVsZW1lbnQpO1xuXG4gIHJldHVybiAoXG4gICAgPD5cbiAgICAgIHtyZW5kZXJQbGFjZWhvbGRlcigpfVxuICAgICAge3JlbmRlck5hdkJhcigpfVxuICAgIDwvPlxuICApO1xufVxuXG5leHBvcnQgZGVmYXVsdCBSZWFjdC5mb3J3YXJkUmVmKE5hdkJhcik7XG4iLCJpbXBvcnQgeyB1c2VDYWxsYmFjaywgdXNlUmVmIH0gZnJvbSAncmVhY3QnO1xuXG5pbXBvcnQgdXNlU2V0U3RhdGUgZnJvbSAnLi91c2Utc2V0LXN0YXRlJztcblxuY29uc3QgTUlOX0RJU1RBTkNFID0gMTA7XG5cbnR5cGUgRGlyZWN0aW9uID0gJycgfCAndmVydGljYWwnIHwgJ2hvcml6b250YWwnO1xuXG5mdW5jdGlvbiBnZXREaXJlY3Rpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpOiBEaXJlY3Rpb24ge1xuICBpZiAoeCA+IHkgJiYgeCA+IE1JTl9ESVNUQU5DRSkge1xuICAgIHJldHVybiAnaG9yaXpvbnRhbCc7XG4gIH1cbiAgaWYgKHkgPiB4ICYmIHkgPiBNSU5fRElTVEFOQ0UpIHtcbiAgICByZXR1cm4gJ3ZlcnRpY2FsJztcbiAgfVxuICByZXR1cm4gJyc7XG59XG5cbmNvbnN0IElOSVRJQUxfU1RBVEUgPSB7XG4gIHN0YXJ0WDogMCxcbiAgc3RhcnRZOiAwLFxuICBkZWx0YVg6IDAsXG4gIGRlbHRhWTogMCxcbiAgb2Zmc2V0WDogMCxcbiAgb2Zmc2V0WTogMCxcbiAgZGlyZWN0aW9uOiAnJyBhcyBEaXJlY3Rpb24sXG59O1xuXG50eXBlIFN0YXRlID0gdHlwZW9mIElOSVRJQUxfU1RBVEUgJiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPjtcblxudHlwZSBUb3VjaCA9IFN0YXRlICYge1xuICBtb3ZlOiBFdmVudExpc3RlbmVyO1xuICBzdGFydDogRXZlbnRMaXN0ZW5lcjtcbiAgcmVzZXQ6ICgpID0+IHZvaWQ7XG4gIGlzVmVydGljYWw6ICgpID0+IGJvb2xlYW47XG4gIGlzSG9yaXpvbnRhbDogKCkgPT4gYm9vbGVhbjtcbn07XG5cbnR5cGUgU3RhdGVUeXBlID0gUGFydGlhbDx0eXBlb2YgSU5JVElBTF9TVEFURT47XG50eXBlIFN0YXRlRnVuY3Rpb25UeXBlID0gKHZhbHVlOiBTdGF0ZVR5cGUpID0+IHR5cGVvZiBJTklUSUFMX1NUQVRFO1xuXG5jb25zdCB1c2VUb3VjaCA9IChjYW5TdGF0ZT86IGJvb2xlYW4pOiBUb3VjaCA9PiB7XG4gIGNvbnN0IHJlZlN0YXRlID0gdXNlUmVmPFN0YXRlPihJTklUSUFMX1NUQVRFKTtcbiAgY29uc3Qgc3RhdGUgPSB1c2VTZXRTdGF0ZShJTklUSUFMX1NUQVRFKTtcblxuICBjb25zdCBpbm5lclN0YXRlID0gY2FuU3RhdGUgPyBzdGF0ZVswXSA6IHJlZlN0YXRlLmN1cnJlbnQ7XG5cbiAgY29uc3QgdXBkYXRlID0gKHZhbHVlOiBTdGF0ZVR5cGUgfCBTdGF0ZUZ1bmN0aW9uVHlwZSk6IHZvaWQgPT4ge1xuICAgIGlmIChjYW5TdGF0ZSkge1xuICAgICAgc3RhdGVbMV0odmFsdWUpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgX3ZhbHVlID0gdmFsdWU7XG4gICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgX3ZhbHVlID0gdmFsdWUocmVmU3RhdGUuY3VycmVudCk7XG4gICAgfVxuICAgIE9iamVjdC5lbnRyaWVzKF92YWx1ZSkuZm9yRWFjaCgoW2ssIHZdKSA9PiB7XG4gICAgICByZWZTdGF0ZS5jdXJyZW50W2tdID0gdjtcbiAgICB9KTtcbiAgfTtcblxuICBjb25zdCBpc1ZlcnRpY2FsID0gdXNlQ2FsbGJhY2soKCkgPT4gaW5uZXJTdGF0ZS5kaXJlY3Rpb24gPT09ICd2ZXJ0aWNhbCcsIFtpbm5lclN0YXRlLmRpcmVjdGlvbl0pO1xuICBjb25zdCBpc0hvcml6b250YWwgPSB1c2VDYWxsYmFjaygoKSA9PiBpbm5lclN0YXRlLmRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnLCBbaW5uZXJTdGF0ZS5kaXJlY3Rpb25dKTtcblxuICBjb25zdCByZXNldCA9ICgpOiB2b2lkID0+IHtcbiAgICB1cGRhdGUoe1xuICAgICAgZGVsdGFYOiAwLFxuICAgICAgZGVsdGFZOiAwLFxuICAgICAgb2Zmc2V0WDogMCxcbiAgICAgIG9mZnNldFk6IDAsXG4gICAgICBkaXJlY3Rpb246ICcnLFxuICAgIH0pO1xuICB9O1xuXG4gIGNvbnN0IHN0YXJ0ID0gKChldmVudDogVG91Y2hFdmVudCkgPT4ge1xuICAgIHJlc2V0KCk7XG4gICAgdXBkYXRlKHtcbiAgICAgIHN0YXJ0WDogZXZlbnQudG91Y2hlc1swXS5jbGllbnRYLFxuICAgICAgc3RhcnRZOiBldmVudC50b3VjaGVzWzBdLmNsaWVudFksXG4gICAgfSk7XG4gIH0pIGFzIEV2ZW50TGlzdGVuZXI7XG5cbiAgY29uc3QgbW92ZSA9ICgoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICBjb25zdCB0b3VjaCA9IGV2ZW50LnRvdWNoZXNbMF07XG5cbiAgICB1cGRhdGUoKHZhbHVlKSA9PiB7XG4gICAgICAvLyBGaXg6IFNhZmFyaSBiYWNrIHdpbGwgc2V0IGNsaWVudFggdG8gbmVnYXRpdmUgbnVtYmVyXG4gICAgICBjb25zdCBuZXdTdGF0ZSA9IHsgLi4udmFsdWUgfSBhcyB0eXBlb2YgaW5uZXJTdGF0ZTtcblxuICAgICAgbmV3U3RhdGUuZGVsdGFYID0gdG91Y2guY2xpZW50WCA8IDAgPyAwIDogdG91Y2guY2xpZW50WCAtIG5ld1N0YXRlLnN0YXJ0WDtcbiAgICAgIG5ld1N0YXRlLmRlbHRhWSA9IHRvdWNoLmNsaWVudFkgLSBuZXdTdGF0ZS5zdGFydFk7XG4gICAgICBuZXdTdGF0ZS5vZmZzZXRYID0gTWF0aC5hYnMobmV3U3RhdGUuZGVsdGFYKTtcbiAgICAgIG5ld1N0YXRlLm9mZnNldFkgPSBNYXRoLmFicyhuZXdTdGF0ZS5kZWx0YVkpO1xuXG4gICAgICBpZiAoIW5ld1N0YXRlLmRpcmVjdGlvbikge1xuICAgICAgICBuZXdTdGF0ZS5kaXJlY3Rpb24gPSBnZXREaXJlY3Rpb24obmV3U3RhdGUub2Zmc2V0WCwgbmV3U3RhdGUub2Zmc2V0WSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbmV3U3RhdGU7XG4gICAgfSk7XG4gIH0pIGFzIEV2ZW50TGlzdGVuZXI7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5pbm5lclN0YXRlLFxuICAgIG1vdmUsXG4gICAgc3RhcnQsXG4gICAgcmVzZXQsXG4gICAgaXNWZXJ0aWNhbCxcbiAgICBpc0hvcml6b250YWwsXG4gIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCB1c2VUb3VjaDtcbiIsImltcG9ydCBSZWFjdCwge1xuICBDU1NQcm9wZXJ0aWVzLFxuICBGb3J3YXJkZWRSZWYsXG4gIE11dGFibGVSZWZPYmplY3QsXG4gIFByb3BzV2l0aENoaWxkcmVuLFxuICBSZWFjdE5vZGUsXG4gIHVzZUNhbGxiYWNrLFxuICB1c2VNZW1vLFxuICB1c2VSZWYsXG59IGZyb20gJ3JlYWN0JztcbmltcG9ydCBjcyBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IHVzZVNldFN0YXRlIGZyb20gJy4uLy4uL2hvb2tzL3VzZS1zZXQtc3RhdGUnO1xuaW1wb3J0IHVzZVVwZGF0ZUVmZmVjdCBmcm9tICcuLi8uLi9ob29rcy91c2UtdXBkYXRlLWVmZmVjdCc7XG5pbXBvcnQgdXNlVG91Y2ggZnJvbSAnLi4vLi4vaG9va3MvdXNlLXRvdWNoJztcbmltcG9ydCB1c2VFdmVudExpc3RlbmVyIGZyb20gJy4uLy4uL2hvb2tzL3VzZS1ldmVudC1saXN0ZW5lcic7XG5pbXBvcnQgeyBnZXRTY3JvbGxQYXJlbnQgfSBmcm9tICcuLi8uLi9ob29rcy91c2Utc2Nyb2xsLXBhcmVudCc7XG5pbXBvcnQgeyBnZXRTY3JvbGxUb3AgfSBmcm9tICcuLi8uLi91dGlscyc7XG5pbXBvcnQgTG9hZGluZyBmcm9tICcuLi8uLi9zaGFyZWQvbG9hZGluZyc7XG5cbmltcG9ydCAnLi4vLi4vc3R5bGVzX3RvZG9fZGVsZXRlX3RoaXMvY29tcG9uZW50cy9wdWxsLXJlZnJlc2guc2Nzcyc7XG5cbmNvbnN0IERFRkFVTFRfSEVBRF9IRUlHSFQgPSA1MDtcbmNvbnN0IFRFWFRfU1RBVFVTID0gWydwdWxsaW5nJywgJ2xvb3NpbmcnLCAnc3VjY2VzcyddO1xuXG5mdW5jdGlvbiBQdWxsUmVmcmVzaChcbiAgcHJvcHM6IFByb3BzV2l0aENoaWxkcmVuPFB1bGxSZWZyZXNoUHJvcHM+LFxuICByZWY6IEZvcndhcmRlZFJlZjxIVE1MRGl2RWxlbWVudD4sXG4pOiBKU1guRWxlbWVudCB7XG4gIGNvbnN0IHtcbiAgICBkaXNhYmxlZCxcbiAgICBoZWFkSGVpZ2h0ID0gNTAsXG4gICAgYW5pbWF0aW9uRHVyYXRpb24gPSAzMDAsXG4gICAgc3VjY2Vzc0R1cmF0aW9uID0gNTAwLFxuICAgIHN1Y2Nlc3NUZXh0LFxuICAgIHB1bGxEaXN0YW5jZSxcbiAgICBwdWxsaW5nVGV4dCA9ICfkuIvmi4nljbPlj6/liLfmlrAuLi4nLFxuICAgIGxvb3NpbmdUZXh0ID0gJ+mHiuaUvuWNs+WPr+WIt+aWsC4uLicsXG4gICAgbG9hZGluZ1RleHQgPSAn5Yqg6L295LitLi4uJyxcbiAgfSA9IHByb3BzO1xuXG4gIGNvbnN0IFtzdGF0ZSwgdXBkYXRlU3RhdGVdID0gdXNlU2V0U3RhdGUoe1xuICAgIHJlZnJlc2hpbmc6IGZhbHNlLFxuICAgIHN0YXR1czogJ25vcm1hbCcgYXMgUHVsbFJlZnJlc2hTdGF0dXMsXG4gICAgZGlzdGFuY2U6IDAsXG4gICAgZHVyYXRpb246IDAsXG4gIH0pO1xuXG4gIGNvbnN0IHRyYWNrID0gdXNlUmVmPEhUTUxEaXZFbGVtZW50PigpIGFzIE11dGFibGVSZWZPYmplY3Q8SFRNTERpdkVsZW1lbnQ+O1xuICBjb25zdCByZWFjaFRvcCA9IHVzZVJlZjxib29sZWFuPihudWxsKSBhcyBNdXRhYmxlUmVmT2JqZWN0PGJvb2xlYW4+O1xuXG4gIGNvbnN0IHRvdWNoID0gdXNlVG91Y2goKTtcblxuICBjb25zdCBnZXRIZWFkU3R5bGUgPSAoKTogQ1NTUHJvcGVydGllcyB8IHVuZGVmaW5lZCA9PiB7XG4gICAgaWYgKGhlYWRIZWlnaHQgIT09IERFRkFVTFRfSEVBRF9IRUlHSFQpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGhlaWdodDogYCR7aGVhZEhlaWdodH1weGAsXG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9O1xuXG4gIGNvbnN0IGlzVG91Y2hhYmxlID0gdXNlQ2FsbGJhY2soKCkgPT4ge1xuICAgIHJldHVybiBzdGF0ZS5zdGF0dXMgIT09ICdsb2FkaW5nJyAmJiBzdGF0ZS5zdGF0dXMgIT09ICdzdWNjZXNzJyAmJiAhZGlzYWJsZWQ7XG4gIH0sIFtzdGF0ZS5zdGF0dXMsIGRpc2FibGVkXSk7XG5cbiAgY29uc3QgZWFzZSA9IChkaXN0YW5jZTogbnVtYmVyKTogbnVtYmVyID0+IHtcbiAgICBjb25zdCBfcHVsbERpc3RhbmNlID0gKyhwdWxsRGlzdGFuY2UgfHwgaGVhZEhlaWdodCk7XG5cbiAgICBsZXQgX2Rpc3RhbmNlID0gZGlzdGFuY2U7XG4gICAgaWYgKF9kaXN0YW5jZSA+IF9wdWxsRGlzdGFuY2UpIHtcbiAgICAgIGlmIChfZGlzdGFuY2UgPCBfcHVsbERpc3RhbmNlICogMikge1xuICAgICAgICBfZGlzdGFuY2UgPSBfcHVsbERpc3RhbmNlICsgKF9kaXN0YW5jZSAtIF9wdWxsRGlzdGFuY2UpIC8gMjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9kaXN0YW5jZSA9IF9wdWxsRGlzdGFuY2UgKiAxLjUgKyAoX2Rpc3RhbmNlIC0gX3B1bGxEaXN0YW5jZSAqIDIpIC8gNDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gTWF0aC5yb3VuZChfZGlzdGFuY2UpO1xuICB9O1xuXG4gIGNvbnN0IHNldFN0YXR1cyA9IChkaXN0YW5jZTogbnVtYmVyLCBpc0xvYWRpbmc/OiBib29sZWFuKTogdm9pZCA9PiB7XG4gICAgY29uc3QgX3B1bGxEaXN0YW5jZSA9ICsocHVsbERpc3RhbmNlIHx8IGhlYWRIZWlnaHQpO1xuICAgIGNvbnN0IG5ld1N0YXRlID0geyBkaXN0YW5jZSB9IGFzIHR5cGVvZiBzdGF0ZTtcblxuICAgIGlmIChpc0xvYWRpbmcpIHtcbiAgICAgIG5ld1N0YXRlLnN0YXR1cyA9ICdsb2FkaW5nJztcbiAgICB9IGVsc2UgaWYgKGRpc3RhbmNlID09PSAwKSB7XG4gICAgICBuZXdTdGF0ZS5zdGF0dXMgPSAnbm9ybWFsJztcbiAgICB9IGVsc2UgaWYgKGRpc3RhbmNlIDwgX3B1bGxEaXN0YW5jZSkge1xuICAgICAgbmV3U3RhdGUuc3RhdHVzID0gJ3B1bGxpbmcnO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdTdGF0ZS5zdGF0dXMgPSAnbG9vc2luZyc7XG4gICAgfVxuICAgIHVwZGF0ZVN0YXRlKG5ld1N0YXRlKTtcbiAgfTtcblxuICBjb25zdCBnZXRTdGF0dXNUZXh0ID0gKCk6IFN0YXR1c1RleHRUeXBlID0+IHtcbiAgICBzd2l0Y2ggKHN0YXRlLnN0YXR1cykge1xuICAgICAgY2FzZSAnbm9ybWFsJzpcbiAgICAgICAgcmV0dXJuICcnO1xuICAgICAgY2FzZSAncHVsbGluZyc6XG4gICAgICAgIHJldHVybiBwdWxsaW5nVGV4dDtcbiAgICAgIGNhc2UgJ2xvYWRpbmcnOlxuICAgICAgICByZXR1cm4gbG9hZGluZ1RleHQ7XG4gICAgICBjYXNlICdsb29zaW5nJzpcbiAgICAgICAgcmV0dXJuIGxvb3NpbmdUZXh0O1xuICAgIH1cbiAgICByZXR1cm4gKHByb3BzIGFzIGFueSlbYCR7c3RhdGUuc3RhdHVzfVRleHRgXTtcbiAgfTtcblxuICBjb25zdCByZW5kZXJTdGF0dXMgPSAoKTogUmVhY3ROb2RlID0+IHtcbiAgICBjb25zdCB7IHN0YXR1cywgZGlzdGFuY2UgfSA9IHN0YXRlO1xuICAgIGNvbnN0IHN0YXR1c1RleHQgPSBnZXRTdGF0dXNUZXh0KCk7XG4gICAgaWYgKHR5cGVvZiBzdGF0dXNUZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gc3RhdHVzVGV4dCh7IGRpc3RhbmNlIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IG5vZGVzOiBKU1guRWxlbWVudFtdID0gW107XG5cbiAgICBpZiAoVEVYVF9TVEFUVVMuaW5jbHVkZXMoc3RhdHVzKSkge1xuICAgICAgbm9kZXMucHVzaChcbiAgICAgICAgPGRpdiBrZXk9XCJvZmEtdGV4dFwiIGNsYXNzTmFtZT1cIm9mYS1wdWxsLXJlZnJlc2hfX3RleHQgdGV4dC1wbGFjZWhvbGRlclwiPlxuICAgICAgICAgIHtzdGF0dXNUZXh0fVxuICAgICAgICA8L2Rpdj4sXG4gICAgICApO1xuICAgIH1cbiAgICBpZiAoc3RhdHVzID09PSAnbG9hZGluZycpIHtcbiAgICAgIG5vZGVzLnB1c2goXG4gICAgICAgIDxMb2FkaW5nIGtleT1cIm9mYS1sb2FkaW5nXCIgaWNvblNpemU9XCIuMTZyZW1cIiBjbGFzc05hbWU9XCJvZmEtcHVsbC1yZWZyZXNoX19sb2FkaW5nIHRleHQtcGxhY2Vob2xkZXJcIj5cbiAgICAgICAgICB7c3RhdHVzVGV4dH1cbiAgICAgICAgPC9Mb2FkaW5nPixcbiAgICAgICk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVzO1xuICB9O1xuXG4gIGNvbnN0IHNob3dTdWNjZXNzVGlwID0gKCk6IHZvaWQgPT4ge1xuICAgIHVwZGF0ZVN0YXRlKHsgc3RhdHVzOiAnc3VjY2VzcycgfSk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICBzZXRTdGF0dXMoMCk7XG4gICAgfSwgK3N1Y2Nlc3NEdXJhdGlvbik7XG4gIH07XG5cbiAgY29uc3Qgb25SZWZyZXNoID0gYXN5bmMgKCk6IFByb21pc2U8dm9pZD4gPT4ge1xuICAgIHRyeSB7XG4gICAgICB1cGRhdGVTdGF0ZSh7IHJlZnJlc2hpbmc6IHRydWUgfSk7XG4gICAgICBhd2FpdCBwcm9wcy5vblJlZnJlc2goKTtcbiAgICAgIHVwZGF0ZVN0YXRlKHsgcmVmcmVzaGluZzogZmFsc2UgfSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHVwZGF0ZVN0YXRlKHsgcmVmcmVzaGluZzogZmFsc2UgfSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGNoZWNrUG9zaXRpb24gPSAoZXZlbnQ6IFRvdWNoRXZlbnQpOiB2b2lkID0+IHtcbiAgICBjb25zdCBzY3JvbGxUYXJnZXQgPSBnZXRTY3JvbGxQYXJlbnQoZXZlbnQudGFyZ2V0IGFzIEhUTUxFbGVtZW50KTtcbiAgICByZWFjaFRvcC5jdXJyZW50ID0gZ2V0U2Nyb2xsVG9wKHNjcm9sbFRhcmdldCkgPT09IDA7XG4gICAgaWYgKHJlYWNoVG9wLmN1cnJlbnQpIHtcbiAgICAgIHVwZGF0ZVN0YXRlKHsgZHVyYXRpb246IDAgfSk7XG4gICAgICB0b3VjaC5zdGFydChldmVudCk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IG9uVG91Y2hTdGFydCA9IChldmVudDogUmVhY3QuVG91Y2hFdmVudCk6IHZvaWQgPT4ge1xuICAgIGlmIChpc1RvdWNoYWJsZSgpKSB7XG4gICAgICBjaGVja1Bvc2l0aW9uKGV2ZW50Lm5hdGl2ZUV2ZW50KTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3Qgb25Ub3VjaE1vdmUgPSB1c2VDYWxsYmFjayhcbiAgICAoZXZlbnQ6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGlmIChpc1RvdWNoYWJsZSgpKSB7XG4gICAgICAgIGlmICghcmVhY2hUb3AuY3VycmVudCkge1xuICAgICAgICAgIGNoZWNrUG9zaXRpb24oZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdG91Y2gubW92ZShldmVudCk7XG4gICAgICAgIGlmIChyZWFjaFRvcC5jdXJyZW50ICYmIHRvdWNoLmRlbHRhWSA+PSAwICYmIHRvdWNoLmlzVmVydGljYWwoKSkge1xuICAgICAgICAgIHNldFN0YXR1cyhlYXNlKHRvdWNoLmRlbHRhWSkpO1xuICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogSU4gVEhJUyBDQVNFOlxuICAgICAgICAgICAqIGlmIGNvbXBvbmVudCBkb24ndCByZXJlbmRlciBhZnRlciBldmVudC5wcmV2ZW50RGVmYXVsdFxuICAgICAgICAgICAqIGlvcyB3aWxsIGhvbGQgYHByZXZlbnREZWZhdWx0YCBiZWhhdmlvciB3aGVuIHRvdWNoIG1vdmluZ1xuICAgICAgICAgICAqIGl0IHdpbGwgY2F1c2Ugd2luZG93IHVuU2Nyb2xsYWJsZVxuICAgICAgICAgICAqL1xuICAgICAgICAgIHNldFN0YXR1cygwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgW3JlYWNoVG9wLmN1cnJlbnQsIHRvdWNoLmRlbHRhWSwgaXNUb3VjaGFibGVdLFxuICApO1xuXG4gIGNvbnN0IG9uVG91Y2hFbmQgPSBhc3luYyAoKTogUHJvbWlzZTx2b2lkPiA9PiB7XG4gICAgaWYgKHJlYWNoVG9wLmN1cnJlbnQgJiYgdG91Y2guZGVsdGFZICYmIGlzVG91Y2hhYmxlKCkpIHtcbiAgICAgIHVwZGF0ZVN0YXRlKHsgZHVyYXRpb246ICthbmltYXRpb25EdXJhdGlvbiB9KTtcbiAgICAgIGlmIChzdGF0ZS5zdGF0dXMgPT09ICdsb29zaW5nJykge1xuICAgICAgICBzZXRTdGF0dXMoK2hlYWRIZWlnaHQsIHRydWUpO1xuICAgICAgICBvblJlZnJlc2goKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldFN0YXR1cygwKTtcbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgdXNlRXZlbnRMaXN0ZW5lcigndG91Y2htb3ZlJywgb25Ub3VjaE1vdmUgYXMgRXZlbnRMaXN0ZW5lciwge1xuICAgIHRhcmdldDogdHJhY2suY3VycmVudCxcbiAgICBkZXBlbmRzOiBbcmVhY2hUb3AuY3VycmVudCwgaXNUb3VjaGFibGUoKSwgdG91Y2guZGVsdGFZXSxcbiAgfSk7XG5cbiAgdXNlVXBkYXRlRWZmZWN0KCgpID0+IHtcbiAgICB1cGRhdGVTdGF0ZSh7IGR1cmF0aW9uOiArYW5pbWF0aW9uRHVyYXRpb24gfSk7XG4gICAgaWYgKHN0YXRlLnJlZnJlc2hpbmcpIHtcbiAgICAgIHNldFN0YXR1cygraGVhZEhlaWdodCwgdHJ1ZSk7XG4gICAgfSBlbHNlIGlmIChzdWNjZXNzVGV4dCkge1xuICAgICAgc2hvd1N1Y2Nlc3NUaXAoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2V0U3RhdHVzKDAsIGZhbHNlKTtcbiAgICB9XG4gIH0sIFtzdGF0ZS5yZWZyZXNoaW5nXSk7XG5cbiAgY29uc3QgdHJhY2tTdHlsZSA9IHVzZU1lbW8oXG4gICAgKCkgPT4gKHtcbiAgICAgIHRyYW5zaXRpb25EdXJhdGlvbjogYCR7c3RhdGUuZHVyYXRpb259bXNgLFxuICAgICAgdHJhbnNmb3JtOiBzdGF0ZS5kaXN0YW5jZSA/IGB0cmFuc2xhdGUzZCgwLCR7c3RhdGUuZGlzdGFuY2V9cHgsIDApYCA6ICcnLFxuICAgIH0pLFxuICAgIFtzdGF0ZS5kdXJhdGlvbiwgc3RhdGUuZGlzdGFuY2VdLFxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiByZWY9e3JlZn0gY2xhc3NOYW1lPXtjcyhwcm9wcy5jbGFzc05hbWUsICdwdWxsLXJlZnJlc2gnKX0gc3R5bGU9e3Byb3BzLnN0eWxlfT5cbiAgICAgIDxkaXZcbiAgICAgICAgcmVmPXt0cmFja31cbiAgICAgICAgY2xhc3NOYW1lPVwib2ZhLXB1bGwtcmVmcmVzaF9fdHJhY2tcIlxuICAgICAgICBzdHlsZT17dHJhY2tTdHlsZX1cbiAgICAgICAgb25Ub3VjaFN0YXJ0PXtvblRvdWNoU3RhcnR9XG4gICAgICAgIG9uVG91Y2hFbmQ9e29uVG91Y2hFbmR9XG4gICAgICAgIG9uVG91Y2hDYW5jZWw9e29uVG91Y2hFbmR9XG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib2ZhLXB1bGwtcmVmcmVzaF9faGVhZFwiIHN0eWxlPXtnZXRIZWFkU3R5bGUoKX0+XG4gICAgICAgICAge3JlbmRlclN0YXR1cygpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgICAge3Byb3BzLmNoaWxkcmVufVxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFJlYWN0LmZvcndhcmRSZWY8SFRNTERpdkVsZW1lbnQsIFB1bGxSZWZyZXNoUHJvcHM+KFB1bGxSZWZyZXNoKTtcbiJdLCJuYW1lcyI6WyJfX2dldE93blByb3BTeW1ib2xzIiwiX19oYXNPd25Qcm9wIiwiX19wcm9wSXNFbnVtIiwiX19vYmpSZXN0IiwiY29udGV4dCIsIkdyb3VwQ29udGV4dCIsIl9fZGVmUHJvcCIsIl9fZGVmUHJvcHMiLCJfX2dldE93blByb3BEZXNjcyIsIl9fZGVmTm9ybWFsUHJvcCIsIl9fc3ByZWFkVmFsdWVzIiwiX19zcHJlYWRQcm9wcyIsImdldFJlY3QiLCJMb2FkaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FLQTtBQUNBO0dBQ0EsQ0FBQyxZ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LENBQUMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxJQUFJLENB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
