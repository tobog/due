<template>
    <div :class="classes" @click.stop="select" :data-vue-module="$options.name">
        <Checkbox
            v-if="getCheckbox"
            :class="[_tobogPrefix_ + '-checkbox']"
            :theme="getTheme"
            :value="selected"
            :disabled="disabled"
        ></Checkbox>
        <slot>{{ getText }}</slot>
        <slot v-if="!getCheckbox" name="selected" :selected="selected">
            <Icons
                v-if="selected && getMultiple"
                type="ios-checkmark"
                :class="[_tobogPrefix_ + '-icon-selected']"
            ></Icons>
        </slot>
    </div>
</template>
<script>
import Icons from "../../icons/index";
import Checkbox from "../../checkbox/index";
import Emitter from "../../../utils/emitter";

export default {
    name: "Option",
    componentName: "Option",
    mixins: [Emitter],
    components: {
        Icons,
        Checkbox,
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
        multiple: {
            type: Boolean,
            default: void 0,
        },
        disabled: Boolean,
        attach: Object,
        selected: Boolean,
        hover: Boolean,
        checkbox: Boolean,
        theme: String,
        // strict: Boolean,
    },
    data() {
        return {};
    },
    created() {
        this.handleDispatch("on-init-none");
    },
    computed: {
        getTheme() {
            return this.theme || (this.__parentComponent__ && this.__parentComponent__.theme);
        },
        getText() {
            return this.label !== void 0 ? this.label : this.value;
        },
        getCheckbox() {
            return 2;
            return this.checkbox !== void 0
                ? this.checkbox
                : (this.__parentComponent__ && this.__parentComponent__.checkbox) || 1;
        },
        getMultiple() {
            return this.multiple !== void 0
                ? this.multiple
                : this.__parentComponent__ && this.__parentComponent__.multiple;
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-selected`]: this.selected,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                    [`${_tobogPrefix_}-checkbox`]: this.checkbox,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-multiple`]: this.getMultiple,
                    [`${_tobogPrefix_}-theme-${this.getTheme}`]: !!this.getTheme,
                },
            ];
        },
    },
    methods: {
        select() {
            if (this.disabled) return;
            this.handleDispatch("on-select", this.value, this.getText, this.attach);
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args);
            } else {
                this.__parentComponent__ = this.dispatch("Options", ...args);
            }
        },
    },
    watch: {
        hover: {
            immediate: true,
            handler(val) {
                if (val) {
                    this.handleDispatch("on-option-change", "hover", this);
                }
            },
        },
    },
    beforeDestroy() {
        this.handleDispatch("on-option-change", "destroy", this);
    },
};
</script>
