import { type } from "os";

const WraperInstance = function(comp,properties={},mount){
    if(!comp) return;
    let Instance = new global.__VUE__({
        data(){
            return { ...properties.attrs,...properties.props};
        },
        render(h) {
            if(typeof comp ==='function') return h('div', [comp(h)]);
            if(comp instanceof Array)  return h('div', comp);
            return h(comp, {
                ...properties,
                attrs:{...this.$data}
            });
        }
    }),
        component = Instance.$mount(mount),
        element = component.$el;
    document.body.appendChild(element);
    component.destroy=function() {
        component.$destroy();
        try {
            document.body.removeChild(element);
        } catch (error) {};
        Instance=component=element=null;
    };
    return component
};

export default WraperInstance;