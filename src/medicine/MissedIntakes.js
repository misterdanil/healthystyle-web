import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams} from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { fetchMissedIntakesRequest, addIntakeResultRequest } from "../healthSlice";

import { checkAuth } from "../oauth2.js";

const days = [
  "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота", "Воскресенье"
];

const MissedIntakes = () => {
  const missedIntakes = useSelector((state) => state.health.missedIntakes);
  const addedIntakeResult = useSelector((state) => state.health.addedIntakeResult);

  const [waitCompletetions, setWaitCompletetions] = useState(new Set());

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  
  checkAuth('http://localhost:3001/intakes?missed', 'GET', "http://localhost:3001/oauth2/redirect", "http://localhost:3001/oauth2/refresh", window.location.href, searchParams);

  useEffect(() => {
    dispatch(fetchMissedIntakesRequest({page: 1, limit: 25}));
  }, [dispatch]);

  useEffect(() => {
    console.log(addedIntakeResult);
    console.log(waitCompletetions);
    waitCompletetions.delete(addedIntakeResult);
    setWaitCompletetions(waitCompletetions);
    console.log(waitCompletetions);
    dispatch(fetchMissedIntakesRequest({page: 1, limit: 25}));
  }, [addedIntakeResult]);

  const handleSendCompletetion = (intake) => {
    console.log('added ' + intake.id);
    waitCompletetions.add(intake.id, intake);
    setWaitCompletetions(new Set(waitCompletetions));
    const date = new Date(intake.date);
    dispatch(addIntakeResultRequest({id: intake.id, result: {date: date.getFullYear() + '-' + ('0' + (date.getMonth()+1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)}}));
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h6" gutterBottom fontWeight={600}>
      ❌ Пропущенные приёмы лекарств
      </Typography>

      <Stack spacing={3}>
        {missedIntakes && missedIntakes.map((intake, index) => (
          <Card
            key={index}
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              opacity: intake.accepted ? 0.5 : 1,
            }}
          >
            <CardContent>
              <Typography variant="subtitle1" fontWeight={600}>
                {days[intake.day - 1]} {intake.time}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" mt={0.5}>
                {intake.treatmentDescription}
              </Typography>

              <Typography variant="body2" mt={0.5}>
                План: {format(new Date(intake.planStart), "dd.MM.yyyy")} —{" "}
                {format(new Date(intake.planEnd), "dd.MM.yyyy")} | {intake.time}
              </Typography>

              <List sx={{ mt: 1 }}>
                  <ListItem disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 15 }}
                      primary={`${intake.medicineName} — ${intake.weight} ${intake.measure}`}
                    />
                  </ListItem>
              </List>

              <Stack direction="row" alignItems="center" spacing={2} mt={2}>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>
                  {new Date(intake.date).toLocaleString('ru-RU')}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  disabled={intake.accepted}
                  onClick={() => handleSendCompletetion(intake)}
                >
                  {waitCompletetions.has(intake.id) ? "Обработка..." : "Отметить как принято"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default MissedIntakes;
