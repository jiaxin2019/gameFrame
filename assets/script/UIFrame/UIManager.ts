import { BaseNode, Director, director, instantiate, js, Node, Scene } from "cc";
import { DEBUG } from "cc/env";
import AdapterMgr, { AdapterType } from "./AdapterMgr";
import { FormType, SysDefine } from "./config/SysDefine";
import { EventCenter } from "./EventCenter";
import { EventType } from "./EventType";
import { LRUCache } from "./LRUCache";
import ModalMgr from "./ModalMgr";
import ResMgr from "./ResMgr";
import { ECloseType, IFormData } from "./Struct";
import UIBase from "./UIBase";
import { UIWindow } from "./UIForm";

export default class UIManager {
    private UIROOT: Node = null!;       // UIROOT
    private ndScreen: Node = null!;     // 全屏显示的UI 挂载结点
    private ndFixed: Node = null!;      // 固定显示的UI
    private ndPopUp: Node = null!;      // 弹出窗口
    private ndTips: Node = null!;       // 独立窗体

    private windows: UIWindow[] = [];                                                           // 存储所有弹出的窗体
    private allForms: { [key: string]: UIBase } = js.createMap();                               // 所有已经挂载的窗体，可能有没显示的
    private showingForms: { [key: string]: UIBase } = js.createMap();                           // 正在显示的窗体
    private tipsForms: { [key: string]: UIBase } = js.createMap();                              // 独立窗体 独立于其他的窗体，不受其他窗体的影响
    private loadingForm: { [key: string]: ((value: UIBase) => void)[] } = js.createMap();       // 正在加载的 form
    private LRUCache: LRUCache = new LRUCache(3);                                               // LRU cache


    /**单例创建*/
    private static instance: UIManager = null!;
    public static getInstance(): UIManager {
        if (this.instance == null) {
            this.instance = new UIManager();

            //引入cocos 引擎的相关设置
            //寻找当前场景的Canvas组件
            let canvas = director.getScene()?.getChildByName("Canvase");
            let sceneNode: any = canvas?.getChildByName(SysDefine.SYS_SCENE_NODE);
            if (!sceneNode) {
                sceneNode = new Node(SysDefine.SYS_SCENE_NODE);
                sceneNode?.addComponent(Scene);
                canvas && (sceneNode.parent = canvas);
            }

            let UIROOT = this.instance.UIROOT = new Node(SysDefine.SYS_FIXED_NODE);
            (sceneNode as Node).addChild(UIROOT);

            UIROOT.addChild(this.instance.ndScreen = new Node(SysDefine.SYS_FIXED_NODE));
            UIROOT.addChild(this.instance.ndScreen = new Node(SysDefine.SYS_FIXED_NODE));
            UIROOT.addChild(this.instance.ndScreen = new Node(SysDefine.SYS_FIXED_NODE));
            UIROOT.addChild(this.instance.ndScreen = new Node(SysDefine.SYS_FIXED_NODE));

            director.once(Director.EVENT_BEFORE_SCENE_LAUNCH, () => {
                this.instance = null!;
            })
        }
        return this.instance;
    }

    /** 预加载 UIForm */
    public async loadUIForm(prefabPath: string): Promise<UIBase> {
        let uiBase = await this.loadForm(prefabPath);
        if (!uiBase) {
            console.warn(`${uiBase}没有被成功加载`);
            return null!;
        }
        return uiBase;
    }

    /** 从窗口缓存中加载(如果没有就会在load加载), 并挂载到结点上 */
    public async loadForm(prefabPath: string, params?: any, formData?: IFormData): Promise<UIBase> {
        let com = this.allForms[prefabPath];
        if (com) return com;
        return new Promise((resolve, reject) => {
            if (this.loadingForm[prefabPath]) {
                this.loadingForm[prefabPath].push(resolve);
                return;
            }
            this.loadingForm[prefabPath] = [resolve];
            this.doLoadUIForm(prefabPath).then((com: UIBase) => {
                for (const func of this.loadingForm[prefabPath]) {
                    func(com);
                }
                this.loadingForm[prefabPath] = null!;
                delete this.loadingForm[prefabPath];
            })
        })
    }


