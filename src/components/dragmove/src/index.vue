<template>
    <div :class="classes" :data-vue-module="$options.name" :style="getStyle">
        <slot></slot>
        <template v-if="resizable && !disabled">
            <i
                v-for="item in getTypes"
                :key="item"
                :ref="item"
                :class="[_tobogPrefix_ + (item.indexOf('-') > -1 ? '-icon' : '-icon1')]"
                :data-position="item"
            ></i>
        </template>
    </div>
</template>

<script>
import { DragMove } from "../../../utils/dom";
export default {
    name: "DragResize",
    props: {
        type: {
            type: [String, Array], // 'all,top,bottom,right,left,top-left,top-right,bottom-left,bottom-right'
            default: "bottom-right",
        },
        hover: Boolean,
        max: [Number, Array],
        min: [Number, Array],
        boundaryElement: [Element, String, Boolean],
        disabled: Boolean,
        boundaryPoint: Object,
        // options: Object,
        // setStyle: Function,
        draggable: {
            type: Boolean,
            default: true,
        },
        resizable: {
            type: Boolean,
            default: true,
        },
        useCSSTransforms: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            left: null,
            top: null,
            width: null,
            height: null,
            style: {},
        };
    },
    mounted() {
        this.dragMove();
        this.dragResize();
    },
    methods: {
        dragMove() {
            if (this.disabled || !this.draggable) {
                this._DragMove && this._DragMove.destroy();
                this._DragMove = null;
                return;
            }
            this.$nextTick(() => {
                if (!this.$el || this._DragMove) return;
                this._DragMove = new DragMove(
                    this.$el,
                    {
                        boundaryElement: this.boundaryElement === true ? this.$el.offsetParent : this.boundaryElement,
                        boundaryPoint: this.boundaryPoint,
                        throttle: null,
                        boundaryCalc: this.boundaryPoint && !!Object.keys(this.boundaryPoint).length,
                        style: this.useCSSTransforms ? ["translateX", "translateY"] : ["left", "top"],
                    },
                    (obj) => {
                        console.log(obj);
                        this.left =
                            obj.distance[0] + parseFloat(obj.data[this.useCSSTransforms ? "translateX" : "left"] || 0);
                        this.top =
                            obj.distance[1] + parseFloat(obj.data[this.useCSSTransforms ? "translateY" : "top"] || 0);
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
                        // });
                    }
                );
            });
        },
        hasType(type) {
            return this.getTypes.some((val) => val === type);
        },
        dragResize() {
            if (this.disabled || !this.resizable) {
                this._DragResizeList && this._DragResizeList.destroy();
                this._DragResizeList = null;
                return;
            }
            if (this._DragResizeList) {
                Object.values(this._DragResizeList).forEach((item) => {
                    item && item.destroy();
                });
            }
            this._DragResizeList = {};
            this.$nextTick(() => {
                const boundaryElement = this.boundaryElement === true ? this.$el.offsetParent : this.boundaryElement;
                this.getTypes.forEach((key) => {
                    const ele = this.$refs[key] && this.$refs[key][0];
                    if (ele) {
                        this._DragResizeList[key] = new DragMove(
                            ele,
                            {
                                relatedElement: this.$el,
                                throttle: 60,
                                boundaryElement,
                                style: this.useCSSTransforms
                                    ? ["translateX", "translateY", "width", "height"]
                                    : ["left", "top", "width", "height"],
                            },
                            (obj) => this.handlePos(key, obj)
                        );
                    }
                });
            });
        },
        handlePos(type, obj) {
            console.log(obj, "handlePos");
            const { data, distance } = obj;
            const min = this.getMin;
            const max = this.getMax;
            if (this.useCSSTransforms) {
                data.left = data.translateX;
                data.top = data.translateY;
            }
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
            if (!this.resizable) return [];
            if (!this.type || this.type === "all")
                return ["left", "right", "top-left", "top-right", "bottom-left", "bottom-right", "bottom", "top"];
            if (Array.isArray(this.type)) return this.type;
            return [this.type];
        },
        getStyle() {
            if (this.useCSSTransforms) {
                return {
                    transform: `translate(${this.left || 0}px,${this.top || 0}px)`,
                    width: this.width + "px",
                    height: this.height + "px",
                };
            }
            return {
                left: this.left + "px",
                top: this.top + "px",
                width: this.width + "px",
                height: this.height + "px",
            };
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
    watch: {
        disabled() {
            this.dragMove();
        },
    },
    beforeDestroy() {
        if (this._DragResizeList) {
            Object.values(this._DragResizeList).forEach((item) => {
                item && item.destroy();
            });
        }
        this._DragMove && this._DragMove.destroy();
        this._DragResizeList = this._DragMove = null;
    },
};
</script>
