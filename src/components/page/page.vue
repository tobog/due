<template>
    <ul :class="wrapClasses" :data-vue-module="$options.name">
        <li :class="[_tobogPrefix_ + '-total']" v-if="showTotal">
            <slot :total="total">{{ langs("page.total", "共 " + (total || 0) + " 条", { total }) }}</slot>
        </li>
        <li
            @click="changePage(currentPage - 1)"
            :data-disabled="allPages <= 1 || currentPage <= 1"
            :title="langs('page.pre', '前一页')"
            v-show="hasTotal"
        >
            <slot name="pre">
                <Icons type="ios-arrow-back"></Icons>
            </slot>
        </li>
        <li v-if="simple" :class="[_tobogPrefix_ + '-input']">
            <InputNumber
                :class="[_tobogPrefix_ + '-input-cell']"
                :precision="0"
                :value="currentPage"
                @on-enter="changeInput"
                :min="1"
                :max="allPages"
            />
            <span>/&nbsp;&nbsp;{{ allPages }}</span>
        </li>
        <template v-else>
            <template v-for="index in sortPages">
                <li
                    v-if="index !== 'pre' && index !== 'next'"
                    :key="index"
                    :class="activeClasses(index)"
                    :title="index"
                    @click="changePage(index)"
                >
                    {{ index }}
                </li>
                <li
                    v-else-if="index === 'pre'"
                    :key="index"
                    :class="activeClasses(index)"
                    :title="langs('page.preStep', '向前' + step + '页', { step })"
                    @click="changePage(currentPage - step)"
                >
                    <Icons type="more" size="1.4em" :class="[_tobogPrefix_ + '-more']"></Icons>
                    <Icons type="ios-arrow-back" size="1.4em" :class="[_tobogPrefix_ + '-more']"></Icons>
                </li>
                <li
                    v-else-if="index === 'next'"
                    :key="index"
                    :class="activeClasses(index)"
                    :title="langs('page.nextStep', '向后' + step + '页', { step })"
                    @click="changePage(currentPage + step)"
                >
                    <Icons type="more" size="1.4em" :class="[_tobogPrefix_ + '-more']"></Icons>
                    <Icons type="ios-arrow-forward" size="1.4em" :class="[_tobogPrefix_ + '-more']"></Icons>
                </li>
            </template>
        </template>
        <li
            @click="changePage(currentPage + 1)"
            :data-disabled="allPages <= 1 || allPages <= currentPage"
            :title="langs('page.next', '下一页')"
            v-show="hasTotal"
        >
            <slot name="next" :index="currentPage + 1">
                <Icons type="ios-arrow-forward"></Icons>
            </slot>
        </li>
        <li :class="[_tobogPrefix_ + '-select']" v-if="showSizer" v-show="hasTotal">
            <Select v-model="currentPageSize" @on-change="changePageSize" type="select" :transfer="transfer">
                <Option v-for="index in pageOpts" :key="index" :value="index">{{
                    langs("page.onePageCount", index + "条/每页", { index })
                }}</Option>
            </Select>
        </li>
        <li :class="[_tobogPrefix_ + '-input']" v-if="showElevator" v-show="hasTotal">
            <span>{{ langs("page.goto", "跳至") }}</span>
            <InputNumber
                :class="[_tobogPrefix_ + '-input-cell']"
                :precision="0"
                :value="currentPage"
                @on-enter="changeInput"
                :min="1"
                :max="allPages"
            />
            <span>{{ langs("page.page", "页") }}</span>
        </li>
    </ul>
</template>

