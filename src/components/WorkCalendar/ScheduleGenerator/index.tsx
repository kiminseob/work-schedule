import type { Event } from "react-big-calendar";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { EventAvailable, EventBusy, HelpOutline } from "@mui/icons-material";
import { Box, Button, Tooltip, Typography } from "@mui/material";
import { CalendarContext } from "../index";
import { useContext } from "react";
import dayjs from "dayjs";
import { getRandomInt } from "@/utils/random";

export const ScheduleGenerator = () => {
  const { date, event, handleEvent } = useContext(CalendarContext);
  const { calendarEvent } = useCalendarEvent();
  const { workTimes, workers, vacations } = calendarEvent;
  const notReady = !workTimes.length || !workers.length;

  const generateSchedule = () => {
    const _dayjs = dayjs(date);
    const startDate = _dayjs.startOf("month").date();
    const endDate = _dayjs.endOf("month").date();
    const weekdays: number[] = [];

    for (let _date = startDate; _date <= endDate; ++_date) {
      const day = _dayjs.set("date", _date).day();

      if (day % 6 === 0) continue;

      const isHoliday = event.some((v) => v.start?.getDate() === _date);
      if (isHoliday) continue;

      weekdays.push(_date);
    }

    const totalWorkingDay = weekdays.length;
    const workersCountOneDay = calendarEvent.workTimes.reduce((acc, cur) => {
      return acc + cur.numOfWorkers;
    }, 0);
    const totalWorkers = totalWorkingDay * workersCountOneDay;
    const totalWorkingTimePerWorker = Math.floor(totalWorkers / workers.length);
    const restWorkingTimeCount =
      totalWorkers - totalWorkingTimePerWorker * workers.length;
    const randomIdx = getRandomInt(workers.length, restWorkingTimeCount);

    const assineToWorkers: Record<
      (typeof workers)[number],
      { assined: number; weekdays: number[] }
    > = workers.reduce((acc, cur, idx) => {
      const plus = randomIdx.includes(idx) ? 1 : 0;
      return {
        ...acc,
        [cur]: { assined: totalWorkingTimePerWorker + plus, weekdays: [] },
      };
    }, {});
    console.log(assineToWorkers);
    /**
     * 근무자1 : {
     *          당직1: 3번, 당직2: 3번: 당직4: 5번
     *
     *          }
     */
    const scheduleEvent: Event[] = weekdays.flatMap((_date) => {
      const _event: Event[] = calendarEvent.workTimes.map((workTime) => {
        const { alias, startTime, endTime, numOfWorkers, outsider, max } =
          workTime;
        const _workers = workers.filter((worker) => !outsider.includes(worker));

        const randomIdx = getRandomInt(_workers.length, numOfWorkers);
        const randomPickWorkers: string[] = [];

        randomIdx.forEach((randomIdx) => {
          randomPickWorkers.push(_workers[randomIdx]);
          assineToWorkers[_workers[randomIdx]].weekdays.push(_date);
        });
        const startDate = new Date(date);
        const endDate = new Date(date);
        const [sh, sm] = startTime.split(":");
        const [eh, em] = endTime.split(":");
        startDate.setDate(_date);
        startDate.setHours(Number(sh));
        startDate.setMinutes(Number(sm));
        endDate.setDate(_date);
        endDate.setHours(Number(eh));
        endDate.setMinutes(Number(em));
        return {
          title: (
            <Typography variant="body2">
              {randomPickWorkers.join(",")}
            </Typography>
          ),
          start: startDate,
          end: endDate,
        };
      });

      return _event;
    });
    handleEvent(scheduleEvent);
    console.log(calendarEvent, assineToWorkers);
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
