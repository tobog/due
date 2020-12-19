import Modal from './confirm';

let Instances = {}, Config, vmOptions;

function getInstance(props = {}, on = {}) {
    const instance = Modal.newInstance(Object.assign({}, Config, props), on, vmOptions),
        uid = instance.uid;
    if(Instances[uid]) Instances[uid].destroy(uid);
    Instances[uid] = instance;
    return uid;
}

Modal.config = function (config, isvmOptions) {
    if (isvmOptions) {
        vmOptions = config
    } else {
        Config = config;
    }
};

Modal.default = function (props = {}, on = {}) {
    if (typeof props === 'string') props = { content: props };
    return getInstance(props, on);
};

Modal.confirm = function (props = {}, on = {}) {
    if (typeof props === 'string') props = { content: props };
    props.prompt = 'confirm';
    return getInstance(props, on);
};

Modal.info = function (props = {}, on = {}) {
    if (typeof props === 'string') props = { content: props };
    props.prompt = 'info';
    return getInstance(props, on);
};

Modal.success = function (props = {}, on = {}) {
    if (typeof props === 'string') props = { content: props };
    props.prompt = 'success';
    return getInstance(props, on);
};

Modal.warning = function (props = {}, on = {}) {
    if (typeof props === 'string') props = { content: props };
    props.prompt = 'warning';
    return getInstance(props, on);
};

Modal.error = function (props = {}, on = {}) {
    if (typeof props === 'string') props = { content: props };
    props.prompt = 'error';
    return getInstance(props, on);
};

Modal.get = function (name="") {
    const instance=Instances[name];
    if(name===''||!instance) return;
    return instance.component
};

Modal.destroy = function (name = '') {
    if (name !== '' && Instances[name]) {
        Instances[name].destroy();
        delete Instances[name];
        return;
    }
    Object.values(Instances).forEach(function (instance) {
        if (instance) instance.destroy();
    });
    Instances = {};
};

export default Modal;