<style>
.demo-vbread-separator {
  color: #ff5500;
  padding: 0 5px;
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
            <vBread v-bind="attrs">
                <vBreadItem href="/">
                    <vIcon type="ios-home-outline"></vIcon> Home
                </vBreadItem>
                <vBreadItem to="/components/vbread">
                    <vIcon type="social-buffer-outline"></vIcon> Components
                </vBreadItem>
                <vBreadItem>
                    <vIcon type="pound"></vIcon> vBread
                </vBreadItem>
            </vBread>
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
				prop: 'sep',
				explain: 'separator:分隔符',
				type: 'String:html',
				default: '-',
			},
			{
				prop: '$attrs',
				explain: 'BreadItem:继承属性，o, href, tag...',
				type: 'object',
				default: '-',
			}
			]
		}
	},
	data() {
		return {
			switchs: {

			},
			selects: {

			},
			options: {

			},
			inputs: {
				sep: '/',
			},
		};
	},
};
</script>
