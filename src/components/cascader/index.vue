<template>
    <DropBase
        ref="dropBase"
        dropStyle="width:auto;"
        isOutRef
        isToggle
        :data-vue-module="$options.name"
        :transfer="transfer"
        :disabled="isReadonly"
        :class="[_tobogPrefix_ + '-wrapper']"
        :reference="ready ? $refs.inputBase.$refs.inputInner : null"
        v-model="visible"
        @on-visible-change="handleVisible"
    >
        <InputBase
            ref="inputBase"
            type="text"
            :class="[_tobogPrefix_ + '-input']"
            :value="getValueText"
            :valueData="model"
            :prefix="prefix"
            :suffix="suffix"
            :readonly="readonly"
            :name="name"
            :clearable="clearable"
            :disabled="disabled"
            :theme="theme"
            :multiple="selection === 'multiple'"
            :collapse="collapse"
            :active="visible"
            :size="size"
            :isInput="filterable"
            v-bind="$attrs"
            @hook:created="ready = true"
            @on-focus="handleFocus"
            @on-input="handleInput"
            @on-clear="handleClear"
            @on-remove-item="handleClearTag"
            @on-blur="handleBlur"
            @on-keydown="handleKeydown"
            @on-icon-click="handleIconClick"
        >
            <template v-if="prepend" slot="prepend">
                <slot name="prepend"></slot>
            </template>
            <template v-if="append" slot="append">
                <slot name="append"></slot>
            </template>
            <template v-if="showPrefix" slot="prefix">
                <slot name="prefix"></slot>
            </template>
            <template v-if="showSuffix" slot="suffix">
                <slot name="suffix"></slot>
            </template>
        </InputBase>

        <Caspanel
            slot="drop"
            ref="caspanel"
            :class="[_tobogPrefix_ + '-caspanel']"
            :value="model"
            :data="data"
            :theme="theme"
            :size="size"
            :selection="selection"
            :trigger="trigger"
            :asyncData="asyncData"
            :render="render"
            :identifier="identifier"
            :parentId="parentId"
            :filterType="filterType"
            @input="handleChange"
            @on-search="handleSearch"
            @hook:created="updateValueText += 1"
            @on-updateDrop="updatedDrop"
        >
            <template v-if="$scopedSlots.default" v-slot="data">
                <slot v-bind="data"></slot>
            </template>
        </Caspanel>
    </DropBase>
</template>

<script>
import DropBase from "../base/dropBase";
import InputBase from "../input/base";
import mixin from "../input/base/mixin";
import Caspanel from "./caspanel";
export default {
    name: "Cascader",
    componentName: "Cascader",
    mixins: [mixin],
    components: { Caspanel, DropBase, InputBase },
    props: {
        filterable: Boolean,
        autoClose: Boolean,
        transfer: Boolean,
        value: {
            type: Array,
            default() {
                return [];
            },
        },
        data: {
            type: Array,
            default() {
                return [];
            },
        },
        identifier: {
            type: String,
            default: "id",
        },
        parentId: {
            type: String,
            default: "parentId",
        },
        asyncData: Function,
        render: Function,
        renderSearch: Function,
        selection: String,
        trigger: {
            type: String,
            default: "click", //click,hover
        },
        showAllLevels: {
            type: Boolean,
            default: true,
        },
        filterType: String, // default(cascader),flat(平铺)
    },
    data() {
        return {
            model: [],
            visible: false,
            updateValueText: 1,
        };
    },
    created() {
        this.updateModel(this.value);
        this.handleDispatch("on-change", this.model);
    },
    computed: {
        getValueText() {
            if (!this.$refs.caspanel && this.updateValueText) return;
            const data = this.$refs.caspanel.getDataByValue(this.model);
            const levelFn = (item) => {
                let result = [];
                if (this.showAllLevels) {
                    result = item.map((node) => (node.data.label == void 0 ? node.data.value : node.data.label));
                } else {
                    item = item[item.length - 1];
                    if (item) {
                        result = [item.data.label == void 0 ? item.data.value : item.data.label];
                    }
                }
                return result.join(" / ");
            };
            if (this.selection === "multiple") {
                return data.map(levelFn);
            }
            return levelFn(data);
        },
    },
    methods: {
        getDataByValue(data = this.model) {
            if (!this.$refs.caspanel) return;
            return this.$refs.caspanel.getDataByValue(data);
        },
        handleKeydown(event) {
            if (event.keyCode === 13) {
                if (this.__model) {
                    this.updateModel(this.__model);
                    this.__model = null;
                }
                this.visible = false;
            }
            if (this.selection === "multiple" && event.keyCode === 46 && !event.target.value) {
                this.handleClearTag(this.model.length - 1);
            }
        },
        handleChange(val) {
            this.updateModel(val);
            if (this.autoClose) {
                this.visible = false;
            }
        },
        handleSearch(val) {
            this.__model = val;
        },
        handleInput(event) {
            const value = event.target.value || "";
            this.visible = true;
            if (!value && this.selection !== "multiple") this.updateModel([]);
            this.$refs.caspanel && this.$refs.caspanel.handleSearch(value.split("/"));
        },
        handleBlur(event) {
            if (this.__model) {
                this.updateModel(this.__model);
                this.__model = null;
            }
            this.$nextTick(() => {
                this.updateValueText += 1;
                this.$emit("on-change", this.model, event);
                this.$emit("on-blur", this.model, event);
                this.handleDispatch("on-validate", this.model);
            });
        },
        handleFocus(event) {
            this.$emit("on-focus", this.model, event);
        },
        handleClearTag(index) {
            const data = [...this.model];
            const item = data.splice(index, 1);
            this.updateModel(data);
            this.$refs.dropBase.cancelChange();
            this.$emit("on-remove-item", item, index);
        },
        handleClear() {
            this.updateModel([]);
            this.$refs.dropBase.cancelChange();
            this.$emit("on-clear");
        },
        updateModel(val) {
            if (val === this.model) return;
            if (!val) val = [];
            if (!Array.isArray(val)) val = [val];
            if (this.selection === "multiple" && val[0] != null && !Array.isArray(val[0])) val = [val];
            this.model = val;
            this.$emit("input", this.model);
            this.handleDispatch("on-change", this.model);
        },
        handleVisible(val) {
            this.updateValueText += 1;
            this.$emit("on-visible-change", val);
            clearTimeout(this.__caspanelTime);
            this.$nextTick(() => {
                if (this.selection === "multiple") this.$refs.inputBase.getInputDom().value = "";
                this.__caspanelTime = setTimeout(() => {
                    this.$refs.caspanel && (this.$refs.caspanel.flatFilterData = null);
                }, 200);
            });
        },
        updatedDrop() {
            this.$nextTick(() => {
                this.$refs.dropBase.updatedDrop();
            });
        },
    },
    watch: {
        value: {
            deep: true,
            handler(val) {
                this.updateModel(val);
            },
        },
    },
    beforeDestroy() {
        clearTimeout(this.__caspanelTime);
        this.__caspanelTime = null;
    },
};
</script>
