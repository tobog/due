

function getError(url, option, xhr) {
    const msg = `fail to post ${url} ${xhr.status}'`;
    const err = new Error(msg);
    err.status = xhr.status;
    err.method = 'post';
    err.url = url;
    return err;
}

function getResponse(xhr) {
    const text = xhr.responseText || xhr.response;
    try {
        return JSON.parse(text);
    } catch (e) {
        return text;
    }
}

const XHR = (function createXHR() {
    if (window.XMLHttpRequest) {
        return function () {
            return new XMLHttpRequest();
        }
    } else if (window.ActiveXObject) {
        return function () {
            return new ActiveXObject("Microsoft.XMLHTTP");
        }
    } else {
        throw new Error("Available XMLHttpRequest");
    }
}());

export default function upload(option) {
    const xhr = new XHR(),
        formData = new FormData(),
        headers = option.headers || {},
        url = option.action,
        params = option.data,
        { file, chunck } = option.fileInfo || {};
    if (params) {
        Object.keys(params).map(key => {
            formData.append(key, params[key]);
        });
    }
    if (chunck !== undefined) {
        formData.append('chunck', chunck);
    }
    formData.append(option.filename, file);

    xhr.onerror = function (e) {
        option.onError(e);
        xhr.abort();
    };

    if (xhr.upload) {
        xhr.upload.onprogress = function (e) {
            option.onProgress(e);
        };
    } else {
        xhr.onprogress = function (e) {
            option.onProgress(e);
        };
    }
    xhr.onload = function () {
        const response = getResponse(xhr);
        if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(url, option, xhr), response);
        }
        option.onSuccess(response);
    };
    xhr.open('post', url, true);
    if (option.withCredentials && 'withCredentials' in xhr) {
        xhr.withCredentials = true;
    }
    for (let item in headers) {
        if (headers.hasOwnProperty(item) && headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item]);
        }
    }
    xhr.send(formData);
    return xhr;
}
