
import { _decorator, Component, AssetManager, Node } from 'cc';
const { ccclass, property } = _decorator;

interface PicType {
    png: ".png",
    jpg: ".jpg"
}

@ccclass('ResLoader')
export class ResLoader extends Component {
    private assetManager = new AssetManager();

    /**远程加载图片资源
     * @param remoteUrl string 远程路径 http://unknown.org/someres.png 或者本地资源：/dara/data/some/path/to/image.png
     * @param type PicType 图片类型 http://unknown.org/emoji?id=124982374
     * 
     * */
    public loadImgByUrl(remoteUrl: string, type?: string) {
        if (type) {
            this.assetManager.loadRemote(remoteUrl, { ext: type }, function () {
                // Use texture to create sprite frame
            });
            return;
        }
        this.assetManager.loadRemote(remoteUrl, function (err, texture) {
            // Use texture to create sprite frame
        });
    }

    /**远程加载图片资源
     * @param remoteUrl string 远程路径 http://unknown.org/sound.mp3
     * 
     * */
    public loadAudioByUrl(remoteUrl: string) {
        this.assetManager.loadRemote(remoteUrl, function (err, texture) {
            // play audio clip
        });
    }

      /**远程文本
     * @param remoteUrl string 远程路径 http://unknown.org/skill.txt
     * 
     * */
       public loadTxtByUrl(remoteUrl: string) {
        this.assetManager.loadRemote(remoteUrl, function (err, texture) {
            // use string to do something
        });
    }
}
