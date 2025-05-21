import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams} from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  TextField,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ruRU as coreRuRU } from '@mui/material/locale';
import { ruRU } from '@mui/x-date-pickers/locales';

import { ru } from 'date-fns/locale/ru';
import IndicatorMenu from "./IndicatorMenu";
import InnerMenu from './InnerMenu.js';

import { fetchMetricsRequest, fetchMetricsByNameRequest } from "./healthSlice";

import { checkAuth } from './oauth2.js';

const Statistic = () => {
  const [searchParams] = useSearchParams();
  checkAuth('http://localhost:3001/indicators', 'GET', "http://localhost:3001/oauth2/redirect", "http://localhost:3001/oauth2/refresh", window.location.href, searchParams);
 
  const metrics = useSelector((state) => state.health.metrics);
  const indicators = useSelector((state) => state.health.indicators);
  const [searchName, setSearchName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const dispatch = useDispatch();

  const routes = [{label: 'Добавить значение показателя', path: '/add-metric'}, {label: 'Добавленные значения', path: '/view-metric'}, {label: 'Динамика', path: '/metric-statistic'}];

  const SORT_OPTIONS = new Map();
  SORT_OPTIONS.set(1, {name: "Название", sort: "NAME"});
  SORT_OPTIONS.set(2, {name: "Последнее обновление", sort:"INDICATOR_CREATED_ON"});

  const RANGE_OPTIONS = new Map();
  RANGE_OPTIONS.set(1, {name: "Нет"})
  RANGE_OPTIONS.set(2, {name: "Недели", range: "WEEK"});
  RANGE_OPTIONS.set(3, {name: "Месяцу", range:"MONTH"});
  RANGE_OPTIONS.set(4, {name: "Году", range:"YEAR"});

  const [selectedSortOption, setSelectedSortOption] = useState(1);
  const [selectedRangeOption, setSelectedRangeOption] = useState(1);
  const [metricIndex, setMetricIndex] = useState(0);
  const [allIndicators, setAllIndicators] = useState(new Map());

  console.log('come metrics');
  console.log(metrics);

  console.log(SORT_OPTIONS.get(selectedSortOption).name);
  useEffect(() => {
    fetchIndicators();
  }, [selectedRangeOption, startDate, endDate]);
  useEffect(() => {
      dispatch(fetchMetricsRequest({page: 0, limit: 25, sort: SORT_OPTIONS.get(selectedSortOption).sort}));
    }, [dispatch]);
  useEffect(() => {
    console.log('metroc index ' + metricIndex);
    console.log(metrics);
    if(metrics.length > 0) {
        fetchIndicators();    
    }
    }, [metrics]);
  
  const fetchIndicators = () => {
    if(metrics.length == 0) {
      return;
    }
    metrics.map((m) => {
      const fetchData = async ()=>{
        let res;
        console.log('feeetching');
      if(selectedRangeOption > 1 && startDate instanceof Date && !isNaN(startDate)) {
        console.log('range ' + selectedRangeOption + " and start date is not null");
        if(!(endDate instanceof Date) || isNaN(endDate)) {
          setEndDate(new Date());
          return;
        }
        console.log("range query");
        res = await fetch('http://localhost:3000/metrics/' + m.id + '/indicators?page=0&limit=25&range=' + RANGE_OPTIONS.get(selectedRangeOption).range + "&start=" + startDate.toISOString() + "&end=" + endDate.toISOString())
      }
      else if(selectedRangeOption == 1 && startDate instanceof Date && !isNaN(startDate)) {
        console.log('range ' + selectedRangeOption + " without range");

        if(!(endDate instanceof Date) || isNaN(endDate)) {
          setEndDate(new Date());
          return;
        }
        res = await fetch('http://localhost:3000/metrics/' + m.id + '/indicators?page=0&limit=25&start=' + startDate.toISOString() && "end=" + endDate.toISOString())
      }
      else {
        console.log('range ' + selectedRangeOption);
        console.log(startDate == null);

        res = await fetch('http://localhost:3000/metrics/' + m.id + '/indicators?page=0&limit=25&sort=DATE&direction=ASC')
      }
      let data = await res.json();
      console.log(data);
      data.content.forEach(d => d.createdOn = new Date(d.createdOn).toLocaleString('ru-RU'))
      allIndicators.set(m.id, data.content);
      setAllIndicators(new Map([...allIndicators]));
      console.log('got ' + m.id);
      console.log(allIndicators);
      }
      fetchData();
  });
  }

  const handleSort = (key) => {
    if(SORT_OPTIONS.has(key)){
      console.log('changing to ' + key);
      setSelectedSortOption(key);
      setSearchName("");
      dispatch(fetchMetricsRequest({page: 0, limit: 25, sort: SORT_OPTIONS.get(key).sort}));
  }
}

const handleRange = (key) => {
  if(RANGE_OPTIONS.has(key)){
    console.log('changing to ' + key);
    setSelectedRangeOption(key);
    // fetchIndicators();
}
}

const handleSetSearchName = (name) => {
    setSearchName(name);
    setSelectedSortOption(1);
    if(name) {
     dispatch(fetchMetricsByNameRequest({page: 0, limit: 25, name: name}));
    }
    else {
      setSearchName("");
      handleSort(selectedSortOption);
    }
}

const handleSetStartDate = (newDate) => {
  setStartDate(newDate);
  console.log('start date ' + startDate);
}

const handleSetEndDate = (newDate) => {
  console.log(startDate);
  setEndDate(newDate);
}

const MetricChart = ({ title, dataKey, color }) => (
  <Card sx={{ boxShadow: 4, borderRadius: 3, mb: 4 }}>
    <CardContent>
      <Typography variant="h6" gutterBottom>
        {title} {dataKey}
      </Typography>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={allIndicators.get(dataKey)}>
        
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis dataKey="createdOn" />
          <YAxis domain={[allIndicators.has(dataKey) && Math.min(...allIndicators.get(dataKey).map(e => e.value)), allIndicators.has(dataKey) && Math.max(...allIndicators.get(dataKey).map(e => e.value))]} tickCount={10}          />
          <Tooltip />
          <Line
            type="linear"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

  return (
    <div>
    <InnerMenu routes={routes} />
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>
        📊 Статистика по показателям
      </Typography>

      <TextField
        fullWidth
        label="🔍 Поиск по метрике"
        variant="outlined"
        value={searchName}
        onChange={(e) => handleSetSearchName(e.target.value)}
        sx={{ mb: 4 }}
      />
      <FormControl fullWidth margin="normal" sx={{ padding: 3, width: 350 }}>
                        <InputLabel>Сортировать по</InputLabel>
                        <Select value={selectedSortOption} onChange={(e) => handleSort(e.target.value)}>
                          {Array.from(SORT_OPTIONS).map(([key, value]) => (
                            <MenuItem key={key} value={key}>{value.name}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
      
                      <FormControl fullWidth margin="normal" sx={{ padding: 3, width: 350 }}>
                        <InputLabel>Усреднённое по</InputLabel>
                        <Select value={selectedRangeOption} onChange={(e) => handleRange(e.target.value)}>
                          {Array.from(RANGE_OPTIONS).map(([key, value]) => (
                            <MenuItem key={key} value={key}>{value.name}</MenuItem>
                          ))}
                        </Select>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                                  <DatePicker 
                                    label="Начало" 
                                    value={startDate} 
                                    onChange={(newDate) => handleSetStartDate(newDate)}
                                    renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
                                  />
                                </LocalizationProvider>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                                  <DatePicker 
                                    label="Конец" 
                                    value={endDate} 
                                    onChange={(newDate) => handleSetEndDate(newDate)}
                                    renderInput={(params) => <TextField fullWidth margin="normal" {...params} />}
                                  />
                                </LocalizationProvider>
                      </FormControl>
      <Stack spacing={4}>
        {metrics.map((metric) => (
          <MetricChart
            key={metric.id}
            title={metric.name}
            dataKey={metric.id}
            color="#1976d2"
          />
        ))}
        {metrics.length === 0 && (
          <Typography variant="body1" color="text.secondary">
            Метрик с таким названием не найдено.
          </Typography>
        )}
      </Stack>
    </Box>
    </div>
  );
};

export default Statistic;
