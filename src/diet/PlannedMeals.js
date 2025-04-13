import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Stack,
  Divider,
  useTheme,
} from "@mui/material";

import {
  fetchPlannedMealsRequest
} from '../healthSlice.js';

import MealMenu from "./MealMenu.js";

const PlannedMeals = () => {
  const theme = useTheme();

  const plannedMeals = useSelector((state) => state.health.meals);

  const [diets, setDiets] = useState(new Map());

  const dispatch = useDispatch();
  
  useEffect(() => {
        dispatch(fetchPlannedMealsRequest({page: 1, limit: 25}));
    }, [dispatch]);
  
  useEffect(() => {
  if(plannedMeals != null && plannedMeals.length > 0) {
    plannedMeals.forEach(pm => {
      const dietId = pm.diet.id;
      if(diets.has(dietId)) {
        diets.get(dietId).meals.push(pm);
      }
      else {
        diets.set(dietId, {title: pm.diet.title, meals: [pm]});
      }
    });
    setDiets(new Map(diets));
    console.log(diets);
  }
}, [plannedMeals]);

  return (
    <div>
      <MealMenu />
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        Запланированные приёмы пищи
      </Typography>
      <Stack spacing={6}>
        {Array.from(diets).map(([key, value]) => (
          <Box key={key}>
            <Typography
              variant="h5"
              sx={{ mb: 3, fontWeight: 600, color: theme.palette.secondary.main }}
            >
              {value.title}
            </Typography>
            <Grid container spacing={2}>
              {value.meals.map((meal, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                  <Card
                    sx={{
                      height: "100%",
                      minWidth: 250,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      backgroundColor: theme.palette.background.paper,
                      borderRadius: 3,
                      boxShadow: 4,
                      px: 1.5,
                      py: 2,
                    }}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {meal.day}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {meal.time}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      {meal.foods.map((mealFood, i) => (
                        <Typography variant="body2" key={i} sx={{ mt: 0.5 }}>
                          <strong>{mealFood.food.title}</strong> — {mealFood.weight}г
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            </Box>
        ))}
      </Stack>
    </Container>
    </div>
  );
};

export default PlannedMeals;
