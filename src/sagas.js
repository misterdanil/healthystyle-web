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
    fetchIndicatorsByMetricRequest,
    fetchNutritionValuesSuccess,
    fetchNutritionValuesFailure,
    fetchNutritionValuesRequest,
    fetchNutritionValuesByValueRequest,
    fetchNutritionValuesByValueSuccess,
    fetchNutritionValuesByValueFailure,
    addFoodRequest,
    addFoodSuccess,
    addFoodFailure,
    fetchFoodsRequest,
    fetchFoodsSuccess,
    fetchFoodsFailure,
    addDietRequest,
    addDietSuccess,
    addDietFailure,
    fetchDietsByTitleRequest,
    fetchDietsByTitleSuccess,
    fetchDietsByTitleFailure,
    fetchActualDietsRequest,
    fetchActualDietsSuccess,
    fetchActualDietsFailure,
    fetchPlannedMealsRequest,
    fetchPlannedMealsSuccess,
    fetchPlannedMealsFailure,
    fetchNextMealsRequest,
    fetchNextMealsSuccess,
    fetchNextMealsFailure,
    fetchNutritionStatisticRequest,
    fetchNutritionStatisticSuccess,
    fetchNutritionStatisticFailure,
    fetchExercisesSuccess,
    fetchExercisesFailure,
    fetchExercisesRequest,
    addExerciseRequest,
    addExerciseSuccess,
    addExerciseFailure,
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
  fetchNutritionValues: (page, limit) => fetch("http://localhost:3000/values?" + new URLSearchParams({
    page: page,
    limit: limit
  }) ).then((res) => res.json()),
  fetchNutritionValuesByValue: (value, page, limit) => fetch("http://localhost:3000/values?" + new URLSearchParams({
    value: value,
    page: page,
    limit: limit
  }) ).then((res) => res.json()),
  addFood: (food) => 
    fetch("http://localhost:3000/food", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(food),
    }).then((res) => res.headers.get('Location')),
  fetchFoods: (title, page, limit, sort) => fetch("http://localhost:3000/foods?" + new URLSearchParams({
      title: title,
      page: page,
      limit: limit,
      sort: sort
    }) ).then((res) => res.json()),
  addDiet: (diet) => 
      fetch("http://localhost:3000/diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(diet),
      }).then((res) => res.headers.get('Location')),
  fetchDietsByTitle: (title, page, limit) => fetch("http://localhost:3000/diets?" + new URLSearchParams({
    title: title,
    page: page,
    limit: limit
  }) ).then((res) => res.json()),
  fetchActualDiets: (page, limit) => fetch("http://localhost:3000/diets?" + new URLSearchParams({
    actual: true,
    page: page,
    limit: limit
  }) ).then((res) => res.json()),
  fetchPlannedMeals: (page, limit) => fetch("http://localhost:3000/meals?" + new URLSearchParams({
    planned: true,
    page: page,
    limit: limit
  }) ).then((res) => res.json()),
  fetchNextMeals: (page, limit) => fetch("http://localhost:3000/meals?" + new URLSearchParams({
    next: true,
    page: page,
    limit: limit
  }) ).then((res) => res.json()),
  fetchNutritionStatistic: (nutritionValueId, start, end, page, limit, range) => fetch("http://localhost:3000/nutritions/" + nutritionValueId + '/values?' + new URLSearchParams({
    statistic: true,
    start: start,
    end: end,
    page: page,
    limit: limit,
    range: range
  }) ).then((res) => res.json()),
  fetchExercises: (title, page, limit, sort) => fetch("http://localhost:3000/exercises?" + new URLSearchParams({
    title: title,
    page: page,
    limit: limit,
    sort: sort
  }) ).then((res) => res.json()),
  addExercise: (diet) => 
    fetch("http://localhost:3000/exercise", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(diet),
    }).then((res) => res.headers.get('Location')),
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

