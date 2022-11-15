
export default class Singleton {
    public constructor() {

    }
    /**
     * 获取一个单例
     * @return {any}
    */
    static ins(...args: any[]): any {
        var o: any = this;
        return o._ins || (o._ins = new o(...args));
    }
}
