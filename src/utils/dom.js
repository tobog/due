import { throttle } from "./tool";

export function getScroll() {
    const docEl = document.documentElement, body = document.body;
    if (body.scrollTop < docEl.scrollTop || body.scrollLeft < docEl.scrollLeft) return docEl;
    return body;
}

export function isScroll(element) {
    if (!element) return false;
    const data = ["scroll", "auto"];
    if (
        data.indexOf(getStyle(element, "overflow")) !== -1 ||
        data.indexOf(getStyle(element, "overflow-x")) !== -1 ||
        data.indexOf(getStyle(element, "overflow-y")) !== -1
    ) {
        return true;
    }
    return false;
}

export function transformStyle(transform = "") {
    const matrix = transform.replace(/[^0-9\-,]/g, '').split(',').filter(item => item !== "");
    // const getRotate=function (a, b, c, d, e, f) {
    //     var aa = Math.round(180 * Math.asin(a) / Math.PI);
    //     var bb = Math.round(180 * Math.acos(b) / Math.PI);
    //     var cc = Math.round(180 * Math.asin(c) / Math.PI);
    //     var dd = Math.round(180 * Math.acos(d) / Math.PI);
    //     var deg = 0;
    //     if (aa == bb || -aa == bb) {
    //         deg = dd;
    //     } else if (-aa + bb == 180) {
    //         deg = 180 + cc;
    //     } else if (aa + bb == 180) {
    //         deg = 360 - cc || 360 - dd;
    //     }
    //     return deg >= 360 ? 0 : deg;
    // }

    return matrix.length > 6 ? {
        translateX: parseFloat(matrix[11] || 0),
        translateY: parseFloat(matrix[12] || 0),
        // scaleX: parseFloat(matrix[0]),
        // scaleY: parseFloat(matrix[12]),
        // rotate: parseFloat(matrix[12]),

    } : {
            translateX: parseFloat(matrix[4] || 0),
            translateY: parseFloat(matrix[5] || 0),
            // scaleX: parseFloat(matrix[0]),
            // scaleY: parseFloat(matrix[3]),
            // rotate: parseFloat(matrix[12]),

        }
}

export function getStyles(element, pseudoElt = null) {
    if (!element) return null;
    let target,
        getComputedStyles =
            window.getComputedStyle ||
            (document.defaultView || {}).getComputedStyle;
    target = element.currentStyle;
    if (!target && getComputedStyles) {
        target = getComputedStyles(element, pseudoElt);
    }
    return target || '';
}

export function getStyle(element, styleName, pseudoElt = null) {
    if (!element || !styleName) return null;
    const style = getStyles(element, pseudoElt) || {};
    return style[styleName] || '';
}
let _AnimationFrame;
function InitAnimationFrame() {
    if (!window) return;
    const requestFrame =
        window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (fn) {
            return window.setTimeout(fn, 1000 / 60);
        },
        cancelFrame =
            window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.clearTimeout;
    return _AnimationFrame = {
        requestFrame(fn) {
            return requestFrame(fn);
        },
        cancelFrame(id) {
            return cancelFrame(id);
        }
    };
}
export const AnimationFrame = {
    requestFrame: function (fn) {
        if (!_AnimationFrame && !InitAnimationFrame()) return;
        return _AnimationFrame.requestFrame(fn)
    },
    cancelFrame: function (id) {
        if (!_AnimationFrame && !InitAnimationFrame()) return;
        return _AnimationFrame.cancelFrame(id)
    }
}


let _EventListener
function InitEventListener() {
    if (!document) return;
    if (document.addEventListener) {
        return _EventListener = {
            on: function (element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach(event => {
                        // element.removeEventListener(event, handler, false);
                        element.addEventListener(event, handler, false);
                    });
                }
            },
            off: function (element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach(event => {
                        element.removeEventListener(event, handler, false);
                    });
                }
            }
        }
    }
    if (document.attachEvent) {
        return _EventListener = {
            on: function (element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach(event => {
                        // element.detachEvent('on' + event, handler);
                        element.attachEvent("on" + event, handler);
                    });
                }
            },
            off: function (element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach(event => {
                        element.detachEvent("on" + event, handler);
                    });
                }
            }
        }
    }
    return _EventListener = {
        on: function (element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                eventList.forEach(event => {
                    element["on" + event] = handler;
                });
            }
        },
        off: function (element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                eventList.forEach(event => {
                    element["on" + event] = null;
                });
            }
        }
    }
}

