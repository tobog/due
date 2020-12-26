<template>
    <ul v-if="data && data.length" :class="[_tobogPrefix_ + '-wrapper']">
        <li v-for="(node, index) in data" :key="index" :class="classes(node)" @click="select(node)">
            <span :class="[_tobogPrefix_ + '-content']">
                <slot :data="node" :index="index">
                    <Render
                        v-if="typeof render === 'function'"
                        :render="render"
                        :index="index"
                        :isFilter="true"
                        :data="node"
                    ></Render>
                    <template v-else> {{ node | labelFormat }}</template>
                </slot>
            </span>
            <Icons v-if="isSelected(node)" type="checkmark" :class="[_tobogPrefix_ + '-icon']" />
        </li>
    </ul>
</template>
<script>
import Icons from "../icons/index";
import Render from "./render";
export default {
    name: "Caspanel-Search",
    componentName: "CaspanelSearch",
    components: {
        Icons,
        Render,
    },
    props: {
        modelList: {
            type: Array,
            default() {
                return [];
            },
        },
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        selection: String, //multiple,single
        render: Function,
        size: String,
        theme: String,
    },
    filters: {
        labelFormat(val) {
            return val.map((item) => item.data.label).join(" / ");
        },
    },
    methods: {
        classes(node) {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-active`]: this.isSelected(node),
                    [`${_tobogPrefix_}-disabled`]: node.some((item) => item.data.disabled),
                },
            ];
        },
        select(node) {
            if (node.some((item) => item.data.disabled)) return;
            if (this.selection === "multiple" || this.selection === "single") {
                this.$emit("on-check", node);
                return;
            }
                   debugger;
            this.$emit("on-select", node, 0, "flat");
        },
        isSelected(node) {
            if (this.selection === "multiple" || this.selection === "single") {
                return node[node.length - 1].data.selected;
            }
            const item = this.modelList[this.modelList.length - 1] || {};
            return item.linkIndex === node[node.length - 1].linkIndex;
        },
    },
};
</script>
