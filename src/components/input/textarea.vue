<template>
    <section :class="classes" :data-vue-module="$options.name">
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
                @focusin="handleFocus"
                @keydown="handleKeyCode"
                @input="handleInput"
                v-bind="$attrs"
            />
            <span v-if="maxLength > 0 && showWordCount" :class="[_tobogPrefix_ + '-length']">
                {{ value | filterLength }}&nbsp;/&nbsp;{{ maxLength }}
            </span>
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
import Icons from "../icons/src/index"
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
    filters: {
        filterLength(val) {
            return Array.isArray(val) ? val.length : `${val}`.length
        },
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const theme = this.getGlobalData("theme")
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
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
        handleInput(event) {
            if (this.maxLength > 0) {
                this.model= event.target.value = `${this.model}`.slice(0, this.maxLength)
            };
        },
        handleKeyCode(event) {
            this.$emit("on-keydown", this.model, event);
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
                this.handleDispatch("on-validate", this.model,'blur')
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
                if(val === this.model) return;
                this.model = val;
            },
        },
        model(val) {
            this.$emit("input", val)
            this.handleDispatch("on-change", val)
        },
    },
}
</script>