export const EventListener = {
    on: function (element, events, handler) {
        if (!_EventListener && !InitEventListener()) return;
        return _EventListener.on(element, events, handler)
    },
    off: function (element, events, handler) {
        if (!_EventListener && !InitEventListener()) return;
        return _EventListener.off(element, events, handler)
    }
}


// export const throttleEvent = function (type, name, obj) {
//     obj = obj || window;
//     var requestFrame = AnimationFrame.requestFrame,
//         running = false,
//         func = function () {
//             if (running) return;
//             running = true;
//             requestFrame(function () {
//                 obj.dispatchEvent(new CustomEvent(name));
//                 running = false;
//             });
//         };
//     EventListener.on(obj, type, func);
// };

export const ObserverDomSize = function () {
    let stylesCreated = false,
        attachEvent = document.attachEvent;
    const { requestFrame, cancelFrame } = AnimationFrame;
    const resetTriggers = function (element) {
        // scrollLeft 改变会触发scroll事件
        var triggers = element.__resizeTriggers__;
        if (!triggers) return;
        var expand = triggers.firstElementChild,
            contract = triggers.lastElementChild,
            expandChild = expand.firstElementChild;
        contract.scrollLeft = contract.scrollWidth;
        contract.scrollTop = contract.scrollHeight;
        expandChild.style.cssText += ";width:" + expand.offsetWidth + 2 + "px;height:" + expand.offsetHeight + 2 + "px;";
        // expandChild.style.width = expand.offsetWidth + 2 + "px";
        // expandChild.style.height = expand.offsetHeight + 2 + "px";
        expand.scrollLeft = expand.scrollWidth;
        expand.scrollTop = expand.scrollHeight;
    },
        checkTriggers = function (element) {
            return (
                element.offsetWidth != element.__resizeLast__.width ||
                element.offsetHeight != element.__resizeLast__.height
            );
        },
        scrollListener = function (e) {
            // console.log(e.target);
            resetTriggers(this);
            if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
            this.__resizeRAF__ = requestFrame(() => {
                if (checkTriggers(this)) {
                    this.__resizeLast__.width = this.offsetWidth;
                    this.__resizeLast__.height = this.offsetHeight;
                    this.__resizeListeners__.forEach(function (fn) {
                        fn.call(this, e);
                    }, this);
                }
            });
        },
        // prefixStyle = function() {
        //     let elm = document.createElement("fakeelement"),
        //         animation = true,
        //         animationstring = "animation",
        //         keyframeprefix = "",
        //         animationstartevent = "animationstart",
        //         domPrefixes = ["webkit", "moz", "o", "ms"];
        //     if (elm.style.AnimationName !== undefined) animation = false;
        //     if (animation) {
        //         for (let i = 0, len = domPrefixes.length; i < len; i++) {
        //             let pfx = domPrefixes[i];
        //             if (elm.style[pfx + "AnimationName"] !== undefined) {
        //                 animationstring = pfx + "Animation";
        //                 keyframeprefix = "-" + pfx + "-";
        //                 animationstartevent = pfx + "AnimationStart";
        //                 animation = false;
        //                 break;
        //             }
        //         }
        //     }
        //     return {
        //         animationstring,
        //         keyframeprefix,
        //         animationstartevent
        //     };
        // },
        createStyles = function () {
            // const {
            //     animationstring,
            //     keyframeprefix,
            //     animationstartevent
            // } = prefixStyle();
            if (!stylesCreated) {
                // const css = `@${keyframeprefix}keyframes ${animationName} { from { opacity: 1; } to { opacity: 1; } }
                // .vview-custome-resize-triggers{${keyframeprefix}animation: 1ms ${animationName};visibility: vi; opacity: 1;height: 100px; width: 100%;position: relative;}
                // .vview-custome-resize-triggers, .vview-custome-resize-triggers > div, .vview-contract-resize-trigger:before
                // { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; }
                // .vview-custome-resize-triggers > div { background: #eee; overflow: auto; } .vview-contract-resize-trigger:before { width: 200%; height: 200%; }
                // .vview-custome-resize-triggers .vview-contract-resize-trigger{top:0;}
                // `,
                const css = ` .vview-custome-resize-triggers{visibility: hidden; opacity: 0;height: 0; width: 0;}
                .vview-custome-resize-triggers, .vview-custome-resize-triggers > div, .vview-contract-resize-trigger:before 
                { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; } 
                .vview-custome-resize-triggers > div { overflow: auto; } .vview-contract-resize-trigger:before { width: 200%; height: 200%; }
                .vview-custome-resize-triggers .vview-contract-resize-trigger{top:0;}
                `,
                    head =
                        document.head ||
                        document.getElementsByTagName("head")[0],
                    style = document.createElement("style");
                style.type = "text/css";
                if (style.styleSheet) {
                    style.styleSheet.cssText = css;
                } else {
                    style.appendChild(document.createTextNode(css));
                }
                head.appendChild(style);
                stylesCreated = true;
            }
        },
        addResizeListener = function (element, fn) {
            if (attachEvent) {
                element.attachEvent("onresize", fn);
            } else {
                if (!element.__resizeTriggers__) {
                    if (getStyle(element, "position") === "static")
                        element.style.position = "relative";
                    createStyles();
                    element.__resizeLast__ = {};
                    element.__resizeListeners__ = [];
                    const resizeTriggers = (element.__resizeTriggers__ = document.createElement("div"));
                    resizeTriggers.className = "vview-custome-resize-triggers";
                    resizeTriggers.innerHTML =
                        '<div class="vview-expand-resize-trigger"><div></div></div><div class="vview-contract-resize-trigger"></div>';
                    element.appendChild(resizeTriggers);
                    setTimeout(function () {
                        resetTriggers(element);
                        element.addEventListener(
                            "scroll",
                            scrollListener,
                            true
                        );
                        element.__resizeListeners__.push(fn);
                    }, 200);
                }
            }
        },
        removeResizeListener = function (element, fn) {
            if (attachEvent) {
                element.detachEvent("onresize", fn);
            } else {
                const resizeListeners = element.__resizeListeners__ || [];
                resizeListeners.splice(resizeListeners.indexOf(fn), 1);
                if (!resizeListeners.length) {
                    element.removeEventListener("scroll", scrollListener);
                    element.__resizeTriggers__ = !element.removeChild(
                        element.__resizeTriggers__
                    );
                }
            }
        };
    return {
        addResizeListener,
        removeResizeListener,
        reset: resetTriggers
    };
};

