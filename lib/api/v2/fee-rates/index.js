const { request } = require("../../../request");

exports.getFeeRates = async (accountId, markets, apiKey) =>
    request(
        "GET",
        "api/v2/user/feeRates",
        {
            markets: markets.join(","),
            accountId,
        },
        { "X-API-KEY": apiKey }
    );