<script>
import Icons from "../icons/src/index";
import Select from "../input/select";
import InputNumber from "../input/number";
import Option from "../input/option";
import langMinix from "../../mixins/lang";
export default {
    name: "Page",
    mixins: [langMinix],
    components: {
        Icons,
        Select,
        Option,
        InputNumber,
    },
    props: {
        current: {
            type: [Number, String],
            default: 1,
        },
        total: {
            type: [Number, String],
            default: 0,
        },
        pageSize: {
            type: [Number, String],
            default: 10,
        },
        pageOpts: {
            type: Array,
            default() {
                return [10, 50, 100, 500];
            },
        },
        countPage: {
            type: Number,
            default: 8,
        },
        step: {
            type: [Number, String],
            default: 5,
        },
        showTotal: {
            type: Boolean,
            default: true,
        },
        showElevator: {
            type: Boolean,
            default: true,
        },
        showSizer: {
            type: Boolean,
            default: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
        simple: {
            type: Boolean,
            default: false,
        },
        transfer: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            currentPage: this.current,
            currentPageSize: this.pageSize,
        };
    },
    watch: {
        total(val) {
            let maxPage = Math.ceil(val / this.currentPageSize);
            if (maxPage < this.currentPage && maxPage > 0) {
                this.currentPage = maxPage;
            }
        },
        current(val) {
            this.currentPage = val;
        },
        pageSize(val) {
            this.currentPageSize = val;
        },
    },
    computed: {
        hasTotal() {
            return this.total > 0;
        },
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-small`]: this.small,
                    [`${_tobogPrefix_}-simple`]: this.simple,
                },
            ];
        },
        allPages() {
            return Math.ceil(this.total / this.currentPageSize);
        },
        sortPages() {
            const allPages = this.allPages,
                count = this.countPage,
                current = this.currentPage,
                pages = [],
                status = this.status;

            if (allPages <= count) {
                return allPages;
            }
            if (current < count) {
                for (let i = 1; i <= count - 1; i++) {
                    pages.push(i);
                }
                pages.push("next", allPages);
                return pages;
            }

            if (current > allPages - count + 1) {
                for (let i = allPages - count + 2; i <= allPages; i++) {
                    pages.push(i);
                }
                pages.unshift(1, "pre");
                return pages;
            }

            if (current > count - 1 && current < allPages - count + 2) {
                let len = count - 2;
                let init = parseInt(current - len / 2);
                for (let i = 0; i < len; i++) {
                    pages.push(init + i);
                }
                pages.push("next", allPages);
                pages.unshift(1, "pre");
                return pages;
            }
        },
    },
    methods: {
        activeClasses(index) {
            const _tobogPrefix_ = this._tobogPrefix_;
            return this.currentPage === index ? `${_tobogPrefix_}-active` : null;
        },
        changeInput(page = "") {
            if (page !== "") {
                page = parseInt(page);
                this.changePage(page);
            }
        },
        changePage(page) {
            if (page < 1) {
                page = 1;
            } else if (page > this.allPages) {
                page = this.allPages;
            }
            if (this.currentPage != page) {
                this.currentPage = page;
                this.$nextTick(() => {
                    if (page === this.current && this.currentPageSize === this.pageSize) return;
                    this.$emit("on-change", page, this.currentPageSize);
                });
            }
        },
        changePageSize() {
            this.$nextTick(() => {
                if (this.currentPageSize === this.pageSize) return;
                this.$emit("on-change", 1, this.currentPageSize);
                this.$emit("on-page-size-change", this.currentPageSize);
            });
        },

        keyDown(e) {
            const key = e.keyCode;
            const condition =
                (key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 37 || key === 39;

            if (!condition) {
                e.preventDefault();
            }
        },
        keyUp(e) {
            const key = e.keyCode;
            const val = parseInt(e.target.value);

            if (key === 38) {
                this.prev();
            } else if (key === 40) {
                this.next();
            } else if (key === 13) {
                let page = 1;

                if (val > this.allPages) {
                    page = this.allPages;
                } else if (val <= 0 || !val) {
                    page = 1;
                } else {
                    page = val;
                }

                e.target.value = page;
                this.changePage(page);
            }
        },
    },
};
</script>