let _Mutation;
function _setMutation() {
    const mutationObserver =
        MutationObserver ||
        window.WebkitMutationObserver ||
        window.MozMutationObserver ||
        window.MsMutationObserver;
    if (mutationObserver) {
        _Mutation = {
            observer: function (dom, options = {}, callbck) {
                let instance = new mutationObserver(callbck);
                dom._mutationObserver_ = instance;
                instance.observe(dom, options);
                return instance;
            },
            destroy: function (dom) {
                if (dom._mutationObserver_) {
                    dom._mutationObserver_.disconnect();
                    dom._mutationObserver_ = null;
                }

            }
        }
    } else {
        _Mutation = {
            observer: function (dom, options = {}, callbck) {
                EventListener.on(dom, "DOMAttrModified", callbck);
                return dom;
            },
            destroy: function (dom, callbck) {
                if (dom) EventListener.off(dom, "DOMAttrModified", callbck);
            }
        }
    }
}
export const Mutation = {
    observer: function (dom, options = {}, callbck) {
        if (!_Mutation) _setMutation();
        _Mutation.observer(dom, options, callbck);
        return dom;
    },
    destroy: function (dom, callbck) {
        if (dom) {
            if (!_Mutation) _setMutation();
            _Mutation.destroy(dom, callbck);
        }
    }
}

