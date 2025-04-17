import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import { Add, Delete, ExpandMore } from "@mui/icons-material";
import Divider from '@mui/material/Divider';

import { fetchExercisesRequest, addExerciseRequest } from "../healthSlice";

const Exercise = () => {
  const SORT_OPTIONS = new Map();
  SORT_OPTIONS.set(1, {name: "Название", sort: "TITLE"});
  SORT_OPTIONS.set(2, {name: "Последнее обновление", sort:"CREATED_ON"});

  const [selectedSortOption, setSelectedSortOption] = useState(1);
  const [title, setTitle] = useState("");
  const [steps, setSteps] = useState([{ description: "" }]);
  const exercises = useSelector((state) => state.health.exercises);
  const addedExercise = useSelector((state) => state.health.addedExercise);
  const [searchTitle, setSearchTitle] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
        dispatch(fetchExercisesRequest({title: searchTitle, page: 0, limit: 25, sort: SORT_OPTIONS.get(selectedSortOption).sort}));
        setTitle("");
        setSteps([{ description: "" }]);
    }, [dispatch, searchTitle, selectedSortOption, addedExercise]);

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index].description = value;
    setSteps(updatedSteps);
  };

  const addStep = () => {
    setSteps([...steps, { description: "" }]);
  };

  const removeStep = (index) => {
    const updatedSteps = steps.filter((_, i) => i !== index);
    setSteps(updatedSteps);
  };

  const handleSortChange = (key) => {
      if(SORT_OPTIONS.has(key)){
        console.log('changing to ' + key);
        setSelectedSortOption(key);
    }
  }

  const handleAddExercise = () => {
    const exercise = {
      title: title,
      steps: steps,
    };
    // setExercises((prev) => [...prev, newExercise]);
    dispatch(addExerciseRequest(exercise))
  };

//   const filteredExercises = exercises
//     .filter((exercise) =>
//       exercise.name.toLowerCase().includes(search.toLowerCase())
//     )
//     .sort((a, b) => {
//       if (sortBy === "name") {
//         return a.name.localeCompare(b.name);
//       } else {
//         return new Date(b.createdAt) - new Date(a.createdAt);
//       }
//     });

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box mb={3}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Добавить новое упражнение
      </Typography>
      <TextField
        label="Название"
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Stack spacing={2}>
        {steps.map((step, index) => (
          <Card key={index} variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                Шаг {index + 1}
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
                <TextField
                  fullWidth
                  label="Описание шага"
                  variant="outlined"
                  value={step.description}
                  onChange={(e) => handleStepChange(index, e.target.value)}
                />
                <IconButton onClick={() => removeStep(index)} disabled={steps.length === 1}>
                  <Delete />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <Button startIcon={<Add />} onClick={addStep} sx={{ mt: 3 }} variant="outlined">
        Добавить шаг
      </Button>
      <Button
        variant="contained"
        sx={{ mt: 3, ml: 2 }}
        onClick={handleAddExercise}
        disabled={!title || steps.some((s) => !s.description)}
      >
        Сохранить упражнение
      </Button>
      </Box>

      <Stack mb={3} direction="row" spacing={3} alignItems="center" sx={{ mt: 1 }}  divider={<Divider orientation="vertical" flexItem />} >
        <TextField
          label="Поиск упражнений"
          sx={{width: 1}}
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
                <FormControl sx={{width: 1/3}}>
          <InputLabel>Сортировать по</InputLabel>
          <Select
            value={selectedSortOption}
            onChange={(e) => handleSortChange(e.target.value)}
            label="Сортировать по"
          >
            {Array.from(SORT_OPTIONS).map(([key, value]) => (
                <MenuItem key={key} value={key}>{value.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Box mb={3}>
      </Box>

      <Stack spacing={2}>
        {exercises && exercises.map((exercise) => (
          <Card key={exercise.id}>
            <CardContent>
              <Typography variant="h6">{exercise.title}</Typography>
              <Typography variant="body2" color="textSecondary">
                Время добавления: {new Date(exercise.createdOn).toLocaleString('ru-RU')}
              </Typography>
              <Accordion sx={{ mt: 1 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Typography>Просмотр шагов</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Stack spacing={1}>
                    {exercise.steps.map((step, index) => (
                      <Typography key={index}>
                        {index + 1}. {step.description}
                      </Typography>
                    ))}
                  </Stack>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default Exercise;
