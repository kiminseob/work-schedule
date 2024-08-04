import { FieldArray } from "@/components/Form";
import { useCalendarEvent } from "@/components/hooks/useCalendarEvent";
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
  Paper,
  Typography,
} from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useBoolean } from "usehooks-ts";

export const UserInputForm = () => {
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

  const saveWorkers = (formValue: CalendarEventForm) => {
    const workers = formValue.workers.map(({ value }) => value);
    addEvent("workers", workers);
    reset();
    closeDialog();
  };

  const cancel = () => {
    reset();
    closeDialog();
  };

  return (
    <Paper elevation={3}>
      <Box padding={2}>
        <FormProvider {...form}>
          <Box display="flex" alignItems="center">
            <Typography>근무자</Typography>
            <Button startIcon={<AddCircleOutline />} onClick={openDialog} />
          </Box>
          <Dialog open={isOpen}>
            <form onSubmit={handleSubmit(saveWorkers)}>
              <FieldArray />
              <DialogActions>
                <Button onClick={cancel}>취소</Button>
                <Button type="submit">저장</Button>
              </DialogActions>
            </form>
          </Dialog>
        </FormProvider>
      </Box>
    </Paper>
  );
};
