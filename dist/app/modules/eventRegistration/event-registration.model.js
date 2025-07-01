"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegistration = exports.eventRegistrationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.eventRegistrationSchema = new mongoose_1.Schema({
    event: {
        type: String,
        required: true,
    },
    user: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.EventRegistration = (0, mongoose_1.model)("EventRegistration", exports.eventRegistrationSchema);
