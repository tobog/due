
<style lang="scss">
</style>
<template>
	<vRow class="demo-layout" flex>
		<vCol span="24" class="demo-header">
			<h2>代码示例 (Dropdown 下拉菜单)</h2>
			<h4 class="padding-top-10">展示一组折叠的下拉菜单。</h4>
		</vCol>
		<vCol lg="14" span="24" class="demo-form">
			<Formedit :formdata="getBase" v-model="formData"></Formedit>
		</vCol>
		<vCol lg="10" span="24" class="demo-view">
			<vSwitch v-model="show" class="margin-bottom-10">
				<span slot="open">开</span>
				<span slot="close">关</span>
			</vSwitch>
			<section v-if="show">
				<vDropdown v-bind="formData">
					<vButton>vButton</vButton>
					<template slot="list">
						<vDropdownItem disabled>驴打滚</vDropdownItem>
						<vDropdownItem selected divided>炸酱面</vDropdownItem>
						<vDropdownItem selected>炸酱面</vDropdownItem>
						<vDropdownItem selected>豆汁儿</vDropdownItem>
						<vDropdownItem data-vue-module="DropdownItem">
							<vDropdown>
								<vButton>vButton</vButton>
								<template slot="list">
									<vDropdownItem selected>炸酱面</vDropdownItem>
									<vDropdownItem selected>炸酱面</vDropdownItem>
									<div data-vue-module="DropdownItem">豆汁儿</div>
									<div data-vue-module="DropdownItem">冰糖葫芦</div>
									<div data-vue-module="DropdownItem">北京烤鸭</div>
								</template>
							</vDropdown>
						</vDropdownItem>
						<div data-vue-module="DropdownItem">
							<vDropdown transfer>
								<vButton>vButton</vButton>
								<template slot="list">
									<vDropdownItem selected>炸酱面</vDropdownItem>
									<div data-vue-module="DropdownItem">豆汁儿</div>
									<div data-vue-module="DropdownItem">冰糖葫芦</div>
									<div data-vue-module="DropdownItem">北京烤鸭</div>
								</template>
							</vDropdown>
						</div>
					</template>
				</vDropdown>
				<vDropdown label="label" :autoLabel="true">
					<template slot="list">
						<vDropdownItem disabled>驴打滚</vDropdownItem>
						<vDropdownItem selected divided>酱面</vDropdownItem>
						<vDropdownItem selected>豆汁儿炸酱面</vDropdownItem>
					</template>
				</vDropdown>
				<vDropWrapper>
					<vButton>vDropWrapper</vButton>
					<template slot="list">
						<div style="width:100px;">111111</div>
						<div>2222</div>
					</template>
				</vDropWrapper>
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
			value: ""
		};
	},
	computed: {
		getCode() {
			return `<vDropdown v-bind="${this.getCodeString(this.formData)}">
										<vButton>vButton</vButton>
										<template slot="list">
											<vDropdownItem disabled>驴打滚</vDropdownItem>
											<vDropdownItem selected divided>炸酱面</vDropdownItem>
											<vDropdownItem selected>炸酱面</vDropdownItem>
											<vDropdownItem selected>豆汁儿</vDropdownItem>
											<vDropdownItem data-vue-module="DropdownItem">
												<vDropdown>
													<vButton>vButton</vButton>
													<template slot="list">
														<div data-vue-module="DropdownItem">驴打滚</div>
														<div data-vue-module="DropdownItem">炸酱面</div>
														<div data-vue-module="DropdownItem">豆汁儿</div>
														<div data-vue-module="DropdownItem">冰糖葫芦</div>
														<div data-vue-module="DropdownItem">北京烤鸭</div>
													</template>
												</vDropdown>
											</vDropdownItem>
											<div data-vue-module="DropdownItem">
												<vDropdown transfer>
													<vButton>vButton</vButton>
													<template slot="list">
														<div data-vue-module="DropdownItem">驴打滚</div>
														<div data-vue-module="DropdownItem">炸酱面</div>
														<div data-vue-module="DropdownItem">豆汁儿</div>
														<div data-vue-module="DropdownItem">冰糖葫芦</div>
														<div data-vue-module="DropdownItem">北京烤鸭</div>
													</template>
												</vDropdown>
											</div>
										</template>
									</vDropdown>
								</section>
										`;
		},
		getBase() {
			return [
				{
					label: "手动控制显示",
					key: "visible",
					tag: "vSwitch",
					default: false
				},
				{
					label: "触发方式",
					key: "trigger",
					tag: "vSelect",
					default: "click",
					options: ["click", "hover", "custom"]
				},
				{
					label: "下拉位置",
					key: "placement",
					tag: "vSelect",
					default: "bottom",
					options: this.getPlacements
				},
				{
					label: "DropdownItem",
					key: "name",
					tag: "vInput",
					default: ""
				},
				{
					label: "DropdownItem:禁用",
					key: "disabled",
					tag: "vSwitch",
					default: false
				},
				{
					label: "DropdownItem:选中状态",
					key: "selected",
					tag: "vSwitch",
					default: false
				},
				{
					label: "DropdownItem:分割线",
					key: "divided",
					tag: "vSwitch",
					default: false
				}
			];
		},
		compProps() {
			return [
				{
					explain: "手动控制显示",
					prop: "visible",
					type: "vSwitch",
					default: false
				},
				{
					explain: "触发方式",
					prop: "trigger",
					type: "vSelect",
					default: "click",
					options: ["click", "hover", "custom"]
				},
				{
					explain: "下拉位置",
					prop: "placement",
					type: "vSelect",
					default: "bottom",
					options: this.getPlacements
				},
				{
					explain: "DropdownItem:name",
					prop: "name",
					type: "vInput",
					default: ""
				},
				{
					explain: "DropdownItem:禁用",
					prop: "disabled",
					type: "Boolean",
					default: false
				},
				{
					explain: "DropdownItem:选中状态",
					prop: "selected",
					type: "Boolean",
					default: false
				},
				{
					explain: "DropdownItem:分割线",
					prop: "divided",
					type: "Boolean",
					default: false
				},
				{
					explain: "体内容",
					prop: "Dropdown:slot:default",
					type: "VNode",
					default: "-"
				},
				{
					explain: "列表内容",
					prop: "Dropdown:slot:list",
					type: "VNode",
					default: "-"
				},
				{
					prop: "Dropdown:on-change",
					explain: "点击菜单项时触发",
					type: "event",
					default: "(DropdownItem:name)=>{}"
				},
				{
					prop: "Dropdown:on-visible-change",
					explain: "菜单显示状态改变时调用",
					type: "event",
					default: "(visible)=>{}"
				}
			];
		}
	}
};
</script>
