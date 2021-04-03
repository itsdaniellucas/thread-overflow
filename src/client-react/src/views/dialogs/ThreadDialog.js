import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Fab, Tooltip, Divider, Button, Dialog, DialogActions, DialogTitle, DialogContent, MenuItem } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit'
import FingerprintIcon from '@material-ui/icons/Fingerprint';
import DescriptionIcon from '@material-ui/icons/Description';
import TextBox from '../../components/TextBox'
import { orange, blueGrey } from '@material-ui/core/colors';
import state from '../../state'
import { thread as threadConstants } from '../../constants'

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
        color: theme.palette.common.white,
        backgroundColor: orange[600],
        '&:hover': {
          backgroundColor: orange[700],
        },
    },
}));

export default function ThreadDialog(props) {
    const classes = useStyles();
    const [title, setTitle] = useState(props.thread ? (props.isEdit ? state.threads.value.titles[props.thread.threadId] : props.thread.title)  : '');
    const [message, setMessage] = useState(props.thread ? props.thread.content : '');
    const [visible, setVisible] = useState(false);
    const operation = props.isEdit ? 'Edit' : 'Add';
    const dialogTitle = props.mode == threadConstants.thread ? `${operation} Thread` : `${operation} Message`;

    useEffect(() => {
        setTitle(props.thread ? (props.isEdit ? state.threads.value.titles[props.thread.threadId] : '')  : '');
        setMessage(props.thread ? props.thread.content : '');
    }, [props.thread]);

    const handleOpen = () => {
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
    }

    const onValueChange = (value, handler) => {
        handler(value);
    }

    const handleSave = () => {
        if(props.onSave) {
            props.onSave({
                mode: props.mode,
                item: {
                    ...props.thread,
                    title: title,
                    content: message,
                }
            })
        }

        handleClose();
    }

    return (
        <React.Fragment>
            <Tooltip title={dialogTitle} placement="left">
                <React.Fragment>
                    {
                        props.isEdit ?
                        <MenuItem style={{ color: blueGrey[900] }} onClick={handleOpen}>
                            <EditIcon />Edit
                        </MenuItem> :
                        <Fab className={classes.fab} onClick={handleOpen} disabled={props.disabled}>
                            <AddIcon />
                        </Fab>
                    }
                </React.Fragment>
            </Tooltip>
            <Dialog open={visible}
                    onClose={handleClose}
                    size="md"
                    fullWidth>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    <TextBox icon={<FingerprintIcon />} label="Task" width="53" value={title} onTextBoxChange={(v) => onValueChange(v, setTitle)} disabled={props.isEdit || props.mode == threadConstants.message} />
                    <TextBox icon={<DescriptionIcon />} label="Description" width="53" multiline rows={4} value={message} onTextBoxChange={(v) => onValueChange(v, setMessage)} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSave} color="primary" autoFocus>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )

}