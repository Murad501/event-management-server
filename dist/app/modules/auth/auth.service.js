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
exports.AuthService = void 0;
const config_1 = __importDefault(require("../../../config"));
const jwtHelpers_1 = require("../../helpers/jwtHelpers");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("../user/user.model");
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.jwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Invalid refresh token");
    }
    const { email } = verifiedToken;
    const isUserExist = yield user_model_1.User.findOne({ email });
    if (!isUserExist) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User does not exist");
    }
    //generate token
    const newAccessToken = jwtHelpers_1.jwtHelpers.createToken({ _id: isUserExist._id, email: isUserExist.email }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return {
        accessToken: newAccessToken,
    };
});
const userLogin = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_model_1.User();
    const result = yield user_model_1.User.findOne({ email: payload.email }, { password: 1, _id: 1, email: 1, name: 1, photoUrl: 1 });
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "User Does Not Exist");
    }
    const isMatchedPassword = yield user.isPasswordMatched(payload.password, result.password);
    if (!isMatchedPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Wrong Credential");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.createToken({ email: result.email, _id: result._id }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    const refreshToken = jwtHelpers_1.jwtHelpers.createToken({ email: result.email, _id: result._id }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    return { accessToken, refreshToken, user: result };
});
exports.AuthService = { refreshToken, userLogin };
