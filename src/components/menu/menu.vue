<template>
    <ul :class="wrapClasses">
        <slot></slot>
    </ul>
</template>

<script>
export default {
    name: "Menu",
    props: {
        accordion: Boolean,
        always: Boolean,
        mode: {
            type: String,
            // default: "vertical"//horizontal,vertical
        },
        theme: {
            type: String,
            // default: 'primary'//primary,dark,light
        },
        collapse: Boolean,
        transition: Boolean,
    },
    data() {
        return {
            activeName: "",
        };
    },
    created() {
        this.__MenuItems = [];
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-vertical`]: this.mode === "vertical",
                    [`${_tobogPrefix_}-${this.theme}`]: !!this.theme,
                    // [`${_tobogPrefix_}-collapse`]: this.collapse,
                },
            ];
        },
    },
    methods: {
        updateOpen(bool = false) {
            this.__MenuItems.forEach((element) => {
                element.opened = bool;
            });
        },
    },
};
</script>
