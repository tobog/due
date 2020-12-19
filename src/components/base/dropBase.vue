<template>
    <div :class="wrapClasses" :data-vue-module="dataVueModule || $options.name">
        <slot :toggle="toggle"></slot>
        <template v-if="$slots.drop">
            <Drop
                ref="drop"
                v-show="show"
                :transfer="transfer"
                :placement="placement"
                :updateIndex="updateIndex"
                :class="[_tobogPrefix_ + '-drop', dropClass]"
                :reference="getReference"
                :style="getDropStyle"
                v-bind="$attrs"
                @hook:created="ready = true"
                @scroll="handleScroll"
            >
                <slot name="drop"></slot>
            </Drop>
        </template>
    </div>
</template>
<script>
import { ClickOut, HoverOut, EventListener } from "../../utils/dom";
import Drop from "./drop";

export default {
    name: "DropBase",
    inheritAttrs: false,
    model: {
        prop: "visible",
        event: "change",
    },
    components: {
        Drop,
    },
    props: {
        placement: String,
        dropStyle: [Object, String],
        transfer: Boolean,
        reference: HTMLElement,
        visible: Boolean,
        disabled: Boolean,
        isOutRef: Boolean,
        isToggle: Boolean,
        autoClose: Boolean,
        dropClass: [Object, String, Array],
        dataVueModule: String,
        performance: {
            type: Boolean,
            default: true,
        },
        trigger: {
            type: String,
            default: "click", // 'click','hover','custom'
        },
        visibleControlFn: Function,
    },
    data() {
        return {
            show: this.visible || false,
            updateIndex: 0,
            ready: false,
            performanceBind: this.visible || !this.performance, // 仅关闭情况下
        };
    },
    computed: {
        getReference() {
            if (this.reference instanceof HTMLElement) return this.reference;
            if (this.ready && !this.isOutRef) return this.$el;
            return null;
        },
        getDropStyle() {
            const dropStyle = this.dropStyle || (this.show && !this.show) || {},
                ref = (!this.show && !this._isMounted && {}) || this.getReference || {},
                width = ref.offsetWidth;
            return typeof dropStyle === "string"
                ? `width:${width}px;${dropStyle}`
                : { width: `${width}px`, ...dropStyle };
        },
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-visible`]: this.show,
                },
            ];
        },
    },
    methods: {
        bindTriggerOut() {
            if (this.trigger === "custom") return;
            this.$nextTick(() => {
                if (!this.performanceBind) return;
                const drop = (this.$refs.drop || {}).$el,
                    reference = this.getReference;
                if (!drop || !reference) return;
                const eles = [drop, reference];
                if (this.trigger === "hover") {
                    this._eleClickOut && this._eleClickOut.destroy();
                    this._eleClickOut = null;
                    if (this._eleHoverOut) {
                        this._eleHoverOut.update(eles);
                        return;
                    }
                    this._eleHoverOut = new HoverOut(eles, this.handleTriggerOut);
                } else {
                    this._eleHoverOut && this._eleHoverOut.destroy();
                    this._eleHoverOut = null;
                    if (this._eleClickOut) {
                        this._eleClickOut.update(eles);
                        return;
                    }
                    this._eleClickOut = new ClickOut(eles, this.handleTriggerOut);
                }
            });
        },
        async handleTriggerOut(status, event, index) {
            // console.log(status, index, event.type, "-???????????????")
            clearTimeout(this.__outvisibleTimeOut);
            if (this.__outvisible || this.disabled) {
                this.__outvisible = null;
                return;
            }
            // console.log(status, index, event.type, event.target.innerText, "************");
            if (typeof this.visibleControlFn === "function") {
                const result = await this.visibleControlFn(status);
                if (result === void 0) return;
                status = !result;
            }
            if (
                (this.trigger !== "hover" && index == 1 && event.type !== "focusout") ||
                (this.trigger === "hover" && index == 1 && event.type !== "mouseleave")
            ) {
                // 一定在打开的状态下
                // 内部自动关闭;
                if (this.autoClose) {
                    this.toggle(false);
                    this.cancelChange();
                }
                this.$emit("on-clickout", status, event);
                return;
            }
            if (this.isToggle) {
                // drop 的input 不引起Toggle变化
                index != 1 && this.toggle(status ? false : !this.show);
                index != 1 && !status && this.$emit("on-toggle", this.show);
            } else {
                this.show === status && this.toggle(!status);
            }
            this.$emit("on-clickout", status, event);
        },
        toggle(status = !this.show) {
            if (this.disabled) return;
            this.show = status;
        },
        updatedDrop() {
            this.$nextTick(() => {
                this.updateIndex += 1;
            });
        },
        handleScroll(...args) {
            this.$emit("on-scroll", ...args);
        },
        cancelChange() {
            console.log("cancelChange");
            this.__outvisible = true;
            clearTimeout(this.__outvisibleTimeOut);
            this.__outvisibleTimeOut = setTimeout(() => {
                this.__outvisible = false;
            }, 300);
        },
        //提高性能，在用到时在绑定实例
        activeBind(ele, oldEle) {
            if (this.trigger === "custom") return;
            if (this.performanceBind) return;
            this.__handleActiveTriggerOut = (event) => {
                console.log("__handleActiveTriggerOut", "==========");
                this.handleTriggerOut(false, event, 2);
                this.performanceBind = true;
                EventListener.off(event.currentTarget, "click,foucsin", this.__handleActiveTriggerOut);
                this.__handleActiveTriggerOut = null;
            };
            if (oldEle) {
                EventListener.off(oldEle, "click,foucsin", this.__handleActiveTriggerOut);
            }
            if (ele) {
                EventListener.off(ele, "click,foucsin", this.__handleActiveTriggerOut);
                EventListener.on(ele, "click,foucsin", this.__handleActiveTriggerOut);
            }
        },
    },
    watch: {
        getReference(val, old) {
            this.activeBind(val, old);
            this.bindTriggerOut();
        },
        // reference() {
        //     this.activeBind(val, old);
        //     this.bindTriggerOut();
        // },
        transfer() {
            this.bindTriggerOut();
        },
        performanceBind(val) {
            setTimeout(this.bindTriggerOut);
        },
        show(val) {
            this.$emit("on-visible-change", val);
            this.$emit("update:visible", val);
            this.$emit("change", val);
        },
        visible(val) {
            if (val === this.show) return;
            if (val) this.__outvisible = true;
            this.show = val;
        },
    },
    beforeDestroy() {
        clearTimeout(this.__outvisibleTimeOut);
        this._eleClickOut && this._eleClickOut.destroy();
        this._eleHoverOut && this._eleHoverOut.destroy();
        this._eleHoverOut = this._eleClickOut = this.__outvisibleTimeOut = null;
    },
};
</script>
