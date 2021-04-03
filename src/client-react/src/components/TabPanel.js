import React from 'react'
import { Grow } from '@material-ui/core';

export default function TabPanel(props) {
    const { children, value, match, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== match}
            id={`scrollable-auto-tabpanel-${value}`}
            {...other}>
            { value === match ? <Grow in={value === match}>{children}</Grow> : null }
        </div>
    );
}