function* addFoodSaga(action) {
  try {
    const food = yield call(api.addFood, action.payload);
    console.log("add food saga " + food);
    yield put(addFoodSuccess(food));
  } catch (error) {
    yield put(addFoodFailure(error.message));
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

function* fetchNutritionValuesSaga(action) {
  try {
    console.log(action);
    const nutritionValues = yield call(api.fetchNutritionValues, action.payload.page, action.payload.limit);
    console.log('anything');
    console.log(nutritionValues);
    yield put(fetchNutritionValuesSuccess(nutritionValues));
  } catch (error) {
    yield put(fetchNutritionValuesFailure(error.message));
  }
}

function* fetchNutritionValuesByValueSaga(action) {
  try {
    console.log(action);
    const nutritionValues = yield call(api.fetchNutritionValuesByValue, action.payload.value, action.payload.page, action.payload.limit);
    console.log(nutritionValues);
    yield put(fetchNutritionValuesByValueSuccess(nutritionValues));
  } catch (error) {
    yield put(fetchNutritionValuesByValueFailure(error.message));
  }
}

function* fetchFoodsSaga(action) {
  try {
    console.log(action);
    const foods = yield call(api.fetchFoods, action.payload.title, action.payload.page, action.payload.limit, action.payload.sort);
    console.log('fetch foods saga');
    console.log(foods);
    yield put(fetchFoodsSuccess(foods));
  } catch (error) {
    yield put(fetchFoodsFailure(error.message));
  }
}

function* addDietSaga(action) {
  try {
    const food = yield call(api.addDiet, action.payload);
    console.log("add diet saga " + food);
    yield put(addDietSuccess(food));
  } catch (error) {
    yield put(addDietFailure(error.message));
  }
}

function* fetchDietsByTitleSaga(action) {
  try {
    const diets = yield call(api.fetchDietsByTitle, action.payload.title, action.payload.page, action.payload.limit);
    console.log('got diets');
    console.log(diets);
    yield put(fetchDietsByTitleSuccess(diets));
  } catch (error) {
    yield put(fetchDietsByTitleFailure(error.message));
  }
}

function* fetchActualDietsSaga(action) {
  try {
    const diets = yield call(api.fetchActualDiets, action.payload.page, action.payload.limit);
    console.log('got diets');
    console.log(diets);
    yield put(fetchActualDietsSuccess(diets));
  } catch (error) {
    yield put(fetchActualDietsFailure(error.message));
  }
}

function* fetchPlannedMealsSaga(action) {
  try {
    const meals = yield call(api.fetchPlannedMeals, action.payload.page, action.payload.limit);
    console.log('got meals');
    console.log(meals);
    yield put(fetchPlannedMealsSuccess(meals));
  } catch (error) {
    yield put(fetchPlannedMealsFailure(error.message));
  }
}

function* fetchNextMealsSaga(action) {
  try {
    const meals = yield call(api.fetchNextMeals, action.payload.page, action.payload.limit);
    console.log('got next meals');
    console.log(meals);
    yield put(fetchNextMealsSuccess(meals));
  } catch (error) {
    yield put(fetchNextMealsFailure(error.message));
  }
}

function* fetchNutritionStatisticSaga(action) {
  try {
    const statistic = yield call(api.fetchNutritionStatistic, action.payload.nutritionValueId, action.payload.start, action.payload.end, action.payload.page, action.payload.limit, action.payload.range);
    console.log('got staistic');
    console.log(statistic);
    yield put(fetchNutritionStatisticSuccess(statistic));
  } catch (error) {
    yield put(fetchNutritionStatisticFailure(error.message));
  }
}

function* fetchExercisesSaga(action) {
  try {
    const exercises = yield call(api.fetchExercises, action.payload.title, action.payload.page, action.payload.limit, action.payload.sort);
    console.log(exercises);
    yield put(fetchExercisesSuccess(exercises));
  } catch (error) {
    yield put(fetchExercisesFailure(error.message));
  }
}

function* addExerciseSaga(action) {
  try {
    const exercise = yield call(api.addExercise, action.payload);
    console.log("add exercise saga " + exercise);
    yield put(addExerciseSuccess(exercise));
  } catch (error) {
    yield put(addExerciseFailure(error.message));
  }
}

function* watchShopActions() {
  console.log('test ', fetchMetricsRequest.type);
  yield all([
    takeEvery(fetchMetricsRequest.type, fetchMetricsSaga),
    takeEvery(fetchMetricsByNameRequest.type, fetchMetricsByNameSaga),
    takeEvery(addMetricValueRequest.type, addMetricValueSaga),
    takeEvery(fetchIndicatorsRequest.type, fetchIndicatorsSaga),
    takeEvery(fetchIndicatorsByMetricRequest.type, fetchIndicatorsByMetricSaga),
    takeEvery(fetchNutritionValuesRequest.type, fetchNutritionValuesSaga),
    takeEvery(fetchNutritionValuesByValueRequest.type, fetchNutritionValuesByValueSaga),
    takeEvery(addFoodRequest.type, addFoodSaga),
    takeEvery(fetchFoodsRequest.type, fetchFoodsSaga),
    takeEvery(addDietRequest.type, addDietSaga),
    takeEvery(fetchDietsByTitleRequest.type, fetchDietsByTitleSaga),
    takeEvery(fetchActualDietsRequest.type, fetchActualDietsSaga),
    takeEvery(fetchPlannedMealsRequest.type, fetchPlannedMealsSaga),
    takeEvery(fetchNextMealsRequest.type, fetchNextMealsSaga),
    takeEvery(fetchNutritionStatisticRequest.type, fetchNutritionStatisticSaga),
    takeEvery(fetchExercisesRequest.type, fetchExercisesSaga),
    takeEvery(addExerciseRequest.type, addExerciseSaga)
  ]);
}

export default function* rootSaga() {
  yield all([watchShopActions()]);
}