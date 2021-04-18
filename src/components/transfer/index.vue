

<template>
	<section :class="[_tobogPrefix_]" :data-vue-module="$options.name">
		<template v-for="(key, index) in getGroup">
			<aside
				v-if="index != 0"
				:class="[_tobogPrefix_ + '-operate']"
				:key="'operate' + index"
			>
				<span
					:class="handleOperateClasses(index, true)"
					@click="transferTo(index, true)"
				>
					<Icons type="ios-arrow-back" />
				</span>
				<span
					:class="handleOperateClasses(index, false)"
					@click="transferTo(index, false)"
				>
					<Icons type="ios-arrow-forward" />
				</span>
			</aside>
			<List
				:key="index"
				:index="index"
				:draggable="draggable"
				:data="dataSource"
				:strict="strict"
				:keys="pendingKeys[index]"
				:title="titles[index]"
				:identifier="getIdentifier"
				:renderFormat="renderFormat"
				:checkedKeys="checkedKeys[index]"
				:style="listStyle"
				:filterable="filterable"
				:filterMethod="filterMethod"
				@on-check-change="updateCheckedKeys"
				@on-drag-data="handleDragData"
			>
				<slot></slot>
			</List>
		</template>
		<input
			type="hidden"
			v-if="name || name == '0'"
			:value="value"
			:name="name"
		/>
	</section>
