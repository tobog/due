<template>
	<form :data-vue-module="$options.name" @submit.prevent="submit">
		<slot></slot>
		<!-- 防止单个表单出现 enter 提交 -->
		<input type="hidden"/>
	</form>
</template>

<script>
export default {
	name: 'Forms',
	props: {
		rules: Object,
		labelWidth: [Number, String],
		inline: Boolean,
		errorInview: {
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
		submit(...args) {
			this.$emit('on-submit', ...args)
		},
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
				if (!len) return resolve(true);
				const hasScrollIntoView = this.errorInview && !!this.$el.scrollIntoView;
				this.FormItems.forEach(item => {
					item.validate(undefined, errors => {
						const prevalid = valid;
						if (errors) valid = false;
						if (hasScrollIntoView && valid != prevalid) item.$el.scrollIntoView({
							behavior: "smooth",
							block: "center",
							// inline:"center"
						});
						if (++count === len) {// all finish
							resolve(valid);
							isfun && callback(valid);
						}
					});
				});
			});
		},
		async validateField(prop, cb) {
			const item = this.FormItems.find(item => item.prop === prop);
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
			try {
				if (JSON.stringify(val) === JSON.stringify(old)) return;
				this.validate();
			} catch (error) {

			}
		},
	},
};
</script>
