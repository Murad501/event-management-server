"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userFilterableFields = exports.userSearchableFields = exports.nonUpdateData = void 0;
exports.nonUpdateData = ["password"];
exports.userSearchableFields = [
    "name.firstName",
    "name.lastName",
    "email",
];
exports.userFilterableFields = [
    "searchTerm",
    "name.firstName",
    "name.lastName",
    "email",
];
