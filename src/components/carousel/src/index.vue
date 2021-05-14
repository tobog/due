<template>
    <section :class="classes" :data-direction="direction" @mouseleave="playControl" @mouseenter="pause">
        <div :class="[_tobogPrefix_ + '-outer']">
            <ul :class="[_tobogPrefix_ + '-list']" ref="list">
                <slot></slot>
            </ul>
        </div>
        <template v-if="arrow && arrow !== 'never'">
            <span :class="arrowClasses" :data-disabled="!loop && model == 0" data-type="left" @click="play(true)">
                <Icons type="ios-arrow-back"></Icons>
            </span>
            <span
                :class="arrowClasses"
                :data-disabled="!loop && model == childrenLen - 1"
                data-type="right"
                @click="play(false)"
            >
                <Icons type="ios-arrow-forward"></Icons>
            </span>
        </template>
        <aside v-if="showDot && childrenLen" :class="dotsClasses">
            <div :class="[_tobogPrefix_ + '-dots-inner']" :style="getActiveDotPosition">
                <slot name="dot" :slide="slide" :value="model">
                    <template v-if="dotType !== 'page'">
                        <span
                            v-for="index in childrenLen"
                            :key="index"
                            :class="[_tobogPrefix_ + '-dot']"
                            :data-type="dotType"
                            :data-active="model == index-1"
                            v-on:[getTriggerEvent]="slide(index)"
                        >{{ dotType === "bullet" ? index : "" }}</span>
                    </template>
                    <span v-else :class="[_tobogPrefix_ + '-dot']" data-type="page">
                        <template v-if="direction !== 'vertical' && dotPosition !== 'left' && dotPosition !== 'right'">
                            {{ model + 1 }}&nbsp;/&nbsp;{{ childrenLen }}
                        </template>
                        <template v-else> {{ model + 1 }}<br />—&nbsp;<br />{{ childrenLen }} </template>
                    </span>
                </slot>
            </div>
        </aside>
    </section>
