<template>
    <li :class="[_tobogPrefix_]" :data-vue-module="$options.name">
        <component :is="getTag" v-bind="$attrs" :class="innerClasses">
            <slot></slot>
        </component>
        <span v-if="showSep" :class="[_tobogPrefix_ + '-sep']">
            <slot name="sep">{{ separator }}</slot>
        </span>
    </li>
</template>

<script>
export default {
    name: "BreadItem",
    componentName: "BreadItem",
    inheritAttrs: false,
    props: {
        sep: String,
        // to: String,
        // href: String,
    },
    data() {
        return {
            separator: this.sep,
            showSep: true,
        }
    },
    created() {
        this.$parent.updateChildren()
    },
    computed: {
        innerClasses() {
            const {to, href} = this.$attrs
            const type = to || href ? "link" : "item"
            return `${this._tobogPrefix_}-${type}`
        },
        getTag() {
            const {to, href, tag = "span"} = this.$attrs
            if (to) return this.$router ? "router-link" : "a"
            if (href) return "a"
            return tag
        },
    },
    beforeDestroy() {
        this.$parent.updateChildren()
    },
}
</script>
