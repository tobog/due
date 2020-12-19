

import LoadingBar from './loading-bar.vue';

LoadingBar.newInstance = function (props = {}, vmOptions = {}) {
    let Instance = new  global.__VUE__({
        mixins:[vmOptions],
        render(h) {
            let vNode = props.render;
            props.render=undefined;
            if (typeof vNode === 'function') vNode = vNode(h)
            return h(LoadingBar, {  attrs: props }, vNode ? [vNode] : undefined)
        }
    }),
        component = Instance.$mount(),
        element = component.$el,
        child = Instance.$children[0];
    document.body.appendChild(element);

    return {
        uid: child._uid,
        update(options = {}) {
            Object.keys(options).forEach((key) => {
                child[key] = options[key];
            });
        },
        destroy() {
            component.$destroy();
            try {
                document.body.removeChild(element);
            } catch (error) {};
            Instance=element=component=child=null;
        }
    };
};

export default LoadingBar;
