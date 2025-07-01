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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const mongoose_1 = __importDefault(require("mongoose"));
const event_model_1 = require("./event.model");
const paginationHelpers_1 = require("../../helpers/paginationHelpers");
const event_constant_1 = require("./event.constant");
const createEvent = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = event_model_1.Event.create(payload);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to create event");
    }
    return result;
});
const updateEvent = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = event_model_1.Event.findByIdAndUpdate(id, payload);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to update event");
    }
    return result;
});
const deleteEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = event_model_1.Event.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, "Failed to delete event");
    }
    return result;
});
const getEvent = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield event_model_1.Event.aggregate([
        { $match: { _id: new mongoose_1.default.Types.ObjectId(id) } },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "email",
                as: "userData",
            },
        },
        { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "eventregistrations",
                let: { eventId: { $toString: "$_id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$event", "$$eventId"] },
                        },
                    },
                ],
                as: "registrations",
            },
        },
        {
            $addFields: {
                registrationCount: { $size: "$registrations" },
            },
        },
        {
            $project: {
                registrations: 0,
            },
        },
    ]);
    if (!result || result.length === 0) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, "Event not found");
    }
    return result[0];
});
const getMyEvents = (userEmail, filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract searchTerm to implement search query
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.PaginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    // Add user filter to get only events created by this user
    andConditions.push({ user: userEmail });
    // Search needs $or for searching in specified fields
    if (searchTerm) {
        andConditions.push({
            $or: event_constant_1.eventSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        const eventTimeConditions = {};
        const otherConditions = [];
        for (const [field, value] of Object.entries(filtersData)) {
            if (field === "startTime") {
                eventTimeConditions["$gte"] = new Date(value);
            }
            else if (field === "endTime") {
                eventTimeConditions["$lte"] = new Date(value);
            }
            else {
                otherConditions.push({ [field]: value });
            }
        }
        // Add eventTime range conditions if any exist
        if (Object.keys(eventTimeConditions).length > 0) {
            andConditions.push({ eventTime: eventTimeConditions });
        }
        // Add other filter conditions
        if (otherConditions.length) {
            andConditions.push(...otherConditions);
        }
    }
    // Dynamic Sort needs field to do sorting
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }
    else {
        // Default sort by eventTime in ascending order (earliest events first)
        sortConditions["eventTime"] = 1;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const total = yield event_model_1.Event.countDocuments(whereConditions);
    const result = yield event_model_1.Event.aggregate([
        { $match: whereConditions },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "email",
                as: "userData",
            },
        },
        { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "eventregistrations",
                let: { eventId: { $toString: "$_id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$event", "$$eventId"] },
                        },
                    },
                ],
                as: "registrations",
            },
        },
        {
            $addFields: {
                registrationCount: { $size: "$registrations" },
            },
        },
        {
            $project: {
                registrations: 0, // Remove the registrations array from final result
            },
        },
        { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit },
    ]);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
const getAllEvents = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters, ["searchTerm"]);
    const { page, limit, skip, sortBy, sortOrder } = paginationHelpers_1.PaginationHelpers.calculatePagination(paginationOptions);
    const andConditions = [];
    if (searchTerm) {
        andConditions.push({
            $or: event_constant_1.eventSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: "i",
                },
            })),
        });
    }
    if (Object.keys(filtersData).length) {
        const eventTimeConditions = {};
        const otherConditions = [];
        for (const [field, value] of Object.entries(filtersData)) {
            if (field === "startTime") {
                eventTimeConditions["$gte"] = new Date(value);
            }
            else if (field === "endTime") {
                eventTimeConditions["$lte"] = new Date(value);
            }
            else {
                otherConditions.push({ [field]: value });
            }
        }
        if (Object.keys(eventTimeConditions).length > 0) {
            andConditions.push({ eventTime: eventTimeConditions });
        }
        if (otherConditions.length) {
            andConditions.push(...otherConditions);
        }
    }
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }
    else {
        // Default sort by eventTime in ascending order (earliest events first)
        sortConditions["eventTime"] = 1;
    }
    const whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const total = yield event_model_1.Event.countDocuments(whereConditions);
    const result = yield event_model_1.Event.aggregate([
        { $match: whereConditions },
        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "email",
                as: "userData",
            },
        },
        { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "eventregistrations",
                let: { eventId: { $toString: "$_id" } },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ["$event", "$$eventId"] },
                        },
                    },
                ],
                as: "registrations",
            },
        },
        {
            $addFields: {
                registrationCount: { $size: "$registrations" },
            },
        },
        {
            $project: {
                registrations: 0,
            },
        },
        { $sort: sortConditions },
        { $skip: skip },
        { $limit: limit },
    ]);
    return {
        meta: {
            page,
            limit,
            total,
        },
        data: result,
    };
});
exports.EventService = {
    createEvent,
    getAllEvents,
    getMyEvents,
    getEvent,
    deleteEvent,
    updateEvent,
};
