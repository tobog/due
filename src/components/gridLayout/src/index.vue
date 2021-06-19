<style lang="scss"></style>

<template>
    <div :class="classes" :style="getStyle" :data-vue-module="$options.name">
        <slot></slot>
        <GridLayoutItem
            v-if="activeDrag"
            :class="[_tobogPrefix_ + '-placeholder']"
            :w="activeDrag.w"
            :h="activeDrag.h"
            :x="activeDrag.x"
            :y="activeDrag.y"
            :i="activeDrag.i"
            :containerWidth="width"
            :cols="cols"
            :margin="margin"
            :containerPadding="containerPadding || margin"
            :maxRows="maxRows"
            :rowHeight="rowHeight"
            :draggable="false"
            :resizable="false"
            :isBounded="false"
            :useCSSTransforms="useCSSTransforms"
            :transformScale="transformScale"
        ></GridLayoutItem>
    </div>
</template>
<script>
import {
    bottom,
    cloneLayoutItem,
    compact,
    compactType,
    getAllCollisions,
    getLayoutItem,
    moveElement,
    synchronizeLayoutWithChildren,
    withLayoutItem,
} from "./utils";
import mediaSize from "../../../mixins/mediaSize";
import GridLayoutItem from "./item";
export default {
    name: "GridLayout",
    componentName: "GridLayout",
    mixins: [mediaSize],
    components: {
        GridLayoutItem,
    },
    model: {
        prop: "layout",
        event: "on-change",
    },
    provide() {
        return {
            $GridLayoutContext: this,
        };
    },
    props: {
        // breakpoints:Object,
        autoSize: {
            type: Boolean,
            default: true,
        },
        cols: {
            type: [Object, Number],
            default: 12,
        }, //{lg:[]},[x,y],xy
        layout: [Object, Array], //{lg:[x1,x2]},[x1,x2],// size,position
        rowHeight: {
            type: Number,
            default: 30,
        },
        maxRows: {
            type: Number,
            default: Infinity,
        },
        margin: {
            type: [Object, Array, Number, String],
            default: function() {
                return [10, 10];
            },
        },
        toEdge: {
            type: Boolean,
            default: true,
        },
        draggable: {
            type: Boolean,
            default: true,
        },
        resizable: {
            type: Boolean,
            default: false,
        },
        droppable: {
            type: Boolean,
            default: false,
        },
        useCSSTransforms: Boolean,
        transformScale: Boolean,
        compactType: {
            default: 'vertical'
        }
    },
    data() {
        return {
            activeDrag: null,
            layouts: [],
            width: 0,
            height: "",
        };
    },
    beforeCreate() {
        this.__clientCallback = () => {
            this.width = this.$el.clientWidth;
        };
    },
    mounted() {
        this.__clientCallback();
        this.initLayout();
        this.mounted = true;
        // console.log(this)
    },
    methods: {
        initLayout() {
            this.layouts = synchronizeLayoutWithChildren(
                this.layout,
                this.$children,
                this.cols,
                this.getCompactType,
                this.allowOverlap
            );
            this.layoutMaybeChanged(this.layouts, this.layout);
        },
        layoutMaybeChanged(newLayout, oldLayout) {
            this.containerHeight();
            if (!oldLayout) oldLayout = newLayout;
            // console.log(JSON.stringify(newLayout));
            this.$emit("on-change", newLayout);
            this.$emit("update:sync", newLayout);
        },
        containerHeight() {
            if (!this.autoSize) return (this.height = "");
            const nbRow = bottom(this.layouts);
            const containerPaddingY = this.containerPadding ? this.containerPadding[1] : this.margin[1];
            this.height = nbRow * this.rowHeight + (nbRow - 1) * this.margin[1] + containerPaddingY * 2 + "px";
        },
        onDragStart(i) {
            const l = getLayoutItem(this.layouts, i);
            if (!l) return;
            this.oldDragItem = cloneLayoutItem(l);
            this.oldLayout = this.layouts;
        },
        onDrag(i, x, y) {
            const l = getLayoutItem(this.layouts, i);
            if (!l) return;

            // Create placeholder (display only)
            const placeholder = {
                w: l.w,
                h: l.h,
                x: l.x,
                y: l.y,
                placeholder: true,
                i: i,
            };

            // Move the element to the dragged location.
            const isUserAction = true;
            const layouts = moveElement(
                this.layouts,
                l,
                x,
                y,
                isUserAction,
                this.preventCollision,
                this.getCompactType,
                this.cols,
                this.allowOverlap
            );
            this.layouts = this.allowOverlap ? layouts : compact(layouts, this.getCompactType, this.cols);
            this.activeDrag = placeholder;
            this.layoutMaybeChanged(this.layouts, this.oldLayout);
        },
        onDragStop(i, x, y) {
            if (!this.activeDrag) return;
            const l = getLayoutItem(this.layouts, i);
            if (!l) return;
            // Move the element to the dragged location.
            const isUserAction = true;
            const layouts = moveElement(
                this.layouts,
                l,
                x,
                y,
                isUserAction,
                this.preventCollision,
                this.getCompactType,
                this.cols,
                this.allowOverlap
            );
            const oldLayout = this.oldLayout;
            this.activeDrag = this.oldDragItem = this.oldLayout = null;
            this.layouts = this.allowOverlap ? layouts : compact(layouts, this.getCompactType, this.cols);
            this.layoutMaybeChanged(this.layouts, oldLayout);
        },
        // onResizeStart(i, w, h, { e, node }) {
        //     const l = getLayoutItem(this.layouts, i);
        //     if (!l) return;
        //     this.oldResizeItem = cloneLayoutItem(l);
        //     this.oldLayout = this.layouts;
        // },
        // onResize(i, w, h, { e, node }) {
        //     const [newLayout, l] = withLayoutItem(this.layouts, i, (l) => {
        //         // Something like quad tree should be used
        //         // to find collisions faster
        //         let hasCollisions;
        //         if (this.preventCollision && !this.allowOverlap) {
        //             const collisions = getAllCollisions(this.layouts, { ...l, w, h }).filter(
        //                 (layoutItem) => layoutItem.i !== l.i
        //             );
        //             hasCollisions = collisions.length > 0;

        //             // If we're colliding, we need adjust the placeholder.
        //             if (hasCollisions) {
        //                 // adjust w && h to maximum allowed space
        //                 let leastX = Infinity,
        //                     leastY = Infinity;
        //                 collisions.forEach((layoutItem) => {
        //                     if (layoutItem.x > l.x) leastX = Math.min(leastX, layoutItem.x);
        //                     if (layoutItem.y > l.y) leastY = Math.min(leastY, layoutItem.y);
        //                 });

        //                 if (Number.isFinite(leastX)) l.w = leastX - l.x;
        //                 if (Number.isFinite(leastY)) l.h = leastY - l.y;
        //             }
        //         }

        //         if (!hasCollisions) {
        //             // Set new width and height.
        //             l.w = w;
        //             l.h = h;
        //         }

        //         return l;
        //     });

        //     // Shouldn't ever happen, but typechecking makes it necessary
        //     if (!l) return;
        //     // Create placeholder element (display only)
        //     const placeholder = {
        //         w: l.w,
        //         h: l.h,
        //         x: l.x,
        //         y: l.y,
        //         static: true,
        //         i: i,
        //     };
        //     this.layouts = this.allowOverlap ? newLayout : compact(newLayout, this.getCompactType, this.cols);
        //     this.activeDrag = placeholder;
        // },
        // onResizeStop(i, w, h, { e, node }) {
        //     const l = getLayoutItem(this.layouts, i);
        //     // Set state
        //     const newLayout = this.allowOverlap ? this.layouts : compact(this.layouts, this.getCompactType, this.cols);
        //     const oldLayout = this.oldLayout;
        //     this.activeDrag = this.oldResizeItem = this.oldLayout = null;
        //     this.layouts = this.allowOverlap ? newLayout : compact(newLayout, this.getCompactType, this.cols);
        //     // this.layoutMaybeChanged(this.layouts, oldLayout);
        // },
    },
    computed: {
        getCompactType() {
            return compactType({ verticalCompact: this.verticalCompact, compactType: this.compactType });
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    // [`${_tobogPrefix_}-border`]: this.border,
                    // [`${_tobogPrefix_}-hover`]: this.hover,
                },
            ];
        },
        getStyle() {
            return {
                height: this.height,
            };
        },
        getInitLayout() {
            // if (Array.isArray(this.layouts)) return [...this.layouts]
            // if (this.layouts && typeof this.layouts === "object") {
            //     return [...this.getMediaData(this.layouts, this.getMediaWidth).data]
            // }
            return [];
        },
        getColNo() {
            // if (this.cols && typeof this.cols === "object") {
            //     return this.getMediaData(this.cols, this.getMediaWidth).data
            // }
            return this.cols;
        },
        // getMargin() {
        //     if (this.cols && typeof this.cols === "object") {
        //         return this.getMediaData(this.cols, this.getMediaWidth).data
        //     }
        //     return this.cols
        // },
    },
};
</script>
