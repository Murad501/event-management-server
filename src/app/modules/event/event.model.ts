import { Schema, model } from "mongoose";
import { EventModel, IEvent } from "./event.interface";

export const eventSchema = new Schema<IEvent, Record<string, never>>(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    },
    eventTime: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    description: {
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

export const Event = model<IEvent, EventModel>("Event", eventSchema);
