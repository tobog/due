<template>
	<ul v-if="data && data.length" :class="[_tobogPrefix_]">
		<li
			v-for="(item, index) in data"
			:key="index"
			:class="itemClasses(item)"
			@click="select(item)"
			@mouseenter.stop="hover(item)"
		>
			<Render
				v-if="getRender(item.data)"
				:render="getRender(item.data)"
				:index="index"
				:data="item"
			></Render>
			<template v-else>
				{{ item.data.label }}
			</template>
			<Icons
				v-if="hasChildren(item)"
				type="ios-arrow-forward"
				size="1.2em"
				:class="[_tobogPrefix_ - '-icon']"
			/>
			<Icons
				v-else-if="item.loading"
				type="loading"
				size="1.2em"
				:class="[_tobogPrefix_ - '-icon']"
			/>
		</li>
	</ul>
</template>
<script>
	import Icons from "../icons/index";
	import Render from "./render";
	export default {
		name: "Caspanel",
		components: {
			Icons,
			Render
		},
		props: {
			data: {
				type: Array,
				default() {
					return [];
				}
			},
			modelList: {
				type: Array,
				default() {
					return [];
				}
			},
			index: {
				// type: Number,
				default: 0
			},
			trigger: String
		},
		// data() {
		// 	return {};
		// },
		methods: {
			getRender(item) {
				const render = item.render;
				return typeof render === "function" ? render : false;
			},
			itemClasses(item) {
				const _tobogPrefix_ = this._tobogPrefix_,
					data = this.modelList[this.index] || {};
				return [
					`${_tobogPrefix_}-item`,
					{
						[`${_tobogPrefix_}-item-active`]: data.index === item.index
					}
				];
			},
			select(item) {
				this.$emit("on-select", item, this.index);
			},
			hover(item) {
				if (this.trigger === "hover" && this.hasChildren(item))
					this.select(item);
			},
			hasChildren(item) {
				return item.childIndexs && item.childIndexs.length > 0;
			}
		}
	};
</script>
