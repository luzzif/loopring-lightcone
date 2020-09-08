const {
    getSignedTransfer: getExchangeSignedTransfer,
    getEncodedTransfer,
} = require("../signing/exchange");
const { toBuffer } = require("../utils");
const { sha256 } = require("ethereumjs-util");
const eddsa = require("../crypto/eddsa");
const erc20Abi = require("../abis/erc20.json");
const exchangeAbi = require("../abis/exchange.json");

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
    secretKey,
    tokenDecimals,
    tokenId,
    tokenFId,
    amount,
    amountF,
    exchangeId,
    sender,
    receiver,
    label,
    nonce,
    memo
) => {
    const signedTransfer = getExchangeSignedTransfer(
        secretKey,
        tokenDecimals,
        tokenId,
        tokenFId,
        amount,
        amountF,
        exchangeId,
        sender,
        receiver,
        label,
        nonce,
        memo
    );
    const encodedTransfer = getEncodedTransfer(signedTransfer);
    const message = `Sign this message to authorize Loopring Pay: ${encodedTransfer}`;
    const ecdsaSignature = await web3.eth.personal.sign(message, address);
    const signerAddress = await web3.eth.personal.ecRecover(
        message,
        ecdsaSignature
    );
    if (signerAddress.toLowerCase() !== address.toLowerCase()) {
        throw new Error(
            "signer's and recovered account's address do not match"
        );
    }
    return { ecdsaSignature, signedTransfer };
};

exports.setMaximumTokenApproval = (
    web3Instance,
    ethereumAccount,
    tokenAddress,
    exchangeAddress,
    gasPrice
) =>
    new web3Instance.eth.Contract(erc20Abi, tokenAddress).methods
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

exports.getOnchainTokenAllowance = async (
    web3Instance,
    ethereumAccount,
    tokenAddress,
    exchangeAddress
) =>
    new web3Instance.eth.Contract(erc20Abi, tokenAddress).methods
        .allowance(ethereumAccount, exchangeAddress)
        .call();

exports.deposit = (
    web3Instance,
    ethereumAccount,
    token,
    weiAmount,
    exchangeAddress,
    gasPrice
) =>
    new web3Instance.eth.Contract(exchangeAbi, exchangeAddress).methods
        .deposit(
            token.symbol === "ETH"
                ? "0x0000000000000000000000000000000000000000"
                : token.address,
            weiAmount
        )
        .send({
            from: ethereumAccount,
            gas: 500000,
            value: token.symbol === "ETH" ? weiAmount : 0,
            gasPrice,
        });

exports.withdraw = (
    web3Instance,
    ethereumAccount,
    token,
    weiAmount,
    feeWeiAmount,
    exchangeAddress,
    gasPrice
) =>
    new web3Instance.eth.Contract(exchangeAbi, exchangeAddress).methods
        .withdraw(
            token.symbol === "ETH"
                ? "0x0000000000000000000000000000000000000000"
                : token.address,
            weiAmount
        )
        .send({
            from: ethereumAccount,
            gas: 200000,
            gasPrice,
            value: feeWeiAmount,
        });

exports.createAccount = (
    web3Instance,
    ethereumAccount,
    publicKeyX,
    publicKeyY,
    permission,
    exchangeAddress,
    gasPrice
) =>
    new web3Instance.eth.Contract(exchangeAbi, exchangeAddress).methods
        .createOrUpdateAccount(
            publicKeyX,
            publicKeyY,
            web3Instance.utils.asciiToHex(permission)
        )
        .send({
            from: ethereumAccount,
            gas: 500000,
            gasPrice,
        });
