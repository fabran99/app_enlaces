import { INITIALIZE_SETTINGS_COMMUNICATION } from "./settings.types";
import { take, put, call, fork } from "redux-saga/effects";
import { updateSettings } from "./settings.actions";
import { eventChannel } from "redux-saga";
import { electron } from "../../nodeObjects/electron";

export function* subscribe() {
  return new eventChannel((emit) => {
    const onMessage = (event, data) => {
      return emit(updateSettings({ appUpdateAvailable: true }));
    };
    electron.ipcRenderer.on("UPDATE_READY", onMessage);
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

export function* listenToSettings() {
  yield take(INITIALIZE_SETTINGS_COMMUNICATION);
  yield fork(read);
}
