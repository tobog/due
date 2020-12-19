<template>
    <div :class="classes" :data-vue-module="$options.name">
        <div :class="[_tobogPrefix_ + `-basic`]" :style="{ background: `hsl(${model[0]},100%,50%)` }" ref="basic">
            <div :class="[_tobogPrefix_ + '-basic-white']"></div>
            <div :class="[_tobogPrefix_ + '-basic-black']"></div>
            <div :class="[_tobogPrefix_ + '-basic-pointer']" :style="getPointerStyle"></div>
        </div>
        <div :class="[_tobogPrefix_ + `-inner`]">
            <div :class="[_tobogPrefix_ + `-demo`]">
                <span
                    :style="{
                        background: `rgba(${getRGBA[0]},${getRGBA[1]},${getRGBA[2]},${getRGBA[3]})`,
                    }"
                ></span>
            </div>
            <div :class="[_tobogPrefix_ + `-sliders`]">
                <div :class="[_tobogPrefix_ + `-bar`]" @click.self="(event) => handleColor(event, 'color')">
                    <span ref="color" :style="{ left: (model[0] * 100) / 360 + '%' }"></span>
                </div>
                <div v-if="alpha" :class="[_tobogPrefix_ + `-alpha-wrapper`]">
                    <div
                        :class="[_tobogPrefix_ + `-alpha`]"
                        :style="getAlphaStyle"
                        @click.self="(event) => handleColor(event, 'alpha')"
                    >
                        <span ref="alpha" :style="{ left: model[3] * 100 + '%' }"></span>
                    </div>
                </div>
            </div>
        </div>
        <div :class="[_tobogPrefix_ + `-type-wrapper`]">
            <div :class="[_tobogPrefix_ + `-type`]">
                <div v-for="(item, index) in getDemoData[1]" :key="index">
                    <input
                        type="text"
                        :class="[_tobogPrefix_ + `-input`]"
                        :readonly="!alpha && index == 3"
                        @input="(event) => handleInput(event, getDemoData[1], index)"
                        :value="item + getDemoData[2][index]"
                    />
                    <span>{{ getDemoData[0][index] }}</span>
                </div>
            </div>
            <div :class="[_tobogPrefix_ + `-sort`]" @click="handleSwitch">
                <span></span>
                <span></span>
            </div>
        </div>
        <div v-if="predefined" :class="[_tobogPrefix_ + `-palettes-wrapper`]">
            <div :class="[_tobogPrefix_ + `-palettes`]">
                <span v-for="index in 19" :key="index" tabindex="-1" @click="() => handleSwitchColor(index)"></span>
            </div>
            <!-- <div :class="[_tobogPrefix_ + `-sort`]" @click="handleSwitch">
                <span></span>
                <span></span>
            </div> -->
        </div>
        <slot></slot>
    </div>
