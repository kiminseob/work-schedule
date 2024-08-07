import { WorkCalendar } from "@/components/WorkCalendar";
import { Box } from "@mui/material";

export const SchedulerPage = () => {
  return (
    <Box
      padding={5}
      width="calc(100vw - 10)"
      minWidth={800}
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <WorkCalendar />
    </Box>
  );
};
