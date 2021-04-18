<template>
    <DropBase
        ref="dropBase"
        isOutRef
        dropStyle="width:auto;"
        :isToggle="trigger === 'click'"
        :trigger="trigger"
        :class="[_tobogPrefix_ + '-wrapper']"
        :dropClass="dropClasses"
        :data-vue-module="$options.name"
        :transfer="transfer"
        :placement="placement"
        :reference="ready && $refs.ref"
        @hook:created="ready = true"
        @on-clickout="handleClick"
        v-model="show"
        v-bind="$attrs"
    >
        <div ref="ref" :class="classes">
            <slot>
                <Button
                    v-if="innerLabel"
                    :size="size"
                    :class="[_tobogPrefix_ + '-button']"
                    :theme="theme"
                    icon="arrow-dropdown"
                    >{{ innerLabel }}</Button
                >
            </slot>
        </div>
        <slot slot="drop" name="list"></slot>
    </DropBase>
</template>

<script>
import DropBase from "../base/dropBase"
import Button from "../button/src/index"
export default {
    name: "Dropdown",
    componentName: "Dropdown",
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
            type: String,
            // validator(value) {
            // 	return ['click', 'hover', 'custom'].indexOf(value) > -1;
            // },
            default: "click",
        },
        placement: {
            type: String,
            default: "bottom",
        },
        visible: Boolean,
        transfer: Boolean,
        autoClose: Boolean,
        size: [String, Number],
        theme: {
            type: String,
            default: "primary",
        },
        dropClass: [String, Array, Object],
    },
    data() {
        return {
            show: this.visible || false,
            innerLabel: this.label,
            ready: false,
        }
    },
    created() {
        this.$on("on-select", (name) => {
            if (this.autoClose) this.show = false
            if (this.autoLabel) this.innerLabel = name
            this.$emit("on-change", name)
        })
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-visible`]: this.show,
                },
            ]
        },
        dropClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-list`,
                this.dropClass,
                {
                    [`${_tobogPrefix_}-list-theme-${this.theme}`]: this.theme,
                },
            ]
        },
    },
    watch: {
        show(val) {
            if (val == this.visible) return
            this.$emit("on-visible-change", val)
        },
        visible(val) {
            this.show = val
        },
    },
    methods: {
        handleClick(status, event) {
            this.$emit("on-clickout", status, event)
        },
    },
}
</script>
