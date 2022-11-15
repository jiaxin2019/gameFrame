import { resources } from "cc";
import PriorityQueue from "../common/PriorityQueue";
import PriorityStack from "../common/PriorityStack";
import { EPriority, IFormData } from "./Struct";
import UIManager from "./UIManager";

export default class WindowMgr {
    //窗体
    private static showingList: PriorityStack<string> = new PriorityStack();
    private static waitingList: PriorityQueue<WindowData> = new PriorityQueue();

    private static _currWindow: number = -1;
    public static get currWindow() {
        return this._currWindow;
    }

    public static getWindows() {
        return this.showingList.getElements();
    }

    /**打开窗体*/
    public static async open(prefabPath: string, params?: any, formData?: IFormData) {
        formData = this.formatFormData(formData);
        if (this.showingList.size <= 0 || (!formData?.showWait && formData?.priority! >= this.showingList.getTopEPriority())) {
            this.showingList.push(prefabPath, formData?.priority);
            this._currWindow = this.showingList.getTopEPriority();
            return await UIManager.getInstance().openForm(prefabPath, params, formData);
        }

        //入等待列队
        this.waitingList.enqueue({ prefabPath, params, formData });
        //加载窗体
        return await UIManager.getInstance().loadUIForm(prefabPath);
    }


    public static async close(prefabPath: string) {
        let result = this.showingList.remove(prefabPath);
        if (!result) return false;

        await UIManager.getInstance().closeForm(prefabPath);
        if (this.showingList.size <= 0 && this, this.waitingList.size > 0) {
            let windowData = this.waitingList.dequeue();
            windowData && this.open(windowData?.prefabPath!, windowData?.params, windowData?.formData);
        }
        return true;
    }

    public static async closeAll() {
        this.waitingList.clear();
        for (let fid of this.showingList.getElements()) {
            await UIManager.getInstance().closeForm(fid);
        }
        this.showingList.clear();
        return true;
    }

    private static formatFormData(formData: any) {
        return Object.assign({ showWait: false, priority: EPriority.FIVE }, formData);
    }
}

class WindowData {
    prefabPath?: string;
    params?: any;
    formData?: any;
}
