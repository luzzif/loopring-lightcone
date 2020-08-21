const { getSignedTransfer, getEncodedTransfer } = require("../signing/exchange");
const { toBuffer } = require("../utils");
const { sha256 } = require("ethereumjs-util");
const eddsa = require("../crypto/eddsa");

exports.generateKeyPair = async (web3, exchangeAddress, address, nonce) => {
    const message = `Sign this message to access Loopring Exchange: ${exchangeAddress} with key nonce: ${nonce}`;
    const signature = await web3.eth.personal.sign(message, address, "");
    const signerAddress = await web3.eth.personal.ecRecover(message, signature);
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error(
            "signer's and recovered account's address do not match"
        );
    }
    return eddsa.generateKeyPair(sha256(toBuffer(signature)));
};

exports.getSignedTransfer = async (
    web3,
    address,
    transfer,
    keyPair,
    accountId,
    tokens
) => {
    transfer.sender = accountId;
    const signedTransfer = getSignedTransfer(transfer, keyPair, tokens);
    const encodedTransfer = getEncodedTransfer(signedTransfer);
    return await web3.eth.personal.sign(
        `Sign this message to authorize Loopring Pay: ${encodedTransfer}`,
        address,
        ""
    );
};
