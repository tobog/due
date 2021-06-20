
<template>
	<div :class="wrapClasses" :style="wrapStyles">
		<div :class="_tobogPrefix_">
			<div
				v-if="showThead"
				ref="head"
				:class="[_tobogPrefix_+'-thead']"
				:style="headStyle"
			>
				<table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
					<Colgroups :columns="cloneColumns"></Colgroups>
					<Thead
						:prefix="_tobogPrefix_"
						:columns="cloneColumns"
						:column-rows="columnRows"
						:action-data="actionData"
						:column-status="columnStatus"
						:data-length="getLength"
						@on-column-status="handleColumnStatus"
						@on-split-moving="handleSplit"
					></Thead>
				</table>
			</div>
			<div
				:class="_tobogPrefix_+'-tbody'"
				v-show="getLength"
				:style="bodyStyle"
				ref="body"
				@scroll="handleBodyScroll"
				@mousewheel.stop="handleMousePerformance"
				@DOMMouseScrollx.stop="handleMousePerformance"
			>
				<table cellspacing="0" cellpadding="0" border="0" :style="tableMainStyle" ref="tbody">
					<Colgroups :columns="cloneColumns"></Colgroups>
					<Tbody
						:prefix="_tobogPrefix_"
						:columns="cloneColumns"
						:data="rebuildData"
						:size="size"
						:action-data="actionData"
						:column-status="columnStatus"
						@on-column-status="handleColumnStatus"
					></Tbody>
				</table>
			</div>
			<div
				v-if="isLeftFixed"
				:class="_tobogPrefix_+'-left-fixed'"
				:style="fixedTableStyle('left')"
			>
				<div v-if="showThead" :class="_tobogPrefix_+'-thead-fixed'">
					<table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
						<Colgroups :columns="cloneColumns"></Colgroups>
						<Thead
							fixed="left"
							:prefix="_tobogPrefix_"
							:columns="cloneColumns"
							:column-rows="columnRows"
							:action-data="actionData"
							:column-status="columnStatus"
							:data-length="getLength"
							@on-column-status="handleColumnStatus"
						></Thead>
					</table>
				</div>
				<div
					v-if="getLength"
					:class="_tobogPrefix_+'-tbody-fixed'"
					:style="fixedBodyStyle"
					ref="leftFixedTbody"
					@mousewheel.stop="handleMouseWheel"
					@DOMMouseScroll.stop="handleMouseWheel"
				>
					<table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
						<Colgroups :columns="cloneColumns"></Colgroups>
						<Tbody
							fixed="left"
							:prefix="_tobogPrefix_"
							:columns="cloneColumns"
							:data="rebuildData"
							:size="size"
							:action-data="actionData"
							:column-status="columnStatus"
							@on-column-status="handleColumnStatus"
						></Tbody>
					</table>
				</div>
			</div>
			<div
				v-if="isRightFixed"
				:class="[_tobogPrefix_+'-right-fixed']"
				:style="fixedTableStyle('right')"
			>
				<div v-if="showThead" :class="[_tobogPrefix_+'-thead-fixed']">
					<table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
						<Colgroups :columns="rightFixedColumns"></Colgroups>
						<Thead
							fixed="right"
							:prefix="_tobogPrefix_"
							:columns="rightFixedColumns"
							:column-rows="rightFixedColumnRows"
							:action-data="actionData"
							:column-status="columnStatus"
							:data-length="getLength"
							@on-column-status="handleColumnStatus"
						></Thead>
					</table>
				</div>
				<div
					v-if="getLength"
					:class="[_tobogPrefix_+'-tbody-fixed']"
					:style="fixedBodyStyle"
					ref="rightFixedTbody"
					@mousewheel.stop="handleMouseWheel"
					@DOMMouseScroll.stop="handleMouseWheel"
				>
					<table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
						<Colgroups :columns="rightFixedColumns"></Colgroups>
						<Tbody
							fixed="right"
							:prefix="_tobogPrefix_"
							:columns="rightFixedColumns"
							:data="rebuildData"
							:size="size"
							:action-data="actionData"
							:column-status="columnStatus"
							@on-column-status="handleColumnStatus"
						></Tbody>
					</table>
				</div>
			</div>
			<div
				v-show="!getLength"
				:class="_tobogPrefix_ + '-tip'"
				:style="bodyStyle"
				@scroll="handleBodyScroll"
			>
				<table cellspacing="0" cellpadding="0" border="0" :style="tableStyle">
					<tbody>
						<tr>
							<td :style="{'height':bodyStyle.height}" style="text-align:center;" v-html="getNoDataText"></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<Loading v-if="loading" fix size="large" loading>
			<slot name="loading"></slot>
		</Loading>
	</div>