    /** 窗体是否正在显示 */
    public checkFormShowing(fid: string): boolean {
        let com = this.allForms[fid];
        if (!com) return false;
        return com.node.active;
    }

    /**
    * 加载显示一个UIForm
    * @param prefabPath 
    * @param params 
    * @param formData 
    * @returns 
    */
    public async openForm(prefabPath: string, params?: any, formData?: IFormData) {
        if (!prefabPath || prefabPath.length <= 0) {
            console.warn(`${prefabPath} ,参数错误`);
            return;
        }
        if (this.checkFormShowing(prefabPath)) {
            console.warn(`${prefabPath},窗体正在显示中`);
            return null;
        }

        let com = await this.loadForm(prefabPath);
        if (!com) {
            console.warn(`${prefabPath}加载失败了！`);
            return null;
        }
        // 初始化窗体名称
        com.fid = prefabPath;
        com.formData = formData!;
        switch (com.formTpe) {
            case FormType.Screen:
                await this.enterToScreen(com.fid, params);
                break;
            case FormType.Screen:
                await this.enterToPopUp(com.fid, params);
                break;
            case FormType.Screen:
                await this.enterToTips(com.fid, params);
                break;
            case FormType.Screen:
                await this.enterToFixed(com.fid, params);
                break;
            default:
                break;
        }
    }

    /**
    * 关闭一个UIForm
    * @param prefabPath 
    */
    public async closeForm(prefabPath: string) {
        if (!prefabPath || prefabPath.length <= 0) {
            console.warn(`${prefabPath}参数错误`);
            return false;
        }
        let com = this.allForms[prefabPath];
        if (!com) return false;

        switch (com.formTpe) {
            case FormType.Screen:
                await this.exitToScreen(prefabPath);
                break;
            case FormType.Fixed:
                await this.exitToFixed(prefabPath);
                break;
            case FormType.Window:
                await this.exitToPopup(prefabPath);
                break;
            case FormType.Tips:
                await this.exitToTips(prefabPath);
                break;
            default:
                break;
        }
        //关闭的事件发送
        EventCenter.emit(EventType.FormClosed, prefabPath);

        if (com.formData) {
            com.formData.onClose && com.formData.onClose();
        }

        switch (com.formData) {
            case ECloseType.CloseAndDestory:
                this.destoryForm(com);
                break;
            case ECloseType.LRU:
                this.putLRUCache(com);
                break;

            default:
                break;
        }
        return true;
    }

    /** 添加到screen中 */
    private async enterToScreen(fid: string, params: any) {
        //关闭其他显示窗口
        let arr: Array<Promise<boolean>> = [];
        for (let key in this.showingForms) {
            arr.push(this.showingForms[key].closeSelf());
        }
        await Promise.all(arr);

        let com = this.allForms[fid];
        if (!com) return;
        this.showingForms[fid] = com;

        //?
        AdapterMgr.inst.adapteByType(AdapterType.StretchHeight | AdapterType.StretchWidth, com.node);

        await com.preInit(params);
        com.onShow(params);

        await this.showEffect(com);
        com.onAfterShow(params);
    }

    /** 从screen中删除 */
    private async exitToScreen(fid: string) {
        let com = this.showingForms[fid];
        if (!com) return;

        com.onHide();
        await this.hideEffect(com);
        com.onAfterHide();

        this.showingForms[fid] = null!;
        delete this.showingForms[fid];
    }

    private async exitToFixed(fid: string) {
        let com = this.allForms[fid];
        if (!com) return;

        com.onHide();
        await this.hideEffect(com);
        com.onAfterHide();

        this.showingForms[fid] = null!;
        delete this.showingForms[fid];
    }

    /** 添加到PopUp中 */
    private async enterToPopUp(fid: string, params: any) {
        let com = this.allForms[fid] as UIWindow;
        if (!com) return;

        await com.preInit(params);
        this.windows.push(com);

        for (let i = 0; i < this.windows.length; i++) {
            this.windows[i].node.setSiblingIndex(i + 1);
        }

        com.onShow(params);
        this.showingForms[fid] = com;

        ModalMgr.inst.checkModalWindow(this.windows);
        await this.showEffect(com);
        com.onAfterShow(params);
    }

