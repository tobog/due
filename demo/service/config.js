
export const requestConfig = function (config = {}) {
    config.baseURL = "http://localhost:6625/api/";
    config.headers.common['Authorization'] = "AUTH_TOKEN";
    return config;
}

export const responseConfig = function (config = {}) {
    let data = config.data || {};
    data = typeof data === 'string' ? JSON.parse(data) : data;
    return data;
}