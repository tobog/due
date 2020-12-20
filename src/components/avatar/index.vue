<template>
    <span :class="classes" :style="styles">
        <span v-if="$slots.default" ref="children" :class="[_tobogPrefix_ + '-slot']" :style="childrenStyle">
            <slot></slot>
        </span>
        <Icons
            v-else
            :type="src"
            :fit="fit"
            :fallback="fallback"
            :data-size="!!styles.height"
            :class="[_tobogPrefix_ + '-icon']"
            @on-error="handleError"
        >
            <slot v-if="$slots.fallback" name="fallback" slot="fallback"></slot>
        </Icons>
    </span>
</template>
<script>
import Icons from "../icons/index";
import { unit } from "../../utils/tool";
import globalMixin from "../../mixins/global";
export default {
    name: "Avatar",
    componentName: "Avatar",
    mixins: [globalMixin],
    components: { Icons },
    props: {
        shape: {
            type: String,
            default: "circle", //'circle', 'square',rounded
        },
        size: [String, Number],
        src: {
            type: String,
            default: "ios-person",
        },
        fallback: String,
        fit: String, //fill,contain,cover,none,scale-down
    },
    data() {
        return {
            scale: 1,
            childrenWidth: 0,
        };
    },
    mounted() {
        this.$nextTick(this.setScale);
    },
    updated() {
        this.setScale();
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            const size = this.getGlobalData("size");
            return [
                _tobogPrefix_,

                {
                    [`${_tobogPrefix_}-${this.shape}`]: !!this.shape,
                    [`${_tobogPrefix_}-size-${size}`]: size,
                },
            ];
        },
        styles() {
            const size = this.getGlobalData("size");
            const style = {};
            const isNaN = parseInt(size);
            if (isNaN === isNaN || size === "auto") {
                style.height = style.width = unit(size);
                style.fontSize = unit(size, "px", 0.65);
            }
            return style;
        },
        childrenStyle() {
            return {
                msTransform: `scale(${this.scale})`,
                WebkitTransform: `scale(${this.scale})`,
                transform: `scale(${this.scale})`,
            };
        },
    },
    methods: {
        setScale() {
            if (!this.$slots.default) return;
            if (this.$refs.children) {
                // set children width again to make slot centered
                this.childrenWidth = this.$refs.children.offsetWidth;
                const avatarWidth = this.$el.getBoundingClientRect().width;
                // add 4px gap for each side to get better performance
                if (avatarWidth - 8 < this.childrenWidth) {
                    this.scale = ((avatarWidth - 8) / this.childrenWidth).toFixed(2);
                } else {
                    this.scale = 1;
                }
            }
        },
        handleError(e) {
            this.$emit("on-error", e);
        },
    },
};
</script>
