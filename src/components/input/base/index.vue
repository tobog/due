<template>
    <div :class="classes" :data-vue-module="dataVueModule || $options.name">
        <div v-if="prepend" :class="[_tobogPrefix_ + '-prepend']">
            <slot name="prepend"></slot>
        </div>
        <div
            ref="inputInner"
            data-form="input"
            :tabindex="_uid"
            :class="innerClasses"
            @focusin="handleFocus"
            @focusout="handleBlur"
            @click="handleClick"
        >
            <span v-if="showPrefix" :class="[_tobogPrefix_ + '-prefix']">
                <slot name="prefix">
                    <Icons :type="prefix" center />
                </slot>
            </span>
            <div v-if="multiple" :class="[_tobogPrefix_ + '-tags']" @click.self="handleFileClick">
                <slot name="tags" :value="value" :clearTag="clearTag">
                    <span
                        v-for="(val, index) in value"
                        :class="[_tobogPrefix_ + '-tag']"
                        :key="index"
                        :data-hidden="collapse && index >= collapse"
                    >
                        <span>{{ val }}</span>
                        <Icons
                            v-if="!(disabled || readonly)"
                            :class="[_tobogPrefix_ + '-tag-clear']"
                            type="close-circle"
                            tabindex="-1"
                            @focusin.stop="clearTag(index)"
                        ></Icons>
                    </span>
                    <span v-if="collapse && value && value.length > collapse" :class="[_tobogPrefix_ + '-tag']"
                        >&nbsp;+&nbsp;{{ value.length - collapse }}&nbsp;</span
                    >
                </slot>
                <input
                    ref="input"
                    :type="isPassword ? 'text' : type"
                    :name="type === 'file' ? name : null"
                    :class="[_tobogPrefix_]"
                    :disabled="disabled"
                    :multiple="multiple"
                    :readonly="readonly || !isInput"
                    @input="handleInput"
                    @keydown="handleKeydown"
                    @change="handleChange"
                    @paste.stop.prevent="handleMultiPaste"
                    v-bind="$attrs"
                />
            </div>
            <input
                v-else
                ref="input"
                :value="value"
                :type="isPassword ? 'text' : type"
                :name="type === 'file' ? name : null"
                :class="[_tobogPrefix_]"
                :disabled="disabled"
                :multiple="multiple"
                :readonly="readonly || !isInput"
                @input="handleInput"
                @keydown="handleKeydown"
                @change="handleChange"
                @paste.stop.prevent="handleMultiPaste"
                v-bind="$attrs"
            />
            <div v-if="type === 'file' && !multiple" :class="[_tobogPrefix_ + '-tags']" @click.stop="handleFileClick">
                {{ value }}
            </div>
            <span v-if="+maxLength > 0" :class="[_tobogPrefix_ + '-length']"
                >{{ value | filterLength }}&nbsp;/&nbsp;{{ maxLength }}</span
            >
            <Icons
                v-if="isClearable"
                :class="[_tobogPrefix_ + `-clearicon`]"
                type="close-circle"
                center
                tabindex="-1"
                @focusin.stop="handleClear"
            />
            <Icons
                v-if="showPassword && type === 'password'"
                @click.stop="isPassword = !isPassword"
                :class="[_tobogPrefix_ + '-eyeicon']"
                :type="isPassword ? 'eye-off' : 'eye'"
                center
            />
            <Icons v-if="type !== 'password'" :class="[_tobogPrefix_ + '-arrowicon']" type="arrow-dropdown" center />
            <span v-if="showSuffix" :class="[_tobogPrefix_ + '-suffix']" @click="handleIconClick">
                <slot name="suffix">
                    <Icons :type="suffix" center />
                </slot>
            </span>
        </div>
        <div v-if="append" :class="[_tobogPrefix_ + '-append']">
            <slot name="append"></slot>
        </div>
        <input type="hidden" v-if="!type === 'file' && (name || name == '0')" :name="name" :value="getInputValStr" />
    </div>
