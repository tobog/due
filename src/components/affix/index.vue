<template>
    <section v-scroll-affix="affixData" :data-vview-module='$options.name'>
        <slot></slot>
    </section>
</template>
<script>
import ScrollAffix from '../../directives/scroll-affix';
export default {
    name: 'Affix',
    props: {
        offsetTop: Number,
        offsetBottom: Number
    },
    directives: {
        ScrollAffix
    },
    computed: {
        affixData() {
            return {
                offsetTop: this.offsetTop,
                offsetBottom: this.offsetBottom,
            }
        }
    }

};
</script>
