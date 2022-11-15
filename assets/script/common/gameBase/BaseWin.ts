
import { _decorator, Component, Node } from 'cc';
import { EventManager } from '../EventManager';
import { eOpEvent } from './WinOpenType';
const { ccclass } = _decorator;

@ccclass('BaseWin')
export class BaseWin extends Component {
    public show() {
        this.node.active = true;
    }

    protected onWinOpEnd(): void {
        //调用的时候，可以添加自己的逻辑

    }

    public hide() {
        this.node.active = false;
    }


    start() {
        //打开方式结束时候调用
        EventManager.ins.on(eOpEvent.opEnd, this.onWinOpEnd, this);
    }

    // update (deltaTime: number) {
    //     // [4]
    // }
    onDestroy(): void {
        EventManager.ins.of(eOpEvent.opEnd, this.onWinOpEnd, this);
    }
}
