const { request } = require("../../../request");
const { getTokenBySymbol } = require("../../../utils");

export const getEthereumTokenBalances = async (owner, symbol, tokens) => {
    const token = getTokenBySymbol(symbol, tokens);
    return await request("GET", "api/v2/tokenBalances", {
        owner,
        token: token.address,
    });
};
