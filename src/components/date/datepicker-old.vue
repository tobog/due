
<template>
	<section :data-vue-module="$options.name" @keydown.stop="handleKeydown">
		<InputBase
			dropStyle="max-height:initial; padding: 0;overflow: hidden;width:auto;"
			ref="input"
			tip
			suffix="ios-calendar-outline"
			:value="model"
			:filterable="true"
			:autoClose="false"
			:keyModal="false"
			v-bind="$attrs"
			@input="handleInput"
			@on-focus="handleFocus"
			@on-clear="handleClear"
			@on-blur="handleBlur"
			@on-change="handleChange"
			@on-visible-change="handleVisible"
			@on-icon-click="handleIconClick"
		>
			<div :class="dropWrapClasses" :key="formats" @click.stop>
				<aside :class="[_tobogPrefix_+'-aside']" v-if="shortcuts.length>0">
					<div
						v-for="(item,index) in shortcuts"
						@click.stop="handleShortcuts(item)"
						:class="[_tobogPrefix_+'-shortcut']"
						:key="index"
						v-html="item.text"
					></div>
				</aside>
				<DateBase
					ref="ref0"
					index="0"
					:visible="visible"
					:class="[_tobogPrefix_+'-date']"
					:multiple="multiple"
					:range="range"
					:format="formats"
					:showWeek="showWeek"
					:weeks="weeks"
					:startDate="startDates[0]"
					@on-selected="selected"
					@on-sync-update="handleCalendar"
					:value="dates"
					:disableMethod="disableMethod"
				/>
				<DateBase
					v-if="range"
					ref="ref1"
					index="1"
					:visible="visible"
					:class="[_tobogPrefix_+'-date']"
					:multiple="multiple"
					:range="range"
					:format="formats"
					:showWeek="showWeek"
					:weeks="weeks"
					:startDate="startDates[1]"
					@on-selected="selected"
					@on-sync-update="handleCalendar"
					:value="dates"
					:disableMethod="disableMethod"
				/>
			</div>
			<aside v-if="confirm||hasDateTimes" :class="[_tobogPrefix_+'-footer']">
				<Button
					v-if="hasDateTimes"
					@click="syncStatus(status==='times'?'day':'times')"
					theme="text"
					size="small"
				>{{status==='times'?langs('datepicker.selectDate','选择日期'):langs('datepicker.selectTime','选择时间')}}</Button>
				<Button
					v-if="confirm"
					style="float:right;margin-left:8px;"
					size="small"
					theme="primary"
					@click="close"
				>{{langs('datepicker.confirm','确定')}}</Button>
				<Button
					v-if="confirm"
					style="float:right;"
					size="small"
					@click="handleClear"
				>{{langs('datepicker.clear','清除')}}</Button>
			</aside>
		</InputBase>
	</section>
</template>

