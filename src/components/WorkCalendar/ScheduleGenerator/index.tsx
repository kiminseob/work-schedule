import type { Event } from "react-big-calendar";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { EventAvailable, EventBusy, HelpOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Tooltip,
} from "@mui/material";
import { CalendarContext } from "../index";
import { useContext } from "react";
import dayjs from "dayjs";
import { getRandomInt } from "@/utils/random";
import _ from "lodash";
import { useBoolean } from "usehooks-ts";

export const ScheduleGenerator = () => {
  const { date, event } = useContext(CalendarContext);
  const { calendarEvent, addEvent } = useCalendarEvent();
  const { workTimes, workers, vacations } = calendarEvent;
  const notReady = !workTimes.length || !workers.length;
  const {
    value: isOpen,
    setTrue: openDialog,
    setFalse: closeDialog,
  } = useBoolean();

  const save = () => {
    const [scheduleEvent, assineToWorkers] = generateSchedule();
    const newAssineToWorkers = Object.entries(assineToWorkers).reduce(
      (acc, [worker, v]) => {
        return { ...acc, [worker]: { workTimesCnt: v.workTimesCnt } };
      },
      {}
    );
    const dateKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    addEvent("event", scheduleEvent, {
      key: dateKey,
    });
    addEvent("assined", newAssineToWorkers, { key: dateKey });
    closeDialog();
  };

  const cancel = () => {
    closeDialog();
  };

  const generateSchedule = () => {
    const _dayjs = dayjs(date);
    const year = _dayjs.year();
    const month = _dayjs.month() + 1;
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

    let assineToWorkers: Record<
      (typeof workers)[number],
      {
        assined: number;
        weekdays: number[];
        workTimesCnt: { [_date: string]: number };
      }
    > = workers.reduce((acc, cur, idx) => {
      const plus = randomIdx.includes(idx) ? 1 : 0;
      return {
        ...acc,
        [cur]: {
          assined: totalWorkingTimePerWorker + plus,
          weekdays: [],
          workTimesCnt: {},
        },
      };
    }, {});

    const scheduleEvent: Event[] = weekdays.flatMap((_date) => {
      let weekdayWorkers = workers.filter(
        (v) => assineToWorkers[v].assined !== assineToWorkers[v].weekdays.length
      );

      /**
       * 해당 날짜에 휴가중인 인원 필터링
       */
      const vacationWorkers = Object.entries(vacations)
        .map(([worker, weekdays]) => {
          const isVacation = weekdays.some(
            (v) => v === `${year}-${month}-${_date}`
          );
          return isVacation ? worker : null;
        })
        .filter((v) => v);

      /**
       * 각 당직 시간 근무자 할당
       */
      const _event = calendarEvent.workTimes
        .map((workTime) => {
          const { alias, startTime, endTime, numOfWorkers, outsider, max } =
            workTime;

          /**
           * 최대 근무시간 달성한 근무자 필터링
           */
          const maxPointWorkers = Object.entries(assineToWorkers)
            .filter(([_, v]) => v.workTimesCnt?.[alias] === max)
            .map(([worker]) => worker);

          /**
           * 해당 날짜의 해당 근무시간에 휴가(vacations) 및 열외자(outsider) 및 최대 근무시간(max) 달성한 근무자 필터링
           */
          const _workers = weekdayWorkers
            .filter((worker) => !outsider.includes(worker))
            .filter((v) => !vacationWorkers.includes(v))
            .filter((v) => !maxPointWorkers.includes(v));

          /**
           * 근무 인원 모자랄 경우 (휴가, 열외자, 최대 근무시간 달성으로 인해서)
           */
          if (_workers.length < numOfWorkers) {
            /**
             * 모자란 인원수
             */
            const insufficientCnt = numOfWorkers - _workers.length;
            const totalAssignedCnt = Object.values(assineToWorkers).reduce(
              (acc, cur) => {
                return acc + cur.weekdays.length;
              },
              0
            );
            const average = Math.ceil(totalAssignedCnt / workers.length);

            /**
             * 당직 근무 배정 횟수 평균치 보다 적은 인원들 필터링
             */
            const potentialWorkers = Object.entries(assineToWorkers)
              .filter(([worker, v]) => {
                return (
                  v.weekdays.length <= average &&
                  !outsider.includes(worker) &&
                  !vacationWorkers.includes(worker) &&
                  !maxPointWorkers.includes(worker) &&
                  !_workers.includes(worker)
                );
              })
              .map(([worker, v]) => ({ worker, ...v }));

            /**
             * 배정 횟수 적은 근무자 순 오름차순 정렬
             */
            potentialWorkers.sort((a, b) => {
              return a.weekdays.length - b.weekdays.length;
            });

            potentialWorkers.forEach((v, idx) => {
              if (idx > insufficientCnt - 1) return;
              ++assineToWorkers[v.worker].assined;
              _workers.push(v.worker);
            });
          }

          if (_workers.length < numOfWorkers) return null;

          const randomIdx = getRandomInt(_workers.length, numOfWorkers);
          const randomPickWorkers: string[] = [];

          randomIdx.forEach((randomIdx) => {
            const pickedWorker = _workers[randomIdx];
            randomPickWorkers.push(pickedWorker);
            assineToWorkers[pickedWorker].weekdays.push(_date);
            if (!assineToWorkers[pickedWorker].workTimesCnt[alias]) {
              assineToWorkers[pickedWorker].workTimesCnt[alias] = 1;
            } else {
              ++assineToWorkers[pickedWorker].workTimesCnt[alias];
            }
          });

          weekdayWorkers = weekdayWorkers.filter(
            (v) => !randomPickWorkers.includes(v)
          );

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
            title: randomPickWorkers.join(","),
            start: startDate,
            end: endDate,
          };
        })
        .filter((v) => v) as Event[];

      return _event;
    });

    return [scheduleEvent, assineToWorkers];
  };

  return (
    <>
      <Box display="flex" justifyContent="center">
        <Button
          disabled={notReady}
          endIcon={notReady ? <EventBusy /> : <EventAvailable />}
          onClick={openDialog}
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
      <Dialog open={isOpen}>
        <DialogTitle>
          {date.getMonth() + 1}월 당직 스케줄을 생성하시겠습니까?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            이미 스케줄이 존재하는 경우 새로운 스케줄로 대체됩니다.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancel}>취소</Button>
          <Button onClick={save}>생성</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
