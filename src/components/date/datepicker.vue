
<template>
	<section
		:data-vview-module="$options.name"
		@keydown.stop="handleKeydown"
		@mouseenter.stop="handleVisible"
		@mouseleave.stop="handleVisible"
	>
		<InputBase
			dropStyle="max-height: initial; padding: 0;overflow: hidden;width:initial"
			ref="input"
			inputStyle="padding-right:30px;"
			suffix="ios-calendar-outline"
			:value="model"
			:readonly="false"
			:filterable="true"
			:opttip="opttip"
			:autoClose="false"
			v-bind="$attrs"
			@input="handleInput"
			@on-focus="handleFocus"
			@on-clear="handleClear"
			@on-blur="handleBlur"
			@on-change="handleChange"
			@on-visible-change="handleVisible"
			@on-icon-click="handleIconClick"
		>
			<div
				:class="dropWrapClasses"
				@click.stop="handleDateFocus"
				@mousedown.stop="handleClearTimeout"
				:key="formats"
			>
				<aside :class="_tobogPrefix_+'-aside'" v-if="shortcuts.length>0">
					<div
						v-for="(item,index) in shortcuts"
						@click.stop="handleShortcuts(item)"
						:key="index"
						v-html="item.text"
					></div>
				</aside>
				<DateBase
					ref="ref0"
					:visible="visible"
					:class="[_tobogPrefix_+'-date']"
					:sectionMethod="sectionMethod"
					index="0"
					:multiple="multiple"
					:range="range"
					:format="formats"
					:showWeek="showWeek"
					:startDate="startDates[0]"
					@on-selected="selected"
					@on-sync-update="handleCalendar"
					:value="dates"
				/>
				<DateBase
					v-if="range"
					ref="ref1"
					:visible="visible"
					:class="[_tobogPrefix_+'-date']"
					:sectionMethod="sectionMethod"
					index="1"
					:multiple="multiple"
					:range="range"
					:format="formats"
					:showWeek="showWeek"
					:startDate="startDates[1]"
					@on-selected="selected"
					@on-sync-update="handleCalendar"
					:value="dates"
				/>
			</div>
			<footer v-if="confirm||hasDateTimes" :class="_tobogPrefix_+'-footer'">
				<Button
					v-if="confirm"
					style="float:right;margin-left:8px;"
					size="small"
					theme="primary"
					@click.stop="close"
				>{{langs.confirm}}</Button>
				<Button
					v-if="confirm"
					style="float:right;"
					size="small"
					@click.stop="handleClear"
				>{{langs.clear}}</Button>
				<Button
					v-if="hasDateTimes&&status!='times'"
					@click.stop="handleStatus('times')"
					style="float:left"
					theme="text"
					size="small"
				>{{langs.selectTime}}</Button>
				<Button
					v-if="hasDateTimes&&status==='times'"
					@click.stop="handleStatus('day')"
					style="float:left"
					theme="text"
					size="small"
				>{{langs.selectDate}}</Button>
			</footer>
		</InputBase>
	</section>
</template>

<script>
import DateBase from "./base";
import InputBase from '../input/index';
import Button from '../button/index';
import Dates from '../../utils/dates'
import { typeOf } from '../../utils/tool'

export default {
	name: "DatePicter",
	inheritAttrs: false,
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
		sectionMethod: Function,
		startDate: {
			type: [String, Date, Object, Number],
			default() {
				return Date.now()
			},
		},
	},

	data() {
		return {
			visible: false,
			dates: this.value,
			model: this.value,
			status: 'day',
			startDates: [0, 0],
			opttip: ""
		};
	},
	created() {
		this.initStatus();
	},
	computed: {
		langs() {
			const lang = {
				'confirm': '确定',
				'clear': '清除',
				'selectTime': '选择时间',
				'selectDate': '选择日期',
			}
			if (typeof this.$t !== 'function') return lang;
			const langPrefix = this.__$langPrefix__,
				obj = {};
			Object.keys(lang).forEach((key) => {
				let langKey = `${langPrefix}.datepicker.${key}`;
				langKey = (this.__$langMap__ && this.__$langMap__[langKey]) ? this.__$langMap__[langKey] : langKey;
				const value = this.$t(langKey)
				obj[key] = langKey === value ? lang[key] : value;
			})
			return obj;
		},
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
				case 'timerange':
				case 'hoursrange': return true; break;
				default: return false;
			}
		},
		formats() {
			if (this.format) return this.format;
			return Dates.formats(this.type);
		},
		input() {
			return (this.$refs.input || {}).$el
		},
		drop() {
			return (this.$refs.drop || {}).$el
		},
		dropWrapClasses() {
			return `${this._tobogPrefix_}-drop-wrap`
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
		handleClearTimeout() {
			const ref = this.$refs.input;
			if (ref) {
				ref.handleClearTimeout();
				clearTimeout(ref.__timeout);
			}
		},
		handleDateFocus(event) {
			const ref = this.$refs.input;
			if (ref) {
				ref.setInputFocus(null);
			}
		},
		handleKeydown(e) {
			const keyCode = e.keyCode;
			console.log(keyCode)
			// left/top/right/down/enter
			if ([37, 38, 39, 40, 13].indexOf(keyCode) === -1) return;
			const ref = this.$refs[`ref${this.curIndex}`];
			if (ref) {
				ref.handleKeydown(e);
				if (keyCode == 13) {
					this.$refs.input.handleClearTimeout();
					return
				}
				if (keyCode != 13 && this.range) {
					console.log('handleCalendar')
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
		handleStatus(status) {
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
				this.handleStatus(status);
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
					// console.log(focusDate1.month, focusDate0.month, focusDate1.year, focusDate0.year, this.status)
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
			this.handleVisible();
			this.dates = [];
			this.model = '';
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
		selected({ datestring, datesInstance, index = 0, endState = 'day' } = {}, end) {
			this.model = datestring;
			this.__dateData = datesInstance;
			this.__endState = endState;
			if (!this.confirm) this.close();
		},
		close() {
			this.$nextTick(() => {
				this.$refs.input.forceClose();
				this.handleStatus(this.__endState);
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
		// model(val, old) {
		// 	if (!val) {
		// 		this.dates = [];
		// 		this.$emit('input', '');
		// 	}
		// }
	},
};
</script>

