"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.filterOnlyObjectProperties = void 0;
function filterOnlyObjectProperties(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([k]) => isNaN(k)));
}
exports.filterOnlyObjectProperties = filterOnlyObjectProperties;
