import React, { useState, useEffect } from "react";
import { useSearchParams} from "react-router-dom";

import { Card, CardContent } from "@mui/material";
import { Box, Button } from "@mui/material";
import { TextField } from "@mui/material";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchMetricsRequest,
  addMetricValueRequest
} from './healthSlice.js';

import IndicatorMenu from "./IndicatorMenu";

import InnerMenu from './InnerMenu.js';

import Menu from './InnerMenu';

import { ruRU as coreRuRU } from '@mui/material/locale';
import { ruRU } from '@mui/x-date-pickers/locales';

import { ru } from 'date-fns/locale/ru';

import { checkAuth } from './oauth2.js';

const AddMetric = () => {
  const [searchParams] = useSearchParams();
  checkAuth('http://localhost:3001/metrics', 'GET', "http://localhost:3001/oauth2/redirect", "http://localhost:3001/oauth2/refresh", window.location.href, searchParams);
   
  const metrics = useSelector((state) => state.health.metrics);
  const loading = useSelector((state) => state.health.loading);
  const error = useSelector((state) => state.health.error);
  const dispatch = useDispatch();

  const [metric, setMetric] = useState("glucose");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    dispatch(fetchMetricsRequest({page: 0, limit: 5, sort: "NAME"}));
  }, [dispatch]);

  console.log(metrics);

  const handleSubmit = (e) => {
    e.preventDefault();
    var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    if(metric && value) {
      dispatch(addMetricValueRequest({indicatorTypeId: metric, value: value, date: isoDateTime}));
      setValue("");
  }
}

const routes = [{label: 'Добавить значение показателя', path: '/add-metric'}, {label: 'Добавленные значения', path: '/view-metric'}, {label: 'Динамика', path: '/metric-statistic'}];

  return (
    <div>
    <InnerMenu routes={routes} />
    <Card sx={{ padding: 3, width: 350, margin:'auto' }}>
      <CardContent component="form" onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Выбрать показатель здоровья</InputLabel>
          <Select value={metric} onChange={(e) => setMetric(e.target.value)} label="Выбрать показатель здоровья">
            {metrics.map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField 
          fullWidth 
          label="Введите значение показателя" 
          type="number" 
          value={value} 
          onChange={(e) => setValue(e.target.value)} 
          margin="normal"
        />

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
          <DateTimePicker 
            label="Выбрать дату и время" 
            value={date} 
            onChange={(newDate) => setDate(newDate)}
            renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
          />
        </LocalizationProvider>

        <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }} type="submit">
          Сохранить
        </Button>
      </CardContent>
    </Card>
    </div>
  );
};

export default AddMetric;
