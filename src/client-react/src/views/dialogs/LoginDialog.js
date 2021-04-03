import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { blueGrey, orange } from '@material-ui/core/colors';
import { Divider, Button, IconButton, Dialog, DialogActions, DialogTitle, DialogContent } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import LockIcon from '@material-ui/icons/Lock';
import TextBox from '../../components/TextBox'
import state from '../../state'

const useStyles = makeStyles((theme) => ({
    content: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
}));

export default function LoginDialog(props) {
    const classes = useStyles();
    const [visible, setVisible] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoogedIn] = useState(false);
    const title = !isLoggedIn ? 'Login' : 'Logout';

    const onUsernameChange = (value) => {
        setUsername(value);
    }

    const onPasswordChange = (value) => {
        setPassword(value);
    }

    const handleOpen = () => {
        setVisible(true);
    }

    const handleClose = () => {
        setVisible(false);
    }

    const handleSubmit = () => {
        if(isLoggedIn) {
            if(props.onLogout) {
                props.onLogout();
            }
        } else {
            if(props.onLogin) {
                props.onLogin({
                    username,
                    password
                });
            }
        }

        handleClose();
    }

    const body = !isLoggedIn 
    ?   (<React.Fragment>
            <TextBox icon={<AccountCircleIcon />} label="Username" onTextBoxChange={onUsernameChange} />
            <TextBox icon={<LockIcon />} label="Password" type="password" onTextBoxChange={onPasswordChange} />
        </React.Fragment>) 
    : 'Are you sure you want to logout?';

    useEffect(() => {
        const sub = state.user.value.subscribe(x => {
            setIsLoogedIn(x != null)
        });
        
        return () => sub.unsubscribe();
    }, []);

    return (
        <React.Fragment>
            <IconButton className={props.className} onClick={handleOpen}>
                <AccountCircleIcon style={{ color: isLoggedIn ? orange[400] : blueGrey[50] }} />
            </IconButton>
            <Dialog open={visible}
                    onClose={handleClose}>
                <DialogTitle className={classes.title}>{title}</DialogTitle>
                <Divider />
                <DialogContent className={classes.content}>
                    {body}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary" autoFocus>
                        {title}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}
