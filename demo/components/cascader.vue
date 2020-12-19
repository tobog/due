<style lang="scss"></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Cascader 级联选择)</h2>
            <h4 class="padding-top-10">
                从一组相关联的数据集合中进行选择，常用于省市区、公司级层、事务分类等。相比 Select
                组件，可以一次性完成选择，体验更好。
            </h4>
        </vCol>
        <vCol lg="14" span="24" class="demo-form">
            <Formedit :formdata="getBase" v-model="formData"></Formedit>
        </vCol>
        <vCol lg="10" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <section v-if="show">
                <vCascader v-bind="formData" :data="data" v-model="value1">
                    <template v-slot="{ data, index }">
                        <span>{{ data.data.label }}{{ index }}</span>
                    </template>
                </vCascader>
                {{ value1 }}
                <vCascader :data="data" :asyncData="asyncData" :render="renderfn"></vCascader>
				<br/>
				<br/>
				<span>Caspanel面板</span>
                <vCaspanel :data="data" :asyncData="asyncData" :render="renderfn" ></vCaspanel>
            </section>
        </vCol>
        <vCol span="24" class="demo-code">
            <pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
        </vCol>
        <vCol span="24" class="demo-props">
            <h2 class="demo-header">Props & Events</h2>
            <vTable :columns="getTableColumns" :data="compProps" class="demo-table" border stripe></vTable>
        </vCol>
    </vRow>
</template>

<script>
export default {
    // ${this.getCodeString(this.formData)}

    computed: {
        getCode() {
            return `<vCascader 
							v-bind="${this.getCodeString(this.formData)}" 
							:data="data" 
							v-model="value1" 
							:asyncData="asyncData">
					</vCascader>
					<vCaspanel :data="data" :asyncData="asyncData" :render="renderfn" ></vCaspanel>
					`;
        },
        getBase() {
            return [
                {
                    label: '置于body下',
                    key: 'transfer',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '禁用',
                    key: 'disabled',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '支持清除',
                    key: 'clearable',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '仅读',
                    key: 'readonly',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '支持搜索',
                    key: 'filterable',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '支持折叠',
                    key: 'collapse',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '显示层级',
                    key: 'showAllLevels',
                    tag: 'vSwitch',
                    default: true,
                },
                {
                    label: '自动关闭',
                    key: 'autoClose',
                    tag: 'vSwitch',
                    default: false,
                },
                {
                    label: '主题颜色',
                    key: 'theme',
                    tag: 'vSelect',
                    options: this.getThemes,
                },
                {
                    label: '选择模式',
                    key: 'selection',
                    tag: 'vSelect',
                    default: '',
                    options: ['single', 'multiple', 'none'],
                },
                {
                    label: '菜单展开方式',
                    key: 'trigger',
                    tag: 'vSelect',
                    default: 'click',
                    options: ['click', 'hover'],
                },
            ];
        },
        compProps() {
            return [
                {
                    prop: 'value',
                    explain: '当前已选项的数据，格式参照示例说明',
                    type: 'Array',
                    default: '[]',
                },
                {
                    prop: 'name',
                    explain: 'form 表单名称',
                    type: 'String',
                    default: '-',
                },
                {
                    prop: 'transfer',
                    explain: '是否将弹层放置于 body 内',
                    type: 'Boolean',
                    default: false,
                },
                {
                    prop: 'prompt',
                    explain: '当此项为 true 时，点选每级菜单选项值都会发生变化',
                    type: 'Boolean',
                    default: false,
                },
                {
                    prop: 'disabled',
                    explain: '是否禁用',
                    type: 'Boolean',
                    default: false,
                },
                {
                    prop: 'clearable',
                    explain: '是否支持清除',
                    type: 'Boolean',
                    default: true,
                },
                {
                    prop: 'filterable',
                    explain: '支持搜索',
                    type: 'Boolean',
                    default: true,
                },
                {
                    prop: 'autoClose',
                    explain: '是否自动关闭',
                    type: 'Boolean',
                    default: false,
                },
                {
                    prop: 'theme',
                    explain: '主题颜色可选值为 gray、primary、dashed、text、info、success、warning、error',
                    type: 'String',
                    options: this.getThemes,
                },
                {
                    prop: 'trigger',
                    explain: '次级菜单展开方式，可选值为 click 或 hover',
                    type: 'String',
                    default: 'click',
                },
                // {
                //     prop: 'renderFormat',
                //     explain: '选择后展示的函数，用于自定义显示格式',
                //     type: 'Function',
                //     default: '-',
                // },
                {
                    prop: 'asyncData',
                    explain: '动态获取数据，数据源需标识 loading',
                    type: 'Function',
                    default: '-',
                },
                {
                    prop: 'on-change',
                    explain: '选择完成后的回调，返回值 value 即已选值 value，selectedData 为已选项的具体数据',
                    type: 'Event',
                    default: 'value, selectedData',
                },
                {
                    prop: 'on-visible-change',
                    explain: '展开和关闭弹窗时触发',
                    type: 'Event',
                    default: '',
                },
                {
                    prop: '$attrs',
                    explain: '继承input attrs',
                    type: 'Object',
                    default: '-',
                },
                {
                    prop: 'data:value',
                    explain: '绑定value',
                    type: '-',
                    default: '-',
                },
                {
                    prop: 'data:label',
                    explain: '显示文字',
                    type: '-',
                    default: '-',
                },
                {
                    prop: 'data:render',
                    explain: '自定义渲染函数',
                    type: '-',
                    default: '(h,{data,ctx,index})=>{}',
                },
            ];
        },
    },
    data() {
        return {
            value1: ['jiangsu', 'suzhou', 'shizilin'],
            data: [
                {
                    value: 'beijing',
                    label: '北京',
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫',
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                        },
                    ],
                },
                {
                    value: 'beijing',
                    label: '北京',
                    disabled: true,
                    children: [
                        {
                            value: 'gugong',
                            label: '故宫',
                            disabled: true,
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                        },
                    ],
                },
                {
                    value: 'jiangsu',
                    label: '江苏',
                    children: [
                        {
                            value: 'nanjing',
                            label: '南京',
                            children: [
                                {
                                    value: 'fuzimiao',
                                    label: '夫子庙',
                                },
                            ],
                        },
                        {
                            value: 'suzhou',
                            label: '苏州',
                            children: [
                                {
                                    value: 'zhuozhengyuan',
                                    label: '拙政园',
                                },
                                {
                                    value: 'shizilin',
                                    label: '狮子林',
                                },
                            ],
                        },
                    ],
                },
            ],
        };
    },
    methods: {
        renderfn(h, { data, index }) {
            return (
                <span>
                    {data.data.label}
                    {index}
                </span>
            );
        },
        async asyncData() {
            return new Promise((a, b) => {
                setTimeout(() => {
                    a([
                        {
                            value: 'gugong',
                            label: '故宫',
                        },
                        {
                            value: 'tiantan',
                            label: '天坛',
                        },
                        {
                            value: 'wangfujing',
                            label: '王府井',
                        },
                    ]);
                }, 3000);
            });
        },
    },
};
</script>
