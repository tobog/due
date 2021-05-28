<template>
    <transition
        appear
        :data-vue-module="$options.name"
        :name="transitionName || (type === 'drop' ? 'transition-drop' : 'fade')"
        v-on="$listeners"
    >
        <div ref="popper" :class="classes" tabindex="-1">
            <div :class="[_tobogPrefix_ + '-content']" @scroll="$emit('scroll', $event)">
                <slot>{{ content }}</slot>
            </div>
            <span
                v-if="showArrow === void 0 && type !== 'drop' ? true : showArrow"
                :class="[_tobogPrefix_ + '-arrow']"
                data-arrow="true"
            ></span>
        </div>
    </transition>
</template>
<script>
import Popper from "../../../utils/popper"
import {getElement} from "../../../utils/dom"
import mixin from "./mixin"
export default {
    name: "Popper",
    componentName: "Popper",
    mixins: [mixin],
    props: {
        type: {
            type: String,
            default: "drop",
        }, // drop,popper
    },
    mounted() {
        this.initPopper()
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-gpu`]: this.gpu,
                    [`${_tobogPrefix_}-drop`]: this.type === "drop",
                    [`${_tobogPrefix_}-popper`]: this.trigger === "click" || this.trigger === "hover",
                },
            ]
        },
        options() {
            const isPopper = this.type !== "drop"
            return {
                placement: this.placement,
                offset: this.offset,
                gpu: this.gpu,
                transfer: this.transfer,
                trigger: this.trigger,
                always: this.always,
                delay: this.delay || 0,
                onchange: this.handleChange,
                responsive: this.responsive === void 0 && isPopper ? true : this.responsive,
                ...this.$attrs,
            }
        },
    },
    methods: {
        initPopper() {
            this.$nextTick(() => {
                const reference = this.getReference()
                if (!reference) return
                if (this._Popper) {
                    this._Popper.update(reference, this.$el, this.options)
                    if (this.always) {
                        this._Popper.toggle(true)
                    }
                    return
                }
                this._Popper = new Popper(reference, this.$el, this.options)
                if (this.always) {
                    this._Popper.toggle(true)
                }
            })
        },
        handleChange(...args) {
            this.$emit("on-status", ...args)
        },
        getReference() {
            if (this.reference instanceof HTMLElement) return this.reference
            return (this.$parent.$refs || {})[this.reference] || getElement(this.reference)
        },
    },
    watch: {
        options() {
            this.initPopper()
        },
        reference() {
            this.initPopper()
        },
    },
    beforeDestroy() {
        this._Popper && this._Popper.destroy()
        this._Popper = null
    },
}
</script>
