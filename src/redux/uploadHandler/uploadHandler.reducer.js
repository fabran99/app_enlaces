import {
  UPLOAD_START,
  UPLOAD_FINISH,
  FILE_UPLOAD_FINISHED,
  FILE_UPLOAD_FAILED,
  FILE_UPLOAD_STARTED,
} from "./uploadHandler.types";

var initialState = {
  uploading: false,
  uploadFileList: [],
  uploadFileUploading: [],
  uploadFileRemaining: [],
  uploadFileFailed: [],
  uploadFileFinished: [],
  uploadCompletedData: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case UPLOAD_START:
      return {
        ...state,
        uploading: true,
        uploadFileList: action.payload,
        uploadFileUploading: [],
        uploadFileRemaining: action.payload,
        uploadFileFailed: [],
        uploadFileFinished: [],
      };
    case UPLOAD_FINISH:
      return {
        ...state,
        uploading: false,
        uploadCompletedData: action.payload,
      };
    case FILE_UPLOAD_FINISHED:
      return {
        ...state,
        uploadFileUploading: state.uploadFileUploading.filter(
          (file) => file !== action.payload
        ),
        uploadFileRemaining: state.uploadFileRemaining.filter(
          (file) => file !== action.payload
        ),
        uploadFileFinished: [...state.uploadFileFinished, action.payload],
      };
    case FILE_UPLOAD_FAILED:
      return {
        ...state,
        uploadFileUploading: state.uploadFileUploading.filter(
          (file) => file !== action.payload
        ),
        uploadFileFailed: [...state.uploadFileFailed, action.payload],
      };
    case FILE_UPLOAD_STARTED:
      return {
        ...state,
        uploadFileUploading: [...state.uploadFileUploading, action.payload],
      };
    default:
      return state;
  }
};
