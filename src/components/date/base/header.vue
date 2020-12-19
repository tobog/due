


<template>
	<header :class="_tobogPrefix_" v-if="status!=='times'">
		<aside :class="_tobogPrefix_+'-title'">
			<span @click="handleClick('','year')">{{calendar.year}}{{langs('year','年')}}</span>
			<span
				v-if="status==='day'"
				@click="handleClick('','month')"
			>{{langs('month',calendar.month+'月',{month:calendar.month})}}</span>
		</aside>
		<template v-if="status==='year'||status==='month'">
			<span
				:class="_tobogPrefix_+'-base'"
				@click="handlePreNext({year:calendar.year-(status==='month'?1:10)},'pre')"
			>
				<Icons type="ios-arrow-back"></Icons>
				<Icons type="ios-arrow-back"></Icons>
			</span>
			<span
				:class="[_tobogPrefix_+'-base',_tobogPrefix_+'-right']"
				@click="handlePreNext({year:calendar.year+(status==='month'?1:10)},'next')"
			>
				<Icons type="ios-arrow-forward"></Icons>
				<Icons type="ios-arrow-forward"></Icons>
			</span>
		</template>
		<template v-if="status==='day'">
			<aside :class="_tobogPrefix_+'-base'">
				<span @click="handlePreNext({year:calendar.year-1},'pre')">
					<Icons type="ios-arrow-back"></Icons>
					<Icons type="ios-arrow-back"></Icons>
				</span>
				<span style="margin-left:12px;" @click="handleMonth(calendar.month-1,'pre')">
					<Icons type="ios-arrow-back"></Icons>
				</span>
			</aside>
			<aside :class="[_tobogPrefix_+'-base',_tobogPrefix_+'-right']">
				<span style="margin-right:12px;" @click="handleMonth(calendar.month+1,'next')">
					<Icons type="ios-arrow-forward"></Icons>
				</span>
				<span @click="handlePreNext({year:calendar.year+1},'next')">
					<Icons type="ios-arrow-forward"></Icons>
					<Icons type="ios-arrow-forward"></Icons>
				</span>
			</aside>
		</template>
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
