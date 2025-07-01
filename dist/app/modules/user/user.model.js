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
exports.User = exports.userSchema = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = require("bcrypt");
const config_1 = __importDefault(require("../../../config"));
exports.userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        select: 0,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    photoUrl: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.userSchema.methods.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield exports.User.findOne({ email }, { _id: 1, password: 1 });
        return user;
    });
};
exports.userSchema.methods.isPasswordMatched = function (givenPassword, savedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        const isMatched = yield (0, bcrypt_1.compare)(givenPassword, savedPassword);
        return isMatched;
    });
};
exports.userSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // hashing password
        this.password = yield (0, bcrypt_1.hash)(this.password, Number(config_1.default.bcrypt_salt_round));
        next();
    });
});
exports.User = (0, mongoose_1.model)("User", exports.userSchema);
