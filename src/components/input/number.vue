<template>
    <section :class="wrapClasses" :data-vue-module="$options.name">
        <aside v-if="prepend" ref="prepend" :class="[_tobogPrefix_ + '-prepend']">
            <slot name="prepend"></slot>
        </aside>
        <div
            :class="innerClasses"
            data-form="number"
            :tabindex="_uid"
            @focusin="handleFocusin"
            @focusout="handleFocusout"
        >
            <span
                v-if="controls && splitControls"
                :class="[_tobogPrefix_ + '-decrease']"
                @click.stop="handleIconClick('down')"
                >-</span
            >
            <span v-if="showPrefix" :class="[_tobogPrefix_ + '-prefix']">
                <slot name="prefix">
                    <Icons :type="prefix" center />
                </slot>
            </span>
            <input
                ref="input"
                type="text"
                :value="valueFormat"
                :class="[_tobogPrefix_]"
                :disabled="disabled"
                :readonly="readonly"
                :placeholder="placeholder"
                @focus="handleFocusin"
                @input.prevent="handleTextInput"
                @textInput.prevent="handleTextInput"
                @keydown="handleKeyCode"
                @mousewheel.prevent="handleScrollStep"
            />
            <input
                style="display:none;"
                :class="[_tobogPrefix_ + '-hidden']"
                type="number"
                :name="name"
                :value="model"
                :step="step"
                :max="max"
                :min="min"
                v-bind="$attrs"
            />
            <Icons
                v-if="isClearable"
                :class="[_tobogPrefix_ + `-clearicon`]"
                type="close-circle"
                center
                @click.stop="handleClear"
            />
            <span
                v-if="controls && splitControls"
                :class="[_tobogPrefix_ + '-increase']"
                @click.stop="handleIconClick('up')"
                >+</span
            >
            <span v-if="controls && !splitControls" :class="[_tobogPrefix_ + '-suffix']">
                <Icons :data-max="isMax" type="ios-arrow-up" @click.stop="handleIconClick('up')" />
                <Icons :data-min="isMin" type="ios-arrow-down" @click.stop="handleIconClick('down')" />
            </span>
        </div>
        <aside v-if="append" :class="[_tobogPrefix_ + '-append']">
            <slot name="append"></slot>
        </aside>
    </section>
</template>

