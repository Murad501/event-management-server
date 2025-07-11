import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { IEventRegistration } from "./event-registration.interface";
import { EventRegistration } from "./event-registration.model";
import { Event } from "../event/event.model";

const RegisterEvent = async (payload: IEventRegistration) => {
  const event = await Event.findById(payload.event);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Event not found");
  }

  const isFound = await EventRegistration.findOne(payload);
  if (isFound) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "already registered");
  }
  const result = await EventRegistration.create(payload);

  if (!result) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to register");
  }

  return result;
};
const RemoveRegistration = async (payload: {event:string, user:string}) => {
  const event = await EventRegistration.findOne(payload);
  if (!event) {
    throw new ApiError(httpStatus.NOT_FOUND, "Registration not found");
  }
  const result = await EventRegistration.findOneAndDelete(payload);

  if (!result) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to remove register"
    );
  }

  return result;
};
const CheckRegistration = async (payload: IEventRegistration) => {
  const registration = await EventRegistration.findOne(payload);
  
  return {
    isRegistered: !!registration,
    registration: registration || null
  };
};

export const EventRegisterService = { RegisterEvent, RemoveRegistration, CheckRegistration };
