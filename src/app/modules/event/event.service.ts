import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { IEvent, IEventFilters } from "./event.interface";
import { Event } from "./event.model";
import { IPaginationOptions } from "../../interfaces/pagination";
import { IGenericResponse } from "../../interfaces/common";
import { PaginationHelpers } from "../../helpers/paginationHelpers";
import { eventSearchableFields } from "./event.constant";

const createEvent = async (payload: IEvent) => {
  const result = Event.create(payload);

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to create event"
    );
  }

  return result;
};
const updateEvent = async (payload: Partial<IEvent>, id: string) => {
  const result = Event.findByIdAndUpdate(id, payload);

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update event"
    );
  }

  return result;
};
const deleteEvent = async (id: string) => {
  const result = Event.findByIdAndDelete(id);

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to delete event"
    );
  }

  return result;
};
const getEvent = async (id: string) => {
  const result = await Event.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
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
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  return result[0];
};

const getMyEvents = async (
  userEmail: string,
  filters: IEventFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IEvent[]>> => {
  // Extract searchTerm to implement search query
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  // Add user filter to get only events created by this user
  andConditions.push({ user: userEmail });

  // Search needs $or for searching in specified fields
  if (searchTerm) {
    andConditions.push({
      $or: eventSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }

  if (Object.keys(filtersData).length) {
    const eventTimeConditions: Record<string, Date> = {};
    const otherConditions: Record<string, unknown>[] = [];

    for (const [field, value] of Object.entries(filtersData)) {
      if (field === "startTime") {
        eventTimeConditions["$gte"] = new Date(value);
      } else if (field === "endTime") {
        eventTimeConditions["$lte"] = new Date(value);
      } else {
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
  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1;
  } else {
    // Default sort by eventTime in ascending order (earliest events first)
    sortConditions["eventTime"] = 1;
  }

  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const total = await Event.countDocuments(whereConditions);

  const result = await Event.aggregate([
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
};

const getAllEvents = async (
  filters: IEventFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IEvent[]>> => {
  const { searchTerm, ...filtersData } = filters;
  const { page, limit, skip, sortBy, sortOrder } =
    PaginationHelpers.calculatePagination(paginationOptions);

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      $or: eventSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: "i",
        },
      })),
    });
  }


  if (Object.keys(filtersData).length) {
    const eventTimeConditions: Record<string, Date> = {};
    const otherConditions: Record<string, unknown>[] = [];

    for (const [field, value] of Object.entries(filtersData)) {
      if (field === "startTime") {
        eventTimeConditions["$gte"] = new Date(value);
      } else if (field === "endTime") {
        eventTimeConditions["$lte"] = new Date(value);
      } else {
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

  const sortConditions: { [key: string]: 1 | -1 } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1;
  } else {
    // Default sort by eventTime in ascending order (earliest events first)
    sortConditions["eventTime"] = 1;
  }
  const whereConditions =
    andConditions.length > 0 ? { $and: andConditions } : {};

  const total = await Event.countDocuments(whereConditions);

  const result = await Event.aggregate([
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
};

export const EventService = {
  createEvent,
  getAllEvents,
  getMyEvents,
  getEvent,
  deleteEvent,
  updateEvent,
};
