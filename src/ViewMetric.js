import React, { useState, useEffect } from "react";
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

// const sampleMetrics = [
//   { id: 1, date: "2024-04-01 10:30", name: "Blood Sugar", value: "120 mg/dL" },
//   { id: 2, date: "2024-04-02 08:45", name: "Weight", value: "75 kg" },
//   { id: 3, date: "2024-04-01 12:00", name: "Height", value: "180 cm" },
//   { id: 4, date: "2024-04-03 14:15", name: "Blood Pressure", value: "120/80" }
// ];

const ViewMetric = () => {
  const indicators = useSelector((state) => state.health.indicators);
  const metrics = useSelector((state) => state.health.metrics);
  const loading = useSelector((state) => state.health.loading);
  const error = useSelector((state) => state.health.error);
  const dispatch = useDispatch();
  
  const [metric, setMetric] = useState("all");
  const [orderBy, setOrderBy] = useState("date");
  const [order, setOrder] = useState("asc");

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
    
    // const sortedMetrics = [...indicators].sort((a, b) => {
    //   if (a[column] < b[column]) return isAsc ? 1 : -1;
    //   if (a[column] > b[column]) return isAsc ? -1 : 1;
    //   return 0;
    // });

    // setMetrics(sortedMetrics);
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
        <IndicatorMenu></IndicatorMenu>
        <FormControl fullWidth margin="normal" sx={{ padding: 3, width: 350 }}>
                  <InputLabel>Select Metric</InputLabel>
                  <Select value={metric} onChange={(e) => handleSetMetric(e.target.value)}>
                  <MenuItem key="all" value="all">Все</MenuItem>
                    {metrics.map((m) => (
                      <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
    <StyledTableContainer component={Paper}>
      <Typography variant="h6" align="center" gutterBottom>
        Health Metrics
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
                Date & Time
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "type"}
                direction={orderBy === "type" ? order : "asc"}
                onClick={() => handleSort("type")}
                style={{ color: "white" }}
              >
                Metric Name
              </TableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <TableSortLabel
                active={orderBy === "value"}
                direction={orderBy === "value" ? order : "asc"}
                onClick={() => handleSort("value")}
                style={{ color: "white" }}
              >
                Value
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
