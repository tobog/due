<template>
    <Menu
        :accordion="accordion"
        :always="always"
        :theme="theme"
        :mode="mode"
        :transition="transition"
        @on-open-change="handleOpen"
        @on-select="handleSelect"
		v-bind="$attrs"
    >
        <MenuNode
            v-for="(child, index) in getRootNodeList"
            :ref="index"
            :key="child.linkIndex"
            :node="child"
            :always="always"
            :mode="mode"
        ></MenuNode>
    </Menu>
</template>

<script>
import Menu from "./menu";
import MenuNode from "./menunode";
import linkListMixin from "../../mixins/linkList";
export default {
    name: "MenuTree",
    mixins: [linkListMixin],
    provide() {
        return { $MenuTree: this };
    },
    components: {
        Menu,
        MenuNode,
    },
    props: {
        accordion: Boolean,
        always: Boolean,
        mode: {
            type: String,
            // default: "vertical"//horizontal,vertical
        },
        theme: {
            type: String,
            // default: 'primary'//primary,dark,light
        },
        collapse: Boolean,
        transition: Boolean,
        render: Function,
    },
    data() {
        return {};
    },
    created() {
        this.initData();
    },
    watch: {
        data: {
            deep: true,
            handler(val) {
                this.initData();
            },
        },
    },
    methods: {
        handleOpen(name, isopen) {
            this.$emit("on-open-change", name, isopen);
        },
        handleSelect(name) {
            this.$emit("on-select", name);
        },
    },
};
</script>
