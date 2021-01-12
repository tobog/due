<template>
    <DropBase
        v-model="visible"
        dropStyle="width:240px"
        isToggle
        :transfer="transfer"
        :disabled="disabled"
        :class="[_tobogPrefix_]"
        :dropClass="[_tobogPrefix_ + '-drop']"
        :data-vue-module="$options.name"
        @on-visible-change="handleVisibleChange"
    >
        <div ref="inner" :class="colorClasses" :style="getStyle">
            <div :class="[_tobogPrefix_ + '-input-inner']">
                <span :style="{backgroundColor: model}"> </span>
                <Icons :class="[_tobogPrefix_ + '-input-icon']" type="ios-arrow-down" center></Icons>
            </div>
            <!-- <Icons v-if="!clearable" :class="[_tobogPrefix_ + '-clear-icon']" type="ios-close" @click="handleClear"></Icons> -->
        </div>
        <Color
            slot="drop"
            v-model="model"
            :type="type"
            :alpha="alpha"
            :size="size"
            :colors="colors"
            :predefined="predefined"
            :class="[_tobogPrefix_ + '-panel']"
            @hook:created="ready = true"
        >
            <div v-if="!autoClose" :class="[_tobogPrefix_ + '-btn']">
                <Button size="small" @click.stop="handleCancel">{{ langs("colorPicker.cancel", "取消") }}</Button>
                <Button size="small" @click.stop="handleConfirm" theme="primary">{{
                    langs("colorPicker.confirm", "确定")
                }}</Button>
            </div>
        </Color>
        <input v-if="name || name === 0" type="hidden" :value="model" />
    </DropBase>
</template>
<script>
import DropBase from "../base/dropBase"
import Color from "./index"
import Button from "../button"
import Icons from "../icons/index"
import emitter from "../../utils/emitter"
import {unit, isParseNumber} from "../../utils/tool"
import langMinix from "../../mixins/lang"
import globalMixin from "../../mixins/global"
export default {
    name: "ColorPicker",
    componentName: "ColorPicker",
    mixins: [emitter, langMinix, globalMixin],
    components: {
        DropBase,
        Color,
        Icons,
        Button,
    },
    props: {
        value: String,
        type: String, //hex,rgb,hsl,hsv,
        alpha: Boolean,
        predefined: Boolean,
        disabled: Boolean,
        size: [Number, String],
        transfer: Boolean,
        name: String,
        autoClose: Boolean,
        size: [String, Number],
        colors:Array
        // clearable: Boolean,
    },
    data() {
        return {
            model: this.value,
            visible: false,
            ready: false,
        }
    },
    created() {
        this.handleDispatch("on-validate", this.model)
    },
    computed: {
        colorClasses() {
            const _tobogPrefix_ = this._tobogPrefix_,
                size = this.getGlobalData("size")
            return [
                `${_tobogPrefix_}-input`,
                {
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                    [`${_tobogPrefix_}-size-${size}`]: size && !isParseNumber(size),
                },
            ]
        },
        getStyle() {
            let style = {},
                size = this.getGlobalData("size")
            if (isParseNumber(size)) {
                style.width = unit(size)
            }
            return style
        },
    },
    methods: {
        // handleClear(){
        //     this.model = ''
        //     this.$emit("on-clear")
        // },
        handleCancel() {
            this.model = this.value
            this.$emit("on-cancel", this.model)
            this.visible = false
        },
        handleConfirm() {
            this.handleInput()
            this.$emit("on-confirm", this.model)
            this.visible = false
        },

        handleInput() {
            this.visible = false
            this.$emit("input", this.model)
            this.$emit("on-change", this.model)
            this.handleDispatch("on-validate", this.model)
        },
        handleVisibleChange(val) {
            this.$emit("on-visible-change", val)
        },
        handleDispatch(...args) {
            if (this.__parentComponent__) {
                this.__parentComponent__.$emit(...args)
            } else {
                this.__parentComponent__ = this.dispatch("FormItem", ...args)
            }
        },
    },
    watch: {
        visible(val) {
            if (val || this.value === this.model || this.autoClose) return
            this.model = this.value
        },
        model() {
            if (this.disabled) return
            this.$emit("on-active-change", this.model)
            if (!this.autoClose) return
            this.handleInput()
        },
        value(val) {
            if (val === this.model) return
            this.model = val
        },
    },
}
</script>
