import { getStyle, EventListener, HoverOut, ClickOut } from "./dom";
import { throttle } from "./tool";
import Offset from "./offset";

function setStyle(element, styles = {}) {
    const is_numeric = function is_numeric(n) {
        return n !== "" && !isNaN(parseFloat(n)) && isFinite(n);
    };
    Object.keys(styles).forEach(function (prop) {
        var unit = "";
        if (["width", "height", "top", "right", "bottom", "left"].indexOf(prop) !== -1 && is_numeric(styles[prop])) {
            unit = "px";
        }
        element.style[prop] = styles[prop] + unit;
    });
}

export default class Popper {
    constructor (reference, popper, options = {}) {
        this._options = {
            placement: "bottom",
            gpu: false,
            offset: 5,
            positionElement: null,
            responsive: true,
            trigger: 'click',
            always: false,
            throttle: 140,
            delay: 0,
        }
        this._scrollNodes = [];
        this._showHide = this._handleShowHide.bind(this)
        this._setConfig(reference, popper, options);
        this._throttleUpdate = throttle(this._update.bind(this), this._options.throttle, true);

    }
    _getEles() {
        const eles = [];
        if (this._reference) eles.push(this._reference);
        if (this._popper) eles.push(this._popper);
        return eles;
    }
    _onHoverClick() {
        const trigger = this._options.trigger;
        const eles = this._getEles();
        if (!eles.length) return;
        if (trigger === 'click') {
            this._clickInstance = this._clickInstance ? this._clickInstance.update(eles) : new ClickOut(eles, this._showHide)
        }
        if (trigger === 'hover') {
            this._hoverInstance = this._hoverInstance ? this._hoverInstance.update(eles) : new HoverOut(eles, this._showHide)
        }
    }
    _handleShowHide(bool, event) {
        // console.log(bool, event,'-------------')
        if (this._options.always) {
            this.toggle(true);
            return;
        }
        if (bool) {
            this.toggle(false);
            return
        }
        if (this._options.trigger === 'click' && (event.type === 'click' || event.type === 'focusin')) {
            if (!bool) {
                this.toggle(true);
                return
            }
            this.toggle();
            return;
        }
        if (this._options.trigger === 'hover') {
            this.toggle(true)
        }
    }
    _setConfig(reference, popper, options = {}) {
        this._options = Object.assign(this._options, options);
        const placement = this._options.placement || "bottom";
        if (typeof placement === 'string') {
            this._options.placement = placement.split('-');
        }
        if (popper instanceof HTMLElement && this._popper !== popper) {
            this._popper = popper;
        }
        if (reference instanceof HTMLElement && this._reference !== reference) {
            this._off();
            this._reference = reference;
            this._onHoverClick();
        }
        if (!this._throttleUpdate) {
            this._throttleUpdate = throttle(this._update.bind(this), this._options.throttle, true);
        }
        this._options.positionElement = this._options.transfer ? document.body : null;
        if (!(this._options.boundaryElement instanceof HTMLElement)) this._options.boundaryElement = null;
    }
    _on() {
        this._listener = true;
        EventListener.on(window, "resize", this._throttleUpdate);
        this._scrollNodes.forEach(function (node) {
            EventListener.on(node, "scroll", this._throttleUpdate);
        }, this);
    }
    _off() {
        EventListener.off(window, "resize", this._throttleUpdate);
        this._scrollNodes.forEach(function (node) {
            EventListener.off(node, "scroll", this._throttleUpdate);
        }, this);
        this._scrollNodes = [];
        this._listener = false;
    }
    _getOnchange(...args) {
        const change = this._options.onchange;
        if (typeof change !== 'function') return;
        change.call(this, ...args);
    }

