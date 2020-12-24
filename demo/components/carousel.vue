<style lang="scss">
.demo-vcarousel {
    width: 100%;
    height: 100%;
    min-height: 200px;
    min-width: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    font-size: 20px;
    background: #506b9e;
    border: 1px solid #fff;
}
</style>

<template>
    <Demo :config="getConfig" :code="getCode">
        <template slot="header">
            <h2>代码示例 (Carousel 走马灯)</h2>
            <h4 class="padding-top-10">
                常用于一组图片或卡片轮播，当内容空间不足时，可以用走马灯的形式进行收纳，进行轮播展现。
            </h4>
        </template>
        <template v-slot="config">
            <vCarousel v-bind="config" style="height:200px;border:1px solid red;">
                <vCarouselItem v-for="i in 30" :key="i">
                    <div class="demo-vcarousel">{{ i }}</div>
                </vCarouselItem>
            </vCarousel>
            <vCarousel v-bind="config" style="height:200px;border:1px solid red;">
                <vCarouselItem>
                    <div class="demo-vcarousel">1</div>
                </vCarouselItem>
                <vCarouselItem>
                    <div class="demo-vcarousel">2</div>
                </vCarouselItem>
            </vCarousel>
            <vCarousel v-bind="config" style="height:200px;border:1px solid red;">
                <vCarouselItem>
                    <div class="demo-vcarousel">1</div>
                </vCarouselItem>
            </vCarousel>
        </template>
    </Demo>
</template>

<script>
export default {
    data() {
        return {
            val: 0,
        }
    },
    computed: {
        getCode() {
            return `<Carousel v-model="val" v-bind=CODE>
						<CarouselItem>
							<div class="demo-vcarousel">1</div>
						</CarouselItem>
						<CarouselItem>
							<div class="demo-vcarousel">2</div>
						</CarouselItem>
						<CarouselItem>
							<div class="demo-vcarousel">3</div>
						</CarouselItem>
						<CarouselItem>
							<div class="demo-vcarousel">4</div>
						</CarouselItem>
						<CarouselItem>
							<div class="demo-vcarousel">5</div>
						</CarouselItem>
					</Carousel>`
        },
        getConfig() {
            return [
                {
                    showConfig: true,
                    label: "展示指示器",
                    key: "showDot",
                    tag: "vSwitch",
                    demoDefault: true,
                    explain: "是否展示指示器",
                    dataType: "Boolean",
                    default: true,
                },
                {
                    showConfig: true,
                    label: "反向",
                    key: "reverse",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否反向",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "自动播放",
                    key: "autoplay",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否自动播放",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "循环",
                    key: "loop",
                    tag: "vSwitch",
                    demoDefault: false,
                    explain: "是否循环",
                    dataType: "Boolean",
                    default: false,
                },
                {
                    showConfig: true,
                    label: "间隔时间",
                    key: "interval",
                    tag: "vInputNumber",
                    demoDefault: 2000,
                    explain: "间隔时间",
                    dataType: "Number",
                    default: 2000,
                },
                {
                    showConfig: true,
                    label: "模式",
                    key: "mode",
                    tag: "vSelect",
                    demoDefault: "carousel",
                    explain: "模式:carousel, fade, card, scroll",
                    dataType: "Number",
                    default: "carousel",
                    options: ["carousel", "fade", "card", "scroll"],
                },
                {
                    showConfig: true,
                    label: "方向",
                    key: "direction",
                    tag: "vSelect",
                    demoDefault: "horizontal",
                    explain: "方向",
                    dataType: "String",
                    default: "horizontal",
                    options: ["horizontal", "vertical"],
                },
                {
                    showConfig: true,
                    label: "指示点位置",
                    key: "dotPosition",
                    tag: "vSelect",
                    demoDefault: "",
                    explain: "指示点位置：top, bottom, right, left",
                    dataType: "String",
                    default: "",
                    options: ["top", "bottom", "right", "left"],
                },
                {
                    showConfig: true,
                    label: "箭头触发方式",
                    key: "arrow",
                    tag: "vSelect",
                    demoDefault: "always",
                    explain: "左右箭头触发方式:hover, always, never",
                    dataType: "String",
                    default: "always",
                    options: ["hover", "always", "never"],
                },
                {
                    showConfig: true,
                    label: "指示器类型",
                    key: "dotType",
                    tag: "vSelect",
                    demoDefault: "default",
                    explain: "指示器类型:round,default,page,bullet",
                    dataType: "String",
                    default: "inside",
                    options: ["round", "default", "page", "bullet"],
                },
                {
                    showConfig: true,
                    label: "指示器触发方式",
                    key: "trigger",
                    tag: "vSelect",
                    demoDefault: "click",
                    explain: "指示器触发方式:click, hover",
                    dataType: "String",
                    default: "click",
                    options: ["click", "hover"],
                },
                {
                    label: "幻灯片的索引",
                    key: "value",
                    explain: "幻灯片的索引，从 0 开始，可以使用 v-model 双向绑定数据",
                    dataType: "Number",
                    default: "0",
                },
                {
                    label: "事件",
                    key: "on-change",
                    explain: "幻灯片切换时触发，目前激活的幻灯片的索引，原幻灯片的索引",
                    dataType: "Function:Event",
                    default: "(oldValue, value)=>{}",
                },
                {
                    label: "主体内容",
                    key: "slot",
                    explain: "CarouselItem子元素",
                    dataType: "VNode",
                    default: "-",
                },
            ]
        },
    },
}
</script>
