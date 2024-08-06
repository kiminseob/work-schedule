import { CalendarEventForm } from "@/constants/calendarEvent";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { InfoOutlined } from "@mui/icons-material";
import {
  Box,
  FormHelperText,
  Input,
  InputLabel,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Controller, useFormContext, useWatch } from "react-hook-form";

export const WorkTime = () => {
  const { calendarEvent } = useCalendarEvent();
  const {
    register,
    getValues,
    control,
    formState: { errors },
  } = useFormContext<CalendarEventForm>();
  const workTimes = useWatch({
    name: "workTimes",
    control,
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="350px"
      paddingLeft={5}
      paddingRight={5}
      gap={3}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box display="flex" gap={1}>
          <Box>
            <Controller
              name="workTimes.startTime"
              render={({ field }) => (
                <TimePicker
                  {...field}
                  label="시작 시간"
                  maxTime={getValues("workTimes.endTime")}
                />
              )}
              rules={{ required: "필수 입력값입니다." }}
            />
            {errors.workTimes?.startTime && (
              <FormHelperText>
                {errors.workTimes?.startTime.message}
              </FormHelperText>
            )}
          </Box>
          <Box>
            <Controller
              name="workTimes.endTime"
              render={({ field }) => (
                <TimePicker
                  {...field}
                  label="종료 시간"
                  minTime={getValues("workTimes.startTime")}
                />
              )}
              rules={{ required: "필수 입력값입니다." }}
            />
            {errors.workTimes?.endTime && (
              <FormHelperText>
                {errors.workTimes?.endTime.message}
              </FormHelperText>
            )}
          </Box>
        </Box>
      </LocalizationProvider>
      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="workTimeName" margin="dense" required>
          별칭
        </InputLabel>
        <Input
          {...register("workTimes.alias", {
            required: "필수 입력값입니다.",
            validate: (alias) => {
              const isDup =
                calendarEvent.workTimes.findIndex(
                  (workTime) => workTime.alias === alias
                ) > -1;
              return isDup ? "별칭이 중복됩니다." : true;
            },
          })}
          id="workTimeName"
          placeholder="별칭을 입력해 주세요."
          fullWidth
        />
        {errors.workTimes?.alias && (
          <FormHelperText>{errors.workTimes?.alias.message}</FormHelperText>
        )}
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" gap={0.5} alignItems="center">
          <InputLabel margin="dense" required>
            당직 인원수
          </InputLabel>
          <Tooltip title="해당 당직 시간의 근무 인원수를 설정합니다.">
            <InfoOutlined sx={{ width: 16 }} />
          </Tooltip>
        </Box>
        <Box display="flex" gap={2}>
          <Slider
            {...register("workTimes.numOfWorkers")}
            min={1}
            max={100}
            step={1}
            valueLabelDisplay="auto"
          />
          <Typography width={80}>{workTimes.numOfWorkers} 명</Typography>
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box>
          <Typography>옵션</Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" gap={0.5} alignItems="center">
            <InputLabel margin="dense">인당 최대 횟수</InputLabel>
            <Tooltip title="해당 당직 시간에 당직 근무를 설 수 있는 인당 최대 횟수를 설정합니다. 설정하지 않으면 이 값은 무시됩니다.">
              <InfoOutlined sx={{ width: 16 }} />
            </Tooltip>
            <Typography variant="caption" color="GrayText" lineHeight={0}>
              default: 0 (설정하지 않음)
            </Typography>
          </Box>
          <Box display="flex" gap={2}>
            <Slider
              {...register("workTimes.max")}
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
            />
            <Typography width={80}>{workTimes.max} 명</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
