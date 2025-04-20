import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Card,
  CardContent,
  Stack,
  Select,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon, DescriptionOutlined } from "@mui/icons-material";

import { fetchExercisesRequest, addSportRequest } from "../healthSlice";

const days = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const AddSport = () => {
  const exercises = useSelector((state) => state.health.exercises);
    
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [trains, setTrains] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
          dispatch(fetchExercisesRequest({title: '', page: 0, limit: 25, sort: 'TITLE'}));
      }, [dispatch]);

  const addTrain = () => {
    const newTrain = {description: "", day: days[0], time: "", sets: []};
    setTrains([
      ...trains, newTrain ]);
  };

  const removeTrain = (index) => {
    trains.splice(index, 1);
    setTrains([...trains]);
  };

  const handleChangeTrainDescription = (index, description) => {
    trains[index].description = description;
    setTrains([...trains]);
  }

  const handleChangeTrainDay = (index, day) => {
    trains[index].day = day + 1;
    setTrains([...trains]);
  }

  const handleChangeTrainTime = (index, time) => {
    trains[index].time = time;
    setTrains([...trains]);
  }

  const handleAddSet = (index) => {
    trains[index].sets = [...trains[index].sets, {exerciseId: '', count: '', repeat: ''}];
    setTrains([...trains]);
  }

  const handleChangeExercise = (trainIndex, setIndex, id) => {
    trains[trainIndex].sets[setIndex].exerciseId = id;
    setTrains([...trains]);
  }

  const handleChangeCount = (trainIndex, setIndex, count) => {
    trains[trainIndex].sets[setIndex].count = count;
    setTrains([...trains]);
  }

  const handleChangeRepeat = (trainIndex, setIndex, repeat) => {
    trains[trainIndex].sets[setIndex].repeat = repeat;
    setTrains([...trains]);
  }

  const handleAddSport = () => {
    dispatch(addSportRequest({description: description, start: start, end: end, trains: trains}));
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Организация занятий
      </Typography>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Описание"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <TextField
              label="Дата начала"
              type="date"
              slotProps={{ inputLabel: {shrink: true} }}
              value={start}
              onChange={(e) => setStart(e.target.value)}
            />
            <TextField
              label="Дата конца"
              type="date"
              slotProps={{ inputLabel: {shrink: true} }}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      <Box mb={2}>
        <Button variant="contained" onClick={addTrain} startIcon={<AddIcon />}>
          Добавить тренировку
        </Button>
      </Box>

      <Stack spacing={3}>
        {trains.map((train, index) => (
          <Card key={index}>
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  fullWidth
                  label="Описание тренировки"
                  value={train.description}
                  onChange={(e) =>
                    handleChangeTrainDescription(index, e.target.value)
                  }
                />
                <FormControl fullWidth>
                  <InputLabel>День недели</InputLabel>
                  <Select
                    value={train.day - 1}
                    label="День недели"
                    onChange={(e) =>
                      handleChangeTrainDay(index, e.target.value)
                    }
                  >
                    {days.map((day, index) => (
                      <MenuItem key={index} value={index}>
                        {day}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Время"
                  type="time"
                  slotProps={{ inputLabel: {shrink: true} }}
                  value={train.time}
                  onChange={(e) => handleChangeTrainTime(index, e.target.value)}
                />

                <Typography variant="subtitle1">Подходы</Typography>
                {train.sets.map((set, setIndex) => (
                  <Grid container spacing={2} key={setIndex} alignItems="center">
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>Упражнение</InputLabel>
                        <Select
                          value={set.exerciseId}
                          onChange={(e) =>
                            handleChangeExercise(index, setIndex, e.target.value)
                          }
                          label="Упражнение"
                        >
                          {exercises && exercises.map((exercise) => (
                            <MenuItem key={exercise.id} value={exercise.id}>
                              {exercise.title}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Подходы"
                        type="number"
                        value={set.sets}
                        onChange={(e) =>
                          handleChangeCount(index, setIndex, e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        label="Повторения"
                        type="number"
                        value={set.repeat}
                        onChange={(e) =>
                          handleChangeRepeat(index, setIndex, e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                ))}

                <Box>
                  <Button
                    size="small"
                    onClick={() => handleAddSet(index)}
                    startIcon={<AddIcon />}
                  >
                    Добавить подход
                  </Button>
                  <IconButton
                    onClick={() => removeTrain(index)}
                    color="error"
                    sx={{ ml: 2 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Box mb={2}>
        <Button variant="contained" onClick={handleAddSport}>
          Сохранить план занятий
        </Button>
      </Box>
    </Container>
  );
};

export default AddSport;