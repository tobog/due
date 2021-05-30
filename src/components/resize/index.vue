<template>
    <div :class="classes" :data-vue-module="$options.name" :style="getStyle">
        <slot></slot>
        <i
            v-for="item in getTypes"
            :key="item"
            :ref="item"
            :class="[_tobogPrefix_ + (item.indexOf('-') > -1 ? '-icon' : '-icon1')]"
            :data-position="item"
        ></i>
    </div>
</template>

<script>
import { DragMove } from "../../utils/dom";
export default {
    name: "Resizable",
    props: {
        type: {
            type: [String, Array], // 'all,top,bottom,right,left,top-left,top-right,bottom-left,bottom-right'
            default: "bottom-right",
        },
        hover: Boolean,
        resize: {
            type: Boolean,
            default: true,
        },
        max: [Number, Array],
        min: [Number, Array],
        boundaryElement: [Element, String, Boolean],
    },
    data() {
        return {
            left: null,
            top: null,
            width: null,
            height: null,
        };
    },
    mounted() {
        this.dragMove();
    },
    methods: {
        hasType(type) {
            return this.getTypes.some((val) => val === type);
        },
        dragMove() {
            if (this._DragMoveList) {
                Object.values(this._DragMoveList).forEach((dragMove) => {
                    dragMove && dragMove.destroy();
                });
            }
            this._DragMoveList = {};
            this.$nextTick(() => {
                let boundaryElement = this.boundaryElement;
                if (this.boundaryElement === true) boundaryElement = this.$el.offsetParent;
                // console.log(this.$refs)
                this.getTypes.forEach((key) => {
                    const ele = this.$refs[key] && this.$refs[key][0];
                    if (ele) {
                        this._DragMoveList[key] = new DragMove(
                            ele,
                            {
                                style: ["left", "top", "width", "height"],
                                relatedElement: this.$el,
                                throttle: 60,
                                boundaryElement,
                            },
                            (obj) => this.handlePos(key, obj)
                        );
                    }
                });
            });
        },
        handlePos(type, obj) {
            const { data, distance } = obj;
            console.log(obj);
            const min = this.getMin;
            const max = this.getMax;
            if (type === "bottom-right") {
                this.width = parseFloat(data.width) + distance[0];
                this.height = parseFloat(data.height) + distance[1];
                if (max[0] && this.width > max[0]) this.width = max[0];
                if (this.width < min[0]) this.width = min[0];
                if (max[1] && this.height > max[1]) this.height = max[1];
                if (this.height < min[1]) this.height = min[1];
            } else if (type === "bottom-left") {
                this.left = parseFloat(data.left) + distance[0];
                const width = (this.width = parseFloat(data.width) - distance[0]);
                this.height = parseFloat(data.height) + distance[1];
                if (max[0] && this.width > max[0]) this.width = max[0];
                if (this.width < min[0]) this.width = min[0];
                if (max[1] && this.height > max[1]) this.height = max[1];
                if (this.height < min[1]) this.height = min[1];
                this.left += width - this.width;
            } else if (type === "top-right") {
                this.top = parseFloat(data.top) + distance[1];
                this.width = parseFloat(data.width) + distance[0];
                const height = (this.height = parseFloat(data.height) - distance[1]);
                if (max[0] && this.width > max[0]) this.width = max[0];
                if (this.width < min[0]) this.width = min[0];
                if (max[1] && this.height > max[1]) this.height = max[1];
                if (this.height < min[1]) this.height = min[1];
                this.top += height - this.height;
            } else if (type === "top-left") {
                this.left = parseFloat(data.left) + distance[0];
                this.top = parseFloat(data.top) + distance[1];
                const width = (this.width = parseFloat(data.width) - distance[0]);
                const height = (this.height = parseFloat(data.height) - distance[1]);
                if (max[0] && this.width > max[0]) this.width = max[0];
                if (this.width < min[0]) this.width = min[0];
                if (max[1] && this.height > max[1]) this.height = max[1];
                if (this.height < min[1]) this.height = min[1];
                this.left += width - this.width;
                this.top += height - this.height;
            } else if (type === "left") {
                this.left = parseFloat(data.left) + distance[0];
                const width = (this.width = parseFloat(data.width) - distance[0]);
                if (max[0] && this.width > max[0]) this.width = max[0];
                if (this.width < min[0]) this.width = min[0];
                this.left += width - this.width;
            } else if (type === "right") {
                this.width = parseFloat(data.width) + distance[0];
                if (max[0] && this.width > max[0]) this.width = max[0];
                if (this.width < min[0]) this.width = min[0];
            } else if (type === "top") {
                this.top = parseFloat(data.top) + distance[1];
                const height = (this.height = parseFloat(data.height) - distance[1]);
                if (max[1] && this.height > max[1]) this.height = max[1];
                if (this.height < min[1]) this.height = min[1];
                this.top += height - this.height;
            } else if (type === "bottom") {
                this.height = parseFloat(data.height) + distance[1];
                if (max[1] && this.height > max[1]) this.height = max[1];
                if (this.height < min[1]) this.height = min[1];
            }

            this.$emit("on-resize", {
                left: this.left,
                top: this.top,
                width: this.width,
                height: this.height,
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
        getTypes() {
            if (!this.resize) return [];
            if (!this.type || this.type === "all")
                return ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "bottom", "top"];
            if (Array.isArray(this.type)) return this.type;
            return [this.type];
        },
        getStyle() {
            let style = {};
            if (this.left != null) style.left = this.left + "px";
            if (this.top != null) style.top = this.top + "px";
            if (this.width != null) style.width = this.width + "px";
            if (this.height != null) style.height = this.height + "px";
            return style;
        },
        getMax() {
            if (!this.max || this.max <= 0) return false;
            return Array.isArray(this.max) ? this.max : [this.max, this.max];
        },
        getMin() {
            if (!this.min || this.min <= 0) return 0;
            return Array.isArray(this.min) ? this.min : [this.min, this.min];
        },
    },
    beforeDestroy() {
        if (this._DragMoveList) {
            Object.values(this._DragMoveList).forEach((dragMove) => {
                dragMove && dragMove.destroy();
            });
        }
        this._DragMoveList = null;
    },
};
</script>
