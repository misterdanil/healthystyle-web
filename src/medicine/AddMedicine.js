import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams} from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  MenuItem,
  Typography,
  Stack,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import Cookies from 'js-cookie';

import { fetchMeasuresRequest, addMedicineRequest, fetchMedicinesRequest, deleteMedicineRequest, fetchMedicineRequest } from "../healthSlice";

import { checkAuth } from "../oauth2.js";

const AddMedicine = () => {
  const [searchParams] = useSearchParams();

  checkAuth('http://localhost:3001/medicine', 'GET', "http://localhost:3001/oauth2/redirect", window.location.href, searchParams);

  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [weight, setWeight] = useState('');
  const [measure, setMeasure] = useState('');
  const [searchName, setSearchName] = useState('');

  const measures = useSelector((state) => state.health.measures);
  const addedMedicine = useSelector((state) => state.health.addedMedicine);
  const medicines = useSelector((state) => state.health.medicines);
  const deletedMedicine = useSelector((state) => state.health.deletedMedicine);

  const handleAdd = () => {
    if (!name || !weight || !measure) return;
    dispatch(addMedicineRequest({name: name, weight: weight, measure: measure}));
    setName('');
    setWeight('');
    setMeasure('');
  };

  useEffect(() => {
      dispatch(fetchMeasuresRequest());
    }, [dispatch]);

  useEffect(() => {
      dispatch(fetchMedicinesRequest({name: searchName, page: 0, limit: 25}));
    }, [searchName]);

  useEffect(() => {
    console.log(addedMedicine);
    if(addedMedicine != null) {
        dispatch(fetchMedicinesRequest({name: searchName, page: 0, limit: 25}));
        setName('');
        setWeight('');
        setMeasure('');
    }
    }, [addedMedicine]);
  
  useEffect(() => {
        dispatch(fetchMedicinesRequest({name: searchName, page: 0, limit: 25}));
      }, [deletedMedicine]);

  const deleteMedicine = async (medicineId)=>{
      dispatch(deleteMedicineRequest({id: medicineId}));
    }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack spacing={4}>
        <Typography variant="h4" fontWeight="bold">
          Добавление лекарства
        </Typography>

        <TextField
          label="Название"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          InputProps={{ sx: { fontSize: 18 } }}
        />

        <TextField
          label="Вес"
          name="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          fullWidth
          InputProps={{ sx: { fontSize: 18 } }}
        />

        <TextField
          label="Единица измерения"
          select
          name="type"
          value={measure}
          onChange={(e) => setMeasure(e.target.value)}
          fullWidth
          InputProps={{ sx: { fontSize: 18 } }}
        >
          {measures && measures.map((measure) => (
            <MenuItem key={measure.id} value={measure.type}>
              {measure.translate}
            </MenuItem>
          ))}
        </TextField>

        <Button variant="contained" onClick={handleAdd} sx={{ py: 1.5, fontSize: 16 }}>
          Добавить
        </Button>

        <Divider sx={{ my: 5 }} />

        {medicines && (
          <Card>
            <CardContent>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Добавленные лекарства
              </Typography>

              <TextField
                label="Поиск по названию"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                fullWidth
                sx={{ mb: 3 }}
              />

              <List
                dense
                subheader={
                  <ListSubheader sx={{ fontSize: 18 }}>
                    Название — Вес — Ед. изм.
                  </ListSubheader>
                }
              >
                {medicines.map((medicine, index) => (
                  <ListItem
                    key={medicine.id}
                    secondaryAction={
                      <IconButton edge="end" onClick={() => deleteMedicine(medicine.id)}>
                        <DeleteIcon />
                      </IconButton>
                    }
                    sx={{ py: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6">{medicine.name}</Typography>
                      }
                      secondary={
                        <Stack>
                        <Typography fontSize={16} color="text.secondary">
                          {medicine.weight} {medicine.measure.translate}
                        </Typography>
                        <Stack direction="row" spacing={2}>
                        <Typography fontSize={16} color="text.primary">
                        Время добавления:
                      </Typography>
                      <Typography fontSize={16} color="text.secondary">
                      {new Date(medicine.createdOn).toLocaleString('ru-RU')}
                      </Typography>
                      </Stack>
                      </Stack>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Container>
  );
};

export default AddMedicine;
