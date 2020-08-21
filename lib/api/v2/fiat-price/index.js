const { request } = require("../../../request");

exports.getTokensFiatPrice = async (fiat) =>
    request("GET", "api/v2/price", { legal: fiat });
