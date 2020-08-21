const { request } = require("../../../request");

exports.postWithdrawal = async (signedTransaction) =>
    request("POST", "api/v2/sendEthTx", { data: signedTransaction });