    //用于替换好保留位置
    _repalceComment() {
        // if (!this._popper) return;
        const { positionElement, transfer } = this._options;
        const parent = this._popper.parentNode;
        this._initParent = this._initParent || parent;
        if (transfer && positionElement && parent !== positionElement) {
            this._homeComment = this._homeComment || document.createComment('');
            parent.replaceChild(this._homeComment, this._popper);
            positionElement.appendChild(this._popper);
            return;
        }
        if (!transfer && parent === positionElement && this._homeComment) {
            this._initParent.replaceChild(this._popper, this._homeComment);
            this._homeComment = null;
        }
    }
    _performance(event) {//防止抖动
        this._offsetParent = this._options.positionElement || this._popper.offsetParent || this._offsetParent;
        const { height = '', width = '', top = 0 } = Offset.boundingClientRect(this._popper);
        if (height + top < -120) return true;
        if ((!event || !event.target) && this._offsetParent) {
            const { top, left, right, bottom, offsetTop, offsetLeft } = this._preRefOffset || {}, reference = Offset.boundingClientRect(this._reference);
            const prePopper = height + '&' + width;
            // console.log(reference,prePopper,{top, left, right, bottom,offsetTop,offsetLeft})
            if (
                top === reference.top &&
                left === reference.left &&
                right === reference.right &&
                bottom === reference.bottom &&
                offsetTop === reference.offsetTop &&
                offsetLeft === reference.offsetLeft &&
                prePopper === this._prePopper
            ) {
                return true;
            }
            this._parentOverflow = this._offsetParent.style.overflow || "";
            this._offsetParent.style.overflow = "visible";//hidden 在body下有滚动时窗口大小会变化
            this._resetPopperStyle({ top: -1000 });
            this._preRefOffset = reference;
            this._prePopper = prePopper;
            // alert(JSON.stringify(Offset.boundingClientRect(this._popper)))
        }
        if (event && event.type === 'resize') this._listener = false;

    }
    //回流
    // _reflow() {
    //     return this._reference.offsetHeight && this._popper.offsetHeight && this._options.offetWidth;
    // }
    _resetPopperStyle(style = {}) {
        let _popper = this._popper,
            initPopperWidth = _popper.dataset.initPopperWidth;
        if (initPopperWidth === void 0) {
            initPopperWidth = _popper.dataset.initPopperWidth = _popper.style.width || "";
        }
        setStyle(_popper, { width: initPopperWidth, top: 0, opacity: 0, ...style, ...(this._options.style || {}) });
    }
    _isDisplayNone() {
        return /^none/i.test(getStyle(this._popper, 'display') || '');
    }
    async _update(event) {
        if (this._running || !this._reference || !this._popper) return;
        const displayNone = this._isDisplayNone();
        if (!displayNone) this._repalceComment();
        if (displayNone || this._performance(event)) return;
        this._running = true;
        // console.log('popper running')
        await new Promise((resolve) => resolve());//阻塞更新视图后获取位置
        let data = {
            placement: this._options.placement,
            reference: Offset.getOffsetRect(this._reference, this._offsetParent),
            popper: Offset.boundingClientRect(this._popper)
        };
        data = this.placementOverflow(data);
        data = this.placementOffset(data);
        // console.log(data.popper)
        data = this.offset(data);
        await this.applyStyle(data);
        const popper = Offset.boundingClientRect(this._popper);
        // console.log(popper, 'popper2', data.popper.height < popper.height)
        if (data.popper.height < popper.height || data.popper.width > popper.width) {
            data.popper = popper;
            // data = this.placementOverflow(data);
            data = this.placementOffset(data);
            data = this.offset(data);
            await this.applyStyle(data);
        }
        if (!this._listener) {
            this._off();
            this._scrollNodes = data.reference.scrollNodes;
            this._on();
        }
        this._running = false;
    }
    _delayUpdate() {
        this._getOnchange('on-change-visible');
        if (this._options.delay > 0) {
            clearTimeout(this.__delayTimeout);
            this.__delayTimeout = setTimeout(() => {
                this._popper.style.display = 'inline-block'
                this._update();
                this.__delayTimeout = null;
            }, this._options.delay);
            return;
        }
        this._popper.style.display = 'inline-block'
        this._update();
    }
    async toggle(bool) {
        await Promise.resolve();
        const displayNone = this._isDisplayNone();
        clearTimeout(this.__delayTimeout);
        if (bool === void 0) {
            if (displayNone) {
                this._delayUpdate();
                return;
            }
            this._popper.style.display = 'none';
            this._getOnchange('on-change-hide');
            return
        }
        if (displayNone && (bool === true || bool === 'show')) {
            this._delayUpdate();
            return
        }
        if (!displayNone && (bool === false || bool === 'hide')) {
            this._popper.style.display = 'none';
            this._getOnchange('on-change-hide');
        }
    }
    update(reference, popper, options) {
        this._setConfig(reference, popper, options);
        this._throttleUpdate();
        return this;
    }
    destroy() {
        const popper = this._popper;
        this._clickInstance && this._clickInstance.destroy();
        this._hoverInstance && this._hoverInstance.destroy();
        this._clickInstance = this._hoverInstance = null;
        if (!popper) return;
        const style = popper.style,
            { positionElement, transfer } = this._options;
        style.display = "none";
        style.position = style.left = style.top = style.transform = "";
        this._off();
        clearTimeout(this.__delayTimeout);
        this._throttleUpdate.cancel();
        this._throttleUpdate = this.__delayTimeout = null;
        if (positionElement && transfer) {
            try {
                this._homeComment = null;
                positionElement.removeChild(popper);
                this._initParent.removeChild(this._homeComment);
            } catch (error) {
                // console.log(error)
            }
        }
        return this;
    }
    getBoundaries(boundaryElement) {
        if (boundaryElement) {
            return Offset.boundingClientRect(boundaryElement);
        } else {
            const size = Offset.getClientSize("viewport");
            return {
                top: 0,
                left: 0,
                bottom: size.height,
                right: size.width,
                ...size
            };
        }
    }
    placementOverflow(data) {
        let basePlacement = data.placement[0] || "bottom", //left,right,top,bottom
            shiftPlacement = data.placement[1], //left,right,top,bottom
            offset = this._options.offset * 1 + 2,
            boundaries = this._boundaries = this.getBoundaries(this._options.boundaryElement)
        if (!this._options.responsive) {
            if ((basePlacement === "left" || basePlacement === "right") && (!shiftPlacement || shiftPlacement === basePlacement)) shiftPlacement = "top";
            data.placement = [basePlacement, shiftPlacement];
            return data;
        }
        let referenceRect = data.reference.rect,
            popperRect = data.popper,
            basePosition = {
                top: referenceRect.top - popperRect.height - offset >= boundaries.top,
                bottom: referenceRect.bottom + popperRect.height + offset <= boundaries.bottom,
                left: referenceRect.left - popperRect.width - offset >= boundaries.left && referenceRect.top + popperRect.height + offset <= boundaries.bottom,
                right: referenceRect.right + popperRect.width + offset <= boundaries.right && referenceRect.top + popperRect.height + offset <= boundaries.bottom
            },
            shiftPosition = {
                left: referenceRect.left + popperRect.width < boundaries.right,
                right: referenceRect.right - popperRect.width > boundaries.left,
                center: referenceRect.right + popperRect.width / 2 <= boundaries.right && referenceRect.left - popperRect.width / 2 >= boundaries.left
            },
            sortOffset = null;
        switch (basePlacement) {
            case "left":
                sortOffset = ["left", "right", "bottom", "top"];
                break;
            case "right":
                sortOffset = ["right", "left", "bottom", "top"];
                break;
            case "bottom":
                sortOffset = ["bottom", "top", "left", "right"];
                break;
            // case 'bottom': sortOffset = ['bottom', 'top']; break;
            case "top":
                sortOffset = ["top", "bottom", "left", "right"];
                break;
            // case 'top': sortOffset = ['top', 'bottom']; break;
            default:
                sortOffset = ["bottom", "top", "left", "right"];
        }
        basePlacement =
            sortOffset.find(function (val) {
                return this[val];
            }, basePosition) || "fix";
        if ((basePlacement === "bottom" || basePlacement === "top" || basePlacement === "fix") && !shiftPosition[shiftPlacement]) {
            const shift = ["left", "right"].find(function (key) {
                return this[key];
            }, shiftPosition);
            // shiftPlacement = shift || shiftPlacement || "left";
            shiftPlacement = shift || "fix";
        }
        if ((basePlacement === "left" || basePlacement === "right") && (!shiftPlacement || shiftPlacement === basePlacement)) shiftPlacement = "top";
        data.placement = [basePlacement, shiftPlacement];
        return data;
    }
    offset(data) {
        let offset = this._options.offset * 1,
            placement = data.placement[0];
        if (placement === "left") {
            data.left -= offset;
            data.rect.left -= offset;
        } else if (placement === "right") {
            data.left += offset;
            data.rect.left += offset;
        } else if (placement === "top") {
            data.top -= offset;
            data.rect.top -= offset;
        } else if (placement === "bottom" || placement === "fix") {
            data.top += offset;
            data.rect.top += offset;
        }
        return data;
    }
    placementOffset(data) {
        const reference = data.reference,
            basePlacement = data.placement[0], //left,right,top,bottom
            shiftPlacement = data.placement[1], //left,right,top,bottom
            referenceRect = reference.rect,
            popperRect = data.popper,
            center = (popperRect.width - referenceRect.width) / 2,
            centerAlign = (popperRect.height - referenceRect.height) / 2,
            right = referenceRect.width - popperRect.width,
            boundariesRight = this._boundaries.right - referenceRect.right,
            isLeftZero = shiftPlacement === 'fix' && referenceRect.left <= boundariesRight,
            isArrow = popperRect.width - referenceRect.width > 0,
            shiftOffsets = {
                left: {
                    top: {
                        top: reference.top,
                        left: reference.left - popperRect.width,
                        rect: {
                            top: referenceRect.top,
                            left: referenceRect.left - popperRect.width
                        }
                    },
                    bottom: {
                        top: reference.top - centerAlign * 2,
                        left: reference.left - popperRect.width,
                        rect: {
                            top: referenceRect.bottom - popperRect.height,
                            left: referenceRect.left - popperRect.width
                        }
                    },
                    center: {
                        top: reference.top - centerAlign,
                        left: reference.left - popperRect.width,
                        rect: {
                            top: referenceRect.top - centerAlign,
                            left: referenceRect.left - popperRect.width
                        }
                    }
                },
                right: {
                    top: {
                        top: reference.top,
                        left: reference.left + referenceRect.width,
                        rect: {
                            top: referenceRect.top,
                            left: referenceRect.right
                        }
                    },
                    bottom: {
                        top: reference.top - centerAlign * 2,
                        left: reference.left + referenceRect.width,
                        rect: {
                            top: referenceRect.bottom - popperRect.height,
                            left: referenceRect.right
                        }
                    },
                    center: {
                        top: reference.top - centerAlign,
                        left: reference.left + referenceRect.width,
                        rect: {
                            top: referenceRect.top - centerAlign,
                            left: referenceRect.left + referenceRect.width
                        }
                    }
                },
                top: {
                    left: {
                        top: reference.top - popperRect.height,
                        left: reference.left,
                        arrow: isArrow ? referenceRect.width / 2 : 0,
                        rect: {
                            top: referenceRect.top - popperRect.height,
                            left: referenceRect.left
                        }
                    },
                    right: {
                        top: reference.top - popperRect.height,
                        left: reference.left + right,
                        arrow: isArrow ? (popperRect.width - referenceRect.width / 2) : 0,
                        rect: {
                            top: referenceRect.top - popperRect.height,
                            left: referenceRect.left + right
                        }
                    },
                    center: {
                        top: reference.top - popperRect.height,
                        left: reference.left - center,
                        rect: {
                            top: referenceRect.top - popperRect.height,
                            left: referenceRect.left - center
                        }
                    },
                    fix: {
                        top: reference.top - popperRect.height,
                        left: isLeftZero ? 0 : boundariesRight + referenceRect.right - popperRect.width,
                        arrow: isLeftZero ? (reference.left + referenceRect.width / 2) : (popperRect.width - boundariesRight - referenceRect.width / 2),
                        rect: {
                            top: referenceRect.top - popperRect.height,
                            left: isLeftZero ? 0 : boundariesRight,
                        }
                    }
                },
                bottom: {
                    left: {
                        top: reference.top + referenceRect.height,
                        left: reference.left,
                        arrow: isArrow ? referenceRect.width / 2 : 0,
                        rect: {
                            top: referenceRect.top + referenceRect.height,
                            left: referenceRect.left
                        }
                    },
                    right: {
                        top: reference.top + referenceRect.height,
                        left: reference.left + right,
                        arrow: isArrow ? (popperRect.width - referenceRect.width / 2) : 0,
                        rect: {
                            top: referenceRect.top + referenceRect.height,
                            left: referenceRect.left + right
                        }
                    },
                    center: {
                        top: reference.top + referenceRect.height,
                        left: reference.left - center,
                        rect: {
                            top: referenceRect.top + referenceRect.height,
                            left: referenceRect.left - center
                        }
                    },
                    fix: {
                        top: reference.top + referenceRect.height,
                        left: isLeftZero ? 0 : boundariesRight + referenceRect.right - popperRect.width,
                        arrow: isLeftZero ? (reference.left + referenceRect.width / 2) : (popperRect.width - boundariesRight - referenceRect.width / 2),
                        rect: {
                            top: referenceRect.top + referenceRect.height,
                            left: isLeftZero ? 0 : boundariesRight,
                        }
                    }
                },
                fix: {
                    left: {
                        top: 0,
                        left: referenceRect.left,
                        rect: {
                            top: 0,
                            left: referenceRect.left
                        }
                    },
                    right: {
                        top: 0,
                        left: referenceRect.left + right,
                        rect: {
                            top: 0,
                            left: referenceRect.left + right
                        }
                    },
                    center: {
                        top: 0,
                        left: referenceRect.left - center,
                        rect: {
                            top: 0,
                            left: referenceRect.left - center
                        }
                    }
                }
            };
        let pos = shiftOffsets[basePlacement][shiftPlacement];
        if (!pos) {
            pos = shiftOffsets[basePlacement]['left'];
            data.placement[1] = 'left';
        }
        // console.log(pos, JSON.stringify(data.popper), JSON.stringify(data.reference.rect))
        return { ...data, ...pos };
    }
    async applyStyle(data) {
        const { left, top, placement, arrow, popper } = data,
            { style = {}, callback, responsive = true, gpu } = this._options,
            styles = Object.assign(
                {
                    display: "inline-block",
                    opacity: '',
                    position: "absolute",
                    zIndex: 1000,
                    transformOrigin: placement[0] === "top" ? "center bottom" : "",
                    width: this._popper.dataset.initPopperWidth || popper.width,
                },
                style
            );
        if (placement[0] === "fix") {
            styles.position = "fixed";
        }
        // alert(JSON.stringify({left, top, placement}))
        if (responsive) {
            if (gpu) {
                styles.transform = "translate3d(" + left + "px, " + top + "px, 0)";
                styles.top = 0;
                styles.left = 0;
            } else {
                styles.left = left;
                styles.top = top;
            }
            this._getOnchange('on-change-before', styles, data)
            setStyle(this._popper, styles);
            if (this._offsetParent) {
                this._offsetParent.style.overflow = this._parentOverflow;
            }
            const [childArrow] = this._popper.children,
                placementString = placement.join("-");
            this._popper.dataset["placement"] = placementString;
            if (childArrow && childArrow.dataset.arrow) {
                childArrow.dataset.placement = arrow > 0 ? placementString : ''
                childArrow.style.left = arrow > 0 ? (arrow + 'px') : ''
            }
        }
        this._getOnchange('on-change-after', styles, data)
        if (typeof callback === "function") {
            return await callback(data, this._popper, this._reference);
        }

    }
}
