<style lang="scss">
.demo-form-edit {
	.vview-formitem {
		min-height: 32px;
	}
	// .vview-col {
	// 	padding-right: 10px;
	// }
}
</style>
<template>
	<vRow class="demo-form-edit">
		<template v-for="(item,index) in formdata">
			<vCol v-if="handleVisible(item)" :key="index" v-bind="getColProps(item)">
				<vFormItem v-bind="getFormItemProps(item)">
					<compRender v-for="data in getFormChildData(item)" :key="data._key" v-bind="data" />
				</vFormItem>
			</vCol>
		</template>
	</vRow>
</template>

<script>
import formmixin from "./formmixin";
export default {
	mixins: [formmixin],
	data() {
		return {
			formData: {}
		};
	},
	watch: {
		value: {
			immediate: true,
			deep: true,
			handler(val, old) {
				this.formData = val || {};
			}
		},
		formData: {
			deep: true,
			handler(val, old) {
				this.$emit("input", val);
			}
		}
	},
	created() {
		this.getFormData();
	},
	methods: {
		// getPopperProps(item) {
		// 	return {
		// 		content: item.desc,
		// 		gpu: true,
		// 		class: 'width-100per'
		// 		// popperStyle: 'max-width:unset;padding:0;'
		// 	}
		// },
		getFormData() {
			if (!Array.isArray(this.formdata)) return;
			const formData = {};
			this.formdata.forEach((item) => {
				const { key, default: value } = item;
				if (key && value !== undefined) {
					formData[key] = value;
				}
			})
			this.formData = formData;
		},
		getFormItemProps(item) {
			const { label, key, inline, labelWidth = 150, formItem } = item;
			return {
				label: `${label}(${key})`,
				inline,
				labelWidth,
				...formItem
			};
		},
		getFormChildData(item) {
			let {
				tag,
				props,
				key,
				style,
				children,
				options,
				on = {},
				class: className,
			} = item;
			if (key) {
				props = Object.assign({ clearable: true }, props, {
					value: this.formData[key]
				});
				on.input = val => {
					this.$set(this.formData, key, val);
					// this.formData = { ...this.formData, [key]: val };
				};
			}

			const hasOptions = options instanceof Array;
			if (this.isGroupFormChild(tag)) {
				className = className || 'margin-right-15';
				return hasOptions ? options.map(function (item, index) {
					return {
						tag,
						style,
						class: className,
						_key: index,
						on,
						attrs: { ...props, ...item },
						children
					}
				}) : [{
					tag,
					style,
					class: className,
					_key: 0,
					on,
					attrs: { ...props },
					children
				}]
			}
			if (hasOptions) {
				children = h => {
					return options.map(item => {
						if (item !== null && typeof item !== 'object') {
							item = { value: item, label: item }
						}
						return h("vOption", { attrs: { ...item } });
					});
				};
			}
			return [{
				tag: tag || "vInput",
				style,
				class: className,
				_key: key,
				on,
				attrs: props,
				children
			}];
		}
	}
};
</script>