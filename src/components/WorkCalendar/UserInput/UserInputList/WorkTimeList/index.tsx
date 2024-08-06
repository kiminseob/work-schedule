import { CalendarEventForm } from "@/constants/calendarEvent";
import { useCalendarEvent } from "@/hooks/useCalendarEvent";
import { DeleteOutline, PersonAddAlt1 } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useBoolean } from "usehooks-ts";

export const WorkTimeList = () => {
  const [alias, setAlias] = useState("");
  const { calendarEvent, deleteEvent, addEvent } = useCalendarEvent();
  const form = useForm<CalendarEventForm>();
  const { handleSubmit, reset, control } = form;
  const {
    value: isOpenDialog,
    setTrue: openDialog,
    setFalse: closeDialog,
  } = useBoolean();

  const deleteWorkTime = (alias: string) => {
    deleteEvent("workTimes", alias);
  };

  const deleteOutsider = (props: string[]) => {
    const [alias, deleteTargetValue] = props;
    deleteEvent("workTimes", alias, { deleteTargetValue });
  };

  const handleClickExcludeWorker = (alias: string) => {
    openDialog();
    setAlias(alias);
  };

  const save = ({ workTimes }: CalendarEventForm) => {
    addEvent("workTimes", workTimes.outsider, {
      childTargetField: alias,
      key: "outsider",
    });
    reset();
    closeDialog();
  };

  const cancel = () => {
    reset();
    closeDialog();
  };

  return (
    <>
      {calendarEvent.workTimes.length > 0 && (
        <Box display="flex" flexDirection="column" gap={2}>
          <Box display="flex" gap={1}>
            <Typography>당직 시간</Typography>
            <Typography color="forestgreen" fontWeight={600}>
              {calendarEvent.workTimes.length}
            </Typography>
          </Box>
          <Box display="flex" gap={2} flexWrap="wrap">
            <Paper sx={{ width: "100%" }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>당직 시간</TableCell>
                    <TableCell>당직 인원수</TableCell>
                    <TableCell>인당 최대 횟수</TableCell>
                    <TableCell>당직 열외자</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {calendarEvent.workTimes.map((workTime) => {
                    const [sh, sm] = workTime.startTime.split(":");
                    const [eh, em] = workTime.endTime.split(":");
                    const startTime =
                      sm === "0" ? `${sh}시` : `${sh}시 ${sm}분`;
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
                            <Box display="flex">
                              <Box
                                display="flex"
                                flexDirection="column"
                                justifyContent="center"
                                maxWidth={150}
                                gap={0.5}
                              >
                                {workTime.outsider.map((_outsider) => (
                                  <Chip
                                    size="small"
                                    label={_outsider}
                                    color="warning"
                                    onDelete={deleteOutsider.bind(null, [
                                      workTime.alias,
                                      _outsider,
                                    ])}
                                  />
                                ))}
                              </Box>
                              <Box display="flex" alignItems="center">
                                <IconButton
                                  onClick={handleClickExcludeWorker.bind(
                                    null,
                                    workTime.alias
                                  )}
                                >
                                  <PersonAddAlt1 />
                                </IconButton>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <IconButton
                              onClick={deleteWorkTime.bind(
                                null,
                                workTime.alias
                              )}
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
            </Paper>
          </Box>
        </Box>
      )}
      <Dialog open={isOpenDialog} fullWidth>
        <form onSubmit={handleSubmit(save)}>
          <DialogTitle>당직 열외자 추가</DialogTitle>
          <DialogContent>
            <Controller
              name="workTimes.outsider"
              control={control}
              render={({ field: { onChange, ...rest } }) => (
                <Autocomplete
                  {...rest}
                  onChange={(_, v) => {
                    onChange(v);
                  }}
                  multiple
                  options={calendarEvent.workers.filter((worker) => {
                    const isDup = calendarEvent.workTimes
                      .filter((v) => v.alias === alias)[0]
                      .outsider.includes(worker);

                    return !isDup;
                  })}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="당직 열외자"
                      placeholder="열외자"
                    />
                  )}
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={cancel}>취소</Button>
            <Button type="submit">저장</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};
