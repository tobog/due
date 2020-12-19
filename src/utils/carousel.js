
import { EventListener } from '../utils/dom'
export default class Carousel {
    constructor(el, options, callback) {
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
    _getElementSibling(isRight) {
        const activeEle = this.el.querySelector(`.${this._activeClass}`) || this._children[0];
        if (!activeEle) {
            return this._activeEle = this._eleSibling = null;
        }
        activeEle.classList.add(this._activeClass);
        this._activeEle = activeEle;
        if (isRight) {
            this._eleSibling = activeEle.previousElementSibling || (this.loop && activeEle.parentNode.lastElementChild);
        } else {
            this._eleSibling = activeEle.nextElementSibling || (this.loop && activeEle.parentNode.firstElementChild);
        }
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
    _once(el, callback) {
        let running;
        const _callback = function (event) {
            if (running) return;
            running = true;
            callback(event);
            EventListener.off(el, 'webkitTransitionEnd,transitionend', _callback);
        }
        EventListener.on(el, 'webkitTransitionEnd,transitionend', _callback);
    }
    _speed(isRemove) {
        if (this.speed) {
            const speed = isRemove ? '' : this.speed;
            this._activeEle && (this._activeEle.style.transitionDuartion = speed);
            this._eleSibling && (this._eleSibling.style.transitionDuartion = speed);
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
        this.autoplay = true;
        this._getChildren();
        this._getElementSibling(this.reverse);
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
        this._eleSibling = this._children[slideIndex];
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
        if (!this._getElementSibling(isRight)) return;
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
        const _eleSibling = this._eleSibling;
        if (!_eleSibling || this._children.length < 2) return;
        this._running = true;
        const activeEleClass = this._activeEle.classList,
            eleSiblingClass = _eleSibling.classList;
        let preNextClass, rightLeftClass;
        if (isRight) {
            preNextClass = this._preClass;
            rightLeftClass = this._rightClass;
        } else {
            preNextClass = this._nextClass;
            rightLeftClass = this._leftClass;
        }
        eleSiblingClass.add(preNextClass);
        this._speed();
        this._reflow(_eleSibling);
        eleSiblingClass.add(rightLeftClass);
        activeEleClass.add(rightLeftClass);
        const index = this._getChildIndex(_eleSibling);
        this._selectedSlide(index);
        this._handleCallback(index);
        this._once(_eleSibling, () => {
            eleSiblingClass.remove(preNextClass, rightLeftClass);
            activeEleClass.remove(this._activeClass, rightLeftClass);
            this._speed(true);
            eleSiblingClass.add(this._activeClass);
            this._activeEle = _eleSibling;
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