import { call, put, takeEvery, all, actionChannel } from "redux-saga/effects";
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
    addSportRequest,
    addSportSuccess,
    addSportFailure,
    fetchSportsRequest,
    fetchSportsSuccess,
    fetchSportsFailure,
    fetchPlannedTrainsRequest,
    fetchPlannedTrainsSuccess,
    fetchPlannedTrainsFailure,
    fetchSportStatisticRequest,
    fetchSportStatisticSuccess,
    fetchSportStatisticFailure,
    fetchSportStatisticByDateRequest,
    fetchSportStatisticByDateSuccess,
    fetchSportStatisticByDateFailure,
    addSetMarkRequest,
    addSetMarkSuccess,
    addSetMarkFailure,
    fetchCategoriesRequest,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    addArticleRequest,
    addArticleSuccess,
    addArticleFailure,
    fetchArticleRequest,
    fetchArticleSuccess,
    fetchArticleFailure,
    fetchFragmentsRequest,
    fetchFragmentsSuccess,
    fetchFragmentsFailure,
    fetchArticlesByTitleRequest,
    fetchArticlesByTitleSuccess,
    fetchArticlesByTitleFailure,
    addMarkRequest,
    addMarkSuccess,
    addMarkFailure,
    fetchFilteredArticlesRequest,
    fetchFilteredArticlesSuccess,
    fetchFilteredArticlesFailure,
    addCommentRequest,
    addCommentSuccess,
    addCommentFailure,
    fetchRootCommentsRequest,
    fetchRootCommentsSuccess,
    fetchRootCommentsFailure,
    addEventRequest,
    addEventSuccess,
    addEventFailure,
    addUserRequest,
    addUserSuccess,
    addUserFailure,
    loginRequest,
    loginSuccess,
    loginFailure,
    verifyRequest,
    verifySuccess,
    verifyFailure,
    fetchUsersRequest,
    fetchUsersSuccess,
    fetchUsersFailure,
    fetchUserIdRequest,
    fetchUserIdSuccess,
    fetchUserIdFailure,
    fetchEventsRequest,
    fetchEventsSuccess,
    fetchEventsFailure,
    fetchEventRequest,
    fetchEventSuccess,
    fetchEventFailure,
    fetchEventMembersRequest,
    fetchEventMembersSuccess,
    fetchEventMembersFailure,
    joinEventRequest,
    joinEventSuccess,
    joinEventFailure,
    fetchMeasuresRequest,
    fetchMeasuresSuccess,
    fetchMeasuresFailure,
    addMedicineRequest,
    addMedicineSuccess,
    addMedicineFailure,
    fetchMedicinesRequest,
    fetchMedicinesSuccess,
    fetchMedicinesFailure,
    deleteMedicineRequest,
    deleteMedicineSuccess,
    deleteMedicineFailure,
    fetchMedicineRequest,
    fetchMedicineSuccess,
    fetchMedicineFailure,
    addTreatmentRequest,
    addTreatmentSuccess,
    addTreatmentFailure,
    fetchIntakesRequest,
    fetchIntakesSuccess,
    fetchIntakesFailure,
    fetchNextIntakesRequest,
    fetchNextIntakesSuccess,
    fetchNextIntakesFailure,
    addIntakeResultRequest,
    addIntakeResultSuccess,
    addIntakeResultFailure,
    fetchMissedIntakesRequest,
    fetchMissedIntakesSuccess,
    fetchMissedIntakesFailure
} from "./healthSlice";

