<template>
    <div :class="classes">
        <CaspanelItem
            index="0"
            :modelList="modelList"
            :data="getRootNodeList"
            :trigger="trigger"
            :selection="selection"
            :render="render"
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
            @on-select="select"
            @on-check="handleCheck"
        >
            <template v-if="$scopedSlots.default" v-slot="data">
                <slot v-bind="data"></slot>
            </template>
        </CaspanelItem>
    </div>
</template>

<script>
import CaspanelItem from './caspanel-item';
import linkList from '../../mixins/linkList';
export default {
    name: 'Caspanel',
    mixins: [linkList],
    components: { CaspanelItem },
    props: {
        value: {
            type: Array,
            default() {
                return [];
            },
        },
        trigger: {
            type: String,
            default: 'click', //click,hover
        },
        asyncData: Function,
        render: Function,
        theme: String,
    },
    data() {
        return {
            modelList: [],
        };
    },
    created() {
        this.initData();
        this.initModelStatus();
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-list`,
                {
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                },
            ];
        },
    },
    methods: {
        initModelStatus() {
            const data = this.getDataByValue(this.value);
            if (this.selection === 'multiple') {
                this.nodeList.forEach((node) => {
                    this.$set(node.data, 'selected', false);
                    this.$set(node.data, 'indeterminate', false);
                });
                data.forEach((item) => {
                    const lastNode = item[item.length - 1];
                    this.$set(lastNode.data, 'selected', true);
                });
                this.initStatusData(this.nodeList);
            } else {
                this.modelList = data;
                if (this.selection === 'single' && this.modelList.length) {
                    this.nodeList.forEach((node) => {
                        this.$set(node.data, 'selected', false);
                        this.$set(node.data, 'indeterminate', false);
                    });
                    this.$set(this.modelList[this.modelList.length - 1].data, 'selected', true);
                }
            }
        },
        async select(node, index) {
            const hasChildren = this.hasChildren(node);
            const isAsync = !hasChildren && typeof this.asyncData === 'function';
            this.modelList = this.modelList.slice(0, index);
            this.$set(this.modelList, index, node);
            if (isAsync) {
                if (node.loading) return;
                this.$set(node, 'loading', true);
                const result = await this.asyncData(node).catch(() => {});
                const children = result || node.children;
                this.$set(node, 'loading', false);
                if (Array.isArray(children) && children.length > 0) {
                    this.nodeList = this.asyncAddNodeList(children, node);
                    if (this.selection === 'multiple') {
                        this.updateUpTree(node, true);
                        this.updateDownTree(node, { selected: node.data.selected, indeterminate: false });
                    }
                    this.modelList = [...this.modelList];
                }
            }
            if (this.selection !== 'multiple') {
                this.handleChange(!hasChildren && !isAsync, null);
            }
            if (isAsync) {
                this.$emit('on-async', this.modelList);
            }
            this.$emit('on-updateDrop');
        },
        handleSearch(labels) {
            this.modelList = this.getDataByLabel(labels);
            let lastNode = this.modelList[this.modelList.length - 1];
            let result;
            if (!lastNode || (this.hasChildren(lastNode) && this.selection !== 'single')) {
                result = null;
            } else {
                let value = this.modelList.map((node) => node.data.value);
                if (this.selection === 'multiple') {
                    result = lastNode.data.selected ? this.value : [...this.value, value];
                } else {
                    result = value;
                }
            }
            console.log(result);
            this.$emit('on-search', result);
        },
        handleChange(isOver, selection) {
            if (!isOver) return;
            this.$emit('on-search', null);
            let result = [];
            if (selection === 'multiple') {
                const data = this.getSelectedData();
                result = data.map((item) => {
                    let linkParentIndexs = item.linkParentIndex
                        ? (item.linkParentIndex + ',' + item.index).split(',')
                        : [item.index];
                    return linkParentIndexs.map((index) => this.nodeList[index].data.value);
                });
                // values = result.map((item) => item.map((node) => node.data.value));
            } else if (selection === 'single') {
                const [data] = this.getSelectedData();
                if (data) {
                    let linkParentIndexs = data.linkParentIndex
                        ? (data.linkParentIndex + ',' + data.index).split(',')
                        : [data.index];
                    result = linkParentIndexs.map((index) => this.nodeList[index].data.value);
                    // values = result.map((node) => node.data.value);
                }
            } else {
                // result = this.modelList;
                result = this.modelList.map((node) => node.data.value);
            }
            this.$emit('input', result);
            // this.$emit('on-change', result);
        },
        handleCheck(node) {
            const data = node.data,
                isOnlySelf = this.getSelectOnlySelf(data.selectOnlySelf),
                val = !data.selected,
                isSingle = this.selection === 'single';
            if (isSingle) {
                this.nodeList.forEach(({ data }) => {
                    this.$set(data, 'selected', false);
                    this.$set(data, 'indeterminate', false);
                });
                this.$set(data, 'selected', val);
            } else {
                if (isOnlySelf) {
                    this.$set(data, 'selected', val);
                    this.$set(data, 'indeterminate', false);
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
                    'on-check-change',
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
