import { Animation, AnimationClip, Asset, assetManager, AssetManager, builtinResMgr, Camera, Canvas, error, Game, game, Node, rect, Rect, RenderTexture, resources, tween, Tween, TweenAction, UITransform } from "cc";
export class LoadProgress {
    public url: string = null!;
    public completedCount: number = null!;
    public totalCount: number = 0;
    public item: any;
    public cb?: Function;
}
/** 一些 cocos api的封装，promise函数统一加上sync后缀 */
export default class CocosHelper {
    public static async callInNextTick() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 0)
        })
    }

    /** 加载进度 */
    public static loadProgress = new LoadProgress();

    /** 等待时间，秒为单位
     * @param timeout:秒
     */
    public static sleepSync(timeout: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, timeout * 1000);
        })
    }

    /** sync 异步tween
    * @param target 目标节点
    * @param repeat 循环次数： -1 表示无限循环，
    * @param tween 缓动步骤集合
    */
    public static async runRepeatTweenSync(target: any, repeat: number, ...tweens: Tween<any>[]) {
        return new Promise((resolve, reject) => {
            let selfTween = tween(target);
            for (let tmpTween of tweens) {
                selfTween = selfTween.then(tmpTween);
            }
            if (repeat < 0) {
                tween(target).repeatForever(selfTween).start();
            } else {
                tween(target).repeat(repeat, selfTween).call(() => {
                    resolve(true);
                }).start();
            }
        })
    }

    /** 同步tween
     * @param target 目标节点
     * @param tween 缓动步骤集合
     */
    public static async runTweenSync(target: any, ...tweens: Tween<any>[]): Promise<void> {
        return new Promise((resolve, reject) => {
            let selfTween = tween(target);
            for (let tmpTween of tweens) {
                selfTween = selfTween.then(tmpTween);
            }

            selfTween.call(() => {
                resolve();
            }).start();
        })
    }

    /** 停止tween */
    public stopTween(target: any) {
        Tween.stopAllByTarget(target);
    }

    public stopTweenTag(tag: number): void {
        Tween.stopAllByTag(tag);
    }

    /** 同步的动画 */
    public static async runAnimSync(node: Node, animName?: string | number) {
        let anim = node.getComponent(Animation) as Animation;
        if (!anim) return;
        let clip: AnimationClip = null!;
        if (!animName) clip = anim.defaultClip!;
        else {
            let clips = anim?.clips;
            if (typeof animName == "number") {
                clip = clips[animName]!;
            } else if (typeof (animName) === "string") {
                for (let i = 0; i < clips.length; i++) {
                    if (clips[i]?.name === animName) {
                        clip = clips[i]!;
                        break;
                    }
                }
            }
        }
        if (!clip) return;
        await CocosHelper.sleepSync(clip.duration);
    }

    /** 加载资源异常时抛出错误 */
    public static loadResThrowErrorSync<T>(url: string, type: typeof Asset, onProgress?: (completedCount: number, totalCount: number, item: any) => void): Promise<T> {
        return null!;
    }

    private static loadingMap: { [key: string]: Function[] } = {};
    public static loadRes<T>(url: string, type: typeof Asset, callback: Function) {
        if (this.loadingMap[url]) {
            this.loadingMap[url].push(callback);
        }
        this.loadingMap[url] = [callback];
        this.loadResSync<T>(url, type).then((data: any) => {
            let arr = this.loadingMap[url];
            for (let func of arr) {
                func(data);
            }
            this.loadingMap[url] = null!;
            delete this.loadingMap[url];
        });
    }

    /** 加载资源 */
    public static loadResSync<T>(url: string, type: typeof Asset, onProgress?: (completeCount: number, totalCount: number, item: any) => void): Promise<T> {
        return new Promise((resolve, reject) => {
            if (!onProgress) {
                onProgress = this.onProgress;
            }
            resources.load(url, type, onProgress, (err, asset: any) => {
                if (err) {
                    error(`${url}[资源加载]错误${err}`);
                    resolve(null!);
                    return;
                }
                else {
                    resolve(asset as T);
                }
            })
        })
    }

    /** 
     * 加载进度
     * cb方法 其实目的是可以将loader方法的progress
     */
    private static onProgress(completedCount: number, totalCount: number, item: any) {
        CocosHelper.loadProgress.completedCount = completedCount;
        CocosHelper.loadProgress.totalCount = totalCount;
        CocosHelper.loadProgress.item = item;
        CocosHelper.loadProgress.cb && CocosHelper.loadProgress.cb(completedCount, totalCount, item);
    }

    /**
     * 寻找子节点
     */
    public static findChildNode(nodeName: string, rootNode: Node): Node {
        if (rootNode.name == nodeName) {
            return rootNode;
        }

        for (let i = 0; i < rootNode.children.length; i++) {
            let node = this.findChildNode(nodeName, rootNode.children[i]);
            if (node) {
                return node;
            }
        }
        return null!;
    }

    /**
    * 获取component的类名
    */
    public static getComponentName(com: Function) {
        let arr = com.name.match(/<.*>$/);
        if (arr && arr.length > 0) {
            return arr[0].slice(1, -1);
        }
        return com.name;
    }

    /**
    * 加载bundle
    */
    public static loadBundleSync(url: string, options: any): Promise<AssetManager.Bundle> {
        return new Promise((resolve, reject) => {
            assetManager.loadBundle(url, options, (err: Error | null, bundle: AssetManager.Bundle) => {
                if (!err) {
                    error(`加载bundle失败，url：${url},err:${err}`);
                    resolve(null!);
                } else {
                    resolve(bundle);
                }
            })
        })
    }

    /** 路径是相对分包文件夹路径的相对路径 */
    public static loadAssetFromBundleSync(bundleName: string, url: string[]) {
        let bundle = assetManager.getBundle(bundleName);
        if (!bundle) {
            error(`加载bundle中的资源失败，未找到bundle，bundleUrl：${bundleName}`);
            return null;
        }
        return new Promise((resolve, reject) => {
            bundle?.load(url, (err, asset: Asset | Asset[]) => {
                if (!err) {
                    error(`加载bundle中的资源失败，未找到asset，url：${url},err:${err}`);
                    resolve(null!);
                } else {
                    resolve(Asset);
                }
            });
        })
    }

    /** 通过路径加载资源, 如果这个资源在bundle内, 会先加载bundle, 在解开bundle获得对应的资源 */
    public static loadAssetSync(url: string[]) {
        return new Promise((resolve, reject) => {
            resources.load(url, (err, assets: Asset | Asset[]) => {
                if (!err) {
                    error(`加载asset失败, url:${url}, err: ${err}`);
                    resolve(null);
                } else {
                    this.addRef(assets);
                    resolve(assets);
                }
            });
        });
    }

    /** 释放资源 */
    public static releaseAsset(assets: Asset | Asset[]) {
        this.decRes(assets);
    }

    /** 增加引用计数 */
    private static addRef(assets: Asset | Asset[]) {
        if (assets instanceof Array) {
            for (const a of assets) {
                a.addRef();
            }
        } else {
            assets.addRef();
        }
    }

    /** 减少引用计数, 当引用计数减少到0时,会自动销毁 */
    private static decRes(assets: Asset | Asset[]) {
        if (assets instanceof Array) {
            for (const a of assets) {
                a.decRef();
            }
        } else {
            assets.decRef();
        }
    }

    // /** 截图 */
    // public static captureScreen(camera: Camera, prop?: Node | Rect) {
    //     let newTexture = new RenderTexture();
    //     let oldTexture = camera.targetTexture;
    //     let rect: Rect = new Rect(0, 0, game.canvas?.width, game.canvas?.width);
    //     if (prop) {
    //         if (prop instanceof Node) {
    //             rect = prop?.getComponent(UITransform)?.getBoundingBoxToWorld()!;
    //         } else {
    //             rect = prop;
    //         }
    //     }
    //     newTexture.initWithSize(game.canvas?.width, game.canvas?.width, game._renderContext.STENCIL_INDEX8);
    //     camera.targetTexture = newTexture;
    //     camera.render();
    //     camera.targetTexture = oldTexture;

    //     let buffer = new ArrayBuffer(rect.width * rect.height * 4);
    //     let data = new Uint8Array(buffer);
    //     newTexture.readPixels(data, rect.x, rect.y, rect.width, rect.height);
    //     return data;
    // }
}