import Stack from "../sdk/entry.d";

export const getHomePageLandingRes = async () => {
  const response = await Stack.getEntry({
    contentTypeUid: "home_page_landing",
    // referenceFieldPath: ["section_blocks.slider_experience.category"],
  });
  return response[0][0];
};

export const getAboutPage = async () => {
  const response = await Stack.getEntry({
    contentTypeUid: "about",
    // referenceFieldPath: ["section_blocks.slider_experience.category"],
  });
  return response[0][0];
};
