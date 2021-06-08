<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Dropdown 下拉菜单)</h2>
            <h4 class="padding-top-10">展示一组折叠的下拉菜单。</h4>
        </template>
        <template v-slot="config">
            <div class="mb-10">{{ value }}</div>
            <vDropdown
                :value.sync="value"
                v-bind="config.Dropdown"
                :popperConfig="config.PopperConfig"
                label="下拉菜单"
            >
                <template slot="list">
                    <vDropdownItem name="1" v-bind="config.DropdownItem" disabled>驴打滚</vDropdownItem>
                    <vDropdownItem name="2" v-bind="config.DropdownItem" divided>酱面</vDropdownItem>
                    <vDropdownItem name="3" v-bind="config.DropdownItem" selected>豆汁儿炸酱面</vDropdownItem>
                </template>
            </vDropdown>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: "3",
        }
    },
    methods: {},
    computed: {
        getCode() {
            return `<Dropdown
                        :value.sync="value"
                        v-bind="config.Dropdown"
                        :popperConfig="config.PopperConfig"
                        label="下拉菜单"
                    >
                        <template slot="list">
                            <DropdownItem name="1" v-bind="config.DropdownItem" disabled>驴打滚</DropdownItem>
                            <DropdownItem name="2" v-bind="config.DropdownItem" divided>酱面</DropdownItem>
                            <DropdownItem name="3" v-bind="config.DropdownItem" selected>豆汁儿炸酱面</DropdownItem>
                        </template>
                    </Dropdown>
            `
        },
        getConfig() {
            return {
                Dropdown: {
                    data: this.getDropdownConfig,
                },
                DropdownItem: {
                    data: this.getDropdownItemConfig,
                },
                PopperConfig: {
                    data: this.getPopperConfig,
                },
            }
        },
        getDropdownConfig() {
            return [
                {
                    showConfig: true,
                    label: "手动控制显示",
                    key: "visible",
                    demoDefault: false,
                    explain: "是否手动控制显示",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "自动关闭",
                    key: "autoClose",
                    demoDefault: false,
                    explain: "点击子节点自动关闭",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "弹层位置",
                    key: "transfer",
                    demoDefault: false,
                    explain:
                        "是否将弹层放置于 body 内，在 Tabs、带有 fixed 的 Table 列内使用时，建议添加此属性，它将不受父级样式影响，从而达到更好的效果",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "触发方式",
                    key: "trigger",
                    demoDefault: "click",
                    explain: "触发方式,可选值:click,hover,custom",
                    dataType: "String",
                    tag: "vSelect",
                    default: "click",
                    options: ["click", "hover", "custom"],
                },
                {
                    showConfig: true,
                    label: "显示位置",
                    key: "placement",
                    demoDefault: "bottom",
                    explain:
                        "显示位置,可选值：top,top-left,top-center,top-right,top-fix,bottom,bottom-left,bottom-center,bottom-right,bottom-fix,right,right-top,right-center,right-bottom,left,left-top,left-center,left-bottom,fix-left,fix-center,fix-right",
                    dataType: "String",
                    tag: "vSelect",
                    default: "",
                    options: this.getPlacements,
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),medium,large",
                    dataType: "String",
                    default: "",
                    options: this.getSize,
                },
                {
                    showConfig: true,
                    label: "主题颜色",
                    key: "theme",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "主题颜色",
                    dataType: "String",
                    default: "",
                    options: this.getThemes,
                },
                {
                    label: "显示的内容",
                    key: "label",
                    explain: "显示的内容",
                    dataType: "String",
                    default: "-",
                },
                {
                    label: "显示的内容",
                    key: "slot:default",
                    explain: "显示的内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "列表内容",
                    key: "slot:list",
                    explain: "列表内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "事件",
                    key: "on-clickout",
                    explain: "点击时触发",
                    dataType: "Function：Event",
                    default: "(isclickout,e)=>{}",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "点击菜单项时触发",
                    dataType: "Function：Event",
                    default: "(DropdownItem:name)=>{}",
                },
                {
                    label: "事件",
                    key: "on-visible-change",
                    explain: "下拉框展开或收起时触发",
                    dataType: "Function：Event",
                    default: "(visible)=>{}",
                },
            ]
        },
        getDropdownItemConfig() {
            return [
                {
                    showConfig: true,
                    label: "图标",
                    key: "icon",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "选项图标",
                    dataType: "String",
                    options: this.iconslist,
                    default: "",
                },
                {
                    label: "名称",
                    key: "name",
                    explain: "name名称唯一标识符",
                    dataType: "String, Number",
                    default: "-",
                },
                {
                    label: "禁用",
                    key: "disabled",
                    explain: "是否禁用",
                    dataType: "Boolean",
                    default: "-",
                },
                {
                    label: "选中状态",
                    key: "selected",
                    explain: "是否选中状态",
                    dataType: "Boolean",
                    default: "-",
                },
                {
                    label: "分割线",
                    key: "divided",
                    explain: "分割线",
                    dataType: "Boolean",
                    default: "-",
                },
                {
                    label: "自定义内容",
                    key: "slot:default",
                    explain: "自定义内容",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
    },
}
</script>
