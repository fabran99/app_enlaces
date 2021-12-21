import { UPDATE_SETTINGS } from "./settings.types";

var initialState = {
  maxConcurrentUpdates: 1,
  maxConcurrentDownloads: 1,
  maxConcurrentLinkGenerators: 1,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};
