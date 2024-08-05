import { Dayjs } from 'dayjs';

export type CalendarEventStorage = {
	workers: string[];
	vacations: Record<string, string[]>;
};

export type CalendarEventForm = {
	workers: { value: string }[];
	vacations: { value: string }[];
	workTimes: {
		startTime: Dayjs | null;
		endTime: Dayjs | null;
		alias: string;
		numOfWorkers: number;
		max?: number;
	};
};

export const defaultValuesStorage: CalendarEventStorage = {
	workers: [],
	vacations: {},
};

export const defaultValuesForm: CalendarEventForm = {
	workers: [],
	vacations: [],
	workTimes: { startTime: null, endTime: null, alias: '', numOfWorkers: 1 },
};
