<template>
    <div
        :class="_tobogPrefix_"
        :style="styles"
        :data-vview-module='$options.name'>
        <slot></slot>
    </div>
</template>

<script>
export default {
    name: 'Row',
    props: {
        grid: {
            type: [Number, String],
            default: 24,
        },
        gutter: {
            type: [Number, String],
            default: 0
        },
    },
    computed: {
        styles() {
            let style = {},
                gutter = this.gutter || 0;
            if (gutter != 0) {
                style.marginLeft = style.marginRight = `${gutter / -2}px`;
            }
            return style;
        }
    },

};
</script>
