const { request } = require("../../../request");

exports.getDepth = async (market, level, limit) => {
    const rawDepth = await request("GET", "api/v2/depth", {
        market,
        level,
        limit,
    });
    const { bids, asks, version } = rawDepth;
    const parsedBids = bids.map(parseOrder);
    const parsedAsks = asks.map(parseOrder);
    return {
        bids: parsedBids,
        asks: parsedAsks,
        version,
    };
};

const parseOrder = ([price, size, volume, count]) => ({
    price,
    size,
    volume,
    count: parseInt(count),
});
