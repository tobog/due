import { throttle } from "./tool";
import Offset from "./offset";

export function getScroll(element, isAll) {
    const eles = [];
    const topEles = [];
    const { documentElement: docEl, body } = document;
    if (body.scrollHeight > body.clientHeight || body.scrollWidth > body.clientWidth) {
        topEles.push(body);
    }
    if (docEl.scrollHeight > docEl.clientHeight || docEl.scrollWidth > docEl.clientWidth) {
        topEles.push(docEl);
    }
    // 优化性能
    if (!isAll && topEles.length) {
        return topEles[topEles.length - 1];
    }
    while (element && (element = element.parentNode)) {
        if (element.tagName === "BODY") break;
        if (element.scrollHeight - element.offsetHeight > 1) {
            eles.push(element);
        }
    }
    if (topEles.length) {
        eles.push(...topEles);
    }

    return isAll ? eles : eles[eles.length - 1];
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

// scrollTop animation
export function scrollTop(el, to = 0, endCallback) {
    if (!el || el.scrollHeight - el.clientHeight - el.clientTop - el.clientBottom - 2 < 0) return;
    const from = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const step = Math.max(Math.ceil(Math.abs(from - to) / 10), 10);
    const scroll = function(start, end, step) {
        let d;
        if (start > end) {
            d = start - step <= end ? end : start - step;
        } else {
            d = start + step >= end ? end : start + step;
        }
        el.scrollTop = d;
        if (start === end || start <= 0 || start >= scrollHeight) {
            typeof endCallback === "function" && endCallback();
            return;
        }
        AnimationFrame.requestFrame(() => scroll(d, end, step));
    };
    scroll(from, to, step);
}

export function scrollIntoView(element, options, callback) {
    if (!element) return;
    if (typeof options === "function") {
        callback = options;
        options = {};
    }
    let { position = "start", behavior = "smooth" } = options;
    if (position === true) position = "start";
    if (position === false) position = "end";
    const posInt = parseInt(position);
    if (posInt !== posInt && element.scrollIntoView) {
        element.scrollIntoView({
            behavior,
            block: position,
        });
        typeof callback === "function" && callback();
        return;
    }
    const elePos = Offset.boundingClientRect(element, true);
    const elsScroll = getScroll(element);
    if (!posInt) {
        switch (position) {
            // case "start": position = 0; break;
            case "center":
                position = (elePos.viewHeight - elePos.height) / 2;
                break;
            case "end":
                position = elePos.viewHeight - elePos.height;
                break;
            default:
                position = 0;
        }
    } else {
        position = posInt;
    }
    if (behavior === "smooth") {
        scrollTop(elsScroll, elsScroll.scrollTop + elePos.top - position, callback);
    } else {
        elsScroll.scrollTop += elePos.top - position;
        typeof callback === "function" && callback();
    }
}

export function transformStyle(transform = "") {
    const matrix = transform
        .replace(/[^0-9\-,]/g, "")
        .split(",")
        .filter((item) => item !== "");
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

    return matrix.length > 6
        ? {
              translateX: parseFloat(matrix[11] || 0),
              translateY: parseFloat(matrix[12] || 0),
              // scaleX: parseFloat(matrix[0]),
              // scaleY: parseFloat(matrix[12]),
              // rotate: parseFloat(matrix[12]),
          }
        : {
              translateX: parseFloat(matrix[4] || 0),
              translateY: parseFloat(matrix[5] || 0),
              // scaleX: parseFloat(matrix[0]),
              // scaleY: parseFloat(matrix[3]),
              // rotate: parseFloat(matrix[12]),
          };
}

export function getElement(target, container) {
    container = container || document;
    if (target && typeof target === "string" && !!container) {
        try {
            return (
                container.querySelector(target) ||
                container.querySelector(`#${target}`) ||
                container.querySelector(`.${target}`)
            );
        } catch (error) {
            return;
        }
    }
    if (target instanceof HTMLElement) return target;
    return;
}
// 动态样式
export function loadStyle(data = "", selector) {
    if (!document) return;
    const isUrl = /^(https?:\/\/|\.*\/)[\w|W]+\.css$/gi.test(data);
    let dom = selector && getElement(selector, document.head);
    let hasDom = !!dom;
    if (!hasDom) {
        dom = document.createElement(isUrl ? "link" : "style");
    }
    const tag = dom.tagName.toUpperCase();
    if (isUrl && tag === "LINK") {
        dom.rel = "stylesheet";
        dom.type = "text/css";
        dom.href = data;
    }
    if (!isUrl && tag === "STYLE") {
        dom.type = "text/css";
        try {
            dom.appendChild(document.createTextNode(data.toString()));
        } catch (err) {
            dom.styleSheet.cssText = dom.innerText + ";" + data.toString();
        }
    }
    !hasDom && document.head.appendChild(dom);
}
export function loadScript(data = "", selector) {
    if (!document) return;
    const isUrl = /^(https?:\/\/|\.*\/)[\w|W]+\.css$/gi.test(data);
    let dom = selector && getElement(selector);
    let hasDom = !!dom;
    if (!hasDom) {
        dom = document.createElement("script");
    }
    dom.type = "text/javascript";
    if (isUrl) {
        dom.src = data;
    } else {
        try {
            dom.appendChild(document.createTextNode(data.toString()));
        } catch (err) {
            dom.text = dom.innerText + ";" + data.toString();
        }
    }
    !hasDom && document.body.appendChild(dom);
}
export function getStyles(element, pseudoElt = null) {
    if (!element) return null;
    let target = element.currentStyle;
    if (!target && window.getComputedStyle) {
        target = window.getComputedStyle(element, pseudoElt);
    }
    return target || "";
}

export function getStyle(element, styleName, pseudoElt = null) {
    if (!element || !styleName) return null;
    const style = getStyles(element, pseudoElt) || {};
    return style[styleName] || "";
}

let _AnimationFrame;
function InitAnimationFrame() {
    if (!window) return;
    const requestFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            function(fn) {
                return window.setTimeout(fn, 1000 / 60);
            },
        cancelFrame =
            window.cancelAnimationFrame ||
            window.mozCancelAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.clearTimeout;
    return (_AnimationFrame = {
        requestFrame(fn) {
            return requestFrame(fn);
        },
        cancelFrame(id) {
            return cancelFrame(id);
        },
    });
}
export const AnimationFrame = {
    requestFrame: function(fn) {
        if (!_AnimationFrame && !InitAnimationFrame()) return;
        return _AnimationFrame.requestFrame(fn);
    },
    cancelFrame: function(id) {
        if (!_AnimationFrame && !InitAnimationFrame()) return;
        return _AnimationFrame.cancelFrame(id);
    },
};

let _EventListener;
function InitEventListener() {
    if (!document) return;
    if (document.addEventListener) {
        return (_EventListener = {
            on: function(element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach((event) => {
                        element.addEventListener(event, handler, false);
                    });
                }
            },
            off: function(element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach((event) => {
                        element.removeEventListener(event, handler, false);
                    });
                }
            },
            once: function(element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    let onceHandler = function(event, ...agrs) {
                        event.currentTarget.removeEventListener(event.type, onceHandler, false);
                        return handler.call(this, event, ...agrs);
                    };
                    eventList.forEach((event) => {
                        element.addEventListener(event, onceHandler, false);
                    });
                }
            },
        });
    }
    if (document.attachEvent) {
        return (_EventListener = {
            on: function(element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach((event) => {
                        // element.detachEvent('on' + event, handler);
                        element.attachEvent("on" + event, handler);
                    });
                }
            },
            off: function(element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    eventList.forEach((event) => {
                        element.detachEvent("on" + event, handler);
                    });
                }
            },
            once: function(element, events, handler) {
                if (element && events && handler) {
                    let eventList = events.split(",");
                    let onceHandler = function(event, ...agrs) {
                        event.currentTarget.detachEvent("on" + event, onceHandler);
                        return handler.call(this, event, ...agrs);
                    };
                    eventList.forEach((event) => {
                        element.attachEvent("on" + event, onceHandler);
                    });
                }
            },
        });
    }
    return (_EventListener = {
        on: function(element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                eventList.forEach((event) => {
                    element["on" + event] = handler;
                });
            }
        },
        off: function(element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                eventList.forEach((event) => {
                    element["on" + event] = null;
                });
            }
        },
        once: function(element, events, handler) {
            if (element && events && handler) {
                let eventList = events.split(",");
                let onceHandler = function(event, ...agrs) {
                    event.currentTarget["on" + event] = null;
                    return handler.call(this, event, ...agrs);
                };
                eventList.forEach((event) => {
                    element["on" + event] = onceHandler;
                });
            }
        },
    });
}

