<template>
    <transition :name="transitionName" appear>
        <li :data-vue-module="$options.name" :class="classes" :data-name="name" :data-type="type">
            <!-- <div :class="[_tobogPrefix_]" :name="name"> -->
            <slot>{{ content }}</slot>
            <render-cell v-if="!!renderFunc" :render="renderFunc" />
            <Icons v-if="closable" type="ios-close" :class="[_tobogPrefix_ + '-close']" @click.native="close"></Icons>
            <!-- </!-->
        </li>
    </transition>
</template>

<script>
import RenderCell from "../render";
import Icons from "../../icons/index";
// import { unit } from "../../../utils/tool";

export default {
    name: "NoticeBase",
    inheritAttrs: false,
    components: {
        RenderCell,
        Icons,
    },
    props: {
        duration: {
            type: [Number, String],
            default: 1.5,
        },
        name: {
            required: true,
        },
        content: String,
        render: Function,
        closable: Boolean,
        transitionName: String,
        onClose: Function,
        type: String,
        // offset: Number,
    },
    // data() {
    //     return {
    //         innerStyle: {},
    //     };
    // },
    computed: {
        renderFunc() {
            return this.render || false;
        },
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-closable`]: this.closable,
                },
            ];
        },
        // getStyle() {
        //     return this.offset
        //         ? {
        //               marginRight: unit(this.offset),
        //               //   ...this.innerStyle,
        //           }
        //         : {};
        // },
    },
    methods: {
        close() {
            clearTimeout(this.__closeTime);
            this.__closeTime = null;
            this.$parent.remove(this.name);
            if (typeof this.onClose === "function") this.onClose();
        },
    },
    mounted() {
        clearTimeout(this.__closeTime);
        this.__closeTime = null;
        const duration = this.duration * 1000;
        if (!!duration) {
            this.__closeTime = setTimeout(() => {
                this.close();
            }, duration);
        }
    },
    beforeDestroy() {
        this.$el.style.height = this.$el.offsetHeight + "px";
        clearTimeout(this.__closeTime);
        this.__closeTime = null;
    },
};
</script>
