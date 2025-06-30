import { Model } from "mongoose";

export type IEvent = {
  title: string;
  user: string;
  eventTime: Date;
  location: string;
  description: string;
};

export type EventModel = Model<IEvent, Record<string, unknown>>;

export type IEventFilters = {
  searchTerm?: string;
  startTime?: string;
  endTime?: string;
};
