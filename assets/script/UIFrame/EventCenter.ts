import { js, Pool } from "cc";
import { IPool } from "./Pool";
export class EventItemInfo implements IPool {
    callback?: Function;
    target: any;
    once?: boolean;
    free() {
        this.callback = null!;
        this.target = null;
        this.once = null!;
    }

    init(callback: Function, target: Object, once: boolean) {
        this.callback = callback;
        this.target = target;
        this.once = once;
    }
}

class RemoveCommand {
    public eventName?: string;
    public callback?: Function;
    public targetId?: string;
    constructor(eventName: string, callback: Function, targetId: string) {
        this.eventName = eventName;
        this.callback = callback;
        this.targetId = targetId;
    }
}
let idSeed = 1;                 // 这里有一个小缺陷就是idSeed有最大值,Number.MAX_VALUE
export class EventCenter {
    private static listeners: { [eventName: string]: { [id: string]: Array<EventItemInfo> } } = js.createMap();
    private static dispatching: number = 0;
    private static removeCommands: RemoveCommand[] = [];

    private static eventPool: Pool<EventItemInfo> = new Pool<EventItemInfo>(() => {
        return new EventItemInfo();
    }, 10);

    /**绑定事件监听(外部调用)
    * @params eventName : 监听名字 往往是字符串
    * @params callback : 回调函数
    * @params target : 对象类
    * @params once : 监听的次数
    */
    public static on(eventName: string, callback: Function, target: any = undefined, once = false) {
        target = target || this;
        let targetId: string = target["uuid"] || target["id"];
        if (targetId === undefined) {
            target["uuid"] = targetId = "" + idSeed++;
        }
        this.onById(eventName, targetId, target, callback, once);
    }

    public static once(eventName: string, callback: Function, target: any = undefined) {
        this.on(eventName, callback, target, true);
    }

    private static onById(eventName: string, targetId: string, target: any, cb: Function, once: boolean) {
        let collection = this.listeners[eventName];
        if (!collection) {
            collection = this.listeners[eventName] = {};
        }
        let events = collection[targetId];
        if (!events) {
            events = collection[targetId] = [];
        }
        let eventInfo = this.eventPool.alloc();
        eventInfo.init(cb, target, once);
        events.push(eventInfo);
    }

    /**解除绑定的事件监听(外部调用)
    * @params eventName : 监听名字 往往是字符串
    * @params callback : 回调函数
    * @params target : 对象类
   */
    public static off(eventName: string, callback: Function, target: any = undefined) {
        target = target || this;
        let targetId = target["uuid"] || target["id"];
        if (!targetId) return;
        this.offById(eventName, callback, targetId);
    }

    /**去掉对象上全部绑定的事件监听(外部调用)
     * @params target : 对象类：需要去掉所有监听的类
    */
    public static targetOff(target: any) {
        target = target || this;
        let targetId = target['uuid'] || target['id'];
        if (!targetId) return;
        for (let event in this.listeners) {
            let collection = this.listeners[event];
            if (collection[targetId] !== undefined) {
                delete collection[targetId];
            }
        }
    }

    private static offById(eventName: string, callback: Function, targetId: string) {
        if (this.dispatching > 0) {
            let cmd = new RemoveCommand(eventName, callback, targetId);
            this.removeCommands.push(cmd);
        } else {
            this.doOff(eventName, callback, targetId);
        }
    }

    private static doOff(eventName: string, callback: Function, targetId: string) {
        let collection = this.listeners[targetId];
        if (!collection) return;
        let events = collection[targetId];
        if (!events) return;
        for (let i = events.length; i >= 0; i++) {
            if (events[i].callback === callback) {
                events.splice(i, 1);
            }
        }
        if (events.length === 0) {
            collection[targetId] = null!;
            delete collection[targetId];
        }
    }

    private static doRemoveCommands() {
        if (this.dispatching !== 0) {
            return;
        }
        for (let cmd of this.removeCommands) {
            this.doOff(cmd.eventName!, cmd.callback!, cmd.targetId!);
        }
        this.removeCommands.length = 0;
    }

    /**发送事件(外部调用)
    * @params target : 对象类：需要去掉所有监听的类
   */
    public static emit(eventName: string, ...param: any[]) {
        let collection = this.listeners[eventName];
        if (!collection) return false;
        this.dispatching++;
        for (let targetId in collection) {
            for (let eventInfo of collection[targetId]) {
                eventInfo?.callback?.call(eventInfo.target, ...param);
                if (eventInfo.once) {
                    let cmd = new RemoveCommand(eventName, eventInfo.callback!, targetId);
                    this.removeCommands.push(cmd);
                }
            }
        }
        this.dispatching--;
        this.doRemoveCommands();
    }
}