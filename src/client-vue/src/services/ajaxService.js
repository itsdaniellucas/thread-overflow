import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import appConfig from '@/appConfig'
import state from '@/state'
import actions from '@/actions'

const ajaxService = new Vue({
    data: () => ({
        baseUrl: appConfig.baseUrl,
        isCORS: appConfig.isCORS,
    }),

    methods: {
        handleSimple() {
            return (res) => {
                return res.data.Data;
            }
        },

        handle({ successMsg, errorMsg, alert }) {
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
        },

        handleError() {
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
                            router.push(`/error/${statusCode}`).catch(_ => _);
                        } else {
                            router.push(`/error/500`).catch(_ => _);
                        }
                        throw `Error occured ${statusCode}`;
                    }
                }

                return statusCode;
            }
        },

        get({ url, params = {}, config = {}, successMsg, errorMsg, alert = false }) {
            let fullUrl = this.baseUrl + url;

            if(this.isCORS) {
                config.headers = Object.assign(config.headers || {}, {
                    'Access-Control-Allow-Origin': '*'
                });
            }

            let newConfig = Object.assign(config, { params });

            state.isFetching = true;
            return axios.get(fullUrl, newConfig)
                        .then(this.handle({ successMsg, errorMsg, alert }))
                        .catch(this.handleError())
                        .finally(() => {
                            state.isFetching = false;
                        });
        },

        getSimple(url) {
            let config = {};
            let fullUrl = this.baseUrl + url;

            if(this.isCORS) {
                config.headers = Object.assign(config.headers || {}, {
                    'Access-Control-Allow-Origin': '*'
                });
            }

            state.isFetching = true;
            return axios.get(fullUrl, config)
                        .then(this.handleSimple())
                        .catch(this.handleError())
                        .finally(() => {
                            state.isFetching = false;
                        });
        },

        post({ url, data = {}, config = {}, successMsg, errorMsg, loadingMsg, alert = true }) {
            let fullUrl = this.baseUrl + url;

            if(this.isCORS) {
                config.headers = Object.assign(config.headers || {}, {
                    'Access-Control-Allow-Origin': '*'
                });
            }

            actions.alert.saving(loadingMsg || '');
            return axios.post(fullUrl, data, config)
                        .then(this.handle({ successMsg, errorMsg, alert }))
                        .catch(this.handleError());
        }
    }
})

export default ajaxService