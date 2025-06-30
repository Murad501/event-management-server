import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { EventRegisterService } from "./event-registration.service";

const Register = catchAsync(async (req, res) => {
  const eventData = req.body;
  const user = req?.user;
  eventData.user = user;
  const result = await EventRegisterService.RegisterEvent(eventData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration successfully",
    data: result,
  });
});

const RemoveRegister = catchAsync(async (req, res) => {
  const eventData = req.body;
  const user = req?.user;
  eventData.user = user;
  const result = await EventRegisterService.RemoveRegistration(eventData);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration Removed successfully",
    data: result,
  });
});

export const EventRegistrationController = {
  RemoveRegister,
  Register,
};
