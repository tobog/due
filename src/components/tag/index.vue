<template>
	<section :class="classes" :style="borderColor" v-if="show">
		<span :class="dotClasses" v-if="showDot" :style="dotColor"></span>
		<span :class="textClasses">
			<slot>{{ label }}</slot>
		</span>
		<Icons
			v-if="closable"
			:class="iconClass"
			:style="iconColor"
			type="ios-close"
			@click.native="close"
		></Icons>
	</section>
</template>
<script>
	import Icons from "../icons/src/index";

	export default {
		name: "Tag",
		components: { Icons },
		props: {
			closable: {
				type: Boolean,
				default: false
			},
			ellipsis: {
				type: Boolean,
				default: false
			},
			label: String,
			color: String,
			type: {
				type: String
				// default: 'border'//border dot ""
			},
			name: [String, Number],
			size: {
				type: String
				// validator (value) {
				//     return oneOf(value, ['default', 'middle', 'large']);
				// },
				// default: 'default'
			}
		},
		data() {
			return {
				show: true
			};
		},
		computed: {
			isInnerColor() {
				return (
					[
						"confirm",
						"gray",
						"success",
						"primary",
						"warning",
						"error",
						"info",
						"danger"
					].indexOf(this.color) > -1
				);
			},
			showDot() {
				return this.type === "dot";
			},
			classes() {
				const _tobogPrefix_ = this._tobogPrefix_;
				return [
					`${_tobogPrefix_}`,
					{
						[`${_tobogPrefix_}-${this.size}`]: !!this.size,
						[`${_tobogPrefix_}-color-${this.color}`]:
							!!this.color && this.isInnerColor,
						[`${_tobogPrefix_}-${this.type}`]: !!this.type,
						[`${_tobogPrefix_}-closable`]: this.closable,
						[`${_tobogPrefix_}-ellipsis`]: this.ellipsis
					}
				];
			},
			textClasses() {
				return [`${this._tobogPrefix_}-text`];
			},
			dotClasses() {
				return `${this._tobogPrefix_}-dot-inner`;
			},
			iconClass() {
				return `${this._tobogPrefix_}-icons-close`;
			},
			borderColor() {
				if (!this.color || this.isInnerColor) return;
				if (this.type === "border") {
					return {
						color: this.color,
						borderColor: this.color
					};
				}
				if (this.type !== "dot") {
					return {
						color: "#fff",
						borderColor: this.color,
						background: this.color
					};
				}
			},
			dotColor() {
				if (!this.color || this.isInnerColor) return;
				return {
					background: this.color
				};
			},
			iconColor() {
				if (!this.color || this.isInnerColor) return;
				if (this.type === "border") {
					return {
						color: this.color
					};
				}
				if (this.type !== "dot") {
					return {
						color: "#fff"
					};
				}
			}
		},
		methods: {
			close(event) {
				this.show = false;
				this.$emit("on-close", event, this.name);
			}
		}
	};
</script>
