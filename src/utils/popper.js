import { getStyle, EventListener } from "./dom";
import { typeOf, throttle } from "./tool";
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
    constructor(reference, popper, options = {}) {
        this._options = {
            placement: "bottom",
            gpu: false,
            offset: 5,
            positionElement: null,
            responsive: true,
            animationframe: 160,
            ...options
        };
        this.update = throttle(this._update.bind(this), this._options.animationframe || 160,true);
        this._scrollNodes = [];
        this._merge(reference, popper, options);
    }
    _merge(reference, popper, options = {}) {
        this._reference = reference || this._reference;
        this._popper = popper || this._popper;
        this._options = Object.assign({}, this._options, options);
        if (this._options.transfer) this._options.positionElement = document.body;
        if (!/html/i.test(typeOf(this._options.boundaryElement))) this._options.boundaryElement = null;
    }
    _on() {
        this._listener = true;
        this._scrollNodes.forEach(function (node) {
            EventListener.on(node, "resize,scroll", this.update);
        }, this);
    }
    _off() {
        this._scrollNodes.forEach(function (node) {
            EventListener.off(node, "resize,scroll", this.update);
        }, this);
        this._listener = false;
    }
    mounted(reference, popper, options) {
        this._merge(reference, popper, options);
        return this;
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
        }
    }
    _performance(event) {//防止抖动
        this._offsetParent = this._options.positionElement || this._popper.offsetParent || this._offsetParent;
        if ((!event || !event.target) && this._offsetParent) {
            const { top, left, right, bottom,offsetTop,offsetLeft } = this._preRefOffset || {}, reference = Offset.boundingClientRect(this._reference);
            const { height = '', width = '' } = Offset.boundingClientRect(this._popper);
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
                // this._preRefOffset = reference;
                return true;
            }
            this._parentstyle = this._offsetParent.style.overflow || "";
            this._offsetParent.style.overflow = "visible";
            this._preRefOffset = reference;
            this._prePopper = prePopper;
            this._popper.style.top=0;
        }
    }
    _update(event) {
        if (!this._reference || !this._popper) return;
        const displayNone = (getStyle(this._popper, 'display') || '').toLowerCase()==='none';
        if (displayNone|| this._performance(event)) return;
        console.log('_update')
        let data = {
            reference: Offset.getOffsetRect(this._reference, this._offsetParent),
            placement: this._options.placement.split("-"),
            popper: Offset.boundingClientRect(this._popper)
        };
        data = this.placementOverflow(data);
        data = this.placementOffset(data);
        data = this.offset(data);
        this._repalceComment();
        this.applyStyle(data);
        if (!this._listener) {
            this._scrollNodes = data.reference.scrollNodes;
            this._on();
        }
        return this;
    }
    destroy() {
        const popper = this._popper;
        if (!popper) return;
        popper.style.display = "none";
        popper.style.left = "";
        popper.style.position = "";
        popper.style.top = "";
        popper.style.transform = "";
        this._off();
        if(this._options.positionElement&&this._options.transfer){
            try {
                this._options.positionElement.removeChild(popper);
            } catch (error) {
                
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
            offset = (this._options.offset || 0) + 2;
        if (!this._options.responsive) {
            if ((basePlacement === "left" || basePlacement === "right") && (!shiftPlacement || shiftPlacement === basePlacement)) shiftPlacement = "top";
            data.placement = [basePlacement, shiftPlacement];
            return data;
        }
        let boundaries = this.getBoundaries(this._options.boundaryElement),
            // popper = data.popper,
            referenceRect = data.reference.rect,
            popperRect = data.popper,
            basePosition = {
                top: referenceRect.top - popperRect.height - offset > boundaries.top,
                bottom: referenceRect.bottom + popperRect.height + offset < boundaries.bottom,
                left: referenceRect.left - popperRect.width - offset > boundaries.left && referenceRect.top + popperRect.height + offset < boundaries.bottom,
                right: referenceRect.right + popperRect.width + offset < boundaries.right && referenceRect.top + popperRect.height + offset < boundaries.bottom
            },
            shiftPosition = {
                left: referenceRect.left + popperRect.width < boundaries.right,
                right: referenceRect.right - popperRect.width > boundaries.left,
                center: true
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
            shiftPlacement = shift || shiftPlacement || "left";
        }
        if ((basePlacement === "left" || basePlacement === "right") && (!shiftPlacement || shiftPlacement === basePlacement)) shiftPlacement = "top";
        data.placement = [basePlacement, shiftPlacement];
        return data;
    }
    offset(data) {
        let offset = this._options.offset,
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
                        rect: {
                            top: referenceRect.top - popperRect.height,
                            left: referenceRect.left
                        }
                    },
                    right: {
                        top: reference.top - popperRect.height,
                        left: reference.left + right,
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
                    }
                },
                bottom: {
                    left: {
                        top: reference.top + referenceRect.height,
                        left: reference.left,
                        rect: {
                            top: referenceRect.top + referenceRect.height,
                            left: referenceRect.left
                        }
                    },
                    right: {
                        top: reference.top + referenceRect.height,
                        left: reference.left + right,
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
        return { ...data, ...shiftOffsets[basePlacement][shiftPlacement] };
    }
    applyStyle(data) {
        const { left, top, placement } = data,
            { style = {}, callback, responsive = true, gpu } = this._options,
            styles = Object.assign(
                {
                    display: "block",
                    position: "absolute",
                    zIndex: 3221,
                    transformOrigin: placement[0] === "top" ? "center bottom" : "",
                    // transition: "top 0.1s,bottom 0.1s,height 0.2s"
                },
                style
            );
        if (placement[0] === "fix") {
            styles.position = "fixed";
        }
        if (responsive) {
            if (gpu) {
                styles.transform = "translate3d(" + left + "px, " + top + "px, 0)";
                styles.top = 0;
                styles.left = 0;
            } else {
                styles.left = left;
                styles.top = top;
            }
            this._popper.dataset["Xplacement"] = placement.join("-");
            setStyle(this._popper, styles);
            if (this._offsetParent) {
                this._offsetParent.style.overflow = this._parentstyle;
            }
        }
        if (typeof callback === "function")
            callback(data, this._popper, this._reference);
    }
}
