import {
  type CalendarEventStorage,
  defaultValuesStorage,
} from "@/constants/calendarEvent";
import { useLocalStorage } from "usehooks-ts";
import { sortDateAscend } from "../utils/sort";

export const useCalendarEvent = () => {
  const [calendarEvent, setCalendarEvent] =
    useLocalStorage<CalendarEventStorage>(
      "calendarEvent",
      defaultValuesStorage
    );

  const addEvent = (
    field: keyof CalendarEventStorage,
    value: any,
    key?: string
  ) => {
    setCalendarEvent((prev) => {
      if (field === "workTimes") {
        const prevField = prev[field] ?? [];
        return {
          ...prev,
          [field]: [...prevField, value],
        };
      }

      if (field === "workers") {
        const prevField = prev[field] ?? [];
        return {
          ...prev,
          [field]: [...prevField, ...value],
        };
      }

      if (field === "vacations" && key) {
        const prevField = prev[field] ?? {};
        const newField = sortDateAscend([
          ...new Set([...(prevField[key] ?? []), ...value]),
        ]);

        return {
          ...prev,
          [field]: {
            ...prevField,
            [key]: newField,
          },
        };
      }

      return prev;
    });
  };

  /**
   *
   * @param field 삭제하고자 하는 객체의 키
   * @param target  field 내에서 삭제하고자 하는 target
   */
  const deleteEvent = (
    field: keyof CalendarEventStorage,
    target: any,
    option?: { deleteTargetValue: string }
  ) => {
    setCalendarEvent((prev) => {
      if (field === "workTimes") {
        const prevField = prev[field];
        const newField = prevField.filter(
          (_prevField) => _prevField.alias !== target
        );
        return { ...prev, [field]: newField };
      }

      if (field === "workers") {
        const prevField = prev[field];
        const newField = prevField.filter(
          (_prevField) => _prevField !== target
        );
        return { ...prev, [field]: newField };
      }

      if (field === "vacations") {
        const prevField = prev[field];
        const newField = Object.keys(prevField).reduce((acc, key) => {
          if (key === target) {
            if (option?.deleteTargetValue) {
              const newFieldValue = prevField[key].filter(
                (v) => v !== option.deleteTargetValue
              );

              return !newFieldValue.length
                ? acc
                : {
                    ...acc,
                    [key]: newFieldValue,
                  };
            }
            return acc;
          }
          return {
            ...acc,
            [key]: prevField[key as keyof CalendarEventStorage],
          };
        }, {});

        return { ...prev, [field]: newField };
      }

      return prev;
    });
  };

  return { calendarEvent, addEvent, deleteEvent };
};
