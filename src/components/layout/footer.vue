<template>
    <footer :class="classes" :style="getStyle">
        <slot></slot>
    </footer>
</template>

<script>
import mixin from "./mixin"
export default {
    name: "Layout-Footer",
    mixins: [mixin],
}
</script>
