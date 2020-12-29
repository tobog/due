<style lang="scss"></style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Collapse 折叠面板)</h2>
            <h4 class="padding-top-10">将内容区域折叠/展开。</h4>
        </template>
        <template v-slot="config">
            <vCollapse v-model="val" v-bind="config">
                <vCollapseItem>
                    <span>乔纳森·伊夫</span>
                    <vCollapse slot="content" v-bind="config">
                        <vCollapseItem>
                            <span>史蒂夫·乔布斯</span>
                            <p slot="content">
                                史蒂夫·乔布斯（Steve
                                Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。
                            </p>
                        </vCollapseItem>
                        <vCollapseItem name="5">
                            乔纳森·伊夫
                            <p slot="content">
                                乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                            </p>
                        </vCollapseItem>
                    </vCollapse>
                </vCollapseItem>
                <vCollapseItem name="2" disabled>
                    斯蒂夫·盖瑞·沃兹尼亚克
                    <p slot="content">
                        斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary
                        Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC
                        Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。
                    </p>
                </vCollapseItem>
                <vCollapseItem name="4" title="乔纳森·伊夫1">
                    <p slot="content">
                        乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                    </p>
                </vCollapseItem>
                <vCollapseItem name="5">
                    乔纳森·伊夫
                    <p slot="content">
                        乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                    </p>
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
        }
    },
    methods: {},
    computed: {
        getCode() {
            return `<Collapse v-model="val" v-bind=CODE>
                        <CollapseItem>
                            <span>史蒂夫·乔布斯</span>
                            <p slot="content">
                                史蒂夫·乔布斯（Steve
                                Jobs），1955年2月24日生于美国加利福尼亚州旧金山，美国发明家、企业家、美国苹果公司联合创办人。
                            </p>
                        </CollapseItem>
                        <CollapseItem name="2" disabled>
                            斯蒂夫·盖瑞·沃兹尼亚克
                            <p slot="content">
                                斯蒂夫·盖瑞·沃兹尼亚克（Stephen Gary
                                Wozniak），美国电脑工程师，曾与史蒂夫·乔布斯合伙创立苹果电脑（今之苹果公司）。斯蒂夫·盖瑞·沃兹尼亚克曾就读于美国科罗拉多大学，后转学入美国著名高等学府加州大学伯克利分校（UC
                                Berkeley）并获得电机工程及计算机（EECS）本科学位（1987年）。
                            </p>
                        </CollapseItem>
                        <CollapseItem name="4" title="乔纳森·伊夫1">
                            <p slot="content">
                                乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                            </p>
                        </CollapseItem>
                        <CollapseItem name="5">
                            乔纳森·伊夫
                            <p slot="content">
                                乔纳森·伊夫是一位工业设计师，现任Apple公司设计师兼资深副总裁，英国爵士。他曾参与设计了iPod，iMac，iPhone，iPad等众多苹果产品。除了乔布斯，他是对苹果那些著名的产品最有影响力的人。
                            </p>
                        </CollapseItem>
                    </Collapse>`
        },
        getConfig() {
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
                    label: "CollapseItem图标",
                    key: "icon",
                    demoDefault: "ios-arrow-forward",
                    explain: "图标",
                    dataType: "Boolean",
                    tag: "vSelect",
                    default: "ios-arrow-forward",
                    options: this.iconslist,
                },
                {
                    showConfig: true,
                    label: "CollapseItem标题",
                    key: "CollapseItem:title",
                    demoDefault: "",
                    explain: "CollapseItem标题",
                    dataType: "String",
                    tag: "vInput",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "尺寸大小",
                    key: "size",
                    tag: "vInput",
                    demoDefault: "",
                    explain: "设置大小，可选值为：small,normal(default),midiue,large",
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
                // {
                //     showConfig: true,
                //     label: "主题颜色",
                //     key: "theme",
                //     tag: "vSelect",
                //     demoDefault: "",
                //     explain: "主题颜色",
                //     dataType: "String",
                //     default: "",
                //     options: this.getThemes,
                // },
                {
                    label: "面板值",
                    key: "CollapseItem:name",
                    explain: "当前面板的 name，与 Collapse的value对应，不填为索引值",
                    dataType: "String",
                    default: "index",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "form 表单名称",
                    dataType: "Function：Event",
                    default: "value=>{}",
                },
                {
                    label: "自定义头内容",
                    key: "CollapseItem:slot",
                    explain: "自定义标题内容，仅在custom=true有效",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "标题内容",
                    key: "CollapseItem:slot:title",
                    explain: "自定义标题内容",
                    dataType: "VNode",
                    default: "-",
                },
                {
                    label: "描素内容",
                    key: "CollapseItem:slot:content",
                    explain: "自定义描素内容",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
    },
}
</script>
