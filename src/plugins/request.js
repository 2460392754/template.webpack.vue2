import Router from './router';
import Store from './store';
import Axios from 'axios';
import Qs from 'qs';
import Config from '@config';
import * as Auth from '@/utils/cookie';

// 存储当前路由运行的请求
const axiosPromiseArr = [];

// 防止出现错误后重定向到500页面展示信息
const whiteList = ['/login'];

// 创建 axios 实例对象
const service = Axios.create({
    baseURL: Config.serverBaseUrl + '/api',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 1000 * 15,
    validateStatus: () => true
});

// 路由钩子，当路由切换时，停止所有未执行完的请求
Router.beforeEach((to, from, next) => {
    axiosPromiseArr.forEach((ele, index) => {
        ele.cancel();
        delete axiosPromiseArr[index];
    });

    next();
});

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 请求头上添加token
        if (Auth.has(Auth.TOKEN_KEY)) {
            config.headers.authorization = 'Bearer ' + Auth.get(Auth.TOKEN_KEY);
        }

        // 传输格式是'x-www-form-urlencoded'格式时进行转json字符串
        if (
            config.method !== 'get' &&
            config.headers['Content-Type'] === 'application/x-www-form-urlencoded'
        ) {
            config.data = Qs.stringify(config.data);
        }

        // 在发送请求设置cancel token
        config.cancelToken = new Axios.CancelToken((cancel) => {
            axiosPromiseArr.push({ cancel });
        });

        return config;
    },
    (error) => {
        console.error('service request error:', error);

        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    async (res) => {
        const { data, status: code } = res;

        try {
            await handleHttpStatus(code);

            return data.data;
        } catch (err) {
            return Promise.reject(err);
        }
    },
    (error) => {
        console.error('service response error:', error);

        if (Axios.isCancel(error)) {
            console.log('取消请求');
            return;
        }

        if (error.message === 'Network Error') {
            error.message = '请求失败, 请检查网络是否已连接';
        } else if (error.message.includes('timeout')) {
            error.message = '请求超时, 请检查网络是否连接正常';
        }

        handleServiceError(error);
    }
);

// 响应拦截器 - 2
service.interceptors.response.use((response) => {
    // 最后在处理错误内容是在 响应内容中抛出的错误
    // 返回状态一直是`pending`状态的promise实例对象
    if (typeof response === 'undefined') {
        return new Promise(() => {});
    }

    return response;
});

/**
 * 处理 http 状态码
 * @param {object} data 请求返回的数据
 * @param {string | number} status http状态码
 * @return {never}
 */
const handleHttpStatus = function(status) {
    let msg = '';

    switch (status) {
        case 200:
        case 201:
            return;

        case 400:
            msg = '请求错误';
            break;

        case 401:
            // Store.dispatch('user/logout');
            msg = '登录过期, 请重新登录';
            break;

        case 403:
            // Store.dispatch('user/logout');
            msg = '拒绝请求, 当前操作没有被授权(权限)';
            break;

        case 404:
            msg = '请求路径不存在';
            break;

        case 500:
            msg = '服务器错误';
            break;

        case 504:
            msg = '网络代理错误';
            break;

        default:
            msg = '出现未知错误';
            break;
    }

    return Promise.reject(msg);
};

/**
 * 处理 错误
 * @param {*} error
 */
const handleServiceError = function(errRes) {
    const path = Router.currentRoute.path;

    // 避免因为多个请求出现错误，而重复跳转页面
    if (whiteList.includes(path)) {
        // Vue.prototype.$message({
        //     message: errRes.message,
        //     type: 'error',
        //     duration: 5 * 1000
        // });

        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject();
    } else {
        Router.push({
            path: '/500',
            query: {
                msg: errRes.message,
                api: errRes.config.url,
                status: errRes.status || errRes.code
            }
        });
    }
};

export default service;