export const EventListener = {
    on: function(element, events, handler) {
        if (!_EventListener && !InitEventListener()) return;
        return _EventListener.on(element, events, handler);
    },
    off: function(element, events, handler) {
        if (!_EventListener && !InitEventListener()) return;
        return _EventListener.off(element, events, handler);
    },
    once: function(element, events, handler) {
        if (!_EventListener && !InitEventListener()) return;
        return _EventListener.once(element, events, handler);
    },
};

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

// export const ObserverDomSize = function () {
//     let stylesCreated = false,
//         attachEvent = document.attachEvent;
//     const { requestFrame, cancelFrame } = AnimationFrame;
//     const resetTriggers = function (element) {
//         // scrollLeft 改变会触发scroll事件
//         var triggers = element.__resizeTriggers__;
//         if (!triggers) return;
//         var expand = triggers.firstElementChild,
//             contract = triggers.lastElementChild,
//             expandChild = expand.firstElementChild;
//         contract.scrollLeft = contract.scrollWidth;
//         contract.scrollTop = contract.scrollHeight;
//         expandChild.style.cssText +=
//             ";width:" + expand.offsetWidth + 2 + "px;height:" + expand.offsetHeight + 2 + "px;";
//         // expandChild.style.width = expand.offsetWidth + 2 + "px";
//         // expandChild.style.height = expand.offsetHeight + 2 + "px";
//         expand.scrollLeft = expand.scrollWidth;
//         expand.scrollTop = expand.scrollHeight;
//     },
//         checkTriggers = function (element) {
//             return (
//                 element.offsetWidth != element.__resizeLast__.width ||
//                 element.offsetHeight != element.__resizeLast__.height
//             );
//         },
//         scrollListener = function (e) {
//             // console.log(e.target);
//             resetTriggers(this);
//             if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
//             this.__resizeRAF__ = requestFrame(() => {
//                 if (checkTriggers(this)) {
//                     this.__resizeLast__.width = this.offsetWidth;
//                     this.__resizeLast__.height = this.offsetHeight;
//                     this.__resizeListeners__.forEach(function (fn) {
//                         fn.call(this, e);
//                     }, this);
//                 }
//             });
//         },
//         // prefixStyle = function() {
//         //     let elm = document.createElement("fakeelement"),
//         //         animation = true,
//         //         animationstring = "animation",
//         //         keyframeprefix = "",
//         //         animationstartevent = "animationstart",
//         //         domPrefixes = ["webkit", "moz", "o", "ms"];
//         //     if (elm.style.AnimationName !== void 0) animation = false;
//         //     if (animation) {
//         //         for (let i = 0, len = domPrefixes.length; i < len; i++) {
//         //             let pfx = domPrefixes[i];
//         //             if (elm.style[pfx + "AnimationName"] !== void 0) {
//         //                 animationstring = pfx + "Animation";
//         //                 keyframeprefix = "-" + pfx + "-";
//         //                 animationstartevent = pfx + "AnimationStart";
//         //                 animation = false;
//         //                 break;
//         //             }
//         //         }
//         //     }
//         //     return {
//         //         animationstring,
//         //         keyframeprefix,
//         //         animationstartevent
//         //     };
//         // },
//         createStyles = function () {
//             // const {
//             //     animationstring,
//             //     keyframeprefix,
//             //     animationstartevent
//             // } = prefixStyle();
//             if (!stylesCreated) {
//                 // const css = `@${keyframeprefix}keyframes ${animationName} { from { opacity: 1; } to { opacity: 1; } }
//                 // .vview-custome-resize-triggers{${keyframeprefix}animation: 1ms ${animationName};visibility: vi; opacity: 1;height: 100px; width: 100%;position: relative;}
//                 // .vview-custome-resize-triggers, .vview-custome-resize-triggers > div, .vview-contract-resize-trigger:before
//                 // { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; }
//                 // .vview-custome-resize-triggers > div { background: #eee; overflow: auto; } .vview-contract-resize-trigger:before { width: 200%; height: 200%; }
//                 // .vview-custome-resize-triggers .vview-contract-resize-trigger{top:0;}
//                 // `,
//                 const css = ` .vview-custome-resize-triggers{visibility: hidden; opacity: 0;height: 0; width: 0;}
//                 .vview-custome-resize-triggers, .vview-custome-resize-triggers > div, .vview-contract-resize-trigger:before
//                 { content: " "; display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; }
//                 .vview-custome-resize-triggers > div { overflow: auto; } .vview-contract-resize-trigger:before { width: 200%; height: 200%; }
//                 .vview-custome-resize-triggers .vview-contract-resize-trigger{top:0;}
//                 `,
//                     head = document.head || document.getElementsByTagName("head")[0],
//                     style = document.createElement("style");
//                 style.type = "text/css";
//                 if (style.styleSheet) {
//                     style.styleSheet.cssText = css;
//                 } else {
//                     style.appendChild(document.createTextNode(css));
//                 }
//                 head.appendChild(style);
//                 stylesCreated = true;
//             }
//         },
//         addResizeListener = function (element, fn) {
//             if (attachEvent) {
//                 element.attachEvent("onresize", fn);
//             } else {
//                 if (!element.__resizeTriggers__) {
//                     if (getStyle(element, "position") === "static") element.style.position = "relative";
//                     createStyles();
//                     element.__resizeLast__ = {};
//                     element.__resizeListeners__ = [];
//                     const resizeTriggers = (element.__resizeTriggers__ = document.createElement("div"));
//                     resizeTriggers.className = "vview-custome-resize-triggers";
//                     resizeTriggers.innerHTML =
//                         '<div class="vview-expand-resize-trigger"><div></div></div><div class="vview-contract-resize-trigger"></div>';
//                     element.appendChild(resizeTriggers);
//                     setTimeout(function () {
//                         resetTriggers(element);
//                         element.addEventListener("scroll", scrollListener, true);
//                         element.__resizeListeners__.push(fn);
//                     }, 200);
//                 }
//             }
//         },
//         removeResizeListener = function (element, fn) {
//             if (attachEvent) {
//                 element.detachEvent("onresize", fn);
//             } else {
//                 const resizeListeners = element.__resizeListeners__ || [];
//                 resizeListeners.splice(resizeListeners.indexOf(fn), 1);
//                 if (!resizeListeners.length) {
//                     element.removeEventListener("scroll", scrollListener);
//                     element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
//                 }
//             }
//         };
//     return {
//         addResizeListener,
//         removeResizeListener,
//         reset: resetTriggers,
//     };
// };

