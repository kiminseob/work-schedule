import { Workers, WorkTime } from "@/components/Form";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import {
  CalendarEventForm,
  defaultValuesForm,
} from "@/constants/calendarEvent";
import { AddCircleOutline } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useBoolean } from "usehooks-ts";
import { useState } from "react";

export const UserInputForm = () => {
  const [selectedField, setSelectedField] = useState<keyof CalendarEventForm>();
  const { addEvent } = useCalendarEvent();
  const form = useForm<CalendarEventForm>({
    defaultValues: defaultValuesForm,
  });
  const { reset, handleSubmit } = form;
  const {
    value: isOpen,
    setTrue: openDialog,
    setFalse: closeDialog,
  } = useBoolean();

  const save = (formValue: CalendarEventForm) => {
    if (selectedField === "workers") {
      const workers = formValue.workers.map(({ value }) => value);
      addEvent("workers", workers);
    }
    if (selectedField === "workTimes") {
      const { startTime, endTime, max, numOfWorkers, ...rest } =
        formValue.workTimes;
      const sh = startTime?.hour();
      const sm = startTime?.minute();
      const eh = endTime?.hour();
      const em = endTime?.minute();
      const transformed = {
        ...rest,
        max: Number(max),
        numOfWorkers: Number(numOfWorkers),
        startTime: `${sh}:${sm}`,
        endTime: `${eh}:${em}`,
      };
      addEvent("workTimes", transformed);
    }

    reset();
    closeDialog();
  };

  const cancel = () => {
    reset();
    closeDialog();
  };

  const openCreateForm = (field: keyof CalendarEventForm) => {
    setSelectedField(field);
    openDialog();
  };

  return (
    <Paper elevation={3}>
      <FormProvider {...form}>
        <Box padding={2} display="flex">
          <Box display="flex" alignItems="center">
            <Typography>당직 시간</Typography>
            <Button
              startIcon={<AddCircleOutline />}
              onClick={openCreateForm.bind(null, "workTimes")}
            />
          </Box>
          <Box display="flex" alignItems="center">
            <Typography>근무자</Typography>
            <Button
              startIcon={<AddCircleOutline />}
              onClick={openCreateForm.bind(null, "workers")}
            />
          </Box>
          <Dialog open={isOpen}>
            <form onSubmit={handleSubmit(save)}>
              <DialogTitle>
                {selectedField === "workers" && "근무자 추가"}
                {selectedField === "workTimes" && "당직 시간 추가"}
              </DialogTitle>
              {selectedField === "workers" && <Workers />}
              {selectedField === "workTimes" && <WorkTime />}
              <DialogActions>
                <Button onClick={cancel}>취소</Button>
                <Button type="submit">저장</Button>
              </DialogActions>
            </form>
          </Dialog>
        </Box>
      </FormProvider>
    </Paper>
  );
};
