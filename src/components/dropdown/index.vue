<template>
    <DropBase
        ref="dropBase"
        isOutRef
        dropStyle="overflow:hidden;width:auto;"
        :isToggle="trigger === 'click'"
        :trigger="trigger"
        :class="[_tobogPrefix_ + '-wrapper']"
        :dropClass="[_tobogPrefix_ + '-list']"
        :data-vue-module="$options.name"
        :transfer="transfer"
        :placement="placement"
        :reference="(ready && $refs.ref) || null"
        @hook:created="ready = true"
        @on-clickout="handleClick"
        v-bind="$attrs"
        v-model="show"
    >
        <div ref="ref" :class="[_tobogPrefix_]">
            <slot>
                <Button :class="[_tobogPrefix_ + '-button']" theme="primary" v-if="innerLabel" icon="arrow-dropdown">{{
                    innerLabel
                }}</Button>
            </slot>
        </div>
        <slot slot="drop" name="list"></slot>
    </DropBase>
</template>

<script>
import DropBase from "../base/dropBase";
import Button from "../button/index";
export default {
    name: "Dropdown",
    components: {
        Button,
        DropBase,
    },
    model: {
        prop: "label",
        event: "on-change",
    },
    props: {
        label: [String, Number],
        autoLabel: Boolean,
        trigger: {
            // validator(value) {
            // 	return ['click', 'hover', 'custom'].indexOf(value) > -1;
            // },
            default: "click",
        },
        placement: {
            type: String,
            default: "bottom",
        },
        visible: {
            type: Boolean,
            default: false,
        },
        transfer: {
            type: Boolean,
            default: false,
        },
        autoClose: Boolean,
    },
    data() {
        return {
            show: this.visible || false,
            children: [],
            innerLabel: this.label,
            ready: false,
        };
    },
    created() {
        this.$on("on-select", this.getSelected);
    },
    // mounted() {
    //     this.show = this.visible || false
    // },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_;
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-visible`]: this.show,
                },
            ];
        },
    },
    watch: {
        show(val) {
            if (val == this.visible) return;
            this.$emit("on-visible-change", val);
        },
        visible(val) {
            this.show = val;
        },
    },
    methods: {
        handleClick(status, event) {
            this.$emit("on-clickout", status, event);
        },
        getSelected(name) {
            if (this.autoClose) this.show = false;
            if (this.autoLabel) this.innerLabel = name;
            this.$emit("on-change", name);
        },
    },
    // beforeDestroy() {
    //     if (this._ancestor_) this._ancestor_.$emit("on-remove-child", this)
    // },
};
</script>
