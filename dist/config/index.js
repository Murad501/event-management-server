"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.default = {
    env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    database_url: process.env.DB_URL,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
    jwt: {
        secret: process.env.JWT_SECRET,
        expires_in: process.env.JWT_EXPIRE_IN,
        refresh_secret: process.env.JWT_REFRESH_SECRET,
        refresh_expires_in: process.env.JWT_REFRESH_EXPIRE_IN,
    },
};
