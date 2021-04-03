import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Badge, IconButton } from '@material-ui/core'
import { orange } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((theme) => ({
    badge: {
      background: orange[800],
      color: orange[50],
    }
  }));

export default function TabLabel(props) {
    const classes = useStyles();

    const onCloseClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if(props.onClose) {
            props.onClose(props.value);
        }
    }

    const content = (
        <Grid container alignItems="center" justify="center">
            <Grid item>{props.title}</Grid>
            <Grid item>
                { props.isCloseable ? 
                    <IconButton style={{ color: orange[400], zIndex: 500 }} size="small" onClick={onCloseClick}>
                        <CloseIcon fontSize="inherit" />
                    </IconButton> : 
                    null
                }
            </Grid>
        </Grid>
    )

    return (
        <React.Fragment>
            {
                props.hasBadge ? 
                <Badge variant="dot" classes={{ badge: classes.badge }}>{content}</Badge> :
                content
            }
        </React.Fragment>
    )
}