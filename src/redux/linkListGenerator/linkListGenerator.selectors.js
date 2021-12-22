import { createSelector } from "reselect";

const selectLinkListGenerator = (state) => state.linkListGenerator;

export const selectGenerating = createSelector(
  [selectLinkListGenerator],
  (linkListGenerator) => linkListGenerator.generating
);

export const selectGenerationCompletedData = createSelector(
  [selectLinkListGenerator],
  (linkListGenerator) => linkListGenerator.generationCompletedData
);

export const selectLinkListText = createSelector(
  [selectLinkListGenerator],
  (linkListGenerator) => linkListGenerator.linkListText
);
