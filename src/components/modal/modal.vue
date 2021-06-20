<template>
    <transition name="fade" appear :data-vue-module="$options.name">
        <section
            v-transfer-dom="transfer"
            v-show="show"
            :data-transfer="transfer"
            :class="wrapClasses"
            :allowfullscreen="fullscreen"
            @click.self="clickMask"
            ref="wrap"
        >
            <transition :name="transitionname" appear @after-leave="afterLeave">
                <div
                    v-if="show"
                    ref="modal"
                    :allowfullscreen="fullscreen"
                    :class="contentClasses"
                    :style="contentStyles"
                >
                    <span :class="[_tobogPrefix_ + '-icons']">
                        <template v-if="fullscreen">
                            <Icons
                                :class="[_tobogPrefix_ + '-full']"
                                @click.native="handleFullscreen"
                                type="ios-expand"
                            ></Icons>
                            <Icons
                                :class="[_tobogPrefix_ + '-exit']"
                                @click.native="handleFullscreen"
                                type="ios-contract"
                            ></Icons>
                        </template>
                        <template v-if="closable">
                            <slot name="close">
                                <Icons
                                    type="ios-close"
                                    :class="[_tobogPrefix_ + '-close']"
                                    @click.native="close"
                                ></Icons>
                            </slot>
                        </template>
                    </span>
                    <div v-if="showHeader" :class="headerClasses" ref="header">
                        <slot name="header">
                            <Icons v-if="prompt" type="info"></Icons>
                            {{ title }}
                        </slot>
                    </div>
                    <div :class="[_tobogPrefix_ + '-body']" ref="body">
                        <slot></slot>
                    </div>
                    <div v-if="showFooter" :class="[_tobogPrefix_ + '-footer']" ref="footer">
                        <template v-if="!prompt">
                            <slot name="footer" :close="close" :confirm="confirm">
                                <Button @click.native="close" style="margin-right:16px">{{
                                    langs("modal.close", "关闭")
                                }}</Button>
                                <Button theme="primary" @click.native="confirm">{{
                                    langs("modal.confirm", "确认")
                                }}</Button>
                            </slot>
                        </template>
                        <Button v-else :theme="prompt" long @click.native="confirm">{{
                            langs("modal.confirm", "确认")
                        }}</Button>
                    </div>
                    <Loading v-if="loading" loading fix @on-close="loading = false" />
                </div>
            </transition>
        </section>
    </transition>
</template>

