import { Director, director, errorID, resources } from "cc";

//全局管理类
export default class GlobalManager {
    constructor() {

    }
    /** 重写引擎方法 添加进度方法 */
    static preloadScene(_This: any, sceneName: string, onLoaded?: Function, onProgress?: Function) {
        let info = resources.getSceneInfo(sceneName);
        if (info) {
            director.emit((<any>Director).EVENT_BEFORE_SCENE_LOADING, sceneName);
            resources.loadScene(sceneName, (completedCount, totalCount, item) => {
                onProgress?.call(_This, completedCount, totalCount);
            }, (error, asset) => {
                if (error) {
                    errorID(1210, sceneName, error.message);
                } else {
                    onLoaded?.call(_This)
                }
            });
        }
    }
}