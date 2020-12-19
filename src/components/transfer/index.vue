

<template>
	<div :class="wrapClasses" :data-vview-module="$options.name">
		<List
			ref="left"
			:data="leftData"
			:title="title[0]"
			:identifier="identifier"
			:renderFormat="renderFormat"
			:checkedKeys="leftCheckedKeys"
			:style="listStyle"
			:filterable="filterable"
			:filterMethod="filterFun"
			@on-check-change="handleLCKChange"
		>
			<slot></slot>
		</List>
		<div :class="opClasses">
			<Button
				:theme="rightCDCount==rightCheckedKeys.length?'default':'primary'"
				size="small"
				@click.native="transferTo('left')"
			>
				<Icons type="ios-arrow-back" />
				{{operations[0]}}
			</Button>
			<Button
				:theme="leftCDCount==leftCheckedKeys.length?'default':'primary'"
				size="small"
				@click.native="transferTo('right')"
			>
				{{operations[1]}}
				<Icons type="ios-arrow-forward" />
			</Button>
		</div>
		<List
			ref="right"
			:title="title[1]"
			:data="rightData"
			:identifier="identifier"
			:renderFormat="renderFormat"
			:checkedKeys="rightCheckedKeys"
			:style="listStyle"
			:filterable="filterable"
			:filterMethod="filterFun"
			@on-check-change="handleRCKChange"
		>
			<slot></slot>
		</List>
	</div>
</template>
 
 <script>

import List from './list.vue';
import Button from '../button/index';
import Icons from '../icons/index';
import Emitter from '../../utils/emitter';
import { deepCopy } from '../../utils/tool';

export default {
	name: 'Transfer',
	mixins: [Emitter],
	components: {
		List,
		Button,
		Icons
	},
	props: {
		title: {
			type: Array,
			default() {
				return ['源列表', '目的列表'];
			}
		},
		operations: {
			type: Array,
			default() {
				return [];
			}
		},
		data: {
			type: Array,
			default() {
				return [];
			}
		},
		renderFormat: {
			type: Function,
			default(item) {
				if (item.label !== undefined) return item.label;
				if (item.title !== undefined) return item.title;
				if (item.name !== undefined) return item.name;
				return "";
			}
		},
		targetKeys: {
			type: Array,
			default() {
				return [];
			}
		},
		identifier: {
			type: String,
			default: 'key'
		},

		selectedKeys: {
			type: Array,
			default() {
				return [];
			}
		},
		strict: {
			type: Boolean,
			default: true
		},
		filterable: {
			type: Boolean,
			default: false
		},
		filterMethod: {
			type: Function,
		},
		listStyle: [Object, String],

	},
	data() {
		return {
			leftData: [],
			rightData: [],
			leftCheckedKeys: [],
			rightCheckedKeys: [],
			leftCDCount: 0,
			rightCDCount: 0,
			cloneData: deepCopy(this.data)
		};
	},
	mounted() {
		this.splitData(true);
	},
	computed: {
		filterFun() {
			return this.filterMethod || ((data = {}, query) => {
				if (query === '' && query === undefined) return true;
				const text = this.renderFormat(data).toLowerCase();
				return `${text}`.trim().indexOf(query) > -1;
			})
		},
		wrapClasses() {
			return this._tobogPrefix_;
		},
		opClasses() {
			return `${this._tobogPrefix_}-operate`
		},
	},
	methods: {
		splitData(init = false) {
			const identifier = this.identifier,
				leftData = [],
				rightData = [],
				strict = this.strict,
				targetKeys = this.targetKeys;
			this.cloneData.forEach((item) => {
				const val = item[identifier],
					selected = targetKeys.some((value) => {
						return strict ? val === value : val == value;
					});
				if (selected) {
					rightData.push(item);
				} else {
					leftData.push(item);
				}
			});
			this.leftData = leftData;
			this.rightData = rightData;
			if (init) {
				this.splitSelectedKey();
			}
		},
		splitSelectedKey() {
			let selectedKeys = this.selectedKeys,
				identifier = this.identifier,
				leftCDCount = 0,
				rightCDCount = 0,
				strict = this.strict;
			if (selectedKeys.length > 0) {
				this.leftCheckedKeys = this.leftData.filter(
					item => {
						const val = item[identifier],
							selected = targetKeys.some((value) => {
								return strict ? val === value : val == value;
							});
						if (selected && item.disabled) {
							leftCDCount++;
						}
						return selected;
					}
				).map(
					item => item[identifier]
				);
				this.rightCheckedKeys = this.rightData.filter(
					item => {
						const val = item[identifier],
							selected = targetKeys.some((value) => {
								return strict ? val === value : val == value;
							});
						if (selected && item.disabled) {
							rightCDCount++;
						}
						return selected;
					}
				).map(
					item => item[identifier]);
			};
			this.leftCDCount = leftCDCount;
			this.rightCDCount = rightCDCount;
		},
		transferTo(type) {
			const targetKeys = this.targetKeys,
				direction = type === 'left' ? 'left' : 'right',
				transferKeys = direction === 'right' ? this.leftCheckedKeys : this.rightCheckedKeys,
				newKeys = direction === 'right' ? transferKeys.concat(targetKeys) : targetKeys.filter(
					key => transferKeys.indexOf(key) == -1
				),
				component = this.$refs[direction === 'left' ? 'right' : 'left'];
			component.query = '';
			component.toggleSelectAll(false);
			this.$emit('on-transfer', newKeys, direction, transferKeys);
			this.handleDispatch('on-change', newKeys, direction, transferKeys);
		},
		handleLCKChange(keys) {
			this.leftCheckedKeys = keys;
			this.$emit('on-selected-change', keys, this.rightCheckedKeys);
		},
		handleRCKChange(keys) {
			this.rightCheckedKeys = keys;
			this.$emit('on-selected-change', this.leftCheckedKeys, keys);
		},
		handleDispatch(type, val) {
			if (this.__formItemComponent__) {
				this.__formItemComponent__.$emit(...arguments)
			} else {
				this.__formItemComponent__ = this.dispatch('FormItem', ...arguments)
			}
		},

	},
	watch: {
		targetKeys() {
			this.splitData(false);
		},
		data(val) {
			this.cloneData = deepCopy(val);
			this.splitData(false);
		}
	},

};


</script>
 