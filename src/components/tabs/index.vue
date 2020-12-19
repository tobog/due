<template>
    <section :class="classes">
        <div :class="[_tobogPrefix_ + '-bar']">
            <span v-if="!$slots.extra" :class="[_tobogPrefix_ + '-nav-extra']">
                <slot name="extra"></slot>
            </span>
            <div :class="[_tobogPrefix_ + '-nav-wrapper']" tabindex="-1" @keydown="handleTabKeyNavigation">
                <Icons
                    v-if="scrollable"
                    :class="[_tobogPrefix_ + '-nav-more']"
                    @click="scrollPrev"
                    data-type="pre"
                    type="ios-arrow-back"
                ></Icons>
                <Icons
                    v-if="scrollable"
                    :class="[_tobogPrefix_ + '-nav-more']"
                    @click="scrollNext"
                    data-type="next"
                    type="ios-arrow-forward"
                ></Icons>
                <div
                    ref="navScroll"
                    :class="[_tobogPrefix_ + '-nav-scroll']"
                    @DOMMouseScroll.stop.prevent="handleScroll"
                    @mousewheel.stop.prevent="handleScroll"
                >
                    <ul
                        ref="nav"
                        :class="[_tobogPrefix_ + '-nav']"
                        :style="{
                            transform: 'translateX(-' + navTransform + 'px)',
                        }"
                    >
                        <span :class="barClasses" :style="barStyle"></span>
                        <li
                            v-for="(item, index) in navList"
                            @click="handleChange(index)"
                            :key="index"
                            :tabindex="-1"
                            :class="tabCls(item)"
                        >
                            <Icons :class="[_tobogPrefix_ + '-icon']" v-if="item.icon" :type="item.icon"></Icons>
                            <Render v-if="item.labelType === 'function'" :render="item.label"></Render>
                            <template v-else>{{ item.label }}</template>
                            <Icons
                                :class="[_tobogPrefix_ + '-close']"
                                v-if="item.closable == void 0 ? closable : item.closable"
                                type="ios-close"
                                @click.native.stop="handleRemove(index)"
                            ></Icons>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div :class="[_tobogPrefix_ + '-content-wrapper']">
            <div :class="contentClasses" :style="contentStyle" ref="panels">
                <slot></slot>
            </div>
        </div>
    </section>
</template>
<script>
import Icons from "../icons/index"
import Render from "../base/render"
import Emitter from "../../utils/emitter"
import {findComponentsDownward} from "../../utils/findComponent"
import {oneOf} from "../../utils/tool"

const transitionTime = 300 // from CSS

const focusFirst = (element, root) => {
    try {
        element.focus()
    } catch (err) {} // eslint-disable-line no-empty

    if (document.activeElement == element && element !== root) return true

    const candidates = element.children
    for (let candidate of candidates) {
        if (focusFirst(candidate, root)) return true
    }
    return false
}

