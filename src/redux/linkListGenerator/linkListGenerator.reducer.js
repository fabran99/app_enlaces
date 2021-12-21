import {
  GENERATION_START,
  GENERATION_FINISH,
  GENERATION_LINK_FINISH,
  GENERATION_LINK_FAILED,
  GENERATION_LINK_START,
  GENERATION_LINKS_TEXT_UPDATE,
  LINK_LIST_CHANGE,
} from "./linkListGenerator.types";

var initialState = {
  generating: false,
  generationLinkList: [],
  generationLinkRemaining: [],
  generationLinkFailed: [],
  generationLinkFinished: [],
  generationLinkGenerating: null,
  generationCompletedData: null,
  linkListText: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GENERATION_START:
      return {
        ...state,
        generating: true,
        generationLinkList: action.payload,
        generationLinkRemaining: action.payload,
        generationLinkFailed: [],
        generationLinkFinished: [],
      };
    case GENERATION_FINISH:
      return {
        ...state,
        generating: false,
        generationCompletedData: action.payload,
      };

    case GENERATION_LINK_FINISH:
      return {
        ...state,
        generationLinkGenerating: null,
        generationLinkRemaining: state.generationLinkRemaining.filter(
          (file) => file !== action.payload
        ),
        generationLinkFinished: [
          ...state.generationLinkFinished,
          action.payload,
        ],
      };

    case GENERATION_LINK_FAILED:
      return {
        ...state,
        generationLinkGenerating: null,
        generationLinkRemaining: state.generationLinkRemaining.filter(
          (file) => file !== action.payload
        ),
        generationLinkFailed: [...state.generationLinkFailed, action.payload],
      };

    case GENERATION_LINK_START:
      return {
        ...state,
        generationLinkGenerating: action.payload,
      };

    case GENERATION_LINKS_TEXT_UPDATE:
      return {
        ...state,
        linkListText: action.payload,
      };

    case LINK_LIST_CHANGE:
      return {
        ...state,
        linkListText: action.payload,
      };

    default:
      return state;
  }
};
