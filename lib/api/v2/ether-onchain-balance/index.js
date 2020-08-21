const { request } = require("../../../request");

exports.getEtherOnChainBalance = async (owner) =>
    await request("GET", "api/v2/ethBalances", { owner });
