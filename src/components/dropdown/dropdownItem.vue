<template>
    <div
        :data-vview-module='$options.name'
        :class="classes"
        @click="handleClick">
        <slot></slot>
    </div>
</template>
<script>
import {
    findComponentUpward
} from '../../utils/findComponent';
export default {
    name: 'DropdownItem',
    props: {
        name: {
            type: [String, Number]
        },
        disabled: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        },
        divided: {
            type: Boolean,
            default: false
        }
    },
    mounted() {
        this.Dropdown = findComponentUpward(this, 'Dropdown');
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
               _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-selected`]: this.selected,
                    [`${_tobogPrefix_}-divided`]: this.divided
                }
            ];
        }
    },
    methods: {
        handleClick() {
            if (this.disabled || !this.Dropdown) return;
            this.Dropdown.$emit('on-change', this.name);
        }
    },

};
</script>
