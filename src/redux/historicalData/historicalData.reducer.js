import {
  HISTORICAL_LINK_REMOVE,
  HISTORICAL_LINK_CLEAN,
  HISTORICAL_LINK_ADD,
} from "./historicalData.types";

var initialState = {
  historicalLinkList: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case HISTORICAL_LINK_REMOVE:
      return {
        ...state,
        historicalLinkList: state.historicalLinkList.filter(
          (current_link) => current_link.link !== action.payload
        ),
      };
    case HISTORICAL_LINK_CLEAN:
      return {
        ...state,
        historicalLinkList: [],
      };
    case HISTORICAL_LINK_ADD:
      // add every link if it doesn't exist on the list
      let historicalLinks = state.historicalLinkList;
      action.payload.forEach((newLink) => {
        if (
          !historicalLinks.find(
            (current_link) => current_link.link === newLink.link
          )
        ) {
          historicalLinks.push({
            ...newLink,
            date: new Date(),
          });
        }
      });

      return {
        ...state,
        historicalLinkList: historicalLinks,
      };
    default:
      return state;
  }
};
