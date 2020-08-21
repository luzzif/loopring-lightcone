const { request } = require("../../../request");
const { getTokenBySymbol } = require("../../../utils");

exports.getAllowance = async (owner, symbol, tokens) => {
    const token = getTokenBySymbol(symbol, tokens);
    if (!token) {
        throw new Error("could not get valid token from given symbol");
    }
    return request("GET", "api/v2/allowances", {
        owner,
        token: token.address,
    });
};
