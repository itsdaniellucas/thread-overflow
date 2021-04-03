import { BehaviorSubject } from 'rxjs'
import { thread as threadConstants, defaultPagination } from './constants'

const state = {
    threads: new BehaviorSubject({
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
            [threadConstants.all]: [],
            [threadConstants.self]: [],
        },
        pagination: {
            [threadConstants.all]: { ...defaultPagination },
            [threadConstants.self]: { ...defaultPagination },
        }
    }),
    user: {
        value: new BehaviorSubject(null),
    },
    alert: {
        config: new BehaviorSubject({
            visible: false,
            isProgress: true,
            text: 'Saving changes made...',
            severity: 'info',
            timeout: 5000,
            timeoutFn: null,
            type: 'saving',
        })
    },
    isFetching: new BehaviorSubject(false),
}

export default state