<script>
import Icons from '../icons/index';
import mixin from './base/mixin';
import { parseNumber, validVal } from '../../utils/tool';
export default {
    name: 'Number',
    inheritAttrs: false,
    mixins: [mixin],
    components: {
        Icons,
    },
    props: {
        value: [Number, String],
        formatter: Function,
        precision: Number,
        math: String,
        min: Number,
        max: Number,
        step: {
            type: Number,
            default: 1,
        },
        radix: {
            type: Number,
            default: 1,
        },
        scroll: Boolean,
        placeholder: String,
        controls: {
            type: Boolean,
            default: true,
        },
        splitControls: Boolean, // both
    },
    data() {
        return {
            valueFormat: '',
            model: '',
            isActive: false,
        };
    },
    mounted() {
        this.handleDispatch('on-change', this.model);
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    // [`${_tobogPrefix_}-collapse`]: this.collapse > 0,
                    [`${_tobogPrefix_}-active`]: this.isActive,
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
                },
            ];
        },
        isClearable() {
            return !this.isReadonly && this.clearable && validVal(this.model);
        },
        getRadix() {
            return parseNumber(this.radix) || 1;
        },
        getStep() {
            return parseNumber(this.step) || 1;
        },
        isMin() {
            return !!(validVal(this.min) && this.min >= this.model / this.getRadix);
        },
        isMax() {
            return !!(validVal(this.max) && this.max <= this.model / this.getRadix);
        },
    },
    methods: {
        handleScrollStep(e) {
            if (!this.scroll) return;
            this.handleIconClick(e.wheelDelta > 0 ? 'up' : 'down');
        },
        setValueFormat(val) {
            const ref = this.$refs.input || {};
            this.valueFormat = ref.value = val;
        },
        handleFocusin(event) {
            if (this.__blurStatus) {
                clearTimeout(this.__blurTimeOut);
                this.__blurStatus = false;
            }
            console.log(event.target, 'handleFocusin');
            this.isActive = true;
            if (this.__isFocused) return;
            this.__isFocused = true;
            this.$emit('on-focus', this.model, event);
        },
        handleFocusout(event) {
            this.__blurStatus = true;
            console.log(event.target, 'handleFocusout');
            clearTimeout(this.__blurTimeOut);
            this.__blurTimeOut = setTimeout(() => {
                console.log('handleFocusout =========');
                this.isActive = this.__isFocused = false;
                this.handleChange(event);
                this.handleDispatch('on-validate', this.model);
                this.$emit('on-blur', this.model, event);
            }, 10);
        },
        handleTextInput(event) {
            let valueFormat = this.valueFormat + '';
            const target = event.target,
                data = event.data || '',
                type = event.type,
                curpos = target.selectionStart,
                curposEnd = target.selectionEnd,
                isValid = validVal(data);
            // value = target.value;
            // event.preventDefault();
            if (curposEnd != curpos) {
                valueFormat = valueFormat.slice(0, curpos) + valueFormat.slice(curposEnd);
            }
            if (isValid) {
                const isPlus = data === '+',
                    isMinus = data === '-',
                    isDecimal = data === '.';
                const isSpecilChar = isPlus || isMinus || isDecimal;
                const len = valueFormat.length;
                if (data == '0' && len == curpos && len > 0) {
                    const index = valueFormat.indexOf('.');
                    if (index != -1 && curpos > index) {
                        this.setValueFormat(valueFormat + '0');
                        return;
                    }
                }
                if (isSpecilChar && valueFormat.indexOf(data) > -1) {
                    this.setValueFormat(valueFormat);
                    return;
                }
                if (isSpecilChar && len == 0) {
                    this.setValueFormat(data);
                    return;
                }
                if ((isPlus || isMinus) && curpos != 0) {
                    this.setValueFormat(valueFormat);
                    return;
                }
                if (isDecimal && len == curpos) {
                    this.setValueFormat(valueFormat + '.');
                    return;
                }
                if (!/^\.|-|\+|(\d+)$/.test(data)) {
                    this.setValueFormat(valueFormat);
                    return;
                }
            }
            if (isValid && type === 'textInput') {
                const newValue = this.getNewValue(valueFormat, curpos, data);
                this.updateModel(isNaN(newValue) ? '' : newValue);
                this.$nextTick(() => {
                    target.selectionEnd = target.selectionStart = curpos + `${data}`.length;
                });
                return;
            }
            if (!data) {
                const newValue = this.getNewValue(target.value);
                this.updateModel(newValue);
            }
        },
        handleChange(event) {
            const value = this.pipeMaxMin(this.model, true);
            this.updateModel(validVal(value) ? value / this.getRadix : '');
            this.$emit('on-change', this.model, event);
        },
        handleClear() {
            if (this.isReadonly) return;
            this.updateModel('');
        },
        handleKeyCode(event) {
            this.$nextTick(() => {
                this.$emit(event.keyCode == 13 ? 'on-enter' : 'on-keydown', this.model, event);
            });
        },
        getNewValue(text = '', curpos = 0, insertVal = '') {
            const startText = text.substring(0, curpos).replace(/[^-\+\d\.]+/g, ''),
                endText = text.substring(curpos).replace(/[^-\+\d\.]+/g, '');
            return startText + insertVal + endText;
        },
        handleFormatter(val) {
            //真实值转化显示值
            const resultRadix = this.resultRadix(val);
            return typeof this.formatter === 'function' ? this.formatter(resultRadix, val) : resultRadix;
        },
        pipeMath(val) {
            const math = Math[this.math];
            return math ? math(val) : val;
        },
        pipePrecision(val) {
            return validVal(this.precision) ? parseFloat(val).toFixed(this.precision) : val;
        },
        pipeMaxMin(val, isMin) {
            const min = this.min,
                max = this.max;
            console.log(max, '1');
            if (validVal(max) && max < val) return parseFloat(max);
            if (isMin && validVal(min) && min > val) return parseFloat(min);
            return val;
        },
        pips(val) {
            val = this.pipePrecision(val);
            return this.pipeMath(val);
        },
        //除数结果
        resultRadix(val) {
            val = val / this.getRadix;
            return this.pips(val);
        },
        updateModel(val) {
            //表现值转化为model真实值
            if (!validVal(val)) {
                this.model = '';
                this.setValueFormat('');
            } else {
                // console.log(val)
                val = val * this.getRadix;
                if (val == this.model && this.model !== '') return;
                val = this.pips(val);
                val = this.pipeMaxMin(val);
                this.model = val;
                this.setValueFormat(this.handleFormatter(val));
            }
            this.$emit('input', val);
            this.handleDispatch('on-change', val);
        },
        updateValueFormat(val) {
            if (!validVal(val)) {
                this.model = '';
                this.setValueFormat('');
                return;
            }
            if (val == this.model) return;
            let value = parseFloat(val);
            if (value == val) {
                value = this.pips(value);
                value = this.pipeMaxMin(value);
                this.model = value;
                this.setValueFormat(this.handleFormatter(value));
                this.$emit('input', value);
                this.handleDispatch('on-change', value);
            }
        },
        handleIconClick(type) {
            if (this.isReadonly) return;
            let step = this.getStep;
            step = type === 'up' ? step : -step;
            let val = step + this.model / this.getRadix;
            // val = this.pipeMaxMin(val, true);
            this.updateModel(val);
        },
    },
    beforeDestroy() {
        clearTimeout(this.__blurTimeOut);
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                this.updateValueFormat(val);
            },
        },
        max() {
            this.updateValueFormat(this.value);
        },
        min() {
            this.updateValueFormat(this.value);
        },
    },
};
</script>
