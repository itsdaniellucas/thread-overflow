import React, { useEffect, useCallback } from 'react'
import { Switch, Redirect, useLocation, useHistory } from 'react-router-dom'
import ThreadLayout from './views/routes/ThreadLayout'
import CustomRoute from './CustomRoute'
import Error from './views/Error'
import appConfig from './appConfig'
import state from './state'
import actions from './actions'
import loginService from './services/loginService'
import { thread as threadConstants, defaultPagination } from './constants'

export default function RouteConfig(props) {
    const loc = useLocation();
    const history = useHistory();
    const query = new URLSearchParams(loc.search);

    const errorMetas = {
        ['401']: {
            imageSrc: appConfig.errorImages[401],
            text: '401',
            subTitle: 'Unauthorized',
            content: 'You are unauthorized to access this resource, please make sure to login first.',
            redirectRoute: '/',
            redirectText: 'Home',
        },
        ['403']: {
            imageSrc: appConfig.errorImages[403],
            text: '403',
            subTitle: 'Forbidden',
            content: 'You do not have permission to access this resource.',
            redirectRoute: '/',
            redirectText: 'Home',
        },
        ['404']: {
            imageSrc: appConfig.errorImages[404],
            text: '404',
            subTitle: 'Not Found',
            content: 'The page or resource that you are trying to access does not exist.',
            redirectRoute: '/',
            redirectText: 'Home',
        },
        ['500']: {
            imageSrc: appConfig.errorImages[500],
            text: '500',
            subTitle: 'Internal Server Error',
            content: 'Oops! Something went wrong.',
            redirectRoute: '/',
            redirectText: 'Home',
        }
    }

    const loadThread = (threadId) => {
        return actions.thread.fetch(threadId, true).then((data) => {
            let { messages, pagination, titles, active, current, mode } = { ...state.threads.value };
            
            mode = threadConstants.message;
            current = threadId;
            active.add(threadId);
            titles[threadId] = data.title;
            messages[threadId] = data.messages;
            pagination[threadId].totalPages = data.totalPages;
    
            state.threads.next({
                current: current,
                active: active,
                titles: titles,
                messages: messages,
                pagination: pagination,
                mode: mode,
            });

            return Promise.resolve();
        })
    }

    useEffect(() => {
        const routeName = {
            ['/error/401']: 'Unauthorized',
            ['/error/403']: 'Forbidden',
            ['/error/404']: 'Not Found',
            ['/error/500']: 'Internal Server Error'
        };

        if(routeName[loc.pathname]) {
            document.title = `${routeName[loc.pathname]} | Thread Overflow`;
        } else {
            const threadId = loc.pathname.split('/')[2];
            const threadName = state.threads.value.titles[threadId];
            const page = parseInt(query.get('page')) || 1;

            if(threadId == threadConstants.all || threadId == threadConstants.self) {
                if(state.threads.value.pagination[threadId].page != page) {
                    let { pagination } = { ...state.threads.value };
                    pagination[threadId].page = page;
                    state.threads.next({ 
                      ...state.threads.value,
                      pagination: pagination
                    })

                    if(threadId == threadConstants.all) {
                        actions.thread.fetchAll();
                    } else if(threadId == threadConstants.self && loginService.isLoggedIn()) {
                        actions.thread.fetchSelf();
                    }
                } else {
                    props.onTabChange(null, threadId);
                }
                
            } else if(threadId) {
                if(!state.threads.value.pagination[threadId] || state.threads.value.pagination[threadId].page != page) {
                    let { pagination } = { ...state.threads.value };

                    if(pagination[threadId])  {
                        pagination[threadId].page = page;
                    } else {
                        pagination[threadId] = { ...defaultPagination };
                        pagination[threadId].page = page;
                    }
                    
                    state.threads.next({ 
                      ...state.threads.value,
                      pagination: pagination
                    })
                    loadThread(threadId).then(() => {
                        props.onTabChange(null, threadId);
                    });
                } else {
                    if(state.threads.value.active.has(threadId)) {
                        props.onTabChange(null, threadId);
                    }
                }
            }

            if(threadName) {
                document.title = `${threadName} | Thread Overflow`;
            }
        }
        
    });

    const onThreadClick = useCallback((threadId) => {
        history.push(`/threads/${threadId}`);
    });

    return (
        <React.Fragment>
            <Switch>
                <Redirect exact from="/" to="/threads/all" />
                <CustomRoute path="/threads/:id" component={<ThreadLayout {...props['ThreadLayout']} onThreadClick={onThreadClick} />} withProps={true} />
                <CustomRoute path="/error/401" component={Error} meta={errorMetas[401]} />
                <CustomRoute path="/error/403" component={Error} meta={errorMetas[403]} />
                <CustomRoute path="/error/404" component={Error} meta={errorMetas[404]} />
                <CustomRoute path="/error/500" component={Error} meta={errorMetas[500]} />
                <Redirect to="/error/404" />
            </Switch>
        </React.Fragment>
    )
}