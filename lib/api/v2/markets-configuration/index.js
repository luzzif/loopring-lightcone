const { request } = require("../../../request");

exports.getMarketsConfiguration = async () => {
    const markets = await request("GET", "api/v2/exchange/markets");
    // FIXME: ugly way to handle this
    const delistedMarkets = ["TRB-ETH"];
    const validMarkets = markets.filter(
        (market) => delistedMarkets.indexOf(market.market) < 0
    );
    return validMarkets;
};
