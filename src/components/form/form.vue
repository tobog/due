<template>
	<form :data-vview-module="$options.name" v-bind="$attrs">
		<slot></slot>
		<!-- 防止单个表单出现 enter 提交 -->
		<input type="hidden"/>
	</form>
</template>

<script>
export default {
	name: 'Forms',
	inheritAttrs: false,
	props: {
		rules: Object,
		labelWidth: [Number, String],
		inline: Boolean,
		errorinview: {
			type: Boolean,
			default: true
		}
	},
	data() {
		return {
			FormItems: [],
		};
	},
	created() {
		this.$on('on-form-item-add', this.addItem);
		this.$on('on-form-item-remove', this.reomveItem);
	},
	methods: {
		addItem(item) {
			this.FormItems.push(item);
		},
		reomveItem(item) {
			let index = this.FormItems.indexOf(item);
			if (index > -1) this.FormItems.splice(index, 1);
		},
		validate(callback) {
			return new Promise(resolve => {
				let valid = true, len = this.FormItems.length, isfun = typeof callback == 'function', count = 0;
				if (!len) {
					resolve(true);
				} else {
					const hasScrollIntoView=this.errorinview&&!!this.$el.scrollIntoView;
					this.FormItems.forEach(item => {
						item.validate(undefined, errors => {
							const prevalid = valid;
							if (errors) valid = false;
							if (hasScrollIntoView && valid != prevalid) item.$el.scrollIntoView({
								// behavior: "smooth",
								block: "center",
								// inline:"center"
							});
							if (++count === len) {// all finish
								resolve(valid);
								if (isfun) callback(valid);
							}
						});
					});
				}
			});
		},
		async validateField(prop, cb) {
			const item = this.FormItems.filter(item => item.prop === prop)[0];
			if (!item) throw `[warn]:the prop of the FormItem Component must equals  ${prop} as child.prop!`;
			return item.validate(undefined, cb);
		},
		async resetValidate() {
			this.FormItems.forEach(item => {
				item.resetValidate();
			});
		},
	},
	watch: {
		rules(val, old) {
			if (JSON.stringify(val) == JSON.stringify(old)) return;
			this.validate();
		},
	},
};
</script>
