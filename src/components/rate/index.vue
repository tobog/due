<template>
    <ul :class="classes" :data-vue-module="$options.name" @mouseleave="handleMouseleave">
        <li
            v-for="index in count"
            :key="index"
            :class="starCls(index)"
            @mousemove.stop="handleMousemove(index, $event)"
            @click="handleClick(index)"
        >
            <slot>
                <template v-if="!!$slots.default || !!character">
                    <span :class="[_tobogPrefix_ + '-full']">{{ character }}</span>
                    <span data-rate="half" :class="[_tobogPrefix_ + '-half']">{{ character }}</span>
                </template>
                <template v-else>
                    <Icons type="ios-star" :class="[_tobogPrefix_ + '-full']"></Icons>
                    <Icons type="ios-star" data-rate="half" :class="[_tobogPrefix_ + '-half']"></Icons>
                </template>
            </slot>
        </li>
        <li :class="[_tobogPrefix_ + '-label']" v-if="showLabel && value > 0">
            <slot name="label">{{ value }} {{ langs("rate.star", "星") }}</slot>
        </li>
        <li v-if="name || name == '0'" style="display:none" :class="[_tobogPrefix_ + '-input']">
            <input type="hidden" :name="name" :value="current" />
        </li>
    </ul>
</template>

<script>
import Emitter from "../../utils/emitter"
import Icons from "../icons/index"
import langMinix from "../../mixins/lang"
export default {
    name: "Rate",
    mixins: [Emitter, langMinix],
    components: {
        Icons,
    },
    model: {
        prop: "value",
        event: "on-change",
    },
    props: {
        name: String,
        count: {
            type: Number,
            default: 5,
        },
        value: {
            type: Number,
            default: 2.5,
        },
        // size: {
        // 	type: Number,
        // 	// default:
        // },
        half: {
            type: Boolean,
            default: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readonly: {
            type: Boolean,
            default: false,
        },
        showLabel: {
            type: Boolean,
            default: true,
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        character: String,
        theme: String,
    },
    data() {
        return {
            current: this.value,
            model: this.value,
        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-readonly`]: this.readonly,
                },
            ]
        },
    },
    watch: {
        value(val) {
            this.current = this.model = val
        },
    },
    methods: {
        starCls(index) {
            const _tobogPrefix_ = this._tobogPrefix_,
                current = this.current,
                isHalf = this.half && current > index - 1 && current < index,
                active = isHalf ? current >= index + 1 : current >= index
            return [
                `${_tobogPrefix_}-star`,
                {
                    [`${_tobogPrefix_}-active`]: active,
                    [`${_tobogPrefix_}-half-active`]: isHalf,
                    [`${_tobogPrefix_}-hover`]: Math.ceil(current) == index && current != this.model,
                },
            ]
        },
        handleMousemove(value, event) {
            if (this.disabled || this.readonly) return
            if (this.half && this.isHalfTrigger(event.target)) {
                value = value - 0.5
            }
            this.current = value
        },
        isHalfTrigger(target) {
            while (target) {
                if (target.dataset.rate === "half") return true
                if (target === this.$el) return
                target = target.parentNode
            }
        },
        handleMouseleave() {
            if (this.disabled || this.readonly) return
            this.current = this.value
        },
        handleClick(index) {
            if (this.disabled || this.readonly) return
            let value = this.current
            if (this.clearable && value > 0 && value == this.model) {
                value = 0
            }
            if (!this.model) value = index
            this.$emit("on-change", value)
        },
    },
}
</script>
