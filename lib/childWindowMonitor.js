"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var globalContext = require("./globalContext");
var popoutMap_1 = require("./popoutMap");
var monitors = {};
var delay = 250; // ms
function stop(id) {
    if (monitors[id]) {
        clearTimeout(monitors[id]);
        delete monitors[id];
    }
}
function start(id) {
    function monitor() {
        if (popoutMap_1.default[id] && popoutMap_1.default[id].props.onClose) {
            if (!popoutMap_1.default[id].child || popoutMap_1.default[id].child.closed) {
                stop(id);
                popoutMap_1.default[id].props.onClose();
                popoutMap_1.default[id].child = null;
            }
            else {
                monitors[id] = setTimeout(monitor, delay);
            }
        }
    }
    monitors[id] = setTimeout(monitor, delay);
}
globalContext.set('startMonitor', start);
//# sourceMappingURL=childWindowMonitor.js.map