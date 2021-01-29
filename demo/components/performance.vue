<style lang="scss" scoped>
.pefanrce-demo {
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Icon 图标)</h2>
            <h4 class="padding-top-10">图标使用</h4>
        </template>
        <template v-slot="config">
            <!-- <vVirtuallist v-bind="config" @on-refresh="handleSize" cellSelector="pefanrce-demo">
                <div v-for="index in size.length" :key="index" class="pefanrce-demo">{{ index + size.index }}</div>
            </vVirtuallist> -->
            <vOptions :options="opts"> </vOptions>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            size: {
                length: 0,
                size: 0,
            },
            opts: [],
        }
    },
    created() {
        for (let index = 0; index < 1000; index++) {
            this.opts.push({
                label: index,
                value: index,
            })
        }
    },
    methods: {
        // handleSize(data) {
        //     console.log(data, "===========")
        //     this.size = data
        // },
    },
    computed: {
        getCode() {
            return `
					`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "total",
                    key: "total",
                    demoDefault: 1000,
                    explain: "total",
                    dataType: "Number",
                    tag: "vInputNumber",
                    default: 0,
                },
            ]
        },
    },
}
</script>
