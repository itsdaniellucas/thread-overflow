import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Card, CardHeader, CardContent, CardActionArea, IconButton, Typography, Box, Tooltip, Grid, Chip, Menu, MenuItem } from '@material-ui/core'
import { orange, green, red, blueGrey } from '@material-ui/core/colors';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MoreVertIcon from '@material-ui/icons/MoreVert'
import DeleteIcon from '@material-ui/icons/Delete'
import utility from '../utility'

const useStyles = makeStyles((theme) => ({
    root: {
      minWidth: 900,
      maxWidth: 900,
      background: blueGrey[900],
      color: blueGrey[50],
    },
    header: {
        color: blueGrey[50],
        paddingBottom: theme.spacing(0),
    },
    body: {
        color: blueGrey[50],
    },
    subHeader: {
        color: blueGrey[300],
    },
    avatar: {
      backgroundColor: orange[800],
    },
  }));

export default function Thread(props) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = useState(null);

    const currentUser = props.user ? props.user.username : '';

    const title = props.thread ? props.thread.title : 'Thread Title';
    const username = props.thread ? props.thread.author : 'test_username';
    const content = props.thread ? props.thread.content : `This impressive paella is a perfect party dish and a fun meal to cook together with your
    guests. Add 1 cup of frozen peas along with the mussels, if you like.`;
    const date = props.thread ? new Date(props.thread.dateCreated) : new Date('2020-12-15 3:13:20 AM')
    const timeAgo = utility.timeAgo(date);
    const upvotes = props.thread ? props.thread.votes : 3;
    const voteStatus = props.thread ? props.thread.userVoted : null;

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

    if(props.disabled) {
        voteUpColor = blueGrey[600];
        voteDownColor = blueGrey[600];
        menuButtonColor = blueGrey[600];
    }

    const onThreadClick = () => {
        if(props.onThreadClick) {
            props.onThreadClick(props.thread);
        }
    }

    const onUpvote = (event) => {
        event.stopPropagation();
        if(props.onUpvote) {
            props.onUpvote(props.thread);
        }
    }

    const onDownvote = (event) => {
        event.stopPropagation();
        if(props.onDownvote) {
            props.onDownvote(props.thread);
        }
    }

    const onMenuClick = (event) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    }

    const onMenuClose = (event) => {
        if(event) {
            event.stopPropagation();
        }
        setAnchorEl(null);
    }


    const onDeleteClick = (event) => {
        event.stopPropagation();
        if(props.onDelete) {
            props.onDelete(props.thread);
        }
        onMenuClose();
    }

    return (
        <Card className={classes.root}>
            <CardActionArea onClick={onThreadClick}>
                <CardHeader
                    className={classes.header}
                    title={
                        <Grid container>
                            <Grid item>
                                { upvotes >= 50 ? <Chip label="Hot" size="small" style={{ background: red[400], marginRight: '5px', }} /> : null }
                                { timeAgo.includes('second') ? <Chip label="New" size="small" style={{ background: green[400], marginRight: '5px', }} /> : null }
                            </Grid>
                            <Grid item>{title}</Grid>
                        </Grid>
                    }
                    subheader={
                        <Grid item xs={4}>
                            <Tooltip title={date.toUTCString()} placement="right">
                                <Typography variant="subtitle2" className={classes.subHeader}>{`by @${username} - ${timeAgo} ago`}</Typography>
                            </Tooltip>
                        </Grid>
                    }
                    action={
                        <Grid container justify="center" alignItems="center" direction="row">
                            <Grid item>
                                <IconButton style={{ color: voteDownColor }} onClick={onDownvote} disabled={props.disabled}>
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
                                <IconButton style={{ color: voteUpColor }} onClick={onUpvote} disabled={props.disabled}>
                                    <ArrowUpwardIcon />
                                </IconButton>
                            </Grid>
                            <Grid item>
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
                                    <MenuItem style={{ color: blueGrey[900] }} onClick={onDeleteClick}><DeleteIcon /> Delete</MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    }
                />
                <CardContent className={classes.body}>
                    <Typography variant="body2" component="p">
                        {content}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}