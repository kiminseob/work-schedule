import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { EventAvailable, EventBusy, HelpOutline } from "@mui/icons-material";
import { Box, Button, Tooltip } from "@mui/material";
import { CalendarContext } from "../index";
import { useContext } from "react";

export const ScheduleGenerator = () => {
  const { date } = useContext(CalendarContext);
  const { calendarEvent } = useCalendarEvent();
  const { workTimes, workers, vacations } = calendarEvent;
  const notReady = !workTimes.length || !workers.length;

  const generateSchedule = () => {};

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
