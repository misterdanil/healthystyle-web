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
    fetchActualDietsRequest,
    selectDiet
  } from '../healthSlice.js';

import { useNavigate } from "react-router-dom";
  
import DietMenu from './DietMenu.js'

const ActualDiets = () => {
  const diets = useSelector((state) => state.health.diets);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  
  useEffect(() => {
        dispatch(fetchActualDietsRequest({page: 0, limit: 25}));
    }, [dispatch]);

const changeDiet = (diet) => {
    dispatch(selectDiet(diet));
    navigate('/diets/' + diet.id);
}

  return (
    <div>
    <DietMenu/>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={600} color="primary">
        Диеты под наблюдением
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>End Date</TableCell>
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

export default ActualDiets;