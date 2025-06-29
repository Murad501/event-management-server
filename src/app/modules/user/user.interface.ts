import { Model } from "mongoose";


export type IUser = {
  name: string;
  password: string;
  email: string;
  photoUrl: string;
};

export type IUserMethods = {
  isPasswordMatched(
    givenPassword: string,
    savedPassword: string,
  ): Promise<boolean>;
  isUserExist(phoneNumber: string): Promise<Partial<IUser> | null>;
};

export type UserModel = Model<IUser, Record<string, unknown>, IUserMethods>;

export type IUserFilters = {
  email?: string;
  name?: string;
};