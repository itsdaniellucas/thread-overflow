<template>
    <div>
        <v-row class="mt-15 mb-5" justify="center">
            <v-col>
                <v-row justify="center">
                    <v-pagination v-if="state.threads.pagination[threadId]" :value="state.threads.pagination[threadId].page" :length="state.threads.pagination[threadId].totalPages" @input="onPageChange" circle color="orange darken-1" />
                </v-row>
                
                <v-row justify="center" class="my-6">
                    <v-sheet min-width="50vw"
                            max-width="50vw">
                        <template v-for="t in threads">
                            <Thread v-if="threadId == threadConstants.all || threadId == threadConstants.self" 
                                    :key="t.id" 
                                    :thread="t" 
                                    @on-thread-click="onThreadClick"
                                    @on-upvote="onUpvoteThread"
                                    @on-downvote="onDownvoteThread"
                                    @on-delete="onDeleteThread" />
                            <ThreadMessage v-else 
                                            :key="t.id" 
                                            :message="t" 
                                            @on-upvote="onUpvoteMessage"
                                            @on-downvote="onDownvoteMessage"
                                            @on-delete="onDeleteMessage"
                                            @on-edit="onSaveMessage" />
                        </template>
                    </v-sheet>
                </v-row>

                <v-row justify="center">
                    <v-pagination v-if="state.threads.pagination[threadId]" :value="state.threads.pagination[threadId].page" :length="state.threads.pagination[threadId].totalPages" @input="onPageChange" circle color="orange darken-1" />
                </v-row>
            </v-col>
        </v-row>
        <ThreadDialog :mode="state.threads.mode" :disabled="state.user == null" @on-save="onSaveThread" :thread="thread" />
    </div>
</template>

<script>
    import state from '@/state'
    import actions from '@/actions'
    import Thread from '@/components/Thread'
    import ThreadMessage from '@/components/ThreadMessage'
    import LoginService from '@/services/loginService'
    import { thread as threadConstants } from '@/constants'
    import ThreadDialog from '@/views/dialogs/ThreadDialog'

    export default {
        name: 'ThreadView',

        components: {
            Thread,
            ThreadMessage,
            ThreadDialog,
        },

        data: () => ({
            threadId: '',
            threads: [],
            state,
            threadConstants,
            thread: {},
        }),

        watch: {
            $route() {
                this.initialize();
            },
        },

        methods: {
            initialize() {
                this.threadId = this.$route.params.id;
                let page = parseInt(this.$route.query.page) || 1;
                let existingPage = 0;

                this.thread = {
                    threadId: this.threadId,
                    title: state.threads.titles[this.threadId],
                };

                let threadPagination = state.threads.pagination[this.threadId];
                if(threadPagination) {
                    existingPage = threadPagination.page;
                    threadPagination.page = page;
                }

                let threads = state.threads.messages[this.threadId];
                if(threads) {
                    this.threads = [...threads];
                }

                document.title = `${state.threads.titles[this.threadId]} | Task Tracker`;

                let isEmpty = state.threads.messages[this.threadId] == null || state.threads.messages[this.threadId].length == 0 || page != existingPage;
                
                if(this.threadId == threadConstants.all) {
                    if(isEmpty) {
                        actions.threads.fetchAll().then(() => {
                            this.threads = [...state.threads.messages[this.threadId]];
                        });
                    }
                } else if(this.threadId == threadConstants.self && LoginService.isLoggedIn()) {
                    if(isEmpty) {
                        actions.threads.fetchSelf().then(() => {
                            this.threads = [...state.threads.messages[this.threadId]];
                        });
                    }
                } else if(this.threadId != threadConstants.all && this.threadId != threadConstants.self) {
                    if(isEmpty) {
                        actions.threads.fetch(this.threadId).then(() => {
                            document.title = `${state.threads.titles[this.threadId]} | Task Tracker`;
                            this.threads = [...state.threads.messages[this.threadId]];
                            this.$emit('on-tab-change', this.threadId);
                        });
                    } else {
                        this.$emit('on-tab-change', this.threadId);
                    }
                }
            },

            onThreadClick($event) {
                let thread = $event.thread;
                let page = 1;
                if(state.threads.pagination[thread.threadId]) {
                    page = state.threads.pagination[thread.threadId].page;
                }
                    
                this.$router.push(`/threads/${thread.threadId}?page=${page}`);
            },

            onUpvoteThread($event) {
                actions.threads.upvoteThread($event.thread.threadId);
            },

            onDownvoteThread($event) {
                actions.threads.downvoteThread($event.thread.threadId);
            },

            onUpvoteMessage($event) {
                actions.threads.upvoteMessage($event.message.threadId, $event.message.messageId);
            },

            onDownvoteMessage($event) {
                actions.threads.downvoteMessage($event.message.threadId, $event.message.messageId);
            },

            onDeleteThread($event) {
                actions.threads.removeThread($event.thread.threadId);
            },

            onDeleteMessage($event) {
                actions.threads.removeMessage($event.message.threadId, $event.message.messageId);
            },

            onSaveMessage($event) {
                actions.threads.modifyMessage($event.message.threadId, $event.message.messageId, $event.message.content);
            },

            onSaveThread($event) {
                if($event.mode == threadConstants.message) {
                    actions.threads.addMessage($event.item.threadId, $event.item.content);
                } else if($event.mode == threadConstants.thread) {
                    actions.threads.addThread($event.item);
                }
            },

            onPageChange(page) {
                this.$router.push(`/threads/${this.threadId}?page=${page}`);
            }
        },
        
        created() {
            state.$on('messages-changed', () => {
                this.initialize();
            })
            
            this.initialize();
        },

        destroyed() {
            state.$off('messages-changed');
        }
    }
</script>

<style scoped>

</style>