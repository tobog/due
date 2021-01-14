<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Dropdown 下拉菜单)</h2>
            <h4 class="padding-top-10">展示一组折叠的下拉菜单。</h4>
        </template>
        <template v-slot="config">
            <vDropdown v-bind="config">
                <vButton>vButton</vButton>
                <template slot="list">
                    <vDropdownItem disabled>驴打滚</vDropdownItem>
                    <vDropdownItem divided>炸酱面</vDropdownItem>
                    <vDropdownItem>炸酱面</vDropdownItem>
                    <vDropdownItem>豆汁儿</vDropdownItem>
                </template>
            </vDropdown>
            <vDropdown label="label" :autoLabel="true">
                <template slot="list">
                    <vDropdownItem disabled>驴打滚</vDropdownItem>
                    <vDropdownItem divided>酱面</vDropdownItem>
                    <vDropdownItem>豆汁儿炸酱面</vDropdownItem>
                </template>
            </vDropdown>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            value: "0",
        }
    },
    methods: {},
    computed: {
        getCode() {
            return `<Dropdown v-bind=CODE>
                        <Button>Button</Button>
                        <template slot="list">
                            <DropdownItem disabled>驴打滚</DropdownItem>
                            <DropdownItem selected divided>炸酱面</DropdownItem>
                            <DropdownItem>炸酱面</DropdownItem>
                            <DropdownItem>豆汁儿</DropdownItem>
                        </template>
                    </Dropdown>
                        `
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "更新显示",
                    key: "autoLabel",
                    demoDefault: false,
                    explain: "自动更新显示文字",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
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
                    explain: "点击子节点关闭",
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
                // {
                //     showConfig: true,
                //     label: "是否禁用",
                //     key: "disabled",
                //     demoDefault: false,
                //     explain: "是否禁用",
                //     dataType: "Boolean",
                //     tag: "vSwitch",
                //     default: false,
                // },
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
                    label: "名称",
                    key: "name",
                    explain: "DropdownItem:name，禁用",
                    dataType: "Boolean",
                    default: "-",
                },
                {
                    label: "禁用",
                    key: "selected",
                    explain: "DropdownItem:selected，禁用",
                    dataType: "Boolean",
                    default: "-",
                },
                {
                    label: "选中状态",
                    key: "selected",
                    explain: "DropdownItem:selected，选中状态",
                    dataType: "Boolean",
                    default: "-",
                },
                {
                    label: "分割线",
                    key: "divided",
                    explain: "DropdownItem:divided，分割线",
                    dataType: "Boolean",
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
    },
}
</script>
