import compRender from "./renderfn";
export default {
    inheritAttrs: false,
    props: {
        formdata: Array,
        value: Object,
        align: String,
        col: Number
    },
    components: {
        compRender
    },
    methods: {
        handleVisible(item) {
            return item.show !== false && item.span != '0';
        },
        isGroupFormChild(tag = '') {
            return ['vRadio', 'vCheckbox', 'vCheckBox', 'Radio', 'Checkbox'].indexOf(tag) > -1
        },
        getColProps(item) {
            let { align, span, offset } = item;
            if (span === undefined) {
                span = parseInt(24 / (parseInt(this.col) || 2));
            }
            if (offset === undefined) {
                const offsetMap = {
                    left: 0,
                    right: parseInt(24 - span),
                    center: parseInt((24 - span) / 2)
                };
                offset = offsetMap[align || this.align || "left"] || 0;
            }
            return {
                span,
                offset
            };
        },
    }
};
