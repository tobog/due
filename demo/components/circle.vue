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
            <vCircle v-bind="attrs" ref="vCircle">vCircle</vCircle>
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
			switchs: {

			},
			selects: {
				strokeLinecap: "round",
			},
			options: {
				strokeLinecap: ['square', 'round', 'butt', 'inherit']
			},
			inputs: {
				percent: 30,
				strokeColor: "red",
				strokeWidth: 6,
				trackWidth: 5,
				trackColor: '#ccc',
				size: 120,
				path: "",
				length: 10
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
				prop: 'percent',
				explain: 'percent',
				type: 'Number',
				default: '0',
			},
			{
				prop: 'size',
				explain: '宽高',
				type: 'Number',
				default: '120',
			},
			{
				prop: 'strokeWidth',
				explain: 'strokeWidth',
				type: 'Number',
				default: '6',
			},
			{
				prop: 'strokeColor',
				explain: 'strokeColor',
				type: 'String',
				default: '-',
			},
			{
				prop: 'trackWidth',
				explain: 'trackWidth',
				type: 'Number',
				default: '5',
			},
			{
				prop: 'strokeLinecap',
				explain: 'strokeLinecap',
				type: "['square', 'round', 'butt', 'inherit']",
				default: 'round',
			},

			{
				prop: 'path',
				explain: 'path"',
				type: 'String',
				default: '-',
			},
			{
				prop: 'length',
				explain: 'the length of path',
				type: 'Number',
				default: '-',
			},
			]
		}
	},

};
</script>
