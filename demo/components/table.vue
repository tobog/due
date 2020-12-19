<template>
    <main style="padding:20px 0;" class="examples-main clearfix">
        <vButton @click="open">open</vButton>
        <div  @DOMNodeInserted="getTime">
            <vTableSimple
            performance
            v-if="bool"
                v-bind="attrs"
                :columns="columns1"
                :data="data1"
                style="margin-bottom:30px;"
            ></vTableSimple>
            <vTable
            v-if="bool"
                v-bind="attrs"
                :columns="columns1"
                :data="data1"
                style="margin-bottom:30px;"
            ></vTable>
        </div>
        
        <vTable
            v-bind="attrs"
            :columns="columns11"
            :data="data10"
            height="500"
            style="margin-bottom:30px;"
        ></vTable>
        <vForm vertical inline>
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

        <h2 class="title">vTable Props & Events #</h2>
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
    methods:{
        open(){
            this.bool=!this.bool;
            this._time=Date.now();
        },
        getTime(){
            console.log(Date.now()-this._time)
        }
    },
    mounted() {
        const data = ['key','name','age','street','door','cname'];
        for (let i = 0; i < 2000; i++) {
            this.data1.push({
                key: i,
                name: 'John Brown,John BrownJohn BrownJohn Brown',
                age: i + 1,
                street: 'Lake ParkLake ParkLake ParkLake ParkLake Park',
                building: 'C',
                door: 2035,
                caddress: 'Lake Street 42',
                cname: 'SoftLake Co',
                gender: 'M',
            });
        }
        for (let i = 0; i < 10; i++) {
            const index=i%6
            this.columns1.push({
                title: 'Address',
                key: data[index],
                // render() {
                //     return <span> sssssssssssssss </span>
                // },
            });
        }
        const data10 = [];
        for (let i = 0; i < 20; i++) {
            data10.push({
                key: i,
                name: 'John Brown,John BrownJohn BrownJohn Brown',
                age: i + 1,
                street: 'Lake ParkLake ParkLake ParkLake ParkLake Park',
                building: 'C',
                door: 2035,
                caddress: 'Lake Street 42',
                cname: 'SoftLake Co',
                gender: 'M',
            });
        }
        this.data10 = data10;
    },
    computed: {
        attrs() {
            return {
                height:200,
                performance:"auto",
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
                prop: 'columns',
                explain: '条目',
                type: 'Array',
                default: '[]',
            },
            {
                prop: 'width/height',
                explain: 'width/height',
                type: 'Number',
                default: '-',
            },
            {
                prop: 'stripe',
                explain: '斑马线',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'border',
                explain: 'border',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'showThead',
                explain: 'thead',
                type: 'Boolean',
                default: 'true',
            },
            {
                prop: 'highlightRow',
                explain: 'highlightRow',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'hover',
                explain: 'hover',
                type: 'Boolean',
                default: 'true',
            },
            {
                prop: 'loading',
                explain: 'loading',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'ellipsis',
                explain: 'ellipsis',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'hover',
                explain: 'hover',
                type: 'Boolean',
                default: 'true',
            },
            {
                prop: 'noDataText',
                explain: '暂时没有相关数据',
                type: 'String',
                default: '暂时没有相关数据',
            },
            {
                prop: 'size',
                explain: 'size',
                type: 'String, Number',
                default: 'default|',
            },
            {
                prop: 'slot',
                explain: 'Loading的slot',
                type: 'VNode',
                default: '-',
            },
            {
                prop: 'radio',
                explain: 'vTable Component radio',
                type: 'Boolean',
                default: '-',
            },
            {
                prop: 'multiSort',
                explain: 'vTable Component multiSort',
                type: 'Boolean',
                default: '-',
            },
            {
                prop: 'multiFilter',
                explain: 'vTable Component multiFilter',
                type: 'Boolean',
                default: '-',
            },
            {
                prop: 'on-row-dbclick/on-row-click',
                explain: 'dbclick/click must be the prop highlightRow=true',
                type: 'Function：(row,index)=>{}',
                default: '-',
            },
            {
                prop: 'on-row-hover',
                explain: 'hover must be the prop hover=true',
                type: 'Function：(row,index,type|ture:false|inOrLeave)=>{}',
                default: '-',
            },
            {
                prop: 'on-check-change',
                explain: 'vTable Component',
                type: 'Function：(rows, val, { key, status: true, type: checkAll })=>{}',
                default: '-',
            },
            {
                prop: 'on-radio-change',
                explain: 'vTable Component',
                type: 'Function：(row, val, { key, status: true, index, type: radio })=>{}',
                default: '-',
            },
            {
                prop: 'on-sort-change',
                explain: 'vTable Component',
                type: 'Function：(sort, key, { column, multiSort })=>{}',
                default: '-',
            },
            {
                prop: 'on-filter-change',
                explain: 'vTable Component',
                type: 'Function：(value, key, { column, multiFilter })=>{}',
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
                prop: 'popper',
                explain: 'popper',
                type: 'Boolean',
                default: '-',
            },
            {
                prop: 'fixed',
                explain: 'left|right',
                type: 'string',
                default: '-',
            },
            {
                prop: 'width',
                explain: 'width',
                type: 'number',
                default: '-',
            },
            {
                prop: 'align',
                explain: 'left|center|right',
                type: 'number',
                default: '-',
            },
            {
                prop: 'sortable',
                explain: 'vTable Component 排序',
                type: 'boolean',
                default: '-',
            },
            {
                prop: 'multi',
                explain: 'vTable Component:{sort,filter}',
                type: 'object',
                default: '-',
            },
            {
                prop: 'filters',
                explain: 'vTable Component 过滤选项',
                type: 'array',
                default: '-',
            },
            {
                prop: 'filterMethod',
                explain: 'vTable Component 过滤选项',
                type: 'Function:(value, item)=>Boolean',
                default: '-',
            },
            {
                prop: 'selection',
                explain: 'vTable Component:selection|sort',
                type: 'string',
                default: '-',
            },
            {
                prop: 'props',
                explain: '控制td的attrs',
                type: 'any',
                default: '-',
            },
            {
                prop: 'attrs',
                explain: '控制td的attrs',
                type: 'any',
                default: '-',
            },
            {
                prop: 'class',
                explain: '控制td的class',
                type: 'any',
                default: '-',
            },
            {
                prop: 'style',
                explain: '控制td的style',
                type: 'any',
                default: '-',
            },
            {
                prop: 'domProps',
                explain: '控制td的domProps',
                type: 'object',
                default: '-',
            },
            {
                prop: 'nativeOn',
                explain: '控制td的nativeOn',
                type: 'object',
                default: '-',
            },
            {
                prop: 'on',
                explain: 'on',
                type: 'object',
                default: '-',
            },
            {
                prop: 'render',
                explain: '自定义渲染',
                type: 'Function:render( h, { row, column, index, axis })=>{}',
                default: '-',
            },
            {
                prop: 'renderHeader',
                explain: '自定义渲染',
                type: 'Function:render( h, { row, column, index, axis })=>{}',
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
                prop: 'children',
                explain: '子级',
                type: 'array',
                default: '[]',
            },

            ]
        }
    },

    data() {
        return {
            data10: [],
            bool:false,
            switchs: {
                stripe: true,
                border: true,
                showThead: true,
                highlightRow: true,
                hover: true,
                loading: false,
                responsive: true,
                ellipsis: false,
                radio: true,
                multiSort: false,
                multiFilter: false,
                radio: true,
            },
            selects: {
                size: 'default'
            },
            options: {
                size: ['default', 'small', 'large', '60', '100'],
            },
            columns1: [],
            data1: [{
                name: 'John Brown',
                age: 18,
                address: 'New York No. 1 Lake Park',
                date: '2016-10-03'
            },
            {
                name: 'Jim Green',
                age: 24,
                address: 'London No. 1 Lake Park',
                date: '2016-10-01',
            },
            {
                name: 'Joe Black',
                age: 30,
                address: 'Sydney No. 1 Lake Park',
                date: '2016-10-02'
            },
            {
                name: 'Jon Snow',
                age: 26,
                address: 'Ottawa No. 2 Lake Park',
                date: '2016-10-04'
            }
            ],

            columns11: [{
                title: 'Name',
                key: 'name',
                width: 200,
                fixed: 'left',
                filters: [{
                    label: 'Joe',
                    value: 1
                },
                {
                    label: 'John',
                    value: 2
                }
                ],
                attrs: function (columns, row, axis) {
                    if (axis[1] === 1) {
                        return {
                            rowSpan: 3
                        }
                    }
                    if (axis[1] >= 2 && axis[1] <= 3) return false;
                },
                filterMethod(value, row) {
                    if (value === 1) {
                        return row.name === 'Joe';
                    } else if (value === 2) {
                        return row.name === 'John Brown';
                    }
                }
            },
            {
                title: 'Other',
                align: 'center',
                children: [{
                    title: 'Age',
                    key: 'age',
                    align: 'center',
                    width: 200,
                    sortable: true,
                    attrs: function (columns, row, axis) {
                        if (axis[1] === 1) {
                            return {
                                rowSpan: 3
                            }
                        }
                        if (axis[1] >= 2 && axis[1] <= 3) return false;
                    },
                },
                {
                    title: 'Address',
                    align: 'center',
                    children: [{
                        ellipsis:true,
                        title: 'Street',
                        key: 'street',
                        align: 'center',
                    },
                    {
                        title: 'Block',
                        align: 'center',
                        children: [{
                            title: 'Building',
                            key: 'building',
                            align: 'center',
                            width: 200,
                            sortable: true
                        },
                        {
                            title: 'Door No.',
                            key: 'door',
                            align: 'center',
                            width: 200
                        }
                        ]
                    }
                    ]
                }
                ]
            },
            {
                title: 'Company',
                align: 'center',
                children: [{
                    title: 'Company Address',
                    key: 'caddress',
                    align: 'center',
                    width: 200
                },
                {
                    title: 'Company Name',
                    key: 'cname',
                    align: 'center',
                    width: 200
                }
                ]
            },
            {
                title: 'Gender',
                key: 'gender',
                width: "20%",
                align: 'center',
            },
            {
                title: 'Gender',
                key: 'gender',
                align: 'center',
                width: 200,
                fixed: 'right'
            }
            ],

        };
    },
};
</script>
