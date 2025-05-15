import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';

import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Stack,
  Divider,
  Paper,
} from "@mui/material";
import EventViewMap from "./EventViewMap";

import Cookies from 'js-cookie';

import { fetchEventRequest, fetchEventMembersRequest } from '../healthSlice'

// const event = {
//   title: "🚴‍♂️ Велопробег по городу",
//   description:
//     "Присоединяйтесь к нашей весёлой группе велосипедистов! Будем кататься по основным достопримечательностям города, делая фото и отдыхая на остановках.",
//   location: {
//     title: "Центральная площадь",
//     description: "Место сбора возле главного фонтана напротив мэрии.",
//     latitude: 50.4501,
//     longitude: 30.5234,
//   },
//   participants: [
//     { id: 1, name: "Иван Иванов" },
//     { id: 2, name: "Мария Петрова" },
//     { id: 3, name: "Алексей Смирнов" },
//     { id: 4, name: "Ольга Сидорова" },
//   ],
// };

const EventView = () => {
  const { id } = useParams();
  console.log('event id is ' + id);

  const dispatch = useDispatch(); 

  const event = useSelector((state) => state.health.event);
  const eventMembers = useSelector((state) => state.health.members);
  
  const [username, setUsername] = useState("");
  const [memberNames, setMemberNames] = useState(new Map());

  const fetchUsers = async (ids)=>{
      const params = new URLSearchParams();
      ids.forEach(i => params.append('ids', i));
      params.append("page", 0);
      params.append("limit", 25);
      let res = await fetch("http://localhost:3003/users?" + params, {
        headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')}
      });
      const users = await res.json();
      users.content.forEach(u => memberNames.set(u.id, u.username))
      setMemberNames(new Map(memberNames));
      console.log(memberNames);
    }

  useEffect(() => {
    dispatch(fetchEventRequest({id: id}));
  }, [dispatch]);

  useEffect(() => {
    if(event != null) {
        dispatch(fetchEventMembersRequest({id: id, page: 0, limit: 25}));
    }
  }, [event]);

  useEffect(() => {
    const ids = [];
    console.log('here');
    console.log(eventMembers);
    eventMembers.length > 0 && eventMembers.forEach((em) => {
      if(!memberNames.has(em.userId)) {
        ids.push(em.userId);
      }
    });
    if(ids.length > 0) {
      fetchUsers(ids);
    }
  }, [eventMembers]);

  return (
    <Container maxWidth="lg" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 5, mb: 5, borderRadius: 3 }}>
        <Typography variant="h3" fontWeight="bold" gutterBottom color="primary">
          {event && event.title}
        </Typography>
        <Typography variant="body1" fontSize={18}>
          {event && event.description}
        </Typography>
      </Paper>

      <Card sx={{ mb: 5 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            📍 Место проведения мероприятия
          </Typography>
          <Typography variant="subtitle1" fontWeight="bold">
            {event && event.place.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {event && event.place.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Координатные точки (широта, долгота): {event && event.place.latitude}, {event && event.place.longitude}
          </Typography>
        </CardContent>
      </Card>

      <Box sx={{ mb: 5 }}>
        <EventViewMap
          latitude={event && event.place.latitude}
          longitude={event && event.place.longitude}
          zoom={13}
        />
      </Box>

      <Stack spacing={3}>
        <Typography variant="h5">👥 Участники</Typography>
        <TextField
          label="Поиск по имени"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <List>
          {eventMembers && eventMembers.size === 0 && (
            <Typography color="text.secondary" mt={2}>
              Пока участники отсутствуют
            </Typography>
          )}

          {eventMembers.length > 0 && eventMembers.map((member, index) => (
            <React.Fragment key={member.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{memberNames.has(member.userId) && memberNames.get(member.userId).charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={memberNames.has(member.userId) && memberNames.get(member.userId)}
                  secondary={`ID: ${member.id}`}
                  primaryTypographyProps={{ fontWeight: "medium" }}
                />
              </ListItem>
              {index < eventMembers.length - 1 && <Divider variant="inset" component="li" />}
            </React.Fragment>
          ))}
        </List>
      </Stack>
    </Container>
  );
};

export default EventView;