</template>
<script>
import mixin from "./mixin";
import Icons from "../../icons/index";
export default {
    name: "InputBase",
    componentName: "InputBase",
    inheritAttrs: false,
    mixins: [mixin],
    components: {
        Icons,
    },
    props: {
        dataVueModule: String,
        valueData: [String, Number, Array, Boolean, Object],
        active: Boolean,
        showPassword: Boolean,
        isInput: Boolean,
    },
    data() {
        return {
            isActive: false,
            isPassword: false,
        };
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-collapse`]: this.collapse > 0,
                    [`${_tobogPrefix_}-active`]: this.isActive || this.active,
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                    [`${_tobogPrefix_}-clear`]: this.isClearable,
                },
            ];
        },
        innerClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-inner`,
                {
                    [`${_tobogPrefix_}-radius-left`]: !this.prepend,
                    [`${_tobogPrefix_}-radius-right`]: !this.append,
                    [`${_tobogPrefix_}-file`]: this.type === "file",
                },
            ];
        },
        getInputValStr() {
            try {
                return JSON.stringify(this.valueData === void 0 ? this.value : this.valueData);
            } catch (error) {
                return "";
            }
        },
    },
    filters: {
        filterLength(val) {
            return Array.isArray(val) ? val.length : `${val}`.length;
        },
    },
    methods: {
        handleFocus(event) {
            console.log(this);
            // console.log("handleFocus");
            this.isActive = true;
            clearTimeout(this.__blurTimeOut);
            this.__isBlur = this.__blurEvent = null;
            if (this.__isFocused) return;
            if (event.target !== this.$refs.input) this.setInputFocus();
            this.__isFocused = true;
            this.$emit("on-focus", event);
        },
        setInputFocus() {
            clearTimeout(this.__blurTimeOut);
            this.isActive = true;
            this.$refs.input.focus();
        },
        handleBlur(event) {
            // console.log(event, "*******");
            clearTimeout(this.__blurTimeOut);
            if (!this.isActive) return;
            this.__blurTimeOut = setTimeout(() => {
                if (this.active) {
                    // 阻止drop 没有消失下失去焦点事件
                    this.__blurEvent = event;
                    this.__isBlur = true;
                    return;
                }
                // console.log(this.$refs.input, "===================");
                this.isActive = this.__isFocused = false;
                this.__blurEvent = this.__isBlur = null;
                this.$emit("on-blur", event, this.$refs.input);
            }, 20);
        },
        handleClick(event) {
            this.$emit("on-click", event);
        },
        handleInput(event) {
            if (this.isReadonly || !this.isInput || [13, 40, 27, 38].indexOf(event.keyCode) > -1) return;
            this.$emit("on-input", event);
        },
        handleKeydown(event) {
            if (this.isReadonly || !this.isActive) return;
            this.$emit("on-keydown", event);
        },
        handleChange(event) {
            this.$emit("on-change", event);
        },
        handleMultiPaste(event) {
            event = event || window.event;
            const data = event.clipboardData.getData("Text") || window.clipboardData.getData("Text"),
                target = event.target,
                curpos = target.selectionStart,
                curposEnd = target.selectionEnd,
                value = target.value || "";
            target.value = curpos == void 0 ? data : value.substring(0, curpos) + data + value.substring(curposEnd);
            this.handleInput(event, "paste");
        },
        handleClear() {
            this.setInputFocus();
            this.$emit("on-clear");
        },
        clearTag(index) {
            this.$emit("on-remove-item", index);
            this.setInputFocus();
        },
        handleIconClick(event) {
            this.$emit("on-icon-click", event);
        },
        getInputDom() {
            return this.$refs.input;
        },
        handleFileClick() {
            this.type === "file" && this.$refs.input.click();
        },
    },
    watch: {
        active(val) {
            if (!val && this.__isBlur) {
                // 点击外边区域 先发生blur在消失
                this.handleBlur(this.__blurEvent);
            }
        },
    },
    beforeDestroy() {
        clearTimeout(this.__blurTimeOut);
    },
};
</script>
