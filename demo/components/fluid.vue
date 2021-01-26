<style lang="scss">
.fluid-demo {
    border: 2px solid #ccc;
    & > * {
        border: 2px solid #ccc;
        min-height: 60px;
        font-size: 30px;
        text-align: center;
    }
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Fluid 瀑布流布局)</h2>
            <h4 class="padding-top-10">
                瀑布流布局
            </h4>
        </template>
        <template v-slot="config">
            <vButton class="margin-10" theme="primary" @click="clear">{{ isStop ? "Run" : "Stop" }}</vButton>
            <vFluid v-bind="config" class="fluid-demo">
                <vFluidPanel v-for="(i, index) in len" :style="setH()">{{ index }}</vFluidPanel>
            </vFluid>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            len: [1, 2, 3, 5, 6, 7, 8, 9],
            isStop: false,
        }
    },
    mounted() {
        this.__setInterval = setInterval(() => {
            let len = []
            for (let index = 0; index < Math.floor(Math.random() * 10) + 10; index++) {
                const element = (Math.random() * 5).toFixed(2)
                len.push(element)
            }
            this.len = len
        }, 8000)
    },
    methods: {
        clear() {
            clearInterval(this.__setInterval)
            this.isStop = !this.isStop
            if (this.isStop) return
            this.__setInterval = setInterval(() => {
                let len = []
                for (let index = 0; index < Math.floor(Math.random() * 20) + 10; index++) {
                    const element = (Math.random() * 5).toFixed(2)
                    len.push(element)
                }
                this.len = len
            }, 5000)
        },
        setH() {
            return {
                height: Math.random() * 300 + "px",
                backgroundColor:
                    "#" +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10),
            }
        },
    },
    computed: {
        getCode() {
            return `<Fluid v-bind=CODE class="fluid-demo">
                        <FluidPanel v-for="(i, index) in len" :style="setH()">{{ index }}</FluidPanel>
                    </Fluid>
					`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "是否贴边",
                    key: "toEdge",
                    demoDefault: true,
                    explain: "是否贴边",
                    dataType: "Boolean",
                    tag: "vSwitch",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "布局类型",
                    key: "type",
                    demoDefault: "column",
                    explain: "布局类型，column：css多栏布局, position:js布局",
                    dataType: "String",
                    tag: "vSelect",
                    default: null,
                    options: ["column", "position"],
                },
                {
                    showConfig: true,
                    label: "子元素宽度",
                    key: "size",
                    demoDefault: "",
                    explain: "子元素宽度,单位px和%",
                    dataType: "Number|String",
                    tag: "vInputNumber",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "列数",
                    key: "column",
                    demoDefault: "",
                    explain: "列数, size优先级高于column，列数，在没有指定size下动态计算size大小",
                    dataType: "Number|String",
                    tag: "vInputNumber",
                    default: "",
                },
                {
                    showConfig: true,
                    label: "间隙",
                    key: "gap",
                    demoDefault: "",
                    explain: "间隙,布局类型为column时仅对左右间隙有用，分为[x,y]",
                    dataType: "Number|String|Array",
                    tag: "vInputNumber",
                    default: "",
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
                    key: "on-refresh",
                    explain: "数量或者尺寸变化",
                    dataType: "Function：Event",
                    default: "()=>{}",
                },
            ]
        },
    },
}
</script>
