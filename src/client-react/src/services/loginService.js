import ajaxService from './ajaxService'
import storageService from './storageService'
import state from '../state'
import actions from '../actions'


const controller = 'Login'

function login(model) {
    return ajaxService.post({
        url: `/${controller}/Authenticate`,
        data: model,
        successMsg: 'You have successfully logged in.',
        errorMsg: 'Login failed.',
        loadingMsg: 'Logging in...'
    }).then((data) => {
        if(data) {
            if(data.Error) {
                actions.alert.error(data.Error);
            } else {
                storageService.setTokenExpiration(data.TokenExpiration);
                storageService.setToken(data.Token);
                storageService.setUser(data.User);
                state.user.value.next(data.User);
            }

            return data.User;
        } else {
            return data;
        }
    })
}

function logout(skipNotif = false) {
    storageService.setTokenExpiration();
    storageService.setToken();
    storageService.setUser();
    state.user.value.next(null);
    if(!skipNotif) {
        actions.alert.success('You have successfully logged out.');
    }
}

function getUser(skipFetch = false) {
    let user = storageService.getUser();

    if(user) {
        return Promise.resolve(user);
    } else if(!user && !skipFetch) {
        return ajaxService.getSimple(`/${controller}/GetUser`).then((data) => {
            storageService.setUser(data);
            return data;
        });
    }

    return Promise.resolve(null);
}

function isLoggedIn() {
    return !!storageService.getToken() && !!storageService.getTokenExpiration() && (new Date().getTime() < storageService.getTokenExpiration());
}

const loginService = {
    login: login,
    logout: logout,
    getUser: getUser,
    isLoggedIn: isLoggedIn,
}

export default loginService