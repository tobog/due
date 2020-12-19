<style lang="scss">
// .demo-form-edit {
// }
</style>
<template>
    <vRow class="demo-form-edit">
        <template v-for="(item, index) in formdata">
            <vCol v-if="handleVisible(item)" :key="index" v-bind="getColProps(item)">
                <!-- <vTooltip v-bind="getPopperProps(item)"> -->
                <vFormItem v-bind="getFormItemProps(item)">
                    <compRender v-for="data in getFormChildData(item)" :key="data._key" v-bind="data" />
                </vFormItem>
                <!-- </vTooltip> -->
            </vCol>
        </template>
    </vRow>
</template>

<script>
import compRender from "./renderfn"
export default {
    inheritAttrs: false,
    props: {
        formdata: {
            type: Array,
            default() {
                return []
            },
        },
        value: Object,
        align: String,
        col: Number,
    },
    components: {
        compRender,
    },
    data() {
        return {
            formData: {},
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(val) {
                this.formData = val || {}
            },
        },
        formData: {
            deep: true,
            handler(val) {
                this.$emit("input", val)
            },
        },
    },
    created() {
        this.getFormData()
    },
    methods: {
        getPopperProps(item) {
            return {
                content: item.explain,
                gpu: false,
                class: "width-100per",
            }
        },
        handleVisible(item) {
            return item.dataType ? item.showConfig && item.span != "0" : item.show !== false && item.span != "0"
        },
        isGroupFormChild(tag = "") {
            return /(Radio|Checkbox)$/gi.test(tag)
        },
        getColProps(item) {
            let {align, span, offset} = item
            if (span === void 0) {
                span = parseInt(24 / (parseInt(this.col) || 2))
            }
            if (offset === void 0) {
                const offsetMap = {
                    left: 0,
                    right: parseInt(24 - span),
                    center: parseInt((24 - span) / 2),
                }
                offset = offsetMap[align || this.align || "left"] || 0
            }
            return {
                span,
                offset,
            }
        },
        getFormData() {
            if (!Array.isArray(this.formdata)) return
            const formData = {}
            this.formdata.forEach((item) => {
                if (!this.handleVisible(item)) return
                const {key, demoDefault: value} = item
                if (key && value !== void 0) {
                    formData[key] = value
                }
            })
            this.formData = formData
        },
        getFormItemProps(item) {
            const {label, key, inline, labelWidth = 150, formItem} = item
            return {
                label: `${label}(${key})`,
                inline,
                labelWidth,
                ...formItem,
            }
        },
        getFormChildData(item) {
            let {tag, props, key, style, children, options, on = {}, class: className} = item
            if (key) {
                props = Object.assign({clearable: true, scroll: true}, props, {
                    value: this.formData[key],
                })
                on.input = (val) => {
                    this.$set(this.formData, key, val)
                }
            }

            const hasOptions = Array.isArray(options)
            if (this.isGroupFormChild(tag)) {
                className = className || "margin-right-15"
                return hasOptions
                    ? options.map(function(item, index) {
                          return {
                              tag,
                              style,
                              class: className,
                              _key: index,
                              on,
                              attrs: {...props, ...item},
                              children,
                          }
                      })
                    : [
                          {
                              tag,
                              style,
                              class: className,
                              _key: 0,
                              on,
                              attrs: {...props},
                              children,
                          },
                      ]
            }
            if (hasOptions) {
                children = (h) => {
                    return options.map((item) => {
                        if (item !== null && typeof item !== "object") {
                            item = {value: item, label: item}
                        }
                        return h("vOption", {attrs: {...item}})
                    })
                }
            }
            return [
                {
                    tag: tag || "vInput",
                    style,
                    class: className,
                    _key: key,
                    on,
                    attrs: props,
                    children,
                },
            ]
        },
    },
}
</script>