let _Mutation;
function _setMutation() {
    const mutationObserver =
        MutationObserver || window.WebkitMutationObserver || window.MozMutationObserver || window.MsMutationObserver;
    if (mutationObserver) {
        _Mutation = {
            observer: function(dom, options = {}, callbck) {
                let instance = new mutationObserver(callbck);
                dom._mutationObserver_ = instance;
                instance.observe(dom, options);
                return instance;
            },
            destroy: function(dom) {
                if (dom._mutationObserver_) {
                    dom._mutationObserver_.disconnect();
                    dom._mutationObserver_ = null;
                }
            },
        };
    } else {
        _Mutation = {
            observer: function(dom, options = {}, callbck) {
                EventListener.on(dom, "DOMAttrModified", callbck);
                return dom;
            },
            destroy: function(dom, callbck) {
                if (dom) EventListener.off(dom, "DOMAttrModified", callbck);
            },
        };
    }
}
export const Mutation = {
    observer: function(dom, options = {}, callbck) {
        if (!_Mutation) _setMutation();
        _Mutation.observer(dom, options, callbck);
        return dom;
    },
    destroy: function(dom, callbck) {
        if (dom) {
            if (!_Mutation) _setMutation();
            _Mutation.destroy(dom, callbck);
        }
    },
};

