const { toBuffer: toBufferUtils } = require("ethereumjs-util");

exports.getTokenBySymbol = (symbol, tokens) =>
    symbol &&
    tokens.find((token) => token.symbol.toLowerCase() === symbol.toLowerCase());

exports.getTokenByAddress = (address, tokens) =>
    address &&
    tokens.find(
        (token) => token.address.toLowerCase() === address.toLowerCase()
    );

exports.toBuffer = (input) =>
    input instanceof Buffer ? input : toBufferUtils(input);

exports.addHexPrefix = (input) => {
    if (typeof input === "string") {
        return input.startsWith("0x") ? input : "0x" + input;
    }
    throw new Error("tried to add a hex prefix to a non-string");
};
