<template>
    <ul :class="classes" :data-vue-module="$options.name">
        <slot></slot>
    </ul>
</template>

<script>
import globalMixin from "../../mixins/global"
export default {
    name: "Bread",
    componentName: "Bread",
    mixins: [globalMixin],
    props: {
        sep: {
            type: String,
            default: "/",
        },
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const size = this.getGlobalData("size")
            return [
                _tobogPrefix_,

                {
                    [`${_tobogPrefix_}-size-${size}`]: size,
                },
            ]
        },
    },
    methods: {
        updateChildren() {
            this.$nextTick(() => {
                const last = this.$children.length - 1,
                    sep = this.sep
                this.$children.forEach((child, index) => {
                    child.showSep = true
                    if (last == index) child.showSep = false
                    if (!child.sep) child.separator = sep
                })
            })
        },
    },
    watch: {
        sep() {
            this.updateChildren()
        },
    },
}
</script>
