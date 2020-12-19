<template>
	<div
		:class="wrapClasses"
		:style="wrapStyles"
		ref="body"
		@scroll="handleBodyScroll"
		@mousewheel.stop="handleMousePerformance"
		@DOMMouseScroll.stop="handleMousePerformance"
	>
		<table cellspacing="0" cellpadding="0" border="0" :style="tableMainStyle" ref="tbody">
			<Colgroups :columns="cloneColumns"></Colgroups>
			<Thead
				v-if="showThead"
				simple
				:prefix="_tobogPrefix_"
				:columns="cloneColumns"
				:column-rows="columnRows"
				:action-data="actionData"
				:column-status="columnStatus"
				:data-length="getLength"
				@on-column-status="handleColumnStatus"
				@on-split-moving="handleSplit"
			></Thead>
			<Tbody
				v-if="getLength"
				simple
				:class="_tobogPrefix_+'-tbody'"
				:prefix="_tobogPrefix_"
				:columns="cloneColumns"
				:data="rebuildData"
				:size="size"
				:action-data="actionData"
				:column-status="columnStatus"
				@on-column-status="handleColumnStatus"
			></Tbody>
			<tbody v-show="!getLength">
				<tr>
					<td :colspan="cloneColumns.length" :class="_tobogPrefix_ + '-tip'" v-html="getNoDataText"></td>
				</tr>
			</tbody>
		</table>
		<Loading v-if="loading" fix size="large" loading>
			<slot name="loading"></slot>
		</Loading>
	</div>
</template>

<script>
import Loading from "../loading/loading.vue";
import Thead from "./thead";
import Tbody from "./tbody";
import Colgroups from "./colgroups";
import Mixin from "./mixin";

export default {
	name: "TableSimple",
	mixins: [Mixin],
	components: {
		Thead,
		Tbody,
		Colgroups,
		Loading
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				_tobogPrefix_,
				`${_tobogPrefix_}-wrapper`,
				{
					[`${_tobogPrefix_}-hover`]: this.hover,
					[`${_tobogPrefix_}-stripe`]: this.stripe,
					[`${_tobogPrefix_}-border`]: this.border,
					[`${_tobogPrefix_}-scroll`]: this.height||this.performance === "auto",
					[`${_tobogPrefix_}-ellipsis`]: this.ellipsis
				}
			];
		},
		wrapStyles() {
			const style = {},
				height = this.height,
				width = this.width;
			if (height) {
				style.height = `${height}px`;
			} else if (this.performance === "auto") {
				style.height = "500px";
			}
			if (width) style.width = `${width}px`;
			return style;
		},
		tableMainStyle() {
			const translate = this.getTotalTranslate,
				style = {};
			if (translate > 0) style.transform = `translateY(${translate}px)`;
			return style;
		}
	},
	watch: {
		columns: {
			handler() {
				this.cloneColumns = this.makeColumns();
				this.columnRows = this.makeColumnRows();
			},
			deep: true
		},
		data: {
			handler() {
				this.init();
				// this.columnStatus.check = {};
				this.actionData = this.makeActionData();
				this.cloneData = this.resultData = this.makeData();
				this.rebuildData = this.getSizeData;
			},
			deep: true
		}
	}
};
</script>

