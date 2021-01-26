<template>
    <div :data-vue-module="$options.name" :class="classes" @click="handleClick">
        <slot></slot>
    </div>
</template>
<script>
import {findComponentUpward} from "../../utils/findComponent"
export default {
    name: "DropdownItem",
    componentName: "DropdownItem",
    props: {
        name: [String, Number],
        disabled: Boolean,
        selected: Boolean,
        divided: Boolean,
    },
    beforeCreate() {
        this.__Dropdown = findComponentUpward(this, "Dropdown")
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-selected`]: this.selected,
                    [`${_tobogPrefix_}-divided`]: this.divided,
                },
            ]
        },
    },
    methods: {
        handleClick() {
            if (this.disabled || !this.__Dropdown) return
            this.__Dropdown.$emit("on-select", this.name === void 0 ? this.$el.innerText : this.name)
        },
    },
}
</script>
