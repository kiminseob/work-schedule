export type CalendarEventStorage = {
  workers: string[];
  vacations: Record<string, string[]>;
};

export type CalendarEventForm = {
  workers: { value: string }[];
  vacations: { value: string }[];
};

export const defaultValuesStorage: CalendarEventStorage = {
  workers: [],
  vacations: {},
};

export const defaultValuesForm: CalendarEventForm = {
  workers: [],
  vacations: [],
};
