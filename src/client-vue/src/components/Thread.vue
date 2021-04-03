<template>
    <v-card color="blue-grey darken-3" class="my-4" dark @click="onThreadClick">
        <v-card-title class="headline">
            <v-row justify="space-between">
                <v-col xl="10" md="9">
                    <v-chip v-if="thread.votes >= 50" color="#ef5350" class='mr-2 mb-2'>Hot</v-chip>
                    <v-chip v-if="utility.timeAgo(thread.dateCreated).includes('second')" color="#66bb6a" class='mr-2 mb-2'>New</v-chip>
                    <span>{{ thread.title }}</span>
                </v-col>
                <v-col xl="2" md="3">
                    <v-row justify="end" no-gutters>
                        <v-btn icon class="mt-1" :color="buttonColor.downvote" small @click.stop.prevent="onDownvote" :disabled="!actions.user.isLoggedIn">
                            <v-icon>mdi-arrow-down</v-icon>
                        </v-btn>
                        <span :style="voteStyle" class="mx-1">{{ thread.votes }}</span>
                        <v-btn icon class="mt-1" :color="buttonColor.upvote" small @click.stop.prevent="onUpvote" :disabled="!actions.user.isLoggedIn">
                            <v-icon>mdi-arrow-up</v-icon>
                        </v-btn>
                        
                        <v-menu>
                            <template v-slot:activator="{ attrs, on }">
                                <v-btn icon class="mt-1 ml-1" color="blue-grey lighten-5" small v-bind="attrs" v-on.stop.prevent="on" :disabled="!actions.user.isLoggedIn">
                                    <v-icon >mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <v-list-item link @click.prevent="onDelete"><v-icon class="mr-2">mdi-delete</v-icon> Delete</v-list-item>
                            </v-list>
                        </v-menu>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-title>

        <v-card-subtitle>
            <v-tooltip right>
                <template v-slot:activator="{ on, attrs }">
                    <span v-bind="attrs" v-on="on">by @{{ thread.author }} - {{ utility.timeAgo(thread.dateCreated) }} ago</span>
                </template>
                <span>{{ new Date(thread.dateCreated).toUTCString() }}</span>
            </v-tooltip>
        </v-card-subtitle>

        <v-card-text class="white--text">
            {{ thread.content }}
        </v-card-text>
    </v-card>
</template>

<script>
    import actions from '@/actions'
    import utility from '@/utility'

    export default {
        name: 'Thread',

        props: {
            thread: {
                type: Object,
                default: () => ({})
            }
        },

        data: () => ({
            utility,
            actions
        }),

        computed: {
            voteStyle() {
                let color = '#eceff1';

                if(this.thread.votes > 0) {
                    color = '#43a047';
                } else if(this.thread.votes < 0) {
                    color = '#e53935';
                } else {
                    color ='#eceff1';
                }

                return {
                    fontSize: '20px',
                    color: color,
                }
            },

            buttonColor() {
                let buttons = {
                    upvote: 'blue-grey lighten-5',
                    downvote: 'blue-grey lighten-5',
                }

                if(this.thread.userVoted === true) {
                    buttons.upvote = 'orange darken-1';
                    buttons.downvote = 'blue-grey lighten-5';
                } else if(this.thread.userVoted === false) {
                    buttons.downvote = 'orange darken-1';
                    buttons.upvote = 'blue-grey lighten-5';
                } else {
                    buttons.upvote = 'blue-grey lighten-5';
                    buttons.downvote = 'blue-grey lighten-5';
                }

                return buttons;
            },
        },

        methods: {
            onUpvote() {
                this.$emit('on-upvote', {
                    thread: this.thread,
                })
            },

            onDownvote() {
                this.$emit('on-downvote', {
                    thread: this.thread,
                })
            },

            onDelete() {
                this.$emit('on-delete', {
                    thread: this.thread,
                })
            },

            onThreadClick() {
                this.$emit('on-thread-click', {
                    thread: this.thread,
                });
            }
        },
    }
</script>

<style scoped>

</style>