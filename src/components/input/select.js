import InputMixin from './index'
import { validVal } from "../../utils/tool";
export default {
    name: 'Select',
    componentName: 'Select',
    mixins: [InputMixin],
    computed: {
        isSelect() {
            return true
        },
    },
    methods: {
        handleBlur(event, inputDom) {
            if (!this.isReadonly && this.filterable) this.handleInputModel(inputDom.value);
            this.$nextTick(() => {
                this.$emit("on-change", this.model, this.__attachData);
                this.$emit("on-blur", this.model, this.__attachData);
                this.__attachData = "";
                this.handleDispatch("on-validate", this.model, 'blur');
            });
        },
        handleInputModel(value) {
            const isValid = validVal(value);
            const bool = isValid && this.$refs.options && this.$refs.options.getMatchedOpt(value, true)
            if (bool) return;
            if (this.multiple) {
                this.valueText = this.getValueText();
                this.__attachData = this.$refs.inputBase.getInputDom().value = "";
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