<template>
    <div :class="classes" @click.stop="select" @mousedown.prevent :data-vue-module="$options.name">
        <slot>{{ getText }}</slot>
        <slot name="selected" :selected="selected">
            <Icons v-if="multiple && selected" type="ios-checkmark" :class="[_tobogPrefix_ + '-icon-selected']"></Icons>
        </slot>
    </div>
</template>
<script>
import Icons from "../../icons/index"
import Emitter from "../../../utils/emitter"

export default {
    name: "Option",
    mixins: [Emitter],
    components: {
        Icons,
    },
    props: {
        value: {
            type: [String, Number],
            required: true,
        },
        label: {
            type: [String, Number],
            default: void 0,
        },
        disabled: Boolean,
        strict: {
            type: Boolean,
            default: void 0,
        },
        theme: String,
        attach: Object,
        selected: Boolean,
        hover: Boolean,
    },
    data() {
        return {
            // selected:false,
            // hidden: false, // for search
            // hover: false,
        }
    },
    created() {
        // this.$on("on-query-option", this.queryChange)
        // this.handleDispatch("on-option-change", "created", this)
    },
    computed: {
        getTheme() {
            return this.theme || (this.__parentComponent__ || {}).theme
        },
        getText() {
            return this.label !== void 0 ? this.label : this.value
        },
        multiple() {
            return this.__parentComponent__ && this.__parentComponent__.multiple
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-selected`]: this.selected,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-multiple`]: this.multiple,
                    [`${_tobogPrefix_}-theme-${this.getTheme}`]: !!this.getTheme,
                },
            ]
        },
    },
    methods: {
        select() {
            if (this.disabled) return
            this.handleDispatch("on-select", this.value, this.getText)
        },

        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args)
            } else {
                this.__parentComponent__ = this.dispatch("Options", ...args)
            }
        },
    },
    watch: {
        hover: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.handleDispatch("on-option-change", "hover", this)
                }
            },
        },
    },
    beforeDestroy() {
        this.handleDispatch("on-option-change", "destroy", this)
    },
}
</script>
