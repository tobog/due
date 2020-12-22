<template>
    <section :class="classes" :data-vue-module="$options.name" v-on="$listeners">
        <slot></slot>
    </section>
</template>
<script>
export default {
    name: "ButtonGroup",
    componentName: "ButtonGroup",
    inheritAttrs: false,
    props: {
        shape: String,
        vertical: Boolean,
        compact: Boolean,
        type: String, //消除type：button问题
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                {
                    [_tobogPrefix_]: !this.vertical,
                    [`${_tobogPrefix_}-vertical`]: this.vertical,
                    [`${_tobogPrefix_}-compact`]: this.compact,
                    [`${_tobogPrefix_}-${this.shape}`]: !!this.shape,
                },
            ]
        },
    },
}
</script>