export const Fullscreen = {
    _isFullscreen() {
        return !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.webkitCurrentFullScreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
        );
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
            const setStyle = function(dom, style) {
                const keys = Object.keys(style);
                const styles = dom.style;
                keys.forEach(function(key) {
                    dataset["screen" + key] = styles[key];
                }, style);
                keys.forEach(function(key) {
                    styles[key] = this[key];
                }, style);
            };
            dataset.innerscreen = 1;
            setStyle(dom, {
                position: "fixed",
                width: "100vw",
                height: "100vh",
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
                if ("onfullscreenchange" in document) {
                    Fullscreen._changeEvent = "fullscreenchange";
                } else if ("onwebkitfullscreenchange" in document) {
                    Fullscreen._changeEvent = "webkitfullscreenchange";
                } else if ("onmozfullscreenchange" in document) {
                    Fullscreen._changeEvent = "mozfullscreenchange";
                } else if ("onMSFullscreenChange" in document) {
                    Fullscreen._changeEvent = "MSFullscreenChange";
                }
            }
            if (Fullscreen._changeEvent) {
                Fullscreen._handleChange =
                    Fullscreen._handleChange ||
                    function(e) {
                        if (Fullscreen._isFullscreen()) {
                            console.log("进入全屏");
                        } else {
                            Fullscreen.exit(dom);
                        }
                    };
                EventListener.on(document, "fullscreenchange", Fullscreen._handleChange);
            }
            dom[Fullscreen._request]();
        }
    },
    async exit(dom) {
        if (!dom) return;
        const dataset = dom.dataset;
        dataset.fullscreen = "";
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
            const setStyle = function(dom, keys) {
                const styles = dom.style;
                keys.forEach(function(key) {
                    styles[key] = dataset["screen" + key];
                });
            };
            dataset.innerscreen = "";
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
    },
};

