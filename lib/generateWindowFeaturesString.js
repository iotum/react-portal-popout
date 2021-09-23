"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
function generateWindowFeaturesString(optionsProp) {
    function valueOf(value) {
        if (typeof value === 'boolean')
            return value ? '1' : '0';
        else if (value)
            return String(value);
    }
    var options = {
        left: 0,
        top: 0,
        height: 600,
        width: 800,
        location: false,
        menubar: false,
        resizable: false,
        scrollbars: false,
        status: false,
        toolbar: false
    };
    options = __assign(__assign({}, options), optionsProp);
    return Object.getOwnPropertyNames(options)
        .map(function (key) { return key + "=" + valueOf(options[key]); })
        .join(',');
}
exports.default = generateWindowFeaturesString;
//# sourceMappingURL=generateWindowFeaturesString.js.map