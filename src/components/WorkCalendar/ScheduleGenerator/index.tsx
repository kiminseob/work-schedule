import type { Event } from 'react-big-calendar';
import { useCalendarEvent } from '@/hooks/useCalendarEvent';
import { EventAvailable, EventBusy, HelpOutline } from '@mui/icons-material';
import { Box, Button, Tooltip, Typography } from '@mui/material';
import { CalendarContext } from '../index';
import { useContext } from 'react';
import dayjs from 'dayjs';
import { getRandomInt } from '@/utils/random';
import _ from 'lodash';

export const ScheduleGenerator = () => {
	const { date, event, handleEvent } = useContext(CalendarContext);
	const { calendarEvent } = useCalendarEvent();
	const { workTimes, workers, vacations } = calendarEvent;
	const notReady = !workTimes.length || !workers.length;

	const generateSchedule = () => {
		const _dayjs = dayjs(date);
		const year = _dayjs.year();
		const month = _dayjs.month() + 1;
		const startDate = _dayjs.startOf('month').date();
		const endDate = _dayjs.endOf('month').date();
		const weekdays: number[] = [];

		for (let _date = startDate; _date <= endDate; ++_date) {
			const day = _dayjs.set('date', _date).day();

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
			console.log(
				JSON.stringify(weekdayWorkers),
				JSON.stringify(assineToWorkers)
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

			const _event: Event[] = calendarEvent.workTimes.map((workTime) => {
				const { alias, startTime, endTime, numOfWorkers, outsider, max } =
					workTime;

				/**
				 * 최대 근무시간 달성한 근무자 필터링
				 */
				const maxPointWorkers = Object.entries(assineToWorkers)
					.filter(([_, v]) => v.workTimesCnt?.[_date] === max)
					.map(([worker]) => worker);

				/**
				 * 해당 날짜의 해당 근무시간에 휴가(vacations) 및 열외자(outsider) 및 최대 근무시간(max) 달성한 근무자 필터링
				 */
				const _workers = weekdayWorkers
					.filter((worker) => !outsider.includes(worker))
					.filter((v) => !vacationWorkers.includes(v))
					.filter((v) => !maxPointWorkers.includes(v));
				console.log('호호..', alias);

				/**
				 * 근무 인원 모자랄 경우 (휴가, 열외자, 최대 근무시간 달성으로 인해서)
				 */
				if (_workers.length < numOfWorkers) {
					/**
					 * 모자란 인원 수
					 */
					const insufficientCnt = numOfWorkers - _workers.length;
					const totalAssignedCnt = Object.values(assineToWorkers).reduce(
						(acc, cur) => {
							return acc + cur.assined;
						},
						0
					);
					const average = Math.floor(totalAssignedCnt / workers.length);

					/**
					 * 당직 근무 배정 횟수 평균치 보다 적은 인원들 필터링
					 */
					const potentialWorkers = Object.entries(assineToWorkers).filter(
						([worker, v]) => {
							return (
								v.assined <= average &&
								!outsider.includes(worker) &&
								!vacationWorkers.includes(worker) &&
								!maxPointWorkers.includes(worker) &&
								!_workers.includes(worker)
							);
						}
					);
					/**
					 * 배정 횟수 적은 근무자 순 오름차순 정렬
					 */
					potentialWorkers.sort((a, b) => {
						return a[1].assined - b[1].assined;
					});

					potentialWorkers.forEach(([worker], idx) => {
						if (idx === insufficientCnt - 1) return;
						++assineToWorkers[worker].assined;
						_workers.push(worker);
					});
				}

				const randomIdx = getRandomInt(_workers.length, numOfWorkers);
				const randomPickWorkers: string[] = [];
				console.log('_workers', _workers, _date, randomIdx);
				randomIdx.forEach((randomIdx) => {
					const pickedWorker = _workers[randomIdx];
					randomPickWorkers.push(pickedWorker);
					assineToWorkers[pickedWorker].weekdays.push(_date);
					if (!assineToWorkers[pickedWorker].workTimesCnt[_date]) {
						assineToWorkers[pickedWorker].workTimesCnt[_date] = 1;
					} else {
						++assineToWorkers[pickedWorker].workTimesCnt[_date];
					}
				});

				weekdayWorkers = weekdayWorkers.filter(
					(v) => !randomPickWorkers.includes(v)
				);

				const startDate = new Date(date);
				const endDate = new Date(date);
				const [sh, sm] = startTime.split(':');
				const [eh, em] = endTime.split(':');
				startDate.setDate(_date);
				startDate.setHours(Number(sh));
				startDate.setMinutes(Number(sm));
				endDate.setDate(_date);
				endDate.setHours(Number(eh));
				endDate.setMinutes(Number(em));
				return {
					title: (
						<Typography variant='body2'>
							{randomPickWorkers.join(',')}
						</Typography>
					),
					start: startDate,
					end: endDate,
				};
			});

			return _event;
		});
		handleEvent((prev) => [...prev, ...scheduleEvent]);
		console.log(totalWorkingTimePerWorker, calendarEvent, assineToWorkers);
	};

	return (
		<Box display='flex' justifyContent='center'>
			<Button
				disabled={notReady}
				endIcon={notReady ? <EventBusy /> : <EventAvailable />}
				onClick={generateSchedule}
			>
				당직 스켸줄 생성
			</Button>

			<Tooltip title='당직 스케줄을 생성 합니다. 당직 시간 및 근무자를 추가하면 활성화 됩니다.'>
				<HelpOutline
					fontSize='small'
					color={notReady ? 'disabled' : 'success'}
				/>
			</Tooltip>
		</Box>
	);
};
