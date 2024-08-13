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
    option?: { key: string; childTargetField?: string }
  ) => {
    setCalendarEvent((prev) => {
      if (field === "assined" && option?.key) {
        const prevField = prev[field] ?? {};

        return {
          ...prev,
          [field]: {
            ...prevField,
            [option.key]: value,
          },
        };
      }
      if (field === "event" && option?.key) {
        const prevField = prev[field] ?? {};

        return {
          ...prev,
          [field]: {
            ...prevField,
            [option.key]: value,
          },
        };
      }

      if (field === "workTimes") {
        const prevField = prev[field] ?? [];

        if (option?.childTargetField && option?.key) {
          const newField = prevField.map((_prevField) =>
            _prevField.alias === option.childTargetField
              ? { ..._prevField, outsider: [..._prevField.outsider, ...value] }
              : _prevField
          );
          return {
            ...prev,
            [field]: newField,
          };
        }

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

      if (field === "vacations" && option?.key) {
        const prevField = prev[field] ?? {};
        const newField = sortDateAscend([
          ...new Set([...(prevField[option.key] ?? []), ...value]),
        ]);

        return {
          ...prev,
          [field]: {
            ...prevField,
            [option.key]: newField,
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
      if (field === "event") {
        const prevField = prev[field];
        delete prevField[target];
        return { ...prev, [field]: prevField };
      }

      if (field === "workTimes") {
        const prevField = prev[field];

        if (option?.deleteTargetValue) {
          const newField = prevField.map((_prevField) => {
            if (_prevField.alias === target) {
              const newChildField = _prevField.outsider.filter(
                (_outsider) => _outsider !== option.deleteTargetValue
              );
              return { ..._prevField, outsider: newChildField };
            }
            return _prevField;
          });
          return { ...prev, [field]: newField };
        }

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
              const newFieldValue = prevField[key].filter((_prevField) => {
                const [y, m, d] = _prevField.split("-");

                if (option.deleteTargetValue.includes("~")) {
                  const [start, end] = option.deleteTargetValue.split("~");
                  const [groupY, groupM, startD] = start.trim().split("-");
                  const [, , endD] = end.trim().split("-");

                  if (y === groupY && m === groupM) {
                    return !(
                      Number(d) >= Number(startD) && Number(d) <= Number(endD)
                    );
                  } else {
                    return true;
                  }
                } else {
                  return _prevField !== option.deleteTargetValue;
                }
              });

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
