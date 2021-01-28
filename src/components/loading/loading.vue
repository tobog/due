<template>
    <transition name="fade">
        <div v-if="visible" :class="classes">
            <Icons v-if="closable" :class="[_tobogPrefix_ + '-close']" @click.native="close" type="ios-close"></Icons>
            <slot>
                <svg viewBox="25 25 50 50" :class="[_tobogPrefix_ + '-icon']">
                    <circle cx="50" cy="50" r="20" fill="none" :class="[_tobogPrefix_ + '-icon-circle']"></circle>
                </svg>
            </slot>
            <slot name="text">{{ text }}</slot>
        </div>
    </transition>
</template>
<script>
import Icons from "../icons/index"
import { getElement } from "../../utils/dom"
export default {
    name: "Loading",
    inheritAttrs: false,
    components: {
        Icons,
    },
    props: {
        fix: Boolean,
        fullscreen: Boolean,
        loading: Boolean,
        closable: Boolean,
        delay: Number,
        target: [String, Element],
        text: String,
        lock: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            visible: false,
            hasTarget: false,
        }
    },
    mounted() {
        if (this.target) {
            const target = getElement(this.target)
            if (target instanceof HTMLElement) {
                this.hasTarget = true
                this.__preParentNode = this.$el.parentNode
                target.appendChild(this.$el)
            }
        }
        this.visible = this.loading
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-fix`]: this.fix || this.fullscreen || this.hasTarget,
                    [`${_tobogPrefix_}-fullscreen`]: this.fullscreen,
                },
            ]
        },
    },
    methods: {
        close() {
            this.visible = false
            this.$emit("on-close")
            if (typeof this.$options.destroy === "function" && this.$attrs.__pattern === "js") {
                this.$options.destroy()
            }
        },
        handleOverflow(val) {
            debugger
            if (
                (!this.lock && !this.__isOverflowed) ||
                !((val && !this.__isOverflowed) || (!val && this.__isOverflowed)) ||
                !this._isMounted
            ) {
                return
            }
            this.__offsetParent = this.__offsetParent || this.$el.offsetParent || document.body
            if (!this.__offsetParent) return
            const dataset = this.__offsetParent.dataset,
                overflowIndex = parseInt(dataset.overflowIndex || 0),
                style = this.__offsetParent.style,
                originOverflow = dataset.originOverflow
            if (val) {
                this.__isOverflowed = true
                dataset.overflowIndex = overflowIndex + 1
                if (originOverflow == void 0) dataset.originOverflow = style.overflow || ""
                style.overflow = "hidden"
                return
            }
            this.__isOverflowed = false
            if (overflowIndex < 2) {
                style.overflow = originOverflow
                delete dataset.originOverflow
                delete dataset.overflowIndex
                return
            }
            dataset.overflowIndex = overflowIndex - 1
        },
    },
    watch: {
        visible(val) {
            if (!this.__isInserted) {
                this.$nextTick(() => {
                    this.__isInserted = true
                    this.handleOverflow(val)
                })
            } else {
                this.handleOverflow(val)
            }
        },
        loading(val) {
            val = !!val
            clearTimeout(this.__timeout)
            if (!val && this.delay > 0) {
                this.__timeout = setTimeout(() => {
                    this.visible = val
                    this.__timeout = null
                }, this.delay)
            } else {
                this.visible = val
            }
        },
    },
    beforeDestroy() {
        if (this.hasTarget) {
            this.__preParentNode && this.__preParentNode.appendChild(this.$el)
            this.__preParentNode = null
        }
        clearTimeout(this.__timeout)
        this.visible && this.handleOverflow(false)
        this.__timeout = null
    },
}
</script>
