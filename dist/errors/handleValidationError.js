"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleValidationError = (error) => {
    const errors = Object.values(error.errors).map((el) => {
        return {
            path: el.path,
            message: el.message,
        };
    });
    return {
        statusCode: 500,
        message: "Validation Error",
        errorMessages: errors,
    };
};
exports.default = handleValidationError;
