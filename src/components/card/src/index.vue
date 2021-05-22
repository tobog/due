<template>
    <component
        :is="getTag"
        :class="classes"
        :data-vue-module="$options.name"
        @click="handleClick"
        @focusout="handleClick"
        v-bind="$attrs"
        v-on="$listeners"
        tabindex="-1"
    >
        <div v-if="type === 'horizontal'" :class="[_tobogPrefix_ + '-content']">
            <div :class="headClasses" v-if="title || $slots.title">
                <slot name="title">
                    <p v-if="title">
                        <Icons v-if="icon" :type="icon"></Icons>
                        <span>{{ title }}</span>
                    </p>
                </slot>
            </div>
            <div :class="[_tobogPrefix_ + '-body']">
                <slot></slot>
            </div>
        </div>
        <template v-else>
            <div :class="headClasses" v-if="title || $slots.title">
                <slot name="title">
                    <p v-if="title">
                        <Icons v-if="icon" :type="icon"></Icons>
                        <span>{{ title }}</span>
                    </p>
                </slot>
            </div>
            <div :class="[_tobogPrefix_ + '-body']" :style="bodyStyles">
                <slot></slot>
            </div>
        </template>
        <div :class="[_tobogPrefix_ + '-extra']" v-if="$slots.extra">
            <slot name="extra"></slot>
        </div>
    </component>
</template>
<script>
import Icons from "../../icons/src/index"
import {unit} from "../../../utils/tool"
export default {
    name: "Card",
    componentName: "Card",
    inheritAttrs: false,
    components: {Icons},
    props: {
        divider: Boolean,
        border: {
            type: Boolean,
            default: true,
        },
        shadow: Boolean,
        reverse: Boolean,
        padding: {
            type: Number,
            default: 16,
        },
        title: String,
        icon: String,
        type: {
            type: String,
            // default: 'flip'//flip,tile,horizontal,
        },
    },
    data() {
        return {
            fliped: false,
        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-border`]: this.border && !this.shadow,
                    [`${_tobogPrefix_}-shadow`]: this.shadow,
                    [`${_tobogPrefix_}-${this.type}`]: !!this.type,
                    [`${_tobogPrefix_}-fliped`]: this.fliped && this.type === "flip",
                    [`${_tobogPrefix_}-reverse`]: this.reverse,
                },
            ]
        },
        headClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-head`,
                {
                    [`${_tobogPrefix_}-head-divider`]: this.divider,
                },
            ]
        },
        bodyStyles() {
            const style = {}
            if (this.padding != 16) {
                style.padding = `${unit(this.padding, "px")} 16px`
            }
            return style
        },
        getTag() {
            const {to, href, tag} = this.$attrs
            if (to) return this.$router ? "router-link" : "a"
            if (href) return "a"
            return tag ||  "div"
        },
    },
    methods: {
        handleClick(e) {
            if (this.type !== "flip") return
            if (e.type === "focusout") {
                this.fliped = false
                return
            }
            this.fliped = !this.fliped
        },
    },
}
</script>
