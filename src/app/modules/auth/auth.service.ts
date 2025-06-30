import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { ILoginData, IRefreshTokenResponse } from "./auth.interface";
import ApiError from "../../../errors/ApiError";
import httpStatus from "http-status";
import { User } from "../user/user.model";


const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  let verifiedToken = null;

  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    );
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid refresh token");
  }

  const { email } = verifiedToken;

  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, "User does not exist");
  }

  //generate token
  const newAccessToken = jwtHelpers.createToken(
    { _id: isUserExist._id, email: isUserExist.email },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string,
  );

  return {
    accessToken: newAccessToken,
  };
};

const userLogin = async (payload: ILoginData) => {
  const user = new User();

  const result = await User.findOne(
    { email: payload.email },
    { password: 1, _id: 1, email: 1, name: 1, photoUrl: 1 },
  );
  if (!result) {
    throw new ApiError(httpStatus.NOT_FOUND, "User Does Not Exist");
  }

  const isMatchedPassword = await user.isPasswordMatched(
    payload.password,
    result.password,
  );

  if (!isMatchedPassword) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Credential");
  }

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

  return { accessToken, refreshToken, user:result };
};

export const AuthService = { refreshToken, userLogin };