import { call, put, takeEvery, all } from "redux-saga/effects";
import {
    fetchMetricsRequest,
    fetchMetricsSuccess,
    fetchMetricsFailure,
    fetchMetricsByNameRequest,
    fetchMetricsByNameSuccess,
    fetchMetricsByNameFailure,
    addMetricValueRequest,
    addMetricValueSuccess,
    addMetricValueFailure,
    fetchIndicatorsSuccess,
    fetchIndicatorsFailure,
    fetchIndicatorsRequest,
    fetchIndicatorsByMetricSuccess,
    fetchIndicatorsByMetricFailure,
    fetchIndicatorsByMetricRequest
} from "./healthSlice";

const api = {
  fetchMetrics: (page, limit, sort) => fetch("http://localhost:3000/metrics?" + new URLSearchParams({
    page: page,
    limit: limit,
    sort: sort
  }) ).then((res) => res.json()),
  fetchMetricsByName: (page, limit, name) => fetch("http://localhost:3000/metrics?" + new URLSearchParams({
    page: page,
    limit: limit,
    name: name
  }) ).then((res) => res.json()),
  addMetricValue: (metricValue) => 
    fetch("http://localhost:3000/metrics/" + metricValue.indicatorTypeId + '/value', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(metricValue),
    }).then((res) => res.json()),
  fetchIndicators: (page, limit, sort, direction) => fetch("http://localhost:3000/indicators?" + new URLSearchParams({
    page: page,
    limit: limit,
    sort: sort,
    direction: direction
  }) ).then((res) => res.json()),
  fetchIndicatorsByMetric: (metricId, page, limit, sort, direction) => fetch("http://localhost:3000/metrics/" + metricId + "/indicators?" + new URLSearchParams({
    page: page,
    limit: limit,
    sort: sort,
    direction: direction
  }) ).then((res) => res.json()),
};

function* fetchMetricsSaga(action) {
  try {
    console.log(action);
    const metrics = yield call(api.fetchMetrics, action.payload.page, action.payload.limit, action.payload.sort);
    console.log('anything');
    console.log(metrics);
    yield put(fetchMetricsSuccess(metrics));
  } catch (error) {
    yield put(fetchMetricsFailure(error.message));
  }
}

function* fetchMetricsByNameSaga(action) {
  try {
    console.log(action);
    const metrics = yield call(api.fetchMetricsByName, action.payload.page, action.payload.limit, action.payload.name);
    console.log(metrics);
    yield put(fetchMetricsByNameSuccess(metrics));
  } catch (error) {
    yield put(fetchMetricsByNameFailure(error.message));
  }
}

function* addMetricValueSaga(action) {
  try {
    const metricValue = yield call(api.addMetricValue, action.payload);
    console.log(metricValue);
    yield put(addMetricValueSuccess(metricValue));
  } catch (error) {
    yield put(addMetricValueFailure(error.message));
  }
}

function* fetchIndicatorsSaga(action) {
  try {
    const indicators = yield call(api.fetchIndicators, action.payload.page, action.payload.limit, action.payload.sort, action.payload.direction);
    yield put(fetchIndicatorsSuccess(indicators.content));
  } catch (error) {
    yield put(fetchIndicatorsFailure(error.message));
  }
}

function* fetchIndicatorsByMetricSaga(action) {
  try {
    const indicators = yield call(api.fetchIndicatorsByMetric, action.payload.metricId, action.payload.page, action.payload.limit, action.payload.sort, action.payload.direction);
    console.log('got them!');
    yield put(fetchIndicatorsByMetricSuccess(indicators.content));
  } catch (error) {
    yield put(fetchIndicatorsByMetricFailure(error.message));
  }
}

function* watchShopActions() {
  console.log('test ', fetchMetricsRequest.type);
  yield all([
    takeEvery(fetchMetricsRequest.type, fetchMetricsSaga),
    takeEvery(fetchMetricsByNameRequest.type, fetchMetricsByNameSaga),
    takeEvery(addMetricValueRequest.type, addMetricValueSaga),
    takeEvery(fetchIndicatorsRequest.type, fetchIndicatorsSaga),
    takeEvery(fetchIndicatorsByMetricRequest.type, fetchIndicatorsByMetricSaga)
  ]);
}

export default function* rootSaga() {
  yield all([watchShopActions()]);
}