</template>

<script>
import Loading from "../loadingg/src/loading.vue";
import Thead from "./thead";
import Tbody from "./tbody";
import Colgroups from "./colgroups";
import Mixin from "./mixin";
import { getStyle, getScrollBarSize, ObserverDomSize } from "../../utils/dom";
export default {
	name: "Table",
	mixins: [Mixin],
	components: {
		Thead,
		Tbody,
		Loading,
		Colgroups
	},
	// props: {
	// 	data: {
	// 		type: Array,
	// 		default() {
	// 			return [];
	// 		},
	// 	},
	// 	columns: {
	// 		type: Array,
	// 		default() {
	// 			return [];
	// 		},
	// 	},
	// 	width: {
	// 		type: Number,
	// 	},
	// 	height: {
	// 		type: Number,
	// 	},
	// 	stripe: {
	// 		type: Boolean,
	// 		default: false,
	// 	},
	// 	border: {
	// 		type: Boolean,
	// 		default: false,
	// 	},
	// 	showThead: {
	// 		type: Boolean,
	// 		default: true,
	// 	},
	// 	highlightRow: {
	// 		type: Boolean,
	// 		default: false,
	// 	},
	// 	hover: {
	// 		type: Boolean,
	// 		default: false,
	// 	},
	// 	loading: {
	// 		type: Boolean,
	// 		default: false,
	// 	},
	// 	ellipsis: {
	// 		type: Boolean,
	// 		default: false,
	// 	},
	// 	size: {
	// 		type: [String, Number],
	// 		// default: 'default',
	// 	},
	// 	noDataText: {
	// 		type: String,
	// 		default: '暂时没有相关数据',
	// 	},
	// 	column: Object,
	// 	performance: Boolean,
	// 	length: {
	// 		type: Number,
	// 		default: 24
	// 	}
	// 	// multiSort: Boolean,
	// 	// multiFilter: Boolean,
	// },
	data() {
		return {
			ready: false,
			tableWidth: 0,
			// actionData: this.makeActionData(),
			// rebuildData: [],
			// cloneColumns: this.makeColumns(),
			// columnRows: this.makeColumnRows(),
			bodyHeight: 0,
			tbodyRealHeight: 0,
			bodyRealWidth: 0,
			scrollBarWidth: getScrollBarSize(),
			// showVerticalScrollBar: false,
			// showHorizontalScrollBar: false,
			// cloneData: this.makeData(),
			// sizelength: 0,
			// columnStatus: {
			// 	sort: {},
			// 	filter: {},
			// 	check: {},
			// }
			translate: 0
		};
	},
	mounted() {
		this.$nextTick(() => (this.ready = true));
		this.__observerDomSize = ObserverDomSize();
		this.__timeInit = setTimeout(() => {
			// console.log("mounted handleResize");
			this.handleResize();
			console.log('this.__observerDomSize')
			this.__observerDomSize.addResizeListener(
				this.$el,
				this.handleResize
			);
			this.__timeInit = null;
		}, 0);
	},
	activated() {
		// clearTimeout(this.__timeInit);
		this.__timeInit = setTimeout(() => {
			// console.log("activated handleResize");
			this.handleResize();
			this.__observerDomSize.reset(this.$el)
			// this.__observerDomSize.addResizeListener(
			// 	this.$el,
			// 	this.handleResize
			// );
			console.log('activated')
			this.__timeInit = null;
		}, 0);
	},
	// deactivated() {
	// 	// console.log('deactivated')
	// 	// this.__observerDomSize.removeResizeListener(
	// 	// 	this.$el,
	// 	// 	this.handleResize
	// 	// );
	// },
	beforeDestroy() {
		// console.log('beforeDestroy')
		this.__observerDomSize.removeResizeListener(
			this.$el,
			this.handleResize
		);
	},
	computed: {
		wrapClasses() {
			const _tobogPrefix_ = this._tobogPrefix_;
			return [
				`${_tobogPrefix_}-wrapper`,
				{
					[`${_tobogPrefix_}-hide`]: !this.ready,
					[`${_tobogPrefix_}-stripe`]: this.stripe,
					[`${_tobogPrefix_}-border`]: this.border,
					[`${_tobogPrefix_}-ellipsis`]: this.ellipsis
				}
			];
		},
		headStyle() {
			const bodyHeight = this.bodyHeight;
			return bodyHeight != 0 && bodyHeight < this.tbodyRealHeight
				? {
						marginRight: `${this.scrollBarWidth}px`
				  }
				: null;
		},
		bodyStyle() {
			return this.bodyHeight != 0
				? { height: `${this.bodyHeight}px` }
				: {};
		},
		tableMainStyle(){
			const translate=this.getTotalTranslate,
			style={	...this.tableStyle};
			if(translate>0) style.transform=`translateY(${translate}px)`
			return style;
		},
		tableStyle() {
			let style = {},
				bodyHeight = this.bodyHeight,
				tableWidth = this.tableWidth;
			if (tableWidth != 0) {
				let width = "";
				if (bodyHeight == 0) {
					width = tableWidth;
				} else {
					if (bodyHeight > this.tbodyRealHeight) {
						width = tableWidth;
					} else {
						width = tableWidth - this.scrollBarWidth;
					}
				}
				style.maxWidth = `${width}px`;
			}
			return style;
		},
		fixedBodyStyle() {
			let style = {},
				bodyHeight = this.bodyHeight,
				height = bodyHeight - this.scrollBarWidth - 1;
			if (bodyHeight !== 0) {
				style.height =
					this.bodyRealWidth < this.tableWidth
						? `${height}px`
						: `${bodyHeight}px`;
			}
			return style;
		},
		rightFixedColumns() {
			return [...this.cloneColumns].reverse();
		},
		rightFixedColumnRows() {
			return this.columnRows.map(arr => {
				return [...arr].reverse();
			});
		},
		isLeftFixed() {
			return this.cloneColumns.some(col => col.fixed === "left");
		},
		isRightFixed() {
			return this.cloneColumns.some(col => col.fixed === "right");
		}
	},
	methods: {
		handleMouseIn(_index) {
			if (!this.hover) return;
			const actionData = this.actionData[_index];
			if (!actionData._isHover) actionData._isHover = true;
			this.$emit(
				"on-row-hover",
				JSON.parse(JSON.stringify(this.cloneData[_index])),
				_index,
				true
			);
		},
		handleMouseOut(_index) {
			if (!this.hover) return;
			this.actionData[_index]._isHover = false;
			this.$emit(
				"on-row-hover",
				JSON.parse(JSON.stringify(this.cloneData[_index])),
				_index,
				false
			);
		},
		handleMouseWheel(event) {
			const wheelDelta = event.wheelDelta,
				detail = event.detail,
				$body = this.$refs.body,
				scropTopMax = $body.scrollHeight - $body.clientHeight;
			if (scropTopMax > 0) event.preventDefault();
			let deltaY = 0;
			if (wheelDelta) {
				deltaY = -wheelDelta;
			} else if (detail) {
				deltaY = detail * 40;
			}
			let scrollTop = $body.scrollTop + deltaY / 5;
			if (scrollTop <= 0) {
				scrollTop = 0;
			} else if (scrollTop > scropTopMax) {
				scrollTop = scropTopMax;
			}
			$body.scrollTop = scrollTop;
			
		},
		

		fixedTableStyle(fixedType = "left") {
			let style = {};
			let width = 0;
			this.cloneColumns.forEach(col => {
				if (col.fixed && col.fixed === fixedType) width += col._width;
			});
			style.width = `${width}px`;
			if (
				fixedType === "right" &&
				this.bodyHeight &&
				this.bodyHeight < this.tbodyRealHeight
			) {
				style["margin-right"] = `${this.scrollBarWidth + 1}px`;
			}
			return style;
		},
		fixedThead() {
			if (this.height) {
				this.$nextTick(() => {
					const headHeight = parseInt(0 + getStyle(this.$refs.head, "height")) || 0;
					this.bodyHeight = this.height - headHeight;
				});
			} else {
				this.bodyHeight = this.performance==='auto'?500:0;
			}
		},
		handleResize() {
			let isResponsive = false,
				_getStyle = getStyle;
			this.fixedThead();
			this.$nextTick(() => {
				let tableWidth = 0;
				this.cloneColumns.forEach(cell => {
					let { width, minWidth = 60 } = cell;
					if (!width) isResponsive = true;
					cell._width = width || "";
					if (`${width}`.indexOf("%") > 0) {
						width = 0;
						isResponsive = true;
					}
					tableWidth += width || minWidth || 0;
				});
				if (isResponsive) {
					const realWidth =
						this.$el.firstElementChild.offsetWidth + 0;
					tableWidth =
						tableWidth > realWidth ? tableWidth  : realWidth ; //safari 会返回auto 要转化数字类型
				}
				this.tableWidth = tableWidth-1;
				this.$nextTick(() => {
					const Refs = this.$refs;
					if (!Refs.tbody) return;
					this.fixedThead();
					this.tbodyRealHeight = Refs.tbody.offsetHeight;
					this.bodyRealWidth = Refs.body.offsetWidth;
					if (this.data.length) {
						const $bobyTr = Refs.tbody.querySelector("tbody>tr");
						if (!$bobyTr) return;
						const $td = $bobyTr.children,
							cloneColumns = this.cloneColumns,
							length = cloneColumns.length;
						for (let i = 0; i < length; i++) {
							let key = i,
								column = cloneColumns[key],
								width = column.width,
								_width = parseInt(
									0 + _getStyle($td[key], "width")
								);
							if (width === void 0 || width === "") {
								let minWidth = column.minWidth || 0,
									maxWidth = column.maxWidth;
								_width = _width < minWidth ? minWidth : _width;
								if (maxWidth)
									_width =
										_width < maxWidth ? _width : maxWidth;
								column._width = _width;
							} else if (width != 0) {
								if (`${width}`.indexOf("%") > 0)
									return (column._width = width);
								column._width = _width < width ? width : _width;
							}
						}
					}
				});
			});
		}
	},
	watch: {
		columns: {
			handler() {
				// console.log("columns handleResize");
				this.cloneColumns = this.makeColumns();
				this.columnRows = this.makeColumnRows();
				this.handleResize();
			},
			deep: true
		},
		data: {
			handler() {
				// console.log("data handleResize");
				this.init();
				this.actionData = this.makeActionData();
				this.cloneData = this.resultData = this.makeData();
				this.rebuildData = this.getSizeData;
				this.handleResize();
			},
			deep: true
		},
		height() {
			// console.log("height handleResize");
			this.handleResize();
		}
	}
};
</script>

