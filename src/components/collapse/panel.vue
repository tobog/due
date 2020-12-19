<template>
    <div :class="wrapClasses" :data-vue-module="$options.name">
        <template v-if="custom">
            <slot :toggle="toggle" :active="isActive"></slot>
        </template>
        <div v-else @click="toggle" :class="[_tobogPrefix_ + '-header']">
            <Icons v-if="icon" :type="icon"></Icons>
            <slot :active="isActive">{{ title }}</slot>
        </div>
        <Transitions name="collapse">
            <aside v-show="isActive" :class="[_tobogPrefix_ + '-content']">
                <slot name="content"></slot>
            </aside>
        </Transitions>
    </div>
</template>

<script>
import Icons from '../icons/index';
import Transitions from '../base/transition';
export default {
    name: 'Panel',
    components: {
        Icons,
        Transitions,
    },
    props: {
        name: String,
        title: String,
        custom: Boolean,
        disabled: Boolean,
        icon: {
            type: String,
            default: 'ios-arrow-forward',
        },
    },
    data() {
        return {
            isActive: false,
        };
    },
    computed: {
        nameUid() {
            if (this.name == null) return this._uid;
            return this.name;
        },
        wrapClasses() {
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
            if (this.disabled) return;
            this.$parent.toggle({
                name: this.nameUid,
                isActive: this.isActive,
            });
            this.isActive = !this.isActive;
        },
    },
};
</script>
