

// <template>
// 	<section :class="wrapClasses" @wheel.stop.prevent="handleWheel">
// 		<input type="file" ref="file" :class="[_tobogPrefix_+'-input']" @change="handeImg" />
// 		<img
// 			v-if="fileUrl"
// 			ref="img"
// 			:style="getImgStyle"
// 			:class="[_tobogPrefix_+'-img']"
// 			src="../../../public/images/28419310_28419310_1383825247801_mthumb.jpg"
// 			@load="initData"
// 			alt
// 		/>
// 		<aside @click.stop v-if="fileUrl" ref="box" :class="[_tobogPrefix_+'-box']" :style="getBoxStyle">
// 			<span :class="[_tobogPrefix_+'-dashed-h']"></span>
// 			<span :class="[_tobogPrefix_+'-dashed-v']"></span>
// 			<span :class="[_tobogPrefix_+'-line']" data-line="left"></span>
// 			<span :class="[_tobogPrefix_+'-line']" data-line="right"></span>
// 			<span :class="[_tobogPrefix_+'-line']" data-line="top"></span>
// 			<span :class="[_tobogPrefix_+'-line']" data-line="bottom"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="left-top"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="left-center"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="left-bottom"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="right-top"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="right-center"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="right-bottom"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="bottom-center"></span>
// 			<span :class="[_tobogPrefix_+'-point']" data-point="top-center"></span>
// 		</aside>
// 		<span :class="[_tobogPrefix_+'-mask-left']" :style="{width:boxPosList[0]+'px'}"></span>
// 		<span
// 			:class="[_tobogPrefix_+'-mask-right']"
// 			:style="{width:boxPosList[4]-boxPosList[0]-boxPosList[2]+'px'}"
// 		></span>
// 		<span
// 			:class="[_tobogPrefix_+'-mask-top']"
// 			:style="{left:boxPosList[0]+'px',right:boxPosList[4]-boxPosList[0]-boxPosList[2]+'px',height:boxPosList[1]+'px'}"
// 		></span>
// 		<span
// 			:class="[_tobogPrefix_+'-mask-bottom']"
// 			:style="{left:boxPosList[0]+'px',right:boxPosList[4]-boxPosList[0]-boxPosList[2]+'px',height:boxPosList[5]-boxPosList[1]-boxPosList[3]+'px'}"
// 		></span>
// 	</section>
// </template>

// <script>
// import { DragMove } from '../../utils/dom';
// import Offset from '../../utils/offset';
// export default {
// 	name: 'Tailor',
// 	props: ['sort', 'data', 'theme'],
// 	data() {
// 		return {
// 			fileUrl: 'demo',
// 			boxPosList: [],
// 			imgPosList: []
// 		}
// 	},
// 	computed: {
// 		wrapClasses() {
// 			const _tobogPrefix_ = this._tobogPrefix_;
// 			return [
// 				`${_tobogPrefix_}-wrapper`,
// 				{

