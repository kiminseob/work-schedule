import { Dayjs } from "dayjs";

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
