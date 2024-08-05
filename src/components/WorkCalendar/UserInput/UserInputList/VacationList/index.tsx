import { CalendarContext } from "@/components/WorkCalendar";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { Chip } from "@mui/material";
import { useContext } from "react";

type VacationListProps = {
  worker: string;
};
export const VacationList = (props: VacationListProps) => {
  const { worker } = props;
  const { date } = useContext(CalendarContext);
  const { calendarEvent, deleteEvent } = useCalendarEvent();

  const deleteVacation = (...rest: [[string, string]]) => {
    const [[worker, vacation]] = rest;
    deleteEvent("vacations", worker, { deleteTargetValue: vacation });
  };

  const getVacationList = () => {
    const map = new Map();
    const vacations = calendarEvent.vacations?.[worker]?.filter(
      (vacation: string) => {
        const [year, month] = vacation.split("-");
        return (
          date.getFullYear() === Number(year) &&
          date.getMonth() + 1 === Number(month)
        );
      }
    );

    return vacations?.reduce((acc: string[], cur, idx) => {
      if (idx === 0) {
        return [...acc, cur];
      }
      const vacationGroup = map.get("vacationGroup");
      const last = acc.slice(-1)[0];
      const [, , prevDay] = vacationGroup
        ? vacationGroup[1].split("-")
        : last.split("-");
      const [, , curDay] = cur.split("-");

      if (Number(prevDay) + 1 === Number(curDay)) {
        const prev = map.has("vacationGroup") ? vacationGroup[0] : acc.pop();
        map.set("vacationGroup", [prev, cur]);
        return idx === vacations.length - 1
          ? [...acc, `${prev} ~ ${cur}`]
          : acc;
      } else {
        if (map.has("vacationGroup")) {
          const groupedVacation = `${vacationGroup[0]} ~ ${vacationGroup[1]}`;
          map.clear();
          return [...acc, groupedVacation, cur];
        }
        return [...acc, cur];
      }
    }, []);
  };

  return (
    <>
      {getVacationList()?.map((vacation) => (
        <Chip
          key={vacation}
          label={vacation}
          size="small"
          onDelete={deleteVacation.bind(null, [worker, vacation])}
        />
      ))}
    </>
  );
};
