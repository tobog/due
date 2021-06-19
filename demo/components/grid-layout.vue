<style lang="scss" scoped>
.demo-grid {
    position: relative;
}
.demo-item {
    background-color: rgba($color: #000000, $alpha: 0.3);
    display: inline-flex;
    align-items: flex-start;
    // justify-content: center;
    flex-direction: column;
    font-size: 20px;
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
            {{layout}}
            <vGridLayout v-model="layout" class="demo-grid" v-bind="config">
                <vGridLayoutItem v-for="item in layout" v-bind="item" class="demo-item" :key="item.i">
                    <span> {{ item.i }}</span>
                    <span> @x:{{ item.x }}</span>
                    <span> @y:{{ item.y }}</span>
                    <span> @h:{{ item.h }}</span>
                </vGridLayoutItem>
                <!-- <vGridLayoutItem v-bind="layout[1]" class="demo-item">grid:2</vGridLayoutItem>
                <vGridLayoutItem v-bind="layout[2]" class="demo-item"></vGridLayoutItem> -->
            </vGridLayout>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            layout: [
                // {
                //     i: 1,
                //     x: 0,
                //     y: 0,
                //     w: 1,
                //     h: 1,
                // },
                // {
                //     i: 1,
                //     x: 2,
                //     y: 0,
                //     w: 1,
                //     h: 2,
                // },
                // {
                //     i: 3,
                //     x: 3,
                //     y: 0,
                //     w: 3,
                //     h: 3,
                // },
            ],
        };
    },
    created() {
        this.layout = this.generateLayout();
    },
    methods: {
        generateLayout(len = 12) {
            let arr = [];
            for (let i = 0; i < len; i++) {
                const y = Math.ceil(Math.random() * 4) + 2;
                arr.push({
                    x: (i * 2) % 12,
                    y: Math.floor(i / 6) * y,
                    // w: Math.random() > 0.5 ? 2 : 4,
                    w: 2,
                    h: y,
                    i,
                });
            }
            return arr;
        },
    },
    computed: {
        getCode() {
            return ``;
        },
        getConfig() {
            return [];
        },
    },
};
</script>
