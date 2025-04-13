import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';

import {
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  MenuItem,
  Select,
  Collapse,
  Box
} from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import AddFood from './AddFood';
import {
  fetchFoodsRequest
} from '../healthSlice.js';

const FoodList = () => {
    const SORT_OPTIONS = new Map();
    SORT_OPTIONS.set(1, {name: "Название", sort: "TITLE"});
    SORT_OPTIONS.set(2, {name: "Последнее обновление", sort:"CREATED_ON"});

  const foods = useSelector((state) => state.health.foods);
  const hasAdded = useSelector((state) => state.health.hasAdded);
  const [searchTitle, setSearchTitle] = useState('');
  const [sortOption, setSortOption] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
      dispatch(fetchFoodsRequest({title: searchTitle, page: 0, limit: 25, sort: SORT_OPTIONS.get(sortOption).sort}));
      console.log('added ' + hasAdded);
    }, [dispatch, searchTitle, sortOption, hasAdded]);


  const handleSort = (key) => {
      if(SORT_OPTIONS.has(key)){
        console.log('changing to ' + key);
        setSortOption(key);
        // setSearchTitle("");
        // dispatch(fetchFoodsRequest({title: searchTitle, page: 0, limit: 25, sort: SORT_OPTIONS.get(key).sort}));
    }
  }

  const handleSetSearchTitle = (title) => {
      console.log('changing title to ' + title);
      setSearchTitle(title);
      // dispatch(fetchFoodsRequest({title: searchTitle, page: 0, limit: 25, sort: SORT_OPTIONS.get(key).sort}));
}

  return (
    <Container witdth="100%" sx={{ mt: 4 }}>
      <AddFood />

      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Список добавленной еды
        </Typography>

        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Поиск по названию"
              value={searchTitle}
              onChange={(e) => handleSetSearchTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <Select
              value={sortOption}
              onChange={(e) => handleSort(e.target.value)}
              fullWidth
            >
              {Array.from(SORT_OPTIONS).map(([key, value]) => (
                                          <MenuItem key={key} value={key}>{value.name}</MenuItem>
                                        ))}
            </Select>
          </Grid>
        </Grid>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Название</TableCell>
                <TableCell>Дата добавления</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {foods.map((food) => (
                <FoodRow key={food.id} food={food} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

const FoodRow = ({ food }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{food.title}</TableCell>
        <TableCell>{new Date(food.createdOn).toLocaleString()}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={3} sx={{ p: 0 }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ p: 2 }}>
              <Typography variant="subtitle2">Пищевая ценность:</Typography>
              <ul style={{ marginTop: 8 }}>
                {food.foodValues.map((fv) => (
                  <li key={fv.id}>
                    {fv.nutritionValue.translation}: {fv.value}
                  </li>
                ))}
              </ul>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default FoodList;
