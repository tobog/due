<template>
	<a
		:class="[_tobogPrefix_]"
		:href="href"
		:data-target="target"
		@click.prevent="goAnchor"
		:title="title"
	>
		<slot>{{ title }}</slot>
	</a>
</template>
<script>

export default {
	name: 'Anchor',
	props: {
		href: String,
		title: String,
		target: String,
	},
	// data() {
	// 	return {

	// 	};
	// },
	mounted() {
		this.$nextTick(() => {
			this.gotTargetAnchor(localStorage[`${this.__$cssPrefix__}_Anchor_${this.target}`] && this.target);
		})
	},
	methods: {
		goAnchor() {
			const href = this.href;
			if (href) {
				this.$emit('on-select', href);
				if (this.target) {
					localStorage[`${this.__$cssPrefix__}_Anchor_${this.target}`] = this.target;
				}
				if (this.$router) {
					this.$router.push(href);
				} else {
					window.location.href = href;
				}
				return;
			}
			this.gotTargetAnchor(this.target);
		},
		gotTargetAnchor(target) {
			if (target) {
				const ele = document.querySelector(target) || document.querySelector(`#${target}`) || document.querySelector(`.${target}`);
				ele && ele.scrollIntoView({
					behavior: "smooth",
					block: "center"
				});
			}
			localStorage.removeItem(`${this.__$cssPrefix__}_Anchor_${this.target}`);
		}
	},
};
</script>
