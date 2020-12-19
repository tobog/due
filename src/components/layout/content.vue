<template>
    <main :class="wrapClasses" :style="getStyle">
        <slot></slot>
    </main>
</template>
<script>
export default {
    name: 'Layout-Content',
    data() {
        return {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
        };
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [_tobogPrefix_];
        },
        getStyle() {
            let style = {};
            if (this.top) style.paddingTop = this.top + 'px';
            if (this.bottom) style.paddingBottom = this.bottom + 'px';
            if (this.left) style.paddingLeft = this.left + 'px';
            if (this.right) style.paddingRight = this.right + 'px';
            return style;
        },
    },
    methods: {
        refresh() {
            if (this.$parent && this.$parent.$options.name === 'Layout' && typeof this.$parent.init === 'function') {
                this.$parent.init(true);
            }
        },
    },
    beforeDestroy() {
        this.refresh();
    },
};
</script>
