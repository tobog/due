<style lang="scss">
.demo-row {
    margin-bottom: 5px;
    background-image: linear-gradient(90deg, #f5f5f5 50%, transparent 0, transparent 100%);
    background-size: 8.333333333333334% 100%;
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
            <h2>代码示例 (Grid-Grid/GridItem 栅格)</h2>
            <h4 class="padding-top-10">
                我们采用了5栅格系统，将区域进行5等分。 形成正方形
            </h4>
        </template>
        <template v-slot="config">
            <vGrid class="demo-row demo-grid" v-bind="config">
                <vGridItem class="demo-col">grid:1</vGridItem>
                <vGridItem class="demo-col">grid:2</vGridItem>
                <vGridItem class="demo-col"> grid:3 </vGridItem>
                <vGridItem class="demo-col">grid:4</vGridItem>
                <vGridItem class="demo-col">grid:5</vGridItem>
                <vGridItem class="demo-col" ratio="0.5">grid:6</vGridItem>
            </vGrid>
        </template>
    </Demo>
</template>

<script>
export default {
    computed: {
        getCode() {
            return `<Grid class="demo-row demo-grid" v-bind="config">
                        <GridItem class="demo-col">grid:1</GridItem>
                        <GridItem class="demo-col">grid:2</GridItem>
                        <GridItem class="demo-col"> grid:3 </GridItem>
                        <GridItem class="demo-col">grid:4</GridItem>
                        <GridItem class="demo-col">grid:5</GridItem>
                        <GridItem class="demo-col" ratio="0.5">grid:6</GridItem>
                    </Grid>
					`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "栅格基数",
                    key: "grid",
                    demoDefault: 5,
                    explain: "总栅格数",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 5,
                },
                {
                    showConfig: true,
                    label: "栅格比率",
                    key: "ratio",
                    demoDefault: 1,
                    explain: "Grid|GridItem:栅格高宽比，例如：1 | 100px | {xs:1,md:100}",
                    dataType: "Number|String|Object",
                    tag: "vInputNumber",
                    default: 1,
                },
                {
                    showConfig: true,
                    label: "边框",
                    key: "border",
                    demoDefault: false,
                    explain: "是否边框",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "hover",
                    key: "hover",
                    demoDefault: false,
                    explain: "hover",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: false,
                },
                {
                    label: "显示的内容",
                    key: "slot:default",
                    explain: "Grid|GridItem:显示的内容",
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
