<style lang="scss"></style>

<template>
    <div :class="classes" :style="getStyle">
        <slot></slot>
        <GridLayoutItem
            :class="[_tobogPrefix_ + '-placeholder']"
            v-if="isDragging"
            :x="placeholder.x"
            :y="placeholder.y"
            :w="placeholder.w"
            :h="placeholder.h"
            :i="placeholder.i"
        ></GridLayoutItem>
    </div>
</template>
<script>
import mediaSize from "../../../mixins/mediaSize"
import GridLayoutItem from "./item"
export default {
    name: "GridLayout",
    mixins: [mediaSize],
    components: {
        GridLayoutItem,
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
        // margin: [Object, Array, Number, String], //{lg:[]},[x,y],xy
        layouts: [Object, Array], //{lg:[x1,x2]},[x1,x2],// size,position
        rowHeight: {
            type: Number,
            default: 150,
        },
        maxRows: {
            type: Number,
            default: Infinity,
        },
        margin: {
            type: [Object, Array, Number, String],
            default: function() {
                return [10, 10]
            },
        },
        toEdge: {
            type: Boolean,
            default: true,
        },
        isDraggable: {
            type: Boolean,
            default: true,
        },
        isResizable: {
            type: Boolean,
            default: true,
        },
        isDroppable: {
            type: Boolean,
            default: true,
        },
        useCSSTransforms: Boolean,
        transformScale: Boolean,
    },
    data() {
        return {
            activeDrag: null,
            placeholder: {
                x: 0,
                y: 0,
                w: 0,
                h: 0,
                i: -1,
            },
            originalLayout:null,
            layout:null,
            isDragging:false,
            containerWidth:1201,
        }
    },
    created() {
        console.log(this.ConfigProvide)
    },
    methods: {
        layoutUpdate(){

        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    // [`${_tobogPrefix_}-border`]: this.border,
                    // [`${_tobogPrefix_}-hover`]: this.hover,
                },
            ]
        },
        getStyle() {
            let style = {}
            return style
        },
        getInitLayout() {
            // if (Array.isArray(this.layouts)) return [...this.layouts]
            // if (this.layouts && typeof this.layouts === "object") {
            //     return [...this.getMediaData(this.layouts, this.getMediaWidth).data]
            // }
            return []
        },
        getColNo() {
            // if (this.cols && typeof this.cols === "object") {
            //     return this.getMediaData(this.cols, this.getMediaWidth).data
            // }
            return this.cols
        },
        // getMargin() {
        //     if (this.cols && typeof this.cols === "object") {
        //         return this.getMediaData(this.cols, this.getMediaWidth).data
        //     }
        //     return this.cols
        // },
    },
}
</script>
