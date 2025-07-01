"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventRegisterService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const event_registration_model_1 = require("./event-registration.model");
const event_model_1 = require("../event/event.model");
const RegisterEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_model_1.Event.findById(payload.event);
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    const isFound = yield event_registration_model_1.EventRegistration.findOne(payload);
    if (isFound) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "already registered");
    }
    const result = yield event_registration_model_1.EventRegistration.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to register");
    }
    return result;
});
const RemoveRegistration = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const event = yield event_registration_model_1.EventRegistration.findOne(payload);
    if (!event) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Registration not found");
    }
    const result = yield event_registration_model_1.EventRegistration.findOneAndDelete(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to remove register");
    }
    return result;
});
const CheckRegistration = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const registration = yield event_registration_model_1.EventRegistration.findOne(payload);
    return {
        isRegistered: !!registration,
        registration: registration || null
    };
});
exports.EventRegisterService = { RegisterEvent, RemoveRegistration, CheckRegistration };
