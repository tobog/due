<template>
    <div :class="[_tobogPrefix_]" :data-vue-module="$options.name">
        <component v-if="styleCode" :is="'style'">{{ styleCode }}</component>
        <slot></slot>
    </div>
</template>

<script>
import mediaSize from "../../mixins/mediaSize";
import { loadStyle } from "../../utils/dom";
export default {
    name: "Config",
    componentName: "Config",
    inject: {
        $ConfigProvide: {
            from: Symbol(),
            default: void 0,
        },
    },
    provide() {
        return {
            $ConfigProvide: this.ConfigProvide,
        };
    },
    mixins: [mediaSize],
    props: {
        theme: String,
        size: [Number, String], // large normal  mediu  small
        media: Boolean, // xxs xs sm  md lg xl xxl
        styleCode: String
    },
    data() {
        return {
            ConfigProvide: {
                theme: this.theme,
                size: this.size,
                media: null,
                mediaSize: null,
                getMediaData: this.getMediaData,
                compareMedia: this.compareMedia,
                getBearkpoints: this.getBearkpoints,
            },
        };
    },
    created() {
        this.ConfigProvide.media = this.getMedia;
        this.ConfigProvide.mediaSize = this.mediaSize;
    },
    methods: {
        loadStyle,
        filerStyleVar() {},
    },
    watch: {
        getMedia(val) {
            this.ConfigProvide.media = val;
        },
        theme(val) {
            this.ConfigProvide.theme = val;
        },
        size(val) {
            this.ConfigProvide.size = val;
        },
        mediaSize(val) {
            this.ConfigProvide.mediaSize = val;
        },
        getBearkpoints(val) {
            this.ConfigProvide.getBearkpoints = val;
        },
    },
};
</script>
