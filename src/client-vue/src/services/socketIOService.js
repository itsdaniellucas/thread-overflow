import Vue from 'vue'
import io from 'socket.io-client'
import appConfig from '@/appConfig'
import actions from '@/actions'
import state from '@/state'
import LoginService from '@/services/loginService'
import { thread as threadConstants } from '@/constants'

const socketIOService = new Vue({
    data: () => ({
        socket: io(appConfig.rootUrl)
    }),

    methods: {
        notifyThreadChanges(threadId) {
            this.socket.emit('SendThreadChanges', threadId);
        },

        onNotifiedThreadChanges(threadId) {
            if(threadId == threadConstants.all) {
                actions.threads.fetchAll();
            } else if(threadId == threadConstants.self && LoginService.isLoggedIn()) {
                actions.threads.fetchSelf();
            } else if(state.threads.active.has(threadId)) {
                actions.threads.fetch(threadId);
            }
        },

        initialize() {
            this.socket.on('ReceiveThreadChanges', this.onNotifiedThreadChanges);
        }
    }
})

export default socketIOService;