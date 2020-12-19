
import Modal from './modal.vue';

Modal.newInstance = function (properties = {}, on = {},vmOptions={}) {
    let Instance = new global.__VUE__({
        mixins:[vmOptions],
        created() {
            this.properties=Object.assign({autoDestroy:true, value: true, width: 360, __pattern: 'js' }, properties);
            if (!this.properties.name) this.properties.name = this._uid;
        },
        render(h) {
            const attrs = this.properties,
                { render, content = "" } = attrs,
                children = typeof render === 'function' ? render(h, attrs) :
                    h({ template: `<div>${content || render}</div>` });
            return h(Modal, {
                attrs:{...attrs},
                on
            }, [children]);
        }
    }),
        component = Instance.$mount(),
        child = component.$children[0],
        element = component.$el;
    document.body.appendChild(element);
    return {
        component: child,
        uid: child.name,
        destroy() {
            child.visible=false;
            setTimeout(() => {
                component.$destroy();
                try {
                    document.body.removeChild(element);
                } catch (error) {};
                Instance =component=child=element= null;
            }, 360);
        },

    }
};

export default Modal;