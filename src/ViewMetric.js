import React, { useState, useEffect } from "react";
import { useSearchParams} from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Typography
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import IndicatorMenu from "./IndicatorMenu";
import InnerMenu from './InnerMenu.js';

import { checkAuth } from './oauth2.js';

import { useSelector, useDispatch } from 'react-redux';
import {
  fetchIndicatorsRequest,
  fetchIndicatorsByMetricRequest,
  fetchMetricsRequest
} from './healthSlice.js';

const StyledTableContainer = styled(TableContainer)({
  marginTop: "20px",
  boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
  borderRadius: "10px",
});

const StyledTableHead = styled(TableHead)({
  backgroundColor: "#1976d2",
});

const StyledTableCell = styled(TableCell)({
  color: "#ffffff",
  fontWeight: "bold",
});

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ViewMetric = () => {
   const [searchParams] = useSearchParams();
  checkAuth('http://localhost:3001/metrics', 'GET', "http://localhost:3001/oauth2/redirect", "http://localhost:3001/oauth2/refresh", window.location.href, searchParams);
     
  const indicators = useSelector((state) => state.health.indicators);
  const metrics = useSelector((state) => state.health.metrics);
  const loading = useSelector((state) => state.health.loading);
  const error = useSelector((state) => state.health.error);
  const dispatch = useDispatch();
  
  const [metric, setMetric] = useState("all");
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("asc");

  const routes = [{label: 'Добавить значение показателя', path: '/add-metric'}, {label: 'Добавленные значения', path: '/view-metric'}, {label: 'Динамика', path: '/metric-statistic'}];

  useEffect(() => {
      dispatch(fetchIndicatorsRequest({page: 0, limit: 25, sort: orderBy.toUpperCase(), direction: order.toUpperCase()}));
      dispatch(fetchMetricsRequest({page: 0, limit: 25, sort: 'NAME'}));
    }, [dispatch]);
  const handleSort = (sort) => {
    const isAsc = orderBy === sort && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(sort);
    if(metric !== 'all') {
      dispatch(fetchIndicatorsByMetricRequest({metricId:metric, page: 0, limit: 25, sort: orderBy.toUpperCase(), direction: order.toUpperCase()}));
    }
    else {
      dispatch(fetchIndicatorsRequest({page: 0, limit: 25, sort: orderBy.toUpperCase(), direction: order.toUpperCase()}));
    }
  };

  const handleSetMetric = (metric) => {
    setMetric(metric);
    if(metric !== 'all') {
      dispatch(fetchIndicatorsByMetricRequest({metricId:metric, page: 0, limit: 25, sort: orderBy.toUpperCase(), direction: order.toUpperCase()}));
    }
    else {
      dispatch(fetchIndicatorsRequest({page: 0, limit: 25, sort: orderBy.toUpperCase(), direction: order.toUpperCase()}));
    }
  }

  return (
    <div>
    <InnerMenu routes={routes} />
        <FormControl fullWidth margin="normal" sx={{ padding: 3, width: 350 }}>
                  <InputLabel>Выбрать показатель</InputLabel>
                  <Select value={metric} onChange={(e) => handleSetMetric(e.target.value)}>
                  <MenuItem key="all" value="all">Все</MenuItem>
                    {metrics.map((m) => (
                      <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
    <StyledTableContainer component={Paper}>
      <Typography variant="h6" align="center" gutterBottom>
        Добавленные показатели
      </Typography>
      <Table>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "date"}
                direction={orderBy === "date" ? order : "asc"}
                onClick={() => handleSort("date")}
                style={{ color: "white" }}
              >
                Дата и время
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "type"}
                direction={orderBy === "type" ? order : "asc"}
                onClick={() => handleSort("type")}
                style={{ color: "white" }}
              >
                Название показателя
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "value"}
                direction={orderBy === "value" ? order : "asc"}
                onClick={() => handleSort("value")}
                style={{ color: "white" }}
              >
                Значение
              </TableSortLabel>
            </StyledTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {indicators.map((metric) => (
            <StyledTableRow key={metric.id}>
              <TableCell>{new Date(metric.createdOn).toLocaleString('ru-RU')}</TableCell>
              <TableCell>{metric.indicatorType.name}</TableCell>
              <TableCell>{metric.value}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
    </div>
  );
};

export default ViewMetric;
