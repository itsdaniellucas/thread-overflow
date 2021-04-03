<template>
    <v-card color="blue-grey darken-3" class="my-4" dark>
        <v-card-title  class="headline" v-if="!message.isDeleted">
            <v-row justify="space-between">
                <v-col xl="10" md="9">
                    <v-list-item class="pa-0">
                        <v-list-item-avatar color="orange darken-1">
                            <span>{{ message.author.charAt(0).toUpperCase() }}</span>
                        </v-list-item-avatar>
                        
                        <v-list-item-content>
                            <v-list-item-title v-text="`@${message.author}`"></v-list-item-title>
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                    <v-list-item-subtitle v-bind="attrs" v-on="on" v-text="`${utility.timeAgo(message.dateCreated)} ago`"></v-list-item-subtitle>
                                </template>
                                <span>{{ new Date(message.dateCreated).toUTCString() }}</span>
                            </v-tooltip>
                        </v-list-item-content>
                    </v-list-item>
                </v-col>
                <v-col xl="2" md="3">
                    <v-row justify="end" no-gutters>
                        <v-menu>
                            <template v-slot:activator="{ attrs, on }">
                                <v-btn icon class="mt-1 ml-1" color="blue-grey lighten-5" small v-bind="attrs" v-on.stop.prevent="on" :disabled="!actions.user.isLoggedIn">
                                    <v-icon >mdi-dots-vertical</v-icon>
                                </v-btn>
                            </template>
                            <v-list>
                                <ThreadDialog :isEdit="true" @on-save="onEdit" :thread="message" />
                                <v-list-item link @click.prevent="onDelete"><v-icon class="mr-2">mdi-delete</v-icon>Delete</v-list-item>
                            </v-list>
                        </v-menu>
                    </v-row>
                </v-col>
            </v-row>
        </v-card-title>

        <v-card-text class="white--text pb-0" v-if="!message.isDeleted">
            {{ message.content }}
        </v-card-text>

        <v-card-actions class="pt-1">
            <v-row justify="end" no-gutters>
                <v-col v-if="message.isDeleted" class="ml-2 mt-2">{{ message.content }}</v-col>
                
                <v-btn icon :color="buttonColor.downvote" small :disabled="!actions.user.isLoggedIn || message.isDeleted" @click.stop.prevent="onDownvote">
                    <v-icon>mdi-arrow-down</v-icon>
                </v-btn>
                <span :style="voteStyle" class="mx-1">{{ message.votes }}</span>
                <v-btn icon :color="buttonColor.upvote" small :disabled="!actions.user.isLoggedIn || message.isDeleted" @click.stop.prevent="onUpvote">
                    <v-icon>mdi-arrow-up</v-icon>
                </v-btn>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
    import actions from '@/actions'
    import utility from '@/utility'
    import ThreadDialog from '@/views/dialogs/ThreadDialog'

    export default {
        name: 'ThreadMessage',

        components: {
            ThreadDialog
        },

        props: {
            message: {
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

                if(this.message.votes > 0) {
                    color = '#43a047';
                } else if(this.message.votes < 0) {
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

                if(this.message.userVoted === true) {
                    buttons.upvote = 'orange darken-1';
                    buttons.downvote = 'blue-grey lighten-5';
                } else if(this.message.userVoted === false) {
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
                    message: this.message,
                })
            },

            onDownvote() {
                this.$emit('on-downvote', {
                    message: this.message,
                })
            },

            onEdit($event) {
                this.$emit('on-edit', {
                    message: $event.item,
                })
            },

            onDelete() {
                this.$emit('on-delete', {
                    message: this.message,
                })
            },
        },
    }
</script>

<style scoped>

</style>