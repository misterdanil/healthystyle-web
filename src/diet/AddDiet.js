import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  TextField,
  Typography,
  Button,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Card,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Autocomplete,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import {
  fetchFoodsRequest,
  addDietRequest
} from '../healthSlice.js';
import { current } from "@reduxjs/toolkit";

import DietMenu from "./DietMenu.js";

const days = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const AddDiet = () => {
  const foods = useSelector((state) => state.health.foods);

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [meals, setMeals] = useState([]);
  const [mealTemplates, setMealTemplates] = useState([{dayNumber: 0, day: "Понедельник", time: '00:00', food: null, weight: 0}, {dayNumber: 1, day: "Вторник", time: '00:00', food: null, weight: 0}, {dayNumber: 2, day: "Среда", time: '00:00', food: null, weight: 0}, {dayNumber: 3, day: "Четверг", time: '00:00', food: null, weight: 0}, {dayNumber: 4, day: "Пятница", time: '00:00', food: null, weight: 0}, {dayNumber: 5, day: "Суббота", time: '00:00', food: null, weight: 0}, {dayNumber: 6, day: "Воскресенье", time: '00:00', food: null, weight: 0}]);
  const addedDiet = useSelector((state) => state.health.addedDiet);

  const [searchTitle, setSearchTitle] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
        dispatch(fetchFoodsRequest({title: searchTitle, page: 0, limit: 25, sort: 'TITLE'}));
  }, [dispatch, searchTitle]);

  useEffect(() => {
    // setTitle('');
    // setStartDate("");
    // setEndDate("");
    // setMeals([]);
  }, [addedDiet]);

  const handleAddMeal = (index) => {
    // setMealTemplates([...mealTemplates, { day: "Monday", time: "", food: [], newFood: null, weight: "" }]);
    console.log('adding food ');
    // console.log(mealTemplates[index]);
    const currentMeals = [...meals, {day: mealTemplates[index].dayNumber, food: mealTemplates[index].food, time: mealTemplates[index].time, weight: mealTemplates[index].weight, foodId: mealTemplates[index].food.id}];
    currentMeals.sort((a, b) => {
      const aSplitted = a.time.split(':');
      const bSplitted = b.time.split(':');
      console.log(aSplitted[0]);
      return (Number(aSplitted[0]) * 60 + Number(aSplitted[1])) - (Number(bSplitted[0]) * 60 + Number(bSplitted[1]));
    });
    console.log(currentMeals);
    setMeals(currentMeals);
  };

  // const handleAddMeal = (index) => {
  //   const existenceMeal = {day: mealTemplates[index].dayNumber, time: mealTemplates[index].time};
  //   const newMealFood = {food: mealTemplates[index].food, weight: mealTemplates[index].weight, foodId: mealTemplates[index].food.id};
  //   if(meals.has(existenceMeal)) {
  //     meals.get(existenceMeal).mealFoods.put([...meals.get(existenceMeal), newMealFood]);
  //   }
  //   else {
  //     meals.put(existenceMeal, [newMealFood]);
  //   }
  //   // const currentMeals = [...meals, {day: mealTemplates[index].dayNumber, food: mealTemplates[index].food, time: mealTemplates[index].time, weight: mealTemplates[index].weight, foodId: mealTemplates[index].food.id}];
  //   // currentMeals.sort((a, b) => {
  //   //   const aSplitted = a.time.split(':');
  //   //   const bSplitted = b.time.split(':');
  //   //   console.log(aSplitted[0]);
  //   //   return (Number(aSplitted[0]) * 60 + Number(aSplitted[1])) - (Number(bSplitted[0]) * 60 + Number(bSplitted[1]));
  //   // });
  //   // console.log(currentMeals);
  //   setMeals(new Map(meals));
  // };

  const handleRemoveMeal = (meal) => {
    const currentMeals = [...meals];
    currentMeals.splice(meals.indexOf(meal), 1);
    setMeals(currentMeals);
  };

  const handleSetSearchTitle = (title) => {
    console.log('changing title to ' + title);
    setSearchTitle(title);
}

const handleSetTime = (time, index) => {
    console.log('changing time to ' + time);
    const currentMeals = [...mealTemplates];
    currentMeals[index].time = time;
    setMealTemplates(currentMeals);
}

const handleSetFood = (food, index) => {
  console.log('new food');
  console.log(food);
  const currentMeals = [...mealTemplates];
  currentMeals[index].food = food;
  setMealTemplates(currentMeals);
}