export const Fullscreen = {
    _isFullscreen() {
        return !!(document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.webkitCurrentFullScreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement);
    },
    async request(dom, isInner) {
        if (!dom) return;
        if (!Fullscreen._request) {
            if (dom.requestFullscreen) {
                Fullscreen._request = "requestFullscreen";
            } else if (dom.webkitRequestFullscreen) {
                Fullscreen._request = "webkitRequestFullscreen";
            } else if (dom.webkitRequestFullScreen) {
                Fullscreen._request = "webkitRequestFullScreen";
            } else if (dom.mozRequestFullScreen) {
                Fullscreen._request = "mozRequestFullScreen";
            } else if (dom.msRequestFullscreen) {
                Fullscreen._request = "msRequestFullscreen";
            }
        }
        const dataset = dom.dataset;
        dataset.fullscreen = 1;
        if (isInner || !Fullscreen._request) {
            const setStyle = function (dom, style) {
                const keys = Object.keys(style);
                const styles = dom.style;
                keys.forEach(function (key) {
                    dataset["screen" + key] = styles[key];
                }, style);
                keys.forEach(function (key) {
                    styles[key] = this[key];
                }, style);
            };
            dataset.innerscreen = 1;
            setStyle(dom, {
                position: "fixed",
                width: '100vw',
                height: '100vh',
                margin: 0,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
            });
            return;
        }
        if (Fullscreen._request) {
            if (!Fullscreen._changeEvent) {
                if ('onfullscreenchange' in document) {
                    Fullscreen._changeEvent = 'fullscreenchange';
                } else if ('onwebkitfullscreenchange' in document) {
                    Fullscreen._changeEvent = 'webkitfullscreenchange';
                } else if ('onmozfullscreenchange' in document) {
                    Fullscreen._changeEvent = 'mozfullscreenchange';
                } else if ('onMSFullscreenChange' in document) {
                    Fullscreen._changeEvent = 'MSFullscreenChange';
                }
            }
            if (Fullscreen._changeEvent) {
                Fullscreen._handleChange = Fullscreen._handleChange || function (e) {
                    if (Fullscreen._isFullscreen()) {
                        console.log('进入全屏')
                    } else {
                        Fullscreen.exit(dom);
                    }
                }
                EventListener.on(document, 'fullscreenchange', Fullscreen._handleChange);
            }
            dom[Fullscreen._request]();
        }
    },
    async exit(dom) {
        if (!dom) return;
        const dataset = dom.dataset;
        dataset.fullscreen = '';
        if (!Fullscreen._exit) {
            if (document.exitFullscreen) {
                Fullscreen._exit = "exitFullscreen";
            } else if (document.webkitCancelFullScreen) {
                Fullscreen._exit = "webkitCancelFullScreen";
            } else if (document.webkitExitFullscreen) {
                Fullscreen._exit = "webkitExitFullscreen";
            } else if (document.mozCancelFullScreen) {
                Fullscreen._exit = "mozCancelFullScreen";
            } else if (document.msExitFullscreen) {
                Fullscreen._exit = "msExitFullscreen";
            }
        }
        if (dataset.innerscreen || !Fullscreen._exit) {
            const setStyle = function (dom, keys) {
                const styles = dom.style;
                keys.forEach(function (key) {
                    styles[key] = dataset["screen" + key];
                });
            };
            dataset.innerscreen = '';
            setStyle(dom, ["width", "height", "margin", "top", "left", "bottom", "right", "position"]);
            Fullscreen._handleChange = dom = null;
            return;
        }
        Fullscreen._isFullscreen() && document[Fullscreen._exit]();
        EventListener.off(document, Fullscreen._changeEvent, Fullscreen._handleChange);
        Fullscreen._handleChange = dom = null;
    },
    async toggle(dom) {
        const _isFullscreen = Fullscreen._isFullscreen();
        _isFullscreen ? Fullscreen.exit(dom) : Fullscreen.request(dom);
        return !_isFullscreen;
    }
};

