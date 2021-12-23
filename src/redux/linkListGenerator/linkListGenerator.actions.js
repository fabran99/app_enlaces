import {
  INITIALIZE_LINK_LIST_COMMUNICATION,
  LINK_LIST_CHANGE,
  GENERATION_FINISH,
} from "./linkListGenerator.types";
import { HISTORICAL_LINK_ADD } from "../historicalData/historicalData.types";

export const handleLinkListGenerationCommunication = (data) => (dispatch) => {
  let { payload, type } = JSON.parse(data);
  dispatch({
    type,
    payload,
  });

  if (type == GENERATION_FINISH) {
    dispatch({
      type: HISTORICAL_LINK_ADD,
      payload,
    });
  }
};

export const onLinkListChange = (data) => (dispatch) => {
  dispatch({
    type: LINK_LIST_CHANGE,
    payload: data,
  });
};

export const initializeLinkListCommunication = () => ({
  type: INITIALIZE_LINK_LIST_COMMUNICATION,
});
