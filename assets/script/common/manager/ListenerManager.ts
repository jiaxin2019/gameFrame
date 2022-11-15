import Singleton from "../base/Singleton"
export const enum ListenerType {
    NetHttpComplete = "NetHttpComplete"
}
export class ListenerManager extends Singleton {
    private dict: any;
    private eVec: Array<MessageVo>;
    private lastRunTime: number;
    private type: number;
    static ins: (...args: any[]) => ListenerManager;
    /**
     * 构造函数
     * @param type 0:使用分帧处理 1：及时执行
    */
    public constructor(type: number) {
        super();
        this.type = type;
        this.dict = {};
        this.eVec = new Array<MessageVo>();
        this.lastRunTime = 0;
        if (this.type == 0) {
            // TimerMgr.doFrame(1, 0, this.run, this);
        }
    }

    /**
     * 清空处理
    */
    public clear(): void {
        this.dict = {};
        this.eVec.splice(0);
    }

    /**
     * 添加消息监听
     * @param type 消息的唯一标识
     * @param listener 监听函数
     * @param listenerObj 监听函数所属的对象
     * 
    */
    public add(type: string, listener: Function, listenerObj: any): void {

    }

    /**
     * 移除消息监听
     * @param type 消息的唯一标识
     * @param listener 监听函数
     * @param listenerObj 监听函数所属的对象
     * 
    */
    public remove(type: string, listener: Function, listenerObj: any): void {

    }

    /**
     * 移除某一对象的所有消息监听
     * @param listenerObj 监听函数所属的对象
     * 
    */
    public removeAll(listenerObj: any): void {

    }

    /**
     * 出发消息
     * @param type 消息的唯一标识
     * @param param 消息参数
    */
    public dispatch(type: string, ...param: any[]): void {

    }

    /**运行*/

    private run(): void {

    }

    /**
     * 处理一条消息
     * @param msgVo
    */

    private dealMsg(msgVo: MessageVo): void {

    }

    public trigger(type: string, isSuccess: boolean, data: any, listenerObj: any) {

    }
}


export class MessageVo {
    public type?: string;
    public param?: any[];

    public constructor() {

    }
    public dispose(): void {
        this.type = null!;
        this.param = null!;
    }
}