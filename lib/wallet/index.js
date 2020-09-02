const {
    getSignedTransfer,
    getEncodedTransfer,
} = require("../signing/exchange");
const { toBuffer } = require("../utils");
const { sha256 } = require("ethereumjs-util");
const eddsa = require("../crypto/eddsa");
const erc20Abi = require("../abis/erc20.json");

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

exports.setMaximumTokenApproval = async (
    web3Instance,
    ethereumAccount,
    tokenAddress,
    exchangeAddress,
    gasPrice
) => {
    const erc20Contract = new web3Instance.eth.Contract(erc20Abi, tokenAddress);
    await erc20Contract.methods
        .approve(
            exchangeAddress,
            "0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF"
        )
        .send({
            from: ethereumAccount,
            gas: 100000,
            value: 0,
            gasPrice,
        });
};
