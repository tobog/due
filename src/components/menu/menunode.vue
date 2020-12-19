<template>
    <MenuItem :always="getNodeData.always || always" :mode="getNodeData.mode || mode" v-bind="getNodeData">
        <template v-if="getRender" slot="title">
            <Render :render="getRender" :parent="parent" :node="node"></Render>
        </template>
        <template v-else slot="title">{{ getNodeData.title }}</template>
        <template v-if="hasChildren">
            <MenuNode
                v-for="child in getChildren"
                :key="child.linkIndex"
                :node="child"
                :always="always"
                :mode="mode"
                :parent="node"
            ></MenuNode>
        </template>
    </MenuItem>
</template>

<script>
import MenuItem from "./menuitem";
import Render from "./render";

export default {
    name: "MenuNode",
    inject: ["$MenuTree"],
    components: {
        MenuItem,
        Render,
    },
    props: {
        node: {
            type: Object,
            default() {
                return {};
            },
        },
        parent: Object,
        mode: String,
        always: Boolean,
    },
    data() {
        return {};
    },
    computed: {
        getNodeData() {
            return this.node.data;
        },
        getChildIndexs() {
            return this.node.childIndexs;
        },
        hasChildren() {
            return this.getChildIndexs && this.getChildIndexs.length > 0;
        },
        getChildren() {
            return this.$MenuTree.getChildren(this.getChildIndexs);
        },
        getRender() {
            const render = this.getNodeData.render || this.$MenuTree.render;
            return typeof render === "function" && render;
        },
    },
    methods: {},
};
</script>