let _cached;
export function getScrollBarSize(fresh) {
    if (fresh || _cached === void 0) {
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
//     if (typeof window !== "void 0") {
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
let CacheSize;
let isCanBindReSize;
export function getClientSize(type) {
    // 利用缓存
    if (!isCanBindReSize && document) {
        isCanBindReSize = true;
        EventListener.on(window, "resize", () => {
            CacheSize = null;
        });
    }
    if (CacheSize) return CacheSize[type] ? CacheSize[type] : CacheSize;
    const body = document.body,
        html = document.documentElement || {};
    let size = {
        document: {
            width: html.scrollWidth || body.scrollWidth || 0,
            height: html.scrollHeight || body.scrollHeight || 0,
        },
        viewport: {
            width: window.innerWidth || html.clientWidth || body.clientWidth || 0,
            height: window.innerHeight || html.clientHeight || body.clientheight || 0,
        },
        window: window.screen,
    };
    return size[type] ? size[type] : size;
}

export class DragMove {
    constructor(element, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = {};
        } else {
            callback = callback || (options && options.callback);
            callback =
                typeof callback === "function"
                    ? callback
                    : function(obj) {
                          if (obj.cancel || !obj.element) return;
                          const { data, distance, element, style, isTransform } = obj;
                          const styles = element.style;
                          if (isTransform) {
                              styles.transform = `translate(${data.translateX + distance[0]}px,${data.translateY +
                                  distance[1]}px)`;
                          } else {
                              style.forEach((key, index) => {
                                  styles[key] = parseFloat(data[key]) + distance[index] + "px";
                              });
                          }
                      };
        }
        this._options = {
            style: ["translateX", "translateY"],
            boundaryElement: null, //添加边界元素,
            timeOut: null,
            boundaryPoint: null, // {left,right,top,bottom}
            cursor: "move",
            triggerTime: "all", // all,over，
            boundaryCalc: true,
        };
        this._cbFn = callback;
        this._setOptions(options);
        this._handler = throttle(this._cbFn, this._options.timeOut);
        this._element = getElement(element);
        this._boundaryElement = getElement(this._options.boundaryElement);
        // 点击element 触发实际计算的是relatedElement
        this._relatedElement = getElement(this._options.relatedElement);
        this._isBind = this._isRun = false;
        this._initAxis = this._handleInitAxis.bind(this);
        this._callback = this._handleCallback.bind(this);
        this._cancel = this._handleCancel.bind(this);
        this._binding();
    }
    _setOptions(options = {}) {
        this._options = Object.assign(this._options, options);
        this._isTransform =
            this._options.style.indexOf("translateX") > -1 || this._options.style.indexOf("translateY") > -1;
    }
    _binding() {
        if (this._isBind) return;
        this._isBind = true;
        this._isCursorMove = false;
        if (this._element) {
            EventListener.on(this._element, "mousedown", this._initAxis);
        } else if (this._boundaryElement) {
            this._isCursorMove = true;
            EventListener.on(this._boundaryElement, "mousedown", this._initAxis);
        }
    }
    _getInitStyle(element) {
        if (!element) return {};
        const styles = getStyles(element);
        const { style, props } = this._options;
        if (this._isTransform && !props) {
            return transformStyle(styles.transform);
        }
        const target = {};
        if (props) {
            props.forEach((key) => {
                target[key] = element[key];
            });
        }
        if (style) {
            style.forEach((key) => {
                target[key] = styles[key];
            });
        }
        return target;
    }
    _handleBoundaryRange(event) {
        const boundaryData = this._boundaryElement ? Offset.boundingClientRect(this._boundaryElement) : null;
        if (!this._options.boundaryCalc) return boundaryData;
        if (boundaryData && event) {
            const { clientX, clientY } = event;
            const element = this._relatedElement || this._element;
            const eleData = element
                ? Offset.boundingClientRect(element)
                : {
                      left: clientX,
                      right: clientX,
                      top: clientY,
                      bottom: clientY,
                      width: 0,
                      height: 0,
                  };
            const { left = 0, right = 0, top = 0, bottom = 0 } = this._options.boundaryPoint || {};
            return {
                left: [
                    eleData.left - boundaryData.left,
                    left,
                    boundaryData.width - eleData.width - right,
                    boundaryData.right - eleData.right - right,
                ],
                right: [boundaryData.right - eleData.right, right, boundaryData.width - eleData.width - left],
                top: [
                    eleData.top - boundaryData.top,
                    top,
                    boundaryData.height - eleData.height - bottom,
                    boundaryData.bottom - eleData.bottom - bottom,
                ],
                bottom: [boundaryData.bottom - eleData.bottom, bottom, boundaryData.height - eleData.height - top],
            };
        }
        return null;
    }
    _handleInitAxis(event) {
        this._axis = this._tempAxis = [event.clientX, event.clientY];
        this._initOffset = this._getInitStyle(this._relatedElement || this._element);
        //设置样式
        this._initUserSelect = document.body.style.userSelect;
        if (this._element) {
            this._element.dataset.perCursor = this._element.style.cursor;
            this._element.style.cursor = this._options.cursor;
        }
        document.body.style.userSelect = "none";
        event.stopPropagation();
        // event.preventDefault();
        if (this._isRun) return;
        this._isRun = true;
        this._initTime = this._tempTime = Date.now();
        this._distance = [0, 0];
        EventListener.on(document, "mousemove", this._callback);
        EventListener.on(document, "mouseup", this._cancel);
        if (this._element) {
            EventListener.on(this._element, "mousemove", this._callback);
            EventListener.on(this._element, "mouseup", this._cancel);
        } else {
            this._boundaryElement && EventListener.on(this._boundaryElement, "mouseup", this._cancel);
        }
        this._boundaryData = this._handleBoundaryRange(event);
        if (this._isCursorMove) this._handleCallback(event);
    }
    _isMousemove(pos) {
        if (this._innerPos === pos) return;
        this._innerPos = pos;
        return true;
    }
    // 获取边界位置设置
    _getBoundaryPosition([distanceX, distanceY], [clientX, clientY]) {
        // console.log(distanceX, distanceY)
        if (this._boundaryData) {
            const { left, right, top, bottom } = this._boundaryData;
            if (!this._options.boundaryCalc) {
                return [
                    [distanceX, distanceY],
                    [clientX - left, clientY - top],
                ];
            }
            const position = {
                left: left[0] + distanceX,
                right: right[0] - distanceX,
                top: top[0] + distanceY,
                bottom: bottom[0] - distanceY,
            };
            ["left", "right", "top", "bottom"].forEach((key) => {
                const data = this._boundaryData[key];
                if (position[key] < data[1]) {
                    position[key] = data[1];
                }
                if (position[key] > data[2]) {
                    position[key] = data[2];
                }
            });
            const distance = [distanceX, distanceY];
            if (distanceX < 0 && distanceX < left[1] - left[0]) {
                distance[0] = left[1] - left[0];
            }
            if (distanceX >= 0 && distanceX > left[3]) {
                distance[0] = left[3];
            }
            if (distanceY < 0 && distanceY < top[1] - top[0]) {
                distance[1] = top[1] - top[0];
            }
            if (distanceY >= 0 && distanceY > top[3]) {
                distance[1] = top[3];
            }
            return [distance, position];
        }
    }
    _handleCallback(event) {
        const { clientX, clientY } = event;
        if (!this._isRun || !this._handler || !this._isMousemove(`${clientX}&${clientY}`)) return;
        event.stopPropagation();
        event.preventDefault();
        const { style, props } = this._options,
            tempDistance = [clientX - this._tempAxis[0], clientY - this._tempAxis[1]],
            distance = [clientX - this._axis[0], clientY - this._axis[1]],
            nowTime = Date.now(),
            tempSpeed =
                Math.sqrt(Math.pow(tempDistance[0], 2) + Math.pow(tempDistance[1], 2)) / (nowTime - this._tempTime),
            speed = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2)) / (nowTime - this._initTime),
            boundaryData = this._getBoundaryPosition(distance, [clientX, clientY]);
        this._tempAxis = [clientX, clientY];
        this._tempTime = nowTime;
        this._distance = distance;
        this._handler(
            {
                // boundaryPosition：鼠标相对边界元素的位置或者移动元素相对边界元素的位置
                boundaryPosition: boundaryData && boundaryData[1],
                distance: boundaryData ? boundaryData[0] : distance, // 移动总距离
                data: this._initOffset, // 起始数据
                element: this._element,
                relatedElement: this._relatedElement,
                boundaryElement: this._boundaryElement,
                // boundaryData:this._boundaryData,
                style,
                props,
                axis: this._axis,
                isTransform: this._isTransform,
                tempSpeed: (tempDistance[0] < 0 || tempDistance[1] < 0 ? -tempSpeed : tempSpeed) * 1000, // 临时速度
                speed: (distance[0] < 0 || distance[1] < 0 ? -speed : speed) * 1000,
            },
            event
        );
    }
    _handleCancel(event) {
        if (event && this._handler && !this._isDestroy && this._isRun) {
            const { style, props } = this._options,
                { clientX = 0, clientY = 0 } = event,
                tempDistance = [clientX - this._tempAxis[0], clientY - this._tempAxis[1]],
                distance = [clientX - this._axis[0], clientY - this._axis[1]],
                nowTime = Date.now(),
                tempSpeed =
                    Math.sqrt(Math.pow(tempDistance[0], 2) + Math.pow(tempDistance[1], 2)) / (nowTime - this._tempTime),
                speed = Math.sqrt(Math.pow(distance[0], 2) + Math.pow(distance[1], 2)) / (nowTime - this._initTime),
                boundaryData = this._getBoundaryPosition(this._distance, [clientX, clientY]);
            this._handler({
                boundaryPosition: boundaryData && boundaryData[1],
                distance: boundaryData ? boundaryData[0] : this._distance, // 移动总距离
                data: this._initOffset,
                element: this._element,
                relatedElement: this._relatedElement,
                boundaryElement: this._boundaryElement,
                style,
                props,
                axis: this._axis,
                isTransform: this._isTransform,
                cancel: true,
                tempSpeed: (tempDistance[0] < 0 || tempDistance[1] < 0 ? -tempSpeed : tempSpeed) * 1000, // 临时速度
                speed: (distance[0] < 0 || distance[1] < 0 ? -speed : speed) * 1000,
            });
            this._distance = [0, 0];
        }
        EventListener.off(document, "mousemove", this._callback);
        EventListener.off(document, "mouseup", this._cancel);

        this._element && EventListener.off(this._element, "mouseup", this._cancel);
        this._element && EventListener.off(this._element, "mousemove", this._callback);
        this._boundaryElement && EventListener.off(this._boundaryElement, "mouseup", this._cancel);
        this._axis = this._tempAxis = this._boundaryData = this._initTime = this._tempTime = null;
        this._isBind = this._isDestroy = this._isRun = false;
        this._innerPos = "";
        document.body.style.userSelect = this._initUserSelect;
        if (this._element) {
            this._element.style.cursor = this._element.dataset.perCursor || "";
            delete (this._element.dataset.perCursor = "");
        }
    }
    update(element, options) {
        this._setOptions(options);
        element = getElement(element);
        if (this._element === element) return;
        this.destroy();
        if (!this._handler) this._handler = throttle(this._cbFn, this._options.timeOut);
        this._element = element;
        this._relatedElement = getElement(this._options.relatedElement);
        this._binding();
    }
    destroy() {
        this._isDestroy = true;
        this._isCursorMove = false;
        this._handleCancel();
        this._element && EventListener.off(this._element, "mousedown", this._initAxis);
        this._boundaryElement && EventListener.off(this._boundaryElement, "mousedown", this._initAxis);
        this._handler.cancel();
        this._handler = null;
    }
}

