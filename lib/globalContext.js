"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = exports.get = exports.set = void 0;
var id = '__$$REACT_POPOUT_COMPONENT$$__';
exports.id = id;
function set(key, value) {
    window[id] = window[id] || {};
    window[id][key] = value;
}
exports.set = set;
function get(key) {
    return window[id] && window[id][key];
}
exports.get = get;
//# sourceMappingURL=globalContext.js.map