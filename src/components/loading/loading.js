
import Loading from './loading.vue';

Loading.newInstance = function (props = {}, vmOptions = {}) {
    let Instance = new global.__VUE__({
        mixins: [vmOptions],
        render(h) {
            const attrs = Object.assign({ loading: true, transfer: true, __pattern: 'js' }, props)
            let render = attrs.render,vNode;
            delete attrs.render;
            if (typeof vNode === 'function') vNode = render(h, attrs)
            return h(Loading, { attrs }, vNode ? [vNode] : undefined)
        }
    }),
        component = Instance.$mount(),
        el = component.$el,
        child = Instance.$children[0];
    document.body.appendChild(el);
    return {
        name: child.name||child._uid,
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
                } catch (error) {
                    // console.log(error)
                }
                Instance = component = el = child = null;
            }, 300);
        },
    };
};

export default Loading;