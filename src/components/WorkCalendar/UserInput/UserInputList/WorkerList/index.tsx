import {
  Box,
  Button,
  Card,
  Chip,
  FormHelperText,
  IconButton,
  Input,
  Typography,
} from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import {
  CalendarEventForm,
  defaultValuesForm,
} from "@/constants/calendarEvent";
import { useFieldArray, useForm } from "react-hook-form";
import { useContext, type KeyboardEvent } from "react";
import { CalendarContext } from "@/components/WorkCalendar";
import { DeleteOutline } from "@mui/icons-material";
import { validator } from "@/validator";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { transformToDate } from "@/utils/parse";
import { VacationList } from "../VacationList";

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
    mode: "all",
    defaultValues: { vacations: defaultValuesForm.vacations },
  });

  useFieldArray({
    control,
    name: "vacations",
  });

  const deleteWorker = (worker: string) => () => {
    deleteEvent("workers", worker);
    deleteEvent("vacations", worker);
    reset();
  };

  const saveVacations = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || errors.vacations) return;

    const target = e.target as HTMLInputElement;
    const worker = target.id;
    const idx = Number(target.name.split(".")[1]);
    const value = getValues("vacations");
    const vacations = value.filter(
      (vacation, _idx) => vacation.value && idx === _idx
    );

    if (vacations.length === 0) return;

    const transformedVacations = vacations.map(({ value }) =>
      transformToDate(value, date)
    )[0];

    addEvent("vacations", transformedVacations, worker);

    if (!errors?.vacations) reset();
  };

  return (
    <form onSubmit={handleSubmit(() => {})}>
      <Box display="flex" flexDirection="column" gap={2}>
        {calendarEvent.workers.length > 0 && (
          <Typography>근무자 리스트</Typography>
        )}
        <Box display="flex" gap={2} flexWrap="wrap">
          {calendarEvent.workers.map((worker, idx) => (
            <Box key={worker} minWidth={300} flexGrow={1} flexBasis={0}>
              <Card sx={{ padding: 1 }}>
                <Box display="flex" justifyContent="space-between">
                  <Chip icon={<FaceIcon />} label={worker} variant="outlined" />
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
                        return isValid ? isValid : validator.vacations.message;
                      },
                    })}
                    defaultValue=""
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
                <Box marginTop={1} gap={0.1} display="flex" flexWrap="wrap">
                  <VacationList worker={worker} />
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
      <Button type="submit" />
    </form>
  );
};
