<template>
    <li :class="[_tobogPrefix_]">
        <slot></slot>
    </li>
</template>
<script>
export default {
    name: "Carousel-item",
    componentName: "Carousel-item",
    mounted() {
        this.update()
    },
    methods: {
        update() {
            this.$parent &&
                this.$parent.$options.name === "Carousel" &&
                this.$parent.updateConfig &&
                this.$parent.updateConfig()
        },
    },
    beforeDestroy() {
        this.update()
    },
}
</script>
