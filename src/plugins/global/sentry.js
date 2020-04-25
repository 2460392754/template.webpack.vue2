import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import { Vue as VueIntegration } from '@sentry/integrations';
import { version } from '../../../package.json';
import config from '@config';

if (process.env.NODE_ENV !== 'dev') {
    Sentry.init({
        // 错误请求发送地址
        dsn: config.sentry.dsn,

        // 当前运行环境+版本号
        release: `${process.env.CONFIG_ENV}@${version}`,
        integrations: [
            new VueIntegration({
                Vue,
                attachProps: true
            })
        ]
    });
}
