<style lang="scss">
// .div{
// 	text-align: justify;
// }
// .div i{ display:inline-block;width:100%;}
</style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <!-- <div class="div">这世间唯有梦想和好姑娘不可辜负！<i></i></div> -->
            <h2>代码示例 (Form 表单)</h2>
            <h4 class="padding-top-10">
                具有数据收集、校验和提交功能的表单，包含复选框、单选框、输入框、下拉选择框等元素。
            </h4>
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
                <vForm>
                    <vFormItem v-bind="formData" label="rules 测试">
                        <vTextarea v-model="formData.rules" />
                    </vFormItem>
                    <vFormItem v-bind="formData" label="测试测试">
                        <vTextarea v-model="formData.rules" />
                    </vFormItem>
                    <vFormItem v-bind="formData" label="测试">
                        <vTextarea v-model="formData.rules" />
                    </vFormItem>
                    <vFormItem v-bind="formData" label="labelWidth" required prop="labelWidth">
                        <vInput v-model="formData.labelWidth" />
                    </vFormItem>
                    <vFormItem v-bind="formData" label="labelWidth">
                        <vInput v-model="formData.labelWidth" />
                    </vFormItem>
                </vForm>
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
            value: "",
            formItem: {},
        };
    },
    computed: {
        getCode() {
            return `<vForm>
						<vFormItem v-bind="formData" label="rules">
							<vTextarea v-model="formData.rules" />
						</vFormItem>
						<vFormItem v-bind="formData" label="labelWidth" required>
							<vInput v-model="formData.labelWidth" />
						</vFormItem>
						<vFormItem v-bind="formData" label="labelWidth">
							<vInput v-model="formData.labelWidth" />
						</vFormItem>
					</vForm>
							`;
        },
        getBase() {
            return [
                {
                    label: "行内表单",
                    key: "inline",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "反向布局",
                    key: "reverse",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "错误定位",
                    key: "errorInview",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "label垂直对齐位",
                    key: "vertical",
                    tag: "vSelect",
                    default: "center",
                    options: ["center", "start", "end", "baseline", "stretch"],
                },
                {
                    label: "label对齐",
                    key: "align",
                    tag: "vSelect",
                    // default: "",
                    options: ["center", "left", "right", "justify"],
                },
                {
                    label: "标签的宽度",
                    key: "labelWidth",
                    tag: "vInput",
                    // default: ''
                },
            ];
        },
        compProps() {
            return [
                {
                    prop: "rules",
                    explain: "表单验证规则，具体配置查看 async-validator",
                    type: "Object",
                    default: "-",
                },
                {
                    prop: "labelWidth",
                    explain: "表单域标签的宽度，所有的 FormItem 都会继承 Form 组件的 label-width 的值",
                    type: "Number|String",
                    default: "",
                },
                {
                    prop: "inline",
                    explain: "是否开启行内表单模式",
                    type: "Boolean",
                    default: false,
                },
                {
                    prop: "errorInview",
                    explain: "错误自动定位显示",
                    type: "Boolean",
                    default: true,
                },
                {
                    prop: "resetValidate",
                    explain: "清除所有子表单验证消息",
                    type: "Function",
                    default: "()=>{}",
                },
                {
                    prop: "validate",
                    explain: "验证所有表单验证",
                    type: "Function:Promise",
                    default: "(cb)=>{}",
                },
                {
                    prop: "validateField",
                    explain: "验证单一表单字段",
                    type: "Function",
                    default: "(prop, cb)=>{}",
                },
                {
                    prop: "on-submit",
                    explain: "submit 提交",
                    type: "event",
                    default: "-",
                },
                {
                    prop: "slot:default",
                    explain: "提供子表单项目",
                    type: "VNode",
                    default: "-",
                },
                {
                    prop: "FormItem:inline",
                    explain: "FormItem: 是否开启行内表单模式",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "FormItem:tip",
                    explain: "FormItem:提示",
                    type: "String|html",
                    default: "tip",
                },
                {
                    prop: "FormItem:rules",
                    explain: "FormItem: 表单的验证规则",
                    type: "Array",
                    default: "-",
                },
                {
                    prop: "FormItem:prop",
                    explain: "FormItem:表单name，提供验证",
                    type: "Array",
                    default: "-",
                },
                {
                    prop: "FormItem:labelWidth",
                    explain: "FormItem:表单域标签的的宽度",
                    type: "Number|String",
                    default: "",
                },
                {
                    prop: "FormItem:label",
                    explain: "FormItem:标签文本",
                    type: "String",
                    default: "",
                },
                {
                    prop: "FormItem:align",
                    explain: "FormItem:标签文本位置:right,center,left",
                    type: "String",
                    default: "",
                },
                {
                    prop: "FormItem:vertical",
                    explain: "FormItem:标签文本垂直对齐位置:center,start,end,baseline,stretch",
                    type: "String",
                    default: "center",
                },
                {
                    prop: "FormItem:required",
                    explain: "FormItem:是否必填，如不设置，则会根据校验规则自动生成",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "FormItem:slot:label",
                    explain: "FormItem:自定义label",
                    type: "VNode",
                    default: "prop:label",
                },
                {
                    prop: "FormItem:slot:default",
                    explain: "FormItem:提供子表单项目",
                    type: "VNode:slot",
                    default: "-",
                },
                {
                    prop: "FormItem:slot:default",
                    explain: "FormItem:提供子表单项目",
                    type: "VNode:slot",
                    default: "-",
                },
                {
                    prop: "FormItem:value",
                    explain: "自定义传入验证数据",
                    type: "Any",
                    default: "-",
                },
                {
                    prop: "FormItem:resetValidate",
                    explain: "清除表单验证消息",
                    type: "Function",
                    default: "()=>{}",
                },

                {
                    prop: "FormItem:validate",
                    explain: "验证表单验证",
                    type: "Function:Promise",
                    default: "(val,cb)=>{}",
                },
            ];
        },
    },
};
</script>
