import React, { useState, useEffect, useCallback } from 'react'
import { Grid } from '@material-ui/core'
import { useParams } from 'react-router-dom'
import TabPanel from '../../components/TabPanel'
import ThreadView from './ThreadView';
import state from '../../state'
import actions from '../../actions'
import ThreadDialog from '../dialogs/ThreadDialog'
import { thread as threadConstants } from '../../constants'

export default function ThreadLayout(props) {
    const { id } = useParams();

    const [thread, setThread] = useState({
        threadId: props.current,
        title: state.threads.value.titles[props.current],
    });

    useEffect(() => {
        setThread({
            threadId: props.current,
            title: state.threads.value.titles[props.current],
        })
    }, [props.current]);

    const onSaveThread = useCallback((data) => {
        if(data.mode === threadConstants.message) {
            actions.thread.addMessage(data.item.threadId, data.item.content);
        } else if(data.mode === threadConstants.thread) {
            actions.thread.addThread(data.item);
        }
    }, []);

    return (
        <React.Fragment>
            <TabPanel value={id} key={id} match={props.current}>
                <Grid container justify="center" alignItems="center" direction="column" spacing={2}>
                    <ThreadView items={props.messages[id]} threadId={id} user={props.user} onThreadClick={props.onThreadClick} />
                </Grid>
            </TabPanel>
            <ThreadDialog mode={props.mode} disabled={props.user == null} onSave={onSaveThread} thread={thread} />
        </React.Fragment>
        
    )
}