import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useSearchParams} from "react-router-dom";
import {
  Box, Container, Stack, TextField, Typography, Button, Card, CardContent, Link
} from "@mui/material";
import EventSearchMap from "./EventSearchMap"; // Путь к компоненту карты

import { fetchEventsRequest, fetchUserIdRequest, joinEventRequest } from '../healthSlice'

import Cookies from 'js-cookie';
import { format } from "date-fns";

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c / 1000;
};

const EventSearch = () => {
  const dispatch = useDispatch();

  const events = useSelector((state) => state.health.events);
  const userId = useSelector((state) => state.health.userId);
  const joinedEvent = useSelector((state) => state.health.joinedEvent);

  const [title, setTitle] = useState("");
  const [coords, setCoords] = useState({latitude: 55, longitude: 37});
  const [participateStatus, setParticipateStatus] = useState(new Set());

  useEffect(() => {
      dispatch(fetchEventsRequest({title: title, latitude: coords.latitude, longitude: coords.longitude, page: 0, limit: 25}));
      }, [title, coords]);
  
  useEffect(() => {
      dispatch(fetchUserIdRequest());
      }, [dispatch]);
  
  useEffect(() => {
    if(events.length > 0 && userId != null) {
      fetchParticipateStatus(userId, events.map(e => e.id));
    }
    }, [events, userId]);

    useEffect(() => {
      if(joinedEvent != null) {
        participateStatus.add(joinedEvent);
      }
      }, [joinedEvent]);

  const handleMapClick = useCallback((e) => {
    const { lng, lat } = e.lngLat;
    setCoords({ longitude: lng, latitude: lat });
  }, []);

  const handleJoinClick = (eventId) => {
    dispatch(joinEventRequest({eventId: eventId}));
  };

  const fetchParticipateStatus = async (userId, eventIds)=>{
    const params = new URLSearchParams();
    params.append("user_id", userId);
    eventIds.forEach(ei => params.append('event_ids', ei));
    params.append("page", 0);
    params.append("limit", 50);
    let res = await fetch("http://localhost:3002/participate?" + params, {
      headers: {'Authorization': 'Bearer ' + Cookies.get('access_token')}
    });
    const statuses = await res.json();
    statuses.forEach(s => participateStatus.add(s.eventId))
    setParticipateStatus(new Set(statuses));
  }

  const points = events && events.map((event) => ({
    lng: event.place.longitude,
    lat: event.place.latitude,
    popup: `<b>${event.title}</b><br/>${event.place.title}`,
  }));

  useEffect(() => {
      dispatch(fetchEventsRequest({title: title, latitude: coords.latitude, longitude: coords.longitude, page: 0, limit: 25}));
      }, [title, coords]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h5">Поиск мероприятий</Typography>
        <TextField
          label="Поиск по названию"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />

        <EventSearchMap
          onClick={handleMapClick}
          markers={points}
          highlight={
            coords
              ? { lng: coords.longitude, lat: coords.latitude }
              : null
          }
        />

        <Stack spacing={2}>
          {events && events.map((event) => {
            const distance = coords
              ? haversineDistance(
                  coords.latitude,
                  coords.longitude,
                  event.place.latitude,
                  event.place.longitude
                ).toFixed(2)
              : null;

            return (
              <Card key={event.id}>
                <CardContent>
                  <Link variant="h6" fontWeight={700} gutterBottom href={"/events/" + event.id}>{event.title}</Link>
                  <Typography>{event.description}</Typography>
                  <Box sx={{ color: 'text.primary', fontWeight: 'bold' }} mt={1}>{format(event.appointedTime, "dd.MM.yyyy HH:mm")}</Box>
                  <Typography fontSize={14} mt={1}>
                    <strong>Место:</strong> {event.place.title} — {event.place.description}
                  </Typography>
                  {distance && (
                    <Typography fontSize={13} color="text.secondary" mt={0.5}>
                      Расстояние: {distance} км
                    </Typography>
                  )}
                  {participateStatus.has(event.id) && (
                    <Button variant="contained" sx={{ mt: 1 }} onClick={handleJoinClick(event.id)}>
                    Вступить
                  </Button>
                )}
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    </Container>
  );
};

export default EventSearch;
