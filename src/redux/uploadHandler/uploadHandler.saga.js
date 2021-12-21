import { INITIALIZE_UPLOAD_COMMUNICATION } from "./uploadHandler.types";
import { take, put, call, fork } from "redux-saga/effects";
import { handleUploadCommunication } from "./uploadHandler.actions";
import { eventChannel } from "redux-saga";
import { electron } from "../../nodeObjects/electron";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      return emit(handleUploadCommunication(data));
    };
    electron.ipcRenderer.on("UPLOAD_MESSAGE", onMessage);
    return () => {};
  });
}

function* read() {
  const channel = yield call(subscribe);
  while (true) {
    const action = yield take(channel);
    yield put(action);
  }
}

export function* listenToUpload() {
  yield take(INITIALIZE_UPLOAD_COMMUNICATION);
  yield fork(read);
}
