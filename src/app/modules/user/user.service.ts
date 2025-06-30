/* eslint-disable @typescript-eslint/no-unused-vars */
import httpStatus from "http-status";
import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import ApiError from "../../../errors/ApiError";

const createUser = async (user: IUser) => {
  const isUserExist = await User.findOne({ email: user.email });

  if (isUserExist) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "This Email Already Used. Please use another email",
    );
  }

  const result = await User.create(user);

  if (!result) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed to create User");
  }

  // Generate tokens like in login
  const accessToken = jwtHelpers.createToken(
    { email: result.email, _id: result._id },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.createToken(
    { email: result.email, _id: result._id },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  // Remove password from user data
  const { password, ...userData } = result.toObject ? result.toObject() : result;

  return { accessToken, refreshToken, user: userData };
};

export const UserService = {
  createUser,
};