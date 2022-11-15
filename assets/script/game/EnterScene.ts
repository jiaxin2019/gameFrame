
import { _decorator, Component, Node, game, Game, director, ProgressBar, assetManager } from 'cc';
import UrlManager, { HrefInfo } from '../common/manager/UrlManager';
const { ccclass, property } = _decorator;

@ccclass('EnterScene')
export class EnterScene extends Component {
    @property(ProgressBar)
    procent: ProgressBar = null!;
    private scene?: string;
    start() {
        let sf = this;
        document.addEventListener("visibilitychange", sf.onViewClick);
        game.on(Game.EVENT_SHOW, sf.onViewClick, sf);
        this.changeScence();
    }

    private changeScence(): void {
        let sf = this;
        sf.scene = UrlManager.getHrefInfo(HrefInfo.scene);
        sf.scene = "sceneTiger";
        console.warn("场景：" + sf.scene);
        let url = "http://js.atguat.com.cn/csr/game/tiger/remote/tigerScence";
        assetManager.loadBundle(url, (err, bundle) => {
            if (err) {
                console.warn("抛出远程bundle加载错误：" + err);
                return;
            }
            bundle.loadScene(sf.scene!, sf.onProgress, sf.onEnd.bind(sf));
            // console.warn("加载完成：" + sf.scene);
        });
        //改变现状
        this.changeSth();
    }

    private changeSth(): void {
        for (var i = 0; i < 2; i++) {

            setTimeout(function () { console.log(i) }, 0)

        }

        for (var i = 0; i < 2; i++) {

            (function (i) {

                setTimeout(function () { console.log(i); }, 0)

            }(i))
        }
        function a() { }
        console.warn(typeof a);
        let data = new Date();
        console.warn(data);
        console.warn(Date());
        var msg = 'hello';
        for (var i = 0; i < 10; i++) {
            var msg = 'hello' + i * 2 + i;
        }
        console.warn(msg);
    }

    private onViewClick(): void {
        if (game.isPaused()) {
            //如果还是暂停状态，重新启动游戏，恢复逻辑
            game.resume();
        }
    }

    private onEnd(): void {
        this.scene && director.loadScene(this.scene!), console.warn("加载完成：" + this.scene);
    }

    private onProgress(completedCount: any, totalCount: any, item: any) {
        let perCent = completedCount / totalCount;
        this.procent && (this.procent.progress = perCent);
    }
}


