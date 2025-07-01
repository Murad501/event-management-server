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
exports.EventRegistrationController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const event_registration_service_1 = require("./event-registration.service");
const Register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventData = req.body;
    const user = req === null || req === void 0 ? void 0 : req.user;
    eventData.user = user;
    const result = yield event_registration_service_1.EventRegisterService.RegisterEvent(eventData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Registration successfully",
        data: result,
    });
}));
const RemoveRegister = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventData = req.body;
    const user = req === null || req === void 0 ? void 0 : req.user;
    eventData.user = user;
    const result = yield event_registration_service_1.EventRegisterService.RemoveRegistration(eventData);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Registration Removed successfully",
        data: result,
    });
}));
const CheckRegistration = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { event } = req.params;
    const user = req === null || req === void 0 ? void 0 : req.user;
    const payload = {
        event,
        user: user
    };
    const result = yield event_registration_service_1.EventRegisterService.CheckRegistration(payload);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.isRegistered ? "User is registered for this event" : "User is not registered for this event",
        data: result,
    });
}));
exports.EventRegistrationController = {
    RemoveRegister,
    Register,
    CheckRegistration,
};
