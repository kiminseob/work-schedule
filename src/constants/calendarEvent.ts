import { Dayjs } from "dayjs";
import type { Event } from "react-big-calendar";

export type CalendarEventStorage = {
  workers: string[];
  vacations: Record<string, string[]>;
  workTimes: {
    startTime: string;
    endTime: string;
    alias: string;
    numOfWorkers: number;
    max: number;
    outsider: string[];
  }[];
  event: { [date: string]: Event[] };
  assined: {
    [date: string]: {
      [worker: string]: {
        workTimesCnt: { [_workTime: string]: number };
      };
    };
  };
};

export type CalendarEventForm = {
  workers: { value: string }[];
  vacations: { value: string }[];
  workTimes: {
    startTime: Dayjs | null;
    endTime: Dayjs | null;
    alias: string;
    numOfWorkers: number;
    max: number;
    outsider: string[];
  };
};

export const defaultValuesStorage: CalendarEventStorage = {
  workers: [],
  vacations: {},
  workTimes: [],
  event: {},
  assined: {},
};

export const defaultValuesForm: CalendarEventForm = {
  workers: [],
  vacations: [],
  workTimes: {
    startTime: null,
    endTime: null,
    alias: "",
    numOfWorkers: 1,
    max: 0,
    outsider: [],
  },
};
