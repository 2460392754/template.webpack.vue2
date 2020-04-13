import Router from './router';
import Axios from 'axios';
import Qs from 'qs';
import Config from '@/config';
import * as Auth from '@/utils/auth';
import { Toast } from 'vant';

// 创建 axios 实例对象
const service = Axios.create({
    baseURL: Config.SERVER_BASE_URL + '/api',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 15000,
    validateStatus: () => true
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        if (Auth.has(Auth.TOKEN_KEY)) {
            config.headers.authorization = 'Bearer ' + Auth.get(Auth.TOKEN_KEY);
        }

        if (
            config.method !== 'get' &&
            config.headers['Content-Type'] === Axios.defaults.headers.post['Content-Type']
        ) {
            config.data = Qs.stringify(config.data);
        }

        return config;
    },
    (error) => {
        console.error('service request error:', error);
        Toast.fail(error);

        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    async (res) => {
        const { data, status: code } = res;

        try {
            await handleCode(code);
            Toast(data.msg);

            return data.data;
        } catch (err) {
            return Promise.reject(err);
        }
    },
    (error) => {
        console.error('service response error:', error);

        if (error.message === 'Network Error') {
            error.message = '请求失败, 请检查网络是否已连接';
        } else if (error.message.indexOf('timeout') !== -1) {
            error.message = '请求超时, 请检查网络是否连接正常';
        }

        // 避免因为多个请求出现错误，而重复跳转页面
        if (Router.currentRoute.path !== '/500') {
            Router.replace({
                path: '/500',
                query: {
                    msg: error.message,
                    api: error.config.url
                }
            });
        }

        return Promise.reject(error);
    }
);

/**
 * 处理 http 状态码
 * @param {object} data 请求返回的数据
 * @param {string | number} code http状态码
 * @return {never}
 */
const handleCode = function(code) {
    switch (code) {
        case 200:
        case 201:
            return;

        case 400:
            return Promise.reject(new Error('请求错误'));

        case 401:
            Auth.remove(Auth.TOKEN_KEY);
            Router.replace('/401');

            return Promise.reject(new Error('登录过期, 请重新登录'));

        case 403:
            Auth.remove(Auth.TOKEN_KEY);

            return Promise.reject(new Error('拒绝请求, 当前操作没有被授权(权限)'));

        case 500:
            return Promise.reject(new Error('服务器错误'));

        default:
            return Promise.reject(new Error('出现未知错误...' + code));
    }
};

export default service;
