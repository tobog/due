<style lang="scss" scoped></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <!-- <Render @click.native="native" @click="native"></Render> -->
            <h2>代码示例 (Table,Tablefix 表格)</h2>
            <h4 class="padding-top-10">
                <div>Table是基于table-laout:auto,自动布局的</div>
                <div>Tablefix是基于table-laout:fixed,固定布局的</div>
                <div>主要用于展示大量结构化数据。</div>
                <div>
                    支持排序、筛选、分页、自定义操作、导出 csv 等复杂功能。
                </div>
            </h4>
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
                <!-- <div @DOMNodeInserted="getTime">
					<vTable
						v-bind="formData"
						:columns="getColumns1"
						:data="datalist"
					></vTable>
				</div> -->
                <div class="padding-top-20">
                    <vTablefix
                        v-bind="formData"
                        :asyncData="asyncData"
                        :columns="getColumns1"
                        :data="datalist"
                        :spanMethod="spanMethod"
                    ></vTablefix>
                </div>
                <div class="padding-top-20">
                    <vTable
                        v-bind="formData"
                        :asyncData="asyncData"
                        :columns="getColumns1"
                        :data="datalist"
                        :spanMethod="spanMethod"
                    ></vTable>
                </div>
            </section>
        </vCol>
        <vCol span="24" class="demo-code" v-highlight>
            <!-- <pre v-highlight> -->
            <code v-text="getFormatCode" class="html"></code>
            <!-- </pre> -->
        </vCol>
        <vCol span="24" class="demo-props">
            <h2 class="demo-header">Table Props & Events</h2>
            <vTable :columns="getTableColumns" :data="compProps" class="demo-table" border stripe></vTable>
        </vCol>
        <vCol span="24" class="demo-props">
            <h2 class="demo-header">Columns Props & Events</h2>
            <vTable :columns="getTableColumns" :data="compProps2" class="demo-table" border stripe></vTable>
        </vCol>
    </vRow>
</template>

