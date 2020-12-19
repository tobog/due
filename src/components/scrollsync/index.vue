<template>
    <section :data-vue-module="$options.name">
        <slot></slot>
    </section>
</template>

<script>
import { ScrollSync } from "../../utils/dom";
export default {
    name: "ScrollSync",
    props: {
        isPercent: {
            type: Boolean,
            default: false,
        },
        scroll: {
            type: String,
            default: "all", //left,all
        },
        references: {
            type: Array,
            default() {
                return [];
            },
        },
    },
    mounted() {
        this.setScrollSync();
    },
    computed: {
        getOptions() {
            return {
                isPercent: this.isPercent,
                isScrollTop: this.scroll === "top" || this.scroll === "all",
            };
        },
    },
    watch: {
        references() {
            this.setScrollSync();
        },
        getOptions() {
            this.setScrollSync();
        },
    },
    methods: {
        getRefs() {
            const references = this.references;
            if (Array.isArray(references) && references.length > 1) {
                return references;
            }
            const refs = [...this.$el.querySelectorAll("[data-scroll-sync]")];
            if (refs.length > 1) return refs;
            const children = [...this.$el.children];
            if (children.length > 1) return children;
        },
        setScrollSync() {
            if (!this._isMounted) return;
            this.$nextTick(() => {
                const refs = this.getRefs();
                if (!refs) return;
                if (this._scrollSync) {
                    this._scrollSync.update(refs, this.getOptions);
                } else {
                    this._scrollSync = new ScrollSync(refs, this.getOptions);
                }
                if (this.scroll === "all") {
                    const options = { ...this.getOptions, isScrollTop: false };
                    if (this._scrollSync2) {
                        this._scrollSync2.update(refs, options);
                    } else {
                        this._scrollSync2 = new ScrollSync(refs, options);
                    }
                } else {
                    this._scrollSync2 && this._scrollSync2.destroy();
                    this._scrollSync2 = null;
                }
            });
        },
        beforeDestroy() {
            this._scrollSync && this._scrollSync.destroy();
            this._scrollSync2 && this._scrollSync2.destroy();
            this._scrollSync = this._scrollSync2 = null;
        },
    },
};
</script>
