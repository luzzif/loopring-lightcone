const { request } = require("../../../request");

exports.getRecommendedGasPrice = async () =>
    await request("GET", "api/v2/recommendedGasPrice");
