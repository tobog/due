<template>
    <main style="padding:20px 0;" class="examples-main clearfix">
        <vForm class="example" vertical>
            <div style="padding:10px 0;">参数：</div>
            <vFormItem
                v-for="(item,key) of switchs"
                :key="key"
                label-width="100"
                :label="key"
            >
                <vSwitch v-model="switchs[key]" />
            </vFormItem>
            <vFormItem
                v-for="(item,key) of selects"
                :key="key"
                label-width="100"
                :label="key"
            >
                <vSelect v-model="selects[key]">
                    <vOption
                        v-for="(val,index) of options[key]"
                        :value='val'
                        :key="index"
                    ></vOption>
                </vSelect>
            </vFormItem>
        </vForm>
        <vTree
            :data="trees"
            v-bind="attrs"
            ref="vtree"
            class="example"
            style="height:200px;overflow:auto"
        ></vTree>
        <h2 class="title">Tree Props & Events #</h2>
        <vTable
            :columns='columns'
            :data="data"
            style="width:100%"
            border
            stripe
        ></vTable>

        <h2 class="title">children Props & Events #</h2>
        <vTable
            :columns='columns'
            :data="children"
            style="width:100%"
            border
            stripe
        ></vTable>
    </main>
</template>

<script>
export default {
  
    computed: {
        attrs() {
            return {
                ...this.selects,
                ...this.switchs
            }
        },
        columns() {
            return [{
                    title: '属性/事件/方法',
                    key: 'prop',
                },
                {
                    title: '说明',
                    key: 'explain',
                },
                {
                    title: '类型',
                    key: 'type',
                },
                {
                    title: '默认值/参数/返回值',
                    key: 'default',
                },
            ]
        },

        data() {
            return [{
                    prop: 'data',
                    explain: '数据源',
                    type: 'Array',
                    default: [],
                },
                {
                    prop: 'multiple',
                    explain: '是否支持多条目展开',
                    type: 'Boolean',
                    default: 'false',
                },
                {
                    prop: 'draggable',
                    explain: '是否支持拖拽排序',
                    type: 'Boolean',
                    default: 'false',
                },
                 {
                    prop: 'selection',
                    explain: '是否显示多选框',
                    type: 'boolean',
                    default: 'false',
                },
                {
                    prop: 'render',
                    explain: '自定义渲染内',
                    type: 'Function:render(h, { data, node, ctx: ctx.parent });',
                    default: 'VNode',
                },
                {
                    prop: 'type',
                    explain: 'tree 类型:tree|menu',
                    type: 'String',
                    default: 'tree',
                },
                {
                    prop: 'theme',
                    explain: '主题 类型:light|dark|primary;仅仅针对menu类型',
                    type: 'String',
                    default: 'dark',
                },
                {
                    prop: 'slot',
                    explain: '文件夹节点的图标样式',
                    type: 'VNODE:slot',
                    default: '-',
				},
				 {
                    prop: 'on-expand-change',
                    explain: '关闭和打开事件',
                    type: 'Function：(status,node,key)=>{}',
                    default: '-',
                },
                 {
                    prop: 'on-drop-change',
                    explain: 'drop事件',
                    type: 'Function：(dragTemp,dropTemp,type)=>{}',
                    default: '-',
                },
				
            ]
        },
        children() {
            return [{
                    prop: 'title',
                    explain: '标题',
                    type: 'any',
                    default: '-',
                },
                {
                    prop: 'key',
                    explain: '唯一标识key',
                    type: 'string|number',
                    default: '-',
                },
                
                {
                    prop: 'icon',
                    explain: '标题图标',
                    type: 'string',
                    default: '-',
                },
                {
                    prop: 'iconType',
                    explain: '标题图标类型：text|html',
                    type: 'string',
                    default: '-',
                },
                {
                    prop: 'class',
                    explain: '类名',
                    type: 'string',
                    default: '-',
                },
                {
                    prop: 'style',
                    explain: '样式',
                    type: 'string',
                    default: '-',
                }, 
                {
                    prop: 'link',
                    explain: '链接',
                    type: 'string|Object',
                    default: '-',
                },
                 {
                    prop: 'selected',
                    explain: 'selected',
                    type: 'boolean',
                    default: '-',
                },
                
                {
                    prop: 'children',
                    explain: '子级',
                    type: 'array',
                    default: '[]',
                },
                {
                    prop: 'render',
                    explain: '自定义渲染',
                    type: 'Function:render(h, { data, node, ctx: ctx.parent })',
                    default: '{ data:数据, node：父节点,  ctx：上下文环境}',
                },
            ]
        }
    },
    data() {
        return {
            switchs: {
                draggable: true,
                checkbox: true,
                multiple: true,
                indent: true,
                always: false,
                selection:true
            },
            selects: {
                type: 'tree',
                theme: '',
                direction: 'vertical',
            },
            options: {
                type: ['tree', 'menu'],
                theme: ['','primary', 'dark','light'],
                direction: ['vertical', 'horizontal'],
            },
            trees: [],
        };
    },
      created() {
        setTimeout(() => {
            this.trees = [{
                    title: 'title1',
                    key: '1', //key
                    icon: 'success',
                    expand: true,
                    children: [{
                            title: 'title2',
                            id: '2', //key,
                            icon: 'success',
                            children: [{
                                title: '====',
                                id: '3', //key,
                                selected: true,
                                icon: 'success',
                                children: [{
                                        title: '===ss=',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                    {
                                        title: '1123',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                ],
                            }, ],
                        },
                        {
                            title: 'title2',
                            id: '2', //key,
                            icon: 'success',
                            children: [{
                                title: '====',
                                id: '3', //key,
                                selected: true,
                                icon: 'success',
                                children: [{
                                        title: '===ss=',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                    {
                                        title: '1123',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                ],
                            }, ],
                        },
                        {
                            title: 'title2',
                            id: '2', //key,
                            icon: 'success',
                            children: [{
                                title: '====',
                                id: '3', //key,
                                selected: true,
                                icon: 'success',
                                children: [{
                                        title: '===ss=',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                    {
                                        title: '1123',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                ],
                            }, ],
                        },
                        {
                            title: 'title2',
                            id: '2', //key,
                            icon: 'success',
                            children: [{
                                title: '====',
                                id: '3', //key,
                                selected: true,
                                icon: 'success',
                                children: [{
                                        title: '===ss=',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                    {
                                        title: '1123',
                                        id: '30', //key,
                                        selected: true,
                                        icon: 'success',
                                    },
                                ],
                            }, ],
                        },
                        {
                            title: 'title3',
                            id: '4', //key,
                            selected: true,
                            icon: 'success',
                        },
                        {
                            title: 'title4',
                            id: '5', //key,
                            selected: false,
                            icon: 'success',
                        }, {
                            title: 'title5',
                            id: '6', //key,
                            icon: 'success',
                            children: [{
                                    title: '1123',
                                    id: '30', //key,
                                    selected: true,
                                    icon: 'success',
                                },
                                {
                                    title: 'title6',
                                    id: '7', //key,
                                    selected: true,
                                    icon: 'success',
                                    children: [{
                                            title: 'title7',
                                            id: '8', //key,
                                            selected: false,
                                            icon: 'success',
                                        },
                                        {
                                            title: '1123',
                                            id: '30', //key,
                                            selected: true,
                                            icon: 'success',
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

            ]
        }, 3000)
    },
};
</script>