import Cookies from 'js-cookie';

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
  addSport: (sport) => 
      fetch("http://localhost:3000/sport", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sport),
      }).then((res) => res.headers.get('Location')),
  fetchSports: (description, page, limit) => fetch("http://localhost:3001/sports?" + new URLSearchParams({
      description: description,
      page: page,
      limit: limit
    }) ).then((res) => res.json()),
  fetchPlannedTrains: (page, limit) => fetch("http://localhost:3001/trains?" + new URLSearchParams({
      planned: true,
      page: page,
      limit: limit
    }) ).then((res) => res.json()),
  fetchSportStatistic: (start, end, page, limit, range) => fetch("http://localhost:3001/sports/statistic?" + new URLSearchParams({
      start: start,
      end: end,
      page: page,
      limit: limit,
      range: range
    }) ).then((res) => res.json()),
    fetchSportStatisticByDate: (date, page, limit) => fetch("http://localhost:3001/sports/statistic?" + new URLSearchParams({
      date: date,
      page: page,
      limit: limit,
    }) ).then((res) => res.json()),
    addSetMark: (result, setId) => 
      fetch("http://localhost:3001/sets/" + setId + "/result" , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result),
      }).then((res) => res.headers.get('Location')),
    fetchCategories: (title, page, limit) => fetch("http://localhost:3000/categories?" + new URLSearchParams({
        title: title,
        page: page,
        limit: limit,
      }) ).then((res) => res.json()),
    addArticle: (article, category) => fetch("http://localhost:3000/categories/" + category + '/article', {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: article,
      }).then((res) => res.json()),
    fetchArticle: (articleId) => fetch("http://localhost:3000/articles/" + articleId).then((res) => res.json()),
    fetchFragments: (articleId, page, limit) => fetch("http://localhost:3000/articles/" + articleId + "/fragments?" + new URLSearchParams({
      page: page,
      limit: limit,
    }) ).then((res) => res.json()),
    fetchArticlesByTitle: (title, page, limit) => fetch("http://localhost:3000/articles?" + new URLSearchParams({
      title: title,
      page: page,
      limit: limit,
    }) ).then((res) => res.json()),
    addMark: (articleId, mark) => fetch("http://localhost:3000/articles/" + articleId + '/mark', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mark),
      }).then((res) => res.headers.get('Location')),
    fetchFilteredArticles: (categoryId, title, sort, period, page, limit) => fetch("http://localhost:3000/articles?" + new URLSearchParams({
      categoryId: categoryId,
      title: title,
      sort: sort,
      period: period,
      page: page,
      limit: limit,
      }) ).then((res) => res.json()),
    addComment: (articleId, comment) => fetch("http://localhost:3000/articles/" + articleId + '/comment', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
        }).then((res) => res.headers.get('Location')),
    fetchRootComments: (articleId, page, limit) => fetch("http://localhost:3000/articles/" + articleId + "/comments?" + new URLSearchParams({
      root: true,
      page: page,
      limit: limit,
    }) ).then((res) => res.json()),
    addEvent: (event) => fetch("http://localhost:3002/event", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + Cookies.get('access_token') },
      body: JSON.stringify(event),
      }).then((res) => res.headers.get('Location')),
    addUser: (user) => fetch("http://localhost:3003/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
      }).then((res) => res.headers.get('Location')),
    login: (user) => fetch("http://localhost:3003/login", {
      credentials: "include",
      method: "POST",
      body: new URLSearchParams({
        'username': user.username,
        'password': user.password
      })}).then((res) => res.text()),
    verify: (token) => fetch("http://localhost:3003/login", {
      method: "POST",
      body: token
      }).then((res) => res),
    fetchUsers: (username, page, limit) => fetch("http://localhost:3003/users?" + new URLSearchParams({
      username: username,
      page: page,
      limit: limit
    }),{
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')}  
    }).then((res) => res.json()),
  fetchUserId: () => fetch("http://localhost:3003/id",{
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')}  
    }).then((res) => res.json()),
  fetchEvents: (title, latitude, longitude, page, limit) => fetch("http://localhost:3002/events?" + new URLSearchParams({
      title: title,
      latitude: latitude,
      longitude: longitude,
      page: page,
      limit: limit
    }),{
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')}  
    }).then((res) => res.json()),
  fetchEvent: (id) => fetch("http://localhost:3002/events/" + id, {
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')}  
    }).then((res) => res.json()),
  fetchEventMembers: (id) => fetch("http://localhost:3002/events/" + id + '/members?' + new URLSearchParams({
    page: 0,
    limit: 25
  }), {
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')}  
    }).then((res) => res.json()),
  joinEvent: (id) => fetch("http://localhost:3002/events/" + id + '/member', {
        method: "POST",
        headers: {"Authorization": "Bearer " + Cookies.get('access_token')}  
      }).then((res) => res.json()),
  fetchMeasures: () => fetch("http://localhost:3001/measures", {
        method: "GET",
        headers: {"Authorization": "Bearer " + Cookies.get('access_token')}  
      }).then((res) => res.json()),
  addMedicine: (medicine) => fetch("http://localhost:3001/medicine", {
        method: "POST",
        headers: {"Authorization": "Bearer " + Cookies.get('access_token'), "Content-Type": "application/json"},
        body: JSON.stringify(medicine)  
      }).then((res) => res),
  fetchMedicines: (name, page, limit) => fetch("http://localhost:3001/medicines?" + new URLSearchParams({
    name: name,
    page: page,
    limit: limit
  }), {
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')},
    }).then((res) => res.json()),
   deleteMedicine: (id) => fetch("http://localhost:3001/medicines/" + id, {
      method: "DELETE",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')},
    }).then((res) => res),
  fetchMedicine: (id) => fetch("http://localhost:3001/medicines/" + id, {
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')},
    }).then((res) => res.json()),
  addTreatment: (body) => fetch("http://localhost:3001/treatment", {
      method: "POST",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token'), "Content-Type": "application/json"},
      body: JSON.stringify(body)
    }).then((res) => res.json()),
  fetchIntakes: (page, limit) => fetch("http://localhost:3001/intakes?" + new URLSearchParams({
    planned: true,
    page: page,
    limit: limit
  }), {
      method: "GET",
      headers: {"Authorization": "Bearer " + Cookies.get('access_token')},
    }).then((res) => res.json()),
  fetchNextIntakes: (page, limit) => fetch("http://localhost:3001/intakes?" + new URLSearchParams({
    next: true,
    page: page,
    limit: limit
    }), {
        method: "GET",
        headers: {"Authorization": "Bearer " + Cookies.get('access_token')},
      }).then((res) => res.json()),
  addIntakeResult: (intakeId, body) => fetch("http://localhost:3001/intakes/" + intakeId + "/result", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {"Authorization": "Bearer " + Cookies.get('access_token'), "Content-Type": "application/json"},
      }).then((res) => res),
  fetchMissedIntakes: (page, limit) => fetch("http://localhost:3001/intakes?" + new URLSearchParams({
    missed: true,
    page: page,
    limit: limit
  }), {
        headers: {"Authorization": "Bearer " + Cookies.get('access_token')},
      }).then((res) => res)
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
function* addSportSaga(action) {
  try {
    const sport = yield call(api.addSport, action.payload);
    console.log("add sport saga " + sport);
    yield put(addSportSuccess(sport));
  } catch (error) {
    yield put(addSportFailure(error.message));
  }
}
function* fetchSportsSaga(action) {
  try {
    const sports = yield call(api.fetchSports, action.payload.description, action.payload.page, action.payload.limit);
    console.log(sports);
    yield put(fetchSportsSuccess(sports));
  } catch (error) {
    yield put(fetchSportsFailure(error.message));
  }
}
function* fetchPlannedTrainsSaga(action) {
  try {
    const plannedTrains = yield call(api.fetchPlannedTrains, action.payload.page, action.payload.limit);
    console.log(plannedTrains);
    yield put(fetchPlannedTrainsSuccess(plannedTrains));
  } catch (error) {
    yield put(fetchPlannedTrainsFailure(error.message));
  }
}
function* fetchSportStatisticSaga(action) {
  try {
    const sportStatistic = yield call(api.fetchSportStatistic, action.payload.start, action.payload.end, action.payload.page, action.payload.limit, action.payload.range);
    console.log(sportStatistic);
    yield put(fetchSportStatisticSuccess(sportStatistic));
  } catch (error) {
    yield put(fetchSportStatisticFailure(error.message));
  }
}
function* fetchSportStatisticByDateSaga(action) {
  try {
    const sportStatistic = yield call(api.fetchSportStatisticByDate, action.payload.date, action.payload.page, action.payload.limit);
    console.log(sportStatistic);
    yield put(fetchSportStatisticByDateSuccess(sportStatistic));
  } catch (error) {
    yield put(fetchSportStatisticByDateFailure(error.message));
  }
}
function* addSetMarkSaga(action) {
  try {
    const setMark = yield call(api.addSetMark, action.payload.result, action.payload.setId);
    yield put(addSetMarkSuccess(action.payload.setId));
  } catch (error) {
    yield put(addSetMarkFailure(error.message));
  }
}
function* fetchCategoriesSaga(action) {
  try {
    const categories = yield call(api.fetchCategories, action.payload.title, action.payload.page, action.payload.limit);
    console.log(categories);
    yield put(fetchCategoriesSuccess(categories));
  } catch (error) {
    yield put(fetchCategoriesFailure(error.message));
  }
}

