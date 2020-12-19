import {unit} from "../../utils/tool"

export default {
    props: {
        fixed: Boolean,
        height: {
            type: [Number, String],
            default: 60,
        },
    },
    data() {
        return {
            left: 0,
            right: 0,
        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-fixed`]: this.fixed,
                },
            ]
        },
        getStyle() {
            let style = {},
                height = this.height
            if (height && height != 60 && height != "60px") style.height = height !== "auto" ? unit(height) : height
            if (this.left) style.paddingLeft = this.left + "px"
            if (this.right) style.paddingRight = this.right + "px"
            return style
        },
    },
    methods: {
        getHeight() {
            let isUnit = /^[0-9\.\s]+(px)?$/gi.test(this.height)
            if (isUnit) return parseInt(this.height)
            return this.$el && this.$el.offsetHeight
        },
        refresh() {
            if (this.$parent && this.$parent.$options.name === "Layout" && typeof this.$parent.init === "function") {
                this.$parent.init(true)
            }
        },
    },
    watch: {
        fixed() {
            this.refresh()
        },
        height() {
            this.refresh()
        },
    },
    beforeDestroy() {
        this.refresh()
    },
}
