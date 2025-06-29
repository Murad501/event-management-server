import { Schema, model } from "mongoose";
import { IUser, IUserMethods, UserModel } from "./user.interface";
import { compare, hash } from "bcrypt";
import config from "../../../config";

export const userSchema = new Schema<
  IUser,
  Record<string, never>,
  IUserMethods
>(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

userSchema.methods.isUserExist = async function (
  email,
): Promise<Partial<IUser> | null> {
  const user = await User.findOne({ email }, { _id: 1, password: 1 });

  return user;
};

userSchema.methods.isPasswordMatched = async function (
  givenPassword,
  savedPassword,
): Promise<boolean> {
  const isMatched = await compare(givenPassword, savedPassword);
  return isMatched;
};

userSchema.pre("save", async function (next) {
  // hashing password
  this.password = await hash(this.password, Number(config.bcrypt_salt_round));

  next();
});

export const User = model<IUser, UserModel>("User", userSchema);