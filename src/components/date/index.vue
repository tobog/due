<template>
    <div tabindex="-1" @keydown.prevent="handleKeydown" :class="[_tobogPrefix_ + '-wrapper']">
        <div :class="[_tobogPrefix_]" :key="formats">
            <div :class="[_tobogPrefix_ + '-aside']" v-if="shortcuts.length > 0">
                <div
                    v-for="(item, index) in shortcuts"
                    @click="handleShortcuts(item)"
                    :class="[_tobogPrefix_ + '-shortcut']"
                    :key="index"
                    v-html="item.text"
                ></div>
            </div>
            <DateBase
                ref="ref0"
                index="0"
                :class="[_tobogPrefix_ + '-date']"
                :multiple="multiple"
                :range="range"
                :format="formats"
                :showWeek="showWeek"
                :weeks="weeks"
                :startDate="startDates[0]"
                :value="dates"
                :disableMethod="disableMethod"
                :firstDayOfWeek="firstDayOfWeek"
                :visible="visible"
                @on-selected="selected"
                @on-sync-update="handleCalendar"
            />
            <DateBase
                v-if="range && doublePanel"
                ref="ref1"
                index="1"
                data-index="1"
                :class="[_tobogPrefix_ + '-date']"
                :multiple="multiple"
                :range="range"
                :format="formats"
                :showWeek="showWeek"
                :weeks="weeks"
                :startDate="startDates[1]"
                :value="dates"
                :disableMethod="disableMethod"
                :firstDayOfWeek="firstDayOfWeek"
                :visible="visible"
                @on-selected="selected"
                @on-sync-update="handleCalendar"
            />
        </div>
        <aside v-if="confirm || hasDateTimes" :class="[_tobogPrefix_ + '-footer']">
            <Button
                v-if="hasDateTimes"
                @click="syncStatus(status === 'times' ? 'day' : 'times')"
                theme="text"
                size="small"
                :class="[_tobogPrefix_ + '-switch']"
                >{{
                    status === "times"
                        ? langs("datepicker.selectDate", "选择日期")
                        : langs("datepicker.selectTime", "选择时间")
                }}</Button
            >
            <Button
                v-if="confirm"
                :class="[_tobogPrefix_ + '-confirm']"
                size="small"
                theme="primary"
                @click="handleConfirm"
                >{{ langs("datepicker.confirm", "确定") }}</Button
            >
            <Button v-if="confirm" :class="[_tobogPrefix_ + '-clear']" size="small" @click="handleClear">{{
                langs("datepicker.clear", "清空")
            }}</Button>
        </aside>
    </div>
</template>

