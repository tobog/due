<style lang="scss"></style>

<template>
    <div :class="classes" :style="getStyle">
        <slot></slot>
    </div>
</template>
<script>
import { unit } from "../../../utils/tool";
export default {
    name: "GridLayoutItem",
    props: {
        isBounded: Boolean,
        isDraggable: Boolean,
        isResizable: Boolean,
        isDroppable: Boolean,
        gpu: Boolean,
        transformScale: Number,
        static: Boolean,
        position: Array,
        size: Array, //w,h,
        minSize: Array, //w,h,
        maxSize: Array, //w,h,
        useCSSTransforms: Number,
        usePercentages: Number,
        i: Number,
    },
    data() {
        return {
            left: null,
            top: null,
            width: null,
            height: null,
            // rowHeight:null,
            // cols:null,
        };
    },
    methods: {
        updateSize() {},
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    // [`${_tobogPrefix_}-border`]: this.border,
                },
            ];
        },
        getStyle() {
            // const [left, top, width, height] = this.size
            let style = {};
            if (this.gpu) {
                style = {
                    width: unit(this.width),
                    height: unit(this.height),
                    transfrom: `translate(${unit(this.left)},${unit(this.top)})`,
                    position: "absolute",
                };
            } else {
                style = {
                    left: unit(this.left),
                    top: unit(this.top),
                    width: unit(this.width),
                    height: unit(this.height),
                    position: "absolute",
                };

                // This is used for server rendering.
                if (this.usePercentages) {
                    style.left = this.left / this.$parent.containerWidth + "%";
                    style.width = this.width / this.$parent.containerWidth;
                    +"%";
                }
            }
            return style;
        },
    },
};
</script>
