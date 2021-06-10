<style lang="scss">
.demo-row {
    margin-bottom: 5px;
    background-image: linear-gradient(90deg, #f5f5f5 50%, transparent 0, transparent 100%);
    background-size: 8.33334% 100%;
}
.demo-row-ratio {
    .demo-col {
        padding: 0;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
}
.demo-col {
    color: #fff;
    padding: 30px 0;
    text-align: center;
    font-size: 18px;
    background: rgba(0, 153, 229, 0.3);
}
.demo-col:nth-child(2n) {
    background: rgba(0, 153, 229, 0.7);
}
.demo-grid > .demo-col {
    padding: 0;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Grid-Row/Col 栅格)</h2>
            <h4 class="padding-top-10">
                <ul>
                    <li>
                        我们采用了24栅格系统，将区域进行24等分，这样可以轻松应对大部分布局问题。使用栅格系统进行网页布局，可以使页面排版美观、舒适。
                    </li>
                    <li>我们定义了两个概念，行row和列col，具体使用方法如下：</li>
                    <li>使用row在水平方向创建一行</li>
                    <li>将一组col插入在row中</li>
                    <li>在每个col中，键入自己的内容</li>
                    <li>通过设置col的span参数，指定跨越的范围，其范围是1到24</li>
                    <li>每个row中的col总和应该为24</li>
                </ul>
            </h4>
        </template>
        <template v-slot="config">
            <vRow
                class="demo-row"
                v-bind="config.Row"
                :style="{'background-size': 100 / ((config.Row && config.Row.grid) || 1) + '%' + ' 100%'}"
            >
                <vCol class="demo-col" :xs="8" :sm="6" :md="6" :lg="4">xs=8 sm=6 md=6 lg=4</vCol>
                <vCol class="demo-col" :xs="4" :sm="6" :md="3" :lg="8">xs=4 sm=6 md=3 lg=8</vCol>
                <vCol class="demo-col" span="6" offset="8">col-6 | offset-8</vCol>
                <vCol class="demo-col" span="6" offset="4">col-6 | offset-4</vCol>
            </vRow>
            <div class="m-10">比率</div>
            <vRow class="demo-row demo-row-ratio" v-bind="config.Row">
                <vCol class="demo-col" span="6" :xs="2" :sm="4" :md="6" :lg="8" :ratio="0.5">
                    span=6 xs=2 sm=4 md=6 lg=8 ratio=0.5
                </vCol>
                <vCol class="demo-col" span="6" :xs="2" :sm="4" :md="6" :lg="8">
                    span=6 xs=2 sm=4 md=6 lg=8 ratio=0
                </vCol>
                <vCol class="demo-col" span="6" :xs="2" :sm="4" :md="6" :lg="8" :ratio="0.2">
                    span=6 xs=2 sm=4 md=6 lg=8 ratio=0.2
                </vCol>
            </vRow>
        </template>
    </Demo>
</template>

<script>
export default {
    computed: {
        getCode() {
            return `<Row
                        class="demo-row"
                        v-bind="config.Row"
                        :style="{'background-size': 100 / ((config.Row && config.Row.grid) || 1) + '%' + ' 100%'}"
                    >
                        <Col class="demo-col" :xs="8" :sm="6" :md="6" :lg="4">xs=8 sm=6 md=6 lg=4</Col>
                        <Col class="demo-col" :xs="4" :sm="6" :md="3" :lg="8">xs=4 sm=6 md=3 lg=8</Col>
                        <Col class="demo-col" span="6" offset="8">col-6 | offset-8</Col>
                        <Col class="demo-col" span="6" offset="4">col-6 | offset-4</Col>
                    </Row>
                    <div class="m-10">比率</div>
                    <Row class="demo-row demo-row-ratio" v-bind="config.Row">
                        <Col class="demo-col" span="6" :xs="2" :sm="4" :md="6" :lg="8" :ratio="0.5">
                            span=6 xs=2 sm=4 md=6 lg=8 ratio=0.5
                        </Col>
                        <Col class="demo-col" span="6" :xs="2" :sm="4" :md="6" :lg="8">
                            span=6 xs=2 sm=4 md=6 lg=8 ratio=0
                        </Col>
                        <Col class="demo-col" span="6" :xs="2" :sm="4" :md="6" :lg="8" :ratio="0.2">
                            span=6 xs=2 sm=4 md=6 lg=8 ratio=0.2
                        </Col>
                    </Row>
					`
        },
        getConfig() {
            return {
                Row: {
                    data: this.getRowConfig,
                },
                Col: {
                    hide: true,
                    data: this.getColConfig,
                },
            }
        },

        getRowConfig() {
            return [
                {
                    showConfig: true,
                    label: "是否flex布局",
                    key: "flex",
                    demoDefault: false,
                    explain: "是否flex布局",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "栅格基数",
                    key: "grid",
                    demoDefault: 24,
                    explain: "总栅格数",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 24,
                },
                {
                    showConfig: true,
                    label: "栅格间距",
                    key: "gutter",
                    demoDefault: 0,
                    explain: "栅格间距，单位 px，左右平分 上下,例如 10 | 100px | [10px,100px]|{xs:1,md:10}",
                    dataType: "Number|String|Array|Object",
                    tag: "vInputNumber",
                    default: 0,
                },
                {
                    showConfig: true,
                    label: "栅格比率",
                    key: "ratio",
                    demoDefault: 0,
                    explain: "栅格高宽比，例如：1 | 100px | {xs:1,md:100}",
                    dataType: "Number|String|Object",
                    tag: "vInputNumber",
                    default: 0,
                },
                {
                    showConfig: true,
                    label: "flex垂直对齐",
                    key: "align",
                    demoDefault: "",
                    explain: "flex 布局下的垂直对齐方式，可选值为top、middle、bottom,stretch",
                    dataType: "Number",
                    tag: "vSelect",
                    default: "",
                    options: ["top", "middle", "bottom", "stretch"],
                },
                {
                    showConfig: true,
                    label: "flex水平排列",
                    key: "justify",
                    demoDefault: "",
                    explain: "flex水平排列",
                    dataType: "Number",
                    tag: "vSelect",
                    default: "",
                    options: ["start", "center", "end", "space-around", "space-between"],
                },
            ]
        },
        getColConfig() {
            return [
                {
                    key: "span",
                    explain: " 格的占位格数，可选值为0~grid的整数，为 0 时，相当于display:none",
                    dataType: "Number",
                    default: "-",
                },
                {
                    key: "offset",
                    explain: " 格左侧的间隔格数，间隔内不可以有栅格",
                    dataType: "Number",
                    default: "-",
                },
                {
                    key: "push",
                    explain: " 格向右移动格数",
                    dataType: "Number",
                    default: "-",
                },
                {
                    key: "gutter",
                    explain: " 格间距，单位 px，左右平分",
                    dataType: "Number",
                    default: "-",
                },
                {
                    key: "pull",
                    explain: " 格向左移动格数",
                    dataType: "Number",
                    default: "-",
                },
                {
                    key: "order",
                    explain: " 格的顺序，在flex布局模式下有效",
                    dataType: "Number",
                    default: "-",
                },
                {
                    key: "xs",
                    explain: " <768px 响应式栅格，可为栅格数或一个包含其他属性的对象",
                    dataType: " [Number, String, Object]",
                    default: "-",
                },
                {
                    key: "sm",
                    explain: " ≥768px 响应式栅格，可为栅格数或一个包含其他属性的对象",
                    dataType: " [Number, String, Object]",
                    default: "-",
                },
                {
                    key: "md",
                    explain: " ≥992px 响应式栅格，可为栅格数或一个包含其他属性的对象",
                    dataType: " [Number, String, Object]",
                    default: "-",
                },
                {
                    key: "lg",
                    explain: " ≥1200px 响应式栅格，可为栅格数或一个包含其他属性的对象",
                    dataType: " [Number, String, Object]",
                    default: "-",
                },
                {
                    key: "xxl",
                    explain: " ≥1600px 响应式栅格，可为栅格数或一个包含其他属性的对象",
                    dataType: " [Number, String, Object]",
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
                    label: "事件",
                    key: "on-resize",
                    explain: "尺寸变化",
                    dataType: "Function：Event",
                    default: "()=>{}",
                },
            ]
        },
    },
}
</script>