export class ClickOut {
    constructor(elements, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        this._options = {
            delay: 90,
            ...options,
        };
        this._setElements(elements);
        this._callback = typeof callback === "function" && callback;
        this._handler = this._handleCallback.bind(this);
        this._isBind = false;
        this._clickoutCount = 0;
        this._binding();
    }
    _setElements(elements) {
        this._elements = (Array.isArray(elements) ? elements : [elements])
            .map((ele) => getElement(ele))
            .filter((ele) => !!ele);
    }
    _handleCallback(event) {
        const type = event.type;
        if (!this._callback || type === this._currentType) return;
        const currentTarget = event.currentTarget;
        const cb = (target) => {
            const index = this._elements.findIndex((element) => element.contains(target)) + 1;
            // if (!index && this._firstClickCount) this._firstClickCount -= 1;
            this._clickoutCount = !index ? this._clickoutCount + 1 : 0;
            if (index) {
                this.toggleBindDocument(true);
            }
            if (this._clickoutCount > 6) {
                this.toggleBindDocument();
                this._clickoutCount = 0;
            }
            this._callback(!index, event, index);
        };

        clearTimeout(this._delayTime);
        clearTimeout(this._typeTimeOut);
        // console.log(type, event.timeStamp, currentTarget);
        console.log(type, event.timeStamp,event.target);
        if (type !== "focusout") {
            // if (!this._firstClickCount) {
            //     const firstRun = this.__firstRun;
            //     this.__firstRun = true;
            //     // 首次激活
            //     this._firstClickCount =
            //         type === "focusin" || (type === "click" && this._elements.indexOf(currentTarget) > -1);
            //     // 首次运行
            //     if (!this._firstClickCount && firstRun) return;
            //     this._firstClickCount = 3;
            // }
            if (!this._typeTimeOutCb && this._currentType !== "focusin" && this._currentType !== "click") {
                // console.log(type, '------------')
                // 减少次数，类似防抖，针对foucsout
                this._typeTimeOutCb = setTimeout(() => {
                    this._typeTimeOutCb = null;
                    cb(currentTarget);
                }, 20);
            }
            this._currentType = type;
            // 去掉focusin后click的事件
            this._typeTimeOut = setTimeout(
                () => {
                    this._currentType = this._delayTime = this._typeTimeOut = null;
                },
                this._currentType === "focusin" ? 360 : 36 // window 会click 导致currentTarget为document 发生错误
            );
            return;
        }
        clearTimeout(this._typeTimeOutCb);
        this._typeTimeOutCb = null;
        this._currentType = type;
        this._delayTime = setTimeout(() => {
            // console.log(type, '++++++')
            cb(null);
            this._currentType = this._delayTime = null;
        }, this._options.delay);
    }
    _binding() {
        if (this._isBind || !this._callback) return this;
        this._isBind = true;
        this._elements.forEach((element) => {
            if (!element.getAttribute("tabindex")) {
                element.dataset.tabindex = "-1";
                element.setAttribute("tabindex", -1);
            }
            if (!element.style.outline) {
                element.style.outline = element.dataset.outline = "none";
            }
            EventListener.on(element, "click,focusin,focusout", this._handler);
        });
        this.toggleBindDocument(true);
        return this;
    }
    toggleBindDocument(isBind) {
        let method = isBind ? "on" : "off";
        if (this._bindDocumentStatus === method && method === "on") return;
        this._bindDocumentStatus = method;
        EventListener[method](document, "click", this._handler);
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
            if (element.dataset.tabindex === "-1") {
                element.removeAttribute("tabindex");
            }
            if (element.dataset.outline === "none") {
                element.style.outline = "";
            }
            EventListener.off(element, "click,focusin,focusout", this._handler);
            this.toggleBindDocument();
        });
        clearTimeout(this._delayTime);
        clearTimeout(this._typeTimeOutCb);
        clearTimeout(this._typeTimeOut);
        this._typeTimeOutCb = this._delayTime = this._typeTimeOut = null;
    }
}

