import { DragMove } from '../utils/dom';
export default {
    bind(el, { value }, vnode) {
        if (!value) return;
        const handler = typeof value === 'function' ? value : function (axis) {
            const { fixed, run } = axis, style = el.style;
            style.cursor = run ? "move" : "";
            style.userSelect = run ? "none" : "";
            style.transform = "translate(" + fixed[0] + "px," + fixed[1] + "px)";
        }
        el.__vueDragMove = new DragMove(el, handler);
    },
    inserted(el) {
        if (!el.__vueDragMove) return;
        el.__vueDragMove.binding();
    },
    unbind(el) {
        if (!el.__vueDragMove) return;
        el.__vueDragMove.destroy();
        el.__vueDragMove = null;
    }
}

// export default directive;