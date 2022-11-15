import { Canvas, director, instantiate, Prefab, resources } from "cc";
import { ShowMsgView } from "../gameBase/ShowMsgView";

export class ToastManager {
    static popTips(msg: string): void {
        let scene = director.getScene();
        if (!scene) return;
        let sf = this;
        resources.load("prefab/ShowMsgView", Prefab, function (err, prefab) {
            if (err) {
                console.error(err);
                return;
            }
            let msgView = instantiate(prefab);
            let ts = msgView.getComponent(ShowMsgView);
            msg && ts?.showMsg(msg);
            let canvas = scene?.getChildByName("Canvas");
            canvas?.addChild(msgView);
        })
    }
}
