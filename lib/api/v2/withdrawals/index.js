const { request } = require("../../../request");

exports.getWithdrawals = async (
    accountId,
    apiKey,
    start,
    end,
    status,
    offset,
    limit,
    fromHash,
    tokenSymbol
) =>
    request(
        "GET",
        "api/v2/user/withdrawals",
        {
            accountId,
            start,
            end,
            status,
            offset,
            limit,
            fromHash,
            tokenSymbol,
        },
        { "X-API-KEY": apiKey }
    );
