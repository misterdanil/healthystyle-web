import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams} from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  TextField,
  Stack,
  Button,
  Divider,
  Autocomplete,
  MenuItem,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { fetchMeasuresRequest, fetchMedicinesRequest, addTreatmentRequest } from "../healthSlice";

import { checkAuth } from "../oauth2.js";

const days = [
  "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота", "Воскресенье"
];

const sequenceOptions = [{sequence: 'BEFORE_EAT', translate: "До еды"}, {sequence: 'AFTER_EAT', translate: "После еды"}];

const AddTreatment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  
  checkAuth('http://localhost:3001/treatment', 'POST', "http://localhost:3001/oauth2/redirect", window.location.href, searchParams);

  const [description, setDescription] = useState("");
  const [searchName, setSearchName] = useState("");
  const [plans, setPlans] = useState([]);

  const medicines = useSelector((state) => state.health.medicines);
  const measures = useSelector((state) => state.health.measures);
  const addedTreatment = useSelector((state) => state.health.addedTreatment);

  useEffect(() => {
        dispatch(fetchMedicinesRequest({name: searchName, page: 0, limit: 25}));
      }, [searchName]);
    
  useEffect(() => {
        dispatch(fetchMeasuresRequest());
      }, [dispatch]);

  useEffect(() => {
        navigate(addedTreatment);
      }, [addedTreatment]);

  const addPlan = () => {
    plans.push({
      medicineId: null,
      sequence: "",
      start: "",
      end: "",
      intakes: [],
    });
    setPlans(plans);
  };

  const handleChangePlan = (index, field, value) => {
    const updated = [...plans];
    updated[index][field] = value;
    setPlans(updated);
  };

  const addIntake = (planIndex) => {
    const updated = [...plans];
    updated[planIndex].intakes.push({
      time: "",
      day: 1,
      weight: "",
      measureType: "",
    });
    setPlans(updated);
  };

  const handleChangeIntake = (planIndex, intakeIndex, field, value) => {
    const updated = [...plans];
    updated[planIndex].intakes[intakeIndex][field] = value;
    setPlans(updated);
  };

  const deleteIntake = (planIndex, intakeIndex) => {
    const updated = [...plans];
    updated[planIndex].intakes.splice(intakeIndex, 1);
    setPlans(updated);
  };

  const deletePlan = (index) => {
    const updated = [...plans];
    updated.splice(index, 1);
    setPlans(updated);
  };

  const saveTreatment = () => {
    dispatch(addTreatmentRequest({description: description, plans: plans}));
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h5">Создание лечения</Typography>

        <TextField
          label="Описание лечения"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />

        <Button variant="contained" onClick={addPlan} startIcon={<Add />}>
          Добавить план
        </Button>

        {plans.map((plan, index) => (
          <Box key={index} p={2} border={1} borderRadius={2} borderColor="grey.300">
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">План {index + 1}</Typography>
                <IconButton onClick={() => deletePlan(index)}>
                  <Delete />
                </IconButton>
              </Stack>

              <Autocomplete
                options={medicines}
                getOptionLabel={(op) => op.name}
                onChange={(e, medicine) => handleChangePlan(index, "medicineId", medicine.id)}
                renderInput={(params) => <TextField {...params} label="Лекарство" onChange={(e) => setSearchName(e.target.value)} />}
              />

              <TextField
                select
                label="До / После еды"
                value={plan.sequence}
                onChange={(e) => handleChangePlan(index, "sequence", e.target.value)}
              >
                {sequenceOptions.map((opt) => (
                  <MenuItem key={opt.sequence} value={opt.sequence}>
                    {opt.translate}
                  </MenuItem>
                ))}
              </TextField>

              <Stack direction="row" spacing={2}>
                <TextField
                  type="date"
                  label="Начало"
                  InputLabelProps={{ shrink: true }}
                  value={plan.startDate}
                  onChange={(e) => handleChangePlan(index, "start", e.target.value)}
                  fullWidth
                />
                <TextField
                  type="date"
                  label="Окончание"
                  InputLabelProps={{ shrink: true }}
                  value={plan.endDate}
                  onChange={(e) => handleChangePlan(index, "end", e.target.value)}
                  fullWidth
                />
              </Stack>

              <Button onClick={() => addIntake(index)} startIcon={<Add />}>
                Добавить приём
              </Button>

              {plan.intakes && plan.intakes.map((intake, intakeIndex) => (
                <Stack key={intakeIndex} direction="row" spacing={2} alignItems="center">
                  <TextField
                    select
                    label="День"
                    value={intake.day}
                    onChange={(e) => handleChangeIntake(index, intakeIndex, "day", e.target.value)}
                    sx={{ minWidth: 140 }}
                  >
                    {days.map((day, index) => (
                      <MenuItem key={index} value={index + 1}>
                        {day}
                      </MenuItem>
                    ))}
                  </TextField>

                  <TextField
                    type="time"
                    label="Время"
                    InputLabelProps={{ shrink: true }}
                    value={intake.time}
                    onChange={(e) => handleChangeIntake(index, intakeIndex, "time", e.target.value)}
                  />

                  <TextField
                    label="Дозировка"
                    type="number"
                    value={intake.weight}
                    onChange={(e) => handleChangeIntake(index, intakeIndex, "weight", e.target.value)}
                  />

                  <TextField
                    select
                    label="Ед. измерения"
                    value={intake.measureType}
                    onChange={(e) => handleChangeIntake(index, intakeIndex, "measureType", e.target.value)}
                    sx={{ minWidth: 120 }}
                  >
                    {measures.map((measure) => (
                      <MenuItem key={measure.type} value={measure.type}>
                        {measure.translate}
                      </MenuItem>
                    ))}
                  </TextField>

                  <IconButton onClick={() => deleteIntake(index, intakeIndex)}>
                    <Delete />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
        <Button variant="contained" onClick={saveTreatment}>
          Сохранить
        </Button>
      </Stack>
    </Container>
  );
};

export default AddTreatment;
