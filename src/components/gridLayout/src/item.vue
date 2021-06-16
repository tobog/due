<style lang="scss"></style>

<template>
    <ul :class="classes" :style="getStyle">
        <slot></slot>
    </ul>
</template>
<script>
import {setTransform, setTopLeft, perc} from "./utils"
import {calcGridItemPosition} from "./calculateUtils"
import {DragMove} from "../../../utils/dom"
export default {
    name: "GridLayoutItem",
    inject: ["$GridLayoutContext"],
    props: {
        // isBounded: Boolean,
        isDraggable: Boolean,
        isResizable: Boolean,
        isDroppable: Boolean,
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
        i: String,

        margin: Array,
        containerPadding: Array,
        // rowHeight: Number,
        maxRows: Number,
    },
    data() {
        return {
            resizing: null,
            dragging: null,
        }
    },
    mounted() {
        this.dragMove();
    },
    methods: {
        updateSize() {},
        dragMove() {
            if (!this.getPositionParams.isDraggable) {
                this._DragMove && this._DragMove.destroy()
                this._DragMove = null
                return
            }
            this.$nextTick(() => {
                if (!this.$el || this._DragMove) return
                this._DragMove = new DragMove(
                    this.$el,
                    {
                        boundaryElement: this.$GridLayoutContext && this.$GridLayoutContext.$el,
                        throttle: null,
                    },
                    (obj) => {
                        // this.style =
                        //     this.setStyle === "function"
                        //         ? this.setStyle(obj)
                        //         : {
                        //               transform: `translate(${obj.data.translateX + obj.distance[0]}px,${obj.data
                        //                   .translateY + obj.distance[1]}px)`,
                        //           }
                        // this.$emit("on-move", {
                        //     boundaryPosition: obj.boundaryPosition,
                        //     distance: obj.distance,
                        //     data: obj.data,
                        //     axis: obj.axis,
                        //     tempSpeed: obj.tempSpeed,
                        //     speed: obj.speed,
                        //     cancel: obj.cancel,
                        //     style: obj.style,
                        //     props: obj.props,
                        //     tempDistance: obj.tempDistance,
                        //     result: this.style,
                        // })
                    }
                )
            })
        },
    },
    computed: {
        getPositionParams() {
            return {
                rowHeight: this.$GridLayoutContext.rowHeight,
                cols: this.$GridLayoutContext.cols,
                containerWidth: this.$GridLayoutContext.width,
                containerPadding: this.$GridLayoutContext.containerPadding,
                margin: this.$GridLayoutContext.margin,
                maxRows: this.$GridLayoutContext.maxRows,
                usePercentages: this.$GridLayoutContext.usePercentages,
                useCSSTransforms: this.$GridLayoutContext.useCSSTransforms,
                isDraggable: this.isDraggable == null ? this.$GridLayoutContext.isDraggable : this.isDraggable,
                isResizable: this.isDraggable == null ? this.$GridLayoutContext.isResizable : this.isResizable,
                isDroppable: this.isDroppable == null ? this.$GridLayoutContext.isDroppable : this.isDroppable,
            }
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-draggable`]: this.getPositionParams.isDraggable,
                    [`${_tobogPrefix_}-draggable-dragging`]: !!this.dragging,
                    [`${_tobogPrefix_}-resizable`]: this.getPositionParams.resizable,
                    [`${_tobogPrefix_}-resizable-resizing`]: !!this.resizing,
                },
            ]
        },
        getStyle() {
            const positionParams = this.getPositionParams
            const pos = calcGridItemPosition(positionParams, this.x, this.y, this.w, this.h, {
                resizing: this.resizing,
                dragging: this.dragging,
            })
            let style = {}
            if (positionParams.useCSSTransforms) {
                style = setTransform(pos)
            } else {
                style = setTopLeft(pos)
                // This is used for server rendering.
                if (positionParams.usePercentages) {
                    style.left = perc(pos.left / positionParams.containerWidth)
                    style.width = perc(pos.width / positionParams.containerWidth)
                }
            }
            return style
        },
    },
    watch: {
        'getPositionParams.isDraggable': function() {
            this.dragMove()
        }
    },
    beforeDestroy() {
        this._DragMove && this._DragMove.destroy()
        this._DragMove = null
    },
}
</script>
