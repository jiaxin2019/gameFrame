import { IFormData } from "./Struct";
import UIManager from "./UIManager";

export default class TipsMgr {
    public static async open(url: string, params?: any, formData?: IFormData) {
        return await UIManager.getInstance().openForm(url, params, formData);
    }
    public static async close(url: string) {
        return await UIManager.getInstance().closeForm(url);
    }
}