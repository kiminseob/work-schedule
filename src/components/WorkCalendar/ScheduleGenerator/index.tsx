import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { EventAvailable, EventBusy, HelpOutline } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { CalendarContext } from "../index";
import { useContext } from "react";
import dayjs from "dayjs";

export const ScheduleGenerator = () => {
  const { date, event } = useContext(CalendarContext);
  const { calendarEvent } = useCalendarEvent();
  const { workTimes, workers, vacations } = calendarEvent;
  const notReady = !workTimes.length || !workers.length;

  const generateSchedule = () => {
    const _dayjs = dayjs(date);
    const startDate = _dayjs.startOf("month").date();
    const endDate = _dayjs.endOf("month").date();
    const weekdays = [];

    for (let _date = startDate; _date <= endDate; ++_date) {
      const day = _dayjs.set("date", _date).day();

      if (day % 6 === 0) continue;

      const isHoliday = event.some((v) => v.start?.getDate() === _date);
      if (isHoliday) continue;

      weekdays.push(_date);
    }

    console.log(calendarEvent);
  };

  return (
    <Box display="flex" justifyContent="center">
      <Button
        disabled={notReady}
        endIcon={notReady ? <EventBusy /> : <EventAvailable />}
        onClick={generateSchedule}
      >
        당직 스켸줄 생성
      </Button>

      <Tooltip title="당직 스케줄을 생성 합니다. 당직 시간 및 근무자를 추가하면 활성화 됩니다.">
        <HelpOutline
          fontSize="small"
          color={notReady ? "disabled" : "success"}
        />
      </Tooltip>
    </Box>
  );
};
