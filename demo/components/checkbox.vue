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
            <vCheckBox
                v-model="model"
                trueValue="1"
                v-bind="attrs"
            >vCheckBox</vCheckBox>
            <vCheckBox
                v-bind="attrs"
                v-model="model"
                trueValue="3"
            ></vCheckBox>
            <vCheckBox
                v-bind="attrs"
                v-model="model"
                trueValue="6"
                size='auto'
            >
                <vButton
                    slot='content'
                    slot-scope="{active}"
                    :theme="active?'primary':'default'"
                >active</vButton>
            </vCheckBox>
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
			model: [],
			switchs: {
				indeterminate: false,
				disabled: false,
				strict: true,
			},
			selects: {

			},
			options: {

			},
			inputs: {
				name: "name",
				label: "label",
				trueValue: true,
				size: 16
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
				prop: 'name',
				explain: 'name',
				type: 'String',
				default: '-',
			},
			{
				prop: 'value',
				explain: 'v-model:value',
				type: '	any',
				default: 'false',
			},
			{
				prop: 'size',
				explain: '尺寸：small, large, default;',
				type: 'String',
				default: 'default',
			},
			{
				prop: 'trueValue',
				explain: 'trueValue',
				type: '[String, Number, Boolean]',
				default: '-',
			},

			{
				prop: 'slot:name',
				explain: '显示checkbox：active="checked"',
				type: 'VNODE:slot',
				default: '-',
			},
			{
				prop: 'slot',
				explain: '显示文本',
				type: 'VNODE:slot',
				default: '-',
			},
			{
				prop: 'slot:prefix',
				explain: '前缀',
				type: 'VNODE:slot',
				default: '-',
			},

			{
				prop: 'indeterminate',
				explain: 'indeterminate',
				type: 'Boolean',
				default: 'false',
			},
			{
				prop: 'disabled',
				explain: 'disabled',
				type: 'Boolean',
				default: 'false',
			},
			{
				prop: 'strict',
				explain: 'use strict ',
				type: 'Boolean',
				default: 'true',
			},

			{
				prop: 'on-change',
				explain: 'on-change ',
				type: 'Function:(val, event)',
				default: '-',
			},
			{
				prop: 'on-validate',
				explain: 'FormItem:on-validate ',
				type: 'Function:(model)',
				default: '-',
			},
			]
		}
	},

};
</script>
