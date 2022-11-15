import HttpService, { HttpCode } from "../network/HttpService";
import { handler } from "../Util";
import { ToastManager } from "./ToastManager";

//cookie中的信息字段
export enum CookieInfo {
    DYN_USER_CONFIRM = "DYN_USER_CONFIRM",
    //用户uid(唯一指定)
    SSO_USER_ID = "SSO_USER_ID",
    addr_lat = "addr_lat",
    addr_lng = "addr_lng",
    awaken = "awaken",
    ctx = "ctx",
    gcName = "gcName",
    gcid = "gcid",
    gdName = "gdName",
    gdid = "gdid",
    gpName = "gpName",
    gpid = "gpid",
    gradeId = "gradeId",
    gtName = "gtName",
    gtid = "gtid",
    organizationId = "organizationId",
    prepaidCardNumber = "prepaidCardNumber",
    sensorsdata2015jssdkcross = "sensorsdata2015jssdkcross",
    ufpd = "ufpd",
    __ugk = "__ugk",
}

export enum HrefInfo {
    //跳转路径
    scene = "scene",
}

//localStorage中的信息字段
export enum LocalStorageKey {
    //踢足球 指引
    footBallGuide = "footBallGuide",
}

export default class UrlManager {
    //协议用地址
    private static baseUrl = `${location.protocol}//mobile.gome.com.cn`;
    private static cmsHost = `${location.protocol}//prom.mobile.gome.com.cn`;

    //跳转用地址
    private static jumpUrl = `${location.protocol}//hd.m.gome.com.cn/`;

    static get getUrl(): string {
        let url = this.baseUrl;
        if (location.host.includes("gomeuat")) {
            url = `${location.protocol}//mobile.gomeuat.com.cn`;
        }
        return url;
    }

    static jump(htmlUrl: string, data?: any) {
        let url = this.jumpUrl;
        if (location.host.includes("gomeuat")) {
            url = url.replace('gome', 'gomeuat');
        }
        if (data)
            url = url + `${htmlUrl}.html?` + this.getQueryString(data);
        else
            url = url + `${htmlUrl}.html`;
        //http://hd.m.gomeuat.com.cn/coin_detail.html?activityID=L10001


        if (this.isWX) {
            //微信小程序判断
            (window as any).miniAppBridge.navigateTo("/pages/active/active?url=" + encodeURIComponent(url))
        }
        else if (!this.isApp) {
            //不是app走这里
            window.location.href = url;
        }
        else {
            (window as any).GomeJSBridge.pushWindow(null, null, url);
        }
    }

    static jumpByInfo(htmlUrl: string) {
        let url = htmlUrl;
        if (location.host.includes("gomeuat") && !url.includes("gomeuat")) {
            url = url.replace('gome', 'gomeuat');
        }
        //微信小程序判断
        if (this.isWX) {
            (window as any).miniAppBridge.navigateTo("/pages/active/active?url=" + encodeURIComponent(url))
        }
        else if (!this.isApp) {
            window.location.href = url;
        }
        else {
            (window as any).GomeJSBridge.pushWindow(null, null, url);
        }
    }
    /**埋点设置
     * @param mainStr 主要参数
     * @param prama 传入的参数
    */
    static buryingPoint(mainStr: string, prama: any) {
        (window as any).GomeSa && (window as any).GomeSa.track(mainStr, prama);
    }

    public static getQueryString(params: any) {
        const tmps: string[] = [];
        for (let key in params) {
            tmps.push(`${key}=${params[key]}`);
        }
        return tmps.join("&");
    }

