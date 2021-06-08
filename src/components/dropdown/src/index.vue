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
        v-bind="popperConfig"
    >
        <div ref="ref" :class="classes">
            <slot>
                <Button
                    v-if="label"
                    :size="size"
                    :class="[_tobogPrefix_ + '-button']"
                    :theme="theme"
                    icon="arrow-dropdown"
                    >{{ label }}</Button
                >
            </slot>
        </div>
        <slot slot="drop" name="list">
            <DropdownItem v-for="item in getOpts" :key="item.name" v-bind="item">
                {{ item.label }}
            </DropdownItem>
        </slot>
    </DropBase>
</template>

<script>
import DropBase from "../../base/dropBase"
import Button from "../../button/src/index"
import DropdownItem from "./dropdownItem"
export default {
    name: "Dropdown",
    componentName: "Dropdown",
    components: {
        Button,
        DropBase,
        DropdownItem,
    },
    model: {
        prop: "value",
        event: "on-change",
    },
    props: {
        value: [String, Number],
        label: String,
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
        theme: String,
        options: Array,
        popperConfig: Object,
    },
    data() {
        return {
            show: this.visible || false,
            ready: false,
        }
    },
    created() {
        this.$on("on-select", (name) => {
            if (this.autoClose) this.show = false
            this.$emit("on-change", name)
            this.$emit("update:value", name)
        })
    },
    computed: {
        classes() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                _tobogPrefix_,
                {
                    [`${_tobogPrefix_}-visible`]: this.show,
                    [`${_tobogPrefix_}-size-${this.size}`]: this.size,
                    [`${_tobogPrefix_}-theme-${this.theme}`]: this.theme,
                },
            ]
        },
        dropClasses() {
            const _tobogPrefix_ = this._tobogPrefix_
            return [
                `${_tobogPrefix_}-drop`,
                this.popperConfig ? this.popperConfig.dropClass : "",
                {
                    [`${_tobogPrefix_}-theme-${this.theme}`]: this.theme,
                    [`${_tobogPrefix_}-size-${this.size}`]: this.size,
                },
            ]
        },
        getOpts() {
            return Array.isArray(this.options) ? this.options : []
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
