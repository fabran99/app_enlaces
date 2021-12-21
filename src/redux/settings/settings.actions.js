import { UPDATE_SETTINGS } from "./settings.types";

export const updateSettings = (data) => (dispatch) => {
  dispatch({
    type: UPDATE_SETTINGS,
    payload: data,
  });
};
