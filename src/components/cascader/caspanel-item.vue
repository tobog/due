<template>
    <ul v-if="data && data.length" :class="[_tobogPrefix_ + '-wrapper']">
        <li
            v-for="(node, index) in data"
            :key="index"
            :class="itemClasses(node)"
            @click="select(node)"
            @mouseenter.stop="hover(node)"
        >
            <Checkbox
                v-if="selection === 'multiple' || selection === 'single'"
                readonly
                :radio="selection === 'single'"
                :class="[_tobogPrefix_ + '-checkbox']"
                :value="!!node.data.selected"
                :disabled="node.data.disabled"
                :indeterminate="node.data.indeterminate"
                @click.native="() => handleCheck(node)"
            />
            <slot :data="node" :index="index">
                <Render
                    v-if="getRender(node.data)"
                    :class="[_tobogPrefix_ + '-content']"
                    :render="getRender(node.data)"
                    :index="index"
                    :data="node"
                ></Render>
                <span v-else :class="[_tobogPrefix_ + '-content']">
                    {{ node.data.label }}
                </span>
            </slot>
            <Icons v-if="hasChildren(node)" type="ios-arrow-forward" :class="[_tobogPrefix_ + '-icon']" />
            <Icons v-else-if="node.loading" type="loading" :class="[_tobogPrefix_ + '-icon']" />
        </li>
    </ul>
</template>
<script>
import Icons from '../icons/index';
import Checkbox from '../checkbox';
import Render from './render';
export default {
    name: 'Caspanel-Item',
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
    },
    methods: {
        getRender(item) {
            const render = item.render || this.render;
            return typeof render === 'function' ? render : false;
        },
        itemClasses(node) {
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
            this.$emit('on-select', node, this.index);
        },
        hover(node) {
            if (this.trigger === 'hover' && this.hasChildren(node)) this.select(node);
        },
        hasChildren(node) {
            return node.childIndexs && node.childIndexs.length > 0;
        },
        handleCheck(node) {
            this.$emit('on-check', node);
        },
    },
};
</script>
