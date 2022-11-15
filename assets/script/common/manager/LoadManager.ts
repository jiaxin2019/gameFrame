
import { _decorator, Component, Node, assetManager, Sprite, SpriteFrame, ImageAsset, resources, Prefab, instantiate, director } from 'cc';
const { ccclass, property } = _decorator;

export class LoadManager {
    /**
     * 获取远程单个配置图片
     * @param sprUrl 图片地址
     * @param spr 精灵组件
    */
    static loadRemote(sprUrl: string, spr: Sprite): Sprite {
        assetManager.loadRemote(sprUrl, { ext: '.png' }, (err: Error | null, asset: ImageAsset) => {
            if (err) {
                console.warn(err);
                return;
            }
            let spriteFrame = new SpriteFrame();
            spriteFrame.texture = asset._texture;
            spr.spriteFrame = spriteFrame;
        })
        return spr;
    }

    /**
       * 获取resources下的prefab 可以反复复制预制体并反复添加到父显示
       * @param preUrl prefab 在resources文件下的路径
       * @param node 生成的prefab需要添加的节点，没有的传的话默认添加到当前场景的canvas节点上
       */
    static async loadPrefab(preUrl: string, node?: Node): Promise<Node> {
        return new Promise((resolve, reject) => {
            resources.load(preUrl, Prefab, function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                let newPrefab = instantiate(prefab);
                if (node) {
                    node.addChild(newPrefab);
                }
                else {
                    let scene = director.getScene();
                    let canvas = scene?.getChildByName("Canvas");
                    canvas?.addChild(newPrefab);
                }
                resolve(newPrefab);
            })
        })
    }

    /**
     * 获取resources下的prefab 只会复制一次预制体并只会添加一次到父节点
    * @param preUrl prefab 在resources文件下的路径
    * @param node 生成的prefab需要添加的节点，没有的传的话默认添加到当前场景的canvas节点上
    * 使用案例： LoadManager.loadPrefabOnce('prefab/FootBallLoseView').then((view) => {
    *      let loseView = view;
    *      let ts = loseView.getComponent("FootBallLoseView");
    * }); 
     */
    static async loadPrefabOnce(preUrl: string, node?: Node): Promise<Node> {
        return new Promise((resolve, reject) => {
            resources.load(preUrl, Prefab, function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }
                let name = prefab.data.name;
                if (node) {
                    let child = node.getChildByName(name);
                    if (!child) {
                        let newPrefab = instantiate(prefab);
                        node.addChild(newPrefab);
                        resolve(newPrefab);
                    }
                    else {
                        child.active = true;
                        resolve(child);
                    }
                }
                else {
                    let scene = director.getScene();
                    let canvas = scene?.getChildByName("Canvas");
                    let canChild = canvas?.getChildByName(name);
                    if (!canChild) {
                        let newPrefab = instantiate(prefab);
                        canvas?.addChild(newPrefab);
                        resolve(newPrefab);
                    }
                    else {
                        canChild.active = true;
                        resolve(canChild as unknown as Node);
                    }
                }
            })
        })
    }

}