</template>
<script>
import { DragMove } from "../../utils/dom";
import Color from "../../utils/color";
export default {
    name: "Color",
    props: {
        value: String,
        type: String, //hex,rgb,hsl,hsv,
        alpha: Boolean,
        predefined: Boolean,
    },
    data() {
        return {
            model: [0, 100, 100, 1], //hsva
            ready: false,
            demoType: this.type || "rgb",
        };
    },
    mounted() {
        this.$nextTick(() => {
            this.dragMove();
            this.ready = true;
        });
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [_tobogPrefix_];
        },
        getRGBA() {
            return Color.HSVtoRGB(...this.model);
        },
        getAlphaStyle() {
            const rgba = this.getRGBA;
            return {
                background: `linear-gradient(to right, rgba(${rgba[0]},${rgba[1]},${rgba[2]},0) 0%, rgba(${rgba[0]},${rgba[1]},${rgba[2]},1) 100%)`,
            };
        },
        getPointerStyle() {
            const { clientWidth = 0, clientHeight = 0 } = this.$refs.basic || this.ready || {};
            return {
                left: (this.model[1] / 100) * clientWidth + "px",
                top: (1 - this.model[2] / 100) * clientHeight + "px",
            };
        },
        getModel() {
            let val;
            if (this.demoType === "hex") {
                let data = Color.RGBtoHex(...this.getRGBA);
                if (!this.alpha) data = data.slice(0, 3);
                val = "#" + data.join("");
            } else if (this.demoType === "hsl") {
                let data = Color.RGBtoHSL(...this.getRGBA);
                val = this.alpha
                    ? `hsla(${data[0]},${data[1]}%,${data[2]}%,${data[3]})`
                    : `hsl(${data[0]},${data[1]}%,${data[2]}%)`;
            } else if (this.demoType === "hsv") {
                val = this.alpha
                    ? `hsva(${this.model[0]},${this.model[1]}%,${this.model[2]}%,${this.model[3]})`
                    : `hsv(${this.model[0]},${this.model[1]}%,${this.model[2]}%)`;
            } else {
                let data = this.getRGBA;
                if (!this.alpha) data = data.slice(0, 3);
                val = this.alpha ? `rgba(${data.join(",")})` : `rgb(${data.join(",")})`;
            }
            return val;
        },
        getDemoData() {
            if (this.demoType === "hex") {
                const data = this.alpha ? this.getRGBA : this.getRGBA.slice(0, 3);
                return [["HEX"], ["#" + Color.RGBtoHex(...data).join("")], [""]];
            }
            if (this.demoType === "hsl") {
                return [["H", "S", "L", "A"], Color.RGBtoHSL(...this.getRGBA), ["", "%", "%", ""]];
            }
            if (this.demoType === "hsv") {
                return [["H", "S", "V", "A"], this.model, ["", "%", "%", ""]];
            }
            return [["R", "G", "B", "A"], this.getRGBA, ["", "", "", ""]];
        },
    },
    methods: {
        dragMove() {
            const { color, alpha, basic } = this.$refs;
            if (color) {
                this._colorDragMove = new DragMove(color, { style: ["left"] }, (obj) => this.handlePos("color", obj));
            }
            if (alpha) {
                this._alphaDragMove = new DragMove(alpha, { style: ["left"] }, (obj) => this.handlePos("alpha", obj));
            }
            if (basic) {
                this._basicDragMove = new DragMove(null, { props: [], boundaryElement: basic }, (obj) =>
                    this.handleColor(obj, "basic")
                );
            }
        },
        handlePos(type, obj) {
            const { data, distance, element } = obj,
                clientWidth = element.offsetParent.clientWidth;
            let val = parseFloat(data.left) + distance[0];
            if (val < 0) val = 0;
            if (val > clientWidth) val = clientWidth;
            if (type === "color") {
                let value = Math.round((val / clientWidth) * 360);
                this.$set(this.model, 0, value >= 360 ? 359 : value);
            } else if (type === "alpha") {
                this.$set(this.model, 3, (val / clientWidth).toFixed(2));
            }
        },
        handleColor(event, type) {
            const value = [100, 50];
            if (type === "basic") {
                const { clientWidth, clientHeight } = event.boundaryElement;
                value[0] = (event.boundaryPosition.left / clientWidth) * 100;
                value[1] = (1 - event.boundaryPosition.top / clientHeight) * 100;
            } else {
                const { clientWidth, clientHeight } = event.currentTarget;
                const data = event.currentTarget.getBoundingClientRect();
                value[0] = ((event.clientX - data.left) / clientWidth) * 100;
                value[1] = (1 - (event.clientY - data.top) / clientHeight) * 100;
            }
            if (value[0] > 100) value[0] = 100;
            if (value[1] > 100) value[1] = 100;
            if (type === "color") {
                this.$set(this.model, 0, Math.round(value[0] * 3.6));
            } else if (type === "alpha") {
                this.$set(this.model, 3, (value[0] / 100).toFixed(2));
            } else {
                this.$set(this.model, 1, Math.round(value[0]));
                this.$set(this.model, 2, Math.round(value[1]));
            }
        },
        handleSwitch() {
            let data = ["hex", "rgb", "hsl", "hsv"];
            let index = data.indexOf(this.demoType || "rgb") + 1;
            if (index > 3) index = 0;
            this.demoType = data[index];
        },
        handleSwitchColor(index) {
            let colors = {
                1: "#f44336",
                2: "#e91e63",
                3: "#9c27b0",
                4: "#673ab7",
                5: "#3f51b5",
                6: "#2196f3",
                7: "#03a9f4",
                8: "#00bcd4",
                9: "#009688",
                10: "#4caf50",
                11: "#8bc34a",
                12: "#cddc39",
                13: "#ffeb3b",
                14: "#ffc107",
                15: "#ff9800",
                16: "#ff5722",
                17: "#795548",
                18: "#9e9e9e",
                19: "#607d8b",
            };
            colors = Color.parse(colors[index], "hsv");
            this.$set(this.model, 0, colors[0]);
            this.$set(this.model, 1, colors[1]);
            this.$set(this.model, 2, colors[2]);
        },
        handleInput(event, data, index) {
            let val = event.target.value;
            if (this.demoType === "hex" && Color.isColor(val)) {
                this.model = Color.parse(val, "hsv");
                return;
            }
            val = parseInt(val);
            if (!val && val !== 0) return;
            data = [...data];
            data[index] = val;
            if (this.demoType === "hsl") {
                this.model = Color.HSLtoHSV(...data);
                return;
            }
            if (this.demoType === "hsv") {
                this.model = data;
                return;
            }
            this.model = Color.RGBtoHSV(...data);
            return;
        },
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler(value) {
                // 纠正Color 类转化不精确问题
                if (this.__innerModel === value) return;
                console.log(this.value, "------------");
                const val = Color.parse(this.value || "", "hsva");
                if (val.join("") === this.model.join("") || val.length < 3) return;
                this.model = val;
            },
        },
        model: {
            deep: true,
            handler() {
                // 是否内部引起的变化
                this.__innerModel = this.getModel;
                this.$emit("input", this.getModel);
                this.$emit("on-change", this.getModel);
            },
        },
        type() {
            this.demoType = this.type;
        },
    },
    beforeDestroy() {
        this._colorDragMove && this._colorDragMove.destroy();
        this._alphaDragMove && this._alphaDragMove.destroy();
        this._basicDragMove && this._basicDragMove.destroy();
        this._colorDragMove = this._alphaDragMove = this._basicDragMove = null;
    },
};
</script>