let _cached;
export function getScrollBarSize(fresh) {
    if (fresh || _cached === undefined) {
        const inner = document.createElement("div");
        const outer = document.createElement("div");
        const outerStyle = outer.style;
        inner.style.width = "100%";
        inner.style.height = "100px";
        outerStyle.position = "absolute";
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = "none";
        outerStyle.visibility = "hidden";
        outerStyle.width = "100px";
        outerStyle.height = "50px";
        outerStyle.overflow = "hidden";
        outer.appendChild(inner);
        document.body.appendChild(outer);
        const widthContained = inner.offsetWidth;
        outer.style.overflow = "scroll";
        let widthScroll = inner.offsetWidth;
        if (widthContained === widthScroll) widthScroll = outer.clientWidth;
        document.body.removeChild(outer);
        _cached = widthContained - widthScroll || 8;
    }
    return _cached;
}

// scrollTop animation
// export function scrollTop(el, from = 0, to, duration = 500, endCallback) {
//     // const clientSize = getClientSize('viewport');
//     // const difference = Math.abs(from - to);
//     // const step = Math.ceil(difference / duration * 50);

//     // function scroll(start, end, step) {
//     //     if (start === end) {
//     //         endCallback && endCallback();
//     //         return;
//     //     }

//     //     let d = (start + step > end) ? end : start + step;
//     //     if (start > end) {
//     //         d = (start - step < end) ? end : start - step;
//     //     }

//     //     if (el === window) {
//     //         window.scrollTo(d, d);
//     //     }
//     //     AnimationFrame.requestFrame(() => scroll(d, end, step));
//     // }
//     // scroll(from, to, step);
// }

// export class ClassList {
//     // constructor() { }
//     static contains(el, cls = "") {
//         if (!el || !cls) return false;
//         const className = el.className.split(/\s+/g);
//         cls = cls.split(/\s+/g);
//         return !cls.some(val => {
//             return className.indexOf(val) == -1;
//         });
//     }
//     static add(el, cls = "") {
//         if (!el || !cls) return;
//         const className = el.className.split(/\s+/g);
//         cls = cls.split(/\s+/g);
//         cls.forEach(val => {
//             className.push(val);
//         });
//         el.className = className.join(" ");
//     }
//     static remove(el, cls = "") {
//         if (!el || !cls) return;
//         const className = el.className.split(/\s+/g);
//         cls = cls.split(/\s+/g);
//         cls.forEach(val => {
//             const index = className.indexOf(val);
//             if (index > -1) className.splice(index, 1);
//         });
//         el.className = className.join(" ");
//     }
//     static toggle(el, cls = "") {
//         if (!el || !cls) return;
//         const className = el.className.split(/\s+/g);
//         cls = cls.split(/\s+/g);
//         cls.forEach(val => {
//             const index = className.indexOf(val);
//             if (index > -1) {
//                 className.splice(index, 1);
//             } else {
//                 className.push(val);
//             }
//         });
//         el.className = className.join(" ");
//     }
// }

// export function setMatchMedia() {
//     if (typeof window !== "undefined") {
//         const matchMediaPolyfill = mediaQuery => {
//             return {
//                 media: mediaQuery,
//                 matches: false,
//                 on() { },
//                 off() { }
//             };
//         };
//         window.matchMedia = window.matchMedia || matchMediaPolyfill;
//     }
// }


export function getClientSize(type) {
    const body = document.body,
        html = document.documentElement || {};
    let size = {
        document: {
            width: html.scrollWidth || body.scrollWidth || 0,
            height: html.scrollHeight || body.scrollHeight || 0,
        },
        viewport: {
            width: window.innerWidth || html.clientWidth || body.clientWidth || 0,
            height: window.innerHeight || html.clientHeight || body.clientheight || 0
        },
        window: window.screen
    };
    return size[type] ? size[type] : size;
}

