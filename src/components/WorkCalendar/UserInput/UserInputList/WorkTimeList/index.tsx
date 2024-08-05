import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { DeleteOutline } from "@mui/icons-material";
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";

export const WorkTimeList = () => {
  const { calendarEvent, deleteEvent } = useCalendarEvent();

  const deleteWorkTime = (alias: string) => {
    deleteEvent("workTimes", alias);
  };

  return (
    <>
      {calendarEvent.workTimes.length > 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography>당직 시간</Typography>

          <Box display="flex" gap={2} flexWrap="wrap">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>당직 시간</TableCell>
                  <TableCell>당직 인원수</TableCell>
                  <TableCell>인당 최대 배정수</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {calendarEvent.workTimes.map((workTime) => {
                  const [sh, sm] = workTime.startTime.split(":");
                  const [eh, em] = workTime.endTime.split(":");
                  const startTime = sm === "0" ? `${sh}시` : `${sh}시 ${sm}분`;
                  const endTime = em === "0" ? `${eh}시` : `${eh}시 ${em}분`;

                  return (
                    <React.Fragment key={workTime.alias}>
                      <TableRow>
                        <TableCell>{workTime.alias}</TableCell>
                        <TableCell>
                          {startTime} ~ {endTime}
                        </TableCell>
                        <TableCell>{workTime.numOfWorkers} 명</TableCell>
                        <TableCell>
                          {workTime.max === 0 ? "-" : workTime.max}
                        </TableCell>
                        <TableCell>
                          <IconButton
                            onClick={deleteWorkTime.bind(null, workTime.alias)}
                          >
                            <DeleteOutline />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Box>
      )}
    </>
  );
};
