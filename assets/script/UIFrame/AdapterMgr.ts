/**
 * @Author: jiaxin.sun
 * @Describe: 适配组件, 适配背景大小,窗体的位置
 */

let flagOffset = 0;
const _None = 1 << flagOffset++;
const _Left = 1 << flagOffset++;            // 左对齐
const _Right = 1 << flagOffset++;           // 右对齐
const _Top = 1 << flagOffset++;             // 上对齐
const _Bottom = 1 << flagOffset++;          // 下对齐
const _StretchWidth = _Left | _Right;          // 拉伸宽
const _StretchHeight = _Top | _Bottom;         // 拉伸高

const _FullWidth = 1 << flagOffset++;       // 等比充满宽
const _FullHeight = 1 << flagOffset++;      // 等比充满高
const _Final = 1 << flagOffset++;

/**  */
export enum AdapterType {
    Top = _Top,
    Bottom = _Bottom,
    Left = _Left,
    Right = _Right,

    StretchWidth = _StretchWidth,
    StretchHeight = _StretchHeight,

    FullWidth = _FullWidth,
    FullHeight = _FullHeight,
}

import { find, Node, Size, sys, UITransform, view, Widget, __private } from "cc";

export default class AdapterMgr {
    /** 屏幕尺寸 */
    public visibleSize: Size = null!;

    private static instance: AdapterMgr = null!;                     // 单例
    public static get inst() {
        if (this.instance == null) {
            this.instance = new AdapterMgr();
            this.instance.visibleSize = view.getVisibleSize();
            console.log(`visiable size: ${this.instance.visibleSize}`);
        }
        return this.instance;
    }

    public adapteByType(flag: number, node: Node, distance = 0) {
        let tFlag = _Final;
        while (tFlag > 0) {
            if (tFlag & flag)
                this.doAdapte(tFlag, node, distance);
            tFlag = tFlag >> 1;
        }
        let widget = node.getComponent(Widget)!;
        widget.target = find("Canvas");
        widget.updateAlignment();
    }

    private doAdapte(flag: number, node: Node, distance: number = 0) {
        let widget = node.getComponent(Widget);
        if (!widget) {
            widget = node.addComponent(Widget);
        }
        let uiTransForm = node.getComponent(UITransform)!;
        switch (flag) {
            case _None:
                break;
            case _Left:
                widget.isAlignLeft = true;
                widget.isAbsoluteLeft = true;
                widget.left = distance ? distance : 0;
                break;
            case _Right:
                widget.isAlignRight = true;
                widget.isAbsoluteRight = true;
                widget.right = distance ? distance : 0;
                break;
            case _Top:
                if (sys.platform === __private._pal_system_info_enum_type_platform__Platform.WECHAT_GAME) {     // 微信小游戏适配刘海屏
                    let menuInfo = (window as any)["wx"].getMenuButtonBoundingClientRect();
                    let systemInfo = (window as any)["wx"].getSystemInfoSync();
                    let height = find("Canvas")?.getComponent(UITransform)?.height!;
                    distance += height * (menuInfo.top / systemInfo.screenHeight);
                }
                widget.isAlignTop = true;
                widget.isAbsoluteTop = true;
                widget.top = distance ? distance : 0;
                break;
            case _Bottom:
                widget.isAlignBottom = true;
                widget.isAbsoluteBottom = true;
                widget.bottom = distance ? distance : 0;
                break;
            case _FullWidth:
                uiTransForm.height /= uiTransForm.width / this.visibleSize.width;
                uiTransForm.width = this.visibleSize.width;
                break;
            case _FullHeight:
                uiTransForm.width /= uiTransForm.height / this.visibleSize.height;
                uiTransForm.height = this.visibleSize.height;
                break;
        }
    }


    /** 移除 */
    removeAdaptater(node: Node) {
        if (node.getComponent(Widget)) {
            node.removeComponent(Widget);
        }
    }
}