<script>
import DateBase from "./base";
import InputBase from '../input/index';
import Button from '../button/index';
import Dates from '../../utils/dates'
import langMinix from '../../mixins/lang'
export default {
	name: "DatePicter",
	inheritAttrs: false,
	mixins: [langMinix],
	components: {
		DateBase,
		InputBase,
		Button
	},
	props: {
		type: {
			type: String,
			default: 'datetime',
		},
		value: {
			type: [String, Array, Date],
			default: '',
		},
		format: {
			type: String,
			default: '',
		},
		confirm: {
			type: Boolean,
			default: true,
		},
		options: {
			type: Object,
			default() {
				return {}
			},
		},
		multiple: {
			type: Boolean,
			default: false,
		},
		showWeek: {
			type: Boolean,
			default: false,
		},
		startDate: {
			type: [String, Date, Object, Number],
			default() {
				return Date.now()
			},
		},
		weeks: Array,
		disableMethod: Function
	},

	data() {
		return {
			visible: false,
			dates: this.value,
			model: this.value,
			status: 'day',
			startDates: [0, 0],
		};
	},
	created() {
		this.initStatus();
	},
	computed: {
		hasDateTimes() {
			return /d.*(H|M|S)+/g.test(this.formats);
		},
		shortcuts() {
			return (this.options || {}).shortcuts || []
		},
		range() {
			const format = this.format, type = this.type;
			if (format) {
				let objIndex = { y: 0, m: 0, d: 0, H: 0, M: 0, S: 0 },
					range = false,
					str = format.replace(/(y|m|d|H|M|S)+/g, function (match, reg, offset, str) {
						if (objIndex[reg] >= 1) range = true;
						objIndex[reg] += 1;
						return match;
					});
				return range;
			}
			switch (type) {
				case 'daterange':
				case 'datetimerange':
				case 'timesrange':
				case 'hoursrange': return true; break;
				default: return false;
			}
		},
		formats() {
			if (this.format) return this.format;
			return Dates.formats(this.type);
		},
		dropWrapClasses() {
			return `${this._tobogPrefix_}-drop-wrapper`
		},
	},
	methods: {
		initStatus() {
			let format = this.formats;
			if (format.indexOf('dd') > -1) {
				this.status = 'day';
			} else if (format.indexOf('mm') > -1) {
				this.status = 'month';
			} else if (format.indexOf('yy') > -1) {
				this.status = 'year';
			}
			this.curIndex = 0;
			this.__dateData = "";
			this.handleSiblingDates(this.status, this.startDate);
		},
		handleKeydown(e) {
			const keyCode = e.keyCode;
			if ([37, 38, 39, 40, 13].indexOf(keyCode) === -1) return;
			const ref = this.$refs[`ref${this.curIndex}`];
			if (ref) {
				ref.handleKeydown(e);
				if (keyCode != 13 && this.range) {
					this.handleCalendar({
						index: this.curIndex,
						date: ref.foucsDate,
						dates: ref.dates,
						direction: (keyCode == 37 || keyCode == 38) ? 'pre' : 'next'
					}, 'calendar')
				}
			}
		},
		handleVisible() {
			this.visible = !this.visible;
		},
		syncStatus(status) {
			if (status) {
				this.status = status;
				const ref0 = this.$refs.ref0,
					ref1 = this.$refs.ref1;
				if (ref0) ref0.status = status;
				if (ref1) ref1.status = status;
			}
		},
		handleCalendar(data = {}, type) {
			const { status, index = 0, date, dates, direction } = data;
			const ref0 = this.$refs.ref0,
				ref1 = this.$refs.ref1;
			this.curIndex = index;
			if (type === 'range') {
				if (ref0) ref0.rangeDate = date;
				if (ref1) ref1.rangeDate = date;
			}
			if (type === 'calendar') {
				this.syncStatus(status);
				if (ref0) {
					if (index == 0) {
						ref0.foucsDate = date;
					}
					ref0.dates = dates;
				}
				if (ref1) {
					if (index == 1) {
						ref1.foucsDate = date;
					}
					ref1.dates = dates;
				}
				if (ref0 && ref1) {
					let focusDate0 = ref0.foucsDate, focusDate1 = ref1.foucsDate;
					let interval, status;
					let validYear = focusDate1.year - focusDate0.year;
					let isPre = direction === 'pre' && index == 1;
					let isNext = direction === 'next' && index == 0;
					if (this.status === 'year' && validYear < 1) {
						if (isPre) interval = -10;
						if (isNext) interval = 10;
					}

					if (this.status === 'month' && validYear < 1) {
						if (isPre) interval = -1;
						if (isNext) interval = 1;
						status = 'year'
					}

					if (this.status === 'day' && validYear < 0) {
						if (isPre) interval = -1;
						if (isNext) interval = 1;
						status = 'year'
					}

					if (this.status === 'day' && validYear == 0 && focusDate1.month <= focusDate0.month) {
						if (isPre) interval = -1;
						if (isNext) interval = 1;
						status = 'day';
					}
					if (status && interval) {
						this.handleSiblingDates(status, date, interval);
					}
				}
			}
		},
		/**
		 * 计算隔离时间
		 */
		handleSiblingDates(status, date, interval = 1) {
			const instance = Dates.New(date);
			const cloneDate = new Date(instance);
			const dateMap = {
				year: 'FullYear',
				month: 'FullYear',
				day: 'Month',
			};
			const method = dateMap[status];
			if (method) {
				const dates = [instance, cloneDate['set' + method](cloneDate['get' + method]() + interval)]
				this.startDates = interval > 0 ? dates : dates.reverse();
			}
		},
		handleClear() {
			this.handleVisible()
			this.dates = [];
			this.model = "";
			this.$emit('on-clear');
		},
		handleShortcuts(data) {
			const onClick = data.onClick, value = typeof data.value === 'function' ? data.value() : data.value;
			this.dates = this.multiple ? value : [value]
			if (typeof onClick === 'function') onClick(this);
		},
		handleFocus(event) {
			this.$nextTick(() => {
				this.$emit('on-foucs', this.model, this.__dateData, event);
			})
		},
		handleBlur(event) {
			this.$nextTick(() => {
				this.$emit('on-blur', this.model, this.__dateData, event)
				this.$emit('input', this.model, event);
			})
		},
		handleChange() {
			this.$nextTick(() => {
				this.$emit('on-change', this.model, this.__dateData, event);
			});
		},
		selected({ datestring, datesInstance, index = 0, endState = 'day' } = {}, isEnd) {
			this.model = datestring;
			this.__dateData = datesInstance;
			this.__endState = endState;
			if (!this.confirm&&isEnd!==false) this.close();
		},
		close() {
			this.$nextTick(() => {
				this.$refs.input.handleBlur();
				this.syncStatus(this.__endState);
			})
		},
		handleInput(val, event) {
			if (!val) {
				this.dates = [];
				this.model = "";
			}
			this.$emit('input', val, event);
		},
		handleIconClick() {
			this.$refs.input.toggleOpen();
		},
	},
	watch: {
		value(val, old) {
			if (!val) {
				this.model = "";
			} else if (this.model !== val) {
				this.dates = val;
			}
		},
	},
};
</script>

