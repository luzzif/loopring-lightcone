const { request } = require("../../../request");

exports.getTokens = async () => request("GET", "api/v2/exchange/tokens");
