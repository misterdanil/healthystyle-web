import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Card,
  CardContent,
  Stack,
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

import { fetchNutritionStatisticRequest, fetchNutritionValuesByValueRequest } from '../healthSlice.js'

const FoodValue = () => {
  const RANGE_OPTIONS = new Map();
  RANGE_OPTIONS.set(1, {name: "Нет"})
  RANGE_OPTIONS.set(2, {name: "Недели", range: "WEEK"});
  RANGE_OPTIONS.set(3, {name: "Месяцу", range:"MONTH"});
  RANGE_OPTIONS.set(4, {name: "Году", range:"YEAR"});

  const nutritions = useSelector((state) => state.health.nutritionValues);
  const [values, setValues] = useState(new Map());
  const [selectedRangeOption, setSelectedRangeOption] = useState(new Map());
  const [selectedDateOption, setSelectedDateOption] = useState(new Map());
  const [searchName, setSearchName] = useState("");
  
  const dispatch = useDispatch();
        
  useEffect(() => {
      dispatch(fetchNutritionValuesByValueRequest({value: searchName, page: 0, limit: 25}));
  }, [dispatch, searchName]);
    
  useEffect(() => {
    console.log(nutritions);
    if(nutritions.length > 0) {
      console.log('getting nutrition statistic');
        const fetchStatistic = async ()=>{
        for(let i = 0; i < nutritions.length; i++) {
            if(!selectedDateOption.has(nutritions[i].id)) {
              selectedDateOption.set(nutritions[i].id, {start: '2025-04-25', end: '2025-04-25'});
            }
            if(!selectedRangeOption.has(nutritions[i].id)) {
              selectedRangeOption.set(nutritions[i].id, 2);
            }
            console.log("getting statistic of nutrition: " + nutritions[i].value);
                let res = await fetch("http://localhost:3000/nutritions/" + nutritions[i].id + '/values?' + new URLSearchParams({
                    statistic: true,
                    start: selectedDateOption.get(nutritions[i].id).start,
                    end: selectedDateOption.get(nutritions[i].id).end,
                    range: RANGE_OPTIONS.get(selectedRangeOption.get(nutritions[i].id)).range,
                    page: 0,
                    limit: 25
                  }));
                  const data = await res.json();
                  console.log("got statistic of nutrition: " + nutritions[i].value);
                  data.content.forEach(v => {console.log(new Date(v.createdOn).toLocaleString('ru-RU')); v.createdOn = new Date(v.createdOn).toLocaleDateString('ru-RU')});
                  console.log(data);
                  values.set(nutritions[i].id, data.content);
        }
        console.log(selectedDateOption);
        setValues(new Map(values));
        console.log(values);
        console.log(selectedDateOption);
        console.log(selectedRangeOption);
      }
      fetchStatistic();
      }
    }, [nutritions]);
        
  const handleRangeChange = (id, range) => {
    selectedRangeOption.set(id, range);
    setSelectedRangeOption(new Map(selectedRangeOption));
    const fetchStatistic = async ()=>{
    let res = await fetch("http://localhost:3000/nutritions/" + id + '/values?' + new URLSearchParams({
      statistic: true,
      start: selectedDateOption.get(id).start,
      end: selectedDateOption.get(id).end,
      range: RANGE_OPTIONS.get(selectedRangeOption.get(id)).range,
      page: 0,
      limit: 25
    }));
    const data = await res.json();
    console.log(data);
    data.content.forEach(v => v.createdOn = new Date(v.createdOn).toLocaleDateString('ru-RU'));
    values.set(id, data.content);
    setValues(new Map(values));
  }
  fetchStatistic();
  };

  const handleStartDateChange = (id, start) => {
    selectedDateOption.get(id).start = start;
    setSelectedDateOption(new Map(selectedDateOption));
    const fetchStatistic = async ()=>{
      let res = await fetch("http://localhost:3000/nutritions/" + id + '/values?' + new URLSearchParams({
        statistic: true,
        start: selectedDateOption.get(id).start,
        end: selectedDateOption.get(id).end,
        range: RANGE_OPTIONS.get(selectedRangeOption.get(id)).range,
        page: 0,
        limit: 25
      }));
      const data = await res.json();
      console.log(data);
      data.content.forEach(v => v.createdOn = new Date(v.createdOn).toLocaleDateString('ru-RU'));
      values.set(id, data.content);
      setValues(new Map(values));
    }
    fetchStatistic();
  };

  const handleEndDateChange = (id, end) => {
    selectedDateOption.get(id).end = end;
    setSelectedDateOption(new Map(selectedDateOption));
    const fetchStatistic = async ()=>{
      let res = await fetch("http://localhost:3000/nutritions/" + id + '/values?' + new URLSearchParams({
        statistic: true,
        start: selectedDateOption.get(id).start,
        end: selectedDateOption.get(id).end,
        range: RANGE_OPTIONS.get(selectedRangeOption.get(id)).range,
        page: 0,
        limit: 25
      }));
      const data = await res.json();
      console.log(data);
      data.content.forEach(v => v.createdOn = new Date(v.createdOn).toLocaleDateString('ru-RU'));
      values.set(id, data.content);
      setValues(new Map(values));
    }
    fetchStatistic();
  };

  return (
    <Container sx={{ mt: 6 }}>
      <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
        Потребление питательных веществ
      </Typography>
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Поиск пищевой ценности"
          variant="outlined"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </Box>
      <Stack spacing={4}>
        {selectedDateOption.size > 0 && selectedRangeOption.size > 0 && nutritions.map((nutrition) => (
          <Card key={nutrition.id}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">{nutrition.translation}</Typography>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Усреднённое по</InputLabel>
                  <Select
                    value={selectedRangeOption.get(nutrition.id)}
                    onChange={(e) => handleRangeChange(nutrition.id, e.target.value)}
                    label="Диапазон"
                  >
                    {Array.from(RANGE_OPTIONS).map(([key, value]) => (
                      <MenuItem key={key} value={key}>
                        {value.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  label="Начало"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDateOption.get(nutrition.id).start}
                  onChange={(e) => handleStartDateChange(nutrition.id, e.target.value)}
                />
                <TextField
                  label="Конец"
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={selectedDateOption.get(nutrition.id).end}
                  onChange={(e) => handleEndDateChange(nutrition.id, e.target.value)}
                />
              </Box>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={values.get(nutrition.id)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="createdOn" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3f51b5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default FoodValue;