</template>
 
 <script>
	import List from "./list.vue";
	import Button from "../button/index";
	import Icons from "../icons/src/index";
	import Emitter from "../../utils/emitter";

	export default {
		name: "Transfer",
		mixins: [Emitter],
		components: {
			List,
			Button,
			Icons
		},
		props: {
			name: String,
			originIndex: {
				type: Number,
				default: 0
			},
			titles: {
				type: Array,
				default() {
					return ["源列表", "目的列表"];
				}
			},
			value: {
				type: Array,
				default() {
					return [];
				}
			},
			group: {
				type: Number,
				default: 1
			},
			data: {
				type: Array,
				default() {
					return [];
				}
			},
			identifier: {
				type: String,
				default: "key"
			},
			selectedKeys: {
				type: Array,
				default() {
					return [];
				}
			},
			strict: {
				type: Boolean,
				default: false
			},
			renderFormat: {
				type: Function,
				default(item) {
					if (item.label !== void 0) return item.label;
					if (item.title !== void 0) return item.title;
					if (item.name !== void 0) return item.name;
					return item;
				}
			},
			filterable: {
				type: Boolean,
				default: false
			},
			filterMethod: {
				type: Function,
				default(item = {}, query) {
					if (!(query || query == "0")) return true;
					const text = this.renderFormat(item);
					return new RegExp(query, "i").test(text);
				}
			},
			listStyle: [Object, String],
			draggable: Boolean
		},
		data() {
			return {
				pendingKeys: [],
				checkedKeys: [],
				dataSource: {},
				dataKeys: [],
				pendingData: []
			};
		},
		created() {
			this.initWatch(this.getGroup);
			this.initSelectedKeys();
			this.handleValue(this.value);
			this.initDataObj();
			this.initTransferData();
		},
		computed: {
			getOriginIndex() {
				return this.group < this.originIndex
					? parseInt(this.group || 0)
					: parseInt(this.originIndex || 0);
			},
			getGroup() {
				return parseInt(this.group) + 1;
			},
			isGroup() {
				return this.getGroup > 2;
			},
			getIdentifier() {
				return this.identifier === void 0 ? "key" : this.identifier;
			}
		},
		methods: {
			initWatch(length) {
				for (let index = 0; index < length; index++) {
					this.$set(this.checkedKeys, index, []);
					this.$set(this.pendingKeys, index, []);
					this.$set(this.pendingData, index, []);
				}
			},
			initSelectedKeys() {
				if (this.isGroup) {
					this.checkedKeys = [...this.selectedKeys];
				} else {
					this.$set(this.checkedKeys, this.getOriginIndex, [
						...this.selectedKeys
					]);
				}
			},
			initDataObj() {
				const obj = {},
					dataKeys = [],
					identifier = this.getIdentifier;
				this.data.forEach(item => {
					const key = item[identifier];
					dataKeys.push(key);
					obj[key] = { ...item };
				});
				this.dataSource = obj;
				this.dataKeys = dataKeys;
			},
			initTransferData() {
				const originIndex = this.getOriginIndex,
					otherKeys = [];
				this.pendingKeys.forEach((item, index) => {
					if (index != originIndex) otherKeys.push(...item);
				});
				const sourceKey = this.dataKeys.filter(key => {
					return this.hasKeys(key, otherKeys) == -1;
				});
				this.pendingKeys[originIndex] = sourceKey;
			},
			hasKeys(val, keys) {
				const strict = this.strict;
				return keys.findIndex(value => {
					return strict ? value === val : value == val;
				});
			},
			isTranfer(index) {
				return (this.checkedKeys[index] || []).length > 0;
			},
			handleOperateClasses(index, isToLeft) {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					`${_tobogPrefix_}-bar`,
					{
						[`${_tobogPrefix_}-bar-active`]: this.isTranfer(
							isToLeft ? index : index - 1
						)
					}
				];
			},
			handleKeysToObj(list) {
				const obj = {};
				list.forEach(item => {
					obj[item] = item;
				});
				return obj;
			},
			updateCheckedKeys(keys, index) {
				this.$set(this.checkedKeys, index, keys);
				this.$emit("on-selected-change", keys, index, this.checkedKeys);
			},
			handleDragData(type, index) {
				if (type === "dragstart") {
					this.__dragIndex__ = index + "";
					return;
				}
				const dragIndex = this.__dragIndex__;
				if (type === "drop" && dragIndex && index != dragIndex) {
					const indexKeys = this.checkedKeys[dragIndex] || [],
						targetKeys = this.pendingKeys[index] || [],
						curPendingKeys = this.pendingKeys[dragIndex];
					this.$set(
						this.pendingKeys,
						index,
						targetKeys.concat(indexKeys)
					);
					this.$set(
						this.pendingKeys,
						dragIndex,
						curPendingKeys.filter(val => {
							return this.hasKeys(val, indexKeys) == -1;
						})
					);
					this.$set(this.checkedKeys, dragIndex, []);
					this.updateValue(indexKeys, index, dragIndex);
				}
				this.__dragIndex_ = null;
			},
			transferTo(index, isToLeft) {
				let indexKeys;
				if (isToLeft) {
					indexKeys = this.checkedKeys[index] || [];
					if (!indexKeys.length) return;
					const leftPendingKeys = this.pendingKeys[index - 1] || [],
						curPendingKeys = this.pendingKeys[index];
					this.$set(
						this.pendingKeys,
						index - 1,
						leftPendingKeys.concat(indexKeys)
					);
					this.$set(
						this.pendingKeys,
						index,
						curPendingKeys.filter(val => {
							return this.hasKeys(val, indexKeys) == -1;
						})
					);
					this.$set(this.checkedKeys, index, []);
				} else {
					indexKeys = this.checkedKeys[index - 1] || [];
					if (!indexKeys.length) return;
					const rightPendingKeys = this.pendingKeys[index] || [],
						curPendingKeys = this.pendingKeys[index - 1];
					this.$set(
						this.pendingKeys,
						index,
						rightPendingKeys.concat(indexKeys)
					);
					this.$set(
						this.pendingKeys,
						index - 1,
						curPendingKeys.filter(val => {
							return this.hasKeys(val, indexKeys) == -1;
						})
					);
					this.$set(this.checkedKeys, index - 1, []);
				}
				this.updateValue(
					indexKeys,
					isToLeft ? index - 1 : index,
					isToLeft ? index : index - 1
				);
			},
			handleValue(val) {
				val = Array.isArray(val) ? val : [];
				if (this.isGroup) {
					this.pendingKeys = [...val];
				} else {
					this.$set(
						this.pendingKeys,
						this.getOriginIndex == 1 ? 0 : 1,
						val
					);
				}
			},
			updateValue(indexKeys, tragetIndex, originIndex) {
				if (!this.isGroup) {
					const pendingKeys = this.pendingKeys;
					const index = this.getOriginIndex == 1 ? 0 : 1;
					this.$emit("input", pendingKeys[index]);
				} else {
					this.$emit("input", this.pendingKeys);
				}
				this.$emit(
					"on-transfer",
					indexKeys,//移动的key
					tragetIndex,//去到transferlist 
					this.pendingKeys,//各自的transferlist 的keys
					originIndex//源头transferlist
				);
				this.handleDispatch(
					"on-change",
					indexKeys,
					tragetIndex,
					this.pendingKeys,
					originIndex
				);
			},
			handleDispatch(...args) {
				if (this.__parentComponent__) {
					this.__parentComponent__.$emit(...args);
				} else {
					this.__parentComponent__ = this.dispatch("FormItem", ...args);
				}
			}
		},
		watch: {
			value(val) {
				if (val === this.pendingKeys) return;
				this.handleValue(val);
			},
			data(val) {
				this.initDataObj();
				this.initTransferData();
			},
			selectedKeys() {
				this.initSelectedKeys();
			}
		}
	};
</script>
 