
import { _decorator, Component, Node, AudioClip, resources, systemEvent, AudioSource, assetManager } from 'cc';
const { ccclass, property } = _decorator;
// export enum AudioName {
//     //背景音乐
//     BACK_AUDIO = "back_audio",
//     //踢中栏框
//     FOOTBALL_EDG_AUDIO = "football_edg",
//     //中球
//     FOOTBALLEN_AUDIO = "footballEn_audio",
//     //中球结算
//     GET_REWARD_AUDIO_AUDIO = "get_reward_audio",
//     //踢中人的声音
//     PER_FOOTBALL_AUDIO = "per_football_audio",
//     //踢球的声音
//     PLAYFOOTBALL_AUDIO = "playFootball_audio",
//     //时间倒计时
//     TIMEDOWN_AUDIO = "timeDown_audio",
// }

export enum AudioEventDic {
    //音效实际开始时候发出的事件
    started = "started",
    //音效实际停止时候发出的事件
    ended = "ended"
}

@ccclass('SoundManager')
export class SoundManager extends Component {
    private static _ins: SoundManager = null!;
    /**
     * 获取一个单例
     * @return {any}
     */
    static get ins(): SoundManager {
        SoundManager._ins || (SoundManager._ins = new SoundManager());
        return SoundManager._ins;
    }

    private sound_path: string = 'audio/';
    private sounds: { [key: string]: AudioSource } = {};
    private enabledPlay: boolean = false;
    //背景音效名字
    private _backMusic: string = "";

    public get backMusic(): string {
        return this._backMusic;
    }

    public set backMusic(val) {
        this._backMusic = val;
    }
    //单次播放音效名字
    private fx: string = "";
    private preAudioArr = [];
    /**
     * 预加载声音
     */
    preLoadAudio() {
        let sf = this;
        this.preAudioArr.forEach((audioUrl) => {
            resources.load(sf.sound_path + audioUrl, AudioClip, function (err, clips) {
                if (err) {
                    return;
                }
                let audio = new AudioSource();
                audio.clip = clips;
                audio.loop = true;
                sf.sounds[audioUrl] = audio;
                // sf.sounds[audio].play();
            });
        })
    }

    public loadSounds() {
        let sf = this;
        resources.loadDir(this.sound_path, AudioClip, function (err, clips) {
            if (err) {
                return;
            }
            for (let i = 0; i < clips.length; i++) {
                sf.addSound(clips[i]);
            }
        });
    }

    addSound(clip: AudioClip) {
        let audio = new AudioSource();
        audio.clip = clip;
        let key = clip._nativeUrl;
        this.sounds[key] = audio;
    }

    /**
     * 播放音乐
     * @param fxName 音效的名字
     * @param stopMusic 音效播放的时候，是否停止调背景音乐 true :默认停止音乐
    */
    playFx(fxName: string, stopMusic = true) {
        let sf = this;
        if (!sf.enabledPlay) return;
        if (stopMusic) {
            if (sf.sounds[sf.fx]) {
                sf.sounds[sf.fx].stop();
                // sf.sounds[sf.fx]?.clip?.off(AudioEventDic.ended, sf.onAudioEn, sf);
            }
            sf.stopMusic();
        }
        sf.fx = fxName;
        if (!sf.sounds[fxName]) {
            resources.load(sf.sound_path + fxName, AudioClip, function (err, clips) {
                if (err) {
                    return;
                }
                // clips?.once("ended", sf.onAudioEn, sf);
                let dur = clips?.getDuration();
                sf.unschedule(sf.onAudioEn);
                sf.scheduleOnce(sf.onAudioEn, dur);
                let audio = new AudioSource();
                audio.clip = clips;
                sf.sounds[fxName] = audio;
                sf.sounds[fxName].play();
            });
        } else {
            let audio = sf.sounds[fxName];
            // audio.clip?.once("ended", sf.onAudioEn, sf);
            let dur = audio.clip?.getDuration();
            this.unschedule(this.onAudioEn);
            this.scheduleOnce(this.onAudioEn, dur);
            audio.play();
        }
    }

    /**
     * 播放背景音乐
     * @param musicName 音效的名字 默认AudioName.BACK_AUDIO
     */
    playMusic(musicName: string = this.backMusic) {
        let sf = this;
        sf.backMusic = musicName;
        if (!sf.enabledPlay) return;
        if (!musicName) {
            return;
        }
        if (!sf.sounds[musicName]) {
            assetManager.loadRemote(musicName, AudioClip, (err, clips) => {
                if (err) {
                    return;
                }
                let audio = new AudioSource();
                audio.clip = clips as AudioClip;
                !sf.sounds[musicName] && (sf.sounds[musicName] = audio);
                sf.sounds[musicName].loop = true;
                sf.sounds[musicName].play();
            });
        }
        else {
            sf.sounds[musicName].loop = true;
            sf.sounds[musicName].play();
        }
    }

    //单次音效播放停止时触发事件
    private onAudioEn(): void {
        let sf = this;
        sf.playMusic();
        let audio = sf.sounds[sf.fx];
        audio && audio.clip?.off(AudioEventDic.ended, sf.onAudioEn, sf);
    }

    stopMusic(musicName = this.backMusic) {
        this.sounds[musicName] && this.sounds[musicName].stop();
    }

    setEnabled(enabled: boolean) {
        this.enabledPlay = enabled;
        if (this.enabledPlay) {
            this.playMusic(this.backMusic);
        }
        else {
            let sounds = this.sounds;
            for (let key in sounds) {
                let audio = sounds[key];
                audio.pause();
            }
        }
    }

    getEnable() {
        return this.enabledPlay;
    }

    public loadRemote(audioUrlArr: string[]): void {
        let sf = this;
        audioUrlArr.forEach(audioUr => {
            assetManager.loadRemote(audioUr, AudioClip, (err, clips) => {
                if (err) {
                    console.log(err);
                    return;
                }
                let key = clips._nativeUrl;
                let audio = new AudioSource();
                audio.clip = clips as AudioClip;
                audio.play();
                audio.pause();
                !sf.sounds[key] && (sf.sounds[key] = audio);
            });
        });
    }
}

