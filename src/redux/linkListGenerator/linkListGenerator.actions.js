import {
  INITIALIZE_LINK_LIST_COMMUNICATION,
  LINK_LIST_CHANGE,
} from "./linkListGenerator.types";

export const handleLinkListGenerationCommunication = (data) => (dispatch) => {
  let { payload, type } = JSON.parse(data);
  dispatch({
    type,
    payload,
  });
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
