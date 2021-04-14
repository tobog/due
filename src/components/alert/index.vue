<template>
    <Transitions :name="transitionName" appear @after-leave="$emit('on-after-close')" v-bind="$attrs">
        <section v-if="!closed" :class="classes" :data-vue-module="$options.name" :style="getStyles">
            <div :class="[_tobogPrefix_ + '-main']">
                <template v-if="showIcon">
                    <slot name="icon">
                        <Icons :color="color" :type="iconType" :class="[_tobogPrefix_ + '-icon']"></Icons>
                    </slot>
                </template>
                <div :class="[_tobogPrefix_ + '-content']">
                    <slot></slot>
                    <div v-if="showDesc" :class="[_tobogPrefix_ + '-desc']">
                        <slot name="desc">{{ desc }}</slot>
                    </div>
                </div>
            </div>
            <span v-if="closable" :class="[_tobogPrefix_ + '-closable-icon']" @click="close">
                <slot name="close">
                    <Icons type="ios-close"></Icons>
                </slot>
            </span>
        </section>
    </Transitions>
</template>

<script>
import Color from "../../utils/color"
import {isParseNumber} from "../../utils/tool"
import Icons from "../icons/index"
import Transitions from "../base/transition"
import globalMixin from "../../mixins/global"

export default {
    name: "Alert",
    componentName: "Alert",
    mixins: [globalMixin],
    components: {
        Icons,
        Transitions,
    },
    props: {
        type: {
            type: String,
            default: "info", // ['success', 'info', 'warning', 'error']
        },
        color: String,
        closable: Boolean,
        ghost: Boolean,
        desc: String,
        align: String,
        broadcast: Boolean,
        size: String,
        transitionName: {
            type: String,
            default: "fade",
        },
        showIcon: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            closed: false,
        }
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            const size = this.getGlobalData("size")
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-type-${this.type}`]: !!this.type,
                    [`${_tobogPrefix_}-with-desc`]: this.showDesc,
                    [`${_tobogPrefix_}-closable`]: this.closable,
                    [`${_tobogPrefix_}-ghost`]: this.ghost,
                    [`${_tobogPrefix_}-align-${this.align}`]: !!this.align,
                    // [`${_tobogPrefix_}-broadcast`]: this.broadcast,
                    [`${_tobogPrefix_}-size-${size}`]: !!size && !isParseNumber(size),
                },
            ]
        },
        showDesc() {
            return !!this.desc || !!this.$slots.desc
        },
        iconType() {
            const iconMap = {
                success: "checkmark-circle",
                info: "information-circle",
                warning: "alert",
                error: "close-circle",
                loading: "loading",
            }
            return iconMap[this.type] || this.type
        },
        getStyles() {
            const style = {}
            if (this.color && Color.isColor(this.color)) {
                style.borderColor = this.color;
                style.boxShadow = `0 0 4px -1px ${this.color}`
                if (!this.ghost) {
                    style.backgroundColor = new Color(this.color).setAlpha(0.08).toCSS()
                }
            }
            return style
        },
    },
    methods: {
        close() {
            this.closed = true
            this.$emit("on-close")
        },
    },
}
</script>
