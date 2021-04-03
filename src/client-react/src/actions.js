import state from './state'
import threadService from './services/threadService'
import socketIOService from './services/socketIOService'
import { thread as threadConstants, defaultPagination } from './constants'

const threadActions = {
    fetch: (threadId, skipAssign = false) => {
        let pagination = { ...state.threads.value.pagination };
        let threadPagination = pagination[threadId];

        if(skipAssign) {
            return threadService.getThreadMessages({ threadId: threadId, ...threadPagination })
        }

        return threadService.getThreadMessages({ threadId: threadId, ...threadPagination }).then(data => {
            let messages = { ...state.threads.value.messages };
            messages[threadId] = data.messages;

            let pagination = { ...state.threads.value.pagination };
            pagination[threadId].totalPages = data.totalPages;

            state.threads.next({ ...state.threads.value, messages: messages, pagination: pagination });
        });
    },
    fetchAll: () => {
        // go to first page, descending order
        let pagination = { ...state.threads.value.pagination };
        let allPagination = pagination[threadConstants.all];
        return threadService.getAllThreads(allPagination).then(data => {
            let threads = { ...state.threads.value.messages };
            threads[threadConstants.all] = data.threads;

            let pagination = { ...state.threads.value.pagination };
            pagination[threadConstants.all].totalPages = data.totalPages;

            state.threads.next({ ...state.threads.value, messages: threads, pagination: pagination });
        })
    },
    fetchSelf: () => {
        // go to first page, descending order
        let pagination = { ...state.threads.value.pagination };
        let selfPagination = pagination[threadConstants.self];
        return threadService.getSelfThreads(selfPagination).then(data => {
            let threads = { ...state.threads.value.messages };
            threads[threadConstants.self] = data.threads;

            let pagination = { ...state.threads.value.pagination };
            pagination[threadConstants.all].totalPages = data.totalPages;

            state.threads.next({ ...state.threads.value, messages: threads, pagination: pagination });
        })
    },
    addThread: (thread) => {
        return threadService.addThread(thread).then(() => {
            socketIOService.notifyThreadChanges(threadConstants.all);
            socketIOService.notifyThreadChanges(threadConstants.self);
        })
    },
    removeThread: (threadId) => {
        return threadService.removeThread({ threadId: threadId }).then(() => {
            socketIOService.notifyThreadChanges(threadConstants.all);
            socketIOService.notifyThreadChanges(threadConstants.self);
        })
    },
    addMessage: (threadId, message) => {
        return threadService.addMessage({ threadId: threadId, message: message}).then(() => {
            socketIOService.notifyThreadChanges(threadId);
        });
    },
    modifyMessage: (threadId, messageId, message) => {
        return threadService.modifyMessage({ threadId: threadId, messageId: messageId, message: message}).then(() => {
            socketIOService.notifyThreadChanges(threadId);
        });
    },
    removeMessage: (threadId, messageId) => {
        return threadService.removeMessage({ threadId: threadId, messageId: messageId}).then(() => {
            socketIOService.notifyThreadChanges(threadId);
        });
    },
    upvoteThread: (threadId) => {
        return threadService.upvoteThread({ threadId: threadId }).then(() => {
            let { messages: threads, current } = { ...state.threads.value };
            let target = threads[current].find(i => i.threadId == threadId);
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
                state.threads.next({ ...state.threads.value, messages: threads });
            }
        });
    },
    downvoteThread: (threadId) => {
        return threadService.downvoteThread({ threadId: threadId }).then(() => {
            let { messages: threads, current } = { ...state.threads.value };
            let target = threads[current].find(i => i.threadId == threadId);
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
                state.threads.next({ ...state.threads.value, messages: threads });
            }
        });
    },
    upvoteMessage: (threadId, messageId) => {
        return threadService.upvoteMessage({ threadId: threadId, messageId: messageId }).then(() => {
            let messages = { ...state.threads.value.messages };
            let target = messages[threadId].find(i => i.messageId == messageId);
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
                state.threads.next({ ...state.threads.value, messages: messages });
            }
        });
    },
    downvoteMessage: (threadId, messageId) => {
        return threadService.downvoteMessage({ threadId: threadId, messageId: messageId }).then(() => {
            let messages = { ...state.threads.value.messages };
            let target = messages[threadId].find(i => i.messageId == messageId);
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
                state.threads.next({ ...state.threads.value, messages: messages });
            }
        });
    }
}

const alertActions = {
    saving: (text = '', autoFade = false) => {
        const currentConfig = state.alert.config.value;

        if(currentConfig.timeoutFn) {
            clearTimeout(currentConfig.timeoutFn);
        }

        const newConfig = {
            type: 'saving',
            visible: true,
            isProgress: true,
            text: text || 'Saving changes made...',
            severity: 'info',
            timeout: 5000,
        }

        if(autoFade) {
            newConfig.timeoutFn = setTimeout(() => {
                newConfig.visible = false;
                state.alert.config.next({ ...newConfig });
            }, newConfig.timeout);
        }

        state.alert.config.next(newConfig);
    },
    success: (text = '', autoFade = true) => {
        const currentConfig = state.alert.config.value;

        if(currentConfig.timeoutFn) {
            clearTimeout(currentConfig.timeoutFn);
        }

        const newConfig = {
            type: 'success',
            visible: true,
            isProgress: false,
            text: text || 'Changes have been saved!',
            severity: 'success',
            timeout: 5000,
        }

        if(autoFade) {
            newConfig.timeoutFn = setTimeout(() => {
                newConfig.visible = false;
                state.alert.config.next({ ...newConfig });
            }, newConfig.timeout);
        }

        state.alert.config.next(newConfig);
    },
    error: (text = '', autoFade = true) => {
        const currentConfig = state.alert.config.value;

        if(currentConfig.timeoutFn) {
            clearTimeout(currentConfig.timeoutFn);
        }

        const newConfig = {
            type: 'error',
            visible: true,
            isProgress: false,
            text: text || 'An error occured while saving!',
            severity: 'error',
            timeout: 5000,
        }

        if(autoFade) {
            newConfig.timeoutFn = setTimeout(() => {
                newConfig.visible = false;
                state.alert.config.next({ ...newConfig });
            }, newConfig.timeout);
        }

        state.alert.config.next(newConfig);
    },
}

const actions = {
    alert: alertActions,
    thread: threadActions,
}

export default actions