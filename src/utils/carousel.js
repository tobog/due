
import { EventListener, DragMove, getElement } from '../utils/dom'
export default class Carousel {
    constructor (el, options, callback) {
        if (!el) throw new Error("el must not be null");
        if (typeof options === 'function') {
            this._callback = options;
            options = {};
        } else if (typeof callback === 'function') {
            this._callback = callback;
        }
        const _prefix = options.prefix || "carousel"
        this.el = getElement(el);
        this._prefix = _prefix;
        this._listClass = `${_prefix}-list`;
        this._itemClass = `${_prefix}item`;
        this._activeClass = `${_prefix}-active`;
        this._leftClass = `${_prefix}-left`;
        this._nextClass = `${_prefix}-next`;
        this._rightClass = `${_prefix}-right`;
        this._preClass = `${_prefix}-pre`;
        this._cardNextClass = `${_prefix}-card-next`;
        this._cardPreClass = `${_prefix}-card-pre`;
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
            ...options
        });
        this.play();
    }
    _getNextActiveEle(isRight) {
        const activeEle = this.el.querySelector(`.${this._activeClass}`) || this.el.querySelector(`.${this._itemClass}[data-active]`) || this._children[0];
        if (!activeEle) {
            return this._activeEle = this._nextActiveEle = null;
        }
        activeEle.classList.add(this._activeClass);
        this._activeEle = activeEle;
        if (isRight) {
            this._nextActiveEle = activeEle.previousElementSibling || (this.loop && activeEle.parentNode.lastElementChild);
        } else {
            this._nextActiveEle = activeEle.nextElementSibling || (this.loop && activeEle.parentNode.firstElementChild);
        }
        this._getElementSibling(isRight);
        return true;
    }
    // mode card
    _getElementSibling(isRight) {
        if (this.mode !== 'card' || this._children.length < 2) return this._elementSiblings = null;
        const nextActiveEle = this._nextActiveEle;
        const activeEle = this._activeEle;
        if (!nextActiveEle) {
            return this._elementSiblings = null;
        }
        if (isRight) {
            this._elementSiblings = [nextActiveEle.previousElementSibling || nextActiveEle.parentNode.lastElementChild, activeEle.nextElementSibling || activeEle.parentNode.firstElementChild];
            nextActiveEle.classList.add(this._cardPreClass);
            this._elementSiblings[1].classList.add(this._cardNextClass);
        } else {
            this._elementSiblings = [activeEle.previousElementSibling || activeEle.parentNode.lastElementChild, nextActiveEle.nextElementSibling || nextActiveEle.parentNode.firstElementChild];
            nextActiveEle.classList.add(this._cardNextClass);
            this._elementSiblings[0].classList.add(this._cardPreClass);
        }
        return true;
    }
    // mode srcoll
    _setScrollData(isRight) {
        const nextActiveEle = this._nextActiveEle;
        if (!nextActiveEle || this.mode !== 'scroll') return false;
        const parentNode = nextActiveEle.parentNode;
        const isVertical = this.direction === ' === ';
        const maxData = isVertical ? (parentNode.scrollHeight - parentNode.parentNode.clientHeight) : (parentNode.scrollWidth - parentNode.parentNode.clientWidth);
        let data = isVertical ? nextActiveEle.offsetTop : nextActiveEle.offsetLeft;
        console.log(maxData, data)
        // if(isVertical)
        if (maxData < data) data = maxData;
        this._setSpeed(false, parentNode);
        parentNode.style.transform = isVertical ? `translateY(-${data}px)` : `translateX(-${data}px)`;
        nextActiveEle.classList.add(this._activeClass);
        this._activeEle.classList.remove(this._activeClass);
        const index = this._getChildIndex(nextActiveEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        if (data === maxData) return true;
        this._once(parentNode, () => {
            this._setSpeed(true, parentNode);
            this._activeEle = nextActiveEle;
            if (this._isPaused) return;
            this.play(isRight, this.autoplay);
        }, true)
        return true;
    }
    _getChildren() {
        const children = this.el.querySelectorAll(`.${this._itemClass}`)
        this._children = children ? [...children] : [];
        this._children.forEach(ele => {
            ele.classList.add(this._itemClass);
        })
        return this._children;
    }
    _getChildIndex(element) {
        return this._children.indexOf(element);
    }
    _once(el, callback, isOnce) {
        let running;
        const _callback = function (event) {
            if (running) return;
            running = !isOnce;
            callback(event);
            !isOnce && EventListener.off(el, 'webkitTransitionEnd,transitionend', _callback);
            this._onceBinded = isOnce;
        }
        if (!this._onceBinded) {
            this._onceBinded = isOnce;
            EventListener.on(el, 'webkitTransitionEnd,transitionend', _callback);
        }

    }
    _setSpeed(isRemove, ele, speed) {
        speed = speed || this.speed;
        if (speed) {
            speed = isRemove ? '' : speed + 'ms';
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
                    dom.classList.add(`${this._prefix}-dot-active`)
                } else {
                    dom.classList.remove(`${this._prefix}-dot-active`)
                }
            })
        }
    }
    update(options = {}) {
        options = { ...this._options, ...options };
        this._options = options
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
        if (this._options.touchmove && !this._DragMove) {
            const el = getElement(this._listClass, this.el) || this.el;
            this._DragMove = new DragMove(el, { style: null, cursor: null }, (obj) => {
                console.log(obj)
                this._stepMove(obj.distance, obj.cancel)
            });
            return;
        }
        if (!this._options.touchmove) {
            this._DragMove && this._DragMove.destroy();
            this._DragMove = null;
            return;
        }
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
            this._queue = ['slide', slideIndex];
            return
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
            this._queue = !this._queue && ['step', isRight];
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
    _stepMove(distance, isCancel) {
        if (this._running) return;
        const isRight = distance[0] > 0;
        console.log(distance, isRight);
        const isVertical = (this._options.direction || this.el.dataset.direction) === 'vertical';
        // 方向是否改变
        if (typeof this._isRight === 'boolean' && this._isRight !== isRight && this._nextActiveEle) {
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
        if (!this._touchMoveRuning && Math.abs(distance[0]/this._activeEle.offsetWidth) < 0.9) {
            console.log(Math.abs(distance[0]/this._activeEle.offsetWidth), this._touchMoveRuning);
            this._activeEle.style.transition = nextActiveEle.style.transition = 'transform 3000ms ease, opacity 100ms ease';
            // this._reflow(this._activeEle);
            this._activeEle.style.transform  = nextActiveEle.style.transform = '';
            // setTimeout(() => {
            //     // this._activeEle.style.transform = `translateX(0px)`;
            //     // nextActiveEle.style.transform = `translateX(${(this._isRight ? -1 : 1) * 100}%)`;
            //     this._activeEle.style.transform  = nextActiveEle.style.transform = '';
            // }, 10)
            // setTimeout(() => {
            //     this._setSpeed(true);
            //     this._nextActiveEle.classList.remove(this._isRight ? this._preClass : this._nextClass);
            //     this._touchMoveRuning = false;
            //     this.running = false;
            // }, 10)
            return;
        }
        nextActiveEleClass.add(preNextClass);
        this._activeEle.style.transition = nextActiveEle.style.transition = 'none';
        this._activeEle.style.transform = `translateX(${distance[0]}px)`;
        nextActiveEle.style.transform = `translateX(${nextActiveEle.offsetWidth * (this._isRight ? -1 : 1) + distance[0]}px)`;
        if (this._touchMoveRuning) return;
        this._running = true;
        this._isRight = false;
        this._activeEle.style.transition = nextActiveEle.style.transition = '';
        this._setSpeed();
        nextActiveEleClass.add(rightLeftClass);
        activeEleClass.add(rightLeftClass);
        const index = this._getChildIndex(nextActiveEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        this._once(nextActiveEle, () => {
            nextActiveEleClass.remove(preNextClass, rightLeftClass, this._cardNextClass, this._cardPreClass);
            activeEleClass.remove(this._activeClass, rightLeftClass);
            if (this._elementSiblings) {
                if (isRight) {
                    this._elementSiblings[1].classList.remove(this._cardNextClass);
                } else {
                    this._elementSiblings[0].classList.remove(this._cardPreClass);
                }
            }
            this._activeEle.style.transform = nextActiveEle.style.transform = this._activeEle.style.transition = this._activeEle.style.transition= '';
            this._setSpeed(true);
            nextActiveEleClass.add(this._activeClass);
            this._activeEle = nextActiveEle;
            if (this._runQueue() || this._isPaused) return;
            this.play(isRight, this.autoplay);
        })
    }
    _step(isRight = this.reverse) {
        console.log(isRight, 'isRight')
        const nextActiveEle = this._nextActiveEle;
        if (!nextActiveEle || this._children.length < 2 || this._setScrollData(isRight)) return;
        this._running = true;
        const activeEleClass = this._activeEle.classList,
            nextActiveEleClass = nextActiveEle.classList;
        if (this._elementSiblings) {
            if (isRight) {
                activeEleClass.add(this._cardNextClass);
                this._elementSiblings[0].classList.add(this._cardPreClass);
            } else {
                activeEleClass.add(this._cardPreClass);
                this._elementSiblings[1].classList.add(this._cardNextClass);
            }
        }
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
        const index = this._getChildIndex(nextActiveEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        this._once(nextActiveEle, () => {
            nextActiveEleClass.remove(preNextClass, rightLeftClass, this._cardNextClass, this._cardPreClass);
            activeEleClass.remove(this._activeClass, rightLeftClass);
            if (this._elementSiblings) {
                if (isRight) {
                    // activeEleClass.add(this._cardNextClass);
                    this._elementSiblings[1].classList.remove(this._cardNextClass);
                } else {
                    // activeEleClass.add(this._cardPreClass);
                    this._elementSiblings[0].classList.remove(this._cardPreClass);
                }
            }
            this._setSpeed(true);
            nextActiveEleClass.add(this._activeClass);
            this._activeEle = nextActiveEle;
            if (this._runQueue() || this._isPaused) return;
            this.play(isRight, this.autoplay);
        })
    }
    destroy() {
        this._isPaused = true;
        this._queue = null;
        this._setTimeout && clearTimeout(this._setTimeout);
        this._DragMove && this._DragMove.destroy();
        this._DragMove = null;
    }
}