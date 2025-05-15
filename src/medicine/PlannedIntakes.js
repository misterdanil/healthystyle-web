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

import { fetchIntakesRequest, fetchNextIntakesRequest, addIntakeResultRequest } from "../healthSlice";

import { checkAuth } from "../oauth2.js";

const days = [
  "Понедельник", "Вторник", "Среда",
  "Четверг", "Пятница", "Суббота", "Воскресенье"
];

const PlannedIntakes = () => {
  const intakes = useSelector((state) => state.health.intakes);
  const nextIntakes = useSelector((state) => state.health.nextIntakes);
  const addedIntakeResult = useSelector((state) => state.health.addedIntakeResult);

  const [completetions, setCompletetions] = useState(new Map());
  const [waitCompletetions, setWaitCompletetions] = useState(new Set());

  const dispatch = useDispatch();

  const [searchParams] = useSearchParams();
  
  checkAuth('http://localhost:3001/intakes', 'GET', "http://localhost:3001/oauth2/redirect", window.location.href, searchParams);

  useEffect(() => {
    dispatch(fetchIntakesRequest({page: 1, limit: 25}));
    dispatch(fetchNextIntakesRequest({page: 1, limit: 25}));
  }, [dispatch]);

  useEffect(() => {
    console.log('got it');
    console.log(addedIntakeResult);
    completetions.delete(addedIntakeResult);
    waitCompletetions.delete(addedIntakeResult);
    setCompletetions(new Map(completetions));
    setWaitCompletetions(waitCompletetions);
  }, [addedIntakeResult]);

  const handleSetCompletetion = (id, date) => {
    completetions.set(id, date);
    setCompletetions(new Map(completetions));
  };

  const handleSendCompletetion = (id) => {
    waitCompletetions.add(id);
    setWaitCompletetions(new Set(waitCompletetions));
    dispatch(addIntakeResultRequest({id: id, result: {date: completetions.get(id).getFullYear() + '-' + ('0' + (completetions.get(id).getMonth()+1)).slice(-2) + '-' + ('0' + completetions.get(id).getDate()).slice(-2)}}));
  }

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
          <Box mb={5}>
          {nextIntakes[0] && <Typography variant="h5" gutterBottom fontWeight={600}>
          📌 Следующий приём сегодня в {nextIntakes[0].time}
                    </Typography>}
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
          {nextIntakes && nextIntakes.map((nextIntake, index) => (
            <CardContent>
              <Typography variant="subtitle1" mb={1}>
                {nextIntake.plan.treatment.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>
                План: {format(new Date(nextIntake.plan.start), "dd.MM.yyyy")} –{" "}
                {format(new Date(nextIntake.plan.end), "dd.MM.yyyy")} | {nextIntake.plan.sequence}
              </Typography>
              <List>
                  <ListItem key={index} disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 16 }}
                      primary={`${nextIntake.plan.medicine.name} — ${nextIntake.weight} ${nextIntake.measure.translate}`}
                    />
                  </ListItem>
              </List>
            </CardContent>
                  ))}
          </Card>
        </Box>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" gutterBottom fontWeight={600}>
        📅 Будущие приёмы лекарств
      </Typography>

      <Stack spacing={3}>
        {intakes && intakes.map((intake) => (
          <Card
            key={intake.id}
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
                {intake.plan.treatment.description}
              </Typography>

              <Typography variant="body2" mt={0.5}>
                План: {format(new Date(intake.plan.start), "dd.MM.yyyy")} —{" "}
                {format(new Date(intake.plan.end), "dd.MM.yyyy")} | {intake.time}
              </Typography>

              <List sx={{ mt: 1 }}>
                  <ListItem key={1} disablePadding sx={{ py: 1 }}>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: 15 }}
                      primary={`${intake.plan.medicine.name} — ${intake.weight} ${intake.measure.translate}`}
                    />
                  </ListItem>
              </List>

              <Stack direction="row" alignItems="center" spacing={2} mt={2}>
                <DatePicker
                  onChange={(date) => handleSetCompletetion(intake.id, date)}
                  dateFormat="dd.MM.yyyy"
                  slotProps={{ textField: { size: 'small' } }}
                  filterDate={(date) => date.getDay() === intake.day}
                  locale={ru}
                  customInput={<Button variant="outlined">Изменить дату</Button>}
                />
                {completetions.has(intake.id) && (
                  <>
                <Typography variant="subtitle1" fontWeight={500} mb={1}>
                  {completetions.get(intake.id).toLocaleDateString('ru-RU')}
                </Typography>
                <Button
                  variant="contained"
                  color="success"
                  disabled={intake.accepted}
                  onClick={() => handleSendCompletetion(intake.id)}
                >
                  {waitCompletetions.has(intake.id) ? "Обработка..." : "Отметить как принято"}
                </Button>
                </>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default PlannedIntakes;
