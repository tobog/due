<template>
    <main style="padding:20px 0;" class="examples-main clearfix">
        <vForm class="example" vertical>
            <div style="padding:10px 0;">参数：</div>
            <vFormItem
                v-for="(item,key) of switchs"
                :key="key"
                label-width="100"
                :label="key">
                <vSwitch v-model="switchs[key]" />
            </vFormItem>
            <vFormItem
                v-for="(item,key) of selects"
                :key="key"
                label-width="100"
                :label="key">
                <vSelect v-model="selects[key]" transfer>
                    <vOption
                        v-for="(val,index) of options[key]"
                        :value='val'
                        :key="index"></vOption>
                </vSelect>
            </vFormItem>
            <vFormItem
                v-for="(item,key) of inputs"
                :key="key"
                label-width="100"
                :label="key">
                <vInput v-model="inputs[key]">
                </vInput>
            </vFormItem>
        </vForm>
        <section class="example">
            <vForm  ref="vForm">
                <vFormItem v-bind="attrs" label="rules">
                    <vInput v-model="attrs.rules" type="textarea" />
                </vFormItem>
                <vFormItem v-bind="attrs" label="labelWidth">
                    <vInput v-model="attrs.labelWidth" type="number" />
                </vFormItem>
                <vFormItem v-bind="attrs" label="inline">
                    <vSwitch v-model="attrs.inline"></vSwitch>
                </vFormItem>
            </vForm>
        </section>
        <h2 class="title">Props & Events #</h2>
        <vTable
            :columns='columns'
            :data="data"
            style="width:100%"
            border
            stripe></vTable>
    </main>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            switchs: {
                inline: true,
                required: false,
            },
            selects: {
               
            },
            options: {
               
            },
            inputs: {
				labelWidth: 100,
				label:"",
				tip:"tip",
				prop:"prop"
            },
        };
    },
    mounted() {
       
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
                    prop: 'rules',
                    explain: 'form 表单的验证规则',
                    type: 'Array',
                    default: '-',
                },
                {
                    prop: 'labelWidth',
                    explain: 'label宽度',
                    type: 'Number|String',
                    default: '',
                },
                {
                    prop: 'inline',
                    explain: '表单inline',
                    type: 'Boolean',
                    default: 'false',
                },
                {
                    prop: 'slot：default',
                    explain: '提供子表单项目',
                    type: 'VNode：slot',
                    default: '-',
                },
                {
                    prop: 'resetValidate',
                    explain: '清除所有子表单验证消息',
                    type: 'Function:value',
                    default: 'value',
                },
                {
                    prop: 'validate',
                    explain: '验证所有表单验证',
                    type: 'Function:Promise',
                    default: 'valid',
                },
                {
                    prop: 'validateField',
                    explain: '验证单一表单',
                    type: 'Function:',
                    default: 'prop',
                },

                {
                    prop: 'rules',
                    explain: 'FormItem: 表单的验证规则',
                    type: 'Array',
                    default: '-',
                },
                {
                    prop: 'prop',
                    explain: 'FormItem:表单name',
                    type: 'Array',
                    default: '-',
                },
                {
                    prop: 'labelWidth',
                    explain: 'FormItem:label宽度',
                    type: 'Number|String',
                    default: '',
                },
                {
                    prop: 'label',
                    explain: 'FormItem:label',
                    type: 'String',
                    default: '',
                },
                {
                    prop: 'required',
                    explain: 'FormItem:required',
                    type: 'Boolean',
                    default: 'false',
                },
                {
                    prop: 'slot：label',
                    explain: 'FormItem:required',
                    type: 'VNode：slot',
                    default: 'label',
                },
                {
                    prop: 'slot：default',
                    explain: 'FormItem:提供子表单项目',
                    type: 'VNode：slot',
                    default: '-',
                },
            ]
        }
    },
};
</script>
