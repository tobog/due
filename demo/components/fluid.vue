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
        <vCol lg="24" span="24" class="demo-view">
            <vSwitch v-model="show" class="margin-bottom-10">
                <span slot="open">开</span>
                <span slot="close">关</span>
            </vSwitch>
            <vButton class="margin-10" theme="primary" @click="clear">{{ isStop ? "Run" : "Stop" }}</vButton>
            <section v-if="show">
                <vFluid v-bind="formData" class="fluid-demo">
                    <vFluidPanel v-for="(i, index) in len" :style="setH()">{{ index }}</vFluidPanel>
                </vFluid>
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
        return {
            len: [1, 2, 3, 5, 6, 7, 8, 9],
            isStop: false,
        };
    },
    mounted() {
        this.__setInterval = setInterval(() => {
            let len = [];
            for (let index = 0; index < Math.floor(Math.random() * 10) + 10; index++) {
                const element = (Math.random() * 5).toFixed(2);
                len.push(element);
            }
            this.len = len;
        }, 8000);
    },
    methods: {
        clear() {
            clearInterval(this.__setInterval);
            this.isStop = !this.isStop;
            if (this.isStop) return;
            this.__setInterval = setInterval(() => {
                let len = [];
                for (let index = 0; index < Math.floor(Math.random() * 20) + 10; index++) {
                    const element = (Math.random() * 5).toFixed(2);
                    len.push(element);
                }
                this.len = len;
            }, 5000);
        },
        setH() {
            return {
                height: Math.random() * 300 + "px",
                backgroundColor:
                    "#" +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10) +
                    Math.floor(Math.random() * 10),
            };
        },
    },
    computed: {
        getCode() {
            return `<vFluid v-bind="${this.getCodeString(this.formData)}" class="fluid-demo">
                        <vFluidPanel v-for="(i, index) in len" :style="setH()">{{ index }}</vFluidPanel>
                    </vFluid>
					`;
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
                    label: "布局类型",
                    key: "type",
                    tag: "vSelect",
                    options: ["column", "position"],
                    default: null,
                },
                {
                    label: "子元素宽度",
                    key: "size",
                    tag: "vInputNumber",
                    default: null,
                },
                {
                    label: "列数",
                    key: "column",
                    tag: "vInputNumber",
                    default: null,
                },
                {
                    label: "间隙",
                    key: "gap",
                    tag: "vInputNumber",
                    default: 30,
                },
            ];
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
            ];
        },
    },
};
</script>
