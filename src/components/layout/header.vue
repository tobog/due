<template>
    <header :class="classes" :style="getStyle">
        <slot></slot>
    </header>
</template>
<script>
import mixin from "./mixin"
export default {
    name: "Layout-Header",
    mixins: [mixin],
}
</script>
