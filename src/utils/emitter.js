function broadcast(componentNames, eventName, ...params) {
    this.$children.forEach(child => {
        if (componentNames.indexOf(child.$options.name) > -1) {
            child.$emit.call(child, eventName, ...params);
        } else {
            broadcast.call(child, componentNames, eventName, ...params);
        }
    });
}
export default {
    methods: {
        dispatch(componentNames, eventName, ...params) {
            if (!(componentNames instanceof Array)) componentNames = [componentNames];
            let parent = this.$parent || this.$root;
            let name = parent.$options.name;
            while (parent && (!name || componentNames.indexOf(name) == -1)) {
                parent = parent.$parent;
                if (parent) name = parent.$options.name;
            }
            if (parent) {
                parent.$emit.call(parent, eventName, ...params);
                return parent;
            }
        },
        broadcast(componentNames, eventName, ...params) {
            if (!(componentNames instanceof Array)) componentNames = [componentNames];
            broadcast.call(this, componentNames, eventName, ...params);
        }
    }
};