export class DragMove {
    constructor(element, options, callback) {
        this._options = {
            style: ['translateX', 'translateY'],
            boundaryElement: '',//添加边界元素,
            timeOut: null,
        }
        if (typeof options === "function") {
            callback = options;
            options = {};
        } else {
            callback = typeof callback === "function" ? callback : function (obj) {
                if (obj.cancel) return;
                const { data, distance, element, style, isTransform } = obj;
                const styles = element.style;
                if (isTransform) {
                    styles.transform = `translate(${data.translateX + distance[0]}px,${data.translateY + distance[1]}px)`
                } else {
                    style.forEach((key, index) => {
                        styles[key] = parseFloat(data[key]) + distance[index] + 'px';
                    })
                }
            }
        }
        this._setOptions(options);
        this._handler = throttle(callback, this._options.timeOut);
        this._element = element;
        this._isBind = this._isRun = false;
        this._initAxis = this._handlerInitAxis.bind(this);
        this._callback = this._handlerCallback.bind(this);
        this._cancel = this._handlerCancel.bind(this);
        this._binding();

    }
    _setOptions(options = {}) {
        this._options = Object.assign(this._options, options)
        const style = this._options.style;
        this._isTransform = style.indexOf('translateX') > -1 || style.indexOf('translateY') > -1
    }
    _binding() {
        if (this._isBind) return;
        this._isBind = true;
        EventListener.on(this._element, "mousedown", this._initAxis);
    }
    _getInitStyle() {
        const styles = getStyles(this._element);
        const { style, props } = this._options;
        if (this._isTransform && !props) {
            return transformStyle(styles.transform);
        }
        const target = {};
        if (props) {
            props.forEach((key) => {
                target[key] = this._element[key];
            })
        } else {
            style.forEach((key) => {
                target[key] = styles[key];
            })
        }
        return target;
    }
    _handlerInitAxis(event) {
        this._axis = [event.clientX, event.clientY];
        this._initOffset = this._getInitStyle();
        //设置样式  
        this._element.style.cursor = 'move';
        this._element.style.userSelect = "none";
        if (this._isRun) return;
        this._isRun = true;
        EventListener.on(document, "mousemove", this._callback);
        EventListener.on(document, "mouseup", this._cancel);
        EventListener.on(this._element, "mouseup", this._cancel);
    }
    _isMousemove(pos) {
        if (this._innerPos === pos) return;
        this._innerPos = pos;
        return true;
    }
    _handlerCallback(event) {
        if (event.stopPropagation) {
            event.stopPropagation()
        } else {
            window.event.cancelBubble = true;
        }
        const { clientX, clientY } = event;
        if (!this._isRun || !this._handler || !this._isMousemove(`${clientX}&${clientY}`)) return;
        const axis = this._axis, { style, props } = this._options;
        const distance = this._distance = [clientX - axis[0], clientY - axis[1]];
        this._handler({
            distance,
            data: this._initOffset,
            element: this._element,
            style,
            props,
            axis,
            isTransform: this._isTransform
        }, event);
    }
    _handlerCancel() {
        if (this._handler) {
            const axis = this._axis, { style, props } = this._options;
            this._handler({
                distance: this._distance,
                data: this._initOffset,
                element: this._element,
                style,
                props,
                axis,
                isTransform: this._isTransform,
                cancel: true,
            });
            this._distance = [0, 0]
        }
        this._isBind = this._isRun = false;
        this._element.style.cursor = this._element.style.userSelect = this._innerPos = '';
        EventListener.off(document, "mousemove", this._callback);
        EventListener.off(document, "mouseup", this._cancel);
        EventListener.off(this._element, "mouseup", this._cancel);
    }
    update(element, options) {
        this.destroy();
        this._element = element || this._element;
        this._setOptions(options);
        this._binding();
    }
    destroy() {
        this._handlerCancel();
        EventListener.off(this._element, "mousedown", this._initAxis);
    }
}

