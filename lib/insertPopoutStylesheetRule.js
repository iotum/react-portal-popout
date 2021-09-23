"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var popoutMap_1 = require("./popoutMap");
function insertPopoutStylesheetRule(rule) {
    Object.keys(popoutMap_1.default).forEach(function (popoutKey) {
        var popout = popoutMap_1.default[popoutKey];
        if (popout.child && popout.styleElement) {
            try {
                var sheet = popout.styleElement.sheet;
                sheet === null || sheet === void 0 ? void 0 : sheet.insertRule(rule, sheet === null || sheet === void 0 ? void 0 : sheet.cssRules.length);
            }
            catch (e) {
                /* no-op on errors */
            }
        }
    });
}
exports.default = insertPopoutStylesheetRule;
//# sourceMappingURL=insertPopoutStylesheetRule.js.map