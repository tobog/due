<template>
    <div :class="classes" :data-vue-module="$options.name" :style="getStyle">
        <slot></slot>
    </div>
</template>

<script>
import { DragMove } from "../../utils/dom";
export default {
    name: "Draggable",
    props: {
        draggable: {
            type: Boolean,
            default: true,
        },
        boundaryPoint: Object,
        boundaryElement: [Element, String, Boolean],
    },
    data() {
        return {
            size: null,
        };
    },
    mounted() {
        this.dragMove();
    },
    methods: {
        dragMove() {
            if (!this.draggable) {
                this._DragMoveList && this._DragMoveList.destroy();
                this._DragMoveList = null;
                return;
            }
            this.$nextTick(() => {
                // console.log(this.$refs)
                if (!this.$el || this._DragMoveList) return;
                let boundaryElement = this.boundaryElement;
                if (this.boundaryElement === true) boundaryElement = this.$el.offsetParent;
                this._DragMoveList = new DragMove(
                    this.$el,
                    { boundaryElement, boundaryPoint: this.boundaryPoint, timeOut: 60 },
                    (obj) => {
                        const { data, distance } = obj;
                        console.log(obj);
                        this.size = [data.translateX + distance[0], data.translateY + distance[1]];
                        this.$emit("on-move", this.size);
                    }
                );
            });
        },
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-hover`]: this.hover,
                },
            ];
        },
        getStyle() {
            let style = {};
            if (this.size) {
                style.transform = `translate(${this.size[0]}px,${this.size[1]}px)`;
            }
            return style;
        },
    },
    watch: {
        move() {
            this.dragMove();
        },
    },
};
</script>
