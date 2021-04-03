<template>
  <v-app>
    <v-app-bar app
              color="#263238"
              fixed
              dark>
      <div class="d-flex align-center">
        <h2 class="ml-5">Thread Overflow</h2>
      </div>

      <v-spacer></v-spacer>

      <LoginDialog @on-login="onLogin" @on-logout="onLogout" />
    </v-app-bar>
    <v-main>
      <v-tabs dark
              background-color="blue-grey darken-4"
              active-class="active-tab"
              slider-color="orange darken-1"
              show-arrows
              class="tabs"
              @change="() => onTabChange($route.params.id)">
        <v-tab v-for="i in tabs"
              :key="i"
              :to="`/threads/${i}?page=${state.threads.pagination[i] ? (state.threads.pagination[i].page || 1) : 1}`">
          {{ state.threads.titles[i] }}
          <v-btn v-if="i != threadConstants.self && i != threadConstants.all" :style="buttonStyle" icon :color="getIconColor(i)" x-small @click.prevent="onTabClose(i)">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-tab>
      </v-tabs>
      <v-progress-linear indeterminate color="orange darken-1" v-show="state.isFetching" /> 
      <router-view @on-tab-change="onTabChange" />
      <AlertBox />
    </v-main>
  </v-app>
</template>

<script>

import AlertBox from '@/views/content/AlertBox'
import LoginDialog from '@/views/dialogs/LoginDialog'
import LoginService from '@/services/loginService'
import SocketIOService from '@/services/socketIOService'
import state from '@/state'
import actions from '@/actions'
import { thread as threadConstants } from '@/constants'

export default {
  name: 'App',

  components: {
    LoginDialog,
    AlertBox
  },

  data: () => ({
    activeTab: threadConstants.all,
    tabs: [...state.threads.active],
    buttonStyle: {
      marginLeft: '5px',
    },
    state,
    threadConstants
  }),
  
  methods: {
    onLogin($event) {
      LoginService.login({
        Username: $event.login.username,
        Password: $event.login.password,
      }).then(() => {
        let requests = [];

        state.threads.active.forEach(x => {
          if(x == threadConstants.all) {
            requests.push(actions.threads.fetchAll());
          } else if(x == threadConstants.self) {
            requests.push(actions.threads.fetchSelf())
          } else {
            requests.push(actions.threads.fetch(x))
          }
        })

        return Promise.all(requests);
      });
    },
    onLogout() {
      LoginService.logout();
      state.threads.messages[threadConstants.self] = [];
    },
    onTabChange(threadId) {
      this.tabs = [...state.threads.active];
      this.activeTab = threadId;
      state.threads.current = threadId;
      if(this.activeTab == threadConstants.all || this.activeTab == threadConstants.self) {
        state.threads.mode = threadConstants.thread;
      } else {
        state.threads.mode = threadConstants.message;
      }
    },
    onTabClose(threadId) {
      let lastThread = [...state.threads.active].pop();

      let isCurrent = false;

      state.threads.active.delete(threadId);
      if(lastThread == threadId && state.threads.current == lastThread) {
        let newLastThread = [...state.threads.active].pop();
        state.threads.current = newLastThread == threadConstants.self ? threadConstants.all : newLastThread;
      } else if(state.threads.current == threadId && state.threads.current != lastThread && lastThread != threadId && state.threads.current != threadConstants.self && state.threads.current != threadConstants.all) {
        state.threads.current = lastThread;
      } else {
        isCurrent = true;
      }

      let page = state.threads.pagination[state.threads.current].page;

      if(state.threads.titles[threadId]) {
        delete state.threads.titles[threadId];
      }

      if(state.threads.pagination[threadId]) {
        delete state.threads.pagination[threadId];
      }

      if(state.threads.messages[threadId]) {
        delete state.threads.messages[threadId];
      }

      if(isCurrent) {
        this.onTabChange(state.threads.current);
      } else {
        this.$router.push(`/threads/${state.threads.current}?page=${page}`);
      }
    },
    getIconColor(tab) {
      if(this.activeTab == tab) {
        return 'orange darken-1';
      }
      return 'blue-grey lighten-4';
    }
  },

  created() {
    SocketIOService.initialize();
    if(LoginService.isLoggedIn()) {
      LoginService.getUser(true).then(u => {
        actions.user.setUser(u);
      })
    } else {
      LoginService.logout(true);
    }
  },
};
</script>

<style>
html {
  margin: 0;
  padding: 0;
  overflow-y: auto;
}

.active-tab {
  color: #fb8c00 !important;
}

.tabs {
  position: fixed;
  z-index: 1;
}
</style>