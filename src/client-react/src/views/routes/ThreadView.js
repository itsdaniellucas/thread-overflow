import React, { useCallback, useState, useEffect } from 'react'
import { Grid } from '@material-ui/core'
import { Pagination } from '@material-ui/lab';
import ThreadMessage from '../../components/ThreadMessage'
import Thread from '../../components/Thread'
import { thread as threadConstants, defaultPagination } from '../../constants'
import state from '../../state'
import actions from '../../actions';
import { useHistory } from 'react-router-dom'

export default function ThreadView(props) {
    const [pagination, setPagination] = useState(state.threads.value.pagination[props.threadId] || { ...defaultPagination });
    const history = useHistory();
    
    useEffect(() => {
        const sub = state.threads.subscribe(x => {
            setPagination(state.threads.value.pagination[props.threadId] || { ...defaultPagination });
        });

        return () => sub.unsubscribe();
    }, []);

    const onThreadClick = useCallback((thread) => {
        if(props.onThreadClick) {
            props.onThreadClick(thread.threadId);
        }
    }, []);

    const onUpvoteThread = useCallback((thread) => {
        actions.thread.upvoteThread(thread.threadId);
    }, [])

    const onDownvoteThread = useCallback((thread) => {
        actions.thread.downvoteThread(thread.threadId);
    }, [])

    const onUpvoteMessage = useCallback((message) => {
        actions.thread.upvoteMessage(message.threadId, message.messageId);
    }, []);

    const onDownvoteMessage = useCallback((message) => {
        actions.thread.downvoteMessage(message.threadId, message.messageId);
    }, []);

    const onDeleteThread = useCallback((thread) => {
        actions.thread.removeThread(thread.threadId);
    }, []);

    const onDeleteMessage = useCallback((message) => {
        actions.thread.removeMessage(message.threadId, message.messageId);
    }, []);

    const onSaveMessage = useCallback((data) => {
        actions.thread.modifyMessage(data.item.threadId, data.item.messageId, data.item.content);
    }, []);

    const onPageChange = useCallback((event, newPage) => {
        history.push(`/threads/${props.threadId}?page=${newPage}`);
        /*let paginations = { ...state.threads.value.pagination }
        paginations[props.threadId].page = newPage;

        state.threads.next({
            ...state.threads.value,
            pagination: paginations
        })

        let threadId = props.threadId;
        
        if(threadId == threadConstants.all) {
            actions.thread.fetchAll();
        } else if(threadId == threadConstants.self) {
            actions.thread.fetchSelf();
        } else if(state.threads.value.active.has(threadId)) {
            actions.thread.fetch(threadId);
        }*/
    }, [])


    return (
        <React.Fragment>
            <Grid item><Pagination count={pagination.totalPages} page={pagination.page} onChange={onPageChange} /></Grid>
            { 
                props.items ? 
                (
                    props.threadId == threadConstants.self || props.threadId == threadConstants.all ?
                    props.items.map((y) => 
                        <Grid item key={y.threadId}>
                            <Thread disabled={props.user == null} user={props.user} thread={y} onDelete={onDeleteThread} onThreadClick={onThreadClick} onUpvote={onUpvoteThread} onDownvote={onDownvoteThread} />
                        </Grid>) :
                    props.items.map((y) => 
                        <Grid item key={y.messageId}>
                            <ThreadMessage disabled={props.user == null} user={props.user} message={y} onDelete={onDeleteMessage} onUpvote={onUpvoteMessage} onDownvote={onDownvoteMessage} onSave={onSaveMessage} />
                        </Grid>)
                ) : 
                null 
            }
            <Grid item><Pagination count={pagination.totalPages} page={pagination.page} onChange={onPageChange} /></Grid>
        </React.Fragment>
    )
}