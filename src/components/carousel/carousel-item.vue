<template>
    <li :class="[_tobogPrefix_]">
        <slot></slot>
    </li>
</template>
<script>
export default {
    name: "Carousel-Item",
    componentName: "CarouselItem",
    mounted() {
        this.update()
    },
    methods: {
        update() {
            this.$parent && this.$parent.updateConfig && this.$parent.updateConfig()
        },
    },
    beforeDestroy() {
        this.update()
    },
}
</script>
