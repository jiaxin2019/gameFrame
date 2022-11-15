import { FormType } from "./UIFrame/config/SysDefine";
import { IFormConfig } from "./UIFrame/Struct";

export default class UIConfig {
    static UILoading: IFormConfig = {
        prefabUrl: "Forms/Tips/UILoading",
        type: FormType.Tips
    }
}