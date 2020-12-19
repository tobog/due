import { getStyles } from "../../utils/dom";
export default {
    name: "UTransition",
    functional: true,
    props: {
        duration: {
            type: Number,
            default: 0.2,
        },
    },
    render(h, ctx) {
        const data = ctx.data,
            duration = ctx.props.duration,
            elTransition = `${duration}s height ease-in-out, ${duration}s opacity ease-in-out,${duration}s padding-top ease-in-out,${duration}s padding-bottom ease-in-out,${duration}s margin-top ease-in-out,${duration}s margin-bottom ease-in-out`;
        let tag = "transition",
            children = ctx.children;
        if (children.length > 1 || (data.attrs && data.attrs.tag)) {
            tag = "transition-group";
            children.forEach((child, index) => {
                child.key = child.key || index;
            });
        }
        return h(
            tag,
            {
                ...data,
                on: {
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
                                console.log("enter", el.scrollHeight);
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
                    },
                    afterEnter(el) {
                        const style = el.style;
                        style.transition = style.height = "";
                        style.overflow = el._transitionStyle.overflow;
                        console.log("afterEnter");
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
                    },

                    leave(el) {
                        const style = el.style;
                        style.transition = elTransition;
                        if (el.scrollHeight !== 0) {
                            style.height = style.paddingTop = style.paddingBottom = style.marginTop = style.marginBottom = style.opacity = 0;
                        }
                        console.log("leave");
                    },

                    afterLeave(el) {
                        console.log("afterLeave");
                        const style = el.style;
                        style.transition = style.height = "";
                        style.overflow = el._transitionStyle.overflow;
                        style.paddingTop = el._transitionStyle.paddingTop;
                        style.paddingBottom = el._transitionStyle.paddingBottom;
                        style.marginTop = el._transitionStyle.marginTop;
                        style.marginBottom = el._transitionStyle.marginBottom;
                        style.opacity = el._transitionStyle.opacity;
                    },
                    ...ctx.listeners
                }
            },
            children
        );
    }
};
