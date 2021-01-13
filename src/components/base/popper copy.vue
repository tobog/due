<template>
    <transition name="fade" appear :data-vue-module="$options.name">
        <div ref="popper" :class="[_tobogPrefix_]">
            <span :class="[_tobogPrefix_ + '-arrow']" data-arrow="true"></span>
            <slot>{{ content }}</slot>
        </div>
    </transition>
</template>
<script>
import Popper from "../../utils/popper"
export default {
    name: "Popper",
    props: {
        reference: [String, HTMLElement],
        placement: {
            type: String, //top,left,bottom,right,center，fix
            default: "bottom-left",
        },
        content: {
            type: String,
            default: "",
        },
        transfer: {
            type: Boolean,
            default: false,
        },
        offset: {
            type: [String, Number],
            default: 5,
        },
        delay: Number,
        gpu: {
            type: Boolean,
            default: true,
        },
        trigger: {
            type: String,
            default: "click", //click hover,other
        },
        always: Boolean,
        responsive: {
            type: Boolean,
            default: true,
        },
    },
    mounted() {
        this.initPopper()
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-gpu`]: this.gpu,
                },
            ]
        },
        getReference() {
            if (this.reference instanceof HTMLElement) return this.reference
            return (this.$parent.$refs || {})[this.reference]
        },
        options() {
            return {
                placement: this.placement,
                offset: this.offset,
                gpu: this.gpu,
                transfer: this.transfer,
                trigger: this.trigger,
                always: this.always,
                delay: this.delay,
                onchange: this.handleChange,
                responsive: this.responsive,
            }
        },
    },
    watch: {
        options() {
            this.updatePopper()
        },
        getReference() {
            this.updatePopper()
        },
    },
    methods: {
        initPopper() {
            this.$nextTick(() => {
                if (this._Popper) return
                this._Popper = new Popper(this.getReference, this.$el, this.options)
                if (this.always) {
                    this._Popper.toggle(true)
                }
            })
        },
        handleChange(...args) {
            this.$emit("on-visible-change", ...args)
        },
        updatePopper() {
            if (!this._isMounted) return
            this._Popper && this._Popper.update(this.getReference, this.$el, this.options)
        },
    },
    beforeDestroy() {
        this._Popper && this._Popper.destroy()
        this._Popper = null
    },
}
</script>
