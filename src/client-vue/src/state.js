import Vue from 'vue'
import { thread as threadConstants, defaultPagination } from './constants'

const state = new Vue({
    data: () => ({
        threads: {
            current: threadConstants.all,
            mode: threadConstants.thread,
            active: new Set([
                threadConstants.all,
                threadConstants.self,
            ]),
            titles: {
                [threadConstants.all]: 'All',
                [threadConstants.self]: 'Self',
            },
            messages: {
                [threadConstants.all]: [
                    { 
                        id: 1,
                        title: 'Thread Title',
                        author: 'test_admin',
                        content: 'Thread Description',
                        dateCreated: new Date('2021-01-08'),
                        votes: 6,
                        userVoted: true,
                    },
                ],
                [threadConstants.self]: [],
            },
            pagination: {
                [threadConstants.all]: { ...defaultPagination },
                [threadConstants.self]: { ...defaultPagination },
            }
        },
        alert: {
            visible: false,
            isProgress: true,
            icon: '',
            text: 'Saving changes made...',
            isWhiteText: true,
            color: 'info',
            timeout: 5000,
            timeoutFn: null,
            type: 'saving',
        },
        user: null,
        isFetching: false,
    }),
})


export default state