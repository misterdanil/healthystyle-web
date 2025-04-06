import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metrics: [],
  indicators: [],
  loading: false,
  error: null,
};

const healthSlice = createSlice({
  name: "health",
  initialState,
  reducers: {
    fetchMetricsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMetricsSuccess(state, action) {
      state.metrics = action.payload;
      state.loading = false;
    },
    fetchMetricsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchMetricsByNameRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchMetricsByNameSuccess(state, action) {
      state.metrics = action.payload;
      state.loading = false;
    },
    fetchMetricsByNameFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addMetricValueRequest(state, action) {
      state.loading = true;
    },
    addMetricValueSuccess(state, action) {
      state.loading = false;
    },
    addMetricValueFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    fetchIndicatorsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchIndicatorsSuccess(state, action) {
      console.log("got it " + action.payload);
      state.indicators = action.payload;
      state.loading = false;
    },
    fetchIndicatorsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchIndicatorsByMetricRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchIndicatorsByMetricSuccess(state, action) {
      console.log("got it " + action.payload);
      state.indicators = action.payload;
      state.loading = false;
    },
    fetchIndicatorsByMetricFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },

  },
});

export const {
  fetchMetricsRequest,
  fetchMetricsSuccess,
  fetchMetricsFailure,
  fetchMetricsByNameRequest,
  fetchMetricsByNameSuccess,
  fetchMetricsByNameFailure,
  fetchIndicatorsRequest,
  fetchIndicatorsSuccess,
  fetchIndicatorsFailure,
  fetchIndicatorsByMetricRequest,
  fetchIndicatorsByMetricSuccess,
  fetchIndicatorsByMetricFailure,
  addMetricValueRequest,
  addMetricValueSuccess,
  addMetricValueFailure
} = healthSlice.actions;

export default healthSlice.reducer;