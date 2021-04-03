import React, { useEffect, useState } from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import state from './state'

export default function CustomRoute({ component: Component, meta, compProps, withProps, ...rest }) {
    const loc = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const sub = state.user.value.subscribe(x => {
            setIsLoggedIn(x != null);
            setUser(x);
        });

        return () => sub.unsubscribe();
    }, []);

    let body = null;
    
    if(withProps) {
        body = Component;
    } else {
        body = <Component meta={meta} {...compProps} />;
    }
    

    if(meta && meta.authRequired) {
        const validRoles = meta.validRoles;
        
        if(isLoggedIn) {
            if(user && validRoles && !validRoles.includes(user.Role.Name)) {
                body = <Redirect to={{ pathname: '/error/403', state: { from: loc } }} />
            }
        } else {
            body = <Redirect to={{ pathname: '/error/401', state: { from: loc } }} />
        }
    }

    return (
        <Route { ...rest }>
            {body}
        </Route>
    )
}