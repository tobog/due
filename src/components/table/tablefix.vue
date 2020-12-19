
<template>
	<section :class="wrapClasses" :style="wrapStyles">
		<div :class="[_tobogPrefix_]" ref="tables">
			<div
				v-if="isFixHead && showHeader"
				ref="headScroll"
				:class="[_tobogPrefix_ + '-fixed-thead']"
				:style="{ marginRight: scrollBarWidth[1] + 'px' }"
			>
				<table
					cellspacing="0"
					cellpadding="0"
					border="0"
					:style="tableStyle"
					:class="[_tobogPrefix_ + '-table']"
				>
					<Colgroups :columns="bodyTdSize"></Colgroups>
					<Thead
						layoutFixed
						:prefix="_tobogPrefix_"
						:columns="normalColumns"
						:action-data="actionData"
						:column-status="columnStatus"
						:data-length="getResultLen"
						@on-column-status="handleColumnStatus"
					></Thead>
				</table>
			</div>
			<div
				ref="body"
				:class="[_tobogPrefix_ + '-body']"
				:style="bodyStyle"
				@scroll="handlePerformance"
			>
				<table
					cellspacing="0"
					cellpadding="0"
					border="0"
					:class="[_tobogPrefix_ + '-table']"
					:style="tablePerformanceStyle"
				>
					<Colgroups :columns="bodyTdSize"></Colgroups>
					<Thead
						v-if="!isFixHead && showHeader"
						ref="thead"
						layoutFixed
						:prefix="_tobogPrefix_"
						:columns="normalColumns"
						:action-data="actionData"
						:column-status="columnStatus"
						:data-length="getResultLen"
						@on-column-status="handleColumnStatus"
					></Thead>
					<Tbody
						layoutFixed
						:prefix="_tobogPrefix_"
						:columns="cloneColumns"
						:data="rebuildData"
						:action-data="actionData"
						:column-status="columnStatus"
						@on-column-status="handleColumnStatus"
					></Tbody>
					<Summary
						v-if="showSummary && getResultLen"
						ref="summary"
						layoutFixed
						:prefix="_tobogPrefix_"
						:columns="cloneColumns"
						:data="summaryData"
					></Summary>
				</table>
				<div
					v-if="!getResultLen"
					:class="[_tobogPrefix_ + '-tip']"
					:style="getNoDataHeight"
				>
					<slot name="tip">{{ getNoDataText }}</slot>
				</div>
				<div
					v-if="!getResultLen"
					:style="tableStyle"
					:class="[_tobogPrefix_ + '-scroll-tool']"
				></div>
				<div
					v-if="isFixSummary"
					ref="summaryScroll"
					:style="getSummaryStyle"
					:class="[_tobogPrefix_ + '-summary']"
				>
					<table
						cellspacing="0"
						cellpadding="0"
						border="0"
						:style="tableStyle"
						:class="[_tobogPrefix_ + '-table']"
					>
						<Colgroups :columns="bodyTdSize"></Colgroups>
						<Summary
							layoutFixed
							:prefix="_tobogPrefix_"
							:columns="cloneColumns"
							:data="summaryData"
						></Summary>
					</table>
				</div>
			</div>
			<!-- body -->
			<!-- fixed left -->
			<div v-if="isLeftFixed" :class="[_tobogPrefix_ + '-left-fixed']">
				<div
					v-if="showHeader && isFixHead"
					:class="[_tobogPrefix_ + '-fixed-thead']"
					:style="leftFixedHeadStyle"
				>
					<table
						cellspacing="0"
						cellpadding="0"
						border="0"
						:class="[_tobogPrefix_ + '-table']"
						:style="tableStyle"
					>
						<Colgroups :columns="bodyTdSize"></Colgroups>
						<Thead
							fixed="left"
							:prefix="_tobogPrefix_"
							layoutFixed
							:columns="normalColumns"
							:action-data="actionData"
							:column-status="columnStatus"
							:data-length="getResultLen"
							@on-column-status="handleColumnStatus"
						></Thead>
					</table>
				</div>
				<div
					v-if="getResultLen"
					:class="[_tobogPrefix_ + '-body-fixed']"
					:style="hidenLeftScroll"
				>
					<div
						ref="leftScroll"
						:class="[_tobogPrefix_ + '-fixed-wrapper']"
						:style="leftFixedBodyStyle"
					>
						<table
							:class="[_tobogPrefix_ + '-table']"
							cellspacing="0"
							cellpadding="0"
							border="0"
							:style="tablePerformanceStyle"
						>
							<Colgroups :columns="bodyTdSize"></Colgroups>
							<Thead
								v-if="showHeader && !isFixHead"
								fixed="left"
								layoutFixed
								:prefix="_tobogPrefix_"
								:columns="normalColumns"
								:action-data="actionData"
								:column-status="columnStatus"
								:data-length="getResultLen"
								@on-column-status="handleColumnStatus"
							></Thead>
							<Tbody
								fixed="left"
								layoutFixed
								:prefix="_tobogPrefix_"
								:columns="cloneColumns"
								:isFixed="isFixed"
								:data="rebuildData"
								:action-data="actionData"
								:column-status="columnStatus"
								@on-column-status="handleColumnStatus"
							></Tbody>
							<Summary
								v-if="isInnerSummary"
								fixed="left"
								layoutFixed
								:prefix="_tobogPrefix_"
								:columns="cloneColumns"
								:data="summaryData"
							></Summary>
						</table>
					</div>
				</div>
				<div
					v-if="isFixSummary"
					:class="[_tobogPrefix_ + '-summary']"
				>
					<table
						cellspacing="0"
						cellpadding="0"
						border="0"
						:style="tableStyle"
						:class="[_tobogPrefix_ + '-table']"
					>
						<Colgroups :columns="bodyTdSize"></Colgroups>
						<Summary
							fixed="left"
							layoutFixed
							:prefix="_tobogPrefix_"
							:columns="cloneColumns"
							:data="summaryData"
						></Summary>
					</table>
				</div>
			</div>
			<div v-if="isRightFixed" :class="[_tobogPrefix_ + '-right-fixed']">
				<div
					v-if="isFixHead && showHeader"
					:class="[_tobogPrefix_ + '-fixed-thead']"
					:style="rightFixedHeadStyle"
				>
					<table
						cellspacing="0"
						cellpadding="0"
						border="0"
						:class="[_tobogPrefix_ + '-table']"
						:style="tableStyle"
					>
						<Colgroups :columns="rightBodyTdSize"></Colgroups>
						<Thead
							fixed="right"
							layoutFixed
							:prefix="_tobogPrefix_"
							:columns="rightNormalColumns"
							:action-data="actionData"
							:column-status="columnStatus"
							:data-length="getResultLen"
							@on-column-status="handleColumnStatus"
						></Thead>
					</table>
				</div>
				<div
					v-if="getResultLen"
					ref="rightScroll"
					:class="[
						_tobogPrefix_ + '-body-fixed',
						_tobogPrefix_ + '-fixed-wrapper'
					]"
					:style="rightFixedBodyStyle"
				>
					<table
						cellspacing="0"
						cellpadding="0"
						border="0"
						:style="tablePerformanceStyle"
						:class="[_tobogPrefix_ + '-table']"
					>
						<Colgroups :columns="rightBodyTdSize"></Colgroups>
						<Thead
							v-if="!isFixHead && showHeader"
							fixed="right"
							layoutFixed
							:prefix="_tobogPrefix_"
							:columns="rightNormalColumns"
							:action-data="actionData"
							:column-status="columnStatus"
							:data-length="getResultLen"
							@on-column-status="handleColumnStatus"
						></Thead>
						<Tbody
							fixed="right"
							layoutFixed
							:prefix="_tobogPrefix_"
							:columns="rightFixedColumns"
							:isFixed="isFixed"
							:data="rebuildData"
							:action-data="actionData"
							:column-status="columnStatus"
							@on-column-status="handleColumnStatus"
						></Tbody>
						<Summary
							v-if="isInnerSummary"
							fixed="right"
							layoutFixed
							:prefix="_tobogPrefix_"
							:columns="rightFixedColumns"
							:data="summaryData"
						></Summary>
					</table>
				</div>
				<div
					v-if="isFixSummary"
					:class="[_tobogPrefix_ + '-summary']"
				>
					<table
						cellspacing="0"
						cellpadding="0"
						border="0"
						:style="tableStyle"
						:class="[_tobogPrefix_ + '-table']"
					>
						<Colgroups :columns="rightBodyTdSize"></Colgroups>
						<Summary
							fixed="right"
							layoutFixed
							:prefix="_tobogPrefix_"
							:columns="rightFixedColumns"
							:data="summaryData"
						></Summary>
					</table>
				</div>
			</div>
		</div>
		<Tooltip
			:reference="tooltip.reference"
			always
			gpu
			placement="top-center"
			offset="10"
			v-if="tooltip.show"
		>
			<div
				:class="[_tobogPrefix_ + '-tooltip']"
				slot="content"
				v-html="tooltip.content"
			></div>
		</Tooltip>
	</section>
