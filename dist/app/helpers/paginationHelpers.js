"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationHelpers = void 0;
const calculatePagination = (options) => {
    const page = Number(options.page || 1);
    const limit = Number(options.limit || 10);
    const skip = (page - 1) * limit;
    const sortBy = options.sortBy || "eventTime" || "createdAt";
    const sortOrder = options.sortOrder || "asc";
    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
exports.PaginationHelpers = {
    calculatePagination,
};
