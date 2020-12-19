import LoadingBar from './loading-bar.js';

let instance, timer, Config, vmOptions;
function getInstance(props) {
    instance = instance || LoadingBar.newInstance(Object.assign({}, Config, props), vmOptions);
    return instance;
}

function clearTimer() {
    clearInterval(timer);
    timer = null;
}

LoadingBar.config = function (config, isVmOptions) {
    if (isVmOptions) {
        vmOptions = config
        return;
    }
    Config = config;
};

LoadingBar.start = function (props) {
    if (timer) return;
    let percent = -5;
    timer = setInterval(() => {
        percent += Math.floor(Math.random() * 3 + 5);
        if (percent > 90) clearTimer();
        LoadingBar.update({ percent, visible: true, ...props }, false);
    }, 200);
}

LoadingBar.update = function (props, clear = true) {
    if (clear) clearTimer();
    const instance = getInstance(props);
    if (!instance) return;
    instance.update({ visible: true, ...props });
}

LoadingBar.finish = function (props) {
    LoadingBar.update({ percent: 100, status: 'success', ...props });
    LoadingBar.destroy(false);
}

LoadingBar.error = function (props) {
    LoadingBar.update({ percent: 100, status: 'error', ...props });
    LoadingBar.destroy(false);
}

LoadingBar.destroy = function (immediate = true) {
    clearTimer();
    let timeout = setTimeout(function () {
        if (instance) instance.destroy();
        instance = timeout = null;
    }, immediate ? 0 : 5000);
}

export default LoadingBar
