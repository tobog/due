<template>
    <section :class="wrapClasses" :data-vue-module="$options.name" :style="getWrapStyles">
        <div :class="[_tobogPrefix_]">
            <div :class="[_tobogPrefix_ + '-bar']" :style="barStyle">
                <span v-if="showText && showTextInside" :class="[_tobogPrefix_ + '-text']">{{ percent }}%</span>
            </div>
        </div>
        <div v-if="showText && !showTextInside" :class="[_tobogPrefix_ + '-text']">
            <slot :percent="percent">
                <Icons v-if="isFinish" size="1.2em" :type="getIcon" />
                <template v-else>{{ percent }}%</template>
            </slot>
        </div>
    </section>
</template>

<script>
import Icons from "../icons/src/index";
import { unit } from "../../utils/tool";
import mixin from "./mixin";
export default {
    mixins: [mixin],
    name: "Progress",
    components: {
        Icons,
    },
    props: {
        active: Boolean,
        height: Number, // 100
    },
    computed: {
        getWrapStyles() {
            if (!this.vertical) return;
            return {
                height: unit(this.height, "px"),
            };
        },
        getIcon() {
            switch (this.curStatus) {
                case "error":
                    return "close";
                case "success":
                    return "checkmark";
            }
        },
        wrapClasses() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                `${_tobogPrefix_}-wrapper`,
                {
                    [`${_tobogPrefix_}-${this.curStatus}`]: !!this.curStatus,
                    [`${_tobogPrefix_}-vertical`]: this.vertical,
                    [`${_tobogPrefix_}-active`]: this.active,
                    [`${_tobogPrefix_}-split`]: this.split,
                    [`${_tobogPrefix_}-${this.textPos}`]: this.showText,
                },
            ];
        },
    },
};
</script>
