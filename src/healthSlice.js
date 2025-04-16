import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  metrics: [],
  indicators: [],
  nutritionValues: [],
  foods: [],
  loading: false,
  error: null,
  hasAdded: null,
  addedDiet: null,
  diets: [],
  selectedDiet: null,
  meals: [],
  nutritionStatistic: []
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
    addFoodRequest(state, action) {
      console.log('add food request');
      state.loading = true;
    },
    addFoodSuccess(state, action) {
      console.log("action");
      console.log(action);
      state.loading = false;
      state.hasAdded = action.id;
    },
    addFoodFailure(state, action) {
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
    fetchNutritionValuesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNutritionValuesSuccess(state, action) {
      console.log("got values ");
      state.nutritionValues = action.payload.content;
      state.loading = false;
    },
    fetchNutritionValuesFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchNutritionValuesByValueRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchNutritionValuesByValueSuccess(state, action) {
      console.log("got values by value");
      state.nutritionValues = action.payload.content;
      console.log(state.nutritionValues);
      state.loading = false;
    },
    fetchNutritionValuesByValueFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchFoodsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchFoodsSuccess(state, action) {
      console.log("got foods ");
      state.foods = action.payload.content;
      state.loading = false;
    },
    fetchFoodsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    addDietRequest(state, action) {
      console.log('add diet request');
      state.loading = true;
    },
    addDietSuccess(state, action) {
      console.log("action");
      console.log(action);
      state.loading = false;
      state.addedDiet = action;
    },
    addDietFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    fetchDietsByTitleRequest(state, action) {
      state.loading = true;
    },
    fetchDietsByTitleSuccess(state, action) {
      state.loading = false;
      console.log('title success');
      console.log(state);
      state.diets = action.payload.content;
    },
    fetchDietsByTitleFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    selectDiet(state, action) {
      state.selectedDiet = action.payload;
    },
    fetchActualDietsRequest(state, action) {
      state.loading = true;
    },
    fetchActualDietsSuccess(state, action) {
      state.loading = false;
      state.diets = action.payload.content;
    },
    fetchActualDietsFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    fetchPlannedMealsRequest(state, action) {
      state.loading = true;
    },
    fetchPlannedMealsSuccess(state, action) {
      state.loading = false;
      state.meals = action.payload;
      console.log('planned meals');
      console.log(state.meals);
    },
    fetchPlannedMealsFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    fetchNextMealsRequest(state, action) {
      state.loading = true;
    },
    fetchNextMealsSuccess(state, action) {
      state.loading = false;
      state.meals = action.payload;
      console.log('next meals');
      console.log(state.meals);
    },
    fetchNextMealsFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    fetchNutritionStatisticRequest(state, action) {
      state.loading = true;
    },
    fetchNutritionStatisticSuccess(state, action) {
      state.loading = false;
      state.nutritionStatistic = action.payload.content;
      console.log('next meals');
      console.log(state.meals);
    },
    fetchNutritionStatisticFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    }
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
  addMetricValueFailure,
  fetchNutritionValuesRequest,
  fetchNutritionValuesSuccess,
  fetchNutritionValuesFailure,
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
  selectDiet,
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
  fetchNutritionStatisticFailure
} = healthSlice.actions;

export default healthSlice.reducer;