import { EventListener, DragMove, getElement } from "../utils/dom";
export default class Carousel {
    constructor (el, options, callback) {
        if (!el) throw new Error("el must not be null");
        if (typeof options === "function") {
            this._callback = options;
            options = {};
        } else if (typeof callback === "function") {
            this._callback = callback;
        }
        const _prefix = options.prefix || "carousel";
        this.el = getElement(el);
        this._prefix = _prefix;
        this._listClass = `${_prefix}-list`;
        this._itemClass = `${_prefix}-item`;
        this._activeClass = `${_prefix}-active`;
        this._leftClass = `${_prefix}-left`;
        this._nextClass = `${_prefix}-next`;
        this._rightClass = `${_prefix}-right`;
        this._preClass = `${_prefix}-pre`;
        this._running = false;
        this._isPaused = false;
        this.update({
            loop: true,
            interval: 2000,
            // reverse: false,
            // speed: 0,
            // autoplay: false,
            // touchmove: false,
            // direction:null // vertical  horizontal，
            spacing: 60,
            ...options,
        });
        this.play();
    }
    // 获取关联元素
    _getNextActiveEle(isRight) {
        const loop = this.loop && this.mode !== "scroll";
        this._activeEle =
            this.el.querySelector(`.${this._activeClass}`) ||
            this.el.querySelector(`.${this._itemClass}[data-active]`) ||
            this._children[0];
        if (!this._activeEle) {
            return (this._activeEle = this._nextActiveEle = null);
        }
        this._activeEle.classList.add(this._activeClass);
        if (isRight) {
            this._nextActiveEle = this._activeEle.previousElementSibling || (loop && this._activeEle.parentNode.lastElementChild);
        } else {
            this._nextActiveEle = this._activeEle.nextElementSibling || (loop && this._activeEle.parentNode.firstElementChild);
        }
        return true;
    }
    // 获取所有子元素
    _getChildren() {
        const children = this.el.querySelectorAll(`.${this._itemClass}`);
        const isVertical = (this._options.direction || this.el.dataset.direction) === 'vertical';
        this._children = children ? [...children] : [];
        this._children.forEach((ele, index) => {
            ele.classList.add(this._itemClass);
            ele.dataset.index = index;
            this._options.spacing &&( ele.style[isVertical ? 'marginBottom' : 'marginRight'] = this._options.spacing + 'px');
        });
        return this._children;
    }
    _getChildIndex(element) {
        return this._children.indexOf(element);
    }
    // 绑定动画事件
    _bindAnimation(el, callback, isOnce) {
        let _callback = (event) => {
            if (isOnce) {
                EventListener.off(el, "webkitTransitionEnd,transitionend", _callback);
                this._bindedAnimation = this._destoryBindAnimation = _callback = null;
            }
            callback(event);
        };
        if (!this._bindedAnimation) {
            this._destoryBindAnimation && this._destoryBindAnimation();
            this._bindedAnimation = true;
            EventListener.on(el, "webkitTransitionEnd,transitionend", _callback);
        }
        return () => {
            EventListener.off(el, "webkitTransitionEnd,transitionend", _callback);
            this._bindedAnimation = this._destoryBindAnimation = _callback = null;
        };
    }
    // 设置动画事件
    _setSpeed(isRemove, ele, speed) {
        speed = speed || this.speed;
        if (speed) {
            speed = isRemove ? "" : speed + "ms";
            if (ele) {
                ele.style.transitionDuartion = speed;
            } else {
                this._activeEle && (this._activeEle.style.transitionDuartion = speed);
                this._nextActiveEle && (this._nextActiveEle.style.transitionDuartion = speed);
            }
        }
    }
    // 回流
    _reflow(ele) {
        return ele && ele.offsetHeight;
    }
    _selectedSlide(index) {
        const dots = this.el.querySelector(`.${this._prefix}-dots`);
        if (dots) {
            Array.from(dots.children).forEach((dom, _index) => {
                if (_index == index) {
                    dom.classList.add(`${this._prefix}-dot-active`);
                } else {
                    dom.classList.remove(`${this._prefix}-dot-active`);
                }
            });
        }
    }
    // 获取list 元素
    _getParentEle(ele) {
        ele = ele || this.el.querySelector(`.${this._activeClass}`);
        return ele && ele.parentNode || this.el.querySelector(`.${this._listClass}`);
    }
    // 更新配置
    update(options = {}) {
        options = { ...this._options, ...options };
        this._options = options;
        this.loop = options.loop;
        this.interval = options.interval;
        this.reverse = options.reverse;
        this.speed = options.speed;
        this.mode = options.mode;
        this.autoplay = options.autoplay;
        this.direction = options.direction;
        this._getChildren();
        this._getNextActiveEle(this.reverse);
        const index = this._getChildIndex(this._activeEle);
        this._getScrollPosByActiveEle(this._activeEle);
        this._handleCallback(index);
        setTimeout(() => {
            this._selectedSlide(index);
        }, 0);
        if (this._options.touchmove && this.mode !== 'fade' && !this._DragMove) {
            const el =  this.el;
            this._DragMove = new DragMove(el, { style: null, cursor: null }, (obj) => {
                console.log(obj);
                this.stepMove(obj.distance, obj.cancel, obj);
            });
            return;
        }
        if (!this._options.touchmove) {
            this._DragMove && this._DragMove.destroy();
            this._DragMove = null;
        }
    }
    // 置顶滚动
    slide(event) {
        let slideIndex,
            activeIndex = this._getChildIndex(this._activeEle);
        if (event && event.target) {
            const slideEle = event.currentTarget || event.target;
            slideIndex = parseInt(slideEle.dataset.index);
        } else {
            slideIndex = parseInt(event);
        }
        if (slideIndex == activeIndex || activeIndex == -1) return;
        if (this._running) {
            this._queue = ["slide", slideIndex];
            return;
        }
        this._nextActiveEle = this._children[slideIndex];
        this._step(slideIndex < activeIndex);
    }
    // 运行
    play(isRight = this.reverse, isAuto = this.autoplay) {
        if (!isAuto) return;
        clearTimeout(this._setTimeout);
        // 停留间隔
        this._setTimeout = setTimeout(() => {
            this._isPaused = false;
            this.step(isRight);
        }, this.interval);
    }
    // 暂停
    pause() {
        this._isPaused = true;
        this._setTimeout && clearTimeout(this._setTimeout);
    }
    step(isRight = this.reverse) {
        if (this._running) {
            this._queue = !this._queue && ["step", isRight];
            return;
        }
        if (!this._getNextActiveEle(isRight)) return;
        this._step(isRight);
    }
    _handleCallback(index) {
        this._callback && this._callback(this, index);
    }
    // 执行队列
    _runQueue() {
        this._running = false;
        if (this._queue) {
            const [name, params] = this._queue;
            this._queue = null;
            this[name].call(this, params);
            return true;
        }
    }
    _step(isRight = this.reverse) {
        if (this._children.length < 2 || this._stepScroll(isRight)) return;
        const nextActiveEle = this._nextActiveEle;
        if (!nextActiveEle) return;
        this._running = true;
        const activeEleClass = this._activeEle.classList,
            nextActiveEleClass = nextActiveEle.classList,
            preNextClass = isRight ? this._preClass : this._nextClass,
            rightLeftClass = isRight ? this._rightClass : this._leftClass;
        nextActiveEleClass.add(preNextClass);
        this._setSpeed();
        this._reflow(nextActiveEle);
        nextActiveEleClass.add(rightLeftClass);
        activeEleClass.add(rightLeftClass);
        const index = this._getChildIndex(nextActiveEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        this._destoryBindAnimation = this._bindAnimation(
            nextActiveEle,
            () => {
                nextActiveEleClass.remove(preNextClass, rightLeftClass);
                activeEleClass.remove(this._activeClass, rightLeftClass);
                this._setSpeed(true);
                nextActiveEleClass.add(this._activeClass);
                this._activeEle = nextActiveEle;
                this._nextActiveEle = null;
                if (this._runQueue() || this._isPaused) return;
                this.play(isRight, this.autoplay);
            },
            true
        );
    }
    // mode srcoll Pos
    // 通过激活元素获取偏移距离
    _getScrollPosByActiveEle(nextEle) {
        if (!nextEle) return;
        let { slideOffset, slideBounds, direction } = this._options;
        let isVertical = (direction || this.el.dataset.direction) === 'vertical';
        let total = nextEle[isVertical ? 'offsetTop' : 'offsetLeft'];
        let distance = 0;
        const parentNode = this._getParentEle(nextEle);
        const activeSize = nextEle[isVertical ? 'offsetHeight' : 'offsetWidth'] / 2;
        const lastEleSize = parentNode.lastElementChild[isVertical ? 'offsetHeight' : 'offsetWidth'] / 2;
        const parentSize = parentNode[isVertical ? 'clientHeight' : 'clientWidth'] / 2;
        if (slideOffset === 'center') {
            distance = parentSize - activeSize
        } else if (slideOffset >= 0) {
            distance = slideOffset;
        } else if (slideOffset < 0) {
            distance = parentSize * 2 - lastEleSize - slideOffset;
        }
        total = total - distance;
        // 左右贴边
        if (slideBounds) {
            const lastEleTotal = parentNode.lastElementChild[isVertical ? 'offsetTop' : 'offsetLeft'];
            console.log(lastEleTotal, lastEleSize, parentSize, activeSize, total);
            if (total + activeSize < parentSize) {
                total = 0.2 * Math.random();
            } else if (lastEleTotal + lastEleSize * 2 - total < parentSize * 2) {
                total = lastEleTotal + lastEleSize * 2 - parentSize * 2 - 0.2 * Math.random();
            }
        }
        parentNode.dataset.translate = total;
        parentNode.style.transform = `${isVertical ? 'translateY' : 'translateX'}(${total * -1}px)`;
        return total;
    }
    // 通过偏移距离获取最近激活的元素
    _getNextActiveEleBydistance(total) {
        let { slideOffset, slideBounds, direction } = this._options;
        let distance = 0;
        const isVertical = (direction || this.el.dataset.direction) === 'vertical';
        const parentNode = this._getParentEle(this._activeEle);
        const parentSize = parentNode[isVertical ? 'clientHeight' : 'clientWidth'] / 2;
        if (slideOffset === 'center') {
            distance = parentSize
        } else if (slideOffset >= 0) {
            distance = slideOffset;
        } else if (slideOffset < 0) {
            distance = parentSize * 2 - slideOffset;
        }
        total = total + distance;
        const activeEle = this._children.find((item, index) => {
            const offset = item[isVertical ? 'offsetTop' : 'offsetLeft'];
            if (slideOffset === 'center') {
                return total - item[isVertical ? 'offsetHeight' : 'offsetWidth'] / 2 <= offset
            }
            return total <= offset;
        }) || this._children[this._children.length-1];
        this._activeEle.classList.remove(this._activeClass);
        activeEle.classList.add(this._activeClass);
        const index = this._getChildIndex(activeEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        return activeEle;
    }
    // mode srcoll
    _stepScroll(isRight) {
        if (this.mode !== "scroll" || !this._nextActiveEle) return false;
        const parentNode = this._getParentEle(this._activeEle);
        const isVertical = (this._options.direction || this.el.dataset.direction) === 'vertical';
        const index = this._getChildIndex(this._nextActiveEle);
        this._running = true;
        this._setSpeed(false, parentNode);
        this._getScrollPosByActiveEle(this._nextActiveEle);
        this._nextActiveEle.classList.add(this._activeClass);
        this._activeEle.classList.remove(this._activeClass);
        this._selectedSlide(index);
        this._handleCallback(index);
        if (this._destoryBindAnimation) {
            return true;
        }
        this._destoryBindAnimation = this._bindAnimation(parentNode, () => {
            this._activeEle = this._nextActiveEle;
            this._nextActiveEle = null;
            if (this._runQueue() || this._isPaused) return;
            this.play(isRight, this.autoplay);
        });
        return true;
    }
    // 鼠标移动
    stepMove(distance, isCancel, obj) {
        if (this._running) return;
        const isVertical = (this._options.direction || this.el.dataset.direction) === "vertical";
        distance = distance[isVertical ? 1 : 0];
        const isRight = distance > 0;
        // 滚动模式下
        if (this.mode === 'scroll') {
            const parentNode = this._getParentEle(this._activeEle);
            let total = parentNode.dataset.translate - distance;
            if (isCancel) {
                parentNode.style.transition = "";
                this._setSpeed(null, parentNode);
                total = total - (obj.tempDistance || [0, 0])[isVertical ? 1 : 0] * 10;
                const nextActiveEle = this._getNextActiveEleBydistance(total);
                if (nextActiveEle) {
                    this._getScrollPosByActiveEle(nextActiveEle);
                    return;
                }
                parentNode.dataset.translate = total;
                parentNode.style.transform = `${isVertical ? 'translateY' : 'translateX'}(${total * -1}px)`;
                return;
            }
            parentNode.style.transition = "none";
            parentNode.style.transform = `${isVertical ? 'translateY' : 'translateX'}(${total * -1}px)`;
            return;
        }
        // 非滚动模式下
        // 方向是否改变
        if (typeof this._isRightStepMove === "boolean" && this._isRightStepMove !== isRight && this._nextActiveEle) {
            this._nextActiveEle.style.transform = "";
            this._nextActiveEle.classList.remove(this._isRightStepMove ? this._preClass : this._nextClass);
            this._touchMoveRuning = false;
        }
        this._isRightStepMove = isRight;
        if (!this._touchMoveRuning && !this._getNextActiveEle(isRight)) {
            this._running = false;
            return;
        }
        const nextActiveEle = this._nextActiveEle;
        this._touchMoveRuning = !isCancel;
        if (!nextActiveEle || this._children.length < 2) return;
        const activeEleClass = this._activeEle.classList,
            nextActiveEleClass = nextActiveEle.classList,
            preNextClass = isRight ? this._preClass : this._nextClass,
            rightLeftClass = isRight ? this._rightClass : this._leftClass,
            offsetKey = isVertical ? "offsetHeight" : "offsetWidth";
        // 鼠标滑动结束，移动距离不超过20%
        if (isCancel && Math.abs(distance / this._activeEle[offsetKey]) < 0.3) {
            this._activeEle.style.transition = nextActiveEle.style.transition =
                "transform 100ms ease, opacity 100ms ease";
            this._activeEle.style.transform = nextActiveEle.style.transform = "";
            clearTimeout(this._touchMoveOverTime);
            this._touchMoveOverTime = setTimeout(() => {
                nextActiveEle.style.backfaceVisibility = '';
                this._activeEle.style.transition = nextActiveEle.style.transition = "";
                this._nextActiveEle.classList.remove(preNextClass);
                this._running = this._touchMoveRuning = false;
            }, 110);
            return;
        }

        nextActiveEleClass.add(preNextClass);
        // flip 模式
        if (this.mode === "flip") {
            const rotate = (distance / this._activeEle[offsetKey]) * 180;
            const translateKey = isVertical ? " rotateY(0deg) rotateX" : "rotateX(0deg) rotateY";
            this._activeEle.style.transition = nextActiveEle.style.transition = "none";
            this._activeEle.style.transform = `${translateKey}(${rotate}deg)`;
            nextActiveEle.style.transform = `${translateKey}(${isRight ? -180 + rotate : 180 + rotate}deg)`;
            nextActiveEle.style.backfaceVisibility = 'visible';
        } else {
            const translateKey = isVertical ? "translateY" : "translateX";
            this._activeEle.style.transition = nextActiveEle.style.transition = "none";
            this._activeEle.style.transform = `${translateKey}(${distance}px)`;
            nextActiveEle.style.transform = `${translateKey}(${nextActiveEle[offsetKey] * (isRight ? -1 : 1) + distance}px)`;
        }
        if (this._touchMoveRuning) return;
        this._running = true;
        this._isRightStepMove = false;
        this._activeEle.style.transform = nextActiveEle.style.transform = this._activeEle.style.transition = nextActiveEle.style.transition = "";
        this._setSpeed();
        nextActiveEleClass.add(rightLeftClass);
        activeEleClass.add(rightLeftClass);
        const index = this._getChildIndex(nextActiveEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        this._destoryBindAnimation = this._bindAnimation(
            nextActiveEle,
            () => {
                nextActiveEle.style.backfaceVisibility = '';
                nextActiveEleClass.remove(preNextClass, rightLeftClass);
                activeEleClass.remove(this._activeClass, rightLeftClass);
                this._setSpeed(true);
                nextActiveEleClass.add(this._activeClass);
                this._activeEle = nextActiveEle;
                this._nextActiveEle = null;
                if (this._runQueue() || this._isPaused) return;
                this.play(isRight, this.autoplay);
            },
            true
        );
    }
    destroy() {
        this._isPaused = true;
        this._queue = null;
        this._setTimeout && clearTimeout(this._setTimeout);
        this._DragMove && this._DragMove.destroy();
        this._DragMove = null;
        this._destoryBindAnimation && this._destoryBindAnimation();
        clearTimeout(this._touchMoveOverTime);
    }
}
