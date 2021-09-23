"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function crossBrowserCloneNode(element, targetDocument) {
    var cloned = targetDocument.createElement(element.tagName);
    cloned.innerHTML = element.innerHTML;
    if (element.hasAttributes()) {
        var attribute = void 0;
        for (var i = 0; i < element.attributes.length; i++) {
            attribute = element.attributes[i];
            cloned.setAttribute(attribute.name, attribute.value);
        }
    }
    return cloned;
}
exports.default = crossBrowserCloneNode;
//# sourceMappingURL=crossBrowserCloneNode.js.map