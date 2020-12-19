<style lang="scss" scoped></style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Progress 进度条)</h2>
            <h4 class="padding-top-10">展示操作或任务的当前进度，比如上传文件。</h4>
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
                <vProgress v-bind="formData" class="margin-10" :strokeColor="strokeColor"></vProgress>
                <vProgress
                    v-bind="formData"
                    class="margin-10"
                    split
                    linear
                    :strokeColor="strokeColor2"
                ></vProgress>
                <vProgress v-bind="formData" class="margin-10"></vProgress>
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
            iconName: "",
            strokeColor: [
                {
                    percent: 20,
                    color: "red",
                },
                {
                    percent: 100,
                    color: "green",
                },
            ],
            strokeColor2: [
                {
                    percent: 20,
                    color: "red",
                },
                {
                    percent: 30,
                    color: "#000",
                },
                {
                    percent: 70,
                    color: "green",
                },
            ],
        };
    },
    computed: {
        getCode() {
            return `<vProgress v-bind="${this.getCodeString(this.formData)}" class="margin-10" :strokeColor="${
                this.strokeColor
            }"></vProgress>
					<vProgress v-bind="${this.getCodeString(this.formData)}" class="margin-10"></vProgress>`;
        },
        getBase() {
            return [
                {
                    label: "垂直",
                    key: "vertical",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "动画",
                    key: "active",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "百分比",
                    key: "percent",
                    tag: "vInputNumber",
                    default: 60,
                },
                {
                    label: "text显示位置",
                    key: "textPos",
                    tag: "vSelect",
                    default: "inside",
                    options: ["outside", "inside", "inside-center", "center"],
                },
                {
                    label: "状态",
                    key: "status",
                    tag: "vSelect",
                    default: "-",
                    options: ["-", "error", "success"],
                },
                {
                    label: "进度条线宽，",
                    key: "strokeWidth",
                    tag: "vInputNumber",
                    default: 12,
                },
            ];
        },
        compProps() {
            return [
                {
                    prop: "height",
                    explain: "高度仅vertical=true有用",
                    type: "Number",
                    default: "100",
                },
                {
                    prop: "percent",
                    explain: "百分比",
                    type: "Number",
                    default: "-",
                },
                {
                    prop: "status",
                    explain: "状态，可选值为defaul、error、success",
                    type: "String",
                    default: "-",
                },
                {
                    prop: "stroke-width",
                    explain: "进度条的线宽，单位 px",
                    type: "Number",
                    default: "12",
                },
                {
                    prop: "strokeColor",
                    explain: "颜色类型:[[],[]]",
                    type: "Array",
                    default: "",
                },
                {
                    prop: "vertical",
                    explain: "是否在垂直方向显示",
                    type: "Boolean",
                    default: "false",
                },
                {
                    prop: "动画",
                    explain: "active",
                    type: "Boolean",
                    default: "-",
                },
                {
                    prop: "on-status-change",
                    explain: "状态事件",
                    type: "Function：status",
                    default: "(index:1,0,-1)=>{}",
                },
                {
                    prop: "slot",
                    explain: "Progress,ProgressItem:自定义显示状态内容",
                    type: "VNode",
                    default: "-",
                },
            ];
        },
    },
};
</script>
