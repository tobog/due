<template>
    <section :class="wrapClasses" :data-vue-module="$options.name">
        <aside v-if="prepend" ref="prepend" :class="[_tobogPrefix_ + '-prepend']">
            <slot name="prepend"></slot>
        </aside>
        <div :class="innerClasses" data-form="textarea" :tabindex="_uid" @focusin="handleFocus" @focusout="handleBlur">
            <span v-if="showPrefix" :class="[_tobogPrefix_ + '-prefix']">
                <slot name="prefix">
                    <Icons :type="prefix" center />
                </slot>
            </span>
            <textarea
                ref="input"
                v-model="model"
                :name="name"
                :class="[_tobogPrefix_]"
                :disabled="disabled"
                :readonly="readonly"
                :rows="rows"
                :cols="cols"
                @focusin="handleFocus"
                @keydown="handleKeyCode"
                v-bind="$attrs"
            />
            <Icons
                v-if="isClearable"
                :class="[_tobogPrefix_ + `-clearicon`]"
                type="close-circle"
                center
                @click.stop="handleClear"
            />
        </div>
        <aside v-if="append" :class="[_tobogPrefix_ + '-append']">
            <slot name="append"></slot>
        </aside>
    </section>
</template>

<script>
import {validVal} from "../../utils/tool"
import Icons from "../icons/index"
import mixin from "./base/mixin"
import globalMixin from "../../mixins/global"
export default {
    name: "Textarea",
    inheritAttrs: false,
    mixins: [mixin, globalMixin],
    components: {
        Icons,
    },
    props: {
        value: String,
        rows: {
            type: Number,
            default: 4,
        },
        cols: {
            type: Number,
            default: 28,
        },
    },
    data() {
        return {
            model: this.value,
            isActive: false,
        }
    },
    mounted() {
        this.handleDispatch("on-change", this.model)
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            const theme = this.getGlobalData("theme")
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    // [`${_tobogPrefix_}-collapse`]: this.collapse > 0,
                    [`${_tobogPrefix_}-active`]: this.isActive,
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                    [`${_tobogPrefix_}-clear`]: this.isClearable,
                },
            ]
        },
        innerClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-inner`,
                {
                    [`${_tobogPrefix_}-radius-left`]: !this.prepend,
                    [`${_tobogPrefix_}-radius-right`]: !this.append,
                },
            ]
        },
        isClearable() {
            return !this.isReadonly && this.clearable && validVal(this.model)
        },
    },
    methods: {
        handleClear() {
            this.model = ""
            this.$emit("on-clear")
        },
        handleFocus(event) {
            if (this.__blurStatus) {
                clearTimeout(this.__blurTimeOut)
                this.__blurStatus = false
            }
            this.isActive = true
            if (this._isFocused) return
            this._isFocused = false
            this.$emit("on-focus", this.model, event)
        },
        handleKeyCode(event) {
            this.$emit("on-keydown", this.model, event)
            if (event.keyCode == 13) {
                this.$emit("on-enter", this.model, event)
            }
        },
        handleBlur(event) {
            this.__blurStatus = true
            console.log(event.target, "handleFocusout")
            clearTimeout(this.__blurTimeOut)
            this.__blurTimeOut = setTimeout(() => {
                console.log("handleFocusout =========")
                this.isActive = this._isFocused = false
                this.$emit("on-change", this.model, event)
                this.$emit("on-blur", this.model, event)
                this.handleDispatch("on-validate", this.model)
            }, 10)
        },
    },
    beforeDestroy() {
        clearTimeout(this.__blurTimeOut)
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.model = val
            },
        },
        model(val) {
            this.$emit("input", val)
            this.handleDispatch("on-change", val)
        },
    },
}
</script>
