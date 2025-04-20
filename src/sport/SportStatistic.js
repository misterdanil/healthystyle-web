import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  TextField,
  Select,
  MenuItem
} from "@mui/material";
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { ru } from 'date-fns/locale/ru';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { fetchSportStatisticRequest, fetchSportStatisticByDateRequest } from "../healthSlice";

const SportStatistic = () => {
  const RANGE_OPTIONS = new Map();
  RANGE_OPTIONS.set(0, {name: "Нет"})
  RANGE_OPTIONS.set(1, {name: "День", range: "DAY"})
  RANGE_OPTIONS.set(2, {name: "Недели", range: "WEEK"});
  RANGE_OPTIONS.set(3, {name: "Месяцу", range:"MONTH"});
  
  const sportStatistic = useSelector((state) => state.health.sportStatistic);
  
  const [selectedRangeOption, setSelectedRangeOption] = useState(0);
  const [date, setDate] = useState('2025-04-18');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const dispatch = useDispatch();
  
  useEffect(() => {
      if(selectedRangeOption > 0 && startDate !== '' && endDate !== '') {
        dispatch(fetchSportStatisticRequest({start: startDate, end: endDate, page: 0, limit: 25, range: RANGE_OPTIONS.get(selectedRangeOption).range}));
      }
      else {
        dispatch(fetchSportStatisticByDateRequest({date: date, page: 0, limit: 25, range: RANGE_OPTIONS.get(selectedRangeOption).range}));
      }
    }, [dispatch, date, startDate, endDate, selectedRangeOption]);
  
  const handleRange = (key) => {
    if(RANGE_OPTIONS.has(key)){
      console.log('changing to ' + key);
      setDate('');
      setSelectedRangeOption(key);
  }
  }

  const handleDateChange = (date) => {
      console.log('changing date to ' + date);
      setDate(date);
      setSelectedRangeOption(0);
      setStartDate('');
      setEndDate('');
  }

  const handlePeriodDateChange = (date, type) => {
    setDate('');
    if(type === 'start'){
      console.log('changing start date to ' + date);
      setStartDate(date);
      if(endDate === '') {
        console.log('dadwad');
        setEndDate(date);
      }
    }
    if(type === 'end') {
      console.log('changing end date to ' + date);
      setEndDate(date);
      if(startDate === '') {
        setStartDate(date);
      }
    }
    if(selectedRangeOption === 0) {
      setSelectedRangeOption(1);
    }
  }

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Статистика тренировок
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="space-around" divider={<Divider orientation="vertical" flexItem />}>
      <Box mt={3} mb={3} display="flex" justifyContent="space-around">
        <TextField
                          label="Статистика по дате"
                          type="date"
                          size="small"
                          InputLabelProps={{ shrink: true }}
                          value={date}
                          onChange={(e) => handleDateChange(e.target.value)}
                        />
      </Box>
      <Stack direction="row" spacing={5}>
                  <TextField 
                    label="Дата начала" 
                    type="date"
                    size="small"
                    slotProps={{ inputLabel: {shrink: true} }}
                    value={startDate} 
                    onChange={(e) => handlePeriodDateChange(e.target.value, 'start')}
                  />
                  <TextField 
                    label="Дата конца"
                    type="date"
                    size="small"
                    slotProps={{ inputLabel: {shrink: true} }}
                    value={endDate} 
                    onChange={(e) => handlePeriodDateChange(e.target.value, 'end')}
                  />
      <Select value={selectedRangeOption} onChange={(e) => handleRange(e.target.value)} size="small">
                          {Array.from(RANGE_OPTIONS).map(([key, value]) => (
                            <MenuItem key={key} value={key}>{value.name}</MenuItem>
                          ))}
                        </Select>
      </Stack>
      </Stack>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={sportStatistic} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={date !== '' ? 'time' : 'date'} />
          <YAxis domain={[0, 100]} tickFormatter={(tick) => `${tick}%`} />
          <Tooltip formatter={(value) => `${value}%`} />
          <Bar dataKey="value" fill="#1976d2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Container>
  );
};

export default SportStatistic;
