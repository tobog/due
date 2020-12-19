<template>
    <ul :class="wrapClasses" :data-vue-module="$options.name">
        <NoticeBase v-for="notice in notices" :key="notice.name" v-bind="notice"></NoticeBase>
    </ul>
</template>

<script>
import NoticeBase from "./notice.vue";

export default {
    name: "Notification",
    components: {
        NoticeBase,
    },
    props: {
        position: String,
    },
    data() {
        return {
            notices: [],
        };
    },
    computed: {
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-mask`]: this.hasMask,
                    [`${_tobogPrefix_}-${this.position}`]: !!this.position,
                },
            ];
        },
        hasMask() {
            return this.notices.some((notice) => {
                return notice.maskable;
            });
        },
    },
    methods: {
        add(notice = {}) {
            console.log(this.position);
            this._nameLen = (this._nameLen || 0) + 1;
            if (!notice.name) notice.name = `${this._uid}${this._nameLen}`;
            if (this.position && this.position.indexOf("bottom") > -1) {
                this.notices.unshift({ ...notice });
            } else {
                this.notices.push({ ...notice });
            }
            return notice.name;
        },
        remove(name, isTheme) {
            const notices = this.notices,
                key = isTheme ? "theme" : "name";
            this.notices = notices.filter((item) => {
                return item[key] !== name;
            });
        },
        destroy() {
            this.notices = [];
        },
    },
};
</script>
