import Notification from '../base/notification';
import Alert from '../alert/index';

let Instance, Config = {}, vmOptions;
function getInstance() {
    Instance = Instance || Notification.newInstance({
        style: {
            right: '18px',
            textAlign: 'left',
        },
        ...Config,
    }, vmOptions);
    return Instance;
}

function notice(type, options = {}) {
    if (typeof options === 'string') options = { title: options }
    const { title = '',
        desc = '',
        onClose,
        render,
        duration = 3,
        name,
        ghost = false,
        style = "width:280px;",
        className = '', closable = true } = options,
        instance = getInstance();

    instance.notice({
        style,
        class: className,
        theme: type,
        type: "notice",
        name,
        duration,
        render: function (h) {
            const renderVnode = typeof render === 'function' ? render(h) : null;
            return <Alert type={type} ghost={ghost} showIcon style="margin-bottom:0;" >
                {title}
                {desc ? <template slot="desc" >
                    {desc}{renderVnode}
                </template> : renderVnode}
            </Alert>
        },
        onClose,
        closable,
        transitionName: 'move-notice',
    });
}

export default {
    default(options) {
        return notice('', options);
    },
    info(options) {
        return notice('info', options);
    },
    success(options) {
        return notice('success', options);
    },
    warning(options) {
        return notice('warning', options);
    },
    error(options) {
        return notice('error', options);
    },
    config(config, isvmOptions) {
        if (isvmOptions) {
            vmOptions = config;
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