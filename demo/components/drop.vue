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
            <vButton @click="value=!value" ref="btn">vButton</vButton>
            <vDrop
                v-show="value"
                :reference="($refs.btn||{}).$el"
                v-bind="attrs"
                style="height:100px;overflow:auto;line-height:2">
                <div style="width:100px;">111111</div>
                <div>2222</div>
            </vDrop>
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
                transfer: true,
            },
            selects: {

            },
            options: {

            },
            inputs: {
                transition: "transition-drop",
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
                    prop: 'transfer',
                    explain: "是否在body下",
                    type: 'Boolean',
                    default: '-',
                },
                {
                    prop: 'reference',
                    explain: '参照对象',
                    type: 'HTMLElement',
                    default: '-',
                },
                {
                    prop: 'transition',
                    explain: '动画类型',
                    type: 'String',
                    default: 'transition-drop',
                },
                {
                    prop: '$listeners',
                    explain: '继承事件$listeners',
                    type: 'Object',
                    default: '-',
                },
                {
                    prop: '$attrs',
                    explain: 'v-offset-dom={transfer,reference,options:$attrs}',
                    type: 'Object',
                    default: '-',
                },
            ]
        }
    },
};
</script>
