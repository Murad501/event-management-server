import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";

import sendResponse from "../../../shared/sendResponse";
import { UserService } from "./user.service";
import config from "../../../config";

const CreateUser = catchAsync(async (req, res) => {
  const userData = req.body;
  const result = await UserService.createUser(userData);
  const { refreshToken, ...rest } = result;
  res.cookie("refreshToken", refreshToken, {
    httpOnly: config.env === "production",
    secure: true,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User created successfully",
    data: rest,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Users retrieved successfully",
    data: "",
  });
});

export const UserController = {
  getAllUsers,
  CreateUser,
};
