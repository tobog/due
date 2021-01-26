<template>
    <li :class="[_tobogPrefix_]" :data-index="index" :data-vue-module="$options.name" :style="getStyle">
        <slot></slot>
    </li>
</template>

<script>
import {unit} from "../../utils/tool"
export default {
    name: "FluidPanel",
    componentName: "FluidPanel",
    data() {
        return {
            position: [],
            index: null,
        }
    },
    created() {
        this.$parent.refresh && this.$parent.refresh()
    },
    beforeUpdate() {
        // 当组件size 变换时 无法触发refresh
        if (!this.__running) {
            this.__running = true
            this.$parent.refresh && this.$parent.refresh(false)
        }
        clearTimeout(this._forceFresh)
        this._forceFresh = setTimeout(() => {
            this.__running = false
        }, 2300)
    },
    computed: {
        getStyle() {
            if (this.$parent.type !== "position") {
                return this.$parent.getColumnGap[1] == null
                    ? {}
                    : {
                          marginBottom: unit(this.$parent.getColumnGap[1]),
                      }
            }
            return {
                width: unit(this.$parent.getCellSize),
                transform: `translate(${this.position[0] || 0},${this.position[1] || 0})`,
                left: this.position[2],
            }
        },
    },
    beforeDestroy() {
        this.$parent.refresh && this.$parent.refresh()
        clearTimeout(this._forceFresh)
    },
}
</script>
