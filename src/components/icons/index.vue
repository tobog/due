<template>
    <i :class="classes" :style="getStyles" :data-vue-module="$options.name" v-on="$listeners">
        <img
            v-if="isHttpIcon && !isError"
            v-show="!showLoading"
            :class="[_tobogPrefix_ + '-img']"
            :src="type"
            :alt="type"
            @load="handleSuccess"
            @error="handleError"
        />
        <template v-if="isError">
            <slot name="fallback">
                <img v-if="isHttpErrorIcon" :class="[_tobogPrefix_ + '-img']" :src="fallback" :alt="fallback" data-type="'fallback'" />
            </slot>
        </template>
        <template v-else-if="(isHttpLoadingIcon || $slots.loading) && isLoading">
            <slot name="loading">
                <img :class="[_tobogPrefix_ + '-img']" :src="loading" :alt="loading" data-type="'loading'" />
            </slot>
        </template>
        <slot></slot>
    </i>
</template>

<script>
import {unit} from "../../utils/tool"
export default {
    name: "Icons",
    componentName: "Icons",
    props: {
        type: String,
        size: [Number, String],
        color: String,
        center: Boolean,
        fit: String, //fill,contain,cover,none,scale-down,
        fallback: String,
        loading: {
            type: [Boolean, String],
            default: true,
        },
    },
    data() {
        return {
            isError: false,
            isLoading: true,
        }
    },
    watch: {
        type() {
            this.isError = false
        },
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const innerType = this.type && !this.isHttpIcon
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-loading`]:
                        this.type && this.loading && this.isLoading && !innerType && !this.isHttpLoadingIcon,
                    [`${_tobogPrefix_}-${this.type}`]: innerType && !this.isError,
                    [`${_tobogPrefix_}-httpicon`]: this.isHttpIcon,
                    [`${_tobogPrefix_}-center`]: this.center,
                    [`${_tobogPrefix_}-fit-${this.fit}`]: !!this.fit,
                    [`${_tobogPrefix_}-fallback`]: this.isError,
                    [`${_tobogPrefix_}-${this.fallback}`]: this.isError && !this.isHttpErrorIcon && this.fallback && !this.$slots.fallback,
                    [`${_tobogPrefix_}-loadback`]: !innerType && this.showLoading,
                },
            ]
        },
        isHttpIcon() {
            return /^(https?:\/\/|\.?\/|data:image\/)\w+/.test(this.type || "")
        },
        isHttpErrorIcon() {
            return /^(https?:\/\/|\.?\/|data:image\/)\w+/.test(this.fallback || "")
        },
        isHttpLoadingIcon() {
            return /^(https?:\/\/|\.?\/|data:image\/)\w+/.test(this.loading || "")
        },
        showLoading() {
            return (this.loading || this.$slots.loading) && this.isLoading
        },
        getStyles() {
            let style = {}
            if (this.size) style["fontSize"] = unit(this.size, "px")
            if (this.color) style.color = this.color
            return style
        },
    },
    methods: {
        handleSuccess(e) {
            this.isError = this.isLoading = false;
            this.$emit("on-success", e)
        },
        handleError(e) {
            this.isLoading = false
            this.isError = !!(this.fallback || this.$slots.fallback)
            this.$emit("on-error", e)
        },
    },
}
</script>
