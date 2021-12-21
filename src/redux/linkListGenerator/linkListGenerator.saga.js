import { INITIALIZE_LINK_LIST_COMMUNICATION } from "./linkListGenerator.types";
import { take, put, call, fork } from "redux-saga/effects";
import { handleLinkListGenerationCommunication } from "./linkListGenerator.actions";
import { eventChannel } from "redux-saga";
import { electron } from "../../nodeObjects/electron";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      return emit(handleLinkListGenerationCommunication(data));
    };
    electron.ipcRenderer.on("LINK_LIST_GENERATOR_MESSAGE", onMessage);
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

export function* listenToGeneration() {
  yield take(INITIALIZE_LINK_LIST_COMMUNICATION);
  yield fork(read);
}
