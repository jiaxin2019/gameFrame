
import { _decorator, Component, Node, tween, v3, Enum, Sprite, Widget, widgetManager, UITransform, UIOpacity } from 'cc';
import { EventManager } from '../EventManager';
const { ccclass, property } = _decorator;
export enum eOpenType {
    scaleOp = 1,
    topOp,
    bottom
}

Enum(eOpenType)
export enum eOpEvent {
    opStart = "opStart",
    opEnd = "opEnd",
}
@ccclass('WinOpenType')
export class WinOpenType extends Component {
    @property({
        type: eOpenType
    })
    opType: eOpenType = eOpenType.scaleOp;
    @property({
        type: 0
    })
    starNum: number = 0;

    //停止的bottom位置，默认是0
    @property({
        type: 0

    })
    endNum: number = 0;

    @property({
        type: 0
    })
    useTime: number = .3;
    /**当前需要更改的变量值，底部栏为例*/
    chaNum = 0;
    onEnable(): void {
        this.viewOpen();
    }

    // start() {
    //     this.viewOpen();
    // }

    private viewOpen(): void {
        if (this.opType == eOpenType.scaleOp) {
            let op = this.node.getComponent(UIOpacity);
            if (op) {
                op.opacity = 0;
                setTimeout(() => {
                    this.scaleOp();
                    op && (op.opacity = 255);
                }, 100);
                return;
            }
            this.scaleOp();
        } else if (this.opType == eOpenType.topOp) {
            this.topOp();
        }
        else if (this.opType == eOpenType.bottom) {
            this.bottomOp();
        }
    }

    private scaleOp(): void {
        let node = this.node;
        tween(node)
            .call(() => {
                this.eOpEventStar();
                node.setScale(0, 0, 0);
            })
            .to(this.useTime, { scale: v3(1, 1, 1) })
            .call(() => {
                this.eOpenEventEnd();
            })
            .start()
            .removeSelf();
    }

    private bottomOp(): void {
        //当前脚本绑定的脚本上，一定要同时绑定了Widget组件
        let widget = this.node.getComponents(Widget)[0];
        widget.bottom = this.starNum;
        tween(widget)
            .call(() => {
                this.eOpEventStar();
            })
            .to(this.useTime, { bottom: this.endNum + this.chaNum })
            .call(() => {
                this.eOpenEventEnd();
            })
            .start()
            .removeSelf();
    }

    private topOp(): void {
        //当前脚本绑定的脚本上，一定要同时绑定了Widget组件
        let widget = this.node.getComponents(Widget)[0];
        widget.top = this.starNum;
        tween(widget)
            .call(() => {
                this.eOpEventStar();
            })
            .to(this.useTime, { top: this.endNum })
            .call(() => {
                this.eOpenEventEnd();
            })
            .start()
            .removeSelf();
    }

    private eOpEventStar(): void {
        EventManager.ins.raiseEvent(eOpEvent.opStart);
    }

    private eOpenEventEnd(): void {
        EventManager.ins.raiseEvent(eOpEvent.opEnd);
    }
}
