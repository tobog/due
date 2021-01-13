<template>
    <transition
        appear
        :data-vue-module="$options.name"
        :name="transitionName || (type === 'drop' ? 'transition-drop' : 'fade')"
        v-on="transitionListeners"
    >
        <div ref="popper" :class="classes" tabindex="-1">
            <span
                v-if="showArrow === void 0 && type !== 'drop' ? true : showArrow"
                :class="[_tobogPrefix_ + '-arrow']"
                data-arrow="true"
            ></span>
            <div :class="[_tobogPrefix_ + '-content']">
                <slot>{{ content }}</slot>
            </div>
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
        // transfer: Boolean,
        // reference: [String, HTMLElement],
        // placement: String, //top,left,bottom,right,center,fix
        // transitionName: String,
        // content: String,
        // delay: Number,
        // gpu: Boolean,
        // trigger: String, //click hover,other,
        // always: Boolean,
        // offset: {
        //     type: [String, Number],
        //     default: 5,
        // },
        // showArrow: {
        //     type: Boolean,
        //     default: void 0,
        // },
        // responsive: {
        //     type: Boolean,
        //     default: void 0,
        // },
    },
    mounted() {
        this.initPopper()
    },
    computed: {
        transitionListeners() {
            const listeners = {}
            ;[
                "before-enter",
                "before-leave",
                "before-appear",
                "enter",
                "leave",
                "appear",
                "after-enter",
                "after-leave",
                "after-appear",
                "enter-cancelled",
                "leave-cancelled",
                "appear-cancelled",
            ].forEach((key) => {
                const listener = this.$listeners[key]
                if (listener) listeners[key] = listener
            })
            return listeners
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-gpu`]: this.gpu,
                    [`${_tobogPrefix_}-drop`]: this.type === "drop",
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
                trigger: this.trigger || (isPopper && "click") || "other",
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
                if (this._Popper) {
                    this._Popper.update(this.getReference(), this.$el, this.options)
                    if (this.always) {
                        this._Popper.toggle(true)
                    }
                    return;
                }
                this._Popper = new Popper(this.getReference(), this.$el, this.options)
                if (this.always) {
                    this._Popper.toggle(true)
                }
            })
        },
        handleChange(...args) {
            this.$emit("on-visible-change", ...args)
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
