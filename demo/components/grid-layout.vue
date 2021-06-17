<style lang="scss" scoped>
.demo-grid {
    position: relative;
}
.demo-item {
    background-color: #ccc;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode" isAll>
        <template slot="header">
            <h2>代码示例 (Grid-GridLayout/GridLayoutItem 拖动栅格)</h2>
            <!-- <h4 class="padding-top-10">
                我们采用了5栅格系统，将区域进行5等分。 形成正方形
            </h4> -->
        </template>
        <template v-slot="config">
            <vGridLayout :layout="layout" class="demo-grid" v-bind="config">
                <vGridLayoutItem v-bind="layout[0]" class="demo-item">grid:1</vGridLayoutItem>
                <vGridLayoutItem v-bind="layout[1]" class="demo-item">grid:2</vGridLayoutItem>
                <vGridLayoutItem v-bind="layout[2]" class="demo-item"></vGridLayoutItem>
            </vGridLayout>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            layout: [
                {
                    i: 1,
                    x: 0,
                    y: 0,
                    w: 1,
                    h: 1,
                },
                {
                    i: 1,
                    x: 2,
                    y: 0,
                    w: 1,
                    h: 2,
                },
                {
                    i: 3,
                    x: 3,
                    y: 0,
                    w: 3,
                    h: 3,
                },
            ],
        }
    },
    computed: {
        getCode() {
            return `
					`
        },
        getConfig() {
            return []
        },
    },
}
</script>
