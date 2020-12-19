<style lang="scss" scoped>
.demo-resize {
    height: 300px;
    width: 300px;
}
</style>
<template>
    <vRow class="demo-layout" flex>
        <vCol span="24" class="demo-header">
            <h2>代码示例 (Fluid 瀑布流布局)</h2>
            <h4 class="padding-top-10">
                瀑布流布局
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
                <vResize class="demo-resize"> vResize</vResize>
                <vDraggable class="demo-resize">
                    vDraggable
                </vDraggable>
                <vDraggable>
                    <vResize class="demo-resize">
                        vDraggable-vResize
                    </vResize>
                </vDraggable>
                <vGridLayout>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                    <vGridLayoutItem> </vGridLayoutItem>
                </vGridLayout>
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
    data() {
        return {}
    },
    methods: {},
    computed: {
        getCode() {
            return `<vFluid v-bind="${this.getCodeString(this.formData)}" class="fluid-demo">
                        <vFluidPanel v-for="(i, index) in len" :style="setH()">{{ index }}</vFluidPanel>
                    </vFluid>
					`
        },
        getBase() {
            return [
                {
                    label: "是否贴边",
                    key: "toEdge",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    label: "子元素宽度",
                    key: "size",
                    tag: "vInputNumber",
                    default: null,
                },
            ]
        },
        compProps() {
            return [
                {
                    explain: "是否贴边",
                    prop: "toEdge",
                    type: "Boolean",
                    default: true,
                },
                {
                    explain: "布局类型，column：css多栏布局, position:js布局",
                    prop: "type",
                    type: "String",
                    default: "-",
                },
                {
                    explain: "子元素宽度,单位px和%",
                    prop: "size",
                    type: "String,Number",
                    default: "-",
                },
                {
                    explain: "列数，在没有指定size下动态计算size大小",
                    prop: "column",
                    type: "Number",
                    default: "-",
                },
                {
                    explain: "间隙,分为[x,y]",
                    prop: "gap",
                    type: "Number,String,Array",
                    default: "-",
                },
            ]
        },
    },
}
</script>
