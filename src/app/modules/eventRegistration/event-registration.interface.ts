import { Model } from "mongoose";

export type IEventRegistration = {
  user: string;
  event: string;
};

export type EventRegistrationModel = Model<
  IEventRegistration,
  Record<string, unknown>
>;
