import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import {
  TextField,
  Button,
  Grid,
  Paper,
  Typography,
  IconButton,
  Autocomplete,
  Box,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  fetchNutritionValuesRequest,
  addFoodRequest,
} from '../healthSlice.js';

const AddFood = () => {
  const nutritionValues = useSelector((state) => state.health.nutritionValues);
  const loading = useSelector((state) => state.health.loading);
  const error = useSelector((state) => state.health.error);
  const dispatch = useDispatch();

  const [foodName, setFoodName] = useState('');
  const [selectedValue, setSelectedValue] = useState('');
  const [addedNutritionValues, setAddedNutritionValues] = useState([]);

useEffect(() => {
    dispatch(fetchNutritionValuesRequest({page: 0, limit: 25}));
  }, [dispatch]);

  const handleAddMetric = () => {
    console.log(selectedValue);
    if (
      selectedValue &&
      !addedNutritionValues.some((m) => m.translation.toLowerCase() === selectedValue.toLowerCase())
    ) {
    console.log(nutritionValues.find(nv => nv.translation === selectedValue).value);
      setAddedNutritionValues([...addedNutritionValues, { nutritionValue: nutritionValues.find(nv => nv.translation === selectedValue).value, value: '', translation: selectedValue }]);
      setSelectedValue('');
    }
  };

  const handleMetricValueChange = (index, newValue) => {
    const updatedMetrics = [...addedNutritionValues];
    updatedMetrics[index].value = newValue;
    setAddedNutritionValues(updatedMetrics);
  };

  const handleRemoveMetric = (index) => {
    const updatedMetrics = [...addedNutritionValues];
    updatedMetrics.splice(index, 1);
    setAddedNutritionValues(updatedMetrics);
  };

  const handleAddFood = () => {
    const foodData = {
      title: foodName,
      foodValues: addedNutritionValues
    };
    console.log('adding food');
    console.log(foodData);
    dispatch(addFoodRequest(foodData));

    setFoodName('');
    setAddedNutritionValues([]);
  };

  return (
    <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Добавить еду
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Название еды"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
          />
        </Grid>

        <Grid item xs={9}>
          <Autocomplete
            freeSolo
            options={nutritionValues.map(nv => nv.translation)}
            inputValue={selectedValue}
            onInputChange={(e, newInputValue) => setSelectedValue(newInputValue)}
            renderInput={(params) => (
              <TextField {...params} label="Добавить показатель" />
            )}
          />
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddMetric}
            disabled={!selectedValue}
          >
            Добавить
          </Button>
        </Grid>

        {/* Список метрик */}
        <Grid item xs={12}>
          <Stack spacing={2}>
            {addedNutritionValues.map((nv, index) => (
              <Box
                key={index}
                display="flex"
                alignItems="center"
                sx={{
                  border: '1px solid #ccc',
                  p: 2,
                  borderRadius: 2,
                  justifyContent: 'space-between',
                }}
              >
                <Typography sx={{ minWidth: '100px' }}>{nv.translation}</Typography>
                <TextField
                  label="Значение"
                  type="number"
                  value={nv.value}
                  onChange={(e) => handleMetricValueChange(index, e.target.value)}
                  sx={{ mx: 2, width: '150px' }}
                />
                <IconButton onClick={() => handleRemoveMetric(index)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="success"
            onClick={handleAddFood}
            disabled={!foodName || addedNutritionValues.length === 0}
          >
            Сохранить еду
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default AddFood;
