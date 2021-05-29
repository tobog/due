<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Collapse 折叠面板)</h2>
            <h4 class="padding-top-10">将内容区域折叠/展开。</h4>
        </template>
        <template v-slot="config">
            <div class="mb-20">{{ val }}</div>
            <vCollapse v-model="val" v-bind="config.Collapse">
                <vCollapseItem title="乔纳森·伊夫">
                    <vCollapse>
                        <vCollapseItem title="史蒂夫·乔布斯">
                            <span>史蒂夫·乔布斯</span>
                            <p>
                                史蒂夫·乔布斯（Steve Jobs）
                            </p>
                        </vCollapseItem>
                    </vCollapse>
                </vCollapseItem>
                <vCollapseItem name="2" disabled title="斯蒂夫·盖瑞·沃兹尼亚克">
                    <p>
                        斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary<br />
                        Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑<br />
                        Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。
                    </p>
                </vCollapseItem>
                <vCollapseItem name="4" title="乔纳森·伊夫1">
                    <p>乔纳森·伊夫是一位工业设计师，<br />现任Apple公司设计师兼资深副总裁，英国爵士。</p>
                </vCollapseItem>
                <vCollapseItem>
                    <p>
                        史蒂夫·乔布斯（Steve
                        <br />
                        Jobs），1955年2月24日生于<br />美国加利福尼亚州旧金山，<br />美国发明家
                    </p>
                    <template slot="footer" slot-scope="data">
                        <div class="p-10 text-center" @click="data.toggle">footer</div>
                    </template>
                </vCollapseItem>
            </vCollapse>
            <vCollapse class="mt-10" v-bind="config.Collapse">
                <vCollapseItem>
                    <template slot="title" slot-scope="data">
                        <div class="p-10 text-center" @click="data.toggle">title</div>
                    </template>
                    <p>
                        史蒂夫·乔布斯（Steve
                        <br />
                        Jobs），1955年2月24日生于<br />美国加利福尼亚州旧金山，<br />美国发明家
                    </p>
                    <template slot="footer" slot-scope="data">
                        <div class="p-10 text-center" @click="data.toggle">footer</div>
                    </template>
                </vCollapseItem>
            </vCollapse>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: 0,
        };
    },
    methods: {},
    computed: {
        getCode() {
            return `<Collapse v-model="val" v-bind="config">
                        <CollapseItem title="乔纳森·伊夫">
                            <Collapse v-bind="config">
                                <CollapseItem title="史蒂夫·乔布斯">
                                    <span>史蒂夫·乔布斯</span>
                                    <p>
                                        史蒂夫·乔布斯（Steve Jobs）
                                    </p>
                                </CollapseItem>
                            </Collapse>
                        </CollapseItem>
                        <CollapseItem name="2" disabled title="斯蒂夫·盖瑞·沃兹尼亚克">
                            <p>
                                斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary<br />
                                Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑<br />
                                Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。
                            </p>
                        </CollapseItem>
                        <CollapseItem name="4" title="乔纳森·伊夫1">
                            <p>乔纳森·伊夫是一位工业设计师，<br />现任Apple公司设计师兼资深副总裁，英国爵士。</p>
                        </CollapseItem>
                        <CollapseItem>
                            <p>
                                史蒂夫·乔布斯（Steve
                                <br />
                                Jobs），1955年2月24日生于<br />美国加利福尼亚州旧金山，<br />美国发明家
                            </p>
                            <template slot="footer" slot-scope="data">
                                <div class="p-10 text-center" @click="data.toggle">footer</div>
                            </template>
                        </CollapseItem>
                    </Collapse>`;
        },
        getConfig() {
            return {
                Collapse: {
                    data: this.getCollapseConfig,
                },
                CollapseItem: {
                    data: this.getCollapseItemConfig,
                },
            };
        },
        getCollapseConfig() {
            return [
                {
                    showConfig: true,
                    label: "手风琴模式",
                    key: "accordion",
                    demoDefault: false,
                    explain: "是否手风琴模式",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "简洁模式",
                    key: "simple",
                    demoDefault: false,
                    explain: "是否简洁模式",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "严格匹配",
                    key: "strict",
                    demoDefault: false,
                    explain: "是否严格匹配",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
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
                    label: "当前值",
                    key: "value",
                    demoDefault: false,
                    explain: "当前激活的面板的 name，可以使用 v-model(on-change) 双向绑定",
                    dataType: "Array, String, Number",
                    tag: "vInputNumber",
                    default: false,
                },
            ];
        },
        getCollapseItemConfig() {
            return [
                {
                    label: "标题图标",
                    key: "icon",
                    demoDefault: "ios-arrow-forward",
                    explain: "CollapseItem图标",
                    dataType: "String",
                    tag: "vSelect",
                    default: "ios-arrow-forward",
                    options: this.iconslist,
                },
                {
                    label: "面板值",
                    key: "name",
                    explain: "当前面板的 name，与 Collapse的value对应，不填为索引值",
                    dataType: "String",
                    default: "index",
                },
                {
                    label: "标题内容",
                    key: "title",
                    explain: "标题内容",
                    dataType: "String",
                    default: "",
                },
                {
                    label: "禁用",
                    key: "disabled",
                    explain: "禁用点击",
                    dataType: "Boolean",
                    default: "",
                },
                {
                    label: "自定义标题内容",
                    key: "slot:title",
                    explain: "自定义标题内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "自定义底部内容",
                    key: "slot:footer",
                    explain: "自定义底部内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "描素内容",
                    key: "slot",
                    explain: "自定义描素内容",
                    dataType: "VNode",
                    default: "-",
                },
            ];
        },
    },
};
</script>