function* addArticleSaga(action) {
  try {
    const article = yield call(api.addArticle, action.payload.article, action.payload.category);
    console.log("add article saga " + article);
    yield put(addArticleSuccess(article));
  } catch (error) {
    yield put(addArticleFailure(error.message));
  }
}
function* fetchArticleSaga(action) {
  try {
    const article = yield call(api.fetchArticle, action.payload.articleId);
    console.log("fetch article saga " + article);
    console.log(article);
    yield put(fetchArticleSuccess(article));
  } catch (error) {
    yield put(fetchArticleFailure(error.message));
  }
}
function* fetchFragmentsSaga(action) {
  try {
    const fragments = yield call(api.fetchFragments, action.payload.articleId, action.payload.page, action.payload.limit);
    console.log("fetch fragments saga " + fragments);
    yield put(fetchFragmentsSuccess(fragments));
  } catch (error) {
    yield put(fetchFragmentsFailure(error.message));
  }
}
function* fetchArticlesByTitleSaga(action) {
  try {
    const articles = yield call(api.fetchArticlesByTitle, action.payload.title, action.payload.page, action.payload.limit);
    console.log("fetch articles saga " + articles);
    console.log(articles.content);
    yield put(fetchArticlesByTitleSuccess(articles));
  } catch (error) {
    yield put(fetchArticlesByTitleFailure(error.message));
  }
}

