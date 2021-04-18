<template>
    <ul v-if="data && data.length" :class="[_tobogPrefix_ + '-wrapper']">
        <li
            v-for="(node, index) in data"
            :key="index"
            :class="classes(node)"
            @click="select(node)"
            @mouseenter.stop="hover(node)"
        >
            <Checkbox
                v-if="selection === 'multiple' || selection === 'single'"
                readonly
                :size="size"
                :theme="theme"
                :radio="selection === 'single'"
                :class="[_tobogPrefix_ + '-checkbox']"
                :value="!!node.data.selected"
                :disabled="node.data.disabled"
                :indeterminate="node.data.indeterminate"
                @click.native="handleCheck(node)"
            />
            <span :class="[_tobogPrefix_ + '-content']">
                <slot :data="node" :index="index">
                    <Render
                        v-if="getRender(node.data)"
                        :render="getRender(node.data)"
                        :index="index"
                        :data="node"
                    ></Render>
                    <templatet v-else>
                        {{ node.data.label }}
                    </templatet>
                </slot>
            </span>
            <Icons
                v-if="node.childIndexs && node.childIndexs.length > 0"
                type="ios-arrow-forward"
                :class="[_tobogPrefix_ + '-icon']"
            />
            <Icons v-else-if="node.loading" type="loading" :class="[_tobogPrefix_ + '-icon']" />
        </li>
    </ul>
</template>
<script>
import Icons from "../icons/src/index";
import Checkbox from "../checkbox";
import Render from "./render";
export default {
    name: "Caspanel-Item",
    componentName: "CaspanelItem",
    components: {
        Icons,
        Render,
        Checkbox,
    },
    props: {
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        modelList: {
            type: Array,
            default() {
                return [];
            },
        },
        index: {
            type: [Number, String],
            default: 0,
        },
        trigger: String,
        selection: String, //multiple,single
        render: Function,
        size: String,
        theme: String,
    },
    methods: {
        getRender(item) {
            const render = item.render || this.render;
            return typeof render === "function" ? render : false;
        },
        classes(node) {
            const _tobogPrefix_ = this._tobogPrefix_,
                data = this.modelList[this.index] || {};
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-active`]: data.index === node.index,
                    [`${_tobogPrefix_}-disabled`]: node.data.disabled,
                },
            ];
        },
        select(node) {
            if (node.data.disabled) return;
            this.$emit("on-select", node, this.index);
        },
        hover(node) {
            if (this.trigger === "hover" && node.childIndexs && node.childIndexs.length > 0) this.select(node);
        },
        // hasChildren(node) {
        //     return node.childIndexs && node.childIndexs.length > 0;
        // },
        handleCheck(node) {
            this.$emit("on-check", node);
        },
    },
};
</script>
