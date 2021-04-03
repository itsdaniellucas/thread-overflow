<template>
    <v-alert transition="fade-transition"
            dense
            :color="state.alert.color"
            class="status-bar"
            v-show="state.alert.visible">
        <v-progress-circular v-if="state.alert.isProgress" :size="18" :width="2" indeterminate color="white" />
        <v-icon v-if="state.alert.icon && !state.alert.isProgress" :class="textClassObj">{{ state.alert.icon }}</v-icon>
        <span class="ml-2" :class="textClassObj">{{ state.alert.text }}</span>
    </v-alert>
</template>

<script>
    import state from '@/state'

    export default {
        name: 'AlertBox',

        data: () => ({
            state,
            textClassObj: {
                'white-text': state.alert.isWhiteText,
                'black-text': !state.alert.isWhiteText,
            }
        })
    }
</script>

<style scoped>
.status-bar {
    width: auto;
    max-width: 320px;
    position: fixed !important;
    bottom: 5px;
    right: 20px;
    z-index: 10;
}

.white-text {
    color: #fff;
}

.black-text {
    color: #000;
}
</style>