
import { Animation, director, Label, } from 'cc';
import { _decorator, Component, Sprite, ProgressBar, } from 'cc';
import UrlManager from '../../common/manager/UrlManager';
import ShareJs from '../../common/network/ShareJs';
const { ccclass, property } = _decorator;

@ccclass('Loading')
export class Loading extends Component {
    @property({
        type: Sprite
    })
    iconSpr: Sprite = null!;

    @property({
        type: Animation
    })
    anim: Animation = null!;

    private onEnd(): void {
        // this.anim.pause();
        director.loadScene("SlotMachines");
    }

    start() {
        director.preloadScene("SlotMachines", this.onProgress.bind(this), this.onEnd.bind(this));
        ShareJs.reqShare();
    }

    private onProgress(completedCount: any, totalCount: any, item: any) {
        // let perCent = completedCount / totalCount;
    }
}


