<template>
    <div :class="classes" :style="getStyle" :data-vue-module="$options.name">
        <template v-if="getRatio > 0">
            <div :class="[_tobogPrefix_ + '-ratio-inner']">
                <slot></slot>
            </div>
            <i :class="[_tobogPrefix_ + '-ratio-icon']" :style="{paddingTop: 100 * getRatio + '%'}"></i>
        </template>
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>
<script>
import {findComponentUpward} from "../../../utils/findComponent"
export default {
    name: "GridItem",
    componentName: "GridItem",
    props: {
        ratio: {
            type: [Number, String, Object],
            default: 0,
        },
    },
    data() {
        return {
            // Grid: {},
        }
    },
    created() {
        this.__Grid = findComponentUpward(this, "Grid") || {}
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [_tobogPrefix_, {[`${this._tobogPrefix_}-ratio`]: this.getRatio > 0}]
        },
        getRatio() {
            return this.ratio || this.__Grid.getRatio || 0
        },
        getStyle() {
            const grid = this.__Grid.getGrid || 0
            return grid > 0
                ? {
                      width: 100 / grid + "%",
                  }
                : {}
        },
    },
}
</script>
