<template>
    <div :class="[_tobogPrefix_]" :data-vue-module="$options.name">
        <slot></slot>
    </div>
</template>

<script>
import mediaSize from "../../mixins/mediaSize"
import {loadStyle} from "../../utils/dom"
export default {
    name: "Config",
    inject: {
        $ConfigProvide: {
            from: Symbol(),
            default: void 0,
        },
    },
    provide() {
        return {
            $ConfigProvide: this,
        }
    },
    mixins: [mediaSize],
    props: {
        theme: String,
        size: [Number, String], // large normal  mediu  small
        media: Boolean, // xxs xs sm  md lg xl xxl
    },
    computed: {
        getConfig() {
            return {
                theme: this.theme,
                size: this.size,
                media: this.getMedia,
                mediaSize: this.mediaSize,
            }
        },
    },
    methods: {
        setStyleTag() {
           loadStyle()
        },
        filerStyleVar() {
           
        },
    },
}
</script>
