<template>
    <v-dialog v-model="visible"
                persistent
                max-width="350">
      <template v-slot:activator="{ on, attrs }">
        <v-list-item v-if="isEdit" link v-on="on" v-bind="attrs"><v-icon class="mr-2">mdi-pencil</v-icon>Edit</v-list-item>
        <v-btn v-else
                fab
                fixed
                bottom
                right
                dark
                :color="disabled ? 'blue-grey darken-5' : 'orange darken-1'"
                v-on="on"
                v-bind="attrs"
                :disabled="disabled">
            <v-icon>
                mdi-plus
            </v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline">
            <span>{{ isEdit ? 'Modify' : 'New' }} {{ isThreadMode ? 'Thread' : 'Message' }}</span>
        </v-card-title>
        <v-card-text class="mb-0 pb-0">
            <v-divider />
            <v-row class="mt-2">
                <v-col cols="12">
                    <v-text-field v-model="internalThread.title"
                                    label="Thread"
                                    placeholder="Title"
                                    prepend-inner-icon="mdi-format-title"
                                    outlined
                                    counter
                                    maxlength="50"
                                    :disabled="isEdit || isMessageMode">
                    </v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" class="py-0 my-0">
                    <v-textarea v-model="internalThread.content"
                                    label="Message"
                                    placeholder="Content"
                                    prepend-inner-icon="mdi-message"
                                    outlined
                                    maxlength="250"
                                    counter
                                    no-resize
                                    rows="5">
                    </v-textarea>
                </v-col>
            </v-row>
        </v-card-text>
        <v-card-actions class="mt-0 pt-0">
          <v-spacer></v-spacer>
          <v-btn color="error darken-1"
                text
                @click="onClose">
            Cancel
          </v-btn>
          <v-btn color="success darken-1"
                text
                @click="onSave">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
    import state from '@/state'
    import { thread as threadConstants } from '@/constants'

    export default {
        name: 'ThreadDialog',

        props: {
            disabled: {
                type: Boolean,
                default: false,
            },
            thread: {
                type: Object,
                default: () => ({}),
            },
            mode: {
                type: String,
                default: 'thread',
            },
            isEdit: {
                type: Boolean,
                default: false,
            }
        },

        data: () => ({
            visible: false,
            internalThread: {},
        }),

        watch: {
            thread(newVal) {
                this.initialize(newVal);
            }
        },

        computed: {
            isThreadMode() {
                return this.mode === threadConstants.thread;
            },
            isMessageMode() {
                return this.mode === threadConstants.message;
            },
        },

        methods: {
            initialize(newThread) {
                if(this.isEdit || this.isMessageMode) {
                    this.internalThread = { ...newThread };
                    this.internalThread.title = state.threads.titles[this.thread.threadId];
                } else {
                    this.internalThread = {
                        threadId: 0,
                        title: '',
                        content: '',
                    };
                }
            },

            onSave() {
                this.$emit('on-save', {
                    mode: this.mode,
                    item: this.internalThread,
                });
                this.onClose();
            },

            onClose() {
                this.initialize(this.thread);
                this.visible = false;
            }
        },

        mounted() {
            this.initialize(this.thread);
        },
    }
</script>

<style scoped>

</style>