    /**当前是否是App环境
     * @returns true:是app环境，false:不是App环境
    */
    public static get isApp(): boolean {
        let userAgent = navigator.userAgent || "";
        let version = userAgent.toLowerCase().match(/(gome(plus|backup)|GomeSeller|NPOP)?\/[iphone\/]{0,7}(\d*)\//)?.concat()[3]
            ? userAgent.match(/(gome(plus|backup)|GomeSeller|NPOP)?\/[iphone\/]{0,7}(\d*)\//)?.concat()[3]
            : -1;
        if (version && version > -1) {
            return true;
        }
        return false;
    }

    /**当前是否是微信环境
     * @returns true:是wx环境，false:不是wx环境
     */
    public static get isWX(): boolean {
        //微信小程序判断
        let ctx = /ctx=([^;]+);?/i.test(document.cookie) ? RegExp.$1 : "";
        if (/\|plt-(wx|tt|swan|ali)app\|/i.test(ctx)) {
            return true;
        }
        return false;
    }

    /**当前没有底部导航
    * @returns true:是没有导航，false:有导航
   */
    public static get isNoHaBoNa(): boolean {
        let userAgent = navigator.userAgent || "";
        let version = userAgent.toLowerCase().match(/(gome(plus|backup)|GomeSeller|NPOP)?\/[iphone\/]{0,7}(\d*)\//)?.concat()[3]
            ? userAgent.match(/(gome(plus|backup)|GomeSeller|NPOP)?\/[iphone\/]{0,7}(\d*)\//)?.concat()[3]
            : -1;
        if (version && version > -1 && version < 217) {
            return true;
        }
        return false;
    }

    /**
     * 获取当前的cookie 信息
    */
    public static get cookieParse(): any {
        const cookieArr = document.cookie.split(';')
        let cookieMap: any = {};
        cookieArr.forEach(function (item) {
            cookieMap[item.split('=')[0].trim()] = item.split('=')[1].trim()
        })
        return cookieMap;
    }

    /**
    * 获取当前的cookie 中指定key对应的信息
    * @param key CookieInfo 指定的字符串
    * @return 返回指定的字符串信息
    */
    public static getCookieInfo(key: CookieInfo): string {
        let obj = this.cookieParse;
        return obj[key];
    }

    /**
    * 设置当前localStorage 中对应ke要储存的信息
    * @param key LocalStorageKey 指定的字符串
    * @return 返回指定的字符串信息
    */
    public static setLocalStorageInfo(key: LocalStorageKey, info: string): void {
        let localUid = UrlManager.getCookieInfo(CookieInfo.SSO_USER_ID);
        localStorage.setItem(`${localUid}_${key}`, info);
    }

    /**
     * 获取当前localStorage 中对应key储存的信息
     * @param key LocalStorageKey 指定的字符串
     * @return 返回指定的字符串信息
     */
    public static getLocalStorageInfo(key: LocalStorageKey): string {
        let localUid = UrlManager.getCookieInfo(CookieInfo.SSO_USER_ID);
        let guideTime = localStorage.getItem(`${localUid}_${key}`);
        return guideTime || "";
    }

    /**
     * 当前玩家是否已经登录账号:小程序使用
     * @param func 登录的时候，正常的行走逻辑
     */
    public static userIsLogin(func: Function): void {
        let callback = function (...args: any) {
            const { isSuccess, failReason = "" } = args[1];
            if (isSuccess === "N" && failReason.indexOf("登录") > 0) {
                let url = "//login.m.gome.com.cn/login.html";
                if (location.host.includes("gomeuat")) {
                    url = url.replace('gome', 'gomeuat');
                }
                if (UrlManager.isWX) {
                    (window as any).miniAppBridge && (window as any).miniAppBridge.navigateTo({
                        url: `/packLogin/pages/loginEmpower/loginEmpower`,
                    })
                }
                else if (!UrlManager.isApp) {
                    window.location.href = url;
                }
                else {
                    (window as any).GomeJSBridge.pushWindow(null, null, url);
                }
            } else {
                func();
            }
        }
        let hand: handler = new handler();
        hand.init(callback);
        HttpService.ins.doPost(`${this.getUrl}/h5/profile/userProfileA.jsp`, { 'Content-Type': 'application/x-www-form-urlencoded' }, { data: {} }, hand);
    }

    /**
     * 获取当前的href信息
     */
    public static get hrefParse(): any {
        const hrefArr = location.href.split('?');
        let hrefMap: any = {};
        hrefMap["url"] = hrefArr[0];
        let parStr = hrefArr[1];
        if (parStr) {
            let paramsArr = parStr.split("&");
            paramsArr.forEach(function (item) {
                hrefMap[item.split('=')[0].trim()] = decodeURI(item.split('=')[1].trim());
            })
        }
        return hrefMap;
    }

    /**
    * 获取当前的href 中指定key对应的信息
    * @param key HrefInfo 指定的字符串
    * @return 返回指定的字符串信息
    */
    public static getHrefInfo(key: HrefInfo): string {
        let obj = this.hrefParse;
        return obj[key];
    }

    /**
       * 获取当前的网络状态
       * @param func 有网络的情况的回调
       * @param showMsg 没有联网的时候，是否弹出提示
       */
    public static isOnline(func: Function, showMsg = false): void {
        if (UrlManager.isApp) {
            (window as any).GomeJSBridge.getNetworkType(function (data: any) {
                if (data.status === "offline") {
                    showMsg && ToastManager.popTips("网络繁忙");
                    return;
                }
                func();
            }, function (err: any) {
                showMsg && ToastManager.popTips("网络繁忙");
            })
        } else {
            if (navigator.onLine) {
                func();
            } else {
                showMsg && ToastManager.popTips("网络繁忙");
            }
        }
    }

}