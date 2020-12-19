
export function getTarget(node) {
    if (node === undefined || node === true) {
        return document.body
    }
    return document.querySelector(node)
}


export default  {
    inserted(el, { value }, vnode) {
        if (value === false) return false;
        el.className = el.className ? el.className + ' v-transfer-dom' : 'v-transfer-dom';
        const parentNode = el.parentNode;
        if (!parentNode) return;
        const home = document.createComment('');
        let isMovedOut = true;
        parentNode.replaceChild(home, el);
        getTarget(value).appendChild(el);
        if (!el.__transferDomData) {
            el.__transferDomData = {
                parentNode,
                home,
                isMovedOut
            }
        }
    },
    componentUpdated(el, { value }) {
        if (value === false) return false;
        const ref$1 = el.__transferDomData;
        if (!ref$1) return;
        const { parentNode, home, isMovedOut } = ref$1;
        const target = getTarget(value);
        if (!isMovedOut && value) {
            parentNode.replaceChild(home, el);
            target.appendChild(el);
            el.__transferDomData = Object.assign(el.__transferDomData, { isMovedOut: true, target });
        } else if (isMovedOut && value === false) {
            parentNode.replaceChild(el, home);
            el.__transferDomData = Object.assign(el.__transferDomData, { isMovedOut: false, target });
        } else if (value) {
            target.appendChild(el);
        }
    },
    unbind(el, { value }) {
        if (value === false) return false;
        el.className = el.className.replace('v-transfer-dom', '');
        const ref$1 = el.__transferDomData;
        el.__transferDomData = null
        if (!ref$1) return;
        if (ref$1.isMovedOut === true) {
            ref$1.parentNode && ref$1.parentNode.appendChild(el)
        }
    }
};
// export default directive;
