<template>
    <section :class="_tobogPrefix_" @mouseleave.stop="handleScroll(null)" :style="{ paddingLeft: scrollSize + 'px' }">
        <header :style="{ marginLeft: -scrollSize + 'px' }">{{ langs("datepicker.time", "时间") }}</header>
        <ul
            v-if="hasTimesChild('HH')"
            ref="hours"
            :class="_tobogPrefix_ + '-list'"
            :style="scrollStyle('hours')"
            @mouseenter.stop="handleScroll('hours')"
        >
            <li :class="getCellCls(item)" v-for="item in hoursCells" @click="handleClick(item, 'HH')">
                {{ formatTime(item.date.hours) }}
            </li>
        </ul>
        <ul
            v-if="hasTimesChild('mm')"
            ref="minutes"
            :class="_tobogPrefix_ + '-list'"
            :style="scrollStyle('minutes')"
            @mouseenter.stop="handleScroll('minutes')"
        >
            <li :class="getCellCls(item)" v-for="item in minutesCells" @click="handleClick(item, 'mm')">
                {{ formatTime(item.date.minutes) }}
            </li>
        </ul>
        <ul
            v-if="hasTimesChild('ss')"
            ref="seconds"
            :class="_tobogPrefix_ + '-list'"
            :style="scrollStyle('seconds')"
            @mouseenter.stop="handleScroll('seconds')"
        >
            <li :class="getCellCls(item)" v-for="item in secondsCells" @click="handleClick(item, 'ss')">
                {{ formatTime(item.date.seconds) }}
            </li>
        </ul>
    </section>
</template>

<script>
import Dates, { compareEqual } from "../../../utils/dates";
import { getScrollBarSize } from "../../../utils/dom";
import langMinix from "../../../mixins/lang";
export default {
    name: "DateTimes",
    mixins: [langMinix],
    props: {
        value: Object,
        sectionMethod: Function,
        steps: Array,
        format: String,
        visible: Boolean,
    },
    data() {
        return {
            scrollSize: getScrollBarSize(),
            calendarType: null,
            foucsDate: this.value,
        };
    },

    mounted() {
        // this.scrollSize = getScrollBarSize();
        this.scrollStatic = {};
        this.initRefsStyle();
        if (this.hasTimesChild("HH")) this.initPosition("hours", 24);
        if (this.hasTimesChild("mm")) this.initPosition("minutes", 60);
        if (this.hasTimesChild("ss")) this.initPosition("seconds", 60);
    },
    watch: {
        visible(val) {
            this.setScroll();
        },
    },
    beforeUpdate() {
        this.setScroll();
    },
    computed: {
        hoursCells() {
            return this.handleCells("hours", 24);
        },
        minutesCells() {
            return this.handleCells("minutes", 60);
        },
        secondsCells() {
            return this.handleCells("seconds", 60);
        },
        hasSectionMethod() {
            return typeof this.sectionMethod === "function";
        },
    },
    methods: {
        formatTime: Dates.formatTime,
        getScroll() {
            const scrollStatic = {};
            ["hours", "minutes", "seconds"].forEach((key) => {
                const ref = this.$refs[key];
                if (ref) {
                    scrollStatic[key] = ref.scrollTop;
                }
            });
            this.scrollStatic = scrollStatic;
        },
        setScroll() {
            this.$nextTick(() => {
                this.$nextTick(() => {
                    const scrollStatic = this.scrollStatic;
                    if (!scrollStatic) return;
                    ["hours", "minutes", "seconds"].forEach((key) => {
                        const ref = this.$refs[key],
                            scrollTop = scrollStatic[key];
                        if (ref && scrollTop !== void 0) {
                            ref.scrollTop = scrollTop;
                        }
                    });
                });
            });
        },
        hasTimesChild(type = "HH") {
            return this.format.indexOf(type) > -1;
        },
        handleScroll(type) {
            this.calendarType = type;
        },
        initRefsStyle() {
            const refs = this.$refs,
                keys = Object.keys(refs),
                size = 100 / (keys.length || 1) + "%";
            keys.forEach((item) => {
                refs[item].style.width = size;
            });
        },
        initPosition(type, size = 24) {
            this.$nextTick(() => {
                const ref = this.$refs[type];
                if (!ref) return;
                const clientHeight = ref.clientHeight,
                    scrollHeight = ref.scrollHeight,
                    height = scrollHeight / size,
                    scrollTop = height * this.value[type] - clientHeight / 2 + height / 2;
                if (scrollTop > 0) {
                    ref.scrollTop = scrollTop;
                    this.scrollStatic[type] = scrollTop;
                }
            });
        },
        scrollStyle(type) {
            if (type !== this.calendarType)
                return {
                    paddingRight: `${this.scrollSize}px`,
                };
            return {
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: 0,
            };
        },
        handleCell(date, type) {
            return {
                date,
                selected: compareEqual(date, type, this.value),
                disabled: this.hasSectionMethod && this.sectionMethod({ ...date }, type),
                focus: compareEqual(date, type, this.foucsDate) && this.foucsDate.key === type,
            };
        },

        handleCells(key = "seconds", range = 60) {
            const cells = [];
            for (let i = 0; i < range; i++) {
                cells.push({
                    ...this.handleCell({ ...this.value, [key]: i }, key),
                });
            }
            return cells;
        },
        handleClick(cell, type) {
            if (cell && cell.disabled) return;
            this.foucsDate = cell.date;
            if (
                type === "ss" ||
                (type === "mm" && !this.hasTimesChild("ss")) ||
                (type === "HH" && !this.hasTimesChild("mm") && !this.hasTimesChild("ss"))
            ) {
                type = "times";
            } else {
                type = void 0;
            }
            this.getScroll();
            this.$emit("on-selected", { ...cell }, type);
        },
        getCellCls(cell) {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-cell`,
                {
                    [`${_tobogPrefix_}-cell-selected`]: cell.selected,
                    [`${_tobogPrefix_}-cell-disabled`]: cell.disabled,
                    [`${_tobogPrefix_}-cell-focus`]: cell.focus,
                },
            ];
        },
    },
};
</script>
