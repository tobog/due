
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
                <vSelect v-model="selects[key]" transfer>
                    <vOption
                        v-for="(val,index) of options[key]"
                        :value='val'
                        :key="index"
                    ></vOption>
                </vSelect>
            </vFormItem>
            <vFormItem
                v-for="(item,key) of inputs"
                :key="key"
                label-width="100"
                :label="key"
            >
                <vInput v-model="inputs[key]">
                </vInput>
            </vFormItem>
        </vForm>
        <section class="example">
            <div style="padding:10px 0;">视图：</div>
            <vDatepicker v-model="value" v-bind="attrs"></vDatepicker>
        </section>
        <h2 class="title">Props & Events #</h2>
        <vTable
            :columns='columns'
            :data="data"
            style="width:100%"
            border
            stripe
        ></vTable>
    </main>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            switchs: {
                confirm: true,
                multiple: true,
                transfer: true,
                showWeek: true,
            },
            selects: {
                type: 'daterange'
            },
            options: {
                type: [
                    'date',
                    'daterange',
                    'datetime',
                    'datetimerange',
                    'year',
                    'month',
                    'times',
                    'timesrange',
                    'hours',
                    'hoursrange',
                ]
            },
            inputs: {
                format: "",
                options: {},
                startDate: '',
            },
        };
    },
    computed: {
        attrs() {
            return {
                ...this.selects,
                ...this.switchs,
                ...this.inputs,
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
                  width: '50%'
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
                prop: 'type',
                explain: "['date','daterange','datetime','datetimerange','year','month','times','timesrange','hours','hoursrange',]",
                type: 'String',
                default: 'true',
            },
            {
                prop: 'value',
                explain: '当前激活的面板的 name，可以使用 v-model 双向绑定',
                type: '[String, Array, Date]',
                default: '-',
            },
            {
                prop: 'format',
                explain: 'y|d|m|H|M|S 组成',
                type: 'String',
                default: '-',
            },
            {
                prop: 'confirm',
                explain: '是否显示底部控制栏，开启后，选择完日期，选择器不会主动关闭，需用户确认后才可关闭',
                type: 'Boolean',
                default: 'true',
            },
            {
                prop: 'options',
                explain: 'options：shortcuts',
                type: 'Object',
                default: '{}',
            },
            {
                prop: 'multiple',
                explain: '选择器额外配置，比如不可选日期与快捷选项',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'showWeek',
                explain: '	开启后，可以显示星期数。',
                type: 'Boolean',
                default: 'false',
            },
            {
                prop: 'startDate',
                explain: '	设置默认显示的起始日期。',
                type: 'String, Date, Object, Number',
                default: 'Date.now()',
            },
            {
                prop: '$attrs',
                explain: 'Input 继承$attrs',
                type: 'Object',
                default: 'Date.now()',
            },
            {
                prop: 'on-change/on-blur/on-foucs',
                explain: '事件',
                type: 'Function:this.model, news, event=>{}',
                default: '-',
            },
            ]
        }
    },
};
</script>



