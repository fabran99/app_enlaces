import {
  HISTORICAL_LINK_REMOVE,
  HISTORICAL_LINK_CLEAN,
  HISTORICAL_LINK_ADD,
} from "./historicalData.types";

export const historicalLinkRemove = (data) => ({
  type: HISTORICAL_LINK_REMOVE,
  payload: data,
});

export const historicalLinkClean = () => ({
  type: HISTORICAL_LINK_CLEAN,
});

export const historicalLinkAdd = (data) => ({
  type: HISTORICAL_LINK_ADD,
  payload: data,
});
