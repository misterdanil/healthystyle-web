import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  TextField,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Grid,
  Paper,
  Button
} from "@mui/material";

import DatePicker, {registerLocale}  from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import ru from "date-fns/locale/ru";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { addSetMarkRequest, fetchPlannedTrainsRequest } from "../healthSlice";

const days = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

  registerLocale("ru", ru);

const PlannedTrains = () => {
  const trains = useSelector((state) => state.health.trains);
  const addedSetMark = useSelector((state) => state.health.addedSetMark);
  const [completetions, setCompletetions] = useState(new Map());

  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchPlannedTrainsRequest({page: 1, limit: 25}));
  }, [dispatch]);

  useEffect(() => {
    completetions.delete(addedSetMark);
    setCompletetions(new Map(completetions));
}, [addedSetMark]);

  const handleDateChange = (setId, value) => {
    console.log('change date of ' + setId);
    console.log('got date ' + value.getFullYear());
    if(!completetions.has(setId)) {
        completetions.set(setId, {date: value, setNumber: '', actualRepeat: ''});
    }
    else {
        completetions.get(setId).date = value;
    }
    setCompletetions(new Map(completetions));
};

const handleSetNumberChange = (setId, value) => {
    console.log(setId);
    if(!completetions.has(setId)) {
        completetions.set(setId, {date: '', setNumber: value, actualRepeat: ''});
    }
    else {
        completetions.get(setId).setNumber = value;
    }
    setCompletetions(new Map(completetions));
};

const handleActualRepeatChange = (setId, value) => {
    if(!completetions.has(setId)) {
        completetions.set(setId, {date: '', setNumber: '', actualRepeat: value});
    }
    else {
        completetions.get(setId).actualRepeat = value;
    }
    setCompletetions(new Map(completetions));
};

const handleComplete = (setId) => {
  console.log(setId);
  const date = completetions.get(setId).date.getFullYear() + '-' + ('0' + (completetions.get(setId).date.getMonth()+1)).slice(-2) + '-' + ('0' + completetions.get(setId).date.getDate()).slice(-2);
  dispatch(addSetMarkRequest({result: {date: date, setNumber: completetions.get(setId).setNumber, actualRepeat: completetions.get(setId).actualRepeat }, setId: setId}));
};

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Запланированные тренировки
      </Typography>

      <Stack spacing={3} mt={4}>
        {trains.map((train) => (
          <Card key={train.id} sx={{ borderLeft: "5px solid #4caf50" }}>
            <CardContent>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <Typography variant="h6" color="primary">
                    {train.description}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {days[train.day - 1]} в {train.time}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    План занятий: {train.sportDescription}
                  </Typography>
                </Grid>
              </Grid>

              <Accordion sx={{ mt: 2, backgroundColor: '#f9f9f9' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="body1">Просмотр подходов</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Paper variant="outlined" sx={{ p: 2 }}>
                    <Stack spacing={2}>
                      {train.sets.map((set) => (
                        <Box
                          key={set.id}
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            backgroundColor: "#e3f2fd",
                            px: 2,
                            py: 1,
                            borderRadius: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 1,
                            }}
                          >
                            <Typography>{set.exercise.title}</Typography>
                            <Typography>
                              Подходы: {set.count}, Повторений: {set.repeat}
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              gap: 2,
                              alignItems: "center",
                              flexWrap: "wrap"
                            }}
                          >
                            <TextField
                              label="Подход"
                              type="number"
                              size="small"
                              slotProps={{ inputLabel: {shrink: true }}}
                              value={completetions.has(set.id) ? completetions.get(set.id).setNumber : ''}
                              onChange={(e) =>
                                handleSetNumberChange(set.id, e.target.value)
                              }
                            />
                            <TextField
                              label="Повторений"
                              type="number"
                              size="small"
                              slotProps={{ inputLabel: {shrink: true }}}
                              value={completetions.has(set.id) ? completetions.get(set.id).actualRepeat : ''}
                              onChange={(e) =>
                                handleActualRepeatChange(set.id, e.target.value)
                              }
                            />
                                      <DatePicker 
                                        label="Выбрать дату" 
                                        showIcon
                                        slotProps={{ textField: { size: 'small' } }}
                                        filterDate={(date) => date.getDay() === train.day}
                                        locale="ru"
                                        selected={completetions.has(set.id) ? completetions.get(set.id).date : ''} 
                                        onChange={(newDate) => handleDateChange(set.id, newDate)}
                                        renderInput={(params) => <TextField size="small" fullWidth margin="normal" {...params} />}
                                      />
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleComplete(set.id)}
                            >
                              Отметить выполнение
                            </Button>
                          </Box>
                        </Box>
                      ))}
                    </Stack>
                  </Paper>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default PlannedTrains;
