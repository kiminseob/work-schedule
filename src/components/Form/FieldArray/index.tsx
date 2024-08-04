import { useCalendarEvent } from "@/components/hooks/useCalendarEvent";
import { CalendarEventForm } from "@/constants/calendarEvent";
import { AddCircleOutline, DeleteOutline } from "@mui/icons-material";
import { Box, Button, FormHelperText, Input } from "@mui/material";
import { useFieldArray, Controller, useFormContext } from "react-hook-form";

export const FieldArray = () => {
  const { calendarEvent } = useCalendarEvent();
  const {
    control,
    formState: { errors },
    getValues,
  } = useFormContext<CalendarEventForm>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workers",
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="300px"
    >
      <ul>
        {fields.map((item, index) => (
          <li key={item.id} style={{ listStyleType: "none" }}>
            <Box>
              <Controller
                render={({ field }) => (
                  <Input
                    {...field}
                    error={!!errors?.workers?.[index]}
                    placeholder="이름을 입력하세요."
                  />
                )}
                name={`workers.${index}.value`}
                control={control}
                rules={{
                  required: "필수 입력값 입니다.",
                  validate: (currentWorkerValue) => {
                    const isDupForm =
                      getValues("workers").findIndex(
                        ({ value }, _idx) =>
                          _idx !== index && value === currentWorkerValue
                      ) > -1;
                    const isDupStorage =
                      calendarEvent.workers.findIndex(
                        (worker) => worker === currentWorkerValue
                      ) > -1;

                    return isDupForm || isDupStorage
                      ? "이름이 중복 됩니다."
                      : true;
                  },
                }}
              />
              <Button
                startIcon={<DeleteOutline />}
                onClick={() => remove(index)}
              />
            </Box>
            {errors?.workers?.[index] && (
              <Box>
                <FormHelperText>
                  {errors?.workers?.[index]?.value?.message}
                </FormHelperText>
              </Box>
            )}
          </li>
        ))}
      </ul>
      <Box display="flex" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<AddCircleOutline />}
          onClick={() => append({ value: "" })}
        >
          근무자 추가
        </Button>
      </Box>
    </Box>
  );
};
