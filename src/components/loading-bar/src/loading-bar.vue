<template>
    <div :class="[_tobogPrefix_]">
        <span :style="styles" :class="innerClasses"></span>
    </div>
</template>
<script>
import { unit } from "../../../utils/tool";
export default {
    name: "LoadingBar",
    props: {
        color: {
            type: String,
            default: "success",
        },
        failColor: {
            type: String,
            default: "error",
        },
        height: {
            type: Number,
            default: 3,
        },
    },
    data() {
        return {
            percent: 0,
            status: "",
            visible: true,
            ...this.$attrs,
        };
    },
    computed: {
        styles() {
            return {
                backgroundColor: this.failColor && this.status === "error" ? this.failColor : this.color,
                height: unit(this.height),
                width: unit(this.percent, "%"),
            };
        },
        innerClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-inner`,
                {
                    [`${_tobogPrefix_}-error`]: this.status === "error",
                    [`${_tobogPrefix_}-success`]: this.status === "success",
                },
            ];
        },
    },
};
</script>
