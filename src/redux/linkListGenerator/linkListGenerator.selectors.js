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

export const selectRemaining = createSelector(
  [selectLinkListGenerator],
  (linkListGenerator) => linkListGenerator.generationLinkRemaining
);

export const selectFailed = createSelector(
  [selectLinkListGenerator],
  (linkListGenerator) => linkListGenerator.generationLinkFailed
);

export const selectFinished = createSelector(
  [selectLinkListGenerator],
  (linkListGenerator) => linkListGenerator.generationLinkFinished
);

export const selectLinkGenerating = createSelector(
  [selectLinkListGenerator],
  (linkListGenerator) => linkListGenerator.generationLinkGenerating
);
