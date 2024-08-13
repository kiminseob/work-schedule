import { Calendar, type Event, dayjsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import { Box, Typography } from "@mui/material";
import { Toolbar } from "./Toolbar";
import { createContext, useEffect, useState } from "react";
import { UserInputForm } from "./UserInput/UserInputForm";
import { UserInputList } from "./UserInput/UserInputList";
import { ScheduleGenerator } from "./ScheduleGenerator";
import { Item, getHolidays } from "@/api/public";
import { isArray, isObject } from "@/utils/type";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import React from "react";

const localizer = dayjsLocalizer(dayjs);

type CalendarContextType = {
  date: Date;
  event: Event[];
};
export const CalendarContext = createContext<CalendarContextType>({
  date: new Date(),
  event: [],
});

export const WorkCalendar = () => {
  const { calendarEvent } = useCalendarEvent();
  const [date, setDate] = useState(new Date());
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const transformedCalendarEvent = (
    calendarEvent.event?.[`${year}-${month}`] ?? []
  ).map(({ start, end, ...rest }) => {
    return { ...rest, start: new Date(start!), end: new Date(end!) };
  });
  const [event, setEvent] = useState<Event[]>([]);

  const handleChangeDate = (newDate: Date) => {
    setDate(newDate);
  };

  const transfromToEvent = (item: Item) => {
    const year = String(item.locdate).slice(0, 4);
    const month = String(item.locdate).slice(4, 6);
    const day = String(item.locdate).slice(6, 8);

    return {
      title: (
        <Typography variant="body2" sx={{ backgroundColor: "tomato" }}>
          {item.dateName}
        </Typography>
      ),
      start: new Date(`${year}-${month}-${day}`),
      end: new Date(`${year}-${month}-${day}`),
      allDay: true,
    };
  };

  const fetchHolidays = async () => {
    const holidays = await getHolidays({
      solYear: date.getFullYear(),
      solMonth: date.getMonth() + 1,
    });

    if (!holidays) return;

    if (isArray(holidays.item)) {
      const _event: Event[] = holidays.item.map((v) => transfromToEvent(v));
      setEvent(_event);
    }
    if (isObject(holidays.item)) {
      const _event = transfromToEvent(holidays.item);
      setEvent([_event]);
    }
  };

  useEffect(() => {
    fetchHolidays();
  }, [date.getMonth()]);

  const mergedEvent = [...transformedCalendarEvent, ...event].map(
    ({ title, ...rest }) => ({
      ...rest,
      title: React.isValidElement(title) ? (
        title
      ) : (
        <Typography variant="body2">{title}</Typography>
      ),
    })
  );

  const handleSelectEvent = (event: Event) => {
    const title = event.title as React.ReactElement;
    alert(title.props.children);
  };

  return (
    <CalendarContext.Provider value={{ date, event }}>
      <Box
        display="flex"
        flexDirection="column"
        gap={4}
        width="100%"
        maxWidth={1920}
      >
        <Calendar<Event>
          localizer={localizer}
          events={mergedEvent}
          style={{ height: 870 }}
          components={{ toolbar: Toolbar }}
          date={date}
          onNavigate={handleChangeDate}
          onSelectEvent={handleSelectEvent}
        />
        <ScheduleGenerator />
        <UserInputForm />
        <UserInputList />
      </Box>
    </CalendarContext.Provider>
  );
};
