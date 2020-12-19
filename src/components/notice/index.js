import Notification from '../base/notification';
import Alert from '../alert/index';
import { unit } from '../../utils/tool';

let Instances = {}, Config = {}, vmOptions;
function getInstance(position = 'top-right', offset) {
    // position:bottom-right,top-right,bottom-left,top-left
    let key = null, style = {};
    if (!Array.isArray(offset)) {
        offset = [offset];
    }
    if (position === 'bottom-left') {
        style = {
            bottom: unit(offset[0]) || '',
            left: unit(offset[1]) || '12px',
            right: 'unset',
            top: 'unset'
        }
        key = `${position}@${style.bottom}@${style.left}`;
    } else if (position === 'bottom-right') {
        style = {
            bottom: unit(offset[0]) || '0px',
            right: unit(offset[1]) || '12px',
            top: 'unset'
        }
        key = `${position}@${style.bottom}@${style.right}`;
    } else if (position === 'top-left') {
        style = {
            top: unit(offset[0]) || '24px',
            left: unit(offset[1]) || '12px',
            right: 'unset'
        }
        key = `${position}@${style.top}@${style.left}`;
    } else if (position === 'top-center') {
        style = {
            top: unit(offset[0]) || '24px',
            left: '50%',
            right: 'unset',
            transform: "translateX(-50%)"
        }
        key = `${position}@${style.top}@${style.left}`;
    } else if (position === 'bottom-center') {
        style = {
            bottom: unit(offset[0]) || '0px',
            left: '50%',
            right: 'unset',
            top: 'unset',
            transform: "translateX(-50%)"
        }
        key = `${position}@${style.top}@${style.left}`;
    } else {
        position = "top-right"
        style = {
            top: unit(offset[0]) || '24px',
            right: unit(offset[1]) || '12px',
        }
        key = `${position}@${style.top}@${style.right}`;
    }
    Instances[key] = Instances[key] || Notification.newInstance({
        ...Config,
        style: {
            // right: '12px',
            textAlign: 'left',
            ...style,
            ...Config.style,
        },
        attrs: {
            ...Config.attrs,
            position
        },
    }, vmOptions);
    Instances[key].__position = position;
    return Instances[key];
}

function notice(type, options = {}) {
    if (typeof options === 'string') options = { title: options }
    const { title = '',
        desc = '',
        onClose,
        render,
        duration = 5,
        name,
        maskable,
        ghost = false,
        style,
        className = '',
        closable = true,
        alertProps = {},
        position,
        offset,
    } = options,
        instance = getInstance(position, offset);
    let transitionName = 'move-notice';
    if (instance.__position.indexOf('left') > -1) transitionName = 'move-notice-left'
    if (instance.__position.indexOf('center') > -1) transitionName = 'move-up'
    instance.notice({
        style,
        class: className,
        theme: type,
        type: "notice",
        name,
        maskable,
        duration,
        offset,
        render: function (h) {
            const renderVnode = typeof render === 'function' ? render(h) : null;
            return <Alert type={type} ghost={ghost} showIcon {...alertProps} >
                {title}
                {desc ? <template slot="desc" >
                    {desc}{renderVnode}
                </template> : renderVnode}
            </Alert>
        },
        onClose,
        closable,
        transitionName
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
    config(config, isVmOptions) {
        if (isVmOptions) {
            vmOptions = config;
        } else {
            Config = config;
        }
    },
    destroy(type, isTheme) {
        if (type) {
            Object.values(Instances).forEach(instance => {
                instance.remove(type, isTheme);
            })
            return;
        }
        Object.values(Instances).forEach(instance => {
            instance.destroy(type, isTheme);
        })
        Instances = {};
    }
};