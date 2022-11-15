
import { _decorator, Component, Node, assetManager, ImageAsset, SpriteFrame, Sprite } from 'cc';
const { ccclass, property } = _decorator;
export interface HeadIconInfo {
    //头像string
    headIcon: string
}
@ccclass('HeadIcon')
export class HeadIcon extends Component {

    start() {
        // [3]
    }

    initData(data: HeadIconInfo): void {
        let iconSpr = this.node.getComponentsInChildren(Sprite);
        assetManager.loadRemote(data.headIcon, { ext: '.png' }, (err: Error | null, asset: ImageAsset) => {
            if (err) {
                console.log(err);
                return;
            }
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = asset._texture;
            iconSpr[0].spriteFrame = spriteFrame;
        })
    }

}

