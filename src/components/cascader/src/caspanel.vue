<template>
    <div :class="classes" :data-vue-module="$options.name">
        <div v-if="!nodeList.length" :class="[_tobogPrefix_ + '-nodata']">
            {{ langs("caspanel.noDataText", noDataText) }}
        </div>
        <template v-else-if="!flatFilterData || !flatFilterData.length">
            <CaspanelItem
                index="0"
                :modelList="modelList"
                :data="getRootNodeList"
                :trigger="trigger"
                :selection="selection"
                :render="render"
                :size="size"
                :theme="theme"
                :getFieldMap="getFieldMap"
                :asyncData="asyncData"
                @on-select="select"
                @on-check="handleCheck"
            >
                <template v-if="$scopedSlots.default" v-slot="data">
                    <slot v-bind="data"></slot>
                </template>
            </CaspanelItem>
            <CaspanelItem
                v-for="(value, index) in modelList"
                :modelList="modelList"
                :key="index"
                :index="index + 1"
                :data="getChildren(value.childIndexs)"
                :trigger="trigger"
                :selection="selection"
                :render="render"
                :size="size"
                :theme="theme"
                :getFieldMap="getFieldMap"
                :asyncData="asyncData"
                @on-select="select"
                @on-check="handleCheck"
            >
                <template v-if="$scopedSlots.default" v-slot="data">
                    <slot v-bind="data"></slot>
                </template>
            </CaspanelItem>
        </template>
        <CaspanelSearch
            v-else
            :data="flatFilterData"
            :modelList="modelList"
            :selection="selection"
            :render="render"
            :noDataText="noDataText"
            @on-select="select"
            @on-check="handleCheck"
        >
        </CaspanelSearch>
    </div>
</template>

<script>
import CaspanelItem from "./caspanel-item"
import CaspanelSearch from "./caspanel-search"
import linkList from "../../../mixins/linkList"
import globalMixin from "../../../mixins/global"
import langMinix from "../../../mixins/lang"
export default {
    name: "Caspanel",
    componentName: "Caspanel",
    mixins: [linkList, globalMixin, langMinix],
    components: {CaspanelItem, CaspanelSearch},
    props: {
        value: {
            type: Array,
            default() {
                return []
            },
        },
        trigger: {
            type: String,
            default: "click", //click,hover
        },
        asyncData: Function,
        render: Function,
        theme: String,
        size: String,
        noDataText: {
            type: String,
            default: "无匹配数据",
        },
    },
    data() {
        return {
            modelList: [],
            flatFilterData: null,
        }
    },
    created() {
        this.initData()
        this.initModelStatus()
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_,
                size = this.getGlobalData("size"),
                theme = this.getGlobalData("theme")
            return [
                `${_tobogPrefix_}-list`,
                {
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                    [`${_tobogPrefix_}-size-${size}`]: !!size,
                },
            ]
        },
    },
    methods: {
        initModelStatus() {
            // 通过value获取数据
            const data = this.getDataByValue(this.value) || []
            if (this.selection === "multiple" || this.selection === "lastMultiple") {
                this.nodeList.forEach((node) => {
                    this.$set(node.data, "selected", false)
                    this.$set(node.data, "indeterminate", false)
                })
                data.forEach((item) => {
                    this.$set(item[item.length - 1].data, "selected", true)
                })
                this.initStatusData(this.nodeList)
            } else {
                this.modelList = data
                if ((this.selection === "single" || this.selection === "lastSingle") && this.modelList.length) {
                    this.nodeList.forEach((node) => {
                        this.$set(node.data, "selected", false)
                        this.$set(node.data, "indeterminate", false)
                    })
                    this.$set(this.modelList[this.modelList.length - 1].data, "selected", true)
                }
            }
        },
        async select(node, index, type) {
            if (type === "flat") {
                this.modelList = node
                node = node[node.length - 1]
            } else {
                this.modelList = this.modelList.slice(0, index)
                this.$set(this.modelList, index, node)
            }
            const hasChildren = this.hasChildren(node)
            const isAsync = !hasChildren && typeof (node.data.asyncData || this.asyncData) === "function"
            const isMulti = this.selection === "multiple" || this.selection === "lastMultiple"
            if (isAsync) {
                if (node.loading) return
                this.$set(node, "loading", true)
                const result = await (node.data.asyncData || this.asyncData)(node).catch(() => {})
                const children = result || node.children
                this.$set(node, "loading", false)
                if (Array.isArray(children) && children.length > 0) {
                    this.nodeList = this.asyncAddNodeList(children, node)
                    if (isMulti) {
                        this.updateUpTree(node, true)
                        this.updateDownTree(node, {selected: node.data.selected, indeterminate: false})
                    }
                    // 强制更新
                    this.modelList = [...this.modelList]
                }
            }
            !isMulti && this.handleChange(!hasChildren && !isAsync)
            isAsync && this.$emit("on-async", this.modelList)
            this.$emit("on-updateDrop")
        },
        handleSearch(label) {
            this.flatFilterData = this.getFilterDataByLabel(label)
            this.$emit("on-updateDrop")
        },
        handleChange(isOver) {
            if (!isOver) return
            let result = [],
                resultData = [],
                valueKey = this.getFieldMap("value")
            if (this.selection === "multiple" || this.selection === "lastMultiple") {
                resultData = this.getLastSelectedData()
                result = resultData.map((item) => item.linkValue)
            } else if (this.selection === "single" || this.selection === "lastSingle") {
                resultData = this.getLastSelectedData()
                if (resultData[0]) {
                    result = resultData[0].linkValue
                }
            } else {
                resultData = this.modelList;
                result = resultData.map((node) => node.data[valueKey])
            }
            this.$emit("input", result, resultData);
            this.$emit("on-change", resultData);
        },
        handleCheck(node) {
            const data = node.data,
                isOnlySelf = this.getSelectOnlySelf(data.selectSelf),
                val = !data.selected,
                isMulti = this.selection === "multiple" || this.selection === "lastMultiple"
            if (isMulti) {
                if (isOnlySelf) {
                    this.$set(data, "selected", val)
                    this.$set(data, "indeterminate", false)
                } else {
                    this.updateDownTree(node, {
                        selected: val,
                        indeterminate: false,
                    })
                }
            } else {
                this.nodeList.forEach(({data}) => {
                    this.$set(data, "selected", false)
                    this.$set(data, "indeterminate", false)
                })
                this.$set(data, "selected", val)
            }
            this.$nextTick(() => {
                if (!isOnlySelf && isMulti) this.updateUpTree(node, true)
                this.handleChange(true)
                this.$emit(
                    "on-check-change",
                    val,
                    node,
                    this.nodeList.filter((item) => item.data.selected || item.data.indeterminate)
                )
            })
        },
    },
    watch: {
        data: {
            handler() {
                this.initData()
                this.initModelStatus()
            },
        },
        value() {
            this.initModelStatus()
        },
        selection() {
            this.initModelStatus()
        },
    },
}
</script>
