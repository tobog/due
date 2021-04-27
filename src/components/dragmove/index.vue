<template>
    <div :class="[_tobogPrefix_]" :data-vue-module="$options.name" :style="size || {}">
        <slot></slot>
    </div>
</template>

<script>
import {DragMove} from "../../utils/dom"
export default {
    name: "Dragmove",
    componentName: "Dragmove",
    props: {
        disabled: Boolean,
        boundaryPoint: Object,
        boundaryElement: [Element, String, Boolean],
        options: Object,
        setStyle: Function,
    },
    data() {
        return {
            size: null,
        }
    },
    mounted() {
        this.dragMove()
    },
    methods: {
        dragMove() {
            if (this.disabled) {
                this._DragMoveList && this._DragMoveList.destroy()
                this._DragMoveList = null
                return
            }
            this.$nextTick(() => {
                if (!this.$el || this._DragMoveList) return
                this._DragMoveList = new DragMove(
                    this.$el,
                    {
                        boundaryElement: this.boundaryElement === true ? this.$el.offsetParent : this.boundaryElement,
                        boundaryPoint: this.boundaryPoint,
                        timeOut: null,
                        boundaryCalc: this.boundaryPoint && !!Object.keys(this.boundaryPoint).length,
                        ...this.options,
                    },
                    (obj) => {
                        this.size =
                            this.setStyle === "function"
                                ? this.setStyle(obj)
                                : {
                                      transform: `translate(${obj.data.translateX + obj.distance[0]}px,${obj.data
                                          .translateY + obj.distance[1]}px)`,
                                  }
                        this.$emit("on-move", {
                            boundaryPosition: obj.boundaryPosition,
                            distance: obj.distance,
                            data: obj.data,
                            axis: obj.axis,
                            tempSpeed: obj.tempSpeed,
                            speed: obj.speed,
                            cancel: obj.cancel,
                            style: obj.style,
                            props: obj.props,
                            result: this.size,
                        })
                    }
                )
            })
        },
    },
    watch: {
        disabled() {
            this.dragMove()
        },
    },
    beforeDestroy() {
        this._DragMoveList && this._DragMoveList.destroy()
        this._DragMoveList = null
    },
}
</script>