<script>
let ModalInstances = []
import TransferDom from "../../directives/transfer-dom"
import {EventListener, Fullscreen, DragMove} from "../../utils/dom"
import {unit, validVal} from "../../utils/tool"
import Icons from "../icons/src/index"
import Button from "../button/src/index"
import Loading from "../loading/src/loading.vue"
import langMinix from "../../mixins/lang"
export default {
    name: "Modal",
    inheritAttrs: false,
    mixins: [langMinix],
    directives: {
        TransferDom,
    },
    model: {
        prop: "visible",
        event: "on-change",
    },
    components: {
        Icons,
        Button,
        Loading,
    },
    props: {
        name: [String, Number],
        visible: Boolean,
        title: String,
        modalStyle: [Object, String],
        type: {
            type: String, //modal,drawer
            default: "modal",
        },
        width: {
            type: Number,
            default: 520,
        },
        maskable: Boolean,
        showHeader: {
            type: Boolean,
            default: true,
        },
        showFooter: {
            type: Boolean,
            default: true,
        },
        closable: {
            type: Boolean,
            default: true,
        },
        transfer: Boolean,
        dragable: Boolean,
        fullscreen: Boolean,
        fullElement: {
            type: String,
            default: "modal", //wrap,modal
        },
        delay: {
            type: Number,
            default: 0,
        },
        fixed: Boolean,
        prompt: String,
        async: Boolean,
        position: Array,
        lock: {
            type: Boolean,
            default: true,
        },
    },
    data() {
        return {
            show: !!this.visible,
            loading: false,
            lastMaskModel: null,
        }
    },
    created() {
        ModalInstances.push(this)
    },
    mounted() {
        this.show = this.show ? 1 : 0
        EventListener.on(document, "keydown", this.escClose)
    },
    activated() {
        EventListener.on(document, "keydown", this.escClose)
    },
    deactivated() {
        EventListener.off(document, "keydown", this.escClose)
    },

    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-mask`]: !this.lastMaskModel || this.lastMaskModel === this._uid,
                    [`${_tobogPrefix_}-fixed`]: this.fixed,
                },
            ]
        },
        headerClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-header`,
                {
                    [`${_tobogPrefix_}-${this.prompt}`]: !!this.prompt,
                },
            ]
        },
        contentClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-drawer`]: this.type === "drawer",
                },
            ]
        },
        transitionname() {
            return this.type === "drawer" ? "move-right" : "slide-up"
        },
        contentStyles() {
            const style = this.modalStyle || "",
                width = unit(this.width),
                [top, right, bottom, left] = this.position || [],
                margin =
                    this.type === "drawer"
                        ? ""
                        : [
                              validVal(top) ? unit(top) : "auto",
                              validVal(right) ? unit(right) : "auto",
                              validVal(bottom) ? unit(bottom) : "auto",
                              validVal(left) ? unit(left) : "auto",
                          ].join(" ")
            return typeof style == "string"
                ? `width:${width};margin:${margin};${style}`
                : {
                      width,
                      margin,
                      ...style,
                  }
        },
    },
    methods: {
        dragMove() {
            if (!this.dragable || !this.show) return
            this.$nextTick(() => {
                if (this._DragMove) {
                    this._DragMove.update(this.$refs.modal)
                    return
                }
                this._DragMove = new DragMove(this.$refs.modal)
            })
        },
        handleFullscreen() {
            // 整个页面进入全屏
            const ele = this.$refs[this.fullElement === "modal" ? "modal" : "wrap"]
            Fullscreen.toggle(ele).then((bool) => {
                this.$emit("on-fullscreenchange", bool)
            })
        },
        clickMask() {
            if (this.maskable) this.close()
        },
        close() {
            this.show = false
            this.$emit("on-cancel", this.name)
        },
        afterLeave() {
            this.$emit("on-change", false)
            this.$emit("on-after-close", this.name)
        },
        confirm() {
            if (!this.async) this.show = false
            this.loading = true
            this.$emit("on-confirm", this.name, () => {
                this.show = false
            })
        },
        escClose(e) {
            if (this.show && this.closable && e.keyCode === 27) this.close()
        },
        delayToggle(val) {
            clearTimeout(this.__timeOut)
            if (this.show === val) return
            this.loading = false
            if (val) this.show = true
            if (this.delay) {
                this.loading = true
                this.__timeOut = setTimeout(() => {
                    this.show = val
                    this.loading = false
                    this.__timeOut = null
                }, this.delay)
            } else {
                this.show = val
            }
        },
        handleOverflow(val) {
            if (
                (!this.lock && !this.__isOverflowed) ||
                !((val && !this.__isOverflowed) || (!val && this.__isOverflowed)) ||
                !this._isMounted
            ) {
                return
            }
            this.__offsetParent = this.__offsetParent || this.$el.offsetParent || document.body
            if (!this.__offsetParent) return
            const dataset = this.__offsetParent.dataset,
                overflowIndex = parseInt(dataset.overflowIndex || 0),
                style = this.__offsetParent.style,
                originOverflow = dataset.originOverflow
            if (val) {
                this.__isOverflowed = true
                dataset.overflowIndex = overflowIndex + 1
                if (originOverflow === void 0) dataset.originOverflow = style.overflow || ""
                style.overflow = "hidden"
                return
            }
            this.__isOverflowed = false
            if (overflowIndex < 2) {
                style.overflow = originOverflow
                delete dataset.originOverflow
                delete dataset.overflowIndex
                return
            }
            dataset.overflowIndex = overflowIndex - 1
        },
        setLastMask() {
            const showInstances = ModalInstances.filter((item) => item.show)
            console.log(showInstances, this._uid)
            if (showInstances.length) {
                const lastMaskModel = showInstances[showInstances.length - 1]._uid
                showInstances.forEach((item) => {
                    item.lastMaskModel = lastMaskModel
                })
            }
        },
    },
    watch: {
        dragable(val, old) {
            if (val == old) return
            this.dragMove()
        },
        visible(val, old) {
            this.delayToggle(val)
        },
        show(val, old) {
            this.setLastMask()
            if (!this.__isInserted) {
                this.$nextTick(() => {
                    this.__isInserted = true
                    this.handleOverflow(val)
                })
            } else {
                this.handleOverflow(val)
            }
            this.dragMove()
            this.$nextTick(() => {
                if (
                    !val &&
                    old &&
                    this.$attrs.autoDestroy &&
                    typeof this.$options.destroy === "function" &&
                    this.$attrs.__pattern === "js"
                ) {
                    this.__destroyed__ = true
                    this.$options.destroy(this.name)
                }
            })
            this.$emit("on-show-change", val, this.name)
        },
    },
    beforeDestroy() {
        if (this.show) this.handleOverflow(false)
        clearTimeout(this.__timeout)
        EventListener.off(document, "keydown", this.escClose)
        ModalInstances = ModalInstances.filter((item) => item !== this)
        this.setLastMask()
        this.__timeout = null
        this._DragMove && this._DragMove.destroy()
        this._DragMove = null
        if (!this.__destroyed__ && typeof this.$options.destroy === "function" && this.$attrs.__pattern === "js")
            this.$options.destroy(this.name)
    },
}
</script>
