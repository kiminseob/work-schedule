import {
	Box,
	Button,
	Card,
	Chip,
	FormHelperText,
	IconButton,
	Input,
	Snackbar,
	SnackbarCloseReason,
	Typography,
} from '@mui/material';
import FaceIcon from '@mui/icons-material/Face';
import {
	CalendarEventForm,
	defaultValuesForm,
} from '@/constants/calendarEvent';
import { useFieldArray, useForm } from 'react-hook-form';
import { useContext, type KeyboardEvent, useState } from 'react';
import { CalendarContext } from '@/components/WorkCalendar';
import { DeleteOutline } from '@mui/icons-material';
import { validator } from '@/validator';
import { useCalendarEvent } from '@/hooks/useCalendarEvent';
import { transformToDate } from '@/utils/parse';
import { VacationList } from '../VacationList';

export const WorkerList = () => {
	const { date } = useContext(CalendarContext);
	const { calendarEvent, deleteEvent, addEvent } = useCalendarEvent();
	const {
		handleSubmit,
		control,
		register,
		formState: { errors },
		getValues,
		reset,
	} = useForm<CalendarEventForm>({
		mode: 'all',
		defaultValues: { vacations: defaultValuesForm.vacations },
	});
	const [isOpenSnacbar, setOpenSnacbar] = useState(false);

	useFieldArray({
		control,
		name: 'vacations',
	});

	const handleClose = (
		_event: React.SyntheticEvent | Event,
		reason?: SnackbarCloseReason
	) => {
		if (reason === 'clickaway') {
			return;
		}

		setOpenSnacbar(false);
	};

	const deleteWorker = (worker: string) => () => {
		const isRefValue =
			calendarEvent.workTimes.filter((v) => v.outsider.includes(worker))
				.length > 0;
		if (isRefValue) {
			setOpenSnacbar(true);
			return;
		}
		deleteEvent('workers', worker);
		deleteEvent('vacations', worker);
	};

	const saveVacations = (e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key !== 'Enter' || errors.vacations) return;

		const target = e.target as HTMLInputElement;
		const worker = target.id;
		const idx = Number(target.name.split('.')[1]);
		const value = getValues('vacations');
		const vacations = value.filter(
			(vacation, _idx) => vacation.value && idx === _idx
		);

		if (vacations.length === 0) return;

		const transformedVacations = vacations.map(({ value }) =>
			transformToDate(value, date)
		)[0];

		addEvent('vacations', transformedVacations, { key: worker });

		if (!errors?.vacations) reset();
	};

	return (
		<>
			<form onSubmit={handleSubmit(() => {})}>
				<Box display='flex' flexDirection='column' gap={2}>
					{calendarEvent.workers.length > 0 && (
						<Box display='flex' gap={1}>
							<Typography>근무자</Typography>
							<Typography color='forestgreen' fontWeight={600}>
								{calendarEvent.workers.length}
							</Typography>
						</Box>
					)}
					<Box display='flex' gap={2} flexWrap='wrap'>
						{calendarEvent.workers.map((worker, idx) => (
							<Box key={worker} minWidth={400} flexGrow={1} flexBasis={0}>
								<Card
									sx={{
										padding: 1,
										display: 'flex',
										flexDirection: 'column',
										gap: 2,
									}}
								>
									<Box display='flex' justifyContent='space-between'>
										<Box display='flex' gap={1} alignItems='center'>
											<Chip
												icon={<FaceIcon />}
												label={worker}
												variant='outlined'
											/>
											{calendarEvent.assined?.[
												`${date.getFullYear()}-${date.getMonth() + 1}`
											]?.[worker] && (
												<Box
													display='flex'
													alignItems='center'
													gap={0.5}
													flexWrap='wrap'
												>
													{Object.entries(
														calendarEvent.assined?.[
															`${date.getFullYear()}-${date.getMonth() + 1}`
														]?.[worker]?.workTimesCnt
													).map(([alias, num]) => (
														<Chip size='small' label={`${alias}: ${num}번`} />
													))}
													<Chip
														size='small'
														color='secondary'
														label={`총 ${Object.entries(
															calendarEvent.assined?.[
																`${date.getFullYear()}-${date.getMonth() + 1}`
															]?.[worker]?.workTimesCnt
														).reduce((acc, [_, num]) => {
															return acc + num;
														}, 0)}번`}
													/>
												</Box>
											)}
										</Box>
										<IconButton onClick={deleteWorker(worker)}>
											<DeleteOutline />
										</IconButton>
									</Box>

									<Box>
										<Input
											{...register(`vacations.${idx}.value`, {
												validate: (value) => {
													if (!value) return true;
													const isValid = validator.vacations.validate(
														date,
														value
													);
													return isValid
														? isValid
														: validator.vacations.message;
												},
											})}
											defaultValue=''
											placeholder={`${
												date.getMonth() + 1
											}월 휴가 입력 후 엔터 (ex. 1, 3-6)`}
											onKeyDown={saveVacations}
											id={worker}
											fullWidth
											error={!!errors?.vacations?.[idx]}
										/>
										{!!errors?.vacations?.[idx] && (
											<FormHelperText>
												{errors?.vacations?.[idx]?.value?.message}
											</FormHelperText>
										)}
									</Box>
									<Box marginTop={1} gap={0.1} display='flex' flexWrap='wrap'>
										<VacationList worker={worker} />
									</Box>
								</Card>
							</Box>
						))}
					</Box>
				</Box>
				<Button type='submit' />
			</form>
			<Snackbar
				open={isOpenSnacbar}
				onClose={handleClose}
				autoHideDuration={5000}
				message='해당 근무자는 당직 열외자에서 참조 되고 있어 삭제할 수 없습니다.'
			/>
		</>
	);
};
