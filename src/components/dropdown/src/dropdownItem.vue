<template>
    <div :data-vue-module="$options.name" :class="classes" @click="handleClick">
        <Icons :class="[_tobogPrefix_ + '-icon']" v-if="icon" :type="icon"></Icons>
        <slot></slot>
    </div>
</template>
<script>
import {findComponentUpward} from "../../../utils/findComponent"
import Icons from "../../icons/src/index.vue"
export default {
    name: "DropdownItem",
    componentName: "DropdownItem",
    props: {
        name: [String, Number],
        disabled: Boolean,
        selected: Boolean,
        divided: Boolean,
        icon: String,
    },
    components: {
        Icons,
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
                    [`${_tobogPrefix_}-selected`]: this.isSelected,
                    [`${_tobogPrefix_}-divided`]: this.divided,
                },
            ]
        },
        isSelected() {
            if (this.name == null) return this.selected;
            return this.__Dropdown && this.__Dropdown.value === this.name
        },
    },
    methods: {
        handleClick() {
            if (this.disabled || !this.__Dropdown) return
            this.__Dropdown.$emit("on-select", this.name)
        },
    },
}
</script>
