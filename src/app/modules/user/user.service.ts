import httpStatus from "http-status";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import ApiError from "../../../errors/ApiError";

const createUser = async (user: IUser): Promise<IUser | null> => {
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

  return result;
};

export const UserService = {
  createUser,
};