<template>
	<div :class="classes">
		<slot></slot>
	</div>
</template>
<script>
	export default {
		name: "TabPanel",
		inject: ["$RootTabsInstance"],
		props: {
			name: {
				type: String
			},
			label: {
				type: [String, Function],
				default: ""
			},
			icon: {
				type: String
			},
			disabled: {
				type: Boolean,
				default: false
			},
			closable: {
				type: Boolean,
				default: null
			},
			// Tabs 嵌套时，用 tab 区分层级，指向对应的 Tabs 的 name
			tab: {
				type: String
			},
			// 在 TabPane 使用 v-if 时，并不会按照预先的顺序渲染，这时可设置 index，并从小到大排序
			// 数值需大于 0
			index: {
				type: Number
			}
		},
		data() {
			return {
				// show: true,
				currentName: this.name
			};
		},
		computed: {
            classes(){
              	const  _tobogPrefix_ = this._tobogPrefix_;
				return [
					_tobogPrefix_,
					{
						[`${_tobogPrefix_}-active`]: this.$RootTabsInstance.activeKey === this.currentName
					}
				];
            },
		},
		methods: {
			updateNav() {
				this.$RootTabsInstance.updateNav();
			}
		},
		watch: {
			name(val) {
				this.currentName = val;
				this.updateNav();
			},
			label() {
				this.updateNav();
			},
			icon() {
				this.updateNav();
			},
			disabled() {
				this.updateNav();
			}
		},
		mounted() {
			this.updateNav();
		},
		beforeDestroy() {
			this.updateNav();
		}
	};
</script>
