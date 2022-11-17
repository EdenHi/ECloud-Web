import {
  legacy_createStore,
  combineReducers,
  applyMiddleware,
  compose,
} from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import reduxThunk from "redux-thunk";
import handleUser from "./userState/reducer";

import hardSet from "redux-persist/lib/stateReconciler/hardSet";
const reducers = combineReducers({ handleUser });

const persistConfig = {
  key: "ECloud",
  storage,
  stateReconciler: hardSet,
};
const persistedReducer = persistReducer(persistConfig, reducers as any);
let composeEnHancers = window.__REDUX_DEVTOOLS_EXTENSTION_COMPOSE__
  ? window.__REDUX_DEVTOOLS_EXTENSTION_COMPOSE__({})
  : compose;
//创建仓库
const store = legacy_createStore(
  persistedReducer,
  composeEnHancers(applyMiddleware(reduxThunk))
);
let persistor = persistStore(store);

export { store, persistor };
