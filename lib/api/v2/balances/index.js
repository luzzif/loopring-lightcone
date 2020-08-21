const { request } = require("../../../request");

exports.getBalances = async (accountId, apiKey, skip, limit) =>
    request(
        "GET",
        "api/v2/user/balances",
        { accountId, skip, limit },
        { "X-API-KEY": apiKey }
    );
