<template>
    <div :class="classes" :style="getStyle">
        <slot></slot>
    </div>
</template>
<script>
import {unit} from "../../utils/tool"
export default {
    name: "Layout-Aside",
    inject: {
        $ConfigProvide: {
            from: "$ConfigProvide",
            default: "",
        },
    },

    model: {
        prop: "visible",
        event: "on-change",
    },
    props: {
        fixed: Boolean,
        collapsedWidth: {
            type: [Number, String],
            default: 64,
        },
        width: {
            type: [Number, String],
            default: 200,
        },
        right: Boolean,
        visible: {
            type: Boolean,
            default: true,
        },
        breakpoint: String,
    },
    data() {
        return {
            top: 0,
            bottom: 0,
            open: !!this.visible,
        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-fixed`]: this.fixed,
                    [`${_tobogPrefix_}-right`]: this.right,
                    [`${_tobogPrefix_}-open`]: this.open,
                },
            ]
        },
        getStyle() {
            let style = {},
                width = this.width
            if (width && width != 200 && width != "200px") style.width = width !== "auto" ? unit(width) : width
            if (this.top) style.paddingTop = this.top + "px"
            if (this.bottom) style.paddingBottom = this.bottom + "px"
            if (!this.open) style.width = unit(this.collapsedWidth) || 0
            return style
        },
    },
    methods: {
        getWidth() {
            return this.open && /^[0-9\.\s]+(px)?$/gi.test(this.width)
                ? parseInt(this.width)
                : this.$el && this.$el.offsetWidth
        },
        refresh() {
            if (this.$parent && this.$parent.$options.name === "Layout" && typeof this.$parent.init === "function") {
                this.$parent.init(true)
            }
        },
    },
    watch: {
        fixed() {
            this.refresh()
        },
        width() {
            this.refresh()
        },
        open(val) {
            this.refresh()
            this.$emit("on-change", val)
            this.$emit("update:visible", val)
        },
        visible(val) {
            this.open = !!val
        },
        "$ConfigProvide.getMedia"(val) {
            console.log(val, this.open, this.breakpoint, "----------------")
            if (!this.breakpoint) return
            val = this.$ConfigProvide.compareMedia(val, this.breakpoint)
            if (!this.open && val >= 0) {
                this.open = true
                return
            }
            if (this.open && val < 0) {
                this.open = false
            }
        },
    },
    beforeDestroy() {
        this.refresh()
    },
}
</script>
