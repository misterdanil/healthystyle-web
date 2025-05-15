import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams} from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Button,
  Stack,
  Autocomplete,
  Card,
  CardContent,
} from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import { ru } from 'date-fns/locale/ru';

import EventCreationMap from './EventCreationMap';

import { addEventRequest, fetchUsersRequest, fetchUserIdRequest } from "../healthSlice";

import Cookies from 'js-cookie';

const AddEvent = () => {
  const [searchParams] = useSearchParams();
  if(searchParams.get('access_token') != null) {
    Cookies.set('access_token', searchParams.get('access_token'));
    Cookies.set('refresh_token', searchParams.get('refresh_token'));
  }
  const checkAuth = async ()=>{
    var config = {};
    if(Cookies.get('access_token') != null) {
      config = {Authorization: "Bearer " + Cookies.get("access_token"), 'Access-Control-Allow-Origin': 'http://localhost:3000'}
    }
    config['Access-Control-Request-Method'] = 'POST';
    let res = await fetch("http://localhost:3002/event", {
      credentials: "include",
      method: "OPTIONS",
      headers: config
    });
    if(res.status == 401) {
      res = await fetch('http://localhost:3002/oauth2/redirect', {
        credentials: "include"
      })
      const redirectUri = await res.text();
      window.location.replace(redirectUri);
      // res = await fetch(redirectUri, {
      //   credentials: "include", // обязательное поле!
      // });
      // if(res.status == 401) {
        // navigate('/auth');
      // }
      // window.location.replace('http://localhost:3002/auth');
    }
    // const data = await res.json();
    // console.log(data);
    // if(data == 'false') {
    //   navigate('/auth')
    // }
  }

  checkAuth();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector((state) => state.health.users);
  const userId = useSelector((state) => state.health.userId);
  const addedEvent = useSelector((state) => state.health.addedEvent);

  const [username, setUsername] = useState('');
  const [event, setEvent] = useState({
    title: '',
    description: '',
    userIds: [],
    appointedTime: '',
    place: {
      title: '',
      description: '',
      latitude: null,
      longitude: null,
    },
  });

  useEffect(() => {
    dispatch(fetchUserIdRequest());
    }, [dispatch]);

  useEffect(() => {
    if(addedEvent != null) {
      navigate(addedEvent);
    }
    }, [addedEvent]);

  useEffect(() => {
    dispatch(fetchUsersRequest({username: username, page: 0, limit: 25}));
    }, [username]);

  const handleLocationChange = (location) => {
    event.place.latitude = location.latitude;
    event.place.longitude = location.longitude
  };

  const handleSubmit =() => {
    dispatch(addEventRequest(event));
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Создание мероприятия
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Заголовок"
          name="title"
          value={event.title}
          onChange={(e) => {
            console.log(event);
            setEvent({
              ...event,
              title: e.target.value
            
  })}}
          fullWidth
        />

        <TextField
          label="Описание"
          name="description"
          value={event.description}
          onChange={(e) => {
            setEvent({
              ...event,
              description: e.target.value
            
  })}}
          fullWidth
          multiline
          rows={4}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                  <DateTimePicker 
                    label="Назначить дату и время" 
                    value={event.appointedTime} 
                    onChange={(newDate) => setEvent({...event, appointedTime: newDate})}
                    renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
                  />
                </LocalizationProvider>

        <Autocomplete
          multiple
          options={users.filter(u => u.id != userId)}
          getOptionLabel={(o) => o.username}
          onChange={(e, users) =>{
            event.userIds = users.map(user => user.id);
            setEvent({...event});
          }
          }
          renderInput={(params) => (
            <TextField {...params} label="Участники" value={username} onChange={(e) => setUsername(e.target.value)} />
          )}
        />

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Место проведения
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Название места"
                value={event.place.title}
                onChange={(e) =>{
                  event.place.title = e.target.value;
                  setEvent({...event});
                }
                }
              />
              <TextField
                label="Описание места"
                value={event.place.description}
                onChange={(e) => {
                  event.place.description = e.target.value;
                  setEvent({...event});
                }
                }
              />

              <Typography variant="body2">
                Выбор места проведения
              </Typography>

              <EventCreationMap onLocationSelect={handleLocationChange} />

              {event.place.latitude && (
                <Typography variant="body2" color="text.secondary">
                  Координаты: {event.place.latitude},{' '}
                  {event.place.longitude}
                </Typography>
              )}
            </Stack>
          </CardContent>
        </Card>

        <Button variant="contained" size="large" onClick={handleSubmit}>
          Создать мероприятие
        </Button>
      </Stack>
    </Container>
  );
};

export default AddEvent;
