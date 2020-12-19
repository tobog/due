
import { EventListener } from '../utils/dom'
export default class Carousel {
    constructor (el, options, callback) {
        if (!el) throw new Error("el must be the HTMLElement");
        if (typeof options === 'function') {
            this._callback = options;
            options = {};
        } else if (typeof callback === 'function') {
            this._callback = callback;
        }
        const _prefix = options.prefix || "ui-carousel"
        this.el = el;
        this._prefix = _prefix;
        this._itemClass = `${_prefix}-item`;
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
        const isVertical = this.direction === 'vertical';
        const maxData = isVertical ? (parentNode.scrollHeight - parentNode.parentNode.clientHeight) : (parentNode.scrollWidth - parentNode.parentNode.clientWidth);
        let data = isVertical ? nextActiveEle.offsetTop : nextActiveEle.offsetLeft;
        console.log(maxData, data)
        // if(isVertical)
        if (maxData < data) data = maxData;
        this._speed(false, parentNode);
        parentNode.style.transform = isVertical ? `translateY(-${data}px)` : `translateX(-${data}px)`;
        nextActiveEle.classList.add(this._activeClass);
        this._activeEle.classList.remove(this._activeClass);
        const index = this._getChildIndex(nextActiveEle);
        this._selectedSlide(index);
        this._handleCallback(index);
        if (data === maxData) return true;
        this._once(parentNode, () => {
            this._speed(true, parentNode);
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
    _speed(isRemove, ele) {
        if (this.speed) {
            const speed = isRemove ? '' : this.speed;
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
        }, 0)
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
    _step(isRight = this.reverse) {
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
        this._speed();
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
            this._speed(true);
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
    }

}