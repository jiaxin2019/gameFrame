import { ModalOpacity } from "./config/SysDefine";
import { ModalType } from "./Struct";
import UIBase from "./UIBase";

export class UIWindow extends UIBase {
    modalType = new ModalType(ModalOpacity.OpacityFull);
}