export class HoverOut {
    constructor(elements, options, callback) {
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        this._options = {
            delay: 100,
            ...options,
        };
        this._setElements(elements);
        this._callback = typeof callback === "function" && callback;
        this._handler = this._handleCallback.bind(this);
        this._isBind = false;
        this._binding();
    }
    _setElements(elements) {
        this._elements = (Array.isArray(elements) ? elements : [elements]).filter((ele) => !!ele);
    }
    _handleCallback(event) {
        if (!this._callback) return;
        const type = event.type;
        if (type === this._currentType) return;
        // console.log(type, event.target.className, event.timeStamp)
        const currentTarget = event.currentTarget;
        const cb = (bool) => {
            this._callback(bool, event, this._elements.findIndex((element) => element.contains(currentTarget)) + 1);
            this._currentType = this._delayTime = null;
        };
        this._currentType = type;
        clearTimeout(this._delayTime);
        if (type !== "mouseleave") return cb(false);
        this._delayTime = setTimeout(() => {
            cb(true);
        }, this._options.delay);
    }
    _binding() {
        if (this._isBind || !this._callback) return this;
        this._isBind = true;
        this._elements.forEach((element) => {
            EventListener.on(element, "mouseenter,mouseleave", this._handler);
        });
        return this;
    }
    update(elements) {
        if (elements) {
            this.destroy();
            this._setElements(elements);
            this._binding();
        }
        return this;
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
            isPercent: false, //percent,
            isScrollTop: false, //left,
            throttle: 30,
        };

