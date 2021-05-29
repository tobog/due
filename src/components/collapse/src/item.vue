<template>
    <li :class="classes" :data-vue-module="$options.name" :data-index="index">
        <div v-if="$scopedSlots.title || title" @click="toggle" :class="[_tobogPrefix_ + '-header']">
            <Icons v-if="icon" :type="icon"></Icons>
            <slot :toggle="toggle" :active="isActive" name="title">{{ title }}</slot>
        </div>
        <Transitions name="collapse">
            <aside v-show="isActive" :class="[_tobogPrefix_ + '-content']">
                <slot></slot>
            </aside>
        </Transitions>
        <div v-if="$scopedSlots.footer" @click="toggle" :class="[_tobogPrefix_ + '-footer']">
            <slot :toggle="toggle" :active="isActive" name="footer"></slot>
        </div>
    </li>
</template>

<script>
import Icons from "../../icons/src/index";
import Transitions from "../../base/transition";
export default {
    name: "Collapse-Item",
    componentName: "Collapse-Item",
    components: {
        Icons,
        Transitions,
    },
    props: {
        name: String,
        title: String,
        disabled: Boolean,
        icon: {
            type: String,
            default: "ios-arrow-forward",
        },
    },
    data() {
        return {
            isActive: false,
            index: 0,
        };
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-active`]: this.isActive,
                    [`${_tobogPrefix_}-disabled`]: this.disabled,
                },
            ];
        },
    },
    methods: {
        toggle() {
            console.log(this);
            if (this.disabled || this._runningToggle) return;
            this._runningToggle = true;
            this._timeOutToggle = setTimeout(() => {
                this._runningToggle = false;
            }, 120);
            this.$parent.toggle({
                name: this.name == null ? this._index : this.name,
                isActive: this.isActive,
            });
            this.isActive = !this.isActive;
        },
    },
    beforeDestroy() {
        clearTimeout(this._timeOutToggle);
    },
};
</script>
