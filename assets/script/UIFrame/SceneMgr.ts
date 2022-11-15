import { warn } from "cc";
import { SysDefine } from "./config/SysDefine";
import { IFormConfig, IFormData } from "./Struct";
import TipsMgr from "./TipsMgr";
import UIManager from "./UIManager";

const TAG = "SceneMgr";

export default class SceneMgr {
    private static scenes: Array<string> = [];
    private static currScene: string = "";

    public static getCurrScene() {
        return UIManager.getInstance().getForm(this.currScene);
    }

    /** 打开一个场景 */
    public static async open(scenePath: string, params?: any, formData?: IFormData) {
        if (this.currScene == scenePath) {
            warn(TAG, "当前场景和需要open的场景是同一个");
            return null;
        }

        await this.openLoading(formData?.loadingForm!, params, formData!);

        if (this.scenes.length > 0) {
            let currScene = this.scenes[this.scenes.length - 1];
            await UIManager.getInstance().closeForm(currScene);
        }

        let idx = this.scenes.indexOf(scenePath);
        if (idx == -1) {
            this.scenes.push(scenePath);
        } else {
            this.scenes.length = idx + 1;
        }

        this.currScene = scenePath;

        let com = await UIManager.getInstance().openForm(scenePath, params, formData);
        await this.closeLoading(formData?.loadingForm!);
        return com;
    }

    /** 回退一个场景 */
    public static async back(params?: any, formData?: IFormData) {
        if (this.scenes.length <= 1) {
            warn(TAG, "已经是最后一个场景了, 无处可退");
            return;
        }
        await this.openLoading(formData?.loadingForm!, params, formData!);
        let currScene = this.scenes.pop();
        await UIManager.getInstance().closeForm(currScene!);

        this.currScene = this.scenes[this.scenes.length - 1];
        await UIManager.getInstance().openForm(this.currScene, params, formData);
        await this.closeLoading(formData?.loadingForm!);
    }

    public static async close(scenePath: string) {
        let com = UIManager.getInstance().getForm(scenePath);
        if (com) {
            return UIManager.getInstance().closeForm(scenePath);
        }
    }

    private static async openLoading(formConfig: IFormConfig, params: any, formData: IFormData) {
        let form = formConfig || SysDefine.defaultLoadingForm;
        if (!form) return;
        await TipsMgr.open(form.prefabUrl, params, formData);
    }
    private static async closeLoading(formConfig: IFormConfig) {
        let form = formConfig || SysDefine.defaultLoadingForm;
        if (!form) return;
        await TipsMgr.close(form.prefabUrl);
    }
}
