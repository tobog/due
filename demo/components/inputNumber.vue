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

            <vInputNumber
                v-bind="attrs"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                v-model="val.value"></vInputNumber>
        </section>
        <h2 class="title">Props & Events #</h2>
        <vTable
            :vals="val"
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
			val: {
				value: ""
			},
			switchs: {
				disabled: false,
			},
			selects: {

			},
			options: {

			},
			inputs: {
				prefix: "prefix",
				name: "name",
				min: 4,
				max: 128,
				sep: "2",
				precision: 1,
				inputStyle: ""
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
			}
			]
		},
		data() {
			return [{
				prop: 'name',
				explain: 'name',
				type: 'String',
				default: '',
			},
			{
				prop: 'value',
				explain: '绑定的值，可使用 v-model 双向绑定',
				type: 'String|Number',
				default: '',
			},
			{
				prop: '$attrs',
				explain: '继承$attrs',
				type: 'object',
				default: '-',
			},
			{
				prop: 'slot：prefix',
				explain: '输入框头部图标',
				type: 'String',
				default: '-',
			},
			{
				prop: 'suffix',
				explain: '输入框尾部图标',
				type: 'String',
				default: '-',
			},

			{
				prop: 'slot：prepend',
				explain: 'input 前缀',
				type: '-',
				default: '-',
			},
			{
				prop: 'slot：append',
				explain: 'input 后缀',
				type: '-',
				default: '-',
			},

			{
				prop: 'on-change',
				explain: '事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},

			{
				prop: 'on-focus',
				explain: '事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},
			{
				prop: 'on-blur',
				explain: '事件',
				type: 'Function:val,event=>{}',
				default: '-',
			},

			]
		}
	},
};
</script>
