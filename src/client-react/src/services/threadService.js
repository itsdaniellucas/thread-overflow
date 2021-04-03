import ajaxService from './ajaxService'

const controller = 'Thread'

function addThread(model) {
    return ajaxService.post({
        url: `/${controller}/Add`,
        data: model,
    })
}

function removeThread(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Remove`,
    })
}

function getAllThreads(model) {
    return ajaxService.get({
        url: `/${controller}/All?Page=${model.page}&ItemsPerPage=${model.itemsPerPage}`,
    })
}

function getSelfThreads(model) {
    return ajaxService.get({
        url: `/${controller}/Self?Page=${model.page}&ItemsPerPage=${model.itemsPerPage}`,
    })
}

function getThreadMessages(model) {
    return ajaxService.get({
        url: `/${controller}/${model.threadId}/Messages?Page=${model.page}&ItemsPerPage=${model.itemsPerPage}`,
    })
}

function addMessage(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Messages/Add`,
        data: { message: model.message },
    })
}

function modifyMessage(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Messages/${model.messageId}/Modify`,
        data: { message: model.message },
    })
}

function removeMessage(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Messages/${model.messageId}/Remove`,
    })
}

function upvoteThread(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Upvote`,
    })
}

function downvoteThread(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Downvote`,
    })
}

function upvoteMessage(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Messages/${model.messageId}/Upvote`,
    })
}

function downvoteMessage(model) {
    return ajaxService.post({
        url: `/${controller}/${model.threadId}/Messages/${model.messageId}/Downvote`,
    })
}

const threadService = {
    addThread: addThread,
    removeThread: removeThread,
    addMessage: addMessage,
    modifyMessage: modifyMessage,
    removeMessage: removeMessage,
    getThreadMessages: getThreadMessages,
    getAllThreads: getAllThreads,
    getSelfThreads: getSelfThreads,
    upvoteThread: upvoteThread,
    downvoteThread: downvoteThread,
    upvoteMessage: upvoteMessage,
    downvoteMessage: downvoteMessage,
}

export default threadService