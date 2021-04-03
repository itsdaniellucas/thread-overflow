import axios from 'axios'
import actions from '../actions'
import state from '../state'
import appConfig from '../appConfig'

let baseUrl = appConfig.baseUrl;
let isCORS = appConfig.isCORS;

function handleSimple() {
    return (res) => {
        return res.data.Data;
    }
}

function handle({ successMsg, errorMsg, alert }) {
    return (res) => {
        let data = res.data;
        if(data.IsSuccessful) {
            if(alert) {
                actions.alert.success(successMsg);
            }
        } else if(!data.IsSuccessful && data.Error) {
            if(alert) {
                actions.alert.error(data.Error);
            }

            let statusCode = data.StatusCode;
            if(data.Error) {
                statusCode = 200;
            }

            return Promise.reject({ response: { status: statusCode, failed: true } });
        } else {
            if(alert) {
                actions.alert.error(errorMsg);
            }
        }

        return data.Data;
    }
}

function handleError() {
    return (err) => {
        let res = err.response || {};
        let statusCode = res.status || -1;
        let failed = res.failed || true;

        if(statusCode) {
            if(statusCode == 200) {
                if(failed) {
                    throw `Error occured ${statusCode}`;
                }
                return statusCode;
            } else {
                if(appConfig.errorCodes.includes(statusCode)) {
                    window.location.replace(`/error/${statusCode}`);
                } else {
                    window.location.replace(`/error/500`);
                }
                throw `Error occured ${statusCode}`;
            }
        }

        return statusCode;
    }
}

function get({ url, params = {}, config = {}, successMsg, errorMsg, alert = false }) {
    let fullUrl = baseUrl + url;

    if(isCORS) {
        config.headers = Object.assign(config.headers || {}, {
            'Access-Control-Allow-Origin': '*'
        });
    }

    let newConfig = Object.assign(config, { params });

    state.isFetching.next(true);
    return axios.get(fullUrl, newConfig)
                .then(handle({ successMsg, errorMsg, alert }))
                .catch(handleError())
                .finally(() => {
                    state.isFetching.next(false);
                });
}

function getSimple(url) {
    let config = {};
    let fullUrl = baseUrl + url;

    if(isCORS) {
        config.headers = Object.assign(config.headers || {}, {
            'Access-Control-Allow-Origin': '*'
        });
    }

    state.isFetching.next(true);
    return axios.get(fullUrl, config)
                .then(handleSimple())
                .catch(handleError())
                .finally(() => {
                    state.isFetching.next(false);
                });
}

function post({ url, data = {}, config = {}, successMsg, errorMsg, loadingMsg, alert = true }) {
    let fullUrl = baseUrl + url;

    if(isCORS) {
        config.headers = Object.assign(config.headers || {}, {
            'Access-Control-Allow-Origin': '*'
        });
    }

    actions.alert.saving(loadingMsg || '');
    return axios.post(fullUrl, data, config)
                .then(handle({ successMsg, errorMsg, alert }))
                .catch(handleError());
}

const ajaxService = {
    handleSimple: handleSimple,
    handle: handle,
    handleError: handleError,
    get: get,
    getSimple: getSimple,
    post: post,
};


export default ajaxService