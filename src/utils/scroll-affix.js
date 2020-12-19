import { EventListener } from '../utils/dom';
import Offset from '../utils/offset';
import { throttle } from './tool';

export default class Affix {
    constructor(options, callback) {
        this.callback = typeof callback === 'function' && callback;
        this.offsetTop = options.offsetTop;
        this.offsetBottom = options.offsetBottom;
        this.zIndex = options.zIndex;
        this.listener = options.listener instanceof HTMLElement ? options.listener : window;
        this.update = throttle(this._update.bind(this), 120);
    }
    init(el) {
        this.destroy();
        this.el = el;
        EventListener.on(this.listener, 'scroll,resize', this.update);
        const replaceNode = this.replaceNode = el.cloneNode(true);
        replaceNode.style.display = 'none';
        replaceNode.style.visibility = 'hidden';
        el.parentNode.insertBefore(replaceNode, el);
        this._init = true;
    }
    resetOpt(options, callback) {
        const { offsetTop, offsetBottom, zIndex, listener } = options;
        this.callback = typeof callback === 'function' && callback;
        if (offsetTop !== undefined) this.offsetTop = offsetTop;
        if (offsetBottom !== undefined) this.offsetBottom = offsetBottom;
        if (zIndex !== undefined) this.zIndex = zIndex;
        if (listener !== this.listener && listener instanceof HTMLElement) {
            EventListener.off(this.listener, 'scroll,resize', this.update);
            this.listener = listener;
            EventListener.on(listener, 'scroll,resize', this.update);
        }
    }
    _update(event) {
        if (!this.el || !this._init) return;
        if (event && event.type === 'resize') {
            setTimeout(() => {
                this._update();
            }, 60)
            return;
        }
        const style = this.el.style;
        const clientRect = Offset.boundingClientRect(this.replaceNode.style.display !== 'none' ? this.replaceNode : this.el);
        if (this.offsetTop > 0 && this.offsetTop > clientRect.top) {
            style.position = 'fixed';
            this.replaceNode.style.display = '';
            style.transition = "top 0.1s";
            style.width = `${clientRect.width}px`;
            style.height = `${clientRect.height}px`;
            style.top = `${this.offsetTop}px`;
            style.left = `${clientRect.left}px`;
            style.zIndex = this.zIndex;
            style.bottom = '';
            if (!this._change) this.callback && this.callback('top')
            this._change = 'top';
            return;
        }
        const viewport = Offset.getClientSize('viewport');
        if (this.offsetBottom > 0 && viewport.height - clientRect.bottom < this.offsetBottom) {
            style.position = 'fixed';
            this.replaceNode.style.display = '';
            style.transition = "bottom  0.1s";
            style.width = `${clientRect.width}px`;
            style.height = `${clientRect.height}px`;
            style.bottom = `${this.offsetBottom}px`;
            style.left = `${clientRect.left}px`;
            style.zIndex = this.zIndex;
            style.top = '';
            if (!this._change) this.callback && this.callback('bottom')
            this._change = 'bottom';
            return;
        }
        if (this._change) this.callback && this.callback();
        this._change = style.transition = style.width = style.height = style.position = style.top = style.bottom = style.left = style.zIndex = '';
        this.replaceNode.style.display = 'none';
    }
    destroy() {
        try {
            this._init = false;
            EventListener.off(this.listener, 'scroll,resize', this.update);
            this.el && this.replaceNode && this.el.parentNode.removeChild(this.replaceNode);
        } catch (error) {
            //
        }
    }
}