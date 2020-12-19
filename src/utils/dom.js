import { typeOf, throttle } from "./tool";

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

export const AnimationFrame = (function () {
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
    return {
        requestFrame(fn) {
            return requestFrame(fn);
        },
        cancelFrame(id) {
            return cancelFrame(id);
        }
    };
})();

export const EventListener = (function () {
    if (document.addEventListener) {
        let on = function (element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                eventList.forEach(event => {
                    // element.removeEventListener(event, handler, false);
                    element.addEventListener(event, handler, false);
                });
            }
        },
            off = function (element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach(event => {
                        element.removeEventListener(event, handler, false);
                    });
                }
            };
        return { on, off };
    } else if (document.attachEvent) {
        let on = function (element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                eventList.forEach(event => {
                    // element.detachEvent('on' + event, handler);
                    element.attachEvent("on" + event, handler);
                });
            }
        },
            off = function (element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach(event => {
                        element.detachEvent("on" + event, handler);
                    });
                }
            };
        return { on, off };
    } else {
        let on = function (element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                eventList.forEach(event => {
                    element["on" + event] = handler;
                });
            }
        },
            off = function (element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach(event => {
                        element["on" + event] = null;
                    });
                }
            };
        return { on, off };
    }
})();

export const throttleEvent = function (type, name, obj) {
    obj = obj || window;
    var requestFrame = AnimationFrame.requestFrame,
        running = false,
        func = function () {
            if (running) return;
            running = true;
            requestFrame(function () {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
    EventListener.on(obj, type, func);
};

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
export const Mutation = (function () {
    const mutationObserver =
        window.MutationObserver ||
        window.WebkitMutationObserver ||
        window.MozMutationObserver ||
        window.MsMutationObserver;
    if (!mutationObserver)
        return {
            observer: function (dom, options = {}, callbck) {
                EventListener.on(dom, "DOMAttrModified", callbck);
                return dom;
            },
            destroy: function (dom, callbck) {
                if (dom) EventListener.off(dom, "DOMAttrModified", callbck);
            }
        };
    return {
        observer: function (dom, options = {}, callbck) {
            let instance = new mutationObserver(callbck);
            instance.observe(dom, options);
            return instance;
        },
        destroy: function (observer, callbck) {
            if (observer) observer.disconnect();
        }
    };
})();

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

let cached;
export function getScrollBarSize(fresh) {
    if (fresh || cached === undefined) {
        const inner = document.createElement("div");
        inner.style.width = "100%";
        inner.style.height = "200px";
        const outer = document.createElement("div");
        const outerStyle = outer.style;
        outerStyle.position = "absolute";
        outerStyle.top = 0;
        outerStyle.left = 0;
        outerStyle.pointerEvents = "none";
        outerStyle.visibility = "hidden";
        outerStyle.width = "200px";
        outerStyle.height = "150px";
        outerStyle.overflow = "hidden";
        outer.appendChild(inner);
        document.body.appendChild(outer);
        const widthContained = inner.offsetWidth;
        outer.style.overflow = "scroll";
        let widthScroll = inner.offsetWidth;
        if (widthContained === widthScroll) widthScroll = outer.clientWidth;
        document.body.removeChild(outer);
        cached = widthContained - widthScroll || 8;
    }
    return cached;
}

// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
    const difference = Math.abs(from - to);
    const step = Math.ceil((difference / duration) * 50);
    function scroll(start, end, step) {
        if (start === end) return;

        let d = start + step > end ? end : start + step;
        if (start > end) {
            d = start - step < end ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        AnimationFrame.requestFrame(function () {
            scroll(d, end, step);
        });
    }
    scroll(from, to, step);
}

export class ScrollLoad {
    constructor(element, options /*options = { offset: 60 }*/) {
        let type = typeOf(options),
            callback = function () {
                console.warn("%c is not function", callback);
            },
            _options = { offset: 60 };
        if (type === "function") {
            callback = options;
        } else if (options === "object") {
            if (typeof options.callback === "function") {
                callback = toptions.callback;
            }
            _options = { offset: 60, ...options };
        }
        this._element = element;
        this._options = _options;
        this.handler = throttle(callback, 16.7);
        this._callback = this._handler.bind(this);
        this._isLoad = false;
    }
    _handler(event) {
        const target = event.target,
            bool =
                target.scrollHeight - target.clientHeight - target.scrollTop <
                this._options.offset;
        event.stopPropagation();
        if (bool) {
            if (this._isLoad) return;
            this._isLoad = true;
            this.handler(event);
        } else {
            this._isLoad = false;
        }
    }
    binding() {
        EventListener.on(this._element, "scroll", this._callback);
    }
    update(element, options) {
        EventListener.off(this._element, "scroll", this._callback);
        this._element = element || this._element;
        this._options = Object.assign(this._options, options);
        EventListener.on(this._element, "scroll", this._callback);
    }
    destroy() {
        EventListener.off(this._element, "scroll", this._callback);
    }
}

export class ClassList {
    constructor() { }
    static contains(el, cls = "") {
        if (!el || !cls) return false;
        const className = el.className.split(/\s+/g);
        cls = cls.split(/\s+/g);
        return !cls.some(val => {
            return className.indexOf(val) == -1;
        });
    }
    static add(el, cls = "") {
        if (!el || !cls) return;
        const className = el.className.split(/\s+/g);
        cls = cls.split(/\s+/g);
        cls.forEach(val => {
            className.push(val);
        });
        el.className = className.join(" ");
    }
    static remove(el, cls = "") {
        if (!el || !cls) return;
        const className = el.className.split(/\s+/g);
        cls = cls.split(/\s+/g);
        cls.forEach(val => {
            const index = className.indexOf(val);
            if (index > -1) className.splice(index, 1);
        });
        el.className = className.join(" ");
    }
    static toggle(el, cls = "") {
        if (!el || !cls) return;
        const className = el.className.split(/\s+/g);
        cls = cls.split(/\s+/g);
        cls.forEach(val => {
            const index = className.indexOf(val);
            if (index > -1) {
                className.splice(index, 1);
            } else {
                className.push(val);
            }
        });
        el.className = className.join(" ");
    }
}

export function setMatchMedia() {
    if (typeof window !== "undefined") {
        const matchMediaPolyfill = mediaQuery => {
            return {
                media: mediaQuery,
                matches: false,
                on() { },
                off() { }
            };
        };
        window.matchMedia = window.matchMedia || matchMediaPolyfill;
    }
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

export function getClientSize(type) {
    const body = document.body,
        html = document.documentElement || {},
        width = body.clientWidth || 0,
        height = body.clientHeight || 0,
        innerWidth = window.innerWidth || 0,
        innerHeight = window.innerHeight || 0,
        htmlWidth = html.clientWidth || 0,
        htmlHeight = html.clientHeight || 0,
        sizeWidth = [width, innerWidth, htmlWidth].filter(function (val) {
            return typeof val === "number" && val > 0;
        }),
        sizeHeight = [height, innerHeight, htmlHeight].filter(function (val) {
            return typeof val === "number" && val > 0;
        });
    let size = {
        document: {
            width: Math.max(...sizeWidth),
            height: Math.max(...sizeHeight)
        },
        viewport: {
            width: Math.min(...sizeWidth),
            height: Math.min(...sizeHeight)
        },
        window: window.screen
    };
    return size[type] ? size[type] : size;
}

export class DragMove {
    constructor(element, callback) {
        this._element = element;
        this.handler = throttle(
            typeOf(callback) === "function"
                ? callback
                : function () {
                    console.warn("%c is not function", callback);
                },
            16.7
        );
        this._callback = this._handlerCallback.bind(this);
        this._initAxis = this._handlerInitAxis.bind(this);
        this._cancel = this._handlerCancel.bind(this);
        this._isBind = this._isRun = false;
        this._axis = null;
        this._distance = this._fixed = [0, 0];
    }
    _handlerInitAxis(event = {}) {
        // 处理鼠标左右键同安绑定多个事件
        this._axis = [event.clientX, event.clientY];
        if (this._isRun) return;
        this._isRun = true;
        EventListener.on(document, "mousemove", this._callback);
        EventListener.on(document, "mouseup", this._cancel);
        // this._element.style.cursor = "move";
        // this._element.style.userSelect = "none";
    }
    _handlerCallback(event) {
        const axis = this._axis,
            { clientX, clientY } = event,
            x = clientX - axis[0],
            y = clientY - axis[1];
        this._distance = [x + this._distance[0], y + this._distance[1]];
        this._fixed = [x + this._fixed[0], y + this._fixed[1]];
        this._axis = [clientX, clientY];
        this.handler({
            absolute: this._distance,
            fixed: this._fixed,
            relative: [x, y],
            element: this._element,
            run: true
        });
    }
    _handlerCancel() {
        EventListener.off(document, "mousemove", this._callback);
        EventListener.off(document, "mouseup", this._cancel);
        const absolute = this._distance;
        this._distance = [0, 0];
        // this._element.style.userSelect = "";
        this._isRun = false;
        this.handler({
            absolute,
            relative: [0, 0],
            fixed: this._fixed,
            element: this._element,
            run: false
        });
    }
    binding() {
        if (this._isBind) return this;
        EventListener.on(this._element, "mousedown", this._initAxis);
    }

    update(element, options) {
        this.destroy();
        this._isBind = true;
        this._element = element || this._element;
        EventListener.on(this._element, "mousedown", this._initAxis);
    }

    destroy() {
        this._isBind = this._isRun = false;
        this._axis = null;
        this._distance = [0, 0];
        EventListener.off(document, "mousemove", this._callback);
        EventListener.off(this._element, "mousedown", this._initAxis);
        EventListener.off(document, "mouseup", this._cancel);
    }
}

export class ClickOut {
    constructor(elements, callback) {
        this._elements = elements;
        this.handler =
            typeOf(callback) === "function"
                ? callback
                : function () {
                    console.warn("%c is not function", callback);
                };
        this._callback = this._handlerCallback.bind(this);
        this._isBind = false;
    }
    // _contains(target, parent) {
    //     while (target) {
    //         console.log(target, parent)
    //         if (target === parent) {
    //             return true;
    //         }
    //         if (/^(html|body)$/i.test(target.tagName)) return;
    //         target = target.parentNode;
    //     }
    // }
    _handlerCallback(event) {
        let target = event.target,
            elements = this._elements;
        if (typeOf(elements) !== "array") elements = [elements];
        const bool = !target ? false : elements.some((element) => {
            return element === target || element.contains(target);
        });
        this.handler(!bool, 'clickout');
    }
    binding() {
        if (this._isBind) return this;
        EventListener.off(document, "click", this._callback);
        EventListener.on(document, "click", this._callback);
        return this;
    }
    update(elements, options) {
        this._elements = elements || this._elements;
    }
    destroy() {
        this._isBind = false;
        EventListener.off(document, "click", this._callback);
    }
}
