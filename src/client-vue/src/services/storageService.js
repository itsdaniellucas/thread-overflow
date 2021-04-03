import Vue from 'vue'

const storageService = new Vue({
    data: () => ({
        keys: {
            token: 'token',
            userData: 'userData',
            expiration: 'expiration',
        }
    }),
    
    methods: {
        getLocalStorageItem(key, isParsed) {
            let result = window.localStorage.getItem(key);
            if(isParsed) {
                result = JSON.parse(result);
            }
            return result;
        },
        setLocalStorageItem(key, value, isStringified) {
            if(value) {
                if(isStringified) {
                    value = JSON.stringify(value);
                }
                window.localStorage.setItem(key, value);
            } else {
                window.localStorage.removeItem(key);
            }
        },
        getToken() {
            return this.getLocalStorageItem(this.keys.token);
        },
        getTokenExpiration() {
            return this.getLocalStorageItem(this.keys.expiration);
        },
        getUser() {
            return this.getLocalStorageItem(this.keys.userData, true);
        },
        setToken(token) {
            this.setLocalStorageItem(this.keys.token, token)
        },
        setTokenExpiration(expiration) {
            this.setLocalStorageItem(this.keys.expiration, expiration);
        },
        setUser(user) {
            this.setLocalStorageItem(this.keys.userData, user, true);
        }
    }   
})

export default storageService