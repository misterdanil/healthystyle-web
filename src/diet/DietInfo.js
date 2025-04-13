import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const DietInfo = () => {
  const navigate = useNavigate();
  
  const selectedDiet = useSelector((state) => state.health.selectedDiet);

  const [meals, setMeals] = useState([]);
  
  const dispatch = useDispatch();
    
  const days = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

   useEffect(() => {
    console.log('fetching meals');

    const fetchMeals = async ()=>{
    for(const [index, day] of days.entries()) {
        let res = await fetch("http://localhost:3000/diets/" + selectedDiet.id + '/meals?' + new URLSearchParams({
            day: index,
            page: 0,
            limit: 25
          }));
          const data = await res.json();
          console.log(index);
          console.log(data.content);
          meals[index] = data.content;
    }
    setMeals([...meals]);
  }
  fetchMeals(); 
  }, [selectedDiet]);


  return (
    <Container sx={{ mt: 4 }}>
      <Button variant="outlined" onClick={(e) => navigate('/diets')} sx={{ mb: 2 }}>
        К диетам
      </Button>
      <Typography variant="h5" gutterBottom>
        {selectedDiet.title} ({new Date(selectedDiet.start).toLocaleDateString()} - {new Date(selectedDiet.end).toLocaleDateString()})
      </Typography>

      {days.map((day, index) => (
        <Card key={day} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{day}</Typography>
            {!meals[index] || meals[index].length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Нет запланированных приёмов пищи
              </Typography>
            ) : (
              <List>
                {meals[index] && meals[index]
                  .map((meal, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={`Время: ${meal.time.split(':').slice(0, -1).join(':')}`}
                        secondary={meal.foods
                          .map(
                            (mealFood) => `${mealFood.food.title} - ${mealFood.weight}g`
                          )
                          .join(", ")}
                      />
                    </ListItem>
                  ))}
              </List>
            )}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default DietInfo;