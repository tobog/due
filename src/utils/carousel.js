import { EventListener, DragMove, getElement } from "../utils/dom";
export default class Carousel {
    constructor(el, options, callback) {
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
            // direction:null // vertical  horizontal
            ...options,
        });
        this.play();
    }
    _getNextActiveEle(isRight) {
        const activeEle =
                this.el.querySelector(`.${this._activeClass}`) ||
                this.el.querySelector(`.${this._itemClass}[data-active]`) ||
                this._children[0],
            loop = this.loop && this.mode !== "scroll";
        if (!activeEle) {
            return (this._activeEle = this._nextActiveEle = null);
        }
        activeEle.classList.add(this._activeClass);
        this._activeEle = activeEle;
        if (isRight) {
            this._nextActiveEle = activeEle.previousElementSibling || (loop && activeEle.parentNode.lastElementChild);
        } else {
            this._nextActiveEle = activeEle.nextElementSibling || (loop && activeEle.parentNode.firstElementChild);
        }
        return true;
    }
    _getChildren() {
        const children = this.el.querySelectorAll(`.${this._itemClass}`);
        this._children = children ? [...children] : [];
        this._children.forEach((ele, index) => {
            ele.classList.add(this._itemClass);
            ele.dataset.index = index;
        });
        return this._children;
    }
    _getChildIndex(element) {
        return this._children.indexOf(element);
    }
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
    _reflow(ele) {
        return ele.offsetHeight;
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
        this._handleCallback(index);
        setTimeout(() => {
            this._selectedSlide(index);
        }, 0);
        // if (this._options.touchmove && !this._DragMove) {
        //     console.log(getElement(this._listClass, this.el));
        //     const el = getElement(this._listClass, this.el) || this.el;
        //     this._DragMove = new DragMove(el, { style: null, cursor: null }, (obj) => {
        //         console.log(obj);
        //         this.stepMove(obj.distance, obj.cancel);
        //     });
        //     return;
        // }
        // if (!this._options.touchmove) {
        //     this._DragMove && this._DragMove.destroy();
        //     this._DragMove = null;
        //     return;
        // }
    }
    slide(event) {
        let slideIndex;
        if (event && event.target) {
            const slideEle = event.currentTarget || event.target;
            slideIndex = parseInt(slideEle.dataset.index);
        } else {
            slideIndex = parseInt(event);
        }
        const activeIndex = this._getChildIndex(this._activeEle);
        if (slideIndex == activeIndex || activeIndex == -1) return;
        if (this._running) {
            this._queue = ["slide", slideIndex];
            return;
        }
        this._nextActiveEle = this._children[slideIndex];
        this._step(slideIndex < activeIndex);
    }
    play(isRight = this.reverse, isAuto = this.autoplay) {
        if (!isAuto) return;
        clearTimeout(this._setTimeout);
        this._setTimeout = setTimeout(() => {
            this._isPaused = false;
            this.step(isRight);
        }, this.interval);
    }
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
    _runQueue() {
        this._running = false;
        if (this._queue) {
            const [name, params] = this._queue;
            this._queue = null;
            this[name].call(this, params);
            return true;
        }
    }
    // 鼠标移动
    stepMove(distance, isCancel) {
        if (this._running) return;
        const isVertical = (this._options.direction || this.el.dataset.direction) === "vertical";
        const offsetKey = isVertical ? "offsetHeight" : "offsetWidth";
        const translateKey = isVertical ? "translateY" : "translateX";
        distance = distance[isVertical ? 1 : 0];
        const isRight = distance > 0;
        console.log(distance, isRight, isVertical);
        // 方向是否改变
        if (typeof this._isRight === "boolean" && this._isRight !== isRight && this._nextActiveEle) {
            this._nextActiveEle.style.transform = "";
            this._nextActiveEle.classList.remove(this._isRight ? this._preClass : this._nextClass);
            this._touchMoveRuning = false;
        }
        this._isRight = isRight;
        if (!this._touchMoveRuning && !this._getNextActiveEle(isRight)) {
            this._running = false;
            return;
        }
        this._touchMoveRuning = !isCancel;
        const nextActiveEle = this._nextActiveEle;
        if (!nextActiveEle || this._children.length < 2) return;
        const activeEleClass = this._activeEle.classList,
            nextActiveEleClass = nextActiveEle.classList;
        let preNextClass, rightLeftClass;
        if (isRight) {
            preNextClass = this._preClass;
            rightLeftClass = this._rightClass;
        } else {
            preNextClass = this._nextClass;
            rightLeftClass = this._leftClass;
        }
        // 鼠标结束，移动距离不超过20%
        if (!this._touchMoveRuning && Math.abs(distance / this._activeEle[offsetKey]) < 0.2) {
            this._activeEle.style.transition = nextActiveEle.style.transition =
                "transform 100ms ease, opacity 100ms ease";
            this._activeEle.style.transform = nextActiveEle.style.transform = "";
            setTimeout(() => {
                this._activeEle.style.transition = nextActiveEle.style.transition = "";
                this._nextActiveEle.classList.remove(this._isRight ? this._preClass : this._nextClass);
                this._touchMoveRuning = false;
                this.running = false;
            }, 110);
            return;
        }
        nextActiveEleClass.add(preNextClass);
        this._activeEle.style.transition = nextActiveEle.style.transition = "none";
        this._activeEle.style.transform = `${translateKey}(${distance}px)`;
        nextActiveEle.style.transform = `${translateKey}(${nextActiveEle[offsetKey] * (this._isRight ? -1 : 1) +
            distance}px)`;
        if (this._touchMoveRuning) return;
        this._running = true;
        this._isRight = false;
        this._activeEle.style.transition = nextActiveEle.style.transition = "";
        this._setSpeed();
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
                this._activeEle.style.transform = nextActiveEle.style.transform = this._activeEle.style.transition = nextActiveEle.style.transition =
                    "";
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
    _step(isRight = this.reverse) {
        if (this._children.length < 2 || (this._stepScroll(isRight))) return;
        const nextActiveEle = this._nextActiveEle;
        if (!nextActiveEle) return;
        this._running = true;
        const activeEleClass = this._activeEle.classList,
            nextActiveEleClass = nextActiveEle.classList;
        let preNextClass, rightLeftClass;
        if (isRight) {
            preNextClass = this._preClass;
            rightLeftClass = this._rightClass;
        } else {
            preNextClass = this._nextClass;
            rightLeftClass = this._leftClass;
        }
        nextActiveEleClass.add(preNextClass);
        this._setSpeed();
        this._reflow(nextActiveEle);
        nextActiveEleClass.add(rightLeftClass);
        activeEleClass.add(rightLeftClass);
        // nextActiveEle.parentNode.dataset['3d'] = isRight ? -1 : 1;
        const index = this._getChildIndex(nextActiveEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        this._destoryBindAnimation = this._bindAnimation(
            nextActiveEle,
            () => {
                // nextActiveEle.parentNode.dataset['3d'] = 0;
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
    // mode srcoll
    _stepScroll(isRight) {
        if (this.mode !== "scroll" || !this._nextActiveEle) return false;
        this._running = true;
        const parentNode = this._activeEle.parentNode;
        // const isVertical = (this._options.direction || this.el.dataset.direction) === 'vertical';
        const getTotalSize = function(ele) {
            let total = 0;
            while (ele.previousElementSibling) {
                total += ele.previousElementSibling.offsetWidth;
                ele = ele.previousElementSibling;
            }
            return total;
        };
        const index = this._getChildIndex(this._nextActiveEle);
        const total = getTotalSize(this._nextActiveEle);
        this._setSpeed(false, parentNode);
        parentNode.style.transform = `translateX(-${total}px)`;
        this._nextActiveEle.classList.add(this._activeClass);
        this._activeEle.classList.remove(this._activeClass);
        this._selectedSlide(index);
        this._handleCallback(index);
        if (this._destoryBindAnimation) {
            return true;
        }
        this._destoryBindAnimation = this._bindAnimation(this._activeEle.parentNode, () => {
            this._activeEle = this._nextActiveEle;
            this._nextActiveEle = null;
            if (this._runQueue() || this._isPaused) return;
            this.play(this._isScrollRight, this.autoplay);
        });
        return true;
    }
    destroy() {
        this._isPaused = true;
        this._queue = null;
        this._setTimeout && clearTimeout(this._setTimeout);
        this._DragMove && this._DragMove.destroy();
        this._DragMove = null;
        this._destoryBindAnimation && this._destoryBindAnimation();
    }
}
