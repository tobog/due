
import { validVal } from '../../../utils/tool';
import Emitter from '../../../utils/emitter';
import langMinix from '../../../mixins/lang'
export default {
    mixins: [Emitter, langMinix],
    props: {
        type: {
            type: String,
            default: 'text',
        },
        dataVueModule: String,
        value: [String, Array,Number],
        multiple: Boolean,
        name: String,
        suffix: String,
        prefix: String,
        clearable: Boolean,
        readonly: Boolean,
        disabled: Boolean,
        theme: String,
        size: [String, Number],
        collapse: {
            type: [Boolean, Number],
            default: 0,
        },
    },
    data() {
        return {
            ready: false,
        }
    },
    computed: {
        isReadonly() {
            return this.disabled || this.readonly
        },
        prepend() {
            return !!this.$slots.prepend;
        },
        append() {
            return !!this.$slots.append;
        },
        showSuffix() {
            return !!(this.suffix || this.$slots.suffix);
        },
        showPrefix() {
            return !!(this.prefix || this.$slots.prefix);
        },
        isClearable() {
            return (
                !this.isReadonly &&
                this.clearable &&
                (Array.isArray(this.value) ? this.value.length > 0 : validVal(this.value))
            );
        },
    },
    methods: {
        handleIconClick(event) {
            this.$emit('on-icon-click', this.model, event);
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args)
            } else {
                this.__parentComponent__ = this.dispatch('FormItem', ...args)
            }
        },
    },
}