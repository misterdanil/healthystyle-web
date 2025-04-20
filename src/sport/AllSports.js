import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Stack,
  Grid,
  Paper
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { fetchSportsRequest } from "../healthSlice";

const days = [
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
    "Воскресенье",
  ];

const AllSports = () => {
  const sports = useSelector((state) => state.health.sports);
    
  const [searchDescription, setSearchDescription] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchSportsRequest({description: '', page: 1, limit: 25}));
}, [dispatch]);

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Планы занятий
      </Typography>

      <TextField
        fullWidth
        label="Поиск по описанию"
        variant="outlined"
        value={searchDescription}
        onChange={(e) => setSearchDescription(e.target.value)}
        sx={{ mb: 4 }}
      />

      <Stack spacing={3}>
        {sports && sports.map((sport) => (
          <Card key={sport.id} sx={{ borderLeft: "5px solid #2196f3" }}>
            <CardContent>
              <Typography variant="h6" color="primary">
                {sport.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {sport.start} - {sport.end}
              </Typography>

              <Box mt={2}>
                {sport.trains.map((train) => (
                  <Accordion key={train.id} sx={{ mb: 1, backgroundColor: '#f9f9f9' }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <Typography>{train.description}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography variant="body2" color="text.secondary">
                            {days[train.day]} в {train.time}
                          </Typography>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Stack spacing={1}>
                          {train.sets.map((set) => (
                            <Box
                              key={set.id}
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                backgroundColor: "#e3f2fd",
                                px: 2,
                                py: 1,
                                borderRadius: 1,
                              }}
                            >
                              <Typography>{set.exercise.title}</Typography>
                              <Typography>
                                Подходов: {set.count}, Повторений: {set.repeat}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Paper>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default AllSports;
