<template>
    <aside :class="[_tobogPrefix_]" :data-vue-module="$options.name">
        <slot></slot>
    </aside>
</template>
<script>
import { parseNumber } from "../../utils/tool";
import Affix from "../../utils/scroll-affix";
export default {
    name: "Affix",
    componentName: "Affix",
    props: {
        offsetTop: Number,
        offsetBottom: Number,
        listener: [String, HTMLElement],
        zIndex: {
            type: Number,
            default: 100,
        },
    },
    mounted() {
        this.bindAffix();
    },
    computed: {
        affixData() {
            return {
                offsetTop: parseNumber(this.offsetTop),
                offsetBottom: parseNumber(this.offsetBottom),
                zIndex: parseNumber(this.zIndex),
                listener: this.listener
            };
        },
    },
    watch: {
        affixData() {
            this.$nextTick(() => {
                this.__bindAffix && this.__bindAffix.resetOpt(this.affixData, this.handleChange);
            });
        },
    },
    methods: {
        bindAffix() {
            this.$nextTick(() => {
                this.__bindAffix = new Affix(this.affixData, this.handleChange);
                this.__bindAffix.init(this.$el);
            });
        },
        handleChange(type = false) {
            this.$emit("on-change", type);
        },
    },
    beforeDestroy() {
        this.__bindAffix && this.__bindAffix.destroy();
        this.__bindAffix = null;
    },
};
</script>
