
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
            <vLoading v-bind="attrs">
				<div slot="label">title</div>
			</vLoading>
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
			val: '',
			val1: '',
			switchs: {
				loading: true,
				fullscreen: true,
				fix: false,
				transfer: false,
				closable: true
			},
			selects: {

			},
			options: {

			},
			inputs: {

			},
		};
	},
	mounted() {
		this.id = this.$VLoading.init({
			render(h) {
				return "<div>title</div>"
			}
		})
		console.log(this.id)

		setTimeout(() => {
			this.$VLoading.hide(this.id);
		}, 5000)
		setTimeout(() => {
			this.$VLoading.show(this.id);
		}, 10000)
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
					prop: 'fix',
					explain: '是否固定，需要父级有relative或absolute',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'transfer',
					explain: '位于body下',
					type: 'Boolean',
					default: '',
				},
				{
					prop: 'fullscreen',
					explain: 'fullscreen',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'loading',
					explain: 'loading',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'closable',
					explain: 'closable',
					type: 'Boolean',
					default: '-',
				},
				{
					prop: 'config|init|hide|show|destroy',
					explain: '通过直接调用以下方法来使用组件',
					type: 'Function:options',
					default: 'options',
				},
			]
		}
	},
};
</script>

