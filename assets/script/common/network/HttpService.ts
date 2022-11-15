import { sys } from "cc";
import { DEBUG } from "cc/env";
import { handler } from "../Util";

export default class HttpService {
    private static _ins: HttpService = null!;
    /**
     * 获取一个单例
     * @return {any}
     */
    static get ins(): HttpService {
        HttpService._ins || (HttpService._ins = new HttpService());
        return HttpService._ins;
    }


    doGet(url: string, headers: any, params: any, cb: handler, judgeFail = false) {
        if (params) {
            if (url.indexOf("?") == -1) {
                url += "?";
            }
            url += this.getQueryString(params.data);
        }
        this.doHttp(url, headers, null, "GET", cb, judgeFail);
    }

    doPost(url: string, headers: any, params: any, cb: handler, judgeFail = false) {
        this.doHttp(url, headers, params, "POST", cb, judgeFail);
    }

    doDownload() {

    }

    private doHttp(url: string, headers: any, params: any, method: string, cb: handler, judgeFail = false) {
        const xhr = new XMLHttpRequest();
        xhr.responseType = "text";
        xhr.onreadystatechange = this.onReadyStateChange.bind(this, xhr, cb, judgeFail);
        xhr.ontimeout = this.onTimeout.bind(this, xhr, url);
        xhr.onerror = this.onError.bind(this, xhr, url);
        xhr.onabort = this.onAbort.bind(this, xhr, url);
        // DEBUG && console.log(`HttpService, doHttp url=${url}, method=${method}, parmas=${params}`)
        xhr.open(method, url, true);
        if (headers) {
            this.setHttpHeaders(xhr, headers);
        }
        // if (method === 'POST') {
        xhr.withCredentials = true;
        // let strCookie = 
        // xhr.setRequestHeader("Cookie", strCookie);
        // }
        if (sys.isNative) {
            this.setHttpHeaders(xhr, { "Accept-Encoding": "gzip,deflate,multipart/form-data" });
        }
        // if (params && typeof params === "object") {
        //     // params = encodeURIComponent('body') + ':' + new Object(JSON.stringify(params.data));
        //     params = JSON.stringify(params.data);
        // }
        if (params && typeof params === "object") {
            if (method === 'POST') {
                params = encodeURIComponent('body') + '=' + new Object(JSON.stringify(params.data));
            } else {
                params = JSON.stringify(params.data);
            }
        }
        xhr.send(params);
    }

    private onReadyStateChange(xhr: XMLHttpRequest, cb: handler, judgeFail: boolean) {
        DEBUG && console.log(`HttpService, onReadyStateChange, readyState=${xhr.readyState}, status=${xhr.status}`);
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 && xhr.status < 300) {
                let data;
                let code = HttpCode.kUnknown;
                const response = JSON.parse(xhr.responseText);
                if (response && response.code) {
                    code = response.code;
                    data = response.content || response;
                }
                else {
                    code = HttpCode.kSuccess;
                    data = response;
                }
                this.notifyCallback(cb, code, data);
                this.removeXhrEvent(xhr);
            }
            else if (xhr.status === HttpCode.kReqFail && judgeFail) {
                //(断网)请求协议失败，并且当前请求需要抛出请求失败
                this.notifyCallback(cb, HttpCode.kReqFail, { failReason: "网络繁忙" });
                this.removeXhrEvent(xhr);
            }
        }
    }

    private onTimeout(xhr: XMLHttpRequest, url: string) {
        // console.warn(`${url}, request ontimeout`);
        this.removeXhrEvent(xhr);
    }

    private onError(xhr: XMLHttpRequest, url: string) {
        // console.warn(`${url}, request onerror`);
        this.removeXhrEvent(xhr);
    }

    private onAbort(xhr: XMLHttpRequest, url: string) {
        // console.warn(`${url}, request onabort`);
        this.removeXhrEvent(xhr);
    }

    private removeXhrEvent(xhr: XMLHttpRequest) {
        xhr.ontimeout = null;
        xhr.onerror = null;
        xhr.onabort = null;
        xhr.onreadystatechange = null;
    }

    private notifyCallback(cb: handler, code: number, data?: any) {
        if (cb) {
            cb.exec(code, data);
        }
    }

    private setHttpHeaders(xhr: XMLHttpRequest, headers: any) {
        for (let key in headers) {
            xhr.setRequestHeader(key, headers[key]);
        }
    }

    private getQueryString(params: any) {
        const tmps: string[] = [];
        for (let key in params) {
            tmps.push(`${key}=${params[key]}`);
        }
        return tmps.join("&");
    }
}

export enum HttpCode {
    //请求成功
    kSuccess = 200,
    kTimeout = 10000,
    kUnknown = 10001,
    kSessionTimeout = -8,
    kIAmInBlocklist = -3013,
    kUserIsInMyBlocklist = -3014,
    //网络断开，请求失败
    kReqFail = 0
}