export default {
    name: "Tabs",
    mixins: [Emitter],
    components: {Icons, Render},
    provide() {
        return {$RootTabsInstance: this}
    },
    props: {
        value: [String, Number],
        type: {
            validator(value) {
                return oneOf(value, ["line", "card", "border-card"])
            },
            default: "border-card",
        },

        border: {
            type: Boolean,
            default: true,
        },
        compact: {
            type: Boolean,
            default: true,
        },
        animated: {
            type: Boolean,
            default: true,
        },
        captureFocus: Boolean,
        closable: Boolean,
        beforeRemove: Function,
        // Tabs 嵌套时，用 name 区分层级
        name: String,
        adaptiveHeight: Boolean,
        theme: String,
        position: String, //left,right,top,bottom
    },
    data() {
        return {
            navList: [],
            barWidth: 0,
            barOffset: 0,
            activeKey: this.value,
            focusedKey: this.value,
            navTransform: 0,
            scrollable: false,
            transitioning: false,
        }
    },
    mounted() {
        this.$nextTick(() => {
            setTimeout(this.updateNavScroll, 60)
        })
        this.updateVisibility(this.getTabIndex(this.activeKey))
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-no-animation`]: !this.animated,
                    [`${_tobogPrefix_}-${this.type}`]: !!this.type,
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    [`${_tobogPrefix_}-compact`]: this.compact,
                    [`${_tobogPrefix_}-border`]: this.border,
                    [`${_tobogPrefix_}-scrollable`]: this.scrollable,
                    // [`${_tobogPrefix_}-position-left`]: true,
                },
            ]
        },
        contentClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-content`,
                {
                    [`${_tobogPrefix_}-content-animated`]: this.animated,
                    [`${_tobogPrefix_}-content-adaptive`]: this.adaptiveHeight,
                },
            ]
        },
        barClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-ink-bar`,
                {
                    [`${_tobogPrefix_}-ink-bar-animated`]: this.animated,
                },
            ]
        },
        barStyle() {
            if (this.type === "card") return
            const style = {
                // visibility: "visible",
                width: `${this.barWidth}px`,
            }
            if (this.animated) {
                style.transform = `translate3d(${this.barOffset}px, 0px, 0px)`
            } else {
                style.left = `${this.barOffset}px`
            }
            return style
        },
        contentStyle() {
            const x = this.getTabIndex(this.activeKey)
            const p = x == 0 ? "0%" : `-${x}00%`
            if (x > -1) {
                return {
                    transform: `translateX(${p})`,
                }
            }
            return {}
        },
    },
    methods: {
        getTabs() {
            const AllTabPanes = findComponentsDownward(this, "TabPanel")
            const TabPanes = []
            AllTabPanes.forEach((item) => {
                if (item.tab && this.name) {
                    if (item.tab === this.name) {
                        TabPanes.push(item)
                    }
                } else {
                    TabPanes.push(item)
                }
            })
            // 在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序
            TabPanes.sort((a, b) => {
                if (a.index && b.index) {
                    return a.index > b.index ? 1 : -1
                }
            })
            return TabPanes
        },
        updateNav() {
            this.navList = []
            this.getTabs().forEach((pane, index) => {
                this.navList.push({
                    labelType: typeof pane.label,
                    label: pane.label,
                    icon: pane.icon || "",
                    name: pane.currentName || index,
                    disabled: pane.disabled,
                    closable: pane.closable,
                })
                if (!pane.currentName) pane.currentName = index
                if (index == 0 && !this.activeKey) this.activeKey = pane.currentName || index
            })
            // this.updateStatus();
            this.updateBar()
        },
        updateBar() {
            this.$nextTick(() => {
                if (!this.$refs.nav) return // 页面销毁时
                const index = this.getTabIndex(this.activeKey)
                const prevTabs = this.$refs.nav.querySelectorAll(`.${this._tobogPrefix_}-tab`)
                const tab = prevTabs[index]
                this.barWidth = tab ? parseFloat(tab.offsetWidth) : 0
                this.barOffset = index > 0 ? prevTabs[index].offsetLeft : 0
                this.updateNavScroll()
            })
        },
        tabCls(item) {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-tab`,
                {
                    [`${_tobogPrefix_}-tab-disabled`]: item.disabled,
                    [`${_tobogPrefix_}-tab-active`]: item.name === this.activeKey,
                    [`${_tobogPrefix_}-tab-focused`]: item.name === this.focusedKey,
                },
            ]
        },
        handleChange(index) {
            if (this.transitioning) return
            this.transitioning = true
            setTimeout(() => (this.transitioning = false), transitionTime)
            const nav = this.navList[index]
            if (nav.disabled) return
            this.activeKey = nav.name
            this.$emit("input", this.activeKey)
            this.$emit("on-click", this.activeKey)
        },
        handleTabKeyNavigation(e) {
            if (e.keyCode !== 37 && e.keyCode !== 39) return
            const direction = e.keyCode === 39 ? 1 : -1
            const getNextTab = function(list, activeKey, direction, countDisabledAlso) {
                const currentIndex = list.findIndex((tab) => tab.name === activeKey)
                const nextIndex = (currentIndex + direction + list.length) % list.length
                const nextTab = list[nextIndex]
                if (nextTab.disabled) return getNextTab(list, nextTab.name, direction, countDisabledAlso)
                return nextTab
            }
            const nextTab = getNextTab(this.navList, this.focusedKey, direction)
            this.focusedKey = nextTab.name
            const index = this.getTabIndex(this.focusedKey || 0)
            this.handleChange(index)
        },
        async handleRemove(index) {
            if (typeof this.beforeRemove === "function") await this.beforeRemove(index)
            this.handleRemoveTab(index)
        },
        handleRemoveTab(index) {
            const tabs = this.getTabs()
            const tab = tabs[index]
            tab.$destroy()
            if (tab.currentName === this.activeKey) {
                const newTabs = this.getTabs()
                let activeKey = -1
                if (newTabs.length) {
                    const noDisabledTab =
                        tabs.find((item, itemIndex) => !item.disabled && itemIndex > index) ||
                        [...tabs].reverse().find((item, itemIndex) => !item.disabled && itemIndex > index)
                    activeKey = noDisabledTab ? noDisabledTab.currentName : newTabs[0].currentName
                }
                this.activeKey = activeKey
                this.$emit("input", activeKey)
            }
            this.$emit("on-tab-remove", tab.currentName)
            this.updateNav()
        },
        scrollPrev() {
            if (!this.navTransform) return
            const containerWidth = this.$refs.navScroll.offsetWidth
            this.navTransform = this.navTransform > containerWidth ? this.navTransform - containerWidth : 0
        },
        scrollNext() {
            const navWidth = this.$refs.nav.scrollWidth
            const containerWidth = this.$refs.navScroll.offsetWidth
            const currentOffset = this.navTransform
            if (navWidth - currentOffset <= containerWidth) return
            this.navTransform =
                navWidth - currentOffset > containerWidth * 2
                    ? currentOffset + containerWidth
                    : navWidth - containerWidth
        },
        getTabIndex(name) {
            return this.navList.findIndex((nav) => nav.name === name)
        },
        scrollToActiveTab() {
            if (!this.scrollable) return
            const _tobogPrefix_ = this._tobogPrefix_
            const activeTab = this.$el.querySelector(`.${_tobogPrefix_}-tab-active`)
            if (!activeTab) return
            // const nav = this.$refs.nav
            const navScroll = this.$refs.navScroll
            const activeTabBounding = activeTab.getBoundingClientRect()
            const navScrollBounding = navScroll.getBoundingClientRect()
            // const navBounding = nav.getBoundingClientRect()
            const currentOffset = this.navTransform
            let newOffset = currentOffset
            if (activeTabBounding.left < navScrollBounding.left) {
                newOffset = currentOffset - (navScrollBounding.left - activeTabBounding.left)
            } else if (activeTabBounding.right > navScrollBounding.right) {
                newOffset = currentOffset + activeTabBounding.right - navScrollBounding.right
            }
            this.navTransform = Math.max(newOffset, 0)
        },
        updateNavScroll() {
            const navWidth = this.$refs.nav.scrollWidth
            const containerWidth = this.$refs.navScroll.offsetWidth
            const currentOffset = this.navTransform
            if (containerWidth < navWidth) {
                this.scrollable = true
                if (navWidth - currentOffset < containerWidth) {
                    this.navTransform = navWidth - containerWidth
                }
            } else {
                this.scrollable = false
                if (currentOffset > 0) this.navTransform = 0
            }
        },
        handleScroll(e) {
            // e.preventDefault()
            // e.stopPropagation()
            const type = e.type
            let delta = 0
            if (type === "DOMMouseScroll" || type === "mousewheel") {
                delta = e.wheelDelta ? e.wheelDelta : -(e.detail || 0) * 40
            }
            if (delta > 0) {
                this.scrollPrev()
            } else {
                this.scrollNext()
            }
        },
        updateVisibility(index) {
            const _tobogPrefix_ = this._tobogPrefix_.slice(0, -1)
            const childClass = `.${_tobogPrefix_}pane`
            const activeClass = `.${childClass}-active`
            ;[...this.$refs.panels.querySelectorAll(childClass)].forEach((el, i) => {
                if (index === i) {
                    ;[...el.children].forEach(
                        (child) => child.classList.contains(childClass) && child.classList.addClass(activeClass)
                    )
                    if (this.captureFocus) setTimeout(() => focusFirst(el, el), transitionTime)
                } else {
                    setTimeout(() => {
                        ;[...el.children].forEach(
                            (child) => child.classList.contains(childClass) && child.classList.removeClass(activeClass)
                        )
                    }, transitionTime)
                }
            })
        },
    },
    watch: {
        value(val) {
            this.activeKey = val
            // this.focusedKey = val
        },
        activeKey(val) {
            this.focusedKey = val
            this.updateBar()
            // this.updateStatus();
            this.broadcast("Table", "on-visible-change", true)
            this.$nextTick(() => {
                this.scrollToActiveTab()
            })
            // update visibility
            this.updateVisibility(Math.max(this.getTabIndex(this.focusedKey)))
        },
    },
}

// updateStatus() {
// 	const tabs = this.getTabs();
// 	tabs.forEach(
// 		tab =>
// 			(tab.show =
// 				tab.currentName === this.activeKey)
// 	);
// },
</script>
