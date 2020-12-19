<style lang="scss" scoped></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Menu/MenuTree 导航菜单 卡片)</h2>
            <h4 class="padding-top-10">为页面和功能提供导航的菜单列表，常用于网站顶部和左侧。</h4>
        </vCol>
        <vCol lg="24" span="24" class="demo-form">
            <Formedit :formdata="getBase" v-model="formData"></Formedit>
        </vCol>
        <vCol lg="24" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <section v-if="show">
                <vCol span="12">
                    <vMenu v-bind="formData" style="border:1px solid #ddd">
                        <vMenuItem icon="ios-analytics">
                            <div slot="title">内容管理0</div>
                            <vMenuItem icon="ios-analytics">
                                <div slot="title">内容管理1</div>
                            </vMenuItem>
                            <vMenuItem icon="ios-analytics">
                                <div slot="title">内容管理2</div>
                            </vMenuItem>
                            <vMenuItem :align="formData.align">
                                <div slot="title">内容管理3</div>
                                <vMenuItem icon="ios-analytics">
                                    <div slot="title">内容管理4</div>
                                </vMenuItem>
                                <vMenuItem :align="formData.align">
                                    <div slot="title">内容管理3</div>
                                    <vMenuItem icon="ios-analytics">
                                        <div slot="title">内容管理4</div>
                                    </vMenuItem>
                                    <vMenuItem icon="ios-analytics">
                                        <div slot="title">内容管理4</div>
                                    </vMenuItem>
                                    <vMenuItem icon="ios-analytics">
                                        <div slot="title">内容管理4</div>
                                    </vMenuItem>
                                </vMenuItem>
                            </vMenuItem>
                        </vMenuItem>
                        <vMenuItem :align="formData.align">
                            <div slot="title">内容管理5</div>
                            <vMenuItem icon="ios-analytics">
                                <div slot="title">内容管理6</div>
                            </vMenuItem>
                            <vMenuItem icon="ios-analytics">
                                <div slot="title">内容管理7</div>
                                <vMenuItem icon="ios-analytics">
                                    <div slot="title">内容管理8</div>
                                </vMenuItem>
                            </vMenuItem>
                        </vMenuItem>
                        <vMenuItem icon="ios-analytics">
                            <div slot="title">内容管理5</div>
                            <vMenuItem icon="ios-analytics">
                                <div slot="title">内容管理6</div>
                            </vMenuItem>
                            <vMenuItem :align="formData.align">
                                <div slot="title">内容管理7</div>
                                <vMenuItem icon="ios-analytics">
                                    <div slot="title">内容管理8</div>
                                </vMenuItem>
                            </vMenuItem>
                        </vMenuItem>
                    </vMenu>
                </vCol>
                <vCol span="12">
                    <vMenuTree v-bind="formData" :data="dataList" style="border:1px solid #ddd"></vMenuTree>
                </vCol>
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
            dataList: [
                {
                    title: "1123",
                    children: [
                        {
                            title: "2222",
                            icon: "success",
                        },
                    ],
                },
                {
                    title: "title1",
                    expand: true,
                    children: [
                        {
                            title: "title2",
                            children: [
                                {
                                    title: "title3",
                                    children: [
                                        {
                                            title: "title4",
                                            icon: "success",
                                        },
                                        {
                                            title: "title5",
                                            icon: "success",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            title: "sfdsfd",
                            icon: "success",
                        },
                    ],
                },
            ],
        };
    },
    computed: {
        getCode() {
            return ` <vMenu v-bind="${this.getCodeString(this.formData)}" style="border:1px solid #ddd">
						<vMenuItem icon="ios-analytics">
							<div slot="title">
								内容管理0
							</div>
							<vMenuItem icon="ios-analytics">
								<div slot="title">
									内容管理1
								</div>
							</vMenuItem>
							<vMenuItem icon="ios-analytics">
								<div slot="title">
									内容管理2
								</div>
							</vMenuItem>
							<vMenuItem icon="ios-analytics">
								<div slot="title">
									内容管理3
								</div>
								<vMenuItem icon="ios-analytics">
									<div slot="title">
										内容管理4
									</div>
								</vMenuItem>
							</vMenuItem>
						</vMenuItem>
						<vMenuItem icon="ios-analytics">
							<div slot="title">
								内容管理5
							</div>
							<vMenuItem icon="ios-analytics">
								<div slot="title">
									内容管理6
								</div>
							</vMenuItem>
							<vMenuItem icon="ios-analytics">
								<div slot="title">
									内容管理7
								</div>
								<vMenuItem icon="ios-analytics">
									<div slot="title">
										内容管理8
									</div>
								</vMenuItem>
							</vMenuItem>
						</vMenuItem>
					</vMenu>
					<vMenuTree v-bind="${this.getCodeString(this.formData)}" :data="dataList" style="border:1px solid #ddd"></vMenuTree>`;
        },
        getBase() {
            return [
                {
                    label: "手风琴模式",
                    key: "accordion",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "展开所有",
                    key: "always",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "展开动画",
                    key: "transition",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "菜单类型",
                    key: "mode",
                    tag: "vSelect",
                    default: "horizontal",
                    options: ["horizontal", "vertical"],
                },
                {
                    label: "主题",
                    key: "theme",
                    tag: "vSelect",
                    default: "light",
                    options: ["primary", "dark", "light"],
                },
                {
                    label: "子菜单对齐方式",
                    key: "align",
                    tag: "vSelect",
                    default: "",
                    options: ["fixed", "center", "left", "right", "fix", "aside"],
                },
            ];
        },
        compProps() {
            return [
                {
                    explain: "仅在mode=vertical时，是否开启手风琴模式，开启后每次至多展开一个子菜单",
                    prop: "Menu/MenuTree：accordion",
                    type: "Boolean",
                    default: true,
                },
                {
                    explain: "仅在mode=vertical时，展开所有",
                    prop: "Menu/MenuTree：always",
                    type: "Boolean",
                    default: false,
                },
                {
                    explain: "菜单类型，可选值为 horizontal（水平） 和 vertical（垂直）",
                    prop: "Menu/MenuTree：mode",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "主题，可选值为 light、dark、primary",
                    prop: "Menu/MenuTree：theme",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "子菜单的唯一标识，必填",
                    prop: "MenuItem:name/MenuTree:children:name",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "子菜单图标",
                    prop: "MenuItem:icon/MenuTree:children:icon",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "子菜单总是展开",
                    prop: "MenuItem:always/MenuTree:children:always",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "子菜单是否展开",
                    prop: "MenuItem:expand/MenuTree:children:expand",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "子菜单类型，类似Menu:mode：horizontal，vertical",
                    prop: "MenuItem:mode/MenuTree:children:mode",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "仅在mode=horizontal时， 子菜单位置：fixed,center,left,right,fix,aside",
                    prop: "MenuItem:align/MenuTree:children:align",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "子菜单标题",
                    prop: "MenuItem:slot:title/MenuTree:children:title",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "继承属性：tag to href 等...",
                    prop: "MenuItem:$attrs/MenuTree:children",
                    type: "Object",
                    default: "-",
                },
                {
                    prop: "on-select",
                    explain: "仅在mode=vertical时， 选择菜单（MenuItem）时触发",
                    type: "Function:name=>{}",
                    default: "-",
                },
                {
                    prop: "on-open-change",
                    explain: "仅在mode=vertical时， 当 展开/收起 子菜单时触发",
                    type: "Function:(name,isopen)=>{}",
                    default: "-",
                },
                {
                    prop: "MenuTree:data",
                    explain: "tree数据结构",
                    type: "Array",
                    default: "[]",
                },
                {
                    prop: "MenuTree:children:render",
                    explain: "自定义渲染函数",
                    type: "Function:(h)=>{}",
                    default: "-",
                },
                {
                    prop: "MenuTree:dataType",
                    explain: "data数据结构:list,map,tree",
                    type: "String",
                    default: "tree",
                },
                {
                    prop: "MenuTree:identifier",
                    explain: "数据唯一标识",
                    type: "String",
                    default: "id",
                },
                {
                    prop: "MenuTree:parentId",
                    explain: "唯一关联的key",
                    type: "String",
                    default: "parentId",
                },
            ];
        },
    },
};
</script>
