import { DEBUG } from "cc/env";

/*
*   事件管理器，事件的监听、触发、移除
*   
*   2021/4/20 jiaxin
*/
export type EventMaCallFunc = (eventName: string, eventData: any) => void;

interface CallBackTarget {
    callBack: EventMaCallFunc,
    target: any,
}

export class EventManager {
    private static _ins: EventManager = null!;
    public static get ins(): EventManager {
        if (!this._ins) {
            this._ins = new EventManager();
        }
        return this._ins;
    }

    public static destroy(): void {
        if (this._ins) {
            this._ins = null!;
        }
    }

    private constructor() {
    }

    private _eventListeners: { [key: string]: CallBackTarget[] } = {};

    private getEventListenersIndex(eventName: string, callBack: EventMaCallFunc, target?: any): number {
        let index = -1;
        for (let i = 0; i < this._eventListeners[eventName].length; i++) {
            let iterator = this._eventListeners[eventName][i];
            if (iterator.callBack == callBack && (!target || iterator.target == target)) {
                index = i;
                break;
            }
        }
        return index;
    }

    /**添加监听（会做所有不重复的事件监听）
     * @param eventName 事件名字
     * @param callBack 事件回调函数
     * @param target 目标类
     * */
    on(eventName: string, callBack: EventMaCallFunc, target?: any): boolean {
        if (!eventName) {
            DEBUG && console.error("eventName is empty" + eventName);
            return false;
        }

        if (null == callBack) {
            DEBUG && console.error('addEventListener callBack is nil');
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        if (null == this._eventListeners[eventName]) {
            this._eventListeners[eventName] = [callTarget];

        } else {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 == index) {
                this._eventListeners[eventName].push(callTarget);
            }
        }

        return true;
    }

    /**添加监听（会替换原有的事件监听）
     * @param eventName 事件名字
     * @param callBack 事件回调函数
     * @param target 目标类
     * */
    onReplace(eventName: string, callBack: EventMaCallFunc, target?: any): boolean {
        if (!eventName) {
            DEBUG && console.error("eventName is empty" + eventName);
            return false;
        }

        if (null == callBack) {
            DEBUG && console.error('setEventListener callBack is nil');
            return false;
        }
        let callTarget: CallBackTarget = { callBack: callBack, target: target };
        this._eventListeners[eventName] = [callTarget];
        return true;
    }

    /**移除监听
     * @param eventName 事件名字
     * @param callBack 事件回调函数
     * @param target 目标类
     * */
    of(eventName: string, callBack: EventMaCallFunc, target?: any) {
        if (null != this._eventListeners[eventName]) {
            let index = this.getEventListenersIndex(eventName, callBack, target);
            if (-1 != index) {
                this._eventListeners[eventName].splice(index, 1);
            }
        }
    }

    /**提高监听条件
     * @param eventName 事件名字
     * @param eventData 事件回调参数
     * */
    raiseEvent(eventName: string, eventData?: any) {
        DEBUG && console.log(`==================== raiseEvent ${eventName} begin | ${JSON.stringify(eventData)}`);
        if (null != this._eventListeners[eventName]) {
            // 将所有回调提取出来，再调用，避免调用回调的时候操作了事件的删除
            let callbackList: CallBackTarget[] = [];
            for (const iterator of this._eventListeners[eventName]) {
                callbackList.push({ callBack: iterator.callBack, target: iterator.target });
            }
            for (const iterator of callbackList) {
                iterator.callBack.call(iterator.target, eventName, eventData);
            }
        }
        DEBUG && console.log(`==================== raiseEvent ${eventName} end`);
    }
}
