<template>
    <div :class="[_tobogPrefix_ + '-item']">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "Carousel",
    mounted() {
        this.update();
    },
    methods: {
        update() {
            this.$parent && this.$parent.updateConfig && this.$parent.updateConfig();
        },
    },
    beforeDestroy() {
        this.update();
    },
};
</script>
