<template>
	<section :class="wrapClasses" :data-vue-module="$options.name">
		<NoticeBase v-for="notice in notices" :key="notice.name" v-bind="notice"></NoticeBase>
	</section>
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
				return notice.maskable;
			})
		}
	},
	methods: {
		add(notice = {}) {
			this._nameLen = (this._nameLen || 0) + 1;
			if (!notice.name) notice.name = `${this._uid}${this._nameLen}`
			this.notices.push({ ...notice });
			return notice.name;
		},
		remove(name, isTheme) {
			const notices = this.notices,
				key = isTheme ? 'theme' : 'name';
			this.notices = notices.filter(item => {
				return item[key] !== name;
			});
		},
		destroy() {
			this.notices = [];
		},
	},
};
</script>
