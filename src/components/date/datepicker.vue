<template>
    <DropBase
        ref="dropBase"
        dropStyle="overflow:hidden;width:auto;"
        isOutRef
        isToggle
        :class="[_tobogPrefix_ + '-wrapper']"
        :dropClass="[_tobogPrefix_ + '-drop-wrapper']"
        :data-vue-module="$options.name"
        :transfer="transfer"
        :disabled="isReadonly"
        :reference="ready ? $refs.inputBase.$refs.inputInner : null"
        v-model="visible"
    >
        <InputBase
            ref="inputBase"
            :class="[_tobogPrefix_]"
            :value="getValueText"
            :prefix="prefix"
            :suffix="suffix || 'ios-calendar-outline'"
            :readonly="readonly"
            :name="name"
            :clearable="clearable"
            :disabled="disabled"
            :theme="theme"
            :collapse="collapse"
            :active="visible"
            :isInput="true"
            :multiple="isTag && multiple"
            v-bind="$attrs"
            @hook:created="ready = true"
            @on-focus="handleFocus"
            @on-input="handleInputText"
            @on-clear="handleClear"
            @on-remove-item="handleClearTag"
            @on-blur="handleBlur"
            @on-visible-change="handleVisible"
            @on-icon-click="handleIconClick"
        >
            <template v-if="prepend" slot="prepend">
                <slot name="prepend"></slot>
            </template>
            <template v-if="append" slot="append">
                <slot name="append"></slot>
            </template>
            <template v-if="showPrefix" slot="prefix">
                <slot name="prefix"></slot>
            </template>
            <template v-if="showSuffix" slot="suffix">
                <slot name="suffix"></slot>
            </template>
        </InputBase>
        <DatePanel
            ref="datePanel"
            slot="drop"
            :value="model"
            :class="[_tobogPrefix_ + '-panel']"
            :type="type"
            :format="format"
            :confirm="confirm"
            :options="options"
            :multiple="multiple"
            :startDate="startDate"
            :weeks="weeks"
            :showWeek="showWeek"
            :sectionMethod="sectionMethod"
            :firstDayOfWeek="firstDayOfWeek"
            :visible="visible"
            :doublePanel="doublePanel"
            @input="handleInput"
            @on-clear="handleClear('autoClose')"
            @on-confirm="handleConfirm"
            @on-status-change="handleStatusChange"
        >
        </DatePanel>
    </DropBase>
</template>

<script>
import DatePanel from "./index";
import DropBase from "../base/dropBase";
import InputBase from "../input/base";
import mixin from "../input/base/mixin";
import Button from "../button/index";
import Dates from "../../utils/dates";
import langMinix from "../../mixins/lang";
export default {
    name: "DatePicter",
    inheritAttrs: false,
    mixins: [langMinix, mixin],
    components: {
        DatePanel,
        DropBase,
        InputBase,
        Button,
    },
    props: {
         doublePanel: {
            type: Boolean,
            default: true,
        },
        transfer: Boolean,
        type: {
            type: String,
            default: "datetime",
        },
        value: {
            type: [String, Array, Date],
            default: "",
        },
        format: {
            type: String,
            default: "",
        },
        confirm: {
            type: Boolean,
            default: true,
        },
        options: {
            type: Object,
            default() {
                return {};
            },
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        showWeek: {
            type: Boolean,
            default: false,
        },
        startDate: {
            type: [String, Date, Object, Number],
            default() {
                return Date.now();
            },
        },
        weeks: Array,
        sectionMethod: Function,
        firstDayOfWeek: {
            type: Number,
            default: 0,
        },
        isTag: Boolean,
    },

    data() {
        return {
            visible: false,
            model: this.value,
        };
    },
    computed: {
        getValueText() {
            return !this.isTag && Array.isArray(this.model) ? this.model.join(",") : this.model;
        },
    },
    methods: {
        handleFocus(event) {
            this.$emit("on-focus", this.model, event);
        },
        handleInputText(event) {
            let val = event.target.value;
            if (!val) {
                this.model = "";
            }
            this.$emit("input", val);
        },
        handleClear(type) {
            this.model = "";
            this.__dates = null;
            this.$refs.dropBase.cancelChange();
            this.$emit("input", this.model, null);
            this.$emit("on-clear");
            if (type === "autoClose") this.visible = false;
        },
        handleClearTag(index) {
            const data = [...this.model];
            const item = data.splice(index, 1);
            this.model = data;
            Array.isArray(this.__dates) && this.__dates.splice(index, 1);
            this.$refs.dropBase.cancelChange();
            this.$emit("input", this.model, this.__dates);
            this.$emit("on-remove-item", item, index);
        },

        handleBlur() {
            this.$nextTick(() => {
                this.$emit("on-change", this.model, this.__dates);
                this.$emit("on-blur", this.model, this.__dates);
                this.handleDispatch("on-validate", this.model);
            });
        },
        handleInput(val, dates) {
            // console.log(this.model);
            this.model = val;
            this.__dates = dates;
            this.$emit("input", this.model, dates);
        },
        handleConfirm(val, dates) {
            this.model = val;
            this.__dates = dates;
            this.$emit("input", this.model, dates);
            this.$emit("on-confirm", this.model, dates);
            this.$refs.inputBase.setInputFocus(); //有问题无法失去焦点
            this.$refs.dropBase.cancelChange();
            this.visible = false;
        },
        handleStatusChange(obj) {
            this.$emit("on-status-change", obj);
        },
        handleVisible(val) {
            this.$emit("on-visible-change", val);
        },
    },
    watch: {
        value(val) {
            this.model = val;
        },
    },
};
</script>
