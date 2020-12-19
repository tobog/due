import { getStyles } from "../../utils/dom";
export default {
    name: "Transitions",
    functional: true,
    props: {
        duration: {
            type: Number,
            default: 0.2,
        },
        appear: Boolean,
        name: String // fade,move,slide,ease,collapse
    },
    render(h, ctx) {
        const { data, listeners, props } = ctx,
            { duration, name, appear } = props,
            elTransition = `${duration}s height ease-in-out, ${duration}s opacity ease-in-out,${duration}s padding-top ease-in-out,${duration}s padding-bottom ease-in-out,${duration}s margin-top ease-in-out,${duration}s margin-bottom ease-in-out`;
        let tag = "transition",
            children = ctx.children;
        if (children.length > 1 || (data.attrs && data.attrs.tag)) {
            tag = "transition-group";
            children.forEach((child, index) => {
                child.key = child.key || index;
            });
        }
        const dataCtx = name === 'collapse' ? {
            ...data,
            on: {
                ...listeners,
                beforeEnter(el) {
                    const style = el.style,
                        styles = getStyles(el);
                    el._transitionStyle = el._transitionStyle || {
                        overflow: styles.overflow,
                        paddingTop: styles.paddingTop,
                        paddingBottom: styles.paddingBottom,
                        marginBottom: styles.marginBottom,
                        marginTop: styles.marginTop,
                        opacity: styles.opacity
                    };
                    style.transition = elTransition;
                    style.overflow = "hidden";
                    style.height = style.paddingTop = style.paddingBottom = style.marginTop = style.marginBottom = style.opacity = 0;
                    console.log("beforeEnter");

                    if (typeof listeners['before-enter'] === 'function') {
                        listeners['before-enter'](el)
                    }
                },
                enter(el, done) {
                    const style = el.style;
                    style.transition = elTransition;
                    style.paddingTop = el._transitionStyle.paddingTop;
                    style.paddingBottom = el._transitionStyle.paddingBottom;
                    style.marginBottom = el._transitionStyle.marginBottom;
                    style.marginTop = el._transitionStyle.marginTop;
                    style.opacity = el._transitionStyle.opacity;
                    clearTimeout(el._transitionTime);
                    if (el.scrollHeight !== 0) {
                        el._transitionTime = setTimeout(function () {
                            style.height = el.scrollHeight + "px";
                            clearTimeout(el._transitionDoneTime);
                            el._transitionTime = null;
                            el._transitionDoneTime = setTimeout(function () {
                                el._transitionDoneTime = null;
                                done();
                            }, 200);
                        }, 0);
                    } else {
                        style.height = "";
                    }

                    if (typeof listeners['enter'] === 'function') {
                        listeners['enter'](el);
                    }
                },
                afterEnter(el) {
                    const style = el.style;
                    style.transition = style.height = "";
                    style.overflow = el._transitionStyle.overflow;
                    console.log("afterEnter");
                    if (typeof listeners['after-enter'] === 'function') {
                        listeners['after-enter'](el);
                    }
                },
                beforeLeave(el) {
                    const style = el.style,
                        styles = getStyles(el);
                    el._transitionStyle = el._transitionStyle || {
                        overflow: styles.overflow,
                        paddingTop: styles.paddingTop,
                        paddingBottom: styles.paddingBottom,
                        marginBottom: styles.marginBottom,
                        marginTop: styles.marginTop,
                        opacity: styles.opacity
                    };
                    style.transition = elTransition;
                    style.height = el.scrollHeight + "px";
                    style.overflow = "hidden";
                    console.log("beforeLeave");
                    if (typeof listeners['after-leave'] === 'function') {
                        listeners['after-leave'](el);
                    }
                },
                leave(el) {
                    const style = el.style;
                    style.transition = elTransition;
                    if (el.scrollHeight !== 0) {
                        style.height = style.paddingTop = style.paddingBottom = style.marginTop = style.marginBottom = style.opacity = 0;
                    }
                    console.log("leave");
                    if (typeof listeners['leave'] === 'function') {
                        listeners['leave'](el);
                    }
                },
                afterLeave(el) {
                    const style = el.style;
                    style.transition = style.height = "";
                    style.overflow = el._transitionStyle.overflow;
                    style.paddingTop = el._transitionStyle.paddingTop;
                    style.paddingBottom = el._transitionStyle.paddingBottom;
                    style.marginTop = el._transitionStyle.marginTop;
                    style.marginBottom = el._transitionStyle.marginBottom;
                    style.opacity = el._transitionStyle.opacity;
                    console.log("afterLeave");
                    if (typeof listeners['after-leave'] === 'function') {
                        listeners['after-leave'](el);
                    }
                },
            }
        } : { ...data, props: { name, appear } };
        return h(
            tag,
            dataCtx,
            children
        );
    }
};
