import Cookies from 'js-cookie';

export const KEYS = {
    NAME: 'name',
    TOKEN: 'token'
};

/**
 * 删除所有
 */
export const delAll = function() {
    Object.values(KEYS).forEach((key) => {
        Cookies.remove(key);
    });
};

/**
 * 获取 token
 */
export const getToken = function() {
    return Cookies.get(KEYS.TOKEN);
};

/**
 * 设置 token
 * @param {string} token 值
 * @param {string} expires 过期时间
 */
export function setToken(token, expires) {
    return Cookies.set(KEYS.TOKEN, token, { expires });
}

/**
 * 删除 token
 */
export function delToken() {
    Cookies.remove(KEYS.TOKEN);
}

/**
 * 获取 名称
 */
export const getName = function() {
    return Cookies.get(KEYS.NAME);
};

/**
 * 设置 名称
 * @param {string} val 名称
 */
export function setName(val) {
    return Cookies.set(KEYS.NAME, val);
}
