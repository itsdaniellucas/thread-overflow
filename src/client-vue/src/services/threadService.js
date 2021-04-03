import Vue from 'vue'
import AjaxService from '@/services/ajaxService'

const threadService = new Vue({
    data: () => ({
        controller: 'Thread'
    }),

    methods: {
        addThread(model) {
            return AjaxService.post({
                url: `/${this.controller}/Add`,
                data: model,
            })
        },
        
        removeThread(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Remove`,
            })
        },
        
        getAllThreads(model) {
            return AjaxService.get({
                url: `/${this.controller}/All?Page=${model.page}&ItemsPerPage=${model.itemsPerPage}`,
            })
        },
        
        getSelfThreads(model) {
            return AjaxService.get({
                url: `/${this.controller}/Self?Page=${model.page}&ItemsPerPage=${model.itemsPerPage}`,
            })
        },
        
        getThreadMessages(model) {
            return AjaxService.get({
                url: `/${this.controller}/${model.threadId}/Messages?Page=${model.page}&ItemsPerPage=${model.itemsPerPage}`,
            })
        },
        
        addMessage(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Messages/Add`,
                data: { message: model.message },
            })
        },
        
        modifyMessage(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Messages/${model.messageId}/Modify`,
                data: { message: model.message },
            })
        },
        
        removeMessage(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Messages/${model.messageId}/Remove`,
            })
        },
        
        upvoteThread(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Upvote`,
            })
        },
        
        downvoteThread(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Downvote`,
            })
        },
        
        upvoteMessage(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Messages/${model.messageId}/Upvote`,
            })
        },
        
        downvoteMessage(model) {
            return AjaxService.post({
                url: `/${this.controller}/${model.threadId}/Messages/${model.messageId}/Downvote`,
            })
        },
    }
})

export default threadService