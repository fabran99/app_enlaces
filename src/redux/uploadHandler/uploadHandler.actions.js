import { INITIALIZE_UPLOAD_COMMUNICATION } from "./uploadHandler.types";

export const handleUploadCommunication =
  ({ payload, type }) =>
  (dispatch) => {
    dispatch({
      type,
      payload,
    });
  };

export const initializeUploadCommunication = () => ({
  type: INITIALIZE_UPLOAD_COMMUNICATION,
});
