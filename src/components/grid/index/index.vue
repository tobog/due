<template>
    <section :class="classes" :data-vue-module="$options.name">
        <slot></slot>
    </section>
</template>

<script>
import mediaSize from "../../../mixins/mediaSize"
export default {
    name: "Grid",
    mixins: [mediaSize],
    props: {
        grid: {
            type: [Number, String, Object],
            default: 5,
        },
        ratio: {
            type: [Number, String, Object],
            default: 1,
        },
        border: Boolean,
        hover: Boolean,
    },
    data() {
        return {
            
        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-border`]: this.border,
                    [`${_tobogPrefix_}-hover`]: this.hover,
                },
            ]
        },
        getGrid() {
            if (this.grid instanceof Object) {
                return this.grid[this.getMedia] || 5
            }
            return this.grid || 5
        },
        getRatio() {
            if (this.ratio instanceof Object) {
                return this.ratio[this.getMedia] || 0
            }
            return this.ratio || 0
        },
    },
}
</script>