function* addMarkSaga(action) {
  try {
    console.log(action.payload.mark);
    const addedMark = yield call(api.addMark, action.payload.articleId, action.payload.mark);
    console.log("add mark saga " + addedMark);
    console.log(addedMark);
    yield put(addMarkSuccess(addedMark));
  } catch (error) {
    yield put(addMarkFailure(error.message));
  }
}

function* fetchFilteredArticlesSaga(action) {
  try {
    const articles = yield call(api.fetchFilteredArticles, action.payload.categoryId, action.payload.title, action.payload.sort, action.payload.period, action.payload.page, action.payload.limit);
    console.log("fetch articles saga " + articles);
    console.log(articles.content);
    yield put(fetchFilteredArticlesSuccess(articles));
  } catch (error) {
    yield put(fetchFilteredArticlesFailure(error.message));
  }
}

function* addCommentSaga(action) {
  try {
    console.log(action.payload.comment);
    const addedComment = yield call(api.addComment, action.payload.articleId, action.payload.comment);
    console.log("add comment saga " + addedComment);
    console.log(addedComment);
    yield put(addCommentSuccess(addedComment));
  } catch (error) {
    yield put(addCommentFailure(error.message));
  }
}

function* fetchRootCommentsSaga(action) {
  try {
    const rootComments = yield call(api.fetchRootComments, action.payload.articleId, action.payload.page, action.payload.limit);
    console.log("fetch root comments saga " + rootComments);
    console.log(rootComments);
    yield put(fetchRootCommentsSuccess(rootComments));
  } catch (error) {
    yield put(fetchRootCommentsFailure(error.message));
  }
}

function* addEventSaga(action) {
  try {
    console.log(action.payload.event);
    const addedEvent = yield call(api.addEvent, action.payload);
    console.log("add event saga " + addedEvent);
    console.log(addedEvent);
    yield put(addEventSuccess(addedEvent));
  } catch (error) {
    yield put(addEventFailure(error.message));
  }
}

