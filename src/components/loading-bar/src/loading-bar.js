import LoadingBar from "./loading-bar.vue";

LoadingBar.newInstance = function(props = {}, vmOptions = {}) {
    let Instance = new global.__VUE__({
            mixins: [vmOptions],
            render(h) {
                let render = props.render,
                    vNode;
                delete props.render;
                if (typeof vNode === "function") vNode = render(h);
                return h(LoadingBar, { attrs: props }, vNode ? [vNode] : void 0);
            },
        }),
        component = Instance.$mount(),
        element = component.$el,
        child = Instance.$children[0];
    document.body.appendChild(element);

    return {
        name: child.name || child._uid,
        update(options = {}) {
            Object.keys(options).forEach((key) => {
                child[key] = options[key];
            });
        },
        destroy() {
            component.$destroy();
            try {
                document.body.removeChild(element);
            } catch (error) {
                // console.log(error)
            }
            Instance = element = component = child = null;
        },
    };
};

export default LoadingBar;
