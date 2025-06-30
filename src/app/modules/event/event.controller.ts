import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { EventService } from "./event.service";
import pick from "../../../shared/pick";
import { paginationFields } from "../../../constants/pagination";
import { Request, Response } from "express";
import { IEvent } from "./event.interface";
import { eventFilterableFields } from "./event.constant";

const CreateEvent = catchAsync(async (req, res) => {
  const eventData = req.body;
  const user = req?.user;
  eventData.user = user;
  const result = await EventService.createEvent(eventData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event created successfully",
    data: result,
  });
});
const GetEvent = catchAsync(async (req, res) => {
  const id = req.params?.id;
  const result = await EventService.getEvent(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event fetched successfully",
    data: result,
  });
});
const deleteEvent = catchAsync(async (req, res) => {
  const id = req.params?.id;
  const result = await EventService.deleteEvent(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event deleted successfully",
    data: result,
  });
});
const UpdateEvent = catchAsync(async (req, res) => {
  const eventData = req.body;
  const id = req.params?.id;
  const result = await EventService.updateEvent(eventData, id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Event updated successfully",
    data: result,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, eventFilterableFields);
  const paginationOptions = pick(req.query, paginationFields);

  const result = await EventService.getAllEvents(filters, paginationOptions);

  sendResponse<IEvent[]>(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "events fetched successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const EventController = {
  CreateEvent,
  getAllEvents,
  UpdateEvent,
  GetEvent,
  deleteEvent,
};
