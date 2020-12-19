import InputMixin from './index'
import { validVal } from "../../utils/tool";
export default {
    name: 'Select',
    mixins: [InputMixin],
    computed: {
        isSelect() {
            return true
        },
        showSuffix() {
            return false
        },
        isInput() {
            return this.filterable || this.search;
        },
        hasValidOpts() {
            const hasTip = this.$slots.tip || this.tip;
            return hasTip && this.optComponents.length && !this.optComponents.some(item => !item.hidden);
        },
    },
    methods: {
        handleBlur() {
            if (!this.$refs.inputDrop.isActive) return;
            if (!this.isReadonly) this.handleModel(this.getInputDom().value);
            this.$nextTick(() => {
                this.$emit("on-change", this.model, this.__attachData);
                this.$emit("on-blur", this.model, this.__attachData);
                this.close(true);
            });
        },
        handleModel(value) {
            const isValid = validVal(value);
            const component = isValid && this.getMatchedOpt(value, true);
            if (component) return;
            if (this.multiple) {
                this.valueText = this.getValueText();
                this.__attachData = this.getInputDom().value = "";
                return;
            }
            if (isValid) {
                this.valueText = this.getValueText();
            } else {
                this.updateModel("");
            }
        },
       
    },
}