</template>

<script>
	import Mixin from "./mixin";
	import { getStyle, EventListener, AnimationFrame } from "../../utils/dom";
	export default {
		name: "TableFix",
		mixins: [Mixin],
		data() {
			return {
				tableWidth: 0,
				bodyHeight: 0,
				headHeight: 0,
				summaryHeight: 0,
				layoutFixed: true,
				bodyTdSize: []
			};
		},
		// mounted() {
		// 	this.ready = true
		// },
		computed: {
			getNoDataHeight() {
				console.log(this.headHeight);
				if (this.bodyHeight == 0)
					return {
						height: `${this.height -
							this.headHeight -
							2 -
							this.scrollBarWidth[1]}px`
					};
				return {
					height: `${this.bodyHeight - 2 - this.scrollBarWidth[1]}px`
				};
			},
			bodyStyle() {
				if (this.bodyHeight == 0) return;
				return {
					height: `${this.bodyHeight}px`
				};
			},
			tableStyle() {
				if (this.tableWidth == 0) return;
				return {
					width: `${this.tableWidth}px`
				};
			},
			tablePerformanceStyle() {
				const style = { ...this.tableStyle };
				if (this.showSummary && this.fixSunmmary) {
					style.marginBottom = this.summaryHeight + "px";
				}
				if (!this.isPerformance) return style;
				const translate = this.getTotalTranslate;
				if (translate > 0) style.transform = `translateY(${translate}px)`;
				return style;
			},
			rightNormalColumns() {
				return this.isColumnRows
					? this.columnRows.map(arr => {
							return [...arr].reverse();
					  })
					: [this.rightFixedColumns];
			},
			rightFixedColumns() {
				return [...this.cloneColumns].reverse();
			},
			rightBodyTdSize() {
				return [...this.bodyTdSize].reverse();
			},
			getLeftWidth() {
				return this.bodyTdSize.reduce((total, col) => {
					if (col.fixed === "left") {
						const width = col.width || 0;
						if (`${width}`.indexOf("%") > 0) {
							return (
								total + (this.tableWidth * parseFloat(width)) / 100
							);
						}
						return width - 0 + total;
					}
					return total;
				}, 0);
			},
			getRightWidth() {
				return this.bodyTdSize.reduce((total, col) => {
					if (col.fixed === "right") {
						const width = col.width || 0;
						if (`${width}`.indexOf("%") > 0) {
							return (
								total + (this.tableWidth * parseFloat(width)) / 100
							);
						}
						return width - 0 + total;
					}
					return total;
				}, 0);
			},
			leftFixedHeadStyle() {
				return { width: this.getLeftWidth + "px" };
			},
			rightFixedHeadStyle() {
				return {
					width: this.getRightWidth + this.scrollBarWidth[1] + "px",
					paddingRight: this.scrollBarWidth[1] + "px"
				};
			},
			rightFixedBodyStyle() {
				return {
					height: this.bodySize[1] + "px",
					width: this.getRightWidth + this.scrollBarWidth[1] + "px",
					paddingBottom: this.summarySize[1] + "px"
				};
			},
			leftFixedBodyStyle() {
				return {
					height: this.bodySize[1] + "px",
					width: this.getLeftWidth + this.scrollBarWidth[1] + "px",
					paddingBottom: this.summarySize[1] + "px"
				};
			},
			hidenLeftScroll() {
				return {
					width: this.getLeftWidth + "px"
				};
			},
			getSummaryStyle() {
				if (!this.fixSummary || !this.showSummary || !this.summaryHeight)
					return;
				const style = {};
				if (this.scrollBarWidth[0])
					style.bottom = this.scrollBarWidth[0] + "px";
				if (this.scrollBarWidth[1])
					style.right = this.scrollBarWidth[1] + "px";
				return style;
			},
		},
		methods: {
			initSizes() {
				this.$nextTick(() => {
					AnimationFrame.requestFrame(this.handleResize);
				});
			},
			getDefaultWidth() {
				const bodyTdSize = [];
				const result = this.cloneColumns.reduce((total, cell) => {
					let { width, minWidth = 60, maxWidth = 60, fixed } = cell;
					let size = { width, fixed };
					if (!width && (fixed === "right" || fixed === "left")) {
						size.width = 60;
					}
					bodyTdSize.push(size);
					if (`${width}`.indexOf("%") > 0) {
						this.__percentWidth__ =
							(this.__percentWidth__ || 0) + parseFloat(width);
						width = 0;
					}
					return (width || maxWidth || minWidth || 0) - 0 + total;
				}, 0);
				this.bodyTdSize = bodyTdSize;
				return this.getRealWidth(result);
			},
			getRealWidth(tableWidth) {
				const percentWidth = this.__percentWidth__ || 0;
				this.__percentWidth__ = 0;
				return (tableWidth / (100 - percentWidth)) * 100;
			},
			fixedThead() {
				if (this.height) {
					this.$nextTick(() => {
						const { headScroll, summaryScroll, thead } = this.$refs;
						if (this.fixSummary && this.showSummary && summaryScroll) {
							this.summaryHeight = summaryScroll.offsetHeight - 1;
						}
						if (!this.showHeader) return;
						this.headHeight =
							this._handleSize(
								this.isFixHead ? headScroll : thead.$el
							)[1] || 0;
						if (!this.isFixHead) return;
						this.bodyHeight = this.height - this.headHeight;
					});
				} else {
					this.bodyHeight = this.performance === "auto" ? 500 : 0;
				}
			},
			getSummarySize() {
				if (this.isFixSummary) {
					const summary = this.$refs.summary;
					if (!summary) return;
					this.summarySize = this._handleSize(summary.$el);
				}
			},
			handleResize() {
				this.fixedThead();
				if (!this.isLayoutFixed) {
					this.getDefaultWidth();
					this.$nextTick(() => {
						const { body } = this.$refs;
						if (!body) return;
						this.bodySize = [
							body.clientWidth,
							body.clientHeight,
							body.scrollWidth,
							body.scrollHeight
						];
						this.getSummarySize();
						this.setSrollSize();
						this.ready = true;
					});
					return;
				}
				this.$nextTick(() => {
					const { body } = this.$refs;
					if (!body) return;
					let tableWidth = this.getDefaultWidth();
					let realWidth = body.clientWidth;
					this.tableWidth =
						tableWidth > realWidth ? tableWidth : realWidth;
					this.$nextTick(() => {
						const { body } = this.$refs;
						if (!body) return;
						this.fixedThead();
						if (this.getResultLen) {
							const $bobyTr = body.querySelector("tbody>tr");
							if (!$bobyTr) return;
							const $td = $bobyTr.children,
								cloneColumns = this.cloneColumns,
								length = cloneColumns.length,
								bodyTdSize = [];
							for (let i = 0; i < length; i++) {
								const {
									width,
									minWidth = 0,
									maxWidth = 0,
									fixed
								} = cloneColumns[i];
								let _width = parseFloat(
									0 + getStyle($td[i], "width")
								);
								if (!width) {
									if (minWidth - _width > 0) _width = minWidth;
									if (maxWidth && maxWidth - _width < 0)
										_width = maxWidth;
									bodyTdSize.push({ fixed, width: _width });
								} else if (`${width}`.indexOf("%") > 0) {
									bodyTdSize.push({ fixed, width });
								} else {
									bodyTdSize.push({
										fixed,
										width: _width < width ? width : _width
									});
								}
							}
							this.bodyTdSize = bodyTdSize;
						}
						this.$nextTick(() => {
							this.bodySize = [
								body.clientWidth,
								body.clientHeight,
								body.scrollWidth,
								body.scrollHeight
							];
							this.getSummarySize();
							this.setSrollSize();
							this.ready = true;
						});
					});
				});
			}
		}
		// watch: {
		// 	columns: {
		// 		handler() {
		// 			this.cloneColumns = this.makeColumns();
		// 			this.columnRows = this.makeColumnRows();
		// 			this.initSizes();
		// 		},
		// 		deep: true
		// 	},
		// 	data: {
		// 		handler() {
		// 			this.init();
		// 			this.actionData = this.makeActionData();
		// 			this.cloneData = this.resultData = this.makeData();
		// 			this.rebuildData = this.getSizeData;
		// 			this.initSizes();
		// 		},
		// 		deep: true
		// 	},
		// 	height() {
		// 		this.initSizes();
		// 	}
		// }
	};
</script>

