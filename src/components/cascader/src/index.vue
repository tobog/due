<template>
    <DropBase
        ref="dropBase"
        dropStyle="width:auto;"
        isOutRef
        isToggle
        :data-vue-module="$options.name"
        :transfer="transfer"
        :disabled="isReadonly"
        :class="[_tobogPrefix_ + '-wrapper']"
        :reference="ready ? $refs.inputBase.$refs.inputInner : null"
        v-model="visible"
        v-bind="popperConfig"
        @on-visible-change="handleVisible"
    >
        <InputBase
            ref="inputBase"
            type="text"
            :class="[_tobogPrefix_ + '-input']"
            :value="getValueText"
            :valueData="model"
            :prefix="prefix"
            :suffix="suffix"
            :readonly="readonly"
            :name="name"
            :clearable="clearable"
            :disabled="disabled"
            :theme="theme"
            :multiple="selection === 'multiple' || selection === 'lastMultiple'"
            :collapse="collapse"
            :active="visible"
            :size="size"
            :isInput="filterable"
            v-bind="$attrs"
            @hook:created="ready = true"
            @on-focus="handleFocus"
            @on-input="handleInput"
            @on-clear="handleClear"
            @on-remove-item="handleClearTag"
            @on-blur="handleBlur"
            @on-keydown="handleKeydown"
            @on-icon-click="handleIconClick"
        >
            <template v-if="prepend" slot="prepend">
                <slot name="prepend"></slot>
            </template>
            <template v-if="append" slot="append">
                <slot name="append"></slot>
            </template>
            <template v-if="showPrefix" slot="prefix">
                <slot name="prefix"></slot>
            </template>
            <template v-if="showSuffix" slot="suffix">
                <slot name="suffix"></slot>
            </template>
            <template v-if="$scopedSlots.tag" slot="tag" slot-scope="data">
                <slot name="tag" v-bind="data"></slot>
            </template>
        </InputBase>

        <Caspanel
            slot="drop"
            ref="caspanel"
            :class="[_tobogPrefix_ + '-caspanel']"
            :value="model"
            :data="data"
            :theme="theme"
            :size="size"
            :selection="selection"
            :trigger="trigger"
            :asyncData="asyncData"
            :render="render"
            :noDataText="noDataText"
            :propsMap="propsMap"
            @input="handleChange"
            @hook:created="updateValueText += 1"
            @on-updateDrop="updatedDrop"
        >
            <template v-if="$scopedSlots.default" slot-scope="data">
                <slot v-bind="data"></slot>
            </template>
        </Caspanel>
    </DropBase>
</template>

<script>
import DropBase from "../../base/dropBase"
import InputBase from "../../input/base"
import mixin from "../../input/base/mixin"
import Caspanel from "./caspanel"
export default {
    name: "Cascader",
    componentName: "Cascader",
    mixins: [mixin],
    components: {Caspanel, DropBase, InputBase},
    props: {
        filterable: Boolean,
        autoClose: Boolean,
        transfer: Boolean,
        value: {
            type: Array,
            default() {
                return []
            },
        },
        data: {
            type: Array,
            default() {
                return []
            },
        },
        asyncData: Function,
        render: Function,
        selection: String,
        trigger: {
            type: String,
            default: "click", //click,hover
        },
        showAllLevels: {
            type: Boolean,
            default: true,
        },
        noDataText: String,
        popperConfig: Object,
        propsMap: Object,
    },
    data() {
        return {
            model: [],
            visible: false,
            updateValueText: 1,
        }
    },
    created() {
        this.updateModel(this.value)
        this.handleDispatch("on-change", this.model)
    },
    computed: {
        getValueText() {
            if (!this.$refs.caspanel && this.updateValueText) return
            const data = this.$refs.caspanel.getDataByValue(this.model),
                valueKey = this.getFieldMap("value"),
                labelKey = this.getFieldMap("label"),
                levelFn = (item) => {
                    let result = []
                    if (this.showAllLevels) {
                        result = item.map((node) =>
                            node.data[labelKey] == void 0 ? node.data[valueKey] : node.data[labelKey]
                        )
                    } else {
                        item = item[item.length - 1]
                        if (item) {
                            result = [item.data[labelKey] == void 0 ? item.data[valueKey] : item.data[labelKey]]
                        }
                    }
                    return result.join(" / ")
                }
            if (this.selection === "multiple" || this.selection === "lastMultiple") {
                return data.map(levelFn)
            }
            return levelFn(data)
        },
    },
    methods: {
        // 获取转化后的字段名称
        getFieldMap(key) {
            const defaultMap = {
                label: "label",
                value: "value",
                identifier: "id",
                parentKey: "parentId",
            }
            return (this.propsMap || {})[key] || defaultMap[key] || this[key] || key
        },
        getDataByValue(data = this.model) {
            if (!this.$refs.caspanel) return
            return this.$refs.caspanel.getDataByValue(data)
        },
        handleKeydown(event) {
            if (event.keyCode === 13) {
                this.visible = false
            }
            if (
                (this.selection === "multiple" || this.selection === "lastMultiple") &&
                event.keyCode === 46 &&
                !event.target.value
            ) {
                this.handleClearTag(this.model.length - 1)
            }
        },
        handleChange(val) {
            this.updateModel(val)
            if (this.autoClose) {
                this.visible = false
            }
        },
        handleInput(event) {
            const value = event.target.value || ""
            this.visible = true
            if (!value && (this.selection !== "multiple" && this.selection !== "lastMultiple")) this.updateModel([])
            this.$refs.caspanel && this.$refs.caspanel.handleSearch(value)
        },
        handleBlur(event) {
            this.$nextTick(() => {
                this.updateValueText += 1
                this.$emit("on-change", this.model, event)
                this.$emit("on-blur", this.model, event)
                this.handleDispatch("on-validate", this.model)
            })
        },
        handleFocus(event) {
            this.$emit("on-focus", this.model, event)
        },
        handleClearTag(index) {
            const data = [...this.model]
            const item = data.splice(index, 1)
            this.updateModel(data)
            this.$refs.dropBase.cancelChange()
            this.$emit("on-remove-item", item, index)
        },
        handleClear() {
            this.updateModel([])
            this.$refs.dropBase.cancelChange()
            this.$emit("on-clear")
        },
        updateModel(val) {
            if (val === this.model) return
            if (!val) val = []
            if (!Array.isArray(val)) val = [val]
            if ((this.selection === "multiple" || this.selection === "lastMultiple") && val[0] != null && !Array.isArray(val[0])) val = [val]
            this.model = val
            this.$emit("input", this.model)
            this.handleDispatch("on-change", this.model)
        },
        handleVisible(val) {
            console.log(val, "handleVisible")
            this.updateValueText += 1
            this.$emit("on-visible-change", val)
            clearTimeout(this.__caspanelTime)
            this.$nextTick(() => {
                if (this.selection === "multiple" || this.selection === "lastMultiple") this.$refs.inputBase.getInputDom().value = ""
                this.__caspanelTime = setTimeout(() => {
                    this.$refs.caspanel && (this.$refs.caspanel.flatFilterData = null)
                }, 200)
            })
        },
        updatedDrop() {
            this.$nextTick(() => {
                this.$refs.dropBase.updatedDrop()
            })
        },
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.updateModel(val)
            },
        },
    },
    beforeDestroy() {
        clearTimeout(this.__caspanelTime)
        this.__caspanelTime = null
    },
}
</script>
