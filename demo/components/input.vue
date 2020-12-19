<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Input 输入框)</h2>
            <h4 class="padding-top-10">
                基本表单组件，支持 input 和 textarea，并在原生控件基础上进行了功能扩展，可以组合使用。
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
                <vInput class="margin-bottom-20" v-bind="formData" v-model="val">
                    <div slot="prepend">http://</div>
                    <span slot="append">.com</span>
                    <vOption value="ghost"></vOption>
                    <vOption value="dashed"></vOption>
                </vInput>
                <vInput class="margin-bottom-20" v-bind="formData" v-model="val1"> </vInput>
                <vInput class="margin-bottom-20" v-bind="formData" v-model="val">
                    <div slot="prepend">http://</div>
                    <span slot="append">.com</span>
                </vInput>
                <vSelect class="margin-bottom-20" v-bind="formData" v-model="val1">
                    <span slot="append">.com</span>
                    <vInput suffix="search" />
                    <vOption value="primary">primary1</vOption>
                    <vOption value="ghost">ghost2</vOption>
                    <vOption value="dashed"></vOption>
                    <vOption value="text"></vOption>
                    <vOption value="info"></vOption>
                    <vOption value="success"></vOption>
                    <vOption value="success2"></vOption>
                </vSelect>
                <vInput class="margin-bottom-20" v-model="val2" v-bind="formData">
                    <span slot="prepend">http://</span>
                    <vInput v-model="val4" slot="append" theme="primary"></vInput>
                </vInput>
                <vInput class="margin-bottom-20" v-model="val2" v-bind="formData">
                    <template slot="prepend">
                        <!-- <vDropdown label="label" autoLabel>
                            <template slot="list">
                                <vDropdownItem disabled>驴打滚</vDropdownItem>
                                <vDropdownItem selected divided>酱面</vDropdownItem>
                                <vDropdownItem>豆汁儿炸酱面</vDropdownItem>
                            </template>
                        </vDropdown> -->
                        <vDropdown autoClose v-model="label">
                            {{ label }}
                            <template slot="list">
                                <vDropdownItem disabled>驴打滚</vDropdownItem>
                                <vDropdownItem divided>炸酱面</vDropdownItem>
                                <vDropdownItem>炸酱面</vDropdownItem>
                                <vDropdownItem>豆汁儿</vDropdownItem>
                            </template>
                        </vDropdown>
                    </template>
                    <vInput v-model="val4" slot="append" theme="primary"></vInput>
                </vInput>
                <vInput class="margin-bottom-20" v-bind="formData" type="number"></vInput>
                <vTextarea class="margin-bottom-20" v-bind="formData" v-model="val3"></vTextarea>
                <div class="padding-15">{{ val }}-{{ val1 }}-{{ val2 }}-{{ val3 }}</div>
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
            label: "label",
            val: "",
            val1: "",
            val2: "",
            val3: "",
            val4: "",
            show1: true,
        };
    },
    created() {
        setTimeout(() => {
            this.show1 = false;
        }, 5000);
    },
    computed: {
        getCode() {
            return `<vInput class="margin-bottom-20" v-bind="${this.getCodeString(this.formData)}" v-model="val">
						<div slot="prepend">http://</div>
						<span slot="append">.com</span>
					</vInput>
					<vInput class="margin-bottom-20" type="select" prefix suffix v-bind="${this.getCodeString(
                        this.formData
                    )}" v-model="val1">
						<vInput suffix="search" />
						<vOption value="primary"></vOption>
						<vOption value="ghost"></vOption>
						<vOption value="dashed"></vOption>
						<vOption value="text"></vOption>
						<vOption value="info"></vOption>
						<vOption value="success"></vOption>
						<vOption value="success"></vOption>
						<vOption value="success"></vOption>
						<vOption value="success"></vOption>
					</vInput>
					<vInput class="margin-bottom-20" v-model="val2" v-bind="${this.getCodeString(this.formData)}">
						<span slot="prepend">http://</span>
						<vInput v-model="val4" slot="append" theme="primary"></vInput>
					</vInput>
					<vInput class="margin-bottom-20" v-bind="${this.getCodeString(this.formData)}" type="number"></vInput>
					<vTextarea class="margin-bottom-20" v-bind="${this.getCodeString(this.formData)}" v-model="val3"></vTextarea>`;
        },
        getBase() {
            return [
                {
                    label: "禁用状态",
                    key: "disabled",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "清空按钮",
                    key: "clearable",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "Drop置body下",
                    key: "transfer",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "过滤",
                    key: "filterable",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "自动关闭",
                    key: "autoClose",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "多选",
                    key: "multiple",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "只读",
                    key: "readonly",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "键盘操作",
                    key: "keyModal",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "头部图标",
                    key: "prefix",
                    tag: "vSelect",
                    default: "person",
                    options: this.iconslist,
                },
                {
                    label: "尾部图标",
                    key: "suffix",
                    tag: "vSelect",
                    default: "person",
                    options: this.iconslist,
                },
                {
                    label: "类型",
                    key: "type",
                    tag: "vSelect",
                    default: "text",
                    options: this.getFormTypes,
                },
                {
                    label: "主题",
                    key: "theme",
                    tag: "vSelect",
                    default: "",
                    options: this.getThemes,
                },
                {
                    label: "无数据提示",
                    key: "tip",
                    tag: "vInput",
                    default: "暂无数据",
                },
            ];
        },
        compProps() {
            return [
                {
                    prop: "multipleKey",
                    explain: "当mutiple=true下,渲染的取值key，type=file时默认multipleKey=name",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "type",
                    explain:
                        "输入框类型，可选值为 button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
                    type: "String",
                    default: "",
                },
                {
                    prop: "name",
                    explain: "表单name",
                    type: "String",
                    default: "",
                },
                {
                    prop: "value",
                    explain: "绑定的值，可使用 v-model 双向绑定",
                    type: "String|Number|Array",
                    default: "",
                },
                {
                    prop: "$attrs",
                    explain: "继承$attrs",
                    type: "object",
                    default: "-",
                },
                {
                    prop: "disabled",
                    explain: "是否禁用",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "readonly",
                    explain: "只读",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "clearable",
                    explain: "是否显示清空按钮",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "filterable",
                    explain: "是否支持搜索",
                    type: "Boolean",
                    default: "true",
                },
                {
                    prop: "autoClose",
                    explain: "非多选下自动关闭",
                    type: "Boolean",
                    default: "true",
                },
                {
                    prop: "multiple",
                    explain: "是否支持多选",
                    type: "Boolean",
                    default: "true",
                },
                {
                    explain:
                        "主题：button,checkbox,color,date,datetime,datetime-local,month,week,time,email,file,hidden,image,number,password,radio,range,reset,search,submit,tel,text,url",
                    prop: "theme",
                    type: "String",
                    default: "",
                },
                {
                    prop: "dropStyle",
                    explain: "给浮层添加额外的 Style 名称",
                    type: "Object, String",
                    default: "",
                },
                {
                    prop: "tip",
                    explain: "文字提示",
                    type: "String",
                    default: "暂无数据",
                },
                {
                    prop: "keyModal",
                    explain: "是否键盘操作",
                    type: "Boolean",
                    default: "true",
                },
                {
                    prop: "prefix|slot:prefix",
                    explain: "输入框头部图标",
                    type: "String|VNode",
                    default: "-",
                },
                {
                    prop: "suffix|slot:suffix",
                    explain: "输入框尾部图标",
                    type: "String|VNode",
                    default: "-",
                },
                {
                    prop: "search",
                    explain: "否显示为搜索型输入框",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "slots:prepend",
                    explain: "输入框外头部组件",
                    type: "VNode",
                    default: "-",
                },
                {
                    prop: "slots:append",
                    explain: "输入框外尾部组件",
                    type: "VNode",
                    default: "-",
                },
                {
                    prop: "on-change",
                    explain: "数据改变时触发事件",
                    type: "Function:(val,__attachData)=>{}",
                    default: "-",
                },
                {
                    prop: "on-attach",
                    explain: "数据改变时触发事件,获取附属数据",
                    type: "Function:(val,__attachData)=>{}",
                    default: "-",
                },
                {
                    prop: "on-icon-click",
                    explain: "点击图标时触发事件",
                    type: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    prop: "on-focus",
                    explain: "输入框聚焦时触发事件",
                    type: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    prop: "on-blur",
                    explain: "输入框失去焦点时触事件",
                    type: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    prop: "on-enter",
                    explain: "按下回车键时触发事件",
                    type: "Function:(val,event)=>{}",
                    default: "-",
                },
                {
                    prop: "on-visible-change",
                    explain: "Drop下拉变化触发事件",
                    type: "Function:val=>{}",
                    default: "-",
                },
                {
                    prop: "on-search",
                    explain: "点击搜索或按下回车键时触发事件：search",
                    type: "Function:val=>{}",
                    default: "-",
                },
                {
                    prop: "on-remove-item",
                    explain: "点击清空按钮时触发事件：search",
                    type: "Function:(val,index)=>{}",
                    default: "-",
                },
                {
                    prop: "on-clear",
                    explain: "点击清除触发事件",
                    type: "Function",
                    default: "-",
                },
            ];
        },
    },
};
</script>
