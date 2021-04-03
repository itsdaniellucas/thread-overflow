import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActions, Avatar, IconButton, Typography, Box, Tooltip, Grid, Menu, MenuItem } from '@material-ui/core'
import { orange, green, red, blueGrey } from '@material-ui/core/colors'
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward'
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import utility from '../utility'
import ThreadDialog from '../views/dialogs/ThreadDialog'
import { thread as threadConstants } from '../constants'

const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 900,
      maxWidth: 900,
      background: blueGrey[900],
      color: blueGrey[50],
    },
    body: {
        color: blueGrey[50],
        paddingBottom: theme.spacing(0),
    },
    subHeader: {
        color: blueGrey[300],
    },
    avatar: {
      backgroundColor: orange[600],
      color: blueGrey[900],
    },
    deleted: {
        marginLeft: theme.spacing(2),
        paddingBottom: theme.spacing(1),
    }
  }));

export default function ThreadMessage(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);

    const currentUser = props.user ? props.user.username : '';
    
    const username = props.message ? props.message.author : 'test_username';
    const content = props.message ? props.message.content: `This impressive paella is a perfect party dish and a fun meal to cook together with your
    guests. Add 1 cup of frozen peas along with the mussels, if you like.`;
    const date = props.message ? new Date(props.message.dateCreated) : new Date('2020-12-14')
    const timeAgo = utility.timeAgo(date);
    const upvotes = props.message ? props.message.votes : 2;
    const voteStatus = props.message ? props.message.userVoted : null;
    const isDeleted = props.message ? props.message.isDeleted : false;

    let voteUpColor = blueGrey[50];
    let voteDownColor = blueGrey[50];
    let menuButtonColor = blueGrey[50];

    if(voteStatus === true) {
        voteUpColor = orange[600];
    } else if(voteStatus === false) {
        voteDownColor = orange[600];
    }

    let voteColor = blueGrey[50];
    if(upvotes > 0) {
        voteColor = green[600];
    } else if(upvotes < 0) {
        voteColor = red[600];
    }

    if(props.disabled || isDeleted) {
        voteUpColor = blueGrey[600];
        voteDownColor = blueGrey[600];
        menuButtonColor = blueGrey[600];
    }

    const onSave = (data) => {
        if(props.onSave) {
            props.onSave(data);
        }
        onMenuClose();
    }

    const onUpvote = () => {
        if(props.onUpvote) {
            props.onUpvote(props.message);
        }
    }

    const onDownvote = () => {
        if(props.onDownvote) {
            props.onDownvote(props.message);
        }
    }

    const onMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    }

    const onMenuClose = (event) => {
        if(event) {
            event.stopPropagation();
        }
        setAnchorEl(null);
    }

    const onDeleteClick = () => {
        if(props.onDelete) {
            props.onDelete(props.message);
        }
        onMenuClose();
    }

    return (
        <Card className={classes.root}>
            {
                !isDeleted ?
                <CardHeader
                    className={classes.body}
                    avatar={
                        <Avatar aria-label="recipe" className={classes.avatar}>
                            {username.charAt(0).toUpperCase()}
                        </Avatar>
                    }
                    title={`@${username}`}
                    subheader={
                        <Grid item xs={2}>
                            <Tooltip title={date.toUTCString()} placement="right">
                                <Typography variant="subtitle2" className={classes.subHeader}>{`${timeAgo} ago`}</Typography>
                            </Tooltip>
                        </Grid>
                    }
                    action={
                        <React.Fragment>
                            {
                                currentUser == username ?
                                <IconButton style={{ color: menuButtonColor }} onClick={onMenuClick} disabled={props.disabled}>
                                    <MoreVertIcon />
                                </IconButton> :
                                null
                            }
                            <Menu anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={onMenuClose}>
                                <ThreadDialog isEdit={true} mode={threadConstants.message} thread={props.message} onSave={onSave} />
                                <MenuItem style={{ color: blueGrey[900] }} onClick={onDeleteClick}><DeleteIcon /> Delete</MenuItem>
                            </Menu>
                        </React.Fragment>
                    }
                /> :
                null
            }

            {
                !isDeleted ?
                <CardContent className={classes.body}>
                    <Typography variant="body2" component="p">
                        {content}
                    </Typography>
                </CardContent> :
                null
            }
            
            <CardActions disableSpacing className={classes.body}>
                {
                    isDeleted ?
                    <Grid container item>
                        <Typography variant="body2" component="p" className={classes.deleted}>
                            {content}
                        </Typography>
                    </Grid> :
                    null
                }
                <Grid container justify="flex-end" alignItems="center">
                    <Grid item>
                        <IconButton style={{ color: voteDownColor }} onClick={onDownvote} disabled={props.disabled || isDeleted}>
                            <ArrowDownwardIcon />
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <Typography component="div" style={{ color: voteColor }}>
                            <Box fontWeight="fontWeightBold">
                                {upvotes}
                            </Box>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <IconButton style={{ color: voteUpColor }} onClick={onUpvote} disabled={props.disabled || isDeleted}>
                            <ArrowUpwardIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    )
}