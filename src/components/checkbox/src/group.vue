<template>
    <section :class="classes" :data-vue-module="$options.name">
        <slot>
            <template v-if="hasOpts">
                <CheckBox v-for="opt in options" :key="opt.value" v-bind="opt"></CheckBox>
            </template>
        </slot>
    </section>
</template>

<script>
import emitter from '../../../utils/emitter';
import CheckBox from './index';
export default {
    name: 'CheckBoxGroup',
    componentName: 'CheckBoxGroup',
    model: {
        prop: "value",
        event: '"on-change',
    },
    mixins: [emitter],
    components: { CheckBox },
    props: {
        value: {
            type: Array,
            default() {
                return [];
            },
        },
        options: Array,
        // disabled: Boolean,
        // border: Boolean,
        readonly: Boolean,
        // strict: Boolean,
        size: [String, Number],
        // radio: Boolean,
        // reverse: Boolean,
        // ghost: Boolean,
        theme: String,
        // color: String,
        min: [Number, String], // 仅是组合
        max: [Number, String],
    },
    data() {
        return {
            model: this.value || [],
        };
    },
    created() {
        this.handleDispatch('on-change', this.model);
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                if (val === this.model) return;
                this.model = val;
            },
        },
        model: {
            deep: true,
            handler(val) {
                if (this.readonly) return;
                this.$emit('on-change', val);
                this.handleDispatch('on-change', val);
                this.handleDispatch('on-validate', val,'change');
            },
        },
    },
    computed: {
        getMinMax() {
            let min = parseInt(this.min);
            let max = parseInt(this.max);
            min = min >= 0 ? min : 0;
            max = max >= 0 ? max : 0;
            return [min, max];
        },
        hasOpts() {
            return Array.isArray(this.options) && this.options.length;
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                },
            ];
        },
    },
    methods: {
        handleModel(bool, val) {
            let [min, max] = this.getMinMax,
                length = this.model.length;
            if (min >= 1 && max >= 1 && min > max) {
                min = 0;
            }
            if (bool) {
                if (length >= max) {
                    this.model = this.model.slice(0, max);
                } else {
                    this.model.push(val);
                }
            } else {
                if (length <= min) {
                    this.model = this.model.slice(0);
                } else {
                    this.model.splice(val, 1);
                }
            }
        },
        handleChange(event) {
            this.$emit('on-change', this.model, event);
            this.handleDispatch('on-validate', this.model,'change');
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args);
            } else {
                this.__parentComponent__ = this.dispatch('FormItem', ...args);
            }
        },
    },
};
</script>
