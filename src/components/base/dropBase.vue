<template>
    <div :class="classes" :data-vue-module="dataVueModule || $options.name">
        <slot :toggle="toggle"></slot>
        <template v-if="$slots.drop">
            <Popper
                ref="drop"
                v-show="show"
                type="drop"
                trigger="custom"
                :transfer="transfer"
                :placement="placement"
                :updateIndex="updateIndex"
                :class="[_tobogPrefix_ + '-drop', dropClass]"
                :reference="getReference"
                :style="getDropStyle"
                v-bind="$attrs"
                @hook:created="ready = true"
                v-on="$listeners"
            >
                <slot name="drop"></slot>
            </Popper>
        </template>
    </div>
</template>
<script>
import { ClickOut, HoverOut, getElement } from "../../utils/dom";
import Popper from "./popper/index";

export default {
    name: "DropBase",
    inheritAttrs: false,
    model: {
        prop: "visible",
        event: "on-change",
    },
    components: {
        Popper,
    },
    props: {
        dataVueModule: String,
        placement: String,
        dropStyle: [Object, String],
        transfer: Boolean,
        reference: [String, HTMLElement],
        visible: Boolean,
        disabled: Boolean,
        isOutRef: Boolean,
        isToggle: Boolean,
        autoClose: Boolean,
        dropClass: [Object, String, Array],
        trigger: {
            type: String,
            default: "click", // 'click','hover','custom'
        },
        visibleControl: Function,
    },
    data() {
        return {
            show: this.visible || false,
            updateIndex: 0,
            ready: false,
        };
    },
    computed: {
        getReference() {
            if (this.reference instanceof HTMLElement) return this.reference;
            if (this.reference && typeof this.reference === "string") return getElement(this.reference);
            if (this.ready && !this.isOutRef) return this.$el;
            return null;
        },
        getDropStyle() {
            const dropStyle = this.dropStyle || {},
                ref = (!this.show && !this._isMounted && {}) || this.getReference || {},
                width = ref.offsetWidth;
            return typeof dropStyle === "string"
                ? `width:${width}px;${dropStyle}`
                : { width: `${width}px`, ...dropStyle };
        },
        classes() {
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
            // console.log(status, indexSS++, event.target, event.type, "-???????????????");
            clearTimeout(this.__outvisibleTimeOut);
            if (this.__outvisible || this.disabled) {
                this.__outvisible = null;
                return;
            }
            // console.log(status, index, event.type, event.target.innerText, "************");
            if (typeof this.visibleControl === "function") {
                const result = await this.visibleControl(status);
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
        cancelChange() {
            console.log("cancelChange");
            this.__outvisible = true;
            clearTimeout(this.__outvisibleTimeOut);
            this.__outvisibleTimeOut = setTimeout(() => {
                this.__outvisible = false;
                this.__outvisibleTimeOut = null;
            }, 300);
        },
    },
    watch: {
        getReference() {
            this.bindTriggerOut();
        },
        transfer() {
            this.bindTriggerOut();
        },
        show(val) {
            this.$emit("on-visible-change", val);
            this.$emit("update:visible", val);
            this.$emit("on-change", val);
        },
        visible(val) {
            if (val === this.show) return;
            if (val) {
                this.__outvisible = true;
                this._eleClickOut && this._eleClickOut.toggleBindDocument(true);
            }
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
