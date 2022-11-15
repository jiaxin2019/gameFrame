
import { _decorator, Component, Node, find, UIOpacity, UITransform, Mask } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ProgressMashBar')
export class ProgressMashBar extends Component {
    protected _progress: number = 0;
    set progress(val: number) {
        this._progress = val;
        this.upPro(val);
    }

    get progress(): number {
        return this._progress;
    }
    /**
     * 更新百分比
     * @param cha 分子
     * @param total 分母
    */
    private upPro(percent: number): void {
        let width = this.node.getComponent(UITransform)?.width || 100;
        let mask = this.node.children[1];
        let ui = mask.getComponent(UITransform);
        ui && (ui.width = width * percent);
    }
}
