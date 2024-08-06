import { Calendar, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { Box } from "@mui/material";
import { Toolbar } from "./Toolbar";
import { createContext, useEffect, useState } from "react";
import { UserInputForm } from "./UserInput/UserInputForm";
import { UserInputList } from "./UserInput/UserInputList";
import { ScheduleGenerator } from "./ScheduleGenerator";
import { getHolidays } from "@/api/public";

const localizer = dayjsLocalizer(dayjs);

export const CalendarContext = createContext<{ date: Date }>({
  date: new Date(),
});

export const WorkCalendar = () => {
  const [date, setDate] = useState(new Date());

  const handleChangeDate = (newDate: Date) => {
    setDate(newDate);
  };

  const fetchHolidays = async () => {
    const holidays = await getHolidays({
      solYear: date.getFullYear(),
      solMonth: date.getMonth() + 1,
    });
    console.log(holidays);
  };

  useEffect(() => {
    fetchHolidays();
  }, [date.getMonth()]);

  return (
    <CalendarContext.Provider value={{ date }}>
      <Box
        display="flex"
        flexDirection="column"
        gap={4}
        width="100%"
        maxWidth={1024}
      >
        <Calendar
          localizer={localizer}
          style={{ height: 500 }}
          components={{ toolbar: Toolbar }}
          date={date}
          onNavigate={handleChangeDate}
        />
        <ScheduleGenerator />
        <UserInputForm />
        <UserInputList />
      </Box>
    </CalendarContext.Provider>
  );
};