function* addUserSaga(action) {
  try {
    console.log(action.payload);
    const addedUser = yield call(api.addUser, action.payload);
    console.log("add user saga " + addedUser);
    console.log(addedUser);
    yield put(addUserSuccess(addedUser));
  } catch (error) {
    yield put(addUserFailure(error.message));
  }
}

function* loginSaga(action) {
  try {
    console.log(action.payload);
    const loggedUser = yield call(api.login, action.payload);
    console.log("logged user saga " + loggedUser);
    console.log(loggedUser);
    yield put(loginSuccess(loggedUser));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* verifySaga(action) {
  try {
    yield call(api.verify, action.payload);
    yield put(verifySuccess());
  } catch (error) {
    yield put(verifyFailure(error.message));
  }
}

function* fetchUsersSaga(action) {
  try {
    const users = yield call(api.fetchUsers, action.payload.username, action.payload.page, action.payload.limit);
    yield put(fetchUsersSuccess(users));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

function* fetchUserIdSaga(action) {
  try {
    const userId = yield call(api.fetchUserId);
    yield put(fetchUserIdSuccess(userId));
  } catch (error) {
    yield put(fetchUserIdFailure(error.message));
  }
}

function* fetchEventsSaga(action) {
  try {
    const events = yield call(api.fetchEvents, action.payload.title, action.payload.latitude, action.payload.longitude, action.payload.page, action.payload.limit);
    yield put(fetchEventsSuccess(events));
  } catch (error) {
    yield put(fetchEventsFailure(error.message));
  }
}

function* fetchEventSaga(action) {
  try {
    const event = yield call(api.fetchEvent, action.payload.id);
    yield put(fetchEventSuccess(event));
  } catch (error) {
    yield put(fetchEventFailure(error.message));
  }
}

function* fetchEventMembersSaga(action) {
  try {
    const members = yield call(api.fetchEventMembers, action.payload.id, action.payload.page, action.payload.limit);
    yield put(fetchEventMembersSuccess(members));
  } catch (error) {
    yield put(fetchEventMembersFailure(error.message));
  }
}

function* joinEventSaga(action) {
  try {
    const joinedEvent = yield call(api.joinEvent, action.payload.eventId);
    yield put(joinEventSuccess(joinedEvent));
  } catch (error) {
    yield put(joinEventFailure(error.message));
  }
}

function* fetchMeasuresSaga(action) {
  try {
    const measures = yield call(api.fetchMeasures);
    yield put(fetchMeasuresSuccess(measures));
  } catch (error) {
    yield put(fetchMeasuresFailure(error.message));
  }
}

function* addMedicineSaga(action) {
  try {
    const res = yield call(api.addMedicine, action.payload);
    console.log(res);
    console.log(res.headers);
    if(res.status != 201) {
      yield put(addMedicineFailure(res.json()));
    }
    else {
      const location = res.headers.get('Location');
      console.log(location);
      yield put(addMedicineSuccess(location));
    }
  } catch (error) {
    yield put(addMedicineFailure(error.message));
  }
}

function* fetchMedicinesSaga(action) {
  try {
    const medicines = yield call(api.fetchMedicines, action.payload.name, action.payload.page, action.payload.limit);
    yield put(fetchMedicinesSuccess(medicines));
  } catch (error) {
    yield put(fetchMedicinesFailure(error.message));
  }
}

function* deleteMedicineSaga(action) {
  try {
    const id = action.payload.id;
    const res = yield call(api.deleteMedicine, id);
    if(res.status == 204) {
      yield put(deleteMedicineSuccess(id));
    }
  } catch (error) {
    yield put(deleteMedicineFailure(error.message));
  }
}

function* fetchMedicineSaga(action) {
  try {
    const medicine = yield call(api.fetchMedicine, action.payload.name, action.payload.page, action.payload.limit);
    yield put(fetchMedicineSuccess(medicine));
  } catch (error) {
    yield put(fetchMedicineFailure(error.message));
  }
}

function* addTreatmentSaga(action) {
  try {
    const treatment = yield call(api.addTreatment, action.payload);
    yield put(addTreatmentSuccess(treatment));
  } catch (error) {
    yield put(addTreatmentFailure(error.message));
  }
}

function* fetchIntakesSaga(action) {
  try {
    const intakes = yield call(api.fetchIntakes, action.payload.page, action.payload.limit);
    yield put(fetchIntakesSuccess(intakes));
  } catch (error) {
    yield put(fetchIntakesFailure(error.message));
  }
}

function* fetchNextIntakesSaga(action) {
  try {
    const intakes = yield call(api.fetchNextIntakes, action.payload.page, action.payload.limit);
    yield put(fetchNextIntakesSuccess(intakes));
  } catch (error) {
    yield put(fetchNextIntakesFailure(error.message));
  }
}

function* addIntakeResultSaga(action) {
  try {
    const id = action.payload.id;
    const res = yield call(api.addIntakeResult, id, action.payload.result);
    if(res.status == 201) {
      console.log('look');
      console.log(id);
      yield put(addIntakeResultSuccess(id));
    }
  } catch (error) {
    yield put(addIntakeResultFailure(error.message));
  }
}

function* fetchMissedIntakesSaga(action) {
  try {
    const missedIntakes = yield call(api.fetchMissedIntakes, action.payload.page, action.payload.limit);
    yield put(fetchMissedIntakesSuccess(missedIntakes));
  } catch (error) {
    yield put(fetchMissedIntakesFailure(error.message));
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
    takeEvery(addExerciseRequest.type, addExerciseSaga),
    takeEvery(addSportRequest.type, addSportSaga),
    takeEvery(fetchSportsRequest.type, fetchSportsSaga),
    takeEvery(fetchPlannedTrainsRequest.type, fetchPlannedTrainsSaga),
    takeEvery(fetchSportStatisticRequest.type, fetchSportStatisticSaga),
    takeEvery(fetchSportStatisticByDateRequest.type, fetchSportStatisticByDateSaga),
    takeEvery(addSetMarkRequest.type, addSetMarkSaga),
    takeEvery(fetchCategoriesRequest.type, fetchCategoriesSaga),
    takeEvery(addArticleRequest.type, addArticleSaga),
    takeEvery(fetchArticleRequest.type, fetchArticleSaga),
    takeEvery(fetchFragmentsRequest.type, fetchFragmentsSaga),
    takeEvery(fetchArticlesByTitleRequest.type, fetchArticlesByTitleSaga),
    takeEvery(addMarkRequest.type, addMarkSaga),
    takeEvery(fetchFilteredArticlesRequest.type, fetchFilteredArticlesSaga),
    takeEvery(addCommentRequest.type, addCommentSaga),
    takeEvery(fetchRootCommentsRequest.type, fetchRootCommentsSaga),
    takeEvery(addEventRequest.type, addEventSaga),
    takeEvery(addUserRequest.type, addUserSaga),
    takeEvery(loginRequest.type, loginSaga),
    takeEvery(verifyRequest.type, verifySaga),
    takeEvery(fetchUsersRequest.type, fetchUsersSaga),
    takeEvery(fetchUserIdRequest.type, fetchUserIdSaga),
    takeEvery(fetchEventsRequest.type, fetchEventsSaga),
    takeEvery(fetchEventRequest.type, fetchEventSaga),
    takeEvery(fetchEventMembersRequest.type, fetchEventMembersSaga),
    takeEvery(joinEventRequest.type, joinEventSaga),
    takeEvery(fetchMeasuresRequest.type, fetchMeasuresSaga),
    takeEvery(addMedicineRequest.type, addMedicineSaga),
    takeEvery(fetchMedicinesRequest.type, fetchMedicinesSaga),
    takeEvery(deleteMedicineRequest.type, deleteMedicineSaga),
    takeEvery(fetchMedicineRequest.type, fetchMedicineSaga),
    takeEvery(addTreatmentRequest.type, addTreatmentSaga),
    takeEvery(fetchIntakesRequest.type, fetchIntakesSaga),
    takeEvery(fetchNextIntakesRequest.type, fetchNextIntakesSaga),
    takeEvery(addIntakeResultRequest.type, addIntakeResultSaga),
    takeEvery(fetchMissedIntakesRequest.type, fetchMissedIntakesSaga)
  ]);
}

export default function* rootSaga() {
  yield all([watchShopActions()]);
}