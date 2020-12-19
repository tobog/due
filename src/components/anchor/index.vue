<template>
    <a :class="[_tobogPrefix_]" :href="href" :data-target="target" @click.prevent="goAnchor" :title="title">
        <slot>{{ title }}</slot>
    </a>
</template>
<script>
import { scrollIntoView } from '../../utils/dom';
export default {
    name: 'Anchor',
    props: {
        href: String,
        title: String,
        target: String,
        position: {
            type: [Number, Boolean, String],
            default: 'start',
        },
    },
    // data() {
    //     return {};
    // },
    mounted() {
        this.initGoAnchor();
    },
    methods: {
        initGoAnchor() {
            setTimeout(() => {
                const data = (sessionStorage[`${this.__$cssPrefix__}_Anchor_Target`] || '').split('@@@');
                if (!data[1]) data[1] = this.position;
                this.gotTargetAnchor(...data);
            });
        },
        goAnchor() {
            const href = this.href;
            if (href) {
                this.$emit('on-select', href);
                if (this.target) {
                    sessionStorage[`${this.__$cssPrefix__}_Anchor_Target`] = `${this.target}@@@${this.position}`;
                }
                if (this.$router) {
                    this.$router.push(href);
                } else {
                    window.location.href = href;
                }
                return;
            }
            this.gotTargetAnchor(this.target, this.position);
        },
        gotTargetAnchor(target, position) {
            if (target) {
                target =
                    document.querySelector(target) ||
                    document.querySelector(`#${target}`) ||
                    document.querySelector(`.${target}`);
                scrollIntoView(target, position);
            }
            sessionStorage.removeItem(`${this.__$cssPrefix__}_Anchor_Target`);
        },
    },
};
</script>
