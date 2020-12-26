<template>
    <div :class="classes">
        <div
            v-if="!nodeList.length || (filterType === 'flat' && flatFilterData && !flatFilterData.length)"
            :class="[_tobogPrefix_ + '-nodata']"
        >
            {{ langs("caspanel.noDataText", noDataText) }}
        </div>
        <template v-else-if="filterType !== 'flat' || !flatFilterData">
            <CaspanelItem
                index="0"
                :modelList="modelList"
                :data="getRootNodeList"
                :trigger="trigger"
                :selection="selection"
                :render="render"
                :size="size"
                :theme="theme"
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
            :render="renderFlat"
            :noDataText="noDataText"
            @on-select="select"
            @on-check="handleCheck"
        >
        </CaspanelSearch>
    </div>
</template>

<script>
import CaspanelItem from "./caspanel-item";
import CaspanelSearch from "./caspanel-search";
import linkList from "../../mixins/linkList";
import globalMixin from "../../mixins/global";
import langMinix from "../../mixins/lang";
export default {
    name: "Caspanel",
    componentName: "Caspanel",
    mixins: [linkList, globalMixin, langMinix],
    components: { CaspanelItem, CaspanelSearch },
    props: {
        value: {
            type: Array,
            default() {
                return [];
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
        renderFlat: Function,
        filterType: String,
        noDataText: {
            type: String,
            default: "无匹配数据",
        },
    },
    data() {
        return {
            modelList: [],
            flatFilterData: null,
        };
    },
    created() {
        this.initData();
        this.initModelStatus();
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_,
                size = this.getGlobalData("size"),
                theme = this.getGlobalData("theme");
            return [
                `${_tobogPrefix_}-list`,
                {
                    [`${_tobogPrefix_}-theme-${theme}`]: !!theme,
                    [`${_tobogPrefix_}-size-${size}`]: !!size,
                },
            ];
        },
    },
    methods: {
        initModelStatus() {
            const data = this.getDataByValue(this.value);
            if (this.selection === "multiple") {
                this.nodeList.forEach((node) => {
                    this.$set(node.data, "selected", false);
                    this.$set(node.data, "indeterminate", false);
                });
                data.forEach((item) => {
                    const lastNode = item[item.length - 1];
                    this.$set(lastNode.data, "selected", true);
                });
                this.initStatusData(this.nodeList);
            } else {
                this.modelList = data;
                if (this.selection === "single" && this.modelList.length) {
                    this.nodeList.forEach((node) => {
                        this.$set(node.data, "selected", false);
                        this.$set(node.data, "indeterminate", false);
                    });
                    this.$set(this.modelList[this.modelList.length - 1].data, "selected", true);
                }
            }
        },
        async select(node, index, type) {
            if (type === "flat") {
                this.modelList = node;
                node = node[node.length - 1];
            } else {
                this.modelList = this.modelList.slice(0, index);
                this.$set(this.modelList, index, node);
            }
            const hasChildren = this.hasChildren(node);
            const isAsync = !hasChildren && typeof (node.asyncData || this.asyncData) === "function";
            if (isAsync) {
                if (node.loading) return;
                this.$set(node, "loading", true);
                const result = await this.asyncData(node).catch(() => {});
                const children = result || node.children;
                this.$set(node, "loading", false);
                if (Array.isArray(children) && children.length > 0) {
                    this.nodeList = this.asyncAddNodeList(children, node);
                    if (this.selection === "multiple") {
                        this.updateUpTree(node, true);
                        this.updateDownTree(node, { selected: node.data.selected, indeterminate: false });
                    }
                    this.modelList = [...this.modelList];
                }
            }
            this.selection !== "multiple" && this.handleChange(!hasChildren && !isAsync, null);
            isAsync && this.$emit("on-async", this.modelList);
            this.$emit("on-updateDrop");
        },
        handleSearch(labels) {
            if (this.filterType === "flat") {
                this.flatFilterData = this.getFlatDataByLabel(labels);
                this.$emit("on-updateDrop");
                return;
            }
            this.flatFilterData = null;
            this.modelList = this.getDataByLabel(labels);
            let lastNode = this.modelList[this.modelList.length - 1];
            let result;
            if (!lastNode || (this.hasChildren(lastNode) && this.selection !== "single")) {
                result = null;
            } else {
                let value = this.modelList.map((node) => node.data.value);
                if (this.selection === "multiple") {
                    result = lastNode.data.selected ? this.value : [...this.value, value];
                } else {
                    result = value;
                }
            }
            this.$emit("on-search", result);
        },
        handleChange(isOver, selection) {
            if (!isOver) return;
            this.$emit("on-search", null);
            let result = [];
            if (selection === "multiple") {
                const data = this.getSelectedData();
                result = data.map((item) => {
                    let linkParentIndexs = item.linkParentIndex
                        ? (item.linkParentIndex + "," + item.index).split(",")
                        : [item.index];
                    return linkParentIndexs.map((index) => this.nodeList[index].data.value);
                });
            } else if (selection === "single") {
                const [data] = this.getSelectedData();
                if (data) {
                    let linkParentIndexs = data.linkParentIndex
                        ? (data.linkParentIndex + "," + data.index).split(",")
                        : [data.index];
                    result = linkParentIndexs.map((index) => this.nodeList[index].data.value);
                }
            } else {
                result = this.modelList.map((node) => node.data.value);
            }
            this.$emit("input", result);
        },
        handleCheck(node) {
            // debugger;
            const data = node.data,
                isOnlySelf = this.getSelectOnlySelf(data.selectOnlySelf),
                val = !data.selected,
                isSingle = this.selection === "single";
            if (isSingle) {
                this.nodeList.forEach(({ data }) => {
                    this.$set(data, "selected", false);
                    this.$set(data, "indeterminate", false);
                });
                this.$set(data, "selected", val);
            } else {
                if (isOnlySelf) {
                    this.$set(data, "selected", val);
                    this.$set(data, "indeterminate", false);
                } else {
                    this.updateDownTree(node, {
                        selected: val,
                        indeterminate: false,
                    });
                }
            }
            this.$nextTick(() => {
                if (!isOnlySelf && !isSingle) this.updateUpTree(node, true);
                this.handleChange(true, this.selection);
                this.$emit(
                    "on-check-change",
                    val,
                    node,
                    this.nodeList.filter(({ data }) => data.selected || data.indeterminate)
                );
            });
        },
    },
    watch: {
        data: {
            // deep: true,
            handler() {
                this.initData();
                this.initModelStatus();
            },
        },
        value() {
            this.initModelStatus();
        },
        selection() {
            this.initModelStatus();
        },
    },
};
</script>
