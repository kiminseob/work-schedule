import {
  type CalendarEventStorage,
  defaultValuesStorage,
} from "@/constants/calendarEvent";
import { useLocalStorage } from "usehooks-ts";
import { sortDateAscend } from "../utils/sort";
import { isArray, isObject } from "../utils/type";

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
      const prevField = prev[field];

      if (isArray(prevField)) {
        const _prevField = prevField ?? [];
        return {
          ...prev,
          [field]: [..._prevField, ...value],
        };
      } else if (isObject(prevField) && key) {
        const _prevField = prevField ?? {};
        const newField = sortDateAscend([
          ...new Set([...(_prevField[key] ?? []), ...value]),
        ]);

        return {
          ...prev,
          [field]: {
            ..._prevField,
            [key]: newField,
          },
        };
      } else {
        return {
          ...prev,
          [field]: value,
        };
      }
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
      const prevField = prev[field];

      if (isArray(prevField)) {
        const newField = prevField.filter((prevField) => prevField !== target);
        return { ...prev, [field]: newField };
      } else if (isObject(prevField)) {
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
      } else {
        const newField = Object.keys(prev).reduce((acc, key) => {
          if (key === field) {
            return acc;
          }
          return { ...acc, [key]: prev[key as keyof CalendarEventStorage] };
        }, defaultValuesStorage);

        return newField;
      }
    });
  };

  return { calendarEvent, addEvent, deleteEvent };
};
