import axios from 'axios';
import Qs from 'qs';
import {requestConfig,responseConfig} from './config';


const instance = axios.create({
    method: 'POST',
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
    transformRequest: function (data) {
        return Qs.stringify(data);
    },
    timeout: 60000,
    withCredentials: true,//default
    responseType: 'json',//default
    validateStatus: function (status) {
        if(status==401||status==403){
            localStorage.removeItem('AUTH_TOKEN');
            location.href='#/login';
            return false;
        }
        return status >= 200 && status < 300;//default
    },
});
instance.interceptors.request.use(function (config) {
    return requestConfig(config);
})
instance.interceptors.response.use(function (resConfig) {
    return responseConfig(resConfig);
})
export default instance;
