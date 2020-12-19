

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
            <vButton  @click="vLoadingBar('config')">config</vButton>
			<vButton  @click="vLoadingBar('start')">start</vButton>
			<vButton  @click="vLoadingBar('update')">update</vButton>
			<vButton  @click="vLoadingBar('finish')">finish</vButton>
			<vButton  @click="vLoadingBar('error')">error</vButton>
			<vButton  @click="vLoadingBar('destroy')">destroy</vButton>
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
			switchs: {
	
			},
			selects: {

			},
			options: {

			},
			inputs: {
				height: 3,
				color: 'green',
				failColor: 'red',
				config: {
					percent: 60,
					visible: false,
				}
			},
		};
	},
	methods: {
		vLoadingBar(type = 'init') {
			this.$VLoadingBar[type](this.attrs.percent);
		},
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
			return [
				{
					prop: 'percent',
					explain: 'percent',
					type: 'Number',
					default: 0,
				},
				{
					prop: 'status',
					explain: '',
					type: 'String',
					default: 'error|success',
				},
				{
					prop: 'visible',
					explain: '是否展示',
					type: 'Boolean',
					default: 'true',
				},
				{
					prop: 'config|start|update|finish|error|destroy',
					explain: '通过直接调用以下方法来使用组件',
					type: 'Function:options',
					default: 'options',
				},
			]
		}
	},
};
</script>

