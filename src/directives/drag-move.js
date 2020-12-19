
import { DragMove } from '../utils/dom';
export default {
    inserted(el, { value }) {
        el.__bindDragMove = function (el, value) {
            if (el.__vueDragMove || !document) return;
            el.__vueDragMove = new DragMove(el, value);
            el.__bindDragMove=null;
        }
        el.__bindDragMove(el, value);
    },
    componentUpdated(el, { value }) {
        !el.__vueDragMove && el.__bindDragMove(el, value);
    },
    unbind(el) {
        el.__vueDragMove && el.__vueDragMove.destroy();
        el.__vueDragMove = null;
    }
}
