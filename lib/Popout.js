"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
require("./childWindowMonitor");
var crossBrowserCloneNode_1 = require("./crossBrowserCloneNode");
var generateWindowFeaturesString_1 = require("./generateWindowFeaturesString");
var globalContext = require("./globalContext");
var popoutMap_1 = require("./popoutMap");
function isBrowserIEOrEdge() {
    var userAgent = typeof navigator != 'undefined' && navigator.userAgent ? navigator.userAgent : '';
    return /Edge/.test(userAgent) || /Trident/.test(userAgent);
}
function validateUrl(url) {
    if (!url)
        return;
    var parser = document.createElement('a');
    parser.href = url;
    var current = window.location;
    if ((parser.hostname && current.hostname != parser.hostname) ||
        (parser.protocol && current.protocol != parser.protocol))
        throw new Error("react-popup-component error: cross origin URLs are not supported (window=" + current.protocol + "//" + current.hostname + "; popout=" + parser.protocol + "//" + parser.hostname + ")");
}
function validatePopupBlocker(child) {
    return !child || child.closed || typeof child == 'undefined' || typeof child.closed == 'undefined' ? null : child;
}
function isChildWindowOpened(child) {
    return child && !child.closed;
}
function getWindowName(name) {
    return name || Math.random().toString(12).slice(2);
}
function forEachStyleElement(nodeList, callback, scope) {
    var element;
    for (var i = 0; i < nodeList.length; i++) {
        element = nodeList[i];
        if (element.tagName == 'STYLE')
            callback.call(scope, element, i);
    }
}
var Popout = /** @class */ (function (_super) {
    __extends(Popout, _super);
    function Popout() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.setupAttempts = 0;
        _this.openChildWindow = function () {
            var options = generateWindowFeaturesString_1.default(_this.props.options || {});
            var name = getWindowName(_this.props.name);
            _this.child = validatePopupBlocker(window.open(_this.props.url || "about:blank" + (_this.props.fullscreen ? '?fullscreen' : ''), name, options));
            if (!_this.child) {
                if (_this.props.onBlocked) {
                    _this.props.onBlocked();
                }
                _this.container = null;
            }
            else {
                _this.id = "__" + name + "_container__";
                _this.container = _this.initializeChildWindow(_this.id, _this.child);
                _this.child.document.title = _this.props.title || '';
            }
        };
        _this.closeChildWindowIfOpened = function () {
            if (isChildWindowOpened(_this.child)) {
                if (!_this.props.url) {
                    ReactDOM.unmountComponentAtNode(_this.container);
                }
                _this.child.close();
                _this.child = null;
                if (_this.props.onClose)
                    _this.props.onClose();
            }
        };
        return _this;
    }
    Popout.prototype.componentDidUpdate = function () {
        this.renderChildWindow();
    };
    Popout.prototype.componentDidMount = function () {
        this.renderChildWindow();
    };
    Popout.prototype.componentWillUnmount = function () {
        this.closeChildWindowIfOpened();
    };
    Popout.prototype.render = function () {
        return null;
    };
    Popout.prototype.setupOnCloseHandler = function (id, child) {
        var _this = this;
        // For Edge, IE browsers, the document.head might not exist here yet. We will just simply attempt again when RAF is called
        // For Firefox, on the setTimeout, the child window might actually be set to null after the first attempt if there is a popup blocker
        if (this.setupAttempts >= 5)
            return;
        if (child && child.document && child.document.head) {
            var unloadScriptContainer = child.document.createElement('script');
            var onBeforeUnloadLogic = "\n            window.onbeforeunload = function(e) {\n                var result = window.opener." + globalContext.id + ".onBeforeUnload.call(window, '" + id + "', e);\n\n                if (result) {\n                    window.opener." + globalContext.id + ".startMonitor.call(window.opener, '" + id + "');\n\n                    e.returnValue = result;\n                    return result;\n                } else {\n                    window.opener." + globalContext.id + ".onChildClose.call(window.opener, '" + id + "');\n                }\n            }";
            // Use onload for most URL scenarios to allow time for the page to load first
            // Safari 11.1 is aggressive, so it will call onbeforeunload prior to the page being created.
            unloadScriptContainer.innerHTML = "window.onload = function(e) { " + onBeforeUnloadLogic + " };";
            // For edge and IE, they don't actually execute the onload logic, so we just want the onBeforeUnload logic.
            // If this isn't a URL scenario, we have to bind onBeforeUnload directly too.
            if (isBrowserIEOrEdge() || !this.props.url)
                unloadScriptContainer.innerHTML = onBeforeUnloadLogic;
            child.document.head.appendChild(unloadScriptContainer);
            this.setupCleanupCallbacks();
        }
        else {
            this.setupAttempts++;
            setTimeout(function () { return _this.setupOnCloseHandler(id, child); }, 50);
        }
    };
    Popout.prototype.setupCleanupCallbacks = function () {
        var _this = this;
        // Close the popout if main window is closed.
        window.addEventListener('unload', function () { return _this.closeChildWindowIfOpened(); });
        globalContext.set('onChildClose', function (id) {
            if (popoutMap_1.default[id].props.onClose)
                popoutMap_1.default[id].props.onClose();
        });
        globalContext.set('onBeforeUnload', function (id, evt) {
            if (popoutMap_1.default[id].props.onBeforeUnload)
                return popoutMap_1.default[id].props.onBeforeUnload(evt);
        });
    };
    Popout.prototype.setupStyleElement = function (child) {
        this.styleElement = child.document.createElement('style');
        this.styleElement.setAttribute('data-this-styles', 'true');
        this.styleElement.type = 'text/css';
        child.document.head.appendChild(this.styleElement);
    };
    Popout.prototype.injectHtml = function (id, child) {
        var _a;
        var container;
        if (this.props.html) {
            child.document.write(this.props.html);
            var head = child.document.head;
            var cssText = '';
            var rules = null;
            for (var i = window.document.styleSheets.length - 1; i >= 0; i--) {
                var styleSheet = window.document.styleSheets[i];
                try {
                    rules = styleSheet.cssRules;
                }
                catch (_b) {
                    // We're primarily looking for a security exception here.
                    // See https://bugs.chromium.org/p/chromium/issues/detail?id=775525
                    // Try to just embed the style element instead.
                    var styleElement = child.document.createElement('link');
                    styleElement.type = styleSheet.type;
                    styleElement.rel = 'stylesheet';
                    styleElement.href += styleSheet.href;
                    head.appendChild(styleElement);
                }
                finally {
                    if (rules) {
                        for (var j = 0; j < rules.length; j++) {
                            try {
                                cssText += rules[j].cssText;
                            }
                            catch (_c) {
                                // IE11 will throw a security exception sometimes when accessing cssText.
                                // There's no good way to detect this, so we capture the exception instead.
                            }
                        }
                    }
                }
                rules = null;
            }
            var style = child.document.createElement('style');
            style.innerHTML = cssText;
            head.appendChild(style);
            container = child.document.createElement('div');
            container.id = id;
            child.document.body.appendChild(container);
        }
        else {
            var childHtml = "<!DOCTYPE html><html lang=\"en\"><head>\n<title>" + this.props.title + "</title>";
            for (var i = window.document.styleSheets.length - 1; i >= 0; i--) {
                var styleSheet = window.document.styleSheets[i];
                try {
                    var cssRules = '';
                    for (var i_1 = 0; i_1 < styleSheet.cssRules.length; i_1++)
                        cssRules += styleSheet.cssRules[i_1].cssText + "\n";
                    childHtml += "<style>\n " + cssRules + "</style>";
                }
                catch (_d) {
                    // IE11 will throw a security exception sometimes when accessing cssText.
                    // There's no good way to detect this, so we capture the exception instead.
                }
            }
            childHtml += "</head><body><div id=\"" + id + "\" class=\"" + ((_a = this.props.className) !== null && _a !== void 0 ? _a : 'react-portal-popout-container') + "\"></div></body></html>";
            child.document.write(childHtml);
            container = child.document.getElementById(id);
        }
        // Create a document with the styles of the parent window first
        this.setupStyleElement(child);
        return container;
    };
    Popout.prototype.setupStyleObserver = function (child) {
        // Add style observer for legacy style node additions
        var observer = new MutationObserver(function (mutations) {
            return mutations.forEach(function (mutation) {
                if (mutation.type == 'childList')
                    forEachStyleElement(mutation.addedNodes, function (element) {
                        return child.document.head.appendChild(crossBrowserCloneNode_1.default(element, child.document));
                    });
            });
        });
        var config = { childList: true };
        observer.observe(document.head, config);
    };
    Popout.prototype.initializeChildWindow = function (id, child) {
        popoutMap_1.default[id] = this;
        if (!this.props.url) {
            var container = this.injectHtml(id, child);
            this.setupStyleObserver(child);
            this.setupOnCloseHandler(id, child);
            return container;
        }
        else {
            this.setupOnCloseHandler(id, child);
            return null;
        }
    };
    Popout.prototype.renderChildWindow = function () {
        validateUrl(this.props.url);
        if (!this.props.hidden) {
            if (!isChildWindowOpened(this.child)) {
                this.openChildWindow();
            }
            if (!this.props.url && this.container) {
                ReactDOM.render(this.props.children, this.container);
            }
        }
        else {
            this.closeChildWindowIfOpened();
        }
    };
    return Popout;
}(React.Component));
exports.default = Popout;
//# sourceMappingURL=Popout.js.map