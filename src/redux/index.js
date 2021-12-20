import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import settingsReducer from "./settings/settings.reducer";
import uploadHandlerReducer from "./uploadHandler/uploadHandler.reducer";
import linkListGeneratorReducer from "./linkListGenerator/linkListGenerator.reducer";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["settings"],
  blacklist: ["uploadHandler", "linkListGenerator"],
};

const rootReducer = combineReducers({
  settings: settingsReducer,
  uploadHandler: uploadHandlerReducer,
  linkListGenerator: linkListGeneratorReducer,
});

export default persistReducer(persistConfig, rootReducer);
