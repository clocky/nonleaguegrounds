require("dotenv").config();

module.exports = function () {
  return {
    google_maps_api_key: process.env.GOOGLE_MAPS_API_KEY,
    bing_maps_api_key: process.env.BING_MAPS_API_KEY,
    mapbox_api_key: process.env.MAPBOX_API_KEY,
  };
};
