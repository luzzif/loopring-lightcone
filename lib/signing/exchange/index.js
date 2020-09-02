const { createHash: createPoseidonHash } = require("../../crypto/poseidon");
const { addHexPrefix } = require("../../utils");
const { API_HOST } = require("../../constants");
const sha256 = require("crypto-js/sha256");
const eddsa = require("../../crypto/eddsa");
const { isTestMode } = require("../../request");

const getPoseidonHasher = (t) => createPoseidonHash(t, 6, 53);

exports.getApiSignature = (accountId, publicKeyX, publicKeyY, secretKey) => {
    const method = "GET";
    const encodedUri = encodeURIComponent(
        `${isTestMode() ? API_HOST.TEST : API_HOST.PROD}/api/v2/apiKey`
    );
    const params = encodeURIComponent(
        `accountId=${accountId}&publicKeyX=${publicKeyX}&publicKeyY=${publicKeyY}`
    );
    const message = `${method}&${encodedUri}&${params}`;
    const hash = addHexPrefix(sha256(message).toString());
    const signed = eddsa.sign(secretKey, hash);
    return `${signed.Rx},${signed.Ry},${signed.s}`;
};

exports.getSignedOrder = (
    secretKey,
    exchangeId,
    id,
    accountId,
    validSince,
    validUntil,
    label,
    boughtTokenAddress,
    boughtTokenId,
    soldTokenAddress,
    soldTokenId,
    soldAmount,
    boughtAmount,
    buy,
    channelId,
    feeBips,
    maximumFeeBips,
    allOrNone,
    rebateBips
) => {
    const signedOrder = {
        exchangeId,
        orderId: id,
        accountId,
        tokenB: boughtTokenAddress,
        tokenBId: boughtTokenId,
        amountB: boughtAmount,
        tokenS: soldTokenAddress,
        tokenSId: soldTokenId,
        amountS: soldAmount,
        label,
        validSince,
        validUntil,
        buy: !!buy,
        feeBips: feeBips || 50,
        maxFeeBips: maximumFeeBips || 50,
        allOrNone: !!allOrNone,
        rebateBips: rebateBips || 0,
        channelId,
    };
    const poseidonHash = getPoseidonHasher(14);
    const orderHash = poseidonHash([
        exchangeId,
        id,
        accountId,
        soldTokenId,
        boughtTokenId,
        soldAmount,
        boughtAmount,
        allOrNone ? 1 : 0,
        validSince,
        validUntil,
        maximumFeeBips || 50,
        buy ? 1 : 0,
        label,
    ]).toString(10);
    const signature = eddsa.sign(secretKey, orderHash);
    return {
        ...signedOrder,
        signatureRx: signature.Rx,
        signatureRy: signature.Ry,
        signatureS: signature.s,
    };
};

exports.getEncodedTransfer = ({
    exchangeId,
    sender,
    receiver,
    token,
    amount,
    tokenF,
    amountF,
    label,
    nonce,
    memo,
}) =>
    addHexPrefix(
        sha256(
            JSON.stringify({
                exchangeId,
                sender,
                receiver,
                token,
                amount,
                tokenF,
                amountF,
                label,
                nonce,
                memo,
            })
        ).toString()
    );
