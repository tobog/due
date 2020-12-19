<style lang="scss">
.demo-badge {
    width: 42px;
    height: 42px;
    background: #eee;
    border-radius: 6px;
    display: inline-block;
}
</style>
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
            <vBadge v-bind="attrs"></vBadge>
            <vBadge v-bind="attrs"> <a href="#" class="demo-badge"></a></vBadge>
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
                    prop: 'label',
                    explain: 'label',
                    type: 'Number, String',
                    default: '-',
                },
                {
                    prop: 'overLabel',
                    explain: 'overLabel',
                    type: 'Number',
                    default: '99',
                },
                {
                    prop: 'offset',
                    explain: '偏移位置:[]',
                    type: 'Array',
                    default: '-',
                },
                {
                    prop: 'type',
                    explain: 'success、primary、default、error、warning、info',
                    type: 'String',
                    default: '-',
                },
                {
                    prop: 'progress',
                    explain: 'progress',
                    type: 'Boolean',
                    default: '-',
                },
                 {
                    prop: 'visible',
                    explain: '控制label 显示',
                    type: 'Boolean',
                    default: 'true',
                },
                {
                    prop: 'format',
                    explain: '控制label格式',
                    type: 'Function',
                    default: '(label, overLabel)=>string',
                },
                {
                    prop: 'slot',
                    explain: '显示内容',
                    type: 'VNode',
                    default: '-',
                },
                {
                    prop: 'slot:label',
                    explain: '显示内容label',
                    type: 'VNode',
                    default: '-',
                }
            ]
        }
    },
    data() {
        return {
            switchs: {
                visible: true,
                progress: true,
                visible:true,
            },
            selects: {
                type: 'default',
            },
            options: {
                type: ['success', 'info', 'warning', 'error','primary','default']
            },
            inputs:{
                label:10,
                overLabel:99,
            },
        };
    },
};
</script>
