import Loading from "./loading.js";
let Instances = {}, Config, VmOptions;

function getInstance(props, name = "") {
    if (Instances[name]) return Instances[name];
    if (typeof props === 'string') props = { render: props }
    const instance = Loading.newInstance(Object.assign({}, Config, props), VmOptions);
    if (name === '') name = instance.name;
    Instances[name] = instance;
    return name;
}

Loading.config = function (config, isVmOptions) {
    if (isVmOptions) {
        VmOptions = config;
        return;
    }
    Config = config;
}

Loading.get = function (name) {
    return Instances[name];
}

Loading.init = function (props) {
    return getInstance(props);
}

Loading.show = function (name = '') {
    if ((!name && name !== 0) || typeof name === 'object') {
        name = name || {}
        return getInstance({
            fix: true,
            loading: true,
            transfer: true,
            ...name
        })
    }
    const instance = Instances[name];
    if (instance) {
        instance.show();
        return instance.name;
    }
};

Loading.hide = function (name) {
    if (name || name === 0) {
        const instance = Instances[name];
        if (instance) instance.hide();
        return;
    }
    Object.keys(Instances).forEach(function (key) {
        const instance = this[key];
        if (instance) instance.hide();
    }, Instances);
};

Loading.destroy = function (name) {
    if (name || name === 0) {
        const instance = Instances[name];
        if (instance) instance.destroy();
        delete Instances[name];
        return;
    }
    Object.keys(Instances).forEach(function (key) {
        const instance = this[key];
        if (instance) instance.destroy();
    }, Instances);
    Instances = {};
};

export default Loading;
