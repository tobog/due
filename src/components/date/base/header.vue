


<template>
	<header :class="[_tobogPrefix_]" v-if="!isTimes">
		<span
			v-if="isYear||isMonth"
			:class="[_tobogPrefix_+'-base']"
			@click="handlePreNext({year:calendar.year-(isMonth?1:10)},'pre')"
		>
			<Icons type="ios-arrow-back"></Icons>
			<Icons type="ios-arrow-back"></Icons>
		</span>
		<aside v-if="isDay" :class="[_tobogPrefix_+'-base']">
			<span @click="handlePreNext({year:calendar.year-1},'pre')">
				<Icons type="ios-arrow-back"></Icons>
				<Icons type="ios-arrow-back"></Icons>
			</span>
			<span style="margin-left:12px;" @click="handleMonth(calendar.month-1,'pre')">
				<Icons type="ios-arrow-back"></Icons>
			</span>
		</aside>
		<aside :class="[_tobogPrefix_+'-title']">
			<span @click="handleClick('','year')">{{calendar.year}}{{langs('datepicker.year','年')}}</span>
			<span
				v-if="isDay"
				@click="handleClick('','month')"
			>{{langs('datepicker.month',calendar.month+'月',{month:calendar.month})}}</span>
		</aside>
		<span
			v-if="isYear||isMonth"
			:class="[_tobogPrefix_+'-base']"
			@click="handlePreNext({year:calendar.year+(isMonth?1:10)},'next')"
		>
			<Icons type="ios-arrow-forward"></Icons>
			<Icons type="ios-arrow-forward"></Icons>
		</span>
		<aside v-if="isDay" :class="[_tobogPrefix_+'-base']">
			<span style="margin-right:12px;" @click="handleMonth(calendar.month+1,'next')">
				<Icons type="ios-arrow-forward"></Icons>
			</span>
			<span @click="handlePreNext({year:calendar.year+1},'next')">
				<Icons type="ios-arrow-forward"></Icons>
				<Icons type="ios-arrow-forward"></Icons>
			</span>
		</aside>
	</header>
</template>

<script>
import Icons from "../../icons/index"
import mixins from './mixins'
export default {
	name: "DateHeader",
	mixins: [mixins],
	components: {
		Icons
	},
	props: {
		status: String,
	},
	methods: {
		handlePreNext(data = {}, direction) {
			this.handleClick({ date: { ...this.calendar, ...data }, direction });
		},
		handleMonth(month, direction) {
			if (month < 1) {
				this.handlePreNext({ month: 12, year: this.calendar.year - 1 }, direction)
			} else if (month > 12) {
				this.handlePreNext({ month: 1, year: this.calendar.year + 1 }, direction)
			} else {
				this.handlePreNext({ month }, direction)
			}
		},
	}
};
</script>
