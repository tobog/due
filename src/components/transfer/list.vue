
<template>
<section :class="wrapClasses" :data-vview-module='$options.name'>
    <div :class="_tobogPrefix_ + '-header'">
        <Checkbox 
        :value="checkedAll" 
        :disabled="checkedAllDisabled" 
        @on-change="toggleSelectAll">
        </Checkbox>
        <span v-html="title"></span>
        <span :class="_tobogPrefix_+'-count'">{{ count }}</span>
    </div>
    <Input
    clearable
    :class="_tobogPrefix_ + '-search'"
    v-model="query"
    v-bind="$attrs"/>
    <ul :class="_tobogPrefix_ + '-content'">
        <li 
        v-for="(item,index) in filterData" 
        :key="index" 
        :class="itemClasses(item)" 
        @click.prevent="select(item)">
            <Checkbox :value="isChecked(item)" :disabled="item.disabled"></Checkbox>
            <span v-html="renderFormat(item)"></span>
        </li>
    </ul>
    <footer :class="_tobogPrefix_ + '-footer'" v-if="showFooter">
        <slot></slot>
    </footer>
</section>
</template>

<script>
import Checkbox from '../checkbox/index';
import Input from '../input/index';

export default {
    name: 'TransferList',
    inheritAttrs: false,
    components: {
        Checkbox,
        Input
    },
    props: {
        identifier: String,
        data: Array,
        renderFormat: Function,
        checkedKeys: Array,
        title: [String, Number],
        filterable: Boolean,
        filterMethod: {
            type: Function,
            default(item, query) {
                if (query === '' && query === undefined) return true;
                const text = this.renderFormat(item).toLowerCase();
                return `${text}`.trim().indexOf(query) > -1;
            }
        },
    },
    data() {
        return {
            items: [],
            query: '',
            showFooter: true,
        };
    },
    mounted() {
        this.showFooter = this.$slots.default !== undefined;
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-with-footer`]: this.showFooter,
                    [`${_tobogPrefix_}-with-search`]: this.filterable
                }
            ];
        },
        count() {
            const validCount = this.getValidData.length;
            return (validCount > 0 ? `${validCount}/` : '') + `${this.data.length}`;
        },
        checkedAll() {
            const validCount = this.getValidData.length;
            return this.filterData.filter(item => !item.disabled).length == validCount && validCount != 0;

        },
        checkedAllDisabled() {
            return this.filterData.filter(item => !item.disabled).length <= 0;
        },
        filterData() {
            return this.data.filter(item => this.filterMethod(item, this.query));
        },
        getValidData() {
            const identifier = this.identifier,checkedKeys= this.checkedKeys||[];
            return this.filterData.filter(item => !item.disabled && checkedKeys.indexOf(item[identifier]) > -1);
        },
    },
    methods: {
        itemClasses(item) {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-item`,
                {
                    [`${_tobogPrefix_}-active`]: this.isChecked(item),
                    [`${_tobogPrefix_}-disabled`]: item.disabled
                }
            ];
        },
        isChecked(item) {
            let data = item[this.identifier],checkedKeys= this.checkedKeys||[];
            return checkedKeys.some(value => value === data);
        },
        select(item) {
            if (item.disabled) return;
            const checkedKeys = [...this.checkedKeys],
                identifier = item[this.identifier],
                index = checkedKeys.indexOf(identifier);
            index > -1 ? checkedKeys.splice(index, 1) : checkedKeys.push(identifier);
            this.$emit('on-check-change', checkedKeys);
        },
        toggleSelectAll(status) {
            const identifier = this.identifier,checkedKeys= this.checkedKeys||[],
                keys = (status ? this.filterData.filter(item => !item.disabled || checkedKeys.indexOf(item[identifier]) > -1) :
                    this.filterData.filter(item => item.disabled && checkedKeys.indexOf(item[identifier]) > -1)).map(item => item[identifier]);
             console.log(status,keys, 'status')
            this.$emit('on-check-change', keys);
        },
    },

};
</script>