<script>
import DateBase from "./base";
import Button from "../button/index";
import Dates from "../../utils/dates";
import langMinix from "../../mixins/lang";
export default {
    name: "DatePanel",
    componentName: "DatePanel",
    inheritAttrs: false,
    mixins: [langMinix],
    components: {
        DateBase,
        Button,
    },
    props: {
        doublePanel: {
            type: Boolean,
            default: true,
        },
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
        disableMethod: Function,
        firstDayOfWeek: {
            type: Number,
            default: 0,
        },
        visible: Boolean, // 仅仅针对drop 的属性
    },

    data() {
        return {
            dates: this.value,
            model: this.value,
            status: "day",
            startDates: [0, 0],
        };
    },
    created() {
        this.initStatus();
    },
    computed: {
        hasDateTimes() {
            return /d.*(H|M|S)+/g.test(this.formats);
        },
        shortcuts() {
            return (this.options || {}).shortcuts || [];
        },
        range() {
            const format = this.format,
                type = this.type;
            if (format) {
                let objIndex = { y: 0, M: 0, d: 0, H: 0, m: 0, s: 0 },
                    range = false;
                format.replace(/(y|M|d|H|m|s)+/g, function(match, reg) {
                    if (objIndex[reg] >= 1) range = true;
                    objIndex[reg] += 1;
                    return match;
                });
                return range;
            }
            switch (type) {
                case "daterange":
                case "datetimerange":
                case "timesrange":
                case "hoursrange":
                    return true;
                default:
                    return false;
            }
        },
        formats() {
            if (this.format) return this.format;
            return Dates.formats(this.type);
        },
    },
    methods: {
        initStatus() {
            let format = this.formats;
            if (format.indexOf("dd") > -1) {
                this.status = "day";
            } else if (format.indexOf("MM") > -1) {
                this.status = "month";
            } else if (format.indexOf("yy") > -1) {
                this.status = "year";
            }
            this.curIndex = 0;
            this.handleSiblingDates(this.status, this.startDate);
        },
        handleKeydown(e) {
            const keyCode = e.keyCode;
            console.log(keyCode, "keyCode");
            // left/top/right/down/enter
            if ([37, 38, 39, 40, 13].indexOf(keyCode) === -1) return;
            const ref = this.$refs[`ref${this.curIndex}`];
            if (ref) {
                ref.handleKeydown(e);
                if (keyCode != 13 && this.range) {
                    this.handleCalendar(
                        {
                            index: this.curIndex,
                            date: ref.foucsDate,
                            dates: ref.dates,
                            direction: keyCode == 37 || keyCode == 38 ? "pre" : "next",
                        },
                        "keyCalendar"
                    );
                }
            }
        },
        syncStatus(status, isEndStatus) {
            if (isEndStatus === true) {
                status = this.$refs.ref0.endState;
            }
            if (status) {
                this.status = status;
                const ref0 = this.$refs.ref0,
                    ref1 = this.$refs.ref1;
                if (ref0) ref0.status = status;
                if (ref1) ref1.status = status;
            }
        },
        handleCalendar(data = {}, type) {
            const { status, index = 0, date, dates, direction } = data;
            const ref0 = this.$refs.ref0,
                ref1 = this.$refs.ref1;
            this.curIndex = index;
            if (type === "range") {
                if (ref0) ref0.rangeDate = date;
                if (ref1) ref1.rangeDate = date;
            }
            if (type === "calendar" || type === "keyCalendar") {
                this.syncStatus(status);
                if (ref0) {
                    if (index == 0) {
                        ref0.foucsDate = date;
                    }
                    ref0.dates = dates;
                }
                if (ref1) {
                    if (index == 1) {
                        ref1.foucsDate = date;
                    }
                    ref1.dates = dates;
                }
                if (ref0 && ref1) {
                    let initCalendar0 = ref0.initCalendar,
                        initCalendar1 = ref1.initCalendar;
                    let interval, status;
                    let validYear = initCalendar1.year - initCalendar0.year;
                    let isPre = direction === "pre" && index == 1;
                    let isNext = direction === "next" && index == 0;
                    if (this.status === "year" && validYear < 1) {
                        if (isPre) interval = -10;
                        if (isNext) interval = 10;
                    }

                    if (this.status === "month" && validYear < 1) {
                        if (isPre) interval = -1;
                        if (isNext) interval = 1;
                        status = "year";
                    }

                    if (this.status === "day" && validYear < 0) {
                        if (isPre) interval = -1;
                        if (isNext) interval = 1;
                        status = "year";
                    }

                    if (this.status === "day" && validYear == 0 && initCalendar1.month <= initCalendar0.month) {
                        if (isPre) interval = -1;
                        if (isNext) interval = 1;
                        status = "day";
                    }

                    if (status && interval) {
                        this.handleSiblingDates(status, date, interval);
                    }
                }
            }
        },
        /**
         * 计算隔离时间
         */
        handleSiblingDates(status, date, interval = 1) {
            const instance = Dates.New(date);
            const cloneDate = new Date(instance);
            const dateMap = {
                year: "FullYear",
                month: "FullYear",
                day: "Month",
            };
            const method = dateMap[status];
            if (method) {
                const dates = [instance, cloneDate["set" + method](cloneDate["get" + method]() + interval)];
                this.startDates = interval > 0 ? dates : dates.reverse();
            }
        },
        handleShortcuts(data) {
            const onClick = data.onClick,
                value = typeof data.value === "function" ? data.value() : data.value;
            this.dates = this.multiple ? value : [value];
            if (typeof onClick === "function") onClick(this);
            this.syncStatus(this.$refs.ref0.endState);
        },
        selected({ dates, datesInstance, index = 0, endState = "day" } = {}, isOver) {
            // if (this.singleDate) return;
            // if (this.confirm) {
            //     this.__dates = datesInstance;
            //     this.__model = dates;
            // } else {
            console.log(dates);
            this.dates = datesInstance;
            this.model = dates;
            !this.confirm && this.$emit("input", dates, datesInstance);
            // }
            this.$emit("on-status-change", { value: datesInstance, dates, status: endState, isOver, index });
        },
        handleClear() {
            this.dates = null;
            this.model = "";
            this.$emit("input", this.model, this.dates);
            this.$emit("on-clear", this.model, this.dates);
        },
        handleConfirm() {
            // this.dates = this.__dates;
            // this.model = this.__model;
            this._dates = this.dates;
            this.$emit("input", this.model, this.dates);
            this.$emit("on-confirm", this.model, this.dates);
        },
    },
    watch: {
        visible(val) {
            if (!val) this.dates = this._dates;
            this.syncStatus(false, true);
        },
        value(val) {
            if (!val) {
                this.model = "";
                this._dates = this.dates = null;
                return;
            }
            if (this.model !== val) {
                this._dates = this.dates = this.model = val;
            }
        },
    },
};
</script>
