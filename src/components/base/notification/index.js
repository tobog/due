
import Notification from './notification';

Notification.newInstance = (properties = {},vmOptions={}) => {
    let Instance = new global.__VUE__({
        mixins:[vmOptions],
        render(h) {
            return h(Notification, {...properties});
        }
    }),
        component = Instance.$mount(),
        element = component.$el,
        notification = Instance.$children[0];
    document.body.appendChild(element);
    return {
        notice(props, single) {
            if (single) notification.destory();
            return notification.add(props);
        },
        remove(name, isTheme) {
            notification.remove(name, isTheme);
        },
        destroy() {
            notification.destory();
            setTimeout(() => {
                component.$destroy();
                try {
                    document.body.removeChild(element);
                } catch (error) {};
                Instance=component=element=notification=null;
            }, 360);
        }
    };
};

export default Notification;