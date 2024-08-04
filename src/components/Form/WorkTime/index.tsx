import { CalendarEventForm } from "@/constants/calendarEvent";
import { InfoOutlined, InputOutlined } from "@mui/icons-material";
import {
  Box,
  Input,
  InputLabel,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormContext } from "react-hook-form";

export const WorkTime = () => {
  const {} = useFormContext<CalendarEventForm>();

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
          <TimePicker label="시작 시간" />
          <TimePicker label="종료 시간" />
        </Box>
      </LocalizationProvider>
      <Box display="flex" flexDirection="column" gap={1}>
        <InputLabel htmlFor="workTimeName" margin="dense" required>
          별칭
        </InputLabel>
        <Input id="workTimeName" placeholder="별칭 입력" fullWidth />
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box display="flex" gap={0.5} alignItems="center">
          <InputLabel margin="dense" required>
            당직 인원수
          </InputLabel>
          <Tooltip title="해당 당직 시간에 필요한 당직 근무 인원수를 설정합니다.">
            <InfoOutlined sx={{ width: 16 }} />
          </Tooltip>
        </Box>
        <Slider min={1} max={100} step={1} valueLabelDisplay="auto" />
      </Box>
      <Box display="flex" flexDirection="column" gap={1}>
        <Box>
          <Typography>옵션</Typography>
        </Box>
        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" gap={0.5} alignItems="center">
            <InputLabel margin="dense">인당 최대 배정수</InputLabel>
            <Tooltip title="해당 당직 시간에 당직 근무를 설 수 있는 인당 최대 횟수를 설정합니다. 설정하지 않으면 이 값은 무시됩니다.">
              <InfoOutlined sx={{ width: 16 }} />
            </Tooltip>
            <Typography variant="caption" color="GrayText" lineHeight={0}>
              default: 0 (설정하지 않음)
            </Typography>
          </Box>
          <Slider min={0} max={100} step={1} valueLabelDisplay="auto" />
        </Box>
      </Box>
    </Box>
  );
};
