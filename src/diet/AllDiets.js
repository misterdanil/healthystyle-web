import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";

import {
    fetchDietsByTitleRequest,
    selectDiet
  } from '../healthSlice.js';

import { useNavigate } from "react-router-dom";
  
import DietMenu from './DietMenu.js'

const AllDiets = () => {
  const diets = useSelector((state) => state.health.diets);

  const navigate = useNavigate();

  const [searchTitle, setSearchTitle] = useState("");

  const dispatch = useDispatch();
  
  useEffect(() => {
        dispatch(fetchDietsByTitleRequest({title: searchTitle, page: 0, limit: 25}));
    }, [dispatch, searchTitle]);

//   const filteredDiets = mockDiets.filter((diet) =>
//     diet.name.toLowerCase().includes(searchTitle.toLowerCase())
//   );

const changeDiet = (diet) => {
    dispatch(selectDiet(diet));
    navigate('' + diet.id);
}

  return (
    <div>
    <DietMenu/>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Диеты
      </Typography>
      <TextField
        fullWidth
        label="Поиск по названию"
        value={searchTitle}
        onChange={(e) => setSearchTitle(e.target.value)}
        sx={{ mb: 2 }}
        variant="outlined"
      />
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Название</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Начало</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Конец</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {diets.map((diet) => (
              <TableRow
                key={diet.id}
                hover
                sx={{ cursor: "pointer", transition: "0.3s", '&:hover': { backgroundColor: '#f5f5f5' } }}
                onClick={() => changeDiet(diet)}
              >
                <TableCell>{diet.title}</TableCell>
                <TableCell>{new Date(diet.start).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(diet.end).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
    </div>
  );
};

export default AllDiets;