import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./index";
import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";
import rootSaga from "./root-saga";

const initialState = {};
const sagaMiddleware = createSagaMiddleware();

const middleware = [thunk, sagaMiddleware];

var store;
if (process.env.NODE_ENV == "development") {
  // middleware.push(logger);
  try {
    store = createStore(
      rootReducer,
      initialState,
      //  en caso de que no esté instalada la extension de redux comentar
      //las siguientes 3 lineas y descomentar la otra
      compose(
        applyMiddleware(...middleware),
        window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    );
  } catch {
    {
      store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(...middleware)
      );
    }
  }
} else {
  store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
  );
}

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export default { store, persistor };
