
import Loading from './loading.vue';

Loading.newInstance = function (props = {}, vmOptions = {}) {
    let Instance = new global.__VUE__({
        mixins: [vmOptions],
        render(h) {
            const attrs = Object.assign({ loading: true, transfer: true, __pattern: 'js' }, props)
            let vNode = attrs.render;
            attrs.render = undefined;
            if (typeof vNode === 'function') vNode = vNode(h, attrs)
            return h(Loading, { attrs }, vNode ? [vNode] : undefined)
        }
    }),
        component = Instance.$mount(),
        el = component.$el,
        child = Instance.$children[0];
    document.body.appendChild(el);

    return {
        uid: child._uid,
        show() {
            child.visible = true;
        },
        hide() {
            child.visible = false;
        },
        destroy() {
            child.visible = false;
            setTimeout(function () {
                component.$destroy();
                try {
                    document.body.removeChild(el);
                } catch (error) {};
                Instance = component = el = child = null;
            }, 300);
        },
    };
};

export default Loading;