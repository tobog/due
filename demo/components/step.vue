<style lang="scss" scoped>
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Steps 步骤条)</h2>
			<h4 class="padding-top-10">拆分某项流程的步骤，引导用户按流程完成任务。</h4>
		</vCol>
		<vCol lg="24" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
			<vInputNumber v-model="val" class="width-20per" scroll>
				<span slot="prepend">val</span>
			</vInputNumber>
		</vCol>
		<vCol lg="24" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vSteps v-bind="formData" :startIndex="1" :value="val" style="min-height:600px;padding:60px">
					<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
					<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
					<vStep title="待进行" desc="这里是该步骤的描述信息">
						<vSteps v-bind="formData" :startIndex="6" slotType="pre"  slot="pre">
							<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
							<vStep title="进行中" desc="这里是该步骤的描述信息">
								<vSteps v-bind="formData" :startIndex="9"  slotType="pre" slot="pre" startOrigin>
									<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
									<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
								</vSteps>
								<vSteps v-bind="formData" status="error" :startIndex="13" slotType="next" slot="next">
									<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
									<vStep title="进行中" desc="这里是该步骤的描述信息">
										<vSteps v-bind="formData" :startIndex="18" slotType="next" slot="next" >
											<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
										</vSteps>
										<vSteps v-bind="formData" :startIndex="77" slotType="pre" slot="pre" >
											<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
											<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
										</vSteps>
									</vStep>
								</vSteps>
							</vStep>
							<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
						</vSteps>
						<vSteps v-bind="formData" :startIndex="30"   slotType="next" slot="next">
							<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
							<vStep title="待进行" desc="这里是该步骤的描述信息">
								<vSteps v-bind="formData" status="error" :startIndex="55"  slotType="next" slot="next">
									<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
								</vSteps>
								<vSteps v-bind="formData" :startIndex="61" slotType="pre" slot="pre">
									<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
									<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
								</vSteps> 
							</vStep>
						</vSteps>
					</vStep>
				</vSteps>
				<vSteps v-bind="formData"
					:startIndex="1"
					:value="val"
					status="error"
					direction="vertical"
					style="padding:60px;padding-left:50%"
				>
					<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
					<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
					<vStep title="待进行" desc="这里是该步骤的描述信息">
						<vSteps v-bind="formData" :startIndex="9" :value="val" slot="next">
							<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
							<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
						</vSteps>
						<vSteps v-bind="formData" :startIndex="61" :value="val" slot="pre">
							<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
							<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
						</vSteps>
					</vStep>
					<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
				</vSteps>
				{{ val }}
			</section>
		</vCol>
		<vCol span="24" class="demo-code">
			<pre v-highlight>
				<code v-text="getFormatCode" class="html"></code>
			</pre>
		</vCol>
		<vCol span="24" class="demo-props">
			<h2 class="demo-header">Props & Events</h2>
			<vTable :columns="getTableColumns" :data="compProps" class="demo-table" border stripe></vTable>
		</vCol>
	</vRow>
</template>


<script>
export default {
	// ${this.getCodeString(this.formData)}
	data() {
		return {
			val: 7,
			val1: 4
		};
	},
	methods: {},
	computed: {
		getCode() {
			return `<vSteps v-bind="formData" :startIndex="1" :value="val" style="min-height:600px;padding:60px">
						<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
						<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
						<vStep title="待进行" desc="这里是该步骤的描述信息">
							<vSteps v-bind="formData" :startIndex="6" :value="val" direction="vertical" slot="pre">
								<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
								<vStep title="进行中" desc="这里是该步骤的描述信息">
									<vSteps v-bind="formData" :startIndex="9" :value="val" slot="pre">
										<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
										<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
									</vSteps>
									<vSteps v-bind="formData" status="error" :startIndex="13" :value="val" slot="next">
										<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
										<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
										<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
									</vSteps>
								</vStep>
								<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
							</vSteps>
							<vSteps v-bind="formData" :startIndex="30" :value="val" direction="vertical" slot="next">
								<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
								<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
							</vSteps>
						</vStep>
					</vSteps>
					<vSteps v-bind="formData"
						:current="1"
						:value="val"
						status="error"
						direction="vertical"
						style="padding:60px;padding-left:50%"
					>
						<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
						<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
						<vStep title="待进行" desc="这里是该步骤的描述信息">
							<vSteps v-bind="formData" :current="9" :value="val" slot="next">
								<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
								<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
								<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
							</vSteps>
							<vSteps v-bind="formData" :current="61" :value="val" slot="pre">
								<vStep title="已完成" desc="这里是该步骤的描述信息"></vStep>
								<vStep title="进行中" desc="这里是该步骤的描述信息"></vStep>
								<vStep title="待进行" desc="这里是该步骤的描述信息"></vStep>
							</vSteps>
						</vStep>
					</vSteps>`;
		},
		getBase() {
			return [
				{
					label: "显示箭头",
					key: "showArrow",
					tag: "vSwitch",
					default: true
				},
			];
		},
		compProps() {
			return [
				{
					explain: "当前步骤的状态，可选值为wait、process、finish、error",
					prop: "status",
					type: "String",
					default: "process"
				},
				{
					explain: "当前步骤，从 0 开始计数",
					prop: "startIndex",
					type: "Number",
					default: 0
				},
				{
					explain: "显示箭头",
					prop: "showArrow",
					type: "Boolean",
					default: false
				},
				{
					explain: "步骤条的方向，可选值为horizontal（水平）或vertical（垂直）",
					prop: "direction",
					type: "String",
					default: "horizontal"
				},
				{
					explain: "是否起始点,当有多个step组合时",
					prop: "startOrigin",
					type: "Boolean",
					default: false
				},
				{
					explain: "组件作为slot:(next,pre)时最好指定slotTYpe的值和slot一直",
					prop: "slotTYpe",
					type: "String",
					default: "-"
				},
				{
					explain: "步骤的状态，可选值为wait、process、finish、error，不设置时自动判断",
					prop: "Step:status",
					type: "String",
					default: "wait"
				},
				{
					explain: "标题",
					prop: "Step:title",
					type: "String",
					default: "-"
				},
				{
					explain: "自定义步骤的标题",
					prop: "Step:slot:defalut",
					type: "String",
					default: "-"
				},
				{
					explain: "步骤的详细描述",
					prop: "Step:desc",
					type: "String",
					default: "-"
				},
				{
					explain: "自定义步骤的详细描述",
					prop: "Step:slot:desc",
					type: "String",
					default: "-"
				},

				{
					explain: "步骤的图标",
					prop: "Step:icon",
					type: "String",
					default: "-"
				},
				{
					explain: "自定义步骤的图标",
					prop: "Step:slot:icon",
					type: "String",
					default: "-"
				},
				{
					explain: "下级步骤条，左侧和上侧定义",
					prop: "Step:slot:pre",
					type: "String",
					default: "-"
				},
				{
					explain: "下级步骤条，右侧和下侧定义",
					prop: "Step:slot:next",
					type: "String",
					default: "-"
				},
			];
		}
	}
};
</script>
