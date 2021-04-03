import Vue from 'vue'
import state from '@/state'
import ThreadService from '@/services/threadService'
import SocketIOService from '@/services/socketIOService'
import { thread as threadConstants, defaultPagination } from '@/constants'

const actions = new Vue({
    data: () => ({
        threads: threadActions(),
        alert: alertActions(),
        user: userActions(),
    })
})


function threadActions() {
    return new Vue({
        methods: {
            fetch(threadId, skipAssign = false) {
                let pagination = state.threads.pagination[threadId];

                if(!pagination) {
                    pagination = { ...defaultPagination };
                    pagination.page = 1;
                }

                if(skipAssign) {
                    return ThreadService.getThreadMessages({ threadId: threadId, ...pagination });
                }

                return ThreadService.getThreadMessages({ threadId: threadId, ...pagination }).then(data => {
                    state.threads.messages[threadId] = [...data.messages];
                    let pagination = state.threads.pagination[threadId];
                    if(!pagination) {
                        pagination = { ...defaultPagination }
                        pagination.page = 1;
                    }
                    pagination.totalPages = data.totalPages;
                    state.threads.pagination[threadId] = pagination;
                    state.threads.active.add(threadId);
                    state.threads.titles[threadId] = data.title;
                    state.$emit('messages-changed');
                    return Promise.resolve();
                });
            },

            fetchAll() {
                let pagination = state.threads.pagination[threadConstants.all];
                return ThreadService.getAllThreads(pagination).then(data => {
                    state.threads.messages[threadConstants.all] = [...data.threads];
                    state.threads.pagination[threadConstants.all].totalPages = data.totalPages;
                    state.$emit('messages-changed');
                });
            },

            fetchSelf() {
                let pagination = state.threads.pagination[threadConstants.self];
                return ThreadService.getSelfThreads(pagination).then(data => {
                    state.threads.messages[threadConstants.self] = [...data.threads];
                    state.threads.pagination[threadConstants.self].totalPages = data.totalPages;
                    state.$emit('messages-changed');
                });
            },

            addThread(thread) {
                return ThreadService.addThread(thread).then(() => {
                    SocketIOService.notifyThreadChanges(threadConstants.all);
                    SocketIOService.notifyThreadChanges(threadConstants.self);
                })
            },

            removeThread(threadId) {
                return ThreadService.removeThread({ threadId: threadId }).then(() => {
                    SocketIOService.notifyThreadChanges(threadConstants.all);
                    SocketIOService.notifyThreadChanges(threadConstants.self);
                })
            },

            addMessage(threadId, message) {
                return ThreadService.addMessage({ threadId: threadId, message: message}).then(() => {
                    SocketIOService.notifyThreadChanges(threadId);
                })
            },

            modifyMessage(threadId, messageId, message) {
                return ThreadService.modifyMessage({ threadId: threadId, messageId: messageId, message: message}).then(() => {
                    SocketIOService.notifyThreadChanges(threadId);
                })
            },

            removeMessage(threadId, messageId) {
                return ThreadService.removeMessage({ threadId: threadId, messageId: messageId}).then(() => {
                    SocketIOService.notifyThreadChanges(threadId);
                });
            },

            upvoteThread(threadId) {
                return ThreadService.upvoteThread({ threadId: threadId }).then(() => {
                    let target = state.threads.messages[state.threads.current].find(i => i.threadId == threadId);
                    if(target) {
                        if(target.userVoted === true) {
                            target.votes -= 1;
                            target.userVoted = null;
                        } else {
                            if(target.userVoted === false) {
                                target.votes += 2;
                            } else if(target.userVoted === null) {
                                target.votes += 1;
                            }
                            target.userVoted = true;
                        }
                    }
                });
            },

            downvoteThread(threadId) {
                return ThreadService.downvoteThread({ threadId: threadId }).then(() => {
                    let target = state.threads.messages[state.threads.current].find(i => i.threadId == threadId);
                    if(target) {
                        if(target.userVoted === false) {
                            target.votes += 1;
                            target.userVoted = null;
                        } else {
                            if(target.userVoted === true) {
                                target.votes -= 2;
                            } else if(target.userVoted === null) {
                                target.votes -= 1;
                            }
                            target.userVoted = false;
                        }
                    }
                });
            },

            upvoteMessage(threadId, messageId) {
                return ThreadService.upvoteMessage({ threadId: threadId, messageId: messageId }).then(() => {
                    let target = state.threads.messages[threadId].find(i => i.messageId == messageId);
                    if(target) {
                        if(target.userVoted === true) {
                            target.votes -= 1;
                            target.userVoted = null;
                        } else {
                            if(target.userVoted === false) {
                                target.votes += 2;
                            } else if(target.userVoted === null) {
                                target.votes += 1;
                            }
                            target.userVoted = true;
                        }
                    }
                });
            },

            downvoteMessage(threadId, messageId) {
                return ThreadService.downvoteMessage({ threadId: threadId, messageId: messageId }).then(() => {
                    let target = state.threads.messages[threadId].find(i => i.messageId == messageId);
                    if(target) {
                        if(target.userVoted === false) {
                            target.votes += 1;
                            target.userVoted = null;
                        } else {
                            if(target.userVoted === true) {
                                target.votes -= 2;
                            } else if(target.userVoted === null) {
                                target.votes -= 1;
                            }
                            target.userVoted = false;
                        }
                    }
                });
            }
        }
    });
}

function alertActions() {
    return new Vue({
        methods: {
            saving(text = '', autoFade = false) {
                if(state.alert.timeoutFn) {
                    clearTimeout(state.alert.timeoutFn);
                }

                state.alert.type = 'saving';
                state.alert.visible = true;
                state.alert.isProgress = true;
                state.alert.icon = '';
                state.alert.text = text || 'Saving changes made...';
                state.alert.isWhiteText = true;
                state.alert.color = 'info';

                if(autoFade) {
                    state.alert.timeoutFn = setTimeout(() => {
                        state.alert.visible = false;
                    }, state.alert.timeout);
                }
            },
            
            success(text = '', autoFade = true) {
                if(state.alert.timeoutFn) {
                    clearTimeout(state.alert.timeoutFn);
                }

                state.alert.type = 'success';
                state.alert.visible = true;
                state.alert.isProgress = false;
                state.alert.icon = 'mdi-check-circle-outline';
                state.alert.text = text || 'Changes have been saved!';
                state.alert.isWhiteText = true;
                state.alert.color ='success';

                if(autoFade) {
                    state.alert.timeoutFn = setTimeout(() => {
                        state.alert.visible = false;
                    }, state.alert.timeout);
                }
            },

            error(text = '', autoFade = true) {
                if(state.alert.timeoutFn) {
                    clearTimeout(state.alert.timeoutFn);
                }

                state.alert.type = 'error';
                state.alert.visible = true;
                state.alert.isProgress = false;
                state.alert.icon = 'mdi-alert-circle-outline';
                state.alert.text = text || 'An error occured while saving!';
                state.alert.isWhiteText = true;
                state.alert.color ='error';

                if(autoFade) {
                    state.alert.timeoutFn = setTimeout(() => {
                        state.alert.visible = false;
                    }, state.alert.timeout);
                }
            }
        }
    });
}

function userActions() {
    return new Vue({
        computed: {
            isLoggedIn() {
                return state.user != null;
            }
        },
        methods: {
            setUser(user) {
                state.user = user ? {...user} : null;
            }
        }
    });
}

export default actions