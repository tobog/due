<template>
	<div :class="wrapClasses" :data-vview-module="$options.name">
		<NoticeBase v-for="notice in notices" :key="notice.name" v-bind="notice"></NoticeBase>
	</div>
</template>

<script>
import NoticeBase from './notice.vue';

export default {
	name: 'Notification',
	components: {
		NoticeBase
	},
	data() {
		return {
			notices: [],
		};
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-mask`]: this.hasMask
				}
			]
		},
		hasMask() {
			return this.notices.some((notice) => {
				return notice.mask;
			})
		}
	},
	methods: {
		add(notice = {}) {
			this.nameLength = (this.nameLength || 0) + 1;
			notice.name = notice.name || `${this._uid}${this.nameLength}`;
			this.notices.push({
				...notice
			});
			return notice.name;
		},
		remove(name, isTheme) {
			const notices = this.notices,
				key = isTheme ? 'theme' : 'name';
			this.notices = notices.filter(item => {
				return item[key] !== name;
			});
		},
		destory() {
			this.notices = [];
		},
	},
};
</script>
