<template>
    <ul :class="classes" :data-vue-module="$options.name">
        <slot></slot>
    </ul>
</template>
<script>
import globalMixin from "../../mixins/global"
import {isParseNumber} from "../../utils/tool"
export default {
    name: "Collapse",
    componentName: "Collapse",
    mixins: [globalMixin],
    model: {
        prop: "value",
        event: "on-change",
    },
    props: {
        accordion: Boolean,
        value: [Array, String, Number],
        strict: Boolean,
        simple: Boolean,
        size: String,
        // theme:String
    },
    data() {
        return {
            model: this.value,
        }
    },
    mounted() {
        this.setActive()
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_,
                size = this.getGlobalData("size")
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-simple`]: this.simple,
                    [`${_tobogPrefix_}-size-${size}`]: size && !isParseNumber(size),
                    // [`${_tobogPrefix_}-theme-${this.theme}`]: this.theme,
                },
            ]
        },
    },
    methods: {
        setActive() {
            const value = Array.isArray(this.model) ? this.model : this.model || this.model === 0 ? [this.model] : []
            this.$children.forEach((child, index) => {
                let name = child.name
                if (name == null) name = child._index = index
                child.isActive = value.some((val) => (this.strict ? val === name : val == name))
            })
        },
        toggle(data) {
            const name = data.name
            let value = Array.isArray(this.model) ? this.model : this.model || this.model === 0 ? [this.model] : []
            if (!this.accordion) {
                const nameIndex = value.findIndex((val) => (this.strict ? val === name : val == name))
                if (nameIndex > -1) {
                    value.splice(nameIndex, 1)
                } else {
                    value.push(name)
                }
            } else {
                value = data.isActive ? [] : [name]
            }
            this.model = value
            this.$emit("on-change", value)
        },
    },
    watch: {
        value(val) {
            if (val === this.model) return
            this.model = val
        },
        model() {
            this.setActive()
        },
    },
}
</script>
