import { ModalOpacity } from "./config/SysDefine";

export class ModalType {
    public opacity: ModalOpacity = ModalOpacity.OpacityHalf;
    public clickMaskClose = false;          //点击阴影关闭
    public isEasing = true;                 //缓动实现
    public easingTime = 0.2;                //缓动时间
    public dualBlur = false;                //模糊

    constructor(opacity = ModalOpacity.OpacityHalf, clickMaskClose = false, isEasing = true, easingTime = 0.2) {
        this.opacity = opacity;
        this.clickMaskClose = clickMaskClose;
        this.isEasing = isEasing;
        this.easingTime = easingTime;
    }

    useBlur() {
        this.dualBlur = true;
        return this;
    }
}

/**窗口预制体配置信息 接口*/
export interface IFormConfig {
    //预制体路径
    prefabUrl: string;
    //窗口类型
    type: string;
}

export interface IFormData {
    loadingForm?: IFormConfig;
    onClose?: Function;
    //window类型的form才有
    priority?: EPriority;        // 当前有已经显示的window时, 会放等待列表里, 直到 当前没有正在显示的window时才被显示
    showWait?: boolean;          // 优先级(会影响弹窗的层级, 先判断优先级, 在判断添加顺序)
    uniqueId?: string;
}

/** window 层弹窗的优先级设置 */
export enum EPriority {
    ZERO,
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT,
    NINE,
}

export enum ECloseType {
    CloseAndHide,       //关闭后隐藏
    CloseAndDestory,    //关闭后销毁
    LRU,                //使用LRU控制其销毁时机
}