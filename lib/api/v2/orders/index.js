const { request } = require("../../../request");

exports.getOrders = async ({
    accountId,
    limit,
    offset,
    market,
    statuses,
    apiKey,
}) => {
    const rawOrders = await request(
        "GET",
        "api/v2/orders",
        {
            accountId,
            market,
            limit,
            offset,
            start: 0,
            end: Date.now() * 1000,
            status: statuses && statuses.reduce((a, c) => a + "," + c),
        },
        { "X-API-KEY": apiKey }
    );
    const { totalNum: total, orders } = rawOrders;
    return {
        accountId,
        orders,
        total,
        limit,
        offset,
    };
};

exports.cancelOrder = async (
    accountId,
    orderHash,
    clientOrderId,
    signature,
    apiKey
) =>
    await request(
        "DELETE",
        "/api/v2/orders",
        {
            accountId: accountId,
            orderHash: orderHash,
            clientOrderId: clientOrderId,
        },
        {
            "X-API-KEY": apiKey,
            "X-API-SIG": signature,
        }
    );

exports.cancelAllOrders = async (accountId, signature, apiKey) =>
    await request(
        "DELETE",
        "api/v2/orders",
        {
            accountId: accountId,
        },
        {
            "X-API-KEY": apiKey,
            "X-API-SIG": signature,
        }
    );

exports.getOrderId = async (accountId, soldTokenId, apiKey) =>
    request(
        "GET",
        "api/v2/orderId",
        {
            accountId: accountId,
            tokenSId: soldTokenId,
        },
        { "X-API-KEY": apiKey }
    );

exports.postOrder = async (signedOrder, apiKey) =>
    request(
        "POST",
        "api/v2/order",
        null,
        { "X-API-KEY": apiKey, "Content-Type": "application/json" },
        signedOrder
    );
