<template>
    <Dragresize
        v-bind="getPositionParams"
        hover
        :style="getStyle"
        :class="classes"
        :data-vue-module="$options.name"
        @on-move="handleMove"
    >
        <slot></slot>
    </Dragresize>
</template>
<script>
import { setTransform, setTopLeft, perc } from "./utils";
import { calcGridItemPosition, calcXY } from "./calculateUtils";
import Dragresize from "../../dragresize/src/index";
export default {
    name: "GridLayoutItem",
    inject: ["$GridLayoutContext"],
    components: {
        Dragresize,
    },
    props: {
        // isBounded: Boolean,
        draggable: {
            type: Boolean,
            default: null,
        },
        resizable: {
            type: Boolean,
            default: null,
        },
        droppable: {
            type: Boolean,
            default: null,
        },
        // transformScale: Number,
        static: Boolean,
        // useCSSTransforms: Boolean,
        // usePercentages: Number,

        x: Number,
        y: Number,
        w: Number,
        h: Number,

        minW: Number,
        maxW: Number,
        minH: Number,
        maxH: Number,
        i: [String, Number],

        margin: Array,
        containerPadding: Array,
        // rowHeight: Number,
        maxRows: Number,
    },
    data() {
        return {
            resizing: null,
            dragging: null,
        };
    },
    mounted() {},
    methods: {
        handleMove({ result, status }) {
            this.dragging = status == -1 ? null : result;
            const { x, y } = calcXY(this.getPositionParams, result.top, result.left, this.w, this.h);
            if (!this.$GridLayoutContext) return;
            console.log(result, status)
            if (status == 0) {
                this.$GridLayoutContext.onDragStart(this.i, x, y, {
                    newPosition: result,
                });
                return;
            }
            if (status == 1) {
                this.$GridLayoutContext.onDrag(this.i, x, y, {
                    newPosition: result,
                });
                return;
            }
            if (status == -1) {
                this.$GridLayoutContext.onDragStop(this.i, x, y, {
                    newPosition: result,
                });
            }
        },
    },
    computed: {
        getPositionParams() {
            return {
                rowHeight: this.$GridLayoutContext.rowHeight,
                cols: this.$GridLayoutContext.cols,
                containerWidth: this.$GridLayoutContext.width || 100,
                containerPadding: this.$GridLayoutContext.containerPadding || [0, 0],
                margin: this.$GridLayoutContext.margin,
                maxRows: this.$GridLayoutContext.maxRows,
                usePercentages: this.$GridLayoutContext.usePercentages,
                useCSSTransforms: this.$GridLayoutContext.useCSSTransforms,
                draggable: this.draggable == null ? this.$GridLayoutContext.draggable : this.draggable,
                resizable: this.draggable == null ? this.$GridLayoutContext.resizable : this.resizable,
                droppable: this.droppable == null ? this.$GridLayoutContext.droppable : this.droppable,
            };
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-draggable`]: this.getPositionParams.draggable,
                    [`${_tobogPrefix_}-dragging`]: !!this.dragging,
                    [`${_tobogPrefix_}-resizable`]: this.getPositionParams.resizable,
                    [`${_tobogPrefix_}-resizing`]: !!this.resizing,
                },
            ];
        },
        getStyle() {
            const positionParams = this.getPositionParams;
            const pos = calcGridItemPosition(positionParams, this.x, this.y, this.w, this.h, {
                resizing: this.resizing,
                dragging: this.dragging,
            });
            let style = {};
            if (positionParams.useCSSTransforms) {
                style = setTransform(pos);
            } else {
                style = setTopLeft(pos);
                // This is used for server rendering.
                if (positionParams.usePercentages) {
                    style.left = perc(pos.left / positionParams.containerWidth);
                    style.width = perc(pos.width / positionParams.containerWidth);
                }
            }
            return style;
        },
    },
    watch: {
        "getPositionParams.draggable": function() {
            this.dragMove();
        },
    },
    beforeDestroy() {
        this._DragMove && this._DragMove.destroy();
        this._DragMove = null;
    },
};
</script>
