<style lang="scss">
.vview-col {
  border: 1px solid red;
  line-height: 60px;
  text-align: center;
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
            <vRow>
                <vCol
                    :xs="2"
                    :sm="4"
                    :md="6"
                    :lg="8">Col</vCol>
                <vCol
                    :xs="2"
                    :sm="4"
                    :md="6"
                    :lg="8">Col</vCol>
                <vCol span="6" offset="8">col-6 | offset-8</vCol>
                <vCol span="6" offset="4">col-6 | offset-4</vCol>
            </vRow>
            <vRow>
                <vCol span="18" push="6">col-18 | push-6</vCol>
                <vCol span="6" pull="18">col-6 | pull-18</vCol>
            </vRow>
            <vRow :gutter="16">
                <vCol
                    span="6"
                    :xs="2"
                    :sm="4"
                    :md="6"
                    :lg="8">
                    <div style="background: rgba(0,153,229,.9);">col-6</div>
                </vCol>
                <vCol
                    span="6"
                    :xs="2"
                    :sm="4"
                    :md="6"
                    :lg="8">
                    <div style="background: rgba(0,153,229,.9);">col-6</div>
                </vCol>
                <vCol
                    span="6"
                    :xs="2"
                    :sm="4"
                    :md="6"
                    :lg="8">
                    <div style="background: rgba(0,153,229,.9);">col-6</div>
                </vCol>
                <vCol
                    span="6"
                    :xs="2"
                    :sm="4"
                    :md="6"
                    :lg="8">
                    <div style="background: rgba(0,153,229,.9);">col-6</div>
                </vCol>
            </vRow>
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

			},
			selects: {

			},
			options: {

			},
			inputs: {
				span: 2,
				offset: 2,
				push: 2,
				grid: 2,
				gutter: 2,
				pull: 2,
				xs: 3,
				sm: 3,
				md: 3,
				lg: 3
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
			return [
				{
					prop: 'grid',
					explain: 'Row:总栅格数',
					type: '[Number, String]',
					default: '24',
				},
				{
					prop: 'gutter',
					explain: 'Row:栅格间距，单位 px，左右平分',
					type: '[Number, String]',
					default: '-',
				},
				{
					prop: 'span',
					explain: '栅格的占位格数，可选值为0~grid的整数，为 0 时，相当于display:none',
					type: '[Number, String]',
					default: '-',
				},
				{
					prop: 'offset',
					explain: '栅格左侧的间隔格数，间隔内不可以有栅格',
					type: '[Number, String]',
					default: '-',
				},
				{
					prop: 'push',
					explain: '栅格向右移动格数',
					type: '[Number, String]',
					default: '-',
				},
				{
					prop: 'grid',
					explain: '总栅格数',
					type: '[Number, String]',
					default: '24',
				},

				{
					prop: 'gutter',
					explain: '栅格间距，单位 px，左右平分',
					type: '[Number, String]',
					default: '-',
				},
				{
					prop: 'pull',
					explain: '栅格向左移动格数',
					type: '[Number, String]',
					default: '-',
				},

				{
					prop: 'xs',
					explain: '	<768px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},
				{
					prop: 'xs',
					explain: '	≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},
				{
					prop: 'md',
					explain: '	≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},
				{
					prop: 'lg',
					explain: '	≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象',
					type: ' [Number, String, Object]',
					default: '-',
				},

			]
		}
	},
};
</script>