// 				},
// 			];
// 		},
// 		getBoxStyle() {
// 			const [left, top, width, height] = this.boxPosList;
// 			return {
// 				left: left + 'px',
// 				top: top + 'px',
// 				width: width + 'px',
// 				height: height + 'px',
// 			}
// 		},
// 		getImgStyle() {
// 			return {
// 				width: this.imgPosList[0] + 'px',
// 				// height: this.imgPosList[1] + 'px',
// 				transform: `translateX(${this.imgPosList[2]}px) translateY(${this.imgPosList[3]}px)`,
// 			}
// 		},
// 	},
// 	mounted() {
// 		this.dragMove();
// 		// this.initData();
// 	},
// 	methods: {
// 		initData() {
// 			this.$nextTick(() => {
// 				if (!this._isMounted) return;
// 				const { offsetWidth, offsetHeight = 1 } = this.$refs.img;
// 				this.imgRatio = offsetHeight / offsetWidth;
// 				this.imgPosList = [offsetWidth, offsetHeight, 0, 0]
// 			})
// 		},
// 		dragMove() {
// 			this.$nextTick(() => {
// 				if (this._DragMove) {
// 					return this._DragMove.update(this.$el)
// 				}
// 				this._DragMove = new DragMove(this.$refs.box, {
// 					style: ['left', 'top', 'width', 'height'],
// 				}, this.handlePos);
// 			})
// 		},
// 		handeImg(e) {
// 			const file = event.target.files[0];
// 			if (file) {
// 				const filerReader = new FileReader();
// 				filerReader.onload = ((event) => {
// 					this.fileUrl = event.target.result;
// 					this.dragMove();
// 				});
// 				filerReader.readAsDataURL(file)
// 			}
// 		},
// 		handleClick() {
// 			this.$refs.file.click();
// 		},
// 		handlePos(obj, event) {
// 			const { data, distance, cancel, element } = obj;
// 			if (!distance || cancel) {
// 				this.__dragType = null;
// 				return;
// 			}
// 			const [x = 0, y = 0] = distance;
// 			let { left, top, width, height } = data,
// 				outerWidth = this.$el.clientWidth,
// 				outerHeight = this.$el.clientHeight;
// 			left = parseFloat(left);
// 			top = parseFloat(top);
// 			height = parseFloat(height);
// 			width = parseFloat(width);
// 			if ((event && event.target) || this.__dragType) {
// 				const dataset = event.target.dataset;
// 				console.log(event, this.__dragType)
// 				if (!this.__dragType && dataset.line === 'left' || this.__dragType === 'left') {
// 					this.__dragType = 'left';
// 					width -= x;
// 					left += x;
// 					element.style.cursor = 'e-resize'
// 				} else if (!this.__dragType && dataset.line === 'right' || this.__dragType === 'right') {
// 					this.__dragType = 'right';
// 					width += x;
// 					element.style.cursor = 'e-resize'
// 				} else if (!this.__dragType && dataset.line === 'top' || this.__dragType === 'top') {
// 					this.__dragType = 'top';
// 					height -= y;
// 					top += y;
// 					element.style.cursor = 's-resize'
// 				} else if (!this.__dragType && dataset.line === 'bottom' || this.__dragType === 'bottom') {
// 					this.__dragType = 'bottom';
// 					height += y;
// 					element.style.cursor = 's-resize'
// 				} else if (dataset.point === 'left-top' || this.__dragType === 'left-top') {
// 					this.__dragType = 'left-top';
// 					width -= x;
// 					left += x;
// 					height -= x;
// 					top += x;
// 					element.style.cursor = 'se-resize'
// 				}
// 			}
// 			if (left < 0) left = 0;
// 			if (top < 0) top = 0;
// 			this.boxPosList = [left, top, width, height, outerWidth, outerHeight];
// 		},
// 		handleWheel(e) {
// 			if (this._runging) return;
// 			this._runging = true;
// 			const wheelDeltaX = e.wheelDelta / 30,
// 				offset = this.getCursorOffset(e);
// 			let [width, height] = this.imgPosList,
// 				_width = wheelDeltaX + width,
// 				_height = _width * this.imgRatio,
// 				_translateX = offset[2] - _width * offset[0] / width,
// 				_translateY = offset[3] - _height * offset[1] / height;
// 			this.imgPosList = [_width, _height, _translateX, _translateY];
// 			this.$nextTick(() => {
// 				this._runging = false;
// 			})
// 		},
// 		getCursorOffset(event) {
// 			const { clientX, clientY } = event,
// 				{ left, top } = Offset.boundingClientRect(this.$refs.img),
// 				{ left: elLeft, top: elTop } = Offset.boundingClientRect(this.$el),
// 				{ clientLeft, clientTop } = this.$el;
// 			return [clientX - left, clientY - top, clientX - elLeft - clientLeft, clientY - elTop - clientTop]
// 		},

// 	},
// 	beforeDestroy() {
// 		this._DragMove && this._DragMove.destroy();
// 	}
// };
// </script>
