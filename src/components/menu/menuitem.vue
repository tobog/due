<template>
    <li :class="classes" :data-deep="deep">
        <component :is="getTag" :class="titleClasses" :style="setTitleStyle" @click="handleOpen" v-bind="handleProps">
            <Icons v-if="icon" center :type="icon" :class="[_tobogPrefix_ + '-icon']" />
            <slot name="title">{{ title }}</slot>
            <Icons v-if="$slots.default && downIcon" center :type="downIcon" :class="[_tobogPrefix_ + '-drop-icon']" />
        </component>
        <template v-if="$slots.default">
            <Transitions v-if="isVerticalMode" :name="isTransition ? 'collapse' : null">
                <ul v-if="isOpened" :data-deep="deep + 1" :class="[_tobogPrefix_ + '-drop-wrapper']">
                    <slot></slot>
                </ul>
            </Transitions>
            <ul v-else :data-deep="deep + 1" :class="dropClasses" :style="getFixedDrop()">
                <slot></slot>
            </ul>
        </template>
    </li>
</template>

<script>
import Transitions from "../base/transition";
import Icons from "../icons/index";
import { findComponentUpward } from "../../utils/findComponent";

export default {
    inheritAttrs: false,
    name: "MenuItem",
    components: {
        Icons,
        Transitions,
    },
    props: {
        name: {
            type: String,
            default: "",
        },
        title: String,
        icon: String,
        downIcon: {
            type: String,
            default: "ios-arrow-down",
        },
        mode: {
            type: String,
            // default: 'vertical'
        },
        align: {
            type: String,
            default: "center", //fixed,center,left,right,fix,aside
        },
        always: {
            type: Boolean,
            default: false,
        },
        expand: {
            type: Boolean,
            default: false,
        },
        transition: Boolean,
    },
    data() {
        return {
            active: false,
            ready: false,
            opened: this.expand,
            deep: 0,
        };
    },
    created() {
        this.initContext();
    },
    mounted() {
        this.$nextTick(() => {
            this.ready = true;
        });
    },
    computed: {
        isTransition() {
            console.log(this.__Menu , this.__Menu.transition,'-----------');
            return this.transition || (this.__Menu && this.__Menu.transition);
        },
        isVerticalMode() {
            return (this.mode || (this.__Menu && this.__Menu.mode)) === "vertical";
        },
        isAlways() {
            return this.always || (this.__Menu && this.__Menu.always);
        },
        isOpened() {
            return this.opened || this.isAlways;
        },
        getName() {
            return this.name || this._uid;
        },
        setTitleStyle() {
            if (this.deep > 0) {
                return {
                    paddingLeft: (this.deep + 1) * 16 + "px",
                };
            }
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-fix`]: this.align === "fix",
                    [`${_tobogPrefix_}-aside-fix`]: this.align === "aside-fix",
                    [`${_tobogPrefix_}-open`]: this.isOpened,
                    [`${_tobogPrefix_}-vertical`]: this.isVerticalMode,
                },
            ];
        },
        titleClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-title`,
                {
                    [`${_tobogPrefix_}-active`]: this.active || this.getActive(),
                    [`${_tobogPrefix_}-title-open`]: this.isOpened,
                },
            ];
        },
        dropClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-drop`,
                {
                    [`${_tobogPrefix_}-drop-${this.align}`]: !!this.align,
                },
            ];
        },
        getTag() {
            const props = this.handleProps;
            return props.tag || "div";
        },
        handleProps() {
            let props = this.$attrs,
                { tag, to } = props;
            if (tag) return props;
            if (to && this.$router) tag = "router-link";
            return { ...props, tag };
        },
    },
    methods: {
        initContext() {
            this.__Menu = findComponentUpward(this, "Menu");
            if (!this.isVerticalMode) return;
            this.__MenuItem = findComponentUpward(this, "MenuItem");
            if (this.__MenuItem) {
                this.deep = this.__MenuItem.deep + 1;
            }
            if (this.__Menu) {
                this.__Menu.__MenuItems.push(this);
            }
        },
        updateOpen(bool = false) {
            if (this.__MenuItem) {
                this.__MenuItem.opened = bool;
                this.__MenuItem.updateOpen(bool);
            }
        },
        getActive() {
            return this.__Menu && this.__Menu.activeName === this.getName;
        },
        getFixedDrop() {
            if (this.align === "fixed" && this.ready) {
                return {
                    top: this.$el.offsetHeight + "px",
                };
            }
        },
        handleOpen() {
            const name = this.getName,
                Menu = this.__Menu;
            if (this.isVerticalMode && this.$slots.default && !this.isAlways) {
                const opened = this.opened;
                if (Menu && Menu.accordion) {
                    Menu.updateOpen(false);
                    this.updateOpen(true);
                }
                this.opened = !opened;
                if (Menu) Menu.$emit("on-open-change", name, this.opened);
                return;
            }
            if (Menu) {
                Menu.activeName = name;
                Menu.$emit("on-select", name);
            }
        },
    },
    beforeDestroy() {
        if (this.__Menu) {
            const index = this.__Menu.__MenuItems.indexOf(this);
            if (index > -1) this.__Menu.__MenuItems.splice(index, 1);
        }
    },
};
</script>