        if (typeof options === "function") {
            this._callback = options;
            options = {};
        } else {
            this._callback = typeof callback === "function" && callback;
        }
        this._setElements(elements);
        this._setOptions(options);
        this._setScroll = throttle(this.__setScroll.bind(this), this._options.throttle);
        this._handler = this._handleCallback.bind(this);
        this._binding();
    }
    _setElements(elements) {
        if (Array.isArray(elements) && elements.length > 1) {
            this._elements = elements.map(getElement).filter((ele) => !!ele);
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
        });
        return this;
    }
    _handleCallback(event) {
        event.stopPropagation();
        const currentTarget = event.currentTarget;
        if (this._runEle && this._runEle !== currentTarget) return;
        this._runEle = currentTarget;
        this._setScroll(currentTarget);
    }
    __setScroll(ele) {
        const { isPercent, isScrollTop } = this._options;
        const { scrollTop, scrollLeft, scrollHeight, clientHeight, clientWidth, scrollWidth } = ele,
            isDown = scrollTop > this._preScrollTop;
        this._preScrollTop = scrollTop;
        let value;
        if (isPercent) {
            value = isScrollTop
                ? scrollTop / (scrollHeight - clientHeight || 1)
                : scrollLeft / (scrollWidth - clientWidth || 1);
        } else {
            value = isScrollTop ? scrollTop : scrollLeft;
        }
        this._elements.forEach((item) => {
            if (item === ele) return;
            const { scrollHeight, clientHeight, clientWidth, scrollWidth } = item;
            if (isScrollTop) {
                item.scrollTop = isPercent ? value * (scrollHeight - clientHeight) : value;
            } else {
                item.scrollLeft = isPercent ? value * (scrollWidth - clientWidth) : value;
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
            if (!this._setScroll) this._setScroll = throttle(this.__setScroll.bind(this), this._options.throttle);
            this._binding();
        }
        return this;
    }
    destroy() {
        this._elements &&
            this._elements.forEach((element) => {
                EventListener.off(element, "scroll", this._handler);
            });
        this._setScroll && this._setScroll.cancel();
        this._isBind = false;
        this._setScroll = this._runEle = null;
        clearTimeout(this._delayTime);
    }
}

export class ScrollLoad {
    constructor(element, options /*options = { offset: 60 }*/, callback) {
        this._options = {
            offset: 60,
            isReachTop: false,
        };
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        this._element = getElement(element);
        this._setOptions(options);
        this._callback = typeof callback === "function" && callback;
        this._handler = this._handleCallback.bind(this);
        this._isRun = false;
        this._preScrollTop = 0;
        this._binding();
    }
    _setOptions(options) {
        this._options = Object.assign(this._options, options);
    }
    async _handleCallback(event) {
        event.stopPropagation();
        if (this._isRun) return; // 减少回流
        const currentTarget = event.currentTarget,
            scrollTop = currentTarget.scrollTop,
            isDown = scrollTop > this._preScrollTop;
        let isEdge;
        if (isDown) {
            isEdge = currentTarget.scrollHeight - currentTarget.clientHeight - scrollTop - this._options.offset < 0;
        } else if (this._options.isReachTop) {
            isEdge = scrollTop - this._options.offset < 0;
        }
        if (isEdge) {
            this._isRun = true;
            this._callback && (await this._callback(isDown).catch(console.warn));
            clearTimeout(this._delayTime);
            this._delayTime = setTimeout(() => {
                this._preScrollTop = currentTarget.scrollTop;
                this._isRun = false;
                this._delayTime = null;
            }, 90);
        }
    }
    _binding() {
        if (this._isBind || !this._element) return this;
        EventListener.on(this._element, "scroll", this._handler);
        this._isBind = true;
    }
    update(element, options = {}) {
        this._setOptions(options);
        element = getElement(element);
        if (this._element === element) return;
        this.destroy();
        this._element = element;
        this._binding();
    }
    destroy() {
        EventListener.off(this._element, "scroll", this._handler);
        this._isBind = this._isRun = false;
        this._preScrollTop = 0;
        clearTimeout(this._delayTime);
    }
}

export class PerformanceScroll {
    constructor(element, options /*options = { offset: 60 }*/, callback) {
        this._options = {
            offset: 120,
            performance: "none", // none,middle,high
            cellElement: null,
            cellHeight: null,
            length: 10,
            throttle: 30,
            total: 0,
            hideLength: 5,
        };
        if (typeof options === "function") {
            callback = options;
            options = {};
        }
        this._element = getElement(element);
        this._setOptions(options);
        this._callback = typeof callback === "function" && callback;
        this._translateList = [];
        this._handler = throttle(this._handleCallback.bind(this), this._options.throttle);
        this._sizeIndex = this._preScrollTop = 0;
        this._binding();
    }
    _setOptions(options) {
        this._options = Object.assign(this._options, options);
    }

    async _handleCallback(event) {
        if (this._resetStatus) return;
        const { beforeScroll, total, performance, length, hideLength } = this._options;
        if (typeof beforeScroll === "function") {
            const result = await beforeScroll(event, this);
            if (!result) return;
        }
        if (
            (total && this._sizeIndex >= total) ||
            !this._element ||
            (performance !== "high" && performance !== "middle")
        )
            return;
        event.stopPropagation();
        const { scrollTop, clientHeight, scrollHeight } = this._element;
        const direction = scrollTop - this._preScrollTop >= 0,
            offset = this._options.offset;
        this._preScrollTop = scrollTop;
        if (!direction && scrollTop < offset) {
            // 表示已经加载顶部完成
            if (this._performance) return;
            this._performance = true;
            this._preScrollTop = 0;
            this._sizeIndex = this._preScrollTop = 0;
            this._translateList = [];
            this._callback(
                {
                    index: 0,
                    total,
                    translate: 0,
                    length: 2 * hideLength + length * 1,
                },
                "top"
            );
            return;
        }
        const translate = this._getTotalTranslate();
        // 向上
        if (!direction && scrollTop && translate && scrollTop < translate + offset) {
            this._handleScrollUp(scrollTop);
        } else if (direction && clientHeight + scrollTop + offset > scrollHeight) {
            // 向下
            if (this._performance) return;
            this._performance = true;
            this._handleScrollDown();
        } else {
            this._performance = false;
        }
    }
    _binding() {
        if (this._isBind || !this._element) return this;
        EventListener.on(this._element, "scroll", this._handler);
        this._isBind = true;
    }
    _getTotalTranslate(data = this._translateList) {
        return data.reduce(function(acc, cur) {
            return acc + cur;
        }, 0);
    }
    _handleScrollUp(scrollTop = 0) {
        const { performance, length, hideLength, total, offset } = this._options;
        if (performance === "middle") return;
        let height = 0,
            i = 0;
        for (let index = 0, len = this._translateList.length; index < len; index++) {
            height += this._translateList[index] || 0;
            const val = scrollTop - height - offset,
                next = this._translateList[index + 1];
            if (val >= 0 && ((next && val < next) || !next)) {
                i = index;
                break;
            }
            i = index;
        }
        this._sizeIndex = i * hideLength;
        this._translateList = this._translateList.slice(0, i);
        if (this._sizeIndex <= 0) {
            this._sizeIndex = 0;
            this._translateList = [];
        }
        this._callback(
            {
                index: this._sizeIndex,
                total,
                translate: this._getTotalTranslate(),
                length: 2 * hideLength + length * 1,
            },
            "up"
        );
    }
    _handleScrollDown() {
        const { performance, cellElement, cellHeight, length, hideLength, total } = this._options;
        if (total && this._sizeIndex + 2 * hideLength + length * 1 > total) {
            this._callback(
                {
                    index: this._sizeIndex,
                    total,
                    translate: this._getTotalTranslate(),
                    length: 2 * hideLength + length * 1,
                },
                "over"
            );
            return;
        }
        this._sizeIndex += hideLength;
        if (performance === "high") {
            let height = 0;
            if (cellHeight) {
                height = cellHeight * hideLength;
                this._translateList.push(height);
            } else if (cellElement) {
                const celEle = getElement(cellElement, this._element);
                if (celEle) {
                    const cellList = celEle.parentNode.children;
                    for (let index = 0; index < hideLength; index++) {
                        height += cellList[index].clientHeight || 0;
                    }
                    this._translateList.push(height);
                }
            }
        }
        this._callback(
            {
                index: this._sizeIndex,
                total,
                translate: this._getTotalTranslate(),
                length: 2 * hideLength + length * 1,
            },
            "down"
        );
    }
    update(element, options = {}) {
        this._setOptions(options);
        element = getElement(element);
        if (this._element === element) return;
        this.destroy();
        if (!this._handler) this._handler = throttle(this._handleCallback.bind(this), this._options.throttle);
        this._element = element;
        this._binding();
    }
    reset(isInit) {
        this._resetStatus = true;
        this._performance = false;
        this._translateList = [];
        this._element.scrollTop = this._preScrollTop = 0;
        if (isInit === true)
            this._callback(
                {
                    index: 0,
                    total: this._options.total,
                    translate: 0,
                    length: 2 * this._options.hideLength + this._options.length * 1,
                },
                "reset"
            );
        // 修复重置时多次触发滚动无法恢复默认状态
        this.__resetTimeOut = setTimeout(() => {
            this._resetStatus = false;
            this.__resetTimeOut = null;
        }, 300);
    }
    destroy() {
        EventListener.off(this._element, "scroll", this._handler);
        this.reset();
        clearTimeout(this.__resetTimeOut);
        this._handler && this._handler.cancel();
        this._handler = this.__resetTimeOut = this._isBind = null;
    }
}
