import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import healthReducer from "./healthSlice";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const health = configureStore({
  reducer: {
    health: healthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default health;
