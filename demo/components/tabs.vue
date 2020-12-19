<style lang="scss" scoped>
.tabsdemo {
    // border: 1px solid #ccc;
    margin-bottom: 30px;
}
</style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Tabs 标签页)</h2>
            <h4 class="padding-top-10">选项卡切换组件，常用于平级区域大块内容的的收纳和展现。</h4>
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
                <vTabs value="name1" v-bind="formData" class="tabsdemo">
                    <vTabPane style="height:100px" icon="logo-apple" label="标签标签一标一" name="name1"
                        >标签一的内容</vTabPane
                    >
                    <vTabPane style="height:60px" icon="logo-apple" label="标签二" name="name2">标签二的内容</vTabPane>
                    <vTabPane icon="logo-apple" label="标签三标三" name="name3">标签三的内容</vTabPane>
                    <vTabPane style="height:150px" icon="logo-apple" label="标签二标签二" name="name4">name4</vTabPane>
                    <vTabPane icon="logo-apple" label="标签二标签二" name="name5">name5</vTabPane>
                    <vTabPane icon="logo-apple" label="标签二标签二" name="name6">name5</vTabPane>
                </vTabs>
                <vTabs v-bind="formData" class="tabsdemo">
                    <vTabPane style="height:100px" label="macOS" icon="logo-apple">标签一的内容</vTabPane>
                    <vTabPane label="Windows" icon="logo-windows">标签二的内容</vTabPane>
                    <vTabPane style="height:150px" label="Linux" icon="logo-tux">标签三的内容</vTabPane>
                    <vTabPane icon="logo-apple" label="标签三标三" name="name3">标签三的内容</vTabPane>
                </vTabs>
                <vTabs v-bind="formData" class="tabsdemo">
                    <vTabPane style="height:100px" label="macOS" icon="logo-apple">标签一的内容</vTabPane>
                    <vTabPane label="Windows" icon="logo-windows">标签二的内容</vTabPane>
                    <vTabPane style="height:150px" label="Linux" icon="logo-tux">标签三的内容</vTabPane>
                    <vTabPane icon="logo-apple" label="标签三标三" name="name3">标签三的内容</vTabPane>
                    <vTabPane style="height:150px" icon="logo-apple" label="标签二标签二" name="name4">name4</vTabPane>
                    <vTabPane icon="logo-apple" label="标签二标签二" name="name5">name5</vTabPane>
                    <vTabPane icon="logo-apple" label="标签二标签二" name="name6">name5</vTabPane>
                </vTabs>
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
            // value: ""
        }
    },
    computed: {
        getCode() {
            return `<vTabs value="name1" v-bind=${this.getCodeString(this.formData)} >
					<vTabPane label="标签一" name="name1">标签一的内容</vTabPane>
					<vTabPane label="标签二" name="name2">标签二的内容</vTabPane>
					<vTabPane label="标签三" name="name3">标签三的内容</vTabPane>
				</vTabs>`
        },
        getBase() {
            return [
                {
                    label: "是否关闭",
                    key: "closable",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "自适应高度",
                    key: "adaptiveHeight",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "动画",
                    key: "animated",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "自动获得焦点",
                    key: "captureFocus",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "样式类型",
                    key: "type",
                    tag: "vSelect",
                    options: ["border", "dot"],
                },
                {
                    label: "标签颜色",
                    key: "theme",
                    tag: "vSelect",
                    options: ["confirm", "gray", "success", "primary", "warning", "error", "info", "danger"],
                },
            ]
        },
        compProps() {
            return [
                {
                    prop: "value",
                    explain: "当前激活 tab 面板的 name，可以使用 v-model 双向绑定数据",
                    type: " String|Number",
                    default: "",
                },
                {
                    prop: "type",
                    explain: "页签的基本样式，可选值为 line 和 card",
                    type: " String",
                    default: "line",
                },
                {
                    prop: "adaptiveHeight",
                    explain: "自适应高度",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "closable",
                    explain: "标签是否可以关闭",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "animated",
                    explain: "是否使用 CSS3 动画",
                    type: "Boolean",
                    default: "false",
                },
                {
                    explain: "标签颜色,confirm, gray, success, primary, warning, error, info, danger",
                    prop: "theme",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "capture-focus",
                    explain: "Tabs 内的表单类组件是否自动获得焦点",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "before-remove",
                    explain: "关闭前的函数，返回 Promise 可阻止标签关闭",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "name",
                    explain: "当嵌套使用 Tabs，指定 name 区分层级",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "on-click",
                    explain: "tab 被点击时触发",
                    type: "Function",
                    default: "name",
                },
                {
                    prop: "on-tab-remove",
                    explain: "tab 被关闭时触发",
                    type: "Function",
                    default: "name",
                },
                {
                    prop: "slot:extra",
                    explain: "附加内容",
                    type: "VNode",
                    default: "-",
                },
                {
                    prop: "slot:defalut",
                    explain: "主体内容",
                    type: "VNode",
                    default: "-",
                },
                {
                    prop: "TabPane：name",
                    explain: "用于标识当前面板，对应 value，默认为其索引值",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "TabPane：label",
                    explain: "选项卡头显示文字，支持 Render 函数。 学习 Render 函数的内容",
                    type: "String|Function",
                    default: "-",
                },
                {
                    prop: "TabPane:icon",
                    explain: "选项卡图标",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "TabPane:disabled",
                    explain: "是否禁用该选项卡",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "TabPane:closable",
                    explain: "是否可以关闭页签",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "TabPane:tab",
                    explain: "当嵌套使用 Tabs，设置该属性指向对应 Tabs 的 name 字段",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "TabPane:index",
                    explain:
                        "在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序(需大于 0)",
                    type: "Number",
                    default: "-",
                },
            ]
        },
    },
}
</script>
