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
  nutritionStatistic: [],
  exercises: [],
  addedExercise: null,
  addedSport: null,
  sports: [],
  trains: [],
  sportStatistic: [],
  addedSetMark: null,
  categories: [],
  addedArticle: null,
  article: null,
  fragments: [],
  articles: [],
  addedRating: null,
  addedComment: null,
  rootComments: []
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
    },
    fetchExercisesRequest(state, action) {
        state.loading = true;
    },
    fetchExercisesSuccess(state, action) {
      state.loading = false;
      state.exercises = action.payload.content;
      console.log('exercises');
      console.log(state.exercises);
    },
    fetchExercisesFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },
    addExerciseRequest(state, action) {
      console.log('add exercise request');
      state.loading = true;
    },
    addExerciseSuccess(state, action) {
      console.log("added exercise");
      console.log(action);
      state.loading = false;
      state.addedExercise = action;
    },
    addExerciseFailure(state, action) {
        state.loading = false;
        state.error = action.payload;
    },

    addSportRequest(state, action) {
      console.log('add sport request');
      console.log(action.payload);
      state.loading = true;
    },
    addSportSuccess(state, action) {
      console.log("added sport");
      console.log(action);
      state.loading = false;
      state.addedSport = action;
    },
    addSportFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchSportsRequest(state, action) {
      state.loading = true;
  },
    fetchSportsSuccess(state, action) {
      state.loading = false;
      state.sports = action.payload;
      console.log('sports');
      console.log(state.sports);
  },
    fetchSportsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
  },
  fetchPlannedTrainsRequest(state, action) {
    state.loading = true;
  },
  fetchPlannedTrainsSuccess(state, action) {
    state.loading = false;
    state.trains = action.payload;
    console.log('trains');
    console.log(state.trains);
  },
  fetchPlannedTrainsFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchSportStatisticRequest(state, action) {
    state.loading = true;
  },
  fetchSportStatisticSuccess(state, action) {
    state.loading = false;
    state.sportStatistic = action.payload.content;
    console.log('sport statistic');
    console.log(state.sportStatistic);
  },
  fetchSportStatisticFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchSportStatisticByDateRequest(state, action) {
    state.loading = true;
  },
  fetchSportStatisticByDateSuccess(state, action) {
    state.loading = false;
    state.sportStatistic = action.payload.content;
    console.log('sport statistic');
    console.log(state.sportStatistic);
  },
  fetchSportStatisticByDateFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  addSetMarkRequest(state, action) {
    state.loading = true;
  },
  addSetMarkSuccess(state, action) {
    state.loading = false;
    state.addedSetMark = action.payload;
  },
  addSetMarkFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchCategoriesRequest(state, action) {
    state.loading = true;
  },
  fetchCategoriesSuccess(state, action) {
    state.loading = false;
    state.categories = action.payload.content;
  },
  fetchCategoriesFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  addArticleRequest(state, action) {
    state.loading = true;
  },
  addArticleSuccess(state, action) {
    state.loading = false;
    state.addedArticle = action.payload;
  },
  addArticleFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchArticleRequest(state, action) {
    state.loading = true;
  },
  fetchArticleSuccess(state, action) {
    state.loading = false;
    state.article = action.payload;
  },
  fetchArticleFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchFragmentsRequest(state, action) {
    state.loading = true;
  },
  fetchFragmentsSuccess(state, action) {
    state.loading = false;
    state.fragments = action.payload.content;
  },
  fetchFragmentsFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchArticlesByTitleRequest(state, action) {
    state.loading = true;
  },
  fetchArticlesByTitleSuccess(state, action) {
    state.loading = false;
    state.articles = action.payload.content;
  },
  fetchArticlesByTitleFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  addMarkRequest(state, action) {
    state.loading = true;
  },
  addMarkSuccess(state, action) {
    state.loading = false;
    state.addedMark = action.payload;
  },
  addMarkFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchFilteredArticlesRequest(state, action) {
    state.loading = true;
  },
  fetchFilteredArticlesSuccess(state, action) {
    state.loading = false;
    state.articles = action.payload.content;
  },
  fetchFilteredArticlesFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  addCommentRequest(state, action) {
    state.loading = true;
  },
  addCommentSuccess(state, action) {
    state.loading = false;
    state.addedComment = action.payload;
  },
  addCommentFailure(state, action) {
    state.loading = false;
    state.error = action.payload;
  },
  fetchRootCommentsRequest(state, action) {
    state.loading = true;
  },
  fetchRootCommentsSuccess(state, action) {
    state.loading = false;
    state.rootComments = action.payload.content;
  },
  fetchRootCommentsFailure(state, action) {
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
  fetchNutritionStatisticFailure,
  fetchExercisesRequest,
  fetchExercisesSuccess,
  fetchExercisesFailure,
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
  fetchRootCommentsFailure
} = healthSlice.actions;

export default healthSlice.reducer;