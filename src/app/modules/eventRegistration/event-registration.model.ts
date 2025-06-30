import { Schema, model } from "mongoose";
import {
  EventRegistrationModel,
  IEventRegistration,
} from "./event-registration.interface";

export const eventRegistrationSchema = new Schema<
  IEventRegistration,
  Record<string, never>
>(
  {
    event: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  }
);

export const EventRegistration = model<
  IEventRegistration,
  EventRegistrationModel
>("EventRegistration", eventRegistrationSchema);