<script>
export default {
    // ${this.getCodeString(this.formData)}
    data() {
        return {
            datalist: [],
        }
    },
    created() {
        this.markData()
    },
    watch: {
        show(val) {
            if (!val) this._time = 0
        },
    },
    methods: {
        spanMethod({columnIndex, rowIndex, index}, column, row) {
            if (index === 3 && columnIndex === 1) {
                return [2, 2]
            }
        },
        async asyncData(row, index) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve([
                        {
                            key: "Jo33hn",
                            name: "John",
                            age: "John" + 1,
                            street: "JohnkLake Park",
                            building: "John",
                            door: "Lake",
                            caddress: "John",
                            cname: "John",
                            gender: "John",
                        },
                    ])
                }, 4000)
            })
        },
        native() {
            console.log(this)
        },
        getTime() {
            // this._time = this._time || Date.now()
            // console.log((Date.now() - this._time) / 1000);
        },
        markData() {
            const data = ["key", "name", "age", "street", "door", "cname"]
            for (let i = 0; i < 2000; i++) {
                this.datalist.push({
                    key: i,
                    name: "John Brown,John BrownJohn BrownJohn Brown",
                    age: i,
                    street: "Lake ParkLake ParkLake ParkLake ParkLake Park",
                    building: "C",
                    door: 2035,
                    caddress: "Lake Street 42",
                    cname: "SoftLake Co",
                    gender: "M",
                })
            }
            if (!this.datalist[0]) return
            this.datalist[1].children = this.datalist[0].children = [
                {
                    key: "John3",
                    name: "John",
                    age: "John" + 1,
                    street: "JohnkLake Park",
                    building: "John",
                    door: "Lake",
                    caddress: "John",
                    cname: "John",
                    gender: "John",
                    children: [],
                },
                {
                    key: "Joh3n",
                    name: "John",
                    age: "John" + 1,
                    street: "JohnkLake Park",
                    building: "John",
                    door: "Lake",
                    caddress: "John",
                    cname: "John",
                    gender: "John",
                },
            ]
        },
    },
    computed: {
        getColumns1() {
            return [
                {
                    type: "selection",
                    width: 100,
                },
                {
                    title: "name",
                    key: "key",
                    type: "children",
                    fixed: "left",
                    width: 100,
                    sortable: true,
                },
                {
                    key: "333",
                    type: "expand",
                    width: 100,
                    renderExpand(h) {
                        return (
                            <div>
                                renderExpa
                                <br />
                                nd test renderExpa
                                <br />
                                nd test renderExpa
                                <br />
                                nd test renderExpa
                                <br />
                                nd test
                            </div>
                        )
                    },
                },
                {
                    title: "Age 100",
                    key: "age",
                    align: "center",
                    resizable: "once",
                    width: 100,
                    filters: [
                        {
                            label: "Greater than 25",
                            value: 1,
                        },
                        {
                            label: "Less than 25",
                            value: 2,
                        },
                    ],
                },
                {
                    title: "Company",
                    align: "center",
                    children: [
                        {
                            title: "Company Address 500",
                            key: "caddress",
                            align: "center",
                            width: 100,
                        },
                        {
                            title: "Company Name 300",
                            key: "cname",
                            align: "center",
                        },
                    ],
                },
                {
                    title: "Gender22 500",
                    key: "door",
                    align: "center",
                    tooltip: "tooltip",
                    // fixed: "right",
                    width: 150,
                },
                {
                    title: "Gender33 300",
                    key: "building",
                    align: "center",
                },
                {
                    title: "Gender33 300",
                    key: "gednder",
                    align: "center",
                    width: 200,
                },
                {
                    title: "Gender33 300",
                    key: "gendfer",
                    align: "center",
                    width: 200,
                },
                {
                    title: "Gender55 300",
                    key: "street",
                    width: 100,
                },
            ]
        },
        getCode() {
            return `<vTable v-bind="formData" :columns="getColumns1" :data="datalist"></vTable>`
        },
        getBase() {
            return [
                {
                    label: "斑马纹",
                    key: "stripe",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "合计",
                    key: "showSummary",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "定位Summary",
                    key: "fixSummary",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "显示表头",
                    key: "showHeader",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "高亮",
                    key: "hover",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "省略号",
                    key: "ellipsis",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "定位表头",
                    key: "fixHeader",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "多条展开",
                    key: "multiExpand",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "自动布局",
                    key: "isLayoutAuto",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "表格高度",
                    key: "height",
                    tag: "vInputNumber",
                    default: 360,
                },
                {
                    label: "表格宽度",
                    key: "width",
                    tag: "vInputNumber",
                    // default: ''
                },
                {
                    label: "基础长度",
                    key: "baseLength",
                    tag: "vInputNumber",
                    default: 12,
                },
                {
                    label: "对齐",
                    key: "align",
                    tag: "vSelect",
                    default: "left",
                    options: ["left", "right", "center"],
                },
                {
                    label: "大小",
                    key: "size",
                    tag: "vSelect",
                    default: "",
                    options: ["default", "small", "large"],
                },
                {
                    label: "边框",
                    key: "border",
                    tag: "vSelect",
                    default: "both",
                    options: ["default", "none", "both", "horizontal", "vertical"],
                },
                {
                    label: "性能级别",
                    key: "performance",
                    tag: "vSelect",
                    default: "auto",
                    options: ["normal", "auto", "middle", "high"],
                },
                {
                    label: "提示内容",
                    key: "noDataText",
                    tag: "vInput",
                    // default: ''
                },
            ]
        },
        compProps() {
            return [
                {
                    prop: "data",
                    explain:
                        "显示的结构化数据，其中，字段 cellClassName 用于设置任意单元格的样式名称，因此数据不能使用该字段，详见示例特定样式。",
                    type: "Array",
                    default: "-",
                },
                {
                    prop: "columns",
                    explain: "表格列的配置描述，具体项见后文",
                    type: "Array",
                    default: "-",
                },
                {
                    explain: "是否显示间隔斑马纹",
                    prop: "stripe",
                    type: "Boolean",
                    default: "false",
                },
                {
                    explain: "是否显示表头",
                    prop: "showHeader",
                    type: "Boolean",
                    default: "true",
                },
                {
                    explain: "是否支持高亮选中的行，即单选",
                    prop: "highlightRow",
                    type: "Boolean",
                    default: "false",
                },
                {
                    explain: "边框:'default', 'none', 'both', 'horizontal', 'vertical'",
                    prop: "border",
                    type: "String",
                    default: "",
                },
                {
                    explain: "表格宽度",
                    prop: "width",
                    type: "Number",
                    default: "-",
                },
                {
                    explain: "格高度，单位 px，",
                    prop: "height",
                    type: "Number",
                    default: "-",
                },
                {
                    explain: "hover高亮",
                    prop: "hover",
                    type: "Boolean",
                    default: "-",
                },
                {
                    explain: "td，th 超出省略",
                    prop: "ellipsis",
                    type: "Boolean",
                    default: "-",
                },
                {
                    explain: "固定头",
                    prop: "fixHeader",
                    type: "Boolean",
                    default: "-",
                },
                {
                    explain: "大数据性能处理，可选normal, auto, middle, high",
                    prop: "performance",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "基础数据长度和performance属性连用",
                    prop: "baseLength",
                    type: "Number",
                    default: 12,
                },
                {
                    explain: "数据为空时显示的提示内容",
                    prop: "noDataText",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "表格尺寸，可选值为 large、small、default 或者不填，",
                    prop: "size",
                    type: "Number",
                    default: "-",
                },
                {
                    prop: "multiExpand",
                    explain: "多条展开",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "showSummary",
                    explain: "是否在表尾显示合计行",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "sumText",
                    explain: "合计行第一列的文本",
                    type: "String",
                    default: "合计",
                },
                {
                    prop: "summaryMethod",
                    explain: "自定义的合计计算方法",
                    type: "Function:(columns,data)=>{}",
                    default: "",
                },
                {
                    prop: "spanMethod",
                    explain: "合并行或列的计算方法",
                    type: "Function:(columnIndex, rowIndex, column, row)=>{}",
                    default: "",
                },
                {
                    prop: "on-split-moving",
                    explain: "拖拽调整列宽时触发",
                    type: "Function:Event",
                    default: "(newWidth, oldWidth, column)=>{}",
                },
                {
                    prop: "on-expand",
                    explain: "展开或收起某一行时触发",
                    type: "Function:Event",
                    default: "(row, status)=>{}",
                },
                {
                    prop: "on-row-dbclick",
                    explain: "双击某一行时触发",
                    type: "Function:Event",
                    default: "(row, index)=>{}",
                },
                {
                    prop: "on-row-click",
                    explain: "单击某一行时触发",
                    type: "Function:Event",
                    default: "(row, index)=>{}",
                },
                {
                    prop: "on-select-change",
                    explain: "全选和全取消某一项时触发",
                    type: "Function:Event",
                    default: "(data, checkVals,{ key, status: true, type: selectAll' })=>{}",
                },
                {
                    prop: "on-select-change",
                    explain: "取消选中某一项时触发",
                    type: "Function:Event",
                    default: "(curdata, curval,{ key, status: true,value: curval, index, type: 'select' })=>{}",
                },
                {
                    prop: "on-radio-change",
                    explain: "单选取消选中某一项时触发",
                    type: "Function:Event",
                    default: "(curdata, curval,{ key, status: true,value: curval, index, type: 'radio' })=>{}",
                },
                {
                    prop: "on-sort-change",
                    explain: "排序时有效，当点击排序时触发,支持多条件排序",
                    type: "Function:Event",
                    default: "(sort, key,{ column, multiSort })=>{}",
                },
                {
                    prop: "on-filter-change",
                    explain: "筛选时有效，筛选条件发生变化时触发,支持多条件筛选",
                    type: "Function:Event",
                    default: "(val, key,{ column, multiFilter })=>{}",
                },
            ]
        },
        compProps2() {
            return [
                {
                    prop: "type",
                    explain: "列类型，可选值为 index、selection、expand、html,template",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "key",
                    explain: "对应列内容的字段名",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "title",
                    explain: "列头显示文字",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "sortable",
                    explain:
                        "对应列是否可以排序，如果设置为 custom，则代表用户希望远程排序，需要监听 Table 的 on-sort-change 事件",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "resizable",
                    explain: "拖拽调整列宽",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "width",
                    explain: "列宽",
                    type: "Number,percent",
                    default: "-",
                },
                {
                    prop: "minWidth",
                    explain: "最小列宽",
                    type: "Number",
                    default: "-",
                },
                {
                    prop: "maxWidth",
                    explain: "最大列宽",
                    type: "Number",
                    default: "-",
                },
                {
                    prop: "align",
                    explain: "对齐方式，可选值为 left 左对齐、right 右对齐和 center 居中对齐",
                    type: "String",
                    default: "left",
                },
                {
                    prop: "style|class|props|domProps|on",
                    explain: "h函数的参数",
                    type: "-",
                    default: "-",
                },
                {
                    prop: "fixed",
                    explain: "列是否固定在左侧或者右侧，可选值为 left 左侧和 right 右侧",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "ellipsis",
                    explain: "开启后，文本将不换行，超出部分显示为省略号",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "tooltip",
                    explain: "开启后，文本将不换行，超出部分显示为省略号，并用 Tooltip 组件显示完整内容",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "render",
                    explain:
                        "自定义渲染列，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 row、column 和 index，分别指当前行数据，当前列数据，当前行索引",
                    type: "Funtion:(h,{ row, column, index, axis })=>VNode",
                    default: "-",
                },
                {
                    prop: "renderHeader",
                    explain:
                        "自定义列头显示内容，使用 Vue 的 Render 函数。传入两个参数，第一个是 h，第二个为对象，包含 column 和 index",
                    type: "Funtion:(h,{  column, index, axis })=>VNode",
                    default: "-",
                },
                {
                    prop: "tooltip",
                    explain: "开启后，文本将不换行，超出部分显示为省略号，并用 Tooltip 组件显示完整内容",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "filterMethod",
                    explain: "自定义筛选函数",
                    type: "Function",
                    default: "(value, data,)=>Boolean",
                },
                {
                    prop: "filters",
                    explain:
                        "过滤数据的选项，格式为数组，数组中每项包含 label 和 value 属性，使用过滤，必须同时配置 filterMethod",
                    type: "Array",
                    default: "(value, data,)=>Boolean",
                },
                {
                    prop: "sync",
                    explain: "本地处理数据，排序，过滤",
                    type: "Boolean|Object",
                    default: "-",
                },
                {
                    prop: "children",
                    explain: "表头分组",
                    type: "Array",
                    default: "-",
                },
                {
                    prop: "renderExpand",
                    explain: "当type==expand时展开项渲染函数和render 一样，",
                    type: "Function",
                    default: "-",
                },
                {
                    prop: "renderExpand",
                    explain: "当type==expand时展开项渲染函数和render 一样，",
                    type: "Function",
                    default: "-",
                },
                {
                    prop: "spanMethod",
                    explain: "合并行或列的计算方法",
                    type: "Function:(columnIndex, rowIndex, column, row)=>{}",
                    default: "",
                },
            ]
        },
    },
}
</script>
