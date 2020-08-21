const { request } = require("../../../request");

exports.getExchangeInfo = async () => request("GET", "api/v2/exchange/info");
