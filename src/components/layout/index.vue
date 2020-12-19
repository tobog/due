<template>
    <section :class="classes" :data-vue-module="$options.name">
        <slot></slot>
    </section>
</template>

<script>
export default {
    name: "Layout",
    props: {},
    data() {
        return {
            hasAside: false,
            hasHeader: false,
            childSize: null,
            isTopLayout: false,
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.$nextTick(() => {
                const layoutSize = this.getMediaWidth()
                if (this.$parent && this.$parent.$options.name === "Layout") {
                    this.$parent.childSize = layoutSize
                } else {
                    this.isTopLayout = true
                }
                this.childSize &&
                    ["top", "bottom", "left", "right"].forEach((key) => {
                        layoutSize[key] = layoutSize[key] || this.childSize[key]
                    })
                this.setSize(layoutSize)
                this.findChild("Layout").forEach((comp) => {
                    comp.setSize(layoutSize)
                })
                if (!this.isTopLayout) {
                    this.$parent.init()
                }
            })
        },
        findChild(type = "Layout-Aside", context) {
            context = context || this
            return context.$children.filter((child) => {
                return child.$options.name === type
            })
        },
        getMediaWidth() {
            let header = this.findChild("Layout-Header"),
                aside = this.findChild("Layout-Aside"),
                footer = this.findChild("Layout-Footer"),
                top = 0,
                bottom = 0,
                left = 0,
                right = 0
            this.hasAside = aside.length > 0
            this.hasHeader = header.length > 0 || footer.length > 0
            aside.forEach((comp) => {
                if (comp.fixed && !comp.right) {
                    left = comp.getWidth()
                }
                if (comp.fixed && comp.right) {
                    right = comp.getWidth()
                }
            })
            header.forEach((comp) => {
                if (comp.fixed || (this.hasAside && this.hasHeader)) {
                    top = comp.getHeight()
                }
            })
            footer.forEach((comp) => {
                if (comp.fixed || (this.hasAside && this.hasHeader)) {
                    bottom = comp.getHeight()
                }
            })
            return {top, bottom, left, right}
        },
        setSize(size) {
            let header = this.findChild("Layout-Header"),
                aside = this.findChild("Layout-Aside"),
                footer = this.findChild("Layout-Footer"),
                content = this.findChild("Layout-Content")
            header.forEach((comp) => {
                if (size.left) comp.left = size.left
                if (size.right) comp.right = size.right
            })
            aside.forEach((comp) => {
                if (size.top) comp.top = size.top
                if (size.bottom) comp.bottom = size.bottom
            })
            footer.forEach((comp) => {
                if (size.left) comp.left = size.left
                if (size.right) comp.right = size.right
            })
            content.forEach((comp) => {
                if (size.left) comp.left = size.left
                if (size.right) comp.right = size.right
                if (size.bottom) comp.bottom = size.bottom
                if (size.top) comp.top = size.top
            })
        },
        refresh() {
            if (this.$parent && this.$parent.$options.name === "Layout" && typeof this.$parent.init === "function") {
                this.$parent.init(true)
            }
        },
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-has-aside`]: this.hasAside && !this.hasHeader,
                    [`${_tobogPrefix_}-has-header`]: !this.hasAside && this.hasHeader,
                    [`${_tobogPrefix_}-has-all`]: this.hasAside && this.hasHeader,
                    [`${_tobogPrefix_}-top`]: this.isTopLayout,
                },
            ]
        },
    },

    beforeDestroy() {
        this.refresh()
    },
}
</script>
