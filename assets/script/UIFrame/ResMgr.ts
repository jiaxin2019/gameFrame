import { Asset, assetManager, js, Prefab, Texture2D, url } from "cc";
import CocosHelper from "./CocosHelper";

/**
 * 资源加载，针对的是Form
 * 资源类型：
 *  1）编辑器上拖拽的资源，这里成为静态资源
 *  2）loader 加载的资源，这里成动态资源
 * 
 * 静态资源：
 *  1、加载，在prefab加载时，cocos会将其依赖的图片一起加载，所以不需要我们担心
 *  2、释放，这里采用引用计数，只需要destoryForm即可
 * 
 * 加载一个窗体
 *  第一步，加载prefab，第二步，实例化， 获得node
 * 所以销毁是，先销毁node，再销毁prefab
 * 
 * */
export default class ResMgr {
    //穿件单例
    private static instance: ResMgr = null!;
    public static get inst() {
        if (!this.instance) {
            this.instance = new ResMgr();
        }
        return this.instance;
    }

    /** 采用计数管理办法，管理form所依赖的资源*/
    private preDeps: { [key: string]: Array<string> } = js.createMap();
    private dyNaTags: { [key: string]: Array<string> } = js.createMap();

    private tmpAssetsDepends: string[] = [];                                    //临时缓存
    private assetsReference: { [key: string]: number } = js.createMap();        //资源引用计数
    private prefab: { [key: string]: Prefab } = js.createMap();                 //预制体缓存

    /** 加载窗体 */
    public async loadFormPrefab(fid: string) {
        if (this.prefab[fid]) return this.prefab[fid];
        let { res, deps } = await this.loadResWithReference<Prefab>(fid, Prefab) as any;
        this.preDeps[fid] = deps;
        this.prefab[fid] = res;
        return res;
    }

    /** 销毁窗体 */
    public destoryFormPrefab(fid: string) {
        if (this.prefab[fid]) {
            this.prefab[fid].destroy();
            this.prefab[fid] = null!;
            delete this.prefab[fid];
        }
        //销毁依赖资源
        this.destoryResWithReference(this.preDeps[fid]);

        //删除缓存
        this.preDeps[fid] = null!;
        delete this.preDeps[fid];
    }

    /** 动态资源管理，通过Tag标记当前资源，同意释放 */
    public async loadDynamicRes<T>(url: string, type: typeof Asset, tag: string) {
        let { res, deps } = await this.loadResWithReference<T>(url, type) as any;
        if (!this.dyNaTags[tag]) {
            this.dyNaTags[tag] = [];
        }
        this.dyNaTags[tag].push(...deps);
        return res;
    }

    /** 销毁动态资源 */
    public destoryDynamicRes(tag: string) {
        if (!this.dyNaTags[tag]) {
            return false;
        }

        this.destoryResWithReference(this.dyNaTags[tag]);

        this.dyNaTags[tag] = null!;
        delete this.dyNaTags[tag];
        return true;
    }

    /** 计算当前纹理数量和缓存 */
    public computeTextureCache() {
        let cache = assetManager.assets;
        let totalTextureSize = 0;
        let count = 0;
        cache.forEach((item: Asset, key: string) => {
            let type = (item && item as any["__classname__"]) ? item as any["__classname__"] : "";
            if (type == "cc.Texture2D" || type == "Texture2D") {
                let texture = item as Texture2D;
                //纹理内存计算公式
                let textureSize = texture.width * texture.height * ((texture as any["_native"] === ".jpg" ? 3 : 4) / 1024 / 1024);
                //debugger
                totalTextureSize += textureSize;
                count++;
            }
        });
        return `缓存 [纹理总数：${count}][纹理缓存：${totalTextureSize.toFixed(2)}M]`
    }

    /** 引用销毁，资源销毁 */
    private destoryResWithReference(deps: string[]): boolean {
        let toDeletes = this.removeAssetsDepends(deps);
        this.destoryAssets(toDeletes);
        return true;
    }

    private destoryAssets(urls: string[]) {
        for (let item of urls) {
            this.destoryAsset(item);
        }
    }

    /** 删除资源 */
    private destoryAsset(url: string): void {
        if (this.checkIsBuiltinAssets(url)) return;
        assetManager.assets.remove(url);
        let asset = assetManager.assets.get(url);
        asset && asset.destroy();
        assetManager.dependUtil["remove"](url);
    }

    /** 删除资源 计数 */
    private removeAssetsDepends(deps: string[]): string[] {
        let deletes: string[] = [];
        for (let s of deps) {
            if (!this.assetsReference[s] || this.assetsReference[s] === 0) continue;
            this.assetsReference[s]--;
            if (this.assetsReference[s] === 0) {
                deletes.push(s);
                delete this.assetsReference[s];         //删除key
            }
        }
        return deletes;
    }

    /** 加载资源并添加引用计数 */
    private async loadResWithReference<T>(url: string, type: typeof Asset) {
        let res = await CocosHelper.loadResSync<T>(url, type, this.addTmpAssetsDepends.bind(this)) as any;
        this.clearTmpAssetsDepends();
        if (!res) {
            return null;
        }
        let deps = assetManager.dependUtil.getDepsRecursively(res['_uuid']) || [];
        deps.push(res["_uuid"]);
        this.addAssetsDepends(deps);
        return {
            res,
            deps
        }
    }

    /** 临时添加资源计数 */
    private addTmpAssetsDepends(completeCount: number, totalCount: number, item: any) {
        let deps = (assetManager.dependUtil.getDepsRecursively(item.uuid) || []);
        deps.push(item.uuid);
        this.addAssetsDepends(deps);

        this.tmpAssetsDepends.push(...deps);
    }

    /** 删除临时添加计数 */
    private clearTmpAssetsDepends(): void {
        for (let s of this.tmpAssetsDepends) {
            if (!this.assetsReference[s] || this.assetsReference[s] === 0) continue;
            this.assetsReference[s]--;
            if (this.assetsReference[s] === 0) {
                delete this.assetsReference[s];           // 这里不清理缓存
            }
        }
        this.tmpAssetsDepends = [];
    }

    /** 添加资源计数 */
    private addAssetsDepends(deps: Array<string>) {
        for (let s of deps) {
            if (this.checkIsBuiltinAssets(s)) continue;
            if (this.assetsReference[s]) {
                this.assetsReference[s] += 1;
            } else {
                this.assetsReference[s] = 1;
            }
        }
    }

    /** 检查是否是builtin内的资源 */
    private checkIsBuiltinAssets(url: string) {
        let asset = assetManager.assets.get(url);
        if (asset && asset['_name'].indexOf("builtin") != -1) {
            return true;
        }
        return false;
    }
}