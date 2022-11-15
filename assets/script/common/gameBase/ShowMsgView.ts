
import { _decorator, Label, Sprite, UIOpacity, tween, Widget } from 'cc';
import { BaseWin } from '../../common/gameBase/BaseWin';
const { ccclass, property } = _decorator;

@ccclass('ShowMsgView')
export class ShowMsgView extends BaseWin {
    @property({
        type: Label
    })
    msg: Label = null!;

    @property({
        type: Sprite
    })
    back: Sprite = null!;

    showMsg(msg: string): void {
        this.msg.string = msg;
    }

    start(): void {
        this.showTween();
    }

    private showTween(): void {
        let sf = this;
        let ui = sf.back.getComponent(UIOpacity);
        let we = sf.back.getComponent(Widget);
        if (ui) {
            ui.opacity = 0;
            tween(ui).to(.2, { opacity: 255 })
                .delay(.4)
                .to(.2, { opacity: 0 })
                .call(() => {
                    sf.node.removeFromParent();
                    sf.destroy();
                })
                .start();
        }

        if (we) {
            we.verticalCenter = -80;
            tween(we).to(.2, { verticalCenter: 0 })
                .delay(.4)
                .to(.2, { verticalCenter: 50 })
                .call(() => {
                    sf.node.removeFromParent();
                    sf.destroy();
                })
                .start();
        }
    }
}
