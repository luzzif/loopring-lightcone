const { request } = require("../../../request");

exports.getApiKey = async (accountId, publicKeyX, publicKeyY, signature) =>
    request(
        "GET",
        "api/v2/apiKey",
        { accountId, publicKeyX, publicKeyY },
        { "X-API-SIG": signature }
    );

exports.getAccount = async (owner) =>
    request("GET", "api/v2/account", { owner });
