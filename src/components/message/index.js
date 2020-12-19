import Notification from '../base/notification';
import Alert from '../alert/index';

let Instance, Config = {}, vmOptions;
function getInstance() {
    Instance = Instance || Notification.newInstance({
        style: {
            left: 0
        },
        ...Config,
        attrs: {
            'data-type': 'message'
        },
    }, vmOptions);
    return Instance;
}

function notice(type, options = {}, single = false) {
    if (typeof options === 'string') options = { content: options };
    const {
        content = '',
        closable = true,
        onClose,
        render,
        duration = 5,
        name,
        style,
        className,
        maskable,
        ghost = true } = options,
        instance = getInstance();

    instance.notice({
        style,
        class: className,
        theme: type,
        type: "message",
        name,
        duration,
        maskable,
        render: function (h) {
            const renderVnode = typeof render === 'function' ? render(h) : content || render;
            return <Alert type={type} ghost={ghost} showIcon>
                {renderVnode}
            </Alert>
        },
        onClose,
        closable,
        transitionName: 'move-up',
    }, single);
    return instance;
}

export default {
    default(options, single) {
        return notice('', options, single);
    },
    info(options, single) {
        return notice('info', options, single);
    },
    success(options, single) {
        return notice('success', options, single);
    },
    warning(options, single) {
        return notice('warning', options, single);
    },
    error(options, single) {
        return notice('error', options, single);
    },
    loading(options, single) {
        return notice('loading', options, single);
    },
    config(config, isVmOptions) {
        if (isVmOptions) {
            vmOptions = config;
            return;
        } else {
            Config = config;
        }
    },
    destroy(type, isTheme) {
        if (type && Instance) {
            Instance.remove(type, isTheme);
            return;
        }
        if (Instance) Instance.destroy();
        Instance = null;
    }
};
