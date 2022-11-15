import { Component, tween, v3 } from "cc";

let handler_pool: handler[] = [];
let handler_pool_size = 10;

//用于绑定回调函数this指针
export class handler {
    private cb: Function = null!;
    private host: any;
    private args: any[] = [];

    constructor() { }

    init(cb: Function, host = null, ...args: any) {
        this.cb = cb;
        this.host = host;
        this.args = args;
    }

    exec(...extras: any) {
        this.cb.apply(this.host, this.args.concat(extras));
    }
}

export function gen_handler(cb: Function, host: any = null, ...args: any[]): handler {
    let single_handler: handler = handler_pool.length > 0 ? handler_pool.pop()! : new handler();
    //这里要展开args, 否则会将args当数组传给wrapper, 导致其args参数变成2维数组[[]]
    single_handler.init(cb, host, ...args);
    return single_handler;
}

export function strfmt(fmt: string, ...args: any[]) {
    return fmt.replace(/\{(\d+)\}/g, (match: string, argIndex: number) => {
        return args[argIndex] || match;
    });
}

export function extend(target: any, ...sources: any) {
    for (var i = 0; i < sources.length; i += 1) {
        var source = sources[i];
        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
}

//组件脉动
export function createBreathAction(cm: Component, min = 0.9, max = 1.1) {
    let noTw = tween(cm.node);
    noTw.
        repeatForever(noTw.sequence(noTw.to(0.6, { scale: v3(max, max, 0) }), noTw.to(0.6, { scale: v3(min, min, 0) })))
        .start()
        .removeSelf();
}

export function destroyBreathAction(cm: Component) {
    tween(cm.node).stop();
}

/**震屏震动
 * @param cm 附加节点，一般为自定义的某个类
 * @param func 回调函数
 * @param thisObj 回调函数指向的类
 * @param args 参数
 * 
*/
export function createShockEff(cm: Component, func: Function = null!, thisObj: any = null, args: any = null) {
    let x = cm.node.position.x;
    let y = cm.node.position.y;
    tween(cm.node)
        // .call(() => {
        //     startPeristentVibrate(1000, 6000)
        // })
        .repeat(5,
            tween(cm.node).to(.02, { position: v3(x + 5, y + 7, 0) })
                .to(.02, { position: v3(x - 6, y + 7, 0) })
                .to(.02, { position: v3(x - 13, y + 3, 0) })
                .to(.02, { position: v3(x + 3, y - 6, 0) })
                .to(.02, { position: v3(x - 5, y - 5, 0) })
                .to(.02, { position: v3(x + 2, y - 8, 0) })
                .to(.02, { position: v3(x - 8, y - 10, 0) })
                .to(.02, { position: v3(x + 2, y + 10, 0) })
                .to(.02, { position: v3(x + 0, y + 0, 0) })
        )
        .delay(.02)
        .call(() => {
            func && func.apply(thisObj, args);
            // stopVibrate();
        })
        .start()
        .removeSelf()
}

/**震动一次
 * @param level 1000 震动一次的时间 ，[1000, 200, 1000, 2000, 400] 震动多次
*/
export function startVibrate(level: number) {
    navigator.vibrate(level);
}

var vibrateInterval: number = 0;;
/**持续震动
 * @param level 1000 震动一次的时间
 * @param interval 持续震动的时间
*/
export function startPeristentVibrate(level: number, interval: number) {
    vibrateInterval = setInterval(function () {
        startVibrate(level);
    }, interval);
}
/**停掉震动*/
export function stopVibrate() {
    if (vibrateInterval) {
        clearInterval(vibrateInterval);
        navigator.vibrate(0);
    }
}