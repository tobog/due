


<template>
	<ul :class="wrapClasses" :data-vview-module="$options.name">
		<li :class="_tobogPrefix_ + '-total'" v-show="showTotal">
			<slot>{{langs('total','共 '+total+' 条',{total})}}</slot>
		</li>
		<li @click="changePage(currentPage-1)" :title="langs('pre','前一页')" v-show="total!=0">
			<slot name="pre">
				<Icons type="ios-arrow-back"></Icons>
			</slot>
		</li>

		<li v-if="simple">
			<Input
				:class="_tobogPrefix_ + '-cell-simple'"
				type="number"
				:value="currentPage"
				@on-enter="changeInput"
			/>
			&nbsp;&nbsp;/&nbsp;{{allPages}}&nbsp;
		</li>
		<template v-else>
			<template v-for="index in sortPages">
				<li
					v-if="index!=='pre'&&index!=='next'"
					:key="index"
					:class="activeClasses(index)"
					:title="index"
					@click="changePage(index)"
				>{{index}}</li>
				<li
					v-else-if="index==='pre'"
					:key="index"
					:class="activeClasses(index)"
					:title="langs('preStep','向前'+step+'页',{step})"
					@click="changePage(currentPage-step)"
				>
					<Icons type="more" :size="14" :class="_tobogPrefix_+'-more'"></Icons>
					<Icons type="ios-arrow-back" :size="14" :class="_tobogPrefix_+'-more'"></Icons>
				</li>
				<li
					v-else-if="index==='next'"
					:key="index"
					:class="activeClasses(index)"
					:title="langs('nextStep','向后'+step+'页',{step})"
					@click="changePage(currentPage+step)"
				>
					<Icons type="more" :size="14" :class="_tobogPrefix_+'-more'"></Icons>
					<Icons type="ios-arrow-forward" :size="14" :class="_tobogPrefix_+'-more'"></Icons>
				</li>
			</template>
		</template>
		<li @click="changePage(currentPage+1)" :title="langs('next','下一页')" v-show="total!=0">
			<slot name="next">
				<Icons type="ios-arrow-forward"></Icons>
			</slot>
		</li>
		<li :class="_tobogPrefix_+'-select'" v-show="showSizer&&total!=0">
			<Select v-model="currentPageSize" @on-change="changePageSize" :transfer="transfer">
				<Option
					v-for="index in pageOpts"
					:key="index"
					:value="index"
				>{{langs('onePageCount',index+'条/每页',{index})}}</Option>
			</Select>
		</li>
		<li :class="_tobogPrefix_+'-input'" v-show="showElevator&&total!=0">
			{{langs('goto','跳至')}}&nbsp;
			<Input
				type="number"
				:value="currentPage"
				@on-enter="changeInput"
				min="1"
				:max="allPages"
				style="display:inline-block;"
			/>
			&nbsp;{{langs('page','页')}}
		</li>
	</ul>
</template>

<script>
import Icons from '../icons/index';
import Select from '../select/index';
import Input from '../input/index';
import Option from '../select/option';

export default {
	name: 'Page',
	components: {
		Icons,
		Select,
		Option,
		Input,
	},
	props: {
		current: {
			type: [Number, String],
			default: 1,
		},
		total: {
			type: [Number, String],
			default: 0,
		},
		pageSize: {
			type: [Number, String],
			default: 10,
		},
		pageOpts: {
			type: Array,
			default() {
				return [10, 50, 100, 500];
			},
		},
		countPage: {
			type: Number,
			default: 8,
		},
		step: {
			type: [Number, String],
			default: 5,
		},
		showTotal: {
			type: Boolean,
			default: true,
		},
		showElevator: {
			type: Boolean,
			default: true,
		},
		showSizer: {
			type: Boolean,
			default: true,
		},
		small: {
			type: Boolean,
			default: false,
		},
		simple: {
			type: Boolean,
			default: false,
		},
		transfer: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			currentPage: this.current,
			currentPageSize: this.pageSize,
		};
	},
	watch: {
		total(val) {
			let maxPage = Math.ceil(val / this.currentPageSize);
			if (maxPage < this.currentPage && maxPage > 0) {
				this.currentPage = maxPage;
			}
		},
		current(val) {
			this.currentPage = val;
		},
		pageSize(val) {
			this.currentPageSize = val;
		},
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				{
					[`${_tobogPrefix_}-small`]: this.small,
				},
				{
					[`${_tobogPrefix_}-simple`]: this.simple,
				},
			];
		},
		allPages() {
			return Math.ceil(this.total / this.currentPageSize);
		},
		sortPages() {
			const allPages = this.allPages,
				count = this.countPage,
				current = this.currentPage,
				pages = [],
				status = this.status;

			if (allPages <= count) {
				return allPages;
			}
			if (current < count) {
				for (let i = 1; i <= count - 1; i++) {
					pages.push(i);
				}
				pages.push('next', allPages);
				return pages;
			}

			if (current > allPages - count + 1) {
				for (let i = allPages - count + 2; i <= allPages; i++) {
					pages.push(i);
				}
				pages.unshift(1, 'pre');
				return pages;
			}

			if (current > count - 1 && current < allPages - count + 2) {
				let len = count - 2;
				let init = parseInt(current - len / 2);
				for (let i = 0; i < len; i++) {
					pages.push(init + i);
				}
				pages.push('next', allPages);
				pages.unshift(1, 'pre');
				return pages;
			}
		},
	},
	methods: {
		langs(key, defaultVal, val = {}) {
			if (typeof this.$t !== 'function') return defaultVal;
			key = `${this.__$langPrefix__}.page.${key}`;
			key = (this.__$langMap__ && this.__$langMap__[key]) ? this.__$langMap__[key] : key;
			const value = this.$t(key, val)
			return key === value ? defaultVal : value;
		},
		activeClasses(index) {
			const _tobogPrefix_ = this._tobogPrefix_;
			return this.currentPage === index ? `${_tobogPrefix_}-active` : null;
		},
		changeInput(page = '') {
			if (page !== '') {
				page = parseInt(page);
				this.changePage(page);
			}
		},
		changePage(page) {
			if (page < 1) {
				page = 1;
			} else if (page > this.allPages) {
				page = this.allPages;
			}
			if (this.currentPage != page) {
				this.currentPage = page;
				this.$nextTick(() => {
					if (page === this.current && this.currentPageSize === this.pageSize) return;
					this.$emit('on-change', page, this.currentPageSize);
				})
			}
		},
		changePageSize() {
			this.$nextTick(() => {
				if (this.currentPageSize === this.pageSize) return;
				this.$emit('on-change', 1, this.currentPageSize);
				this.$emit('on-page-size-change', this.currentPageSize);
			})
		},

		keyDown(e) {
			const key = e.keyCode;
			const condition =
				(key >= 48 && key <= 57) || (key >= 96 && key <= 105) || key === 8 || key === 37 || key === 39;

			if (!condition) {
				e.preventDefault();
			}
		},
		keyUp(e) {
			const key = e.keyCode;
			const val = parseInt(e.target.value);

			if (key === 38) {
				this.prev();
			} else if (key === 40) {
				this.next();
			} else if (key === 13) {
				let page = 1;

				if (val > this.allPages) {
					page = this.allPages;
				} else if (val <= 0 || !val) {
					page = 1;
				} else {
					page = val;
				}

				e.target.value = page;
				this.changePage(page);
			}
		},
	},
};
</script>