export class ClickOut {
    constructor(elements, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        this._options = {
            delay: 120,
            ...options
        }
        this._setElements(elements);
        this._callback = typeof callback === "function" && callback;
        this._handler = this._handlerCallback.bind(this);
        this._isBind = false;
        this._binding();
    }
    _setElements(elements) {
        elements = Array.isArray(elements) ? elements : [elements];
        this._elements = elements.filter((ele) => !!ele);
    }
    _handlerCallback(event) {
        if (!this._callback) return;
        const type = event.type;
        if (type === this._currentType) return;
        // console.log(type, event.target.className, event.timeStamp)
        this._currentType = type;
        clearTimeout(this._delayTime);
        const currentTarget = event.currentTarget;
        const cb = (target) => {
            const bool = !this._elements.some(element => element.contains(target));
            this._callback(bool, event, currentTarget);
        };
        if (type !== 'focusout') {
            cb(event.target);
            setTimeout(() => {
                this._currentType = this._delayTime = null;
            }, 30);
            return
        }
        this._delayTime = setTimeout(() => {
            cb(document.activeElement);
            this._currentType = this._delayTime = null;
        }, this._options.delay);
    }
    _binding() {
        if (this._isBind || !this._callback) return this;
        this._isBind = true;
        this._elements.forEach((element) => {
            const tabindex = element.getAttribute('tabindex');
            if (tabindex) {
                element.dataset.tabindex = tabindex;
            } else {
                element.setAttribute('tabindex', -1);
            }
            element.style.outline = "none";
            EventListener.on(element, "click,focusin,focusout", this._handler);
        })
        EventListener.on(document, "click", this._handler);
        return this;
    }
    update(elements) {
        if (elements) {
            this.destroy();
            this._setElements(elements);
            this._binding();
        }
    }
    destroy() {
        this._isBind = false;
        this._elements.forEach((element) => {
            if (!element.dataset.tabindex) {
                element.removeAttribute('tabindex');
            } else {
                element.dataset.tabindex = '';
            }
            element.style.outline = "none";
            EventListener.off(element, "click,focusin,focusout", this._handler);
            EventListener.off(document, "click", this._handler);
        })
        clearTimeout(this._delayTime);
    }
}

export class HoverOut {
    constructor(elements, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        this._options = {
            delay: 60,
            ...options
        }
        this._setElements(elements);
        this._callback = typeof callback === "function" && callback;
        this._handler = this._handlerCallback.bind(this);
        this._isBind = false;
        this._binding();
    }
    _setElements(elements) {
        elements = Array.isArray(elements) ? elements : [elements];
        this._elements = elements.filter((ele) => !!ele);
    }
    _handlerCallback(event) {
        if (!this._callback) return;
        const type = event.type;
        if (type === this._currentType) return;
        // console.log(type, event.target.className, event.timeStamp)
        this._currentType = type;
        clearTimeout(this._delayTime);
        const currentTarget = event.currentTarget;
        const cb = (bool) => {
            this._callback(bool, event, currentTarget);
            this._currentType = this._delayTime = null;
        };
        if (type !== 'mouseleave') return cb(false);
        this._delayTime = setTimeout(() => {
            cb(true);
        }, this._options.delay);
    }
    _binding() {
        if (this._isBind || !this._callback) return this;
        this._isBind = true;
        this._elements.forEach((element) => {
            EventListener.on(element, "mouseenter,mouseleave", this._handler);
        })
        return this;
    }
    update(elements, options) {
        if (elements) {
            this.destroy();
            this._setElements(elements);
            this._binding();
        }
        return this
    }
    destroy() {
        this._isBind = false;
        this._elements.forEach((element) => {
            EventListener.off(element, "mouseenter,mouseleave", this._handler);
        });
        clearTimeout(this._delayTime);
    }
}


