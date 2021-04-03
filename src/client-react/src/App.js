import React, { useState, useEffect, useCallback } from 'react'
import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, LinearProgress, Tabs, Tab, Button } from '@material-ui/core'
import LoginDialog from './views/dialogs/LoginDialog'
import AlertBox from './views/content/AlertBox'
import TabLabel from './components/TabLabel'

import { Link, useHistory } from 'react-router-dom'
import { blueGrey, orange } from '@material-ui/core/colors';
import socketIOService from './services/socketIOService'
import loginService from './services/loginService'
import { thread as threadConstants } from './constants'
import RouteConfig from './RouteConfig'

import state from './state'
import actions from './actions';

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'fixed',
    background: blueGrey[900],
    color: blueGrey[50],
  },
  layout: {
    width: 'auto',
    marginTop: theme.spacing(14),
    padding: theme.spacing(4),
    background: blueGrey[50],
    minHeight: '81vh',
  },
  title: {
    flexGrow: 1,
  },
  tabs: {
    position: 'fixed',
    minWidth: '100%',
    maxWidth: '100%',
    zIndex: 500,
    top: theme.spacing(8),
    background: blueGrey[900],
    color: orange[600],
  },
  tabItem: {
    color: '#fb8c00 !important',
  },
  indicator: {
    backgroundColor: orange[600],
  },
  badge: {
    background: orange[800],
    color: orange[50],
  }
}));

function App() {
  const classes = useStyles();
  const history = useHistory();

  const [current, setCurrent] = useState(state.threads.value.current);
  const [mode, setMode] = useState(state.threads.value.mode);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState(state.threads.value.messages);
  const [pagination, setPagination] = useState(state.threads.value.pagination);
  const [isFetching, setIsFetching] = useState(false);
  const [active, setActive] = useState(state.threads.value.active);
  
  useEffect(() => {
    socketIOService.initialize();

    if(loginService.isLoggedIn()) {
      loginService.getUser(true).then(u => {
        state.user.value.next(u);
      });
    } else {
      loginService.logout(true);
    }
  }, [])

  useEffect(() => {
    const sub = state.threads.subscribe(x => {
      setActive(new Set(x.active));
      setMessages({ ...x.messages });
      setCurrent(x.current.toString());
      setPagination({ ...x.pagination });
      setMode(x.mode.toString());
    });

    return () => sub.unsubscribe();
  }, []);

  useEffect(() => {
    const sub = state.isFetching.subscribe(x => {
      setIsFetching(x);
    })

    return () => sub.unsubscribe();
  }, [])

  useEffect(() => {
    const sub = state.user.value.subscribe(x => {
        setUser(x);
        actions.thread.fetchAll();
        if(x != null && loginService.isLoggedIn()) {
          actions.thread.fetchSelf();
        } else {
          let messages = { ...state.threads.value.messages };
          messages[threadConstants.self] = [];

          state.threads.next({
            ...state.threads.value,
            messages: messages
          })
        }

        state.threads.value.active.forEach(a => {
          if(a != threadConstants.self && a != threadConstants.all) {
            actions.thread.fetch(a);
          }
        })
    });

    return () => sub.unsubscribe();
  }, []);

  const onTabChange = useCallback((event, newValue) => {
    if(newValue != state.threads.value.current) {
      let newMode = threadConstants.thread;
      if(newValue != threadConstants.all && newValue != threadConstants.self) {
        newMode = threadConstants.message;
      }
      state.threads.next({ ...state.threads.value, current: newValue, mode: newMode });
    }
  }, [])

  const onCloseTab = useCallback((threadId) => {
    let { messages, pagination, titles, active, current, mode } = { ...state.threads.value };

    let lastThread = [...active].pop();

    active.delete(threadId);

    if(lastThread == threadId && current == lastThread) {
      let newLastThread = [...active].pop();
      current = newLastThread == threadConstants.self ? threadConstants.all : newLastThread;
    } else if(current == threadId && current != lastThread && lastThread != threadId && current != threadConstants.self && current != threadConstants.all) {
      current = lastThread;
    }

    let page = pagination[current].page;

    if(titles[threadId]) {
      delete titles[threadId];
    }

    if(pagination[threadId]) {
      delete pagination[threadId];
    }

    if(messages[threadId]) {
      delete messages[threadId];
    }

    state.threads.next({
      current: current,
      active: active,
      titles: titles,
      messages: messages,
      pagination: pagination,
      mode: mode,
    });

    history.push(`/threads/${current}?page=${page}`);
  }, [])

  const onLogin = useCallback((login) => {
    loginService.login({
      Username: login.username,
      Password: login.password
    })
  }, [])

  const onLogout = useCallback(() => {
    loginService.logout();
  }, [])
  

  return (
    <div>
      <AppBar className={classes.appBar} color="transparent">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Thread Overflow - {state.threads.value.titles[current] || 'N/A'}
          </Typography>
          <LoginDialog className={classes.login} onLogin={onLogin} onLogout={onLogout} />
        </Toolbar>
      </AppBar>
      <Tabs value={current}
            onChange={onTabChange}
            variant="scrollable"
            scrollButtons="auto"
            className={classes.tabs}
            classes={{ indicator: classes.indicator }}>
        { 
          Array.from(active.keys()).map(x =>
            <Tab component={Link}
                  value={x} 
                  key={x}
                  to={`/threads/${x}?page=${pagination[x].page}`}
                  className={classes.tabItem}
                  label={
                    <TabLabel isCloseable={x != threadConstants.self && x != threadConstants.all}
                            onClose={onCloseTab} 
                            title={state.threads.value.titles[x] || 'N/A'}
                            value={x} />
                  } 
            />)
        }
      </Tabs>
      { isFetching ? <LinearProgress /> : null }
      <main className={classes.layout}>
        <RouteConfig ThreadLayout={{
          active: active,
          current: current,
          messages: messages,
          mode: mode,
          user: user,
        }} onTabChange={onTabChange} />
        <AlertBox />
      </main>
    </div>
  );
}

export default App;
