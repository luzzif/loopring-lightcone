const fetch = require("node-fetch").default;
const { isNullOrUndefined } = require("util");
const { API_HOST } = require("../constants");

let testMode = false;
exports.testMode = testMode;

exports.enableTestMode = () => {
    testMode = true;
};

exports.disableTestMode = () => {
    testMode = false;
};

exports.isTestMode = () => testMode;

exports.request = async (method, path, parameters, headers, body) => {
    const queryString =
        parameters &&
        Object.entries(parameters)
            // cannot use compact version to filter, otherwise valid
            // values such as zero would be removed, causing bad requests
            .filter(
                ([key, value]) =>
                    !isNullOrUndefined(key) && !isNullOrUndefined(value)
            )
            .map(([key, value]) => `${key}=${value}`)
            .join("&");
    const response = await fetch(
        `${testMode ? API_HOST.TEST : API_HOST.PROD}/${path}${
            queryString ? `?${queryString}` : ""
        }`,
        { method, headers, body: JSON.stringify(body) }
    );
    const json = await response.json();
    const { resultInfo, errorData, data } = json;
    // const { resultInfo, errorData } = data;
    if (resultInfo) {
        const { code, message } = resultInfo;
        if (code !== 0) {
            throw Error(message);
        }
        return data;
    } else if (errorData) {
        const { code, message } = errorData;
        if (code !== 0) {
            throw Error(`${code} ${message}`);
        }
        return data;
    }
    return data;
};
