<template>
    <li :class="classes" :data-vue-module="$options.name">
        <!-- <slot name="pre-vertical"></slot> -->
        <span :class="[_tobogPrefix_ + '-tail', _tobogPrefix_ + '-tail-pre']">
            <Icons v-if="showArrow" type="ios-arrow-forward" :class="[_tobogPrefix_ + '-arrow-icon']"></Icons>
        </span>
        <div :class="[_tobogPrefix_ + '-content-wrapper']" ref="contentWrapper" :style="setWrapperStyle">
            <div v-if="$slots['pre-vertical']" ref="preVertical" :class="[_tobogPrefix_ + '-pre-vertical']">
                <slot name="pre-vertical"></slot>
            </div>
            <!-- <slot name="pre"></slot> -->
            <div :class="[_tobogPrefix_ + '-content']" ref="content" :style="setContentStyle">
                <div v-if="$slots['pre']" ref="pre" :class="[_tobogPrefix_ + '-pre']">
                    <slot name="pre"></slot>
                </div>

                <span :class="[_tobogPrefix_ + '-icon']">
                    <slot name="icon">
                        <Icons v-if="iconType" :type="iconType" size="24"></Icons>
                        <span v-else>{{ stepNumber }}</span>
                    </slot>
                </span>
                <div :class="[_tobogPrefix_ + '-title']">
                    <slot>{{ title }}</slot>
                    <div v-if="descSlot" :class="_tobogPrefix_ + '-desc'">
                        <slot name="desc">{{ desc }}</slot>
                    </div>
                </div>
                <slot name="next"></slot>
            </div>
            <slot name="next-vertical"></slot>
        </div>
        <span :class="[_tobogPrefix_ + '-tail', _tobogPrefix_ + '-tail-next']" :style="setNextRailStyle">
            <Icons v-if="showArrow" type="ios-arrow-forward" :class="[_tobogPrefix_ + '-arrow-icon']"></Icons>
        </span>
    </li>
</template>

<script>
import Icons from "../icons/index";

export default {
    name: "Step",
    components: {
        Icons,
    },
    props: {
        status: {
            // validator(value) {
            // 	// return oneOf(value, ['wait', 'process', 'finish', 'error']);
            // },
            default: "wait",
        },
        title: String,
        desc: String,
        value: String,
        icon: String,
    },
    data() {
        return {
            curStatus: this.status,
            total: 1,
            stepNumber: 1,
            direction: "horizontal",
            showArrow: false,
            parentValue: this.getValue,
            size: {
                nextSize: 0,
                nextSize2: 0,
                preSize: 0,
                preSize2: 0,
            },
        };
    },
    created() {
        this.$on("on-flow-step", this.handleFlow);
        this.$parent.$emit("on-step-change");
    },
    mounted() {
        this.getWrapperSize();
    },
    computed: {
        setNextRailStyle() {
            const { nextSize, preSize2 } = this.size;
            const style = {};
            // if (nextSize) {
            //     style.width = nextSize + "px";
            //     style.marginLeft = -nextSize + 60 + "px";
            // }
            if (preSize2) {
                style.height = preSize2 + "px";
                style.marginTop = -preSize2 + 30 + "px";
            }
            return style;
        },
        setWrapperStyle() {
            const nextSize = this.size.nextSize2;
            return nextSize
                ? {
                      marginTop: -nextSize + "px",
                  }
                : {};
        },
        setContentStyle() {
            const { preSize } = this.size;
            const style = {};
            if (preSize) {
                style.marginLeft = -preSize + "px";
            }
            return style;
        },
        isVertical() {
            return `${this.direction}`.indexOf("vertical") > -1;
        },
        descSlot() {
            return this.desc || this.$slots.desc;
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                `${_tobogPrefix_}-${this.curStatus}`,
                {
                    [`${_tobogPrefix_}-horizontal`]: !this.isVertical,
                    [`${_tobogPrefix_}-vertical`]: this.isVertical,
                    [`${_tobogPrefix_}-with-desc`]: this.descSlot,
                    [`${_tobogPrefix_}-slot-next`]: `${this.direction}`.indexOf("next") > -1,
                    [`${_tobogPrefix_}-slot-pre`]: `${this.direction}`.indexOf("pre") > -1,
                },
            ];
        },
        iconType() {
            let icon = "";
            if (this.icon) {
                icon = this.icon;
            } else if (this.curStatus == "finish") {
                icon = "ios-checkmark";
            } else if (this.curStatus == "error") {
                icon = "ios-close";
            }
            return icon;
        },
    },
    methods: {
        handleFlow() {
            this.$parent.$emit("on-step-flow", this.value || this.stepNumber, true);
        },
        getWrapperSize() {
            // clearTimeout(this.__sizeTimeOut);
            this.__sizeTimeOut = setTimeout(() => {
                const { content, preVertical, contentWrapper, pre } = this.$refs;
                if (
                    (`${this.direction}`.indexOf("pre") > -1 && this.$slots["pre-vertical"]) ||
                    this.$slots["next-vertical"]
                ) {
                    this.size.nextSize = this.$el.offsetWidth - content.offsetWidth;
                }
                if (preVertical) {
                    this.size.nextSize2 = preVertical.offsetHeight;
                }
                if (contentWrapper && (this.$slots["pre"] || this.$slots["next"])) {
                    this.size.preSize2 = contentWrapper.offsetHeight;
                }
                if (pre) {
                    this.size.preSize = pre.offsetWidth;
                }
            }, 120);
        },
    },
    watch: {
        status(val) {
            this.curStatus = val;
        },
        direction() {
            this.getWrapperSize();
        },
    },
    beforeDestroy() {
        clearTimeout(this.__sizeTimeOut);
    },
};
</script>