const handleSetWeight = (weight, index) => {
  console.log('new weight');
  console.log(weight);
  const currentMeals = [...mealTemplates];
  currentMeals[index].weight = weight;
  setMealTemplates(currentMeals);
}

const handleCreateDiet = () => {
  const formattedMeals = [];
  
  meals.sort((a, b) => {
    const aSplitted = a.time.split(':');
    const bSplitted = b.time.split(':');
    console.log(aSplitted[0]);
    return a.day - b.day || (Number(aSplitted[0]) * 60 + Number(aSplitted[1])) - (Number(bSplitted[0]) * 60 + Number(bSplitted[1]));
  });
  console.log(meals);
  let meal = null;
  let index = 0;
  for(let i = 0; i < meals.length; i++) {
    if(i == 0) {
      meal = {time: meals[i].time, day: meals[i].day, mealFoods: [{foodId: meals[i].foodId, weight: meals[i].weight}]};
      index = formattedMeals.push(meal) - 1;
    }
    else if(meals[i].day == meals[i - 1].day && meals[i].time == meals[i - 1].time) {
      formattedMeals[index].mealFoods.push({foodId: meals[i].foodId, weight: meals[i].weight});
    }
    else {
      meal = {time: meals[i].time, day: meals[i].day, mealFoods: [{foodId: meals[i].foodId, weight: meals[i].weight}]};
      index = formattedMeals.push(meal) - 1;
    }
  }

  console.log('ready formatted meals');
  console.log(formattedMeals);
  const diet = {
    title: title,
    meals: formattedMeals,
    start: startDate,
    end: endDate
  };
  console.log(diet);
  dispatch(addDietRequest(diet));
}

  return (
    <div>
      <DietMenu/>
    <Container>
      <Typography variant="h4" gutterBottom>
        Создание диеты
      </Typography>
      <TextField
        fullWidth
        margin="normal"
        label="Название диеты"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="Начало"
            slotProps={{ inputLabel: {shrink: true} }}   
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            type="date"
            label="Конец"
            slotProps={{ inputLabel: {shrink: true} }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Grid>
      </Grid>

      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Приёмы пищи
      </Typography>

      {mealTemplates.map((mealTemplate, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <Typography sx={{width: 100}}
                    // onChange={(e) => {
                    //   const updated = [...mealTemplates];
                    //   updated[index].day = e.target.value;
                    //   setMealTemplates(updated);
                    // }}
                  >
                    {/* {days.map((day) => (
                      <MenuItem key={day} value={day}>
                        {day}
                      </MenuItem>
                    ))} */}
                    {mealTemplate.day}
                  </Typography>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="time"
                  label="Time"
                  InputLabelProps={{ shrink: true }}
                  value={mealTemplate.time}
                  onChange={(e) => handleSetTime(e.target.value, index)}
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  options={foods}
                  getOptionLabel={(option) => `${option.title} | ${option.foodValues.map((fv) => fv.nutritionValue.translation + ':' + fv.value + 'г').join(', ')}`}
                  renderInput={(params) => <TextField {...params} label="Поиск еды" onChange={(e) => handleSetSearchTitle(e.target.value)}
                  sx={{width: 300}}
                  />}
                  value={mealTemplate.food}
                  onChange={(e, food) => handleSetFood(food, index)}
                  slotProps={{ popper: { style: { width: 'fit-content' } } }}
                  />
              </Grid>
              <Grid item xs={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Вес (г)"
                  value={mealTemplate.weight}
                  onChange={(e) => handleSetWeight(e.target.value, index)}
                />
              </Grid>
              <Grid item xs={1}>
                <IconButton onClick={() => handleAddMeal(index)}>
                  <Add />
                </IconButton>
              </Grid>
            </Grid>
            <List>
              {meals.filter(m => m.day == index).map((meal, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`${meal.time} - ${meal.food.title} - ${meal.weight}г`}
                    secondary={`${meal.food.foodValues.map((fv) => fv.nutritionValue.translation + ': ' + fv.value + 'г').join(', ')}`}
                  />
                              <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={() => handleRemoveMeal(meal)}
              sx={{ mt: 1 }}
            >
              Удалить приём пищи
            </Button>
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      ))}

      <Button variant="contained" color="primary" onClick={() => handleCreateDiet()}>
        Save Diet
      </Button>
    </Container>
    </div>
  );
};

export default AddDiet;
