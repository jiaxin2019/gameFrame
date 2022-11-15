import UIConfig from "../../UIConfig";
import { IFormConfig } from "../Struct";

/** 窗体类型 */
export enum FormType {
    /** 屏幕 */
    Screen = "UIScreen",
    /** 固定窗口 */
    Fixed = "UIFixed",
    /** 弹出窗口 */
    Window = "UIWindow",
    /** Toast */
    Toast = "Toast",
    /** 独立窗口 */
    Tips = "UITips"
}

/** 透明度类型 */
export enum ModalOpacity {
    /** 没有mask， 可以穿透 */
    None,
    /** 完全透明，不能穿透 */
    OpacityZero,
    /** 高度透明，不能穿透 */
    OpacityLow,
    /** 半透明，不能穿透 */
    OpacityHalf,
    /** 低透明，不能穿透 */
    OpacityHigh,
    /** 完全不透明 */
    OpacityFull
}
/** UI状态 */
export enum UIState {
    None = 0,
    Loading,
    Showing,
    Hiding
}

export class SysDefine {
    /** 加载预支窗体 */
    public static defaultLoadingForm: IFormConfig = UIConfig.UILoading;
    /** 画布canvas常量 */
    public static SYS_PATH_CANVAS = "Canvas";
    public static SYS_PATH_UIFORMS_CONFIG_INFO = "UIFormsConfigInfo";
    public static SYS_PATH_CONFIG_INFO = "SysConfigInfo";

    /** 标签常量 */
    public static SYS_UIROOT_NAME = "Canvas/Scene/UIROOT";
    public static SYS_UIMODAL_NAME = "Canvas/Scene/UIROOT/UIModalManager";
    public static SYS_UIAdapter_NAME = "Canvas/Scene/UIROOT/UIAdapterManager";

    /** 节点常量 */
    public static SYS_SCENE_NODE = "Scene"
    public static SYS_UIROOT_NODE = "UIROOT";
    public static SYS_SCREEN_NODE = "Screen";
    public static SYS_FIXED_NODE = "FixedUI";
    public static SYS_POPUP_NODE = "PopUp";
    public static SYS_TOPTIPS_NODE = "TopTips";
    public static SYS_MODAL_NODE = "UIModalNode";

    /** 规范符号 */
    public static SYS_STANDARD_Prefix = '_';
    public static SYS_STANDARD_Separator = '$';
    public static SYS_STANDARD_End = '#';

    public static UI_PATH_ROOT = "UIForms/";

    public static SeparatorMap: { [key: string]: string } = {
        "_Node": "Node",
        "_Label": "Label",
        "_Button": "Button",
        "_Sprite": "Sprite",
        "_RichText": "RichText",
        "_Mask": "Mask",
        "_MotionStreak": "MotionStreak",
        "_TiledMap": "TiledMap",
        "_TiledTile": "TiledTile",
        "_Spine": "sp.Skeleton",
        "_Graphics": "Graphics",
        "_Animation": "Animation",
        "_WebView": "WebView",
        "_EditBox": "EditBox",
        "_ScrollView": "ScrollView",
        "_VideoPlayer": "VideoPlayer",
        "_ProgressBar": "ProgressBar",
        "_PageView": "PageView",
        "_Slider": "Slider",
        "_Toggle": "Toggle",
        "_ButtonPlus": "ButtonPlus",
    }
}