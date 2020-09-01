const { request } = require("../../../request");

exports.getDeposits = async (
    accountId,
    apiKey,
    start,
    end,
    allTypes,
    status,
    offset,
    limit,
    fromHash,
    tokenSymbol
) =>
    request(
        "GET",
        "api/v2/user/deposits",
        {
            accountId,
            start,
            end,
            allType: allTypes,
            status,
            offset,
            limit,
            fromHash,
            tokenSymbol,
        },
        { "X-API-KEY": apiKey }
    );
