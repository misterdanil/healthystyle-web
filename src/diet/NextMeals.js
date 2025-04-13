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
  Link
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import MealMenu from './MealMenu.js';

import { fetchNextMealsRequest, fetchPlannedMealsRequest } from '../healthSlice.js'

const NextMeals = () => {
  const theme = useTheme();

  const nextMeals = useSelector((state) => state.health.meals);

  const [time, setTime] = useState(null);
  
  const dispatch = useDispatch();
    
  useEffect(() => {
        dispatch(fetchNextMealsRequest({page: 1, limit: 25}));
      }, [dispatch]);

 useEffect(() => {
  if(nextMeals != null && nextMeals.length > 0) {
    setTime(nextMeals[0].time);
  }
}, [nextMeals]);
    

  return (
    <div>
    <MealMenu />
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" gutterBottom fontWeight={700} color="primary">
        Следующий приём пищи на сегодня на {time}
      </Typography>
      <Stack spacing={6}>
            <Grid container spacing={2}>
              {nextMeals.map((meal, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card
                    sx={{
                      minWidth: 250,
                      height: "100%",
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
                      <Typography
                        variant="subtitle2"
                        component={RouterLink}
                        to={`/diet/${encodeURIComponent(meal.diet.title)}`}
                        sx={{ textDecoration: "none", color: theme.palette.primary.main, fontWeight: 600 }}
                        gutterBottom
                      >
                        {meal.diet.title}
                      </Typography>
                      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                        {meal.day}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        {meal.time}
                      </Typography>
                      <Divider sx={{ my: 1 }} />
                      {meal.foods.map((mealFood, index) => (
                        <Typography variant="body2" key={index} sx={{ mt: 0.5 }}>
                          <strong>{mealFood.food.title}</strong> — {mealFood.weight}г
                        </Typography>
                      ))}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
      </Stack>
    </Container>
    </div>
  );
};

export default NextMeals;