<template>
    <div :data-vue-module="$options.name" :class="classes" @click="handleClick">
        <slot></slot>
    </div>
</template>
<script>
import { findComponentUpward } from "../../utils/findComponent";
export default {
    name: "DropdownItem",
    props: {
        name: [String, Number],
        disabled: {
            type: Boolean,
            default: false,
        },
        selected: {
            type: Boolean,
            default: false,
        },
        divided: {
            type: Boolean,
            default: false,
        },
    },
    beforeCreate() {
        this._dropdown_ = findComponentUpward(this, "Dropdown");
    },
    mounted() {
        if (this.selected) this.handleClick();
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-selected`]:
                        this.selected || (this._dropdown_ && this._dropdown_.label === this.name),
                    [`${_tobogPrefix_}-divided`]: this.divided,
                },
            ];
        },
    },
    methods: {
        handleClick() {
            if (this.disabled || !this._dropdown_) return;
            this._dropdown_.$emit("on-select", this.name === void 0 ? this.$el.innerText : this.name);
        },
    },
};
</script>
