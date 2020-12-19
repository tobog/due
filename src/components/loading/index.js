import Loading from "./loading.js";
let Instances = {}, Config,vmOptions;

function getInstance(props, id = "") {
    if (Instances[id]) return Instances[id];
    if (typeof props === 'string') props = { render: props }
    const instance = Loading.newInstance(Object.assign({}, Config, props), vmOptions);
    if (id === '') id = instance.uid;
    Instances[id] = instance;
    return id;
}

Loading.config = function (config, isvmOptions) {
    if (isvmOptions) {
        vmOptions = config
    } else {
        Config = config;
    }
};

Loading.init = function (props) {
    return getInstance(props);
};


Loading.show = function (id='') {
    if(id===''||typeof id==='object'){
        return getInstance({
            fix:true,
            loading:true,
            transfer:true,
            ...(id||"")
        })
    }
    const instance = Instances[id];
    if (instance) {
        instance.show();
        return instance.uid;
    }
};

Loading.hide = function (id = '') {
    if (id !== '') {
        const instance = Instances[id];
        if (instance) instance.hide();
        return;
    }
    Object.keys(Instances).forEach(function (key) {
        const instance = this[key];
        if (instance) instance.hide();
    }, Instances);
};

Loading.destroy = function (id = '') {
    if (id !== '') {
        const instance = Instances[id];
        if (instance) instance.destroy();
        delete Instances[id];
        return;
    }
    Object.keys(Instances).forEach(function (key) {
        const instance = this[key];
        if (instance) instance.destroy();
    }, Instances);
    Instances = {};
};

export default Loading;
