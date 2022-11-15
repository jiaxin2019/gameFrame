
import { _decorator, Component, Node, SystemEventType, EventTouch, Graphics, Color, UITransform, v3, color, Sprite } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Test')
export class Test extends Component {
    @property({
        type: Graphics
    })
    ctx: Graphics = null!;


    // start() {
    //     this.creatPoint();
    //     this.node.on(SystemEventType.TOUCH_START, this.onMouse, this);
    //     this.node.on(SystemEventType.TOUCH_MOVE, this.onMouse, this);
    //     this.node.on(SystemEventType.TOUCH_END, this.onMouseEnd, this);
    // }

    onEnable(): void {

    }

    onLoad() {
        // 设置线条宽度
        this.ctx.lineWidth = 5;
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(100, 100);
        // this.ctx.strokeColor = Color.RED;
        // this.ctx.fillColor = Color.RED;
        // 路径起点为0,0
        // 路径画线到（100,100）
        // 路径看不见！！！
        // 把路径画实，能看见啦！
        this.ctx.stroke();
    }
    start() {
        let sf = this;
        let ui = this.node.getComponent(UITransform) || null!;

        // 手指触摸开始,移动起点到触摸点
        this.node.on(SystemEventType.TOUCH_START, function (touch: EventTouch) {
            var t_pos = touch.getLocation();
            let posv = v3(t_pos.x, t_pos.y, 0);
            var pos = ui.convertToNodeSpaceAR(posv);
            sf.ctx.moveTo(pos.x, pos.y);
            sf.ctx.stroke();
            sf.ctx.fill();
        }, this);
        // 手指移动，不断绘图
        this.node.on(SystemEventType.TOUCH_MOVE, function (touch: EventTouch) {
            var t_pos = touch.getLocation();
            let posv = v3(t_pos.x, t_pos.y, 0);
            var pos = ui.convertToNodeSpaceAR(posv);
            sf.ctx.lineTo(pos.x, pos.y);
            sf.ctx.stroke();
            sf.ctx.fill();
        }, this);
    }
    private onMouse(event: EventTouch): void {
        let touch = event.touch;

    }

    private onMouseEnd(): void {

    }

    // private creatPoint(): void {
    //     let sf = this;
    //     // sf.ctx.clear();
    //     sf.ctx.circle(200, 200, 60);
    //     sf.ctx.fillColor = Color.RED;
    //     sf.ctx.strokeColor = Color.RED;
    //     sf.ctx.fill();
    // }


    private creatPoint(): void {
        let sf = this;
        // self.ctx.clear();
        sf.ctx.circle(200, 200, 60);
        sf.ctx.fillColor = Color.RED;
        sf.ctx.strokeColor = Color.RED;
        sf.ctx.fill();
    }
}

