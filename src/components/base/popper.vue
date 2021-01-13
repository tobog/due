<template>
    <transition
        appear
        :data-vue-module="$options.name"
        :name="transitionName || (type === 'drop' ? 'transition-drop' : 'fade')"
        v-on="transitionListeners"
    >
        <div ref="popper" :class="classes" tabindex="-1" v-offset-dom="{reference: getReference(), options}">
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
// v-transfer-dom="transfer"
//多次跟新有抖动问题 transfer影响
import OffsetDom from "../../directives/offset-dom"
import {getElement} from "../../utils/dom"
export default {
    name: "Popper",
    componentName: "Popper",
    directives: {
        OffsetDom,
    },
    props: {
        type: {
            type: String,
            default: "drop",
        }, // drop,popper
        transfer: Boolean,
        reference: [String, HTMLElement],
        placement: String, //top,left,bottom,right,center,fix
        transitionName: String,
        content: String,
        delay: Number,
        gpu: Boolean,
        trigger: String, //click hover,other,
        always: Boolean,
        offset: {
            type: [String, Number],
            default: 5,
        },
        showArrow: {
            type: Boolean,
            default: true,
        },
        responsive: {
            type: Boolean,
            default: void 0,
        },
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
                trigger: this.trigger || (isPopper && "click"),
                always: this.always,
                delay: this.delay,
                onchange: this.handleChange,
                responsive: this.responsive === void 0 && isPopper ? true : this.responsive,
                ...this.$attrs,
            }
        },
    },
    methods: {
        getReference() {
            if (this.reference instanceof HTMLElement) return this.reference
            return (this.$parent.$refs || {})[this.reference] || getElement(this.reference)
        },
        handleChange(...args) {
            this.$emit("on-visible-change", ...args)
        },
    },
}
</script>
