import { all, call } from "redux-saga/effects";
import { listenToUpload } from "./uploadHandler/uploadHandler.saga";
import { listenToGeneration } from "./linkListGenerator/linkListGenerator.saga";

export default function* rootSaga() {
  yield all([
    //   Upload
    call(listenToUpload),
    //   Generation
    call(listenToGeneration),
  ]);
}
