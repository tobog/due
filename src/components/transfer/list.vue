
<template>
	<section :class="wrapClasses" :data-vue-module="$options.name">
		<div :class="[_tobogPrefix_ + '-header']">
			<Checkbox :value="isCheckedAll" :disabled="isDisabledAll" @on-change="toggleSelectAll"></Checkbox>
			<div :class="[_tobogPrefix_ + '-title']" v-html="title"></div>
			<span :class="[_tobogPrefix_ + '-count']">{{ count }}</span>
		</div>
		<div :class="[_tobogPrefix_ + '-search']" v-if="filterable">
			<Input clearable v-model="query" />
		</div>
		<ul
			:class="[_tobogPrefix_ + '-content']"
			:draggable="draggable&&checkedData.length>0"
			@dragstart="handleDrag"
			@dragover.stop.prevent
			@drop.stop.prevent="handleDrag"
			@dragend.stop.prevent="handleDrag"
		>
			<li
				v-for="(item, index) in filterData"
				:key="index"
				:class="itemClasses(item)"
				@click.prevent="select(item)"
			>
				<Checkbox :value="isChecked(item)" readonly :disabled="item.disabled"></Checkbox>
				<div>{{ renderFormat(item)}}</div>
			</li>
		</ul>
		<aside :class="[_tobogPrefix_ + '-footer']" v-if="showFooter">
			<slot></slot>
		</aside>
	</section>
</template>

<script>
import Checkbox from "../checkbox/index";
import Input from "../input/index";
// import Render from "../render";

export default {
	name: "TransferList",
	inheritAttrs: false,
	components: {
		Checkbox,
		Input,
		// Render
	},
	props: {
		draggable: Boolean,
		identifier: {
			type: String,
			default: "key"
		},
		keys: {
			type: Array,
			default() {
				return [];
			}
		},
		data: {
			type: Object,
			default() {
				return {};
			}
		},
		index: Number,
		checkedKeys: Array,
		title: String,
		renderFormat: {
			type: Function,
			default(item) {
				if (item.label !== void 0) return item.label;
				if (item.title !== void 0) return item.title;
				if (item.name !== void 0) return item.name;
				return item;
			}
		},
		// format:{
		// 	type:String,
		// 	default:'{{label||title||name}}'
		// },
		filterable: Boolean,
		strict: Boolean,
		filterMethod: {
			type: Function,
			default(item = {}, query) {
				if (!(query || query == "0")) return true;
				const text = this.renderFormat(item);
				return new RegExp(query, "i").test(text);
			}
		}
	},
	data() {
		return {
			query: "",
			checkedData: []
		};
	},
	watch: {
		checkedKeys: {
			// deep: true,
			immediate: true,
			handler(val) {
				if (val === this.checkedData) return;
				this.checkedData = val || [];
			}
		},
		keys() {
			this.query = "";
			if (this.checkedData.length > 0) return;
			this.checkedData = [];
		}
	},
	computed: {
		showFooter() {
			return !!this.$slots.default;
		},
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [_tobogPrefix_];
		},
		count() {
			const validCount = this.getValidData.length;
			return (
				(validCount > 0 ? `${validCount}/` : "") + `${this.keys.length}`
			);
		},
		isCheckedAll() {
			const validCount = this.getValidData.length;
			return (
				this.filterData.filter(item => !item.disabled).length ==
				validCount && validCount != 0
			);
		},
		isDisabledAll() {
			return this.filterData.filter(item => !item.disabled).length <= 0;
		},
		filterData() {
			const list = [],
				data = this.data || {};
			this.keys.filter(key => {
				const item = data[key];
				if (!item) return;
				if (!this.filterable) {
					list.push(item);
					return;
				}
				if (this.filterMethod(item, this.query)) {
					list.push(item);
				}
			});
			return list;
		},
		getValidData() {
			const identifier = this.identifier;
			return this.filterData.filter(
				item =>
					!item.disabled &&
					this.getCheckedIndex(item[identifier]) > -1
			);
		},

	},
	methods: {
		handleDrag(e) {
			if (!this.draggable) return;
			this.$emit('on-drag-data', e.type, this.index)
		},
		getCheckedIndex(data) {
			const strict = this.strict;
			return this.checkedData.findIndex(value => {
				return strict ? value === data : value == data
			});
		},
		isChecked(item) {
			return this.getCheckedIndex(item[this.identifier]) > -1;
		},
		itemClasses(item) {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-item`,
				{
					[`${_tobogPrefix_}-active`]: this.isChecked(item),
					[`${_tobogPrefix_}-disabled`]: item.disabled
				}
			];
		},
		select(item) {
			if (item.disabled) return;
			const checkedData = this.checkedData,
				data = item[this.identifier],
				index = this.getCheckedIndex(data);
			index > -1 ? checkedData.splice(index, 1) : checkedData.push(data);
			this.$emit("on-check-change", checkedData, this.index);
		},
		toggleSelectAll(status) {
			const identifier = this.identifier;
			let keys = [];
			if (status) {
				keys = this.filterData.filter(
					item =>
						!item.disabled ||
						this.getCheckedIndex(item[identifier]) > -1
				);
			} else {
				keys = this.filterData.filter(
					item =>
						item.disabled &&
						this.getCheckedIndex(item[identifier]) > -1
				);
			}
			keys = keys.map(item => item[identifier]);
			this.checkedData = keys;
			this.$emit("on-check-change", keys, this.index);
		},
	}
};
</script>