</template>
<script>
import Icons from "../../icons/src/index"
import Carousel from "../../../utils/carousel"
export default {
    name: "Carousel",
    componentName: "Carousel",
    components: {Icons},
    model: {
        prop: "value",
        event: "on-change",
    },
    props: {
        value: {
            type: Number,
            default: 0,
        },
        reverse: {
            type: Boolean,
            default: false,
        },
        autoplay: {
            type: Boolean,
            default: false,
        },
        loop: {
            type: Boolean,
            default: true,
        },
        interval: {
            type: Number,
            default: 2000,
        },
        arrow: {
            type: String,
            default: "always", //'hover', 'always', 'never'
        },
        dotType: {
            type: String, // round,default,page,bullet
            default: "",
        },
        showDot: {
            type: Boolean,
            default: true,
        },
        dotCount: {
            type: Number,
            default: 5,
        },
        touchmove: Boolean,
        trigger: {
            type: String,
            default: "click", // 'click', 'hover'
            // validator (value) {
            //     return oneOf(value, ['click', 'hover']);
            // }
        },
        mode: {
            type: String,
            default: "carousel", //carousel,fade,card,scroll
        },
        direction: String, // horizontal,vertical
        dotPosition: String, // top,right,left,bottom
        // slidesToShow: 3,
        // slidesToScroll: 3,
        // responsive: [
        // 	{
        // 		breakpoint: 1024,
        // 		settings: {
        // 			slidesToShow: 3,
        // 			slidesToScroll: 3,
        // 			infinite: true,
        // 			dots: true
        // 		}
        // 	},
        // ],
        // scrolltrigger
    },
    data() {
        return {
            childrenLen: 0,
            model: this.value || 0,
            dotSize: 0,
        }
    },
    mounted() {
        this.init()
    },
    computed: {
        getTriggerEvent() {
            if (this.trigger === "click") return "click"
            if (this.trigger === "hover") return "mouseenter"
            return null
        },
        getConfig() {
            return {
                reverse: this.reverse,
                loop: this.loop,
                interval: this.interval,
                autoplay: this.autoplay,
                mode: this.mode,
                speed: this.speed,
                prefix: this._tobogPrefix_,
                direction: this.direction,
                touchmove: this.touchmove && this.mode === 'carousel',
            }
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-${this.mode}`]: !!this.mode,
                    [`${_tobogPrefix_}-${this.direction}`]:
                        this.direction === "vertical" || this.direction === "horizontal",
                },
            ]
        },
        arrowClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-arrow`,
                {
                    [`${_tobogPrefix_}-arrow-${this.arrow}`]: !!this.arrow,
                },
            ]
        },
        dotsClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-dots`,
                {
                    [`${_tobogPrefix_}-dots-${this.getDotPosition}`]: !!this.getDotPosition,
                },
            ]
        },
        getDotPosition() {
            if (this.dotPosition) return this.dotPosition
            if (this.direction === "vertical") return "right"
            return false
        },
        getActiveDotPosition() {
            let dotCount = this.dotCount || 5;
            if (dotCount < 1 || this.dotType === 'page' || this.childrenLen < dotCount) return;
            let dotCountHalf = parseInt(dotCount/2),
                index = this.model - dotCountHalf;
            if (index < 0) index = 0;
            if (index >= this.childrenLen - dotCountHalf * 2) index = this.childrenLen - dotCount;
            return (this.getDotPosition === "left" || this.getDotPosition === "right") ? {
                top: -1 * index * this.dotSize + 'px',
                maxHeight: dotCount * this.dotSize + 'px',
            } : {
                left: -1 * index * this.dotSize + 'px',
                maxWidth: dotCount * this.dotSize + 'px',
            }
        },
    },
    methods: {
        init() {
            this.$nextTick(() => {
                this._Carousel = new Carousel(this.$el, this.getConfig, (that, index) => {
                    const childrenLen = that._children.length,
                        oldValue = this.model
                    if (childrenLen != this.childrenLen) this.childrenLen = childrenLen
                    if (index != oldValue) {
                        this.model = index
                        this.$emit("on-change", index, oldValue)
                    }
                    this.resetDotSize();
                })
                this._Carousel.slide(this.model)
            })
        },
        resetDotSize(reset) {
            clearTimeout(this._clearDotTime);
            if (this.showDot && (!this.dotSize || reset) && this.childrenLen > 0) {
                this._clearDotTime =setTimeout(() => {
                    let offsetKey = (this.getDotPosition === "left" || this.getDotPosition === "right") ? "offsetHeight" : "offsetWidth";
                    let size = (this.$el.querySelector(`.${this._tobogPrefix_}-dot`) || {})[offsetKey]
                    if (size) {
                        this.dotSize = size + 12;
                    }
                    console.log(size, 'size');
                }, 100);
            }
        },
        play(isPre) {
            if (
                (!this.loop && isPre && this.model == 0) ||
                (!this.loop && !isPre && this.model == this.childrenLen - 1)
            ) {
                return
            }
            this._Carousel.step(isPre)
        },
        playControl() {
            this._Carousel.play()
        },
        pause() {
            this._Carousel.pause()
        },
        slide(index) {
            this._Carousel.slide(index - 1)
        },
        handelMouseup(e) {
            const xAxis = this.direction === "vertical" ? e.clientY - this._xAxis : e.clientX - this._xAxis
            console.log(xAxis)
            if (xAxis > 60) {
                this.play(true)
            }
            if (xAxis < -60) {
                this.play(false)
            }
            this._xAxis = 0
        },
        handleMousedown(e) {
            this._xAxis = this.direction === "vertical" ? e.clientY : e.clientX
        },
        // use when slot changed
        updateConfig() {
            console.log('updateConfig');
            this.$nextTick(() => {
                this._Carousel && this._Carousel.update(this.getConfig);
                this.resetDotSize(true);
            });
        },
    },
    watch: {
        getConfig() {
            this.updateConfig()
        },
        value(val) {
            if (val != this.model) {
                this.model = val;
                this._Carousel && this._Carousel.slide(val)
            }
        },
        dotCount() {
            this.$nextTick(() => {
               this.resetDotSize(true)
            });
        },
        dotType() {
            this.$nextTick(() => {
               this.resetDotSize(true)
            });
        },
        getDotPosition() {
            this.$nextTick(() => {
               this.resetDotSize(true)
            });
        },
    },
    beforeDestroy() {
        this._Carousel && this._Carousel.destroy();
        clearTimeout(this._clearDotTime);
        this._Carousel = this._clearDotTime = null
    },
}
</script>
