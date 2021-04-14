<template>
    <a :class="[_tobogPrefix_]" :href="href" :data-selector="selector" @click.prevent="goAnchor" :title="title" v-bind="$attrs">
        <slot>{{ title }}</slot>
    </a>
</template>
<script>
import { scrollIntoView, getElement } from "../../utils/dom";
export default {
    name: "Anchor",
    componentName: "Anchor",
    props: {
        href: String,
        title: String,
        selector: String,
        position: {
            type: [Number, Boolean, String],
            default: "start",
        }
    },
    mounted() {
        this.initGoAnchor();
    },
    methods: {
        initGoAnchor() {
            setTimeout(() => {
                const data = (sessionStorage[`${this.__$cssPrefix__}AnchorTarget`] || "").split("=@=");
                if (!data[1] && data[1]!='0') data[1] = this.position;
                this.gotTargetAnchor(...data);
            });
        },
        goAnchor() {
            const href = this.href;
            if (href) {
                this.$emit("on-jump", href);
                if (this.selector) {
                    sessionStorage[`${this.__$cssPrefix__}AnchorTarget`] = `${this.selector}=@=${this.position}`;
                }
                if (this.$router) {
                    this.$router.push(href);
                } else {
                    window.open(href, this.$attrs.target || "_self");
                }
                return;
            }
            this.gotTargetAnchor(this.selector, this.position);
        },
        gotTargetAnchor(selector, position) {
            sessionStorage.removeItem(`${this.__$cssPrefix__}AnchorTarget`);
            if (selector) {
                selector = getElement(selector);
                selector &&
                    scrollIntoView(selector, { position }, () => {
                        this.$emit("on-scroll", selector);
                    });
            }
        },
    },
};
</script>
