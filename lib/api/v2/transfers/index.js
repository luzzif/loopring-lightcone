const { request } = require("../../../request");

exports.getTransfers = async (
    accountId,
    tokenSymbol,
    limit,
    offset,
    apiKey
) => {
    const response = await request(
        "GET",
        "api/v2/user/transfers",
        {
            accountId,
            limit,
            offset,
            start: 0,
            end: Date.now() * 1000,
            tokenSymbol,
        },
        {
            "X-API-KEY": apiKey,
        }
    );
    const { totalNum: total, transactions } = response;
    return {
        total,
        transactions,
        limit,
        offset,
    };
};

exports.postTransfer = async (transfer, signature, apiKey) =>
    request("POST", "api/v2/transfer", transfer, {
        "X-API-KEY": apiKey,
        "X-API-SIG": signature,
    });