export class ScrollSync {
    constructor(elements, options, callback) {
        this._options = {
            isPercent: false,//percent,
            isScrollTop: false,//left,
            throttle: 32,
        };

        if (typeof options === 'function') {
            this._callback = options;
            options = {};
        } else {
            this._callback = typeof callback === "function" && callback;
        }
        this._setElements(elements);
        this._setOptions(options);
        this._setScroll = throttle(this._setScroll.bind(this), this._options.throttle);
        this._handler = this._handlerCallback.bind(this);
        this._binding();
    }
    _setElements(elements) {
        if (Array.isArray(elements) && elements.length > 1) {
            this._elements = elements.map((ele) => {
                if (!ele) return;
                if (typeof ele === 'string') {
                    return document.querySelector(ele)
                }
                if (ele instanceof HTMLElement) {
                    return ele
                }
            }).filter((ele) => !!ele);
        }
    }
    _setOptions(options) {
        this._options = Object.assign(this._options, options);
    }
    _binding() {
        if (this._isBind || !this._elements) return this;
        this._isBind = true;
        this._elements.forEach((element) => {
            EventListener.on(element, "scroll", this._handler);
        })
        return this;
    }
    _handlerCallback(event) {
        event.stopPropagation();
        const currentTarget = event.currentTarget;
        if (this._runEle && this._runEle !== currentTarget) return;
        this._runEle = currentTarget;
        this._setScroll(currentTarget);
    }
    _setScroll(ele) {
        const { isPercent, isScrollTop } = this._options;
        const { scrollTop, scrollLeft, scrollHeight, clientHeight, clientWidth, scrollWidth } = ele,
            isDown = scrollTop > this._preScrollTop;
        this._preScrollTop = scrollTop;
        let value;
        if (isPercent) {
            value = isScrollTop ? (scrollTop / ((scrollHeight - clientHeight) || 1)) : (scrollLeft / ((scrollWidth - clientWidth) || 1))
        } else {
            value = isScrollTop ? scrollTop : scrollLeft;
        }
        this._elements.forEach(item => {
            if (item === ele) return;
            const { scrollHeight, clientHeight, clientWidth, scrollWidth } = item;
            if (isScrollTop) {
                item.scrollTop = isPercent ? value * (scrollHeight - clientHeight) : value
            } else {
                item.scrollLeft = isPercent ? value * (scrollWidth - clientWidth) : value
            }
        });
        this._callback && this._callback(ele, isDown);
        clearTimeout(this._delayTime);
        this._delayTime = setTimeout(() => {
            this._runEle = this._delayTime = null;
        }, 120);
    }
    sync(ele) {
        if (!this._elements) return;
        this._setScroll(ele);
    }
    update(elements, options = {}) {
        if (elements) {
            this.destroy();
            this._setElements(elements);
            this._setOptions(options);
            this._binding();
        }
        return this
    }
    destroy() {
        this._elements && this._elements.forEach((element) => {
            EventListener.off(element, "scroll", this._handler);
        });
        this._isBind = false;
        this._runEle = null;
        clearTimeout(this._delayTime);
    }
}



export class ScrollLoad {
    constructor(element, options /*options = { offset: 60 }*/, callback) {
        this._options = {
            offset: 60,
            isReachTop: false,
        }
        if (typeof options === "function") {
            callback = options;
            options = {}
        }
        this._element = element;
        this._setOptions(options);
        this._callback = typeof callback === 'function' && callback;
        this._handler = this._handlerCallback.bind(this);
        this._isRun = false;
        this._preScrollTop = 0;
        this._binding();
    }
    _setOptions(options) {
        this._options = Object.assign(this._options, options);
    }
    async _handlerCallback(event) {
        event.stopPropagation();
        const currentTarget = event.currentTarget,
            scrollTop = currentTarget.scrollTop,
            isDown = scrollTop > this._preScrollTop;
        this._preScrollTop = scrollTop;
        if (this._isRun) return;
        const { scrollHeight, clientHeight } = currentTarget,
            { isReachTop, offset } = this._options;
        let isEdge;
        if (isDown) {
            isEdge = scrollHeight - clientHeight - scrollTop - offset < 0;
        } else if (isReachTop) {
            isEdge = scrollTop - offset < 0;
        }
        if (isEdge) {
            this._isRun = true;
            this._preScrollTop = scrollTop;
            this._callback && await this._callback(isDown).catch(console.warn);
            this._delayTime = setTimeout(() => {
                this._isRun = false;
                this._delayTime = null;
            }, 100);
        }

    }
    _binding() {
        if (this._isBind || !this._element) return this;
        EventListener.on(this._element, "scroll", this._handler);
        this._isBind = true;
    }
    update(element, options = {}) {
        this._setOptions(options)
        if (element && this._element === element) return;
        this.destroy();
        this._binding();
    }
    destroy() {
        EventListener.off(this._element, "scroll", this._handler);
        this._isBind = this._isRun = false;
        clearTimeout(this._delayTime);
    }
}


