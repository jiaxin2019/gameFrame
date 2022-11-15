import UrlManager from "../manager/UrlManager";

export default class ShareJs {

    private static navShareUrl = window.location.href;
    static reqShare(tittle?: string, msg?: string): void {
        let url = "/pages/active/active?url=" + encodeURIComponent(ShareJs.navShareUrl);
        let shareImageUrl = window.location.protocol + '//gfs7.gomein.net.cn/wireless/T1exKnB_CT1RCvBVdK_375.jpg';
        let shareTittle = !tittle ? "快乐小虎机，一起赢大奖" : tittle;
        let shareMsg = !msg ? "幸运抽奖，快乐翻倍" : msg;
        var shareParam = {
            menus: {
                rightMenus: [
                    {
                        type: "share",
                        title: "分享",
                        icon: "file://share",
                        shareInfo: {
                            title: shareTittle,
                            shareType: "miniprogram",
                            shareDesc: shareMsg,
                            shareImageUrl,
                            shareUrl: ShareJs.navShareUrl,
                            platform: [
                                "WeiBo",
                                "WechatMiniProgram",
                                "WechatMoments",
                                "QQ",
                                "QZone",
                                "GomeMyFriends",
                                "GomeMoments",
                                "CopyLink"
                            ],
                            miniProgramActivityInfo: {
                                activityTitle: shareTittle,
                                activityPic: shareImageUrl,
                                activityDesc: shareMsg,
                                QRCodeParam: {
                                    type: 2,
                                    source: 1,
                                    url: url,
                                },
                                extensionInfo: {},
                            },
                            miniprogram: {
                                miniProgram_path: url, //"pages/newLiveList/newLiveList",
                                miniProgram_hdImageUrl: shareImageUrl,
                                miniProgram_webpageUrl: ShareJs.navShareUrl,
                            },

                        },
                    },
                    // videoIcon,
                ],
            },
        };

        if (UrlManager.isApp) {
            (window as any).GomeJSBridge.ready(() => {
                (window as any).GomeJSBridge.setHeadBar(
                    function (data: any) { },
                    function (err: any) { },
                    shareParam
                );
            }, null);
        }
    }

    static appShare(tittle?: string, msg?: string): void {
        let shareTittle = !tittle ? "快乐小虎机，一起赢大奖" : tittle;
        let shareMsg = !msg ? "幸运抽奖，快乐翻倍" : msg;
        let navShareUrl = window.location.href;
        var url = "/pages/active/active?url=" + encodeURIComponent(navShareUrl),
            shareImageUrl = window.location.protocol + '//gfs7.gomein.net.cn/wireless/T1exKnB_CT1RCvBVdK_375.jpg';
        let param = {
            universalParam: {
                channelSelect: {
                    channelList: [
                        "weibo", //微博
                        "wcmini", //微信小程序
                        "wcmoments", //微信朋友圏
                        "qq",
                        "qzone", //qq空间
                        "gfriend", //真快乐好友
                        "gcircle", // 我的圈子
                        "gmoments", //真快乐朋友圈
                        "copylink", //复制链接
                        // "commonposters", //海报
                        // "saveimage", // 保存图片
                    ],
                    scenceCode: "01", //一级入口渠道选择页面：01灰色半透明模板、02海报微信小程序码模板、03：海报通用二维码模板；
                    //"extendParam": {key:value } //bridge预留字段
                },
                //全局参数
                targetMessage: {
                    type: "link", // string，图片或H5链接
                    title: shareTittle, //string，分享标题
                    content: shareMsg, // string，分享内容
                    wapShareUrl: navShareUrl, // string，分享链接
                    iconImage: shareImageUrl, //string，分享logo
                    bigImage: [shareImageUrl], //"分享图片"，数组，分享图片
                },
                //请求业务所需参数：
                source: {
                    type: "link",
                    source: "1", //接口调用来源，1=app，2=国美小程序（生产商城小程序码+返回小程序码路径），3=美店小程序（生产美店小程序码+返回小程序码路径）,4=来购（查询导购员信息）
                    mainID: "", //string，业务主键，商品是skuid值或者cmsKey值，店铺是shopid，「与业务type对应的主键」
                    stid: "", //string，门店id
                    wapShareUrl: navShareUrl,
                    miniShareUrl:
                        "/pages/active/active?url=" + encodeURIComponent(url),
                },
                extendParam: {
                    "unShowSuccessPage": "Y 【禁止分享成功页展示】"
                }
            }

        };

        (window as any).GomeJSBridge.callShareComp(
            function (data: any) { },
            function (err: any) { },
            param
        );
    }

    static tigerShare(activeId: any, mainID: any, tittle?: string, msg?: string): void {
        let shareTittle = !tittle ? "快乐小虎机，一起赢大奖" : tittle;
        let shareMsg = !msg ? "幸运抽奖，快乐翻倍" : msg;
        let navShareUrl = window.location.href;
        var url = "/pages/active/active?url=" + encodeURIComponent(navShareUrl),
            shareImageUrl = window.location.protocol + '//gfs7.gomein.net.cn/wireless/T1exKnB_CT1RCvBVdK_375.jpg';
        let param = {
            universalParam: {
                channelSelect: {
                    channelList: [
                        "weibo", //微博
                        "wcmini", //微信小程序
                        "wcmoments", //微信朋友圏
                        "qq",
                        "qzone", //qq空间
                        "gfriend", //真快乐好友
                        "gcircle", // 我的圈子
                        "gmoments", //真快乐朋友圈
                        "copylink", //复制链接
                        // "commonposters", //海报
                        // "saveimage", // 保存图片
                    ],
                    scenceCode: "01", //一级入口渠道选择页面：01灰色半透明模板、02海报微信小程序码模板、03：海报通用二维码模板；
                    // "extendParam": extendParam //bridge预留字段
                },
                //全局参数
                targetMessage: {
                    type: "link", // string，图片或H5链接
                    title: shareTittle, //string，分享标题
                    content: shareMsg, // string，分享内容
                    wapShareUrl: navShareUrl, // string，分享链接
                    iconImage: shareImageUrl, //string，分享logo
                    bigImage: [shareImageUrl], //"分享图片"，数组，分享图片
                },
                //请求业务所需参数：
                source: {
                    type: "link",
                    source: "1", //接口调用来源，1=app，2=国美小程序（生产商城小程序码+返回小程序码路径），3=美店小程序（生产美店小程序码+返回小程序码路径）,4=来购（查询导购员信息）
                    mainID: "", //string，业务主键，商品是skuid值或者cmsKey值，店铺是shopid，「与业务type对应的主键」
                    stid: "", //string，门店id
                    wapShareUrl: navShareUrl,
                    miniShareUrl:
                        "/pages/active/active?url=" + encodeURIComponent(url),
                },
                extendParam: {
                    shareStatistic: {
                        stid: '123',
                        sourceInfo: {
                            "activeId": activeId,
                            "cmsKey": '123'
                        },
                        type: "07",
                        mainID: mainID,
                        url: window.location.href
                    },
                    "unShowSuccessPage": "Y"
                }
            }
        };

        (window as any).GomeJSBridge.callShareComp(
            function (data: any) { },
            function (err: any) { },
            param
        );
    }
}