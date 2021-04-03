import io from 'socket.io-client'
import appConfig from '../appConfig'
import actions from '../actions'
import state from '../state'
import loginService from '../services/loginService'
import { thread as threadConstants } from '../constants'

const socket = io(appConfig.rootUrl);

function notifyThreadChanges(threadId) {
    socket.emit('SendThreadChanges', threadId);
}

function onNotifiedThreadChanges(threadId) {
    if(threadId == threadConstants.all) {
        actions.thread.fetchAll();
    } else if(threadId == threadConstants.self && loginService.isLoggedIn()) {
        actions.thread.fetchSelf();
    } else if(state.threads.value.active.has(threadId)) {
        actions.thread.fetch(threadId);
    }
}

function initialize() {
    socket.on('ReceiveThreadChanges', onNotifiedThreadChanges);
} 


const socketIOService = {
    notifyThreadChanges: notifyThreadChanges,
    initialize: initialize,
}

export default socketIOService