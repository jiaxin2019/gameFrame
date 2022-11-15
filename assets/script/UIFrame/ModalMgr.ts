import { BoxCollider2D, Component, Contact2DType, EPhysics2DDrawFlags, find, Node, PhysicsSystem2D } from "cc";
import { SysDefine } from "./config/SysDefine";
import { ModalType } from "./Struct";
import { UIWindow } from "./UIForm";
import UIModalScript from "./UIModalScript";

export default class ModalMgr extends Component {
    public static popUpRoot = "";
    public static _inst: ModalMgr = null!;

    private uiModal: UIModalScript = null!;

    public static get inst() {
        if (this._inst == null) {
            this._inst = new ModalMgr();
            let node = new Node("UIModalNode");
            ModalMgr.popUpRoot = SysDefine.SYS_UIROOT_NAME + "/" + SysDefine.SYS_POPUP_NODE;

            let rootNode = find(ModalMgr.popUpRoot);
            rootNode?.addChild(node);

            this._inst.uiModal = node.getComponent(UIModalScript)!;
            this._inst.uiModal.init();
        }
        return this._inst;
    }

    /** 为mask添加颜色 */
    private async showModal(maskType: ModalType) {
        await this.uiModal.showModal(maskType.opacity, maskType.easingTime, maskType.isEasing, maskType.dualBlur);
    }

    public checkModalWindow(coms: UIWindow[]) {
        if (coms.length <= 0) {
            this.uiModal.node.active = false;
            return;
        }
        this.uiModal.node.active = true;
        if (this.uiModal.node.parent) {
            this.uiModal.node.removeFromParent();
        }
        for (let i = coms.length - 1; i >= 0; i--) {
            if (coms[i].modalType.opacity > 0) {
                find(ModalMgr.popUpRoot)?.insertChild(this.uiModal.node, Math.max(coms[i].node.getSiblingIndex() - 1, 0));
                this.uiModal.fid = coms[i].fid;
                this.showModal(coms[i].modalType);
                break;
            }
        }
    }
}