    private async exitToPopup(fid: string) {
        if (this.windows.length <= 0) return;
        let com: UIWindow = null!;
        for (let i = this.windows.length - 1; i >= 0; i--) {
            if (this.windows[i].fid === fid) {
                com = this.windows[i];
                this.windows.splice(i, 1);
            }
        }
        if (!com) return;
        com.onHide();
        ModalMgr.inst.checkModalWindow(this.windows);
        await this.hideEffect(com);
        com.onAfterHide();

        this.showingForms[fid] = null!;
        delete this.showingForms[fid];
    }

    /** 加载到 tips 中 */
    private async enterToTips(fid: string, params: any) {
        let com = this.allForms[fid];
        if (!com) return;

        await com.preInit(params);
        this.tipsForms[fid] = com;

        com.onShow(params);
        await this.showEffect(com);
        com.onAfterShow(params);
    }

    /** 添加到Fixed中 */
    private async enterToFixed(fid: string, params: any) {
        let com = this.allForms[fid];
        if (!com) return;

        await com.preInit(params);
        com.onShow(params);
        this.showingForms[fid] = com;

        await this.showEffect(com);
        com.onAfterShow(params);
    }

    private async exitToTips(fid: string) {
        let com = this.allForms[fid];
        if (!com) return;

        com.onHide();
        await this.hideEffect(com);
        com.onAfterHide();

        this.tipsForms[fid] = null!;
        delete this.tipsForms[fid];
    }

    private async hideEffect(baseUI: UIBase) {
        await baseUI.hideEffect();
        baseUI.node.active = false;
    }

    private destoryForm(com: UIBase): void {
        //销毁动态加载资源
        ResMgr.inst.destoryDynamicRes(com.fid);
        //销毁prefab以及其资源
        ResMgr.inst.destoryFormPrefab(com.fid);
        //销毁node
        com.node.destroy();
        //从allmap中删除
        this.allForms[com.fid] = null!;
        delete this.allForms[com.fid];

    }

    /** LRU缓存控制 */
    private putLRUCache(com: UIBase) {
        this.LRUCache.put(com.fid);
        if (!this.LRUCache.needDelete()) return;
        let deleteFid = this.LRUCache.deleteLastNode();
        if (deleteFid) {
            DEBUG && console.log('close form id:', deleteFid, this.LRUCache.toString())
            let com = this.getForm(deleteFid);
            if (!com || !com.node) return;
            com && this.destoryForm(com);
        }

    }

    private async showEffect(baseUI: UIBase) {
        baseUI.node.active = true;
        await baseUI.showEffect();
    }

    /**
    * @param prefabPath 预制体路径
    */
    private async doLoadUIForm(prefabPath: string): Promise<UIBase> {
        let prefab = await ResMgr.inst.loadFormPrefab(prefabPath);
        let node = instantiate<Node>(prefab);
        let com = (node as Node).getComponent(UIBase);
        if (!com) {
            console.warn(`${prefabPath} 结点没有绑定UIBase`);
            return null!;
        }
        node.active = true;
        switch (com.formTpe) {
            case FormType.Screen:
                this.ndScreen.addChild(node);
                break;
            case FormType.Fixed:
                this.ndFixed.addChild(node);
                break;
            case FormType.Window:
                this.ndPopUp.addChild(node);
                break;
            case FormType.Tips:
                this.ndTips.addChild(node);
                break;
            default:
                break;
        }
        this.allForms[prefabPath] = com;
        return com;
    }

    /** 获得Component
     * @param fId string 类型，窗口id值
     */
    public getForm(fId: string) {
        return this.allForms[fId];
    }

    /** 获取UI的根节点
     */
    public getUIROOT() {
        return this.UIROOT;
    }
}

if (DEBUG) {
    (window as any)['UIManager'] = UIManager;
}