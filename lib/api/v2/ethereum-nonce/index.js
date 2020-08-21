const { request } =require("../../../request");

exports.getEthereumNonce = async (owner) =>
    await request("GET", "api/v2/ethNonce", { owner });
