import { EventListener } from '../utils/dom';
import Offset from '../utils/offset';
import { throttle } from '../utils/tool';
const getScroll = function () {
    const docEl = document.documentElement, body = document.body;
    if (body.scrollTop < docEl.scrollTop || body.scrollLeft < docEl.scrollLeft) return docEl;
    return body;
}
export default {
    bind(el, { value }, vnode) {
        const { offsetTop = '', offsetBottom = '', listener } = value || {},
            hasListener = listener instanceof HTMLElement;
        clearTimeout(el.__vueScrollAffixTimeout);
        EventListener.off(window, 'scroll,resize', el.__vueScrollAffix);
        if (hasListener) EventListener.off(listener, 'scroll', el.__vueScrollAffix);
        if (offsetTop === '' && offsetBottom === '') return;
        el.__vueScrollAffixTimeout = setTimeout(function () {
            let initRect = Offset.boundingClientRect(el),
                docEl = hasListener ? listener : getScroll(),
                style = el.style,
                replaceNode = el.cloneNode(true),
                initTop, initBottom;
            if (offsetTop !== '') initTop = initRect.top + docEl.scrollTop - offsetTop;
            if (offsetBottom !== '') initBottom = initRect.bottom + docEl.scrollTop - docEl.clientHeight + offsetBottom;
            replaceNode.style.display = 'none';
            replaceNode.style.visibility = 'hidden';
            el.parentNode.insertBefore(replaceNode, el);
            el.__vueScrollAffix = throttle(function (event) {
                if (event && event.type === 'resize') {
                    console.log(event)
                    //解决resize 后宽度无法更新
                    clearTimeout(el.__vueScrollAffixResize);
                    el.__vueScrollAffixResize = setTimeout(() => {
                        initRect = Offset.boundingClientRect(el);
                        if (offsetTop !== '') initTop = initRect.top + docEl.scrollTop - offsetTop;
                        if (offsetBottom !== '') initBottom = initRect.bottom + docEl.scrollTop - docEl.clientHeight + offsetBottom;
                        el.__vueScrollAffix();
                    }, 60)
                    return;
                }
                const docEle2 = hasListener ? listener : getScroll(),
                    width = el.offsetWidth,
                    height = el.offsetHeight;
                if (initTop > 0 && initTop < docEle2.scrollTop) {
                    style.width = `${width}px`;
                    style.height = `${height}px`;
                    style.top = `${offsetTop}px`;
                    style.left = `${initRect.left}px`;
                    style.position = 'fixed';
                    style.zIndex = 116;
                    style.bottom = '';
                    replaceNode.style.display = 'block';
                } else if (initBottom - offsetBottom < docEle2.scrollTop && initBottom > docEle2.scrollTop) {
                    style.width = `${width}px`;
                    style.height = `${height}px`;
                    style.bottom = `${offsetBottom}px`;
                    style.left = `${initRect.left}px`;
                    style.position = 'fixed';
                    style.zIndex = 116;
                    style.top = '';
                    replaceNode.style.display = 'block';
                } else {
                    style.width = style.height = style.position = style.top = style.bottom = style.left = style.zIndex = '';
                    replaceNode.style.display = 'none';
                }
            }, 100);
            if (hasListener) {
                EventListener.on(listener, 'scroll', el.__vueScrollAffix);
            } else {
                EventListener.on(window, 'scroll,resize', el.__vueScrollAffix);
            }
        }, 500);
    },
    unbind(el, { value }) {
        const { listener } = value || {};
        EventListener.off(window, 'scroll,resize', el.__vueScrollAffix);
        if (listener instanceof HTMLElement) EventListener.off(listener, 'scroll', el.__vueScrollAffix);
        clearTimeout(el.__vueScrollAffixTimeout);
        clearTimeout(el.__vueScrollAffixResize);
        el.__vueScrollAffix = el.__vueScrollAffixTimeout = el.__vueScrollAffixResize = null;
    }
}

// export default directive;