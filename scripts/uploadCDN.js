const qiniu = require('qiniu');
const glob = require('glob');
const mime = require('mime');
const path = require('path');
const chalk = require('chalk');

class UploadCDN {
    constructor() {
        this.init();
    }

    async init() {
        console.log(chalk.blue('\n--- 开始上传CDN到七牛云 ---\n'));
        await this.uploadFileCDN();
        console.log(chalk.green('\n--- 上传完成 ---\n'));
    }

    get getPre() {
        const isWindow = /^win/.test(process.platform);
        let pre = path.resolve(__dirname, '../dist/') + (isWindow ? '\\' : '');

        pre = pre.replace(/\\/g, '/');

        return pre;
    }

    get getConfig() {
        return {
            // 对象存储空间名称
            scope: 'pocky',
            // cdn域名
            domain: 'http://q6kmjvnf9.bkt.clouddn.com',
            accessKey: 'yr_QIlZ3iRal35qDkvB1mEx_uOdiCoT7L-qihUMe',
            secretKey: 'xVzt-MsFmefnySNUFOynvAKKktWsOBzBwnEOq5og'
        };
    }

    get getFileList() {
        return glob.sync(
            path.resolve(__dirname, '../dist/**/*.?(js|css|map|png|jpg|svg|woff|woff2|ttf|eot)')
        );
    }

    get getQiniuConfig() {
        // AK和SK对象
        const mac = new qiniu.auth.digest.Mac(this.getConfig.accessKey, this.getConfig.secretKey);
        const putPolicy = new qiniu.rs.PutPolicy({ scope: this.getConfig.scope });
        const uploadToken = putPolicy.uploadToken(mac);
        // 华东主机
        const cf = new qiniu.conf.Config({
            zone: qiniu.zone.Zone_z0
        });
        const formUploader = new qiniu.form_up.FormUploader(cf);

        return {
            uploadToken,
            formUploader
        };
    }

    async uploadFile(key, localFile) {
        const extname = path.extname(localFile);
        const mimeName = mime.getType(extname);
        const putExtra = new qiniu.form_up.PutExtra({ mimeType: mimeName });

        return new Promise((resolve, reject) => {
            this.getQiniuConfig.formUploader.putFile(
                this.getQiniuConfig.uploadToken,
                key,
                localFile,
                putExtra,
                function(respErr, respBody, respInfo) {
                    if (respErr) {
                        reject(respErr);
                    }

                    resolve({ respBody, respInfo });
                }
            );
        });
    }

    getFileKey(file) {
        if (file.indexOf(this.getPre) > -1) {
            const key = file.split(this.getPre)[1];
            return key.startsWith('/') ? key.substring(1) : key;
        }

        return file;
    }

    async uploadFileCDN() {
        for (const file of this.getFileList) {
            const fileName = this.getFileKey(file);

            try {
                await this.uploadFile(fileName, file);
                console.log(chalk.cyan(`上传成功, 文件名称: `, fileName));
            } catch (err) {
                console.log(chalk.red('上传错误, 文件名称：', fileName, '错误内容：', err));
            }
        }
    }
}

new UploadCDN();
